
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
   // this.Id = g_oIdCounter.Get_NewId();
   // g_oTableId.Add(this, this.Id, null)
}

CChartLayout.prototype =
{
    setXMode: function(mode)
    {
        this.xMode = mode;
    },

    setYMode: function(mode)
    {

        this.yMode = mode;
    },


    setX: function(x)
    {

        this.x = x;
    },

    setY: function(y)
    {
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
    }

};