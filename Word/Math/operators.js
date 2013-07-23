function CGlyphOperator()
{
    this.loc = null;
    this.turn = null;

    this.coord = null;
    this.size = null;
    this.measure = 0;

    this.penW = 1; // px

}
CGlyphOperator.prototype.setLocation = function(loc, turn)
{
    // location

    // 0 - up
    // 1 - down
    // 2 - left
    // 3 - right

    // turn

    // 0 - 0
    // 1 - Pi
    // 2 - Pi/2
    // 3 - 3*Pi/2

    this.loc = loc;
    this.turn = turn;
}
CGlyphOperator.prototype.setPosition = function(pos)
{
    this.pos = pos;
    //this.pos = {x: pos.x, y : pos.y - this.size.center};
}
CGlyphOperator.prototype.recalculateSize = function(measure)
{
    var sizeGlyph = this.calcSize(measure);
    var width, height, center;

    var betta = this.Parent.getTxtPrp().FontSize/36;
    var bHor = this.loc == 0 || this.loc  == 1;

    if(bHor)
    {
        width = sizeGlyph.width;
        height = sizeGlyph.height;

        center = height/2;
        this.measure = measure > width ? measure : width;
    }
    else
    {
        width = sizeGlyph.height;
        height = sizeGlyph.width;

        // baseLine смещен чуть вверх, чтобы текст при вставке в скобки располагался по центру, относительно высоты скобок
        // плейсхолдер из-за этого располагается чуть выше, как в Ворде
        center = height/2 - 1.234722222222222*betta;
        //center = height/2;
        this.measure = measure > height ? measure : height;
    }

    this.size = {width: width, height: height, center: center};
}
CGlyphOperator.prototype.draw_other = function() //  с выравниванием к краю (относительно аргумента)
{
    var coord = this.calcCoord(this.measure);

    var X = coord.XX, Y = coord.YY,
        W =  this.size.width, H =  this.size.height,
        glW, glH;

    var bHor = this.loc == 0 || this.loc  == 1;

    if(bHor)
    {
        glW = coord.W;
        glH = coord.H;
    }
    else
    {
        glW = coord.H;
        glH = coord.W;
    }

    var shW =  (W - glW)/ 2, // выравниваем глиф по длине
        shH =  (H - glH)/2; // при повороте на 90 градусовы

    if(this.loc == 0)
    {
        a1 = 1; b1 = 0; c1 = shW;
        a2 = 0; b2 = 1; c2 = 0;
    }
    else if(this.loc == 1)
    {
        a1 = 1; b1 = 0; c1 = shW;
        a2 = 0; b2 = 1; c2 = H - glH;
    }
    else if(this.loc == 2)
    {
        a1 = 0; b1 = 1; c1 = 0;
        a2 = 1; b2 = 0; c2 = shH;
    }
    else
    {
        a1 = 0; b1 = 1; c1 = W - glW;
        a2 = 1; b2 = 0; c2 = shH;
    }

    if(this.turn == 1)
    {
        a1 *= -1; b1 *= -1; c1 += glW;
    }
    else if(this.turn == 2)
    {
        a2 *= -1; b2 *= -1; c2 += glH;
    }
    else if(this.turn == 3)
    {
        a1 *= -1; b1 *= -1; c1 += glW;
        a2 *= -1; b2 *= -1; c2 += glH;
    }

    var shW =  (W - glW)/ 2, // выравниваем глиф по длине
     shH =  (H - glH)/2; // при повороте на 90 градусовы

     // A*x + B*y + C = 0

     if(bHor)
     {
     a1 = 1; b1 = 0; c1 = shW;
     a2 = 0; b2 = 1; c2 = 0;
     }
     else
     {
     a1 = 0; b1 = 1; c1 = 0;
     a2 = 1; b2 = 0; c2 = shH;
     }

     if(this.turn == 1)
     {
     a1 *= -1; b1 *= -1; c1 = W;
     }
     else if(this.turn == 2)
     {
     a2 *= -1; b2 *= -1; c2 = H;
     }
     else if(this.turn == 3)
     {
     a1 *= -1; b1 *= -1; c1 = W;
     a2 *= -1; b2 *= -1; c2 = H;
     }

    // смещение

    var gpX = 0,
        gpY = 0;

    if(this.loc == 1)
        gpY = this.penW*25.4/96;
    if(this.loc == 3)
        gpX = - this.penW*25.4/96;

    var XX = new Array(),
        YY = new Array();

    var x = this.pos.x;
    y = this.pos.y;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = x + X[i]*a1 + Y[i]*b1 + c1 + gpX;
        YY[i] = y + X[i]*a2 + Y[i]*b2 + c2 + gpY;
    }

    for(var i = 0; i < YY.length; i++)
    {
        console.log("YY["+ i + "] = "+ YY[i]);
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(this.penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    this.drawPath(XX,YY);

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CGlyphOperator.prototype.draw = function()
{
    var coord = this.calcCoord(this.measure);

    var X = coord.XX, Y = coord.YY,
        W =  this.size.width, H =  this.size.height;

    var bHor = this.loc == 0 || this.loc  == 1;
    var glW = 0, glH = 0;

    if(bHor)
    {
        glW = coord.W;
        glH = coord.H;
    }
    else
    {
        glW = coord.H;
        glH = coord.W;
    }

    var shW =  (W - glW)/ 2, // выравниваем глиф по длине
        shH =  (H - glH)/2; // при повороте на 90 градусовы

    // A*x + B*y + C = 0

    if(bHor)
    {
        a1 = 1; b1 = 0; c1 = shW;
        a2 = 0; b2 = 1; c2 = 0;
    }
    else
    {
        a1 = 0; b1 = 1; c1 = 0;
        a2 = 1; b2 = 0; c2 = shH;
    }

    if(this.turn == 1)
    {
        a1 *= -1; b1 *= -1; c1 = W - c1;
    }
    else if(this.turn == 2)
    {
        a2 *= -1; b2 *= -1; c2 = H - c2;
    }
    else if(this.turn == 3)
    {
        a1 *= -1; b1 *= -1; c1 = W - c1;
        a2 *= -1; b2 *= -1; c2 = H - c2;
    }

    var gpX = 0,
        gpY = 0;

    if(this.loc == 3)
        gpX = - this.penW*25.4/96;

    var XX = new Array(),
        YY = new Array();

    var x = this.pos.x;
    y = this.pos.y;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = x + X[i]*a1 + Y[i]*b1 + c1 + gpX;
        YY[i] = y + X[i]*a2 + Y[i]*b2 + c2 + gpY;
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(this.penW*1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    this.drawPath(XX,YY);

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CGlyphOperator.prototype.IsJustDraw = function()
{
    return true;
}
CGlyphOperator.prototype.relate = function(parent)
{
    this.Parent = parent;
}
CGlyphOperator.prototype.Resize = function()
{
    this.recalculateSize();
}

function COperator(loc, turn)
{
    this.loc = loc;
    this.turn = turn;
    this.bHor = this.loc == 0 || this.loc == 1;
    this.oper = null;
    this.arg = null;

    var countRow, countCol;
    if(this.bHor)
    {
        countRow = 2;
        countCol = 1;
    }
    else
    {
        countRow = 1;
        countCol = 2;
    }

    CMathBase.call(this, countRow, countCol);
}
extend(COperator, CMathBase);
COperator.prototype.setContent = function(calcSizeGlyph, calcCoordGlyph, drawPath)
{
    var operator = new CGlyphOperator(this.loc, this.turn);
    operator.init(this.params.font);

    operator.calcSize = calcSizeGlyph;
    operator.calcCoord = calcCoordGlyph;
    operator.drawPath = drawPath;

    var argument = new CMathContent();
    argument.init(this.params);
    argument.relate(this);
    argument.fillPlaceholders();

    this.oper = operator;
    this.arg = argument;

    var first, second;

    if(this.loc == 0 || this.loc == 2)
    {
        first = operator;
        second = argument;
    }
    else
    {
        first = argument;
        second = operator;
    }

    COperator.superclass.setContent.call(this, first, second);
}
COperator.prototype.recalculateSize = function()
{
    if(this.bHor)
        this.oper.recalculateSize(this.arg.size.width);
    else
        this.oper.recalculateSize(this.arg.size.height);

    COperator.superclass.recalculateSize.call(this);
}
COperator.prototype.getCenter = function()
{
    var center;

    if(this.loc == 0)
        center = this.elements[0][0].size.height + this.elements[1][0].size.center;
    else
        center = this.elements[0][0].size.height;

    return center;
}

function CDelimiter()
{
    // location

    // 0 -  up
    // 1 - down
    // 2 - left
    // 3 - right
    // 4 - left/right
    // 5 - up/down

    this.type = null;
    this.loc = null;
    this.base = null;

    CMathBase.call(this);
}
extend(CDelimiter, CMathBase);
CDelimiter.prototype.init = function(type, loc, turn1, turn2)
{
    var base = new CMathContent();

    var params =
    {
        type: type,
        loc: loc,
        turn1: turn1,
        turn2: turn2
    };

    this.init_2(params, base);
}
CDelimiter.prototype.init_2 = function(params, base)
{
    this.type = params.type;
    this.loc = params.loc;

    this.base = base;

    var nRow, nCol,
        tturn1, tturn2;

    if(this.loc== 0)
    {
        nRow = 2;
        nCol = 1;
        tturn1 = params.turn1;
    }
    else if(this.loc == 1)
    {
        nRow = 2;
        nCol = 1;
        tturn2 = params.turn1;
    }
    else if(this.loc == 2)
    {
        nRow = 1;
        nCol = 2;

        tturn1 = params.turn1;
    }
    else if(this.loc == 3)
    {
        nRow = 1;
        nCol = 2;
        tturn2 = params.turn1;
    }
    else if(this.loc == 4)
    {
        nRow = 1;
        nCol = 3;

        tturn1 = params.turn1;
        tturn2 = params.turn2;
    }
    else
    {
        nRow = 3;
        nCol = 1;

        tturn1 = params.turn1;
        tturn2 = params.turn2;
    }

    this.setDimension(nRow, nCol);

    var operator1, operator2,
        loc1, loc2;

    if(this.loc == 0)
        loc1 = 0;
    else if(this.loc == 1)
        loc2 = 1;
    else if(this.loc == 2)
        loc1 = 2;
    else if(this.loc == 3)
        loc2 = 3;
    else if(this.loc == 4)
    {
        loc1 = 2;
        loc2 = 3;
    }
    else
    {
        loc1 = 0;
        loc2 = 1;
    }


    if(this.type == 0)
    {
        operator1 = new COperatorParenthesis();
        operator2 = new COperatorParenthesis();
    }
    else if(this.type == 1)
    {
        operator1 = new COperatorBracket();
        operator2 = new COperatorBracket();
    }
    else if(this.type == 2)
    {
        operator1 = new CSquareBracket();
        operator2 = new CSquareBracket();
    }
    else if(this.type == 3)
    {
        operator1 = new COperatorAngleBracket();
        operator2 = new COperatorAngleBracket();
    }
    else if(this.type == 4)
    {
        operator1 = new CHalfSquareBracket();
        operator2 = new CHalfSquareBracket();
    }
    else if(this.type == 5)
    {
        operator1 = new COperatorLine();
        operator2 = new COperatorLine();
    }
    else if(this.type == 6)
    {
        operator1 = new COperatorDoubleLine();
        operator2 = new COperatorDoubleLine();
    }
    else
    {
        operator1 = new CWhiteSquareBracket();
        operator2 = new CWhiteSquareBracket();
    }

    operator1.setLocation(loc1, tturn1);
    operator1.relate(this);
    operator2.setLocation(loc2, tturn2);
    operator2.relate(this);
  

    if(this.loc == 0 || this.loc == 2)
    {
        this.addMCToContent(operator1, base);
    }
    else if(this.loc == 1  || this.loc == 3)
    {
        this.addMCToContent(base, operator2);
    }
    else
    {
        this.addMCToContent(operator1, base, operator2);
    }

    //выравнивание для случая когда центр смещен (не середина), для вложенных дробей и т.п.
    if(this.loc == 2)
    {
        this.alignVer(0, 0.5);
    }
    else if(this.loc == 3)
    {
        this.alignVer(1, 0.5);
    }
    if(this.loc == 4)
    {
        this.alignVer(0, 0.5);
        this.alignVer(2, 0.5);
    }
}
CDelimiter.prototype.recalculateSize = function()
{
    var width, height, center;

    if(this.loc == 0)
    {
        oper = this.elements[0][0];
        arg = this.elements[1][0];

        oper.recalculateSize(arg.size.width);

        width = oper.size.width > arg.size.width ? oper.size.width : arg.size.width;
        height = oper.size.height + arg.size.height;
        center = oper.size.height + arg.size.center;
    }
    else if(this.loc == 1)
    {
        arg = this.elements[0][0];
        oper = this.elements[1][0];

        oper.recalculateSize(arg.size.width);

        width = oper.size.width > arg.size.width ? oper.size.width : arg.size.width;
        height = oper.size.height + arg.size.height;
        center = arg.size.center;
    }
    else if(this.loc == 2)
    {
        arg  = this.elements[0][1];
        oper = this.elements[0][0];

        oper.recalculateSize(arg.size.height);

        width = arg.size.width + oper.size.width;
        height = oper.size.height > arg.size.height ? oper.size.height : arg.size.height;
        center = oper.size.center > arg.size.center ? oper.size.center : arg.size.center;
    }
    else if(this.loc == 3)
    {
        arg  = this.elements[0][0];
        oper = this.elements[0][1];

        oper.recalculateSize(arg.size.height);

        width = arg.size.width + oper.size.width;
        height = oper.size.height > arg.size.height ? oper.size.height : arg.size.height;
        center = oper.size.center > arg.size.center ? oper.size.center : arg.size.center;
    }
    else if(this.loc == 4)
    {
        oper1 = this.elements[0][0];
        arg   = this.elements[0][1];
        oper2 = this.elements[0][2];

        oper1.recalculateSize(arg.size.height);
        oper2.recalculateSize(arg.size.height);

        width =  oper1.size.width + arg.size.width + oper2.size.width;
        height = oper1.size.height > arg.size.height ? oper1.size.height : arg.size.height; // oper1.size.height and oper2.size.height are equals
        center = oper1.size.center > arg.size.center ? oper1.size.center : arg.size.center;
    }
    else
    {
        oper1 = this.elements[0][0];
        arg   = this.elements[1][0];
        oper2 = this.elements[2][0];
    
        oper1.recalculateSize(arg.size.width);
        oper2.recalculateSize(arg.size.width);
    
        width = oper1.size.width > arg.size.width ? oper1.size.width : arg.size.width; // oper1.size.width and oper2.size.width are equals
        height = oper1.size.height + arg.size.height + oper2.size.height;
        center = oper1.size.height + arg.size.center;
    }

    this.size = {width: width, height: height, center: center};
}
CDelimiter.prototype.getBase = function()
{
    return this.base;
}
CDelimiter.prototype.Resize = function()
{
    for(var i=0; i < this.nRow; i++)
        for(var j = 0; j < this.nCol; j++)
            if(! this.elements[i][j].IsJustDraw() )
                this.elements[i][j].Resize();

    this.recalculateSize();
}


function COperatorBracket()
{
    CGlyphOperator.call(this);
}
extend(COperatorBracket, CGlyphOperator);
COperatorBracket.prototype.calcSize = function( measure )
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    // перевернутая скобка
    var minBoxH = 4.917529296874999 *betta, //width of 0x28
        widthBr = 12.347222222222221*betta;

    var rx = measure / widthBr;
    if(rx < 1)
        rx = 1;

    if(rx < 2.1)
        maxBoxH = minBoxH * 1.37;
    else if(rx < 3.22)
        maxBoxH = minBoxH * 1.06;
    else
        maxBoxH =   8.74 *betta;

    var delta = maxBoxH - minBoxH;

    var heightBr = delta/4.3 * (rx - 1) + minBoxH;
    heightBr = heightBr >  maxBoxH ? maxBoxH : heightBr;

    return {width: widthBr, height: heightBr};
}
COperatorBracket.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 26467; Y[0] = 18871;
    X[1] = 25967; Y[1] = 18871;
    X[2] = 25384; Y[2] = 16830;
    X[3] = 24737; Y[3] = 15476;
    X[4] = 24091; Y[4] = 14122;
    X[5] = 23341; Y[5] = 13309;
    X[6] = 22591; Y[6] = 12497;
    X[7] = 21778; Y[7] = 12164;
    X[8] = 20965; Y[8] = 11831;
    X[9] = 20089; Y[9] = 11831;
    X[10] = 19214; Y[10] = 11831;
    X[11] = 18317; Y[11] = 12083;
    X[12] = 17421; Y[12] = 12336;
    X[13] = 16441; Y[13] = 12652;
    X[14] = 15462; Y[14] = 12969;
    X[15] = 14357; Y[15] = 13243;
    X[16] = 13253; Y[16] = 13518;
    X[17] = 11961; Y[17] = 13518;
    X[18] = 9835; Y[18] = 13518;
    X[19] = 8292; Y[19] = 12621;
    X[20] = 6750; Y[20] = 11724;
    X[21] = 5750; Y[21] = 10055;
    X[22] = 4750; Y[22] = 8386;
    X[23] = 4270; Y[23] = 5987;
    X[24] = 3791; Y[24] = 3589;
    X[25] = 3791; Y[25] = 626;
    X[26] = 3791; Y[26] = 0;
    X[27] = 0; Y[27] = 0;
    X[28] = 0; Y[28] = 1084;
    X[29] = 83; Y[29] = 5963;
    X[30] = 1021; Y[30] = 9612;
    X[31] = 1959; Y[31] = 13261;
    X[32] = 3543; Y[32] = 15700;
    X[33] = 5127; Y[33] = 18139;
    X[34] = 7232; Y[34] = 19369;
    X[35] = 9337; Y[35] = 20599;
    X[36] = 11796; Y[36] = 20599;
    X[37] = 13338; Y[37] = 20599;
    X[38] = 14588; Y[38] = 20283;
    X[39] = 15839; Y[39] = 19968;
    X[40] = 16860; Y[40] = 19610;
    X[41] = 17882; Y[41] = 19252;
    X[42] = 18736; Y[42] = 18936;
    X[43] = 19590; Y[43] = 18621;
    X[44] = 20340; Y[44] = 18621;
    X[45] = 21091; Y[45] = 18621;
    X[46] = 21820; Y[46] = 18995;
    X[47] = 22550; Y[47] = 19370;
    X[48] = 23133; Y[48] = 20266;
    X[49] = 23717; Y[49] = 21162;
    X[50] = 24092; Y[50] = 22703;
    X[51] = 24467; Y[51] = 24245;
    X[52] = 24551; Y[52] = 26578;
    X[53] = 28133; Y[53] = 26578;

    //TODO
    // X[1] > X[52]

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры
    
    var augm = measure/((X[52] + (X[0] - X[1])/2 + X[1] - X[52])*alpha*2);

    if(augm < 1)
        augm = 1;

    var YY = new Array(),
        XX = new Array();

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

        RX[1] = (Y[52]*RX[52] - (Y[52] - Y[1]) )/Y[1];
        RX[0] = RX[1]*Y[1]/Y[0];

        RX[27] = 1;
        RX[26] = 1;

        for(var i = 0; i < 8; i++ )
            RX[26-i] = 1 + i*((RX2+RX1)/2 - 1)/7;


        for(var i = 0; i < 4; i++)
        {
            c1[i] = X[30 + 2*i] - X[28 + 2*i];
            c2[i] = X[23 - 2*i] - X[25 - 2*i];
        }

        c1[5] = X[48] - X[44];
        c2[5] = X[5] - X[9];


        c1[6] = X[52] - X[48];
        c2[6] = X[1] - X[5];


        c1[7] = (X[0] - X[1])/2 + X[1] - X[52];
        c2[7] = (X[0] - X[1])/2;

        c1[4] = X[44] - X[36];
        c2[4] = X[9] - X[17];

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

        var H1 = delta*(X[52] + c1[7]),
            H2 =  H1 - (X[26] - X[27]) ;

        hh1[4] = (H1 - rest1)/c1[4];
        hh2[4] = (H2 - rest2)/c2[4];

        XX[27] = X[27];
        XX[26] = X[26];

        XX[28] = X[27];
        XX[25] = X[26];

        for(var i = 0; i < 4; i++)
        {
            for(var j = 1; j < 3; j ++)
            {
                t = j + i*2;
                XX[28 + t] = XX[27 + t] + (X[28+t] - X[27+t])*hh1[i];
                XX[25 - t] = XX[26 - t] + (X[25-t] - X[26-t])*hh2[i];
            }
        }

        //переопределяем 36 и 17
        for(var i = 1; i < 9; i++)
        {
            XX[36 + i] = XX[35+i] + (X[36+i] - X[35+i])*hh1[4];
            XX[17 - i] = XX[18-i] + (X[17-i] - X[18-i])*hh2[4];
        }

        for(var i = 0; i < 4; i++)
        {
            XX[45+i] = XX[44+i] + ( X[45+i] - X[44+i])*hh1[5];
            XX[8-i]  = XX[9-i] + (X[8-i] -X[9-i])*hh2[5];
        }

        for(var i = 0; i < 4; i++)
        {
            XX[49+i] = XX[48+i] + (X[49+i] - X[48+i])*hh1[6];
            XX[4-i]  = XX[5-i]  + (X[4-i] - X[5-i] )*hh2[6];
        }

        XX[53] = XX[52] + 2*c1[7]*hh1[7];
        XX[0]  = XX[1]  + 2*c2[7]*hh2[7];

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
            c1[i] = X[30+i] - X[29+i];
            c2[i] = X[24-i] - X[25-i];
        }

        c1[9] = X[48] - X[44];
        c2[9] = X[5] - X[9];

        c1[10] = X[52] - X[48];
        c2[10] = X[1] - X[5];


        c1[11] = (X[0] - X[1])/2 + X[1] - X[52];
        c2[11] = (X[0] - X[1])/2;

        c1[8] = X[44] - X[36];
        c2[8] = X[9] - X[17];


        for(var i = 0; i < 12; i++)
        {
            if(i == 8)
                continue;
            hh1[i] = (hh1[i] - 1)*(delta - 1) + 1;
            hh2[i] = (hh2[i] - 1)*(delta - 1) + 1;

            rest1 += hh1[i]*c1[i];
            rest2 += hh2[i]*c2[i];
        }

        var H1 = delta*(X[52] + c1[11]),
            H2 =  H1 - (X[26] - X[27]) ;

        hh1[8] = (H1 - rest1)/c1[8];
        hh2[8] = (H2 - rest2)/c2[8];

        XX[27] = X[27];
        XX[26] = X[26];

        XX[28] = X[27];
        XX[25] = X[26];

        for(var i = 0; i < 9; i++)
        {
            XX[28 + i] = XX[27 + i] + (X[28+i] - X[27+i])*hh1[i];
            XX[25 - i] = XX[26 - i] + (X[25-i] - X[26-i])*hh2[i];
        }

        //переопределяем 36 и 17
        for(var i = 1; i < 9; i++)
        {
            XX[36 + i] = XX[35+i] + (X[36+i] - X[35+i])*hh1[8];
            XX[17 - i] = XX[18-i] + (X[17-i] - X[18-i])*hh2[8];
        }

        // TODO
        // переделать
        for(var i = 0; i < 4; i++)
        {
            XX[45+i] = XX[44+i] + ( X[45+i] - X[44+i])*hh1[9];
            XX[8-i]  = XX[9-i] + (X[8-i] -X[9-i])*hh2[9];
        }

        for(var i = 0; i < 4; i++)
        {
            XX[49+i] = XX[48+i] + (X[49+i] - X[48+i])*hh1[10];
            XX[4-i]  = XX[5-i]  + (X[4-i] - X[5-i] )*hh2[10];
        }

        XX[53] = XX[52] + 2*c1[11]*hh1[11];
        XX[0]  = XX[1]  + 2*c2[11]*hh2[11];

        var RX = new Array();

        for(var i = 0; i < 27; i++)
            RX[i] = 0.182*delta + 0.818;

        for(var i = 27; i < 54; i++)
            RX[i] = 0.145*delta + 0.855;

        RX[1] = (Y[52]*RX[52] - (Y[52] - Y[1]) )/Y[1];
        RX[0] = RX[1]*Y[1]/Y[0];

        RX[27] = 1;
        RX[26] = 1;

        for(var i = 0; i < 7; i++ )
            RX[28-i] = 1 + i*(0.145*delta + 0.855 - 1)/8;

        var w = Y[33]*RX[33],
            w2 = Y[9]*RX[9] + 0.15*(Y[9]*RX[9] - Y[19]*RX[19]);

        for(var i = 0; i < 11; i++)
        {
            RX[34+i] = w/Y[34+i];
            RX[19-i] = w2/Y[19-i];
        }

        var _H1 = augm*(X[52] + c1[11]),
            _H2 =  _H1 - (X[26] - X[27]);

        var w3 = _H1 - (XX[52] + c1[11]),
            w4 = _H2 - (XX[1] - XX[26] + c2[11]);

        for(var i = 0; i < 10; i++)
        {
            XX[53 - i] = XX[53 - i] + w3;
            XX[i] = XX[i] + w4;
        }

    }

    var H =  Y[53]*RX[53];
    for(var i = 0; i < 54; i++)
    {
        YY[i] =  (H - Y[i]*RX[i])*alpha;
        XX[i] =  XX[i]*alpha;
    }

    for(var i = 0; i < 50; i++)
        YY[54 + i] = YY[51 - i];

    for(var i = 0; i < 50; i++)
        XX[54 + i] =  XX[53] + XX[52] - XX[51-i];

    var W = XX[77], // ширина глифа
        H = YY[26]; // высота глифа

    return {XX: XX, YY: YY, W: W, H: H};
}
COperatorBracket.prototype.drawPath = function(XX, YY)
{
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
}

