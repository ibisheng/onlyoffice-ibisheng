function addMathFunc(fname)
{
    var indef;
    switch(fname)
    {

        // 0-2  fraction (bar, linear, skewed)
        // 3    trigonometric function
        // 4    matrix
        // 5    degree
        // 6    min / max / lim
        // 7    logarithm
        // 8    n-ary (ordinary)
        // 9    n-ary (iterators like a degree)
        // 10   radical
        // 11   parentheses
        // 12   bracket
        // 13   diacritic

        case "bar_fraction":
            indef = 0;
            break;
        case "linear_fraction":
            indef = 1;
            break;
        case "skewed_fraction":
            indef = 2;
            break;
        case "sinus":
            indef = 3;
            break;
        case "matrix":
            indef = 4;
            break;
        case "degree":
            indef = 5;
            break;
        case "minimax":
            indef = 6;
            break;
        case "logarithm":
            //Test_Dot();
            indef = 7;
            break;
        case "series_s1":
            indef = 8;
            break;
        case "series_s2":
            indef = 9;
            break;
        case "radical":
            indef = 10;
            break;
        case "parentheses":
            indef = 11;
            break;
        case "bracket":
            indef = 12;
            break;
        case "diacritic":
            indef = 13;
            break;
        case "line":
            //Test_Line();
            indef = 14;
            break;
    }
    
    /*if(indef === 9 || indef === 8 || indef === 7)
    {
        TestForDiacritic(indef);
    }
    else
        MathControl.AddMathComponent(indef);*/

    /*if(indef != 7)
        MathControl.AddMathComponent(indef);*/

    MathControl.AddMathComponent(indef);

}

function TestForDiacritic(indef)
{
    //var code = 0x1D6E2 ;
    var code = 0x41;
    for(var i = 0; i < 26; i++, code++)
    {
        MathControl.AddMathComponent(indef);
        MathControl.OnKeyDown({KeyCode: 37});
        MathControl.OnKeyPress({CharCode: code});
        MathControl.OnKeyDown({KeyCode: 39});
    }

    MathControl.AddComposition({x: 27.5 - 6, y: 25.3 + MathControl.Content[0].getSize().height + 2 });

    //code = 0x1D6FC;
    code = 0x61;
    for(var i = 0; i < 26; i++, code++)
    {
        MathControl.AddMathComponent(indef);
        MathControl.OnKeyDown({KeyCode: 37});
        MathControl.OnKeyPress({CharCode: code});
        MathControl.OnKeyDown({KeyCode: 39});
    }
}

function RedefList()
{
    var list = document.getElementById("fontFormat");
    list.children[0].textContent = "Math function";

    list.children[1].children[0].textContent = "bar fraction";
    list.children[1].children[0].id = "bar_fraction";

    list.children[1].children[1].textContent = "skewed fraction";
    list.children[1].children[1].id = "skewed_fraction";

    list.children[1].children[2].textContent = "matrix";
    list.children[1].children[2].id = "matrix";

    list.children[1].children[3].textContent = "degree (style 2)";
    list.children[1].children[3].id = "degree";

    list.children[1].children[4].textContent = "minimax";
    list.children[1].children[4].id = "minimax";

    list.children[1].children[5].textContent = "series_s1";
    list.children[1].children[5].id = "series_s1";

    list.children[1].children[6].textContent = "series_s2";
    list.children[1].children[6].id = "series_s2";

    /*list.children[1].children[7].textContent = "radical";
    list.children[1].children[7].id = "radical";*/

    list.children[1].children[7].textContent = "line";
    list.children[1].children[7].id = "line";

    list.children[1].children[8].textContent = "parentheses";
    list.children[1].children[8].id = "parentheses";

    //list.children[1].children[9].textContent = "logarithm";
    list.children[1].children[9].textContent = "double line";
    list.children[1].children[9].id = "logarithm";

    list.children[1].children[10].textContent = "bracket";
    list.children[1].children[10].id = "bracket";

    for(var i=11; i < 16; i++)
    {
        list.children[1].children[i].textContent = "";
        list.children[1].children[i].id = "";
    }

    list.children[1].id = "math_function";

}

/*numMeth =  function()
{
    // floor    0.728
    // ceil     0.683

    var arr1 = new Array(16,17,18,20,21,22,24,25,28,32,36);
    var arr2 = new Array(11,12,13,14,15,16,17,18,20,23,26);
    var ans = new Array();

    var t, p;
    var temp = 0;
    var fl = false;

    for(var i=1; i < 1000 && (!fl); i++)
        for(var j = i + 1; j< 1000; j++)
        {
            fl = true;
            var ss = 0;
            for(var k = 0; k < 10; k++)
            {
                if( arr2[k] == Math.floor( i/j * arr1[k] ))
                {
                    ss++;
                }
                else
                    fl = false;


            }
            if(ss > temp)
            {
                t = i;
                p = j;
                temp = ss;
            }
        }

    var mas1 = new Array();
    var mas2 = new Array();
    var mas3 = new Array();

    for(var y = 16; y < 49; y++)
        mas2.push(y);
    for(var k = 0; k < mas2.length; k++ )
        mas1.push({ num: mas2[k], val: mas2[k]*0.728 });

    for(k = 0; k < mas1.length; k++ )
        if( (mas1[k].val - 0.65 ) > Math.floor(mas1[k].val) )
            mas3.push(mas1[k]);

    if(fl)
    {
        t = i;
        p = j;
    }


}*/

