"use strict";

/**
 * Created by Ilja.Kirillov
 * Date: 27.08.14
 * Time: 16:12
 */

function CParagraphContentBase()
{
}

//----------------------------------------------------------------------------------------------------------------------
// Класс CParagraphContentWithContentBase
//   Это базовый класс для элементов содержимого(контент) параграфа, у которых есть свое содержимое.
//----------------------------------------------------------------------------------------------------------------------
function CParagraphContentWithContentBase()
{
    CParagraphContentWithContentBase.superclass.constructor.call(this);
    
    // Массив Lines разделен на три части
    // 1. Состоит из одного элемента, означающего количество строк
    // 2. Количество элементов указывается в первой части, каждый элемент означает относительный сдвиг начала информации 
    //    о строке в 3 части (поэтому первый элемент всегда равен 0).    
    // 3. Сама информация о начале и конце отрезка в строке. Каждый отрезок представлен парой StartPos, EndPos.
    //
    // Пример. 2 строки, в первой строке 3 отрезка, во второй строке 1 отрезок
    // this.Lines = [2, 0, 6, 0, 15, 15, 17, 17, 20, 20, 25];
    this.Lines = [0];

    this.StartLine   = -1;
    this.StartRange  = -1;
}

Asc.extendClass(CParagraphContentWithContentBase, CParagraphContentBase);

CParagraphContentWithContentBase.prototype.Recalculate_Reset = function(StartRange, StartLine)
{
    this.StartLine   = StartLine;
    this.StartRange  = StartRange;

    this.protected_ClearLines();
};

CParagraphContentWithContentBase.prototype.protected_ClearLines = function()
{
    this.Lines = [0];
};

CParagraphContentWithContentBase.prototype.protected_GetRangeOffset = function(LineIndex, RangeIndex)
{
    return (1 + this.Lines[0] + this.Lines[1 + LineIndex] + RangeIndex * 2);
};

CParagraphContentWithContentBase.prototype.protected_GetRangeStartPos = function(LineIndex, RangeIndex)
{
    return this.Lines[this.protected_GetRangeOffset(LineIndex, RangeIndex)];
};

CParagraphContentWithContentBase.prototype.protected_GetRangeEndPos = function(LineIndex, RangeIndex)
{
    return this.Lines[this.protected_GetRangeOffset(LineIndex, RangeIndex) + 1];
};

CParagraphContentWithContentBase.prototype.protected_GetLinesCount = function()
{
    return this.Lines[0];
};

CParagraphContentWithContentBase.prototype.protected_GetRangesCount = function(LineIndex)
{
    if (LineIndex === this.Lines[0] - 1)
        return (this.Lines.length - this.Lines[1 + LineIndex] - (this.Lines[0] + 1)) / 2;
    else
        return (this.Lines[1 + LineIndex + 1] - this.Lines[1 + LineIndex]) / 2;
};

// Здесь предполагается, что строки с номерами меньше, чем LineIndex заданы, а также заданы и отрезки в строке 
// LineIndex, с номерами меньшими, чем RangeIndex. В данной функции удаляются все записи, которые идут после LineIndex, 
// RangeIndex. Т.е. удаляются все строки, с номерами больше, чем LineIndex, и в строке LineIndex удаляются все отрезки 
// с номерами больше, чем RangeIndex. Возвращается позиция предпоследнего отрезка, либо 0.
CParagraphContentWithContentBase.prototype.protected_AddRange = function(LineIndex, RangeIndex)
{
    // Удаляем лишние записи о строках и отрезках
    if (this.Lines[0] >= LineIndex + 1)
    {
        var RangeOffset = this.protected_GetRangeOffset(LineIndex, 0) + RangeIndex * 2;
        this.Lines.splice(RangeOffset, this.Lines.length - RangeOffset);

        if (this.Lines[0] !== LineIndex + 1 && 0 === RangeIndex)
            this.Lines.splice(LineIndex + 1, this.Lines[0] - LineIndex);
        else if (this.Lines[0] !== LineIndex + 1 && 0 !== RangeIndex)
        {
            this.Lines.splice(LineIndex + 2, this.Lines[0] - LineIndex - 1);
            this.Lines[0] = LineIndex + 1;
        }
    }

    if (0 === RangeIndex)
    {
        if (this.Lines[0] !== LineIndex + 1)
        {
            // Добавляем информацию о новой строке, сначала ее относительный сдвиг, потом меняем само количество строк
            var OffsetValue = this.Lines.length - LineIndex - 1;
            this.Lines.splice(LineIndex + 1, 0, OffsetValue);
            this.Lines[0] = LineIndex + 1;
        }
    }
    
    var RangeOffset = 1 + this.Lines[0] + this.Lines[LineIndex + 1] + RangeIndex * 2; // this.protected_GetRangeOffset(LineIndex, RangeIndex);
    
    // Резервируем место для StartPos и EndPos заданного отрезка
    this.Lines[RangeOffset + 0] = 0;
    this.Lines[RangeOffset + 1] = 0;    
    
    if (0 !== LineIndex || 0 !== RangeIndex)
        return this.Lines[RangeOffset - 1];
    else
        return 0;
};

// Заполняем добавленный отрезок значениями
CParagraphContentWithContentBase.prototype.protected_FillRange = function(LineIndex, RangeIndex, StartPos, EndPos)
{
    var RangeOffset = this.protected_GetRangeOffset(LineIndex, RangeIndex);
    this.Lines[RangeOffset + 0] = StartPos;
    this.Lines[RangeOffset + 1] = EndPos;
};

CParagraphContentWithContentBase.prototype.protected_FillRangeEndPos = function(LineIndex, RangeIndex, EndPos)
{
    var RangeOffset = this.protected_GetRangeOffset(LineIndex, RangeIndex);
    this.Lines[RangeOffset + 1] = EndPos;
};

CParagraphContentWithContentBase.prototype.protected_UpdateSpellChecking = function()
{
    if(undefined !== this.Paragraph && null !== this.Paragraph)
        this.Paragraph.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
};