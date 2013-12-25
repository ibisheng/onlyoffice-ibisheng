var SERIES_TYPE_SCATTER = 0;
var SERIES_TYPE_AREA = 1;
var SERIES_TYPE_RADAR = 2;
var SERIES_TYPE_BAR = 3;
var SERIES_TYPE_LINE = 4;
var SERIES_TYPE_PIE = 5;
var SERIES_TYPE_SURFACE = 6;
var SERIES_TYPE_BUBBLE = 7;


function CSer()
{
    this.type = null;

    this.idx                 = null;
    this.marker              = null;
    this.order               = null;
    this.smooth              = null;
    this.spPr                = null;
    this.trendline           = null;
    this.tx                  = null;
    this.xVal                = null;
    this.yVal                = null;
    this.cat                 = null;
    this.pictureOptions      = null;
    this.val                 = null;
    this.invertIfNegative    = null;
    this.shape               = null;
    this.explosion           = null;
    this.bubble3D            = null;
    this.bubbleSize          = null;
    this.dLbls               = null;
    this.dPt                 = null;
    this.errBars             = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSer.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Ser;
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


    setType: function(type)
    {
        History.Add(this, {Type: historyitem_Ser_SetType, oldPr: this.type, newPr: type});
        this.type = type;
    },

    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetIdx, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetMarker, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setOrder: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetOrder, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setSmooth: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetSmooth, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetSpPr, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetTrendline, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setTx: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetTx, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setXVal: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetXVal, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setYVal: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetYVal, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setCat: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetCat, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setPictureOptions: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetPictureOptions, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetVal, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setInvertIfNegative: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetInvertIfNegative, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setShape: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetShape, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setExplosion: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetExplosion, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setBubble3D: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetBubble3D, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setBubbleSize: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetBubbleSize, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetDLbls, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setDPt: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetDPt, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },
    setErrBars: function(pr)
    {
        History.Add(this, {Type: historyitem_Ser_SetErrBars, oldPr: this.idx, newPr: pr});
        this.pr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Ser_SetType:
            {
                this.type = data.oldPr;
                break;
            }
            case historyitem_Ser_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_Ser_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_Ser_SetOrder:
            {
                this.order = data.oldPr;
                break;
            }
            case historyitem_Ser_SetSmooth:
            {
                this.smooth = data.oldPr;
                break;
            }
            case historyitem_Ser_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_Ser_SetTrendline:
            {
                this.trendline = data.oldPr;
                break;
            }
            case historyitem_Ser_SetTx:
            {
                this.tx = data.oldPr;
                break;
            }
            case historyitem_Ser_SetXVal:
            {
                this.xVal = data.oldPr;
                break;
            }
            case historyitem_Ser_SetYVal:
            {
                this.yVal = data.oldPr;
                break;
            }
            case historyitem_Ser_SetCat:
            {
                this.cat = data.oldPr;
                break;
            }
            case historyitem_Ser_SetPictureOptions:
            {
                this.pictureOptions = data.oldPr;
                break;
            }
            case historyitem_Ser_SetVal:
            {
                this.val = data.oldPr;
                break;
            }
            case historyitem_Ser_SetInvertIfNegative:
            {
                this.invertIfNegative = data.oldPr;
                break;
            }
            case historyitem_Ser_SetShape:
            {
                this.shape = data.oldPr;
                break;
            }
            case historyitem_Ser_SetExplosion:
            {
                this.explosion = data.oldPr;
                break;
            }
            case historyitem_Ser_SetBubble3D:
            {
                this.bubble3D = data.oldPr;
                break;
            }
            case historyitem_Ser_SetBubbleSize:
            {
                this.bubbleSize = data.oldPr;
                break;
            }
            case historyitem_Ser_SetDLbls:
            {
                this.dLbls = data.oldPr;
                break;
            }
            case historyitem_Ser_SetDPt:
            {
                this.dPt = data.oldPr;
                break;
            }
            case historyitem_Ser_SetErrBars:
            {
                this.errBars = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Ser_SetType:
            {
                this.type = data.newPr;
                break;
            }
            case historyitem_Ser_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_Ser_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_Ser_SetOrder:
            {
                this.order = data.newPr;
                break;
            }
            case historyitem_Ser_SetSmooth:
            {
                this.smooth = data.newPr;
                break;
            }
            case historyitem_Ser_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_Ser_SetTrendline:
            {
                this.trendline = data.newPr;
                break;
            }
            case historyitem_Ser_SetTx:
            {
                this.tx = data.newPr;
                break;
            }
            case historyitem_Ser_SetXVal:
            {
                this.xVal = data.newPr;
                break;
            }
            case historyitem_Ser_SetYVal:
            {
                this.yVal = data.newPr;
                break;
            }
            case historyitem_Ser_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_Ser_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }
            case historyitem_Ser_SetVal:
            {
                this.val = data.newPr;
                break;
            }
            case historyitem_Ser_SetInvertIfNegative:
            {
                this.invertIfNegative = data.newPr;
                break;
            }
            case historyitem_Ser_SetShape:
            {
                this.shape = data.newPr;
                break;
            }
            case historyitem_Ser_SetExplosion:
            {
                this.explosion = data.newPr;
                break;
            }
            case historyitem_Ser_SetBubble3D:
            {
                this.bubble3D = data.newPr;
                break;
            }
            case historyitem_Ser_SetBubbleSize:
            {
                this.bubbleSize = data.newPr;
                break;
            }
            case historyitem_Ser_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_Ser_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_Ser_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Ser_SetType:
            case historyitem_Ser_SetIdx:
            case historyitem_Ser_SetOrder:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_Ser_SetMarker:
            case historyitem_Ser_SetSpPr:
            case historyitem_Ser_SetTx:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_Ser_SetSmooth:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
            case historyitem_Ser_SetTrendline:
            {

                this.trendline = data.newPr;
                break;
            }
            case historyitem_Ser_SetXVal:
            {
                this.xVal = data.newPr;
                break;
            }
            case historyitem_Ser_SetYVal:
            {
                this.yVal = data.newPr;
                break;
            }
            case historyitem_Ser_SetCat:
            {
                this.cat = data.newPr;
                break;
            }
            case historyitem_Ser_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }
            case historyitem_Ser_SetVal:
            {
                this.val = data.newPr;
                break;
            }
            case historyitem_Ser_SetInvertIfNegative:
            {
                this.invertIfNegative = data.newPr;
                break;
            }
            case historyitem_Ser_SetShape:
            {
                this.shape = data.newPr;
                break;
            }
            case historyitem_Ser_SetExplosion:
            {
                this.explosion = data.newPr;
                break;
            }
            case historyitem_Ser_SetBubble3D:
            {
                this.bubble3D = data.newPr;
                break;
            }
            case historyitem_Ser_SetBubbleSize:
            {
                this.bubbleSize = data.newPr;
                break;
            }
            case historyitem_Ser_SetDLbls:
            {
                this.dLbls = data.newPr;
                break;
            }
            case historyitem_Ser_SetDPt:
            {
                this.dPt = data.newPr;
                break;
            }
            case historyitem_Ser_SetErrBars:
            {
                this.errBars = data.newPr;
                break;
            }
        }
    },

    Load_Changes: function(r)
    {}
};