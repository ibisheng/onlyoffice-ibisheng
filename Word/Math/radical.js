function CSignRadical()
{
    this.Parent = null;
    this.pos = null;

    this.size = null;
    this.sizeTick = null;
    this.widthSlash = null;
}
CSignRadical.prototype.draw = function(pGraphics)
{
    var txtPrp = this.Parent.getTxtPrp();
    var penW = txtPrp.FontSize*g_dKoef_pt_to_mm*0.042;

    var plH = 9.877777777777776 * txtPrp.FontSize /36;

    var x1 = this.pos.x,
        x2 = x1 + 0.25*this.widthSlash;

    var y2 = this.pos.y + this.size.height -this.sizeTick.height,
        y1 = y2 + 0.11*this.widthSlash;


    var tX = 1.7*penW * 0.5 * 25.4/96,
        tY = (-1)*tX * 11/25 *0.5; // 11/25 - тангенс угла наклона

    var x3 = x2 - tX,
        y3 = y2 - tY;

    /*var minHeight = plH * 1.1304931640625,
     maxHeight = plH * 7.029296875;

     var maxWidth = plH * 0.81171875;

     var k = 0.2*maxWidth/(maxHeight - minHeight),
     b = maxWidth*0.3 - k*minHeight;*/

    var k = 0.00343247*this.widthSlash,
        b = 0.3*this.widthSlash - 1.130493*plH*k;

    if(this.size.height < plH*7.029296875)
        x4 = x3 + k*this.size.height + b;
    else
        x4 = x1 + this.widthSlash;

    var y4 = this.pos.y + this.size.height - penW;

    var x5 = x1 + this.widthSlash,
        x6 = this.pos.x + this.size.width;

    var y5 = this.pos.y,
        y6 = this.pos.y;

    pGraphics.p_width(penW*0.8*1000);

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();


    pGraphics.p_width(1.7*penW*1000);
    pGraphics._s();
    pGraphics._m(x3, y3);
    pGraphics._l(x4, y4);
    pGraphics.ds();

    pGraphics.p_width(penW*1000);
    pGraphics._s();
    pGraphics._m(x4, y4);
    pGraphics._l(x5, y5);
    pGraphics._l(x6,y6);
    pGraphics.ds();

}
CSignRadical.prototype.recalculateSize = function()
{
    var txtPrp = this.Parent.getTxtPrp();
    var sizeArg = this.Parent.getBase().size;

    var height, width;

    var top = txtPrp.FontSize*g_dKoef_pt_to_mm*0.15,
        heightArg = sizeArg.height + top,
        widthArg = sizeArg.width;

    ///// height //////
    var plH = 9.877777777777776 * txtPrp.FontSize /36;
    var H0 = plH,
        H1 = plH*1.50732421875,
        H2 = plH*2.760986328125,
        H3 = plH*4.217578125,
        H4 = plH*5.52197265625,
        H5 = plH*7.029296875;

    if(heightArg < H0)
        height = H1*0.75;
    else if( heightArg < H1 )
        height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3;
    else if( heightArg < H4 )
        height = H4;
    else if(heightArg < H5)
        height = H5;
    else
        height = heightArg;

    //////

    ///// height tick //////
    var minHgtRad = plH * 1.130493164,
        maxHgtRad = plH * 7.029296875;

    var minHgtTick = plH*0.6,
        maxHgtTick = plH * 1.50732422;

    var heightTick;

    if ( heightArg > maxHgtRad )
        heightTick = maxHgtTick;
    else
    {
        var alpha = (heightArg - minHgtRad)/maxHgtRad;
        heightTick = minHgtTick*(1 + alpha);
    }

    ////// width //////
    //var widthSlash = plH * 0.9385498046875003;
    var widthSlash = plH * 0.81171875;
    gap = 0.12683105468750022* plH;
    width = widthSlash + gap + widthArg;
    //////

    ////// tick width /////
    var widthTick = 0.1196002747872799*txtPrp.FontSize;
    //////

    this.sizeTick =
    {
        width : widthTick,
        height : heightTick
    };

    this.widthSlash = widthSlash;

    this.size = {height: height, width: width};
}
CSignRadical.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CSignRadical.prototype.relate = function(parent)
{
    this.Parent = parent;
}

