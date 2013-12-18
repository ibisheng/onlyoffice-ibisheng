function CDegree()
{
    this.kind = MATH_DEGREE;

    this.type = DEGREE_SUPERSCRIPT ;
    this.shiftDegree = 0;
    this.alnScr = false;  // не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта

    CMathBase.call(this);
}
extend(CDegree, CMathBase);
CDegree.prototype.init = function(props)
{
    if(props.alnScr === true || props.alnScr === 1)
        this.alnScr = true;
    else if(props.alnScr === false || props.alnScr === 0)
        this.alnScr = false;

    this.init_2( props, new CMathContent() );
}
CDegree.prototype.init_2 = function(props, oBase)
{
    /*if( typeof(props.type)!=="undefined"|| props.type !== null)
        this.type = props.type;*/

    if(props.type === DEGREE_SUPERSCRIPT)
        this.type = DEGREE_SUPERSCRIPT;
    else if(props.type === DEGREE_SUBSCRIPT)
        this.type = DEGREE_SUBSCRIPT;

    this.setDimension(1, 2);

    var oDegree = new CMathContent();
    oDegree.setReduct(DEGR_REDUCT);

    this.addMCToContent(oBase, oDegree);
}
CDegree.prototype.recalculateSize = function()
{
    var Widths = this.getWidthsHeights().widths;
    var Heights = [this.elements[0][0].size.height, this.elements[0][1].size.height];
    var _center;

    var middle = ((Heights[0] > Heights[1]) ? Heights[1] : Heights[0])* 2/3; /// 2/3 от высоты

    var _height = Heights[0] + Heights[1] - middle;

    var _width = 0;
    for( var i = 0; i < Widths.length; i++ )
        _width += Widths[i];

    _width += this.dW;

    if(this.type === DEGREE_SUPERSCRIPT)
    {
        this.shiftDegree = 0;
        _center = _height - (this.elements[0][0].size.height - this.elements[0][0].size.center);
    }
    else if(this.type === DEGREE_SUBSCRIPT)
    {
        this.shiftDegree = _height - this.elements[0][1].size.height;
        _center = this.elements[0][0].size.center;
    }

    this.size = {width: _width,height: _height, center: _center};
}
CDegree.prototype.setPosition = function(_pos)
{
    var pos = _pos;
    if(this.bMObjs === true)
    {
        pos = {x: pos.x, y: pos.y + this.size.center };
    }

    this.elements[0][0].setPosition({x: pos.x, y: pos.y - this.elements[0][0].size.center });
    this.elements[0][1].setPosition({x: pos.x + this.elements[0][0].size.width + this.dW, y: pos.y + this.shiftDegree - this.size.center});
}
CDegree.prototype.findDisposition = function(mCoord)
{
    var coordX, coordY;
    var X, Y;

    var inside_flag = -1;

    if( mCoord.x < this.elements[0][0].size.width)
    {
        if( this.elements[0][0].IsJustDraw() )
        {
            X = 0; Y = 1; // встаем во второй элемент
            coordX = 0;
            coordY = mCoord.y - this.shiftDegree;
            inside_flag = 0;
        }
        else
        {
            X = 0; Y = 0; // встаем в первый элемент
            coordX = mCoord.x;
            coordY =  mCoord.y - ( this.size.center - this.elements[0][0].size.center);
        }
    }
    else if(mCoord.x < (this.elements[0][0].size.width + this.dW ))
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = 0;
        coordY = mCoord.y - this.shiftDegree;
        inside_flag = 0;
    }
    else if(mCoord.x > this.size.width)
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = this.size.width;
        coordY = mCoord.y - this.shiftDegree;
        inside_flag = 1;
    }
    else
    {
        X = 0; Y = 1; // встаем во второй элемент
        coordX = mCoord.x - (this.elements[0][0].size.width + this.dW);
        coordY = mCoord.y - this.shiftDegree;
    }

    if(coordY < 0)
    {
        coordY = 0;
        inside_flag = 2;
    }
    else if(coordY > this.elements[X][Y].size.height)
    {
        coordY = this.elements[X][Y].size.height;
        inside_flag = 2;
    }

    var mCoord = {x: coordX, y: coordY};

    return {pos: {x: X, y: Y}, mCoord: mCoord, inside_flag: inside_flag};
}
CDegree.prototype.getIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getUpperIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getLowerIterator = function()
{
    return this.elements[0][1];
}
CDegree.prototype.getBase = function()
{
    return this.elements[0][0];
}
CDegree.prototype.getPropsForWrite = function()
{
    var props = {};
    props.type = this.type;
    props.alnScr = this.alnScr;

    return props;
}

