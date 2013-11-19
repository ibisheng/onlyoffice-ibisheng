var MATH_EDIT = 0;
var MATH_READ = 1;

function simulatorMComposition(ttype)
{
    //////// accent -> bar fraction -> skewed fraction (for numerator)

    var props =
    {
        chrType:      ACCENT_ONE_DOT
    };

    var accent = new CAccent();
    var ctrPrp = new CTextPr();
    ctrPrp.FontSize = 11;

    addToContent_ForRead(MathComposition.Root, accent, props, ctrPrp);

    props =
    {
        type:   BAR_FRACTION
    };
    var fract = new CFraction();
    addToContent_ForRead(accent.getBase(), fract, props);

    fract.getDenominator().fillPlaceholders();
    var content = fract.getNumerator();
    var fract2 = new CFraction();
    props =
    {
        type:   SKEWED_FRACTION
    };
    addToContent_ForRead(content, fract2, props);

    var num1 = fract2.getNumerator();
    var den1 = fract2.getDenominator();

    num1.addTxt("a");
    den1.addTxt("b");

    //////////////////////////////////////////////////////////////////

    var space = new CMathText();
    space.add(0x20);

    addToContent_ForRead(MathComposition.Root, space);


    //////// delimiter (with separator) -> two bar fraction -> accent caron

    var delim = new CDelimiter();

    props =
    {
        begChrType:        PARENTHESIS_LEFT,
        //endChrType:      PARENTHESIS_RIGHT,
        endChr:             ")",
        sepChrType:        DELIMITER_LINE,
        column:            2
    };

    addToContent_ForRead(MathComposition.Root, delim, props);

    delim.getBase(1).addTxt("l");

    fract = new CFraction();
    props =
    {
        type: BAR_FRACTION
    };

    addToContent_ForRead(delim.getBase(0), fract, props);

    var num = fract.getNumerator();

    accent = new CAccent();
    props =
    {
        chrType:    ACCENT_COMB_CARON
    };

    addToContent_ForRead(num, accent, props);

    accent.getBase().addTxt("i");

    var den = fract.getDenominator();

    fract = new CFraction();
    props =
    {
        type: BAR_FRACTION
    };
    addToContent_ForRead(den, fract, props);

    fract.getNumerator().addTxt("t");
    fract.getDenominator().addTxt("b");

    ////// radical -> integral -> (delimiter -> degree -> tilde accent), box

    var root = new CRadical();
    props =
    {
        type:   DEGREE_RADICAL
    };

    addToContent_ForRead(MathComposition.Root, root, props);

    root.getDegree().addTxt("3");

    base = root.getBase();
    base.addTxt("F");

    var integral = new CNary();
    props =
    {
        signType:       NARY_INTEGRAL,
        //chr:            "B",
        limLoc:         NARY_SubSup
    };
    integral.init(props);

    addToContent_ForRead(base, integral, props);

    integral.getUpperIterator().addTxt("a");
    integral.getLowerIterator().addTxt("b");

    base = integral.getBase();
    delim = new CDelimiter();
    props =
    {
        begChrType:   BRACKET_CURLY_LEFT,
        endChrType:   BRACKET_CURLY_RIGHT,
        column:       1
    };

    addToContent_ForRead(base, delim, props);

    var degree = new CDegree();
    props =
    {
        type: DEGREE_SUPERSCRIPT
    };
    addToContent_ForRead(delim.getBase(), degree, props);

    degree.getIterator().addTxt("n");

    var tilde = new CAccent();
    props =
    {
        chrType:   ACCENT_TILDE
    };

    addToContent_ForRead(degree.getBase(), tilde, props);

    tilde.getBase().addTxt("g");

    var box = new CBox();
    props =
    {
        diff:   true
    };

    addToContent_ForRead(base, box, props);

    box.getBase().addTxt("dx");

    //////////////////////////////////////////////////////////////////


    ////// matrix (4 rows) -> limit, arrow operator

    var matrix = new CMathMatrix();

    props =
    {
        column:     1,
        row:        4
    };

    addToContent_ForRead(MathComposition.Root, matrix, props);

    var mathFunc = new CMathFunc();
    props =
    {

    };

    addToContent_ForRead(matrix.getElement(0,0), mathFunc, props);

    var limit = new CLimit();

    props =
    {

    };

    addToContent_ForRead( mathFunc.getFName(), limit, props);

    limit.getIterator().addTxt("x→0");
    limit.getFName().addTxt("lim");

    fract = new CFraction();

    props =
    {

    };

    addToContent_ForRead( mathFunc.getArgument(), fract, props);

    fract.getDenominator().addTxt("x");

    var mFunc = new CMathFunc();

    props =
    {

    };

    addToContent_ForRead( fract.getNumerator(), mFunc, props);

    mFunc.getFName().addTxt("sin");
    mFunc.getArgument().addTxt("x");


    matrix.getElement(1,0).fillPlaceholders();
    matrix.getElement(2,0).fillPlaceholders();

    var lastElem = matrix.getElement(3, 0);

    lastElem.addTxt("w");

    var oper = new CGroupCharacter();
    props =
    {
        chrType:       DOUBLE_ARROW_LR,
        location:      LOCATION_TOP
    };

    addToContent_ForRead(lastElem, oper, props);

    oper.getBase().addTxt("a");

    lastElem.addTxt("y");

    //////////////////////////////////////////////////////////////////

    // only for read
    if(ttype === MATH_READ)
        RecalculateMComposition();

}

function RecalculateMComposition()
{
    MathComposition.RecalculateComposition();

    editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
        Left   : X_Left_Field,
        Right  : X_Right_Field,
        Top    : Y_Top_Field,
        Bottom : Y_Bottom_Field
    } } );
}

function addToContent_ForRead(content, elem, props, ctrPrp)
{
    try
    {
        if(elem.typeObj == MATH_COMP)
            elem.init(props);

    }
    catch(e)
    {
        console.log( "Init of " + '\"' + elem.constructor.name + '\"' + " don't work" );
    }

    try
    {
        if(typeof(ctrPrp)!=="undefined" && ctrPrp !== null)
            if(elem.typeObj == MATH_COMP)
            {
                elem.setCtrPrp(ctrPrp);
            }
    }
    catch(e)
    {
        console.log( "CtrPrp for " + '\"' + elem.constructor.name + '\"' + " don't work" );
    }

    try
    {
        content.addElementToContent(elem);
    }
    catch(e)
    {
        console.log( "Add to content for " + '\"' + elem.constructor.name + '\"' +  " don't work" );
    }

    try
    {
        if(elem.typeObj == MATH_COMP)
        {
            elem.Resize();
        }
    }
    catch(e)
    {
        console.log( "Recalculate for " + '\"' +  elem.constructor.name + '\"' + " don't work" );
    }

}


