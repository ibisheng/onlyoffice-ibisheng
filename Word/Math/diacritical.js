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

function CBaseDiacritic()
{
    // g_dKoef_px_to_mm = 25.4/96

    this.accentSize = {width: 0, height : 0};
    this.shiftAccent = 0;
    this.shiftArg = 0;

    this.PEN_W = 0.04;

    CMathBase.call(this);
}
extend(CBaseDiacritic, CMathBase);
CBaseDiacritic.prototype.init = function()
{
    this.setDimension(1, 1);
    this.setContent();
    this.elements[0][0].SetDot(true);
}
CBaseDiacritic.prototype.old_setContent = function()
{
    this.fillPlaceholders();
    this.elements[0][0].SetDotIndef(true);
}
CBaseDiacritic.prototype.getCenter = function()
{
    return this.elements[0][0].size.center + this.accentSize.height;
}
CBaseDiacritic.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    var x = this.pos.x + this.shiftArg,
        y = this.pos.y + this.accentSize.height;

    this.elements[0][0].setPosition({x: x, y: y});
}
CBaseDiacritic.prototype.findDisposition = function(mCoord)
{
    var X = null,
        Y = null,
        inside_flag = -1; // остаемя в пределах данного элемента( за границы элемента не вышли )

    if(mCoord.y < this.accentSize.height)
    {
        Y = 0;
        inside_flag = 2;
    }
    else
        Y = mCoord.y - this.accentSize.height;


    if(mCoord.x < this.shiftArg)
    {
        X = 0;
        inside_flag = 0;
    }
    else
        X = mCoord.x - this.shiftArg;

    var coord = {x: X, y: Y},
        posCurs = {x: 0, y: 0};

    return {pos: posCurs, mCoord: coord, inside_flag: inside_flag};
}
CBaseDiacritic.prototype.IsIncline = function()
{
    // наклон есть в случае, если у нас математический текст(Cambria Math) и один символ в контенте

    return this.elements[0][0].IsIncline();
}
CBaseDiacritic.prototype.getBase = function()
{
    return this.elements[0][0];
}

function CCircumflex()
{
    this.AUG = 5;
    this.ANGLE =  0.1;

    this.index = 1;

    CBaseDiacritic.call(this);
}
extend(CCircumflex, CBaseDiacritic);
CCircumflex.prototype.setIndex = function(index)
{
    this.index = index;
}
CCircumflex.prototype.recalculateSize = function()
{
    var alpha = this.getTxtPrp().FontSize/36;

    this.accentSize.width = 3.88*alpha;
    this.accentSize.height = 3.175*alpha;

    var augm = 0.9* this.elements[0][0].size.width/this.accentSize.width;
    if(augm < 1)
        augm = 1;
    else if (augm > this.AUG)
        augm = this.AUG;

    var Arg = this.elements[0][0].size,
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
    }

    this.size = {width: _width, height: _height, center: _center};

}
CCircumflex.prototype.draw = function()
{
    this.elements[0][0].draw();

    var x = this.pos.x + this.shiftAccent,
        y = this.pos.y;

    var fontSize = this.getTxtPrp().FontSize;

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

    var augm =  0.9* this.elements[0][0].size.width/this.accentSize.width;

    if(augm > this.AUG)
        augm = this.AUG;
    else if(augm < 1)
        augm = 1;

    var W = this.accentSize.width *  augm/alpha;

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

    if(this.index == 1) // вверх
    {
        a = 0;
        b = 1;
    }
    else
    {
        a = YY[1]; // height
        b = -1;
    }

    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = x + XX[i]*alpha ;
        YY[i] = y + (a + b*YY[i])*alpha;
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._l(XX[8], YY[8]);
    MathControl.pGraph._l(XX[9], YY[9]);
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._l(XX[11], YY[11]);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}

