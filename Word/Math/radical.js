function getHeightTick(metrics, height)
{
    var minHgtRad = metrics.Height * 0.75,
        maxHgtRad = 4*metrics.Height + metrics.Placeholder.Height;

    var minHgtTick = metrics.Placeholder.Height*0.6,
        maxHgtTick = metrics.Height;

    var heightTick;

    if ( height > maxHgtRad )
        heightTick = maxHgtTick;
    else
    {
        var alpha = (height - minHgtRad)/maxHgtRad;
        heightTick = minHgtTick*(1 + alpha);
    }

    return heightTick;
}
function DrawingRadical()
{
    var x = this.pos.x,
        y = this.pos.y;

    var Height = this.size.height - this.shRadical.y,
        Width = this.size.width - this.shRadical.x;

    var penW = this.params.font.FontSize*g_dKoef_pt_to_mm*0.042;

    var minHeight = this.params.font.metrics.Height * 0.75,
        maxHeight = 4*this.params.font.metrics.Height + this.params.font.metrics.Placeholder.Height;

    var maxWidth = 1.6*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    var coeff = 0.2*maxWidth/(maxHeight - minHeight),
        b = maxWidth*0.3 - coeff*minHeight;

    var heightTick = getHeightTick(this.params.font.metrics, Height);

    var tX = 1.7*penW * 0.5 * 25.4/96,
        tY = (-1)*tX * 11/25 *0.5; // 11/25 - тангенс угла наклона

    var x1 = x + this.shRadical.x,
        x2 = x1 + 0.25*maxWidth;

    var y2 = y + this.size.height - heightTick,
        y1 = y2 + 0.11*maxWidth;

    var x3 = x2 - tX,
        y3 = y2 - tY;

    if(Height < maxHeight)
        x4 = x3 + coeff*Height + b;
    else
        x4 = x3 + coeff*maxHeight + b;

    var y4 = y + this.size.height - penW;

    var x5 = x1 + maxWidth,
        x6 = x + this.size.width;

    var y5 = y + this.shRadical.y,
        y6 = y + this.shRadical.y;

    MathControl.pGraph.p_width(penW*0.8*1000);

    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph.b_color1(0,0,0, 255);

    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph.ds();


    MathControl.pGraph.p_width(1.7*penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x3, y3);
    MathControl.pGraph._l(x4, y4);
    MathControl.pGraph.ds();

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x4, y4);
    MathControl.pGraph._l(x5, y5);
    MathControl.pGraph._l(x6,y6);
    MathControl.pGraph.ds();
}

function CRadical()
{
    this.gapTop = 0;
    this.gapLeft = 0;

    this.shRadical =
    {
        x: 0,
        y: 0
    };

    CMathBase.call(this, 1, 1);
}
extend(CRadical, CMathBase);
CRadical.prototype.setContent = function()
{
    this.fillPlaceholders();
}
CRadical.prototype.recalculateSize = function()
{
    var arg = this.elements[0][0].size;

    var height, width, center,
        left = 1.85*(this.params.font.metrics.Height - this.params.font.metrics.Placeholder.Height);

    var top = this.params.font.FontSize*g_dKoef_pt_to_mm*0.15;
    var penW = this.params.font.FontSize*g_dKoef_pt_to_mm*0.042;

    //var penW = 1* 25.4/96; //mm

    height = getStateHeight_3(arg.height + top, this.params.font);
    height += penW;
    width = arg.width + left;

    this.gapTop = (height - arg.height + penW + top)/2;
    this.gapLeft = left;

    center = this.gapTop + arg.center;

    this.size = {width: width, height: height, center: center};

}
CRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};
    var x = this.pos.x + this.gapLeft,
        y = this.pos.y + this.gapTop;

    this.elements[0][0].setPosition({x: x, y: y });
}
CRadical.prototype.mouseDown = function(pos)
{
    var coord = {x: pos.x - this.gapLeft, y: pos.y - this.gapTop};
    return CRadical.superclass.mouseDown.call(this, coord);
}
CRadical.prototype.mouseMove = function(pos)
{
    var coord = {x: pos.x - this.gapLeft, y: pos.y - this.gapTop};
    return CRadical.superclass.mouseMove.call(this, coord);
}
//context.fill() для заливки
//Graphics : df()

CRadical.prototype.draw = function()
{
    CRadical.superclass.draw.call(this);
    DrawingRadical.call(this);
}
CRadical.prototype.getBase = function()
{
    return this.elements[0][0];
}