function CControlComposition()
{
    this.Content = new Array();
    this.CurPos = null;
    this.coord = null;
    this.pGraph = null;
}
CControlComposition.prototype =
{
    AddComposition: function()
    {
        this.Content.push(new CMathComposition());
        this.CurPos = this.Content.length - 1; //пока так, нужно переделать, чтобы добавлять в зависимости от расположения в документе формулы
    },
    OnKeyDown: function(e)
    {
        //стрелка вверх
        if(e.KeyCode==38)
        {
            this.Content[this.CurPos].Cursor_MoveUp();

            return true;
        }
        //стрелка вниз
        else if(e.KeyCode==40)
        {
            this.Content[this.CurPos].Cursor_MoveDown();

            return true;
        }
        //стрелка влево
        if(e.KeyCode==37)
        {
            this.Content[this.CurPos].Cursor_MoveLeft();

            return true;
        }
        //стрелка вправо
        else if(e.KeyCode==39)
        {
            this.Content[this.CurPos].Cursor_MoveRight();

            return true;
        }
        //backspace
        else if(e.KeyCode==8)
        {
            try{

                if(this.Content[this.CurPos].Remove())
                {
                    //this.UpdatePosition();
                    editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, editor.WordControl.m_oLogicDocument.Pages[0]);

                }
            }
            catch(e)
            {
                
            }

            return true;
        }

        return false;
    },
    OnKeyPress: function(e)
    {
        var code = e.CharCode;

        //
        /*if(code == 42)
            code = 8727;
        else if(code == 45)
            code = 8722;
        
        else if(code == 37)
            code = 0x222B;

        else if(code==94)
            code = 0x2211;

        if(code == 0x0068)
            code = 0x210E;*/
        /*else if(code > 0x0040 && code < 0x005B)
            code = code + 0x1D3F3;
        else if(code > 0x0060 && code < 0x007b)
            code = code + 0x1D3ED;*/

        if(code>=0x0020 )
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, editor.WordControl.m_oLogicDocument.Pages[0]);

            this.Content[this.CurPos].AddLetter(code);

            return true;
        }

        return false;
    },
    OnMouseDown: function(x,y)
    {
        var coord = this.GetCoordComp(x,y);

        if( this.IsRect(coord.x, coord.y) )
            this.Content[this.CurPos].MouseDown(coord.x, coord.y);
    },
    OnMouseMove: function(x,y)
    {
        var coord = this.GetCoordComp(x,y);

        if( this.IsRect(coord.x, coord.y) )
            this.Content[this.CurPos].MouseMove(coord.x, coord.y);
    },
    OnMouseUp: function()
    {
        this.Content[this.CurPos].MouseUp();
    },
    IsRect: function(x, y)
    {
        var size = this.Content[this.CurPos].getSize();

        return ( x > 0 && x < size.width && y > 0 && y < size.height);
    },
    Draw: function(pGraph)
    {
        for(var i = 0; i < this.Content.length; i++)
        {
            this.Content[i].Draw(pGraph);
            if(pGraph != "undefined" && pGraph !== null)
                this.pGraph = pGraph;
        }

        /*this.Content[this.CurPos].Draw(pGraph);
        if(pGraph != "undefined" && pGraph !== null)
            this.pGraph = pGraph;*/
    },
    GetCoordComp: function(x, y)
    {
        var _x = x - this.coord.x;
        var _y = y - this.coord.y;

        return {x: _x, y: _y};
    },
    AddMathComponent: function(indef)
    {
        this.Content[this.CurPos].AddMathComponent(indef);
        this.Content[this.CurPos].RecalculateReverse();
        this.Content[this.CurPos].UpdatePosition();
        //this.Content[this.CurPos].AddMathComponent(indef);
    },
    Paragraph_Add: function(TextPr)
    {
        var font = {FontFamily : {Name  : "Cambria Math", Index : -1 }, FontSize   : 14 };
        //!!!
        for(var i in TextPr)
            font[i] = TextPr[i];

        this.Content[this.CurPos].updateTextPrp(font);
    },
    DrawSelect2: function()
    {
        this.Content[0].DrawSelect2();
    },
    SetPosition: function(pos)
    {
        this.coord = pos;
        this.Content[this.CurPos].SetPosition(pos);
    },
    SetTxtPrp: function(txtPrp)
    {
        this.Content[this.CurPos].SetTxtPrp(txtPrp);

        editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
            Left   : X_Left_Field,
            Right  : X_Right_Field,
            Top    : Y_Top_Field,
            Bottom : Y_Bottom_Field
        } } );
    },
    GetTxtPrp: function()
    {
        return this.Content[this.CurPos].GetPrpSelectContent();
    }
}
var MathControl = new CControlComposition();
MathControl.AddComposition();
MathControl.SetPosition({x: 27.5 - 6, y: 25.3 });

