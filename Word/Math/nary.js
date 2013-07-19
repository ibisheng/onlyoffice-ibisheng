//величина символа "сигма" не меняется в зависимости от аргумента
//если не выставлено в настройках
/////////////////////****//////////////////////////
//  IterType:
//  0 - без итераторов
//  1 - итератор сверху
//  2 - итератор снизу
//  3 - оба итератора

//  OrderType
//  0 - итраторы по прямой линии
//  1 - итераторы расположены также, как у степени



function CNary()
{
    CSubMathBase.call(this);
}
extend(CNary, CSubMathBase);
CNary.prototype.init = function(index, orderType, iterType)
{
    this.setDimension(1, 2);

    var arg = new CMathContent(),
        base;
    var sign = null;

    if(index == 0)
        sign = new CIntegral();
    else if(index == 1)
        sign = new CDoubleIntegral();
    else if(index == 2)
        sign = new CTripleIntegral();
    else if(index == 3)
        sign = new CContourIntegral();
    else if(index == 4)
        sign = new CSurfaceIntegral();
    else if(index == 5)
        sign = new CVolumeIntegral();
    else if(index == 6)
        sign = new CSigma();
    else if(index == 7)
        sign = new CProduct();
    else if(index == 8)
        sign = new CProduct(-1);
    else if(index == 9)
        sign = new CUnion();
    else if(index == 10)
        sign = new CUnion(-1);
    else if(index == 11)
        sign = new CLogicalOr(1);
    else if(index == 12)
        sign = new CLogicalOr(-1);

    if(orderType == 0)
    {
        if(iterType == 0)
            base = sign;
        else if(iterType == 1)
        {
            base = new CNaryUnd();
            base.init(sign);
        }
        else if(iterType == 2)
        {
            base = new CNaryOvr();
            base.init(sign);
        }
        else if(iterType == 3)
        {
            base = new CNaryUndOvr();
            base.init(sign);
        }
    }
    else if(orderType == 1)
    {
        if(iterType == 1)
        {
            base = new CDegreeOrdinary();
            base.init_2(sign);
            base.setIndex(1);
        }
        else if(iterType == 2)
        {
            base = new CDegreeOrdinary();
            base.init_2(sign);
            base.setIndex(-1);
        }
        else if(iterType == 3)
        {
            base = new CDegreeSubSup(0);
            base.init_2(sign);
        }
    }

    this.addMCToContent(base, arg);
}
CNary.prototype.setDistance = function()
{
    this.dW = this.Parent.getTxtPrp().FontSize/36*2.45;
}
CNary.prototype.getBase = function()
{
    return this.elements[0][1];
}
CNary.prototype.getUpperIterator = function()
{
    return this.elements[0][0].getUpperIterator();
}
CNary.prototype.getLowerIterator = function()
{
    return this.elements[0][0].getLowerIterator();
}

function CNaryUnd()
{
    CMathBase.call(this);
}
extend(CNaryUnd, CMathBase);
CNaryUnd.prototype.init = function(sign)
{
    this.setDimension(2,1);

    var iter = new CMathContent();
    iter.setReduct(DEGR_REDUCT);

    this.addMCToContent(iter, sign);
}
CNaryUnd.prototype.setDistance = function()
{
    var zetta = this.Parent.getTxtPrp().FontSize* 25.4/96;
    this.dH = zetta*0.25;
}
CNaryUnd.prototype.getCenter = function()
{
    return this.elements[0][0].size.height + this.dH + this.elements[1][0].size.center ;
}
CNaryUnd.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
}


function CNaryOvr()
{
    CMathBase.call(this);
}
extend(CNaryOvr, CMathBase);
CNaryOvr.prototype.init = function(sign)
{
    this.setDimension(2,1);

    var iter = new CMathContent();
    iter.setReduct(DEGR_REDUCT);

    this.addMCToContent(sign, iter);
}
CNaryOvr.prototype.setDistance = function()
{
    var zetta = this.Parent.getTxtPrp().FontSize* 25.4/96;
    this.dH = zetta*0.1;
}
CNaryOvr.prototype.getCenter = function()
{
    return this.elements[0][0].size.center;
}
CNaryOvr.prototype.getLowerIterator= function()
{
    return this.elements[1][0];
}

function CNaryUndOvr()
{
    this.gapTop = 0;
    this.gapBottom = 0;
    CMathBase.call(this);
}
extend(CNaryUndOvr, CMathBase);
CNaryUndOvr.prototype.init = function(sign)
{
    this.setDimension(3,1);

    var iter1 = new CMathContent();
    iter1.setReduct(DEGR_REDUCT);

    var iter2 = new CMathContent();
    iter2.setReduct(DEGR_REDUCT);

    this.addMCToContent(iter1, sign, iter2);
}
CNaryUndOvr.prototype.recalculateSize = function()
{
    var zetta = this.Parent.getTxtPrp().FontSize* 25.4/96;
    this.gapTop = zetta*0.25;
    this.gapBottom = zetta*0.1;

    var center = this.elements[0][0].size.height + this.gapTop + this.elements[1][0].size.center;

    var width = 0, height = 0;
    for(var i = 0; i < 3; i++)
    {
        width = width > this.elements[i][0].size.width ? width : this.elements[i][0].size.width;
        height += this.elements[i][0].size.height;
    }

    height += this.gapTop + this.gapBottom;

    this.size = {width: width, height: height, center: center};
}
CNaryUndOvr.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y : pos.y - this.size.center};
    var x1 = pos.x + this.align(0, 0).x,
        y1 = pos.y,
        x2 = pos.x + this.align(1,0).x,
        y2 = y1 + this.elements[0][0].size.height + this.gapTop,
        x3 = pos.x + this.align(2,0).x,
        y3 = y2 + this.elements[1][0].size.height + this.gapBottom;

    this.elements[0][0].setPosition({x: x1, y :y1 });
    this.elements[1][0].setPosition({x: x2, y :y2 });
    this.elements[2][0].setPosition({x: x3, y :y3 });
}
CNaryUndOvr.prototype.findDisposition = function(mCoord)
{
    var X = null, Y = null;
    var iter, pos_x, pos_y = 0;
    var inside_flag = -1;

    if(mCoord.y < this.size.height/2)
    {
        iter = this.elements[0][0].size;
        if( mCoord.y > iter.height )
        {
            Y = iter.height;
            inside_flag = 2;
        }
        else
            Y = mCoord.y;

        pos_x = 0;
    }
    else
    {
        iter = this.elements[2][0].size;
        if( mCoord.y < iter.height )
        {
            Y = 0;
            inside_flag = 2;
        }
        else
            Y = mCoord.y - (this.size.height - iter.height);

        pos_x = 2;
    }

    var align = this.align(pos_x, 0);
    if(mCoord.x < align.x )
    {
        X = 0;
        inside_flag = 0;
    }
    else if(mCoord.x > align.x + iter.width)
    {
        X = iter.width;
        inside_flag = 1;
    }
    else
        X = mCoord.x - align.x;

    return {pos: {x: pos_x, y: pos_y}, mCoord: {x: X, y: Y}, inside_flag: inside_flag};
}
CNaryUndOvr.prototype.getLowerIterator = function()
{
    return this.elements[2][0];
}
CNaryUndOvr.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
}



function CNaryOperator(flip)
{
    this.bFlip = (flip == -1);

    this.sizeGlyph = null;
}
CNaryOperator.prototype.draw = function()
{
    var coord = this.getCoord();

    var X = coord.X,
        Y = coord.Y;

    var XX = new Array(),
        YY = new Array();

    var textScale = this.Parent.getTxtPrp().FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // g_dKoef_px_to_mm = 25.4/96

    var a, b;
    if(this.bFlip)
    {
        a = -1;
        b = this.sizeGlyph.height;
    }
    else
    {
        a = 1;
        b = 0;
    }

    for(var i = 0 ; i < X.length; i++)
    {
        XX[i] = this.pos.x + X[i]*alpha;
        YY[i] = this.pos.y + (a*Y[i]*alpha + b);
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(1000);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();

    this.drawPath(XX,YY);

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CNaryOperator.prototype.IsJustDraw = function()
{
    return true;
}
CNaryOperator.prototype.relate = function(parent)
{
    this.Parent = parent;
}
CNaryOperator.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x , y: pos.y};
}
CNaryOperator.prototype.recalculateSize = function()
{
    this.sizeGlyph = this.calculateSizeGlyph();

    var height = this.sizeGlyph.height,
        width =  this.sizeGlyph.width,
        center = this.sizeGlyph.height/2;

    this.size = {height: height, width: width, center: center};
}
CNaryOperator.prototype.Resize = function()
{
    this.recalculateSize();
}

function CSigma()
{
    CNaryOperator.call(this);
}
extend(CSigma, CNaryOperator);
CSigma.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._l(XX[2], YY[2]);
    MathControl.pGraph._l(XX[3], YY[3]);
    MathControl.pGraph._l(XX[4], YY[4]);
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] );
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] );
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] );
    MathControl.pGraph._l(XX[15], YY[15]);
    MathControl.pGraph._l(XX[16], YY[16]);
    MathControl.pGraph._l(XX[17], YY[17]);
    MathControl.pGraph._l(XX[18], YY[18]);
    MathControl.pGraph._l(XX[19], YY[19]);
    MathControl.pGraph._l(XX[20], YY[20]);
    MathControl.pGraph._l(XX[21], YY[21]);
    MathControl.pGraph._l(XX[22], YY[22]);
    MathControl.pGraph._l(XX[23], YY[23]);
    MathControl.pGraph._l(XX[24], YY[24]);
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] );
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] );
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34] );
    MathControl.pGraph._l(XX[35], YY[35]);

}
CSigma.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    /*X[0] = 13560; Y[0] = 4332;
     X[1] = 33847; Y[1] = 35130;
     X[2] = 33847; Y[2] = 38297;
     X[3] = 11103; Y[3] = 69548;
     X[4] = 38512; Y[4] = 69548;
     X[5] = 41095; Y[5] = 69548;
     X[6] = 42407; Y[6] = 69215;
     X[7] = 43719; Y[7] = 68882;
     X[8] = 44656; Y[8] = 68194;
     X[9] = 45594; Y[9] = 67507;
     X[10] = 46364; Y[10] = 66278;
     X[11] = 47135; Y[11] = 65049;
     X[12] = 47843; Y[12] = 62883;
     X[13] = 48552; Y[13] = 60717;
     X[14] = 49176; Y[14] = 57218;
     X[15] = 54028; Y[15] = 57218;
     X[16] = 52820; Y[16] = 77546;
     X[17] = 0; Y[17] = 77546;
     X[18] = 0; Y[18] = 75213;
     X[19] = 25766; Y[19] = 39839;
     X[20] = 1605; Y[20] = 2374;
     X[21] = 1605; Y[21] = 0;
     X[22] = 53050; Y[22] = 0;
     X[23] = 53050; Y[23] = 18543;
     X[24] = 48551; Y[24] = 18543;
     X[25] = 47509; Y[25] = 14584;
     X[26] = 46572; Y[26] = 12084;
     X[27] = 45635; Y[27] = 9583;
     X[28] = 44656; Y[28] = 8125;
     X[29] = 43677; Y[29] = 6666;
     X[30] = 42656; Y[30] = 5895;
     X[31] = 41636; Y[31] = 5124;
     X[32] = 40303; Y[32] = 4728;
     X[33] = 38970; Y[33] = 4332;
     X[34] = 36762; Y[34] = 4332;
     X[35] = 13560; Y[35] = 4332;*/

    X[0] = 16252; Y[0] = 5200;
    X[1] = 40602; Y[1] = 42154;
    X[2] = 40602; Y[2] = 45954;
    X[3] = 13302; Y[3] = 83456;
    X[4] = 46202; Y[4] = 83456;
    X[5] = 49302; Y[5] = 83456;
    X[6] = 50877; Y[6] = 83056;
    X[7] = 52452; Y[7] = 82656;
    X[8] = 53577; Y[8] = 81831;
    X[9] = 54702; Y[9] = 81006;
    X[10] = 55627; Y[10] = 79531;
    X[11] = 56552; Y[11] = 78056;
    X[12] = 57402; Y[12] = 75456;
    X[13] = 58252; Y[13] = 72856;
    X[14] = 59002; Y[14] = 68656;
    X[15] = 64850; Y[15] = 68656;
    X[16] = 63400; Y[16] = 93056;
    X[17] = 0; Y[17] = 93056;
    X[18] = 0; Y[18] = 90256;
    X[19] = 30902; Y[19] = 47804;
    X[20] = 1902; Y[20] = 2850;
    X[21] = 1902; Y[21] = 0;
    X[22] = 63652; Y[22] = 0;
    X[23] = 63652; Y[23] = 22252;
    X[24] = 58252; Y[24] = 22252;
    X[25] = 57002; Y[25] = 17501;
    X[26] = 55877; Y[26] = 14501;
    X[27] = 54752; Y[27] = 11501;
    X[28] = 53577; Y[28] = 9751;
    X[29] = 52402; Y[29] = 8000;
    X[30] = 51177; Y[30] = 7075;
    X[31] = 49952; Y[31] = 6150;
    X[32] = 48352; Y[32] = 5675;
    X[33] = 46752; Y[33] = 5200;
    X[34] = 44102; Y[34] = 5200;
    X[35] = 16252; Y[35] = 5200;


    var textScale =  this.Parent.getTxtPrp().FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64;

    var h1 = Y[0] - Y[21],
        h2 = Y[17] - Y[3],
        h3 = Y[2] - Y[1],
        h4 = Y[20] - Y[21],
        h5 = Y[17] - Y[18];

    var H1 = this.sizeGlyph.height/alpha - h1 - h2 - h3;
    //H2 = this.size.height/alpha - h4 - h5;

    var h_middle1 = Y[3] - Y[0] - h3,
        coeff1 = (Y[1] - Y[0])/h_middle1,
        coeff2 = (Y[3] - Y[2])/h_middle1;


    var y3 = Y[3],
        y2 = Y[2];

    Y[1] = Y[0] + H1*coeff1;
    Y[2] = Y[1] + h3;
    Y[3] = Y[2] + H1*coeff2;

    Y[19] = Y[2] + Y[19] - y2;
    Y[18] = Y[3] + Y[18] - y3;

    for(var i = 4; i < 18; i++)
    {
        Y[i] = Y[3] + (Y[i] - y3);
    }

    // Width  -  X[15]

    var W = (this.sizeGlyph.width - this.gap)/alpha;

    var c1 = (X[21] - X[17])/X[15],
        c2 = (X[22] - X[21])/X[15];

    var x22 = X[22];

    X[21] = X[20] = X[17] + c1*W;
    X[22] = X[23] = X[21] + c2*W;

    for(var i = 24; i < 35; i++)
        X[i] = X[22] + X[i] - x22;

    var c3 = (X[4] - X[3])/X[15],
        c4 = (X[15] - X[16])/X[15],
        c5 = (X[15] - X[2])/X[15];

    var x15 = X[15],
        x2 = X[2];

    X[4] = X[3] + c3*W;
    X[15] = W;
    X[16] = X[15] - c4*W;

    X[2] = X[1] = X[15] - c5*W;

    X[19] = X[2] - (x2 - X[19]);

    for(var i = 5; i < 15 ; i++)
        X[i] = X[15] - (x15 - X[i]);

    return {X: X, Y: Y};
}
CSigma.prototype.calculateSizeGlyph = function()
{
    // пока размер не меняем в зависимости от высоты аргумента

    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width = 8.997900390624999*betta,
        _height = 11.994444444444444*betta;

    this.gap = 0.93*betta;

    var width = 1.76*_width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function CProduct(bFlip)
{
    CNaryOperator.call(this, bFlip);
}
extend(CProduct, CNaryOperator);
CProduct.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] );
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] );
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] );
    MathControl.pGraph._l(XX[19], YY[19]);
    MathControl.pGraph._l(XX[20], YY[20]);
    MathControl.pGraph._l(XX[21], YY[21]);
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27] );
    MathControl.pGraph._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29] );
    MathControl.pGraph._l(XX[30], YY[30]);
    MathControl.pGraph._l(XX[31], YY[31]);
    MathControl.pGraph._l(XX[32], YY[32]);
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34] );
    MathControl.pGraph._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36] );
    MathControl.pGraph._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38] );
    MathControl.pGraph._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40] );
    MathControl.pGraph._l(XX[41], YY[41]);
    MathControl.pGraph._l(XX[42], YY[42]);
    MathControl.pGraph._l(XX[43], YY[43]);
    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._l(XX[52], YY[52]);
    MathControl.pGraph._c(XX[52], YY[52], XX[53], YY[53], XX[54], YY[54] );
    MathControl.pGraph._c(XX[54], YY[54], XX[55], YY[55], XX[56], YY[56] );
    MathControl.pGraph._c(XX[56], YY[56], XX[57], YY[57], XX[58], YY[58] );
    MathControl.pGraph._c(XX[58], YY[58], XX[59], YY[59], XX[60], YY[60] );
    MathControl.pGraph._l(XX[61], YY[61]);
    MathControl.pGraph._l(XX[62], YY[62]);

}
CProduct.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 67894; Y[0] = 0;
    X[1] = 67894; Y[1] = 2245;
    X[2] = 65100; Y[2] = 3024;
    X[3] = 63955; Y[3] = 3666;
    X[4] = 62810; Y[4] = 4307;
    X[5] = 62100; Y[5] = 5338;
    X[6] = 61390; Y[6] = 6368;
    X[7] = 61092; Y[7] = 8338;
    X[8] = 60794; Y[8] = 10308;
    X[9] = 60794; Y[9] = 14706;
    X[10] = 60794; Y[10] = 70551;
    X[11] = 60794; Y[11] = 74674;
    X[12] = 61069; Y[12] = 76666;
    X[13] = 61345; Y[13] = 78659;
    X[14] = 61987; Y[14] = 79736;
    X[15] = 62629; Y[15] = 80813;
    X[16] = 63798; Y[16] = 81523;
    X[17] = 64968; Y[17] = 82233;
    X[18] = 67904; Y[18] = 83012;
    X[19] = 67904; Y[19] = 85257;
    X[20] = 43623; Y[20] = 85257;
    X[21] = 43623; Y[21] = 83012;
    X[22] = 46368; Y[22] = 82279;
    X[23] = 47512; Y[23] = 81614;
    X[24] = 48657; Y[24] = 80950;
    X[25] = 49343; Y[25] = 79896;
    X[26] = 50029; Y[26] = 78843;
    X[27] = 50326; Y[27] = 76850;
    X[28] = 50624; Y[28] = 74857;
    X[29] = 50624; Y[29] = 70551;
    X[30] = 50624; Y[30] = 4856;
    X[31] = 17165; Y[31] = 4856;
    X[32] = 17165; Y[32] = 70551;
    X[33] = 17165; Y[33] = 74994;
    X[34] = 17463; Y[34] = 76918;
    X[35] = 17761; Y[35] = 78843;
    X[36] = 18450; Y[36] = 79873;
    X[37] = 19139; Y[37] = 80904;
    X[38] = 20332; Y[38] = 81591;
    X[39] = 21526; Y[39] = 82279;
    X[40] = 24326; Y[40] = 83012;
    X[41] = 24326; Y[41] = 85257;
    X[42] = 0; Y[42] = 85257;
    X[43] = 0; Y[43] = 83012;
    X[44] = 2743; Y[44] = 82279;
    X[45] = 3931; Y[45] = 81614;
    X[46] = 5120; Y[46] = 80950;
    X[47] = 5783; Y[47] = 79873;
    X[48] = 6446; Y[48] = 78797;
    X[49] = 6743; Y[49] = 76827;
    X[50] = 7040; Y[50] = 74857;
    X[51] = 7040; Y[51] = 70551;
    X[52] = 7040; Y[52] = 14706;
    X[53] = 7040; Y[53] = 10400;
    X[54] = 6743; Y[54] = 8430;
    X[55] = 6446; Y[55] = 6460;
    X[56] = 5806; Y[56] = 5429;
    X[57] = 5166; Y[57] = 4398;
    X[58] = 4000; Y[58] = 3711;
    X[59] = 2834; Y[59] = 3024;
    X[60] = 0; Y[60] = 2245;
    X[61] = 0; Y[61] = 0;
    X[62] = 67894; Y[62] = 0;


    var textScale = this.Parent.getTxtPrp().FontSize/850, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var h1 = Y[9],
        h2 = Y[19] - Y[10],
        w1 = X[31];

    var Height = this.sizeGlyph.height/alpha - h1 - h2,
        Width = (this.sizeGlyph.width - this.gap)/alpha - 2*w1;

    var hh = Height - (Y[10] - Y[9]),
        ww = Width - (X[30] - X[31]);

    for(var i = 0; i < 20; i++)
    {
        Y[10 + i] += hh;
        Y[32 + i] += hh;
    }

    for(var i = 0; i < 31; i++)
        X[i] += ww;

    X[62] += ww;


    return {X: X, Y: Y};

}
CProduct.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width = 10.312548828125*betta,
        _height = 11.994444444444444*betta;

    this.gap = 0.93*betta;

    var width = 1.76*_width + this.gap,
        height = 2*_height;

    //this.size = {width : width, height : height, center: height/2 };

    return {width : width, height : height};
}

