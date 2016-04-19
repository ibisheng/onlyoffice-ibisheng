"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 06.04.2016
 * Time: 14:15
 */

(function(window, builder)
{
    /**
     * @global
     * @class
     * @name Api
     */
    var Api = window["asc_docs_api"];

    /**
     * Class representing a document.
     * @constructor
     */
    function ApiDocument(Document)
    {
        this.Document = Document;
    }

    /**
     * Class representing a paragraph.
     * @constructor
     */
    function ApiParagraph(Paragraph)
    {
        this.Paragraph = Paragraph;
    }

    /**
     * Class representing a table.
     * @constructor
     */
    function ApiTable(Table)
    {
        this.Table = Table;
    }

    /**
     * Class representing a small text block calling 'run'.
     * @constructor
     */
    function ApiRun(Run)
    {
        this.Run = Run;
    }

    /**
     * Class representing a style.
     * @constructor
     */
    function ApiStyle(Style)
    {
        this.Style = Style;
    }

    /**
     * Class representing a text properties.
     * @constructor
     */
    function ApiTextPr(Parent, TextPr)
    {
        this.Parent = Parent;
        this.TextPr = TextPr;
    }

    /**
     * Class representing a paragraph properties.
     * @constructor
     */
    function ApiParaPr(Parent, ParaPr)
    {
        this.Parent = Parent;
        this.ParaPr = ParaPr;
    }

    /**
     * Class representing a document section.
     * @constructor
     */
    function ApiSection(Section)
    {
        this.Section = Section;
    }

    /**
     * Class representing a table row.
     * @constructor
     */
    function ApiTableRow(Row)
    {
        this.Row = Row;
    }

    /**
     * Class representing a table cell.
     * @constructor
     */
    function ApiTableCell(Cell)
    {
        this.Cell = Cell;
    }

    /**
     * Class representing a numbering properties.
     * @constructor
     */
    function ApiNumbering(Num)
    {
        this.Num = Num;
    }

    /**
     * Class representing a reference to a specified level of the numbering.
     * @constructor
     */
    function ApiNumberingLevel(Num, Lvl)
    {
        this.Num = Num;
        this.Lvl = Math.max(0, Math.min(8, Lvl));
    }

    /**
     * Twentieths of a point (equivalent to 1/1440th of an inch).
     * @typedef {number} twips
     */

    /**
     * @typedef {(ApiParagraph | ApiTable)} DocumentElement
     */

    /**
     * @typedef {("paragraph" | "table" | "run" | "numbering")} StyleType
     */

    /**
     * A 240ths of a line.
     * @typedef {number} line240
     */

    /**
     * Half-points.
     * @typedef {number} hps
     */

    /**
     * A numeric value from 0 to 255.
     * @typedef {number} byte
     */

    /**
     * A border type
     * @typedef {("none" | "single")} BorderType
     */

    /**
     * A shade type
     * @typedef {("nil" | "clear")} ShdType
     */

    /**
     * Types of custom tab
     * @typedef {("clear" | "left" | "right" | "center")} TabJc
     */

    /**
     * Eighths of a point (24 eighths of a point = 3 points)
     * @typedef {number} pt_8
     */

    /**
     * point
     * @typedef {number} pt
     */

    /**
     * Header and footer types
     * @typedef {("default" | "title" | "even")} HdrFtrType
     */

    //------------------------------------------------------------------------------------------------------------------
    //
    // Base Api
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get main document
     * @memberof Api
     * @returns {ApiDocument}
     */
    Api.prototype.GetDocument = function()
    {
        return new ApiDocument(this.WordControl.m_oLogicDocument);
    };
    /**
     * Create new paragraph
     * @memberof Api
     * @returns {ApiParagraph}
     */
    Api.prototype.CreateParagraph = function()
    {
        return new ApiParagraph(new Paragraph(private_GetDrawingDocument(), private_GetLogicDocument()));
    };
    /**
     * Create new table
     * @memberof Api
     * @param {number} nCols
     * @param {number} nRows
     * @returns {ApiTable}
     */
    Api.prototype.CreateTable = function(nCols, nRows)
    {
        if (!nRows || nRows <= 0 || !nCols || nCols <= 0)
            return null;

        var oTable = new CTable(private_GetDrawingDocument(), private_GetLogicDocument(), true, 0, 0, 0, 0, 0, nRows, nCols, [], false);
        oTable.private_RecalculateGridOpen();
        return new ApiTable(oTable);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDocument
    //
    //------------------------------------------------------------------------------------------------------------------

	/**
     * Create new history point
     */
	ApiDocument.prototype.Create_NewHistoryPoint = function()
    {
        this.Document.Create_NewHistoryPoint();
    };
    /**
     * Get the number of elements.
     * @returns {number}
     */
    ApiDocument.prototype.GetElementsCount = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Get element by position
     * @returns {?DocumentElement}
     */
    ApiDocument.prototype.GetElement = function(nPos)
    {
        if (!this.Document.Content[nPos])
            return null;

        var Type = this.Document.Content[nPos].Get_Type();
        if (type_Paragraph === Type)
            return new ApiParagraph(this.Document.Content[nPos]);
        else if (type_Paragraph === Type)
            return new ApiTable(this.Document.Content[nPos]);

        return null;
    };
    /**
     * Add paragraph or table by position
     * @param {number} nPos
     * @param {DocumentElement} oElement
     */
    ApiDocument.prototype.AddElement = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(nPos, oElement.private_GetImpl(), false);
            return true;
        }

        return false;
    };
    /**
     * Push paragraph or table
     * @param {DocumentElement} oElement
     */
    ApiDocument.prototype.Push = function(oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(this.Document.Content.length, oElement.private_GetImpl(), false);
            return true;
        }

        return false;
    };
    /**
     * Remove all elements from the current document.
     */
    ApiDocument.prototype.RemoveAllElements = function()
    {
        this.Document.Content = [];
    };
    /**
     * Get style by style name
     * @param {string} sStyleName
     * @returns {?ApiStyle}
     */
    ApiDocument.prototype.GetStyle = function(sStyleName)
    {
        var oStyles = this.Document.Get_Styles();
        var oStyleId = oStyles.Get_StyleIdByName(sStyleName);
        return new ApiStyle(oStyles.Get(oStyleId));
    };
    /**
     * Create a new style with the specified type and name. If there is a style with the same name it will be replaced
     * with a new one.
     * @param {string} sStyleName
     * @param {StyleType} [sType="paragraph"]
     * @returns {ApiStyle}
     */
    ApiDocument.prototype.CreateStyle = function(sStyleName, sType)
    {
        var nStyleType = styletype_Paragraph;
        if ("paragraph" === sType)
            nStyleType = styletype_Paragraph;
        else if ("table" === sType)
            nStyleType = styletype_Table;
        else if ("run" === sType)
            nStyleType = styletype_Character;
        else if ("numbering" === sType)
            nStyleType = styletype_Numbering;

        var oStyle = new CStyle(sStyleName, null, null, nStyleType, (styletype_Table !== nStyleType? false : true));
        var oStyles = this.Document.Get_Styles();

        // Если у нас есть стиль с данным именем, тогда мы старый стиль удаляем, а новый добавляем со старым Id,
        // чтобы если были ссылки на старый стиль - теперь они стали на новый.
        var sOldId    = oStyles.Get_StyleIdByName(sStyleName, false);
        var oOldStyle = oStyles.Get(sOldId);
        if (null != sOldId && oOldStyle)
        {
            oStyles.Remove(sOldId);
            oStyle.Set_Id(sOldId);
        }

        oStyles.Add(oStyle);
        return new ApiStyle(oStyle);
    };
    /**
     * Get the default style for the specified style type.
     * @param {StyleType} sStyleType
     * @returns {?ApiStyle}
     */
    ApiDocument.prototype.GetDefaultStyle = function(sStyleType)
    {
        var oStyles = this.Document.Get_Styles();

        if ("paragraph" === sStyleType)
            return new ApiStyle(oStyles.Get(oStyles.Get_Default_Paragraph()));
        else if ("table" === sStyleType)
            return new ApiStyle(oStyles.Get(oStyles.Get_Default_Table()));
        else if ("run" === sStyleType)
            return new ApiStyle(oStyles.Get(oStyles.Get_Default_Character()));
        else if ("numbering" === sStyleType)
            return new ApiStyle(oStyles.Get(oStyles.Get_Default_Numbering()));

        return null;
    };
    /**
     * A set of default run properties for the current document.
     * @returns {ApiTextPr}
     */
    ApiDocument.prototype.GetDefaultTextPr = function()
    {
        var oStyles = this.Document.Get_Styles();
        return new ApiTextPr(this, oStyles.Get_DefaultTextPr().Copy());
    };
    /**
     * A set of default paragraph properties for the current document.
     * @returns {ApiParaPr}
     */
    ApiDocument.prototype.GetDefaultParaPr = function()
    {
        var oStyles = this.Document.Get_Styles();
        return new ApiParaPr(this, oStyles.Get_DefaultParaPr().Copy());
    };
    /**
     * Get document final section
     * @return {ApiSection}
     */
    ApiDocument.prototype.GetFinalSection = function()
    {
        return new ApiSection(this.Document.SectPr);
    };
    /**
     * Create a new section of the document, which ends at the specified paragraph.
     * @param {ApiParagraph} oParagraph
     * @returns {ApiSection}
     */
    ApiDocument.prototype.CreateSection = function(oParagraph)
    {
        if (!(oParagraph instanceof ApiParagraph))
            return;

        var oSectPr = new CSectionPr(this.Document);
        oParagraph.private_GetImpl().Set_SectionPr(oSectPr);
        return new ApiSection(oSectPr);
    };
    /**
     * Specifies whether sections in this document shall have different headers and footers for even and odd pages
     * (an odd page header/footer and an even page header/footer).
     * @param {boolean} isEvenAndOdd
     */
    ApiDocument.prototype.SetEvenAndOddHdrFtr = function(isEvenAndOdd)
    {
        this.Document.Set_DocumentEvenAndOddHeaders(isEvenAndOdd);
    };
    /**
     * Creating an abstract multilevel numbering with specified type.
     * @param {("bullet" | "numbered")} [sType="bullet"]
     * @returns {ApiNumbering}
     */
    ApiDocument.prototype.CreateNumbering = function(sType)
    {
        var oGlobalNumbering = this.Document.Get_Numbering();
        var oNumberingId = oGlobalNumbering.Create_AbstractNum();
        var oNumbering = oGlobalNumbering.Get_AbstractNum(oNumberingId);

        if ("numbered" === sType)
            oNumbering.Create_Default_Numbered();
        else
            oNumbering.Create_Default_Bullet();

        return new ApiNumbering(oNumbering);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiParagraph
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Add text
     * @param {string} [sText=""]
     * @returns {ApiRun}
     */
    ApiParagraph.prototype.AddText = function(sText)
    {
        var oRun = new ParaRun(this.Paragraph, false);

        if (!sText || !sText.length)
            return new ApiRun(oRun);

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
     * Add page break
     * @returns {ApiRun}
     */
    ApiParagraph.prototype.AddPageBreak = function()
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
    ApiParagraph.prototype.AddLineBreak = function()
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
    ApiParagraph.prototype.AddColumnBreak = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaNewLine(break_Column));
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Get text properties of the paragraph mark.
     * @returns {ApiTextPr}
     */
    ApiParagraph.prototype.GetParagraphMarkTextPr = function()
    {
        return new ApiTextPr(this, this.Paragraph.TextPr.Value.Copy());
    };
    /**
     * Set paragraph style
     * @param {ApiStyle} oStyle
     * @returns {boolean}
     */
    ApiParagraph.prototype.SetStyle = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle))
            return false;

        this.Paragraph.Style_Add(oStyle.Style.Get_Id(), true);
        return true;
    };
    /**
     * Get paragraph properties.
     * @returns {ApiParaPr}
     */
    ApiParagraph.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Paragraph.Pr.Copy());
    };
    /**
     * Specifies that any space specified before or after this paragraph, specified using the spacing element
     * {@link ApiParaPr#SetSpacingBefore}{@link ApiParaPr#SetSpacingAfter}, should not be applied when the preceding and
     * following paragraphs are of the same paragraph style, affecting the top and bottom spacing respectively.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetContextualSpacing}
     * @param {boolean} isContextualSpacing
     */
    ApiParagraph.prototype.SetContextualSpacing = function(isContextualSpacing)
    {
        this.GetParaPr().SetContextualSpacing(isContextualSpacing);
    };
    /**
     * Set left indentation.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetIndLeft}
     * @param {twips} nValue
     */
    ApiParagraph.prototype.SetIndLeft = function(nValue)
    {
        this.GetParaPr().SetIndLeft(nValue);
    };
    /**
     * Set right indentation.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetIndRight}
     * @param {twips} nValue
     */
    ApiParagraph.prototype.SetIndRight = function(nValue)
    {
        this.GetParaPr().SetIndRight(nValue);
    };
    /**
     * Set first line indentation.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetIndFirstLine}
     * @param {twips} nValue
     */
    ApiParagraph.prototype.SetIndFirstLine = function(nValue)
    {
        this.GetParaPr().SetIndFirstLine(nValue);
    };
    /**
     * Set paragraph justification
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetJc}
     * @param {("left" | "right" | "both" | "center")} sJc
     */
    ApiParagraph.prototype.SetJc = function(sJc)
    {
        this.GetParaPr().SetJc(sJc);
    };
    /**
     * This element specifies that when rendering this document in a page view, all lines of this paragraph are
     * maintained on a single page whenever possible.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetKeepLines}
     * @param {boolean} isKeepLines
     */
    ApiParagraph.prototype.SetKeepLines = function(isKeepLines)
    {
        this.GetParaPr().SetKeepLines(isKeepLines);
    };
    /**
     * This element specifies that when rendering this document in a paginated view, the contents of this paragraph
     * are at least partly rendered on the same page as the following paragraph whenever possible.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetKeepNext}
     * @param {boolean} isKeepNext
     */
    ApiParagraph.prototype.SetKeepNext = function(isKeepNext)
    {
        this.GetParaPr().SetKeepNext(isKeepNext);
    };
    /**
     * This element specifies that when rendering this document in a paginated view, the contents of this paragraph
     * are rendered on the start of a new page in the document.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetPageBreakBefore}
     * @param {boolean} isPageBreakBefore
     */
    ApiParagraph.prototype.SetPageBreakBefore = function(isPageBreakBefore)
    {
        this.GetParaPr().SetPageBreakBefore(isPageBreakBefore);
    };
    /**
     * Set paragraph line spacing. If the value of the <code>sLineRule</code> parameter is either <code>"atLeast"</code>
     * or <code>"exact"</code>, then the value of <code>nLine</code> shall be interpreted as twentieths of a point. If
     * the value of the <code>sLineRule</code> parameter is <code>"auto"</code>, then the value of the <code>nLine</code>
     * attribute shall be interpreted as 240ths of a line.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetSpacingLine}
     * @param {(twips | line240)} nLine
     * @param {("auto" | "atLeast" | "exact")} sLineRule
     */
    ApiParagraph.prototype.SetSpacingLine = function(nLine, sLineRule)
    {
        this.GetParaPr().SetSpacingLine(nLine, sLineRule);
    };
    /**
     * Set paragraph spacing before. If the value of the <code>isBeforeAuto</code> parameter is <code>true</code>, then
     * any value of the <code>nBefore</code> is ignored. If <code>isBeforeAuto</code> parameter is not specified, then it
     * will be interpreted as <code>false</code>.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetSpacingBefore}
     * @param {twips} nBefore
     * @param {boolean} [isBeforeAuto=false]
     */
    ApiParagraph.prototype.SetSpacingBefore = function(nBefore, isBeforeAuto)
    {
        this.GetParaPr().SetSpacingBefore(nBefore, isBeforeAuto);
    };
    /**
     * Set paragraph spacing after. If the value of the <code>isAfterAuto</code> parameter is <code>true</code>, then
     * any value of the <code>nAfter</code> is ignored. If <code>isAfterAuto</code> parameter is not specified, then it
     * will be interpreted as <code>false</code>.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetSpacingAfter}
     * @param {twips} nAfter
     * @param {boolean} [isAfterAuto=false]
     */
    ApiParagraph.prototype.SetSpacingAfter = function(nAfter, isAfterAuto)
    {
        this.GetParaPr().SetSpacingAfter(nAfter, isAfterAuto);
    };
    /**
     * Specifies the shading applied to the contents of the paragraph.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetShd}
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiParagraph.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.GetParaPr().SetShd(sType, r, g, b, isAuto);
    };
    /**
     * Specifies the border which shall be displayed below a set of paragraphs which have the same paragraph border settings.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetBottomBorder}
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParagraph.prototype.SetBottomBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.GetParaPr().SetBottomBorder(sType, nSize, nSpace, r, g, b);
    };
    /**
     * Specifies the border which shall be displayed on the left side of the page around the specified paragraph.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetLeftBorder}
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParagraph.prototype.SetLeftBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.GetParaPr().SetLeftBorder(sType, nSize, nSpace, r, g, b);
    };
    /**
     * Specifies the border which shall be displayed on the right side of the page around the specified paragraph.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetRightBorder}
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParagraph.prototype.SetRightBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.GetParaPr().SetRightBorder(sType, nSize, nSpace, r, g, b);
    };
    /**
     * Specifies the border which shall be displayed above a set of paragraphs which have the same set of paragraph
     * border settings.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetTopBorder}
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParagraph.prototype.SetTopBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.GetParaPr().SetTopBorder(sType, nSize, nSpace, r, g, b);
    };
    /**
     * Specifies the border which shall be displayed between each paragraph in a set of paragraphs which have the same
     * set of paragraph border settings.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetBetweenBorder}
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParagraph.prototype.SetBetweenBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.GetParaPr().SetBetweenBorder(sType, nSize, nSpace, r, g, b);
    };
    /**
     * This element specifies whether a consumer shall prevent a single line of this paragraph from being displayed on
     * a separate page from the remaining content at display time by moving the line onto the following page.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetWidowControl}
     * @param {boolean} isWidowControl
     */
    ApiParagraph.prototype.SetWidowControl = function(isWidowControl)
    {
        this.GetParaPr().SetWidowControl(isWidowControl);
    };
    /**
     * Specifies a sequence of custom tab stops which shall be used for any tab characters in the current paragraph.
     * <b>Warning</b>: The lengths of aPos array and aVal array <b>MUST BE</b> equal.
     * @see {@link ApiParagraph#GetParaPr} and {@link ApiParaPr#SetTabs}
     * @param {twips[]} aPos - An array of the positions of custom tab stops with respect to the current page margins.
     * @param {TabJc[]} aVal - An array of the styles of custom tab stops, which determines the behavior of the tab stop and
     * the alignment which shall be applied to text entered at the current custom tab stop.
     */
    ApiParagraph.prototype.SetTabs = function(aPos, aVal)
    {
        this.GetParaPr().SetTabs(aPos, aVal);
    };
    /**
     * Specifies that the current paragraph references a numbering definition instance in the current document.
     * @see {@link ApiParagraph#GetParaPr} and {@link SetNumPr#SetTabs}
     * @param {ApiNumbering} oNumPr - Specifies a numbering definition.
     * @param {number} nLvl - Specifies a numbering level reference.
     */
    ApiParagraph.prototype.SetNumPr = function(oNumPr, nLvl)
    {
        this.GetParaPr().SetNumPr(oNumPr, nLvl);
    };
    /**
     * Get a numbering defenition and numbering level.
     * @returns {?ApiNumberingLevel}
     */
    ApiParagraph.prototype.GetNumPr = function()
    {
        var oNumPr = this.Paragraph.Numbering_Get();
        if (!oNumPr)
            return null;

        var oLogicDocument = private_GetLogicDocument();
        var oGlobalNumbering = oLogicDocument.Get_Numbering();
        var oNumbering = oGlobalNumbering.Get_AbstractNum(oNumPr.NumId);
        if (!oNumbering)
            return null;

        return new ApiNumberingLevel(oNumbering, oNumPr.Lvl);
    };
    /**
     * Specifies that the current paragraph references a numbering definition instance in the current document.
     * @see Same as {@link ApiParagraph#SetNumPr}
     * @param oNumberingLevel
     */
    ApiParagraph.prototype.SetNumbering = function(oNumberingLevel)
    {
        if (!(oNumberingLevel instanceof ApiNumberingLevel))
            return;

        this.SetNumPr(oNumberingLevel.GetNumbering(), oNumberingLevel.GetLevelIndex());
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiRun
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the text properties of the current run.
     * @returns {ApiTextPr}
     */
    ApiRun.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.Run.Pr.Copy());
    };
    /**
     * Set the bold property.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetBold}.
     * @param {boolean} isBold
     */
    ApiRun.prototype.SetBold = function(isBold)
    {
        this.GetTextPr().SetBold(isBold);
    };
    /**
     * Set the italic property.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetItalic}.
     * @param {boolean} isItalic
     */
    ApiRun.prototype.SetItalic = function(isItalic)
    {
        this.GetTextPr().SetItalic(isItalic);
    };
    /**
     * Specify that the contents of this run shall be displayed with a single horizontal line through the center of
     * the line.
      See also {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetStrikeout}.
     * @param {boolean} isStrikeout
     */
    ApiRun.prototype.SetStrikeout = function(isStrikeout)
    {
        this.GetTextPr().SetStrikeout(isStrikeout);
    };
    /**
     * Set the underline property.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetUnderline}.
     * @param {boolean} isUnderline
     */
    ApiRun.prototype.SetUnderline = function(isUnderline)
    {
        this.GetTextPr().SetUnderline(isUnderline);
    };
    /**
     * Set all 4 font slots with the specified font family.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetFontFamily}
     * @param {string} sFontFamily
     */
    ApiRun.prototype.SetFontFamily = function(sFontFamily)
    {
        this.GetTextPr().SetFontFamily(sFontFamily);
    };
    /**
     * Set the font size.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetFontSize}.
     * @param {hps} nSize
     */
    ApiRun.prototype.SetFontSize = function(nSize)
    {
        this.GetTextPr().SetFontSize(nSize);
    };
    /**
     * Set text color in the rgb format.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetColor}.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiRun.prototype.SetColor = function(r, g, b, isAuto)
    {
        this.GetTextPr().SetColor(r, g, b, isAuto);
    };
    /**
     * Specifies the alignment which shall be applied to the contents of this run in relation to the default
     * appearance of the run's text.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetVertAlign}
     * @param {("baseline" | "subscript" | "superscript")} sType
     */
    ApiRun.prototype.SetVertAlign = function(sType)
    {
        this.GetTextPr().SetVertAlign(sType);
    };
    /**
     * Specify a highlighting color which is applied as a background behind the contents of this run.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetHighlight}
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isNone=false] If this parameter is true, then parameters r,g,b will be ignored.
     */
    ApiRun.prototype.SetHighlight = function(r, g, b, isNone)
    {
        this.GetTextPr().SetHighlight(r, g, b, isNone);
    };
    /**
     * Set the text spacing.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetSpacing}.
     * @param {twips} nSpacing
     */
    ApiRun.prototype.SetSpacing = function(nSpacing)
    {
        this.GetTextPr().SetSpacing(nSpacing);
    };
    /**
     * Specify that the contents of this run shall be displayed with two horizontal lines through each character
     * displayed on the line.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetDoubleStrikeout}.
     * @param {boolean} isDoubleStrikeout
     */
    ApiRun.prototype.SetDoubleStrikeout = function(isDoubleStrikeout)
    {
        this.GetTextPr().SetDoubleStrikeout(isDoubleStrikeout);
    };
    /**
     * Specify that any lowercase characters in this text run shall be formatted for display only as their capital
     * letter character equivalents.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetCaps}.
     * @param {boolean} isCaps
     */
    ApiRun.prototype.SetCaps = function(isCaps)
    {
        this.GetTextPr().SetCaps(isCaps);
    };
    /**
     * Specify that all small letter characters in this text run shall be formatted for display only as their capital
     * letter character equivalents in a font size two points smaller than the actual font size specified for this text.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetSmallCaps}.
     * @param {boolean} isSmallCaps
     */
    ApiRun.prototype.SetSmallCaps = function(isSmallCaps)
    {
        this.GetTextPr().SetSmallCaps(isSmallCaps);
    };
    /**
     * Specify the amount by which text shall be raised or lowered for this run in relation to the default baseline of
     * the surrounding non-positioned text.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetPosition}.
     * @param {hps} nPosition - Specifies a positive or negative measurement in half-points (1/144 of an inch).
     */
    ApiRun.prototype.SetPosition = function(nPosition)
    {
        this.GetTextPr().SetPosition(nPosition);
    };
    /**
     * Specifies the languages which shall be used to check spelling and grammar (if requested) when processing the
     * contents of this run.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetLanguage}.
     * @param {string} sLangId - The possible values for this parameter is a language identifier as defined by RFC 4646/BCP 47. Example: "en-CA".
     */
    ApiRun.prototype.SetLanguage = function(sLangId)
    {
        this.GetTextPr().SetLanguage(sLangId);
    };
    /**
     * Specifies the shading applied to the contents of the run.
     * @see {@link ApiRun#GetTextPr} and {@link ApiTextPr#SetShd}.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiRun.prototype.SetShd = function(sType, r, g, b)
    {
        this.GetTextPr().SetShd(sType, r, g, b);
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiSection
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Specify the section type of the current section. The section type specifies how the contents of the current
     * section shall be placed relative to the previous section.
     * WordprocessingML supports five distinct types of section breaks:<br/>
     *   <b>Next page</b> section breaks (the default if type is not specified), which begin the new section on the
     *   following page.<br/>
     *   <b>Odd</b> page section breaks, which begin the new section on the next odd-numbered page.<br/>
     *   <b>Even</b> page section breaks, which begin the new section on the next even-numbered page.<br/>
     *   <b>Continuous</b> section breaks, which begin the new section on the following paragraph. This means that
     *   continuous section breaks might not specify certain page-level section properties, since they shall be
     *   inherited from the following section. These breaks, however, can specify other section properties, such
     *   as line numbering and footnote/endnote settings.<br/>
     *   <b>Column</b> section breaks, which begin the new section on the next column on the page.
     * @param {("nextPage" | "oddPage" | "evenPage" | "continuous" | "nextColumn")} sType - Type of the section break
     */
    ApiSection.prototype.SetType = function(sType)
    {
        if ("oddPage" === sType)
            this.Section.Set_Type(section_type_OddPage);
        else if ("evenPage" === sType)
            this.Section.Set_Type(section_type_EvenPage);
        else if ("continuous" === sType)
            this.Section.Set_Type(section_type_Continuous);
        else if ("nextColumn" === sType)
            this.Section.Set_Type(section_type_Column);
        else if ("nextPage" === sType)
            this.Section.Set_Type(section_type_NextPage);
    };
    /**
     * Specify all text columns in the current section are of equal width.
     * @param {number} nCount - Number of columns
     * @param {twips} nSpace - Distance between columns
     */
    ApiSection.prototype.SetEqualColumns = function(nCount, nSpace)
    {
        this.Section.Set_Columns_EqualWidth(true);
        this.Section.Set_Columns_Num(nCount);
        this.Section.Set_Columns_Space(private_Twips2MM(nSpace));
    };
    /**
     * Set all columns of this section are of different widths. Count of columns are equal length of <code>aWidth</code> array.
     * The length of <code>aSpaces</code> array <b>MUST BE</b> (<code>aWidth.length - 1</code>).
     * @param {twips[]} aWidths - An array of column width
     * @param {twips[]} aSpaces - An array of distances between the columns
     */
    ApiSection.prototype.SetNotEqualColumns = function(aWidths, aSpaces)
    {
        if (!aWidths || !aWidths.length || aWidths.length <= 1 || aSpaces.length !== aWidths.length - 1)
            return false;

        this.Section.Set_Columns_EqualWidth(false);
        var aCols = [];
        for (var nPos = 0, nCount = aWidths.length; nPos < nCount; ++nPos)
        {
            var SectionColumn = new CSectionColumn();
            SectionColumn.W     = private_Twips2MM(aWidths[nPos]);
            SectionColumn.Space = private_Twips2MM(nPos !== nCount - 1 ? aSpaces[nPos] : 0);
            aCols.push(SectionColumn);
        }

        this.Section.Set_Columns_Cols(aCols);
        this.Section.Set_Columns_Num(aCols.length);
    };
    /**
     * Specify the properties (size and orientation) for all pages in the current section.
     * @param {twips} nWidth - width
     * @param {twips} nHeight - height
     * @param {boolean} [isPortrait=false] - Specifies the orientation of all pages in this section.
     */
    ApiSection.prototype.SetPageSize = function(nWidth, nHeight, isPortrait)
    {
        this.Section.Set_PageSize(private_Twips2MM(nWidth), private_Twips2MM(nHeight));
        this.Section.Set_Orientation(false === isPortrait ? orientation_Landscape : orientation_Portrait, false);
    };
    /**
     * Specify the page margins for all pages in this section.
     * @param {twips} nLeft - Left margin
     * @param {twips} nTop - Top margin
     * @param {twips} nRight - Right margin
     * @param {twips} nBottom - Bottom margin
     */
    ApiSection.prototype.SetPageMargins = function(nLeft, nTop, nRight, nBottom)
    {
        this.Section.Set_PageMargins(private_Twips2MM(nLeft), private_Twips2MM(nTop), private_Twips2MM(nRight), private_Twips2MM(nBottom));
    };
    /**
     * Specifies the distance (in twentieths of a point) from the top edge of the page to the top edge of the header.
     * @param {twips} nDistance
     */
    ApiSection.prototype.SetHeaderDistance = function(nDistance)
    {
        this.Section.Set_PageMargins_Header(private_Twips2MM(nDistance));
    };
    /**
     * Specifies the distance (in twentieths of a point) from the bottom edge of the page to the bottom edge of the footer.
     * @param {twips} nDistance
     */
    ApiSection.prototype.SetFooterDistance = function(nDistance)
    {
        this.Section.Set_PageMargins_Footer(private_Twips2MM(nDistance));
    };
    /**
     * Get the content for the specified type of header.
     * @param {HdrFtrType} sType - Type of header.
     * @param {boolean} [isCreate=false] - Create a header or not if there is no header with specified type in the current section.
     * @returns {?ApiDocument}
     */
    ApiSection.prototype.GetHeader = function(sType, isCreate)
    {
        var oHeader = null;

        if ("title" === sType)
            oHeader = this.Section.Get_Header_First();
        else if ("even" === sType)
            oHeader = this.Section.Get_Header_Even();
        else if ("default" === sType)
            oHeader = this.Section.Get_Header_Default();
        else
            return null;

        if (null === oHeader && true === isCreate)
        {
            var oLogicDocument = private_GetLogicDocument();
            oHeader = new CHeaderFooter(oLogicDocument.Get_HdrFtr(), oLogicDocument, oLogicDocument.Get_DrawingDocument(), hdrftr_Header);
            if ("title" === sType)
                this.Section.Set_Header_First(oHeader);
            else if ("even" === sType)
                this.Section.Set_Header_Even(oHeader);
            else if ("default" === sType)
                this.Section.Set_Header_Default(oHeader);
        }

        return new ApiDocument(oHeader.Get_DocumentContent());
    };
    /**
     * Remove a header of the specified type from the current section. After removing the header will be inherited from
     * the previous section or, if this is the first section in the document, there won't be no header of the specified
     * type.
     * @param {HdrFtrType} sType - Type of header.
     */
    ApiSection.prototype.RemoveHeader = function(sType)
    {
        if ("title" === sType)
            this.Section.Set_Header_First(null);
        else if ("even" === sType)
            this.Section.Set_Header_Even(null);
        else if ("default" === sType)
            this.Section.Set_Header_Default(null);
    };
    /**
     * Get the content for the specified type of footer.
     * @param {HdrFtrType} sType - Type of footer.
     * @param {boolean} [isCreate=false] - Create a footer or not if there is no footer with specified type in the current section.
     * @returns {?ApiDocument}
     */
    ApiSection.prototype.GetFooter = function(sType, isCreate)
    {
        var oFooter = null;

        if ("title" === sType)
            oFooter = this.Section.Get_Footer_First();
        else if ("even" === sType)
            oFooter = this.Section.Get_Footer_Even();
        else if ("default" === sType)
            oFooter = this.Section.Get_Footer_Default();
        else
            return null;

        if (null === oFooter && true === isCreate)
        {
            var oLogicDocument = private_GetLogicDocument();
            oFooter = new CHeaderFooter(oLogicDocument.Get_HdrFtr(), oLogicDocument, oLogicDocument.Get_DrawingDocument(), hdrftr_Footer);
            if ("title" === sType)
                this.Section.Set_Footer_First(oFooter);
            else if ("even" === sType)
                this.Section.Set_Footer_Even(oFooter);
            else if ("default" === sType)
                this.Section.Set_Footer_Default(oFooter);
        }

        return new ApiDocument(oFooter.Get_DocumentContent());
    };
    /**
     * Remove a footer of the specified type from the current section. After removing the footer will be inherited from
     * the previous section or, if this is the first section in the document, there won't be no footer of the specified
     * type.
     * @param {HdrFtrType} sType - Type of footer.
     */
    ApiSection.prototype.RemoveFooter = function(sType)
    {
        if ("title" === sType)
            this.Section.Set_Footer_First(null);
        else if ("even" === sType)
            this.Section.Set_Footer_Even(null);
        else if ("default" === sType)
            this.Section.Set_Footer_Default(null);
    };
    /**
     * Specifies whether the current section in this document shall have a different header and footer for its first
     * page.
     * @param {boolean} isTitlePage
     */
    ApiSection.prototype.SetTitlePage = function(isTitlePage)
    {
        this.Section.Set_TitlePage(private_GetBoolean(isTitlePage));
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTable
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the number of rows in the current table.
     */
    ApiTable.prototype.GetRowsCount = function()
    {
        return this.Table.Content.length;
    };
    /**
     * Get table row by position.
     * @param {number} nPos
     * @returns {ApiTableRow}
     */
    ApiTable.prototype.GetRow = function(nPos)
    {
        if (nPos < 0 || nPos >= this.Table.Content.length)
            return null;

        return new ApiTableRow(this.Table.Content[nPos]);
    };
    /**
     * Merge array of cells. If merge was done successfully it will return merged cell, otherwise "null".
     * <b>Warning</b>: The number of cells in any row and the numbers of rows in the current table may be changed.
     * @param {ApiTableCell[]} aCells
     * @returns {?ApiTableCell}
     */
    ApiTable.prototype.MergeCells = function(aCells)
    {
        var oTable = this.Table;
        oTable.Selection.Use  = true;
        oTable.Selection.Type = table_Selection_Cell;
        oTable.Selection.Data = [];

        for (var nPos = 0, nCount = aCells.length; nPos < nCount; ++nPos)
        {
            var oCell = aCells[nPos].Cell;
            var oPos = {Cell : oCell.Index, Row : oCell.Row.Index};

            var nResultPos    = 0;
            var nResultLength = oTable.Selection.Data.length;
            for (nResultPos = 0; nResultPos < nResultLength; ++nResultPos)
            {
                var oCurPos = oTable.Selection.Data[nResultPos];
                if (oCurPos.Row < oPos.Row)
                {
                    continue;
                }
                else if (oCurPos.Row > oPos.Row)
                {
                    break;
                }
                else
                {
                    if (oCurPos.Cell < oPos.Cell)
                        continue;
                    else
                        break;
                }
            }

            oTable.Selection.Data.splice(nResultPos, 0, oPos);
        }

        this.Table.private_UpdateCellsGrid();

        var isMerged = this.Table.Cell_Merge(true);
        oTable.Selection_Remove();

        if (true === isMerged)
            return new ApiTableCell(this.Table.CurCell);

        return null;
    };
    /**
     * Set table style
     * @param {ApiStyle} oStyle
     * @return {boolean}
     */
    ApiTable.prototype.SetStyle = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle) || styletype_Table !== oStyle.Style.Get_Type())
            return false;

        this.Table.Set_Props({TableStyle : oStyle.Style.Get_Id()});
        return true;
    };
    /**
     * Set the preferred width for this table.
     * @param {("auto" | "twips" | "percent" | "nil")} sType - Type of the width value
     * @param {number} [nValue]
     */
    ApiTable.prototype.SetWidth = function(sType, nValue)
    {
        if ("auto" === sType)
            this.Table.Set_Props({TableWidth : null});
        else if ("twips" === sType)
            this.Table.Set_Props({TableWidth : private_Twips2MM(nValue)});
        else if ("percent" === sType)
            this.Table.Set_Props({TableWidth : -nValue});
    };
    /**
     * Set the alignment of the current table with respect to the text margins in the current section.
     * @param {("left" | "right" | "center")} sJcType
     */
    ApiTable.prototype.SetJc = function(sJcType)
    {
        if ("left" === sJcType)
            this.Table.Set_Props({TableAlignment : 0});
        else if ("right" === sJcType)
            this.Table.Set_Props({TableAlignment : 2});
        else if ("center" === sJcType)
            this.Table.Set_Props({TableAlignment : 1});
    };
    /**
     * Specify the components of the conditional formatting of the referenced table style (if one exists)
     * which shall be applied to the set of table rows with the current table-level property exceptions. A table style can
     * specify up to six different optional conditional formats [Example: Different formatting for first column. end
     * example], which then can be applied or omitted from individual table rows in the parent table.
     *
     * The default setting is to apply the row and column banding formatting, but not the first row, last row, first
     * column, or last column formatting.
     * @param {boolean} isFirstColumn - Specifies that the first column conditional formatting shall be applied to the table.
     * @param {boolean} isFirstRow - Specifies that the first row conditional formatting shall be applied to the table.
     * @param {boolean} isLastColumn - Specifies that the last column conditional formatting shall be applied to the table.
     * @param {boolean} isLastRow - Specifies that the last row conditional formatting shall be applied to the table.
     * @param {boolean} isHorBand - Specifies that the horizontal banding conditional formatting shall not be applied to the table.
     * @param {boolean} isVerBand - Specifies that the vertical banding conditional formatting shall not be applied to the table.
     */
    ApiTable.prototype.SetTableLook = function(isFirstColumn, isFirstRow, isLastColumn, isLastRow, isHorBand, isVerBand)
    {
        this.Table.Set_Props({TableLook :
        {
            FirstCol : isFirstColumn,
            FirstRow : isFirstRow,
            LastCol  : isLastColumn,
            LastRow  : isLastRow,
            BandHor  : isHorBand,
            BandVer  : isVerBand
        }});
    };
    /**
     * Set the border which shall be displayed at the top of the current table.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderTop = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {Top : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };
    /**
     * Set the border which shall be displayed at the bottom of the current table.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderBottom = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {Bottom : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };
    /**
     * Set the border which shall be displayed on the left of the current table.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderLeft = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {Left : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };
    /**
     * Set the border which shall be displayed on the right of the current table.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderRight = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {Right : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };
    /**
     * Specify the border which shall be displayed on all horizontal table cell borders which are not on
     * an outmost edge of the parent table (all horizontal borders which are not the topmost or bottommost border).
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderInsideH = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {InsideH : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };
    /**
     * Specify the border which shall be displayed on all vertical table cell borders which are not on an
     * outmost edge of the parent table (all horizontal borders which are not the leftmost or rightmost border).
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTable.prototype.SetTableBorderInsideV = function(sType, nSize, nSpace, r, g, b)
    {
        this.Table.Set_Props({TableBorders : {InsideV : private_GetTableBorder(sType, nSize, nSpace, r, g, b)}});
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableRow
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the number of cells in the current row.
     * @returns {number}
     */
    ApiTableRow.prototype.GetCellsCount = function()
    {
        return this.Row.Content.length;
    };
    /**
     * Get cell by position.
     * @param {number} nPos
     * @returns {ApiTableCell}
     */
    ApiTableRow.prototype.GetCell = function(nPos)
    {
        if (nPos < 0 || nPos >= this.Row.Content.length)
            return null;

        return new ApiTableCell(this.Row.Content[nPos]);
    };
    /**
     * Set the height of the current table row within the current table.
     * @param {("auto" | "atLeast")} sHRule - Specifies the meaning of the height specified for this table row.
     * @param {twips} nValue
     */
    ApiTableRow.prototype.SetHeight = function(sHRule, nValue)
    {
        var HRule = ("auto" === sHRule ? Asc.linerule_Auto : Asc.linerule_AtLeast);
        this.Row.Set_Height(private_Twips2MM(nValue), HRule);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableCell
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get cell content.
     * @returns {ApiDocument}
     */
    ApiTableCell.prototype.GetContent = function()
    {
        return new ApiDocument(this.Cell.Content);
    };
    /**
     * Set the preferred width for this cell.
     * @param {("auto" | "twips" | "percent" | "nil")} sType - Specifies the meaning of the width value.
     * @param {number} [nValue]
     */
    ApiTableCell.prototype.SetWidth = function(sType, nValue)
    {
        var CellW = null;
        if ("auto" === sType)
            CellW = new CTableMeasurement(tblwidth_Auto, 0);
        else if ("twips" === sType)
            CellW = new CTableMeasurement(tblwidth_Mm, private_Twips2MM(nValue));
        else if ("percent" === sType)
            CellW = new CTableMeasurement(tblwidth_Pct, nValue);

        if (CellW)
            this.Cell.Set_W(CellW);
    };
    /**
     * Specify the vertical alignment for text within the current table cell.
     * @param {("top" | "center" | "bottom")} sType
     */
    ApiTableCell.prototype.SetVerticalAlign = function(sType)
    {
        if ("top" === sType)
            this.Cell.Set_VAlign(vertalignjc_Top);
        else if ("bottom" === sType)
            this.Cell.Set_VAlign(vertalignjc_Bottom);
        else if ("center" === sType)
            this.Cell.Set_VAlign(vertalignjc_Center);
    };
    /**
     * Specify the shading which shall be applied to the extents of the current table cell.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiTableCell.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.Cell.Set_Shd(private_GetShd(sType, r, g, b, isAuto));
    };
    /**
     * Specify the direction of the text flow for this table cell.
     * @param {("lrtb" | "tbrl" | "btlr")} sType
     */
    ApiTableCell.prototype.SetTextDirection = function(sType)
    {
        if ("lrtb" === sType)
            this.Cell.Set_TextDirection(textdirection_LRTB);
        else if ("tbrl" === sType)
            this.Cell.Set_TextDirection(textdirection_TBRL);
        else if ("btlr" === sType)
            this.Cell.Set_TextDirection(textdirection_BTLR);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiStyle
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the name of the current style.
     * @returns {string}
     */
    ApiStyle.prototype.GetName = function()
    {
        return this.Style.Get_Name();
    };
    /**
     * Set the name of the current style.
     * @param {string} sStyleName
     */
    ApiStyle.prototype.SetName = function(sStyleName)
    {
        this.Style.Set_Name(sStyleName);
    };
    /**
     * Get the type of the current style.
     * @returns {StyleType}
     */
    ApiStyle.prototype.GetType = function()
    {
        var nStyleType = this.Style.Get_Type();

        if (styletype_Paragraph === nStyleType)
            return "paragraph";
        else if (styletype_Table === nStyleType)
            return "table";
        else if (styletype_Character === nStyleType)
            return "run";
        else if (styletype_Numbering === nStyleType)
            return "numbering";

        return "paragraph";
    };
    /**
     * Get the text properties of the current style.
     * @returns {ApiTextPr}
     */
    ApiStyle.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.Style.TextPr.Copy());
    };
    /**
     * Get the paragraph properties of the current style.
     * @returns {ApiParaPr}
     */
    ApiStyle.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Style.ParaPr.Copy());
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTextPr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Set the bold property.
     * @param {boolean} isBold
     */
    ApiTextPr.prototype.SetBold = function(isBold)
    {
        this.TextPr.Bold = isBold;
        this.private_OnChange();
    };
    /**
     * Set the italic property.
     * @param {boolean} isItalic
     */
    ApiTextPr.prototype.SetItalic = function(isItalic)
    {
        this.TextPr.Italic = isItalic;
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run shall be displayed with a single horizontal line through the center of
     * the line.
     * @param {boolean} isStrikeout
     */
    ApiTextPr.prototype.SetStrikeout = function(isStrikeout)
    {
        this.TextPr.Strikeout = isStrikeout;
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run should be displayed along with an underline appearing directly below the
     * character height (less all spacing above and below the characters on the line).
     * @param {boolean} isUnderline
     */
    ApiTextPr.prototype.SetUnderline = function(isUnderline)
    {
        this.TextPr.Underline = isUnderline;
        this.private_OnChange();
    };
    /**
     * Set all 4 font slots with the specified font family.
     * @param {string} sFontFamily
     */
    ApiTextPr.prototype.SetFontFamily = function(sFontFamily)
    {
        this.TextPr.RFonts.Set_All(sFontFamily, -1);
        this.private_OnChange();
    };
    /**
     * Set the font size.
     * @param {hps} nSize
     */
    ApiTextPr.prototype.SetFontSize = function(nSize)
    {
        this.TextPr.FontSize = private_GetHps(nSize);
        this.private_OnChange();
    };
    /**
     * Set text color in the rgb format.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiTextPr.prototype.SetColor = function(r, g, b, isAuto)
    {
        this.TextPr.Color = private_GetColor(r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specifies the alignment which shall be applied to the contents of this run in relation to the default
     * appearance of the run's text.
     * @param {("baseline" | "subscript" | "superscript")} sType
     */
    ApiTextPr.prototype.SetVertAlign = function(sType)
    {
        if ("baseline" === sType)
            this.TextPr.VertAlign = AscCommon.vertalign_Baseline;
        else if ("subscript" === sType)
            this.TextPr.VertAlign = AscCommon.vertalign_SubScript;
        else if ("superscript" === sType)
            this.TextPr.VertAlign = AscCommon.vertalign_SuperScript;

        this.private_OnChange();
    };
    /**
     * Specify a highlighting color which is applied as a background behind the contents of this run.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isNone=false] If this parameter is true, then parameters r,g,b will be ignored.
     */
    ApiTextPr.prototype.SetHighlight = function(r, g, b, isNone)
    {
        if (undefined === isNone)
            isNone = false;

        if (true === isNone)
            this.TextPr.HighLight = highlight_None;
        else
            this.TextPr.HighLight = new CDocumentColor(r, g, b, false);

        this.private_OnChange();
    };
    /**
     * Set text spacing.
     * @param {twips} nSpacing
     */
    ApiTextPr.prototype.SetSpacing = function(nSpacing)
    {
        this.TextPr.Spacing = private_Twips2MM(nSpacing);
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run shall be displayed with two horizontal lines through each character
     * displayed on the line.
     * @param {boolean} isDoubleStrikeout
     */
    ApiTextPr.prototype.SetDoubleStrikeout = function(isDoubleStrikeout)
    {
        this.TextPr.DStrikeout = isDoubleStrikeout;
        this.private_OnChange();
    };
    /**
     * Specify that any lowercase characters in this text run shall be formatted for display only as their capital
     * letter character equivalents.
     * @param {boolean} isCaps
     */
    ApiTextPr.prototype.SetCaps = function(isCaps)
    {
        this.TextPr.Caps = isCaps;
        this.private_OnChange();
    };
    /**
     * Specify that all small letter characters in this text run shall be formatted for display only as their capital
     * letter character equivalents in a font size two points smaller than the actual font size specified for this text.
     * @param {boolean} isSmallCaps
     */
    ApiTextPr.prototype.SetSmallCaps = function(isSmallCaps)
    {
        this.TextPr.SmallCaps = isSmallCaps;
        this.private_OnChange();
    };
    /**
     * Specify the amount by which text shall be raised or lowered for this run in relation to the default baseline of
     * the surrounding non-positioned text.
     * @param {hps} nPosition - Specifies a positive or negative measurement in half-points (1/144 of an inch).
     */
    ApiTextPr.prototype.SetPosition = function(nPosition)
    {
        this.TextPr.Position = private_PtToMM(private_GetHps(nPosition));
        this.private_OnChange();
    };
    /**
     * Specifies the languages which shall be used to check spelling and grammar (if requested) when processing the
     * contents of this run.
     * @param {string} sLangId - The possible values for this parameter is a language identifier as defined by RFC 4646/BCP 47. Example: "en-CA".
     */
    ApiTextPr.prototype.SetLanguage = function(sLangId)
    {
        var nLcid = g_oLcidNameToIdMap[sLangId];
        if (undefined !== nLcid)
        {
            this.TextPr.Lang.Val = nLcid;
            this.private_OnChange();
        }
    };
    /**
     * Specifies the shading applied to the contents of the run.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTextPr.prototype.SetShd = function(sType, r, g, b)
    {
        this.TextPr.Shd = private_GetShd(sType, r, g, b, false);
        this.private_OnChange();
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiParaPr
    //
    //------------------------------------------------------------------------------------------------------------------


    /**
     * Specifies that any space specified before or after this paragraph, specified using the spacing element
     * {@link ApiParaPr#SetSpacingBefore}{@link ApiParaPr#SetSpacingAfter}, should not be applied when the preceding and
     * following paragraphs are of the same paragraph style, affecting the top and bottom spacing respectively.
     * @param {boolean} isContextualSpacing
     */
    ApiParaPr.prototype.SetContextualSpacing = function(isContextualSpacing)
    {
        this.ParaPr.ContextualSpacing = private_GetBoolean(isContextualSpacing);
        this.private_OnChange();
    };
    /**
     * Set left indentation.
     * @param {twips} nValue
     */
    ApiParaPr.prototype.SetIndLeft = function(nValue)
    {
        this.ParaPr.Ind.Left = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set right indentation.
     * @param {twips} nValue
     */
    ApiParaPr.prototype.SetIndRight = function(nValue)
    {
        this.ParaPr.Ind.Right = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set first line indentation.
     * @param {twips} nValue
     */
    ApiParaPr.prototype.SetIndFirstLine = function(nValue)
    {
        this.ParaPr.Ind.FirstLine = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set paragraph justification
     * @param {("left" | "right" | "both" | "center")} sJc
     */
    ApiParaPr.prototype.SetJc = function(sJc)
    {
        this.ParaPr.Jc = private_GetParaAlign(sJc);
        this.private_OnChange();
    };
    /**
     * This element specifies that when rendering this document in a page view, all lines of this paragraph are
     * maintained on a single page whenever possible.
     * @param {boolean} isKeepLines
     */
    ApiParaPr.prototype.SetKeepLines = function(isKeepLines)
    {
        this.ParaPr.KeepLines = isKeepLines;
        this.private_OnChange();
    };
    /**
     * This element specifies that when rendering this document in a paginated view, the contents of this paragraph
     * are at least partly rendered on the same page as the following paragraph whenever possible.
     * @param {boolean} isKeepNext
     */
    ApiParaPr.prototype.SetKeepNext = function(isKeepNext)
    {
        this.ParaPr.KeepNext = isKeepNext;
        this.private_OnChange();
    };
    /**
     * This element specifies that when rendering this document in a paginated view, the contents of this paragraph
     * are rendered on the start of a new page in the document.
     * @param {boolean} isPageBreakBefore
     */
    ApiParaPr.prototype.SetPageBreakBefore = function(isPageBreakBefore)
    {
        this.ParaPr.PageBreakBefore = isPageBreakBefore;
        this.private_OnChange();
    };
    /**
     * Set paragraph line spacing. If the value of the <code>sLineRule</code> parameter is either <code>"atLeast"</code>
     * or <code>"exact"</code>, then the value of <code>nLine</code> shall be interpreted as twentieths of a point. If
     * the value of the <code>sLineRule</code> parameter is <code>"auto"</code>, then the value of the <code>nLine</code>
     * attribute shall be interpreted as 240ths of a line.
     * @param {(twips | line240)} nLine
     * @param {("auto" | "atLeast" | "exact")} sLineRule
     */
    ApiParaPr.prototype.SetSpacingLine = function(nLine, sLineRule)
    {
        if (undefined !== nLine && undefined !== sLineRule)
        {
            if ("auto" === sLineRule)
            {
                this.ParaPr.Spacing.LineRule = Asc.linerule_Auto;
                this.ParaPr.Spacing.Line = nLine / 240.0;
            }
            else if ("atLeast" === sLineRule)
            {
                this.ParaPr.Spacing.LineRule = Asc.linerule_AtLeast;
                this.ParaPr.Spacing.Line = private_Twips2MM(nLine);

            }
            else if ("exact" === sLineRule)
            {
                this.ParaPr.Spacing.LineRule = Asc.linerule_Exact;
                this.ParaPr.Spacing.Line = private_Twips2MM(nLine);
            }
        }

        this.private_OnChange();
    };
    /**
     * Set paragraph spacing before. If the value of the <code>isBeforeAuto</code> parameter is <code>true</code>, then
     * any value of the <code>nBefore</code> is ignored. If <code>isBeforeAuto</code> parameter is not specified, then it
     * will be interpreted as <code>false</code>.
     * @param {twips} nBefore
     * @param {boolean} [isBeforeAuto=false]
     */
    ApiParaPr.prototype.SetSpacingBefore = function(nBefore, isBeforeAuto)
    {
        if (undefined !== nBefore)
            this.ParaPr.Spacing.Before = private_Twips2MM(nBefore);

        if (undefined !== isBeforeAuto)
            this.ParaPr.Spacing.BeforeAutoSpacing = isBeforeAuto;

        this.private_OnChange();
    };
    /**
     * Set paragraph spacing after. If the value of the <code>isAfterAuto</code> parameter is <code>true</code>, then
     * any value of the <code>nAfter</code> is ignored. If <code>isAfterAuto</code> parameter is not specified, then it
     * will be interpreted as <code>false</code>.
     * @param {twips} nAfter
     * @param {boolean} [isAfterAuto=false]
     */
    ApiParaPr.prototype.SetSpacingAfter = function(nAfter, isAfterAuto)
    {
        if (undefined !== nAfter)
            this.ParaPr.Spacing.After = private_Twips2MM(nAfter);

        if (undefined !== isAfterAuto)
            this.ParaPr.Spacing.AfterAutoSpacing = isAfterAuto;

        this.private_OnChange();
    };
    /**
     * Specifies the shading applied to the contents of the paragraph.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiParaPr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.ParaPr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specifies the border which shall be displayed below a set of paragraphs which have the same paragraph border settings.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParaPr.prototype.SetBottomBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specifies the border which shall be displayed on the left side of the page around the specified paragraph.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParaPr.prototype.SetLeftBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specifies the border which shall be displayed on the right side of the page around the specified paragraph.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParaPr.prototype.SetRightBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specifies the border which shall be displayed above a set of paragraphs which have the same set of paragraph
     * border settings.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParaPr.prototype.SetTopBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specifies the border which shall be displayed between each paragraph in a set of paragraphs which have the same
     * set of paragraph border settings.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiParaPr.prototype.SetBetweenBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Between = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * This element specifies whether a consumer shall prevent a single line of this paragraph from being displayed on
     * a separate page from the remaining content at display time by moving the line onto the following page.
     * @param {boolean} isWidowControl
     */
    ApiParaPr.prototype.SetWidowControl = function(isWidowControl)
    {
        this.ParaPr.WidowControl = isWidowControl;
        this.private_OnChange();
    };
    /**
     * Specifies a sequence of custom tab stops which shall be used for any tab characters in the current paragraph.
     * <b>Warning</b>: The lengths of aPos array and aVal array <b>MUST BE</b> equal.
     * @param {twips[]} aPos - An array of the positions of custom tab stops with respect to the current page margins.
     * @param {TabJc[]} aVal - An array of the styles of custom tab stops, which determines the behavior of the tab stop and
     * the alignment which shall be applied to text entered at the current custom tab stop.
     */
    ApiParaPr.prototype.SetTabs = function(aPos, aVal)
    {
        if (!(aPos instanceof Array) || !(aVal instanceof Array) || aPos.length !== aVal.length)
            return;

        var oTabs = new CParaTabs();
        for (var nIndex = 0, nCount = aPos.length; nIndex < nCount; ++nIndex)
        {
            oTabs.Add(private_GetTabStop(aPos[nIndex], aVal[nIndex]));
        }
        this.ParaPr.Tabs = oTabs;
        this.private_OnChange();
    };
    /**
     * Specifies that the current paragraph references a numbering definition instance in the current document.
     * @param {ApiNumbering} oNumPr - Specifies a numbering definition.
     * @param {number} [nLvl=0] - Specifies a numbering level reference. If the current instance of the class ApiParaPr is
     * direct formatting of a paragraph, then this parameter <b>MUST BE</b> specified. Otherwise if the current instance
     * of the class ApiParaPr is the part of ApiStyle properties, then this parameter will be ignored.
     */
    ApiParaPr.prototype.SetNumPr = function(oNumPr, nLvl)
    {
        if (!(oNumPr instanceof ApiNumbering))
            return;

        this.ParaPr.NumPr = new CNumPr();
        this.ParaPr.NumPr.NumId = oNumPr.Num.Get_Id();
        this.ParaPr.NumPr.Lvl   = undefined;

        if (this.Parent instanceof ApiParagraph)
        {
            this.ParaPr.NumPr.Lvl = Math.min(8, Math.max(0, (nLvl ? nLvl : 0)));
        }
        this.private_OnChange();
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiNumbering
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the specified level of the current numbering.
     * @param {number} nLevel - Index of the numbering level. This value MUST BE from 0 to 8.
     * @returns {ApiNumberingLevel}
     */
    ApiNumbering.prototype.GetLevel = function(nLevel)
    {
        return new ApiNumberingLevel(this.Num, nLevel);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiNumberingLevel
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get a numbering defenition.
     * @returns {ApiNumbering}
     */
    ApiNumberingLevel.prototype.GetNumbering = function()
    {
        return new ApiNumbering(this.Num);
    };
    /**
     * Get level index.
     * @returns {number}
     */
    ApiNumberingLevel.prototype.GetLevelIndex = function()
    {
        return this.Lvl;
    };
    /**
     * Specifies the run properties which shall be applied to the numbering level's text.
     * @returns {ApiTextPr}
     */
    ApiNumberingLevel.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.Num.Lvl[this.Lvl].TextPr.Copy());
    };
    /**
     * This paragraph properties are applied to any numbered paragraph that references the given numbering definition
     * and numbering level.
     * @returns {ApiParaPr}
     */
    ApiNumberingLevel.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Num.Lvl[this.Lvl].ParaPr.Copy());
    };
    /**
     * Set one of the predefined numbering templates.
     * @param {("none" | "bullet" | "1)" | "1." | "I." | "A." | "a)" | "a." | "i." )} sType - Type of the numbering
     * @param {string} [sSymbol=""] - This parameter have a meaning only if <code>sType="bullet"</code>
     */
    ApiNumberingLevel.prototype.SetTemplateType = function(sType, sSymbol)
    {
        switch (sType)
        {
            case "none"  : this.Num.Set_Lvl_None(this.Lvl); break;
            case "bullet": this.Num.Set_Lvl_Bullet(this.Lvl, sSymbol, new CTextPr()); break;
            case "1)"    : this.Num.Set_Lvl_Numbered_1(this.Lvl); break;
            case "1."    : this.Num.Set_Lvl_Numbered_2(this.Lvl); break;
            case "I."    : this.Num.Set_Lvl_Numbered_5(this.Lvl); break;
            case "A."    : this.Num.Set_Lvl_Numbered_6(this.Lvl); break;
            case "a)"    : this.Num.Set_Lvl_Numbered_7(this.Lvl); break;
            case "a."    : this.Num.Set_Lvl_Numbered_8(this.Lvl); break;
            case "i."    : this.Num.Set_Lvl_Numbered_9(this.Lvl); break;
        }
    };
    /**
     * Set the custom type of the numbering.
     * @param {("none" | "bullet" | "decimal" | "lowerRoman" | "upperRoman" | "lowerLetter" | "upperLetter" | "decimalZero")} sType
     * @param {string} sTextFormatString - All text in this parameter shall be taken as literal text to be repeated in
     * each instance of this numbering level, except for any use of the percent symbol (%) followed by a number,
     * which shall be used to indicate the one-based index of the number to be used at this level. Any number of a level
     * higher than this level shall be ignored.
     * @param {("left" | "right" | "center")} sAlign - Type of justification used on a numbering level's text.
     */
    ApiNumberingLevel.prototype.SetCustomType = function(sType, sTextFormatString, sAlign)
    {
        var nType = numbering_numfmt_None;
        if ("none" === sType)
            nType = numbering_numfmt_None;
        else if ("bullet" === sType)
            nType = numbering_numfmt_Bullet;
        else if ("decimal" === sType)
            nType = numbering_numfmt_Decimal;
        else if ("lowerRoman" === sType)
            nType = numbering_numfmt_LowerRoman;
        else if ("upperRoman" === sType)
            nType = numbering_numfmt_UpperRoman;
        else if ("lowerLetter" === sType)
            nType = numbering_numfmt_LowerLetter;
        else if ("upperLetter" === sType)
            nType = numbering_numfmt_UpperLetter;
        else if ("decimalZero" === sType)
            nType = numbering_numfmt_DecimalZero;

        var nAlign = AscCommon.align_Left;
        if ("left" === sAlign)
            nAlign = AscCommon.align_Left;
        else if ("right" === sAlign)
            nAlign = AscCommon.align_Right;
        else if ("center" === sAlign)
            nAlign = AscCommon.align_Center;

        this.Num.Set_Lvl_ByFormat(this.Lvl, nType, sTextFormatString, nAlign);
    };
    /**
     * This element specifies a one-based index which determines when a numbering level should restart to its start 
     * value. A numbering level restarts when an instance of the specified numbering level, which shall be
     * higher (earlier than the this level) is used in the given document's contents. By default this value is true.
     * @param {boolean} isRestart
     */
    ApiNumberingLevel.prototype.SetRestart = function(isRestart)
    {
        this.Num.Set_Lvl_Restart(this.Lvl, private_GetBoolean(isRestart, true));
    };
    /**
     * This element specifies the starting value for the numbering used by the parent numbering level within a given
     * numbering level definition. By default this value is 1.
     * @param {number} nStart
     */
    ApiNumberingLevel.prototype.SetStart = function(nStart)
    {
        this.Num.Set_Lvl_Start(this.Lvl, private_GetInt(nStart));
    };
    /**
     * Specifies the content which shall be added between a given numbering level's text and the text of every numbered
     * paragraph which references that numbering level. By default this value is "tab".
     * @param {("space" | "tab" | "none")} sType
     */
    ApiNumberingLevel.prototype.SetSuff = function(sType)
    {
        if ("space" === sType)
            this.Num.Set_Lvl_Suff(this.Lvl, numbering_suff_Space);
        else if ("tab" === sType)
            this.Num.Set_Lvl_Suff(this.Lvl, numbering_suff_Tab);
        else if ("none" === sType)
            this.Num.Set_Lvl_Suff(this.Lvl, numbering_suff_Nothing);
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Export
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Api.prototype["GetDocument"]                     = Api.prototype.GetDocument;
    Api.prototype["CreateParagraph"]                 = Api.prototype.CreateParagraph;
    Api.prototype["CreateTable"]                     = Api.prototype.CreateTable;

	ApiDocument.prototype["Create_NewHistoryPoint"]  = ApiDocument.prototype.Create_NewHistoryPoint;
	ApiDocument.prototype["GetDefaultTextPr"]        = ApiDocument.prototype.GetDefaultTextPr;
	ApiDocument.prototype["GetDefaultParaPr"]        = ApiDocument.prototype.GetDefaultParaPr;
    ApiDocument.prototype["GetElementsCount"]        = ApiDocument.prototype.GetElementsCount;
    ApiDocument.prototype["GetElement"]              = ApiDocument.prototype.GetElement;
    ApiDocument.prototype["AddElement"]              = ApiDocument.prototype.AddElement;
    ApiDocument.prototype["Push"]                    = ApiDocument.prototype.Push;
    ApiDocument.prototype["RemoveAllElements"]       = ApiDocument.prototype.RemoveAllElements;
    ApiDocument.prototype["GetStyle"]                = ApiDocument.prototype.GetStyle;
    ApiDocument.prototype["CreateStyle"]             = ApiDocument.prototype.CreateStyle;
    ApiDocument.prototype["GetDefaultStyle"]         = ApiDocument.prototype.GetDefaultStyle;
    ApiDocument.prototype["GetFinalSection"]         = ApiDocument.prototype.GetFinalSection;
    ApiDocument.prototype["CreateSection"]           = ApiDocument.prototype.CreateSection;
    ApiDocument.prototype["SetEvenAndOddHdrFtr"]     = ApiDocument.prototype.SetEvenAndOddHdrFtr;
    ApiDocument.prototype["CreateNumbering"]         = ApiDocument.prototype.CreateNumbering;

    ApiParagraph.prototype["AddText"]                = ApiParagraph.prototype.AddText;
    ApiParagraph.prototype["AddPageBreak"]           = ApiParagraph.prototype.AddPageBreak;
    ApiParagraph.prototype["AddLineBreak"]           = ApiParagraph.prototype.AddLineBreak;
    ApiParagraph.prototype["AddColumnBreak"]         = ApiParagraph.prototype.AddColumnBreak;
    ApiParagraph.prototype["GetParagraphMarkTextPr"] = ApiParagraph.prototype.GetParagraphMarkTextPr;
    ApiParagraph.prototype["SetStyle"]               = ApiParagraph.prototype.SetStyle;
    ApiParagraph.prototype["GetParaPr"]              = ApiParagraph.prototype.GetParaPr;
    ApiParagraph.prototype["SetContextualSpacing"]   = ApiParagraph.prototype.SetContextualSpacing;
    ApiParagraph.prototype["SetIndLeft"]             = ApiParagraph.prototype.SetIndLeft;
    ApiParagraph.prototype["SetIndRight"]            = ApiParagraph.prototype.SetIndRight;
    ApiParagraph.prototype["SetIndFirstLine"]        = ApiParagraph.prototype.SetIndFirstLine;
    ApiParagraph.prototype["SetJc"]                  = ApiParagraph.prototype.SetJc;
    ApiParagraph.prototype["SetKeepLines"]           = ApiParagraph.prototype.SetKeepLines;
    ApiParagraph.prototype["SetKeepNext"]            = ApiParagraph.prototype.SetKeepNext;
    ApiParagraph.prototype["SetPageBreakBefore"]     = ApiParagraph.prototype.SetPageBreakBefore;
    ApiParagraph.prototype["SetSpacingLine"]         = ApiParagraph.prototype.SetSpacingLine;
    ApiParagraph.prototype["SetSpacingBefore"]       = ApiParagraph.prototype.SetSpacingBefore;
    ApiParagraph.prototype["SetSpacingAfter"]        = ApiParagraph.prototype.SetSpacingAfter;
    ApiParagraph.prototype["SetShd"]                 = ApiParagraph.prototype.SetShd;
    ApiParagraph.prototype["SetBottomBorder"]        = ApiParagraph.prototype.SetBottomBorder;
    ApiParagraph.prototype["SetLeftBorder"]          = ApiParagraph.prototype.SetLeftBorder;
    ApiParagraph.prototype["SetRightBorder"]         = ApiParagraph.prototype.SetRightBorder;
    ApiParagraph.prototype["SetTopBorder"]           = ApiParagraph.prototype.SetTopBorder;
    ApiParagraph.prototype["SetBetweenBorder"]       = ApiParagraph.prototype.SetBetweenBorder;
    ApiParagraph.prototype["SetWidowControl"]        = ApiParagraph.prototype.SetWidowControl;
    ApiParagraph.prototype["SetTabs"]                = ApiParagraph.prototype.SetTabs;
    ApiParagraph.prototype["SetNumPr"]               = ApiParagraph.prototype.SetNumPr;
    ApiParagraph.prototype["GetNumPr"]               = ApiParagraph.prototype.GetNumPr;


    ApiRun.prototype["GetTextPr"]                    = ApiRun.prototype.GetTextPr;
    ApiRun.prototype["SetBold"]                      = ApiRun.prototype.SetBold;
    ApiRun.prototype["SetItalic"]                    = ApiRun.prototype.SetItalic;
    ApiRun.prototype["SetStrikeout"]                 = ApiRun.prototype.SetStrikeout;
    ApiRun.prototype["SetUnderline"]                 = ApiRun.prototype.SetUnderline;
    ApiRun.prototype["SetFontFamily"]                = ApiRun.prototype.SetFontFamily;
    ApiRun.prototype["SetFontSize"]                  = ApiRun.prototype.SetFontSize;
    ApiRun.prototype["SetColor"]                     = ApiRun.prototype.SetColor;
    ApiRun.prototype["SetVertAlign"]                 = ApiRun.prototype.SetVertAlign;
    ApiRun.prototype["SetHighlight"]                 = ApiRun.prototype.SetHighlight;
    ApiRun.prototype["SetSpacing"]                   = ApiRun.prototype.SetSpacing;
    ApiRun.prototype["SetDoubleStrikeout"]           = ApiRun.prototype.SetDoubleStrikeout;
    ApiRun.prototype["SetCaps"]                      = ApiRun.prototype.SetCaps;
    ApiRun.prototype["SetSmallCaps"]                 = ApiRun.prototype.SetSmallCaps;
    ApiRun.prototype["SetPosition"]                  = ApiRun.prototype.SetPosition;
    ApiRun.prototype["SetLanguage"]                  = ApiRun.prototype.SetLanguage;
    ApiRun.prototype["SetShd"]                       = ApiRun.prototype.SetShd;

    ApiSection.prototype["SetType"]                  = ApiSection.prototype.SetType;
    ApiSection.prototype["SetEqualColumns"]          = ApiSection.prototype.SetEqualColumns;
    ApiSection.prototype["SetNotEqualColumns"]       = ApiSection.prototype.SetNotEqualColumns;
    ApiSection.prototype["SetPageSize"]              = ApiSection.prototype.SetPageSize;
    ApiSection.prototype["SetPageMargins"]           = ApiSection.prototype.SetPageMargins;
    ApiSection.prototype["SetHeaderDistance"]        = ApiSection.prototype.SetHeaderDistance;
    ApiSection.prototype["SetFooterDistance"]        = ApiSection.prototype.SetFooterDistance;
    ApiSection.prototype["GetHeader"]                = ApiSection.prototype.GetHeader;
    ApiSection.prototype["RemoveHeader"]             = ApiSection.prototype.RemoveHeader;
    ApiSection.prototype["GetFooter"]                = ApiSection.prototype.GetFooter;
    ApiSection.prototype["RemoveFooter"]             = ApiSection.prototype.RemoveFooter;
    ApiSection.prototype["SetTitlePage"]             = ApiSection.prototype.SetTitlePage;

	ApiTable.prototype["SetJc"]                      = ApiTable.prototype.SetJc;
    ApiTable.prototype["GetRowsCount"]               = ApiTable.prototype.GetRowsCount;
    ApiTable.prototype["GetRow"]                     = ApiTable.prototype.GetRow;
    ApiTable.prototype["MergeCells"]                 = ApiTable.prototype.MergeCells;
    ApiTable.prototype["SetStyle"]                   = ApiTable.prototype.SetStyle;
    ApiTable.prototype["SetWidth"]                   = ApiTable.prototype.SetWidth;
    ApiTable.prototype["SetJc"]                      = ApiTable.prototype.SetJc;
    ApiTable.prototype["SetTableLook"]               = ApiTable.prototype.SetTableLook;
    ApiTable.prototype["SetTableBorderTop"]          = ApiTable.prototype.SetTableBorderTop;
    ApiTable.prototype["SetTableBorderBottom"]       = ApiTable.prototype.SetTableBorderBottom;
    ApiTable.prototype["SetTableBorderLeft"]         = ApiTable.prototype.SetTableBorderLeft;
    ApiTable.prototype["SetTableBorderRight"]        = ApiTable.prototype.SetTableBorderRight;
    ApiTable.prototype["SetTableBorderInsideH"]      = ApiTable.prototype.SetTableBorderInsideH;
    ApiTable.prototype["SetTableBorderInsideV"]      = ApiTable.prototype.SetTableBorderInsideV;

    ApiTableRow.prototype["GetCellsCount"]           = ApiTableRow.prototype.GetCellsCount;
    ApiTableRow.prototype["GetCell"]                 = ApiTableRow.prototype.GetCell;
    ApiTableRow.prototype["SetHeight"]               = ApiTableRow.prototype.SetHeight;

    ApiTableCell.prototype["GetContent"]             = ApiTableCell.prototype.GetContent;
    ApiTableCell.prototype["SetWidth"]               = ApiTableCell.prototype.SetWidth;
    ApiTableCell.prototype["SetVerticalAlign"]       = ApiTableCell.prototype.SetVerticalAlign;
    ApiTableCell.prototype["SetShd"]                 = ApiTableCell.prototype.SetShd;
    ApiTableCell.prototype["SetTextDirection"]       = ApiTableCell.prototype.SetTextDirection;

    ApiStyle.prototype["GetName"]                    = ApiStyle.prototype.GetName;
    ApiStyle.prototype["SetName"]                    = ApiStyle.prototype.SetName;
    ApiStyle.prototype["GetType"]                    = ApiStyle.prototype.GetType;
    ApiStyle.prototype["GetTextPr"]                  = ApiStyle.prototype.GetTextPr;
    ApiStyle.prototype["GetParaPr"]                  = ApiStyle.prototype.GetParaPr;

    ApiTextPr.prototype["SetBold"]                   = ApiTextPr.prototype.SetBold;
    ApiTextPr.prototype["SetItalic"]                 = ApiTextPr.prototype.SetItalic;
    ApiTextPr.prototype["SetStrikeout"]              = ApiTextPr.prototype.SetStrikeout;
    ApiTextPr.prototype["SetUnderline"]              = ApiTextPr.prototype.SetUnderline;
    ApiTextPr.prototype["SetFontFamily"]             = ApiTextPr.prototype.SetFontFamily;
    ApiTextPr.prototype["SetFontSize"]               = ApiTextPr.prototype.SetFontSize;
    ApiTextPr.prototype["SetColor"]                  = ApiTextPr.prototype.SetColor;
    ApiTextPr.prototype["SetVertAlign"]              = ApiTextPr.prototype.SetVertAlign;
    ApiTextPr.prototype["SetHighlight"]              = ApiTextPr.prototype.SetHighlight;
    ApiTextPr.prototype["SetSpacing"]                = ApiTextPr.prototype.SetSpacing;
    ApiTextPr.prototype["SetDoubleStrikeout"]        = ApiTextPr.prototype.SetDoubleStrikeout;
    ApiTextPr.prototype["SetCaps"]                   = ApiTextPr.prototype.SetCaps;
    ApiTextPr.prototype["SetSmallCaps"]              = ApiTextPr.prototype.SetSmallCaps;
    ApiTextPr.prototype["SetPosition"]               = ApiTextPr.prototype.SetPosition;
    ApiTextPr.prototype["SetLanguage"]               = ApiTextPr.prototype.SetLanguage;
    ApiTextPr.prototype["SetShd"]                    = ApiTextPr.prototype.SetShd;

    ApiParaPr.prototype["SetContextualSpacing"]      = ApiParaPr.prototype.SetContextualSpacing;
    ApiParaPr.prototype["SetIndLeft"]                = ApiParaPr.prototype.SetIndLeft;
    ApiParaPr.prototype["SetIndRight"]               = ApiParaPr.prototype.SetIndRight;
    ApiParaPr.prototype["SetIndFirstLine"]           = ApiParaPr.prototype.SetIndFirstLine;
    ApiParaPr.prototype["SetJc"]                     = ApiParaPr.prototype.SetJc;
    ApiParaPr.prototype["SetKeepLines"]              = ApiParaPr.prototype.SetKeepLines;
    ApiParaPr.prototype["SetKeepNext"]               = ApiParaPr.prototype.SetKeepNext;
    ApiParaPr.prototype["SetPageBreakBefore"]        = ApiParaPr.prototype.SetPageBreakBefore;
    ApiParaPr.prototype["SetSpacingLine"]            = ApiParaPr.prototype.SetSpacingLine;
    ApiParaPr.prototype["SetSpacingBefore"]          = ApiParaPr.prototype.SetSpacingBefore;
    ApiParaPr.prototype["SetSpacingAfter"]           = ApiParaPr.prototype.SetSpacingAfter;
    ApiParaPr.prototype["SetShd"]                    = ApiParaPr.prototype.SetShd;
    ApiParaPr.prototype["SetBottomBorder"]           = ApiParaPr.prototype.SetBottomBorder;
    ApiParaPr.prototype["SetLeftBorder"]             = ApiParaPr.prototype.SetLeftBorder;
    ApiParaPr.prototype["SetRightBorder"]            = ApiParaPr.prototype.SetRightBorder;
    ApiParaPr.prototype["SetTopBorder"]              = ApiParaPr.prototype.SetTopBorder;
    ApiParaPr.prototype["SetBetweenBorder"]          = ApiParaPr.prototype.SetBetweenBorder;
    ApiParaPr.prototype["SetWidowControl"]           = ApiParaPr.prototype.SetWidowControl;
    ApiParaPr.prototype["SetTabs"]                   = ApiParaPr.prototype.SetTabs;
    ApiParaPr.prototype["SetNumPr"]                  = ApiParaPr.prototype.SetNumPr;

    ApiNumbering.prototype["GetLevel"]               = ApiNumbering.prototype.GetLevel;
    
    ApiNumberingLevel.prototype["GetNumbering"]      = ApiNumberingLevel.prototype.GetNumbering;
    ApiNumberingLevel.prototype["GetLevelIndex"]     = ApiNumberingLevel.prototype.GetLevelIndex;
    ApiNumberingLevel.prototype["GetTextPr"]         = ApiNumberingLevel.prototype.GetTextPr;
    ApiNumberingLevel.prototype["GetParaPr"]         = ApiNumberingLevel.prototype.GetParaPr;
    ApiNumberingLevel.prototype["SetTemplateType"]   = ApiNumberingLevel.prototype.SetTemplateType;
    ApiNumberingLevel.prototype["SetCustomType"]     = ApiNumberingLevel.prototype.SetCustomType;
    ApiNumberingLevel.prototype["SetRestart"]        = ApiNumberingLevel.prototype.SetRestart;
    ApiNumberingLevel.prototype["SetStart"]          = ApiNumberingLevel.prototype.SetStart;
    ApiNumberingLevel.prototype["SetSuff"]           = ApiNumberingLevel.prototype.SetSuff;


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Private area
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        return Math.ceil(hps) / 2.0;
    }

    function private_GetColor(r, g, b, Auto)
    {
        return new CDocumentColor(r, g, b, Auto ? Auto : false);
    }

    function private_GetTabStop(nPos, sValue)
    {
        var nType = tab_Left;
        if ("left" === sValue)
            nType = tab_Left;
        else if ("right" === sValue)
            nType = tab_Right;
        else if ("clear" === sValue)
            nType = tab_Clear;
        else if ("center" === sValue)
            nType = tab_Center;

        return new CParaTab(nType, private_Twips2MM(nPos));
    }

    function private_GetParaAlign(sJc)
    {
        if ("left" === sJc)
            return AscCommon.align_Left;
        else if ("right" === sJc)
            return AscCommon.align_Right;
        else if ("both" === sJc)
            return AscCommon.align_Justify;
        else if ("center" === sJc)
            return AscCommon.align_Center;

        return undefined;
    }

    function private_GetTableBorder(sType, nSize, nSpace, r, g, b)
    {
        var oBorder = new CDocumentBorder();

        if ("none" === sType)
        {
            oBorder.Value = border_None;
            oBorder.Size  = 0;
            oBorder.Space = 0;
            oBorder.Color.Set(0, 0, 0, true);
        }
        else
        {
            if ("single" === sType)
                oBorder.Value = border_Single;

            oBorder.Size  = private_Pt_8ToMM(nSize);
            oBorder.Space = private_PtToMM(nSpace);
            oBorder.Color.Set(r, g, b);
        }

        return oBorder;
    }

    function private_GetShd(sType, r, g, b, isAuto)
    {
        var oShd = new CDocumentShd();

        if ("nil" === sType)
            oShd.Value = Asc.c_oAscShdNil;
        else if ("clear" === sType)
            oShd.Value = Asc.c_oAscShdClear;

        oShd.Color.Set(r, g, b, isAuto);
        return oShd;
    }

    function private_GetBoolean(bValue, bDefValue)
    {
        if (true === bValue)
            return true;
        else if (false === bValue)
            return false;
        else
            return (undefined !== bDefValue ? bDefValue : false);
    }

    function private_GetInt(nValue)
    {
        return nValue | 0;
    }

    function private_PtToMM(pt)
    {
        return 25.4 / 72.0 * pt;
    }

    function private_Pt_8ToMM(pt)
    {
        return 25.4 / 72.0 / 8 * pt;
    }

    ApiDocument.prototype.OnChangeParaPr = function(oApiParaPr)
    {
        var oStyles = this.Document.Get_Styles();
        oStyles.Set_DefaultParaPr(oApiParaPr.ParaPr);
        oApiParaPr.ParaPr = oStyles.Get_DefaultParaPr().Copy();
    };
    ApiDocument.prototype.OnChangeTextPr = function(oApiTextPr)
    {
        var oStyles = this.Document.Get_Styles();
        oStyles.Set_DefaultTextPr(oApiTextPr.TextPr);
        oApiTextPr.TextPr = oStyles.Get_DefaultTextPr().Copy();
    };
    ApiParagraph.prototype.private_GetImpl = function()
    {
        return this.Paragraph;
    };
    ApiParagraph.prototype.OnChangeParaPr = function(oApiParaPr)
    {
        this.Paragraph.Set_Pr(oApiParaPr.ParaPr);
        oApiParaPr.ParaPr = this.Paragraph.Pr.Copy();
    };
    ApiParagraph.prototype.OnChangeTextPr = function(oApiTextPr)
    {
        this.Paragraph.TextPr.Set_Value(oApiTextPr.TextPr);
        oApiTextPr.TextPr = this.Paragraph.TextPr.Value.Copy();
    };
    ApiRun.prototype.OnChangeTextPr = function(oApiTextPr)
    {
        this.Run.Set_Pr(oApiTextPr.TextPr);
        oApiTextPr.TextPr = this.Run.Pr.Copy();
    };
    ApiTable.prototype.private_GetImpl = function()
    {
        return this.Table;
    };
    ApiStyle.prototype.OnChangeTextPr = function(oApiTextPr)
    {
        this.Style.Set_TextPr(oApiTextPr.TextPr);
        oApiTextPr.TextPr = this.Style.TextPr.Copy();
    };
    ApiStyle.prototype.OnChangeParaPr = function(oApiParaPr)
    {
        this.Style.Set_ParaPr(oApiParaPr.ParaPr);
        oApiParaPr.ParaPr = this.Style.ParaPr.Copy();
    };
    ApiNumberingLevel.prototype.OnChangeTextPr = function(oApiTextPr)
    {
        this.Num.Set_TextPr(this.Lvl, oApiTextPr.TextPr);
        oApiTextPr.TextPr = this.Num.Lvl[this.Lvl].TextPr.Copy();
    };
    ApiNumberingLevel.prototype.OnChangeParaPr = function(oApiParaPr)
    {
        this.Num.Set_ParaPr(this.Lvl, oApiParaPr.ParaPr);
        oApiParaPr.ParaPr = this.Num.Lvl[this.Lvl].ParaPr.Copy();
    };
    ApiTextPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTextPr(this);
    };
    ApiParaPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeParaPr(this);
    };

}(window, null));