//context.fill() для заливки
//Graphics : df()

function CRadical()
{
    this.signRadical = null;
    CMathBase.call(this);
}
extend(CRadical, CMathBase);
CRadical.prototype.init = function(props)
{
    this.type = props.type;

    this.setDimension(1, 1);
    this.setContent();

    this.signRadical = new CSignRadical();
    this.signRadical.relate(this);

    if(this.type == SQUARE_RADICAL)
    {
        this.setDimension(1, 1);
        this.setContent();
    }
    else if(this.type == DEGREE_RADICAL)
    {
        this.setDimension(1, 2);
        var oBase = new CMathContent();

        var oDegree = new CMathContent();
        oDegree.setReduct(DEGR_REDUCT);

        this.addMCToContent(oDegree, oBase);
    }
}
CRadical.prototype.recalculateSize = function()
{
    this.signRadical.recalculateSize();

    if(this.type == SQUARE_RADICAL)
    {
        var sign = this.signRadical.size;
        var arg = this.elements[0][0].size;

        var height = sign.height,
            width  = sign.width,
            center = (height - arg.height)*0.6  + arg.center;

        this.size = {width: width, height: height, center: center};
    }
    else if(this.type == DEGREE_RADICAL)
    {
        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size,
            sign = this.signRadical.size;

        var wTick = this.signRadical.sizeTick.width,
            hTick = this.signRadical.sizeTick.height;

        var width = degr.width - wTick + sign.width;

        var txtPrp = this.getTxtPrp();
        var plH = 9.877777777777776 * txtPrp.FontSize /36;

        if( sign.height < plH )
            this.gap = 1.5*txtPrp.FontSize/36;
        else
            this.gap = 3.5*txtPrp.FontSize/36;

        var h1 = degr.height + this.gap + hTick,
            h2 = sign.height;

        var height, center;

        if(h1 > h2)
        {
            height =  h1;
            center = h1 - h2 + (sign.height - base.height)*0.6  + base.center;
        }
        else
        {
            height =  h2;
            center = (sign.height - base.height)*0.6  + base.center;
        }

        this.size = {width: width, height: height, center: center};
    }
}
CRadical.prototype.setPosition = function(pos)
{
    if(this.type == SQUARE_RADICAL)
    {
        this.pos = {x: pos.x, y: pos.y - this.size.center};
        this.gapLeft = this.size.width - this.elements[0][0].size.width;
        this.gapTop = this.size.center - this.elements[0][0].size.center;

        var x = this.pos.x + this.gapLeft,
            y = this.pos.y + this.gapTop;

        this.signRadical.setPosition(this.pos);
        this.elements[0][0].setPosition({x: x, y: y });
    }
    else if(this.type == DEGREE_RADICAL)
    {
        this.pos = {x: pos.x, y: pos.y - this.size.center};

        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size,
            sign = this.signRadical.size;

        var hDg = degr.height + this.gap + this.signRadical.sizeTick.height;
        this.topDegr = this.size.height - hDg;

        var x1 = this.pos.x,
            y1 = this.pos.y + this.topDegr;

        this.elements[0][0].setPosition({x: x1, y: y1});

        var x2 = this.pos.x + degr.width - this.signRadical.sizeTick.width,
            y2 = this.pos.y + this.size.height - sign.height;

        this.signRadical.setPosition({x: x2, y: y2});

        var x3 = this.pos.x + this.size.width - base.width,
            y3 = this.pos.y + this.size.center - base.center;

        this.elements[0][1].setPosition({x: x3, y: y3});
    }

}
CRadical.prototype.findDisposition = function(mCoord)
{
    var disposition;

    if(this.type == SQUARE_RADICAL)
    {
        var sizeBase = this.elements[0][0].size;
        var X, Y;
        var inside_flag = -1;

        if(mCoord.x < this.gapLeft)
        {
            X = 0;
            inside_flag = 0;
        }
        else if(mCoord.x > this.gapLeft + sizeBase.width)
        {
            X = sizeBase.width;
            inside_flag = 1;
        }
        else
            X = mCoord.x - this.gapLeft;

        if(mCoord.y < this.gapTop)
        {
            Y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > this.gapTop + sizeBase.height)
        {
            Y = sizeBase.height;
            inside_flag = 2;
        }
        else
            Y = mCoord.y - this.gapTop;

        disposition = {pos: {x:0, y:0}, mCoord: {x: X, y: Y}, inside_flag: inside_flag};
    }
    else if(this.type == DEGREE_RADICAL)
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

            if(mCoord.y < this.topDegr)
            {
                mouseCoord.y = 0;
                inside_flag = 2;
            }
            else if(mCoord.y > degr.height + this.topDegr)
            {
                mouseCoord.y = degr.height;
                inside_flag = 2;
            }
            else
            {
                mouseCoord.y = mCoord.y - this.topDegr;
            }
        }
        else
        {
            posCurs.y = 1;

            mouseCoord.x = mCoord.x - (this.size.width - base.width);
            var topBase = this.size.center - base.center;

            if(mCoord.y < topBase)
            {
                mouseCoord.y = 0;
                inside_flag = 2;
            }
            else if(mCoord.y > base.height + topBase)
            {
                mouseCoord.y = base.height;
                inside_flag = 2;
            }
            else
                mouseCoord.y = mCoord.y - topBase;
        }

        disposition = {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
    }

    return disposition;
}
CRadical.prototype.draw = function(pGraphics)
{
    this.signRadical.draw(pGraphics);
    CRadical.superclass.draw.call(this, pGraphics);
}
CRadical.prototype.getBase = function()
{
    var base = null;

    if(this.type == SQUARE_RADICAL)
        base = this.elements[0][0];
    else if(this.type == DEGREE_RADICAL)
        base = this.elements[0][1];

    return base;
}
CRadical.prototype.getDegree = function()
{
    var degree = null;
    if(this.type == DEGREE_RADICAL)
        degree = this.elements[0][0];

    return degree;
}