function CLine()
{
    //0x302, 0x333
    this.index = null; // одинарная, двойная, стрелки и т.п.
    CBaseDiacritic.call(this);
}
extend(CLine, CBaseDiacritic);
CLine.prototype.setIndex = function(index)
{
    this.index = index;
}
CLine.prototype.recalculateSize = function()
{
    var alpha = this.getTxtPrp().FontSize/36;
    var argSize = this.elements[0][0].size;

    if(this.index == 1) //0x332
    {
        this.accentSize.height = 1.68*alpha;
        this.accentSize.width  = 4.938*alpha;
    }
    else  //0x333
    {
        this.accentSize.height = 2.843*alpha;
        this.accentSize.width = 4.938*alpha;
    }

    var f = this.accentSize.width,
        s = argSize.width;

    var _width = f > s ? f : s;
    var _height = argSize.height + this.accentSize.height;
    var _center = this.getCenter();

    this.size = {width: _width, height: _height, center: _center};
}
CLine.prototype.draw = function()
{
    this.elements[0][0].draw();

    if(this.index == 1)
        this.draw_singleLine();
    else
        this.draw_doubleLine();
}
CLine.prototype.draw_singleLine = function()
{
    var penW = this.getTxtPrp().FontSize*g_dKoef_pt_to_mm*this.PEN_W;
    //penW *= 96/25.4;

    //var penY = penW/2*25.4/96; //для того чтобы линии совпадали (для одинарной и двойной черты)
    var penY = penW/2; //для того чтобы линии совпадали (для одинарной и двойной черты)

    // g_dKoef_px_to_mm = 25.4/96

    var shY = this.accentSize.height - this.accentSize.height*2.843/1.68/2; // чтобы линии совпадали

    var x1 = this.pos.x,
        y1 = this.pos.y + penY + shY,
        x2 = x1 + this.size.width,
        y2 = y1;


    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph.ds();

}
CLine.prototype.draw_doubleLine = function()
{
    var penW = this.getTxtPrp().FontSize*g_dKoef_pt_to_mm*this.PEN_W;
    //penW *= 96/25.4;

    //var penY = penW/2*25.4/96; //для того чтобы линии совпадали (для одинарной и двойной черты)
    var penY = penW/2; //для того чтобы линии совпадали (для одинарной и двойной черты)

    var x1 = this.pos.x,
        y1 = this.pos.y + penY,
        x2 = x1 + this.size.width,
        y2 = y1,
        x3 = x1,
        //y3 = y1 + this.accentSize.height/2,
        y3 = y1 + this.accentSize.height/2,
        x4 = x2,
        y4 = y3;

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(x1, y1);
    MathControl.pGraph._l(x2, y2);
    MathControl.pGraph._m(x3, y3);
    MathControl.pGraph._l(x4, y4);
    MathControl.pGraph.ds();

}

// TODO: установить смещение в зависимости от наклона буквы (как в CAccent)
function CSign()
{
    this.index = null;
    CBaseDiacritic.call(this);
}
extend(CSign, CBaseDiacritic);
CSign.prototype.setIndex = function(index)
{
    this.index = index;  // tilde
                         // breve up/down
}
CSign.prototype.recalculateSize = function()
{
    var betta = this.getTxtPrp().FontSize/36;
    var widthAcc, heightAcc;

    if(this.index == 0 || this.index == 1)
    {
        widthAcc = this.accentSize.width = 4.2333333333333325*betta;
        heightAcc = this.accentSize.height = 2.469444444444445*betta;
    }
    else
    {
        widthAcc = this.accentSize.width = 9.047509765625*betta; // реальная на отрисовке width 7.495282031249999
        heightAcc = this.accentSize.height = 2.469444444444444*betta;
    }

    var arg = this.elements[0][0].size ;

    this.size = {};

    this.size.width =  widthAcc > arg.width ? widthAcc : arg.width;
    this.size.height =  heightAcc + arg.height ;
    this.size.center = this.getCenter();

    this.shiftArg = (this.size.width - arg.width)/2;
    this.shiftAccent = (this.size.width - widthAcc)/2;

    /*var accent = new CMathText(this.params);
     accent.init(0x303);
     //accent.setIndefSize(SizeDiacritic);
     var size = accent.size;

     accent = new CMathText(this.params);
     accent.init(0x32E);
     accent.setIndefSize(SizeDiacritic);
     size = accent.size;*/

}
CSign.prototype.draw = function()
{
    this.elements[0][0].draw();

    if(this.index == 0)
        this.draw_breve(1);
    else if(this.index == 1)
        this.draw_breve(-1);
    else
        this.draw_tilde();
}
CSign.prototype.draw_tilde = function()
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

    var fontSize = this.getTxtPrp().FontSize;

    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96


    var align = this.size.width - X[13]*alpha;
    var x = this.pos.x + align/2,
        y = this.pos.y;

    //var x = this.pos.x + this.shiftAccent, y = this.pos.y;


    for(var i = 0; i < X.length; i++)
    {
        XX[i] = x + X[i]*alpha;
        YY[i] = y + (Y[5] - Y[i])*alpha*0.65; // сжали !
    }


    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    penW *= 96/25.4;

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] );
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    MathControl.pGraph._l(XX[13], YY[13]);
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._l(XX[26], YY[26]);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CSign.prototype.draw_breve = function(up)
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

    var fontSize = this.getTxtPrp().FontSize;

    var textScale = fontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64 ; // g_dKoef_px_to_mm = 25.4/96


    var align = this.size.width - X[22]*alpha;
    var x = this.pos.x + align/2,
        y = this.pos.y;

    var a, b;
    if(up == 1)
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
        XX[i] = x + X[i]*alpha ;
        YY[i] = y + (a + b*Y[i])*alpha ;
    }


    var penW = fontSize*g_dKoef_pt_to_mm*this.PEN_W;
    penW *= 96/25.4;

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] );
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    MathControl.pGraph._l(XX[9], YY[9]);
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._l(XX[22], YY[22]);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}