var inherit = function(obj, extObj)
{
    if(arguments.length > 2)
        for (var a=1, L = arguments.length; a < L; a++)
            arguments.callee(obj, arguments[a]);
    else
        for(var i in extObj)
            if( ! obj[i])
                obj[i] = extObj[i];

    return obj;
}
var extend = function(Child, Parent)
{
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
    
}

//todo
//убрать эту функцию
function slashWidth(IFont)
{
    var GFont =
    {
        FontSize: IFont.FontSize,
        FontFamily: IFont.FontFamily
    };

    g_oTextMeasurer.SetFont(GFont);
    return g_oTextMeasurer.Measure(String.fromCharCode(0x0020)).Width; // ширина space
}

var MathDesign =
{
    bStruct: true
}

function Create_Structures()
{
    if(MathDesign.bStruct)
    {
        var Design = document.getElementById("Design");
        Design.style.display = "block";

        var Fraction = document.createElement("div");
        Fraction.id                       = "id_Fraction";
        Fraction.style["float"]           = "left";
        Fraction.style.backgroundImage    = "url('Math/img/structures.png')";
        Fraction.style.width              = "42px";
        Fraction.style.height             = "41px";
        Fraction.style.backgroundPosition = "0px 41px";
        Design.appendChild( Fraction );

        Fraction.onmouseover = function()
        {
            this.style.backgroundPosition = "0px 0px";
        }
        Fraction.onmouseout = function()
        {
            this.style.backgroundPosition = "0px 41px";
        }
        Fraction.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "18px";
            SetSizeContainer(80, 104, 4, 3);

            var dim =
            {
                sizeContainer: {column: 4, row : 3 },
                countEqt:     9,
                widthEqt:     80,
                heightEqt:    104

            };
            var path = "url('Math/img/fraction.png')";

            Set_Container(dim, path, 0);
            /*var Cont = document.getElementById("Container");
            Cont.style.display = "block";

            while(Cont.firstChild)
                Cont.removeChild(Cont.firstChild);

            Cont.style.width = "320px";
            Cont.style.height = "104px";

            var Bar = document.createElement("div");
            Bar.id                       = "id_bar";
            Bar.style["float"]           = "left";
            Bar.style.backgroundImage    = "url('Math/img/fraction.png')";
            Bar.style.width              = "80px";
            Bar.style.height             = "104px";
            Bar.style.backgroundPosition = "0px 0px";
            Cont.appendChild( Bar );

            Bar.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(0);
                MathRecalculate();
            }

            var Skewed = document.createElement("div");
            Skewed.id                       = "id_skewed";
            Skewed.style["float"]           = "left";
            Skewed.style.backgroundImage    = "url('Math/img/fraction.png')";
            Skewed.style.width              = "80px";
            Skewed.style.height             = "104px";
            Skewed.style.backgroundPosition = "240px 0px";
            Cont.appendChild( Skewed );

            Skewed.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(1);
                MathRecalculate();
            }

            var Linear = document.createElement("div");
            Linear.id                       = "id_linear";
            Linear.style["float"]           = "left";
            Linear.style.backgroundImage    = "url('Math/img/fraction.png')";
            Linear.style.width              = "80px";
            Linear.style.height             = "104px";
            Linear.style.backgroundPosition = "160px 0px";
            Cont.appendChild( Linear );

            Linear.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(2);
                MathRecalculate();
            }

            var Small = document.createElement("div");
            Small.id                       = "id_small";
            Small.style["float"]           = "left";
            Small.style.backgroundImage    = "url('Math/img/fraction.png')";
            Small.style.width              = "80px";
            Small.style.height             = "104px";
            Small.style.backgroundPosition = "80px 0px";
            Cont.appendChild( Small );

            Small.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(3);
                MathRecalculate();
            }*/

        }

        var Degree = document.createElement("div");
        Degree.style.id              = "id_degree";
        Degree.style["float"]        = "left";
        Degree.style.backgroundImage ="url('Math/img/structures.png')";
        Degree.style.width           = "43px";
        Degree.style.height          = "41px";
        Degree.style.backgroundPosition = "482px 41px";

        Design.appendChild(Degree);

        Degree.onmouseover = function()
        {
            this.style.backgroundPosition = "482px 0px";
        }
        Degree.onmouseout = function()
        {
            this.style.backgroundPosition = "482px 41px";
        }
        Degree.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "18px";

            SetSizeContainer(80, 104, 4, 2);

            var dim =
            {
                sizeContainer: {column: 4, row : 2 },
                countEqt:     8,
                widthEqt:     80,
                heightEqt:    104

            };
            var path = "url('Math/img/degree.png')";
            Set_Container(dim, path, 9);

            /*var Cont = document.getElementById("Container");
            Cont.style.display = "block";

            while(Cont.firstChild)
                Cont.removeChild(Cont.firstChild);

            Cont.style.width = "320px";
            Cont.style.height = "104px";

            var SubScript = document.createElement("div");
            SubScript.id                       = "id_SubScript";
            SubScript.style["float"]           = "left";
            SubScript.style.backgroundImage    = "url('Math/img/degree.png')";
            SubScript.style.width              = "80px";
            SubScript.style.height             = "104px";
            SubScript.style.backgroundPosition = "0px 0px";
            Cont.appendChild( SubScript );


            SubScript.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(4);
                MathRecalculate();
            }

            var SuperScript = document.createElement("div");
            SuperScript.id                       = "id_SuperScript";
            SuperScript.style["float"]           = "left";
            SuperScript.style.backgroundImage    = "url('Math/img/degree.png')";
            SuperScript.style.width              = "80px";
            SuperScript.style.height             = "104px";
            SuperScript.style.backgroundPosition = "240px 0px";
            Cont.appendChild( SuperScript );


            SuperScript.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(5);
                MathRecalculate();
            }

            var SubSuperScript = document.createElement("div");
            SubSuperScript.id                       = "id_SubSuperScript";
            SubSuperScript.style["float"]           = "left";
            SubSuperScript.style.backgroundImage    = "url('Math/img/degree.png')";
            SubSuperScript.style.width              = "80px";
            SubSuperScript.style.height             = "104px";
            SubSuperScript.style.backgroundPosition = "160px 0px";
            Cont.appendChild( SubSuperScript );

            SubSuperScript.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(6);
                MathRecalculate();
            }

            var Pre_SubSuperScript = document.createElement("div");
            Pre_SubSuperScript.id                       = "id_Pre_SubSuperScript";
            Pre_SubSuperScript.style["float"]           = "left";
            Pre_SubSuperScript.style.backgroundImage    = "url('Math/img/degree.png')";
            Pre_SubSuperScript.style.width              = "80px";
            Pre_SubSuperScript.style.height             = "104px";
            Pre_SubSuperScript.style.backgroundPosition = "80px 0px";
            Cont.appendChild( Pre_SubSuperScript );


            Pre_SubSuperScript.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(7);
                MathRecalculate();
            }*/

        }

        var Radical = document.createElement("div");
        Radical.style.id              = "id_radical";
        Radical.style["float"]        = "left";
        Radical.style.backgroundImage ="url('Math/img/structures.png')";
        Radical.style.width           = "48px";
        Radical.style.height          = "41px";
        Radical.style.backgroundPosition = "439px 41px";

        Design.appendChild(Radical);

        Radical.onmouseover = function()
        {
            this.style.backgroundPosition = "439px 0px";
        }
        Radical.onmouseout = function()
        {
            this.style.backgroundPosition = "439px 41px";
        }
        Radical.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "18px";
            SetSizeContainer(320, 208, 1, 1);

            var dim =
            {
                sizeContainer: {column: 4, row : 1 },
                countEqt:     4,
                widthEqt:     80,
                heightEqt:    104

            };
            var path = "url('Math/img/radical.png')";
            Set_Container(dim, path, 17);

            dim =
            {
                sizeContainer: {column: 2, row : 1 },
                countEqt:     2,
                widthEqt:     160,
                heightEqt:    104

            };
            path = "url('Math/img/radical_equat.png')";
            Set_Container(dim, path, 21);


            /*var Cont = document.getElementById("Container");
            Cont.style.display = "block";

            while(Cont.firstChild)
                Cont.removeChild(Cont.firstChild);

            Cont.style.width = "80px";
            Cont.style.height = "104px";

            var WO_Degr = document.createElement("div");
            WO_Degr.id                       = "id_WO_Degr";
            WO_Degr.style["float"]           = "left";
            WO_Degr.style.backgroundImage    = "url('Math/img/radical.png')";
            WO_Degr.style.width              = "80px";
            WO_Degr.style.height             = "104px";
            WO_Degr.style.backgroundPosition = "0px 0px";
            Cont.appendChild( WO_Degr );

            WO_Degr.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(8);
                MathRecalculate();
            }*/

        }

        var Integral = document.createElement("div");
        Integral.style.id              = "id_integral";
        Integral.style["float"]        = "left";
        Integral.style.backgroundImage ="url('Math/img/structures.png')";
        Integral.style.width           = "46px";
        Integral.style.height          = "41px";
        Integral.style.backgroundPosition = "391px 41px";

        Design.appendChild(Integral);

        Integral.onmouseover = function()
        {
            this.style.backgroundPosition = "391px 0px";
        }
        Integral.onmouseout = function()
        {
            this.style.backgroundPosition = "391px 41px";
        }
        Integral.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "60px";
            SetSizeContainer(80, 104, 3, 7);

            var dim =
            {
                sizeContainer: {column: 3, row : 7 },
                countEqt:     21,
                widthEqt:     80,
                heightEqt:    104

            };
            var path = "url('Math/img/integral.png')";
            Set_Container(dim, path, 23);

        }

        var Nary = document.createElement("div");
        Nary.style.id              = "id_nary";
        Nary.style["float"]        = "left";
        Nary.style.backgroundImage ="url('Math/img/structures.png')";
        Nary.style.width           = "37px";
        Nary.style.height          = "41px";
        Nary.style.backgroundPosition = "345px 41px";

        Design.appendChild(Nary);

        Nary.onmouseover = function()
        {
            this.style.backgroundPosition = "345px 0px";
        }
        Nary.onmouseout = function()
        {
            this.style.backgroundPosition = "345px 41px";
        }
        Nary.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "18px";
            SetSizeContainer(400, 936, 1, 1);

            var dim =
            {
                sizeContainer: {column: 5, row : 7 },
                countEqt:     35,
                widthEqt:     80,
                heightEqt:    104

            };
            var path = "url('Math/img/nary.png')";
            Set_Container(dim, path, 44);

            dim =
            {
                sizeContainer: {column: 4, row : 1 },
                countEqt:     3,
                widthEqt:     80,
                heightEqt:    104

            };
            path = "url('Math/img/nary_1.png')";
            Set_Container(dim, path, 79);

            dim =
            {
                sizeContainer: {column: 2, row : 1 },
                countEqt:     2,
                widthEqt:     160,
                heightEqt:    104

            };
            path = "url('Math/img/nary_2.png')";
            Set_Container(dim, path, 82);

            /*dim =
            {
                sizeContainer: {column: 4, row : 7 },
                countEqt:     2,
                widthEqt:     80,
                heightEqt:    104

            };
            path = "url('Math/img/radical_equat.png')";
            Set_Container(dim, path, 21);*/

            //document.getElementById("Container").style.height = "208px";

           /* var Cont = document.getElementById("Container");
            Cont.style.display = "block";

            while(Cont.firstChild)
                Cont.removeChild(Cont.firstChild);

            Cont.style.width = "320px";
            Cont.style.height = "208px";

            var SingleNary = document.createElement("div");
            SingleNary.id                       = "id_SingleNary";
            SingleNary.style["float"]           = "left";
            SingleNary.style.backgroundImage    = "url('Math/img/nary.png')";
            SingleNary.style.width              = "80px";
            SingleNary.style.height             = "104px";
            SingleNary.style.backgroundPosition = "0px 0px";
            Cont.appendChild( SingleNary );

            SingleNary.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(10);
                MathRecalculate();
            }

            var UndOvrNary = document.createElement("div");
            UndOvrNary.id                       = "id_UndOvrNary";
            UndOvrNary.style["float"]           = "left";
            UndOvrNary.style.backgroundImage    = "url('Math/img/nary.png')";
            UndOvrNary.style.width              = "80px";
            UndOvrNary.style.height             = "104px";
            UndOvrNary.style.backgroundPosition = "240px 0px";
            Cont.appendChild( UndOvrNary );

            UndOvrNary.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(11);
                MathRecalculate();
            }

            var UndNary = document.createElement("div");
            UndNary.id                       = "id_UndNary";
            UndNary.style["float"]           = "left";
            UndNary.style.backgroundImage    = "url('Math/img/nary.png')";
            UndNary.style.width              = "80px";
            UndNary.style.height             = "104px";
            UndNary.style.backgroundPosition = "160px 0px";
            Cont.appendChild( UndNary );


            UndNary.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(12);
                MathRecalculate();
            }

            var OvrNary = document.createElement("div");
            OvrNary.id                       = "id_OvrNary";
            OvrNary.style["float"]           = "left";
            OvrNary.style.backgroundImage    = "url('Math/img/nary.png')";
            OvrNary.style.width              = "80px";
            OvrNary.style.height             = "104px";
            OvrNary.style.backgroundPosition = "80px 0px";
            Cont.appendChild( OvrNary );

            OvrNary.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(13);
                MathRecalculate();
            }

            var SubNary = document.createElement("div");
            SubNary.id                       = "id_SubNary";
            SubNary.style["float"]           = "left";
            SubNary.style.backgroundImage    = "url('Math/img/nary.png')";
            SubNary.style.width              = "80px";
            SubNary.style.height             = "104px";
            SubNary.style.backgroundPosition = "0px 208px";
            Cont.appendChild( SubNary );

            SubNary.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(14);
                MathRecalculate();
            }

            var SubNaryUp = document.createElement("div");
            SubNaryUp.id                       = "id_SubNaryUp";
            SubNaryUp.style["float"]           = "left";
            SubNaryUp.style.backgroundImage    = "url('Math/img/nary.png')";
            SubNaryUp.style.width              = "80px";
            SubNaryUp.style.height             = "104px";
            SubNaryUp.style.backgroundPosition = "240px 208px";
            Cont.appendChild( SubNaryUp );

            SubNaryUp.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(15);
                MathRecalculate();
            }

            var SubNaryDown = document.createElement("div");
            SubNaryDown.id                       = "id_SubNaryDown";
            SubNaryDown.style["float"]           = "left";
            SubNaryDown.style.backgroundImage    = "url('Math/img/nary.png')";
            SubNaryDown.style.width              = "80px";
            SubNaryDown.style.height             = "104px";
            SubNaryDown.style.backgroundPosition = "160px 208px";
            Cont.appendChild( SubNaryDown );

            SubNaryDown.onmousedown = function()
            {
                document.getElementById("Container").style.display = "none";
                MathControl.AddMathComponent(16);
                MathRecalculate();
            }*/

        }

        var Bracket = document.createElement("div");
        Bracket.style.id              = "id_bracket";
        Bracket.style["float"]        = "left";
        Bracket.style.backgroundImage ="url('Math/img/structures.png')";
        Bracket.style.width           = "44px";
        Bracket.style.height          = "41px";
        Bracket.style.backgroundPosition = "308px 41px";

        Design.appendChild(Bracket);

        Bracket.onmouseover = function()
        {
            this.style.backgroundPosition = "308px 0px";
        }
        Bracket.onmouseout = function()
        {
            this.style.backgroundPosition = "308px 41px";
        }
        Bracket.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "136px";
            SetSizeContainer(320, 1248, 1, 1);

            var dim =
            {
                sizeContainer: {column: 4, row : 9 },
                countEqt:     34,
                widthEqt:     80,
                heightEqt:    104

            };
            var path    = "url('Math/img/bracket.png')";
            Set_Container(dim, path, 84);

            dim =
            {
                sizeContainer: {column: 4, row : 1 },
                countEqt:     4,
                widthEqt:     80,
                heightEqt:    104

            };
            path    = "url('Math/img/bracket_1.png')";
            Set_Container(dim, path, 118);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     160,
                heightEqt:    104

            };
            path    = "url('Math/img/bracket_2.png')";
            Set_Container(dim, path, 122);

            dim =
            {
                sizeContainer: {column: 2, row : 1 },
                countEqt:     2,
                widthEqt:     80,
                heightEqt:    104

            };
            path    = "url('Math/img/bracket_3.png')";
            Set_Container(dim, path, 123);

        }


        var Trign = document.createElement("div");
        Trign.style.id              = "id_trign";
        Trign.style["float"]        = "left";
        Trign.style.backgroundImage ="url('Math/img/structures.png')";
        Trign.style.width           = "50px";
        Trign.style.height          = "41px";
        Trign.style.backgroundPosition = "264px 41px";

        Design.appendChild(Trign);

        Trign.onmouseover = function()
        {
            this.style.backgroundPosition = "264px 0px";
        }
        Trign.onmouseout = function()
        {
            this.style.backgroundPosition = "264px 41px";
        }
        Trign.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "184px";
            SetSizeContainer(80, 104, 3, 10);

            var dim =
            {
                sizeContainer: {column: 3, row : 9 },
                countEqt:     26,
                widthEqt:     80,
                heightEqt:    104

            };
            var path    = "url('Math/img/trig_function.png')";
            Set_Container(dim, path, 125);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     160,
                heightEqt:    104

            };
            path    = "url('Math/img/trig_function_1.png')";
            Set_Container(dim, path, 151);
        }

        var Accent = document.createElement("div");
        Accent.style.id              = "id_accent";
        Accent.style["float"]        = "left";
        Accent.style.backgroundImage ="url('Math/img/structures.png')";
        Accent.style.width           = "43px";
        Accent.style.height          = "41px";
        Accent.style.backgroundPosition = "214px 41px";

        Design.appendChild(Accent);

        Accent.onmouseover = function()
        {
            this.style.backgroundPosition = "214px 0px";
        }
        Accent.onmouseout = function()
        {
            this.style.backgroundPosition = "214px 41px";
        }
        Accent.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "211px";
            SetSizeContainer(56, 80, 5, 7);

            var dim =
            {
                sizeContainer: {column: 5, row : 4 },
                countEqt:     20,
                widthEqt:     56,
                heightEqt:    80

            };
            var path    = "url('Math/img/accent.png')";
            Set_Container(dim, path, 152);

            dim =
            {
                sizeContainer: {column: 5, row : 1 },
                countEqt:     2,
                widthEqt:     56,
                heightEqt:    80
            }
            path    = "url('Math/img/accent_1.png')";
            Set_Container(dim, path, 172);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     56,
                heightEqt:    80
            }
            path    = "url('Math/img/accent_2.png')";
            Set_Container(dim, path, 174);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     168,
                heightEqt:    80
            }
            path    = "url('Math/img/accent_3.png')";
            Set_Container(dim, path, 175);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     56,
                heightEqt:    80
            }

            Set_EmptyDiv(dim);

            dim =
            {
                sizeContainer: {column: 2, row : 1 },
                countEqt:     2,
                widthEqt:     56,
                heightEqt:    80
            }
            path    = "url('Math/img/accent_4.png')";
            Set_Container(dim, path, 176);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     112,
                heightEqt:    80
            }
            path    = "url('Math/img/accent_5.png')";
            Set_Container(dim, path, 177);


        }

        var Limit = document.createElement("div");
        Limit.style.id              = "id_limit";
        Limit.style["float"]        = "left";
        Limit.style.backgroundImage ="url('Math/img/structures.png')";
        Limit.style.width           = "59px";
        Limit.style.height          = "41px";
        Limit.style.backgroundPosition = "171px 41px";

        Design.appendChild(Limit);

        Limit.onmouseover = function()
        {
            this.style.backgroundPosition = "171px 0px";
        }
        Limit.onmouseout = function()
        {
            this.style.backgroundPosition = "171px 41px";
        }
        Limit.onmousedown = function()
        {
            Clean_Container();
            document.getElementById("Container").style.left = "282px";
            SetSizeContainer(80, 104, 3, 3);

            var dim =
            {
                sizeContainer: {column: 3, row : 2 },
                countEqt:     6,
                widthEqt:     80,
                heightEqt:    104

            };
            var path    = "url('Math/img/logarithm.png')";
            Set_Container(dim, path, 178);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     128,
                heightEqt:    104

            };
            path    = "url('Math/img/logarithm_1.png')";
            Set_Container(dim, path, 184);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     112,
                heightEqt:    104

            };
            path    = "url('Math/img/logarithm_2.png')";
            Set_Container(dim, path, 185);
        }

        var Operator = document.createElement("div");
        Operator.style.id              = "id_operator";
        Operator.style["float"]        = "left";
        Operator.style.backgroundImage ="url('Math/img/structures.png')";
        Operator.style.width           = "59px";
        Operator.style.height          = "41px";
        Operator.style.backgroundPosition = "112px 41px";

        Design.appendChild(Operator);

        Operator.onmouseover = function()
        {
            this.style.backgroundPosition = "112px 0px";
        }
        Operator.onmouseout = function()
        {
            this.style.backgroundPosition = "112px 41px";
        }
        Operator.onmousedown = function()
        {
            Clean_Container();
            SetSizeContainer(56, 80, 4, 6);
            document.getElementById("Container").style.left = 542 - 224 - 17 + "px" ; // 542 /*общая ширина*/ - 224 /*ширина контейнера*/ - 17 /*ширина скролла*/

            var dim =
            {
                sizeContainer: {column: 4, row : 2 },
                countEqt:     7,
                widthEqt:     56,
                heightEqt:    80

            };
            var path    = "url('Math/img/operators.png')";
            Set_Container(dim, path, 186);

            dim =
            {
                sizeContainer: {column: 4, row : 3 },
                countEqt:     12,
                widthEqt:     56,
                heightEqt:    80

            };
            path    = "url('Math/img/operators_1.png')";
            Set_Container(dim, path, 193);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     104,
                heightEqt:    80

            };
            path    = "url('Math/img/operators_2.png')";
            Set_Container(dim, path, 205);

            dim =
            {
                sizeContainer: {column: 1, row : 1 },
                countEqt:     1,
                widthEqt:     56,
                heightEqt:    80

            };
            path    = "url('Math/img/operators_3.png')";
            Set_Container(dim, path, 206);
        }


        var Matrix = document.createElement("div");
        Matrix.style.id              = "id_matrix";
        Matrix.style["float"]        = "left";
        Matrix.style.backgroundImage ="url('Math/img/structures.png')";
        Matrix.style.width           = "53px";
        Matrix.style.height          = "41px";
        Matrix.style.backgroundPosition = "53px 41px";

        Design.appendChild(Matrix);

        Matrix.onmouseover = function()
        {
            this.style.backgroundPosition = "53px 0px";
        }
        Matrix.onmouseout = function()
        {
            this.style.backgroundPosition = "53px 41px";
        }
        Matrix.onmousedown = function()
        {
            Clean_Container();
            SetSizeContainer(80, 104, 4, 6);
            document.getElementById("Container").style.left = 542 - 320 - 17 + "px" ; // 542 /*общая ширина*/ - 224 /*ширина контейнера*/

            var dim =
            {
                sizeContainer: {column: 4, row : 5 },
                countEqt:     20,
                widthEqt:     80,
                heightEqt:    104

            };
            var path    = "url('Math/img/matrix.png')";
            Set_Container(dim, path, 207);

            dim =
            {
                sizeContainer: {column: 2, row : 1 },
                countEqt:     2,
                widthEqt:     160,
                heightEqt:    104

            };
            path    = "url('Math/img/matrix_1.png')";
            Set_Container(dim, path, 227);
        }

        MathDesign.bStruct = false;
    }

}
function MathRecalculate()
{
    editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
        Left   : X_Left_Field,
        Right  : X_Right_Field,
        Top    : Y_Top_Field,
        Bottom : Y_Bottom_Field
    } } );
}

