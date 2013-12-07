//поправить центр у N-арных операторов
/*
 FRACTION
 MATH_FUNCTION
 NARY
 BOX (доделать Spacing)
 DEGREE
 DEGREE_SubSup
 RADICAL
 LIMIT
 */

//Bugs

//При добавлении в началло контента элемента , он вставляется с размером шрифта 11, посмотреть getCurrRunPrp
// При удаление из начала контента элемента, у всех остальных автоматом 11 размер шрифта

/// TODO

//  1. после того, как будет реализован селект с учетом RunPrp, убрать проверки из remove на RunPrp (!)
//  1. properties для записи в файл
//  2. плейсхолдер на чтение
//  3. убрать slashWidth
//  4. центр => baseline
//  5. сделать gaps для мат. объектов, +, - в зависимости от расположения в контенте
//  6. объединение формул на remove и add
//  7. ctr + shift


/// TODO

// !!! Проверить типы для groupCharacter, delimiters и accent
// 1. Посмотреть стрелки и прочее для delimiters (которые используются для accent), при необходимости привести к одному типу
// 2. Убрать ненужные(!!) setTxtPrp и getTxtPrp
// 3. Проверить что будет, если какие-то настройки убрать/добавить из ctrPrp, влияют ли они на отрисовку управляющих элементов (например, Italic, Bold)
// 4. Протестировать n-арные операторы, когда добавляется текст вместо оператора (mouseDown не работает, выровнено как alignTop)

var historyitem_Math_AddItem                   =  1; // Добавляем элемент
var historyitem_Math_RemoveItem                =  2; // Удаляем элемент

var TEST = true;


var  DEFAULT_RUN_PRP =
{
    FontFamily:     {Name  : "Cambria Math", Index : -1 },
    FontSize:       11,
    Italic:         true,
    Bold:           false,
    RFonts:         {},
    Lang:           {}
};
var StartTextElement = 0x2B1A; // Cambria Math

function dist(_left, _right, _top, _bottom)
{
    this.left = _left;
    this.right = _right;
    this.top = _top;
    this.bottom = _bottom;
}
function mathElem(val)
{
    this.value = val;
    this.widthToEl = 0; // width to this element
    this.g_mContext =
    {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }; //mm
}

function CMathRunPrp()
{
    this.typeObj = MATH_RUN_PRP;
    this.textPrp = new CTextPr();
    this.mathPrp = new CMPrp();
    this.size = {width: 0, height: 0, center: 0, ascent: 0};
}
CMathRunPrp.prototype =
{
    Merge: function(rPrp)
    {
        this.textPrp.Merge(rPrp);
    },
    getWRunPrp: function()
    {
        // смержить c MRunPrp
        return this.textPrp;
    },
    setTxtPrp: function(oWPrp)
    {
        this.textPrp.Merge(oWPrp);
    },
    setMathRunPrp: function(oMPrp)
    {
        this.mathPrp.Merge(oMPrp);
    },
    draw: function() {},
    setPosition: function() {},
	relate: function() {},
    getPropsForWrite: function()
    {
        var props = {};

        props.textPrp    = this.textPrp;
        props.mathRunPrp = this.mathPrp.getPropsForWrite();

        return props;
    }
}

function CMPrp()
{
    this.aln    = false;
    this.brk    = false;
    this.lit    = false;
    this.nor    = false;        // если normal = false, то берем TextPrp отсюда (в wRunPrp bold/italic не учитываем, выставляем отсюда)
                                // если normal = true, то их Word не учитывает и берет TextPr из wRunPrp
    this.scr    = SCR_ROMAN;
    this.italic = true;
    this.bold   = false;
    this.plain  = false;     // plain тоже самое, что и щкьфд, только нельзы поставить другой шрифт, другой размер шрифта и тп

}
CMPrp.prototype =
{
    Merge:  function(mPrp)
    {
        this.SetBProp(this.aln, mPrp.aln);
        this.SetBProp(this.brk, mPrp.brk);
        this.SetBProp(this.lit, mPrp.lit);
        this.SetBProp(this.nor, mPrp.nor);

        // если приходит несколько параметров style из xml, то запоминается последний
        if(mPrp.sty === "i")
            this.italic = true;
        else if(mPrp.sty === "bi")
        {
            this.italic = true;
            this.bold = true;
        }
        else if(mPrp.sty === "b")
        {
            this.italic = false;
            this.bold = true;
        }
        else if(mPrp === "p")
        {
            this.plain = true;
        }

        if(mPrp.scr === "double-struck")
            this.scr = SCR_DOUBLE_STRUCK;
        else if(mPrp.scr === "monospace")
            this.scr = SCR_MONOSPACE;
        else if(mPrp.scr === "fraktur")
            this.scr = SCR_FRAKTUR;
        else if(mPrp.scr === "sans-serif")
            this.scr = SCR_SANS_SERIF;
        else if(mPrp.scr === "script")
            this.scr = SCR_SCRIPT;

    },
    SetBProp:    function(obj, prp)
    {
        if(prp === 1 || prp === true)
            obj = true;
        else if(prp === 0 || prp === false)
            obj = false;
    },
    getProps: function()
    {
        var props =
        {
            align:      this.aln,
            brk:        this.brk,
            literal:    this.lit,
            normal:     this.nor,
            script:     this.src,
            italic:     this.italic,
            bold:       this.bold,
            plain:      this.plain
        };

        return props;
    },
    getPropsForWrite: function()
    {
        var props = {};

        var Italic     = this.italic && !this.bold,
            BoldItalic = this.italic && this.bold,
            Bold       = this.bold && !this.italic,
            Plain      = this.plain;

        if(this.nor)
        {
            props.nor = 1;
        }
        else
        {
            if(BoldItalic)
                props.sty = "bi";
            else if(Bold)
                props.sty = "b";
            else if(Plain)
                props.sty = "p";
        }

        if(this.aln)
            props.aln = 1;

        if(this.brk)
            props.brk = 1;

        if(this.lit)
            props.lit = 1;


        if( this.scr === SCR_DOUBLE_STRUCK)
            props.scr = "double-struck";
        else if(this.scr === SCR_MONOSPACE)
            props.scr = "monospace";
        else if(this.scr === SCR_FRAKTUR)
            props.scr = "fraktur";
        else if(this.scr === SCR_SANS_SERIF)
            props.scr = "sans-serif";
        else if(this.scr === SCR_SCRIPT)
            props.scr = "script";
        

        return props;
    }
}


//TODO
// доделать GroupCharacter / Delimiter в качестве cheracter может быть любой символ

//TODO
//переделать/продумать DotIndef, т.к. при перетаскивании из одного места в другое флаг DotIndef может измениться для другого контента

//TODO
//пересмотреть this.dW и this.dH

//TODO
//добавить gaps для мат элементов и математических знаков

//TODO
//сделать, чтобы курсор выставлялся только, где это действительно необходимо
//в качетве позиции для контента передавать положение baseLine для него

//TODO
//пересмотреть/убрать CSubMathBase




// TODO Refactoring

// 1. (!!) повтор IsIncline, IsHighElement