function CUnion(bFlip)
{
    CNaryOperator.call(this, bFlip);
}
extend(CUnion, CNaryOperator);
CUnion.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    MathControl.pGraph._l(XX[5], YY[5]);
    MathControl.pGraph._l(XX[6], YY[6]);
    MathControl.pGraph._l(XX[7], YY[7]);
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9]);
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11]);
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13]);
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15]);
    MathControl.pGraph._l(XX[16], YY[16]);
    MathControl.pGraph._l(XX[17], YY[17]);
    MathControl.pGraph._l(XX[18], YY[18]);
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]);
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
}
CUnion.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 49526.184566929136; Y[0] = 127087.84; 
    X[1] = 33974.37429971653; Y[1] = 127877.20000000001; 
    X[2] = 25226.481024409448; Y[2] = 120034.20000000001; 
    X[3] = 15996.016171708661; Y[3] = 113190.09; 
    X[4] = 15301.25; Y[4] = 95025.84; 
    X[5] = 15301.25; Y[5] = 0; 
    X[6] = 7100; Y[6] = 0; 
    X[7] = 7100; Y[7] = 94775.84; 
    X[8] = 7100; Y[8] = 117815.09; 
    X[9] = 21524.90275275591; Y[9] = 127165.84; 
    X[10] = 31605.36420585827; Y[10] = 135801.88; 
    X[11] = 49526.184566929136; Y[11] = 135775.84; 
    X[12] = 67447.00492800001; Y[12] = 135801.88; 
    X[13] = 77527.46638110236; Y[13] = 127165.84; 
    X[14] = 91952.36913385827; Y[14] = 117815.09; 
    X[15] = 91952.36913385827; Y[15] = 94775.84; 
    X[16] = 91952.36913385827; Y[16] = 0; 
    X[17] = 83751.11913385827; Y[17] = 0; 
    X[18] = 83751.11913385827; Y[18] = 95025.84; 
    X[19] = 83056.35296214961; Y[19] = 113190.09; 
    X[20] = 73825.88810944883; Y[20] = 120034.20000000001; 
    X[21] = 65077.99483414174; Y[21] = 127877.20000000001; 
    X[22] = 49526.184566929136; Y[22] = 127087.84;

    return {X: X, Y: Y};
}
CUnion.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;
    this.gap = 0.93*betta;

    var _width = 9.38*betta,
        _height = 11.994444444444444*betta;

    var width = 1.76*_width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function CLogicalOr(bFlip)
{
    CNaryOperator.call(this, bFlip);
}
extend(CLogicalOr, CNaryOperator);
CLogicalOr.prototype.drawPath = function(XX, YY)
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
CLogicalOr.prototype.old_getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 73240; Y[0] = 0;
    X[1] = 38428; Y[1] = 89801;
    X[2] = 29448; Y[2] = 89801;
    X[3] = 0; Y[3] = 0;
    X[4] = 10613; Y[4] = 0;
    X[5] = 34521; Y[5] = 77322;
    X[6] = 63269; Y[6] = 0;
    X[7] = 73240; Y[7] = 0;

    var textScale = this.params.font.FontSize/850, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var w1 = X[2],
        w2 = X[1] - X[2],
        w3 = X[0] - X[1],
        w4 = X[2] - X[5],
        w5 = X[7] - X[6];

    var Height = this.sizeGlyph.height/alpha,
        Width = (this.sizeGlyph.width - this.gap)/alpha - w2;

    var _W = X[7] - w2,
        k1 = w1/_W;

    X[2] = k1*Width;
    X[1] = X[2] + w2;
    X[5] = X[2] + w4;

    X[7] = X[0] = Width + w2;
    X[6] = Width + w2 - w5;

    var hh = Height - Y[2];

    Y[1] += hh;
    Y[2] += hh;
    Y[5] += hh;


    /* var w1 = X[7] - X[6],
        w2 = X[1] - X[2],
        w3 = X[4],
        w4 = X[1];

    var textScale = this.params.font.FontSize/850, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var Height = this.size.height/alpha,
        Width = (this.size.width - this.gap)/alpha - w2;

    var k1 = X[2]/(X[0] - w2);

    var ww1 = Width*k1 - X[2],
        ww2 = Width*(1- k1) - w1,
        hh = Height - Y[2];

    X[1] += ww1;
    X[2] += ww1;
    X[5] += ww1;

    X[6] += ww2 + X[1] - w4;
    X[7] += ww2 + X[1] - w4;
    X[0] += ww2 + X[1] - w4;


    Y[1] += hh;
    Y[2] += hh;
    Y[5] += hh;*/

    return {X: X, Y: Y};
}
CLogicalOr.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 0; Y[0] = 0;
    X[1] = 34812; Y[1] = 89801;
    X[2] = 43792; Y[2] = 89801;
    X[3] = 73240; Y[3] = 0;
    X[4] = 63269; Y[4] = 0;
    X[5] = 38719; Y[5] = 77322;
    X[6] = 10613; Y[6] = 0;
    X[7] = 0; Y[7] = 0;

    var textScale = this.Parent.getTxtPrp().FontSize/850, // 1000 pt
        alpha = textScale*25.4/96 /64;

    var w1 = X[1],
        w2 = X[2] - X[1],
        w4 = X[5] - X[1],
        w5 = X[3] - X[4];

    var Height = this.sizeGlyph.height/alpha,
        Width = (this.sizeGlyph.width - this.gap)/alpha - w2;

    var _W = X[3] - w2,
        k1 = w1/_W;

    X[1] = k1*Width;
    X[2] = X[1] + w2;
    X[5] = X[1] + w4;

    X[3] = Width + w2;
    X[4] = Width + w2 - w5;

    var hh = Height - Y[2];

    Y[1] += hh;
    Y[2] += hh;
    Y[5] += hh;

    return {X: X, Y: Y};
}
CLogicalOr.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width = 9.6159*betta,
        _height = 11.994444444444444*betta;

    this.gap = 0.55*betta;

    var width = 1.76*_width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function CIntegral()
{
    CNaryOperator.call(this);
}
extend(CIntegral, CNaryOperator);
CIntegral.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    //top
    X[0] = 20407; Y[0] = 65723;
    X[1] = 20407; Y[1] = 60840;
    X[2] = 20407; Y[2] = 37013;
    X[3] = 24333; Y[3] = 18507;
    X[4] = 28260; Y[4] = 0;
    X[5] = 40590; Y[5] = 0;
    X[6] = 42142; Y[6] = 0;
    X[7] = 43604; Y[7] = 383;
    X[8] = 45067; Y[8] = 765;
    X[9] = 46215; Y[9] = 1305;
    X[10] = 45180; Y[10] = 9225;
    X[11] = 41760; Y[11] = 9225;
    X[12] = 41512; Y[12] = 7335;
    X[13] = 40724; Y[13] = 6064;
    X[14] = 39937; Y[14] = 4793;
    X[15] = 37935; Y[15] = 4793;
    X[16] = 30465; Y[16] = 4793;
    X[17] = 28406; Y[17] = 23086;
    X[18] = 26347; Y[18] = 41378;
    X[19] = 26347; Y[19] = 60840;
    X[20] = 26347; Y[20] = 65723;

    //botton
    X[22] = 26347; Y[22] = 0;
    X[23] = 26347; Y[23] = 4883;
    X[24] = 26325; Y[24] = 33368;
    X[25] = 21622; Y[25] = 49681;
    X[26] = 16920; Y[26] = 65993;
    X[27] = 5467; Y[27] = 65993;
    X[28] = 4387; Y[28] = 65993;
    X[29] = 2947; Y[29] = 65633;
    X[30] = 1507; Y[30] = 65273;
    X[31] = 0; Y[31] = 64553;
    X[32] = 1147; Y[32] = 55665;
    X[33] = 4770; Y[33] = 55665;
    X[34] = 4927; Y[34] = 58050;
    X[35] = 5782; Y[35] = 59412;
    X[36] = 6637; Y[36] = 60773;
    X[37] = 8775; Y[37] = 60773;
    X[38] = 13365; Y[38] = 60773;
    X[39] = 16886; Y[39] = 50783;
    X[40] = 20407; Y[40] = 40793;
    X[41] = 20407; Y[41] = 4883;
    X[42] = 20407; Y[42] = 0;


    var shX = X[9]*0.025;
    for(var i = 0; i < 21; i++)
    {
        X[i] +=shX;
    }

    var shY = Y[26]*0.3377;
    for(var i = 0; i < 21; i++)
    {
        Y[22+i] += shY + Y[20];
    }


    X[21] = (X[20] + X[22])/2; Y[21] = (Y[20] + Y[22])/2;
    X[44] = X[0]; Y[44] = Y[0];
    X[43] = (X[42] + X[44])/2; Y[43] = (Y[44] + Y[42])/2;

    /*for(var i = 0; i < X.length; i++)
    {
        var k = i + 34;
        var str = "X[" + k + "] = " + X[i] + "; Y[" + k + "] = " + Y[i] + ";";
        console.log(str);
    }*/

    var W = X[9],
        H = Y[27];

    return {X: X, Y: Y, W : W, H: H};
}
CIntegral.prototype.old_getCoord = function()
{
    var X = new Array(),
        Y = new Array();

     X[0] = 20407; Y[0] = 65723;
     X[1] = 20407; Y[1] = 60840;
     X[2] = 20407; Y[2] = 37013;
     X[3] = 24333; Y[3] = 18507;
     X[4] = 28260; Y[4] = 0;
     X[5] = 40590; Y[5] = 0;
     X[6] = 42142; Y[6] = 0;
     X[7] = 43604; Y[7] = 383;
     X[8] = 45067; Y[8] = 765;
     X[9] = 46215; Y[9] = 1305;
     X[10] = 45180; Y[10] = 9225;
     X[11] = 41760; Y[11] = 9225;
     X[12] = 41512; Y[12] = 7335;
     X[13] = 40724; Y[13] = 6064;
     X[14] = 39937; Y[14] = 4793;
     X[15] = 37935; Y[15] = 4793;
     X[16] = 30465; Y[16] = 4793;
     X[17] = 28406; Y[17] = 23086;
     X[18] = 26347; Y[18] = 41378;
     X[19] = 26347; Y[19] = 60840;
     X[20] = 26347; Y[20] = 65723;

     X[21] = 26325; Y[21] = 65723;

     X[22] = 26325; Y[22] = 99091;
     X[23] = 21622; Y[23] = 115404;
     X[24] = 16920; Y[24] = 131716;
     X[25] = 5467; Y[25] = 131716;
     X[26] = 4387; Y[26] = 131716;
     X[27] = 2947; Y[27] = 131356;
     X[28] = 1507; Y[28] = 130996;
     X[29] = 0; Y[29] = 130276;
     X[30] = 1147; Y[30] = 121388;
     X[31] = 4770; Y[31] = 121388;
     X[32] = 4927; Y[32] = 123773;
     X[33] = 5782; Y[33] = 125135;
     X[34] = 6637; Y[34] = 126496;
     X[35] = 8775; Y[35] = 126496;
     X[36] = 13365; Y[36] = 126496;
     X[37] = 16886; Y[37] = 116506;
     X[38] = 20407; Y[38] = 106516;
     X[39] = 20407; Y[39] = 70606;
     X[40] = 20407; Y[40] = 65723;

    var shX = X[9]*0.025;
    for(var i = 0; i < 21; i++)
    {
        X[i] +=shX;
    }

    var shY = Y[24]*0.1692;
    for(var i = 0; i < 21; i++)
    {
        Y[21+i] += shY;
    }

    return {X: X, Y: Y};
}
CIntegral.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._l(XX[11], YY[11]);
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._l(XX[20], YY[20]);

    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] );

    MathControl.pGraph._l(XX[22], YY[22]);
    MathControl.pGraph._l(XX[23], YY[23]);
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27] );
    MathControl.pGraph._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29] );
    MathControl.pGraph._c(XX[29], YY[29], XX[30], YY[30], XX[31], YY[31] );
    MathControl.pGraph._l(XX[32], YY[32]);
    MathControl.pGraph._l(XX[33], YY[33]);
    MathControl.pGraph._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35] );
    MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );
    MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
    MathControl.pGraph._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41] );
    MathControl.pGraph._l(XX[42], YY[42]);

    MathControl.pGraph._c(XX[42], YY[42], XX[43], YY[43], XX[44], YY[44] );

}
CIntegral.prototype.old_drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._l(XX[11], YY[11]);
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._l(XX[20], YY[20]);
    MathControl.pGraph._l(XX[21], YY[21]);

    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );
    MathControl.pGraph._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27] );
    MathControl.pGraph._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29] );
    MathControl.pGraph._l(XX[30], YY[30]);
    MathControl.pGraph._l(XX[31], YY[31]);
    MathControl.pGraph._c(XX[31], YY[31], XX[32], YY[32], XX[33], YY[33] );
    MathControl.pGraph._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35] );
    MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );
    MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
    MathControl.pGraph._l(XX[40], YY[40]);

}
CIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width =  8.624*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function CDoubleIntegral()
{
    CIntegral.call(this);
}
extend(CDoubleIntegral, CIntegral);
CDoubleIntegral.prototype.drawPath = function(XX, YY)
{
    // XX[9] - ширина

    var XX2 = new Array(),
        YY2 = new Array();
    var w = (XX[9] - XX[29])*0.6;

    for(var i = 0; i < XX.length; i++)
    {
        XX2[i] = XX[i] + w;
        YY2[i] = YY[i];
    }

    CDoubleIntegral.superclass.drawPath.call(this, XX, YY);
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    CDoubleIntegral.superclass.drawPath.call(this, XX2, YY2);
}
CDoubleIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width = 14.2296*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function CTripleIntegral()
{
    CIntegral.call(this);
}
extend(CTripleIntegral, CIntegral);
CTripleIntegral.prototype.drawPath = function(XX, YY)
{
    // XX[9] - ширина

    var XX2 = new Array(),
        YY2 = new Array();
    var w = (XX[9] - XX[29])*0.6;

    var XX3 = new Array(),
        YY3 = new Array();

    for(var i = 0; i < XX.length; i++)
    {
        XX2[i] = XX[i] + w;
        YY2[i] = YY[i];

        XX3[i] = XX[i] + 2*w;
        YY3[i] = YY[i];
    }

    CTripleIntegral.superclass.drawPath.call(this, XX, YY);
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    CTripleIntegral.superclass.drawPath.call(this, XX2, YY2);
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    CTripleIntegral.superclass.drawPath.call(this, XX3, YY3);
}
CTripleIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width = 18.925368*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function old_CContourIntegral()
{
    CIntegral.call(this);
}
extend(old_CContourIntegral, CIntegral);
old_CContourIntegral.prototype.getCoord = function()
{
    var coord = old_CContourIntegral.superclass.getCoord.call(this);

    // X[97] - min x
    // Y[108] - min y

    var X = coord.X,
        Y = coord.Y;

   /* X[41] = 35826; Y[41] = 44627;
    X[42] = 39393; Y[42] = 42564;
    X[43] = 41895; Y[43] = 39408;
    X[44] = 44398; Y[44] = 36252;
    X[45] = 45743; Y[45] = 32158;
    X[46] = 47088; Y[46] = 28063;
    X[47] = 47088; Y[47] = 23188;
    X[48] = 47088; Y[48] = 19063;
    X[49] = 45899; Y[49] = 15469;
    X[50] = 44710; Y[50] = 11875;
    X[51] = 42645; Y[51] = 8969;
    X[52] = 40581; Y[52] = 6062;
    X[53] = 37734; Y[53] = 3937;
    X[54] = 34887; Y[54] = 1812;
    X[55] = 30069; Y[55] = 125;
    X[56] = 29882; Y[56] = 9937;
    X[57] = 29882; Y[57] = 22938;
    X[58] = 29882; Y[58] = 36252;
    X[59] = 28882; Y[59] = 47314;
    X[60] = 32698; Y[60] = 46502;
    X[61] = 35826; Y[61] = 44627;
    X[62] = 11504; Y[62] = 2625;
    X[63] = 8003; Y[63] = 4625;
    X[64] = 5439; Y[64] = 7750;
    X[65] = 2876; Y[65] = 10875;
    X[66] = 1438; Y[66] = 14938;
    X[67] = 0; Y[67] = 19001;
    X[68] = 0; Y[68] = 23813;
    X[69] = 0; Y[69] = 27751;
    X[70] = 1094; Y[70] = 31345;
    X[71] = 2188; Y[71] = 34938;
    X[72] = 4158; Y[72] = 37939;
    X[73] = 6128; Y[73] = 40939;
    X[74] = 9066; Y[74] = 43377;
    X[75] = 11942; Y[75] = 45689;
    X[76] = 16882; Y[76] = 46939;
    X[77] = 17069; Y[77] = 40189;
    X[78] = 17069; Y[78] = 32251;
    X[79] = 17069; Y[79] = 13876;
    X[80] = 18319; Y[80] = 0;
    X[81] = 14631; Y[81] = 812;
    X[82] = 11504; Y[82] = 2625;*/

    X[41] = 23876; Y[41] = 29743;
    X[42] = 26245; Y[42] = 28368;
    X[43] = 27908; Y[43] = 26265;
    X[44] = 29572; Y[44] = 24161;
    X[45] = 30466; Y[45] = 21433;
    X[46] = 31360; Y[46] = 18704;
    X[47] = 31360; Y[47] = 15455;
    X[48] = 31360; Y[48] = 12705;
    X[49] = 30570; Y[49] = 10310;
    X[50] = 29780; Y[50] = 7915;
    X[51] = 28408; Y[51] = 5978;
    X[52] = 27036; Y[52] = 4041;
    X[53] = 25144; Y[53] = 2625;
    X[54] = 23253; Y[54] = 1208;
    X[55] = 20052; Y[55] = 83;
    X[56] = 19927; Y[56] = 6623;
    X[57] = 19927; Y[57] = 15288;
    X[58] = 19927; Y[58] = 24161;
    X[59] = 19260; Y[59] = 31534;
    X[60] = 21796; Y[60] = 30992;
    X[61] = 23876; Y[61] = 29743;
    X[62] = 7674; Y[62] = 1750;
    X[63] = 5339; Y[63] = 3083;
    X[64] = 3628; Y[64] = 5166;
    X[65] = 1918; Y[65] = 7248;
    X[66] = 959; Y[66] = 9956;
    X[67] = 0; Y[67] = 12664;
    X[68] = 0; Y[68] = 15871;
    X[69] = 0; Y[69] = 18495;
    X[70] = 730; Y[70] = 20891;
    X[71] = 1460; Y[71] = 23286;
    X[72] = 2773; Y[72] = 25286;
    X[73] = 4087; Y[73] = 27285;
    X[74] = 6048; Y[74] = 28910;
    X[75] = 7967; Y[75] = 30451;
    X[76] = 11262; Y[76] = 31284;
    X[77] = 11387; Y[77] = 26785;
    X[78] = 11387; Y[78] = 21495;
    X[79] = 11387; Y[79] = 9248;
    X[80] = 12220; Y[80] = 0;
    X[81] = 9759; Y[81] = 542;
    X[82] = 7674; Y[82] = 1750;

    // X[48]
    // Y[59]
    var tX = X[9]/2 - X[48]/ 2,
        tY =  Y[24]/2 - Y[59]/2;

    for(var i = 0; i < 42; i++)
    {
        X[41+i] += tX;
        Y[41+i] += tY;
    }


    return {X: X, Y: Y};
}
old_CContourIntegral.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[41], YY[41]);
    MathControl.pGraph._c(XX[41], YY[41], XX[42], YY[42], XX[43], YY[43] );
    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );
    MathControl.pGraph._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61] );
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[62], YY[62]);
    MathControl.pGraph._c(XX[62], YY[62], XX[63], YY[63], XX[64], YY[64] );
    MathControl.pGraph._c(XX[64], YY[64], XX[65], YY[65], XX[66], YY[66] );
    MathControl.pGraph._c(XX[66], YY[66], XX[67], YY[67], XX[68], YY[68] );
    MathControl.pGraph._c(XX[68], YY[68], XX[69], YY[69], XX[70], YY[70] );
    MathControl.pGraph._c(XX[70], YY[70], XX[71], YY[71], XX[72], YY[72] );
    MathControl.pGraph._c(XX[72], YY[72], XX[73], YY[73], XX[74], YY[74] );
    MathControl.pGraph._c(XX[74], YY[74], XX[75], YY[75], XX[76], YY[76] );
    MathControl.pGraph._c(XX[76], YY[76], XX[77], YY[77], XX[78], YY[78] );
    MathControl.pGraph._c(XX[78], YY[78], XX[79], YY[79], XX[80], YY[80] );
    MathControl.pGraph._c(XX[80], YY[80], XX[81], YY[81], XX[82], YY[82] );
    MathControl.pGraph.df();

    MathControl.pGraph._s();
    old_CContourIntegral.superclass.drawPath.call(this, XX, YY);

}

