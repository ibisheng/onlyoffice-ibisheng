"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 06.04.2016
 * Time: 14:15
 */

(function(window, builder)
{
    var Api = window["asc_docs_api"];

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
    //
    // Base Api
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get main document
     * @returns {ApiDocument}
     */
    Api.prototype["GetDocument"] = function()
    {
        return new ApiDocument(this.WordControl.m_oLogicDocument);
    };
    /**
     * Create new paragraph
     * @returns {ApiParagraph}
     */
    Api.prototype["CreateParagraph"] = function()
    {
        return new ApiParagraph(new Paragraph(private_GetDrawingDocument(), private_GetLogicDocument()));
    };
    /**
     * Create new table
     * @param nCols
     * @param nRows
     * @returns {ApiTable}
     */
    Api.prototype["CreateTable"] = function(nCols, nRows)
    {
        if (!nRows || nRows <= 0 || !nCols || nCols <= 0)
            return null;

        return new ApiTable(new CTable(private_GetDrawingDocument(), private_GetLogicDocument(), true, 0, 0, 0, 0, 0, nRows, nCols, [], false));
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDocument
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get elements count
     */
    ApiDocument.prototype["GetElementsCount"] = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Get element by position
     * @returns {ApiParagraph | ApiTable | null}
     */
    ApiDocument.prototype["GetElement"] = function(nPos)
    {
        if (!this.Document.Content[nPos])
            return null;

        return this.Document.Content[nPos];
    };
    /**
     * Add paragraph or table by position
     * @param nPos
     * @param oElement (ApiParagraph or ApiTable)
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
     * Push paragraph or table
     * @param oElement (ApiParagraph or ApiTable)
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
     * Get style by style name
     * @param sStyleName
     * @returns {ApiStyle | null}
     */
    ApiDocument.prototype["GetStyle"] = function(sStyleName)
    {
        var oStyles = this.Document.Get_Styles();
        var oStyleId = oStyles.Get_StyleIdByName(sStyleName);
        return new ApiStyle(oStyles.Get(oStyleId));
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiParagraph
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Add text
     * @param sText
     * @returns {ApiRun}
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
        return new ApiRun(oRun);
    };
    /**
     * Add page beak
     * @returns {ApiRun}
     */
    ApiParagraph.prototype["AddPageBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Page));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Add line break
     * @returns {ApiRun}
     */
    ApiParagraph.prototype["AddLineBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Line));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Add column break
     * @returns {ApiRun}
     */
    ApiParagraph.prototype["AddColumnBreak"] = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Column));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Get ApiRun with paragraph mark
     * @returns {ApiRun}
     */
    ApiParagraph.prototype["GetParagraphMark"] = function()
    {
        var oEndRun = this.Paragraph.Content[this.Paragraph.Content.length - 1];
        return new ApiRun(oEndRun);
    };
    /**
     * Set paragraph style
     * @param oStyle (ApiStyle)
     * @returns {boolean}
     */
    ApiParagraph.prototype["SetStyle"] = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle))
            return false;

        this.Paragraph.Style_Add(oStyle.Style.Get_Id(), true);
        return true;
    };
    /**
     * Set paragraph spacing line
     * @param nLine (twips | undefined)
     */
    ApiParagraph.prototype["SetSpacingLine"] = function(nLine)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(nLine, undefined, undefined, undefined, undefined, undefined), false);
    };
    /**
     * Set paragraph spacing line rule
     * @param sLineRule ("auto" | "atLeast" | "exact")
     */
    ApiParagraph.prototype["SetSpacingLineRule"] = function(sLineRule)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(undefined, sLineRule, undefined, undefined, undefined, undefined), false);
    };

    /**
     * Set paragraph spacing before
     * @param nBefore (twips | undefined)
     */
    ApiParagraph.prototype["SetSpacingBefore"] = function(nBefore)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(undefined, undefined, nBefore, undefined, undefined, undefined), false);
    };
    /**
     * Set paragraph spacing after
     * @param nAfter (twips | undefined)
     */
    ApiParagraph.prototype["SetSpacingAfter"] = function(nAfter)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(undefined, undefined, undefined, nAfter, undefined, undefined), false);
    };
    /**
     * Set paragraph before auto spacing
     * @param isBeforeAuto  (true | false | undefined)
     */
    ApiParagraph.prototype["SetSpacingBeforeAuto"] = function(isBeforeAuto)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(undefined, undefined, undefined, undefined, isBeforeAuto, undefined), false);
    };
    /**
     * Set paragraph after auto spacing
     * @param isAfterAuto  (true | false | undefined)
     */
    ApiParagraph.prototype["SetSpacingAfterAuto"] = function(isAfterAuto)
    {
        this.Paragraph.Set_Spacing(private_GetParaSpacing(undefined, undefined, undefined, undefined, undefined, isAfterAuto), false);
    };
    /**
     * Set paragraph justification
     * @param sJc ("left" | "right" | "both" | "center")
     */
    ApiParagraph.prototype["SetJc"] = function(sJc)
    {
        var nAlign = private_GetParaAlign(sJc);
        if (undefined !== nAlign)
            this.Paragraph.Set_Align(nAlign);
    };
    /**
     * Set left indentation
     * @param nValue (twips)
     */
    ApiParagraph.prototype["SetIndLeft"] = function(nValue)
    {
        this.Paragraph.Set_Ind(private_GetParaInd(nValue, undefined, undefined));
    };
    /**
     * Set right indentation
     * @param nValue (twips)
     */
    ApiParagraph.prototype["SetIndRight"] = function(nValue)
    {
        this.Paragraph.Set_Ind(private_GetParaInd(undefined, nValue, undefined));
    };
    /**
     * Set first line indentation
     * @param nValue (twips)
     */
    ApiParagraph.prototype["SetIndFirstLine"] = function(nValue)
    {
        this.Paragraph.Set_Ind(private_GetParaInd(undefined, undefined, nValue));
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiRun
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Set bold
     * @param isBold (true | false)
     */
    ApiRun.prototype["SetBold"] = function(isBold)
    {
        this.Run.Set_Bold(isBold);
    };
    /**
     * Set italic
     * @param isItalic (true | false)
     */
    ApiRun.prototype["SetItalic"] = function(isItalic)
    {
        this.Run.Set_Italic(isItalic);
    };

    /**
     * Set underline
     * @param isUnderline (true | false)
     */
    ApiRun.prototype["SetUnderline"] = function(isUnderline)
    {
        this.Run.Set_Underline(isUnderline);
    };
    /**
     * Set font size
     * @param nSize (half-points)
     */
    ApiRun.prototype["SetFontSize"] = function(nSize)
    {
        this.Run.Set_FontSize(private_GetHps(nSize));
    };
    /**
     * Set text color in rgb
     * @param r (0-255)
     * @param g (0-255)
     * @param b (0-255)
     * @oaram isAuto (true | false) false is default
     */
    ApiRun.prototype["SetColor"] = function(r, g, b, isAuto)
    {
        this.Run.Set_Color(private_GetColor(r, g, b, isAuto));
    };
    /**
     * Set text spacing
     * @param nSpacing (twips)
     */
    ApiRun.prototype["SetSpacing"] = function(nSpacing)
    {
        this.Run.Set_Spacing(private_Twips2MM(nSpacing));
    };

    //------------------------------------------------------------------------------------------------------------------
    // Private area
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

    function private_Twips2MM(twips)
    {
        return 25.4 / 72.0 / 20 * twips;
    }

    function private_GetHps(hps)
    {
        return 2 * Math.ceil(hps);
    }

    function private_GetColor(r, g, b, Auto)
    {
        return new CDocumentColor(r, g, b, Auto ? Auto : false);
    }

    function private_GetParaSpacing(nLine, sLineRule, nBefore, nAfter, isBeforeAuto, isAfterAuto)
    {
        var oSp = new CParaSpacing();

        if (undefined !== nLine)
            oSp.Line = private_Twips2MM(nLine);

        if (undefined !== sLineRule)
        {
            if ("auto" === sLineRule)
                oSp.LineRule = linerule_Auto;
            else if ("atLeast" === sLineRule)
                oSp.LineRule = linerule_AtLeast;
            else if ("exact" === sLineRule)
                oSp.LineRule = linerule_Exact;
        }

        if (undefined !== nBefore)
            oSp.Before = private_Twips2MM(nBefore);

        if (undefined !== nAfter)
            oSp.After = private_Twips2MM(nAfter);

        if (undefined !== isAfterAuto)
            oSp.AfterAutoSpacing = isAfterAuto;

        if (undefined !== isBeforeAuto)
            oSp.BeforeAutoSpacing = isBeforeAuto;

        return oSp;
    }

    function private_GetParaInd(nLeft, nRight, nFirstLine)
    {
        var oInd = new CParaInd();

        if (undefined !== nLeft)
            oInd.Left = private_Twips2MM(nLeft);

        if (undefined !== nRight)
            oInd.Right = private_Twips2MM(nRight);

        if (undefined !== nFirstLine)
            oInd.FirstLine = private_Twips2MM(nFirstLine);

        return oInd;
    }

    function private_GetParaAlign(sJc)
    {
        if ("left" === sJc)
            return align_Left;
        else if ("right" === sJc)
            return align_Right;
        else if ("both" === sJc)
            return align_Justify;
        else if ("center" === sJc)
            return align_Center;

        return undefined;
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
    var oNoSpacingStyle = oDocument.GetStyle("No Spacing");

    var oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(276);
    oParagraph.SetSpacingLineRule("auto");
    oParagraph.SetJc("left");
    var oEndRun = oParagraph.GetParagraphMark();
    oEndRun.SetFontSize(52);
    oEndRun.SetColor(0x14, 0x14, 0x14);
    oEndRun.SetSpacing(5);
    oParagraph.AddPageBreak();
    // TODO: Добавить 2 автофигуры
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oNoSpacingStyle);
    // TODO: Добавить aвтофигуру
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeadingStyle);
    // TODO: Добавить aвтофигуру
    oParagraph.AddText("Overview");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.AddText("In the previous meeting of the board of directors funds were approved to take the product “Innovate 1” to market.  They have also allocated a sum of $250,000  towards market identification and launch efforts. This document describes in brief the objective set forth by the VP of marketing pursuant to the board’s decision.");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeadingStyle);
    oParagraph.SetSpacingAfter(100);
    oParagraph.SetSpacingAfterAuto(true);
    oParagraph.SetSpacingBefore(100);
    oParagraph.SetSpacingBeforeAuto(true);
    // TODO: Добавить aвтофигуру
    oParagraph.AddText("Summary");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(100);
    oParagraph.SetSpacingAfterAuto(true);
    oParagraph.SetSpacingBefore(100);
    oParagraph.SetSpacingBeforeAuto(true);
    // TODO: Добавить автофигуру
    oParagraph.AddText("After years of market research and focused creative effort we are in a position to take our “Innovate 1” to market. We have a three phase approach in place to complete the product and take the product to market.  The first step of this initiative is to test the market.  Once we have identified the market, then we will make any final product product to drive that effectively keeps down costs while meeting sales goals. ");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeadingStyle);
    oParagraph.SetSpacingAfter(100);
    oParagraph.SetSpacingAfterAuto(true);
    oParagraph.SetSpacingBefore(100);
    oParagraph.SetSpacingBeforeAuto(true);
    // TODO: Добавить автофигуру
    oParagraph.AddText("Financial Overview");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndRight(5040);
    oParagraph.AddText("Included are the estimated investment costs to introduce the new product.  As you can see for the first 3 years we will be in the investment phase.  Generating market demand and building our reputation in this category.  By 201");
    oParagraph.AddText("7");
    oParagraph.AddText(" we expect to be profitable.");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndRight(5040);
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeadingStyle);
    oParagraph.SetSpacingAfter(100);
    oParagraph.SetSpacingAfterAuto(true);
    oParagraph.SetSpacingBefore(100);
    oParagraph.SetSpacingBeforeAuto(true);
    oParagraph.AddText("Details");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(240);
    oParagraph.AddText("Out of the $250,000 allocated for this effort, we would like to spend about $50,000 towards the identification of the market.  For this we are allowed to engage with a marketing consulting organization.  Let us start with creating an RFP for this and start inviting the bids.   We would like to get the selection process completed by no later than end of first quarter.");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingBefore(100);
    oParagraph.SetSpacingBeforeAuto(true);
    oParagraph.SetSpacingAfter(360);
    // TODO: Вставить разрыв секции
    oDocument.Push(oParagraph);

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart(true);
}