// TODO: сделать так, чтобы размер скобки совпадал в начальном случае (плейсхолдер), сейчас по размеру аргумента

function COperatorParenthesis()
{
    CGlyphOperator.call(this);
}
extend(COperatorParenthesis, CGlyphOperator);
COperatorParenthesis.prototype.calcSize = function(measure)
{
    var betta = this.Parent.getTxtPrp().FontSize/36;
    
    var maxBoxH =   9.63041992187 *betta, //9.63 width of 0x239D
        minBoxH =   5.27099609375 *betta, //width of 0x28
        widthBr = 11.99444444444 *betta;

    var ry = measure / widthBr,
        delta = maxBoxH - minBoxH;

    var heightBr = delta/4.3 * (ry - 1) + minBoxH;
    heightBr = heightBr >  maxBoxH ? maxBoxH : heightBr;

    return {height: heightBr, width : widthBr};
}
COperatorParenthesis.prototype.calcCoord = function(measure)
{
    //cкобка перевернутая на 90 градусов

    var X = new Array(),
        Y = new Array();

    X[0] = 39887; Y[0] = 18995;
    X[1] = 25314; Y[1] = 18995;
    X[2] = 15863; Y[2] = 14309;
    X[3] = 6412; Y[3] = 9623;
    X[4] = 3206; Y[4] = 0;
    X[5] = 0; Y[5] = 1000;
    X[6] = 3206; Y[6] = 13217;
    X[7] = 13802; Y[7] = 19722;
    X[8] = 24398; Y[8] = 26227;
    X[9] = 39470; Y[9] = 26227;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var aug = measure/(X[9]*alpha)/2; //Y[9]*alpha - высота скобки
    var RX, RY;

    if(aug > 6.53)
    {
        RX = 6.53;
        RY = 2.05;
    }
    else if(aug < 1)
    {
        RX = 1;
        RY = 1;
    }
    else
    {
        RX = aug;
        RY = 1 + (aug - 1)*0.19;
    }

    var DistH = new Array();
    for(var i= 0; i< 5; i++)
        DistH[i] = Y[9-i] - Y[i];

    for(var i = 5; i < 10; i++)
    {
        Y[i] = Y[i]*RY;               //точки правой дуги
        Y[9-i] = Y[i] - DistH[9-i];   //точки левой дуги
    }

    // X
    var DistW = new Array();
    for(var j= 0; j< 5; j++)
        DistW[j] = X[18-j] - X[9+j];

    for(var i=0; i< 5; i++)
        DistW[i] = X[9-j] - X[j];

    for(var i=5; i<10; i++ )
    {
        X[i] = X[i]*RX;
        X[9-i] = X[i] + DistW[9-i];
    }

    var XX = new Array(),
        YY = new Array();

    var shiftY =  1.1*Y[9]*alpha;

    // YY[0]  - YY[9]  - нижняя часть скобки
    // YY[9]  - YY[10] - отрезок прямой
    // YY[11] - YY[19] - верхняя часть скобки
    // YY[19] - YY[20] - отрезок прямой

    for(var i = 0; i < 10; i++)
    {
        YY[19 - i] = YY[i] =  shiftY - Y[i]*alpha;
        XX[19 - i] =  X[i]*alpha;
        XX[i] = measure - X[i]*alpha;
    }

    YY[20] = YY[0];
    XX[20] = XX[0];

    var W = XX[5],
        H = YY[4];

    return {XX: XX, YY: YY, W: W, H: H };
}
COperatorParenthesis.prototype.drawPath = function(XX, YY)
{
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
}

