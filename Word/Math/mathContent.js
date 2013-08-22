var historyitem_Math_AddItem                   =  1; // Добавляем элемент
var historyitem_Math_RemoveItem                =  2; // Удаляем элемент

var TEST = true;

var StartTextElement = 0x2B1A; // Cambria Math

function dist(_left, _right, _top, _bottom)
{
    this.left = _left;
    this.right = _right;
    this.top = _top;
    this.bottom = _bottom;
}
function mathElem(_val)
{
    this.value = _val;
    this.widthToEl = 0; // width to this element
    this.g_mContext =
    {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }; //mm
}



//TODO
//переделать/продумать DotIndef, т.к. при перетаскивании из одного места в другое флаг DotIndef может измениться для другого контента

//TODO
//сделать более понятным индефикатор bMText

//TODO
//пересмотреть this.dW и this.dH

//TODO
//добавить gaps для мат элементов и математических знаков

//TODO
//сделать, чтобы курсор выставлялся только, где это действительно необходимо
//в качетве позиции для контента передавать положение baseLine для него

//TODO
//indefSize убрать

//TODO
//переделать CDegree

//TODO
//убрать CSymbol

//TODO
//пересмотреть/убрать CSubMathBase

//TODO
//переделать степень для случая с 2-мя итераторами : посмотреть как сделано для n-арного оператора

//TODO
//сделать у радикала степень



// TODO Refactoring

// 1. переделать mouseMove (вызов из this.SelectContent, а не из this.Root, далее если state == false, подниматься наверх)
// 1. (!!) повтор IsIncline, IsHighElement
// 2. (!!) переделать add / add_mathComponent / addText / addLetter
// 3. home/end if( IsTarget() )
// 4. relate => сделать 2 функции : одну установить базовый контент корнем(Root) и функцию установить родительский класс (setParent)
// 5. update_widthContent добавить в recalculateSize (убрать recalculate в CMathContent)
// 6. (скорее всего) убрать coordWOGaps
// 7. убрать getMetricsLetter
// 8. setFont и updateTextPrp переделать (сделать, чтобы font менялся для заселекченной части контента)


