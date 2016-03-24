"use strict";

//HTMLPage.js
var C_SIZE = 72;
function coeff()
{
    this.hh1 = [];
    this.hh2 = [];
}
coeff.prototype.init_2 = function()
{
    this.hh1[0] = 1.82;
    this.hh2[0] = 2.09;

    this.hh1[1] = 1.64;
    this.hh2[1] = 1.65;

    this.hh1[2] = 1.57;
    this.hh2[2] = 1.92;

    this.hh1[3] = 1.48;
    this.hh2[3] = 2.16;

    // (!)
    this.hh1[4] = 1;
    this.hh2[4] = 1;
    //

    this.hh1[5] = 2.5;
    this.hh2[5] = 2.5;

    this.hh1[6] = 2.1;
    this.hh2[6] = 2.1;

    this.hh1[7] = 1;
    this.hh2[7] = 1;
    
}
coeff.prototype.init_3 = function()
{
    this.hh1[0] = 1.75;
    this.hh2[0] = 2.55;

    this.hh1[1] = 1.62;
    this.hh2[1] = 1.96;

    this.hh1[2] = 1.97;
    this.hh2[2] = 1.94;

    this.hh1[3] = 1.53;
    this.hh2[3] = 1.0;

    this.hh1[4] = 2.04;
    this.hh2[4] = 3.17;

    this.hh1[5] = 2.0;
    this.hh2[5] = 2.58;

    this.hh1[6] = 2.3;
    this.hh2[6] = 1.9;

    this.hh1[7] = 2.3;
    this.hh2[7] = 1.9;

    // (!)
    this.hh1[8] = 1;
    this.hh2[8] = 1;
    //

    this.hh1[9] = 2.5;
    this.hh2[9] = 2.5;

    this.hh1[10] = 2.1;
    this.hh2[10] = 2.1;

    this.hh1[11] = 1;
    this.hh2[11] = 1;
}

var Coeff2 = new coeff();
Coeff2.init_3();


