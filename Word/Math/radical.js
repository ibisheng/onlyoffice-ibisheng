function CSignRadical()
{
    this.Parent = null;
    this.pos = null;

    this.size = null;
    this.sizeTick = null;
    this.widthSlash = null;
}
CSignRadical.prototype.draw = function(x, y, pGraphics)
{
    var txtPrp = this.Parent.getCtrPrp();
    //var txtPrp = this.Parent.getTxtPrp();
    var penW = txtPrp.FontSize*g_dKoef_pt_to_mm*0.042;

    y += penW/2; // смещаем, для отрисовки верхней линии радикала

    var x1 = this.pos.x + x,
        //x2 = x1 + 0.2*this.widthSlash;
        x2 = x1 + 0.044*txtPrp.FontSize;

    var y2 = this.pos.y + y + this.size.height - this.sizeTick.height,
        y1 = y2 + 0.11*this.widthSlash;


    var tX = 1.7*penW * 0.5 * 25.4/96,
        tY = (-1)*tX * 11/25 *0.5; // 11/25 - тангенс угла наклона

    var tg =  0.2/0.11;
    var tX = tg*0.85*penW,
        tY = 0.92*penW / tg;

    var x3 = x2,
        y3 = y2 - tY;

    /*var minHeight = plH * 1.1304931640625,
     maxHeight = plH * 7.029296875;

     var maxWidth = plH * 0.81171875;

     var k = 0.2*maxWidth/(maxHeight - minHeight),
     b = maxWidth*0.3 - k*minHeight;*/

    var plH = 9.877777777777776 * txtPrp.FontSize /36;

    // widthSlash = plH * 0.81171875;
    // 1.393 * widthSlash

    /*var k = 0.00343247*this.widthSlash,
        b = 0.3*this.widthSlash - 1.130493*plH*k;*/

    /*var k = 0.00343247*this.widthSlash,
        b = 0.3*this.widthSlash - 1.393*this.widthSlash*k;*/


    /*if(this.size.height < plH*7.029296875)
        x4 = x3 + k*this.size.height + b;
    else
        x4 = x1 + this.widthSlash;*/

    var x4, y4,
        x5, y5;

    y4 = this.pos.y + y + this.size.height - penW;

    var sin = 0.876,
        cos = 0.474;

    y5 = y4 + penW/2*cos;

    if(this.size.height < plH*7.029296875)
    {
        x4 = x3 + (y4-y3)/tg;
    }
    else
    {
        x4 = x1 + this.widthSlash - penW/3*sin;
    }

    x5 = x4 + penW/2*sin;

    var x6 = x1 + this.widthSlash,
        x7 = this.pos.x + x + this.size.width;

    var y6 = this.pos.y + y,
        y7 = this.pos.y + y;



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


    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    pGraphics.p_width(penW*1000);
    pGraphics._s();
    pGraphics._m(x5, y5);
    pGraphics._l(x6, y6);
    pGraphics._l(x7, y7);
    pGraphics.ds();

    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    pGraphics._s();
    pGraphics._m(x4 - penW*0.6*sin, y4 - penW/6);
    pGraphics._l(x5 + penW/3*sin, y4 - penW/6);
    pGraphics.ds();

}
CSignRadical.prototype.old_draw = function(x, y, pGraphics)
{
    var txtPrp = this.Parent.getCtrPrp();
    //var txtPrp = this.Parent.getTxtPrp();
    var penW = txtPrp.FontSize*g_dKoef_pt_to_mm*0.042;

    y += penW/2; // смещаем, для отрисовки верхней линии радикала

    var plH = 9.877777777777776 * txtPrp.FontSize /36;

    var x1 = this.pos.x + x,
        x2 = x1 + 0.25*this.widthSlash;

    var y2 = this.pos.y + y + this.size.height - this.sizeTick.height,
        y1 = y2 + 0.11*this.widthSlash;


    var tX = 1.7*penW * 0.5 * 25.4/96,
        tY = (-1)*tX * 11/25 *0.5; // 11/25 - тангенс угла наклона

    var x3 = x2 - tX,
        y3 = y2 - tY;

    var x4;

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

    var y4 = this.pos.y + y + this.size.height - penW;

    var x5 = x1 + this.widthSlash,
        x6 = this.pos.x + x + this.size.width;

    var y5 = this.pos.y + y,
        y6 = this.pos.y + y;

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
CSignRadical.prototype.old_recalculateSize = function()
{
    //var txtPrp = this.Parent.getTxtPrp();
    var txtPrp = this.Parent.getCtrPrp();
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
        //maxHgtTick = plH * 1.50732422;
        maxHgtTick = 0.9*plH;

    var heightTick, widthTick;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthTick = 0.1196002747872799*txtPrp.FontSize;
    }
    else
    {
        var alpha = (heightArg - minHgtRad)/maxHgtRad;
        heightTick = minHgtTick*(1 + alpha);

        widthTick = 0.1196002747872799*txtPrp.FontSize;
    }

    ////// width //////
    //var widthSlash = plH * 0.9385498046875003;
    var widthSlash = plH * 0.81171875;
    gap = 0.12683105468750022* plH;
    width = widthSlash + gap + widthArg;
    //////

    this.sizeTick =
    {
        width : widthTick,
        height : heightTick
    };

    this.widthSlash = widthSlash;

    this.size = {height: height, width: width};
}