// TODO
// установить минимальный размер стрелок

function COperatorArrow(id, loc, turn)
{
    // id
    // 0 - harpoon
    // 1 - arrow
    // 2 - double arrow

    // loc
    // 0 - up
    // 1 - down
    // 2 - left
    // 3 - right

    this.id = id;
    if(this.loc == 2 || this.loc == 3)
    {
        if(this.turn == 1)
            this.turn = 3;
        else if(this.turn == 3)
            this.turn = 1;
    }

    COperator.call(this, loc, turn);
}
extend(COperatorArrow, COperator);
COperatorArrow.prototype.setContent = function()
{
    COperatorArrow.superclass.setContent.call(this, this.calcSize, this.calcCoord, this.drawPath);
}
COperatorArrow.prototype.setContent = function()
{
    //this.fillPlaceholders();

    COperatorArrow.superclass.setContent.call(this, this.calcSize, this.calcCoord, this.drawPath);

    if(this.loc == 0)
        this.arg.SetDotIndef(true);
}
COperatorArrow.prototype.calcSize = function()
{
    // 0x21BC half, down

    var height = 3.88*this.betta;
    var width = 4.938*this.betta;

    return {width: width, height: height};
}
COperatorArrow.prototype.calcCoord = function(measure)
{
    // px                       mm
    // XX[..]                   width
    // YY[..]                   height
    // penW

    var X = new Array(),
        Y = new Array();

    // 600 pt

    X[0] = 0;       Y[0] = 3047;//Y[2] = 2245;
    X[1] = 9415;    Y[1] = 11431;
    X[2] = 10766;   Y[2] = 10171;
    X[3] = 5566;    Y[3] = 3047;


    var lineW = measure/this.alpha;
    //var lineW = measure - 2*this.penW*this.alpha;  //mm
    var lineH = 3047;

    //var h = this.size.height > this.size.width ? this.size.width : this.size.height; // т.к. в glyph нет bVert
    var shY =  (this.size.height/this.alpha - lineH)/2;

    X[4] = 0;            Y[4] = 0;
    X[5] = 0;            Y[5] = lineH;
    X[6] = lineW;        Y[6] = lineH;
    X[7] = lineW;        Y[7] = 0;
    X[8] = 0;            Y[8] = 0;

    for(var i = 0 ; i < X.length; i++)
    {
        X[i] = X[i]*this.alpha;
        Y[i] = (shY + Y[i])*this.alpha;
    }

    var W = X[6],
        H = Y[1];

    return {XX: X, YY: Y, W: W, H: H};
}
COperatorArrow.prototype.calcCoord_other = function(measure) //  с выравниванием к краю (относительно аргумента)
{
    // px                       mm
    // XX[..]                   width
    // YY[..]                   height
    // penW

    var X = new Array(),
        Y = new Array();

    // 600 pt

    X[0] = 0;       Y[0] = 3047;//Y[2] = 2245;
    X[1] = 9415;    Y[1] = 11431;
    X[2] = 10766;   Y[2] = 10171;
    X[3] = 5566;    Y[3] = 3047;

    var lineW = measure/this.alpha;
    var lineH = Y[3];

    var shY = Y[1] - lineH; // выравнивам, чтобы линии стрелок совпадали

    X[4] = 0;            Y[4] = 0;
    X[5] = 0;            Y[5] = lineH;
    X[6] = lineW;        Y[6] = lineH;
    X[7] = lineW;        Y[7] = 0;
    X[8] = 0;            Y[8] = 0;

    for(var i = 0 ; i < X.length; i++)
    {
        X[i] = X[i]*this.alpha;
        Y[i] = (shY + Y[i])*this.alpha;
    }

    var W = X[6],
        H = Y[1];

    return {XX: X, YY: Y, W: W, H: H};
}
COperatorArrow.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);

    MathControl.pGraph._m(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._l(XX[8], YY[8]);
}
COperatorArrow.prototype.draw = function()
{
    if(this.id == 1)
        bTEST = true;
    else
        bTEST = false;

    var turn = this.oper.turn;
    var TT = new Array();
    // поворачивая стрелку, рисуем ее несколько раз
    //cоответствующие коэффициенты поворота записываем в TT

    this.arg.draw();
    if(this.id == 0)
        TT.push(this.oper.turn);
    else if(this.id == 1)
    {
        if(this.bHor)
        {
            if(this.turn == 0)
            {
                TT.push(0);
                TT.push(2);
            }
            else
            {
                TT.push(1);
                TT.push(3);
            }
        }
        else
        {
            if(this.turn == 0)
            {
                TT.push(0);
                TT.push(1);
            }
            else
            {
                TT.push(2);
                TT.push(3);
            }
        }
    }
    else
    {
        TT.push(0);
        TT.push(1);
        TT.push(2);
        TT.push(3);
    }

    for(var i = 0; i < TT.length; i++)
    {
        this.oper.turn = TT[i];
        this.oper.draw();
    }

    this.oper.turn = turn;
}

