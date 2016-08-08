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
(function (window, builder) {

    /**
     * @global
     * @class
     * @name Api
     */
    var Api = window["Asc"]["asc_docs_api"];

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
        ApiShape.superclass.constructor.call(this, oShape);
    }
    AscCommon.extendClass(ApiShape, ApiDrawing);

    /**
     * Class representing a image.
     * @constructor
     */
    function ApiImage(oImage){
        ApiImage.superclass.constructor.call(this, oImage);
    }
    AscCommon.extendClass(ApiImage, ApiDrawing);

    /**
     * Class representing a chart.
     * @constructor
     */
    function ApiChart(oChart){
        ApiChart.superclass.constructor.call(this, oChart);
    }
    AscCommon.extendClass(ApiChart, ApiDrawing);

    /**
     * Class representing a group of drawings.
     * @constructor
     */
    function ApiGroup(oGroup){
        ApiGroup.superclass.constructor.call(this, oGroup);
    }
    AscCommon.extendClass(ApiGroup, ApiDrawing);

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
        ApiSchemeColor.superclass.constructor.call(this, AscFormat.builder_CreateSchemeColor(sColorId));
    }
    AscCommon.extendClass(ApiSchemeColor, ApiUniColor);

    /**
     * Class representing a Preset Color
     * @constructor
     * */
    function ApiPresetColor(sPresetColor)
    {
        ApiPresetColor.superclass.constructor.call(this, AscFormat.builder_CreatePresetColor(sPresetColor));
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
        this.Ln = oLn;
    }

    /**
     * Class represent gradient stop
     * @constructor
     * */
    function ApiGradientStop(oApiUniColor, pos)
    {
        this.Gs = AscFormat.builder_CreateGradientStop(oApiUniColor.Unicolor, pos);
    }

    /**
     * Class representing a container for paragraphs
     * @param Document
     * @constructor
     */
    function ApiDrawingContent(Document)
    {
        this.Document = Document;
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
        ApiParagraph.superclass.constructor.call(this, this, Paragraph.Pr.Copy());
        this.Paragraph = Paragraph;
    }
    AscCommon.extendClass(ApiParagraph, ApiParaPr);

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
    * @typedef {("ArabicPeriod"  | "ArabicParenR"  | "RomanUcPeriod" | "RomanLcPeriod" | "AlphaLcParenR" | "AlphaLcPeriod" | "AlphaUcParenR" | "AlphaUcPeriod")} BulletType
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
     * @memberof Api
     * @returns {ApiSlide}
     */
    Api.prototype.CreateSlide = function(){
        var oPresentation = private_GetPresentation();
        var oSlide = new AscCommonSlide.Slide(oPresentation, oPresentation.slideLayouts[0], 0);
        return new ApiSlide(oSlide);
    };

    /**
     * Create a image.
     * @memberof Api
     * @param {string} sImageSrc
     * @param {EMU} nWidth
     * @param {EMU} nHeight
     * @returns {ApiImage}
     */
    Api.prototype.CreateImage = function(sImageSrc, nWidth, nHeight){
        var oImage = AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000);
        oImage.setParent(private_GetCurrentSlide());
        return new ApiImage(AscFormat.DrawingObjectsController.prototype.createImage(sImageSrc, 0, 0, nWidth/36000, nHeight/36000));
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
    Api.prototype.CreateShape = function(sType, nWidth, nHeight, oFill, oStroke){
        var oCurrentSlide = private_GetCurrentSlide();
        var oTheme = oCurrentSlide && oCurrentSlide.Layout && oCurrentSlide.Layout.Master && oCurrentSlide.Layout.Master.Theme;
        return new ApiShape(AscFormat.builder_CreateShape(sType, nWidth/36000, nHeight/36000, oFill.UniFill, oStroke.Ln, oCurrentSlide, oTheme, private_GetDrawingDocument(), false));
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
     * @param {number} nStyleIndex
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
        return new ApiFill(AscFormat.builder_CreateLinearGradient(aGradientStop, Angle));
    };

    /**
     * Create a radial gradient fill
     * @memberof Api
     * @param {Array} aGradientStop
     * @returns {ApiFill}
     */
    Api.prototype.CreateRadialGradientFill = function(aGradientStop)
    {
        return new ApiFill(AscFormat.builder_CreateRadialGradient(aGradientStop));
    };

    /**
     * Create a pattern fill
     * @memberof Api
     * @param {PatternType} sPatternType
     * @param {ApiUniColor} BgColor
     * @param {ApiUniColor} FgColor
     * @returns {ApiFill}
     */
    Api.prototype.CreatePatternFill = function(sPatternType, BgColor, FgColor)
    {
        return new ApiFill(AscFormat.builder_CreatePatternFill(sPatternType, BgColor, FgColor));
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
        return new ApiFill(AscFormat.builder_CreateBlipFill());
    };

    /**
     * Create no fill
     * @memberof Api
     * @returns {ApiFill}
     * */
    Api.prototype.CreateNoFill = function()
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
        return new ApiStroke(AscFormat.builder_CreateLine(nWidth, oFill));
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

    /**
     * Create a new paragraph.
     * @memberof Api
     * @returns {ApiParagraph}
     */
    Api.prototype.CreateParagraph = function()
    {
        return new ApiParagraph(new Paragraph(private_GetDrawingDocument(), null, 0, 0, 0, 0, 0, true));
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
     * Create a new bullet
     * @memberof Api
     * @returns {ApiBullet}
     * */
    Api.CreateBullet = function(sSymbol){
        var oBullet = new AscFormat.CBullet();
        oBullet.bulletType = new AscFormat.CBulletType();
        if(typeof sSymbol === "string" && sSymbol.length > 0){
            oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_CHAR;
            oBullet.bulletType.Char = sSymbol[0];
        }
        else{
            oBullet.bulletType.type = AscFormat.BULLET_TYPE_BULLET_NONE;
        }
    };

    /**
     * Create a new numbering
     * @memberof Api
     * @returns {ApiBullet}
     * */

    Api.CreateNumbering = function(sType, nStartAt){
        var oBullet = new AscFormat.CBullet();
        oBullet.bulletType = new AscFormat.CBulletType();


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
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
            case "AlphaLcParenR":{
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
            case "AlphaLcPeriod":{
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
            case "AlphaUcParenR":{
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
            case "AlphaUcPeriod":{
                oBullet.bulletType.AutoNumType = 12;
                break;
            }
        }

        switch(sType){
            case "bulletTypeArabicPeriod":{
                var numberingType = 12;//numbering_numfmt_arabicPeriod;
                break;
            }
            case "bulletTypeArabicParenR":
                {
                    numberingType = 11;//numbering_numfmt_arabicParenR;
                    break;
                }
            case "bulletTyperomanUcPeriod":
                {
                    numberingType = 34;//numbering_numfmt_romanUcPeriod;
                    break;
                }
            case "bulletTypeArabicPeriod":
                {
                    numberingType = 5;//numbering_numfmt_alphaUcPeriod;
                    break;
                }
            case "bulletTypeArabicPeriod":
                {
                    numberingType = 8;
                    break;
                }
            case "bulletTypeArabicPeriod":
                {
                    numberingType = 40;
                    break;
                }
            case "bulletTypeArabicPeriod":
                {
                    numberingType = 31;//numbering_numfmt_romanLcPeriod;
                    break;
                }

        }
    };

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiPresentation
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"presentation"}
     */
    ApiPresentation.prototype.GetClassType = function()
    {
        return "presentation";
    };

    /**
     * Returns current slide index
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
     * Returns slide by index
     * @memberof ApiPresentation
     * @param {number} nIndex
     * @returns {?ApiSlide}
     */
    ApiPresentation.prototype.GetSlideByIndex = function(nIndex){
        if(this.Presentation && this.Presentation.Slides[nIndex]){
            return new ApiSlide(this.Presentation.Slides[nIndex]);
        }
        return null;
    };

    /**
     * Returns current slide
     * @memberof ApiPresentation
     * @returns {?ApiSlide}
     */
    ApiPresentation.prototype.GetCurrentSlide = function () {
        return this.GetSlideByIndex(this.GetCurSlideIndex());
    };


    /**
     * Adds slide to end
     * @memberof ApiPresentation
     * @param {ApiSlide} oSlide
     */
    ApiPresentation.prototype.AddSlide = function(oSlide) {
        if(this.Presentation){
            oSlide.Slide.setSlideNum(this.Presentation.Slides.length);
            this.Presentation.insertSlide(this.Presentation.Slides.length, oSlide.Slide);
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

    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiSlide
    //
    //------------------------------------------------------------------------------------------------------------------

    /**
     * Get the type of this class.
     * @returns {"slide"}
     */
    ApiSlide.prototype.GetClassType = function()
    {
        return "slide";
    };
    /**


    /**
     * Removes all objects from slide
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
     * Add object on slide. Returns position
     * @memberof ApiSlide
     */
    ApiSlide.prototype.AddObject = function(oDrawing){
        if(this.Slide){
            oDrawing.Drawing.setParent(this.Slide);
            this.Slide.shapeAdd(undefined, oDrawing.Drawing);
        }
    };

    /**
     * Spicifies slide's background
     * @memberOf ApiSlide
     * @param {ApiFill} oApiFill
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
     * Getting slide width
     * */
    ApiSlide.prototype.GetWidth = function(){
        if(this.Slide){
            return this.Slide.Width*36000;
        }
        return 0;
    };

    /**
     * Getting slide height
     * */
    ApiSlide.prototype.GetHeight = function(){
        if(this.Slide){
            return this.Slide.Height*36000;
        }
        return 0;
    };
    //------------------------------------------------------------------------------------------------------------------
    //
    // ApiDrawingContent
    //
    //------------------------------------------------------------------------------------------------------------------


    /**
     * Get the type of this class.
     * @returns {"drawingContent"}
     */
    ApiDrawingContent.prototype.GetClassType = function()
    {
        return "drawingContent";
    };
    /**
     * Get the number of elements.
     * @returns {number}
     */
    ApiDrawingContent.prototype.GetElementsCount = function()
    {
        return this.Document.Content.length;
    };
    /**
     * Get element by position
     * @returns {ApiParagraph}
     */
    ApiDrawingContent.prototype.GetElement = function(nPos)
    {
        if (!this.Document.Content[nPos])
            return null;

        var Type = this.Document.Content[nPos].Get_Type();
        if (type_Paragraph === Type)
            return new ApiParagraph(this.Document.Content[nPos]);

        return null;
    };
    /**
     * Add paragraph or table by position
     * @param {number} nPos
     * @param {ApiParagraph} oElement
     */
    ApiDrawingContent.prototype.AddElement = function(nPos, oElement)
    {
        if (oElement instanceof ApiParagraph)
        {
            this.Document.Internal_Content_Add(nPos, oElement.private_GetImpl(), false);
        }
    };
    /**
     * Push paragraph or table
     * @param {ApiParagraph} oElement
     */
    ApiDrawingContent.prototype.Push = function(oElement)
    {
        if (oElement instanceof ApiParagraph)
        {
            this.Document.Internal_Content_Add(this.Document.Content.length, oElement.private_GetImpl(), false);
            return true;
        }

        return false;
    };
    /**
     * Remove all elements from the current document.
     */
    ApiDrawingContent.prototype.RemoveAllElements = function()
    {
        this.Document.Content = [];
    };
    /**
     * Remove element by specified position.
     * @param {number} nPos
     */
    ApiDrawingContent.prototype.RemoveElement = function(nPos)
    {
        if (nPos < 0 || nPos >= this.GetElementsCount())
            return;

        this.Document.Internal_Content_Remove(nPos, 1);
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
     * Get paragraph properties.
     * @returns {ApiParaPr}
     */
    ApiParagraph.prototype.GetParaPr = function()
    {
        return new ApiParaPr(this, this.Paragraph.Pr.Copy());
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
            return null;
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
     * Add a tab stop.
     */
    ApiRun.prototype.AddTabStop = function()
    {
        this.Run.Add_ToContent(this.Run.Content.length, new ParaTab());
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
     * @param {ApiFill} oFill
     *
     */
    ApiTextPr.prototype.SetFill = function(oFill)
    {
        this.TextPr.Unifill = oFill.UniFill;
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
        if(this.Drawing && this.Drawing.spPr && this.Drawing.spPr.xfrm)
        {
            this.Drawing.spPr.xfrm.setExtX(fWidth);
            this.Drawing.spPr.xfrm.setExtY(fHeight);
        }
    };

    /**
     * Set the size of the bounding box.
     * @param {EMU} nWidth
     * @param {EMU} nHeight
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
     * @returns {"shape"}
     */
    ApiShape.prototype.GetClassType = function()
    {
        return "shape";
    };


    /**
     * Get content of this shape.
     * @returns {?ApiDrawingContent}
     */
    ApiShape.prototype.GetDocContent = function()
    {
        if(this.Drawing && this.Drawing.txBody && this.Drawing.txBody.content)
        {
            return new ApiDrawingContent(this.Drawing.txBody.content);
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
     *  @param {hps} nFontSize
     */
    ApiChart.prototype.SetTitle = function (sTitle, nFontSize)
    {
        AscFormat.builder_SetChartTitle(this.Chart);
    };

    /**
     *  Specifies a horizontal axis title
     *  @param {string} sTitle
     *  @param {hps} nFontSize
     * */
    ApiChart.prototype.SetHorAxisTitle = function (sTitle, nFontSize)
    {
        AscFormat.builder_SetChartHorAxisTitle(this.Chart, sTitle, nFontSize);
    };

    /**
     *  Specifies a vertical axis title
     *  @param {string} sTitle
     *  @param {hps} nFontSize
     * */
    ApiChart.prototype.SetVerAxisTitle = function (sTitle, nFontSize)
    {
        AscFormat.builder_SetChartVertAxisTitle(this.Chart, sTitle, nFontSize);
    };

    /**
     * Specifies a legend position
     * @param {"left" | "top" | "right" | "bottom" | "none"} sLegendPos
     * */
    ApiChart.prototype.SetLegendPos = function(sLegendPos)
    {
        AscFormat.builder_SetChartLegendPos(this.Chart, sLegendPos);
    };

    /**
     * Spicifies a show options for data labels
     * @param {boolean} bShowSerName
     * @param {boolean} bShowCatName
     * @param {boolean} bShowVal
     * */
    ApiChart.prototype.SetShowDataLabels = function(bShowSerName, bShowCatName, bShowVal)
    {
        AscFormat.builder_SetShowDataLabels(this.Chart, bShowSerName, bShowCatName, bShowVal);
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
    Api.prototype["GetPresentation"]                 = Api.prototype.GetPresentation;
    Api.prototype["CreateSlide"]                     = Api.prototype.CreateSlide;
    Api.prototype["CreateImage"]                     = Api.prototype.CreateImage;
    Api.prototype["CreateShape"]                     = Api.prototype.CreateShape;
    Api.prototype["CreateChart"]                     = Api.prototype.CreateChart;
    Api.prototype["CreateGroup"]                     = Api.prototype.CreateGroup;
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
    Api.prototype["CreateParagraph"]                 = Api.prototype.CreateParagraph;
    Api.prototype["CreateRun"]                       = Api.prototype.CreateRun;

    ApiPresentation.prototype["GetClassType"]        = ApiPresentation.prototype.GetClassType;
    ApiPresentation.prototype["GetCurSlideIndex"]    = ApiPresentation.prototype.GetCurSlideIndex;
    ApiPresentation.prototype["GetSlideByIndex"]     = ApiPresentation.prototype.GetSlideByIndex;
    ApiPresentation.prototype["GetCurrentSlide"]     = ApiPresentation.prototype.GetCurrentSlide;
    ApiPresentation.prototype["AddSlide"]            = ApiPresentation.prototype.AddSlide;
    ApiPresentation.prototype["CreateNewHistoryPoint"] = ApiPresentation.prototype.CreateNewHistoryPoint;

    ApiSlide.prototype["GetClassType"]               = ApiSlide.prototype.GetClassType;
    ApiSlide.prototype["RemoveAllObjects"]           = ApiSlide.prototype.RemoveAllObjects;
    ApiSlide.prototype["AddObject"]                  = ApiSlide.prototype.AddObject;
    ApiSlide.prototype["SetBackground"]              = ApiSlide.prototype.SetBackground;
    ApiSlide.prototype["GetWidth"]                   = ApiSlide.prototype.GetWidth;
    ApiSlide.prototype["GetHeight"]                  = ApiSlide.prototype.GetHeight;

    ApiDrawingContent.prototype["GetClassType"]      = ApiDrawingContent.prototype.GetClassType;
    ApiDrawingContent.prototype["GetElementsCount"]  = ApiDrawingContent.prototype.GetElementsCount;
    ApiDrawingContent.prototype["GetElement"]        = ApiDrawingContent.prototype.GetElement;
    ApiDrawingContent.prototype["AddElement"]        = ApiDrawingContent.prototype.AddElement;
    ApiDrawingContent.prototype["Push"]              = ApiDrawingContent.prototype.Push;
    ApiDrawingContent.prototype["RemoveAllElements"] = ApiDrawingContent.prototype.RemoveAllElements;
    ApiDrawingContent.prototype["RemoveElement"]     = ApiDrawingContent.prototype.RemoveElement;

    ApiParagraph.prototype["GetClassType"]           = ApiParagraph.prototype.GetClassType;
    ApiParagraph.prototype["AddText"]                = ApiParagraph.prototype.AddText;
    ApiParagraph.prototype["GetParaPr"]              = ApiParagraph.prototype.GetParaPr;
    ApiParagraph.prototype["GetElementsCount"]       = ApiParagraph.prototype.GetElementsCount;
    ApiParagraph.prototype["GetElement"]             = ApiParagraph.prototype.GetElement;
    ApiParagraph.prototype["RemoveElement"]          = ApiParagraph.prototype.RemoveElement;
    ApiParagraph.prototype["RemoveAllElements"]      = ApiParagraph.prototype.RemoveAllElements;
    ApiParagraph.prototype["AddElement"]             = ApiParagraph.prototype.AddElement;

    ApiRun.prototype["GetClassType"]                 = ApiRun.prototype.GetClassType;
    ApiRun.prototype["GetTextPr"]                    = ApiRun.prototype.GetTextPr;
    ApiRun.prototype["ClearContent"]                 = ApiRun.prototype.ClearContent;
    ApiRun.prototype["AddText"]                      = ApiRun.prototype.AddText;
    ApiRun.prototype["AddTabStop"]                   = ApiRun.prototype.AddTabStop;

    ApiTextPr.prototype["GetClassType"]              = ApiTextPr.prototype.GetClassType;
    ApiTextPr.prototype["SetBold"]                   = ApiTextPr.prototype.SetBold;
    ApiTextPr.prototype["SetItalic"]                 = ApiTextPr.prototype.SetItalic;
    ApiTextPr.prototype["SetStrikeout"]              = ApiTextPr.prototype.SetStrikeout;
    ApiTextPr.prototype["SetUnderline"]              = ApiTextPr.prototype.SetUnderline;
    ApiTextPr.prototype["SetFontFamily"]             = ApiTextPr.prototype.SetFontFamily;
    ApiTextPr.prototype["SetFontSize"]               = ApiTextPr.prototype.SetFontSize;
    ApiTextPr.prototype["SetFill"]                   = ApiTextPr.prototype.SetFill;
    ApiTextPr.prototype["SetVertAlign"]              = ApiTextPr.prototype.SetVertAlign;
    ApiTextPr.prototype["SetSpacing"]                = ApiTextPr.prototype.SetSpacing;
    ApiTextPr.prototype["SetDoubleStrikeout"]        = ApiTextPr.prototype.SetDoubleStrikeout;
    ApiTextPr.prototype["SetCaps"]                   = ApiTextPr.prototype.SetCaps;
    ApiTextPr.prototype["SetSmallCaps"]              = ApiTextPr.prototype.SetSmallCaps;

    ApiParaPr.prototype["GetClassType"]              = ApiParaPr.prototype.GetClassType;
    ApiParaPr.prototype["SetIndLeft"]                = ApiParaPr.prototype.SetIndLeft;
    ApiParaPr.prototype["SetIndRight"]               = ApiParaPr.prototype.SetIndRight;
    ApiParaPr.prototype["SetIndFirstLine"]           = ApiParaPr.prototype.SetIndFirstLine;
    ApiParaPr.prototype["SetJc"]                     = ApiParaPr.prototype.SetJc;
    ApiParaPr.prototype["SetSpacingLine"]            = ApiParaPr.prototype.SetSpacingLine;
    ApiParaPr.prototype["SetSpacingBefore"]          = ApiParaPr.prototype.SetSpacingBefore;
    ApiParaPr.prototype["SetSpacingAfter"]           = ApiParaPr.prototype.SetSpacingAfter;

    ApiDrawing.prototype["GetClassType"]             =  ApiDrawing.prototype.GetClassType;
    ApiDrawing.prototype["SetSize"]                  =  ApiDrawing.prototype.SetSize;
    ApiDrawing.prototype["SetPosition"]              =  ApiDrawing.prototype.SetPosition;

    ApiImage.prototype["GetClassType"]               =  ApiImage.prototype.GetClassType;

    ApiShape.prototype["GetClassType"]               =  ApiShape.prototype.GetClassType;
    ApiShape.prototype["GetDocContent"]              =  ApiShape.prototype.GetDocContent;
    ApiShape.prototype["SetVerticalTextAlign"]       =  ApiShape.prototype.SetVerticalTextAlign;

    ApiChart.prototype["GetClassType"]               =  ApiChart.prototype.GetClassType;
    ApiChart.prototype["SetTitle"]                   =  ApiChart.prototype.SetTitle;
    ApiChart.prototype["SetHorAxisTitle"]            =  ApiChart.prototype.SetHorAxisTitle;
    ApiChart.prototype["SetVerAxisTitle"]            =  ApiChart.prototype.SetVerAxisTitle;
    ApiChart.prototype["SetLegendPos"]               =  ApiChart.prototype.SetLegendPos;
    ApiChart.prototype["SetShowDataLabels"]          =  ApiChart.prototype.SetShowDataLabels;

    ApiFill.prototype["GetClassType"]                =  ApiFill.prototype.GetClassType;

    ApiStroke.prototype["GetClassType"]              =  ApiStroke.prototype.GetClassType;

    ApiGradientStop.prototype["GetClassType"]        =  ApiGradientStop.prototype.GetClassType;

    ApiUniColor.prototype["GetClassType"]            =  ApiUniColor.prototype.GetClassType;

    ApiRGBColor.prototype["GetClassType"]            =  ApiRGBColor.prototype.GetClassType;

    ApiSchemeColor.prototype["GetClassType"]         =  ApiSchemeColor.prototype.GetClassType;

    ApiPresetColor.prototype["GetClassType"]         =  ApiPresetColor.prototype.GetClassType;

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
            return editor.m_oDrawingDocument;
        }
        return null;
    }

    function private_PushElementToParagraph(oPara, oElement)
    {
        // Добавляем не в конец из-за рана с символом конца параграфа TODO: ParaEnd
        oPara.Add_ToContent(oPara.Content.length - 1, oElement);
    }

    function private_GetPresentation(){
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
    ApiTextPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeTextPr(this);
    };
    ApiParaPr.prototype.private_OnChange = function()
    {
        this.Parent.OnChangeParaPr(this);
    };

})(window, null);
