// 0x300  accent grave
// 0x301  accent acute
// 0x307  one dot
// 0x308  two dots
// 0x20DB three dots
// 0x332  single line
// 0x333  double line
// 0x303  tilde
// 0x302  circumflex
// 0x306  breve
// 0x20D6 left arrow
// 0x20D7 right arrow
// 0x20D0 half left arrow (harpoon)
// 0x20D1 half right arrow (harpoon)


function CCircumflex()
{
    //this.incline = 0;
    this.Parent = null;
    this.turn = TURN_0;
}
CCircumflex.prototype.init = function(props)
{
    this.turn = props.turn;
}
CCircumflex.prototype.fixSize = function(oMeasure, stretch, bIncl)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width = 3.88*alpha;
    var height = 3.175*alpha;

    var augm = 0.9*stretch/width;

    if(augm < 1)
        augm = 1;
    else if (augm > 5)
        augm = 5;

    /*var angle = 0.1;

    if( bIncl )
        this.incline = mSize.height*angle;*/

    width *= augm;

    /*var Arg = this.elements[0][0].size,
        Accent = {width: augm*this.accentSize.width, height: this.accentSize.height};

    var _height = Arg.height + Accent.height;
    var _center = Arg.center + Accent.height;

    var incline = 0;
    if( this.IsIncline() )
        incline = Arg.height*this.ANGLE;

    if(Arg.width < Accent.width)
    {
        this.shiftAccent = incline;
        this.shiftArg = (Arg.width - Accent.width)/2;

        _width = Accent.width + incline;
    }
    else
    {
        var align = (Arg.width - Accent.width)/2 + incline;
        _width = Arg.width > Accent.width + align ? Arg.width : Accent.width + align ;
        this.shiftAccent = align;
        this.shiftArg = 0;
    }*/

    this.size = {width: width, height: height};

}
CCircumflex.prototype.draw = function(x, y, pGraphics)
{
    var xx = this.pos.x + x,
        yy = this.pos.y + y;

    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;

    penW *= 96/25.4;

    // g_dKoef_px_to_mm = 25.4/96

    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 2373;
    X[1] = 9331; Y[1] = 15494;
    X[2] = 14913; Y[2] = 15494;
    X[3] = 23869; Y[3] = 2373;
    X[4] = 20953; Y[4] = 0;
    X[5] = 12122; Y[5] = 10118;
    X[6] = 11664; Y[6] = 10118;
    X[7] = 2833; Y[7] = 0;
    X[8] = 0; Y[8] = 2373;


    var XX = new Array(),
        YY = new Array();

    var W = this.size.width/alpha;

    var a1 = X[3] - X[0], b1 = W,            c1 = X[2] - X[1],
        a2 = X[4] - X[7], b2 = W - 2*X[7],   c2 = X[5] - X[6] ; //X[8] = 0


    var RX = new Array();
    for(var i = 0; i < X.length; i++)
        RX[i] = 1;

    RX[0] = RX[2] = (b1 - c1)/(a1-c1);
    RX[4] = RX[6] =  (b2 - c2)/(a2-c2);


    XX[0] = XX[8] = X[0];
    YY[0] = YY[8] = Y[0];

    for(var i = 0; i< 4; i++)
    {
        XX[1 + i] = XX[i] + RX[i]*(X[1+i] - X[i]);
        XX[7-i]   = XX[8 - i] + RX[7-i]*(X[7-i] - X[8-i]);
        YY[1+i] = Y[1+i];
        YY[7-i] = Y[7-i];
    }

    var a,b;

    if(this.turn == TURN_0) // вверх
    {
        a = 0;
        b = 1;
    }
    else if(this.turn == TURN_MIRROR_0)
    {
        a = YY[1];
        b = -1;
    }

    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = xx + XX[i]*alpha ;
        YY[i] = yy + (a + b*YY[i])*alpha;
    }

    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);

    pGraphics.p_width(penW*1000);
    pGraphics.b_color1(0,0,0, 255);
    pGraphics._s();

    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);

    pGraphics.df();

    pGraphics.SetIntegerGrid(intGrid);

}
CCircumflex.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CCircumflex.prototype.relate = function(parent)
{
    this.Parent = parent;
}

function CAccentCircumflex()
{
    CGlyphOperator.call(this);
}
extend(CAccentCircumflex, CGlyphOperator);
CAccentCircumflex.prototype.calcSize = function(stretch)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width = 3.88*alpha;
    var height = 3.175*alpha;

    var augm = 0.9*stretch/width;

    if(augm < 1)
        augm = 1;
    else if (augm > 5)
        augm = 5;

    width *= augm;

    return {width: width, height: height};
}
CAccentCircumflex.prototype.calcCoord = function(stretch)
{
    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    //var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    //penW *= 96/25.4;

    // g_dKoef_px_to_mm = 25.4/96

    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 2373;
    X[1] = 9331; Y[1] = 15494;
    X[2] = 14913; Y[2] = 15494;
    X[3] = 23869; Y[3] = 2373;
    X[4] = 20953; Y[4] = 0;
    X[5] = 12122; Y[5] = 10118;
    X[6] = 11664; Y[6] = 10118;
    X[7] = 2833; Y[7] = 0;
    X[8] = 0; Y[8] = 2373;


    var XX = new Array(),
        YY = new Array();

    var W = stretch/alpha;

    var a1 = X[3] - X[0], b1 = W,            c1 = X[2] - X[1],
        a2 = X[4] - X[7], b2 = W - 2*X[7],   c2 = X[5] - X[6] ; //X[8] = 0


    var RX = new Array();
    for(var i = 0; i < X.length; i++)
        RX[i] = 1;

    RX[0] = RX[2] = (b1 - c1)/(a1-c1);
    RX[4] = RX[6] =  (b2 - c2)/(a2-c2);


    XX[0] = XX[8] = X[0];
    YY[0] = YY[8] = Y[0];

    for(var i = 0; i< 4; i++)
    {
        XX[1 + i] = XX[i] + RX[i]*(X[1+i] - X[i]);
        XX[7-i]   = XX[8 - i] + RX[7-i]*(X[7-i] - X[8-i]);
        YY[1+i] = Y[1+i];
        YY[7-i] = Y[7-i];
    }

    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = XX[i]*alpha ;
        YY[i] = YY[i]*alpha;
    }

    var H = YY[1];
    W = XX[3];

    return {XX: XX, YY: YY, W: W, H: H};
}
CAccentCircumflex.prototype.drawPath = function(pGraphics, XX, YY)
{
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics._l(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);
    pGraphics._l(XX[10], YY[10]);
    pGraphics._l(XX[11], YY[11]);
}

