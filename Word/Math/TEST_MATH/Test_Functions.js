/**
 * Created with JetBrains WebStorm.
 * User: Anna.Pavlova
 * Date: 10/7/14
 * Time: 5:37 PM
 * To change this template use File | Settings | File Templates.
 */



/*
 var metricsTxt = g_oTextMeasurer.Measure2Code(letter);
 var _width = metricsTxt.Width;
 height = g_oTextMeasurer.GetHeight();
 */

// смена хентов
// editor.SetFontRenderingMode(2);

//change FontSize
//editor.put_TextPrFontSize(parseInt("37"));

var TEST_MATH_FIRST_SYMBOL = 0x21;
var TEST_MATH_SYMBOL = 0x21;
var TEST_MATH_COUNT = 35;
var TEST_LAST_SYMBOL = 0x1D7FF;


// добавить в конструктор ParaMath
// this.TEST_SYMBOLS       = true;
function _To_Run_To_Recalculate_Range(oRun)
{
    if(oRun.Type == para_Math_Run && TEST_MATH_SYMBOL <= TEST_LAST_SYMBOL)
    {
        if(oRun.ParaMath.TEST_SYMBOLS == true)
        {

            for(var Pos = 0; Pos < TEST_MATH_COUNT && TEST_MATH_SYMBOL <= TEST_LAST_SYMBOL; Pos++)
            {
                TEST_MATH_SYMBOL = oTEST_MATH_RANGE.Check_Skip(TEST_MATH_SYMBOL);

                oTEST_MATH_RANGE.Check_Space(TEST_MATH_SYMBOL, oRun.Content, true, this, oRun.ParaMath);

                var oText = new CMathText(false);
                oText.add(TEST_MATH_SYMBOL);
                oText.PreRecalc(this, oRun.ParaMath);

                oRun.Content.push(oText);

                TEST_MATH_SYMBOL++;
            }

            oRun.ParaMath.TEST_SYMBOLS = false;
        }
    }

    if(oRun.Content.length == 1 && oRun.Content[0].Type == para_Text && true === oRun.RecalcInfo.Measure)
    {
        if(oRun.Content[0].Value == 97)
        {
            TEST_MATH_SYMBOL = TEST_MATH_FIRST_SYMBOL;

            oTEST_MATH_RANGE = new TEST_MATH_RANGES();
            oRun.Content.length = 0;
            for(var Pos = 0; TEST_MATH_SYMBOL<=0x35A8; Pos++)
            {
                TEST_MATH_SYMBOL = oTEST_MATH_RANGE.Check_Skip(TEST_MATH_SYMBOL);

                oTEST_MATH_RANGE.Check_Space(TEST_MATH_SYMBOL, oRun.Content, false, this, oRun.ParaMath);

                var oText = new ParaText();
                oText.Set_CharCode(TEST_MATH_SYMBOL);

                oRun.Content.push(oText);

                TEST_MATH_SYMBOL++;
            }

            TEST_MATH_SYMBOL = TEST_MATH_FIRST_SYMBOL;
        }
    }
}