function CDegreeRadical()
{
    this.shDegr =
    {
        x: 0,
        y: 0
    };

    this.shBase =
    {
        x: 0,
        y: 0
    };

    this.shRadical =
    {
        x: 0,
        y: 0
    };

    CMathBase.call(this, 1, 2);
}
extend(CDegreeRadical, CMathBase);
CDegreeRadical.prototype.old_setContent = function()
{
    var oBase  = new CMathBase(1, 1);
    oBase.init( this.params );
    oBase.relate(this);
    oBase.fillPlaceholders();

    var oDegree = new CMathBase(1, 1);
    oDegree.init( this.params );
    oDegree.relate(this);
    oDegree.fillPlaceholders();
    var fontDgr = getTypeDegree(this.params.font, true);
    oDegree.setFont(fontDgr, -1);

    CDegreeOrdinary.superclass.setContent.call(this, oDegree, oBase);
}
CDegreeRadical.prototype.setContent = function()
{
    var oBase  = new CMathContent(1, 1);
    oBase.init( this.params );
    oBase.relate(this);
    oBase.fillPlaceholders();

    var oDegree = new CMathContent(1, 1);
    oDegree.init( this.params );
    oDegree.relate(this);
    oDegree.fillPlaceholders();
    var fontDgr = getTypeDegree(this.params.font, true);
    oDegree.setFont(fontDgr, -1);

    CDegreeOrdinary.superclass.setContent.call(this, oDegree, oBase);

}
CDegreeRadical.prototype.recalculateSize = function()
{
    var degr = this.elements[0][0].size,
        base = this.elements[0][1].size;
    
    var metrics = this.params.font.metrics,
        fontSize = this.params.font.FontSize;

    //var penW = 1* 25.4/96; //mm

    // ширина

    var width, height, center;

    var widthToBase = 1.85*(metrics.Height - metrics.Placeholder.Height);
    var tickWidth = 0.1196002747872799*fontSize, /*расстояение значка радикала, над которым рисуется степень*/
        tGap = widthToBase - tickWidth;

    width = degr.width + tGap + base.width;

    this.shBase.x = degr.width + tGap;
    this.shRadical.x = degr.width - tickWidth; // смещаем на ширину степени минус то расстояние радикала, над которым рисуется степень
    this.shDegr.x = 0;

    // высота

    var top = fontSize*g_dKoef_pt_to_mm*0.15; // gap сверху от аргумента
    var penW = fontSize*g_dKoef_pt_to_mm*0.042;

    // высота значка радикала
    
    var heightRadical = getStateHeight_3(base.height + top, this.params.font);
    heightRadical += penW;

    // высота "галки" радикала

    var heightTick = getHeightTick(metrics, heightRadical);

    // высота "степени" + "галка"

    if( base.height + top < metrics.Placeholder.Height )
        gap = 1.5*fontSize/36;
    else
        gap = 3.5*fontSize/36;

    var shift = gap + heightTick;

    var hDgr = shift + degr.height,
        jDegr = (heightRadical - base.height + top + penW)/2;

    // общая высота

    if( hDgr > heightRadical)
    {
        height = hDgr;
        this.shBase.y = hDgr - heightRadical + jDegr;
        this.shDegr.y = 0;
        this.shRadical.y = hDgr - heightRadical;
    }
    else
    {
        height = heightRadical;
        this.shDegr.y = heightRadical - hDgr;
        this.shBase.y = jDegr;
        this.shRadical.y = 0;
    }

    center = this.shBase.y + base.center;

    this.size = {width: width, height: height, center: center};
}
CDegreeRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    var x1 = this.pos.x + this.shDegr.x,
        y1 = this.pos.y + this.shDegr.y;

    this.elements[0][0].setPosition({x: x1, y: y1 });

    var x2 = this.pos.x + this.shBase.x,
        y2 = this.pos.y + this.shBase.y;

    this.elements[0][1].setPosition({x: x2, y: y2 });
}
CDegreeRadical.prototype.draw = function()
{
    CDegreeRadical.superclass.draw.call(this);
    DrawingRadical.call(this);
}
CDegreeRadical.prototype.findDisposition = function(mCoord)
{
    var mouseCoord = {x: null, y: null},
        posCurs =    {x: 0, y: null},
        inside_flag = -1;

    var degr = this.elements[0][0].size,
        base = this.elements[0][1].size;


    if(mCoord.x < this.size.width - base.width)
    {
        posCurs.y = 0;

        if(mCoord.x > degr.width)
        {
            mouseCoord.x = degr.width;
            inside_flag = 1;
        }
        else
        {
            mouseCoord.x = mCoord.x;
        }

        mouseCoord.x = mCoord.x;

        if(mCoord.y < this.shDegr.y)
        {
            mouseCoord.y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > degr.height + this.shDegr.y)
        {
            mouseCoord.y = degr.height;
            inside_flag = 2;
        }
        else
        {
            mouseCoord.y = mCoord.y - this.shDegr.y;
        }
    }
    else
    {
        posCurs.y = 1;

        mouseCoord.x = mCoord.x - this.shBase.x;

        if(mCoord.y < this.shBase.y)
        {
            mouseCoord.y = 0;
            inside_flag = false;
        }
        else if(mCoord.y > base.height + this.shBase.y)
        {
            mouseCoord.y = base.height;
            inside_flag = false;
        }
        else
            mouseCoord.y = mCoord.y - this.shBase.y;
    }

    return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
}
CDegreeRadical.prototype.getBase = function()
{
    return this.elements[0][1];
}
CDegreeRadical.prototype.getDegree = function()
{
    return this.elements[0][0];
}