function CAccent()
{
    this.index = null;
    this.DIACR_ANGLE = 0.1;

    CMathBase.call(this);
}
// посмотреть смещение у диакритических знаков
extend(CAccent, CMathBase);
CAccent.prototype.init = function(index)
{
    this.index = index;
    this.setDimension(2, 1);

    var oBase = new CMathContent();
    oBase.SetDot(true);
    
    var oAccent = new CMathText();
    oAccent.setJustDraw(true);
    
    if(this.index == 1)
        oAccent.add(0x300);
    else if(this.index == 2)
        oAccent.add(0x301);
    else if(this.index == 3)
        oAccent.add(0x307);
    else if(this.index == 4)
        oAccent.add(0x308);
    else if(this.index == 5)
        oAccent.add(0x20DB);

    this.addMCToContent(oAccent, oBase);
}
CAccent.prototype.recalculateSize = function()
{
    var first = this.elements[0][0].size,
        second = this.elements[1][0].size;

    this.setDistance();

    var height = first.height + second.height + this.dH;
    var center = this.getCenter();

    var incline = 0;
    if( this.IsIncline() )
        incline = second.height*this.DIACR_ANGLE; // смещение
    var align1 = 0,
        align2 = 0;
    if(second.width > first.widthG + incline)
    {
        align1 = (second.width - first.widthG)/2 + incline;
    }
    else
    {
        align1 = incline;
        align2 = (first.width - second.widthG)/2;
    }
    var w1 = first.widthG + align1,
        w2 = second.width + align2;

    var width = w2 > w1 ? w2 : w1;

    this.size = {width: width, height: height, center: center};
}
CAccent.prototype.getCenter = function()
{
    return this.elements[0][0].size.height + this.elements[1][0].size.center;
}
CAccent.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    var first = this.elements[0][0].size,
        second = this.elements[1][0].size;

    //для отрисовки (т.к. у некоторых значков ширина "нулевая")

    var shX = 0;
    if(this.index == 1)
        shX = 1.1*first.widthG;
    else if(this.index == 2)
        shX = 1.25*first.widthG;
    else if(this.index == 3)
        shX = 1.53*first.widthG;
    else if(this.index == 4)
        shX = 0.95*first.widthG;
    else if(this.index == 5)
        shX = 0.015*first.widthG;
    else
        shX = 0;

    // учитываем наклон буквы
    var incline = 0;
    if( this.IsIncline() )
        incline = this.DIACR_ANGLE*second.height;
    var align1 = 0,
        align2 = 0;

    if(second.width > first.widthG + incline)
    {
        align1 = (second.width - first.widthG)/2 + incline;
    }
    else
    {
        align1 = incline;
        align2 = (first.widthG - second.width)/2;
    }

    var pos1 = {x: this.pos.x + shX + align1, y: this.pos.y},
        pos2 = {x: this.pos.x + align2, y: this.pos.y + first.height + this.dH};

    this.elements[0][0].setPosition(pos1);
    this.elements[1][0].setPosition(pos2);

}
CAccent.prototype.IsIncline = function()
{
    return this.elements[1][0].IsIncline();
}
CAccent.prototype.setDistance = function()
{
    this.dH = 0.7*this.getTxtPrp().FontSize/36;
}