function old_CCircle()
{

}
old_CCircle.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    // black circle
    X[0] = 21427.6; Y[0] = 29688.65;
    X[1] = 27961.6; Y[1] = 30637.45;
    X[2] = 30158.4; Y[2] = 32137.45;
    X[3] = 32388; Y[3] = 33636.65;
    X[4] = 34018.4; Y[4] = 35769.45;
    X[5] = 35649.6; Y[5] = 37902.25;
    X[6] = 36548; Y[6] = 40551.85;
    X[7] = 37447.2; Y[7] = 43201.45;
    X[8] = 37447.2; Y[8] = 46133.45;
    X[9] = 37447.2; Y[9] = 49599.85;
    X[10] = 36330.4; Y[10] = 52466.25;
    X[11] = 35214.4; Y[11] = 55331.85;
    X[12] = 33248; Y[12] = 57448.65;
    X[13] = 31282.4; Y[13] = 59564.65;
    X[14] = 28584; Y[14] = 60897.45;
    X[15] = 26084.8; Y[15] = 62130.25;
    X[16] = 20194.4; Y[16] = 62413.85;

    // white circle
    X[17] = 20194.4; Y[17] = 62413.85;
    X[18] = 21427.6; Y[18] = 29688.65;
    X[19] = 27961.6; Y[19] = 30637.45;
    X[20] = 30158.4; Y[20] = 32137.45;
    X[21] = 32388; Y[21] = 33636.65;
    X[22] = 34018.4; Y[22] = 35769.45;
    X[23] = 35649.6; Y[23] = 37902.25;
    X[24] = 36548; Y[24] = 40551.85;
    X[25] = 37447.2; Y[25] = 43201.45;
    X[26] = 37447.2; Y[26] = 46133.45;
    X[27] = 37447.2; Y[27] = 49599.85;
    X[28] = 36330.4; Y[28] = 52466.25;
    X[29] = 35214.4; Y[29] = 55331.85;
    X[30] = 33248; Y[30] = 57448.65;
    X[31] = 31282.4; Y[31] = 59564.65;
    X[32] = 28584; Y[32] = 60897.45;
    X[33] = 26084.8; Y[33] = 62130.25;


    return {X: X, Y: Y};
}
old_CCircle.prototype.calculate_drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    MathControl.pGraph.df();


    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[16], YY[16]);
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18]);
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]);
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]);
    MathControl.pGraph._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24]);
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26]);
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28]);
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]);
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]);
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
}


function CCircle()
{
    
}
CCircle.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 18345.98; Y[0] = 0; 
    X[1] = 25288.35; Y[1] = 1008.1; 
    X[2] = 27622.45; Y[2] = 2601.85; 
    X[3] = 29991.4; Y[3] = 4194.75; 
    X[4] = 31723.7; Y[4] = 6460.85; 
    X[5] = 33456.85; Y[5] = 8726.95; 
    X[6] = 34411.4; Y[6] = 11542.15; 
    X[7] = 35366.8; Y[7] = 14357.35; 
    X[8] = 35366.8; Y[8] = 17472.6; 
    X[9] = 35366.8; Y[9] = 21155.65; 
    X[10] = 34180.2; Y[10] = 24201.2; 
    X[11] = 32994.45; Y[11] = 27245.9; 
    X[12] = 30905.15; Y[12] = 29495; 
    X[13] = 28816.7; Y[13] = 31743.25; 
    X[14] = 25949.65; Y[14] = 33159.35; 
    X[15] = 23294.25; Y[15] = 34469.2; 
    X[16] = 17035.7; Y[16] = 34770.53; 
    X[17] = 17035.7; Y[17] = 34770.53; 
    X[18] = 10029.15; Y[18] = 33832.55; 
    X[19] = 7655.1; Y[19] = 32203.1; 
    X[20] = 5209.65; Y[20] = 30539.65; 
    X[21] = 3525.8; Y[21] = 28309.25; 
    X[22] = 1842.8; Y[22] = 26078; 
    X[23] = 921.4; Y[23] = 23334.2; 
    X[24] = 0; Y[24] = 20589.55; 
    X[25] = 0; Y[25] = 17509.15; 
    X[26] = 0; Y[26] = 14003.75; 
    X[27] = 1133.05; Y[27] = 10959.05; 
    X[28] = 2266.1; Y[28] = 7913.5; 
    X[29] = 4318.85; Y[29] = 5576.85; 
    X[30] = 6372.45; Y[30] = 3240.2; 
    X[31] = 9275.2; Y[31] = 1752.7; 
    X[32] = 11930.6; Y[32] = 407.15; 
    X[33] = 18345.98; Y[33] = 0;


    /*
    for(var i = 0; i < 34; i++)
    {
        var str = "X[" + i + "] = " + Math.round(X[i]*85)/100 + "; Y[" + i + "] = " + Math.round(Y[i]*85)/100 + ";";
        console.log(str);
    }*/

    var W = X[7],
        H = Y[16];

    return {X: X, Y: Y, W: W, H: H};
    
}
CCircle.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]);
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]);
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]);
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]);
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]);
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]);
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);

    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19]); 
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21]); 
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23]); 
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25]); 
    MathControl.pGraph._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27]); 
    MathControl.pGraph._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29]); 
    MathControl.pGraph._c(XX[29], YY[29], XX[30], YY[30], XX[31], YY[31]); 
    MathControl.pGraph._c(XX[31], YY[31], XX[32], YY[32], XX[33], YY[33]);
    MathControl.pGraph.ds();

}

function old_CSurface()
{

}
old_CSurface.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 42579; Y[0] = 9454;
    X[1] = 38281; Y[1] = 9454;
    X[2] = 37947; Y[2] = 7622;
    X[3] = 36946; Y[3] = 6436;
    X[4] = 35945; Y[4] = 5249;
    X[5] = 34276; Y[5] = 5249;
    X[6] = 29811; Y[6] = 5249;
    X[7] = 28393; Y[7] = 12493;
    X[8] = 27684; Y[8] = 16157;
    X[9] = 27350; Y[9] = 24692;
    X[10] = 28060; Y[10] = 24567;
    X[11] = 31605; Y[11] = 24192;
    X[12] = 35402; Y[12] = 24192;
    X[13] = 40825; Y[13] = 24192;
    X[14] = 45789; Y[14] = 25025;
    X[15] = 46790; Y[15] = 17446;
    X[16] = 48457; Y[16] = 12367;
    X[17] = 52584; Y[17] = 0;
    X[18] = 62715; Y[18] = 0;
    X[19] = 64174; Y[19] = 0;
    X[20] = 65946; Y[20] = 396;
    X[21] = 67718; Y[21] = 792;
    X[22] = 68968; Y[22] = 1375;
    X[23] = 68468; Y[23] = 9454;
    X[24] = 64177; Y[24] = 9454;
    X[25] = 63843; Y[25] = 7622;
    X[26] = 62841; Y[26] = 6436;
    X[27] = 61840; Y[27] = 5249;
    X[28] = 60172; Y[28] = 5249;
    X[29] = 55707; Y[29] = 5249;
    X[30] = 54288; Y[30] = 12493;
    X[31] = 53537; Y[31] = 16532;
    X[32] = 53163; Y[32] = 26399;
    X[33] = 53454; Y[33] = 26441;
    X[34] = 57124; Y[34] = 27566;
    X[35] = 61023; Y[35] = 29754;
    X[36] = 64922; Y[36] = 31941;
    X[37] = 67674; Y[37] = 36253;
    X[38] = 70426; Y[38] = 40565;
    X[39] = 70426; Y[39] = 46814;
    X[40] = 70426; Y[40] = 53147;
    X[41] = 67674; Y[41] = 57460;
    X[42] = 64922; Y[42] = 61772;
    X[43] = 60377; Y[43] = 64313;
    X[44] = 56374; Y[44] = 66563;
    X[45] = 51579; Y[45] = 67729;
    X[46] = 50578; Y[46] = 74520;
    X[47] = 48951; Y[47] = 79728;
    X[48] = 45032; Y[48] = 92352;
    X[49] = 35066; Y[49] = 92352;
    X[50] = 33064; Y[50] = 92352;
    X[51] = 31562; Y[51] = 92019;
    X[52] = 30061; Y[52] = 91686;
    X[53] = 28644; Y[53] = 90936;
    X[54] = 29185; Y[54] = 82735;
    X[55] = 33108; Y[55] = 82735;
    X[56] = 33650; Y[56] = 84732;
    X[57] = 34714; Y[57] = 86022;
    X[58] = 35778; Y[58] = 87312;
    X[59] = 37739; Y[59] = 87312;
    X[60] = 42120; Y[60] = 87312;
    X[61] = 43246; Y[61] = 78241;
    X[62] = 43706; Y[62] = 74413;
    X[63] = 43997; Y[63] = 69087;
    X[64] = 38657; Y[64] = 69504;
    X[65] = 35403; Y[65] = 69504;
    X[66] = 30898; Y[66] = 69504;
    X[67] = 25475; Y[67] = 68962;
    X[68] = 24559; Y[68] = 74956;
    X[69] = 23061; Y[69] = 79741;
    X[70] = 19148; Y[70] = 92352;
    X[71] = 9201; Y[71] = 92352;
    X[72] = 7203; Y[72] = 92352;
    X[73] = 5704; Y[73] = 92019;
    X[74] = 4206; Y[74] = 91686;
    X[75] = 2791; Y[75] = 90936;
    X[76] = 3333; Y[76] = 82735;
    X[77] = 7245; Y[77] = 82735;
    X[78] = 7786; Y[78] = 84732;
    X[79] = 8847; Y[79] = 86022;
    X[80] = 9908; Y[80] = 87312;
    X[81] = 11863; Y[81] = 87312;
    X[82] = 16231; Y[82] = 87312;
    X[83] = 17355; Y[83] = 78241;
    X[84] = 17895; Y[84] = 73913;
    X[85] = 18187; Y[85] = 67588;
    X[86] = 13235; Y[86] = 66171;
    X[87] = 10238; Y[87] = 64546;
    X[88] = 7200; Y[88] = 62880;
    X[89] = 4869; Y[89] = 60380;
    X[90] = 2539; Y[90] = 57879;
    X[91] = 1269; Y[91] = 54504;
    X[92] = 0; Y[92] = 51129;
    X[93] = 0; Y[93] = 46920;
    X[94] = 0; Y[94] = 40670;
    X[95] = 2812; Y[95] = 36336;
    X[96] = 5625; Y[96] = 32002;
    X[97] = 10124; Y[97] = 29460;
    X[98] = 14457; Y[98] = 27043;
    X[99] = 19790; Y[99] = 25835;
    X[100] = 20831; Y[100] = 17710;
    X[101] = 22581; Y[101] = 12376;
    X[102] = 26706; Y[102] = 0;
    X[103] = 36829; Y[103] = 0;
    X[104] = 38287; Y[104] = 0;
    X[105] = 40058; Y[105] = 396;
    X[106] = 41829; Y[106] = 792;
    X[107] = 43079; Y[107] = 1375;
    X[108] = 42579; Y[108] = 9454;
    X[109] = 35320; Y[109] = 64672;
    X[110] = 38742; Y[110] = 64672;
    X[111] = 44165; Y[111] = 64339;
    X[112] = 44373; Y[112] = 58752;
    X[113] = 44373; Y[113] = 51831;
    X[114] = 44373; Y[114] = 39364;
    X[115] = 45206; Y[115] = 30066;
    X[116] = 45206; Y[116] = 29899;
    X[117] = 45206; Y[117] = 29774;
    X[118] = 39449; Y[118] = 29065;
    X[119] = 35319; Y[119] = 29065;
    X[120] = 31606; Y[120] = 29065;
    X[121] = 27184; Y[121] = 29399;
    X[122] = 27017; Y[122] = 36320;
    X[123] = 27017; Y[123] = 45617;
    X[124] = 27017; Y[124] = 55958;
    X[125] = 26100; Y[125] = 64213;
    X[126] = 30481; Y[126] = 64672;
    X[127] = 35320; Y[127] = 64672;
    X[128] = 5082; Y[128] = 46910;
    X[129] = 5082; Y[129] = 52121;
    X[130] = 7620; Y[130] = 55916;
    X[131] = 10116; Y[131] = 59543;
    X[132] = 18311; Y[132] = 62754;
    X[133] = 18478; Y[133] = 57792;
    X[134] = 18478; Y[134] = 51830;
    X[135] = 18478; Y[135] = 39905;
    X[136] = 19269; Y[136] = 30816;
    X[137] = 16357; Y[137] = 31608;
    X[138] = 13195; Y[138] = 33192;
    X[139] = 9867; Y[139] = 34861;
    X[140] = 7474; Y[140] = 38301;
    X[141] = 5082; Y[141] = 41740;
    X[142] = 5082; Y[142] = 46910;
    X[143] = 65178; Y[143] = 46869;
    X[144] = 65178; Y[144] = 40698;
    X[145] = 61632; Y[145] = 36862;
    X[146] = 58294; Y[146] = 33192;
    X[147] = 53038; Y[147] = 31775;
    X[148] = 52913; Y[148] = 37863;
    X[149] = 52913; Y[149] = 45618;
    X[150] = 52913; Y[150] = 55040;
    X[151] = 52163; Y[151] = 62712;
    X[152] = 57169; Y[152] = 61336;
    X[153] = 60923; Y[153] = 57667;
    X[154] = 65178; Y[154] = 53498;
    X[155] = 65178; Y[155] = 46869;

}
old_CSurface.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._l(XX[10], YY[10]);
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] );
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] );
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] );
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20] );
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] );
    MathControl.pGraph._l(XX[23], YY[23]);
    MathControl.pGraph._l(XX[24], YY[24]);
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] );
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] );
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
    MathControl.pGraph._l(XX[33], YY[33]);
    MathControl.pGraph._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35] );
    MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );
    MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
    MathControl.pGraph._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41] );
    MathControl.pGraph._c(XX[41], YY[41], XX[42], YY[42], XX[43], YY[43] );
    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._l(XX[54], YY[54]);
    MathControl.pGraph._l(XX[55], YY[55]);
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
    MathControl.pGraph._l(XX[76], YY[76]);
    MathControl.pGraph._l(XX[77], YY[77]);
    MathControl.pGraph._c(XX[77], YY[77], XX[78], YY[78], XX[79], YY[79] );
    MathControl.pGraph._c(XX[79], YY[79], XX[80], YY[80], XX[81], YY[81] );
    MathControl.pGraph._c(XX[81], YY[81], XX[82], YY[82], XX[83], YY[83] );
    MathControl.pGraph._c(XX[83], YY[83], XX[84], YY[84], XX[85], YY[85] );
    MathControl.pGraph._c(XX[85], YY[85], XX[86], YY[86], XX[87], YY[87] );
    MathControl.pGraph._c(XX[87], YY[87], XX[88], YY[88], XX[89], YY[89] );
    MathControl.pGraph._c(XX[89], YY[89], XX[90], YY[90], XX[91], YY[91] );
    MathControl.pGraph._c(XX[91], YY[91], XX[92], YY[92], XX[93], YY[93] );
    MathControl.pGraph._c(XX[93], YY[93], XX[94], YY[94], XX[95], YY[95] );
    MathControl.pGraph._c(XX[95], YY[95], XX[96], YY[96], XX[97], YY[97] );
    MathControl.pGraph._c(XX[97], YY[97], XX[98], YY[98], XX[99], YY[99] );
    MathControl.pGraph._c(XX[99], YY[99], XX[100], YY[100], XX[101], YY[101] );
    MathControl.pGraph._c(XX[101], YY[101], XX[102], YY[102], XX[103], YY[103] );
    MathControl.pGraph._c(XX[103], YY[103], XX[104], YY[104], XX[105], YY[105] );
    MathControl.pGraph._c(XX[105], YY[105], XX[106], YY[106], XX[107], YY[107] );
    MathControl.pGraph._l(XX[108], YY[108]);

    MathControl.pGraph._m(XX[109], YY[109]);
    MathControl.pGraph._c(XX[109], YY[109], XX[110], YY[110], XX[111], YY[111] );
    MathControl.pGraph._c(XX[111], YY[111], XX[112], YY[112], XX[113], YY[113] );
    MathControl.pGraph._c(XX[113], YY[113], XX[114], YY[114], XX[115], YY[115] );
    MathControl.pGraph._c(XX[115], YY[115], XX[116], YY[116], XX[117], YY[117] );
    MathControl.pGraph._c(XX[117], YY[117], XX[118], YY[118], XX[119], YY[119] );
    MathControl.pGraph._c(XX[119], YY[119], XX[120], YY[120], XX[121], YY[121] );
    MathControl.pGraph._c(XX[121], YY[121], XX[122], YY[122], XX[123], YY[123] );
    MathControl.pGraph._c(XX[123], YY[123], XX[124], YY[124], XX[125], YY[125] );
    MathControl.pGraph._c(XX[125], YY[125], XX[126], YY[126], XX[127], YY[127] );

    MathControl.pGraph._m(XX[128], YY[128]);
    MathControl.pGraph._c(XX[128], YY[128], XX[129], YY[129], XX[130], YY[130] );
    MathControl.pGraph._c(XX[130], YY[130], XX[131], YY[131], XX[132], YY[132] );
    MathControl.pGraph._c(XX[132], YY[132], XX[133], YY[133], XX[134], YY[134] );
    MathControl.pGraph._c(XX[134], YY[134], XX[135], YY[135], XX[136], YY[136] );
    MathControl.pGraph._c(XX[136], YY[136], XX[137], YY[137], XX[138], YY[138] );
    MathControl.pGraph._c(XX[138], YY[138], XX[139], YY[139], XX[140], YY[140] );
    MathControl.pGraph._c(XX[140], YY[140], XX[141], YY[141], XX[142], YY[142] );

    MathControl.pGraph._m(XX[143], YY[143]);
    MathControl.pGraph._c(XX[143], YY[143], XX[144], YY[144], XX[145], YY[145] );
    MathControl.pGraph._c(XX[145], YY[145], XX[146], YY[146], XX[147], YY[147] );
    MathControl.pGraph._c(XX[147], YY[147], XX[148], YY[148], XX[149], YY[149] );
    MathControl.pGraph._c(XX[149], YY[149], XX[150], YY[150], XX[151], YY[151] );
    MathControl.pGraph._c(XX[151], YY[151], XX[152], YY[152], XX[153], YY[153] );
    MathControl.pGraph._c(XX[153], YY[153], XX[154], YY[154], XX[155], YY[155] );

}