var oTEST_MATH_RANGE = new TEST_MATH_RANGES();
function TEST_MATH_RANGES()
{
    this.Skips  =
        [
            [0x7E,   0xA1],
            [0x36F,  0x37A],
            [0x37E,  0x384],
            [0x38A,  0x38C],
            [0x38C,  0x38E],
            [0x3A1,  0x3A3],
            [0x513,  0x524],
            [0x525,  0x0E3F],
            [0x0E3F, 0x1D00],
            [0x1DCA, 0x1DFE],
            [0x1E9B, 0x1EA0],
            [0x1EF9, 0x1F00],
            [0x1F15, 0x1F18],
            [0x1F1D, 0x1F20],
            [0x1F45, 0x1F48],
            [0x1F4D, 0x1F50],
            [0x1F57, 0x1F59],
            [0x1F59, 0x1F5B],
            [0x1F5B, 0x1F5D],
            [0x1F5D, 0x1F5F],
            [0x1F7D, 0x1F80],
            [0x1FB4, 0x1FB6],
            [0x1FC4, 0x1FC6],
            [0x1FD3, 0x1FD6],
            [0x1FDB, 0x1FDD],
            [0x1FEF, 0x1FF2],
            [0x1FFE, 0x2010],
            [0x2010, 0x2012],
            [0x2022, 0x2026],
            [0x2026, 0x2030],
            [0x2030, 0x2032],
            [0x2034, 0x2039],
            [0x203A, 0x203C],
            [0x203C, 0x203E],
            [0x203E, 0x2044],
            [0x2046, 0x2057],
            [0x2057, 0x205E],
            [0x205E, 0x2070],
            [0x2071, 0x2074],
            [0x208E, 0x2090],
            [0x2094, 0x20A0],
            [0x20B5, 0x20B8],
            [0x20B8, 0x20D0],
            [0x20DF, 0x20E1],
            [0x20E1, 0x20E5],
            [0x20E6, 0x20E8],
            [0x20EA, 0x2102],
            [0x2105, 0x2107],
            [0x211D, 0x2122],
            [0x2122, 0x2124],
            [0x213A, 0x213D],
            [0x214B, 0x214D],
            [0x214E, 0x2153],
            [0x215E, 0x2183],
            [0x2184, 0x2190],
            [0x23CF, 0x23DC],
            [0x23E0, 0x2460],
            [0x2473, 0x24EA],
            [0x24F4, 0x24FF],
            [0x2500, 0x2502],
            [0x2502, 0x250C],
            [0x250C, 0x2510],
            [0x2510, 0x2514],
            [0x2514, 0x2518],
            [0x2518, 0x251C],
            [0x251C, 0x2524],
            [0x2524, 0x252C],
            [0x252C, 0x2534],
            [0x2534, 0x2581],
            [0x2581, 0x2588],
            [0x2588, 0x2592],
            [0x2592, 0x25A0],
            [0x25A1, 0x25AD],
            [0x25AD, 0x25B3],
            [0x25B3, 0x25CA],
            [0x25CB, 0x2660],
            [0x2661, 0x2666],
            [0x2666, 0x2776],
            [0x277F, 0x27D0],
            [0x27EB, 0x27F0],
            [0x27FF, 0x2900],
            [0x2AFF, 0x2B04],
            [0x2B04, 0x2B06],
            [0x2B07, 0x2B0C],
            [0x2B0D, 0x2C60],
            [0x2C6C, 0x2C74],
            [0x2C77, 0x2E17],
            [0x2E17, 0x3000],
            [0x3020, 0x3030],
            [0x3037, 0x303B],
            [0x303D, 0x3041],
            [0x3096, 0x3099],
            [0x30FF, 0x3131],
            [0x318E, 0x31F0],
            [0x321E, 0x3220],
            [0x3243, 0x3251],
            [0x32CB, 0x32D0],
            [0x32FE, 0x3300],
            [0x3376, 0x337B],
            [0x33DD, 0x33E0],
            [0x33FE, 0x3402],
            [0x3402, 0x3406],
            [0x3406, 0x342C],
            [0x342C, 0x342E],
            [0x342E, 0x3468],
            [0x3468, 0x346A],
            [0x346A, 0x3492],
            [0x3492, 0x34B5],
            [0x34B5, 0x34BC],
            [0x34BC, 0x34C1],
            [0x34C1, 0x34C7],
            [0x34C7, 0x34DB],
            [0x34DB, 0x351F],
            [0x351F, 0x355D],
            [0x355E, 0x3563],
            [0x3563, 0x356E],
            [0x356E, 0x35A6],
            [0x35A6, 0x35A8]
        ];

    this.Spaces =
        [
            [0x2FE,  0x370],
            [0x481,  0x48A],
            [0x1DBF, 0x1E00],
            [0x20D2, 0x20E0],
            [0x20E4, 0x20E7]
        ];
    this.CountSpaces =
    {
        0x20DD: 7, 0x20DE: 7, 0x20DF: 9, 0x35D: 7, 0x0488: 8, 0x0489: 8, 0x35E: 6
    }
}
TEST_MATH_RANGES.prototype.Check_Skip = function(code)
{
    var resCode = code;


    while(this.Skips.length > 0 && code >= this.Skips[0][1])
    {
        this.Skips.splice(0, 1);
    }

    if(this.Skips.length > 0 && code > this.Skips[0][0] && code < this.Skips[0][1])
    {
        resCode = this.Skips[0][1];
    }

    return resCode;
};
TEST_MATH_RANGES.prototype.Check_Space = function(code, Content, bMath, Run, ParaMath)
{
    while(this.Spaces.length > 0 && code >= this.Spaces[0][1])
    {
        this.Spaces.splice(0, 1);
    }

    if(this.Spaces.length > 0 && code > this.Spaces[0][0] && code < this.Spaces[0][1])
    {
        var Count = this.CountSpaces[code] !== undefined ? this.CountSpaces[code] : 4;
        for(var i = 0; i < Count; i++)
        {
            var oSpace;
            if(bMath)
            {
                oSpace = new CMathText(false);
                oSpace.add(0x20);
                oSpace.PreRecalc(Run, ParaMath);
            }
            else
            {
                oSpace = new ParaSpace();
            }

            Content.push(oSpace);

        }
    }


};