function TEST_BUILDER()
{
    var oLD = editor.WordControl.m_oLogicDocument;
    oLD.Create_NewHistoryPoint();
    //------------------------------------------------------------------------------------------------------------------

    // Воссоздаем документ DemoHyden

    var Api = editor;

    var oRun;
    var oDocument     = Api.GetDocument();
    var oNoSpacingStyle = oDocument.GetStyle("No Spacing");
    var oFinalSection   = oDocument.GetFinalSection();
    oFinalSection.SetEqualColumns(2, 720);
    oFinalSection.SetPageSize(12240, 15840);
    oFinalSection.SetPageMargins(1440, 1440, 1440, 1440);
    oFinalSection.SetHeaderDistance(720);
    oFinalSection.SetFooterDistance(720);
    oFinalSection.SetType("continuous");

    // Генерим стили, которые будем использовать в документе
    var oTextPr, oParaPr;

    oTextPr = oDocument.GetDefaultTextPr();
    oTextPr.SetFontSize(22);
    oTextPr.SetLanguage("en-US");
    oTextPr.SetFontFamily("Calibri");

    oParaPr = oDocument.GetDefaultParaPr();
    oParaPr.SetSpacingLine(276, "auto");
    oParaPr.SetSpacingAfter(200);

    var oNormalStyle = oDocument.GetDefaultStyle("paragraph");
    oParaPr = oNormalStyle.GetParaPr();
    oParaPr.SetSpacingLine(240, "auto");
    oParaPr.SetJc("both");
    oTextPr = oNormalStyle.GetTextPr();
    oTextPr.SetColor(0x26, 0x26, 0x26, false);

    var oHeading1Style = oDocument.CreateStyle("Heading 1", "paragraph");
    oParaPr = oHeading1Style.GetParaPr();
    oParaPr.SetKeepNext(true);
    oParaPr.SetKeepLines(true);
    oParaPr.SetSpacingAfter(240);
    oTextPr = oHeading1Style.GetTextPr();
    oTextPr.SetColor(0xff, 0x68, 0x00, false);
    oTextPr.SetFontSize(40);
    oTextPr.SetFontFamily("Calibri Light");

    var oSubtitleStyle = oDocument.CreateStyle("Subtitle");
    oParaPr = oSubtitleStyle.GetParaPr();
    oParaPr.SetSpacingAfter(0);
    oParaPr.SetSpacingBefore(240);
    oTextPr = oSubtitleStyle.GetTextPr();
    oTextPr.SetColor(0xff, 0x68, 0x00, false);
    oTextPr.SetFontSize(32);
    oTextPr.SetFontFamily("Calibri Light");


    var oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(276, "auto");
    oParagraph.SetJc("left");
    var oEndRun = oParagraph.GetParagraphMarkTextPr();
    oEndRun.SetFontSize(52);
    oEndRun.SetColor(0x14, 0x14, 0x14, false);
    oEndRun.SetSpacing(5);
    oParagraph.AddPageBreak();
    // TODO: Добавить 2 автофигуры
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oNoSpacingStyle);
    // TODO: Добавить aвтофигуру
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    // TODO: Добавить aвтофигуру
    oParagraph.AddText("Overview");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.AddText("In the previous meeting of the board of directors funds were approved to take the product “Innovate 1” to market.  They have also allocated a sum of $250,000  towards market identification and launch efforts. This document describes in brief the objective set forth by the VP of marketing pursuant to the board’s decision.");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
    // TODO: Добавить aвтофигуру
    oParagraph.AddText("Summary");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
    // TODO: Добавить автофигуру
    oParagraph.AddText("After years of market research and focused creative effort we are in a position to take our “Innovate 1” to market. We have a three phase approach in place to complete the product and take the product to market.  The first step of this initiative is to test the market.  Once we have identified the market, then we will make any final product product to drive that effectively keeps down costs while meeting sales goals. ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
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
    oParagraph.SetStyle(oHeading1Style);
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
    oParagraph.AddText("Details");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(240);
    oParagraph.AddText("Out of the $250,000 allocated for this effort, we would like to spend about $50,000 towards the identification of the market.  For this we are allowed to engage with a marketing consulting organization.  Let us start with creating an RFP for this and start inviting the bids.   We would like to get the selection process completed by no later than end of first quarter.");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingBefore(100, true);
    oParagraph.SetSpacingAfter(360);
    oDocument.Push(oParagraph);
    var oSection1 = oDocument.CreateSection(oParagraph);
    oSection1.SetEqualColumns(1, 720);
    oSection1.SetPageSize(12240, 15840);
    oSection1.SetPageMargins(1440, 1440, 1440, 1440);
    oSection1.SetHeaderDistance(720);
    oSection1.SetFooterDistance(576);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oSubtitleStyle);
    // TODO: Добавить автофигуру
    oParagraph.AddText("Legal Issues");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    // TODO: Добавить автофигуру
    oParagraph.AddText("To support the new product, the Legal Department will maintain a centralized repository for all patent investigations as well as marketing claims.  The release team will adhere to all of the standardized processes for releasing new products.   ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(0);
    oParagraph.AddText("As we approach release of the product, the Legal Department is prepared ");
    oParagraph.AddText("to develop all licensing agreements and has streamlined coordination with the marketing and sales department on the license terms and addendums.   ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetStyle(oSubtitleStyle);
    oParagraph.AddText("Statement on Timeline");


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetSpacingAfter(0);
    oParagraph.AddText("All timelines in this report are estimated and highly dependent upon each team meeting their individual objectives. There are many interdependencies that are detailed in the related project plan.  ");


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetStyle(oSubtitleStyle);
    oParagraph.AddText("Productivity Gains");


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.AddText("To support the new product, the Legal Department will maintain a centralized repository for all patent investigations");
    oParagraph.AddText(" as well as marketing claims.  ");


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetStyle(oSubtitleStyle);
    oParagraph.AddText("License Agreements");


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(0);
    oParagraph.AddText("All timelines in this report are estimated and highly dependent upon each team meetin");
    oParagraph.AddText("g their individual objectives.  I");
    oParagraph.AddText("nterdependencies are detailed in the related project plan.  ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetStyle(oSubtitleStyle);
    oParagraph.SetKeepNext(true);
    oParagraph.SetKeepLines(true);
    oParagraph.AddText("Revenue Forecasting");


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.SetKeepNext(true);
    oParagraph.SetKeepLines(true);
    oParagraph.AddText("To support the new product, the Legal Department will maintain a centralized repository for all ");
    oParagraph.AddText("patent investigations and");
    oParagraph.AddText(" marketing claims.  The release team will adhere to all of the stand");
    oParagraph.AddText("ardized processes for releasing ");
    oParagraph.AddText("new products.   ");


    var oTableGridStyle = oDocument.GetStyle("TableGrid");
    var oTable = Api.CreateTable(2, 2);
    oDocument.Push(oTable);
    oTable.SetStyle(oTableGridStyle);
    oTable.SetWidth("twips", 4311);
    oTable.SetTableLook(true, true, false, false, true, false);
    oTable.SetTableBorderTop("single", 4, 0, 0xAF, 0xAD, 0x91);
    oTable.SetTableBorderBottom("single", 4, 0, 0xAF, 0xAD, 0x91);
    oTable.SetTableBorderLeft("single", 4, 0, 0xAF, 0xAD, 0x91);
    oTable.SetTableBorderRight("single", 4, 0, 0xAF, 0xAD, 0x91);
    oTable.SetTableBorderInsideH("single", 4, 0, 0xAF, 0xAD, 0x91);
    oTable.SetTableBorderInsideV("single", 4, 0, 0xAF, 0xAD, 0x91);
    var oRow = oTable.GetRow(0), oCell, oCellContent;
    if (oRow)
    {
        oRow.SetHeight("atLeast", 201);
        oCell = oRow.GetCell(0);
        oCell.SetWidth("twips", 1637);
        oCell.SetShd("clear", 0xff, 0x68, 0x00, false);
        oCell.SetVerticalAlign("center");
        oCellContent = oCell.GetContent();
        oParagraph = oCellContent.GetElement(0);
        oParagraph.SetJc("center");
        oRun = oParagraph.AddText("2014");
        oRun.SetBold(true);
        oRun.SetColor(0, 0, 0, false);

        oCell = oRow.GetCell(1);
        oCell.SetWidth("twips", 2674);
        oCell.SetShd("clear", 0xff, 0x68, 0x00, false);
        oCell.SetVerticalAlign("center");
        oCellContent = oCell.GetContent();
        oParagraph = oCellContent.GetElement(0);
        oParagraph.SetJc("center");
        oRun = oParagraph.AddText("2015");
        oRun.SetBold(true);
        oRun.SetColor(0, 0, 0, false);
    }
    oRow = oTable.GetRow(1);
    if (oRow)
    {
        oRow.SetHeight("atLeast", 1070);
        oCell = oRow.GetCell(0);
        oCell.SetWidth("twips", 1637);
        oCell.SetVerticalAlign("center");
        oCellContent = oCell.GetContent();
        oParagraph = oCellContent.GetElement(0);
        oParagraph.SetJc("center");
        oParagraph.AddText("All Projects");
        oParagraph.AddLineBreak();
        oParagraph.AddText("Pending");


        oCell = oRow.GetCell(1);
        oCell.SetWidth("twips", 2674);
        oCell.SetShd("clear", 0, 0, 0, true);
        oCell.SetVerticalAlign("center");
        oCellContent = oCell.GetContent();
        oCellContent.RemoveAllElements();
        var oInnerTable = Api.CreateTable(3, 3);
        oCellContent.Push(oInnerTable);
        oInnerTable.SetStyle(oTableGridStyle);
        oInnerTable.SetWidth("twips", 2448);
        oInnerTable.SetTableLook(true, true, false, false, true, false);
        var oMergeCells = [];
        oRow = oInnerTable.GetRow(0);
        if(oRow)
        {
            oRow.SetHeight("atLeast", 201);
            oCell = oRow.GetCell(0);
            if (oCell)
            {
                oMergeCells.push(oCell);
            }
            oCell = oRow.GetCell(1);
            if (oCell)
            {
                oCell.SetWidth("twips", 865);
                oCell.SetShd("clear", 0xFF, 0xc2, 0x99, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("West");
            }
            oCell = oRow.GetCell(2);
            if (oCell)
            {
                oCell.SetWidth("twips", 1092);
                oCell.SetShd("clear", 0xff, 0xe0, 0xcc, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("Approved");
            }
        }
        oRow = oInnerTable.GetRow(1);
        if (oRow)
        {
            oRow.SetHeight("atLeast", 196);
            oCell = oRow.GetCell(0);
            if (oCell)
            {
                oMergeCells.push(oCell);
            }

            oCell = oRow.GetCell(1);
            if (oCell)
            {
                oCell.SetWidth("twips", 865);
                oCell.SetShd("clear", 0xFF, 0xc2, 0x99, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("Central");
            }
            oCell = oRow.GetCell(2);
            if (oCell)
            {
                oCell.SetWidth("twips", 1092);
                oCell.SetShd("clear", 0xff, 0xe0, 0xcc, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("Pending");
            }
        }
        oRow = oInnerTable.GetRow(2);
        if (oRow)
        {
            oRow.SetHeight("atLeast", 196);
            oCell = oRow.GetCell(0);
            if (oCell)
            {
                oMergeCells.push(oCell);
            }
            oCell = oRow.GetCell(1);
            if (oCell)
            {
                oCell.SetWidth("twips", 865);
                oCell.SetShd("clear", 0xFF, 0xc2, 0x99, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("East");
            }
            oCell = oRow.GetCell(2);
            if (oCell)
            {
                oCell.SetWidth("twips", 1092);
                oCell.SetShd("clear", 0xff, 0xe0, 0xcc, false);
                oCellContent = oCell.GetContent();
                oParagraph = oCellContent.GetElement(0);
                oParagraph.AddText("Approved");
            }
        }
        var oMergedCell = oInnerTable.MergeCells(oMergeCells);
        oMergedCell.SetVerticalAlign("center");
        oMergedCell.SetTextDirection("btlr");
        oMergedCell.SetWidth("twips", 491);
        oMergedCell.SetShd("clear", 0xff, 0xa4, 0x66, false);
        oCellContent = oMergedCell.GetContent();
        oParagraph = oCellContent.GetElement(0);
        oParagraph.SetIndLeft(113);
        oParagraph.SetIndRight(113);
        oParagraph.SetJc("center");
        oRun = oParagraph.AddText("USA");
        oRun.SetBold(true);
    }


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oTextPr = oParagraph.GetParagraphMarkTextPr();
    oTextPr.SetColor(0xff, 0x00, 0x00);
    oTextPr.SetFontFamily("Segoe UI");

    // Filling ups header and footer
    oSection1.SetTitlePage(true);
    var oDocContent = oSection1.GetHeader("default", true);
    oDocContent.RemoveAllElements();
    oTable = Api.CreateTable(2, 1);
    oDocContent.Push(oTable);
    oTable.SetWidth("auto");
    oTable.SetJc("right");
    oTable.SetTableLook(true, true, false, false, true, false);

    oTable.SetTableBorderLeft("none");
    oTable.SetTableBorderRight("none");
    oTable.SetTableBorderTop("none");
    oTable.SetTableBorderBottom("none");
    oTable.SetTableBorderInsideV("none");


    oRow = oTable.GetRow(0);
    if (oRow)
    {
        oRow.SetHeight("atLeast", 792);
        oCell = oRow.GetCell(0);
        if (oCell)
        {
            oCell.SetWidth("twips", 3337);
            oCell.SetVerticalAlign("bottom");
            oCellContent = oCell.GetContent();
            oParagraph = oCellContent.GetElement(0);
            oParagraph.SetStyle("Header");
            oParagraph.SetJc("right");
            oTextPr = oParagraph.GetParagraphMarkTextPr();
            oTextPr.SetFontFamily("Calibri Light");
            oTextPr.SetFontSize(28);
            oRun = oParagraph.AddText("HAYDEN MANAGEMENT");
            oRun.SetSmallCaps(true);
            oRun.SetFontSize(32);
            oRun.SetFontFamily("Calibri Light");
        }
        oCell = oRow.GetCell(1);
        if (oCell)
        {
            oCell.SetWidth("twips", 792);
            oCell.SetShd("clear", 0xff, 0xa4, 0x65);
            oCell.SetVerticalAlign("center");
            oCellContent = oCell.GetContent();
            oParagraph = oCellContent.GetElement(0);
            oParagraph.SetStyle("Header");
            oParagraph.SetJc("center");
            oParagraph.GetParagraphMarkTextPr().SetColor(0xff, 0xff, 0xff);
            oRun = oParagraph.AddText("1");
            oRun.SetColor(0xff, 0xff, 0xff);
        }
    }

    oParagraph = Api.CreateParagraph();
    oDocContent.Push(oParagraph);

    oDocContent = oSection1.GetFooter("default", true);
    oDocContent.RemoveAllElements();
    oTable = Api.CreateTable(2, 1);
    oDocContent.Push(oTable);
    oTable.SetWidth("auto");
    oTable.SetJc("right");
    oTable.SetTableLook(true, true, false, false, true, false);
    oRow = oTable.GetRow(0);
    if (oRow)
    {
        oCell = oRow.GetCell(0);
        if (oCell)
        {
            oCell.SetWidth("auto");
            oCellContent = oCell.GetContent();
            oParagraph = oCellContent.GetElement(0);
            oParagraph.SetStyle("Footer");
            oParagraph.SetJc("right");
            oParagraph.AddText("Hayden Management");
            oParagraph.AddText(" | Confidential");
        }
        oCell = oRow.GetCell(1);
        if (oCell)
        {
            oCell.SetWidth("auto");
            oCellContent = oCell.GetContent();
            oParagraph = oCellContent.GetElement(0);
            oParagraph.SetStyle("Footer");
            oParagraph.SetJc("right");
            // TODO: Добавить автофигуру
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart(true);
}

function TEST_BUILDER2()
{
    var oLD = editor.WordControl.m_oLogicDocument;
    oLD.Create_NewHistoryPoint();
    //------------------------------------------------------------------------------------------------------------------
    var Api = editor;
    var oDocument  = Api.GetDocument();
    var oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);

    oParagraph.AddText("Plain");
    oParagraph.AddText("Bold").SetBold(true);
    oParagraph.AddText("Italic").SetItalic(true);
    oParagraph.AddText("Strikeout").SetStrikeout(true);
    oParagraph.AddText("Underline").SetUnderline(true);
    oParagraph.AddText("Calibri").SetFontFamily("Calibri");
    oParagraph.AddText("FontSize40").SetFontSize(40);
    oParagraph.AddText("ColorGreen").SetColor(0, 255, 0);
    oParagraph.AddText("Superscript").SetVertAlign("superscript");
    oParagraph.AddText("Subscript").SetVertAlign("subscript");
    oParagraph.AddText("HighlightBlue").SetHighlight(0, 0, 255);
    oParagraph.AddText("Spacing 1pt").SetSpacing(20);
    oParagraph.AddText("Spacing -1pt").SetSpacing(-20);
    oParagraph.AddText("DoubleStrikeout").SetDoubleStrikeout(true);
    oParagraph.AddText("Capitals").SetCaps(true);
    oParagraph.AddText("SmallCapitals").SetSmallCaps(true);
    oParagraph.AddText("Position +10pt").SetPosition(20);
    oParagraph.AddText("Position -10pt").SetPosition(-20);
    oParagraph.AddText("Language English(Canada)").SetLanguage("en-CA");
    oParagraph.AddText("Language Russia").SetLanguage("ru-RU");
    oParagraph.AddText("ShadeRed").SetShd("clear", 255, 0, 0);

    oParagraph = Api.CreateParagraph();
    oParagraph.AddText("Normal paragraph");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetContextualSpacing(true);
    oParagraph.AddText("ContextualSpacing is true");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndLeft(300);
    oParagraph.AddText("Left indent is 15pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndRight(600);
    oParagraph.AddText("Right indent is 30pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndFirstLine(100);
    oParagraph.AddText("First line indent is 5pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetIndFirstLine(-100);
    oParagraph.AddText("First line indent is -5pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetJc("left");
    oParagraph.AddText("Paragraph align: left");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetJc("right");
    oParagraph.AddText("Paragraph align: right");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetJc("center");
    oParagraph.AddText("Paragraph align: center");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetJc("both");
    oParagraph.AddText("Paragraph align: both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both both ");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetKeepLines(true);
    oParagraph.AddText("KeepLines");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetKeepNext(true);
    oParagraph.AddText("KeepNext");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetPageBreakBefore(true);
    oParagraph.AddText("PageBreakBefore");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(3 * 240, "auto");
    oParagraph.AddText("Spacing: multiply 3");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(200, "exact");
    oParagraph.AddText("Spacing: exact 10pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(400, "atLeast");
    oParagraph.AddText("Spacing: atLeast 20pt");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingBefore(200);
    oParagraph.SetSpacingAfter(0);
    oParagraph.AddText("Spacing: before 10pt after 0");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingBefore(0, true);
    oParagraph.SetSpacingAfter(0, true);
    oParagraph.AddText("Spacing: before auto after auto");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetShd("clear", 0, 255, 0, false);
    oParagraph.AddText("Shading: green");
    oDocument.Push(oParagraph);

    for (var nIndex = 0; nIndex < 3; ++nIndex)
    {
        oParagraph = Api.CreateParagraph();
        oDocument.Push(oParagraph);
        oParagraph.AddText("Borders");

        oParagraph.SetTopBorder("single", 24, 0, 255, 0, 0);
        oParagraph.SetBottomBorder("single", 24, 0, 0, 255, 0);
        oParagraph.SetLeftBorder("single", 48, 0, 0, 0, 255);
        oParagraph.SetRightBorder("single", 48, 0, 255, 255, 0);
        oParagraph.SetBetweenBorder("single", 36, 0, 255, 0, 255);
    }

    oParagraph = Api.CreateParagraph();
    oParagraph.SetWidowControl(false);
    oParagraph.AddText("Widow control is off");
    oDocument.Push(oParagraph);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetTabs([1000, 1500, 3000], ["center", "left", "right"]);
    oParagraph.AddText("Custom tabs (center, left, right)");
    oDocument.Push(oParagraph);


    var oNumbering = oDocument.CreateNumbering("bullet");
    var oNumLvl;
    for (var nLvl = 0; nLvl < 8; ++nLvl)
    {
        oNumLvl = oNumbering.GetLevel(nLvl);
        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Default bullet lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);
        oDocument.Push(oParagraph);
    }

    oNumbering = oDocument.CreateNumbering("numbered");
    for (var nLvl = 0; nLvl < 8; ++nLvl)
    {
        oNumLvl = oNumbering.GetLevel(nLvl);
        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Default numbered lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);
        oDocument.Push(oParagraph);
    }

    oNumbering = oDocument.CreateNumbering("numbered");
    for (var nLvl = 0; nLvl < 8; ++nLvl)
    {
        oNumLvl = oNumbering.GetLevel(nLvl);

        var sFormatString = "";
        for (var nTempLvl = 0; nTempLvl <= nLvl; ++nTempLvl)
            sFormatString += "%" + nTempLvl + ".";

        oNumLvl.SetCustomType("lowerRoman", sFormatString, "left");
        oNumLvl.SetStart(nLvl + 1);
        oNumLvl.SetSuff("space");

        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Custom numbered lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);
        oDocument.Push(oParagraph);

        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Custom numbered lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);
        oDocument.Push(oParagraph);
    }

    oNumbering = oDocument.CreateNumbering("bullet");
    for (var nLvl = 0; nLvl < 8; ++nLvl)
    {
        oNumLvl = oNumbering.GetLevel(nLvl);

        var sSymbolCharCode = 'a'.charCodeAt(0) + nLvl;
        oNumLvl.SetTemplateType("bullet", String.fromCharCode(sSymbolCharCode));
        oNumLvl.SetSuff("none");
        oNumLvl.GetTextPr().SetBold(true);
        oNumLvl.GetParaPr().SetJc("center");

        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Template bullet lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);
        oDocument.Push(oParagraph);

        oParagraph = Api.CreateParagraph();
        oParagraph.AddText("Template bullet  lvl " + (nLvl + 1));
        oParagraph.SetNumbering(oNumLvl);
        oParagraph.SetContextualSpacing(true);

        oDocument.Push(oParagraph);
    }

    var oSection = oDocument.GetFinalSection();
    var oHeader = oSection.GetHeader("default", true);

    oParagraph = oHeader.GetElement(0);
    oParagraph.AddText("I'm in default header");

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart();
}