function CSurface()
{

}
CSurface.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 24855.55; Y[0] = 312.82; 
    X[1] = 27995.71; Y[1] = 0; 
    X[2] = 31359.09; Y[2] = 0; 
    X[3] = 36162.79; Y[3] = 0; 
    X[4] = 40559.9; Y[4] = 694.89; 
    X[5] = 43954.72; Y[5] = 1285.5; 
    X[6] = 47349.55; Y[6] = 1876.11; 
    X[7] = 50600.44; Y[7] = 2814.59; 
    X[8] = 54054.17; Y[8] = 4639.82; 
    X[9] = 57507.91; Y[9] = 6464.21; 
    X[10] = 59945.63; Y[10] = 10061.28; 
    X[11] = 62383.35; Y[11] = 13658.35; 
    X[12] = 62383.35; Y[12] = 18871.27; 
    X[13] = 62383.35; Y[13] = 24154.26; 
    X[14] = 59945.63; Y[14] = 27752.16; 
    X[15] = 57507.91; Y[15] = 31349.23; 
    X[16] = 53481.95; Y[16] = 33468.93; 
    X[17] = 49936.09; Y[17] = 35345.88; 
    X[18] = 45688.68; Y[18] = 36318.56; 
    X[19] = 42330.61; Y[19] = 36884.98; 
    X[20] = 38972.54; Y[20] = 37451.41; 
    X[21] = 34242.37; Y[21] = 37799.27; 
    X[22] = 31359.98; Y[22] = 37799.27; 
    X[23] = 27369.45; Y[23] = 37799.27; 
    X[24] = 22565.76; Y[24] = 37347.13; 
    X[25] = 19337.9; Y[25] = 36774.04; 
    X[26] = 16110.04; Y[26] = 36200.94; 
    X[27] = 11723.56; Y[27] = 35018.88; 
    X[28] = 9068.82; Y[28] = 33663.3; 
    X[29] = 6377.76; Y[29] = 32273.53; 
    X[30] = 4312.96; Y[30] = 30188.03; 
    X[31] = 2249.05; Y[31] = 28101.69; 
    X[32] = 1124.08; Y[32] = 25286.27; 
    X[33] = 0; Y[33] = 22470.84; 
    X[34] = 0; Y[34] = 18959.69; 
    X[35] = 0; Y[35] = 13745.94; 
    X[36] = 2490.87; Y[36] = 10130.52; 
    X[37] = 4982.63; Y[37] = 6515.1; 
    X[38] = 8967.84; Y[38] = 4394.56; 
    X[39] = 12806.01; Y[39] = 2378.3; 
    X[40] = 17529.98; Y[40] = 1370.59; 
    X[41] = 21192.77; Y[41] = 841.7; 
    X[42] = 24855.55; Y[42] = 312.82;


    var t = Y[1];
    for(var i = 0 ; i < X.length; i++)
    {
        var yy = Math.round((Y[i] - t)*100)/100;
        var str = "X[" + i + "] = " + X[i] + "; Y[" + i + "] = " + yy + ";";
        console.log(str);

    }

    var W = X[11],
        H = Y[21];


    /*for(var i = 0; i < X.length; i++)
    {
        X[i] *= 1.03;
        Y[i] *= 0.97;

        var xx = Math.round(X[i]*100)/100;
        var yy = Math.round(Y[i]*100)/100;

        var str = "X[" + i + "] = " + xx + "; Y[" + i + "] = " + yy + ";";
        console.log(str);

    }*/


    return {X: X, Y: Y, W: W, H: H};
}
CSurface.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] );
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] ); 
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] ); 
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] );
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] );
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] ); 
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] ); 
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] ); 
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] ); 
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20] );
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] );
    MathControl.pGraph._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24] );
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] ); 
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] );
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] ); 
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34] );
    MathControl.pGraph._c(XX[34], YY[34], XX[35], YY[35], XX[36], YY[36] );
    MathControl.pGraph._c(XX[36], YY[36], XX[37], YY[37], XX[38], YY[38] ); 
    MathControl.pGraph._c(XX[38], YY[38], XX[39], YY[39], XX[40], YY[40] );
    MathControl.pGraph._c(XX[40], YY[40], XX[41], YY[41], XX[42], YY[42] );
    MathControl.pGraph.ds();
}

function CVolume()
{

}
CVolume.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 24086.6; Y[0] = 1584.99; 
    X[1] = 25878.03; Y[1] = 1268.19; 
    X[2] = 30642.29; Y[2] = 669.24; 
    X[3] = 35139.13; Y[3] = 104.94; 
    X[4] = 43028.74; Y[4] = 0; 
    X[5] = 46945.61; Y[5] = 59.9; 
    X[6] = 50862.49; Y[6] = 119.79; 
    X[7] = 57135.73; Y[7] = 330.66; 
    X[8] = 61811.92; Y[8] = 923.67; 
    X[9] = 65955.41; Y[9] = 1411.74; 
    X[10] = 68883.14; Y[10] = 2040.39; 
    X[11] = 72891.84; Y[11] = 3159.09; 
    X[12] = 76900.55; Y[12] = 4277.79; 
    X[13] = 82700.15; Y[13] = 6485.49; 
    X[14] = 86547.22; Y[14] = 10342.53; 
    X[15] = 90394.28; Y[15] = 14199.57; 
    X[16] = 90394.28; Y[16] = 19211.94; 
    X[17] = 90394.28; Y[17] = 24750.99; 
    X[18] = 86653.54; Y[18] = 28554.57; 
    X[19] = 82913.87; Y[19] = 32358.15; 
    X[20] = 79268.72; Y[20] = 33795.63; 
    X[21] = 76154.12; Y[21] = 35057.88; 
    X[22] = 74484.05; Y[22] = 35583.57; 
    X[23] = 70409.29; Y[23] = 36523.08; 
    X[24] = 66334.54; Y[24] = 37462.59; 
    X[25] = 64662.32; Y[25] = 37742.76; 
    X[26] = 60137.56; Y[26] = 38336.76; 
    X[27] = 55689.05; Y[27] = 38896.11; 
    X[28] = 47782.26; Y[28] = 39001.05; 
    X[29] = 44054.41; Y[29] = 38969.37; 
    X[30] = 40326.55; Y[30] = 38937.69; 
    X[31] = 36744.76; Y[31] = 38832.75; 
    X[32] = 32133.01; Y[32] = 38481.3; 
    X[33] = 27597.5; Y[33] = 38130.84; 
    X[34] = 21918.19; Y[34] = 37007.19; 
    X[35] = 17870.29; Y[35] = 35901.36; 
    X[36] = 13822.38; Y[36] = 34795.53; 
    X[37] = 13593.62; Y[37] = 34726.23; 
    X[38] = 13365.93; Y[38] = 34620.3; 
    X[39] = 9226.73; Y[39] = 33113.52; 
    X[40] = 6246.38; Y[40] = 30888; 
    X[41] = 3266.03; Y[41] = 28662.48; 
    X[42] = 1632.48; Y[42] = 25789.5; 
    X[43] = 0; Y[43] = 22915.53; 
    X[44] = 0; Y[44] = 19201.05; 
    X[45] = 0; Y[45] = 14329.26; 
    X[46] = 3746.11; Y[46] = 10456.38; 
    X[47] = 7493.3; Y[47] = 6583.5; 
    X[48] = 13503.4; Y[48] = 4341.15; 
    X[49] = 18795; Y[49] = 2963.07; 
    X[50] = 24086.6; Y[50] = 1584.99;

    /*var min_y = 23530,
        ind_y;

    for(var i = 0; i < X.length; i++)
    {

        if(Y[i] < min_y)
        {
            ind_y = i;
            min_y = Y[i];
        }

    }

    for(var i = 0; i < 51; i++)
    {
        X[i] *= 1.074;
        Y[i] *= 0.99;
    }
    var t = Y[ind_y];

    for(var i = 0; i < 51; i++)
    {
        var yy = Math.round((Y[i] - t)*100)/100;
        var xx = Math.round(X[i]*100)/100;

        var str = "X["+i+"] = " + xx + "; Y["+i+ "] = "+ yy + ";";
        console.log(str);
    }*/


    var W = X[15],
        H = Y[28];


    return {X: X, Y: Y, W : W, H : H};
}
CVolume.prototype.drawPath = function(XX, YY)
{
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2] ); 
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4] ); 
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6] ); 
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8] ); 
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10] ); 
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] ); 
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] ); 
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] ); 
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] ); 
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20] ); 
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] ); 
    MathControl.pGraph._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24] ); 
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] ); 
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] ); 
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
    MathControl.pGraph.ds();
}

