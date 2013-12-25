var SYMBOL_CIRCLE = 0;
var SYMBOL_DASH = 1;
var SYMBOL_DIAMOND = 2;
var SYMBOL_DOT = 3;
var SYMBOL_NONE = 4;
var SYMBOL_PICTURE = 5;
var SYMBOL_PLUS = 6;
var SYMBOL_SQUARE = 7;
var SYMBOL_STAR = 8;
var SYMBOL_TRIANGLE = 9;
var SYMBOL_X = 10;

function CMarker()
{
    this.size = null; //2 <= size <= 72
    this.spPr = null;
    this.symbol = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMarker.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_Marker;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setSize: function(pr)
    {
        History.Add(this, {Type: historyitem_Marker_SetSize, oldPr: this.size, newPr: pr});
        this.size = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_Marker_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },

    setSymbol: function(pr)
    {
        History.Add(this, {Type: historyitem_Marker_SetSymbol, oldPr: this.symbol, newPr: pr});
        this.symbol = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Marker_SetSize:
            {
                this.size = data.oldPr;
                break;
            }
            case historyitem_Marker_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_Marker_SetSymbol:
            {
                this.symbol = data.oldPr;
                break;
            }
        }
    } ,

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Marker_SetSize:
            {
                this.size = data.newPr;
                break;
            }
            case historyitem_Marker_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_Marker_SetSymbol:
            {
                this.symbol = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Marker_SetSize:
            case historyitem_Marker_SetSymbol:
            {
                w.WriteBool(isRealNumber(data.newPr));
                if(isRealNumber(data.newPr))
                {
                    w.WriteLong(data.newPr);
                }
                break;
            }
            case historyitem_Marker_SetSpPr:
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
            case historyitem_Marker_SetSize:
            {
                if(r.GetBool())
                {
                    this.size = r.GetLong();
                }
                else
                {
                    this.size = null;
                }
                break;
            }
            case historyitem_Marker_SetSpPr:
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
            case historyitem_Marker_SetSymbol:
            {
                if(r.GetBool())
                {
                    this.symbol = r.GetLong();
                }
                else
                {
                    this.symbol = null;
                }
                break;
            }
        }
    }
};