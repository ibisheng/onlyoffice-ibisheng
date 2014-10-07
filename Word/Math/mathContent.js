"use strict";

/// TODO

//  1.  Пересмотреть схему для findDisposition(base.js), т.к. если нажали за границами элемента, то происходит селект, т.к. теперь на mouseDown и mouseDown одни и те же функции
//  2.  поправить центр для delimiters (когда оператор текст)
//  3.  поправить accent расположение глифов в случае небольшого размера шрифта (н-р, 14)
//  5.  сделать gaps для мат. объектов, +, - в зависимости от расположения в контенте
//  6.  Размер разделительной черты для линейной дроби ограничить также как и для наклонной дроби
//  7.  баг с отрисовкой кругового интеграла
//  8.  cursor_Up, cursor_Down (+ c зажитым shift)
//  9.  Merge textPrp и mathTextPrp (bold, italic)
//  10. Поправить баги для CAccent с точками : смещение, когда идут подряд с одной точкой, двумя и тремя они перекрываются
//  11. Для управляющих символов запрашивать не getCtrPrp, getPrpToControlLetter (реализована, нужно только протащить для всех управляющих элементов)
//  12. объединение формул на remove и add
//  13. Для N-арных операторов в случае со степенью : итераторы занимают не 2/3 от основание, а примерно половину (когда один итератор сверху или снизу)
//  14. Для дробей, n-арных операторов и пр. считать расстояние исходя из shiftCenter
//  15. Для числителя/знаменателя сделать меньшие расстояния для внутренних дробей, меньшие по размеру n-арные операторы, значок радикала


//  TODO Refactoring
//  1. CAccent ~> COperator
//  2. COperator : объединить все классы связанные с отрисовкой и пересчетом операторов в один


/// TODO

// 1. Посмотреть стрелки и прочее для delimiters (которые используются для accent), при необходимости привести к одному типу

// 3. Проверить что будет, если какие-то настройки убрать/добавить из ctrPrp, влияют ли они на отрисовку управляющих элементов (например, Italic, Bold)
// 4. Протестировать n-арные операторы, когда добавляется текст вместо оператора (mouseDown не работает, выравнено как alignTop)

var historyitem_Math_AddItem                   =  1; // Добавляем элемент
var historyitem_Math_RemoveItem                =  2; // Удаляем элемент
var historyitem_Math_CtrPrpFSize               =  3; // CtrPrp


function CRPI()
{
    //this.UpdateMathPr    = true;
    this.NeedResize      = true;
    this.bInsideFraction = false;
    this.bInline         = false;
    this.bChangeInline   = false;
    this.bNaryInline     = false; /*для CDegreeSupSub внутри N-арного оператора, этот флаг необходим, чтобы итераторы максимально близко друг к другу расположить*/
    this.bEqqArray       = false; /*для амперсанда*/
    this.bMathFunc       = false;

}
CRPI.prototype.Copy = function()
{
    var RPI = new CRPI();

    RPI.bInline         = this.bInline;
    RPI.bInsideFraction = this.bInsideFraction;
    RPI.bChangeInline   = this.bChangeInline;
    RPI.bNaryInline     = this.bNaryInline;
    RPI.bEqqArray       = this.bEqqArray;
    RPI.bMathFunc       = this.bMathFunc;

    return RPI;
}


function CMathPointInfo()
{
    this.x    = 0;
    this.y    = 0;

    this.bEven      = true;
    this.CurrPoint  = 0;

    this.InfoPoints = {};
}
CMathPointInfo.prototype.SetInfoPoints = function(InfoPoints)
{
    this.InfoPoints.GWidths       = InfoPoints.GWidths;
    this.InfoPoints.GPoints       = InfoPoints.GPoints;
    this.InfoPoints.ContentPoints = InfoPoints.ContentPoints.Widths;
    this.InfoPoints.GMaxDimWidths = InfoPoints.GMaxDimWidths;
}
CMathPointInfo.prototype.UpdateX = function(value)
{
    this.x += value;
}
CMathPointInfo.prototype.NextAlignRange = function()
{
    if(this.bEven)
        this.bEven = false;
    else
    {
        this.CurrPoint++;
        this.bEven = true;
    }
}
CMathPointInfo.prototype.ApplyAlign = function()
{
    this.x += this.GetAlign();
}
CMathPointInfo.prototype.GetAlign = function()
{
    var align = 0;

    if(this.bEven)
    {
        var alignEven, alignGeneral, alignOdd;

        var Len   = this.InfoPoints.ContentPoints.length,
            Point = this.InfoPoints.ContentPoints[this.CurrPoint];

        var GWidth = this.InfoPoints.GWidths[this.CurrPoint],
            GPoint = this.InfoPoints.GPoints[this.CurrPoint];

        if(this.CurrPoint == Len - 1 && Point.odd == -1) // то есть последняя точка четная, выравнивание по центру
        {
            var GMaxDimWidth = this.InfoPoints.GMaxDimWidths[this.CurrPoint];

            alignGeneral = (GMaxDimWidth - Point.even)/2;
            alignEven = 0;
        }
        else
        {
            alignGeneral = (GWidth - GPoint.even - GPoint.odd)/2;
            alignEven = GPoint.even - Point.even;
        }

        if(this.CurrPoint > 0)
        {
            var PrevGenPoint = this.InfoPoints.GPoints[this.CurrPoint-1],
                PrevGenWidth = this.InfoPoints.GWidths[this.CurrPoint-1],
                PrevPoint    = this.InfoPoints.ContentPoints[this.CurrPoint-1];

            var alignPrevGen = (PrevGenWidth - PrevGenPoint.even - PrevGenPoint.odd)/2;
            alignOdd = alignPrevGen +  PrevGenPoint.odd - PrevPoint.odd;
        }
        else
            alignOdd = 0;

        align = alignGeneral + alignEven + alignOdd;
    }

    return align;
}

function CInfoPoints()
{
    this.GWidths       = null;
    this.GPoints       = null;
    this.GMaxDimWidths = null;
    this.ContentPoints = new AmperWidths();
}
CInfoPoints.prototype.SetDefault = function()
{
    this.GWidths       = null;
    this.GPoints       = null;
    this.GMaxDimWidths = null;
    this.ContentPoints.SetDefault();
}


function CMathPosition()
{
    this.x  = 0;
    this.y  = 0;
}


function AmperWidths()
{
    this.bEven     = true; // является ли текущая точка нечетной
    this.Widths    = [];
}
AmperWidths.prototype.UpdatePoint = function(value)
{
    var len = this.Widths.length;

    if(len == 0)
    {
        // дефолтное значение bEven true, для случая если первый элемент в контенте будет Ampersand
        var NewPoint = new CMathPoint();
        NewPoint.even = value;
        this.Widths.push(NewPoint);
        this.bEven = true;
    }
    else
    {
        if(this.bEven)
            this.Widths[len-1].even += value;
        else
            this.Widths[len-1].odd += value;
    }

}
AmperWidths.prototype.AddNewAlignRange = function()
{
    var len = this.Widths.length;

    if(!this.bEven || len == 0)
    {
        var NewPoint = new CMathPoint();
        NewPoint.even = 0;
        this.Widths.push(NewPoint);
    }

    if(this.bEven)
    {
        len = this.Widths.length;
        this.Widths[len-1].odd = 0;
    }


    this.bEven = !this.bEven;

}
AmperWidths.prototype.SetDefault = function()
{
    this.bEven         = true;
    this.Widths.length = 0;
}



function CGaps(oSign, oEqual, oZeroOper, oLett)
{
    this.sign = oSign;
    this.equal = oEqual;
    this.zeroOper = oZeroOper;
    this.letters = oLett;
}

function CCoeffGaps()
{
    this.Sign =
    {
        left:   new CGaps(0.52, 0.26, 0, 0.52),
        right:  new CGaps(0.49, 0, 0, 0.49)
    };

    this.Mult =
    {
        left:   new CGaps(0, 0, 0, 0.46),
        right:  new CGaps(0, 0, 0, 0.49)
    };

    /*this.Equal =
    {
        left:   new CGaps(0.35, 0, 0, 0.7),
        right:  new CGaps(0.25, 0, 0, 0.5)
    };*/

    this.Equal =
    {
        left:   new CGaps(0, 0, 0, 0.7),
        right:  new CGaps(0, 0, 0, 0.5)
    };

    this.Default =
    {
        left:   new CGaps(0, 0, 0, 0),
        right:  new CGaps(0, 0, 0, 0)
    };
}
CCoeffGaps.prototype =
{
    getCoeff: function(codeCurr, codeLR , direct) // obj - либо codeChar, либо мат объект
    {
        var operator = null;

        if(this.checkEqualSign(codeCurr))
            operator = this.Equal;
        else if(this.checkOperSign(codeCurr))
            operator = this.Sign;
        else if(codeCurr == 0x2A)
            operator = this.Mult;
        else
            operator = this.Default;

        var part = direct == -1 ? operator.left : operator.right;

        var coeff = 0;
        if(codeLR == -1) // мат объект
            coeff = part.letters;
        else if(this.checkOperSign(codeLR))
            coeff = part.sign;
        else if(this.checkEqualSign(codeLR))
            coeff = part.equal;
        else if(this.checkZeroSign(codeLR, direct))
            coeff = part.zeroOper;
        else
            coeff = part.letters;

        return coeff;
    },
    checkOperSign: function(code) // "+", "-", "±"
    {
        var PLUS       = 0x2B,
            MINUS      = 0x2D,
            PLUS_MINUS = 0xB1;

        return code == PLUS || code == MINUS || code == PLUS_MINUS;
    },
    checkEqualSign: function(code)
    {
        var COMPARE       = code == 0x3C || code == 0x3E; // LESS, GREATER
        var ARROWS        = (code >= 0x2190 && code <= 0x21B3) || (code == 0x21B6) || (code == 0x21B7) || (code >= 0x21BA && code <= 0x21E9) || (code >=0x21F4 && code <= 0x21FF);
        var INTERSECTION  = code >= 0x2223 && code <= 0x222A;
        var EQUALS        = (code >= 0x2234 && code <= 0x22BD) || (code >= 0x22C4 && code <= 0x22FF);
        var ARR_FISHES    = (code >= 0x27DA && code <= 0x27E5) || (code >= 0x27EC && code <= 0x297F);
        var TRIANGLE_SYMB = code >= 0x29CE && code <= 0x29D7;
        var OTH_SYMB      = code == 0x29DF || (code >= 0x29E1 && code <= 0x29E7) || (code >= 0x29F4 && code <= 0x29F8) || (code >= 0x2A22 && code <= 0x2AF0) || (code >= 0x2AF2 && code <= 0x2AFB) || code == 0x2AFD || code == 0x2AFE;


        return COMPARE || ARROWS || INTERSECTION || EQUALS || ARR_FISHES || TRIANGLE_SYMB || OTH_SYMB;
    },
    checkZeroSign: function(code, direct) // "*", "/", "\"
    {
        var MULT     = 0x2A,
            DIVISION = 0x2F,
            B_SLASH  = 0x5C;

        var bOper = code == MULT || code == DIVISION || code == B_SLASH;
        var bLeftBracket = direct == -1 && (code == 0x28 || code == 0x5B || code == 0x7B);
        var bRightBracket = direct == 1 && (code == 0x29 || code == 0x5D || code == 0x7D);


        return bOper || bLeftBracket || bRightBracket;
    }
}

var COEFF_GAPS = new CCoeffGaps();

function CMathArgSize()
{
    this.value       = 0;
}
CMathArgSize.prototype =
{
    decrease: function()
    {
        if( this.value > -2 )
            this.value--;
    },
    increase: function()
    {
        if(this.value < 2)
            this.value++;
    },
    Set: function(ArgSize)
    {
        this.value = ArgSize.value;
    },
    SetValue: function(val)
    {
        if(val < - 2)
            this.value = -2;
        else if(val > 2)
            this.value = 2;
        else
            this.value = val;

    },
    Copy: function()
    {
        var ArgSize = new CMathArgSize();
        ArgSize.value = this.value;

        return ArgSize;
    },
    Merge: function(ArgSize)
    {
        this.SetValue(this.value + ArgSize.value);
    }
}

