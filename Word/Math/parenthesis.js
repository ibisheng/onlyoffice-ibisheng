function CBaseBracket()
{
    this.gapBrack = null;
    this.gapTop = null;
    CMathBase.call(this, 1, 1);
}
extend(CBaseBracket, CMathBase);
/*CBaseBracket.prototype.setContent = function()
{
    this.fillPlaceholders();
}*/
//TODO
//мы не встаем в контент после мат элемента (например, матрицы), т.к. расстояние(widthToEl) до этого элемента равно растоянию до CEmpty после этого элемента
CBaseBracket.prototype.findDisposition = function(mCoord)
{
    var X = null,
        Y = null,
        inside_flag = true; // остаемя в пределах данного элемента( за границы элемента не вышли )

    if(mCoord.x < this.gapBrack)
    {
        X = 0;
        inside_flag = 0;
    }
    else if(mCoord.x > this.size.width - this.gapBrack)
    {
        //X = this.size.width - 2*this.gapBrack;
        X = this.elements[0][0].size.width; // разницы никакой
        inside_flag = 1;
    }
    else
    {
        X = mCoord.x - this.gapBrack;
    }

    if(Y < this.gapTop)
    {
        Y = 0;
        inside_flag = 2;
    }
    else if(Y > this.size.height - this.gapTop)
    {
        Y = this.size.height - 2*this.gapTop;
        inside_flag = 2;
    }
    else
    {
        Y = mCoord.y - this.gapTop;
    }

    var coord = {x: X, y: Y},
        posCurs = {x: 0, y: 0};

    return {pos: posCurs, mCoord: coord, inside_flag: inside_flag};
}
CBaseBracket.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.center};

    //TODO
    //вот здесь лажа, возможно из-за этого неправильно обрабатывается событие клик мыши (findDisposition)
    var x = this.pos.x + this.gapBrack,
        y = this.pos.y + this.gapTop;

    this.elements[0][0].setPosition({x: x, y: y});
}
// переделать для всех элементов c отрисовкой!
CBaseBracket.prototype.goToUpperLevel = function(coord)
{
    var content = null;
    var x = coord.x + this.gapBrack,
        y = coord.y + this.gapTop;

    var crd = {x: x, y: y};
    var upLevel = this.Parent.goToUpperLevel(crd);

    var bUp = upLevel.bUp;
    if(bUp)
        content = upLevel.content;
    else
        content = null;

    return {bUp: bUp, content: content};
}
CBaseBracket.prototype.goToLowerLevel = function(coord){
    var content = null;
    var x = coord.x + this.gapBrack,
        y = coord.y + this.gapTop;

    var crd = {x: x, y: y};
    var lowLevel = this.Parent.goToLowerLevel(crd);

    var bLow = lowLevel.bLow;
    if(bLow)
        content = lowLevel.content;
    else
        content = null;

    return {bLow: bLow, content: content};
}

