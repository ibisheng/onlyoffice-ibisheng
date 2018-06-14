/*
 * (c) Copyright Ascensio System SIA 2010-2018
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
     * Base class
     * @global
     * @class
     * @name Api
     */
    var Api = window["Asc"]["asc_docs_api"] || window["Asc"]["spreadsheet_api"];

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
		ApiDocumentContent.call(this, Document);
    }
	ApiDocument.prototype = Object.create(ApiDocumentContent.prototype);
	ApiDocument.prototype.constructor = ApiDocument;

    /**
     * Class representing a paragraph properties.
     * @constructor
     */
    function ApiParaPr(Parent, ParaPr)
    {
        this.Parent = Parent;
        this.ParaPr = ParaPr;
    }


    /*
     * Class representing paragraph bullet
     * @constructor
     * */
    function ApiBullet(Bullet)
    {
        this.Bullet = Bullet;
    }

    /**
     * Class representing a paragraph.
     * @constructor
     * @extends {ApiParaPr}
     */
    function ApiParagraph(Paragraph)
    {
		ApiParaPr.call(this, this, Paragraph.Pr.Copy());
        this.Paragraph = Paragraph;
    }
	ApiParagraph.prototype = Object.create(ApiParaPr.prototype);
	ApiParagraph.prototype.constructor = ApiParagraph;

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
		ApiTablePr.call(this, this, Table.Pr.Copy());
        this.Table = Table;
    }
	ApiTable.prototype = Object.create(ApiTablePr.prototype);
	ApiTable.prototype.constructor = ApiTable;

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
		ApiTextPr.call(this, this, Run.Pr.Copy());
        this.Run = Run;
    }
	ApiRun.prototype = Object.create(ApiTextPr.prototype);
	ApiRun.prototype.constructor = ApiRun;

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
		ApiTableRowPr.call(this, this, Row.Pr.Copy());
        this.Row = Row;
    }
	ApiTableRow.prototype = Object.create(ApiTableRowPr.prototype);
	ApiTableRow.prototype.constructor = ApiTableRow;

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
		ApiTableCellPr.call(this, this, Cell.Pr.Copy());
        this.Cell = Cell;
    }
	ApiTableCell.prototype = Object.create(ApiTableCellPr.prototype);
	ApiTableCell.prototype.constructor = ApiTableCell;

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
		ApiDrawing.call(this, Image.parent);
        this.Image = Image
    }
	ApiImage.prototype = Object.create(ApiDrawing.prototype);
	ApiImage.prototype.constructor = ApiImage;

    /**
     * Class representing a shape.
     * @constructor
     * */
    function ApiShape(Shape)
    {
		ApiDrawing.call(this, Shape.parent);
        this.Shape = Shape;
    }
	ApiShape.prototype = Object.create(ApiDrawing.prototype);
	ApiShape.prototype.constructor = ApiShape;

    /**
     * Class representing a Chart.
     * @constructor
     *
     */
    function ApiChart(Chart)
    {
		ApiDrawing.call(this, Chart.parent);
        this.Chart = Chart;
    }
	ApiChart.prototype = Object.create(ApiDrawing.prototype);
	ApiChart.prototype.constructor = ApiChart;

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
		ApiUniColor.call(this, AscFormat.CreateUniColorRGB(r, g, b));
    }
	ApiRGBColor.prototype = Object.create(ApiUniColor.prototype);
	ApiRGBColor.prototype.constructor = ApiRGBColor;

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
		ApiUniColor.call(this, oUniColor);
    }
	ApiSchemeColor.prototype = Object.create(ApiUniColor.prototype);
	ApiSchemeColor.prototype.constructor = ApiSchemeColor;

    /**
     * Class representing a Preset Color
     * @constructor
     * */
    function ApiPresetColor(sPresetColor)
    {
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.setColor(new AscFormat.CPrstColor());
        oUniColor.color.id = sPresetColor;
		ApiUniColor.call(this, oUniColor);
    }
	ApiPresetColor.prototype = Object.create(ApiUniColor.prototype);
	ApiPresetColor.prototype.constructor = ApiPresetColor;

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
        this.Ln = oLn;
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
	 * Class represent a container for the elements of a paragraph
	 * @constructor
	 */
	function ApiInlineLvlSdt(Sdt)
	{
		this.Sdt = Sdt;
	}

	/**
	 * Class represent a container for the content of the document
	 * @constructor
	 */
	function ApiBlockLvlSdt(Sdt)
	{
		this.Sdt = Sdt;
	}

    /**
     * Twentieths of a point (equivalent to 1/1440th of an inch).
     * @typedef {number} twips
     */

    /**
     * @typedef {(ApiParagraph | ApiTable | ApiBlockLvlSdt)} DocumentElement
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
     * @typedef {("topLeftCell" | "topRightCell" | "bottomLeftCell" | "bottomRightCell" | "firstRow" | "lastRow" |
     *     "firstColumn" | "lastColumn" | "bandedColumn" | "bandedColumnEven" | "bandedRow" | "bandedRowEven" |
     *     "wholeTable")} TableStyleOverrideType
     */

    /**
     * The types of elements that can be in the paragraph
     * @typedef {(ApiUnsupported | ApiRun | ApiInlineLvlSdt)} ParagraphContent
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
     * @typedef {("accentBorderCallout1" | "accentBorderCallout2" | "accentBorderCallout3" | "accentCallout1" |
     *     "accentCallout2" | "accentCallout3" | "actionButtonBackPrevious" | "actionButtonBeginning" |
     *     "actionButtonBlank" | "actionButtonDocument" | "actionButtonEnd" | "actionButtonForwardNext" |
     *     "actionButtonHelp" | "actionButtonHome" | "actionButtonInformation" | "actionButtonMovie" |
     *     "actionButtonReturn" | "actionButtonSound" | "arc" | "bentArrow" | "bentConnector2" | "bentConnector3" |
     *     "bentConnector4" | "bentConnector5" | "bentUpArrow" | "bevel" | "blockArc" | "borderCallout1" |
     *     "borderCallout2" | "borderCallout3" | "bracePair" | "bracketPair" | "callout1" | "callout2" | "callout3" |
     *     "can" | "chartPlus" | "chartStar" | "chartX" | "chevron" | "chord" | "circularArrow" | "cloud" |
     *     "cloudCallout" | "corner" | "cornerTabs" | "cube" | "curvedConnector2" | "curvedConnector3" |
     *     "curvedConnector4" | "curvedConnector5" | "curvedDownArrow" | "curvedLeftArrow" | "curvedRightArrow" |
     *     "curvedUpArrow" | "decagon" | "diagStripe" | "diamond" | "dodecagon" | "donut" | "doubleWave" | "downArrow" | "downArrowCallout" | "ellipse" | "ellipseRibbon" | "ellipseRibbon2" | "flowChartAlternateProcess" | "flowChartCollate" | "flowChartConnector" | "flowChartDecision" | "flowChartDelay" | "flowChartDisplay" | "flowChartDocument" | "flowChartExtract" | "flowChartInputOutput" | "flowChartInternalStorage" | "flowChartMagneticDisk" | "flowChartMagneticDrum" | "flowChartMagneticTape" | "flowChartManualInput" | "flowChartManualOperation" | "flowChartMerge" | "flowChartMultidocument" | "flowChartOfflineStorage" | "flowChartOffpageConnector" | "flowChartOnlineStorage" | "flowChartOr" | "flowChartPredefinedProcess" | "flowChartPreparation" | "flowChartProcess" | "flowChartPunchedCard" | "flowChartPunchedTape" | "flowChartSort" | "flowChartSummingJunction" | "flowChartTerminator" | "foldedCorner" | "frame" | "funnel" | "gear6" | "gear9" | "halfFrame" | "heart" | "heptagon" | "hexagon" | "homePlate" | "horizontalScroll" | "irregularSeal1" | "irregularSeal2" | "leftArrow" | "leftArrowCallout" | "leftBrace" | "leftBracket" | "leftCircularArrow" | "leftRightArrow" | "leftRightArrowCallout" | "leftRightCircularArrow" | "leftRightRibbon" | "leftRightUpArrow" | "leftUpArrow" | "lightningBolt" | "line" | "lineInv" | "mathDivide" | "mathEqual" | "mathMinus" | "mathMultiply" | "mathNotEqual" | "mathPlus" | "moon" | "nonIsoscelesTrapezoid" | "noSmoking" | "notchedRightArrow" | "octagon" | "parallelogram" | "pentagon" | "pie" | "pieWedge" | "plaque" | "plaqueTabs" | "plus" | "quadArrow" | "quadArrowCallout" | "rect" | "ribbon" | "ribbon2" | "rightArrow" | "rightArrowCallout" | "rightBrace" | "rightBracket" | "round1Rect" | "round2DiagRect" | "round2SameRect" | "roundRect" | "rtTriangle" | "smileyFace" | "snip1Rect" | "snip2DiagRect" | "snip2SameRect" | "snipRoundRect" | "squareTabs" | "star10" | "star12" | "star16" | "star24" | "star32" | "star4" | "star5" | "star6" | "star7" | "star8" | "straightConnector1" | "stripedRightArrow" | "sun" | "swooshArrow" | "teardrop" | "trapezoid" | "triangle" | "upArrowCallout" | "upDownArrow" | "upDownArrow" | "upDownArrowCallout" | "uturnArrow" | "verticalScroll" | "wave" | "wedgeEllipseCallout" | "wedgeRectCallout" | "wedgeRoundRectCallout")} ShapeType
     */

    /**
     * This type specifies the types, create charts
     * @typedef {("bar" | "barStacked" | "barStackedPercent" | "bar3D" | "barStacked3D" | "barStackedPercent3D" |
     *     "barStackedPercent3DPerspective" | "horizontalBar" | "horizontalBarStacked" | "horizontalBarStackedPercent"
     *     | "horizontalBar3D" | "horizontalBarStacked3D" | "horizontalBarStackedPercent3D" | "lineNormal" |
     *     "lineStacked" | "lineStackedPercent" | "line3D" | "pie" | "pie3D" | "doughnut" | "scatter" | "stock" |
     *     "area" | "areaStacked" | "areaStackedPercent")} ChartType
     */

    /**
     * @typedef {("top" | "center" | "bottom")} VerticalTextAlign
     * */

    /**
     * @typedef {("accent1" | "accent2" | "accent3" | "accent4" | "accent5" | "accent6" | "bg1" | "bg2" | "dk1" | "dk2"
     *     | "lt1" | "lt2" | "tx1" | "tx2")} SchemeColorId
     * */

    /**
     * @typedef {("aliceBlue" | "antiqueWhite" | "aqua" | "aquamarine" | "azure" | "beige" | "bisque" | "black" |
     *     "blanchedAlmond" | "blue" | "blueViolet" | "brown" | "burlyWood" | "cadetBlue" | "chartreuse" | "chocolate"
     *     | "coral" | "cornflowerBlue" | "cornsilk" | "crimson" | "cyan" | "darkBlue" | "darkCyan" | "darkGoldenrod" |
     *     "darkGray" | "darkGreen" | "darkGrey" | "darkKhaki" | "darkMagenta" | "darkOliveGreen" | "darkOrange" |
     *     "darkOrchid" | "darkRed" | "darkSalmon" | "darkSeaGreen" | "darkSlateBlue" | "darkSlateGray" |
     *     "darkSlateGrey" | "darkTurquoise" | "darkViolet" | "deepPink" | "deepSkyBlue" | "dimGray" | "dimGrey" |
     *     "dkBlue" | "dkCyan" | "dkGoldenrod" | "dkGray" | "dkGreen" | "dkGrey" | "dkKhaki" | "dkMagenta" |
     *     "dkOliveGreen" | "dkOrange" | "dkOrchid" | "dkRed" | "dkSalmon" | "dkSeaGreen" | "dkSlateBlue" |
     *     "dkSlateGray" | "dkSlateGrey" | "dkTurquoise" | "dkViolet" | "dodgerBlue" | "firebrick" | "floralWhite" |
     *     "forestGreen" | "fuchsia" | "gainsboro" | "ghostWhite" | "gold" | "goldenrod" | "gray" | "green" |
     *     "greenYellow" | "grey" | "honeydew" | "hotPink" | "indianRed" | "indigo" | "ivory" | "khaki" | "lavender" | "lavenderBlush" | "lawnGreen" | "lemonChiffon" | "lightBlue" | "lightCoral" | "lightCyan" | "lightGoldenrodYellow" | "lightGray" | "lightGreen" | "lightGrey" | "lightPink" | "lightSalmon" | "lightSeaGreen" | "lightSkyBlue" | "lightSlateGray" | "lightSlateGrey" | "lightSteelBlue" | "lightYellow" | "lime" | "limeGreen" | "linen" | "ltBlue" | "ltCoral" | "ltCyan" | "ltGoldenrodYellow" | "ltGray" | "ltGreen" | "ltGrey" | "ltPink" | "ltSalmon" | "ltSeaGreen" | "ltSkyBlue" | "ltSlateGray" | "ltSlateGrey" | "ltSteelBlue" | "ltYellow" | "magenta" | "maroon" | "medAquamarine" | "medBlue" | "mediumAquamarine" | "mediumBlue" | "mediumOrchid" | "mediumPurple" | "mediumSeaGreen" | "mediumSlateBlue" | "mediumSpringGreen" | "mediumTurquoise" | "mediumVioletRed" | "medOrchid" | "medPurple" | "medSeaGreen" | "medSlateBlue" | "medSpringGreen" | "medTurquoise" | "medVioletRed" | "midnightBlue" | "mintCream" | "mistyRose" | "moccasin" | "navajoWhite" | "navy" | "oldLace" | "olive" | "oliveDrab" | "orange" | "orangeRed" | "orchid" | "paleGoldenrod" | "paleGreen" | "paleTurquoise" | "paleVioletRed" | "papayaWhip" | "peachPuff" | "peru" | "pink" | "plum" | "powderBlue" | "purple" | "red" | "rosyBrown" | "royalBlue" | "saddleBrown" | "salmon" | "sandyBrown" | "seaGreen" | "seaShell" | "sienna" | "silver" | "skyBlue" | "slateBlue" | "slateGray" | "slateGrey" | "snow" | "springGreen" | "steelBlue" | "tan" | "teal" | "thistle" | "tomato" | "turquoise" | "violet" | "wheat" | "white" | "whiteSmoke" | "yellow" | "yellowGreen")} PresetColor
     * */


    /**
     *
     * @typedef {("none" | "nextTo" | "low" | "high")} TickLabelPosition
     * **/

    /**
     * @typedef {"tile" | "stretch"} BlipFillType
     * */

    /**
     * @typedef {"cross" | "dashDnDiag" | "dashHorz" | "dashUpDiag" | "dashVert" | "diagBrick" | "diagCross" | "divot"
     *     | "dkDnDiag" | "dkHorz" | "dkUpDiag" | "dkVert" | "dnDiag" | "dotDmnd" | "dotGrid" | "horz" | "horzBrick" |
     *     "lgCheck" | "lgConfetti" | "lgGrid" | "ltDnDiag" | "ltHorz" | "ltUpDiag" | "ltVert" | "narHorz" | "narVert"
     *     | "openDmnd" | "pct10" | "pct20" | "pct25" | "pct30" | "pct40" | "pct5" | "pct50" | "pct60" | "pct70" |
     *     "pct75" | "pct80" | "pct90" | "plaid" | "shingle" | "smCheck" | "smConfetti" | "smGrid" | "solidDmnd" |
     *     "sphere" | "trellis" | "upDiag" | "vert" | "wave" | "wdDnDiag" | "wdUpDiag" | "weave" | "zigZag"}
     *     PatternType
     * */

	/**
	 *
	 * @typedef {"unlocked" | "contentLocked" | "sdtContentLocked" | "sdtLocked"} SdtLock
     */
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


    /**
     * @typedef {("cross" | "in" | "none" | "out")} TickMark
     * */

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
     * Create a new table with a specified number of rows and columns.
     * @memberof Api
     * @param {number} nCols - Number of columns.
     * @param {number} nRows - Number of rows.
     * @returns {ApiTable}
     */
    Api.prototype.CreateTable = function(nCols, nRows)
    {
        if (!nRows || nRows <= 0 || !nCols || nCols <= 0)
            return null;

        var oTable = new CTable(private_GetDrawingDocument(), private_GetLogicDocument(), true, nRows, nCols, [], false);
        oTable.CorrectBadGrid();
		oTable.Set_TableW(undefined);
        oTable.Set_TableStyle2(undefined);
        return new ApiTable(oTable);
    };
    /**
     * Create a new smaller text block to be inserted to the current paragraph or table.
     * @memberof Api
     * @returns {ApiRun}
     */
    Api.prototype.CreateRun = function()
    {
        return new ApiRun(new ParaRun(null, false));
    };

    /**
     * Create an image with the parameters specified.
     * @memberof Api
     * @param {string} sImageSrc - The image source where the image to be inserted should be taken from (currently only internet URL or Base64 encoded images are supported).
     * @param {EMU} nWidth - The image width in English measure units.
     * @param {EMU} nHeight - The image height in English measure units.
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
     * Create a shape with the parameters specified.
     * @memberof Api
     * @param {ShapeType} [sType="rect"] - The shape type which specifies the preset shape geometry.
     * @param {EMU} nWidth - The shape width in English measure units.
     * @param {EMU} nHeight - The shape height in English measure units.
     * @param {ApiFill} oFill - The color or pattern used to fill the shape.
     * @param {ApiStroke} oStroke - The stroke used to create the element shadow.
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
     * Create a chart with the parameters specified.
     * @memberof Api
     * @param {ChartType} [sType="bar"] - The chart type used for the chart display.
     * @param {Array} aSeries - The array of the data used to build the chart from.
     * @param {Array} aSeriesNames - The array of the names (the source table column names) used for the data which the chart will be build from.
     * @param {Array} aCatNames - The array of the names (the source table row names) used for the data which the chart will be build from.
     * @param {EMU} nWidth - The chart width in English measure units.
     * @param {EMU} nHeight - The chart height in English measure units.
     * @param {number} nStyleIndex - The chart color style index (can be 1 - 48, as described in OOXML specification).
     * @returns {ApiChart}
     * */
    Api.prototype.CreateChart = function(sType, aSeries, aSeriesNames, aCatNames, nWidth, nHeight, nStyleIndex)
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
            case "area":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaNormal;
                break;
            }
            case "areaStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaStacked;
                break;
            }
            case "areaStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaStackedPer;
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
        if(AscFormat.isRealNumber(nStyleIndex)){
            oChartSpace.setStyle(nStyleIndex);
        }
        AscFormat.CheckSpPrXfrm(oChartSpace);
        oDrawing.setExtent( oChartSpace.spPr.xfrm.extX, oChartSpace.spPr.xfrm.extY );
        return new ApiChart(oChartSpace);
    };

    /**
     * Create an RGB color setting the appropriate values for the red, green and blue color components.
     * @memberof Api
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @returns {ApiRGBColor}
     */
    Api.prototype.CreateRGBColor = function(r, g, b)
    {
        return new ApiRGBColor(r, g, b);
    };

    /**
     * Create a complex color scheme selecting from one of the available schemes.
     * @memberof Api
     * @param {SchemeColorId} sSchemeColorId - The color scheme identifier.
     * @returns {ApiSchemeColor}
     */
    Api.prototype.CreateSchemeColor = function(sSchemeColorId)
    {
        return new ApiSchemeColor(sSchemeColorId);
    };

    /**
     * Create a color selecting it from one of the available color presets.
     * @memberof Api
     * @param {PresetColor} sPresetColor - A preset selected from the list of the available color preset names.
     * @returns {ApiPresetColor};
     * */
    Api.prototype.CreatePresetColor = function(sPresetColor)
    {
        return new ApiPresetColor(sPresetColor);
    };

    /**
     * Create a solid fill which allows to fill the object using a selected solid color as the object background.
     * @memberof Api
     * @param {ApiUniColor} oUniColor - The color used for the element fill.
     * @returns {ApiFill}
     * */
    Api.prototype.CreateSolidFill = function(oUniColor)
    {
        return new ApiFill(AscFormat.CreateUniFillByUniColor(oUniColor.Unicolor));
    };

    /**
     * Create a linear gradient fill which allows to fill the object using a selected linear gradient as the object background.
     * @memberof Api
     * @param {Array} aGradientStop - The angle measured in 60000th of a degree that will define the gradient direction.
     * @param {PositiveFixedAngle} Angle - The angle measured in 60000th of a degree that will define the gradient direction.
     * @returns {ApiFill}
     */
    Api.prototype.CreateLinearGradientFill = function(aGradientStop, Angle)
    {
        return new ApiFill(AscFormat.builder_CreateLinearGradient(aGradientStop, Angle));
    };


    /**
     * Create a radial gradient fill which allows to fill the object using a selected radial gradient as the object background.
     * @memberof Api
     * @param {Array} aGradientStop - The array of gradient color stops measured in 1000th of percent.
     * @returns {ApiFill}
     */
    Api.prototype.CreateRadialGradientFill = function(aGradientStop)
    {
        return new ApiFill(AscFormat.builder_CreateRadialGradient(aGradientStop));
    };

    /**
     * Create a pattern fill which allows to fill the object using a selected pattern as the object background.
     * @memberof Api
     * @param {PatternType} sPatternType - The pattern type used for the fill selected from one of the available pattern types.
     * @param {ApiUniColor} BgColor - The background color used for the pattern creation.
     * @param {ApiUniColor} FgColor - The foreground color used for the pattern creation.
     * @returns {ApiFill}
     */
    Api.prototype.CreatePatternFill = function(sPatternType, BgColor, FgColor)
    {
        return new ApiFill(AscFormat.builder_CreatePatternFill(sPatternType, BgColor, FgColor));
    };

    /**
     * Create a blip fill which allows to fill the object using a selected image as the object background.
     * @memberof Api
     * @param {string} sImageUrl - The path to the image used for the blip fill (currently only internet URL or Base64 encoded images are supported).
     * @param {BlipFillType} sBlipFillType - The type of the fill used for the blip fill (tile or stretch).
     * @returns {ApiFill}
     * */
    Api.prototype.CreateBlipFill = function(sImageUrl, sBlipFillType)
    {
        return new ApiFill(AscFormat.builder_CreateBlipFill(sImageUrl, sBlipFillType));
    };

    /**
     * Create no fill and remove the fill from the element.
     * @memberof Api
     * @returns {ApiFill}
     * */
    Api.prototype.CreateNoFill = function()
    {
        return new ApiFill(AscFormat.CreateNoFillUniFill());
    };

    /**
     * Create a stroke adding shadows to the element.
     * @memberof Api
     * @param {EMU} nWidth - The width of the shadow measured in English measure units.
     * @param {ApiFill} oFill - The fill type used to create the shadow.
     * @returns {ApiStroke}
     * */
    Api.prototype.CreateStroke = function(nWidth, oFill)
    {
        return new ApiStroke(AscFormat.builder_CreateLine(nWidth, oFill));
    };

    /**
     * Create a gradient stop used for different types of gradients.
     * @memberof Api
     * @param {ApiUniColor} oUniColor - The color used for the gradient stop.
     * @param {PositivePercentage} nPos - The position of the gradient stop measured in 1000th of percent.
     * @returns {ApiGradientStop}
     * */
    Api.prototype.CreateGradientStop = function(oUniColor, nPos)
    {
        return new ApiGradientStop(oUniColor, nPos);
    };

    /**
     * Create a bullet for a paragraph with the character or symbol specified with the sBullet parameter.
     * @memberof Api
     * @param {string} sSymbol - The type of the fill used for the blip fill (tile or stretch).
     * @returns {ApiBullet}
     * */
    Api.prototype.CreateBullet = function(sSymbol){
        var oBullet = new AscFormat.CBullet();
        oBullet.bulletType = new AscFormat.CBulletType();
        if(typeof sSymbol === "string" && sSymbol.length > 0){
            oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_CHAR;
            oBullet.bulletType.Char = sSymbol[0];
        }
        else{
            oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_NONE;
        }
        return new ApiBullet(oBullet);
    };

    /**
     * Create a new numbering
     * @memberof Api
     * @param {BulletType} sType
     * @param {number} nStartAt
     * @returns {ApiBullet}
     * */

    Api.prototype.CreateNumbering = function(sType, nStartAt){
        var oBullet = new AscFormat.CBullet();
        oBullet.bulletType = new AscFormat.CBulletType();
        oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_AUTONUM;
        switch(sType){
            case "ArabicPeriod" :{
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
            case "ArabicParenR":{
                oBullet.bulletType.AutoNumType = 11;
                break;
            }
            case "RomanUcPeriod":{
                oBullet.bulletType.AutoNumType = 34;
                break;
            }
            case "RomanLcPeriod":{
                oBullet.bulletType.AutoNumType = 31;
                break;
            }
            case "AlphaLcParenR":{
                oBullet.bulletType.AutoNumType = 1;
                break;
            }
            case "AlphaLcPeriod":{
                oBullet.bulletType.AutoNumType = 2;
                break;
            }
            case "AlphaUcParenR":{
                oBullet.bulletType.AutoNumType = 4;
                break;
            }
            case "AlphaUcPeriod":{
                oBullet.bulletType.AutoNumType = 5;
                break;
            }
            case "None":{
                oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_NONE;
                break;
            }
        }
        if( oBullet.bulletType.type === AscFormat.BULLET_TYPE_BULLET_AUTONUM){
            if(AscFormat.isRealNumber(nStartAt)){
                oBullet.bulletType.startAt = nStartAt;
            }
        }
        return new ApiBullet(oBullet);
    };

	/**
	 * Create a new inline container
	 * @returns {ApiInlineLvlSdt}
	 */
	Api.prototype.CreateInlineLvlSdt = function()
	{
		var oSdt = new CInlineLevelSdt();
		oSdt.Add_ToContent(0, new ParaRun(null, false));
		return new ApiInlineLvlSdt(oSdt);
	};

	/**
	 * Create a new block level container
	 * @returns {ApiBlockLvlSdt}
	 */
	Api.prototype.CreateBlockLvlSdt = function()
	{
		return new ApiBlockLvlSdt(new CBlockLvlSdt());
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
     * Get the number of elements in the current document.
     * @returns {number}
     */
    ApiDocumentContent.prototype.GetElementsCount = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Get the element by its position in the document.
     * @returns {?DocumentElement}
     */
    ApiDocumentContent.prototype.GetElement = function(nPos)
    {
        if (!this.Document.Content[nPos])
            return null;

        var Type = this.Document.Content[nPos].GetType();
        if (type_Paragraph === Type)
            return new ApiParagraph(this.Document.Content[nPos]);
        else if (type_Table === Type)
            return new ApiTable(this.Document.Content[nPos]);
        else if (type_BlockLevelSdt === Type)
        	return new ApiBlockLvlSdt(this.Document.Content[nPos]);

        return null;
    };
    /**
     * Add paragraph or table using its position in the document.
     * @param {number} nPos - The position where the current element will be added.
     * @param {DocumentElement} oElement - The document element which will be added at the current position.
     */
    ApiDocumentContent.prototype.AddElement = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable || oElement instanceof ApiBlockLvlSdt)
        {
            this.Document.Internal_Content_Add(nPos, oElement.private_GetImpl());
        }
    };
    /**
     * Push a paragraph or a table to actually add it to the document.
     * @param {DocumentElement} oElement - The type of the element which will be pushed to the document.
     */
    ApiDocumentContent.prototype.Push = function(oElement)
    {
        if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
        {
            this.Document.Internal_Content_Add(this.Document.Content.length, oElement.private_GetImpl());
            return true;
        }

        return false;
    };
    /**
     * Remove all elements from the current document or from the current document element.
     */
    ApiDocumentContent.prototype.RemoveAllElements = function()
    {
        this.Document.Internal_Content_Remove(0, this.Document.Content.length);
    };
    /**
     * Remove element using the position specified.
     * @param {number} nPos - The element number (position) in the document or inside other element.
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
     * Get a style by the style name.
     * @param {string} sStyleName - The name using which it is possible to address the style.
     * @returns {?ApiStyle}
     */
    ApiDocument.prototype.GetStyle = function(sStyleName)
    {
        var oStyles  = this.Document.Get_Styles();
        var oStyleId = oStyles.GetStyleIdByName(sStyleName, true);
        return new ApiStyle(oStyles.Get(oStyleId));
    };
    /**
     * Create a new style with the specified type and name. If there is a style with the same name it will be replaced with a new one.
     * with a new one.
     * @param {string} sStyleName - The name of the style which will be created.
     * @param {StyleType} [sType="paragraph"] - The document element which the style will be applied to.
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
        var sOldId    = oStyles.GetStyleIdByName(sStyleName);
        var oOldStyle = oStyles.Get(sOldId);
        if (null != sOldId && oOldStyle)
        {
            oStyles.Remove(sOldId);
            oStyles.RemapIdReferences(sOldId, oStyle.Get_Id());
        }

        oStyles.Add(oStyle);
        return new ApiStyle(oStyle);
    };
    /**
     * Get the default style parameters for the specified document element.
     * @param {StyleType} sStyleType - The document element which we want to get the style for.
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
     * Get a set of default properties for the text run in the current document.
     * @returns {ApiTextPr}
     */
    ApiDocument.prototype.GetDefaultTextPr = function()
    {
        var oStyles = this.Document.Get_Styles();
        return new ApiTextPr(this, oStyles.Get_DefaultTextPr().Copy());
    };
    /**
     * Get a set of default paragraph properties in the current document.
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
     * Create a new document section which ends at the specified paragraph. Allows to set local parameters for the current
     * section - page size, footer, header, columns, etc.
     * @param {ApiParagraph} oParagraph - The paragraph after which the new document section will be inserted.
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
     * Specify whether sections in this document will have different headers and footers for even and
     * odd pages (one header/footer for odd pages and another header/footer for even pages).
     * @param {boolean} isEvenAndOdd - If true the header/footer will be different for odd and even pages, if false they will be the same.
     */
    ApiDocument.prototype.SetEvenAndOddHdrFtr = function(isEvenAndOdd)
    {
        this.Document.Set_DocumentEvenAndOddHeaders(isEvenAndOdd);
    };
    /**
     * Create an abstract multilevel numbering with a specified type.
     * @param {("bullet" | "numbered")} [sType="bullet"] - The type of the numbering which will be created.
     * @returns {ApiNumbering}
     */
    ApiDocument.prototype.CreateNumbering = function(sType)
    {
        var oGlobalNumbering = this.Document.GetNumbering();
        var oNum             = oGlobalNumbering.CreateNum();

        if ("numbered" === sType)
			oNum.CreateDefault(c_oAscMultiLevelNumbering.Numbered);
        else
			oNum.CreateDefault(c_oAscMultiLevelNumbering.Bullet);

        return new ApiNumbering(oNum);
    };

	/**
	 * Insert an array of elements in the current position of the document.
     * @param {DocumentElement[]} arrContent - An array of elements to insert.
	 * @param {boolean} [isInline=false] - Inline insert on not (works only when the length of arrContent = 1 and it's a paragraph)
     * @returns {boolean} Success?
     */
    ApiDocument.prototype.InsertContent = function(arrContent, isInline)
    {
        var oSelectedContent = new CSelectedContent();
        for (var nIndex = 0, nCount = arrContent.length; nIndex < nCount; ++nIndex)
        {
            var oElement = arrContent[nIndex];
            if (oElement instanceof ApiParagraph || oElement instanceof ApiTable)
            {
            	if (true === isInline && 1 === nCount && oElement instanceof ApiParagraph)
					oSelectedContent.Add(new CSelectedElement(oElement.private_GetImpl(), false));
            	else
                	oSelectedContent.Add(new CSelectedElement(oElement.private_GetImpl(), true));
            }
        }
		oSelectedContent.On_EndCollectElements(this.Document, true);

        if (this.Document.IsSelectionUse())
        {
            this.Document.Start_SilentMode();
            this.Document.Remove(1, false, false, false);
            this.Document.End_SilentMode();
            this.Document.RemoveSelection(true);
        }

        var oParagraph = this.Document.GetCurrentParagraph();
        if (!oParagraph)
            return;

        var oNearestPos = {
            Paragraph  : oParagraph,
            ContentPos : oParagraph.Get_ParaContentPos(false, false)
        };

        oParagraph.Check_NearestPos(oNearestPos);

        if (!this.Document.Can_InsertContent(oSelectedContent, oNearestPos))
            return false;

		oParagraph.Parent.Insert_Content(oSelectedContent, oNearestPos);
        oParagraph.Clear_NearestPosArray();
		this.Document.RemoveSelection(true);
        return true;
    };

    /**
     * Get a report about all the comments added to the document.
	 * @returns {object}
     */
    ApiDocument.prototype.GetCommentsReport = function()
    {
		var oResult = {};
		var oReport = this.Document.Api.asc_GetCommentsReportByAuthors();
		for (var sUserName in oReport)
		{
			var arrUserComments = oReport[sUserName];
			oResult[sUserName] = [];

			for (var nIndex = 0, nCount = arrUserComments.length; nIndex < nCount; ++nIndex)
			{
				var isAnswer     = oReport[sUserName][nIndex].Top ? false : true;
				var oCommentData = oReport[sUserName][nIndex].Data;

				if (isAnswer)
				{
					oResult[sUserName].push({
						"IsAnswer"       : true,
						"CommentMessage" : oCommentData.GetText(),
						"Date"           : oCommentData.GetDateTime()
					});
				}
				else
				{
					var sQuoteText = oCommentData.GetQuoteText();
					oResult[sUserName].push({
						"IsAnswer"       : false,
						"CommentMessage" : oCommentData.GetText(),
						"Date"           : oCommentData.GetDateTime(),
						"QuoteText"      : sQuoteText,
						"IsSolved"       : oCommentData.IsSolved()
					});
				}
			}
		}

		return oResult;
    };

	/**
	 * Get a report about every change which was made to the document in the review mode.
	 * @returns {object}
	 */
	ApiDocument.prototype.GetReviewReport = function()
	{
		var oResult = {};
		var oReport = this.Document.Api.asc_GetTrackRevisionsReportByAuthors();
		for (var sUserName in oReport)
		{
			var arrUsersChanges = oReport[sUserName];
			oResult[sUserName] = [];

			for (var nIndex = 0, nCount = arrUsersChanges.length; nIndex < nCount; ++nIndex)
			{
				var oChange = oReport[sUserName][nIndex];

				var nType = oChange.get_Type();
				var oElement = {};
				// TODO: Посмотреть почем Value приходит массивом.
				if (c_oAscRevisionsChangeType.TextAdd === nType)
				{
					oElement = {
						"Type" : "TextAdd",
						"Value" : oChange.get_Value().length ? oChange.get_Value()[0] : ""
					};
				}
				else if (c_oAscRevisionsChangeType.TextRem == nType)
				{
					oElement = {
						"Type" : "TextRem",
						"Value" : oChange.get_Value().length ? oChange.get_Value()[0] : ""
					};
				}
				else if (c_oAscRevisionsChangeType.ParaAdd === nType)
				{
					oElement = {
						"Type" : "ParaAdd"
					};
				}
				else if (c_oAscRevisionsChangeType.ParaRem === nType)
				{
					oElement = {
						"Type" : "ParaRem"
					};
				}
				else if (c_oAscRevisionsChangeType.TextPr === nType)
				{
					oElement = {
						"Type" : "TextPr"
					};
				}
				else if (c_oAscRevisionsChangeType.ParaPr === nType)
				{
					oElement = {
						"Type" : "ParaPr"
					};
				}
				else
				{
					oElement = {
						"Type" : "Unknown"
					};
				}
				oElement["Date"] = oChange.get_DateTime();
				oResult[sUserName].push(oElement);
			}
		}
		return oResult;
	};
	/**
	 * Find and replace text.
	 * @param {Object} oProperties The properties for find and replace.
	 * @param {string} oProperties.searchString Search string.
	 * @param {string} oProperties.replaceString Replacement string.
	 * @param {string} [oProperties.matchCase=true]
	 *
	 */
	ApiDocument.prototype.SearchAndReplace = function(oProperties)
	{
		var sSearch     = oProperties["searchString"];
		var sReplace    = oProperties["replaceString"];
		var isMatchCase = undefined !== oProperties["matchCase"] ? oProperties.matchCase : true;

		var oSearchEngine = this.Document.Search(sSearch, {MatchCase : isMatchCase});
		if (!oSearchEngine)
			return;

		this.Document.Search_Replace(sReplace, true, null, false);
	};
	/**
	 * Get the list of all content controls in the document
	 * @returns {ApiBlockLvlSdt[] | ApiInlineLvlSdt[]}
	 */
	ApiDocument.prototype.GetAllContentControls = function()
	{
		var arrResult = [];
		var arrControls = this.Document.GetAllContentControls();
		for (var nIndex = 0, nCount = arrControls.length; nIndex < nCount; ++nIndex)
		{
			var oControl = arrControls[nIndex];

			if (oControl instanceof CBlockLevelSdt)
				arrResult.push(new ApiBlockLvlSdt(oControl));
			else if (oControl instanceof CInlineLevelSdt)
				arrResult.push(new ApiInlineLvlSdt(oControl));
		}

		return arrResult;
	};
    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiParagraph
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Insert watermark on each page of document
     * @param {?string} [sText="WATERMARK"]
     * @param {?boolean} [bIsDiagonal=true]
     */
    ApiDocument.prototype.InsertWatermark = function(sText, bIsDiagonal){
        var oSectPrMap = {};
        if(this.Document.SectPr){
            oSectPrMap[this.Document.SectPr.Get_Id()] = this.Document.SectPr;
        }
        var oElement;
        for(var i = 0; i < this.Document.Content.length; ++i){
            oElement = this.Document.Content[i];
            if(oElement instanceof Paragraph){
                if(oElement.SectPr){
                    oSectPrMap[oElement.SectPr.Get_Id()] = oElement.SectPr;
                }
            }
        }
        var oHeadersMap = {};
        var oApiSection, oHeader;
        for(var sId in oSectPrMap){
            if(oSectPrMap.hasOwnProperty(sId)){
                oApiSection = new ApiSection(oSectPrMap[sId]);
                oHeader = oApiSection.GetHeader("title", false);
                if(oHeader){
                    oHeadersMap[oHeader.Document.Get_Id()] = oHeader;
                }
                oHeader = oApiSection.GetHeader("even", false);
                if(oHeader){
                    oHeadersMap[oHeader.Document.Get_Id()] = oHeader;
                }
                oHeader = oApiSection.GetHeader("default", true);
                if(oHeader){
                    oHeadersMap[oHeader.Document.Get_Id()] = oHeader;
                }
            }
        }
        for(var sId in oHeadersMap){
            if(oHeadersMap.hasOwnProperty(sId)){
                privateInsertWatermarkToContent(this.Document.Api, oHeadersMap[sId], sText, bIsDiagonal);
            }
        }
    };
    /**
     * Get the type of this class.
     * @returns {"document"}
     */
    ApiParagraph.prototype.GetClassType = function()
    {
        return "paragraph";
    };
    /**
     * Add some text to the element.
     * @param {string} [sText=""] - The text that we want to insert into the current document element.
     * @returns {ApiRun}
     */
    ApiParagraph.prototype.AddText = function(sText)
    {
        var oRun = new ParaRun(this.Paragraph, false);

        if (!sText || !sText.length)
            return new ApiRun(oRun);

        oRun.AddText(sText);

        private_PushElementToParagraph(this.Paragraph, oRun);
        return new ApiRun(oRun);
    };
    /**
     * Add page break and start the next element from the next page.
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
     * Add line break to the current position and start the next element from a new line.
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
     * Add column break to the current position and start the next element from a new column.
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
	 * Insert the number of the current document page into the paragraph.
     * <note>This method works for the paragraphs in the document header/footer only.</note>
	 * @returns {ApiRun}
	 */
	ApiParagraph.prototype.AddPageNumber = function()
	{
		var oRun = new ParaRun(this.Paragraph, false);
		oRun.Add_ToContent(0, new ParaPageNum());
		private_PushElementToParagraph(this.Paragraph, oRun);
		return new ApiRun(oRun);
	};
	/**
	 * Insert the number of pages in the current document into the paragraph.
     * <note>This method works for the paragraphs in the document header/footer only.</note>
	 * @returns {ApiRun}
	 */
	ApiParagraph.prototype.AddPagesCount = function()
	{
		var oRun = new ParaRun(this.Paragraph, false);
		oRun.Add_ToContent(0, new ParaPageCount());
		private_PushElementToParagraph(this.Paragraph, oRun);
		return new ApiRun(oRun);
	};
    /**
     * Get the text properties of the paragraph mark which is used to mark the paragraph end. The mark can also acquire
     * common text properties like bold, italic, underline, etc.
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
     * Get a numbering definition and numbering level for the numbered list.
     * @returns {?ApiNumberingLevel}
     */
    ApiParagraph.prototype.GetNumbering = function()
    {
        var oNumPr = this.Paragraph.GetNumPr();
        if (!oNumPr)
            return null;

        var oLogicDocument   = private_GetLogicDocument();
        var oGlobalNumbering = oLogicDocument.GetNumbering();
        var oNum             = oGlobalNumbering.GetNum(oNumPr.NumId);
        if (!oNum)
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
     * Get the element of the paragraph using the position specified.
     * @param {number} nPos - The position where the element which content we want to get must be located.
     * @returns {?ParagraphContent}
     */
    ApiParagraph.prototype.GetElement = function(nPos)
    {
        // TODO: ParaEnd
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 1)
            return null;

		return private_GetSupportedParaElement(this.Paragraph.Content[nPos]);
    };
    /**
     * Remove the element using the position specified.
     * @param {number} nPos - The position of the element which we want to remove in the paragraph.
     */
    ApiParagraph.prototype.RemoveElement = function(nPos)
    {
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 1)
            return;

        this.Paragraph.Remove_FromContent(nPos, 1);
    };
    /**
     * Remove all elements from the current paragraph.
     */
    ApiParagraph.prototype.RemoveAllElements = function()
    {
        if (this.Paragraph.Content.length > 1)
            this.Paragraph.Remove_FromContent(0, this.Paragraph.Content.length - 1);
    };
    /**
     * Add an element to the current paragraph.
     * @param {ParagraphContent} The document element which will be added at the current position. Returns false if the
     * type of oElement is not supported by a paragraph.
     * @param {number} [nPos] The number of the paragraph where the current element will be added. If this value is not
     * specified then the element will be added at the end of the current paragraph.
     * @returns {boolean} Returns <code>false</code> if the type of <code>oElement</code> is not supported by paragraph
     * content.
     */
    ApiParagraph.prototype.AddElement = function(oElement, nPos)
    {
        // TODO: ParaEnd
        if (!private_IsSupportedParaElement(oElement) || nPos < 0 || nPos > this.Paragraph.Content.length - 1)
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
     * Add a tab stop to the current paragraph.
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
     * Add an object (image, shape or chart) to the current paragraph.
     * @param {ApiDrawing} oDrawing - The object which will be added to the current paragraph.
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

	/**
	 * Add a inline container
	 * @param {ApiInlineLvlSdt?} oSdt - if undefined or null, then new class ApiInlineLvlSdt will be created and added to paragraph.
	 * @returns {ApiInlineLvlSdt}
	 */
    ApiParagraph.prototype.AddInlineLvlSdt = function(oSdt)
	{
		if (!oSdt || !(oSdt instanceof ApiInlineLvlSdt))
		{
			var _oSdt = new CInlineLevelSdt();
			_oSdt.Add_ToContent(0, new ParaRun(null, false));
			oSdt = new ApiInlineLvlSdt(_oSdt);
		}

		private_PushElementToParagraph(this.Paragraph, oSdt.Sdt);
		return oSdt;
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
     * Add some text to this run.
     * @param {string} sText - The text which will be added to the current run.
     */
    ApiRun.prototype.AddText = function(sText)
    {
        if (!sText || !sText.length)
            return;

        this.Run.AddText(sText);
    };
    /**
     * Add a page break and start the next element from a new page.
     */
    ApiRun.prototype.AddPageBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Page));
    };
    /**
     * Add a line break to the current run position and start the next element from a new line.
     */
    ApiRun.prototype.AddLineBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Line));
    };
    /**
     * Add a column break to the current run position and start the next element from a new column.
     */
    ApiRun.prototype.AddColumnBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaNewLine(break_Column));
    };
    /**
     * Add a tab stop to the current run.
     */
    ApiRun.prototype.AddTabStop = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaTab());
    };
    /**
     * Add an object (image, shape or chart) to the current text run.
     * @param {ApiDrawing} oDrawing - The object which will be added to the current run.
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
     * section shall be placed relative to the previous section.<br/>
     * WordprocessingML supports five distinct types of section breaks:<br/>
     *   * <b>Next page</b> section breaks (the default if type is not specified), which begin the new section on the
     *   following page.<br/>
     *   * <b>Odd</b> page section breaks, which begin the new section on the next odd-numbered page.<br/>
     *   * <b>Even</b> page section breaks, which begin the new section on the next even-numbered page.<br/>
     *   * <b>Continuous</b> section breaks, which begin the new section on the following paragraph. This means that
     *   continuous section breaks might not specify certain page-level section properties, since they shall be
     *   inherited from the following section. These breaks, however, can specify other section properties, such
     *   as line numbering and footnote/endnote settings.<br/>
     *   * <b>Column</b> section breaks, which begin the new section on the next column on the page.
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
     * Specify that all text columns in the current section are of equal width.
     * @param {number} nCount - Number of columns.
     * @param {twips} nSpace - Distance between columns measured in twentieths of a point (1/1440 of an inch).
     */
    ApiSection.prototype.SetEqualColumns = function(nCount, nSpace)
    {
        this.Section.Set_Columns_EqualWidth(true);
        this.Section.Set_Columns_Num(nCount);
        this.Section.Set_Columns_Space(private_Twips2MM(nSpace));
    };
    /**
     * Set all columns of this section are of different widths. Count of columns are equal length of
     * <code>aWidth</code> array. The length of <code>aSpaces</code> array <b>MUST BE</b> (<code>aWidth.length -
     * 1</code>).
     * @param {twips[]} aWidths - An array of column width values measured in twentieths of a point (1/1440 of an inch).
     * @param {twips[]} aSpaces - An array of distances values between the columns measured in twentieths of a point (1/1440 of an inch).
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
     * @param {twips} nWidth - The page width measured in twentieths of a point (1/1440 of an inch).
     * @param {twips} nHeight - The page height measured in twentieths of a point (1/1440 of an inch).
     * @param {boolean} [isPortrait=false] - Specifies the orientation of all pages in this section (if set to true then the portrait orientation is chosen).
     */
    ApiSection.prototype.SetPageSize = function(nWidth, nHeight, isPortrait)
    {
        this.Section.Set_PageSize(private_Twips2MM(nWidth), private_Twips2MM(nHeight));
        this.Section.Set_Orientation(false === isPortrait ? Asc.c_oAscPageOrientation.PageLandscape : Asc.c_oAscPageOrientation.PagePortrait, false);
    };
    /**
     * Specify the page margins for all pages in this section.
     * @param {twips} nLeft - The left margin width measured in twentieths of a point (1/1440 of an inch).
     * @param {twips} nTop - The top margin height measured in twentieths of a point (1/1440 of an inch).
     * @param {twips} nRight - The right margin width measured in twentieths of a point (1/1440 of an inch).
     * @param {twips} nBottom - The bottom margin height measured in twentieths of a point (1/1440 of an inch).
     */
    ApiSection.prototype.SetPageMargins = function(nLeft, nTop, nRight, nBottom)
    {
        this.Section.Set_PageMargins(private_Twips2MM(nLeft), private_Twips2MM(nTop), private_Twips2MM(nRight), private_Twips2MM(nBottom));
    };
    /**
     * Specify the distance from the top edge of the page to the top edge of the header.
     * @param {twips} nDistance - The distance from the top edge of the page to the top edge of the header measured in twentieths of a point (1/1440 of an inch).
     */
    ApiSection.prototype.SetHeaderDistance = function(nDistance)
    {
        this.Section.Set_PageMargins_Header(private_Twips2MM(nDistance));
    };
    /**
     * Specify the distance from the bottom edge of the page to the bottom edge of the footer.
     * footer.
     * @param {twips} nDistance - The distance from the bottom edge of the page to the bottom edge of the footer measured
     * in twentieths of a point (1/1440 of an inch).
     */
    ApiSection.prototype.SetFooterDistance = function(nDistance)
    {
        this.Section.Set_PageMargins_Footer(private_Twips2MM(nDistance));
    };
    /**
     * Get the content for the specified header type.
     * @param {HdrFtrType} sType - Type of header to get the content from.
     * @param {boolean} [isCreate=false] - Whether to create a new header or not with the specified header type in case
     * no header with such a type could be found in the current section.
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
        if(!oHeader){
            return null;
        }
        return new ApiDocumentContent(oHeader.Get_DocumentContent());
    };
    /**
     * Remove the header of the specified type from the current section. After removal the header will be inherited from
     * the previous section or, if this is the first section in the document, no header of the specified type will be present.
     * @param {HdrFtrType} sType - Type of header to be removed.
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
     * Get the content for the specified footer type.
     * @param {HdrFtrType} sType - Type of footer to get the content from.
     * @param {boolean} [isCreate=false] - Whether to create a new footer or not with the specified footer type in case
     * no footer with such a type could be found in the current section.
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
     * Specify whether the current section in this document have different header and footer for the section first page.
     * @param {boolean} isTitlePage - If true the first page of the section will have header and footer that will differ from the other pages of the same section.
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
     * Get the table row by its position in the table.
     * @param {number} nPos - The row position within the tabl
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
     * <note><b>Please note</b>: the number of cells in any row and the number of rows in the current table may be changed.</note>
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

        var isMerged = this.Table.MergeTableCells(true);
        var oMergedCell = this.Table.CurCell;
        oTable.RemoveSelection();

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
     * which shall be applied to the set of table rows with the current table-level property exceptions. A table style
     * can specify up to six different optional conditional formats [Example: Different formatting for first column.
     * end example], which then can be applied or omitted from individual table rows in the parent table.
     *
     * The default setting is to apply the row and column banding formatting, but not the first row, last row, first
     * column, or last column formatting.
     * @param {boolean} isFirstColumn - Specifies that the first column conditional formatting will be applied to the table.
     * @param {boolean} isFirstRow - Specifies that the first row conditional formatting will be applied to the table.
     * @param {boolean} isLastColumn - Specifies that the last column conditional formatting will be applied to the table.
     * @param {boolean} isLastRow - Specifies that the last row conditional formatting will be applied to the table.
     * @param {boolean} isHorBand - Specifies that the horizontal banding conditional formatting will not be applied to the table.
     * @param {boolean} isVerBand - Specifies that the vertical banding conditional formatting will not be applied to the table.
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
     * @param {ApiTableCell} [oCell] - The cell after which the new row will be added. If not specified the new row will
     * be added at the end of the table.
     * @param {boolean} [isBefore=false] - Add a new row before or after the specified cell. If no cell is specified then
     * this parameter will be ignored.
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

        this.Table.RemoveSelection();
        this.Table.CurCell = _oCell;
        this.Table.AddTableRow(_isBefore);

        private_EndSilentMode();
        return new ApiTableRow(this.Table.Content[nRowIndex]);
    };
    /**
     * Add a new column to the current table.
     * @param {ApiTableCell} [oCell] - The cell after which the new column will be added. If not specified the new column will be added at the end of the table.
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

        this.Table.RemoveSelection();
        this.Table.CurCell = _oCell;
        this.Table.AddTableColumn(_isBefore);

        private_EndSilentMode();
    };
    /**
     * Remove the table row with a specified cell.
     * @param {ApiTableCell} oCell - The cell which is present in the row that will be removed.
     * @returns {boolean} Is the table empty after removing.
     */
    ApiTable.prototype.RemoveRow = function(oCell)
    {
        if (!(oCell instanceof ApiTableCell) || this.Table !== oCell.Cell.Row.Table)
            return false;

        private_StartSilentMode();
        this.private_PrepareTableForActions();

        this.Table.RemoveSelection();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.RemoveTableRow());

        private_EndSilentMode();
        return isEmpty;
    };
    /**
     * Remove the table column with a specified cell.
     * @param {ApiTableCell} oCell - The cell which is present in the column that will be removed.
     * @returns {boolean} Is the table empty after removing.
     */
    ApiTable.prototype.RemoveColumn = function(oCell)
    {
        if (!(oCell instanceof ApiTableCell) || this.Table !== oCell.Cell.Row.Table)
            return false;

        private_StartSilentMode();
        this.private_PrepareTableForActions();

        this.Table.RemoveSelection();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.RemoveTableColumn());

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
     * Get the cell by its position.
     * @param {number} nPos - The cell position in the current table.
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
     * @param {string} sStyleName - The name which will be used for the current style.
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
     * @returns {?ApiTablePr} If the type of this style is not a <code>"table"</code> then it will return
     *     <code>null</code>.
     */
    ApiStyle.prototype.GetTablePr = function()
    {
        if (styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTablePr(this, this.Style.TablePr.Copy());
    };
    /**
     * Get the table row properties of the current style.
     * @returns {?ApiTableRowPr} If the type of this style is not a <code>"table"</code> then it will return
     *     <code>null</code>.
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
     * Specify the reference to the parent style which this style inherits from in the style hierarchy.
     * @param {ApiStyle} oStyle - The parent style which the style inherits properties from.
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
     * @param {TableStyleOverrideType} [sType="wholeTable"] - The part of the table which the formatting properties must be applied to.
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
     * The text style base method.
     * <note>This method is not used by itself, as it only forms the basis for the ApiRun.SetStyle method which sets
     * the selected or created style for the text.</note>
     * @param {ApiStyle} oStyle - The style which must be applied to the text character.
     */
    ApiTextPr.prototype.SetStyle = function(oStyle)
    {
        if (!(oStyle instanceof ApiStyle))
            return;

        this.TextPr.RStyle = oStyle.Style.Get_Id();
        this.private_OnChange();
    };
    /**
     * Set the bold property to the text character.
     * @param {boolean} isBold - Specifies that the contents of this run are displayed bold.
     */
    ApiTextPr.prototype.SetBold = function(isBold)
    {
        this.TextPr.Bold = isBold;
        this.private_OnChange();
    };
    /**
     * Set the italic property to the text character.
     * @param {boolean} isItalic - Specifies that the contents of the current run are displayed italicized.
     */
    ApiTextPr.prototype.SetItalic = function(isItalic)
    {
        this.TextPr.Italic = isItalic;
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run are displayed with a single horizontal line through the center of the line.
     * @param {boolean} isStrikeout - Specifies that the contents of the current run are displayed struck through.
     */
    ApiTextPr.prototype.SetStrikeout = function(isStrikeout)
    {
        this.TextPr.Strikeout = isStrikeout;
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run are displayed along with a line appearing directly below the character
     * (less than all the spacing above and below the characters on the line).
     * @param {boolean} isUnderline - Specifies that the contents of the current run are displayed underlined.
     */
    ApiTextPr.prototype.SetUnderline = function(isUnderline)
    {
        this.TextPr.Underline = isUnderline;
        this.private_OnChange();
    };
    /**
     * Set all 4 font slots with the specified font family.
     * @param {string} sFontFamily - The font family or families used for the current text run.
     */
    ApiTextPr.prototype.SetFontFamily = function(sFontFamily)
    {
        this.TextPr.RFonts.Set_All(sFontFamily, -1);
        this.private_OnChange();
    };
    /**
     * Set the font size for the characters of the current text run.
     * @param {hps} nSize - The text size value measured in half-points (1/144 of an inch).
     */
    ApiTextPr.prototype.SetFontSize = function(nSize)
    {
        this.TextPr.FontSize = private_GetHps(nSize);
        this.private_OnChange();
    };
    /**
     * Set the text color for the current text run in the RGB format.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @param {boolean} [isAuto=false] - If this parameter is set to "true", then r,g,b parameters will be ignored.
     */
    ApiTextPr.prototype.SetColor = function(r, g, b, isAuto)
    {
        this.TextPr.Color = private_GetColor(r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specify the alignment which will be applied to the contents of this run in relation to the default appearance of the run text:
     * * <b>"baseline"</b> - the characters in the current text run will be aligned by the default text baseline.
     * * <b>"subscript"</b> - the characters in the current text run will be aligned below the default text baseline.
     * * <b>"superscript"</b> - the characters in the current text run will be aligned above the default text baseline.
     * @param {("baseline" | "subscript" | "superscript")} sType - The vertical alignment type applied to the text contents.
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
     * Specify a highlighting color in the RGB format which is applied as a background for the contents of the current run.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @param {boolean} [isNone=false] If this parameter is set to "true", then r,g,b parameters will be ignored.
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
     * Set text spacing measured in twentieths of a point.
     * @param {twips} nSpacing - The value of the text spacing measured in twentieths of a point (1/1440 of an inch).
     */
    ApiTextPr.prototype.SetSpacing = function(nSpacing)
    {
        this.TextPr.Spacing = private_Twips2MM(nSpacing);
        this.private_OnChange();
    };
    /**
     * Specify that the contents of this run is displayed with two horizontal lines through each character displayed on the line.
     * @param {boolean} isDoubleStrikeout - Specifies that the contents of the current run are displayed double struck through.
     */
    ApiTextPr.prototype.SetDoubleStrikeout = function(isDoubleStrikeout)
    {
        this.TextPr.DStrikeout = isDoubleStrikeout;
        this.private_OnChange();
    };
    /**
     * Specify that any lowercase characters in this text run are formatted for display only as their capital letter character equivalents.
     * @param {boolean} isCaps - Specifies that the contents of the current run are displayed capitalized.
     */
    ApiTextPr.prototype.SetCaps = function(isCaps)
    {
        this.TextPr.Caps = isCaps;
        this.private_OnChange();
    };
    /**
     * Specify that all small letter characters in this text run are formatted for display only as their capital
     * letter character equivalents in a font size two points smaller than the actual font size specified for this text.
     * @param {boolean} isSmallCaps - Specifies that the contents of the current run are displayed capitalized two points smaller.
     */
    ApiTextPr.prototype.SetSmallCaps = function(isSmallCaps)
    {
        this.TextPr.SmallCaps = isSmallCaps;
        this.private_OnChange();
    };
    /**
     * Specify the amount by which text is raised or lowered for this run in relation to the default
     * baseline of the surrounding non-positioned text.
     * @param {hps} nPosition - Specifies a positive (raised text) or negative (lowered text)
     * measurement in half-points (1/144 of an inch).
     */
    ApiTextPr.prototype.SetPosition = function(nPosition)
    {
        this.TextPr.Position = private_PtToMM(private_GetHps(nPosition));
        this.private_OnChange();
    };
    /**
     * Specify the languages which will be used to check spelling and grammar (if requested) when processing
     * the contents of this text run.
     * @param {string} sLangId - The possible value for this parameter is a language identifier as defined by
     * RFC 4646/BCP 47. Example: "en-CA".
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
     * Specify the shading applied to the contents of the current text run.
     * @param {ShdType} sType - The shading type applied to the contents of the current text run.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTextPr.prototype.SetShd = function(sType, r, g, b)
    {
        this.TextPr.Shd = private_GetShd(sType, r, g, b, false);
        this.private_OnChange();
    };


    /**
     * Set fill of run
     * @param {ApiFill} oApiFill
     */
    ApiTextPr.prototype.SetFill = function(oApiFill)
    {
        this.TextPr.Unifill = oApiFill.UniFill;
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
     * The paragraph style base method.
     * <note>This method is not used by itself, as it only forms the basis for the {@link ApiParagraph#SetStyle} method which sets the selected or created style for the paragraph.</note>
     * @param {ApiStyle} oStyle - The style of the paragraph to be set.
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
     * @param {boolean} isContextualSpacing - The true value will enable the paragraph contextual spacing.
     */
    ApiParaPr.prototype.SetContextualSpacing = function(isContextualSpacing)
    {
        this.ParaPr.ContextualSpacing = private_GetBoolean(isContextualSpacing);
        this.private_OnChange();
    };
    /**
     * Set the paragraph left side indentation.
     * @param {twips} nValue - The paragraph left side indentation value measured in twentieths of a point (1/1440 of an inch).
     */
    ApiParaPr.prototype.SetIndLeft = function(nValue)
    {
        this.ParaPr.Ind.Left = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set the paragraph right side indentation.
     * @param {twips} nValue - The paragraph right side indentation value measured in twentieths of a point (1/1440 of an inch).
     */
    ApiParaPr.prototype.SetIndRight = function(nValue)
    {
        this.ParaPr.Ind.Right = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set the paragraph first line indentation.
     * @param {twips} nValue - The paragraph first line indentation value measured in twentieths of a point (1/1440 of an inch).
     */
    ApiParaPr.prototype.SetIndFirstLine = function(nValue)
    {
        this.ParaPr.Ind.FirstLine = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set paragraph contents justification.
     * @param {("left" | "right" | "both" | "center")} sJc - The parameters will define the justification type that
     * will be applied to the paragraph contents.
     */
    ApiParaPr.prototype.SetJc = function(sJc)
    {
        this.ParaPr.Jc = private_GetParaAlign(sJc);
        this.private_OnChange();
    };
    /**
     * Specify that when rendering this document using a page view, all lines of this paragraph are maintained on a single page whenever possible.
     * @param {boolean} isKeepLines - The true value will enable the option to keep lines of the paragraph on a single page.
     */
    ApiParaPr.prototype.SetKeepLines = function(isKeepLines)
    {
        this.ParaPr.KeepLines = isKeepLines;
        this.private_OnChange();
    };
    /**
     * Specify that when rendering this document using a paginated view, the contents of this paragraph are at least
     * partly rendered on the same page as the following paragraph whenever possible.
     * @param {boolean} isKeepNext - The true value will enable the option to keep lines of the paragraph on the same
     * page as the following paragraph.
     */
    ApiParaPr.prototype.SetKeepNext = function(isKeepNext)
    {
        this.ParaPr.KeepNext = isKeepNext;
        this.private_OnChange();
    };
    /**
     * Specify that when rendering this document using a paginated view, the contents of this paragraph are rendered at
     * the beginning of a new page in the document.
     * @param {boolean} isPageBreakBefore - The true value will enable the option to render the contents of the paragraph
     * at the beginning of the a new page in the document.
     */
    ApiParaPr.prototype.SetPageBreakBefore = function(isPageBreakBefore)
    {
        this.ParaPr.PageBreakBefore = isPageBreakBefore;
        this.private_OnChange();
    };
    /**
     * Set paragraph line spacing. If the value of the <code>sLineRule</code> parameter is either
     * <code>"atLeast"</code>
     * or <code>"exact"</code>, then the value of <code>nLine</code> shall be interpreted as twentieths of a point. If
     * the value of the <code>sLineRule</code> parameter is <code>"auto"</code>, then the value of the
     * <code>nLine</code> attribute shall be interpreted as 240ths of a line.
     * @param {(twips | line240)} nLine - The line spacing value measured either in twentieths of a point (1/1440 of an inch) or in 240ths of a line.
     * @param {("auto" | "atLeast" | "exact")} sLineRule - The rule that determines the measuring units of the nLine parameter.
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
     * any value of the <code>nBefore</code> is ignored. If <code>isBeforeAuto</code> parameter is not specified, then
     * it will be interpreted as <code>false</code>.
     * @param {twips} nBefore - The value of the spacing before the current paragraph measured in twentieths of a point (1/1440 of an inch).
     * @param {boolean} [isBeforeAuto=false] - The true value will disable the nBefore parameter.
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
     * @param {twips} nAfter - The value of the spacing after the current paragraph measured in twentieths of a point (1/1440 of an inch).
     * @param {boolean} [isAfterAuto=false] - The true value will disable the nAfter parameter.
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
     * Specify the shading applied to the contents of the paragraph.
     * @param {ShdType} sType - The shading type which will be applied to the contents of the current paragraph.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @param {boolean} [isAuto=false] - The true value will disable paragraph contents shading.
     */
    ApiParaPr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.ParaPr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed below a set of paragraphs which have the same paragraph border settings.
     * <note>The paragraphs of the same style going one by one are considered as a single block, so the border is added
     * to the whole block rather than to every paragraph in this block.</note>
     * @param {BorderType} sType - The border style.
     * @param {pt_8} nSize - The width of the current bottom border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset below the paragraph measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiParaPr.prototype.SetBottomBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed at the left side of the page around the specified paragraph.
     * @param {BorderType} sType - The style of border.
     * @param {pt_8} nSize - The width of the current left border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset to the left of the paragraph measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiParaPr.prototype.SetLeftBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed at the right side of the page around the specified paragraph.
     * @param {BorderType} sType - The border style.
     * @param {pt_8} nSize - The width of the current right border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset to the right of the paragraph measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiParaPr.prototype.SetRightBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed above a set of paragraphs which have the same set of paragraph border settings.
     * <note>The paragraphs of the same style going one by one are considered as a single block, so the border is added to the whole block rather than to every paragraph in this block.</note>
     * @param {BorderType} sType - The border style.
     * @param {pt_8} nSize - The width of the current top border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset above the paragraph measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiParaPr.prototype.SetTopBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed between each paragraph in a set of paragraphs which have the same set of paragraph border settings.
     * @param {BorderType} sType - The border style.
     * @param {pt_8} nSize - The width of the current border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset between the paragraphs measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiParaPr.prototype.SetBetweenBorder = function(sType, nSize, nSpace, r, g, b)
    {
        this.ParaPr.Brd.Between = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify whether a single line of this paragraph will be prevented from being displayed on a separate page from the remaining content at display time by moving the line onto the following page.
     * @param {boolean} isWidowControl - The true value will enable the SetWidowControl method use.
     */
    ApiParaPr.prototype.SetWidowControl = function(isWidowControl)
    {
        this.ParaPr.WidowControl = isWidowControl;
        this.private_OnChange();
    };
    /**
     * Specifies a sequence of custom tab stops which shall be used for any tab characters in the current paragraph.
     * <b>Warning</b>: The lengths of aPos array and aVal array <b>MUST BE</b> equal.
     * @param {twips[]} aPos - An array of the positions of custom tab stops with respect to the current page margins measured in twentieths of a point (1/1440 of an inch).
     * @param {TabJc[]} aVal - An array of the styles of custom tab stops, which determines the behavior of the tab stop and the alignment which will be applied to text entered at the current custom tab stop.
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
     * Specify that the current paragraph references a numbering definition instance in the current document.
     * @param {ApiNumbering} oNumPr - Specifies a numbering definition.
     * @param {number} [nLvl=0] - Specifies a numbering level reference. If the current instance of the ApiParaPr class is direct
     * formatting of a paragraph, then this parameter MUST BE specified. Otherwise if the current instance of the ApiParaPr class
     * is the part of ApiStyle properties, this parameter will be ignored.
     */
    ApiParaPr.prototype.SetNumPr = function(oNumPr, nLvl)
    {
        if (!(oNumPr instanceof ApiNumbering))
            return;

        this.ParaPr.NumPr       = new CNumPr();
        this.ParaPr.NumPr.NumId = oNumPr.Num.GetId();
        this.ParaPr.NumPr.Lvl   = undefined;

        if (this.Parent instanceof ApiParagraph)
        {
            this.ParaPr.NumPr.Lvl = Math.min(8, Math.max(0, (nLvl ? nLvl : 0)));
        }
        this.private_OnChange();
    };


    /**
    * Specifies paragraph bullet
    * @param {?ApiBullet} oBullet
    * */
    ApiParaPr.prototype.SetBullet = function(oBullet){
        if(oBullet){
            this.ParaPr.Bullet = oBullet.Bullet;
        }
        else{
            this.ParaPr.Bullet = null;
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
     * @param {number} nLevel - The numbering level index. This value MUST BE from 0 to 8.
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
     * Get the numbering definition.
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
     * Specify the text properties which will be applied to the text in the current numbering level itself, not to the text in the subsequent paragraph.
     * <note>To change the text style for the paragraph, a style must be applied to it using the ApiRun.SetStyle method.</note>
     * @returns {ApiTextPr}
     */
    ApiNumberingLevel.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.Num.GetLvl(this.Lvl).TextPr.Copy());
    };
    /**
     * The paragraph properties which are applied to any numbered paragraph that references the given numbering definition and numbering level.
     * @returns {ApiParaPr}
     */
    ApiNumberingLevel.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Num.GetLvl(this.Lvl).ParaPr.Copy());
    };
    /**
     * Set one of the existing predefined numbering templates.
     * @param {("none" | "bullet" | "1)" | "1." | "I." | "A." | "a)" | "a." | "i." )} sType - Set one of the existing predefined numbering templates.
     * @param {string} [sSymbol=""] - The symbol used for the list numbering. This parameter have a meaning only if the sType="bullet" property is selected.
     */
    ApiNumberingLevel.prototype.SetTemplateType = function(sType, sSymbol)
    {
        switch (sType)
        {
            case "none"  :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.None);
                break;
            case "bullet":
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.Bullet, sSymbol, new CTextPr());
                break;
            case "1)"    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.DecimalBracket_Right);
                break;
            case "1."    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.DecimalDot_Right);
                break;
            case "I."    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.UpperRomanDot_Right);
                break;
            case "A."    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.UpperLetterDot_Left);
                break;
            case "a)"    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.LowerLetterBracket_Left);
                break;
            case "a."    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.LowerLetterDot_Left);
                break;
            case "i."    :
                this.Num.SetLvlByType(this.Lvl, c_oAscNumberingLevel.LowerRomanDot_Right);
                break;
        }
    };
    /**
     * Set your own customized numbering type.
     * @param {("none" | "bullet" | "decimal" | "lowerRoman" | "upperRoman" | "lowerLetter" | "upperLetter" |
     *     "decimalZero")} sType - The custom numbering type used for the current numbering definition.
     * @param {string} sTextFormatString - Any text in this parameter will be taken as literal text to be repeated in each instance of this numbering level, except for any use of the percent symbol (%) followed by a number, which will be used to indicate the one-based index of the number to be used at this level. Any number of a level higher than this level will be ignored.
     * higher than this level shall be ignored.
     * @param {("left" | "right" | "center")} sAlign - Type of justification applied to the text run in the current numbering level.
     */
    ApiNumberingLevel.prototype.SetCustomType = function(sType, sTextFormatString, sAlign)
    {
        var nType = Asc.c_oAscNumberingFormat.None;
        if ("none" === sType)
            nType = Asc.c_oAscNumberingFormat.None;
        else if ("bullet" === sType)
            nType = Asc.c_oAscNumberingFormat.Bullet;
        else if ("decimal" === sType)
            nType = Asc.c_oAscNumberingFormat.Decimal;
        else if ("lowerRoman" === sType)
            nType = Asc.c_oAscNumberingFormat.LowerRoman;
        else if ("upperRoman" === sType)
            nType = Asc.c_oAscNumberingFormat.UpperRoman;
        else if ("lowerLetter" === sType)
            nType = Asc.c_oAscNumberingFormat.LowerLetter;
        else if ("upperLetter" === sType)
            nType = Asc.c_oAscNumberingFormat.UpperLetter;
        else if ("decimalZero" === sType)
            nType = Asc.c_oAscNumberingFormat.DecimalZero;

        var nAlign = align_Left;
        if ("left" === sAlign)
            nAlign = align_Left;
        else if ("right" === sAlign)
            nAlign = align_Right;
        else if ("center" === sAlign)
            nAlign = align_Center;

        this.Num.SetLvlByFormat(this.Lvl, nType, sTextFormatString, nAlign);
    };
    /**
     * Specify a one-based index which determines when a numbering level should restart to its starting value. A numbering level restarts when an instance of the specified numbering level, which will be higher (earlier than the this level) is used in the given document contents. By default this value is true.
     * @param {boolean} isRestart - The true value will enable the SetRestart method use.
     */
    ApiNumberingLevel.prototype.SetRestart = function(isRestart)
    {
        this.Num.SetLvlRestart(this.Lvl, private_GetBoolean(isRestart, true));
    };
    /**
     * Specify the starting value for the numbering used by the parent numbering level within a given numbering level definition. By default this value is 1.
     * @param {number} nStart -
     */
    ApiNumberingLevel.prototype.SetStart = function(nStart)
    {
        this.Num.SetLvlStart(this.Lvl, private_GetInt(nStart));
    };
    /**
     * Specify the content which will be added between a given numbering level text and the text of every numbered paragraph which references that numbering level. By default this value is "tab".
     * @param {("space" | "tab" | "none")} sType - The content added between the numbering level text and the text in the numbered paragraph.
     */
    ApiNumberingLevel.prototype.SetSuff = function(sType)
    {
        if ("space" === sType)
            this.Num.SetLvlSuff(this.Lvl, c_oAscNumberingSuff.Space);
        else if ("tab" === sType)
            this.Num.SetLvlSuff(this.Lvl, c_oAscNumberingSuff.Tab);
        else if ("none" === sType)
            this.Num.SetLvlSuff(this.Lvl, c_oAscNumberingSuff.None);
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
     * Specify the number of columns which will comprise each table column band for this table style.
     * @param {number} nCount - The number of columns measured in positive integers.
     */
    ApiTablePr.prototype.SetStyleColBandSize = function(nCount)
    {
        this.TablePr.TableStyleColBandSize = private_GetInt(nCount, 1, null);
        this.private_OnChange();
    };
    /**
     * Specify the number of rows which will comprise each table row band for this table style.
     * @param {number} nCount - The number of rows measured in positive integers.
     */
    ApiTablePr.prototype.SetStyleRowBandSize = function(nCount)
    {
        this.TablePr.TableStyleRowBandSize = private_GetInt(nCount, 1, null);
        this.private_OnChange();
    };
    /**
     * Specify the alignment of the current table with respect to the text margins in the current section.
     * @param {("left" | "right" | "center")} sJcType - The alignment type used for the current table placement.
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
     * Specify the shading which is applied to the extents of the current table.
     * @param {ShdType} sType - The shading type applied to the extents of the current table.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @param {boolean} [isAuto=false] - The true value will disable the SetShd method use.
     */
    ApiTablePr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.TablePr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed at the top of the current table.
     * @param {BorderType} sType - The top border style.
     * @param {pt_8} nSize - The width of the current top border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the top part of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderTop = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed at the bottom of the current table.
     * @param {BorderType} sType - The bottom border style.
     * @param {pt_8} nSize - The width of the current bottom border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the bottom part of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderBottom = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed on the left of the current table.
     * @param {BorderType} sType - The left border style.
     * @param {pt_8} nSize - The width of the current left border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the left part of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderLeft = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed on the right of the current table.
     * @param {BorderType} sType - The right border style.
     * @param {pt_8} nSize - The width of the current right border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the right part of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderRight = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed on all horizontal table cell borders which are not on an outmost edge
     * of the parent table (all horizontal borders which are not the topmost or bottommost border).
     * @param {BorderType} sType - The horizontal table cell border style.
     * @param {pt_8} nSize - The width of the current border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the horizontal table cells of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderInsideH = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.InsideH = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Specify the border which will be displayed on all vertical table cell borders which are not on an outmost edge
     * of the parent table (all vertical borders which are not the leftmost or rightmost border).
     * @param {BorderType} sType - The vertical table cell border style.
     * @param {pt_8} nSize - The width of the current border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the vertical table cells of the table measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTablePr.prototype.SetTableBorderInsideV = function(sType, nSize, nSpace, r, g, b)
    {
        this.TablePr.TableBorders.InsideV = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };

    /**
     * Specify the amount of space which will be left between the bottom extent of the cell contents and the border
     * of all table cells within the parent table (or table row).
     * @param {twips} nValue - The value for the amount of space below the bottom extent of the cell measured in
     * twentieths of a point (1/1440 of an inch).
     */
    ApiTablePr.prototype.SetTableCellMarginBottom = function(nValue)
    {
        this.TablePr.TableCellMar.Bottom = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specify the amount of space which will be present between the left extent of the cell contents and the left
     * border of all table cells within the parent table (or table row).
     * @param {twips} nValue - The value for the amount of space to the left extent of the cell measured in twentieths of a point (1/1440 of an inch).
     */
    ApiTablePr.prototype.SetTableCellMarginLeft = function(nValue)
    {
        this.TablePr.TableCellMar.Left = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specify the amount of space which will be present between the right extent of the cell contents and the right
     * border of all table cells within the parent table (or table row).
     * @param {twips} nValue - The value for the amount of space to the right extent of the cell measured in twentieths of a point (1/1440 of an inch).
     */
    ApiTablePr.prototype.SetTableCellMarginRight = function(nValue)
    {
        this.TablePr.TableCellMar.Right = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specify the amount of space which will be present between the top extent of the cell contents and the top border
     * of all table cells within the parent table (or table row).
     * @param {twips} nValue - The value for the amount of space above the top extent of the cell measured in twentieths of a point (1/1440 of an inch).
     */
    ApiTablePr.prototype.SetTableCellMarginTop = function(nValue)
    {
        this.TablePr.TableCellMar.Top = private_GetTableMeasure("twips", nValue);
        this.private_OnChange();
    };
    /**
     * Specify the default table cell spacing (the spacing between adjacent cells and the edges of the table).
     * @param {?twips} nValue - Spacing value measured in twentieths of a point (1/1440 of an inch). <code>"Null"</code> means no spacing will be applied.
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
     * Specify the indentation which will be added before the leading edge of the current table in the document
     * (the left edge in a left-to-right table, and the right edge in a right-to-left table).
     * @param {twips} nValue - The indentation value measured in twentieths of a point (1/1440 of an inch).
     */
    ApiTablePr.prototype.SetTableInd = function(nValue)
    {
        this.TablePr.TableInd = private_Twips2MM(nValue);
        this.private_OnChange();
    };
    /**
     * Set the preferred width for this table.
     * <note>Tables are created with the ApiTable.SetWidth method properties set by default, which always override the {@link ApiTablePr#SetWidth} method properties. That is why there is no use to try and apply ApiTablePr.SetWidth, we recommend that you use the  {@link ApiTablePr#SetWidth}  method instead.</node>
     * @param {TableWidth} sType - Type of the width value from one of the available width values types.
     * @param {number} [nValue] - The table width value measured in positive integers.
     */
    ApiTablePr.prototype.SetWidth = function(sType, nValue)
    {
        this.TablePr.TableW = private_GetTableMeasure(sType, nValue);
        this.private_OnChange();
    };
    /**
     * Specify the algorithm which will be used to lay out the contents of this table within the document.
     * @param {("autofit" | "fixed")} sType - The type of the table layout in the document.
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
     * @param {("auto" | "atLeast")} sHRule - The rule to either apply or ignore the height value to the current table row. Use the <code>"atLeast"</code> value to enable the <code>SetHeight</code> method use.
     * @param {twips} [nValue] - The height for the current table row measured in twentieths of a point (1/1440 of an inch). This value will be ignored if <code>sHRule="auto"<code>.
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
     * Specify that all the current table rows will be styled as its header row.
     * @param {boolean} isHeader - The true value will enable the SetTableHeader method use.
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
     * Specify the shading applied to the contents of the table cell.
     * @param {ShdType} sType - The shading type which will be applied to the contents of the current table cell.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     * @param {boolean} [isAuto=false] - The true value will disable table cell contents shading.
     */
    ApiTableCellPr.prototype.SetShd = function(sType, r, g, b, isAuto)
    {
        this.CellPr.Shd = private_GetShd(sType, r, g, b, isAuto);
        this.private_OnChange();
    };
    /**
     * Specify the amount of space which will be left between the bottom extent of the cell contents and the border
     * of a specific table cell within a table.
     * @param {?twips} nValue - The value for the amount of space below the bottom extent of the cell measured in twentieths
     * of a point (1/1440 of an inch). If this value is <code>null</code>, then default table cell bottom margin will be used, otherwise
     * the table cell bottom margin will be overridden with the specified value for the current cell.
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
     * Specifies the amount of space which shall be left between the right extent of the current cell contents and the
     * right edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - The value for the amount of space to the left extent of the cell measured in twentieths
     * of a point (1/1440 of an inch). If this value is <code>null<c/ode>, then default table cell left margin will be used, otherwise
     * the table cell left margin will be overridden with the specified value for the current cell.
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
     * Specify the amount of space which will be left between the right extent of the cell contents and the border of a specific table cell within a table.
     * @param {?twips} nValue - The value for the amount of space to the right extent of the cell measured in twentieths
     * of a point (1/1440 of an inch). If this value is <code>null</code>, then default table cell right margin will be used, otherwise
     * the table cell right margin will be overridden with the specified value for the current cell.
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
     * Specify the amount of space which will be left between the upper extent of the cell contents
     * and the border of a specific table cell within a table.
     * @param {?twips} nValue - The value for the amount of space above the upper extent of the cell measured in twentieths
     * of a point (1/1440 of an inch). If this value is <code>null</code>, then default table cell top margin will be used, otherwise
     * the table cell top margin will be overridden with the specified value for the current cell.
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
     * Set the border which will be displayed at the bottom of the current table cell.
     * @param {BorderType} sType - The cell bottom border style.
     * @param {pt_8} nSize - The width of the current cell bottom border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the bottom part of the table cell measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTableCellPr.prototype.SetCellBorderBottom = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Bottom = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed to the left of the current table cell.
     * @param {BorderType} sType - The cell left border style.
     * @param {pt_8} nSize - The width of the current cell left border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the left part of the table cell measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTableCellPr.prototype.SetCellBorderLeft = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Left = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed to the right of the current table cell.
     * @param {BorderType} sType - The cell right border style.
     * @param {pt_8} nSize - The width of the current cell right border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the right part of the table cell measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTableCellPr.prototype.SetCellBorderRight = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Right = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the border which will be displayed at the top of the current table cell.
     * @param {BorderType} sType - The cell top border style.
     * @param {pt_8} nSize - The width of the current cell top border measured in eighths of a point.
     * @param {pt} nSpace - The spacing offset in the top part of the table cell measured in points used to place this border.
     * @param {byte} r - Red color component value.
     * @param {byte} g - Green color component value.
     * @param {byte} b - Blue color component value.
     */
    ApiTableCellPr.prototype.SetCellBorderTop = function(sType, nSize, nSpace, r, g, b)
    {
        this.CellPr.TableCellBorders.Top = private_GetTableBorder(sType, nSize, nSpace, r, g, b);
        this.private_OnChange();
    };
    /**
     * Set the preferred width for the current table cell.
     * @param {TableWidth} sType - Type of the width value from one of the available width values types.
     * @param {number} [nValue] - The table cell width value measured in positive integers.
     */
    ApiTableCellPr.prototype.SetWidth = function(sType, nValue)
    {
        this.CellPr.TableCellW = private_GetTableMeasure(sType, nValue);
        this.private_OnChange();
    };
    /**
     * Specify the vertical alignment for text contents within the current table cell.
     * @param {("top" | "center" | "bottom")} sType - The available types of the vertical alignment for the text contents of the current table cell.
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
     * @param {("lrtb" | "tbrl" | "btlr")} sType - The available types of the text direction in the table cell: <code>"lrtb"</code>
     * - text direction left-to-right moving from top to bottom, <code>"tbrl"</code> - text direction top-to-bottom moving from right
     * to left, <code>"btlr"</code> - text direction bottom-to-top moving from left to right.
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
     * Specify how this table cell is laid out when the parent table is displayed in a document. This setting
     * only affects the behavior of the cell when the {@link ApiTablePr#SetTableLayout} table layout for this table is set to use the <code>"autofit"</code> algorithm.
     * @param {boolean} isNoWrap - The true value will enable the <code>SetNoWrap</code> method use.
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
     * Get the type of the current table conditional style.
     * @returns {TableStyleOverrideType}
     */
    ApiTableStylePr.prototype.GetType = function()
    {
        return this.Type;
    };
    /**
     Get the set of the text run properties which will be applied to all the text runs within the table which match the conditional formatting type.
     * @returns {ApiTextPr}
     */
    ApiTableStylePr.prototype.GetTextPr = function()
    {
        return new ApiTextPr(this, this.TableStylePr.TextPr);
    };
    /**
     * Get the set of the paragraph properties which will be applied to all the paragraphs within a table which match the conditional formatting type.
     * @returns {ApiParaPr}
     */
    ApiTableStylePr.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.TableStylePr.ParaPr);
    };
    /**
     * Get the set of the table properties which will be applied to all the regions within a table which match the conditional formatting type.
     * @returns {ApiTablePr}
     */
    ApiTableStylePr.prototype.GetTablePr = function()
    {
        return new ApiTablePr(this, this.TableStylePr.TablePr);
    };
    /**
     * Get the set of the table row properties which will be applied to all the rows within a table which match the conditional formatting type.
     * @returns {ApiTableRowPr}
     */
    ApiTableStylePr.prototype.GetTableRowPr = function()
    {
        return new ApiTableRowPr(this, this.TableStylePr.TableRowPr);
    };
    /**
     * Get the set of the table cell properties which will be applied to all the cells within a table which match the conditional formatting type.
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
     * Get the type of the class based on this base class.
     * @returns {"drawing"}
     */
    ApiDrawing.prototype.GetClassType = function()
    {
        return "drawing";
    };
    /**
     * Set the size of the object (image, shape, chart) bounding box.
     * @param {EMU} nWidth - The object width measured in English measure units.
     * @param {EMU} nHeight - The object height measured in English measure units.
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
     * Set the wrapping type of this object (image, shape, chart). One of the following wrapping style types can be set:
     * * <b>"inline"</b> - the object is considered to be a part of the text, like a character, so when the text moves, the object moves as well. In this case the positioning options are inaccessible.
     * If one of the following styles is selected, the object can be moved independently of the text and positioned on the page exactly:
     * * <b>"square"</b> - the text wraps the rectangular box that bounds the object.
     * * <b>"tight"</b> - the text wraps the actual object edges.
     * * <b>"through"</b> - the text wraps around the object edges and fills in the open white space within the object.
     * * <b>"topAndBottom"</b> - the text is only above and below the object.
     * * <b>"behind"</b> - the text overlaps the object.
     * * <b>"inFront"</b> - the object overlaps the text.
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
     * Specify how the floating object will be horizontally aligned.
     * @param {RelFromH} [sRelativeFrom="page"] - The document element which will be taken as a countdown point for the object horizontal alignment.
     * @param {("left" | "right" | "center")} [sAlign="left"] - The alingment type which will be used for the object horizontal alignment.
     */
    ApiDrawing.prototype.SetHorAlign = function(sRelativeFrom, sAlign)
    {
        var nAlign        = private_GetAlignH(sAlign);
        var nRelativeFrom = private_GetRelativeFromH(sRelativeFrom);
        this.Drawing.Set_PositionH(nRelativeFrom, true, nAlign, false);
    };
    /**
     * Specify how the floating object will be vertically aligned.
     * @param {RelFromV} [sRelativeFrom="page"] - The document element which will be taken as a countdown point for the object vertical alignment.
     * @param {("top" | "bottom" | "center")} [sAlign="top"] - The alingment type which will be used for the object vertical alignment.
     */
    ApiDrawing.prototype.SetVerAlign = function(sRelativeFrom, sAlign)
    {
        var nAlign        = private_GetAlignV(sAlign);
        var nRelativeFrom = private_GetRelativeFromV(sRelativeFrom);
        this.Drawing.Set_PositionV(nRelativeFrom, true, nAlign, false);
    };
    /**
     * Set an absolute measurement for the horizontal positioning of the floating object.
     * @param {RelFromH} sRelativeFrom - The document element which will be taken as a countdown point for the object horizontal alignment.
     * @param {EMU} nDistance - The distance from the right side of the document element to the floating object measured in English measure units.
     */
    ApiDrawing.prototype.SetHorPosition = function(sRelativeFrom, nDistance)
    {
        var nValue        = private_EMU2MM(nDistance);
        var nRelativeFrom = private_GetRelativeFromH(sRelativeFrom);
        this.Drawing.Set_PositionH(nRelativeFrom, false, nValue, false);
    };
    /**
     * Set an absolute measurement for the vertical positioning of the floating object.
     * @param {RelFromH} sRelativeFrom - The document element which will be taken as a countdown point for the object vertical alignment.
     * @param {EMU} nDistance - The distance from the bottom part of the document element to the floating object measured in English measure units.
     */
    ApiDrawing.prototype.SetVerPosition = function(sRelativeFrom, nDistance)
    {
        var nValue        = private_EMU2MM(nDistance);
        var nRelativeFrom = private_GetRelativeFromV(sRelativeFrom);
        this.Drawing.Set_PositionV(nRelativeFrom, false, nValue, false);
    };
    /**
     * Specify the minimum distance which will be maintained between the edges of this drawing object and any
     * subsequent text.
     * @param {EMU} nLeft - The distance from the left side of the current object and the subsequent text run measured in English measure units.
     * @param {EMU} nTop - The distance from the top side of the current object and the preceding text run measured in English measure units.
     * @param {EMU} nRight - The distance from the right side of the current object and the subsequent text run measured in English measure units.
     * @param {EMU} nBottom - The distance from the bottom side of the current object and the subsequent text run measured in English measure units.
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
     * Get the shape inner contents where a paragraph or text runs can be inserted.
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
     * Set the vertical alignment for the shape content where a paragraph or text runs can be inserted.
     * @param {VerticalTextAlign} VerticalAlign - The type of the vertical alignment for the shape inner contents.
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




    /**
     * Set text paddings
     * @param {?EMU} nLeft
     * @param {?EMU} nTop
     * @param {?EMU} nRight
     * @param {?EMU} nBottom
     */
    ApiShape.prototype.SetPaddings = function(nLeft, nTop, nRight, nBottom)
    {
        if(this.Shape)
        {
            this.Shape.setPaddings({
                Left: AscFormat.isRealNumber(nLeft) ? private_EMU2MM(nLeft) : null,
                Top: AscFormat.isRealNumber(nTop) ? private_EMU2MM(nTop) : null,
                Right: AscFormat.isRealNumber(nRight) ? private_EMU2MM(nRight) : null,
                Bottom: AscFormat.isRealNumber(nBottom) ? private_EMU2MM(nBottom) : null
            });
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


    ApiChart.prototype.CreateTitle = function(sTitle, nFontSize){
        if(!this.Chart)
        {
            return null;
        }
        if(typeof sTitle === "string" && sTitle.length > 0){
            var oTitle = new AscFormat.CTitle();
            oTitle.setOverlay(false);
            oTitle.setTx(new AscFormat.CChartText());
            var oTextBody = AscFormat.CreateTextBodyFromString(sTitle, this.Chart.getDrawingDocument(), oTitle.tx);
            if(AscFormat.isRealNumber(nFontSize)){
                oTextBody.content.Set_ApplyToAll(true);
                oTextBody.content.AddToParagraph(new ParaTextPr({ FontSize : nFontSize}));
                oTextBody.content.Set_ApplyToAll(false);
            }
            oTitle.tx.setRich(oTextBody);
            return oTitle;
        }
        return null;
    };


    /**
     *  Specifies a chart title
     *  @param {string} sTitle - The title which will be displayed for the current chart.
     *  @param {hps} nFontSize - The text size value measured in points.
     *  @param {?bool} bIsBold
     */
    ApiChart.prototype.SetTitle = function (sTitle, nFontSize, bIsBold)
    {
        AscFormat.builder_SetChartTitle(this.Chart, sTitle, nFontSize, bIsBold);
    };

    /**
     *  Specifies a horizontal axis title
     *  @param {string} sTitle - The title which will be displayed for the horizontal axis of the current chart.
     *  @param {hps} nFontSize - The text size value measured in points.
     *  @param {?bool} bIsBold
     * */
    ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize, bIsBold)
    {
        AscFormat.builder_SetChartHorAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
    };

    /**
     *  Specifies a vertical axis title
     *  @param {string} sTitle - The title which will be displayed for the vertical axis of the current chart.
     *  @param {hps} nFontSize - The text size value measured in points.
     *  @param {?bool} bIsBold
     * */
    ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize, bIsBold)
    {
        AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
    };

    /**
     * Specifies a  vertical axis orientation
     * @param {bool} bIsMinMax
     * */
    ApiChart.prototype.SetVerAxisOrientation = function(bIsMinMax){
        AscFormat.builder_SetChartVertAxisOrientation(this.Chart, bIsMinMax);
    };

    /**
     * Specifies a  horizontal axis orientation
     * @param {bool} bIsMinMax
     * */
    ApiChart.prototype.SetHorAxisOrientation = function(bIsMinMax){
        AscFormat.builder_SetChartHorAxisOrientation(this.Chart, bIsMinMax);
    };

    /**
     * Specifies a legend position
     * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos - The position of the chart legend inside the chart window.
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
     * Specifies a legend position
     * @number nFontSize
     * */
    ApiChart.prototype.SetLegendFontSize = function(nFontSize)
    {
        AscFormat.builder_SetLegendFontSize(this.Chart, nFontSize);
    };

    /**
     * Specifies which chart data labels are shown for the chart.
     * @param {boolean} bShowSerName - Whether to show or hide the source table column names used for the data which the chart will be build from.
     * @param {boolean} bShowCatName - Whether to show or hide the source table row names used for the data which the chart will be build from.
     * @param {boolean} bShowVal - Whether to show or hide the chart data values.
     * @param {boolean} bShowPercent - Whether to show or hide the percent for the data values (works with stacked chart types).
     * */
    ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal, bShowPercent)
    {
        AscFormat.builder_SetShowDataLabels(this.Chart, bShowSerName, bShowCatName, bShowVal, bShowPercent);
    };


    /**
     * Spicifies a show options for data labels
     * @param {number} nSeriesIndex
     * @param {number} nPointIndex
     * @param {boolean} bShowSerName
     * @param {boolean} bShowCatName
     * @param {boolean} bShowVal
     * @param {boolean} bShowPercent
     * */
    ApiChart.prototype.SetShowPointDataLabel = function(nSeriesIndex, nPointIndex, bShowSerName, bShowCatName, bShowVal, bShowPercent)
    {
        AscFormat.builder_SetShowPointDataLabel(this.Chart, nSeriesIndex, nPointIndex, bShowSerName, bShowCatName, bShowVal, bShowPercent);
    };

    /**
     * Spicifies tick labels position vertical axis
     * @param {TickLabelPosition} sTickLabelPosition
     * */
    ApiChart.prototype.SetVertAxisTickLabelPosition = function(sTickLabelPosition)
    {
        AscFormat.builder_SetChartVertAxisTickLablePosition(this.Chart, sTickLabelPosition);
    };
    /**
     * Spicifies tick labels position horizontal axis
     * @param {TickLabelPosition} sTickLabelPosition
     * */
    ApiChart.prototype.SetHorAxisTickLabelPosition = function(sTickLabelPosition)
    {
        AscFormat.builder_SetChartHorAxisTickLablePosition(this.Chart, sTickLabelPosition);
    };


    /**
     * Specifies major tick mark for horizontal axis
     * @param {TickMark} sTickMark
     * */

    ApiChart.prototype.SetHorAxisMajorTickMark = function(sTickMark){
        AscFormat.builder_SetChartHorAxisMajorTickMark(this.Chart, sTickMark);
    };
    /**
     * Specifies minor tick mark for horizontal axis
     * @param {TickMark} sTickMark
     * */

    ApiChart.prototype.SetHorAxisMinorTickMark = function(sTickMark){
        AscFormat.builder_SetChartHorAxisMinorTickMark(this.Chart, sTickMark);
    };

    /**
     * Specifies major tick mark for vertical axis
     * @param {TickMark} sTickMark
     * */

    ApiChart.prototype.SetVertAxisMajorTickMark = function(sTickMark){
        AscFormat.builder_SetChartVerAxisMajorTickMark(this.Chart, sTickMark);
    };

    /**
     * Specifies minor tick mark for vertical axis
     * @param {TickMark} sTickMark
     * */
    ApiChart.prototype.SetVertAxisMinorTickMark = function(sTickMark){
        AscFormat.builder_SetChartVerAxisMinorTickMark(this.Chart, sTickMark);
    };



    /**
     * Specifies major vertical gridline's visual properties
     * @param {?ApiStroke} oStroke
     * */
    ApiChart.prototype.SetMajorVerticalGridlines = function(oStroke)
    {
        AscFormat.builder_SetVerAxisMajorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };

    /**
     * Specifies minor vertical gridline's visual properties
     * @param {?ApiStroke} oStroke
     * */
    ApiChart.prototype.SetMinorVerticalGridlines = function(oStroke)
    {
        AscFormat.builder_SetVerAxisMinorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };


    /**
     * Specifies major horizontal gridline's visual properties
     * @param {?ApiStroke} oStroke
     * */
    ApiChart.prototype.SetMajorHorizontalGridlines = function(oStroke)
    {
        AscFormat.builder_SetHorAxisMajorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };

    /**
     * Specifies minor vertical gridline's visual properties
     * @param {?ApiStroke} oStroke
     * */
    ApiChart.prototype.SetMinorHorizontalGridlines = function(oStroke)
    {
        AscFormat.builder_SetHorAxisMinorGridlines(this.Chart, oStroke ?  oStroke.Ln : null);
    };


    /**
     * Specifies font size for labels of horizontal axis
     * @param {number} nFontSize
     */
    ApiChart.prototype.SetHorAxisLablesFontSize = function(nFontSize){
        AscFormat.builder_SetHorAxisFontSize(this.Chart, nFontSize);
    };

    /**
     * Specifies font size for labels of vertical axis
     * @param {number} nFontSize
     */
    ApiChart.prototype.SetVertAxisLablesFontSize = function(nFontSize){
        AscFormat.builder_SetVerAxisFontSize(this.Chart, nFontSize);
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
     * Get the type of the class based on this base class.
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

    /**
     * Get the type of this class.
     * @returns {"bullet"}
     */
    ApiBullet.prototype.GetClassType = function()
    {
        return "bullet";
    };

	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiInlineLvlSdt
	//
	//------------------------------------------------------------------------------------------------------------------
	/**
	 * Get the type of this class.
	 * @returns {"inlineLvlSdt"}
	 */
	ApiInlineLvlSdt.prototype.GetClassType = function()
	{
		return "inlineLvlSdt";
	};
	/**
	 * Set the lock type of this container
	 * @param {SdtLock} sLockType
	 */
	ApiInlineLvlSdt.prototype.SetLock = function(sLockType)
	{
		var nLock = sdtlock_Unlocked;
		if ("contentLocked" === sLockType)
			nLock = sdtlock_ContentLocked;
		else if ("sdtContentLocked" === sLockType)
			nLock = sdtlock_SdtContentLocked;
		else if ("sdtLocked" === sLockType)
			nLock = sdtlock_SdtLocked;

		this.Sdt.SetContentControlLock(nLock);
	};
	/**
	 * Get the lock type of this container
	 * @returns {SdtLock}
	 */
	ApiInlineLvlSdt.prototype.GetLock = function()
	{
		var nLock = this.Sdt.GetContentControlLock();

		var sResult = "unlocked";

		if (sdtlock_ContentLocked === nLock)
			sResult = "contentLocked";
		else if (sdtlock_SdtContentLocked === nLock)
			sResult = "sdtContentLocked";
		else if (sdtlock_SdtLocked === nLock)
			sResult = "sdtLocked";

		return sResult;
	};
	/**
	 * Set the tag attribute for this container
	 * @param {string} sTag
	 */
	ApiInlineLvlSdt.prototype.SetTag = function(sTag)
	{
		this.Sdt.SetTag(sTag);
	};
	/**
	 * Get the tag attribute for this container
	 * @returns {string}
	 */
	ApiInlineLvlSdt.prototype.GetTag = function()
	{
		return this.Sdt.GetTag();
	};
	/**
	 * Set the label attribute for this container
	 * @param {string} sLabel
	 */
	ApiInlineLvlSdt.prototype.SetLabel = function(sLabel)
	{
		this.Sdt.SetLabel(sLabel);
	};
	/**
	 * Get the label attribute for this container
	 * @returns {string}
	 */
	ApiInlineLvlSdt.prototype.GetLabel = function()
	{
		return this.Sdt.GetLabel();
	};
	/**
	 * Set the alias attribute for this container
	 * @param {string} sAlias
	 */
	ApiInlineLvlSdt.prototype.SetAlias = function(sAlias)
	{
		this.Sdt.SetAlias(sAlias);
	};
	/**
	 * Get the alias attribute for this container
	 * @returns {string}
	 */
	ApiInlineLvlSdt.prototype.GetAlias = function()
	{
		return this.Sdt.GetAlias();
	};
	/**
	 * Get the number of elements in the current container.
	 * @returns {number}
	 */
	ApiInlineLvlSdt.prototype.GetElementsCount = function()
	{
		return this.Sdt.Content.length;
	};
	/**
	 * Get the element of the container content by specified position.
	 * @param {number} nPos
	 * @returns {?ParagraphContent}
	 */
	ApiInlineLvlSdt.prototype.GetElement = function(nPos)
	{
		if (nPos < 0 || nPos >= this.Sdt.Content.length)
			return null;

		return private_GetSupportedParaElement(this.Sdt.Content[nPos]);
	};
	/**
	 * Remove element by specified position.
	 * @param {number} nPos
	 */
	ApiInlineLvlSdt.prototype.RemoveElement = function(nPos)
	{
		if (nPos < 0 || nPos >= this.Sdt.Content.length)
			return;

		this.Sdt.Remove_FromContent(nPos, 1);
	};
	/**
	 * Remove all elements.
	 */
	ApiInlineLvlSdt.prototype.RemoveAllElements = function()
	{
		if (this.Sdt.Content.length > 0)
			this.Sdt.Remove_FromContent(0, this.Sdt.Content.length);
	};
	/**
	 * Add an element to inline container.
	 * @param {ParagraphContent} oElement
	 * @param {number} [nPos] If this value is not specified then element will be added to the end of this container.
	 * @returns {boolean} Returns <code>false</code> if the type of <code>oElement</code> is not supported.
	 * content.
	 */
	ApiInlineLvlSdt.prototype.AddElement = function(oElement, nPos)
	{
		if (!private_IsSupportedParaElement(oElement) || nPos < 0 || nPos > this.Sdt.Content.length)
			return false;

		var oParaElement = oElement.private_GetImpl();
		if (undefined !== nPos)
		{
			this.Sdt.Add_ToContent(nPos, oParaElement);
		}
		else
		{
			private_PushElementToParagraph(this.Sdt, oParaElement);
		}

		return true;
	};

	//------------------------------------------------------------------------------------------------------------------
	//
	// ApiBlockLvlSdt
	//
	//------------------------------------------------------------------------------------------------------------------
	/**
	 * Get the type of this class.
	 * @returns {"blockLvlSdt"}
	 */
	ApiBlockLvlSdt.prototype.GetClassType = function()
	{
		return "blockLvlSdt";
	};
	/**
	 * Set the lock type of this container
	 * @param {SdtLock} sLockType
	 */
	ApiBlockLvlSdt.prototype.SetLock = function(sLockType)
	{
		var nLock = sdtlock_Unlocked;
		if ("contentLocked" === sLockType)
			nLock = sdtlock_ContentLocked;
		else if ("sdtContentLocked" === sLockType)
			nLock = sdtlock_SdtContentLocked;
		else if ("sdtLocked" === sLockType)
			nLock = sdtlock_SdtLocked;

		this.Sdt.SetContentControlLock(nLock);
	};
	/**
	 * Get the lock type of this container
	 * @returns {SdtLock}
	 */
	ApiBlockLvlSdt.prototype.GetLock = function()
	{
		var nLock = this.Sdt.GetContentControlLock();

		var sResult = "unlocked";

		if (sdtlock_ContentLocked === nLock)
			sResult = "contentLocked";
		else if (sdtlock_SdtContentLocked === nLock)
			sResult = "sdtContentLocked";
		else if (sdtlock_SdtLocked === nLock)
			sResult = "sdtLocked";

		return sResult;
	};
	/**
	 * Set the tag attribute for this container
	 * @param {string} sTag
	 */
	ApiBlockLvlSdt.prototype.SetTag = function(sTag)
	{
		this.Sdt.SetTag(sTag);
	};
	/**
	 * Get the tag attribute for this container
	 * @returns {string}
	 */
	ApiBlockLvlSdt.prototype.GetTag = function()
	{
		return this.Sdt.GetTag();
	};
	/**
	 * Set the label attribute for this container
	 * @param {string} sLabel
	 */
	ApiBlockLvlSdt.prototype.SetLabel = function(sLabel)
	{
		this.Sdt.SetLabel(sLabel);
	};
	/**
	 * Get the label attribute for this container
	 * @returns {string}
	 */
	ApiBlockLvlSdt.prototype.GetLabel = function()
	{
		return this.Sdt.GetLabel();
	};
	/**
	 * Set the alias attribute for this container
	 * @param {string} sAlias
	 */
	ApiBlockLvlSdt.prototype.SetAlias = function(sAlias)
	{
		this.Sdt.SetAlias(sAlias);
	};
	/**
	 * Get the alias attribute for this container
	 * @returns {string}
	 */
	ApiBlockLvlSdt.prototype.GetAlias = function()
	{
		return this.Sdt.GetAlias();
	};
	/**
	 * Get the content of this container
	 * @returns {ApiDocumentContent}
	 */
	ApiBlockLvlSdt.prototype.GetContent = function()
	{
		return new ApiDocumentContent(this.Sdt.GetContent());
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
    Api.prototype["CreateBullet"]                    = Api.prototype.CreateBullet;
    Api.prototype["CreateNumbering"]                 = Api.prototype.CreateNumbering;
	Api.prototype["CreateInlineLvlSdt"]              = Api.prototype.CreateInlineLvlSdt;
	Api.prototype["CreateBlockLvlSdt"]               = Api.prototype.CreateBlockLvlSdt;

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
	ApiDocument.prototype["GetCommentsReport"]       = ApiDocument.prototype.GetCommentsReport;
	ApiDocument.prototype["GetReviewReport"]         = ApiDocument.prototype.GetReviewReport;
	ApiDocument.prototype["InsertWatermark"]         = ApiDocument.prototype.InsertWatermark;
	ApiDocument.prototype["SearchAndReplace"]        = ApiDocument.prototype.SearchAndReplace;
	ApiDocument.prototype["GetAllContentControls"]   = ApiDocument.prototype.GetAllContentControls;

    ApiParagraph.prototype["GetClassType"]           = ApiParagraph.prototype.GetClassType;
    ApiParagraph.prototype["AddText"]                = ApiParagraph.prototype.AddText;
    ApiParagraph.prototype["AddPageBreak"]           = ApiParagraph.prototype.AddPageBreak;
    ApiParagraph.prototype["AddLineBreak"]           = ApiParagraph.prototype.AddLineBreak;
    ApiParagraph.prototype["AddColumnBreak"]         = ApiParagraph.prototype.AddColumnBreak;
	ApiParagraph.prototype["AddPageNumber"]          = ApiParagraph.prototype.AddPageNumber;
	ApiParagraph.prototype["AddPagesCount"]          = ApiParagraph.prototype.AddPagesCount;
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
    ApiParagraph.prototype["AddInlineLvlSdt"]        = ApiParagraph.prototype.AddInlineLvlSdt;

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
    ApiTextPr.prototype["SetFill"]                   = ApiTextPr.prototype.SetFill;

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
    ApiParaPr.prototype["SetBullet"]                 = ApiParaPr.prototype.SetBullet;

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
    ApiTableStylePr.prototype["GetType"]             = ApiTableStylePr.prototype.GetType;
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
    ApiShape.prototype["SetPaddings"]                = ApiShape.prototype.SetPaddings;

    ApiChart.prototype["GetClassType"]                 = ApiChart.prototype.GetClassType;
    ApiChart.prototype["SetTitle"]                     = ApiChart.prototype.SetTitle;
    ApiChart.prototype["SetHorAxisTitle"]              = ApiChart.prototype.SetHorAxisTitle;
    ApiChart.prototype["SetVerAxisTitle"]              = ApiChart.prototype.SetVerAxisTitle;
    ApiChart.prototype["SetVerAxisOrientation"]        = ApiChart.prototype.SetVerAxisOrientation;
    ApiChart.prototype["SetHorAxisOrientation"]        = ApiChart.prototype.SetHorAxisOrientation;
    ApiChart.prototype["SetLegendPos"]                 = ApiChart.prototype.SetLegendPos;
    ApiChart.prototype["SetLegendFontSize"]            = ApiChart.prototype.SetLegendFontSize;
    ApiChart.prototype["SetShowDataLabels"]            = ApiChart.prototype.SetShowDataLabels;
    ApiChart.prototype["SetShowPointDataLabel"]        = ApiChart.prototype.SetShowPointDataLabel;
    ApiChart.prototype["SetVertAxisTickLabelPosition"] = ApiChart.prototype.SetVertAxisTickLabelPosition;
    ApiChart.prototype["SetHorAxisTickLabelPosition"]  = ApiChart.prototype.SetHorAxisTickLabelPosition;

    ApiChart.prototype["SetHorAxisMajorTickMark"]  =  ApiChart.prototype.SetHorAxisMajorTickMark;
    ApiChart.prototype["SetHorAxisMinorTickMark"]  =  ApiChart.prototype.SetHorAxisMinorTickMark;
    ApiChart.prototype["SetVertAxisMajorTickMark"]  =  ApiChart.prototype.SetVertAxisMajorTickMark;
    ApiChart.prototype["SetVertAxisMinorTickMark"]  =  ApiChart.prototype.SetVertAxisMinorTickMark;
    ApiChart.prototype["SetMajorVerticalGridlines"]  =  ApiChart.prototype.SetMajorVerticalGridlines;
    ApiChart.prototype["SetMinorVerticalGridlines"]  =  ApiChart.prototype.SetMinorVerticalGridlines;
    ApiChart.prototype["SetMajorHorizontalGridlines"]  =  ApiChart.prototype.SetMajorHorizontalGridlines;
    ApiChart.prototype["SetMinorHorizontalGridlines"]  =  ApiChart.prototype.SetMinorHorizontalGridlines;
    ApiChart.prototype["SetHorAxisLablesFontSize"]  =  ApiChart.prototype.SetHorAxisLablesFontSize;
    ApiChart.prototype["SetVertAxisLablesFontSize"]  =  ApiChart.prototype.SetVertAxisLablesFontSize;

    ApiFill.prototype["GetClassType"]                = ApiFill.prototype.GetClassType;

    ApiStroke.prototype["GetClassType"]              = ApiStroke.prototype.GetClassType;

    ApiGradientStop.prototype["GetClassType"]        = ApiGradientStop.prototype.GetClassType;

    ApiUniColor.prototype["GetClassType"]            = ApiUniColor.prototype.GetClassType;

    ApiRGBColor.prototype["GetClassType"]            = ApiRGBColor.prototype.GetClassType;

    ApiSchemeColor.prototype["GetClassType"]         = ApiSchemeColor.prototype.GetClassType;

    ApiPresetColor.prototype["GetClassType"]         = ApiPresetColor.prototype.GetClassType;

    ApiBullet.prototype["GetClassType"]              = ApiBullet.prototype.GetClassType;

	ApiInlineLvlSdt.prototype["GetClassType"]      = ApiInlineLvlSdt.prototype.GetClassType;
	ApiInlineLvlSdt.prototype["SetLock"]           = ApiInlineLvlSdt.prototype.SetLock;
	ApiInlineLvlSdt.prototype["GetLock"]           = ApiInlineLvlSdt.prototype.GetLock;
	ApiInlineLvlSdt.prototype["SetTag"]            = ApiInlineLvlSdt.prototype.SetTag;
	ApiInlineLvlSdt.prototype["GetTag"]            = ApiInlineLvlSdt.prototype.GetTag;
	ApiInlineLvlSdt.prototype["SetLabel"]          = ApiInlineLvlSdt.prototype.SetLabel;
	ApiInlineLvlSdt.prototype["GetLabel"]          = ApiInlineLvlSdt.prototype.GetLabel;
	ApiInlineLvlSdt.prototype["SetAlias"]          = ApiInlineLvlSdt.prototype.SetAlias;
	ApiInlineLvlSdt.prototype["GetAlias"]          = ApiInlineLvlSdt.prototype.GetAlias;
	ApiInlineLvlSdt.prototype["GetElementsCount"]  = ApiInlineLvlSdt.prototype.GetElementsCount;
	ApiInlineLvlSdt.prototype["GetElement"]        = ApiInlineLvlSdt.prototype.GetElement;
	ApiInlineLvlSdt.prototype["RemoveElement"]     = ApiInlineLvlSdt.prototype.RemoveElement;
	ApiInlineLvlSdt.prototype["RemoveAllElements"] = ApiInlineLvlSdt.prototype.RemoveAllElements;
	ApiInlineLvlSdt.prototype["AddElement"]        = ApiInlineLvlSdt.prototype.AddElement;


	ApiBlockLvlSdt.prototype["GetClassType"] = ApiBlockLvlSdt.prototype.GetClassType;
	ApiBlockLvlSdt.prototype["SetLock"]      = ApiBlockLvlSdt.prototype.SetLock;
	ApiBlockLvlSdt.prototype["GetLock"]      = ApiBlockLvlSdt.prototype.GetLock;
	ApiBlockLvlSdt.prototype["SetTag"]       = ApiBlockLvlSdt.prototype.SetTag;
	ApiBlockLvlSdt.prototype["GetTag"]       = ApiBlockLvlSdt.prototype.GetTag;
	ApiBlockLvlSdt.prototype["SetLabel"]     = ApiBlockLvlSdt.prototype.SetLabel;
	ApiBlockLvlSdt.prototype["GetLabel"]     = ApiBlockLvlSdt.prototype.GetLabel;
	ApiBlockLvlSdt.prototype["SetAlias"]     = ApiBlockLvlSdt.prototype.SetAlias;
	ApiBlockLvlSdt.prototype["GetAlias"]     = ApiBlockLvlSdt.prototype.GetAlias;
	ApiBlockLvlSdt.prototype["GetContent"]   = ApiBlockLvlSdt.prototype.GetContent;

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

    function private_IsSupportedParaElement(oElement)
	{
		if (oElement instanceof ApiRun
			|| oElement instanceof ApiInlineLvlSdt)
			return true;

		return false;
	}

	function private_GetSupportedParaElement(oElement)
	{
		if (oElement instanceof ParaRun)
			return new ApiRun(oElement);
		else if (oElement instanceof CInlineLevelSdt)
			return new ApiInlineLvlSdt(oElement);
		else
			return new ApiUnsupported();
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

    function private_CreateWatermark(sText, bDiagonal){
        var sText2 = ((typeof (sText) === "string") && (sText.length > 0)) ? sText : "WATERMARK";
        var sFontName2 = undefined;
        var nFontSize2 = 2;
        var oTextFill2 = AscFormat.CreateUnfilFromRGB(127, 127, 127);
        oTextFill2.transparent = 127;

        var MainLogicDocument = (editor && editor.WordControl && editor.WordControl.m_oLogicDocument ? editor && editor.WordControl && editor.WordControl.m_oLogicDocument : null);
        var TrackRevisions = (MainLogicDocument ? MainLogicDocument.Is_TrackRevisions() : false);

        if (MainLogicDocument && true === TrackRevisions)
            MainLogicDocument.Set_TrackRevisions(false);

        var oShape = new AscFormat.CShape();
        oShape.setWordShape(true);
        oShape.setBDeleted(false);
        oShape.createTextBoxContent();
        var oSpPr = new AscFormat.CSpPr();
        var oXfrm = new AscFormat.CXfrm();
        oXfrm.setOffX(0);
        oXfrm.setOffY(0);


        var fHeight = 45;
        var fWidth;
        if(bDiagonal !== false){
            fWidth = 175;
            oXfrm.setRot(7*Math.PI/4);
        }
        else{
            fWidth = 165;
        }

        oXfrm.setExtX(fWidth);
        oXfrm.setExtY(fHeight);
        oSpPr.setXfrm(oXfrm);
        oXfrm.setParent(oSpPr);
        oSpPr.setFill(AscFormat.CreateNoFillUniFill());
        oSpPr.setLn(AscFormat.CreateNoFillLine());
        oSpPr.setGeometry(AscFormat.CreateGeometry("rect"));
        oShape.setSpPr(oSpPr);
        oSpPr.setParent(oShape);
        var oContent = oShape.getDocContent();
        AscFormat.AddToContentFromString(oContent, sText2);
        var oTextPr = new CTextPr();
        oTextPr.FontSize = nFontSize2;
        oTextPr.RFonts.Ascii = sFontName2;
        oTextPr.TextFill = oTextFill2;
        oContent.Set_ApplyToAll(true);
        oContent.AddToParagraph(new ParaTextPr(oTextPr));
        oContent.SetParagraphAlign(AscCommon.align_Center);
        oContent.Set_ApplyToAll(false);
        var oBodyPr = oShape.getBodyPr().createDuplicate();
        oBodyPr.rot = 0;
        oBodyPr.spcFirstLastPara = false;
        oBodyPr.vertOverflow = AscFormat.nOTOwerflow;
        oBodyPr.horzOverflow = AscFormat.nOTOwerflow;
        oBodyPr.vert = AscFormat.nVertTThorz;
        oBodyPr.lIns = 2.54;
        oBodyPr.tIns = 1.27;
        oBodyPr.rIns = 2.54;
        oBodyPr.bIns = 1.27;
        oBodyPr.numCol = 1;
        oBodyPr.spcCol = 0;
        oBodyPr.rtlCol = 0;
        oBodyPr.fromWordArt = false;
        oBodyPr.anchor = 4;
        oBodyPr.anchorCtr = false;
        oBodyPr.forceAA = false;
        oBodyPr.compatLnSpc = true;
        oBodyPr.prstTxWarp = AscFormat.ExecuteNoHistory(function(){return AscFormat.CreatePrstTxWarpGeometry("textPlain");}, this, []);
        oShape.setBodyPr(oBodyPr);
        
        var oLogicDocument = private_GetLogicDocument();
        var oDrawingDocuemnt = private_GetDrawingDocument();
        var oDrawing = new ParaDrawing(fWidth, fHeight, null, oDrawingDocuemnt, oLogicDocument, null);
        oShape.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oShape);
        var oApiShape = new ApiShape(oShape);
        oApiShape.SetWrappingStyle("inFront");
        oApiShape.SetHorAlign("margin", "center");
        oApiShape.SetVerAlign("margin", "center");
        return oApiShape;
    }


    function privateInsertWatermarkToContent(oApi, oContent, sText, bIsDiagonal){
        if(oContent){
            var nElementsCount = oContent.GetElementsCount();
            for(var i = 0; i < nElementsCount; ++i){
                var oElement = oContent.GetElement(i);
                if(oElement.GetClassType() === "paragraph"){
                    oElement.AddDrawing(private_CreateWatermark(sText, bIsDiagonal));
                    break;
                }
            }
            if(i === nElementsCount){
                oElement = oApi.CreateParagraph();
                oElement.AddDrawing(private_CreateWatermark(sText, bIsDiagonal));
                oContent.Push(oElement);
            }
        }
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
        this.Num.SetTextPr(this.Lvl, oApiTextPr.TextPr);
        oApiTextPr.TextPr = this.Num.GetLvl(this.Lvl).GetTextPr().Copy();
    };
    ApiNumberingLevel.prototype.OnChangeParaPr = function(oApiParaPr)
    {
        this.Num.SetParaPr(this.Lvl, oApiParaPr.ParaPr);
        oApiParaPr.ParaPr = this.Num.GetLvl(this.Lvl).GetParaPr().Copy();
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
    ApiInlineLvlSdt.prototype.private_GetImpl = function()
	{
		return this.Sdt;
	};
    ApiBlockLvlSdt.prototype.private_GetImpl = function()
	{
		return this.Sdt;
	};

    Api.prototype.private_CreateApiParagraph = function(oParagraph){
        return new ApiParagraph(oParagraph);
    };

    Api.prototype.private_CreateApiDocContent = function(oDocContent){
        return new ApiDocumentContent(oDocContent);
    };
}(window, null));