function CMathGapsInfo(oMeasure, Parent, argSize)
{
    this.measure = oMeasure;

    this.Parent   = Parent;
    this.ParaMath = this.Parent.ParaMath; // для Para_Run

    this.argSize = argSize; // argSize выставляем один раз для всего контента
    this.leftRunPrp = null; // Run_Prp левого элемента
    this.currRunPrp = null;

    this.Left = null;       // элемент слева
    this.Current = null;    // текущий элемент

}
CMathGapsInfo.prototype =
{
    /*old_checkGapsSign: function(oMeasure, posCurr)
    {
        var left = null,
            right = null;
        var curr = this.content[posCurr].value;

        if(this.argSize < 0)
        {
            // выставим нулевые gaps для случая, если при копировании/вставки часть контента добавили в итератор
            this.content[posCurr].gaps.left  = 0;
            this.content[posCurr].gaps.right = 0;
        }
        else
        {
            var EQUAL   = 0x3D,
                PLUS    = 0x2B,
                MINUS   = 0x2212,
                MULT    = 0x2217,
                LESS    = 0x3C,
                GREATER = 0x3E;


            var t = posCurr - 1;
            while( t > 0 )
            {
                if(this.content[t].value.typeObj == MATH_TEXT || this.content[t].value.typeObj == MATH_COMP)
                {
                    left = this.content[t].value;
                    break;
                }
                t--;
            }

            t = posCurr + 1;
            while( t < this.content.length )
            {
                if(this.content[t].value.typeObj == MATH_TEXT || this.content[t].value.typeObj == MATH_COMP)
                {
                    right = this.content[t].value;
                    break;
                }
                t++;
            }

            var coeffLeft = 0,
                coeffRight = 0;

            var bLeft  = left !== null,
                bRight = right !== null;


            var bLeftComp  = bLeft  ? left.typeObj == MATH_COMP : false,
                bRightComp = bRight ? right.typeObj == MATH_COMP : false,
                bLeftText  = bLeft  ? left.typeObj == MATH_TEXT : false,
                bRightText = bRight ? right.typeObj == MATH_TEXT : false;

            var currCode  = curr.typeObj == MATH_TEXT ? curr.getCodeChr() : null,
                leftCode  = bLeftText ? left.getCodeChr() : null,
                rightCode = bRightText ? right.getCodeChr() : null;

            var gapLeftComp = 0,
                gapRightComp = 0;

            if(bLeftComp)
                gapLeftComp = this.getGapsMComp(left).right;

            if(bRightComp)
                gapRightComp = this.getGapsMComp(right).left;

            if(curr.typeObj == MATH_TEXT)
            {
                var bSign = false;

                if(this.checkOperSign(currCode)) // plus, minus, greater, less
                {
                    bSign = true;

                    if(bLeft)
                    {
                        if(this.checkZeroSign(leftCode))
                            coeffLeft = 0;
                        else if(leftCode == EQUAL)
                            coeffLeft = 0.26;
                        else
                            coeffLeft = 0.52;
                    }

                    if(bRight)
                    {
                        var bZero = this.checkZeroSign(rightCode);
                        if(rightCode == EQUAL || bZero)
                            coeffRight = 0;
                        else
                            coeffRight = 0.49;
                    }
                }
                else if(currCode === MULT) // multiplication
                {
                    bSign = true;

                    if(bLeft)
                    {
                        var bZeroLeft = this.checkZeroSign(leftCode),
                            bOperLeft = this.checkOperSign(leftCode);

                        if(leftCode == EQUAL || bOperLeft || bZeroLeft)
                            coeffLeft = 0;
                        else if(bLeft)
                            coeffLeft = 0.46;
                    }

                    if(bRight)
                    {
                        var bZeroRight = this.checkZeroSign(rightCode),
                            bOperRight = this.checkOperSign(rightCode);

                        if(rightCode == EQUAL || bOperRight || bZeroRight)
                            coeffRight = 0;
                        else if(bRight)
                            coeffRight = 0.49;
                    }

                }
                else if(currCode === EQUAL) // equal
                {
                    bSign = true;

                    if(bLeft)
                    {
                        var bZero = this.checkZeroSign(leftCode);
                        if(leftCode == EQUAL || bZero)
                            coeffLeft = 0;
                        else if(this.checkOperSign(leftCode))
                            coeffLeft = 0.35;
                        else
                            coeffLeft = 0.7;
                    }

                    if(bRight)
                    {
                        var bZero = this.checkZeroSign(rightCode);
                        if(rightCode == EQUAL || bZero)
                            coeffRight = 0;
                        else if(this.checkOperSign(rightCode))
                            coeffRight = 0.25;
                        else
                            coeffRight = 0.5;
                    }
                }

                if(bSign && bLeftComp)
                    coeffLeft = coeffLeft - gapLeftComp;

                if(bSign && bRightComp)
                    coeffRight = coeffRight - gapRightComp;

                coeffLeft = Math.ceil(coeffLeft*10)/10;
                coeffRight = Math.ceil(coeffRight*10)/10;

            }
            else if(curr.typeObj == MATH_COMP)
            {
                var currGaps = this.getGapsMComp(curr);
                if(bLeft)
                {
                    coeffLeft =  currGaps.left;

                    if(bLeftComp)
                    {
                        if(gapLeftComp/2 < coeffLeft)
                            coeffLeft = gapLeftComp/2;
                    }
                }
                if(bRight)
                {
                    coeffRight = currGaps.right;

                    if(bRightComp)
                    {
                        if(coeffRight/2 > gapRightComp )
                            coeffRight -= gapRightComp;
                        else
                            coeffRight /=2;
                    }
                }
            }

            if(bLeftText)
            {
                if(leftCode == 0x28 || leftCode == 0x5B || leftCode == 0x7B)
                    coeffLeft = 0;
            }

            if(bRightText)
            {
                if(rightCode == 0x29 || rightCode == 0x5D || rightCode == 0x7D)
                    coeffRight = 0;
            }

            var runPrp = this.getRunPrp(posCurr);
            var oWPrp = runPrp.getMergedWPrp();
            this.applyArgSize(oWPrp);

            var gapSign = 0.1513*oWPrp.FontSize;

            this.content[posCurr].gaps.left  = Math.ceil(coeffLeft*gapSign*10)/10; // если ни один случай не выполнился, выставляем "нулевые" gaps (default): необходимо, если что-то удалили и объект стал первый или последним в контенте
            this.content[posCurr].gaps.right = Math.ceil(coeffRight*gapSign*10)/10;

            *//*if(this.bRoot)
             {
             if(bSign)
             {
             var code = this.content[posCurr].value.getCodeChr();
             console.log("  " + String.fromCharCode(code));
             }
             else if(curr.typeObj == MATH_COMP)
             {
             console.log(curr.constructor.name + " :")
             }

             if(bSign || curr.typeObj == MATH_COMP)
             {
             console.log("coeff left  " + coeffLeft + ",  coeff right  " + coeffRight );
             console.log("gap left :  " + this.content[posCurr].gaps.left + ",  gap right :  " + this.content[posCurr].gaps.right);
             console.log("");
             }
             }*//*
        }

    },*/
    setGaps: function()
    {
        if(this.argSize < 0)
        {
            this.Current.GapLeft = 0;

            if(this.Left !== null)
                this.Left.GapRight = 0;
        }
        else
        {
            var leftCoeff = 0,  /// for Current Object
                rightCoeff = 0; /// for Left Object

            var leftCode;

            if(this.Current.Type == para_Math_Text)
            {
                var currCode = this.Current.getCodeChr();

                if(this.Left !== null)
                {
                    if(this.Left.Type == para_Math_Composition)
                    {
                        rightCoeff = this.getGapsMComp(this.Left, 1);
                        leftCoeff = COEFF_GAPS.getCoeff(currCode, -1, -1);

                        if(leftCoeff > rightCoeff)
                            leftCoeff -= rightCoeff;
                    }
                    else if(this.Left.Type == para_Math_Text)
                    {
                        leftCode = this.Left.getCodeChr();
                        leftCoeff = COEFF_GAPS.getCoeff(currCode, leftCode, -1);
                        rightCoeff = COEFF_GAPS.getCoeff(leftCode, currCode, 1);
                    }

                }
                else
                    this.Current.GapLeft = 0;
            }
            else if(this.Current.Type == para_Math_Composition)
            {
                leftCoeff = this.getGapsMComp(this.Current, -1);

                if(this.Left != null)
                {
                    if(this.Left.Type == para_Math_Composition)
                    {
                        rightCoeff = this.getGapsMComp(this.Left, 1);

                        if(rightCoeff/2 > leftCoeff)
                            rightCoeff -= leftCoeff;
                        else
                            rightCoeff /= 2;

                        if(leftCoeff < rightCoeff/2)
                            leftCoeff = rightCoeff/2;
                        else
                            leftCoeff -= rightCoeff/2;
                    }
                    else if(this.Left.Type == para_Math_Text)
                    {
                        leftCode = this.Left.getCodeChr();
                        rightCoeff = COEFF_GAPS.getCoeff(leftCode, -1, 1);
                        if(rightCoeff > leftCoeff)
                            rightCoeff -= leftCoeff;
                    }
                }
                else
                    leftCoeff = 0;
            }

            leftCoeff = Math.ceil(leftCoeff*10)/10;
            rightCoeff = Math.ceil(rightCoeff*10)/10;

            var LGapSign = 0.1513*this.currRunPrp.FontSize;
            this.Current.GapLeft = Math.ceil(leftCoeff*LGapSign*10)/10; // если ни один случай не выполнился, выставляем "нулевые" gaps (default): необходимо, если что-то удалили и объект стал первый или последним в контенте

            if(this.Left != null)
            {
                var RGapSign = 0.1513*this.leftRunPrp.FontSize;
                this.Left.GapRight = Math.ceil(rightCoeff*RGapSign*10)/10;
            }
        }
    },
    getGapsMComp: function(MComp, direct)
    {
        var kind = MComp.kind;
        var checkGap = this.checkGapKind(kind);

        var bNeedGap = !checkGap.bEmptyGaps && !checkGap.bChildGaps;

        var coeffLeft  = 0.001,
            coeffRight = 0; // for checkGap.bEmptyGaps

        //var bDegree = kind == MATH_DEGREE || kind == MATH_DEGREESubSup;
        var bDegree = kind == MATH_DEGREE;

        if(checkGap.bChildGaps)
        {
            if(bDegree)
            {
                coeffLeft  = 0.03;

                if(MComp.IsPlhIterator())
                    coeffRight = 0.12;
                else
                    coeffRight = 0.16;
            }

            var gapsChild = MComp.getGapsInside(this);

            coeffLeft  = coeffLeft  < gapsChild.left  ? gapsChild.left  : coeffLeft;
            coeffRight = coeffRight < gapsChild.right ? gapsChild.right : coeffRight;
        }
        else if(bNeedGap)
        {
            coeffLeft = 0.4;
            coeffRight = 0.3;
        }


        return direct == -1 ? coeffLeft : coeffRight;
    },
    checkGapKind: function(kind)
    {
        var bEmptyGaps = kind == MATH_DELIMITER || kind == MATH_MATRIX,
            bChildGaps = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL|| kind == MATH_BOX || kind == MATH_BORDER_BOX || (kind == MATH_DELIMITER);

        return  {bEmptyGaps: bEmptyGaps, bChildGaps: bChildGaps};
    }

}

function CMPrp()
{
    this.sty      = undefined;
    this.scr      = undefined;
    this.nor      = undefined;

    this.aln      = undefined;
    this.brk      = undefined;
    this.lit      = undefined;

    // Default
    /*this.sty      = STY_ITALIC;
    this.scr      = TXT_ROMAN;

    this.nor      = false;

    this.aln      = false;
    this.brk      = false;
    this.lit      = false;*/

    // TXT_NORMAL
    // если normal == false, то берем TextPrp отсюда (в wRunPrp bold/italic не учитываем, выставляем отсюда)
    // если normal == true, то их Word не учитывает и берет TextPr из wRunPrp

    // TXT_PLAIN
    // если plain == true
    // буквы берутся обычные, не специальные для Cambria Math : то есть как для TXT_NORMAL
    // отличие от TXT_NORMAL w:rPrp в этом случае не учитываются !

}
CMPrp.prototype =
{
    setMathProps: function(props)
    {
        if(props.aln === true || props.aln == false)
            this.aln = props.aln;

        if(props.brk === true || props.brk == false)
            this.brk = props.brk;

        if(props.lit === true || props.lit == false)
            this.lit = props.lit;

        if(props.nor === true || props.nor == false)
            this.nor = props.nor;


        if(props.sty !== null && props.sty !== undefined)
            this.sty = props.sty;

        // TXT_DOUBLE_STRUCK        U+1D538 - U+1D56B
        // TXT_MONOSPACE            U+1D670 - U+1D6A3
        // TXT_FRAKTUR              U+1D504 - U+1D537
        // TXT_SANS_SERIF           U+1D608 - U+1D63B
        // TXT_SCRIPT               U+1D49C - U+1D4CF

        if(props.scr !== null && props.scr !== undefined)
            this.scr = props.scr;

    },
    getPropsForWrite: function()
    {
        var props =
        {
            aln:    this.aln,
            brk:    this.brk,
            lit:    this.lit,
            nor:    this.nor,
            sty:    this.sty,
            scr:    this.scr
        };

        return props;
    },
    GetTxtPrp: function()
    {
        var textPrp = new CTextPr();

        if(this.sty == undefined)
        {
            textPrp.Italic = true;
            textPrp.Bold   = false;
        }
        else
        {
            textPrp.Italic = this.sty == STY_BI || this.sty == STY_ITALIC;
            textPrp.Bold   = this.sty == STY_BI || this.sty == STY_BOLD;
        }


        return textPrp;
    },
    Copy: function()
    {
        var NewMPrp = new CMPrp();
        
        NewMPrp.aln      = this.aln;
        NewMPrp.brk      = this.brk;
        NewMPrp.lit      = this.lit;
        NewMPrp.nor      = this.nor;
        NewMPrp.sty      = this.sty;
        NewMPrp.scr      = this.scr;
        
        return NewMPrp;
    },
    GetCompiled_ScrStyles : function()
    {
        var nor = this.nor == undefined ? false : this.nor;
        var scr = this.scr == undefined ? TXT_ROMAN : this.scr;
        var sty = this.sty == undefined ? STY_ITALIC : this.sty;

        return {nor: nor, scr: scr, sty: sty};
    },
    SetStyle: function(Bold, Italic) /// из ctrPrp получить style для MathPrp
    {
        if(Bold == true && Italic == true)
            this.sty = STY_BI;
        else if(Italic == true)
            this.sty = STY_ITALIC;
        else if(Bold == true)
            this.sty = STY_BOLD;
        else if(Bold == false && Italic == false)
            this.sty = STY_PLAIN;
        else
            this.sty = undefined;
    }
}


//TODO
//пересмотреть this.dW и this.dH