CSignRadical.prototype.recalculateSize = function()
{
    //var txtPrp = this.Parent.getTxtPrp();
    var txtPrp = this.Parent.getCtrPrp();
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
        maxHgtTick = 1.25*plH;

    var heightTick, widthTick,
        gap, widthSlash;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthTick = 0.1196002747872799*txtPrp.FontSize;

        widthSlash = plH * 0.7;
        gap = 0.12683105468750022* plH;
    }
    else
    {
        var alpha = (heightArg - minHgtRad)/maxHgtRad;
        heightTick = minHgtTick*(1 + alpha);

        widthSlash = plH * 0.81171875;
        gap = 0.12683105468750022* plH;

        widthTick = 0.1196002747872799*txtPrp.FontSize;
    }

    ////// width //////
    //var widthSlash = plH * 0.9385498046875003;

    width = widthSlash + gap + widthArg;
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
    this.kind = MATH_RADICAL;

    this.type = SQUARE_RADICAL; // default
    this.degHide = false;
    this.signRadical = null;
    CMathBase.call(this);
}
extend(CRadical, CMathBase);
CRadical.prototype.init = function(props)
{
    /*if(typeof(props.type) !== "undefined" && props.type !== null)
        this.type = props.type;*/

    if(props.type === SQUARE_RADICAL)
        this.type = SQUARE_RADICAL;
    else if(props.type === DEGREE_RADICAL)
        this.type = DEGREE_RADICAL;

    if(props.degHide === true || props.degHide === 1)
        this.type = SQUARE_RADICAL;
    else if(props.degHide == false || props.degHide === 0)
        this.type = DEGREE_RADICAL;

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
        oDegree.decreaseArgSize();

        this.addMCToContent(oDegree, oBase);
    }
}
CRadical.prototype.recalculateSize = function()
{
    this.signRadical.recalculateSize();

    var txtPrp = this.getCtrPrp();
    var gapTop = 2.2*txtPrp.FontSize /36,
        sign = this.signRadical.size;


    if(this.type == SQUARE_RADICAL)
    {
        var base = this.elements[0][0].size;

        var shTop = (sign.height - gapTop - base.height)/2;

        var height = sign.height,
            width  = sign.width,
            ascent = gapTop + shTop + base.ascent;
            //ascent = height - (base.height - base.ascent);

        this.size = {width: width, height: height, ascent: ascent};
    }
    else if(this.type == DEGREE_RADICAL)
    {
        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size;

        var wTick = this.signRadical.sizeTick.width,
            hTick = this.signRadical.sizeTick.height;

        var wDegree = degr.width > wTick ? degr.width - wTick : 0;
        var width = wDegree + sign.width;
        //var width = degr.width - wTick + sign.width;

        var plH = 9.877777777777776 * txtPrp.FontSize /36;

        if( sign.height < plH )
            this.gap = 1.5*txtPrp.FontSize/36;
        else
            this.gap = 3.5*txtPrp.FontSize/36;

        var h1 = degr.height + this.gap + hTick,
            h2 = sign.height;

        var height, ascent;
        var shTop = (sign.height - gapTop - base.height)/2;

        if(h1 > h2)
        {
            height =  h1;
            ascent = height - shTop - (base.height - base.ascent);
            //ascent =  height - (base.height - base.ascent);
        }
        else
        {
            height =  h2;
            ascent = height - shTop - (base.height - base.ascent);
            //ascent =  height - (base.height - base.ascent);
        }

        this.size = {width: width, height: height, ascent: ascent};
    }
}
CRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    if(this.type == SQUARE_RADICAL)
    {

        this.gapLeft = this.size.width - this.elements[0][0].size.width;
        this.gapTop = this.size.ascent - this.elements[0][0].size.ascent;

        var x = this.pos.x + this.gapLeft,
            y = this.pos.y + this.gapTop;

        this.signRadical.setPosition(this.pos);
        this.elements[0][0].setPosition({x: x, y: y });
    }
    else if(this.type == DEGREE_RADICAL)
    {
        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size,
            sign = this.signRadical.size;

        var wTick = this.signRadical.sizeTick.width,
            hTick = this.signRadical.sizeTick.height;

        var hDg = degr.height + this.gap + hTick;
        this.topDegr = this.size.height - hDg;

        var x1 = this.pos.x,
            y1 = this.pos.y + this.topDegr;

        this.elements[0][0].setPosition({x: x1, y: y1});

        var wDegree = degr.width > wTick ? degr.width - wTick : 0;
        var x2 = this.pos.x + wDegree,
            y2 = this.pos.y + this.size.height - sign.height;

        this.signRadical.setPosition({x: x2, y: y2});

        var x3 = this.pos.x + this.size.width - base.width,
            y3 = this.pos.y + this.size.ascent - base.ascent;

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
            var topBase = this.size.ascent - base.ascent;

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
CRadical.prototype.draw = function(x, y, pGraphics)
{
    this.signRadical.draw(x, y, pGraphics);
    CRadical.superclass.draw.call(this, x, y, pGraphics);
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
    /*var degree = null;
    if(this.type == DEGREE_RADICAL)
        degree = this.elements[0][0];
    else if(this.type = SQUARE_RADICAL)
        degree = this.elements[0][0];*/

    // для стремной ситуации, когда руками в xml выставили в degHide true, а объект со степенью имеется. Возвращаем основание

    return  this.elements[0][0];
}
CRadical.prototype.getPropsForWrite = function()
{
    var props = {};

    props.degHide = this.type == SQUARE_RADICAL ? 1 : 0;

    return props;
}