function CParenthesis()
{
    CBaseBracket.call(this);
}
extend(CParenthesis, CBaseBracket);
CParenthesis.prototype.recalculateSize = function()
{
    var height, width, center;

    var betta = this.params.font.FontSize /36;
    var maxBoxW =   9.63041992187 *betta, //9.63 width of 0x239D
        minBoxW =   5.27099609375 *betta, //width of 0x28
        heightBr = 11.99444444444 *betta;

    var argSize = this.elements[0][0].size;
    var rx = argSize.height / heightBr,
        delta = maxBoxW - minBoxW;

    var widthBr = delta/4.3 * (rx - 1) + minBoxW;
    widthBr = widthBr >  maxBoxW ? maxBoxW : widthBr;

    this.gapBrack = widthBr;
    this.gapTop = heightBr > argSize.height ? (heightBr - argSize.height)/2 : 0;

    height = argSize.height + 2*this.gapTop;
    center = argSize.center + this.gapTop;
    width =  argSize.width + 2*this.gapBrack;

    this.size = {height: height, width: width, center: center};
}
CParenthesis.prototype.draw = function()
{
    this.elements[0][0].draw();

    var x = this.pos.x,
        y = this.pos.y;

    var penW = 1; //px
    //25.4/96
    //resolution 72
    //lineTo, moveTo в mm

    var X = new Array(),
        Y = new Array();

    X[0] = 20672; Y[0] = 21068;
    X[1] = 20672; Y[1] = 6495;
    X[2] = 15986; Y[2] = -2956;
    X[3] = 11300; Y[3] = -12407;
    X[4] = 1677;  Y[4] = -15613;
    X[5] = 2677;  Y[5] = -18819;
    X[6] = 14894; Y[6] = -15613;
    X[7] = 21399; Y[7] = -5017;
    X[8] = 27904; Y[8] = 5579;
    X[9] = 27904; Y[9] = 20651;

    var tmpY = Y[5],
        tmpX = X[4];
    for(var i=0; i< 10; i++)
    {
        X[i] = X[i] - tmpX;
        Y[i] = Y[i] - tmpY;  // ( X[4], Y[5] ) => (0,0)
    }

    var textScale = this.params.font.FontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
                                       // при рисовании используем координаты в миллиметрах, умноженные на 100
    // g_dKoef_px_to_mm = 25.4/96

    //  6 тагетов (ориентировочно)

    var aug = this.size.height/(Y[9]*alpha)/2, //Y[9]*alpha - высота скобки
        RX, RY;                                // коэффициент растяжения вычисляем исходя из высоты половины скобки : всё остальное дорисовываем трансформацией

    // 9.63 - ширина скобки (max) для размера 36
    // 6 px - gap


    if(aug > 6.53)
    {
        RY = 6.53;
        RX = 2.05;
    }
    else if(aug < 1)
    {
        RY = 1;
        RX = 1;
    }
    else
    {
        RY = aug;
        RX = 1 + (aug - 1)*0.19;
    }

    var DistW = new Array();
    for(var i= 0; i< 5; i++)
        DistW[i] = X[9-i] - X[i];

    for(var i = 5; i < 10; i++)
    {
        X[i] = X[i]*RX;               //точки правой дуги
        X[9-i] = X[i] - DistW[9-i];   //точки левой дуги
    }

    // Y
    var DistH = new Array();
    for(var j= 0; j< 5; j++)
        DistH[j] = Y[18-j] - Y[9+j];

    var DistH = new Array();
    for(var i=0; i< 5; i++)
        DistH[i] = Y[9-j] - Y[j];

    for(var i=5; i<10; i++ )
    {
        Y[i] = Y[i]*RY;
        Y[9-i] = Y[i] + DistH[9-i];
    }

    var XX = new Array(),
        YY = new Array();

    var shiftX = this.size.width - 0.9*this.gapBrack;
    var Width =  this.size.width,
        Height = this.size.height;

    // XX[0]  - XX[9]  - нижняя часть скобки
    // XX[9]  - XX[10] - отрезок прямой
    // XX[11] - XX[19] - верхняя часть скобки
    // XX[19] - XX[20] - отрезок прямой

    for(var i = 0; i < 10; i++)
    {
        XX[19 - i] = XX[i] =  (x + shiftX + X[i]*alpha );
        YY[19 - i] =  (y + Y[i]*alpha);
        YY[i] = (y + Height - Y[i]*alpha);
    }
    XX[20] = XX[0];
    YY[20] = YY[0];

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[0], YY[0]); //mm
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17]);
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    MathControl.pGraph._l(XX[20], YY[20]);

    MathControl.pGraph.df();

    var shiftX = 0.87*this.gapBrack;
    for(var i = 0; i < 10; i++)
    {
        XX[19 - i] = XX[i] =  (x + shiftX - X[i]*alpha ); // YY[..] те же
    }
    XX[20] = XX[0];

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[0], YY[0]); //mm
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7]);
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17]);
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]);
    MathControl.pGraph._l(XX[20], YY[20]);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);
}

