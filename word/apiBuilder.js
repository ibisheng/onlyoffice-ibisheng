/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
(function(window, builder)
{
    /**
     * @global
     * @class
     * @name Api
     */
    var Api = window["Asc"]["asc_docs_api"];

    /**
     * Class representing a container for paragraphs and tables.
     * @param Document
     * @constructor
     */
    function ApiDocumentContent(Document)
    {
        this.Document = Document;
    }

    /**
     * Class representing a document.
     * @constructor
     * @extends {ApiDocumentContent}
     */
    function ApiDocument(Document)
    {
        ApiDocument.superclass.constructor.call(this, Document);
    }
    AscCommon.extendClass(ApiDocument, ApiDocumentContent);

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
     * Class representing a paragraph.
     * @constructor
     * @extends {ApiParaPr}
     */
    function ApiParagraph(Paragraph)
    {
        ApiParagraph.superclass.constructor.call(this, this, Paragraph.Pr.Copy());
        this.Paragraph = Paragraph;
    }
    AscCommon.extendClass(ApiParagraph, ApiParaPr);

    /**
     * Class representing a table properties.
     * @constructor
     */
    function ApiTablePr(Parent, TablePr)
    {
        this.Parent  = Parent;
        this.TablePr = TablePr;
    }

    /**
     * Class representing a table.
     * @constructor
     * @extends {ApiTablePr}
     */
    function ApiTable(Table)
    {
        ApiTable.superclass.constructor.call(this, this, Table.Pr.Copy());
        this.Table = Table;
    }
    AscCommon.extendClass(ApiTable, ApiTablePr);

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
     * Class representing a small text block calling 'run'.
     * @constructor
     * @extends {ApiTextPr}
     */
    function ApiRun(Run)
    {
        ApiRun.superclass.constructor.call(this, this, Run.Pr.Copy());
        this.Run = Run;
    }
    AscCommon.extendClass(ApiRun, ApiTextPr);

    /**
     * Class representing a style.
     * @constructor
     */
    function ApiStyle(Style)
    {
        this.Style = Style;
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
     * Class representing a table row properties.
     * @constructor
     */
    function ApiTableRowPr(Parent, RowPr)
    {
        this.Parent = Parent;
        this.RowPr  = RowPr;
    }

    /**
     * Class representing a table row.
     * @constructor
     * @extends {ApiTableRowPr}
     */
    function ApiTableRow(Row)
    {
        ApiTableRow.superclass.constructor.call(this, this, Row.Pr.Copy());
        this.Row = Row;
    }
    AscCommon.extendClass(ApiTableRow, ApiTableRowPr);

    /**
     * Class representing a table cell proprties.
     * @constructor
     */
    function ApiTableCellPr(Parent, CellPr)
    {
        this.Parent = Parent;
        this.CellPr = CellPr;
    }
    /**
     * Class representing a table cell.
     * @constructor
     * @extends {ApiTableCellPr}
     */
    function ApiTableCell(Cell)
    {
        ApiTableCell.superclass.constructor.call(this, this, Cell.Pr.Copy());
        this.Cell = Cell;
    }
    AscCommon.extendClass(ApiTableCell, ApiTableCellPr);

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
     * Class representing a set of formatting properties which shall be conditionally applied to the parts of a table
     * which match the requirement specified on the <code>Type</code>.
     * @constructor
     */
    function ApiTableStylePr(Type, Parent, TableStylePr)
    {
        this.Type         = Type;
        this.Parent       = Parent;
        this.TableStylePr = TableStylePr;
    }

    /**
     * Class representing an unsupported element.
     * @constructor
     */
    function ApiUnsupported()
    {
    }

    /**
     * Class representing a graphical object.
     * @constructor
     */
    function ApiDrawing(Drawing)
    {
        this.Drawing = Drawing;
    }

    /**
     * Class representing a image.
     * @constructor
     */
    function ApiImage(Image)
    {
        ApiImage.superclass.constructor.call(this, Image.parent);
        this.Image = Image
    }
    AscCommon.extendClass(ApiImage, ApiDrawing);

    /**
     * Class representing a shape.
     * @constructor
     * */
    function ApiShape(Shape)
    {
        ApiShape.superclass.constructor.call(this, Shape.parent);
        this.Shape = Shape;
    }
    AscCommon.extendClass(ApiShape, ApiDrawing);

    /**
     * Class representing a Chart.
     * @constructor
     *
     */
    function ApiChart(Chart)
    {
        ApiChart.superclass.constructor.call(this, Chart.parent);
        this.Chart = Chart;
    }
    AscCommon.extendClass(ApiChart, ApiDrawing);

    /**
     * Class representing a base class for color types
     * @constructor
     */
    function ApiUniColor(Unicolor)
    {
        this.Unicolor = Unicolor;
    }
    /**
     * Class representing RGB color
     * @constructor
     */
    function ApiRGBColor(r, g, b)
    {
        ApiRGBColor.superclass.constructor.call(this, AscFormat.CreateUniColorRGB(r, g, b));
    }
    AscCommon.extendClass(ApiRGBColor, ApiUniColor);

    /**
     * Class representing a Scheme Color
     * @constructor
     */
    function ApiSchemeColor(sColorId)
    {
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.setColor(new AscFormat.CSchemeColor());
        switch(sColorId)
        {
            case "accent1": {  oUniColor.color.id  = 0; break;}
            case "accent2": {  oUniColor.color.id  = 1; break;}
            case "accent3": {  oUniColor.color.id  = 2; break;}
            case "accent4": {  oUniColor.color.id  = 3; break;}
            case "accent5": {  oUniColor.color.id  = 4; break;}
            case "accent6": {  oUniColor.color.id  = 5; break;}
            case "bg1": {  oUniColor.color.id      = 6; break;}
            case "bg2": {  oUniColor.color.id      = 7; break;}
            case "dk1": {  oUniColor.color.id      = 8; break;}
            case "dk2": {  oUniColor.color.id      = 9; break;}
            case "lt1": {  oUniColor.color.id      = 12; break;}
            case "lt2": {  oUniColor.color.id      = 13; break;}
            case "tx1": {  oUniColor.color.id      = 15; break;}
            case "tx2": {  oUniColor.color.id      = 16; break;}
            default: {  oUniColor.color.id      = 16; break;}
        }
        ApiSchemeColor.superclass.constructor.call(this, oUniColor);
    }
    AscCommon.extendClass(ApiSchemeColor, ApiUniColor);

    /**
     * Class representing a Preset Color
     * @constructor
     * */
    function ApiPresetColor(sPresetColor)
    {
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.setColor(new AscFormat.CPrstColor());
        oUniColor.color.id = sPresetColor;
        ApiPresetColor.superclass.constructor.call(this, oUniColor);
    }
    AscCommon.extendClass(ApiPresetColor, ApiUniColor);

    /**
     * Class represent a base class fill
     * @constructor
     * */
    function ApiFill(UniFill)
    {
        this.UniFill = UniFill;
    }


    /**
     * Class represent a stroke class
     * @constructor
     */
    function ApiStroke(oLn)
    {
        this.Ln= oLn;
    }


    /**
     * Class represent gradient stop
     * @constructor
     * */
    function ApiGradientStop(oApiUniColor, pos)
    {
        this.Gs = new AscFormat.CGs();
        this.Gs.pos = pos;
        this.Gs.color = oApiUniColor.Unicolor;
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
     *  A numeric value from 0 to 359.
     * @typedef {number} PositiveFixedAngle
     * */

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

    /**
     * The possible values for the units of the width property being defined by a specific table width property.
     * @typedef {("auto" | "twips" | "nul" | "percent")} TableWidth
     */

    /**
     * This simple type specifies possible values for the sections of the table to which the current conditional
     * formatting properties shall be applied when this table style is used.
     * <b>"topLeftCell"</b> - Specifies that the table formatting applies to the top left cell. <br/>
     * <b>"topRightCell"</b> - Specifies that the table formatting applies to the top right cell. <br/>
     * <b>"bottomLeftCell"</b> - Specifies that the table formatting applies to the bottom left cell.<br/>
     * <b>"bottomRightCell"</b> - Specifies that the table formatting applies to the bottom right cell.<br/>
     * <b>"firstRow"</b> - Specifies that the table formatting applies to the first row. <br/>
     * <b>"lastRow"</b> - Specifies that the table formatting applies to the last row. <br/>
     * <b>"firstColumn"</b> - Specifies that the table formatting applies to the first column. Any subsequent row which
     * is in <i>table header</i>{@link ApiTableRowPr#SetTableHeader} shall also use this conditional format.<br/>
     * <b>"lastColumn"</b> - Specifies that the table formatting applies to the last column. <br/>
     * <b>"bandedColumn"</b> - Specifies that the table formatting applies to odd numbered groupings of rows.<br/>
     * <b>"bandedColumnEven"</b> - Specifies that the table formatting applies to even numbered groupings of rows.<br/>
     * <b>"bandedRow"</b> - Specifies that the table formatting applies to odd numbered groupings of columns.<br/>
     * <b>"bandedRowEven"</b> - Specifies that the table formatting applies to even numbered groupings of columns.<br/>
     * <b>"wholeTable"</b> - Specifies that the conditional formatting applies to the whole table.<br/>
     * @typedef {("topLeftCell" | "topRightCell" | "bottomLeftCell" | "bottomRightCell" | "firstRow" | "lastRow" | "firstColumn" | "lastColumn" | "bandedColumn" | "bandedColumnEven" | "bandedRow" | "bandedRowEven" | "wholeTable")} TableStyleOverrideType
     */

    /**
     * The types of elements that can be in the paragraph
     * @typedef {(ApiUnsupported | ApiRun)} ParagraphContent
     */

    /**
     * The possible values for the base from which the relative horizontal positioning of an object shall be calculated.
     * @typedef {("character" | "column" | "leftMargin" | "rightMargin" | "margin" | "page")} RelFromH
     */

    /**
     * The possible values for the base from which the relative vertical positioning of an object shall be calculated.
     * @typedef {("bottomMargin" | "topMargin" | "margin" | "page" | "line" | "paragraph")} RelFromV
     */

    /**
     * English measure unit. 1mm = 36000EMUs, 1inch = 914400EMUs
     * @typedef {number} EMU
     */

    /**
     * This type specifies the preset shape geometry that is to be used for a shape
     * @typedef {("accentBorderCallout1" | "accentBorderCallout2" | "accentBorderCallout3" | "accentCallout1" | "accentCallout2" | "accentCallout3" | "actionButtonBackPrevious" | "actionButtonBeginning" | "actionButtonBlank" | "actionButtonDocument" | "actionButtonEnd" | "actionButtonForwardNext" | "actionButtonHelp" | "actionButtonHome" | "actionButtonInformation" | "actionButtonMovie" | "actionButtonReturn" | "actionButtonSound" | "arc" | "bentArrow" | "bentConnector2" | "bentConnector3" | "bentConnector4" | "bentConnector5" | "bentUpArrow" | "bevel" | "blockArc" | "borderCallout1" | "borderCallout2" | "borderCallout3" | "bracePair" | "bracketPair" | "callout1" | "callout2" | "callout3" | "can" | "chartPlus" | "chartStar" | "chartX" | "chevron" | "chord" | "circularArrow" | "cloud" | "cloudCallout" | "corner" | "cornerTabs" | "cube" | "curvedConnector2" | "curvedConnector3" | "curvedConnector4" | "curvedConnector5" | "curvedDownArrow" | "curvedLeftArrow" | "curvedRightArrow" | "curvedUpArrow" | "decagon" | "diagStripe" | "diamond" | "dodecagon" | "donut" | "doubleWave" | "downArrow" | "downArrowCallout" | "ellipse" | "ellipseRibbon" | "ellipseRibbon2" | "flowChartAlternateProcess" | "flowChartCollate" | "flowChartConnector" | "flowChartDecision" | "flowChartDelay" | "flowChartDisplay" | "flowChartDocument" | "flowChartExtract" | "flowChartInputOutput" | "flowChartInternalStorage" | "flowChartMagneticDisk" | "flowChartMagneticDrum" | "flowChartMagneticTape" | "flowChartManualInput" | "flowChartManualOperation" | "flowChartMerge" | "flowChartMultidocument" | "flowChartOfflineStorage" | "flowChartOffpageConnector" | "flowChartOnlineStorage" | "flowChartOr" | "flowChartPredefinedProcess" | "flowChartPreparation" | "flowChartProcess" | "flowChartPunchedCard" | "flowChartPunchedTape" | "flowChartSort" | "flowChartSummingJunction" | "flowChartTerminator" | "foldedCorner" | "frame" | "funnel" | "gear6" | "gear9" | "halfFrame" | "heart" | "heptagon" | "hexagon" | "homePlate" | "horizontalScroll" | "irregularSeal1" | "irregularSeal2" | "leftArrow" | "leftArrowCallout" | "leftBrace" | "leftBracket" | "leftCircularArrow" | "leftRightArrow" | "leftRightArrowCallout" | "leftRightCircularArrow" | "leftRightRibbon" | "leftRightUpArrow" | "leftUpArrow" | "lightningBolt" | "line" | "lineInv" | "mathDivide" | "mathEqual" | "mathMinus" | "mathMultiply" | "mathNotEqual" | "mathPlus" | "moon" | "nonIsoscelesTrapezoid" | "noSmoking" | "notchedRightArrow" | "octagon" | "parallelogram" | "pentagon" | "pie" | "pieWedge" | "plaque" | "plaqueTabs" | "plus" | "quadArrow" | "quadArrowCallout" | "rect" | "ribbon" | "ribbon2" | "rightArrow" | "rightArrowCallout" | "rightBrace" | "rightBracket" | "round1Rect" | "round2DiagRect" | "round2SameRect" | "roundRect" | "rtTriangle" | "smileyFace" | "snip1Rect" | "snip2DiagRect" | "snip2SameRect" | "snipRoundRect" | "squareTabs" | "star10" | "star12" | "star16" | "star24" | "star32" | "star4" | "star5" | "star6" | "star7" | "star8" | "straightConnector1" | "stripedRightArrow" | "sun" | "swooshArrow" | "teardrop" | "trapezoid" | "triangle" | "upArrowCallout" | "upDownArrow" | "upDownArrow" | "upDownArrowCallout" | "uturnArrow" | "verticalScroll" | "wave" | "wedgeEllipseCallout" | "wedgeRectCallout" | "wedgeRoundRectCallout")} ShapeType
     */

    /**
     * This type specifies the types, create charts
     * @typedef {("bar" | "barStacked" | "barStackedPercent" | "bar3D" | "barStacked3D" | "barStackedPercent3D" | "barStackedPercent3DPerspective" | "horizontalBar" | "horizontalBarStacked" | "horizontalBarStackedPercent" | "horizontalBar3D" | "horizontalBarStacked3D" | "horizontalBarStackedPercent3D" | "lineNormal" | "lineStacked" | "lineStackedPercent" | "line3D" | "pie" | "pie3D" | "doughnut" | "scatter" | "stock")} ChartType
     */

    /**
     * @typedef {("top" | "center" | "bottom")} VerticalTextAlign
     * */

    /**
     * @typedef {("accent1" | "accent2" | "accent3" | "accent4" | "accent5" | "accent6" | "bg1" | "bg2" | "dk1" | "dk2" | "lt1" | "lt2" | "tx1" | "tx2")} SchemeColorId
     * */

    /**
     * @typedef {("aliceBlue" | "antiqueWhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" | "blanchedAlmond" | "blue" | "blueViolet" | "brown" | "burlyWood" | "cadetBlue" | "chartreuse" | "chocolate" | "coral" | "cornflowerBlue" | "cornsilk" | "crimson" | "cyan" | "darkBlue" | "darkCyan" | "darkGoldenrod" | "darkGray" | "darkGreen" | "darkGrey" | "darkKhaki" | "darkMagenta" | "darkOliveGreen" | "darkOrange" | "darkOrchid" | "darkRed" | "darkSalmon" | "darkSeaGreen" | "darkSlateBlue" | "darkSlateGray" | "darkSlateGrey" | "darkTurquoise" | "darkViolet" | "deepPink" | "deepSkyBlue" | "dimGray" | "dimGrey" | "dkBlue" | "dkCyan" | "dkGoldenrod" | "dkGray" | "dkGreen" | "dkGrey" | "dkKhaki" | "dkMagenta" | "dkOliveGreen" | "dkOrange" | "dkOrchid" | "dkRed" | "dkSalmon" | "dkSeaGreen" | "dkSlateBlue" | "dkSlateGray" | "dkSlateGrey" | "dkTurquoise" | "dkViolet" | "dodgerBlue" | "firebrick" | "floralWhite" | "forestGreen" | "fuchsia" | "gainsboro" | "ghostWhite" | "gold" | "goldenrod" | "gray" | "green" | "greenYellow" | "grey" | "honeydew" | "hotPink" | "indianRed" | "indigo" | "ivory" | "khaki" | "lavender" | "lavenderBlush" | "lawnGreen" | "lemonChiffon" | "lightBlue" | "lightCoral" | "lightCyan" | "lightGoldenrodYellow" | "lightGray" | "lightGreen" | "lightGrey" | "lightPink" | "lightSalmon" | "lightSeaGreen" | "lightSkyBlue" | "lightSlateGray" | "lightSlateGrey" | "lightSteelBlue" | "lightYellow" | "lime" | "limeGreen" | "linen" | "ltBlue" | "ltCoral" | "ltCyan" | "ltGoldenrodYellow" | "ltGray" | "ltGreen" | "ltGrey" | "ltPink" | "ltSalmon" | "ltSeaGreen" | "ltSkyBlue" | "ltSlateGray" | "ltSlateGrey" | "ltSteelBlue" | "ltYellow" | "magenta" | "maroon" | "medAquamarine" | "medBlue" | "mediumAquamarine" | "mediumBlue" | "mediumOrchid" | "mediumPurple" | "mediumSeaGreen" | "mediumSlateBlue" | "mediumSpringGreen" | "mediumTurquoise" | "mediumVioletRed" | "medOrchid" | "medPurple" | "medSeaGreen" | "medSlateBlue" | "medSpringGreen" | "medTurquoise" | "medVioletRed" | "midnightBlue" | "mintCream" | "mistyRose" | "moccasin" | "navajoWhite" | "navy" | "oldLace" | "olive" | "oliveDrab" | "orange" | "orangeRed" | "orchid" | "paleGoldenrod" | "paleGreen" | "paleTurquoise" | "paleVioletRed" | "papayaWhip" | "peachPuff" | "peru" | "pink" | "plum" | "powderBlue" | "purple" | "red" | "rosyBrown" | "royalBlue" | "saddleBrown" | "salmon" | "sandyBrown" | "seaGreen" | "seaShell" | "sienna" | "silver" | "skyBlue" | "slateBlue" | "slateGray" | "slateGrey" | "snow" | "springGreen" | "steelBlue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whiteSmoke" | "yellow" | "yellowGreen")} PresetColor
     * */

    /**
     * @typedef {"tile" | "stretch"} BlipFillType
     * */

    /**
     * @typedef {"cross" | "dashDnDiag" | "dashHorz" | "dashUpDiag" | "dashVert" | "diagBrick" | "diagCross" | "divot" | "dkDnDiag" | "dkHorz" | "dkUpDiag" | "dkVert" | "dnDiag" | "dotDmnd" | "dotGrid" | "horz" | "horzBrick" | "lgCheck" | "lgConfetti" | "lgGrid" | "ltDnDiag" | "ltHorz" | "ltUpDiag" | "ltVert" | "narHorz" | "narVert" | "openDmnd" | "pct10" | "pct20" | "pct25" | "pct30" | "pct40" | "pct5" | "pct50" | "pct60" | "pct70" | "pct75" | "pct80" | "pct90" | "plaid" | "shingle" | "smCheck" | "smConfetti" | "smGrid" | "solidDmnd" | "sphere" | "trellis" | "upDiag" | "vert" | "wave" | "wdDnDiag" | "wdUpDiag" | "weave" | "zigZag"} PatternType
     * */
    //------------------------------------------------------------------------------------------------------------------
    //
    // Base Api
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * @typedef {number} PositivePercentage
     * */

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
     * Create a new paragraph.
     * @memberof Api
     * @returns {ApiParagraph}
     */
    Api.prototype.CreateParagraph = function()
    {
        return new ApiParagraph(new Paragraph(private_GetDrawingDocument(), private_GetLogicDocument()));
    };
    /**
     * Create a new table.
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
        oTable.Set_TableStyle2(undefined);
        return new ApiTable(oTable);
    };
    /**
     * Create a new text block.
     * @memberof Api
     * @returns {ApiRun}
     */
    Api.prototype.CreateRun = function()
    {
        return new ApiRun(new ParaRun(null, false));
    };

    /**
     * Create a image.
     * @memberof Api
     * @param {string} sImageSrc
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @returns {ApiImage}
     */
    Api.prototype.CreateImage = function(sImageSrc, nWidth, nHeight)
    {
        var nW = private_EMU2MM(nWidth);
        var nH = private_EMU2MM(nHeight);

        var oDrawing = new ParaDrawing(nW, nH, null, private_GetDrawingDocument(), private_GetLogicDocument(), null);
        var oImage = private_GetLogicDocument().DrawingObjects.createImage(sImageSrc, 0, 0, nW, nH);
        oImage.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oImage);
        return new ApiImage(oImage);
    };

    /**
     * Create a shape.
     * @memberof Api
     * @param {ShapeType} [sType="rect"]
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @param {ApiFill} oFill
     * @param {ApiStroke} oStroke
     * @returns {ApiShape}
     * */
    Api.prototype.CreateShape = function(sType, nWidth, nHeight, oFill, oStroke)
    {
        var oLogicDocument = private_GetLogicDocument();
        var oDrawingDocuemnt = private_GetDrawingDocument();
        var nW = private_EMU2MM(nWidth);
        var nH = private_EMU2MM(nHeight);
        var oDrawing = new ParaDrawing(nW, nH, null, oDrawingDocuemnt, oLogicDocument, null);
        var oShapeTrack = new AscFormat.NewShapeTrack(sType, 0, 0, oLogicDocument.theme, null, null, null, 0);
        oShapeTrack.track({}, nW, nH);
        var oShape = oShapeTrack.getShape(true, oDrawingDocuemnt, null);
        oShape.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oShape);
        oShape.createTextBoxContent();
        oShape.spPr.setFill(oFill.UniFill);
        oShape.spPr.setLn(oStroke.Ln);
        return new ApiShape(oShape);
    };

    /**
     * Create a chart.
     * @memberof Api
     * @param {ChartType} [sType="bar"]
     * @param {Array} aSeries
     * @param {Array} aSeriesNames
     * @param {Array} aCatNames
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @returns {ApiChart}
     * */
    Api.prototype.CreateChart = function(sType, aSeries, aSeriesNames, aCatNames, nWidth, nHeight)
    {
        var oDrawingDocument = private_GetDrawingDocument();
        var oLogicDocument = private_GetLogicDocument();
        var nW = private_EMU2MM(nWidth);
        var nH = private_EMU2MM(nHeight);
        var settings = new AscCommon.asc_ChartSettings();
        switch (sType)
        {
            case "bar" :
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal;
                break;
            }
            case "barStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStacked;
                break;
            }
            case "barStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStackedPer;
                break;
            }
            case "bar3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal3d;
                break;
            }
            case "barStacked3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStacked3d;
                break;
            }
            case "barStackedPercent3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStackedPer3d;
                break;
            }
            case "barStackedPercent3DPerspective":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal3dPerspective;
                break;
            }
            case "horizontalBar":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarNormal;
                break;
            }
            case "horizontalBarStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStacked;
                break;
            }
            case "horizontalBarStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer;
                break;
            }
            case "horizontalBar3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarNormal3d;
                break;
            }
            case "horizontalBarStacked3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStacked3d;
                break;
            }
            case "horizontalBarStackedPercent3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer3d;
                break;
            }
            case "lineNormal":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineNormal;
                break;
            }
            case "lineStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineStacked;
                break;
            }
            case "lineStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineStackedPer;
                break;
            }
            case "line3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.line3d;
                break;
            }
            case "pie":
            {
                settings.type = Asc.c_oAscChartTypeSettings.pie;
                break;
            }
            case "pie3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.pie3d;
                break;
            }
            case "doughnut":
            {
                settings.type = Asc.c_oAscChartTypeSettings.doughnut;
                break;
            }
            case "scatter":
            {
                settings.type = Asc.c_oAscChartTypeSettings.scatter;
                break;
            }
            case "stock":
            {
                settings.type = Asc.c_oAscChartTypeSettings.stock;
                break;
            }
        }
        var aAscSeries = [];
        var aAlphaBet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var oCat, i;
        if(aCatNames.length > 0)
        {
            var aNumCache = [];
            for(i = 0; i < aCatNames.length; ++i)
            {
                aNumCache.push({val: aCatNames[i] + ""});
            }
            oCat = { Formula: "Sheet1!$B$1:$" + AscFormat.CalcLiterByLength(aAlphaBet, aCatNames.length) + "$1", NumCache: aNumCache };
        }
        for(i = 0; i < aSeries.length; ++i)
        {
            var oAscSeries = new AscFormat.asc_CChartSeria();
            oAscSeries.Val.NumCache = [];
            var aData = aSeries[i];
            var sEndLiter = AscFormat.CalcLiterByLength(aAlphaBet, aData.length);
            oAscSeries.Val.Formula = 'Sheet1!' + '$B$' + (i + 2) + ':$' + sEndLiter + '$' + (i + 2);
            if(aSeriesNames[i])
            {
                oAscSeries.TxCache.Formula =  'Sheet1!' + '$A$' + (i + 2);
                oAscSeries.TxCache.Tx = aSeriesNames[i];
            }
            if(oCat)
            {
                oAscSeries.Cat = oCat;
            }
            for(var j = 0; j < aData.length; ++j)
            {

                oAscSeries.Val.NumCache.push({ numFormatStr: "General", isDateTimeFormat: false, val: aData[j], isHidden: false });
            }
            aAscSeries.push(oAscSeries);
        }
        var chartSeries = {series: aAscSeries, parsedHeaders: {bLeft: true, bTop: true}};
        var oDrawing = new ParaDrawing( nW, nH, null, oDrawingDocument, null, null);
        var oChartSpace = AscFormat.DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        if(!oChartSpace)
        {
            return null;
        }
        oChartSpace.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oChartSpace);
        oChartSpace.setBDeleted(false);
        oChartSpace.extX = nW;
        oChartSpace.extY = nH;
        AscFormat.CheckSpPrXfrm(oChartSpace);
        oDrawing.setExtent( oChartSpace.spPr.xfrm.extX, oChartSpace.spPr.xfrm.extY );
        return new ApiChart(oChartSpace);
    };

    /**
     * Create a RGB color
     * @memberof Api
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @returns {ApiRGBColor}
     */
    Api.prototype.CreateRGBColor = function(r, g, b)
    {
        return new ApiRGBColor(r, g, b);
    };

    /**
     * Create a scheme color
     * @memberof Api
     * @param {SchemeColorId} sSchemeColorId
     * @returns {ApiSchemeColor}
     */
    Api.prototype.CreateSchemeColor = function(sSchemeColorId)
    {
        return new ApiSchemeColor(sSchemeColorId);
    };

    /**
     * Create preset color
     * @memberof Api
     * @param {PresetColor} sPresetColor
     * @returns {ApiPresetColor};
     * */
    Api.prototype.CreatePresetColor = function(sPresetColor)
    {
        return new ApiPresetColor(sPresetColor);
    };

    /**
     * Create a solid fill
     * @memberof Api
     * @param {ApiUniColor} oUniColor
     * @returns {ApiFill}
     * */
    Api.prototype.CreateSolidFill = function(oUniColor)
    {
        return new ApiFill(AscFormat.CreateUniFillByUniColor(oUniColor.Unicolor));
    };

    /**
     * Create a linear gradient fill
     * @memberof Api
     * @param {Array} aGradientStop
     * @param {PositiveFixedAngle} Angle
     * @returns {ApiFill}
     */
    Api.prototype.CreateLinearGradientFill = function(aGradientStop, Angle)
    {
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CGradFill();
        for(var i = 0; i < aGradientStop.length; ++i)
        {
            oUniFill.fill.colors.push(aGradientStop[i].Gs);
        }
        oUniFill.fill.lin = new AscFormat.GradLin();
        oUniFill.fill.lin.angle = Angle;
        return new ApiFill(oUniFill);
    };

    /**
     * Create a radial gradient fill
     * @memberof Api
     * @param {Array} aGradientStop
     * @returns {ApiFill}
     */
    Api.prototype.CreateRadialGradientFill = function(aGradientStop)
    {
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CGradFill();
        for(var i = 0; i < aGradientStop.length; ++i)
        {
            oUniFill.fill.colors.push(aGradientStop[i].Gs);
        }
        oUniFill.fill.path = new AscFormat.GradPath();
        return new ApiFill(oUniFill);
    };

    /**
     * Create a pattern fill
     * @memberof Api
     * @param {PatternType} sPatternType
     * @param {ApiUniColor} BgColor
     * @param {ApiUniColor} FgColor
     * @returns {ApiFill}
     */
    Api.prototype.CreatePatternFill= function(sPatternType, BgColor, FgColor)
    {
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CPattFill();
        oUniFill.fill.ftype = AscCommon.global_hatch_offsets[sPatternType];
        oUniFill.fill.fgClr = FgColor.Unicolor;
        oUniFill.fill.bgClr = BgColor.Unicolor;
        return new ApiFill(oUniFill);
    };

    /**
     * Create a blip fill
     * @memberof Api
     * @param {string} sImageUrl
     * @param {BlipFillType} sBlipFillType
     * @returns {ApiFill}
     * */
    Api.prototype.CreateBlipFill= function(sImageUrl, sBlipFillType)
    {
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CBlipFill();
        oUniFill.fill.RasterImageId = sImageUrl;
        if(sBlipFillType === "tile")
        {
            oUniFill.fill.tile = new AscFormat.CBlipFillTile();
        }
        else if(sBlipFillType === "stretch")
        {
            oUniFill.fill.stretch = true;
        }
        return new ApiFill(oUniFill);
    };

    /**
     * Create no fill
     * @memberof Api
     * @returns {ApiFill}
     * */
    Api.prototype.CreateNoFill= function(sImageUrl, sBlipFillType)
    {
        return new ApiFill(AscFormat.CreateNoFillUniFill());
    };

    /**
     * Create a stroke
     * @memberof Api
     * @param {EMU} nWidth
     * @param {ApiFill} oFill
     * @returns {ApiStroke}
     * */
    Api.prototype.CreateStroke = function(nWidth, oFill)
    {
        if(nWidth === 0)
        {
            return new ApiStroke(AscFormat.CreateNoFillLine());
        }
        var oLn = new AscFormat.CLn();
        oLn.w = nWidth;
        oLn.Fill = oFill.UniFill;
        return new ApiStroke(oLn);
    };

    /**
     * Create a stroke
     * @memberof Api
     * @param {ApiUniColor} oUniColor
     * @param {PositivePercentage} nPos
     * @returns {ApiGradientStop}
     * */
    Api.prototype.CreateGradientStop = function(oUniColor, nPos)
    {
        return new ApiGradientStop(oUniColor, nPos);
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiUnsupported
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"unsupported"}
     */
    ApiUnsupported.prototype.GetClassType = function()
    {
        return "unsupported";
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDocumentContent
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"documentContent"}
     */
    ApiDocumentContent.prototype.GetClassType = function()
    {
        return "documentContent";
    };
    /**
     * Get the number of elements.
     * @returns {number}
     */
    ApiDocumentContent.prototype.GetElementsCount = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Get element by position
     * @returns {?DocumentElement}
     */
    ApiDocumentContent.prototype.GetElement = function(nPos)
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
    ApiDocumentContent.prototype.AddElement = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(nPos, oElement.private_GetImpl(), false);
        }
    };
    /**
     * Push paragraph or table
     * @param {DocumentElement} oElement
     */
    ApiDocumentContent.prototype.Push = function(oElement)
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
    ApiDocumentContent.prototype.RemoveAllElements = function()
    {
        this.Document.Content = [];
    };
    /**
     * Remove element by specified position.
     * @param {number} nPos
     */
    ApiDocumentContent.prototype.RemoveElement = function(nPos)
    {
        if (nPos < 0 || nPos >= this.GetElementsCount())
            return;

        this.Document.Internal_Content_Remove(nPos, 1);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDocument
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"document"}
     */
    ApiDocument.prototype.GetClassType = function()
    {
        return "document";
    };
    /**
     * Create new history point.
     */
    ApiDocument.prototype.CreateNewHistoryPoint = function()
    {
        this.Document.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApiBuilder);
    };
    /**
     * Get style by style name
     * @param {string} sStyleName
     * @returns {?ApiStyle}
     */
    ApiDocument.prototype.GetStyle = function(sStyleName)
    {
        var oStyles  = this.Document.Get_Styles();
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

        var oStyle        = new CStyle(sStyleName, null, null, nStyleType, false);
        oStyle.qFormat    = true;
        oStyle.uiPriority = 1;
        var oStyles       = this.Document.Get_Styles();

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
            return null;

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
        var oNumberingId     = oGlobalNumbering.Create_AbstractNum();
        var oNumbering       = oGlobalNumbering.Get_AbstractNum(oNumberingId);

        if ("numbered" === sType)
            oNumbering.Create_Default_Numbered();
        else
            oNumbering.Create_Default_Bullet();

        return new ApiNumbering(oNumbering);
    };

	/**
	 * Insert an array of elements in the current position of the document.
     * @param {DocumentElement[]} arrContent - An array of elements to insert.
     * @returns {boolean} Success?
     */
    ApiDocument.prototype.InsertContent = function(arrContent)
    {
        var oSelectedContent = new CSelectedContent();
        for (var nIndex = 0, nCount = arrContent.length; nIndex < nCount; ++nIndex)
        {
            var oElement = arrContent[nIndex];
            if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
            {
                oSelectedContent.Add(new CSelectedElement(oElement.private_GetImpl(), true));
            }
        }

        if (this.Document.Is_SelectionUse())
        {
            this.Document.Start_SilentMode();
            this.Document.Remove(1, false, false, false);
            this.Document.End_SilentMode();
            this.Document.Selection_Remove(true);
        }

        var oParagraph = this.Document.Content[this.Document.CurPos.ContentPos];
        if (!oParagraph || !(oParagraph instanceof Paragraph))
            return false;

        var oNearestPos = {
            Paragraph  : oParagraph,
            ContentPos : oParagraph.Get_ParaContentPos(false, false)
        };

        oParagraph.Check_NearestPos(oNearestPos);

        if (!this.Document.Can_InsertContent(oSelectedContent, oNearestPos))
            return false;

        this.Document.Insert_Content(oSelectedContent, oNearestPos);
        this.Document.Selection_Remove(true);
        oParagraph.Clear_NearestPosArray();
        return true;
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiParagraph
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"document"}
     */
    ApiParagraph.prototype.GetClassType = function()
    {
        return "paragraph";
    };
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
     * Add page break.
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
     * Add line break.
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
     * Add column break.
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
     * Get paragraph properties.
     * @returns {ApiParaPr}
     */
    ApiParagraph.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Paragraph.Pr.Copy());
    };
    /**
     * Get a numbering definition and numbering level.
     * @returns {?ApiNumberingLevel}
     */
    ApiParagraph.prototype.GetNumbering = function()
    {
        var oNumPr = this.Paragraph.Numbering_Get();
        if (!oNumPr)
            return null;

        var oLogicDocument   = private_GetLogicDocument();
        var oGlobalNumbering = oLogicDocument.Get_Numbering();
        var oNumbering       = oGlobalNumbering.Get_AbstractNum(oNumPr.NumId);
        if (!oNumbering)
            return null;

        return new ApiNumberingLevel(oNumbering, oNumPr.Lvl);
    };
    /**
     * Specifies that the current paragraph references a numbering definition instance in the current document.
     * @see Same as {@link ApiParagraph#SetNumPr}
     * @param {ApiNumberingLevel} oNumberingLevel
     */
    ApiParagraph.prototype.SetNumbering = function(oNumberingLevel)
    {
        if (!(oNumberingLevel instanceof ApiNumberingLevel))
            return;

        this.SetNumPr(oNumberingLevel.GetNumbering(), oNumberingLevel.GetLevelIndex());
    };
    /**
     * Get the number of elements in the current paragraph.
     * @returns {number}
     */
    ApiParagraph.prototype.GetElementsCount = function()
    {
        // TODO: ParaEnd
        return this.Paragraph.Content.length - 1;
    };
    /**
     * Get the element of the paragraph content by specified position.
     * @param {number} nPos
     * @returns {?ParagraphContent}
     */
    ApiParagraph.prototype.GetElement = function(nPos)
    {
        // TODO: ParaEnd
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 1)
            return null;

        var oElement = this.Paragraph.Content[nPos];
        if (oElement instanceof ParaRun)
            return new ApiRun(oElement);
        else
            return new ApiUnsupported();
    };
    /**
     * Remove element by specified position.
     * @param {number} nPos
     */
    ApiParagraph.prototype.RemoveElement = function(nPos)
    {
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 1)
            return;

        this.Paragraph.Remove_FromContent(nPos, 1);
    };
    /**
     * Remove all elements.
     */
    ApiParagraph.prototype.RemoveAllElements = function()
    {
        if (this.Paragraph.Content.length > 1)
            this.Paragraph.Remove_FromContent(0, this.Paragraph.Content.length - 1);
    };
    /**
     * Add an element to paragraph content.
     * @param {ParagraphContent} oElement
     * @param {number} [nPos] If this value is not specified then element will be added to the end of this paragraph.
     * @returns {boolean} Returns <code>false</code> if the type of <code>oElement</code> is not supported by paragraph
     * content.
     */
    ApiParagraph.prototype.AddElement = function(oElement, nPos)
    {
        // TODO: ParaEnd
        if (!(oElement instanceof ApiRun) || nPos < 0 || nPos > this.Paragraph.Content.length - 1)
            return false;

        var oParaElement = oElement.private_GetImpl();
        if (undefined !== nPos)
        {
            this.Paragraph.Add_ToContent(nPos, oParaElement);
        }
        else
        {
            private_PushElementToParagraph(this.Paragraph, oParaElement);
        }

        return true;
    };
    /**
     * Add a tab stop.
     * @returns {ApiRun}
     */
    ApiParagraph.prototype.AddTabStop = function()
    {
        var oRun = new ParaRun(this.Paragraph, false);
        oRun.Add_ToContent(0, new ParaTab());
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Add a drawing.
     * @param {ApiDrawing} oDrawing
     * @returns {ApiRun}
     */
    ApiParagraph.prototype.AddDrawing = function(oDrawing)
    {
        var oRun = new ParaRun(this.Paragraph, false);

        if (!(oDrawing instanceof ApiDrawing))
            return new ApiRun(oRun);

        oRun.Add_ToContent(0, oDrawing.Drawing);
        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiRun
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"run"}
     */
    ApiRun.prototype.GetClassType = function()
    {
        return "run";
    };
    /**
     * Get the text properties of the current run.
     * @returns {ApiTextPr}
     */
    ApiRun.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.Run.Pr.Copy());
    };
    /**
     * Remove all content from the current run.
     */
    ApiRun.prototype.ClearContent = function()
    {
        this.Run.Remove_FromContent(0, this.Run.Content.length);
    };
    /**
     * Add text to this run.
     * @param {string} sText
     */
    ApiRun.prototype.AddText = function(sText)
    {
        if (!sText || !sText.length)
            return;

        var nLastPos = this.Run.Content.length;

        for (var nPos = 0, nCount = sText.length; nPos < nCount; ++nPos)
        {
            var nChar = sText.charAt(nPos);
            if (" " == nChar)
                this.Run.Add_ToContent(nLastPos + nPos, new ParaSpace(), false);
            else
                this.Run.Add_ToContent(nLastPos + nPos, new ParaText(nChar), false);
        }
    };
    /**
     * Add a page break.
     */
    ApiRun.prototype.AddPageBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Page));
    };
    /**
     * Add a line break.
     */
    ApiRun.prototype.AddLineBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Line));
    };
    /**
     * Add a column break.
     */
    ApiRun.prototype.AddColumnBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Column));
    };
    /**
     * Add a tab stop.
     */
    ApiRun.prototype.AddTabStop = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaTab());
    };
    /**
     * Add a drawing.
     * @param {ApiDrawing} oDrawing
     */
    ApiRun.prototype.AddDrawing = function(oDrawing)
    {
        if (!(oDrawing instanceof ApiDrawing))
            return;

        this.Run.Add_ToContent(this.Run.Content.length, oDrawing.Drawing);
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiSection
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"section"}
     */
    ApiSection.prototype.GetClassType = function()
    {
        return "section";
    };
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
            this.Section.Set_Type(c_oAscSectionBreakType.OddPage);
        else if ("evenPage" === sType)
            this.Section.Set_Type(c_oAscSectionBreakType.EvenPage);
        else if ("continuous" === sType)
            this.Section.Set_Type(c_oAscSectionBreakType.Continuous);
        else if ("nextColumn" === sType)
            this.Section.Set_Type(c_oAscSectionBreakType.Column);
        else if ("nextPage" === sType)
            this.Section.Set_Type(c_oAscSectionBreakType.NextPage);
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
            return;

        this.Section.Set_Columns_EqualWidth(false);
        var aCols = [];
        for (var nPos = 0, nCount = aWidths.length; nPos < nCount; ++nPos)
        {
            var SectionColumn   = new CSectionColumn();
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
        this.Section.Set_Orientation(false === isPortrait ? Asc.c_oAscPageOrientation.PageLandscape : Asc.c_oAscPageOrientation.PagePortrait, false);
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
     * @returns {?ApiDocumentContent}
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
            oHeader            = new CHeaderFooter(oLogicDocument.Get_HdrFtr(), oLogicDocument, oLogicDocument.Get_DrawingDocument(), hdrftr_Header);
            if ("title" === sType)
                this.Section.Set_Header_First(oHeader);
            else if ("even" === sType)
                this.Section.Set_Header_Even(oHeader);
            else if ("default" === sType)
                this.Section.Set_Header_Default(oHeader);
        }

        return new ApiDocumentContent(oHeader.Get_DocumentContent());
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
     * @returns {?ApiDocumentContent}
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
            oFooter            = new CHeaderFooter(oLogicDocument.Get_HdrFtr(), oLogicDocument, oLogicDocument.Get_DrawingDocument(), hdrftr_Footer);
            if ("title" === sType)
                this.Section.Set_Footer_First(oFooter);
            else if ("even" === sType)
                this.Section.Set_Footer_Even(oFooter);
            else if ("default" === sType)
                this.Section.Set_Footer_Default(oFooter);
        }

        return new ApiDocumentContent(oFooter.Get_DocumentContent());
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
     * Get the type of this class.
     * @returns {"table"}
     */
    ApiTable.prototype.GetClassType = function()
    {
        return "table";
    };
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
        private_StartSilentMode();
        this.private_PrepareTableForActions();

        var oTable            = this.Table;
        oTable.Selection.Use  = true;
        oTable.Selection.Type = table_Selection_Cell;
        oTable.Selection.Data = [];

        for (var nPos = 0, nCount = aCells.length; nPos < nCount; ++nPos)
        {
            var oCell = aCells[nPos].Cell;
            var oPos  = {Cell : oCell.Index, Row : oCell.Row.Index};

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

        var isMerged = this.Table.Cell_Merge(true);
        var oMergedCell = this.Table.CurCell;
        oTable.Selection_Remove();

        private_EndSilentMode();

        if (true === isMerged)
            return new ApiTableCell(oMergedCell);

        return null;
    };
    /**
     * Set table style.
     * @param {ApiStyle} oStyle
     */
    ApiTable.prototype.SetStyle = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle) || styletype_Table !== oStyle.Style.Get_Type())
            return;

        this.Table.Set_TableStyle(oStyle.Style.Get_Id(), true);
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
        var oTableLook = new CTableLook(private_GetBoolean(isFirstColumn),
            private_GetBoolean(isFirstRow),
            private_GetBoolean(isLastColumn),
            private_GetBoolean(isLastRow),
            private_GetBoolean(isHorBand),
            private_GetBoolean(isVerBand));
        this.Table.Set_TableLook(oTableLook);
    };
    /**
     * Add a new row to the current table.
     * @param {ApiTableCell} [oCell] - If not specified a new row will be added to the end of the table.
     * @param {boolean} [isBefore=false] - Add a new row before or after the specified cell. If no cell is specified
     * then this parameter will be ignored.
     * @returns {ApiTableRow}
     */
    ApiTable.prototype.AddRow = function(oCell, isBefore)
    {
        private_StartSilentMode();
        this.private_PrepareTableForActions();

        var _isBefore = private_GetBoolean(isBefore, false);
        var _oCell = (oCell instanceof ApiTableCell ? oCell.Cell : undefined);
        if (_oCell && this.Table !== _oCell.Row.Table)
            _oCell = undefined;

        if (!_oCell)
        {
            _oCell = this.Table.Content[this.Table.Content.length - 1].Get_Cell(0);
            _isBefore = false;
        }

        var nRowIndex = true === _isBefore ? _oCell.Row.Index : _oCell.Row.Index + 1;

        this.Table.Selection_Remove();
        this.Table.CurCell = _oCell;
        this.Table.Row_Add(_isBefore);

        private_EndSilentMode();
        return new ApiTableRow(this.Table.Content[nRowIndex]);
    };
    /**
     * Add a new column to the end of the current table.
     * @param {ApiTableCell} [oCell] - If not specified a new column will be added to the end of the table.
     * @param {boolean} [isBefore=false] - Add a new column before or after the specified cell. If no cell is specified
     * then this parameter will be ignored.
     */
    ApiTable.prototype.AddColumn = function(oCell, isBefore)
    {
        private_StartSilentMode();
        this.private_PrepareTableForActions();

        var _isBefore = private_GetBoolean(isBefore, false);
        var _oCell = (oCell instanceof ApiTableCell ? oCell.Cell : undefined);
        if (_oCell && this.Table !== _oCell.Row.Table)
            _oCell = undefined;

        if (!_oCell)
        {
            _oCell = this.Table.Content[0].Get_Cell(this.Table.Content[0].Get_CellsCount() - 1);
            _isBefore = false;
        }

        this.Table.Selection_Remove();
        this.Table.CurCell = _oCell;
        this.Table.Col_Add(_isBefore);

        private_EndSilentMode();
    };
    /**
     * Remove the table row with a specified cell.
     * @param {ApiTableCell} oCell
     * @returns {boolean} Is the table empty after removing.
     */
    ApiTable.prototype.RemoveRow = function(oCell)
    {
        if (!(oCell instanceof ApiTableCell) || this.Table !== oCell.Cell.Row.Table)
            return false;

        private_StartSilentMode();
        this.private_PrepareTableForActions();

        this.Table.Selection_Remove();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.Row_Remove());

        private_EndSilentMode();
        return isEmpty;
    };
    /**
     * Remove the table column with a specified cell.
     * @param {ApiTableCell} oCell
     * @returns {boolean} Is the table empty after removing.
     */
    ApiTable.prototype.RemoveColumn = function(oCell)
    {
        if (!(oCell instanceof ApiTableCell) || this.Table !== oCell.Cell.Row.Table)
            return false;

        private_StartSilentMode();
        this.private_PrepareTableForActions();

        this.Table.Selection_Remove();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.Col_Remove());

        private_EndSilentMode();
        return isEmpty;
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableRow
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tableRow"}
     */
    ApiTableRow.prototype.GetClassType = function()
    {
        return "tableRow";
    };
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

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableCell
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tableCell"}
     */
    ApiTableCell.prototype.GetClassType = function()
    {
        return "tableCell";
    };
    /**
     * Get cell content.
     * @returns {ApiDocumentContent}
     */
    ApiTableCell.prototype.GetContent = function()
    {
        return new ApiDocumentContent(this.Cell.Content);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiStyle
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"style"}
     */
    ApiStyle.prototype.GetClassType = function()
    {
        return "style";
    };
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
    /**
     * Get the table properties of the current style.
     * @returns {?ApiTablePr} If the type of this style is not a <code>"table"</code> then it will return <code>null</code>.
     */
    ApiStyle.prototype.GetTablePr = function()
    {
        if (styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTablePr(this, this.Style.TablePr.Copy());
    };
    /**
     * Get the table row properties of the current style.
     * @returns {?ApiTableRowPr} If the type of this style is not a <code>"table"</code> then it will return <code>null</code>.
     */
    ApiStyle.prototype.GetTableRowPr = function()
    {
        if (styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTableRowPr(this, this.Style.TableRowPr.Copy());
    };
    /**
     * Get the table cell properties of the current style.
     * @returns {?ApiTableCellPr}
     */
    ApiStyle.prototype.GetTableCellPr = function()
    {
        if (styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTableCellPr(this, this.Style.TableCellPr.Copy());
    };
    /**
     * Specifies the reference of the parent style from which this style inherits in the style inheritance.
     * @param {ApiStyle} oStyle
     */
    ApiStyle.prototype.SetBasedOn = function(oStyle)
    {
        if (!(oStyle instanceof ApiStyle) || this.Style.Get_Type() !== oStyle.Style.Get_Type())
            return;

        this.Style.Set_BasedOn(oStyle.Style.Get_Id());
    };
    /**
     * Get a set of formatting properties which shall be conditionally applied to the parts of a table which match the
     * requirement specified on the <code>sType</code> parameter.
     * @param {TableStyleOverrideType} [sType="wholeTable"]
     * @returns {ApiTableStylePr}
     */
    ApiStyle.prototype.GetConditionalTableStyle = function(sType)
    {
        if ("topLeftCell" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableTLCell.Copy());
        else if ("topRightCell" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableTRCell.Copy());
        else if ("bottomLeftCell" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBLCell.Copy());
        else if ("bottomRightCell" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBRCell.Copy());
        else if ("firstRow" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableFirstRow.Copy());
        else if ("lastRow" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableLastRow.Copy());
        else if ("firstColumn" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableFirstCol.Copy());
        else if ("lastColumn" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableLastCol.Copy());
        else if ("bandedColumn" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBand1Vert.Copy());
        else if("bandedColumnEven" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBand2Vert.Copy());
        else if ("bandedRow" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBand1Horz.Copy());
        else if ("bandedRowEven" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableBand2Horz.Copy());
        else if ("wholeTable" === sType)
            return new ApiTableStylePr(sType, this, this.Style.TableWholeTable.Copy());

        return new ApiTableStylePr(sType, this, this.Style.TableWholeTable.Copy());
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTextPr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"textPr"}
     */
    ApiTextPr.prototype.GetClassType = function()
    {
        return "textPr";
    };
    /**
     * Specifies the character style.
     * @param {ApiStyle} oStyle
     */
    ApiTextPr.prototype.SetStyle = function(oStyle)
    {
        if (!(oStyle instanceof ApiStyle))
            return;

        this.TextPr.RStyle = oStyle.Style.Get_Id();
        this.private_OnChange();
    };
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
            this.TextPr.HighLight = AscCommonWord.highlight_None;
        else
            this.TextPr.HighLight = new AscCommonWord.CDocumentColor(r, g, b, false);

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
     * Get the type of this class.
     * @returns {"paraPr"}
     */
    ApiParaPr.prototype.GetClassType = function()
    {
        return "paraPr";
    };
    /**
     * Set paragraph style.
     * @param {ApiStyle} oStyle
     */
    ApiParaPr.prototype.SetStyle = function(oStyle)
    {
        if (!oStyle || !(oStyle instanceof ApiStyle))
            return;

        this.ParaPr.PStyle = oStyle.Style.Get_Id();
        this.private_OnChange();
    };
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
                this.ParaPr.Spacing.Line     = nLine / 240.0;
            }
            else if ("atLeast" === sLineRule)
            {
                this.ParaPr.Spacing.LineRule = Asc.linerule_AtLeast;
                this.ParaPr.Spacing.Line     = private_Twips2MM(nLine);

            }
            else if ("exact" === sLineRule)
            {
                this.ParaPr.Spacing.LineRule = Asc.linerule_Exact;
                this.ParaPr.Spacing.Line     = private_Twips2MM(nLine);
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

        this.ParaPr.NumPr       = new CNumPr();
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
     * Get the type of this class.
     * @returns {"numbering"}
     */
    ApiNumbering.prototype.GetClassType = function()
    {
        return "numbering";
    };
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
     * Get the type of this class.
     * @returns {"numberingLevel"}
     */
    ApiNumberingLevel.prototype.GetClassType = function()
    {
        return "numberingLevel";
    };
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
            case "none"  :
                this.Num.Set_Lvl_None(this.Lvl);
                break;
            case "bullet":
                this.Num.Set_Lvl_Bullet(this.Lvl, sSymbol, new CTextPr());
                break;
            case "1)"    :
                this.Num.Set_Lvl_Numbered_1(this.Lvl);
                break;
            case "1."    :
                this.Num.Set_Lvl_Numbered_2(this.Lvl);
                break;
            case "I."    :
                this.Num.Set_Lvl_Numbered_5(this.Lvl);
                break;
            case "A."    :
                this.Num.Set_Lvl_Numbered_6(this.Lvl);
                break;
            case "a)"    :
                this.Num.Set_Lvl_Numbered_7(this.Lvl);
                break;
            case "a."    :
                this.Num.Set_Lvl_Numbered_8(this.Lvl);
                break;
            case "i."    :
                this.Num.Set_Lvl_Numbered_9(this.Lvl);
                break;
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

        var nAlign = align_Left;
        if ("left" === sAlign)
            nAlign = align_Left;
        else if ("right" === sAlign)
            nAlign = align_Right;
        else if ("center" === sAlign)
            nAlign = align_Center;

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

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTablePr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tablePr"}
     */
    ApiTablePr.prototype.GetClassType = function()
    {
        return "tablePr";
    };
    /**
     * Specifies the number of columns which shall comprise each a table style column band for this table style.
     * @param {number} nCount
     */
    ApiTablePr.prototype.SetStyleColBandSize = function(nCount)
    {
        this.TablePr.TableStyleColBandSize = private_GetInt(nCount, 1, null);
        this.private_OnChange();
    };
    /**
     * Specifies the number of rows which shall comprise each a table style row band for this table style.
     * @param {number} nCount
     */
    ApiTablePr.prototype.SetStyleRowBandSize = function(nCount)
    {
        this.TablePr.TableStyleRowBandSize = private_GetInt(nCount, 1, null);
        this.private_OnChange();
    };
    /**
     * Specifies the alignment of the current table with respect to the text margins in the current section.
     * @param {("left" | "right" | "center")} sJcType
     */
    ApiTablePr.prototype.SetJc = function(sJcType)
    {
        if ("left" === sJcType)
            this.TablePr.Jc = align_Left;
        else if ("right" === sJcType)
            this.TablePr.Jc = align_Right;
        else if ("center" === sJcType)
            this.TablePr.Jc = align_Center;
        this.private_OnChange();
    };
    /**
     * Specify the shading which shall be applied to the extents of the current table.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiTablePr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.TablePr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderTop = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderBottom = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderLeft = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderRight = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderInsideH = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.InsideH = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
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
    ApiTablePr.prototype.SetTableBorderInsideV = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.InsideV = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };

    /**
     * Specifies the amount of space which shall be left between the bottom extent of the cell contents and the border
     * of all table cells within the parent table (or table row).
     * @param {twips} nValue
     */
    ApiTablePr.prototype.SetTableCellMarginBottom = function(nValue)
    {
        this.TablePr.TableCellMar.Bottom = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be present between the left extent of the cell contents and the left
     * border of all table cells within the parent table (or table row) .
     * @param {twips} nValue
     */
    ApiTablePr.prototype.SetTableCellMarginLeft = function(nValue)
    {
        this.TablePr.TableCellMar.Left = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be present between the right extent of the cell contents and the right
     * border of all table cells within the parent table (or table row) .
     * @param {twips} nValue
     */
    ApiTablePr.prototype.SetTableCellMarginRight = function(nValue)
    {
        this.TablePr.TableCellMar.Right = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be present between the top extent of the cell contents and the top
     * border of all table cells within the parent table (or table row) .
     * @param {twips} nValue
     */
    ApiTablePr.prototype.SetTableCellMarginTop = function(nValue)
    {
        this.TablePr.TableCellMar.Top = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the default table cell spacing (the spacing between adjacent cells and the edges of the table).
     * @param {?twips} nValue - Value of the spacing. Null mean no spacing.
     */
    ApiTablePr.prototype.SetCellSpacing = function(nValue)
    {
        if (null === nValue)
            this.TablePr.TableCellSpacing = null;
        else
            this.TablePr.TableCellSpacing = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the indentation which shall be added before the leading edge of the current table in the document (the
     * left edge in a left-to-right table, and the right edge in a right-to-left table).
     * @param {twips} nValue
     */
    ApiTablePr.prototype.SetTableInd = function(nValue)
    {
        this.TablePr.TableInd = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set the preferred width for this table.
     * @param {TableWidth} sType - Type of the width value
     * @param {number} [nValue]
     */
    ApiTablePr.prototype.SetWidth = function(sType, nValue)
    {
        this.TablePr.TableW = private_GetTableMeasure(sType, nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the algorithm which shall be used to lay out the contents of this table within the document.
     * @param {("autofit" | "fixed")} sType
     */
    ApiTablePr.prototype.SetTableLayout = function(sType)
    {
        if ("autofit" === sType)
            this.TablePr.TableLayout = tbllayout_AutoFit;
        else if ("fixed" === sType)
            this.TablePr.TableLayout = tbllayout_Fixed;

        this.private_OnChange();
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableRowPr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tableRowPr"}
     */
    ApiTableRowPr.prototype.GetClassType = function()
    {
        return "tableRowPr";
    };
    /**
     * Set the height of the current table row within the current table.
     * @param {("auto" | "atLeast")} sHRule - Specifies the meaning of the height specified for this table row.
     * @param {twips} [nValue] - This value will be ignored if <code>sHRule="auto"</code>.
     */
    ApiTableRowPr.prototype.SetHeight = function(sHRule, nValue)
    {
        if ("auto" === sHRule)
            this.RowPr.Height = new CTableRowHeight(0, Asc.linerule_Auto);
        else if ("atLeast" === sHRule)
            this.RowPr.Height = new CTableRowHeight(private_Twips2MM(nValue), Asc.linerule_AtLeast);

        this.private_OnChange();
    };
    /**
     * Specifies that the current table row shall be repeated at the top of each new page on which part of this table
     * is displayed. This gives this table row the behavior of a 'header' row on each of these pages. This element can
     * be applied to any number of rows at the top of the table structure in order to generate multi-row table headers.
     * @param {boolean} isHeader
     */
    ApiTableRowPr.prototype.SetTableHeader = function(isHeader)
    {
        this.RowPr.TableHeader = private_GetBoolean(isHeader);
        this.private_OnChange();
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableCellPr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tableCellPr"}
     */
    ApiTableCellPr.prototype.GetClassType = function()
    {
        return "tableCellPr";
    };
    /**
     * Specify the shading which shall be applied to the extents of the current table cell.
     * @param {ShdType} sType
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     * @param {boolean} [isAuto=false]
     */
    ApiTableCellPr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.CellPr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be left between the bottom extent of the cell contents and the border
     * of a specific table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCellPr.prototype.SetCellMarginBottom = function(nValue)
    {
        if (!this.CellPr.TableCellMar)
        {
            this.CellPr.TableCellMar =
            {
                Bottom : undefined,
                Left   : undefined,
                Right  : undefined,
                Top    : undefined
            };
        }

        if (null === nValue)
            this.CellPr.TableCellMar.Bottom = undefined;
        else
            this.CellPr.TableCellMar.Bottom = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be left between the left extent of the current cell contents and the
     * left edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCellPr.prototype.SetCellMarginLeft = function(nValue)
    {
        if (!this.CellPr.TableCellMar)
        {
            this.CellPr.TableCellMar =
            {
                Bottom : undefined,
                Left   : undefined,
                Right  : undefined,
                Top    : undefined
            };
        }

        if (null === nValue)
            this.CellPr.TableCellMar.Left = undefined;
        else
            this.CellPr.TableCellMar.Left = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be left between the right extent of the current cell contents and the
     * right edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCellPr.prototype.SetCellMarginRight = function(nValue)
    {
        if (!this.CellPr.TableCellMar)
        {
            this.CellPr.TableCellMar =
            {
                Bottom : undefined,
                Left   : undefined,
                Right  : undefined,
                Top    : undefined
            };
        }

        if (null === nValue)
            this.CellPr.TableCellMar.Right = undefined;
        else
            this.CellPr.TableCellMar.Right = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specifies the amount of space which shall be left between the top extent of the current cell contents and the
     * top edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCellPr.prototype.SetCellMarginTop = function(nValue)
    {
        if (!this.CellPr.TableCellMar)
        {
            this.CellPr.TableCellMar =
            {
                Bottom : undefined,
                Left   : undefined,
                Right  : undefined,
                Top    : undefined
            };
        }

        if (null === nValue)
            this.CellPr.TableCellMar.Top = undefined;
        else
            this.CellPr.TableCellMar.Top = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Set the border which shall be displayed at the bottom of the current table cell.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTableCellPr.prototype.SetCellBorderBottom = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which shall be displayed on the left edge of the current table cell.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTableCellPr.prototype.SetCellBorderLeft = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which shall be displayed on the right edge of the current table cell.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTableCellPr.prototype.SetCellBorderRight = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which shall be displayed at the top of the current table cell.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current border.
     * @param {pt} nSpace - The spacing offset that shall be used to place this border.
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiTableCellPr.prototype.SetCellBorderTop = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the preferred width for this cell.
     * @param {TableWidth} sType - Specifies the meaning of the width value.
     * @param {number} [nValue]
     */
    ApiTableCellPr.prototype.SetWidth = function(sType, nValue)
    {
        this.CellPr.TableCellW = private_GetTableMeasure(sType, nValue);
        this.private_OnChange();
    };
    /**
     * Specify the vertical alignment for text within the current table cell.
     * @param {("top" | "center" | "bottom")} sType
     */
    ApiTableCellPr.prototype.SetVerticalAlign = function(sType)
    {
        if ("top" === sType)
            this.CellPr.VAlign = vertalignjc_Top;
        else if ("bottom" === sType)
            this.CellPr.VAlign = vertalignjc_Bottom;
        else if ("center" === sType)
            this.CellPr.VAlign = vertalignjc_Center;

        this.private_OnChange();
    };
    /**
     * Specify the direction of the text flow for this table cell.
     * @param {("lrtb" | "tbrl" | "btlr")} sType
     */
    ApiTableCellPr.prototype.SetTextDirection = function(sType)
    {
        if ("lrtb" === sType)
            this.CellPr.TextDirection = textdirection_LRTB;
        else if ("tbrl" === sType)
            this.CellPr.TextDirection = textdirection_TBRL;
        else if ("btlr" === sType)
            this.CellPr.TextDirection = textdirection_BTLR;

        this.private_OnChange();
    };
    /**
     * Specifies how this table cell shall be laid out when the parent table is displayed in a document. This setting
     * only affects the behavior of the cell when the table layout for this table {@link ApiTablePr#SetTableLayout} is
     * set to use the <code>"autofit"</code> algorithm.
     * @param {boolean} isNoWrap
     */
    ApiTableCellPr.prototype.SetNoWrap = function(isNoWrap)
    {
        this.CellPr.NoWrap = private_GetBoolean(isNoWrap);
        this.private_OnChange();
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableStylePr
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"tableStylePr"}
     */
    ApiTableStylePr.prototype.GetClassType = function()
    {
        return "tableStylePr";
    };
    /**
     * Get the type of the current conditional style.
     * @returns {TableStyleOverrideType}
     */
    ApiTableStylePr.prototype.GetType = function()
    {
        return this.Type;
    };
    /**
     * Get the set of run properties which shall be applied to all runs within a table which match the conditional
     * formatting type.
     * @returns {ApiTextPr}
     */
    ApiTableStylePr.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.TableStylePr.TextPr);
    };
    /**
     * Get the set of paragraph properties which shall be applied to all paragraphs within a table which match the
     * conditional formatting type.
     * @returns {ApiParaPr}
     */
    ApiTableStylePr.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.TableStylePr.ParaPr);
    };
    /**
     * Get the set of table properties which shall be applied to all regions within a table which match the conditional
     * formatting type.
     * @returns {ApiTablePr}
     */
    ApiTableStylePr.prototype.GetTablePr = function()
    {
        return new ApiTablePr(this, this.TableStylePr.TablePr);
    };
    /**
     * Get  the set of table row properties which shall be applied to all rows within a table which match the
     * conditional formatting type.
     * @returns {ApiTableRowPr}
     */
    ApiTableStylePr.prototype.GetTableRowPr = function()
    {
        return new ApiTableRowPr(this, this.TableStylePr.TableRowPr);
    };
    /**
     * Get the set of table cell properties which shall be applied to all regions within a table which match the
     * conditional formatting type.
     * @returns {ApiTableCellPr}
     */
    ApiTableStylePr.prototype.GetTableCellPr = function()
    {
        return new ApiTableCellPr(this, this.TableStylePr.TableCellPr);
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDrawing
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"drawing"}
     */
    ApiDrawing.prototype.GetClassType = function()
    {
        return "drawing";
    };
    /**
     * Set the size of the bounding box.
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     */
    ApiDrawing.prototype.SetSize = function(nWidth, nHeight)
    {
        var fWidth = private_EMU2MM(nWidth);
        var fHeight = private_EMU2MM(nHeight);
        this.Drawing.setExtent(fWidth, fHeight);
        if(this.Drawing.GraphicObj && this.Drawing.GraphicObj.spPr && this.Drawing.GraphicObj.spPr.xfrm)
        {
            this.Drawing.GraphicObj.spPr.xfrm.setExtX(fWidth);
            this.Drawing.GraphicObj.spPr.xfrm.setExtY(fHeight);
        }
    };
    /**
     * Set the wrapping type of this drawing object.
     * @param {"inline" | "square" | "tight" | "through" | "topAndBottom" | "behind" | "inFront"} sType
     */
    ApiDrawing.prototype.SetWrappingStyle = function(sType)
    {
        if(this.Drawing)
        {
            if ("inline" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Inline);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                this.Drawing.Set_BehindDoc(false);
            }
            else if ("square" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                this.Drawing.Set_BehindDoc(false);
            }
            else if ("tight" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                this.Drawing.Set_BehindDoc(false);
            }
            else if ("through" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_THROUGH);
                this.Drawing.Set_BehindDoc(false);
            }
            else if ("topAndBottom" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM);
                this.Drawing.Set_BehindDoc(false);
            }
            else if ("behind" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                this.Drawing.Set_BehindDoc(true);
            }
            else if ("inFront" === sType)
            {
                this.Drawing.Set_DrawingType(drawing_Anchor);
                this.Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                this.Drawing.Set_BehindDoc(false);
            }
            this.Drawing.Check_WrapPolygon();
            if(this.Drawing.GraphicObj && this.Drawing.GraphicObj.setRecalculateInfo)
            {
                this.Drawing.GraphicObj.setRecalculateInfo();
            }
        }
    };

    /**
     * Specifies how a floating object shall be horizontally aligned.
     * @param {RelFromH} [sRelativeFrom="page"]
     * @param {("left" | "right" | "center")} [sAlign="left"]
     */
    ApiDrawing.prototype.SetHorAlign = function(sRelativeFrom, sAlign)
    {
        var nAlign        = private_GetAlignH(sAlign);
        var nRelativeFrom = private_GetRelativeFromH(sRelativeFrom);
        this.Drawing.Set_PositionH(nRelativeFrom, true, nAlign, false);
    };
    /**
     * Specifies how a floating object shall be vertically aligned.
     * @param {RelFromV} [sRelativeFrom="page"]
     * @param {("top" | "bottom" | "center")} [sAlign="top"]
     */
    ApiDrawing.prototype.SetVerAlign = function(sRelativeFrom, sAlign)
    {
        var nAlign        = private_GetAlignV(sAlign);
        var nRelativeFrom = private_GetRelativeFromV(sRelativeFrom);
        this.Drawing.Set_PositionV(nRelativeFrom, true, nAlign, false);
    };
    /**
     * Set an absolute measurement for the horizontal positioning of a floating object.
     * @param {RelFromH} sRelativeFrom
     * @param {EMU} nDistance
     */
    ApiDrawing.prototype.SetHorPosition = function(sRelativeFrom, nDistance)
    {
        var nValue        = private_EMU2MM(nDistance);
        var nRelativeFrom = private_GetRelativeFromH(sRelativeFrom);
        this.Drawing.Set_PositionH(nRelativeFrom, false, nValue, false);
    };
    /**
     * Set an absolute measurement for the vertical positioning of a floating object.
     * @param {RelFromH} sRelativeFrom
     * @param {EMU} nDistance
     */
    ApiDrawing.prototype.SetVerPosition = function(sRelativeFrom, nDistance)
    {
        var nValue        = private_EMU2MM(nDistance);
        var nRelativeFrom = private_GetRelativeFromV(sRelativeFrom);
        this.Drawing.Set_PositionV(nRelativeFrom, false, nValue, false);
    };
    /**
     * Specifies the minimum distance which shall be maintained between the edges of this drawing object and any
     * subsequent text.
     * @param {EMU} nLeft
     * @param {EMU} nTop
     * @param {EMU} nRight
     * @param {EMU} nBottom
     */
    ApiDrawing.prototype.SetDistances = function(nLeft, nTop, nRight, nBottom)
    {
        this.Drawing.Set_Distance(private_EMU2MM(nLeft), private_EMU2MM(nTop), private_EMU2MM(nRight), private_EMU2MM(nBottom));
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiImage
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"image"}
     */
    ApiImage.prototype.GetClassType = function()
    {
        return "image";
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiShape
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"shape"}
     */
    ApiShape.prototype.GetClassType = function()
    {
        return "shape";
    };


    /**
     * Get content of this shape.
     * @returns {?ApiDocumentContent}
     */
    ApiShape.prototype.GetDocContent = function()
    {
        if(this.Shape && this.Shape.textBoxContent)
        {
            return new ApiDocumentContent(this.Shape.textBoxContent);
        }
        return null;
    };

    /**
     * Set shape's content vertical align
     * @param {VerticalTextAlign} VerticalAlign
     */
    ApiShape.prototype.SetVerticalTextAlign = function(VerticalAlign)
    {
        if(this.Shape)
        {
            switch(VerticalAlign)
            {
                case "top":
                {
                    this.Shape.setVerticalAlign(4);
                    break;
                }
                case "center":
                {
                    this.Shape.setVerticalAlign(1);
                    break;
                }
                case "bottom":
                {
                    this.Shape.setVerticalAlign(0);
                    break;
                }
            }
        }
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiChart
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"chart"}
     */
    ApiChart.prototype.GetClassType = function()
    {
        return "chart";
    };


    /**
     *  Specifies a chart title
     *  @param {string} sTitle
     * */
    ApiChart.prototype.SetTitle = function (sTitle)
    {
        if(this.Chart)
        {
            if(typeof sTitle === "string" && sTitle.length > 0)
            {
                this.Chart.chart.setTitle(new AscFormat.CTitle());
                this.Chart.chart.title.setTx(new AscFormat.CChartText());
                this.Chart.chart.title.tx.setRich(AscFormat.CreateTextBodyFromString(sTitle, this.Chart.getDrawingDocument(), this.Chart.chart.title.tx))
            }
            else
            {
                this.Chart.chart.setTitle(null);
            }
        }
    };

    /**
     *  Specifies a horizontal axis title
     *  @param {string} sTitle
     * */
    ApiChart.prototype.SetHorAxisTitle = function (sTitle)
    {
        if(this.Chart)
        {
            var horAxis = this.Chart.chart.plotArea.getHorizontalAxis();
            if(horAxis)
            {
                if(typeof sTitle === "string" && sTitle.length > 0)
                {
                    horAxis.setTitle(new AscFormat.CTitle());
                    horAxis.title.setTx(new AscFormat.CChartText());
                    horAxis.title.tx.setRich(AscFormat.CreateTextBodyFromString(sTitle, this.Chart.getDrawingDocument(), horAxis.title.tx));
                    horAxis.title.setOverlay(false);
                }
                else
                {
                    horAxis.setTitle(null);
                }
            }
        }
    };

    /**
     *  Specifies a vertical axis title
     *  @param {string} sTitle
     * */
    ApiChart.prototype.SetVerAxisTitle = function (sTitle)
    {
        if(this.Chart)
        {
            var verAxis = this.Chart.chart.plotArea.getVerticalAxis();
            if(verAxis)
            {
                if(typeof sTitle === "string" && sTitle.length > 0)
                {
                    verAxis.setTitle(new AscFormat.CTitle());
                    verAxis.title.setTx(new AscFormat.CChartText());
                    verAxis.title.tx.setRich(AscFormat.CreateTextBodyFromString(sTitle, this.Chart.getDrawingDocument(), verAxis.title.tx));

                    var _body_pr = new AscFormat.CBodyPr();
                    _body_pr.reset();
                    if(!verAxis.title.txPr)
                    {
                        verAxis.title.setTxPr(AscFormat.CreateTextBodyFromString("", this.Chart.getDrawingDocument(), verAxis.title));
                    }
                    var _text_body =  verAxis.title.txPr;
                    _text_body.setBodyPr(_body_pr);
                    verAxis.title.setOverlay(false);
                }
                else
                {
                    verAxis.setTitle(null);
                }
            }
        }
    };

    /**
     * Specifies a legend position
     * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos
     * */
    ApiChart.prototype.SetLegendPos = function(sLegendPos)
    {
        if(this.Chart && this.Chart.chart)
        {
            if(sLegendPos === "none")
            {
                if(this.Chart.chart.legend)
                {
                    this.Chart.chart.setLegend(null);
                }
            }
            else
            {
                var nLegendPos = null;
                switch(sLegendPos)
                {
                    case "left":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.left;
                        break;
                    }
                    case "top":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.top;
                        break;
                    }
                    case "right":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.right;
                        break;
                    }
                    case "bottom":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.bottom;
                        break;
                    }
                }
                if(null !== nLegendPos)
                {
                    if(!this.Chart.chart.legend)
                    {
                        this.Chart.chart.setLegend(new AscFormat.CLegend());
                    }
                    if(this.Chart.chart.legend.legendPos !== nLegendPos)
                        this.Chart.chart.legend.setLegendPos(nLegendPos);
                    if(this.Chart.chart.legend.overlay !== false)
                    {
                        this.Chart.chart.legend.setOverlay(false);
                    }
                }
            }
        }
    };

    /**
     * Spicifies a show options for data labels
     * @param {boolean} bShowSerName
     * @param {boolean} bShowCatName
     * @param {boolean} bShowVal
     * */
    ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal)
    {
        if(this.Chart && this.Chart.chart && this.Chart.chart.plotArea && this.Chart.chart.plotArea.charts[0])
        {
            var oChart = this.Chart.chart.plotArea.charts[0];
            if(false == bShowSerName && false == bShowCatName && false == bShowVal)
            {
                if(oChart.dLbls)
                {
                    oChart.setDLbls(null);
                }
            }
            if(!oChart.dLbls)
            {
                oChart.setDLbls(new AscFormat.CDLbls());
            }
            oChart.dLbls.setSeparator(",");
            oChart.dLbls.setShowSerName(true == bShowSerName);
            oChart.dLbls.setShowCatName(true == bShowCatName);
            oChart.dLbls.setShowVal(true == bShowVal);
        }
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiFill
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"fill"}
     */
    ApiFill.prototype.GetClassType = function()
    {
        return "fill";
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiStroke
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"stroke"}
     */
    ApiStroke.prototype.GetClassType = function()
    {
        return "stroke";
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiGradientStop
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"gradientStop"}
     */
    ApiGradientStop.prototype.GetClassType = function ()
    {
        return "gradientStop"
    };
    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiUniColor
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"uniColor"}
     */
    ApiUniColor.prototype.GetClassType = function ()
    {
        return "uniColor"
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiRGBColor
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"rgbColor"}
     */
    ApiRGBColor.prototype.GetClassType = function ()
    {
        return "rgbColor"
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiSchemeColor
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"schemeColor"}
     */
    ApiSchemeColor.prototype.GetClassType = function ()
    {
        return "schemeColor"
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiPresetColor
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get the type of this class.
     * @returns {"presetColor"}
     */
    ApiPresetColor.prototype.GetClassType = function ()
    {
        return "presetColor"
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Export
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Api.prototype["GetDocument"]                     = Api.prototype.GetDocument;
    Api.prototype["CreateParagraph"]                 = Api.prototype.CreateParagraph;
    Api.prototype["CreateTable"]                     = Api.prototype.CreateTable;
    Api.prototype["CreateRun"]                       = Api.prototype.CreateRun;
    Api.prototype["CreateImage"]                     = Api.prototype.CreateImage;
    Api.prototype["CreateShape"]                     = Api.prototype.CreateShape;
    Api.prototype["CreateChart"]                     = Api.prototype.CreateChart;
    Api.prototype["CreateRGBColor"]                  = Api.prototype.CreateRGBColor;
    Api.prototype["CreateSchemeColor"]               = Api.prototype.CreateSchemeColor;
    Api.prototype["CreatePresetColor"]               = Api.prototype.CreatePresetColor;
    Api.prototype["CreateSolidFill"]                 = Api.prototype.CreateSolidFill;
    Api.prototype["CreateLinearGradientFill"]        = Api.prototype.CreateLinearGradientFill;
    Api.prototype["CreateRadialGradientFill"]        = Api.prototype.CreateRadialGradientFill;
    Api.prototype["CreatePatternFill"]               = Api.prototype.CreatePatternFill;
    Api.prototype["CreateBlipFill"]                  = Api.prototype.CreateBlipFill;
    Api.prototype["CreateNoFill"]                    = Api.prototype.CreateNoFill;
    Api.prototype["CreateStroke"]                    = Api.prototype.CreateStroke;
    Api.prototype["CreateGradientStop"]              = Api.prototype.CreateGradientStop;

    ApiUnsupported.prototype["GetClassType"]         = ApiUnsupported.prototype.GetClassType;

    ApiDocumentContent.prototype["GetClassType"]     = ApiDocumentContent.prototype.GetClassType;
    ApiDocumentContent.prototype["GetElementsCount"] = ApiDocumentContent.prototype.GetElementsCount;
    ApiDocumentContent.prototype["GetElement"]       = ApiDocumentContent.prototype.GetElement;
    ApiDocumentContent.prototype["AddElement"]       = ApiDocumentContent.prototype.AddElement;
    ApiDocumentContent.prototype["Push"]             = ApiDocumentContent.prototype.Push;
    ApiDocumentContent.prototype["RemoveAllElements"]= ApiDocumentContent.prototype.RemoveAllElements;
    ApiDocumentContent.prototype["RemoveElement"]    = ApiDocumentContent.prototype.RemoveElement;

    ApiDocument.prototype["GetClassType"]            = ApiDocument.prototype.GetClassType;
    ApiDocument.prototype["CreateNewHistoryPoint"]   = ApiDocument.prototype.CreateNewHistoryPoint;
    ApiDocument.prototype["GetDefaultTextPr"]        = ApiDocument.prototype.GetDefaultTextPr;
    ApiDocument.prototype["GetDefaultParaPr"]        = ApiDocument.prototype.GetDefaultParaPr;
    ApiDocument.prototype["GetStyle"]                = ApiDocument.prototype.GetStyle;
    ApiDocument.prototype["CreateStyle"]             = ApiDocument.prototype.CreateStyle;
    ApiDocument.prototype["GetDefaultStyle"]         = ApiDocument.prototype.GetDefaultStyle;
    ApiDocument.prototype["GetFinalSection"]         = ApiDocument.prototype.GetFinalSection;
    ApiDocument.prototype["CreateSection"]           = ApiDocument.prototype.CreateSection;
    ApiDocument.prototype["SetEvenAndOddHdrFtr"]     = ApiDocument.prototype.SetEvenAndOddHdrFtr;
    ApiDocument.prototype["CreateNumbering"]         = ApiDocument.prototype.CreateNumbering;
    ApiDocument.prototype["InsertContent"]           = ApiDocument.prototype.InsertContent;

    ApiParagraph.prototype["GetClassType"]           = ApiParagraph.prototype.GetClassType;
    ApiParagraph.prototype["AddText"]                = ApiParagraph.prototype.AddText;
    ApiParagraph.prototype["AddPageBreak"]           = ApiParagraph.prototype.AddPageBreak;
    ApiParagraph.prototype["AddLineBreak"]           = ApiParagraph.prototype.AddLineBreak;
    ApiParagraph.prototype["AddColumnBreak"]         = ApiParagraph.prototype.AddColumnBreak;
    ApiParagraph.prototype["GetParagraphMarkTextPr"] = ApiParagraph.prototype.GetParagraphMarkTextPr;
    ApiParagraph.prototype["GetParaPr"]              = ApiParagraph.prototype.GetParaPr;
    ApiParagraph.prototype["GetNumbering"]           = ApiParagraph.prototype.GetNumbering;
    ApiParagraph.prototype["SetNumbering"]           = ApiParagraph.prototype.SetNumbering;
    ApiParagraph.prototype["GetElementsCount"]       = ApiParagraph.prototype.GetElementsCount;
    ApiParagraph.prototype["GetElement"]             = ApiParagraph.prototype.GetElement;
    ApiParagraph.prototype["RemoveElement"]          = ApiParagraph.prototype.RemoveElement;
    ApiParagraph.prototype["RemoveAllElements"]      = ApiParagraph.prototype.RemoveAllElements;
    ApiParagraph.prototype["AddElement"]             = ApiParagraph.prototype.AddElement;
    ApiParagraph.prototype["AddTabStop"]             = ApiParagraph.prototype.AddTabStop;
    ApiParagraph.prototype["AddDrawing"]             = ApiParagraph.prototype.AddDrawing;

    ApiRun.prototype["GetClassType"]                 = ApiRun.prototype.GetClassType;
    ApiRun.prototype["GetTextPr"]                    = ApiRun.prototype.GetTextPr;
    ApiRun.prototype["ClearContent"]                 = ApiRun.prototype.ClearContent;
    ApiRun.prototype["AddText"]                      = ApiRun.prototype.AddText;
    ApiRun.prototype["AddPageBreak"]                 = ApiRun.prototype.AddPageBreak;
    ApiRun.prototype["AddLineBreak"]                 = ApiRun.prototype.AddLineBreak;
    ApiRun.prototype["AddColumnBreak"]               = ApiRun.prototype.AddColumnBreak;
    ApiRun.prototype["AddTabStop"]                   = ApiRun.prototype.AddTabStop;
    ApiRun.prototype["AddDrawing"]                   = ApiRun.prototype.AddDrawing;

    ApiSection.prototype["GetClassType"]             = ApiSection.prototype.GetClassType;
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

    ApiTable.prototype["GetClassType"]               = ApiTable.prototype.GetClassType;
    ApiTable.prototype["SetJc"]                      = ApiTable.prototype.SetJc;
    ApiTable.prototype["GetRowsCount"]               = ApiTable.prototype.GetRowsCount;
    ApiTable.prototype["GetRow"]                     = ApiTable.prototype.GetRow;
    ApiTable.prototype["MergeCells"]                 = ApiTable.prototype.MergeCells;
    ApiTable.prototype["SetStyle"]                   = ApiTable.prototype.SetStyle;
    ApiTable.prototype["SetTableLook"]               = ApiTable.prototype.SetTableLook;
    ApiTable.prototype["AddRow"]                     = ApiTable.prototype.AddRow;
    ApiTable.prototype["AddColumn"]                  = ApiTable.prototype.AddColumn;
    ApiTable.prototype["RemoveRow"]                  = ApiTable.prototype.RemoveRow;
    ApiTable.prototype["RemoveColumn"]               = ApiTable.prototype.RemoveColumn;

    ApiTableRow.prototype["GetClassType"]            = ApiTableRow.prototype.GetClassType;
    ApiTableRow.prototype["GetCellsCount"]           = ApiTableRow.prototype.GetCellsCount;
    ApiTableRow.prototype["GetCell"]                 = ApiTableRow.prototype.GetCell;

    ApiTableCell.prototype["GetClassType"]           = ApiTableCell.prototype.GetClassType;
    ApiTableCell.prototype["GetContent"]             = ApiTableCell.prototype.GetContent;

    ApiStyle.prototype["GetClassType"]               = ApiStyle.prototype.GetClassType;
    ApiStyle.prototype["GetName"]                    = ApiStyle.prototype.GetName;
    ApiStyle.prototype["SetName"]                    = ApiStyle.prototype.SetName;
    ApiStyle.prototype["GetType"]                    = ApiStyle.prototype.GetType;
    ApiStyle.prototype["GetTextPr"]                  = ApiStyle.prototype.GetTextPr;
    ApiStyle.prototype["GetParaPr"]                  = ApiStyle.prototype.GetParaPr;
    ApiStyle.prototype["GetTablePr"]                 = ApiStyle.prototype.GetTablePr;
    ApiStyle.prototype["GetTableRowPr"]              = ApiStyle.prototype.GetTableRowPr;
    ApiStyle.prototype["GetTableCellPr"]             = ApiStyle.prototype.GetTableCellPr;
    ApiStyle.prototype["SetBasedOn"]                 = ApiStyle.prototype.SetBasedOn;
    ApiStyle.prototype["GetConditionalTableStyle"]   = ApiStyle.prototype.GetConditionalTableStyle;

    ApiNumbering.prototype["GetClassType"]           = ApiNumbering.prototype.GetClassType;
    ApiNumbering.prototype["GetLevel"]               = ApiNumbering.prototype.GetLevel;

    ApiNumberingLevel.prototype["GetClassType"]      = ApiNumberingLevel.prototype.GetClassType;
    ApiNumberingLevel.prototype["GetNumbering"]      = ApiNumberingLevel.prototype.GetNumbering;
    ApiNumberingLevel.prototype["GetLevelIndex"]     = ApiNumberingLevel.prototype.GetLevelIndex;
    ApiNumberingLevel.prototype["GetTextPr"]         = ApiNumberingLevel.prototype.GetTextPr;
    ApiNumberingLevel.prototype["GetParaPr"]         = ApiNumberingLevel.prototype.GetParaPr;
    ApiNumberingLevel.prototype["SetTemplateType"]   = ApiNumberingLevel.prototype.SetTemplateType;
    ApiNumberingLevel.prototype["SetCustomType"]     = ApiNumberingLevel.prototype.SetCustomType;
    ApiNumberingLevel.prototype["SetRestart"]        = ApiNumberingLevel.prototype.SetRestart;
    ApiNumberingLevel.prototype["SetStart"]          = ApiNumberingLevel.prototype.SetStart;
    ApiNumberingLevel.prototype["SetSuff"]           = ApiNumberingLevel.prototype.SetSuff;

    ApiTextPr.prototype["GetClassType"]              = ApiTextPr.prototype.GetClassType;
    ApiTextPr.prototype["SetStyle"]                  = ApiTextPr.prototype.SetStyle;
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

    ApiParaPr.prototype["GetClassType"]              = ApiParaPr.prototype.GetClassType;
    ApiParaPr.prototype["SetStyle"]                  = ApiParaPr.prototype.SetStyle;
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

    ApiTablePr.prototype["GetClassType"]             = ApiTablePr.prototype.GetClassType;
    ApiTablePr.prototype["SetStyleColBandSize"]      = ApiTablePr.prototype.SetStyleColBandSize;
    ApiTablePr.prototype["SetStyleRowBandSize"]      = ApiTablePr.prototype.SetStyleRowBandSize;
    ApiTablePr.prototype["SetJc"]                    = ApiTablePr.prototype.SetJc;
    ApiTablePr.prototype["SetShd"]                   = ApiTablePr.prototype.SetShd;
    ApiTablePr.prototype["SetTableBorderTop"]        = ApiTablePr.prototype.SetTableBorderTop;
    ApiTablePr.prototype["SetTableBorderBottom"]     = ApiTablePr.prototype.SetTableBorderBottom;
    ApiTablePr.prototype["SetTableBorderLeft"]       = ApiTablePr.prototype.SetTableBorderLeft;
    ApiTablePr.prototype["SetTableBorderRight"]      = ApiTablePr.prototype.SetTableBorderRight;
    ApiTablePr.prototype["SetTableBorderInsideH"]    = ApiTablePr.prototype.SetTableBorderInsideH;
    ApiTablePr.prototype["SetTableBorderInsideV"]    = ApiTablePr.prototype.SetTableBorderInsideV;
    ApiTablePr.prototype["SetTableCellMarginBottom"] = ApiTablePr.prototype.SetTableCellMarginBottom;
    ApiTablePr.prototype["SetTableCellMarginLeft"]   = ApiTablePr.prototype.SetTableCellMarginLeft;
    ApiTablePr.prototype["SetTableCellMarginRight"]  = ApiTablePr.prototype.SetTableCellMarginRight;
    ApiTablePr.prototype["SetTableCellMarginTop"]    = ApiTablePr.prototype.SetTableCellMarginTop;
    ApiTablePr.prototype["SetCellSpacing"]           = ApiTablePr.prototype.SetCellSpacing;
    ApiTablePr.prototype["SetTableInd"]              = ApiTablePr.prototype.SetTableInd;
    ApiTablePr.prototype["SetWidth"]                 = ApiTablePr.prototype.SetWidth;
    ApiTablePr.prototype["SetTableLayout"]           = ApiTablePr.prototype.SetTableLayout;

    ApiTableRowPr.prototype["GetClassType"]          = ApiTableRowPr.prototype.GetClassType;
    ApiTableRowPr.prototype["SetHeight"]             = ApiTableRowPr.prototype.SetHeight;
    ApiTableRowPr.prototype["SetTableHeader"]        = ApiTableRowPr.prototype.SetTableHeader;

    ApiTableCellPr.prototype["GetClassType"]         = ApiTableCellPr.prototype.GetClassType;
    ApiTableCellPr.prototype["SetShd"]               = ApiTableCellPr.prototype.SetShd;
    ApiTableCellPr.prototype["SetCellMarginBottom"]  = ApiTableCellPr.prototype.SetCellMarginBottom;
    ApiTableCellPr.prototype["SetCellMarginLeft"]    = ApiTableCellPr.prototype.SetCellMarginLeft;
    ApiTableCellPr.prototype["SetCellMarginRight"]   = ApiTableCellPr.prototype.SetCellMarginRight;
    ApiTableCellPr.prototype["SetCellMarginTop"]     = ApiTableCellPr.prototype.SetCellMarginTop;
    ApiTableCellPr.prototype["SetCellBorderBottom"]  = ApiTableCellPr.prototype.SetCellBorderBottom;
    ApiTableCellPr.prototype["SetCellBorderLeft"]    = ApiTableCellPr.prototype.SetCellBorderLeft;
    ApiTableCellPr.prototype["SetCellBorderRight"]   = ApiTableCellPr.prototype.SetCellBorderRight;
    ApiTableCellPr.prototype["SetCellBorderTop"]     = ApiTableCellPr.prototype.SetCellBorderTop;
    ApiTableCellPr.prototype["SetWidth"]             = ApiTableCellPr.prototype.SetWidth;
    ApiTableCellPr.prototype["SetVerticalAlign"]     = ApiTableCellPr.prototype.SetVerticalAlign;
    ApiTableCellPr.prototype["SetTextDirection"]     = ApiTableCellPr.prototype.SetTextDirection;
    ApiTableCellPr.prototype["SetNoWrap"]            = ApiTableCellPr.prototype.SetNoWrap;

    ApiTableStylePr.prototype["GetClassType"]        = ApiTableStylePr.prototype.GetClassType;
    ApiTableStylePr.prototype["GetType "]            = ApiTableStylePr.prototype.GetType;
    ApiTableStylePr.prototype["GetTextPr"]           = ApiTableStylePr.prototype.GetTextPr;
    ApiTableStylePr.prototype["GetParaPr"]           = ApiTableStylePr.prototype.GetParaPr;
    ApiTableStylePr.prototype["GetTablePr"]          = ApiTableStylePr.prototype.GetTablePr;
    ApiTableStylePr.prototype["GetTableRowPr"]       = ApiTableStylePr.prototype.GetTableRowPr;
    ApiTableStylePr.prototype["GetTableCellPr"]      = ApiTableStylePr.prototype.GetTableCellPr;

    ApiDrawing.prototype["GetClassType"]             = ApiDrawing.prototype.GetClassType;
    ApiDrawing.prototype["SetSize"]                  = ApiDrawing.prototype.SetSize;
    ApiDrawing.prototype["SetWrappingStyle"]         = ApiDrawing.prototype.SetWrappingStyle;
    ApiDrawing.prototype["SetHorAlign"]              = ApiDrawing.prototype.SetHorAlign;
    ApiDrawing.prototype["SetVerAlign"]              = ApiDrawing.prototype.SetVerAlign;
    ApiDrawing.prototype["SetHorPosition"]           = ApiDrawing.prototype.SetHorPosition;
    ApiDrawing.prototype["SetVerPosition"]           = ApiDrawing.prototype.SetVerPosition;
    ApiDrawing.prototype["SetDistances"]             = ApiDrawing.prototype.SetDistances;

    ApiImage.prototype["GetClassType"]               = ApiImage.prototype.GetClassType;

    ApiShape.prototype["GetClassType"]               = ApiShape.prototype.GetClassType;
    ApiShape.prototype["GetDocContent"]              = ApiShape.prototype.GetDocContent;
    ApiShape.prototype["SetVerticalTextAlign"]       = ApiShape.prototype.SetVerticalTextAlign;

    ApiChart.prototype["GetClassType"]               = ApiChart.prototype.GetClassType;
    ApiChart.prototype["SetTitle"]                   = ApiChart.prototype.SetTitle;
    ApiChart.prototype["SetHorAxisTitle"]            = ApiChart.prototype.SetHorAxisTitle;
    ApiChart.prototype["SetVerAxisTitle"]            = ApiChart.prototype.SetVerAxisTitle;
    ApiChart.prototype["SetLegendPos"]               = ApiChart.prototype.SetLegendPos;
    ApiChart.prototype["SetShowDataLabels"]          = ApiChart.prototype.SetShowDataLabels;

    ApiFill.prototype["GetClassType"]                = ApiFill.prototype.GetClassType;

    ApiStroke.prototype["GetClassType"]              = ApiStroke.prototype.GetClassType;

    ApiGradientStop.prototype["GetClassType"]        = ApiGradientStop.prototype.GetClassType;

    ApiUniColor.prototype["GetClassType"]            = ApiUniColor.prototype.GetClassType;

    ApiRGBColor.prototype["GetClassType"]            = ApiRGBColor.prototype.GetClassType;

    ApiSchemeColor.prototype["GetClassType"]         = ApiSchemeColor.prototype.GetClassType;

    ApiPresetColor.prototype["GetClassType"]         = ApiPresetColor.prototype.GetClassType;

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

    function private_EMU2MM(EMU)
    {
        return EMU / 36000.0;
    }

    function private_GetHps(hps)
    {
        return Math.ceil(hps) / 2.0;
    }

    function private_GetColor(r, g, b, Auto)
    {
        return new AscCommonWord.CDocumentColor(r, g, b, Auto ? Auto : false);
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
            return align_Left;
        else if ("right" === sJc)
            return align_Right;
        else if ("both" === sJc)
            return align_Justify;
        else if ("center" === sJc)
            return align_Center;

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

    function private_GetTableMeasure(sType, nValue)
    {
        var nType = tblwidth_Auto;
        var nW    = 0;
        if ("auto" === sType)
        {
            nType = tblwidth_Auto;
            nW    = 0;
        }
        else if ("nil" === sType)
        {
            nType = tblwidth_Nil;
            nW    = 0;
        }
        else if ("percent" === sType)
        {
            nType = tblwidth_Pct;
            nW    = private_GetInt(nValue, null, null);
        }
        else if ("twips" === sType)
        {
            nType = tblwidth_Mm;
            nW    = private_Twips2MM(nValue);
        }

        return new CTableMeasurement(nType, nW);
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

    function private_GetInt(nValue, nMin, nMax)
    {
        var nResult = nValue | 0;

        if (undefined !== nMin && null !== nMin)
            nResult = Math.max(nMin, nResult);

        if (undefined !== nMax && null !== nMax)
            nResult = Math.min(nMax, nResult);

        return nResult;
    }

    function private_PtToMM(pt)
    {
        return 25.4 / 72.0 * pt;
    }

    function private_Pt_8ToMM(pt)
    {
        return 25.4 / 72.0 / 8 * pt;
    }

    function private_StartSilentMode()
    {
        private_GetLogicDocument().Start_SilentMode();
    }
    function private_EndSilentMode()
    {
        private_GetLogicDocument().End_SilentMode(false);
    }
    function private_GetAlignH(sAlign)
    {
        if ("left" === sAlign)
            return c_oAscAlignH.Left;
        else if ("right" === sAlign)
            return c_oAscAlignH.Right;
        else if ("center" === sAlign)
            return c_oAscAlignH.Center;

        return c_oAscAlignH.Left;
    }

    function private_GetAlignV(sAlign)
    {
        if ("top" === sAlign)
            return c_oAscAlignV.Top;
        else if ("bottom" === sAlign)
            return c_oAscAlignV.Bottom;
        else if ("center" === sAlign)
            return c_oAscAlignV.Center;

        return c_oAscAlignV.Center;
    }
    function private_GetRelativeFromH(sRel)
    {
        if ("character" === sRel)
            return Asc.c_oAscRelativeFromH.Character;
        else if ("column" === sRel)
            return Asc.c_oAscRelativeFromH.Column;
        else if ("leftMargin" === sRel)
            return Asc.c_oAscRelativeFromH.LeftMargin;
        else if ("rightMargin" === sRel)
            return Asc.c_oAscRelativeFromH.RightMargin;
        else if ("margin" === sRel)
            return Asc.c_oAscRelativeFromH.Margin;
        else if ("page" === sRel)
            return Asc.c_oAscRelativeFromH.Page;

        return Asc.c_oAscRelativeFromH.Page;
    }

    function private_GetRelativeFromV(sRel)
    {
        if ("bottomMargin" === sRel)
            return Asc.c_oAscRelativeFromV.BottomMargin;
        else if ("topMargin" === sRel)
            return Asc.c_oAscRelativeFromV.TopMargin;
        else if ("margin" === sRel)
            return Asc.c_oAscRelativeFromV.Margin;
        else if ("page" === sRel)
            return Asc.c_oAscRelativeFromV.Page;
        else if ("line" === sRel)
            return Asc.c_oAscRelativeFromV.Line;
        else if ("paragraph" === sRel)
            return Asc.c_oAscRelativeFromV.Paragraph;

        return Asc.c_oAscRelativeFromV.Page;
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
    ApiRun.prototype.private_GetImpl = function()
    {
        return this.Run;
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
    ApiTable.prototype.OnChangeTablePr = function(oApiTablePr)
    {
        this.Table.Set_Pr(oApiTablePr.TablePr);
        oApiTablePr.TablePr = this.Table.Pr.Copy();
    };
    ApiTable.prototype.private_PrepareTableForActions = function()
    {
        this.Table.private_RecalculateGrid();
        this.Table.private_UpdateCellsGrid();
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
    ApiStyle.prototype.OnChangeTablePr = function(oApiTablePr)
    {
        this.Style.Set_TablePr(oApiTablePr.TablePr);
        oApiTablePr.TablePr = this.Style.TablePr.Copy();
    };
    ApiStyle.prototype.OnChangeTableRowPr = function(oApiTableRowPr)
    {
        this.Style.Set_TableRowPr(oApiTableRowPr.RowPr);
        oApiTableRowPr.RowPr = this.Style.TableRowPr.Copy();
    };
    ApiStyle.prototype.OnChangeTableCellPr = function(oApiTableCellPr)
    {
        this.Style.Set_TableCellPr(oApiTableCellPr.CellPr);
        oApiTableCellPr.CellPr = this.Style.TableCellPr.Copy();
    };
    ApiStyle.prototype.OnChangeTableStylePr = function(oApiTableStylePr)
    {
        var sType = oApiTableStylePr.GetType();
        switch(sType)
        {
            case "topLeftCell":
            {
                this.Style.Set_TableTLCell(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableTLCell.Copy();
                break;
            }
            case "topRightCell":
            {
                this.Style.Set_TableTRCell(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableTRCell.Copy();
                break;
            }
            case "bottomLeftCell":
            {
                this.Style.Set_TableBLCell(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBLCell.Copy();
                break;
            }
            case "bottomRightCell":
            {
                this.Style.Set_TableBRCell(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBRCell.Copy();
                break;
            }
            case "firstRow":
            {
                this.Style.Set_TableFirstRow(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableFirstRow.Copy();
                break;
            }
            case "lastRow":
            {
                this.Style.Set_TableLastRow(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableLastRow.Copy();
                break;
            }
            case "firstColumn":
            {
                this.Style.Set_TableFirstCol(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableFirstCol.Copy();
                break;
            }
            case "lastColumn":
            {
                this.Style.Set_TableLastCol(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableLastCol.Copy();
                break;
            }
            case "bandedColumn":
            {
                this.Style.Set_TableBand1Vert(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBand1Vert.Copy();
                break;
            }
            case "bandedColumnEven":
            {
                this.Style.Set_TableBand2Vert(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBand2Vert.Copy();
                break;
            }
            case "bandedRow":
            {
                this.Style.Set_TableBand1Horz(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBand1Horz.Copy();
                break;
            }
            case "bandedRowEven":
            {
                this.Style.Set_TableBand2Horz(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableBand2Horz.Copy();
                break;
            }
            case "wholeTable":
            {
                this.Style.Set_TableWholeTable(oApiTableStylePr.TableStylePr);
                oApiTableStylePr.TableStylePr = this.Style.TableWholeTable.Copy();
                break;
            }
        }
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
    ApiTableRow.prototype.OnChangeTableRowPr = function(oApiTableRowPr)
    {
        this.Row.Set_Pr(oApiTableRowPr.RowPr);
        oApiTableRowPr.RowPr = this.Row.Pr.Copy();
    };
    ApiTableCell.prototype.OnChangeTableCellPr = function(oApiTableCellPr)
    {
        this.Cell.Set_Pr(oApiTableCellPr.CellPr);
        oApiTableCellPr.CellPr = this.Cell.Pr.Copy();
    };
    ApiTextPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTextPr(this);
    };
    ApiParaPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeParaPr(this);
    };
    ApiTablePr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTablePr(this);
    };
    ApiTableRowPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTableRowPr(this);
    };
    ApiTableCellPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTableCellPr(this);
    };
    ApiTableStylePr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTableStylePr(this);
    };
    ApiTableStylePr.prototype.OnChangeTextPr = function()
    {
        this.private_OnChange();
    };
    ApiTableStylePr.prototype.OnChangeParaPr = function()
    {
        this.private_OnChange();
    };
    ApiTableStylePr.prototype.OnChangeTablePr = function()
    {
        this.private_OnChange();
    };
    ApiTableStylePr.prototype.OnChangeTableRowPr = function()
    {
        this.private_OnChange();
    };
    ApiTableStylePr.prototype.OnChangeTableCellPr = function()
    {
        this.private_OnChange();
    };

}(window, null));