function old_CRadical()
{
    this.signRadical = null;
    CMathBase.call(this);
}
extend(old_CRadical, CMathBase);
old_CRadical.prototype.init = function()
{
    this.setDimension(1, 1);
    this.setContent();

    this.signRadical = new CSignRadical();
    this.signRadical.relate(this);
}
old_CRadical.prototype.recalculateSize = function()
{
    this.signRadical.recalculateSize();

    var sign = this.signRadical.size;
    var arg = this.elements[0][0].size;

    var height = sign.height,
        width  = sign.width,
        center = (height - arg.height)*0.6  + arg.center;

    this.size = {width: width, height: height, center: center};
}
old_CRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};
    this.gapLeft = this.size.width - this.elements[0][0].size.width;
    this.gapTop = this.size.center - this.elements[0][0].size.center;

    var x = this.pos.x + this.gapLeft,
        y = this.pos.y + this.gapTop;

    this.signRadical.setPosition(this.pos);
    this.elements[0][0].setPosition({x: x, y: y });
}
old_CRadical.prototype.findDisposition = function(mCoord)
{
    var sizeBase = this.elements[0][0].size;
    var X, Y;
    var inside_flag = -1;

    if(mCoord.x < this.gapLeft)
    {
        X = 0;
        inside_flag = 0;
    }
    else if(mCoord.x > this.gapLeft + sizeBase.width)
    {
        X = sizeBase.width;
        inside_flag = 1;
    }
    else
        X = mCoord.x - this.gapLeft;

    if(mCoord.y < this.gapTop)
    {
        Y = 0;
        inside_flag = 2;
    }
    else if(mCoord.y > this.gapTop + sizeBase.height)
    {
        Y = sizeBase.height;
        inside_flag = 2;
    }
    else
        Y = mCoord.y - this.gapTop;

    return {pos: {x:0, y:0}, mCoord: {x: X, y: Y}, inside_flag: inside_flag};

}
old_CRadical.prototype.draw = function()
{
    this.elements[0][0].draw();
    this.signRadical.draw();
}
old_CRadical.prototype.getBase = function()
{
    return this.elements[0][0];
}

