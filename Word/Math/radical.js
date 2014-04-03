/*var SIGN_GAP = 0;
var RADICAL_GAP = 0.2513;
var RADICAL_H4  = 1.1715;
var RADICAL_H0 = 0;
var RADICAL_H1  = 0;
var RADICAL_H2 = 0;
var RADICAL_H3 = 0;
var RADICAL_H5 = 0;*/

/*var SIGN_GAP = 0.05;
var RADICAL_GAP = 0.1216;
var RADICAL_H4  = 1.2393;
var RADICAL_H0 = 0;
var RADICAL_H1 = 1.1588;
var RADICAL_H2 = 1.1673;
var RADICAL_H3 = 1.0232;
var RADICAL_H5 = 0;*/

//var SIGN_GAP = 0.05;
//var RADICAL_GAP =  0.1216;

//var GAP_TOP = 0.05;
//var SIGN_GAP = 0.1216;

//var GAP_TOP = 0.01822;
var GAP_TOP = 0.094492;
var SIGN_GAP = 0.077108;

/*var RADICAL_H0 =  0;
var RADICAL_H1 = 0.1589;
var RADICAL_H2 = 0.1674;
var RADICAL_H3 = 0.038;
var RADICAL_H4 = 0.303;
var RADICAL_H5 = 0.2394;*/

var RADICAL_H0 = 1.2;
var RADICAL_H1 = 1.50732421875;
var RADICAL_H2 = 2.8;
var RADICAL_H3 = 4.08;
var RADICAL_H4 = 5.7;
var RADICAL_H5 = 7.15;


/// Gap = 0.2513