function CMathContent()
{
    this.SUBCONTENT = false;
    this.bDot       =   false;
    this.plhHide    =   false;

    this.content = new Array(); // array of mathElem
    this.CurPos = 0;
    this.pos = {x:0, y:0};
    this.g_mContext =   null;

    this.TxtPrp = new CMathTextPrp();
    this.OwnTPrp = new CMathTextPrp();

    this.Composition = null; // ссылка на общую формулу

    this.reduct     =   1;      // индефикатор для степени (уменьшение размера шрифта)
    this.rInterval =
    {
        startPos: 0,
        endPos: 0
    };

    this.selection =
    {
        active:     false,
        //use:        false, //есть селект или нет
        startPos:   0,
        endPos:     0
    };
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
    setTxtPrp: function(txtPrp)
    {
        this.TxtPrp.Merge(txtPrp);
        for(var i = 0; i < this.content.length; i++)
            this.content[i].value.setTxtPrp(txtPrp);
    },
    changeTxtPrp: function(txtPrp)
    {
        var start, end;
        if( this.selection.startPos != this.selection.endPos )
        {
            start = this.selection.startPos;
            end = this.selection.endPos;
            if(start > end)
            {
                tmp = start;
                start = end;
                end = tmp;
            }
        }

        for(var i = start; i < end; i++)
            this.content[i].value.setOwnTPrp(txtPrp);
    },
    setOwnTPrp: function(txtPrp)
    {
        this.OwnTPrp.Merge(txtPrp);
        for(var i = 0; i < this.content.length; i++)
            this.content[i].value.setOwnTPrp(txtPrp);
    },
    getRunPrp: function(pos)
    {
        var runPrp = new CMathTextPrp();
        var rPrp = null;

        if(this.content.length > 1)
        {
            if(pos == 0)
            {
                rPrp = this.content[pos+1].value.getTxtPrp();
                runPrp.Merge(rPrp);
            }
            else
            {
                if(this.content[pos].value.empty) // возможность, когда в контенте один CEmpty исключили в начале
                    rPrp = this.content[pos-1].value.getTxtPrp();
                else
                    rPrp = this.content[pos].value.getTxtPrp();
                runPrp.Merge(rPrp);
            }
        }
        else
        {
            runPrp.Merge(this.getTxtPrp());
        }

        return runPrp;
    },
    getSelectTPrp: function(bSelect)
    {
        var start, end;

        if(bSelect)
        {
            start = this.selection.startPos;
            end = this.selection.endPos;
        }
        else
        {
            start = 0;
            end = this.content.length;
        }

        if( this.selection.startPos != this.selection.endPos )
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

        this.setStart_Selection(this.CurPos);
        this.selection.active = false;

        var EndPos = this.CurPos;

        var items = this.content.slice(Pos, EndPos);

        return items;
    },
    addLetter: function(code)
    {
        if(this.rInterval.startPos == this.rInterval.endPos)
            this.rInterval.startPos = this.rInterval.endPos = this.CurPos + 1;

        var gps = null;
        if(code == 0x002B || code == 0x002F || code == 0x002A || code == 0x002D)
        {
            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 ) *g_dKoef_pix_to_mm;
            l_gap = r_gap = 0;
            gps = new dist(l_gap, r_gap, 0, 0);
        }
        else
            gps = new dist(0,0,0,0);

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
        symb.relate(this);
        symb.add(code);
        var runPrp = this.getRunPrp(this.CurPos);
        symb.setTxtPrp( runPrp );

        // txt properties

        this.addElementToContent(symb, gps);
        var item = this.content[this.CurPos];

        if(!TEST)
        {
            History.Create_NewPoint();

            var Pos = this.CurPos,
                EndPos = this.CurPos + 1;

            History.Add(this, {Type: historyitem_Math_AddItem, Items: [item], Pos: Pos, PosEnd: EndPos});
        }

        this.rInterval.endPos++; // max количество элементов this.CurPos

        return [item];
    },
    addMComponent: function(ind)
    {
        var l_gap =  0, r_gap = 0;
        var mathElem = null;    //положение этого элемента будет this.CurPos + 1

        if(this.rInterval.startPos == this.rInterval.endPos)
            this.rInterval.startPos = this.rInterval.endPos = this.CurPos + 1;

        switch(ind)
        {
            case 0:
                mathElem = new CBarFraction();
                break;
            case 1:
                mathElem = new CSkewedFraction();
                break;
            case 2:
                mathElem = new CLinearFraction();
                break;
            case 3:
                mathElem = new CDegreeOrdinary();
                break;
            case 4:
                mathElem = new CDegreeSubSup(0);
                break;
            case 5:
                mathElem = new CDegreeSubSup(1);
                break;
            case 6:
                mathElem = new CRadical();
                break;
            case 7:
                mathElem = new CDegreeRadical();
                break;
            case 8:
                mathElem = new CNary();
                break;
            case 9:
                mathElem = new CDelimiter();
                break;
            case 10:
                mathElem = new CSeparatorDelimiter();
                break;
            case 11:
                mathElem = new CMathFunc();
                break;
            case 12:
                mathElem = new CCircumflex();
                break;
            case 13:
                mathElem = new CSign();
                break;
            case 14:
                mathElem = new CLine();
                break;
            case 15:
                mathElem = new CAccent();
                break;
            case 16:
                mathElem = new GroupCharacter();
                break;
            case 17:
                mathElem = new CStructCombiningArrow();
                break;
            case 18:
                mathElem = new CBorderBox();
                break;
            case 19:
                mathElem = new CMinimax();
                break;
            case 20:
                mathElem = new CStructArrow();
                break;
            case 21:
                mathElem = new CMathMatrix();
                break;
            case 22:
                mathElem = new CMathBase();
                break;
        }

        if( mathElem !== null )
        {
            mathElem.relate(this);
            mathElem.setReduct(this.reduct);
            var runPrp = this.getRunPrp(this.CurPos);
            mathElem.setTxtPrp( runPrp );
            //mathElem.setRunPrp( runPrp );

            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 )*g_dKoef_pix_to_mm;
            this.addElementToContent( mathElem, new dist(l_gap, r_gap, 0, 0) );
            var empty = new CEmpty();
            empty.setTxtPrp(runPrp);
            this.addElementToContent(empty);

            this.rInterval.endPos += 2;
        }

        return mathElem; // for finished equation
    },
    addElementToContent: function(element, gaps)
    {
        var elem = new mathElem(element);
        elem.g_mContext = gaps || new dist(0,0,0,0);

        var tmp = this.content.splice(0, this.CurPos + 1);
        tmp.push(elem);

        tmp = tmp.concat( this.content.splice(0, this.content.length) );
        this.content.length = 0;
        this.content = tmp;
        this.CurPos++;
        this.setStart_Selection(this.CurPos);
        this.selection.active = false;
    },
    old_setComposition: function(Compos)
    {
        this.Composition = Compos;
    },
    createEquation: function(ind)
    {
        var Pos = this.CurPos + 1;

        switch(ind)
        {
            case 0:
            case 1:
            case 2:
                var fract = this.addMComponent(ind);
                fract.init();
                fract.fillPlaceholders();
                break;
            case 3:
                var fract = this.addMComponent(0);
                fract.init();
                fract.setSimple(true);
                fract.fillPlaceholders();
                break;
            case 4:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("dy");
                var den = fract.getDenominator();
                den.addTxt("dx");
                break;
            case 5:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("Δy");
                var den = fract.getDenominator();
                den.addTxt("Δx");
                break;
            case 6:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("∂y");
                var den = fract.getDenominator();
                den.addTxt("∂x");
                break;
            case 7:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("δy");
                var den = fract.getDenominator();
                den.addTxt("δx");
                break;
            case 8:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("π");
                var den = fract.getDenominator();
                den.addTxt("2");
                break;
            case 9:
                var degr = this.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                degr.fillPlaceholders();
                break;
            case 10:
                var degr = this.addMComponent(3);
                degr.init();
                degr.setIndex(-1);
                degr.fillPlaceholders();
                break;
            case 11:
                var degrSupSup = this.addMComponent(4);
                degrSupSup.init();
                degrSupSup.fillPlaceholders();
                break;
            case 12:
                var degrSupSup = this.addMComponent(5);
                degrSupSup.init();
                degrSupSup.fillPlaceholders();
                break;
            case 13:
                var degr = this.addMComponent(3);
                degr.init();
                degr.setIndex(-1);
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();

                var degr2 = iter.addMComponent(3);
                degr2.init();
                degr2.setIndex(1);
                var base2 = degr2.getBase();
                base2.addTxt("y");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");

                break;
            case 14:
                var degr = this.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.addTxt("e");
                var iter = degr.getIterator();
                iter.addTxt("-iωt");
                break;
            case 15:
                var degr = this.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();
                iter.addTxt("2");
                break;
            case 16:
                var degr = this.addMComponent(5);
                degr.init();
                var base = degr.getBase();
                base.addTxt("Y");
                var iter1 = degr.getUpperIterator();
                iter1.addTxt("n");
                var iter2 = degr.getLowerIterator();
                iter2.addTxt("1");
                break;
            case 17:
                var rad = this.addMComponent(6);
                rad.init();
                rad.fillPlaceholders();
                break;
            case 18:
                var rad = this.addMComponent(7);
                rad.init();
                rad.fillPlaceholders();
                break;
            case 19:
                var rad = this.addMComponent(7);
                rad.init();
                degr = rad.getDegree();
                degr.addTxt("2");
                base = rad.getBase();
                base.fillPlaceholders();
                break;
            case 20:
                var rad = this.addMComponent(7);
                rad.init();
                degr = rad.getDegree();
                degr.addTxt("3");
                base = rad.getBase();
                base.fillPlaceholders();
                break;
            case 21:
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("-b±");

                var rad = num.addMComponent(6);
                rad.init();
                var base = rad.getBase();
                var degree = base.addMComponent(3);
                degree.init();
                degree.setIndex(1);
                var baseDg = degree.getBase();
                baseDg.addTxt("b");
                var iter = degree.getIterator();
                iter.addTxt("2");
                base.addTxt("-4ac");

                var den = fract.getDenominator();
                den.addTxt("2a");
                break;
            case 22:
                var rad = this.addMComponent(6);
                rad.init();
                var base = rad.getBase();

                degr1 = base.addMComponent(3);
                degr1.init();
                degr1.setIndex(1);
                var base1 = degr1.getBase();
                base1.addTxt("a");
                var iter1 = degr1.getIterator();
                iter1.addTxt("2");

                base.addTxt("+");

                degr2 = base.addMComponent(3);
                degr2.init();
                degr2.setIndex(1);
                var base2 = degr2.getBase();
                base2.addTxt("b");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");

                break;
            case 23:
                var integr = this.addMComponent(8);
                integr.init(0,0,0);
                integr.fillPlaceholders();
                break;
            case 24:
                var integr = this.addMComponent(8);
                integr.init(0,1,3);
                integr.fillPlaceholders();
                break;
            case 25:
                var integr = this.addMComponent(8);
                integr.init(0,0,3);
                integr.fillPlaceholders();
                break;
            case 26:
                var integr = this.addMComponent(8);
                integr.init(1,0,0);
                integr.fillPlaceholders();
                break;
            case 27:
                var integr = this.addMComponent(8);
                integr.init(1,1,3);
                integr.fillPlaceholders();
                break;
            case 28:
                var integr = this.addMComponent(8);
                integr.init(1,0,3);
                integr.fillPlaceholders();
                break;
            case 29:
                var integr = this.addMComponent(8);
                integr.init(2,0,0);
                integr.fillPlaceholders();
                break;
            case 30:
                var integr = this.addMComponent(8);
                integr.init(2,1,3);
                integr.fillPlaceholders();
                break;
            case 31:
                var integr = this.addMComponent(8);
                integr.init(2,0,3);
                integr.fillPlaceholders();
                break;
            case 32:
                var integr = this.addMComponent(8);
                integr.init(3,0,0);
                integr.fillPlaceholders();
                break;
            case 33:
                var integr = this.addMComponent(8);
                integr.init(3,1,3);
                integr.fillPlaceholders();
                break;
            case 34:
                var integr = this.addMComponent(8);
                integr.init(3,0,3);
                integr.fillPlaceholders();
                break;
            case 35:
                var integr = this.addMComponent(8);
                integr.init(4,0,0);
                integr.fillPlaceholders();
                break;
            case 36:
                var integr = this.addMComponent(8);
                integr.init(4,1,3);
                integr.fillPlaceholders();
                break;
            case 37:
                var integr = this.addMComponent(8);
                integr.init(4,0,3);
                integr.fillPlaceholders();
                break;
            case 38:
                var integr = this.addMComponent(8);
                integr.init(5,0,0);
                integr.fillPlaceholders();
                break;
            case 39:
                var integr = this.addMComponent(8);
                integr.init(5,1,3);
                integr.fillPlaceholders();
                break;
            case 40:
                var integr = this.addMComponent(8);
                integr.init(5,0,3);
                integr.fillPlaceholders();
                break;
            case 41:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var elem = base.getElement(0,0);
                elem.addTxt("dx");
                break;
            case 42:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var elem = base.getElement(0,0);
                elem.addTxt("dy");
                break;
            case 43:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var elem = base.getElement(0,0);
                elem.addTxt("dθ");
                break;
            case 44:
                var sigma = this.addMComponent(8);
                sigma.init(6,0,0);
                sigma.fillPlaceholders();
                break;
            case 45:
                var sigma = this.addMComponent(8);
                sigma.init(6,0,3);
                sigma.fillPlaceholders();
                break;
            case 46:
                var sigma = this.addMComponent(8);
                sigma.init(6,1,3);
                sigma.fillPlaceholders();
                break;
            case 47:
                var sigma = this.addMComponent(8);
                sigma.init(6,0,2);
                sigma.fillPlaceholders();
                break;
            case 48:
                var sigma = this.addMComponent(8);
                sigma.init(6,1,2);
                sigma.fillPlaceholders();
                break;
            case 49:
                var product = this.addMComponent(8);
                product.init(7,0,0);
                product.fillPlaceholders();
                break;
            case 50:
                var product = this.addMComponent(8);
                product.init(7,0,3);
                product.fillPlaceholders();
                break;
            case 51:
                var product = this.addMComponent(8);
                product.init(7,1,3);
                product.fillPlaceholders();
                break;
            case 52:
                var product = this.addMComponent(8);
                product.init(7,0,2);
                product.fillPlaceholders();
                break;
            case 53:
                var product = this.addMComponent(8);
                product.init(7,1,2);
                product.fillPlaceholders();
                break;

            case 54:
                var product = this.addMComponent(8);
                product.init(8,0,0);
                product.fillPlaceholders();
                break;
            case 55:
                var product = this.addMComponent(8);
                product.init(8,0,3);
                product.fillPlaceholders();
                break;
            case 56:
                var product = this.addMComponent(8);
                product.init(8,1,3);
                product.fillPlaceholders();
                break;
            case 57:
                var product = this.addMComponent(8);
                product.init(8,0,2);
                product.fillPlaceholders();
                break;
            case 58:
                var product = this.addMComponent(8);
                product.init(8,1,2);
                product.fillPlaceholders();
                break;

            case 59:
                var union = this.addMComponent(8);
                union.init(9,0,0);
                union.fillPlaceholders();
                break;
            case 60:
                var union = this.addMComponent(8);
                union.init(9,0,3);
                union.fillPlaceholders();
                break;
            case 61:
                var union = this.addMComponent(8);
                union.init(9,1,3);
                union.fillPlaceholders();
                break;
            case 62:
                var union = this.addMComponent(8);
                union.init(9,0,2);
                union.fillPlaceholders();
                break;
            case 63:
                var union = this.addMComponent(8);
                union.init(9,1,2);
                union.fillPlaceholders();
                break;

            case 64:
                var union = this.addMComponent(8);
                union.init(10,0,0);
                union.fillPlaceholders();
                break;
            case 65:
                var union = this.addMComponent(8);
                union.init(10,0,3);
                union.fillPlaceholders();
                break;
            case 66:
                var union = this.addMComponent(8);
                union.init(10,1,3);
                union.fillPlaceholders();
                break;
            case 67:
                var union = this.addMComponent(8);
                union.init(10,0,2);
                union.fillPlaceholders();
                break;
            case 68:
                var union = this.addMComponent(8);
                union.init(10,1,2);
                union.fillPlaceholders();
                break;

            case 69:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(11,0,0);
                logicalOr.fillPlaceholders();
                break;
            case 70:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(11,0,3);
                logicalOr.fillPlaceholders();
                break;
            case 71:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(11,1,3);
                logicalOr.fillPlaceholders();
                break;
            case 72:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(11,0,2);
                logicalOr.fillPlaceholders();
                break;
            case 73:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(11,1,2);
                logicalOr.fillPlaceholders();
                break;

            case 74:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(12,0,0);
                logicalOr.fillPlaceholders();
                break;
            case 75:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(12,0,3);
                logicalOr.fillPlaceholders();
                break;
            case 76:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(12,1,3);
                logicalOr.fillPlaceholders();
                break;
            case 77:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(12,0,2);
                logicalOr.fillPlaceholders();
                break;
            case 78:
                var logicalOr = this.addMComponent(8);
                logicalOr.init(12,1,2);
                logicalOr.fillPlaceholders();
                break;

            case 79:
                var sigma = this.addMComponent(8);
                sigma.init(6,0,2);
                var iter = sigma.getLowerIterator();
                iter.addTxt("k");
                var delim = sigma.getBase().addMComponent(9);
                delim.init(0, 4, 0, 1);
                var fract = delim.getBase().addMComponent(0);
                fract.init();
                fract.hideBar(true);
                var num = fract.getNumerator();
                num.addTxt("n");
                var den = fract.getDenominator();
                den.addTxt("k");
                break;

            case 80:
                var sigma = this.addMComponent(8);
                sigma.init(6,0,3);
                var iterUp = sigma.getUpperIterator();
                iterUp.addTxt("n");
                var iterLow = sigma.getLowerIterator();
                iterLow.addTxt("i=0");
                var base = sigma.getBase();
                base.fillPlaceholders();
                break;
            case 81:
                var product = this.addMComponent(8);
                product.init(7,0,3);
                var iterUp = product.getUpperIterator();
                iterUp.addTxt("n");
                var iterLow = product.getLowerIterator();
                iterLow.addTxt("k=1");
                var base = product.getBase();
                var degr = base.addMComponent(3);
                degr.init();
                degr.setIndex(-1);
                var baseDgr = degr.getBase();
                baseDgr.addTxt("A");
                var iter = degr.getIterator();
                iter.addTxt("k");
                break;
            case 82:
                break;
            case 83:
                var union = this.addMComponent(8);
                union.init(9,0,3);

                var iterUp = union.getUpperIterator();
                iterUp.addTxt("m");
                var iterLow = union.getLowerIterator();
                iterLow.addTxt("n=1");

                var base = union.getBase();
                var delim = base.addMComponent(9);
                delim.init(0, 4, 0, 1);
                var base2 = delim.getBase();

                var degrX = base2.addMComponent(3);
                degrX.init();
                degrX.setIndex(-1);

                var baseX = degrX.getBase();
                baseX.addTxt("X");
                var iterX = degrX.getIterator();
                iterX.addTxt("n");

                base2.addTxt("∩");

                var degrY = base2.addMComponent(3);
                degrY.init();
                degrY.setIndex(-1);

                var baseY = degrY.getBase();
                baseY.addTxt("Y");
                var iterY = degrY.getIterator();
                iterY.addTxt("n");

                break;
            case 84:
                var delim = this.addMComponent(9);
                delim.init(0, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 85:
                var delim = this.addMComponent(9);
                delim.init(2, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 86:
                var delim = this.addMComponent(9);
                delim.init(1, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 87:
                var delim = this.addMComponent(9);
                delim.init(3, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 88:
                var delim = this.addMComponent(9);
                delim.init(4, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 89:
                var delim = this.addMComponent(9);
                delim.init(4, 4, 2, 3);
                delim.fillPlaceholders();
                break;
            case 90:
                var delim = this.addMComponent(9);
                delim.init(5, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 91:
                var delim = this.addMComponent(9);
                delim.init(6, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 92:
                var delim = this.addMComponent(9);
                delim.init(2, 4, 0, 0);
                delim.fillPlaceholders();
                break;
            case 93:
                var delim = this.addMComponent(9);
                delim.init(2, 4, 1, 1);
                delim.fillPlaceholders();
                break;
            case 94:
                var delim = this.addMComponent(9);
                delim.init(2, 4, 1, 0);
                delim.fillPlaceholders();
                break;
            case 95:
                var delim = this.addMComponent(9);
                delim.init(7, 4, 0, 1);
                delim.fillPlaceholders();
                break;
            case 96:
                var delim = this.addMComponent(10);
                delim.init(0, 2);
                delim.fillPlaceholders();
                break;
            case 97:
                var delim = this.addMComponent(10);
                delim.init(1, 2);
                delim.fillPlaceholders();
                break;
            case 98:
                var delim = this.addMComponent(10);
                delim.init(3, 2);
                delim.fillPlaceholders();
                break;
            case 99:
                var delim = this.addMComponent(10);
                delim.init(3, 3);
                delim.fillPlaceholders();
                break;
            case 100:
                var delim = this.addMComponent(9);
                delim.init(0,2,0);
                delim.fillPlaceholders();
                break;
            case 101:
                var delim = this.addMComponent(9);
                delim.init(0,3,1);
                delim.fillPlaceholders();
                break;
            case 102:
                var delim = this.addMComponent(9);
                delim.init(2,2,0);
                delim.fillPlaceholders();
                break;
            case 103:
                var delim = this.addMComponent(9);
                delim.init(2,3,1);
                delim.fillPlaceholders();
                break;
            case 104:
                var delim = this.addMComponent(9);
                delim.init(1,2,0);
                delim.fillPlaceholders();
                break;
            case 105:
                var delim = this.addMComponent(9);
                delim.init(1,3,1);
                delim.fillPlaceholders();
                break;
            case 106:
                var delim = this.addMComponent(9);
                delim.init(3,2,0);
                delim.fillPlaceholders();
                break;
            case 107:
                var delim = this.addMComponent(9);
                delim.init(3,3,1);
                delim.fillPlaceholders();
                break;
            case 108:
                var delim = this.addMComponent(9);
                delim.init(4,2,0);
                delim.fillPlaceholders();
                break;
            case 109:
                var delim = this.addMComponent(9);
                delim.init(4,3,1);
                delim.fillPlaceholders();
                break;
            case 110:
                var delim = this.addMComponent(9);
                delim.init(4,2,2);
                delim.fillPlaceholders();
                break;
            case 111:
                var delim = this.addMComponent(9);
                delim.init(4,3,3);
                delim.fillPlaceholders();
                break;
            case 112:
                var delim = this.addMComponent(9);
                delim.init(5,2,0);
                delim.fillPlaceholders();
                break;
            case 113:
                var delim = this.addMComponent(9);
                delim.init(5,3,1);
                delim.fillPlaceholders();
                break;
            case 114:
                var delim = this.addMComponent(9);
                delim.init(6,2,0);
                delim.fillPlaceholders();
                break;
            case 115:
                var delim = this.addMComponent(9);
                delim.init(6,3,1);
                delim.fillPlaceholders();
                break;
            case 116:
                var delim = this.addMComponent(9);
                delim.init(7,2,0);
                delim.fillPlaceholders();
                break;
            case 117:
                var delim = this.addMComponent(9);
                delim.init(7,3,1);
                delim.fillPlaceholders();
                break;
            case 118:
                var delim = this.addMComponent(9);
                delim.init(1,2,0);
                var base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(2, 1);
                matrix.fillPlaceholders();
                break;
            case 119:
                var delim = this.addMComponent(9);
                delim.init(1,2,0);
                var base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(3, 1);
                matrix.fillPlaceholders();
                break;
            case 120:
                var fract = this.addMComponent(0);
                fract.init();
                fract.hideBar(true);
                fract.fillPlaceholders();
                break;
            case 121:
                var delim = this.addMComponent(9);
                delim.init(0, 4, 0, 1);
                var fract = delim.getBase().addMComponent(0);
                fract.init();
                fract.hideBar(true);
                fract.fillPlaceholders();
                break;
            case 122:
                break;
            case 123:
                var delim = this.addMComponent(9);
                delim.init(0, 4, 0, 1);
                var fract = delim.getBase().addMComponent(0);
                fract.init();
                fract.hideBar(true);
                var num = fract.getNumerator();
                num.addTxt("n");

                var den = fract.getDenominator();
                den.addTxt("k");
                break;
            case 124:
                var delim = this.addMComponent(9);
                delim.init(3, 4, 0, 1);
                var fract = delim.getBase().addMComponent(0);
                fract.init();
                fract.hideBar(true);
                var num = fract.getNumerator();
                num.addTxt("n");

                var den = fract.getDenominator();
                den.addTxt("k");
                break;
            case 125:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("sin");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 126:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("cos");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 127:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("tan");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 128:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("csc");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 129:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("sec");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 130:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("cot");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;

            case 131:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("sin");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 132:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("cos");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 133:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("tan");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 134:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("csc");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 135:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("sec");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 136:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("cot");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;

            case 137:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("sinh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 138:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("cosh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 139:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("tanh");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 140:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("csch");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 141:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("sech");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 142:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("coth");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;

            case 143:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("sinh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 144:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("cosh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 145:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("tanh");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 146:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("csch");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 147:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("sech");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 148:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                var degr = func.addMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("coth");
                var iter = degr.getIterator();
                iter.addTxt("-1");
                var arg = trig.getArgument();
                arg.fillPlaceholders();
                break;
            case 149:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("sin");
                var arg = trig.getArgument();
                arg.addTxt("θ");
                break;
            case 150:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("cos");
                var arg = trig.getArgument();
                arg.addTxt("2x");
                break;
            case 151:
                var trig = this.addMComponent(11);
                trig.init();
                var func = trig.getFunction();
                func.addTxt("tan");
                var arg = trig.getArgument();
                arg.addTxt("θ");
                this.addTxt("=");
                var fract = this.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                var sin = num.addMComponent(11);
                sin.init();
                sin.getFunction().addTxt("sin");
                sin.getArgument().addTxt("θ");
                var den = fract.getDenominator();
                var cos = den.addMComponent(11);
                cos.init();
                cos.getFunction().addTxt("cos");
                cos.getArgument().addTxt("θ");
                break;
            case 152:
                var diac = this.addMComponent(15);
                diac.init(3);
                diac.fillPlaceholders();
                break;
            case 153:
                var diac = this.addMComponent(15);
                diac.init(4);
                diac.fillPlaceholders();
                break;
            case 154:
                var diac = this.addMComponent(15);
                diac.init(5);
                diac.fillPlaceholders();
                break;
            case 155:
                var diac = this.addMComponent(12);
                diac.init();
                diac.setIndex(-1);
                diac.fillPlaceholders();
                break;
            case 156:
                var diac = this.addMComponent(12);
                diac.init();
                diac.setIndex(1);
                diac.fillPlaceholders();
                break;
            case 157:
                var diac = this.addMComponent(15);
                diac.init(2);
                diac.fillPlaceholders();
                break;
            case 158:
                var diac = this.addMComponent(15);
                diac.init(1);
                diac.fillPlaceholders();
                break;
            case 159:
                var diac = this.addMComponent(13);
                diac.init();
                diac.setIndex(1);
                diac.fillPlaceholders();
                break;
            case 160:
                var diac = this.addMComponent(13);
                diac.init();
                diac.setIndex(2);
                diac.fillPlaceholders();
                break;
            case 161:
                var line = this.addMComponent(14);
                line.init();
                line.setIndex(1);
                line.fillPlaceholders();
                break;
            case 162:
                var line = this.addMComponent(14);
                line.init();
                line.setIndex(2);
                line.fillPlaceholders();
                break;
            case 163:
                var delim = this.addMComponent(9);
                delim.init(1,0,1);
                delim.fillPlaceholders();
                break;
            case 164:
                var delim = this.addMComponent(9);
                delim.init(1,1,2);
                delim.fillPlaceholders();
                break;
            case 165:
                var groupDelim = this.addMComponent(16);
                groupDelim.init(1);
                groupDelim.fillPlaceholders();
                break;
            case 166:
                var groupDelim = this.addMComponent(16);
                groupDelim.init(-1);
                groupDelim.fillPlaceholders();
                break;
            case 167:
                var arrow = this.addMComponent(17);
                arrow.init(1, 0, 0); // left arrow  top
                arrow.fillPlaceholders();
                break;
            case 168:
                var arrow = this.addMComponent(17);
                arrow.init(1, 0, 1); // right arrow  top
                arrow.fillPlaceholders();
                break;
            case 169:
                var arrow = this.addMComponent(17);
                arrow.init(2, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 170:
                var arrow = this.addMComponent(17);
                arrow.init(0, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 171:
                var arrow = this.addMComponent(17);
                arrow.init(0, 0, 1);
                arrow.fillPlaceholders();
                break;
            case 172:
                break;
            case 173:
                break;
            case 174:
                var box = this.addMComponent(18);
                box.init();
                box.fillPlaceholders();
                break;
            case 175:
                var box = this.addMComponent(18);
                box.init();
                var arg = box.getElement();

                var degrA = arg.addMComponent(3);
                degrA.init();
                degrA.setIndex(1);
                var baseA = degrA.getBase();
                baseA.addTxt("a");
                var iterA = degrA.getIterator();
                iterA.addTxt("2");

                arg.addTxt("=");

                var degrB = arg.addMComponent(3);
                degrB.init();
                degrB.setIndex(1);
                var baseB = degrB.getBase();
                baseB.addTxt("b");
                var iterB = degrB.getIterator();
                iterB.addTxt("2");

                arg.addTxt("+");

                var degrC = arg.addMComponent(3);
                degrC.init();
                degrC.setIndex(1);
                var baseC = degrC.getBase();
                baseC.addTxt("c");
                var iterC = degrC.getIterator();
                iterC.addTxt("2");
                               
                break;
            case 176:
                break;
            case 177:
                break;
            case 178:
                var struct = this.addMComponent(22); // logaithm
                struct.setDimension(1,2);
                struct.setContent();
                var first = struct.getElement(0,0);
                var degr = first.addMComponent(3);
                degr.init();
                degr.setIndex(-1);
                var base = degr.getBase();
                base.setOwnTPrp({Italic: false});
                base.addTxt("log");
                var iter = degr.getIterator();
                iter.fillPlaceholders();

                var second = struct.getElement(0,1);
                second.fillPlaceholders();
                break;
            case 179:
                var log = this.addMComponent(11);     // logaithm
                log.init();
                var func = log.getFunction();
                func.addTxt("log");
                var arg = log.getArgument();
                arg.fillPlaceholders();
                break;
            case 180:
                var minimax = this.addMComponent(19);
                minimax.init();
                var base = minimax.getFunction();
                base.addTxt("lim");
                var iter = minimax.getIterator();
                iter.fillPlaceholders();
                var arg = minimax.getArgument();
                arg.fillPlaceholders();
                break;
            case 181:
                var minimax = this.addMComponent(19);
                minimax.init();
                var base = minimax.getFunction();
                base.addTxt("min");
                var iter = minimax.getIterator();
                iter.fillPlaceholders();
                var arg = minimax.getArgument();
                arg.fillPlaceholders();
                break;
            case 182:
                var minimax = this.addMComponent(19);
                minimax.init();
                var base = minimax.getFunction();
                base.addTxt("max");
                var iter = minimax.getIterator();
                iter.fillPlaceholders();
                var arg = minimax.getArgument();
                arg.fillPlaceholders();
                break;
            case 183:
                var log = this.addMComponent(11); // logaithm
                log.init();
                var func = log.getFunction();
                func.addTxt("ln");
                var arg = log.getArgument();
                arg.fillPlaceholders();
                break;
            case 184:
                var minimax = this.addMComponent(19);
                minimax.init();
                var base = minimax.getFunction();
                base.addTxt("lim");
                var iter = minimax.getIterator();
                iter.addTxt("n→∞");
                var arg = minimax.getArgument();
                var degr = arg.addMComponent(3);
                degr.init();
                degr.setIndex(1);

                var base = degr.getBase();
                var delim = base.addMComponent(9);
                delim.init(0, 4, 0, 1);
                var separ = delim.getBase();
                separ.addTxt("1+");
                var fract = separ.addMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("1");
                var den = fract.getDenominator();
                den.addTxt("n");

                var dgIter = degr.getIterator();
                dgIter.addTxt("n");
                break;
            case 185:
                var minimax = this.addMComponent(19);
                minimax.init();
                var base = minimax.getFunction();
                base.addTxt("max");
                var iter = minimax.getIterator();
                iter.addTxt("0≤x≤1");
                var arg = minimax.getArgument();
                arg.addTxt("x");
                var degr1 = arg.addMComponent(3);
                degr1.init();
                degr1.setIndex(1);
                var base1 = degr1.getBase();
                base1.addTxt("e");
                var iter1 = degr1.getIterator();
                iter1.addTxt("-");
                var degr2 = iter1.addMComponent(3);
                degr2.init();
                degr2.setIndex(1);
                var base2 = degr2.getBase();
                base2.addTxt("x");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");
                break;
            case 186:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("∶=");
                break;
            case 187:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("==");
                break;
            case 188:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("+=");
                break;
            case 189:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("-=");
                break;
            case 190:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("≝");
                break;
            case 191:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("≞");
                break;
            case 192:
                var base = this.addMComponent(22);
                base.setDimension(1,1);
                base.setContent();
                var arg = base.getElement(0,0);
                arg.addTxt("≜");
                break;
            case 193:
                var arrow = this.addMComponent(20);
                arrow.init(1, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 194:
                var arrow = this.addMComponent(20);
                arrow.init(1, 0, 1);
                arrow.fillPlaceholders();
                break;
            case 195:
                var arrow = this.addMComponent(20);
                arrow.init(1, 1, 0);
                arrow.fillPlaceholders();
                break;
            case 196:
                var arrow = this.addMComponent(20);
                arrow.init(1, 1, 1);
                arrow.fillPlaceholders();
                break;
            case 197:
                var arrow = this.addMComponent(20);
                arrow.init(3, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 198:
                var arrow = this.addMComponent(20);
                arrow.init(3, 0, 1);
                arrow.fillPlaceholders();
                break;
            case 199:
                var arrow = this.addMComponent(20);
                arrow.init(3, 1, 0);
                arrow.fillPlaceholders();
                break;
            case 200:
                var arrow = this.addMComponent(20);
                arrow.init(3, 1, 1);
                arrow.fillPlaceholders();
                break;
            case 201:
                var arrow = this.addMComponent(20);
                arrow.init(2, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 202:
                var arrow = this.addMComponent(20);
                arrow.init(2, 1, 0);
                arrow.fillPlaceholders();
                break;
            case 203:
                var arrow = this.addMComponent(20);
                arrow.init(4, 0, 0);
                arrow.fillPlaceholders();
                break;
            case 204:
                var arrow = this.addMComponent(20);
                arrow.init(4, 1, 0);
                arrow.fillPlaceholders();
                break;
            case 205:
                var arrow = this.addMComponent(20);
                arrow.init(1, 1, 1);
                var base = arrow.getBase();
                base.addTxt("yields");
                break;
            case 206:
                var arrow = this.addMComponent(20);
                arrow.init(1, 1, 1);
                var base = arrow.getBase();
                base.addTxt("∆");
                break;
            case 207:
                var matrix = this.addMComponent(21);
                matrix.init(1, 2);
                matrix.fillPlaceholders();
                break;
            case 208:
                var matrix = this.addMComponent(21);
                matrix.init(2, 1);
                matrix.fillPlaceholders();
                break;
            case 209:
                var matrix = this.addMComponent(21);
                matrix.init(1, 3);
                matrix.fillPlaceholders();
                break;
            case 210:
                var matrix = this.addMComponent(21);
                matrix.init(3, 1);
                matrix.fillPlaceholders();
                break;
            case 211:
                var matrix = this.addMComponent(21);
                matrix.init(2, 2);
                matrix.fillPlaceholders();
                break;
            case 212:
                var matrix = this.addMComponent(21);
                matrix.init(2, 3);
                matrix.fillPlaceholders();
                break;
            case 213:
                var matrix = this.addMComponent(21);
                matrix.init(3, 2);
                matrix.fillPlaceholders();
                break;
            case 214:
                var matrix = this.addMComponent(21);
                matrix.init(3, 3);
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
                var matrix = this.addMComponent(21);
                matrix.init(2, 2);
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
                var matrix = this.addMComponent(21);
                matrix.init(2, 2);
                matrix.hidePlaceholder(true);

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
                var matrix  = this.addMComponent(21);
                matrix.init(3, 3);

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
                var matrix  = this.addMComponent(21);
                matrix.init(3, 3);
                
                matrix.hidePlaceholder(true);
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
                var delim = this.addMComponent(9);
                delim.init(0, 4, 0, 1);
                base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(2, 2);
                matrix.fillPlaceholders();
                break;
            case 224:
                var delim = this.addMComponent(9);
                delim.init(2, 4, 0, 1);
                base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(2, 2);
                matrix.fillPlaceholders();
                break;
            case 225:
                var delim = this.addMComponent(9);
                delim.init(5, 4, 0, 1);
                base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(2, 2);
                matrix.fillPlaceholders();
                break;
            case 226:
                var delim = this.addMComponent(9);
                delim.init(6, 4, 0, 1);
                base = delim.getBase();
                var matrix = base.addMComponent(21);
                matrix.init(2, 2);
                matrix.fillPlaceholders();
                break;
            case 227:
                var delim = this.addMComponent(9);
                delim.init(0, 4, 0, 1);
                base = delim.getBase();
                var matrix  = base.addMComponent(21);
                matrix.init(3, 3);

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
                var delim = this.addMComponent(9);
                delim.init(2, 4, 0, 1);
                base = delim.getBase();
                var matrix  = base.addMComponent(21);
                matrix.init(3, 3);

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
        if( this.IsTarget() ) //удаляем тагет
        {
            var empty = this.content[0]; //CEmpty
            this.content.length = 0;
            this.content.push( empty );
            this.CurPos = 0;
        }
        else if( this.selection.startPos != this.selection.endPos ) //т.к. после того как удалили тагет у нас эти 2 значения не равны, равенство их выставляется позднее, после добавления символа
            this.remove(1);
    },
    setReduct: function(coeff)
    {
        this.reduct = this.reduct*coeff;
    },
    getTxtPrp: function()
    {
        var txtPrp = new CMathTextPrp();
        txtPrp.Merge(this.TxtPrp);
        txtPrp.Merge(this.OwnTPrp);

        if( typeof(txtPrp.FontSize) !== "undefined")
            txtPrp.FontSize *= this.getReduct();

        return txtPrp;
    },
    getReduct: function()
    {
        var result = this.reduct;

        if(!this.bRoot)
            result *= this.Parent.getReduct(); // чтобы не перекрывать

        return result;
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
        placeholder.setTxtPrp(this.getTxtPrp());

        this.content.push( new mathElem( placeholder ) );

    },
    cursor_moveRight: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if(this.IsTarget())
        {
            var movement = this.Parent.cursor_moveRight();
            CurrContent = SelectContent = movement.SelectContent;
        }
        else if(this.CurPos!= this.content.length - 1 || this.selection.startPos != this.selection.endPos)
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
                else if( this.content[this.CurPos].value.SUBCONTENT )
                {
                    this.CurPos++;

                    SelectContent = this;
                    CurrContent   = this;

                }
                else
                {
                    //если нет селекта, то просто перемещаемся по контенту
                    this.CurPos++;

                    if( this.content[this.CurPos].value.SUBCONTENT )
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
    select_moveRight: function()
    {
        var res = true;

        if(this.selection.endPos < this.content.length)
        {
            if( this.content[this.selection.startPos - 1].value.SUBCONTENT)
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
            else if(this.content[this.selection.endPos].value.SUBCONTENT && ( this.selection.startPos - this.selection.endPos == 2) )
            {
                //селект одного мат. эелемента

                this.content[this.selection.endPos].value.drawSelect();
                this.setStart_Selection(this.CurPos);
            }
            else
            {
                if(this.content[this.selection.endPos].value.SUBCONTENT) // если последнюю позицию занимает мат. формула/объект, то селектим вместе с CEMpty
                    this.setEnd_Selection(this.selection.endPos + 1);
                else
                    this.setEnd_Selection(this.selection.endPos); // для обычного случая
            }
        }
        else
            res = false;

        return res;

    },
    cursor_moveLeft: function()
    {
        var state = true,
            SelectContent = null, CurrContent = null;

        if(this.IsTarget())
        {
            var movement = this.Parent.cursor_moveLeft();
            CurrContent = SelectContent = movement.SelectContent;
        }
        else if(this.CurPos!=0 || this.selection.startPos != this.selection.endPos)
        {

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
                if( this.selection.active )
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
                }

            }
            //пришли из базового класса
            else if( this.content[this.CurPos].value.SUBCONTENT )
            {
                if( this.selection.active )
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
                }

            }
            else
            {
                //если нет селекта, то просто перемещаемся по контенту
                this.CurPos--;

                if( this.content[this.CurPos].value.SUBCONTENT )
                {
                    CurrContent = SelectContent = this.content[this.CurPos].value.goToLastElement();
                }
                else
                    CurrContent = SelectContent = this;
            }

            this.setStart_Selection(this.CurPos);
            this.selection.active = false;

        }
        else
        {
            if( ! this.bRoot )
            {
                var movement = this.Parent.cursor_moveLeft();
                SelectContent = CurrContent = movement.SelectContent;
            }
            else
                state = false;
        }


        return {state: state, SelectContent: SelectContent, CurrContent: CurrContent };
    },
    goToLastElement: function()
    {
        return this;
    },
    goToFirstElement: function()
    {
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
        if(bSingle && this.content[this.CurPos].value.SUBCONTENT)
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
    mouseUp: function()
    {
        if( this.selection.active )
        {
            this.selection.active = false;
            if( this.content[this.CurPos].value.SUBCONTENT )
                this.content[this.CurPos].value.mouseUp();
        }
    },
    mouseDown: function( mouseCoord, inside_flag )
    {
        var result = null;

        if(typeof(inside_flag) === "undefined")
            inside_flag = -1;

        if(this.IsTarget())
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

            if( this.content[this.CurPos].value.SUBCONTENT )
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
    mouseMove: function( mouseCoord )
    {
        var state = true;
        var SelectContent = null;

        if(this.IsTarget())
        {
            SelectContent = this;
        }
        else
        {
            var msCoord = this.coordWOGaps(mouseCoord);
            var pos = this.findPosition( msCoord );

            //селект внутри элемента (дроби и пр.)
            if(this.CurPos === pos && this.content[pos].value.SUBCONTENT)
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

                if ( this.content[this.CurPos].value.SUBCONTENT )
                {
                    if( direction == 1 )
                        this.setStart_Selection( this.CurPos - 1);
                    else if( direction == -1 )
                        this.setStart_Selection( this.CurPos + 1);
                }
                else
                    this.setStart_Selection( this.CurPos );

                if( this.content[pos].value.SUBCONTENT )
                {
                    if( direction == 1 )
                        this.setEnd_Selection( pos + 1);
                    else if( direction == -1 )
                        this.setEnd_Selection( pos - 1);
                }
                else
                    this.setEnd_Selection( pos );
            }
        }

        return {state: state, SelectContent: SelectContent }; //для CMathContent state всегда true
    },
    // не вызываем из mouseDown эту ф-ию, тк иначе не установим селект для внутреннего объекта (setStart_Selection)
    afterDisplacement: function(coord) //аналог mouseDown для goToUpperLevel и goToLowerLever
    {
        var content = null;
        var msCoord = this.coordWOGaps(coord);

        this.CurPos = this.findPosition( msCoord );

        if( this.content[this.CurPos].value.SUBCONTENT )
        {
            var _coord = this.getCoordElem(this.CurPos, msCoord);
            content = this.content[this.CurPos].value.afterDisplacement(_coord);
        }
        else
            content = this;

        return content;
    },
    home: function()
    {
        if(!this.IsTarget())
            this.CurPos = 0;
    },
    end: function()
    {
        if(!this.IsTarget())
            this.CurPos = this.content.length - 1;
    },
    recalculateSize: function()
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

            if( !this.content[i].value.SUBCONTENT )
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
    RecalculateReverse: function()
    {
        // for add component, set Txt Properties
        var start = this.rInterval.startPos,
            end = this.rInterval.endPos;
        for(var i = start; i < end; i++)
            this.content[i].value.Resize();

        this.rInterval.startPos = this.rInterval.endPos = this.CurPos;

        this.recalculateSize();
        if(! this.bRoot )
            this.Parent.RecalculateReverse();
    },
    Resize: function()
    {
        for(var i = 0; i < this.content.length; i++)
            this.content[i].value.Resize();

        this.rInterval.startPos = this.rInterval.endPos = this.CurPos;

        this.recalculateSize();
    },
    draw: function()
    {
        if( !(this.plhHide && this.IsTarget()) )
            for(var i=1; i < this.content.length;i++)
                this.content[i].value.draw();
    },
    update_widthContent: function()
    {
        for(var j = 1; j <this.content.length; j++)
        {
            this.content[j].widthToEl = this.content[j-1].widthToEl + this.content[j].value.size.width + this.content[j].g_mContext.left + this.content[j].g_mContext.right;
        }
    },
    update_Cursor: function()
    {
        var sizeCursor = this.getTxtPrp().FontSize*g_dKoef_pt_to_mm;
        var position = {x: this.pos.x + this.content[this.CurPos].widthToEl, y: this.pos.y + this.size.center - sizeCursor/2 };

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
        if(pos !== 0)
        {
            if( this.content[ pos ].value.SUBCONTENT )
            {
                if( this.content[ pos - 1].widthToEl <= mouseX && mouseX < (this.content[pos - 1].widthToEl + gps.left) )
                    pos--;
                else if( (this.content[ pos ].widthToEl - gps.right) < mouseX && mouseX <= this.content[ pos ].widthToEl)
                    pos++;
            }
            else
            {
                if( this.content[ pos - 1].widthToEl <= mouseX && mouseX < (this.content[ pos - 1].widthToEl + gps.left) )
                    pos--;
                else if( (this.content[ pos ].widthToEl - (this.content[ pos ].value.size.width/2) - this.content[ pos ].g_mContext.left ) > mouseX )
                    pos--;
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
    old_remove: function()
    {
        var state =
        {
            bRecPosition:           false,   /*нужно ли пересчитывать позицию или нет, работает при backspace */
            bBeginning:             false    /*в начале контента или нет*/
            //bTargetAfterRemove:     false   /*нужно ли селектить target, этот флаг выставляется в CMathBase*/
        };
        var CurrContent = SelectContent = null;

        if( this.IsTarget() )
        {
            if ( !this.bRoot )
            {
                var removal = this.Parent.remove();
                SelectContent = removal.SelectContent;
                CurrContent = this;
            }
            else
            {
                //в основном контенте и элемент target
                //переделать : вставлять объект типа placeholder
                this.content.length = 0;
                state.bRecPosition = true;

                SelectContent = this;
                CurrContent   = this;
            }
        }
        else
        {
            if( this.CurPos != 0 || (this.selection.startPos != this.selection.endPos) ) //последнее условие, чтобы избежать ситуации, когда стоим в нулевой позиции и при этом есть селект
            {
                //курсор перед мат. элементом
                if( (this.selection.startPos == this.selection.endPos) && this.content[this.CurPos].value.empty)
                {
                    this.setStart_Selection(this.CurPos);
                    this.setEnd_Selection( this.CurPos-2 );
                    this.selection.active = false;

                    SelectContent = this;
                    CurrContent   = this;
                }
                //пришли из базового класса
                else if( this.content[this.CurPos].value.SUBCONTENT && (this.selection.startPos == this.selection.endPos) )
                {
                    this.setStart_Selection(this.CurPos + 1);
                    this.setEnd_Selection(this.CurPos - 1);
                    this.selection.active = false;

                    SelectContent = this;
                    CurrContent   = null; // т.к. пришли из другого контента
                }
                //просто удаляем элементы из контента
                else
                {
                    var start, end;

                    if( this.selection.startPos != this.selection.endPos )
                    {
                        start = this.selection.startPos;
                        end = this.selection.endPos;
                        if(start > end)
                        {
                            tmp = start;
                            start = end;
                            end = tmp;
                        }
                    }
                    else //backspace
                    {
                        start = this.CurPos;
                        end = this.CurPos + 1;
                    }
                    var tmp = new Array();

                    for(var i = 0; i< start; i++)
                        tmp.push(this.content[i]);

                    for (var j = end; j < this.content.length; j++)
                        tmp.push(this.content[j]);
                    this.content.length = 0;
                    this.content = tmp;

                    this.CurPos = start - 1;
                    this.setStart_Selection(this.CurPos);
                    this.selection.active = false;

                    SelectContent = this;
                    CurrContent   = this;

                    state.bRecPosition = true;

                    /*if(this.content.length == 1 && ! this.bRoot )//только CEmpty
                     {
                        this.add(StartTextElement);
                     }*/

                    //this.recalculate();
                }
            }
            else if ( !this.bRoot )
            {
                var removal = this.Parent.remove();
                SelectContent = removal.SelectContent;
                CurrContent = this;
            }
            else
            {
                CurrContent = SelectContent = this;
                state.bBeginning = true;
            }
        }

        return {CurrContent : CurrContent, SelectContent: SelectContent, state: state };
    },
    remove: function(order)
    {
        var state =
        {
            bDelete:                false,    /* нужно ли пересчитывать позицию или нет, работает при backspace */
            bBeging:                false,    /* в начале контента или нет */
            bEnd:                   false,     /* в конце */
        };

        var CurrContent = SelectContent = null,
            items = null;

        if( this.IsTarget() )
        {
            if ( !this.bRoot )
            {
                var result = this.Parent.remove(-2);
                SelectContent = result.SelectContent;
                CurrContent = this;
            }
            else
            {
                //в основном контенте и элемент target
                //переделать : вставлять объект типа placeholder
                this.content.length = 0;
                state.bDelete = true;

                SelectContent = this;
                CurrContent   = this;
            }
        }
        else
        {
            var bFirst = order == 1 && this.CurPos == 0,
                bLast = order == -1 && this.CurPos == this.content.length - 1;

            if(bFirst)
                state.bBeging = true;
            else if(bLast)
                state.bEnd = true;

            if(bFirst || bLast)
            {
                if( ! this.bRoot )
                {
                    var result = this.Parent.remove(-2);
                    SelectContent = result.SelectContent;
                    CurrContent = this;
                }
                else
                {
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
                this.setStart_Selection(this.CurPos + 1);
                this.setEnd_Selection(this.CurPos - 1);
                this.selection.active = false;

                SelectContent = this;
                CurrContent   = null; // т.к. пришли из другого контента
            }

        }

        return {CurrContent : CurrContent, SelectContent: SelectContent, state: state, items: items};
    },
    remove_internal: function(order)
    {
        var bDelete = false;
        var bSelect = this.selection.startPos !== this.selection.endPos;
        var bMEDirect = order == 1 && this.content[this.CurPos].value.empty,
            bMEReverse = order == -1 && this.content[this.CurPos + 1].value.SUBCONTENT;

        var items = null;

        if(!bSelect && bMEDirect)
        {
            this.setStart_Selection(this.CurPos);
            this.setEnd_Selection( this.CurPos-2 );
            this.selection.active = false;
        }
        else if(!bSelect && bMEReverse)
        {
            this.setStart_Selection(this.CurPos);
            this.setEnd_Selection( this.CurPos + 2 );
            this.selection.active = false;
        }
        else
        {
            var start, end;

            if(bSelect)
            {
                start = this.selection.startPos;
                end = this.selection.endPos;
                if(start > end)
                {
                    tmp = start;
                    start = end;
                    end = tmp;
                }
            }
            else if(order == 1)
            {
                start = this.CurPos;
                end = this.CurPos + 1;
            }
            else if(order == -1)
            {
                start = this.CurPos + 1;
                end = this.CurPos + 2;
            }

            /*var tmp = new Array();

            for(var i = 0; i< start; i++)
                tmp.push(this.content[i]);

            for (var j = end; j < this.content.length; j++)
                tmp.push(this.content[j]);*/

            /*var Content_start = this.content.slice(0, start);
            var Content_end   = this.content.slice(end, this.content.length);
            this.content = Content_start.concat(Content_end);*/

            items = this.content.splice(start, end - start);

            if(!TEST)
            {
                History.Create_NewPoint();
                //items = this.content.splice(start, end - start);
                History.Add(this, {Type: historyitem_Math_RemoveItem, Items: items, Pos: start});
            }



            this.CurPos = start - 1;
            this.setStart_Selection(this.CurPos);
            this.selection.active = false;

            bDelete = true;
        }

        return {bDelete: bDelete, items: items};
    },
    setPlaceholderAfterRemove: function()  // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент
    {
        if(this.content.length == 1 && ! this.bRoot )//только CEmpty
        {
            this.addLetter(StartTextElement);
        }
    },
    selectUse: function()
    {
        return (this.selection.startPos !== this.selection.endPos);
    },
    setStart_Selection: function( StartIndSelect )
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
    setEnd_Selection: function( EndIndSelect )
    {
        if(this.selection.active)
        {
            this.selection.endPos = EndIndSelect + 1;
            this.drawSelect();
        }
    },
    //TODO
    //переделать
    drawSelect: function()
    {
        var start   = this.selection.startPos;
        var end     = this.selection.endPos ;

        if( start > end)
        {
            var tmp = start;
            start = end;
            end = tmp;
        }

        var widthSelect = 0;

        for(var j = start; j < end ; j++)
            widthSelect += this.content[j].widthToEl - this.content[j-1].widthToEl;

        if( widthSelect != 0)
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectClear(); // "обнуляем"  логический селект
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectEnabled(true); // select
            /// ...Selectenabled(false)         deselect, убираем слой
            //editor.WordControl.m_oLogicDocument.DrawingDocument.TargetEnd();
            //editor.WordControl.m_oLogicDocument.DrawingDocument.AddPageSelection(0,this.pos.x + this.content[start-1].widthToEl, this.pos.y, widthSelect, heightSelect );
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectShow();
            //editor.WordControl.m_oLogicDocument.DrawingDocument.TargetStart();
        }
    },
    IsTarget: function()
    {
        var bTarget = this.content.length == 2 && this.content[1].value.value === StartTextElement ;
        return bTarget;
    },
    IsJustDraw: function()
    {
        return false;
    },
    tgtSelect: function()
    {
        this.CurPos = 1;
        this.setStart_Selection(0);
        this.setEnd_Selection(1);
        this.selection.active = false;
    },
    setPosition: function( _pos )
    {
        this.pos = { x: _pos.x + this.g_mContext.left, y: _pos.y};
        var max_cent = this.size.center;

        //var baseLine = 0;

        var txtPrp = this.getTxtPrp();
        g_oTextMeasurer.SetFont ( txtPrp );
        var baseLine = DIV_CENT*g_oTextMeasurer.GetHeight();

        for(var i=1; i<this.content.length;i++)
        {
            var t = {x: this.pos.x + this.content[i-1].widthToEl + this.content[i].g_mContext.left, y: this.pos.y + max_cent };
            if( ! this.content[i].value.SUBCONTENT )
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
    drawSelect2: function()
    {
        var start   = this.selection.startPos;
        var end     = this.selection.endPos ;

        if( start > end)
        {
            var tmp = start;
            start = end;
            end = tmp;
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
    /////

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

    ////  open  ////
    fillMComponent: function(id)
    {
        var component,
            result = component;

        switch(id)
        {
            case 0:
                component = new CMathText();
                result = this; // передаем указатель на данный контент, т.к. добавляем текст
                break;
            case 1:
                component = new CBarFraction();
                break;
            case 2:
                component = new CSkewedFraction();
                break;
            case 3:
                component = new CLinearFraction();
                break;
            case 4:
                component = new CSimpleFraction();
                break;
            case 5:
                component = new CDegree(0);
                break;
            case 6:
                component = new CDegree(1);
                break;
            case 7:
                component = new CDegree(2);
                break;
            case 8:
                component = new CDegree(3);
                break;
            case 9:
                component = new CRadical();
                break;
            case 10:
                component = new CNary();
                break;
            case 11:
                component = new CDelimiter();
                break;
            case 12:
                component = new old_CMathFunc();
                break;
        }

        component.init(this.params);

        return result;

    },
    fillText: function(txt)
    {
        for(var i = 0; i < txt.length; i++)
        {
            this.add( txt.charCodeAt(i) );
        }

        //  ??  this.recalculate();
        this.setStart_Selection(this.CurPos);
        this.selection.active = false;

    },
    gToUp: function()
    {
        this.recalculateSize(); // пересчитываем здесь размер
        this.update_widthContent();

        var upLevel = null;

        if( ! this.bRoot )          // на всякий случай
            upLevel = this.Parent;
        else
            upLevel = this.Root;

        return upLevel;
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

                if( this.IsTarget() ) //удаляем тагет
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

                if( this.IsTarget() ) //удаляем тагет
                {
                    var empty = this.content[0]; //CEmpty
                    this.content.length = 0;
                    this.content.push( empty );
                }

                var Content_start = this.content.slice(0, Pos);
                var Content_end   = this.content.slice(Pos);
                
                this.setStart_Selection(Pos);
                this.selection.active = false;

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
                this.selection.active = false;

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
        this.RecalculateReverse();
    },
    _Check_HistoryUninon: function(Data1, Data2)
    {
        var Type1 = Data1.Type;
        var Type2 = Data2.Type;

        if ( historyitem_Paragraph_AddItem === Type1 && historyitem_Paragraph_AddItem === Type2 )
        {
            if ( 1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && !this.content[Data1.Pos].SUBCONTENT && !this.content[Data2.Pos].SUBCONTENT )
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
    old_getRealPosition: function(type)
    {
        var X = 0,
            Y = 0;

        var txtW = this.TxtPrp.FontSize*g_dKoef_pt_to_mm*0.01;
        var pos;

        var bSelect = this.selection.startPos !== this.selection.endPos && !this.IsTarget();

        if(type == 2 && bSelect )
        {
            pos = this.selection.startPos < this.selection.endPos ?  this.selection.startPos : this.selection.endPos;
            X =  this.content[pos - 1].widthToEl;
        }
        else
        {
            pos = this.CurPos;

            if( this.content[pos].value.SUBCONTENT )
            {
                var intPos =  this.content[pos].value.getRealPosition(type);
                X = this.content[pos - 1].widthToEl + intPos.X;
                Y += intPos.Y;
            }
            else if(this.content[pos].value.empty)
            {
                X = this.content[pos].widthToEl + txtW;
            }
            else
            {
                X = this.content[pos].widthToEl;
            }
        }

        return {X: X, Y: Y};
    }
}
//todo
//разобраться с gaps

function CMathComposition()
{
    this.pos = null;
    this.Root = null;

    this.CurrentContent    = null;
    this.SelectContent     = null;

    this.TxtPrp = new CMathTextPrp();

    this.Init();
}
CMathComposition.prototype =
{
    Init: function()
    {
        // TODO
        // переделать gaps
        var g_Unif = 6*g_dKoef_pix_to_mm;
        var gps = new dist(g_Unif, g_Unif, g_Unif, g_Unif);

        this.Root = new CMathContent();
        this.Root.g_mContext = gps;
        //this.Root.setComposition(this);
        this.SetDefaultPrp();
        this.Root.setTxtPrp(this.TxtPrp, true);

        this.CurrentContent = this.Root;
        this.SelectContent  = this.Root;

        this.Root.relate(-1); // корень
    },
    SetDefaultPrp: function()
    {
        this.TxtPrp.FontFamily = {Name  : "Cambria Math", Index : -1 };
        this.TxtPrp.FontSize = 36;
        this.TxtPrp.Italic = true;
        this.TxtPrp.Bold = false;
    },
    Draw: function(context)
    {
        if(this.Root.content.length > 1)
        {
            var w_Box = this.Root.size.width;
            var h_Box = this.Root.size.height;

            context.p_color(224, 238, 224, 255); // "p_color" for stroke
            // "b_color1" for fill
            //context.b_color1(224, 238, 230, 255);

            context.drawHorLine(0, this.pos.y, this.pos.x, this.pos.x + w_Box, 0.2);
            context.drawHorLine(0, this.pos.y + h_Box, this.pos.x, this.pos.x + w_Box, 0.2);
            context.drawVerLine(0,this.pos.x, this.pos.y, this.pos.y + h_Box, 0.2 );
            context.drawVerLine(0,this.pos.x + w_Box, this.pos.y, this.pos.y + h_Box, 0.2 );
        }

        this.Root.draw();
    },
    Cursor_MoveRight: function()
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
    Cursor_MoveLeft: function()
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
    Cursor_MoveUp: function()
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
    Cursor_MoveDown: function()
    {
        this.ClearSelect();
        var move = this.SelectContent.cursor_moveDown();

        this.CurrentContent = move.CurrContent;
        this.SelectContent = move.SelectContent;

        this.CheckTarget();

        return move.state;
    },
    MouseDown: function(mouseX, mouseY)
    {
        this.ClearSelect();
        this.CurrentContent = this.SelectContent = this.Root.mouseDown({x: mouseX, y: mouseY}, -1);

        this.CheckTarget();
    },
    MouseMove: function(mouseX, mouseY)
    {
        if(this.Root.selection.active)
        {
            this.ClearSelect();

            /*mouseX = 18.479166666666664;
            mouseY = 9.76875;*/

            var movement = this.Root.mouseMove({x: mouseX, y: mouseY});
            this.SelectContent = movement.SelectContent;

            this.CheckTarget();
        }
    },
    MouseUp: function()
    {
        this.Root.mouseUp();
    },
    getSize: function()
    {
        return this.Root.size;
    },
    Remove: function(order)
    {
        if(TEST)
        {
            History.Create_NewPoint();
            var start = this.SelectContent.selection.startPos,
                end = this.SelectContent.selection.endPos;
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

            this.CurrentContent.RecalculateReverse();
            this.UpdatePosition();
        }

        this.CheckTarget();


        return result.state.bDelete;
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
    RecalculateReverse: function() // for edit
    {
        this.SelectContent.RecalculateReverse();
    },
    Resize: function()
    {
        this.Root.Resize();
    },
    //// edit ////
    AddLetter: function(code)
    {
        if(TEST)
        {
            History.Create_NewPoint();
        }

        this.ClearSelect();

        this.SelectContent.removeAreaSelect();
        var items =  this.SelectContent.addLetter(code);

        ///
        this.RecalculateReverse();
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
    CreateEquation: function(indef)
    {
        if(TEST)
        {
            History.Create_NewPoint();
        }

        this.ClearSelect();

        this.SelectContent.removeAreaSelect();

        if(TEST)
            var Pos = this.SelectContent.CurPos + 1;

        var items = this.SelectContent.createEquation(indef);

        ///
        this.RecalculateReverse();
        this.UpdatePosition();
        ///

        if(TEST)
        {
            //var Pos = this.SelectContent.CurPos - 1,
            var EndPos = this.SelectContent.CurPos + 1;
            History.Add(this.CurrentContent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: EndPos});
        }

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
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
            StartSelect:        this.SelectContent.selection.startPos - 1,
            EndSelect:          this.SelectContent.selection.endPos - 1,
            stack:              stackSelect
        };

        return State;
    },
    GetRealPosition: function(type)
    {
        var pos = this.Root.getRealPosition(type);

        pos.X += this.Root.g_mContext.top;
        pos.Y += this.Root.g_mContext.left;

        return pos;
    },
    Set_SelectionState : function(State)
    {
        this.ClearSelect();
        this.RecalculateReverse();
        this.UpdatePosition();

        var stackSelect = Common_CopyObj(State.Select.stack),
            stackCurrent = Common_CopyObj(State.Current.stack);

        this.SelectContent = this.Root.getContent( stackSelect, false );
        this.CurrentContent = this.Root.getContent( stackCurrent, true );

        if(this.SelectContent.IsTarget())
            this.CheckTarget();
        else if( State.Select.StartSelect !== State.Select.EndSelect )
        {
            this.SelectContent.setStart_Selection(State.Select.StartSelect );
            this.SelectContent.setEnd_Selection(State.Select.EndSelect);
            this.SelectContent.selection.active = false;
        }
        else
        {
            this.SelectContent.setStart_Selection(State.Select.StartSelect - 1);
            this.SelectContent.selection.active = false;
            this.UpdateCursor();
        }
    },
    /*Undo: function(Data)
    {
        var content = Data.content;
        content.Undo(Data);

    },
    Redo: function()
    {

    },
    Refresh_RecalcData: function()
    {
        this.RecalculateReverse();
        this.UpdatePosition();
        this.CurrentContent.update_Cursor();
        this.ShowCursor();
    },
    Save_Changes: function(Data, Writer)
    {

    },*/
    ////

    ClearSelect: function()
    {
        if(this.SelectContent.selectUse())
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectClear();
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectEnabled(false);
        }
    },
    SetTxtPrp: function(txtPrp)
    {
        this.SelectContent.changeTxtPrp(txtPrp, false);
        //this.SelectContent.setTxtPrp(txtPrp, false);
        this.Resize();
        this.UpdatePosition();
        this.UpdateCursor();
    },
    UpdateCursor: function()
    {
        this.CurrentContent.update_Cursor();
        if( this.SelectContent.selection.startPos !== this.SelectContent.selection.endPos)
            this.HideCursor();
        else
            this.ShowCursor();
    },
    GetPrpSelectContent: function()
    {
        return this.SelectContent.getSelectTPrp(true);
    },

    ////  test function  ////
    TestSetPostion: function()
    {
        this.Root.setPosition(this.posCompos);
    },
    TestSetFontAllSymbols: function(font)
    {
        this.Root.setFont(font);
    },
    ////

    //////    ///////
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
    CheckTarget: function()
    {
        var bSelect = this.SelectContent.selectUse(),
            bTarget = this.SelectContent.IsTarget(),
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
    ////////

    ////  open  ////
    FillPlaceholder: function()
    {
        this.CurrentContent.fillPlaceholder();
        this.GToUp(); //переходим на уровен выше, пересчитываем размер

        //позицию рассчитаем позже
    },
    FillText: function()
    {
        this.CurrentContent.fillText(); // CurrentContent не меняем, остается текущий
    },
    FillMComponent: function()
    {
        this.CurrentContent = this.CurrentContent.fillMComponent(type); // переходим в мат. компонент
        this.SelectContent = this.CurrentContent;
    },
    GToUp: function()
    {
        this.CurrentContent = this.CurrentContent.gToUp(); // пересчитываем размер текущего контента в gToUp, в контенте уровнем выше пересчитаем в аналогичной ф-ии, когда достигнем конца контента
        this.SelectContent = this.CurrentContent;
    },
    SetEnd: function()
    {
        this.SelectContent = this.Root;
        this.CurrentContent = this.Root;
        this.Root.recalculateSize();
    },
    ////
    DrawSelect2: function()
    {
        this.SelectContent.drawSelect2();
    },
    Refresh: function()
    {
        this.ClearSelect();

        this.RecalculateReverse();
        this.UpdatePosition();
        //this.SelectContent.drawSelect();
        this.CheckTarget();
    }
}

function CEmpty()
{
    this.SUBCONTENT = false;
    this.empty = true;
    this.pos = null;
    this.TxtPrp = new CMathTextPrp();

    //this.size = {width: 0, ascent:0, descent: 0, height: 0, center: 0};
    this.size = {width: 0, height: 0, center: 0, ascent: 0};
    this.selection =
    {
        active:        false,
        startPos:   0,
        endPos:     0
    };

    this.draw = function(nothing) {};
    this.mouseMove = function(nothing1, nothing2) { return true; };
    this.setFont = function() {};

    this.setPosition = function (_pos) { this.pos = _pos; };
    this.Resize = function(){};

    this.IsHighElement =  function() { return false; };
    this.setTxtPrp = function(txtPrp) { this.TxtPrp.Merge(txtPrp); };
    this.getRunPrp = function() {return this.TxtPrp; };
    this.setOwnTPrp = function() {};

}