function CLine()
{
    this.PEN_W = 0.04;
    this.Parent = null;
}
CLine.prototype.init = function(props)
{

}
CLine.prototype.fixSize = function(oMeasure, stretch)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var height = 1.68*alpha;
    var width  = 4.938*alpha;

    width = stretch > width ? stretch : width;

    this.size = {width: width, height: height}
}
CLine.prototype.draw = function(x, y, pGraphics)
{
    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    //penW *= 96/25.4;

    //var penY = penW/2*25.4/96; //для того чтобы линии совпадали (для одинарной и двойной черты)
    var penY = penW/2; //для того чтобы линии совпадали (для одинарной и двойной черты)

    // g_dKoef_px_to_mm = 25.4/96

    var shY = this.size.height * 0.15386904761904763; // чтобы линии совпадали

    var x1 = this.pos.x + x,
        y1 = this.pos.y + y + penY + shY,
        x2 = x1 + this.size.width,
        y2 = y1;

    pGraphics.p_width(penW*1000);
    pGraphics.p_color(0,0,0, 255);
    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics.ds();

}
CLine.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CLine.prototype.relate = function(parent)
{
    this.Parent = parent;
}

function CAccentLine()
{
    CGlyphOperator.call(this);
}
extend(CAccentLine, CGlyphOperator);
CAccentLine.prototype.calcSize = function(stretch)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var height = 1.68*alpha;
    var width  = 4.938*alpha;

    width = stretch > width ? stretch : width;

    return {width: width, height: height};
}
CAccentLine.prototype.calcCoord = function(stretch)
{
    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;

    var X = new Array(),
        Y = new Array();

    X[0] = 0;          Y[0] = 0;
    X[1] = stretch;    Y[1] = 0;
    X[2] = stretch;    Y[2] = 0.011*fontSize;
    X[3] = 0;          Y[3] = Y[2];
    X[4] = 0;          Y[4] = 0;

    var W = X[2],
        H = Y[2];

    return {XX: X, YY: Y, W: W, H: H};
}
CAccentLine.prototype.drawPath = function(pGraphics, XX, YY)
{
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
}

function CDoubleLine()
{
    this.PEN_W = 0.04;
    this.Parent = null;
}
CDoubleLine.prototype.init = function(props)
{

}
CDoubleLine.prototype.fixSize = function(oMeasure, stretch)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var height = 2.843*alpha;
    var width  = 4.938*alpha;

    width = stretch > width ? stretch : width;

    this.size = {width: width, height: height}
}
CDoubleLine.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CDoubleLine.prototype.draw = function(x, y, pGraphics)
{
    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    //penW *= 96/25.4;

    //var penY = penW/2*25.4/96; //для того чтобы линии совпадали (для одинарной и двойной черты)
    var penY = penW/2; //для того чтобы линии совпадали (для одинарной и двойной черты)

    var x1 = this.pos.x + x,
        y1 = this.pos.y + y + penY,
        x2 = x1 + this.size.width,
        y2 = y1,
        x3 = x1,
        y3 = y1 + this.size.height/2,
        x4 = x2,
        y4 = y3;

    pGraphics.p_width(penW*1000);
    pGraphics.p_color(0,0,0, 255);
    pGraphics._s();
    pGraphics._m(x1, y1);
    pGraphics._l(x2, y2);
    pGraphics._m(x3, y3);
    pGraphics._l(x4, y4);
    pGraphics.ds();

}
CDoubleLine.prototype.relate = function(parent)
{
    this.Parent = parent;
}

function CAccentDoubleLine()
{
    CGlyphOperator.call(this);
}
extend(CAccentDoubleLine, CGlyphOperator);
CAccentDoubleLine.prototype.calcSize = function(stretch)
{
    var alpha = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var height = 2.843*alpha;
    var width  = 4.938*alpha;

    width = stretch > width ? stretch : width;

    return {width: width, height: height};
}
CAccentDoubleLine.prototype.calcCoord = function(stretch)
{
    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;

    var X = new Array(),
        Y = new Array();

    X[0] = 0;          Y[0] = 0;
    X[1] = stretch;    Y[1] = 0;
    X[2] = stretch;    Y[2] = 0.011*fontSize;
    X[3] = 0;          Y[3] = Y[2];
    X[4] = 0;          Y[4] = 0;

    X[5] = 0;          Y[5] = 0.039486*fontSize;
    X[6] = stretch;    Y[6] = Y[5];
    X[7] = stretch;    Y[7] = 0.0503*fontSize;
    X[8] = 0;          Y[8] = Y[7];
    X[9] = 0;          Y[9] = Y[5];

    var W = X[7],
        H = Y[7];

    return {XX: X, YY: Y, W: W, H: H};
}
CAccentDoubleLine.prototype.drawPath = function(pGraphics, XX, YY)
{
    pGraphics._m(XX[0], YY[0]);
    pGraphics._l(XX[1], YY[1]);
    pGraphics._l(XX[2], YY[2]);
    pGraphics._l(XX[3], YY[3]);
    pGraphics._l(XX[4], YY[4]);
    pGraphics.df();

    pGraphics._s();
    pGraphics._m(XX[5], YY[5]);
    pGraphics._l(XX[6], YY[6]);
    pGraphics._l(XX[7], YY[7]);
    pGraphics._l(XX[8], YY[8]);
    pGraphics._l(XX[9], YY[9]);

}