function COperatorAngleBracket()
{
    CGlyphOperator.call(this);
}
extend(COperatorAngleBracket, CGlyphOperator);
COperatorAngleBracket.prototype.calcSize = function(measure)
{
    //скобка перевернутая

    var betta = this.Parent.getTxtPrp().FontSize/36;
    var widthBr = 11.994444444444444*betta;

    if( measure/widthBr > 3.768 )
        heightBr = 5.3578125*betta;
    else
        heightBr = 4.828645833333333*betta;

    return {width : widthBr, height: heightBr};
}
COperatorAngleBracket.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 38990; Y[0] = 7665;
    X[1] = 1583; Y[1] = 21036;
    X[2] = 0; Y[2] = 16621;
    X[3] = 37449; Y[3] = 0;
    X[4] = 40531; Y[4] = 0;
    X[5] = 77938; Y[5] = 16621;
    X[6] = 76439; Y[6] = 21036;
    X[7] = 38990; Y[7] = 7665;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var augm = measure/(X[5]*alpha);

    if(augm < 1)
        augm = 1;
    else if(augm > 4.7)
        augm = 4.7;

    var c1 = 1, c2 = 1;

    var ww1 = Y[0] - Y[3],
        ww2 = Y[1] - Y[2],
        ww3 = Y[1] - Y[0],
        ww4 = Y[2] - Y[3];

    if(augm > 3.768)
    {
        var WW = (Y[1] - Y[3])*1.3;
        c1 = (WW - ww1)/ww3;
        c2 = (WW - ww2)/ww4
    }

    Y[1] = Y[6] = Y[0] + ww3*c1;
    Y[2] = Y[5] = Y[3] + ww4*c2;


    var k1 = 0.01*augm;

    var hh1 = (X[0] - X[3])*k1,
        hh2 = X[1] - X[2],
        hh3 = X[3] - X[2],
        hh4 = X[0] - X[1],
        HH = augm*(X[0] - X[2]);

    var k2 = (HH -  hh1)/hh3,
        k3 = (HH - hh2)/hh4;

    X[7] = X[0] = X[1] + k3*hh4;
    X[3] = X[2] + k2*hh3;

    for(var i = 0; i < 3; i++)
    {
        X[4 + i] = 2*HH - X[3 - i];
    }

    /*var hh1 = 0.1*augm,
     hh2 = (augm*X[0] - X[])*/

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var W = XX[5],
        H = YY[1];

    return {XX: XX, YY: YY, W: W, H: H};
}
COperatorAngleBracket.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
}

