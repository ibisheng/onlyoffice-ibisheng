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
(function (window, builder) {

    /**
     * @global
     * @class
     * @name Api
     */
    var Api = window["Asc"]["asc_docs_api"] || window["Asc"]["spreadsheet_api"];

    /**
     * Class representing a presentation.
     * @constructor
     */
    function ApiPresentation(oPresentation){
        this.Presentation = oPresentation;
    }

    /**
     * Class representing a slide.
     * @constructor
     */
    function ApiSlide(oSlide){
        this.Slide = oSlide;
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
     * Class representing a shape.
     * @constructor
     */
    function ApiShape(oShape){
		ApiDrawing.call(this, oShape);
        this.Shape = oShape;
    }
	ApiShape.prototype = Object.create(ApiDrawing.prototype);
	ApiShape.prototype.constructor = ApiShape;

    /**
     * Class representing a image.
     * @constructor
     */
    function ApiImage(oImage){
		ApiDrawing.call(this, oImage);
    }
	ApiImage.prototype = Object.create(ApiDrawing.prototype);
	ApiImage.prototype.constructor = ApiImage;

    /**
     * Class representing a chart.
     * @constructor
     */
    function ApiChart(oChart){
		ApiDrawing.call(this, oChart);
        this.Chart = oChart;
    }
	ApiChart.prototype = Object.create(ApiDrawing.prototype);
	ApiChart.prototype.constructor = ApiChart;

    /**
     * Class representing a group of drawings.
     * @constructor
     */
    function ApiGroup(oGroup){
		ApiDrawing.call(this, oGroup);
    }
	ApiGroup.prototype = Object.create(ApiDrawing.prototype);
	ApiGroup.prototype.constructor = ApiGroup;


	/**
     * Represents table in presentation
     * @param oGraphicFrame
     * @constructor
     * */
	function ApiTable(oGraphicFrame){
	    this.Table = oGraphicFrame.graphicObject;
	    ApiDrawing.call(this, oGraphicFrame);
    }

    ApiTable.prototype = Object.create(ApiDrawing.prototype);
    ApiTable.prototype.constructor = ApiTable;




    /**
     * Represents table row
     * @param oTableRow
     * @constructor
     */

    function ApiTableRow(oTableRow){
        this.Row = oTableRow;
    }


    /**
     * Represents table cell
     * @param oCell
     * @constructor
     */
    function ApiTableCell(oCell){
        this.Cell = oCell;
    }


    /**
     * Twentieths of a point (equivalent to 1/1440th of an inch).
     * @typedef {number} twips
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
     * English measure unit. 1mm = 36000EMUs, 1inch = 914400EMUs
     * @typedef {number} EMU
     */

    /**
     * This type specifies the preset shape geometry that is to be used for a shape
     * @typedef {("accentBorderCallout1" | "accentBorderCallout2" | "accentBorderCallout3" | "accentCallout1" | "accentCallout2" | "accentCallout3" | "actionButtonBackPrevious" | "actionButtonBeginning" | "actionButtonBlank" | "actionButtonDocument" | "actionButtonEnd" | "actionButtonForwardNext" | "actionButtonHelp" | "actionButtonHome" | "actionButtonInformation" | "actionButtonMovie" | "actionButtonReturn" | "actionButtonSound" | "arc" | "bentArrow" | "bentConnector2" | "bentConnector3" | "bentConnector4" | "bentConnector5" | "bentUpArrow" | "bevel" | "blockArc" | "borderCallout1" | "borderCallout2" | "borderCallout3" | "bracePair" | "bracketPair" | "callout1" | "callout2" | "callout3" | "can" | "chartPlus" | "chartStar" | "chartX" | "chevron" | "chord" | "circularArrow" | "cloud" | "cloudCallout" | "corner" | "cornerTabs" | "cube" | "curvedConnector2" | "curvedConnector3" | "curvedConnector4" | "curvedConnector5" | "curvedDownArrow" | "curvedLeftArrow" | "curvedRightArrow" | "curvedUpArrow" | "decagon" | "diagStripe" | "diamond" | "dodecagon" | "donut" | "doubleWave" | "downArrow" | "downArrowCallout" | "ellipse" | "ellipseRibbon" | "ellipseRibbon2" | "flowChartAlternateProcess" | "flowChartCollate" | "flowChartConnector" | "flowChartDecision" | "flowChartDelay" | "flowChartDisplay" | "flowChartDocument" | "flowChartExtract" | "flowChartInputOutput" | "flowChartInternalStorage" | "flowChartMagneticDisk" | "flowChartMagneticDrum" | "flowChartMagneticTape" | "flowChartManualInput" | "flowChartManualOperation" | "flowChartMerge" | "flowChartMultidocument" | "flowChartOfflineStorage" | "flowChartOffpageConnector" | "flowChartOnlineStorage" | "flowChartOr" | "flowChartPredefinedProcess" | "flowChartPreparation" | "flowChartProcess" | "flowChartPunchedCard" | "flowChartPunchedTape" | "flowChartSort" | "flowChartSummingJunction" | "flowChartTerminator" | "foldedCorner" | "frame" | "funnel" | "gear6" | "gear9" | "halfFrame" | "heart" | "heptagon" | "hexagon" | "homePlate" | "horizontalScroll" | "irregularSeal1" | "irregularSeal2" | "leftArrow" | "leftArrowCallout" | "leftBrace" | "leftBracket" | "leftCircularArrow" | "leftRightArrow" | "leftRightArrowCallout" | "leftRightCircularArrow" | "leftRightRibbon" | "leftRightUpArrow" | "leftUpArrow" | "lightningBolt" | "line" | "lineInv" | "mathDivide" | "mathEqual" | "mathMinus" | "mathMultiply" | "mathNotEqual" | "mathPlus" | "moon" | "nonIsoscelesTrapezoid" | "noSmoking" | "notchedRightArrow" | "octagon" | "parallelogram" | "pentagon" | "pie" | "pieWedge" | "plaque" | "plaqueTabs" | "plus" | "quadArrow" | "quadArrowCallout" | "rect" | "ribbon" | "ribbon2" | "rightArrow" | "rightArrowCallout" | "rightBrace" | "rightBracket" | "round1Rect" | "round2DiagRect" | "round2SameRect" | "roundRect" | "rtTriangle" | "smileyFace" | "snip1Rect" | "snip2DiagRect" | "snip2SameRect" | "snipRoundRect" | "squareTabs" | "star10" | "star12" | "star16" | "star24" | "star32" | "star4" | "star5" | "star6" | "star7" | "star8" | "straightConnector1" | "stripedRightArrow" | "sun" | "swooshArrow" | "teardrop" | "trapezoid" | "triangle" | "upArrowCallout" | "upDownArrow" | "upDownArrow" | "upDownArrowCallout" | "uturnArrow" | "verticalScroll" | "wave" | "wedgeEllipseCallout" | "wedgeRectCallout" | "wedgeRoundRectCallout")} ShapeType
     */

    /**
    * This type specifies the bullet type
    * @typedef {("None" | "ArabicPeriod"  | "ArabicParenR"  | "RomanUcPeriod" | "RomanLcPeriod" | "AlphaLcParenR" | "AlphaLcPeriod" | "AlphaUcParenR" | "AlphaUcPeriod")} BulletType
    */


    /**
     * This type specifies the types, create charts
     * @typedef {("bar" | "barStacked" | "barStackedPercent" | "bar3D" | "barStacked3D" | "barStackedPercent3D" | "barStackedPercent3DPerspective" | "horizontalBar" | "horizontalBarStacked" | "horizontalBarStackedPercent" | "horizontalBar3D" | "horizontalBarStacked3D" | "horizontalBarStackedPercent3D" | "lineNormal" | "lineStacked" | "lineStackedPercent" | "line3D" | "pie" | "pie3D" | "doughnut" | "scatter" | "stock" | "area" | "areaStacked" | "areaStackedPercent")} ChartType
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
     *
     * @typedef {("none" | "nextTo" | "low" | "high")} TickLabelPosition
     * **/

    /**
     * @typedef {"tile" | "stretch"} BlipFillType
     * */

    /**
     * @typedef {"cross" | "dashDnDiag" | "dashHorz" | "dashUpDiag" | "dashVert" | "diagBrick" | "diagCross" | "divot" | "dkDnDiag" | "dkHorz" | "dkUpDiag" | "dkVert" | "dnDiag" | "dotDmnd" | "dotGrid" | "horz" | "horzBrick" | "lgCheck" | "lgConfetti" | "lgGrid" | "ltDnDiag" | "ltHorz" | "ltUpDiag" | "ltVert" | "narHorz" | "narVert" | "openDmnd" | "pct10" | "pct20" | "pct25" | "pct30" | "pct40" | "pct5" | "pct50" | "pct60" | "pct70" | "pct75" | "pct80" | "pct90" | "plaid" | "shingle" | "smCheck" | "smConfetti" | "smGrid" | "solidDmnd" | "sphere" | "trellis" | "upDiag" | "vert" | "wave" | "wdDnDiag" | "wdUpDiag" | "weave" | "zigZag"} PatternType
     * */



    /**
     * @typedef {("cross" | "in" | "none" | "out")} TickMark
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
     * Get the main presentation.
     * @typeofeditors ["CPE"]
     * @memberof Api
     * @returns {ApiPresentation}
     */
    Api.prototype.GetPresentation = function(){
        if(this.WordControl && this.WordControl.m_oLogicDocument){
            return new ApiPresentation(this.WordControl.m_oLogicDocument);
        }
        return null;
    };

    /**
     * Create a new slide.
     * @typeofeditors ["CPE"]
     * @memberof Api
     * @returns {ApiSlide}
     */
    Api.prototype.CreateSlide = function(){
        var oPresentation = private_GetPresentation();
        var oSlide = new AscCommonSlide.Slide(oPresentation, oPresentation.slideMasters[0].sldLayoutLst[0], 0);
        oSlide.setNotes(AscCommonSlide.CreateNotes());
        oSlide.notes.setNotesMaster(oPresentation.notesMasters[0]);
        oSlide.notes.setSlide(oSlide);
        return new ApiSlide(oSlide);
    };

    /**
     * Create an image with the parameters specified.
     * @memberof Api
     * @typeofeditors ["CPE"]
     * @param {string} sImageSrc - The image source where the image to be inserted should be taken from (currently
     * only internet URL or Base64 encoded images are supported).
     * @param {EMU} nWidth - The image width in English measure units.
     * @param {EMU} nHeight - The image height in English measure units.
     * @returns {ApiImage}
     */
    Api.prototype.CreateImage = function(sImageSrc, nWidth, nHeight){
        var oImage = AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000);
        oImage.setParent(private_GetCurrentSlide());
        return new ApiImage(AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000));
    };

    /**
     * Create a shape with the parameters specified.
     * @memberof Api
     * @typeofeditors ["CPE"]
     * @param {ShapeType} [sType="rect"] - The shape type which specifies the preset shape geometry.
     * @param {EMU} nWidth - The shape width in English measure units.
     * @param {EMU} nHeight - The shape height in English measure units.
     * @param {ApiFill} oFill - The color or pattern used to fill the shape.
     * @param {ApiStroke} oStroke - The stroke used to create the element shadow.
     * @returns {ApiShape}
     * */
    Api.prototype.CreateShape = function(sType, nWidth, nHeight, oFill, oStroke){
        var oCurrentSlide = private_GetCurrentSlide();
        var oTheme = oCurrentSlide && oCurrentSlide.Layout && oCurrentSlide.Layout.Master && oCurrentSlide.Layout.Master.Theme;
        return new ApiShape(AscFormat.builder_CreateShape(sType, nWidth/36000, nHeight/36000, oFill.UniFill, oStroke.Ln, oCurrentSlide, oTheme, private_GetDrawingDocument(), false));
    };

    /**
     * Create a chart with the parameters specified.
     * @memberof Api
     * @typeofeditors ["CPE"]
     * @param {ChartType} [sType="bar"] - The chart type used for the chart display.
     * @param {Array} aSeries - The array of the data used to build the chart from.
     * @param {Array} aSeriesNames - The array of the names (the source table column names) used for the data which the chart will be build from.
     * @param {Array} aCatNames - The array of the names (the source table row names) used for the data which the chart will be build from.
     * @param {EMU} nWidth - The chart width in English measure units.
     * @param {EMU} nHeight - 	The chart height in English measure units.
     * @param {number} nStyleIndex - 	The chart color style index (can be <b>1 - 48</b>, as described in OOXML specification).
     * @returns {ApiChart}
     * */
    Api.prototype.CreateChart = function(sType, aSeries, aSeriesNames, aCatNames, nWidth, nHeight, nStyleIndex)
    {
        var oChartSpace = AscFormat.builder_CreateChart(nWidth/36000, nHeight/36000, sType, aCatNames, aSeriesNames, aSeries, nStyleIndex);
        oChartSpace.setParent(private_GetCurrentSlide());
        return new ApiChart(oChartSpace);
    };


    /**
     * Create a group of drawings.
     * @memberof Api
     * @returns {ApiGroup}
     * */
    Api.prototype.CreateGroup = function(aDrawings){
        var oSlide = private_GetCurrentSlide();
        if(oSlide){
            var oGroup = AscFormat.builder_CreateGroup(aDrawings, oSlide.graphicObjects);
            if(oGroup){
                return new ApiGroup(oGroup);
            }
        }
        return null;
    };


    /**
     * Create table
     * @param nCols
     * @param nRows
     * @returns {?ApiTable}
     */
    Api.prototype.CreateTable = function(nCols, nRows){
        var oPresentation = private_GetPresentation();
        var oSlide = private_GetCurrentSlide();
        if(oPresentation && oSlide){
            var oGraphicFrame = oPresentation.Create_TableGraphicFrame(nCols, nRows, oSlide, oPresentation.DefaultTableStyleId);
            var content = oGraphicFrame.graphicObject.Content, i, j;
            for(i = 0; i < content.length; ++i)
            {
                content[i].Set_Height(0, Asc.linerule_AtLeast );
            }
            return new ApiTable(oGraphicFrame);
        }
        return null;
    };

    /**
     * Create a new paragraph.
     * @memberof Api
     * @typeofeditors ["CPE"]
     * @returns {ApiParagraph}
     */
    Api.prototype.CreateParagraph = function()
    {
        var oDrawingDocument = null;
        if(this.GetActiveSheet){
            var oWorksheet = this.GetActiveSheet();
            if(oWorksheet){
                oDrawingDocument = oWorksheet.DrawingDocument;
            }
        }
        else{
            oDrawingDocument = private_GetDrawingDocument();
        }
        return this.private_CreateApiParagraph(new Paragraph(oDrawingDocument, null, true));
    };


    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiPresentation
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @typeofeditors ["CPE"]
     * @returns {"presentation"}
     */
    ApiPresentation.prototype.GetClassType = function()
    {
        return "presentation";
    };

    /**
     * Get the index for the current slide.
     * @typeofeditors ["CPE"]
     * @memberof ApiPresentation
     * @returns {number}
     */
    ApiPresentation.prototype.GetCurSlideIndex = function(){
        if(this.Presentation){
            return this.Presentation.CurPage;
        }
        return -1;
    };


    /**
     * Get the slide by its position in the presentation.
     * @memberof ApiPresentation
     * @param {number} nIndex - The slide number (position) in the presentation.
     * @returns {?ApiSlide}
     */
    ApiPresentation.prototype.GetSlideByIndex = function(nIndex){
        if(this.Presentation && this.Presentation.Slides[nIndex]){
            return new ApiSlide(this.Presentation.Slides[nIndex]);
        }
        return null;
    };

    /**
     * Get the current slide.
     * @typeofeditors ["CPE"]
     * @memberof ApiPresentation
     * @returns {?ApiSlide}
     */
    ApiPresentation.prototype.GetCurrentSlide = function () {
        return this.GetSlideByIndex(this.GetCurSlideIndex());
    };


    /**
     * Append a new slide to the end of the presentation.
     * @typeofeditors ["CPE"]
     * @memberof ApiPresentation
     * @param {ApiSlide} oSlide - The slide created using the {@link Api#CreateSlide} method.
     */
    ApiPresentation.prototype.AddSlide = function(oSlide) {
        if(this.Presentation){
            oSlide.Slide.setSlideNum(this.Presentation.Slides.length);
            this.Presentation.insertSlide(this.Presentation.Slides.length, oSlide.Slide);
        }
    };



    /**
     * Set the size for the current presentation.
     * @typeofeditors ["CPE"]
     * @memberof ApiPresentation
     /* {EMU} nWidth - The presentation width in English measure units.
     /* {EMU} nHeight - The presentation height in English measure units.
     */
    ApiPresentation.prototype.SetSizes = function(nWidth, nHeight) {
        if(this.Presentation){
            var width = nWidth/36000.0;
            var height = nHeight/36000.0;
            History.Add(new AscDFH.CChangesDrawingsObjectNoId(this.Presentation, AscDFH.historyitem_Presentation_SlideSize, new AscFormat.CDrawingBaseCoordsWritable(this.Presentation.Width,  this.Presentation.Height), new AscFormat.CDrawingBaseCoordsWritable(width,  height)));
            this.Presentation.Width = width;
            this.Presentation.Height = height;
            this.Presentation.changeSlideSizeFunction(this.Presentation.Width, this.Presentation.Height);

        }
    };
    /**
     * Create new history point.
     */
    ApiPresentation.prototype.CreateNewHistoryPoint = function()
    {
        this.Presentation.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApiBuilder);
    };


    /**
     * Replace current image
     */
    ApiPresentation.prototype.ReplaceCurrentImage = function(sImageUrl, Width, Height)
    {
        var oPr = this.Presentation;
        if(oPr.Slides[oPr.CurPage]){
            var _slide = oPr.Slides[oPr.CurPage];
            var oController = _slide.graphicObjects;
            var _w = Width/36000.0;
            var _h = Height/36000.0;
            var oImage = oController.createImage(sImageUrl, 0, 0, _w, _h);
            oImage.setParent(_slide);
            var selectedObjects, spTree;
            if(oController.selection.groupSelection){
                selectedObjects = oController.selection.groupSelection.selectedObjects;
            }
            else{
                selectedObjects = oController.selectedObjects;
            }
            if(selectedObjects.length > 0 && !oController.getTargetDocContent()){
                if(selectedObjects[0].group){
                    spTree = selectedObjects[0].group.spTree;
                }
                else{
                    spTree = _slide.cSld.spTree;
                }
                for(var i = 0; i < spTree.length; ++i){
                    if(spTree[i] === selectedObjects[0]){
                        var _xfrm = spTree[i].spPr && spTree[i].spPr.xfrm;
                        var _xfrm2 = oImage.spPr.xfrm;
                        if(_xfrm){
                            _xfrm2.setOffX(_xfrm.offX);
                            _xfrm2.setOffY(_xfrm.offY);
                            //_xfrm2.setRot(_xfrm.rot);
                        }
                        else{
                            if(AscFormat.isRealNumber(spTree[i].x) && AscFormat.isRealNumber(spTree[i].y)){
                                _xfrm2.setOffX(spTree[i].x);
                                _xfrm2.setOffY(spTree[i].y);
                            }
                        }
                        if(selectedObjects[0].group){
                            var _group = selectedObjects[0].group;
                            _group.removeFromSpTreeByPos(i);
                            _group.addToSpTree(i, oImage);
                            oImage.setGroup(_group);
                            oController.selection.groupSelection.resetInternalSelection();
                            _group.selectObject(oImage, oPr.CurPage);
                        }
                        else{
                            _slide.removeFromSpTreeByPos(i);
                            _slide.addToSpTreeToPos(i, oImage);
                            oController.resetSelection();
                            oController.selectObject(oImage, oPr.CurPage);
                        }
                        return;
                    }
                }
            }
            var _x = (this.Presentation.Width - _w)/2.0;
            var _y = (this.Presentation.Height - _h)/2.0;
            oImage.spPr.xfrm.setOffX(_x);
            oImage.spPr.xfrm.setOffY(_y);
            _slide.addToSpTreeToPos(_slide.cSld.spTree.length, oImage);
            oController.resetSelection();
            oController.selectObject(oImage, oPr.CurPage);
        }
    };


    /**

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiSlide
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @typeofeditors ["CPE"]
     * @returns {"slide"}
     */
    ApiSlide.prototype.GetClassType = function()
    {
        return "slide";
    };
    /**


    /**
     * Remove all the objects from the current slide.
     * @typeofeditors ["CPE"]
     * @memberof ApiSlide
     */
    ApiSlide.prototype.RemoveAllObjects =  function(){
        if(this.Slide){
            var spTree = this.Slide.cSld.spTree;
            for(var i = spTree.length - 1; i > -1; --i){
                this.Slide.removeFromSpTreeById(spTree[i].Get_Id());
            }
        }
    };

    /**
     * Add an object (image, shape or chart) to the current presentation slide.
     * @typeofeditors ["CPE"]
     * @memberof ApiSlide
     * @param {ApiDrawing} oDrawing - The object which will be added to the current presentation slide.
     */
    ApiSlide.prototype.AddObject = function(oDrawing){
        if(this.Slide){
            oDrawing.Drawing.setParent(this.Slide);
            this.Slide.shapeAdd(undefined, oDrawing.Drawing);
        }
    };

    /**
     * Set the background to the current presentation slide.
     * @memberOf ApiSlide
     * @typeofeditors ["CPE"]
     * @param {ApiFill} oApiFill - The color or pattern used to fill the presentation slide background.
     * */
    ApiSlide.prototype.SetBackground = function(oApiFill){
        if(this.Slide){
            var bg       = new AscFormat.CBg();
            bg.bgPr      = new AscFormat.CBgPr();
            bg.bgPr.Fill = oApiFill.UniFill;
            this.Slide.changeBackground(bg);
        }
    };


    /**
     * Get the slide width in English measure units.
     * @typeofeditors ["CPE"]
     * @returns {EMU}
     * */
    ApiSlide.prototype.GetWidth = function(){
        if(this.Slide){
            return this.Slide.Width*36000;
        }
        return 0;
    };

    /**
     * Get the slide height in English measure units.
     * @typeofeditors ["CPE"]
     * @returns {EMU}
     * */
    ApiSlide.prototype.GetHeight = function(){
        if(this.Slide){
            return this.Slide.Height*36000;
        }
        return 0;
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
     * Set the size of the object (image, shape, chart) bounding box.
     * @param {EMU} nWidth - The object width measured in English measure units.
     * @param {EMU} nHeight - The object height measured in English measure units.
     */
    ApiDrawing.prototype.SetSize = function(nWidth, nHeight)
    {
        var fWidth = private_EMU2MM(nWidth);
        var fHeight = private_EMU2MM(nHeight);
        if(this.Drawing && this.Drawing.spPr && this.Drawing.spPr.xfrm)
        {
            this.Drawing.spPr.xfrm.setExtX(fWidth);
            this.Drawing.spPr.xfrm.setExtY(fHeight);
        }
    };

    /**
     * Set the position of the drawing on the slide.
     * @param {EMU} nPosX - The distance from the left side of the slide to left side of the drawing measured in English measure units.
     * @param {EMU} nPosY - The distance from the top side of the slide to the upper side of the drawing measured in English measure units.
     */
    ApiDrawing.prototype.SetPosition = function(nPosX, nPosY)
    {
        var fPosX = private_EMU2MM(nPosX);
        var fPosY = private_EMU2MM(nPosY);
        if(this.Drawing && this.Drawing.spPr && this.Drawing.spPr.xfrm)
        {
            this.Drawing.spPr.xfrm.setOffX(fPosX);
            this.Drawing.spPr.xfrm.setOffY(fPosY);
        }
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
     * @typeofeditors ["CPE"]
     * @returns {"shape"}
     */
    ApiShape.prototype.GetClassType = function()
    {
        return "shape";
    };


    /**
     * Get content of this shape.
     * @typeofeditors ["CPE"]
     * @returns {?ApiDocumentContent}
     */
    ApiShape.prototype.GetDocContent = function()
    {
        var oApi = private_GetApi();
        if(oApi && this.Drawing && this.Drawing.txBody && this.Drawing.txBody.content)
        {
            return oApi.private_CreateApiDocContent(this.Drawing.txBody.content);
        }
        return null;
    };

    /**
     * Set shape's content vertical align
     * @typeofeditors ["CPE"]
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
     * @typeofeditors ["CPE"]
     * @returns {"chart"}
     */
    ApiChart.prototype.GetClassType = function()
    {
        return "chart";
    };

    /**
     *  Specifies a chart title
     *  @typeofeditors ["CPE"]
     *  @param {string} sTitle - The title which will be displayed for the current chart.
     *  @param {hps} nFontSize - 	The text size value measured in points.
     *  @param {?bool} bIsBold
     */
    ApiChart.prototype.SetTitle = function (sTitle, nFontSize, bIsBold)
    {
        AscFormat.builder_SetChartTitle(this.Chart, sTitle, nFontSize, bIsBold);
    };

    /**
     *  Specifies a horizontal axis title
     *  @typeofeditors ["CPE"]
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
     *  @typeofeditors ["CPE"]
     *  @param {string} sTitle - The title which will be displayed for the vertical axis of the current chart.
     *  @param {hps} nFontSize - The text size value measured in points.
     *  @param {?bool} bIsBold
     * */
    ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize, bIsBold)
    {
        AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize, bIsBold);
    };

    /**
     * Specifies a legend position
     * @typeofeditors ["CPE"]
     * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos - The position of the chart legend inside the chart window.
     * */
    ApiChart.prototype.SetLegendPos = function(sLegendPos)
    {
        AscFormat.builder_SetChartLegendPos(this.Chart, sLegendPos);
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
     * Spicifies a show options for data labels
     * @typeofeditors ["CPE"]
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
    // ApiTable
    //
    //------------------------------------------------------------------------------------------------------------------
    /**
     * Returns type of object
     * @returns {"table"};
     * */
    ApiTable.prototype.GetClassType = function(){
        return "table";
    };


    /**
     * Returns row by index
     * @param nIndex {number}
     * @returns {?ApiTableRow}
     * */
    ApiTable.prototype.GetRow = function(nIndex){
        if(!this.Drawing){
            return null;
        }
        var aTableContent = this.Table.Content;
        if(!aTableContent[nIndex]){
            return null;
        }
        return new ApiTableRow(aTableContent[nIndex]);
    };

    /**
     * Merge array of cells. If merge was done successfully it will return merged cell, otherwise "null".
     * <b>Warning</b>: The number of cells in any row and the numbers of rows in the current table may be changed.
     * @param {ApiTableCell[]} aCells
     * @returns {?ApiTableCell}
     */
    ApiTable.prototype.MergeCells = function(aCells)
    {
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


        if (true === isMerged)
            return new ApiTableCell(oMergedCell);

        return null;
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
    /**
     * Specify the components of the conditional formatting of the referenced table style (if one exists)
     * which shall be applied to the set of table rows with the current table-level property exceptions. A table style
     * can specify up to six different optional conditional formats [Example: Different formatting for first column.
     * end example], which then can be applied or omitted from individual table rows in the parent table.
     *
     * The default setting is to apply the row and column banding formatting, but not the first row, last row, first
     * column, or last column formatting.
     * @param {boolean} isFirstColumn - Specifies that the first column conditional formatting shall be applied to the
     *     table.
     * @param {boolean} isFirstRow - Specifies that the first row conditional formatting shall be applied to the table.
     * @param {boolean} isLastColumn - Specifies that the last column conditional formatting shall be applied to the
     *     table.
     * @param {boolean} isLastRow - Specifies that the last row conditional formatting shall be applied to the table.
     * @param {boolean} isHorBand - Specifies that the horizontal banding conditional formatting shall not be applied
     *     to the table.
     * @param {boolean} isVerBand - Specifies that the vertical banding conditional formatting shall not be applied to
     *     the table.
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
        this.private_PrepareTableForActions();
        this.Table.RemoveSelection();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.RemoveTableRow());
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
        this.private_PrepareTableForActions();
        this.Table.RemoveSelection();
        this.Table.CurCell = oCell.Cell;
        var isEmpty = !(this.Table.RemoveTableColumn());

        return isEmpty;
    };

    /**
     * Specify the shading which shall be applied to the extents of the current table.
     * @param {?ApiFill} oApiFill
     */

    ApiTable.prototype.SetShd = function(oApiFill)
    {
        var oPr = this.Table.Pr.Copy();
        if(!oApiFill){
            oPr.Shd = null;
        }
        else{
            var oShd = new CDocumentShd();
            oShd.Value = Asc.c_oAscShdClear;
            oShd.Unifill = oApiFill.UniFill;
            oPr.Shd = oShd;
        }
        this.Table.Set_Pr(oPr);
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


    /**
     * Set the height of the current table row within the current table.
     * @param {EMU} [nValue]
     */
    ApiTableRow.prototype.SetHeight = function(nValue)
    {
        this.Row.Set_Height(nValue/36000, Asc.linerule_AtLeast)
    };



    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiTableRow
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
     * Returns cell content
     * @returns {ApiDocumentContent}
     */
    ApiTableCell.prototype.GetContent = function(){
        var oApi = private_GetApi();
        return oApi.private_CreateApiDocContent(this.Cell.Content);

    };


    /**
     * Specify the shading which shall be applied to the extents of the current table cell.
     * @param {?ApiFill} oApiFill
     */
    ApiTableCell.prototype.SetShd = function(oApiFill)
    {
        var oPr = this.Cell.Pr.Copy();
        if(!oApiFill){
            oPr.Shd = null;
        }
        else{
            var oShd = new CDocumentShd();
            oShd.Value = Asc.c_oAscShdClear;
            oShd.Unifill = oApiFill.UniFill;
            oPr.Shd = oShd;
        }
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Specifies the amount of space which shall be left between the bottom extent of the cell contents and the border
     * of a specific table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCell.prototype.SetCellMarginBottom = function(nValue)
    {
        var oPr = this.Cell.Pr.Copy();
        if (!oPr.TableCellMar)
        {
            oPr.TableCellMar =
                {
                    Bottom : undefined,
                    Left   : undefined,
                    Right  : undefined,
                    Top    : undefined
                };
        }

        if (null === nValue)
            oPr.TableCellMar.Bottom = undefined;
        else
            oPr.TableCellMar.Bottom = private_GetTableMeasure("twips", nValue);
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Specifies the amount of space which shall be left between the left extent of the current cell contents and the
     * left edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCell.prototype.SetCellMarginLeft = function(nValue)
    {
        var oPr = this.Cell.Pr.Copy();
        if (!oPr.TableCellMar)
        {
            oPr.TableCellMar =
                {
                    Bottom : undefined,
                    Left   : undefined,
                    Right  : undefined,
                    Top    : undefined
                };
        }

        if (null === nValue)
            oPr.TableCellMar.Left = undefined;
        else
            oPr.TableCellMar.Left = private_GetTableMeasure("twips", nValue);
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Specifies the amount of space which shall be left between the right extent of the current cell contents and the
     * right edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCell.prototype.SetCellMarginRight = function(nValue)
    {
        var oPr = this.Cell.Pr.Copy();
        if (!oPr.TableCellMar)
        {
            oPr.TableCellMar =
                {
                    Bottom : undefined,
                    Left   : undefined,
                    Right  : undefined,
                    Top    : undefined
                };
        }

        if (null === nValue)
            oPr.TableCellMar.Right = undefined;
        else
            oPr.TableCellMar.Right = private_GetTableMeasure("twips", nValue);
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Specifies the amount of space which shall be left between the top extent of the current cell contents and the
     * top edge border of a specific individual table cell within a table.
     * @param {?twips} nValue - If this value is <code>null</code>, then default table cell bottom margin shall be used,
     * otherwise override the table cell bottom margin with specified value for the current cell.
     */
    ApiTableCell.prototype.SetCellMarginTop = function(nValue)
    {
        var oPr = this.Cell.Pr.Copy();
        if (!oPr.TableCellMar)
        {
            oPr.TableCellMar =
                {
                    Bottom : undefined,
                    Left   : undefined,
                    Right  : undefined,
                    Top    : undefined
                };
        }

        if (null === nValue)
            oPr.TableCellMar.Top = undefined;
        else
            oPr.TableCellMar.Top = private_GetTableMeasure("twips", nValue);
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Set the border which shall be displayed at the bottom of the current table cell.
     * @param {mm} fSize - The width of the current border.
     * @param {ApiFill} oApiFill
     */
    ApiTableCell.prototype.SetCellBorderBottom = function(fSize, oApiFill)
    {
        var oBorder = new CDocumentBorder();
        oBorder.Value = border_Single;
        oBorder.Size  = fSize;
        oBorder.Space = 0;
        oBorder.Unifill = oApiFill.UniFill;
        var oPr = this.Cell.Pr.Copy();
        oPr.TableCellBorders.Bottom = oBorder;
        this.Cell.Set_Pr(oPr);
    };

    /**
     * Set the border which shall be displayed at the left of the current table cell.
     * @param {mm} fSize - The width of the current border.
     * @param {ApiFill} oApiFill
     */
    ApiTableCell.prototype.SetCellBorderLeft = function(fSize, oApiFill)
    {
        var oBorder = new CDocumentBorder();
        oBorder.Value = border_Single;
        oBorder.Size  = fSize;
        oBorder.Space = 0;
        oBorder.Unifill = oApiFill.UniFill;
        var oPr = this.Cell.Pr.Copy();
        oPr.TableCellBorders.Left = oBorder;
        this.Cell.Set_Pr(oPr);
    };

    /**
     * Set the border which shall be displayed at the right of the current table cell.
     * @param {mm} fSize - The width of the current border.
     * @param {ApiFill} oApiFill
     */
    ApiTableCell.prototype.SetCellBorderRight = function(fSize, oApiFill)
    {
        var oBorder = new CDocumentBorder();
        oBorder.Value = border_Single;
        oBorder.Size  = fSize;
        oBorder.Space = 0;
        oBorder.Unifill = oApiFill.UniFill;
        var oPr = this.Cell.Pr.Copy();
        oPr.TableCellBorders.Right = oBorder;
        this.Cell.Set_Pr(oPr);
    };

    /**
     * Set the border which shall be displayed at the top of the current table cell.
     * @param {mm} fSize - The width of the current border.
     * @param {ApiFill} oApiFill
     */
    ApiTableCell.prototype.SetCellBorderTop = function(fSize, oApiFill)
    {
        var oBorder = new CDocumentBorder();
        oBorder.Value = border_Single;
        oBorder.Size  = fSize;
        oBorder.Space = 0;
        oBorder.Unifill = oApiFill.UniFill;
        var oPr = this.Cell.Pr.Copy();
        oPr.TableCellBorders.Top = oBorder;
        this.Cell.Set_Pr(oPr);
    };

    /**
     * Specify the vertical alignment for text within the current table cell.
     * @param {("top" | "center" | "bottom")} sType
     */
    ApiTableCell.prototype.SetVerticalAlign = function(sType)
    {
        var oPr = this.Cell.Pr.Copy();
        if ("top" === sType)
            oPr.VAlign = vertalignjc_Top;
        else if ("bottom" === sType)
            oPr.VAlign = vertalignjc_Bottom;
        else if ("center" === sType)
            oPr.VAlign = vertalignjc_Center;
        this.Cell.Set_Pr(oPr);
    };
    /**
     * Specify the direction of the text flow for this table cell.
     * @param {("lrtb" | "tbrl" | "btlr")} sType
     */
    ApiTableCell.prototype.SetTextDirection = function(sType)
    {
        var oPr = this.Cell.Pr.Copy();
        if ("lrtb" === sType)
            oPr.TextDirection = textdirection_LRTB;
        else if ("tbrl" === sType)
            oPr.TextDirection = textdirection_TBRL;
        else if ("btlr" === sType)
            oPr.TextDirection = textdirection_BTLR;
        this.Cell.Set_Pr(oPr);
    };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Export
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    Api.prototype["GetPresentation"]                 = Api.prototype.GetPresentation;
    Api.prototype["CreateSlide"]                     = Api.prototype.CreateSlide;
    Api.prototype["CreateImage"]                     = Api.prototype.CreateImage;
    Api.prototype["CreateShape"]                     = Api.prototype.CreateShape;
    Api.prototype["CreateChart"]                     = Api.prototype.CreateChart;
    Api.prototype["CreateGroup"]                     = Api.prototype.CreateGroup;
    Api.prototype["CreateTable"]                     = Api.prototype.CreateTable;
    Api.prototype["CreateParagraph"]                 = Api.prototype.CreateParagraph;

    ApiPresentation.prototype["GetClassType"]          = ApiPresentation.prototype.GetClassType;
    ApiPresentation.prototype["GetCurSlideIndex"]      = ApiPresentation.prototype.GetCurSlideIndex;
    ApiPresentation.prototype["GetSlideByIndex"]       = ApiPresentation.prototype.GetSlideByIndex;
    ApiPresentation.prototype["GetCurrentSlide"]       = ApiPresentation.prototype.GetCurrentSlide;
    ApiPresentation.prototype["AddSlide"]              = ApiPresentation.prototype.AddSlide;
    ApiPresentation.prototype["CreateNewHistoryPoint"] = ApiPresentation.prototype.CreateNewHistoryPoint;
    ApiPresentation.prototype["SetSizes"]              = ApiPresentation.prototype.SetSizes;
    ApiPresentation.prototype["ReplaceCurrentImage"]   = ApiPresentation.prototype.ReplaceCurrentImage;

    ApiSlide.prototype["GetClassType"]               = ApiSlide.prototype.GetClassType;
    ApiSlide.prototype["RemoveAllObjects"]           = ApiSlide.prototype.RemoveAllObjects;
    ApiSlide.prototype["AddObject"]                  = ApiSlide.prototype.AddObject;
    ApiSlide.prototype["SetBackground"]              = ApiSlide.prototype.SetBackground;
    ApiSlide.prototype["GetWidth"]                   = ApiSlide.prototype.GetWidth;
    ApiSlide.prototype["GetHeight"]                  = ApiSlide.prototype.GetHeight;

    ApiDrawing.prototype["GetClassType"]             =  ApiDrawing.prototype.GetClassType;
    ApiDrawing.prototype["SetSize"]                  =  ApiDrawing.prototype.SetSize;
    ApiDrawing.prototype["SetPosition"]              =  ApiDrawing.prototype.SetPosition;

    ApiImage.prototype["GetClassType"]               =  ApiImage.prototype.GetClassType;

    ApiShape.prototype["GetClassType"]               =  ApiShape.prototype.GetClassType;
    ApiShape.prototype["GetDocContent"]              =  ApiShape.prototype.GetDocContent;
    ApiShape.prototype["SetVerticalTextAlign"]       =  ApiShape.prototype.SetVerticalTextAlign;

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

    ApiChart.prototype["SetHorAxisMajorTickMark"]      =  ApiChart.prototype.SetHorAxisMajorTickMark;
    ApiChart.prototype["SetHorAxisMinorTickMark"]      =  ApiChart.prototype.SetHorAxisMinorTickMark;
    ApiChart.prototype["SetVertAxisMajorTickMark"]     =  ApiChart.prototype.SetVertAxisMajorTickMark;
    ApiChart.prototype["SetVertAxisMinorTickMark"]     =  ApiChart.prototype.SetVertAxisMinorTickMark;
    ApiChart.prototype["SetMajorVerticalGridlines"]  =  ApiChart.prototype.SetMajorVerticalGridlines;
    ApiChart.prototype["SetMinorVerticalGridlines"]  =  ApiChart.prototype.SetMinorVerticalGridlines;
    ApiChart.prototype["SetMajorHorizontalGridlines"]  =  ApiChart.prototype.SetMajorHorizontalGridlines;
    ApiChart.prototype["SetMinorHorizontalGridlines"]  =  ApiChart.prototype.SetMinorHorizontalGridlines;
    ApiChart.prototype["SetHorAxisLablesFontSize"]  =  ApiChart.prototype.SetHorAxisLablesFontSize;
    ApiChart.prototype["SetVertAxisLablesFontSize"]  =  ApiChart.prototype.SetVertAxisLablesFontSize;

    ApiTable.prototype["GetClassType"] = ApiTable.prototype.GetClassType;
    ApiTable.prototype["GetRow"]       = ApiTable.prototype.GetRow;
    ApiTable.prototype["MergeCells"]   = ApiTable.prototype.MergeCells;
    ApiTable.prototype["SetTableLook"] = ApiTable.prototype.SetTableLook;
    ApiTable.prototype["AddRow"]       = ApiTable.prototype.AddRow;
    ApiTable.prototype["AddColumn"]    = ApiTable.prototype.AddColumn;
    ApiTable.prototype["RemoveRow"]    = ApiTable.prototype.RemoveRow;
    ApiTable.prototype["RemoveColumn"] = ApiTable.prototype.RemoveColumn;
    ApiTable.prototype["SetShd"]       = ApiTable.prototype.SetShd;

    ApiTableRow.prototype["GetClassType"] = ApiTableRow.prototype.GetClassType;
    ApiTableRow.prototype["GetCellsCount"] = ApiTableRow.prototype.GetCellsCount;
    ApiTableRow.prototype["GetCell"] = ApiTableRow.prototype.GetCell;
    ApiTableRow.prototype["SetHeight"] = ApiTableRow.prototype.SetHeight;



    ApiTableCell.prototype["GetClassType"] = ApiTableCell.prototype.GetClassType;
    ApiTableCell.prototype["GetContent"] = ApiTableCell.prototype.GetContent;
    ApiTableCell.prototype["SetShd"]  = ApiTableCell.prototype.SetShd;
    ApiTableCell.prototype["SetCellMarginBottom"] = ApiTableCell.prototype.SetCellMarginBottom;
    ApiTableCell.prototype["SetCellMarginLeft"] = ApiTableCell.prototype.SetCellMarginLeft;
    ApiTableCell.prototype["SetCellMarginRight"] = ApiTableCell.prototype.SetCellMarginRight;
    ApiTableCell.prototype["SetCellMarginTop"] = ApiTableCell.prototype.SetCellMarginTop;
    ApiTableCell.prototype["SetCellBorderBottom"] = ApiTableCell.prototype.SetCellBorderBottom;
    ApiTableCell.prototype["SetCellBorderLeft"] = ApiTableCell.prototype.SetCellBorderLeft;
    ApiTableCell.prototype["SetCellBorderRight"] = ApiTableCell.prototype.SetCellBorderRight;
    ApiTableCell.prototype["SetCellBorderTop"] = ApiTableCell.prototype.SetCellBorderTop;
    ApiTableCell.prototype["SetVerticalAlign"] = ApiTableCell.prototype.SetVerticalAlign;
    ApiTableCell.prototype["SetTextDirection"] = ApiTableCell.prototype.SetTextDirection;



    function private_GetCurrentSlide(){
        var oApiPresentation = editor.GetPresentation();
        if(oApiPresentation){
            var oApiSlide = oApiPresentation.GetCurrentSlide();
            if(oApiSlide){
                return oApiSlide.Slide;
            }
        }
        return null;
    }

    function private_GetDrawingDocument(){
        if(editor.WordControl){
            return editor.WordControl.m_oDrawingDocument;
        }
        return null;
    }

    function private_GetPresentation(){
        return editor.WordControl.m_oLogicDocument;
    }

    function private_EMU2MM(EMU)
    {
        return EMU / 36000.0;
    }

    function private_GetApi(){
        return editor;
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
    function private_Twips2MM(twips)
    {
        return 25.4 / 72.0 / 20 * twips;
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
})(window, null);
