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
     * Create a new paragraph.
     * @memberof Api
     * @returns {ApiParagraph}
     */
    Api.prototype.CreateParagraph = function()
    {
        return new ApiParagraph(new AscCommon.Paragraph(private_GetDrawingDocument(), private_GetLogicDocument()));
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
     * Create a drawing object.
     * @memberof Api
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @returns {ApiDrawing}
     */
    Api.prototype.CreateDrawing = function(nWidth, nHeight)
    {
        var nW = private_EMU2MM(nWidth);
        var nH = private_EMU2MM(nHeight);

        var oDrawing = new AscCommon.ParaDrawing(nW, nH, null, private_GetDrawingDocument(), private_GetLogicDocument(), null);
        var oImage = private_GetLogicDocument().DrawingObjects.createImage("", 0, 0, nW, nH);
        oImage.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oImage);
        return new ApiDrawing(oDrawing);
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

        var oDrawing = new AscCommon.ParaDrawing(nW, nH, null, private_GetDrawingDocument(), private_GetLogicDocument(), null);
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
     * @returns {ApiShape}
     * */
    Api.prototype.CreateShape = function(sType, nWidth, nHeight)
    {
        var oLogicDocument = private_GetLogicDocument();
        var oDrawingDocuemnt = private_GetDrawingDocument();
        var nW = private_EMU2MM(nWidth);
        var nH = private_EMU2MM(nHeight);
        var oDrawing = new AscCommon.ParaDrawing(nW, nH, null, oDrawingDocuemnt, oLogicDocument, null);
        var oShapeTrack = new AscFormat.NewShapeTrack(sType, 0, 0, oLogicDocument.theme, null, null, null, 0);
        oShapeTrack.track({}, nW, nH);
        var oShape = oShapeTrack.getShape(true, oDrawingDocuemnt, null);
        oShape.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oShape);
        oShape.createTextBoxContent();
        return new ApiShape(oShape);
    };

    /**
     * Create a chart.
     * @memberof Api
     * @param {ChartType} [sType="bar"]
     * @param {Array} aSeries
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @returns {ApiChart}
     * */
    Api.prototype.CreateChart = function(sType, aSeries, nWidth, nHeight)
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
        for(var i = 0; i < aSeries.length; ++i)
        {
            var oAscSeries = new AscFormat.asc_CChartSeria();
            oAscSeries.Val.NumCache = [];
            var aData = aSeries[i];
            for(var j = 0; j < aData.length; ++j)
            {
                oAscSeries.Val.NumCache.push({ numFormatStr: "General", isDateTimeFormat: false, val: value, isHidden: false });
            }
            aAscSeries.push(oAscSeries);
        }
        var chartSeries = {series: aAscSeries, parsedHeaders: {bLeft: true, bTop: true}};
        var oDrawing = new AscCommon.ParaDrawing( nW, nH, null, oDrawingDocument, this, null);
        var oChartSpace = AscFormat.DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        oChartSpace.setParent(oDrawing);
        oDrawing.Set_GraphicObject(oChartSpace);
        oDrawing.setExtent( oChartSpace.spPr.xfrm.extX, oChartSpace.spPr.xfrm.extY );
        return new ApiChart(oChartSpace);
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
        if (AscCommon.type_Paragraph === Type)
            return new ApiParagraph(this.Document.Content[nPos]);
        else if (AscCommon.type_Paragraph === Type)
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
        var nStyleType = AscCommon.styletype_Paragraph;
        if ("paragraph" === sType)
            nStyleType = AscCommon.styletype_Paragraph;
        else if ("table" === sType)
            nStyleType = AscCommon.styletype_Table;
        else if ("run" === sType)
            nStyleType = AscCommon.styletype_Character;
        else if ("numbering" === sType)
            nStyleType = AscCommon.styletype_Numbering;

        var oStyle        = new AscCommon.CStyle(sStyleName, null, null, nStyleType, false);
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
                oRun.Add_ToContent(nPos, new AscCommon.ParaSpace(), false);
            else
                oRun.Add_ToContent(nPos, new AscCommon.ParaText(nChar), false);
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
        oRun.Add_ToContent(0, new AscCommon.ParaNewLine(AscCommon.break_Page));
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
        oRun.Add_ToContent(0, new AscCommon.ParaNewLine(AscCommon.break_Line));
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
        oRun.Add_ToContent(0, new AscCommon.ParaNewLine(AscCommon.break_Column));
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
        oRun.Add_ToContent(0, new AscCommon.ParaTab());
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
                this.Run.Add_ToContent(nLastPos + nPos, new AscCommon.ParaSpace(), false);
            else
                this.Run.Add_ToContent(nLastPos + nPos, new AscCommon.ParaText(nChar), false);
        }
    };
    /**
     * Add a page break.
     */
    ApiRun.prototype.AddPageBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new AscCommon.ParaNewLine(AscCommon.break_Page));
    };
    /**
     * Add a line break.
     */
    ApiRun.prototype.AddLineBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new AscCommon.ParaNewLine(AscCommon.break_Line));
    };
    /**
     * Add a column break.
     */
    ApiRun.prototype.AddColumnBreak = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new AscCommon.ParaNewLine(AscCommon.break_Column));
    };
    /**
     * Add a tab stop.
     */
    ApiRun.prototype.AddTabStop = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new AscCommon.ParaTab());
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
        if (!oStyle || !(oStyle instanceof ApiStyle) || AscCommon.styletype_Table !== oStyle.Style.Get_Type())
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

        if (AscCommon.styletype_Paragraph === nStyleType)
            return "paragraph";
        else if (AscCommon.styletype_Table === nStyleType)
            return "table";
        else if (AscCommon.styletype_Character === nStyleType)
            return "run";
        else if (AscCommon.styletype_Numbering === nStyleType)
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
        if (AscCommon.styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTablePr(this, this.Style.TablePr.Copy());
    };
    /**
     * Get the table row properties of the current style.
     * @returns {?ApiTableRowPr} If the type of this style is not a <code>"table"</code> then it will return <code>null</code>.
     */
    ApiStyle.prototype.GetTableRowPr = function()
    {
        if (AscCommon.styletype_Table !== this.Style.Get_Type())
            return null;

        return new ApiTableRowPr(this, this.Style.TableRowPr.Copy());
    };
    /**
     * Get the table cell properties of the current style.
     * @returns {?ApiTableCellPr}
     */
    ApiStyle.prototype.GetTableCellPr = function()
    {
        if (AscCommon.styletype_Table !== this.Style.Get_Type())
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
            this.TextPr.HighLight = AscCommon.highlight_None;
        else
            this.TextPr.HighLight = new AscCommon.CDocumentColor(r, g, b, false);

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

        var oTabs = new AscCommon.CParaTabs();
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

        this.ParaPr.NumPr       = new AscCommon.CNumPr();
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
                this.Num.Set_Lvl_Bullet(this.Lvl, sSymbol, new AscCommon.CTextPr());
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
            this.TablePr.Jc = AscCommon.align_Left;
        else if ("right" === sJcType)
            this.TablePr.Jc = AscCommon.align_Right;
        else if ("center" === sJcType)
            this.TablePr.Jc = AscCommon.align_Center;
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
            this.TablePr.TableLayout = AscCommon.tbllayout_AutoFit;
        else if ("fixed" === sType)
            this.TablePr.TableLayout = AscCommon.tbllayout_Fixed;

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
            this.RowPr.Height = new AscCommon.CTableRowHeight(0, Asc.linerule_Auto);
        else if ("atLeast" === sHRule)
            this.RowPr.Height = new AscCommon.CTableRowHeight(private_Twips2MM(nValue), Asc.linerule_AtLeast);

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
            this.CellPr.VAlign = AscCommon.vertalignjc_Top;
        else if ("bottom" === sType)
            this.CellPr.VAlign = AscCommon.vertalignjc_Bottom;
        else if ("center" === sType)
            this.CellPr.VAlign = AscCommon.vertalignjc_Center;
        
        this.private_OnChange();
    };
    /**
     * Specify the direction of the text flow for this table cell.
     * @param {("lrtb" | "tbrl" | "btlr")} sType
     */
    ApiTableCellPr.prototype.SetTextDirection = function(sType)
    {
        if ("lrtb" === sType)
            this.CellPr.TextDirection = AscCommon.textdirection_LRTB;
        else if ("tbrl" === sType)
            this.CellPr.TextDirection = AscCommon.textdirection_TBRL;
        else if ("btlr" === sType)
            this.CellPr.TextDirection = AscCommon.textdirection_BTLR;

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
        if ("inline" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Inline);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_NONE);
            this.Drawing.Set_BehindDoc(false);
        }
        else if ("square" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_SQUARE);
            this.Drawing.Set_BehindDoc(false);
        }
        else if ("tight" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_TIGHT);
            this.Drawing.Set_BehindDoc(false);
        }
        else if ("through" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_THROUGH);
            this.Drawing.Set_BehindDoc(false);
        }
        else if ("topAndBottom" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_TOP_AND_BOTTOM);
            this.Drawing.Set_BehindDoc(false);
        }
        else if ("behind" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_NONE);
            this.Drawing.Set_BehindDoc(true);
        }
        else if ("inFront" === sType)
        {
            this.Drawing.Set_DrawingType(AscCommon.drawing_Anchor);
            this.Drawing.Set_WrappingType(AscCommon.WRAPPING_TYPE_NONE);
            this.Drawing.Set_BehindDoc(false);
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
     * Set the fill color of shape
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiShape.prototype.SetFillColor = function(r, g, b)
    {
        if(this.Shape)
        {
            this.Shape.spPr.setFill(AscFormat.CreateUnfilFromRGB(r, g, b));
        }
    };

    /**
     * Set the fill color of shape
     * @param {byte} r
     * @param {byte} g
     * @param {byte} b
     */
    ApiShape.prototype.SetLineColor = function(r, g, b)
    {
        if(this.Shape)
        {
            if(!this.Shape.spPr.ln)
            {
                this.Shape.recalculatePen();
                this.Shape.spPr.setLn(this.Shape.pen.createDuplicate());
            }
            this.Shape.spPr.ln.setFill(AscFormat.CreateUnfilFromRGB(r, g, b));
        }
    };

    /**
     * Set the line width color of shape
     * @param {EMU} nWidth
     */
    ApiShape.prototype.SetLineWidth = function(nWidth)
    {
        if(this.Shape)
        {
            if(!this.Shape.spPr.ln)
            {
                this.Shape.recalculatePen();
                this.Shape.spPr.setLn(this.Shape.pen.createDuplicate());
            }
            this.Shape.spPr.ln.setW(nWidth);
        }
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


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Export
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Api.prototype["GetDocument"]                     = Api.prototype.GetDocument;
    Api.prototype["CreateParagraph"]                 = Api.prototype.CreateParagraph;
    Api.prototype["CreateTable"]                     = Api.prototype.CreateTable;
    Api.prototype["CreateRun"]                       = Api.prototype.CreateRun;
    Api.prototype["CreateDrawing"]                   = Api.prototype.CreateDrawing;
    Api.prototype["CreateImage"]                     = Api.prototype.CreateImage;
    Api.prototype["CreateShape"]                     = Api.prototype.CreateShape;
    Api.prototype["CreateChart"]                     = Api.prototype.CreateChart;

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
    ApiShape.prototype["SetFillColor"]               = ApiShape.prototype.SetFillColor;
    ApiShape.prototype["SetLineColor"]               = ApiShape.prototype.SetLineColor;
    ApiShape.prototype["SetLineWidth"]               = ApiShape.prototype.SetLineWidth;
    ApiShape.prototype["GetDocContent"]              = ApiShape.prototype.GetDocContent;
    ApiShape.prototype["SetVerticalTextAlign"]       = ApiShape.prototype.SetVerticalTextAlign;

    ApiChart.prototype["GetClassType"]               = ApiChart.prototype.GetClassType;
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
        return new AscCommon.CDocumentColor(r, g, b, Auto ? Auto : false);
    }

    function private_GetTabStop(nPos, sValue)
    {
        var nType = AscCommon.tab_Left;
        if ("left" === sValue)
            nType = AscCommon.tab_Left;
        else if ("right" === sValue)
            nType = AscCommon.tab_Right;
        else if ("clear" === sValue)
            nType = AscCommon.tab_Clear;
        else if ("center" === sValue)
            nType = AscCommon.tab_Center;

        return new AscCommon.CParaTab(nType, private_Twips2MM(nPos));
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
        var oBorder = new AscCommon.CDocumentBorder();

        if ("none" === sType)
        {
            oBorder.Value = AscCommon.border_None;
            oBorder.Size  = 0;
            oBorder.Space = 0;
            oBorder.Color.Set(0, 0, 0, true);
        }
        else
        {
            if ("single" === sType)
                oBorder.Value = AscCommon.border_Single;

            oBorder.Size  = private_Pt_8ToMM(nSize);
            oBorder.Space = private_PtToMM(nSpace);
            oBorder.Color.Set(r, g, b);
        }

        return oBorder;
    }

    function private_GetTableMeasure(sType, nValue)
    {
        var nType = AscCommon.tblwidth_Auto;
        var nW    = 0;
        if ("auto" === sType)
        {
            nType = AscCommon.tblwidth_Auto;
            nW    = 0;
        }
        else if ("nil" === sType)
        {
            nType = AscCommon.tblwidth_Nil;
            nW    = 0;
        }
        else if ("percent" === sType)
        {
            nType = AscCommon.tblwidth_Pct;
            nW    = private_GetInt(nValue, null, null);
        }
        else if ("twips" === sType)
        {
            nType = AscCommon.tblwidth_Mm;
            nW    = private_Twips2MM(nValue);
        }

        return new AscCommon.CTableMeasurement(nType, nW);
    }

    function private_GetShd(sType, r, g, b, isAuto)
    {
        var oShd = new AscCommon.CDocumentShd();

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
    // TODO: Заполнить автофигуру
    oDrawing = Api.CreateShape("rect",5363210, 9655810);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 155575);
    oDrawing.SetVerPosition("page", 201295);
    oDrawing.SetFillColor(38, 38, 38);
    oDrawing.SetLineColor(38, 38, 38);

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


    oDrawing = Api.CreateShape("rect", 1880870, 9655810);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 5673725);
    oDrawing.SetVerPosition("page", 201295);
    oDrawing.SetFillColor(255, 104, 0);
    oDrawing.SetLineColor(255, 104, 0);
    oParagraph.AddDrawing(oDrawing);
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oNoSpacingStyle);
    // TODO: Заполнить aвтофигуру
    oDrawing = Api.CreateDrawing(5930900, 395605);
    oDrawing.SetWrappingStyle("topAndBottom");
    oDrawing.SetHorAlign("margin", "left");
    oDrawing.SetVerPosition("paragraph", 5715);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oParagraph.AddDrawing(oDrawing);
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    // TODO: Заполнить aвтофигуру
    oDrawing = Api.CreateDrawing(720725, 1204595);
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
    // TODO: Заполнить aвтофигуру
    oDrawing = Api.CreateDrawing(2695575, 2276475);
    oDrawing.SetWrappingStyle("tight");
    oDrawing.SetHorPosition("column", 3756901);
    oDrawing.SetVerPosition("paragraph", 473470);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oParagraph.AddDrawing(oDrawing);
    oParagraph.AddText("Summary");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
    // TODO: Заполнить автофигуру
    oDrawing = Api.CreateDrawing(3212465, 963295);
    oDrawing.SetWrappingStyle("topAndBottom");
    oDrawing.SetHorPosition("margin", 370205);
    oDrawing.SetVerPosition("paragraph", 1170888);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oParagraph.AddDrawing(oDrawing);
    oParagraph.AddText("After years of market research and focused creative effort we are in a position to take our “Innovate 1” to market. We have a three phase approach in place to complete the product and take the product to market.  The first step of this initiative is to test the market.  Once we have identified the market, then we will make any final product product to drive that effectively keeps down costs while meeting sales goals. ");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    oParagraph.SetStyle(oHeading1Style);
    oParagraph.SetSpacingAfter(100, true);
    oParagraph.SetSpacingBefore(100, true);
    // TODO: Заполнить автофигуру
    oDrawing = Api.CreateDrawing(4051300, 2347595);
    oDrawing.SetWrappingStyle("tight");
    oDrawing.SetHorPosition("column", 2347595);
    oDrawing.SetVerPosition("paragraph", 346075);
    oDrawing.SetDistances(114300, 0, 114300, 0);
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
    // TODO: Заполнить автофигуру
    oDrawing = Api.CreateDrawing(2718435, 762000);
    oDrawing.SetWrappingStyle("square");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerPosition("paragraph", 17780);
    oDrawing.SetDistances(114300, 0, 114300, 0);
    oParagraph.AddDrawing(oDrawing);
    oParagraph.AddText("Legal Issues");
    oDocument.Push(oParagraph);


    oParagraph = Api.CreateParagraph();
    // TODO: Заполнить автофигуру
    oDrawing = Api.CreateDrawing(2741295, 2273300);
    oDrawing.SetWrappingStyle("square");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerPosition("paragraph", 632460);
    oDrawing.SetDistances(114300, 0, 114300, 0);
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
            oDrawing = Api.CreateDrawing(495300, 481965);
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
    oDrawing = Api.CreateDrawing(1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);

    oDrawing = Api.CreateDrawing(1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetSize(2000 * 635, 2000 * 635);

    oDrawing = Api.CreateDrawing(1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("square");

    oDrawing = Api.CreateDrawing(1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorAlign("margin", "right");
    oDrawing.SetVerAlign("page", "bottom");

    oDrawing = Api.CreateDrawing(1000 * 635, 2000 * 635);
    oParagraph.AddDrawing(oDrawing);
    oDrawing.SetWrappingStyle("inFront");
    oDrawing.SetHorPosition("page", 36000 * 30);
    oDrawing.SetVerPosition("page", 36000 * 60);

    //------------------------------------------------------------------------------------------------------------------
    oLD.Recalculate_FromStart();
}