function CSignRadical()
{
    this.Parent = null;
    this.pos = null;

    this.size = null;
    this.gapArg = 0;
    this.gapSign = 0;   /// расстояние до значка радикала

    this.measure =
    {
        heightTick:     0,
        widthTick:      0,
        widthSlash:     0,
        bHigh:          false
    };

    //this.sizeTick = null;
    //this.widthSlash = null;
}
CSignRadical.prototype.new_draw = function(x, y, pGraphics)
{
    var txtPrp = this.Parent.getCtrPrp();
    //var txtPrp = this.Parent.getTxtPrp();
    var penW = txtPrp.FontSize*g_dKoef_pt_to_mm*0.042;

    y += this.gapTop + penW/2; // смещаем, для отрисовки верхней линии радикала

    var x1 = this.pos.x + x,
        x2 = x1 + 0.048*txtPrp.FontSize;

    var Height = this.size.height - this.gapTop;

    var y2 = this.pos.y + y + Height - this.measure.heightTick,
        y1 = y2 + 0.0242*txtPrp.FontSize;

    var tg =  0.048/0.0242;
    var tX = tg*0.85*penW,
        tY = 0.92*penW / tg;

    var x3 = x2,
        y3 = y2 - tY;

    //var plH = 9.877777777777776 * txtPrp.FontSize /36;

    var sin = 0.876,
        cos = 0.474;

    var y4 = this.pos.y + y + Height - penW;
    var y5 = y4 + penW/2*cos;

    // 0.048*txtPrp.FontSize + (- penW + this.measure.heightTick  + 0.92*penW / tg )/ tg

    var x4, x5;

    if( !this.measure.bHigh )
    {
        x4 = x3 + (y4-y3)/tg;
        x5 = x4 + penW/2*sin;
    }
    else
    {
        x4 = x1 + this.measure.widthSlash - penW/3*sin;
        x5 = x1 + this.measure.widthSlash;
    }


    var x6 = x1 + this.measure.widthSlash,
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
    pGraphics._m(x4 - penW*0.6*sin, y4 - penW/5);
    pGraphics._l(x5 + penW/3*sin, y4 - penW/5);
    pGraphics.ds();

}
CSignRadical.prototype.draw = function(x, y, pGraphics)
{
    var txtPrp = this.Parent.getCtrPrp();
    //var txtPrp = this.Parent.getTxtPrp();
    var penW = txtPrp.FontSize*g_dKoef_pt_to_mm*0.042;

    y += penW/2 + this.gapSign; // смещаем, для отрисовки верхней линии радикала


    //// Tick for degree ////
    var x1 = this.pos.x + x,
        x2 = x1 + 0.048*txtPrp.FontSize;

    var Height = this.size.height - this.gapSign;

    var y2 = this.pos.y + y + Height - this.measure.heightTick,
        y1 = y2 + 0.0242*txtPrp.FontSize;

    var tg =  0.048/0.0242;
    var tX = tg*0.85*penW,
        tY = 0.92*penW / tg;

    var x3 = x2,
        y3 = y2 - tY;
    //////////////////////

    //// Tick lower ////

    var sin = 0.876,
        cos = 0.474;

    var y4 = this.pos.y + y + Height - penW;
    var y7 = y4 + penW/2*cos;


    var x4, x7;

    if( !this.measure.bHigh )
    {
        x4 = x3 + (y4-y3)/tg;
        x7 = x4 + penW/2*sin;
    }
    else
    {
        x4 = x1 + this.measure.widthSlash - penW/3*sin;
        x7 = x1 + this.measure.widthSlash;
    }

    var x5 = x4 - penW*0.6*sin, y5 = y4 - penW/5,
        x6 = x7 + penW/3*sin,   y6 = y5;

    /////////////////////

    /// Line for argument

    var x8 = x1 + this.measure.widthSlash,
        x9 = this.pos.x + x + this.size.width;

    var y8 = this.pos.y + y,
        y9 = this.pos.y + y;

    /////////////////////


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
    pGraphics._m(x5, y5);
    pGraphics._l(x6, y6);
    pGraphics.ds();


    pGraphics.p_width(penW*1000);
    pGraphics._s();
    pGraphics._m(x7, y7);
    pGraphics._l(x8, y8);
    pGraphics._l(x9, y9);
    pGraphics.ds();


}
CSignRadical.prototype.recalculateSize = function()
{
    var txtPrp = this.Parent.getCtrPrp();
    var sizeArg = this.Parent.getBase().size;

    var height, width;
    var plH = 9.877777777777776 * txtPrp.FontSize/36;

    this.gapArg = txtPrp.FontSize*g_dKoef_pt_to_mm*0.077108; /// расстояние до аргумента
    this.gapSign = txtPrp.FontSize*g_dKoef_pt_to_mm*0.094492; /// расстояние до значка радикала

    var heightArg = sizeArg.height + this.gapArg,
        widthArg  = sizeArg.width;


    //////////  Height  ///////////

    /*var H0 = plH*1.2,
     H1 = plH*1.50732421875,
     H2 = plH*2.760986328125,
     H3 = plH*4.217578125,
     H4 = plH*5.52197265625,
     H5 = plH*7.029296875;*/

    var H0 = plH*1.07,
    //H1 = plH*1.50732421875,
        H1 = plH*1.6234788833214036,
        H2 = plH*2.8,
        H3 = plH*4.08,
        H4 = plH*5.7,
        H5 = plH*7.15;


    /*console.log("heightArg :" + heightArg);
     console.log("plH :" + plH);
     console.log("ShiftCenter: " + shCenter);

     var k1 = heightArg/plH,
     k2 = heightArg/shCenter;

     console.log("heightArg/plH :" + k1);
     console.log("heightArg/shCenter :" + k2);*/

    this.measure.bHigh = false;

    var bDescentArg = sizeArg.height - sizeArg.ascent > 0.4*txtPrp.FontSize/11; // т.к. у нас почему-то для строчных букв "а" и тп descent не нулевой, см метрики в mathText.js

    if(heightArg < H0 && !bDescentArg)
        height = H0*1.12;
    //height = H0*1.058;
    else if( heightArg < H1)
        height = H1*0.9284532335069441;
    //height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3*1.04;
    else if( heightArg < H4 )
        height = H4;
    else if( heightArg < H5 )
        height = H5;
    else
    {
        height = heightArg;
        this.measure.bHigh = true;
    }

    ////////////////////////////////////


    //////////  Size of tick  //////////

    var minHgtRad = plH * 1.130493164,
        maxHgtRad = plH * 7.029296875;

    var minHgtTick = plH*0.6,
        maxHgtTick = 1.2*plH;

    var heightTick, widthSlash,
        gapLeft;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthSlash = plH * 0.67;

        gapLeft = 0.2*plH;
    }
    else
    {
        var H;

        if(heightArg < H1)
        {
            H = H1;
            var zetta = height < H1 ? 0.75 : 0.82;
            widthSlash = plH *zetta;
        }
        else
        {
            H = height;
            widthSlash = plH * 0.8681086138556986;
        }
        var alpha =  (H - minHgtRad)/(2*maxHgtRad);
        heightTick = minHgtTick*(1 + alpha);

        gapLeft = 0.12683105468750022* plH;
    }


    this.measure.widthSlash = widthSlash;

    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.1196002747872799*txtPrp.FontSize;

    //////////////////////////////

    //////////   WidthБ Height  //////////
    width = widthSlash + gapLeft + widthArg;
    height += this.gapSign;
    //////////////////////////////

    this.size = {height: height, width: width};
}
CSignRadical.prototype.old_recalculateSize = function()
{
    var txtPrp = this.Parent.getCtrPrp();
    var sizeArg = this.Parent.getBase().size;

    var height, width;
    var plH = 9.877777777777776 * txtPrp.FontSize/36;

    var SUM = 0.1216 + 0.05;
    SIGN_GAP = SUM - GAP_TOP;


    var gapSign = txtPrp.FontSize*g_dKoef_pt_to_mm*SIGN_GAP,
        heightArg = sizeArg.height + gapSign,
        widthArg  = sizeArg.width;


    this.gapTop = txtPrp.FontSize*g_dKoef_pt_to_mm*GAP_TOP;
    this.gapSign = gapSign;


    //  this.gapTop = txtPrp.FontSize*g_dKoef_pt_to_mm*SIGN_GAP;

    //console.log("Gap sign : " + gapSign);

    /////  height  //////

    /*var H0 = plH*1.2,
        H1 = plH*1.50732421875,
        H2 = plH*2.760986328125,
        H3 = plH*4.217578125,
        H4 = plH*5.52197265625,
        H5 = plH*7.029296875;*/


    var H0 = RADICAL_H0*plH,
        H1 = RADICAL_H1*plH,
        H2 = RADICAL_H2*plH,
        H3 = RADICAL_H3*plH,
        H4 = RADICAL_H4*plH,
        H5 = RADICAL_H5*plH;


    //    RADICAL_GAP =0.1216;
    //    SIGN_GAP  = 0.05;

    /*var H0 = plH*1.0992;
    var H1 = plH*1.56542421875;
    var H2 = plH*2.8275863281249998;
    var H3 = plH*4.154778125;
    var H4 = plH*5.7241726562499995;
    var H5 = plH*7.167896874999999;*/

      /*H0 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
      H1 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
      H2 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
      H3 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
      H4 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
      H5 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;*/

    /*H0 += gapSign;
    H1 += gapSign;
    H2 += gapSign;
    H3 += gapSign;
    H4 += gapSign;
    H5 += gapSign;*/


    this.measure.bHigh = false;

    if( heightArg < H0 )
        height = H0*1.058;
    else if( heightArg < H1 )
        height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3*1.04;
    else if( heightArg < H4 )
        height = H4;
    else if( heightArg < H5 )
        height = H5;
    else
    {
        height = heightArg;
        this.measure.bHigh = true;
    }

    /*if(this.gapTop < g_dKoef_pt_to_mm)
    {

        this.gapTop = g_dKoef_pt_to_mm;
        height += g_dKoef_pt_to_mm;

    }*/

    //////

    /*console.log("H0: "+ H0);
    console.log("H1: "+ H1);
    console.log("H2: "+ H2);
    console.log("H3: "+ H3);
    console.log("H4: "+ H4);
    console.log("H5: "+ H5);*/

    console.log("SIGN_GAP :" + SIGN_GAP);
    console.log("GAP_TOP  : " + GAP_TOP);
    console.log("RADICAL_H0: "+ H0/plH);
    console.log("RADICAL_H1: "+ H1/plH);
    console.log("RADICAL_H2: "+ H2/plH);
    console.log("RADICAL_H3: "+ H3/plH);
    console.log("RADICAL_H4: "+ H4/plH);
    console.log("RADICAL_H5: "+ H5/plH);

    ///// Size of tick //////
    var minHgtRad = plH * 1.130493164,
        maxHgtRad = plH * 7.029296875;

    var minHgtTick = plH*0.6,
        maxHgtTick = 1.2*plH;

    var heightTick, widthSlash,
        gapLeft;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthSlash = plH * 0.67;

        gapLeft = 0.2*plH;
    }
    else
    {
        var H;

        if(heightArg < H1)
        {
            H = H1;
            var zetta = height < H1 ? 0.75 : 0.82;
            widthSlash = plH *zetta;
        }
        else
        {
            H = height;
            widthSlash = plH * 0.8681086138556986;
        }
        var alpha =  (H - minHgtRad)/(2*maxHgtRad);
        heightTick = minHgtTick*(1 + alpha);

        gapLeft = 0.12683105468750022* plH;
    }


    this.measure.widthSlash = widthSlash;

    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.1196002747872799*txtPrp.FontSize;

    ////// width, height //////
    width = widthSlash + gapLeft + widthArg;
    height += this.gapTop;
    //////

    //console.log("Gap top : " + this.gapTop);

    /*console.log("SIGN_GAP: " + SIGN_GAP);
    console.log("RADICAL_GAP: " + RADICAL_GAP);
    console.log("RADICAL_H0: " + RADICAL_H0);
    console.log("RADICAL_H1: " + RADICAL_H1);
    console.log("RADICAL_H2: " + RADICAL_H2);
    console.log("RADICAL_H3: " + RADICAL_H3);
    console.log("RADICAL_H4: " + RADICAL_H4);
    console.log("RADICAL_H5: " + RADICAL_H5);*/


    //console.log("Height: " + height);

    this.size = {height: height, width: width};
}
CSignRadical.prototype.old_old_recalculateSize = function()
{
    var txtPrp = this.Parent.getCtrPrp();
    var sizeArg = this.Parent.getBase().size;

    var height, width;
    var plH = 9.877777777777776 * txtPrp.FontSize/36;

    var SUM = 0.1216 + 0.05;
    SIGN_GAP = SUM - GAP_TOP;

    var gapSign = txtPrp.FontSize*g_dKoef_pt_to_mm*SIGN_GAP,
        heightArg = sizeArg.height + gapSign,
        widthArg  = sizeArg.width;


    this.gapTop = txtPrp.FontSize*g_dKoef_pt_to_mm*GAP_TOP;
    this.gapSign = gapSign;

    //  this.gapTop = txtPrp.FontSize*g_dKoef_pt_to_mm*SIGN_GAP;

    //console.log("Gap sign : " + gapSign);

    /////  height  //////

    var H0 = plH*1.2,
        H1 = plH*1.50732421875,
        H2 = plH*2.760986328125,
        H3 = plH*4.217578125,
        H4 = plH*5.52197265625,
        H5 = plH*7.029296875;

    //    RADICAL_GAP =0.1216;
    //    SIGN_GAP  = 0.05;

    /*var H0 = plH*1.0992;
     var H1 = plH*1.56542421875;
     var H2 = plH*2.8275863281249998;
     var H3 = plH*4.154778125;
     var H4 = plH*5.7241726562499995;
     var H5 = plH*7.167896874999999;*/

    H0 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
    H1 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
    H2 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
    H3 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
    H4 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;
    H5 += gapSign - txtPrp.FontSize*g_dKoef_pt_to_mm*0.2;

    /*H0 += gapSign;
     H1 += gapSign;
     H2 += gapSign;
     H3 += gapSign;
     H4 += gapSign;
     H5 += gapSign;*/


    this.measure.bHigh = false;

    if( heightArg < H0 )
        height = H0*1.058;
    else if( heightArg < H1 )
        height = H1;
    else if( heightArg < H2 )
        height = H2;
    else if( heightArg < H3 )
        height = H3;
    else if( heightArg < H4 )
        height = H4;
    else if( heightArg < H5 )
        height = H5;
    else
    {
        height = heightArg;
        this.measure.bHigh = true;
    }

    //////

    /*console.log("H0: "+ H0);
     console.log("H1: "+ H1);
     console.log("H2: "+ H2);
     console.log("H3: "+ H3);
     console.log("H4: "+ H4);
     console.log("H5: "+ H5);*/

    console.log("SIGN_GAP :" + SIGN_GAP);
    console.log("GAP_TOP  : " + GAP_TOP);
    console.log("RADICAL_H0: "+ H0/plH);
    console.log("RADICAL_H1: "+ H1/plH);
    console.log("RADICAL_H2: "+ H2/plH);
    console.log("RADICAL_H3: "+ H3/plH);
    console.log("RADICAL_H4: "+ H4/plH);
    console.log("RADICAL_H5: "+ H5/plH);

    ///// Size of tick //////
    var minHgtRad = plH * 1.130493164,
        maxHgtRad = plH * 7.029296875;

    var minHgtTick = plH*0.6,
        maxHgtTick = 1.2*plH;

    var heightTick, widthSlash,
        gapLeft;

    if ( heightArg > maxHgtRad )
    {
        heightTick = maxHgtTick;
        widthSlash = plH * 0.67;

        gapLeft = 0.2*plH;
    }
    else
    {
        var H;

        if(heightArg < H1)
        {
            H = H1;
            var zetta = height < H1 ? 0.75 : 0.82;
            widthSlash = plH *zetta;
        }
        else
        {
            H = height;
            widthSlash = plH * 0.8681086138556986;
        }
        var alpha =  (H - minHgtRad)/(2*maxHgtRad);
        heightTick = minHgtTick*(1 + alpha);

        gapLeft = 0.12683105468750022* plH;
    }


    this.measure.widthSlash = widthSlash;

    this.measure.heightTick = heightTick;
    this.measure.widthTick = 0.1196002747872799*txtPrp.FontSize;

    ////// width, height //////
    width = widthSlash + gapLeft + widthArg;
    height += this.gapTop;
    //////

    //console.log("Gap top : " + this.gapTop);

    /*console.log("SIGN_GAP: " + SIGN_GAP);
     console.log("RADICAL_GAP: " + RADICAL_GAP);
     console.log("RADICAL_H0: " + RADICAL_H0);
     console.log("RADICAL_H1: " + RADICAL_H1);
     console.log("RADICAL_H2: " + RADICAL_H2);
     console.log("RADICAL_H3: " + RADICAL_H3);
     console.log("RADICAL_H4: " + RADICAL_H4);
     console.log("RADICAL_H5: " + RADICAL_H5);*/


    //console.log("Height: " + height);

    this.size = {height: height, width: width};
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

    this.gapDegree = 0;
    this.gapWidth = 0; //  в случае со степенью, если ширина степени не нулевая, добавляется расстояние для ширины


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
        //oDegree.decreaseArgSize();
        oDegree.setArgSize(-2);

        this.addMCToContent(oDegree, oBase);
    }
}
CRadical.prototype.recalculateSize = function(oMeasure)
{
    this.signRadical.recalculateSize(oMeasure);

    var txtPrp = this.getCtrPrp();
    var sign = this.signRadical.size,
        gSign = this.signRadical.gapSign,
    // в случае смещения baseline контента тоже смещается, и по высоте артгумент может выйти чуть за пределы (т.о. значок интеграла будет расположен чуть выше, чем следовало бы, и размер аргумента выйде за аграницы)
        gArg = this.signRadical.gapArg > 2*g_dKoef_pt_to_mm ? this.signRadical.gapArg : 2*g_dKoef_pt_to_mm; // делаем смещение, т.к. для fontSize 11, 14 и меньше высота плейсхолдера не совпадает
                                                                                                        // с высотой отрисовки плейсхолдера и происходит наложение черты значка радикала и плейсхолдера

    var gapBase = gSign + gArg;

    if(this.type == SQUARE_RADICAL)
    {
        var base = this.elements[0][0].size;
        var shTop = (sign.height - gSign - base.height)/2;
        shTop = shTop > 0 ? shTop : 0;

        var height = sign.height,
            width  = sign.width,
            ascent = gapBase + shTop + base.ascent;
            //ascent = height - (base.height - base.ascent);

        width += this.GapLeft + this.GapRight;

        this.size = {width: width, height: height, ascent: ascent};
    }
    else if(this.type == DEGREE_RADICAL)
    {
        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size;

        var wTick = this.signRadical.measure.widthTick,
            hTick = this.signRadical.measure.heightTick;

        var plH = 9.877777777777776 * txtPrp.FontSize /36;

        // общие gaps
        var gapHeight = 0.011*txtPrp.FontSize; // добавляем это расстояние к общей высоте радикала, также как и gapWidth
        this.gapWidth = 0.011*txtPrp.FontSize;

        var wDegree = degr.width > wTick ? degr.width - wTick : 0;
        var width = wDegree + sign.width + this.gapWidth;

        width += this.GapLeft + this.GapRight;

        var gapDegree;
        if( base.height < plH )
            gapDegree = 1.5*txtPrp.FontSize/36;
        else
            gapDegree = 3*txtPrp.FontSize/36;

        var h1 = gapHeight + degr.height + gapDegree + hTick,
            h2 = sign.height;


        var height, ascent;
        var shTop = (sign.height - gSign - base.height)/2;

        if(h1 > h2)
        {
            height =  h1;
            ascent = height - sign.height + gapBase + shTop + base.ascent;
        }
        else
        {
            height =  h2;
            ascent = gapBase + shTop + base.ascent;
        }

        this.gapDegree = height - h1 + gapHeight;

        this.size = {width: width, height: height, ascent: ascent};
    }
}
CRadical.prototype.setPosition = function(pos)
{
    this.pos = {x: pos.x, y: pos.y - this.size.ascent};

    if(this.type == SQUARE_RADICAL)
    {
        var gapLeft = this.size.width - this.elements[0][0].size.width;
        var gapTop = this.size.ascent - this.elements[0][0].size.ascent;

        var x1 = this.pos.x + this.GapLeft,
            y1 = this.pos.y;

        var x2 = this.pos.x + this.GapLeft + gapLeft,
            y2 = this.pos.y + gapTop;

        this.signRadical.setPosition({x: x1, y: y1});
        this.elements[0][0].setPosition({x: x2, y: y2});
    }
    else if(this.type == DEGREE_RADICAL)
    {
        var degr = this.elements[0][0].size,
            base = this.elements[0][1].size,
            sign = this.signRadical.size;

        var wTick = this.signRadical.measure.widthTick;

        var x1 = this.pos.x + this.GapLeft + this.gapWidth,
            y1 = this.pos.y + this.gapDegree;

        this.elements[0][0].setPosition({x: x1, y: y1});

        var wDegree = degr.width > wTick ? degr.width - wTick : 0;
        var x2 = this.pos.x + this.GapLeft + wDegree,
            y2 = this.pos.y + this.size.height - sign.height;

        this.signRadical.setPosition({x: x2, y: y2});

        var x3 = this.pos.x + this.GapLeft + this.size.width - base.width,
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

        var gapLeft = this.size.width - this.elements[0][0].size.width;
        var gapTop = this.size.ascent - this.elements[0][0].size.ascent;

        if(mCoord.x < gapLeft)
        {
            X = 0;
            inside_flag = 0;
        }
        else if(mCoord.x > gapLeft + sizeBase.width)
        {
            X = sizeBase.width;
            inside_flag = 1;
        }
        else
            X = mCoord.x - gapLeft;

        if(mCoord.y < gapTop)
        {
            Y = 0;
            inside_flag = 2;
        }
        else if(mCoord.y > gapTop + sizeBase.height)
        {
            Y = sizeBase.height;
            inside_flag = 2;
        }
        else
            Y = mCoord.y - gapTop;

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
            else if(mCoord.x < this.gapWidth)
            {
                mouseCoord.x = 0;
                inside_flag = 0;
            }
            else
            {
                mouseCoord.x = mCoord.x - this.gapWidth;
            }

            mouseCoord.x = mCoord.x;

            if(mCoord.y < this.gapDegree)
            {
                mouseCoord.y = 0;
                inside_flag = 2;
            }
            else if(mCoord.y > degr.height + this.gapDegree)
            {
                mouseCoord.y = degr.height;
                inside_flag = 2;
            }
            else
            {
                mouseCoord.y = mCoord.y - this.gapDegree;
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
    //////  test   //////

    /*var xx = x + this.pos.x,
        yy = y + this.pos.y,
        w = this.size.width,
        h = this.size.height;

    pGraphics.p_width(1000);
    pGraphics.b_color1(0,0,250, 255);

    pGraphics._s();
    pGraphics._m(xx, yy);
    pGraphics._l(xx + w, yy);
    pGraphics._l(xx + w, yy + h);
    pGraphics._l(xx, yy + h);
    pGraphics._l(xx, yy);
    pGraphics.df();*/


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