function CIterators()
{
    CMathBase.call(this);
}
extend(CIterators, CMathBase);
CIterators.prototype.init = function()
{
    this.setDimension(2, 1);
    this.setContent();
}
CIterators.prototype.setDistance = function()
{
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

}
CIterators.prototype.getCenter = function()
{
    var center = 0;
    var descF = this.elements[0][0].size.height - this.elements[0][0].size.center;

    if( this.lUp > descF )
        center = this.elements[0][0].size.center + this.lUp;
    else
        center = this.elements[0][0].size.height;

    return center;
}
CIterators.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
}
CIterators.prototype.getLowerIterator = function()
{
    return this.elements[1][0];
}
CIterators.prototype.setReduct = function(reduct)
{
    this.elements[0][0].setReduct(reduct);
    this.elements[1][0].setReduct(reduct);
}
CIterators.prototype.getCtrPrp = function()
{
    return this.Parent.getCtrPrp();
}

function CDegreeSubSup()
{
    this.kind = MATH_DEGREESubSup;

    this.type = DEGREE_SubSup;
    this.alnScr = false;    // не выровнены, итераторы идут в соответствии с наклоном буквы/мат. объекта
    CSubMathBase.call(this);
}
extend(CDegreeSubSup, CSubMathBase);
CDegreeSubSup.prototype.init = function(props)
{
    if(props.alnScr === true || props.alnScr === 1)
        this.alnScr = true;
    else if(props.alnScr === false || props.alnScr === 0)
        this.alnScr = false;

    var oBase = new CMathContent();
    this.init_2(props, oBase);
}
CDegreeSubSup.prototype.init_2 = function(props, oBase)
{
    /*if( typeof(props.type)!=="undefined"|| props.type !== null)
        this.type = props.type;*/

    if(props.type === DEGREE_SubSup)
        this.type = DEGREE_SubSup;
    else if(props.type === DEGREE_PreSubSup)
        this.type = DEGREE_PreSubSup;

    this.setDimension(1, 2);

    var oIters = new CIterators();
    oIters.init();
    oIters.setReduct(DEGR_REDUCT);

    oIters.lUp = 0;
    oIters.lD = 0;

    if(this.type == DEGREE_SubSup)
    {
        oIters.alignHor(-1, 0);
        this.addMCToContent(oBase, oIters);
    }
    else if(this.type == DEGREE_PreSubSup)
    {
        oIters.alignHor(-1, 1);
        this.addMCToContent(oIters, oBase);
    }

}
CDegreeSubSup.prototype.recalculateSize = function()
{
    if(this.type == DEGREE_SubSup)
    {
        this.elements[0][1].lUp = this.elements[0][0].size.center;
        this.elements[0][1].lD = this.elements[0][0].size.height - this.elements[0][0].size.center;
        this.elements[0][1].setDistance();
        this.elements[0][1].recalculateSize();
    }
    else if(this.type == DEGREE_PreSubSup)
    {
        this.elements[0][0].lUp = this.elements[0][1].size.center;
        this.elements[0][0].lD = this.elements[0][1].size.height - this.elements[0][1].size.center;
        this.elements[0][0].setDistance();
        this.elements[0][0].recalculateSize();
    }

    CSubMathBase.superclass.recalculateSize.call(this);
}
CDegreeSubSup.prototype.getBase = function()
{
    var base;

    if(this.type == DEGREE_SubSup)
        base = this.elements[0][0];
    else if(this.type == DEGREE_PreSubSup)
        base = this.elements[0][1];

    return base;
}
CDegreeSubSup.prototype.getUpperIterator = function()
{
    var iter;

    if(this.type == DEGREE_SubSup)
        iter = this.elements[0][1].getUpperIterator();
    else if(this.type == DEGREE_PreSubSup)
        iter = this.elements[0][0].getUpperIterator();

    return iter;
}
CDegreeSubSup.prototype.getLowerIterator = function()
{
    var iter;

    if(this.type == DEGREE_SubSup)
        iter = this.elements[0][1].getLowerIterator();
    else if(this.type == DEGREE_PreSubSup)
        iter = this.elements[0][0].getLowerIterator();

    return iter;
}
CDegreeSubSup.prototype.getPropsForWrite = function()
{
    var props = {};

    props.type = this.type;
    props.alnScr = this.alnScr;

    return props;
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
