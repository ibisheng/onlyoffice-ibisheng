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
// 2. Убрать ненужные(!!) setTxtPrp и
// getTxtPrp
// 3. Проверить что будет, если какие-то настройки убрать/добавить из ctrPrp, влияют ли они на отрисовку управляющих элементов (например, Italic, Bold)
// 4. Протестировать n-арные операторы, когда добавляется текст вместо оператора (mouseDown не работает, выравнено как alignTop)

var historyitem_Math_AddItem                   =  1; // Добавляем элемент
var historyitem_Math_RemoveItem                =  2; // Удаляем элемент




/*var  DEFAULT_RUN_PRP =
{
    FontFamily:     {Name  : "Cambria Math", Index : -1 },
    FontSize:       11,
    Italic:         true,
    Bold:           false,
    RFonts:         {},
    Lang:           {}
};*/



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

    this.Equal =
    {
        left:   new CGaps(0.35, 0, 0, 0.7),
        right:  new CGaps(0.25, 0, 0, 0.5)
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

        if(codeCurr == 0x3D)
            operator = this.Equal;
        else if(this.checkOperSign(codeCurr))
            operator = this.Sign;
        else if(codeCurr == 0x2217)
            operator = this.Mult;
        else
            operator = this.Default;

        var part = direct == -1 ? operator.left : operator.right;

        var coeff = 0;
        if(codeLR == -1) // мат объект
            coeff = part.letters;
        else if(this.checkOperSign(codeLR))
            coeff = part.sign;
        else if(codeLR == 0x3D )
            coeff = part.equal;
        else if(codeLR == this.checkZEROSign(codeLR))
            coeff = part.zeroOper;
        else
            coeff = part.letters;

        return coeff;

    },
    checkOperSign: function(code) // "+", "-", "<", ">", "±"
    {
        var PLUS       = 0x2B,
            MINUS      = 0x2212,
            LESS       = 0x3C,
            GREATER    = 0x3E,
            PLUS_MINUS = 0xB1;

        return code == PLUS || code == MINUS || code == LESS || code == GREATER || code == PLUS_MINUS;
    },
    checkZEROSign: function(code, direct) // "*", "/", "\"
    {
        var MULT     = 0x2217,
            DIVISION = 0x2F,
            B_SLASH  = 0x5C;

        var bOper = code == MULT || code == DIVISION || code == B_SLASH;

        var bLeftBracket = direct == -1 && (code == 0x28 || code == 0x5B || code == 0x7B);

        var bRightBracket = direct == 1 && (code == 0x29 || code == 0x5D || code == 0x7D);


        return bOper || bLeftBracket || bRightBracket;
    }
}

var COEFF_GAPS = new CCoeffGaps();

// TODO
// проконтролировать GapLeft и GapRight для setPosition всех элементов

function CRecalculateInfo(oMeasure, argSize)
{
    this.measure = oMeasure;

    //this.Parent = Parent;
    //this.ParaMath = this.Parent.ParaMath; // для Para_Run

    this.argSize = argSize; // argSize выставляем один раз для всего контента
    this.leftRunPrp = null; // Run_Prp левого элемента
    this.currRunPrp = null;

    this.Left = null;       // элемент слева
    this.Current = null;    // текущий элемент

}
CRecalculateInfo.prototype =
{
    old_checkGapsSign: function(oMeasure, posCurr)
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
                        if(this.checkZEROSign(leftCode))
                            coeffLeft = 0;
                        else if(leftCode == EQUAL)
                            coeffLeft = 0.26;
                        else
                            coeffLeft = 0.52;
                    }

                    if(bRight)
                    {
                        var bZero = this.checkZEROSign(rightCode);
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
                        var bZeroLeft = this.checkZEROSign(leftCode),
                            bOperLeft = this.checkOperSign(leftCode);

                        if(leftCode == EQUAL || bOperLeft || bZeroLeft)
                            coeffLeft = 0;
                        else if(bLeft)
                            coeffLeft = 0.46;
                    }

                    if(bRight)
                    {
                        var bZeroRight = this.checkZEROSign(rightCode),
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
                        var bZero = this.checkZEROSign(leftCode);
                        if(leftCode == EQUAL || bZero)
                            coeffLeft = 0;
                        else if(this.checkOperSign(leftCode))
                            coeffLeft = 0.35;
                        else
                            coeffLeft = 0.7;
                    }

                    if(bRight)
                    {
                        var bZero = this.checkZEROSign(rightCode);
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

            /*if(this.bRoot)
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
             }*/
        }

    },
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
            var currCoeff = 0,
                rightCoeff = 0;

            if(this.Current.typeObj == MATH_TEXT)
            {
                var currCode = this.Current.getCodeChr();


                if(this.Left !== null)
                {
                    if(this.Left.typeObj == MATH_COMP)
                    {
                        rightCoeff = this.getGapsMComp(this.Left, 1);
                        currCoeff = COEFF_GAPS.getCoeff(currCode, -1, -1);

                        currCoeff -= rightCoeff;
                    }
                    else
                    {
                        var leftCode = this.Left.getCodeChr();
                        currCoeff = COEFF_GAPS.getCoeff(currCode, leftCode, -1);
                        rightCoeff = COEFF_GAPS.getCoeff(leftCode, currCode, 1);
                    }

                }
                else
                    this.Current.GapLeft = 0;
            }
            else
            {
                currCoeff = this.getGapsMComp(this.Current, -1);

                if(this.Left != null)
                {
                    if(this.Left.typeObj == MATH_COMP)
                    {
                        rightCoeff = this.getGapsMComp(this.Left, 1);

                        if(rightCoeff/2 > currCoeff)
                            rightCoeff -= currCoeff;
                        else
                            rightCoeff /= 2;

                        if(currCoeff < rightCoeff/2)
                        {
                            currCoeff = rightCoeff/2;
                        }
                    }
                    else
                    {
                        var leftCode = this.Left.getCodeChr();
                        rightCoeff = COEFF_GAPS.getCoeff(leftCode, -1, 1);
                        if(rightCoeff > currCoeff)
                            rightCoeff -= currCoeff;
                    }
                }
                else
                    currCoeff = 0;
            }

            currCoeff = Math.ceil(currCoeff*10)/10;
            rightCoeff = Math.ceil(rightCoeff*10)/10;

            var LGapSign = 0.1513*this.currRunPrp.FontSize;
            this.Current.GapLeft = Math.ceil(currCoeff*LGapSign*10)/10; // если ни один случай не выполнился, выставляем "нулевые" gaps (default): необходимо, если что-то удалили и объект стал первый или последним в контенте

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

        var result = direct == -1 ? coeffLeft : coeffRight;

        return result;
    },
    checkGapKind: function(kind)
    {
        var bEmptyGaps = kind == MATH_DELIMITER || kind == MATH_MATRIX,
            bChildGaps = kind == MATH_DEGREE || kind == MATH_DEGREESubSup || kind == MATH_ACCENT || kind == MATH_RADICAL|| kind == MATH_BOX || kind == MATH_BORDER_BOX;

        return  {bEmptyGaps: bEmptyGaps, bChildGaps: bChildGaps};
    }
}

// TO DO
// убрать

/*function CMathRunPrp()
{
    this.typeObj = MATH_RUN_PRP;
    this.textPrp = new CTextPr();
    this.mathPrp = new CMPrp();
    this.size = {width: 0, height: 0, center: 0, ascent: 0};
}
CMathRunPrp.prototype =
{
    Merge: function(MRunPrp)
    {
        // only For object of CMathRunPrp
        var checkTxtPrp = MRunPrp.textPrp !== null && typeof(MRunPrp.textPrp)!== "undefined",
            checkMPrp = MRunPrp.mathPrp !== null && typeof(MRunPrp.mathPrp)!== "undefined";
        if(checkTxtPrp && checkMPrp)
        {
            this.textPrp.Merge(MRunPrp.textPrp);
            this.mathPrp.Merge(MRunPrp.mathPrp);
        }
    },
    old_Merge: function(oWPrp)
    {
        this.textPrp.Merge(oWPrp);
    },
    *//*getWRunPrp: function()
    {
        // смержить c MRunPrp
        return this.textPrp;
    },*//*
    getMergedWPrp: function()
    {
        var oWPrp = new CTextPr();

        if(!this.mathPrp.nor) // math text, style: plain
        {
            oWPrp.Merge(this.textPrp); // FontFamily, FontSize etc

            var mPrp = this.mathPrp.getTxtPrp();
            oWPrp.Merge(mPrp); // bold, italic
        }
        else
        {
            oWPrp.Merge(this.textPrp);
        }

        return oWPrp;
    },
    getTxtPrp: function()
    {
        return this.textPrp;
    },
    setTxtPrp: function(oWPrp)
    {
        this.textPrp.Merge(oWPrp);
    },
    setMathRunPrp: function(oMPrp)
    {
        this.mathPrp.setMathProps(oMPrp);
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
    },
    getTxtSettings: function()
    {
        return this.mathPrp.getTxtSettings();
    }
}*/

function CMPrp()
{
    this.aln      = false;
    this.brk      = false;
    this.lit      = false;

    // TXT_NORMAL
    // если normal == false, то берем TextPrp отсюда (в wRunPrp bold/italic не учитываем, выставляем отсюда)
    // если normal == true, то их Word не учитывает и берет TextPr из wRunPrp

    // TXT_PLAIN
    // если plain == true
    // буквы берутся обычные, не специальные для Cambria Math : то есть как для TXT_NORMAL
    // отличие от TXT_NORMAL w:rPrp в этом случае не учитываются !

    this.typeText = TXT_ROMAN;
    this.italic   = true;
    this.bold     = false;
    //this.nor      = false;
    //this.plain    = false;

}
CMPrp.prototype =
{
    Merge:  function(mPrp)
    {
        // выравнивание
        this.aln      = mPrp.aln;
        this.brk      = mPrp.brk;

        // настройки для букв в контенте
        this.lit      = mPrp.lit;
        this.nor      = mPrp.nor;
        this.typeText = mPrp.typeText;

        // настройки bold, italic
        this.italic   = mPrp.italic;
        this.bold     = mPrp.bold;
        this.plain    = mPrp.plain;
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
            script:     this.src,
            italic:     this.italic,
            bold:       this.bold,
            plain:      this.plain,
            typeText:   this.typeText
        };

        return props;
    },
    setMathProps: function(props)
    {
        this.SetBProp(this.aln, props.aln);
        this.SetBProp(this.brk, props.brk);
        this.SetBProp(this.lit, props.lit);

        // если приходит несколько параметров style из xml, то запоминается последний
        if(props.sty === STY_ITALIC)
            this.italic = true;
        else if(props.sty === STY_BI)
        {
            this.italic = true;
            this.bold = true;
        }
        else if(props.sty === STY_BOLD)
        {
            this.italic = false;
            this.bold = true;
        }
        else if(props.sty === STY_PLAIN )
        {
            this.typeText = TXT_PLAIN;  // буквы берутся обычные, не специальные для Cambria Math : то есть как для TXT_NORMAL
                                        // отличие от TXT_NORMAL w:rPrp не учитываются !
        }

        // TXT_DOUBLE_STRUCK        U+1D538 - U+1D56B
        // TXT_MONOSPACE            U+1D670 - U+1D6A3
        // TXT_FRAKTUR              U+1D504 - U+1D537
        // TXT_SANS_SERIF           U+1D608 - U+1D63B
        // TXT_SCRIPT               U+1D49C - U+1D4CF

        if(typeof(props.scr)!=="undefined" && props.scr !== null)
            this.typeText = props.scr;


        if(props.nor)
            this.typeText = TXT_NORMAL;

    },
    Apply_Pr: function(TextPr)
    {
        if(TextPr.Bold !== null && typeof(TextPr.Bold) !== "undefined")
            this.bold = TextPr.Bold;

        if(TextPr.Italic !== null && typeof(TextPr.Italic) !== "undefined")
            this.italic = TextPr.Italic;

    },
    getPropsForWrite: function()
    {
        var props = {};

        var Italic     = this.italic && !this.bold,
            BoldItalic = this.italic && this.bold,
            Bold       = this.bold && !this.italic,
            Plain      = this.plain;

        if(this.typeText == TXT_NORMAL)
        {
            props.nor = 1;
        }
        else
        {
            if(BoldItalic)
                props.sty = STY_BI;
            else if(Bold)
                props.sty = STY_BOLD;
            else if(Italic)
                props.sty = STY_ITALIC;
            else if(Plain)
                props.sty = STY_PLAIN;
        }

        if(this.aln)
            props.aln = 1;

        if(this.brk)
            props.brk = 1;

        if(this.lit)
            props.lit = 1;

        props.scr = this.typeText;

        return props;
    },
    getTypeText: function()
    {
        return this.typeText;
    },
    getTxtSettings: function()
    {
        var type = this.typeText;

        if(type == TXT_ROMAN && this.italic == false) // если MATH TEXT и не курсив, то подменяем на NORMAL TEXT
            type = TXT_NORMAL;

        var settings =
        {
            type:   type,
            lit:    this.lit
        };

        return settings;
    },
    getTxtPrp: function()
    {
        var textPrp = new CTextPr();

        textPrp.Italic = this.italic;
        textPrp.Bold = this.bold;

        return textPrp;
    },
    Copy: function()
    {
        var NewMPrp = new CMPrp();
        
        NewMPrp.aln      = this.aln;
        NewMPrp.brk      = this.brk;
        NewMPrp.lit      = this.lit;
        NewMPrp.nor      = this.nor;
        NewMPrp.typeText = this.typeText;
        NewMPrp.italic   = this.italic;
        NewMPrp.bold     = this.bold;
        NewMPrp.plain    = this.plain;
        
        return NewMPrp;
    }
}


