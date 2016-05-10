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
     * */
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
     * */
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
        oUniColor.setColor(new CSchemeColor());
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
        oUniColor.setColor(new CPrstColor());
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
        return new ApiSchemeColor(SchemeColorId);
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
        oUniFill.lin = new AscFormat.GradLin();
        oUniFill.lin.angle = Angle*60000;
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
            oUniFill.fill.Gs.push(aGradientStop[i].Gs);
        }
        oUniFill.path = new AscFormat.GradPath();
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
        var oLn = new CLn();
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
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 2)
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
        if (nPos < 0 || nPos >= this.Paragraph.Content.length - 2)
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
        this.Drawing.setExtent(private_EMU2MM(nWidth), private_EMU2MM(nHeight));
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
     * Set the line width color of shape
     * @returns {ApiDocumentContent}
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


function TEST_BUILDER()
{
    var oLD = editor.WordControl.m_oLogicDocument;
    oLD.Create_NewHistoryPoint();
    //------------------------------------------------------------------------------------------------------------------

    // Воссоздаем документ DemoHyden

    var Api = editor;

    var oParagraph, oRun, oDrawing, oParaMark;
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
    var oTextPr, oParaPr, oTablePr;

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

    var oNormalTableStyle = oDocument.GetDefaultStyle("table");
    oTablePr = oNormalTableStyle.GetTablePr();
    oTablePr.SetTableInd(0);
    oTablePr.SetTableCellMarginTop(0);
    oTablePr.SetTableCellMarginLeft(108);
    oTablePr.SetTableCellMarginRight(108);
    oTablePr.SetTableCellMarginBottom(0);

    var oTableGridStyle = oDocument.CreateStyle("TableGrid", "table");
    oTableGridStyle.SetBasedOn(oNormalTableStyle);
    oParaPr = oTableGridStyle.GetParaPr();
    oParaPr.SetSpacingAfter(0);
    oParaPr.SetSpacingLine("auto", 240);
    oTablePr = oTableGridStyle.GetTablePr();
    oTablePr.SetTableInd(0);
    oTablePr.SetTableBorderTop("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableBorderLeft("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableBorderRight("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableBorderBottom("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableBorderInsideH("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableBorderInsideV("single", 4, 0, 0, 0, 0);
    oTablePr.SetTableCellMarginTop(0);
    oTablePr.SetTableCellMarginLeft(108);
    oTablePr.SetTableCellMarginBottom(0);
    oTablePr.SetTableCellMarginRight(108);

    var oFooterStyle = oDocument.CreateStyle("Footer", "paragraph");
    oParaPr = oFooterStyle.GetParaPr();
    oParaPr.SetTabs([4680, 9360], ["center", "right"]);
    oParaPr.SetSpacingAfter(0);
    oParaPr.SetJc("left");
    oTextPr = oFooterStyle.GetTextPr();
    oTextPr.SetColor(0, 0, 0, true);
    oTextPr.SetFontSize(22);

    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingLine(276, "auto");
    oParagraph.SetJc("left");
    oParaMark = oParagraph.GetParagraphMarkTextPr();
    oParaMark.SetFontSize(52);
    oParaMark.SetColor(0x14, 0x14, 0x14, false);
    oParaMark.SetSpacing(5);
    oParagraph.AddPageBreak();
    var oFill = Api.CreateSolidFill(Api.CreateRGBColor(38, 38, 38));
    var oStroke = Api.CreateStroke(0, Api.CreateNoFill());
    oDrawing = Api.CreateShape("rect",5363210, 9655810, oFill, oStroke);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 155575);
    oDrawing.SetVerPosition("page", 201295);

    var oDocContent = oDrawing.GetDocContent();
    oDocContent.RemoveAllElements();
    var oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    var oRun2 = oParagraph2.AddText("HAYDEN MANAGEMENT");
    oRun2.SetFontSize(64);
    oRun2.SetColor(255, 255, 255);
    oRun2.SetFontFamily("Calibri Light");
    oParagraph2.SetBottomBorder("single", 1, 0, 255, 104, 0);
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oRun2 = oParagraph2.AddText("Product Launch Revenue Plan");
    oRun2.SetFontSize(44);
    oRun2.SetColor(255, 255, 255);
    oRun2.SetFontFamily("Calibri Light");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oRun2 = oParagraph2.AddText("Confidential");
    oRun2.SetFontSize(28);
    oRun2.SetColor(255, 255, 255);
    oRun2.SetFontFamily("Calibri Light");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oRun2 = oParagraph2.AddText("May 2013");
    oRun2.SetFontSize(28);
    oRun2.SetColor(255, 255, 255);
    oRun2.SetFontFamily("Calibri Light");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("right");
    oDocContent.Push(oParagraph2);

    oFill = Api.CreateSolidFill(Api.CreateRGBColor(255, 104, 0));
    oStroke = Api.CreateStroke(0, Api.CreateNoFill());
    oDrawing = Api.CreateShape("rect", 1880870, 9655810, oFill, oStroke);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 5673725);
    oDrawing.SetVerPosition("page", 201295);
    oParagraph.AddDrawing(oDrawing);
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oNoSpacingStyle);

    var oGs1 = Api.CreateGradientStop(Api.CreateRGBColor(255, 224, 204), 0);
    var oGs2 = Api.CreateGradientStop(Api.CreateRGBColor(255, 164, 101), 100000);
    oFill = Api.CreateLinearGradientFill([oGs1, oGs2], 5400000);
    oStroke = Api.CreateStroke(0, Api.CreateNoFill());
    oDrawing = Api.CreateShape("rect", 5930900, 395605, oFill, oStroke);
    oDrawing.SetWrappingStyle("topAndBottom");
    oDrawing.SetHorAlign("margin", "left");
    oDrawing.SetVerPosition("paragraph", 5715);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oDocContent = oDrawing.GetDocContent();
    oDocContent.RemoveAllElements();
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("Product Launch Revenue Plan");
    oRun2.SetFontSize(44);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri Light");
    oDocContent.Push(oParagraph2);

    oParagraph.AddDrawing(oDrawing);

    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    oDrawing = Api.CreateImage("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA3ADcAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAEMAKADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwC+Fzxxxnt61IjbpCowQxKvx0wKvGxdzhGjGNpJZsfh+lW7fSZnlVQ6OqsS4EhJx6dK9S6WrOWzZmxgykxRfOCdxAB69Cen1qcRFRsVWLugAG33B/pWo+mrabLaBTJMOisM54/pn0qpPaR28Z3uxMluZFbYTtIf27YHX3oU02FioYGTczKC/m4ZdoPSqcrrAzOrIAV5yoGOc80XuqLEsxXdK4dpGaP5cLgZOGx0JqKG2u55Qk8MyrFcIu53TLAjrx1HI9/yrdKyuzNu7sipc3TyE+UsTod0ikBeecEZ/KsS8MrgRQKkjxMEcbgPL3+v1rtrzRmc/Z4rK5mka0l2TSBTtckYJwQOMDpzWtJoaG1nKWzqsnksFMaN8wIJ46nt19PQU1XjG39dROk3c8leOSGUGQANGwGPoelJtmLF2yASTke/WvWr7R4ZBI84lfazbF8pB8voOM44rEuvDccxkdVdNoyBxhTznpWsMXF76GcqDWx5+N5+QAFO9Up5gDtjkjbafm/eAFfc9a6OfTZ7thb2EE05aUweZbtHw4XftO88HaCenb6Zqt4b1GK3tJ5NPvViuY+ZkhRgvIyXx90nI6/lmuiFSJm6bsYglMjlQ8eQ4OBL2x9KfHDIIcM5+Ufe3H1revvC8+kXEzXCKokzh+cMQOMYB7H/ABrMvY2ZpUgBZCMAgYycehq41IytyvQmUWtGUmlj3bC/DMuNrDPNO5SRhLwNzbfmHIpHgdowHRiVKnaduAfak8uTJJVuWJwSPSr06EEbyKc/vMMUyAQRge9GQCy9cSAnk9xTlt3lQHG6LbsZlbODRMcYyyqoIIJbGfrTEQB0bA3KQGYAknp9aVzgOwZcBlJ+bp0pPMyHAK53nGZQCPcVIEcCRlYfcjYZkGMZ9T/nmh7/ANdxpH0VHZ+ehUqSrdML6c4qw0ahNqoScAZz+dPinDnakirk5IjZsNkD1qeMKFYg78x5PPQ5r5VyZ7diEWghj3FiJ1I+ZGxwR2NYWp6e0kqrGZGaUGNpASwjyCcnnv8A1rqpyyl8NljtIcN7VTXTUMpcx5aRvMUrjlgKcJ8upMo30OR03w8ZNOhN5b27XA3iQSQ7s8kcHPGce+a2U0ZFdmVIt5A4KcKFGOPwrf8As4QBlU5Cqw6AHnFO2HchEZViZQcAHPH61UsRJu4lTSRmpaIgCgJhQOAQOvWrcUEYwz9GJBwR26fzpyq5R5AFAUKSvlKM5qZ9yERFGXMjEZiDA/SsnNlJFK5gjwrSAbgAy55wCcVj31vFMbm0imaN2ich/KLjPQMAeDj+7W1MzMieU8hJTynGzGOelRRWYi+QeZvVgnK56/U1cZ23YnEw4vD9nBLA/wDZ2mtM037ySOxCkqV5J5Jz7+/57Vjo9vbI/lW1lEXH7ww24jD/AF5571oRW4h81WX5ghPzfzqYKWRlYDAC5wuDyKcq0no2Cglqc7qWnLNuhW2hFuHUOphPIPUqR35rCPgy2t2WOf7M0sjN5WYemRngEntW74q1qXQltFttOmu5poriUhE3bFjjJDMD2DMn59zgVNNLZat9glLBvNbdH5cpjIBjLZGMHpjp61pDEzjsyJUovdHCL4de90uee4sbT7UvlMI0snjbB4OdxHIORkdh78Mn8FR77hUxsjl+bKn5lKg7Rz7j9a7ywso5YPJmkaZnAVpPMc7hkkdauXMQSyiIHyurDpkjB6571r9bmnZP+tCHQi9zxC8062tpZkihZRG42bs5ZcdDjjis6exud7Om18Mp8rjp/n+Vd5rdoV1ST7QU84BCAARgehGODjFYUtiJ2cFVBJXDbc55yf5V6VOtomccqdmc8lu11KvmQL5YlZHjeMZ+78pHr9aspZCIN+7AGFAURgbR37nNbIsFRmJjBBcsBj8M1XmgeVzGseMDJB44q/aXFyntY/eXKxB5CDIhJZ0B5XAII6n6VNFM0sO7Mpk8lgTtBDKD65qgpC3IAiP3oseZCckYwfp/n0qGMq4j8u3KykTK42k8gZAGfTp61861c9W5rFxl1dZQ2IxgRg/Njpinq2wxnLFPnGBGAytjnI/WswXitDcEsFASDDFWO1sDuOnenpd2oa3Esm+NnkLsN3oMe9LlYXNJmVYzyrKEUgmPHekyysAm1h5jEbUOQQOmKzvtQWNStwMiLIKsRn5unP8AnirsbtNO2yUOBIRtMhU8LweKVmMdGsZjlOR/qxhih45pu6SPywuC6TlQoB9OefT2quGRosquW8ksxL992M//AFqkDEzKDG2DPnibjOOn196AGq7eSSIYXQLknByAT0qWQRlmb5PllTdtRh69QarI4Bc+cQRASuZccg9P/rUskqmGctuKh4ix83PBU9+/+fSmIv7Sks0chBHlsRlT65pYnJdvnALhBtI4bgVWjuEMjkSscxOrCR8kHtz3qj4l1lNI0Ga7UJKwSGMRNdiDcXdV++eFxnOe3XilYZwfi3XjdXZuorvTI5tMvb6xjtr23lZZ4fJQTfMh+8CzYHGQw9Ob3gDVhfaHp0csryywzNEmwhUB8ngYPzdA3TvknsK8q8QXiwtLbJZvZ3Nvf3XmwG8eZkZiARnp0AUt/Fs61rfDTUprXX0tdhdZsMcIpYFQ3CliMZBOT6Z+tVbQR7fpTrNFbNFuGVHLNu2kHGPfkH8qtTY8lwvlE7HB+Q9Ov/6vSszT7pGijEWUiy33lCkENg5A6c5rTeSOWB0DnKhySH69P0pLcDk9ahM0+9nLNJGpbcygcH1PvWSLEFyAj7Q7KGCggkDOOe9dXqFmLiMSGGQFYAU/dFtxBHt79f8AGud1DyDe3CJborJdEDaCAydBgEnrjP416FKbehyzjrcyJBwvHIHOR2zUDlYz3yOMHrVl4jt2nqYypBHTk1A0EYiLFt53DPX0rpWxkztEmQXCOk5J8xAykntx1PXvT4p1VoX3vGN8hOGJK8Djms55iBKGLiU7CCG4OAMUm+RpXwxyzE4zxzXm2Oy5fF1MT8kjsZFXcWOcMDkc/wCetWLdpBcQBT+8zKQA3T5eP1plrAoTkfKCTV1I90qJuZXVmCkKD1qWxpFFHMsZHmnckS+UWkHAB5Gfr0q1atIdREoOD5zZPmL/AJPWogq7CQXBVCj7YgRjP6Um2NnWSORmLSjOYhuBINIZNDcM4YyMvzRYG3C8bv51cXzAWG9iouFwQAckjt79KpKikEpIrBI9wzCPXpVgskMzg3MCgSq4Gw4PGeMdualjJWjLxTQtG6ypbswBiXJ+bOQfxxVWaZovtccaSLGzRMylOQSMn6c1GzHYfKeAlYn5AbLA5B6jrVe6md2u/MfezCMlgpGSAB0pxQmzYWdzcSxSGYyKkgBMQ5THr+H+c1wnxE8RSwadeadJo9yyi2tpbe+8tSqkSqWXJB4OMd89CMHI6+4ltop2uprlDbeVOZJfKZWh2oS2VHXA/E5PtXhHiGOK0hM9+yy32pW0FzAoyoUtuZwSzHH3W6cZPbpSsBzuq6lLdalMUlK+YWkKMzDgseeMY69K0NJ1NrHUoLiCLKwTCSQLkk4OTnn/AD+lYyWF9fi4MCI5SzSSSUSJhQWI59s+n+FW5IzA21HhBkYB/wB6uenPf2pBqe7affq0aJHNbswjZ28h9wDbskgdeproLIh9hkdo2ZiobywwzjkHJrgfClyH0ize4YNeQQiJ3XBwpwyr7/KV/Wuilu/OBw7pGXaVF9yP/rVcYXE3Ys6tNG8a/Z5XidYlV0yw3HOT36e1Y05DTSP0cyjgGrEt3gnfvOV2hjTBE6ypKzSNIZIwPLIOQ2eOe/FdlNcqMJO7KMhAUv5ylmSQEMwHsPp1/Ss+8naLzPNdVfzF+Xfk/d61p3TQLFA1wzuSJUZcAMpyeue/OaxbtkKbHLYG0rwOmMD9MV1Q1MJHYGNgTlWxx1H4dqkhCswTJBDkD5e/aq6yOImAljYFW+Uk9uc4qWKUyPuwBMpiYKZMGTg9/XBFeaztNiBiwKxkFhCG27Dzz0FTCYPMNpj8zzzgMrD6fqOlZAaTdF5OS4eSJQJcFQOg/Dn9PWnyXrk+ZFtIaON2y+drA4yO/bH4ms2iky69wFXzEeJUeHy2ZUYKCeoPvVdpYhdoIJoWbzUKlEYDGOcj8vz7VWub5oXzDLPDI0sgmjWfABGOhH1/SqkkrGUy+Y7MAuH8wEg47+tNITZd+1RnLnytzxtlQSAG3cY/DHFTi6VUdoUjzG6OvzE4/wARWaJXJQknKscEHnmpl3ybWyS5BX60+UVyeS480HIAIDEAPjAJ6fqamhhWSzvJAxXbGny5znJFVDGScBTjIHUdfSrF41xpulNNHb3LTlJVWMyLGsjqpZVBJwBx398c0PQDK8Q+LtK8PeI7aK6toJoZxcNcBZC6lREcLgjncxxnpyfavFRHqD38MixzIPOcblQYI2nk/jnH1ro9f1LVddkhvdWDCV4wEWQIMAqu4YAB253AZyfUmuYlNvFCym6kUtJ82xDyemP0GKhqw1rsWbmK+t7K42pKw+yIjSQwIxkIG3btz05PbgMfSuq0/TktoXXyppfOuWuWZ4QwR2Taeh74Pr96uWgghiuXUmYXEasMW8h2pHvzgcfewBwf51pWUllcaejG9naDG2WXcQXO7oQB7MOvAA9eEmacpu6JexadqUuV2RPJtCsCCCFA4BHpu9uMdq62USywxGKNmtGt1kG1clsnoPw7e9cC8jE2sJuPNQjEY2bPM+ViSw/HHfp712mm6skU0kVzHG0sNqFjAbCsq5bA9x/QVpCVtWRKJvGwUWkgmZHlbJiAGOw6jP1rL1a7eSS/UyyJczvCwHkc7VByOoxjjnrx7muh82NVW4igkk8yMEMqgnb6c9OtVJtOWVpZCwLBf3bM2NuMcfp+tbU6mt5GU4aWRxU8t3NcJvdDcyeaHQwYAPIz6EnHb8c9KzLhpWZ/NwHGwbShXGB+ldJrMBsXujKoWaC7jPlGb513pubn3JGCOeD6Vy1xeNO+0ht3ALdTXq0veV1sefUfK7M7tfvqAWbIkXqBkY/+vTSxkgyrEuYVA6DOG/8ArdagWRgrAoDscNgDJIPUfyqFyTGo8r+E4OORzn+VeNY9IvJMdwDI5xclg2Ruz2H400SAQLtEuGhIPAIyGz+Waqsw8woRw0qnkYPOeKgZgGwEGcHPXrmiwGhK7tMXZSCx/ujrimo2cdBxjiqSsPTGcGrMJJIySvzAfWiwF6Lkg1aQFgq46nHTvTLaNmHPJwe3vWgtqFSMlCzb8bQcfrSuhpCW8JjKyzRjyQVyWiYgjP8AnuKyPGlta3mjCweGSWCa8aKNFjJKlkIDnkHCkKx56KTW7K0QgZYpGVHQfuC7fK2fyPGetcx8QLiwg0a3ku2ka3GqQszJKyHbzzu6jGAfX0I6hLcGeX21o0el26y25jkCgY8ghiwAGOTyf/1dqpS3UsEjpDJ5VyVA8rBUDkjv3HPbtWvPBaQFLZLuOa6jZxeO8zMWfcAAhAG8nBO4HnOe1Yjz+S6ABMtkD90HA574BqXqyloi9BqFwJY9s7ldwZi5X5+DwBnj/wCtWzp+oXFvpr28MG1slYY1cffxkLx1z1/GuZjmnibEkkb5cbG+zAhCRj0HrXS2skaWJWGZra5KmWSZoFjVSSwG1gOSFK5PJ68VcYpkObRPeNYean2YJK77TMJI8GM7VGFOAckZ9vn9TV7QZHF75MXDmK4QRTbflIBwcnrnj9axr7yby5jVrc7AUEaxwlth5G5lB64GNuBjHtXQ6EqWt9EUmaYOcBltTIUDdtgyceuKiTXQuKluz0GxUQwW6SDEwt0jc85yB+Xc1fmaKKzZ3JUbZUI44O0Y+o5qDT7cPbRtJcebJBuRnZCmee6nv0H51bls5bhy8aHYzHaFHeiL11B7HnGp2El3cNOztJ5mA27nlRtWs270xbZNqMqzIuGDHHtXoGp2gijYBDmWJTkqRtO4f4frWLPYnYVYnd9O9elTxDSVtjjlRTepkl1WYEpgHbxyCPpQZgIwjdRvG7J44qmZxz8zMOCDv5HFAlHfcDuPO7vXJY6Cy8xYE7znavc0ju6vuDdSejdKriTIOSScetOBzznqfWkBKrHI5471qWzqdvzDPHXArKRuh56dQQKvQSmKZTlxhz029x/Okxo6O2mULn5c8HO8CtOJ/NIAOTkYG7Brk7eZmx1OEz90DjNblrMCSJW2urLg7QeO2RWTRaZvvJcQkDEisIzwLhMkDvjHsfeuX+IsgTwbqMt5pz31tN9ma423aQMibwQdxUjllVeB+XUbaOjk+aZ2VGePclsuMnORnPvnH8q8z+JggF1cpcza1HDJp0Al8nT45YwRI5jLOzggEhsAYzjOTgipW4HD63qUdrcLLt3wiRxalrlZigJOFcjJbGRySOvaolsdun2NyyzSzlZSzGNwCGIYYBxnHTjjgfWqWphnuJbm9jHkzr56EbSGDEkE4CqOtTwPfaxDHHALLyrdgoeSRt4Oz0HH4fTpQ3qhrYfYJ9svVjiRQPLAkimidDjpv3Fhz1wB6fiOkTVbeygWxnt1KsNgWON5GkZs8kgls4Xuei8d8Yl5LBaaf9ns5i9+jAlJsBhx15G7HStW3gtbVftUzPFPcpCrI85ZA+M8Bgc5J7DtxjpVynaNkRCHM7voTTQQWVzbXQdxe+WDICSY02q2SoxkjJ4710fguxaXXAzzxTiCdZfOG4hcgADJIy2CfzHBrnbaCY3MdxeypawpJKJZDMWCKQeg7udu7p0Xk1r6QZ7bUtPmlto9toC0ZhABdS27LsvHPYc9O1c9zptc9atbhZVkaPHliQlMMDlTznv1JP6Vckljh3IykoJ1xywIBBwQPXiqFvKsKO8qAiQkqI2wTk8E4HX60G4QhzJ5py6FpRL8y9cEcf59qpambKlyVkiT5yT5L9dwzgnpxzwP0rLnRnZXLg7gufm5Hy960ruZvMdWuJm2LICTOGBHb/CqIT908gdjtRDneCPTFdEXoZPc86MoyeuCOenrS+aSOeu70qiZCep7elKJM5PHJrZozLwlBB4xx6VJvyxwMgEZwKzxIeVyCBThMQOgzxilYdzREo2gFSODk7amSXJBxzuH8NZPnZ5OM5/OpUlwQQB2NKwXN63mKDI5xGQQQema0obmOVmDgRjyl+YqSAe3uOwrmUnyQQFzz3PNaWnzB3kDFAPs7HDSbd2PTg8+3salxHc7SBrV1Es8ENq4cqwdJmV/lzkEH3HGehzXgfivW7vXb4TXa6fI0FosfmQLKvmxq2BuBI+bPOcAfhXrB1Yz2yxB/K2BQym4YqxVQu7HToB09K8R1S9u7jcLu5ed2BBb7WZCOTwQSfQVCiVchv5pvtW0xSRowYkoFG7OexzgfTt2rW0eVk0yZESZnEsYM/yAKMZI5ZSOMcgHpWLOkcs5EcRjVkYOxjxggEY+voK1tNaSPSZxa28tzM1zEGEcO8n5W5IA5wP/AEIcVnPQuGo64Bt7JWfddSqTwTkcnJ5HHp+VblrDLJOrAOBKId32lo18grk9VPOflIxzwM9K564spIoPPuIJImMr/NLEFJyQR74HHtwa6yOKU2duz2v262eKBEtVi/eFgAQ8jYyu3AHzYGMj0xE2XBFohxcQs8X2eMXMgithtZrlznMmc5A5c9uCKsWc40kQSPD5irFKfJ3NksuNrMMqdoyOpB4IBphEkd2yTCVsyPvaWNuVwNqxkjG0DAz0yp55qaQx+fM6XTmRI9ktxENpkUkkxQjDdOQSCR8y88ZrNmtjsNA1KS7sy8ksrSfIGYhtuD0RMk9sDIreE5S2uAykfKjKdoPG7v69a5rQDst/K3JG6oA8QwI4VKkgDbxu6+/ArUlkZYxvCRs9uAF2klxu4P6VpDUzmrFqeaE4SVGjfEqufKXnjPbuOPzrOdllQRxRh3FurHbHz97k/lx70u26vrjyIQjQyS7mAiyoJ4yPSqd1HLbWsMM1taEzRyBTKH3Ao5BGV6HP+ea6oRvoc8nY853ZPUfnQHzgZppQ7j8noe1OAIxle57VqZihvzpdxyM+uKjC5VcqSfXAp4OCQVyN3Py+1ILkgYk4ByduakQnAyD1xUIVeCwONmMlelWFAYgMu4hhk7MZ470xkiEjGRzVuL5woPBVW5zj6VXwDhOmEP3VIq9EoOSB1welIVwmkZ8MME7RnBPzEDrXk9+kEk8hhlt0VpHcSKGGQei428fy5r2OO1FwGBClcEEYOT9DXlV/cTTWdlvkjM0LSqWE0ZyrAc8fj7/mKmWhUSG+keS5jP2SSQkuDzjaMcd+vPrS6ZZ3rae0qW0zxHYsnkxZcsv3cjPHBPJqvdNE0oZX27pWZUWBj82Opxjk1f0w2VlbPcXLrBI/ykiIncOGPU4xnBx9K5ZaG8O5buVdbJ5bqKRQZMwxu+Nvy45x16sevp+PQpHM9iVntrxWAVzd2yL+9YNwijnH93OPTnNctenz2uJEZ9qsVcSxYOQD0Ibn8q6mxitLWCKKC7mtJ4IzskWElIAf4V6jcfYk8H1qZ6FU9TVmuETUNgv8SFzGTNGo8jBUbEJ6sSOoB+99aSRbyd5hcabFcN5TbZbIALGucAbiMO7H5sc4ycj0rOZbiewPnWzwB/MigdWDhdn8eRy4HGODkd+lWoGjWKzmeyutNhcEQwvyu9TnfKrnheXADquQw7ZzkzdGxp91ElrF5MXkp5SvDbTMS0ibR87nAIOR2457Vo2sctyX2b1EYLMfUAZNZlnA967TXJSeOVMTXIUK1yxOflHYfeP/AAIVrRyIsfl/aAcwup2lxgn/ACM9vrXRRTcTCq7SNKeaCxtBIq7cxRSxM8UigPuGQGGOMZ5+mK5G8u/PMe92JCupG5uckn8smr2oXVxejzZPPZlCx4yTnaOv8/z96y0sZ5ncyK+AFYKVyTk8/wAq9TD0oxXNJnnVqjk7RMhohggIqnjBC1GYgGyUUnPUCpCdozjJ9cGmZJbjj58cnrxXObMiKo5HyAggkYyKkES5+6uS3uelEeCqsDzzwWx3qTaQc9sg8GgQ1V3Rg7ecHgtipRFlieD90/fPFNU7ht/3huz0qzGpVQCcjAxSGSIDgHpgHvVu3XzHCj9Oap55AzgmrlqwO0Hbkn+LP9KANQfuoWO5duzJJTkCvF9bia2vrq2RSJRdvsQWwRTkdByTjpgelewXNysdiZN0Mn7krsYHjr1rx7UWiWe7jhjtgousqIw4ZhgjjOAB19P5Vmy0MvfJgm8xG8tZZMSF5SSG2846ce+B6Vo6LdB9PntilnNFPJho553cEADouAF9m9vasy8LK6vHM7B5xmSULkjA+UdRWrp0JubOVLmKeeCR5kaOMAMrgKA4x7FvbpWE9jaPkPvpImgmS3SOKNCRK29m52ZwMg8e+RXSWkJnsoreH7HKiEyWMRvW3S45ZnAIyMnPJbr0rlL+eSRbiMRALCyEqepyCc/1/DiuutLeJ7fzLkzs0c5VpowuZuchBgYGMDOOflNRNWLpslBtZ5ra4OmyFfMMlvNBKdkkuBlm7Kn55wQRU3lWd5bzwSalcxwTAjFxnE5ABznI+UYwR/sng1n3M0D3NpJcNOJfNkBijJbYQD8iknPPAP17VsQyT39/dRtd2V0dihmKnZb5JIjQkE84yeD94fWsZbI2T1NW1leG0i+0HZLCpDGJsCFcD5FGPc9BjimyvPIXJgaW0V1KQ5LEDue36VTmQCxt8W8kTBcxW6K77TsGd+OMk5PP97j30dG0+SeSWVo5oUZUYOHbMgxuPBxwOnbvXpYVKNNTZw4huU+VEy2kOpZP2WPyldt5+ZGGMAen5Ve+yxRRKioAoG0D2FXZWFuqBlJ8yAHIjDYO7POTVXcXZQRnDHqmB+QrR1W9OnqZxppa9TgWhKR72Py4PVs5pWtZQ6hlJUuNpyPSugZNybQmHYOAMA5OeKuAWtrEkzeTM8u8HauCrKowfzNDdhWOZjtBGreYw8wcquDyCc/4VGYjLvUBsggEe3WtK6kN1cCSTJ3ZDcZyMYpFRBjjCgADjpihIGVo7YD5uRk5wRSshHABNTbtxA5649KEtzIFJXIZc1r7PS5n7TWxDHE7OpwRgnqK0bfdAYZAASknTPOMelQBto4zyM9KmjlYso+fG/OABTVEl1kV7y4ENhMfKfAjZiVl5PUj8a8v1Yo1zcSRqCGlBd4rjzAeO3Gfzr0vUGKaZdMDgCByMqOeD2rzG8iMtxNJI0vmCSNtrRhchlzk44Hb86xqQcUawmmQtGiQwNh1X5WWLaBgFeCfc5/lWxaJZ3FiBc3FxYlZ5gkojDxghVGGB5+mPQ1iX7vPIxCsn79ZBuJJYEDv/npW3YCSbThbWrxvcSXU7RpKxCthFLMcjb37/hzXFPRnXDYL6KzsIXkgeOeKUqW8pNhHUYPXHb9a62yjgWRnk1D/AEmORmjJhyLYEAbc5xlgfYnPT0427maCFxJIn21lAk2IpXA3A8DqeW689K7C3t3Rywsople83Q4ZiXZkyzvnoB8wGeOB7VnPzNKew/Es0tl5NwIAImdGK7TCpQjc3HLkkH/gJNWJI0jgt5LnTblYjG3lxwlgYW5DO/RdxXpwPuDg8A1S4drVre1VSZpW+0uS4LhGBOcn5c5HUjj1xgE6rBbyy6o8VtJzbyklmlmyuSVzhUXg9xjJ55xm/M0XkbPhpJbh0uGlvQFupWjM8mTd5G37uOgO7A4+7nHPHapKsCAIqh4yVwOVxjGP51yFtMxiBkv0u3I+Z1UhU9FX14wSfUmtmzZ3VkC4do2IJGdpBHH6j8q66abimc1RpSaJyw3AA8Dgk9h1qeQotuNjRspb7wzkECrqWcKRyqAgEiMeuOf8ioZogqs8sm5jIu4o4Jxj2q7ozszmIg9lNDdCVG2yqSoIJx3zWXc3TyMzF3fLFueTyep96tmQPKgZcq2QcH2otbW3u7eKQxtu8qMl0m27jnkY/D9a3ulqzJoz0zyxBCqTk0b2nZo0JAGCD04PP8q2EiaYnyod6JM0bq5HIx+vX9KkbSsRqiRuYwoAYYz+NCkriadjMCAnMYPPJGealVZAyBVYqDj7taJ0/wAr70kQz3fP9BUVyqRjekkb5fgqSMfhXRCSdjCcbGb17dRxj61MmVAHy8OOSKaVA6bTxUqBhgfJgODy2K6oo5Gyjqag6LfEAZW2kJ69cGvMbto1u5Y4JN0TSRui/wDAf5DOB6V6bq5kXSLw8lhbSch84+U8+2K84vpLiXVZ/M8g73iaVkfIOMDj1GTn8K5cSklf+tmdOHk27f10KE0UgHyeayHa7Ss4x2yPXHQD6j3rehQppyqYHkDX0od4iTsJVTxWDcSwRQlbdCojC4iAyeSBnI4JPrW3YFbaCK4gQW8n2uYb/IViPlUDk+oJH4/hXlT3PUhoiuRNHaRtPJkvCn7mXkAnOTkYOPpnpXZSW9vC5ylxaqbtXldif3xKnCxk5wM4z7Bq5q/uDcWsUl75j2Soq5RAjkc5AHsP/Qq6SSRmW3aMiZzeKFjnREFp1JcnJycbsd/m9aierLp7DYJzPcWc8ZkaUPJts+Mq4RsjfxyeOR3Y+5rWlkvvJ3XZgS6MUi3PyoywZGNq5BOeWU8Ecduc0rXfBNa3JjiW+kJCPja5UKTu/wB8kDn0NSbXh+yyiyv96BnCgZ8oL87SMzcFiAOOeR05rGXkbR7suQM8UkULWwT5mdFiGViHqzdNxz9efaul0SNIoINsgZS6x72PLE9WP8/xrmbFLR7bfDJdpCd0gacszzPk5zn+Hdnpx8vvWyuozQTblki3N5RP7lWH3e3HBHtXoUYOUEonDWmozbkdO1+Y3bynSYuk0ZCIBwDwRg85OKp3F5+7b92FxKowwHXbk1zoeMpEX24YPllXvk84oluQ6uryR+ZlSJCrfMNv/wCquj6vYw9vcbFpVxKxUFlBVxlT0PH61pQ6MzL5Lq3l+UF5P+ea68aVGoaaOFQoySQQM4HPFTR2wKeZDDKTEYiyKoJwc5wPyrkda50KmYCWDKpUYJxuJGPpzVu1ssNEiBJG3BMeYBnFaDLNbmOWBJi26WIFFBJ2/dyO3fg88VVup8OZYYmZXWObO0Aqw46jsefxPSo52x8qMbVLg2szRxxokU9rtK+fuDNkjceOCPT2rAaPEgxs++uFD54/z/OugvBGxY/wu7NtMYO0jnGDXPXJVbgtGwxgYwgXt6V6OH1Wxw4jcgZR27jpmnKoAJ2lipB5/lUckgQEsQCBnB4pVk+coMc4H1zXcl/X9epwykinrR26NeldyYgk5HXGDXm0yr9vBieWQP5DHzMZOQCDkd/8e/WvSdZiddGu98ZJMZG3BIPt2NeXW0M019Zh3Ys0vllQhBXaQMHHXAP4Vx4qVtH/AF0OzCq6uv66kU8kv2IyrsceUu3ghmw4xnP4Guj05yLOJpYre4i+1y4WTA8w7UHU9OpP4CsW8RLW5uEeUTsd4aRpMDOf4Tx2rQtpLabTjb3TyRtHcq8Pk3GMggBg4AJAGM57+1eXN3Z6cNEQ3P2i5ljiglWFTCkq5A2JyckkcAgduvFdmsK20myWzf8AfXjMgEmWmYqzZPfaACcDj5a5W7SC306GOBpXKA5WVlbvkEk9eM8fpXR2k0EFnObnUbhLt0K3VxA26JHH8KqRwTnqB/CcnpUT3Lp+ZbjAM1vE9ui3QLLLKjkxxHywcDccg/cH4GrdsoljTzJ/tWluoRpiMzXUvOACBkKOTxn7wqsE867iIvFKxs4jfJDSZTB7kgjPb07VYkgaVGneOKGMIyPLG4KwKCSFAOecZ5wfu1jLY2jvdlmF5mjfzZ0nkxhznIj5zhensen8Rp/mA52jaSRj2xUMRUJDDjaSpMcTZIXAAyeecDHJqTnJ5PIzyc5Oa9nBL92jyMY/fZI0nQ4XJDZ59aiZt2SQP4e/oMUpyTn3pCPUV6HKeepanrseCQo+bIlQ7I+TgHp69aoTybrX7REMstsjBkQnlX28HsQAM1z1tqksVuFkR1aC5VmcuciN1wRx9B+dUJ75pIY0jaRWWMruVz8w3k4+leJHDzuevKvFI3Hu0e4G6Vwn215POCsN24DK4Hrjp1rImvwsCRxTkqbfa25CDnfux/8AXqnc3h/eRxsTGZPNDAnAI4H8/wBKdDB56ZIVRuAGVJyCB/X+VdUcOoK8jnlXcnaBBf3gm3yD7v3sA/n1NVmgkSRRKo3M5WPjGDjgfWt2GzggjLNDC0wVgMJ1Gcjj8BWjDam5YkQwMquHcPCc4A+8Oeo5rT20YLRaGboyk7yepyCabc3JlidJIpRb+YMqrBlz1HPX61v2nhxY2llmdyzEEEDpgdq6OK1tl8pfKiG0ogZVAwGGQB6VcBhQIGkO9J/L8uMAseOCAffisp42T2/rb/IuGDj1/rf/ADON1Xw9bR6RdXF5MBEgGd0pjCgkDcW5I78gcV5HqElvZuwXVGu2tdTnSO5S4aQvHtGD0GQTkZ6HJxwc17Z8QL3HgPVwl2ZIJLUFN5UurbwMHv614PrV2kl3dot99pm/tN5UwVZXU9GyuBzgA46elczqTqP3mdUacYL3UY90We5y67kJZWQIuFHXrn1rWtYJ5bN004EEICQ3HAYhcDI3EcnHb8ayJHWSQnyIxFJgLI4OZM556c9hWkl1Bb2VraiG1eYhtqv5inAbA+YdRwf1rGXZG0bWuyW7mkhZ8SMZHzukw2eg6E89lH0HNdNo8c40+KGLToBDuZ4YbmEbol7l+uHJ5+lczNDK/mCa2jTBLx+WWB24xlsk+4rp3m0+VZ8WkiWpkeO5P71ZGdf7uT0GCCBU1OyKpdy5vupdVijkt4bfYXZkOAJ/l6Rgck49OOT705pbeFIEitp7O5YFre1m+4SMkM+7gAd8/wB+s+RhJf2UcDNNKjN5MEpyEbBJJ+XJ+bGOP4a1E2tGkdzq8LI6GOYsuGkLdlPXGdoP06cVlI3WpaUySQ5nMdypX95MjYMzd8D0PJ/EVKAxOD1A5HYU2LzXctJGolRmVijkiNeo645+7+dSY52g/KOmev1r2cG/cR4+MX7xjccGkI9eKlKZBPpTXG0kAng+td/MefZmoQ+47HkAYDPzdeKRIJpzsV8KhXdkHlSecfTFTOoYfLynfHWp4FSMqgZkO4qCUGOB0OTXE6nKtNzsVPmepDFpEcUTleVUnj2ziriW8kVxt8rPzN5Y4OMdKhnvZDbSckHy1z+6A5z0z/n9KbFcyl85DK0wTDRcfN3rGdSct2bwpQjsi9iXereW5UhC3C4G44HJPFW4tRSKR7ci4STE8PARs47cdfz64xWJJqG+GIRvtcxGOQNGCD8+QOfwpY3CMryIm/cco0eQOPT/AOvWDT6myfY01vJHWQhLnK+VIp+zjBUcZIz+Xrg59rbarc3MDRp9peWK6SVXFuoI47qD15J79B0zXMFY3/gQHHYH1rRjhRm85mQXKyIRu3Dd6dD7Cq9kuovadiPxZf8AkeHr15bQk+TysmnKwPP3ihYA+p7DGcV4jcSK+vR3axLBblo5k8u0CITjpjPyqSG6E9D1r1fxYYpNC1A3d4kAEbIXIkbG49OOepx+POeleQG4Mlxbp9oS6JhjQLsZSoUcKAR+tJx5dAUr6lO7nilnI81F3HDIsmPLO7ooI5/Gt/S7u4tNKttuoNblTKsm0joSCpYZ64H4Z96wWjkGN8DZGF5KFhh85ySOc10WmhpdKt2uLLzmgmkaDEiZkzkcgduSee4GK552udEL2ZX1C4kvY7eSWUz24TEROcs3fkY7AfjXYQzTtf3sUGtQ5+XEbuFaJMcjGCc59eOnvXFaibwzxB7b7OhHMgKgA5/P8cV2NtbXKQyStp804+QqQiiSUj+JioA/MjvUzSKg9CwrzRPam5eOZ5MoJsbi6qrELk4XOTzk9+KQTSvcGCbT4Z540yYoW5gjJxt+Ud+WH1quyxrq1kiW728zI7tO5Oy3YqSSCeCenHOMcc0CW2Xi1uLmCMZO5fma5Pd2BIA28dcZwazZqjTtEiNu4S1MMbPgJICSzYzk+3bn096tKjZGdvo7D+nt1qHT418omK6jlBdUmlYEZGBtC89cEfrV1LcIoXCqR91QeMflXqYWXuo8rFR95sjYkqAD25pjIQAT3q2YdgGT1HpUXks3PGOnX0rvUjgcXc1nhRfk28uoK4XnOe2aCvmq8sm0HeCR2BIP+FTIjpPuYJ+75Vfx7VK8Qml81xtjBAMeeD/kV53MelylEWMkgkYhYgh4XdkN702dEQsiDgEHcrEgHHb9a1fsq3Ua4lyoJ6DqOuKJIEtkHlRMJBtdcP1GfTvU+06Fez6mILWMrnIJIPHPFSbCWxnk855wPzq1M0k8zonmLJlixOWXB7enrQEa2YbVPGxidwAJPNaxtuzGTeyIMeQvyqr70KnDYI5qyirKJC7/AL1o1ILPjkdvyxUbBmfdhiTnPzA5+lWog7hl2OVNvnHHGOh+n61XqRexheJ4kfQLo+e0WWBcPdrDg5HIYg49OnPSvIGk86/tIpfld40QyfaPNTjI3cZxyCevHNez+I0vrvQZY9PWR7vKYUxxPgjGThyB0HU/zrxYPPBIn2i3aKeSMqQYVRcZPy4UAg8Djjn61lVZrRKckMcVxtkjE8i/KXEZO75u2Dx1rVs2t7yytklvGtpIrlsqLd2Dxn8vmB9D0xWMzpJcYW88uNhwRI2V5649vz4rWsi5tYjDtlb7SFcksQjHpkEYGQGPp0zXFI7Y7E97BZ2Vtb+RuPmNkxpDs28nrjP5ds10MUSLq2ZbySS6wCZ/s+IkXJzGNz/eIJ6Z7VzV6kenrIrTlnMjlmLhwgPJwMY6YrpIZZpLm2RkjmV4Ymt/mYSSDg+Yx9+M5GevTmlJFQdy/Ftm8qKOcGzWWXdE4J8wkHLEY6Eu579att50ZlWGKBp40HmnGUKYO1EH+0AQccdOKowSw+e6w2cb+W0pnckEwggcLg8Z4Hr16c0sQtUFuYonYNFutI5sZLBuWfqcZ2EduDWTNUbFp5oEuIUj2sNkAfoOeSRx36cj5avIpUH5iec89+aoacbcx3DbpJELqC7hTuG77vHGOoxjvWuo3E8g4bjA6CvSwztBHm4lXmyvt3tnp19acSQox12g/rVzYRhdq4J4P/16YRhc85xjP412XTOOzQPfISCZi/D/AHXPHGQMEdzSx3kk3mSMGZE27gXGcHis2LNwGaVmYpyMn1pXmmRSolbbhVxgYwOR2rk5UdlzpDfmAP5En3H+XbIMFSDjgjtxVOe+mcjy3b7iqx9AB0FUhI7u4Zyee/0qeMmMFkODt9M96IwVxTm9i9ayQxwBTuClxGXJHHHr+dQ3E2HdVZzGFyMsOx4IP0oByGU4IMxyCKjPyDAx9z096tJJ3Zm22rIVSN+QGwH2hgw5qxFG1xHHtcq0cMjMcjGBnGeeAc4qCOJDKQRkbhT0VWNojKpUxy5+UehqhWuYvjKRI9Jt5WxChuLYuwkUAEOMkFTkDjP5+leOXVtFHeKIRhGlcqY3EgKZ4xzzgZ616j4ll2aPHmKFw11DGweJWBUtz1H69a8xCrd/2bJsWF5d5YwqF6E4/DisKiW50U9rFFtlxcRtGZ2DuwV1G0c/h+X0rVZxp+mWqxyTJNKp3ybnKO27b0APJAHSqpZmu2XcwBuAvB6Dk8VbtLiWC12+bM6MkqBXmfC/vDgqM/KeOo9T61yS01OlK4koaafLtIVSfMW8bSBtHByBkZJrsBMsVqV+3OlxEu6VxGxQkHlRj2+v4Vzd5MzToMcZwMktt5U8Ekmug0+5keODzCXKRuMuSd2TnLZPJ+tTJ9Sqa0Ls8sf2+FjKZ2y4tWDYCttAy/JI6t0FXIWuizMb+KYg4d/u/QAheR0/XioRHH5xkESB96qWx6gZOOgJzzjrUz2tultNshVRGSFAJxjn1PuazbXQ1Sa3NCzWV/MJRepwcZA59f8AD0q/GQNwUEZBJ561kWIEalV/ij3E55J4rT3Fc4OOK9DDaxscGKVpXJpZljBbzcZCkDdj8KsWipJ88hUr95RnqQO/41QuyWjBJ6KuBgY/KmF3jAVXwEMmOB2GfSuue1kzjp76n//Z", 720725, 1204595);
    oDrawing.SetWrappingStyle("tight");
    oDrawing.SetHorAlign("margin", "left");
    oDrawing.SetVerPosition("page", 1810470);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oParagraph.AddDrawing(oDrawing);
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
    oParagraph.AddText("Summary");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);

    oFill = Api.CreateSolidFill(Api.CreateRGBColor(255, 104, 0));

    oGs1 = Api.CreateGradientStop(Api.CreateRGBColor(255, 224, 204), 0);
    oGs2 = Api.CreateGradientStop(Api.CreateRGBColor(255, 164, 101), 100000);
    oFill = Api.CreateLinearGradientFill([oGs1, oGs2], 5400000);

    oStroke = Api.CreateStroke(0, Api.CreateNoFill());
    oDrawing = Api.CreateShape("rect", 3212465, 963295, oFill, oStroke);
    oDrawing.SetWrappingStyle("topAndBottom");
    oDrawing.SetHorPosition("margin", 370205);
    oDrawing.SetVerPosition("paragraph", 1170888);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oDocContent = oDrawing.GetDocContent();
    oDocContent.RemoveAllElements();
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("Phase 1");
    oRun2.SetFontSize(20);
    oRun2.SetBold(true);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");

    oRun2 = oParagraph2.AddText(": Review market tests, marketing plans, and expected sales goals.");
    oRun2.SetFontSize(20);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");

    oDocContent.Push(oParagraph2);


    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("Phase 2");
    oRun2.SetFontSize(20);
    oRun2.SetBold(true);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");

    oRun2 = oParagraph2.AddText(": Developers complete final build of the solution.");
    oRun2.SetFontSize(20);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");
    oDocContent.Push(oParagraph2);

    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("Phase 3");
    oRun2.SetFontSize(20);
    oRun2.SetBold(true);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");

    oRun2 = oParagraph2.AddText(": The launch phase.");
    oRun2.SetFontSize(20);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");
    oDocContent.Push(oParagraph2);


    oParagraph.AddDrawing(oDrawing);

    oParagraph.AddText("After years of market research and focused creative effort we are in a position to take our “Innovate 1” to market. We have a three phase approach in place to complete the product and take the product to market.  The first step of this initiative is to test the market.  Once we have identified the market, then we will make any final product product to drive that effectively keeps down costs while meeting sales goals. ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);

    oDrawing = Api.CreateChart("bar3D", [[200, 240, 280, 300, 390],[250, 260, 280, 280, 285]], ["Projected Revenue", "Estimated Costs"], [2014, 2015, 2016, 2017, 2018], 4051300, 2347595);
    oDrawing.SetWrappingStyle("tight");
    oDrawing.SetHorPosition("column", 2347595);
    oDrawing.SetVerPosition("paragraph", 346075);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oDrawing.SetVerAxisTitle("USD In Hundred Thousands");
    oDrawing.SetLegendPos("bottom");
    oDrawing.SetShowDataLabels(false, false, true);
    oParagraph.AddDrawing(oDrawing);
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
    oGs1 = Api.CreateGradientStop(Api.CreateRGBColor(255, 224, 204), 0);
    oGs2 = Api.CreateGradientStop(Api.CreateRGBColor(255, 164, 101), 100000);
    oFill = Api.CreateLinearGradientFill([oGs1, oGs2], 5400000);
    oStroke = Api.CreateStroke(0, Api.CreateNoFill());
    oDrawing = Api.CreateShape("rect", 2718435, 762000, oFill, oStroke);
    oDrawing.SetWrappingStyle("square");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerPosition("paragraph", 17780);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    var oContent = oDrawing.GetDocContent();
    oContent.RemoveAllElements();
    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("Innovation. Profit.");
    oRun2.SetFontSize(20);
    oRun2.SetBold(true);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");
    oContent.Push(oParagraph2);

    oParagraph2 = Api.CreateParagraph();
    oParagraph2.SetJc("left");
    oRun2 = oParagraph2.AddText("After years of market research and focused creative effort we are in a position to take our “Innovate 1” to market.");
    oRun2.SetFontSize(20);
    oRun2.SetColor(0, 0, 0);
    oRun2.SetFontFamily("Calibri");
    oContent.Push(oParagraph2);


    oParagraph.AddDrawing(oDrawing);
    oParagraph.AddText("Legal Issues");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDrawing = Api.CreateChart("pie", [[53, 32, 5, 9]], [], ["Enterprise", "Small Business", "Individual", "Government"], 2741295, 2273300);
    oDrawing.SetWrappingStyle("square");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerPosition("paragraph", 632460);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oDrawing.SetTitle("Projected Market Share by Audience");
    oDrawing.SetShowDataLabels(false, false, true);
    oParagraph.AddDrawing(oDrawing);
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
    oDocContent = oSection1.GetHeader("default", true);
    oDocContent.RemoveAllElements();
    oTable = Api.CreateTable(2, 1);
    oDocContent.Push(oTable);
    oTable.SetWidth("auto");
    oTable.SetJc("right");
    oTable.SetTableLook(true, true, false, false, true, false);

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
            oParagraph.SetStyle(oFooterStyle);
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
            oParagraph.SetStyle(oFooterStyle);
            oParagraph.SetJc("right");
            // TODO: Заполнить автофигуру
            oDrawing = Api.CreateImage("", 495300, 481965);
            oDrawing.SetWrappingStyle("inline");
            oParagraph.AddDrawing(oDrawing);
        }
    }

    oParagraph = Api.CreateParagraph();
    oDocContent.Push(oParagraph);
    oParagraph.SetStyle(oFooterStyle);

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
    var oParagraph, oTable, oTableRow, oCell, oCellContent, oRun, oDrawing;

    //------------------------------------------------------------------------------------------------------------------
    // TextPr
    //------------------------------------------------------------------------------------------------------------------
    oParagraph = Api.CreateParagraph();
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

    //------------------------------------------------------------------------------------------------------------------
    // ParaPr
    //------------------------------------------------------------------------------------------------------------------
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

    //------------------------------------------------------------------------------------------------------------------
    // Header - Footer
    //------------------------------------------------------------------------------------------------------------------
    var oSection = oDocument.GetFinalSection();
    var oHeader = oSection.GetHeader("default", true);

    oParagraph = oHeader.GetElement(0);
    oParagraph.AddText("I'm in default header");

    //------------------------------------------------------------------------------------------------------------------
    // TablePr
    //------------------------------------------------------------------------------------------------------------------
    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetJc("left");

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetJc("center");

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetJc("right");

    var oTableStyle = oDocument.GetStyle("Bordered & Lined - Accent 3");
    oTable = Api.CreateTable(10, 10);
    oDocument.Push(oTable);
    oTable.SetStyle(oTableStyle);

    oTable = Api.CreateTable(10, 10);
    oDocument.Push(oTable);
    oTable.SetStyle(oTableStyle);
    oTable.SetTableLook(false, false, true, true, false, true);

    oTable = Api.CreateTable(10, 10);
    oDocument.Push(oTable);
    oTable.SetTableLook(true, true, true, true, true, true);
    oTable.SetStyle(oTableStyle);
    oTable.SetStyleColBandSize(2);
    oTable.SetStyleRowBandSize(3);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetShd("clear", 255, 0, 0);
    oTable.SetTableBorderTop("single", 32, 0, 0, 255, 0);
    oTable.SetTableBorderBottom("single", 64, 0, 0, 255, 0);
    oTable.SetTableBorderLeft("single", 32, 0, 0, 0, 255);
    oTable.SetTableBorderRight("single", 16, 0, 0, 0, 255);
    oTable.SetTableBorderInsideV("single", 32, 0, 0, 0, 0);
    oTable.SetTableBorderInsideH("single", 32, 0, 0, 0, 0);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetTableInd(1000);
    oTable.SetTableCellMarginBottom(200);
    oTable.SetTableCellMarginTop(100);
    oTable.SetTableCellMarginLeft(400);
    oTable.SetTableCellMarginRight(200);
    oTable.SetCellSpacing(200);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetWidth("auto");

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetWidth("twips", 3000);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetWidth("percent", 100);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.SetTableLayout("fixed");

    //------------------------------------------------------------------------------------------------------------------
    // TableRowPr
    //------------------------------------------------------------------------------------------------------------------
    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTableRow = oTable.GetRow(0);
    oTableRow.SetHeight("auto");
    oTableRow = oTable.GetRow(1);
    oTableRow.SetHeight("atLeast", 1000);
    oTableRow = oTable.GetRow(2);
    oTableRow.SetHeight("atLeast", 2000);

    oTable = Api.CreateTable(10, 40);
    oDocument.Push(oTable);
    oTable.SetStyle(oTableStyle);
    oTable.GetRow(0).SetTableHeader(true);
    oTable.GetRow(1).SetTableHeader(true);

    //------------------------------------------------------------------------------------------------------------------
    // TableCellPr
    //------------------------------------------------------------------------------------------------------------------
    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTableRow = oTable.GetRow(0);
    oCell = oTableRow.GetCell(1);
    oCell.SetShd("clear", 255, 0, 0);
    oTableRow = oTable.GetRow(1);
    oCell = oTableRow.GetCell(0);
    oCell.SetCellBorderTop("single", 32, 0, 0, 255, 0);
    oCell.SetCellBorderBottom("single", 64, 0, 0, 255, 0);
    oCell.SetCellBorderLeft("single", 32, 0, 0, 0, 255);
    oCell.SetCellBorderRight("single", 16, 0, 0, 0, 255);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTableRow = oTable.GetRow(0);
    oCell = oTableRow.GetCell(1);
    oCell.SetCellMarginBottom(300);
    oCell.SetCellMarginLeft(100);
    oCell.SetCellMarginRight(null);
    oCell.SetCellMarginTop(400);

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTableRow = oTable.GetRow(0);
    oCell = oTableRow.GetCell(0);
    oCell.SetWidth("twips", 2000);
    oTableRow = oTable.GetRow(1);
    oTableRow.SetHeight("atLeast", 2000);
    oCell = oTableRow.GetCell(0);
    oCell.SetVerticalAlign("top");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("Top");
    oCell = oTableRow.GetCell(1);
    oCell.SetVerticalAlign("center");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("Center");
    oCell = oTableRow.GetCell(2);
    oCell.SetVerticalAlign("bottom");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("Bottom");
    oTableRow = oTable.GetRow(2);
    oCell = oTableRow.GetCell(0);
    oCell.SetTextDirection("lrtb");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("left to right");
    oParagraph.AddLineBreak();
    oParagraph.AddText("top to bottom");
    oCell = oTableRow.GetCell(1);
    oCell.SetTextDirection("tbrl");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("top to bottom");
    oParagraph.AddLineBreak();
    oParagraph.AddText("right to left");
    oCell = oTableRow.GetCell(2);
    oCell.SetTextDirection("btlr");
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("bottom to top");
    oParagraph.AddLineBreak();
    oParagraph.AddText("left to right");

    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTableRow = oTable.GetRow(0);
    oCell = oTableRow.GetCell(0);
    oCell.SetNoWrap(false);
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("Wrap Wrap Wrap Wrap Wrap Wrap Wrap Wrap Wrap");
    oCell = oTableRow.GetCell(1);
    oCell.SetNoWrap(true);
    oCellContent = oCell.GetContent();
    oParagraph = oCellContent.GetElement(0);
    oParagraph.AddText("No wrap No wrap No wrap No wrap No wrap No wrap No wrap");

    //------------------------------------------------------------------------------------------------------------------
    // TableStylePr
    //------------------------------------------------------------------------------------------------------------------
    oTableStyle = oDocument.CreateStyle("CustomTableStyle", "table");
    oTable = Api.CreateTable(10, 10);
    oDocument.Push(oTable);
    oTable.SetStyle(oTableStyle);
    oTable.SetTableLook(true, true, true, true, true, true);

    oTableStyle.GetConditionalTableStyle("topLeftCell").GetTableCellPr().SetShd("clear", 255, 0, 0);
    oTableStyle.GetConditionalTableStyle("topRightCell").GetTableCellPr().SetShd("clear", 0, 255, 0);
    oTableStyle.GetConditionalTableStyle("bottomLeftCell").GetTableCellPr().SetShd("clear", 0, 0, 255);
    oTableStyle.GetConditionalTableStyle("bottomRightCell").GetTableCellPr().SetShd("clear", 255, 255, 0);

    oTableStyle.GetConditionalTableStyle("firstRow").GetParaPr().SetShd("clear", 255, 0, 0);
    oTableStyle.GetConditionalTableStyle("lastRow").GetParaPr().SetShd("clear", 0, 255, 0);
    oTableStyle.GetConditionalTableStyle("firstColumn").GetParaPr().SetShd("clear", 0, 0, 255);
    oTableStyle.GetConditionalTableStyle("lastColumn").GetParaPr().SetShd("clear", 255, 255, 0);

    oTableStyle.GetConditionalTableStyle("bandedRow").GetTableRowPr().SetHeight("atLeast", 500);
    oTableStyle.GetConditionalTableStyle("bandedRowEven").GetTableRowPr().SetHeight("atLeast", 1000);

    oTableStyle.GetConditionalTableStyle("bandedColumn").GetTextPr().SetBold(true);
    oTableStyle.GetConditionalTableStyle("bandedColumnEven").GetTextPr().SetItalic(true);

    oTableStyle.GetConditionalTableStyle("wholeTable").GetParaPr().SetSpacingAfter(0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderLeft("single", 4, 0, 0, 0, 0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderRight("single", 4, 0, 0, 0, 0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderTop("single", 4, 0, 0, 0, 0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderBottom("single", 4, 0, 0, 0, 0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderInsideV("single", 4, 0, 0, 0, 0);
    oTableStyle.GetConditionalTableStyle("wholeTable").GetTablePr().SetTableBorderInsideH("single", 4, 0, 0, 0, 0);

    //------------------------------------------------------------------------------------------------------------------
    // Add/Remove/Merge column and row
    //------------------------------------------------------------------------------------------------------------------
    oTable = Api.CreateTable(3, 3);
    oDocument.Push(oTable);
    oTable.GetRow(0).GetCell(0).GetContent().GetElement(0).AddText("Start rows count " + oTable.GetRowsCount() + " start columns count 3");
    oTableRow = oTable.AddRow(oTable.GetRow(1).GetCell(0), true);
    oTableRow.GetCell(0).GetContent().GetElement(0).AddText("A new row in position 1");
    oTableRow = oTable.AddRow();
    oTableRow.GetCell(0).GetContent().GetElement(0).AddText("A new row without position");
    oTableRow.GetCell(oTableRow.GetCellsCount() - 1).GetContent().GetElement(0).AddText("Last cell before add column");
    oTable.AddColumn();
    oTableRow.GetCell(oTableRow.GetCellsCount() - 1).GetContent().GetElement(0).AddText("Last cell after add column");

    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oParagraph.AddText("Remove row 1, remove column 3");
    oTable = Api.CreateTable(5, 5);
    oDocument.Push(oTable);
    for (var nRowIndex = 0; nRowIndex < 5; ++nRowIndex)
    {
        for (var nCellIndex = 0; nCellIndex < 5; ++nCellIndex)
        {
            oTable.GetRow(nRowIndex).GetCell(nCellIndex).GetContent().GetElement(0).AddText("" + nRowIndex + nCellIndex);
        }
    }
    oTable.RemoveRow(oTable.GetRow(1).GetCell(0));
    oTable.RemoveColumn(oTable.GetRow(0).GetCell(3));

    oTable = Api.CreateTable(5, 5);
    oDocument.Push(oTable);

    oCell = oTable.MergeCells([oTable.GetRow(1).GetCell(1), oTable.GetRow(1).GetCell(2), oTable.GetRow(2).GetCell(1), oTable.GetRow(2).GetCell(2)]);
    oCell.GetContent().GetElement(0).AddText("Merged cell");

    //------------------------------------------------------------------------------------------------------------------
    // Create/Add/Change Run
    //------------------------------------------------------------------------------------------------------------------
    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oRun = Api.CreateRun();
    oRun.AddText("Before add count : ");
    oRun.AddTabStop();
    oRun.AddText("" + oParagraph.GetElementsCount());
    oRun.AddLineBreak();
    oParagraph.AddElement(oRun);
    oRun.AddText("After add count : ");
    oRun.AddTabStop();
    oRun.AddText("" + oParagraph.GetElementsCount());

    //------------------------------------------------------------------------------------------------------------------
    // Drawings
    //------------------------------------------------------------------------------------------------------------------
    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);
    oDrawing = Api.CreateImage("", 1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);

    oDrawing = Api.CreateImage("", 1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetSize(2000 * 635, 2000 * 635);

    oDrawing = Api.CreateImage("", 1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("square");

    oDrawing = Api.CreateImage("", 1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerAlign("page", "bottom");

    oDrawing = Api.CreateImage("", 1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 36000 * 30);
    oDrawing.SetVerPosition("page", 36000 * 60);

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart();
}

