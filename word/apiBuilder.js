"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 06.04.2016
 * Time: 14:15
 */

(function(window)
{
    var Api           = window["asc_docs_api"];
    var ApiDocument   = CDocument;
    var ApiParagraph  = Paragraph;
    var ApiTable      = CTable;

    //------------------------------------------------------------------------------------------------------------------
    // Основное Апи
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Получаем ссылку на основной документ в виде класса CDocumentContent
     */
    Api.prototype["builder_GetDocument"] = function()
    {
        return this.WordControl.m_oLogicDocument;
    };
    /**
     * Создаем новый параграф
     */
    Api.prototype["builder_CreateParagraph"] = function()
    {
        return new ApiParagraph(private_GetDrawingDocument());
    };
    /**
     * Создаем новую таблицу размерами nCols * nRows
     */
    Api.prototype["builder_CreateTable"] = function(nCols, nRows)
    {
        if (!nRows || nRows <= 0 || !nCols || nCols <= 0)
            return null;

        return new ApiTable(private_GetDrawingDocument(), null, true, 0, 0, 0, 0, 0, nRows, nCols, [], false);
    };

    //------------------------------------------------------------------------------------------------------------------
    // Апи документа
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Получаем количество элементов в документе
     */
    ApiDocument.prototype["builder_GetElementsCount"] = function()
    {
        return this.Content.length;
    };
    /**
     * Получаем элемент по заданному номеру или null
     */
    ApiDocument.prototype["builder_GetElement"] = function(nPos)
    {
        if (!this.Content[nPos])
            return null;

        return this.Content[nPos];
    };
    /**
     * Добавляем параграф или таблицу в документ
     * @param nPos
     * @param oElement
     */
    ApiDocument.prototype["builder_AddElement"] = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Internal_Content_Add(nPos, oElement);
            return true;
        }

        return false;
    };

    /**
     * Добавляем параграф или таблицу в конец документа
     * @param oElement
     */
    ApiDocument.prototype["builder_Push"] = function(oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Internal_Content_Add(this.Content.length, oElement, true);
            return true;
        }

        return false;
    };

    //------------------------------------------------------------------------------------------------------------------
    // Апи параграфа
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Добавляем текст к параграфу. Возвращается текстовый объект (Run), к которому можно применять различные
     * текстовые настройки.
     */
    ApiParagraph.prototype["builder_AddText"] = function(sText)
    {
        var oRun = new ParaRun(this, false);

        if (!sText || !sText.length)
            return oRun;


    };


    function private_GetDrawingDocument()
    {
        return editor.WordControl.m_oLogicDocument.DrawingDocument;
    }
}(window));


function TEST_BUILDER()
{
    var oLD = editor.WordControl.m_oLogicDocument;
    oLD.Create_NewHistoryPoint();
    //------------------------------------------------------------------------------------------------------------------

    // Воссоздаем документ DemoHyden

    var Api = editor;

    var oDocument  = Api.builder_GetDocument();
    var oParagraph = Api.builder_CreateParagraph();
    var oTable     = Api.builder_CreateTable(3, 4);


    oDocument.builder_Push(oParagraph);
    oDocument.builder_Push(oTable);

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart(true);
}