function CTilde()
{
}
CTilde.prototype.init = function(props)
{

}
CTilde.prototype.fixSize = function()
{
    var betta = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width = 9.047509765625*betta; // реальная на отрисовке width 7.495282031249999
    var height = 2.469444444444444*betta;

    this.size = {width: width, height: height};
}
CTilde.prototype.draw = function(x, y, pGraphics)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 3066;
    X[1] = 2125; Y[1] = 7984;
    X[2] = 5624; Y[2] = 11256;
    X[3] = 9123; Y[3] = 14528;
    X[4] = 13913; Y[4] = 14528;
    X[5] = 18912; Y[5] = 14528;
    X[6] = 25827; Y[6] = 10144;
    X[7] = 32742; Y[7] = 5760;
    X[8] = 36324; Y[8] = 5760;
    X[9] = 39865; Y[9] = 5760;
    X[10] = 42239; Y[10] = 7641;
    X[11] = 44614; Y[11] = 9522;
    X[12] = 47030; Y[12] = 13492;
    X[13] = 50362; Y[13] = 11254;
    X[14] = 48571; Y[14] = 7544;
    X[15] = 44697; Y[15] = 3772;
    X[16] = 40823; Y[16] = 0;
    X[17] = 35283; Y[17] = 0;
    X[18] = 29951; Y[18] = 0;
    X[19] = 23098; Y[19] = 4384;
    X[20] = 16246; Y[20] = 8768;
    X[21] = 12622; Y[21] = 8768;
    X[22] = 9581; Y[22] = 8768;
    X[23] = 7290; Y[23] = 6845;
    X[24] = 4999; Y[24] = 4922;
    X[25] = 3249; Y[25] = 1243;
    X[26] = 0; Y[26] = 3066;


    var XX = new Array(),
        YY = new Array();

    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96


    var align = this.size.width - X[13]*alpha;
    var xx = this.pos.x + x + align/2,
        yy = this.pos.y + y;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = xx + X[i]*alpha;
        YY[i] = yy + (Y[5] - Y[i])*alpha*0.65; // сжали !
    }


    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    penW *= 96/25.4;

    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);

    pGraphics.p_width(penW*1000);
    pGraphics.b_color1(0,0,0, 255);
    pGraphics._s();

    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] );
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    pGraphics._l(XX[13], YY[13]);
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    pGraphics._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    pGraphics._l(XX[26], YY[26]);

    pGraphics.df();

    pGraphics.SetIntegerGrid(intGrid);
}
CTilde.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CTilde.prototype.relate = function(parent)
{
    this.Parent = parent;
}

function CAccentTilde()
{
    CGlyphOperator.call(this);
}
extend(CAccentTilde, CGlyphOperator);
CAccentTilde.prototype.calcSize = function(stretch)
{
    var betta = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width = 9.047509765625*betta; // реальная на отрисовке width 7.495282031249999
    var height = 2.469444444444444*betta;

    return {width: width, height: height};
}
CAccentTilde.prototype.calcCoord = function(stretch)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 3066;
    X[1] = 2125; Y[1] = 7984;
    X[2] = 5624; Y[2] = 11256;
    X[3] = 9123; Y[3] = 14528;
    X[4] = 13913; Y[4] = 14528;
    X[5] = 18912; Y[5] = 14528;
    X[6] = 25827; Y[6] = 10144;
    X[7] = 32742; Y[7] = 5760;
    X[8] = 36324; Y[8] = 5760;
    X[9] = 39865; Y[9] = 5760;
    X[10] = 42239; Y[10] = 7641;
    X[11] = 44614; Y[11] = 9522;
    X[12] = 47030; Y[12] = 13492;
    X[13] = 50362; Y[13] = 11254;
    X[14] = 48571; Y[14] = 7544;
    X[15] = 44697; Y[15] = 3772;
    X[16] = 40823; Y[16] = 0;
    X[17] = 35283; Y[17] = 0;
    X[18] = 29951; Y[18] = 0;
    X[19] = 23098; Y[19] = 4384;
    X[20] = 16246; Y[20] = 8768;
    X[21] = 12622; Y[21] = 8768;
    X[22] = 9581; Y[22] = 8768;
    X[23] = 7290; Y[23] = 6845;
    X[24] = 4999; Y[24] = 4922;
    X[25] = 3249; Y[25] = 1243;
    X[26] = 0; Y[26] = 3066;


    var XX = new Array(),
        YY = new Array();

    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96


    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = (Y[5] - Y[i])*alpha*0.65; // сжали !
    }

    var W = X[13],
        H = Y[5];

    return {XX: X, YY: Y, W: W, H: H};
}
CAccentTilde.prototype.drawPath = function(pGraphics, XX, YY)
{
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    pGraphics._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] );
    pGraphics._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    pGraphics._l(XX[13], YY[13]);
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    pGraphics._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    pGraphics._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    pGraphics._l(XX[26], YY[26]);
}