function CSquareBracket()
{
    CGlyphOperator.call(this);
}
extend(CSquareBracket, CGlyphOperator);
CSquareBracket.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 3200;  Y[0] = 6912;
    X[1] = 3200;  Y[1] = 18592;
    X[2] = 0;     Y[2] = 18592;
    X[3] = 0;     Y[3] = 0;
    X[4] = 79424; Y[4] = 0;
    X[5] = 79424; Y[5] = 18592;
    X[6] = 76224; Y[6] = 18592;
    X[7] = 76224; Y[7] = 6912;
    X[8] = 3200;  Y[8] = 6912;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var lng = measure/alpha - X[4] - 2*X[0];

    if(lng < 0)
        lng = 0;

    for(var i = 0; i < 4; i++)
        X[4+i] += lng;


    var XX = new Array(),
        YY = new Array();

    var shY =  Y[0]*alpha;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha + shY;
    }

    var W = XX[4],
        H = YY[1];

    return {XX: XX, YY: YY, W: W, H: H};
}
CSquareBracket.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._l(XX[8], YY[8]);
}
CSquareBracket.prototype.calcSize = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;
    
    var height = 4.446240234375*betta;
    //var width = 12.0*this.betta;
    var width = 12.347222222222221*betta;

    return {width: width, height: height};
}

function CHalfSquareBracket()
{
    CGlyphOperator.call(this);
}
extend(CHalfSquareBracket, CGlyphOperator);
CHalfSquareBracket.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 0;
    X[1] = 0; Y[1] = 7000;
    X[2] = 74106; Y[2] = 7000;
    X[3] = 74106; Y[3] = 18578;
    X[4] = 77522; Y[4] = 18578;
    X[5] = 77522; Y[5] = 0;
    X[6] = 0; Y[6] = 0;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var w1 = X[4],
        w2 = X[4] - X[3];
    var lng = measure/alpha - w1 - w2;

    if(lng < 0)
        lng = 0;

    for(var i = 0; i < 4; i++)
        X[2+i] += lng;

    var XX = new Array(),
        YY = new Array();

    var shY = Y[1]*alpha;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha + shY;
    }

    var W = XX[4],
        H = YY[4];

    return {XX: XX, YY: YY, W: W, H: H};
}
CHalfSquareBracket.prototype.calcSize = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var height = 4.446240234375*betta;
    var width = 11.99444444444*betta;

    return {width: width, height: height};
}
CHalfSquareBracket.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
}

function GroupCharacter(id)
{
    this.id = id == 1  ? 1 : -1;
    CSubMathBase.call(this, 2, 1);
}
extend(GroupCharacter, CSubMathBase);
GroupCharacter.prototype.setContent = function()
{
    var lim = new CMathContent();

    var parLim = Common_CopyObj(this.params);
    parLim.font = getTypeDegree(parLim.font);

    lim.init(parLim);
    lim.relate(this);
    lim.fillPlaceholders();

    if(this.id == 1)
    {
        var GrBracket = new CDelimiter(1, 0, 0);
        GrBracket.init(this.params);
        GrBracket.relate(this);
        GrBracket.setContent();

        GroupCharacter.superclass.setContent.call(this, lim, GrBracket);
    }
    else
    {
        var GrBracket = new CDelimiter(1, 1, 2);
        GrBracket.init(this.params);
        GrBracket.relate(this);
        GrBracket.setContent();

        GroupCharacter.superclass.setContent.call(this, GrBracket, lim);
    }

}
GroupCharacter.prototype.getCenter = function()
{
    var center;

    if(this.id == 1)
    {
        var hLim = this.elements[0][0].size.height,
            cGrBr = this.elements[1][0].size.center;

        center = hLim + cGrBr + this.dH;
    }
    else
    {
        center = this.elements[0][0].size.center;
    }


    return center;
}
GroupCharacter.prototype.recalculateSize = function()
{
    var metrics = this.params.font.metrics;
    var gap = metrics.Height - metrics.Placeholder.Height + metrics.Descender;

    this.dH = gap/4;

    GroupCharacter.superclass.recalculateSize.call(this);
}

