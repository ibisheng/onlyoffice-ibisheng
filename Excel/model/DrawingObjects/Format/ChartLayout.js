
var LAYOUT_MODE_EDGE = 0x00;
var LAYOUT_MODE_FACTOR = 0x01;

var LAYOUT_TARGET_INNER = 0x00;
var LAYOUT_TARGET_OUTER = 0x01;


function CChartLayout()
{
    this.isManual = false;

    this.layoutTarget = null;
    this.xMode = null;
    this.yMode = null;
    this.wMode = null;
    this.hMode = null;

    this.x = null;
    this.y = null;
    this.w = null;
    this.h = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id, null)
}

CChartLayout.prototype =
{
    setXMode: function(mode)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Layout_Set_X_Mode, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(this.xMode, mode)), null);
        this.xMode = mode;
    },

    setYMode: function(mode)
    {

        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Layout_Set_Y_Mode, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(this.yMode, mode)), null);
        this.yMode = mode;
    },


    setX: function(x)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Layout_Set_X, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(this.x, x)), null);

        this.x = x;
    },

    setY: function(y)
    {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Layout_Set_Y, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(this.y, y)), null);
        this.y = y;
    },

    setIsManual: function(isManual)
    {
        this.isManual = isManual;
    },

    Undo: function(type, data)
    {
        switch(type)
        {
            case  historyitem_AutoShapes_Layout_Set_X_Mode:
            {
                this.xMode = data.oldValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_Y_Mode:
            {
                this.yMode = data.oldValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_X:
            {
                this.x = data.oldValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_Y:
            {
                this.y = data.oldValue;
                break;
            }
        }
    },

    Redo: function(type, data)
    {
        switch(type)
        {
            case  historyitem_AutoShapes_Layout_Set_X_Mode:
            {
                this.xMode = data.newValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_Y_Mode:
            {
                this.yMode = data.newValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_X:
            {
                this.x = data.newValue;
                break;
            }
            case  historyitem_AutoShapes_Layout_Set_Y:
            {
                this.y = data.newValue;
                break;
            }
        }
    },



    writeToBinary: function(w)
    {
        w.WriteBool(isRealNumber(this.layoutTarget));
        if(isRealNumber(this.layoutTarget))
            w.WriteLong(this.layoutTarget);


        w.WriteBool(isRealNumber(this.xMode));
        if(isRealNumber(this.xMode))
            w.WriteLong(this.xMode);


        w.WriteBool(isRealNumber(this.yMode));

        if(isRealNumber(this.yMode))
            w.WriteLong(this.yMode);

        w.WriteBool(isRealNumber(this.wMode));

        if(isRealNumber(this.wMode))
            w.WriteLong(this.wMode);

        w.WriteBool(isRealNumber(this.hMode));

        if(isRealNumber(this.hMode))
            w.WriteLong(this.hMode);


        w.WriteBool(isRealNumber(this.x));

        if(isRealNumber(this.x))
            w.WriteDouble(this.x);

        w.WriteBool(isRealNumber(this.y));

        if(isRealNumber(this.y))
            w.WriteDouble(this.y);

        w.WriteBool(isRealNumber(this.w));

        if(isRealNumber(this.w))
            w.WriteDouble(this.w);

        w.WriteBool(isRealNumber(this.h));

        if(isRealNumber(this.h))
            w.WriteDouble(this.h);
    },

    readFromBinary: function(r)
    {
        if(r.GetBool())
            this.layoutTarget = r.GetLong();


        if(r.GetBool())
            this.xMode = r.GetLong();


        if(r.GetBool())
            this.yMode = r.GetLong();


        if(r.GetBool())
            this.wMode = r.GetLong();


        if(r.GetBool())
            this.hMode = r.GetLong();


        if(r.GetBool())
            this.x = r.GetDouble();

        if(r.GetBool())
            this.y = r.GetDouble();

        if(r.GetBool())
            this.w = r.GetDouble();

        if(r.GetBool())
            this.h = r.GetDouble();
    }

};