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
