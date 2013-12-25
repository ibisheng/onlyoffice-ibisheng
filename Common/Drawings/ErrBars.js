var ERR_BAR_TYPE_BOTH = 0;
var ERR_BAR_TYPE_MINUS = 1;
var ERR_BAR_TYPE_PLUS = 2;

var ERR_DIR_X = 0;
var ERR_DIR_Y = 1;

var ERR_VAL_TYPE_CUST = 0;
var ERR_VAL_TYPE_FIXED_VAL = 1;
var ERR_VAL_TYPE_PERCENTAGE = 2;
var ERR_VAL_TYPE_STD_DEV = 3;
var ERR_VAL_TYPE_STD_ERR = 4;

function CErrBars()
{
    this.errBarType = null;
    this.errDir     = null;
    this.errValType = null;
    this.minus      = null;
    this.noEndCap   = null;
    this.plus       = null;
    this.spPr       = null;
    this.val        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CErrBars.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ErrBars;
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

    setErrBarType: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetErrBarType, oldPr: this.errBarType, newPr: pr});
        this.errBarType = pr;
    },
    setErrDir: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetErrDir, oldPr: this.errDir, newPr: pr});
        this.errDir = pr;
    },
    setErrValType: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetErrValType, oldPr: this.errDir, newPr: pr});
        this.errDir = pr;
    },
    setMinus: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetMinus, oldPr: this.minus, newPr: pr});
        this.minus = pr;
    },
    setNoEndCap: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetNoEndCap, oldPr: this.noEndCap, newPr: pr});
        this.noEndCap = pr;
    },
    setPlus: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetPlus, oldPr: this.plus, newPr: pr});
        this.plus = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setVal: function(pr)
    {
        History.Add(this, {Type: historyitem_ErrBars_SetVal, oldPr: this.val, newPr: pr});
        this.val = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ErrBars_SetErrBarType:
            {
                this.errBarType = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetErrDir:
            {
                this.errDir = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetErrValType:
            {
                this.errValType = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetMinus:
            {
                this.minus = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetNoEndCap:
            {
                this.noEndCap = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetPlus:
            {
                this.plus = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_ErrBars_SetVal:
            {
                this.val = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ErrBars_SetErrBarType:
            {
                this.errBarType = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetErrDir:
            {
                this.errDir = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetErrValType:
            {
                this.errValType = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetMinus:
            {
                this.minus = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetNoEndCap:
            {
                this.noEndCap = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetPlus:
            {
                this.plus = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_ErrBars_SetVal:
            {
                this.val = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ErrBars_SetErrBarType:
            case historyitem_ErrBars_SetErrDir:
            case historyitem_ErrBars_SetErrValType:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_ErrBars_SetMinus:
            case historyitem_ErrBars_SetPlus:
            case historyitem_ErrBars_SetSpPr:
            {
                w.WriteBool(isRealObject(data.newPr));
                if(isRealObject(data.newPr))
                {
                    w.WriteString2(data.newPr.Get_Id());
                }
                break;
            }
            case historyitem_ErrBars_SetNoEndCap:
            {
                w.WriteBool(isRealBool(data.newPr));
                if(isRealBool(data.newPr))
                {
                    w.WriteBool(data.newPr);
                }
                break;
            }
            case historyitem_ErrBars_SetVal:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteDouble(data.newPr);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (data.Type)
        {
            case historyitem_ErrBars_SetErrBarType:
            {
                if(r.GetBool())
                {
                    this.errBarType = r.GetLong();
                }
                else
                {
                    this.errBarType = null;
                }
                break;
            }
            case historyitem_ErrBars_SetErrDir:
            {
                if(r.GetBool())
                {
                    this.errDir = r.GetLong();
                }
                else
                {
                    this.errDir = null;
                }
                break;
            }
            case historyitem_ErrBars_SetErrValType:
            {
                if(r.GetBool())
                {
                    this.errValType = r.GetLong();
                }
                else
                {
                    this.errValType = null;
                }
                break;
            }
            case historyitem_ErrBars_SetMinus:
            {
                if(r.GetBool())
                {
                    this.minus = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.minus = null;
                }
                break;
            }
            case historyitem_ErrBars_SetNoEndCap:
            {
                if(r.GetBool())
                {
                    this.noEndCap = r.GetBool();
                }
                else
                {
                    this.noEndCap = null;
                }
                break;
            }
            case historyitem_ErrBars_SetPlus:
            {
                if(r.GetBool())
                {
                    this.plus = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.plus = null;
                }
                break;
            }
            case historyitem_ErrBars_SetSpPr:
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
            case historyitem_ErrBars_SetVal:
            {
                if(r.GetBool())
                {
                    this.val = r.GetDouble();
                }
                else
                {
                    this.val = null;
                }
                break;
            }
        }
    }
};