function CMathContent()
{
	this.Id = g_oIdCounter.Get_NewId();		

    this.content = []; // array of mathElem

    this.CurPos = 0;
    this.WidthToElement = [];
    this.pos = new CMathPosition();   // относительная позиция

    //  Properties
    this.ParaMath       = null;
    this.ArgSize        = new CMathArgSize();
    this.Compiled_ArgSz = new CMathArgSize();

    // for EqqArray
    this.InfoPoints = new CInfoPoints();
    ///////////////

    this.plhHide    = false;
    this.bRoot      = false;
    //////////////////

    this.Selection =
    {
        Start:  0,
        End:    0,
        Use:    false
    };

    this.RecalcInfo =
    {
        TextPr:             true,
        bEqqArray:          false,
        bChangeInfoPoints:  false
    };

    this.NearPosArray = [];

    this.size = new CMathSize();
	
	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add( this, this.Id );
}
CMathContent.prototype =
{
    constructor: CMathContent,
    init: function()
    {

    },
    addElementToContent: function(obj)   //for "read"
    {
        this.Internal_Content_Add(this.content.length, obj, false);
        this.CurPos = this.content.length-1;
    },
    fillPlaceholders: function()
    {
        this.content.length = 0;

        var oMRun = new ParaRun(null, true);
        oMRun.fillPlaceholders();
        this.addElementToContent(oMRun);

        /*var placeholder = new CMathText(false);
        //placeholder.relate(this);
        placeholder.fillPlaceholders();

        this.content.push( placeholder );*/
    },
    //////////////////////////////////////
    /*recalculateSize: function()
    {
        var width      =   0 ;
        var ascent     =   0 ;
        var descent    =   0 ;

        var oSize;

        this.WidthToElement.length = 0;

        for(var i = 0; i < this.content.length; i++)
        {
            if(this.content[i].Type == para_Math_Composition)
                this.content[i].ApplyGaps();
            else if(this.content[i].Type == para_Math_Run)
                this.content[i].Math_ApplyGaps();

            this.WidthToElement[i] = width;

            oSize = this.content[i].size;
            width += oSize.width;

            ascent = ascent > oSize.ascent ? ascent : oSize.ascent;
            var oDescent = oSize.height - oSize.ascent;
            descent =  descent < oDescent ? oDescent : descent;
        }

        this.size = {width: width, height: ascent + descent, ascent: ascent};
    },*/

    Resize: function(oMeasure, Parent, ParaMath, RPI, ArgSize)      // пересчитываем всю формулу
    {
        if(ArgSize !== null && ArgSize !== undefined)
        {
            this.Compiled_ArgSz.value = this.ArgSize.value;
            this.Compiled_ArgSz.Merge(ArgSize);
        }

        this.ParaMath = ParaMath;
        if(Parent !== null)
        {
            this.bRoot = false;
            this.Parent = Parent;
        }

        this.WidthToElement.length = 0;

        var GapsInfo = new CMathGapsInfo(oMeasure, this, this.Compiled_ArgSz.value);

        this.RecalcInfo.bEqqArray = RPI.bEqqArray;

        var lng = this.content.length;

        this.size.SetZero();

        this.InfoPoints.SetDefault();

        for(var pos = 0; pos < lng; pos++)
        {
            if(this.content[pos].Type == para_Math_Composition)
            {
                this.content[pos].Set_CompiledCtrPrp(this.ParaMath);
                this.content[pos].SetGaps(GapsInfo);
            }
            else if(this.content[pos].Type == para_Math_Run)
                this.content[pos].Math_SetGaps(GapsInfo);
        }

        if(GapsInfo.Current !== null)
            GapsInfo.Current.GapRight = 0;

        for(var pos = 0; pos < lng; pos++)
        {
            if(this.content[pos].Type == para_Math_Composition)
            {
                var NewRPI = RPI.Copy();
                NewRPI.bEqqArray    = false;

                this.content[pos].Resize(oMeasure, this, ParaMath, NewRPI, this.Compiled_ArgSz);

                if(RPI.bEqqArray)
                    this.InfoPoints.ContentPoints.UpdatePoint(this.content[pos].size.width);
            }
            else if(this.content[pos].Type == para_Math_Run)
            {
                //this.content[pos].Recalculate_Range();
                this.content[pos].Math_Recalculate(oMeasure, this, ParaMath.Paragraph, RPI, this.Compiled_ArgSz, this.InfoPoints.ContentPoints);
            }


            this.WidthToElement[pos] = this.size.width;

            var oSize = this.content[pos].size;
            this.size.width += oSize.width;

            var oDescent = oSize.height - oSize.ascent,
                SizeDescent = this.size.height - this.size.ascent;

            this.size.ascent = this.size.ascent > oSize.ascent ? this.size.ascent : oSize.ascent;

            this.size.height = SizeDescent < oDescent ? oDescent + this.size.ascent : SizeDescent + this.size.ascent;
        }
    },
    Resize_2: function(oMeasure, Parent, ParaMath, RPI, ArgSize)    // особый случай: вызываем, когда пересчет всей формулы не нужен, а нужно выставить только Lines (Реализована, чтобы не править Resize у каждого элемента)
    {
        var lng = this.content.length;
        for(var i = 0; i < lng; i++)
        {
            if(this.content[i].Type == para_Math_Composition)
                this.content[i].Resize_2(oMeasure, this, ParaMath, RPI, ArgSize);
            else
                this.content[i].Math_Recalculate(oMeasure, this, ParaMath.Paragraph, RPI, ArgSize, null);
        }
    },
    M_Resize: function(oMeasure, Parent, ParaMath, RPI, ArgSize)      // если делать один цикл for для Resize, то надо избавиться от WidthToElement,
                                                                      // т.к. корректно рассчитывать не получается, либо выставлять WidthToElement для пустыx Run (которые идут после мат объекта) на recalculateSize_2 мат объекта
    {
        if(ArgSize !== null && ArgSize !== undefined)
        {
            this.Compiled_ArgSz.value = this.ArgSize.value;
            this.Compiled_ArgSz.Merge(ArgSize);
        }

        this.ParaMath = ParaMath;
        if(Parent !== null)
        {
            this.bRoot = false;
            this.Parent = Parent;
        }

        this.WidthToElement.length = 0;

        var GapsInfo = new CMathGapsInfo(oMeasure, this, this.Compiled_ArgSz.value);

		if (!this.bRoot && this.content.length == 0)
			this.fillPlaceholders();

        this.RecalcInfo.bEqqArray = RPI.bEqqArray;

        var lng = this.content.length;

        this.size.SetZero();

        this.InfoPoints.SetDefault();

        var PosUpdate = -1;

        var bEmptyRun;

        for(var pos = 0; pos < lng; pos++)
        {
            bEmptyRun = this.content[pos].Type == para_Math_Run && this.content[pos].Is_Empty();

            if(this.content[pos].Type == para_Math_Composition)
            {
                this.content[pos].Set_CompiledCtrPrp(this.ParaMath);
                this.content[pos].SetGaps(GapsInfo);
            }
            else if(this.content[pos].Type == para_Math_Run)
                this.content[pos].Math_SetGaps(GapsInfo);

            // если пропускаем расчет одного из элементов, то WidthToElement будет неправильно выставлен
            // если выставлять WidthToElement на recalculateSize_2, то WidthToElement не будет выставлен для пустых Run
            this.WidthToElement[pos] = this.size.width;

            // для случая если между двумя мат объектами стоит пустой Run, то Gaps должны рассчитываться между двумя этими мат объектами
            // и при расчете должны сначала выставиться у правого мат объекта Gaps, а потом рассчитываться размер левого объекта
            if(!bEmptyRun)
            {
                if(PosUpdate >= 0)
                    this.recalculateSize_2(PosUpdate, oMeasure, Parent, ParaMath, RPI);

                PosUpdate = pos;
            }
        }

        if(GapsInfo.Current !== null)
            GapsInfo.Current.GapRight = 0;

        if(PosUpdate != -1)
            this.recalculateSize_2(PosUpdate, oMeasure, Parent, ParaMath, RPI);

    },
    recalculateSize_2: function(pos, oMeasure, Parent, ParaMath, RPI)
    {
        if(this.content[pos].Type == para_Math_Composition)
        {
            var NewRPI = RPI.Copy();
            NewRPI.bEqqArray    = false;

            this.content[pos].Resize(oMeasure, this, ParaMath, NewRPI, this.Compiled_ArgSz);

            if(RPI.bEqqArray)
                this.InfoPoints.ContentPoints.UpdatePoint(this.content[pos].size.width);
        }
        else if(this.content[pos].Type == para_Math_Run)
            this.content[pos].Math_Recalculate(oMeasure, this, ParaMath.Paragraph, RPI, this.Compiled_ArgSz, this.InfoPoints.ContentPoints);

        var oSize = this.content[pos].size;
        this.size.width += oSize.width;

        var oDescent = oSize.height - oSize.ascent,
            SizeDescent = this.size.height - this.size.ascent;

        this.size.ascent = this.size.ascent > oSize.ascent ? this.size.ascent : oSize.ascent;

        this.size.height = SizeDescent < oDescent ? oDescent + this.size.ascent : SizeDescent + this.size.ascent;

    },
    getWidthsPoints: function()
    {
        return this.InfoPoints.ContentPoints.Widths;
    },
    IsEqqArray: function()
    {
        return this.Parent.IsEqqArray();
    },
    Get_CompiledArgSize: function()
    {
        return this.Compiled_ArgSz;
    },
    getGapsInside: function(GapsInfo) // учитываем gaps внутренних объектов
    {
        var gaps = {left: 0, right: 0};
        var bFirstComp = false,
            bLastComp = false;

        var len = this.content.length;

        if(len > 1)
        {
            var bFRunEmpty = this.content[0].Is_Empty();
            bFirstComp = bFRunEmpty && this.content[1].Type == para_Math_Composition; // первый всегда идет Run

            var bLastRunEmpty = this.content[len - 1].Is_Empty(); // т.к. после мат. объекта стоит пустой Run
            bLastComp = bLastRunEmpty && this.content[len - 2].Type == para_Math_Composition;
        }

        var checkGap;

        if(bFirstComp)
        {
            checkGap = GapsInfo.checkGapKind(this.content[1].kind);

            if(!checkGap.bChildGaps)
            {
                gaps.left = GapsInfo.getGapsMComp(this.content[1], -1);
                //gaps.left = gapsMComp.left;
            }
        }

        if(bLastComp)
        {
            checkGap = GapsInfo.checkGapKind(this.content[len - 1].kind);

            if(!checkGap.bChildGaps)
            {
                gaps.right = GapsInfo.getGapsMComp(this.content[len - 1], 1);
                //gaps.right = gapsMComp.right;
            }
        }

        return gaps;
    },
    IsOneLineText: function()   // for degree
    {
        var bOneLineText = true;

        for(var i = 0; i < this.content.length; i++)
        {
            if(this.content[i].Type == para_Math_Composition)
            {
                if(!this.content[i].IsOneLineText())
                {
                    bOneLineText = false;
                    break;
                }
            }
        }

        return bOneLineText;
    },
    draw: function(x, y, pGraphics)
    {
        var bHidePlh = this.plhHide && this.IsPlaceholder();

        if( !bHidePlh )
        {
            for(var i=0; i < this.content.length;i++)
            {
                if(this.content[i].Type == para_Math_Composition)
                {
                    this.content[i].draw(x, y, pGraphics);
                }
                else
                    this.content[i].Math_Draw(x, y, pGraphics);
            }
        }
    },
    update_Cursor: function(CurPage, UpdateTarget)
    {
        var result;
        if(this.content[this.CurPos].Type == para_Math_Composition)
        {
            result = this.content[this.CurPos].update_Cursor(CurPage, UpdateTarget);
        }
        else
        {
            var X = this.pos.x + this.ParaMath.X + this.WidthToElement[this.CurPos],
                Y = this.pos.y + this.ParaMath.Y + this.size.ascent;

            result = this.content[this.CurPos].Math_Update_Cursor(X, Y, CurPage, UpdateTarget);
        }

        return result;
    },
    setPlaceholderAfterRemove: function()  // чтобы не выставлялся тагет при вставке, когда заселекчен весь контент и мы добавляем, например, другой мат элемент
    {
        if(this.content.length == 1 && !this.bRoot )//только CEmpty
            this.fillPlaceholders();
    },
    setCtrPrp: function()
    {

    },
    getInfoLetter: function(Info)
    {
        if(this.content.length == 1)
            this.content[0].Math_GetInfoLetter(Info);
        else
            Info.Result = false;
    },
    IsPlaceholder: function()
    {
        var flag = false;
        if(!this.bRoot && this.content.length == 1)
            flag  = this.content[0].IsPlaceholder();

        return flag;
    },
    IsJustDraw: function()
    {
        return false;
    },
    setPosition: function(pos)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;

        var PosInfo = new CMathPointInfo();
        PosInfo.x = this.pos.x;
        PosInfo.y = this.pos.y + this.size.ascent;

        if(this.RecalcInfo.bEqqArray)
        {
            this.InfoPoints.GWidths       = this.Parent.WidthsPoints;
            this.InfoPoints.GPoints       = this.Parent.Points;
            this.InfoPoints.GMaxDimWidths = this.Parent.MaxDimWidths;

            PosInfo.SetInfoPoints(this.InfoPoints);
            PosInfo.ApplyAlign();

        }

        for(var i=0; i < this.content.length; i++)
        {
            if(this.content[i].Type == para_Math_Run)
            {
                this.content[i].Math_SetPosition(PosInfo);
            }
            else
            {
                var NewPos = new CMathPosition();
                NewPos.x = PosInfo.x;
                NewPos.y = PosInfo.y;

                this.content[i].setPosition(NewPos);
                PosInfo.UpdateX(this.content[i].size.width);
            }
        }
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
    getFirstRPrp:    function(ParaMath)
    {
        return this.content[0].Get_CompiledPr(true);
    },
    GetCtrPrp: function()       // for placeholder
    {
        var ctrPrp = new CTextPr();
        if(!this.bRoot)
            ctrPrp.Merge( this.Parent.Get_CompiledCtrPrp_2() );

        return ctrPrp;
    },
    IsAccent: function()
    {
        var result = false;

        if(!this.bRoot)
            result = this.Parent.IsAccent();

        return result;
    },
    ////////////////////////

    /// For Para Math

    Recalculate_CurPos : function(X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        X = this.pos.x + this.ParaMath.X;
        Y = this.pos.y + this.ParaMath.Y + this.size.ascent;

        if(this.RecalcInfo.bEqqArray)
        {
            var PointInfo = new CMathPointInfo();
            PointInfo.SetInfoPoints(this.InfoPoints);

            X += PointInfo.GetAlign();

            for(var i = 0; i < this.CurPos; i++)
            {
                if(this.content[i].Type == para_Math_Run)
                {
                    var res = this.content[i].Recalculate_CurPos(X, Y, false, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget, PointInfo);
                    X = res.X;
                }
                else
                    X += this.content[i].size.width;
            }
        }
        else
            X += this.WidthToElement[this.CurPos];


        return this.content[this.CurPos].Recalculate_CurPos(X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget, PointInfo);

    },
    Check_NearestPos: function(ParaNearPos, Depth)
    {
        var ContentNearPos = new CParagraphElementNearPos();
        ContentNearPos.NearPos = ParaNearPos.NearPos;
        ContentNearPos.Depth   = Depth;

        // CParagraphNearPos for ParaNearPos
        this.NearPosArray.push( ContentNearPos );
        ParaNearPos.Classes.push( this );

        var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
        this.Content[CurPos].Check_NearestPos( ParaNearPos, Depth + 1 );
    },
    Recalculate_Reset: function(StartRange, StartLine)
    {
        for(var i = 0; i < this.content.length; i++)
        {
            //if(this.content[i].typeObj !== MATH_PLACEHOLDER)
            this.content[i].Recalculate_Reset(StartRange, StartLine);
        }
    },
    GetParent: function()
    {
        return this.Parent.GetParent();
    },
    SetArgSize: function(val)
    {
        this.ArgSize.SetValue(val);
    },

    /////////   Перемещение     ////////////

    // Поиск позиции, селект

    Set_SelectionContentPos: function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
        var posStart, posEnd;

        switch(StartFlag)
        {
            case 0:
                posStart = StartContentPos.Get(Depth);
                break;
            case 1:
                posStart = 0;
                break;
            case -1:
                posStart = this.content.length - 1;
        }

        switch(EndFlag)
        {
            case 0:
                posEnd = EndContentPos.Get(Depth);
                break;
            case 1:
                posEnd = 0;
                break;
            case -1:
                posEnd = this.content.length - 1;
        }

        this.Selection.Start = posStart;
        this.Selection.End   = posEnd;
        Depth++;

        if(this.IsPlaceholder())
        {
            this.content[0].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
        }
        else if(posStart < this.content.length)
        {
            if(posStart == posEnd)
            {
                this.content[posStart].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
            }
            else
            {
                if(posStart > posEnd)
                {
                    this.content[posStart].Set_SelectionContentPos(StartContentPos, null, Depth, StartFlag, 1);
                    this.content[posEnd].Set_SelectionContentPos(null, EndContentPos, Depth, -1, EndFlag);
                }
                else
                {
                    this.content[posStart].Set_SelectionContentPos(StartContentPos, null, Depth, StartFlag, -1);
                    this.content[posEnd].Set_SelectionContentPos(null, EndContentPos, Depth, 1, EndFlag);
                }
            }
        }

        this.Selection.Use = true;
    },
    GetSelectContent: function()
    {
        var startPos, endPos;

        if(this.Selection.Use)
        {
            startPos = this.Selection.Start;
            endPos   = this.Selection.End;

            if(startPos > endPos)
            {
                var temp = startPos;
                startPos = endPos;
                endPos = temp;
            }
        }
        else
            startPos = endPos = this.CurPos;


        var bEqual = startPos == endPos,
            bNotSelectComp = bEqual ? this.content[startPos].Type === para_Math_Composition && this.content[startPos].IsSelectEmpty() : false;

        var result;

        if(bNotSelectComp)
            result = this.content[startPos].GetSelectContent(); // startPos == endPos
        else
            result = {Content: this, Start: startPos, End: endPos};

        return result;

    },
    Select_All: function()
    {
        this.Selection.Start = 0;
        this.Selection.End = this.content.length - 1;

        this.Selection.Use = true;

        if(this.content[this.Selection.Start].Type == para_Math_Run)
            this.content[this.Selection.Start].Select_All();

        if(this.content[this.Selection.End].Type == para_Math_Run)
            this.content[this.Selection.End].Select_All();

    },

    SelectElement : function(nPos)
    {
        this.Selection.Start = nPos;
        this.Selection.End   = nPos;

        this.Selection.Use = true;

        if(para_Math_Run === this.content[this.Selection.Start].Type)
            this.content[this.Selection.Start].Select_All();
        else
            this.content[this.Selection.Start].SetSelectAll();
    },

    Correct_Selection : function()
    {
        if (true !== this.Selection.Use)
            return;

        // Здесь мы делаем так, чтобы селект всегда начинался и заканчивался в ране.
        // Предполагается, что контент скорректирован верно до выполнения данной функции.

        var nContentLen = this.content.length;
        var nStartPos = Math.max(0, Math.min(this.Selection.Start, nContentLen - 1));
        var nEndPos   = Math.max(0, Math.min(this.Selection.End,   nContentLen - 1));

        if (nStartPos > nEndPos)
        {
            var nTemp = nStartPos;
            nStartPos = nEndPos;
            nEndPos   = nTemp;
        }

        var oStartElement = this.content[nStartPos];
        if (para_Math_Run !== oStartElement.Type)
        {
            // Предыдущий элемент должен быть раном
            this.Selection.Start = nStartPos - 1;
            this.content[this.Selection.Start].Set_SelectionAtEndPos();
        }

        var oEndElement = this.content[nEndPos];
        if (para_Math_Run !== oEndElement.Type)
        {
            // Следующий элемент должен быть раном
            this.Selection.End = nEndPos + 1;
            this.content[this.Selection.End].Set_SelectionAtStartPos();
        }
    },

    Is_SelectedAll: function(Props)
    {
        var bFirst = false, bEnd = false;

        if(this.Selection.Start == 0 && this.Selection.End == this.content.length - 1)
        {
            if(this.content[this.Selection.Start].Type == para_Math_Run)
                bFirst = this.content[this.Selection.Start].Is_SelectedAll(Props);
            else
                bFirst = true;

            if(this.content[this.Selection.End].Type == para_Math_Run)
                bEnd = this.content[this.Selection.End].Is_SelectedAll(Props);
            else
                bEnd = true;
        }

        return bFirst && bEnd;
    },
    Selection_IsEmpty: function()
    {
        var startPos = this.Selection.Start,
            endPos   = this.Selection.End;

        var result = false;

        if(startPos == endPos)
            result = this.content[startPos].Selection_IsEmpty();

        return result;
    },
    SelectToParent : function(bCorrect)
    {
        this.Selection.Use = true;

        if (true === bCorrect)
            this.Correct_Selection();

        if(!this.bRoot)
            this.Parent.SelectToParent(false);

    },
    Selection_DrawRange: function(_CurLine, _CurRange, SelectionDraw)
    {
        var Start = this.Selection.Start,
            End = this.Selection.End;

        if(Start > End)
        {
            Start = this.Selection.End;
            End   = this.Selection.Start;
        }

        SelectionDraw.StartX += this.pos.x /*+ oCont.WidthToElement[Start]*/;

        var PointsInfo = new CMathPointInfo();
        PointsInfo.SetInfoPoints(this.InfoPoints);

        if(this.RecalcInfo.bEqqArray)
        {
            if(SelectionDraw.FindStart == true)
                SelectionDraw.StartX += PointsInfo.GetAlign();
            else
                SelectionDraw.W += PointsInfo.GetAlign();
        }

        var DrawSelection = false;

        for(var i = 0; i < this.content.length; i++)
        {
            DrawSelection = i >= Start && i <= End ? true : false;


            if(DrawSelection == false)
                this.content[i].Selection_Remove();
            else if(i > Start && i < End  && this.content[i].Type == para_Math_Run) /// чтобы избежать багов, которые возникают при выходе за границы формулы (при резком движении мышки например в направлении начала формулы)
                this.content[i].Select_All();

            if(this.content[i].Type == para_Math_Run)
                this.content[i].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw, PointsInfo);
            else
            {
                if(DrawSelection == true)
                {
                    SelectionDraw.W += this.content[i].size.width;
                    SelectionDraw.FindStart = false;
                }
                else if(SelectionDraw.FindStart == true)
                    SelectionDraw.StartX += this.content[i].size.width;
            }
        }

        if(!this.bRoot)
        {
            SelectionDraw.StartY = this.ParaMath.Y + this.pos.y; // выставляем так, чтобы для формул с различной высотой в одной строке, всё было ok
            SelectionDraw.H = this.size.height;
        }
    },

    ///////////////////////

    Get_StartPos: function(ContentPos, Depth)
    {
        ContentPos.Update( 0, Depth );

        this.content[0].Get_StartPos(ContentPos, Depth + 1);
    },
    Get_EndPos: function(BehindEnd, ContentPos, Depth)
    {
        var len = this.content.length - 1;
        ContentPos.Update(len, Depth);

        if(len > 0)
            this.content[len].Get_EndPos(BehindEnd, ContentPos, Depth + 1);
    },
    Get_Id : function()
    {
        return this.GetId();
    },
    GetId : function()
    {
        return this.Id;
    },
    SetRunEmptyToContent: function(bAll)
    {
        var len = this.content.length;

        var current = null;
        var emptyRun, ctrPrp, mathPrp;

        var currPos = 0;

        while(currPos < len)
        {
            current = this.content[currPos];

            var bLeftRun  = currPos > 0 ? this.content[currPos-1].Type == para_Math_Run : false,
                bRightRun = currPos < len - 1 ? this.content[currPos + 1].Type === para_Math_Run : false;

            var bCurrComp = current.Type == para_Math_Composition,
                bCurrEmptyRun = current.Type == para_Math_Run && current.Is_Empty();

            var bDeleteEmptyRun = bCurrEmptyRun && (bLeftRun || bRightRun);

            if(bCurrComp && bAll == true)
                this.content[currPos].SetRunEmptyToContent(bAll);

            if(bCurrComp && !bLeftRun) // добавление пустого Run перед мат объектом
            {
                emptyRun = new ParaRun(null, true);

                ctrPrp = current.Get_CtrPrp();

                mathPrp = new CMPrp();

                mathPrp.SetStyle(ctrPrp.Bold, ctrPrp.Italic);

                emptyRun.Set_MathPr(mathPrp);

                ctrPrp.Bold   = undefined;
                ctrPrp.Italic = undefined;

                emptyRun.Set_Pr(ctrPrp);

                this.Internal_Content_Add(currPos, emptyRun);
                currPos += 2;
            }
            else if(bDeleteEmptyRun)
            {
                this.Remove_FromContent(currPos, 1);
            }
            else
                currPos++;

            len = this.content.length;
        }


        if(len > 0 && this.content[len - 1].Type == para_Math_Composition)
        {
            emptyRun = new ParaRun(null, true);

            ctrPrp = current.Get_CtrPrp();

            mathPrp = new CMPrp();
            mathPrp.SetStyle(ctrPrp.Bold, ctrPrp.Italic);

            emptyRun.Set_MathPr(mathPrp);

            ctrPrp.Bold   = undefined;
            ctrPrp.Italic = undefined;

            emptyRun.Set_Pr(ctrPrp);

            this.Internal_Content_Add(len, emptyRun);
        }

    },
    Correct_Content : function(bInnerCorrection)
    {
        if (true === bInnerCorrection)
        {
            for (var nPos = 0, nCount = this.content.length; nPos < nCount; nPos++)
            {
                if (para_Math_Composition === this.content[nPos].Type)
                    this.content[nPos].Correct_Content(true);
            }
        }

        this.SetRunEmptyToContent(false);

        // Удаляем лишние пустые раны
        for (var nPos = 0, nLen = this.content.length; nPos < nLen - 1; nPos++)
        {
            var oCurrElement = this.content[nPos];
            var oNextElement = this.content[nPos + 1];
            if (para_Math_Run === oCurrElement.Type && para_Math_Run === oNextElement.Type)
            {
                if (oCurrElement.Is_Empty())
                {
                    this.Remove_FromContent(nPos);
                    nPos--;
                    nLen--;
                }
                else if (oNextElement.Is_Empty())
                {
                    this.Remove_FromContent(nPos + 1);
                    nPos--;
                    nLen--;
                }
            }

            if(para_Math_Run === oCurrElement.Type)
                oCurrElement.Math_Correct_Content();
        }

        // Если в контенте ничего нет, тогда добавляем пустой ран
        if (this.content.length < 1)
        {
            this.Add_ToContent(0, new ParaRun(null, true));
        }

        if (this.content.length == 1)
        {
            if(para_Math_Run === this.content[0].Type)
                this.content[0].Math_Correct_Content();

            if(this.content[0].Is_Empty())
                this.content[0].fillPlaceholders();
        }
    },

    Correct_ContentPos : function(nDirection)
    {
        var nCurPos = this.CurPos;

        if (nCurPos < 0)
        {
            this.CurPos = 0;
            this.content[0].Cursor_MoveToStartPos();
        }
        else if (nCurPos > this.content.length - 1)
        {
            this.CurPos = this.content.length - 1;
            this.content[this.CurPos].Cursor_MoveToEndPos();
        }
        else if (para_Math_Run !== this.content[nCurPos].Type)
        {
            if (nDirection > 0)
            {
                this.CurPos = nCurPos + 1;
                this.content[this.CurPos].Cursor_MoveToStartPos();
            }
            else
            {
                this.CurPos = nCurPos - 1;
                this.content[this.CurPos].Cursor_MoveToEndPos();
            }
        }
    },

    Create_FontMap : function(Map)
    {
        for (var index = 0; index < this.content.length; index++)
            this.content[index].Create_FontMap( Map, this.Compiled_ArgSz ); // ArgSize компилируется только тогда, когда выставлены все ссылки на родительские классы
    },
    Get_AllFontNames: function(AllFonts)
    {
        for (var index = 0; index < this.content.length; index++)
            this.content[index].Get_AllFontNames(AllFonts);
    },

    /// функции для работы с курсором
    Get_ParaContentPosByXY: function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        var result = false;

        if(this.content.length > 0) // случай , если у нас контент не заполнен, не предусмотрен
        {
            var pos = 0;
            var lng = this.content.length;

            var PointInfo = new CMathPointInfo();
            PointInfo.SetInfoPoints(this.InfoPoints);

            if(this.RecalcInfo.bEqqArray)
                SearchPos.CurX += PointInfo.GetAlign();

            SearchPos.CurY = this.pos.y + this.ParaMath.Y + this.size.ascent;

            while(pos < lng)
            {
                //result = this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth+1, _CurLine, _CurRange, StepEnd, PointInfo);

                if(this.content[pos].Type == para_Math_Composition)
                {
                    if( this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth+1, _CurLine, _CurRange, StepEnd))
                    {

                        SearchPos.InTextPos.Update(pos, Depth);
                        SearchPos.Pos.Update2(pos, Depth);
                        result = true;
                    }

                    if(SearchPos.InText == false)
                    {
                        if(this.content[pos-1].Is_Empty())
                        {
                            SearchPos.CurX -= this.content[pos].size.width;

                            if( this.content[pos-1].Get_ParaContentPosByXY(SearchPos, Depth+1, _CurLine, _CurRange, StepEnd))
                            {
                                SearchPos.Pos.Update2(pos-1, Depth);
                                result = true;
                            }

                            SearchPos.CurX += this.content[pos].size.width;
                        }

                        /*if(this.content[pos+1].Is_Empty())
                        {
                            if( this.content[pos+1].Get_ParaContentPosByXY(SearchPos, Depth+1, _CurLine, _CurRange, StepEnd))
                            {
                                SearchPos.Pos.Update2(pos, Depth);
                                result = true;
                            }
                        }*/
                    }
                }
                else
                {
                    if(this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth+1, _CurLine, _CurRange, StepEnd, PointInfo))
                    {

                        SearchPos.InTextPos.Update(pos, Depth);
                        SearchPos.Pos.Update2(pos, Depth);
                        result = true;
                    }
                }

                pos++;
            }
        }

        return result;
    },
    Get_ParaContentPos: function(bSelection, bStart, ContentPos)
    {
        if( bSelection )
        {
            var pos = bStart ? this.Selection.Start : this.Selection.End;
            ContentPos.Add(pos);

            this.content[pos].Get_ParaContentPos(bSelection, bStart, ContentPos);
        }
        else
        {
            ContentPos.Add(this.CurPos);

            this.content[this.CurPos].Get_ParaContentPos(bSelection, bStart, ContentPos);
        }
    },
    Set_ParaContentPos: function(ContentPos, Depth)
    {
        this.CurPos = ContentPos.Get(Depth);

        if(this.content.length > 0)
            this.content[this.CurPos].Set_ParaContentPos(ContentPos, Depth+1);

    },
    Cursor_MoveToStartPos: function()
    {
        if(!this.Is_Empty())
        {
            this.CurPos = 0;

            this.content[0].Cursor_MoveToStartPos();
        }
    },
    Cursor_MoveToEndPos: function(SelectFromEnd)
    {
        if(!this.Is_Empty())
        {
            var len = this.content.length - 1;
            this.CurPos = len;

            this.content[len].Cursor_MoveToEndPos(SelectFromEnd);
        }
    },
    Cursor_Is_Start: function()
    {
        var result = false;

        if( !this.Is_Empty() )
        {
            if(this.CurPos == 0)
                result = this.content[0].Cursor_Is_Start();
        }

        return result;
    },
    Cursor_Is_End: function()
    {
        var result = false;

        if(!this.Is_Empty())
        {
            var len = this.content.length - 1;
            if(this.CurPos == len)
            {
                result = this.content[len].Cursor_Is_End();
            }
        }

        return result;
    },
    Get_StartRangePos: function(CurLine, CurRange, SearchPos, Depth)
    {
        SearchPos.Pos.Update( 0, Depth );

        return this.content[0].Get_StartRangePos(CurLine, CurRange, SearchPos, Depth + 1);
    },
    Get_StartRangePos2: function(CurLine, CurRange, ContentPos, Depth)
    {
        ContentPos.Update( 0, Depth );

        this.content[0].Get_StartRangePos2(CurLine, CurRange, ContentPos, Depth + 1);
    },
    Get_EndRangePos: function(CurLine, CurRange, SearchPos, Depth)
    {
        var len = this.content.length - 1;

        var result = false;

        if(len >= 0)
        {
            SearchPos.Pos.Update(len, Depth);
            result = this.content[len].Get_EndRangePos(CurLine, CurRange, SearchPos, Depth + 1);
        }

        return result;
    },

    //////////////////////////////////////

    /////////////////////////
    //  Text Properties
    ///////////////
    Get_TextPr: function(ContentPos, Depth)
    {
        var pos = ContentPos.Get(Depth);

        var TextPr;

        if(this.IsPlaceholder())
            TextPr = this.Parent.Get_CtrPrp();
        else
            TextPr = this.content[pos].Get_TextPr(ContentPos, Depth + 1);

        return TextPr;
    },
    Get_CompiledTextPr : function(Copy, bAll)
    {
        var TextPr = null;

        if(this.IsPlaceholder())
        {
            TextPr = this.Parent.Get_CompiledCtrPrp_2();
        }
        else if (this.Selection.Use || bAll == true)
        {
            var StartPos, EndPos;
            if(this.Selection.Use)
            {
                StartPos = this.Selection.Start;
                EndPos   = this.Selection.End;

                if ( StartPos > EndPos )
                {
                    StartPos = this.Selection.End;
                    EndPos   = this.Selection.Start;
                }
            }
            else
            {
                StartPos = 0;
                EndPos = this.content.length - 1;
            }

            while ( null === TextPr && StartPos <= EndPos )
            {
                TextPr = this.content[StartPos].Get_CompiledTextPr(Copy);
                StartPos++;
            }

            for ( var CurPos = StartPos; CurPos <= EndPos; CurPos++ )
            {
                var CurTextPr = this.content[CurPos].Get_CompiledPr(true);

                if ( null !== CurTextPr )
                    TextPr = TextPr.Compare( CurTextPr );
            }
        }
        else
        {
            var CurPos = this.CurPos;

            if ( CurPos >= 0 && CurPos < this.content.length )
                TextPr = this.content[CurPos].Get_CompiledTextPr(Copy);
        }

        return TextPr;
    },
    Apply_TextPr: function(TextPr, IncFontSize, ApplyToAll)
    {
        if ( true === ApplyToAll )
        {
            for ( var i = 0; i < this.content.length; i++ )
                this.content[i].Apply_TextPr( TextPr, IncFontSize, true );
        }
        else
        {
            var StartPos = this.Selection.Start;
            var EndPos   = this.Selection.End;

            var NewRuns;
            var LRun, CRun, RRun;

            var bSelectOneElement = this.Selection.Use && StartPos == EndPos;

            if( !this.Selection.Use || (bSelectOneElement && this.content[StartPos].Type == para_Math_Run) ) // TextPr меняем только в одном Run
            {
                var Pos = !this.Selection.Use ? this.CurPos :  StartPos;

                NewRuns = this.content[Pos].Apply_TextPr(TextPr, IncFontSize, false);

                LRun = NewRuns[0];
                CRun = NewRuns[1];
                RRun = NewRuns[2];

                var CRunPos = Pos;

                if(LRun !== null)
                {
                    this.Internal_Content_Add(Pos+1, CRun);
                    CRunPos = Pos + 1;
                }

                if(RRun !== null)
                {
                    this.Internal_Content_Add(CRunPos+1, RRun);
                }

                this.CurPos         = CRunPos;
                this.Selection.Start = CRunPos;
                this.Selection.End   = CRunPos;

            }
            else if(bSelectOneElement && this.content[StartPos].Type == para_Math_Composition)
            {
                this.content[StartPos].Apply_TextPr(TextPr, IncFontSize, true);
            }
            else
            {

                if(StartPos > EndPos)
                {
                    var temp = StartPos;
                    StartPos = EndPos;
                    EndPos = temp;
                }


                for(var i = StartPos + 1; i < EndPos; i++)
                    this.content[i].Apply_TextPr(TextPr, IncFontSize, true );


                if(this.content[EndPos].Type == para_Math_Run)
                {
                    NewRuns = this.content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);

                    // LRun - null
                    CRun = NewRuns[1];
                    RRun = NewRuns[2];

                    if(RRun !== null)
                    {
                        this.Internal_Content_Add(EndPos+1, RRun);
                    }

                }
                else
                    this.content[EndPos].Apply_TextPr(TextPr, IncFontSize, true);


                if(this.content[StartPos].Type == para_Math_Run)
                {
                    NewRuns = this.content[StartPos].Apply_TextPr(TextPr, IncFontSize, false);

                    LRun = NewRuns[0];
                    CRun = NewRuns[1];
                    // RRun - null


                    if(LRun !== null)
                    {
                        this.Internal_Content_Add(StartPos+1, CRun);
                    }

                }
                else
                    this.content[StartPos].Apply_TextPr(TextPr, IncFontSize, true);


                var bStartComposition = this.content[StartPos].Type == para_Math_Composition || (this.content[StartPos].Is_Empty() && this.content[StartPos + 1].Type == para_Math_Composition);
                var bEndCompostion    = this.content[EndPos].Type == para_Math_Composition || (this.content[EndPos].Is_Empty()   && this.content[EndPos - 1].Type == para_Math_Composition);

                if(!bStartComposition)
                {
                    if(this.Selection.Start < this.Selection.End && true === this.content[this.Selection.Start].Selection_IsEmpty(true) )
                        this.Selection.Start++;
                    else if (this.Selection.End < this.Selection.Start && true === this.content[this.Selection.End].Selection_IsEmpty(true) )
                        this.Selection.End++;
                }


                if(!bEndCompostion)
                {
                    if(this.Selection.Start < this.Selection.End && true === this.content[this.Selection.End].Selection_IsEmpty(true) )
                        this.Selection.End--;
                    else if (this.Selection.End < this.Selection.Start && true === this.content[this.Selection.Start].Selection_IsEmpty(true) )
                        this.Selection.Start--;
                }

            }
        }

    },
    Internal_Content_Add : function(Pos, Item, bUpdatePosition)
    {
        History.Add( this, { Type : historyitem_Math_AddItem, Pos : Pos, EndPos : Pos, Items : [ Item ] } );
        this.content.splice( Pos, 0, Item );

        if(bUpdatePosition !== false)
        {
            if ( this.CurPos >= Pos )
                this.CurPos++;

            if ( this.Selection.Start >= Pos )
                this.Selection.Start++;

            if ( this.Selection.End >= Pos )
                this.Selection.End++;
        }
    },

    Add_ToContent : function(Pos, Item)
    {
        this.Internal_Content_Add(Pos, Item);
    },
    Concat_ToContent: function(NewItems)
    {
        var StartPos = this.content.length;
        this.content = this.content.concat( NewItems );

        History.Add( this, { Type : historyitem_Math_AddItem, Pos : StartPos, EndPos : this.content.length - 1, Items : NewItems } );
    },

    Remove_FromContent : function(Pos, Count)
    {
        var DeletedItems = this.content.splice(Pos, Count);
        History.Add( this, { Type : historyitem_Math_RemoveItem, Pos : Pos, EndPos : Pos + Count - 1, Items : DeletedItems } );

        if(this.CurPos > Pos)
        {
            if(this.CurPos >= Pos + Count)
                this.CurPos -= Count;
            else
                this.CurPos = Pos;
        }

        if ( true === this.Selection.Use )
        {
            if(this.Selection.Start > Pos)
            {
                if(this.Selection.Start >= Pos + Count)
                    this.Selection.Start -= Count;
                else
                    this.Selection.Start = Pos;
            }

            if(this.Selection.End > Pos)
            {
                if(this.Selection.End >= Pos + Count)
                    this.Selection.End -= Count;
                else
                    this.Selection.End = Pos;
            }
        }


    },

    Get_Default_TPrp: function()
    {
        return this.ParaMath.Get_Default_TPrp();
    },

    //////////////////////////////
    // Перемещение по стрелкам
    ////////////////////
    Get_LeftPos: function(SearchPos, ContentPos, Depth, UseContentPos, EndRun)
    {
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : this.content.length-1;

        while(CurPos >= 0 && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].Type,
                prevType = CurPos > 0 ? this.content[CurPos - 1].Type : null;

            /*if(curType == MATH_PLACEHOLDER)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else */
            if(curType == para_Math_Composition)
            {
                var bNotshift     = SearchPos.ForSelection == false,
                    bShiftCurrObj = (SearchPos.ForSelection == true && this.Selection.Start == CurPos);

                if( bNotshift || bShiftCurrObj )
                    this.content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, UseContentPos, EndRun);
            }
            else if(EndRun)
            {
                SearchPos.Pos.Update(this.content[CurPos].Content.length, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
            }

            SearchPos.Pos.Update(CurPos, Depth);


            // если перемещаемся между контентами мат объекта, то надо выставить курсор в конец следующего контента, в конечную позицию последнего рана
            EndRun = (curType == para_Math_Run && prevType == para_Math_Run) ? false : true;

            CurPos--;
            UseContentPos = false;
        }


        /// для коррекции позиции курсора в начале Run
        // используется функция Correct_ContentPos в Paragraph

        return SearchPos.Found;
    },
    Get_RightPos: function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, BegRun)
    {
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : 0;

        while(CurPos < this.content.length && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].Type,
                nextType = CurPos < this.content.length - 1 ? this.content[CurPos + 1].Type : null;

            /*if(curType == MATH_PLACEHOLDER)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else */
            if(curType == para_Math_Composition)
            {
                var bNotshift     = SearchPos.ForSelection == false,
                    bShiftCurrObj = SearchPos.ForSelection == true && this.Selection.Start == CurPos;

                if( bNotshift || bShiftCurrObj )
                    this.content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd, BegRun);
            }
            else if(BegRun)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
            }

            SearchPos.Pos.Update(CurPos, Depth);

            // если перемещаемся между контентами мат объекта, то надо выставить курсор в начало следующего контента, в начальную позицию первого рана
            BegRun = (curType == para_Math_Run && nextType == para_Math_Run) ? false : true;


            CurPos++;
            UseContentPos = false;
        }

        return SearchPos.Found;
    },
    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos, EndRun)
    {
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : this.content.length-1;

        while(CurPos >= 0 && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].Type,
                prevType = CurPos > 0 ? this.content[CurPos - 1].Type : null;

            if(curType == para_Math_Composition)
            {
                var bNotshift     = SearchPos.ForSelection == false,
                    bShiftCurrObj = (SearchPos.ForSelection == true && this.Selection.Start == CurPos);

                if( bNotshift || bShiftCurrObj )
                    this.content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos, EndRun);
            }
            else if(EndRun)
            {
                SearchPos.Pos.Update(this.content[CurPos].Content.length, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);

                if(SearchPos.Found == false && SearchPos.Shift == true)
                {
                    this.content[CurPos].Get_StartPos(SearchPos.Pos, Depth + 1);
                    SearchPos.Found = true;
                }
            }

            SearchPos.Pos.Update(CurPos, Depth);

            // если перемещаемся между контентами мат объекта, то надо выставить курсор в конец следующего контента, в конечную позицию последнего рана
            EndRun = (curType == para_Math_Run && prevType == para_Math_Run) ? false : true;


            CurPos--;
            UseContentPos = false;
        }

    },
    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, BegRun)
    {
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : 0;

        while(CurPos < this.content.length && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].Type,
                nextType = CurPos < this.content.length - 1 ? this.content[CurPos + 1].Type : null;

            if(curType == para_Math_Composition)
            {
                var bNotshift     = SearchPos.ForSelection == false,
                    bShiftCurrObj = SearchPos.ForSelection == true && this.Selection.Start == CurPos;

                if( bNotshift || bShiftCurrObj )
                    this.content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd, BegRun);
            }
            else if(BegRun)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);

                if(SearchPos.Found == false && SearchPos.Shift == true)
                {
                    this.content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
                    SearchPos.Found = true;
                }
            }

            SearchPos.Pos.Update(CurPos, Depth);

            // если перемещаемся между контентами мат объекта, то надо выставить курсор в начало следующего контента, в начальную позицию первого рана
            BegRun = (curType == para_Math_Run && nextType == para_Math_Run) ? false : true;


            CurPos++;
            UseContentPos = false;

        }
    },
    /////////////////////////
    Is_Empty:    function()
    {
        return this.content.length == 0;
    },

    Copy: function(Selected)
    {
        var NewContent = new CMathContent();
        this.CopyTo(NewContent, Selected);
        return NewContent;
    },

    CopyTo : function(OtherContent, Selected)
    {
        var nStartPos, nEndPos;

        if(true === Selected)
        {
            if(this.Selection.Start < this.Selection.End)
            {
                nStartPos = this.Selection.Start;
                nEndPos   = this.Selection.End;
            }
            else
            {
                nStartPos = this.Selection.End;
                nEndPos   = this.Selection.Start;
            }
        }
        else
        {
            nStartPos = 0;
            nEndPos   = this.content.length - 1;
        }

        OtherContent.plHid = this.plhHide;

        for(var nPos = nStartPos; nPos <= nEndPos; nPos++)
        {
            var oElement;
            if(this.content[nPos].Type == para_Math_Run)
                oElement = this.content[nPos].Copy(Selected);
            else
                oElement = this.content[nPos].Copy(false);

            OtherContent.Internal_Content_Add(OtherContent.length, oElement);
        }
    },
    Selection_Remove: function()
    {
        var start = this.Selection.Start,
            end   = this.Selection.End;

        var lng = this.content.length;

        if(start >= 0 && start < lng && end >=0 && end < lng)
        {
            this.content[start].Selection_Remove();

            if(start !== end)
                this.content[end].Selection_Remove();
        }

        this.Selection.Use = false;
    },
    Set_Select_ToMComp: function(Direction)
    {
        this.Selection.Use = true;

        if(this.content[this.CurPos].Type == para_Math_Run)
        {
            if(Direction < 0 && this.CurPos > 0 && this.content[this.CurPos - 1].Type == para_Math_Composition)
            {
                this.Selection.Start = this.Selection.End = this.CurPos - 1;
                this.content[this.CurPos - 1].SetSelectAll();
            }
            else if(this.CurPos < this.content.length - 1 && this.content[this.CurPos + 1].Type == para_Math_Composition)
            {
                this.Selection.Start = this.Selection.End = this.CurPos + 1;
                this.content[this.CurPos + 1].SetSelectAll();
            }
        }
        else if(this.content[this.CurPos].Type == para_Math_Composition)
        {
            if(this.content[this.CurPos].IsPlaceholder())
            {
                this.Selection.Start = this.Selection.End = this.CurPos;
                this.content[this.CurPos].SetSelectAll();
            }
            else
            {
                this.Selection.Start = this.Selection.End = this.CurPos;
                this.content[this.CurPos].Set_Select_ToMComp(Direction);
            }

        }
    },
    getElem: function(nNum)
    {
        return this.content[nNum];
    },
    Is_FirstComposition: function()
    {
        var result = false;
        if(this.content.length > 1)
        {
            var bEmptyRun = this.content[0].Is_Empty(),
                bMathComp    = this.content[1].Type == para_Math_Composition;

            if(bEmptyRun && bMathComp)
                result = true;
        }

        return result;
    },

    ////////////////////////////////////////////////////////////////

    Undo: function(Data)
    {
        var type = Data.Type;

        switch(type)
        {
            case historyitem_Math_AddItem:
            {
                this.content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);

                this.ParaMath.SetNeedResize();
                break;
            }
            case historyitem_Math_RemoveItem:
            {
                var Pos = Data.Pos;

                var Array_start = this.content.slice(0, Pos);
                var Array_end   = this.content.slice(Pos);

                this.content = Array_start.concat(Data.Items, Array_end);

                this.ParaMath.SetNeedResize();
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

                var Array_start = this.content.slice(0, Pos);
                var Array_end   = this.content.slice(Pos);

                this.content = Array_start.concat(Data.Items, Array_end);

                this.ParaMath.SetNeedResize();
                break;
            }
            case historyitem_Math_RemoveItem:
            {
                this.content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);

                this.ParaMath.SetNeedResize();
                break;
            }
        }
    },	
    Save_Changes: function(Data, Writer)
    {
        Writer.WriteLong(historyitem_type_MathContent);

        var Type = Data.Type;
        // Пишем тип
        Writer.WriteLong(Type);

        switch (Type)
        {
            case historyitem_Math_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Id элемента
                //  }

                var Count = Data.Items.length;

                Writer.WriteLong(Count);

                for (var Index = 0; Index < Count; Index++)
                {
                    Writer.WriteLong(Data.Pos + Index);
                    Writer.WriteString2(Data.Items[Index].Get_Id());
                }

                break;
            }
            case historyitem_Math_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Data.Items.length;

                Writer.WriteLong(Count);
                for (var Index = 0; Index < Count; Index++)
                {
                    Writer.WriteLong(Data.Pos);
                }

                break;
            }
        }
    },
    Load_Changes : function(Reader)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_MathContent != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case  historyitem_Math_AddItem:
            {
                // Long     : Количество элементов
                // Array of :
                //  {
                //    Long     : Позиция
                //    Variable : Id Элемента
                //  }

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = Reader.GetLong();
                    var Element = g_oTableId.Get_ById( Reader.GetString2() );

                    if ( null != Element )
                        this.content.splice(Pos, 0, Element);
                }

                break;
            }
			case historyitem_Math_RemoveItem:
            {
                // Long          : Количество удаляемых элементов
                // Array of Long : позиции удаляемых элементов

                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var ChangesPos = Reader.GetLong();
                    this.content.splice(ChangesPos, 1);
                }

                break;
            }
        }
    },
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong(historyitem_type_MathContent);

        // Long : Id
        Writer.WriteString2(this.Id);
    },
    Read_FromBinary2 : function(Reader)
    {
        // Long : Id
        this.Id = Reader.GetString2();
    },
    Refresh_RecalcData: function()
    {
        if(this.ParaMath !== null)
            this.ParaMath.Refresh_RecalcData(); // Refresh_RecalcData сообщает родительскому классу, что у него произошли изменения, нужно пересчитать
    },
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
	Load_FromMenu: function(Type, Paragraph)
	{
		var oFName;
		this.Paragraph = Paragraph;
		var props = {ctrPrp: new CTextPr()};
		switch (Type)
		{
			case 1: 	var oFraction = new CFraction(props);						
						this.CreateFraction(oFraction, this, null, null);
						break;
			case 2: 	props = {ctrPrp: new CTextPr(), type:SKEWED_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						break;
			case 3: 	props = {ctrPrp: new CTextPr(), type:LINEAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						break;
			case 4: 	var oBox = new CBox(props);
						this.CreateElem(oBox, this)
						
						var oElem = oBox.getBase();
						//здесь выставляем для oElem argPr.argSz=-1; этой обертки нет
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, oElem, null, null);
						break;
			case 5: 	var oFraction = new CFraction(props);
						var sNum = "dx";
						var sDen = "dy";
						this.CreateFraction(oFraction,this, sNum, sDen);
						break;
			case 6: 	var sNum = String.fromCharCode(916) + "y";
						var sDen = String.fromCharCode(916) + "x";
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, sNum, sDen);
						break;
			case 7: 	var sNum = String.fromCharCode(8706) + "y";
						var sDen = String.fromCharCode(8706) + "x";
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, sNum, sDen);
						break;
			case 8: 	var sNum = String.fromCharCode(948) + "y";
						var sDen = String.fromCharCode(948) + "x";
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, sNum, sDen);
						break;
			case 9: 	var sNum = String.fromCharCode(960);
						var sDen = "2";
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, sNum, sDen);
						break;
			case 10:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, this, null, null, null);
						break;
			case 11:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, this, null, null, null);
						break;
			case 12:	props = {ctrPrp: new CTextPr(), type:DEGREE_SubSup};
						var oDegree = new CDegreeSubSup(props);
						this.CreateDegree(oDegree, this, null, null, null);
						var oSub = oDegree.getLowerIterator();
						var oSup = oDegree.getUpperIterator();
						var oElem = oDegree.getBase();
						break;
			case 13:	props = {ctrPrp: new CTextPr(), type:DEGREE_PreSubSup};
						var oDegree = new CDegreeSubSup(props);
						this.CreateDegree(oDegree, this, null, null, null);
						var oSub = oDegree.getLowerIterator();
						var oSup = oDegree.getUpperIterator();
						var oElem = oDegree.getBase();
						break;
			case 14:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};			
						var oDegree = new CDegree(props);
						this.CreateElem(oDegree, this)
						
						var oElem = oDegree.getBase();
						this.AddText(oElem, "x");						
						var oSub = oDegree.getLowerIterator();						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};	
						var sBase = "y"
						var sSup = "2"						
						var oDegree1 = new CDegree(props);
						this.CreateDegree(oDegree1, oSub, sBase, sSup, null);
						break;
			case 15:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "e";
						var sSup = "-i" + String.fromCharCode(969) + "t";						
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, this, sBase, sSup, null);
						break;
			case 16:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "x";
						var sSup = "2";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, this, sBase, sSup, null);
						break;
			case 17:	props = {ctrPrp: new CTextPr(), type:DEGREE_PreSubSup};
						var sBase = "Y";
						var sSup = "n";
						var sSub = "1";						
						var oDegreeSubSup = new CDegreeSubSup(props);
						this.CreateDegree(oDegreeSubSup, this, sBase, sSup, sSub);
						break;
			case 18:	props = {ctrPrp: new CTextPr(), type:SQUARE_RADICAL, degHide:true};					
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, null);
						oRadical.Iterator = null;
						break;
			case 19:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};					
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, null);
						break;
			case 20:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};
						var sDeg = "2";						
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, sDeg);
						var oElem = oRadical.getBase();
						break;
			case 21:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};
						var sDeg = "3";						
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, sDeg);
						var oElem = oRadical.getBase();
						break;
			case 22:	var oFraction = new CFraction(props);						
						this.CreateElem(oFraction, this);
						
						var oElemNum = oFraction.getNumerator();
						var sText = "-b" + String.fromCharCode(177);
						this.AddText(oElemNum, sText);
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL, degHide:true};
						var oRadical = new CRadical(props);
						this.CreateElem(oRadical, oElemNum);						
						var oElem = oRadical.getBase();
						oRadical.Iterator = null;
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateElem(oDegree, oElem);						
						var oDegElem = oDegree.getBase();
						this.AddText(oDegElem, "b");
						var oDegSup = oDegree.getUpperIterator();
						this.AddText(oDegSup, "2");
						
						this.AddText(oElem, "-4ac");					
						
						var oElemDen = oFraction.getDenominator();
						this.AddText(oElemDen, "2a");												
						break;
			case 23:	props = {ctrPrp: new CTextPr(), type:SQUARE_RADICAL, degHide:true};
						var oRadical = new CRadical(props);
						this.CreateElem(oRadical, this);
						oRadical.Iterator = null;
						
						var oElem = oRadical.getBase();
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "a";
						var sSup = "2";
						var oDegree1 = new CDegree(props);
						this.CreateDegree(oDegree1, oElem, sBase, sSup, null);
						
						this.AddText(oElem, "+");
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						sBase = "b";
						sSup = "2";
						var oDegree2 = new CDegree(props);
						this.CreateDegree(oDegree2, oElem, sBase, sSup, null);						
						break;
			case 24:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 25:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 26:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 27:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:8748};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 28:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:8748};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 29:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:8748};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 30:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:8749};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 31:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:8749};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 32:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:8749};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 33:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:8750};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 34:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:8750};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 35:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:8750};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 36:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:8751};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 37:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:8751};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 38:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:8751};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 39:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:8752};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 40:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:8752};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 41:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:8752};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 42:	props = {ctrPrp: new CTextPr(), diff:1};
						var sVal = "dx";
						var oBox = new CBox(props);
						this.CreateBox(oBox,this,sVal);
						break;
			case 43:	props = {ctrPrp: new CTextPr(), diff:1};
						var sVal = "dy";
						var oBox = new CBox(props);
						this.CreateBox(oBox,this,sVal);
						break;
			case 44:	props = {ctrPrp: new CTextPr(), diff:1};
						var sVal = "d" + String.fromCharCode(952);
						var oBox = new CBox(props);
						this.CreateBox(oBox,this,sVal);
						break;
			case 45:	props = {ctrPrp: new CTextPr(), chr:8721, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 46:	props = {ctrPrp: new CTextPr(), chr:8721, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 47:	props = {ctrPrp: new CTextPr(), chr:8721, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 48:	props = {ctrPrp: new CTextPr(), chr:8721, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 49:	props = {ctrPrp: new CTextPr(), chr:8721, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 50:	props = {ctrPrp: new CTextPr(), chr:8719, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 51:	props = {ctrPrp: new CTextPr(), chr:8719, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 52:	props = {ctrPrp: new CTextPr(), chr:8719, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 53:	props = {ctrPrp: new CTextPr(), chr:8719, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 54:	props = {ctrPrp: new CTextPr(), chr:8719, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 55:	props = {ctrPrp: new CTextPr(), chr:8720, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 56:	props = {ctrPrp: new CTextPr(), chr:8720, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 57:	props = {ctrPrp: new CTextPr(), chr:8720, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 58:	props = {ctrPrp: new CTextPr(), chr:8720, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 59:	props = {ctrPrp: new CTextPr(), chr:8720, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 60:	props = {ctrPrp: new CTextPr(), chr:8899, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 61:	props = {ctrPrp: new CTextPr(), chr:8899, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 62:	props = {ctrPrp: new CTextPr(), chr:8899, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 63:	props = {ctrPrp: new CTextPr(), chr:8899, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 64:	props = {ctrPrp: new CTextPr(), chr:8899, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 65:	props = {ctrPrp: new CTextPr(), chr:8898, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 66:	props = {ctrPrp: new CTextPr(), chr:8898, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 67:	props = {ctrPrp: new CTextPr(), chr:8898, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 68:	props = {ctrPrp: new CTextPr(), chr:8898, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 69:	props = {ctrPrp: new CTextPr(), chr:8898, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 70:	props = {ctrPrp: new CTextPr(), chr:8897, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 71:	props = {ctrPrp: new CTextPr(), chr:8897, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 72:	props = {ctrPrp: new CTextPr(), chr:8897, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 73:	props = {ctrPrp: new CTextPr(), chr:8897, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 74:	props = {ctrPrp: new CTextPr(), chr:8897, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 75:	props = {ctrPrp: new CTextPr(), chr:8896, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						break;
			case 76:	props = {ctrPrp: new CTextPr(), chr:8896, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 77:	props = {ctrPrp: new CTextPr(), chr:8896, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						break;
			case 78:	props = {ctrPrp: new CTextPr(), chr:8896, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 79:	props = {ctrPrp: new CTextPr(), chr:8896, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						break;
			case 80:	props = {ctrPrp: new CTextPr(), chr:8721, supHide:true};
						var oNary = new CNary(props);
						this.CreateElem(oNary,this);
						var narySub = oNary.getLowerIterator();
						this.AddText(narySub, "k");
						var naryBase = oNary.getBase();
						
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,naryBase);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, delimiterBase, "n", "k");
						break
			case 81:	props = {ctrPrp: new CTextPr(), chr:8721};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,"i=0","n");
						var oElem = oNary.getBase();
						break;
			case 82:	props = {ctrPrp: new CTextPr(), chr:8721, supHide:true};
						var oNary = new CNary(props);
						this.CreateElem(oNary,this);
						var narySub = oNary.getLowerIterator();
						
						props = {ctrPrp: new CTextPr(), row:2};
						var oEqArr = new CEqArray(props);
						this.CreateElem(oEqArr, narySub);
						var eqarrElem0 = oEqArr.getElement(0);
						this.AddText(eqarrElem0, "0≤ i ≤ m");
						var eqarrElem1 = oEqArr.getElement(1);
						this.AddText(eqarrElem1, "0< j < n");

						var naryBase = oNary.getBase();
						this.AddText(naryBase, "P");
						
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,naryBase);
						var delimiterBase = oDelimiter.getBase(0);
						this.AddText(delimiterBase, "i,j");
						break;						
			case 83:	props = {ctrPrp: new CTextPr(), chr:8719};
						var oNary = new CNary(props);
						this.CreateElem(oNary, this);
						var narySup = oNary.getUpperIterator();
						this.AddText(narySup, "n");
						var narySub = oNary.getLowerIterator();
						this.AddText(narySub, "k=1");
						var naryBase = oNary.getBase();
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub = new CDegree(props);
						this.CreateDegree(oSSub, naryBase, "A", null, "k");
						break;
			case 84:	props = {ctrPrp: new CTextPr(), chr:8899};
						var oNary = new CNary(props);
						this.CreateElem(oNary,this);
						
						var narySub = oNary.getLowerIterator();
						this.AddText(narySub, "n=1");
						var narySup = oNary.getUpperIterator();
						this.AddText(narySup, "m");
						var naryBase = oNary.getBase();
						
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,naryBase);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub0 = new CDegree(props);
						this.CreateDegree(oSSub0, delimiterBase, "X", null, "n"); 
						
						var sChar = String.fromCharCode(8898);
						this.AddText(delimiterBase, sChar);
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub1 = new CDegree(props);
						this.CreateDegree(oSSub1, delimiterBase, "Y", null, "n"); 					
						break;
			case 85:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 86:	props = {ctrPrp: new CTextPr(), column:1, begChr:91, endChr:93};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 87:	props = {ctrPrp: new CTextPr(), column:1, begChr:123, endChr:125};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 88:	props = {ctrPrp: new CTextPr(), column:1, begChr:10216, endChr:10217};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 89:	props = {ctrPrp: new CTextPr(), column:1, begChr:9123, endChr:9126};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 90:	props = {ctrPrp: new CTextPr(), column:1, begChr:9121, endChr:9124};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 91:	props = {ctrPrp: new CTextPr(), column:1, begChr:124, endChr:124};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 92:	props = {ctrPrp: new CTextPr(), column:1, begChr:8214, endChr:8214};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 93:	props = {ctrPrp: new CTextPr(), column:1, begChr:91, endChr:91};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 94:	props = {ctrPrp: new CTextPr(), column:1, begChr:93, endChr:93};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 95:	props = {ctrPrp: new CTextPr(), column:1, begChr:93, endChr:91};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 96:	props = {ctrPrp: new CTextPr(), column:1, begChr:10214, endChr:10215};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 97:	props = {ctrPrp: new CTextPr(), column:2};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 98:	props = {ctrPrp: new CTextPr(), column:2, begChr:123, endChr:125};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 99:	props = {ctrPrp: new CTextPr(), column:2, begChr:10216, endChr:10217};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 100:	props = {ctrPrp: new CTextPr(), column:3, begChr:10216, endChr:10217};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 101:	props = {ctrPrp: new CTextPr(), column:1, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 102:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 103:	props = {ctrPrp: new CTextPr(), column:1, begChr:91, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 104:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:93};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 105:	props = {ctrPrp: new CTextPr(), column:1, begChr:123, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 106:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:125};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 107:	props = {ctrPrp: new CTextPr(), column:1, begChr:10216, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 108:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:10217};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 109:	props = {ctrPrp: new CTextPr(), column:1, begChr:9123, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 110:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:9126};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 111:	props = {ctrPrp: new CTextPr(), column:1, begChr:9121, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 112:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:9124};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 113:	props = {ctrPrp: new CTextPr(), column:1, begChr:124, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 114:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:124};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 115:	props = {ctrPrp: new CTextPr(), column:1, begChr:8214, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 116:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:8214};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 117:	props = {ctrPrp: new CTextPr(), column:1, begChr:10214, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 118:	props = {ctrPrp: new CTextPr(), column:1, begChr:-1, endChr:10215};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						break;
			case 119:	props = {ctrPrp: new CTextPr(), column:1, begChr:123, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:2};
						var oEqArr = new CEqArray(props);
						this.CreateElem(oEqArr,oElem);
						break;
			case 120:	props = {ctrPrp: new CTextPr(), column:1, begChr:123, endChr:-1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:3};
						var oEqArr = new CEqArray(props);						
						this.CreateElem(oEqArr,oElem);
						break;
			case 121:	props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						break;
			case 122:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction,oElem,null,null);
						break;
			case 123:	this.AddText(this, "f");
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter1 = new CDelimiter(props);
						this.CreateElem(oDelimiter1,this);
						var del1Elem = oDelimiter1.getBase(0);
						this.AddText(del1Elem, "x");
						this.AddText(this, "=");
						
						props = {ctrPrp: new CTextPr(), column:1, begChr:123, endChr:-1};
						var oDelimiter2 = new CDelimiter(props);
						this.CreateElem(oDelimiter2,this);
						var del2Elem = oDelimiter2.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:2};
						var oEqArr = new CEqArray(props);
						this.CreateElem(oEqArr, del2Elem);
						
						var eqArrElem0 = oEqArr.getElement(0);
						this.AddText(eqArrElem0, "-x,  &x<0");
						var eqArrElem0 = oEqArr.getElement(1);
						var sTxt = "x,  &x" + String.fromCharCode(8805) + "0";
						this.AddText(eqArrElem0,sTxt);
						break;
			case 124:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction,oElem,"n","k");
						break;
			case 125:	props = {ctrPrp: new CTextPr(), column:1, begChr:10216, endChr:10217};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction,oElem,"n","k");
						break;
			case 126:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sin", props);
						var oElem = oFunc.getArgument();
						break;
			case 127:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cos", props);
						var oElem = oFunc.getArgument();
						break;
			case 128:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "tan", props);
						var oElem = oFunc.getArgument();
						break;
			case 129:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "csc", props);
						var oElem = oFunc.getArgument();
						break;
			case 130:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sec", props);
						var oElem = oFunc.getArgument();
						break;
			case 131:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cot", props);
						var oElem = oFunc.getArgument();
						break;
			case 132:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "sin";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						break;
			case 133:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "cos";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						break;
			case 134:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "tan";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 135:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "csc";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 136:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "sec";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 137:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "cot";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 138:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sinh", props);
						var oElem = oFunc.getArgument();
						break;
			case 139:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cosh", props);
						var oElem = oFunc.getArgument();
						break;
			case 140:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "tanh", props);
						var oElem = oFunc.getArgument();
						break;
			case 141:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "csch", props);
						var oElem = oFunc.getArgument();
						break;
			case 142:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sech", props);
						var oElem = oFunc.getArgument();
						break;
			case 143:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "coth", props);
						var oElem = oFunc.getArgument();
						break;
			case 144:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "sinh";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);	
						var oElem = oFunc.getArgument();
						break;
			case 145:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "cosh";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 146:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "tanh";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 147:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "csch";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 148:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "sech";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 149:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var sBase = "coth";
						var sSup = "-1";
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, oFName, sBase, sSup, null);
						var oElem = oFunc.getArgument();
						break;
			case 150:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sin", props);
						
						oArg = oFunc.getArgument();
						var argText = String.fromCharCode(952);
						this.AddText(oArg, argText);
						break;
			case 151:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cos", props);
						
						oArg = oFunc.getArgument();
						this.AddText(oArg, "2x");
						break;
			case 152:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "tan", props);						
						oArg = oFunc.getArgument();
						var argText = String.fromCharCode(952);
						this.AddText(oArg, argText);
						this.AddText(this, "=");
						
						props = {ctrPrp: new CTextPr()};
						var oFraction = new CFraction(props);
						this.CreateElem(oFraction, this);
						
						var oNum = oFraction.getNumerator();						
						props = {ctrPrp: new CTextPr()};
						var oFuncNum = new CMathFunc(props);
						this.CreateElem(oFuncNum,oNum);
						var oFNameNum = oFuncNum.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFNameNum, "sin", props);						
						var oArgNum = oFuncNum.getArgument();
						this.AddText(oArgNum, argText);
						
						var oDen = oFraction.getDenominator();
						props = {ctrPrp: new CTextPr()};
						var oFuncDen = new CMathFunc(props);
						this.CreateElem(oFuncDen,oDen);
						var oFNameDen = oFuncDen.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFNameDen, "cos", props);						
						var oArgDen = oFuncDen.getArgument();
						this.AddText(oArgDen, argText);						
						break;
			case 153:	props = {ctrPrp: new CTextPr(), chr:775};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 154:	props = {ctrPrp: new CTextPr(), chr:776};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 155:	props = {ctrPrp: new CTextPr(), chr:8411};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 156:	var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 157:	props = {ctrPrp: new CTextPr(), chr:780};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 158:	props = {ctrPrp: new CTextPr(), chr:769};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 159:	props = {ctrPrp: new CTextPr(), chr:768};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 160:	props = {ctrPrp: new CTextPr(), chr:774};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 161:	props = {ctrPrp: new CTextPr(), chr:771};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 162:	props = {ctrPrp: new CTextPr(), chr:773};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 163:	props = {ctrPrp: new CTextPr(), chr:831};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 164:	props = {ctrPrp: new CTextPr(), chr:9182, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,this);
						break;
			case 165:	oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,this);
						break;
			case 166:	props = {ctrPrp: new CTextPr(), type:LIMIT_UP};
						var oLimUpp = new CLimit(props);
						this.CreateElem(oLimUpp,this);
						var oLim = oLimUpp.getIterator();
						var oElem = oLimUpp.getFName();
				
						props = {ctrPrp: new CTextPr(), chr:9182, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var grElem = oGroupChr.getBase();
						break;
			case 167:	props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow,this);
						var oLim = oLimLow.getIterator();
						var oElem = oLimLow.getFName();
				
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var grElem = oGroupChr.getBase();
						break;
			case 168:	props = {ctrPrp: new CTextPr(), chr:8406};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 169:	props = {ctrPrp: new CTextPr(), chr:8407};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 170:	props = {ctrPrp: new CTextPr(), chr:8417};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 171:	props = {ctrPrp: new CTextPr(), chr:8400};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 172:	props = {ctrPrp: new CTextPr(), chr:8401};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						break;
			case 173:	var oBorderBox = new CBorderBox(props);
						this.CreateElem(oBorderBox,this);
						break;
			case 174:	var oBorderBox = new CBorderBox(props);
						this.CreateElem(oBorderBox,this);
						var oElem = oBorderBox.getBase();
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var oDegree0 = new CDegree(props);
						this.CreateDegree(oDegree0, oElem, "a", "2", null);
						this.AddText(oElem, "=");
						var oDegree1 = new CDegree(props);
						this.CreateDegree(oDegree1, oElem, "b", "2", null);
						this.AddText(oElem, "+");
						var oDegree2 = new CDegree(props);
						this.CreateDegree(oDegree2, oElem, "c", "2", null);					
						break;
			case 175:	props = {ctrPrp: new CTextPr(), pos:LOCATION_TOP};
						var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						break;
			case 176:	var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						break;
			case 177:	props = {ctrPrp: new CTextPr(), pos:LOCATION_TOP};
						var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						oElem = oBar.getBase();
						this.AddText(oElem, "A");
						break;
			case 178:	props = {ctrPrp: new CTextPr(), pos:LOCATION_TOP};
						var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						oElem = oBar.getBase();
						this.AddText(oElem, "ABC");
						break;
			case 179:	props = {ctrPrp: new CTextPr(), pos:LOCATION_TOP};
						var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						oElem = oBar.getBase();
						var sText = "x" + String.fromCharCode(8853) + "y";
						this.AddText(oElem, sText);
						break;
			case 180:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);		
						var oArg = oFunc.getArgument();
						oFName = oFunc.getFName();
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub = new CDegree(props);
						this.CreateElem(oSSub, oFName);
						
						var sSubBase = oSSub.getBase();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(sSubBase, "log", props);
						var oSub = oSSub.getLowerIterator();
						break;
			case 181:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "log", props);
						break;
			case 182:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
							
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);						
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "lim", props);	
						
						var oLim = oLimLow.getIterator();
						break;
			case 183:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						var oArg = oFunc.getArgument();
						
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						var oLim = oLimLow.getIterator();
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "min", props);						
						break;
			case 184:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						var oArg = oFunc.getArgument();
						
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						var oLim = oLimLow.getIterator();
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "max", props);						
						break;
			case 185:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
						
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "ln", props);
						break;
			case 186:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						
						oFName = oFunc.getFName();							
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						var limLowElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(limLowElem, "lim", props);
						var limLowLim = oLimLow.getIterator();
						var sText = "n" + String.fromCharCode(8594,8734)
						this.AddText(limLowLim, sText);
						
						var oElem = oFunc.getArgument();
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateElem(oDegree, oElem);
						var oSup = oDegree.getUpperIterator();
						this.AddText(oSup, "n");
						var degreeElem = oDegree.getBase();
						
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,degreeElem);
						var delElem = oDelimiter.getBase(0);
						this.AddText(delElem,"1+");
						
						props = {ctrPrp: new CTextPr()};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction,delElem,"1","n");
						break;
			case 187:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						
						oFName = oFunc.getFName();
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						
						var limLowElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(limLowElem, "max", props);
						var limLowLim = oLimLow.getIterator();
						var sText = "0" + String.fromCharCode(8804) + "x" + String.fromCharCode(8804) + "1";
						this.AddText(limLowLim, sText);
						
						var oElem = oFunc.getArgument();
						this.AddText(oElem, "x");
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateElem(oDegree, oElem);
						var degreeElem = oDegree.getBase();
						this.AddText(degreeElem, "e");
						
						var oSup = oDegree.getUpperIterator();
						this.AddText(oSup, "-");
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUPERSCRIPT};
						var supSup = new CDegree(props);
						this.CreateElem(supSup, oSup);
						var supElem = supSup.getBase();
						this.AddText(supElem, "x");
						var supSupSup = supSup.getUpperIterator();
						this.AddText(supSupSup, "2");
						break;
			case 188:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						this.AddText(oElem, ":=");
						break;
			case 189:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						this.AddText(oElem, "==");
						break;
			case 190:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						this.AddText(oElem, "+=");
						break;
			case 191:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						this.AddText(oElem, "-=");
						break;
			case 192:	var sText = String.fromCharCode(8797);
						this.AddText(this, sText);
						break;
			case 193:	var sText = String.fromCharCode(8798);
						this.AddText(this, sText);
						break;
			case 194:	var sText = String.fromCharCode(8796);
						this.AddText(this, sText);
						break;
			case 195:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8592}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 196:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8594}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 197:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8592}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 198:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8594}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 199:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8656}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 200:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8658}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 201:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8656}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 202:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8658}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 203:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8596}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 204:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8596}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 205:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:8660}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 206:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8660}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						break;
			case 207:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8594}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var groupElem = oGroupChr.getBase();
						this.AddText(groupElem,"yields");
						break;
			case 208:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:8594}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var groupElem = oGroupChr.getBase();
						var sText = String.fromCharCode(8710);
						this.AddText(groupElem,sText);
						break;
			case 209:	var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:1, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;		
			case 210:	var oMcs = [{count: 1, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;	
			case 211:	var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:1, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;
			case 212:	var oMcs = [{count: 1, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;	
			case 213:	var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;
			case 214:	var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;
			case 215:	var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;
			case 216:	var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						break;
			case 217:	var sText = String.fromCharCode(8943);
						this.AddText(this,sText);
						break;
			case 218:	var sText = String.fromCharCode(8230);
						this.AddText(this,sText);
						break;
			case 219:	var sText = String.fromCharCode(8942);
						this.AddText(this,sText);
						break;
			case 220:	var sText = String.fromCharCode(8945);
						this.AddText(this,sText);
						break;
			case 221:	var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						var oElem = oMatrix.getElement(0,0);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(0,1);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,0);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,1);
						this.AddText(oElem, "1");
						break;
			case 222:	var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs, plcHide:1};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						var oElem = oMatrix.getElement(0,0);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,1);
						this.AddText(oElem, "1");
						break;
			case 223:	var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						var oElem = oMatrix.getElement(0,0);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(0,1);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(0,2);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,0);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(1,1);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,2);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,0);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,1);
						this.AddText(oElem, "0");
						oElem = oMatrix.getElement(2,2);
						this.AddText(oElem, "1");
						break;
			case 224:	var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs, plcHide:1};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						var oElem = oMatrix.getElement(0,0);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,1);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(2,2);
						this.AddText(oElem, "1");
						break;
			case 225:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						break;
			case 226:	props = {ctrPrp: new CTextPr(), column:1,begChr:91, endChr:93};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						break;
			case 227:	props = {ctrPrp: new CTextPr(), column:1,begChr:124, endChr:124};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						break;
			case 228:	props = {ctrPrp: new CTextPr(), column:1,begChr:8214, endChr:8214};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 2, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:2, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						break;
			case 229:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						
						var oElem = oMatrix.getElement(0,0);
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem = oMatrix.getElement(1,0);
						sText = String.fromCharCode(8942);
						this.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,1);
						sText = String.fromCharCode(8945);
						this.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,2);
						sText = String.fromCharCode(8942);
						this.AddText(oElem, sText);			
						oElem = oMatrix.getElement(2,0);
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						
						break;
			case 230:	props = {ctrPrp: new CTextPr(), column:1,begChr:91, endChr:93};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						var oMcs = [{count: 3, mcJc:MCJC_CENTER}];
						props = {ctrPrp: new CTextPr(), row:3, mcs: oMcs};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						
						var oElem = oMatrix.getElement(0,0);
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem = oMatrix.getElement(1,0);
						sText = String.fromCharCode(8942);
						this.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,1);
						sText = String.fromCharCode(8945);
						this.AddText(oElem, sText);						
						oElem = oMatrix.getElement(1,2);
						sText = String.fromCharCode(8942);
						this.AddText(oElem, sText);			
						oElem = oMatrix.getElement(2,0);
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						break;
		}
	},
	Add: function (oElem, Pos)
	{
        oElem.Parent = this;

        if(oElem.Type === para_Math_Composition)
        {
            //oElem.setArgSize(this.argSize);
            this.content.splice(Pos,0,oElem);
        }
        else
        {
           this.content.splice(Pos,0,oElem);
        }
		if (this.content.length != 1)
			this.CurPos++;
    },
	AddText : function(oElem, sText)
    {		
        if(sText)
        {			
            var MathRun = new ParaRun(this.Paragraph, true);
			
			var Pos = oElem.CurPos + 1,
				PosEnd = Pos + 1;
			var items = [];
            for (var i=0; i < sText.length; i++)
            {
                var oText = null;
				if ( 0x0026 == sText[i].charCodeAt(0))
					oText = new CMathAmp();
				else
				{
					oText = new CMathText(false);
					oText.addTxt(sText[i]);
				}
				MathRun.Add(oText, true);
            }			
			oElem.DeleteEmptyRuns();
            oElem.Add(MathRun,Pos);
			items.push(MathRun);
			History.Add(oElem, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});	
			
			oElem.SetRunEmptyToContent(true);
        }        
    },

	DeleteEmptyRuns : function ()
	{
		var nLen = this.content.length;
		while(nLen >= 0 )
		{
			var oElem = this.content[nLen];
			if (oElem && oElem.typeObj == MATH_PARA_RUN && oElem.Content.length == 0)
				this.content.splice(nLen, 1);
			nLen--;
		}
	},
    CreateElem : function (oElem, oParent)
    {
		oElem.Parent = oParent;
		var Pos = oParent.CurPos + 1,
				PosEnd = Pos + 1;
		var items = [];
		
        if (oParent)
		{
			oParent.DeleteEmptyRuns();
            oParent.Add(oElem,Pos);
			items.push(oElem);
			History.Add(oParent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});

			oParent.SetRunEmptyToContent(true);
		}
    },
    CreateFraction : function (oFraction,oParentElem,sNumText,sDenText)
    {
        this.CreateElem(oFraction, oParentElem);

        var oElemDen = oFraction.getDenominator();		
        this.AddText(oElemDen, sDenText);

        var oElemNum = oFraction.getNumerator();
        this.AddText(oElemNum, sNumText);
    },
	
	CreateDegree : function (oDegree, oParentElem,sBaseText,sSupText,sSubText)
    {
        this.CreateElem(oDegree, oParentElem);

        var oElem = oDegree.getBase();
        this.AddText(oElem, sBaseText);

        var oSup = oDegree.getUpperIterator();
        this.AddText(oSup, sSupText);

        var oSub = oDegree.getLowerIterator();
        this.AddText(oSub, sSubText);
    },

    CreateRadical : function (oRad,oParentElem,sElemText,sDegText)
    {
        this.CreateElem(oRad, oParentElem);

        var oElem = oRad.getBase();
        this.AddText(oElem, sElemText);

        var oDeg = oRad.getDegree();
		this.AddText(oDeg, sDegText);
    },

    CreateNary : function (oNary,oParentElem,sElemText,sSubText,sSupText)
    {
        this.CreateElem(oNary, oParentElem);

        var oElem = oNary.getBase();
        this.AddText(oElem, sElemText);

        var oSub = oNary.getLowerIterator();
        this.AddText(oSub, sSubText);

        var oSup = oNary.getUpperIterator();
        this.AddText(oSup, sSupText);
    },

    CreateBox : function (oBox,oParentElem,sElemText)
    {
        this.CreateElem(oBox, oParentElem);

        var oElem = oBox.getBase();
        this.AddText(oElem, sElemText);
    }
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