function COperatorLine()
{
    CGlyphOperator.call(this);
}
extend(COperatorLine, CGlyphOperator);
COperatorLine.prototype.setContent = function()
{
    COperatorLine.superclass.setContent.call(this, this.calcSize, this.calcCoord, this.drawPath);
}
COperatorLine.prototype.calcSize = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var height = 4.018359374999999*betta;
    var width = 11.99444444444*betta;

    return {width: width, height: height};
}
COperatorLine.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0;     Y[0] = 0;
    X[1] = 0;     Y[1] = 5520;
    X[2] = 77504; Y[2] = 5520;
    X[3] = 77504; Y[3] = 0;
    X[4] = 0;     Y[4] = 0;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    var shY = 2*Y[1]*alpha;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha + shY;
    }

    var lng = measure - X[2]*alpha;

    if(lng < 0)
        lng = 0;

    XX[2] += lng;
    XX[3] += lng;


    var W = XX[2],
        H = YY[2];

    return {XX: XX, YY: YY, W: W, H: H};

}
COperatorLine.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
}

function CWhiteSquareBracket()
{
    CGlyphOperator.call(this);
}
extend(CWhiteSquareBracket, CGlyphOperator);
CWhiteSquareBracket.prototype.calcSize = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var height = 5.5872558593749995*betta;
    var width = 11.99444444444*betta;

    return {width: width, height: height};
}
CWhiteSquareBracket.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    /*X[0] = 77529; Y[0] = 26219;
     X[1] = 77529; Y[1] = 0;
     X[2] = 0; Y[2] = 0;
     X[3] = 0; Y[3] = 26219;
     X[4] = 4249; Y[4] = 26219;
     X[5] = 4249; Y[5] = 17055;
     X[6] = 73280; Y[6] = 17055;
     X[7] = 73280; Y[7] = 26219;
     X[8] = 77529; Y[8] = 26219;
     X[9] = 73280; Y[9] = 12431;
     X[10] = 4249; Y[10] = 12431;
     X[11] = 4249; Y[11] = 4623;
     X[12] = 73280; Y[12] = 4623;
     X[13] = 73280; Y[13] = 12431;*/

    X[0] = 3225;  Y[0] = 17055;
    X[1] = 3225;  Y[1] = 26219;
    X[2] = 0;     Y[2] = 26219;
    X[3] = 0;     Y[3] = 0;
    X[4] = 77529; Y[4] = 0;
    X[5] = 77529; Y[5] = 26219;
    X[6] = 74304; Y[6] = 26219;
    X[7] = 74304; Y[7] = 17055;
    X[8] = 3225;  Y[8] = 17055;

    X[9] = 74304; Y[9] = 12700;
    X[10] = 3225; Y[10] = 12700;
    X[11] = 3225; Y[11] = 4600;
    X[12] = 74304; Y[12] = 4600;
    X[13] = 74304; Y[13] = 12700;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    var shY = (Y[1] - Y[0])*alpha;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha + shY;
    }

    var lngY = measure - X[4]*alpha;

    for(var i = 0; i < 4; i++)
        XX[4+i] += lngY;

    XX[12] += lngY;
    XX[13] += lngY;

    var W = XX[4],
        H = YY[3];

    return {XX: XX, YY: YY, W: W, H: H};
}
CWhiteSquareBracket.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._l(XX[8], YY[8]);
    MathControl.pGraph.df();

    MathControl.pGraph.b_color1(255,255,255, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[9], YY[9]);
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._l(XX[11], YY[11]);
    MathControl.pGraph._l(XX[12], YY[12]);
    MathControl.pGraph._l(XX[13], YY[13]);
}

function COperatorDoubleLine()
{
    CGlyphOperator.call(this);
}
extend(COperatorDoubleLine, CGlyphOperator);
COperatorDoubleLine.prototype.calcSize = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var height = 6.715869140624999*betta,
        width = 11.99444444444*betta;

    return {width: width, height: height};
}
COperatorDoubleLine.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    //X[0] = 77504; Y[0] = 6400;

    X[0] = 0;     Y[0] = 0;
    X[1] = 0;     Y[1] = 5900;
    X[2] = 77504; Y[2] = 5900;
    X[3] = 77504; Y[3] = 0;
    X[4] = 0;     Y[4] = 0;

    X[5] = 0;     Y[5] = 18112;
    X[6] = 0;     Y[6] = 24012;
    X[7] = 77504; Y[7] = 24012;
    X[8] = 77504; Y[8] = 18112;
    X[9] = 0;     Y[9] = 18112;

    var textScale = this.Parent.getTxtPrp().FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    var shY = 1.5*Y[1]*alpha;

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha + shY;
    }

    for(var i = 0; i < 2; i++)
    {
        XX[2+i] = measure;
        XX[7+i] = measure;
    }

    var W = XX[7],
        H = YY[7];

    return {XX: XX, YY: YY, W: W, H: H};
}
COperatorDoubleLine.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._l(XX[8], YY[8]);
    MathControl.pGraph._l(XX[9], YY[9]);
}

function CStructArrow(type, loc, turn)
{
    // location
    // 0 - up
    // 1 - down

    this.type = type;
    this.loc = loc;
    this.turn = turn;

    CSubMathBase.call(this, 2, 1);
}
extend(CStructArrow, CSubMathBase);
CStructArrow.prototype.setContent = function()
{
    var operator;

    if(this.type == 0)
        operator = new CHalfArrow();
    else if(this.type == 1)
        operator = new CSingleArrow();
    else if(this.type == 2)
        operator = new CLeftRightArrow();
    else if(this.type == 3)
        operator = new CDoubleArrow();
    else if(this.type == 4)
        operator = new CLR_DoubleArrow();
    else if(this.type == 5)
        operator = new CCombiningArrow();

    operator.init(this.params);
    operator.setLocation(this.loc, this.turn);

    var params2 =  Common_CopyObj(this.params);
    params2.font = getTypeDegree(params2.font);

    var argument = new CMathContent();
    //var argument = new CDenominator();
    argument.init(params2);
    argument.relate(this);
    argument.fillPlaceholders();

    if(this.loc == 0)
    {
        CStructArrow.superclass.setContent.call(this, operator, argument);
    }
    else
    {
        CStructArrow.superclass.setContent.call(this, argument, operator);
    }
}
CStructArrow.prototype.getCenter = function()
{
    var center, sizeGlyph;

    if(this.loc == 0)
    {
        sizeGlyph = this.elements[0][0].getSizeGlyph();
        center = sizeGlyph.center;
    }
    else
    {
        sizeGlyph = this.elements[1][0].getSizeGlyph();
        center = this.elements[1][0].size.height + this.elements[0][0].size.height - sizeGlyph.center;
    }

    return center;
}
CStructArrow.prototype.recalculateSize = function()
{
    if(this.loc == 0)
    {
        var argSize = this.elements[1][0].size;
        this.elements[0][0].recalculateSize(argSize.width);
    }
    else
    {
        var argSize = this.elements[0][0].size;
        this.elements[1][0].recalculateSize(argSize.width);
    }

    CStructArrow.superclass.recalculateSize.call(this);
}
CStructArrow.prototype.getBase = function()
{
    var res;
    if(this.loc == 0)
        res = this.elements[1][0];
    else
        res = this.elements[0][0];

    return res;
}