function old_CDegreeRadical()
{
    this.signRadical = null;
    this.gap = null;
    this.topDegr = null;
    CMathBase.call(this);
}
extend(old_CDegreeRadical, CMathBase);
old_CDegreeRadical.prototype.init = function()
{
    this.setDimension(1, 2);

    this.signRadical = new CSignRadical();
    this.signRadical.relate(this);

    var oBase = new CMathContent();

    var oDegree = new CMathContent();
    oDegree.setReduct(DEGR_REDUCT);

    this.addMCToContent(oDegree, oBase);
}
old_CDegreeRadical.prototype.recalculateSize = function()
{
    this.signRadical.recalculateSize();

    var degr = this.elements[0][0].size,
        base = this.elements[0][1].size,
        sign = this.signRadical.size;

    var wTick = this.signRadical.sizeTick.width,
        hTick = this.signRadical.sizeTick.height;

    var width = degr.width - wTick + sign.width;

    var txtPrp = this.getTxtPrp();
    var plH = 9.877777777777776 * txtPrp.FontSize /36;

    if( sign.height < plH )
        this.gap = 1.5*txtPrp.FontSize/36;
    else
        this.gap = 3.5*txtPrp.FontSize/36;

    var h1 = degr.height + this.gap + hTick,
        h2 = sign.height;

    var height, center;

    if(h1 > h2)
    {
        height =  h1;
        center = h1 - h2 + (sign.height - base.height)*0.6  + base.center;
    }
    else
    {
        height =  h2;
        center = (sign.height - base.height)*0.6  + base.center;
    }

    this.size = {width: width, height: height, center: center};
}
old_CDegreeRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    var degr = this.elements[0][0].size,
        base = this.elements[0][1].size,
        sign = this.signRadical.size;

    var hDg = degr.height + this.gap + this.signRadical.sizeTick.height;
    this.topDegr = this.size.height - hDg;

    var x1 = this.pos.x,
        y1 = this.pos.y + this.topDegr;

    this.elements[0][0].setPosition({x: x1, y: y1});

    var x2 = this.pos.x + degr.width - this.signRadical.sizeTick.width,
        y2 = this.pos.y + this.size.height - sign.height;

    this.signRadical.setPosition({x: x2, y: y2});

    var x3 = this.pos.x + this.size.width - base.width,
        y3 = this.pos.y + this.size.center - base.center;

    this.elements[0][1].setPosition({x: x3, y: y3});
}
old_CDegreeRadical.prototype.draw = function(pGraphics)
{
    this.signRadical.draw();
    old_CDegreeRadical.superclass.draw.call(this, pGraphics);
}
old_CDegreeRadical.prototype.findDisposition = function(mCoord)
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

        if(mCoord.y < this.topDegr)
        {
            mouseCoord.y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > degr.height + this.topDegr)
        {
            mouseCoord.y = degr.height;
            inside_flag = 2;
        }
        else
        {
            mouseCoord.y = mCoord.y - this.topDegr;
        }
    }
    else
    {
        posCurs.y = 1;

        mouseCoord.x = mCoord.x - (this.size.width - base.width);
        var topBase = this.size.center - base.center;

        if(mCoord.y < topBase)
        {
            mouseCoord.y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > base.height + topBase)
        {
            mouseCoord.y = base.height;
            inside_flag = 2;
        }
        else
            mouseCoord.y = mCoord.y - topBase;
    }

    return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
}
old_CDegreeRadical.prototype.getBase = function()
{
    return this.elements[0][1];
}
old_CDegreeRadical.prototype.getDegree = function()
{
    return this.elements[0][0];
}