function Clean_Container()
{
    var Cont = document.getElementById("Container");
    Cont.style.display = "block";

    Cont.style.width = 0;
    Cont.style.height = 0;

    while(Cont.firstChild)
        Cont.removeChild(Cont.firstChild);
}
function SetSizeContainer(width, height, column, row)
{
    var Cont = document.getElementById("Container");

    if(row*height > 416)
    {
        Cont.style.overflowY = "scroll"; // при auto скролл потом появляется где нужно и где нет(инвизибл), ширину cкролла не подсчитаешь
        //Cont.style.width = 0;
        var scrollWidth =  - Cont.scrollWidth;
        Cont.style.width = column*width + scrollWidth + "px";
        Cont.style.height = "416px";

    }
    else
    {
        Cont.style.overflowY = "";
        Cont.style.width = column*width + "px";
        Cont.style.height = row*height + "px";

    }

}
function Set_Container(dimension, path, index)
{
    var Cont = document.getElementById("Container");
    Cont.style.display = "block";


    var column = dimension.sizeContainer.column,
        row    = dimension.sizeContainer.row,
        count  = dimension.countEqt,
        width  = dimension.widthEqt,
        height = dimension.heightEqt;


    /*Cont.style.height = row*height + "px";
    Cont.style.width = column*width + "px";*/

    /* if(row < 5)
    {
        Cont.style.height = row*height + "px";
        Cont.style.overflowY = "";
        Cont.style.width = column*width + "px";
    }
    else
    {
        Cont.style.height = 4*height + "px";
        Cont.style.overflowY = "scroll"; // при auto скролл потом появляется где нужно и где нет(инвизибл), ширину cкролла не подсчитаешь
        Cont.style.width = 0;
        var scrollWidth =  - Cont.scrollWidth;
        Cont.style.width = column*width + scrollWidth + "px";
    }*/

    for(var i = 0; i < row; i++)
    {
        for(var j = 0; j < column; j++)
        {
            var obj = document.createElement("div");
            obj.style["float"]           = "left";
            obj.style.backgroundImage    = path;
            obj.style.width              = width +"px";
            obj.style.height             = height +"px";
            obj.style.backgroundPosition = (column - j)*width+ "px " + (row - i)*height + "px";


            Cont.appendChild(obj);

            if( i*column + (j+1) <= count )
                obj.onmousedown = function(_i, _j)
                {
                    return function()
                    {
                        document.getElementById("Container").style.display = "none";
                        MathControl.AddMathComponent(index + _i*column + _j);
                        editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
                            Left   : X_Left_Field,
                            Right  : X_Right_Field,
                            Top    : Y_Top_Field,
                            Bottom : Y_Bottom_Field
                        } } );
                    }
                }(i, j);


            /*obj.onmouseover = function(_i, _j)
            {
                return function()
                {
                    var image = document.createElement("img");
                    image.id = "frame";
                    image.style.top =  (row - _i)*height - 3 - _i*8 + "px";
                    image.style.left = (column - _j)*width - 5 -_j*10  + "px";
                    image.style.position = "absolute";
                    image.src = "Math/img/frame.png";

                    Cont.appendChild(image);


                    *//*obj.style.backgroundImage    = "url('Math/img/frame.png')";
                    obj.style.width              = width +"px";
                    obj.style.height             = height +"px";
                    obj.style.backgroundPosition = (column - _j)*width+ "px " + (row - _i)*height + "px";

                    obj.style.backgroundImage    = path;
                    obj.style.width              = width - 20 +"px";
                    obj.style.height             = height - 20 +"px";
                    obj.style.backgroundPosition = (column - _j)*width - 5 -_j*10  + "px " + (row - _i)*height - 3 - _i*8 + "px";*//*
                }
            }(i, j);

            obj.onmouseout = function(_i, _j)
            {
                return function()
                {
                    var frame = document.getElementById("frame");
                    Cont.removeChild(frame);
                    *//*obj.style.width              = width +"px";
                    obj.style.height             = height +"px";
                    obj.style.backgroundPosition = (column - _j)*width + "px " + (row - _i)*height + "px";*//*
                }
            }(i, j);*/

        }
    }

}
function Set_EmptyDiv(dimension)
{
    var Cont = document.getElementById("Container");

    var width  = dimension.widthEqt,
        height = dimension.heightEqt;

    var obj = document.createElement("div");
    obj.style["float"]           = "left";

    obj.style.width              = width +"px";
    obj.style.height             = height +"px";
    Cont.appendChild(obj);
}

function Test_Line()
{
    var E = {CharCode: 0x20};

    for(var i=0; i < 10; i++)
    {
        var size = 14 + i*4;
        var font = Common_CopyObj(default_font);
        font.FontSize = size;

        MathControl.AddMathComponent(14);
        MathControl.Content[0].TestFont(font);
        MathControl.OnKeyPress(E);
    }
}

function Test_Dot()
{
    var E = {CharCode: 0x20};

    var code = 0x61;
    var temp = 0;

    for(var i=0; i < 25; i++)
    {
        if(code == 0x6C)
            var qq = 0;
        MathControl.AddMathComponent(7);
        MathControl.Content[0].CurrentContent.content[1 + temp].value.add(code);
        MathControl.OnKeyPress(E);
        code++;
        temp = (i+1)*3;
    }

}

function Single_Test_Dot()
{
    var E = {CharCode: 0x20};

    var code = 0x66;

    MathControl.AddMathComponent(7);
    MathControl.Content[0].CurrentContent.content[1].value.add(code);
    MathControl.OnKeyPress(E);

}