function CBreve()
{
    this.turn = TURN_MIRROR_0;
}
CBreve.prototype.init = function(props)
{
    this.turn = props.turn;
}
CBreve.prototype.fixSize = function()
{
    var betta = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width =  4.2333333333333325*betta;
    var height = 2.469444444444445*betta;

    this.size = {width: width, height: height};
}
CBreve.prototype.setPosition = function(pos)
{
    this.pos = pos;
}
CBreve.prototype.draw = function(x, y, pGraphics)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 25161; Y[0] = 11372;
    X[1] = 24077; Y[1] = 5749;
    X[2] = 20932; Y[2] = 2875;
    X[3] = 17787; Y[3] = 0;
    X[4] = 12247; Y[4] = 0;
    X[5] = 7082; Y[5] = 0;
    X[6] = 4083; Y[6] = 2854;
    X[7] = 1083; Y[7] = 5707;
    X[8] = 0; Y[8] = 11372;
    X[9] = 3208; Y[9] = 12371;
    X[10] = 4249; Y[10] = 9623;
    X[11] = 5561; Y[11] = 8083;
    X[12] = 6873; Y[12] = 6542;
    X[13] = 8456; Y[13] = 5959;
    X[14] = 10039; Y[14] = 5376;
    X[15] = 12414; Y[15] = 5376;
    X[16] = 14746; Y[16] = 5376;
    X[17] = 16454; Y[17] = 5980;
    X[18] = 18162; Y[18] = 6583;
    X[19] = 19558; Y[19] = 8124;
    X[20] = 20953; Y[20] = 9665;
    X[21] = 21953; Y[21] = 12371;
    X[22] = 25161; Y[22] = 11372;


    var XX = new Array(),
        YY = new Array();

    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96


    var align = this.size.width - X[22]*alpha;
    var xx = this.pos.x + x + align/2,
        yy = this.pos.y + y;

    var a, b;
    if(this.turn == TURN_0)
    {
        a = 0; b = 1;
    }
    else
    {
        a = Y[22]; // height
        b = -1;
    }


    for(var i = 0; i < X.length; i++)
    {
        XX[i] = xx + X[i]*alpha ;
        YY[i] = yy + (a + b*Y[i])*alpha ;
    }


    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    penW *= 96/25.4;

    var intGrid = pGraphics.GetIntegerGrid();
    pGraphics.SetIntegerGrid(false);

    pGraphics.p_width(penW*1000);
    pGraphics.b_color1(0,0,0, 255);
    pGraphics._s();

    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    pGraphics._l(XX[9], YY[9]);
    pGraphics._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    pGraphics._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    pGraphics._l(XX[22], YY[22]);

    pGraphics.df();

    pGraphics.SetIntegerGrid(intGrid);

}
CBreve.prototype.relate = function(parent)
{
    this.Parent = parent;
}

function CAccentBreve()
{
    CGlyphOperator.call(this);
}
extend(CAccentBreve, CGlyphOperator);
CAccentBreve.prototype.calcSize = function(stretch)
{
    var betta = this.Parent.Get_CompiledCtrPrp().FontSize/36;

    var width =  4.2333333333333325*betta;
    var height = 2.469444444444445*betta;

    return {width: width, height: height};
}
CAccentBreve.prototype.calcCoord = function(stretch)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 25161; Y[0] = 11372;
    X[1] = 24077; Y[1] = 5749;
    X[2] = 20932; Y[2] = 2875;
    X[3] = 17787; Y[3] = 0;
    X[4] = 12247; Y[4] = 0;
    X[5] = 7082; Y[5] = 0;
    X[6] = 4083; Y[6] = 2854;
    X[7] = 1083; Y[7] = 5707;
    X[8] = 0; Y[8] = 11372;
    X[9] = 3208; Y[9] = 12371;
    X[10] = 4249; Y[10] = 9623;
    X[11] = 5561; Y[11] = 8083;
    X[12] = 6873; Y[12] = 6542;
    X[13] = 8456; Y[13] = 5959;
    X[14] = 10039; Y[14] = 5376;
    X[15] = 12414; Y[15] = 5376;
    X[16] = 14746; Y[16] = 5376;
    X[17] = 16454; Y[17] = 5980;
    X[18] = 18162; Y[18] = 6583;
    X[19] = 19558; Y[19] = 8124;
    X[20] = 20953; Y[20] = 9665;
    X[21] = 21953; Y[21] = 12371;
    X[22] = 25161; Y[22] = 11372;


    var XX = new Array(),
        YY = new Array();

    var fontSize = this.Parent.Get_CompiledCtrPrp().FontSize;
    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha ;
        YY[i] = Y[i]*alpha ;
    }

    var H = YY[9],
        W = XX[0];

    return {XX: XX, YY: YY, W: W, H: H};
}
CAccentBreve.prototype.drawPath = function(pGraphics, XX, YY)
{
    pGraphics._m(XX[0], YY[0]);
    pGraphics._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    pGraphics._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    pGraphics._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    pGraphics._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    pGraphics._l(XX[9], YY[9]);
    pGraphics._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    pGraphics._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    pGraphics._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    pGraphics._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    pGraphics._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    pGraphics._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    pGraphics._l(XX[22], YY[22]);
}

