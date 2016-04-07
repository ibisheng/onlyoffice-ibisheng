"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 06.04.2016
 * Time: 14:15
 */

(function(window, builder)
{
    var Api           = window["asc_docs_api"];

    function ApiDocument(Document)
    {
        this.Document = Document;
    }

    function ApiParagraph(Paragraph)
    {
        this.Paragraph = Paragraph;
    }

    function ApiTable(Table)
    {
        this.Table = Table;
    }

    function ApiRun(Run)
    {
        this.Run = Run;
    }

    function ApiStyle(Style)
    {
        this.Style = Style;
    }

    //------------------------------------------------------------------------------------------------------------------
    // Основное Апи
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Получаем ссылку на основной документ в виде класса ApiDocument
     */
    Api.prototype["GetDocument"] = function()
    {
        return new ApiDocument(this.WordControl.m_oLogicDocument);
    };
    /**
     * Создаем новый параграф
     */
    Api.prototype["CreateParagraph"] = function()
    {
        return new ApiParagraph(new Paragraph(private_GetDrawingDocument(), private_GetLogicDocument()));
    };
    /**
     * Создаем новую таблицу размерами nCols * nRows
     */
    Api.prototype["CreateTable"] = function(nCols, nRows)
    {
        if (!nRows || nRows <= 0 || !nCols || nCols <= 0)
            return null;

        return new ApiTable(new CTable(private_GetDrawingDocument(), private_GetLogicDocument(), true, 0, 0, 0, 0, 0, nRows, nCols, [], false));
    };
    //------------------------------------------------------------------------------------------------------------------
    // Апи документа
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Получаем количество элементов в документе
     */
    ApiDocument.prototype["GetElementsCount"] = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Получаем элемент по заданному номеру или null
     */
    ApiDocument.prototype["GetElement"] = function(nPos)
    {
        if (!this.Document.Content[nPos])
            return null;

        return this.Document.Content[nPos];
    };
    /**
     * Добавляем параграф или таблицу в документ
     * @param nPos
     * @param oElement
     */
    ApiDocument.prototype["AddElement"] = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(nPos, oElement.private_GetImpl());
            return true;
        }

        return false;
    };
    /**
     * Добавляем параграф или таблицу в конец документа
     * @param oElement
     */
    ApiDocument.prototype["Push"] = function(oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(this.Document.Content.length, oElement.private_GetImpl(), true);
            return true;
        }

        return false;
    };
    /**
     * Получаем стиль по заданному имени стиля, если стиля с таким именем нет, то возвращается null
     * @param sStyleName
     */
    ApiDocument.prototype["GetStyle"] = function(sStyleName)
    {
        var oStyles = this.Document.Get_Styles();
        var oStyleId = oStyles.Get_StyleIdByName(sStyleName);
        return new ApiStyle(oStyles.Get(oStyleId));
    };
    //------------------------------------------------------------------------------------------------------------------
    // Апи параграфа (Paragraph)
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Добавляем текст к параграфу. Возвращается текстовый объект (Run), к которому можно применять различные
     * текстовые настройки.
     * @returns {ParaRun}
     */
    ApiParagraph.prototype["AddText"] = function(sText)
    {
        var oRun = new ParaRun(this.Paragraph, false);

        if (!sText || !sText.length)
            return oRun;

        for (var nPos = 0, nCount = sText.length; nPos < nCount; ++nPos)
        {
            var nChar = sText.charAt(nPos);
            if (" " == nChar)
                oRun.Add_ToContent(nPos, new ParaSpace(), false);
            else
                oRun.Add_ToContent(nPos, new ParaText(nChar), false);
        }

        private_PushElementToParagraph(this.Paragraph, oRun);
        return oRun;
    };
    /**
     * Добавляем разрыв страницы
     * @returns {ParaRun}
     */
    ApiParagraph.prototype["AddPageBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Page));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Добавляем разрыв строки
     * @returns {ParaRun}
     */
    ApiParagraph.prototype["AddLineBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Line));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Добавляем разрыв колонки
     * @returns {ParaRun}
     */
    ApiParagraph.prototype["AddColumnBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Column));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return oRun;
    };
    /**
     * Выставляем стиль
     * @param oStyle
     */
    ApiParagraph.prototype["SetStyle"] = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle))
            return false;

        this.Paragraph.Style_Add(oStyle.Style.Get_Id(), true);
        return true;
    };

    //------------------------------------------------------------------------------------------------------------------
    // Апи текстового блока (Run)
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Выставляем полужирный текст
     * @param isBold
     */
    ApiRun.prototype["SetBold"] = function(isBold)
    {
        this.Run.Set_Bold(isBold);
    };
    /**
     * Выставляем наклонный текст
     * @param isItalic
     */
    ApiRun.prototype["SetItalic"] = function(isItalic)
    {
        this.Run.Set_Italic(isItalic);
    };
    /**
     * Выставляем подчеркнутый текст
     * @param isUnderline
     */
    ApiRun.prototype["SetUnderline"] = function(isUnderline)
    {
        this.Run.Set_Underline(isUnderline);
    };
    //------------------------------------------------------------------------------------------------------------------
    // Апи текстового блока (Run)
    //------------------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------------------
    // Приватный блок
    //------------------------------------------------------------------------------------------------------------------
    function private_GetDrawingDocument()
    {
        return editor.WordControl.m_oLogicDocument.DrawingDocument;
    }

    function private_PushElementToParagraph(oPara, oElement)
    {
        // Добавляем не в конец из-за рана с символом конца параграфа TODO: ParaEnd
        oPara.Add_ToContent(oPara.Content.length - 1, oElement);
    }

    function private_GetLogicDocument()
    {
        return editor.WordControl.m_oLogicDocument;
    }

    ApiParagraph.prototype.private_GetImpl = function()
    {
        return this.Paragraph;
    };
    ApiTable.prototype.private_GetImpl = function()
    {
        return this.Table;
    };


}(window, null));


function TEST_BUILDER()
{
    var oLD = editor.WordControl.m_oLogicDocument;
    oLD.Create_NewHistoryPoint();
    //------------------------------------------------------------------------------------------------------------------

    // Воссоздаем документ DemoHyden

    var Api = editor;

    var oDocument     = Api.GetDocument();
    var oHeadingStyle = oDocument.GetStyle("Heading 1");

    var oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeadingStyle);
    oParagraph.AddText("Overview");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.AddText("In the previous meeting of the board of directors funds were approved to take the product “Innovate 1” to market.  They have also allocated a sum of $250,000  towards market identification and launch efforts. This document describes in brief the objective set forth by the VP of marketing pursuant to the board’s decision.");
    oDocument.Push(oParagraph);

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart(true);
}
