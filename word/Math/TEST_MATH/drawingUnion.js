"use strict";

var CF_X1 =  0.29;
var CF_X2 =  0.34;
var CF_X3 = 0.07;
var CF_X4 = 0.36;
var CF_X5 = 0;
var CF_X6 = 0.36;


var CF_Y1 = 0.78;
var CF_Y2 = 0.79;
/*var CF_Y3 = 0.84;
var CF_Y4 = 1.0;
var CF_Y5 = 0.77;
var CF_Y6 = 0.85;*/

var CF_Y3 = 0.75;
var CF_Y4 = 1.0;
var CF_Y5 = 0.75;
var CF_Y6 = 0.84;

//var COEFF_TH = 0.73;

var COEFF_TH = 0.81;



var CF_WIDTH = 1.3;
var CF_HEIGHT = 1;


var U_SIZE = 36/0.76;

function DrawUnion()
{
    /*var augm = + document.getElementById("CoeffUnion").value;
    augm = augm/100;*/

    var x = 23,
        y = 27;

    var betta = U_SIZE/36;

    //var _width = 1.3*9.6159*betta,
    var _width = CF_WIDTH*9.6159*betta,
    //var _width = 10.312548828125*betta,
        _height = 11.994444444444444*betta;

    var gap = 0.93*betta;

    var X = [],
        Y = [];

    /*X[0] = 10125;  Y[0] = 56563;
    X[1] = 10125;  Y[1] = 0;
    X[2] = 0;      Y[2] = 0;
    X[3] = 0;      Y[3] = 56313;
    X[4] = 0;      Y[4] = 76750;
    X[5] = 9031;   Y[5] = 87032;
    X[6] = 18063;  Y[6] = 97313;
    X[7] = 35438;  Y[7] = 97313;
    X[8] = 52813;  Y[8] = 97313;
    X[9] = 61875;  Y[9] = 87251;
    X[10] = 70938; Y[10] = 77188;
    X[11] = 70938; Y[11] = 58938;
    X[12] = 70938; Y[12] = 0;
    X[13] = 60813; Y[13] = 0;
    X[14] = 60813; Y[14] = 56563;
    X[15] = 60813; Y[15] = 72938;
    X[16] = 54375; Y[16] = 80782;
    X[17] = 47938; Y[17] = 88625;
    X[18] = 35438; Y[18] = 88625;
    X[19] = 22938; Y[19] = 88625;
    X[20] = 16531; Y[20] = 80782;
    X[21] = 10125; Y[21] = 72938;
    X[22] = 10125; Y[22] = 56563;*/


    X[0] = 35438;  Y[0] = 88625;
    X[1] = 22938;  Y[1] = 88625;
    X[2] = 16531;  Y[2] = 80782;
    X[3] = 10125;  Y[3] = 72938;
    X[4] = 10125;  Y[4] = 56563;
    X[5] = 10125;  Y[5] = 0;
    X[6] = 0;      Y[6] = 0;
    X[7] = 0;      Y[7] = 56313;
    X[8] = 0;      Y[8] = 76750;
    X[9] = 9031;   Y[9] = 87032;
    X[10] = 18063; Y[10] = 97313;
    X[11] = 35438; Y[11] = 97313;


    var textScale = U_SIZE/1000, // 1000 pt
        alpha = textScale*25.4/96 /64;

    //var thick = X[1] - X[2];
    var thick = (X[5] - X[6])*COEFF_TH;

    var Width_1 = (_width - gap)/alpha - 2*thick,
        Height = _height/alpha;

    var w1 = X[2] - X[4],
        w2 = X[0] - X[2],
        w3 = X[3] - X[4],
        w4 = X[1] - X[2];

    /*var k1 = w3/w1,
        k2 = w4/w2;*/

    var k1 = CF_X3,
        k2 = CF_X4;

    var WW1 = CF_X1*Width_1/2,
        WW2 = WW1*k1,
        WW3 = (1- CF_X1)*Width_1/2 *k2;


    X[4] *= COEFF_TH;
    X[5] *= COEFF_TH;

    X[2] = X[4] + WW1;
    X[3] = X[4] + WW2;
    X[1] = X[4] + WW3 + WW1;
    X[0] = X[4] + Width_1/2;

    var Width_2 = (_width - gap)/alpha;

    var w5 = X[9] - X[7],
        w6 = X[11] - X[9],
        w7 = X[8] - X[7],
        w8 = X[10] - X[9];

    /*var k3 = w7/w5,
        k4 = w8/w6;*/

    var k3 = CF_X5,
        k4 = CF_X6;

    var WW4 = CF_X2*Width_2/ 2,
        WW5 = WW4*k3,
        WW6 = (1- CF_X2)*Width_2/2 *k4;


    X[8]  = X[7] + WW5;
    X[9]  = X[7] + WW4;
    X[10] = X[7] + WW4 + WW6;
    X[11] = X[7] + Width_2/2;

    var Width = (_width - gap)/alpha;

    var HH = (Y[0] - Y[4])*CF_HEIGHT,
        h1 = (Y[2] - Y[4])*CF_HEIGHT,
        h2 = (Y[0] - Y[2])*CF_HEIGHT;

    Y[2] = Y[4] + HH*CF_Y1;
    Y[3] = Y[4] + h1*CF_Y3;
    Y[1] = Y[4] + HH*CF_Y1 +h2*CF_Y4;
    Y[0] = Y[4] + HH;

    var HH2 = (Y[11] - Y[7])*CF_HEIGHT,
        h3 = (Y[9] - Y[7])*CF_HEIGHT,
        h4 = (Y[11] - Y[9])*CF_HEIGHT;

    Y[9] =  Y[7] + HH2*CF_Y2;
    Y[8] =  Y[7] + h3*CF_Y5;
    Y[10] = Y[7] + HH2*CF_Y2 + h4*CF_Y6;


    Y[11] = Y[7] + HH2;

    var HH = Y[4]*0.68;

    for(var i = 0; i < 5; i++)
    {
        Y[i] += HH;
        Y[7+i] += HH;
    }

    for(var i = 0; i < 11; i++)
    {
        X[22 - i] = Width -  X[i];
        Y[22 - i] = Y[i];
    }

    var XX = [],
        YY = [];

    for(var i = 0; i < 23; i++)
    {
        var xxx = X[i] + 7100;
        var str = "X[" + i +"] = " + xxx  + "; Y[" + i + "] = " + Y[i] + ";";
        console.log(str);
    }

    for(var i = 0; i < 23; i++)
    {
        XX[i] = x + X[i]*alpha;
        YY[i] = y + Y[i]*alpha;
    }

    var intGrid = MathControl.pGraph.GetIntegerGrid();
    MathControl.pGraph.SetIntegerGrid(false);

    MathControl.pGraph.p_width(1000);

    MathControl.pGraph.b_color1(0,0,0, 255);
    MathControl.pGraph.p_color(0,0,0, 255);
    MathControl.pGraph._s();

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

    MathControl.pGraph.df();
    MathControl.pGraph.SetIntegerGrid(intGrid);

}