//TODO
// доделать GroupCharacter / Delimiter в качестве character может быть любой символ

//TODO
//переделать/продумать DotIndef, т.к. при перетаскивании из одного места в другое флаг DotIndef может измениться для другого контента

//TODO
//пересмотреть this.dW и this.dH

//TODO
//добавить gaps для мат элементов и математических знаков

//TODO
//сделать, чтобы курсор выставлялся только, где это действительно необходимо
//в качетве позиции для контента передавать положение baseLine для него





// TODO Refactoring

// 1. (!!) повтор IsIncline, IsHighElement


function CMathContent()
{
	this.Id = g_oIdCounter.Get_NewId();		


    this.content = []; // array of mathElem

    this.CurPos = 0;
    this.WidthToElement = [];
    this.pos = new CMathPosition();   // относительная позиция

    //  Properties
    this.ParaMath      = null;
    this.argSize     = 0;
    this.bDot       =   false;
    this.plhHide    =   false;
    this.bRoot      =   false;
    //////////////////

    this.bSelectionUse = false;
    this.SelectStartPos = 0;
    this.SelectEndPos   = 0;
    this.RecalcInfo =
    {
        TextPr:     true
    };

    this.NearPosArray = [];

    this.size =
    {
        width: 0,
        height: 0,
        center: 0
    };

	
	// Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
	g_oTableId.Add( this, this.Id );
}
CMathContent.prototype =
{
    constructor: CMathContent,
    init: function()
    {

    },
    setArgSize: function(argSize)
    {
        var check = argSize == 0 || argSize == 1 || argSize == 2 || argSize == -1 || argSize === -2; // проверка параметра

        if(check)
        {
            // складываем здесь, чтобы не потерять собственные настройки argSize: при добавлении в итератор формулы из меню; при добавлении готовых формул, когда есть вложенность формул с итераторами
            // не будет работать при копиравнии в случае, если argSize будет отличатся от нуля для копируемой части контента
            // поэтому при копировании свойство argSize не учитываем (копируем только массив элекентов вместе с Run Properties)

            var val = this.argSize + argSize;

            if(val < -2)
                this.argSize = -2;
            else if(val > 2)
                this.argSize = 2;
            else
                this.argSize = val;

            for(var i = 0; i < this.content.length; i++)
            {
                if(this.content[i].value.typeObj == MATH_COMP)
                    this.content[i].value.setArgSize(argSize);
            }
        }
    },
    // переделать для селекта
    getSelectTPrp: function(bSelect)
    {
        var start, end, tmp;

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
                var txtPrp2 = this.content[i].value.getOwnTPrp();
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

        var symb = new CMathText(false);
        symb.add(code);

        this.addToContent(symb);
        var item = this.content[this.CurPos];

        return [item];
    },
    addElementToContent: function(obj)   //for "read"
    {
        obj.Parent = this;

        if(obj.typeObj === MATH_COMP)
        {
            //obj.setComposition(this.Composition);
            obj.setArgSize(this.argSize);

            this.content.push(obj);
        }
        else
        {
            this.content.push(obj);
        }

        this.CurPos = this.content.length-1;

    },
    /*addToContent_2: function(oSub)   // for "menu"
    {
        // добавление к контенту элементов из другого контента в текущую позицию
        // первый элемент в добавляемом контенте CEmpty пропускаем

        var subContent = oSub.content;
        var subStart = 1;
        //var subEnd = subContent.length - 1;

        var curStart = this.CurPos,
            curEnd   = this.CurPos;

        var CurFirstType = this.content[this.CurPos].value.typeObj,
            CurLastType  = this.CurPos < this.content.length - 1 ? this.content[this.CurPos + 1].value.typeObj : null,
            SubFirstType = subContent[1].value.typeObj,
            SubLastType  = subContent[subContent.length - 1].value.typeObj;

        if(CurFirstType == MATH_RUN_PRP)
        {
            curStart = this.CurPos - 1;
            curEnd   = this.CurPos - 1;

            // не убираем RunPrp для вставляемого текста, чтобы History работала нормально !!
            // когда на запись отдаем, можно лишние RunPrp убрать, как в Ворде
            // curEnd   = SubLastType == MATH_EMPTY ? this.CurPos - 1 : this.CurPos; // если последний элемент у добавляемого контента текст, убираем RunPrp в текущей позиции
        }
        else if(CurFirstType == MATH_TEXT)
        {
            subStart = SubFirstType == MATH_RUN_PRP ? 2 : 1;

            if(CurLastType == MATH_TEXT && SubLastType == MATH_EMPTY) // добавляем RunPrp, если в конце добавляемого контента стоит мат. объект
            {
                var rPrp = new CMathRunPrp();
                rPrp.Merge( this.getRunPrp(this.CurPos) );
                subContent.push( new mathElem(rPrp) );
            }
        }

        // "relate" for math objects
        for(var i = 0; i < subContent.length; i++)
            subContent[i].value.relate(this);

        oSub.setReferenceComposition(this.Composition);

        oSub.setArgSize(this.argSize); // добавляется всегда контент или мат формула

        var startContent  = this.content.slice(0, curStart + 1),
            middleContent = subContent.slice(subStart),
            endContent    = this.content.slice(curEnd + 1);

        this.content.length = 0;
        this.content = this.content.concat(startContent);
        this.content = this.content.concat(middleContent);
        this.content = this.content.concat(endContent);

        var pos = startContent.length + middleContent.length - 1;

        var currType  = this.content[pos].value.typeObj;
        var nextType = pos < this.content.length - 1 ? this.content[pos + 1].value.typeObj : null;

        if(currType == MATH_EMPTY && nextType == MATH_RUN_PRP)
            pos++;

        this.CurPos = pos;
        return middleContent;
    },*/
    /*setComposition: function(Composition)
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
    },*/
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

                var degr1 = base.addMComponent(MATH_DEGREE);
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
                var elem1 = matrix.getElement(0,0);
                elem1.addTxt("1");

               	var elem2 = matrix.getElement(0,1);
                elem2.addTxt("0");

                var elem3 = matrix.getElement(1,0);
                elem3.addTxt("0");

                var elem4 = matrix.getElement(1,1);
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

                var elem5 = matrix.getElement(1,1);
                elem5.addTxt("1");

                var elem6 = matrix.getElement(1,2);
                elem6.addTxt("0");

                var elem7 = matrix.getElement(2,0);
                elem7.addTxt("0");

                var elem8 = matrix.getElement(2,1);
                elem8.addTxt("0");

                var elem9 = matrix.getElement(2,2);
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
    /*relate: function(parent)
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
    },*/
    fillPlaceholders: function()
    {
        var placeholder = new CMathText(false);
        //placeholder.relate(this);
        placeholder.fillPlaceholders();

        this.content.push( placeholder );
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
            if (!this.bRoot)
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
            if(!this.bRoot)
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
                if ( !this.content[this.CurPos].value.select_moveRight() )
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
            var pos = this.RealSelect.endPos - 1;
            var endSelect = this.changePosForMove(pos, -1);

            if(endSelect == -1)
            {
                if(!this.bRoot)
                {
                    SelectContent = this.Parent.goToLeftSelect(SELECT_PARENT);
                }
                else
                    state = false;
            }
            else
            {
                SelectContent = this;

                if(this.LogicalSelect.start == endSelect && this.content[endSelect].value.typeObj == MATH_COMP)
                {
                    SelectContent = this.content[endSelect].value.goToLeftSelect(SELECT_CHILD);
                    endSelect--;
                }
                else if(this.content[endSelect].value.typeObj == MATH_COMP) // select math object
                {
                    endSelect--;
                }


                this.setEndPos_Selection(endSelect);
            }

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
                //this.CurPos = pos;
                this.setLogicalPosition(pos);

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
    goToLeftSelect: function(bParent)
    {
        if(bParent == SELECT_PARENT)
            this.RealSelect.startPos +=2;

        return this;
    },
    goToRightSelect: function(bParent)
    {
        if(bParent == SELECT_PARENT)
            this.RealSelect.endPos +=2;

        return this;
    },
    cursor_moveRight: function(bShiftKey, bCtrlKey)
    {
        var state = true,
            SelectContent = null;

        if(bShiftKey)
        {
            var pos = this.RealSelect.endPos - 1;
            // если вышли из формулы, то RunPrp селектить нужно только когда селектим текст
            // поэтому чтобы правильно выставить позицию, когда уже селектим текст в этой ситуации, смещаем позицию

            var currType = this.content[pos].value.typeObj,
                nextType = pos < this.content.length - 1 ? this.content[pos+1].value.typeObj : null;

            if(currType == MATH_EMPTY && nextType == MATH_RUN_PRP)
                pos++;

            var endSelect = this.changePosForMove(pos, 1);

            if(endSelect == -1)
            {
                if(!this.bRoot)
                {
                    SelectContent = this.Parent.goToRightSelect(SELECT_PARENT);
                }
                else
                    state = false;
            }
            else
            {
                SelectContent = this;

                if(this.LogicalSelect.start == endSelect && this.content[endSelect].value.typeObj == MATH_COMP)
                {
                    SelectContent = this.content[endSelect].value.goToRightSelect(SELECT_CHILD);
                    endSelect++;
                }
                else if(this.content[endSelect].value.typeObj == MATH_COMP) // select empty
                    endSelect++;


                this.setEndPos_Selection(endSelect);
                this.LogicalSelect.end = endSelect;
            }
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
                //this.CurPos = pos;
                this.setLogicalPosition(pos);

                if(this.content[pos].value.typeObj == MATH_COMP)
                    SelectContent = this.content[pos].value.goToFirstElement();
                else
                    SelectContent = this;
            }
            else
            {
                if(!this.bRoot)
                {
                    SelectContent = this.Parent.goToRight(SELECT_PARENT);
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
		var content;
        var x = coord.x, y = coord.y;
        var bLow = false;

        x += this.content[this.CurPos].widthToEl - this.content[this.CurPos].value.size.width - this.content[this.CurPos].gaps.right;
        y = 0;

        if( !this.bRoot )
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
		var content;
        var x = coord.x, y = coord.y;
        var bUp = false;

        x += this.content[this.CurPos].widthToEl - this.content[this.CurPos].value.size.width - this.content[this.CurPos].gaps.right;
        y = 0;

        if( !this.bRoot )
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

        if( !this.bRoot )
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

        if( !this.bRoot )
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

                if( !movement.state )
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
        var bFirstRunPrp = pos == 1 && currType == MATH_RUN_PRP;
        var bFirst = bFirstRunPrp || pos == 0;

        var bPlh = this.IsPlaceholder();

        var bLeft =  order == -1 && !bFirst && !bPlh,
            bRight = order == 1 && pos !== this.content.length - 1 && !bPlh;


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
    old_cursor_MoveToStartPos: function()  //  home => cursor_MoveToStartPos
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
    old_cursor_MoveToEndPos: function()  //  end => cursor_MoveToEndPos
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

    recalculateSize: function()
    {
        var width      =   0 ;
        var ascent     =   0 ;
        var descent    =   0 ;

        var oSize;

        this.WidthToElement.length = 0;

        for(var i = 0; i < this.content.length; i++)
        {
            this.WidthToElement[i] = width;

            oSize = this.content[i].size;

            width += oSize.width;

            ascent = ascent > oSize.ascent ? ascent : oSize.ascent;
            var oDescent = oSize.height - oSize.ascent;
            descent =  descent < oDescent ? oDescent : descent;
        }

        this.size = {width: width, height: ascent + descent, ascent: ascent};
    },
    Resize: function(Parent, ParaMath, oMeasure)      // пересчитываем всю формулу  a
    {
        var RecalcInfo = new CRecalculateInfo(oMeasure, this.argSize);

        this.ParaMath = ParaMath;

        if(Parent !== null)
        {
            this.bRoot = false;
            this.Parent = Parent;
        }
		if (this.content.length == 0)
			this.fillPlaceholders();

        for(var pos = 0; pos < this.content.length; pos++)
        {
            if(this.content[pos].typeObj == MATH_COMP)
            {
                RecalcInfo.Left = RecalcInfo.Current;
                RecalcInfo.leftRunPrp = RecalcInfo.currRunPrp;

                RecalcInfo.Current = this.content[pos];

                this.content[pos].Resize(this, ParaMath, oMeasure);

                /*var runPrp = this.content[pos].getCtrPrp();

                this.ParaMath.ApplyArgSize(runPrp); // в ParaMath*/

                var ctrPrp = this.content[pos].Get_CompiledCtrPrp();

                RecalcInfo.currRunPrp = ctrPrp;

                RecalcInfo.setGaps();
            }
            else if(this.content[pos].typeObj == MATH_PLACEHOLDER)
            {
                if(!this.bRoot)
                {
                    //var oWPrp = this.Parent.Get_CtrPrp();
                    var oWPrp = this.Parent.Get_CompiledCtrPrp();

                    //this.applyArgSize(oWPrp);
                    this.ParaMath.ApplyArgSize(oWPrp, this.argSize);
                    oWPrp.Italic = false;


                    /*var ctrPrp = this.Parent.Get_CompiledCtrPrp();
                    ctrPrp.Italic = false;*/

                    oMeasure.SetFont(oWPrp);

                    this.content[pos].Resize(this, oMeasure);
                }
            }
            else
            {
                //this.content[pos].Set_Paragraph(this.ParaMath.Paragraph);
                this.content[pos].Math_Recalculate(this, ParaMath.Paragraph, oMeasure, RecalcInfo);
            }
        }

        if(RecalcInfo.Current !== null)
            RecalcInfo.Current.GapRight = 0;

        this.recalculateSize();
    },
    IsEmptyRun: function(pos) // пустой Para_Run
    {
        var result = false;

        if(pos < this.content.length)
            result = this.content[pos].typeObj !== MATH_COMP && this.content[pos].Is_Empty();

        return result;
    },
    getGapsInside: function(RecalcInfo) // учитываем gaps внутренних объектов
    {
        var gaps = {left: 0, right: 0};
        var bFirstComp = false,
            bLastComp = false;

        var len = this.content.length;

        if(len > 1)
        {
            var bFRunEmpty = this.content[0].Is_Empty();
            bFirstComp = bFRunEmpty && this.content[1].typeObj == MATH_COMP; // первый всегда идет Run

            var bLastRunEmpty = this.content[len - 1].Is_Empty(); // т.к. после мат. объекта стоит пустой Run
            bLastComp = bLastRunEmpty && this.content[len - 2].typeObj == MATH_COMP;
        }

        var checkGap;

        if(bFirstComp)
        {
            checkGap = RecalcInfo.checkGapKind(this.content[1].kind);

            if(!checkGap.bChildGaps)
            {
                var gapsMComp = RecalcInfo.getGapsMComp(this.content[1]);
                gaps.left = gapsMComp.left;
            }
        }

        if(bLastComp)
        {
            checkGap = RecalcInfo.checkGapKind(this.content[len - 1].kind);

            if(!checkGap.bChildGaps)
            {
                var gapsMComp = RecalcInfo.getGapsMComp(this.content[len - 1]);
                gaps.right = gapsMComp.right;
            }
        }

        return gaps;
    },
    IsOnlyText: function()
    {
        var bOnlyText = true;
        for(var i = 0; i < this.content.length; i++)
        {
            if(this.content[i].typeObj == MATH_COMP)
            {
                bOnlyText = false;
                break;
            }
        }

        return bOnlyText;
    },
    old_checkSignComp: function(pos)
    {
        var bPlus = false, bMinus = false,
            bMult = false, bDivision = false,
            bEqual = false;

        var currType = pos > 0 && pos < this.content.length ? this.content[pos].value.typeObj : null;

        if(currType == MATH_TEXT)
        {
            var code = this.content[pos].value.getCodeChr();

            bPlus     = code === 0x2B;
            bMinus    = code === 0x2212;
            bMult     = code === 0x2217;
            bDivision = code === 0x002F;
            bEqual    = code === 0x3D;
        }

        return (bPlus || bMinus || bEqual);
    },
    draw: function(x, y, pGraphics)
    {
        var bHidePlh = this.plhHide && this.IsPlaceholder();

        if( !bHidePlh )
        {
            for(var i=0; i < this.content.length;i++)
            {
                if(this.content[i].typeObj == MATH_RUN_PRP)
                {
                    pGraphics.b_color1(0,0,0,255);
                    var mgWPrp = this.content[i].value.getMergedWPrp();
                    var oWPrp = new CTextPr();
                    oWPrp.Merge(mgWPrp);

                    //this.applyArgSize(oWPrp);

                    this.ParaMath.ApplyArgSize(oWPrp, this.argSize);

                    pGraphics.SetFont(oWPrp);
                }
                else if(this.content[i].typeObj == MATH_PLACEHOLDER)
                {
                    pGraphics.b_color1(0,0,0,255);

                    //var oWPrp = this.Parent.Get_CtrPrp();
                    var oWPrp = this.Parent.Get_CompiledCtrPrp();

                    //this.applyArgSize(oWPrp);
                    this.ParaMath.ApplyArgSize(oWPrp, this.argSize);

                    oWPrp.Italic = false;
                    pGraphics.SetFont(oWPrp);

                    //var ctrPrp = this.Parent.Get_CompiledCtrPrp();
                    //ctrPrp.Italic = false;

                    pGraphics.SetFont(oWPrp);

                    this.content[i].draw(x, y, pGraphics);
                }
                else  if(this.content[i].typeObj == MATH_PARA_RUN)
                    this.content[i].Math_Draw(x, y, pGraphics);
                else
                    this.content[i].draw(x, y, pGraphics);

            }
        }

    },
    update_Cursor: function(CurPage, UpdateTarget)
    {
        var result;
        if(this.content[this.CurPos].typeObj == MATH_COMP)
        {
            result = this.content[this.CurPos].update_Cursor(CurPage, UpdateTarget);
        }
        else if(this.content[this.CurPos].typeObj == MATH_PARA_RUN)
        {
            var X = this.pos.x + this.ParaMath.X + this.WidthToElement[this.CurPos],
                Y = this.pos.y + this.ParaMath.Y + this.size.ascent;

            result = this.content[this.CurPos].Math_Update_Cursor(X, Y, CurPage, UpdateTarget);
        }

        return result;
    },
    old_coordWOGaps: function( msCoord )
    {
        var x = msCoord.x;
        var y = msCoord.y;
        if( 0 <= x && x <= this.gaps.left )
            x = 0;
        else if( (this.size.width - this.gaps.right) <= x && x <= this.size.width)
            x = this.size.width - this.gaps.right - this.gaps.left;
        else
            x -= this.gaps.left;

        if( 0 <= y && y <= this.gaps.top )
            y = 0;
        else if( (this.size.height - this.gaps.bottom) <= y && y <= this.size.height )
            y = this.size.height - this.gaps.top - this.gaps.bottom;
        else
            y -= this.gaps.top;

        return {x: x, y: y};
    },
    findPosition: function(X, Y)
    {
        var W = 0, width = 0;
        var pos = 0;
        for(var i = 0; i < this.content.length && X > W; i++)
        {
            W += this.content[i].size.width;
            width = this.content[i].size.width;

            pos = i;
        }

        if( this.content[pos].typeObj === MATH_COMP )
        {
            if(X < W - width + this.content[pos].GapLeft)
                pos--;
            else if(X >= W - this.content[pos].GapRight)
                pos++;
        }

        return pos;
    },
    old_getCoordElem: function(index, mCoord)  // without gaps of Math Component ( например, если справа/слева есть относительно мат элемента компонент, то добавляем gaps справа/слева для этого мат элемента )
    {
        var widthToPrev = this.content[index-1].widthToEl;
        var widthToCur = this.content[index].widthToEl;
        var X;
        var Y;

        var gps = this.content[index].gaps;
        if( widthToPrev <= mCoord.x && mCoord.x <=  (widthToPrev + gps.left) )
            X = 0;
        else if( (widthToCur - gps.right) <= mCoord.x && mCoord.x <= widthToCur )
            X = this.content[index].value.size.width;
        else
            X = mCoord.x - widthToPrev - gps.left;

        if( mCoord.y <= (this.size.center - this.gaps.top - this.content[index].value.size.center) )
            Y = 0;
        else if( mCoord.y >= this.size.center - this.gaps.top +  this.content[index].value.size.height -  this.content[index].value.size.center )
            Y =  this.content[index].value.size.height;
        else
            Y = mCoord.y - (this.size.center - this.gaps.top - this.content[index].value.size.center);

        return {x: X, y: Y};
    },
    getCoordElem: function(index, mCoord)  // without gaps of Math Component ( например, если справа/слева есть относительно мат элемента компонент, то добавляем gaps справа/слева для этого мат элемента )
    {
        var widthToPrev = this.content[index-1].widthToEl;
        var widthToCur = this.content[index].widthToEl;
        var X;
        var Y;

        var gps = this.content[index].gaps;
        if( widthToPrev <= mCoord.x && mCoord.x <=  (widthToPrev + gps.left) )
            X = 0;
        else if( (widthToCur - gps.right) <= mCoord.x && mCoord.x <= widthToCur )
            X = this.content[index].value.size.width;
        else
            X = mCoord.x - widthToPrev - gps.left;

        var Height  = this.content[index].value.size.height,
            Ascent  = this.content[index].value.size.ascent,
            Descent = this.content[index].value.size.height -  this.content[index].value.size.ascent;

        if( mCoord.y <= (this.size.ascent - Ascent) )
            Y = 0;
        else if( mCoord.y >= this.size.ascent + Descent)
            Y =  Height;
        else
            Y = mCoord.y - (this.size.ascent - Ascent);

        return {x: X, y: Y};
    },
    remove: function(order)
    {
        var state =
        {
            bDelete:                false,    /* нужно ли пересчитывать позицию или нет, работает при backspace */
            bBegin:                 false,    /* в начале контента или нет */
            bEnd:                   false,    /* в конце */
            bAddRPrp:               false
        };

        var CurrContent = null, SelectContent = null,
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
            state.bAddRPrp = result.bAddRPrp;
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
        var bAddRPrp = false;

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

        if(bRemoveFormula)   // удаление формулы (селект)
        {
            var pos;
            if(bMEReverse)
                pos = this.CurPos + 1;
            else if(bDirectly_CurrComp)
                pos = this.CurPos - 1;
            else if(bDirectly_RPrpComp)
                pos = this.CurPos - 2;

            this.removeFormula(pos);

            bDelete = false;
        }
        else if(!bNotRemove) // удаление в контенте
        {
            var posDelete;

            if(bSelect)      // если заселекчено
                posDelete = this.removeSelect();
            else             // если нет селекта
                posDelete = this.removeLetter(this.CurPos, order);

            var start = posDelete.start,
                end   = posDelete.end;

            this.CurPos = start - 1;

            items = this.content.splice(start, end - start);

            if(!this.IsEmpty() && this.CurPos == 0 && this.content[this.CurPos+1].value.typeObj === MATH_RUN_PRP) // если удалили мат. объект и стоим в начале, то позиция курсора будет перед RunPrp, а нужно после
                this.CurPos++;

            // проверка на RunPrp, смещенная позиция
            this.CurPos = this.verifyCurPos(this.CurPos);
            this.setLogicalPosition(this.CurPos);

            bDelete = true;
        }

        return {bDelete: bDelete, bAddRPrp: bAddRPrp, items: items};
    },
    removeLetter: function(pos, order)
    {
        var start, end;

        start = order == 1 ? pos : pos + 1;     // позиция, с которой будем удалять

        if(this.content[start].value.typeObj === MATH_RUN_PRP) // встали на RunPrp
            start = (order == -1) ? start + 1 : start - 1;

        var bRun = start - 1 > 0 ? this.content[start - 1].value.typeObj === MATH_RUN_PRP : false,
            bNextText = start + 1 < this.content.length ?  this.content[start + 1].value.typeObj == MATH_TEXT : false; // start  < this.content.length - 1, значит последняя буква в контента

        var bOnlyLetter = bRun && !bNextText; // если все текстовые элементы удалили из Run, нужно удалить RunPrp

        if(bOnlyLetter)
        {
            start--;
            end = start + 2;
        }
        else
            end = start + 1;

        return {start: start, end: end};
    },
    removeSelect: function()
    {
        var start =  this.RealSelect.startPos,
            end   =  this.RealSelect.endPos;
        var tmp;

        if(start > end)
        {
            tmp = start;
            start = end;
            end = tmp;
        }

        // при селекте используем  findPosition
        // соответственно, если перед RunPrp идёт текст, то встаем перед RunPrp,
        // а если empty, то встаем после RunPrp

        var endCurType    = this.content[end - 1].value.typeObj,                        // последний элемент в селекте "end - 1"
            endNextType   = end < this.content.length ? this.content[end].value.typeObj : null,
            startCurType  = this.content[start].value.typeObj,                          // RunPrp1, RunPrp2
            startPrevType = start > 0 ? this.content[start - 1].value.typeObj : null;   // MATH_COMP + RunPrp

        var bStartCurrRPrp = startCurType == MATH_RUN_PRP,      // проверка на то, чтобы добавить RunPrp к селекту
            bStartPrevRPrp = startPrevType == MATH_RUN_PRP;     // проверка на то, чтобы убрать RunPrp из селекта



        if(endCurType == MATH_RUN_PRP)
            end--;
        else if(endCurType == MATH_TEXT && endNextType == MATH_TEXT) // слева справа текст, в середине Run
        {
            // добавляем RunPrp, когда не весь Run заселектили   // начали селектить вне Run заселектили текущие RunPrp или начали не в конце Run и вышли за его пределы (заселектили RunPrp) //

            for(var i = end - 1; i--; i > start - 1)
            {
                if(this.content[i].value.typeObj == MATH_RUN_PRP)
                {
                    var rPrp = this.getRunPrp(end - 1);
                    var element = new mathElem(rPrp);

                    var startContent = this.content.splice(0, end);
                    var endContent = this.content.splice(0, this.content.length);

                    this.content.length = 0;
                    this.content = this.content.concat(startContent);
                    this.content = this.content.concat(element);
                    this.content = this.content.concat(endContent);

                    break;
                }
            }
        }

        if(bStartCurrRPrp || bStartPrevRPrp) // check RunPrp
        {
            var bSelectRunPrp = false;

            if(this.content.length == end)
                bSelectRunPrp = true;
            else if(endNextType !== MATH_TEXT)
                bSelectRunPrp = true;
            else
            {
                for(var i = start + 1; i < end; i++)
                {
                    if(this.content[i].value.typeObj !== MATH_TEXT)
                    {
                        bSelectRunPrp = true;
                        break;
                    }
                }
            }

            if(!bSelectRunPrp && bStartCurrRPrp)
                start++;
            else if(bSelectRunPrp && bStartPrevRPrp)
                start--;

        }

        return {start: start, end: end};
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
                        // сравниваем смерженные(!) текстовые настройки
                        var currTPrp = this.content[pos+2].value.getMergedWPrp();
                        var prevTPrp = this.content[i].value.getMergedWPrp();
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
        if(this.content.length == 1 && !this.bRoot )//только CEmpty
            this.fillPlaceholders();
    },
    selectUse: function()
    {
        var result;

        if(this.SelectStartPos == this.SelectEndPos)
        {
            if(this.content[this.SelectStartPos].typeObj == MATH_PARA_RUN)
            {
                result = this.content[this.SelectStartPos].Selection_IsUse();
            }
            else if(this.content[this.SelectStartPos].typeObj == MATH_COMP)
            {
                result = !this.content[this.SelectStartPos].IsSelectEmpty();
            }
        }
        else
            result = true;

        return result;
    },
    setCtrPrp: function()
    {

    },
    IsPlaceholder: function()
    {
        var flag = false;
        if(!this.bRoot && this.content.length == 1)
            flag  = this.content[0].typeObj === MATH_PLACEHOLDER;

        return flag;
    },
    IsCurrentPlh: function()
    {
        return this.IsPlaceholder();
    },
    IsJustDraw: function()
    {
        return false;
    },
    setPosition: function(pos)
    {
        this.pos.x = pos.x;
        this.pos.y = pos.y;

        var NewPos = new CMathPosition();

        NewPos.x = pos.x;
        NewPos.y = pos.y + this.size.ascent;    // y по baseline;


        for(var i=0; i < this.content.length; i++)
        {
            if(this.content[i].typeObj == MATH_COMP)
            {
                this.content[i].setPosition(NewPos);
                NewPos.x += this.content[i].size.width;
            }
            else if(this.content[i].typeObj == MATH_PARA_RUN)
            {
                this.content[i].Math_SetPosition(NewPos);
                NewPos.x += this.content[i].size.width;
            }
            else if(this.content[i].typeObj == MATH_PLACEHOLDER)
                this.content[i].setPosition(NewPos);
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
    getFirstRPrp:    function()
    {
        //var rPrp =  new CMathRunPrp();
        var rPrp = new CTextPr();
        var defaultRPrp = this.ParaMath.Get_Default_TPrp();
        rPrp.Merge(defaultRPrp);

        if(this.content.length > 1)
        {
            var obj = this.content[1];
            if(obj.typeObj === MATH_RUN_PRP) // если первый объект - буква
            {
                rPrp.Merge(obj);
            }
            else if(obj.typeObj === MATH_COMP)
            {
                var FirstRPrp = obj.getCtrPrpForFirst();// иначе зациклимся на getCtrPrp
                rPrp.Merge(FirstRPrp);
            }
        }

        return rPrp;
    },
    increaseArgSize: function()
    {
        if(this.argSize < 2)
            this.argSize++;
    },
    decreaseArgSize: function()
    {
        if( this.argSize > -2 )
            this.argSize--;
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
    setRPrp: function(RunPrp) //object CMathRun
    {
        for(var i = 0; i < this.content.length; i++)
        {
            var obj = this.content[i].value;
            if(obj.typeObj == MATH_RUN_PRP)
            {
                obj.Merge(RunPrp);
            }
            else if(obj.typeObj == MATH_COMP)
            {
                obj.setRPrp(RunPrp);
            }
        }
    },
    apply_RunPr: function(RunPrp)
    {
        this.setRPrp(RunPrp);
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

    /// For Para Math

    Recalculate_CurPos : function(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        var result;

        if(this.content[this.CurPos].typeObj == MATH_COMP)
        {
            result = this.content[this.CurPos].Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
        }
        else if(this.content[this.CurPos].typeObj == MATH_PARA_RUN)
        {
            Y = this.pos.y + this.ParaMath.Y + this.size.ascent;
            _X = this.pos.x + this.ParaMath.X + this.WidthToElement[this.CurPos];


            result = this.content[this.CurPos].Recalculate_CurPos(_X, Y, CurrentRun, 0, 0, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
        }
        else
        {
            Y = this.pos.y + this.ParaMath.Y + this.size.ascent;
            _X = this.pos.x + this.ParaMath.X + this.size.width;

            /*var ctrPrp = this.Parent.getCtrPrp();
            this.ParaMath.ApplyArgSize(ctrPrp);*/

            var ctrPrp = this.Parent.Get_CompiledCtrPrp();

            var sizeCursor = ctrPrp.FontSize*g_dKoef_pt_to_mm;

            Y -= sizeCursor*0.8;

            this.ParaMath.Paragraph.DrawingDocument.SetTargetSize(sizeCursor);
            //Para.DrawingDocument.UpdateTargetFromPaint = true;
            this.ParaMath.Paragraph.DrawingDocument.UpdateTarget( _X, Y, this.ParaMath.Paragraph.Get_StartPage_Absolute() + _CurPage );


            result = {X: _X, Y: Y};
        }

        return result;
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

        this.SelectStartPos = posStart;
        this.SelectEndPos = posEnd;
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

                    //if(this.content[posEnd].typeObj == MATH_PARA_RUN)
                    this.content[posEnd].Set_SelectionContentPos(null, EndContentPos, Depth, -1, EndFlag);
                }
                else
                {
                    this.content[posStart].Set_SelectionContentPos(StartContentPos, null, Depth, StartFlag, -1);

                    //if(this.content[posEnd].typeObj == MATH_PARA_RUN)
                    this.content[posEnd].Set_SelectionContentPos(null, EndContentPos, Depth, 1, EndFlag);
                }
            }
        }

        this.bSelectionUse = true;

    },
    GetSelectContent: function()
    {
        var startPos, endPos;

        if(this.bSelectionUse)
        {
            startPos = this.SelectStartPos;
            endPos = this.SelectEndPos;

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
            bNotSelectComp = bEqual ? this.content[startPos].typeObj === MATH_COMP && this.content[startPos].IsSelectEmpty() : false;

        var result;

        if(bNotSelectComp)
            result = this.content[startPos].GetSelectContent(); // startPos == endPos
        else
            result = {Content: this, Start: startPos, End: endPos};

        return result;

    },
    Select_All: function()
    {
        this.SelectStartPos = 0;
        this.SelectEndPos = this.content.length - 1;

        if(this.content[this.SelectStartPos].typeObj == MATH_PARA_RUN)
            this.content[this.SelectStartPos].Select_All();

        if(this.content[this.SelectEndPos].typeObj == MATH_PARA_RUN)
            this.content[this.SelectEndPos].Select_All();

    },
    Is_SelectedAll: function(Props)
    {
        var bFirst = false, bEnd = false;

        if(this.SelectStartPos == 0 && this.SelectEndPos == this.content.length - 1)
        {
            if(this.content[this.SelectStartPos].typeObj == MATH_PARA_RUN)
                bFirst = this.content[this.SelectStartPos].Is_SelectedAll(Props);
            else
                bFirst = true;

            if(this.content[this.SelectEndPos].typeObj == MATH_PARA_RUN)
                bEnd = this.content[this.SelectEndPos].Is_SelectedAll(Props);
            else
                bEnd = true;
        }

        return bFirst && bEnd;
    },
    Selection_IsEmpty: function()
    {
        var startPos = this.SelectStartPos,
            endPos = this.SelectEndPos;

        var result = false;

        if(startPos == endPos)
        {
            var bRunPrp = this.content[startPos].typeObj == MATH_RUN_PRP,
                bComp = this.content[startPos].typeObj == MATH_COMP;

            if(bRunPrp || bComp)
                result = this.content[startPos].Selection_IsEmpty();
            else
                result = false; // placeholder
        }

        return result;
    },

    ///////////////////////

    Get_StartPos: function(ContentPos, Depth)
    {
        ContentPos.Update( 0, Depth );
        Depth++;

        this.content[0].Get_StartPos(ContentPos, Depth);
    },
    Get_EndPos: function(BehindEnd, ContentPos, Depth)
    {
        var len = this.content.length - 1;
        ContentPos.Update(len, Depth);
        Depth++;

        if(len > 0)
            this.content[len].Get_EndPos(BehindEnd, ContentPos, Depth);
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
        var current = null, left = null;

        var NewContent = [];

        // После чтения из файла формулы, выставить курсор в конец !

        var len = this.content.length;

        for(var i = 0; i < len; i++)
        {
            current = this.content[i];

            var bLeftRun  = left !== null ? left.typeObj == MATH_PARA_RUN : false,
                bRightRun = i < len - 1 ? this.content[i + 1].typeObj === MATH_PARA_RUN : false;

            var bCurrComp = current.typeObj == MATH_COMP,
                bCurrEmptyRun = current.typeObj == MATH_PARA_RUN && current.Is_Empty();

            var bDeleteEmptyRun = bCurrEmptyRun && (bLeftRun || bRightRun);

            if(bCurrComp && !bLeftRun) // добавление пустого Run перед мат объектом
            {
                var emptyRun = new ParaRun(null, true);
                //var txtPrp = current.Get_TxtPrp();
                //emptyRun.Set_Pr(txtPrp);

                NewContent.push(emptyRun);
                NewContent.push(this.content[i]); // Math Object

                left = current;

            }
            else if(!bDeleteEmptyRun )
            {
                NewContent.push(this.content[i]);
                left = current;
            }


            if(bCurrComp && bAll == true)
                this.content[i].SetRunEmptyToContent(bAll);
        }

        if(len > 0 && this.content[len - 1].typeObj == MATH_COMP)
        {
            var emptyRun = new ParaRun(null, true);

            //var emptyRun = new ParaRun(this.ParaMath.Paragraph, true);
            //var txtPrp = current.Get_TxtPrp();
            //emptyRun.Set_Pr(txtPrp);

            NewContent.push(emptyRun);
        }

        this.content = NewContent;

    },
    Create_FontMap : function(Map)
    {
        // TODO
        // заделать для плейсхолдера
        // т.к. для TXT_NORMAL можно выставить другой шрифт для одного плейсхолдера

        for (var index = 0; index < this.content.length; index++)
            if(this.content[index].typeObj !== MATH_PLACEHOLDER)
                this.content[index].Create_FontMap( Map );

    },

    /// функции для работы с курсором
    Get_ParaContentPosByXY: function(SearchPos, Depth)
    {
        if(this.content.length > 0) // случай , если у нас контент не заполнен, не предусмотрен
        {
            var pos = this.findPosition(SearchPos.X, SearchPos.Y);

            SearchPos.Pos.Update( pos, Depth );
            Depth++;
            //ContentPos.Add(pos);

            SearchPos.X -= this.WidthToElement[pos];

            if(this.content[pos].typeObj == MATH_COMP)
            {
                SearchPos.Y -= this.size.ascent - this.content[pos].size.ascent;
                this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth);
            }
            else if(this.content[pos].typeObj == MATH_PARA_RUN)      // проверка на gaps в findDisposition
            {
                SearchPos.X += this.pos.x + this.ParaMath.X + this.WidthToElement[pos];
                SearchPos.CurX += this.pos.x + this.WidthToElement[pos];
                this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth, 0, 0);
            }
            else
            {
                this.content[pos].Get_ParaContentPosByXY(SearchPos, Depth);
            }
        }
    },
    Get_ParaContentPos: function(bSelection, bStart, ContentPos)
    {
        if( bSelection )
        {
            var pos = bStart ? this.SelectStartPos : this.SelectEndPos;
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
        /*this.SelectStartPos = this.CurPos;
        this.SelectEndPos   = this.CurPos;*/

        Depth++;

        var curr = this.content[this.CurPos];

        if(this.content.length > 0)
        {
            if(curr.typeObj == MATH_COMP || curr.typeObj == MATH_PARA_RUN)
                curr.Set_ParaContentPos(ContentPos, Depth);
        }

    },
    Cursor_MoveToStartPos: function()
    {
        if(!this.IsEmpty())
        {
            this.CurPos = 0;
            this.SelectStartPos = 0;
            this.SelectEndPos   = 0;

            this.content[0].Cursor_MoveToStartPos();
        }
    },
    Cursor_MoveToEndPos: function()
    {
        if(!this.IsEmpty())
        {
            var len = this.content.length - 1;
            this.CurPos = len;
            this.SelectStartPos = len;
            this.SelectEndPos   = len;

            this.content[len].Cursor_MoveToEndPos();
        }
    },
    Cursor_Is_Start: function()
    {
        var result = false;

        if( !this.IsEmpty() )
        {
            if(this.CurPos == 0)
                result = this.content[0].Cursor_Is_Start();
        }

        return result;
    },
    Cursor_Is_End: function()
    {
        var result = false;

        if(!this.IsEmpty())
        {
            var len = this.content.length - 1;
            if(this.CurPos == len)
            {
                result = this.content[len].Cursor_Is_End();
            }
        }

        return result;
    },

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
            TextPr = this.Parent.Get_CompiledCtrPrp();
        }
        else if ( true === this.bSelectionUse || bAll == true)
        {
            var StartPos, EndPos;
            if(true === this.bSelectionUse)
            {
                StartPos = this.SelectStartPos;
                EndPos   = this.SelectEndPos;

                if ( StartPos > EndPos )
                {
                    StartPos = this.SelectEndPos;
                    EndPos   = this.SelectStartPos;
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
                var CurTextPr;

                    CurTextPr = this.content[CurPos].Get_CompiledPr(false);
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
            {
                var typeElem = this.content[i].typeObj;

                if( typeElem == MATH_COMP || typeElem == MATH_PARA_RUN)
                    this.content[i].Apply_TextPr( TextPr, IncFontSize, true );
            }
        }
        else
        {
            if(this.bSelectionUse == true)
            {
                var StartPos = this.SelectStartPos;
                var EndPos   = this.SelectEndPos;

                if(StartPos > EndPos)
                {
                    var temp = StartPos;
                    EndPos = StartPos;
                    StartPos = temp;
                }

                if ( StartPos === EndPos )
                {
                    var elem = this.content[StartPos];

                    if( elem.typeObj == MATH_COMP)
                        elem.Apply_TextPr( TextPr, IncFontSize, true );
                    else if(elem.typeObj == MATH_PARA_RUN)
                        elem.Apply_TextPr( TextPr, IncFontSize, false );
                }
                else
                {
                    for(var i = StartPos; i <= EndPos; i++)
                    {
                        var elem = this.content[i];

                        if( elem.typeObj == MATH_COMP)
                            elem.Apply_TextPr( TextPr, IncFontSize, true );
                        else if(elem.typeObj == MATH_PARA_RUN)
                            elem.Apply_TextPr( TextPr, IncFontSize, false );
                    }

                }
            }
            else
            {
                this.content[this.CurPos].Apply_TextPr( TextPr, IncFontSize, false );
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
        var result = false;
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : this.content.length-1;

        var bUseContent = UseContentPos;

        while(CurPos >= 0 && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].typeObj,
                prevType = CurPos > 0 ? this.content[CurPos - 1].typeObj : null;

            if(curType == MATH_PLACEHOLDER)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;

            }
            else if(curType == MATH_COMP)
            {
                this.content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, bUseContent, EndRun);
            }
            else if(EndRun)
            {
                SearchPos.Pos.Update(this.content[CurPos].Content.length, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, bUseContent);
            }

            SearchPos.Pos.Update(CurPos, Depth);


            if(curType == MATH_PARA_RUN && prevType == MATH_PARA_RUN)
                EndRun = false;
            else
                EndRun = true;

            CurPos--;
            bUseContent = false;
        }

        result = SearchPos.Found;

        /// для коррекции позиции курсора в начале Run
        // используется функция Correct_ContentPos в Paragraph

        return result;

    },
    Get_RightPos: function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, BegRun)
    {
        var result = false;
        var CurPos = UseContentPos ? ContentPos.Get(Depth) : 0;

        var bUseContent = UseContentPos;

        while(CurPos < this.content.length && SearchPos.Found == false)
        {
            var curType = this.content[CurPos].typeObj,
                nextType = CurPos < this.content.length - 1 ? this.content[CurPos + 1].typeObj : null;

            if(curType == MATH_PLACEHOLDER)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else if(curType == MATH_COMP)
            {
                this.content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, bUseContent, BegRun);
            }
            else if(BegRun)
            {
                SearchPos.Pos.Update(0, Depth + 1);
                SearchPos.Found = true;
            }
            else
            {
                this.content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, bUseContent);
            }

            SearchPos.Pos.Update(CurPos, Depth);


            if(curType == MATH_PARA_RUN && nextType == MATH_PARA_RUN)
                BegRun = false;
            else
                BegRun = true;

            CurPos++;
            bUseContent = false;

        }

        result = SearchPos.Found;

        return result;
    },
    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
        var CurPos = ( true === UseContentPos ? ContentPos.Get(Depth) : this.content.length - 1 );

        //this.content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
        //CurPos--;


        //if ( true === SearchPos.UpdatePos )
        //    SearchPos.Pos.Update( CurPos, Depth );

        while(CurPos >= 0 && SearchPos.Found == false)
        {
            var item = this.content[CurPos];

            SearchPos.Pos.Update(CurPos, Depth);

            if(item.typeObj == MATH_PLACEHOLDER)
            {
                SearchPos.UpdatePos = true;
                SearchPos.Found = true;
                break;
            }
            else if(item.typeObj == MATH_COMP)
            {
                SearchPos.UpdatePos = true;
                SearchPos.Found = true;
                break;
            }
            else if(item.typeObj == MATH_PARA_RUN)
            {
                item.Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);

                if(true === SearchPos.UpdatePos)
                    break;
            }

            CurPos--;
        }

    },
    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {

    },
    /////////////////////////
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
    Copy: function(Selected)
    {
        var start, end;

        if(Selected)
        {
            if(this.SelectStartPos < this.SelectEndPos)
            {
                start = this.SelectStartPos;
                end   = this.SelectEndPos;
            }
            else
            {
                start = this.SelectEndPos;
                end   = this.SelectStartPos;
            }

        }
        else
        {
            start = 0;
            end = this.content.length - 1;
        }

        var NewContent = new CMathContent();
        NewContent.plhHide = this.plhHide;

        for(var i = start; i <= end; i++)
        {
            var element;
            if(this.content[i].typeObj == MATH_PARA_RUN)
            {
                element = this.content[i].Copy(Selected);
            }
            else
            {
                element = this.content[i].Copy(false);
                //element.relate(this);
            }

            NewContent.content.push(element);
        }

        return NewContent;
    },
    Selection_Remove: function()
    {
        var start = this.SelectStartPos,
            end   = this.SelectEndPos;

        if(this.content[start].typeObj !== MATH_PLACEHOLDER)
            this.content[start].Selection_Remove();

        if(start !== end)
        {
            if(this.content[end].typeObj !== MATH_PLACEHOLDER)
                this.content[end].Selection_Remove();
        }


        this.SelectStartPos = this.CurPos;
        this.SelectEndPos   = this.CurPos;

        this.bSelectionUse = false;
    },
    Set_Select_ToMComp: function(Direction)
    {
        this.bSelectionUse = true;

        if(this.content[this.CurPos].typeObj == MATH_PARA_RUN)
        {
            if(Direction < 0 && this.CurPos > 0 && this.content[this.CurPos - 1].typeObj == MATH_COMP)
            {
                this.SelectStartPos = this.SelectEndPos = this.CurPos - 1;
                this.content[this.CurPos - 1].SetSelectAll();
            }
            else if(this.CurPos < this.content.length - 1 && this.content[this.CurPos + 1].typeObj == MATH_COMP)
            {
                this.SelectStartPos = this.SelectEndPos = this.CurPos + 1;
                this.content[this.CurPos + 1].SetSelectAll();
            }
        }
        else if(this.content[this.CurPos].typeObj == MATH_COMP )
        {
            if(this.content[this.CurPos].IsCurrentPlh())
            {
                this.SelectStartPos = this.SelectEndPos = this.CurPos;
                this.content[this.CurPos].SetSelectAll();
            }
            else
            {
                this.SelectStartPos = this.SelectEndPos = this.CurPos;
                this.content[this.CurPos].Set_Select_ToMComp(Direction);
            }

        }
    },
    getElem: function(nNum)
    {
        return this.content[nNum];
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

                this.setStartPos_Selection(Pos);
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
                this.setStartPos_Selection(Pos);
                //this.selection.active = false;

                this.content = Content_start.concat(Content_end);
                this.CurPos = Pos - 1;
                this.setPlaceholderAfterRemove(); // выставляем placeholder после удаления всех остальных элементов

                break;

            }
        }
    },
	Add: function (oElem, Pos)
	{
        oElem.Parent = this;

        if(oElem.typeObj === MATH_COMP)
        {
            oElem.setArgSize(this.argSize);
            this.content.splice(Pos,0,oElem);
        }
        else
        {
            this.content.push(obj);
        }
    },
    Save_Changes: function(Data, Writer)
    {
        Writer.WriteLong( historyitem_type_MathContent );

        var Type = Data.Type;
        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Math_AddItem:
            {
				var Count  = Data.Items.length;	
				Writer.WriteLong( Count );
			
				for ( var Index = 0; Index < Count; Index++ )
                {
					var oElem = Data.Items[Index];
					var typeObj = oElem.typeObj;
					
					Writer.WriteLong( Data.Pos + Index );
					Writer.WriteString2( oElem.Id );					
					Writer.WriteLong( typeObj );	
					
					if (typeObj == MATH_PARA_RUN)
					{
						Writer.WriteBool(oElem.MathPrp.aln);
						Writer.WriteBool(oElem.MathPrp.bold);
						Writer.WriteBool(oElem.MathPrp.brk);
						Writer.WriteBool(oElem.MathPrp.italic);
						Writer.WriteBool(oElem.MathPrp.lit);
						Writer.WriteLong(oElem.MathPrp.typeText);
					}
                }
                break;
            }
            case historyitem_Math_RemoveItem:
            {
                var bArray = Data.UseArray;
                var Count  = Data.Items.length;

                var StartPos = Writer.GetCurPosition();
                Writer.Skip(4);
                var RealCount = Count;

                for ( var Index = 0; Index < Count; Index++ )
                {
                    if ( true === bArray )
                    {
                        if ( false === Data.PosArray[Index] )
                            RealCount--;
                        else
                            Writer.WriteLong( Data.PosArray[Index] );
                    }
                    else
                        Writer.WriteLong( Data.Pos );

                }

                var EndPos = Writer.GetCurPosition();
                Writer.Seek( StartPos );
                Writer.WriteLong( RealCount );
                Writer.Seek( EndPos );

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
                var Count = Reader.GetLong();

                for ( var Index = 0; Index < Count; Index++ )
                {
                    var Pos     = Reader.GetLong();
					var Element = g_oTableId.Get_ById( Reader.GetString2() );
					var typeObj = Reader.GetLong();

					if (typeObj == MATH_PARA_RUN)
					{
						var MathPrp = new CMPrp();
						MathPrp.aln = Reader.GetBool();
						MathPrp.bold = Reader.GetBool();
						MathPrp.brk = Reader.GetBool();
						MathPrp.italic = Reader.GetBool();
						MathPrp.lit = Reader.GetBool();
						Element.MathPrp = MathPrp;
						Element.typeObj = typeObj;
					}
					
					this.content.splice( Pos, 0, Element );
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
                    var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, Reader.GetLong() );

                    // действие совпало, не делаем его
                    if ( false === ChangesPos )
                        continue;

                    var Pos = ( true !== Debug_ParaRunMode ? this.Internal_Get_RealPos( ChangesPos ) : ChangesPos );
                    this.Content.splice( Pos, 1 );
                }

                break;
            }
        }
    },
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_MathContent );
    },
    Read_FromBinary2 : function(Reader)
    {
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
						oFraction.fillPlaceholders();
						break;
			case 2: 	props = {ctrPrp: new CTextPr(), type:SKEWED_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						oFraction.fillPlaceholders();
						break;
			case 3: 	props = {ctrPrp: new CTextPr(), type:LINEAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						oFraction.fillPlaceholders();
						break;
			case 4: 	var oBox = new CBox(props);
						this.CreateElem(oBox, this)
						
						var oElem = oBox.getBase();
						//здесь выставляем для oElem argPr.argSz=-1; этой обертки нет
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, oElem, null, null);
						oFraction.fillPlaceholders();
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
						oDegree.fillPlaceholders();
						break;
			case 11:	props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oDegree = new CDegree(props);
						this.CreateDegree(oDegree, this, null, null, null);
						oDegree.fillPlaceholders();
						break;
			case 12:	props = {ctrPrp: new CTextPr(), type:DEGREE_SubSup};
						var oDegree = new CDegreeSubSup(props);
						this.CreateDegree(oDegree, this, null, null, null);
						var oSub = oDegree.getLowerIterator();
						oSub.fillPlaceholders();
						var oSup = oDegree.getUpperIterator();
						oSup.fillPlaceholders();
						var oElem = oDegree.getBase();
						oElem.fillPlaceholders();
						break;
			case 13:	props = {ctrPrp: new CTextPr(), type:DEGREE_PreSubSup};
						var oDegree = new CDegreeSubSup(props);
						this.CreateDegree(oDegree, this, null, null, null);
						var oSub = oDegree.getLowerIterator();
						oSub.fillPlaceholders();
						var oSup = oDegree.getUpperIterator();
						oSup.fillPlaceholders();
						var oElem = oDegree.getBase();
						oElem.fillPlaceholders();
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
			case 18:	props = {ctrPrp: new CTextPr(), type:SQUARE_RADICAL, degHede:true};					
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, null);
						oRadical.fillPlaceholders();
						break;
			case 19:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};					
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, null);
						oRadical.fillPlaceholders();
						break;
			case 20:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};
						var sDeg = "2";						
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, sDeg);
						var oElem = oRadical.getBase();
						oElem.fillPlaceholders();
						break;
			case 21:	props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL};
						var sDeg = "3";						
						var oRadical = new CRadical(props);
						this.CreateRadical(oRadical, this, null, sDeg);
						var oElem = oRadical.getBase();
						oElem.fillPlaceholders();
						break;
			case 22:	var oFraction = new CFraction(props);						
						this.CreateElem(oFraction, this);
						
						var oElemNum = oFraction.getNumerator();
						var sText = "-b" + String.fromCharCode(177);
						this.AddText(oElemNum, sText);
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_RADICAL, degHede:true};
						var oRadical = new CRadical(props);
						this.CreateElem(oRadical, oElemNum);						
						var oElem = oRadical.getBase();
						
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
			case 23:	props = {ctrPrp: new CTextPr(), type:SQUARE_RADICAL, degHede:true};
						var oRadical = new CRadical(props);
						this.CreateElem(oRadical, this);
						
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
						oElem.fillPlaceholders();
						break;
			case 25:	props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 26:	props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 27:	var sVal = String.fromCharCode(8748);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 28:	var sVal = String.fromCharCode(8748);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 29:	var sVal = String.fromCharCode(8748);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 30:	var sVal = String.fromCharCode(8749);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 31:	var sVal = String.fromCharCode(8749);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 32:	var sVal = String.fromCharCode(8749);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 33:	var sVal = String.fromCharCode(8750);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 34:	var sVal = String.fromCharCode(8750);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 35:	var sVal = String.fromCharCode(8750);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 36:	var sVal = String.fromCharCode(8751);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 37:	var sVal = String.fromCharCode(8751);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 38:	var sVal = String.fromCharCode(8751);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 39:	var sVal = String.fromCharCode(8752);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, subHide:true, supHide:true, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 40:	var sVal = String.fromCharCode(8752);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_SubSup, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 41:	var sVal = String.fromCharCode(8752);
						props = {ctrPrp: new CTextPr(), limLoc:NARY_UndOvr, chr:sVal};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
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
			case 45:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 46:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 47:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 48:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 49:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 50:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 51:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 52:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 53:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 54:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 55:	var sChar = String.fromCharCode(8720);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 56:	var sChar = String.fromCharCode(8720);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 57:	var sChar = String.fromCharCode(8720);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 58:	var sChar = String.fromCharCode(8720);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 59:	var sChar = String.fromCharCode(8720);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 60:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 61:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 62:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 63:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 64:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 65:	var sChar = String.fromCharCode(8898);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 66:	var sChar = String.fromCharCode(8898);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 67:	var sChar = String.fromCharCode(8898);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 68:	var sChar = String.fromCharCode(8898);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 69:	var sChar = String.fromCharCode(8898);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 70:	var sChar = String.fromCharCode(8897);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 71:	var sChar = String.fromCharCode(8897);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 72:	var sChar = String.fromCharCode(8897);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 73:	var sChar = String.fromCharCode(8897);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 74:	var sChar = String.fromCharCode(8897);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 75:	var sChar = String.fromCharCode(8896);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, subHide:true, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 76:	var sChar = String.fromCharCode(8896);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 77:	var sChar = String.fromCharCode(8896);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						var oSup = oNary.getUpperIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						oSup.fillPlaceholders();
						break;
			case 78:	var sChar = String.fromCharCode(8896);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_UndOvr, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 79:	var sChar = String.fromCharCode(8896);
						props = {ctrPrp: new CTextPr(), chr:sChar, limLoc:NARY_SubSup, supHide:true};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,null,null);
						var oElem = oNary.getBase();
						var oSub = oNary.getLowerIterator();
						oElem.fillPlaceholders();
						oSub.fillPlaceholders();
						break;
			case 80:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, supHide:true};
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
			case 81:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar};
						var oNary = new CNary(props);
						this.CreateNary(oNary,this,null,"i=0","n");
						var oElem = oNary.getBase();
						oElem.fillPlaceholders();
						break;
			case 82:	var sChar = String.fromCharCode(8721);
						props = {ctrPrp: new CTextPr(), chr:sChar, supHide:true};
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
			case 83:	var sChar = String.fromCharCode(8719);
						props = {ctrPrp: new CTextPr(), chr:sChar};
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
			case 84:	var sChar = String.fromCharCode(8899);
						props = {ctrPrp: new CTextPr(), chr:sChar};
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
						
						sChar = String.fromCharCode(8898);
						this.AddText(delimiterBase, sChar);
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub1 = new CDegree(props);
						this.CreateDegree(oSSub1, delimiterBase, "Y", null, "n"); 					
						break;
			case 85:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 86:	props = {ctrPrp: new CTextPr(), column:1, begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 87:	props = {ctrPrp: new CTextPr(), column:1, begChr:"{", endChr:"}"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 88:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 89:	var sBeg = String.fromCharCode(9123);
						var sEnd = String.fromCharCode(9126);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 90:	var sBeg = String.fromCharCode(9121);
						var sEnd = String.fromCharCode(9124);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 91:	var sChr = String.fromCharCode(124);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 92:	var sChr = String.fromCharCode(8214);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 93:	var sChr = String.fromCharCode(91);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 94:	var sChr = String.fromCharCode(93);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 95:	props = {ctrPrp: new CTextPr(), column:1, begChr:"]", endChr:"["};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 96:	var sBeg = String.fromCharCode(10214);
						var sEnd = String.fromCharCode(10215);						
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 97:	props = {ctrPrp: new CTextPr(), column:2};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 98:	props = {ctrPrp: new CTextPr(), column:2, begChr:"{", endChr:"}"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 99:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {ctrPrp: new CTextPr(), column:2, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 100:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {ctrPrp: new CTextPr(), column:3, begChr:sBeg, endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 101:	props = {ctrPrp: new CTextPr(), column:1, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 102:	props = {ctrPrp: new CTextPr(), column:1, begChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 103:	props = {ctrPrp: new CTextPr(), column:1, begChr:"[", endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 104:	props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:"]"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 105:	props = {ctrPrp: new CTextPr(), column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 106:	props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:"}"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 107:	var sBeg = String.fromCharCode(10216);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 108:	var sEnd = String.fromCharCode(10217);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 109:	var sBeg = String.fromCharCode(9123);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 110:	var sEnd = String.fromCharCode(9126);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 111:	var sBeg = String.fromCharCode(9121);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 112:	var sEnd = String.fromCharCode(9124);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 113:	var sBeg = String.fromCharCode(124);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 114:	var sEnd = String.fromCharCode(124);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 115:	var sBeg = String.fromCharCode(8214);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 116:	var sEnd = String.fromCharCode(8214);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 117:	var sBeg = String.fromCharCode(10214);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 118:	var sEnd = String.fromCharCode(10215);
						props = {ctrPrp: new CTextPr(), column:1, begChr:"", endChr:sEnd};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						oDelimiter.fillPlaceholders();
						break;
			case 119:	props = {ctrPrp: new CTextPr(), column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:2};
						var oEqArr = new CEqArray(props);
						this.CreateElem(oEqArr,oElem);
						oEqArr.fillPlaceholders();
						break;
			case 120:	props = {ctrPrp: new CTextPr(), column:1, begChr:"{", endChr:""};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:3};
						var oEqArr = new CEqArray(props);						
						this.CreateElem(oEqArr,oElem);
						oEqArr.fillPlaceholders();					
						break;
			case 121:	props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction, this, null, null);
						oFraction.fillPlaceholders();
						break;
			case 122:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var oElem = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), type:NO_BAR_FRACTION};
						var oFraction = new CFraction(props);
						this.CreateFraction(oFraction,oElem,null,null);
						oFraction.fillPlaceholders();
						break;
			case 123:	this.AddText(this, "f");
						props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter1 = new CDelimiter(props);
						this.CreateElem(oDelimiter1,this);
						var del1Elem = oDelimiter1.getBase(0);
						this.AddText(del1Elem, "x");
						this.AddText(this, "=");
						
						props = {ctrPrp: new CTextPr(), column:1, begChr:"{", endChr:""};
						var oDelimiter2 = new CDelimiter(props);
						this.CreateElem(oDelimiter2,this);
						var del2Elem = oDelimiter2.getBase(0);
						
						props = {ctrPrp: new CTextPr(), row:2};
						var oEqArr = new CEqArray(props);
						this.CreateElem(oEqArr, del2Elem);
						
						var eqArrElem0 = oEqArr.getElement(0);
						this.AddText(eqArrElem0, "-x,&x<0");
						var eqArrElem0 = oEqArr.getElement(1);
						var sTxt = "x,&x" + String.fromCharCode(8805) + "0";
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
			case 125:	var sBeg = String.fromCharCode(10216);
						var sEnd = String.fromCharCode(10217);
						props = {ctrPrp: new CTextPr(), column:1, begChr:sBeg, endChr:sEnd};
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
						oElem.fillPlaceholders();
						break;
			case 127:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cos", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 128:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "tan", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 129:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "csc", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 130:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sec", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 131:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cot", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();						
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
						oElem.fillPlaceholders();						
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
						break;
			case 138:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sinh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 139:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "cosh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 140:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "tanh", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 141:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "csch", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 142:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "sech", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
						break;
			case 143:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "coth", props);
						var oElem = oFunc.getArgument();
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();
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
			case 153:	var sChr = String.fromCharCode(775);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 154:	var sChr = String.fromCharCode(776);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 155:	var sChr = String.fromCharCode(8411);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 156:	var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 157:	var sChr = String.fromCharCode(780);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 158:	var sChr = String.fromCharCode(769);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 159:	var sChr = String.fromCharCode(768);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 160:	var sChr = String.fromCharCode(774);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 161:	var sChr = String.fromCharCode(771);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 162:	var sChr = String.fromCharCode(773);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 163:	var sChr = String.fromCharCode(831);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 164:	var sChr = String.fromCharCode(9182);
						props = {ctrPrp: new CTextPr(), chr:sChr, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,this);
						oGroupChr.fillPlaceholders();
						break;
			case 165:	oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,this);
						oGroupChr.fillPlaceholders();
						break;
			case 166:	props = {ctrPrp: new CTextPr(), type:LIMIT_UP};
						var oLimUpp = new CLimit(props);
						this.CreateElem(oLimUpp,this);
						var oLim = oLimUpp.getIterator();
						oLim.fillPlaceholders();
						var oElem = oLimUpp.getFName();
				
						var sChr = String.fromCharCode(9182);
						props = {ctrPrp: new CTextPr(), chr:sChr, pos:VJUST_TOP, vertJc:VJUST_BOT};
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var grElem = oGroupChr.getBase();
						grElem.fillPlaceholders();
						break;
			case 167:	props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow,this);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						var oElem = oLimLow.getFName();
				
						oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var grElem = oGroupChr.getBase();
						grElem.fillPlaceholders();
						break;
			case 168:	var sChr = String.fromCharCode(8406);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 169:	var sChr = String.fromCharCode(8407);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 170:	var sChr = String.fromCharCode(8417);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 171:	var sChr = String.fromCharCode(8400);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 172:	var sChr = String.fromCharCode(8401);
						props = {ctrPrp: new CTextPr(), chr:sChr};
						var oAcc = new CAccent(props);
						this.CreateElem(oAcc,this);
						oAcc.fillPlaceholders();
						break;
			case 173:	var oBorderBox = new CBorderBox(props);
						this.CreateElem(oBorderBox,this);
						oBorderBox.fillPlaceholders();
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
						oBar.fillPlaceholders();
						break;
			case 176:	var oBar = new CBar(props);
						this.CreateElem(oBar,this);
						oBar.fillPlaceholders();
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
						oArg.fillPlaceholders();
						oFName = oFunc.getFName();
						
						props = {ctrPrp: new CTextPr(), type:DEGREE_SUBSCRIPT};
						var oSSub = new CDegree(props);
						this.CreateElem(oSSub, oFName);
						
						var sSubBase = oSSub.getBase();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(sSubBase, "log", props);
						var oSub = oSSub.getLowerIterator();
						oSub.fillPlaceholders();
						break;
			case 181:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oFName, "log", props);
						break;
			case 182:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
							
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);						
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "lim", props);	
						
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						break;
			case 183:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "min", props);						
						break;
			case 184:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);	
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
						oFName = oFunc.getFName();						
						props = {ctrPrp: new CTextPr(), type:LIMIT_LOW};
						var oLimLow = new CLimit(props);
						this.CreateElem(oLimLow, oFName);
						var oLim = oLimLow.getIterator();
						oLim.fillPlaceholders();
						
						var oElem = oLimLow.getFName();
						props = {ctrPrp: new CTextPr(), sty:"p"};
						this.AddText(oElem, "max", props);						
						break;
			case 185:	var oFunc = new CMathFunc(props);
						this.CreateElem(oFunc,this);
						var oArg = oFunc.getArgument();
						oArg.fillPlaceholders();
						
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
						
						var sChr = String.fromCharCode(8592);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 196:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 197:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8592);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 198:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 199:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8656);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 200:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8658);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 201:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8656);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 202:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8658);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 203:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8596);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 204:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8596);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 205:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBoxprops
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8660);
						props = {ctrPrp: new CTextPr(), pos:VJUST_TOP, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 206:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8660);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						oGroupChr.fillPlaceholders();
						break;
			case 207:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var groupElem = oGroupChr.getBase();
						this.AddText(groupElem,"yields");
						break;
			case 208:	props = {ctrPrp: new CTextPr(), opEmu:1};
						var oBox = new CBox(props);
						this.CreateElem(oBox,this);
						var oElem = oBox.getBase();
						
						var sChr = String.fromCharCode(8594);
						props = {ctrPrp: new CTextPr(), vertJc:VJUST_BOT, chr:sChr}
						var oGroupChr = new CGroupCharacter(props);
						this.CreateElem(oGroupChr,oElem);
						var groupElem = oGroupChr.getBase();
						var sText = String.fromCharCode(8710);
						this.AddText(groupElem,sText);
						break;
			case 209:	props = {ctrPrp: new CTextPr(), column:2, row:1, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;		
			case 210:	props = {ctrPrp: new CTextPr(), column:1, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;	
			case 211:	props = {ctrPrp: new CTextPr(), column:3, row:1, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;
			case 212:	props = {ctrPrp: new CTextPr(), column:1, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;	
			case 213:	props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;
			case 214:	props = {ctrPrp: new CTextPr(), column:3, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;
			case 215:	props = {ctrPrp: new CTextPr(), column:2, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
						break;
			case 216:	props = {ctrPrp: new CTextPr(), column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						oMatrix.fillPlaceholders();
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
			case 221:	props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
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
			case 222:	props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center", plcHide:1};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,this);
						var oElem = oMatrix.getElement(0,0);
						this.AddText(oElem, "1");
						oElem = oMatrix.getElement(1,1);
						this.AddText(oElem, "1");
						break;
			case 223:	props = {ctrPrp: new CTextPr(), column:3, row:3, mcJc:"center"};
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
			case 224:	props = {ctrPrp: new CTextPr(), column:3, row:3, mcJc:"center", plcHide:1};
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
						
						props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						oMatrix.fillPlaceholders();
						break;
			case 226:	props = {ctrPrp: new CTextPr(), column:1,begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						oMatrix.fillPlaceholders();
						break;
			case 227:	var sChr = String.fromCharCode(124);
						props = {ctrPrp: new CTextPr(), column:1,begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						oMatrix.fillPlaceholders();
						break;
			case 228:	var sChr = String.fromCharCode(8214);
						props = {ctrPrp: new CTextPr(), column:1,begChr:sChr, endChr:sChr};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), column:2, row:2, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						oMatrix.fillPlaceholders();
						break;
			case 229:	props = {ctrPrp: new CTextPr(), column:1};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						
						var oElem = oMatrix.getElement(0,0);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();						
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						oElem.fillPlaceholders();
						
						break;
			case 230:	props = {ctrPrp: new CTextPr(), column:1,begChr:"[", endChr:"]"};
						var oDelimiter = new CDelimiter(props);
						this.CreateElem(oDelimiter,this);
						var delimiterBase = oDelimiter.getBase(0);
						
						props = {ctrPrp: new CTextPr(), column:3, row:3, mcJc:"center"};
						var oMatrix = new CMathMatrix(props);
						this.CreateElem(oMatrix,delimiterBase);
						
						var oElem = oMatrix.getElement(0,0);
						oElem.fillPlaceholders();
						oElem = oMatrix.getElement(0,1);
						var sText = String.fromCharCode(8943);
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(0,2);
						oElem.fillPlaceholders();
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
						oElem.fillPlaceholders();						
						oElem = oMatrix.getElement(2,1);
						sText = String.fromCharCode(8943);						
						this.AddText(oElem, sText);
						oElem = oMatrix.getElement(2,2);
						oElem.fillPlaceholders();
						break;
		}
	},
	AddText : function(oElem, sText)
    {		
        if(sText)
        {			
            var MathRun = new ParaRun(this.Paragraph, true);
			
			var Pos = oElem.CurPos,
				PosEnd = Pos + 1;
			var items = [];
            for (var i=0; i < sText.length; i++)
            {
                var oText = new CMathText(false);
                oText.addTxt(sText[i]);				
				MathRun.Add(oText);
            }			
            oElem.addElementToContent(MathRun);
			items.push(MathRun);
			History.Add(oElem, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});			
        }        
    },

    CreateElem : function (oElem, oParent)
    {
		oElem.Parent = oParent;
		var Pos = oParent.CurPos,
				PosEnd = Pos + 1;
		var items = [];
		
        if (oParent)
		{
            oParent.Add(oElem,Pos);
			items.push(oElem);
			History.Add(oParent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});
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

/*function CMathComposition()
{
    this.Parent = undefined;

    this.TEST_SELECT_ACTIVE = false;
    this.absPos = null;
    this.Root = null;

    this.props =
    {
        naryLim:    NARY_UndOvr,
        intLim:     NARY_SubSup,
        brkBin:     BREAK_BEFORE,
        brkSubBin:  BREAK_MIN_MIN,
        wrapIndent: 0,
        smallFrac:  false,
        wrapRight:  false
    };

    this.Size =
    {
        Width:          0,
        WidthVisible:   0,
        Height:         0,
        Ascent:         0,
        Descent:        0
    };

    this.CurrentContent    = null;
    this.SelectContent     = null;

    this.DEFAULT_RUN_PRP = new CMathRunPrp();

    this.Init();
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
    SetProperties: function(props)
    {
        *//*****  FOR FORMULA  *****//*

        // В документации везде, где нет примера использования свояства, означает, что Word не поддерживает это свойство !

        if(props.naryLim == NARY_UndOvr || props.naryLim  == NARY_SubSup)
            this.props.naryLim = props.naryLim;

        if(props.intLim == NARY_UndOvr || props.intLim  == NARY_SubSup)
            this.props.intLim = props.intLim;

        if(props.brkBin == BREAK_BEFORE || props.brkBin == BREAK_AFTER || props.brkBin == BREAK_REPEAT)
            this.props.brkBin = props.brkBin;

        // for minus operator
        // when brkBin is set to repeat
        if(props.brkSubBin == BREAK_MIN_MIN || props.brkSubBin == BREAK_PLUS_MIN || props.brkSubBin == BREAK_MIN_PLUS)
            this.props.brkSubBin = props.brkSubBin;

        // в случае если smallFrac = true,
        if(props.smallFrac == true || props.smallFrac == false)
            this.props.smallFrac = props.smallFrac;

        if(props.wrapIndent + 0 == props.wrapIndent && isNaN(props.wrapIndent)) // проверка на число
            this.props.wrapIndent = props.wrapIndent/1440;

        *//********  check for element 0x1FFD - 0xA721  *******//*
        // This element specifies the right justification of the wrapped line of an instance of mathematical text
        // Instance : Arrows 0x2190-0x21B3, 0x21B6, 0x21B7, 0x21BA-0x21E9, 0x21F4-0x21FF,
        // 0x3D, 0x2234 - 0x2237, 0x2239, 0x223B - 0x228B, 0x228F - 0x2292, 0x22A2 - 0x22B9,
        // 0x22C8-0x22CD, 0x22D0, 0x22D1, 0x22D5 - 0x22EE,0x22F0-0x22FF, 0x27F0 - 0x297F (arrows and fishes), 0x29CE - 0x29D5
        // 0x2A66 - 0x2AF0 (equals), 0x2AF2-0x2AF3, 0x2AF7 - 0x2AFA


        if(props.wrapRight == true || props.wrapRight == false)
            this.props.wrapRight = props.wrapRight;


        *//*****  FOR DOCUMENT  *****//*

        // defaultJc
        // выравнивание формулы в документе

        this.props.defJc = props.defJc;

        // dispDef
        // свойство: применять/ не применять paragraph settings (в тч defaultJc)

        this.props.dispDef = props.dispDef;

        // added to paragraph settings for margins
        // rMargin
        // lMargin

        this.props.lMargin = props.lMargin;
        this.props.rMargin = props.rMargin;

        *//*****  НЕПОДДЕРЖИВАЕМЫЕ Вордом свойства  *****//*

        // mathFont: в качестве font поддерживается только Cambria Math
        // остальные шрифты  возможно будут поддержаны MS в будущем

        this.props.mathFont = props.mathFont;

        // Default font for math zones
        // Gives a drop-down list of math fonts that can be used as the default math font to be used in the document.
        // Currently only Cambria Math has thorough math support, but others such as the STIX fonts are coming soon.

        // http://blogs.msdn.com/b/murrays/archive/2008/10/27/default-document-math-properties.aspx


        *//*****  FOR FORMULA  *****//*

        // http://msdn.microsoft.com/en-us/library/ff529906(v=office.12).aspx
        // Word ignores the interSp attribute and fails to write it back out.
        this.props.interSp = props.interSp;

        // http://msdn.microsoft.com/en-us/library/ff529301(v=office.12).aspx
        // Word does not implement this feature and does not write the intraSp element.
        this.props.intraSp = intraSp;

        *//*****  FOR DOCUMENT  *****//*

        // http://msdn.microsoft.com/en-us/library/ff533406(v=office.12).aspx
        // Word ignores and discards postSp
        this.props.postSp = props.postSp;
        this.props.preSp = props.preSp;

        // RichEdit Hot Keys
        // http://blogs.msdn.com/b/murrays/archive/2013/10/30/richedit-hot-keys.aspx

    },
    GetShiftCenter: function(oMeasure, font)
    {
        oMeasure.SetFont(font);
        var metrics = oMeasure.Measure2Code(0x2217); // "+"

        return 0.6*metrics.Height;
    },
    GetGapSign: function(oMeasure, font)
    {
        oMeasure.SetFont(font);
        var metrics = oMeasure.Measure2Code(0x2217); // "+"

        return metrics.Height;
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
        if(code == 42)
         code = 8727;
         else if(code == 45)
         code = 8722;

         else if(code == 37)
         code = 0x222B;

         else if(code==94)
         code = 0x2211;

         if(code == 0x0068)
         code = 0x210E;
        else if(code > 0x0040 && code < 0x005B)
         code = code + 0x1D3F3;
         else if(code > 0x0060 && code < 0x007b)
         code = code + 0x1D3ED;

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
    TestMouseDown: function()
    {
        var txtPrp = this.Root.getFirstRPrp();
        txtPrp.Merge(this.DEFAULT_RUN_PRP);
        var sh = txtPrp.FontSize*0.017;

        var k = 0, m = 0;

        for(var x = 0; x < this.Root.size.width; x += sh)
        {
            k++;
            for(var y = 0; y < this.Root.size.height; y += sh - 0.1)
            {
                this.Root.selection_Start(x, y);

                var result = this.Root.selection_End(x, y);
                this.SelectContent = result.SelectContent;

                if(!this.SelectContent.selectUse())
                    this.CurrentContent = this.SelectContent;

                m++;

                if(k%10 == 0 && m%10 == 0)
                    console.log("k: " + k, "m: " + m);

                // x = 53.10799999999981
                // y = 18.008999999999965

            }

        }
    },
    Remove_2: function(order)
    {
        if(TEST)
        {
            History.Create_NewPoint();
            var start = this.SelectContent.selection.startPos,
             end = this.SelectContent.selection.endPos;
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
        this.Root.setPosition(this.absPos);
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


        if(this.Root.IsEmpty())
         this.Root.addRunPrp(this.DefaultTxtPrp);

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

            pGraphics.drawHorLine(0, this.absPos.y, this.absPos.x, this.absPos.x + w_Box, 0.2);
            pGraphics.drawHorLine(0, this.absPos.y + h_Box, this.absPos.x, this.absPos.x + w_Box, 0.2);
            pGraphics.drawVerLine(0,this.absPos.x, this.absPos.y, this.absPos.y + h_Box, 0.2 );
            pGraphics.drawVerLine(0,this.absPos.x + w_Box, this.absPos.y, this.absPos.y + h_Box, 0.2 );
        }

        this.Root.draw(pGraphics);
    },
    UpdatePosition: function()
    {
        this.Root.setPosition(this.absPos);
    },
    SetPosition: function(pos)
    {
        this.absPos = pos;
        this.Root.setPosition(this.absPos);
    },
    IsRect: function(x, y)
    {
        var size = this.Root.size;
        return ( x > 0 && x < size.width && y > 0 && y < size.height);
    },
    GetCoordComp: function(x, y)
    {
        var _x = x - this.absPos.x;
        var _y = y - this.absPos.y;

        return {x: _x, y: _y};
    },
    Resize: function(oMeasure)
    {
        this.Root.Resize(oMeasure);
        this.Root.setPosition({x: 0, y: 0});

        this.Size =
        {
            Width:          this.Root.size.width,
            WidthVisible:   this.Root.size.width,
            Height:         this.Root.size.height,
            Ascent:         this.Root.size.ascent,
            Descent:        this.Root.size.height - this.Root.size.ascent
        };

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
    RecalculateReverse: function(oMeasure) // for edit
     {
     this.SelectContent.RecalculateReverse(oMeasure);
     },
    /////////////    end  of  test  functions   /////////////////
    Init: function()
    {
        this.Root = new CMathContent();
        //this.Root.gaps = gps;
        this.Root.setComposition(this);
        //this.SetTestRunPrp();
        //this.Root.setTxtPrp(this.TxtPrp);

        this.CurrentContent = this.Root;
        this.SelectContent  = this.Root;

        this.Root.relate(-1); // корень

        var oWPrp =
        {
            FontFamily:     {Name  : "Cambria Math", Index : -1 },
            FontSize:       11,
            Italic:         true,
            Bold:           false,
            RFonts:         {},
            Lang:           {}
        };

        this.DEFAULT_RUN_PRP.setTxtPrp(oWPrp);
        // Math Run Properties default прокинуты

    },
    SetTestRunPrp: function()
    {
        var runPrp = new CTextPr();
        runPrp.Merge(this.DefaultTxtPrp);

        this.Root.addRunPrp(runPrp);
    },
    GetDefaultRunPrp: function()
    {
        var rPrp = new CMathRunPrp();
        rPrp.Merge(this.DEFAULT_RUN_PRP);

        return rPrp;
    },
    //TODO
    // position вычислить естественно до того, как придет Draw, чтобы не пришлось пересчитывать при изменении в тексте документа
    Draw: function(x, y, pGraphics)
    {
        this.Root.draw(this.absPos.x, this.absPos.y , pGraphics);
    },
    GetFirstRPrp: function()
    {
        return this.Root.getFirstRPrp();
    },
    Cursor_MoveLeft: function(bShiftKey, bCtrlKey)
    {
        var move = this.SelectContent.cursor_moveLeft(bShiftKey, bCtrlKey);

        //for test
        //var move = this.SelectContent.cursor_moveLeft(true, bCtrlKey);

        if(move.state)
        {
            if(bShiftKey)
            {
                this.SelectContent = move.SelectContent;
            }
            else
            {
                 this.SelectContent = move.SelectContent;
                 this.CurrentContent = this.SelectContent;
            }
        }

        return move.state;
    },
    Cursor_MoveRight: function(bShiftKey, bCtrlKey)
    {
        var move = this.SelectContent.cursor_moveRight(bShiftKey, bCtrlKey);

        //for test
        //var move = this.SelectContent.cursor_moveRight(true, bCtrlKey);

        if(move.state)
        {
            if(bShiftKey)
            {
                this.SelectContent = move.SelectContent;
            }
            else
            {
                this.SelectContent = move.SelectContent;
                this.CurrentContent = this.SelectContent;
            }
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
    Cursor_Is_Start: function()
    {
        return this.Root.cursor_Is_Start();
    },
    Cursor_Is_End: function()
    {
        return this.Root.cursor_Is_End();
    },
    old_getSize: function()
    {
        return this.Root.size;

        //
        //var sh = 0.2487852283770651*g_oTextMeasurer.GetHeight();
        //
        var size =
        {
            Width:          this.Root.size.width,
            WidthVisible:   this.Root.size.width,
            Height:         this.Root.size.height,
            Ascent:         this.Root.size.ascent,
            Descent:        this.Root.size.height - this.Root.size.ascent
        };

        return size;
    },
    Remove: function(oContent, nCount, bOnAdd)
    {
        History.Create_NewPoint();
		
		var oStartContent = oContent.Content.content[oContent.Start];
		var oEndContent = oContent.Content.content[oContent.End];		
		var Items = [];
		for (var i=oContent.Start; i<=oContent.End; i++)
		{
			Items.push(oContent.Content.content[i]);
			oContent.Content.content.splice( i, 1 );
		}
		History.Add(oContent.Content, {Type: historyitem_Math_RemoveItem, Items:Items, Pos: oContent.Start});
		return;
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
    UpdateCursor: function(CurPage, UpdateTarget)
    {
        return this.SelectContent.update_Cursor(CurPage, UpdateTarget);
    },
    Refresh_RecalcData2: function()
    {
        this.Parent.Refresh_RecalcData2();
    },
    RecalculateComposition:  function(oMeasure, TextPr) // textPrp в тестовом режиме, просто отрисуем с ними формулу
    {
        this.Resize(oMeasure); // пересчитываем всю формулу

        var width = this.Root.size.width,
            height = this.Root.size.height;

        return {Width: width, Height: height, WidthVisible: width };
    },
    Selection_SetStart: function(X, Y, PageNum)
    {
        var x = X - this.absPos.x,
            y = Y - this.absPos.y;

        this.Root.selection_Start(x, y);
    },
    Selection_SetEnd: function(X, Y, PageNum, MouseEvent)
    {
        var x = X - this.absPos.x,
            y = Y - this.absPos.y;

        var result = this.Root.selection_End(x, y, MouseEvent);
        this.SelectContent = result.SelectContent;

        if(!this.SelectContent.selectUse())
            this.CurrentContent = this.SelectContent;
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
    Apply_TextPr: function(TextPr)
    {
        var RunPrp = new CMathRunPrp();
        RunPrp.setTxtPrp(TextPr);
        this.Root.setRPrp(RunPrp);
    },

    /////////  for Undo/Redo ////////
    Get_SelectionState : function()
    {
        var State = {};

        var stackCurrent = [];
        this.CurrentContent.getStackPositions( stackCurrent );
        State.Current =
        {
            stack:              stackCurrent
        };

        var stackSelect = [];
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
    },
    /////////////////////////////////////////

    //////// for menu  ///////////
    AddToComposition: function(content)
    {
        History.Create_NewPoint();

        if(!this.Selection_IsEmpty())
            this.Remove(1, true);

		var Pos = this.CurrentContent.CurPos + 1;            
        var items = this.CurrentContent.addToContent_2(content);
        this.CurrentContent = this.SelectContent;
		var PosEnd = Pos + items.length;

        History.Add(this.CurrentContent, {Type: historyitem_Math_AddItem, Items: items, Pos: Pos, PosEnd: PosEnd});

    },
    GetCurrentRunPrp: function()
    {
        return this.CurrentContent.getRunPrp(this.CurrentContent.CurPos);
    }
}*/


/*function CEmpty()
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
    this.relate     = function() {};
}*/



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