function CSign()
{
    this.sign = new CMathText(true);
    this.typeOper = null;
    this.Parent = null;
}
CSign.prototype.init = function(props)
{
    var bDot        = props.code === 0x307 || props.type === ACCENT_ONE_DOT,
        b2Dots      = props.code === 0x308 || props.type === ACCENT_TWO_DOTS,
        b3Dots      = props.code === 0x20DB || props.type === ACCENT_THREE_DOTS,
        bAccGrave   = props.code === 0x300 || props.type === ACCENT_GRAVE,
        bAccAcute   = props.code === 0x301 || props.type === ACCENT_ACUTE;

    if(bDot)
    {
        this.typeOper = ACCENT_ONE_DOT;
        this.sign.add(0x307);
    }
    else if(b2Dots)
    {
        this.typeOper = ACCENT_TWO_DOTS;
        this.sign.add(0x308);
    }
    else if(b3Dots)
    {
        this.typeOper = ACCENT_THREE_DOTS;
        this.sign.add(0x20DB);
    }
    else if(bAccGrave)
    {
        this.typeOper = ACCENT_GRAVE;
        this.sign.add(0x300);
    }
    else if(bAccAcute)
    {
        this.typeOper = ACCENT_ACUTE;
        this.sign.add(0x301);
    }
    else
    {
        this.typeOper = ACCENT_TEXT;
        this.sign.add(props.code);
    }
}
CSign.prototype.setPosition = function(pos)
{
    this.sign.setPosition(pos);
}
/*CSign.prototype.setPosition = function(pos)
{
    var shX = 0;

    if(this.typeOper == ACCENT_GRAVE)
        shX = 1.1*this.sign.size.widthG;
    else if(this.typeOper == ACCENT_ACUTE)
        shX = 1.25*this.sign.size.widthG;
    else if(this.typeOper == ACCENT_ONE_DOT)
        shX = 1.53*this.sign.size.widthG;
    else if(this.typeOper == ACCENT_TWO_DOTS)
        shX = 0.95*this.sign.size.widthG;
    else if(this.typeOper == ACCENT_THREE_DOTS)
        shX = 0.015*this.sign.size.widthG;
    
    var position =
    {
        x: pos.x + shX,
        y: pos.y + this.sign.size.ascent
    };
    this.sign.setPosition(position);
}*/
CSign.prototype.fixSize = function(oMeasure, stretch, bIncline)
{
    var ctrPrp = this.Parent.Get_CompiledCtrPrp();

    var rPrp = new CTextPr();
    var defaultRPrp = this.Parent.ParaMath.Get_Default_TPrp();
    rPrp.Merge(defaultRPrp);
    rPrp.Merge(ctrPrp);
    rPrp.Italic = false; // не меняем значок
    rPrp.Bold = false;

    oMeasure.SetFont(rPrp);

    this.sign.Resize(this, oMeasure);

    /*if(this.typeOper == ACCENT_THREE_DOTS)
     this.dH = 1.2*ctrPrp.FontSize/36;
     else
     this.dH = 1.2*ctrPrp.FontSize/36;*/

    //var height = this.sign.size.height + this.dH,
    var height = this.sign.size.height,
        width = this.sign.size.widthG;

    if(bIncline)
        width += 0.1 * this.sign.size.height; // incline

    this.size = {width: width, height: height};
}
CSign.prototype.draw = function(x, y, pGraphics)
{
    this.sign.draw(x, y, pGraphics);
}
CSign.prototype.relate = function(parent)
{
    this.Parent = parent;
}
CSign.prototype.getCodeCharacter = function()
{
    return this.sign.value;
}

