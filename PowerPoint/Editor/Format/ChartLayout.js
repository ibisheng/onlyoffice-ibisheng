
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
}

CChartLayout.prototype =
{

    createDuplicate: function()
    {
        var ret = new CChartLayout();

        this.isManual = false;

        ret.layoutTarget = this.layoutTarget;
        ret.xMode = this.xMode;
        ret.yMode = this.yMode;
        ret.wMode = this.wMode;
        ret.hMode = this.hMode;

        ret.x = this.x;
        ret.y = this.y;
        ret.w = this.w;
        ret.h = this.h;
        return ret;
    },

    Write_ToBinary2: function(w)
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


    Read_FromBinary2: function(r)
    {
        if(r.GetBool())
           (this.layoutTarget) = r.GetLong();

        if(r.GetBool())
            (this.xMode) = r.GetLong();

        if(r.GetBool())
            (this.yMode) = r.GetLong();


        if(r.GetBool())
            (this.wMode) = r.GetLong();

        if(r.GetBool())
            (this.hMode) = r.GetLong();


        if(r.GetBool())
            (this.x) = r.GetDouble();


        if(r.GetBool())
            (this.y) = r.GetDouble();

        if(r.GetBool())
            (this.w) = r.GetDouble();

        if(r.GetBool())
            (this.h) = r.GetDouble();
    },

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
    }
};