function CSingleArrow()
{
    CGlyphOperator.call(this);
}
extend(CSingleArrow, CGlyphOperator);
CSingleArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;
    var height = 5.946923828125*betta;
    var width = 10.641210937499999*betta;

    return {width: width, height: height};
}
CSingleArrow.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 56138; Y[0] = 12300;
    X[1] = 8363; Y[1] = 12300;
    X[2] = 16313; Y[2] = 2212;
    X[3] = 13950; Y[3] = 0;
    X[4] = 0; Y[4] = 13650;
    X[5] = 0; Y[5] = 16238;
    X[6] = 13950; Y[6] = 29925;
    X[7] = 16313; Y[7] = 27712;
    X[8] = 8363; Y[8] = 17625;
    X[9] = 56138; Y[9] = 17625;
    X[10] = 56138; Y[10] = 12300;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var lng = measure - 10000*alpha;

    if(lng > XX[9])
    {
        XX[0]  = lng;
        XX[9]  = lng;
        XX[10] = lng;
    }

    var W = XX[9],
        H = YY[6];

    return {XX: XX, YY: YY, W: W, H: H};

}
CSingleArrow.prototype.drawPath = function(XX, YY)
{
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
}
CSingleArrow.prototype.getSizeGlyph = function()
{
    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var width = 62360*alpha;  // X[9]
    var height = 33242*alpha; // Y[6]
    var center = 14944*alpha; // (Y[5] + Y[4])/2

    return {width : width, height : height, center : center};
}

function CLeftRightArrow()
{
    CGlyphOperator.call(this);
}
extend(CLeftRightArrow, CGlyphOperator);
CLeftRightArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    var height = 5.946923828125*betta;
    var width = 11.695410156249999*betta;

    return {width: width, height: height};
}
CLeftRightArrow.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 16950; Y[0] = 28912;
    X[1] = 14738; Y[1] = 30975;
    X[2] = 0; Y[2] = 16687;
    X[3] = 0; Y[3] = 14287;
    X[4] = 14738; Y[4] = 0;
    X[5] = 16950; Y[5] = 2062;
    X[6] = 8363; Y[6] = 12975;
    X[7] = 53738; Y[7] = 12975;
    X[8] = 45150; Y[8] = 2062;
    X[9] = 47363; Y[9] = 0;
    X[10] = 62100; Y[10] = 14287;
    X[11] = 62100; Y[11] = 16687;
    X[12] = 47363; Y[12] = 30975;
    X[13] = 45150; Y[13] = 28912;
    X[14] = 53738; Y[14] = 17962;
    X[15] = 8363; Y[15] = 17962;
    X[16] = 16950; Y[16] = 28912;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var w = X[10]*alpha;

    var lng = measure - 10000*alpha - w;

    if(lng > 0)
        for(var i = 0; i < 8; i++)
            XX[7+i] += lng;


    var W = XX[10],
        H = YY[1];

    return {XX: XX, YY: YY, W: W, H: H};
}
CLeftRightArrow.prototype.drawPath = function(XX, YY)
{
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
    MathControl.pGraph._l(XX[12], YY[12]);
    MathControl.pGraph._l(XX[13], YY[13]);
    MathControl.pGraph._l(XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._l(XX[16], YY[16]);

}
CLeftRightArrow.prototype.getSizeGlyph = function()
{
    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var width = 62100*alpha;  // X[9]
    var height = 30975*alpha; // Y[6]
    var center = 15487*alpha; // (Y[11] + Y[10])/2

    return {width : width, height : height, center : center};
}

function CDoubleArrow()
{
    CGlyphOperator.call(this);
}
extend(CDoubleArrow, CGlyphOperator);
CDoubleArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    var height = 6.7027777777777775*betta;
    var width = 10.994677734375*betta;

    return {width: width, height: height};
}
CDoubleArrow.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 14738;  Y[0] = 29764;
    X[1] = 20775;  Y[1] = 37002;
    X[2] = 18338;  Y[2] = 39064;
    X[3] = 0;      Y[3] = 20731;
    X[4] = 0;      Y[4] = 18334;
    X[5] = 18338;  Y[5] = 0;
    X[6] = 20775;  Y[6] = 2063;
    X[7] = 14775;  Y[7] = 9225;
    X[8] = 57600;  Y[8] = 9225;
    X[9] = 57600;  Y[9] = 14213;
    X[10] = 10950; Y[10] = 14213;
    X[11] = 6638;  Y[11] = 19532;
    X[12] = 10875; Y[12] = 24777;
    X[13] = 57600; Y[13] = 24777;
    X[14] = 57600; Y[14] = 29764;
    X[15] = 14738; Y[15] = 29764;

    X[16] = 58950; Y[16] = 19495;
    X[17] = 58950; Y[17] = 19495;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var lng = measure - 10000*alpha;

    if(lng > XX[16])
    {
        XX[8] = lng;
        XX[9] = lng;

        XX[13] = lng;
        XX[14] = lng;

        XX[16] = lng;
        XX[17] = lng;
    }

    var W = XX[16],
        H = YY[2];

    return {XX: XX, YY: YY, W: W, H: H};
}
CDoubleArrow.prototype.drawPath = function(XX, YY)
{
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
    MathControl.pGraph._l(XX[12], YY[12]);
    MathControl.pGraph._l(XX[13], YY[13]);
    MathControl.pGraph._l(XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[16], YY[16]);
    MathControl.pGraph._l(XX[17], YY[17]);
}
CDoubleArrow.prototype.getSizeGlyph = function()
{
    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var width = 58950*alpha;
    var height = 39064*alpha;
    var center = 19532.5*alpha;

    return {width : width, height : height, center : center}
}

function CLR_DoubleArrow()
{
    CGlyphOperator.call(this);
}
extend(CLR_DoubleArrow, CGlyphOperator);
CLR_DoubleArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    var height = 6.7027777777777775*betta;
    var width = 13.146484375*betta;

    return {width: width, height: height};
}
CLR_DoubleArrow.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 14775; Y[0] = 9225;
    X[1] = 56063; Y[1] = 9225;
    X[2] = 50100; Y[2] = 2063;
    X[3] = 52538; Y[3] = 0;
    X[4] = 70875; Y[4] = 18334;
    X[5] = 70875; Y[5] = 20731;
    X[6] = 52538; Y[6] = 39064;
    X[7] = 50100; Y[7] = 37002;
    X[8] = 56138; Y[8] = 29764;
    X[9] = 14738; Y[9] = 29764;
    X[10] = 20775; Y[10] = 37002;
    X[11] = 18338; Y[11] = 39064;
    X[12] = 0; Y[12] = 20731;
    X[13] = 0; Y[13] = 18334;
    X[14] = 18338; Y[14] = 0;
    X[15] = 20775; Y[15] = 2063;
    X[16] = 14775; Y[16] = 9225;

    X[17] = 10950; Y[17] = 14213;
    X[18] = 6638;  Y[18] = 19532;
    X[19] = 10875; Y[19] = 24777;
    X[20] = 59963; Y[20] = 24777;
    X[21] = 64238; Y[21] = 19532;
    X[22] = 59925; Y[22] = 14213;
    X[23] = 59925; Y[23] = 14213;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var w = XX[4];
    var lng = measure - 10000*alpha - w;

    for(var i = 1; i < 9; i++)
        XX[i] += lng;

    for(var i = 0; i < 3; i++)
    {
        XX[20 + i] += lng;
    }

    var W = XX[4],
        H = YY[11];

    return {XX: XX, YY: YY, W: W, H: H};
}
CLR_DoubleArrow.prototype.drawPath = function(XX, YY)
{
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
    MathControl.pGraph._l(XX[12], YY[12]);
    MathControl.pGraph._l(XX[13], YY[13]);
    MathControl.pGraph._l(XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._l(XX[16], YY[16]);
    MathControl.pGraph.df();

    MathControl.pGraph.b_color1(255,255,255, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[17], YY[17]);
    MathControl.pGraph._l(XX[18], YY[18]);
    MathControl.pGraph._l(XX[19], YY[19]);
    MathControl.pGraph._l(XX[20], YY[20]);
    MathControl.pGraph._l(XX[21], YY[21]);
    MathControl.pGraph._l(XX[22], YY[22]);
    MathControl.pGraph._l(XX[23], YY[23]);
}
CLR_DoubleArrow.prototype.getSizeGlyph = function()
{
    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var width = 70875*alpha;
    var height = 39064*alpha;
    var center = 19532.5*alpha;

    return {width : width, height : height, center : center}
}

function CStructCombiningArrow(type, loc, turn)
{
    // location
    // 0 - up
    // 1 - down

    this.type = type;
    this.loc = loc;
    this.turn = turn;

    CSubMathBase.call(this, 2, 1);
}
extend(CStructCombiningArrow, CSubMathBase);
CStructCombiningArrow.prototype.setContent = function()
{
    var operator;

    if(this.type == 0)
        operator = new CCombiningHalfArrow();
    else if(this.type == 1)
        operator = new CCombiningArrow();
    else
        operator = new CCombiningDoubleArrow();

    operator.init(this.params);
    operator.setLocation(this.loc, this.turn);

    var argument = new CMathContent();
    argument.init(this.params);
    argument.relate(this);
    argument.fillPlaceholders();

    if(this.loc == 0)
        argument.SetDotIndef(true);

    if(this.loc == 0)
        CStructArrow.superclass.setContent.call(this, operator, argument);
    else
        CStructArrow.superclass.setContent.call(this, argument, operator);

}
CStructCombiningArrow.prototype.getCenter = function()
{
    var center;

    if(this.loc == 0)
    {
        center = this.elements[0][0].size.height + this.elements[1][0].size.center;
    }
    else
    {
        center = this.elements[1][0].size.height + this.elements[0][0].size.height;
    }

    return center;
}
CStructCombiningArrow.prototype.recalculateSize = function()
{
    if(this.loc == 0)
    {
        var argSize = this.elements[1][0].size;
        this.elements[0][0].recalculateSize(argSize.width);
    }
    else
    {
        var argSize = this.elements[0][0].size;
        this.elements[1][0].recalculateSize(argSize.width);
    }

    CStructArrow.superclass.recalculateSize.call(this);
}


function CCombiningArrow()
{
    CGlyphOperator.call(this);
}
extend(CCombiningArrow, CGlyphOperator);
CCombiningArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    var height = 3.88*betta;
    var width = 4.938*betta;

    return {width: width, height: height};
}
CCombiningArrow.prototype.calcCoord = function(measure)
{
    // px                       mm
    // XX[..]                   width
    // YY[..]                   height
    // penW

    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 8137;
    X[1] = 9413; Y[1] = 0;
    X[2] = 11400; Y[2] = 2250;
    X[3] = 5400; Y[3] = 7462;
    X[4] = 28275; Y[4] = 7462;
    X[5] = 28275; Y[5] = 10987;
    X[6] = 5400; Y[6] = 10987;
    X[7] = 11400; Y[7] = 16200;
    X[8] = 9413; Y[8] = 18450;
    X[9] = 0; Y[9] = 10312;
    X[10] = 0; Y[10] = 8137;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    XX[4] = XX[5] = measure;

    var W = XX[4],
        H = YY[8];

    return {XX: XX, YY: YY, W: W, H: H};
}
CCombiningArrow.prototype.drawPath = function(XX, YY)
{
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
}

