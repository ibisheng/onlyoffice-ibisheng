var LAYOUT_TARGET_INNER = 0;
var LAYOUT_TARGET_OUTER = 1;

var LAYOUT_MODE_EDGE = 0;
var LAYOUT_MODE_FACTOR = 1;

function CLayout()
{
    this.h = null;
    this.hMode = null;
    this.layoutTarget = null;
    this.w  = null;
    this.wMode = null;
    this.x = null;
    this.xMode = null;
    this.y = null;
    this.yMode = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLayout.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    getObjectType: function()
    {
        return historyitem_type_Layout;
    },

    setH: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetH, oldPr: this.h, newPr: pr});
        this.h = pr;
    },

    setHMode: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetHMode, oldPr: this.hMode, newPr: pr});
        this.hMode = pr;
    },

    setLayoutTarget: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetLayoutTarget, oldPr: this.layoutTarget, newPr: pr});
        this.layoutTarget = pr;
    },

    setW: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetW, oldPr: this.w, newPr: pr});
        this.w = pr;
    },

    setWMode: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetWMode, oldPr: this.wMode, newPr: pr});
        this.wMode = pr;
    },

    setX: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetX, oldPr: this.x, newPr: pr});
        this.x = pr;
    },

    setXMode: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetXMode, oldPr: this.xMode, newPr: pr});
        this.xMode = pr;
    },

    setY: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetY, oldPr: this.y, newPr: pr});
        this.y = pr;
    },

    setYMode: function(pr)
    {
        History.Add(this, {Type:historyitem_Layout_SetYMode, oldPr: this.yMode, newPr: pr});
        this.yMode = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Layout_SetH:
            {
                this.h = data.oldPr;
                break;
            }
            case historyitem_Layout_SetHMode:
            {
                this.hMode = data.oldPr;
                break
            }
            case historyitem_Layout_SetLayoutTarget:
            {
                this.layoutTarget = data.oldPr;
                break
            }
            case historyitem_Layout_SetW:
            {
                this.w = data.oldPr;
                break
            }
            case historyitem_Layout_SetWMode:
            {
                this.wMode = data.oldPr;
                break
            }
            case historyitem_Layout_SetX:
            {
                this.x = data.oldPr;
                break
            }
            case historyitem_Layout_SetXMode:
            {
                this.xMode = data.oldPr;
                break
            }
            case historyitem_Layout_SetY:
            {
                this.y = data.oldPr;
                break
            }
            case historyitem_Layout_SetYMode:
            {
                this.yMode = data.oldPr;
                break
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Layout_SetH:
            {
                this.h = data.newPr;
                break;
            }
            case historyitem_Layout_SetHMode:
            {
                this.hMode = data.newPr;
                break
            }
            case historyitem_Layout_SetLayoutTarget:
            {
                this.layoutTarget = data.newPr;
                break
            }
            case historyitem_Layout_SetW:
            {
                this.w = data.newPr;
                break
            }
            case historyitem_Layout_SetWMode:
            {
                this.wMode = data.newPr;
                break
            }
            case historyitem_Layout_SetX:
            {
                this.x = data.newPr;
                break
            }
            case historyitem_Layout_SetXMode:
            {
                this.xMode = data.newPr;
                break
            }
            case historyitem_Layout_SetY:
            {
                this.y = data.newPr;
                break
            }
            case historyitem_Layout_SetYMode:
            {
                this.yMode = data.newPr;
                break
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Layout_SetH:
            case historyitem_Layout_SetW:
            case historyitem_Layout_SetX:
            case historyitem_Layout_SetY:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteDouble(data.newPr);
                }
                break;
            }
            case historyitem_Layout_SetHMode:
            case historyitem_Layout_SetWMode:
            case historyitem_Layout_SetXMode:
            case historyitem_Layout_SetYMode:
            case historyitem_Layout_SetLayoutTarget:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break
            }
        }
    },

    Load_Changes: function(r)
    {
        if(this.getObjectType() !== r.GetLong())
            return;
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Layout_SetH:
            {
                if(r.GetBool())
                {
                    this.h = r.GetDouble();
                }
                else
                {
                    this.h = null;
                }
                break;
            }
            case historyitem_Layout_SetHMode:
            {
                if(r.GetBool())
                {
                    this.hMode = r.GetLong();
                }
                else
                {
                    this.hMode = null;
                }
                break
            }
            case historyitem_Layout_SetLayoutTarget:
            {
                if(r.GetBool())
                {
                    this.layoutTarget = r.GetLong();
                }
                else
                {
                    this.layoutTarget = null;
                }
                break
            }
            case historyitem_Layout_SetW:
            {
                if(r.GetBool())
                {
                    this.w = r.GetDouble();
                }
                else
                {
                    this.w = null;
                }
                break
            }
            case historyitem_Layout_SetWMode:
            {
                if(r.GetBool())
                {
                    this.wMode = r.GetLong();
                }
                else
                {
                    this.wMode = null;
                }
                break
            }
            case historyitem_Layout_SetX:
            {
                if(r.GetBool())
                {
                    this.x = r.GetDouble();
                }
                else
                {
                    this.x = null;
                }
                break
            }
            case historyitem_Layout_SetXMode:
            {
                if(r.GetBool())
                {
                    this.xMode = r.GetLong();
                }
                else
                {
                    this.xMode = null;
                }
                break
            }
            case historyitem_Layout_SetY:
            {
                if(r.GetBool())
                {
                    this.y = r.GetDouble();
                }
                else
                {
                    this.y = null;
                }
                break
            }
            case historyitem_Layout_SetYMode:
            {
                if(r.GetBool())
                {
                    this.yMode = r.GetLong();
                }
                else
                {
                    this.yMode = null;
                }
                break
            }
        }
    }
};