function TEST_MATH_JUCTIFICATION(mcJc)
{
    MATH_MC_JC = mcJc;

    editor.WordControl.m_oLogicDocument.Content[0].Content[0].Root.Resize(null, editor.WordControl.m_oLogicDocument.Content[0].Content[0] , g_oTextMeasurer);

    var pos = new CMathPosition();
    pos.x = 0;
    pos.y = 0;
    editor.WordControl.m_oLogicDocument.Content[0].Content[0].Root.setPosition(pos);

    editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
    editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
}

function TEST_MATH_EDIT()
{
    //MathComposition.test_for_edit();
    MathComposition.test_for_edit();
    MathComposition.RecalculateComposition(g_oTextMeasurer, MathComposition.DEFAULT_RUN_PRP);
    //MathComposition.Draw_2(x, y, )


    editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
        Left   : X_Left_Field,
        Right  : X_Right_Field,
        Top    : Y_Top_Field,
        Bottom : Y_Bottom_Field
    } } );
}

function TEST_COEFF_ITERATORS()
{
    // a*36*36 + b*36 + c = 0.728*tPrp.FontSize = 26
    // a*14*14 + b*14 + c = 9
    // a*72*72 + b*72 + c = 55


    //FSize = 0.0006*FSize*FSize + 0.743*FSize - 1.53;


    // argSize = -1
    //var x1 = 36, x2 = 14, x3 = 72;
    //var d1 = 26, d2 = 10, d3 = 54; // если еще подгонять, то можно d3 = 53,52 взять


    var x1 = 36, x2 = 14, x3 = 72;
    var d1 = 24, d2 = 10, d3 = 47;


    // || x1*x1   x1  1 ||
    // || x2*x2   x2  1 ||
    // || x3*x3   x3  1 ||



    var D  = x1*x1*x2 + x1*x3*x3 + x2*x2*x3 - x3*x3*x2 - x3*x1*x1 - x2*x2*x1,
        Da = d1*x2    + x1*d3    + d2*x3    - d3*x2    - x3*d1    - d2*x1,
        Db = x1*x1*d2 + d1*x3*x3 + x2*x2*d3 - x3*x3*d2 - d3*x1*x1 - x2*x2*d1,
        Dc = x1*x1*x2*d3 + x1*x3*x3*d2 + x2*x2*x3*d1 - x3*x3*x2*d1 - x3*x1*x1*d2 - x2*x2*x1*d3;

    var a = Da/D,
        b = Db/D,
        c = Dc/D;

    console.log("a: " + a + "  b: " + b + "  c: " + c);

    var check1 = a*x1*x1 + b*x1 + c - d1,
        check2 = a*x2*x2 + b*x2 + c - d2,
        check3 = a*x3*x3 + b*x3 + c - d3;

    console.log("check1: " + check1);
    console.log("check2: " + check2);
    console.log("check3: " + check3);

    var aa = Math.round(a*10000)/10000;

    var dd1 = d1 - a*x1*x1,
        dd2 = d2 - a*x2*x2;

    var DD  = x1 - x2,
        Dbb = dd1 - dd2,
        Dcc = x1*dd2 - x2*dd1;

    var bb = Dbb/DD,
        cc = Dcc/DD;

    bb = Math.round(bb*100)/100;
    cc = Math.round(cc*100)/100;

    console.log("aa: " + aa + "  bb: " + bb + "  cc: " + cc);

    var check11 = aa*x1*x1 + bb*x1 + cc - d1,
        check22 = aa*x2*x2 + bb*x2 + cc - d2,
        check33 = aa*x3*x3 + bb*x3 + cc - d3;

    console.log("check11: " + check11);
    console.log("check22: " + check22);
    console.log("check33: " + check33);

}