function _old_CContourIntegral()
{
    CIntegral.call(this);
}
extend(_old_CContourIntegral, CNaryOperator);
_old_CContourIntegral.prototype.old_getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    X[0] = 40566; Y[0] = 9456;
    X[1] = 36276; Y[1] = 9456;
    X[2] = 35944; Y[2] = 7623;
    X[3] = 34946; Y[3] = 6436;
    X[4] = 33948; Y[4] = 5249;
    X[5] = 32285; Y[5] = 5249;
    X[6] = 27837; Y[6] = 5249;
    X[7] = 26423; Y[7] = 12497;
    X[8] = 25674; Y[8] = 16370;


    X[9] = 25341; Y[9] = 25660;
    X[10] = 29751; Y[10] = 26784;
    X[11] = 32497; Y[11] = 28659;
    X[12] = 35284; Y[12] = 30533;
    X[13] = 37322; Y[13] = 33199;
    X[14] = 39361; Y[14] = 35865;
    X[15] = 40484; Y[15] = 39177;
    X[16] = 41608; Y[16] = 42489;
    X[17] = 41608; Y[17] = 46154;
    X[18] = 41608; Y[18] = 50487;
    X[19] = 40212; Y[19] = 54070;
    X[20] = 38817; Y[20] = 57652;
    X[21] = 36359; Y[21] = 60298;
    X[22] = 33902; Y[22] = 62943;
    X[23] = 30529; Y[23] = 64609;
    X[24] = 27405; Y[24] = 66150;
    X[25] = 23824; Y[25] = 66650;


    X[26] = 22865; Y[26] = 74065;
    X[27] = 21074; Y[27] = 79730;
    X[28] = 17160; Y[28] = 92352;
    X[29] = 7205; Y[29] = 92352;
    X[30] = 5205; Y[30] = 92352;
    X[31] = 3706; Y[31] = 92019;
    X[32] = 2207; Y[32] = 91686;
    X[33] = 791; Y[33] = 90936;
    X[34] = 1332; Y[34] = 82730;
    X[35] = 5249; Y[35] = 82730;
    X[36] = 5791; Y[36] = 84729;
    X[37] = 6854; Y[37] = 86020;
    X[38] = 7918; Y[38] = 87312;
    X[39] = 9879; Y[39] = 87312;
    X[40] = 14259; Y[40] = 87312;
    X[41] = 15384; Y[41] = 78231;
    X[42] = 15969; Y[42] = 73482;

    X[43] = 16260; Y[43] = 66359;
    X[44] = 11799; Y[44] = 65401;
    X[45] = 9006; Y[45] = 63484;
    X[46] = 6129; Y[46] = 61527;
    X[47] = 4148; Y[47] = 58903;
    X[48] = 2168; Y[48] = 56278;
    X[49] = 1084; Y[49] = 53050;
    X[50] = 0; Y[50] = 49821;
    X[51] = 0; Y[51] = 46197;
    X[52] = 0; Y[52] = 42073;
    X[53] = 1333; Y[53] = 38491;
    X[54] = 2666; Y[54] = 34908;
    X[55] = 5081; Y[55] = 32159;
    X[56] = 7497; Y[56] = 29410;
    X[57] = 10912; Y[57] = 27660;
    X[58] = 14036; Y[58] = 26077;
    X[59] = 17826; Y[59] = 25536;


    X[60] = 18826; Y[60] = 17621;
    X[61] = 20574; Y[61] = 12372;
    X[62] = 24698; Y[62] = 0;
    X[63] = 34819; Y[63] = 0;
    X[64] = 36277; Y[64] = 0;
    X[65] = 38047; Y[65] = 396;
    X[66] = 39817; Y[66] = 792;
    X[67] = 41066; Y[67] = 1375;
    X[68] = 40566; Y[68] = 9456;

    X[69] = 29000; Y[69] = 60069;
    X[70] = 31369; Y[70] = 58694;
    X[71] = 33032; Y[71] = 56591;
    X[72] = 34696; Y[72] = 54487;
    X[73] = 35590; Y[73] = 51759;
    X[74] = 36484; Y[74] = 49030;
    X[75] = 36484; Y[75] = 45781;
    X[76] = 36484; Y[76] = 43031;
    X[77] = 35694; Y[77] = 40636;
    X[78] = 34904; Y[78] = 38241;
    X[79] = 33532; Y[79] = 36304;
    X[80] = 32160; Y[80] = 34367;
    X[81] = 30268; Y[81] = 32951;
    X[82] = 28377; Y[82] = 31534;
    X[83] = 25176; Y[83] = 30409;
    X[84] = 25051; Y[84] = 36949;
    X[85] = 25051; Y[85] = 45614;
    X[86] = 25051; Y[86] = 54487;
    X[87] = 24384; Y[87] = 61860;
    X[88] = 26920; Y[88] = 61318;
    X[89] = 29000; Y[89] = 60069;

    X[90] = 12798; Y[90] = 32076;
    X[91] = 10463; Y[91] = 33409;
    X[92] = 8752; Y[92] = 35492;
    X[93] = 7042; Y[93] = 37574;
    X[94] = 6083; Y[94] = 40282;
    X[95] = 5124; Y[95] = 42990;
    X[96] = 5124; Y[96] = 46197;
    X[97] = 5124; Y[97] = 48821;
    X[98] = 5854; Y[98] = 51217;
    X[99] = 6584; Y[99] = 53612;
    X[100] = 7897; Y[100] = 55612;
    X[101] = 9211; Y[101] = 57611;
    X[102] = 11172; Y[102] = 59236;
    X[103] = 13091; Y[103] = 60777;
    X[104] = 16386; Y[104] = 61610;
    X[105] = 16511; Y[105] = 57111;
    X[106] = 16511; Y[106] = 51821;
    X[107] = 16511; Y[107] = 39574;
    X[108] = 17344; Y[108] = 30326;
    X[109] = 14883; Y[109] = 30868;
    X[110] = 12798; Y[110] = 32076;

    return {X: X, Y: Y};
}
_old_CContourIntegral.prototype.calculate_getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    /*X[0] = 40566; Y[0] = 9456;
    X[1] = 36276; Y[1] = 9456;
    X[2] = 35944; Y[2] = 7623;
    X[3] = 34946; Y[3] = 6436;
    X[4] = 33948; Y[4] = 5249;
    X[5] = 32285; Y[5] = 5249;
    X[6] = 27837; Y[6] = 5249;
    X[7] = 26423; Y[7] = 12497;
    X[8] = 25674; Y[8] = 16370;*/

    X[9] = 25341; Y[9] = 25660;
    X[10] = 29751; Y[10] = 26784;
    X[11] = 32497; Y[11] = 28659;
    X[12] = 35284; Y[12] = 30533;
    X[13] = 37322; Y[13] = 33199;
    X[14] = 39361; Y[14] = 35865;
    X[15] = 40484; Y[15] = 39177;
    X[16] = 41608; Y[16] = 42489;
    X[17] = 41608; Y[17] = 46154;
    X[18] = 41608; Y[18] = 50487;
    X[19] = 40212; Y[19] = 54070;
    X[20] = 38817; Y[20] = 57652;
    X[21] = 36359; Y[21] = 60298;
    X[22] = 33902; Y[22] = 62943;
    X[23] = 30529; Y[23] = 64609;
    X[24] = 27405; Y[24] = 66150;
    X[25] = 23824; Y[25] = 66650;

    /*X[26] = 22865; Y[26] = 74065;
    X[27] = 21074; Y[27] = 79730;
    X[28] = 17160; Y[28] = 92352;
    X[29] = 7205; Y[29] = 92352;
    X[30] = 5205; Y[30] = 92352;
    X[31] = 3706; Y[31] = 92019;
    X[32] = 2207; Y[32] = 91686;
    X[33] = 791; Y[33] = 90936;
    X[34] = 1332; Y[34] = 82730;
    X[35] = 5249; Y[35] = 82730;
    X[36] = 5791; Y[36] = 84729;
    X[37] = 6854; Y[37] = 86020;
    X[38] = 7918; Y[38] = 87312;
    X[39] = 9879; Y[39] = 87312;
    X[40] = 14259; Y[40] = 87312;
    X[41] = 15384; Y[41] = 78231;
    X[42] = 15969; Y[42] = 73482;*/

    X[43] = 16260; Y[43] = 66359;
    X[44] = 11799; Y[44] = 65401;
    X[45] = 9006; Y[45] = 63484;
    X[46] = 6129; Y[46] = 61527;
    X[47] = 4148; Y[47] = 58903;
    X[48] = 2168; Y[48] = 56278;
    X[49] = 1084; Y[49] = 53050;
    X[50] = 0; Y[50] = 49821;
    X[51] = 0; Y[51] = 46197;
    X[52] = 0; Y[52] = 42073;
    X[53] = 1333; Y[53] = 38491;
    X[54] = 2666; Y[54] = 34908;
    X[55] = 5081; Y[55] = 32159;
    X[56] = 7497; Y[56] = 29410;
    X[57] = 10912; Y[57] = 27660;
    X[58] = 14036; Y[58] = 26077;
    X[59] = 17826; Y[59] = 25536;

    X[9] = X[59] = (X[9] + X[59])/2;
    Y[9] = Y[59] = (Y[9] + Y[59])/2;

    X[25] = X[43] = (X[43] + X[25])/2;
    Y[25] = Y[43] = (Y[43] + Y[25])/2;

    var max_x = 0, max_y = 0,
        min_x = 100000, min_y = 100000;

    for(var i = 0; i < X.length; i++)
    {
        min_x = X[i] < min_x ? X[i] : min_x;
        max_x = X[i] > max_x ? X[i] : max_x;

        min_y = Y[i] < min_y ? Y[i] : min_y;
        max_y = Y[i] > max_y ? Y[i] : max_y;
    }


    for(var i = 9; i < 26; i++)
    {
        X[i] = min_x + (max_x - min_x)*0.1 + (X[i] - min_x)*0.8;
        Y[i] = min_y + (max_y - min_y)*0.1  + (Y[i] - min_y)*0.8;
    }

    for(var i = 43; i < 60; i++)
    {
        X[i] = min_x + (max_x - min_x)*0.1  + (X[i] - min_x)*0.8;
        Y[i] = min_y + (max_y - min_y)*0.1  + (Y[i] - min_y)*0.8;
    }

    for(var i = 0; i < 17; i++)
    {
        X[44+i] = X[i+9];
        Y[44+i] = Y[i+9];
    }

    for(var i = 0; i < 17; i++)
    {
        X[61+i] = X[43+i];
        Y[61+i] = Y[43+i];
    }

    for(var i = 44; i < 78; i++)
    {
        var str = "X[" + i + "] = " + X[i] + "; Y[" + i + "] = " + Y[i] + ";";
        console.log(str);
    }


    /* X[60] = 18826; Y[60] = 17621;
    X[61] = 20574; Y[61] = 12372;
    X[62] = 24698; Y[62] = 0;
    X[63] = 34819; Y[63] = 0;
    X[64] = 36277; Y[64] = 0;
    X[65] = 38047; Y[65] = 396;
    X[66] = 39817; Y[66] = 792;
    X[67] = 41066; Y[67] = 1375;
    X[68] = 40566; Y[68] = 9456;

    X[69] = 29000; Y[69] = 60069;
    X[70] = 31369; Y[70] = 58694;
    X[71] = 33032; Y[71] = 56591;
    X[72] = 34696; Y[72] = 54487;
    X[73] = 35590; Y[73] = 51759;
    X[74] = 36484; Y[74] = 49030;
    X[75] = 36484; Y[75] = 45781;
    X[76] = 36484; Y[76] = 43031;
    X[77] = 35694; Y[77] = 40636;
    X[78] = 34904; Y[78] = 38241;
    X[79] = 33532; Y[79] = 36304;
    X[80] = 32160; Y[80] = 34367;
    X[81] = 30268; Y[81] = 32951;
    X[82] = 28377; Y[82] = 31534;
    X[83] = 25176; Y[83] = 30409;
    X[84] = 25051; Y[84] = 36949;
    X[85] = 25051; Y[85] = 45614;
    X[86] = 25051; Y[86] = 54487;
    X[87] = 24384; Y[87] = 61860;
    X[88] = 26920; Y[88] = 61318;
    X[89] = 29000; Y[89] = 60069;

    X[90] = 12798; Y[90] = 32076;
    X[91] = 10463; Y[91] = 33409;
    X[92] = 8752; Y[92] = 35492;
    X[93] = 7042; Y[93] = 37574;
    X[94] = 6083; Y[94] = 40282;
    X[95] = 5124; Y[95] = 42990;
    X[96] = 5124; Y[96] = 46197;
    X[97] = 5124; Y[97] = 48821;
    X[98] = 5854; Y[98] = 51217;
    X[99] = 6584; Y[99] = 53612;
    X[100] = 7897; Y[100] = 55612;
    X[101] = 9211; Y[101] = 57611;
    X[102] = 11172; Y[102] = 59236;
    X[103] = 13091; Y[103] = 60777;
    X[104] = 16386; Y[104] = 61610;
    X[105] = 16511; Y[105] = 57111;
    X[106] = 16511; Y[106] = 51821;
    X[107] = 16511; Y[107] = 39574;
    X[108] = 17344; Y[108] = 30326;
    X[109] = 14883; Y[109] = 30868;
    X[110] = 12798; Y[110] = 32076;*/

    //return {X: X, Y: Y};
}
_old_CContourIntegral.prototype.getCoord = function()
{
    var X = new Array(),
        Y = new Array();

    // black circle
    X[0] = 21427.6; Y[0] = 29688.65;
    X[1] = 27961.6; Y[1] = 30637.45;
    X[2] = 30158.4; Y[2] = 32137.45;
    X[3] = 32388; Y[3] = 33636.65;
    X[4] = 34018.4; Y[4] = 35769.45;
    X[5] = 35649.6; Y[5] = 37902.25;
    X[6] = 36548; Y[6] = 40551.85;
    X[7] = 37447.2; Y[7] = 43201.45;
    X[8] = 37447.2; Y[8] = 46133.45;
    X[9] = 37447.2; Y[9] = 49599.85;
    X[10] = 36330.4; Y[10] = 52466.25;
    X[11] = 35214.4; Y[11] = 55331.85;
    X[12] = 33248; Y[12] = 57448.65;
    X[13] = 31282.4; Y[13] = 59564.65;
    X[14] = 28584; Y[14] = 60897.45;
    X[15] = 26084.8; Y[15] = 62130.25;
    X[16] = 20194.4; Y[16] = 62413.85;

    // white circle
    X[17] = 20194.4; Y[17] = 62413.85;
    X[18] = 21427.6; Y[18] = 29688.65;
    X[19] = 27961.6; Y[19] = 30637.45;
    X[20] = 30158.4; Y[20] = 32137.45;
    X[21] = 32388; Y[21] = 33636.65;
    X[22] = 34018.4; Y[22] = 35769.45;
    X[23] = 35649.6; Y[23] = 37902.25;
    X[24] = 36548; Y[24] = 40551.85;
    X[25] = 37447.2; Y[25] = 43201.45;
    X[26] = 37447.2; Y[26] = 46133.45;
    X[27] = 37447.2; Y[27] = 49599.85;
    X[28] = 36330.4; Y[28] = 52466.25;
    X[29] = 35214.4; Y[29] = 55331.85;
    X[30] = 33248; Y[30] = 57448.65;
    X[31] = 31282.4; Y[31] = 59564.65;
    X[32] = 28584; Y[32] = 60897.45;
    X[33] = 26084.8; Y[33] = 62130.25;

    //integral
    X[34] = 21562.375; Y[34] = 65723;
    X[35] = 21562.375; Y[35] = 60840;
    X[36] = 21562.375; Y[36] = 37013;
    X[37] = 25488.375; Y[37] = 18507;
    X[38] = 29415.375; Y[38] = 0;
    X[39] = 41745.375; Y[39] = 0;
    X[40] = 43297.375; Y[40] = 0;
    X[41] = 44759.375; Y[41] = 383;
    X[42] = 46222.375; Y[42] = 765;
    X[43] = 47370.375; Y[43] = 1305;
    X[44] = 46335.375; Y[44] = 9225;
    X[45] = 42915.375; Y[45] = 9225;
    X[46] = 42667.375; Y[46] = 7335;
    X[47] = 41879.375; Y[47] = 6064;
    X[48] = 41092.375; Y[48] = 4793;
    X[49] = 39090.375; Y[49] = 4793;
    X[50] = 31620.375; Y[50] = 4793;
    X[51] = 29561.375; Y[51] = 23086;
    X[52] = 27502.375; Y[52] = 41378;
    X[53] = 27502.375; Y[53] = 60840;
    X[54] = 27502.375; Y[54] = 65723;
    X[55] = 26924.6875; Y[55] = 76865.91805;
    X[56] = 26347; Y[56] = 88008.8361;
    X[57] = 26347; Y[57] = 92891.8361;
    X[58] = 26325; Y[58] = 121376.8361;
    X[59] = 21622; Y[59] = 137689.8361;
    X[60] = 16920; Y[60] = 154001.8361;
    X[61] = 5467; Y[61] = 154001.8361;
    X[62] = 4387; Y[62] = 154001.8361;
    X[63] = 2947; Y[63] = 153641.8361;
    X[64] = 1507; Y[64] = 153281.8361;
    X[65] = 0; Y[65] = 152561.8361;
    X[66] = 1147; Y[66] = 143673.8361;
    X[67] = 4770; Y[67] = 143673.8361;
    X[68] = 4927; Y[68] = 146058.8361;
    X[69] = 5782; Y[69] = 147420.8361;
    X[70] = 6637; Y[70] = 148781.8361;
    X[71] = 8775; Y[71] = 148781.8361;
    X[72] = 13365; Y[72] = 148781.8361;
    X[73] = 16886; Y[73] = 138791.8361;
    X[74] = 20407; Y[74] = 128801.8361;
    X[75] = 20407; Y[75] = 92891.8361;
    X[76] = 20407; Y[76] = 88008.8361;
    X[77] = 20984.6875; Y[77] = 76865.91805;
    X[78] = 21562.375; Y[78] = 65723;



    return {X: X , Y: Y};
}
_old_CContourIntegral.prototype.old_drawPath = function(XX, YY)
{
    /*MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );*/

    XX[9] = XX[59] = (XX[9] + XX[59])/2;
    YY[9] = YY[59] = (YY[9] + YY[59])/2;

    XX[25] = XX[43] = (XX[43] + XX[25])/2;
    YY[25] = YY[43] = (YY[43] + YY[25])/2;

    MathControl.pGraph._m(XX[9], YY[9]);
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );

    /*MathControl.pGraph._c(XX[25], YY[25], XX[26], YY[26], XX[27], YY[27] );
    MathControl.pGraph._c(XX[27], YY[27], XX[28], YY[28], XX[29], YY[29] );
    MathControl.pGraph._c(XX[29], YY[29], XX[30], YY[30], XX[31], YY[31] );
    MathControl.pGraph._c(XX[31], YY[31], XX[32], YY[32], XX[33], YY[33] );
    MathControl.pGraph._l(XX[34], YY[34]);
    MathControl.pGraph._l(XX[35], YY[35]);
    MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );
    MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
    MathControl.pGraph._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41] );
    MathControl.pGraph._c(XX[41], YY[41], XX[42], YY[42], XX[43], YY[43] );*/

    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );

    /*MathControl.pGraph._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61] );
    MathControl.pGraph._c(XX[61], YY[61], XX[62], YY[62], XX[63], YY[63] );
    MathControl.pGraph._c(XX[63], YY[63], XX[64], YY[64], XX[65], YY[65] );
    MathControl.pGraph._c(XX[65], YY[65], XX[66], YY[66], XX[67], YY[67] );
    MathControl.pGraph._l(XX[68], YY[68]);*/
    MathControl.pGraph.ds();

    //MathControl.pGraph.b_color1(255, 255, 255, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[69], YY[69]);
    MathControl.pGraph._c(XX[69], YY[69], XX[70], YY[70], XX[71], YY[71] );
    MathControl.pGraph._c(XX[71], YY[71], XX[72], YY[72], XX[73], YY[73] );
    MathControl.pGraph._c(XX[73], YY[73], XX[74], YY[74], XX[75], YY[75] );
    MathControl.pGraph._c(XX[75], YY[75], XX[76], YY[76], XX[77], YY[77] );
    MathControl.pGraph._c(XX[77], YY[77], XX[78], YY[78], XX[79], YY[79] );
    MathControl.pGraph._c(XX[79], YY[79], XX[80], YY[80], XX[81], YY[81] );
    //MathControl.pGraph._c(XX[81], YY[81], XX[82], YY[82], XX[83], YY[83] );
    //MathControl.pGraph._c(XX[83], YY[83], XX[84], YY[84], XX[85], YY[85] );
    //MathControl.pGraph._c(XX[85], YY[85], XX[86], YY[86], XX[87], YY[87] );
    //MathControl.pGraph._c(XX[87], YY[87], XX[88], YY[88], XX[89], YY[89] );
    //MathControl.pGraph.ds();

    //MathControl.pGraph._s();
    //MathControl.pGraph._m(XX[90], YY[90]);
    MathControl.pGraph._c(XX[90], YY[90], XX[91], YY[91], XX[92], YY[92] );
    MathControl.pGraph._c(XX[92], YY[92], XX[93], YY[93], XX[94], YY[94] );
    MathControl.pGraph._c(XX[94], YY[94], XX[95], YY[95], XX[96], YY[96] );
    MathControl.pGraph._c(XX[96], YY[96], XX[97], YY[97], XX[98], YY[98] );
    MathControl.pGraph._c(XX[98], YY[98], XX[99], YY[99], XX[100], YY[100] );
    MathControl.pGraph._c(XX[100], YY[100], XX[101], YY[101], XX[102], YY[102] );
    MathControl.pGraph._c(XX[102], YY[102], XX[103], YY[103], XX[104], YY[104] );
    /*MathControl.pGraph._c(XX[104], YY[104], XX[105], YY[105], XX[106], YY[106] );
    MathControl.pGraph._c(XX[106], YY[106], XX[107], YY[107], XX[108], YY[108] );
    MathControl.pGraph._c(XX[108], YY[108], XX[109], YY[109], XX[110], YY[110] );*/
    MathControl.pGraph.ds();

}
_old_CContourIntegral.prototype.calculate_drawPath = function(XX, YY)
{
    XX[9] = XX[59] = (XX[9] + XX[59])/2;
    YY[9] = YY[59] = (YY[9] + YY[59])/2;

    XX[25] = XX[43] = (XX[43] + XX[25])/2;
    YY[25] = YY[43] = (YY[43] + YY[25])/2;

    MathControl.pGraph._m(XX[9], YY[9]);
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );

    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );



    MathControl.pGraph.df();

    var max_x = 0, max_y = 0,
        min_x = 100000, min_y = 100000;

    for(var i = 0; i < XX.length; i++)
    {
        min_x = XX[i] < min_x ? XX[i] : min_x;
        max_x = XX[i] > max_x ? XX[i] : max_x;

        min_y = YY[i] < min_y ? YY[i] : min_y;
        max_y = YY[i] > max_y ? YY[i] : max_y;
    }

    for(var i = 9; i < 26; i++)
    {
        XX[i] = min_x + (max_x - min_x)*0.1 + (XX[i] - min_x)*0.8;
        YY[i] = min_y + (max_y - min_y)*0.1  + (YY[i] - min_y)*0.8;
    }

    for(var i = 43; i < 60; i++)
    {
        XX[i] = min_x + (max_x - min_x)*0.1  + (XX[i] - min_x)*0.8;
        YY[i] = min_y + (max_y - min_y)*0.1  + (YY[i] - min_y)*0.8;
    }


    MathControl.pGraph.b_color1(255, 255, 255, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[9], YY[9]);
    MathControl.pGraph._c(XX[9], YY[9], XX[10], YY[10], XX[11], YY[11] );
    MathControl.pGraph._c(XX[11], YY[11], XX[12], YY[12], XX[13], YY[13] );
    MathControl.pGraph._c(XX[13], YY[13], XX[14], YY[14], XX[15], YY[15] );
    MathControl.pGraph._c(XX[15], YY[15], XX[16], YY[16], XX[17], YY[17] );
    MathControl.pGraph._c(XX[17], YY[17], XX[18], YY[18], XX[19], YY[19] );
    MathControl.pGraph._c(XX[19], YY[19], XX[20], YY[20], XX[21], YY[21] );
    MathControl.pGraph._c(XX[21], YY[21], XX[22], YY[22], XX[23], YY[23] );
    MathControl.pGraph._c(XX[23], YY[23], XX[24], YY[24], XX[25], YY[25] );


    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );

    CIntegral.superclass.draw(this);

}
_old_CContourIntegral.prototype.drawPath = function(XX, YY)
{

    MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._c(XX[0], YY[0], XX[1], YY[1], XX[2], YY[2]); 
    MathControl.pGraph._c(XX[2], YY[2], XX[3], YY[3], XX[4], YY[4]); 
    MathControl.pGraph._c(XX[4], YY[4], XX[5], YY[5], XX[6], YY[6]); 
    MathControl.pGraph._c(XX[6], YY[6], XX[7], YY[7], XX[8], YY[8]); 
    MathControl.pGraph._c(XX[8], YY[8], XX[9], YY[9], XX[10], YY[10]); 
    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12]); 
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14]); 
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16]);
    MathControl.pGraph.df();

    MathControl.pGraph.b_color1(255, 255, 255, 255);
    MathControl.pGraph._s();
    MathControl.pGraph._m(XX[16], YY[16]);
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18]); 
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20]); 
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22]); 
    MathControl.pGraph._c(XX[22], YY[22], XX[23], YY[23], XX[24], YY[24]); 
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26]); 
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28]); 
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30]); 
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32]); 
    MathControl.pGraph._c(XX[32], YY[32], XX[33], YY[33], XX[34], YY[34]);
}

