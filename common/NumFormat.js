/*
 * (c) Copyright Ascensio System SIA 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(/**
* @param {Window} window
* @param {undefined} undefined
*/
function(window, undefined) {
// Import
var CellValueType = AscCommon.CellValueType;

var c_oAscNumFormatType = Asc.c_oAscNumFormatType;

var gc_sFormatDecimalPoint = ".";
var gc_sFormatThousandSeparator = ",";

var numFormat_Text = 0;
var numFormat_TextPlaceholder = 1;
var numFormat_Bracket = 2;
var numFormat_Digit = 3;
var numFormat_DigitNoDisp = 4;
var numFormat_DigitSpace = 5;
var numFormat_DecimalPoint = 6;
var numFormat_DecimalFrac = 7;
var numFormat_Thousand = 8;
var numFormat_Scientific = 9;
var numFormat_Repeat = 10;
var numFormat_Skip = 11;
var numFormat_Year = 12;
var numFormat_Month = 13;
var numFormat_Minute = 14;
var numFormat_Hour = 15;
var numFormat_Day = 16;
var numFormat_Second = 17;
var numFormat_Milliseconds = 18;
var numFormat_AmPm = 19;
var numFormat_DateSeparator = 20;
var numFormat_TimeSeparator = 21;
var numFormat_DecimalPointText = 22;
//Вспомогательные типы, которые заменятюся в _prepareFormat
var numFormat_MonthMinute = 101;
var numFormat_Percent = 102;
var numFormat_General = 103;

var FormatStates = {Decimal: 1, Frac: 2, Scientific: 3, Slash: 4, SlashFrac: 5};
var SignType = {Positive: 1, Negative: 2, Null:3};

var gc_nMaxDigCount = 15;//Максимальное число знаков точности
var gc_nMaxDigCountView = 11;//Максимальное число знаков в ячейке
var gc_nMaxMantissa = Math.pow(10, gc_nMaxDigCount);
var gc_aTimeFormats = ['[$-F400]h:mm:ss AM/PM', 'h:mm;@', 'h:mm AM/PM;@', 'h:mm:ss;@', 'h:mm:ss AM/PM;@', 'mm:ss.0;@',
	'[h]:mm:ss;@'];
var gc_aFractionFormats = ['# ?/?', '# ??/??', '# ???/???', '# ?/2', '# ?/4', '# ?/8', '# ??/16', '# ?/10', '# ??/100'];

var NumComporationOperators =
{
	equal: 1,
	greater: 2,
	less: 3,
	greaterorequal: 4,
	lessorequal: 5,
	notequal: 6
};

function getNumberParts(x)
{
    var sig = SignType.Null;
    if (!isFinite(x))
        x = 0;
	if(x > 0)
		sig = SignType.Positive;
	else if(x < 0)
	{
		sig = SignType.Negative;
		x = Math.abs(x);
	}
    var exp = - gc_nMaxDigCount;
	var man = 0;
	if(SignType.Null != sig)
	{
		exp = Math.floor( Math.log(x) * Math.LOG10E ) - gc_nMaxDigCount + 1;
		//хотелось бы поставить здесь floor, чтобы не округлялось число 0.9999999999999999, но обнаружились проблемы с числом 0.999999999999999
		//после умножения оно превращается в 999999999999998.9
		man = Math.round(x / Math.pow(10, exp));
		if(man >= gc_nMaxMantissa)
		{
			exp++;
			man/=10;
		}
	}
    return {mantissa: man, exponent: exp, sign: sig};//для 0,123 exponent == - gc_nMaxDigCount
}

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

function FormatObj(type, val)
{
    this.type = type;
    this.val = val;//что здесь лежит определяется типом
}
function FormatObjScientific(val, format, sign)
{
    this.type = numFormat_Scientific;
    this.val = val;//E или e
    this.format = format;//array формата
    this.sign = sign;
}
function FormatObjDecimalFrac(aLeft, aRight)
{
    this.type = numFormat_DecimalFrac;
    this.aLeft = aLeft;//array формата левой части
    this.aRight = aRight;//array формата правой части
    this.bNumRight = false;
	this.numerator = 0;
	this.denominator = 0;
}
function FormatObjDateVal(type, nCount, bElapsed)
{
    this.type = type;
    this.val = nCount;//Количество знаков подряд
    this.bElapsed = bElapsed;//true == [hhh]; в квадратных скобках
}
function FormatObjBracket(sData)
{
    this.type = numFormat_Bracket;
    this.val = sData;
    this.parse = function(data)
    {
        var length = data.length;
        if(length > 0)
        {
            var first = data[0];
            if("$" == first)
            {
                var aParams = data.substring(1).split('-');
                if(2 == aParams.length)
                {
                    var sFirstParam = aParams[0];
                    var sSecondParam = aParams[1];
                    if(null != sFirstParam && sFirstParam.length > 0)
                    {
                        this.CurrencyString = sFirstParam;
                    }
                    if (null != sSecondParam && sSecondParam.length > 0) {
						this.Lid = sSecondParam;
					}
                }
            }
			else if("=" == first || ">" == first || "<" == first)
			{
				var nIndex = 1;
				var sOperator = first;
				if(length > 1 && (">" == first || "<" == first))
				{
					var second = data[1];
					if("=" == second || (">" == second && "<" == first))
					{
						sOperator += second;
						nIndex = 2;
					}
				}
				switch(sOperator)
				{
					case "=": this.operator = NumComporationOperators.equal;break;
					case ">": this.operator = NumComporationOperators.greater;break;
					case "<": this.operator = NumComporationOperators.less;break;
					case ">=": this.operator = NumComporationOperators.greaterorequal;break;
					case "<=": this.operator = NumComporationOperators.lessorequal;break;
					case "<>": this.operator = NumComporationOperators.notequal;break;
				}
				this.operatorValue = parseInt(data.substring(nIndex));
			}
            else
            {
				var sLowerColor = data.toLowerCase();
                //todo Color1-56
                if("black" == sLowerColor)
                    this.color = 0x000000;
                else if("blue" == sLowerColor)
                    this.color = 0x0000ff;
                else if("cyan" == sLowerColor)
                    this.color = 0x00ffff;
                else if("green" == sLowerColor)
                    this.color = 0x00ff00;
                else if("magenta" == sLowerColor)
                    this.color = 0xff00ff;
                else if("red" == sLowerColor)
                    this.color = 0xff0000;
                else if("white" == sLowerColor)
                    this.color = 0xffffff;
                else if("yellow" == sLowerColor)
                    this.color = 0xffff00;
                else if("y" == first || "m" == first || "d" == first || "h" == first || "s" == first ||
                    "Y" == first || "M" == first || "D" == first || "H" == first || "S" == first)
                {
                    var bSame = true;
                    var nCount = 1;
                    for(var i = 1; i < length; ++i)
                    {
                        if(first != data[i])
                        {
                            bSame = false;
                            break;
                        }
                        nCount++;
                    }
                    if(true == bSame)
                    {
                        switch(first)
                        {
                            case "Y":
                            case "y": this.dataObj = new FormatObjDateVal(numFormat_Year, nCount, true);break;
                            case "M":
                            case "m": this.dataObj = new FormatObjDateVal(numFormat_MonthMinute, nCount, true);break;
                            case "D":
                            case "d": this.dataObj = new FormatObjDateVal(numFormat_Day, nCount, true);break;
                            case "H":
                            case "h": this.dataObj = new FormatObjDateVal(numFormat_Hour, nCount, true);break;
                            case "S":
                            case "s": this.dataObj = new FormatObjDateVal(numFormat_Second, nCount, true);break;
                        }
                    }
                }
            }
        }
    };
    this.parse(sData);
}
function NumFormat(bAddMinusIfNes)
{
    //Stream чтения формата
    this.formatString = "";
    this.length = this.formatString.length;
    this.index = 0;
    this.EOF = -1;
    
    //Формат
    this.aRawFormat = [];
    this.aDecFormat = [];
    this.aFracFormat = [];
    this.bDateTime = false;
	this.bDate = false;
	this.bTime = false;//флаг, чтобы отличить формат даты с временем, от простой даты
	this.bDay = false;//чтобы отличать когда надо использовать MonthGenitiveNames
    this.nPercent = 0;
    this.bScientific = false;
    this.bThousandSep = false;
    this.nThousandScale = 0;
    this.bTextFormat = false;
    this.bTimePeriod = false;
    this.bMillisec = false;
    this.bSlash = false;
    this.bWhole = false;
	this.bCurrency = false;
	this.bRepeat = false;
    this.Color = -1;
	this.ComporationOperator = null;
	this.LCID = null;
    
	this.bGeneralChart = false;//если в формате только один текст(например в chart "Основной")
    this.bAddMinusIfNes = bAddMinusIfNes;//когда не задано форматирование для отрицательных чисел иногда надо вставлять минус
}
NumFormat.prototype =
{
    _getChar : function()
    {
        if(this.index < this.length)
        {
            return this.formatString[this.index];
        }
        return this.EOF;
    },
    _readChar : function()
    {
        var curChar = this._getChar();
        if(this.index < this.length)
            this.index++;
        return curChar;
    },
    _skip : function(val)
    {
        var nNewIndex = this.index + val;
        if(nNewIndex >= 0)
            this.index = nNewIndex;
    },
    _addToFormat : function(type, val)
    {
        var oFormatObj = new FormatObj(type, val);
        this.aRawFormat.push(oFormatObj);
    },
    _addToFormat2 : function(oFormatObj)
    {
        this.aRawFormat.push(oFormatObj);
    },
    _ReadText : function()
    {
        var sText = "";
        while(true)
        {
            var next = this._readChar();
            if(this.EOF == next || "\"" == next)
                break;
            else
            {
                sText += next;
            }
        }
        this._addToFormat(numFormat_Text, sText);
    },
    _GetText : function(len)
    {
        return this.formatString.substr(this.index, len);
    },
    _ReadChar : function()
    {
        var next = this._readChar();
        if(this.EOF != next)
            this._addToFormat(numFormat_Text, next);
    },
    _ReadBracket : function()
    {
        var sBracket = "";
        while(true)
        {
            var next = this._readChar();
            if(this.EOF == next || "]" == next)
                break;
            else
            {
                sBracket += next;
            }
        }
		var oFormatObjBracket = new FormatObjBracket(sBracket);
		if(null != oFormatObjBracket.operator)
			this.ComporationOperator = oFormatObjBracket;
        this._addToFormat2(oFormatObjBracket);
    },
    _ReadAmPm : function(next)
    {
        var sAm = next;
        var sPm  = "";
        var bAm = true;
        while(true)
        {
            next = this._readChar();
            if(this.EOF == next)
                break;
            else if("/" == next)
            {
                bAm = false;
            }
            else if("A" == next || "a" == next || "P" == next || "p" == next || "M" == next || "m" == next)
            {
                if(true == bAm)
                    sAm += next;
                else
                    sPm += next;
            }
            else
            {
                this._skip(-1);
                break;
            }
        }
        if("" != sAm && "" != sPm)
        {
            this._addToFormat2(new FormatObj(numFormat_AmPm));
            this.bTimePeriod = true;
            this.bDateTime = true;
        }
    },
    _parseFormat : function(format)
    {
        var sGeneral = AscCommon.g_cGeneralFormat.toLowerCase();
        var sGeneralFirst = sGeneral[0];
        this.bGeneralChart = true;
        while(true)
        {
            var next = this._readChar();
            var bNoFormat = false;
            if(this.EOF == next)
                break;
            else if("[" == next)
                this._ReadBracket();
            else if("\"" == next)
                this._ReadText();
            else if("\\" == next)
                this._ReadChar();
            else if("%" == next)
            {
                this._addToFormat(numFormat_Percent);
            }
            else if("$" == next || "+" == next || "-" == next || "(" == next || ")" == next || " " == next)
            {
                this._addToFormat(numFormat_Text, next);
            }
			else if(":" == next)
            {
                this._addToFormat(numFormat_TimeSeparator);
            }
            else if(0 <= next && next <= 9)
            {
                //не 0 может быть только в дробях
                this._addToFormat(numFormat_Digit, next - 0);
            }
            else if("#" == next)
            {
                this._addToFormat(numFormat_DigitNoDisp);
            }
            else if("?" == next)
            {
                this._addToFormat(numFormat_DigitSpace);
            }
            else if (gc_sFormatDecimalPoint == next)
            {
                this._addToFormat(numFormat_DecimalPoint);
            }
            else if("/" == next)
            {
                this._addToFormat2(new FormatObjDecimalFrac([], []));
            }
            else if (gc_sFormatThousandSeparator == next)
            {
                this._addToFormat(numFormat_Thousand, 1);
            }
            else if("E" == next || "e" == next)
            {
                var nextnext = this._readChar();
                if(this.EOF != nextnext && "+" == nextnext || "-" == nextnext)
                {
                    var sign = ("+" == nextnext) ? SignType.Positive : SignType.Negative;
                    this._addToFormat2(new FormatObjScientific(next, "", sign));
                }
            }
            else if("*" == next)
            {
                var nextnext = this._readChar();
                if(this.EOF != nextnext)
                    this._addToFormat(numFormat_Repeat, nextnext);
            }
            else if("_" == next)
            {
                var nextnext = this._readChar();
                if(this.EOF != nextnext)
                    this._addToFormat(numFormat_Skip, nextnext);
            }
            else if("@" == next)
            {
                this._addToFormat(numFormat_TextPlaceholder);
            }
            else if("Y" == next || "y" == next)
            {
                this._addToFormat2(new FormatObjDateVal(numFormat_Year, 1, false));
            }
            else if("M" == next || "m" == next)
            {
                this._addToFormat2(new FormatObjDateVal(numFormat_MonthMinute, 1, false));
            }
            else if("D" == next || "d" == next)
            {
                this._addToFormat2(new FormatObjDateVal(numFormat_Day, 1, false));
            }
            else if("H" == next || "h" == next)
            {
                this._addToFormat2(new FormatObjDateVal(numFormat_Hour, 1, false));
            }
            else if("S" == next || "s" == next)
            {
                this._addToFormat2(new FormatObjDateVal(numFormat_Second, 1, false));
            }
            else if ("A" == next || "a" == next) {
                this._ReadAmPm(next);
            }
            else {
                if (sGeneralFirst === next.toLowerCase() &&
                    sGeneral === (next + this._GetText(sGeneral.length - 1)).toLowerCase()) {
                    this._addToFormat(numFormat_General);
                    this._skip(sGeneral.length - 1);
                } else {
                    bNoFormat = true;
                    this._addToFormat(numFormat_Text, next);
                }
            }
            if (!bNoFormat)
                this.bGeneralChart = false;
        }
        return true;
    },
    _getDateTimeBracket : function(val)
    {
        var res = null;
        var length = val.length;
        if(length > 0)
        {
            var first = val[0];
            if("y" == first || "m" == first || "d" == first || "h" == first || "s" == first)
            {
                var bSame = true;
                var nCount = 1;
                for(var i = 1; i < length; ++i)
                {
                    if(first != val[i])
                    {
                        bSame = false;
                        break;
                    }
                    nCount++;
                }
                if(true == bSame)
                {
                    switch(first)
                    {
                        case "y": res = new FormatObjDateVal(numFormat_Year, nCount, true);break;
                        case "m": res = new FormatObjDateVal(numFormat_MonthMinute, nCount, true);break;
                        case "d": res = new FormatObjDateVal(numFormat_Day, nCount, true);break;
                        case "h": res = new FormatObjDateVal(numFormat_Hour, nCount, true);break;
                        case "s": res = new FormatObjDateVal(numFormat_Second, nCount, true);break;
                    }
                }
            }
        }
        return res;
    },
    _prepareFormat : function()
    {
        //Color
		for(var i = 0, length = this.aRawFormat.length; i < length; ++i)
        {
            var oCurItem = this.aRawFormat[i];
            if(numFormat_Bracket == oCurItem.type && null != oCurItem.color)
                this.Color = oCurItem.color;
        }
        this.bRepeat = false;
        var nFormatLength = this.aRawFormat.length;

        //Группируем несколько элемнтов подряд в один спецсимвол
        for(var i = 0; i < nFormatLength; ++i)
        {
            var item = this.aRawFormat[i];
            if(numFormat_Repeat == item.type)
            {
                //Оставляем только последний numFormat_Repeat
                if(false == this.bRepeat)
                    this.bRepeat = true;
                else
                {
                    this.aRawFormat.splice(i, 1);
                    nFormatLength--;
                }
            }
            else if(numFormat_Bracket == item.type)
            {
                //Разруливаем [hhh]
                var oNewObj = item.dataObj;
                if(null != oNewObj)
                {
                    this.aRawFormat.splice(i, 1, oNewObj);
                    this.bDateTime = true;
                    if(numFormat_Hour == oNewObj.type || numFormat_Minute == oNewObj.type || numFormat_Second == oNewObj.type || numFormat_Milliseconds == oNewObj.type)
                        this.bTime = true;
                    else if (numFormat_Year == oNewObj.type || numFormat_Month == oNewObj.type || numFormat_Day == oNewObj.type) {
                        this.bDate = true;
                        if (numFormat_Day == oNewObj.type)
                            this.bDay = true;
                    }
                }
            }
            else if(numFormat_Year == item.type || numFormat_MonthMinute == item.type || numFormat_Day == item.type || numFormat_Hour == item.type || numFormat_Second == item.type || numFormat_Thousand == item.type)
            {
                //Собираем в одно целое последовательности hhh
                var nStartType = item.type;
                var nEndIndex = i;
                for(var j = i + 1; j < nFormatLength; ++j)
                {
                    if(nStartType == this.aRawFormat[j].type)
                        nEndIndex = j;
                    else
                        break;
                }
                if(i != nEndIndex)
                {
                    item.val = nEndIndex - i + 1;
                    var nDelCount = item.val - 1;
                    this.aRawFormat.splice(i + 1, nDelCount);
                    nFormatLength -= nDelCount;
                }
                if(numFormat_Thousand != item.type)
                {
                    this.bDateTime = true;
                    if(numFormat_Hour == item.type || numFormat_Minute == item.type || numFormat_Second == item.type || numFormat_Milliseconds == item.type)
                        this.bTime = true;
                    else if (numFormat_Year == item.type || numFormat_Month == item.type || numFormat_Day == item.type) {
                        this.bDate = true;
                        if (numFormat_Day == item.type)
                            this.bDay = true;
                    }
                }
            }
            else if(numFormat_Scientific == item.type)
            {
                var bAsText = false;
                if(true == this.bScientific)
                {
                    bAsText = true;
                }
                else
                {
                    var aDigitArray = [];
                    for(var j = i + 1; j < nFormatLength; ++j)
                    {
                        var nextItem = this.aRawFormat[j];
                        if(numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type)
                            aDigitArray.push(nextItem);
                    }
                    if(aDigitArray.length > 0)
                    {
                        item.format = aDigitArray;
                        this.bScientific = true;
                    }
                    else
                        bAsText = true;
                }
                if(false != bAsText)
                {
                    //заменяем на текст
                    item.type = numFormat_Text;
                    item.val = item.val + "+";
                }
            }
            else if(numFormat_DecimalFrac == item.type)
            {
                var bValid = false;
                //собираем правую и левую часть дроби
                var nLeft = i;
                for(var j = i - 1; j >= 0; --j)
                {
                    var subitem = this.aRawFormat[j];
                    if(numFormat_Digit == subitem.type || numFormat_DigitNoDisp == subitem.type || numFormat_DigitSpace == subitem.type)
                        nLeft = j;
                    else
                        break;
                }
                var nRight = i;
                if(nLeft < i)
                {
                    for(var j = i + 1; j < nFormatLength; ++j)
                    {
                        var subitem = this.aRawFormat[j];
                        if(numFormat_Digit == subitem.type || numFormat_DigitNoDisp == subitem.type || numFormat_DigitSpace == subitem.type)
                            nRight = j;
                        else
                            break;
                    }
                    if(nRight > i)
                    {
                        bValid = true;
                        item.aRight = this.aRawFormat.splice(i + 1, nRight - i);
                        item.aLeft = this.aRawFormat.splice(nLeft, i - nLeft);
                        nFormatLength -= nRight - nLeft;
                        i -= i - nLeft;
                        this.bSlash = true;

                        var flag = (item.aRight.length > 0) && (item.aRight[0].type == numFormat_Digit) && (item.aRight[0].val > 0);
                        if(flag)
                        {
                            var rPart = 0;
                            for(var j = 0; j< item.aRight.length; j++)
                            {
                                if(item.aRight[j].type == numFormat_Digit)
                                    rPart = rPart*10 + item.aRight[j].val;
                                else
                                {
                                    bValid = false;
                                    this.bSlash = false;
                                    break;
                                }
                            }
                            if(bValid == true)
                            {
                                item.aRight = [];
                                item.aRight.push(new FormatObj(numFormat_Digit, rPart));
                                item.bNumRight = true;
                            }
                        }
                    }

                }

                if(false == bValid)
                {
                    item.type = numFormat_DateSeparator;
                }
            }
        }
        
        var nReadState = FormatStates.Decimal;
        var bDecimal = true;
        nFormatLength = this.aRawFormat.length;
        //Разруливаем конфликтные ситуации, выставляем значения свойств
        for(var i = 0; i < nFormatLength; ++i)
        {
            var item = this.aRawFormat[i];
            if(numFormat_DecimalPoint == item.type)
            {
                //миллисекунды
                //Если после DecimalPoint идут numFormat_Digit, и есть формат для даты времени, то это миллисекунды
                if(this.bDateTime)
                {
                    var nStartIndex = i;
                    var nEndIndex = nStartIndex;
                    for(var j = i + 1; j < nFormatLength; ++j)
                    {
                        var subItem = this.aRawFormat[j];
                        if(numFormat_Digit == subItem.type)
                            nEndIndex = j;
                        else
                            break;
                    }
                    if(nStartIndex < nEndIndex)
                    {
                        var nDigCount = nEndIndex - nStartIndex;
                        var oNewItem = new FormatObjDateVal(numFormat_Milliseconds, nDigCount, false);
                        var nDelCount = nDigCount;
                        oNewItem.format = this.aRawFormat.splice(i + 1, nDelCount, oNewItem);
                        nFormatLength -= (nDigCount - 1);
                        i++;
                        this.bMillisec = true;

                    }
                    //преобразуем в текст все последующие
                    item.type = numFormat_DecimalPointText;
                    item.val = null;
                }
                else if(FormatStates.Decimal == nReadState)
                    nReadState = FormatStates.Frac;
            }
            else if(numFormat_MonthMinute == item.type)
            {
                //Разрешаем конфликты numFormat_MonthMinute
                var bRightCond = false;
                //ищем вперед первый элемент с типом datetime 
                for(var j = i + 1; j < nFormatLength; ++j)
                {
                    var subItem = this.aRawFormat[j];
                    if(numFormat_Year == subItem.type || numFormat_Month == subItem.type || numFormat_Day == subItem.type || numFormat_MonthMinute == subItem.type ||
                    numFormat_Hour == subItem.type || numFormat_Minute == subItem.type || numFormat_Second == subItem.type || numFormat_Milliseconds == subItem.type)
                    {
                        if(numFormat_Second == subItem.type)
                            bRightCond = true;
                        break;
                    }
                }
                var bLeftCond = false;
                if(false == bRightCond)
                {
                    //ищем назад первый элемент с типом hh или ss
                    var bFindSec = false;//чтобы разрулить случай mm:ss:mm должно быть Минуты:Секунды:Месяцы
                    for(var j = i - 1; j >= 0; --j)
                    {
                        var subItem = this.aRawFormat[j];
                        
                        if(numFormat_Hour == subItem.type)
                        {
                            bLeftCond = true;
                            break;
                        }
                        else if(numFormat_Second == subItem.type)
                        {
                            //продолжаем смотреть дальше, пока не встретиться следующий date time обьект
                            bFindSec = true;
                        }
                        else if(numFormat_Minute == subItem.type || numFormat_Month == subItem.type || numFormat_MonthMinute == subItem.type)
                        {
                            if(true == bFindSec && numFormat_Minute == subItem.type)
                                bFindSec = false;
                            break;
                        }
                        else if(numFormat_Year == subItem.type || numFormat_Day == subItem.type || numFormat_Hour == subItem.type || numFormat_Second == subItem.type || numFormat_Milliseconds == subItem.type)
                        {
                            if(true == bFindSec)
                                break;
                        }
                    }
                    if(true == bFindSec)
                        bLeftCond = true;
                }
                
                if( true == bLeftCond || true == bRightCond)
				{
                    item.type = numFormat_Minute;
					this.bTime = true;
				}
                else
				{
                    item.type = numFormat_Month;
					this.bDate = true;
				}
            }
            else if(numFormat_Percent == item.type)
            {
                this.nPercent++;
                //заменяем на текст
                item.type = numFormat_Text;
                item.val = "%";
            }
            else if(numFormat_Thousand == item.type)
            {
                if(FormatStates.Decimal == nReadState)
                {
                    var bStartCondition = false;
                    if(i > 0)
                    {
                        var prevItem = this.aRawFormat[i - 1];
                        if(numFormat_Digit == prevItem.type || numFormat_DigitNoDisp == prevItem.type || numFormat_DigitSpace == prevItem.type)
                        {
                            bStartCondition = true;
                        }
                    }
                    var bEndCondition = false;
                    if(i+1 < nFormatLength)
                    {
                        var nextItem = this.aRawFormat[i+1];
                        if(numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type)
                            bEndCondition = true;
                    }

                    if(true == bStartCondition && true == bEndCondition)
                    {
                        this.bThousandSep = true;
                    }
                    else if(bEndCondition == true)
                    {
                        //преобразуем в текст
                        item.type = numFormat_Text;
                        item.val = gc_sFormatThousandSeparator;
                    }
                }
                //проверка на концевой nThousandScale
                var bStartCondition = false;
                if(i > 0)
                {
                    var prevItem = this.aRawFormat[i - 1];
                    if(numFormat_Digit == prevItem.type || numFormat_DigitNoDisp == prevItem.type || numFormat_DigitSpace == prevItem.type)
                    {
                        bStartCondition = true;
                    }
                }
                var bEndCondition = true;
                //в последующем тексте нет numFormat_Digit, numFormat_DigitNoDisp, numFormat_DigitSpace
                for(var j = i + 1; j < nFormatLength; ++j)
                {
                    var nextItem = this.aRawFormat[j];
                    if(numFormat_Digit == nextItem.type || numFormat_DigitNoDisp == nextItem.type || numFormat_DigitSpace == nextItem.type || numFormat_DecimalPoint == nextItem.type)
                    {
                        bEndCondition = false;
                        break;
                    }
                }
                if(true == bStartCondition && true == bEndCondition)
                    this.nThousandScale = item.val;

            }
            else if(numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type)
            {
                if(FormatStates.Decimal == nReadState)
                {
                    this.aDecFormat.push(item);

                    if(this.bSlash === true)
                        this.bWhole = true;
                }
                else if(FormatStates.Frac == nReadState)
                    this.aFracFormat.push(item);

            }
            else if(numFormat_Scientific == item.type)
                nReadState = FormatStates.Scientific;
            else if(numFormat_TextPlaceholder == item.type)
            {
                this.bTextFormat = true;
            }
        }
        return true;
    },
	_calsScientific : function(nDecLen, nRealExp)
	{
		var nKoef = 0;
		if(true == this.bThousandSep)
			nKoef = 4;
		if(nDecLen > nKoef)
			nKoef = nDecLen;
		if(nRealExp > 0 && nKoef > 0)
		{
			var nTemp = nRealExp % nKoef;
			if(0 == nTemp)
				nTemp = nKoef;
			nKoef = nTemp;
		}
		return nKoef;
	},
	_parseNumber : function(number, aDecFormat, nFracLen, nValType, cultureInfo)
    {
        var res = {bDigit: false, dec: 0, frac: 0, fraction: 0, exponent: 0, exponentFrac: 0, scientific: 0, sign: SignType.Positive, date: {}};
        if(CellValueType.String != nValType)
            res.bDigit = (number == number - 0);
        if(res.bDigit)
        {
			res.fraction = number - Math.floor(number);
			//Округляем
			var parts = getNumberParts(number);
			res.sign = parts.sign;
			var nRealExp = gc_nMaxDigCount + parts.exponent;//nRealExp == 0, при 0,123
			if(SignType.Null != parts.sign)
			{
				if(true == this.bScientific)
				{
					var nKoef = this._calsScientific(aDecFormat.length, nRealExp);
					res.scientific = nRealExp - nKoef;
					nRealExp = nKoef;
				}
				else
				{
					//Percent
					for(var i = 0; i < this.nPercent; ++i)
						nRealExp += 2;
					//Thousands separator
					for(var i = 0; i < this.nThousandScale; ++i)
						nRealExp -= 3;		
				}
				//округляем после операций которые могут изменить nRealExp
				if(false == this.bSlash)
				{
					var nOldRealExp = nRealExp;
					var dTemp = parts.mantissa * Math.pow(10, nFracLen + nRealExp - gc_nMaxDigCount);
					dTemp = Math.round(dTemp);
					dTemp /= Math.pow(10, nFracLen);
					parts = getNumberParts(dTemp);
					if(SignType.Null != parts.sign)
					{
						nRealExp = gc_nMaxDigCount + parts.exponent;
						if(nOldRealExp != nRealExp && true == this.bScientific)
						{
							var nKoef = this._calsScientific(aDecFormat.length, nRealExp);
							res.scientific += nRealExp - nOldRealExp;
							nRealExp = nKoef;
						}
					}
				}
				res.exponent = nRealExp;
				res.exponentFrac = nRealExp;
				if(nRealExp > 0 && nRealExp < gc_nMaxDigCount)
				{
					var sNumber = parts.mantissa.toString();
					var nExponentFrac = 0;
					for(var i = nRealExp, length = sNumber.length; i < length; ++i)
					{
						if("0" == sNumber[i])
							nExponentFrac++;
						else
							break;
					}
					if(nRealExp + nExponentFrac < sNumber.length)
						res.exponentFrac = - nExponentFrac;
				}
				if(SignType.Null != parts.sign)
				{
					if(nRealExp <= 0)
					{
						if(this.bSlash == true)
						{
							res.dec = 0;
							res.frac = parts.mantissa;
						}
						else
						{
							if(nFracLen > 0)
							{
								res.dec = 0;
								res.frac = 0;
								if(nFracLen + nRealExp > 0)
								{
									var sTemp = parts.mantissa.toString();
									res.frac = sTemp.substring(0, nFracLen + nRealExp) - 0;
								}
							}
							else
							{
								res.dec = 0;
								res.frac = 0;
							}
						}
					}
					else if(nRealExp >= gc_nMaxDigCount)
					{
						res.dec = parts.mantissa;
						res.frac = 0;
					}
					else
					{
						var sTemp = parts.mantissa.toString();
						if(this.bSlash == true)
						{
							res.dec = sTemp.substring(0, nRealExp) - 0;
							if(nRealExp < sTemp.length)
								res.frac = sTemp.substring(nRealExp) - 0;
							else
								res.frac = 0;
						}
						else
						{
							if(nFracLen > 0 )
							{
								res.dec = sTemp.substring(0, nRealExp) - 0;
								res.frac = 0;
								var nStart = nRealExp;
								var nEnd = nRealExp + nFracLen;
								if(nStart < sTemp.length)
									res.frac = sTemp.substring(nStart, nEnd) - 0;
							}
							else
							{
								res.dec = sTemp.substring(0, nRealExp) - 0;
								res.frac = 0;
							}
						}
					}
				}
				if(0 == res.frac && 0 == res.dec)
					res.sign = SignType.Null;
			}
            //После округления может получиться ноль,
            //но не стала перестаскивать проверку на знак сюда, т.к. для округления нужно неотриц число

            if(this.bDateTime === true)
				res.date = this.parseDate(number);
        }
        return res;
    },
	parseDate : function(number)
	{
        var d = {val: 0, coeff: 1}, h = {val: 0, coeff: 24},
            min = {val: 0, coeff: 60}, s = {val: 0, coeff: 60}, ms = {val: 0, coeff: 1000};
        var tmp = +number;// '+' на всякий случай, если придет отриц число
        var ttimes = [d, h, min, s, ms];
        for(var i = 0; i < 4; i++)
        {
            var v = tmp*ttimes[i].coeff;
            ttimes[i].val = Math.floor(v);
            tmp = v - ttimes[i].val;
        }
        ms.val = Math.round(tmp*1000);
        for(i = 4; i > 0 && (ttimes[i].val === ttimes[i].coeff); i--)
        {
            ttimes[i].val = 0;
            ttimes[i-1].val++;
        }
        var stDate, day, month, year, dayWeek;
		if(AscCommon.bDate1904)
		{
			stDate = new Date(Date.UTC(1904,0,1,0,0,0));
			if(d.val)
				stDate.setUTCDate( stDate.getUTCDate() + d.val );
			day = stDate.getUTCDate();
			dayWeek = ( stDate.getUTCDay() > 0) ? stDate.getUTCDay() - 1 : 6;
			month = stDate.getUTCMonth();
			year = stDate.getUTCFullYear();
		}
		else
		{
			if(number === 60)
			{
				day = 29;
				month = 1;
				year = 1900;
				dayWeek = 3;
			}
			else if(number < 60)
			{
				stDate = new Date(Date.UTC(1899,11,31,0,0,0));
				if(d.val)
					stDate.setUTCDate( stDate.getUTCDate() + d.val );
				day = stDate.getUTCDate();
				dayWeek = ( stDate.getUTCDay() > 0) ? stDate.getUTCDay() - 1 : 6;
				month = stDate.getUTCMonth();
				year = stDate.getUTCFullYear();
			}
			else
			{
				stDate = new Date(Date.UTC(1899,11,30,0,0,0));
				if(d.val)
					stDate.setUTCDate( stDate.getUTCDate() + d.val );
				day = stDate.getUTCDate();
				dayWeek = stDate.getUTCDay();
				month = stDate.getUTCMonth();
				year = stDate.getUTCFullYear();
			}
		}
        return {d: day, month: month, year: year, dayWeek: dayWeek, hour: h.val, min: min.val, sec: s.val, ms: ms.val, countDay: d.val };
	},
	_FormatNumber: function (number, exponent, format, nReadState, cultureInfo, opt_forceNull)
	{
        var aRes = [];
        var nFormatLen = format.length;
        if(nFormatLen > 0)
        {
            if(FormatStates.Frac != nReadState && FormatStates.SlashFrac != nReadState)
            {
				var sNumber = number + "";
				var nNumberLen = sNumber.length;
				//для бага Bug 14325 - В загруженной таблице число с 30 знаками после разделителя отображается неправильно.
				//например число "1.23456789123456e+23" и формат "0.000000000000000000000000000000"
				if(exponent > nNumberLen)
				{
					for(var i = 0; i < exponent - nNumberLen; ++i)
						sNumber += "0";
					nNumberLen = sNumber.length;
				}
                var bIsNUll = false;
                if("0" == sNumber && !opt_forceNull)
                    bIsNUll = true;
                //выравниваем длину
                if(nNumberLen > nFormatLen)
                {
                    if(false == bIsNUll)
                    {
                        var nSplitIndex = nNumberLen - nFormatLen + 1;
                        aRes.push(new FormatObj(numFormat_Text, sNumber.slice(0, nSplitIndex)));
                        sNumber = sNumber.substring(nSplitIndex);
                        format.shift();
                    }
                }
                else if(nNumberLen < nFormatLen)
                {
                    //просто копируем, здесь будут только нули и пропуски
                    for(var i = 0, length = nFormatLen - nNumberLen; i < length; ++i)
                    {
                        var item = format.shift();
                        aRes.push(new FormatObj(item.type));
                    }
                }
                //просто заполняем текстом
                for(var i = 0, length = sNumber.length; i < length; ++i)
                {
                    var sCurNumber = sNumber[i];
					var numFormat = numFormat_Text;
                    var item = format.shift();
                    if(true == bIsNUll && null != item && FormatStates.Scientific != nReadState)
					{
						if(numFormat_DigitNoDisp == item.type)
							sCurNumber = "";
						else if(numFormat_DigitSpace == item.type)
						{
							numFormat = numFormat_DigitSpace;
							sCurNumber = null;
						}
					}
                    aRes.push(new FormatObj(numFormat, sCurNumber));
                }
                
                //Вставляем разделители 
                if(true == this.bThousandSep && FormatStates.Slash != nReadState)
                {
					var sThousandSep = cultureInfo.NumberGroupSeparator;
					var aGroupSize = cultureInfo.NumberGroupSizes;
					var nCurGroupIndex = 0;
					var nCurGroupSize = 0;
					if (nCurGroupIndex < aGroupSize.length)
					    nCurGroupSize = aGroupSize[nCurGroupIndex++];
					else
					    nCurGroupSize = 0;
                    var nIndex = 0;
                    for(var i = aRes.length - 1; i >= 0; --i)
                    {
                        var item = aRes[i];
                        if(numFormat_Text == item.type)
                        {
                            var aNewText = [];
                            var nTextLength = item.val.length;
                            for(var j = nTextLength - 1; j >= 0; --j)
                            {
                                if (nCurGroupSize == nIndex)
                                {
                                    aNewText.push(sThousandSep);
                                    nTextLength++;
                                }
                                aNewText.push(item.val[j]);
                                if(0 != j)
                                {
                                    nIndex++;
                                    if (nCurGroupSize + 1 == nIndex) {
                                        nIndex = 1;
                                        if (nCurGroupIndex < aGroupSize.length)
                                            nCurGroupSize = aGroupSize[nCurGroupIndex++];
                                    }
                                }
                            }
                            if(nTextLength > 1)
                                aNewText.reverse();
                            item.val = aNewText.join("");
                        }
                        else if(numFormat_DigitNoDisp != item.type)
                        {
                            //не добавляем пробел только перед numFormat_DigitNoDisp
                            if (nCurGroupSize == nIndex)
                            {
                                item.val = sThousandSep;
                                aRes[i] = item;
                            }
                        }
                        nIndex++;
                        if (nCurGroupSize + 1 == nIndex) {
                            nIndex = 1;
                            if (nCurGroupIndex < aGroupSize.length)
                                nCurGroupSize = aGroupSize[nCurGroupIndex++];
                        }
                    }
                }
            }
            else
            {
				var val = number;
				var exp = exponent;
                //Считаем количество нулей в начале
                var nStartNulls = 0;
				if(exp < 0)
					nStartNulls = Math.abs(exp);
                var sNumber = val.toString();
                var nNumberLen = sNumber.length;
				//удаляем 0 на конце
				var nLastNoNull = nNumberLen;
                for(var i = nNumberLen - 1; i >= 0; --i)
                {
					if ("0" != sNumber[i])
						break;
					nLastNoNull = i;
				}
				if (nLastNoNull < nNumberLen && (FormatStates.SlashFrac != nReadState || 0 == nLastNoNull)) {
					sNumber = sNumber.substring(0, nLastNoNull);
					nNumberLen = sNumber.length;
				}
                //заполняем первые нули
                for(var i = 0; i < nStartNulls; ++i)
                    aRes.push(new FormatObj(numFormat_Text, "0"));
                //просто заполняем текстом
                for(var i = 0, length = nNumberLen; i < length; ++i)
                    aRes.push(new FormatObj(numFormat_Text, sNumber[i]));
                //просто копируем, здесь будут только нули и пропуски
                for(var i = nNumberLen + nStartNulls; i < nFormatLen; ++i)
                {
                    var item = format[i];
                    aRes.push(new FormatObj(item.type));
                }
            }
        }
        return aRes;
    },
    _AddDigItem : function(res, oCurText, item)
    {
        if(numFormat_Text == item.type)
            oCurText.text += item.val;
        else if(numFormat_Digit == item.type)
        {
            //text.val может заполниться в Thousand
            oCurText.text += "0";
            if(null != item.val)
                oCurText.text += item.val;
        }
        else if(numFormat_DigitNoDisp == item.type)
        {
            oCurText.text += "";
            if(null != item.val)
                oCurText.text += item.val;
        }
        else if(numFormat_DigitSpace == item.type)
        {
            var oNewFont = new AscCommonExcel.Font();
			oNewFont.skip = true;
            this._CommitText(res, oCurText, "0", oNewFont);
            if(null != item.val)
                oCurText.text += item.val;
        }
    },
    _ZeroPad: function(n)
    {
        return (n < 10) ? "0" + n : n;
    },
    _CommitText: function(res, oCurText, textVal, format)
    {
        if(null != oCurText && oCurText.text.length > 0)
        {
            this._CommitText(res, null, oCurText.text, null);
            oCurText.text = "";
        }
        if(null != textVal && textVal.length > 0)
        {
            var length = res.length;
            var prev = null;
            if(length > 0)
                prev = res[length - 1];
            if(-1 != this.Color)
            {
                if(null == format)
                    format = new AscCommonExcel.Font();
                format.c = new AscCommonExcel.RgbColor(this.Color);
            }
            if(null != prev && ((null == prev.format && null == format) || (null != prev.format && null != format && format.isEqual(prev.format))))
            {
                prev.text += textVal;
            }
            else
            {
                if(null == format)
                    prev = {text: textVal};
                else
                    prev = {text: textVal, format: format};
                res.push(prev);
            }
        }
    },
    setFormat: function(format, cultureInfo) {
		if (null == cultureInfo) {
            cultureInfo = g_oDefaultCultureInfo;
        }
        this.formatString = format;
        this.length = this.formatString.length;
        //string -> tokens
        this.valid = this._parseFormat();
        if (true == this.valid) {
            //prepare tokens
            this.valid = this._prepareFormat();
            if (this.valid) {
                //additional prepare
                var aCurrencySymbols = ["$", "€", "£", "¥", "р.", cultureInfo.CurrencySymbol];
                var sText = "";
                for (var i = 0, length = this.aRawFormat.length; i < length; ++i) {
                    var item = this.aRawFormat[i];
                    if (numFormat_Text == item.type) {
                        sText += item.val;
                    } else if (numFormat_Bracket == item.type) {
                        if (null != item.CurrencyString) {
							this.bCurrency = true;
                            sText += item.CurrencyString;
                        }
						if (null != item.Lid) {
							//Excel sometimes add 0x10000(0x442 and 0x10442)
							this.LCID = parseInt(item.Lid, 16) & 0xFFFF;
						}
                    }
                    else if (numFormat_DecimalPoint == item.type) {
                        sText += gc_sFormatDecimalPoint;
                    } else if (numFormat_DecimalPointText == item.type) {
                        sText += gc_sFormatDecimalPoint;
                    }
                }
                if ("" != sText) {
                    for (var i = 0, length = aCurrencySymbols.length; i < length; ++i) {
                        if (-1 != sText.indexOf(aCurrencySymbols[i])) {
                            this.bCurrency = true;
                            break;
                        }
                    }
                }
                    }
                }
        return this.valid;
    },
    isInvalidDateValue : function(number)
    {
        return (number == number - 0) && ((number < 0 && !AscCommon.bDate1904) || number > 2958465.9999884);
    },
    _applyGeneralFormat: function(number, nValType, dDigitsCount, bChart, cultureInfo){
        var res = null;
        //todo fIsFitMeasurer and decrease dDigitsCount by other format tokens
        var sGeneral = DecodeGeneralFormat(number, nValType, dDigitsCount);
        if (null != sGeneral) {
            var numFormat = oNumFormatCache.get(sGeneral);
            if (null != numFormat) {
                res = numFormat.format(number, nValType, dDigitsCount, bChart, cultureInfo, true);
            }
        }
        if(!res){
            res = [{text: number.toString()}];
        }
        if (-1 != this.Color) {
            for (var i = 0; i < res.length; ++i) {
                var elem = res[i];
                if (null == elem.format) {
                    elem.format = new AscCommonExcel.Font();
                }
                elem.format.c = new AscCommonExcel.RgbColor(this.Color);
            }
        }
        return res;
    },
	_formatDecimalFrac: function(oParsedNumber) {
		var forceNull = false;
		for (var i = 0; i < this.aRawFormat.length; ++i) {
			var item = this.aRawFormat[i];
			if (numFormat_DecimalFrac == item.type) {
				var frac = oParsedNumber.fraction;
				var numerator = 0;
				var denominator = 0;
				if (item.bNumRight === true) {
					//todo max denominator - 99999
					denominator = item.aRight[0].val;
					numerator = Math.round(denominator * frac);
				} else if (frac > 0) {
					//Continued fraction
					//7 - excel max denominator length
					var denominatorLen = Math.min(7, item.aRight.length);
					var denominatorBound = Math.pow(10, denominatorLen);
					var an = Math.floor(frac);
					var xn1 = frac - an;
					var pn1 = an;
					var qn1 = 1;
					var pn2 = 1;
					var qn2 = 0;
					do {
						an = Math.floor(1 / xn1);
						xn1 = 1 / xn1 - an;
						var pn = an * pn1 + pn2;
						var qn = an * qn1 + qn2;
						pn2 = pn1;
						pn1 = pn;
						qn2 = qn1;
						qn1 = qn;
					} while (qn < denominatorBound);
					numerator = pn2;
					denominator = qn2;
				}
				if (numerator <= 0) {
					numerator = 0;
					if (this.bWhole === false) {
						if (denominator <= 0) {
							denominator = 1;
						}
					} else {
						denominator = 0;
					}
				}
				if (this.bWhole === false) {
					numerator += denominator * oParsedNumber.dec;
				} else if (numerator === denominator && 0 !== numerator) {
					oParsedNumber.dec++;
					numerator = 0;
					denominator = 0;
				}
				if (0 === numerator && 0 === denominator) {
					forceNull = true;
				}
				item.numerator = numerator;
				item.denominator = denominator;
			}
		}
		return forceNull;
	},
    format: function (number, nValType, dDigitsCount, cultureInfo, bChart)
    {
		if (null != this.LCID) {
			cultureInfo = g_aCultureInfos[this.LCID];
		}
        if (null == cultureInfo)
            cultureInfo = g_oDefaultCultureInfo;
        if(null == nValType)
            nValType = CellValueType.Number;
        var res = [];
        var oCurText = {text: ""};
        if(true == this.valid)
        {
            if(true === this.bDateTime)
            {
                if(this.isInvalidDateValue(number))
                {
                    var oNewFont = new AscCommonExcel.Font();
					oNewFont.repeat = true;
                    this._CommitText(res, null, "#", oNewFont);
                    return res;
                }
            }
            var oParsedNumber = this._parseNumber(number, this.aDecFormat, this.aFracFormat.length, nValType, cultureInfo);
            if (true == this.isGeneral() || (true == oParsedNumber.bDigit && true == this.bTextFormat) || (false == oParsedNumber.bDigit && false == this.bTextFormat) || (bChart && this.bGeneralChart))
            {
                return this._applyGeneralFormat(number, nValType, dDigitsCount, bChart, cultureInfo);
            }
			var forceNull = false;
			if (this.bSlash) {
				forceNull = this._formatDecimalFrac(oParsedNumber);
			}
            var aDec = [];
            var aFrac = [];
            var aScientific = [];
            if(true == oParsedNumber.bDigit)
            {
                aDec = this._FormatNumber(oParsedNumber.dec, oParsedNumber.exponent, this.aDecFormat.concat(), FormatStates.Decimal, cultureInfo, forceNull);
                aFrac = this._FormatNumber(oParsedNumber.frac, oParsedNumber.exponentFrac, this.aFracFormat.concat(), FormatStates.Frac, cultureInfo);
            }
            if(true == this.bAddMinusIfNes && SignType.Negative == oParsedNumber.sign)//&& oParsedNumber.dec > 0)
            {
                //todo разобраться с минусами
                //Добавляем в самое начало знак минус
                oCurText.text += "-";
            }
            var bNoDecFormat = false;
            if((null == aDec || 0 == aDec.length) && 0 != oParsedNumber.dec)
            {
                //случай ".00"
                bNoDecFormat = true;
            }
            
            var nReadState = FormatStates.Decimal;
            var nFormatLength = this.aRawFormat.length;    
            for(var i = 0; i < nFormatLength; ++i)
            {
                var item = this.aRawFormat[i];
                if(numFormat_Bracket == item.type)
                {
                    if(null != item.CurrencyString)
                        oCurText.text += item.CurrencyString;
                }
                else if(numFormat_DecimalPoint == item.type)
                {
                    if(bNoDecFormat && null != oParsedNumber.dec && FormatStates.Decimal == nReadState)
                    {
                        oCurText.text += oParsedNumber.dec;
                    }
					oCurText.text += cultureInfo.NumberDecimalSeparator;
                    nReadState = FormatStates.Frac;
                }
                else if (numFormat_DecimalPointText == item.type) {
                    oCurText.text += cultureInfo.NumberDecimalSeparator;
                }
                else if(numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type)
                {
                    var text = null;
                    if(nReadState == FormatStates.Decimal)
                        text = aDec.shift();
                    else if(nReadState == FormatStates.Frac)
                        text = aFrac.shift();
                    else if(nReadState == FormatStates.Scientific)
                        text = aScientific.shift();
                    if(null != text)
                    {
                        this._AddDigItem(res, oCurText, text);
                    }
                }
                else if(numFormat_Text == item.type)
                {
                    oCurText.text += item.val;
                }
                else if(numFormat_TextPlaceholder == item.type)
                {
                    oCurText.text += number;
                }
                else if(numFormat_Scientific == item.type)
                {
                    if(null != item.format)
                    {
                        oCurText.text += item.val;

                        if(oParsedNumber.scientific < 0)
                            oCurText.text += "-";
                        else if(item.sign == SignType.Positive)
                            oCurText.text += "+";

                        
                        aScientific = this._FormatNumber(Math.abs(oParsedNumber.scientific), 0, item.format.concat(), FormatStates.Scientific, cultureInfo);
                        nReadState = FormatStates.Scientific;
                    }
                }
                else if(numFormat_DecimalFrac == item.type)
                {
                    var curForceNull = this.bWhole === false;
					var aLeft = this._FormatNumber(item.numerator, 0, item.aLeft.concat(), FormatStates.Slash, cultureInfo, curForceNull);
					for (var j = 0, length = aLeft.length; j < length; ++j) {
						var subitem = aLeft[j];
						if (subitem) {
							this._AddDigItem(res, oCurText, subitem);
						}
					}
					if ((item.numerator > 0 && item.denominator > 0) || curForceNull) {
						oCurText.text += "/";
					} else {
						var oNewFont = new AscCommonExcel.Font();
						oNewFont.skip = true;
						this._CommitText(res, oCurText, "/", oNewFont);
					}
					if (item.bNumRight === true) {
						var rightVal = item.aRight[0].val;
						if (rightVal) {
							if (item.denominator > 0) {
								oCurText.text += rightVal;
							} else {
								for (var rightIdx = 0; rightIdx < rightVal.toString().length; ++rightIdx) {
									var oNewFont = new AscCommonExcel.Font();
									oNewFont.skip = true;
									this._CommitText(res, oCurText, "0", oNewFont);
								}
							}
						}
					} else {
						var aRight = this._FormatNumber(item.denominator, 0, item.aRight.concat(), FormatStates.SlashFrac, cultureInfo);
						for (var j = 0, length = aRight.length; j < length; ++j) {
							var subitem = aRight[j];
							if (subitem) {
								this._AddDigItem(res, oCurText, subitem);
							}
						}
					}
                }
                else if(numFormat_Repeat == item.type)
                {
                    var oNewFont = new AscCommonExcel.Font();
					oNewFont.repeat = true;
                    this._CommitText(res, oCurText, item.val, oNewFont);
                }
                else if(numFormat_Skip == item.type)
                {
                    var oNewFont = new AscCommonExcel.Font();
					oNewFont.skip = true;
                    this._CommitText(res, oCurText, item.val, oNewFont);
                }
				else if(numFormat_DateSeparator == item.type)
                {
                    oCurText.text += cultureInfo.DateSeparator;
				}
				else if(numFormat_TimeSeparator == item.type)
                {
                    oCurText.text += cultureInfo.TimeSeparator;
				}
                else if(numFormat_Year == item.type)
                {
                  if (item.val > 0) {
                    if (item.val <= 2) {
                      oCurText.text += (oParsedNumber.date.year+'').substring(2);
                    } else {
                      oCurText.text += oParsedNumber.date.year;
                    }
                  }
                }
                else if(numFormat_Month == item.type)
                {
                    var m = oParsedNumber.date.month;
                    if(item.val == 1)
                        oCurText.text += m + 1;
                    else if(item.val == 2)
                        oCurText.text += this._ZeroPad(m + 1);
                    else if (item.val == 3) {
                        if (this.bDay && cultureInfo.AbbreviatedMonthGenitiveNames.length > 0)
                            oCurText.text += cultureInfo.AbbreviatedMonthGenitiveNames[m];
                        else
                            oCurText.text += cultureInfo.AbbreviatedMonthNames[m];
                    }
                    else if (item.val == 5) {
                        var sMonthName = cultureInfo.MonthNames[m];
                        if (sMonthName.length > 0)
                            oCurText.text += sMonthName[0];
                    }
                    else if (item.val > 0){
                        if (this.bDay && cultureInfo.MonthGenitiveNames.length > 0)
                            oCurText.text += cultureInfo.MonthGenitiveNames[m];
                        else
                            oCurText.text += cultureInfo.MonthNames[m];
                    }
                }
                else if(numFormat_Day == item.type)
                {
                    if(item.val == 1)
                        oCurText.text += oParsedNumber.date.d;
                    else if(item.val == 2)
                        oCurText.text += this._ZeroPad(oParsedNumber.date.d);
                    else if(item.val == 3)
                        oCurText.text += cultureInfo.AbbreviatedDayNames[oParsedNumber.date.dayWeek];
                    else if(item.val > 0)
                        oCurText.text += cultureInfo.DayNames[oParsedNumber.date.dayWeek];
                    
                }
                else if(numFormat_Hour == item.type)
                {
                    var h = oParsedNumber.date.hour;
                    if(item.bElapsed === true)
                        h = oParsedNumber.date.countDay*24 + oParsedNumber.date.hour;
                    if(this.bTimePeriod === true)
                        h = h%12||12;

                    if(item.val == 1)
                        oCurText.text += h;
                    else if(item.val > 0)
                        oCurText.text += this._ZeroPad(h);
                }
                else if(numFormat_Minute == item.type)
                {
                    var min = oParsedNumber.date.min;
                    if(item.bElapsed === true)
                        min = oParsedNumber.date.countDay*24*60 + oParsedNumber.date.hour*60 + oParsedNumber.date.min;
                    if(item.val == 1)
                        oCurText.text += min;
                    else if(item.val > 0)
                        oCurText.text += this._ZeroPad(min);
                }
                else if(numFormat_Second == item.type)
                {
                    var s = oParsedNumber.date.sec;
                    if(this.bMillisec === false)
                        s = oParsedNumber.date.sec + Math.round(oParsedNumber.date.ms/1000);
                    if(item.bElapsed === true)
                        s = oParsedNumber.date.countDay*24*60*60 + oParsedNumber.date.hour*60*60 + oParsedNumber.date.min*60 + s;

                    if(item.val == 1)
                        oCurText.text += s;
                    else if(item.val > 0)
                        oCurText.text += this._ZeroPad(s);
                }
                else if (numFormat_AmPm == item.type) {
                    if (cultureInfo.AMDesignator.length > 0 && cultureInfo.PMDesignator.length > 0)
                        oCurText.text += (oParsedNumber.date.hour < 12) ? cultureInfo.AMDesignator : cultureInfo.PMDesignator;
                    else
                        oCurText.text += (oParsedNumber.date.hour < 12) ? "AM" : "PM";
                }
                else if (numFormat_Milliseconds == item.type) {
                    var nMsFormatLength = item.format.length;
                    var dMs = oParsedNumber.date.ms;
                    //Округляем
                    if (nMsFormatLength < 3) {
                        var dTemp = dMs / Math.pow(10, 3 - nMsFormatLength);
                        dTemp = Math.round(dTemp);
                        dMs = dTemp * Math.pow(10, 3 - nMsFormatLength);
                    }
                    var nExponent = 0;
                    if(0 == dMs)
                        nExponent = -1;
                    else if (dMs < 10)
                        nExponent = -2;
                    else if (dMs < 100)
                        nExponent = -1;
                    var aMilSec = this._FormatNumber(dMs, nExponent, item.format.concat(), FormatStates.Frac, cultureInfo);
                    for (var k = 0; k < aMilSec.length; k++)
                        this._AddDigItem(res, oCurText, aMilSec[k]);
                }
                else if (numFormat_General == item.type) {
                    this._CommitText(res, oCurText, null, null);
                    //todo minus sign
                    res = res.concat(this._applyGeneralFormat(Math.abs(number), nValType, dDigitsCount, bChart, cultureInfo));
                }
            }
            this._CommitText(res, oCurText, null, null);
			if(0 == res.length)
                res = [{text: ""}];
        }
        else
        {
            if(0 == res.length)
                res = [{text: number.toString()}];
        }
		//длина результирующей строки не должна быть длиннее c_oAscMaxColumnWidth
		var nLen = 0;
		for(var i = 0; i < res.length; ++i){
			var elem = res[i];
			if(elem.text)
				nLen += elem.text.length;
		}
		if(nLen > Asc.c_oAscMaxColumnWidth){
			var oNewFont = new AscCommonExcel.Font();
			oNewFont.repeat = true;
			res = [{text: "#", format: oNewFont}];
		}
        return res;
    },
    toString : function(output, nShift)
    {
        var bRes = true;
        if(this.bDateTime || this.bSlash || this.bTextFormat || (nShift < 0 && 0 == this.aFracFormat.length))
            return false;
        var nDecLength = this.aDecFormat.length;
        var nDecIndex = 0;
        var nFracLength = this.aFracFormat.length;
        var nFracIndex = 0;
        var nNewFracLength = nFracLength + nShift;
        if(nNewFracLength < 0)
            nNewFracLength = 0;
        var nReadState = FormatStates.Decimal;
        var res = "";
        var fFormatToString = function(aFormat)
        {
            var res = "";
            for(var i = 0, length = aFormat.length; i < length; ++i)
            {
                var item = aFormat[i];
                if(numFormat_Digit == item.type)
                {
                    if(null != item.val)
                        res += item.val;
                    else
                        res += "0";
                }
                else if(numFormat_DigitNoDisp == item.type)
                    res += "#";
                else if(numFormat_DigitSpace == item.type)
                    res += "?";
            }
            return res;
        };
        //Color
        if(null != this.Color)
        {
            switch(this.Color)
            {
            case 0x000000: res += "[Black]";break;
            case 0x0000ff: res += "[Blue]";break;
            case 0x00ffff: res += "[Cyan]";break;
            case 0x00ff00: res += "[Green]";break;
            case 0xff00ff: res += "[Magenta]";break;
            case 0xff0000: res += "[Red]";break;
            case 0xffffff: res += "[White]";break;
            case 0xffff00: res += "[Yellow]";break;
            }
        }
		//Comporation operator
        if(null != this.ComporationOperator)
        {
			switch(this.ComporationOperator.operator)
			{
				case NumComporationOperators.equal: res += "[=" + this.ComporationOperator.operatorValue +"]";break;
				case NumComporationOperators.greater: res += "[>" + this.ComporationOperator.operatorValue +"]";break;
				case NumComporationOperators.less: res += "[<" + this.ComporationOperator.operatorValue +"]";break;
				case NumComporationOperators.greaterorequal: res += "[>=" + this.ComporationOperator.operatorValue +"]";break;
				case NumComporationOperators.lessorequal: res += "[<=" + this.ComporationOperator.operatorValue +"]";break;
				case NumComporationOperators.notequal: res += "[<>" + this.ComporationOperator.operatorValue +"]";break;
			}
		}
        //ThousandSep
        var bAddThousandSep = this.bThousandSep;
        var nThousandScale = this.nThousandScale;
            
        var nFormatLength = this.aRawFormat.length;    
        for(var i = 0; i < nFormatLength; ++i)
        {
            var item = this.aRawFormat[i];
            if(numFormat_Bracket == item.type)
            {
                if(null != item.CurrencyString || null != item.Lid)
                {
                    res += "[$";
                    if(null != item.CurrencyString)
                        res += item.CurrencyString;
                    res += "-";
                    if(null != item.Lid)
                        res += item.Lid;
                    res += "]";
                }
            }
            else if(numFormat_DecimalPoint == item.type)
            {
                nReadState = FormatStates.Frac;
                if(0 != nNewFracLength && 0 != nShift)
                    res += gc_sFormatDecimalPoint;
            }
            else if (numFormat_DecimalPointText == item.type) {
                res += gc_sFormatDecimalPoint;
            }
            else if(numFormat_Thousand == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += gc_sFormatThousandSeparator;
            }
            else if(numFormat_Digit == item.type || numFormat_DigitNoDisp == item.type || numFormat_DigitSpace == item.type)
            {
                if(FormatStates.Decimal == nReadState)
                    nDecIndex++;
                else
                    nFracIndex++;
                if(nReadState == FormatStates.Frac && nFracIndex > nNewFracLength)
                    ;
                else
                {
                    var sCurSimbol;
                    if(numFormat_Digit == item.type)
                        sCurSimbol = "0";
                    else if(numFormat_DigitNoDisp == item.type)
                        sCurSimbol = "#";
                    else if(numFormat_DigitSpace == item.type)
                        sCurSimbol = "?";
                    res += sCurSimbol;
                    if(nReadState == FormatStates.Frac && nFracIndex == nFracLength)
                    {
                        for(var j = 0; j < nShift; ++j)
                            res += sCurSimbol;
                    }
                }
                if(0 == nFracLength && nShift > 0 && FormatStates.Decimal == nReadState && nDecIndex == nDecLength)
                {
                    res += gc_sFormatDecimalPoint;
                    for(var j = 0; j < nShift; ++j)
                        res += "0";
                }
            }
            else if(numFormat_Text == item.type)
            {
                if("%" == item.val)
                    res += item.val;
                else
                    res += "\"" + item.val + "\"";
            }
            else if(numFormat_TextPlaceholder == item.type)
                res += "@";
            else if(numFormat_Scientific == item.type)
            {
                nReadState = FormatStates.Scientific;
                res += item.val;
                if(item.sign == SignType.Positive)
                    res += "+";
                else
                    res += "-";
            }
            else if(numFormat_DecimalFrac == item.type)
            {
                res += fFormatToString(item.aLeft);
                res += "/";
                res += fFormatToString(item.aRight);
            }
            else if(numFormat_Repeat == item.type)
                res += "*" + item.val;
            else if(numFormat_Skip == item.type)
                res += "_" + item.val;
			else if(numFormat_DateSeparator == item.type)
                res += "/";
			else if(numFormat_TimeSeparator == item.type)
                res += ":";
            else if(numFormat_Year == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "y";
            }
            else if(numFormat_Month == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "m";
            }
            else if(numFormat_Day == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "d";
            }
            else if(numFormat_Hour == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "h";
            }
            else if(numFormat_Minute == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "m";
            }
            else if(numFormat_Second == item.type)
            {
                for(var j = 0; j < item.val; ++j)
                    res += "s";
            }
            else if(numFormat_AmPm == item.type)
                res += "AM/PM";
            else if(numFormat_Milliseconds == item.type)
                res += fFormatToString(item.format);
        }
        output.format = res;
        return true;
    },
	getFormatCellsInfo: function() {
		var info = new Asc.asc_CFormatCellsInfo();
		info.asc_setDecimalPlaces(this.aFracFormat.length);
		info.asc_setSeparator(this.bThousandSep);
		info.asc_setSymbol(this.LCID);
		return info;
	},
	isGeneral: function() {
		return 1 == this.aRawFormat.length && numFormat_General == this.aRawFormat[0].type;
	}
};
function NumFormatCache()
{
    this.oNumFormats = {};
}
NumFormatCache.prototype =
{
	cleanCache : function(){
		this.oNumFormats = {};
	},
    get : function(format)
    {
        var res = this.oNumFormats[format];
        if(null == res)
        {
            res = new CellFormat(format);
            this.oNumFormats[format] = res;
        }
        return res;
    },
    set : function(format)
    {
        var res = new CellFormat(format);
        this.oNumFormats[format] = res;
    }
};
//кеш структур по строке формата
var oNumFormatCache = new NumFormatCache();

function CellFormat(format)
{
    this.sFormat = format;
    this.oPositiveFormat = null;
    this.oNegativeFormat = null;
    this.oNullFormat = null;
    this.oTextFormat = null;
	this.aComporationFormats = null;
    var aFormats = format.split(";");
	var aParsedFormats = [];
	for(var i = 0; i < aFormats.length; ++i)
	{
    var sNewFormat = aFormats[i];
    //если sNewFormat заканчивается на нечетное число '\', значит ';' был экранирован и это текст
    while(true){
      var formatTail = sNewFormat.match(/\\+$/g);
      if (formatTail && formatTail.length > 0 && 1 === formatTail[0].length % 2 && i + 1 < aFormats.length) {
        sNewFormat += ';';
        sNewFormat += aFormats[++i];
      } else {
        break;
      }
    }
		var oNewFormat = new NumFormat(false);
		oNewFormat.setFormat(sNewFormat);
		aParsedFormats.push(oNewFormat);
	}
  var nFormatsLength = aParsedFormats.length;
	var bComporationOperator = false;
	if(nFormatsLength > 0)
	{
		var oFirstFormat = aParsedFormats[0];
		if(null != oFirstFormat.ComporationOperator)
		{
			bComporationOperator = true;
			//проверяем можно ли привести к стандартному формату
			//todo сохранять измененный формат в файл
			if(3 == nFormatsLength)
			{
				var oPositive = null;
				var oNegative = null;
				var oNull = null;
				for(var i = 0; i < nFormatsLength; ++i)
				{
					var oCurFormat = aParsedFormats[i];
					if(null == oCurFormat.ComporationOperator)
					{
						if(null == oPositive)
							oPositive = oCurFormat;
						else if(null == oNegative)
							oNegative = oCurFormat;
						else if(null == oNull)
							oNull = oCurFormat;
					}
					else
					{
						var oComporationOperator = oCurFormat.ComporationOperator;
						if(0 == oComporationOperator.operatorValue)
						{
							switch(oComporationOperator.operator)
							{
								case NumComporationOperators.greater: oPositive = oCurFormat;break;
								case NumComporationOperators.less: oNegative = oCurFormat;break;
								case NumComporationOperators.equal: oNull = oCurFormat;break;
							}
						}
						else
						{
							//невозможно привести
							oPositive = oNegative = oNull = null;
							break;
						}
					}
				}
			}
			this.oTextFormat = new NumFormat(false);
			this.oTextFormat.setFormat("@");
			if(null == oPositive || null == oNegative || null == oNull)
			{
				//по результатам опытов, если оператор сравнения проходит через 0, то надо добавлять знак минус в зависимости от значения
				//пример [<100] надо добавлять знак, [<-100] знак добавлять не надо
				for(var i = 0, length = aParsedFormats.length; i < length; ++i)
				{
					var oCurFormat = aParsedFormats[i];
					if(null == oCurFormat.ComporationOperator)
						oCurFormat.bAddMinusIfNes = true;
					else
					{
						var oComporationOperator = oCurFormat.ComporationOperator;
						if(0 < oComporationOperator.operatorValue && (oComporationOperator.operator == NumComporationOperators.less || oComporationOperator.operator == NumComporationOperators.lessorequal))
							oCurFormat.bAddMinusIfNes = true;
						else if(0 > oComporationOperator.operatorValue && (oComporationOperator.operator == NumComporationOperators.greater || oComporationOperator.operator == NumComporationOperators.greaterorequal))
							oCurFormat.bAddMinusIfNes = true;
					}
				}
				this.aComporationFormats = aParsedFormats;
			}
			else
			{
				this.oPositiveFormat = oPositive;
				this.oNegativeFormat = oNegative;
				this.oNullFormat = oNull;
			}
		}
	}
	if(false == bComporationOperator)
	{
		if(4 <= nFormatsLength)
		{
			this.oPositiveFormat = aParsedFormats[0];
			this.oNegativeFormat = aParsedFormats[1];
			this.oNullFormat = aParsedFormats[2];
			this.oTextFormat = aParsedFormats[3];
			//for ';;;' format, if 4 formats exist fourth always used for text
			this.oTextFormat.bTextFormat = true;
		}
		else if(3 == nFormatsLength)
		{
			this.oPositiveFormat = aParsedFormats[0];
			this.oNegativeFormat = aParsedFormats[1];
			this.oNullFormat = aParsedFormats[2];
			this.oTextFormat = this.oPositiveFormat;
			if (this.oNullFormat.bTextFormat) {
			    this.oTextFormat = this.oNullFormat;
			    this.oNullFormat = this.oPositiveFormat;
			}
		}
		else if(2 == nFormatsLength)
		{
			this.oPositiveFormat = aParsedFormats[0];
			this.oNegativeFormat = aParsedFormats[1];
			this.oNullFormat = this.oPositiveFormat;
			this.oTextFormat = this.oPositiveFormat;
			if (this.oNegativeFormat.bTextFormat) {
			    this.oTextFormat = this.oNegativeFormat;
			    this.oNegativeFormat = this.oPositiveFormat;
			}
		}
		else
		{
			this.oPositiveFormat = aParsedFormats[0];
			this.oPositiveFormat.bAddMinusIfNes = true;
			this.oNegativeFormat = this.oPositiveFormat;
			this.oNullFormat = this.oPositiveFormat;
			this.oTextFormat = this.oPositiveFormat;
		}
	}
    this.formatCache = {};
}
CellFormat.prototype =
{
	isTextFormat : function()
	{
		if(null != this.oPositiveFormat)
			return this.oPositiveFormat.bTextFormat;
		else if(null != this.aComporationFormats && this.aComporationFormats.length > 0)
			return this.aComporationFormats[0].bTextFormat;
		return false;
	},
	isGeneralFormat : function()
	{
		if(null != this.oPositiveFormat)
			return this.oPositiveFormat.isGeneral();
		else if(null != this.aComporationFormats && this.aComporationFormats.length > 0)
			return this.aComporationFormats[0].isGeneral();
		return false;
	},
	isDateTimeFormat : function()
	{
		if(null != this.oPositiveFormat)
			return this.oPositiveFormat.bDateTime;
		else if(null != this.aComporationFormats && this.aComporationFormats.length > 0)
			return this.aComporationFormats[0].bDateTime;
		return false;
	},
	getTextFormat: function () {
	    var oRes = null;
	    if (null == this.aComporationFormats) {
	        if (null != this.oTextFormat && this.oTextFormat.bTextFormat)
	            oRes = this.oTextFormat;
	    } else {
	        for (var i = 0, length = this.aComporationFormats.length; i < length ; ++i) {
	            var oCurFormat = this.aComporationFormats[i];
	            if (null == oCurFormat.ComporationOperator && oCurFormat.bTextFormat) {
	                oRes = oCurFormat;
	                break;
	            }
	        }
	    }
	    return oRes;
	},
	getFormatByValue : function(dNumber)
	{
		var oRes = null;
		if(null == this.aComporationFormats)
		{
			if(dNumber > 0 && null != this.oPositiveFormat)
				oRes = this.oPositiveFormat;
			else if(dNumber < 0 && null != this.oNegativeFormat)
				oRes = this.oNegativeFormat;
			else if(null != this.oNullFormat)
				oRes = this.oNullFormat;
		}
		else
		{
			//ищем совпадение
			var nLength = this.aComporationFormats.length;
			var oDefaultComporationFormat = null;
			for(var i = 0, length = nLength; i < length ; ++i)
			{
				var oCurFormat = this.aComporationFormats[i];
				if(null != oCurFormat.ComporationOperator)
				{
					var bOperationResult = false;
					var oOperationValue = oCurFormat.ComporationOperator.operatorValue;
					switch(oCurFormat.ComporationOperator.operator)
					{
						case NumComporationOperators.equal: bOperationResult = (dNumber == oOperationValue);break;
						case NumComporationOperators.greater: bOperationResult = (dNumber > oOperationValue);break;
						case NumComporationOperators.less: bOperationResult = (dNumber < oOperationValue);break;
						case NumComporationOperators.greaterorequal: bOperationResult = (dNumber >= oOperationValue);break;
						case NumComporationOperators.lessorequal: bOperationResult = (dNumber <= oOperationValue);break;
						case NumComporationOperators.notequal: bOperationResult = (dNumber != oOperationValue);break;
					}
					if(true == bOperationResult)
						oRes = oCurFormat;
				}
				else if(null == oDefaultComporationFormat)
					oDefaultComporationFormat = oCurFormat;
			}
			if(null == oRes && null != oDefaultComporationFormat)
				oRes = oDefaultComporationFormat;
		}
		return oRes;
	},
    format : function(number, nValType, dDigitsCount, bChart, cultureInfo, opt_withoutCache)
    {
        var res = null;
        if (null == bChart)
            bChart = false;
        var lcid = cultureInfo ? cultureInfo.LCID : 0;
        var cacheKey, cacheVal;
        if (!opt_withoutCache) {
            cacheKey = number + '-' + nValType + '-' + dDigitsCount + '-' + lcid;
            cacheVal = this.formatCache[cacheKey];
            if(null != cacheVal)
            {
                if (bChart)
                    res = cacheVal.chart;
                else
                    res = cacheVal.nochart;
                if (null != res)
                    return res;
            }
        }
        res = [{text: number.toString()}];
        var dNumber = number - 0;
        var oFormat = null;
		if(CellValueType.String != nValType && number == dNumber)
		{
			oFormat = this.getFormatByValue(dNumber);
			if(null != oFormat)
			    res = oFormat.format(number, nValType, dDigitsCount, cultureInfo, bChart);
			else if(null != this.aComporationFormats)
			{
			    var oNewFont = new AscCommonExcel.Font();
				oNewFont.repeat = true;
				res = [{text: "#", format: oNewFont}];
			}
		}
		else
		{
			//text
		    if (null != this.oTextFormat) {
		        oFormat = this.oTextFormat;
		        res = oFormat.format(number, nValType, dDigitsCount, cultureInfo, bChart);
		    }
		}
        if (!opt_withoutCache) {
            if (null == cacheVal) {
                cacheVal = {chart: null, nochart: null};
                this.formatCache[cacheKey] = cacheVal;
            }
            if (null != oFormat && oFormat.bGeneralChart) {
                if (bChart)
                    cacheVal.chart = res;
                else
                    cacheVal.nochart = res;
            }
            else {
                cacheVal.chart = res;
                cacheVal.nochart = res;
            }
        }
        return res;
    },
    shiftFormat : function(output, nShift)
    {
        var bRes = false;
        var bCurRes = true;
		if(null == this.aComporationFormats)
		{
			bCurRes = this.oPositiveFormat.toString(output, nShift);
			if(false == bCurRes)
				output.format = this.oPositiveFormat.formatString;
			bRes |= bCurRes;
			if(null != this.oNegativeFormat && this.oPositiveFormat != this.oNegativeFormat)
			{
				var oTempOutput = {};
				bCurRes = this.oNegativeFormat.toString(oTempOutput, nShift);
				if(false == bCurRes)
					output.format += ";" + this.oNegativeFormat.formatString;
				else
					output.format += ";" + oTempOutput.format;
				bRes |= bCurRes;
			}
			if(null != this.oNullFormat && this.oPositiveFormat != this.oNullFormat)
			{
				var oTempOutput = {};
				bCurRes = this.oNullFormat.toString(oTempOutput, nShift);
				if(false == bCurRes)
					output.format += ";" + this.oNullFormat.formatString;
				else
					output.format += ";" + oTempOutput.format;
				bRes |= bCurRes;
			}
			if(null != this.oTextFormat && this.oPositiveFormat != this.oTextFormat)
			{
				var oTempOutput = {};
				bCurRes = this.oTextFormat.toString(oTempOutput, nShift);
				if(false == bCurRes)
					output.format += ";" + this.oTextFormat.formatString;
				else
					output.format += ";" + oTempOutput.format;
				bRes |= bCurRes;
			}
		}
		else
		{
			var length = this.aComporationFormats.length;
			output.format = "";
			for(var i = 0; i < length; ++i)
			{
				var oTempOutput = {};
				var oCurFormat = this.aComporationFormats[i];
				var bCurRes = oCurFormat.toString(oTempOutput, nShift);
				if(0 != i)
					output.format += ";";
				if(false == bCurRes)
					output.format += oCurFormat.formatString;
				else
					output.format += oTempOutput.format;
				bRes |= bCurRes;
			}
		}
        return bRes;
    },
	formatToMathInfo : function(number, nValType, dDigitsCount)
	{
		return this._formatToText(number, nValType, dDigitsCount, false);
	},
	formatToChart : function(number, cultureInfo)
	{
		return this._formatToText(number, CellValueType.Number, gc_nMaxDigCount, true, cultureInfo);
	},
	_formatToText : function(number, nValType, dDigitsCount, bChart, cultureInfo)
	{
		var result = "";
		var arrFormat = this.format(number, nValType, dDigitsCount, bChart, cultureInfo);
		for (var i = 0, item; i < arrFormat.length; ++i) {
			item = arrFormat[i];
			if (item.format) {
				if (item.format.repeat)
					continue;
				if (item.format.skip) {
					result += " ";
					continue;
				}
			}
			if (item.text)
				result += item.text;
		}
		return result;
	},
	getType: function() {
		return this.getTypeInfo().type;
	},
	getTypeInfo: function() {
		var info;
		if (null != this.oPositiveFormat) {
			info = this.oPositiveFormat.getFormatCellsInfo();
			info.asc_setType(this._getType(this.oPositiveFormat));
		} else if (null != this.aComporationFormats && this.aComporationFormats.length > 0) {
			info = this.aComporationFormats[0].getFormatCellsInfo();
			info.asc_setType(this._getType(this.aComporationFormats[0]));
		} else {
			info = new Asc.asc_CFormatCellsInfo();
			info.asc_setType(c_oAscNumFormatType.General);
			info.asc_setDecimalPlaces(0);
			info.asc_setSeparator(false);
			info.asc_setSymbol(null);
		}
		return info;
	},
	_getType: function(format) {
		var nType = c_oAscNumFormatType.Custom;
		if (format.isGeneral()) {
			nType = c_oAscNumFormatType.General;
		}
		else if (format.bDateTime) {
			if (format.bDate) {
				nType = c_oAscNumFormatType.Date;
			} else {
				nType = c_oAscNumFormatType.Time;
			}
		}
		else if (format.bCurrency) {
			if (format.bRepeat) {
				nType = c_oAscNumFormatType.Accounting;
			} else {
				nType = c_oAscNumFormatType.Currency;
			}
		} else {
			var info = format.getFormatCellsInfo();
			var types = [c_oAscNumFormatType.Text, c_oAscNumFormatType.Percent, c_oAscNumFormatType.Scientific,
				c_oAscNumFormatType.Number, c_oAscNumFormatType.Fraction];
			for (var i = 0; i < types.length; ++i) {
				var type = types[i];
				info.asc_setType(type);
				var formats = getFormatCells(info);
				if (-1 != formats.indexOf(this.sFormat)) {
					nType = type;
					break;
				}
			}

		}
		return nType;
	}
};
var oDecodeGeneralFormatCache = {};
function DecodeGeneralFormat(val, nValType, dDigitsCount)
{
    var cacheVal = oDecodeGeneralFormatCache[val];
    if(null != cacheVal)
    {
        cacheVal = cacheVal[nValType];
        if(null != cacheVal)
        {
            cacheVal = cacheVal[dDigitsCount];
            if(null != cacheVal)
                return cacheVal;
        }
    }
    var res = DecodeGeneralFormat_Raw(val, nValType, dDigitsCount);
    var cacheVal = oDecodeGeneralFormatCache[val];
    if(null == cacheVal)
    {
        cacheVal = {};
        oDecodeGeneralFormatCache[val] = cacheVal;
    }
    var cacheType = cacheVal[nValType];
    if(null == cacheType)
    {
        cacheType = {};
        cacheVal[nValType] = cacheType;
    }
    cacheType[dDigitsCount] = res;
    return res;
}
function DecodeGeneralFormat_Raw(val, nValType, dDigitsCount)
{
    if(CellValueType.String == nValType)
        return "@";
    var number = val - 0;
    if(number != val)
        return "@";
    if(0 == number)
        return "0";
    var nDigitsCount;
    if(null == dDigitsCount || dDigitsCount > gc_nMaxDigCountView)
        nDigitsCount = gc_nMaxDigCountView;
    else
        nDigitsCount = parseInt(dDigitsCount);//пока не подключена измерялся не используем нецелые метрики
    if(number < 0)
    {
        //todo возможно нужно nDigitsCount--
        //nDigitsCount--;//на знак '-'
        number = -number;
    }
    if(nDigitsCount < 1)
        return "0";//можно возвращать любой числовой формат, все равно при nDigitsCount < 1 он учитываться не будет
	var bContinue = true;
	var parts = getNumberParts(number);
	while(bContinue)
	{
		bContinue = false;
		var nRealExp = gc_nMaxDigCount + parts.exponent;//nRealExp == 0, при 0,123
		var nRealExpAbs = Math.abs(nRealExp);
		var nExpMinDigitsCount;//число знаков в формате 'E+00'
		if(nRealExpAbs < 100)
			nExpMinDigitsCount = 4;
		else
			nExpMinDigitsCount = 2 + nRealExpAbs.toString().length;
		
		var suffix = "";
		if (nRealExp > 0)
		{
			if(nRealExp > nDigitsCount)
			{
				if(nDigitsCount >= nExpMinDigitsCount + 1)//1 на еще один символ перед E (*E+00)
				{
					suffix = "E+";
					for(var i = 2; i < nExpMinDigitsCount; ++i)
						suffix += "0";
					nDigitsCount -= nExpMinDigitsCount;
				}
				else
					return "0";//можно возвращать любой числовой формат, все равно будут решетки
			}
		}
		else
		{
			var nVarian1 = nDigitsCount - 2 + nRealExp;//без E+00, 2 на знаки "0."
			var nVarian2 = nDigitsCount - nExpMinDigitsCount;// с E+00
			if(nVarian2 > 2)
				nVarian2--;//на знак '.'
			else if(nVarian2 > 0)
				nVarian2 = 1;
			if(nVarian1 <= 0 && nVarian2 <= 0)
				return "0";
			if(nVarian1 < nVarian2)
			{
				//если в nVarian1 число помещается полностью, то применяем nVarian1
				var bUseVarian1 = false;
				if(nVarian1 > 0 && 0 == (parts.mantissa % Math.pow(10, gc_nMaxDigCount - nVarian1)))
					bUseVarian1 = true;
				if(false == bUseVarian1)
				{
					if(nDigitsCount >= nExpMinDigitsCount + 1)
					{
						suffix = "E+";
						for(var i = 2; i < nExpMinDigitsCount; ++i)
							suffix += "0";
						nDigitsCount -= nExpMinDigitsCount;
					}
					else
						return "0";//можно возвращать любой числовой формат, все равно будут решетки
				}
			}
		}
		var dec_num_digits = nRealExp;
		if(suffix)
			dec_num_digits = 1;
		//округляем мантиссу, чтобы правильно обрабатывать ситуацию 0,999, когда nDigitsCount = 4
		var nRoundDigCount = 0;
		if(dec_num_digits <= 0)
		{
			//2 на знаки '0.'
			var nTemp = nDigitsCount + dec_num_digits - 2;
			if(nTemp > 0)
				nRoundDigCount = nTemp;
		}
		else if(dec_num_digits < gc_nMaxDigCount)
		{
			if(dec_num_digits <= nDigitsCount)
			{
				//1 на знаки '.'
				if(dec_num_digits + 1 < nDigitsCount)
					nRoundDigCount = nDigitsCount - 1;
				else
					nRoundDigCount = dec_num_digits;
			}
		}
		if(nRoundDigCount > 0)
		{
			var nTemp = Math.pow(10, gc_nMaxDigCount - nRoundDigCount);
			number = Math.round(parts.mantissa / nTemp) * nTemp * Math.pow(10, parts.exponent);
			
			var oNewParts = getNumberParts(number);
			//если в результате округления изменилось число разрядов, надо начинать заново
			if(oNewParts.exponent != parts.exponent)
				bContinue = true;
			else
				bContinue = false;
			parts = oNewParts;
		}
	}
	
    var frac_num_digits;
    if(dec_num_digits > 0)
        frac_num_digits = nDigitsCount - 1 - dec_num_digits;//1 на знак '.'
    else
        frac_num_digits = nDigitsCount - 2 + dec_num_digits;//2 на знаки '0.' 
        
    //считаем необходимое число знаков после запятой
    if(frac_num_digits > 0)
    {
		var sTempNumber = parts.mantissa.toString();
		var sTempNumber;
		if(dec_num_digits > 0)
			sTempNumber = sTempNumber.substring(dec_num_digits, dec_num_digits + frac_num_digits);
		else
			sTempNumber = sTempNumber.substring(0, frac_num_digits);
        var nTempNumberLength = sTempNumber.length;
        var nreal_frac_num_digits = frac_num_digits;
        for(var i = frac_num_digits - 1; i >= 0; --i)
        {
            if("0" == sTempNumber[i])
                nreal_frac_num_digits--;
            else
                break;
        }
        frac_num_digits = nreal_frac_num_digits;
		if(dec_num_digits < 0)
			frac_num_digits += (-dec_num_digits);
    }
    if(frac_num_digits <= 0)
        return "0" + suffix;

    //собираем формат
    var number_format_string = "0" + gc_sFormatDecimalPoint;
    for(var i = 0; i < frac_num_digits; ++i)
        number_format_string += "0";
    number_format_string += suffix;
    return number_format_string;
}
function GeneralEditFormatCache()
{
    this.oCache = {};
}
GeneralEditFormatCache.prototype =
{
	cleanCache : function(){
		this.oCache = {};
	},
    format: function (number, cultureInfo)
    {
        if (null == cultureInfo)
            cultureInfo = g_oDefaultCultureInfo;
        //преобразуем число так чтобы в строке было только 15 значящих цифр.
        var value = this.oCache[number];
        if(null == value)
        {
			if(0 == number)
				value = "0";
			else
			{
				var sRes = "";
				var parts = getNumberParts(number);
				var nRealExp = gc_nMaxDigCount + parts.exponent;//nRealExp == 0, при 0,123
				if(parts.exponent >= 0)//nRealExp >= -gc_nMaxDigCount
				{
					if(nRealExp <= 21)
					{
						sRes = parts.mantissa.toString();
						for(var i = 0; i < parts.exponent; ++i)
							sRes += "0";
					}
					else
					{
					    sRes = this._removeTileZeros(parts.mantissa.toString(), cultureInfo);
						if(sRes.length > 1)
						{
							var temp = sRes.substring(0, 1);
							temp += cultureInfo.NumberDecimalSeparator;
							temp += sRes.substring(1);
							sRes = temp;
						}
						sRes += "E+" + (nRealExp - 1);
					}
				}
				else
				{
					if(nRealExp > 0)
					{
						sRes = parts.mantissa.toString();
						if(sRes.length > nRealExp)
						{
							var temp = sRes.substring(0, nRealExp);
							temp += cultureInfo.NumberDecimalSeparator;
							temp += sRes.substring(nRealExp);
							sRes = temp;
						}
						sRes = this._removeTileZeros(sRes, cultureInfo);
					}
					else
					{
						if(nRealExp >= -18)
						{
							sRes = "0";
							sRes += cultureInfo.NumberDecimalSeparator;
							for(var i = 0; i < -nRealExp; ++i)
								sRes += "0";
							var sTemp = parts.mantissa.toString();
							sTemp = sTemp.substring(0, 19 + nRealExp);
							sRes += this._removeTileZeros(sTemp, cultureInfo);
						}
						else
						{
							sRes = parts.mantissa.toString();
							if(sRes.length > 1)
							{
								var temp = sRes.substring(0, 1);
								temp += cultureInfo.NumberDecimalSeparator;
								temp += sRes.substring(1);
								temp = this._removeTileZeros(temp, cultureInfo);
								sRes = temp;
							}
							sRes += "E-" + (1 - nRealExp);
						}
					}
				}
				if( SignType.Negative == parts.sign)
					value = "-" + sRes;
				else
					value = sRes;
			}
            this.oCache[number] = value;
        }
        return value;
    },
    _removeTileZeros: function (val, cultureInfo)
    {
		var res = val;
		var nLength = val.length;
		var nLastNoZero = nLength - 1;
		for(var i = val.length - 1; i >= 0; --i)
		{
			nLastNoZero = i;
			if("0" != val[i])
				break;
		}
		if(nLastNoZero != nLength - 1)
		{
		    if (cultureInfo.NumberDecimalSeparator == res[nLastNoZero])
				res = res.substring(0, nLastNoZero);
			else
				res = res.substring(0, nLastNoZero + 1);
		}
		return res;
	}
};
var oGeneralEditFormatCache = new GeneralEditFormatCache();

function FormatParser()
{
    this.aCurrencyRegexp = {};
    this.aThouthandRegexp = {};
	this.days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.daysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	this.bFormatMonthFirst = true;
}
FormatParser.prototype =
{
    isLocaleNumber: function (val, cultureInfo) {
        if (null == cultureInfo)
            cultureInfo = g_oDefaultCultureInfo;
        //javascript decimal separator is '.'
        if ("." != cultureInfo.NumberDecimalSeparator) {
            val = val.replace(".", "q");//заменяем на символ с которым не распознается, как в Excel
            val = val.replace(cultureInfo.NumberDecimalSeparator, ".");
        }
        //parseNum исключаем запись числа в 16-ричной форме из числа.
        return AscCommonExcel.parseNum(val) && Asc.isNumberInfinity(val);
    },
    parseLocaleNumber: function (val, cultureInfo) {
        if (null == cultureInfo)
            cultureInfo = g_oDefaultCultureInfo;
        //javascript decimal separator is '.'
        if ("." != cultureInfo.NumberDecimalSeparator) {
            val = val.replace(".", "q");//заменяем на символ с которым не распознается, как в Excel
            val = val.replace(cultureInfo.NumberDecimalSeparator, ".");
        }
        return val - 0;
    },
    parse: function (value, cultureInfo)
    {
        if (null == cultureInfo)
            cultureInfo = g_oDefaultCultureInfo;
        var res = null;
        var bError = false;
        //replace Non-breaking space(0xA0) with White-space(0x20)
        if (" " == cultureInfo.NumberGroupSeparator)
            value = value.replace(new RegExp(String.fromCharCode(0xA0), "g"));
        var rx_thouthand = this.aThouthandRegexp[cultureInfo.LCID];
        if (null == rx_thouthand) {
            rx_thouthand = new RegExp("^(([ \\+\\-%\\$€£¥\\(]|" + escapeRegExp(cultureInfo.CurrencySymbol) + ")*)((\\d+" + escapeRegExp(cultureInfo.NumberGroupSeparator) + "\\d+)*\\d*" + escapeRegExp(cultureInfo.NumberDecimalSeparator) + "?\\d*)(([ %\\)]|р.|" + escapeRegExp(cultureInfo.CurrencySymbol) + ")*)$");
            this.aThouthandRegexp[cultureInfo.LCID] = rx_thouthand;
        }
        var match = value.match(rx_thouthand);
        if (null != match) {
            var sBefore = match[1];
            var sVal = match[3];
            var sAfter = match[5];
			var oChartCount = {};
			if(null != sBefore)
			    this._parseStringLetters(sBefore, cultureInfo.CurrencySymbol, true, oChartCount);
			if(null != sAfter)
			    this._parseStringLetters(sAfter, cultureInfo.CurrencySymbol, false, oChartCount);
			var bMinus = false;
			var bPercent = false;
			var sCurrency = null;
			var oCurrencyElem = null;
			var nBracket = 0;
			for(var sChar in oChartCount){
				var elem = oChartCount[sChar];
				if(" " == sChar)
					continue;
				else if("+" == sChar){
					if(elem.all > 1)
						bError = true;
				}
				else if("-" == sChar){
					if(elem.all > 1)
						bError = true;
					else
						bMinus = true;
				}
				else if("-" == sChar){
					if(elem.all > 1)
						bError = true;
					else
						bMinus = true;
				}
				else if("(" == sChar){
					if(1 == elem.all && 1 == elem.before)
						nBracket++;
					else
						bError = true;
				}
				else if(")" == sChar){
					if(1 == elem.all && 1 == elem.after)
						nBracket++;
					else
						bError = true;
				}
				else if("%" == sChar){
					if(1 == elem.all)
						bPercent = true;
					else
						bError = true;
				}
				else{
					if(null == sCurrency && 1 == elem.all){
						sCurrency = sChar;
						oCurrencyElem = elem;
					}
					else
						bError = true;
				}
			}
			if (nBracket > 0) {
			    if (2 == nBracket)
			        bMinus = true;
			    else
			        bError = true;
			}
			var CurrencyNegativePattern = cultureInfo.CurrencyNegativePattern;
			if(null != sCurrency){
			    if (sCurrency == cultureInfo.CurrencySymbol) {
			        var nPattern = cultureInfo.CurrencyNegativePattern;
			        if (0 == nPattern || 1 == nPattern || 2 == nPattern || 3 == nPattern || 9 == nPattern || 11 == nPattern || 12 == nPattern || 14 == nPattern) {
			            if (1 != oCurrencyElem.before)
			                bError = true;
			        }
			        else if (1 != oCurrencyElem.after)
			            bError = true;
			    }
			    else if(-1 != "$€£¥".indexOf(sCurrency)){
			        if (1 == oCurrencyElem.before) {
			            CurrencyNegativePattern = 0;
			        }
                    else
						bError = true;
				}
				else if(-1 != "р.".indexOf(sCurrency)){
				    if (1 == oCurrencyElem.after) {
				        CurrencyNegativePattern = 5;
				    }
                    else
						bError = true;
				}
				else
				    bError = true;
			}
			if(!bError){
				var oVal = this._parseThouthand(sVal, cultureInfo);
				if (oVal) {
					res = {format: null, value: null, bDateTime: false, bDate: false, bTime: false, bPercent: false, bCurrency: false};
					var dVal = oVal.number;
					if (bMinus)
						dVal = -dVal;
					var sFracFormat = "";
					if (parseInt(dVal) != dVal)
						sFracFormat = gc_sFormatDecimalPoint + "00";
					var sFormat = null;
					if (bPercent) {
						res.bPercent = true;
						dVal /= 100;
						sFormat = "0" + sFracFormat + "%";
					}
					else if (sCurrency) {
						res.bCurrency = true;
					    var sNumberFormat = "#" + gc_sFormatThousandSeparator + "##0" + sFracFormat;
					    var sCurrencyFormat;
					    if(sCurrency.length > 1)
					        sCurrencyFormat = "\"" + sCurrency + "\"";
					    else
					        sCurrencyFormat = "\\" + sCurrency;
					    var sPositivePattern;
					    var sNegativePattern;
					    switch (CurrencyNegativePattern) {
					        case 0:
					            sPositivePattern = sCurrencyFormat + sNumberFormat + "_)";
					            sNegativePattern = "[Red](" + sCurrencyFormat + sNumberFormat + ")";
					            break;
					        case 1:
					            sPositivePattern = sCurrencyFormat + sNumberFormat;
					            sNegativePattern = "[Red]-" + sCurrencyFormat + sNumberFormat;
					            break;
					        case 2:
					            sPositivePattern = sCurrencyFormat + sNumberFormat;
					            sNegativePattern = "[Red]" + sCurrencyFormat + "-" + sNumberFormat;
					            break;
					        case 3:
					            sPositivePattern = sCurrencyFormat + sNumberFormat + "_-";
					            sNegativePattern = "[Red]" + sCurrencyFormat + sNumberFormat + "-";
					            break;
					        case 4:
					            sPositivePattern = sNumberFormat + sCurrencyFormat + "_)";
					            sNegativePattern = "[Red](" + sNumberFormat + sCurrencyFormat + ")";
					            break;
					        case 5:
					            sPositivePattern = sNumberFormat + sCurrencyFormat;
					            sNegativePattern = "[Red]-" + sNumberFormat + sCurrencyFormat;
					            break;
					        case 6:
					            sPositivePattern = sNumberFormat + "-" + sCurrencyFormat;
					            sNegativePattern = "[Red]" + sNumberFormat + "-" + sCurrencyFormat;
					            break;
					        case 7:
					            sPositivePattern = sNumberFormat + sCurrencyFormat + "_-";
					            sNegativePattern = "[Red]" + sNumberFormat + sCurrencyFormat + "-";
					            break;
					        case 8:
					            sPositivePattern = sNumberFormat + " " + sCurrencyFormat;
					            sNegativePattern = "[Red]-" + sNumberFormat + " " + sCurrencyFormat;
					            break;
					        case 9:
					            sPositivePattern = sCurrencyFormat + " " + sNumberFormat;
					            sNegativePattern = "[Red]-" + sCurrencyFormat + " " + sNumberFormat;
					            break;
					        case 10:
					            sPositivePattern = sNumberFormat + " " + sCurrencyFormat + "_-";
					            sNegativePattern = "[Red]" + sNumberFormat + " " + sCurrencyFormat + "-";
					            break;
					        case 11:
					            sPositivePattern = sCurrencyFormat + " " + sNumberFormat + "_-";
					            sNegativePattern = "[Red]" + sCurrencyFormat + " " + sNumberFormat + "-";
					            break;
					        case 12:
					            sPositivePattern = sCurrencyFormat + " " + sNumberFormat;
					            sNegativePattern = "[Red]" + sCurrencyFormat + " -" + sNumberFormat;
					            break;
					        case 13:
					            sPositivePattern = sNumberFormat + " " + sCurrencyFormat;
					            sNegativePattern = "[Red]" + sNumberFormat + "- " + sCurrencyFormat;
					            break;
					        case 14:
					            sPositivePattern = sCurrencyFormat + " " + sNumberFormat + "_)";
					            sNegativePattern = "[Red](" + sCurrencyFormat + " " + sNumberFormat + ")";
					            break;
					        case 15:
					            sPositivePattern = sNumberFormat + " " + sCurrencyFormat + "_)";
					            sNegativePattern = "[Red](" + sNumberFormat + " " + sCurrencyFormat + ")";
					            break;
					    }
					    sFormat = sPositivePattern + ";" + sNegativePattern;
					}
					else if (oVal.thouthand) {
						sFormat = "#" + gc_sFormatThousandSeparator + "##0" + sFracFormat;
					}
					else
						sFormat = AscCommon.g_cGeneralFormat;
					res.format = sFormat;
					res.value = dVal;
				}
			}
        }
        if (null == res && !bError)
            res = this.parseDate(value, cultureInfo);
        return res;
    },
    _parseStringLetters: function (sVal, currencySymbol, bBefore, oRes) {
        //отдельно обрабатываем 'р.' и currencySymbol потому что они могут быть не односимвольными
        var aTemp = ["р.", currencySymbol];
        for (var i = 0, length = aTemp.length; i < length; i++){
            var sChar = aTemp[i];
            var nIndex = -1;
            var nCount = 0;
            while(-1 != (nIndex = sVal.indexOf(sChar, nIndex + 1)))
                nCount++;
            if(nCount > 0)
            {
                sVal = sVal.replace(new RegExp(escapeRegExp(sChar), "g"), "");
                var elem = oRes[sChar];
                if(!elem){
                    elem = {before: 0, after: 0, all: 0};
                    oRes[sChar] = elem;
                }
                if(bBefore)
                    elem.before += nCount;
                else
                    elem.after += nCount;
                elem.all += nCount;
            }
        }
		for(var i = 0, length = sVal.length; i < length; i++){
			var sChar = sVal[i];
			var elem = oRes[sChar];
			if(!elem){
				elem = {before: 0, after: 0, all: 0};
				oRes[sChar] = elem;
			}
			if(bBefore)
				elem.before++;
			else
				elem.after++;
			elem.all++;
		}
	},
    _parseThouthand: function (val, cultureInfo)
    {
        var oRes = null;
        var bThouthand = false;
        //reverse
        var sReverseVal = "";
        for (var i = val.length - 1; i >= 0; --i)
            sReverseVal += val[i];
        var nGroupSizeIndex = 0;
        var nGroupSize = cultureInfo.NumberGroupSizes[nGroupSizeIndex];
        var nPrevIndex = 0;
        var nIndex = -1;
        var bError = false;
        while (-1 != (nIndex = sReverseVal.indexOf(cultureInfo.NumberGroupSeparator, nIndex + 1))) {
            var nCurLength = nIndex - nPrevIndex;
            if (nCurLength < nGroupSize) {
                bError = true;
                break;
            }
            if (nGroupSizeIndex < cultureInfo.NumberGroupSizes.length - 1) {
                nGroupSizeIndex++;
                nGroupSize = cultureInfo.NumberGroupSizes[nGroupSizeIndex];
            }
            nPrevIndex = nIndex + 1;
        }
        if (!bError) {
            if (0 != nPrevIndex) {
                //чтобы не распознавалось 0,001
                if (nPrevIndex < val.length && parseInt(val.substr(0, val.length - nPrevIndex)) > 0) {
                    val = val.replace(new RegExp(escapeRegExp(cultureInfo.NumberGroupSeparator), "g"), '');
                    bThouthand = true;
                }
            }
			if (g_oFormatParser.isLocaleNumber(val, cultureInfo)) {
				var dNumber = g_oFormatParser.parseLocaleNumber(val, cultureInfo);
				oRes = { number: dNumber, thouthand: bThouthand };
			}
        }
		return oRes;
	},
    _parseDateFromArray: function (match, oDataTypes, cultureInfo)
	{
        var res = null;
        var bError = false;
        //в первый проход разделяем date и time с помощью delimiter
        for (var i = 0, length = match.length; i < length; i++) {
            var elem = match[i];
            if (elem.type == oDataTypes.delimiter) {
                bError = true;
                if(i - 1 >= 0 && i + 1 < length){
                    var prev = match[i - 1];
                    var next = match[i + 1];
                    if(prev.type != oDataTypes.delimiter && next.type != oDataTypes.delimite){
                        if (cultureInfo.TimeSeparator == elem.val || (":" == elem.val && cultureInfo.DateSeparator != elem.val)) {
                            if(false == prev.date && false == next.date){
                                bError = false;
                                prev.time = true;
                                next.time = true;
                            }
                        }
                        else{
                            if(false == prev.time && false == next.time){
                                bError = false;
                                prev.date = true;
                                next.date = true;
                            }
                        }
                    }
                }
                else if (i - 1 >= 0 && i + 1 == length) {
                    //случай "10:"
                    var prev = match[i - 1];
                    if (prev.type != oDataTypes.delimiter) {
                        if (cultureInfo.TimeSeparator == elem.val || (":" == elem.val && cultureInfo.DateSeparator != elem.val)) {
                            if (false == prev.date) {
                                bError = false;
                                prev.time = true;
                            }
                        }
                    }
                }
                if(bError)
                    break;
            }
        }
        if(!bError){
            //разделяем date и time с помощью Am/Pm и имена месяцев
            for (var i = 0, length = match.length; i < length; i++) {
                var elem = match[i];
                if (elem.type == oDataTypes.letter){
                    var valLower = elem.val.toLowerCase();
                    if (elem.am || elem.pm) {
                        if (i - 1 >= 0) {
                            var prev = match[i - 1];
                            if (oDataTypes.digit == prev.type && false == prev.date) {
                                prev.time = true;
                            }
                        }
                        //AmPm должна быть последней записью
                        if (i + 1 != length) {
                            bError = true;
                        }
                    }
                    else if (null != elem.month) {
                        if (i - 1 >= 0) {
                            var prev = match[i - 1];
                            if (oDataTypes.digit == prev.type && false == prev.time)
                                prev.date = true;
                        }
                        if (i + 1 < length) {
                            var next = match[i + 1];
                            if (oDataTypes.digit == next.type && false == next.time)
                                next.date = true;
                        }
                    }
                    else
                        bError = true;
                }
                if(bError)
                    break;
            }
        }
        if(!bError){
            var aDate = [];
            var nMonthIndex = null;
            var sMonthFormat = null;
            var aTime = [];
            var am = false;
            var pm = false;
            for (var i = 0, length = match.length; i < length; i++) {
                var elem = match[i];
                if (elem.date) {
                    if (elem.type == oDataTypes.digit)
                        aDate.push(elem.val);
                    else if (elem.type == oDataTypes.letter && null != elem.month) {
                        nMonthIndex = aDate.length;
                        sMonthFormat = elem.month.format;
                        aDate.push(elem.month.val);
                    }
                    else
                        bError = true;
                }
                else if (elem.time) {
                    if (elem.type == oDataTypes.digit)
                        aTime.push(elem.val);
                    else if (elem.type == oDataTypes.letter && (elem.am || elem.pm)) {
                        am = elem.am;
                        pm = elem.pm;
                    }
                    else
                        bError = true;
                }
                else if (oDataTypes.digit == elem.type)
                    bError = true;//случай "1-2-3 10"
            }
            var nDateLength = aDate.length;
            if (nDateLength > 0 && !(2 <= nDateLength && nDateLength <= 3 && (null == nMonthIndex || (3 == nDateLength && 1 == nMonthIndex) || 2 == nDateLength)))
                bError = true;
            var nTimeLength = aTime.length;
            if (nTimeLength > 3)
                bError = true;
            if(!bError){
                res = { d: null, m: null, y: null, h: null, min: null, s: null, am: am, pm: pm, sDateFormat: null };
                if (nDateLength > 0) {
                    var nIndexD = Math.max(cultureInfo.ShortDatePattern.indexOf("0"), cultureInfo.ShortDatePattern.indexOf("1"));
                    var nIndexM = Math.max(cultureInfo.ShortDatePattern.indexOf("2"), cultureInfo.ShortDatePattern.indexOf("3"));
                    var nIndexY = Math.max(cultureInfo.ShortDatePattern.indexOf("4"), cultureInfo.ShortDatePattern.indexOf("5"));
                    if (null != nMonthIndex) {
                        if (2 == nDateLength) {
                            res.d = aDate[nDateLength - 1 - nMonthIndex];
                            res.m = aDate[nMonthIndex];
                            //приоритет у формата d-mmm, но если он не подходит пробуем сделать mmm-yy
                            if (this.isValidDate((new Date()).getFullYear(), res.m - 1, res.d))
                                res.sDateFormat = "d-mmm";
                            else {
                                //не в классическом случае(!= dd/mm/yyyy) меняем местами d и m перед тем как пробовать y
                                if (!isDMY(cultureInfo) && this.isValidDate((new Date()).getFullYear(), res.d - 1, res.m)) {
                                    res.sDateFormat = "d-mmm";
                                    var temp = res.d;
                                    res.d = res.m;
                                    res.m = temp;
                                }
                                else {
                                    //если текстовый месяц стоит вторым, то первый параметр может быть только днем
                                    if (0 == nMonthIndex) {
                                        res.sDateFormat = "mmm-yy";
                                        res.d = null;
                                        res.m = aDate[0];
                                        res.y = aDate[1];
                                    }
                                    else
                                        bError = true;
                                }
                            }
                        }
                        else {
                            res.sDateFormat = "d-mmm-yy";
                            res.d = aDate[0];
                            res.m = aDate[1];
                            res.y = aDate[2];
                        }
                    }
                    else {
                        //смотрим порядок в default формат
                        if (2 == nDateLength) {
                            //в приоритете d и m
                            if (nIndexD < nIndexM) {
                                res.d = aDate[0];
                                res.m = aDate[1];
                            }
                            else {
                                res.m = aDate[0];
                                res.d = aDate[1];
                            }
                            if (this.isValidDate((new Date()).getFullYear(), res.m - 1, res.d))
                                res.sDateFormat = "d-mmm";
                            else{
                                //в обратной записи(== yyyy/mm/dd) меняем местами d и m перед тем как пробовать y
                                if (isYMD(cultureInfo) && this.isValidDate((new Date()).getFullYear(), res.d - 1, res.m)) {
                                    res.sDateFormat = "d-mmm";
                                    var temp = res.d;
                                    res.d = res.m;
                                    res.m = temp;
                                }
                                else{
                                    res.sDateFormat = "mmm-yy";
                                    res.d = null;
                                    if (nIndexM < nIndexY) {
                                        res.m = aDate[0];
                                        res.y = aDate[1];
                                    }
                                    else {
                                        res.y = aDate[0];
                                        res.m = aDate[1];
                                    }
                                }
                            }
                        }
                        else {
                            for (var i = 0, length = cultureInfo.ShortDatePattern.length; i < length; i++)
                            {
                                var nIndex = cultureInfo.ShortDatePattern[i] - 0;
                                var val = aDate[i];
                                if (0 == nIndex || 1 == nIndex) {
                                    res.d = val;
                                } else if (2 == nIndex || 3 == nIndex) {
                                    res.m = val;
                                } else if (4 == nIndex || 5 == nIndex) {
                                    res.y = val;
                                }
                            }
                            res.sDateFormat = getShortDateFormat(cultureInfo);
                        }
                    }
                    if(null != res.y)
                    {
                        if(res.y < 30)
                            res.y = 2000 + res.y;
                        else if(res.y < 100)
                            res.y = 1900 + res.y;
                    }
                }
                if(nTimeLength > 0){
                    res.h = aTime[0];
                    if(nTimeLength > 1)
                        res.min = aTime[1];
                    if(nTimeLength > 2)
                        res.s = aTime[2];
                }
                if(bError)
                    res = null;
            }
        }
		return res;
    },
    strcmp: function (s1, s2, index1, length, index2) {
        if (null == index2)
            index2 = 0;
        var bRes = true;
        for (var i = 0; i < length; ++i) {
            if (s1[index1 + i] != s2[index2 + i]) {
                bRes = false;
                break;
            }
        }
        return bRes;
    },
	parseDate: function (value, cultureInfo)
	{
		var res = null;
		var match = [];
		var sCurValue = null;
		var oCurDataType = null;
		var oPrevType = null;
		var bAmPm = false;
		var bMonth = false;
		var bError = false;
		var oDataTypes = {letter: {id: 0, min: 2, max: 9}, digit: {id: 1, min: 1, max: 4}, delimiter: {id: 2, min: 1, max: 1}, space: {id: 3, min: null, max: null}};
		var valueLower = value.toLowerCase();
		for(var i = 0, length = value.length; i < length; i++)
		{
		    var sChar = value[i];
		    var oDataType = null;
		    if("0" <= sChar && sChar <= "9")
		        oDataType = oDataTypes.digit;
		    else if(" " == sChar)
		        oDataType = oDataTypes.space;
		    else if ("/" == sChar || "-" == sChar || ":" == sChar || cultureInfo.DateSeparator == sChar || cultureInfo.TimeSeparator == sChar)
		        oDataType = oDataTypes.delimiter;
		    else
		        oDataType = oDataTypes.letter;
			    
		    if(null != oDataType)
		    {
		        if(null == oCurDataType)
		            sCurValue = sChar;
		        else
		        {
		            if(oCurDataType == oDataType)
		            {
		                if(null == oCurDataType.max || sCurValue.length < oCurDataType.max)
		                    sCurValue += sChar;
		                else
		                    bError = true;
		            }
		            else
		            {
		                if (null == oCurDataType.min || sCurValue.length >= oCurDataType.min) {
		                    if (oDataTypes.space != oCurDataType) {
		                        var oNewElem = { val: sCurValue, type: oCurDataType, month: null, am: false, pm: false, date: false, time: false };
		                        if (oDataTypes.digit == oCurDataType)
		                            oNewElem.val = oNewElem.val - 0;
		                        match.push(oNewElem);
		                    }
		                    sCurValue = sChar;
		                    oPrevType = oCurDataType;
		                }
		                else
		                    bError = true;
		            }
		        }
		        oCurDataType = oDataType;
		    }
		    else
		        bError = true;
		    if(oDataTypes.letter == oDataType){
		        var oNewElem = { val: sCurValue, type: oCurDataType, month: null, am: false, pm: false, date: false, time: false };
		        var bAm = false;
		        var bPm = false;
		        if (!bAmPm && ((bAm = this.strcmp(valueLower, "am", i, 2)) || (bPm = this.strcmp(valueLower, "pm", i, 2)))) {
		            bAmPm = true;
		            oNewElem.am = bAm;
		            oNewElem.pm = bPm;
		            oNewElem.time = true;
		            match.push(oNewElem);
		            i += 2 - 1;
		            if (oPrevType != oDataTypes.space)
		                bError = true;
		        }
		        else if (!bMonth) {
		            bMonth = true;
		            var aArraysToCheck = [{ arr: cultureInfo.AbbreviatedMonthNames, format: "mmm" }, { arr: cultureInfo.MonthNames, format: "mmmm" }];
		            var bFound = false;
		            for (var index in aArraysToCheck) {
		                var aArrayTemp = aArraysToCheck[index];
		                for (var j = 0, length2 = aArrayTemp.arr.length; j < length2; j++) {
		                    var sCmpVal = aArrayTemp.arr[j].toLowerCase();
		                    var sCmpValCrop = sCmpVal.replace(/\./g, "");
		                    var bCrop = false;
		                    if (this.strcmp(valueLower, sCmpVal, i, sCmpVal.length) || (bCrop = (sCmpVal != sCmpValCrop && this.strcmp(valueLower, sCmpValCrop, i, sCmpValCrop.length)))) {
		                        bFound = true;
		                        oNewElem.month = { val: j + 1, format: aArrayTemp.format };
		                        oNewElem.date = true;
		                        if (bCrop)
		                            i += sCmpValCrop.length - 1;
		                        else
		                            i += sCmpVal.length - 1;
		                        break;
		                    }
		                }
		                if (bFound)
		                    break;
		            }
		            //ничего кроме имени месяца больше быть не может
		            if (bFound)
		                match.push(oNewElem);
		            else
		                bError = true;
		        }
		        else
		            bError = true;
		        oCurDataType = null;
		        sCurValue = null;
		    }
			if (bError)
			{
				match = null;
				break;
			}
		}
		if (null != match && null != sCurValue) {
		    if (oDataTypes.space != oCurDataType) {
		        var oNewElem = { val: sCurValue, type: oCurDataType, month: null, am: false, pm: false, date: false, time: false };
		        if (oDataTypes.digit == oCurDataType)
		            oNewElem.val = oNewElem.val - 0;
		        match.push(oNewElem);
		    }
		}
		if(null != match && match.length > 0)
		{
		    var oParsedDate = this._parseDateFromArray(match, oDataTypes, cultureInfo);
			if(null != oParsedDate)
			{
				var d = oParsedDate.d;
				var m = oParsedDate.m;
				var y = oParsedDate.y;
				var h = oParsedDate.h;
				var min = oParsedDate.min;
				var s = oParsedDate.s;
				var am = oParsedDate.am;
				var pm = oParsedDate.pm;
				var sDateFormat = oParsedDate.sDateFormat;
				
				var bDate = false;
				var bTime = false;
				var nDay;
				var nMounth;
				var nYear;
				if(AscCommon.bDate1904)
				{
					nDay = 1;
					nMounth = 0;
					nYear = 1904;
				}
				else
				{
					nDay = 31;
					nMounth = 11;
					nYear = 1899;
				}
				var nHour = 0;
				var nMinute = 0;
				var nSecond = 0;
				var dValue = 0;
				var bValidDate = true;
				if(null != m && (null != d || null != y))
				{
					bDate = true;
					var oNowDate;
					if(null != d)
						nDay = d - 0;
					else
						nDay = 1;
					nMounth = m - 1;
					if(null != y)
						nYear = y - 0;
					else
                    {
                        oNowDate = new Date();
						nYear = oNowDate.getFullYear();
                    }
					
					//проверяем дату на валидность
					bValidDate = this.isValidDate(nYear, nMounth, nDay);
				}
				if(null != h)
				{
					bTime = true;
					nHour = h - 0;
					if (am || pm)
					{
						if(nHour <= 23)
						{
							//переводим 24
							nHour = nHour % 12;
							if(pm)
								nHour += 12;
						}
						else
							bValidDate = false;
					}
					if(null != min)
					{
						nMinute = min - 0;
						if(nMinute > 59)
							bValidDate = false;
					}
					if(null != s)
					{
						nSecond = s - 0;
						if(nSecond > 59)
							bValidDate = false;
					}
				}
				if(true == bValidDate && (true == bDate || true == bTime))
				{
					if(AscCommon.bDate1904)
						dValue = (Date.UTC(nYear,nMounth,nDay,nHour,nMinute,nSecond) - Date.UTC(1904,0,1,0,0,0)) / (86400 * 1000);
					else
					{
						if(1900 < nYear || (1900 == nYear && 1 < nMounth ))
							dValue = (Date.UTC(nYear,nMounth,nDay,nHour,nMinute,nSecond) - Date.UTC(1899,11,30,0,0,0)) / (86400 * 1000);
						else if(1900 == nYear && 1 == nMounth && 29 == nDay)
							dValue = 60;
						else
							dValue = (Date.UTC(nYear,nMounth,nDay,nHour,nMinute,nSecond) - Date.UTC(1899,11,31,0,0,0)) / (86400 * 1000);
					}
					if(dValue >= 0)
					{
						var sFormat;
						if(true == bDate && true == bTime)
						{
							sFormat = sDateFormat + " h:mm:ss";
							if (am || pm)
								sFormat += " AM/PM";
						}
						else if(true == bDate)
							sFormat = sDateFormat;
						else
						{
							if(dValue > 1)
								sFormat = "[h]:mm:ss";
							else if (am || pm)
								sFormat = "h:mm:ss AM/PM";
							else
								sFormat = "h:mm:ss";
						}
						res = {format: sFormat, value: dValue, bDateTime: true, bDate: bDate, bTime: bTime, bPercent: false, bCurrency: false};
					}
				}
            }
        }
		return res;
	},
	isValidDate : function(nYear, nMounth, nDay)
	{
		if(nYear < 1900 && !(1899 === nYear && 11 == nMounth && 31 == nDay))
			return false;
		else
		{
			if(nMounth < 0 || nMounth > 11)
				return false;
			else if(this.isValidDay(nYear, nMounth, nDay))
				return true;
			else if(1900 == nYear && 1 == nMounth && 29 == nDay)
				return true;
		}
		return false;
	},
	isValidDay : function(nYear, nMounth, nDay){
		if(this.isLeapYear(nYear))
		{
			if(nDay <= 0 || nDay > this.daysLeap[nMounth])
				return false;
		}
		else
		{
			if(nDay <= 0 || nDay > this.days[nMounth])
				return false;
		}
		return true;
	},
	isLeapYear : function(year)
	{
		return (0 == (year % 4)) && (0 != (year % 100) || 0 == (year % 400))
	}
};
var g_oFormatParser = new FormatParser();
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function setCurrentCultureInfo(val) {
    if (AscCommon.g_oDefaultCultureInfo === g_aCultureInfos[val]) {
        return false;
    }
    AscCommon.g_oDefaultCultureInfo = g_oDefaultCultureInfo = g_aCultureInfos[val];
    return true;
}

	function isDMY(cultureInfo) {
		//day month year
		var res = true;
		for (var i = 0; i < cultureInfo.ShortDatePattern.length - 1; ++i) {
			if (cultureInfo.ShortDatePattern.charCodeAt(i) > cultureInfo.ShortDatePattern.charCodeAt(i + 1)) {
				return false;
			}
		}
		return true;
	}
	function isYMD(cultureInfo) {
		//year month day
		var res = true;
		for (var i = 0; i < cultureInfo.ShortDatePattern.length - 1; ++i) {
			if (cultureInfo.ShortDatePattern.charCodeAt(i) < cultureInfo.ShortDatePattern.charCodeAt(i + 1)) {
				return false;
			}
		}
		return true;
	}
	function getShortDateMonthFormat(bDate, bYear, opt_cultureInfo) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var separator;
		if ('/' == AscCommon.g_oDefaultCultureInfo.DateSeparator) {
			separator = '-';
		} else {
			separator = '/';
		}
		var sRes = '';
		if (bDate) {
			if (-1 != cultureInfo.ShortDatePattern.indexOf('1')) {
				sRes += 'dd';
			} else {
				sRes += 'd';
			}
			sRes += separator;
		}
		sRes += 'mmm';
		if (bYear) {
			sRes += separator;
			sRes += 'yy';
		}
		return sRes;
	}
	function getShortDateFormat(opt_cultureInfo) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var dateElems = [];
		for (var i = 0; i < cultureInfo.ShortDatePattern.length; ++i) {
			switch (cultureInfo.ShortDatePattern[i]) {
				case '0':
					dateElems.push('d');
					break;
				case '1':
					dateElems.push('dd');
					break;
				case '2':
					dateElems.push('m');
					break;
				case '3':
					dateElems.push('mm');
					break;
				case '4':
					dateElems.push('yy');
					break;
				case '5':
					dateElems.push('yyyy');
					break;
			}
		}
		return dateElems.join('/');
	}

	function getShortDateFormat2(day, month, year, opt_cultureInfo) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var dateElems = [];
		for (var i = 0; i < cultureInfo.ShortDatePattern.length; ++i) {
			switch (cultureInfo.ShortDatePattern[i]) {
				case '0':
				case '1':
					if (day > 0) {
						dateElems.push('d'.repeat(day));
					}
					break;
				case '2':
				case '3':
					if (month > 0) {
						dateElems.push('m'.repeat(month));
					}
					break;
				case '4':
				case '5':
					if (year > 0) {
						dateElems.push('y'.repeat(month));
					}
					break;
			}
		}
		return dateElems.join('/');
	}

	function getNumberFormatSimple(opt_separate, opt_fraction) {
		var numberFormat = opt_separate ? '#,##0' : '0';
		if (opt_fraction > 0) {
			numberFormat += '.' + '0'.repeat(opt_fraction);
		}
		return numberFormat;
	}

	function getNumberFormat(opt_cultureInfo, opt_separate, opt_fraction, opt_red) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var numberFormat = getNumberFormatSimple(opt_separate, opt_fraction);
		var red = opt_red ? '[Red]' : '';

		var positiveFormat;
		var negativeFormat;
		switch (cultureInfo.CurrencyNegativePattern) {
			case 0:
			case 4:
			case 14:
			case 15:
				positiveFormat = numberFormat + '_)';
				negativeFormat = '\\(' + numberFormat + '\\)';
				break;
			default:
				positiveFormat = numberFormat + '_ ';
				negativeFormat = '\\-' + numberFormat + '\\ ';
				break;
		}
		return positiveFormat + ';' + red + negativeFormat;
	}

	function getLocaleFormat(opt_cultureInfo, opt_currency) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var symbol = opt_currency ? cultureInfo.CurrencySymbol : '';
		return '[$' + symbol + '-' + cultureInfo.LCID.toString(16).toUpperCase() + ']';
	}

	function getCurrencyFormatSimple(opt_cultureInfo, opt_fraction, opt_currency, opt_currencyLocale, opt_red) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var numberFormat = getNumberFormatSimple(true, opt_fraction);
		var signCurrencyFormat;
		var signCurrencyFormatEnd;
		var signCurrencyFormatSpace;
		if (opt_currency) {
			if (opt_currencyLocale) {
				signCurrencyFormat = getLocaleFormat(cultureInfo, true);
			} else {
				signCurrencyFormat = '"' + cultureInfo.CurrencySymbol + '"';
			}
			signCurrencyFormatEnd = signCurrencyFormat;
			signCurrencyFormatSpace = signCurrencyFormat + '\\ ';
		} else {
			signCurrencyFormatEnd = signCurrencyFormat = signCurrencyFormatSpace = '';
			for (var i = 0; i < cultureInfo.CurrencySymbol.length; ++i) {
				signCurrencyFormatEnd += '_' + cultureInfo.CurrencySymbol[i];
			}
		}
		var red = opt_red ? '[Red]' : '';

		var prefixs = ['_ ', '_-', '_(', '_)'];
		var postfix = '';
		var positiveFormat;
		var negativeFormat;
		switch (cultureInfo.CurrencyNegativePattern) {
			case 0:
				postfix = prefixs[3];
				negativeFormat = '\\(' + signCurrencyFormat + numberFormat + '\\)';
				break;
			case 1:
				negativeFormat = '\\-' + signCurrencyFormat + numberFormat;
				break;
			case 2:
				negativeFormat = signCurrencyFormatSpace + '\\-' + numberFormat;
				break;
			case 3:
				postfix = prefixs[1];
				negativeFormat = signCurrencyFormatSpace + numberFormat + '\\-';
				break;
			case 4:
				postfix = prefixs[3];
				negativeFormat = '\\(' + numberFormat + signCurrencyFormatEnd + '\\)';
				break;
			case 5:
				negativeFormat = '\\-' + numberFormat + signCurrencyFormatEnd;
				break;
			case 6:
				negativeFormat = numberFormat + '\\-' + signCurrencyFormatEnd;
				break;
			case 7:
				postfix = prefixs[1];
				negativeFormat = numberFormat + signCurrencyFormatEnd + '\\-';
				break;
			case 8:
				negativeFormat = '\\-' + numberFormat + '\\ ' + signCurrencyFormatEnd;
				break;
			case 9:
				negativeFormat = '\\-' + signCurrencyFormatSpace + numberFormat;
				break;
			case 10:
				postfix = prefixs[1];
				negativeFormat = numberFormat + '\\ ' + signCurrencyFormatEnd + '\\-';
				break;
			case 11:
				postfix = prefixs[1];
				negativeFormat = signCurrencyFormatSpace + numberFormat + '\\-';
				break;
			case 12:
				negativeFormat = signCurrencyFormatSpace + '\\-' + numberFormat;
				break;
			case 13:
				negativeFormat = numberFormat + '\\-\\ ' + signCurrencyFormatEnd;
				break;
			case 14:
				postfix = prefixs[3];
				negativeFormat = '(' + signCurrencyFormat + numberFormat + '\\)';
				break;
			case 15:
				postfix = prefixs[3];
				negativeFormat = '\\(' + numberFormat + signCurrencyFormatEnd + '\\)';
				break;
		}
		switch (cultureInfo.CurrencyPositivePattern) {
			case 0:
				positiveFormat = signCurrencyFormat + numberFormat;
				break;
			case 1:
				positiveFormat = numberFormat + signCurrencyFormatEnd;
				break;
			case 2:
				positiveFormat = signCurrencyFormatSpace + numberFormat;
				break;
			case 3:
				positiveFormat = numberFormat + '\\ ' + signCurrencyFormatEnd;
				break;
		}
		positiveFormat = positiveFormat + postfix;
		return positiveFormat + ';' + red + negativeFormat;
	}

	function getCurrencyFormatSimple2(opt_cultureInfo, opt_fraction, opt_currency, opt_negative) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var numberFormat = getNumberFormatSimple(true, opt_fraction);
		var signCurrencyFormat;
		var signCurrencyFormatEnd;
		var signCurrencyFormatSpace;
		if (opt_currency) {
			signCurrencyFormat = signCurrencyFormatEnd = getLocaleFormat(cultureInfo, true);
			signCurrencyFormatSpace = signCurrencyFormat + '\\ ';
		} else {
			signCurrencyFormatEnd = signCurrencyFormat = signCurrencyFormatSpace = '';
			for (var i = 0; i < cultureInfo.CurrencySymbol.length; ++i) {
				signCurrencyFormatEnd += '_' + cultureInfo.CurrencySymbol[i];
			}
		}
		var positiveFormat;
		switch (cultureInfo.CurrencyNegativePattern) {
			case 0:
			case 1:
			case 14:
				positiveFormat = signCurrencyFormat + numberFormat;
				break;
			case 2:
			case 3:
			case 9:
			case 10:
			case 11:
			case 12:
				positiveFormat = signCurrencyFormatSpace + numberFormat;
				break;
			case 4:
			case 5:
			case 6:
			case 7:
			case 15:
				positiveFormat = numberFormat + signCurrencyFormatEnd;
				break;
			case 8:
			case 13:
				positiveFormat = numberFormat + '\\ ' + signCurrencyFormatEnd;
				break;
		}
		return opt_negative ? positiveFormat + ';[Red]' + positiveFormat : positiveFormat;
	}

	function getCurrencyFormat(opt_cultureInfo, opt_fraction, opt_currency, opt_currencyLocale) {
		var cultureInfo = opt_cultureInfo ? opt_cultureInfo : AscCommon.g_oDefaultCultureInfo;
		var numberFormat = getNumberFormatSimple(true, opt_fraction);
		var nullSignFormat = '* "-"';
		if (opt_fraction) {
			nullSignFormat += '?'.repeat(opt_fraction);
		}
		var signCurrencyFormat;
		var signCurrencyFormatEnd;
		var signCurrencyFormatSpace;
		if (opt_currency) {
			if (opt_currencyLocale) {
				signCurrencyFormat = getLocaleFormat(cultureInfo, true);
			} else {
				signCurrencyFormat = '"' + cultureInfo.CurrencySymbol + '"';
			}
			signCurrencyFormatEnd = signCurrencyFormat;
			signCurrencyFormatSpace = signCurrencyFormat + '\\ ';
		} else {
			signCurrencyFormatEnd = signCurrencyFormat = signCurrencyFormatSpace = '';
			for (var i = 0; i < cultureInfo.CurrencySymbol.length; ++i) {
				signCurrencyFormatEnd += '_' + cultureInfo.CurrencySymbol[i];
			}
		}

		var prefixs = ['_ ', '_-', '_(', '_)'];
		var prefix = prefixs[0];
		var postfix = prefixs[0];
		var positiveNumberFormat = '* ' + numberFormat;
		var positiveFormat;
		var negativeFormat;
		var nullFormat;
		switch (cultureInfo.CurrencyNegativePattern) {
			case 0:
				prefix = prefixs[2];
				postfix = prefixs[3];
				negativeFormat = prefix + signCurrencyFormat + '* \\(' + numberFormat + '\\)';
				break;
			case 1:
				prefix = postfix = prefixs[1];
				negativeFormat = '\\-' + signCurrencyFormat + '* ' + numberFormat + postfix;
				break;
			case 2:
				negativeFormat = prefix + signCurrencyFormatSpace + '* \\-' + numberFormat + postfix;
				break;
			case 3:
				prefix = postfix = prefixs[1];
				negativeFormat = prefix + signCurrencyFormatSpace + '* ' + numberFormat + '\\-';
				break;
			case 4:
				prefix = prefixs[2];
				postfix = prefixs[3];
				negativeFormat = prefix + '* \\(' + numberFormat + '\\)' + signCurrencyFormatEnd + postfix;
				break;
			case 5:
				prefix = postfix = prefixs[1];
				negativeFormat = '\\-* ' + numberFormat + signCurrencyFormatEnd + postfix;
				break;
			case 6:
				negativeFormat = prefix + '* ' + numberFormat + '\\-' + signCurrencyFormatEnd + postfix;
				break;
			case 7:
				negativeFormat = prefix + '* ' + numberFormat + signCurrencyFormatEnd + '\\-';
				break;
			case 8:
				prefix = postfix = prefixs[1];
				negativeFormat = '\\-* ' + numberFormat + '\\ ' + signCurrencyFormatEnd + postfix;
				break;
			case 9:
				prefix = postfix = prefixs[1];
				negativeFormat = '\\-' + signCurrencyFormatSpace + '* ' + numberFormat + postfix;
				break;
			case 10:
				negativeFormat = prefix + '* ' + numberFormat + '\\ ' + signCurrencyFormatEnd + '\\-';
				break;
			case 11:
				negativeFormat = prefix + signCurrencyFormatSpace + '* ' + numberFormat + '\\-';
				break;
			case 12:
				negativeFormat = prefix + signCurrencyFormatSpace + '* \\-' + numberFormat + postfix;
				break;
			case 13:
				negativeFormat = prefix + '* ' + numberFormat + '\\-\\ ' + signCurrencyFormatEnd + postfix;
				break;
			case 14:
				prefix = prefixs[2];
				postfix = prefixs[3];
				negativeFormat = prefix + signCurrencyFormatSpace + '* \\(' + numberFormat + '\\)';
				break;
			case 15:
				prefix = prefixs[2];
				postfix = prefixs[3];
				negativeFormat = prefix + '* \\(' + numberFormat + '\\)\\ ' + signCurrencyFormatEnd + postfix;
				break;
		}
		switch (cultureInfo.CurrencyPositivePattern) {
			case 0:
				positiveFormat = signCurrencyFormat + positiveNumberFormat;
				nullFormat = signCurrencyFormat + nullSignFormat;
				break;
			case 1:
				positiveFormat = positiveNumberFormat + signCurrencyFormatEnd;
				nullFormat = nullSignFormat + signCurrencyFormatEnd;
				break;
			case 2:
				positiveFormat = signCurrencyFormatSpace + positiveNumberFormat;
				nullFormat = signCurrencyFormatSpace + nullSignFormat;
				break;
			case 3:
				positiveFormat = positiveNumberFormat + '\\ ' + signCurrencyFormatEnd;
				nullFormat = nullSignFormat + '\\ ' + signCurrencyFormatEnd;
				break;
		}
		positiveFormat = prefix + positiveFormat + postfix;
		nullFormat = prefix + nullFormat + postfix;
		var textFormat = prefix + '@' + postfix;
		return positiveFormat + ';' + negativeFormat + ';' + nullFormat + ';' + textFormat;
	}

	function getFormatCells(info) {
		var res = [];
		if (info) {
			var format;
			var i;
			var cultureInfo = g_aCultureInfos[info.symbol];
			var currency = !!cultureInfo;
			if (Asc.c_oAscNumFormatType.General === info.type) {
				res.push(AscCommon.g_cGeneralFormat);
			} else if (Asc.c_oAscNumFormatType.Number === info.type) {
				var numberFormat = getNumberFormatSimple(info.separator, info.decimalPlaces);
				res.push(numberFormat);
				res.push(numberFormat + ';[Red]' + numberFormat);
				res.push(getNumberFormat(cultureInfo, info.separator, info.decimalPlaces, false));
				res.push(getNumberFormat(cultureInfo, info.separator, info.decimalPlaces, true));
			} else if (Asc.c_oAscNumFormatType.Currency === info.type) {
				res.push(getCurrencyFormatSimple2(cultureInfo, info.decimalPlaces, currency, false));
				res.push(getCurrencyFormatSimple2(cultureInfo, info.decimalPlaces, currency, true));
				res.push(getCurrencyFormatSimple(cultureInfo, info.decimalPlaces, currency, currency, false));
				res.push(getCurrencyFormatSimple(cultureInfo, info.decimalPlaces, currency, currency, true));
			} else if (Asc.c_oAscNumFormatType.Accounting === info.type) {
				res.push(getCurrencyFormat(cultureInfo, info.decimalPlaces, currency, currency));
			} else if (Asc.c_oAscNumFormatType.Date === info.type) {
				//todo locale dependence
				if (info.symbol == g_oDefaultCultureInfo.LCID) {
					res.push(getShortDateFormat(cultureInfo));
					res.push('[$-F800]dddd, mmmm dd, yyyy');
				}
				res.push(getShortDateFormat2(1, 1, 0, cultureInfo) + ';@');
				res.push(getShortDateFormat2(1, 1, 2, cultureInfo) + ';@');
				res.push(getShortDateFormat2(2, 2, 2, cultureInfo) + ';@');
				res.push(getShortDateFormat2(1, 1, 4, cultureInfo) + ';@');
				res.push(getShortDateFormat2(1, 1, 2, cultureInfo) + ' h:mm;@');
				res.push('[$-409]' + getShortDateFormat2(1, 1, 2, cultureInfo) + ' h:mm AM/PM;@');
				var locale = getLocaleFormat(cultureInfo, false);
				res.push(locale + 'mmmmm;@');
				res.push(locale + 'mmmm d, yyyy;@');
				var separators = ['-', '/', ' '];
				for (i = 0; i < separators.length; ++i) {
					var separator = separators[i];
					res.push(locale + 'd' + separator + 'mmm;@');
					res.push(locale + 'd' + separator + 'mmm' + separator + 'yy;@');
					res.push(locale + 'dd' + separator + 'mmm' + separator + 'yy;@');
					res.push(locale + 'mmm' + separator + 'yy;@');
					res.push(locale + 'mmmm' + separator + 'yy;@');
					res.push(locale + 'mmmmm' + separator + 'yy;@');
					res.push(locale + 'd' + separator + 'mmm' + separator + 'yyyy;@');
				}
			} else if (Asc.c_oAscNumFormatType.Time === info.type) {
				res = gc_aTimeFormats;
			} else if (Asc.c_oAscNumFormatType.Percent === info.type) {
				format = '0';
				if (info.decimalPlaces > 0) {
					format += '.' + '0'.repeat(info.decimalPlaces);
				}
				format += '%';
				res.push(format);
			} else if (Asc.c_oAscNumFormatType.Fraction === info.type) {
				res = gc_aFractionFormats;
			} else if (Asc.c_oAscNumFormatType.Scientific === info.type) {
				format = '0.' + '0'.repeat(info.decimalPlaces) + 'E+00';
				res.push(format);
			} else if (Asc.c_oAscNumFormatType.Text === info.type) {
				res.push('@');
			} else if (Asc.c_oAscNumFormatType.Custom === info.type) {
				for (i = 0; i <= 4; ++i) {
					res.push(AscCommonExcel.aStandartNumFormats[i]);
				}
				res.push(getCurrencyFormatSimple(null, 0, false, false, false));
				res.push(getCurrencyFormatSimple(null, 0, false, false, true));
				res.push(getCurrencyFormatSimple(null, 2, false, false, false));
				res.push(getCurrencyFormatSimple(null, 2, false, false, true));
				res.push(getCurrencyFormatSimple(null, 0, true, false, false));
				res.push(getCurrencyFormatSimple(null, 0, true, false, true));
				res.push(getCurrencyFormatSimple(null, 2, true, false, false));
				res.push(getCurrencyFormatSimple(null, 2, true, false, true));
				for (i = 9; i <= 13; ++i) {
					res.push(AscCommonExcel.aStandartNumFormats[i]);
				}
				res.push(getShortDateFormat(null));
				res.push(getShortDateMonthFormat(true, true, null));
				res.push(getShortDateMonthFormat(true, false, null));
				res.push(getShortDateMonthFormat(false, true, null));
				for (i = 18; i <= 21; ++i) {
					res.push(AscCommonExcel.aStandartNumFormats[i]);
				}
				res.push(getShortDateFormat(null) + " h:mm");
				for (i = 45; i <= 49; ++i) {
					res.push(AscCommonExcel.aStandartNumFormats[i]);
				}
				//todo add all used in workbook formats
			} else {
				res.push(AscCommon.g_cGeneralFormat);
				res.push('0.00');
				res.push('0.00E+00');
				res.push(getCurrencyFormat(cultureInfo, 2, currency, true));
				res.push(getCurrencyFormatSimple2(cultureInfo, 2, currency, false));
				res.push(getShortDateFormat(cultureInfo));
				//todo F400
				res.push('[$-F400]h:mm:ss AM/PM');
				res.push('0.00%');
				res.push('# ?/?');
				res.push('@');
			}
		}
		return res;
	}

var g_aCultureInfos = {
	1: {LCID: 1, Name: "ar", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ر.س.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة", ""], AbbreviatedMonthNames: ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	2: {LCID: 2, Name: "bg", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "лв.", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"], AbbreviatedDayNames: ["нед", "пон", "вт", "ср", "четв", "пет", "съб"], MonthNames: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември", ""], AbbreviatedMonthNames: ["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	3: {LCID: 3, Name: "ca", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], AbbreviatedDayNames: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."], MonthNames: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre", ""], AbbreviatedMonthNames: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des.", ""], MonthGenitiveNames: ["de gener", "de febrer", "de març", "d’abril", "de maig", "de juny", "de juliol", "d’agost", "de setembre", "d’octubre", "de novembre", "de desembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	4: {LCID: 4, Name: "zh-Hans", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	5: {LCID: 5, Name: "cs", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Kč", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"], AbbreviatedDayNames: ["ne", "po", "út", "st", "čt", "pá", "so"], MonthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec", ""], AbbreviatedMonthNames: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro", ""], MonthGenitiveNames: ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "dop.", PMDesignator: "odp.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	6: {LCID: 6, Name: "da", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"], AbbreviatedDayNames: ["sø", "ma", "ti", "on", "to", "fr", "lø"], MonthNames: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	7: {LCID: 7, Name: "de", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], MonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	8: {LCID: 8, Name: "el", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], AbbreviatedDayNames: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"], MonthNames: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος", ""], AbbreviatedMonthNames: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ", ""], MonthGenitiveNames: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου", "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "πμ", PMDesignator: "μμ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	9: {LCID: 9, Name: "en", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	10: {LCID: 10, Name: "es", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["do.", "lu.", "ma.", "mi.", "ju.", "vi.", "sá."], MonthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	11: {LCID: 11, Name: "fi", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sunnuntaina", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"], AbbreviatedDayNames: ["su", "ma", "ti", "ke", "to", "pe", "la"], MonthNames: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu", ""], AbbreviatedMonthNames: ["tammi", "helmi", "maalis", "huhti", "touko", "kesä", "heinä", "elo", "syys", "loka", "marras", "joulu", ""], MonthGenitiveNames: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta", ""], AbbreviatedMonthGenitiveNames: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta", ""], AMDesignator: "ap.", PMDesignator: "ip.", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	12: {LCID: 12, Name: "fr", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	13: {LCID: 13, Name: "he", CurrencyPositivePattern: 2, CurrencyNegativePattern: 2, CurrencySymbol: "₪", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"], AbbreviatedDayNames: ["יום א", "יום ב", "יום ג", "יום ד", "יום ה", "יום ו", "שבת"], MonthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר", ""], AbbreviatedMonthNames: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	14: {LCID: 14, Name: "hu", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "HUF", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"], AbbreviatedDayNames: ["V", "H", "K", "Sze", "Cs", "P", "Szo"], MonthNames: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december", ""], AbbreviatedMonthNames: ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "de.", PMDesignator: "du.", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "531"},
	15: {LCID: 15, Name: "is", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ISK", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sunnudagur", "mánudagur", "þriðjudagur", "miðvikudagur", "fimmtudagur", "föstudagur", "laugardagur"], AbbreviatedDayNames: ["sun.", "mán.", "þri.", "mið.", "fim.", "fös.", "lau."], MonthNames: ["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember", ""], AbbreviatedMonthNames: ["jan.", "feb.", "mar.", "apr.", "maí", "jún.", "júl.", "ágú.", "sep.", "okt.", "nóv.", "des.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "f.h.", PMDesignator: "e.h.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	16: {LCID: 16, Name: "it", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"], AbbreviatedDayNames: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], MonthNames: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre", ""], AbbreviatedMonthNames: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	17: {LCID: 17, Name: "ja", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], AbbreviatedDayNames: ["日", "月", "火", "水", "木", "金", "土"], MonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""], AbbreviatedMonthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "午前", PMDesignator: "午後", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	18: {LCID: 18, Name: "ko", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₩", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], AbbreviatedDayNames: ["일", "월", "화", "수", "목", "금", "토"], MonthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", ""], AbbreviatedMonthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "오전", PMDesignator: "오후", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	19: {LCID: 19, Name: "nl", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"], AbbreviatedDayNames: ["zo", "ma", "di", "wo", "do", "vr", "za"], MonthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "025"},
	20: {LCID: 20, Name: "no", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"], AbbreviatedDayNames: ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."], MonthNames: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mar.", "apr.", "mai", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "135"},
	21: {LCID: 21, Name: "pl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "zł", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"], AbbreviatedDayNames: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."], MonthNames: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień", ""], AbbreviatedMonthNames: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru", ""], MonthGenitiveNames: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	22: {LCID: 22, Name: "pt", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "R$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"], AbbreviatedDayNames: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"], MonthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", ""], AbbreviatedMonthNames: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	23: {LCID: 23, Name: "rm", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: "’", NumberGroupSizes: [3], DayNames: ["dumengia", "glindesdi", "mardi", "mesemna", "gievgia", "venderdi", "sonda"], AbbreviatedDayNames: ["du", "gli", "ma", "me", "gie", "ve", "so"], MonthNames: ["schaner", "favrer", "mars", "avrigl", "matg", "zercladur", "fanadur", "avust", "settember", "october", "november", "december", ""], AbbreviatedMonthNames: ["schan.", "favr.", "mars", "avr.", "matg", "zercl.", "fan.", "avust", "sett.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "am", PMDesignator: "sm", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	24: {LCID: 24, Name: "ro", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "RON", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"], AbbreviatedDayNames: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"], MonthNames: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie", ""], AbbreviatedMonthNames: ["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	25: {LCID: 25, Name: "ru", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], AbbreviatedDayNames: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря", ""], AbbreviatedMonthGenitiveNames: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	26: {LCID: 26, Name: "hr", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kn", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac", ""], AbbreviatedMonthNames: ["sij", "vlj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro", ""], MonthGenitiveNames: ["siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenog", "prosinca", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	27: {LCID: 27, Name: "sk", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"], AbbreviatedDayNames: ["ne", "po", "ut", "st", "št", "pi", "so"], MonthNames: ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "dopoludnia", PMDesignator: "odpoludnia", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	28: {LCID: 28, Name: "sq", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Lekë", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"], AbbreviatedDayNames: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"], MonthNames: ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor", ""], AbbreviatedMonthNames: ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj", ""], MonthGenitiveNames: ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "paradite", PMDesignator: "pasdite", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	29: {LCID: 29, Name: "sv", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"], AbbreviatedDayNames: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"], MonthNames: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	30: {LCID: 30, Name: "th", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "฿", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"], AbbreviatedDayNames: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."], MonthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ""], AbbreviatedMonthNames: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	31: {LCID: 31, Name: "tr", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₺", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], AbbreviatedDayNames: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], MonthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık", ""], AbbreviatedMonthNames: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ÖÖ", PMDesignator: "ÖS", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "035"},
	32: {LCID: 32, Name: "ur", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["اتوار", "پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته"], AbbreviatedDayNames: ["اتوار", "پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته"], MonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	33: {LCID: 33, Name: "id", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Rp", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], AbbreviatedDayNames: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], MonthNames: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ".", ShortDatePattern: "135"},
	34: {LCID: 34, Name: "uk", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "₴", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятниця", "субота"], AbbreviatedDayNames: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], MonthNames: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень", ""], AbbreviatedMonthNames: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру", ""], MonthGenitiveNames: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня", ""], AbbreviatedMonthGenitiveNames: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	35: {LCID: 35, Name: "be", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Br", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["нядзеля", "панядзелак", "аўторак", "серада", "чацвер", "пятніца", "субота"], AbbreviatedDayNames: ["нд", "пн", "аўт", "ср", "чц", "пт", "сб"], MonthNames: ["студзень", "люты", "сакавік", "красавік", "май", "чэрвень", "ліпень", "жнівень", "верасень", "кастрычнік", "лістапад", "снежань", ""], AbbreviatedMonthNames: ["студз", "лют", "сак", "крас", "май", "чэрв", "ліп", "жн", "вер", "кастр", "ліст", "снеж", ""], MonthGenitiveNames: ["студзеня", "лютага", "сакавіка", "красавіка", "мая", "чэрвеня", "ліпеня", "жніўня", "верасня", "кастрычніка", "лістапада", "снежня", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	36: {LCID: 36, Name: "sl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"], AbbreviatedDayNames: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."], MonthNames: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "avg.", "sep.", "okt.", "nov.", "dec.", ""], AMDesignator: "dop.", PMDesignator: "pop.", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "035"},
	37: {LCID: 37, Name: "et", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"], AbbreviatedDayNames: ["P", "E", "T", "K", "N", "R", "L"], MonthNames: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember", ""], AbbreviatedMonthNames: ["jaan", "veebr", "märts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "e.k.", PMDesignator: "p.k.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	38: {LCID: 38, Name: "lv", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena"], AbbreviatedDayNames: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"], MonthNames: ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris", ""], AbbreviatedMonthNames: ["Janv.", "Febr.", "Marts", "Apr.", "Maijs", "Jūn.", "Jūl.", "Aug.", "Sept.", "Okt.", "Nov.", "Dec.", ""], MonthGenitiveNames: ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris", ""], AbbreviatedMonthGenitiveNames: ["janv.", "febr.", "marts", "apr.", "maijs", "jūn.", "jūl.", "aug.", "sept.", "okt.", "nov.", "dec.", ""], AMDesignator: "priekšpusdienā", PMDesignator: "pēcpusdienā", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	39: {LCID: 39, Name: "lt", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis"], AbbreviatedDayNames: ["sk", "pr", "an", "tr", "kt", "pn", "št"], MonthNames: ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis", ""], AbbreviatedMonthNames: ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod.", ""], MonthGenitiveNames: ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pr.p.", PMDesignator: "pop.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	40: {LCID: 40, Name: "tg", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "смн", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшанбе", "душанбе", "сешанбе", "чоршанбе", "панҷшанбе", "ҷумъа", "шанбе"], AbbreviatedDayNames: ["пкш", "дшб", "сшб", "чшб", "пшб", "ҷум", "шнб"], MonthNames: ["январ", "феврал", "март", "апрел", "май", "июн", "июл", "август", "сентябр", "октябр", "ноябр", "декабр", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	41: {LCID: 41, Name: "fa", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "ريال", NumberDecimalSeparator: "/", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", ""], AbbreviatedMonthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ق.ظ", PMDesignator: "ب.ظ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	42: {LCID: 42, Name: "vi", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₫", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"], AbbreviatedDayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"], MonthNames: ["Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai", ""], AbbreviatedMonthNames: ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "SA", PMDesignator: "CH", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	43: {LCID: 43, Name: "hy", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "֏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"], AbbreviatedDayNames: ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ"], MonthNames: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր", ""], AbbreviatedMonthNames: ["Հնվ", "Փտվ", "Մրտ", "Ապր", "Մյս", "Հնս", "Հլս", "Օգս", "Սպտ", "Հկտ", "Նյմ", "Դկտ", ""], MonthGenitiveNames: ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	44: {LCID: 44, Name: "az", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₼", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["bazar", "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə"], AbbreviatedDayNames: ["B.", "B.E.", "Ç.A.", "Ç.", "C.A.", "C.", "Ş."], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avq", "sen", "okt", "noy", "dek", ""], MonthGenitiveNames: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	45: {LCID: 45, Name: "eu", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"], AbbreviatedDayNames: ["ig.", "al.", "ar.", "az.", "og.", "or.", "lr."], MonthNames: ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua", ""], AbbreviatedMonthNames: ["Urt.", "Ots.", "Mar.", "Api.", "Mai.", "Eka.", "Uzt.", "Abu.", "Ira.", "Urr.", "Aza.", "Abe.", ""], MonthGenitiveNames: ["urtarrilak", "otsailak", "martxoak", "apirilak", "maiatzak", "ekainak", "uztailak", "abuztuak", "irailak", "urriak", "azaroak", "abenduak", ""], AbbreviatedMonthGenitiveNames: ["urt.", "ots.", "mar.", "api.", "mai.", "eka.", "uzt.", "abu.", "ira.", "urr.", "aza.", "abe.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	46: {LCID: 46, Name: "hsb", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["njedźela", "póndźela", "wutora", "srjeda", "štwórtk", "pjatk", "sobota"], AbbreviatedDayNames: ["nje", "pón", "wut", "srj", "štw", "pja", "sob"], MonthNames: ["januar", "februar", "měrc", "apryl", "meja", "junij", "julij", "awgust", "september", "oktober", "nowember", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "měr", "apr", "mej", "jun", "jul", "awg", "sep", "okt", "now", "dec", ""], MonthGenitiveNames: ["januara", "februara", "měrca", "apryla", "meje", "junija", "julija", "awgusta", "septembra", "oktobra", "nowembra", "decembra", ""], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "měr.", "apr.", "mej.", "jun.", "jul.", "awg.", "sep.", "okt.", "now.", "dec.", ""], AMDesignator: "dopołdnja", PMDesignator: "popołdnju", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	47: {LCID: 47, Name: "mk", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "ден", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"], AbbreviatedDayNames: ["нед.", "пон.", "вт.", "сре.", "чет.", "пет.", "саб."], MonthNames: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември", ""], AbbreviatedMonthNames: ["јан.", "фев.", "мар.", "апр.", "мај", "јун.", "јул.", "авг.", "септ.", "окт.", "ноем.", "дек.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "претпладне", PMDesignator: "попладне", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "125"},
	48: {LCID: 48, Name: "st", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sontaha", "Mmantaha", "Labobedi", "Laboraru", "Labone", "Labohlane", "Moqebelo"], AbbreviatedDayNames: ["Son", "Mma", "Bed", "Rar", "Ne", "Hla", "Moq"], MonthNames: ["Phesekgong", "Hlakola", "Hlakubele", "Mmese", "Motsheanong", "Phupjane", "Phupu", "Phata", "Leotshe", "Mphalane", "Pundungwane", "Tshitwe", ""], AbbreviatedMonthNames: ["Phe", "Kol", "Ube", "Mme", "Mot", "Jan", "Upu", "Pha", "Leo", "Mph", "Pun", "Tsh", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	49: {LCID: 49, Name: "ts", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sonto", "Musumbhunuku", "Ravumbirhi", "Ravunharhu", "Ravumune", "Ravuntlhanu", "Mugqivela"], AbbreviatedDayNames: ["Son", "Mus", "Bir", "Har", "Ne", "Tlh", "Mug"], MonthNames: ["Sunguti", "Nyenyenyani", "Nyenyankulu", "Dzivamisoko", "Mudyaxihi", "Khotavuxika", "Mawuwani", "Mhawuri", "Ndzhati", "Nhlangula", "Hukuri", "N’wendzamhala", ""], AbbreviatedMonthNames: ["Sun", "Yan", "Kul", "Dzi", "Mud", "Kho", "Maw", "Mha", "Ndz", "Nhl", "Huk", "N’w", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	50: {LCID: 50, Name: "tn", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Tshipi", "Mosopulogo", "Labobedi", "Laboraro", "Labone", "Labotlhano", "Matlhatso"], AbbreviatedDayNames: ["Tsh", "Mos", "Bed", "Rar", "Ne", "Tla", "Mat"], MonthNames: ["Ferikgong", "Tlhakole", "Mopitlo", "Moranang", "Motsheganang", "Seetebosigo", "Phukwi", "Phatwe", "Lwetse", "Diphalane", "Ngwanatsele", "Sedimonthole", ""], AbbreviatedMonthNames: ["Fer", "Tlh", "Mop", "Mor", "Mot", "See", "Phu", "Pha", "Lwe", "Dip", "Ngw", "Sed", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	51: {LCID: 51, Name: "ve", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Swondaha", "Musumbuluwo", "Ḽavhuvhili", "Ḽavhuraru", "Ḽavhuṋa", "Ḽavhuṱanu", "Mugivhela"], AbbreviatedDayNames: ["Swo", "Mus", "Vhi", "Rar", "Ṋa", "Ṱan", "Mug"], MonthNames: ["Phando", "Luhuhi", "Ṱhafamuhwe", "Lambamai", "Shundunthule", "Fulwi", "Fulwana", "Ṱhangule", "Khubvumedzi", "Tshimedzi", "Ḽara", "Nyendavhusiku", ""], AbbreviatedMonthNames: ["Pha", "Luh", "Ṱhf", "Lam", "Shu", "Lwi", "Lwa", "Ṱha", "Khu", "Tsh", "Ḽar", "Nye", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	52: {LCID: 52, Name: "xh", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Cawe", "Mvulo", "Lwesibini", "Lwesithathu", "Lwesine", "Lwesihlanu", "Mgqibelo"], AbbreviatedDayNames: ["Caw", "Mvu", "Bin", "Tha", "Sin", "Hla", "Mgq"], MonthNames: ["Janyuwari", "Februwari", "Matshi", "Epreli", "Meyi", "Juni", "Julayi", "Agasti", "Septemba", "Okthoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mat", "Epr", "Mey", "Jun", "Jul", "Aga", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	53: {LCID: 53, Name: "zu", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sonto", "Msombuluko", "Lwesibili", "Lwesithathu", "Lwesine", "Lwesihlanu", "Mgqibelo"], AbbreviatedDayNames: ["Son", "Mso", "Bil", "Tha", "Sin", "Hla", "Mgq"], MonthNames: ["Januwari", "Februwari", "Mashi", "Apreli", "Meyi", "Juni", "Julayi", "Agasti", "Septhemba", "Okthoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mas", "Apr", "Mey", "Jun", "Jul", "Aga", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	54: {LCID: 54, Name: "af", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"], AbbreviatedDayNames: ["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa"], MonthNames: ["Januarie", "Februarie", "Maart", "April", "Mei", "Junie", "Julie", "Augustus", "September", "Oktober", "November", "Desember", ""], AbbreviatedMonthNames: ["Jan.", "Feb.", "Mrt.", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "vm.", PMDesignator: "nm.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	55: {LCID: 55, Name: "ka", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₾", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"], AbbreviatedDayNames: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"], MonthNames: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი", ""], AbbreviatedMonthNames: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	56: {LCID: 56, Name: "fo", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sunnudagur", "mánadagur", "týsdagur", "mikudagur", "hósdagur", "fríggjadagur", "leygardagur"], AbbreviatedDayNames: ["sun", "mán", "týs", "mik", "hós", "frí", "ley"], MonthNames: ["januar", "februar", "mars", "apríl", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "um fyr.", PMDesignator: "um sein.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	57: {LCID: 57, Name: "hi", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["रवि.", "सोम.", "मंगल.", "बुध.", "गुरु.", "शुक्र.", "शनि."], MonthNames: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्तूबर", "नवम्बर", "दिसम्बर", ""], AbbreviatedMonthNames: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्तूबर", "नवम्बर", "दिसम्बर", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "पूर्वाह्न", PMDesignator: "अपराह्न", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	58: {LCID: 58, Name: "mt", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Il-Ħadd", "It-Tnejn", "It-Tlieta", "L-Erbgħa", "Il-Ħamis", "Il-Ġimgħa", "Is-Sibt"], AbbreviatedDayNames: ["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib"], MonthNames: ["Jannar", "Frar", "Marzu", "April", "Mejju", "Ġunju", "Lulju", "Awwissu", "Settembru", "Ottubru", "Novembru", "Diċembru", ""], AbbreviatedMonthNames: ["Jan", "Fra", "Mar", "Apr", "Mej", "Ġun", "Lul", "Aww", "Set", "Ott", "Nov", "Diċ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	59: {LCID: 59, Name: "se", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sotnabeaivi", "vuossárga", "maŋŋebárga", "gaskavahkku", "duorasdat", "bearjadat", "lávvardat"], AbbreviatedDayNames: ["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"], MonthNames: ["ođđajagemánnu", "guovvamánnu", "njukčamánnu", "cuoŋománnu", "miessemánnu", "geassemánnu", "suoidnemánnu", "borgemánnu", "čakčamánnu", "golggotmánnu", "skábmamánnu", "juovlamánnu", ""], AbbreviatedMonthNames: ["ođđj", "guov", "njuk", "cuo", "mies", "geas", "suoi", "borg", "čakč", "golg", "skáb", "juov", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "i.b.", PMDesignator: "e.b.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	60: {LCID: 60, Name: "ga", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dé Domhnaigh", "Dé Luain", "Dé Máirt", "Dé Céadaoin", "Déardaoin", "Dé hAoine", "Dé Sathairn"], AbbreviatedDayNames: ["Domh", "Luan", "Máirt", "Céad", "Déar", "Aoine", "Sath"], MonthNames: ["Eanáir", "Feabhra", "Márta", "Aibreán", "Bealtaine", "Meitheamh", "Iúil", "Lúnasa", "Meán Fómhair", "Deireadh Fómhair", "Samhain", "Nollaig", ""], AbbreviatedMonthNames: ["Ean", "Feabh", "Márta", "Aib", "Beal", "Meith", "Iúil", "Lún", "MFómh", "DFómh", "Samh", "Noll", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	61: {LCID: 61, Name: "yi", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "XDR", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["זונטיק", "מאָנטיק", "דינסטיק", "מיטוואך", "דאנערשטיק", "פֿרײַטיק", "שבת"], AbbreviatedDayNames: ["זונטיק", "מאָנטיק", "דינסטיק", "מיטוואך", "דאנערשטיק", "פֿרײַטיק", "שבת"], MonthNames: ["יאַנואַר", "פֿעברואַר", "מערץ", "אַפּריל", "מיי", "יוני", "יולי", "אויגוסט", "סעפּטעמבער", "אקטאבער", "נאוועמבער", "דעצעמבער", ""], AbbreviatedMonthNames: ["יאַנ", "פֿעב", "מערץ", "אַפּר", "מיי", "יוני", "יולי", "אויגוסט", "סעפּ", "אקט", "נאוו", "דעצ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["יאַנואַר", "פֿעברואַר", "מערץ", "אַפּריל", "מיי", "יוני", "יולי", "אויגוסט", "סעפּטעמבער", "אקטאבער", "נאוועמבער", "דעצעמבער", ""], AMDesignator: "פארמיטאג", PMDesignator: "נאכמיטאג", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	62: {LCID: 62, Name: "ms", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "RM", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"], AbbreviatedDayNames: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"], MonthNames: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pg", PMDesignator: "ptg", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	63: {LCID: 63, Name: "kk", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₸", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"], AbbreviatedDayNames: ["жек", "дүй", "сей", "сәр", "бей", "жұма", "сен"], MonthNames: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан", ""], AbbreviatedMonthNames: ["қаң.", "ақп.", "нау.", "сәу.", "мам.", "мау.", "шіл.", "там.", "қыр.", "қаз.", "қар.", "желт.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "таңертеңгі", PMDesignator: "түстен кейінгі", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	64: {LCID: 64, Name: "ky", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "сом", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби"], AbbreviatedDayNames: ["Жш", "Дш", "Шш", "Шр", "Бш", "Жм", "Иш"], MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthGenitiveNames: ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек.", ""], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "034"},
	65: {LCID: 65, Name: "sw", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Ksh", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"], AbbreviatedDayNames: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"], MonthNames: ["Januari", "Februari", "Machi", "Aprili", "Mei", "Juni", "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	66: {LCID: 66, Name: "tk", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "m.", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Ýekşenbe", "Duşenbe", "Sişenbe", "Çarşenbe", "Penşenbe", "Anna", "Şenbe"], AbbreviatedDayNames: ["Ýb", "Db", "Sb", "Çb", "Pb", "An", "Şb"], MonthNames: ["Ýanwar", "Fewral", "Mart", "Aprel", "Maý", "lýun", "lýul", "Awgust", "Sentýabr", "Oktýabr", "Noýabr", "Dekabr", ""], AbbreviatedMonthNames: ["Ýan", "Few", "Mart", "Apr", "Maý", "lýun", "lýul", "Awg", "Sen", "Okt", "Noý", "Dek", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	67: {LCID: 67, Name: "uz", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "soʻm", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], AbbreviatedDayNames: ["Yaksh", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["Yanv", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noya", "Dek", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "TO", PMDesignator: "TK", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	68: {LCID: 68, Name: "tt", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшәмбе", "дүшәмбе", "сишәмбе", "чәршәмбе", "пәнҗешәмбе", "җомга", "шимбә"], AbbreviatedDayNames: ["якш.", "дүш.", "сиш.", "чәрш.", "пәнҗ.", "җом.", "шим."], MonthNames: ["гыйнвар", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthNames: ["гыйн.", "фев.", "мар.", "апр.", "май", "июнь", "июль", "авг.", "сен.", "окт.", "нояб.", "дек.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	69: {LCID: 69, Name: "bn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"], AbbreviatedDayNames: ["রবি.", "সোম.", "মঙ্গল.", "বুধ.", "বৃহস্পতি.", "শুক্র.", "শনি."], MonthNames: ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর", ""], AbbreviatedMonthNames: ["জানু.", "ফেব্রু.", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগ.", "সেপ্টে.", "অক্টো.", "নভে.", "ডিসে.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	70: {LCID: 70, Name: "pa", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨਿੱਚਰਵਾਰ"], AbbreviatedDayNames: ["ਐਤ.", "ਸੋਮ.", "ਮੰਗਲ.", "ਬੁੱਧ.", "ਵੀਰ.", "ਸ਼ੁਕਰ.", "ਸ਼ਨਿੱਚਰ."], MonthNames: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ", ""], AbbreviatedMonthNames: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ਸਵੇਰ", PMDesignator: "ਸ਼ਾਮ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	71: {LCID: 71, Name: "gu", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"], AbbreviatedDayNames: ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"], MonthNames: ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટેમ્બર", "ઑક્ટોબર", "નવેમ્બર", "ડિસેમ્બર", ""], AbbreviatedMonthNames: ["જાન્યુ", "ફેબ્રુ", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગ", "સપ્ટે", "ઑક્ટો", "નવે", "ડિસે", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "પૂર્વ મધ્યાહ્ન", PMDesignator: "ઉત્તર મધ્યાહ્ન", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	72: {LCID: 72, Name: "or", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ରବିବାର", "ସୋମବାର", "ମଙ୍ଗଳବାର", "ବୁଧବାର", "ଗୁରୁବାର", "ଶୁକ୍ରବାର", "ଶନିବାର"], AbbreviatedDayNames: ["ରବି.", "ସୋମ.", "ମଙ୍ଗଳ.", "ବୁଧ.", "ଗୁରୁ.", "ଶୁକ୍ର.", "ଶନି."], MonthNames: ["ଜାନୁୟାରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ୍‌", "ମେ", "ଜୁନ୍‌", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର", ""], AbbreviatedMonthNames: ["ଜାନୁୟାରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ୍‌", "ମେ", "ଜୁନ୍‌", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	73: {LCID: 73, Name: "ta", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ஞாயிற்றுக்கிழமை", "திங்கள்கிழமை", "செவ்வாய்க்கிழமை", "புதன்கிழமை", "வியாழக்கிழமை", "வெள்ளிக்கிழமை", "சனிக்கிழமை"], AbbreviatedDayNames: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"], MonthNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], AbbreviatedMonthNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "காலை", PMDesignator: "மாலை", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	74: {LCID: 74, Name: "te", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"], AbbreviatedDayNames: ["ఆది.", "సోమ.", "మంగళ.", "బుధ.", "గురు.", "శుక్ర.", "శని."], MonthNames: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్", ""], AbbreviatedMonthNames: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "పూర్వాహ్న", PMDesignator: "అపరాహ్న", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	75: {LCID: 75, Name: "kn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"], AbbreviatedDayNames: ["ಭಾನು.", "ಸೋಮ.", "ಮಂಗಳ.", "ಬುಧ.", "ಗುರು.", "ಶುಕ್ರ.", "ಶನಿ."], MonthNames: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರೀಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್", ""], AbbreviatedMonthNames: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಎಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ಪೂರ್ವಾಹ್ನ", PMDesignator: "ಅಪರಾಹ್ನ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	76: {LCID: 76, Name: "ml", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ഞായറാഴ്ച", "തിങ്കളാഴ്ച", "ചൊവ്വാഴ്ച", "ബുധനാഴ്ച", "വ്യാഴാഴ്ച", "വെള്ളിയാഴ്ച", "ശനിയാഴ്ച"], AbbreviatedDayNames: ["ഞായർ.", "തിങ്കൾ.", "ചൊവ്വ.", "ബുധൻ.", "വ്യാഴം.", "വെള്ളി.", "ശനി."], MonthNames: ["ജനുവരി", "ഫെബ്രുവരി", "മാര്‍‌ച്ച്", "ഏപ്രില്‍", "മെയ്", "ജൂണ്‍", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്‌റ്റംബര്‍", "ഒക്‌ടോബര്‍", "നവംബര്‍", "ഡിസംബര്‍", ""], AbbreviatedMonthNames: ["ജനുവരി", "ഫെബ്രുവരി", "മാര്‍‌ച്ച്", "ഏപ്രില്‍", "മെയ്", "ജൂണ്‍", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്‌റ്റംബര്‍", "ഒക്‌ടോബര്‍", "നവംബര്‍", "ഡിസംബര്‍", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	77: {LCID: 77, Name: "as", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ৰবিবাৰ", "সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্রবাৰ", "শনিবাৰ"], AbbreviatedDayNames: ["ৰবি.", "সোম.", "মঙ্গল.", "বুধ.", "বৃহ.", "শুক্র.", "শনি."], MonthNames: ["জানুৱাৰী", "ফেব্রুৱাৰী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগষ্ট", "চেপ্টেম্বৰ", "অক্টোবৰ", "নবেম্বৰ", "ডিচেম্বৰ", ""], AbbreviatedMonthNames: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগষ্ট", "চেপ্টে", "অক্টো", "নবে", "ডিচে", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ৰাতিপু", PMDesignator: "আবেলি", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	78: {LCID: 78, Name: "mr", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["रवि.", "सोम.", "मंगळ.", "बुध.", "गुरु.", "शुक्र.", "शनि."], MonthNames: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जाने.", "फेब्रु.", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग.", "सप्टें.", "ऑक्टो.", "नोव्हें.", "डिसें.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "म.पू.", PMDesignator: "म.नं.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	79: {LCID: 79, Name: "sa", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवासरः", "सोमवासरः", "मङ्गलवासरः", "बुधवासरः", "गुरुवासरः", "शुक्रवासरः", "शनिवासरः"], AbbreviatedDayNames: ["रवि", "सोम", "मङ्ग", "बुध", "गुरु", "शुक्र", "शनि"], MonthNames: ["जान्युअरी", "फेब्रुअरी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जान्युअरी", "फेब्रुअरी", "मार्च", "एप्रिल", "मे", "जुन", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "मध्यानपूर्व", PMDesignator: "मध्यानपच्यात", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	80: {LCID: 80, Name: "mn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₮", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба"], AbbreviatedDayNames: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"], MonthNames: ["Нэгдүгээр сар", "Хоёрдугаар сар", "Гуравдугаар сар", "Дөрөвдүгээр сар", "Тавдугаар сар", "Зургадугаар сар", "Долдугаар сар", "Наймдугаар сар", "Есдүгээр сар", "Аравдугаар сар", "Арван нэгдүгээр сар", "Арван хоёрдугаар сар", ""], AbbreviatedMonthNames: ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ҮӨ", PMDesignator: "ҮХ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	81: {LCID: 81, Name: "bo", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["གཟའ་ཉི་མ།", "གཟའ་ཟླ་བ།", "གཟའ་མིག་དམར།", "གཟའ་ལྷག་པ།", "གཟའ་ཕུར་བུ།", "གཟའ་པ་སངས།", "གཟའ་སྤེན་པ།"], AbbreviatedDayNames: ["ཉི་མ།", "ཟླ་བ།", "མིག་དམར།", "ལྷག་པ།", "ཕུར་བུ།", "པ་སངས།", "སྤེན་པ།"], MonthNames: ["སྤྱི་ཟླ་དང་པོ།", "སྤྱི་ཟླ་གཉིས་པ།", "སྤྱི་ཟླ་གསུམ་པ།", "སྤྱི་ཟླ་བཞི་པ།", "སྤྱི་ཟླ་ལྔ་པ།", "སྤྱི་ཟླ་དྲུག་པ།", "སྤྱི་ཟླ་བདུན་པ།", "སྤྱི་ཟླ་བརྒྱད་པ།", "སྤྱི་ཟླ་དགུ་པ།", "སྤྱི་ཟླ་བཅུ་པ།", "སྤྱི་ཟླ་བཅུ་གཅིག་པ།", "སྤྱི་ཟླ་བཅུ་གཉིས་པ།", ""], AbbreviatedMonthNames: ["ཟླ་ ༡", "ཟླ་ ༢", "ཟླ་ ༣", "ཟླ་ ༤", "ཟླ་ ༥", "ཟླ་ ༦", "ཟླ་ ༧", "ཟླ་ ༨", "ཟླ་ ༩", "ཟླ་ ༡༠", "ཟླ་ ༡༡", "ཟླ་ ༡༢", ""], MonthGenitiveNames: ["སྤྱི་ཟླ་དང་པོའི་", "སྤྱི་ཟླ་གཉིས་པའི་", "སྤྱི་ཟླ་གསུམ་པའི་", "སྤྱི་ཟླ་བཞི་པའི་", "སྤྱི་ཟླ་ལྔ་པའི་", "སྤྱི་ཟླ་དྲུག་པའི་", "སྤྱི་ཟླ་བདུན་པའི་", "སྤྱི་ཟླ་བརྒྱད་པའི་", "སྤྱི་ཟླ་དགུ་པའི་", "སྤྱི་ཟླ་བཅུ་པའི་", "སྤྱི་ཟླ་བཅུ་གཅིག་པའི་", "སྤྱི་ཟླ་བཅུ་གཉིས་པའི་", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "སྔ་དྲོ", PMDesignator: "ཕྱི་དྲོ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	82: {LCID: 82, Name: "cy", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "£", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dydd Sul", "Dydd Llun", "Dydd Mawrth", "Dydd Mercher", "Dydd Iau", "Dydd Gwener", "Dydd Sadwrn"], AbbreviatedDayNames: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwen", "Sad"], MonthNames: ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr", ""], AbbreviatedMonthNames: ["Ion", "Chw", "Maw", "Ebr", "Mai", "Meh", "Gor", "Awst", "Medi", "Hyd", "Tach", "Rhag", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Ion", "Chwef", "Mawrth", "Ebrill", "Mai", "Meh", "Gorff", "Awst", "Medi", "Hyd", "Tach", "Rhag", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	83: {LCID: 83, Name: "km", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "៛", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ថ្ងៃអាទិត្យ", "ថ្ងៃច័ន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍"], AbbreviatedDayNames: ["អាទិ.", "ច.", "អ.", "ពុ", "ព្រហ.", "សុ.", "ស."], MonthNames: ["មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ", ""], AbbreviatedMonthNames: ["១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩", "១០", "១១", "១២", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ព្រឹក", PMDesignator: "ល្ងាច", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	84: {LCID: 84, Name: "lo", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "₭", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ"], AbbreviatedDayNames: ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ"], MonthNames: ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ", ""], AbbreviatedMonthNames: ["ມ.ກ.", "ກ.ພ.", "ມ.ນ.", "ມ.ສ.", "ພ.ພ.", "ມິ.ຖ.", "ກ.ລ.", "ສ.ຫ.", "ກ.ຍ.", "ຕ.ລ.", "ພ.ຈ.", "ທ.ວ.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ກ່ອນທ່ຽງ", PMDesignator: "ຫຼັງທ່ຽງ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	85: {LCID: 85, Name: "my", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "K", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"], AbbreviatedDayNames: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"], MonthNames: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ", ""], AbbreviatedMonthNames: ["ဇန်", "ဖေ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူ", "ဩ", "စက်", "အောက်", "နို", "ဒီ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "နံနက်", PMDesignator: "ညနေ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	86: {LCID: 86, Name: "gl", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "luns", "martes", "mércores", "xoves", "venres", "sábado"], AbbreviatedDayNames: ["dom", "lun", "mar", "mér", "xov", "ven", "sáb"], MonthNames: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro", ""], AbbreviatedMonthNames: ["Xan", "Feb", "Mar", "Abr", "Mai", "Xuñ", "Xul", "Ago", "Set", "Out", "Nov", "Dec", ""], MonthGenitiveNames: ["xaneiro", "febreiro", "marzo", "abril", "maio", "xuño", "xullo", "agosto", "setembro", "outubro", "novembro", "decembro", ""], AbbreviatedMonthGenitiveNames: ["xan", "feb", "mar", "abr", "mai", "xuñ", "xul", "ago", "set", "out", "nov", "dec", ""], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	87: {LCID: 87, Name: "kok", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["आयतार", "सोमार", "मंगळार", "बुधवार", "बिरेस्तार", "सुक्रार", "शेनवार"], AbbreviatedDayNames: ["आय.", "सोम.", "मंगळ.", "बुध.", "बिरे.", "सुक्र.", "शेन."], MonthNames: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोवेम्बर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑग.", "सप्टें.", "ऑक्टो.", "नोवे.", "डिसें", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "म.पू.", PMDesignator: "म.नं.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	88: {LCID: 88, Name: "mni", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["নোংমাইজিং", "নিংথৌকাঃবা", "লৈঃপাক পোকপা", "য়ুমশা কৈশা", "সগোনসেল", "ইরাই", "থাংজা"], AbbreviatedDayNames: ["নোংমাইজিং", "নিংথৌকাঃবা", "লৈঃপাক পোকপা", "য়ুমশা কৈশা", "সগোনসেল", "ইরাই", "থাংজা"], MonthNames: ["ৱাকিচঙ", "লাঘাফাইরেল", "লমদা", "সজিবু", "কালেন্", "ইঙাঃ", "ইঙেন", "থৱান", "লাংবন", "মেরাঃ", "হাগৈঃ", "পোইনু", ""], AbbreviatedMonthNames: ["ৱাকিচঙ", "লাঘাফাইরেল", "লমদা", "সজিবু", "কালেন্", "ইঙাঃ", "ইঙেন", "থৱান", "লাংবন", "মেরাঃ", "হাগৈঃ", "পোইনু", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	89: {LCID: 89, Name: "sd", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["سومر", "اڱارو", "اربع", "خميس", "جمعو", "ڇنڇر", "آچر"], AbbreviatedDayNames: ["سو", "اڱ", "ار", "خم", "جمعو", "ڇن", "آچ"], MonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], AbbreviatedMonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	90: {LCID: 90, Name: "syr", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ܠ.ܣ.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ܚܕ ܒܫܒܐ", "ܬܪܝܢ ܒܫܒܐ", "ܬܠܬܐ ܒܫܒܐ", "ܐܪܒܥܐ ܒܫܒܐ", "ܚܡܫܐ ܒܫܒܐ", "ܥܪܘܒܬܐ", "ܫܒܬܐ"], AbbreviatedDayNames: ["܏ܐ ܏ܒܫ", "܏ܒ ܏ܒܫ", "܏ܓ ܏ܒܫ", "܏ܕ ܏ܒܫ", "܏ܗ ܏ܒܫ", "܏ܥܪܘܒ", "܏ܫܒ"], MonthNames: ["ܟܢܘܢ ܐܚܪܝ", "ܫܒܛ", "ܐܕܪ", "ܢܝܣܢ", "ܐܝܪ", "ܚܙܝܪܢ", "ܬܡܘܙ", "ܐܒ", "ܐܝܠܘܠ", "ܬܫܪܝ ܩܕܝܡ", "ܬܫܪܝ ܐܚܪܝ", "ܟܢܘܢ ܩܕܝܡ", ""], AbbreviatedMonthNames: ["܏ܟܢ ܏ܒ", "ܫܒܛ", "ܐܕܪ", "ܢܝܣܢ", "ܐܝܪ", "ܚܙܝܪܢ", "ܬܡܘܙ", "ܐܒ", "ܐܝܠܘܠ", "܏ܬܫ ܏ܐ", "܏ܬܫ ܏ܒ", "܏ܟܢ ܏ܐ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ܩ.ܛ", PMDesignator: "ܒ.ܛ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	91: {LCID: 91, Name: "si", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "රු.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"], AbbreviatedDayNames: ["ඉරිදා", "සඳුදා", "අඟහ", "බදාදා", "බ්‍රහස්", "සිකු", "සෙන"], MonthNames: ["ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්", ""], AbbreviatedMonthNames: ["ජන", "පෙබ", "මාර්", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["ජන", "පෙබ", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ", ""], AMDesignator: "පෙ.ව.", PMDesignator: "ප.ව.", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "531"},
	92: {LCID: 92, Name: "chr", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ᎤᎾᏙᏓᏆᏍᎬ", "ᎤᎾᏙᏓᏉᏅᎯ", "ᏔᎵᏁᎢᎦ", "ᏦᎢᏁᎢᎦ", "ᏅᎩᏁᎢᎦ", "ᏧᎾᎩᎶᏍᏗ", "ᎤᎾᏙᏓᏈᏕᎾ"], AbbreviatedDayNames: ["ᏆᏍᎬ", "ᏉᏅᎯ", "ᏔᎵᏁ", "ᏦᎢᏁ", "ᏅᎩᏁ", "ᏧᎾᎩ", "ᏈᏕᎾ"], MonthNames: ["ᎤᏃᎸᏔᏅ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍᎬᏘ", "ᏕᎭᎷᏱ", "ᎫᏰᏉᏂ", "ᎦᎶᏂ", "ᏚᎵᏍᏗ", "ᏚᏂᏅᏗ", "ᏅᏓᏕᏆ", "ᎤᏍᎩᏱ", ""], AbbreviatedMonthNames: ["ᎤᏃᎸ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍ", "ᏕᎭᎷ", "ᎫᏰᏉ", "ᎦᎶᏂ", "ᏚᎵᏍ", "ᏚᏂᏅ", "ᏅᏓᏕ", "ᎤᏍᎩ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	93: {LCID: 93, Name: "iu", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Naattiinguja", "Naggajjau", "Aippiq", "Pingatsiq", "Sitammiq", "Tallirmiq", "Sivataarvik"], AbbreviatedDayNames: ["Nat", "Nag", "Aip", "Pi", "Sit", "Tal", "Siv"], MonthNames: ["Jaannuari", "Viivvuari", "Maatsi", "Iipuri", "Mai", "Juuni", "Julai", "Aaggiisi", "Sitipiri", "Utupiri", "Nuvipiri", "Tisipiri", ""], AbbreviatedMonthNames: ["Jan", "Viv", "Mas", "Ipu", "Mai", "Jun", "Jul", "Agi", "Sii", "Uut", "Nuv", "Tis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	94: {LCID: 94, Name: "am", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "ብር", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"], AbbreviatedDayNames: ["እሑድ", "ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"], MonthNames: ["ጃንዩወሪ", "ፌብሩወሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን", "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር", ""], AbbreviatedMonthNames: ["ጃንዩ", "ፌብሩ", "ማርች", "ኤፕሪ", "ሜይ", "ጁን", "ጁላይ", "ኦገስ", "ሴፕቴ", "ኦክቶ", "ኖቬም", "ዲሴም", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ጥዋት", PMDesignator: "ከሰዓት", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	95: {LCID: 95, Name: "tzm", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "DA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["lh'ed", "letnayen", "ttlata", "larebâa", "lexmis", "ldjemâa", "ssebt"], AbbreviatedDayNames: ["lh'd", "let", "ttl", "lar", "lex", "ldj", "sse"], MonthNames: ["Yennayer", "Furar", "Meghres", "Yebrir", "Magu", "Yunyu", "Yulyu", "Ghuct", "Cutenber", "Tuber", "Nunember", "Dujanbir", ""], AbbreviatedMonthNames: ["Yen", "Fur", "Megh", "Yeb", "May", "Yun", "Yul", "Ghu", "Cut", "Tub", "Nun", "Duj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	96: {LCID: 96, Name: "ks", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["اَتھوار", "ژٔنٛدرٕروار", "بوٚموار", "بودوار", "برٛٮ۪سوار", "جُمہ", "بٹوار"], AbbreviatedDayNames: ["آتھوار", "ژٔنٛدٕروار", "بوٚموار", "بودوار", "برٛٮ۪سوار", "جُمہ", "بٹوار"], MonthNames: ["جنؤری", "فرؤری", "مارٕچ", "اپریل", "میٔ", "جوٗن", "جوٗلایی", "اگست", "ستمبر", "اکتوٗبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنؤری", "فرؤری", "مارٕچ", "اپریل", "میٔ", "جوٗن", "جوٗلایی", "اگست", "ستمبر", "اکتوٗبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	97: {LCID: 97, Name: "ne", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "रु", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["आइतवार", "सोमवार", "मङ्गलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"], MonthNames: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जून", "जुलाई", "अगस्त", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर", ""], AbbreviatedMonthNames: ["जन", "फेब", "मार्च", "अप्रिल", "मे", "जून", "जुलाई", "अग", "सेप्ट", "अक्ट", "नोभ", "डिस", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "पूर्वाह्न", PMDesignator: "अपराह्न", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	98: {LCID: 98, Name: "fy", CurrencyPositivePattern: 2, CurrencyNegativePattern: 11, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["snein", "moandei", "tiisdei", "woansdei", "tongersdei", "freed", "sneon"], AbbreviatedDayNames: ["si", "mo", "ti", "wo", "to", "fr", "so"], MonthNames: ["jannewaris", "febrewaris", "maart", "april", "maaie", "juny", "july", "augustus", "septimber", "oktober", "novimber", "desimber", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mrt.", "apr.", "mai", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	99: {LCID: 99, Name: "ps", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "؋", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چارشنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چارشنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["وری", "غويی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "ليندۍ", "مرغومی", "سلواغه", "كب", ""], AbbreviatedMonthNames: ["وری", "غويی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "ليندۍ", "مرغومی", "سلواغه", "كب", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "غ.م.", PMDesignator: "غ.و.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	100: {LCID: 100, Name: "fil", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₱", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], AbbreviatedDayNames: ["Lin", "Lun", "Mar", "Miy", "Huw", "Biy", "Sab"], MonthNames: ["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre", ""], AbbreviatedMonthNames: ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	101: {LCID: 101, Name: "dv", CurrencyPositivePattern: 3, CurrencyNegativePattern: 10, CurrencySymbol: "ރ.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["އާދީއްތަ", "ހޯމަ", "އަންގާރަ", "ބުދަ", "ބުރާސްފަތި", "ހުކުރު", "ހޮނިހިރު"], AbbreviatedDayNames: ["އާދީއްތަ", "ހޯމަ", "އަންގާރަ", "ބުދަ", "ބުރާސްފަތި", "ހުކުރު", "ހޮނިހިރު"], MonthNames: ["ޖަނަވަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރިލް", "މެއި", "ޖޫން", "ޖުލައި", "އޮގަސްޓް", "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ", ""], AbbreviatedMonthNames: ["ޖަނަވަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރިލް", "މެއި", "ޖޫން", "ޖުލައި", "އޮގަސްޓް", "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "މކ", PMDesignator: "މފ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	102: {LCID: 102, Name: "bin", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	103: {LCID: 103, Name: "ff", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["alete", "altine", "talaata", "alarba", "alkamiisa", "aljumaa", "asete"], AbbreviatedDayNames: ["alet", "alt.", "tal.", "alar.", "alk.", "alj.", "aset"], MonthNames: ["samwiee", "feeburyee", "marsa", "awril", "me", "suyeŋ", "sulyee", "ut", "satambara", "oktoobar", "nowamburu", "deesamburu", ""], AbbreviatedMonthNames: ["samw", "feeb", "mar", "awr", "me", "suy", "sul", "ut", "sat", "okt", "now", "dees", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	104: {LCID: 104, Name: "ha", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Lahadi", "Litinin", "Talata", "Laraba", "Alhamis", "Jummaʼa", "Asabar"], AbbreviatedDayNames: ["Lh", "Li", "Ta", "Lr", "Al", "Ju", "As"], MonthNames: ["Janairu", "Faburairu", "Maris", "Afirilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba", ""], AbbreviatedMonthNames: ["Jan", "Fab", "Mar", "Afi", "May", "Yun", "Yul", "Agu", "Sat", "Okt", "Nuw", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	105: {LCID: 105, Name: "ibb", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	106: {LCID: 106, Name: "yo", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Ọjọ́ Àìkú", "Ọjọ́ Ajé", "Ọjọ́ Ìsẹ́gun", "Ọjọ́rú", "Ọjọ́bọ", "Ọjọ́ Ẹtì", "Ọjọ́ Àbámẹ́ta"], AbbreviatedDayNames: ["Àìkú", "Ajé", "Ìsẹ́gun", "Ọjọ́rú", "Ọjọ́bọ", "Ẹtì", "Àbámẹ́ta"], MonthNames: ["Oṣù Ṣẹ́rẹ́", "Oṣù Èrèlè", "Oṣù Ẹrẹ̀nà", "Oṣù Ìgbé", "Oṣù Ẹ̀bibi", "Oṣù Òkúdu", "Oṣù Agẹmọ", "Oṣù Ògún", "Oṣù Owewe", "Oṣù Ọ̀wàrà", "Oṣù Bélú", "Oṣù Ọ̀pẹ̀", ""], AbbreviatedMonthNames: ["Ṣẹ́rẹ́", "Èrèlè", "Ẹrẹ̀nà", "Ìgbé", "Ẹ̀bibi", "Òkúdu", "Agẹmọ", "Ògún", "Owewe", "Ọ̀wàrà", "Bélú", "Ọ̀pẹ̀", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "Àárọ̀", PMDesignator: "Ọ̀sán", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	107: {LCID: 107, Name: "quz", CurrencyPositivePattern: 2, CurrencyNegativePattern: 14, CurrencySymbol: "Bs.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["intichaw", "killachaw", "atipachaw", "quyllurchaw", "Ch' askachaw", "Illapachaw", "k'uychichaw"], AbbreviatedDayNames: ["int", "kil", "ati", "quy", "Ch'", "Ill", "k'u"], MonthNames: ["Qulla puquy", "Hatun puquy", "Pauqar waray", "ayriwa", "Aymuray", "Inti raymi", "Anta Sitwa", "Qhapaq Sitwa", "Uma raymi", "Kantaray", "Ayamarq'a", "Kapaq Raymi", ""], AbbreviatedMonthNames: ["Qul", "Hat", "Pau", "ayr", "Aym", "Int", "Ant", "Qha", "Uma", "Kan", "Aya", "Kap", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	108: {LCID: 108, Name: "nso", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sontaga", "Mosupalogo", "Labobedi", "Laboraro", "Labone", "Labohlano", "Mokibelo"], AbbreviatedDayNames: ["Son", "Mos", "Bed", "Rar", "Ne", "Hla", "Mok"], MonthNames: ["Janaware", "Feberware", "Matšhe", "Aporele", "Mei", "June", "Julae", "Agostose", "Setemere", "Oktobore", "Nofemere", "Disemere", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mat", "Apo", "Mei", "Jun", "Jul", "Ago", "Set", "Okt", "Nof", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	109: {LCID: 109, Name: "ba", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Йәкшәмбе", "Дүшәмбе", "Шишәмбе", "Шаршамбы", "Кесаҙна", "Йома", "Шәмбе"], AbbreviatedDayNames: ["Йш", "Дш", "Шш", "Шр", "Кс", "Йм", "Шб"], MonthNames: ["ғинуар", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthNames: ["ғин", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	110: {LCID: 110, Name: "lb", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sonndeg", "Méindeg", "Dënschdeg", "Mëttwoch", "Donneschdeg", "Freideg", "Samschdeg"], AbbreviatedDayNames: ["Son", "Méi", "Dën", "Mët", "Don", "Fre", "Sam"], MonthNames: ["Januar", "Februar", "Mäerz", "Abrëll", "Mee", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mäe", "Abr", "Mee", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	111: {LCID: 111, Name: "kl", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sapaat", "ataasinngorneq", "marlunngorneq", "pingasunngorneq", "sisamanngorneq", "tallimanngorneq", "arfininngorneq"], AbbreviatedDayNames: ["sap.", "at.", "marl.", "ping.", "sis.", "tall.", "arf."], MonthNames: ["januaari", "februaari", "marsi", "apriili", "maaji", "juuni", "juuli", "aggusti", "septembari", "oktobari", "novembari", "decembari", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: ["januaarip", "februaarip", "marsip", "apriilip", "maajip", "juunip", "juulip", "aggustip", "septembarip", "oktobarip", "novembarip", "decembarip", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	112: {LCID: 112, Name: "ig", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Mbọsị Ụka", "Mọnde", "Tiuzdee", "Wenezdee", "Tọọzdee", "Fraịdee", "Satọdee"], AbbreviatedDayNames: ["Ụka", "Mọn", "Tiu", "Wen", "Tọọ", "Fraị", "Sat"], MonthNames: ["Jenụwarị", "Febrụwarị", "Maachị", "Eprel", "Mee", "Juun", "Julaị", "Ọgọọst", "Septemba", "Ọktoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jen", "Feb", "Maa", "Epr", "Mee", "Juu", "Jul", "Ọgọ", "Sep", "Ọkt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "A.M.", PMDesignator: "P.M.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	113: {LCID: 113, Name: "kr", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	114: {LCID: 114, Name: "om", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Br", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dilbata", "Wiixata", "Qibxata", "Roobii", "Kamiisa", "Jimaata", "Sanbata"], AbbreviatedDayNames: ["Dil", "Wix", "Qib", "Rob", "Kam", "Jim", "San"], MonthNames: ["Amajjii", "Guraandhala", "Bitooteessa", "Elba", "Caamsa", "Waxabajjii", "Adooleessa", "Hagayya", "Fuulbana", "Onkololeessa", "Sadaasa", "Muddee", ""], AbbreviatedMonthNames: ["Ama", "Gur", "Bit", "Elb", "Cam", "Wax", "Ado", "Hag", "Ful", "Onk", "Sad", "Mud", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "WD", PMDesignator: "WB", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	115: {LCID: 115, Name: "ti", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Nfk", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"], AbbreviatedDayNames: ["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"], MonthNames: ["ጥሪ", "ለካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰነ", "ሓምለ", "ነሓሰ", "መስከረም", "ጥቅምቲ", "ሕዳር", "ታሕሳስ", ""], AbbreviatedMonthNames: ["ጥሪ", "ለካቲ", "መጋቢ", "ሚያዝ", "ግንቦ", "ሰነ", "ሓምለ", "ነሓሰ", "መስከ", "ጥቅም", "ሕዳር", "ታሕሳ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ንጉሆ ሰዓተ", PMDesignator: "ድሕር ሰዓት", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	116: {LCID: 116, Name: "gn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₲", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["arateĩ", "arakõi", "araapy", "ararundy", "arapo", "arapoteĩ", "arapokõi"], AbbreviatedDayNames: ["teĩ", "kõi", "apy", "ndy", "po", "oteĩ", "okõi"], MonthNames: ["jasyteĩ", "jasykõi", "jasyapy", "jasyrundy", "jasypo", "jasypoteĩ", "jasypokõi", "jasypoapy", "jasyporundy", "jasypa", "jasypateĩ", "jasypakõi", ""], AbbreviatedMonthNames: ["jteĩ", "jkõi", "japy", "jrun", "jpo", "jpot", "jpok", "jpoa", "jpor", "jpa", "jpat", "jpak", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	117: {LCID: 117, Name: "haw", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Lāpule", "Poʻakahi", "Poʻalua", "Poʻakolu", "Poʻahā", "Poʻalima", "Poʻaono"], AbbreviatedDayNames: ["LP", "P1", "P2", "P3", "P4", "P5", "P6"], MonthNames: ["Ianuali", "Pepeluali", "Malaki", "ʻApelila", "Mei", "Iune", "Iulai", "ʻAukake", "Kepakemapa", "ʻOkakopa", "Nowemapa", "Kekemapa", ""], AbbreviatedMonthNames: ["Ian.", "Pep.", "Mal.", "ʻAp.", "Mei", "Iun.", "Iul.", "ʻAu.", "Kep.", "ʻOk.", "Now.", "Kek.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	118: {LCID: 118, Name: "la", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "XDR", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Solis", "Lunae", "Martis", "Mercurii", "Jovis", "Veneris", "Saturni"], AbbreviatedDayNames: ["Sol", "Lun", "Mar", "Mer", "Jov", "Ven", "Sat"], MonthNames: ["Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius", "Quintilis", "Sextilis", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Quint", "Sext", "Sept", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	119: {LCID: 119, Name: "so", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "S", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Axad", "Isniin", "Talaado", "Arbaco", "Khamiis", "Jimco", "Sabti"], AbbreviatedDayNames: ["Axd", "Isn", "Tal", "Arb", "Kha", "Jim", "Sab"], MonthNames: ["Bisha Koobaad", "Bisha Labaad", "Bisha Saddexaad", "Bisha Afraad", "Bisha Shanaad", "Bisha Lixaad", "Bisha Todobaad", "Bisha Sideedaad", "Bisha Sagaalaad", "Bisha Tobnaad", "Bisha Kow iyo Tobnaad", "Bisha Laba iyo Tobnaad", ""], AbbreviatedMonthNames: ["Kob", "Lab", "Sad", "Afr", "Sha", "Lix", "Tod", "Sid", "Sag", "Tob", "KIT", "LIT", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "sn.", PMDesignator: "gn.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	120: {LCID: 120, Name: "ii", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ꑭꆏꑍ", "ꆏꊂ꒔", "ꆏꊂꑍ", "ꆏꊂꌕ", "ꆏꊂꇖ", "ꆏꊂꉬ", "ꆏꊂꃘ"], AbbreviatedDayNames: ["ꑭꆏ", "ꆏ꒔", "ꆏꑍ", "ꆏꌕ", "ꆏꇖ", "ꆏꉬ", "ꆏꃘ"], MonthNames: ["ꋍꆪ", "ꑍꆪ", "ꌕꆪ", "ꇖꆪ", "ꉬꆪ", "ꃘꆪ", "ꏃꆪ", "ꉆꆪ", "ꈬꆪ", "ꊰꆪ", "ꊯꊪꆪ", "ꊰꑋꆪ", ""], AbbreviatedMonthNames: ["ꋍꆪ", "ꑍꆪ", "ꌕꆪ", "ꇖꆪ", "ꉬꆪ", "ꃘꆪ", "ꏃꆪ", "ꉆꆪ", "ꈬꆪ", "ꊰꆪ", "ꊯꊪꆪ", "ꊰꑋꆪ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ꂵꆪꈌꈐ", PMDesignator: "ꂵꆪꈌꉈ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	121: {LCID: 121, Name: "pap", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["diadomingo", "dialuna", "diamars", "diawebs", "diarazon", "diabierna", "diasabra"], AbbreviatedDayNames: ["dom", "lun", "mar", "web", "raz", "bie", "sab"], MonthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "025"},
	122: {LCID: 122, Name: "arn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Kiñe Ante", "Epu Ante", "Kila Ante", "Meli Ante", "Kechu Ante", "Cayu Ante", "Regle Ante"], AbbreviatedDayNames: ["Kiñe", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle"], MonthNames: ["Kiñe Tripantu", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle", "Purha", "Aiya", "Marhi", "Marhi Kiñe", "Marhi Epu", ""], AbbreviatedMonthNames: ["Kiñe Tripantu", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle", "Purha", "Aiya", "Marhi", "Marhi Kiñe", "Marhi Epu", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	124: {LCID: 124, Name: "moh", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Awentatokentì:ke", "Awentataón'ke", "Ratironhia'kehronòn:ke", "Soséhne", "Okaristiiáhne", "Ronwaia'tanentaktonhne", "Entákta"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["Tsothohrkó:Wa", "Enniska", "Enniskó:Wa", "Onerahtókha", "Onerahtohkó:Wa", "Ohiari:Ha", "Ohiarihkó:Wa", "Seskéha", "Seskehkó:Wa", "Kenténha", "Kentenhkó:Wa", "Tsothóhrha", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	126: {LCID: 126, Name: "br", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sul", "Lun", "Meurzh", "Mercʼher", "Yaou", "Gwener", "Sadorn"], AbbreviatedDayNames: ["Sul", "Lun", "Meu.", "Mer.", "Yaou", "Gwe.", "Sad."], MonthNames: ["Genver", "Cʼhwevrer", "Meurzh", "Ebrel", "Mae", "Mezheven", "Gouere", "Eost", "Gwengolo", "Here", "Du", "Kerzu", ""], AbbreviatedMonthNames: ["Gen", "Cʼhwe", "Meur", "Ebr", "Mae", "Mezh", "Goue", "Eost", "Gwen", "Here", "Du", "Ker", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "A.M.", PMDesignator: "G.M.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	127: {LCID: 127, Name: "", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "¤", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "315"},
	128: {LCID: 128, Name: "ug", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["يەكشەنبە", "دۈشەنبە", "سەيشەنبە", "چارشەنبە", "پەيشەنبە", "جۈمە", "شەنبە"], AbbreviatedDayNames: ["يە", "دۈ", "سە", "چا", "پە", "جۈ", "شە"], MonthNames: ["يانۋار", "فېۋرال", "مارت", "ئاپرېل", "ماي", "ئىيۇن", "ئىيۇل", "ئاۋغۇست", "سېنتەبىر", "ئۆكتەبىر", "نويابىر", "دېكابىر", ""], AbbreviatedMonthNames: ["1-ئاي", "2-ئاي", "3-ئاي", "4-ئاي", "5-ئاي", "6-ئاي", "7-ئاي", "8-ئاي", "9-ئاي", "10-ئاي", "11-ئاي", "12-ئاي", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "چۈشتىن بۇرۇن", PMDesignator: "چۈشتىن كېيىن", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "520"},
	129: {LCID: 129, Name: "mi", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Rātapu", "Rāhina", "Rātū", "Rāapa", "Rāpare", "Rāmere", "Rāhoroi"], AbbreviatedDayNames: ["Ta", "Hi", "Tū", "Apa", "Pa", "Me", "Ho"], MonthNames: ["Kohitātea", "Huitanguru", "Poutūterangi", "Paengawhāwhā", "Haratua", "Pipiri", "Hōngongoi", "Hereturikōkā", "Mahuru", "Whiringa ā-nuku", "Whiringa ā-rangi", "Hakihea", ""], AbbreviatedMonthNames: ["Kohi", "Hui", "Pou", "Pae", "Hara", "Pipi", "Hōngo", "Here", "Mahu", "Nuku", "Rangi", "Haki", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	130: {LCID: 130, Name: "oc", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimenge", "diluns", "dimarts", "dimècres", "dijòus", "divendres", "dissabte"], AbbreviatedDayNames: ["dg.", "dl.", "dma.", "dmc.", "dj.", "dv.", "ds."], MonthNames: ["genièr", "febrièr", "març", "abril", "mai", "junh", "julhet", "agost", "setembre", "octobre", "novembre", "decembre", ""], AbbreviatedMonthNames: ["gen.", "feb.", "març", "abr.", "mai", "junh", "julh", "ag.", "set.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: ["de genièr", "de febrièr", "de març", "d'abril", "de mai", "de junh", "de julhet", "d'agost", "de setembre", "d'octobre", "de novembre", "de decembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ".", ShortDatePattern: "135"},
	131: {LCID: 131, Name: "co", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dumenica", "luni", "marti", "mercuri", "ghjovi", "venneri", "sabbatu"], AbbreviatedDayNames: ["dum.", "lun.", "mar.", "mer.", "ghj.", "ven.", "sab."], MonthNames: ["ghjennaghju", "ferraghju", "marzu", "aprile", "maghju", "ghjunghju", "lugliu", "aostu", "settembre", "ottobre", "nuvembre", "dicembre", ""], AbbreviatedMonthNames: ["ghje", "ferr", "marz", "apri", "magh", "ghju", "lugl", "aost", "sett", "otto", "nuve", "dice", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	132: {LCID: 132, Name: "gsw", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sundi", "Manti", "Zischti", "Mettwuch", "Dunnerschti", "Friti", "Sàmschti"], AbbreviatedDayNames: ["Su.", "Ma.", "Zi.", "Me.", "Du.", "Fr.", "Sà."], MonthNames: ["Jänner", "Feverje", "März", "Àpril", "Mai", "Jüni", "Jüli", "Augscht", "September", "Oktower", "Nowember", "Dezember", ""], AbbreviatedMonthNames: ["Jän.", "Fev.", "März", "Apr.", "Mai", "Jüni", "Jüli", "Aug.", "Sept.", "Okt.", "Now.", "Dez.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	133: {LCID: 133, Name: "sah", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Өрөбүл", "энидиэнньик", "Оптуорунньук", "Сэрэдээ", "Чэппиэр", "Бээтинсэ", "Субуота"], AbbreviatedDayNames: ["Өр", "Бн", "Оп", "Ср", "Чп", "Бт", "Сб"], MonthNames: ["Тохсунньу", "Олунньу", "Кулун тутар", "Муус устар", "Ыам ыйа", "Бэс ыйа", "От ыйа", "Атырдьах ыйа", "Балаҕан ыйа", "Алтынньы", "Сэтинньи", "Ахсынньы", ""], AbbreviatedMonthNames: ["Тхс", "Олн", "Клн", "Мсу", "Ыам", "Бэс", "Оты", "Атр", "Блҕ", "Алт", "Сэт", "Ахс", ""], MonthGenitiveNames: ["тохсунньу", "олунньу", "кулун тутар", "муус устар", "ыам ыйын", "бэс ыйын", "от ыйын", "атырдьах ыйын", "балаҕан ыйын", "алтынньы", "сэтинньи", "ахсынньы", ""], AbbreviatedMonthGenitiveNames: ["тхс", "олн", "клн", "мсу", "ыам", "бэс", "оты", "атр", "блҕ", "алт", "сэт", "ахс", ""], AMDesignator: "КИ", PMDesignator: "КК", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	134: {LCID: 134, Name: "quc", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "Q", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["juq'ij", "kaq'ij", "oxq'ij", "kajq'ij", "joq'ij", "waqq'ij", "wuqq'ij"], AbbreviatedDayNames: ["juq'", "kaq'", "oxq'", "kajq'", "joq'", "waqq'", "wuqq'"], MonthNames: ["nab'e ik'", "ukab' ik'", "urox ik'", "ukaj ik'", "uro ik'", "uwaq ik'", "uwuq ik'", "uwajxaq ik'", "ub'elej ik'", "ulaj ik'", "ujulaj ik'", "ukab'laj ik'", ""], AbbreviatedMonthNames: ["nab'e", "ukab'", "urox", "ukaj", "uro", "uwaq", "uwuq", "uwajxaq", "ub'elej", "ulaj", "ujulaj", "ukab'laj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	135: {LCID: 135, Name: "rw", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "RF", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Ku cyumweru", "Kuwa mbere", "Kuwa kabiri", "Kuwa gatatu", "Kuwa kane", "Kuwa gatanu", "Kuwa gatandatu"], AbbreviatedDayNames: ["cyu.", "mbe.", "kab.", "gtu.", "kan.", "gnu.", "gnd."], MonthNames: ["Mutarama", "Gashyantare", "Werurwe", "Mata", "Gicuransi", "Kamena", "Nyakanga", "Kanama", "Nzeli", "Ukwakira", "Ugushyingo", "Ukuboza", ""], AbbreviatedMonthNames: ["mut.", "gas.", "wer.", "mat.", "gic.", "kam.", "nya.", "kan.", "nze.", "ukw.", "ugu.", "uku.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	136: {LCID: 136, Name: "wo", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Dibéer", "Altine", "Talaata", "Àllarba", "Alxames", "Àjjuma", "Gaawu"], AbbreviatedDayNames: ["Dib.", "Alt.", "Tal.", "Àll.", "Alx.", "Àjj.", "Gaa."], MonthNames: ["Samwiye", "Fewriye", "Maars", "Awril", "Me", "Suwe", "Sullet", "Ut", "Septàmbar", "Oktoobar", "Noowàmbar", "Desàmbar", ""], AbbreviatedMonthNames: ["Sam.", "Few.", "Maa", "Awr.", "Me", "Suw", "Sul.", "Ut", "Sept.", "Okt.", "Now.", "Des.", ""], MonthGenitiveNames: ["Samwiye", "Fewriye", "Maars", "Awril", "Me", "Suwe", "Sullet", "Ut", "Septàmbar", "Oktoobar", "Noowàmbar", "Deesàmbar", ""], AbbreviatedMonthGenitiveNames: ["Sam.", "Few.", "Maa", "Awr.", "Me", "Suwe", "Sul.", "Ut", "Sept.", "Okt.", "Noow.", "Des.", ""], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	140: {LCID: 140, Name: "prs", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "؋", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["یکشنبه", "دوشنبه", "سه‌ شنبه", "چهار شنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["یکشنبه", "دوشنبه", "سه‌ شنبه", "چهار شنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت", ""], AbbreviatedMonthNames: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "غ.م", PMDesignator: "غ.و", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	145: {LCID: 145, Name: "gd", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "£", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["DiDòmhnaich", "DiLuain", "DiMàirt", "DiCiadain", "DiarDaoin", "DihAoine", "DiSathairne"], AbbreviatedDayNames: ["DiD", "DiL", "DiM", "DiC", "Dia", "Dih", "DiS"], MonthNames: ["Am Faoilleach", "An Gearran", "Am Màrt", "An Giblean", "An Cèitean", "An t-Ògmhios", "An t-Iuchar", "An Lùnastal", "An t-Sultain", "An Dàmhair", "An t-Samhain", "An Dùbhlachd", ""], AbbreviatedMonthNames: ["Faoi", "Gearr", "Màrt", "Gibl", "Cèit", "Ògmh", "Iuch", "Lùna", "Sult", "Dàmh", "Samh", "Dùbh", ""], MonthGenitiveNames: ["dhen Fhaoilleach", "dhen Ghearran", "dhen Mhàrt", "dhen Ghiblean", "dhen Chèitean", "dhen Ògmhios", "dhen Iuchar", "dhen Lùnastal", "dhen t-Sultain", "dhen Dàmhair", "dhen t-Samhain", "dhen Dùbhlachd", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "m", PMDesignator: "f", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	146: {LCID: 146, Name: "ku", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "د.ع.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], AbbreviatedDayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], MonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], AbbreviatedMonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "پ.ن", PMDesignator: "د.ن", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	1025: {LCID: 1025, Name: "ar-SA", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ر.س.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة", ""], AbbreviatedMonthNames: ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأولى", "جمادى الثانية", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	1026: {LCID: 1026, Name: "bg-BG", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "лв.", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"], AbbreviatedDayNames: ["нед", "пон", "вт", "ср", "четв", "пет", "съб"], MonthNames: ["януари", "февруари", "март", "април", "май", "юни", "юли", "август", "септември", "октомври", "ноември", "декември", ""], AbbreviatedMonthNames: ["яну", "фев", "мар", "апр", "май", "юни", "юли", "авг", "сеп", "окт", "ное", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	1027: {LCID: 1027, Name: "ca-ES", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], AbbreviatedDayNames: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."], MonthNames: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre", ""], AbbreviatedMonthNames: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des.", ""], MonthGenitiveNames: ["de gener", "de febrer", "de març", "d’abril", "de maig", "de juny", "de juliol", "d’agost", "de setembre", "d’octubre", "de novembre", "de desembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1028: {LCID: 1028, Name: "zh-TW", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "NT$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	1029: {LCID: 1029, Name: "cs-CZ", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Kč", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"], AbbreviatedDayNames: ["ne", "po", "út", "st", "čt", "pá", "so"], MonthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec", ""], AbbreviatedMonthNames: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro", ""], MonthGenitiveNames: ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "dop.", PMDesignator: "odp.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1030: {LCID: 1030, Name: "da-DK", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"], AbbreviatedDayNames: ["sø", "ma", "ti", "on", "to", "fr", "lø"], MonthNames: ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1031: {LCID: 1031, Name: "de-DE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], MonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1032: {LCID: 1032, Name: "el-GR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"], AbbreviatedDayNames: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"], MonthNames: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος", ""], AbbreviatedMonthNames: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ", ""], MonthGenitiveNames: ["Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου", "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "πμ", PMDesignator: "μμ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1033: {LCID: 1033, Name: "en-US", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1035: {LCID: 1035, Name: "fi-FI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sunnuntaina", "maanantaina", "tiistaina", "keskiviikkona", "torstaina", "perjantaina", "lauantaina"], AbbreviatedDayNames: ["su", "ma", "ti", "ke", "to", "pe", "la"], MonthNames: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu", ""], AbbreviatedMonthNames: ["tammi", "helmi", "maalis", "huhti", "touko", "kesä", "heinä", "elo", "syys", "loka", "marras", "joulu", ""], MonthGenitiveNames: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta", ""], AbbreviatedMonthGenitiveNames: ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta", ""], AMDesignator: "ap.", PMDesignator: "ip.", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	1036: {LCID: 1036, Name: "fr-FR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1037: {LCID: 1037, Name: "he-IL", CurrencyPositivePattern: 2, CurrencyNegativePattern: 2, CurrencySymbol: "₪", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת"], AbbreviatedDayNames: ["יום א", "יום ב", "יום ג", "יום ד", "יום ה", "יום ו", "שבת"], MonthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר", ""], AbbreviatedMonthNames: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1038: {LCID: 1038, Name: "hu-HU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "HUF", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"], AbbreviatedDayNames: ["V", "H", "K", "Sze", "Cs", "P", "Szo"], MonthNames: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december", ""], AbbreviatedMonthNames: ["jan.", "febr.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "de.", PMDesignator: "du.", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "531"},
	1039: {LCID: 1039, Name: "is-IS", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ISK", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sunnudagur", "mánudagur", "þriðjudagur", "miðvikudagur", "fimmtudagur", "föstudagur", "laugardagur"], AbbreviatedDayNames: ["sun.", "mán.", "þri.", "mið.", "fim.", "fös.", "lau."], MonthNames: ["janúar", "febrúar", "mars", "apríl", "maí", "júní", "júlí", "ágúst", "september", "október", "nóvember", "desember", ""], AbbreviatedMonthNames: ["jan.", "feb.", "mar.", "apr.", "maí", "jún.", "júl.", "ágú.", "sep.", "okt.", "nóv.", "des.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "f.h.", PMDesignator: "e.h.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	1040: {LCID: 1040, Name: "it-IT", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"], AbbreviatedDayNames: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], MonthNames: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre", ""], AbbreviatedMonthNames: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1041: {LCID: 1041, Name: "ja-JP", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"], AbbreviatedDayNames: ["日", "月", "火", "水", "木", "金", "土"], MonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""], AbbreviatedMonthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "午前", PMDesignator: "午後", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	1042: {LCID: 1042, Name: "ko-KR", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₩", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"], AbbreviatedDayNames: ["일", "월", "화", "수", "목", "금", "토"], MonthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", ""], AbbreviatedMonthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "오전", PMDesignator: "오후", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1043: {LCID: 1043, Name: "nl-NL", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"], AbbreviatedDayNames: ["zo", "ma", "di", "wo", "do", "vr", "za"], MonthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "025"},
	1044: {LCID: 1044, Name: "nb-NO", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"], AbbreviatedDayNames: ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."], MonthNames: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mar.", "apr.", "mai", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "135"},
	1045: {LCID: 1045, Name: "pl-PL", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "zł", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"], AbbreviatedDayNames: ["niedz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."], MonthNames: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień", ""], AbbreviatedMonthNames: ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru", ""], MonthGenitiveNames: ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1046: {LCID: 1046, Name: "pt-BR", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "R$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"], AbbreviatedDayNames: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"], MonthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", ""], AbbreviatedMonthNames: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1047: {LCID: 1047, Name: "rm-CH", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: "’", NumberGroupSizes: [3], DayNames: ["dumengia", "glindesdi", "mardi", "mesemna", "gievgia", "venderdi", "sonda"], AbbreviatedDayNames: ["du", "gli", "ma", "me", "gie", "ve", "so"], MonthNames: ["schaner", "favrer", "mars", "avrigl", "matg", "zercladur", "fanadur", "avust", "settember", "october", "november", "december", ""], AbbreviatedMonthNames: ["schan.", "favr.", "mars", "avr.", "matg", "zercl.", "fan.", "avust", "sett.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "am", PMDesignator: "sm", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1048: {LCID: 1048, Name: "ro-RO", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "RON", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"], AbbreviatedDayNames: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"], MonthNames: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie", ""], AbbreviatedMonthNames: ["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1049: {LCID: 1049, Name: "ru-RU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], AbbreviatedDayNames: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря", ""], AbbreviatedMonthGenitiveNames: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1050: {LCID: 1050, Name: "hr-HR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kn", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac", ""], AbbreviatedMonthNames: ["sij", "vlj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro", ""], MonthGenitiveNames: ["siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenog", "prosinca", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	1051: {LCID: 1051, Name: "sk-SK", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"], AbbreviatedDayNames: ["ne", "po", "ut", "st", "št", "pi", "so"], MonthNames: ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "dopoludnia", PMDesignator: "odpoludnia", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1052: {LCID: 1052, Name: "sq-AL", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Lekë", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"], AbbreviatedDayNames: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"], MonthNames: ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor", ""], AbbreviatedMonthNames: ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gsh", "Sht", "Tet", "Nën", "Dhj", ""], MonthGenitiveNames: ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "paradite", PMDesignator: "pasdite", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	1053: {LCID: 1053, Name: "sv-SE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"], AbbreviatedDayNames: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"], MonthNames: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1054: {LCID: 1054, Name: "th-TH", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "฿", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"], AbbreviatedDayNames: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."], MonthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม", ""], AbbreviatedMonthNames: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1055: {LCID: 1055, Name: "tr-TR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₺", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"], AbbreviatedDayNames: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"], MonthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık", ""], AbbreviatedMonthNames: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ÖÖ", PMDesignator: "ÖS", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "035"},
	1056: {LCID: 1056, Name: "ur-PK", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["اتوار", "پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته"], AbbreviatedDayNames: ["اتوار", "پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته"], MonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1057: {LCID: 1057, Name: "id-ID", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Rp", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"], AbbreviatedDayNames: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], MonthNames: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ".", ShortDatePattern: "135"},
	1058: {LCID: 1058, Name: "uk-UA", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "₴", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["неділя", "понеділок", "вівторок", "середа", "четвер", "п'ятниця", "субота"], AbbreviatedDayNames: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], MonthNames: ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень", ""], AbbreviatedMonthNames: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру", ""], MonthGenitiveNames: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня", ""], AbbreviatedMonthGenitiveNames: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1059: {LCID: 1059, Name: "be-BY", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "Br", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["нядзеля", "панядзелак", "аўторак", "серада", "чацвер", "пятніца", "субота"], AbbreviatedDayNames: ["нд", "пн", "аўт", "ср", "чц", "пт", "сб"], MonthNames: ["студзень", "люты", "сакавік", "красавік", "май", "чэрвень", "ліпень", "жнівень", "верасень", "кастрычнік", "лістапад", "снежань", ""], AbbreviatedMonthNames: ["студз", "лют", "сак", "крас", "май", "чэрв", "ліп", "жн", "вер", "кастр", "ліст", "снеж", ""], MonthGenitiveNames: ["студзеня", "лютага", "сакавіка", "красавіка", "мая", "чэрвеня", "ліпеня", "жніўня", "верасня", "кастрычніка", "лістапада", "снежня", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	1060: {LCID: 1060, Name: "sl-SI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"], AbbreviatedDayNames: ["ned.", "pon.", "tor.", "sre.", "čet.", "pet.", "sob."], MonthNames: ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "avg.", "sep.", "okt.", "nov.", "dec.", ""], AMDesignator: "dop.", PMDesignator: "pop.", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "035"},
	1061: {LCID: 1061, Name: "et-EE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"], AbbreviatedDayNames: ["P", "E", "T", "K", "N", "R", "L"], MonthNames: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember", ""], AbbreviatedMonthNames: ["jaan", "veebr", "märts", "apr", "mai", "juuni", "juuli", "aug", "sept", "okt", "nov", "dets", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "e.k.", PMDesignator: "p.k.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1062: {LCID: 1062, Name: "lv-LV", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["svētdiena", "pirmdiena", "otrdiena", "trešdiena", "ceturtdiena", "piektdiena", "sestdiena"], AbbreviatedDayNames: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "Se"], MonthNames: ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris", ""], AbbreviatedMonthNames: ["Janv.", "Febr.", "Marts", "Apr.", "Maijs", "Jūn.", "Jūl.", "Aug.", "Sept.", "Okt.", "Nov.", "Dec.", ""], MonthGenitiveNames: ["janvāris", "februāris", "marts", "aprīlis", "maijs", "jūnijs", "jūlijs", "augusts", "septembris", "oktobris", "novembris", "decembris", ""], AbbreviatedMonthGenitiveNames: ["janv.", "febr.", "marts", "apr.", "maijs", "jūn.", "jūl.", "aug.", "sept.", "okt.", "nov.", "dec.", ""], AMDesignator: "priekšpusdienā", PMDesignator: "pēcpusdienā", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1063: {LCID: 1063, Name: "lt-LT", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis"], AbbreviatedDayNames: ["sk", "pr", "an", "tr", "kt", "pn", "št"], MonthNames: ["sausis", "vasaris", "kovas", "balandis", "gegužė", "birželis", "liepa", "rugpjūtis", "rugsėjis", "spalis", "lapkritis", "gruodis", ""], AbbreviatedMonthNames: ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod.", ""], MonthGenitiveNames: ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pr.p.", PMDesignator: "pop.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1064: {LCID: 1064, Name: "tg-Cyrl-TJ", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "смн", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшанбе", "душанбе", "сешанбе", "чоршанбе", "панҷшанбе", "ҷумъа", "шанбе"], AbbreviatedDayNames: ["пкш", "дшб", "сшб", "чшб", "пшб", "ҷум", "шнб"], MonthNames: ["январ", "феврал", "март", "апрел", "май", "июн", "июл", "август", "сентябр", "октябр", "ноябр", "декабр", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1065: {LCID: 1065, Name: "fa-IR", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "ريال", NumberDecimalSeparator: "/", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["يكشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", ""], AbbreviatedMonthNames: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ق.ظ", PMDesignator: "ب.ظ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1066: {LCID: 1066, Name: "vi-VN", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₫", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"], AbbreviatedDayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"], MonthNames: ["Tháng Giêng", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu", "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai", ""], AbbreviatedMonthNames: ["Thg1", "Thg2", "Thg3", "Thg4", "Thg5", "Thg6", "Thg7", "Thg8", "Thg9", "Thg10", "Thg11", "Thg12", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "SA", PMDesignator: "CH", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1067: {LCID: 1067, Name: "hy-AM", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "֏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաբթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"], AbbreviatedDayNames: ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուր", "Շբթ"], MonthNames: ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր", ""], AbbreviatedMonthNames: ["Հնվ", "Փտվ", "Մրտ", "Ապր", "Մյս", "Հնս", "Հլս", "Օգս", "Սպտ", "Հկտ", "Նյմ", "Դկտ", ""], MonthGenitiveNames: ["հունվարի", "փետրվարի", "մարտի", "ապրիլի", "մայիսի", "հունիսի", "հուլիսի", "օգոստոսի", "սեպտեմբերի", "հոկտեմբերի", "նոյեմբերի", "դեկտեմբերի", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1068: {LCID: 1068, Name: "az-Latn-AZ", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₼", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["bazar", "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə"], AbbreviatedDayNames: ["B.", "B.E.", "Ç.A.", "Ç.", "C.A.", "C.", "Ş."], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avq", "sen", "okt", "noy", "dek", ""], MonthGenitiveNames: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1069: {LCID: 1069, Name: "eu-ES", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["igandea", "astelehena", "asteartea", "asteazkena", "osteguna", "ostirala", "larunbata"], AbbreviatedDayNames: ["ig.", "al.", "ar.", "az.", "og.", "or.", "lr."], MonthNames: ["Urtarrila", "Otsaila", "Martxoa", "Apirila", "Maiatza", "Ekaina", "Uztaila", "Abuztua", "Iraila", "Urria", "Azaroa", "Abendua", ""], AbbreviatedMonthNames: ["Urt.", "Ots.", "Mar.", "Api.", "Mai.", "Eka.", "Uzt.", "Abu.", "Ira.", "Urr.", "Aza.", "Abe.", ""], MonthGenitiveNames: ["urtarrilak", "otsailak", "martxoak", "apirilak", "maiatzak", "ekainak", "uztailak", "abuztuak", "irailak", "urriak", "azaroak", "abenduak", ""], AbbreviatedMonthGenitiveNames: ["urt.", "ots.", "mar.", "api.", "mai.", "eka.", "uzt.", "abu.", "ira.", "urr.", "aza.", "abe.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	1070: {LCID: 1070, Name: "hsb-DE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["njedźela", "póndźela", "wutora", "srjeda", "štwórtk", "pjatk", "sobota"], AbbreviatedDayNames: ["nje", "pón", "wut", "srj", "štw", "pja", "sob"], MonthNames: ["januar", "februar", "měrc", "apryl", "meja", "junij", "julij", "awgust", "september", "oktober", "nowember", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "měr", "apr", "mej", "jun", "jul", "awg", "sep", "okt", "now", "dec", ""], MonthGenitiveNames: ["januara", "februara", "měrca", "apryla", "meje", "junija", "julija", "awgusta", "septembra", "oktobra", "nowembra", "decembra", ""], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "měr.", "apr.", "mej.", "jun.", "jul.", "awg.", "sep.", "okt.", "now.", "dec.", ""], AMDesignator: "dopołdnja", PMDesignator: "popołdnju", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	1071: {LCID: 1071, Name: "mk-MK", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "ден", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"], AbbreviatedDayNames: ["нед.", "пон.", "вт.", "сре.", "чет.", "пет.", "саб."], MonthNames: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември", ""], AbbreviatedMonthNames: ["јан.", "фев.", "мар.", "апр.", "мај", "јун.", "јул.", "авг.", "септ.", "окт.", "ноем.", "дек.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "претпладне", PMDesignator: "попладне", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "125"},
	1072: {LCID: 1072, Name: "st-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sontaha", "Mmantaha", "Labobedi", "Laboraru", "Labone", "Labohlane", "Moqebelo"], AbbreviatedDayNames: ["Son", "Mma", "Bed", "Rar", "Ne", "Hla", "Moq"], MonthNames: ["Phesekgong", "Hlakola", "Hlakubele", "Mmese", "Motsheanong", "Phupjane", "Phupu", "Phata", "Leotshe", "Mphalane", "Pundungwane", "Tshitwe", ""], AbbreviatedMonthNames: ["Phe", "Kol", "Ube", "Mme", "Mot", "Jan", "Upu", "Pha", "Leo", "Mph", "Pun", "Tsh", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1073: {LCID: 1073, Name: "ts-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sonto", "Musumbhunuku", "Ravumbirhi", "Ravunharhu", "Ravumune", "Ravuntlhanu", "Mugqivela"], AbbreviatedDayNames: ["Son", "Mus", "Bir", "Har", "Ne", "Tlh", "Mug"], MonthNames: ["Sunguti", "Nyenyenyani", "Nyenyankulu", "Dzivamisoko", "Mudyaxihi", "Khotavuxika", "Mawuwani", "Mhawuri", "Ndzhati", "Nhlangula", "Hukuri", "N’wendzamhala", ""], AbbreviatedMonthNames: ["Sun", "Yan", "Kul", "Dzi", "Mud", "Kho", "Maw", "Mha", "Ndz", "Nhl", "Huk", "N’w", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1074: {LCID: 1074, Name: "tn-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Tshipi", "Mosopulogo", "Labobedi", "Laboraro", "Labone", "Labotlhano", "Matlhatso"], AbbreviatedDayNames: ["Tsh", "Mos", "Bed", "Rar", "Ne", "Tla", "Mat"], MonthNames: ["Ferikgong", "Tlhakole", "Mopitlo", "Moranang", "Motsheganang", "Seetebosigo", "Phukwi", "Phatwe", "Lwetse", "Diphalane", "Ngwanatsele", "Sedimonthole", ""], AbbreviatedMonthNames: ["Fer", "Tlh", "Mop", "Mor", "Mot", "See", "Phu", "Pha", "Lwe", "Dip", "Ngw", "Sed", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1075: {LCID: 1075, Name: "ve-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Swondaha", "Musumbuluwo", "Ḽavhuvhili", "Ḽavhuraru", "Ḽavhuṋa", "Ḽavhuṱanu", "Mugivhela"], AbbreviatedDayNames: ["Swo", "Mus", "Vhi", "Rar", "Ṋa", "Ṱan", "Mug"], MonthNames: ["Phando", "Luhuhi", "Ṱhafamuhwe", "Lambamai", "Shundunthule", "Fulwi", "Fulwana", "Ṱhangule", "Khubvumedzi", "Tshimedzi", "Ḽara", "Nyendavhusiku", ""], AbbreviatedMonthNames: ["Pha", "Luh", "Ṱhf", "Lam", "Shu", "Lwi", "Lwa", "Ṱha", "Khu", "Tsh", "Ḽar", "Nye", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1076: {LCID: 1076, Name: "xh-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Cawe", "Mvulo", "Lwesibini", "Lwesithathu", "Lwesine", "Lwesihlanu", "Mgqibelo"], AbbreviatedDayNames: ["Caw", "Mvu", "Bin", "Tha", "Sin", "Hla", "Mgq"], MonthNames: ["Janyuwari", "Februwari", "Matshi", "Epreli", "Meyi", "Juni", "Julayi", "Agasti", "Septemba", "Okthoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mat", "Epr", "Mey", "Jun", "Jul", "Aga", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1077: {LCID: 1077, Name: "zu-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sonto", "Msombuluko", "Lwesibili", "Lwesithathu", "Lwesine", "Lwesihlanu", "Mgqibelo"], AbbreviatedDayNames: ["Son", "Mso", "Bil", "Tha", "Sin", "Hla", "Mgq"], MonthNames: ["Januwari", "Februwari", "Mashi", "Apreli", "Meyi", "Juni", "Julayi", "Agasti", "Septhemba", "Okthoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mas", "Apr", "Mey", "Jun", "Jul", "Aga", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1078: {LCID: 1078, Name: "af-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrydag", "Saterdag"], AbbreviatedDayNames: ["So", "Ma", "Di", "Wo", "Do", "Vr", "Sa"], MonthNames: ["Januarie", "Februarie", "Maart", "April", "Mei", "Junie", "Julie", "Augustus", "September", "Oktober", "November", "Desember", ""], AbbreviatedMonthNames: ["Jan.", "Feb.", "Mrt.", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "vm.", PMDesignator: "nm.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1079: {LCID: 1079, Name: "ka-GE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₾", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["კვირა", "ორშაბათი", "სამშაბათი", "ოთხშაბათი", "ხუთშაბათი", "პარასკევი", "შაბათი"], AbbreviatedDayNames: ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"], MonthNames: ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი", ""], AbbreviatedMonthNames: ["იან", "თებ", "მარ", "აპრ", "მაი", "ივნ", "ივლ", "აგვ", "სექ", "ოქტ", "ნოე", "დეკ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1080: {LCID: 1080, Name: "fo-FO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sunnudagur", "mánadagur", "týsdagur", "mikudagur", "hósdagur", "fríggjadagur", "leygardagur"], AbbreviatedDayNames: ["sun", "mán", "týs", "mik", "hós", "frí", "ley"], MonthNames: ["januar", "februar", "mars", "apríl", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "um fyr.", PMDesignator: "um sein.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1081: {LCID: 1081, Name: "hi-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["रवि.", "सोम.", "मंगल.", "बुध.", "गुरु.", "शुक्र.", "शनि."], MonthNames: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्तूबर", "नवम्बर", "दिसम्बर", ""], AbbreviatedMonthNames: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्तूबर", "नवम्बर", "दिसम्बर", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "पूर्वाह्न", PMDesignator: "अपराह्न", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1082: {LCID: 1082, Name: "mt-MT", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Il-Ħadd", "It-Tnejn", "It-Tlieta", "L-Erbgħa", "Il-Ħamis", "Il-Ġimgħa", "Is-Sibt"], AbbreviatedDayNames: ["Ħad", "Tne", "Tli", "Erb", "Ħam", "Ġim", "Sib"], MonthNames: ["Jannar", "Frar", "Marzu", "April", "Mejju", "Ġunju", "Lulju", "Awwissu", "Settembru", "Ottubru", "Novembru", "Diċembru", ""], AbbreviatedMonthNames: ["Jan", "Fra", "Mar", "Apr", "Mej", "Ġun", "Lul", "Aww", "Set", "Ott", "Nov", "Diċ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1083: {LCID: 1083, Name: "se-NO", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sotnabeaivi", "vuossárga", "maŋŋebárga", "gaskavahkku", "duorasdat", "bearjadat", "lávvardat"], AbbreviatedDayNames: ["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"], MonthNames: ["ođđajagemánnu", "guovvamánnu", "njukčamánnu", "cuoŋománnu", "miessemánnu", "geassemánnu", "suoidnemánnu", "borgemánnu", "čakčamánnu", "golggotmánnu", "skábmamánnu", "juovlamánnu", ""], AbbreviatedMonthNames: ["ođđj", "guov", "njuk", "cuo", "mies", "geas", "suoi", "borg", "čakč", "golg", "skáb", "juov", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "i.b.", PMDesignator: "e.b.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1085: {LCID: 1085, Name: "yi-001", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "XDR", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["זונטיק", "מאָנטיק", "דינסטיק", "מיטוואך", "דאנערשטיק", "פֿרײַטיק", "שבת"], AbbreviatedDayNames: ["זונטיק", "מאָנטיק", "דינסטיק", "מיטוואך", "דאנערשטיק", "פֿרײַטיק", "שבת"], MonthNames: ["יאַנואַר", "פֿעברואַר", "מערץ", "אַפּריל", "מיי", "יוני", "יולי", "אויגוסט", "סעפּטעמבער", "אקטאבער", "נאוועמבער", "דעצעמבער", ""], AbbreviatedMonthNames: ["יאַנ", "פֿעב", "מערץ", "אַפּר", "מיי", "יוני", "יולי", "אויגוסט", "סעפּ", "אקט", "נאוו", "דעצ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["יאַנואַר", "פֿעברואַר", "מערץ", "אַפּריל", "מיי", "יוני", "יולי", "אויגוסט", "סעפּטעמבער", "אקטאבער", "נאוועמבער", "דעצעמבער", ""], AMDesignator: "פארמיטאג", PMDesignator: "נאכמיטאג", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1086: {LCID: 1086, Name: "ms-MY", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "RM", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"], AbbreviatedDayNames: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"], MonthNames: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pg", PMDesignator: "ptg", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	1087: {LCID: 1087, Name: "kk-KZ", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₸", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["жексенбі", "дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі"], AbbreviatedDayNames: ["жек", "дүй", "сей", "сәр", "бей", "жұма", "сен"], MonthNames: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан", ""], AbbreviatedMonthNames: ["қаң.", "ақп.", "нау.", "сәу.", "мам.", "мау.", "шіл.", "там.", "қыр.", "қаз.", "қар.", "желт.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "таңертеңгі", PMDesignator: "түстен кейінгі", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1088: {LCID: 1088, Name: "ky-KG", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "сом", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби"], AbbreviatedDayNames: ["Жш", "Дш", "Шш", "Шр", "Бш", "Жм", "Иш"], MonthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthGenitiveNames: ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек.", ""], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "034"},
	1089: {LCID: 1089, Name: "sw-KE", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Ksh", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"], AbbreviatedDayNames: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi"], MonthNames: ["Januari", "Februari", "Machi", "Aprili", "Mei", "Juni", "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1090: {LCID: 1090, Name: "tk-TM", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "m.", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Ýekşenbe", "Duşenbe", "Sişenbe", "Çarşenbe", "Penşenbe", "Anna", "Şenbe"], AbbreviatedDayNames: ["Ýb", "Db", "Sb", "Çb", "Pb", "An", "Şb"], MonthNames: ["Ýanwar", "Fewral", "Mart", "Aprel", "Maý", "lýun", "lýul", "Awgust", "Sentýabr", "Oktýabr", "Noýabr", "Dekabr", ""], AbbreviatedMonthNames: ["Ýan", "Few", "Mart", "Apr", "Maý", "lýun", "lýul", "Awg", "Sen", "Okt", "Noý", "Dek", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	1091: {LCID: 1091, Name: "uz-Latn-UZ", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "soʻm", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], AbbreviatedDayNames: ["Yaksh", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["Yanv", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noya", "Dek", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "TO", PMDesignator: "TK", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	1092: {LCID: 1092, Name: "tt-RU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшәмбе", "дүшәмбе", "сишәмбе", "чәршәмбе", "пәнҗешәмбе", "җомга", "шимбә"], AbbreviatedDayNames: ["якш.", "дүш.", "сиш.", "чәрш.", "пәнҗ.", "җом.", "шим."], MonthNames: ["гыйнвар", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthNames: ["гыйн.", "фев.", "мар.", "апр.", "май", "июнь", "июль", "авг.", "сен.", "окт.", "нояб.", "дек.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1093: {LCID: 1093, Name: "bn-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"], AbbreviatedDayNames: ["রবি.", "সোম.", "মঙ্গল.", "বুধ.", "বৃহস্পতি.", "শুক্র.", "শনি."], MonthNames: ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর", ""], AbbreviatedMonthNames: ["জানু.", "ফেব্রু.", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগ.", "সেপ্টে.", "অক্টো.", "নভে.", "ডিসে.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	1094: {LCID: 1094, Name: "pa-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨਿੱਚਰਵਾਰ"], AbbreviatedDayNames: ["ਐਤ.", "ਸੋਮ.", "ਮੰਗਲ.", "ਬੁੱਧ.", "ਵੀਰ.", "ਸ਼ੁਕਰ.", "ਸ਼ਨਿੱਚਰ."], MonthNames: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ", ""], AbbreviatedMonthNames: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ਸਵੇਰ", PMDesignator: "ਸ਼ਾਮ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	1095: {LCID: 1095, Name: "gu-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"], AbbreviatedDayNames: ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"], MonthNames: ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટેમ્બર", "ઑક્ટોબર", "નવેમ્બર", "ડિસેમ્બર", ""], AbbreviatedMonthNames: ["જાન્યુ", "ફેબ્રુ", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગ", "સપ્ટે", "ઑક્ટો", "નવે", "ડિસે", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "પૂર્વ મધ્યાહ્ન", PMDesignator: "ઉત્તર મધ્યાહ્ન", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	1096: {LCID: 1096, Name: "or-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ରବିବାର", "ସୋମବାର", "ମଙ୍ଗଳବାର", "ବୁଧବାର", "ଗୁରୁବାର", "ଶୁକ୍ରବାର", "ଶନିବାର"], AbbreviatedDayNames: ["ରବି.", "ସୋମ.", "ମଙ୍ଗଳ.", "ବୁଧ.", "ଗୁରୁ.", "ଶୁକ୍ର.", "ଶନି."], MonthNames: ["ଜାନୁୟାରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ୍‌", "ମେ", "ଜୁନ୍‌", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର", ""], AbbreviatedMonthNames: ["ଜାନୁୟାରୀ", "ଫେବୃଆରୀ", "ମାର୍ଚ୍ଚ", "ଏପ୍ରିଲ୍‌", "ମେ", "ଜୁନ୍‌", "ଜୁଲାଇ", "ଅଗଷ୍ଟ", "ସେପ୍ଟେମ୍ବର", "ଅକ୍ଟୋବର", "ନଭେମ୍ବର", "ଡିସେମ୍ବର", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	1097: {LCID: 1097, Name: "ta-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ஞாயிற்றுக்கிழமை", "திங்கள்கிழமை", "செவ்வாய்க்கிழமை", "புதன்கிழமை", "வியாழக்கிழமை", "வெள்ளிக்கிழமை", "சனிக்கிழமை"], AbbreviatedDayNames: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"], MonthNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], AbbreviatedMonthNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "காலை", PMDesignator: "மாலை", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1098: {LCID: 1098, Name: "te-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"], AbbreviatedDayNames: ["ఆది.", "సోమ.", "మంగళ.", "బుధ.", "గురు.", "శుక్ర.", "శని."], MonthNames: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్", ""], AbbreviatedMonthNames: ["జనవరి", "ఫిబ్రవరి", "మార్చి", "ఏప్రిల్", "మే", "జూన్", "జూలై", "ఆగస్టు", "సెప్టెంబర్", "అక్టోబర్", "నవంబర్", "డిసెంబర్", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "పూర్వాహ్న", PMDesignator: "అపరాహ్న", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	1099: {LCID: 1099, Name: "kn-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"], AbbreviatedDayNames: ["ಭಾನು.", "ಸೋಮ.", "ಮಂಗಳ.", "ಬುಧ.", "ಗುರು.", "ಶುಕ್ರ.", "ಶನಿ."], MonthNames: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರೀಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್", ""], AbbreviatedMonthNames: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಎಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ಪೂರ್ವಾಹ್ನ", PMDesignator: "ಅಪರಾಹ್ನ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	1100: {LCID: 1100, Name: "ml-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ഞായറാഴ്ച", "തിങ്കളാഴ്ച", "ചൊവ്വാഴ്ച", "ബുധനാഴ്ച", "വ്യാഴാഴ്ച", "വെള്ളിയാഴ്ച", "ശനിയാഴ്ച"], AbbreviatedDayNames: ["ഞായർ.", "തിങ്കൾ.", "ചൊവ്വ.", "ബുധൻ.", "വ്യാഴം.", "വെള്ളി.", "ശനി."], MonthNames: ["ജനുവരി", "ഫെബ്രുവരി", "മാര്‍‌ച്ച്", "ഏപ്രില്‍", "മെയ്", "ജൂണ്‍", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്‌റ്റംബര്‍", "ഒക്‌ടോബര്‍", "നവംബര്‍", "ഡിസംബര്‍", ""], AbbreviatedMonthNames: ["ജനുവരി", "ഫെബ്രുവരി", "മാര്‍‌ച്ച്", "ഏപ്രില്‍", "മെയ്", "ജൂണ്‍", "ജൂലൈ", "ആഗസ്റ്റ്", "സെപ്‌റ്റംബര്‍", "ഒക്‌ടോബര്‍", "നവംബര്‍", "ഡിസംബര്‍", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	1101: {LCID: 1101, Name: "as-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ৰবিবাৰ", "সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্রবাৰ", "শনিবাৰ"], AbbreviatedDayNames: ["ৰবি.", "সোম.", "মঙ্গল.", "বুধ.", "বৃহ.", "শুক্র.", "শনি."], MonthNames: ["জানুৱাৰী", "ফেব্রুৱাৰী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগষ্ট", "চেপ্টেম্বৰ", "অক্টোবৰ", "নবেম্বৰ", "ডিচেম্বৰ", ""], AbbreviatedMonthNames: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগষ্ট", "চেপ্টে", "অক্টো", "নবে", "ডিচে", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ৰাতিপু", PMDesignator: "আবেলি", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1102: {LCID: 1102, Name: "mr-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["रवि.", "सोम.", "मंगळ.", "बुध.", "गुरु.", "शुक्र.", "शनि."], MonthNames: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जाने.", "फेब्रु.", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग.", "सप्टें.", "ऑक्टो.", "नोव्हें.", "डिसें.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "म.पू.", PMDesignator: "म.नं.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1103: {LCID: 1103, Name: "sa-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["रविवासरः", "सोमवासरः", "मङ्गलवासरः", "बुधवासरः", "गुरुवासरः", "शुक्रवासरः", "शनिवासरः"], AbbreviatedDayNames: ["रवि", "सोम", "मङ्ग", "बुध", "गुरु", "शुक्र", "शनि"], MonthNames: ["जान्युअरी", "फेब्रुअरी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जान्युअरी", "फेब्रुअरी", "मार्च", "एप्रिल", "मे", "जुन", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "मध्यानपूर्व", PMDesignator: "मध्यानपच्यात", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1104: {LCID: 1104, Name: "mn-MN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₮", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба"], AbbreviatedDayNames: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"], MonthNames: ["Нэгдүгээр сар", "Хоёрдугаар сар", "Гуравдугаар сар", "Дөрөвдүгээр сар", "Тавдугаар сар", "Зургадугаар сар", "Долдугаар сар", "Наймдугаар сар", "Есдүгээр сар", "Аравдугаар сар", "Арван нэгдүгээр сар", "Арван хоёрдугаар сар", ""], AbbreviatedMonthNames: ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ҮӨ", PMDesignator: "ҮХ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1105: {LCID: 1105, Name: "bo-CN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["གཟའ་ཉི་མ།", "གཟའ་ཟླ་བ།", "གཟའ་མིག་དམར།", "གཟའ་ལྷག་པ།", "གཟའ་ཕུར་བུ།", "གཟའ་པ་སངས།", "གཟའ་སྤེན་པ།"], AbbreviatedDayNames: ["ཉི་མ།", "ཟླ་བ།", "མིག་དམར།", "ལྷག་པ།", "ཕུར་བུ།", "པ་སངས།", "སྤེན་པ།"], MonthNames: ["སྤྱི་ཟླ་དང་པོ།", "སྤྱི་ཟླ་གཉིས་པ།", "སྤྱི་ཟླ་གསུམ་པ།", "སྤྱི་ཟླ་བཞི་པ།", "སྤྱི་ཟླ་ལྔ་པ།", "སྤྱི་ཟླ་དྲུག་པ།", "སྤྱི་ཟླ་བདུན་པ།", "སྤྱི་ཟླ་བརྒྱད་པ།", "སྤྱི་ཟླ་དགུ་པ།", "སྤྱི་ཟླ་བཅུ་པ།", "སྤྱི་ཟླ་བཅུ་གཅིག་པ།", "སྤྱི་ཟླ་བཅུ་གཉིས་པ།", ""], AbbreviatedMonthNames: ["ཟླ་ ༡", "ཟླ་ ༢", "ཟླ་ ༣", "ཟླ་ ༤", "ཟླ་ ༥", "ཟླ་ ༦", "ཟླ་ ༧", "ཟླ་ ༨", "ཟླ་ ༩", "ཟླ་ ༡༠", "ཟླ་ ༡༡", "ཟླ་ ༡༢", ""], MonthGenitiveNames: ["སྤྱི་ཟླ་དང་པོའི་", "སྤྱི་ཟླ་གཉིས་པའི་", "སྤྱི་ཟླ་གསུམ་པའི་", "སྤྱི་ཟླ་བཞི་པའི་", "སྤྱི་ཟླ་ལྔ་པའི་", "སྤྱི་ཟླ་དྲུག་པའི་", "སྤྱི་ཟླ་བདུན་པའི་", "སྤྱི་ཟླ་བརྒྱད་པའི་", "སྤྱི་ཟླ་དགུ་པའི་", "སྤྱི་ཟླ་བཅུ་པའི་", "སྤྱི་ཟླ་བཅུ་གཅིག་པའི་", "སྤྱི་ཟླ་བཅུ་གཉིས་པའི་", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "སྔ་དྲོ", PMDesignator: "ཕྱི་དྲོ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	1106: {LCID: 1106, Name: "cy-GB", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "£", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dydd Sul", "Dydd Llun", "Dydd Mawrth", "Dydd Mercher", "Dydd Iau", "Dydd Gwener", "Dydd Sadwrn"], AbbreviatedDayNames: ["Sul", "Llun", "Maw", "Mer", "Iau", "Gwen", "Sad"], MonthNames: ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr", ""], AbbreviatedMonthNames: ["Ion", "Chw", "Maw", "Ebr", "Mai", "Meh", "Gor", "Awst", "Medi", "Hyd", "Tach", "Rhag", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Ion", "Chwef", "Mawrth", "Ebrill", "Mai", "Meh", "Gorff", "Awst", "Medi", "Hyd", "Tach", "Rhag", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1107: {LCID: 1107, Name: "km-KH", CurrencyPositivePattern: 1, CurrencyNegativePattern: 5, CurrencySymbol: "៛", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ថ្ងៃអាទិត្យ", "ថ្ងៃច័ន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍"], AbbreviatedDayNames: ["អាទិ.", "ច.", "អ.", "ពុ", "ព្រហ.", "សុ.", "ស."], MonthNames: ["មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ", ""], AbbreviatedMonthNames: ["១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩", "១០", "១១", "១២", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ព្រឹក", PMDesignator: "ល្ងាច", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	1108: {LCID: 1108, Name: "lo-LA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "₭", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ"], AbbreviatedDayNames: ["ວັນອາທິດ", "ວັນຈັນ", "ວັນອັງຄານ", "ວັນພຸດ", "ວັນພະຫັດ", "ວັນສຸກ", "ວັນເສົາ"], MonthNames: ["ມັງກອນ", "ກຸມພາ", "ມີນາ", "ເມສາ", "ພຶດສະພາ", "ມິຖຸນາ", "ກໍລະກົດ", "ສິງຫາ", "ກັນຍາ", "ຕຸລາ", "ພະຈິກ", "ທັນວາ", ""], AbbreviatedMonthNames: ["ມ.ກ.", "ກ.ພ.", "ມ.ນ.", "ມ.ສ.", "ພ.ພ.", "ມິ.ຖ.", "ກ.ລ.", "ສ.ຫ.", "ກ.ຍ.", "ຕ.ລ.", "ພ.ຈ.", "ທ.ວ.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ກ່ອນທ່ຽງ", PMDesignator: "ຫຼັງທ່ຽງ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1109: {LCID: 1109, Name: "my-MM", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "K", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"], AbbreviatedDayNames: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"], MonthNames: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "ဩဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ", ""], AbbreviatedMonthNames: ["ဇန်", "ဖေ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူ", "ဩ", "စက်", "အောက်", "နို", "ဒီ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "နံနက်", PMDesignator: "ညနေ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1110: {LCID: 1110, Name: "gl-ES", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "luns", "martes", "mércores", "xoves", "venres", "sábado"], AbbreviatedDayNames: ["dom", "lun", "mar", "mér", "xov", "ven", "sáb"], MonthNames: ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro", ""], AbbreviatedMonthNames: ["Xan", "Feb", "Mar", "Abr", "Mai", "Xuñ", "Xul", "Ago", "Set", "Out", "Nov", "Dec", ""], MonthGenitiveNames: ["xaneiro", "febreiro", "marzo", "abril", "maio", "xuño", "xullo", "agosto", "setembro", "outubro", "novembro", "decembro", ""], AbbreviatedMonthGenitiveNames: ["xan", "feb", "mar", "abr", "mai", "xuñ", "xul", "ago", "set", "out", "nov", "dec", ""], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1111: {LCID: 1111, Name: "kok-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["आयतार", "सोमार", "मंगळार", "बुधवार", "बिरेस्तार", "सुक्रार", "शेनवार"], AbbreviatedDayNames: ["आय.", "सोम.", "मंगळ.", "बुध.", "बिरे.", "सुक्र.", "शेन."], MonthNames: ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोवेम्बर", "डिसेंबर", ""], AbbreviatedMonthNames: ["जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑग.", "सप्टें.", "ऑक्टो.", "नोवे.", "डिसें", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "म.पू.", PMDesignator: "म.नं.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1112: {LCID: 1112, Name: "mni-IN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["নোংমাইজিং", "নিংথৌকাঃবা", "লৈঃপাক পোকপা", "য়ুমশা কৈশা", "সগোনসেল", "ইরাই", "থাংজা"], AbbreviatedDayNames: ["নোংমাইজিং", "নিংথৌকাঃবা", "লৈঃপাক পোকপা", "য়ুমশা কৈশা", "সগোনসেল", "ইরাই", "থাংজা"], MonthNames: ["ৱাকিচঙ", "লাঘাফাইরেল", "লমদা", "সজিবু", "কালেন্", "ইঙাঃ", "ইঙেন", "থৱান", "লাংবন", "মেরাঃ", "হাগৈঃ", "পোইনু", ""], AbbreviatedMonthNames: ["ৱাকিচঙ", "লাঘাফাইরেল", "লমদা", "সজিবু", "কালেন্", "ইঙাঃ", "ইঙেন", "থৱান", "লাংবন", "মেরাঃ", "হাগৈঃ", "পোইনু", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1113: {LCID: 1113, Name: "sd-Deva-IN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["आचर", "सवमर", "ङरव", "रब", "ख़मयस", "जम", "छनछर"], AbbreviatedDayNames: ["आचर", "सवमर", "ङरव", "रब", "ख़मयस", "जम", "छनछर"], MonthNames: ["जनवरय", "फ़बरवरय", "मारच", "परयल", "मय", "जवन", "वलाय", "आगसट", "सयपटमबर", "आटवबर", "नववमबर", "डसमबर", ""], AbbreviatedMonthNames: ["जनवरय", "फ़बरवरय", "मारच", "परयल", "मय", "जवन", "वलाय", "आगसट", "सयपटमबर", "आटवबर", "नववमबर", "डसमबर", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1114: {LCID: 1114, Name: "syr-SY", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ܠ.ܣ.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ܚܕ ܒܫܒܐ", "ܬܪܝܢ ܒܫܒܐ", "ܬܠܬܐ ܒܫܒܐ", "ܐܪܒܥܐ ܒܫܒܐ", "ܚܡܫܐ ܒܫܒܐ", "ܥܪܘܒܬܐ", "ܫܒܬܐ"], AbbreviatedDayNames: ["܏ܐ ܏ܒܫ", "܏ܒ ܏ܒܫ", "܏ܓ ܏ܒܫ", "܏ܕ ܏ܒܫ", "܏ܗ ܏ܒܫ", "܏ܥܪܘܒ", "܏ܫܒ"], MonthNames: ["ܟܢܘܢ ܐܚܪܝ", "ܫܒܛ", "ܐܕܪ", "ܢܝܣܢ", "ܐܝܪ", "ܚܙܝܪܢ", "ܬܡܘܙ", "ܐܒ", "ܐܝܠܘܠ", "ܬܫܪܝ ܩܕܝܡ", "ܬܫܪܝ ܐܚܪܝ", "ܟܢܘܢ ܩܕܝܡ", ""], AbbreviatedMonthNames: ["܏ܟܢ ܏ܒ", "ܫܒܛ", "ܐܕܪ", "ܢܝܣܢ", "ܐܝܪ", "ܚܙܝܪܢ", "ܬܡܘܙ", "ܐܒ", "ܐܝܠܘܠ", "܏ܬܫ ܏ܐ", "܏ܬܫ ܏ܒ", "܏ܟܢ ܏ܐ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ܩ.ܛ", PMDesignator: "ܒ.ܛ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1115: {LCID: 1115, Name: "si-LK", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "රු.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"], AbbreviatedDayNames: ["ඉරිදා", "සඳුදා", "අඟහ", "බදාදා", "බ්‍රහස්", "සිකු", "සෙන"], MonthNames: ["ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්", ""], AbbreviatedMonthNames: ["ජන", "පෙබ", "මාර්", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["ජන", "පෙබ", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝ", "සැප්", "ඔක්", "නොවැ", "දෙසැ", ""], AMDesignator: "පෙ.ව.", PMDesignator: "ප.ව.", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "531"},
	1116: {LCID: 1116, Name: "chr-Cher-US", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ᎤᎾᏙᏓᏆᏍᎬ", "ᎤᎾᏙᏓᏉᏅᎯ", "ᏔᎵᏁᎢᎦ", "ᏦᎢᏁᎢᎦ", "ᏅᎩᏁᎢᎦ", "ᏧᎾᎩᎶᏍᏗ", "ᎤᎾᏙᏓᏈᏕᎾ"], AbbreviatedDayNames: ["ᏆᏍᎬ", "ᏉᏅᎯ", "ᏔᎵᏁ", "ᏦᎢᏁ", "ᏅᎩᏁ", "ᏧᎾᎩ", "ᏈᏕᎾ"], MonthNames: ["ᎤᏃᎸᏔᏅ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍᎬᏘ", "ᏕᎭᎷᏱ", "ᎫᏰᏉᏂ", "ᎦᎶᏂ", "ᏚᎵᏍᏗ", "ᏚᏂᏅᏗ", "ᏅᏓᏕᏆ", "ᎤᏍᎩᏱ", ""], AbbreviatedMonthNames: ["ᎤᏃᎸ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍ", "ᏕᎭᎷ", "ᎫᏰᏉ", "ᎦᎶᏂ", "ᏚᎵᏍ", "ᏚᏂᏅ", "ᏅᏓᏕ", "ᎤᏍᎩ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1117: {LCID: 1117, Name: "iu-Cans-CA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ᓈᑦᑏᖑᔭ", "ᓇᒡᒐᔾᔭᐅ", "ᐊᐃᑉᐱᖅ", "ᐱᖓᑦᓯᖅ", "ᓯᑕᒻᒥᖅ", "ᑕᓪᓕᕐᒥᖅ", "ᓯᕙᑖᕐᕕᒃ"], AbbreviatedDayNames: ["ᓈᑦᑏ", "ᓇᒡᒐ", "ᐊᐃᑉᐱ", "ᐱᖓᑦᓯ", "ᓯᑕ", "ᑕᓪᓕ", "ᓯᕙᑖᕐᕕᒃ"], MonthNames: ["ᔮᓐᓄᐊᕆ", "ᕖᕝᕗᐊᕆ", "ᒫᑦᓯ", "ᐄᐳᕆ", "ᒪᐃ", "ᔫᓂ", "ᔪᓚᐃ", "ᐋᒡᒌᓯ", "ᓯᑎᐱᕆ", "ᐅᑐᐱᕆ", "ᓄᕕᐱᕆ", "ᑎᓯᐱᕆ", ""], AbbreviatedMonthNames: ["ᔮᓐᓄ", "ᕖᕝᕗ", "ᒫᑦᓯ", "ᐄᐳᕆ", "ᒪᐃ", "ᔫᓂ", "ᔪᓚᐃ", "ᐋᒡᒌ", "ᓯᑎᐱ", "ᐅᑐᐱ", "ᓄᕕᐱ", "ᑎᓯᐱ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1118: {LCID: 1118, Name: "am-ET", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "ብር", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"], AbbreviatedDayNames: ["እሑድ", "ሰኞ", "ማክሰ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"], MonthNames: ["ጃንዩወሪ", "ፌብሩወሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን", "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር", ""], AbbreviatedMonthNames: ["ጃንዩ", "ፌብሩ", "ማርች", "ኤፕሪ", "ሜይ", "ጁን", "ጁላይ", "ኦገስ", "ሴፕቴ", "ኦክቶ", "ኖቬም", "ዲሴም", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ጥዋት", PMDesignator: "ከሰዓት", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1119: {LCID: 1119, Name: "tzm-Arab-MA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "MAD", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1120: {LCID: 1120, Name: "ks-Arab", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["اَتھوار", "ژٔنٛدرٕروار", "بوٚموار", "بودوار", "برٛٮ۪سوار", "جُمہ", "بٹوار"], AbbreviatedDayNames: ["آتھوار", "ژٔنٛدٕروار", "بوٚموار", "بودوار", "برٛٮ۪سوار", "جُمہ", "بٹوار"], MonthNames: ["جنؤری", "فرؤری", "مارٕچ", "اپریل", "میٔ", "جوٗن", "جوٗلایی", "اگست", "ستمبر", "اکتوٗبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنؤری", "فرؤری", "مارٕچ", "اپریل", "میٔ", "جوٗن", "جوٗلایی", "اگست", "ستمبر", "اکتوٗبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1121: {LCID: 1121, Name: "ne-NP", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "रु", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["आइतवार", "सोमवार", "मङ्गलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"], AbbreviatedDayNames: ["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"], MonthNames: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जून", "जुलाई", "अगस्त", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर", ""], AbbreviatedMonthNames: ["जन", "फेब", "मार्च", "अप्रिल", "मे", "जून", "जुलाई", "अग", "सेप्ट", "अक्ट", "नोभ", "डिस", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "पूर्वाह्न", PMDesignator: "अपराह्न", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1122: {LCID: 1122, Name: "fy-NL", CurrencyPositivePattern: 2, CurrencyNegativePattern: 11, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["snein", "moandei", "tiisdei", "woansdei", "tongersdei", "freed", "sneon"], AbbreviatedDayNames: ["si", "mo", "ti", "wo", "to", "fr", "so"], MonthNames: ["jannewaris", "febrewaris", "maart", "april", "maaie", "juny", "july", "augustus", "septimber", "oktober", "novimber", "desimber", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mrt.", "apr.", "mai", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1123: {LCID: 1123, Name: "ps-AF", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "؋", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چارشنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چارشنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["وری", "غويی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "ليندۍ", "مرغومی", "سلواغه", "كب", ""], AbbreviatedMonthNames: ["وری", "غويی", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "ليندۍ", "مرغومی", "سلواغه", "كب", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "غ.م.", PMDesignator: "غ.و.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	1124: {LCID: 1124, Name: "fil-PH", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₱", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"], AbbreviatedDayNames: ["Lin", "Lun", "Mar", "Miy", "Huw", "Biy", "Sab"], MonthNames: ["Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre", ""], AbbreviatedMonthNames: ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1125: {LCID: 1125, Name: "dv-MV", CurrencyPositivePattern: 3, CurrencyNegativePattern: 10, CurrencySymbol: "ރ.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["އާދީއްތަ", "ހޯމަ", "އަންގާރަ", "ބުދަ", "ބުރާސްފަތި", "ހުކުރު", "ހޮނިހިރު"], AbbreviatedDayNames: ["އާދީއްތަ", "ހޯމަ", "އަންގާރަ", "ބުދަ", "ބުރާސްފަތި", "ހުކުރު", "ހޮނިހިރު"], MonthNames: ["ޖަނަވަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރިލް", "މެއި", "ޖޫން", "ޖުލައި", "އޮގަސްޓް", "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ", ""], AbbreviatedMonthNames: ["ޖަނަވަރީ", "ފެބްރުއަރީ", "މާރޗް", "އޭޕްރިލް", "މެއި", "ޖޫން", "ޖުލައި", "އޮގަސްޓް", "ސެޕްޓެމްބަރ", "އޮކްޓޯބަރ", "ނޮވެމްބަރ", "ޑިސެމްބަރ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "މކ", PMDesignator: "މފ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "134"},
	1126: {LCID: 1126, Name: "bin-NG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1127: {LCID: 1127, Name: "ff-NG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["alete", "altine", "talaata", "alarba", "alkamiisa", "aljumaa", "asete"], AbbreviatedDayNames: ["alet", "alt.", "tal.", "alar.", "alk.", "alj.", "aset"], MonthNames: ["samwiee", "feeburyee", "marsa", "awril", "me", "suyeŋ", "sulyee", "ut", "satambara", "oktoobar", "nowamburu", "deesamburu", ""], AbbreviatedMonthNames: ["samw", "feeb", "mar", "awr", "me", "suy", "sul", "ut", "sat", "okt", "now", "dees", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1128: {LCID: 1128, Name: "ha-Latn-NG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Lahadi", "Litinin", "Talata", "Laraba", "Alhamis", "Jummaʼa", "Asabar"], AbbreviatedDayNames: ["Lh", "Li", "Ta", "Lr", "Al", "Ju", "As"], MonthNames: ["Janairu", "Faburairu", "Maris", "Afirilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba", ""], AbbreviatedMonthNames: ["Jan", "Fab", "Mar", "Afi", "May", "Yun", "Yul", "Agu", "Sat", "Okt", "Nuw", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1129: {LCID: 1129, Name: "ibb-NG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1130: {LCID: 1130, Name: "yo-NG", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Ọjọ́ Àìkú", "Ọjọ́ Ajé", "Ọjọ́ Ìsẹ́gun", "Ọjọ́rú", "Ọjọ́bọ", "Ọjọ́ Ẹtì", "Ọjọ́ Àbámẹ́ta"], AbbreviatedDayNames: ["Àìkú", "Ajé", "Ìsẹ́gun", "Ọjọ́rú", "Ọjọ́bọ", "Ẹtì", "Àbámẹ́ta"], MonthNames: ["Oṣù Ṣẹ́rẹ́", "Oṣù Èrèlè", "Oṣù Ẹrẹ̀nà", "Oṣù Ìgbé", "Oṣù Ẹ̀bibi", "Oṣù Òkúdu", "Oṣù Agẹmọ", "Oṣù Ògún", "Oṣù Owewe", "Oṣù Ọ̀wàrà", "Oṣù Bélú", "Oṣù Ọ̀pẹ̀", ""], AbbreviatedMonthNames: ["Ṣẹ́rẹ́", "Èrèlè", "Ẹrẹ̀nà", "Ìgbé", "Ẹ̀bibi", "Òkúdu", "Agẹmọ", "Ògún", "Owewe", "Ọ̀wàrà", "Bélú", "Ọ̀pẹ̀", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "Àárọ̀", PMDesignator: "Ọ̀sán", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1131: {LCID: 1131, Name: "quz-BO", CurrencyPositivePattern: 2, CurrencyNegativePattern: 14, CurrencySymbol: "Bs.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["intichaw", "killachaw", "atipachaw", "quyllurchaw", "Ch' askachaw", "Illapachaw", "k'uychichaw"], AbbreviatedDayNames: ["int", "kil", "ati", "quy", "Ch'", "Ill", "k'u"], MonthNames: ["Qulla puquy", "Hatun puquy", "Pauqar waray", "ayriwa", "Aymuray", "Inti raymi", "Anta Sitwa", "Qhapaq Sitwa", "Uma raymi", "Kantaray", "Ayamarq'a", "Kapaq Raymi", ""], AbbreviatedMonthNames: ["Qul", "Hat", "Pau", "ayr", "Aym", "Int", "Ant", "Qha", "Uma", "Kan", "Aya", "Kap", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1132: {LCID: 1132, Name: "nso-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sontaga", "Mosupalogo", "Labobedi", "Laboraro", "Labone", "Labohlano", "Mokibelo"], AbbreviatedDayNames: ["Son", "Mos", "Bed", "Rar", "Ne", "Hla", "Mok"], MonthNames: ["Janaware", "Feberware", "Matšhe", "Aporele", "Mei", "June", "Julae", "Agostose", "Setemere", "Oktobore", "Nofemere", "Disemere", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mat", "Apo", "Mei", "Jun", "Jul", "Ago", "Set", "Okt", "Nof", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1133: {LCID: 1133, Name: "ba-RU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Йәкшәмбе", "Дүшәмбе", "Шишәмбе", "Шаршамбы", "Кесаҙна", "Йома", "Шәмбе"], AbbreviatedDayNames: ["Йш", "Дш", "Шш", "Шр", "Кс", "Йм", "Шб"], MonthNames: ["ғинуар", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthNames: ["ғин", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	1134: {LCID: 1134, Name: "lb-LU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sonndeg", "Méindeg", "Dënschdeg", "Mëttwoch", "Donneschdeg", "Freideg", "Samschdeg"], AbbreviatedDayNames: ["Son", "Méi", "Dën", "Mët", "Don", "Fre", "Sam"], MonthNames: ["Januar", "Februar", "Mäerz", "Abrëll", "Mee", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mäe", "Abr", "Mee", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "134"},
	1135: {LCID: 1135, Name: "kl-GL", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["sapaat", "ataasinngorneq", "marlunngorneq", "pingasunngorneq", "sisamanngorneq", "tallimanngorneq", "arfininngorneq"], AbbreviatedDayNames: ["sap.", "at.", "marl.", "ping.", "sis.", "tall.", "arf."], MonthNames: ["januaari", "februaari", "marsi", "apriili", "maaji", "juuni", "juuli", "aggusti", "septembari", "oktobari", "novembari", "decembari", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: ["januaarip", "februaarip", "marsip", "apriilip", "maajip", "juunip", "juulip", "aggustip", "septembarip", "oktobarip", "novembarip", "decembarip", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1136: {LCID: 1136, Name: "ig-NG", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Mbọsị Ụka", "Mọnde", "Tiuzdee", "Wenezdee", "Tọọzdee", "Fraịdee", "Satọdee"], AbbreviatedDayNames: ["Ụka", "Mọn", "Tiu", "Wen", "Tọọ", "Fraị", "Sat"], MonthNames: ["Jenụwarị", "Febrụwarị", "Maachị", "Eprel", "Mee", "Juun", "Julaị", "Ọgọọst", "Septemba", "Ọktoba", "Novemba", "Disemba", ""], AbbreviatedMonthNames: ["Jen", "Feb", "Maa", "Epr", "Mee", "Juu", "Jul", "Ọgọ", "Sep", "Ọkt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "A.M.", PMDesignator: "P.M.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1137: {LCID: 1137, Name: "kr-NG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 1, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1138: {LCID: 1138, Name: "om-ET", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Br", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dilbata", "Wiixata", "Qibxata", "Roobii", "Kamiisa", "Jimaata", "Sanbata"], AbbreviatedDayNames: ["Dil", "Wix", "Qib", "Rob", "Kam", "Jim", "San"], MonthNames: ["Amajjii", "Guraandhala", "Bitooteessa", "Elba", "Caamsa", "Waxabajjii", "Adooleessa", "Hagayya", "Fuulbana", "Onkololeessa", "Sadaasa", "Muddee", ""], AbbreviatedMonthNames: ["Ama", "Gur", "Bit", "Elb", "Cam", "Wax", "Ado", "Hag", "Ful", "Onk", "Sad", "Mud", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "WD", PMDesignator: "WB", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1139: {LCID: 1139, Name: "ti-ET", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Br", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ሰንበት", "ሰኑይ", "ሠሉስ", "ረቡዕ", "ኃሙስ", "ዓርቢ", "ቀዳም"], AbbreviatedDayNames: ["ሰንበት", "ሰኑይ", "ሠሉስ", "ረቡዕ", "ኃሙስ", "ዓርቢ", "ቀዳም"], MonthNames: ["ጃንዩወሪ", "ፌብሩወሪ", "ማርች", "ኤፕረል", "ሜይ", "ጁን", "ጁላይ", "ኦገስት", "ሴፕቴምበር", "ኦክተውበር", "ኖቬምበር", "ዲሴምበር", ""], AbbreviatedMonthNames: ["ጃንዩ", "ፌብሩ", "ማርች", "ኤፕረ", "ሜይ", "ጁን", "ጁላይ", "ኦገስ", "ሴፕቴ", "ኦክተ", "ኖቬም", "ዲሴም", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ንጉሆ ሰዓተ", PMDesignator: "ድሕር ሰዓት", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1140: {LCID: 1140, Name: "gn-PY", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₲", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["arateĩ", "arakõi", "araapy", "ararundy", "arapo", "arapoteĩ", "arapokõi"], AbbreviatedDayNames: ["teĩ", "kõi", "apy", "ndy", "po", "oteĩ", "okõi"], MonthNames: ["jasyteĩ", "jasykõi", "jasyapy", "jasyrundy", "jasypo", "jasypoteĩ", "jasypokõi", "jasypoapy", "jasyporundy", "jasypa", "jasypateĩ", "jasypakõi", ""], AbbreviatedMonthNames: ["jteĩ", "jkõi", "japy", "jrun", "jpo", "jpot", "jpok", "jpoa", "jpor", "jpa", "jpat", "jpak", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1141: {LCID: 1141, Name: "haw-US", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Lāpule", "Poʻakahi", "Poʻalua", "Poʻakolu", "Poʻahā", "Poʻalima", "Poʻaono"], AbbreviatedDayNames: ["LP", "P1", "P2", "P3", "P4", "P5", "P6"], MonthNames: ["Ianuali", "Pepeluali", "Malaki", "ʻApelila", "Mei", "Iune", "Iulai", "ʻAukake", "Kepakemapa", "ʻOkakopa", "Nowemapa", "Kekemapa", ""], AbbreviatedMonthNames: ["Ian.", "Pep.", "Mal.", "ʻAp.", "Mei", "Iun.", "Iul.", "ʻAu.", "Kep.", "ʻOk.", "Now.", "Kek.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	1142: {LCID: 1142, Name: "la-001", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "XDR", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Solis", "Lunae", "Martis", "Mercurii", "Jovis", "Veneris", "Saturni"], AbbreviatedDayNames: ["Sol", "Lun", "Mar", "Mer", "Jov", "Ven", "Sat"], MonthNames: ["Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius", "Quintilis", "Sextilis", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Quint", "Sext", "Sept", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1143: {LCID: 1143, Name: "so-SO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "S", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Axad", "Isniin", "Talaado", "Arbaco", "Khamiis", "Jimco", "Sabti"], AbbreviatedDayNames: ["Axd", "Isn", "Tal", "Arb", "Kha", "Jim", "Sab"], MonthNames: ["Bisha Koobaad", "Bisha Labaad", "Bisha Saddexaad", "Bisha Afraad", "Bisha Shanaad", "Bisha Lixaad", "Bisha Todobaad", "Bisha Sideedaad", "Bisha Sagaalaad", "Bisha Tobnaad", "Bisha Kow iyo Tobnaad", "Bisha Laba iyo Tobnaad", ""], AbbreviatedMonthNames: ["Kob", "Lab", "Sad", "Afr", "Sha", "Lix", "Tod", "Sid", "Sag", "Tob", "KIT", "LIT", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "sn.", PMDesignator: "gn.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1144: {LCID: 1144, Name: "ii-CN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ꑭꆏꑍ", "ꆏꊂ꒔", "ꆏꊂꑍ", "ꆏꊂꌕ", "ꆏꊂꇖ", "ꆏꊂꉬ", "ꆏꊂꃘ"], AbbreviatedDayNames: ["ꑭꆏ", "ꆏ꒔", "ꆏꑍ", "ꆏꌕ", "ꆏꇖ", "ꆏꉬ", "ꆏꃘ"], MonthNames: ["ꋍꆪ", "ꑍꆪ", "ꌕꆪ", "ꇖꆪ", "ꉬꆪ", "ꃘꆪ", "ꏃꆪ", "ꉆꆪ", "ꈬꆪ", "ꊰꆪ", "ꊯꊪꆪ", "ꊰꑋꆪ", ""], AbbreviatedMonthNames: ["ꋍꆪ", "ꑍꆪ", "ꌕꆪ", "ꇖꆪ", "ꉬꆪ", "ꃘꆪ", "ꏃꆪ", "ꉆꆪ", "ꈬꆪ", "ꊰꆪ", "ꊯꊪꆪ", "ꊰꑋꆪ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ꂵꆪꈌꈐ", PMDesignator: "ꂵꆪꈌꉈ", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	1145: {LCID: 1145, Name: "pap-029", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["diadomingo", "dialuna", "diamars", "diawebs", "diarazon", "diabierna", "diasabra"], AbbreviatedDayNames: ["dom", "lun", "mar", "web", "raz", "bie", "sab"], MonthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "025"},
	1146: {LCID: 1146, Name: "arn-CL", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Kiñe Ante", "Epu Ante", "Kila Ante", "Meli Ante", "Kechu Ante", "Cayu Ante", "Regle Ante"], AbbreviatedDayNames: ["Kiñe", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle"], MonthNames: ["Kiñe Tripantu", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle", "Purha", "Aiya", "Marhi", "Marhi Kiñe", "Marhi Epu", ""], AbbreviatedMonthNames: ["Kiñe Tripantu", "Epu", "Kila", "Meli", "Kechu", "Cayu", "Regle", "Purha", "Aiya", "Marhi", "Marhi Kiñe", "Marhi Epu", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	1148: {LCID: 1148, Name: "moh-CA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Awentatokentì:ke", "Awentataón'ke", "Ratironhia'kehronòn:ke", "Soséhne", "Okaristiiáhne", "Ronwaia'tanentaktonhne", "Entákta"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["Tsothohrkó:Wa", "Enniska", "Enniskó:Wa", "Onerahtókha", "Onerahtohkó:Wa", "Ohiari:Ha", "Ohiarihkó:Wa", "Seskéha", "Seskehkó:Wa", "Kenténha", "Kentenhkó:Wa", "Tsothóhrha", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	1150: {LCID: 1150, Name: "br-FR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sul", "Lun", "Meurzh", "Mercʼher", "Yaou", "Gwener", "Sadorn"], AbbreviatedDayNames: ["Sul", "Lun", "Meu.", "Mer.", "Yaou", "Gwe.", "Sad."], MonthNames: ["Genver", "Cʼhwevrer", "Meurzh", "Ebrel", "Mae", "Mezheven", "Gouere", "Eost", "Gwengolo", "Here", "Du", "Kerzu", ""], AbbreviatedMonthNames: ["Gen", "Cʼhwe", "Meur", "Ebr", "Mae", "Mezh", "Goue", "Eost", "Gwen", "Here", "Du", "Ker", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "A.M.", PMDesignator: "G.M.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	1152: {LCID: 1152, Name: "ug-CN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["يەكشەنبە", "دۈشەنبە", "سەيشەنبە", "چارشەنبە", "پەيشەنبە", "جۈمە", "شەنبە"], AbbreviatedDayNames: ["يە", "دۈ", "سە", "چا", "پە", "جۈ", "شە"], MonthNames: ["يانۋار", "فېۋرال", "مارت", "ئاپرېل", "ماي", "ئىيۇن", "ئىيۇل", "ئاۋغۇست", "سېنتەبىر", "ئۆكتەبىر", "نويابىر", "دېكابىر", ""], AbbreviatedMonthNames: ["1-ئاي", "2-ئاي", "3-ئاي", "4-ئاي", "5-ئاي", "6-ئاي", "7-ئاي", "8-ئاي", "9-ئاي", "10-ئاي", "11-ئاي", "12-ئاي", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "چۈشتىن بۇرۇن", PMDesignator: "چۈشتىن كېيىن", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "520"},
	1153: {LCID: 1153, Name: "mi-NZ", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Rātapu", "Rāhina", "Rātū", "Rāapa", "Rāpare", "Rāmere", "Rāhoroi"], AbbreviatedDayNames: ["Ta", "Hi", "Tū", "Apa", "Pa", "Me", "Ho"], MonthNames: ["Kohitātea", "Huitanguru", "Poutūterangi", "Paengawhāwhā", "Haratua", "Pipiri", "Hōngongoi", "Hereturikōkā", "Mahuru", "Whiringa ā-nuku", "Whiringa ā-rangi", "Hakihea", ""], AbbreviatedMonthNames: ["Kohi", "Hui", "Pou", "Pae", "Hara", "Pipi", "Hōngo", "Here", "Mahu", "Nuku", "Rangi", "Haki", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1154: {LCID: 1154, Name: "oc-FR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimenge", "diluns", "dimarts", "dimècres", "dijòus", "divendres", "dissabte"], AbbreviatedDayNames: ["dg.", "dl.", "dma.", "dmc.", "dj.", "dv.", "ds."], MonthNames: ["genièr", "febrièr", "març", "abril", "mai", "junh", "julhet", "agost", "setembre", "octobre", "novembre", "decembre", ""], AbbreviatedMonthNames: ["gen.", "feb.", "març", "abr.", "mai", "junh", "julh", "ag.", "set.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: ["de genièr", "de febrièr", "de març", "d'abril", "de mai", "de junh", "de julhet", "d'agost", "de setembre", "d'octobre", "de novembre", "de decembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ".", ShortDatePattern: "135"},
	1155: {LCID: 1155, Name: "co-FR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dumenica", "luni", "marti", "mercuri", "ghjovi", "venneri", "sabbatu"], AbbreviatedDayNames: ["dum.", "lun.", "mar.", "mer.", "ghj.", "ven.", "sab."], MonthNames: ["ghjennaghju", "ferraghju", "marzu", "aprile", "maghju", "ghjunghju", "lugliu", "aostu", "settembre", "ottobre", "nuvembre", "dicembre", ""], AbbreviatedMonthNames: ["ghje", "ferr", "marz", "apri", "magh", "ghju", "lugl", "aost", "sett", "otto", "nuve", "dice", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1156: {LCID: 1156, Name: "gsw-FR", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sundi", "Manti", "Zischti", "Mettwuch", "Dunnerschti", "Friti", "Sàmschti"], AbbreviatedDayNames: ["Su.", "Ma.", "Zi.", "Me.", "Du.", "Fr.", "Sà."], MonthNames: ["Jänner", "Feverje", "März", "Àpril", "Mai", "Jüni", "Jüli", "Augscht", "September", "Oktower", "Nowember", "Dezember", ""], AbbreviatedMonthNames: ["Jän.", "Fev.", "März", "Apr.", "Mai", "Jüni", "Jüli", "Aug.", "Sept.", "Okt.", "Now.", "Dez.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1157: {LCID: 1157, Name: "sah-RU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₽", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Өрөбүл", "энидиэнньик", "Оптуорунньук", "Сэрэдээ", "Чэппиэр", "Бээтинсэ", "Субуота"], AbbreviatedDayNames: ["Өр", "Бн", "Оп", "Ср", "Чп", "Бт", "Сб"], MonthNames: ["Тохсунньу", "Олунньу", "Кулун тутар", "Муус устар", "Ыам ыйа", "Бэс ыйа", "От ыйа", "Атырдьах ыйа", "Балаҕан ыйа", "Алтынньы", "Сэтинньи", "Ахсынньы", ""], AbbreviatedMonthNames: ["Тхс", "Олн", "Клн", "Мсу", "Ыам", "Бэс", "Оты", "Атр", "Блҕ", "Алт", "Сэт", "Ахс", ""], MonthGenitiveNames: ["тохсунньу", "олунньу", "кулун тутар", "муус устар", "ыам ыйын", "бэс ыйын", "от ыйын", "атырдьах ыйын", "балаҕан ыйын", "алтынньы", "сэтинньи", "ахсынньы", ""], AbbreviatedMonthGenitiveNames: ["тхс", "олн", "клн", "мсу", "ыам", "бэс", "оты", "атр", "блҕ", "алт", "сэт", "ахс", ""], AMDesignator: "КИ", PMDesignator: "КК", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	1158: {LCID: 1158, Name: "quc-Latn-GT", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "Q", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["juq'ij", "kaq'ij", "oxq'ij", "kajq'ij", "joq'ij", "waqq'ij", "wuqq'ij"], AbbreviatedDayNames: ["juq'", "kaq'", "oxq'", "kajq'", "joq'", "waqq'", "wuqq'"], MonthNames: ["nab'e ik'", "ukab' ik'", "urox ik'", "ukaj ik'", "uro ik'", "uwaq ik'", "uwuq ik'", "uwajxaq ik'", "ub'elej ik'", "ulaj ik'", "ujulaj ik'", "ukab'laj ik'", ""], AbbreviatedMonthNames: ["nab'e", "ukab'", "urox", "ukaj", "uro", "uwaq", "uwuq", "uwajxaq", "ub'elej", "ulaj", "ujulaj", "ukab'laj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1159: {LCID: 1159, Name: "rw-RW", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "RF", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Ku cyumweru", "Kuwa mbere", "Kuwa kabiri", "Kuwa gatatu", "Kuwa kane", "Kuwa gatanu", "Kuwa gatandatu"], AbbreviatedDayNames: ["cyu.", "mbe.", "kab.", "gtu.", "kan.", "gnu.", "gnd."], MonthNames: ["Mutarama", "Gashyantare", "Werurwe", "Mata", "Gicuransi", "Kamena", "Nyakanga", "Kanama", "Nzeli", "Ukwakira", "Ugushyingo", "Ukuboza", ""], AbbreviatedMonthNames: ["mut.", "gas.", "wer.", "mat.", "gic.", "kam.", "nya.", "kan.", "nze.", "ukw.", "ugu.", "uku.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	1160: {LCID: 1160, Name: "wo-SN", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Dibéer", "Altine", "Talaata", "Àllarba", "Alxames", "Àjjuma", "Gaawu"], AbbreviatedDayNames: ["Dib.", "Alt.", "Tal.", "Àll.", "Alx.", "Àjj.", "Gaa."], MonthNames: ["Samwiye", "Fewriye", "Maars", "Awril", "Me", "Suwe", "Sullet", "Ut", "Septàmbar", "Oktoobar", "Noowàmbar", "Desàmbar", ""], AbbreviatedMonthNames: ["Sam.", "Few.", "Maa", "Awr.", "Me", "Suw", "Sul.", "Ut", "Sept.", "Okt.", "Now.", "Des.", ""], MonthGenitiveNames: ["Samwiye", "Fewriye", "Maars", "Awril", "Me", "Suwe", "Sullet", "Ut", "Septàmbar", "Oktoobar", "Noowàmbar", "Deesàmbar", ""], AbbreviatedMonthGenitiveNames: ["Sam.", "Few.", "Maa", "Awr.", "Me", "Suwe", "Sul.", "Ut", "Sept.", "Okt.", "Noow.", "Des.", ""], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1164: {LCID: 1164, Name: "prs-AF", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "؋", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["یکشنبه", "دوشنبه", "سه‌ شنبه", "چهار شنبه", "پنجشنبه", "جمعه", "شنبه"], AbbreviatedDayNames: ["یکشنبه", "دوشنبه", "سه‌ شنبه", "چهار شنبه", "پنجشنبه", "جمعه", "شنبه"], MonthNames: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت", ""], AbbreviatedMonthNames: ["حمل", "ثور", "جوزا", "سرطان", "اسد", "سنبله", "میزان", "عقرب", "قوس", "جدی", "دلو", "حوت", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "غ.م", PMDesignator: "غ.و", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	1169: {LCID: 1169, Name: "gd-GB", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "£", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["DiDòmhnaich", "DiLuain", "DiMàirt", "DiCiadain", "DiarDaoin", "DihAoine", "DiSathairne"], AbbreviatedDayNames: ["DiD", "DiL", "DiM", "DiC", "Dia", "Dih", "DiS"], MonthNames: ["Am Faoilleach", "An Gearran", "Am Màrt", "An Giblean", "An Cèitean", "An t-Ògmhios", "An t-Iuchar", "An Lùnastal", "An t-Sultain", "An Dàmhair", "An t-Samhain", "An Dùbhlachd", ""], AbbreviatedMonthNames: ["Faoi", "Gearr", "Màrt", "Gibl", "Cèit", "Ògmh", "Iuch", "Lùna", "Sult", "Dàmh", "Samh", "Dùbh", ""], MonthGenitiveNames: ["dhen Fhaoilleach", "dhen Ghearran", "dhen Mhàrt", "dhen Ghiblean", "dhen Chèitean", "dhen Ògmhios", "dhen Iuchar", "dhen Lùnastal", "dhen t-Sultain", "dhen Dàmhair", "dhen t-Samhain", "dhen Dùbhlachd", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "m", PMDesignator: "f", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	1170: {LCID: 1170, Name: "ku-Arab-IQ", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "د.ع.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], AbbreviatedDayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], MonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], AbbreviatedMonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "پ.ن", PMDesignator: "د.ن", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	2049: {LCID: 2049, Name: "ar-IQ", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ع.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], AbbreviatedMonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2051: {LCID: 2051, Name: "ca-ES-valencia", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], AbbreviatedDayNames: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."], MonthNames: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre", ""], AbbreviatedMonthNames: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des.", ""], MonthGenitiveNames: ["de gener", "de febrer", "de març", "d’abril", "de maig", "de juny", "de juliol", "d’agost", "de setembre", "d’octubre", "de novembre", "de desembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	2052: {LCID: 2052, Name: "zh-CN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	2055: {LCID: 2055, Name: "de-CH", CurrencyPositivePattern: 2, CurrencyNegativePattern: 2, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: "'", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], MonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.", ""], AMDesignator: "vorm.", PMDesignator: "nachm.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2057: {LCID: 2057, Name: "en-GB", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "£", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2058: {LCID: 2058, Name: "es-MX", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2060: {LCID: 2060, Name: "fr-BE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "134"},
	2064: {LCID: 2064, Name: "it-CH", CurrencyPositivePattern: 2, CurrencyNegativePattern: 2, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: "'", NumberGroupSizes: [3], DayNames: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"], AbbreviatedDayNames: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"], MonthNames: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre", ""], AbbreviatedMonthNames: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic", ""], MonthGenitiveNames: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2067: {LCID: 2067, Name: "nl-BE", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"], AbbreviatedDayNames: ["zo", "ma", "di", "wo", "do", "vr", "za"], MonthNames: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	2068: {LCID: 2068, Name: "nn-NO", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["søndag", "måndag", "tysdag", "onsdag", "torsdag", "fredag", "laurdag"], AbbreviatedDayNames: ["sø.", "må.", "ty.", "on.", "to.", "fr.", "la."], MonthNames: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "f.m.", PMDesignator: "e.m.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2070: {LCID: 2070, Name: "pt-PT", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"], AbbreviatedDayNames: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"], MonthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro", ""], AbbreviatedMonthNames: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2072: {LCID: 2072, Name: "ro-MD", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "L", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"], AbbreviatedDayNames: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"], MonthNames: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie", ""], AbbreviatedMonthNames: ["ian.", "feb.", "mar.", "apr.", "mai", "iun.", "iul.", "aug.", "sept.", "oct.", "nov.", "dec.", ""], MonthGenitiveNames: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2073: {LCID: 2073, Name: "ru-MD", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "L", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], AbbreviatedDayNames: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"], MonthNames: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""], AbbreviatedMonthNames: ["янв.", "февр.", "март", "апр.", "май", "июнь", "июль", "авг.", "сент.", "окт.", "нояб.", "дек.", ""], MonthGenitiveNames: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря", ""], AbbreviatedMonthGenitiveNames: ["янв.", "февр.", "марта", "апр.", "мая", "июня", "июля", "авг.", "сент.", "окт.", "нояб.", "дек.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2077: {LCID: 2077, Name: "sv-FI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"], AbbreviatedDayNames: ["sön", "mån", "tis", "ons", "tors", "fre", "lör"], MonthNames: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December", ""], AbbreviatedMonthNames: ["Jan.", "Feb.", "Mars", "Apr.", "Maj", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dec.", ""], MonthGenitiveNames: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december", ""], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mars", "apr.", "maj", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "dec.", ""], AMDesignator: "FM", PMDesignator: "EM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	2080: {LCID: 2080, Name: "ur-IN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"], AbbreviatedDayNames: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"], MonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "دن", PMDesignator: "رات", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "024"},
	2092: {LCID: 2092, Name: "az-Cyrl-AZ", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₼", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["базар", "базар ертәси", "чәршәнбә ахшамы", "чәршәнбә", "ҹүмә ахшамы", "ҹүмә", "шәнбә"], AbbreviatedDayNames: ["Б", "Бе", "Ча", "Ч", "Ҹа", "Ҹ", "Ш"], MonthNames: ["jанвар", "феврал", "март", "апрел", "мај", "ијун", "ијул", "август", "сентјабр", "октјабр", "нојабр", "декабр", ""], AbbreviatedMonthNames: ["Јан", "Фев", "Мар", "Апр", "Мај", "Ијун", "Ијул", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], MonthGenitiveNames: ["јанвар", "феврал", "март", "апрел", "мај", "ијун", "ијул", "август", "сентјабр", "октјабр", "нојабр", "декабр", ""], AbbreviatedMonthGenitiveNames: ["Јан", "Фев", "Мар", "Апр", "мая", "ијун", "ијул", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	2094: {LCID: 2094, Name: "dsb-DE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["njeźela", "ponjeźele", "wałtora", "srjoda", "stwórtk", "pětk", "sobota"], AbbreviatedDayNames: ["nje", "pon", "wał", "srj", "stw", "pět", "sob"], MonthNames: ["januar", "februar", "měrc", "apryl", "maj", "junij", "julij", "awgust", "september", "oktober", "nowember", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "měr", "apr", "maj", "jun", "jul", "awg", "sep", "okt", "now", "dec", ""], MonthGenitiveNames: ["januara", "februara", "měrca", "apryla", "maja", "junija", "julija", "awgusta", "septembra", "oktobra", "nowembra", "decembra", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "025"},
	2098: {LCID: 2098, Name: "tn-BW", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "P", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Tshipi", "Mosopulogo", "Labobedi", "Laboraro", "Labone", "Labotlhano", "Matlhatso"], AbbreviatedDayNames: ["Tsh", "Mos", "Bed", "Rar", "Ne", "Tla", "Mat"], MonthNames: ["Ferikgong", "Tlhakole", "Mopitlo", "Moranang", "Motsheganang", "Seetebosigo", "Phukwi", "Phatwe", "Lwetse", "Diphalane", "Ngwanatsele", "Sedimonthole", ""], AbbreviatedMonthNames: ["Fer", "Tlh", "Mop", "Mor", "Mot", "See", "Phu", "Pha", "Lwe", "Dip", "Ngw", "Sed", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	2107: {LCID: 2107, Name: "se-SE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sotnabeaivi", "mánnodat", "disdat", "gaskavahkku", "duorastat", "bearjadat", "lávvardat"], AbbreviatedDayNames: ["sotn", "mán", "dis", "gask", "duor", "bear", "láv"], MonthNames: ["ođđajagemánnu", "guovvamánnu", "njukčamánnu", "cuoŋománnu", "miessemánnu", "geassemánnu", "suoidnemánnu", "borgemánnu", "čakčamánnu", "golggotmánnu", "skábmamánnu", "juovlamánnu", ""], AbbreviatedMonthNames: ["ođđj", "guov", "njuk", "cuoŋ", "mies", "geas", "suoi", "borg", "čakč", "golg", "skáb", "juov", ""], MonthGenitiveNames: ["ođđajagemánu", "guovvamánu", "njukčamánu", "cuoŋománu", "miessemánu", "geassemánu", "suoidnemánu", "borgemánu", "čakčamánu", "golggotmánu", "skábmamánu", "juovlamánu", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	2108: {LCID: 2108, Name: "ga-IE", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Dé Domhnaigh", "Dé Luain", "Dé Máirt", "Dé Céadaoin", "Déardaoin", "Dé hAoine", "Dé Sathairn"], AbbreviatedDayNames: ["Domh", "Luan", "Máirt", "Céad", "Déar", "Aoine", "Sath"], MonthNames: ["Eanáir", "Feabhra", "Márta", "Aibreán", "Bealtaine", "Meitheamh", "Iúil", "Lúnasa", "Meán Fómhair", "Deireadh Fómhair", "Samhain", "Nollaig", ""], AbbreviatedMonthNames: ["Ean", "Feabh", "Márta", "Aib", "Beal", "Meith", "Iúil", "Lún", "MFómh", "DFómh", "Samh", "Noll", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2110: {LCID: 2110, Name: "ms-BN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu"], AbbreviatedDayNames: ["Ahd", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"], MonthNames: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pg", PMDesignator: "ptg", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	2115: {LCID: 2115, Name: "uz-Cyrl-UZ", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "сўм", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшанба", "душанба", "сешанба", "чоршанба", "пайшанба", "жума", "шанба"], AbbreviatedDayNames: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"], MonthNames: ["Январ", "Феврал", "Март", "Апрел", "Май", "Июн", "Июл", "Август", "Сентябр", "Октябр", "Ноябр", "Декабр", ""], AbbreviatedMonthNames: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	2117: {LCID: 2117, Name: "bn-BD", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "৳", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"], AbbreviatedDayNames: ["রবি.", "সোম.", "মঙ্গল.", "বুধ.", "বৃহ.", "শুক্র.", "শনি."], MonthNames: ["জানুয়ারী", "ফেব্রুয়ারী", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর", ""], AbbreviatedMonthNames: ["জানু.", "ফেব্রু.", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগ.", "সেপ্টে.", "অক্টো.", "নভে.", "ডিসে.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "পুর্বাহ্ন", PMDesignator: "অপরাহ্ন", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	2118: {LCID: 2118, Name: "pa-Arab-PK", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته", "اتوار"], AbbreviatedDayNames: ["پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته", "اتوار"], MonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	2121: {LCID: 2121, Name: "ta-LK", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"], AbbreviatedDayNames: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"], MonthNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்டு", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], AbbreviatedMonthNames: ["ஜன.", "பிப்.", "மார்.", "ஏப்.", "மே", "ஜூன்", "ஜூலை", "ஆக.", "செப்.", "அக்.", "நவ.", "டிச.", ""], MonthGenitiveNames: ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "முற்பகல்", PMDesignator: "பிற்பகல்", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "025"},
	2128: {LCID: 2128, Name: "mn-Mong-CN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 0], DayNames: ["ᠭᠠᠷᠠᠭ ᠤᠨ ᠡᠳᠦᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠨᠢᠭᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠬᠣᠶᠠᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠭᠤᠷᠪᠠᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠳᠥᠷᠪᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠲᠠᠪᠤᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠵᠢᠷᠭᠤᠭᠠᠨ"], AbbreviatedDayNames: ["ᠭᠠᠷᠠᠭ ᠤᠨ ᠡᠳᠦᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠨᠢᠭᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠬᠣᠶᠠᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠭᠤᠷᠪᠠᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠳᠥᠷᠪᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠲᠠᠪᠤᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠵᠢᠷᠭᠤᠭᠠᠨ"], MonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], AbbreviatedMonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	2137: {LCID: 2137, Name: "sd-Arab-PK", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["سومر", "اڱارو", "اربع", "خميس", "جمعو", "ڇنڇر", "آچر"], AbbreviatedDayNames: ["سو", "اڱ", "ار", "خم", "جمعو", "ڇن", "آچ"], MonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], AbbreviatedMonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2141: {LCID: 2141, Name: "iu-Latn-CA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Naattiinguja", "Naggajjau", "Aippiq", "Pingatsiq", "Sitammiq", "Tallirmiq", "Sivataarvik"], AbbreviatedDayNames: ["Nat", "Nag", "Aip", "Pi", "Sit", "Tal", "Siv"], MonthNames: ["Jaannuari", "Viivvuari", "Maatsi", "Iipuri", "Mai", "Juuni", "Julai", "Aaggiisi", "Sitipiri", "Utupiri", "Nuvipiri", "Tisipiri", ""], AbbreviatedMonthNames: ["Jan", "Viv", "Mas", "Ipu", "Mai", "Jun", "Jul", "Agi", "Sii", "Uut", "Nuv", "Tis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	2143: {LCID: 2143, Name: "tzm-Latn-DZ", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "DA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["lh'ed", "letnayen", "ttlata", "larebâa", "lexmis", "ldjemâa", "ssebt"], AbbreviatedDayNames: ["lh'd", "let", "ttl", "lar", "lex", "ldj", "sse"], MonthNames: ["Yennayer", "Furar", "Meghres", "Yebrir", "Magu", "Yunyu", "Yulyu", "Ghuct", "Cutenber", "Tuber", "Nunember", "Dujanbir", ""], AbbreviatedMonthNames: ["Yen", "Fur", "Megh", "Yeb", "May", "Yun", "Yul", "Ghu", "Cut", "Tub", "Nun", "Duj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	2144: {LCID: 2144, Name: "ks-Deva-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	2145: {LCID: 2145, Name: "ne-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["आइतबार", "सोमबार", "मङ्गलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"], AbbreviatedDayNames: ["आइत", "सोम", "मङ्गल", "बुध", "बिही", "शुक्र", "शनि"], MonthNames: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर", ""], AbbreviatedMonthNames: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर", ""], MonthGenitiveNames: ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मई", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "पूर्वाह्न", PMDesignator: "अपराह्न", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	2151: {LCID: 2151, Name: "ff-Latn-SN", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["alete", "altine", "talaata", "alarba", "alkamiisa", "aljumaa", "asete"], AbbreviatedDayNames: ["alet", "alt.", "tal.", "alar.", "alk.", "alj.", "aset"], MonthNames: ["samwiee", "feeburyee", "marsa", "awril", "me", "suyeŋ", "sulyee", "ut", "satambara", "oktoobar", "nowamburu", "deesamburu", ""], AbbreviatedMonthNames: ["samw", "feeb", "mar", "awr", "me", "suy", "sul", "ut", "sat", "okt", "now", "dees", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2155: {LCID: 2155, Name: "quz-EC", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["inti", "awaki", "wanra", "chillay", "kullka", "chaska", "wakma"], AbbreviatedDayNames: ["int", "awk", "wan", "chy", "kuk", "cha", "wak"], MonthNames: ["kulla", "panchi", "pawkar", "ayriwa", "aymuray", "raymi", "sitwa", "karwa", "kuski", "wayru", "sasi", "kapak", ""], AbbreviatedMonthNames: ["kull", "pan", "paw", "ayr", "aym", "ray", "sit", "kar", "kus", "way", "sas", "kap", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	2163: {LCID: 2163, Name: "ti-ER", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Nfk", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"], AbbreviatedDayNames: ["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"], MonthNames: ["ጥሪ", "ለካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰነ", "ሓምለ", "ነሓሰ", "መስከረም", "ጥቅምቲ", "ሕዳር", "ታሕሳስ", ""], AbbreviatedMonthNames: ["ጥሪ", "ለካቲ", "መጋቢ", "ሚያዝ", "ግንቦ", "ሰነ", "ሓምለ", "ነሓሰ", "መስከ", "ጥቅም", "ሕዳር", "ታሕሳ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ንጉሆ ሰዓተ", PMDesignator: "ድሕር ሰዓት", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	3073: {LCID: 3073, Name: "ar-EG", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ج.م.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	3076: {LCID: 3076, Name: "zh-HK", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "HK$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	3079: {LCID: 3079, Name: "de-AT", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], MonthNames: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Jän.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.", ""], AMDesignator: "vorm.", PMDesignator: "nachm.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	3081: {LCID: 3081, Name: "en-AU", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	3082: {LCID: 3082, Name: "es-ES", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["do.", "lu.", "ma.", "mi.", "ju.", "vi.", "sá."], MonthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	3084: {LCID: 3084, Name: "fr-CA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 15, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	3131: {LCID: 3131, Name: "se-FI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sotnabeaivi", "vuossárga", "maŋŋebárga", "gaskavahkku", "duorastat", "bearjadat", "lávvardat"], AbbreviatedDayNames: ["sotn", "vuos", "maŋ", "gask", "duor", "bear", "láv"], MonthNames: ["ođđajagemánu", "guovvamánnu", "njukčamánnu", "cuoŋománnu", "miessemánnu", "geassemánnu", "suoidnemánnu", "borgemánnu", "čakčamánnu", "golggotmánnu", "skábmamánnu", "juovlamánnu", ""], AbbreviatedMonthNames: ["ođđj", "guov", "njuk", "cuoŋ", "mies", "geas", "suoi", "borg", "čakč", "golg", "skáb", "juov", ""], MonthGenitiveNames: ["ođđajagemánu", "guovvamánu", "njukčamánu", "cuoŋománu", "miessemánu", "geassemánu", "suoidnemánu", "borgemánu", "čakčamánu", "golggotmánu", "skábmamánu", "juovlamánu", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	3152: {LCID: 3152, Name: "mn-Mong-MN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "₮", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 0], DayNames: ["ᠨᠢᠮ᠎ᠠ", "ᠳᠠᠸᠠ", "ᠮᠢᠭᠮᠠᠷ", "ᡀᠠᠭᠪᠠ", "ᠫᠦᠷᠪᠦ", "ᠪᠠᠰᠠᠩ", "ᠪᠢᠮᠪᠠ"], AbbreviatedDayNames: ["ᠨᠢᠮ᠎ᠠ", "ᠳᠠᠸᠠ", "ᠮᠢᠭᠮᠠᠷ", "ᡀᠠᠭᠪᠠ", "ᠫᠦᠷᠪᠦ", "ᠪᠠᠰᠠᠩ", "ᠪᠢᠮᠪᠠ"], MonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], AbbreviatedMonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	3153: {LCID: 3153, Name: "dz-BT", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Nu.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["གཟའ་ཟླ་བ་", "གཟའ་མིག་དམར་", "གཟའ་ལྷག་པ་", "གཟའ་ཕུར་བུ་", "གཟའ་པ་སངས་", "གཟའ་སྤེན་པ་", "གཟའ་ཉི་མ་"], AbbreviatedDayNames: ["ཟླ་", "མིར་", "ལྷག་", "ཕུར་", "སངས་", "སྤེན་", "ཉི་"], MonthNames: ["སྤྱི་ཟླ་དངཔ་", "སྤྱི་ཟླ་གཉིས་པ་", "སྤྱི་ཟླ་གསུམ་པ་", "སྤྱི་ཟླ་བཞི་པ", "སྤྱི་ཟླ་ལྔ་པ་", "སྤྱི་ཟླ་དྲུག་པ", "སྤྱི་ཟླ་བདུན་པ་", "སྤྱི་ཟླ་བརྒྱད་པ་", "སྤྱི་ཟླ་དགུ་པ་", "སྤྱི་ཟླ་བཅུ་པ་", "སྤྱི་ཟླ་བཅུ་གཅིག་པ་", "སྤྱི་ཟླ་བཅུ་གཉིས་པ་", ""], AbbreviatedMonthNames: ["ཟླ་༡", "ཟླ་༢", "ཟླ་༣", "ཟླ་༤", "ཟླ་༥", "ཟླ་༦", "ཟླ་༧", "ཟླ་༨", "ཟླ་༩", "ཟླ་༡༠", "ཟླ་༡༡", "ཟླ་༡༢", ""], MonthGenitiveNames: ["ཟླ་དངཔ་", "ཟླ་གཉིས་པ་", "ཟླ་གསུམ་པ་", "ཟླ་བཞི་པ་", "ཟླ་ལྔ་པ་", "ཟླ་དྲུག་པ", "ཟླ་བདུན་པ་", "ཟླ་བརྒྱད་པ་", "ཟླ་དགུ་པ་", "ཟླ་བཅུ་པ་", "ཟླ་བཅུ་གཅིག་པ་", "ཟླ་བཅུ་གཉིས་པ་", ""], AbbreviatedMonthGenitiveNames: ["༡", "༢", "༣", "༤", "༥", "༦", "༧", "༨", "༩", "༡༠", "༡༡", "12", ""], AMDesignator: "སྔ་ཆ་", PMDesignator: "ཕྱི་ཆ་", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	3179: {LCID: 3179, Name: "quz-PE", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "S/.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], AbbreviatedDayNames: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sab"], MonthNames: ["Qulla puquy", "Hatun puquy", "Pauqar waray", "ayriwa", "Aymuray", "Inti raymi", "Anta Sitwa", "Qhapaq Sitwa", "Uma raymi", "Kantaray", "Ayamarq'a", "Kapaq Raymi", ""], AbbreviatedMonthNames: ["Qul", "Hat", "Pau", "ayr", "Aym", "Int", "Ant", "Qha", "Uma", "Kan", "Aya", "Kap", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	4096: {LCID: 4096, Name: "aa", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Br", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Acaada", "Etleeni", "Talaata", "Arbaqa", "Kamiisi", "Gumqata", "Sabti"], AbbreviatedDayNames: ["Aca", "Etl", "Tal", "Arb", "Kam", "Gum", "Sab"], MonthNames: ["Qunxa Garablu", "Kudo", "Ciggilta Kudo", "Agda Baxis", "Caxah Alsa", "Qasa Dirri", "Qado Dirri", "Liiqen", "Waysu", "Diteli", "Ximoli", "Kaxxa Garablu", ""], AbbreviatedMonthNames: ["Qun", "Nah", "Cig", "Agd", "Cax", "Qas", "Qad", "Leq", "Way", "Dit", "Xim", "Kax", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "saaku", PMDesignator: "carra", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	4097: {LCID: 4097, Name: "ar-LY", CurrencyPositivePattern: 0, CurrencyNegativePattern: 3, CurrencySymbol: "د.ل.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	4100: {LCID: 4100, Name: "zh-SG", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	4103: {LCID: 4103, Name: "de-LU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], MonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.", ""], AMDesignator: "vorm.", PMDesignator: "nachm.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	4105: {LCID: 4105, Name: "en-CA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	4106: {LCID: 4106, Name: "es-GT", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Q", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	4108: {LCID: 4108, Name: "fr-CH", CurrencyPositivePattern: 2, CurrencyNegativePattern: 2, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	4122: {LCID: 4122, Name: "hr-BA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "KM", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac", ""], AbbreviatedMonthNames: ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro", ""], MonthGenitiveNames: ["siječnja", "veljače", "ožujka", "travnja", "svibnja", "lipnja", "srpnja", "kolovoza", "rujna", "listopada", "studenoga", "prosinca", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	4155: {LCID: 4155, Name: "smj-NO", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["sådnåbiejvve", "mánnodahka", "dijstahka", "gasskavahkko", "duorastahka", "bierjjedahka", "lávvodahka"], AbbreviatedDayNames: ["såd", "mán", "dis", "gas", "duor", "bier", "láv"], MonthNames: ["ådåjakmánno", "guovvamánno", "sjnjuktjamánno", "vuoratjismánno", "moarmesmánno", "biehtsemánno", "sjnjilltjamánno", "bårggemánno", "ragátmánno", "gålgådismánno", "basádismánno", "javllamánno", ""], AbbreviatedMonthNames: ["ådåj", "guov", "snju", "vuor", "moar", "bieh", "snji", "bårg", "ragá", "gålg", "basá", "javl", ""], MonthGenitiveNames: ["ådåjakmáno", "guovvamáno", "sjnjuktjamáno", "vuoratjismáno", "moarmesmáno", "biehtsemáno", "sjnjilltjamáno", "bårggemáno", "ragátmáno", "gålgådismáno", "basádismáno", "javllamáno", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	4191: {LCID: 4191, Name: "tzm-Tfng-MA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ⴷⵔ", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["ⴰⵙⴰⵎⴰⵙ", "ⴰⵢⵏⴰⵙ", "ⴰⵙⵉⵏⴰⵙ", "ⴰⴽⵕⴰⵙ", "ⴰⴽⵡⴰⵙ", "ⴰⵙⵉⵎⵡⴰⵙ", "ⴰⵙⵉⴹⵢⴰⵙ"], AbbreviatedDayNames: ["ⵙⵎⵙ", "ⵢⵏⵙ", "ⵙⵏⵙ", "ⴽⵕⵙ", "ⴽⵡⵙ", "ⵙⵎⵡ", "ⵙⴹⵙ"], MonthNames: ["ⵉⵏⵏⴰⵢⵔ", "ⴱⵕⴰⵢⵕ", "ⵎⴰⵕⵚ", "ⵉⴱⵔⵉⵔ", "ⵎⴰⵢⵢⵓ", "ⵢⵓⵏⵢⵓ", "ⵢⵓⵍⵢⵓⵣ", "ⵖⵓⵛⵜ", "ⵛⵓⵜⴰⵏⴱⵉⵔ", "ⴽⵜⵓⴱⵕ", "ⵏⵓⵡⴰⵏⴱⵉⵔ", "ⴷⵓⵊⴰⵏⴱⵉⵔ", ""], AbbreviatedMonthNames: ["ⵏⵢⵔ", "ⴱⵕⵢ", "ⵎⵕⵚ", "ⴱⵔⵔ", "ⵎⵢⵢ", "ⵢⵏⵢ", "ⵢⵍⵢ", "ⵖⵛⵜ", "ⵛⵜⵏ", "ⴽⵜⴱ", "ⵏⵡⴱ", "ⴷⵊⵏ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	5121: {LCID: 5121, Name: "ar-DZ", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ج.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["جانفييه", "فيفرييه", "مارس", "أفريل", "مي", "جوان", "جوييه", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["جانفييه", "فيفرييه", "مارس", "أفريل", "مي", "جوان", "جوييه", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	5124: {LCID: 5124, Name: "zh-MO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "MOP", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	5127: {LCID: 5127, Name: "de-LI", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "CHF", NumberDecimalSeparator: ".", NumberGroupSeparator: "'", NumberGroupSizes: [3], DayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], AbbreviatedDayNames: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."], MonthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sep.", "Okt.", "Nov.", "Dez.", ""], AMDesignator: "vorm.", PMDesignator: "nachm.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	5129: {LCID: 5129, Name: "en-NZ", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	5130: {LCID: 5130, Name: "es-CR", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₡", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	5132: {LCID: 5132, Name: "fr-LU", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	5146: {LCID: 5146, Name: "bs-Latn-BA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "KM", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "prije podne", PMDesignator: "popodne", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	5179: {LCID: 5179, Name: "smj-SE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["ájllek", "mánnodahka", "dijstahka", "gasskavahkko", "duorastahka", "bierjjedahka", "lávvodahka"], AbbreviatedDayNames: ["ájl", "mán", "dis", "gas", "duor", "bier", "láv"], MonthNames: ["ådåjakmánno", "guovvamánno", "sjnjuktjamánno", "vuoratjismánno", "moarmesmánno", "biehtsemánno", "sjnjilltjamánno", "bårggemánno", "ragátmánno", "gålgådismánno", "basádismánno", "javllamánno", ""], AbbreviatedMonthNames: ["ådåj", "guov", "snju", "vuor", "moar", "bieh", "snji", "bårg", "ragá", "gålg", "basá", "javl", ""], MonthGenitiveNames: ["ådåjakmáno", "guovvamáno", "sjnjuktjamáno", "vuoratjismáno", "moarmesmáno", "biehtsemáno", "sjnjilltjamáno", "bårggemáno", "ragátmáno", "gålgådismáno", "basádismáno", "javllamáno", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	6145: {LCID: 6145, Name: "ar-MA", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.م.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليوز", "غشت", "شتنبر", "أكتوبر", "نونبر", "دجنبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	6153: {LCID: 6153, Name: "en-IE", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "€", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	6154: {LCID: 6154, Name: "es-PA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "B/.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "315"},
	6156: {LCID: 6156, Name: "fr-MC", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	6170: {LCID: 6170, Name: "sr-Latn-BA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "KM", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pre podne", PMDesignator: "po podne", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	6203: {LCID: 6203, Name: "sma-NO", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["aejlege", "måanta", "dæjsta", "gaskevåhkoe", "duarsta", "bearjadahke", "laavvardahke"], AbbreviatedDayNames: ["aej", "måa", "dæj", "gask", "duar", "bearj", "laav"], MonthNames: ["tsïengele", "goevte", "njoktje", "voerhtje", "suehpede", "ruffie", "snjaltje", "mïetske", "skïerede", "golke", "rahka", "goeve", ""], AbbreviatedMonthNames: ["tsïen", "goevt", "njok", "voer", "sueh", "ruff", "snja", "mïet", "skïer", "golk", "rahk", "goev", ""], MonthGenitiveNames: ["tsïengelen", "goevten", "njoktjen", "voerhtjen", "suehpeden", "ruffien", "snjaltjen", "mïetsken", "skïereden", "golken", "rahkan", "goeven", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	7169: {LCID: 7169, Name: "ar-TN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ت.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["جانفييه", "فيفرييه", "مارس", "أفريل", "مي", "جوان", "جوييه", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["جانفييه", "فيفرييه", "مارس", "أفريل", "مي", "جوان", "جوييه", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	7177: {LCID: 7177, Name: "en-ZA", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "R", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	7178: {LCID: 7178, Name: "es-DO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	7180: {LCID: 7180, Name: "fr-029", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "EC$", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	7194: {LCID: 7194, Name: "sr-Cyrl-BA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "КМ", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недјеља", "понедјељак", "уторак", "сриједа", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед", "пон", "уто", "сри", "чет", "пет", "суб"], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јуни", "јули", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	7227: {LCID: 7227, Name: "sma-SE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["aejlege", "måanta", "dæjsta", "gaskevåhkoe", "duarsta", "bearjadahke", "laavvardahke"], AbbreviatedDayNames: ["aej", "måa", "dæj", "gask", "duar", "bearj", "laav"], MonthNames: ["tsïengele", "goevte", "njoktje", "voerhtje", "suehpede", "ruffie", "snjaltje", "mïetske", "skïerede", "golke", "rahka", "goeve", ""], AbbreviatedMonthNames: ["tsïen", "goevt", "njok", "voer", "sueh", "ruff", "snja", "mïet", "skïer", "golk", "rahk", "goev", ""], MonthGenitiveNames: ["tsïengelen", "goevten", "njoktjen", "voerhtjen", "suehpeden", "ruffien", "snjaltjen", "mïetsken", "skïereden", "golken", "rahkan", "goeven", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	8193: {LCID: 8193, Name: "ar-OM", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ر.ع.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	8201: {LCID: 8201, Name: "en-JM", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	8202: {LCID: 8202, Name: "es-VE", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "Bs.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	8204: {LCID: 8204, Name: "fr-RE", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	8218: {LCID: 8218, Name: "bs-Cyrl-BA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "КМ", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недјеља", "понедјељак", "уторак", "сриједа", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	8251: {LCID: 8251, Name: "sms-FI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pâ´sspei´vv", "vuõssargg", "mââibargg", "seärad", "neljdpei´vv", "piâtnâc", "sue´vet"], AbbreviatedDayNames: ["pâ", "vu", "mâ", "se", "ne", "pi", "su"], MonthNames: ["ođđee´jjmään", "tä´lvvmään", "pâ´zzlâšttam-mään", "njuhččmään", "vue´ssmään", "ǩie´ssmään", "suei´nnmään", "på´rǧǧmään", "čõhččmään", "kålggmään", "skamm-mään", "rosttovmään", ""], AbbreviatedMonthNames: ["ođđee´jjmään", "tä´lvvmään", "pâ´zzlâšttam-mään", "njuhččmään", "vue´ssmään", "ǩie´ssmään", "suei´nnmään", "på´rǧǧmään", "čõhččmään", "kålggmään", "skamm-mään", "rosttovmään", ""], MonthGenitiveNames: ["ođđee´jjmannu", "tä´lvvmannu", "pâ´zzlâšttam-mannu", "njuhččmannu", "vue´ssmannu", "ǩie´ssmannu", "suei´nnmannu", "på´rǧǧmannu", "čõhččmannu", "kålggmannu", "skamm-mannu", "rosttovmannu", ""], AbbreviatedMonthGenitiveNames: ["ođđee´jjmannu", "tä´lvvmannu", "pâ´zzlâšttam-mannu", "njuhččmannu", "vue´ssmannu", "ǩie´ssmannu", "suei´nnmannu", "på´rǧǧmannu", "čõhččmannu", "kålggmannu", "skamm-mannu", "rosttovmannu", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	9217: {LCID: 9217, Name: "ar-YE", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ر.ي.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	9225: {LCID: 9225, Name: "en-029", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "EC$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	9226: {LCID: 9226, Name: "es-CO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	9228: {LCID: 9228, Name: "fr-CD", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "FC", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	9242: {LCID: 9242, Name: "sr-Latn-RS", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "RSD", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pre podne", PMDesignator: "po podne", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	9275: {LCID: 9275, Name: "smn-FI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pasepeivi", "vuossargâ", "majebargâ", "koskokko", "tuorâstâh", "vástuppeivi", "lávurdâh"], AbbreviatedDayNames: ["pas", "vuo", "maj", "kos", "tuo", "vás", "láv"], MonthNames: ["uđđâivemáánu", "kuovâmáánu", "njuhčâmáánu", "cuáŋuimáánu", "vyesimáánu", "kesimáánu", "syeinimáánu", "porgemáánu", "čohčâmáánu", "roovvâdmáánu", "skammâmáánu", "juovlâmáánu", ""], AbbreviatedMonthNames: ["uđiv", "kuov", "njuh", "cuáŋ", "vyes", "kesi", "syei", "porg", "čohč", "roov", "skam", "juov", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	10241: {LCID: 10241, Name: "ar-SY", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ل.س.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], AbbreviatedMonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	10249: {LCID: 10249, Name: "en-BZ", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	10250: {LCID: 10250, Name: "es-PE", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "S/.", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Set.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "set.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	10252: {LCID: 10252, Name: "fr-SN", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	10266: {LCID: 10266, Name: "sr-Cyrl-RS", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "дин.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед.", "пон.", "ут.", "ср.", "чет.", "пет.", "суб."], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан.", "феб.", "март", "апр.", "мај", "јун", "јул", "авг.", "септ.", "окт.", "нов.", "дец.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	11265: {LCID: 11265, Name: "ar-JO", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ا.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], AbbreviatedMonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	11273: {LCID: 11273, Name: "en-TT", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	11274: {LCID: 11274, Name: "es-AR", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	11276: {LCID: 11276, Name: "fr-CM", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "FCFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	11290: {LCID: 11290, Name: "sr-Latn-ME", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pre podne", PMDesignator: "po podne", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	12289: {LCID: 12289, Name: "ar-LB", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ل.ل.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], AbbreviatedMonthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	12297: {LCID: 12297, Name: "en-ZW", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "US$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	12298: {LCID: 12298, Name: "es-EC", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	12300: {LCID: 12300, Name: "fr-CI", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	12314: {LCID: 12314, Name: "sr-Cyrl-ME", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недеља", "понедјељак", "уторак", "сриједа", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед", "пон", "уто", "сри", "чет", "пет", "суб"], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	13313: {LCID: 13313, Name: "ar-KW", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ك.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	13321: {LCID: 13321, Name: "en-PH", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "₱", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	13322: {LCID: 13322, Name: "es-CL", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	13324: {LCID: 13324, Name: "fr-ML", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	14337: {LCID: 14337, Name: "ar-AE", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.إ.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	14345: {LCID: 14345, Name: "en-ID", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Rp", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	14346: {LCID: 14346, Name: "es-UY", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "$", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Set.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "set.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	14348: {LCID: 14348, Name: "fr-MA", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "DH", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	15361: {LCID: 15361, Name: "ar-BH", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "د.ب.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "ابريل", "مايو", "يونيو", "يوليو", "اغسطس", "سبتمبر", "اكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	15369: {LCID: 15369, Name: "en-HK", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	15370: {LCID: 15370, Name: "es-PY", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₲", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	15372: {LCID: 15372, Name: "fr-HT", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "G", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], AbbreviatedDayNames: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."], MonthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", ""], AbbreviatedMonthNames: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", ""], MonthGenitiveNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre", ""], AbbreviatedMonthGenitiveNames: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc.", ""], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	16385: {LCID: 16385, Name: "ar-QA", CurrencyPositivePattern: 2, CurrencyNegativePattern: 3, CurrencySymbol: "ر.ق.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], AbbreviatedDayNames: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], MonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], AbbreviatedMonthNames: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليه", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ص", PMDesignator: "م", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	16393: {LCID: 16393, Name: "en-IN", CurrencyPositivePattern: 2, CurrencyNegativePattern: 12, CurrencySymbol: "₹", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 2], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	16394: {LCID: 16394, Name: "es-BO", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "Bs", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	17417: {LCID: 17417, Name: "en-MY", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "RM", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	17418: {LCID: 17418, Name: "es-SV", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	18441: {LCID: 18441, Name: "en-SG", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], AbbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], MonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], AbbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	18442: {LCID: 18442, Name: "es-HN", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "L", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	19466: {LCID: 19466, Name: "es-NI", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "C$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	20490: {LCID: 20490, Name: "es-PR", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "315"},
	21514: {LCID: 21514, Name: "es-US", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"], MonthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthNames: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	22538: {LCID: 22538, Name: "es-419", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "XDR", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	23562: {LCID: 23562, Name: "es-CU", CurrencyPositivePattern: 0, CurrencyNegativePattern: 1, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], AbbreviatedDayNames: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."], MonthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", ""], AbbreviatedMonthNames: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sept.", "Oct.", "Nov.", "Dic.", ""], MonthGenitiveNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre", ""], AbbreviatedMonthGenitiveNames: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic.", ""], AMDesignator: "a. m.", PMDesignator: "p. m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	25626: {LCID: 25626, Name: "bs-Cyrl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "КМ", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недјеља", "понедјељак", "уторак", "сриједа", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан", "феб", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "нов", "дец", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	26650: {LCID: 26650, Name: "bs-Latn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "KM", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "prije podne", PMDesignator: "popodne", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	27674: {LCID: 27674, Name: "sr-Cyrl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "дин.", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["недеља", "понедељак", "уторак", "среда", "четвртак", "петак", "субота"], AbbreviatedDayNames: ["нед.", "пон.", "ут.", "ср.", "чет.", "пет.", "суб."], MonthNames: ["јануар", "фебруар", "март", "април", "мај", "јун", "јул", "август", "септембар", "октобар", "новембар", "децембар", ""], AbbreviatedMonthNames: ["јан.", "феб.", "март", "апр.", "мај", "јун", "јул", "авг.", "септ.", "окт.", "нов.", "дец.", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	28698: {LCID: 28698, Name: "sr-Latn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "RSD", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pre podne", PMDesignator: "po podne", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	28731: {LCID: 28731, Name: "smn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pasepeivi", "vuossargâ", "majebargâ", "koskokko", "tuorâstâh", "vástuppeivi", "lávurdâh"], AbbreviatedDayNames: ["pas", "vuo", "maj", "kos", "tuo", "vás", "láv"], MonthNames: ["uđđâivemáánu", "kuovâmáánu", "njuhčâmáánu", "cuáŋuimáánu", "vyesimáánu", "kesimáánu", "syeinimáánu", "porgemáánu", "čohčâmáánu", "roovvâdmáánu", "skammâmáánu", "juovlâmáánu", ""], AbbreviatedMonthNames: ["uđiv", "kuov", "njuh", "cuáŋ", "vyes", "kesi", "syei", "porg", "čohč", "roov", "skam", "juov", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	29740: {LCID: 29740, Name: "az-Cyrl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "₼", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["базар", "базар ертәси", "чәршәнбә ахшамы", "чәршәнбә", "ҹүмә ахшамы", "ҹүмә", "шәнбә"], AbbreviatedDayNames: ["Б", "Бе", "Ча", "Ч", "Ҹа", "Ҹ", "Ш"], MonthNames: ["jанвар", "феврал", "март", "апрел", "мај", "ијун", "ијул", "август", "сентјабр", "октјабр", "нојабр", "декабр", ""], AbbreviatedMonthNames: ["Јан", "Фев", "Мар", "Апр", "Мај", "Ијун", "Ијул", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], MonthGenitiveNames: ["јанвар", "феврал", "март", "апрел", "мај", "ијун", "ијул", "август", "сентјабр", "октјабр", "нојабр", "декабр", ""], AbbreviatedMonthGenitiveNames: ["Јан", "Фев", "Мар", "Апр", "мая", "ијун", "ијул", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	29755: {LCID: 29755, Name: "sms", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["pâ´sspei´vv", "vuõssargg", "mââibargg", "seärad", "neljdpei´vv", "piâtnâc", "sue´vet"], AbbreviatedDayNames: ["pâ", "vu", "mâ", "se", "ne", "pi", "su"], MonthNames: ["ođđee´jjmään", "tä´lvvmään", "pâ´zzlâšttam-mään", "njuhččmään", "vue´ssmään", "ǩie´ssmään", "suei´nnmään", "på´rǧǧmään", "čõhččmään", "kålggmään", "skamm-mään", "rosttovmään", ""], AbbreviatedMonthNames: ["ođđee´jjmään", "tä´lvvmään", "pâ´zzlâšttam-mään", "njuhččmään", "vue´ssmään", "ǩie´ssmään", "suei´nnmään", "på´rǧǧmään", "čõhččmään", "kålggmään", "skamm-mään", "rosttovmään", ""], MonthGenitiveNames: ["ođđee´jjmannu", "tä´lvvmannu", "pâ´zzlâšttam-mannu", "njuhččmannu", "vue´ssmannu", "ǩie´ssmannu", "suei´nnmannu", "på´rǧǧmannu", "čõhččmannu", "kålggmannu", "skamm-mannu", "rosttovmannu", ""], AbbreviatedMonthGenitiveNames: ["ođđee´jjmannu", "tä´lvvmannu", "pâ´zzlâšttam-mannu", "njuhččmannu", "vue´ssmannu", "ǩie´ssmannu", "suei´nnmannu", "på´rǧǧmannu", "čõhččmannu", "kålggmannu", "skamm-mannu", "rosttovmannu", ""], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "025"},
	30724: {LCID: 30724, Name: "zh", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	30740: {LCID: 30740, Name: "nn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["søndag", "måndag", "tysdag", "onsdag", "torsdag", "fredag", "laurdag"], AbbreviatedDayNames: ["sø.", "må.", "ty.", "on.", "to.", "fr.", "la."], MonthNames: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mars", "apr.", "mai", "juni", "juli", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "f.m.", PMDesignator: "e.m.", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	30746: {LCID: 30746, Name: "bs", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "KM", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedjelja", "ponedjeljak", "utorak", "srijeda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sri", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "juni", "juli", "august", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "prije podne", PMDesignator: "popodne", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	30764: {LCID: 30764, Name: "az-Latn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₼", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["bazar", "bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə"], AbbreviatedDayNames: ["B.", "B.E.", "Ç.A.", "Ç.", "C.A.", "C.", "Ş."], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avq", "sen", "okt", "noy", "dek", ""], MonthGenitiveNames: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	30779: {LCID: 30779, Name: "sma", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["aejlege", "måanta", "dæjsta", "gaskevåhkoe", "duarsta", "bearjadahke", "laavvardahke"], AbbreviatedDayNames: ["aej", "måa", "dæj", "gask", "duar", "bearj", "laav"], MonthNames: ["tsïengele", "goevte", "njoktje", "voerhtje", "suehpede", "ruffie", "snjaltje", "mïetske", "skïerede", "golke", "rahka", "goeve", ""], AbbreviatedMonthNames: ["tsïen", "goevt", "njok", "voer", "sueh", "ruff", "snja", "mïet", "skïer", "golk", "rahk", "goev", ""], MonthGenitiveNames: ["tsïengelen", "goevten", "njoktjen", "voerhtjen", "suehpeden", "ruffien", "snjaltjen", "mïetsken", "skïereden", "golken", "rahkan", "goeven", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	30787: {LCID: 30787, Name: "uz-Cyrl", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "сўм", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшанба", "душанба", "сешанба", "чоршанба", "пайшанба", "жума", "шанба"], AbbreviatedDayNames: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"], MonthNames: ["Январ", "Феврал", "Март", "Апрел", "Май", "Июн", "Июл", "Август", "Сентябр", "Октябр", "Ноябр", "Декабр", ""], AbbreviatedMonthNames: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	30800: {LCID: 30800, Name: "mn-Cyrl", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₮", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ням", "даваа", "мягмар", "лхагва", "пүрэв", "баасан", "бямба"], AbbreviatedDayNames: ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"], MonthNames: ["Нэгдүгээр сар", "Хоёрдугаар сар", "Гуравдугаар сар", "Дөрөвдүгээр сар", "Тавдугаар сар", "Зургадугаар сар", "Долдугаар сар", "Наймдугаар сар", "Есдүгээр сар", "Аравдугаар сар", "Арван нэгдүгээр сар", "Арван хоёрдугаар сар", ""], AbbreviatedMonthNames: ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "ҮӨ", PMDesignator: "ҮХ", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	30813: {LCID: 30813, Name: "iu-Cans", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ᓈᑦᑏᖑᔭ", "ᓇᒡᒐᔾᔭᐅ", "ᐊᐃᑉᐱᖅ", "ᐱᖓᑦᓯᖅ", "ᓯᑕᒻᒥᖅ", "ᑕᓪᓕᕐᒥᖅ", "ᓯᕙᑖᕐᕕᒃ"], AbbreviatedDayNames: ["ᓈᑦᑏ", "ᓇᒡᒐ", "ᐊᐃᑉᐱ", "ᐱᖓᑦᓯ", "ᓯᑕ", "ᑕᓪᓕ", "ᓯᕙᑖᕐᕕᒃ"], MonthNames: ["ᔮᓐᓄᐊᕆ", "ᕖᕝᕗᐊᕆ", "ᒫᑦᓯ", "ᐄᐳᕆ", "ᒪᐃ", "ᔫᓂ", "ᔪᓚᐃ", "ᐋᒡᒌᓯ", "ᓯᑎᐱᕆ", "ᐅᑐᐱᕆ", "ᓄᕕᐱᕆ", "ᑎᓯᐱᕆ", ""], AbbreviatedMonthNames: ["ᔮᓐᓄ", "ᕖᕝᕗ", "ᒫᑦᓯ", "ᐄᐳᕆ", "ᒪᐃ", "ᔫᓂ", "ᔪᓚᐃ", "ᐋᒡᒌ", "ᓯᑎᐱ", "ᐅᑐᐱ", "ᓄᕕᐱ", "ᑎᓯᐱ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	30815: {LCID: 30815, Name: "tzm-Tfng", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "ⴷⵔ", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["ⴰⵙⴰⵎⴰⵙ", "ⴰⵢⵏⴰⵙ", "ⴰⵙⵉⵏⴰⵙ", "ⴰⴽⵕⴰⵙ", "ⴰⴽⵡⴰⵙ", "ⴰⵙⵉⵎⵡⴰⵙ", "ⴰⵙⵉⴹⵢⴰⵙ"], AbbreviatedDayNames: ["ⵙⵎⵙ", "ⵢⵏⵙ", "ⵙⵏⵙ", "ⴽⵕⵙ", "ⴽⵡⵙ", "ⵙⵎⵡ", "ⵙⴹⵙ"], MonthNames: ["ⵉⵏⵏⴰⵢⵔ", "ⴱⵕⴰⵢⵕ", "ⵎⴰⵕⵚ", "ⵉⴱⵔⵉⵔ", "ⵎⴰⵢⵢⵓ", "ⵢⵓⵏⵢⵓ", "ⵢⵓⵍⵢⵓⵣ", "ⵖⵓⵛⵜ", "ⵛⵓⵜⴰⵏⴱⵉⵔ", "ⴽⵜⵓⴱⵕ", "ⵏⵓⵡⴰⵏⴱⵉⵔ", "ⴷⵓⵊⴰⵏⴱⵉⵔ", ""], AbbreviatedMonthNames: ["ⵏⵢⵔ", "ⴱⵕⵢ", "ⵎⵕⵚ", "ⴱⵔⵔ", "ⵎⵢⵢ", "ⵢⵏⵢ", "ⵢⵍⵢ", "ⵖⵛⵜ", "ⵛⵜⵏ", "ⴽⵜⴱ", "ⵏⵡⴱ", "ⴷⵊⵏ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	31748: {LCID: 31748, Name: "zh-Hant", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "HK$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], AbbreviatedDayNames: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"], MonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], AbbreviatedMonthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "上午", PMDesignator: "下午", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	31764: {LCID: 31764, Name: "nb", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"], AbbreviatedDayNames: ["søn.", "man.", "tir.", "ons.", "tor.", "fre.", "lør."], MonthNames: ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: ["jan.", "feb.", "mar.", "apr.", "mai", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "des.", ""], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "135"},
	31770: {LCID: 31770, Name: "sr", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "RSD", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"], AbbreviatedDayNames: ["ned", "pon", "uto", "sre", "čet", "pet", "sub"], MonthNames: ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar", ""], AbbreviatedMonthNames: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "pre podne", PMDesignator: "po podne", DateSeparator: ".", TimeSeparator: ".", ShortDatePattern: "025"},
	31784: {LCID: 31784, Name: "tg-Cyrl", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "смн", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["якшанбе", "душанбе", "сешанбе", "чоршанбе", "панҷшанбе", "ҷумъа", "шанбе"], AbbreviatedDayNames: ["пкш", "дшб", "сшб", "чшб", "пшб", "ҷум", "шнб"], MonthNames: ["январ", "феврал", "март", "апрел", "май", "июн", "июл", "август", "сентябр", "октябр", "ноябр", "декабр", ""], AbbreviatedMonthNames: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ".", TimeSeparator: ":", ShortDatePattern: "135"},
	31790: {LCID: 31790, Name: "dsb", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "€", NumberDecimalSeparator: ",", NumberGroupSeparator: ".", NumberGroupSizes: [3], DayNames: ["njeźela", "ponjeźele", "wałtora", "srjoda", "stwórtk", "pětk", "sobota"], AbbreviatedDayNames: ["nje", "pon", "wał", "srj", "stw", "pět", "sob"], MonthNames: ["januar", "februar", "měrc", "apryl", "maj", "junij", "julij", "awgust", "september", "oktober", "nowember", "december", ""], AbbreviatedMonthNames: ["jan", "feb", "měr", "apr", "maj", "jun", "jul", "awg", "sep", "okt", "now", "dec", ""], MonthGenitiveNames: ["januara", "februara", "měrca", "apryla", "maja", "junija", "julija", "awgusta", "septembra", "oktobra", "nowembra", "decembra", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: ". ", TimeSeparator: ":", ShortDatePattern: "025"},
	31803: {LCID: 31803, Name: "smj", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "kr", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["ájllek", "mánnodahka", "dijstahka", "gasskavahkko", "duorastahka", "bierjjedahka", "lávvodahka"], AbbreviatedDayNames: ["ájl", "mán", "dis", "gas", "duor", "bier", "láv"], MonthNames: ["ådåjakmánno", "guovvamánno", "sjnjuktjamánno", "vuoratjismánno", "moarmesmánno", "biehtsemánno", "sjnjilltjamánno", "bårggemánno", "ragátmánno", "gålgådismánno", "basádismánno", "javllamánno", ""], AbbreviatedMonthNames: ["ådåj", "guov", "snju", "vuor", "moar", "bieh", "snji", "bårg", "ragá", "gålg", "basá", "javl", ""], MonthGenitiveNames: ["ådåjakmáno", "guovvamáno", "sjnjuktjamáno", "vuoratjismáno", "moarmesmáno", "biehtsemáno", "sjnjilltjamáno", "bårggemáno", "ragátmáno", "gålgådismáno", "basádismáno", "javllamáno", ""], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "531"},
	31811: {LCID: 31811, Name: "uz-Latn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "soʻm", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], AbbreviatedDayNames: ["Yaksh", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"], MonthNames: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr", ""], AbbreviatedMonthNames: ["Yanv", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noya", "Dek", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "TO", PMDesignator: "TK", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
	31814: {LCID: 31814, Name: "pa-Arab", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته", "اتوار"], AbbreviatedDayNames: ["پير", "منگل", "بدھ", "جمعرات", "جمعه", "هفته", "اتوار"], MonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], AbbreviatedMonthNames: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "-", TimeSeparator: ".", ShortDatePattern: "134"},
	31824: {LCID: 31824, Name: "mn-Mong", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "¥", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3, 0], DayNames: ["ᠭᠠᠷᠠᠭ ᠤᠨ ᠡᠳᠦᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠨᠢᠭᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠬᠣᠶᠠᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠭᠤᠷᠪᠠᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠳᠥᠷᠪᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠲᠠᠪᠤᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠵᠢᠷᠭᠤᠭᠠᠨ"], AbbreviatedDayNames: ["ᠭᠠᠷᠠᠭ ᠤᠨ ᠡᠳᠦᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠨᠢᠭᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠬᠣᠶᠠᠷ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠭᠤᠷᠪᠠᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠳᠥᠷᠪᠡᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠲᠠᠪᠤᠨ", "ᠭᠠᠷᠠᠭ ᠤᠨ ᠵᠢᠷᠭᠤᠭᠠᠨ"], MonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], AbbreviatedMonthNames: ["ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠭᠤᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠦᠷᠪᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠠᠪᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠵᠢᠷᠭᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠲᠤᠯᠤᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠨᠠᠢᠮᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠶᠢᠰᠦᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠨᠢᠭᠡᠳᠦᠭᠡᠷ ᠰᠠᠷ᠎ᠠ", "ᠠᠷᠪᠠᠨ ᠬᠤᠶ᠋ᠠᠳᠤᠭᠠᠷ ᠰᠠᠷ᠎ᠠ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "520"},
	31833: {LCID: 31833, Name: "sd-Arab", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "Rs", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["سومر", "اڱارو", "اربع", "خميس", "جمعو", "ڇنڇر", "آچر"], AbbreviatedDayNames: ["سو", "اڱ", "ار", "خم", "جمعو", "ڇن", "آچ"], MonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], AbbreviatedMonthNames: ["جنوري", "فروري", "مارچ", "اپريل", "مٔي", "جون", "جولاءِ", "آگست", "ستمبر", "آکتوبر", "نومبر", "ڊسمبر", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	31836: {LCID: 31836, Name: "chr-Cher", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["ᎤᎾᏙᏓᏆᏍᎬ", "ᎤᎾᏙᏓᏉᏅᎯ", "ᏔᎵᏁᎢᎦ", "ᏦᎢᏁᎢᎦ", "ᏅᎩᏁᎢᎦ", "ᏧᎾᎩᎶᏍᏗ", "ᎤᎾᏙᏓᏈᏕᎾ"], AbbreviatedDayNames: ["ᏆᏍᎬ", "ᏉᏅᎯ", "ᏔᎵᏁ", "ᏦᎢᏁ", "ᏅᎩᏁ", "ᏧᎾᎩ", "ᏈᏕᎾ"], MonthNames: ["ᎤᏃᎸᏔᏅ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍᎬᏘ", "ᏕᎭᎷᏱ", "ᎫᏰᏉᏂ", "ᎦᎶᏂ", "ᏚᎵᏍᏗ", "ᏚᏂᏅᏗ", "ᏅᏓᏕᏆ", "ᎤᏍᎩᏱ", ""], AbbreviatedMonthNames: ["ᎤᏃᎸ", "ᎧᎦᎵ", "ᎠᏅᏱ", "ᏝᏬᏂ", "ᎠᏂᏍ", "ᏕᎭᎷ", "ᎫᏰᏉ", "ᎦᎶᏂ", "ᏚᎵᏍ", "ᏚᏂᏅ", "ᏅᏓᏕ", "ᎤᏍᎩ", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "205"},
	31837: {LCID: 31837, Name: "iu-Latn", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "$", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Naattiinguja", "Naggajjau", "Aippiq", "Pingatsiq", "Sitammiq", "Tallirmiq", "Sivataarvik"], AbbreviatedDayNames: ["Nat", "Nag", "Aip", "Pi", "Sit", "Tal", "Siv"], MonthNames: ["Jaannuari", "Viivvuari", "Maatsi", "Iipuri", "Mai", "Juuni", "Julai", "Aaggiisi", "Sitipiri", "Utupiri", "Nuvipiri", "Tisipiri", ""], AbbreviatedMonthNames: ["Jan", "Viv", "Mas", "Ipu", "Mai", "Jun", "Jul", "Agi", "Sii", "Uut", "Nuv", "Tis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "035"},
	31839: {LCID: 31839, Name: "tzm-Latn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "DA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["lh'ed", "letnayen", "ttlata", "larebâa", "lexmis", "ldjemâa", "ssebt"], AbbreviatedDayNames: ["lh'd", "let", "ttl", "lar", "lex", "ldj", "sse"], MonthNames: ["Yennayer", "Furar", "Meghres", "Yebrir", "Magu", "Yunyu", "Yulyu", "Ghuct", "Cutenber", "Tuber", "Nunember", "Dujanbir", ""], AbbreviatedMonthNames: ["Yen", "Fur", "Megh", "Yeb", "May", "Yun", "Yul", "Ghu", "Cut", "Tub", "Nun", "Duj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "-", TimeSeparator: ":", ShortDatePattern: "135"},
	31847: {LCID: 31847, Name: "ff-Latn", CurrencyPositivePattern: 3, CurrencyNegativePattern: 8, CurrencySymbol: "CFA", NumberDecimalSeparator: ",", NumberGroupSeparator: " ", NumberGroupSizes: [3], DayNames: ["alete", "altine", "talaata", "alarba", "alkamiisa", "aljumaa", "asete"], AbbreviatedDayNames: ["alet", "alt.", "tal.", "alar.", "alk.", "alj.", "aset"], MonthNames: ["samwiee", "feeburyee", "marsa", "awril", "me", "suyeŋ", "sulyee", "ut", "satambara", "oktoobar", "nowamburu", "deesamburu", ""], AbbreviatedMonthNames: ["samw", "feeb", "mar", "awr", "me", "suy", "sul", "ut", "sat", "okt", "now", "dees", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "", PMDesignator: "", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	31848: {LCID: 31848, Name: "ha-Latn", CurrencyPositivePattern: 2, CurrencyNegativePattern: 9, CurrencySymbol: "₦", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["Lahadi", "Litinin", "Talata", "Laraba", "Alhamis", "Jummaʼa", "Asabar"], AbbreviatedDayNames: ["Lh", "Li", "Ta", "Lr", "Al", "Ju", "As"], MonthNames: ["Janairu", "Faburairu", "Maris", "Afirilu", "Mayu", "Yuni", "Yuli", "Agusta", "Satumba", "Oktoba", "Nuwamba", "Disamba", ""], AbbreviatedMonthNames: ["Jan", "Fab", "Mar", "Afi", "May", "Yun", "Yul", "Agu", "Sat", "Okt", "Nuw", "Dis", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "AM", PMDesignator: "PM", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "025"},
	31878: {LCID: 31878, Name: "quc-Latn", CurrencyPositivePattern: 0, CurrencyNegativePattern: 0, CurrencySymbol: "Q", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["juq'ij", "kaq'ij", "oxq'ij", "kajq'ij", "joq'ij", "waqq'ij", "wuqq'ij"], AbbreviatedDayNames: ["juq'", "kaq'", "oxq'", "kajq'", "joq'", "waqq'", "wuqq'"], MonthNames: ["nab'e ik'", "ukab' ik'", "urox ik'", "ukaj ik'", "uro ik'", "uwaq ik'", "uwuq ik'", "uwajxaq ik'", "ub'elej ik'", "ulaj ik'", "ujulaj ik'", "ukab'laj ik'", ""], AbbreviatedMonthNames: ["nab'e", "ukab'", "urox", "ukaj", "uro", "uwaq", "uwuq", "uwajxaq", "ub'elej", "ulaj", "ujulaj", "ukab'laj", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "a.m.", PMDesignator: "p.m.", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "135"},
	31890: {LCID: 31890, Name: "ku-Arab", CurrencyPositivePattern: 0, CurrencyNegativePattern: 2, CurrencySymbol: "د.ع.‏", NumberDecimalSeparator: ".", NumberGroupSeparator: ",", NumberGroupSizes: [3], DayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], AbbreviatedDayNames: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "ھەینی", "شەممە"], MonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], AbbreviatedMonthNames: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانونی یەکەم", ""], MonthGenitiveNames: [], AbbreviatedMonthGenitiveNames: [], AMDesignator: "پ.ن", PMDesignator: "د.ن", DateSeparator: "/", TimeSeparator: ":", ShortDatePattern: "531"},
};
var g_oDefaultCultureInfo = g_aCultureInfos[1033];//en-US//1033//fr-FR//1036//basq//1069//ru-Ru//1049//hindi//1081

    //---------------------------------------------------------export---------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].isNumber = isNumber;
    window["AscCommon"].NumFormat = NumFormat;
    window["AscCommon"].CellFormat = CellFormat;
    window["AscCommon"].DecodeGeneralFormat = DecodeGeneralFormat;
    window["AscCommon"].setCurrentCultureInfo = setCurrentCultureInfo;
	window['AscCommon'].getShortDateFormat = getShortDateFormat;
	window['AscCommon'].getShortDateFormat2 = getShortDateFormat2;
	window['AscCommon'].getShortDateMonthFormat = getShortDateMonthFormat;
	window['AscCommon'].getNumberFormatSimple = getNumberFormatSimple;
	window['AscCommon'].getNumberFormat = getNumberFormat;
	window['AscCommon'].getLocaleFormat = getLocaleFormat;
	window['AscCommon'].getCurrencyFormatSimple = getCurrencyFormatSimple;
	window['AscCommon'].getCurrencyFormatSimple2 = getCurrencyFormatSimple2;
	window['AscCommon'].getCurrencyFormat = getCurrencyFormat;
	window['AscCommon'].getFormatCells = getFormatCells;

    window["AscCommon"].gc_nMaxDigCount = gc_nMaxDigCount;
    window["AscCommon"].gc_nMaxDigCountView = gc_nMaxDigCountView;
    window["AscCommon"].oNumFormatCache = oNumFormatCache;
    window["AscCommon"].oGeneralEditFormatCache = oGeneralEditFormatCache;
    window["AscCommon"].g_oFormatParser = g_oFormatParser;
    window["AscCommon"].g_aCultureInfos = g_aCultureInfos;
    window["AscCommon"].g_oDefaultCultureInfo = g_oDefaultCultureInfo;
})(window);
