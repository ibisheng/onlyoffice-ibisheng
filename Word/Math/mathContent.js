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
    this.textPrp = new CMathTextPrp();
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
        this.textPrp.Set(txtPrp);
    },
    setComposition: function(Compos)
    {
        this.Composition = Compos;
    },
    addTxt: function(txt)
    {
        for(var i = 0; i < txt.length; i++)
        {
            this.addLetter( txt.charCodeAt(i));
        }

        this.rInterval.startPos = this.CurPos - txt.length + 1;
        this.rInterval.endPos = this.CurPos + 1;

        this.setStart_Selection(this.CurPos);
        this.selection.active = false;
    },
    addLetter: function(code)
    {
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
        symb.addCode(code);

        this.addElementToContent(symb, gps);

        this.rInterval.startPos = this.CurPos;
        this.rInterval.endPos = this.CurPos + 1; // max количество элементов this.CurPos
    },
    createMComponent: function(ind)
    {
        var l_gap =  0, r_gap = 0;

        var mathElem = null;    //положение этого элемента будет this.CurPos + 1

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
        }

        if( mathElem !== null )
        {
            mathElem.relate(this);
            mathElem.setComposition(this.Composition);
            mathElem.setReduct(this.reduct);

            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 )*g_dKoef_pix_to_mm;
            this.addElementToContent( mathElem, new dist(l_gap, r_gap, 0, 0) );
            this.addElementToContent(new CEmpty());

            this.rInterval.startPos = this.CurPos - 1;
            this.rInterval.endPos = this.CurPos;
        }

        return mathElem; // for finished equation
    },
    addElementToContent: function(element, gaps)
    {
        var elem = new mathElem(element);
        elem.g_mContext = gaps || new dist(0,0,0,0);

        var tmp = this.content.splice(0, this.CurPos+1);
        tmp.push(elem);

        tmp = tmp.concat( this.content.splice(0, this.content.length) );
        this.content.length = 0;
        this.content = tmp;
        this.CurPos++;
        this.setStart_Selection(this.CurPos);
        this.selection.active = false;
    },
    addEquation: function(ind)
    {
        switch(ind)
        {
            case 0:
            case 1:
            case 2:
                var fract = this.createMComponent(ind);
                fract.init();
                fract.fillPlaceholders();
                break;
            case 3:
                var fract = this.createMComponent(0);
                fract.init();
                fract.fillPlaceholders();
                fract.setSimple(true);
                break;
            case 4:
                var fract = this.createMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("dy");
                var den = fract.getDenominator();
                den.addTxt("dx");
                break;
            case 5:
                var fract = this.createMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("Δy");
                var den = fract.getDenominator();
                den.addTxt("Δx");
                break;
            case 6:
                var fract = this.createMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("∂y");
                var den = fract.getDenominator();
                den.addTxt("∂x");
                break;
            case 7:
                var fract = this.createMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("δy");
                var den = fract.getDenominator();
                den.addTxt("δx");
                break;
            case 8:
                var fract = this.createMComponent(0);
                fract.init();
                var num = fract.getNumerator();
                num.addTxt("π");
                var den = fract.getDenominator();
                den.addTxt("2");
                break;
            case 9:
                var degr = this.createMComponent(3);
                degr.init();
                degr.setIndex(1);
                degr.fillPlaceholders();
                break;
            case 10:
                var degr = this.createMComponent(3);
                degr.init();
                degr.setIndex(-1);
                degr.fillPlaceholders();
                break;
            case 11:
                var degrSupSup = this.createMComponent(4);
                degrSupSup.init();
                degrSupSup.fillPlaceholders();
                break;
            case 12:
                var degrSupSup = this.createMComponent(5);
                degrSupSup.init();
                degrSupSup.fillPlaceholders();
                break;
            case 13:
                var degr = this.createMComponent(3);
                degr.init();
                degr.setIndex(-1);
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();

                var degr2 = iter.createMComponent(3);
                degr2.init();
                degr2.setIndex(1);
                var base2 = degr2.getBase();
                base2.addTxt("y");
                var iter2 = degr2.getIterator();
                iter2.addTxt("2");

                break;
            case 14:
                var degr = this.createMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.addTxt("e");
                var iter = degr.getIterator();
                iter.addTxt("-iωt");
                break;
            case 15:
                var degr = this.createMComponent(3);
                degr.init();
                degr.setIndex(1);
                var base = degr.getBase();
                base.addTxt("x");
                var iter = degr.getIterator();
                iter.addTxt("2");
                break;
            case 16:
                var degr = this.createMComponent(5);
                degr.init();
                var base = degr.getBase();
                base.addTxt("Y");
                var iter1 = degr.getUpperIterator();
                iter1.addTxt("n");
                var iter2 = degr.getLowerIterator();
                iter2.addTxt("1");
                break;
            case 17:
                var rad = this.createMComponent(6);
                rad.init();
                rad.fillPlaceholders();
                break;
            case 18:
                var rad = this.createMComponent(7);
                rad.init();
                rad.fillPlaceholders();
                break;

        }
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
            this.remove();
    },
    setReduct: function(coeff)
    {
        this.reduct = this.reduct*coeff;
    },
    getTxtPrp: function()
    {
        var txtPrp;

        if(!this.bRoot)
            txtPrp = this.Parent.getTxtPrp();
        else
        {
            txtPrp = new CMathTextPrp();
            Common_CopyObj2(txtPrp, this.Composition.TxtPrp);
        }

        txtPrp.Merge(this.textPrp);
        txtPrp.FontSize *= this.reduct; // для итераторов

        return txtPrp;
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

            _ascent = Size.ascent > sAscent ? Size.ascent : sAscent;
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

        this.rInterval.startPos = this.rInterval.endPos;

        this.recalculateSize();
        if(! this.bRoot )
            this.Parent.RecalculateReverse();
    },
    Resize: function()
    {
        for(var i = 0; i < this.content.length; i++)
            this.content[i].value.Resize();

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
        var fontSize = this.getTxtPrp().FontSize;
        var position = {x: this.pos.x + this.content[this.CurPos].widthToEl, y: this.pos.y + this.size.center - fontSize*g_dKoef_pt_to_mm /2 };

        editor.WordControl.m_oLogicDocument.DrawingDocument.SetTargetSize( fontSize*g_dKoef_pt_to_mm );
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
    getCoordElem: function(index, mCoord)  // without gaps of Math Component ( напримет, если справа/слева есть относительно мат элемента компонент, то добавляем gaps справа/слева для этого мат элемента )
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
    remove: function()
    {
        var state =
        {
            bRecPosition:           false,   /*нужно ли пересчитывать позицию или нет, работает при backspace */
            bBeginning:             false    /*в начале контента или нет*/
            //bTargetAfterRemove:     false   /*нужно ли селектить target, этот флаг выставляется в CMathBase*/
        };
        var  CurrContent = SelectContent = null;

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
                    else
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

        for(var j= start; j < end ; j++)
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
    hidePlaceholder: function(flag)
    {
        this.plhHide = flag;
    },
    //TODO
    //убрать
    setPositionHideTgt: function()
    {
        this.CurPos = 0;
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

        for(var i=1; i<this.content.length;i++)
        {
            var t = {x: this.pos.x + this.content[i-1].widthToEl + this.content[i].g_mContext.left, y: this.pos.y + max_cent };
            this.content[i].value.setPosition(t);
        }
    },
    IsJustDraw: function()
    {
        return false;
    },
    SetDot: function(flag)
    {
        this.bDot = flag;
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


    ////////    old functions    /////////////////////////////////////
    old_init: function(params)
    {
        this.font = params.font;
        this.indefSize = params.indefSize;
        this.reduct = params.reduct;
        this.bMText = params.bMText;

        //todo
        //переделать
        if(params.gaps === -1)
            this.g_mContext = new dist(0,0,0,0);
        else
            this.g_mContext = params.gaps;

        this.content.push( new mathElem(new CEmpty(), new dist(0,0,0,0), 0) );

    },
    old_setContent: function()
    {
        var gps = new dist(0,0,0,0);
        var TParms =
        {
            font:       this.font,
            indefSize:  this.indefSize,
            bMText:     this.bMText
        };

        for(var i = 0; i < arguments.length; i++) //массив из мат объектов и/или юникодных кодов символов
        {
            var mathObject = new CMathText(TParms);
            mathObject.init(arguments[i], true);
            this.content.push( new mathElem(mathObject, gps) );
        }
        this.recalculate();
    },
    old_fillPlaceholders: function()
    {
        var gps = new dist(0,0,0,0);
        var TParms =
        {
            font:       this.font,
            indefSize:  this.indefSize,
            bMText:     this.bMText
        };
        var placeholder = new CMathText(TParms);
        placeholder.init(StartTextElement);
        this.content.push( new mathElem( placeholder, gps) );

        this.recalculate();
    },

    old_add: function(code)
    {
        if( this.IsTarget() ) //удаляем тагет
        {
            var empty = this.content[0]; //CEmpty
            this.content.length = 0;
            this.content.push( empty );
            this.CurPos = 0;
        }
        else if( this.selection.startPos != this.selection.endPos ) //т.к. после того как удалили тагет у нас эти 2 значения не равны, равенство их выставляется позднее, после добавления символа
            this.remove();

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

        if(code == 42)
            code = 8727;
        else if(code == 45)
            code = 8722;
        /*else if(code == 37)
            code = 0x2191;*/
            //code = 0x1D70B;

        if(this.bDot)
        {
            if(code === 0x69)
                code = 0x1D6A4;
            if(code === 0x6A)
                code =  0x1D6A5;
        }

        if(code == 0x0068)
            code = 0x210E;

        var TParms =
        {
            font:       this.font,
            indefSize:  this.indefSize,
            bMText:     this.bMText     // для текста передаем тот параметр, который у контента (привемеры: тригонометрические ф-ии, логарифм и т.п.)
        };
        var symb = new CMathText(TParms);
        symb.init(code, true);

        this.addElementToContent(symb, gps);

        // TODO
        // добавим расстояние для мат элемента (если до этого gap был равен 0)
        // для знака " * ":
        //      если один элемент в контенте, то gaps равны 0
        //      если слева и/или справа есть элемент, то соответственно добавляется расстояние слева и/или справа
        // для знаков "+" и "-":
        //      если есть элемент справа, а слева не будет элемента, тогда gap не добавляем
        //      если есть элемент слева, а справа нет элемента, тогда добавляем gap слева
        //      в ситуации, когда есть и слева и справа элементы добавляем gaps с обоих сторон
        // для знака "/" gaps не добавляем ни в одном из случаев

    },
    old_add_mathComponent: function(ind)
    {
        if( this.IsTarget() ) //удаляем тагет
        {
            var empty = this.content[0]; //CEmpty
            this.content.length = 0;
            this.content.push( empty );
            this.CurPos = 0;
        }
        else if( this.selection.startPos != this.selection.endPos ) //т.к. после того как удалили тагет у нас эти 2 значения не равны, равенство их выставляется позднее, после добавления символа
            this.remove();

        // 16 pt
        // 4 px справа
        // 3 px слева

        // 18 pt
        // 5 px справа
        // 4 px слева

        // 20 pt
        // 5 px справа
        // 4 рх слева

        // 26 pt
        // 6 px справа
        // 6 px слева

        // 36 pt
        // 9 px справа
        // 8 px слева

        // 48 pt
        // 12 px справа
        // 10 px слева

        // 72 pt
        // 19 px справа
        // 16 px слева

        // индефикаторы

        // 0-2  fraction (bar, linear, skewed)
        // 3    trigonometric function
        // 4    matrix
        // 5    degree
        // 6    min / max / lim
        // 7    logarithm
        // 8    n-ary (ordinary)
        // 9    n-ary (iterators like a degree)
        // 10   radical
        // 11   parenthesis
        // 12   bracket
        // 13   diacritic
        // 14   diacritical element(line)

        var l_gap =  0, r_gap = 0,
            betta =  96/72,
            size = this.font.FontSize ;

        //положение этого элемента будет this.CurPos + 1
        var mathElem = AddEquation(ind);

        // если отправили некорректный indeficator в AddEquation
        if(mathElem !== null)
        {
            var params =
            {
                font:       this.font,
                gaps:       -1,
                indefSize:  SizeDefault,
                reduct:     this.reduct,
                bMText:     true        // всегда для формулы Cambria Math
            };

            mathElem.init(params);
            mathElem.relate(this);
            mathElem.setContent();

            //l_gap = r_gap = Math.floor( this.font.FontSize / 5 )*g_dKoef_pix_to_mm;
            this.addElementToContent( mathElem, new dist(l_gap, r_gap, 0, 0) );

            //this.addElementToContent(mathElem, new dist(0,0,0,0));
            this.addElementToContent(new CEmpty());
        }
    },
    old_addElementToContent: function(element, gaps)
    {
        var gps  = gaps || new dist(0,0,0,0);
        
        var tmp = this.content.splice(0, this.CurPos+1);
        tmp.push(  new mathElem(element, gps) );

        tmp = tmp.concat( this.content.splice(0, this.content.length) );
        this.content.length = 0;
        this.content = tmp;
        this.CurPos++;
        this.recalculate();

        this.setStart_Selection(this.CurPos);
        this.selection.active = false;

    },
    old_setFont: function(font)
    {
        this.font = font;

        for(var j = 0; j < this.content.length; j++)
            this.content[j].value.setFont(font);

        this.recalculateSize();
        this.update_widthContent();
    },
    getMetricsLetter: function(pos)
    {
        return metrics = this.content[pos+1].value.getMetrics();
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
    old_updateTextPrp: function(TextPrp)
    {
        if(this.selection.startPos != this.selection.endPos)
        {
            var start = this.selection.startPos,
                end = this.selection.endPos;
            if(start > end)
            {
                var tmp = start;
                start = end;
                end = tmp;
            }
            for(var i = start; i < end; i++)
                this.content[i].value.setFont(TextPrp);

            this.recalculateSize();
            this.update_widthContent();
        }
        else if(this.content[this.CurPos].value.SUBCONTENT)
        {
            this.content[this.CurPos].value.updateTextPrp(TextPrp);

            this.recalculateSize();
            this.update_widthContent();
        }
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
    fillPlaceholder: function()
    {
        this.fillMComponent(0);
        this.addCode(StartTextElement);
    },
    fillText: function(txt)
    {
        for(var i = 0; i < txt.length; i++)
        {
            this.addCode( txt.charCodeAt(i) );
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
    ////
    old_addText: function(txt)
    {
        for(var i = 0; i < txt.length; i++)
        {
            this.addLetter( txt.charCodeAt(i) );
        }

        this.recalculate();
        this.setStart_Selection(this.CurPos);
        this.selection.active = false;
    },
    old_addLetter: function(code)
    {
        if( this.IsTarget() ) //удаляем тагет
        {
            var empty = this.content[0]; //CEmpty
            this.content.length = 0;
            this.content.push( empty );
            this.CurPos = 0;
        }
        else if( this.selection.startPos != this.selection.endPos ) //т.к. после того как удалили тагет у нас эти 2 значения не равны, равенство их выставляется позднее, после добавления символа
            this.remove();

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

        var TParms =
        {
            font:       this.font,
            indefSize:  this.indefSize,
            bMText:     this.bMText     // для текста передаем тот параметр, который у контента (привемеры: тригонометрические ф-ии, логарифм и т.п.)
        };
        var symb = new CMathText(TParms);
        symb.init(code, true);

        this.addElementToContent(symb, gps);

        // TODO
        // добавим расстояние для мат элемента (если до этого gap был равен 0)
        // для знака " * ":
        //      если один элемент в контенте, то gaps равны 0
        //      если слева и/или справа есть элемент, то соответственно добавляется расстояние слева и/или справа
        // для знаков "+" и "-":
        //      если есть элемент справа, а слева не будет элемента, тогда gap не добавляем
        //      если есть элемент слева, а справа нет элемента, тогда добавляем gap слева
        //      в ситуации, когда есть и слева и справа элементы добавляем gaps с обоих сторон
        // для знака "/" gaps не добавляем ни в одном из случаев
    },
    old_fillContent: function(type)
    {
        var component,
            result;

        if(type == 0)
        {
            component = new CMathText();
            component.init(this.params);
            component.addCode(StartTextElement);
            result = this;
        }
        else if(type == 1)
        {
            component = new CMathText();
            component.init(this.params);
            result = this;
        }
        else
        {
            component = this.getMathComponent(type);
            component.init(this.params);
            result = component;
        }

        return result;

        /*var component;
         switch(type)
         {
         case 0:
         component = new CMathText();
         component.addCode(StartTextElement);
         break;
         case 1:
         component = new CMathText();
         break;
         case 2:
         component = new CBarFraction();
         break;
         case 3:
         component = new CSkewedFraction();
         break;
         case 4:
         component = new CLinearFraction();
         break;
         case 5:
         component = new CSimpleFraction();
         break;
         case 6:
         component = new CDegree(0);
         break;
         case 7:
         component = new CDegree(1);
         break;
         case 8:
         component = new CDegree(2);
         break;
         case 9:
         component = new CDegree(3);
         }

         component.setParams(this.params);*/
    },
    old_getMathComponent: function(id)
    {
        // 0 - placeholder
        // 1 - math text
        var component;
        switch(id)
        {
            case 2:
                component = new CBarFraction();
                break;
            case 3:
                component = new CSkewedFraction();
                break;
            case 4:
                component = new CLinearFraction();
                break;
            case 5:
                component = new CSimpleFraction();
                break;
            case 6:
                component = new CDegree(0);
                break;
            case 7:
                component = new CDegree(1);
                break;
            case 8:
                component = new CDegree(2);
                break;
            case 9:
                component = new CDegree(3);
                break;
            case 10:
                component = new CRadical();
                break;
            case 11:
                component = new CNary();
                break;
            case 12:
                component = new CDelimiter();
                break;
            case 13:
                component = new old_CMathFunc();
                break;
        }

        return component;
    },
    old_gToUp: function()
    {
        this.recalculateSize(); // пересчитываем здесь размер
        this.update_widthContent();

        var upLevel;

        if( ! this.bRoot )
            upLevel = this.Parent;
        else
            upLevel = this.Root;

        return upLevel;
    },
    old_ResizeReverse: function() // пересчитываем начиная с текущего контента (и уровни, к-ые находятся выше)
    {
        this.recalculate();
        if(! this.bRoot )
            this.Parent.ResizeReverse();
    },
    old_ResizeDirect: function()    //for finished equation
    {
        for(var i = 0; i < this.content.length; i++)
            this.content[i].value.ResizeDirect();

        this.recalculate();
    }

    ////////////////////////////////////////////////////////////////

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

    this.init();
    this.setDefaultPrp();
}
CMathComposition.prototype =
{
    init: function()
    {
        // TODO
        // переделать gaps
        var g_Unif = 6*g_dKoef_pix_to_mm;
        var gps = new dist(g_Unif, g_Unif, g_Unif, g_Unif);

        this.Root = new CMathContent();
        this.Root.g_mContext = gps;
        this.Root.setComposition(this);

        this.CurrentContent = this.Root;
        this.SelectContent  = this.Root;

        this.Root.relate(-1); // корень
    },
    setDefaultPrp: function()
    {
        this.TxtPrp.FontFamily = {Name  : "Cambria Math", Index : -1 };
        this.TxtPrp.FontSize = 36;
        this.TxtPrp.Italic = true;
        this.TxtPrp.Bold = false;
    },
    SetTxtPrp: function(TxtPrp)
    {
        this.TxtPrp = TxtPrp;
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
    Remove: function()
    {
        var result = false;

        this.ClearSelect();

        var removal = this.SelectContent.remove();
        this.CurrentContent = removal.CurrContent;
        this.SelectContent  = removal.SelectContent;

        this.CurrentContent.setPlaceholderAfterRemove(); // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент

        if( removal.state.bRecPosition )
        {
            this.CurrentContent.RecalculateReverse();
            this.UpdatePosition();

            result = true;
        }

        this.CheckTarget();

        return result;
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
        this.ClearSelect();

        this.SelectContent.removeAreaSelect();
        this.SelectContent.addLetter(code);

        ///
        this.RecalculateReverse();
        this.UpdatePosition();
        ///

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    AddMathComponent: function(indef)
    {
        this.ClearSelect();

        this.SelectContent.removeAreaSelect();
        this.SelectContent.addEquation(indef);

        ///
        this.RecalculateReverse();
        this.UpdatePosition();
        ///

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    ////
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
    StartCursor: function()
    {
        editor.WordControl.m_oLogicDocument.DrawingDocument.TargetStart();
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
    ClearSelect: function()
    {
        if(this.SelectContent.selectUse())
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectClear();
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectEnabled(false);
        }
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
    /*TestFont: function(font)
     {
        this.CurrentContent.TestFont(font);
     },*/
    ////


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

    //// finished equation ////

    AddMathEquation: function (ind)
    {
        this.ClearSelect();

        switch(ind)
        {
            case 4:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("dy");

                denominator = fraction.getDenominator();
                denominator.addText("dx");

                fraction.ResizeReverse_2();
                break;
            case 5:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("Δy");

                denominator = fraction.getDenominator();
                denominator.addText("Δx");

                fraction.ResizeReverse_2();
                break;
            case 6:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("∂y");

                denominator = fraction.getDenominator();
                denominator.addText("∂x");

                fraction.ResizeReverse_2();

                break;
            case 7:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("δy");

                denominator = fraction.getDenominator();
                denominator.addText("δx");

                fraction.ResizeReverse_2();

                break;
            case 8:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("π");

                denominator = fraction.getDenominator();
                denominator.addText("2");

                fraction.ResizeReverse_2();

                break;
            case 13:
                degree = this.SelectContent.addMathComponent_2(10);
                base = degree.getBase();
                base.addText("x");
                iterator = degree.getIterator();

                degr_2 = iterator.addMathComponent_2(9);
                base_2 = degr_2.getBase();
                base_2.addText("y");

                iter_2 = degr_2.getIterator();
                iter_2.addText("2");

                degr_2.ResizeReverse_2();
                degree.ResizeReverse_2();

                break;
            case 14:
                degree = this.SelectContent.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("e");
                iterator = degree.getIterator();
                iterator.addText("-iωt");

                degree.ResizeReverse_2();
                break;
            case 15:
                degree = this.SelectContent.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("x");
                iterator = degree.getIterator();
                iterator.addText("2");

                degree.ResizeReverse_2();
                break;
            case 16:
                degree = this.SelectContent.addMathComponent_2(12);
                base = degree.getBase();
                base.addText("Y");
                iterator = degree.getUpperIterator();
                iterator.addText("n");

                iterator = degree.getLowerIterator();
                iterator.addText("1");

                degree.ResizeReverse_2();
                break;
            case 19:
                radical = this.SelectContent.addMathComponent_2(18);
                degr = radical.getDegree();
                degr.addText("2");
                radical.ResizeReverse_2();
                break;
            case 20:
                radical = this.SelectContent.addMathComponent_2(18);
                degr = radical.getDegree();
                degr.addText("3");
                radical.ResizeReverse_2();
                break;
            case 21:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();

                numerator.addText("-b±");
                radical = numerator.addMathComponent_2(17);
                baseRad = radical.getBase();

                degree = baseRad.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("b");
                iter = degree.getIterator();
                iter.addText("2");

                baseRad.addText("-4ac");

                denominator = fraction.getDenominator();
                denominator.addText("2a");

                fraction.ResizeReverse_2();

                break;
            case 22:
                radical = this.SelectContent.addMathComponent_2(17);
                baseRad = radical.getBase();

                degree = baseRad.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("a");
                iter = degree.getIterator();
                iter.addText("2");

                baseRad.addText("+");

                degree2 = baseRad.addMathComponent_2(9);
                base2 = degree2.getBase();
                base2.addText("b");
                iter2 = degree2.getIterator();
                iter2.addText("2");

                radical.ResizeReverse_2();
                break;
            case 41:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dx");
                mathBase.ResizeReverse_2();
                break;
            case 42:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dy");
                mathBase.ResizeReverse_2();
                break;
            case 43:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dθ");
                mathBase.ResizeReverse_2();
                break;
            case 79:
                nary = this.SelectContent.addMathComponent_2(47);

                iter = nary.getLowerIterator();
                iter.addText("k");

                base = nary.getBase();
                delimiter = base.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                matrix = delimBase.addMathComponent_2(207);

                matrElem = matrix.getElement(0, 0);
                matrElem.addText("n");

                matrElem2 = matrix.getElement(1, 0);
                matrElem2.addText("k");

                nary.ResizeReverse_2();
                break;
            case 80:
                nary = this.SelectContent.addMathComponent_2(45);

                iter = nary.getUpperIterator();
                iter.addText("n");

                iter = nary.getLowerIterator();
                iter.addText("i=0");

                nary.ResizeReverse_2();
                break;
            case 82:
                nary = this.SelectContent.addMathComponent_2(60);
                iterUp = nary.getUpperIterator();
                iterUp.addText("m");

                iterLow = nary.getLowerIterator();
                iterLow.addText("n=1");

                base = nary.getBase();
                delimiter = base.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                degr = delimBase.addMathComponent_2(10);
                degrBase = degr.getBase();
                degrBase.addText("X");

                degrIter = degr.getIterator();
                degrIter.addText("n");

                delimBase.addText("∩");

                degr2 = delimBase.addMathComponent_2(10);
                degrBase2 = degr2.getBase();
                degrBase2.addText("Y");

                degrIter2 = degr2.getIterator();
                degrIter2.addText("n");

                nary.ResizeReverse_2();
                break;
            case 117:
                delimiter = this.SelectContent.addMathComponent_2(103);
                delimBase = delimiter.getBase();
                delimBase.addMathComponent_2(207);
                delimiter.ResizeReverse_2();
                break;
            case 118:
                delimiter = this.SelectContent.addMathComponent_2(103);
                delimBase = delimiter.getBase();
                delimBase.addMathComponent_2(209);
                delimiter.ResizeReverse_2();
                break;
            case 119:
                fract = this.SelectContent.addMathComponent_2(0);
                fract.hideBar(true);
                fract.ResizeReverse_2();
                break;
            case 120:
                delimiter = this.SelectContent.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);
                delimiter.ResizeReverse_2();
                break;
            case 121:
                break;
            case 122:
                delimiter = this.SelectContent.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);

                num = fract.getNumerator();
                num.addText("n");

                den = fract.getDenominator();
                den.addText("k");

                delimiter.ResizeReverse_2();
                break;
            case 123:
                delimiter = this.SelectContent.addMathComponent_2(86);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);

                num = fract.getNumerator();
                num.addText("n");

                den = fract.getDenominator();
                den.addText("k");

                delimiter.ResizeReverse_2();
                break;
            case 124:
                this.SetTrigonometricFunc("sin");
                break;
            case 125:
                this.SetTrigonometricFunc("cos");
                break;
            case 126:
                this.SetTrigonometricFunc("tan");
                break;
            case 127:
                this.SetTrigonometricFunc("csc");
                break;
            case 128:
                this.SetTrigonometricFunc("sec");
                break;
            case 129:
                this.SetTrigonometricFunc("cot");
                break;

            case 130:
                this.SetDegrTrigFunc("sin");
                break;
            case 131:
                this.SetDegrTrigFunc("cos");
                break;
            case 132:
                this.SetDegrTrigFunc("tan");
                break;
            case 133:
                this.SetDegrTrigFunc("csc");
                break;
            case 134:
                this.SetDegrTrigFunc("sec");
                break;
            case 135:
                this.SetDegrTrigFunc("cot");
                break;

            case 136:
                this.SetTrigonometricFunc("sinh");
                break;
            case 137:
                this.SetTrigonometricFunc("cosh");
                break;
            case 138:
                this.SetTrigonometricFunc("tanh");
                break;
            case 139:
                this.SetTrigonometricFunc("csch");
                break;
            case 140:
                this.SetTrigonometricFunc("sech");
                break;
            case 141:
                this.SetTrigonometricFunc("coth");
                break;

            case 142:
                this.SetDegrTrigFunc("sinh");
                break;
            case 143:
                this.SetDegrTrigFunc("cosh");
                break;
            case 144:
                this.SetDegrTrigFunc("tanh");
                break;
            case 145:
                this.SetDegrTrigFunc("csch");
                break;
            case 146:
                this.SetDegrTrigFunc("sech");
                break;
            case 147:
                this.SetDegrTrigFunc("coth");
                break;
            case 148:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("sin");

                arg = mathFunc.getArgument();
                arg.addText("θ");

                mathFunc.ResizeReverse_2();
                break;
            case 149:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("cos");

                arg = mathFunc.getArgument();
                arg.addText("2x");

                mathFunc.ResizeReverse_2();
                break;
            case 150:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("tan");

                arg = mathFunc.getArgument();
                arg.addText("θ");

                this.SelectContent.addText("=");

                fract = this.SelectContent.addMathComponent_2(0);
                numer = fract.getNumerator();

                mathFunc2 =  numer.addMathComponent_2(228);
                func2 = mathFunc2.getFunction();
                func2.addText("sin");

                arg2 = mathFunc2.getArgument();
                arg2.addText("θ");

                den = fract.getDenominator();

                mathFunc3 =  den.addMathComponent_2(228);
                func3 = mathFunc3.getFunction();
                func3.addText("cos");

                arg3 = mathFunc3.getArgument();
                arg3.addText("θ");

                mathFunc.ResizeReverse_2();
                fract.ResizeReverse_2();

                break;
            case 174:
                box = this.SelectContent.addMathComponent_2(173);
                borderBox = box.getElement();

                aDegr = borderBox.addMathComponent_2(9);

                aBase = aDegr.getBase();
                aBase.addText("a");
                aIter = aDegr.getIterator();
                aIter.addText("2");

                borderBox.addText("=");
                bDegr = borderBox.addMathComponent_2(9);

                bBase = bDegr.getBase();
                bBase.addText("b");
                bIter = bDegr.getIterator();
                bIter.addText("2");

                borderBox.addText("+");
                cDegr = borderBox.addMathComponent_2(9);

                cBase = cDegr.getBase();
                cBase.addText("c");
                cIter = cDegr.getIterator();
                cIter.addText("2");

                box.ResizeReverse_2();
                break;
            case 178:
                this.SetTrigonometricFunc("log");
                break;
            case 182:
                this.SetTrigonometricFunc("ln");
                break;
            case 183:
                lim = this.SelectContent.addMathComponent_2(179);
                iter = lim.getIterator();
                iter.addText("n→∞");

                base = lim.getArgument();
                degree = base.addMathComponent_2(9);
                iter2 = degree.getIterator();
                iter2.addText("n");
                base2 = degree.getBase();

                delim = base2.addMathComponent_2(83);
                delimBase = delim.getBase();
                delimBase.addText("1+");

                fract = delimBase.addMathComponent_2(0);
                num = fract.getNumerator();
                num.addText("1");
                den = fract.getDenominator();
                den.addText("n");

                lim.ResizeReverse_2();
                break;
            case 184:
                maximum = this.SelectContent.addMathComponent_2(181);
                iter = maximum.getIterator();
                iter.addText("0≤x≤1");

                base = maximum.getArgument();
                base.addText("x");

                degree = base.addMathComponent_2(9);
                base2 = degree.getBase();
                base2.addText("e");

                iter2 = degree.getIterator();
                iter2.addText("-");
                degree3 = iter2.addMathComponent_2(9);
                base3 = degree3.getBase();
                base3.addText("x");

                iter3 = degree3.getIterator();
                iter3.addText("2");


                maximum.ResizeReverse_2();
                break;
            case 185:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("∶=");
                matr.ResizeReverse_2();
                break;
            case 186:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("==");
                matr.ResizeReverse_2();
                break;
            case 187:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("+=");
                matr.ResizeReverse_2();
                break;
            case 188:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("-=");
                matr.ResizeReverse_2();
                break;
            case 189:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≝");
                matr.ResizeReverse_2();
                break;
            case 190:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≞");
                matr.ResizeReverse_2();
                break;
            case 191:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≜");
                matr.ResizeReverse_2();
                break;
            case 204:
                arrow =  this.SelectContent.addMathComponent_2(195);
                base = arrow.getBase();
                base.addText("yields");
                arrow.ResizeReverse_2();
                break;
            case 205:
                arrow =  this.SelectContent.addMathComponent_2(195);
                base = arrow.getBase();
                base.addText("∆");
                arrow.ResizeReverse_2();
                break;
            case 214:
                this.SelectContent.addText("⋯");
                break;
            case 215:
                this.SelectContent.addText("…");
                break;
            case 216:
                this.SelectContent.addText("⋮");
                break;
            case 217:
                this.SelectContent.addText("⋱");
                break;
                break;
            case 218:
                matr = this.SelectContent.addMathComponent_2(210);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem2 = matr.getElement(0,1);
                elem2.addText("0");

                elem3 = matr.getElement(1,0);
                elem3.addText("0");

                elem4 = matr.getElement(1,1);
                elem4.addText("1");

                matr.ResizeReverse_2();
                break;
            case 219:
                matr = this.SelectContent.addMathComponent_2(210);
                matr.hidePlaceholder(true);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem4 = matr.getElement(1,1);
                elem4.addText("1");
                matr.ResizeReverse_2();
                break;
            case 220:
                matr = this.SelectContent.addMathComponent_2(213);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem2 = matr.getElement(0,1);
                elem2.addText("0");

                elem3 = matr.getElement(0,2);
                elem3.addText("0");

                elem4 = matr.getElement(1,0);
                elem4.addText("0");

                elem5 = matr.getElement(1,1);
                elem5.addText("1");

                elem6 = matr.getElement(1,2);
                elem6.addText("0");

                elem7 = matr.getElement(2,0);
                elem7.addText("0");

                elem8 = matr.getElement(2,1);
                elem8.addText("0");

                elem9 = matr.getElement(2,2);
                elem9.addText("1");

                matr.ResizeReverse_2();
                break;
            case 221:
                matr = this.SelectContent.addMathComponent_2(213);
                matr.hidePlaceholder(true);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem5 = matr.getElement(1,1);
                elem5.addText("1");

                elem9 = matr.getElement(2,2);
                elem9.addText("1");

                matr.ResizeReverse_2();
                break;
            case 222:
                delimiter = this.SelectContent.addMathComponent_2(83);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 223:
                delimiter = this.SelectContent.addMathComponent_2(84);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 224:
                delimiter = this.SelectContent.addMathComponent_2(89);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 225:
                delimiter = this.SelectContent.addMathComponent_2(90);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 226:
                delimiter = this.SelectContent.addMathComponent_2(83);

                base = delimiter.getBase();
                matr = base.addMathComponent_2(213);

                elem2 = matr.getElement(0,1);
                elem2.addText("⋯");

                elem4 = matr.getElement(1,0);
                elem4.addText("⋮");

                elem5 = matr.getElement(1,1);
                elem5.addText("⋱");

                elem6 = matr.getElement(1,2);
                elem6.addText("⋮");

                elem8 = matr.getElement(2,1);
                elem8.addText("⋯");


                delimiter.ResizeReverse_2();
                break;
            case 227:
                delimiter = this.SelectContent.addMathComponent_2(84);

                base = delimiter.getBase();
                matr = base.addMathComponent_2(213);

                elem2 = matr.getElement(0,1);
                elem2.addText("⋯");

                elem4 = matr.getElement(1,0);
                elem4.addText("⋮");

                elem5 = matr.getElement(1,1);
                elem5.addText("⋱");

                elem6 = matr.getElement(1,2);
                elem6.addText("⋮");

                elem8 = matr.getElement(2,1);
                elem8.addText("⋯");


                delimiter.ResizeReverse_2();
                break;
            default:
                this.SelectContent.add_mathComponent(ind);
                break;

        }

        this.SelectContent.ResizeReverse();
        this.Root.setPosition(this.pos);

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    SetDegrTrigFunc: function(txt)
    {
        mathFunc = this.SelectContent.addMathComponent_2(228);
        //setColumnGapRule(3, 120);
        func = mathFunc.getFunction();
        degr = func.addMathComponent_2(9);

        base = degr.getBase();
        base.bMText = false;
        base.addText(txt);
        iter = degr.getIterator();
        iter.addText("-1");

        mathFunc.ResizeReverse_2();
    },
    SetTrigonometricFunc: function(txt)
    {
        mathFunc = this.SelectContent.addMathComponent_2(228);
        func = mathFunc.getFunction();
        func.addText(txt);

        mathFunc.ResizeReverse_2();
    }

    ////
}

function CEmpty()
{
    this.SUBCONTENT = false;
    this.empty = true;
    this.pos;
    //this.size = {width: 0, ascent:0, descent: 0, height: 0, center: 0};
    this.size = {width: 0, height: 0, center: 0, ascent: 0};
    this.selection =
    {
        active:        false,
        startPos:   0,
        endPos:     0
    };

    this.draw = function(nothing) {}
    this.mouseMove = function(nothing1, nothing2) { return true; }
    this.setFont = function() {}

    this.setPosition = function (_pos) { this.pos = _pos; }
    this.Resize = function(){}

    this.IsHighElement =  function() { return false; }
}

function AddEquation(ind)
{
    var mathElem = null;

    switch(ind)
    {
        case 0:
            mathElem = new CBarFraction();
            /*l_gap = this.CurPos == 0 ? 0 : size/4*betta;
            r_gap = this.CurPos == this.content.length - 1 ? 0 : size*0.21*betta;*/
            break;
        case 1:
            mathElem = new CSkewedFraction();
            break;
        case 2:
            mathElem = new CLinearFraction();
            break;
        case 3:
            mathElem = new CSimpleFraction();
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        case 8:
            break;
        case 9:
            mathElem = new CDegree(0);
            break;
        case 10:
            mathElem = new CDegree(1);
            break;
        case 11:
            mathElem = new CDegree(2);
            break;
        case 12:
            mathElem = new CDegree(3);
            break;
        case 13:
            break;
        case 14:
            break;
        case 15:
            break;
        case 16:
            break;
        case 17:
            mathElem = new CRadical();
            break;
        case 18:
            mathElem = new CDegreeRadical();
            break;
        case 19:
            break;
        case 20:
            break;
        case 21:
            break;
        case 22:
            break;

        case 23:
            mathElem = new CNary(0, 0, 0);
            break;
        case 24:
            mathElem = new CNary(0, 1, 3);
            break;
        case 25:
            mathElem = new CNary(0, 0, 3);
            break;
        case 26:
            mathElem = new CNary(1, 0, 0);
            break;
        case 27:
            mathElem = new CNary(1, 1, 3);
            break;
        case 28:
            mathElem = new CNary(1, 0, 3);
            break;
        case 29:
            mathElem = new CNary(2, 0, 0);
            break;
        case 30:
            mathElem = new CNary(2, 1, 3);
            break;
        case 31:
            mathElem = new CNary(2, 0, 3);
            break;
        case 32:
            mathElem = new CNary(3, 0, 0);
            break;
        case 33:
            mathElem = new CNary(3, 1, 3);
            break;
        case 34:
            mathElem = new CNary(3, 0, 3);
            break;
        case 35:
            mathElem = new CNary(4, 0, 0);
            break;
        case 36:
            mathElem = new CNary(4, 1, 3);
            break;
        case 37:
            mathElem = new CNary(4, 0, 3);
            break;
        case 38:
            mathElem = new CNary(5, 0, 0);
            break;
        case 39:
            mathElem = new CNary(5, 1, 3);
            break;
        case 40:
            mathElem = new CNary(5, 0, 3);
            break;
        case 41:
            //mathElem = new CDifferential(0);
            break;
        case 42:
            //mathElem = new CDifferential(1);
            break;
        case 43:
            //mathElem = new CDifferential(2);
            break;

        case 44:
            mathElem = new CNary(6, 0, 0);
            break;
        case 45:
            mathElem = new CNary(6, 0, 3);
            break;
        case 46:
            mathElem = new CNary(6, 1, 3);
            break;
        case 47:
            mathElem = new CNary(6, 0, 2);
            break;
        case 48:
            mathElem = new CNary(6, 1, 2);
            break;
        case 49:
            mathElem = new CNary(7, 0, 0);
            break;
        case 50:
            mathElem = new CNary(7, 0, 3);
            break;
        case 51:
            mathElem = new CNary(7, 1, 3);
            break;
        case 52:
            mathElem = new CNary(7, 0, 2);
            break;
        case 53:
            mathElem = new CNary(7, 1, 2);
            break;
        case 54:
            mathElem = new CNary(8, 0, 0);
            break;
        case 55:
            mathElem = new CNary(8, 0, 3);
            break;
        case 56:
            mathElem = new CNary(8, 1, 3);
            break;
        case 57:
            mathElem = new CNary(8, 0, 2);
            break;
        case 58:
            mathElem = new CNary(8, 1, 2);
            break;

        case 59:
            mathElem = new CNary(9, 0, 0);
            break;
        case 60:
            mathElem = new CNary(9, 0, 3);
            break;
        case 61:
            mathElem = new CNary(9, 1, 3);
            break;
        case 62:
            mathElem = new CNary(9, 0, 2);
            break;
        case 63:
            mathElem = new CNary(9, 1, 2);
            break;
        case 64:
            mathElem = new CNary(10, 0, 0);
            break;
        case 65:
            mathElem = new CNary(10, 0, 3);
            break;
        case 66:
            mathElem = new CNary(10, 1, 3);
            break;
        case 67:
            mathElem = new CNary(10, 0, 2);
            break;
        case 68:
            mathElem = new CNary(10, 1, 2);
            break;

        case 69:
            mathElem = new CNary(11, 0, 0);
            break;
        case 70:
            mathElem = new CNary(11, 0, 3);
            break;
        case 71:
            mathElem = new CNary(11, 1, 3);
            break;
        case 72:
            mathElem = new CNary(11, 0, 2);
            break;
        case 73:
            mathElem = new CNary(11, 1, 2);
            break;
        case 74:
            mathElem = new CNary(12, 0, 0);
            break;
        case 75:
            mathElem = new CNary(12, 0, 3);
            break;
        case 76:
            mathElem = new CNary(12, 1, 3);
            break;
        case 77:
            mathElem = new CNary(12, 0, 2);
            break;
        case 78:
            mathElem = new CNary(12, 1, 2);
            break;
        case 79:
            break;
        case 80:
            break;
        case 81:
            break;
        case 82:
            break;


        case 83:
            //mathElem = new COperatorParenthesis(5);
            mathElem = new CDelimiter(0, 4, 0, 1);  // parenthesis
            //mathElem = new CDelimiter(0, 1, 0, 2);
            break;
        case 84:
            mathElem = new CDelimiter(2, 4, 0, 1); // square brackets
            //mathElem = new CSquareBracket(5);
            break;
        case 85:
            mathElem = new CDelimiter(1, 4, 0, 1); // brackets
            //mathElem = new COperatorBracket(5);
            break;
        case 86:
            mathElem = new CDelimiter(3, 4, 0, 1); // angle brackets
            //mathElem = new COperatorAngleBracket(5);
            break;
        case 87:
            mathElem = new CDelimiter(4, 4, 0, 1); // half square brackets
            //mathElem = new CHalfSquareBracket(5);
            break;
        case 88:
            mathElem = new CDelimiter(4, 4, 2, 3); // half square brackets
            //mathElem = new CHalfSquareBracket(5, -1);
            break;
        case 89:
            mathElem = new CDelimiter(5, 4, 0, 1); // lines
            //mathElem = new COperatorLine(5);
            break;
        case 90:
            mathElem = new CDelimiter(6, 4, 0, 1); // double lines
            //mathElem = new COperatorDoubleLine(5);
            break;
        case 91:
            mathElem = new CDelimiter(2, 4, 0, 0); // square brackets
            //mathElem = new CSquareBracket(5, 0);
            break;
        case 92:
            mathElem = new CDelimiter(2, 4, 1, 1); // square brackets
            //mathElem = new CSquareBracket(5, 1);
            break;
        case 93:
            mathElem = new CDelimiter(2, 4, 1, 0); // square brackets
            //mathElem = new CSquareBracket(5, 2);
            break;
        case 94:
            mathElem = new CDelimiter(7, 4, 0, 1); // white square brackets
            //mathElem = new CWhiteSquareBracket(5);
            break;
        case 95:
            mathElem = new CSeparatorDelimiter(0, 2);
            break;
        case 96:
            mathElem = new CSeparatorDelimiter(1, 2);
            break;
        case 97:
            mathElem = new CSeparatorDelimiter(3, 2);
            break;
        case 98:
            mathElem = new CSeparatorDelimiter(3, 3);
            break;
        case 99:
            mathElem = new CDelimiter(0, 2, 0);  // parentheses
            //mathElem = new COperatorParenthesis(2);
            break;
        case 100:
            mathElem = new CDelimiter(0, 3, 1);  // parentheses
            //mathElem = new COperatorParenthesis(3);
            break;
        case 101:
            mathElem = new CDelimiter(2, 2, 0); // square bracket
            //mathElem = new CSquareBracket(2);
            break;
        case 102:
            mathElem = new CDelimiter(2, 3, 1); // square bracket
            //mathElem = new CSquareBracket(3);
            break;
        case 103:
            mathElem = new CDelimiter(1, 2, 0); // bracket
            //mathElem = new COperatorBracket(2);
            break;
        case 104:
            mathElem = new CDelimiter(1, 3, 1); // bracket
            //mathElem = new COperatorBracket(3);
            break;
        case 105:
            mathElem = new CDelimiter(3, 2, 0); // angle bracket
            //mathElem = new COperatorAngleBracket(2);
            break;
        case 106:
            mathElem = new CDelimiter(3, 3, 1); // angle bracket
            //mathElem = new COperatorAngleBracket(3);
            break;
        case 107:
            mathElem = new CDelimiter(4, 2, 0); // half square bracket
            //mathElem = new CHalfSquareBracket(2);
            break;
        case 108:
            mathElem = new CDelimiter(4, 3, 1); // half square bracket
            //mathElem = new CHalfSquareBracket(3);
            break;
        case 109:
            mathElem = new CDelimiter(4, 2, 2); // half square bracket
            //mathElem = new CHalfSquareBracket(2, -1);
            break;
        case 110:
            mathElem = new CDelimiter(4, 3, 3); // half square bracket
            //mathElem = new CHalfSquareBracket(3, -1);
            break;
        case 111:
            mathElem = new CDelimiter(5, 2, 0); // line
            //mathElem = new COperatorLine(2);
            break;
        case 112:
            mathElem = new CDelimiter(5, 3, 1); // line
            //mathElem = new COperatorLine(3);
            break;
        case 113:
            mathElem = new CDelimiter(6, 2, 0); // double line
            //mathElem = new COperatorDoubleLine(2);
            break;
        case 114:
            mathElem = new CDelimiter(6, 3, 1); // double line
            //mathElem = new COperatorDoubleLine(3);
            break;
        case 115:
            mathElem = new CDelimiter(7, 2, 0); // white square bracket
            //mathElem = new CWhiteSquareBracket(2);
            break;
        case 116:
            mathElem = new CDelimiter(7, 3, 1); // white square bracket
            //mathElem = new CWhiteSquareBracket(3);
            break;
        case 117:
            break;
        case 118:
            break;
        case 119:
            break;
        case 120:
            break;
        case 121:
            break;
        case 122:
            break;
        case 123:
            break;

        case 124:
            
            break;
        case 125:
            
            break;
        case 126:
            
            break;
        case 127:
            
            break;
        case 128:
            
            break;
        case 129:
            
            break;
        case 130:
            break;
        case 131:
            break;
        case 132:
            break;
        case 133:
            break;
        case 134:
            break;
        case 135:
            break;
        case 136:
            
            break;
        case 137:
            
            break;
        case 138:
            
            break;
        case 139:
            
            break;
        case 140:
            
            break;
        case 141:
            
            break;
        case 142:
            break;
        case 143:
            break;
        case 144:
            break;
        case 145:
            break;
        case 146:
            break;
        case 147:
            break;
        case 148:
            /*
            mathElem.addText("θ");*/
            break;
        case 149:
            break;
        case 150:
            break;

        case 151:
            mathElem = new CAccent(3);
            break;
        case 152:
            mathElem = new CAccent(4);
            break;
        case 153:
            mathElem = new CAccent(5);
            break;
        case 154:
            mathElem = new CCircumflex(-1);
            break;
        case 155:
            mathElem = new CCircumflex(1);
            break;
        case 156:
            mathElem = new CAccent(2);
            break;
        case 157:
            mathElem = new CAccent(1);
            break;
        case 158:
            mathElem = new CSign(1);
            break;
        case 159:
            mathElem = new CSign(2);
            break;
        case 160:
            mathElem = new CLine(0);
            break;
        case 161:
            mathElem = new CLine(1);
            break;
        case 162:
            //mathElem = new COperatorBracket(0);
            mathElem = new CDelimiter(1, 0, 0);  // bracket
            break;
        case 163:
            mathElem = new CDelimiter(1, 1, 2);  // bracket
            //mathElem = new COperatorBracket(1);
            break;
        case 164:
            mathElem = new GroupCharacter(1);
            break;
        case 165:
            mathElem = new GroupCharacter(-1);
            break;
        case 166:
            mathElem = new CStructCombiningArrow(1,0,0);
            //mathElem = new COperatorArrow(1,0,0);
            break;
        case 167:
            mathElem = new CStructCombiningArrow(1,0,1);
            //mathElem = new COperatorArrow(1,0,1);
            break;
        case 168:
            mathElem = new CStructCombiningArrow(2,0,0);
            //mathElem = new COperatorArrow(2,0,0);
            break;
        case 169:
            mathElem = new CStructCombiningArrow(0,0,0);
            //mathElem = new COperatorArrow(0,0,2);
            break;
        case 170:
            mathElem = new CStructCombiningArrow(0,0,1);
            //mathElem = new COperatorArrow(0,0,3);
            break;
        case 171:
            break;
        case 172:
            break;
        case 173:
            mathElem = new CBorderBox();
            break;
        case 174:
            break;
        case 175:
            break;
        case 176:
            break;

        case 177:
            mathElem = new CLogarithm();
            break;
        case 178:
            
            break;
        case 179:
            mathElem = new CMinimax(2);
            break;
        case 180:
            mathElem = new CMinimax(0);
            break;
        case 181:
            mathElem = new CMinimax(1);
            break;
        case 182:
            
            break;
        case 183:
            break;
        case 184:
            break;

        case 185:
            break;
        case 186:
            break;
        case 187:
            break;
        case 188:
            break;
        case 189:
            break;
        case 190:
            break;
        case 191:
            break;
        case 192:
            //mathElem = new CSingleArrow(0,0);
            mathElem = new CStructArrow(1, 0, 0); // left arrow  top
            break;
        case 193:
            //mathElem = new CSingleArrow(0,1);
            mathElem = new CStructArrow(1, 0, 1); // right arrow top
            break;
        case 194:
            //mathElem = new CSingleArrow(1,2);
            mathElem = new CStructArrow(1, 1, 2); // "переворачиваем", чтобы стрелка была выравнена
                                                  // left arrow  bottom
            break;
        case 195:
            //mathElem = new CSingleArrow(1,3);
            mathElem = new CStructArrow(1, 1, 3); // "переворачиваем", чтобы стрелка была выравнена
                                                  // right arrow  bottom
            break;
        case 196:
            mathElem = new CStructArrow(3, 0, 0); // double mathematical left arrow top
            //mathElem = new CDoubleArrow(0,0);
            break;
        case 197:
            //mathElem = new CDoubleArrow(0,1);
            mathElem = new CStructArrow(3, 0, 1); // double mathematical right  arrow top
            break;
        case 198:
            //mathElem = new CDoubleArrow(1,2);
            mathElem = new CStructArrow(3, 1, 2); // double mathematical left arrow bottom
            break;
        case 199:
            //mathElem = new CDoubleArrow(1,3);
            mathElem = new CStructArrow(3, 1, 3); // double mathematical right arrow bottom
            break;
        case 200:
            //mathElem = new CLeftRightArrow(0, 0);
            mathElem = new CStructArrow(2, 0, 0); // left/right arrow top
            break;
        case 201:
            //mathElem = new CLeftRightArrow(1, 2);
            mathElem = new CStructArrow(2, 1, 2); // left/right arrow bottom
            break;
        case 202:
            //mathElem = new CLR_DoubleArrow(0, 0);
            mathElem = new CStructArrow(4, 0, 0);  // left/right double mathematica arrow top
            break;
        case 203:
            //mathElem = new CLR_DoubleArrow(1, 2);
            mathElem = new CStructArrow(4, 1, 2); // left/right double mathematica arrow bottom
            break;
        case 204:
            break;
        case 205:
            break;

        case 206:
            mathElem = new CMathMatrix(1, 2);
            break;
        case 207:
            mathElem = new CMathMatrix(2, 1);
            break;
        case 208:
            mathElem = new CMathMatrix(1, 3);
            break;
        case 209:
            mathElem = new CMathMatrix(3, 1);
            break;
        case 210:
            mathElem = new CMathMatrix(2, 2);
            break;
        case 211:
            mathElem = new CMathMatrix(2, 3);
            break;
        case 212:
            mathElem = new CMathMatrix(3, 2);
            break;
        case 213:
            mathElem = new CMathMatrix(3, 3);
            break;
        case 214:
            break;
        case 215:
            break;
        case 216:
            break;
        case 217:
            break;
        case 218:
            break;
        case 219:
            break;
        case 220:
            break;
        case 221:
            break;
        case 222:
            break;
        case 223:
            break;
        case 224:
            break;
        case 225:
            break;
        case 226:
            break;
        case 227:
            break;
        case 228:
            mathElem = new CMathFunc();
            break;
        case 229:
            mathElem = new CMathMatrix(1, 1);
            break;
        case 230:
            mathElem = new CMathBase(1,1);
            break;

    }

    return mathElem;
}



function Old_CMathComposition(font, pos)
{
    this.Root = null;

    this.CurrentContent    = null;
    this.SelectContent     = null;

    this.bTemp = false;

    this.font = font;
    this.posCompos = pos;

    //this.init(font, pos);
}
Old_CMathComposition.prototype =
{
    init: function(GFont)
    {
        var g_Unif = 6*g_dKoef_pix_to_mm;
        var gps = new dist(g_Unif, g_Unif, g_Unif, g_Unif);

        this.Root = new CMathContent();
        var params =
        {
            font: GetMathFont(GFont),
            gaps: gps,
            indefSize: SizeDefault,
            reduct: 3,
            bMText: true
        };

        this.CurrentContent = this.Root;
        this.SelectContent  = this.Root;

        this.Root.init(params); //передаем объект индефикаторов (по ссылке)
        this.Root.relate(-1); // корень
        this.Root.setContent();

        this.Root.setPosition(this.posCompos);
    },
    setGaps: function(font)
    {
        var ltGap = 6*g_dKoef_pix_to_mm;
        var rGap = 6*g_dKoef_pix_to_mm;
        var tGap = 6*g_dKoef_pix_to_mm;
        var lwGap = 6*g_dKoef_pix_to_mm;

        /*g_oTextMeasurer.SetFont(font);
         var coef = g_oTextMeasurer.GetAscender() + g_oTextMeasurer.GetDescender();
         var ltGap = 2*g_dKoef_pix_to_mm;
         var rGap = 4*g_dKoef_pix_to_mm;
         var tGap = 0.1*coef;
         var lwGap = 1.0*coef;*/

        this.Root.g_mContext = new dist(ltGap, rGap, tGap, lwGap);

    },
    Draw: function(context)
    {
        if(!this.bTemp)
        {
            this.init(this.font);
            this.bTemp = true;
        }

        if(this.Root.content.length > 1)
        {
            var w_Box = this.Root.size.width;
            var h_Box = this.Root.size.height;

            context.p_color(224, 238, 224, 255); // "p_color" for stroke
            // "b_color1" for fill
            //context.b_color1(224, 238, 230, 255);

            context.drawHorLine(0, this.posCompos.y, this.posCompos.x, this.posCompos.x + w_Box, 0.2);
            context.drawHorLine(0, this.posCompos.y + h_Box, this.posCompos.x, this.posCompos.x + w_Box, 0.2);
            context.drawVerLine(0,this.posCompos.x, this.posCompos.y, this.posCompos.y + h_Box, 0.2 );
            context.drawVerLine(0,this.posCompos.x + w_Box, this.posCompos.y, this.posCompos.y + h_Box, 0.2 );
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
    Remove: function()
    {
        var result = false;

        this.ClearSelect();

        var removal = this.SelectContent.remove();
        this.CurrentContent = removal.CurrContent;
        this.SelectContent  = removal.SelectContent;

        this.CurrentContent.setPlaceholderAfterRemove(); // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент

        if( removal.state.bRecPosition )
        {
            this.CurrentContent.ResizeReverse();
            this.Root.setPosition(this.posCompos);

            result = true;
        }

        this.CheckTarget();

        return result;
    },

    //// edit ////
    AddLetter: function(code)
    {
        this.ClearSelect();

        this.SelectContent.add(code);
        this.SelectContent.ResizeReverse();
        this.Root.setPosition(this.posCompos);

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    AddMathComponent: function(indef)
    {
        this.ClearSelect();

        this.SelectContent.add_mathComponent(indef);
        this.SelectContent.ResizeReverse();
        this.Root.setPosition(this.posCompos);

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    ////

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
    StartCursor: function()
    {
        editor.WordControl.m_oLogicDocument.DrawingDocument.TargetStart();
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
    ClearSelect: function()
    {
        if(this.SelectContent.selectUse())
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectClear();
            editor.WordControl.m_oLogicDocument.DrawingDocument.SelectEnabled(false);
        }
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
    /*TestFont: function(font)
     {
     this.CurrentContent.TestFont(font);
     },*/
    ////


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

    //// finished equation ////

    AddMathEquation: function (ind)
    {
        this.ClearSelect();

        switch(ind)
        {
            case 4:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("dy");

                denominator = fraction.getDenominator();
                denominator.addText("dx");

                fraction.ResizeReverse_2();
                break;
            case 5:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("Δy");

                denominator = fraction.getDenominator();
                denominator.addText("Δx");

                fraction.ResizeReverse_2();
                break;
            case 6:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("∂y");

                denominator = fraction.getDenominator();
                denominator.addText("∂x");

                fraction.ResizeReverse_2();

                break;
            case 7:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("δy");

                denominator = fraction.getDenominator();
                denominator.addText("δx");

                fraction.ResizeReverse_2();

                break;
            case 8:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();
                numerator.addText("π");

                denominator = fraction.getDenominator();
                denominator.addText("2");

                fraction.ResizeReverse_2();

                break;
            case 13:
                degree = this.SelectContent.addMathComponent_2(10);
                base = degree.getBase();
                base.addText("x");
                iterator = degree.getIterator();

                degr_2 = iterator.addMathComponent_2(9);
                base_2 = degr_2.getBase();
                base_2.addText("y");

                iter_2 = degr_2.getIterator();
                iter_2.addText("2");

                degr_2.ResizeReverse_2();
                degree.ResizeReverse_2();

                break;
            case 14:
                degree = this.SelectContent.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("e");
                iterator = degree.getIterator();
                iterator.addText("-iωt");

                degree.ResizeReverse_2();
                break;
            case 15:
                degree = this.SelectContent.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("x");
                iterator = degree.getIterator();
                iterator.addText("2");

                degree.ResizeReverse_2();
                break;
            case 16:
                degree = this.SelectContent.addMathComponent_2(12);
                base = degree.getBase();
                base.addText("Y");
                iterator = degree.getUpperIterator();
                iterator.addText("n");

                iterator = degree.getLowerIterator();
                iterator.addText("1");

                degree.ResizeReverse_2();
                break;
            case 19:
                radical = this.SelectContent.addMathComponent_2(18);
                degr = radical.getDegree();
                degr.addText("2");
                radical.ResizeReverse_2();
                break;
            case 20:
                radical = this.SelectContent.addMathComponent_2(18);
                degr = radical.getDegree();
                degr.addText("3");
                radical.ResizeReverse_2();
                break;
            case 21:
                fraction = this.SelectContent.addMathComponent_2(0);
                numerator = fraction.getNumerator();

                numerator.addText("-b±");
                radical = numerator.addMathComponent_2(17);
                baseRad = radical.getBase();

                degree = baseRad.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("b");
                iter = degree.getIterator();
                iter.addText("2");

                baseRad.addText("-4ac");

                denominator = fraction.getDenominator();
                denominator.addText("2a");

                fraction.ResizeReverse_2();

                break;
            case 22:
                radical = this.SelectContent.addMathComponent_2(17);
                baseRad = radical.getBase();

                degree = baseRad.addMathComponent_2(9);
                base = degree.getBase();
                base.addText("a");
                iter = degree.getIterator();
                iter.addText("2");

                baseRad.addText("+");

                degree2 = baseRad.addMathComponent_2(9);
                base2 = degree2.getBase();
                base2.addText("b");
                iter2 = degree2.getIterator();
                iter2.addText("2");

                radical.ResizeReverse_2();
                break;
            case 41:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dx");
                mathBase.ResizeReverse_2();
                break;
            case 42:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dy");
                mathBase.ResizeReverse_2();
                break;
            case 43:
                mathBase = this.SelectContent.addMathComponent_2(230);
                elem1 = mathBase.getElement(0,0);
                elem1.addText("dθ");
                mathBase.ResizeReverse_2();
                break;
            case 79:
                nary = this.SelectContent.addMathComponent_2(47);

                iter = nary.getLowerIterator();
                iter.addText("k");

                base = nary.getBase();
                delimiter = base.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                matrix = delimBase.addMathComponent_2(207);

                matrElem = matrix.getElement(0, 0);
                matrElem.addText("n");

                matrElem2 = matrix.getElement(1, 0);
                matrElem2.addText("k");

                nary.ResizeReverse_2();
                break;
            case 80:
                nary = this.SelectContent.addMathComponent_2(45);

                iter = nary.getUpperIterator();
                iter.addText("n");

                iter = nary.getLowerIterator();
                iter.addText("i=0");

                nary.ResizeReverse_2();
                break;
            case 82:
                nary = this.SelectContent.addMathComponent_2(60);
                iterUp = nary.getUpperIterator();
                iterUp.addText("m");

                iterLow = nary.getLowerIterator();
                iterLow.addText("n=1");

                base = nary.getBase();
                delimiter = base.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                degr = delimBase.addMathComponent_2(10);
                degrBase = degr.getBase();
                degrBase.addText("X");

                degrIter = degr.getIterator();
                degrIter.addText("n");

                delimBase.addText("∩");

                degr2 = delimBase.addMathComponent_2(10);
                degrBase2 = degr2.getBase();
                degrBase2.addText("Y");

                degrIter2 = degr2.getIterator();
                degrIter2.addText("n");

                nary.ResizeReverse_2();
                break;
            case 117:
                delimiter = this.SelectContent.addMathComponent_2(103);
                delimBase = delimiter.getBase();
                delimBase.addMathComponent_2(207);
                delimiter.ResizeReverse_2();
                break;
            case 118:
                delimiter = this.SelectContent.addMathComponent_2(103);
                delimBase = delimiter.getBase();
                delimBase.addMathComponent_2(209);
                delimiter.ResizeReverse_2();
                break;
            case 119:
                fract = this.SelectContent.addMathComponent_2(0);
                fract.hideBar(true);
                fract.ResizeReverse_2();
                break;
            case 120:
                delimiter = this.SelectContent.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);
                delimiter.ResizeReverse_2();
                break;
            case 121:
                break;
            case 122:
                delimiter = this.SelectContent.addMathComponent_2(83);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);

                num = fract.getNumerator();
                num.addText("n");

                den = fract.getDenominator();
                den.addText("k");

                delimiter.ResizeReverse_2();
                break;
            case 123:
                delimiter = this.SelectContent.addMathComponent_2(86);
                delimBase = delimiter.getBase();
                fract = delimBase.addMathComponent_2(0);
                fract.hideBar(true);

                num = fract.getNumerator();
                num.addText("n");

                den = fract.getDenominator();
                den.addText("k");

                delimiter.ResizeReverse_2();
                break;
            case 124:
                this.SetTrigonometricFunc("sin");
                break;
            case 125:
                this.SetTrigonometricFunc("cos");
                break;
            case 126:
                this.SetTrigonometricFunc("tan");
                break;
            case 127:
                this.SetTrigonometricFunc("csc");
                break;
            case 128:
                this.SetTrigonometricFunc("sec");
                break;
            case 129:
                this.SetTrigonometricFunc("cot");
                break;

            case 130:
                this.SetDegrTrigFunc("sin");
                break;
            case 131:
                this.SetDegrTrigFunc("cos");
                break;
            case 132:
                this.SetDegrTrigFunc("tan");
                break;
            case 133:
                this.SetDegrTrigFunc("csc");
                break;
            case 134:
                this.SetDegrTrigFunc("sec");
                break;
            case 135:
                this.SetDegrTrigFunc("cot");
                break;

            case 136:
                this.SetTrigonometricFunc("sinh");
                break;
            case 137:
                this.SetTrigonometricFunc("cosh");
                break;
            case 138:
                this.SetTrigonometricFunc("tanh");
                break;
            case 139:
                this.SetTrigonometricFunc("csch");
                break;
            case 140:
                this.SetTrigonometricFunc("sech");
                break;
            case 141:
                this.SetTrigonometricFunc("coth");
                break;

            case 142:
                this.SetDegrTrigFunc("sinh");
                break;
            case 143:
                this.SetDegrTrigFunc("cosh");
                break;
            case 144:
                this.SetDegrTrigFunc("tanh");
                break;
            case 145:
                this.SetDegrTrigFunc("csch");
                break;
            case 146:
                this.SetDegrTrigFunc("sech");
                break;
            case 147:
                this.SetDegrTrigFunc("coth");
                break;
            case 148:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("sin");

                arg = mathFunc.getArgument();
                arg.addText("θ");

                mathFunc.ResizeReverse_2();
                break;
            case 149:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("cos");

                arg = mathFunc.getArgument();
                arg.addText("2x");

                mathFunc.ResizeReverse_2();
                break;
            case 150:
                mathFunc = this.SelectContent.addMathComponent_2(228);
                func = mathFunc.getFunction();
                func.addText("tan");

                arg = mathFunc.getArgument();
                arg.addText("θ");

                this.SelectContent.addText("=");

                fract = this.SelectContent.addMathComponent_2(0);
                numer = fract.getNumerator();

                mathFunc2 =  numer.addMathComponent_2(228);
                func2 = mathFunc2.getFunction();
                func2.addText("sin");

                arg2 = mathFunc2.getArgument();
                arg2.addText("θ");

                den = fract.getDenominator();

                mathFunc3 =  den.addMathComponent_2(228);
                func3 = mathFunc3.getFunction();
                func3.addText("cos");

                arg3 = mathFunc3.getArgument();
                arg3.addText("θ");

                mathFunc.ResizeReverse_2();
                fract.ResizeReverse_2();

                break;
            case 174:
                box = this.SelectContent.addMathComponent_2(173);
                borderBox = box.getElement();

                aDegr = borderBox.addMathComponent_2(9);

                aBase = aDegr.getBase();
                aBase.addText("a");
                aIter = aDegr.getIterator();
                aIter.addText("2");

                borderBox.addText("=");
                bDegr = borderBox.addMathComponent_2(9);

                bBase = bDegr.getBase();
                bBase.addText("b");
                bIter = bDegr.getIterator();
                bIter.addText("2");

                borderBox.addText("+");
                cDegr = borderBox.addMathComponent_2(9);

                cBase = cDegr.getBase();
                cBase.addText("c");
                cIter = cDegr.getIterator();
                cIter.addText("2");

                box.ResizeReverse_2();
                break;
            case 178:
                this.SetTrigonometricFunc("log");
                break;
            case 182:
                this.SetTrigonometricFunc("ln");
                break;
            case 183:
                lim = this.SelectContent.addMathComponent_2(179);
                iter = lim.getIterator();
                iter.addText("n→∞");

                base = lim.getArgument();
                degree = base.addMathComponent_2(9);
                iter2 = degree.getIterator();
                iter2.addText("n");
                base2 = degree.getBase();

                delim = base2.addMathComponent_2(83);
                delimBase = delim.getBase();
                delimBase.addText("1+");

                fract = delimBase.addMathComponent_2(0);
                num = fract.getNumerator();
                num.addText("1");
                den = fract.getDenominator();
                den.addText("n");

                lim.ResizeReverse_2();
                break;
            case 184:
                maximum = this.SelectContent.addMathComponent_2(181);
                iter = maximum.getIterator();
                iter.addText("0≤x≤1");

                base = maximum.getArgument();
                base.addText("x");

                degree = base.addMathComponent_2(9);
                base2 = degree.getBase();
                base2.addText("e");

                iter2 = degree.getIterator();
                iter2.addText("-");
                degree3 = iter2.addMathComponent_2(9);
                base3 = degree3.getBase();
                base3.addText("x");

                iter3 = degree3.getIterator();
                iter3.addText("2");


                maximum.ResizeReverse_2();
                break;
            case 185:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("∶=");
                matr.ResizeReverse_2();
                break;
            case 186:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("==");
                matr.ResizeReverse_2();
                break;
            case 187:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("+=");
                matr.ResizeReverse_2();
                break;
            case 188:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("-=");
                matr.ResizeReverse_2();
                break;
            case 189:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≝");
                matr.ResizeReverse_2();
                break;
            case 190:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≞");
                matr.ResizeReverse_2();
                break;
            case 191:
                matr = this.SelectContent.addMathComponent_2(229);
                elemMatr = matr.getElement(0,0);
                elemMatr.addText("≜");
                matr.ResizeReverse_2();
                break;
            case 204:
                arrow =  this.SelectContent.addMathComponent_2(195);
                base = arrow.getBase();
                base.addText("yields");
                arrow.ResizeReverse_2();
                break;
            case 205:
                arrow =  this.SelectContent.addMathComponent_2(195);
                base = arrow.getBase();
                base.addText("∆");
                arrow.ResizeReverse_2();
                break;
            case 214:
                this.SelectContent.addText("⋯");
                break;
            case 215:
                this.SelectContent.addText("…");
                break;
            case 216:
                this.SelectContent.addText("⋮");
                break;
            case 217:
                this.SelectContent.addText("⋱");
                break;
                break;
            case 218:
                matr = this.SelectContent.addMathComponent_2(210);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem2 = matr.getElement(0,1);
                elem2.addText("0");

                elem3 = matr.getElement(1,0);
                elem3.addText("0");

                elem4 = matr.getElement(1,1);
                elem4.addText("1");

                matr.ResizeReverse_2();
                break;
            case 219:
                matr = this.SelectContent.addMathComponent_2(210);
                matr.hidePlaceholder(true);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem4 = matr.getElement(1,1);
                elem4.addText("1");
                matr.ResizeReverse_2();
                break;
            case 220:
                matr = this.SelectContent.addMathComponent_2(213);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem2 = matr.getElement(0,1);
                elem2.addText("0");

                elem3 = matr.getElement(0,2);
                elem3.addText("0");

                elem4 = matr.getElement(1,0);
                elem4.addText("0");

                elem5 = matr.getElement(1,1);
                elem5.addText("1");

                elem6 = matr.getElement(1,2);
                elem6.addText("0");

                elem7 = matr.getElement(2,0);
                elem7.addText("0");

                elem8 = matr.getElement(2,1);
                elem8.addText("0");

                elem9 = matr.getElement(2,2);
                elem9.addText("1");

                matr.ResizeReverse_2();
                break;
            case 221:
                matr = this.SelectContent.addMathComponent_2(213);
                matr.hidePlaceholder(true);
                elem1 = matr.getElement(0,0);
                elem1.addText("1");

                elem5 = matr.getElement(1,1);
                elem5.addText("1");

                elem9 = matr.getElement(2,2);
                elem9.addText("1");

                matr.ResizeReverse_2();
                break;
            case 222:
                delimiter = this.SelectContent.addMathComponent_2(83);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 223:
                delimiter = this.SelectContent.addMathComponent_2(84);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 224:
                delimiter = this.SelectContent.addMathComponent_2(89);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 225:
                delimiter = this.SelectContent.addMathComponent_2(90);
                base = delimiter.getBase();
                base.addMathComponent_2(210);

                delimiter.ResizeReverse_2();
                break;
            case 226:
                delimiter = this.SelectContent.addMathComponent_2(83);

                base = delimiter.getBase();
                matr = base.addMathComponent_2(213);

                elem2 = matr.getElement(0,1);
                elem2.addText("⋯");

                elem4 = matr.getElement(1,0);
                elem4.addText("⋮");

                elem5 = matr.getElement(1,1);
                elem5.addText("⋱");

                elem6 = matr.getElement(1,2);
                elem6.addText("⋮");

                elem8 = matr.getElement(2,1);
                elem8.addText("⋯");


                delimiter.ResizeReverse_2();
                break;
            case 227:
                delimiter = this.SelectContent.addMathComponent_2(84);

                base = delimiter.getBase();
                matr = base.addMathComponent_2(213);

                elem2 = matr.getElement(0,1);
                elem2.addText("⋯");

                elem4 = matr.getElement(1,0);
                elem4.addText("⋮");

                elem5 = matr.getElement(1,1);
                elem5.addText("⋱");

                elem6 = matr.getElement(1,2);
                elem6.addText("⋮");

                elem8 = matr.getElement(2,1);
                elem8.addText("⋯");


                delimiter.ResizeReverse_2();
                break;
            default:
                this.SelectContent.add_mathComponent(ind);
                break;

        }

        this.SelectContent.ResizeReverse();
        this.Root.setPosition(this.posCompos);

        this.CurrentContent = this.SelectContent;
        this.CurrentContent.update_Cursor();

        this.ShowCursor();
    },
    SetDegrTrigFunc: function(txt)
    {
        mathFunc = this.SelectContent.addMathComponent_2(228);
        //setColumnGapRule(3, 120);
        func = mathFunc.getFunction();
        degr = func.addMathComponent_2(9);

        base = degr.getBase();
        base.bMText = false;
        base.addText(txt);
        iter = degr.getIterator();
        iter.addText("-1");

        mathFunc.ResizeReverse_2();
    },
    SetTrigonometricFunc: function(txt)
    {
        mathFunc = this.SelectContent.addMathComponent_2(228);
        func = mathFunc.getFunction();
        func.addText(txt);

        mathFunc.ResizeReverse_2();
    }

    ////
}