function CContourIntegral()
{
    CNaryOperator.call(this);
}
extend(CContourIntegral, CNaryOperator);
CContourIntegral.prototype.draw = function()
{
    var circle = new CCircle();
    var coord = circle.getCoord();

    var X = coord.X,
        Y = coord.Y,
        W = coord.W,
        H = coord.H;

    var integr = new CIntegral();
    coord2 = integr.getCoord();
    
    var XX = coord2.X,
        YY = coord2.Y,
        WW = coord2.W,
        HH = coord2.H;

    var textScale =  this.Parent.getTxtPrp().FontSize/850;// 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры

    var shX = (WW - W)*alpha/2,
        shY = (HH - H)*alpha*0.48;


    for(var i = 0; i < X.length; i++)
    {
        X[i] = this.pos.x + shX + X[i]*alpha;
        Y[i] = this.pos.y + shY + Y[i]*alpha;
    }


    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = this.pos.x + XX[i]*alpha;
        YY[i] = this.pos.y + YY[i]*alpha;
    }


    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(750);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);

    circle.drawPath(X, Y);

    MathControl.pGraph.p_width(1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    integr.drawPath(XX, YY);

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);


}
CContourIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width =  8.624*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}


function old_CSurfaceIntegral()
{
    CNaryOperator.call(this);
}
extend(old_CSurfaceIntegral, CNaryOperator);
old_CSurfaceIntegral.prototype.draw = function()
{
    var XX = new Array(),
        YY = new Array();

    XX[0] = 42579; YY[0] = 9454;
    XX[1] = 38281; YY[1] = 9454;
    XX[2] = 37947; YY[2] = 7622;
    XX[3] = 36946; YY[3] = 6436;
    XX[4] = 35945; YY[4] = 5249;
    XX[5] = 34276; YY[5] = 5249;
    XX[6] = 29811; YY[6] = 5249;
    XX[7] = 28393; YY[7] = 12493;
    XX[8] = 27684; YY[8] = 16157;
    XX[9] = 27350; YY[9] = 24692;
    XX[10] = 28060; YY[10] = 24567;
    XX[11] = 31605; YY[11] = 24192;
    XX[12] = 35402; YY[12] = 24192;
    XX[13] = 40825; YY[13] = 24192;
    XX[14] = 45789; YY[14] = 25025;
    XX[15] = 46790; YY[15] = 17446;
    XX[16] = 48457; YY[16] = 12367;
    XX[17] = 52584; YY[17] = 0;
    XX[18] = 62715; YY[18] = 0;
    XX[19] = 64174; YY[19] = 0;
    XX[20] = 65946; YY[20] = 396;
    XX[21] = 67718; YY[21] = 792;
    XX[22] = 68968; YY[22] = 1375;
    XX[23] = 68468; YY[23] = 9454;
    XX[24] = 64177; YY[24] = 9454;
    XX[25] = 63843; YY[25] = 7622;
    XX[26] = 62841; YY[26] = 6436;
    XX[27] = 61840; YY[27] = 5249;
    XX[28] = 60172; YY[28] = 5249;
    XX[29] = 55707; YY[29] = 5249;
    XX[30] = 54288; YY[30] = 12493;
    XX[31] = 53537; YY[31] = 16532;
    XX[32] = 53163; YY[32] = 26399;
    XX[33] = 53454; YY[33] = 26441;
    XX[34] = 57124; YY[34] = 27566;
    XX[35] = 61023; YY[35] = 29754;
    XX[36] = 64922; YY[36] = 31941;
    XX[37] = 67674; YY[37] = 36253;
    XX[38] = 70426; YY[38] = 40565;
    XX[39] = 70426; YY[39] = 46814;
    XX[40] = 70426; YY[40] = 53147;
    XX[41] = 67674; YY[41] = 57460;
    XX[42] = 64922; YY[42] = 61772;
    XX[43] = 60377; YY[43] = 64313;
    XX[44] = 56374; YY[44] = 66563;
    XX[45] = 51579; YY[45] = 67729;
    XX[46] = 50578; YY[46] = 74520;
    XX[47] = 48951; YY[47] = 79728;
    XX[48] = 45032; YY[48] = 92352;
    XX[49] = 35066; YY[49] = 92352;
    XX[50] = 33064; YY[50] = 92352;
    XX[51] = 31562; YY[51] = 92019;
    XX[52] = 30061; YY[52] = 91686;
    XX[53] = 28644; YY[53] = 90936;
    XX[54] = 29185; YY[54] = 82735;
    XX[55] = 33108; YY[55] = 82735;
    XX[56] = 33650; YY[56] = 84732;
    XX[57] = 34714; YY[57] = 86022;
    XX[58] = 35778; YY[58] = 87312;
    XX[59] = 37739; YY[59] = 87312;
    XX[60] = 42120; YY[60] = 87312;
    XX[61] = 43246; YY[61] = 78241;
    XX[62] = 43706; YY[62] = 74413;
    XX[63] = 43997; YY[63] = 69087;
    XX[64] = 38657; YY[64] = 69504;
    XX[65] = 35403; YY[65] = 69504;
    XX[66] = 30898; YY[66] = 69504;
    XX[67] = 25475; YY[67] = 68962;
    XX[68] = 24559; YY[68] = 74956;
    XX[69] = 23061; YY[69] = 79741;
    XX[70] = 19148; YY[70] = 92352;
    XX[71] = 9201; YY[71] = 92352;
    XX[72] = 7203; YY[72] = 92352;
    XX[73] = 5704; YY[73] = 92019;
    XX[74] = 4206; YY[74] = 91686;
    XX[75] = 2791; YY[75] = 90936;
    XX[76] = 3333; YY[76] = 82735;
    XX[77] = 7245; YY[77] = 82735;
    XX[78] = 7786; YY[78] = 84732;
    XX[79] = 8847; YY[79] = 86022;
    XX[80] = 9908; YY[80] = 87312;
    XX[81] = 11863; YY[81] = 87312;
    XX[82] = 16231; YY[82] = 87312;
    XX[83] = 17355; YY[83] = 78241;
    XX[84] = 17895; YY[84] = 73913;
    XX[85] = 18187; YY[85] = 67588;
    XX[86] = 13235; YY[86] = 66171;
    XX[87] = 10238; YY[87] = 64546;
    XX[88] = 7200; YY[88] = 62880;
    XX[89] = 4869; YY[89] = 60380;
    XX[90] = 2539; YY[90] = 57879;
    XX[91] = 1269; YY[91] = 54504;
    XX[92] = 0; YY[92] = 51129;
    XX[93] = 0; YY[93] = 46920;
    XX[94] = 0; YY[94] = 40670;
    XX[95] = 2812; YY[95] = 36336;
    XX[96] = 5625; YY[96] = 32002;
    XX[97] = 10124; YY[97] = 29460;
    XX[98] = 14457; YY[98] = 27043;
    XX[99] = 19790; YY[99] = 25835;
    XX[100] = 20831; YY[100] = 17710;
    XX[101] = 22581; YY[101] = 12376;
    XX[102] = 26706; YY[102] = 0;
    XX[103] = 36829; YY[103] = 0;
    XX[104] = 38287; YY[104] = 0;
    XX[105] = 40058; YY[105] = 396;
    XX[106] = 41829; YY[106] = 792;
    XX[107] = 43079; YY[107] = 1375;
    XX[108] = 42579; YY[108] = 9454;
    XX[109] = 35320; YY[109] = 64672;
    XX[110] = 38742; YY[110] = 64672;
    XX[111] = 44165; YY[111] = 64339;
    XX[112] = 44373; YY[112] = 58752;
    XX[113] = 44373; YY[113] = 51831;
    XX[114] = 44373; YY[114] = 39364;
    XX[115] = 45206; YY[115] = 30066;
    XX[116] = 45206; YY[116] = 29899;
    XX[117] = 45206; YY[117] = 29774;
    XX[118] = 39449; YY[118] = 29065;
    XX[119] = 35319; YY[119] = 29065;
    XX[120] = 31606; YY[120] = 29065;
    XX[121] = 27184; YY[121] = 29399;
    XX[122] = 27017; YY[122] = 36320;
    XX[123] = 27017; YY[123] = 45617;
    XX[124] = 27017; YY[124] = 55958;
    XX[125] = 26100; YY[125] = 64213;
    XX[126] = 30481; YY[126] = 64672;
    XX[127] = 35320; YY[127] = 64672;
    XX[128] = 5082; YY[128] = 46910;
    XX[129] = 5082; YY[129] = 52121;
    XX[130] = 7620; YY[130] = 55916;
    XX[131] = 10116; YY[131] = 59543;
    XX[132] = 18311; YY[132] = 62754;
    XX[133] = 18478; YY[133] = 57792;
    XX[134] = 18478; YY[134] = 51830;
    XX[135] = 18478; YY[135] = 39905;
    XX[136] = 19269; YY[136] = 30816;
    XX[137] = 16357; YY[137] = 31608;
    XX[138] = 13195; YY[138] = 33192;
    XX[139] = 9867; YY[139] = 34861;
    XX[140] = 7474; YY[140] = 38301;
    XX[141] = 5082; YY[141] = 41740;
    XX[142] = 5082; YY[142] = 46910;
    XX[143] = 65178; YY[143] = 46869;
    XX[144] = 65178; YY[144] = 40698;
    XX[145] = 61632; YY[145] = 36862;
    XX[146] = 58294; YY[146] = 33192;
    XX[147] = 53038; YY[147] = 31775;
    XX[148] = 52913; YY[148] = 37863;
    XX[149] = 52913; YY[149] = 45618;
    XX[150] = 52913; YY[150] = 55040;
    XX[151] = 52163; YY[151] = 62712;
    XX[152] = 57169; YY[152] = 61336;
    XX[153] = 60923; YY[153] = 57667;
    XX[154] = 65178; YY[154] = 53498;
    XX[155] = 65178; YY[155] = 46869;


    var textScale = this.params.font.FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры


    XX[15] = (XX[33] + XX[14])/2;
    XX[46] = (XX[45] + XX[63])/2;
    XX[68] = (XX[67] + XX[85])/2;
    XX[100] = (XX[99] + XX[10])/2;

    YY[15] = (YY[33] + YY[14])/2;
    YY[46] = (YY[45] + YY[63])/2;
    YY[68] = (YY[67] + YY[85])/2;
    YY[100] = (YY[99] + YY[10])/2;


    for(var i = 0; i < XX.length; i++)
    {
        XX[i] =  XX[i]*alpha;
        YY[i] =  YY[i]*alpha;
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);
    MathControl.pGraph.p_width(1000);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();

    // верхний значок интеграла (начало)
     /*MathControl.pGraph._m(XX[0], YY[0]);
     MathControl.pGraph._l(XX[1], YY[1]);

     MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );

     MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
     MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
     MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );*/

     // колечко начинается

    for(var i = 0; i < 42; i = i+2)
    {
        var k1 = i,
            k2 = i+1,
            k3 = i+2;

        var str = "MathControl.pGraph._c(XX["+k1+"], YY["+k1+"], XX["+k2+"], YY["+k2+"], XX["+k3+"], YY["+k3+"] );";
        console.log(str);
    }



     MathControl.pGraph._m(XX[10], YY[10]);
     MathControl.pGraph._l(XX[10], YY[10]);
     MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
     MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] );

     MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[33], YY[33] );

    for(var i = 10; i < 16; i++)
    {
        var k = i - 10;
        var xx = Math.round(XX[i]*100/alpha)/100;
        var yy = YY[i]/alpha;
        var str = "X[" + k + "] = " + xx + "; Y[" + k + "] = " + yy + ";";
        console.log(str);
    }


     /////

     // верхний значок интеграла
     //MathControl.pGraph._m(XX[14], YY[14]);
     /*MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] );
     MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] );
     MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20] );
     MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] );

     MathControl.pGraph._l(XX[23], YY[23]);
     MathControl.pGraph._l(XX[24], YY[24]);
     MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] );
     MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] );
     MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
     MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
     MathControl.pGraph._l(XX[33], YY[33]);


     MathControl.pGraph._l(XX[14], YY[14]);*/
     //////

     // колечко продолжается

     MathControl.pGraph._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35] );
     MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );
     MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
     MathControl.pGraph._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41] );
     MathControl.pGraph._c(XX[41], YY[41], XX[42], YY[42], XX[43], YY[43] );
     MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );

     MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[63], YY[63] );

    for(var i = 33; i < 47;  i++)
    {
        var k = i - 27;
        var xx = Math.round(XX[i]*100/alpha)/100;
        var yy = Math.round(YY[i]*100/alpha)/100;
        var str = "X[" + k + "] = " + xx + "; Y[" + k + "] = " + yy + ";";
        console.log(str);
    }


    // нижний значок интеграла
    /*MathControl.pGraph._m(XX[45], YY[45]);

    MathControl.pGraph._c(XX[45], YY[45], XX[46], YY[46], XX[47], YY[47] );
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._l(XX[54], YY[54]);
    MathControl.pGraph._l(XX[55], YY[55]);
    MathControl.pGraph._c(XX[55], YY[55], XX[56], YY[56], XX[57], YY[57] );
    MathControl.pGraph._c(XX[57], YY[57], XX[58], YY[58], XX[59], YY[59] );
    MathControl.pGraph._c(XX[59], YY[59], XX[60], YY[60], XX[61], YY[61] );
    MathControl.pGraph._c(XX[61], YY[61], XX[62], YY[62], XX[63], YY[63] );

    MathControl.pGraph._l(XX[45], YY[45]);*/
    //////


    // колечко продолжается

    MathControl.pGraph._c(XX[63], YY[63], XX[64], YY[64], XX[65], YY[65] );
    MathControl.pGraph._c(XX[65], YY[65], XX[66], YY[66], XX[67], YY[67] );

    MathControl.pGraph._c(XX[67], YY[67], XX[68], YY[68], XX[85], YY[85] );

    for(var i = 63; i < 69;  i++)
    {
        var k = i - 43;
        var xx = Math.round(XX[i]*100/alpha)/100;
        var yy = Math.round(YY[i]*100/alpha)/100;
        var str = "X[" + k + "] = " + xx + "; Y[" + k + "] = " + yy + ";";
        console.log(str);
    }


    //////

    // нижний значок интеграла
    /*MathControl.pGraph._m(XX[67], YY[67]);
    MathControl.pGraph._c(XX[67], YY[67], XX[68], YY[68], XX[69], YY[69] );
    MathControl.pGraph._c(XX[69], YY[69], XX[70], YY[70], XX[71], YY[71] );
    MathControl.pGraph._c(XX[71], YY[71], XX[72], YY[72], XX[73], YY[73] );
    MathControl.pGraph._c(XX[73], YY[73], XX[74], YY[74], XX[75], YY[75] );
    MathControl.pGraph._l(XX[76], YY[76]);
    MathControl.pGraph._l(XX[77], YY[77]);
    MathControl.pGraph._c(XX[77], YY[77], XX[78], YY[78], XX[79], YY[79] );
    MathControl.pGraph._c(XX[79], YY[79], XX[80], YY[80], XX[81], YY[81] );
    MathControl.pGraph._c(XX[81], YY[81], XX[82], YY[82], XX[83], YY[83] );
    MathControl.pGraph._c(XX[83], YY[83], XX[84], YY[84], XX[85], YY[85] );*/

    //////

    // колечко продолжается

    MathControl.pGraph._c(XX[85], YY[85], XX[86], YY[86], XX[87], YY[87] );
    MathControl.pGraph._c(XX[87], YY[87], XX[88], YY[88], XX[89], YY[89] );
    MathControl.pGraph._c(XX[89], YY[89], XX[90], YY[90], XX[91], YY[91] );
    MathControl.pGraph._c(XX[91], YY[91], XX[92], YY[92], XX[93], YY[93] );
    MathControl.pGraph._c(XX[93], YY[93], XX[94], YY[94], XX[95], YY[95] );
    MathControl.pGraph._c(XX[95], YY[95], XX[96], YY[96], XX[97], YY[97] );
    MathControl.pGraph._c(XX[97], YY[97], XX[98], YY[98], XX[99], YY[99] );

    MathControl.pGraph._c(XX[99], YY[99], XX[100], YY[100], XX[10], YY[10] );


    for(var i = 85; i < 101; i++)
    {
        var k = i - 59;
        var xx = Math.round(XX[i]*100/alpha)/100;
        var yy = Math.round(YY[i]*100/alpha)/100;
        var str = "X[" + k + "] = " + xx + "; Y[" + k + "] = " + yy + ";";
        console.log(str);
    }

    var xx = Math.round(XX[10]*100/alpha)/100;
    var yy = Math.round(YY[10]*100/alpha)/100;
    var str = "X[42] = " + xx + "; Y[42] = " + yy + ";";
    console.log(str);



    //MathControl.pGraph._l(XX[10], YY[10]);

     //////

    // верхний значок интеграла (продолжение)
    /*MathControl.pGraph._c(XX[99], YY[99], XX[100], YY[100], XX[101], YY[101] );
    MathControl.pGraph._c(XX[101], YY[101], XX[102], YY[102], XX[103], YY[103] );
    MathControl.pGraph._c(XX[103], YY[103], XX[104], YY[104], XX[105], YY[105] );
    MathControl.pGraph._c(XX[105], YY[105], XX[106], YY[106], XX[107], YY[107] );
    MathControl.pGraph._l(XX[108], YY[108]);*/


    /*MathControl.pGraph._m(XX[109], YY[109]);
    MathControl.pGraph._c(XX[109], YY[109], XX[110], YY[110], XX[111], YY[111] );
    MathControl.pGraph._c(XX[111], YY[111], XX[112], YY[112], XX[113], YY[113] );
    MathControl.pGraph._c(XX[113], YY[113], XX[114], YY[114], XX[115], YY[115] );
    MathControl.pGraph._c(XX[115], YY[115], XX[116], YY[116], XX[117], YY[117] );
    MathControl.pGraph._c(XX[117], YY[117], XX[118], YY[118], XX[119], YY[119] );
    MathControl.pGraph._c(XX[119], YY[119], XX[120], YY[120], XX[121], YY[121] );
    MathControl.pGraph._c(XX[121], YY[121], XX[122], YY[122], XX[123], YY[123] );
    MathControl.pGraph._c(XX[123], YY[123], XX[124], YY[124], XX[125], YY[125] );
    MathControl.pGraph._c(XX[125], YY[125], XX[126], YY[126], XX[127], YY[127] );

    MathControl.pGraph._m(XX[128], YY[128]);
    MathControl.pGraph._c(XX[128], YY[128], XX[129], YY[129], XX[130], YY[130] );
    MathControl.pGraph._c(XX[130], YY[130], XX[131], YY[131], XX[132], YY[132] );
    MathControl.pGraph._c(XX[132], YY[132], XX[133], YY[133], XX[134], YY[134] );
    MathControl.pGraph._c(XX[134], YY[134], XX[135], YY[135], XX[136], YY[136] );
    MathControl.pGraph._c(XX[136], YY[136], XX[137], YY[137], XX[138], YY[138] );
    MathControl.pGraph._c(XX[138], YY[138], XX[139], YY[139], XX[140], YY[140] );
    MathControl.pGraph._c(XX[140], YY[140], XX[141], YY[141], XX[142], YY[142] );

    MathControl.pGraph._m(XX[143], YY[143]);
    MathControl.pGraph._c(XX[143], YY[143], XX[144], YY[144], XX[145], YY[145] );
    MathControl.pGraph._c(XX[145], YY[145], XX[146], YY[146], XX[147], YY[147] );
    MathControl.pGraph._c(XX[147], YY[147], XX[148], YY[148], XX[149], YY[149] );
    MathControl.pGraph._c(XX[149], YY[149], XX[150], YY[150], XX[151], YY[151] );
    MathControl.pGraph._c(XX[151], YY[151], XX[152], YY[152], XX[153], YY[153] );
    MathControl.pGraph._c(XX[153], YY[153], XX[154], YY[154], XX[155], YY[155] );*/



    MathControl.pGraph.ds();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