function CMathContent()
{
    this.bDot       =   false;
    this.plhHide    =   false;
    this.bRoot      =   false;

    this.content = new Array(); // array of mathElem
    this.CurPos = 0;
    this.pos = {x:0,    y:0};
    this.g_mContext =   null;

    /*this.RunPrp = new CTextPr();
    this.TxtPrp = new CTextPr();*/

    //this.TxtPrp = new CMathTextPrp();
    //this.OwnTPrp = new CMathTextPrp();
    this.Composition = null; // ссылка на общую формулу

    this.reduct     =   1;      // индефикатор для степени (уменьшение размера шрифта)


    ////**  real select  **////
    this.RealSelect =
    {
        startPos:   0,  // эти позиции идут на отрисовку селекта
        endPos:     0   // и по ним удаляем элементы из контента
    };
    ///////////////////////////////

    ////**   logical select  **////
    this.LogicalSelect =
    {
        start:  0,      //  логические позиции селекта !!
        end:    0       //  откуда начали и где закончили селект
                        //  особенно важна стартовая позиция
    };
    ///////////////////////////////

    this.size =
    {
        width: 0,
        height: 0,
        center: 0
    };

    this.init();

}
CMathContent.prototype =
{
    init: function()
    {
        this.g_mContext = new dist(0,0,0,0);
        this.content.push( new mathElem(new CEmpty(), new dist(0,0,0,0), 0) );
    },
    // переделать для селекта
    getSelectTPrp: function(bSelect)
    {
        var start, end;

        if(bSelect)
        {
            start = this.RealSelect.startPos;
            end = this.RealSelect.endPos;
        }
        else
        {
            start = 0;
            end = this.content.length;
        }

        if( this.selectUse() )
        {

            if(start > end)
            {
                tmp = start;
                start = end;
                end = tmp;
            }
        }
        var TComp = new CMathTextPrp();

        if(start !== end)
        {
            var txtPrp = this.content[start].value.getOwnTPrp();

            for(var i = start + 1; i < end; i++)
            {
                txtPrp2 = this.content[i].value.getOwnTPrp();
                if(txtPrp.FontSize !== -1)
                {
                    if(txtPrp.FontSize !== txtPrp2.FontSize)
                        txtPrp.FontSize = -1;
                }

                if(txtPrp.Bold !== -1)
                {
                    if(txtPrp.Bold !== txtPrp2.Bold)
                        txtPrp.Bold = -1;
                }

                if(txtPrp.Italic !== -1)
                {
                    if(txtPrp.Italic !== txtPrp2.Italic)
                        txtPrp.Italic = -1;
                }

                if(txtPrp.FontFamily !== -1)
                {
                    if( Common_CmpObj2 (txtPrp.FontFamily, txtPrp2.FontFamily) )
                        txtPrp.FontFamily = -1;
                }
            }
            TComp.Merge( this.textPrp );
            TComp.Merge(this.Composition.TxtPrp);

            TComp.Merge(txtPrp);

            if(TComp.FontSize == -1)
                TComp.FontSize = undefined;

            if(TComp.Bold == -1)
                TComp.Bold = undefined;

            if(TComp.Italic == -1)
                TComp.Italic = undefined;

            if(TComp.FontFamily == -1)
                TComp.FontFamily = undefined;

        }
        else
        {
            TComp.Merge( this.getRunPrp(start) );
            TComp.Merge(this.Composition.TxtPrp);
        }


        return TComp;
    },
    addTxt: function(txt)
    {
        var Pos = this.CurPos;

        for(var i = 0; i < txt.length; i++)
        {
            this.addLetter( txt.charCodeAt(i));
        }

        this.setLogicalPosition(this.CurPos);
        //this.setStart_Selection(this.CurPos);
        //this.selection.active = false;

        var EndPos = this.CurPos;

        var items = this.content.slice(Pos, EndPos);

        return items;
    },
    addLetter: function(code)
    {
        this.verifyRPrp_Letter();

        /*var gps = null;
        if(code == 0x002B || code == 0x002F || code == 0x002A || code == 0x002D)
        {
            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 ) *g_dKoef_pix_to_mm;
            l_gap = r_gap = 0;
            gps = new dist(l_gap, r_gap, 0, 0);
        }
        else
            gps = new dist(0,0,0,0);*/

        //собственно добавляем сам элемент

        if(code == 42)      // "*"
            code = 8727;
        else if(code == 45) // "-"
            code = 8722;

        if(this.bDot)
        {
            if(code === 0x69)
                code = 0x1D6A4;
            if(code === 0x6A)
                code =  0x1D6A5;
        }

        var symb = new CMathText();
        symb.add(code);

        this.addToContent(symb);
        var item = this.content[this.CurPos];

        return [item];
    },
    addMComponent: function(ind)
    {
        //var l_gap =  0, r_gap = 0;
        var mathElem = null;    //положение этого элемента будет this.CurPos + 1


        switch(ind)
        {
            case MATH_FRACTION:
                mathElem = new CFraction();
                break;
            case MATH_DEGREE:
                mathElem = new CDegree();
                break;
            case MATH_DEGREESubSup:
                mathElem = new CDegreeSubSup();
                break;
            case MATH_RADICAL:
                mathElem = new CRadical();
                break;
            case MATH_NARY:
                mathElem = new CNary();
                break;
            case MATH_DELIMITER:
                mathElem = new CDelimiter();
                break;
            case MATH_GROUP_CHARACTER:
                mathElem = new CGroupCharacter();
                break;
            case MATH_FUNCTION:
                mathElem = new CMathFunc();
                break;
            case MATH_ACCENT:
                mathElem = new CAccent();
                break;
            case MATH_BORDER_BOX:
                mathElem = new CBorderBox();
                break;
            case MATH_LIMIT:
                mathElem = new CLimit();
                break;
            case MATH_MATRIX:
                mathElem = new CMathMatrix();
                break;
            case MATH_BOX:
                mathElem = new CBox();
                break;
            case MATH_EQ_ARRAY:
                mathElem = new CEqArray();
                break;
            case MATH_BAR:
                mathElem = new CBar();
                break;

        }

        if( mathElem !== null )
        {

            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 )*g_dKoef_pix_to_mm;

            mathElem.relate(this);
            mathElem.setTypeElement(ind);
            //mathElem.setComposition(this.Composition);

            var ctrPrp = new CTextPr();

            if(this.CurPos > 0) // т.к. всегда добавляем только в текущий контент, то если контент не пуст, в начале стоят либо runPrp, либо другой MathObj
            {
                ctrPrp = this.getCurrRunPrp();
            }
            else if(!this.bRoot && this.content.length == 1) // нет RunPrp, добавляем мат. объект
            {
                ctrPrp.Merge( this.Parent.getCtrPrp() );
            }
            else if(this.bRoot && this.content.length == 1)
            {
                ctrPrp.Merge( this.Composition.GetTxtPrp() );
            }
            else //на всякий случай
            {
                ctrPrp.Merge(DEFAULT_RUN_PRP);
            }

            mathElem.setCtrPrp(ctrPrp);

            var shift;
            if(this.content[this.CurPos].value.typeObj === MATH_RUN_PRP)
                shift = -1;
            else
                shift = 0;

            this.addToContent(mathElem, shift);

            var empty = new CEmpty();
            this.addToContent(empty, shift);

            this.verifyRPrp_MC(ctrPrp);

        }

        return mathElem; // for finished equation
    },

    addElementToContent: function(obj)   //for "read"
    {
        var element = new mathElem(obj);
        obj.relate(this);
		
		if(obj.typeObj === MATH_COMP)
			obj.setComposition(this.Composition);

        this.content.push(element);
        this.CurPos++;

        if(obj.typeObj === MATH_COMP)
            this.addElementToContent( new CEmpty() );

        this.setLogicalPosition(this.CurPos);
        //this.setStart_Selection(this.CurPos);
        //this.selection.active = false;
    },
    addToContent: function(obj, shift)          // for "edit"
    {
        var elem = new mathElem(obj);

        if(obj.typeObj === MATH_COMP)
            obj.setComposition(this.Composition);

        var bDef = typeof(shift) !== "undefined" && shift !== null;
        var bNum = shift === shift - 0;
        var bCont = bNum ? ( this.CurPos + shift >= 0 && this.CurPos + shift < this.content.length) : false;

        if(!(bDef || bNum || bCont))
            shift = 0;

        var tmp = this.content.splice(0, this.CurPos + 1 + shift );
        tmp.push(elem);
        tmp = tmp.concat( this.content.splice(0, this.content.length) );

        this.content.length = 0;
        this.content = tmp;

        this.CurPos++;
        this.setLogicalPosition(this.CurPos);
        //this.setStart_Selection(this.CurPos);
        //this.selection.active = false;
    },
    addToContent_2: function(content) // for "menu"
    {

    },
    setComposition: function(Composition)
    {
        this.Composition = Composition;
    },
    setReferenceComposition: function(Comp) // отличие от setComposition: ссылка на общую формулу передается всем элементам контента
    {
        this.Composition = Comp;
        for(var i = 1; i < this.content.length; i++)
        {
            if(this.content[i].value.typeObj == MATH_COMP)
                this.content[i].value.setReferenceComposition(Comp);
        }
    },
    createEquation: function(ind)
    {
        var Pos = this.CurPos + 1;
        //var lng = this.content.length;

        switch(ind)
        {
            case 0:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                fract.fillPlaceholders();
                break;
            case 1:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: SKEWED_FRACTION});
                fract.fillPlaceholders();
                break;
            case 2:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: LINEAR_FRACTION});
                fract.fillPlaceholders();
                break;
            case 3:
                /*var fract = this.addMComponent(0);
                fract.init();
                fract.setSimple(true);
                fract.fillPlaceholders();*/
                break;
            case 4:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("dy");
                var den = fract.getDenominator();
                den.addTxt("dx");
                break;
            case 5:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("Δy");
                var den = fract.getDenominator();
                den.addTxt("Δx");
                break;
            case 6:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("∂y");
                var den = fract.getDenominator();
                den.addTxt("∂x");
                break;
            case 7:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("δy");
                var den = fract.getDenominator();
                den.addTxt("δx");
                break;
            case 8:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("π");
                var den = fract.getDenominator();
                den.addTxt("2");
                break;
            case 9:
                var degr = this.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                degr.fillPlaceholders();
                break;
            case 10:
                var degr = this.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUBSCRIPT});
                degr.fillPlaceholders();
                break;
            case 11:
                var degrSupSup = this.addMComponent(MATH_DEGREESubSup);
                degrSupSup.init({type: DEGREE_SubSup});
                degrSupSup.fillPlaceholders();
                break;
            case 12:
                var degrSupSup = this.addMComponent(MATH_DEGREESubSup);
                degrSupSup.init({type: DEGREE_PreSubSup});
                degrSupSup.fillPlaceholders();
                break;
            case 13:
                var degr = this.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUBSCRIPT});
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();

                var degr2 = iter.addMComponent(MATH_DEGREE);
                degr2.init({type: DEGREE_SUPERSCRIPT});
                var base2 = degr2.getBase();
                base2.addTxt("y");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");

                break;
            case 14:
                var degr = this.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.addTxt("e");
                var iter = degr.getIterator();
                iter.addTxt("-iωt");
                break;
            case 15:
                var degr = this.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();
                iter.addTxt("2");
                break;
            case 16:
                var degrSupSup = this.addMComponent(MATH_DEGREESubSup);
                degrSupSup.init({type: DEGREE_PreSubSup});
                var base = degrSupSup.getBase();
                base.addTxt("Y");
                var iter1 = degrSupSup.getUpperIterator();
                iter1.addTxt("n");
                var iter2 = degrSupSup.getLowerIterator();
                iter2.addTxt("1");
                break;
            case 17:
                var rad = this.addMComponent(MATH_RADICAL);
                rad.init({type: SQUARE_RADICAL});
                rad.fillPlaceholders();
                break;
            case 18:
                var rad = this.addMComponent(MATH_RADICAL);
                rad.init({type: DEGREE_RADICAL});
                rad.fillPlaceholders();
                break;
            case 19:
                var rad = this.addMComponent(MATH_RADICAL);
                rad.init({type: DEGREE_RADICAL});
                degr = rad.getDegree();
                degr.addTxt("2");
                base = rad.getBase();
                base.fillPlaceholders();
                break;
            case 20:
                var rad = this.addMComponent(MATH_RADICAL);
                rad.init({type: DEGREE_RADICAL});
                degr = rad.getDegree();
                degr.addTxt("3");
                base = rad.getBase();
                base.fillPlaceholders();
                break;
            case 21:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("-b±");

                var rad = num.addMComponent(MATH_RADICAL);
                rad.init({type: SQUARE_RADICAL});
                var base = rad.getBase();
                var degree = base.addMComponent(MATH_DEGREE);
                degree.init({type: DEGREE_SUPERSCRIPT});
                var baseDg = degree.getBase();
                baseDg.addTxt("b");
                var iter = degree.getIterator();
                iter.addTxt("2");
                base.addTxt("-4ac");

                var den = fract.getDenominator();
                den.addTxt("2a");
                break;
            case 22:
                var rad = this.addMComponent(MATH_RADICAL);
                rad.init({type: SQUARE_RADICAL});
                var base = rad.getBase();

                degr1 = base.addMComponent(MATH_DEGREE);
                degr1.init({type: DEGREE_SUPERSCRIPT});
                var base1 = degr1.getBase();
                base1.addTxt("a");
                var iter1 = degr1.getIterator();
                iter1.addTxt("2");

                base.addTxt("+");

                degr2 = base.addMComponent(MATH_DEGREE);
                degr2.init({type: DEGREE_SUPERSCRIPT});
                var base2 = degr2.getBase();
                base2.addTxt("b");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");

                break;
            case 23:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTEGRAL,
                    limLoc:         NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 24:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTEGRAL,
                    limLoc:         NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 25:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 26:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_DOUBLE_INTEGRAL,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 27:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_DOUBLE_INTEGRAL,
                    limLoc:     NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 28:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_DOUBLE_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 29:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_TRIPLE_INTEGRAL,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 30:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_TRIPLE_INTEGRAL,
                    limLoc:     NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 31:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_TRIPLE_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 32:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_CONTOUR_INTEGRAL,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 33:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_CONTOUR_INTEGRAL,
                    limLoc:     NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 34:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_CONTOUR_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 35:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SURFACE_INTEGRAL,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 36:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SURFACE_INTEGRAL,
                    limLoc:     NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 37:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SURFACE_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 38:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_VOLUME_INTEGRAL,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 39:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_VOLUME_INTEGRAL,
                    limLoc:     NARY_SubSup
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 40:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_VOLUME_INTEGRAL,
                    limLoc:     NARY_UndOvr
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 41:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    type:       BOX_DIFF,
                    spacing:    1
                };
                box.init(props);
                var base = box.getElement();
                base.addTxt("dx");
                break;
            case 42:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    type:       BOX_DIFF,
                    spacing:    1
                };
                box.init(props);
                var base = box.getElement();
                base.addTxt("dy");
                break;
            case 43:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    type:       BOX_DIFF,
                    spacing:    1
                };
                box.init(props);
                var base = box.getElement();
                base.addTxt("dθ");
                break;
            case 44:
                var integr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                integr.init(props);
                integr.fillPlaceholders();
                break;
            case 45:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_UndOvr
                };
                sigma.init(props);
                sigma.fillPlaceholders();
                break;
            case 46:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_SubSup
                };
                sigma.init(props);
                sigma.fillPlaceholders();
                break;
            case 47:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                sigma.init(props);
                sigma.fillPlaceholders();
                break;
            case 48:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                sigma.init(props);
                sigma.fillPlaceholders();
                break;
            case 49:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                product.init(props);
                product.fillPlaceholders();
                break;
            case 50:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:     NARY_UndOvr
                };
                product.init(props);
                product.fillPlaceholders();
                break;
            case 51:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:     NARY_SubSup
                };
                product.init(props);
                product.fillPlaceholders();
                break;
            case 52:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                product.init(props);
                product.fillPlaceholders();
                break;
            case 53:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                product.init(props);
                product.fillPlaceholders();
                break;
            case 54:
                var coproduct = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_COPRODUCT,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                coproduct.init(props);
                coproduct.fillPlaceholders();
                break;
            case 55:
                var coproduct = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_COPRODUCT,
                    limLoc:     NARY_UndOvr
                };
                coproduct.init(props);
                coproduct.fillPlaceholders();
                break;
            case 56:
                var coproduct = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_COPRODUCT,
                    limLoc:     NARY_SubSup
                };
                coproduct.init(props);
                coproduct.fillPlaceholders();
                break;
            case 57:
                var coproduct = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_COPRODUCT,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                coproduct.init(props);
                coproduct.fillPlaceholders();
                break;
            case 58:
                var coproduct = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_COPRODUCT,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                coproduct.init(props);
                coproduct.fillPlaceholders();
                break;

            case 59:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                union.init(props);
                union.fillPlaceholders();
                break;
            case 60:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:     NARY_UndOvr
                };
                union.init(props);
                union.fillPlaceholders();
                break;
            case 61:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:     NARY_SubSup
                };
                union.init(props);
                union.fillPlaceholders();
                break;
            case 62:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                union.init(props);
                union.fillPlaceholders();
                break;
            case 63:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                union.init(props);
                union.fillPlaceholders();
                break;

            case 64:
                var intersection = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTERSECTION,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                intersection.init(props);
                intersection.fillPlaceholders();
                break;
            case 65:
                var intersection = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTERSECTION,
                    limLoc:     NARY_UndOvr
                };
                intersection.init(props);
                intersection.fillPlaceholders();
                break;
            case 66:
                var intersection = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTERSECTION,
                    limLoc:     NARY_SubSup
                };
                intersection.init(props);
                intersection.fillPlaceholders();
                break;
            case 67:
                var intersection = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTERSECTION,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                intersection.init(props);
                intersection.fillPlaceholders();
                break;
            case 68:
                var intersection = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_INTERSECTION,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                intersection.init(props);
                intersection.fillPlaceholders();
                break;

            case 69:
                var logicalOr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_OR,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                logicalOr.init(props);
                logicalOr.fillPlaceholders();
                break;
            case 70:
                var logicalOr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_OR,
                    limLoc:     NARY_UndOvr
                };
                logicalOr.init(props);
                logicalOr.fillPlaceholders();
                break;
            case 71:
                var logicalOr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_OR,
                    limLoc:     NARY_SubSup
                };
                logicalOr.init(props);
                logicalOr.fillPlaceholders();
                break;
            case 72:
                var logicalOr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_OR,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                logicalOr.init(props);
                logicalOr.fillPlaceholders();
                break;
            case 73:
                var logicalOr = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_OR,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                logicalOr.init(props);
                logicalOr.fillPlaceholders();
                break;

            case 74:
                var logicalAnd = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_AND,
                    limLoc:     NARY_UndOvr,
                    subHide:        true,
                    supHide:        true
                };
                logicalAnd.init(props);
                logicalAnd.fillPlaceholders();
                break;
            case 75:
                var logicalAnd = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_AND,
                    limLoc:     NARY_UndOvr
                };
                logicalAnd.init(props);
                logicalAnd.fillPlaceholders();
                break;
            case 76:
                var logicalAnd = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_AND,
                    limLoc:     NARY_SubSup
                };
                logicalAnd.init(props);
                logicalAnd.fillPlaceholders();
                break;
            case 77:
                var logicalAnd = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_AND,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                logicalAnd.init(props);
                logicalAnd.fillPlaceholders();
                break;
            case 78:
                var logicalAnd = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_LOGICAL_AND,
                    limLoc:     NARY_SubSup,
                    subHide:        true
                };
                logicalAnd.init(props);
                logicalAnd.fillPlaceholders();
                break;

            case 79:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:     NARY_UndOvr,
                    subHide:        true
                };
                sigma.init(props);
                var iterLow = sigma.getLowerIterator();
                iterLow.addTxt("k");

                var base = sigma.getBase();
                var delim = base.addMComponent(MATH_DELIMITER);
                props =
                {
                    begChrType:      PARENTHESIS_LEFT,
                    endChrType:      PARENTHESIS_RIGHT,
                    shapeType:       DELIMITER_SHAPE_MATH,
                    column:          1

                };
                delim.init(props);

                var base2 = delim.getBase();
                var fract = base2.addMComponent(MATH_FRACTION);
                props =
                {
                    type:   NO_BAR_FRACTION
                };
                fract.init(props);
                var num = fract.getNumerator();
                num.addTxt("n");

                var den = fract.getDenominator();
                den.addTxt("k");
                break;
            case 80:
                var sigma = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:         NARY_UndOvr
                };
                sigma.init(props);

                var iterUp = sigma.getUpperIterator();
                iterUp.addTxt("n");
                var iterLow = sigma.getLowerIterator();
                iterLow.addTxt("i=0");
                var base = sigma.getBase();
                base.fillPlaceholders();
                break;
            case 81:
                var product = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_PRODUCT,
                    limLoc:         NARY_UndOvr
                };
                product.init(props);
                var iterUp = product.getUpperIterator();
                iterUp.addTxt("n");
                var iterLow = product.getLowerIterator();
                iterLow.addTxt("k=1");
                var base = product.getBase();
                var degr = base.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUBSCRIPT});
                var baseDgr = degr.getBase();
                baseDgr.addTxt("A");
                var iter = degr.getIterator();
                iter.addTxt("k");
                break;
            case 82:
                var nary = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_SIGMA,
                    limLoc:         NARY_UndOvr,
                    subHide:        true
                };
                nary.init(props);
                var base = nary.getBase();
                base.addTxt("P");
                var delim = base.addMComponent(MATH_DELIMITER);
                props =
                {
                    begChrType:     PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    shapeType:      DELIMITER_SHAPE_MATH,
                    column:         1
                };
                delim.init(props);
                var base2 = delim.getBase();
                base2.addTxt("i, j");

                var iter = nary.getLowerIterator();
                var eqqArray = iter.addMComponent(MATH_EQ_ARRAY);
                props =
                {
                    row:        2
                };
                eqqArray.init(props);
                var upArr = eqqArray.getElement(0, 0);
                upArr.addTxt("0≤ i ≤ m");
                var lowArr = eqqArray.getElement(1, 0);
                lowArr.addTxt("0<j<n");

                break;
            case 83:
                var union = this.addMComponent(MATH_NARY);
                var props =
                {
                    signType:       NARY_UNION,
                    limLoc:         NARY_UndOvr
                };
                union.init(props);

                var iterUp = union.getUpperIterator();
                iterUp.addTxt("m");
                var iterLow = union.getLowerIterator();
                iterLow.addTxt("n=1");

                var base = union.getBase();
                var delim = base.addMComponent(MATH_DELIMITER);
                props =
                {
                    begChrType:    PARENTHESIS_LEFT,
                    endChrType:    PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base2 = delim.getBase();

                var degrX = base2.addMComponent(MATH_DEGREE);
                props =
                {
                    type:   DEGREE_SUBSCRIPT
                };
                degrX.init(props);

                var baseX = degrX.getBase();
                baseX.addTxt("X");
                var iterX = degrX.getIterator();
                iterX.addTxt("n");

                base2.addTxt("∩");

                var degrY = base2.addMComponent(MATH_DEGREE);
                degrY.init(props);

                var baseY = degrY.getBase();
                baseY.addTxt("Y");
                var iterY = degrY.getIterator();
                iterY.addTxt("n");

                break;
            case 84:
                var delim = this.addMComponent(MATH_DELIMITER);
                /*var props =
                {
                    begChr:    {type: BRACKET_SQUARE_RIGHT},
                    endChr:    {type: BRACKET_SQUARE_LEFT},
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:    1
                };*/
                var props =
                 {
                 begChrType:    PARENTHESIS_LEFT,
                 endChrType:    PARENTHESIS_RIGHT,
                 shapeType:     DELIMITER_SHAPE_MATH,
                 column:        1
                 };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 85:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_SQUARE_LEFT,
                    endChrType:    BRACKET_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 86:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_CURLY_LEFT,
                    endChrType:    BRACKET_CURLY_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 87:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_ANGLE_LEFT,
                    endChrType:    BRACKET_ANGLE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 88:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    HALF_SQUARE_LEFT,
                    endChrType:    HALF_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 89:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    HALF_SQUARE_LEFT_UPPER,
                    endChrType:    HALF_SQUARE_RIGHT_UPPER,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 90:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    DELIMITER_LINE,
                    endChrType:    DELIMITER_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 91:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    DELIMITER_DOUBLE_LINE,
                    endChrType:    DELIMITER_DOUBLE_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 92:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_SQUARE_LEFT,
                    endChrType:    BRACKET_SQUARE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 93:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_SQUARE_RIGHT,
                    endChrType:    BRACKET_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 94:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_SQUARE_RIGHT,
                    endChrType:    BRACKET_SQUARE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 95:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    WHITE_SQUARE_LEFT,
                    endChrType:    WHITE_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 96:
                var delim = this.addMComponent(MATH_DELIMITER);
                /*var props =
                {
                    begChr:    {type: PARENTHESIS_LEFT},
                    sepChr:    {type: BRACKET_ANGLE_LEFT},
                    endChr:    {type: BRACKET_CURLY_RIGHT},
                    column:    2
                };*/
                var props =
                {
                    begChrType:    PARENTHESIS_LEFT,
                    sepChrType:    DELIMITER_LINE,
                    endChrType:    PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        2
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 97:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_CURLY_LEFT,
                    sepChrType:    DELIMITER_LINE,
                    endChrType:    BRACKET_CURLY_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        2
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
                break;
            case 98:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_ANGLE_LEFT,
                    sepChrType:    DELIMITER_LINE,
                    endChrType:    BRACKET_ANGLE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:         2
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 99:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_ANGLE_LEFT,
                    sepChrType:    DELIMITER_LINE,
                    endChrType:    BRACKET_ANGLE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        3
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 100:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    PARENTHESIS_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 101:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 102:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_SQUARE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 103:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    BRACKET_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 104:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_CURLY_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 105:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    BRACKET_CURLY_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 106:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_ANGLE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 107:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    BRACKET_ANGLE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 108:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    HALF_SQUARE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 109:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    HALF_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 110:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    HALF_SQUARE_LEFT_UPPER,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 111:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    HALF_SQUARE_RIGHT_UPPER,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 112:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    DELIMITER_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 113:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    DELIMITER_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 114:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    DELIMITER_DOUBLE_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 115:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    DELIMITER_DOUBLE_LINE,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 116:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    WHITE_SQUARE_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 117:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    endChrType:    WHITE_SQUARE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 118:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_CURLY_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     1
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 119:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_CURLY_LEFT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     1
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 120:
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: NO_BAR_FRACTION});
                fract.fillPlaceholders();
                break;
            case 121:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base = delim.getBase();
                var fract = base.addMComponent(MATH_FRACTION);
                fract.init({type: NO_BAR_FRACTION});
                fract.fillPlaceholders();
                break;
            case 122:
                this.addTxt("f");
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                base.addTxt("x");
                this.addTxt("=");
                var bracket = this.addMComponent(MATH_DELIMITER);
                props =
                {
                    begChrType:     BRACKET_CURLY_LEFT,
                    column:         1
                };
                bracket.init(props);
                var base2 = bracket.getBase();
                var eqArr = base2.addMComponent(MATH_EQ_ARRAY);
                props =
                {
                    row:    2
                };
                eqArr.init(props);
                var firstRow = eqArr.getElement(0, 0);
                firstRow.addTxt("-x,        x<0");
                var secRow = eqArr.getElement(1, 0);
                secRow.addTxt("   x,        x≥0");

                break;
            case 123:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base = delim.getBase();
                var fract = base.addMComponent(MATH_FRACTION);
                fract.init({type: NO_BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("n");

                var den = fract.getDenominator();
                den.addTxt("k");
                break;
            case 124:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:    BRACKET_ANGLE_LEFT,
                    endChrType:     BRACKET_ANGLE_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                var base = delim.getBase();
                var fract = base.addMComponent(MATH_FRACTION);
                fract.init({type: NO_BAR_FRACTION});
                var num = fract.getNumerator();
                num.addTxt("n");

                var den = fract.getDenominator();
                den.addTxt("k");
                break;
            case 125:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("sin");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 126:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("cos");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 127:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("tan");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 128:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("csc");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 129:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("sec");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 130:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("cot");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 131:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("sin");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 132:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("cos");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 133:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("tan");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 134:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("csc");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 135:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("sec");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 136:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("cot");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;

            case 137:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("sinh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 138:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("cosh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 139:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("tanh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 140:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("csch");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 141:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("sech");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 142:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("coth");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;

            case 143:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("sinh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 144:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("cosh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 145:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("tanh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 146:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("csch");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 147:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("sech");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 148:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                var degr = func.addMComponent(MATH_DEGREE);
                degr.init({type: DEGREE_SUPERSCRIPT});
                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("coth");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 149:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("sin");
                var arg = trig.getArgument();
                arg.addTxt("θ");
                break;
            case 150:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("cos");
                var arg = trig.getArgument();
                arg.addTxt("2x");
                break;
            case 151:
                var trig = this.addMComponent(MATH_FUNCTION);
                trig.init();
                var func = trig.getFName();
                func.setItalic(false);
                func.addTxt("tan");
                var arg = trig.getArgument();
                arg.addTxt("θ");
                this.addTxt("=");
                var fract = this.addMComponent(MATH_FRACTION);
                fract.init({type: BAR_FRACTION});
                var num = fract.getNumerator();
                var sin = num.addMComponent(MATH_FUNCTION);
                sin.init();
                var func1 = sin.getFName();
                func.setItalic(false);
                func1.addTxt("sin");
                var arg1 = sin.getArgument();
                arg1.addTxt("θ");
                var den = fract.getDenominator();
                var cos = den.addMComponent(MATH_FUNCTION);
                cos.init();
                var func2 = cos.getFName();
                func2.addTxt("cos");
                func.setItalic(false);
                var arg2 = cos.getArgument();
                arg2.addTxt("θ");
                break;
            case 152:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_ONE_DOT
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 153:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_TWO_DOTS
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 154:

                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_THREE_DOTS
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 155:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_COMB_CARON
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 156:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_CIRCUMFLEX
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 157:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_ACUTE
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 158:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_GRAVE
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 159:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_BREVE
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 160:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_TILDE
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 161:
                var line = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_LINE
                };
                line.init(props);
                line.fillPlaceholders();
                break;
            case 162:
                var line = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:      ACCENT_DOUBLE_LINE
                };
                line.init(props);
                line.fillPlaceholders();
                break;
            case 163:
                var delim = this.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        BRACKET_CURLY_TOP,
                    location:       LOCATION_TOP,
                    vertJc:         VJUST_BOT
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 164:
                var delim = this.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    location:       LOCATION_BOT,
                    vertJc:       VJUST_TOP
                };
                delim.init(props);
                delim.fillPlaceholders();
                break;
            case 165:
                var lim = this.addMComponent(MATH_LIMIT);
                var props =
                {
                    type:   LIMIT_UP
                };
                lim.init(props);
                var iter = lim.getIterator();
                iter.fillPlaceholders();
                var func = lim.getFName();
                var grCh = func.addMComponent(MATH_GROUP_CHARACTER);
                var props2 =
                {
                    chrType:        BRACKET_CURLY_TOP,
                    location:       LOCATION_TOP,
                    vertJc:       VJUST_BOT
                };
                grCh.init(props2);
                grCh.fillPlaceholders();
                break;
            case 166:
                var lim = this.addMComponent(MATH_LIMIT);
                var props =
                {
                    type:   LIMIT_LOW
                };
                lim.init(props);
                var iter = lim.getIterator();
                iter.fillPlaceholders();
                var func = lim.getFName();
                var grCh = func.addMComponent(MATH_GROUP_CHARACTER);
                var props2 =
                {
                    chrType:        BRACKET_CURLY_BOTTOM,
                    location:       LOCATION_BOT,
                    vertJc:       VJUST_TOP
                };
                grCh.init(props2);
                grCh.fillPlaceholders();
                break;
            case 167:
                var accent = this.addMComponent(MATH_ACCENT);
                props =
                {
                    chrType:        ACCENT_ARROW_LEFT
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 168:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:        ACCENT_ARROW_RIGHT
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 169:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:        ACCENT_ARROW_LR
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 170:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:        ACCENT_HALF_ARROW_LEFT
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 171:
                var accent = this.addMComponent(MATH_ACCENT);
                var props =
                {
                    chrType:        ACCENT_HALF_ARROW_RIGHT
                };
                accent.init(props);
                accent.fillPlaceholders();
                break;
            case 172:
                var bar = this.addMComponent(MATH_BAR);
                var props =
                {
                    location:    LOCATION_TOP
                };
                bar.init(props);
                bar.fillPlaceholders();
                break;
            case 173:
                var bar = this.addMComponent(MATH_BAR);
                var props =
                {
                    location:    LOCATION_BOT
                };
                bar.init(props);
                bar.fillPlaceholders();
                break;
            case 174:
                var borderBox = this.addMComponent(MATH_BORDER_BOX);
                borderBox.init();
                borderBox.fillPlaceholders();
                break;
            case 175:
                var borderBox = this.addMComponent(MATH_BORDER_BOX);
                borderBox.init(props);

                var arg = borderBox.getBase();

                var degrA = arg.addMComponent(MATH_DEGREE);
                var props = {type:   DEGREE_SUPERSCRIPT};
                degrA.init(props);
                var baseA = degrA.getBase();
                baseA.addTxt("a");
                var iterA = degrA.getIterator();
                iterA.addTxt("2");

                arg.addTxt("=");

                var degrB = arg.addMComponent(MATH_DEGREE);
                degrB.init(props);
                var baseB = degrB.getBase();
                baseB.addTxt("b");
                var iterB = degrB.getIterator();
                iterB.addTxt("2");

                arg.addTxt("+");

                var degrC = arg.addMComponent(MATH_DEGREE);
                degrC.init(props);
                var baseC = degrC.getBase();
                baseC.addTxt("c");
                var iterC = degrC.getIterator();
                iterC.addTxt("2");

                break;
            case 176:
                var bar = this.addMComponent(MATH_BAR);
                var props =
                {
                    location:    LOCATION_TOP
                };
                bar.init(props);
                var base = bar.getBase();
                base.addTxt("A");
                break;
            case 177:
                var bar = this.addMComponent(MATH_BAR);
                var props =
                {
                    location:    LOCATION_TOP
                };
                bar.init(props);
                var base = bar.getBase();
                base.addTxt("ABC");
                break;
            case 178:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();

                var arg = func.getArgument();
                arg.fillPlaceholders();
                var log = func.getFName();
                var degr = log.addMComponent(MATH_DEGREE);
                var props =
                {
                    type:   DEGREE_SUBSCRIPT
                };
                degr.init(props);

                var base = degr.getBase();
                base.setItalic(false);
                base.addTxt("log");
                var iter = degr.getIterator();
                iter.fillPlaceholders();
                break;
            case 179:
                var log = this.addMComponent(MATH_FUNCTION);
                log.init();
                var func = log.getFName();
                func.setItalic(false);
                func.addTxt("log");
                var arg = log.getArgument();
                arg.fillPlaceholders();
                break;
            case 180:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();
                var fName = func.getFName();

                var min = fName.addMComponent(MATH_LIMIT);
                min.init({type: LIMIT_LOW});
                var base = min.getFName();
                base.setItalic(false);
                base.addTxt("lim");
                var iter = min.getIterator();
                iter.fillPlaceholders();

                var arg = func.getArgument();
                arg.fillPlaceholders();
                break;
            case 181:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();
                var fName = func.getFName();

                var min = fName.addMComponent(MATH_LIMIT);
                min.init({type: LIMIT_LOW});
                var base = min.getFName();
                base.setItalic(false);
                base.addTxt("min");
                var iter = min.getIterator();
                iter.fillPlaceholders();

                var arg = func.getArgument();
                arg.fillPlaceholders();
                break;
            case 182:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();
                var fName = func.getFName();

                var min = fName.addMComponent(MATH_LIMIT);
                min.init({type: LIMIT_LOW});
                var base = min.getFName();
                base.setItalic(false);
                base.addTxt("max");
                var iter = min.getIterator();
                iter.fillPlaceholders();

                var arg = func.getArgument();
                arg.fillPlaceholders();
                break;
            case 183:
                var log = this.addMComponent(MATH_FUNCTION);
                log.init();
                var func = log.getFName();
                func.setItalic(false);
                func.addTxt("ln");
                var arg = log.getArgument();
                arg.fillPlaceholders();
                break;
            case 184:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();
                var fName = func.getFName();
                var limit = fName.addMComponent(MATH_LIMIT);
                var props =
                {
                    type:   LIMIT_LOW
                };
                limit.init(props);
                var iter = limit.getIterator();
                iter.addTxt("n→∞");
                var fName2 = limit.getFName();
                fName2.setItalic(false);
                fName2.addTxt("lim");

                var arg = func.getArgument();
                var degr = arg.addMComponent(MATH_DEGREE);
                props =
                {
                    type:   DEGREE_SUPERSCRIPT
                };
                degr.init(props);
                var iter2 = degr.getIterator();
                iter2.addTxt("n");
                var base = degr.getBase();
                var delim = base.addMComponent(MATH_DELIMITER);
                props =
                {
                    begChrType:        PARENTHESIS_LEFT,
                    endChrType:    PARENTHESIS_RIGHT,
                    shapeType:     DELIMITER_SHAPE_MATH,
                    column:        1
                };
                delim.init(props);
                base2 = delim.getBase();
                base2.addTxt("1+");
                var frac = base2.addMComponent(MATH_FRACTION);
                props =
                {
                    type:   BAR_FRACTION
                };
                frac.init(props);
                var num = frac.getNumerator();
                num.addTxt("1");

                var den = frac.getDenominator();
                den.addTxt("n");
                break;
            case 185:
                var func = this.addMComponent(MATH_FUNCTION);
                func.init();
                var fName = func.getFName();
                var max = fName.addMComponent(MATH_LIMIT);
                var props =
                {
                    type:   LIMIT_LOW
                };
                max.init(props);
                var fName2 = max.getFName();
                fName2.setItalic(false);
                fName2.addTxt("max");
                var iter = max.getIterator();
                iter.addTxt("0≤x≤1");

                var arg = func.getArgument();
                arg.addTxt("x");
                var degr = arg.addMComponent(MATH_DEGREE);
                props =
                {
                    type:   DEGREE_SUPERSCRIPT
                };
                degr.init(props);
                var base = degr.getBase();
                base.addTxt("e");

                var iter2 = degr.getIterator();
                iter2.addTxt("-");
                var degr2 = iter2.addMComponent(MATH_DEGREE);
                props =
                {
                    type:   DEGREE_SUPERSCRIPT
                };
                degr2.init(props);
                var base2 = degr2.getBase();
                base2.addTxt("x");
                var iter3 = degr2.getIterator();
                iter3.addTxt("2");
                break;
            case 186:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:  true
                };
                box.init(props);
                var arg = box.getBase();
                arg.addTxt("∶=");
                break;
            case 187:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:  true
                };
                box.init(props);
                var arg = box.getBase();
                arg.addTxt("==");
                break;
            case 188:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:  true
                };
                box.init(props);
                var arg = box.getBase();
                arg.addTxt("+=");
                break;
            case 189:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:  true
                };
                box.init(props);
                var arg = box.getBase();
                arg.addTxt("-=");
                break;
            case 190:
                this.addTxt("≝");
                break;
            case 191:
                this.addTxt("≞");
                break;
            case 192:
                this.addTxt("≜");
                break;
            case 193:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_LEFT,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 194:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_RIGHT,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 195:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_LEFT,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 196:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_RIGHT,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 197:
                var arrow = this.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_LEFT_ARROW,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 198:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_RIGHT_ARROW,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 199:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_LEFT_ARROW,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 200:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_RIGHT_ARROW,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 201:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_LR,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 202:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_LR,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 203:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_ARROW_LR,
                    location:       LOCATION_TOP
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 204:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        DOUBLE_ARROW_LR,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                arrow.fillPlaceholders();
                break;
            case 205:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_RIGHT,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                var base = arrow.getBase();
                base.addTxt("yields");
                break;
            case 206:
                var box = this.addMComponent(MATH_BOX);
                var props =
                {
                    opEmu:      true
                };
                box.init(props);
                var base = box.getBase();
                var arrow = base.addMComponent(MATH_GROUP_CHARACTER);
                var props =
                {
                    chrType:        ARROW_RIGHT,
                    vertJc:         VJUST_BOT
                };
                arrow.init(props);
                var base = arrow.getBase();
                base.addTxt("∆");
                break;
            case 207:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       1,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 208:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     1
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 209:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       1,
                    column:     3
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 210:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     1
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 211:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 212:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     3
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 213:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 214:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     3
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 215:
                this.addTxt("⋯");
                break;
            case 216:
                this.addTxt("…");
                break;
            case 217:
                this.addTxt("⋮");
                break;
            case 218:
                this.addTxt("⋱");
                break;
            case 219:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                elem1 = matrix.getElement(0,0);
                elem1.addTxt("1");

                elem2 = matrix.getElement(0,1);
                elem2.addTxt("0");

                elem3 = matrix.getElement(1,0);
                elem3.addTxt("0");

                elem4 = matrix.getElement(1,1);
                elem4.addTxt("1");
                break;
            case 220:
                var matrix = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       2,
                    column:     2,
                    plcHide:    true
                };
                matrix.init(props);

                elem1 = matrix.getElement(0,0);
                elem1.addTxt("1");

                elem2 = matrix.getElement(0,1);
                elem2.fillPlaceholders();

                elem3 = matrix.getElement(1,0);
                elem3.fillPlaceholders();

                elem4 = matrix.getElement(1,1);
                elem4.addTxt("1");
                break;
            case 221:
                var matrix  = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     3
                };
                matrix.init(props);

                elem1 = matrix.getElement(0,0);
                elem1.addTxt("1");

                elem2 = matrix.getElement(0,1);
                elem2.addTxt("0");

                elem3 = matrix.getElement(0,2);
                elem3.addTxt("0");

                elem4 = matrix.getElement(1,0);
                elem4.addTxt("0");

                elem5 = matrix.getElement(1,1);
                elem5.addTxt("1");

                elem6 = matrix.getElement(1,2);
                elem6.addTxt("0");

                elem7 = matrix.getElement(2,0);
                elem7.addTxt("0");

                elem8 = matrix.getElement(2,1);
                elem8.addTxt("0");

                elem9 = matrix.getElement(2,2);
                elem9.addTxt("1");

                break;
            case 222:
                var matrix  = this.addMComponent(MATH_MATRIX);
                var props =
                {
                    row :       3,
                    column:     3,
                    plcHide:    true
                };
                matrix.init(props);

                elem1 = matrix.getElement(0,0);
                elem1.addTxt("1");

                elem2 = matrix.getElement(0,1);
                elem2.fillPlaceholders();

                elem3 = matrix.getElement(0,2);
                elem3.fillPlaceholders();

                elem4 = matrix.getElement(1,0);
                elem4.fillPlaceholders();

                elem5 = matrix.getElement(1,1);
                elem5.addTxt("1");

                elem6 = matrix.getElement(1,2);
                elem6.fillPlaceholders();

                elem7 = matrix.getElement(2,0);
                elem7.fillPlaceholders();

                elem8 = matrix.getElement(2,1);
                elem8.fillPlaceholders();

                elem9 = matrix.getElement(2,2);
                elem9.addTxt("1");
                break;
            case 223:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 224:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     BRACKET_SQUARE_LEFT,
                    endChrType:     BRACKET_SQUARE_RIGHT,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 225:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     DELIMITER_LINE,
                    endChrType:     DELIMITER_LINE,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 226:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     DELIMITER_DOUBLE_LINE,
                    endChrType:     DELIMITER_DOUBLE_LINE,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       2,
                    column:     2
                };
                matrix.init(props);
                matrix.fillPlaceholders();
                break;
            case 227:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     PARENTHESIS_LEFT,
                    endChrType:     PARENTHESIS_RIGHT,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       3,
                    column:     3
                };
                matrix.init(props);

                elem1 = matrix.getElement(0,0);
                elem1.fillPlaceholders();

                elem2 = matrix.getElement(0,1);
                elem2.addTxt("⋯");

                elem3 = matrix.getElement(0,2);
                elem3.fillPlaceholders();

                elem4 = matrix.getElement(1,0);
                elem4.addTxt("⋮");

                elem5 = matrix.getElement(1,1);
                elem5.addTxt("⋱");

                elem6 = matrix.getElement(1,2);
                elem6.addTxt("⋮");

                elem7 = matrix.getElement(2,0);
                elem7.fillPlaceholders();

                elem8 = matrix.getElement(2,1);
                elem8.addTxt("⋯");

                elem9 = matrix.getElement(2,2);
                elem9.fillPlaceholders();

                break;
            case 228:
                var delim = this.addMComponent(MATH_DELIMITER);
                var props =
                {
                    begChrType:     BRACKET_SQUARE_LEFT,
                    endChrType:     BRACKET_SQUARE_RIGHT,
                    column:         1
                };
                delim.init(props);
                var base = delim.getBase();
                var matrix = base.addMComponent(MATH_MATRIX);
                props =
                {
                    row :       3,
                    column:     3
                };
                matrix.init(props);

                elem1 = matrix.getElement(0,0);
                elem1.fillPlaceholders();

                elem2 = matrix.getElement(0,1);
                elem2.addTxt("⋯");

                elem3 = matrix.getElement(0,2);
                elem3.fillPlaceholders();

                elem4 = matrix.getElement(1,0);
                elem4.addTxt("⋮");

                elem5 = matrix.getElement(1,1);
                elem5.addTxt("⋱");

                elem6 = matrix.getElement(1,2);
                elem6.addTxt("⋮");

                elem7 = matrix.getElement(2,0);
                elem7.fillPlaceholders();

                elem8 = matrix.getElement(2,1);
                elem8.addTxt("⋯");

                elem9 = matrix.getElement(2,2);
                elem9.fillPlaceholders();

                break;

        }

        var EndPos = this.CurPos + 1;
        //var EndPos = Pos + this.content.length - lng; // запоминаем ве элементы, которые были добавлены, не только до той позиции, где стоит курсор (для текста могут быть добавлены дополнительно RunPrp)

        if(!TEST)
        {
            History.Create_NewPoint();
            var Items = this.content.slice(Pos, EndPos);
            History.Add(this, {Type: historyitem_Math_AddItem, Items: Items, Pos: Pos, PosEnd: EndPos});
        }

        var items = this.content.slice(Pos, EndPos);

        return items;
    },
    removeAreaSelect: function()
    {
        if( this.IsPlaceholder() ) //удаляем тагет
        {
            var empty = this.content[0]; //CEmpty
            this.content.length = 0;
            this.content.push( empty );
            this.CurPos = 0;
        }
        else if( this.selectUse() ) //т.к. после того как удалили тагет у нас эти 2 значения не равны, равенство их выставляется позднее, после добавления символа
            this.remove(1);
    },
    setReduct: function(coeff)
    {
        this.reduct = this.reduct*coeff;
    },
    relate: function(parent)
    {
        if(parent === -1)
        {
            this.bRoot = true;
            this.Parent = null;
        }
        else
        {
            this.bRoot = false;
            this.Parent = parent;
        }
    },
    fillPlaceholders: function()
    {
        var placeholder = new CMathText();
        placeholder.relate(this);
        //placeholder.addCode(StartTextElement);
        placeholder.fillPlaceholders();
        //placeholder.setTxtPrp(this.getTxtPrp());

        this.content.push( new mathElem( placeholder ) );
    },

    /////////   перемещение     //////////
    old_old_cursor_moveRight: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if(this.IsPlaceholder())
        {
            var movement = this.Parent.cursor_moveRight();
            CurrContent = SelectContent = movement.SelectContent;
        }
        else if(this.CurPos!= this.content.length - 1 || this.selectUse())
        {
            if ( !this.selection.active  )
            {
                //в случае если есть селект
                if(this.selection.startPos != this.selection.endPos)
                {
                    var start = this.selection.startPos;
                    var end = this.selection.endPos;
                    if(start > end)
                    {
                        var tmp = start;
                        start = end;
                        end = tmp;
                    }

                    this.CurPos = end - 1;

                    SelectContent = this;
                    CurrContent   = this;
                }
                //пришли из базового класса
                else if( this.content[this.CurPos].value.typeObj === MATH_COMP )
                {
                    this.CurPos++;

                    SelectContent = this;
                    CurrContent   = this;

                }
                else
                {
                    //если нет селекта, то просто перемещаемся по контенту
                    this.CurPos++;

                    if( this.content[this.CurPos].value.typeObj === MATH_COMP )
                    {
                        CurrContent = SelectContent = this.content[this.CurPos].value.goToFirstElement();
                    }
                    else
                        CurrContent = SelectContent = this;

                }

                this.setStart_Selection(this.CurPos);
                this.selection.active = false;
            }
            else
            {
                //по идее нужно выставлять SelectContent здесь, когда зажат shift и перемещаемся по стрелкам
                this.select_moveRight();
            }
        }
        else
        {
            if( ! this.bRoot )
            {
                var movement = this.Parent.cursor_moveRight();
                SelectContent = CurrContent = movement.SelectContent;
            }
            else
                state = false;
        }

        return {state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    old_cursor_moveRight: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if(this.IsPlaceholder())
        {
            var movement = this.Parent.cursor_moveRight();
            CurrContent = SelectContent = movement.SelectContent;
        }
        else if(this.CurPos!= this.content.length - 1 || this.selectUse())
        {
            //в случае если есть селект
            if(this.selectUse())
            {
                var start = this.RealSelect.startPos;
                var end = this.RealSelect.endPos;
                if(start > end)
                {
                    var tmp = start;
                    start = end;
                    end = tmp;
                }

                this.CurPos = end - 1;

                SelectContent = this;
                CurrContent   = this;
            }
            //пришли из базового класса
            else if( this.content[this.CurPos].value.typeObj === MATH_COMP )
            {
                this.CurPos++;

                SelectContent = this;
                CurrContent   = this;

            }
            else
            {
                //если нет селекта, то просто перемещаемся по контенту
                this.CurPos++;

                if( this.content[this.CurPos].value.typeObj === MATH_COMP )
                {
                    CurrContent = SelectContent = this.content[this.CurPos].value.goToFirstElement();
                }
                else
                    CurrContent = SelectContent = this;

            }

            //this.setStart_Selection(this.CurPos);
            this.setLogicalPosition(this.CurPos);
        }
        else
        {
            if( ! this.bRoot )
            {
                var movement = this.Parent.cursor_moveRight();
                SelectContent = CurrContent = movement.SelectContent;
            }
            else
                state = false;
        }

        return {state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    select_moveRight: function()
    {
        var res = true;

        if(this.selection.endPos < this.content.length)
        {
            if( this.content[this.selection.startPos - 1].value.typeObj === MATH_COMP)
            {
                if ( ! this.content[this.CurPos].value.select_moveRight() )
                {
                    //выход за границы мат. объекта
                    var _active = this.selection.active;
                    this.setStart_Selection(this.CurPos - 1);
                    this.selection.active = _active;
                    this.setEnd_Selection(this.CurPos + 1);
                }
            }
            else if(this.content[this.selection.endPos].value.typeObj === MATH_COMP && ( this.selection.startPos - this.selection.endPos == 2) )
            {
                //селект одного мат. эелемента

                this.content[this.selection.endPos].value.drawSelect();
                this.setStart_Selection(this.CurPos);
            }
            else
            {
                if(this.content[this.selection.endPos].value.typeObj === MATH_COMP) // если последнюю позицию занимает мат. формула/объект, то селектим вместе с CEMpty
                    this.setEnd_Selection(this.selection.endPos + 1);
                else
                    this.setEnd_Selection(this.selection.endPos); // для обычного случая
            }
        }
        else
            res = false;

        return res;
    },
    cursor_moveLeft: function(bShiftKey, bCtrlKey)
    {
        var state = true,
            SelectContent = null;

        if(bShiftKey)
        {

        }
        else
        {
            var pos;

            if(!this.selectUse())
                pos = this.changePosForMove(this.CurPos, -1);
            else
            {
                var start = this.RealSelect.startPos,
                    end   = this.RealSelect.endPos;

                pos = start < end ? start : end;
            }

            if(pos !== -1)
            {
                this.CurPos = pos;

                if(this.content[pos].value.typeObj == MATH_COMP)
                    SelectContent = this.content[pos].value.goToLastElement();
                else
                    SelectContent = this;
            }
            else
            {
                if(!this.bRoot)
                {
                    SelectContent = this.Parent.goToLeft();
                }
                else
                    state = false;
            }

        }

        return {state: state, SelectContent: SelectContent};
    },
    goToLeft: function()
    {
        var SelectContent = this;
        this.CurPos--; // в принципе, вызов changePosForMove(...) приведет к этому действию

        return SelectContent;
    },
    cursor_moveRight: function(bShiftKey, bCtrlKey)
    {
        var state = true,
            SelectContent = null;

        if(bShiftKey)
        {

        }
        else
        {
            var pos;

            if(!this.selectUse())
                pos = this.changePosForMove(this.CurPos, 1);
            else
            {
                var start = this.RealSelect.startPos,
                    end   = this.RealSelect.endPos;

                pos = start > end ? start : end;
            }

            if(pos !== -1)
            {
                this.CurPos = pos;

                if(this.content[pos].value.typeObj == MATH_COMP)
                    SelectContent = this.content[pos].value.goToFirstElement();
                else
                    SelectContent = this;
            }
            else
            {
                if(!this.bRoot)
                {
                    SelectContent = this.Parent.goToRight();
                }
                else
                    state = false;
            }

        }

        return {state: state, SelectContent: SelectContent};
    },
    goToRight: function()
    {
        var SelectContent = this;
        this.CurPos = this.changePosForMove(this.CurPos, 1);

        return SelectContent;
    },
    getPos_toMoveLeft: function()
    {
        var state = true,
            SelectContent = null;

        var start = this.RealSelect.start,
            end   = this.RealSelect.end;

        var posLeft = null; // позиция курсора, стартовая позиция селекта
        var posStart = start > end ? end : start; // для CurPos, стартовая и конечная позиции совпадают

        var currType = this.content[this.CurPos].value.typeObj;
        var bFirstRunPrp = this.CurPos == 1 && currType == MATH_RUN_PRP;
        var bComposition = this.CurPos == 0;
        var bPlh = this.IsPlaceholder(),
            bStartPos = bFirstRunPrp || bComposition;

        var bStartRoot = bStartPos && this.bRoot;
        var bUpperLevel = (bPlh || bStartPos) && !this.bRoot;

        if(bUpperLevel)
        {
            var movement = this.Parent.cursor_moveLeft();
            SelectContent = movement.SelectContent;
        }
        else if(!bStartRoot || this.selectUse()) // не в начале
        {
            if(this.selectUse())
            {
                var start = this.RealSelect.start,
                    end   = this.RealSelect.end;

                if(start > end)
                {
                    var tmp = start;
                    start = end;
                    end = tmp;
                }

                // select move left

                /*if( this.selection.active )
                 {
                 SelectContent = this;
                 var end_select = this.selection.endPos > 0 ? this.selection.endPos - 1 : 0;
                 this.setEnd_Selection(end_select);
                 }
                 else
                 {
                 this.CurPos = start - 1;
                 SelectContent = this;
                 CurrContent   = this;
                 }*/

                this.CurPos = start - 1;
                SelectContent = this;

            }
            //пришли из базового класса
            else if( currType === MATH_COMP )
            {
                // select move left

                /*if( this.selection.active )
                 {
                 var end_select = this.CurPos > 0 ? this.CurPos - 1 : 0;
                 this.setStart_Selection(end_select);
                 this.setEnd_Selection(this.CurPos);
                 SelectContent = this;
                 }
                 else
                 {
                 this.CurPos--;
                 SelectContent = this;
                 CurrContent   = this;
                 }*/

                this.CurPos--;
                SelectContent = this;
            }
            else
            {
                //если нет селекта, то просто перемещаемся по контенту

                var prevType = this.content[this.CurPos - 1].value.typeObj,
                    prev2_Type = this.CurPos > 2 ?  this.content[this.CurPos - 2].value.typeObj : null;

                var bDiffRPrp = prevType === MATH_RUN_PRP && prev2_Type == MATH_TEXT,
                    bRPrComp = currType === MATH_RUN_PRP && prevType === MATH_EMPTY && prev2_Type === MATH_COMP;

                if(bDiffRPrp || bRPrComp)
                    this.CurPos -= 2;
                else
                    this.CurPos--;

                if( this.content[this.CurPos].value.typeObj === MATH_COMP ) // this.CurPos может измениться
                {
                    SelectContent = this.content[this.CurPos].value.goToLastElement();
                }
                else
                    SelectContent = this;

            }

            this.setLogicalPosition(this.CurPos);

        }
        else
            state = false;  // bRoot, в начале

        //return {state: state, SelectContent: SelectContent, CurrContent: CurrContent };


        return {state: state, SelectContent: SelectContent, pos: pos};
    },
    old_cursor_moveLeft: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        var currType = this.content[this.CurPos].value.typeObj;
        var bFirstRunPrp = this.CurPos == 1 && currType == MATH_RUN_PRP;
        var bComposition = this.CurPos == 0;
        var bPlh = this.IsPlaceholder(),
            bStartPos = bFirstRunPrp || bComposition;

        var bStartRoot = bStartPos && this.bRoot;
        var bUpperLevel = (bPlh || bStartPos) && !this.bRoot;

        if(bUpperLevel)
        {
            var movement = this.Parent.cursor_moveLeft();
            CurrContent = SelectContent = movement.SelectContent;
        }
        else if(!bStartRoot || this.selectUse()) // не в начале
        {

            if(this.selectUse())
            {
                var start = this.RealSelect.start,
                    end   = this.RealSelect.end;

                if(start > end)
                {
                    var tmp = start;
                    start = end;
                    end = tmp;
                }

                // select move left

                /*if( this.selection.active )
                {
                    SelectContent = this;
                    var end_select = this.selection.endPos > 0 ? this.selection.endPos - 1 : 0;
                    this.setEnd_Selection(end_select);
                }
                else
                {
                    this.CurPos = start - 1;
                    SelectContent = this;
                    CurrContent   = this;
                }*/

                this.CurPos = start - 1;
                SelectContent = this;
                CurrContent   = this;

            }
            //пришли из базового класса
            else if( currType === MATH_COMP )
            {
                // select move left

                /*if( this.selection.active )
                {
                    var end_select = this.CurPos > 0 ? this.CurPos - 1 : 0;
                    this.setStart_Selection(end_select);
                    this.setEnd_Selection(this.CurPos);
                    SelectContent = this;
                }
                else
                {
                    this.CurPos--;
                    SelectContent = this;
                    CurrContent   = this;
                }*/

                this.CurPos--;
                SelectContent = this;
                CurrContent   = this;
            }
            else
            {
                //если нет селекта, то просто перемещаемся по контенту

                var prevType = this.content[this.CurPos - 1].value.typeObj,
                    prev2_Type = this.CurPos > 2 ?  this.content[this.CurPos - 2].value.typeObj : null;

                var bDiffRPrp = prevType === MATH_RUN_PRP && prev2_Type == MATH_TEXT,
                    bRPrComp = currType === MATH_RUN_PRP && prevType === MATH_EMPTY && prev2_Type === MATH_COMP;

                if(bDiffRPrp || bRPrComp)
                    this.CurPos -= 2;
                else
                    this.CurPos--;

                if( this.content[this.CurPos].value.typeObj === MATH_COMP ) // this.CurPos может измениться
                {
                    CurrContent = SelectContent = this.content[this.CurPos].value.goToLastElement();
                }
                else
                    CurrContent = SelectContent = this;

            }

            this.setLogicalPosition(this.CurPos);

        }
        else
            state = false;  // bRoot, в начале

        return {state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    goToLastElement: function()
    {
        this.cursor_MoveToEndPos();
        return this;
    },
    goToFirstElement: function()
    {
        this.cursor_MoveToStartPos();
        return this;
    },
    goToLowerLevel: function( coord )
    {
        var x = coord.x, y = coord.y;
        var bLow = false;

        x += this.content[this.CurPos].widthToEl - this.content[this.CurPos].value.size.width - this.content[this.CurPos].g_mContext.right;
        y = 0;

        if( ! this.bRoot )
        {
            var lowLevel = this.Parent.goToLowerLevel( {x: x, y: y} );
            bLow = lowLevel.bLow;
            if(bLow)
                content = lowLevel.content;
            else
                content = this;
        }
        else
        {
            content = this;
            bLow = false;
        }

        return {bLow: bLow, content: content};
    },
    goToUpperLevel: function( coord )
    {
        var x = coord.x, y = coord.y;
        var bUp = false;

        x += this.content[this.CurPos].widthToEl - this.content[this.CurPos].value.size.width - this.content[this.CurPos].g_mContext.right;
        y = 0;

        if( ! this.bRoot )
        {
            var upLevel = this.Parent.goToUpperLevel( {x: x, y: y} );
            bUp = upLevel.bUp;
            if(bUp)
                content = upLevel.content;
            else
                content = this;
        }
        else
        {
            content = this;
            bUp = false;
        }

        return {bUp: bUp, content: content};
    },
    select_moveLeft: function()
    {
        var SelectContent = null;
        var start = this.selection.startPos;
        var end = this.selection.endPos;
        var bSingle = (this.selection.startPos == this.selection.endPos);

        if(start > end)
        {
            var tmp = start;
            start = end;
            end = tmp;
        }
        if(bSingle && this.content[this.CurPos].value.typeObj === MATH_COMP)
        {
            var end_select = this.CurPos > 0 ? this.CurPos - 1 : 0;
            this.setStart_Selection(end_select);
            this.setEnd_Selection(this.CurPos);
            SelectContent = this;
        }
        else if(this.selection.endPos!=0)
        {
            //если не выходим за границы контента
            SelectContent = this;
            var end_select = this.selection.endPos > 0 ? this.selection.endPos - 1 : 0;
            this.setEnd_Selection(end_select);
        }
        else
        {
            if(!this.bRoot)
            {
                SelectContent = this.Parent.select_moveLeft();
            }
        }
        return SelectContent;
    },
    cursor_moveUp: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if( ! this.bRoot )
        {
            var coord = {x: this.content[this.CurPos].value.size.width, y: 0};
            var UpL = this.goToUpperLevel(coord);
            state = UpL.bUp;
            CurrContent = SelectContent = UpL.content;
        }
        else
        {
            state = false;
            CurrContent = SelectContent = this;
        }


        return { state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    cursor_moveDown: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if( ! this.bRoot )
        {
            var coord = {x: this.content[this.CurPos].value.size.width, y: 0};
            var LowL = this.goToLowerLevel(coord);
            state = LowL.bLow;
            CurrContent = SelectContent = LowL.content;
        }
        else
        {
            state = false;
            CurrContent = SelectContent = this;
        }


        return { state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    old_mouseUp: function()
    {
        if( this.selection.active )
        {
            this.selection.active = false;
            if( this.content[this.CurPos].value.typeObj === MATH_COMP )
                this.content[this.CurPos].value.mouseUp();
        }
    },
    old_mouseDown: function(mouseCoord, inside_flag)  // mouseDown идем сверху вниз по иерархии
    {
        var result = null;

        if(typeof(inside_flag) === "undefined")
            inside_flag = -1;

        if(this.IsPlaceholder())
        {
            result = this;
        }
        else
        {
            var msCoord = this.coordWOGaps(mouseCoord);

            if(inside_flag == 0)
                this.CurPos = 0;
            else if(inside_flag == 1)
                this.CurPos = this.content.length - 1;
            else
                this.CurPos = this.findPosition( msCoord );

            if( this.content[this.CurPos].value.typeObj === MATH_COMP )
            {
                var coord = this.getCoordElem(this.CurPos, msCoord);
                result = this.content[this.CurPos].value.mouseDown(coord);
            }
            else
                result = this;

            this.setStart_Selection(this.CurPos);
        }

        return result;
    },
    old_mouseMove: function(mouseCoord) // mouseMove идем сверху вниз по иерархии
    {
        var state = true;
        var SelectContent = null;

        if(this.IsPlaceholder())
        {
            SelectContent = this;
        }
        else
        {
            var msCoord = this.coordWOGaps(mouseCoord);
            var pos = this.findPosition( msCoord );

            //селект внутри элемента (дроби и пр.)
            if(this.CurPos === pos && this.content[pos].value.typeObj === MATH_COMP)
            {
                this.setStart_Selection( pos - 1 );
                var coord = this.getCoordElem(this.CurPos, msCoord );
                var movement = this.content[pos].value.mouseMove(coord);

                if( ! movement.state )
                {
                    this.setEnd_Selection( pos + 1 );
                    SelectContent = this;
                }
                else
                    SelectContent = movement.SelectContent;
            }
            //селект элементов контента
            else
            {
                SelectContent = this;

                var direction = ( this.CurPos < pos ) ? 1 : -1;

                if ( this.content[this.CurPos].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setStart_Selection( this.CurPos - 1);
                    else if( direction == -1 )
                        this.setStart_Selection( this.CurPos + 1);
                }
                else
                    this.setStart_Selection( this.CurPos );

                if( this.content[pos].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setEnd_Selection(pos + 1);
                    else if( direction == -1 )
                        this.setEnd_Selection(pos - 1);
                }
                else
                    this.setEnd_Selection( pos );
            }
        }

        return {state: state, SelectContent: SelectContent }; //для CMathContent state всегда true
    },

    old_changePosForMove: function(pos, order)
    {
        var posChange = -1;
        var currType   = this.content[pos].value.typeObj,
            prevType   = pos - 1 > 0 ? this.content[pos-1].value.typeObj : null,
            prev2_Type = pos - 2 > 0 ? this.content[pos-2].value.typeObj : null,
            nextType   = pos + 1 < this.content.length ? this.content[pos+1].value.typeObj : null,
            next2_Type = pos + 2 < this.content.length ? this.content[pos+2].value.typeObj : null;

        //////   проверка на начало и конец  контента //////
        var bFirstRunPrp = this.CurPos == 1 && currType == MATH_RUN_PRP;
        var bFirst = bFirstRunPrp || this.CurPos == 0;

        var bPlh = this.IsPlaceholder();

        var bLeft =  order == -1 && !bFirst && !bPlh,
            bRight = order == 1 && this.CurPos !== this.content.length - 1 && !bPlh;

        ////////////////////////////////////////////////////


        if(bLeft)
        {
            if(currType == MATH_RUN_PRP)  // перепрыгнули через RunPrp, неважно какой предыдущий элемент
                posChange = pos - 2;
            else
                posChange = pos - 1;
        }
        else if(bRight)
        {
            if(next2_Type == MATH_RUN_PRP) // перепрыгнули через RunPrp, неважно какой следующий элемент за текущим
                posChange = pos + 2;
            else
                posChange = pos + 1;
        }

        return posChange;
    },

    /*
        курсор стоит перед RunPrp, в случае если после них идет текст,
        в случае с мат. объектом логическое положение курсора после RunPrp (аналогично и для начала формулы) = >

        1. CEmpty + Runprp - курсор после
        2. одни RunPrp курсор перед
    */
    changePosForMove: function(pos, order)
    {
        var posChange = -1;
        var currType   = this.content[pos].value.typeObj,
            prevType   = pos - 1 > 0 ? this.content[pos-1].value.typeObj : null,
            prev2_Type = pos - 2 > 0 ? this.content[pos-2].value.typeObj : null,
            nextType   = pos + 1 < this.content.length ? this.content[pos+1].value.typeObj : null,
            next2_Type = pos + 2 < this.content.length ? this.content[pos+2].value.typeObj : null;

        //////   проверка на начало и конец  контента //////
        var bFirstRunPrp = this.CurPos == 1 && currType == MATH_RUN_PRP;
        var bFirst = bFirstRunPrp || this.CurPos == 0;

        var bPlh = this.IsPlaceholder();

        var bLeft =  order == -1 && !bFirst && !bPlh,
            bRight = order == 1 && this.CurPos !== this.content.length - 1 && !bPlh;


        ////////////////////////////////////////////////////

        //////*   LEFT   *//////

        //  prevType  == MATH_RUN_PRP
        //          &&
        //  prev2Type == MATH_TEXT
        //  -2
        //////
        //  currType == MATH_RUN_PRP
        //  -2

        /////////////////////////

        //////*   RIGHT   *//////

        //  nextType == MATH_RUN_PRP
        //  +2
        //////
        //  nextType == MATH_EMPTY
        //          &&
        //  next2_Type == MATH_RUN_PRP
        //  +2

        //////////////////////////

        ///////////////////////////////////////////////////////

        var bLeftComp    = currType == MATH_RUN_PRP,
            bLeftRPpText = prevType == MATH_RUN_PRP &&   prev2_Type == MATH_TEXT;

        var bRightRPrp   = nextType  == MATH_RUN_PRP,
            bRightComp   = nextType  == MATH_EMPTY && next2_Type == MATH_RUN_PRP;


        if(bLeft)
        {
            if(bLeftComp || bLeftRPpText)  // перепрыгнули через RunPrp, неважно какой предыдущий элемент
                posChange = pos - 2;
            else
                posChange = pos - 1;
        }
        else if(bRight)
        {
            if(bRightRPrp || bRightComp) // перепрыгнули через RunPrp, неважно какой следующий элемент за текущим
                posChange = pos + 2;
            else
                posChange = pos + 1;
        }

        return posChange;
    },
    // выставить курсор в начало конента
    cursor_MoveToStartPos: function()  //  home => cursor_MoveToStartPos
    {
        if( !this.IsEmpty() )
        {
            if(!this.IsPlaceholder())
            {
                if(this.content[1].value.typeObj === MATH_RUN_PRP)
                    this.setLogicalPosition(1);
                else // первым идет мат объект
                    this.setLogicalPosition(0);
            }
            else
                this.setLogicalPosition(0);
                //this.CurPos = 0;
        }
    },
    // выставить курсор в конец конента
    cursor_MoveToEndPos: function()  //  end => cursor_MoveToEndPos
    {
        if( !this.IsEmpty() )
        {
            if(!this.IsPlaceholder())
                this.setLogicalPosition(this.content.length - 1);
            else
                this.setLogicalPosition(0);
        }
    },
    //////////////////////////////////////

    // не вызываем из mouseDown эту ф-ию, тк иначе не установим селект для внутреннего объекта (setStart_Selection)
    afterDisplacement: function(coord) //аналог mouseDown для goToUpperLevel и goToLowerLever
    {
        var content = null;
        var msCoord = this.coordWOGaps(coord);

        this.CurPos = this.findPosition( msCoord );

        if( this.content[this.CurPos].value.typeObj === MATH_COMP )
        {
            var _coord = this.getCoordElem(this.CurPos, msCoord);
            content = this.content[this.CurPos].value.afterDisplacement(_coord);
        }
        else
            content = this;

        return content;
    },
    old_recalculateSize: function()
    {
        var _width      =   0 ;
        var _ascent     =   0 ;
        var _descent    =   0 ;
        var _center     =   0 ;
        var _height     =   0 ;

        for(var i=0; i< this.content.length; i++)
        {
            var Size = this.content[i].value.size;
            var gps = this.content[i].g_mContext;
            _width += Size.width + gps.left + gps.right;
            _descent = ( _descent < ( Size.height - Size.center + gps.bottom) ) ? ( Size.height - Size.center + gps.bottom): _descent;
            _center =  ( _center < (Size.center + gps.top) ) ? ( Size.center + gps.top) : _center;

            var sAscent;

            if( !this.content[i].value.typeObj === MATH_COMP )
                sAscent = Size.ascent;
            else
                sAscent = Size.center;

            _ascent = _ascent > sAscent ? _ascent : sAscent;
        }

        _width += this.g_mContext.left + this.g_mContext.right;
        _height = _center + _descent + this.g_mContext.top + this.g_mContext.bottom;
        _center += this.g_mContext.top;

        this.size = {width: _width, height: _height, center: _center, ascent: _ascent};

        this.update_widthContent(); /// !!!!
    },
    recalculateSize: function()
    {
        var width      =   0 ;
        var ascent     =   0 ;
        var descent    =   0 ;
        var center     =   0 ;
        var height     =   0 ;

        for(var i = 0; i < this.content.length; i++)
        {
            var oSize = this.content[i].value.size,
                type = this.content[i].value.typeObj;
            var gps = this.content[i].g_mContext;

            width += oSize.width + gps.left + gps.right;
            if(type == MATH_COMP)
            {
                ascent = ascent > oSize.center ? ascent : oSize.center;
                descent =  descent < ( oSize.height - oSize.center + gps.bottom) ? (oSize.height - oSize.center + gps.bottom ) : descent;
            }
            else if(type == MATH_TEXT || type == MATH_PLACEHOLDER)
            {
                ascent = ascent > oSize.ascent ? ascent : oSize.ascent;
                descent =  descent < ( oSize.height - oSize.ascent + gps.bottom) ? (oSize.height - oSize.ascent + gps.bottom ) : descent;
            }
        }

        width += this.g_mContext.left + this.g_mContext.right;
        height = ascent + descent + this.g_mContext.top + this.g_mContext.bottom;
        center = ascent + this.g_mContext.top;

        this.size = {width: width, height: height, center: center};

        this.update_widthContent(); /// !!!!
    },

    Resize: function(oMeasure)      // пересчитываем всю формулу
    {
        var bItalic = true;

        for(var i = 0; i < this.content.length; i++)
        {
            var type = this.content[i].value.typeObj;

            if(type == MATH_TEXT)
            {
                this.content[i].value.setMText(bItalic);
                this.content[i].value.Resize(oMeasure);
            }
            else if(type == MATH_COMP)
            {
                this.content[i].value.Resize(oMeasure);
            }
            else if(type == MATH_RUN_PRP)
            {
                var runPrp = this.content[i].value.getWRunPrp();

                var txtPrp = new CMathTextPrp();
                txtPrp.Merge(DEFAULT_RUN_PRP);
                txtPrp.Merge(runPrp);
                bItalic = txtPrp.Italic;
                txtPrp.Italic = false;

                g_oTextMeasurer.SetFont(txtPrp);

            }
            else if(type == MATH_PLACEHOLDER)
            {
                if(!this.bRoot)
                {
                    var ctrPrp = this.Parent.getCtrPrp();

                    var txtPrp = new CMathTextPrp();
                    txtPrp.Merge(DEFAULT_RUN_PRP);
                    txtPrp.Merge(ctrPrp);
                    txtPrp.Italic = false;

                    g_oTextMeasurer.SetFont(txtPrp);
                    this.content[i].value.Resize(oMeasure);
                }
            }
        }

        this.recalculateSize();
    },
    draw: function(pGraphics)
    {
        var bHidePlh = this.plhHide && this.IsPlaceholder();

        if( !bHidePlh )
        {
            for(var i=1; i < this.content.length;i++)
            {
                if(this.content[i].value.typeObj == MATH_RUN_PRP)
                {
                    pGraphics.b_color1(0,0,0,255);

                    var rPrp = new CMathTextPrp();
                    rPrp.Merge(DEFAULT_RUN_PRP);
                    rPrp.Merge( this.content[i].value.getWRunPrp() );

                    rPrp.Italic = false;
                    pGraphics.SetFont(rPrp);
                }
                else if(this.content[i].value.typeObj == MATH_PLACEHOLDER)
                {
                    pGraphics.b_color1(0,0,0,255);

                    var ctrPrp = this.Parent.getCtrPrp();

                    var rPrp = new CMathTextPrp();
                    rPrp.Merge(DEFAULT_RUN_PRP);
                    rPrp.Merge(ctrPrp);

                    rPrp.Italic = false;
                    pGraphics.SetFont(rPrp);

                    this.content[i].value.draw(pGraphics);
                }
                else
                    this.content[i].value.draw(pGraphics);
            }
        }
    },
    update_widthContent: function()
    {
        for(var i = 1; i <this.content.length; i++)
        {
            this.content[i].widthToEl = this.content[i-1].widthToEl + this.content[i].value.size.width + this.content[i].g_mContext.left + this.content[i].g_mContext.right;
        }

    },
    update_Cursor: function()
    {
        //var sizeCursor = this.getRunPrp(this.CurPos).FontSize*g_dKoef_pt_to_mm;
        var sizeCursor = this.getCurrRunPrp().FontSize*g_dKoef_pt_to_mm;
        var position = {x: this.pos.x + this.content[this.CurPos].widthToEl, y: this.pos.y + this.size.center - sizeCursor*0.8 };

        editor.WordControl.m_oLogicDocument.DrawingDocument.SetTargetSize( sizeCursor );
        editor.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
        editor.WordControl.m_oLogicDocument.DrawingDocument.UpdateTarget( position.x, position.y, 0 );
        editor.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = false;

    },
    coordWOGaps: function( msCoord )
    {
        var x = msCoord.x;
        var y = msCoord.y;
        if( 0 <= x && x <= this.g_mContext.left )
            x = 0;
        else if( (this.size.width - this.g_mContext.right) <= x && x <= this.size.width)
            x = this.size.width - this.g_mContext.right - this.g_mContext.left;
        else
            x -= this.g_mContext.left;

        if( 0 <= y && y <= this.g_mContext.top )
            y = 0;
        else if( (this.size.height - this.g_mContext.bottom) <= y && y <= this.size.height )
            y = this.size.height - this.g_mContext.top - this.g_mContext.bottom;
        else
            y -= this.g_mContext.top;

        return {x: x, y: y};
    },
    findPosition: function(mCoord)
    {
        var mouseX = mCoord.x;
        //var mouseY = mCoord.y;

        var pos = 0;
        while( pos < (this.content.length - 1) &&  this.content[pos].widthToEl < mouseX )
            pos++;

        var gps = this.content[pos].g_mContext;
        var width = this.content[pos].value.size.width;
        var widthToEl = this.content[pos].widthToEl;

        if(pos !== 0)
        {
            if( this.content[pos].value.typeObj === MATH_COMP )
            {
                /*if( this.content[pos - 1].widthToEl <= mouseX && mouseX < (this.content[pos - 1].widthToEl + gps.left) )
                    pos--;
                else if( (this.content[pos].widthToEl - gps.right) < mouseX && mouseX <= this.content[ pos ].widthToEl)
                    pos++;*/


                if(mouseX < widthToEl - width - gps.right)
                    pos--;
                else if(mouseX >= widthToEl - gps.right)
                    pos++;

                /*if(!bPos)
                    pos--;
                else
                    pos++;*/

            }
            else
            {
                if( !(widthToEl - width/2 <  mouseX) )
                    pos--;

                /*if( this.content[ pos - 1].widthToEl <= mouseX && mouseX < (this.content[ pos - 1].widthToEl + gps.left) )
                    pos--;
                else if( (this.content[ pos ].widthToEl - (this.content[ pos ].value.size.width/2) - this.content[ pos ].g_mContext.left ) > mouseX )
                    pos--;*/
            }
        }

        return pos;
    },
    getCoordElem: function(index, mCoord)  // without gaps of Math Component ( например, если справа/слева есть относительно мат элемента компонент, то добавляем gaps справа/слева для этого мат элемента )
    {
        var widthToPrev = this.content[index-1].widthToEl;
        var widthToCur = this.content[index].widthToEl;
        var X;
        var Y;

        var gps = this.content[index].g_mContext;
        if( widthToPrev <= mCoord.x && mCoord.x <=  (widthToPrev + gps.left) )
            X = 0;
        else if( (widthToCur - gps.right) <= mCoord.x && mCoord.x <= widthToCur )
            X = this.content[index].value.size.width;
        else
            X = mCoord.x - widthToPrev - gps.left;

        if( mCoord.y <= (this.size.center - this.g_mContext.top - this.content[index].value.size.center) )
            Y = 0;
        else if( mCoord.y >= this.size.center - this.g_mContext.top +  this.content[index].value.size.height -  this.content[index].value.size.center )
            Y =  this.content[index].value.size.height;
        else
            Y = mCoord.y - (this.size.center - this.g_mContext.top - this.content[index].value.size.center);

        return {x: X, y: Y};
    },
    remove: function(order)
    {
        var state =
        {
            bDelete:                false,    /* нужно ли пересчитывать позицию или нет, работает при backspace */
            bBegin:                 false,    /* в начале контента или нет */
            bEnd:                   false     /* в конце */
        };

        var CurrContent = SelectContent = null,
            items = null;

        var currType = this.content[this.CurPos].value.typeObj;
        var bFirstRunPrp = this.CurPos == 1 && currType == MATH_RUN_PRP;
        var bComposition = this.CurPos == 0;
        var bPlh = this.IsPlaceholder(),
            bStartPos = (bFirstRunPrp || bComposition) &&  order == 1;

        var bSelect = this.selectUse();

        var bLastPos = order == -1 && this.CurPos == this.content.length - 1;

        var bUpperLevel = (bPlh || bStartPos || bLastPos) && !bSelect ; // на плейсхолдер это не распространяется
                                                                        // т.к. даже когда в нем находимся, у него selection.startPos и selection.endPos совпадают
        if(bUpperLevel)
        {
            if(!this.bRoot)
            {
                var result = this.Parent.remove(-2);
                SelectContent = result.SelectContent;
                CurrContent = this;
            }
            else
            {
                if(bStartPos)
                    state.bBegin = true;
                else if(bLastPos)
                    state.bEnd = true;
                else // на всякий случай, для плейсхолдера в Root
                {
                    this.content.length = 0;
                    state.bDelete = true;
                }

                CurrContent = SelectContent = this;
            }
        }
        else if(order == 1 || order == -1)
        {
            result = this.remove_internal(order);
            items = result.items;
            state.bDelete = result.bDelete;
            SelectContent = this;
            CurrContent   = this;
        }
        else if(order == -2)
        {

            this.removeFormula(this.CurPos);

            SelectContent = this;
            CurrContent   = null; // т.к. пришли из другого контента
        }


        return {CurrContent : CurrContent, SelectContent: SelectContent, state: state, items: items};
    },
    remove_internal: function(order)
    {
        var items = null;
        var bDelete = false;

        var bSelect = this.selectUse();
        var currType = this.content[this.CurPos].value.typeObj,
            prevType = this.CurPos > 1 ? this.content[this.CurPos - 1].value.typeObj : null,
            prev2_Type = this.CurPos > 2 ? this.content[this.CurPos - 2].value.typeObj : null,
            nextType = this.CurPos + 1 < this.content.length ? this.content[this.CurPos + 1].value.typeObj : null,
            next2_Type = this.CurPos + 2 < this.content.length ? this.content[this.CurPos + 2].value.typeObj : null;

        var bMEDirect  = order == 1,
            bMEReverse = order == -1;

        var bDirectlyBegin = this.CurPos == 0 || (currType == MATH_RUN_PRP && this.CurPos == 1) && bMEDirect, // Empty или RunPrp в начале, значит курсор в начале контента
            bReverseEnd = this.CurPos == this.content.length - 1 && bMEReverse;
        var bNotRemove = (bDirectlyBegin || bReverseEnd) && !bSelect;

        // directly

        var bDirectly_CurrComp = bMEDirect && currType == MATH_EMPTY && prevType == MATH_COMP,
            bDirectly_RPrpComp = bMEDirect && currType == MATH_RUN_PRP && prevType == MATH_EMPTY && prev2_Type == MATH_COMP;

        // reverse

        var bReverseComp = bMEReverse && nextType == MATH_COMP && next2_Type == MATH_EMPTY;

        //

        var bRemoveFormula = (bDirectly_CurrComp|| bDirectly_RPrpComp || bReverseComp) && !bSelect;

        if(bRemoveFormula)
        {
            var pos;
            if(bMEReverse)
                pos = this.CurPos + 1;
            else if(bDirectly_CurrComp)
                pos = this.CurPos - 1;
            else if(bDirectly_RPrpComp)
                pos = this.CurPos - 2;

            this.removeFormula(pos);
        }
        else if(!bNotRemove)
        {
            var start, end;

            if(bSelect)
            {
                start =  this.RealSelect.startPos;
                end   =  this.RealSelect.endPos;
                var tmp;

                if(start > end)
                {
                    tmp = start;
                    start = end;
                    end = tmp;
                }
            }
            else
            {
                start = order == 1 ? this.CurPos : this.CurPos + 1;     // позиция, с которой будем удалять

                if(this.content[start].value.typeObj === MATH_RUN_PRP) // встали на RunPrp
                    start = (order == -1) ? start + 1 : start - 1;

                var bRun = start - 1 > 0 ? this.content[start - 1].value.typeObj === MATH_RUN_PRP : false,
                    bNotNextText = start + 1 < this.content.length ?  this.content[start + 1].value.typeObj !== MATH_TEXT : true; // start  < this.content.length - 1, значит последняя буква в контента

                var bOnlyLetter = bRun && bNotNextText; // если все текстовые элементы удалили из Run, нужно удалить RunPrp

                if(bOnlyLetter)
                {
                    start--;
                    end = start + 2;
                }
                else
                    end = start + 1;
            }

            this.CurPos = start - 1;

            items = this.content.splice(start, end - start);

            if(!this.IsEmpty() && this.CurPos == 0 && this.content[this.CurPos+1].value.typeObj === MATH_RUN_PRP) // если удалили мат. объект и стоим в начале, то позиция курсора будет перед RunPrp, а нужно после
                this.CurPos++;

            this.setLogicalPosition(this.CurPos);

            bDelete = true;
        }

        return {bDelete: bDelete, items: items};
    },
    old_remove_internal: function(order)
    {
        var bDelete = false;
        var bSelect = this.selection.startPos !== this.selection.endPos;
        var currType = this.content[this.CurPos].value.typeObj,
            prevType = this.CurPos > 1 ? this.content[this.CurPos - 1].value.typeObj : null,
            prev2_Type = this.CurPos > 2 ? this.content[this.CurPos - 2].value.typeObj : null,
            prev3_Type = this.CurPos > 3 ? this.content[this.CurPos - 3].value.typeObj : null,
            nextType = this.CurPos + 1 < this.content.length ? this.content[this.CurPos + 1].value.typeObj : null,
            next2_Type = this.CurPos + 2 < this.content.length ? this.content[this.CurPos + 2].value.typeObj : null,
            next3_Type = this.CurPos + 3 < this.content.length ? this.content[this.CurPos + 3].value.typeObj : null;

        var bDirectlyBegin = this.CurPos == 0 || (currType == MATH_EMPTY && this.CurPos == 1) && bMEDirect,
            bReverseEnd = this.CurPos == this.content.length - 1 && bMEReverse;

        var bNotRemove = bDirectlyBegin || bReverseEnd;

        // directly

        var bMEDirect = order == 1,
            bMEReverse = order == -1;

        var bDirectly_CurrComp = currType == MATH_EMPTY && prevType == MATH_COMP,
            bDirectly_RPrpComp = currType == MATH_RUN_PRP && prevType == MATH_EMPTY && prev2_Type == MATH_COMP;

        bDirectly_CurrComp = bDirectly_CurrComp && bMEDirect;
        bDirectly_RPrpComp = bDirectly_RPrpComp && bMEDirect;

        // reverse

        var bReverseComp = nextType == MATH_COMP && next2_Type == MATH_EMPTY,
            bAfterRPrp   = next3_Type == MATH_RUN_PRP;

        bReverseComp = bReverseComp && bMEReverse;

        var bSet_Select = (bDirectly_CurrComp|| bDirectly_RPrpComp || bReverseComp) && !bSelect;


        // NB !
        // учесть случаи :
        // 1. если нажата delete и справа стоят RunPrp
        // 2. если все текстовые элементы удалили из Run, нужно удалить RunPrp (delete и backspace)


        if(bSet_Select)
        {
            var start, end;

            if(bDirectly_CurrComp) // directly, only composition
            {
                start = this.CurPos;
                end = this.CurPos - 2;
            }
            else if(bReverseComp && !bAfterRPrp) // reverse, only composition
            {
                start = this.CurPos;
                end = this.CurPos + 2;
            }
            else // composition + RunPrp(after)
            {
                var bSelectRunPrp = false;

                var bDirectlySearch = prev3_Type === MATH_TEXT && bDirectly_RPrpComp, // перед мат. объектом текст, а после RunPrp
                    bReverseSeach = currType === MATH_TEXT && bMEReverse && bAfterRPrp;

                if(bDirectlySearch || bReverseSeach)
                {
                    var shift;
                    if(bMEDirect)
                        shift = 3;
                    else
                        shift = 0;

                    for(var i = this.CurPos - shift; i > 0; i--)
                    {
                        if(this.content[i].value.typeObj === MATH_RUN_PRP)
                        {
                            currRPrp = this.content[this.CurPos + shift].value;
                            prevRPrp = this.content[i].value;
                            bSelectRunPrp = currRPrp.isEqual(currRPrp, prevRPrp);
                            break;
                        }
                    }
                }

                if(bMEDirect)
                {
                    if(bSelectRunPrp)
                    {
                        start = this.CurPos;
                        end = this.CurPos - 3;
                    }
                    else
                    {
                        start = this.CurPos - 1;
                        end = this.CurPos - 3;
                    }
                }
                else
                {
                    if(bSelectRunPrp)
                    {
                        start = this.CurPos - 1;
                        end = this.CurPos + 2;
                    }
                    else
                    {
                        start = this.CurPos - 1;
                        end = this.CurPos + 1;
                    }
                }

            }

            this.setStart_Selection(start);
            this.setEnd_Selection(end);
            this.selection.active = false;

        }
        else if(!bNotRemove)
        {
            var start, end;

            var bDirRPrp = currType === MATH_RUN_PRP && bMEDirect,
                bRevRPrp = nextType === MATH_RUN_PRP && bMEReverse;

            if(bDirRPrp) // проверку на начало прошли
            {
                start = this.CurPos - 1;
                end = this.CurPos;
            }
            else if(bRevRPrp) // на всякий случай, может получится, что после удаления элемента, стоим после RunPrp
            {
                start = this.CurPos + 2;
                end = this.CurPos + 3;
            }
            else if(bSelect)
            {
                start = this.selection.startPos;
                end = this.selection.endPos;
                var tmp;

                if(start > end)
                {
                    tmp = start;
                    start = end;
                    end = tmp;
                }
            }
            else if(bMEReverse)
            {
                if(nextType == MATH_RUN_PRP && next3_Type !== MATH_TEXT) //единственная буква в Run
                {
                    start = this.CurPos;
                    end = this.CurPos + 2;
                }
                else
                {
                    start = this.CurPos + 1;
                    end = this.CurPos + 2;
                }
            }
            else
            {
                if(prevType == MATH_RUN_PRP && nextType !== MATH_TEXT) //единственная буква в Run
                {
                    start = this.CurPos - 1;
                    end = this.CurPos + 1;
                }
                else
                {
                    start = this.CurPos;
                    end = this.CurPos + 1;
                }

            }

            items = this.content.splice(start, end - start);

            if(!TEST)
            {
                History.Create_NewPoint();
                //items = this.content.splice(start, end - start);
                History.Add(this, {Type: historyitem_Math_RemoveItem, Items: items, Pos: start});
            }

            this.CurPos -= (end - start);
            this.setStart_Selection(this.CurPos);
            this.selection.active = false;

            bDelete = true;
        }


        return {bDelete: bDelete, items: items};
    },
    removeFormula: function(pos)
    {
        var result = false;

        var currType = this.content[pos].value.typeObj,
            prevType   = pos > 1 ? this.content[pos - 1].value.typeObj : null,
            nextType   = pos + 1 < this.content.length ? this.content[pos + 1].value.typeObj : null,
            next2_Type = pos + 2 < this.content.length ? this.content[pos + 2].value.typeObj : null;

        var bMFormula  = currType == MATH_COMP && nextType == MATH_EMPTY;
        var bAfterRPrp = next2_Type == MATH_RUN_PRP,
            bPrevTxt = prevType == MATH_TEXT;

        var bRemoveRPrp = bAfterRPrp && bPrevTxt; // удалить RunPrp нужно только  в одном случае, если справо и слево текст, к которому применяются одни и те же RunPrp
                                                  // здесь делаем только проверку, находится ли текст перед формулой, и идут ли RunPrp после формулы

        if(bMFormula)
        {
            var start, end;
            var bSelectRunPrp = false;

            if(bRemoveRPrp)
            {
                for(var i = pos - 1; i > 0; i--)
                {
                    if(this.content[i].value.typeObj === MATH_RUN_PRP)
                    {
                        var currTPrp = this.content[pos+2].value.getWRunPrp();
                        var prevTPrp = this.content[i].value.getWRunPrp();
                        bSelectRunPrp = currTPrp.isEqual(currTPrp, prevTPrp);
                        break;
                    }
                }
            }

            if(bSelectRunPrp)
            {
                start = pos - 1;
                end   = pos + 2;
            }
            else
            {
                start = pos - 1;
                end   = pos + 1;
            }

            this.setStartPos_Selection(start);
            this.setEndPos_Selection(end);

            //this.setStart_Selection(start);
            //this.setEnd_Selection(end);

            result = true;
        }

        return result;
    },
    setPlaceholderAfterRemove: function()  // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент
    {
        if(this.content.length == 1 && ! this.bRoot )//только CEmpty
            this.fillPlaceholders();
    },
    selectUse: function()
    {
        //return (this.selection.startPos !== this.selection.endPos);
        return this.RealSelect.startPos !== this.RealSelect.endPos;
    },
    old_setStart_Selection: function(StartIndSelect)
    {
        if( this.content.length != 1)
        {
            this.selection.active = true;
            StartIndSelect++; // start+1 ... end
            this.selection.startPos = StartIndSelect;
            this.selection.endPos   = StartIndSelect;
        }
        else // один CEmpty
        {
            this.selection.startPos = 0;
            this.selection.endPos = 0;
            this.selection.active = false;
        }

    },
    old_setEnd_Selection: function(EndIndSelect)
    {
        if(this.selection.active)
        {
            this.selection.endPos = EndIndSelect + 1;
            this.drawSelect();
        }
    },
    IsPlaceholder: function()
    {
        var flag = false;
        if(!this.bRoot && this.content.length == 2)
            flag  = this.content[1].value.typeObj === MATH_PLACEHOLDER;

        return flag;
    },
    IsJustDraw: function()
    {
        return false;
    },
    setPosition: function( pos )
    {
        this.pos = { x: pos.x + this.g_mContext.left, y: pos.y};
        var max_cent = this.size.center;

        //var txtPrp = this.getTxtPrp();
        //g_oTextMeasurer.SetFont ( txtPrp );
        //var baseLine = DIV_CENT*g_oTextMeasurer.GetHeight();

        /*var rPrp = this.getCurrRunPrp();
        g_oTextMeasurer.SetFont ( rPrp );
        var baseLine = DIV_CENT*g_oTextMeasurer.GetHeight();*/
        //var baseLine = 0;
        var baseLine = 0;

        for(var i=1; i < this.content.length;i++)
        {
            var t = {x: this.pos.x + this.content[i-1].widthToEl + this.content[i].g_mContext.left, y: this.pos.y + max_cent };
            if( this.content[i].value.typeObj !== MATH_COMP )
                t.y += baseLine;

            this.content[i].value.setPosition(t);
        }
    },
    new_setPosition: function( _pos )
    {
        this.pos = { x: _pos.x + this.g_mContext.left, y: _pos.y};

        for(var i=1; i<this.content.length;i++)
        {
            var t =
            {
                x: this.pos.x + this.content[i-1].widthToEl + this.content[i].g_mContext.left,
                y: this.pos.y + this.size.center
            };

            this.content[i].value.setPosition(t);
        }
    },
    drawSelect: function()
    {
        var start   = this.RealSelect.startPos,
            end     = this.RealSelect.endPos;

        if( start > end)
        {
            var tmp = start;
            start = end;
            end = tmp;
        }

        if(this.IsPlaceholder())
        {
            start = 1;
            end = 2;
        }

        //var heightSelect = this.size.ascent + this.size.descent;
        var heightSelect = this.size.height;
        var widthSelect = 0;

        for(var j= start; j < end ; j++)
            widthSelect += this.content[j].widthToEl - this.content[j-1].widthToEl;

        if( widthSelect != 0)
            editor.WordControl.m_oLogicDocument.DrawingDocument.AddPageSelection(0,this.pos.x + this.content[start-1].widthToEl, this.pos.y, widthSelect, heightSelect );
    },
    ///// properties /////
    SetDot: function(flag)
    {
        this.bDot = flag;
    },
    hidePlaceholder: function(flag)
    {
        this.plhHide = flag;
    },

    ///////// RunPrp, CtrPrp
    addRunPrp: function(runPrp)          // for "edit"
    {
        this.addRunPrpToContent(runPrp);
        this.CurPos++;
    },
    addRunPrpToContent: function(runPrp)
    {
        var rPrp = new CMathRunPrp();
        rPrp.Merge(runPrp);

        var element = new mathElem(rPrp);

        var tmp = this.content.splice(0, this.CurPos + 1);
        tmp.push(element);
        tmp = tmp.concat( this.content.splice(0, this.content.length) );

        this.content.length = 0;
        this.content = tmp;
    },
    /*addRunPrpToContent_2: function(runPrp) // for "read"
    {
        var rPrp = new CMathRunPrp();
        rPrp.Merge(runPrp);

        var element = new mathElem(rPrp);

        this.content.push(element);
        this.CurPos++;
    },*/
    readContent: function()             // for "read"
    {
        var result = new Array();

        for(var i=0; i < this.content.length; i++)
        {
            if(this.content[i].value.typeObj === MATH_RUN_PRP)
            {
                var run = new CMRun();

                run.setTxtPrp(this.content[i].value);
                run.setMathRunPrp(this.content[i].value);

                while(this.content[i + 1].value.typeObj === MATH_TEXT)
                {
                    run.addLetter(this.content[i + 1].value);
                    i++;
                }

                result.push(run);
            }
            else if(this.content[i].value.typeObj === MATH_COMP)
            {
                result.push(this.content[i].value);
            }
        }

        return result;
    },
    getCurrRunPrp: function()
    {
        var runPrp = new CTextPr();

        if(this.content.length > 1)
        {
            if( this.IsPlaceholder())
            {
                runPrp.Merge(this.Parent.getCtrPrp());
            }
            else if(this.CurPos == 0 && this.content[1].value.typeObj == MATH_COMP)
            {
                runPrp.Merge(this.content[1].value.getCtrPrp());
            }
            else
            {
                for(var i = this.CurPos; i > 0; i--)
                {
                    var obj = this.content[i].value;

                    if(obj.typeObj == MATH_RUN_PRP)
                    {
                        runPrp.Merge(obj.getWRunPrp());
                        break;
                    }
                    else if(obj.typeObj == MATH_COMP)
                    {
                        runPrp.Merge(obj.getCtrPrp());
                        break;
                    }
                }
            }
        }
        else
        {
            //runPrp = this.Composition.GetFirstPrp();
            runPrp = this.Composition.GetTxtPrp();
        }

        return runPrp;
    },
    getFirstPrp:    function()
    {
        var txtPrp =  new CMathTextPrp();
        txtPrp.Merge(DEFAULT_RUN_PRP);

        if(this.content.length > 1)
        {
            if(this.content[1].value.typeObj === MATH_RUN_PRP) // если первый объект - буква
            {
                var runPrp = this.content[1].value.getWRunPrp();
                txtPrp.Merge(runPrp);
            }
            else if(this.content[1].value.typeObj === MATH_COMP)
            {
                //var ctrPrp = this.content[1].value.getCtrPrp();
                var ctrPrp = this.content[1].value.getCtrPrp_2();// иначе зациклимся на getCtrPrp
                txtPrp.Merge(ctrPrp);
            }
        }

        return txtPrp;
    },
    old_old_checkRunPrp: function()
    {
        var bEmpty = this.IsEmpty(),
            OnlyRunPrp = this.content.length == 2 && this.content[1].value.typeObj == MATH_RUN_PRP;

        if(bEmpty || OnlyRunPrp)
        {
            var txtPrp;
            if(this.bRoot)
                txtPrp = this.Composition.DefaultTxtPrp;
            else
                txtPrp = this.Parent.getCtrPrp();


            if(bEmpty)
                this.addRunPrp(txtPrp);
            else
            {
                var Run = this.content[1].value.runPrp;
                var currRun = new CTextPr();
                currRun.Merge(Run);

                Run.Merge(txtPrp);
                Run.Merge(currRun);

            }

        }
    },
    old_checkRunPrp: function()
    {
        var bEmpty = this.IsEmpty(),
            OnlyRunPrp = this.content.length == 2 && this.content[1].value.typeObj == MATH_RUN_PRP,
            bComposition = this.content[this.CurPos].value.typeObj == MATH_EMPTY && this.content.length > 1;

        if(this.bRoot && bEmpty)
        {
            var rPrp = this.Composition.DefaultTxtPrp;
            this.addRunPrp(rPrp);
        }
        else if(bEmpty)
        {
            var rPrp = this.Parent.getCtrPrp();
            this.addRunPrp(rPrp);
        }
        else if(OnlyRunPrp)
        {
            var rPrp = this.Parent.getCtrPrp();

            var Run = this.content[1].value.runPrp;
            var currRun = new CTextPr();
            currRun.Merge(Run);

            Run.Merge(rPrp);
            Run.Merge(currRun);
        }
        else if(bComposition)
        {
            //возможны два случая:
            // 1. если стоим в начале перед CEmpty и после идет Composition
            // 2. стоим после CEmpty, который относится к Composition

            var rPrp;
            if(this.CurPos == 1 && this.content[this.CurPos].value.typeObj == MATH_COMP)
                rPrp = this.content[this.CurPos].value.getCtrPrp();
            else if(this.content[this.CurPos - 2].value.typeObj == MATH_COMP)
                rPrp = this.content[this.CurPos - 2].value.getCtrPrp();
            else // на всякий случай
                rPrp = DEFAULT_RUN_PRP;

            this.addRunPrp(rPrp);
        }

        //this.addToBeginningRPrp(txtPrp);

    },
    verifyRPrp_MC: function(rPrp)
    {
        // добавляем RunPrp для текста, они будут такие же как и ctrPrp
        if(this.CurPos !== this.content.length - 1 && this.content[this.CurPos].value.typeObj !== MATH_RUN_PRP) // после того как добавили мат. объект, текущий объект не RunPrp, а текст
        {
            var runPrp = Common_CopyObj(rPrp);
            this.addRunPrp(runPrp);
        }
    },
    verifyRPrp_MC_2: function(rPrp) // for "menu"
    {
        // добавляем RunPrp для текста, они будут такие же как и ctrPrp
        if(this.CurPos !== this.content.length - 1 && this.content[this.CurPos].value.typeObj !== MATH_TEXT) // после того как добавили мат. объект, текущий объект не RunPrp, а текст
        {
            var runPrp = Common_CopyObj(rPrp);
            this.addRunPrp(runPrp);
        }
    },
    verifyRPrp_Letter: function()
    {
        var currType = this.content[this.CurPos].value.typeObj,
            prevType = this.CurPos > 0 ? this.content[this.CurPos - 1].value.typeObj : null,
            nextType = this.CurPos < this.content.length - 1 ? this.content[this.CurPos + 1].value.typeObj : null;


        var bEmpty = this.IsEmpty(),
            OnlyRunPrp = this.content.length == 2 && currType == MATH_RUN_PRP,
            bPreComposition = currType == MATH_EMPTY && prevType == MATH_COMP, // стоим между двумя мат. объектами
            bFirstComp = this.CurPos == 0 && nextType == MATH_COMP;

        if(this.bRoot && bEmpty)
        {
            var rPrp = this.Composition.DefaultTxtPrp;
            this.addRunPrp(rPrp);
        }
        else if(bEmpty)
        {
            var rPrp = this.Parent.getCtrPrp();
            this.addRunPrp(rPrp);
        }
        else if(OnlyRunPrp)
        {
            var rPrp = this.Parent.getCtrPrp();

            var Run = this.content[1].value.textPrp;
            var currRun = new CTextPr();
            currRun.Merge(Run);

            Run.Merge(rPrp);
            Run.Merge(currRun);
        }
        else if(bPreComposition)
        {
            // стоим после CEmpty, который относится к Composition, и соответственно дальше текста нет (либо конец формулы, либо между двумя мат объектами)

            var rPrp = this.content[this.CurPos - 1].value.getCtrPrp();
            this.addRunPrp(rPrp);
        }
        else if(bFirstComp)
        {
            // если стоим в начале перед CEmpty и после идет Composition
            var rPrp = this.content[1].value.getCtrPrp();
            this.addRunPrp(rPrp);
        }
    },
    old_addToBeginningRPrp: function(rPrp) // чтобы не возникало ошибок при добавлении RunPrp в начало, если уже выставлены некоторые RunPrp
    {
        var bEmpty = this.IsEmpty(),
            OnlyRunPrp = this.content.length == 2 && this.content[1].value.typeObj == MATH_RUN_PRP;

        if(bEmpty)
        {
            this.addRunPrp(rPrp);
        }
        else if( OnlyRunPrp)
        {
            var Run = this.content[1].value.runPrp;
            var currRun = new CTextPr();
            currRun.Merge(Run);

            Run.Merge(rPrp);
            Run.Merge(currRun);
        }

    },
    setItalic: function(flag)
    {
        var rPrp = new CTextPr();
        rPrp.Italic = flag;

        if(this.IsEmpty())
        {
            this.addRunPrp(rPrp);
        }
        else
        {
            for(var i = 1; i < this.content.length; i++)
            {
                if(this.content[i].value.typeObj == MATH_RUN_PRP)
                    this.content[i].value.Merge(rPrp);
            }
        }
    },
    addRPrpForSelect: function(rPrp)
    {
        var start   = this.RealSelect.startPos,
            end     = this.RealSelect.endPos;

        if(start > end)
        {
            var temp = start;
            start = end;
            end = temp;
        }

        for(var i = start; i < end; i++)
        {
            var obj = this.content[i].value;
            if(obj.typeObj == MATH_RUN_PRP)
            {
                obj.Merge(rPrp);
            }
            else if(obj.typeObj == MATH_COMP)
            {
                obj.setRPrp(rPrp);
            }
        }
    },
    setRPrp: function(rPrp)
    {
        for(var i = 0; i < this.content.length; i++)
        {
            var obj = this.content[i].value;
            if(obj.typeObj == MATH_RUN_PRP)
            {
                obj.Merge(rPrp);
            }
            else if(obj.typeObj == MATH_COMP)
            {
                obj.setRPrp(rPrp);
            }
        }
    },
    ////////////////////////

    ////////   /////////
    getMetricsLetter: function(pos)
    {
        return this.content[pos+1].value.getMetrics();
    },
    // для диакритических элементов, если в контенте есть заглавные буквы, и для букв ascent > ascent "o"
    // (!) повторяется функция (IsIncline)
    IsHighElement: function()
    {
        var res = false;

        for(var i =0 ; i < this.content.length; i++)
            if(this.content[i].value.IsHighElement())
            {
                res = true;
                break;
            }

        return res;
    },
    
    // (!) повторяется функция (IsHighElement)
    IsIncline: function()
    {
        var bIncline = false;

        if(this.content.length == 2)
            bIncline = this.content[1].value.IsIncline();

        return bIncline;
    },

    ////////////////////////////////////////////////////////////////

    Undo: function(Data)
    {
        var type = Data.Type;

        switch(type)
        {
            case historyitem_Math_AddItem:
            {
                var Pos = Data.Pos,
                    PosEnd = Data.PosEnd;

                var Content_start = this.content.slice(0, Pos);
                var Content_end   = this.content.slice(PosEnd);

                this.content = Content_start.concat(Content_end);
                this.CurPos = Pos - 1;
                this.setPlaceholderAfterRemove(); // выставляем placeholder после удаления всех остальных элементов

              break;
            }
            case historyitem_Math_RemoveItem:
            {
                var Pos = Data.Pos;

                if( this.IsPlaceholder() ) //удаляем тагет
                {
                    var empty = this.content[0]; //CEmpty
                    this.content.length = 0;
                    this.content.push( empty );
                }

                var Content_start = this.content.slice(0, Pos);
                var Content_end   = this.content.slice(Pos);

                this.content = Content_start.concat(Data.Items, Content_end);
                break;
            }
        }
    },
    Redo: function(Data)
    {
        var type = Data.Type;

        switch(type)
        {
            case historyitem_Math_AddItem:
            {
                var Pos = Data.Pos;

                if( this.IsPlaceholder() ) //удаляем тагет
                {
                    var empty = this.content[0]; //CEmpty
                    this.content.length = 0;
                    this.content.push( empty );
                }

                var Content_start = this.content.slice(0, Pos);
                var Content_end   = this.content.slice(Pos);
                
                this.setStart_Selection(Pos);
                //this.selection.active = false;

                this.content = Content_start.concat(Data.Items, Content_end);
                break;
            }
            case historyitem_Math_RemoveItem:
            {

                var Pos = Data.Pos,
                    PosEnd = Pos + Data.Items.length;

                var Content_start = this.content.slice(0, Pos);
                var Content_end   = this.content.slice(PosEnd);
                this.setStart_Selection(Pos - 1);
                //this.selection.active = false;

                this.content = Content_start.concat(Content_end);
                this.CurPos = Pos - 1;
                this.setPlaceholderAfterRemove(); // выставляем placeholder после удаления всех остальных элементов

                break;

            }
        }
    },
    Save_Changes: function(Data, Writer)
    {

    },
    Refresh_RecalcData: function()
    {
        this.Composition.Refresh_RecalcData2(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
                                                // Refresh_RecalcData2 у родительского класса сообщает, что у внутреннего класса произошли изменения, нужен пересчет
        // временно
        //this.RecalculateReverse();
        //this.Root.Resize();
    },
    /*Refresh_RecalcData2: function()
    {
        this.Composition.Refresh_RecalcData2();
    },*/
    _Check_HistoryUninon: function(Data1, Data2)
    {
        var Type1 = Data1.Type;
        var Type2 = Data2.Type;

        if ( historyitem_Paragraph_AddItem === Type1 && historyitem_Paragraph_AddItem === Type2 )
        {
            if ( 1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && !this.content[Data1.Pos].typeObj === MATH_COMP && !this.content[Data2.Pos].typeObj === MATH_COMP )
                return true;
        }
        return false
    },
    Check_HistoryUninon: function(Data1, Data2)
    {
        return false;
    },
    getStackPositions: function(stack)
    {
        stack.push( {X: this.CurPos} );

        if(!this.bRoot)
            this.Parent.getStackPositions( stack );
    },
    getContent: function(stack, bCurrent)
    {
        var content = null;
        var pos = stack.pop();

        if(bCurrent)
            this.CurPos = pos.X;

        if(stack.length > 0)
            content = this.content[pos.X].value.getContent(stack, bCurrent);
        else
            content = this;

        return content;

    },
    IsEmpty:    function()
    {
        return this.content.length == 1;
    },

    ///////  selection for Edit   ////////
    selection_Start: function(x, y)
    {
        if(this.IsPlaceholder())
        {
            this.LogicalSelect.start = 1;
            this.LogicalSelect.end = 2;
        }
        else
        {
            var msCoord = this.coordWOGaps({x: x, y: y});
            var pos = this.findPosition( msCoord);

            this.LogicalSelect.start = pos;
            this.LogicalSelect.end = pos;

            if(this.content[pos].value.typeObj === MATH_COMP)
            {
                var coord = this.getCoordElem(pos, msCoord);
                this.content[pos].value.selection_Start(coord.x, coord.y);
            }
        }
    },
    selection_End: function(x, y, MouseEvent)
    {
        // впоследствии нужно будет учитывать MouseEvent

        var state = true; // вышли / не вышли за переделы контента
        var SelectContent = null;

        if(this.IsPlaceholder())
        {
            SelectContent = this;
        }
        else
        {
            var msCoord = this.coordWOGaps({x: x, y: y});
            var posEnd = this.findPosition(msCoord),
                posStart = this.LogicalSelect.start;

            this.CurPos = posStart;
            this.LogicalSelect.end = posEnd;

            //селект внутри элемента (дроби и пр.)
            if(posStart === posEnd && this.content[posEnd].value.typeObj === MATH_COMP)
            {
                var coord = this.getCoordElem(posEnd, msCoord );
                var movement = this.content[posEnd].value.selection_End(coord.x, coord.y);
                this.setStartPos_Selection(posStart-1);

                if( ! movement.state )
                {
                    this.setEndPos_Selection(posEnd + 1);
                    SelectContent = this;
                }
                else
                    SelectContent = movement.SelectContent;
            }
            //селект элементов контента
            else
            {
                SelectContent = this;

                var direction = (posStart < posEnd) ? 1 : -1;


                if ( this.content[posStart].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setStartPos_Selection( posStart - 1);
                    else if( direction == -1 )
                        this.setStartPos_Selection( posStart + 1);
                }
                else
                    this.setStartPos_Selection(posStart);


                if( this.content[posEnd].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setEndPos_Selection(posEnd + 1);
                    else if( direction == -1 )
                        this.setEndPos_Selection(posEnd - 1);
                }
                else
                    this.setEndPos_Selection(posEnd);
            }
        }

        return {state: state, SelectContent:  SelectContent};
    },
    setStartPos_Selection: function( StartIndSelect )
    {
        if( this.content.length != 1)
        {
            //this.selection.active = true;
            StartIndSelect++; // start+1 ... end
            this.RealSelect.startPos = StartIndSelect;
            this.RealSelect.endPos   = StartIndSelect;
        }
        else // один CEmpty
        {
            this.RealSelect.startPos = 0;
            this.RealSelect.endPos = 0;
        }

    },
    setEndPos_Selection: function( EndIndSelect )
    {
        this.RealSelect.endPos = EndIndSelect + 1;
    },
    setLogicalPosition:  function(pos)
    {
        this.CurPos = pos; // на всякий случай

        this.LogicalSelect.start = pos;
        this.LogicalSelect.end   = pos;

        this.RealSelect.startPos = pos;
        this.RealSelect.endPos = pos;

    },
    setSelect_Beginning: function(bStart)
    {
        if(bStart)
        {
            /*this.LogicalSelect.start = 1; /// в итоге, селект начнется с позиции 1
            this.LogicalSelect.end   = 1;
            this.CurPos = 1;

            this.RealSelect.endPos    = 1;
            this.RealSelect.startPos    = 1;*/

            this.setLogicalPosition(1);
        }
        else
        {
            this.LogicalSelect.end   = 1;
            this.RealSelect.endPos    = 1;

            var start = this.RealSelect.startPos,
                current   = this.content[this.CurPos].value.typeObj,
                selectStart = this.content[start].value.typeObj;    // only for draw select
                                                                    // logical select is "RealPosSelect"

            if(current == MATH_COMP && selectStart == MATH_COMP)
            {
                this.RealSelect.startPos++;
            }

           /* if(this.content[this.RealSelect.startPos].value.typeObj == MATH_COMP)
                console.log("Select is composition");
            else
                console.log("Select is other object");

            if(this.content[this.CurPos].value.typeObj == MATH_COMP)
                console.log("current is composition");
            else
                console.log("current is other object");*/

        }
    },
    setSelect_Ending: function(bStart)
    {
        if(bStart)
        {
            /*this.LogicalSelect.start = this.content.length - 1;
            this.LogicalSelect.end   = this.content.length - 1;
            this.CurPos = this.content.length - 1;*/

            this.setLogicalPosition(this.content.length - 1);
        }
        else
        {
            this.LogicalSelect.end   = this.content.length - 1;
            this.RealSelect.endPos   = this.content.length;

            var start = this.RealSelect.startPos - 2,
                current   = this.content[this.CurPos].value.typeObj,
                selectStart = start > 0 ? this.content[start].value.typeObj : null;

            if(current == MATH_COMP && selectStart == MATH_COMP)
            {
                this.RealSelect.startPos -= 2;
            }
        }
    },
    selection_check:  function(X, Y)
    {
        var flag = false;

        var x = X - this.pos.x,
            y = Y - this.pos.y;

        var bWidth =  x >= 0 && x <= this.size.width,    // попали в контент по ширине
            bHeight = y >= 0 && y <= this.size.height,   // попали в контент по высоте
            bSelect = this.selectUse();

        if(this.IsPlaceholder())
        {
            flag = false;
        }
        else if(bSelect && bWidth && bHeight)
        {
            var start = this.RealSelect.startPos - 1,
                end   = this.RealSelect.endPos - 1;

            var beforeSelect = this.content[start].widthToEl,
                afterSelect = this.content[end].widthToEl  + this.content[end].g_mContext.right;

            flag = beforeSelect <= x && x <= afterSelect;
        }

        return flag;
    },

    ////////////////  Test function for test_math  //////////////////

    mouseUp: function()
    {
        /*if( this.selection.active )
        {

            if( this.content[this.CurPos].value.typeObj === MATH_COMP )
                this.content[this.CurPos].value.mouseUp();
        }*/
    },
    mouseDown: function(mouseCoord, inside_flag)  // mouseDown идем сверху вниз по иерархии
    {
        var result = null;

        if(typeof(inside_flag) === "undefined")
            inside_flag = -1;

        if(this.IsPlaceholder())
        {
            result = this;
        }
        else
        {
            var msCoord = this.coordWOGaps(mouseCoord);

            if(inside_flag == 0)
                this.CurPos = 0;
            else if(inside_flag == 1)
                this.CurPos = this.content.length - 1;
            else
                this.CurPos = this.findPosition( msCoord );

            if( this.content[this.CurPos].value.typeObj === MATH_COMP )
            {
                var coord = this.getCoordElem(this.CurPos, msCoord);
                result = this.content[this.CurPos].value.mouseDown(coord);
            }
            else
                result = this;

            //this.setStart_Selection(this.CurPos);
            this.setLogicalPosition(this.CurPos);
        }

        return result;
    },
    mouseMove: function(mouseCoord) // mouseMove идем сверху вниз по иерархии
    {
        var state = true;
        var SelectContent = null;

        if(this.IsPlaceholder())
        {
            SelectContent = this;
        }
        else
        {
            var msCoord = this.coordWOGaps(mouseCoord);
            var pos = this.findPosition( msCoord );

            //селект внутри элемента (дроби и пр.)
            if(this.CurPos === pos && this.content[pos].value.typeObj === MATH_COMP)
            {
                //this.setStart_Selection( pos - 1 );
                this.setStartPos_Selection(pos - 1);
                var coord = this.getCoordElem(this.CurPos, msCoord );
                var movement = this.content[pos].value.mouseMove(coord);

                if( ! movement.state )
                {
                    this.setEndPos_Selection(pos+1);
                    //this.setEnd_Selection( pos + 1 );
                    SelectContent = this;
                }
                else
                    SelectContent = movement.SelectContent;
            }
            //селект элементов контента
            else
            {
                SelectContent = this;

                var direction = ( this.CurPos < pos ) ? 1 : -1;

                if ( this.content[this.CurPos].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setStartPos_Selection(this.CurPos - 1);
                        //this.setStart_Selection( this.CurPos - 1);
                    else if( direction == -1 )
                        this.setStartPos_Selection(this.CurPos + 1);
                        //this.setStart_Selection( this.CurPos + 1);
                }
                else
                    this.setStartPos_Selection(this.CurPos);
                    //this.setStart_Selection( this.CurPos );

                if( this.content[pos].value.typeObj === MATH_COMP )
                {
                    if( direction == 1 )
                        this.setEndPos_Selection(pos+1);
                        //this.setEnd_Selection(pos + 1);
                    else if( direction == -1 )
                        this.setEndPos_Selection(pos-1);
                        //this.setEnd_Selection(pos - 1);
                }
                else
                    this.setEndPos_Selection( pos );
                    //this.setEnd_Selection( pos );
            }
        }

        return {state: state, SelectContent: SelectContent }; //для CMathContent state всегда true
    },
    tgtSelect: function()
    {
        this.CurPos = 1;
        //this.setStart_Selection(0);
        this.setStartPos_Selection(0);
        this.setEndPos_Selection(1);
        //this.setEnd_Selection(1);
        //this.selection.active = false;
    }
    /////////////////////////////////////////////////////////////////


    ////  test function for me  ////

    /*RecalculateReverse: function(oMeasure)
     {
     // for add component, set Txt Properties
     var start = this.rInterval.startPos,
     end = this.rInterval.endPos;
     for(var i = start; i < end; i++)
     this.content[i].value.Resize(oMeasure);

     this.rInterval.startPos = this.rInterval.endPos = this.CurPos;

     this.recalculateSize();
     if(! this.bRoot )
     this.Parent.RecalculateReverse(oMeasure);
     },*/
    //////////////*    end  of  test  functions   *//////////////////

}
//todo
//разобраться с gaps

function CMathComposition()
{
    this.TEST_SELECT_ACTIVE = false;
    this.pos = null;
    this.Root = null;

    this.CurrentContent    = null;
    this.SelectContent     = null;

    this.DefaultTxtPrp =
    {
        FontFamily:     {Name  : "Cambria Math", Index : -1 },
        FontSize:       36,
        Italic:         true,
        Bold:           false,
        RFonts:         {},
        Lang:           {}
    };

    this.Init();

    this.Parent = undefined;
}
CMathComposition.prototype =
{
    // сделать глобальную булевскую переменную для того, чтобы запоминать нужен пересчет контента или нет
    // необходима тк на backspace  может не быть  реального удаления переменных, а только селект

    ////  test function for me  ////
    TestSetPosition: function()
    {
        this.Root.setPosition(this.posCompos);
    },
    TestSetFontAllSymbols: function(font)
    {
        this.Root.setFont(font);
    },
    CheckTarget: function()
    {
        var bSelect = this.SelectContent.selectUse(),
            bTarget = this.SelectContent.IsPlaceholder(),
            bHideTgt = this.SelectContent.plhHide;

        if(bTarget)
        {
            if(!bHideTgt)
            {
                this.SelectContent.tgtSelect();
                this.HideCursor();
            }
            else
            {
                this.SelectContent.setPositionHideTgt();
                this.ShowCursor();
            }
        }
        else if(bSelect)
            this.HideCursor();
        else
        {
            this.ShowCursor();
        }

        this.CurrentContent.update_Cursor();
    },
    Cursor_MoveRight_2: function()
    {
        this.ClearSelect();
        var move = this.SelectContent.cursor_moveRight();

        //передаем состояние, т.к. можем выйти за пределы формулы
        if(move.state)
        {
            // SelectContent == CurrentContent
            this.SelectContent = move.SelectContent;
            this.CurrentContent = move.CurrContent;

            this.CheckTarget();
        }

        return move.state;
    },
    Cursor_MoveLeft_2: function()
    {
        this.ClearSelect();
        var move = this.SelectContent.cursor_moveLeft();

        if(move.state)
        {
            this.SelectContent = move.SelectContent;
            this.CurrentContent = move.CurrContent;

            this.CheckTarget();
        }

        return move.state;
    },
    Cursor_MoveUp_2: function()
    {
        //TODO !!!
        //сделать как в Cursor_MoveLeft/Right
        // в зависимости от пришедшего флага выставлять/не выставлять контент
        this.ClearSelect();
        var move = this.SelectContent.cursor_moveUp();

        this.CurrentContent = move.CurrContent;
        this.SelectContent = move.SelectContent;

        this.CheckTarget();

        return move.state;
    },
    OnKeyDown: function(e)
    {
        //стрелка вверх
        if(e.KeyCode==38)
        {
            this.Cursor_MoveUp_2();

            return true;
        }
        //стрелка вниз
        else if(e.KeyCode==40)
        {
            this.Cursor_MoveDown_2();

            return true;
        }
        //стрелка влево
        if(e.KeyCode==37)
        {
            this.Cursor_MoveLeft_2();

            return true;
        }
        //стрелка вправо
        else if(e.KeyCode==39)
        {
            this.Cursor_MoveRight_2();

            return true;
        }
        //backspace
        else if(e.KeyCode==8)
        {
            try
            {
                if(this.Remove_2(1))
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
        //delete
        else if ( e.KeyCode == 46)
        {
            if(this.Remove_2(-1))
            {
                //this.UpdatePosition();
                editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, editor.WordControl.m_oLogicDocument.Pages[0]);

            }
        }

        if(e.CtrlKey == true  && e.KeyCode == 81)
        {
            simulatorMComposition(this, MATH_READ);
            return false;
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
            this.AddLetter_2(code);

            return true;
        }


        return false;
    },
    OnMouseDown: function(x,y)
    {
        var coord = this.GetCoordComp(x,y);

        if( this.IsRect(coord.x, coord.y) )
            this.MouseDown(coord.x, coord.y);
    },
    OnMouseMove: function(x,y)
    {
        var coord = this.GetCoordComp(x,y);

        if( this.IsRect(coord.x, coord.y) )
            this.MouseMove(coord.x, coord.y);
    },
    OnMouseUp: function()
    {
        this.MouseUp();
    },
    MouseDown: function(mouseX, mouseY)
    {
        this.ClearSelect();
        this.CurrentContent = this.SelectContent = this.Root.mouseDown({x: mouseX, y: mouseY}, -1);

        this.TEST_SELECT_ACTIVE = true;

        this.CheckTarget();
    },
    MouseMove: function(mouseX, mouseY)
    {
        if(this.TEST_SELECT_ACTIVE)
        {
            this.ClearSelect();

            var movement = this.Root.mouseMove({x: mouseX, y: mouseY});
            this.SelectContent = movement.SelectContent;

            this.CheckTarget();
        }
    },
    MouseUp: function()
    {
        this.TEST_SELECT_ACTIVE = false;
    },
    Remove_2: function(order)
    {
        if(TEST)
        {
            History.Create_NewPoint();
            /*var start = this.SelectContent.selection.startPos,
             end = this.SelectContent.selection.endPos;*/
            var start = this.SelectContent.RealSelect.startPos,
                end   = this.SelectContent.RealSelect.endPos;
            var Pos;

            if(start !== end)
                Pos = start < end ? start: end;
            else if(order == 1)
                Pos = this.SelectContent.CurPos;
            else
                Pos = this.SelectContent.CurPos + 1;
        }

        this.ClearSelect();

        var result = this.SelectContent.remove(order);
        this.CurrentContent = result.CurrContent;
        this.SelectContent  = result.SelectContent;

        this.CurrentContent.setPlaceholderAfterRemove(); // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент

        if( result.state.bDelete )
        {
            if(TEST)
            {
                History.Add(this.CurrentContent, {Type: historyitem_Math_RemoveItem, Items: result.items, Pos: Pos});
            }

            // временно
            //this.CurrentContent.RecalculateReverse();
            this.Resize(g_oTextMeasurer);
            this.UpdatePosition();
        }

        this.CheckTarget();


        return result.state.bDelete;
    },
    RecalculateComposition_2: function(oMeasure)
    {
        //this.SetReferenceComposition();

        this.Root.Resize(oMeasure);
        this.Root.setPosition(this.pos);
        this.UpdateCursor();
    },
    AddLetter_2: function(code)
    {
        if(TEST)
        {
            History.Create_NewPoint();
        }

        this.ClearSelect();
        this.SelectContent.removeAreaSelect();


        /*if(this.Root.IsEmpty())
         this.Root.addRunPrp(this.DefaultTxtPrp);*/

        var items =  this.SelectContent.addLetter(code);

        ///

        // временно
        //this.RecalculateReverse();
        this.Resize(g_oTextMeasurer);

        this.UpdatePosition();
        ///

        if(TEST)
        {
            var Pos = this.SelectContent.CurPos,
                EndPos = this.SelectContent.CurPos + 1;

            History.Add(this.CurrentContent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: EndPos});
        }

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    CreateEquation2: function(indef)
    {
        this.CreateEquation(indef);
        // временно
        //this.RecalculateReverse();
        //this.Root.Resize();
        this.Resize(g_oTextMeasurer);
        this.UpdatePosition();
    },
    UpdateCursor2: function()
    {
        //this.CurrentContent.update_Cursor();
        this.SelectContent.update_Cursor();
        if( this.SelectContent.selectUse())
            this.HideCursor();
        else
            this.ShowCursor();
    },
    HideCursor: function()
    {
        editor.WordControl.m_oLogicDocument.DrawingDocument.TargetEnd();
    },
    ShowCursor: function()
    {
        //узнать зачем обе функции вызывать
        editor.WordControl.m_oLogicDocument.DrawingDocument.TargetStart();
        editor.WordControl.m_oLogicDocument.DrawingDocument.TargetShow();
    },
    old_SetTxtPrp: function(txtPrp)
    {
        this.SelectContent.changeTxtPrp(txtPrp, false);
        //this.SelectContent.setTxtPrp(txtPrp, false);
        this.Resize();
        this.UpdatePosition();
        this.UpdateCursor();
    },
    Set_SelectionState_2 : function(State)
    {
        this.ClearSelect();
        // временно
        //this.RecalculateReverse();
        //this.Root.Resize();
        this.Resize(g_oTextMeasurer);
        this.UpdatePosition();

        var stackSelect = Common_CopyObj(State.Select.stack),
            stackCurrent = Common_CopyObj(State.Current.stack);

        this.SelectContent = this.Root.getContent( stackSelect, false );
        this.CurrentContent = this.Root.getContent( stackCurrent, true );

        /*if(this.SelectContent.IsPlaceholder())
         this.CheckTarget();
         else if( State.Select.StartSelect !== State.Select.EndSelect )
         {
         this.SelectContent.setStart_Selection(State.Select.StartSelect );
         this.SelectContent.setEnd_Selection(State.Select.EndSelect);
         //this.SelectContent.selection.active = false;
         }
         else
         {
         this.SelectContent.setStart_Selection(State.Select.StartSelect - 1);
         //this.SelectContent.selection.active = false;
         this.UpdateCursor();
         }*/
    },
    ClearSelect: function()
    {
        if(this.SelectContent.selectUse())
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectClear();
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectEnabled(false);
        }
    },
    Draw_2: function(pGraphics)
    {
        if(this.Root.content.length > 1)
        {
            var w_Box = this.Root.size.width;
            var h_Box = this.Root.size.height;

            pGraphics.p_color(224, 238, 224, 255); // "p_color" for stroke
            // "b_color1" for fill
            //context.b_color1(224, 238, 230, 255);

            pGraphics.drawHorLine(0, this.pos.y, this.pos.x, this.pos.x + w_Box, 0.2);
            pGraphics.drawHorLine(0, this.pos.y + h_Box, this.pos.x, this.pos.x + w_Box, 0.2);
            pGraphics.drawVerLine(0,this.pos.x, this.pos.y, this.pos.y + h_Box, 0.2 );
            pGraphics.drawVerLine(0,this.pos.x + w_Box, this.pos.y, this.pos.y + h_Box, 0.2 );
        }

        this.Root.draw(pGraphics);
    },
    UpdatePosition: function()
    {
        this.Root.setPosition(this.pos);
    },
    SetPosition: function(pos)
    {
        this.pos = pos;
        this.Root.setPosition(this.pos);
    },
    IsRect: function(x, y)
    {
        var size = this.Root.size;
        return ( x > 0 && x < size.width && y > 0 && y < size.height);
    },
    GetCoordComp: function(x, y)
    {
        var _x = x - this.pos.x;
        var _y = y - this.pos.y;

        return {x: _x, y: _y};
    },
    Resize: function(oMeasure)
    {
        this.Root.Resize(oMeasure);
    },
    test_for_edit: function()
    {
        var props =
        {
            type:   BAR_FRACTION
        };
        var fract = new CFraction();

        addToContent_ForRead(this.Root, fract, props);

        fract.getNumerator().addTxt("a");
        fract.getDenominator().addTxt("b");
    },
    test_for_edit_2:  function()
    {
        simulatorMComposition(this, MATH_EDIT);
    },
    /*RecalculateReverse: function(oMeasure) // for edit
     {
     this.SelectContent.RecalculateReverse(oMeasure);
     },*/
    //////////////*    end  of  test  functions   *//////////////////

    Init: function()
    {
        // TODO
        // переделать gaps
        //var g_Unif = 6*g_dKoef_pix_to_mm;
        var g_Unif = 0;
        var gps = new dist(g_Unif, g_Unif, g_Unif, g_Unif);

        this.Root = new CMathContent();
        this.Root.g_mContext = gps;
        this.Root.setComposition(this);
        //this.SetTestRunPrp();
        //this.Root.setTxtPrp(this.TxtPrp);

        this.CurrentContent = this.Root;
        this.SelectContent  = this.Root;

        this.Root.relate(-1); // корень
    },
    /*SetTestRunPrp: function()
    {
        var runPrp = new CTextPr();
        runPrp.Merge(this.DefaultTxtPrp);

        this.Root.addRunPrp(runPrp);
    },*/
    GetTxtPrp: function()
    {
        return this.DefaultTxtPrp;
    },
    //TODO
    // position вычислить естественно до того, как придет Draw, чтобы не пришлось пересчитывать при изменении в тексте документа
    Draw: function(x, y, pGraphics)
    {
        if(this.Root.content.length > 1)
        {
            this.pos = {x: x, y: y - this.Root.size.center};
            this.Root.setPosition({x: x, y: y - this.Root.size.center});
            this.Root.draw(pGraphics);
        }
    },
    GetFirstPrp: function()
    {
        return this.Root.getFirstPrp();
    },
    Cursor_MoveLeft: function(bShiftKey, bCtrlKey)
    {
        var move = this.SelectContent.cursor_moveLeft(bShiftKey, bCtrlKey);

        if(move.state)
        {
            if(bShiftKey)
            {

            }
            else
            {
                 this.SelectContent = move.SelectContent;
                 this.CurrentContent = move.CurrContent;
            }
        }

        return move.state;
    },
    Cursor_MoveRight: function(bShiftKey, bCtrlKey)
    {
        var move = this.SelectContent.cursor_moveRight(bShiftKey, bCtrlKey);

        //передаем состояние, т.к. можем выйти за пределы формулы
        if(move.state)
        {
            this.SelectContent = move.SelectContent;
            this.CurrentContent = move.CurrContent;
        }

        return move.state;
    },
    Cursor_MoveUp: function()
    {
        //TODO !!!
        //сделать как в Cursor_MoveLeft/Right
        // в зависимости от пришедшего флага выставлять/не выставлять контент

        var move = this.SelectContent.cursor_moveUp();

        this.CurrentContent = move.CurrContent;
        this.SelectContent = move.SelectContent;

        return move.state;
    },
    Cursor_MoveDown: function()
    {
        var move = this.SelectContent.cursor_moveDown();

        this.CurrentContent = move.CurrContent;
        this.SelectContent = move.SelectContent;

        return move.state;
    },
    Cursor_MoveToStartPos: function()
    {
        this.Root.cursor_MoveToStartPos();
        this.CurrentContent = this.SelectContent = this.Root;
    },
    Cursor_MoveToEndPos: function()
    {
        this.Root.cursor_MoveToEndPos();
        this.CurrentContent = this.SelectContent = this.Root;
    },
    getSize: function()
    {
        /*return this.Root.size;*/

        //
        var sh = 0.2487852283770651*g_oTextMeasurer.GetHeight();
        //
        var size =
        {
            Width:          this.Root.size.width,
            WidthVisible:   this.Root.size.width,
            Height:         this.Root.size.height,
            Ascent:         this.Root.size.center + sh,
            Descent:        this.Root.size.height - this.Root.size.center
        };

        return size;
    },
    Remove: function(order, bOnAdd)
    {
        ////*    History    */////
        History.Create_NewPoint();

        var start = this.SelectContent.RealSelect.startPos,
            end   = this.SelectContent.RealSelect.endPos;
        var Pos;

        if(start !== end)
            Pos = start < end ? start: end;
        else if(order == 1)
            Pos = this.SelectContent.CurPos;
        else
            Pos = this.SelectContent.CurPos + 1;

        ///////////////////////////

        var removeMComp = true;

        if(bOnAdd)
        {
            this.SelectContent.removeAreaSelect();
        }
        else
        {
            var result = this.SelectContent.remove(order);

            var bRoot = this.SelectContent.bRoot === true,
                bToUpper = result.state.bBegin || result.state.bEnd; // наверх нужно ли прокидовать


            if( result.state.bDelete )
                History.Add(this.CurrentContent, {Type: historyitem_Math_RemoveItem, Items: result.items, Pos: Pos});


            this.CurrentContent = result.CurrContent;
            this.SelectContent  = result.SelectContent;
            this.CurrentContent.setPlaceholderAfterRemove(); // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент

            removeMComp = !(bRoot && bToUpper);  // посылаем false, если в начале + backspace или в конце + delete
        }

        return removeMComp;
    },
    AddLetter: function(code)
    {
        History.Create_NewPoint();

        var items =  this.SelectContent.addLetter(code);
        this.CurrentContent = this.SelectContent;

        ///

        var Pos = this.SelectContent.CurPos,
            EndPos = this.SelectContent.CurPos + 1;

        History.Add(this.CurrentContent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: EndPos});
    },
    CreateEquation: function(indef)
    {
        History.Create_NewPoint();

        var Pos = this.SelectContent.CurPos + 1;
        var items = this.SelectContent.createEquation(indef);
        this.CurrentContent = this.SelectContent;

        var EndPos = this.SelectContent.CurPos + 1;
        History.Add(this.CurrentContent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: EndPos});

    },
    UpdateCursor: function()
    {
        this.SelectContent.update_Cursor();
    },

    Refresh_RecalcData2: function()
    {
        this.Parent.Refresh_RecalcData2();
    },
    RecalculateComposition:  function(oMeasure, TextPr) // textPrp в тестовом режиме, просто отрисуем с ними формулу
    {
        this.Root.Resize(oMeasure); // пересчитываем всю формулу

        var width = this.Root.size.width,
            height = this.Root.size.height;

        return {Width: width, Height: height, WidthVisible: width };
    },
    Selection_SetStart: function(X, Y, PageNum)
    {
        var x = X - this.pos.x,
            y = Y - this.pos.y;

        this.Root.selection_Start(x, y);
    },
    Selection_SetEnd: function(X, Y, PageNum, MouseEvent)
    {
        var x = X - this.pos.x,
            y = Y - this.pos.y;

        var result = this.Root.selection_End(x, y, MouseEvent);
        this.SelectContent = result.SelectContent;
    },
    Selection_Draw: function()
    {
        this.SelectContent.drawSelect();
    },
    Selection_Beginning: function(bStart) // если приходит bStart = false, то это означает Selection_SetEnd (конец селекта в начале контента)
    {
        this.Root.setSelect_Beginning(bStart);
        this.SelectContent = this.Root; // а здесь необходимо выставить
    },
    Selection_Ending:  function(bStart)
    {
        this.Root.setSelect_Ending(bStart);
        this.SelectContent = this.Root;
    },
    Selection_IsEmpty: function()
    {
        var bPlh = this.SelectContent.IsPlaceholder(),
            bNotSelect = !this.SelectContent.selectUse();

        return !bPlh && bNotSelect;
    },
    Selection_Check: function(X, Y)
    {
        return this.SelectContent.selection_check(X, Y);
    },
    Is_Empty: function()
    {
        return this.Root.IsEmpty();
    },

    /////////  for Undo/Redo ////////
    Get_SelectionState : function()
    {
        var State = new Object();

        var stackCurrent = new Array();
        this.CurrentContent.getStackPositions( stackCurrent );
        State.Current =
        {
            stack:              stackCurrent
        };

        var stackSelect = new Array();
        this.SelectContent.getStackPositions( stackSelect );

        State.Select =
        {
            StartSelect:        this.SelectContent.RealSelect.startPos - 1,
            EndSelect:          this.SelectContent.RealSelect.endPos - 1,
            stack:              stackSelect
        };

        return State;
    },
    Set_SelectionState : function(State)
    {
        var stackSelect = Common_CopyObj(State.Select.stack),
            stackCurrent = Common_CopyObj(State.Current.stack);

        this.SelectContent = this.Root.getContent( stackSelect, false );
        this.CurrentContent = this.Root.getContent( stackCurrent, true );
    }
    /////////////////////////////////////////

}


function CEmpty()
{
    this.typeObj = MATH_EMPTY;
    this.pos = null;

    //this.size = {width: 0, ascent:0, descent: 0, height: 0, center: 0};
    this.size = {width: 0, height: 0, center: 0, ascent: 0};
    this.RealSelect =
    {
        startPos:   0,
        endPos:     0
    };

    this.draw = function(nothing) {};
    this.mouseMove = function(nothing1, nothing2) { return true; };
    this.setFont = function() {};

    this.setPosition = function (_pos) { this.pos = _pos; };
    this.Resize = function(){};

    this.IsHighElement =  function() { return false; };
    /*this.setTxtPrp = function(txtPrp) { this.TxtPrp.Merge(txtPrp); };
    this.setCtrPrp = function(txtPrp) {};
    this.getRunPrp = function() {return this.TxtPrp; };
    this.setOwnTPrp = function() {};*/
    this.relate     = function() {};
}

function CMRun()
{
    /**this.text = "";
    this.txtPrp = null;
    this.mathRunPrp = null;*/

    this.props =
    {
        text:       "",
        txtPrp:     null,
        mathRunPrp: null
    };
}
CMRun.prototype =
{
    getTypeElement: function()
    {
        return MATH_RUN;
    },
    setRunPrp:  function(oRunPrp)
    {
        var rPrp = oRunPrp.getPropsForWrite();

        this.props.txtPrp     = rPrp.textPrp;
        this.props.mathRunPrp = rPrp.mathRunPrp;
    },
    addLetter:  function(oMText)
    {
        this.props.text += String.fromCharCode(oMText.value);
    },
    getPropsForWrite: function()
    {
        return this.props;
    }
}


function TEST_MATH_EDIT()
{
    //MathComposition.test_for_edit();
    MathComposition.test_for_edit();
    MathComposition.RecalculateComposition(g_oTextMeasurer, MathComposition.DefaultTxtPrp);
    //MathComposition.Draw_2(x, y, )


    editor.WordControl.m_oLogicDocument.DrawingDocument.OnRecalculatePage(0, { Width : Page_Width, Height : Page_Height, Margins :  {
        Left   : X_Left_Field,
        Right  : X_Right_Field,
        Top    : Y_Top_Field,
        Bottom : Y_Bottom_Field
    } } );
}