function CAccent(props)
{
	this.Id = g_oIdCounter.Get_NewId();
    this.kind = MATH_ACCENT;

    //// Properties
    this.Pr =
    {
        chr:        null,
        chrType:    null
    };

    /*this.chr  = null;
    this.chrType = null;
    this.loc = LOCATION_TOP;*/

    /////////////////

    this.operator = new COperator(OPER_ACCENT);

    //this.code = null;      // храним код буквы и тип здесь
    //this.typeOper = null;  // т.к в класах, которые вызываем, не учитываем случаи, когда элементы (стрелки/скобки) переворачиваются

    CMathBase.call(this);

    this.init(props);

	g_oTableId.Add( this, this.Id );	
}
extend(CAccent, CMathBase);
CAccent.prototype.init = function(props)
{
    this.Pr.chr     = props.chr;
    this.Pr.chrType = props.chrType;

    //this.operator.init(prp, defaultPrp);
    //this.operator.relate(this);

    this.setDimension(1, 1);
    this.setContent();

    this.elements[0][0].SetDot(true);

    if(props.ctrPrp !== null && typeof(props.ctrPrp) !== "undefined")
        this.setCtrPrp(props.ctrPrp);
}
CAccent.prototype.setChr = function(chr)
{
    this.Pr.chr = chr;
    this.Pr.chrType = null;
    this.RecalcInfo.bProps = true;
}
CAccent.prototype.setChrType = function(chrType)
{
    this.Pr.chr = null;
    this.Pr.chrType = chrType;
    this.RecalcInfo.bProps = true;
}
CAccent.prototype.old_init = function(properties)
{
    var type = properties.chrType,
        code;

    var typeOper, codeChr;
    var operator;

    ////    ВРЕМЕННО !!!!

    var bCode = false,
        bType = typeof(type) !== "undefined" && type !== null;

    if(typeof(properties.chr) === "string")
    {
        bCode = true;
        code = properties.chr.charCodeAt(0);
    }

    /*var bDot        = code === 0x307 || props.chr.type === ACCENT_ONE_DOT,
        b2Dots      = code === 0x308 || props.chr.type === ACCENT_TWO_DOTS,
        b3Dots      = code === 0x20DB || props.chr.type === ACCENT_THREE_DOTS,
        bAccGrave   = code === 0x300 || props.chr.type === ACCENT_GRAVE,
        bAccAcute   = code === 0x301 || props.chr.type === ACCENT_ACUTE;

    if(bDot || b2Dots || b3Dots || bAccGrave || bAccAcute)
    {
        this.accent = new CMathText();
        this.accent.add(code);
        typeOper = props.chr.type;
    }*/

    if(code === 0x302 || type === ACCENT_CIRCUMFLEX)
    {
        typeOper = ACCENT_CIRCUMFLEX;
        codeChr = 0x302;

        operator = new CCircumflex();
        var props =
        {
            turn:   TURN_MIRROR_0
        };
        operator.init(props);
    }
    else if(code === 0x30C || type === ACCENT_COMB_CARON)
    {
        typeOper = ACCENT_COMB_CARON;
        codeChr = 0x30C;

        operator = new CCircumflex();
        var props =
        {
            turn:   TURN_0
        };
        operator.init(props);
    }
    else if(code === 0x305 || type === ACCENT_LINE)
    {
        typeOper = ACCENT_LINE;
        //codeChr = 0x332;
        codeChr = 0x305;

        operator = new CLine();
    }
    else if(code === 0x33F || type === ACCENT_DOUBLE_LINE)
    {
        typeOper = ACCENT_DOUBLE_LINE;
        //codeChr = 0x333;
        codeChr = 0x33F;

        operator = new CDoubleLine();
    }
    else if(code === 0x303 || type === ACCENT_TILDE)
    {
        typeOper = ACCENT_TILDE;
        codeChr = 0x303;

        operator = new CTilde();
    }
    else if(code === 0x306 || type === ACCENT_BREVE)
    {
        typeOper = ACCENT_BREVE;
        codeChr = 0x306;

        operator = new CBreve();
        var props =
        {
            turn:   TURN_MIRROR_0
        };
        operator.init(props);
    }
    else if(code == 0x311 || type == ACCENT_INVERT_BREVE)
    {
        typeOper = ACCENT_INVERT_BREVE;
        codeChr = 0x311;

        operator = new CBreve();
        var props =
        {
            turn:   TURN_0
        };
        operator.init(props);
    }
    else if(code === 0x20D6 || type === ACCENT_ARROW_LEFT)
    {

        typeOper = ACCENT_ARROW_LEFT;
        codeChr = 0x20D6;

        /*var glyph = new CCombiningArrow();
        var props =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };
        glyph.init(props);*/

        operator = new COperator(OPER_ACCENT);

        var props =
        {
            type:   properties.chrType,
            chr:    properties.chr
        };

        var defaultProps =
        {
            loc:   LOCATION_TOP
        };

        operator.init(props, defaultProps);
    }
    else if(code === 0x20D7 || type === ACCENT_ARROW_RIGHT)
    {
        typeOper = ACCENT_ARROW_RIGHT;
        codeChr = 0x20D7;

        /*var glyph = new CCombiningArrow();
        var props =
        {
            location:   LOCATION_TOP,
            turn:       TURN_180
        };
        glyph.init(props);

        operator = new COperator(glyph);*/

        operator = new COperator(OPER_ACCENT);

        var props =
        {
            type:   properties.chrType,
            chr:    properties.chr
        };

        var defaultProps =
        {
            loc:   LOCATION_TOP
        };

        operator.init(props, defaultProps);
    }
    else if(code === 0x20E1 || type === ACCENT_ARROW_LR)
    {
        typeOper = ACCENT_ARROW_LR;
        codeChr = 0x20E1;

        /*var glyph = new CCombining_LR_Arrow();
        var props =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };

        glyph.init(props);

        operator = new COperator(glyph);*/

        operator = new COperator(OPER_ACCENT);

        var props =
        {
            type:   properties.chrType,
            chr:    properties.chr
        };

        var defaultProps =
        {
            loc:   LOCATION_TOP
        };

        operator.init(props, defaultProps);
    }
    else if(code === 0x20D0 || type === ACCENT_HALF_ARROW_LEFT)
    {
        typeOper = ACCENT_HALF_ARROW_LEFT;
        codeChr = 0x20D0;

        /*var glyph = new CCombiningHalfArrow();
        var props =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };
        glyph.init(props);

        operator = new COperator(glyph);*/

        operator = new COperator(OPER_ACCENT);

        var props =
        {
            type:   properties.chrType,
            chr:    properties.chr
        };

        var defaultProps =
        {
            loc:   LOCATION_TOP
        };

        operator.init(props, defaultProps);
    }
    else if(code === 0x20D1 || type ===  ACCENT_HALF_ARROW_RIGHT)
    {
        typeOper = ACCENT_HALF_ARROW_RIGHT;
        codeChr = 0x20D1;

        /*var glyph = new CCombiningHalfArrow();
        var props =
        {
            location:   LOCATION_TOP,
            turn:       TURN_180
        };
        glyph.init(props);

        operator = new COperator(glyph);*/

        operator = new COperator(OPER_ACCENT);

        var props =
        {
            type:   properties.chrType,
            chr:    properties.chr
        };

        var defaultProps =
        {
            loc:   LOCATION_TOP
        };

        operator.init(props, defaultProps);

    }
    /*if(code === 0x302 || type === ACCENT_CIRCUMFLEX)
    {
        typeOper = ACCENT_CIRCUMFLEX;
        this.code = 0x302;

        accent = new CCircumflex();
        accent.setTurn(TURN_0);
    }
    else if(code === 0x30C || type === ACCENT_COMB_CARON)
    {
        typeOper = ACCENT_COMB_CARON;
        this.code = 0x30C;

        accent = new CCircumflex();
        accent.setTurn(TURN_MIRROR_0);
    }
    else if(code === 0x332 || type === ACCENT_LINE)
    {
        typeOper = ACCENT_LINE;
        this.code = 0x332;

        accent = new CLine();
    }
    else if(code === 0x333 || type === ACCENT_DOUBLE_LINE)
    {
        typeOper = ACCENT_DOUBLE_LINE;
        this.code = 0x333;

        accent = new CDoubleLine();
    }
    else if(code === 0x303 || type === ACCENT_TILDE)
    {
        typeOper = ACCENT_TILDE;
        this.code = 0x303;

        accent = new CTilde();
    }
    else if(code === 0x306 || type === ACCENT_BREVE)
    {
        typeOper = ACCENT_BREVE;
        this.code = 0x306;

        accent = new CBreve();
        accent.setTurn(TURN_MIRROR_0);
    }
    else if(code == 0x311 || type == ACCENT_INVERT_BREVE)
    {
        typeOper = ACCENT_INVERT_BREVE;
        this.code = 0x311;

        accent = new CBreve();
        accent.setTurn(TURN_0);
    }
    else if(code === 0x20D6 || type === ACCENT_ARROW_LEFT)
    {
        typeOper = ACCENT_ARROW_LEFT;
        this.code = 0x20D6;

        glyph = new CCombiningArrow();
        var prp =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };
        glyph.init(prp);
        accent = new COperator(glyph);
    }
    else if(code === 0x20D7 || type === ACCENT_ARROW_RIGHT)
    {
        typeOper = ACCENT_ARROW_RIGHT;
        this.code = 0x20D7;

        glyph = new CCombiningArrow();
        var prp =
        {
            location:   LOCATION_TOP,
            turn:       TURN_180
        };
        glyph.init(prp);
        accent = new COperator(glyph);
    }
    else if(code === 0x20E1 || type === ACCENT_ARROW_LR)
    {
        typeOper = ACCENT_ARROW_LR;
        this.code = 0x20E1;

        glyph = new CCombining_LR_Arrow();
        var prp =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };
        glyph.init(prp);
        accent = new COperator(glyph);
    }
    else if(code === 0x20D0 || type === ACCENT_HALF_ARROW_LEFT)
    {
        typeOper = ACCENT_HALF_ARROW_LEFT;
        this.code = 0x20D0;

        glyph = new CCombiningHalfArrow();
        var prp =
        {
            location:   LOCATION_TOP,
            turn:       TURN_0
        };
        glyph.init(prp);
        accent = new COperator(glyph);
    }
    else if(code === 0x20D1 || type ===  ACCENT_HALF_ARROW_RIGHT)
    {
        typeOper = ACCENT_HALF_ARROW_RIGHT;
        this.code = 0x20D1;

        glyph = new CCombiningHalfArrow();
        var prp =
        {
            location:   LOCATION_TOP,
            turn:       TURN_180
        };
        glyph.init(prp);
        accent = new COperator(glyph);
    }*/
    ///// group characters /////
    /*else if(code === 0x2190 || type === ARROW_LEFT)
    {
        typeOper = ARROW_LEFT;
        codeChr = 0x2190;

        operator = new CSingleArrow();

        var props =
        {
            location:   this.loc,
            turn:       TURN_0
        };
        operator.init(props);
    }
    else if(code === 0x2192 || type === ARROW_RIGHT)
    {
        typeOper = ARROW_RIGHT;
        codeChr = 0x2192;

        glyph = new CSingleArrow();
        var prp =
        {
            location:   this.loc,
            turn:       TURN_180
        };
        glyph.init(prp);
    }
    else if(code === 0x2194 || type === ARROW_LR)
    {
        typeOper = ARROW_LR;
        codeChr = 0x2194;

        glyph = new CLeftRightArrow();
        var prp =
        {
            location:   this.loc,
            turn:       TURN_0
        };
        glyph.init(prp);
    }
    else if(code === 0x21D0 || type === DOUBLE_LEFT_ARROW)
    {
        typeOper = DOUBLE_LEFT_ARROW;
        codeChr = 0x21D0;

        glyph = new CDoubleArrow();
        var prp =
        {
            location:   this.loc,
            turn:       TURN_0
        };
        glyph.init(prp);
    }
    else if(code === 0x21D2 || type === DOUBLE_RIGHT_ARROW)
    {
        typeOper = DOUBLE_RIGHT_ARROW;
        codeChr = 0x21D2;

        glyph = new CDoubleArrow();
        var prp =
        {
            location:   this.loc,
            turn:       TURN_180
        };
        glyph.init(prp);
    }
    else if(code === 0x21D4 || type === DOUBLE_ARROW_LR)
    {
        typeOper = DOUBLE_ARROW_LR;
        codeChr = 0x21D4;

        glyph = new CLR_DoubleArrow();
        var prp =
        {
            location:   this.loc,
            turn:       TURN_0
        };
        glyph.init(prp);
    }*/
    /////
    else if(bCode || bType)
    {
        typeOper = ACCENT_SIGN;

        operator = new CSign();
        var props =
        {
            type:   type,
            code:   code
        };
        operator.init(props);
        codeChr = operator.getCodeCharacter();
    }
    else
    {
        /*typeOper = ACCENT_COMB_CARON;
        codeChr = 0x30C;

        operator = new CCircumflex();
        var props =
        {
            turn:   TURN_MIRROR_0
        };
        operator.init(props);*/

        typeOper = ACCENT_CIRCUMFLEX;
        codeChr = 0x302;

        operator = new CCircumflex();
        var props =
        {
            turn:   TURN_MIRROR_0
        };
        operator.init(props);
    }

    this.operator = operator;
    this.operator.relate(this);

    ////
    // TO DO
    // убрать
    //
    this.typeOper = typeOper;
    this.code = codeChr;

    ////

    this.setDimension(1, 1);
    this.setContent();

    //this.setOperator(accent);
    this.elements[0][0].SetDot(true);

    /// вызов этой функции обязательно в конце
    //this.WriteContentsToHistory();
}
CAccent.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    var alignOp  =  (this.size.width - this.operator.size.width)/2,
        alignCnt =  (this.size.width - this.elements[0][0].size.width)/2;

    var x1 = this.pos.x + this.GapLeft + alignOp,
        y1 = this.pos.y;

    // TODO
    // выставить правильно смещение для остальных значков
    // для обычных текстовых значков (ACCENT_SIGN) выставлено

    /*if(this.typeOper == ACCENT_SIGN)
        //y1 = this.pos.y - this.shiftX + this.size.ascent; //shiftOperator to "CCharacter"
        y1 = this.pos.y + this.shiftX; //shiftOperator to "CCharacter"
    else
        y1 = this.pos.y;*/


    this.operator.setPosition({x: x1, y: y1});

    var x2 = this.pos.x + this.GapLeft + alignCnt,
        y2 = this.pos.y + this.operator.size.height;

    this.elements[0][0].setPosition({x: x2, y: y2});
}
CAccent.prototype.getAscent = function()
{
    return this.operator.size.height + this.elements[0][0].size.ascent;
}
CAccent.prototype.getPropsForWrite = function()
{
    var props = {};
    props.chr = String.fromCharCode(this.code);

    return props;
}
CAccent.prototype.Resize = function(Parent, ParaMath, oMeasure)
{
    this.Parent = Parent;
    this.ParaMath = ParaMath;

    if(this.RecalcInfo.bCtrPrp == true)
    {
        this.Set_CompiledCtrPrp();
        this.RecalcInfo.bCtrPrp = false;
    }

    if(this.RecalcInfo.bProps == true)
    {
        var prp =
        {
            type:   this.Pr.chrType,
            chr:    this.Pr.chr,
            loc:    LOCATION_TOP
        };

        var defaultPrp =
        {
            type:   ACCENT_CIRCUMFLEX
        };

        this.operator.setProperties(prp, defaultPrp);

        this.Pr.chr = String.fromCharCode(this.operator.code);
        this.Pr.chrType = this.operator.typeOper;
    }

    this.operator.relate(this);

    var base = this.elements[0][0];
    base.Resize(this, ParaMath, oMeasure);

    var ctrPrp = this.Get_CompiledCtrPrp();
    oMeasure.SetFont(ctrPrp);

    this.operator.fixSize(ParaMath, oMeasure, base.size.width);

    var letterX = new CMathText(true);
    letterX.add(0x78);
    letterX.Resize(null, oMeasure);
    this.shiftX = base.size.ascent - letterX.size.ascent;

    var width  = base.size.width > this.operator.size.width ? base.size.width : this.operator.size.width,
        height = base.size.height + this.operator.size.height + this.shiftX,
        ascent = this.getAscent(oMeasure);

    this.size = {height: height, width: width, ascent: ascent};
}
CAccent.prototype.getBase = function()
{
    return this.elements[0][0];
}
CAccent.prototype.draw = function(x, y, pGraphics)
{
    this.elements[0][0].draw(x, y, pGraphics);

    var MergedCtrPrp = this.Get_CompiledCtrPrp();
    var FontSize = MergedCtrPrp.FontSize,
        FontFamily = {Name: "Cambria Math", Index: -1};

    var obj = {FontSize: FontSize, FontFamily: FontFamily};

    var accFont = new CTextPr();
    accFont.Set_FromObject(obj);


    pGraphics.SetFont(accFont);
    pGraphics.p_color(0,0,0, 255);
    pGraphics.b_color1(0,0,0, 255);

    this.operator.draw(x, y, pGraphics);

}
CAccent.prototype.findDisposition = function(pos)
{
    var curs_X = 0,
        curs_Y = 0;
    var X, Y;

    var inside_flag = -1;

    var content = this.elements[0][0],
        align = (this.size.width - this.elements[0][0].size.width)/2;

    if(pos.x < align)
    {
        X = 0;
        inside_flag = 0;
    }
    else if(pos.x > align + content.size.width)
    {
        X = content.size.width;
        inside_flag = 1;
    }
    else
        X = pos.x - align;

    if(pos.y < this.operator.size.height)
    {
        Y = 0;
        inside_flag = 2;
    }
    else
        Y = pos.y - this.operator.size.height;



    var mouseCoord = {x: X, y: Y},
        posCurs =    {x: curs_X, y: curs_Y};

    return {pos: posCurs, mCoord: mouseCoord, inside_flag: inside_flag};
}
CAccent.prototype.Save_Changes = function(Data, Writer)
{
	Writer.WriteLong( historyitem_type_acc );
}
CAccent.prototype.Load_Changes = function(Reader)
{
}
CAccent.prototype.Refresh_RecalcData = function(Data)
{
}
CAccent.prototype.Write_ToBinary2 = function( Writer )
{
	Writer.WriteLong( historyitem_type_acc );
	Writer.WriteString2( this.elements[0][0].Id );
	
	this.CtrPrp.Write_ToBinary(Writer);
	
	var StartPos = Writer.GetCurPosition();
    Writer.Skip(4);
    var Flags = 0;
	if ( undefined != this.chr )
    {
		Writer.WriteLong(this.chr);	
		Flags |= 1;
	}
	var EndPos = Writer.GetCurPosition();
    Writer.Seek( StartPos );
    Writer.WriteLong( Flags );
    Writer.Seek( EndPos );
}
CAccent.prototype.Read_FromBinary2 = function( Reader )
{
	var Element = g_oTableId.Get_ById( Reader.GetString2() );
	Element.Parent = this;
	this.elements[0][0] = Element;

	this.CtrPrp.Read_FromBinary(Reader);
	
	var Flags = Reader.GetLong();
	if ( Flags & 1 )
		this.chr = Reader.GetLong();	
}