old_CSurfaceIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.params.font.FontSize/36;

    var _width =  8.624*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}


function CSurfaceIntegral()
{
    CNaryOperator.call(this);
}
extend(CSurfaceIntegral, CNaryOperator);
CSurfaceIntegral.prototype.draw = function()
{
    var surf = new CSurface();
    var coord = surf.getCoord();

    var X = coord.X,
        Y = coord.Y,
        W = coord.W,
        H = coord.H;

    var integr = new CDoubleIntegral();
    coord2 = integr.getCoord();

    var XX = coord2.X,
        YY = coord2.Y,
        WW = 1.6*coord2.W,
        HH = coord2.H;


    var textScale =  this.Parent.getTxtPrp().FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры


    var shX = (WW - W)*alpha/2,
        shY = (HH - H)*alpha*0.48;


    for(var i = 0; i < X.length; i++)
    {
        X[i] = this.pos.x + shX + X[i]*alpha;
        Y[i] = this.pos.y + shY + Y[i]*alpha;
    }



    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = this.pos.x + XX[i]*alpha;
        YY[i] = this.pos.y + YY[i]*alpha;
    }


    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(750);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);

    surf.drawPath(X, Y);

    MathControl.pGraph.p_width(1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    integr.drawPath(XX, YY);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CSurfaceIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width =  14.2296*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}

function old_CVolumeIntegral()
{
    CNaryOperator.call(this);
}
extend(old_CVolumeIntegral, CNaryOperator);
old_CVolumeIntegral.prototype.draw = function()
{
    var textScale = this.params.font.FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры

    var X = new Array(),
        Y = new Array();

    X[0] = 34850; Y[0] = 8038;
    X[1] = 31195; Y[1] = 8038;
    X[2] = 30910; Y[2] = 6480;
    X[3] = 30058; Y[3] = 5471;
    X[4] = 29207; Y[4] = 4462;
    X[5] = 27787; Y[5] = 4462;
    X[6] = 23989; Y[6] = 4462;
    X[7] = 22782; Y[7] = 10625;
    X[8] = 22143; Y[8] = 14026;
    X[9] = 21824; Y[9] = 22281;
    X[10] = 22427; Y[10] = 22138;
    X[11] = 24095; Y[11] = 21818;
    X[12] = 28531; Y[12] = 21213;
    X[13] = 32718; Y[13] = 20643;
    X[14] = 40064; Y[14] = 20537;
    X[15] = 40879; Y[15] = 14589;
    X[16] = 42224; Y[16] = 10517;
    X[17] = 45728; Y[17] = 0;
    X[18] = 54331; Y[18] = 0;
    X[19] = 55570; Y[19] = 0;
    X[20] = 57074; Y[20] = 337;
    X[21] = 58579; Y[21] = 673;
    X[22] = 59641; Y[22] = 1169;
    X[23] = 59216; Y[23] = 8038;
    X[24] = 55570; Y[24] = 8038;
    X[25] = 55287; Y[25] = 6480;
    X[26] = 54437; Y[26] = 5471;
    X[27] = 53587; Y[27] = 4462;
    X[28] = 52172; Y[28] = 4462;
    X[29] = 48385; Y[29] = 4462;
    X[30] = 47181; Y[30] = 10628;
    X[31] = 46614; Y[31] = 13676;
    X[32] = 46296; Y[32] = 20658;
    X[33] = 47358; Y[33] = 20658;
    X[34] = 53199; Y[34] = 20871;
    X[35] = 57553; Y[35] = 21470;
    X[36] = 61411; Y[36] = 21963;
    X[37] = 64137; Y[37] = 22598;
    X[38] = 65021; Y[38] = 15265;
    X[39] = 66574; Y[39] = 10520;
    X[40] = 70072; Y[40] = 0;
    X[41] = 78655; Y[41] = 0;
    X[42] = 79892; Y[42] = 0;
    X[43] = 81393; Y[43] = 337;
    X[44] = 82894; Y[44] = 673;
    X[45] = 83953; Y[45] = 1169;
    X[46] = 83528; Y[46] = 8038;
    X[47] = 79882; Y[47] = 8038;
    X[48] = 79599; Y[48] = 6480;
    X[49] = 78754; Y[49] = 5471;
    X[50] = 77909; Y[50] = 4462;
    X[51] = 76500; Y[51] = 4462;
    X[52] = 72729; Y[52] = 4462;
    X[53] = 71531; Y[53] = 10623;
    X[54] = 70792; Y[54] = 14447;
    X[55] = 70509; Y[55] = 24503;
    X[56] = 71355; Y[56] = 24751;
    X[57] = 71497; Y[57] = 24787;
    X[58] = 71602; Y[58] = 24858;
    X[59] = 77002; Y[59] = 27088;
    X[60] = 80584; Y[60] = 30984;
    X[61] = 84166; Y[61] = 34880;
    X[62] = 84166; Y[62] = 39943;
    X[63] = 84166; Y[63] = 45538;
    X[64] = 80683; Y[64] = 49380;
    X[65] = 77201; Y[65] = 53222;
    X[66] = 73807; Y[66] = 54674;
    X[67] = 70907; Y[67] = 55949;
    X[68] = 69352; Y[68] = 56480;
    X[69] = 68503; Y[69] = 62925;
    X[70] = 66982; Y[70] = 67776;
    X[71] = 63659; Y[71] = 78506;
    X[72] = 55209; Y[72] = 78506;
    X[73] = 53513; Y[73] = 78506;
    X[74] = 52239; Y[74] = 78223;
    X[75] = 50966; Y[75] = 77940;
    X[76] = 49764; Y[76] = 77302;
    X[77] = 50225; Y[77] = 70322;
    X[78] = 53552; Y[78] = 70322;
    X[79] = 54012; Y[79] = 72024;
    X[80] = 54914; Y[80] = 73123;
    X[81] = 55817; Y[81] = 74222;
    X[82] = 57481; Y[82] = 74222;
    X[83] = 61198; Y[83] = 74222;
    X[84] = 62154; Y[84] = 66495;
    X[85] = 62579; Y[85] = 63058;
    X[86] = 62826; Y[86] = 58131;
    X[87] = 61764; Y[87] = 58378;
    X[88] = 60207; Y[88] = 58661;
    X[89] = 55994; Y[89] = 59261;
    X[90] = 51852; Y[90] = 59826;
    X[91] = 44490; Y[91] = 59932;
    X[92] = 43745; Y[92] = 64257;
    X[93] = 42646; Y[93] = 67766;
    X[94] = 39313; Y[94] = 78506;
    X[95] = 30837; Y[95] = 78506;
    X[96] = 29134; Y[96] = 78506;
    X[97] = 27857; Y[97] = 78223;
    X[98] = 26581; Y[98] = 77940;
    X[99] = 25375; Y[99] = 77302;
    X[100] = 25835; Y[100] = 70322;
    X[101] = 29172; Y[101] = 70322;
    X[102] = 29634; Y[102] = 72024;
    X[103] = 30539; Y[103] = 73123;
    X[104] = 31444; Y[104] = 74222;
    X[105] = 33113; Y[105] = 74222;
    X[106] = 36839; Y[106] = 74222;
    X[107] = 37797; Y[107] = 66495;
    X[108] = 38152; Y[108] = 63661;
    X[109] = 38365; Y[109] = 59868;
    X[110] = 37548; Y[110] = 59868;
    X[111] = 34213; Y[111] = 59762;
    X[112] = 29919; Y[112] = 59407;
    X[113] = 25696; Y[113] = 59053;
    X[114] = 20408; Y[114] = 57918;
    X[115] = 19595; Y[115] = 63446;
    X[116] = 18250; Y[116] = 67769;
    X[117] = 14926; Y[117] = 78506;
    X[118] = 6473; Y[118] = 78506;
    X[119] = 4776; Y[119] = 78506;
    X[120] = 3502; Y[120] = 78223;
    X[121] = 2229; Y[121] = 77940;
    X[122] = 1026; Y[122] = 77302;
    X[123] = 1487; Y[123] = 70322;
    X[124] = 4814; Y[124] = 70322;
    X[125] = 5273; Y[125] = 72024;
    X[126] = 6174; Y[126] = 73123;
    X[127] = 7075; Y[127] = 74222;
    X[128] = 8736; Y[128] = 74222;
    X[129] = 12446; Y[129] = 74222;
    X[130] = 13400; Y[130] = 66494;
    X[131] = 13894; Y[131] = 62348;
    X[132] = 14142; Y[132] = 56074;
    X[133] = 12870; Y[133] = 55684;
    X[134] = 12657; Y[134] = 55614;
    X[135] = 12445; Y[135] = 55507;
    X[136] = 8591; Y[136] = 53985;
    X[137] = 5816; Y[137] = 51737;
    X[138] = 3041; Y[138] = 49489;
    X[139] = 1520; Y[139] = 46587;
    X[140] = 0; Y[140] = 43684;
    X[141] = 0; Y[141] = 39932;
    X[142] = 0; Y[142] = 35011;
    X[143] = 3488; Y[143] = 31099;
    X[144] = 6977; Y[144] = 27187;
    X[145] = 12573; Y[145] = 24922;
    X[146] = 13883; Y[146] = 24391;
    X[147] = 15265; Y[147] = 23931;
    X[148] = 16150; Y[148] = 15718;
    X[149] = 17850; Y[149] = 10514;
    X[150] = 21357; Y[150] = 0;
    X[151] = 29962; Y[151] = 0;
    X[152] = 31203; Y[152] = 0;
    X[153] = 32708; Y[153] = 337;
    X[154] = 34213; Y[154] = 673;
    X[155] = 35275; Y[155] = 1169;
    X[156] = 34850; Y[156] = 8038;
    X[157] = 29419; Y[157] = 25215;
    X[158] = 25161; Y[158] = 25643;
    X[159] = 21718; Y[159] = 26251;
    X[160] = 21612; Y[160] = 31700;
    X[161] = 21612; Y[161] = 38777;
    X[162] = 21612; Y[162] = 47127;
    X[163] = 20904; Y[163] = 53886;
    X[164] = 24311; Y[164] = 54735;
    X[165] = 28392; Y[165] = 55159;
    X[166] = 32509; Y[166] = 55620;
    X[167] = 38542; Y[167] = 55832;
    X[168] = 38754; Y[168] = 50664;
    X[169] = 38754; Y[169] = 44044;
    X[170] = 38754; Y[170] = 32893;
    X[171] = 39569; Y[171] = 24680;
    X[172] = 33678; Y[172] = 24786;
    X[173] = 29419; Y[173] = 25215;
    X[174] = 56207; Y[174] = 55120;
    X[175] = 59039; Y[175] = 54838;
    X[176] = 62968; Y[176] = 54134;
    X[177] = 63110; Y[177] = 49605;
    X[178] = 63110; Y[178] = 44050;
    X[179] = 63110; Y[179] = 34213;
    X[180] = 63712; Y[180] = 26676;
    X[181] = 56986; Y[181] = 25119;
    X[182] = 46154; Y[182] = 24730;
    X[183] = 46012; Y[183] = 30673;
    X[184] = 46012; Y[184] = 38774;
    X[185] = 46012; Y[185] = 48361;
    X[186] = 45092; Y[186] = 55860;
    X[187] = 50933; Y[187] = 55719;
    X[188] = 56207; Y[188] = 55120;
    X[189] = 4355; Y[189] = 39945;
    X[190] = 4355; Y[190] = 44403;
    X[191] = 7004; Y[191] = 47269;
    X[192] = 9548; Y[192] = 50028;
    X[193] = 14247; Y[193] = 52223;
    X[194] = 14354; Y[194] = 48437;
    X[195] = 14354; Y[195] = 44049;
    X[196] = 14354; Y[196] = 35239;
    X[197] = 14849; Y[197] = 28233;
    X[198] = 10362; Y[198] = 29967;
    X[199] = 7394; Y[199] = 32939;
    X[200] = 4355; Y[200] = 35982;
    X[201] = 4355; Y[201] = 39945;
    X[202] = 76956; Y[202] = 47552;
    X[203] = 79811; Y[203] = 44615;
    X[204] = 79811; Y[204] = 39945;
    X[205] = 79846; Y[205] = 33575;
    X[206] = 70439; Y[206] = 29011;
    X[207] = 70368; Y[207] = 33434;
    X[208] = 70368; Y[208] = 38777;
    X[209] = 70368; Y[209] = 46030;
    X[210] = 69837; Y[210] = 52046;
    X[211] = 74278; Y[211] = 50312;
    X[212] = 76956; Y[212] = 47552;


    var XX = new Array(),
        YY = new Array();

    for(var i = 0 ; i < X.length; i++)
    {
        /*XX[i] = this.pos.x + X[i]*alpha;
        YY[i] = this.pos.y + Y[i]*alpha;*/
        XX[i] =  X[i];
        YY[i] =  Y[i];
    }


    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(750);

    MathControl.pGraph.b_color1(0,0,0, 255);
    //MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();

    // integral

    /*MathControl.pGraph._m(XX[0], YY[0]);
    MathControl.pGraph._l(XX[1], YY[1]);
    MathControl.pGraph._c(XX[1], YY[1], XX[2], YY[2], XX[3], YY[3] );
    MathControl.pGraph._c(XX[3], YY[3], XX[4], YY[4], XX[5], YY[5] );
    MathControl.pGraph._c(XX[5], YY[5], XX[6], YY[6], XX[7], YY[7] );
    MathControl.pGraph._c(XX[7], YY[7], XX[8], YY[8], XX[9], YY[9] );
    MathControl.pGraph._l(XX[10], YY[10]);*/

    // кольцо

    MathControl.pGraph._m(XX[10], YY[10]);

    MathControl.pGraph._c(XX[10], YY[10], XX[11], YY[11], XX[12], YY[12] );
    MathControl.pGraph._c(XX[12], YY[12], XX[13], YY[13], XX[14], YY[14] );

    XX[15] = (XX[14]+ XX[33])/2;
    YY[15] = (YY[14]+ YY[33])/2;

    for(var i = 0; i < 6; i++)
    {
        var xx = XX[i+10],
            yy = YY[i+10];

        var str = "X["+i+"] = " + xx + "; Y[" +i+ "] = "+ yy + ";";
        console.log(str);
    }


    // integral

    /*
    MathControl.pGraph._c(XX[14], YY[14], XX[15], YY[15], XX[16], YY[16] );
    MathControl.pGraph._c(XX[16], YY[16], XX[17], YY[17], XX[18], YY[18] );
    MathControl.pGraph._c(XX[18], YY[18], XX[19], YY[19], XX[20], YY[20] );
    MathControl.pGraph._c(XX[20], YY[20], XX[21], YY[21], XX[22], YY[22] );
    MathControl.pGraph._l(XX[23], YY[23]);
    MathControl.pGraph._l(XX[24], YY[24]);
    MathControl.pGraph._c(XX[24], YY[24], XX[25], YY[25], XX[26], YY[26] );
    MathControl.pGraph._c(XX[26], YY[26], XX[27], YY[27], XX[28], YY[28] );
    MathControl.pGraph._c(XX[28], YY[28], XX[29], YY[29], XX[30], YY[30] );
    MathControl.pGraph._c(XX[30], YY[30], XX[31], YY[31], XX[32], YY[32] );
    MathControl.pGraph._l(XX[33], YY[33]);
    */

    // кольцо

    MathControl.pGraph._c(XX[33], YY[33], XX[34], YY[34], XX[35], YY[35] );
    MathControl.pGraph._c(XX[35], YY[35], XX[36], YY[36], XX[37], YY[37] );

    XX[38] = (XX[58]+ XX[37])/2;
    YY[38] = (YY[58]+ YY[37])/2;

    for(var i = 6; i < 12; i++)
    {
        var xx = XX[i+27],
            yy = YY[i+27];

        var str = "X["+i+"] = " + xx + "; Y[" +i+ "] = "+ yy + ";";
        console.log(str);
    }

    // integral

    /*MathControl.pGraph._c(XX[37], YY[37], XX[38], YY[38], XX[39], YY[39] );
    MathControl.pGraph._c(XX[39], YY[39], XX[40], YY[40], XX[41], YY[41] );
    MathControl.pGraph._c(XX[41], YY[41], XX[42], YY[42], XX[43], YY[43] );
    MathControl.pGraph._c(XX[43], YY[43], XX[44], YY[44], XX[45], YY[45] );
    MathControl.pGraph._l(XX[46], YY[46]);
    MathControl.pGraph._l(XX[47], YY[47]);
    MathControl.pGraph._c(XX[47], YY[47], XX[48], YY[48], XX[49], YY[49] );
    MathControl.pGraph._c(XX[49], YY[49], XX[50], YY[50], XX[51], YY[51] );
    MathControl.pGraph._c(XX[51], YY[51], XX[52], YY[52], XX[53], YY[53] );
    MathControl.pGraph._c(XX[53], YY[53], XX[54], YY[54], XX[55], YY[55] );
    MathControl.pGraph._l(XX[56], YY[56]);
    MathControl.pGraph._c(XX[56], YY[56], XX[57], YY[57], XX[58], YY[58] );*/

    //кольцо

    MathControl.pGraph._c(XX[58], YY[58], XX[59], YY[59], XX[60], YY[60] );
    MathControl.pGraph._c(XX[60], YY[60], XX[61], YY[61], XX[62], YY[62] );
    MathControl.pGraph._c(XX[62], YY[62], XX[63], YY[63], XX[64], YY[64] );
    MathControl.pGraph._c(XX[64], YY[64], XX[65], YY[65], XX[66], YY[66] );
    MathControl.pGraph._c(XX[66], YY[66], XX[67], YY[67], XX[68], YY[68] );

    XX[69] = (XX[68]+ XX[87])/2;
    YY[69] = (YY[68]+ YY[87])/2;

    for(var i = 12; i < 24; i++)
    {
        var xx = XX[i+46],
            yy = YY[i+46];

        var str = "X["+i+"] = " + xx + "; Y["+i+ "] = "+ yy + ";";
        console.log(str);
    }

    // integral


    /*MathControl.pGraph._c(XX[68], YY[68], XX[69], YY[69], XX[70], YY[70] );
    MathControl.pGraph._c(XX[70], YY[70], XX[71], YY[71], XX[72], YY[72] );
    MathControl.pGraph._c(XX[72], YY[72], XX[73], YY[73], XX[74], YY[74] );
    MathControl.pGraph._c(XX[74], YY[74], XX[75], YY[75], XX[76], YY[76] );
    MathControl.pGraph._l(XX[77], YY[77]);
    MathControl.pGraph._l(XX[78], YY[78]);
    MathControl.pGraph._c(XX[78], YY[78], XX[79], YY[79], XX[80], YY[80] );
    MathControl.pGraph._c(XX[80], YY[80], XX[81], YY[81], XX[82], YY[82] );
    MathControl.pGraph._c(XX[82], YY[82], XX[83], YY[83], XX[84], YY[84] );
    MathControl.pGraph._c(XX[84], YY[84], XX[85], YY[85], XX[86], YY[86] );
    MathControl.pGraph._l(XX[87], YY[87]);*/

    //кольцо

    MathControl.pGraph._c(XX[87], YY[87], XX[88], YY[88], XX[89], YY[89] );
    MathControl.pGraph._c(XX[89], YY[89], XX[90], YY[90], XX[91], YY[91] );

    XX[92] = (XX[91]+ XX[110])/2;
    YY[92] = (YY[91]+ YY[110])/2;

    for(var i = 24; i < 30; i++)
    {
        var xx = XX[i+63],
            yy = YY[i+63];

        var str = "X["+i+"] = " + xx + "; Y["+i+ "] = "+ yy + ";";
        console.log(str);
    }

    // integral

   /* MathControl.pGraph._c(XX[91], YY[91], XX[92], YY[92], XX[93], YY[93] );
    MathControl.pGraph._c(XX[93], YY[93], XX[94], YY[94], XX[95], YY[95] );
    MathControl.pGraph._c(XX[95], YY[95], XX[96], YY[96], XX[97], YY[97] );
    MathControl.pGraph._c(XX[97], YY[97], XX[98], YY[98], XX[99], YY[99] );
    MathControl.pGraph._l(XX[100], YY[100]);
    MathControl.pGraph._l(XX[101], YY[101]);
    MathControl.pGraph._c(XX[101], YY[101], XX[102], YY[102], XX[103], YY[103] );
    MathControl.pGraph._c(XX[103], YY[103], XX[104], YY[104], XX[105], YY[105] );
    MathControl.pGraph._c(XX[105], YY[105], XX[106], YY[106], XX[107], YY[107] );
    MathControl.pGraph._c(XX[107], YY[107], XX[108], YY[108], XX[109], YY[109] );
    MathControl.pGraph._l(XX[110], YY[110]);*/

    //кольцо

    MathControl.pGraph._c(XX[110], YY[110], XX[111], YY[111], XX[112], YY[112] );
    MathControl.pGraph._c(XX[112], YY[112], XX[113], YY[113], XX[114], YY[114] );


    XX[115] = (XX[133]+ XX[114])/2;
    YY[115] = (YY[133]+ YY[114])/2;

    for(var i = 30; i < 36; i++)
    {
        var xx = XX[i+80],
            yy = YY[i+80];

        var str = "X["+i+"] = " + xx + "; Y["+i+ "] = "+ yy + ";";
        console.log(str);
    }

    // integral

    /*MathControl.pGraph._c(XX[114], YY[114], XX[115], YY[115], XX[116], YY[116] );
    MathControl.pGraph._c(XX[116], YY[116], XX[117], YY[117], XX[118], YY[118] );
    MathControl.pGraph._c(XX[118], YY[118], XX[119], YY[119], XX[120], YY[120] );
    MathControl.pGraph._c(XX[120], YY[120], XX[121], YY[121], XX[122], YY[122] );
    MathControl.pGraph._l(XX[123], YY[123]);
    MathControl.pGraph._l(XX[124], YY[124]);
    MathControl.pGraph._c(XX[124], YY[124], XX[125], YY[125], XX[126], YY[126] );
    MathControl.pGraph._c(XX[126], YY[126], XX[127], YY[127], XX[128], YY[128] );
    MathControl.pGraph._c(XX[128], YY[128], XX[129], YY[129], XX[130], YY[130] );
    MathControl.pGraph._c(XX[130], YY[130], XX[131], YY[131], XX[132], YY[132] );
    MathControl.pGraph._l(XX[133], YY[133]);*/

    //кольцо

    MathControl.pGraph._c(XX[133], YY[133], XX[134], YY[134], XX[135], YY[135] );
    MathControl.pGraph._c(XX[135], YY[135], XX[136], YY[136], XX[137], YY[137] );
    MathControl.pGraph._c(XX[137], YY[137], XX[138], YY[138], XX[139], YY[139] );
    MathControl.pGraph._c(XX[139], YY[139], XX[140], YY[140], XX[141], YY[141] );
    MathControl.pGraph._c(XX[141], YY[141], XX[142], YY[142], XX[143], YY[143] );
    MathControl.pGraph._c(XX[143], YY[143], XX[144], YY[144], XX[145], YY[145] );

    MathControl.pGraph._c(XX[145], YY[145], XX[146], YY[146], XX[10], YY[10] );


    XX[146] = (XX[145]+ XX[10])/2;
    YY[146] = (YY[145]+ YY[10])/2;

    for(var i = 36; i < 50; i++)
    {
        var xx = XX[i+97],
            yy = YY[i+97];

        var str = "X["+i+"] = " + xx + "; Y["+i+ "] = "+ yy + ";";
        console.log(str);
    }

    var str = "X["+50+"] = " + XX[10] + "; Y["+50+ "] = "+ YY[10] + ";";
    console.log(str);

    for(var i = 0; i < 49; i = i+2)
    {
        var k1 = i,
            k2 = i+1,
            k3 = i+2;

        var str = "MathControl.pGraph._c(XX["+k1+"], YY["+k1+"], XX["+k2+"], YY["+k2+"], XX["+k3+"], YY["+k3+"] );";
        console.log(str);
    }

    // integral

    /*MathControl.pGraph._c(XX[145], YY[145], XX[146], YY[146], XX[147], YY[147] );
    MathControl.pGraph._c(XX[147], YY[147], XX[148], YY[148], XX[149], YY[149] );
    MathControl.pGraph._c(XX[149], YY[149], XX[150], YY[150], XX[151], YY[151] );
    MathControl.pGraph._c(XX[151], YY[151], XX[152], YY[152], XX[153], YY[153] );
    MathControl.pGraph._c(XX[153], YY[153], XX[154], YY[154], XX[155], YY[155] );
    MathControl.pGraph._l(XX[156], YY[156]);*/

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}
old_CVolumeIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.params.font.FontSize/36;

    var _width =  14.2296*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}