function SetHeigthBracket_3()
{
    var augm = + document.getElementById("augbr").value;
    augm = augm/100;

    var x = 23,
        y = 27;

    var X = [],
        Y = [];

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

    /*Y[54] = 28216; X[54] = 24245;
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

    var textScale = C_SIZE/1000, // 1000 pt
        alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // при рисовании используем координаты в миллиметрах, умноженные на 100
    // g_dKoef_px_to_mm = 25.4/96

    var XX = [],
        YY = [];

    var hh1 = [],
        hh2 = [];

    var c1 = [],
        c2 = [];

    var delta = augm < 7 ? augm : 7;

    if(augm < 7)
    {
        var RX = [];

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

            var RX1 = 0.033*delta + 0.967,
                RX2 = 0.033*delta + 0.967;

            for(var i = 0; i < 27; i++)
                RX[i] = RX2;

            for(var i = 27; i < 54; i++)
                RX[i] = RX1;
        }
        else
        {
            hh1[0] = 1.74;
            hh2[0] = 1.84;

            hh1[1] = 1.62;
            hh2[1] = 1.67;

            hh1[2] = 1.55;
            hh2[2] = 1.91;

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

            var RX1 = 0.145*delta + 0.855,
                RX2 = 0.17*delta + 0.83;

            for(var i = 0; i < 27; i++)
                RX[i] = 0.17*delta + 0.83;

            for(var i = 27; i < 54; i++)
                RX[i] = 0.145*delta + 0.855;
        }

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
                var t = j + i*2;
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

        hh1[1] = 2.89;
        hh2[1] = 2.53;

        hh1[2] = 2.06;
        hh2[2] = 2.08;

        hh1[3] = 1.53;
        hh2[3] = 1.26;

        hh1[4] = 2.04;
        hh2[4] = 2.7;

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

        var RX = [];

        for(var i = 0; i < 27; i++)
            RX[i] = 0.17*delta + 0.83;

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

    var shiftX = 48 * textScale * 1000/72;


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

}
function SetHeigthBracket()
{
    var augm = + document.getElementById("augbr").value;
    augm = augm/100;

    var x = 23,
        y = 27;

    var X = [],
        Y = [];

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

    /*Y[54] = 28216; X[54] = 24245;
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

    var textScale = C_SIZE/1000, // 1000 pt
        alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // при рисовании используем координаты в миллиметрах, умноженные на 100
    // g_dKoef_px_to_mm = 25.4/96

    var XX = [],
        YY = [];

    var hh1 = [],
        hh2 = [];

    var c1 = [],
        c2 = [];

    var delta = augm < 7 ? augm : 7;

    if(augm < 7)
    {
        var RX = [],
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
                var t = j + i*2;
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

        var RX = [];

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

    var shiftX = 48 * textScale * 1000/72;


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

}

function checkBracket(font, Aug)
{
    //var augm = + document.getElementById("augbr").value;
    //augm = augm/100;

    var x = 23,
        y = 27;

    var X = [],
        Y = [];

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

    /*Y[54] = 28216; X[54] = 24245;
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

    var textScale = font.FontSize, // 1000 pt
        alpha = textScale*25.4/96 /64; // коэффициент; используется для того чтобы перевести координаты в миллиметры
    // при рисовании используем координаты в миллиметрах, умноженные на 100
    // теперь не умножаем на 100 =)
    // g_dKoef_px_to_mm = 25.4/96

    var augm = Aug;

    var XX = [],
        YY = [];

    var hh1 = [],
        hh2 = [];

    var c1 = [],
        c2 = [];

    for(var i = 0; i < 4; i++)
    {
        //hh1[i] = hh2[i] = 1 + 0.3*i;

        c1[i] = Y[30 + 2*i] - Y[28 + 2*i];
        c2[i] = Y[23 - 2*i] - Y[25 - 2*i];
    }

    /*hh1[0] = 1.2;
     hh2[0] = 1.3;
     hh1[1] = 1.3;
     hh2[1] = 1.5;
     hh1[2] = 1.5;
     hh2[2] = 1.7;

     hh1[3] = hh2[3] = 2.1;*/

    hh1[0] = 1.2;
    hh2[0] = 1.3;

    hh1[1] = 1.3;
    hh2[1] = 1.4;

    hh1[2] = 1.5;
    hh2[2] = 1.6;

    hh1[3] = 1.8;
    hh2[3] = 1.6;

    for(var i = 0; i < 4; i++)
    {
        hh1[i] += 0.5;
        hh2[i] += 0.5;
    }

    hh1[5] = 2.5;
    hh2[5] = 2.5;

    c1[5] = Y[48] - Y[44];
    c2[5] = Y[5] - Y[9];

    hh1[6] = 2.1;
    hh2[6] = 2.1;

    c1[6] = Y[52] - Y[48];
    c2[6] = Y[1] - Y[5];

    hh1[7] = 1;
    hh2[7] = 1;

    c1[7] = (Y[0] - Y[1])/2 + Y[1] - Y[52];
    c2[7] = (Y[0] - Y[1])/2;

    c1[4] = Y[44] - Y[36];
    c2[4] = Y[9] - Y[17];

    var delta = augm < 7 ? augm : 7;
    //var delta = augm;
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
            var t = j + i*2;
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

    var shiftX = 48 * textScale * 1000/72;

    //var RX = 0.04*delta + 0.96;
    var RX = 0.145*delta + 0.855;
    for(var i = 27; i < 54; i++)
        XX[i] = RX*X[i];

    for(var i = 0; i < 27; i++)
    {
        XX[i] = (0.17*delta + 0.83)*X[i];
    }

    XX[1] = XX[52] - (X[52] - X[1]);
    XX[0] = XX[1];

    XX[27] = X[27];
    XX[26] = X[26];

    for(var i = 0; i < 9; i++ )
    {
        XX[28 - i] = X[28 - i]*(1 + i*(RX - 1)/8);
    }

    if(augm > 7)
    {
        var w = XX[33],
        //w2 = XX[19] + (XX[9] - XX[19])/2;
            w2 = XX[9] + 0.15*(XX[9] - XX[19]);

        for(var i = 0; i < 11; i++)
        {
            XX[34 + i] = w;
            XX[19 - i] = w2;
        }

        var _H1 = augm*(Y[52] + c1[7]),
            _H2 =  _H1 - (Y[26] - Y[27]);

        var w3 = _H1 - (YY[52] + c1[7]),
            w4 = _H2 - (YY[1] - YY[26] + c2[7]);

        for(var i = 0; i < 10; i++)
        {
            YY[53 - i] = YY[53 - i] + w3;
            YY[i] = YY[i] + w4;
        }

        //YY[53] = YY[52] + 2*c1[7];
        //YY[0] = YY[1] + 2*c2[7];
    }


    return {_XX: XX, _YY: YY};

}