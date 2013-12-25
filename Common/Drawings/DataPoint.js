function CDPt()
{
    this.bubble3D         = null;
    this.explosion        = null;
    this.idx              = null;
    this.invertIfNegative = null;
    this.marker           = null;
    this.pictureOptions   = null;
    this.spPr             = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDPt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_DPt;
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

    setBubble3D: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetBubble3D, oldPr: this.bubble3D, newPr: pr});
        this.bubble3D = pr;
    },

    setExplosion: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetExplosion, oldPr: this.explosion, newPr: pr});
        this.explosion = pr;
    },

    setIdx: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetIdx, oldPr: this.idx, newPr: pr});
        this.idx = pr;
    },

    setInvertIfNegative: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetInvertIfNegative, oldPr: this.invertIfNegative, newPr: pr});
        this.invertIfNegative = pr;
    },

    setMarker: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetMarker, oldPr: this.marker, newPr: pr});
        this.marker = pr;
    },

    setPictureOptions: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetPictureOptions, oldPr: this.pictureOptions, newPr: pr});
        this.pictureOptions = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_DPt_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_DPt_SetBubble3D:
            {
                this.bubble3D = data.oldPr;
                break;
            }
            case historyitem_DPt_SetExplosion:
            {
                this.explosion = data.oldPr;
                break;
            }
            case historyitem_DPt_SetIdx:
            {
                this.idx = data.oldPr;
                break;
            }
            case historyitem_DPt_SetInvertIfNegative:
            {
                this.invertIfNegative = data.oldPr;
                break;
            }
            case historyitem_DPt_SetMarker:
            {
                this.marker = data.oldPr;
                break;
            }
            case historyitem_DPt_SetPictureOptions:
            {
                this.pictureOptions = data.oldPr;
                break;
            }
            case historyitem_DPt_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_DPt_SetBubble3D:
            {
                this.bubble3D = data.newPr;
                break;
            }
            case historyitem_DPt_SetExplosion:
            {
                this.explosion = data.newPr;
                break;
            }
            case historyitem_DPt_SetIdx:
            {
                this.idx = data.newPr;
                break;
            }
            case historyitem_DPt_SetInvertIfNegative:
            {
                this.invertIfNegative = data.newPr;
                break;
            }
            case historyitem_DPt_SetMarker:
            {
                this.marker = data.newPr;
                break;
            }
            case historyitem_DPt_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }
            case historyitem_DPt_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_DPt_SetBubble3D:
            case historyitem_DPt_SetInvertIfNegative:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
            case historyitem_DPt_SetExplosion:
            case historyitem_DPt_SetIdx:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_DPt_SetMarker:
            case historyitem_DPt_SetPictureOptions:
            case historyitem_DPt_SetSpPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
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
            case historyitem_DPt_SetBubble3D:
            {
                if(r.GetBool())
                {
                    this.bubble3D = r.GetBool();
                }
                else
                {
                    this.bubble3D = null;
                }
                break;
            }
            case historyitem_DPt_SetExplosion:
            {
                if(r.GetBool())
                {
                    this.explosion = r.GetLong();
                }
                else
                {
                    this.explosion = null;
                }
                break;
            }
            case historyitem_DPt_SetIdx:
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
            case historyitem_DPt_SetInvertIfNegative:
            {
                if(r.GetBool())
                {
                    this.invertIfNegative = r.GetBool();
                }
                else
                {
                    this.invertIfNegative = null;
                }
                break;
            }
            case historyitem_DPt_SetMarker:
            {
                if(r.GetBool())
                {
                    this.marker = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.marker = null;
                }
                break;
            }
            case historyitem_DPt_SetPictureOptions:
            {
                if(r.GetBool())
                {
                    this.pictureOptions = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.pictureOptions = null;
                }
                break;
            }
            case historyitem_DPt_SetSpPr:
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
        }
    }
};