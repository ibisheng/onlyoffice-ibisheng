function CDegree(type)
{
    var degr = null;
    if(type == 0)
        degr = new CDegreeOrdinary(1);
    else if(type == 1)
        degr = new CDegreeOrdinary(-1);
    else if(type == 2)
        degr = new CDegreeSubSup(0);
    else if(type == 3)
        degr = new CDegreeSubSup(1);

    return degr;
}

function CDegreeOrdinary(index)
{
    this.index = index;
    this.constPos = null;
    CMathBase.call(this, 1, 2);
}
extend(CDegreeOrdinary, CMathBase);
CDegreeOrdinary.prototype.SH_DEGR = 2/3;
CDegreeOrdinary.prototype.setContent = function()
{
    var oBase = null;
    if(arguments.length > 0)
        oBase = arguments[0];
    else
    {
        oBase = new CMathBase(1, 1);
        oBase.init( this.params );
        oBase.relate(this);
        oBase.fillPlaceholders();
    }

    var oDegree = new CMathBase(1, 1);
    oDegree.init( this.params );
    oDegree.relate(this);
    oDegree.fillPlaceholders();
    oDegree.setFont(getTypeDegree(this.params.font), -1);

    CDegreeOrdinary.superclass.setContent.call(this, oBase, oDegree);

}
CDegreeOrdinary.prototype.recalculateSize = function()
{
    var Widths = this.getWidthsHeights().widths;
    var Heights = [this.elements[0][0].size.height, this.elements[0][1].size.height];
    var _center;

    var middle = ((Heights[0] > Heights[1]) ? Heights[1] : Heights[0])*this.SH_DEGR;
    
    var _height = Heights[0] + Heights[1] - middle;

    var _width = 0;
    for( var i = 0; i < Widths.length; i++ )
        _width += Widths[i];

    _width += this.dW;

    if(this.index === 1 )
    {
        this.constPos = 0;
        _center = _height - (this.elements[0][0].size.height - this.elements[0][0].size.center);
    }
    else if(this.index === -1 )
    {
        this.constPos = _height - this.elements[0][1].size.height;
        _center = this.elements[0][0].size.center;
    }

    this.size = {width: _width,height: _height, center: _center};
}
CDegreeOrdinary.prototype.setPosition = function(_pos)
{
    var pos = _pos;
    if(this.bMObjs === true)
    {
        pos = {x: pos.x, y: pos.y + this.size.center };
    }

    this.elements[0][0].setPosition({x: pos.x, y: pos.y - this.elements[0][0].size.center });
    this.elements[0][1].setPosition({x: pos.x + this.elements[0][0].size.width + this.dW, y: pos.y + this.constPos - this.size.center});
    /*this.elements[0][0].setPosition({x: pos.x, y: pos.y });
    this.elements[0][1].setPosition({x: pos.x + this.elements[0][0].size.width + this.dW, y: pos.y + this.constPos - this.size.center + this.elements[0][1].size.center});*/
}
CDegreeOrdinary.prototype.findDisposition = function( mCoord )
{
    var posCurs = null, mouseCoord = null, flag = false;

    if( mCoord.x < this.elements[0][0].size.width )
    {
        if( this.elements[this.CurPos_X][this.CurPos_Y].IsJustDraw() )
        {
            posCurs = {x: 0, y: 1};
            mouseCoord = {x: 0, y: mCoord.y - this.constPos};
            flag = false;
        }
        else
        {
            posCurs = {x: 0, y: 0};
            mouseCoord = {x: mCoord.x, y: mCoord.y - ( this.size.center - this.elements[0][0].size.center)};
            flag = true;
        }
    }
    else if(mCoord.x < (this.elements[0][0].size.width + this.dW ) )
    {
        posCurs = {x:0, y:1};
        mouseCoord = {x: 0, y:  mCoord.y - this.constPos};
        flag = false;

    }
    else
    {
        posCurs = {x:0, y:1};
        mouseCoord = {x: mCoord.x - (this.elements[0][0].size.width + this.dW ), y: mCoord.y - this.constPos};
        flag = true;
    }

    return {pos: posCurs, mCoord: mouseCoord, flag: flag};
}

function CDegreeSubSup(type)
{
    CSubMathBase.call(this, 1, 2);
    this.type = type;
}
extend(CDegreeSubSup, CSubMathBase);
CDegreeSubSup.prototype.setContent = function()
{

    var oBase = null;
    if(arguments.length > 0)
        oBase = arguments[0];
    else
    {
        oBase = new CMathBase(1, 1);
        oBase.init( this.params );
        oBase.relate(this);
        oBase.fillPlaceholders();
    }

    var oDegree = new CMathBase(2, 1);
    oDegree.init( this.params );
    oDegree.relate(this);
    oDegree.fillPlaceholders();
    oDegree.setFont(getTypeDegree(this.params.font), -1);

    oDegree.setDistance = function() {

        var metrics = this.params.font.metrics;
        var descF = this.elements[0][0].size.height - this.elements[0][0].size.center ,
            ascS = this.elements[1][0].size.center ;

        var up = 0;
        var down = 0;
        if(this.lUp  > descF)
            up = this.lUp - descF;
        if( this.lD > ascS )
            down = this.lD - ascS;

        this.dH = up + down;
        this.dW = 0;

    };
    oDegree.getCenter = function()
    {
        var center = 0;
        var descF = this.elements[0][0].size.height - this.elements[0][0].size.center;

        if( this.lUp > descF )
            center = this.elements[0][0].size.center + this.lUp;
        else
            center = this.elements[0][0].size.height;

        return center;
    };

    oDegree.lUp = 0;
    oDegree.lD = 0;

    if(this.type == 0)
    {
        oDegree.alignHor(-1, 0);
        CDegreeSubSup.superclass.setContent.call(this, oBase, oDegree);
    }
    else
    {
        oDegree.alignHor(-1, 1);
        CDegreeSubSup.superclass.setContent.call(this, oDegree, oBase);
    }
}
CDegreeSubSup.prototype.recalculateSize = function()
{
    if(this.type == 0)
    {
        this.elements[0][1].lUp = this.elements[0][0].size.center;
        this.elements[0][1].lD = this.elements[0][0].size.height - this.elements[0][0].size.center;
        this.elements[0][1].setDistance();
        this.elements[0][1].recalculateSize();
    }
    else
    {
        this.elements[0][0].lUp = this.elements[0][1].size.center;
        this.elements[0][0].lD = this.elements[0][1].size.height - this.elements[0][1].size.center;
        this.elements[0][0].setDistance();
        this.elements[0][0].recalculateSize();
    }

    CSubMathBase.superclass.recalculateSize.call(this);
}
//выяcнить: почему и с этой ф-ией и без нее работает всё ok...
//всё ok, т.к. в контенте 2 элемента, и их center сравниваем
/*CDegreeSubSup.prototype.getCenter = function()
{
    var center = 0;
    if(this.type == 0)
        center = this.elements[0][1].size.center;
    else
        center = this.elements[0][0].size.center;

    return center;
}*/