function CVolumeIntegral()
{
    CNaryOperator.call(this);
}
extend(CVolumeIntegral, CNaryOperator);
CVolumeIntegral.prototype.draw = function()
{
    var volume = new CVolume();
    var coord = volume.getCoord();

    var X = coord.X,
        Y = coord.Y,
        W = coord.W,
        H = coord.H;

    var integr = new CTripleIntegral();
    coord2 = integr.getCoord();

    var XX = coord2.X,
        YY = coord2.Y,
        WW = 2.1*coord2.W,
        HH = coord2.H;


    var textScale =  this.Parent.getTxtPrp().FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры


    var shX = (WW - W)*alpha/2,
        shY = (HH - H)*alpha*0.47;


    for(var i = 0; i < X.length; i++)
    {
        X[i] = this.pos.x + shX + X[i]*alpha;
        Y[i] = this.pos.y + shY + Y[i]*alpha;
    }



    for(var i = 0; i < XX.length; i++)
    {
        XX[i] = this.pos.x + XX[i]*alpha;
        YY[i] = this.pos.y + YY[i]*alpha;
    }


    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(750);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);

    volume.drawPath(X, Y);

    MathControl.pGraph.p_width(1000);
    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph._s();

    integr.drawPath(XX, YY);

    MathControl.pGraph.df();

    MathControl.pGraph.SetIntegerGrid(intGrid);

}
CVolumeIntegral.prototype.calculateSizeGlyph = function()
{
    var betta = this.Parent.getTxtPrp().FontSize/36;

    var _width =  18.925368*betta,
        _height = 13.7*betta;

    this.gap = 0.93*betta;

    var width = _width + this.gap,
        height = 2*_height;

    return {width : width, height : height};
}




function old_CNary(id, OrderType, IterType )
{
    CSubMathBase.call( this,1,2 );
    this.OrderType = OrderType;
    this.IterType = IterType;
    this.id = id;
    //this.NarySymbols =  [0x222B, 0x222C, 0x222D, 0x222E, 0x222F, 0x2230, 0x2211, 0x220F, 0x2210, 0x22C3, 0x22C2, 0x22C1, 0x22C0];
}
extend(old_CNary,CSubMathBase);
old_CNary.prototype.setContent = function()
{
    var oBase = null, oArg = null;

    //переделать здесь, т.к криво для случая когда нет опреаторов : не обрабатывается событие нажатия мыши
    if(this.OrderType == 0 || this.IterType == 0)
        oBase = new CBaseNaryOrder(this.id, this.IterType); // undOvr
    else
        oBase = new CDegree(this.IterType - 1); // вычитаем 1 т.к. параметры инициализации от 0 до 2

    var sign = null;

    if(this.id == 0)
        sign = new CIntegral();
    else if(this.id == 1)
        sign = new CDoubleIntegral();
    else if(this.id == 2)
        sign = new CTripleIntegral();
    else if(this.id == 3)
        sign = new CContourIntegral();
    else if(this.id == 4)
        sign = new CSurfaceIntegral();
    else if(this.id == 5)
        sign = new CVolumeIntegral();
    else if(this.id == 6)
        sign = new CSigma();
    else if(this.id == 7)
        sign = new CProduct();
    else if(this.id == 8)
        sign = new CProduct(-1);
    else if(this.id == 9)
        sign = new CUnion();
    else if(this.id == 10)
        sign = new CUnion(-1);
    else if(this.id == 11)
        sign = new CLogicalOr(1);
    else if(this.id == 12)
        sign = new CLogicalOr(-1);
    else
        return null;

    sign.init(this.params);

    oBase.init(this.params);
    oBase.relate(this);
    oBase.setContent(sign);

    oArg = new CMathContent();
    oArg.init(this.params);
    oArg.relate(this);
    oArg.fillPlaceholders();

    old_CNary.superclass.setContent.call(this, oBase, oArg);
}
old_CNary.prototype.getBase = function()
{
    return this.elements[0][1];
}
old_CNary.prototype.getUpperIterator = function()
{
    return this.elements[0][0].getUpperIterator();
}
old_CNary.prototype.getLowerIterator = function()
{
    return this.elements[0][0].getLowerIterator();
}


function old_CBaseNaryOrder(id, IterType )
{
    if(IterType == 3)
        CMathBase.call(this, 3, 1);
    else if(IterType == 2 || IterType == 1)
        CMathBase.call(this, 2, 1);
    else if(IterType == 0)
        CMathBase.call(this, 1, 1);

    this.id = id;
    //this.PlaceSign = (IterType == 2 || IterType == 0) ? 0  : 1;
    this.IterType = IterType;
}
extend(old_CBaseNaryOrder, CMathBase);
old_CBaseNaryOrder.prototype.setContent =  function()
{
    var fontIter = getTypeDegree(this.params.font);
    var params = Common_CopyObj(this.params);
    params.font = fontIter;

    if(this.IterType == 1) //устанавливаем верхний индекс
    {
        this.elements[0][0].fillPlaceholders();
        this.elements[0][0].relate(this);

        this.elements[1][0] = arguments[0]; // n-арный оператор
        this.elements[1][0].setTopBottonGaps(true, false);

    }
    else if(this.IterType == 2)  //устанавливаем нижний индекс
    {

        this.elements[1][0].fillPlaceholders();
        this.elements[1][0].relate(this);

        this.elements[0][0] = arguments[0]; // n-арный оператор
        this.elements[0][0].setTopBottonGaps(false, true);
    }
    else if(this.IterType == 3)
    {
        this.elements[0][0].fillPlaceholders();
        this.elements[0][0].relate(this);

        this.elements[1][0] = arguments[0]; // n-арный оператор
        this.elements[1][0].setTopBottonGaps(true, true);

        this.elements[2][0].fillPlaceholders();
        this.elements[2][0].relate(this);
    }
    else
    {
        this.elements[0][0] = arguments[0]; // n-арный оператор
        this.elements[0][0].setTopBottonGaps(false, false);
    }

    this.recalculateSize();
}
old_CBaseNaryOrder.prototype.getCenter = function()
{
    var center;

    if(this.IterType == 1 || this.IterType == 3)
        center = this.elements[0][0].size.height + this.elements[1][0].size.center;
    else
        center = this.elements[0][0].size.center;

    return center;
}
old_CBaseNaryOrder.prototype.recalculateSize = function()
{
    old_CBaseNaryOrder.superclass.recalculateSize.call(this);

    var gap = this.params.font.FontSize/36*2.45;
    this.size.width += gap;
}
old_CBaseNaryOrder.prototype.IsJustDraw = function()
{
    return this.IterType == 0; // если только один значок n-арного оператора
}
old_CBaseNaryOrder.prototype.getUpperIterator = function()
{
    return this.elements[0][0];
}
old_CBaseNaryOrder.prototype.getLowerIterator = function()
{
    var iter = null;

    if(this.IterType == 2)
        iter = this.elements[1][0];
    else if(this.IterType == 3)
        iter = this.elements[2][0];

    return iter;
}


function old_CNaryOperator(flip)
{
    this.gap = 0;
    this.bFlip = (flip == -1);

    this.sizeGlyph = null;
    this.gapTop = 0;
    this.gapBotton = 0;
}
old_CNaryOperator.prototype.init = function(params)
{
    this.params = Common_CopyObj(params);
    this.recalculateSize();
}
old_CNaryOperator.prototype.draw = function()
{
    var coord = this.getCoord();

    var X = coord.X,
        Y = coord.Y;

    var XX = new Array(),
        YY = new Array();

    var textScale = this.params.font.FontSize/850; // 1000 pt
    var alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // g_dKoef_px_to_mm = 25.4/96

    var a, b;
    if(this.bFlip)
    {
        a = -1;
        b = this.sizeGlyph.height;
    }
    else
    {
        a = 1;
        b = 0;
    }

    for(var i = 0 ; i < X.length; i++)
    {
        XX[i] = this.pos.x + X[i]*alpha;
        YY[i] = this.pos.y + (a*Y[i]*alpha + b);
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(1000);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();

    this.drawPath(XX,YY);

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
old_CNaryOperator.prototype.IsJustDraw = function()
{
    return true;
}
old_CNaryOperator.prototype.relate = function()
{

}
old_CNaryOperator.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x , y: pos.y + this.gapTop};
}
old_CNaryOperator.prototype.recalculateSize = function()
{
    this.sizeGlyph = this.calculateSizeGlyph();

    var height = this.sizeGlyph.height + this.gapTop + this.gapBotton,
        width =  this.sizeGlyph.width,
        center = this.sizeGlyph.height/2 + this.gapTop;

    this.size = {height: height, width: width, center: center};
}
old_CNaryOperator.prototype.setTopBottonGaps = function(bUp, bDown)
{
    var zetta = this.params.font.FontSize* 25.4/96;

    this.gapTop =    bUp ?  zetta*0.25 : 0;
    this.gapBotton = bDown ? zetta*0.1 : 0;

    this.recalculateSize();
}