function CCombiningHalfArrow()
{
    CGlyphOperator.call(this);
}
extend(CCombiningHalfArrow, CGlyphOperator);
CCombiningHalfArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    // 0x21BC half, down

    var height = 3.88*betta;
    var width = 4.938*betta;

    return {width: width, height: height};
}
CCombiningHalfArrow.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
}
CCombiningHalfArrow.prototype.calcCoord = function(measure)
{
    // px                       mm
    // XX[..]                   width
    // YY[..]                   height
    // penW

    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 8137;
    X[1] = 9413; Y[1] = 0;
    X[2] = 11400; Y[2] = 2250;
    X[3] = 5400; Y[3] = 7462;
    X[4] = 28275; Y[4] = 7462;
    X[5] = 28275; Y[5] = 10987;
    X[6] = 0; Y[6] = 10987;
    X[7] = 0; Y[7] = 8137;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    XX[4] = XX[5] = measure;

    var W = XX[4],
        H = YY[5];

    return {XX: XX, YY: YY, W: W, H: H};
}

function CCombiningDoubleArrow()
{
    CGlyphOperator.call(this);
}
extend(CCombiningDoubleArrow, CGlyphOperator);
CCombiningDoubleArrow.prototype.calcSize = function()
{
    var betta = this.params.font.FontSize/36;

    var height = 3.88*betta;
    var width = 4.938*betta;

    return {width: width, height: height};
}
CCombiningDoubleArrow.prototype.drawPath = function(XX, YY)
{
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
    MathControl.pGraph._l(XX[12], YY[12]);
    MathControl.pGraph._l(XX[13], YY[13]);
    MathControl.pGraph._l(XX[14], YY[14]);
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._l(XX[16], YY[16]);

}
CCombiningDoubleArrow.prototype.calcCoord = function(measure)
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 8137;
    X[1] = 9413; Y[1] = 0;
    X[2] = 11400; Y[2] = 2250;
    X[3] = 5400; Y[3] = 7462;
    X[4] = 42225; Y[4] = 7462;
    X[5] = 36225; Y[5] = 2250;
    X[6] = 38213; Y[6] = 0;
    X[7] = 47625; Y[7] = 8137;
    X[8] = 47625; Y[8] = 10312;
    X[9] = 38213; Y[9] = 18450;
    X[10] = 36225; Y[10] = 16200;
    X[11] = 42225; Y[11] = 10987;
    X[12] = 5400; Y[12] = 10987;
    X[13] = 11400; Y[13] = 16200;
    X[14] = 9413; Y[14] = 18450;
    X[15] = 0; Y[15] = 10312;
    X[16] = 0; Y[16] = 8137;

    var textScale = this.params.font.FontSize/1000; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент используется для того, чтобы перевести координаты в миллиметры

    var XX = new Array(),
        YY = new Array();

    for(var i = 0; i < X.length; i++)
    {
        XX[i] = X[i]*alpha;
        YY[i] = Y[i]*alpha;
    }

    var lng = measure - XX[7];

    for(var i = 0; i < 8; i++)
    {
        XX[4+i] += lng;
    }

    var W = XX[7],
        H = YY[9];

    return {XX: XX, YY: YY, W: W, H: H};

}


function CSeparatorDelimiter()
{
    CDelimiter.call(this);
}
extend(CSeparatorDelimiter, CDelimiter);
CSeparatorDelimiter.prototype.init = function(type, column)
{
    var base = new CSeparator();
    base.init(column);

    var params =
    {
        type: type,
        loc: 4,
        turn1: 0,
        turn2: 1
    };
    this.init_2(params, base);
}
CSeparatorDelimiter.prototype.mouseMove = function(mCoord)
{
    var elem = this.findDisposition( mCoord);
    var state = true,
        SelectContent = null;

    if(elem.pos.x == this.CurPos_X && elem.pos.y == this.CurPos_Y && elem.inside_flag === -1 )
    {
        movement = this.elements[this.CurPos_X][this.CurPos_Y].mouseMove(elem.mCoord);
        SelectContent = movement.SelectContent;
        state = movement.state;
    }
    else
    {
        state = false;
    }

    return {state: state, SelectContent: SelectContent};
}

function CSeparator()
{
    CMathBase.call(this);
}
extend(CSeparator, CMathBase);
CSeparator.prototype.init = function(column)
{
    this.setDimension(1, column);
    this.setContent();
}
CSeparator.prototype.setDistance = function()
{
    this.dW = this.Parent.getTxtPrp().FontSize/3*g_dKoef_pt_to_mm;
}
CSeparator.prototype.draw = function()
{
    var x = this.pos.x,
        y = this.pos.y;

    var w = this.elements[0][0].size.width + this.dW/2;

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);
    MathControl.pGraph.p_width(1000);
    MathControl.pGraph.b_color1(0,0,0, 255);

    pW = this.Parent.getTxtPrp().FontSize/18*g_dKoef_pt_to_mm;

    for(var i = 0; i < this.nCol - 1; i++)
    {
        var x1 = x + w - pW/2, y1 = y,
            x2 = x + pW/2 + w, y2 = y,
            x3 = x2, y3 = y + this.size.height,
            x4 = x1, y4 = y3;

        MathControl.pGraph._s();

        MathControl.pGraph._m(x1, y1);
        MathControl.pGraph._l(x2, y2);
        MathControl.pGraph._l(x3, y3);
        MathControl.pGraph._l(x4, y4);
        MathControl.pGraph._l(x1, y1);

        MathControl.pGraph.df();

        w += this.elements[0][i+1].size.width + this.dW;
    }

    MathControl.pGraph.SetIntegerGrid(intGrid);

    CSeparator.superclass.draw.call(this);
}

