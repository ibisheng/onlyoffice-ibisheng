"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 29.04.2016
 * Time: 18:23
 */

/**
 * Базовый класс для работы с содержимым документа (параграфы и таблицы).
 * @constructor
 */
function CDocumentContentBase()
{
    this.StartPage = 0; // Номер стартовой страницы в родительском классе
    this.CurPage   = 0; // Номер текущей страницы

    this.Content   = [];

    this.ReindexStartPos = 0;
}

/**
 * Обновляем индексы элементов.
 */
CDocumentContentBase.prototype.Update_ContentIndexing = function()
{
    if (-1 !== this.ReindexStartPos)
    {
        for (var Index = this.ReindexStartPos, Count = this.Content.length; Index < Count; Index++)
        {
            this.Content[Index].Index = Index;
        }

        this.ReindexStartPos = -1;
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Private area
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Сообщаем, что нужно провести переиндексацию элементов начиная с заданного.
 * @param StartPos
 */
CDocumentContentBase.prototype.private_ReindexContent = function(StartPos)
{
    if (-1 === this.ReindexStartPos || this.ReindexStartPos > StartPos)
        this.ReindexStartPos = StartPos;
};