function CBracket()
{
    CBaseBracket.call(this);
}
extend(CBracket, CBaseBracket);
CBracket.prototype.recalculateSize = function()
{
    var height, width, center;
    var betta = this.params.font.FontSize /36;

    var minBoxW =   4.917529296874999 *betta, //width of 0x28
        heightBr = 12.347222222222221*betta;

    var argSize = this.elements[0][0].size;

    var rx = argSize.height / heightBr;
    if(rx < 1)
        rx = 1;

    if(rx < 2.1)
        maxBoxW = minBoxW * 1.37;
    else if(rx < 3.22)
        maxBoxW = minBoxW * 1.06;
    else
        maxBoxW =   8.74 *betta;

    var delta = maxBoxW - minBoxW;

    var widthBr = delta/4.3 * (rx - 1) + minBoxW;
    widthBr = widthBr >  maxBoxW ? maxBoxW : widthBr;

    this.gapBrack = widthBr;
    this.gapTop = heightBr > argSize.height ? (heightBr - argSize.height)/2 : 0;

    height = argSize.height + 2*this.gapTop;
    center = argSize.center + this.gapTop;
    width =  argSize.width + 2*this.gapBrack;

    this.size = {height: height, width: width, center: center};
}
CBracket.prototype.draw = function()
{
    this.elements[0][0].draw();

    var x = this.pos.x,
        y = this.pos.y;

    var X = new Array(),
        Y = new Array();

    Y[0] = 26467; X[0] = 18871;
    Y[1] = 25967; X[1] = 18871;
    Y[2] = 25384; X[2] = 16830;
    Y[3] = 24737; X[3] = 15476;
    Y[4] = 24091; X[4] = 14122;
    Y[5] = 23341; X[5] = 13309;
    Y[6] = 22591; X[6] = 12497;
    Y[7] = 21778; X[7] = 12164;
    Y[8] = 20965; X[8] = 11831;
    Y[9] = 20089; X[9] = 11831;
    Y[10] = 19214; X[10] = 11831;
    Y[11] = 18317; X[11] = 12083;
    Y[12] = 17421; X[12] = 12336;
    Y[13] = 16441; X[13] = 12652;
    Y[14] = 15462; X[14] = 12969;
    Y[15] = 14357; X[15] = 13243;
    Y[16] = 13253; X[16] = 13518;
    Y[17] = 11961; X[17] = 13518;
    Y[18] = 9835; X[18] = 13518;
    Y[19] = 8292; X[19] = 12621;
    Y[20] = 6750; X[20] = 11724;
    Y[21] = 5750; X[21] = 10055;
    Y[22] = 4750; X[22] = 8386;
    Y[23] = 4270; X[23] = 5987;
    Y[24] = 3791; X[24] = 3589;
    Y[25] = 3791; X[25] = 626;
    Y[26] = 3791; X[26] = 0;
    Y[27] = 0; X[27] = 0;
    Y[28] = 0; X[28] = 1084;
    Y[29] = 83; X[29] = 5963;
    Y[30] = 1021; X[30] = 9612;
    Y[31] = 1959; X[31] = 13261;
    Y[32] = 3543; X[32] = 15700;
    Y[33] = 5127; X[33] = 18139;
    Y[34] = 7232; X[34] = 19369;
    Y[35] = 9337; X[35] = 20599;
    Y[36] = 11796; X[36] = 20599;
    Y[37] = 13338; X[37] = 20599;
    Y[38] = 14588; X[38] = 20283;
    Y[39] = 15839; X[39] = 19968;
    Y[40] = 16860; X[40] = 19610;
    Y[41] = 17882; X[41] = 19252;
    Y[42] = 18736; X[42] = 18936;
    Y[43] = 19590; X[43] = 18621;
    Y[44] = 20340; X[44] = 18621;
    Y[45] = 21091; X[45] = 18621;
    Y[46] = 21820; X[46] = 18995;
    Y[47] = 22550; X[47] = 19370;
    Y[48] = 23133; X[48] = 20266;
    Y[49] = 23717; X[49] = 21162;
    Y[50] = 24092; X[50] = 22703;
    Y[51] = 24467; X[51] = 24245;
    Y[52] = 24551; X[52] = 26578;
    Y[53] = 28133; X[53] = 26578;

   /* Y[54] = 28216; X[54] = 24245;
    Y[55] = 28612; X[55] = 22703;
    Y[56] = 29008; X[56] = 21162;
     Y[57] = 29612; X[57] = 20266;
     Y[58] = 30216; X[58] = 19370;
     Y[59] = 30965; X[59] = 18995;
     Y[60] = 31714; X[60] = 18621;
     Y[61] = 32548; X[61] = 18621;
     Y[62] = 33381; X[62] = 18621;
     Y[63] = 34276; X[63] = 18936;
     Y[64] = 35172; X[64] = 19252;
     Y[65] = 36255; X[65] = 19610;
     Y[66] = 37338; X[66] = 19968;
     Y[67] = 38670; X[67] = 20283;
     Y[68] = 40003; X[68] = 20599;
     Y[69] = 41669; X[69] = 20599;
     Y[70] = 46917; X[70] = 20599;
     Y[71] = 49749; X[71] = 15741;
     Y[72] = 52581; X[72] = 10883;
     Y[73] = 52665; X[73] = 1084;
     Y[74] = 52665; X[74] = 0;
     Y[75] = 48749; X[75] = 0;
     Y[76] = 48749; X[76] = 626;
     Y[77] = 48749; X[77] = 3589;
     Y[78] = 48311; X[78] = 5987;
     Y[79] = 47874; X[79] = 8386;
     Y[80] = 46916; X[80] = 10055;
     Y[81] = 45959; X[81] = 11724;
     Y[82] = 44480; X[82] = 12621;
     Y[83] = 43001; X[83] = 13518;
     Y[84] = 40877; X[84] = 13518;
     Y[85] = 39545; X[85] = 13518;
     Y[86] = 38399; X[86] = 13243;
     Y[87] = 37254; X[87] = 12969;
     Y[88] = 36191; X[88] = 12652;
     Y[89] = 35129; X[89] = 12336;
     Y[90] = 34171; X[90] = 12083;
     Y[91] = 33214; X[91] = 11831;
     Y[92] = 32339; X[92] = 11831;
     Y[93] = 31464; X[93] = 11831;
     Y[94] = 30652; X[94] = 12164;
     Y[95] = 29840; X[95] = 12497;
     Y[96] = 29090; X[96] = 13309;
     Y[97] = 28341; X[97] = 14122;
     Y[98] = 27674; X[98] = 15476;
     Y[99] = 27008; X[99] = 16830;
     Y[100] = 26467; X[100] = 18871;*/


    var textScale = this.params.font.FontSize/1000, // 1000 pt
        alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // при рисовании используем координаты в миллиметрах, умноженные на 100
    // g_dKoef_px_to_mm = 25.4/96

    var augm = this.size.height/((Y[52] + (Y[0] - Y[1])/2 + Y[1] - Y[52])*alpha*2);

    var XX = new Array(),
        YY = new Array();

    var hh1 = new Array(),
        hh2 = new Array();

    var c1 = new Array(),
        c2 = new Array();

    var delta = augm < 7 ? augm : 7;

    if(augm < 7)
    {
        var RX = new Array(),
            RX1, RX2;

        if(delta < 5.1)
        {
            hh1[0] = 1.89;
            hh2[0] = 2.58;

            hh1[1] = 1.55;
            hh2[1] = 1.72;

            hh1[2] = 1.5;
            hh2[2] = 1.64;

            hh1[3] = 1.92;
            hh2[3] = 1.97;

            // (!)
            hh1[4] = 1;
            hh2[4] = 1;
            //

            hh1[5] = 2.5;
            hh2[5] = 2.5;

            hh1[6] = 2.1;
            hh2[6] = 2.1;

            hh1[7] = 1;
            hh2[7] = 1;

            RX1 = 0.033*delta + 0.967;
            RX2 = 0.033*delta + 0.967;

        }
        else
        {
            hh1[0] = 1.82;
            hh2[0] = 2.09;

            hh1[1] = 1.64;
            hh2[1] = 1.65;

            hh1[2] = 1.57;
            hh2[2] = 1.92;

            hh1[3] = 1.48;
            hh2[3] = 2.16;

            // (!)
            hh1[4] = 1;
            hh2[4] = 1;
            //

            hh1[5] = 2.5;
            hh2[5] = 2.5;

            hh1[6] = 2.1;
            hh2[6] = 2.1;

            hh1[7] = 1;
            hh2[7] = 1;


            RX1 = 0.22*delta + 0.78;
            RX2 = 0.17*delta + 0.83;

        }

        for(var i = 0; i < 27; i++)
            RX[i] = RX1;

        for(var i = 27; i < 54; i++)
            RX[i] = RX2;

        RX[1] = (X[52]*RX[52] - (X[52] - X[1]) )/X[1];
        RX[0] = RX[1]*X[1]/X[0];

        RX[27] = 1;
        RX[26] = 1;

        for(var i = 0; i < 8; i++ )
            RX[26-i] = 1 + i*((RX2+RX1)/2 - 1)/7;


        for(var i = 0; i < 4; i++)
        {
            c1[i] = Y[30 + 2*i] - Y[28 + 2*i];
            c2[i] = Y[23 - 2*i] - Y[25 - 2*i];
        }

        c1[5] = Y[48] - Y[44];
        c2[5] = Y[5] - Y[9];


        c1[6] = Y[52] - Y[48];
        c2[6] = Y[1] - Y[5];


        c1[7] = (Y[0] - Y[1])/2 + Y[1] - Y[52];
        c2[7] = (Y[0] - Y[1])/2;

        c1[4] = Y[44] - Y[36];
        c2[4] = Y[9] - Y[17];

        var rest1 = 0,
            rest2 = 0;

        for(var i = 0; i < 8; i++)
        {
            if(i == 4)
                continue;
            hh1[i] = (hh1[i] - 1)*(delta - 1) + 1;
            hh2[i] = (hh2[i] - 1)*(delta - 1) + 1;

            rest1 += hh1[i]*c1[i];
            rest2 += hh2[i]*c2[i];
        }

        var H1 = delta*(Y[52] + c1[7]),
            H2 =  H1 - (Y[26] - Y[27]) ;

        hh1[4] = (H1 - rest1)/c1[4];
        hh2[4] = (H2 - rest2)/c2[4];

        YY[27] = Y[27];
        YY[26] = Y[26];

        YY[28] = Y[27];
        YY[25] = Y[26];

        for(var i = 0; i < 4; i++)
        {
            for(var j = 1; j < 3; j ++)
            {
                t = j + i*2;
                YY[28 + t] = YY[27 + t] + (Y[28+t] - Y[27+t])*hh1[i];
                YY[25 - t] = YY[26 - t] + (Y[25-t] - Y[26-t])*hh2[i];
            }
        }

        //переопределяем 36 и 17
        for(var i = 1; i < 9; i++)
        {
            YY[36 + i] = YY[35+i] + (Y[36+i] - Y[35+i])*hh1[4];
            YY[17 - i] = YY[18-i] + (Y[17-i] - Y[18-i])*hh2[4];
        }

        for(var i = 0; i < 4; i++)
        {
            YY[45+i] = YY[44+i] + ( Y[45+i] - Y[44+i])*hh1[5];
            YY[8-i]  = YY[9-i] + (Y[8-i] -Y[9-i])*hh2[5];
        }

        for(var i = 0; i < 4; i++)
        {
            YY[49+i] = YY[48+i] + (Y[49+i] - Y[48+i])*hh1[6];
            YY[4-i]  = YY[5-i]  + (Y[4-i] - Y[5-i] )*hh2[6];
        }

        YY[53] = YY[52] + 2*c1[7]*hh1[7];
        YY[0]  = YY[1]  + 2*c2[7]*hh2[7];

    }
    else
    {
        hh1[0] = 1.75;
        hh2[0] = 2.55;

        hh1[1] = 1.62;
        hh2[1] = 1.96;

        hh1[2] = 1.97;
        hh2[2] = 1.94;

        hh1[3] = 1.53;
        hh2[3] = 1.0;

        hh1[4] = 2.04;
        hh2[4] = 3.17;

        hh1[5] = 2.0;
        hh2[5] = 2.58;

        hh1[6] = 2.3;
        hh2[6] = 1.9;

        hh1[7] = 2.3;
        hh2[7] = 1.9;

        // (!)
        hh1[8] = 1;
        hh2[8] = 1;
        //

        hh1[9] = 2.5;
        hh2[9] = 2.5;

        hh1[10] = 2.1;
        hh2[10] = 2.1;

        hh1[11] = 1;
        hh2[11] = 1;

        var rest1 = 0,
            rest2 = 0;

        for(var i=0; i<8; i++)
        {
            c1[i] = Y[30+i] - Y[29+i];
            c2[i] = Y[24-i] - Y[25-i];
        }

        c1[9] = Y[48] - Y[44];
        c2[9] = Y[5] - Y[9];

        c1[10] = Y[52] - Y[48];
        c2[10] = Y[1] - Y[5];


        c1[11] = (Y[0] - Y[1])/2 + Y[1] - Y[52];
        c2[11] = (Y[0] - Y[1])/2;

        c1[8] = Y[44] - Y[36];
        c2[8] = Y[9] - Y[17];


        for(var i = 0; i < 12; i++)
        {
            if(i == 8)
                continue;
            hh1[i] = (hh1[i] - 1)*(delta - 1) + 1;
            hh2[i] = (hh2[i] - 1)*(delta - 1) + 1;

            rest1 += hh1[i]*c1[i];
            rest2 += hh2[i]*c2[i];
        }

        var H1 = delta*(Y[52] + c1[11]),
            H2 =  H1 - (Y[26] - Y[27]) ;

        hh1[8] = (H1 - rest1)/c1[8];
        hh2[8] = (H2 - rest2)/c2[8];

        YY[27] = Y[27];
        YY[26] = Y[26];

        YY[28] = Y[27];
        YY[25] = Y[26];

        for(var i = 0; i < 9; i++)
        {
            YY[28 + i] = YY[27 + i] + (Y[28+i] - Y[27+i])*hh1[i];
            YY[25 - i] = YY[26 - i] + (Y[25-i] - Y[26-i])*hh2[i];
        }

        //переопределяем 36 и 17
        for(var i = 1; i < 9; i++)
        {
            YY[36 + i] = YY[35+i] + (Y[36+i] - Y[35+i])*hh1[8];
            YY[17 - i] = YY[18-i] + (Y[17-i] - Y[18-i])*hh2[8];
        }

        // TODO
        // переделать
        for(var i = 0; i < 4; i++)
        {
            YY[45+i] = YY[44+i] + ( Y[45+i] - Y[44+i])*hh1[9];
            YY[8-i]  = YY[9-i] + (Y[8-i] -Y[9-i])*hh2[9];
        }

        for(var i = 0; i < 4; i++)
        {
            YY[49+i] = YY[48+i] + (Y[49+i] - Y[48+i])*hh1[10];
            YY[4-i]  = YY[5-i]  + (Y[4-i] - Y[5-i] )*hh2[10];
        }

        YY[53] = YY[52] + 2*c1[11]*hh1[11];
        YY[0]  = YY[1]  + 2*c2[11]*hh2[11];

        var RX = new Array();

        for(var i = 0; i < 27; i++)
            RX[i] = 0.182*delta + 0.818;

        for(var i = 27; i < 54; i++)
            RX[i] = 0.145*delta + 0.855;

        RX[1] = (X[52]*RX[52] - (X[52] - X[1]) )/X[1];
        RX[0] = RX[1]*X[1]/X[0];

        RX[27] = 1;
        RX[26] = 1;

        for(var i = 0; i < 7; i++ )
            RX[28-i] = 1 + i*(0.145*delta + 0.855 - 1)/8;

        var w = X[33]*RX[33],
            w2 = X[9]*RX[9] + 0.15*(X[9]*RX[9] - X[19]*RX[19]);

        for(var i = 0; i < 11; i++)
        {
            RX[34+i] = w/X[34+i];
            RX[19-i] = w2/X[19-i];
        }

        var _H1 = augm*(Y[52] + c1[11]),
            _H2 =  _H1 - (Y[26] - Y[27]);

        var w3 = _H1 - (YY[52] + c1[11]),
            w4 = _H2 - (YY[1] - YY[26] + c2[11]);

        for(var i = 0; i < 10; i++)
        {
            YY[53 - i] = YY[53 - i] + w3;
            YY[i] = YY[i] + w4;
        }

    }

    var shiftX = this.size.width - this.gapBrack;

    for(var i = 0; i < 54; i++)
    {
        XX[i] = (x + shiftX + X[i]*RX[i]*alpha );
        YY[i] = (y + YY[i]*alpha );
    }

    for(var i = 0; i < 50; i++)
        XX[54 + i] = XX[51 - i];

    for(var i = 0; i < 50; i++)
        YY[54 + i] =  YY[53] + YY[52] - YY[51-i];

    var penW = 1; //px

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._l(XX[26], YY[26]);
    MathControl.pGraph._l(XX[27], YY[27]);
    MathControl.pGraph._l(XX[28], YY[28]);
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34] );
    MathControl.pGraph._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36] );
    MathControl.pGraph._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38] );
    MathControl.pGraph._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40] );
    MathControl.pGraph._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42] );
    MathControl.pGraph._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44] );
    MathControl.pGraph._c(XX[44], YY[44], XX[45], YY[45], XX[46], YY[46] );
    MathControl.pGraph._c(XX[46], YY[46], XX[47], YY[47], XX[48], YY[48] );
    MathControl.pGraph._c(XX[48], YY[48], XX[49], YY[49], XX[50], YY[50] );
    MathControl.pGraph._c(XX[50], YY[50], XX[51], YY[51], XX[52], YY[52] );
    MathControl.pGraph._l(XX[53], YY[53]);

    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );
    MathControl.pGraph._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61] );
    MathControl.pGraph._c(XX[61], YY[61], XX[62], YY[62], XX[63], YY[63] );
    MathControl.pGraph._c(XX[63], YY[63], XX[64], YY[64], XX[65], YY[65] );
    MathControl.pGraph._c(XX[65], YY[65], XX[66], YY[66], XX[67], YY[67] );
    MathControl.pGraph._c(XX[67], YY[67], XX[68], YY[68], XX[69], YY[69] );
    MathControl.pGraph._c(XX[69], YY[69], XX[70], YY[70], XX[71], YY[71] );
    MathControl.pGraph._c(XX[71], YY[71], XX[72], YY[72], XX[73], YY[73] );
    MathControl.pGraph._c(XX[73], YY[73], XX[74], YY[74], XX[75], YY[75] );
    MathControl.pGraph._c(XX[75], YY[75], XX[76], YY[76], XX[77], YY[77] );
    MathControl.pGraph._l(XX[78], YY[78]);
    MathControl.pGraph._l(XX[79], YY[79]);
    MathControl.pGraph._l(XX[80], YY[80]);
    MathControl.pGraph._c(XX[80], YY[80], XX[81], YY[81], XX[82], YY[82] );
    MathControl.pGraph._c(XX[82], YY[82], XX[83], YY[83], XX[84], YY[84] );
    MathControl.pGraph._c(XX[84], YY[84], XX[85], YY[85], XX[86], YY[86] );
    MathControl.pGraph._c(XX[86], YY[86], XX[87], YY[87], XX[88], YY[88] );
    MathControl.pGraph._c(XX[88], YY[88], XX[89], YY[89], XX[90], YY[90] );
    MathControl.pGraph._c(XX[90], YY[90], XX[91], YY[91], XX[92], YY[92] );
    MathControl.pGraph._c(XX[92], YY[92], XX[93], YY[93], XX[94], YY[94] );
    MathControl.pGraph._c(XX[94], YY[94], XX[95], YY[95], XX[96], YY[96] );
    MathControl.pGraph._c(XX[96], YY[96], XX[97], YY[97], XX[98], YY[98] );
    MathControl.pGraph._c(XX[98], YY[98], XX[99], YY[99], XX[100], YY[100] );
    MathControl.pGraph._c(XX[100], YY[100], XX[101], YY[101], XX[102], YY[102]);
    MathControl.pGraph._c(XX[102], YY[102], XX[103], YY[103], XX[0], YY[0]);

    MathControl.pGraph.df();

    shiftX = this.gapBrack;

    for(var i = 0 ; i < 54; i++)
    {
        XX[i] = (x + shiftX - X[i]*RX[i]*alpha);
    }

    for(var i = 0; i < 50; i++)
        XX[54 + i] = XX[51 - i];


    MathControl.pGraph.p_width(penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._l(XX[26], YY[26]);
    MathControl.pGraph._l(XX[27], YY[27]);
    MathControl.pGraph._l(XX[28], YY[28]);
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34] );
    MathControl.pGraph._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36] );
    MathControl.pGraph._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38] );
    MathControl.pGraph._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40] );
    MathControl.pGraph._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42] );
    MathControl.pGraph._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44] );
    MathControl.pGraph._c(XX[44], YY[44], XX[45], YY[45], XX[46], YY[46] );
    MathControl.pGraph._c(XX[46], YY[46], XX[47], YY[47], XX[48], YY[48] );
    MathControl.pGraph._c(XX[48], YY[48], XX[49], YY[49], XX[50], YY[50] );
    MathControl.pGraph._c(XX[50], YY[50], XX[51], YY[51], XX[52], YY[52] );
    MathControl.pGraph._l(XX[53], YY[53]);

    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );
    MathControl.pGraph._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61] );
    MathControl.pGraph._c(XX[61], YY[61], XX[62], YY[62], XX[63], YY[63] );
    MathControl.pGraph._c(XX[63], YY[63], XX[64], YY[64], XX[65], YY[65] );
    MathControl.pGraph._c(XX[65], YY[65], XX[66], YY[66], XX[67], YY[67] );
    MathControl.pGraph._c(XX[67], YY[67], XX[68], YY[68], XX[69], YY[69] );
    MathControl.pGraph._c(XX[69], YY[69], XX[70], YY[70], XX[71], YY[71] );
    MathControl.pGraph._c(XX[71], YY[71], XX[72], YY[72], XX[73], YY[73] );
    MathControl.pGraph._c(XX[73], YY[73], XX[74], YY[74], XX[75], YY[75] );
    MathControl.pGraph._c(XX[75], YY[75], XX[76], YY[76], XX[77], YY[77] );
    MathControl.pGraph._l(XX[78], YY[78]);
    MathControl.pGraph._l(XX[79], YY[79]);
    MathControl.pGraph._l(XX[80], YY[80]);
    MathControl.pGraph._c(XX[80], YY[80], XX[81], YY[81], XX[82], YY[82] );
    MathControl.pGraph._c(XX[82], YY[82], XX[83], YY[83], XX[84], YY[84] );
    MathControl.pGraph._c(XX[84], YY[84], XX[85], YY[85], XX[86], YY[86] );
    MathControl.pGraph._c(XX[86], YY[86], XX[87], YY[87], XX[88], YY[88] );
    MathControl.pGraph._c(XX[88], YY[88], XX[89], YY[89], XX[90], YY[90] );
    MathControl.pGraph._c(XX[90], YY[90], XX[91], YY[91], XX[92], YY[92] );
    MathControl.pGraph._c(XX[92], YY[92], XX[93], YY[93], XX[94], YY[94] );
    MathControl.pGraph._c(XX[94], YY[94], XX[95], YY[95], XX[96], YY[96] );
    MathControl.pGraph._c(XX[96], YY[96], XX[97], YY[97], XX[98], YY[98] );
    MathControl.pGraph._c(XX[98], YY[98], XX[99], YY[99], XX[100], YY[100] );
    MathControl.pGraph._c(XX[100], YY[100], XX[101], YY[101], XX[102], YY[102]);
    MathControl.pGraph._c(XX[102], YY[102], XX[103], YY[103], XX[0], YY[0]);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}


