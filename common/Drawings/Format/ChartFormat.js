/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {


    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    var drawingContentChanges = window['AscDFH'].drawingContentChanges;

    drawingsChangesMap[AscDFH.historyitem_DLbl_SetDelete]         = function(oClass, value){oClass.bDelete        = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetDLblPos]        = function(oClass, value){oClass.dLblPos        = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetIdx]            = function(oClass, value){oClass.idx            = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetLayout]         = function(oClass, value){oClass.layout         = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetNumFmt]         = function(oClass, value){oClass.numFmt         = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetSeparator]      = function(oClass, value){oClass.separator      = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowBubbleSize] = function(oClass, value){oClass.showBubbleSize = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowCatName]    = function(oClass, value){oClass.showCatName    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowLegendKey]  = function(oClass, value){oClass.showLegendKey  = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowPercent]    = function(oClass, value){oClass.showPercent    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowSerName]    = function(oClass, value){oClass.showSerName    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetShowVal]        = function(oClass, value){oClass.showVal        = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetSpPr]           = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetTx]             = function(oClass, value){oClass.tx             = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbl_SetTxPr]           = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetCatAx]      = function(oClass, value){oClass.catAx  = value;};
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetDateAx]     = function(oClass, value){oClass.dateAx = value;};
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetDTable]     = function(oClass, value){oClass.dTable = value;};
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetLayout]     = function(oClass, value){oClass.layout = value;};
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetSpPr]       = function(oClass, value){oClass.spPr   = value;};
    drawingsChangesMap[AscDFH.historyitem_CommonChartFormat_SetParent]  = function(oClass, value){oClass.parent  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_Set3D]              = function(oClass, value){oClass.b3D  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetGapDepth]        = function(oClass, value){oClass.gapDepth  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetShape]           = function(oClass, value){oClass.shape  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetBarDir]        = function(oClass, value){oClass.barDir   = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetDLbls]         = function(oClass, value){oClass.dLbls    = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetGapWidth]      = function(oClass, value){oClass.gapWidth  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetGrouping]      = function(oClass, value){oClass.grouping  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetOverlap]       = function(oClass, value){oClass.overlap  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetSerLines]        = function(oClass, value){oClass.serLines = value;};
    drawingsChangesMap[AscDFH.historyitem_BarChart_SetVaryColors]      = function(oClass, value){oClass.varyColors = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaChart_SetDLbls]          = function(oClass, value){oClass.dLbls    = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaChart_SetDropLines]      = function(oClass, value){oClass.dropLines = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaChart_SetGrouping]       = function(oClass, value){oClass.grouping = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaChart_SetVaryColors]     = function(oClass, value){oClass.varyColors = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetCat]           = function(oClass, value){oClass.cat   = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetDLbls]         = function(oClass, value){oClass.dLbls = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetErrBars]           = function(oClass, value){oClass.errBars       = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetIdx]               = function(oClass, value){oClass.idx           = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetOrder]             = function(oClass, value){oClass.order         = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetPictureOptions]    = function(oClass, value){oClass.pictureOptions = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetSpPr]              = function(oClass, value){oClass.spPr          = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetTrendline]         = function(oClass, value){oClass.trendline     = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetTx]                = function(oClass, value){oClass.tx            = value;};
    drawingsChangesMap[AscDFH.historyitem_AreaSeries_SetVal]               = function(oClass, value){oClass.val           = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetAuto]                       = function(oClass, value){oClass.auto           = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetAxId]                       = function(oClass, value){oClass.axId           = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetAxPos]                      = function(oClass, value){oClass.axPos          = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetCrossAx]                    = function(oClass, value){oClass.crossAx        = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetCrosses]                    = function(oClass, value){oClass.crosses        = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetCrossesAt]                  = function(oClass, value){oClass.crossesAt      = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetDelete]                     = function(oClass, value){oClass.bDelete        = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetLblAlgn]                    = function(oClass, value){oClass.lblAlgn        = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetLblOffset]                  = function(oClass, value){oClass.lblOffset      = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetMajorGridlines]             = function(oClass, value){oClass.majorGridlines = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetMajorTickMark]              = function(oClass, value){oClass.majorTickMark  = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetMinorGridlines]             = function(oClass, value){oClass.minorGridlines = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetMinorTickMark]              = function(oClass, value){oClass.minorTickMark  = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetNoMultiLvlLbl]              = function(oClass, value){oClass.noMultiLvlLbl  = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetNumFmt]                     = function(oClass, value){oClass.numFmt         = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetScaling]                    = function(oClass, value){oClass.scaling        = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetSpPr]                       = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetTickLblPos]                 = function(oClass, value){oClass.tickLblPos     = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetTickLblSkip]                = function(oClass, value){oClass.tickLblSkip    = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetTickMarkSkip]               = function(oClass, value){oClass.tickMarkSkip   = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetTitle]                      = function(oClass, value){oClass.title          = value;};
    drawingsChangesMap[AscDFH.historyitem_CatAxSetTxPr]                       = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxAuto]                         = function(oClass, value){oClass.auto             = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxAxId]                         = function(oClass, value){oClass.axId             = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxAxPos]                        = function(oClass, value){oClass.axPos            = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxBaseTimeUnit]                 = function(oClass, value){oClass.baseTimeUnit     = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxCrossAx]                      = function(oClass, value){oClass.crossAx          = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxCrosses]                      = function(oClass, value){oClass.crosses          = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxCrossesAt]                    = function(oClass, value){oClass.crossesAt       = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxDelete]                       = function(oClass, value){oClass.bDelete           = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxLblOffset]                    = function(oClass, value){oClass.lblOffset        = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMajorGridlines]               = function(oClass, value){oClass.majorGridlines   = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMajorTickMark]                = function(oClass, value){oClass.majorTickMark    = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMajorTimeUnit]                = function(oClass, value){oClass.majorTimeUnit    = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMajorUnit]                    = function(oClass, value){oClass.majorUnit        = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMajorGridlines]               = function(oClass, value){oClass.majorGridlines   = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMinorTickMark]                = function(oClass, value){oClass.minorTickMark    = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMinorTimeUnit]                = function(oClass, value){oClass.minorTimeUnit    = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxMinorUnit]                    = function(oClass, value){oClass.minorUnit        = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxNumFmt]                       = function(oClass, value){oClass.numFmt           = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxScaling]                      = function(oClass, value){oClass.scaling          = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxSpPr]                         = function(oClass, value){oClass.spPr             = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxTickLblPos]                   = function(oClass, value){oClass.tickLblPos       = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxTitle]                        = function(oClass, value){oClass.title            = value;};
    drawingsChangesMap[AscDFH.historyitem_DateAxTxPr]                         = function(oClass, value){oClass.txPr             = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetAxId]                       = function(oClass, value){oClass.axId           = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetAxPos]                      = function(oClass, value){oClass.axPos          = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetCrossAx]                    = function(oClass, value){oClass.crossAx        = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetCrosses]                    = function(oClass, value){oClass.crosses        = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetCrossesAt]                  = function(oClass, value){oClass.crossesAt      = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetDelete]                     = function(oClass, value){oClass.delete         = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetMajorGridlines]             = function(oClass, value){oClass.majorGridlines = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetMajorTickMark]              = function(oClass, value){oClass.majorTickMark  = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetMinorGridlines]             = function(oClass, value){oClass.minorGridlines = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetMinorTickMark]              = function(oClass, value){oClass.minorTickMark  = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetNumFmt]                     = function(oClass, value){oClass.numFmt         = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetScaling]                    = function(oClass, value){oClass.scaling        = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetSpPr]                       = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetTickLblPos]                 = function(oClass, value){oClass.tickLblPos     = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetTickLblSkip]                = function(oClass, value){oClass.tickLblSkip    = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetTickMarkSkip]               = function(oClass, value){oClass.tickMarkSkip   = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetTitle]                      = function(oClass, value){oClass.title          = value;};
    drawingsChangesMap[AscDFH.historyitem_SerAxSetTxPr]                       = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetAxId]                       = function(oClass, value){oClass.axId            = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetAxPos]                      = function(oClass, value){oClass.axPos           = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetCrossAx]                    = function(oClass, value){oClass.crossAx         = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetCrossBetween]               = function(oClass, value){oClass.crossBetween    = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetCrosses]                    = function(oClass, value){oClass.crosses         = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetCrossesAt]                  = function(oClass, value){oClass.crossesAt       = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetDelete]                     = function(oClass, value){oClass.bDelete          = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetDispUnits]                  = function(oClass, value){oClass.dispUnits       = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMajorGridlines]             = function(oClass, value){oClass.majorGridlines  = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMajorTickMark]              = function(oClass, value){oClass.majorTickMark   = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMajorUnit]                  = function(oClass, value){oClass.majorUnit       = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMinorGridlines]             = function(oClass, value){oClass.minorGridlines  = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMinorTickMark]              = function(oClass, value){oClass.minorTickMark   = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetMinorUnit]                  = function(oClass, value){oClass.minorUnit       = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetNumFmt]                     = function(oClass, value){oClass.numFmt          = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetScaling]                    = function(oClass, value){oClass.scaling         = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetSpPr]                       = function(oClass, value){oClass.spPr            = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetTickLblPos]                 = function(oClass, value){oClass.tickLblPos      = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetTitle]                      = function(oClass, value){oClass.title           = value;};
    drawingsChangesMap[AscDFH.historyitem_ValAxSetTxPr]                       = function(oClass, value){oClass.txPr            = value;};
    drawingsChangesMap[AscDFH.historyitem_BandFmt_SetIdx]                     = function(oClass, value){oClass.idx = value;};
    drawingsChangesMap[AscDFH.historyitem_BandFmt_SetSpPr]                    = function(oClass, value){oClass.spPr = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetCat]                   = function(oClass, value){oClass.cat = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetDLbls]                 = function(oClass, value){oClass.dLbls = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetErrBars]               = function(oClass, value){oClass.errBars         = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetIdx]                   = function(oClass, value){oClass.idx             = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetInvertIfNegative]      = function(oClass, value){oClass.invertIfNegative = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetOrder]                 = function(oClass, value){oClass.order           = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetPictureOptions]        = function(oClass, value){oClass.pictureOptions  = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetShape]                 = function(oClass, value){oClass.shape           = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetSpPr]                  = function(oClass, value){oClass.spPr            = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetTrendline]             = function(oClass, value){oClass.trendline       = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetTx]                    = function(oClass, value){oClass.tx              = value;};
    drawingsChangesMap[AscDFH.historyitem_BarSeries_SetVal]                   = function(oClass, value){oClass.val             = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetBubble3D]            = function(oClass, value){oClass.bubble3D   = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetBubbleScale]         = function(oClass, value){oClass.bubbleScale = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetDLbls]               = function(oClass, value){oClass.dLbls      = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetShowNegBubbles]      = function(oClass, value){oClass.showNegBubbles  = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetSizeRepresents]      = function(oClass, value){oClass.sizeRepresents  = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleChart_SetVaryColors]          = function(oClass, value){oClass.varyColors      = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetBubble3D]           = function(oClass, value){oClass.bubble3D        = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetBubbleSize]         = function(oClass, value){oClass.bubbleSize      = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetDLbls]              = function(oClass, value){oClass.dLbls           = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetDPt]                = function(oClass, value){oClass.dPt            = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetErrBars]            = function(oClass, value){oClass.errBars         = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetIdx]                = function(oClass, value){oClass.idx             = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetInvertIfNegative]   = function(oClass, value){oClass.invertIfNegative = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetOrder]              = function(oClass, value){oClass.order           = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetSpPr]               = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetTrendline]          = function(oClass, value){oClass.trendline       = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetTx]                 = function(oClass, value){oClass.tx              = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetXVal]               = function(oClass, value){oClass.xVal            = value;};
    drawingsChangesMap[AscDFH.historyitem_BubbleSeries_SetYVal]               = function(oClass, value){oClass.yVal            = value;};
    drawingsChangesMap[AscDFH.historyitem_Cat_SetMultiLvlStrRef]              = function(oClass, value){oClass.multiLvlStrRef = value;};
    drawingsChangesMap[AscDFH.historyitem_Cat_SetNumLit]                      = function(oClass, value){oClass.numLit        = value;};
    drawingsChangesMap[AscDFH.historyitem_Cat_SetNumRef]                      = function(oClass, value){oClass.numRef        = value;};
    drawingsChangesMap[AscDFH.historyitem_Cat_SetStrLit]                      = function(oClass, value){oClass.strLit        = value;};
    drawingsChangesMap[AscDFH.historyitem_Cat_SetStrRef]                      = function(oClass, value){oClass.strRef        = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartText_SetRich]                  = function(oClass, value){oClass.rich = value;};
    drawingsChangesMap[AscDFH.historyitem_ChartText_SetStrRef]                = function(oClass, value){oClass.strRef = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetDelete]                    = function(oClass, value){oClass.bDelete = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetDLblPos]                   = function(oClass, value){oClass.dLblPos        = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetLeaderLines]               = function(oClass, value){oClass.leaderLines    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetNumFmt]                    = function(oClass, value){oClass.numFmt         = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetSeparator]                 = function(oClass, value){oClass.separator      = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowBubbleSize]            = function(oClass, value){oClass.showBubbleSize = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowCatName]               = function(oClass, value){oClass.showCatName    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowLeaderLines]           = function(oClass, value){oClass.showLeaderLines = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowLegendKey]             = function(oClass, value){oClass.showLegendKey  = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowPercent]               = function(oClass, value){oClass.showPercent    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowSerName]               = function(oClass, value){oClass.showSerName    = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetShowVal]                   = function(oClass, value){oClass.showVal        = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetSpPr]                      = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DLbls_SetTxPr]                      = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetBubble3D]                    = function(oClass, value){oClass.bubble3D        = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetExplosion]                   = function(oClass, value){oClass.explosion       = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetIdx]                         = function(oClass, value){oClass.idx             = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetInvertIfNegative]            = function(oClass, value){oClass.invertIfNegative = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetMarker]                      = function(oClass, value){oClass.marker          = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetPictureOptions]              = function(oClass, value){oClass.pictureOptions  = value;};
    drawingsChangesMap[AscDFH.historyitem_DPt_SetSpPr]                        = function(oClass, value){oClass.spPr            = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetShowHorzBorder]           = function(oClass, value){oClass.showHorzBorder = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetShowKeys]                 = function(oClass, value){oClass.showKeys       = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetShowOutline]              = function(oClass, value){oClass.showOutline    = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetShowVertBorder]           = function(oClass, value){oClass.showVertBorder = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetSpPr]                     = function(oClass, value){oClass.spPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DTable_SetTxPr]                     = function(oClass, value){oClass.txPr           = value;};
    drawingsChangesMap[AscDFH.historyitem_DispUnitsSetParent]                 = function(oClass, value){oClass.parent         = value;};
    drawingsChangesMap[AscDFH.historyitem_DispUnitsSetBuiltInUnit]            = function(oClass, value){oClass.builtInUnit    = value;};
    drawingsChangesMap[AscDFH.historyitem_DispUnitsSetCustUnit]               = function(oClass, value){oClass.custUnit       = value;};
    drawingsChangesMap[AscDFH.historyitem_DispUnitsSetDispUnitsLbl]           = function(oClass, value){oClass.dispUnitsLbl   = value;};
    drawingsChangesMap[AscDFH.historyitem_DoughnutChart_SetDLbls]             = function(oClass, value){oClass.dLbls         = value;};
    drawingsChangesMap[AscDFH.historyitem_DoughnutChart_SetFirstSliceAng]     = function(oClass, value){oClass.firstSliceAng = value;};
    drawingsChangesMap[AscDFH.historyitem_DoughnutChart_SetHoleSize]          = function(oClass, value){oClass.holeSize     = value;};
    drawingsChangesMap[AscDFH.historyitem_DoughnutChart_SetVaryColor]         = function(oClass, value){oClass.varyColor = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetErrBarType]              = function(oClass, value){oClass.errBarType   = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetErrDir]                  = function(oClass, value){oClass.errDir       = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetErrValType]              = function(oClass, value){oClass.errValType   = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetMinus]                   = function(oClass, value){oClass.minus        = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetNoEndCap]                = function(oClass, value){oClass.noEndCap     = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetPlus]                    = function(oClass, value){oClass.plus         = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetSpPr]                    = function(oClass, value){oClass.spPr         = value;};
    drawingsChangesMap[AscDFH.historyitem_ErrBars_SetVal]                     = function(oClass, value){oClass.val          = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetH]                        = function(oClass, value){oClass.h            = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetHMode]                    = function(oClass, value){oClass.hMode        = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetLayoutTarget]             = function(oClass, value){oClass.layoutTarget = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetW]                        = function(oClass, value){oClass.w            = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetWMode]                    = function(oClass, value){oClass.wMode        = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetX]                        = function(oClass, value){oClass.x            = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetXMode]                    = function(oClass, value){oClass.xMode        = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetY]                        = function(oClass, value){oClass.y            = value;};
    drawingsChangesMap[AscDFH.historyitem_Layout_SetYMode]                    = function(oClass, value){oClass.yMode        = value;};
    drawingsChangesMap[AscDFH.historyitem_Legend_SetLayout]                   = function(oClass, value){oClass.layout       = value;};
    drawingsChangesMap[AscDFH.historyitem_Legend_SetLegendPos]                = function(oClass, value){oClass.legendPos  = value;};
    drawingsChangesMap[AscDFH.historyitem_Legend_SetOverlay]                  = function(oClass, value){oClass.overlay   = value;};
    drawingsChangesMap[AscDFH.historyitem_Legend_SetSpPr]                     = function(oClass, value){oClass.spPr      = value;};
    drawingsChangesMap[AscDFH.historyitem_Legend_SetTxPr]                     = function(oClass, value){oClass.txPr      = value;};
    drawingsChangesMap[AscDFH.historyitem_LegendEntry_SetDelete]              = function(oClass, value){oClass.delete = value;};
    drawingsChangesMap[AscDFH.historyitem_LegendEntry_SetIdx]                 = function(oClass, value){oClass.idx    = value;};
    drawingsChangesMap[AscDFH.historyitem_LegendEntry_SetTxPr]                = function(oClass, value){oClass.txPr   = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetDLbls]                 = function(oClass, value){oClass.dLbls      = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetDropLines]             = function(oClass, value){oClass.dropLines  = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetGrouping]              = function(oClass, value){oClass.grouping   = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetHiLowLines]            = function(oClass, value){oClass.hiLowLines = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetMarker]                = function(oClass, value){oClass.marker     = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetSmooth]                = function(oClass, value){oClass.smooth      = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetUpDownBars]            = function(oClass, value){oClass.upDownBars  = value;};
    drawingsChangesMap[AscDFH.historyitem_LineChart_SetVaryColors]            = function(oClass, value){oClass.varyColors  = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetCat]                  = function(oClass, value){oClass.cat      = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetDLbls]                = function(oClass, value){oClass.dLbls    = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetDPt]                  = function(oClass, value){oClass.dPt      = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetErrBars]              = function(oClass, value){oClass.errBars  = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetIdx]                  = function(oClass, value){oClass.idx      = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetMarker]               = function(oClass, value){oClass.marker   = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetOrder]                = function(oClass, value){oClass.order    = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetSmooth]               = function(oClass, value){oClass.smooth   = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetSpPr]                 = function(oClass, value){oClass.spPr     = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetTrendline]            = function(oClass, value){oClass.trendline = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetTx]                   = function(oClass, value){oClass.tx       = value;};
    drawingsChangesMap[AscDFH.historyitem_LineSeries_SetVal]                  = function(oClass, value){oClass.val      = value;};
    drawingsChangesMap[AscDFH.historyitem_Marker_SetSize]                     = function(oClass, value){oClass.size = value;};
    drawingsChangesMap[AscDFH.historyitem_Marker_SetSpPr]                     = function(oClass, value){oClass.spPr = value;};
    drawingsChangesMap[AscDFH.historyitem_Marker_SetSymbol]                   = function(oClass, value){oClass.symbol = value;};
    drawingsChangesMap[AscDFH.historyitem_MinusPlus_SetnNumLit]               = function(oClass, value){oClass.numLit = value;};
    drawingsChangesMap[AscDFH.historyitem_MinusPlus_SetnNumRef]               = function(oClass, value){oClass.numRef = value;};
    drawingsChangesMap[AscDFH.historyitem_MultiLvlStrRef_SetF]                = function(oClass, value){oClass.f                = value;};
    drawingsChangesMap[AscDFH.historyitem_MultiLvlStrRef_SetMultiLvlStrCache] = function(oClass, value){oClass.multiLvlStrCache = value;};
    drawingsChangesMap[AscDFH.historyitem_NumRef_SetF]                        = function(oClass, value){oClass.f       = value;};
    drawingsChangesMap[AscDFH.historyitem_NumRef_SetNumCache]                 = function(oClass, value){oClass.numCache = value;};
    drawingsChangesMap[AscDFH.historyitem_NumericPoint_SetFormatCode]         = function(oClass, value){oClass.formatCode = value;};
    drawingsChangesMap[AscDFH.historyitem_NumericPoint_SetIdx]                = function(oClass, value){oClass.idx        = value;};
    drawingsChangesMap[AscDFH.historyitem_NumericPoint_SetVal]                = function(oClass, value){oClass.val        = value;};
    drawingsChangesMap[AscDFH.historyitem_NumFmt_SetFormatCode]               = function(oClass, value){oClass.formatCode  = value;};
    drawingsChangesMap[AscDFH.historyitem_NumFmt_SetSourceLinked]             = function(oClass, value){oClass.sourceLinked = value;};
    drawingsChangesMap[AscDFH.historyitem_NumLit_SetFormatCode]               = function(oClass, value){oClass.formatCode = value;};
    drawingsChangesMap[AscDFH.historyitem_NumLit_SetPtCount]                  = function(oClass, value){oClass.ptCount = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetDLbls]                = function(oClass, value){oClass.dLbls = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetGapWidth]             = function(oClass, value){oClass.gapWidth = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetOfPieType]            = function(oClass, value){oClass.ofPieType = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetSecondPieSize]        = function(oClass, value){oClass.secondPieSize = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetSerLines]             = function(oClass, value){oClass.serLines   = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetSplitPos]             = function(oClass, value){oClass.splitPos   = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetSplitType]            = function(oClass, value){oClass.splitType  = value;};
    drawingsChangesMap[AscDFH.historyitem_OfPieChart_SetVaryColors]           = function(oClass, value){oClass.varyColors = value;};
    drawingsChangesMap[AscDFH.historyitem_PictureOptions_SetApplyToEnd]       = function(oClass, value){oClass.applyToEnd         = value;};
    drawingsChangesMap[AscDFH.historyitem_PictureOptions_SetApplyToFront]     = function(oClass, value){oClass.applyToFront       = value;};
    drawingsChangesMap[AscDFH.historyitem_PictureOptions_SetApplyToSides]     = function(oClass, value){oClass.applyToSides       = value;};
    drawingsChangesMap[AscDFH.historyitem_PictureOptions_SetPictureFormat]    = function(oClass, value){oClass.pictureFormat      = value;};
    drawingsChangesMap[AscDFH.historyitem_PictureOptions_SetPictureStackUnit] = function(oClass, value){oClass.pictureStackUnit   = value;};
    drawingsChangesMap[AscDFH.historyitem_PieChart_SetDLbls]                  = function(oClass, value){oClass.dLbls          = value;};
    drawingsChangesMap[AscDFH.historyitem_PieChart_SetFirstSliceAng]          = function(oClass, value){oClass.firstSliceAng  = value;};
    drawingsChangesMap[AscDFH.historyitem_PieChart_SetVaryColors]             = function(oClass, value){oClass.varyColors = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetCat]                   = function(oClass, value){oClass.cat       = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetDLbls]                 = function(oClass, value){oClass.dLbls     = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetDPt]                   = function(oClass, value){oClass.dPt       = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetExplosion]             = function(oClass, value){oClass.explosion = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetIdx]                   = function(oClass, value){oClass.idx       = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetOrder]                 = function(oClass, value){oClass.order     = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetSpPr]                  = function(oClass, value){oClass.spPr      = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetTx]                    = function(oClass, value){oClass.tx        = value;};
    drawingsChangesMap[AscDFH.historyitem_PieSeries_SetVal]                   = function(oClass, value){oClass.val       = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotFmt_SetDLbl]                   = function(oClass, value){oClass.dLbl    = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotFmt_SetIdx]                    = function(oClass, value){oClass.idx     = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotFmt_SetMarker]                 = function(oClass, value){oClass.marker  = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotFmt_SetSpPr]                   = function(oClass, value){oClass.spPr    = value;};
    drawingsChangesMap[AscDFH.historyitem_PivotFmt_SetTxPr]                   = function(oClass, value){oClass.txPr    = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarChart_SetDLbls]                = function(oClass, value){oClass.dLbls       =  value;};
    drawingsChangesMap[AscDFH.historyitem_RadarChart_SetRadarStyle]           = function(oClass, value){oClass.radarStyle  =  value;};
    drawingsChangesMap[AscDFH.historyitem_RadarChart_SetVaryColors]           = function(oClass, value){oClass.varyColors = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetCat]              = function(oClass, value){oClass.cat     = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetDLbls]              = function(oClass, value){oClass.dLbls   = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetDPt]              = function(oClass, value){oClass.dPt     = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetIdx]              = function(oClass, value){oClass.idx     = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetMarker]              = function(oClass, value){oClass.marker  = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetOrder]              = function(oClass, value){oClass.order   = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetSpPr]              = function(oClass, value){oClass.spPr    = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetTx]              = function(oClass, value){oClass.tx      = value;};
    drawingsChangesMap[AscDFH.historyitem_RadarSeries_SetVal]              = function(oClass, value){oClass.val     = value;};
    drawingsChangesMap[AscDFH.historyitem_Scaling_SetParent]                  = function(oClass, value){oClass.parent      = value;};
    drawingsChangesMap[AscDFH.historyitem_Scaling_SetLogBase]                 = function(oClass, value){oClass.logBase     = value;};
    drawingsChangesMap[AscDFH.historyitem_Scaling_SetMax]                     = function(oClass, value){oClass.max         = value;};
    drawingsChangesMap[AscDFH.historyitem_Scaling_SetMin]                     = function(oClass, value){oClass.min         = value;};
    drawingsChangesMap[AscDFH.historyitem_Scaling_SetOrientation]             = function(oClass, value){oClass.orientation  = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterChart_SetDLbls]              = function(oClass, value){oClass.dLbls        =  value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterChart_SetScatterStyle]       = function(oClass, value){oClass.scatterStyle =  value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterChart_SetVaryColors]         = function(oClass, value){oClass.varyColors =  value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetDLbls]                 =  function(oClass, value){oClass.dLbls     = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetDPt]                   =  function(oClass, value){oClass.dPt       = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetErrBars]               =  function(oClass, value){oClass.errBars   = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetIdx]                   =  function(oClass, value){oClass.idx       = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetMarker]                =  function(oClass, value){oClass.marker    = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetOrder]                 =  function(oClass, value){oClass.order    = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetSmooth]                =  function(oClass, value){oClass.smooth    = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetSpPr]                  =  function(oClass, value){oClass.spPr      = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetTrendline]             =  function(oClass, value){oClass.trendline  = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetTx]                    =  function(oClass, value){oClass.tx        = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetXVal]                  =  function(oClass, value){oClass.xVal      = value;};
    drawingsChangesMap[AscDFH.historyitem_ScatterSer_SetYVal]                  =  function(oClass, value){oClass.yVal      = value;};
    drawingsChangesMap[AscDFH.historyitem_Tx_SetStrRef]                        =  function(oClass, value){oClass.strRef     = value;};
    drawingsChangesMap[AscDFH.historyitem_Tx_SetVal]                           =  function(oClass, value){oClass.val        = value;};
    drawingsChangesMap[AscDFH.historyitem_StockChart_SetDLbls]                 = function(oClass, value){oClass.dLbls     = value;};
    drawingsChangesMap[AscDFH.historyitem_StockChart_SetDropLines]             = function(oClass, value){oClass.dropLines = value;};
    drawingsChangesMap[AscDFH.historyitem_StockChart_SetHiLowLines]            = function(oClass, value){oClass.hiLowLines = value;};
    drawingsChangesMap[AscDFH.historyitem_StockChart_SetUpDownBars]            = function(oClass, value){oClass.upDownBars = value;};
    drawingsChangesMap[AscDFH.historyitem_StrCache_SetPtCount]                 = function(oClass, value){oClass.ptCount = value;};
    drawingsChangesMap[AscDFH.historyitem_StrPoint_SetIdx]                     = function(oClass, value){oClass.idx =  value;};
    drawingsChangesMap[AscDFH.historyitem_StrPoint_SetVal]                     = function(oClass, value){oClass.val =  value;};
    drawingsChangesMap[AscDFH.historyitem_StrRef_SetF]                          = function(oClass, value){oClass.f =  value;};
    drawingsChangesMap[AscDFH.historyitem_StrRef_SetStrCache]                   = function(oClass, value){oClass.strCache =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceChart_SetWireframe]              = function(oClass, value){oClass.wireframe =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetCat]                    = function(oClass, value){oClass.cat   =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetIdx]                    = function(oClass, value){oClass.idx   =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetOrder]                  = function(oClass, value){oClass.order =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetSpPr]                   = function(oClass, value){oClass.spPr  =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetTx]                     = function(oClass, value){oClass.tx    =  value;};
    drawingsChangesMap[AscDFH.historyitem_SurfaceSeries_SetVal]                    = function(oClass, value){oClass.val   =  value;};
    drawingsChangesMap[AscDFH.historyitem_Title_SetLayout]                         = function(oClass, value){oClass.layout  =  value;};
    drawingsChangesMap[AscDFH.historyitem_Title_SetOverlay]                        = function(oClass, value){oClass.overlay =  value;};
    drawingsChangesMap[AscDFH.historyitem_Title_SetSpPr]                           = function(oClass, value){oClass.spPr    =  value;};
    drawingsChangesMap[AscDFH.historyitem_Title_SetTx]                             = function(oClass, value){oClass.tx      =  value;};
    drawingsChangesMap[AscDFH.historyitem_Title_SetTxPr]                           = function(oClass, value){oClass.txPr    =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetBackward]                     = function(oClass, value){oClass.backward      =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetDispEq]                       = function(oClass, value){oClass.dispEq        =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetDispRSqr]                     = function(oClass, value){oClass.dispRSqr      =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetForward]                      = function(oClass, value){oClass.forward       =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetIntercept]                    = function(oClass, value){oClass.intercept     =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetName]                         = function(oClass, value){oClass.name          =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetOrder]                        = function(oClass, value){oClass.order         =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetPeriod]                       = function(oClass, value){oClass.period        =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetSpPr]                         = function(oClass, value){oClass.spPr          =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetTrendlineLbl]                 = function(oClass, value){oClass.trendlineLbl  =  value;};
    drawingsChangesMap[AscDFH.historyitem_Trendline_SetTrendlineType]                = function(oClass, value){oClass.trendlineType =  value;};
    drawingsChangesMap[AscDFH.historyitem_UpDownBars_SetDownBars]                    = function(oClass, value){oClass.downBars =  value;};
    drawingsChangesMap[AscDFH.historyitem_UpDownBars_SetGapWidth]                    = function(oClass, value){oClass.gapWidth =  value;};
    drawingsChangesMap[AscDFH.historyitem_UpDownBars_SetUpBars]                      = function(oClass, value){oClass.upBars   =  value;};
    drawingsChangesMap[AscDFH.historyitem_XVal_SetMultiLvlStrRef]                    = function(oClass, value){oClass.multiLvlStrRef =  value;};
    drawingsChangesMap[AscDFH.historyitem_XVal_SetNumLit]                            = function(oClass, value){oClass.numLit         =  value;};
    drawingsChangesMap[AscDFH.historyitem_XVal_SetNumRef]                            = function(oClass, value){oClass.numRef         =  value;};
    drawingsChangesMap[AscDFH.historyitem_XVal_SetStrLit]                            = function(oClass, value){oClass.strLit         =  value;};
    drawingsChangesMap[AscDFH.historyitem_XVal_SetStrRef]                            = function(oClass, value){oClass.strRef         =  value;};
    drawingsChangesMap[AscDFH.historyitem_YVal_SetNumLit]                             = function(oClass, value){oClass.numLit =  value;};
    drawingsChangesMap[AscDFH.historyitem_YVal_SetNumRef]                             = function(oClass, value){oClass.numRef =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetAutoTitleDeleted]                  = function(oClass, value){oClass.autoTitleDeleted =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetBackWall]                          = function(oClass, value){oClass.backWall         =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetDispBlanksAs]                      = function(oClass, value){oClass.dispBlanksAs     =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetFloor]                             = function(oClass, value){oClass.floor            =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetLegend]                            = function(oClass, value){oClass.legend           =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetPlotArea]                           = function(oClass, value){oClass.plotArea         =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetPlotVisOnly]                        = function(oClass, value){oClass.plotVisOnly      =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetShowDLblsOverMax]                   = function(oClass, value){oClass.showDLblsOverMax =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetSideWall]                           = function(oClass, value){oClass.sideWall         =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetTitle]                              = function(oClass, value){oClass.title            =  value;};
    drawingsChangesMap[AscDFH.historyitem_Chart_SetView3D]                             = function(oClass, value){oClass.view3D           =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_ChartWall_SetPictureOptions]                   = function(oClass, value){oClass.pictureOptions  =  value;};
    drawingsChangesMap[AscDFH.historyitem_ChartWall_SetSpPr]                             = function(oClass, value){oClass.spPr            =  value;};
    drawingsChangesMap[AscDFH.historyitem_ChartWall_SetThickness]                        = function(oClass, value){oClass.thickness       =  value;};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetDepthPercent]                        = function(oClass, value){oClass.depthPercent  =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetHPercent]                            = function(oClass, value){oClass.hPercent      =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetPerspective]                         = function(oClass, value){oClass.perspective   =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetRAngAx]                              = function(oClass, value){oClass.rAngAx        =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetRotX]                                = function(oClass, value){oClass.rotX          =  value; oClass.Refresh_RecalcData();};
    drawingsChangesMap[AscDFH.historyitem_View3d_SetRotY]                                = function(oClass, value){oClass.rotY          =  value; oClass.Refresh_RecalcData();};



    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetDelete                  ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowBubbleSize          ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowCatName             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowLegendKey           ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowPercent             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowSerName             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetShowVal                 ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_Set3D                  ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetVaryColors          ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_SetVaryColors         ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetAuto                    ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetDelete                  ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetNoMultiLvlLbl           ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxAuto                      ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxDelete                    ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetDelete                  ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetDelete                  ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetInvertIfNegative   ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetBubble3D         ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetShowNegBubbles   ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetVaryColors       ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetBubble3D        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetInvertIfNegative] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetDelete                 ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowBubbleSize         ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowCatName            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowLeaderLines        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowLegendKey          ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowPercent            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowSerName            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetShowVal                ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetBubble3D                 ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetInvertIfNegative         ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetShowHorzBorder        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetShowKeys              ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetShowOutline           ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetShowVertBorder        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_DoughnutChart_SetVaryColor      ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetNoEndCap             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetOverlay               ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_LegendEntry_SetDelete           ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetMarker             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetSmooth             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetVaryColors         ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetSmooth            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_NumFmt_SetSourceLinked          ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetVaryColors        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_PieChart_SetVaryColors          ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_RadarChart_SetVaryColors        ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterChart_SetVaryColors      ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetSmooth            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceChart_SetWireframe       ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetOverlay                ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetDispEq             ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetDispRSqr           ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetAutoTitleDeleted       ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetPlotVisOnly            ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetShowDLblsOverMax       ] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetRAngAx                ] = window['AscDFH'].CChangesDrawingsBool;

    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetDLblPos                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetIdx                      ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetGapDepth             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetShape                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetBarDir               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetGapWidth             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetGrouping             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetOverlap              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_SetGrouping            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetIdx                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetOrder              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetAxId                     ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetAxPos                    ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetCrosses                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetLblAlgn                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetLblOffset                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetMajorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetMinorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetTickLblPos               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetTickLblSkip              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetTickMarkSkip             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxAxPos                      ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxCrosses                    ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxLblOffset                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMajorTickMark              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMinorTickMark              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxTickLblPos                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetAxId                     ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetAxPos                    ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetMajorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetMinorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetTickLblPos               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetTickLblSkip              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetTickMarkSkip             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetAxId                     ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetAxPos                    ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetCrossBetween             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMajorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMinorTickMark            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetTickLblPos               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BandFmt_SetIdx                   ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetIdx                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetOrder               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetBubbleScale       ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetSizeRepresents    ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetIdx              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetOrder            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetDLblPos                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetExplosion                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetIdx                       ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DispUnitsSetParent               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DoughnutChart_SetFirstSliceAng   ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_DoughnutChart_SetHoleSize        ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetErrBarType            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetErrDir                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetErrValType            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetHMode                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetLayoutTarget           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetWMode                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetXMode                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetYMode                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetLegendPos              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_LegendEntry_SetIdx               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetGrouping            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetIdx                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetOrder              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Marker_SetSize                   ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Marker_SetSymbol                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_MultiLvlStrCache_SetPtCount      ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_NumLit_SetPtCount                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetGapWidth           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetOfPieType          ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetSecondPieSize      ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetSplitType          ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PictureOptions_SetPictureFormat  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PieChart_SetFirstSliceAng        ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetExplosion           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetIdx                 ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetOrder               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_PivotFmt_SetIdx                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetIdx               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Scaling_SetOrientation           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterChart_SetScatterStyle     ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetIdx                ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetOrder              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_StrCache_SetPtCount              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_StringLiteral_SetPtCount         ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_StrPoint_SetIdx                  ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetIdx             ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetOrder           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetOrder               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetPeriod              ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetTrendlineType       ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_UpDownBars_SetGapWidth           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetDispBlanksAs            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_ChartWall_SetThickness           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetDepthPercent           ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetHPercent               ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetPerspective            ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetRotX                   ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_View3d_SetRotY                   ] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_NumericPoint_SetIdx              ] = window['AscDFH'].CChangesDrawingsLong;


    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetCrossesAt                 ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxBaseTimeUnit                ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxCrossesAt                   ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMajorTimeUnit               ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMajorUnit                   ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMinorTimeUnit               ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMinorUnit                   ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetCrosses                   ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetCrossesAt                 ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetCrosses                   ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetCrossesAt                 ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMajorUnit                 ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMinorUnit                 ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_DispUnitsSetBuiltInUnit           ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetVal                    ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetH                       ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetW                       ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetX                       ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Layout_SetY                       ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetSplitPos            ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_PictureOptions_SetPictureStackUnit] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Scaling_SetLogBase                ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Scaling_SetMax                    ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Scaling_SetMin                    ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetBackward             ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetForward              ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetIntercept            ] = window['AscDFH'].CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_NumericPoint_SetVal               ] = window['AscDFH'].CChangesDrawingsDouble;

    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetSeparator         ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxAxId                ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetSeparator        ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_MultiLvlStrRef_SetF       ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumRef_SetF               ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericPoint_SetFormatCode] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumFmt_SetFormatCode      ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumLit_SetFormatCode      ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Tx_SetVal                 ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StrPoint_SetVal           ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StrRef_SetF               ] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetName         ] = window['AscDFH'].CChangesDrawingsString;

    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetLayout                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetNumFmt                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetSpPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetTx                            ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbl_SetTxPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetDTable                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetLayout                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetSpPr                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CommonChartFormat_SetParent           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetDLbls                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_SetSerLines                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_SetDLbls                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_SetDropLines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetCat                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetDLbls                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetErrBars                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetPictureOptions          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetSpPr                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetTrendline               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetTx                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetVal                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetCrossAx                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetMajorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetMinorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetNumFmt                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetScaling                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetSpPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetTitle                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CatAxSetTxPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxCrossAx                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMajorGridlines                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxMajorGridlines                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxNumFmt                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxScaling                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxSpPr                            ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxTitle                           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DateAxTxPr                            ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetCrossAx                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetMajorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetMinorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetNumFmt                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetScaling                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetSpPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetTitle                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SerAxSetTxPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetCrossAx                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetDispUnits                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMajorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetMinorGridlines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetNumFmt                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetScaling                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetSpPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetTitle                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ValAxSetTxPr                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BandFmt_SetSpPr                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetDLbls                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetErrBars                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetPictureOptions           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetShape                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetSpPr                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetTrendline                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetTx                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetVal                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_SetDLbls                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetBubbleSize            ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetDLbls                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetDPt                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetErrBars               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetSpPr                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetTrendline             ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetTx                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetXVal                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleSeries_SetYVal                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Cat_SetMultiLvlStrRef                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Cat_SetNumLit                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Cat_SetNumRef                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Cat_SetStrLit                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Cat_SetStrRef                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartFormatSetChart                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartText_SetRich                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartText_SetStrRef                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetLeaderLines                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetNumFmt                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetSpPr                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetTxPr                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetMarker                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetPictureOptions                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DPt_SetSpPr                           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetSpPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DTable_SetTxPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DispUnitsSetCustUnit                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DispUnitsSetDispUnitsLbl              ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DoughnutChart_SetDLbls                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetMinus                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetPlus                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ErrBars_SetSpPr                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetLayout                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetSpPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetTxPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LegendEntry_SetTxPr                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetDLbls                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetDropLines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetHiLowLines               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_SetUpDownBars               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetCat                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetDLbls                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetErrBars                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetMarker                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetSpPr                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetTrendline               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetTx                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetVal                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Marker_SetSpPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_MinusPlus_SetnNumLit                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_MinusPlus_SetnNumRef                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_MultiLvlStrRef_SetMultiLvlStrCache   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_NumRef_SetNumCache                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetDLbls                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_SetSerLines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PictureOptions_SetApplyToEnd          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PictureOptions_SetApplyToFront        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PictureOptions_SetApplyToSides        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieChart_SetDLbls                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetDLbls                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetSpPr                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetTx                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetVal                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PivotFmt_SetDLbl                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PivotFmt_SetMarker                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PivotFmt_SetSpPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_PivotFmt_SetTxPr                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarChart_SetDLbls                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarChart_SetRadarStyle                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetDLbls                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetCat                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Scaling_SetParent                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterChart_SetDLbls                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetDLbls                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetDPt                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetErrBars                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetMarker                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetSpPr                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetTrendline                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetTx                        ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetXVal                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterSer_SetYVal                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Tx_SetStrRef                            ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_SetDLbls                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_SetDropLines                 ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_SetHiLowLines                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_SetUpDownBars                ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_StrRef_SetStrCache                      ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetCat                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetSpPr                   ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetTx                     ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceSeries_SetVal                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetLayout                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetSpPr                           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetTx                             ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetTxPr                           ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetSpPr                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Trendline_SetTrendlineLbl               ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_UpDownBars_SetDownBars                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_UpDownBars_SetUpBars                    ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_XVal_SetMultiLvlStrRef                  ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_XVal_SetNumLit                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_XVal_SetNumRef                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_XVal_SetStrLit                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_XVal_SetStrRef                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_YVal_SetNumLit                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_YVal_SetNumRef                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetBackWall                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetFloor                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetLegend                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetPlotArea                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetSideWall                       ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetTitle                          ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetView3D                         ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartWall_SetPictureOptions             ] = window['AscDFH'].CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ChartWall_SetSpPr                       ] = window['AscDFH'].CChangesDrawingsObject;

    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_AddAxis          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_AddChart         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_RemoveChart      ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_RemoveAxis       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_CommonChart_RemoveSeries  ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_AddAxId          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_BarChart_AddSer           ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_AddAxId         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_AreaChart_AddSer          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_AreaSeries_SetDPt         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_CommonSeries_RemoveDPt    ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_BarSeries_SetDPt          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_AddAxId       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_BubbleChart_AddSerie      ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_DLbls_SetDLbl             ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_DoughnutChart_AddSer      ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_AddLegendEntry     ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_AddAxId         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_LineChart_AddSer          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_LineSeries_SetDPt         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_MultiLvlStrCache_SetLvl   ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_CommonLit_RemoveDPt       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_NumLit_AddPt              ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_AddCustSplit   ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_OfPieChart_AddSer         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_PieChart_AddSer           ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_PieSeries_SetDPt          ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_RadarChart_AddAxId        ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_RadarChart_AddSer         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_RadarSeries_SetDPt        ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterChart_AddAxId      ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_ScatterChart_AddSer       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_AddAxId        ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_StockChart_AddSer         ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_CommonLit_RemoveDPt       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_StrCache_AddPt            ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_StringLiteral_SetPt       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceChart_AddAxId      ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceChart_AddBandFmt   ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_SurfaceChart_AddSer       ] = window['AscDFH'].CChangesDrawingsContent;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_AddPivotFmt         ] = window['AscDFH'].CChangesDrawingsContent;


    drawingContentChanges[AscDFH.historyitem_PlotArea_AddAxis] =
    drawingContentChanges[AscDFH.historyitem_BarChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_AreaChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_BubbleChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_LineChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_RadarChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_ScatterChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_StockChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_SurfaceChart_AddAxId] =
    drawingContentChanges[AscDFH.historyitem_PlotArea_RemoveAxis]      =  function(oClass){return oClass.axId;};

    drawingContentChanges[AscDFH.historyitem_PlotArea_AddChart] =
    drawingContentChanges[AscDFH.historyitem_PlotArea_RemoveChart] =  function(oClass){return oClass.charts;};

    drawingContentChanges[AscDFH.historyitem_CommonChart_RemoveSeries] =
    drawingContentChanges[AscDFH.historyitem_BarChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_AreaChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_AreaChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_BubbleChart_AddSerie] =
    drawingContentChanges[AscDFH.historyitem_DoughnutChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_LineChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_OfPieChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_PieChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_RadarChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_ScatterChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_StockChart_AddSer] =
    drawingContentChanges[AscDFH.historyitem_SurfaceChart_AddSer] =  function(oClass){return oClass.series;};



    drawingContentChanges[AscDFH.historyitem_AreaSeries_SetDPt]        =
    drawingContentChanges[AscDFH.historyitem_CommonSeries_RemoveDPt]   =
    drawingContentChanges[AscDFH.historyitem_BarSeries_SetDPt]         =
    drawingContentChanges[AscDFH.historyitem_LineSeries_SetDPt]        =
    drawingContentChanges[AscDFH.historyitem_PieSeries_SetDPt]         =
    drawingContentChanges[AscDFH.historyitem_RadarSeries_SetDPt]       =  function(oClass){return oClass.dPt;};

    drawingContentChanges[AscDFH.historyitem_DLbls_SetDLbl]            =  function(oClass){return oClass.dLbl;};

    drawingContentChanges[AscDFH.historyitem_Legend_AddLegendEntry]    =  function(oClass){return oClass.legendEntryes;};

    drawingContentChanges[AscDFH.historyitem_MultiLvlStrCache_SetLvl]  =  function(oClass){return oClass.lvl;};

    drawingContentChanges[AscDFH.historyitem_CommonLit_RemoveDPt]      =
    drawingContentChanges[AscDFH.historyitem_NumLit_AddPt]             =
    drawingContentChanges[AscDFH.historyitem_StrCache_AddPt]           =
    drawingContentChanges[AscDFH.historyitem_StringLiteral_SetPt]      =  function(oClass){return oClass.pts;};

    drawingContentChanges[AscDFH.historyitem_OfPieChart_AddCustSplit]  =  function(oClass){return oClass.custSplit};

    drawingContentChanges[AscDFH.historyitem_SurfaceChart_AddBandFmt]  =  function(oClass){return oClass.bandFmts;};

    drawingContentChanges[AscDFH.historyitem_Chart_AddPivotFmt]        =  function(oClass){return oClass.pivotFmts;};





// Import
var g_oIdCounter = AscCommon.g_oIdCounter;
var g_oTableId = AscCommon.g_oTableId;
var CMatrix = AscCommon.CMatrix;
var isRealObject = AscCommon.isRealObject;
    var History = AscCommon.History;
    var global_MatrixTransformer = AscCommon.global_MatrixTransformer;

var CShape = AscFormat.CShape;
var checkSpPrRasterImages = AscFormat.checkSpPrRasterImages;

var c_oAscChartLegendShowSettings = Asc.c_oAscChartLegendShowSettings;
var c_oAscChartDataLabelsPos = Asc.c_oAscChartDataLabelsPos;
var c_oAscValAxisRule = Asc.c_oAscValAxisRule;
var c_oAscValAxUnits = Asc.c_oAscValAxUnits;
var c_oAscTickMark = Asc.c_oAscTickMark;
var c_oAscTickLabelsPos = Asc.c_oAscTickLabelsPos;
var c_oAscCrossesRule = Asc.c_oAscCrossesRule;
var c_oAscBetweenLabelsRule = Asc.c_oAscBetweenLabelsRule;
var c_oAscLabelsPosition = Asc.c_oAscLabelsPosition;
var c_oAscAxisType = Asc.c_oAscAxisType;


    var CChangesDrawingsBool = AscDFH.CChangesDrawingsBool;
    var CChangesDrawingsLong = AscDFH.CChangesDrawingsLong;
    var CChangesDrawingsDouble = AscDFH.CChangesDrawingsDouble;
    var CChangesDrawingsString = AscDFH.CChangesDrawingsString;
    var CChangesDrawingsObjectNoId = AscDFH.CChangesDrawingsObjectNoId;
    var CChangesDrawingsObject = AscDFH.CChangesDrawingsObject;
    var CChangesDrawingsContent = AscDFH.CChangesDrawingsContent;


function getMinMaxFromArrPoints(aPoints)
{
    if(Array.isArray(aPoints) && aPoints.length > 0)
    {
        if(isRealObject(aPoints[0]) && AscFormat.isRealNumber(aPoints[0].val) && isRealObject(aPoints[aPoints.length - 1]) && AscFormat.isRealNumber(aPoints[aPoints.length - 1].val))
        {
            if(aPoints[0].val - aPoints[aPoints.length - 1].val <= 0)
            {
                return {min: aPoints[0].val, max: aPoints[aPoints.length - 1].val};
            }
            else
            {
                return {min: aPoints[aPoints.length - 1].val, max: aPoints[0].val};
            }
        }
    }
    return {min: null, max: null};
}


var SCALE_INSET_COEFF = 1.016;//Возможно придется уточнять
function CDLbl()
{
    this.bDelete = null;
    this.dLblPos = null;
    this.idx = null;
    this.layout = null;
    this.numFmt = null;
    this.separator = null;
    this.showBubbleSize = null;
    this.showCatName = null;
    this.showLegendKey = null;
    this.showPercent = null;
    this.showSerName = null;
    this.showVal = null;
    this.spPr = null;
    this.tx = null;
    this.txPr = null;

    this.parent = null;

    this.recalcInfo =
    {
        recalcTransform: true,
        recalcTransformText: true,
        recalcStyle: true,
        recalculateTxBody: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculateContent: true
    };

    this.chart = null;
    this.series = null;

    this.x = 0;
    this.y = 0;
    this.calcX = null;
    this.calcY = null;


    this.relPosX = null;
    this.relPosY = null;

    this.txBody = null;

    this.transform = new CMatrix();
    this.transformText = new CMatrix();
    this.ownTransform = new CMatrix();
    this.ownTransformText = new CMatrix();
    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();

    this.compiledStyles = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDLbl.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },


    getObjectType: function()
    {
        return AscDFH.historyitem_type_DLbl;
    },

    createDuplicate: function()
    {

        var c = new CDLbl();
        c.setDelete(this.bDelete);
        c.setDLblPos(this.dLblPos);
        c.setIdx(this.idx);
        if(this.layout)
        {
            c.setLayout(this.layout.createDuplicate());
        }
        if(this.numFmt)
        {
            c.setNumFmt(this.numFmt.createDuplicate());
        }
        c.setSeparator(this.separator);
        c.setShowBubbleSize(this.showBubbleSize);
        c.setShowCatName(this.showCatName);
        c.setShowLegendKey(this.showLegendKey);
        c.setShowPercent(this.showPercent);
        c.setShowSerName(this.showSerName);
        c.setShowVal(this.showVal);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    checkShapeChildTransform: function(transform)
    {
        this.updatePosition(this.posX, this.posY);
        global_MatrixTransformer.MultiplyAppend(this.transform, transform);
        global_MatrixTransformer.MultiplyAppend(this.transformText, transform);
        if((this instanceof CTitle) || (this instanceof CDLbl))
        {
            this.invertTransform = global_MatrixTransformer.Invert(this.transform);
            this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        }
    },

    getCompiledFill: function()
    {
        return this.spPr && this.spPr.Fill ? this.spPr.Fill : null;
    },

    getCompiledLine: function()
    {
        return this.spPr && this.spPr.ln ? this.spPr.ln : null;
    },

    getCompiledTransparent: function()
    {
        return this.spPr && this.spPr.Fill ? this.spPr.Fill.transparent : null;
    },


    recalculate: function()
    {
        if(this.bDelete)
        {
            return;
        }
        AscFormat.ExecuteNoHistory(function()
        {
            if(this.recalcInfo.recalculateBrush)
            {
                this.recalculateBrush();
                this.recalcInfo.recalculateBrush = false;
            }
            if(this.recalcInfo.recalculatePen)
            {
                this.recalculatePen();
                this.recalcInfo.recalculatePen = false;
            }
            if(this.recalcInfo.recalcStyle)
            {
                this.recalculateStyle();
                //this.recalcInfo.recalcStyle = false;
            }
            if(this.recalcInfo.recalculateTxBody)
            {
                this.recalculateTxBody();
                this.recalcInfo.recalculateTxBody = false;
            }
            if(this.recalcInfo.recalculateContent)
            {
                this.recalculateContent();
                //this.recalcInfo.recalculateContent = false;
            }
            if(this.recalcInfo.recalcTransform)
            {
                this.recalculateTransform();
                //this.recalcInfo.recalcTransform = false;
            }
            if(this.recalcInfo.recalcTransformText)
            {
                this.recalculateTransformText();
                //this.recalcInfo.recalcTransformText = false;
            }
            if(this.chart)
            {
                this.chart.addToSetPosition(this);
            }
        }, this, []);
    },

    recalculateBrush: CShape.prototype.recalculateBrush,
    recalculatePen: CShape.prototype.recalculatePen,
    check_bounds: CShape.prototype.check_bounds,

    hit: function(x, y)
    {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        return tx>=0 && tx <= this.extX && ty >=0 && ty <=this.extY;
    },

    getCompiledStyle: function()
    {
        return null;
    },

    getParentObjects: function()
    {
        return this.chart.getParentObjects();
    },

    recalculateTransform: function()
    {

    },

    recalculateTransformText: function()
    {
        if (this.txBody === null)
            return;
        this.ownTransformText.Reset();
        var _text_transform = this.ownTransformText;
        var _shape_transform = this.ownTransform;
        var _body_pr = this.getBodyPr();
        var _content_height = this.txBody.content.Get_SummaryHeight();
        var _l, _t, _r, _b;

        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (isRealObject(this.spPr) && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        }
        else
        {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }

        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }

        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }

        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);

        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);

        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);

        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);

        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;

        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;

        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        var nVert = _body_pr.vert;




        if (!_body_pr.upright)
        {
            if (!(nVert === AscFormat.nVertTTvert || nVert === AscFormat.nVertTTvert270))
            {
                switch (_body_pr.anchor)
                {
                    case 0: //b
                    { // (Text Anchor Enum ( Bottom ))
                        _vertical_shift = _text_rect_height - _content_height;
                        break;
                    }
                    case 1:    //ctr
                    {// (Text Anchor Enum ( Center ))
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    }
                    case 2: //dist
                    {// (Text Anchor Enum ( Distributed )) TODO: пока выравнивание  по центру. Переделать!
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    }
                    case 3: //just
                    {// (Text Anchor Enum ( Justified )) TODO: пока выравнивание  по центру. Переделать!
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    }
                    case 4: //t
                    {//Top
                        _vertical_shift = 0;
                        break;
                    }
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                }
                else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            }
            else
            {
                switch (_body_pr.anchor)
                {
                    case 0: //b
                    { // (Text Anchor Enum ( Bottom ))
                        _vertical_shift = _text_rect_width - _content_height;
                        break;
                    }
                    case 1:    //ctr
                    {// (Text Anchor Enum ( Center ))
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    }
                    case 2: //dist
                    {// (Text Anchor Enum ( Distributed ))
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    }
                    case 3: //just
                    {// (Text Anchor Enum ( Justified ))
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    }
                    case 4: //t
                    {//Top
                        _vertical_shift = 0;
                        break;
                    }
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (nVert === AscFormat.nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                }
                else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    }
                    else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
        }
        else {

            var _full_flip = {flipH: false, flipV: false};

            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);


            var _content_width, content_height2;
            if (!(nVert === AscFormat.nVertTTvert || nVert === AscFormat.nVertTTvert270))
            {
                _content_width = _r - _l;
                content_height2 = _b - _t;
            }
            else
            {
                _content_width = _b - _t;
                content_height2 = _r - _l;
            }

            switch (_body_pr.anchor)
            {
                case 0: //b
                { // (Text Anchor Enum ( Bottom ))
                    _vertical_shift = content_height2 - _content_height;
                    break;
                }
                case 1:    //ctr
                {// (Text Anchor Enum ( Center ))
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                }
                case 2: //dist
                {// (Text Anchor Enum ( Distributed ))
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                }
                case 3: //just
                {// (Text Anchor Enum ( Justified ))
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                }
                case 4: //t
                {//Top
                    _vertical_shift = 0;
                    break;
                }
            }

            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;

            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;

            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            }
            else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }

            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            }
            else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }

            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (nVert === AscFormat.nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);

            }
            if (nVert === AscFormat.nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);

            this.clipRect =
            {
                x: -_body_pr.lIns,
                y: -_vertical_shift - _body_pr.tIns,
                w: this.contentWidth + (_body_pr.rIns + _body_pr.lIns),
                h: this.contentHeight + (_body_pr.bIns + _body_pr.tIns)
            };
        }

        this.transformText = this.ownTransformText.CreateDublicate();
    },

    getStyles: function()
    {
        return AscFormat.ExecuteNoHistory(function(){
            if(this.lastStyleObject)
                return this.lastStyleObject;
            var styles = new CStyles(false);
            var style = new CStyle("dataLblStyle", null, null, null);
            var text_pr = new CTextPr();
            text_pr.FontSize = 10;
            if(this.chart && AscFormat.isRealNumber(this.chart.style) )
            {

                if(this.chart.style > 40)
                {
                    text_pr.Unifill = AscFormat.CreateUnfilFromRGB(255, 255, 255);
                }
                else
                {
                    var default_style = AscFormat.CHART_STYLE_MANAGER.getDefaultLineStyleByIndex(this.chart.style);
                    var oUnifill = default_style.axisAndMajorGridLines.createDuplicate();
                    if(oUnifill && oUnifill.fill && oUnifill.fill.color && oUnifill.fill.color.Mods)
                    {
                        oUnifill.fill.color.Mods.Mods.length = 0;
                    }
                    text_pr.Unifill = oUnifill;
                }
            }
            else
            {
                text_pr.Unifill = AscFormat.CreateUnfilFromRGB(0,0,0);
            }

            var para_pr = new CParaPr();
            para_pr.Jc = AscCommon.align_Center;
            para_pr.Spacing.Before = 0.0;
            para_pr.Spacing.After = 0.0;
            para_pr.Spacing.Line = 1;
            para_pr.Spacing.LineRule = Asc.linerule_Auto;
            style.ParaPr = para_pr;
            text_pr.RFonts.Set_FromObject(
                {
                    Ascii: {
                        Name: "+mn-lt",
                        Index: -1
                    },
                    EastAsia: {
                        Name: "+mn-ea",
                        Index: -1
                    },
                    HAnsi: {
                        Name: "+mn-lt",
                        Index: -1
                    },
                    CS: {
                        Name: "+mn-lt",
                        Index: -1
                    }
                }
            );
            style.TextPr = text_pr;
            var chart_text_pr;

            if(this.chart && this.chart.txPr
                && this.chart.txPr.content
                && this.chart.txPr.content.Content[0]
                && this.chart.txPr.content.Content[0].Pr)
            {
                this.chart.txPr.content.Content[0].Set_DocumentIndex(0);
                style.ParaPr.Merge(this.chart.txPr.content.Content[0].Pr);
                if(this.chart.txPr.content.Content[0].Pr.DefaultRunPr)
                {
                    chart_text_pr = this.chart.txPr.content.Content[0].Pr.DefaultRunPr;
                    style.TextPr.Merge(chart_text_pr);
                }
            }
            if(this instanceof  CTitle || this.parent  instanceof  CTitle)
            {
                style.TextPr.Bold = true;
                if(this.parent instanceof CChart || (this.parent && (this.parent.parent instanceof  CChart)))
                {
                    if(chart_text_pr && typeof chart_text_pr.FontSize === "number")
                        style.TextPr.FontSize = (chart_text_pr.FontSize*1.2) >> 0;
                    else
                        style.TextPr.FontSize = 18;
                }
            }
            if(this instanceof  CalcLegendEntry
                && this.legend)
            {
                if(this.legend.txPr
                && this.legend.txPr.content
                && this.legend.txPr.content.Content[0]
                && this.legend.txPr.content.Content[0].Pr)
                {
                    this.legend.txPr.content.Content[0].Set_DocumentIndex(0);
                    style.ParaPr.Merge(this.legend.txPr.content.Content[0].Pr);
                    if(this.legend.txPr.content.Content[0].Pr.DefaultRunPr)
                        style.TextPr.Merge(this.legend.txPr.content.Content[0].Pr.DefaultRunPr);
                }

                if(AscFormat.isRealNumber(this.idx))
                {
                    var aLegendEntries = this.legend.legendEntryes;
                    for(var i = 0; i < aLegendEntries.length; ++i)
                    {
                        if(this.idx === aLegendEntries[i].idx)
                        {
                            var oLegendEntry = aLegendEntries[i];
                            if(oLegendEntry.txPr
                                && oLegendEntry.txPr.content
                                && oLegendEntry.txPr.content.Content[0]
                                && oLegendEntry.txPr.content.Content[0].Pr)
                            {
                                style.ParaPr.Merge(oLegendEntry.txPr.content.Content[0].Pr);
                                if(oLegendEntry.txPr.content.Content[0].Pr.DefaultRunPr)
                                    style.TextPr.Merge(oLegendEntry.txPr.content.Content[0].Pr.DefaultRunPr);
                            }
                            break;
                        }
                    }
                }

            }

            if(!(this instanceof  CTitle) && this.parent && this.parent.txPr
                && this.parent.txPr.content
                && this.parent.txPr.content.Content[0]
                && this.parent.txPr.content.Content[0].Pr)
            {
                this.parent.txPr.content.Content[0].Set_DocumentIndex(0);
                style.ParaPr.Merge(this.parent.txPr.content.Content[0].Pr);
                if(this.parent.txPr.content.Content[0].Pr.DefaultRunPr)
                    style.TextPr.Merge(this.parent.txPr.content.Content[0].Pr.DefaultRunPr);
            }

            if(this.txPr
                && this.txPr.content
                && this.txPr.content.Content[0]
                && this.txPr.content.Content[0].Pr)
            {
                this.txPr.content.Content[0].Set_DocumentIndex(0);
                style.ParaPr.Merge(this.txPr.content.Content[0].Pr);
                if(this.txPr.content.Content[0].Pr.DefaultRunPr)
                    style.TextPr.Merge(this.txPr.content.Content[0].Pr.DefaultRunPr);
            }
            styles.Add(style);
            if(!(this instanceof CTitle))
                this.lastStyleObject = {lastId: style.Id, styles: styles};
            return {lastId: style.Id, styles: styles};
        }, this, []);
    },

    Get_Theme: function()
    {
        return this.chart.Get_Theme();
    },
    Get_ColorMap: function()
    {
        return this.chart.Get_ColorMap();
    },

    Get_AbsolutePage: function()
    {
        if(this.chart && this.chart.Get_AbsolutePage)
        {
            return this.chart.Get_AbsolutePage();
        }
        return 0;
    },

    recalculateStyle: function()
    {
        AscFormat.ExecuteNoHistory(function()
            {
                this.compiledStyles = this.getStyles();
            },
            this, []);
    },

    Get_Styles: function(lvl)
    {
        if(this.recalcInfo.recalcStyle)
        {
            this.recalculateStyle();
            this.recalcInfo.recalcStyle = false;
        }
        return this.compiledStyles;
    },

    checkNoLbl: function()
    {
        if(this.tx && this.tx.rich)
            return false;
        else
        {
            return !(this.showSerName || this.showCatName || this.showVal || this.showPercent);
        }
    },

    getDefaultTextForTxBody: function()
    {
        var compiled_string = "";
        var separator = typeof this.separator === "string" ? this.separator +" " : "\n";
        if(this.showSerName)
        {
            compiled_string += this.series.getSeriesName();
        }
        if(this.showCatName)
        {
            if(compiled_string.length > 0)
                compiled_string += separator;
            compiled_string += this.series.getCatName(this.pt.idx);
        }
        if(this.showVal)
        {
            if(compiled_string.length > 0)
                compiled_string += separator;
            var sFormatCode;
            if(typeof this.pt.formatCode === "string" && this.pt.formatCode.length > 0){
                sFormatCode =  this.pt.formatCode;
            }
            else{
                sFormatCode = this.series.getFormatCode();
            }

            var num_format = AscCommon.oNumFormatCache.get(sFormatCode);
            compiled_string += num_format.formatToChart(this.series.getValByIndex(this.pt.idx));
        }
        if(this.showPercent)
        {
            if(compiled_string.length > 0)
                compiled_string += separator;
            compiled_string += this.series.getValByIndex(this.pt.idx, true);
        }
        return compiled_string;
    },

    getMaxWidth: function(bodyPr)
    {
        if(!(this.parent && (this.parent.axPos === AX_POS_L || this.parent.axPos === AX_POS_R)))
        {
            switch (bodyPr.vert)
            {
                case AscFormat.nVertTTeaVert:
                case AscFormat.nVertTTmongolianVert:
                case AscFormat.nVertTTvert:
                case AscFormat.nVertTTwordArtVert:
                case AscFormat.nVertTTwordArtVertRtl:
                case AscFormat.nVertTTvert270:
                {
                    return this.chart.extY/2;
                }
                case AscFormat.nVertTThorz:
                {
                    return this.chart.extX/5
                }
            }
            return this.chart.extX/5;
        }
        else
        {
            return 20000;//надписи для осей значений не переносятся поэтому выставляем большую ширину.
        }
    },

    getBodyPr: function()
    {
        var ret = new AscFormat.CBodyPr();
        ret.setDefault();
        if(this.tx && this.tx.rich)
        {
            ret.merge(this.tx.rich.bodyPr);
        }
        else
        {
            if(this.txPr && this.txPr.bodyPr)
            {
                ret.merge(this.txPr.bodyPr);
            }
        }

        if(this.parent && AscFormat.isRealNumber(this.parent.axPos) && (this.parent.axPos === AX_POS_L || this.parent.axPos === AX_POS_R)
            && ((this.tx && this.tx.rich && (!this.tx.rich.bodyPr ||  !AscFormat.isRealNumber(this.tx.rich.bodyPr.vert) ) ) || (!(this.tx && this.tx.rich) && (!this.txPr || !this.txPr.bodyPr || !AscFormat.isRealNumber(this.txPr.bodyPr.vert))))  )
        {
            ret.vert = AscFormat.nVertTTvert270;
        }
        if( (!this.txPr || !this.txPr.bodyPr || !AscFormat.isRealNumber(this.txPr.bodyPr.anchor)))
        {
            ret.anchor = 1;
        }


        //Пока не поддерживаем bodyPr.rot. Костыль под эффект_штурмовика.docx.
        if(AscFormat.isRealNumber(ret.rot) && 0 !== ret.rot)
        {
            if(Math.abs(ret.rot - 5400000) < 1000)
            {
                if(ret.vert === AscFormat.nVertTTvert270)
                {
                    ret.vert = AscFormat.nVertTThorz;
                }
                else if(ret.vert === AscFormat.nVertTThorz)
                {
                    ret.vert = AscFormat.nVertTTvert;
                }
            }
            else if(Math.abs(ret.rot + 5400000) < 1000)
            {
                if(ret.vert === AscFormat.nVertTTvert)
                {
                    ret.vert = AscFormat.nVertTThorz;
                }
                else if(ret.vert === AscFormat.nVertTThorz)
                {
                    ret.vert = AscFormat.nVertTTvert270;
                }
            }
        }
        //

        switch (ret.vert)
        {
            case AscFormat.nVertTTeaVert:
            case AscFormat.nVertTTmongolianVert:
            case AscFormat.nVertTTvert:
            case AscFormat.nVertTTwordArtVert:
            case AscFormat.nVertTTwordArtVertRtl:
            case AscFormat.nVertTTvert270:
            {
                ret.lIns = SCALE_INSET_COEFF;
                ret.rIns = SCALE_INSET_COEFF;
                ret.tIns = SCALE_INSET_COEFF*0.5;
                ret.bIns = SCALE_INSET_COEFF*0.5;
                break;
            }
            case AscFormat.nVertTThorz:
            {
                ret.lIns = SCALE_INSET_COEFF;
                ret.rIns = SCALE_INSET_COEFF;
                ret.tIns = SCALE_INSET_COEFF*0.5;
                ret.bIns = SCALE_INSET_COEFF*0.5;
                break;
            }
        }
        return ret;
    },

    recalculateContent: function()
    {
        if(this.txBody)
        {
            var bodyPr = this.getBodyPr();
            var max_box_width = this.getMaxWidth(bodyPr);/*�������� ����������������� ����� ����� ��������*/
            var max_content_width = max_box_width - 2*SCALE_INSET_COEFF;

            var content = this.txBody.content;
            content.Reset(0, 0, max_content_width, 20000);

            content.Recalculate_Page(0, true);
            var pargs = content.Content;
            var max_width = 0;
            for(var i = 0; i < pargs.length; ++i)
            {
                var par = pargs[i];
                for(var j = 0; j < par.Lines.length; ++j)
                {
                    if(par.Lines[j].Ranges[0].W > max_width)
                    {
                        max_width = par.Lines[j].Ranges[0].W;
                    }
                }
            }
            max_width += 1;
            content.Reset(0, 0, max_width, 20000);
            content.Recalculate_Page(0, true);

            switch (bodyPr.vert)
            {
                case AscFormat.nVertTTeaVert:
                case AscFormat.nVertTTmongolianVert:
                case AscFormat.nVertTTvert:
                case AscFormat.nVertTTwordArtVert:
                case AscFormat.nVertTTwordArtVertRtl:
                case AscFormat.nVertTTvert270:
                {
                    this.extX = Math.min(content.Get_SummaryHeight() + 4.4*SCALE_INSET_COEFF, max_box_width);
                    this.extY = max_width + 2*SCALE_INSET_COEFF;
                    this.x = 0;
                    this.y = 0;

                    this.txBody.contentWidth = this.extY;
                    this.txBody.contentHeight = this.extX;
                    this.contentWidth = this.extY;
                    this.contentHeight = this.extX;
                    break;
                }
                default:
                {
                    var _rot = AscFormat.isRealNumber(bodyPr.rot) ? bodyPr.rot*AscFormat.cToRad2 : 0;
                    var t = new CMatrix();
                    global_MatrixTransformer.RotateRadAppend(t, -_rot);
                    var w, h, x0, y0, x1, y1, x2, y2, x3, y3;
                    w = max_width;
                    h = this.txBody.content.Get_SummaryHeight();
                    x0 = 0;
                    y0 = 0;
                    x1 = t.TransformPointX(w, 0);
                    y1 = t.TransformPointY(w, 0);
                    x2 = t.TransformPointX(w, h);
                    y2 = t.TransformPointY(w, h);
                    x3 = t.TransformPointX(0, h);
                    y3 = t.TransformPointY(0, h);

                    this.extX = Math.max(x0, x1, x2, x3) - Math.min(x0, x1, x2, x3) + 1.25;
                    this.extY =  Math.max(y0, y1, y2, y3) - Math.min(y0, y1, y2, y3) + SCALE_INSET_COEFF;
                    this.x = 0;
                    this.y = 0;

                    this.txBody.contentWidth = this.extX;
                    this.txBody.contentHeight = this.extY;
                    this.contentWidth = this.extX;
                    this.contentHeight = this.extY;
                    break;
                }
            }

        }
    },

    recalculateTxBody: function()
    {
        if(this.tx && this.tx.rich)
        {
            this.txBody = this.tx.rich;
            this.txBody.parent = this;
        }
        else
        {
            this.txBody = AscFormat.CreateTextBodyFromString(this.getDefaultTextForTxBody(), this.chart.getDrawingDocument(), this);
        }
    },

    initDefault: function(nDefaultPosition)
    {
        this.setDelete(false);
        this.setDLblPos(AscFormat.isRealNumber(nDefaultPosition) ? nDefaultPosition : c_oAscChartDataLabelsPos.inBase);
        this.setIdx(null);
        this.setLayout(null);
        this.setNumFmt(null);
        this.setSeparator(null);
        this.setShowBubbleSize(false);
        this.setShowCatName(false);
        this.setShowLegendKey(false);
        this.setShowPercent(false);
        this.setShowSerName(false);
        this.setShowVal(false);
        this.setSpPr(null);
        this.setTx(null);
        this.setTxPr(null);
    },

    merge: function(dLbl, noCopyTxBody)
    {
        if(!dLbl)
            return;
        if(dLbl.bDelete != null)
            this.setDelete(dLbl.bDelete);
        if(dLbl.dLblPos != null)
            this.setDLblPos(dLbl.dLblPos);

        if(dLbl.idx != null)
            this.setIdx(dLbl.idx);
        
        if(dLbl.layout != null)
        {
            this.setLayout(dLbl.layout.createDuplicate());
        }

        if(dLbl.numFmt != null)
            this.setNumFmt(dLbl.numFmt);

        if(dLbl.separator != null)
            this.setSeparator(dLbl.separator);

        if(dLbl.showBubbleSize != null)
            this.setShowBubbleSize(dLbl.showBubbleSize);

        if(dLbl.showCatName != null)
            this.setShowCatName(dLbl.showCatName);

        if(dLbl.showLegendKey != null)
            this.setShowLegendKey(dLbl.showLegendKey);

        if(dLbl.showPercent != null)
            this.setShowPercent(dLbl.showPercent);

        if(dLbl.showSerName != null)
            this.setShowSerName(dLbl.showSerName);


        if(dLbl.showVal != null)
            this.setShowVal(dLbl.showVal);

        if(dLbl.spPr != null)
        {
            if(this.spPr == null)
            {
                this.setSpPr(new AscFormat.CSpPr());
            }
            if(dLbl.spPr.Fill)
            {
                if(this.spPr.Fill == null)
                {
                    this.spPr.setFill(new AscFormat.CUniFill());
                }
                this.spPr.Fill.merge(dLbl.spPr.Fill);
            }
            if(dLbl.spPr.ln)
            {
                if(this.spPr.ln == null)
                {
                    this.spPr.setLn(new AscFormat.CLn());
                }
                this.spPr.ln.merge(dLbl.spPr.ln);
            }
        }
        if(dLbl.tx)
        {
            if(this.tx == null)
            {
                this.setTx(new CChartText());
            }
            this.tx.merge(dLbl.tx, noCopyTxBody);
        }
        if(dLbl.txPr)
        {
            if(noCopyTxBody === true)
            {
                var oldParent = dLbl.txPr.parent;
                this.setTxPr(dLbl.txPr);
                dLbl.txPr.parent = oldParent;
            }
            else
            {
                this.setTxPr(dLbl.txPr.createDuplicate());
            }
            this.txPr.setParent(this);
        }
    },

    draw: CShape.prototype.draw,

    isEmptyPlaceholder: function()
    {
        return false;
    },
    setPosition: function(x, y)
    {
        this.x = x;
        this.y = y;

    
            this.calcX = this.x;
            this.calcY = this.y;

        this.localTransform.Reset();
        global_MatrixTransformer.TranslateAppend(this.localTransform, this.calcX, this.calcY);
      //  if (isRealObject(this.chart))
      //  {
      //      global_MatrixTransformer.MultiplyAppend(this.localTransform, this.chart.localTransform);
      //  }

        this.transform = this.localTransform.CreateDublicate();
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);



        this.localTransformText = this.ownTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.localTransformText, this.calcX, this.calcY);
      //  if (isRealObject(this.chart))
      //  {
      //      global_MatrixTransformer.MultiplyAppend(this.localTransformText, this.chart.localTransform);
      //  }

        this.transformText = this.localTransformText.CreateDublicate();
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    },

    setPosition2: function(x, y)
    {
        this.x = x;
        this.y = y;

        this.calcX = this.x;
        this.calcY = this.y;



        this.localTransform.tx = x;
        this.localTransform.ty = y;

        this.transform = this.localTransform.CreateDublicate();
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);


        this.localTransformText.tx = x;
        this.localTransformText.ty = y;
        this.transformText = this.localTransformText.CreateDublicate();
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    },

    updateTransformMatrix: function()
    {
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, this.posX, this.posY);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);

        if(this.localTransformText)
        {
            this.transformText = this.localTransformText.CreateDublicate();
            global_MatrixTransformer.TranslateAppend(this.transformText, this.posX, this.posY);
            this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        }

    },

    updatePosition: function(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, x, y);

        this.transformText = this.localTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transformText, x, y);


        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);

    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetDelete, this.bDelete, pr));
        this.bDelete = pr;
        this.Refresh_RecalcData2();
    },
    setDLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DLbl_SetDLblPos, this.dLblPos, pr));
        this.dLblPos = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DLbl_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setLayout: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbl_SetLayout, this.layout, pr));
        this.layout = pr;
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbl_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    },
    setSeparator: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DLbl_SetSeparator, this.separator, pr));
        this.separator = pr;
    },
    setShowBubbleSize: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowBubbleSize, this.showBubbleSize, pr));
        this.showBubbleSize = pr;
    },
    setShowCatName: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowCatName, this.showCatName, pr));
        this.showCatName = pr;
    },
    setShowLegendKey: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowLegendKey, this.showLegendKey, pr));
        this.showLegendKey = pr;
    },
    setShowPercent: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowPercent, this.showPercent, pr));
        this.showPercent = pr;
    },
    setShowSerName: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowSerName, this.showSerName, pr));
        this.showSerName = pr;
    },
    setShowVal: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbl_SetShowVal, this.showVal, pr));
        this.showVal = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbl_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbl_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbl_SetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
    },

    Refresh_RecalcData2: function()
    {
        if(this.parent && this.parent.Refresh_RecalcData2)
        {
            this.parent.Refresh_RecalcData2();
        }
            }
};


function CPlotArea()
{
    this.charts = [];
    this.dTable = null;
    this.layout = null;
    this.serAx = null;
    this.spPr = null;
    this.axId = [];

    //ТоDo
    this.valAx = null;
    this.catAx = null;
    this.dateAx = null;
    this.chart = null;

    this.parent = null;


    this.m_oChartsContentChnages = new AscCommon.CContentChanges();
    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    //

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPlotArea.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function(data)
    {
        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_RemoveAxis:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_RemoveChart:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_AddChart:
            {
                if(this.parent && this.parent.parent)
                    this.parent.parent.handleUpdateType();
                break;
            }
            case AscDFH.historyitem_PlotArea_SetCatAx:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetDateAx:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetDTable:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetLayout:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetSerAx:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetSpPr:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_SetValAx:
            {
                break;
            }
            case AscDFH.historyitem_PlotArea_AddAxis:
            {
                break;
            }
        }
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_PlotArea_AddAxis:
            case AscDFH.historyitem_PlotArea_RemoveAxis:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_PlotArea_AddChart:
            case AscDFH.historyitem_PlotArea_RemoveChart:{
                return this.m_oChartsContentChnages;
            }
        }
        return null;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PlotArea;
    },

    createDuplicate: function()
    {
        var c = new CPlotArea(), i, j, k;

        if(this.dTable)
        {
            c.setDTable(this.dTable.createDuplicate());
        }
        if(this.layout)
        {
            c.setLayout(this.layout.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        
        var len = this.axId.length;
        for(i = 0; i < len; i++)
        {
            var oAxis = this.axId[i].createDuplicate();
            oAxis.setAxId(++AscFormat.Ax_Counter.GLOBAL_AX_ID_COUNTER);
            c.addAxis(oAxis);
        }

        var cur_chart, cur_axis;
        for(i = 0; i < this.charts.length; ++i)
        {
            cur_chart = this.charts[i];
            c.addChart(cur_chart.createDuplicate(), c.charts.length);
            if(Array.isArray(cur_chart.axId))
            {
                for(j = 0; j < cur_chart.axId.length; ++j)
                {
                    cur_axis = cur_chart.axId[j];
                    for(k = 0; k < this.axId.length; ++k)
                    {
                        if(cur_axis === this.axId[k])
                        {
                            c.charts[i].addAxId(c.axId[k]);
                        }
                    }
                }
            }
        }

        //выставим пересечения осей в копии

        for(i = 0; i < this.axId.length; ++i)
        {
            cur_axis = this.axId[i];
            for(j = 0; j < this.axId.length; ++j)
            {
                if(cur_axis.crossAx === this.axId[j])
                {
                    c.axId[i].setCrossAx(c.axId[j]);
                    break;
                }
            }
        }
        return c;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    addAxis: function(axis)
    {
        //сначала проверим не лежит ли ось уже в plotArea
        if(!axis)
            return;
        var i;
        for(i = 0; i < this.axId.length; ++i)
        {
            if(this.axId[i] === axis)
                return;
        }
        //если такой оси нет, можно добавлять.
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PlotArea_AddAxis, this.axId.length, [axis], true));
        this.axId.push(axis);
        axis.setParent(this);
    },

    addChart: function(pr, idx)
    {
        var pos;
        if(AscFormat.isRealNumber(idx))
            pos = idx;
        else
            pos = this.charts.length;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PlotArea_AddChart, pos, [pr], true));
        this.charts.splice(pos, 0, pr);
        pr.setParent(this);
        if(this.parent && this.parent.parent)
            this.parent.parent.handleUpdateType();
    },


    removeChartByPos: function(pos)
    {
        if(this.charts[pos])
        {
            var chart  = this.charts.splice(pos, 1)[0];
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PlotArea_RemoveChart, pos, [chart], false));
            //удалим все оси этой диаграммы, проверив прежде нет ли ссылок на данные оси в других диаграммах
            if(Array.isArray(chart.axId))
            {
                var chart_axis = chart.axId;
                for(var i = 0; i < chart_axis.length; ++i)
                {
                    var axis = chart_axis[i];
                    for(var j = 0; j  < this.charts.length; ++j)
                    {
                        var other_chart = this.charts[j];
                        if(Array.isArray(other_chart.axId))
                        {
                            for(var k = 0;  k  < other_chart.axId.length; ++k)
                            {
                                if(other_chart.axId[k] === axis)
                                    break;
                            }
                            if(k < other_chart.axId.length)
                                break;
                        }
                    }
                    if(j === this.charts.length)
                        this.removeAxis(axis);
                }
            }
        }
    },

    removeCharts: function(startPos, endPos)
    {
        for(var i = endPos; i >= startPos; --i)
        {
            this.removeChartByPos(i);
        }
    },

    removeAxis: function(axis)
    {
        for(var i = this.axId.length - 1; i > -1; --i)
        {
            if(this.axId[i] === axis)
            {
                History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PlotArea_RemoveAxis, i, [axis], false));
                this.axId.splice(i, 1);
            }
        }
    },

    setDTable: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PlotArea_SetDTable, this.dTable, pr));
        this.dTable = pr;
    },

    setLayout: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PlotArea_SetLayout, this.layout, pr));
        this.layout = pr;
    },



    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PlotArea_SetSpPr, this.spPr, pr));
        this.spPr = pr;
        if(pr)
        {
            pr.setParent(this);
        }
    },


    getHorizontalAxis: function()
    {
        var axis_by_types  = this.getAxisByTypes();
        for(var i = 0; i < axis_by_types.valAx.length; ++i)
        {
            if(axis_by_types.valAx[i].axPos === AX_POS_B || axis_by_types.valAx[i].axPos === AX_POS_T)
                return axis_by_types.valAx[i];
        }

        for(var i = 0; i < axis_by_types.catAx.length; ++i)
        {
            if(axis_by_types.catAx[i].axPos === AX_POS_B || axis_by_types.catAx[i].axPos === AX_POS_T)
                return axis_by_types.catAx[i];
        }
        return null;


    },


    getVerticalAxis: function()
    {
        var axis_by_types  = this.getAxisByTypes();
        for(var i = 0; i < axis_by_types.valAx.length; ++i)
        {
            if(axis_by_types.valAx[i].axPos === AX_POS_L || axis_by_types.valAx[i].axPos === AX_POS_R)
                return axis_by_types.valAx[i];
        }

        for(var i = 0; i < axis_by_types.catAx.length; ++i)
        {
            if(axis_by_types.catAx[i].axPos === AX_POS_L || axis_by_types.catAx[i].axPos === AX_POS_R)
                return axis_by_types.catAx[i];
        }
        return null;
    },

    getAxisByTypes: function()
    {
        var  ret = {valAx:[], catAx: [], dateAx: []};
        for(var i = 0; i < this.axId.length; ++i)
        {
            var axis = this.axId[i];
            switch(axis.getObjectType())
            {
                case AscDFH.historyitem_type_CatAx:
                case AscDFH.historyitem_type_DateAx:
                case AscDFH.historyitem_type_SerAx:
                {
                    ret.catAx.push(axis);
                    break;
                }
                case AscDFH.historyitem_type_ValAx:
                {
                    ret.valAx.push(axis);
                    break;
                }
                //TODO DATE Axis
            }
        }
        return ret;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CBarChart()
{
    this.axId        = [];
    this.barDir      = null;
    this.dLbls       = null;
    this.gapWidth    = null;
    this.grouping    = null;
    this.overlap     = null;
    this.series      = [];
    this.serLines    = null;
    this.varyColors  = null;

    this.parent = null;
    this.b3D = null;
    this.gapDepth = null;
    this.shape = null;


    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBarChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    set3D: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BarChart_Set3D, this.b3D, pr));
        this.b3D = pr;
    },

    setGapDepth: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetGapDepth, this.gapDepth, pr));
        this.gapDepth = pr;
    },

    setShape: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetShape, this.shape, pr));
        this.shape = pr;
    },

    getSeriesConstructor: function()
    {
        return new CBarSeries();
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            var aRemoved = this.series.splice(idx, 1);
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, aRemoved, false))
        }
    },

    createDuplicate: function()
    {
        //axId будут выставлены из родительского класса
        var c = new CBarChart();
        c.setBarDir(this.barDir);
        if(this.b3D)
        {
            c.set3D(true);
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        c.setGapWidth(this.gapWidth);
        c.setGrouping(this.grouping);
        c.setOverlap(this.overlap);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        if(this.serLines)
        {
            c.setSerLines(this.serLines.createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },


    getDefaultDataLabelsPosition: function()
    {
        if(!AscFormat.isRealNumber(this.grouping) || this.grouping === AscFormat.BAR_GROUPING_CLUSTERED || this.grouping === AscFormat.BAR_GROUPING_STANDARD)
        {
            return c_oAscChartDataLabelsPos.outEnd;
        }
        return c_oAscChartDataLabelsPos.ctr;
    },

    documentCreateFontMap: function(allFonts)
    {
        this.dLbls && this.dLbls.documentCreateFontMap(allFonts);
        for(var i =0 ; i < this.series.length; ++i)
        {
            this.series[i] && this.series[i].documentCreateFontMap(allFonts);
        }
    },

    removeDataLabels: function()
    {
        var i;
        for(i = 0; i < this.series.length; ++i)
        {
            if(typeof this.series[i].setDLbls === "function" && this.series[i].dLbls)
                this.series[i].setDLbls(null);
        }
    },

    getAllRasterImages: function(images)
    {
        this.dLbls && this.dLbls.getAllRasterImages(images);
        for(var i = 0; i < this.series.length; ++i)
            this.series[i].getAllRasterImages(images);
    },


    checkSpPrRasterImages: function(images)
    {
        this.dLbls && this.dLbls.checkSpPrRasterImages(images);
        for(var i = 0; i < this.series.length; ++i)
            this.series[i].checkSpPrRasterImages(images);
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_BarChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_BarChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_BarChart;
    },


    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch(data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_BarChart_AddAxId:
            {
                break;
            }
            case AscDFH.historyitem_BarChart_SetBarDir:
            case AscDFH.historyitem_BarChart_Set3D:
            case AscDFH.historyitem_BarChart_SetGapDepth:
            case AscDFH.historyitem_BarChart_SetShape:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case AscDFH.historyitem_BarChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break;
            }
            case AscDFH.historyitem_BarChart_SetGapWidth:
            {
                break;
            }
            case AscDFH.historyitem_BarChart_SetGrouping:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateInternalChart();
                }
                break;
            }
            case AscDFH.historyitem_BarChart_SetOverlap:
            {
                break;
            }
            case AscDFH.historyitem_BarChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_BarChart_SetSerLines:
            {
                break;
            }
            case AscDFH.historyitem_BarChart_SetVaryColors:
            {
                break;
            }
        }

    },

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setFromOtherChart: function(c)
    {
        var i;
        //if(Array.isArray(c.axId))
        //{
        //    for(i = 0; i < c.axId.length; ++i)
        //    {
        //        this.addAxId(c.axId[i]);
        //    }
        //}
        if(AscFormat.isRealNumber(c.barDir))
            this.setBarDir(c.barDir);

        if(c.dLbls)
            this.setDLbls(c.dLbls);

        if(AscFormat.isRealNumber(c.gapWidth))
            this.setGapWidth(c.gapWidth);
        if(AscFormat.isRealNumber(c.grouping))
            this.setGrouping(c.grouping);
        if(AscFormat.isRealNumber(c.overlap))
            this.setOverlap(c.overlap);
        if(Array.isArray(c.series))
        {
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CBarSeries();
                ser.setFromOtherSeries(c.series[i]);
                this.addSer(ser);
            }
        }
        if(AscFormat.isRealBool(c.varyColors))
            this.setVaryColors(c.varyColors);
    },

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_BarChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setBarDir: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetBarDir, this.barDir, pr));
        this.barDir = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setDLbls     : function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setGapWidth: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetGapWidth, this.gapWidth, pr));
        this.gapWidth = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetGrouping, this.grouping, pr));
        this.grouping = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setOverlap: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarChart_SetOverlap, this.overlap, pr));
        this.overlap = pr;
    },
    addSer: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_BarChart_AddSer, this.series.length, [pr], true));
        this.series.push(pr);
        pr.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setSerLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarChart_SetSerLines, this.serLines, pr));
        this.serLines = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BarChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CAreaChart()
{
    this.axId         = [];
    this.dLbls        = null;
    this.dropLines    = null;
    this.grouping     = null;
    this.series       = [];
    this.varyColors   = null;
    this.parent  = null;

    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CAreaChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_AreaChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_AreaChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            var arrSeries = this.series.splice(idx, 1);
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, arrSeries, false));
        }
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.ctr;
    },

    getSeriesConstructor: function()
    {
        return new CAreaSeries();
    },
    createDuplicate: function()
    {
        //axId будут выставлены из родительского класса
        var c = new CAreaChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        if(this.dropLines)
        {
            c.setDropLines(this.dropLines.createDuplicate());
        }
        c.setGrouping(this.grouping);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },

    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_AreaChart_AddAxId:
            {
                break
            }
            case AscDFH.historyitem_AreaChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break
            }
            case AscDFH.historyitem_AreaChart_SetDropLines:
            {
                break
            }
            case AscDFH.historyitem_AreaChart_SetGrouping:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateInternalChart();
                }
                break
            }
            case AscDFH.historyitem_AreaChart_SetVaryColors:
            {
                break
            }
            case AscDFH.historyitem_AreaChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
        }
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_AreaChart;
    },

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,
    removeDataLabels: CBarChart.prototype.removeDataLabels,
    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    setFromOtherChart: function(c)
    {
        var i;
        //if(Array.isArray(c.axId))
        //{
        //    for(i = 0; i < c.axId.length; ++i)
        //    {
        //        this.addAxId(c.axId[i]);
        //    }
        //}
        if(c.dLbls)
            this.setDLbls(c.dLbls);
        if(c.dropLines)
            this.setDropLines(c.dropLines);
        if(AscFormat.isRealNumber(c.grouping))
            this.setGrouping(c.grouping);
        if(Array.isArray(c.series))
        {
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CAreaSeries();
                ser.setFromOtherSeries(c.series[i]);
                this.addSer(ser);
            }
        }
        if(AscFormat.isRealBool(c.varyColors))
            this.setVaryColors(c.varyColors);
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_AreaChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setDropLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaChart_SetDropLines, this.dropLines, pr));
        this.dropLines = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_AreaChart_SetGrouping, this.grouping, pr));
        this.grouping = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_AreaChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_AreaChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CAreaSeries()
{
    this.cat            = null;
    this.dLbls          = null;
    this.dPt            = [];
    this.errBars        = null;
    this.idx            = null;
    this.order          = null;
    this.pictureOptions = null;
    this.spPr           = null;
    this.trendline      = null;

    this.parent = null;

    this.tx  = null;
    this.val = null;

    this.m_oDPtContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CAreaSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_AreaSeries_SetDPt:
            case AscDFH.historyitem_CommonSeries_RemoveDPt:{
                return this.m_oDPtContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CAreaSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        if(this.errBars)
        {
            c.setErrBars(this.errBars.createDuplicate());
        }
        c.setIdx(this.idx);
        c.setOrder(this.order);
        if(this.pictureOptions)
        {
            c.setPictureOptions(this.pictureOptions.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.trendline)
        {
            c.setTrendline(this.trendline.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    documentCreateFontMap: function(allFonts)
    {
        this.dLbls && this.dLbls.documentCreateFontMap(allFonts);
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_AreaSeries;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },


    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    getAllRasterImages: function(images)
    {
        this.spPr && this.spPr.checkBlipFillRasterImage(images);
        this.dLbls && this.dLbls.getAllRasterImages(images);
        this.marker && this.marker.spPr && this.marker.spPr.checkBlipFillRasterImage(images);
        if(this.dPt){
            for(var i = 0; i < this.dPt.length; ++i)
            {
                this.dPt[i].spPr && this.dPt[i].spPr.checkBlipFillRasterImage(images);
                this.dPt[i].marker && this.dPt[i].marker.spPr && this.dPt[i].marker.spPr.checkBlipFillRasterImage(images);
            }
        }
    },

    checkSpPrRasterImages: function(images)
    {
        checkSpPrRasterImages(this.spPr);
        checkSpPrRasterImages(this.dLbls);
        for(var i = 0; i < this.dPt.length; ++i)
        {
            checkSpPrRasterImages(this.dPt[i].spPr);
            this.dPt[i].marker && checkSpPrRasterImages(this.dPt[i].marker.spPr);
        }
    },

    setFromOtherSeries: function(o)
    {
        if(o.cat)
            this.setCat(o.cat);
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(o.dPt)
        {
            for(var i = 0; i < o.dPt.length; ++i)
            {
                this.addDPt(o.dPt[i]);
            }
        }
        if(o.errBars)
            this.setErrBars(o.errBars);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(AscFormat.isRealNumber(o.order))
            this.setOrder(o.order);
        if(o.pictureOptions)
            this.setPictureOptions(o.pictureOptions);
        if(o.spPr){
            this.setSpPr(o.spPr);
            if((o instanceof AscFormat.CLineSeries) || (o instanceof AscFormat.CScatterSeries)){
                if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill.type ===  window['Asc'].c_oAscFill.FILL_TYPE_NOFILL){
                    this.spPr.setFill(null);
                }
            }
        }
        if(o.trendline)
            this.setTrendline(o.trendline);
        if(o.tx)
            this.setTx(o.tx);
        if(o.val)
            this.setVal(o.val);

        if(o.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(o.xVal);
        }
        if(o.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(o.yVal);
        }
    },

    getSeriesName: function()
    {
        if(this.tx)
        {
            if(typeof this.tx.val === "string")
            {
                return this.tx.val;
            }
            if(this.tx.strRef
                && this.tx.strRef.strCache
                && this.tx.strRef.strCache.pts.length > 0
                && this.tx.strRef.strCache.pts[0]
                && typeof this.tx.strRef.strCache.pts[0].val === "string")
            {
                return this.tx.strRef.strCache.pts[0].val;
            }
        }
        return AscFormat.getChartTranslateManager().asc_getSeries() + " " + (this.idx + 1) ;
    },

    getCatName: function(idx)
    {
        var pts;
        var cat;
        if(this.cat)
        {
            cat = this.cat;
        }
        else if(this.xVal)
        {
            cat = this.xVal;
        }

        if(cat)
        {
            if(cat && cat.strRef && cat.strRef.strCache)
            {
                pts = cat.strRef.strCache.pts;
            }
            else if(cat.numRef && cat.numRef.numCache)
            {
                pts = cat.numRef.numCache.pts;
            }
            if(Array.isArray(pts))
            {
                for(var i = 0; i < pts.length; ++i)
                {
                    if(pts[i].idx === idx)
                    {
                        return pts[i].val + "";
                    }
                }
            }
        }
        return (idx + 1) + "";
    },

    getFormatCode: function()
    {
        var pts;
        var val;
        if(this.val)
        {
            val = this.val;
        }
        else if(this.yVal)
        {
            val = this.yVal;
        }

        if(val)
        {
            if(val && val.strRef && val.strRef.strCache && val.strRef.strCache.formatCode)
            {
                return val.strRef.strCache.formatCode;
            }
            else if(val.strLit && val.strLit.formatCode)
            {
                return val.strLit.formatCode;
            }
            else if(val.numRef && val.numRef.numCache && val.numRef.numCache.formatCode)
            {
                return val.numRef.numCache.formatCode;
            }
            else if(val.numLit && val.numLit.formatCode)
            {
                return val.numLit.formatCode;
            }
        }
        return "General"
    },

    getValByIndex: function(idx, bPercent)
    {
        var pts;
        var val;
        if(this.val)
        {
            val = this.val;
        }
        else if(this.yVal)
        {
            val = this.yVal;
        }

        if(val)
        {
            if(val && val.strRef && val.strRef.strCache)
            {
                pts = val.strRef.strCache.pts;
            }
            else if(val.strLit)
            {
                pts = val.strLit.pts;
            }
            else if(val.numRef && val.numRef.numCache)
            {
                pts = val.numRef.numCache.pts;
            }
            else if(val.numLit)
            {
                pts = val.numLit.pts;
            }
            if(Array.isArray(pts))
            {
                var i;
                if(!(bPercent === true))
                {
                    for(i = 0; i < pts.length; ++i)
                    {
                        if(pts[i].idx === idx)
                        {
                            return pts[i].val + "";
                        }
                    }
                }
                else
                {
                    var summ = 0, value;
                    for(i = 0; i < pts.length; ++i)
                    {
                        if(AscFormat.isRealNumber(pts[i].val))
                            summ += Math.abs(pts[i].val);

                        if(pts[i].idx === idx)
                        {
                            value = pts[i].val;
                        }
                    }

                    if(summ > 0 && AscFormat.isRealNumber(value))
                        return Math.round(100*(value/summ)) + "%";
                }
            }
        }
        return "";
    },

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_AreaSeries_SetDPt, this.dPt.length, [pr], true));
        this.dPt.push(pr);
    },

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            var arrPt =  this.dPt.splice(idx, 1);
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, arrPt, false));
        }
    },

    setErrBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetErrBars, this.errBars, pr));
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_AreaSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_AreaSeries_SetOrder, this.order, pr));
        this.order = pr;
    },
    setPictureOptions: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetPictureOptions, this.pictureOptions, pr));
        this.pictureOptions = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetTrendline, this.trendline, pr));
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },

    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_AreaSeries_SetVal, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

var TYPE_AXIS_CAT = 0;
var TYPE_AXIS_DATE = 1;
var TYPE_AXIS_SER = 2;
var TYPE_AXIS_VAL = 3;

var AX_POS_L = 0;
var AX_POS_T = 1;
var AX_POS_R = 2;
var AX_POS_B = 3;

var CROSSES_AUTO_ZERO = 0;
var CROSSES_MAX = 1;
var CROSSES_MIN = 2;

var LBL_ALG_CTR = 0;
var LBL_ALG_L = 1;
var LBL_ALG_R = 2;

var TIME_UNIT_DAYS = 0;
var TIME_UNIT_MONTHS = 1;
var TIME_UNIT_YEARS = 2;

var CROSS_BETWEEN_BETWEEN = 0;
var CROSS_BETWEEN_MID_CAT = 1;

function CCatAx()
{
    this.auto            = null;
    this.axId            = null;
    this.axPos           = null;
    this.crossAx         = null;
    this.crosses         = null;
    this.crossesAt       = null;
    this.bDelete          = null;
    this.extLst          = null;
    this.lblAlgn         = null;
    this.lblOffset       = null;
    this.majorGridlines  = null;
    this.majorTickMark   = null;
    this.minorGridlines  = null;
    this.minorTickMark   = null;
    this.noMultiLvlLbl   = null;
    this.numFmt          = null;
    this.scaling         = null;
    this.spPr            = null;
    this.tickLblPos      = null;
    this.tickLblSkip     = null;
    this.tickMarkSkip    = null;
    this.title           = null;
    this.txPr            = null;

    this.parent = null;
    this.posX = null;
    this.posY = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}


CCatAx.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
            this.parent.parent.parent.addToRecalculate();
        }
    },

    Refresh_RecalcData2: function(pageIndex, object)
    {
        this.parent && this.parent.parent && this.parent.parent.Refresh_RecalcData2(pageIndex, object);
    },

    getDrawingDocument: function()
    {
        return this.parent && this.parent.parent && this.parent.parent.getDrawingDocument && this.parent.parent.getDrawingDocument();
    },

    createDuplicate: function()
    {
        var c = new CCatAx();
        c.setAuto(this.auto);
        c.setAxPos(this.axPos);
        //todo crossAx выставляется родительским классом
        c.setCrosses(this.crosses);
        c.setCrossesAt(this.crossesAt);
        c.setDelete(this.bDelete);
        c.setLblAlgn(this.lblAlgn);
        c.setLblOffset(this.lblOffset);
        if(this.majorGridlines)
        {
            c.setMajorGridlines(this.majorGridlines.createDuplicate());
        }
        c.setMajorTickMark(this.majorTickMark);
        if(this.minorGridlines)
        {
            c.setMinorGridlines(this.minorGridlines.createDuplicate());
        }
        c.setMinorTickMark(this.minorTickMark);
        c.setNoMultiLvlLbl(this.noMultiLvlLbl);
        if(this.numFmt)
        {
            c.setNumFmt(this.numFmt.createDuplicate());
        }
        if(this.scaling)
        {
            c.setScaling(this.scaling.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        c.setTickLblPos(this.tickLblPos);
        c.setTickLblSkip(this.tickLblSkip);
        c.setTickMarkSkip(this.tickMarkSkip);
        if(this.title)
        {
            c.setTitle(this.title.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    getMenuProps: function()
    {
        var ret = new AscCommon.asc_CatAxisSettings();

        if(AscFormat.isRealNumber(this.tickMarkSkip))
            ret.putIntervalBetweenTick(this.tickMarkSkip);
        else
            ret.putIntervalBetweenTick(1);


        if(!AscFormat.isRealNumber(this.tickLblSkip))
            ret.putIntervalBetweenLabelsRule(c_oAscBetweenLabelsRule.auto);
        else
        {
            ret.putIntervalBetweenLabelsRule(c_oAscBetweenLabelsRule.manual);
            ret.putIntervalBetweenLabels(this.tickLblSkip);
        }

        var scaling = this.scaling;
        if(!scaling || scaling.orientation !== ORIENTATION_MAX_MIN)
            ret.putInvertCatOrder(false);
        else
            ret.putInvertCatOrder(true);

        //настройки пересечения с другой осью

        var crossAx = this.crossAx;

        if(crossAx)
        {
            if(AscFormat.isRealNumber(this.maxCatVal))
            {
                ret.putCrossMaxVal(this.maxCatVal);
            }
            ret.putCrossMinVal(1);
            if(AscFormat.isRealNumber(crossAx.crossesAt))
            {
                ret.putCrossesRule(c_oAscCrossesRule.value);
                ret.putCrosses(crossAx.crossesAt);
            }
            else if(crossAx.crosses === CROSSES_MAX)
            {
                ret.putCrossesRule(c_oAscCrossesRule.maxValue);
                if(AscFormat.isRealNumber(this.maxCatVal))
                {
                    ret.putCrosses(this.maxCatVal);
                }
            }
            else if(crossAx.crosses === CROSSES_MIN)
            {
                ret.putCrossesRule(c_oAscCrossesRule.minValue);
                ret.putCrosses(1);
            }
            else
            {
                ret.putCrossesRule(c_oAscCrossesRule.auto);
                ret.putCrosses(1);
            }
        }

        if(AscFormat.isRealNumber(this.lblOffset))
            ret.putLabelsAxisDistance(this.lblOffset);
        else
            ret.putLabelsAxisDistance(100);

        if(this.crossAx)
        {
            ret.putLabelsPosition(this.crossAx.crossBetween === CROSS_BETWEEN_MID_CAT ? c_oAscLabelsPosition.byDivisions : c_oAscLabelsPosition.betweenDivisions);
        }
        else
        {
            ret.putLabelsPosition(c_oAscLabelsPosition.betweenDivisions);
        }
        if(AscFormat.isRealNumber(this.tickLblPos))
            ret.putTickLabelsPos(this.tickLblPos);
        else
            ret.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);

        //настройки засечек на оси
        if(AscFormat.isRealNumber(this.majorTickMark))
            ret.putMajorTickMark(this.majorTickMark);
        else
            ret.putMajorTickMark(c_oAscTickMark.TICK_MARK_NONE);

        if(AscFormat.isRealNumber(this.minorTickMark))
            ret.putMinorTickMark(this.minorTickMark);
        else
            ret.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);
        return ret;
    },


    setMenuProps: function(props)
    {
        if(!(isRealObject(props)
            && typeof props.getAxisType === "function"
            &&(props.getAxisType() === c_oAscAxisType.cat || props.getAxisType() === c_oAscAxisType.date)))
            return;

        var  intervalBetweenTick       = props.getIntervalBetweenTick();
        var  intervalBetweenLabelsRule = props.getIntervalBetweenLabelsRule();
        var  intervalBetweenLabels     = props.getIntervalBetweenLabels();
        var  invertCatOrder            = props.getInvertCatOrder();
        var  labelsAxisDistance        = props.getLabelsAxisDistance();
        var  axisType                  = props.getAxisType();
        var  majorTickMark             = props.getMajorTickMark();
        var  minorTickMark             = props.getMinorTickMark();
        var  tickLabelsPos             = props.getTickLabelsPos();
        var  crossesRule               = props.getCrossesRule();
        var  crosses                   = props.getCrosses();
        var  labelsPosition            = props.getLabelsPosition();


        var bChanged = false;
        if(AscFormat.isRealNumber(intervalBetweenTick) && this.tickMarkSkip !== intervalBetweenTick && this.setTickMarkSkip)
        {
            this.setTickMarkSkip(intervalBetweenTick);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(intervalBetweenLabelsRule) && this.setTickLblSkip)
        {
            if(intervalBetweenLabelsRule === c_oAscBetweenLabelsRule.auto)
            {
                if(AscFormat.isRealNumber(this.tickLblSkip))
                {
                    this.setTickLblSkip(null);
                    bChanged = true;
                }
            }
            else if(intervalBetweenLabelsRule === c_oAscBetweenLabelsRule.manual && AscFormat.isRealNumber(intervalBetweenLabels) && this.tickLblSkip !== intervalBetweenLabels)
            {
                this.setTickLblSkip(intervalBetweenLabels);
                bChanged = true;
            }
        }

        if(!this.scaling)
            this.setScaling(new CScaling());
        var scaling = this.scaling;
        if(AscFormat.isRealBool(invertCatOrder))
        {
            var new_orientation = invertCatOrder ? ORIENTATION_MAX_MIN : ORIENTATION_MIN_MAX;
            if(scaling.orientation !== new_orientation)
            {
                scaling.setOrientation(invertCatOrder ? ORIENTATION_MAX_MIN : ORIENTATION_MIN_MAX);
                bChanged = true;
            }
        }
        if(AscFormat.isRealNumber(labelsAxisDistance) && this.lblOffset !== labelsAxisDistance && this.setLblOffset)
        {
            this.setLblOffset(labelsAxisDistance);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(axisType))
        {
            //TODO
        }

        if(AscFormat.isRealNumber(majorTickMark) && this.majorTickMark !== majorTickMark)
        {
            this.setMajorTickMark(majorTickMark);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(minorTickMark) && this.minorTickMark !== minorTickMark)
        {
            this.setMinorTickMark(minorTickMark);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(tickLabelsPos) && this.tickLblPos !== tickLabelsPos)
        {
            this.setTickLblPos(tickLabelsPos);
            bChanged = true;
        }


        if(AscFormat.isRealNumber(crossesRule) && isRealObject(this.crossAx))
        {
            if(crossesRule === c_oAscCrossesRule.auto)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_AUTO_ZERO)
                {
                    this.crossAx.setCrosses(CROSSES_AUTO_ZERO);
                    bChanged = true;
                }
            }
            else if(crossesRule === c_oAscCrossesRule.value)
            {
                if(AscFormat.isRealNumber(crosses))
                {
                    if(this.crossAx.crossesAt !== crosses)
                    {
                        this.crossAx.setCrossesAt(crosses);
                        bChanged = true;
                    }
                    if(this.crossAx !== null)
                    {
                        this.crossAx.setCrosses(null);
                        bChanged = true;
                    }
                }
            }
            else if(crossesRule === c_oAscCrossesRule.maxValue)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_MAX)
                {
                    this.crossAx.setCrosses(CROSSES_MAX);
                    bChanged = true;
                }
            }
            else if(crossesRule === c_oAscCrossesRule.minValue)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_MIN)
                {
                    this.crossAx.setCrosses(CROSSES_MIN);
                    bChanged = true;
                }
            }
        }

        if(AscFormat.isRealNumber(labelsPosition) && isRealObject(this.crossAx) && this.crossAx.setCrossBetween)
        {
            var new_lbl_position = labelsPosition === c_oAscLabelsPosition.byDivisions ? CROSS_BETWEEN_MID_CAT : CROSS_BETWEEN_BETWEEN;
            if(this.crossAx.crossBetween !== new_lbl_position)
            {
                this.crossAx.setCrossBetween(new_lbl_position);
                bChanged = true;
            }
        }
        if(bChanged)
        {
            if(this.bDelete === true)
            {
                this.setDelete(false);
            }
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_CatAx;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    setAuto: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_CatAxSetAuto, this.auto, pr));
        this.auto = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setAxId: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetAxId, this.axId, pr));
        this.axId = pr;
    },
    setAxPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetAxPos, this.axPos, pr));
        this.axPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossAx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetCrossAx, this.crossAx, pr));
        this.crossAx = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrosses: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetCrosses, this.crosses, pr));
        this.crosses = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossesAt: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_CatAxSetCrossesAt, this.crossesAt, pr));
        this.crossesAt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_CatAxSetDelete, this.bDelete, pr));
        this.bDelete = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setLblAlgn: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetLblAlgn, this.lblAlgn, pr));
        this.lblAlgn = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setLblOffset: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetLblOffset, this.lblOffset, pr));
        this.lblOffset = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMajorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMajorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetMajorTickMark, this.majorTickMark, pr));
        this.majorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMinorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetMinorGridlines, this.minorGridlines, pr));
        this.minorGridlines = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMinorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetMinorTickMark, this.minorTickMark, pr));
        this.minorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setNoMultiLvlLbl: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_CatAxSetNoMultiLvlLbl, this.noMultiLvlLbl, pr));
        this.noMultiLvlLbl = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setScaling: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetScaling, this.scaling, pr));
        this.scaling = pr;
        if(this.scaling)
        {
            this.scaling.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetSpPr, this.spPr, pr));
        this.spPr = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetTickLblPos, this.tickLblPos, pr));
        this.tickLblPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblSkip: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetTickLblSkip, this.tickLblSkip, pr));
        this.tickLblSkip = pr;
    },
    setTickMarkSkip: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CatAxSetTickMarkSkip, this.tickMarkSkip, pr));
        this.tickMarkSkip = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTitle: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetTitle, this.title, pr));
        this.title = pr;
        if(pr)
        {
            pr.setParent(this);
        }

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    getParentObjects: function()
    {
        return this.parent && this.parent.getParentObjects();
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CatAxSetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    handleUpdateFill: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    handleUpdateLn: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
            }
};

function CDateAx()
{
    this.auto           = null;
    this.axId           = null;
    this.axPos          = null;
    this.baseTimeUnit   = null;
    this.crossAx        = null;
    this.crosses        = null;
    this.crossesAt      = null;
    this.bDelete        = null;
    this.extLst         = null;
    this.lblOffset      = null;
    this.majorGridlines = null;
    this.majorTickMark  = null;
    this.majorTimeUnit  = null;
    this.majorUnit      = null;
    this.minorGridlines = null;
    this.minorTickMark  = null;
    this.minorTimeUnit  = null;

    this.minorUnit      = null;
    this.numFmt         = null;
    this.scaling        = null;
    this.spPr           = null;
    this.tickLblPos     = null;
    this.title          = null;
    this.txPr           = null;

    this.parent = null;
    this.posX = null;
    this.posY = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDateAx.prototype =
{
    Get_Id: function()
    {
        return  this.Id;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_DateAx;
    },

    Refresh_RecalcData2: function(pageIndex, object)
    {
        this.parent && this.parent.parent && this.parent.parent.Refresh_RecalcData2(pageIndex, object);
    },

    getDrawingDocument: function()
    {
        return this.parent && this.parent.parent && this.parent.parent.getDrawingDocument && this.parent.parent.getDrawingDocument();
    },
    Refresh_RecalcData: function(pageIndex, object)
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
            this.parent.parent.parent.addToRecalculate();
        }
    },

    getMenuProps: CCatAx.prototype.getMenuProps,
    setMenuProps: CCatAx.prototype.setMenuProps,

    createDuplicate: function()
    {
        var c = new CDateAx();
        c.setAuto(this.auto);
        c.setAxPos(this.axPos);
        c.setBaseTimeUnit(this.baseTimeUnit);
        c.setCrosses(this.crosses);
        c.setCrossesAt(this.crossesAt);
        c.setDelete(this.bDelete);
        c.setLblOffset(this.lblOffset);
        if(this.majorGridlines)
        {
            c.setMajorGridlines(this.majorGridlines.createDuplicate());
        }
        c.setMajorTickMark(this.majorTickMark);
        c.setMajorTimeUnit(this.majorTimeUnit);
        if(this.minorGridlines)
        {
            c.setMinorGridlines(this.minorGridlines.createDuplicate());
        }
        c.setMinorTickMark(this.minorTickMark);
        c.setMinorTimeUnit(this.minorTimeUnit);
        if(this.numFmt)
        {
            c.setNumFmt(this.numFmt.createDuplicate());
        }
        if(this.scaling)
        {
            c.setScaling(this.scaling.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        c.setTickLblPos(this.tickLblPos);
        if(this.title)
        {
            c.setTitle(this.title.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    setAuto: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DateAxAuto, this.auto, pr));
        this.auto = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setAxId: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DateAxAxId, this.axId, pr));
        this.axId = pr;

    },
    setAxPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxAxPos, this.axPos, pr));
        this.axPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setBaseTimeUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxBaseTimeUnit, this.baseTimeUnit, pr));
        this.baseTimeUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setCrossAx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxCrossAx, this.crossAx, pr));
        this.crossAx = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setCrosses: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxCrosses, this.crosses, pr));
        this.crosses = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setCrossesAt: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxCrossesAt, this.crossesAt, pr));
        this.crossesAt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DateAxDelete, this.bDelete, pr));
        this.bDelete = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setLblOffset: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxLblOffset, this.lblOffset, pr));
        this.lblOffset = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setMajorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }

    },
    setMajorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxMajorTickMark, this.majorTickMark, pr));
        this.majorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setMajorTimeUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxMajorTimeUnit, this.majorTimeUnit, pr));
        this.majorTimeUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setMajorUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxMajorUnit, this.majorUnit, pr));
        this.majorUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setMinorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }

    },
    setMinorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxMinorTickMark, this.minorTickMark, pr));
        this.minorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }

    },
    setMinorTimeUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxMinorTimeUnit, this.minorTimeUnit, pr));
        this.minorTimeUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    ///
    setMinorUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DateAxMinorUnit, this.minorUnit, pr));
        this.minorUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxNumFmt, this.numFmt, pr));
        this.numFmt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setScaling: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxScaling, this.scaling, pr));
        this.scaling = pr;
        if(this.scaling)
        {
            this.scaling.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxSpPr, this.spPr, pr));
        this.spPr = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DateAxTickLblPos, this.tickLblPos, pr));
        this.tickLblPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTitle: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxTitle, this.title, pr));
        this.title = pr;
        if(pr)
        {
            pr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    getParentObjects: function()
    {
        return this.parent && this.parent.getParentObjects();
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DateAxTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    //

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },


    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CSerAx()
{
    this.axId           = null;
    this.axPos          = null;
    this.crossAx        = null;
    this.crosses        = null;
    this.crossesAt      = null;
    this.bDelete        = null;
    this.extLst         = null;
    this.majorGridlines = null;
    this.majorTickMark  = null;
    this.minorGridlines = null;
    this.minorTickMark  = null;
    this.numFmt         = null;
    this.scaling        = null;
    this.spPr           = null;
    this.tickLblPos     = null;
    this.tickLblSkip    = null;
    this.tickMarkSkip   = null;
    this.title          = null;
    this.txPr           = null;

    this.parent = null;
    this.posX = null;
    this.posY = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSerAx.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_SerAx;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData2: function(pageIndex, object)
    {
        this.parent && this.parent.parent && this.parent.parent.Refresh_RecalcData2(pageIndex, object);
    },


    getMenuProps: CCatAx.prototype.getMenuProps,
    setMenuProps: CCatAx.prototype.setMenuProps,


    getDrawingDocument: function()
    {
        return this.parent && this.parent.parent && this.parent.parent.getDrawingDocument && this.parent.parent.getDrawingDocument();
    },
    Refresh_RecalcData: function(pageIndex, object)
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
            this.parent.parent.parent.addToRecalculate();
        }
    },

    createDuplicate: function()
    {
        var c = new CSerAx();
        c.setAxPos(this.axPos);
        c.setCrosses(this.crosses);
        c.setCrossesAt(this.crossesAt);
        c.setDelete(this.bDelete);
        if(this.majorGridlines)
        {
            c.setMajorGridlines(this.majorGridlines.createDuplicate());
        }
        c.setMajorTickMark(this.majorTickMark);
        if(this.minorGridlines)
        {
            c.setMajorGridlines(this.minorGridlines.createDuplicate());
        }
        c.setMajorTickMark(this.minorTickMark);
        if(this.numFmt)
        {
            c.setNumFmt(this.numFmt.createDuplicate());
        }
        if(this.scaling)
        {
            c.setScaling(this.scaling.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        c.setTickLblPos(this.tickLblPos);
        c.setTickLblSkip(this.tickLblSkip);
        c.setTickMarkSkip(this.tickMarkSkip);
        if(this.title)
        {
            c.setTitle(this.title.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    setAxId: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetAxId, this.axId, pr));
        this.axId = pr;
    },
    setAxPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetAxPos, this.axPos, pr));
        this.axPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossAx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetCrossAx, this.crossAx, pr));
        this.crossAx = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrosses: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_SerAxSetCrosses, this.crosses, pr));
        this.crosses = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossesAt: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_SerAxSetCrossesAt, this.crossesAt, pr));
        this.crossesAt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_SerAxSetDelete, this.bDelete, pr));
        this.bDelete = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMajorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMajorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetMajorTickMark, this.majorTickMark, pr));
        this.majorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMinorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetMinorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMinorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetMinorTickMark, this.minorTickMark, pr));
        this.minorTickMark = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setScaling: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetScaling, this.scaling, pr));
        this.scaling = pr;
        if(this.scaling)
        {
            this.scaling.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetSpPr, this.spPr, pr));
        this.spPr = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetTickLblPos, this.tickLblPos, pr));
        this.tickLblPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblSkip: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetTickLblSkip, this.tickLblSkip, pr));
        this.tickLblSkip = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickMarkSkip: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SerAxSetTickMarkSkip, this.tickMarkSkip, pr));
        this.tickMarkSkip = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTitle: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetTitle, this.title, pr));
        this.title = pr;
        if(pr)
        {
            pr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    getParentObjects: function()
    {
        return this.parent && this.parent.getParentObjects();
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SerAxSetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
            }
};



function CValAx()
{
    this.axId           = null;
    this.axPos          = null;
    this.crossAx        = null;
    this.crossBetween   = null;
    this.crosses        = null;
    this.crossesAt      = null;
    this.bDelete        = null;
    this.dispUnits      = null;
    this.extLst         = null;
    this.majorGridlines = null;
    this.majorTickMark  = null;
    this.majorUnit      = null;
    this.minorGridlines = null;
    this.minorTickMark  = null;
    this.minorUnit      = null;
    this.numFmt         = null;
    this.scaling        = null;
    this.spPr           = null;
    this.tickLblPos     = null;
    this.title          = null;
    this.txPr           = null;

    this.parent = null;
    this.posX = null;
    this.posY = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CValAx.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
            this.parent.parent.parent.addToRecalculate();
        }
    },


    Refresh_RecalcData2: function(pageIndex, object)
    {
        this.parent && this.parent.parent && this.parent.parent.Refresh_RecalcData2(pageIndex, object);
    },
    getDrawingDocument: function()
    {
        return this.parent && this.parent.parent && this.parent.parent.getDrawingDocument && this.parent.parent.getDrawingDocument();
    },

    createDuplicate: function()
    {
        var c = new CValAx();
        c.setAxPos(this.axPos);
        c.setCrossBetween(this.crossBetween);
        c.setCrossesAt(this.crossesAt);
        c.setDelete(this.bDelete);
        if(this.dispUnits)
        {
            c.setDispUnits(this.dispUnits.createDuplicate());
        }
        if(this.majorGridlines)
        {
            c.setMajorGridlines(this.majorGridlines.createDuplicate());
        }
        c.setMajorTickMark(this.majorTickMark);
        c.setMajorUnit(this.majorUnit);

        if(this.minorGridlines)
        {
            c.setMinorGridlines(this.minorGridlines.createDuplicate());
        }
        c.setMinorTickMark(this.minorTickMark);
        c.setMinorUnit(this.minorUnit);

        this.numFmt && c.setNumFmt(this.numFmt.createDuplicate());
        this.scaling && c.setScaling(this.scaling.createDuplicate());
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        c.setTickLblPos(this.tickLblPos);
        if(this.title)
        {
            c.setTitle(this.title.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ValAx;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    setAxId: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetAxId, this.axId, pr));
        this.axId = pr;
    },
    setAxPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetAxPos, this.axPos, pr));
        this.axPos = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossAx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetCrossAx, this.crossAx, pr));
        this.crossAx = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossBetween: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetCrossBetween, this.crossBetween, pr));
        this.crossBetween = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrosses: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_ValAxSetCrosses, this.crosses, pr));
        this.crosses = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCrossesAt: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_ValAxSetCrossesAt, this.crossesAt, pr));
        this.crossesAt = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ValAxSetDelete, this.bDelete, pr));
        this.bDelete = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDispUnits: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetDispUnits, this.dispUnits, pr));
        this.dispUnits = pr;
        if(this.dispUnits)
        {
            this.dispUnits.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMajorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMajorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetMajorTickMark, this.majorTickMark, pr));
        this.majorTickMark = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMajorUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_ValAxSetMajorUnit, this.majorUnit, pr));
        this.majorUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMinorGridlines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetMinorGridlines, this.minorGridlines, pr));
        this.minorGridlines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateGridlines();
        }
    },
    setMinorTickMark: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetMinorTickMark, this.minorTickMark, pr));
        this.minorTickMark = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setMinorUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_ValAxSetMinorUnit, this.minorUnit, pr));
        this.minorUnit = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetNumFmt, this.numFmt, pr));
        this.numFmt = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setScaling: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetScaling, this.scaling, pr));
        this.scaling = pr;
        if(this.scaling)
        {
            this.scaling.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetSpPr, this.spPr, pr));
        this.spPr = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTickLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ValAxSetTickLblPos, this.tickLblPos, pr));
        this.tickLblPos = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setTitle: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetTitle, this.title, pr));
        this.title = pr;
        if(pr)
        {
            pr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    getParentObjects: function()
    {
        return this.parent && this.parent.getParentObjects();
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ValAxSetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    handleUpdateFill: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    handleUpdateLn: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },


    getMenuProps: function()
    {
        var ret = new AscCommon.asc_ValAxisSettings();
        var scaling = this.scaling;

        //настройки логарифмической шкалы
        if(scaling && AscFormat.isRealNumber(scaling.logBase))
        {
            ret.putLogScale(true);
            ret.putLogBase(scaling.logBase);
        }
        else
        {
            ret.putLogScale(false);
        }

        var oMinMaxOnAxis;
        if(this.axPos === AX_POS_L || this.axPos === AX_POS_R)
        {
            oMinMaxOnAxis = getMinMaxFromArrPoints(this.yPoints);
        }
        else
        {
            oMinMaxOnAxis = getMinMaxFromArrPoints(this.xPoints);
        }
        //настроки максимального значения по оси
        if(scaling && AscFormat.isRealNumber(scaling.max))
        {
            ret.putMaxValRule(c_oAscValAxisRule.fixed);
            ret.putMaxVal(scaling.max);
        }
        else
        {
            ret.putMaxValRule(c_oAscValAxisRule.auto);
            ret.putMaxVal(oMinMaxOnAxis.max);
        }

        //настройки минимального значения по оси
        if(scaling && AscFormat.isRealNumber(scaling.min))
        {
            ret.putMinValRule(c_oAscValAxisRule.fixed);
            ret.putMinVal(scaling.min);
        }
        else
        {
            ret.putMinValRule(c_oAscValAxisRule.auto);
            ret.putMinVal(oMinMaxOnAxis.min);
        }

        //настройка ориентации оси
        ret.putInvertValOrder(scaling && scaling.orientation === ORIENTATION_MAX_MIN);

        //настройка множителя единиц на оси
        if(isRealObject(this.dispUnits))
        {
            var disp_units = this.dispUnits;
            if(AscFormat.isRealNumber(disp_units.builtInUnit))
            {
                ret.putDispUnitsRule(disp_units.builtInUnit);
                ret.putShowUnitsOnChart(isRealObject(disp_units.dispUnitsLbl));
            }
            else if(AscFormat.isRealNumber(disp_units.custUnit))
            {
                ret.putDispUnitsRule(c_oAscValAxUnits.CUSTOM);
                ret.putUnits(disp_units.custUnit);
                ret.putShowUnitsOnChart(isRealObject(disp_units.dispUnitsLbl));
            }
            else
            {
                ret.putDispUnitsRule(c_oAscValAxUnits.none);
                ret.putShowUnitsOnChart(false);
            }
        }
        else
        {
            ret.putDispUnitsRule(c_oAscValAxUnits.none);
            ret.putShowUnitsOnChart(false);
        }

        //настройки засечек на оси
        if(AscFormat.isRealNumber(this.majorTickMark))
            ret.putMajorTickMark(this.majorTickMark);
        else
            ret.putMajorTickMark( c_oAscTickMark.TICK_MARK_NONE);

        if(AscFormat.isRealNumber(this.minorTickMark))
            ret.putMinorTickMark(this.minorTickMark);
        else
            ret.putMinorTickMark(c_oAscTickMark.TICK_MARK_NONE);

        if(AscFormat.isRealNumber(this.tickLblPos))
            ret.putTickLabelsPos(this.tickLblPos);
        else
            ret.putTickLabelsPos(c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO);

        var crossAx = this.crossAx;
        if(crossAx)
        {
            //настройки пересечения с другой осью
            if(AscFormat.isRealNumber(crossAx.crossesAt))
            {
                ret.putCrossesRule(c_oAscCrossesRule.value);
                ret.putCrosses(crossAx.crossesAt);
            }
            else if(crossAx.crosses === CROSSES_MAX)
            {
                ret.putCrossesRule(c_oAscCrossesRule.maxValue);
                ret.putCrosses(oMinMaxOnAxis.max);
            }
            else if(crossAx.crosses === CROSSES_MIN)
            {
                ret.putCrossesRule(c_oAscCrossesRule.minValue);
                ret.putCrosses(oMinMaxOnAxis.min);
            }
            else
            {
                ret.putCrossesRule(c_oAscCrossesRule.auto);
                if(AscFormat.isRealNumber(oMinMaxOnAxis.min) && AscFormat.isRealNumber(oMinMaxOnAxis.max))
                {
                    if(0 >= oMinMaxOnAxis.min && 0 <= oMinMaxOnAxis.max)
                    {
                        ret.putCrosses(0);
                    }
                    else if(oMinMaxOnAxis.min > 0)
                    {
                        ret.putCrosses(oMinMaxOnAxis.min);
                    }
                    else
                    {
                        ret.putCrosses(oMinMaxOnAxis.max);
                    }
                }
            }
        }
        return ret;
    },

    setMenuProps: function(props)
    {
        var bChanged = false;
        if(!(isRealObject(props) && typeof props.getAxisType === "function" && props.getAxisType() === c_oAscAxisType.val))
            return;
        if(!this.scaling)
            this.setScaling(new CScaling());

        var scaling = this.scaling;
        if(AscFormat.isRealNumber(props.minValRule))
        {
            if(props.minValRule === c_oAscValAxisRule.auto)
            {
                if(AscFormat.isRealNumber(scaling.min))
                {
                    scaling.setMin(null);
                    bChanged = true;
                }
            }
            else
            {
                if(AscFormat.isRealNumber(props.minVal))
                {
                    if(!(props.maxValRule === c_oAscValAxisRule.fixed && props.maxVal < props.minVal) && scaling.min !== props.minVal)
                    {
                        scaling.setMin(props.minVal);
                        bChanged = true;
                    }
                }
            }
        }

        if(AscFormat.isRealNumber(props.maxValRule))
        {
            if(props.maxValRule === c_oAscValAxisRule.auto)
            {
                if(AscFormat.isRealNumber(scaling.max))
                {
                    scaling.setMax(null);
                    bChanged = true;
                }
            }
            else
            {
                if(AscFormat.isRealNumber(props.maxVal))
                {
                    if(!AscFormat.isRealNumber(scaling.min) || scaling.min < props.maxVal)
                    {
                        if(scaling.max !== props.maxVal)
                        {
                            scaling.setMax(props.maxVal);
                            bChanged = true;
                        }
                    }
                }
            }
        }

        if(AscFormat.isRealBool(props.invertValOrder))
        {
            var new_or = props.invertValOrder ? ORIENTATION_MAX_MIN : ORIENTATION_MIN_MAX;
            if(scaling.orientation !== new_or)
            {
                scaling.setOrientation(new_or);
                bChanged = true;
            }
        }


        if(AscFormat.isRealBool(props.logScale))
        {
            if(props.logScale && AscFormat.isRealNumber(props.logBase) && props.logBase >= 2 && props.logBase <=1000)
            {
                if(scaling.logBase !== props.logBase)
                {
                    scaling.setLogBase(props.logBase);
                    bChanged = true;
                }
            }
            else if(!props.logBase && scaling.logBase !== null)
            {
                scaling.setLogBase(null);
                bChanged = true;
            }
        }

        if(AscFormat.isRealNumber(props.dispUnitsRule))
        {
            if(props.dispUnitsRule === c_oAscValAxUnits.none)
            {
                if(this.dispUnits)
                {
                    this.setDispUnits(null);
                    bChanged = true;
                }
            }
            else
            {
                if(!this.dispUnits)
                {
                    this.setDispUnits(new CDispUnits());
                    bChanged = true;
                }
                if(this.dispUnits.builtInUnit !== props.dispUnitsRule)
                {
                    this.dispUnits.setBuiltInUnit(props.dispUnitsRule);
                    bChanged = true;
                }
                if(AscFormat.isRealBool(this.showUnitsOnChart))
                {
                    this.dispUnits.setDispUnitsLbl(new CDLbl());
                    bChanged = true;
                }
            }
        }

        if(AscFormat.isRealNumber(props.majorTickMark) && this.majorTickMark !== props.majorTickMark)
        {
            this.setMajorTickMark(props.majorTickMark);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(props.minorTickMark) && this.minorTickMark !== props.minorTickMark)
        {
            this.setMinorTickMark(props.minorTickMark);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(props.tickLabelsPos) && this.tickLblPos !== props.tickLabelsPos)
        {
            this.setTickLblPos(props.tickLabelsPos);
            bChanged = true;
        }

        if(AscFormat.isRealNumber(props.crossesRule) && isRealObject(this.crossAx))
        {
            if(props.crossesRule === c_oAscCrossesRule.auto)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_AUTO_ZERO)
                {
                    this.crossAx.setCrosses(CROSSES_AUTO_ZERO);
                    bChanged = true;
                }
            }
            else if(props.crossesRule === c_oAscCrossesRule.value)
            {
                if(AscFormat.isRealNumber(props.crosses))
                {
                    if(this.crossAx.crossesAt !== props.crosses)
                    {
                        this.crossAx.setCrossesAt(props.crosses);
                        bChanged = true;
                    }
                    if(this.crossAx.crosses !== null)
                    {
                        this.crossAx.setCrosses(null);
                        bChanged = true;
                    }
                }
            }
            else if(props.crossesRule === c_oAscCrossesRule.maxValue)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_MAX)
                {
                    this.crossAx.setCrosses(CROSSES_MAX);
                    bChanged = true;
                }
            }
            else if(props.crossesRule === c_oAscCrossesRule.minValue)
            {
                if(this.crossAx.crossesAt !== null)
                {
                    this.crossAx.setCrossesAt(null);
                    bChanged = true;
                }
                if(this.crossAx.crosses !== CROSSES_MIN)
                {
                    this.crossAx.setCrosses(CROSSES_MIN);
                    bChanged = true;
                }
            }
        }

        if(bChanged)
        {
            if(this.bDelete === true)
            {
                this.setDelete(false);
            }
        }
    }
};


function CBandFmt()
{
    this.idx = null;
    this.spPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBandFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CBandFmt();
        c.setIdx(this.idx);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_BandFmt;
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BandFmt_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BandFmt_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
            }
};

function CBarSeries()
{
    this.cat               = null;
    this.dLbls            = null;
    this.dPt               = [];
    this.errBars           = null;
    this.idx              = null;
    this.invertIfNegative  = null;
    this.order             = null;
    this.pictureOptions    = null;
    this.shape            = null;
    this.spPr             = null;
    this.trendline        = null;
    this.tx              = null;
    this.val             = null;

    this.parent = null;


    this.m_oDPtContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBarSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_BarSeries_SetDPt:
            case AscDFH.historyitem_CommonSeries_RemoveDPt:{
                return this.m_oDPtContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function()
    {},

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            var arrPt = this.dPt.splice(idx, 1);
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, arrPt, false));
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_BarSeries;
    },

    createDuplicate: function()
    {
        var c = new CBarSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        if(this.errBars)
        {
            c.setErrBars(this.errBars.createDuplicate());
        }
        c.setIdx(this.idx);
        c.setInvertIfNegative(this.invertIfNegative);
        c.setOrder(this.order);
        if(this.pictureOptions)
        {
            c.setPictureOptions(this.pictureOptions.createDuplicate());
        }
        c.setShape(this.shape);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.trendline)
        {
            c.setTrendline(this.trendline.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    setFromOtherSeries: function(o)
    {
        if(o.cat)
            this.setCat(o.cat);
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(o.dPt)
        {
            for(var i = 0;  i< o.dPt.length; ++i)
            {
                this.addDPt(o.dPt[i]);
            }
        }
        if(o.errBars)
            this.setErrBars(o.errBars);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(AscFormat.isRealBool(o.invertIfNegative))
            this.setInvertIfNegative(o.invertIfNegative);
        if(AscFormat.isRealNumber(o.order))
            this.setOrder(o.order);
        if(o.pictureOptions)
            this.setPictureOptions(o.pictureOptions);
        if(o.shape)
            this.setShape(o.shape);
        if(o.spPr){
            this.setSpPr(o.spPr);
            if((o instanceof AscFormat.CLineSeries) || (o instanceof AscFormat.CScatterSeries)){
                if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill.type ===  window['Asc'].c_oAscFill.FILL_TYPE_NOFILL){
                    this.spPr.setFill(null);
                }
            }
        }

        if(o.trendline)
            this.setTrendline(o.trendline);
        if(o.tx)
            this.setTx(o.tx);
        if(o.val)
            this.setVal(o.val);
        if(o.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(o.xVal);
        }
        if(o.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(o.yVal);
        }
    },

    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_BarSeries_SetDPt, this.dPt.length,  [pr], true));
        this.dPt.push(pr);
    },
    setErrBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetErrBars, this.errBars, pr));
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setInvertIfNegative: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BarSeries_SetInvertIfNegative, this.invertIfNegative, pr));
        this.invertIfNegative = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BarSeries_SetOrder, this.order, pr));
        this.order = pr;
    },
    setPictureOptions: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetPictureOptions, this.pictureOptions, pr));
        this.pictureOptions = pr;
    },
    setShape: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetShape, this.shape, pr));
        this.shape = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetTrendline, this.trendline, pr));
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BarSeries_SetVal, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CBubbleChart()
{
    this.axId          = [];
    this.bubble3D      = null;
    this.bubbleScale   = null;
    this.dLbls         = null;
    this.series = [];
    this.showNegBubbles = null;
    this.sizeRepresents = null;
    this.varyColors     = null;

    this.parent = null;


    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBubbleChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},
    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },
    getSeriesConstructor: function()
    {
        return new CBubbleSeries();
    },
    getObjectType: function()
    {
        return AscDFH.historyitem_type_BubbleChart;
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.r;
    },


    createDuplicate: function()
    {
        var c = new CBubbleChart();
        c.setBubble3D(this.bubble3D);
        c.setBubbleScale(this.bubbleScale);
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setShowNegBubbles(this.showNegBubbles);
        c.setSizeRepresents(this.sizeRepresents);
        c.setVaryColors(this.varyColors);
        return c;
    },

    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,


    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_BubbleChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_BubbleChart_AddSerie:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_BubbleChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },
    setBubble3D: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BubbleChart_SetBubble3D, this.bubble3D, pr));
        this.bubble3D = pr;
    },
    setBubbleScale: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BubbleChart_SetBubbleScale, this.bubbleScale, pr));
        this.bubbleScale = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_BubbleChart_AddSerie, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setShowNegBubbles: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BubbleChart_SetShowNegBubbles, this.showNegBubbles, pr));
        this.showNegBubbles = pr;
    },
    setSizeRepresents: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BubbleChart_SetSizeRepresents, this.sizeRepresents, pr));
        this.sizeRepresents = pr;
    },

    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BubbleChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },


    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CBubbleSeries()
{
    this.bubble3D         = null;
    this.bubbleSize       = null;
    this.dLbls            = null;
    this.dPt              = [];
    this.errBars          = null;
    this.idx              = null;
    this.invertIfNegative = null;
    this.order            = null;
    this.spPr             = null;
    this.trendline        = null;
    this.tx               = null;
    this.xVal             = null;
    this.yVal             = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CBubbleSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_BubbleSeries;
    },

    cd: function()
    {},

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
        }
    },

    createDuplicate: function()
    {
        var c = new CBubbleSeries();
        c.setBubble3D(this.bubble3D);
        c.setBubbleSize(this.bubbleSize);
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        if(this.errBars)
        {
            c.setErrBars(this.errBars.createDuplicate());
        }
        c.setIdx(this.idx);
        c.setInvertIfNegative(this.invertIfNegative);
        c.setOrder(this.order);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.trendline)
        {
            c.setTrendline(this.trendline.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.xVal)
        {
            c.setXVal(this.xVal.createDuplicate());
        }
        if(this.yVal)
        {
            c.setYVal(this.yVal.createDuplicate());
        }
        return c;
    },


    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,
    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,


    setFromOtherSeries: function(o)
    {

    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    setBubble3D: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BubbleSeries_SetBubble3D, this.bubble3D, pr));
        this.bubble3D = pr;
    },
    setBubbleSize: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetBubbleSize, this.bubbleSize, pr));
        this.bubbleSize = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetDPt, this.dPt.length, [pr], true));
        this.dPt.push(pr);
    },
    setErrBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetErrBars, this.errBars, pr));
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BubbleSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setInvertIfNegative: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_BubbleSeries_SetInvertIfNegative, this.invertIfNegative, pr));
        this.invertIfNegative = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_BubbleSeries_SetOrder, this.order, pr));
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetTrendline, this.trendline, pr));
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setXVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetXVal, this.xVal, pr));
        this.xVal = pr;
    },
    setYVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_BubbleSeries_SetYVal, this.yVal, pr));
        this.yVal = pr;
        if(this.yVal && this.yVal.setParent)
        {
            this.yVal.setParent(this);
        }
    }
};



function CCat()
{
    this.multiLvlStrRef = null;
    this.numLit         = null;
    this.numRef         = null;
    this.strLit         = null;
    this.strRef         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CCat.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    createDuplicate: function()
    {
        var c = new CCat();
        if(this.multiLvlStrRef)
        {
            c.setMultiLvlStrRef(this.multiLvlStrRef.createDuplicate());
        }
        if(this.numLit)
        {
            c.setNumLit(this.numLit.createDuplicate());
        }
        if(this.numRef)
        {
            c.setNumRef(this.numRef.createDuplicate());
        }
        if(this.strLit)
        {
            c.setStrLit(this.strLit.createDuplicate());
        }
        if(this.strRef)
        {
            c.setStrRef(this.strRef.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Cat;
    },

    setFromOtherObject: function(o)
    {
        if(o.multiLvlStrRef)
            this.setMultiLvlStrRef(o.multiLvlStrRef);
        if(o.numLit)
            this.setNumLit(o.numLit);
        if(o.numRef)
            this.setNumRef(o.numRef);
        if(o.strLit)
            this.setStrLit(o.strLit);
        if(o.strRef)
            this.setStrRef(o.strRef);
    },


    setMultiLvlStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Cat_SetMultiLvlStrRef, this.multiLvlStrRef, pr));
        this.multiLvlStrRef = pr;
    },
    setNumLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Cat_SetNumLit, this.multiLvlStrRef, pr));
        this.numLit = pr;
    },
    setNumRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Cat_SetNumRef, this.multiLvlStrRef, pr));
        this.numRef = pr;
    },
    setStrLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Cat_SetStrLit, this.multiLvlStrRef, pr));
        this.strLit = pr;
    },
    setStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Cat_SetStrRef, this.multiLvlStrRef, pr));
        this.strRef = pr;
            }
};


function CChartText()
{
    this.rich = null;
    this.strRef = null;
    this.chart = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartText.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},


    createDuplicate: function()
    {
        var c = new CChartText();
        if(this.rich)
        {
            c.setRich(this.rich.createDuplicate());
            c.rich.setParent(c);
        }
        if(this.strRef)
        {
            c.setStrRef(this.strRef.createDuplicate());
        }
        return c;
    },

    getStyles: CDLbl.prototype.getStyles,

    Get_Theme: CDLbl.prototype.Get_Theme,
    Get_ColorMap: CDLbl.prototype.Get_ColorMap,

    setChart: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartFormatSetChart, this.chart, pr));
        this.chart = pr;
    },

    getDrawingDocument: function()
    {
        return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
    },


    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    merge: function(tx, noCopyTextBody)
    {
        if(tx.rich)
        {
            if(noCopyTextBody === true)
            {
                this.setRich(tx.rich);
            }
            else
            {
                this.setRich(tx.rich.createDuplicate());
            }
            this.rich.setParent(this);
        }
        if(tx.strRef)
        {
            this.strRef = tx.strRef;
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ChartText;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id())
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setRich: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartText_SetRich, this.rich, pr));
        this.rich = pr;
    },

    setStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartText_SetStrRef, this.strRef, pr));
        this.strRef = pr;
            }
};

function CDLbls()
{
    this.bDelete          = null;
    this.dLbl            = [];
    this.dLblPos         = null;
    this.leaderLines     = null;
    this.numFmt          = null;
    this.separator       = null;
    this.showBubbleSize  = null;
    this.showCatName     = null;
    this.showLeaderLines = null;
    this.showLegendKey   = null;
    this.showPercent     = null;
    this.showSerName     = null;
    this.showVal         = null;
    this.spPr            = null;
    this.txPr            = null;

    this.parent = null;

    this.m_oDLblContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDLbls.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },
    Refresh_RecalcData2: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.parent )
        {
            if(this.parent.parent.parent.parent.parent.handleUpdateDataLabels)
            {
                this.parent.parent.parent.parent.parent.handleUpdateDataLabels();
            }
        }
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_DLbls_SetDLbl:{
                return this.m_oDLblContentChanges;
            }
        }
        return null;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },


    createDuplicate: function()
    {
        var c = new CDLbls();
        c.setDelete(this.bDelete);
        for(var i = 0; i < this.dLbl.length; ++i)
        {
            c.addDLbl(this.dLbl[i].createDuplicate());
        }
        c.setDLblPos(this.dLblPos);
        if(this.leaderLines)
        {
            c.setLeaderLines(this.leaderLines.createDuplicate());
        }
        if(this.numFmt)
        {
            c.setNumFmt(this.numFmt.createDuplicate());
        }
        c.setSeparator(this.separator);
        c.setShowBubbleSize(this.showBubbleSize);
        c.setShowCatName(this.showCatName);
        c.setShowLeaderLines(this.showLeaderLines);
        c.setShowLegendKey(this.showLegendKey);
        c.setShowPercent(this.showPercent);
        c.setShowSerName(this.showSerName);
        c.setShowVal(this.showVal);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },


    documentCreateFontMap: function(allFonts)
    {
        AscFormat.checkTxBodyDefFonts(allFonts, this.txPr);
        for(var i = 0; i < this.dLbl.length; ++i)
        {
            this.dLbl[i] && AscFormat.checkTxBodyDefFonts(allFonts, this.dLbl[i].txPr);
            this.dLbl[i].tx && this.dLbl[i].tx.rich && this.dLbl[i].tx.rich.content && this.dLbl[i].tx.rich.content.Document_Get_AllFontNames(allFonts);
        }
    },
    getObjectType: function()
    {
        return AscDFH.historyitem_type_DLbls;
    },

    findDLblByIdx: function(idx)
    {
        for(var i = 0; i < this.dLbl.length; ++i)
        {
            if(this.dLbl[i].idx === idx)
                return this.dLbl[i];
        }
        return null;
    },

    getAllRasterImages: function(images)
    {
        this.spPr && this.spPr.checkBlipFillRasterImage(images);
        for(var i = 0; i < this.dLbl.length; ++i)
        {
            this.dLbl[i] && this.dLbl[i].spPr && this.dLbl[i].spPr.checkBlipFillRasterImage(images);
        }
    },

    checkSpPrRasterImages: function()
    {
        checkSpPrRasterImages(this.spPr);
        for(var i = 0; i < this.dLbl.length; ++i)
        {
            this.dLbl[i] && checkSpPrRasterImages(this.dLbl[i].spPr);
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetDelete, this.bDelete, pr));
        this.bDelete = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    addDLbl: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_DLbls_SetDLbl, this.dLbl.length, [pr], true));
        this.dLbl.push(pr);
        if(pr)
        {
            pr.parent = this;
        }
    },
    setDLblPos: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DLbls_SetDLblPos, this.dLblPos, pr));
        this.dLblPos = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setLeaderLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbls_SetLeaderLines, this.leaderLines, pr));
        this.leaderLines = pr;
    },
    setNumFmt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbls_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    },
    setSeparator: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DLbls_SetSeparator, this.separator, pr));
        this.separator = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setShowBubbleSize: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowBubbleSize, this.showBubbleSize, pr));
        this.showBubbleSize = pr;
    },
    setShowCatName: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowCatName, this.showCatName, pr));
        this.showCatName = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setShowLeaderLines: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowLeaderLines, this.showLeaderLines, pr));
        this.showLeaderLines = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setShowLegendKey: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowLegendKey, this.showLegendKey, pr));
        this.showLegendKey = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setShowPercent: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowPercent, this.showPercent, pr));
        this.showPercent = pr;
    },
    setShowSerName: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowSerName, this.showSerName, pr));
        this.showSerName = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setShowVal: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DLbls_SetShowVal, this.showVal, pr));
        this.showVal = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbls_SetSpPr, this.spPr, pr));
        this.spPr = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DLbls_SetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(pr)
        {
            pr.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateDataLabels)
        {
            this.parent.parent.parent.parent.handleUpdateDataLabels();
        }
            }
};

function CDPt()
{
    this.bubble3D         = null;
    this.explosion        = null;
    this.idx              = null;
    this.invertIfNegative = null;
    this.marker           = null;
    this.pictureOptions   = null;
    this.spPr             = null;


    this.recalcInfo =
    {
        recalcLbl: true
    };
    this.compiledLbl = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDPt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_DPt;
    },

    createDuplicate: function()
    {
        var c = new CDPt();
        c.setBubble3D(this.bubble3D);
        c.setExplosion(this.explosion);
        c.setIdx(this.idx);
        c.setInvertIfNegative(this.invertIfNegative);
        if(this.marker)
        {
            c.setMarker(this.marker.createDuplicate());
        }
        if(this.pictureOptions)
        {
            c.setPictureOptions(this.pictureOptions.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        return c;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setBubble3D: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DPt_SetBubble3D, this.bubble3D, pr));
        this.bubble3D = pr;
    },

    setExplosion: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DPt_SetExplosion, this.explosion, pr));
        this.explosion = pr;
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DPt_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setInvertIfNegative: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DPt_SetInvertIfNegative, this.invertIfNegative, pr));
        this.invertIfNegative = pr;
    },

    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DPt_SetMarker, this.marker, pr));
        this.marker = pr;
    },

    setPictureOptions: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DPt_SetPictureOptions, this.pictureOptions, pr));
        this.pictureOptions = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DPt_SetSpPr, this.spPr, pr));
        this.spPr = pr;
            }
};


function CDTable()
{
    this.showHorzBorder = null;
    this.showKeys       = null;
    this.showOutline    = null;
    this.showVertBorder = null;
    this.spPr = null;
    this.txPr = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CDTable.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_DTable;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate: function()
    {
        var c = new CDTable();
        c.setShowHorzBorder(this.showHorzBorder);
        c.setShowKeys(this.showKeys);
        c.setShowOutline(this.showOutline);
        c.setShowVertBorder(this.showVertBorder);
        if(this.spPr)
            c.setSpPr(this.spPr.createDuplicate());
        if(this.txPr)
            c.setTxPr(this.txPr.createDuplicate());
        return c;
    },

    setShowHorzBorder: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DTable_SetShowHorzBorder, this.showHorzBorder, pr));
        this.showHorzBorder = pr;
    },
    setShowKeys: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DTable_SetShowKeys, this.showHorzBorder, pr));
        this.showKeys = pr;
    },
    setShowOutline: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DTable_SetShowOutline, this.showHorzBorder, pr));
        this.showOutline = pr;
    },
    setShowVertBorder: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DTable_SetShowVertBorder, this.showHorzBorder, pr));
        this.showVertBorder = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DTable_SetSpPr, this.showHorzBorder, pr));
        this.spPr = pr;
    },
    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DTable_SetTxPr, this.showHorzBorder, pr));
        this.txPr = pr;
            }
};

var UNIT_MULTIPLIERS = [];
UNIT_MULTIPLIERS[c_oAscValAxUnits.BILLIONS]           = 1.0/1000000000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.HUNDRED_MILLIONS]   = 1.0/100000000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.HUNDREDS]           = 1.0/100.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.HUNDRED_THOUSANDS]  = 1.0/100000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.MILLIONS]           = 1.0/1000000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.TEN_MILLIONS]       = 1.0/10000000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.TEN_THOUSANDS]      = 1.0/10000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.TRILLIONS]          = 1.0/1000000000000.0;
UNIT_MULTIPLIERS[c_oAscValAxUnits.THOUSANDS]          = 1.0/1000.0;

function CDispUnits()
{
    this.builtInUnit  = null;
    this.custUnit     = null;
    this.dispUnitsLbl = null;
    this.parent       = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CDispUnits.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CDispUnits();
        c.setBuiltInUnit(this.builtInUnit);
        c.setCustUnit(this.custUnit);
        if(this.dispUnitsLbl)
        {
            c.setDispUnitsLbl(this.dispUnitsLbl.createDuplicate());
        }
        return c;
    },


    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DispUnitsSetParent, this.parent, pr));
        this.parent = pr;
    },

    getMultiplier: function()
    {
        if(AscFormat.isRealNumber(this.builtInUnit))
        {
            if(AscFormat.isRealNumber(UNIT_MULTIPLIERS[this.builtInUnit]))
                return UNIT_MULTIPLIERS[this.builtInUnit];
        }
        else if(AscFormat.isRealNumber(this.custUnit))
            return this.custUnit;
        return 1;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_DispUnits;
    },

    setBuiltInUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_DispUnitsSetBuiltInUnit, this.builtInUnit, pr));
        this.builtInUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setCustUnit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DispUnitsSetCustUnit, this.custUnit, pr));
        this.custUnit = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setDispUnitsLbl: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DispUnitsSetDispUnitsLbl, this.dispUnitsLbl, pr));
        this.dispUnitsLbl = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
            }
};

function CDoughnutChart()
{
    this.dLbls = null;
    this.firstSliceAng = null;
    this.holeSize = null;
    this.series = [];
    this.varyColors  = null;

    this.parent = null;


    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CDoughnutChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_DoughnutChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },


    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;

        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_DoughnutChart_SetDLbls :
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break;
            }
            case AscDFH.historyitem_DoughnutChart_SetFirstSliceAng :
            {
                break;
            }
            case AscDFH.historyitem_DoughnutChart_SetHoleSize :
            {
                break;
            }
            case AscDFH.historyitem_DoughnutChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_DoughnutChart_SetVaryColor :
            {
                break;
            }
        }
    },
    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), true));
        }
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.ctr;
    },

    getSeriesConstructor: function()
    {
        return new CPieSeries();
    },
    createDuplicate: function()
    {
        var c = new CDoughnutChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        c.setFirstSliceAng(this.firstSliceAng);
        c.setHoleSize(this.holeSize);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_DoughnutChart;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,

    removeDataLabels: CBarChart.prototype.removeDataLabels,

    setFromOtherChart: function(c)
    {
        if(c.dLbls)
            this.setDLbls(c.dLbls);
        if(AscFormat.isRealNumber(c.firstSliceAng))
            this.setFirstSliceAng(c.firstSliceAng);
        if(AscFormat.isRealNumber(c.holeSize))
            this.setHoleSize(c.holeSize);
        if(Array.isArray(c.series))
        {
            var i;
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CPieSeries();
                ser.setFromOtherSeries(c.series[i]);
                this.addSer(ser);
            }
        }
        if(AscFormat.isRealBool(c.varyColors))
            this.setVaryColors(c.varyColors);
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DoughnutChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setFirstSliceAng: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DoughnutChart_SetFirstSliceAng, this.firstSliceAng, pr));
        this.firstSliceAng = pr;
    },
    setHoleSize: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DoughnutChart_SetHoleSize, this.holeSize, pr));
        this.holeSize = pr;
    },

    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_DoughnutChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },

    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_DoughnutChart_SetVaryColor, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CErrBars()
{
    this.errBarType = null;
    this.errDir     = null;
    this.errValType = null;
    this.minus      = null;
    this.noEndCap   = null;
    this.plus       = null;
    this.spPr       = null;
    this.val        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CErrBars.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CErrBars();
        c.setErrBarType(this.errBarType);
        c.setErrDir(this.errDir);
        c.setErrValType(this.errValType);
        if(this.minus)
        {
            c.setMinus(this.minus.createDuplicate());
        }
        c.setNoEndCap(this.noEndCap);
        if(this.plus)
        {
            c.setPlus(this.plus.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        c.setVal(this.val);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ErrBars;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setErrBarType: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ErrBars_SetErrBarType, this.errBarType, pr));
        this.errBarType = pr;
    },
    setErrDir: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ErrBars_SetErrDir, this.errDir, pr));
        this.errDir = pr;
    },
    setErrValType: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ErrBars_SetErrValType, this.errDir, pr));
        this.errValType = pr;
    },
    setMinus: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ErrBars_SetMinus, this.minus, pr));
        this.minus = pr;
    },
    setNoEndCap: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ErrBars_SetNoEndCap, this.noEndCap, pr));
        this.noEndCap = pr;
    },
    setPlus: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ErrBars_SetPlus, this.plus, pr));
        this.plus = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ErrBars_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_ErrBars_SetVal, this.val, pr));
        this.val = pr;
            }
};

function CLayout()
{
    this.h = null;
    this.hMode = null;
    this.layoutTarget = null;
    this.w  = null;
    this.wMode = null;
    this.x = null;
    this.xMode = null;
    this.y = null;
    this.yMode = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLayout.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate: function()
    {
        var c = new CLayout();
        c.setH(this.h);
        c.setHMode(this.hMode);
        c.setLayoutTarget(this.layoutTarget);
        c.setW(this.w);
        c.setWMode(this.wMode);
        c.setX(this.x);
        c.setXMode(this.xMode);
        c.setY(this.y);
        c.setYMode(this.yMode);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Layout;
    },

    setH: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Layout_SetH, this.h, pr));
        this.h = pr;
    },

    setHMode: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Layout_SetHMode, this.hMode, pr));
        this.hMode = pr;
    },

    setLayoutTarget: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Layout_SetLayoutTarget, this.layoutTarget, pr));
        this.layoutTarget = pr;
    },

    setW: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Layout_SetW, this.w, pr));
        this.w = pr;
    },

    setWMode: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Layout_SetWMode, this.wMode, pr));
        this.wMode = pr;
    },

    setX: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Layout_SetX, this.x, pr));
        this.x = pr;
    },

    setXMode: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Layout_SetXMode, this.xMode, pr));
        this.xMode = pr;
    },

    setY: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Layout_SetY, this.y, pr));
        this.y = pr;
    },

    setYMode: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Layout_SetYMode, this.yMode, pr));
        this.yMode = pr;
            }
};

function CLegend()
{
    this.layout = null;
    this.legendEntryes = [];
    this.legendPos = null;
    this.overlay = false;
    this.spPr = null;
    this.txPr = null;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.calcEntryes = [];

    this.parent = null;

    this.transform = new CMatrix();
    this.invertTransform = new CMatrix();

    this.localTransform = new CMatrix();


    this.m_oLegendEntryesContentChanges = new AscCommon.CContentChanges()

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CLegend.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_Legend_AddLegendEntry:{
                return this.m_oLegendEntryesContentChanges;
            }
        }
        return null;
    },

    findCalcEntryByIdx: function(idx)
    {
        for(var i = 0; i < this.calcEntryes.length; ++i){
            if(this.calcEntryes[i] && this.calcEntryes[i].idx === idx){
                return this.calcEntryes[i];
            }
        }
        return null;
    },

    createDuplicate: function()
    {
        var c = new CLegend();
        if(this.layout)
        {
            c.setLayout(this.layout.createDuplicate());
        }
        for(var i = 0; i < this.legendEntryes.length; ++i)
        {
            c.addLegendEntry(this.legendEntryes[i].createDuplicate());
        }
        c.setLegendPos(this.legendPos);
        c.setOverlay(this.overlay);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    getCalcEntryByIdx: function(idx, drawingDocument)
    {
        for(var i = 0; i < this.calcEntryes.length; ++i)
        {
            if(this.calcEntryes[i] && this.calcEntryes[i].idx == idx)
            {
                return this.calcEntryes[i];
            }
        }
        return AscFormat.ExecuteNoHistory(function(){

            var calcEntry = new AscFormat.CalcLegendEntry(this, this.chart, idx);
            calcEntry.txBody = AscFormat.CreateTextBodyFromString("" + idx, drawingDocument, calcEntry);
            calcEntry.txBody.getRectWidth(2000);
            return calcEntry;
        }, this, []);
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },
    
    updateLegendPos: function() {
        if (this.overlay) {
            if (c_oAscChartLegendShowSettings.left === this.legendPos) {
                this.legendPos = c_oAscChartLegendShowSettings.leftOverlay;
            } else if (c_oAscChartLegendShowSettings.right === this.legendPos) {
                this.legendPos = c_oAscChartLegendShowSettings.rightOverlay;
            }
        }
    },


    recalculatePen:CShape.prototype.recalculatePen,
    recalculateBrush:CShape.prototype.recalculateBrush,
    getCompiledStyle: function()
    {
        return null;
    },

    getParentObjects: function()
    {
        if(this.chart)
        {
            return this.chart.getParentObjects();
        }
        else
        {
            return {};
        }
    },

    getCompiledLine: CShape.prototype.getCompiledLine,
    getCompiledFill: CShape.prototype.getCompiledFill,
    getCompiledTransparent: CShape.prototype.getCompiledTransparent,
    check_bounds: CShape.prototype.check_bounds,
    getHierarchy: function(){return this.chart ? this.chart.getHierarchy() : []},
    isEmptyPlaceholder: function()
    {
        return false;
    },
    isPlaceholder: function()
    {
        return false;
    },
    draw: function(g)
    {
        g.bDrawSmart = true;
        CShape.prototype.draw.call(this, g);
        for(var i = 0; i < this.calcEntryes.length; ++i)
        {
            this.calcEntryes[i].draw(g);
        }
        g.bDrawSmart = false;
    },

    hit: function(x, y)
    {
        var t_x = this.invertTransform.TransformPointX(x, y);
        var t_y = this.invertTransform.TransformPointY(x, y);
        return t_x >= 0 && t_y >= 0 && t_x <= this.extX && t_y <=this.extY;
    },

    setPosition: function(x, y)
    {
        this.x = x;
        this.y = y;
        this.localTransform.Reset();
        global_MatrixTransformer.TranslateAppend(this.localTransform, this.x, this.y);
        //if(this.chart)
        //    global_MatrixTransformer.MultiplyAppend(this.localTransform, this.chart.localTransform);
        this.transform = this.localTransform.CreateDublicate();
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        var entry;
        for(var i = 0; i < this.calcEntryes.length; ++i)
        {
            entry = this.calcEntryes[i];
            entry.localTransformText.Reset();
            global_MatrixTransformer.TranslateAppend(entry.localTransformText, entry.localX, entry.localY);

            global_MatrixTransformer.MultiplyAppend(entry.localTransformText, this.localTransform);
            entry.transformText = entry.localTransformText.CreateDublicate();
            entry.invertTransformText = global_MatrixTransformer.Invert(entry.transformText);
            if(entry.calcMarkerUnion.marker)
            {
                entry.calcMarkerUnion.marker.localTransform.Reset();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.marker.localTransform, entry.calcMarkerUnion.marker.localX, entry.calcMarkerUnion.marker.localY);

                global_MatrixTransformer.MultiplyAppend(entry.calcMarkerUnion.marker.localTransform, this.localTransform);
                entry.calcMarkerUnion.marker.transform = entry.calcMarkerUnion.marker.localTransform.CreateDublicate();
                entry.calcMarkerUnion.marker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.marker.transform);
            }
            if(entry.calcMarkerUnion.lineMarker)
            {
                entry.calcMarkerUnion.lineMarker.localTransform.Reset();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.lineMarker.localTransform, entry.calcMarkerUnion.lineMarker.localX, entry.calcMarkerUnion.lineMarker.localY);

                global_MatrixTransformer.MultiplyAppend(entry.calcMarkerUnion.lineMarker.localTransform, this.localTransform);
                entry.calcMarkerUnion.lineMarker.transform = entry.calcMarkerUnion.lineMarker.localTransform.CreateDublicate();
                entry.calcMarkerUnion.lineMarker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.lineMarker.transform);
            }
        }
    },


    updatePosition: function(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, x, y);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        var entry;
        for(var i = 0; i < this.calcEntryes.length; ++i)
        {
            entry = this.calcEntryes[i];
            entry.transformText = entry.localTransformText.CreateDublicate();
            global_MatrixTransformer.TranslateAppend(entry.transformText, x, y);
            entry.invertTransformText = global_MatrixTransformer.Invert(entry.transformText);

            if(entry.calcMarkerUnion.marker)
            {
                entry.calcMarkerUnion.marker.transform = entry.calcMarkerUnion.marker.localTransform.CreateDublicate();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.marker.transform, x, y);

                entry.calcMarkerUnion.marker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.marker.transform);
            }

            if(entry.calcMarkerUnion.lineMarker)
            {
                entry.calcMarkerUnion.lineMarker.transform = entry.calcMarkerUnion.lineMarker.localTransform.CreateDublicate();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.lineMarker.transform, x, y);

                entry.calcMarkerUnion.lineMarker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.lineMarker.transform);

            }
        }
    },


    checkShapeChildTransform: function(t)
    {
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, this.posX, this.posY);
        global_MatrixTransformer.MultiplyAppend(this.transform, t);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        var entry;
        for(var i = 0; i < this.calcEntryes.length; ++i)
        {
            entry = this.calcEntryes[i];
            entry.transformText = entry.localTransformText.CreateDublicate();
            global_MatrixTransformer.TranslateAppend(entry.transformText, this.posX, this.posY);


            global_MatrixTransformer.MultiplyAppend(entry.transformText, t);

            entry.invertTransformText = global_MatrixTransformer.Invert(entry.transformText);


            if(entry.calcMarkerUnion.marker)
            {
                entry.calcMarkerUnion.marker.transform = entry.calcMarkerUnion.marker.localTransform.CreateDublicate();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.marker.transform, this.posX, this.posY);

                global_MatrixTransformer.MultiplyAppend(entry.calcMarkerUnion.marker.transform, t);

                entry.calcMarkerUnion.marker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.marker.transform);
            }

            if(entry.calcMarkerUnion.lineMarker)
            {
                entry.calcMarkerUnion.lineMarker.transform = entry.calcMarkerUnion.lineMarker.localTransform.CreateDublicate();
                global_MatrixTransformer.TranslateAppend(entry.calcMarkerUnion.lineMarker.transform, this.posX, this.posY);
                global_MatrixTransformer.MultiplyAppend(entry.calcMarkerUnion.lineMarker.transform, t);

                entry.calcMarkerUnion.lineMarker.invertTransform = global_MatrixTransformer.Invert(entry.calcMarkerUnion.lineMarker.transform);
            }
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Legend;
    },

    setLayout: function(layout)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Legend_SetLayout, this.layout, layout));
        this.layout = layout;
    },
    addLegendEntry: function(legendEntry)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_Legend_AddLegendEntry, this.legendEntryes.length, [legendEntry], true));
        this.legendEntryes.push(legendEntry);
        legendEntry.parent = this;
    },

    setLegendPos: function(legendPos)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Legend_SetLegendPos, this.legendPos, legendPos));
        this.legendPos = legendPos;
        if(this.parent && this.parent.parent)
        {
            this.parent.parent.handleUpdateInternalChart();
        }
    },
    setOverlay: function(overlay)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Legend_SetOverlay, this.overlay, overlay));
        this.overlay = overlay;
        if(this.parent && this.parent.parent)
        {
            this.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(spPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Legend_SetSpPr, this.spPr, spPr));
        this.spPr = spPr;
    },
    setTxPr: function(txPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Legend_SetTxPr, this.txPr, txPr));
        this.txPr = txPr;
        if(txPr)
        {
            txPr.setParent(this);
        }
    },

    Refresh_RecalcData2: function()
    {
        if(this.parent && this.parent.parent)
        {
            this.parent.parent.handleUpdateInternalChart();
        }
    },

    findLegendEntryByIndex: function(idx)
    {
        for(var i = 0; i < this.legendEntryes.length; ++i)
        {
            if(this.legendEntryes[i].idx === idx)
                return this.legendEntryes[i];
        }
        return null;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CLegendEntry()
{
    this.bDelete = null;
    this.idx = null;
    this.txPr  = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLegendEntry.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_LegendEntry;
    },

    createDuplicate: function()
    {
        var c = new CLegendEntry();
        c.setDelete(this.bDelete);
        c.setIdx(this.idx);
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setDelete: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_LegendEntry_SetDelete, this.bDelete, pr));
        this.bDelete = pr;
        this.Refresh_RecalcData2();
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_LegendEntry_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    Refresh_RecalcData2: function()
    {
        if(this.parent && this.parent.Refresh_RecalcData2)
        {
            this.parent.Refresh_RecalcData2();
        }
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LegendEntry_SetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
            }
};
    
function CLineChart()
{
    this.axId       = [];
    this.dLbls      = null;
    this.dropLines  = null;
    this.grouping   = null;
    this.hiLowLines = null;
    this.marker     = null;
    this.series      = [];
    this.smooth     = null;
    this.upDownBars = null;
    this.varyColors = null;

    this.parent = null;




    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLineChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_LineChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_LineChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_LineChart_AddAxId:
            {
                break
            }
            case AscDFH.historyitem_LineChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break
            }
            case AscDFH.historyitem_LineChart_SetDropLines:
            {
                break
            }
            case AscDFH.historyitem_LineChart_SetGrouping:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateInternalChart();
                }
                break
            }
            case AscDFH.historyitem_LineChart_SetHiLowLines:
            {
                break
            }
            case AscDFH.historyitem_LineChart_SetMarker:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break
            }
            case AscDFH.historyitem_LineChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break
            }
            case AscDFH.historyitem_LineChart_SetSmooth:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break
            }
            case AscDFH.historyitem_LineChart_SetUpDownBars:
            {
                break
            }
            case AscDFH.historyitem_LineChart_SetVaryColors:
            {
                break
            }
        }
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    getSeriesConstructor: function()
    {
        return new CLineSeries();
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.r;
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_LineChart;
    },

    createDuplicate: function()
    {
        var c = new CLineChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        if(this.dropLines)
        {
            c.setDropLines(this.dropLines.createDuplicate());
        }
        c.setGrouping(this.grouping);
        if(this.hiLowLines)
        {
            c.setHiLowLines(this.hiLowLines.createDuplicate());
        }
        c.setMarker(this.marker);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setSmooth(this.smooth);
        if(this.upDownBars)
        {
            c.setUpDownBars(this.upDownBars.createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },


    getAllRasterImages: function(images)
    {
        CBarChart.prototype.getAllRasterImages.call(this, images);
        if(this.upDownBars)
        {
            this.upDownBars.upBars && this.upDownBars.upBars.checkBlipFillRasterImage(images);
            this.upDownBars.downBars && this.upDownBars.downBars.checkBlipFillRasterImage(images);
        }
    },

    checkSpPrRasterImages: function(images)
    {
        CBarChart.prototype.checkSpPrRasterImages.call(this, images);
        if(this.upDownBars)
        {
            checkSpPrRasterImages(this.upDownBars.upBars);
            checkSpPrRasterImages(this.upDownBars.downBars);
        }
    },

    removeDataLabels: CBarChart.prototype.removeDataLabels,

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    setFromOtherChart: function(c)
    {
        var i;
        //if(Array.isArray(c.axId))
        //{
        //    for(i = 0; i < c.axId.length; ++i)
        //    {
        //        this.addAxId(c.axId[i]);
        //    }
        //}
        if(c.dLbls)
            this.setDLbls(c.dLbls);

        if(c.dropLines)
            this.setDropLines(c.dropLines);

        if(AscFormat.isRealNumber(c.grouping))
            this.setGrouping(c.grouping);
        if(c.hiLowLines)
            this.setHiLowLines(c.hiLowLines);

        if(c.marker)
            this.setMarker(c.marker);

        if(Array.isArray(c.series))
        {
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CLineSeries();
                ser.setFromOtherSeries(c.series[i]);
                this.addSer(ser);
            }
        }
        if(AscFormat.isRealBool(c.smooth))
            this.setSmooth(c.smooth);
        if(AscFormat.isRealBool(c.varyColors))
            this.setVaryColors(c.varyColors);
    },


    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_LineChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setDropLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineChart_SetDropLines, this.dropLines, pr));
        this.dropLines = pr;
    },
    setGrouping: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_LineChart_SetGrouping, this.grouping, pr));
        this.grouping = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setHiLowLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineChart_SetHiLowLines, this.hiLowLines, pr));
        this.hiLowLines = pr;
    },
    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_LineChart_SetMarker, this.marker, pr));
        this.marker = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_LineChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setSmooth: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_LineChart_SetSmooth, this.smooth, pr));
        this.smooth = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setUpDownBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineChart_SetUpDownBars, this.upDownBars, pr));
        this.upDownBars = pr;
        if(pr && pr.setParent)
        {
            pr.setParent(this);
        }
    },
    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_LineChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CLineSeries()
{
    this.cat           = null;
    this.dLbls         = null;
    this.dPt           = [];
    this.errBars       = null;
    this.idx           = null;
    this.marker        = null;
    this.order         = null;
    this.smooth        = null;
    this.spPr          = null;
    this.trendline     = null;
    this.tx            = null;
    this.val           = null;

    this.parent = null;

    this.m_oDPtContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CLineSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_LineSeries_SetDPt:
            case AscDFH.historyitem_CommonSeries_RemoveDPt:{
                return this.m_oDPtContentChanges;
            }
        }
        return null;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },


    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
            this.dPt.splice(idx, 1);
        }
    },

    Refresh_RecalcData: function()
    {},
    createDuplicate: function()
    {
        var c = new CLineSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        if(this.errBars)
        {
            c.setErrBars(this.errBars.createDuplicate());
        }
        c.setIdx(this.idx);
        if(this.marker)
        {
            c.setMarker(this.marker.createDuplicate());
        }
        c.setOrder(this.order);
        c.setSmooth(this.smooth);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.trendline)
        {
            c.setTrendline(this.trendline.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_LineSeries;
    },

    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,

    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,

    setFromOtherSeries: function(other)
    {
        if(other.cat)
            this.setCat(other.cat);
        if(other.dLbls)
            this.setDLbls(other.dLbls);
        if(other.dPt)
            copyDPt(this, other.dPt);
        if(other.errBars)
            this.setErrBars(other.errBars);
        if(AscFormat.isRealNumber(other.idx))
            this.setIdx(other.idx);
        if(other.marker)
            this.setMarker(other.marker);
        if(AscFormat.isRealNumber(other.order))
            this.setOrder(other.order);
        if(AscFormat.isRealBool(other.smooth))
            this.setSmooth(other.smooth);
        if(other.spPr){
            this.setSpPr(other.spPr);
            if(this.spPr && this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill.type ===  window['Asc'].c_oAscFill.FILL_TYPE_NOFILL){
                this.spPr.setFill(null);
            }
        }
        if(other.trendline)
            this.setTrendline(other.trendline);
        if(other.tx)
            this.setTx(other.tx);
        if(other.val)
            this.setVal(other.val);

        if(other.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(other.xVal);
        }
        if(other.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(other.yVal);
        }
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    recalculateBrush: function()
    {

    },

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_LineSeries_SetDPt, this.dPt.length, [pr], true));
        this.dPt.push(pr);
    },
    setErrBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetErrBars, this.errBars, pr));
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_LineSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetMarker, this.marker, pr));
        this.marker = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_LineSeries_SetOrder, this.order, pr));
        this.order = pr;
    },
    setSmooth: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_LineSeries_SetSmooth, this.smooth, pr));
        this.smooth = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
        if(this.spPr && this.spPr.parent !== this)
        {
            this.spPr.setParent(this);
        }
    },
    setTrendline: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetTrendline, this.trendline, pr));
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_LineSeries_SetVal, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    },

    handleUpdateLn: function()
    {
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
            }
};


var SYMBOL_CIRCLE   = 0;
var SYMBOL_DASH     = 1;
var SYMBOL_DIAMOND  = 2;
var SYMBOL_DOT      = 3;
var SYMBOL_NONE     = 4;
var SYMBOL_PICTURE  = 5;
var SYMBOL_PLUS     = 6;
var SYMBOL_SQUARE   = 7;
var SYMBOL_STAR     = 8;
var SYMBOL_TRIANGLE = 9;
var SYMBOL_X        = 10;


var MARKER_SYMBOL_TYPE = [];
MARKER_SYMBOL_TYPE[0] = SYMBOL_DIAMOND;
MARKER_SYMBOL_TYPE[1] = SYMBOL_SQUARE;
MARKER_SYMBOL_TYPE[2] = SYMBOL_TRIANGLE;
MARKER_SYMBOL_TYPE[3] = SYMBOL_X;
MARKER_SYMBOL_TYPE[4] = SYMBOL_STAR;
MARKER_SYMBOL_TYPE[5] = SYMBOL_CIRCLE;
MARKER_SYMBOL_TYPE[6] = SYMBOL_PLUS;
MARKER_SYMBOL_TYPE[7] = SYMBOL_DOT;
MARKER_SYMBOL_TYPE[8] = SYMBOL_DASH;

function CMarker()
{
    this.size = null; //2 <= size <= 72
    this.spPr = null;
    this.symbol = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMarker.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Marker;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    merge: function(otherMarker)
    {
        if(isRealObject(otherMarker))
        {
            if(AscFormat.isRealNumber(otherMarker.size))
            {
                this.setSize(otherMarker.size);
            }
            if(AscFormat.isRealNumber(otherMarker.symbol))
            {
                this.setSymbol(otherMarker.symbol);
            }
            if(otherMarker.spPr && (otherMarker.spPr.Fill || otherMarker.spPr.ln))
            {
                if(!this.spPr)
                {
                    this.setSpPr(new AscFormat.CSpPr());
                }
                if(otherMarker.spPr.Fill)
                {
                    this.spPr.setFill(otherMarker.spPr.Fill.createDuplicate());
                }
                if(otherMarker.spPr.ln)
                {
                    if(!this.spPr.ln)
                    {
                        this.spPr.setLn(new AscFormat.CLn());
                    }
                    this.spPr.ln.merge(otherMarker.spPr.ln);
                }
            }
        }
        return this;
    },


    createDuplicate: function()
    {
        return (new CMarker()).merge(this);
    },

    setSize: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Marker_SetSize, this.size, pr));
        this.size = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Marker_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    setSymbol: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Marker_SetSymbol, this.symbol, pr));
        this.symbol = pr;
            }
};


function CMinusPlus()
{
    this.numLit = null;
    this.numRef = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMinusPlus.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CMinusPlus();
        if(this.numRef)
        {
            c.setNumRef(this.numRef.createDuplicate());
        }
        if(this.numLit)
        {
            c.setNumLit(this.numLit.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_MinusPlus;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    setNumLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_MinusPlus_SetnNumLit, this.numLit, pr));
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_MinusPlus_SetnNumRef, this.numRef, pr));
        this.numRef = pr;
            }
};


function CMultiLvlStrCache()
{
    this.lvl     = [];
    this.ptCount = null;

    this.m_LvlContentChanges = new AscCommon.CContentChanges();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMultiLvlStrCache.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_MultiLvlStrCache_SetLvl:{
                return this.m_LvlContentChanges;
            }
        }
        return null;
    },

    createDuplicate: function()
    {
        var c = new CMultiLvlStrCache();

        for(var i = 0; i < this.lvl.length; ++i)
        {
            c.setLvl(this.lvl[i].createDuplicate());
        }
        c.setPtCount(this.ptCount);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_MultiLvlStrCache;
    },

    setLvl: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_MultiLvlStrCache_SetLvl, this.lvl.length, [pr], true));
        this.lvl.push(pr);
    },

    setPtCount: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_MultiLvlStrCache_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
            }
};

function CMultiLvlStrRef()
{
    this.f                = null;
    this.multiLvlStrCache = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CMultiLvlStrRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    getObjectType:  function()
    {
        return AscDFH.historyitem_type_MultiLvlStrRef;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate: function()
    {
        var c = new CMultiLvlStrRef();
        c.setF(this.f);
        if(this.multiLvlStrCache)
        {
            c.setMultiLvlStrCache(this.multiLvlStrCache.createDuplicate());
        }
        return c;
    },

    setF: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_MultiLvlStrRef_SetF, this.f, pr));
        this.f = pr;
    },

    setMultiLvlStrCache: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_MultiLvlStrRef_SetMultiLvlStrCache, this.multiLvlStrCache, pr));
        this.multiLvlStrCache = pr;
            }
};

function CNumRef()
{
    this.f = null;
    this.numCache = null;
    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function(data)
    {
        if(data && data.Type === AscDFH.historyitem_NumRef_SetF && this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent
            && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.parent.parent.handleUpdateInternalChart();
            this.parent.parent.parent.parent.parent.parent.recalcInfo.recalculateReferences = true;
            this.parent.parent.parent.parent.parent.parent.addToRecalculate();
        }
    },

    createDuplicate: function()
    {
        var c = new CNumRef();
        c.setF(this.f);
        if(this.numCache)
        {
            c.setNumCache(this.numCache.createDuplicate());
        }
        return c;        
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_NumRef;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    setF: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumRef_SetF, this.f, pr));
        this.f = pr;

        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent
            && this.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.parent && this.parent.parent.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            if(this.parent.parent.parent.parent.parent.parent.bNoHandleRecalc === true)
            {
                return;
            }
            this.parent.parent.parent.parent.parent.parent.recalcInfo.recalculateReferences = true;
            this.parent.parent.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setNumCache: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_NumRef_SetNumCache, this.numCache, pr));
        this.numCache = pr;
                }
};


function CNumericPoint()
{
    this.formatCode = null;
    this.idx        = null;
    this.val        = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumericPoint.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    createDuplicate: function()
    {
        var c = new CNumericPoint();
        c.setFormatCode(this.formatCode);
        c.setIdx(this.idx);
        c.setVal(this.val);
        return c;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_NumericPoint;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setFormatCode: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericPoint_SetFormatCode, this.formatCode, pr));
        this.formatCode = pr;
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_NumericPoint_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setVal: function(pr)
    {
        var _pr = parseFloat(pr);
        if(isNaN(_pr))
        {
            _pr = 0;
        }
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_NumericPoint_SetVal, this.val, _pr));
        this.val = _pr;
            }
};


function CNumFmt()
{
    this.formatCode = null;
    this.sourceLinked = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CNumFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CNumFmt();
        c.setFormatCode(this.formatCode);
        c.setSourceLinked(this.sourceLinked);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_NumFmt;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setFormatCode: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumFmt_SetFormatCode, this.formatCode, pr));
        this.formatCode = pr;
    },

    setSourceLinked: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_NumFmt_SetSourceLinked, this.sourceLinked, pr));
        this.sourceLinked = pr;
            }
};


function CNumLit()
{
    this.formatCode  = null;
    this.pts          = [];
    this.ptCount     = null;

    this.m_oPtsContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CNumLit.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_CommonLit_RemoveDPt:
            case AscDFH.historyitem_NumLit_AddPt:{
                return this.m_oPtsContentChanges;
            }
        }
        return null;
    },

    removeDPt: function(idx)
    {
        if(this.pts[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonLit_RemoveDPt, idx, this.pts.splice(idx, 1), false));
            this.pts.splice(idx, 1);
        }
    },

    createDuplicate: function()
    {
        var c = new CNumLit();
        c.setFormatCode(this.formatCode);
        for(var i = 0; i < this.pts.length; ++i)
        {
            c.addPt(this.pts[i].createDuplicate());
        }
        c.setPtCount(this.ptCount);
        return c;
    },

    getPtByIndex: function(idx)
    {
        for(var i = 0; i < this.pts.length; ++i)
        {
            if(this.pts[i].idx === idx)
                return this.pts[i];
        }
        return null;
    },

    getPtCount: function()
    {
        if(AscFormat.isRealNumber(this.ptCount))
        {
            return this.ptCount;
        }
        return this.pts.length;
    },


    getObjectType: function()
    {
        return AscDFH.historyitem_type_NumLit;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setFormatCode: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumLit_SetFormatCode, this.formatCode, pr));
        this.formatCode = pr;
    },

    addPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_NumLit_AddPt, this.pts.length, [pr], true));
        this.pts.push(pr);
    },

    setPtCount: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_NumLit_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
            }
};

function COfPieChart()
{
    this.custSplit     = [];
    this.dLbls         = null;
    this.gapWidth      = null;
    this.ofPieType     = null;
    this.secondPieSize = null;
    this.series        = [];
    this.serLines      = null;
    this.splitPos      = null;
    this.splitType     = null;
    this.varyColors    = null;

    this.parent = null;



    this.m_oCustSplitContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

COfPieChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_OfPieChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
            case AscDFH.historyitem_OfPieChart_AddCustSplit:{
                return this.m_oCustSplitContentChanges;
            }
        }
        return null;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    Refresh_RecalcData: function()
    {},

    getSeriesConstructor: function()
    {
        return new CPieSeries();
    },
    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.bestFit;
    },

    createDuplicate: function()
    {
        var c = new COfPieChart(), i;
        for(i = 0; i < this.custSplit.length; ++i)
        {
            c.addCustSplit(this.custSplit[i].createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls((this.dLbls.createDuplicate()));
        }
        c.setGapWidth(this.gapWidth);
        c.setOfPieType(this.ofPieType);
        c.setSecondPieSize(this.secondPieSize);
        for(i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        if(this.serLines)
        {
            c.setSerLines(this.serLines.createDuplicate());
        }
        c.setSplitPos(this.splitPos);
        c.setSplitType(this.splitType);
        c.setVaryColors(this.varyColors);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_OfPieChart;
    },

    getAllRasterImages: function(images)
    {
        CBarChart.prototype.getAllRasterImages.call(this, images);
        if(this.serLines && this.serLines.spPr)
        {
            this.serLines.spPr.checkBlipFillRasterImage(images);
        }
    },

    checkSpPrRasterImages: function(images)
    {
        CBarChart.prototype.checkSpPrRasterImages.call(this, images);
        if(this.serLines && this.serLines.spPr)
        {
            checkSpPrRasterImages(this.serLines.spPr);
        }
    },


    removeDataLabels: CBarChart.prototype.removeDataLabels,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    addCustSplit: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_OfPieChart_AddCustSplit, this.custSplit.length, [pr], true));
        this.custSplit.push(pr);
    },
    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_OfPieChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },
    setGapWidth: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_OfPieChart_SetGapWidth, this.gapWidth, pr));
        this.gapWidth = pr;
    },
    setOfPieType: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_OfPieChart_SetOfPieType, this.ofPieType, pr));
        this.ofPieType = pr;
    },
    setSecondPieSize: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_OfPieChart_SetSecondPieSize, this.secondPieSize, pr));
        this.secondPieSize = pr;
    },
    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_OfPieChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setSerLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_OfPieChart_SetSerLines, this.serLines, pr));
        this.serLines = pr;
    },
    setSplitPos: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_OfPieChart_SetSplitPos, this.splitPos, pr));
        this.splitPos = pr;
    },
    setSplitType: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_OfPieChart_SetSplitType, this.splitType, pr));
        this.splitType = pr;
    },
    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_OfPieChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CPictureOptions()
{
    this.applyToEnd       = null;
    this.applyToFront     = null;
    this.applyToSides     = null;
    this.pictureFormat    = null;
    this.pictureStackUnit = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPictureOptions.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CPictureOptions();
        c.setApplyToEnd(this.applyToEnd);
        c.setApplyToFront(this.applyToFront);
        c.setApplyToSides(this.applyToSides);
        c.setPictureFormat(this.pictureFormat);
        c.setPictureStackUnit(this.pictureStackUnit);
        return  c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PictureOptions;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setApplyToEnd: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PictureOptions_SetApplyToEnd, this.applyToEnd, pr));
        this.applyToEnd = pr;
    },
    setApplyToFront: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PictureOptions_SetApplyToFront, this.applyToFront, pr));
        this.applyToFront = pr;
    },
    setApplyToSides: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PictureOptions_SetApplyToSides, this.applyToSides, pr));
        this.applyToSides = pr;
    },
    setPictureFormat: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PictureOptions_SetPictureFormat, this.pictureFormat, pr));
        this.pictureFormat = pr;
    },
    setPictureStackUnit: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_PictureOptions_SetPictureStackUnit, this.pictureStackUnit, pr));
        this.pictureStackUnit = pr;
            }
};


function CPieChart()
{
    this.dLbls         = null;
    this.firstSliceAng = null;
    this.series        = [];
    this.varyColors    = null;
    this.parent = null;


    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPieChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_PieChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;

        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_PieChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break;
            }
            case AscDFH.historyitem_PieChart_SetFirstSliceAng:
            {
                break;
            }
            case AscDFH.historyitem_PieChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_PieChart_SetVaryColors:
            {
                break;
            }
        }
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.bestFit;
    },

    getSeriesConstructor: function()
    {
        return new CPieSeries();
    },

    createDuplicate: function()
    {
        var c = new CPieChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        c.setFirstSliceAng(this.firstSliceAng);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PieChart;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,

    removeDataLabels: CBarChart.prototype.removeDataLabels,

    setFromOtherChart: function(c)
    {
        var i;
        if(c.dLbls)
            this.setDLbls(c.dLbls);

        if(AscFormat.isRealNumber(c.firstSliceAng))
            this.setFirstSliceAng(c.firstSliceAng);


        if(Array.isArray(c.series))
        {
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CPieSeries();
                ser.setFromOtherSeries(c.series[i]);
                this.addSer(ser);
            }
        }
        if(AscFormat.isRealBool(c.varyColors))
            this.setVaryColors(c.varyColors);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setFirstSliceAng: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PieChart_SetFirstSliceAng, this.firstSliceAng, pr));
        this.firstSliceAng = pr;
    },

    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PieChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_PieChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }


};


function CPieSeries()
{
    this.cat       = null;
    this.dLbls     = null;
    this.dPt       = [];
    this.explosion = null;
    this.idx       = null;
    this.order     = null;
    this.spPr      = null;
    this.tx        = null;
    this.val       = null;


    this.parent = null;


    this.m_oDPtContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CPieSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_PieSeries_SetDPt:
            case AscDFH.historyitem_CommonSeries_RemoveDPt:{
                return this.m_oDPtContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function()
    {},

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
            this.dPt.splice(idx, 1);
        }
    },

    createDuplicate: function()
    {
        var c = new CPieSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var  i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        c.setExplosion(this.explosion);
        c.setIdx(this.idx);
        c.setOrder(this.order);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PieSeries;
    },


    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,

    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    setFromOtherSeries: function(o)
    {
        if(o.cat)
            this.setCat(o.cat);
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(o.dPt)
        {
            for(var i = 0; i < o.dPt.length; ++i)
            {
                this.addDPt(o.dPt[i]);
            }
        }
        if(o.explosion)
            this.setExplosion(o.explosion);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(o.order)
            this.setOrder(o.order);
        if(o.spPr){
            this.setSpPr(o.spPr);
            if(!(o instanceof AscFormat.CPieSeries)){
                this.spPr.setFill(null);
            }
        }
        if(o.tx)
            this.setTx(o.tx);
        if(o.val)
            this.setVal(o.val);

        if(o.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(o.xVal);
        }
        if(o.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(o.yVal);
        }
    },

    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },

    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_PieSeries_SetDPt, this.dPt.length, [pr], true));
        this.dPt.push(pr);
    },

    setExplosion: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PieSeries_SetExplosion, this.explosion, pr));
        this.explosion = pr;
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PieSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PieSeries_SetOrder, this.order, pr));
        this.order = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },

    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PieSeries_SetVal, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CPivotFmt()
{
    this.dLbl = null;
    this.idx = null;
    this.marker = null;
    this.spPr = null;
    this.txPr = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CPivotFmt.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CPivotFmt();
        if(this.dLbl)
        {
            c.setLbl(this.dLbl.createDuplicate());
        }
        c.setIdx(this.idx);
        if(this.marker)
        {
            c.setMarker(this.marker.createDuplicate());
        }
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PivotFmt;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setLbl: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PivotFmt_SetDLbl, this.dLbl, pr));
        this.dLbl = pr;
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PivotFmt_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PivotFmt_SetMarker, this.marker, pr));
        this.marker = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PivotFmt_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PivotFmt_SetTxPr, this.txPr, pr));
        this.txPr = pr;
            }
};

function CRadarChart()
{
    this.axId        = [];
    this.dLbls       = null;
    this.radarStyle  = null;
    this.series      = [];
    this.varyColors  = null;
    this.parent = null;


    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CRadarChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_RadarChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_RadarChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    getSeriesConstructor: function()
    {
        return new CRadarSeries();
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.outEnd;
    },

    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch(data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_RadarChart_AddAxId:
            {
                break;
            }
            case AscDFH.historyitem_RadarChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break;
            }
            case AscDFH.historyitem_RadarChart_SetRadarStyle:
            {
                break;
            }
            case AscDFH.historyitem_RadarChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_RadarChart_SetVaryColors:
            {
                break;
            }
        }
    },

    createDuplicate: function()
    {
        var c = new CRadarChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        c.setRadarStyle(this.radarStyle);
        for(var  i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_RadarChart;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    removeDataLabels: CBarChart.prototype.removeDataLabels,
    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_RadarChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setRadarStyle: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarChart_SetRadarStyle, this.radarStyle, pr));
        this.radarStyle = pr;
    },

    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_RadarChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },

    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_RadarChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function copyDPt(oThis, pt)
{
    for(var i = 0; i < pt.length; ++i)
    {
        oThis.addDPt(pt[i]);
    }
}

function CRadarSeries()
{
    this.cat     = null;
    this.dLbls   = null;
    this.dPt     = [];
    this.idx     = null;
    this.marker  = null;
    this.order   = null;
    this.spPr    = null;
    this.tx      = null;
    this.val     = null;

    this.parent = null;

    this.m_oDPtContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CRadarSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_RadarSeries_SetDPt:
            case AscDFH.historyitem_CommonSeries_RemoveDPt:{
                return this.m_oDPtContentChanges;
            }
        }
        return null;
    },

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
        }
    },

    createDuplicate: function()
    {
        var c = new CRadarSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        c.setIdx(this.idx);
        if(this.marker)
        {
            c.setMarker(this.marker.createDuplicate());
        }
        c.setOrder(this.order);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_RadarSeries;
    },

    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,
    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,


    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },

    setFromOtherSeries: function(o)
    {
        if(o.cat)
            this.setCat(o.cat);
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(o.dPt)
        {
            copyDPt(this, o.dPt)
        }
        if(o.marker)
            this.setMarker(o.marker);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(o.order)
            this.setOrder(o.order);
        if(o.spPr)
            this.setSpPr(o.spPr);
        if(o.tx)
            this.setTx(o.tx);
        if(o.val)
            this.setVal(o.val);
        if(o.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(o.xVal);
        }
        if(o.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(o.yVal);
        }
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_RadarSeries_SetDPt, this.dPt.length, [pr], true));
        this.dPt.push(pr);
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_RadarSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.marker, pr));
        this.marker = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.order, pr));
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.spPr, pr));
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.tx, pr));
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_RadarSeries_SetCat, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


var ORIENTATION_MAX_MIN = 0;
var ORIENTATION_MIN_MAX = 1;

function CScaling()
{
    this.logBase = null;
    this.max = null;
    this.min = null;
    this.orientation = null;
    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CScaling.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CScaling();
        c.setLogBase(this.logBase);
        c.setMax(this.max);
        c.setMin(this.min);
        c.setOrientation(this.orientation);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Scaling;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Scaling_SetParent, this.parent, pr));
        this.parent = pr;
    },

    setLogBase: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Scaling_SetLogBase, this.logBase, pr));
        this.logBase = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setMax: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Scaling_SetMax, this.max, pr));
        this.max = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setMin: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Scaling_SetMin, this.min, pr));
        this.min = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
    },

    setOrientation: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Scaling_SetOrientation, this.orientation, pr));
        this.orientation = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent && this.parent.parent.parent.parent && this.parent.parent.parent.parent.handleUpdateInternalChart)
        {
            this.parent.parent.parent.parent.handleUpdateInternalChart();
        }
            }
};

function CScatterChart()
{
    this.axId        = [];
    this.dLbls       = null;
    this.scatterStyle  = null;
    this.series      = [];
    this.varyColors  = null;

    this.parent = null;


    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CScatterChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_ScatterChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_ScatterChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },


    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch(data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_ScatterChart_AddAxId:
            {
                break;
            }
            case AscDFH.historyitem_ScatterChart_SetDLbls:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateDataLabels();
                }
                break;
            }
            case AscDFH.historyitem_ScatterChart_SetScatterStyle:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_ScatterChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_ScatterChart_SetVaryColors:
            {
                break;
            }
        }
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.r;
    },

    getSeriesConstructor: function()
    {
        return new CScatterSeries();
    },

    createDuplicate: function()
    {
        var c = new CScatterChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        c.setScatterStyle(this.scatterStyle);
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setVaryColors(this.varyColors);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ScatterChart;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,


    removeDataLabels: CBarChart.prototype.removeDataLabels,

    setFromOtherChart: function(o)
    {
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(AscFormat.isRealNumber(o.scatterStyle))
            this.setScatterStyle(o.scatterStyle);
        if(Array.isArray(o.series))
        {
            for(var i = 0; i < o.series.length; ++i)
            {
                var ser = new CScatterSeries();
                ser.setFromOtherSeries(o.series[i]);
                this.addSer(ser);
            }
        }
    },

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_ScatterChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setScatterStyle: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ScatterChart_SetScatterStyle, this.scatterStyle, pr));
        this.scatterStyle = pr;
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },

    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_ScatterChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },

    setVaryColors: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ScatterChart_SetVaryColors, this.varyColors, pr));
        this.varyColors = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CScatterSeries()
{
    this.dLbls     = null;
    this.dPt       = [];
    this.errBars   = null;
    this.idx       = null;
    this.marker    = null;
    this.order     = null;
    this.smooth    = null;
    this.spPr      = null;
    this.trendline = null;
    this.tx        = null;
    this.xVal      = null;
    this.yVal      = null;
    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CScatterSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
        }
    },

    createDuplicate: function()
    {
        var c = new CScatterSeries();
        this.dLbls && c.setDLbls(this.dLbls.createDuplicate());
        for(var i = 0; i < this.dPt.length; ++i)
        {
            c.addDPt(this.dPt[i].createDuplicate());
        }
        if(this.errBars)
        {
            c.setErrBars(this.errBars.createDuplicate());
        }
        c.setIdx(this.idx);
        if(this.marker)
        {
            c.setMarker(this.marker.createDuplicate());
        }
        c.setOrder(this.order);
        c.setSmooth(this.smooth);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.trendline)
        {
            c.setTrendline(this.trendline.createDuplicate())
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.xVal)
        {
            c.setXVal(this.xVal.createDuplicate());
        }
        if(this.yVal)
        {
            c.setYVal(this.yVal.createDuplicate());
        }
        return c;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ScatterSer;
    },

    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,

    setFromOtherSeries: function(o)
    {
        if(o.dLbls)
            this.setDLbls(o.dLbls);
        if(o.dPt)
            copyDPt(this, o.dPt);
        if(o.errBars)
            this.setErrBars(o.errBars);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(o.marker)
            this.setMarker(o.marker);
        if(AscFormat.isRealNumber(o.order))
            this.setOrder(o.order);

        if(AscFormat.isRealBool(o.smooth))
            this.setSmooth(o.smooth);

        if(o.spPr)
            this.setSpPr(o.spPr);
        if(o.trendline)
            this.setTrendline(o.trendline);
        if(o.tx)
            this.setTx(o.tx);
        if(o.xVal)
            this.setXVal(o.xVal);
        if(o.yVal)
            this.setYVal(o.yVal);
        if(o.cat)
        {
            this.setXVal(new CXVal());
            this.xVal.setFromOtherObject(o.cat);
        }
        if(o.val)
        {
            this.setYVal(new CYVal());
            this.yVal.setFromOtherObject(o.val);
        }
    },

    getSeriesName: CAreaSeries.prototype.getSeriesName,

    getCatName: CAreaSeries.prototype.getCatName,

    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
    },
    addDPt: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetDPt, this.dPt, pr));
        this.dPt.push(pr);
    },
    setErrBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetErrBars, this.errBars, pr));
        this.errBars = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ScatterSer_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setMarker: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetMarker, this.marker, pr));
        this.marker = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ScatterSer_SetOrder, this.order, pr));
        this.order = pr;
    },
    setSmooth: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ScatterSer_SetSmooth, this.smooth, pr));
        this.smooth = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTrendline: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetTrendline, this.trendline, pr));
        this.trendline = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setXVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetXVal, this.xVal, pr));
        this.xVal = pr;
    },
    setYVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ScatterSer_SetYVal, this.yVal, pr));
        this.yVal = pr;
        if(this.yVal && this.yVal.setParent)
        {
            this.yVal.setParent(this);
        }
            }
};

function CTx()
{
    this.strRef = null;
    this.val    = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTx.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CTx();
        if(this.strRef)
        {
            c.setStrRef(this.strRef.createDuplicate());
        }
        c.setVal(this.val);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Tx;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Tx_SetStrRef, this.strRef, pr));
        this.strRef = pr;
    },

    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Tx_SetVal, this.strRef, pr));
        this.val = pr;
            }
};


function CStockChart()
{
    this.axId       = [];
    this.dLbls      = null;
    this.dropLines  = null;
    this.hiLowLines = null;
    this.series      = [];
    this.upDownBars = null;
    this.parent = null;

    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStockChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_StockChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_StockChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
        }
        return null;
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.r;
    },

    setFromOtherChart: function(c)
    {
        var i;
        //if(Array.isArray(c.axId))
        //{
        //    for(i = 0; i < c.axId.length; ++i)
        //    {
        //        this.addAxId(c.axId[i]);
        //    }
        //}
        if(c.dLbls)
            this.setDLbls(c.dLbls);

        if(c.dropLines)
            this.setDropLines(c.dropLines);

        if(c.hiLowLines)
            this.setHiLowLines(c.hiLowLines);


        if(Array.isArray(c.series))
        {
            for(i = 0; i < c.series.length; ++i)
            {
                var ser = new CLineSeries();
                ser.setFromOtherSeries(c.series[i]);
                ser.setMarker(new CMarker());
                ser.setSpPr(new AscFormat.CSpPr());
                ser.spPr.setLn(new AscFormat.CLn());
                ser.spPr.ln.setW(28575);
                ser.spPr.ln.setFill(AscFormat.CreateNoFillUniFill());
                ser.marker.setSymbol(SYMBOL_NONE);
                ser.setSmooth(false);
                this.addSer(ser);
            }
        }
        if(c.upDownBars)
        {
            this.setUpDownBars(c.upDownBars);
        }
    },

    Refresh_RecalcData: function()
    {},
    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    getSeriesConstructor: function()
    {
        return new CLineSeries();
    },
    createDuplicate: function()
    {
        var c = new CStockChart();
        if(this.dLbls)
        {
            c.setDLbls(this.dLbls.createDuplicate());
        }
        if(this.dropLines)
        {
            c.setDropLines(this.dropLines.createDuplicate());
        }
        if(this.hiLowLines)
        {
            c.setHiLowLines(this.hiLowLines.createDuplicate());
        }
        for(var i = 0; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        if(this.upDownBars)
        {
            c.setUpDownBars(this.upDownBars.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_StockChart;
    },

    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    getAllRasterImages: CBarChart.prototype.getAllRasterImages,
    checkSpPrRasterImages: CBarChart.prototype.checkSpPrRasterImages,

    removeDataLabels: CBarChart.prototype.removeDataLabels,

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_StockChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    setDLbls: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_StockChart_SetDLbls, this.dLbls, pr));
        this.dLbls = pr;
        if(this.dLbls)
        {
            this.dLbls.setParent(this);
        }
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateDataLabels();
        }
    },

    setDropLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_StockChart_SetDropLines, this.dropLines, pr));
        this.dropLines = pr;
    },
    setHiLowLines: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_StockChart_SetHiLowLines, this.hiLowLines, pr));
        this.hiLowLines = pr;
    },
    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_StockChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },
    setUpDownBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_StockChart_SetUpDownBars, this.upDownBars, pr));
        this.upDownBars = pr;
        if(pr && pr.setParent)
        {
            pr.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};


function CStrCache()
{
    this.pts      = [];
    this.ptCount = null;

    this.m_oPtsContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStrCache.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_CommonLit_RemoveDPt:
            case AscDFH.historyitem_StrCache_AddPt:{
                return this.m_oPtsContentChanges;
            }
        }
        return null;
    },

    Refresh_RecalcData: function()
    {},

    removeDPt: function(idx)
    {
        if(this.pts[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonLit_RemoveDPt, idx, this.pts.splice(idx, 1), false));
        }
    },

    createDuplicate: function()
    {
        var c = new CStrCache();
        for(var i = 0; i < this.pts.length; ++i)
        {
            c.addPt(this.pts[i].createDuplicate());
        }
        c.setPtCount(this.ptCount);
        return c;
    },

    getPtByIndex: function(idx)
    {
        for(var i = 0; i < this.pts.length; ++i)
        {
            if(this.pts[i].idx === idx)
                return this.pts[i];
        }
        return null;
    },

    getPtCount: function()
    {
        if(AscFormat.isRealNumber(this.ptCount))
        {
            return this.ptCount;
        }
        return this.pts.length;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_StrCache;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    addPt: function(pr)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_StrCache_AddPt, this.pts.length, [pr], true));
        this.pts.push(pr);
    },

    setPtCount: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_StrCache_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
                    }
};



function CStringLiteral()
{
    this.pts      = [];
    this.ptCount = null;

    this.m_oPtsContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStringLiteral.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_StringLiteral_SetPt:{
                return this.m_oPtsContentChanges;
            }
        }
        return null;
    },

    createDuplicate: function()
    {
        var c = new CStringLiteral();
        for(var i = 0; i < this.pts.length; ++i)
        {
            c.addPt(this.pts[i].createDuplicate());
        }
        c.setPtCount(this.ptCount);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_StringLiteral;
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    addPt: function(pr){
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_StringLiteral_SetPt, this.pts.length, [pr], true));
        this.pts.push(pr);
    },

    setPtCount: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_StringLiteral_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
            }
};


function CStringPoint()
{
    this.idx = null;
    this.val = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStringPoint.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CStringPoint();
        c.setIdx(this.idx);
        c.setVal(this.val);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_StrPoint;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_StrPoint_SetIdx, this.idx, pr));
        this.idx = pr;
    },

    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StrPoint_SetVal, this.val, pr));
        this.val = pr;
            }
};


function CStrRef()
{
    this.f        = null;
    this.strCache = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CStrRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var c = new CStrRef();
        c.setF(this.f);
        if(this.strCache)
        {
            c.setStrCache(this.strCache.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_StrRef;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setF: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StrRef_SetF, this.f, pr));
        this.f = pr;
    },

    setStrCache: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_StrRef_SetStrCache, this.strCache, pr));
        this.strCache = pr;
            }
};


function CSurfaceChart()
{
    this.axId = [];
    this.bandFmts = [];
    this.series = [];
    this.wireframe = null;

    this.parent = null;

    this.compiledBandFormats = [];

    this.m_oAxIdContentChanges = new AscCommon.CContentChanges();
    this.m_oSeriesContentChanges =  new AscCommon.CContentChanges();
    this.m_oBandFormatsContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
}

CSurfaceChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function(data)
    {
        if(!isRealObject(data))
            return;
        switch (data.Type)
        {
            case AscDFH.historyitem_CommonChartFormat_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_CommonChart_RemoveSeries:
            {
                break;
            }
            case AscDFH.historyitem_SurfaceChart_AddAxId:
            {
                break;
            }
            case AscDFH.historyitem_SurfaceChart_AddBandFmt:
            {
                break;
            }
            case AscDFH.historyitem_SurfaceChart_AddSer:
            {
                if(this.parent && this.parent.parent && this.parent.parent.parent)
                {
                    this.parent.parent.parent.handleUpdateType();
                }
                break;
            }
            case AscDFH.historyitem_SurfaceChart_SetWireframe:
            {
                break;
            }
        }
    },


    isWireframe: function(){
        return this.wireframe !== false;
    },

    getBandFmtByIndex: function(idx){
        for(var i = 0; i < this.bandFmts.length; ++i){
            if(this.bandFmts[i].idx === idx){
                return this.bandFmts[i];
            }
        }
        return null;
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_SurfaceChart_AddAxId:{
                return this.m_oAxIdContentChanges;
            }
            case AscDFH.historyitem_SurfaceChart_AddSer:
            case AscDFH.historyitem_CommonChart_RemoveSeries:{
                return this.m_oSeriesContentChanges;
            }
            case AscDFH.historyitem_SurfaceChart_AddBandFmt:{
                return this.m_oBandFormatsContentChanges;
            }
        }
        return null;
    },

    removeSeries: function(idx)
    {
        if(this.series[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonChart_RemoveSeries, idx, this.series.splice(idx, 1), false));
        }
    },

    getSeriesConstructor: function()
    {
        return new CSurfaceSeries();
    },

    getDefaultDataLabelsPosition: function()
    {
        return c_oAscChartDataLabelsPos.ctr;
    },

    createDuplicate: function()
    {
        var c = new CSurfaceChart(), i;
        for(i = 0; i < this.bandFmts.length; ++i)
        {
            c.addBandFmt(this.bandFmts[i].createDuplicate());
        }
        for(i =0 ; i < this.series.length; ++i)
        {
            c.addSer(this.series[i].createDuplicate());
        }
        c.setWireframe(this.wireframe);
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SurfaceChart;
    },


    documentCreateFontMap: CBarChart.prototype.documentCreateFontMap,

    removeDataLabels: CBarChart.prototype.removeDataLabels,

    getAxisByTypes: CPlotArea.prototype.getAxisByTypes,


    getAllRasterImages: function(images)
    {
        CBarChart.prototype.getAllRasterImages.call(this, images);
        for(var i = 0; i < this.bandFmts.length; ++i)
        {
            this.bandFmts[i] && this.bandFmts[i].spPr && this.bandFmts[i].spPr.checkBlipFillRasterImage(images);
        }
    },

    checkSpPrRasterImages: function(images)
    {
        CBarChart.prototype.checkSpPrRasterImages.call(this, images);
        for(var i = 0; i < this.bandFmts.length; ++i)
        {
            this.bandFmts[i] && checkSpPrRasterImages(this.bandFmts[i].spPr);
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    addAxId: function(pr)
    {
        if(!pr)
            return;
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_SurfaceChart_AddAxId, this.axId.length, [pr], true));
        this.axId.push(pr);
    },

    addBandFmt: function(fmt)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_SurfaceChart_AddBandFmt, this.bandFmts.length, [fmt], true));
        this.bandFmts.push(fmt);
    },

    addSer: function(ser)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_SurfaceChart_AddSer, this.series.length, [ser], true));
        this.series.push(ser);
        ser.setParent(this);
        if(this.parent && this.parent.parent && this.parent.parent.parent)
        {
            this.parent.parent.parent.handleUpdateType();
        }
    },

    setWireframe: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_SurfaceChart_SetWireframe, this.wireframe, pr));
        this.wireframe = pr;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};



function CSurfaceSeries()
{
    this.cat   = null;
    this.idx   = null;
    this.order = null;
    this.spPr  = null;
    this.tx    = null;
    this.val   = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSurfaceSeries.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    removeDPt: function(idx)
    {
        if(this.dPt[idx])
        {
            History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_CommonSeries_RemoveDPt, idx, this.dPt.splice(idx, 1), false));
        }
    },

    createDuplicate: function()
    {
        var c = new CSurfaceSeries();
        if(this.cat)
        {
            c.setCat(this.cat.createDuplicate());
        }
        c.setIdx(this.idx);
        c.setOrder(this.order);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }

        if(this.val)
        {
            c.setVal(this.val.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SurfaceSeries;
    },

    documentCreateFontMap: CAreaSeries.prototype.documentCreateFontMap,


    getAllRasterImages: CAreaSeries.prototype.getAllRasterImages,
    checkSpPrRasterImages: CAreaSeries.prototype.checkSpPrRasterImages,


    setFromOtherSeries: function(o)
    {
        if(o.cat)
            this.setCat(o.cat);
        if(AscFormat.isRealNumber(o.idx))
            this.setIdx(o.idx);
        if(o.order)
            this.setOrder(o.order);
        if(o.spPr)
            this.setSpPr(o.spPr);
        if(o.tx)
            this.setTx(o.tx);
        if(o.val)
            this.setVal(o.val);
        if(o.xVal)
        {
            this.setCat(new CCat());
            this.cat.setFromOtherObject(o.xVal);
        }
        if(o.yVal)
        {
            this.setVal(new CYVal());
            this.val.setFromOtherObject(o.yVal);
        }
    },

    getSeriesName: CAreaSeries.prototype.getSeriesName,
    getCatName: CAreaSeries.prototype.getCatName,
    getValByIndex: CAreaSeries.prototype.getValByIndex,
    getFormatCode: CAreaSeries.prototype.getFormatCode,

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setCat: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SurfaceSeries_SetCat, this.cat, pr));
        this.cat = pr;
    },
    setIdx: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SurfaceSeries_SetIdx, this.idx, pr));
        this.idx = pr;
    },
    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SurfaceSeries_SetOrder, this.order, pr));
        this.order = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SurfaceSeries_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SurfaceSeries_SetTx, this.tx, pr));
        this.tx = pr;
    },
    setVal: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SurfaceSeries_SetVal, this.val, pr));
        this.val = pr;
        if(this.val && this.val.setParent)
        {
            this.val.setParent(this);
        }
    }
};


function CTitle()
{
    this.layout  = null;
    this.overlay = false;
    this.spPr    = null;
    this.tx      = null;
    this.txPr    = null;

    this.parent = null;//ссылка на родительский элемент
    //расчетные значения
    this.txBody = null;
    this.x = null;
    this.y = null;
    this.calcX = null;
    this.calcY = null;
    this.extX = null;
    this.extY = null;

    this.transform = new CMatrix();
    this.transformText = new CMatrix();
    this.ownTransform = new CMatrix();
    this.ownTransformText = new CMatrix();
    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();

    this.recalcInfo =
    {
        recalculateTxBody: true,
        recalcTransform: true,
        recalcTransformText: true,
        recalcContent: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalcStyle: true,
        recalculateContent: true,
        recalculateGeometry: true
    };



    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTitle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {
        this.Refresh_RecalcData2();
    },

    chekBodyPrTransform: function()
    {
        return false;
    },

    checkContentWordArt: function()
    {
        return false;
    },


    Get_AbsolutePage: function()
    {
        if(this.chart && this.chart.Get_AbsolutePage)
        {
            return this.chart.Get_AbsolutePage();
        }
        return 0;
    },

    Refresh_RecalcData2: function(pageIndex)
    {
        this.recalcInfo.recalculateTxBody = true;
        this.recalcInfo.recalcTransform = true;
        this.recalcInfo.recalcTransformText = true;
        this.recalcInfo.recalcContent = true;
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateGeometry = true;

        this.parent && this.parent.Refresh_RecalcData2 && this.parent.Refresh_RecalcData2(pageIndex, this);
    },

    checkAfterChangeTheme: function()
    {
        this.recalcInfo.recalculateTxBody = true;
        this.recalcInfo.recalcTransform = true;
        this.recalcInfo.recalcTransformText = true;
        this.recalcInfo.recalcContent = true;
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateGeometry = true;
        if(this.tx && this.tx.rich && this.tx.rich.content)
        {
            this.tx.rich.content.Recalc_AllParagraphs_CompiledPr();
        }
    },

    Get_RevisionsChangeParagraph: function(SearchEngine){
        var oContent = this.getDocContent();
        if(oContent){
            oContent.Get_RevisionsChangeParagraph(SearchEngine);
        }
    },

    Search : function(Str, Props, SearchEngine, Type)
    {
        var content = this.getDocContent();
        if(content && this.tx && this.tx.rich)
        {
            var dd = this.getDrawingDocument();
            dd.StartSearchTransform && dd.StartSearchTransform( this.transformText);
            content.Search(Str, Props, SearchEngine, Type);
            dd.EndSearchTransform && dd.EndSearchTransform();
        }
    },


    Search_GetId : function(bNext, bCurrent)
    {
        var content = this.getDocContent();
        if(content && this.tx && this.tx.rich)
        {
            return content.Search_GetId(bNext, bCurrent);
        }
        return null;
    },

    Set_CurrentElement: function(bUpdate, pageIndex)
    {

        var chart = this.chart, controller;
        if(chart && typeof editor !== "undefined" && editor && editor.WordControl && editor.WordControl.m_oLogicDocument)
        {
            var bDocument = false, bPresentation = false, drawing_objects;
            if(editor.WordControl.m_oLogicDocument instanceof CDocument)
            {
                bDocument = true;
                drawing_objects = editor.WordControl.m_oLogicDocument.DrawingObjects;
            }
            else if(editor.WordControl.m_oLogicDocument instanceof CPresentation)
            {
                bPresentation = true;
                if(chart.parent)
                {
                    drawing_objects = chart.parent.graphicObject;
                }
            }
            if(drawing_objects)
            {
                drawing_objects.resetSelection(true);
                var para_drawing;
                if(chart.group)
                {
                    var main_group = chart.group.getMainGroup();
                    drawing_objects.selectObject(main_group, pageIndex);
                    main_group.selectObject(chart, pageIndex);
                    main_group.selection.chartSelection = chart;

                    chart.selection.textSelection = this;
                    chart.selection.title = this;
                    drawing_objects.selection.groupSelection = main_group;
                    para_drawing = main_group.parent;
                }
                else
                {
                    drawing_objects.selectObject(chart, pageIndex);
                    drawing_objects.selection.chartSelection = chart;
                    chart.selection.textSelection = this;
                    chart.selection.title = this;
                    para_drawing = chart.parent;
                }
                if(bDocument && para_drawing instanceof ParaDrawing)
                {

                    var hdr_ftr = para_drawing.DocumentContent.Is_HdrFtr(true);
                    if(hdr_ftr)
                    {
                        hdr_ftr.Content.Set_DocPosType(docpostype_DrawingObjects);
                        hdr_ftr.Set_CurrentElement(bUpdate);
                    }
                    else
                    {
                        drawing_objects.document.Set_DocPosType(docpostype_DrawingObjects);
                    }
                }
            }

        }
    },

    createDuplicate: function()
    {
        var c = new CTitle();
        if(this.layout)
        {
            c.setLayout(this.layout.createDuplicate());
        }
        c.setOverlay(this.overlay);
        if(this.spPr)
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        if(this.tx)
        {
            c.setTx(this.tx.createDuplicate());
        }
        if(this.txPr)
        {
            c.setTxPr(this.txPr.createDuplicate());
        }
        return c;
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_Title;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        var content = this.getDocContent();
        if(content)
        {
            content.Paragraph_Add(paraItem, bRecalculate);
        }
    },

    applyTextFunction: function(docContentFunction, tableFunction, args)
    {
        var content = this.getDocContent();
        if(content)
        {
            docContentFunction.apply(content, args);
        }
    },

    setPosition: CDLbl.prototype.setPosition,


    hitInPath: CShape.prototype.hitInPath,

    hitInInnerArea: CShape.prototype.hitInInnerArea,

    hitInBoundingRect:  CShape.prototype.hitInBoundingRect,

    hitInTextRect: CShape.prototype.hitInTextRect,
    recalculateGeometry: CShape.prototype.recalculateGeometry,
    getTransform : CShape.prototype.getTransform ,

    checkHitToBounds: function(x, y)
    {
        var _x = x - this.transform.tx;
        var _y = y - this.transform.ty;
        return _x >= 0 && _x <= this.extX && _y >= 0 && _y < this.extY;
    },

    checkDocContent: function()
    {
        if(this.tx && this.tx.rich && this.tx.rich.content)
        {
            return;
        }
        else if(this.txBody && this.txBody.content)
        {
            var StartPage = this.txBody.content.StartPage;
            if(!this.tx)
            {
                this.setTx(new CChartText());
            }
            this.tx.setRich(this.txBody.createDuplicate2());
            this.tx.rich.setParent(this);
            if(this.txPr && this.txPr.content && this.txPr.content.Content[0] && this.txPr.content.Content[0].Pr.DefaultRunPr)
            {
                for(var i = 0; i < this.tx.rich.content.Content.length; ++i)
                {
                    AscFormat.CheckParagraphTextPr(this.tx.rich.content.Content[i], this.txPr.content.Content[0].Pr.DefaultRunPr);
                }
            }
            var selection_state = this.txBody.content.Get_SelectionState();
            this.txBody = this.tx.rich;
            this.txBody.content.Set_SelectionState(selection_state, selection_state.length - 1);
            if(AscFormat.isRealNumber(StartPage))
            {
                this.txBody.content.Set_StartPage(StartPage);
            }
            //if(editor && editor.isDocumentEditor)
            //{
            //    this.recalculateContent();
            //}
        }
    },

    getDocContent: function()
    {
        if(this.recalcInfo.recalculateTxBody){
            AscFormat.ExecuteNoHistory(this.recalculateTxBody, this, []);
            this.recalcInfo.recalculateTxBody = false;
        }
        if(this.txBody && this.txBody.content)
        {
            return this.txBody.content;
        }
    },

    selectionSetStart: CShape.prototype.selectionSetStart,

    selectionSetEnd: CShape.prototype.selectionSetEnd,

    select: function(chartSpace, pageIndex)
    {
        this.selected = true;
        this.selectStartPage = pageIndex;
        var content = this.getDocContent && this.getDocContent();
        if(content)
            content.Set_StartPage(pageIndex);
        chartSpace.selection.title = this;
    },

    getMaxWidth: function(bodyPr)
    {
        switch (bodyPr.vert)
        {
            case AscFormat.nVertTTeaVert:
            case AscFormat.nVertTTmongolianVert:
            case AscFormat.nVertTTvert:
            case AscFormat.nVertTTwordArtVert:
            case AscFormat.nVertTTwordArtVertRtl:
            case AscFormat.nVertTTvert270:
            {
                var vert_axis = this.chart.chart.plotArea.getVerticalAxis();
                if( vert_axis  && vert_axis.title === this)
                {
                    var hor_axis = this.chart.chart.plotArea.getHorizontalAxis();
                    return this.chart.extY - (hor_axis && hor_axis.title ? hor_axis.title.extY : 0 )
                }
                return this.chart.extY/2;
            }
            case AscFormat.nVertTThorz:
            {
                return this.chart.extX*0.8;
            }
        }
        return this.chart.extX*0.5;
    },

    Is_UseInDocument: function()
    {
        if(this.parent && this.parent.title === this &&
            this.chart && this.chart.Is_UseInDocument)
        {
            return this.chart.Is_UseInDocument();
        }
        return false;
    },
    getBodyPr: CDLbl.prototype.getBodyPr,

    getCompiledStyle: CDLbl.prototype.getCompiledStyle,

    getCompiledFill: CDLbl.prototype.getCompiledFill,

    getCompiledLine: CDLbl.prototype.getCompiledLine,
    getCompiledTransparent: CDLbl.prototype.getCompiledTransparent,
    Get_Styles: CDLbl.prototype.Get_Styles,
    check_bounds: CShape.prototype.check_bounds,
    selectionCheck: CShape.prototype.selectionCheck,
    getInvertTransform: CShape.prototype.getInvertTransform,
    getCanvasContext: function()
    {
        return this.chart && this.chart.getCanvasContext();
    },
    convertPixToMM: function(pix)
    {
        return this.chart && this.chart.convertPixToMM(pix);
    },
    getDrawingDocument: function()
    {
        if(this.chart && this.chart.getDrawingDocument)
            return this.chart && this.chart.getDrawingDocument();
        return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
    },
    draw: function(graphics)
    {
        CDLbl.prototype.draw.call(this, graphics);
    },

    isEmptyPlaceholder: CDLbl.prototype.isEmptyPlaceholder,

    recalculatePen: CShape.prototype.recalculatePen,

    recalculateBrush: CShape.prototype.recalculateBrush,

    updateSelectionState: CShape.prototype.updateSelectionState,

    checkShapeChildTransform: CDLbl.prototype.checkShapeChildTransform,

    updatePosition: function(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, x, y);

        this.transformText = this.localTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transformText, x, y);

        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);

    },

    getParentObjects: function()
    {
        if(this.chart)
        {
            return this.chart.getParentObjects();
        }
        else if(this.parent)
        {
            return this.parent.getParentObjects();
        }
        return null;
    },

    getDefaultTextForTxBody: function()
    {
        if(this.parent)
        {
            if(this.parent.getObjectType() === AscDFH.historyitem_type_Chart)
            {
                if(this.parent.plotArea && this.parent.plotArea.charts.length === 1 && Array.isArray(this.parent.plotArea.charts[0].series)
                    && this.parent.plotArea.charts[0].series.length === 1 && this.parent.plotArea.charts[0].series[0].tx)
                {
                    var oTx = this.parent.plotArea.charts[0].series[0].tx;
                    if(typeof oTx.val === "string" && oTx.val.length > 0)
                    {
                        return oTx.val;
                    }
                    if(oTx.strRef && oTx.strRef.strCache && oTx.strRef.strCache.pts.length === 1 && isRealObject(oTx.strRef.strCache.pts[0]) && typeof oTx.strRef.strCache.pts[0].val === "string"
                        && oTx.strRef.strCache.pts[0].val.length > 0)
                    {
                        return oTx.strRef.strCache.pts[0].val;
                    }
                }
                return AscFormat.getChartTranslateManager().asc_getTitle();
            }
            else
            {
                if(this.parent.axPos === AX_POS_B || this.parent.axPos === AX_POS_T)
                {
                    return AscFormat.getChartTranslateManager().asc_getXAxis();
                }
                else
                {
                    return AscFormat.getChartTranslateManager().asc_getYAxis();
                }
            }
        }
        return "Axis Title";
    },

    getStyles: CDLbl.prototype.getStyles,

    Get_Theme: CDLbl.prototype.Get_Theme,

    Get_ColorMap: CDLbl.prototype.Get_ColorMap,

    recalculateStyle: CDLbl.prototype.recalculateStyle,

    recalculateTxBody: CDLbl.prototype.recalculateTxBody,

    recalculateTransform: CDLbl.prototype.recalculateTransform,

    recalculateTransformText: CDLbl.prototype.recalculateTransformText,

    recalculateContent: CDLbl.prototype.recalculateContent,

    recalculate: function()
    {
        AscFormat.ExecuteNoHistory(function()
        {
            if(this.recalcInfo.recalculateBrush)
            {
                this.recalculateBrush();
                this.recalcInfo.recalculateBrush = false;
            }
            if(this.recalcInfo.recalculatePen)
            {
                this.recalculatePen();
                this.recalcInfo.recalculatePen = false;
            }
            if(this.recalcInfo.recalcStyle)
            {
                this.recalculateStyle();
                this.recalcInfo.recalcStyle = false;
            }
            if(this.recalcInfo.recalculateTxBody)
            {
                this.recalculateTxBody();
                this.recalcInfo.recalculateTxBody = false;
            }
            if(this.recalcInfo.recalculateContent)
            {
                this.recalculateContent();
                this.recalcInfo.recalculateContent = false;
            }
            if(this.recalcInfo.recalcTransform)
            {
                this.recalculateTransform();
                this.recalcInfo.recalcTransform = false;
            }
            if(this.recalcInfo.recalcTransformText)
            {
                this.recalculateTransformText();
                this.recalcInfo.recalcTransformText = false;
            }
            if(this.recalcInfo.recalculateGeometry){
                this.recalculateGeometry && this.recalculateGeometry();
                this.recalcInfo.recalculateGeometry = false;
            }
            if(this.chart)
            {
                this.chart.addToSetPosition(this);
            }
        }, this, []);
    },

    setLayout: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Title_SetLayout, this.layout, pr));
        this.layout = pr;
    },

    setOverlay: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Title_SetOverlay, this.overlay, pr));
        this.overlay = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Title_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    setTx: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Title_SetTx, this.tx, pr));
        this.tx = pr;
        if(this.tx)
        {
            this.tx.setParent(this);
        }
    },

    setTxPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Title_SetTxPr, this.txPr, pr));
        this.txPr = pr;
        if(this.txPr)
        {
            this.txPr.setParent(this);
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }
};

function CTrendLine()
{
    this.backward       = null;
    this.dispEq         = null;
    this.dispRSqr       = null;
    this.forward        = null;
    this.intercept      = null;
    this.name           = null;
    this.order          = null;
    this.period         = null;
    this.spPr           = null;
    this.trendlineLbl   = null;
    this.trendlineType  = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CTrendLine.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_TrendLine;
    },

    setBackward: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Trendline_SetBackward, this.backward, pr));
        this.backward = pr;
    },

    setDispEq: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Trendline_SetDispEq, this.dispEq, pr));
        this.dispEq = pr;
    },

    setDispRSqr: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Trendline_SetDispRSqr, this.dispRSqr, pr));
        this.dispRSqr = pr;
    },

    setForward: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Trendline_SetForward, this.forward, pr));
        this.forward = pr;
    },

    setIntercept: function(pr)
    {
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Trendline_SetIntercept, this.intercept, pr));
        this.intercept = pr;
    },

    setName: function(pr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Trendline_SetName, this.name, pr));
        this.name = pr;
    },

    setOrder: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Trendline_SetOrder, this.order, pr));
        this.order = pr;
    },

    setPeriod: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Trendline_SetPeriod, this.period, pr));
        this.period = pr;
    },

    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Trendline_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },

    setTrendlineLbl: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Trendline_SetTrendlineLbl, this.trendlineLbl, pr));
        this.trendlineLbl = pr;
    },

    setTrendlineType: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Trendline_SetTrendlineType, this.trendlineType, pr));
        this.trendlineType = pr;
    },

    createDuplicate: function()
    {
        var c = new CTrendLine();

        if(AscFormat.isRealNumber(this.backward))
        {
            c.setBackward(this.backward);
        }
        if(AscFormat.isRealBool(this.dispEq))
        {
            c.setDispEq(this.dispEq);
        }
        if(AscFormat.isRealBool(this.dispRSqr))
        {
            c.setDispRSqr(this.dispRSqr);
        }
        if(AscFormat.isRealNumber(this.forward))
        {
            c.setForward(this.forward);
        }
        if(AscFormat.isRealNumber(this.intercept))
        {
            c.setIntercept(this.intercept);
        }
        if(typeof this.name === "string")
        {
            c.setName(this.name);
        }
        if(AscFormat.isRealNumber(this.order))
        {
            c.setOrder(this.order);
        }
        if(AscFormat.isRealNumber(this.period))
        {
            c.setPeriod(this.period);
        }
        if(isRealObject(this.spPr))
        {
            c.setSpPr(this.spPr.createDuplicate());
        }
        //this.trendlineLbl   = null;

        if(AscFormat.isRealNumber(this.trendlineType))
        {
            c.setTrendlineType(this.trendlineType);
        }
        return c;
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
            }
};



function CUpDownBars()
{
    this.downBars = null;
    this.gapWidth = null;
    this.upBars   = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CUpDownBars.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_UpDownBars;
    },
    setDownBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_UpDownBars_SetDownBars, this.downBars, pr));
        this.downBars = pr;
    },

    setGapWidth: function(pr)
    {

        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_UpDownBars_SetGapWidth, this.downBars, pr));
        this.gapWidth = pr;
    },

    setUpBars: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_UpDownBars_SetUpBars, this.downBars, pr));
        this.upBars = pr;
    },

    createDuplicate: function()
    {
        var c = new CUpDownBars();
        if(AscFormat.isRealNumber(this.gapWidth))
        {
            c.setGapWidth(this.gapWidth);
        }
        if(isRealObject(this.upBars))
        {
            c.setUpBars(this.upBars.createDuplicate());
        }
        if(isRealObject(this.downBars))
        {
            c.setDownBars(this.downBars.createDuplicate());
        }
        return c;
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
            }
};


function CXVal()
{
    this.multiLvlStrRef = null;
    this.numLit         = null;
    this.numRef         = null;
    this.strLit         = null;
    this.strRef         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CXVal.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_XVal;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    createDuplicate: function()
    {
        var ret = new CXVal();
        if(this.multiLvlStrRef)
        {
            ret.setMultiLvlStrRef(this.multiLvlStrRef.createDuplicate());
        }
        if(this.numLit)
        {
            ret.setNumLit(this.numLit.createDuplicate());
        }
        if(this.numRef)
        {
            ret.setNumRef(this.numRef.createDuplicate());
        }
        if(this.strRef)
        {
            ret.setStrRef(this.strRef.createDuplicate());
        }
        if(this.strLit)
        {
            ret.setStrLit(this.strLit.createDuplicate());
        }
        return ret;
    },

    setFromOtherObject: function(o)
    {
        if(o.multiLvlStrRef)
            this.setMultiLvlStrRef(o.multiLvlStrRef);
        if(o.numLit)
            this.setNumLit(o.numLit);
        if(o.numRef)
            this.setNumRef(o.numRef);
        if(o.strLit)
            this.setStrLit(o.strLit);
        if(o.strRef)
            this.setStrRef(o.strRef);
    },

    setMultiLvlStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_XVal_SetMultiLvlStrRef, this.multiLvlStrRef, pr));
        this.multiLvlStrRef = pr;
    },

    setNumLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_XVal_SetNumLit, this.numLit, pr));
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_XVal_SetNumRef, this.numRef, pr));
        this.numRef = pr;
    },

    setStrLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_XVal_SetStrLit, this.strLit, pr));
        this.strLit = pr;
    },

    setStrRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_XVal_SetStrRef, this.strRef, pr));
        this.strRef = pr;
            }
};



function CYVal()
{
    this.numLit = null;
    this.numRef = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CYVal.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var copy = new CYVal();
        if(this.numLit)
        {
            copy.setNumLit(this.numLit.createDuplicate());
        }
        if(this.numRef)
        {
            copy.setNumRef(this.numRef.createDuplicate());
        }
        
        return copy;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_YVal;
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
    },

    setFromOtherObject: function(o)
    {
        if(o.numLit)
            this.setNumLit(o.numLit);
        if(o.numRef)
            this.setNumRef(o.numRef);
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id())
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setNumLit: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_YVal_SetNumLit, this.numLit, pr));
        this.numLit = pr;
    },

    setNumRef: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_YVal_SetNumRef, this.numRef, pr));
        this.numRef = pr;
        if(this.numRef && this.numRef.setParent)
        {
            this.numRef.setParent(this);
        }
            }
};


function CChart()
{
    this.autoTitleDeleted = null;
    this.backWall = null;
    this.dispBlanksAs = null;
    this.floor = null;
    this.legend = null;
    this.pivotFmts = [];
    this.plotArea = null;
    this.plotVisOnly = null;
    this.showDLblsOverMax = null;
    this.sideWall = null;
    this.title = null;
    this.view3D = null;

    this.parent = null;

    this.m_oPivotFmtsContentChanges = new AscCommon.CContentChanges();

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {
        this.parent && this.parent.addToRecalculate();
    },

    getContentChangesByType: function(type){
        switch(type){
            case AscDFH.historyitem_Chart_AddPivotFmt:{
                return this.m_oPivotFmtsContentChanges;
            }
        }
        return null;
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_Chart;
    },

    getParentObjects: function()
    {
        return this.parent && this.parent.getParentObjects();
    },

    handleUpdateDataLabels: function()
    {
        if(this.parent && this.parent.handleUpdateDataLabels)
        {
            this.parent.handleUpdateDataLabels();
        }
    },

    setDefaultWalls: function()
    {
        var oFloor = new CChartWall();
        oFloor.setThickness(0);
        this.setFloor(oFloor);
        var oSideWall = new CChartWall();
        oSideWall.setThickness(0);
        this.setSideWall(oSideWall);
        var oBackWall = new CChartWall();
        oBackWall.setThickness(0);
        this.setBackWall(oBackWall);
    },

    createDuplicate: function()
    {
        var c = new CChart();
        
        c.autoTitleDeleted = this.autoTitleDeleted;
        if(this.backWall)
        {
            c.setBackWall(this.backWall.createDuplicate());
        }

        c.setDispBlanksAs(this.dispBlanksAs);

        if(this.floor)
        {
            c.setFloor(this.floor.createDuplicate());
        }

        if ( this.legend )
        {
            c.setLegend(this.legend.createDuplicate());
        }
        
        var Count = this.pivotFmts.length;
        for ( var i = 0; i < Count; i++ )
        {
            c.setPivotFmts(this.pivotFmts[i].createDuplicate());
        }
        
        if ( this.plotArea )
        {
            c.setPlotArea(this.plotArea.createDuplicate());
        }
        c.setPlotVisOnly(this.plotVisOnly);
        c.setShowDLblsOverMax(this.showDLblsOverMax);
        if(this.sideWall)
        {
            c.setSideWall(this.sideWall.createDuplicate());
        }
        
        if ( this.title )
        {
            c.setTitle(this.title.createDuplicate());
        }
        
        if ( this.view3D )
        {
            c.setView3D(this.view3D.createDuplicate());
        }

        return c;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },


    Refresh_RecalcData2: function(pageIndex, object)
    {
        this.parent && this.parent.Refresh_RecalcData2 && this.parent.Refresh_RecalcData2(pageIndex, object);
    },

    getDrawingDocument: function()
    {
        return this.parent && this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
    },

    setAutoTitleDeleted: function(autoTitleDeleted)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Chart_SetAutoTitleDeleted, this.autoTitleDeleted, autoTitleDeleted));
        this.autoTitleDeleted = autoTitleDeleted;
    },
    setBackWall: function(backWall)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetBackWall, this.backWall, backWall));
        this.backWall = backWall;
    },
    setDispBlanksAs: function(dispBlanksAs)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Chart_SetDispBlanksAs, this.dispBlanksAs, dispBlanksAs));
        this.dispBlanksAs = dispBlanksAs;
    },
    setFloor: function(floor)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetFloor, this.floor, floor));
        this.floor = floor;
    },
    setLegend: function(legend)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetLegend, this.legend, legend));
        this.legend = legend;
        if(legend)
        {
            legend.setParent(this);
        }
    },
    setPivotFmts: function(pivotFmt)
    {
        History.Add(new CChangesDrawingsContent(this, AscDFH.historyitem_Chart_AddPivotFmt, this.pivotFmts.length, [pivotFmt], true));
        this.pivotFmts.push(pivotFmt);
    },
    setPlotArea: function(plotArea)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetPlotArea, this.plotArea, plotArea));
        this.plotArea = plotArea;
        if(plotArea)
        {
            plotArea.setParent(this);
        }
    },
    setPlotVisOnly: function(plotVisOnly)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Chart_SetPlotVisOnly, this.plotVisOnly, plotVisOnly));
        this.plotVisOnly = plotVisOnly;
    },

    setShowDLblsOverMax: function(showDLblsOverMax)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Chart_SetShowDLblsOverMax, this.showDLblsOverMax, showDLblsOverMax));
        this.showDLblsOverMax = showDLblsOverMax;
    },

    setSideWall: function(sideWall)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetSideWall, this.sideWall, sideWall));
        this.sideWall = sideWall;
    },

    setTitle: function(title)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetTitle, this.title, title));
        this.title = title;
        if(title)
        {
            title.setParent(this);
        }
        if(this.parent)
        {
            this.parent.handleUpdateInternalChart();
        }
    },

    setView3D: function(view3D)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Chart_SetView3D, this.view3D, view3D));
        this.view3D = view3D;
        if(this.parent)
        {
            this.parent.handleUpdateInternalChart();
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_CommonChartFormat_SetParent, this.parent, pr));
        this.parent = pr;
            }

};


function CChartWall()
{
    this.pictureOptions = null;
    this.spPr           = null;
    this.thickness      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartWall.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ChartWall;
    },


    createDuplicate: function()
    {
        var copy = new CChartWall();
        if(this.pictureOptions)
        {
            copy.setPictureOptions(this.pictureOptions.createDuplicate());
        }
        if(this.spPr)
        {
            copy.setSpPr(this.spPr.createDuplicate());
        }
        if(AscFormat.isRealNumber(this.thickness))
        {
            copy.setThickness(this.thickness);
        }
        return copy;

    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setPictureOptions: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartWall_SetPictureOptions, this.pictureOptions, pr));
        this.pictureOptions = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ChartWall_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    },
    setThickness: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_ChartWall_SetThickness, this.thickness, pr));
        this.thickness = pr;
            }
};

function CView3d()
{
    this.depthPercent = null;
    this.hPercent     = null;
    this.perspective  = null;
    this.rAngAx       = null;
    this.rotX         = null;
    this.rotY         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CView3d.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_View3d;
    },

    createDuplicate: function()
    {
        var c = new CView3d();
        AscFormat.isRealNumber(this.depthPercent) && c.setDepthPercent(this.depthPercent);
        AscFormat.isRealNumber(this.hPercent) && c.setHPercent(this.hPercent);
        AscFormat.isRealNumber(this.perspective) && c.setPerspective(this.perspective);
        AscFormat.isRealBool(this.rAngAx) && c.setRAngAx(this.rAngAx);
        AscFormat.isRealNumber(this.rotX) && c.setRotX(this.rotX);
        AscFormat.isRealNumber(this.rotY) && c.setRotY(this.rotY);
        return c;
    },


    Write_ToBinary2: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setDepthPercent: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_View3d_SetDepthPercent, this.depthPercent, pr));
        this.depthPercent = pr;
    },
    setHPercent: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_View3d_SetHPercent, this.hPercent, pr));
        this.hPercent = pr;
    },
    setPerspective: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_View3d_SetPerspective, this.perspective, pr));
        this.perspective = pr;
    },
    setRAngAx: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_View3d_SetRAngAx, this.rAngAx, pr));
        this.rAngAx = pr;
    },

    getRAngAx: function(){
        return this.rAngAx !== false;
    },

    setRotX: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_View3d_SetRotX, this.rotX, pr));
        this.rotX = pr;
    },
    setRotY: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_View3d_SetRotY, this.rotY, pr));
        this.rotY = pr;
            }
};

function CreateTextBodyFromString(str, drawingDocument, parent)
{
    var tx_body = new AscFormat.CTextBody();
    tx_body.setParent(parent);
    tx_body.setBodyPr(new AscFormat.CBodyPr());
    var old_is_doc_editor = false;
    if(typeof editor !== "undefined" && editor && editor.isDocumentEditor)
    {
        editor.isDocumentEditor = false;
        old_is_doc_editor = true;
    }
    tx_body.setContent(CreateDocContentFromString(str, drawingDocument, tx_body));

    if(typeof editor !== "undefined" && editor && old_is_doc_editor)
    {
        editor.isDocumentEditor = true;
    }
    return tx_body;
}

function CreateDocContentFromString(str, drawingDocument, parent)
{
    var content = new AscFormat.CDrawingDocContent(parent, drawingDocument, 0, 0, 0, 0, false, false, true);
    AddToContentFromString(content, str);
    return content;
}


function AddToContentFromString(content, str)
{
    for(var i = 0; i < str.length; ++i)
    {
        var ch = str[i];
        if (ch == '\t')
        {
            content.Paragraph_Add( new ParaTab(), false );
        }
        else if (ch == '\n')
        {
            content.Paragraph_Add( new ParaNewLine(break_Line), false );
        }
        else if (ch == '\r')
            ;
        else if (ch != ' ')
        {
            content.Paragraph_Add(new ParaText(ch), false );
        }
        else
        {
            content.Paragraph_Add(new ParaSpace(1), false );
        }
    }
}

function CValAxisLabels(chart, axis)
{
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.transform = new CMatrix();
    this.localTransform = new CMatrix();
    this.arrLabels = [];
    this.chart = chart;
    this.posX = null;
    this.posY = null;
    this.axis = axis;
}

CValAxisLabels.prototype =
{
    recalculateExtX: function()
    {
        var max_ext_x = 0;
        for(var i = 0; i < this.arrLabels.length; ++i)
        {
            if(this.arrLabels[i].extX > max_ext_x)
            {
                max_ext_x = this.arrLabels[i].extX;
            }
        }
        this.extX = max_ext_x;
    },

    hit: function(x, y)
    {
        var tx, ty;
        if(this.chart && this.chart.invertTransform)
        {
            tx = this.chart.invertTransform.TransformPointX(x, y);
            ty = this.chart.invertTransform.TransformPointY(x, y);
            return tx >= this.x && ty >= this.y && tx <= this.x + this.extX && ty <= this.y + this.extY;
        }
        return false;
    },

    getMinWidth: function()
    {
        var max_min_width = this.arrLabels[0].txBody.content.Recalculate_MinMaxContentWidth().Min;
        for(var i = 1; i < this.arrLabels.length; ++i)
        {
            var t = this.arrLabels[i].txBody.content.Recalculate_MinMaxContentWidth().Min;
            if(t > max_min_width)
                max_min_width = t;
        }
        return max_min_width;
    },

    draw: function(g)
    {
        if(this.chart)
        {
            //g.SetIntegerGrid(false);
            //g.p_width(70);
            //g.transform3(this.chart.transform, false);
            //g.p_color(0, 0, 0, 255);
            //g._s();
            //g._m(this.x, this.y);
            //g._l(this.x + this.extX, this.y + 0);
            //g._l(this.x + this.extX, this.y + this.extY);
            //g._l(this.x + 0, this.y + this.extY);
            //g._z();
            //g.ds();
            //g.SetIntegerGrid(true);
        }
        for(var i = 0; i < this.arrLabels.length; ++i)
        {
            if(this.arrLabels[i])
                this.arrLabels[i].draw(g);
        }
    },

    setPosition: function(x, y)
    {
        this.x = x;
        this.y = y;
        for(var i = 0; i < this.arrLabels.length; ++i)
        {
            if(this.arrLabels[i])
            {
                var lbl = this.arrLabels[i];
                lbl.setPosition(lbl.relPosX + x, lbl.relPosY + y);
            }
        }
    },

    updatePosition: function(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, x, y);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        for(var i = 0; i < this.arrLabels.length; ++i)
        {
            if(this.arrLabels[i])
                this.arrLabels[i].updatePosition(x, y);
        }
    },

    checkShapeChildTransform: function(t)
    {
        this.transform = this.localTransform.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transform, this.posX, this.posY);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        for(var i = 0; i < this.arrLabels.length; ++i)
        {
            if(this.arrLabels[i])
                this.arrLabels[i].checkShapeChildTransform(t);
        }
    }

};


function CalcLegendEntry(legend, chart, idx)
{
    this.chart = chart;
    this.legend = legend;
    this.idx = idx;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.calcMarkerUnion = null;
    this.txBody = null;
    this.txPr = null;
    this.spPr = new AscFormat.CSpPr();
    this.transform = new CMatrix();
    this.transformText = new CMatrix();

    this.contentWidth = 0;
    this.contentHeight = 0;

    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();

    this.localX = null;
    this.localY = null;

    this.recalcInfo =
    {
        recalcStyle: true
    };
}

CalcLegendEntry.prototype =
{
    recalculate: function()
    {
    },
    getStyles: CDLbl.prototype.getStyles,
    recalculateStyle: CDLbl.prototype.recalculateStyle,
    Get_Styles: CDLbl.prototype.Get_Styles,

    Get_Theme: CDLbl.prototype.Get_Theme,
    Get_ColorMap: CDLbl.prototype.Get_ColorMap,

    draw: function(g)
    {

        CShape.prototype.draw.call(this, g);
        if(this.calcMarkerUnion)
            this.calcMarkerUnion.draw(g);
    },

    isEmptyPlaceholder: function()
    {
        return false;
    },

    updatePosition: CShape.prototype.updatePosition,

    checkWidhtContent: function()
    {
        var par = this.txBody.content.Content[0];
        var max_width = 0;
        for(var j = 0; j < par.Lines.length; ++j)
        {
            if(par.Lines[j].Ranges[0].W  > max_width)
            {
                max_width = par.Lines[j].Ranges[0].W;
            }
        }
        this.contentWidth = max_width;
        this.contentHeight = this.txBody.getSummaryHeight();
    },

    hit: function(x, y)
    {
        var tx, ty, oGeometry;
        if(this.invertTransformText)
        {
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            if(tx >= 0 && tx <= this.contentWidth && ty >= 0 && ty <= this.contentHeight)
            {
                return true;
            }
        }
        if(this.chart)
        {
            var oCanvasHit = this.chart.getCanvasContext();
            var calcMarkerUnion = this.calcMarkerUnion;
            if(calcMarkerUnion.marker && calcMarkerUnion.marker.invertTransform)
            {
                tx = calcMarkerUnion.marker.invertTransform.TransformPointX(x, y);
                ty = calcMarkerUnion.marker.invertTransform.TransformPointY(x, y);
                oGeometry = calcMarkerUnion.marker.spPr.geometry;
                if(oGeometry.hitInInnerArea(oCanvasHit, tx, ty) || oGeometry.hitInPath(oCanvasHit, tx, ty))
                {
                    return true;
                }
            }
            if(calcMarkerUnion.lineMarker && calcMarkerUnion.lineMarker.invertTransform)
            {
                tx = calcMarkerUnion.lineMarker.invertTransform.TransformPointX(x, y);
                ty = calcMarkerUnion.lineMarker.invertTransform.TransformPointY(x, y);
                oGeometry = calcMarkerUnion.lineMarker.spPr.geometry;
                if(oGeometry.hitInInnerArea(oCanvasHit, tx, ty) || oGeometry.hitInPath(oCanvasHit, tx, ty))
                {
                    return true;
                }
            }
        }
        return false;
    }
};


function CompiledMarker()
{
    this.spPr = new AscFormat.CSpPr();
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.localX = null;
    this.localY = null;
    this.transform = new CMatrix();
    this.localTransform = new CMatrix();
    this.pen = null;
    this.brush = null;
}

CompiledMarker.prototype =
{
    draw: CShape.prototype.draw,
    check_bounds: CShape.prototype.check_bounds,


    isEmptyPlaceholder: function()
    {
        return false;
    }


};

function CUnionMarker()
{
    this.lineMarker = null;
    this.marker = null;
}

CUnionMarker.prototype =
{
    draw: function(g)
    {
        this.lineMarker && this.lineMarker.draw(g);
        this.marker && this.marker.draw(g);
    },

    setWidth: function(w)
    {
    }
};

function CreateMarkerGeometryByType(type, src)
{
    var ret = new AscFormat.Geometry();
    var w = 43200, h = 43200;
    function AddRect(geom, w, h)
    {
        geom.AddPathCommand(1, "0", "0");
        geom.AddPathCommand(2, w+"", "0");
        geom.AddPathCommand(2, w+"", h+"");
        geom.AddPathCommand(2, "0", h+"");
        geom.AddPathCommand(6);
    }

    function AddPlus(geom, w, h)
    {
        geom.AddPathCommand(0,undefined, "none", undefined, w, h);
        geom.AddPathCommand(1, w/2 + "", "0");
        geom.AddPathCommand(2, w/2 + "", h + "");
        geom.AddPathCommand(1, "0", h/2+"");
        geom.AddPathCommand(2, w+"", h/2+"");
    }

    function AddX(geom, w, h)
    {
        geom.AddPathCommand(0,undefined, "none", undefined, w, h);
        geom.AddPathCommand(1, "0", "0");
        geom.AddPathCommand(2, w + "", h + "");
        geom.AddPathCommand(1, w + "", "0");
        geom.AddPathCommand(2, "0", h + "");
    }

    switch(type)
    {
        case SYMBOL_CIRCLE:
        {
            ret.AddPathCommand(0,undefined, undefined, undefined, w, h);
            ret.AddPathCommand(1, "0", h/2 + "");
            ret.AddPathCommand(3, w/2 + "", h/2 + "", "cd2", "cd4");
            ret.AddPathCommand(3, w/2 + "", h/2 + "", "_3cd4", "cd4");
            ret.AddPathCommand(3, w/2 + "", h/2 + "", "0", "cd4");
            ret.AddPathCommand(3, w/2 + "", h/2 + "", "cd4", "cd4");
            ret.AddPathCommand(6);
            break;
        }
        case SYMBOL_DASH:
        case SYMBOL_DOT:
        {
            ret.AddPathCommand(0,undefined, "none", undefined, w, h);
            ret.AddPathCommand(1, type === SYMBOL_DASH ? "0" : w/2+"", h/2 +"");
            ret.AddPathCommand(2, w + "", h/2 +"");
            break;
        }
        case SYMBOL_DIAMOND:
        {
            ret.AddPathCommand(0,undefined, undefined, undefined, w, h);
            ret.AddPathCommand(1, w/2+"", "0");
            ret.AddPathCommand(2, w+"", h/2+"");
            ret.AddPathCommand(2, w/2 + "", h+"");
            ret.AddPathCommand(2, "0", h/2+"");
            ret.AddPathCommand(6);
            break;
        }
        case SYMBOL_NONE:
        {
            break;
        }
        case SYMBOL_PICTURE:
        case SYMBOL_SQUARE:
        {
            ret.AddPathCommand(0,undefined, undefined, undefined, w, h);
            AddRect(ret, w, h);
            break;
        }
        case SYMBOL_PLUS:
        {
            ret.AddPathCommand(0,undefined,  "none", false, w, h);
            AddRect(ret, w, h);
            AddPlus(ret, w, h);
            break;
        }
        case SYMBOL_STAR:
        {
            ret.AddPathCommand(0,undefined,  "none", false, w, h);
            AddRect(ret, w, h);
            AddPlus(ret, w, h);
            AddX(ret, w, h);
            break;
        }
        case SYMBOL_TRIANGLE:
        {
            ret.AddPathCommand(0,undefined, undefined, undefined, w, h);
            ret.AddPathCommand(1, w/2+"", "0");
            ret.AddPathCommand(2, w+"", h + "");
            ret.AddPathCommand(2, "0", h+"");
            ret.AddPathCommand(6);
            break;
        }
        case SYMBOL_X:
        {
            ret.AddPathCommand(0,undefined, "none", false, w, h);
            AddRect(ret, w, h);
            AddX(ret, w, h);
            break;
        }
    }
    var ret2 = new CompiledMarker();
    ret2.spPr.geometry = ret;
    return ret2;
}

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CDLbl = CDLbl;
    window['AscFormat'].CPlotArea = CPlotArea;
    window['AscFormat'].CBarChart = CBarChart;
    window['AscFormat'].CAreaChart = CAreaChart;
    window['AscFormat'].CAreaSeries = CAreaSeries;
    window['AscFormat'].CCatAx = CCatAx;
    window['AscFormat'].CDateAx = CDateAx;
    window['AscFormat'].CSerAx = CSerAx;
    window['AscFormat'].CValAx = CValAx;
    window['AscFormat'].CBandFmt = CBandFmt;
    window['AscFormat'].CBarSeries = CBarSeries;
    window['AscFormat'].CBubbleChart = CBubbleChart;
    window['AscFormat'].CBubbleSeries = CBubbleSeries;
    window['AscFormat'].CCat = CCat;
    window['AscFormat'].CChartText = CChartText;
    window['AscFormat'].CDLbls = CDLbls;
    window['AscFormat'].CDPt = CDPt;
    window['AscFormat'].CDTable = CDTable;
    window['AscFormat'].CDispUnits = CDispUnits;
    window['AscFormat'].CDoughnutChart = CDoughnutChart;
    window['AscFormat'].CErrBars = CErrBars;
    window['AscFormat'].CLayout = CLayout;
    window['AscFormat'].CLegend = CLegend;
    window['AscFormat'].CLegendEntry = CLegendEntry;
    window['AscFormat'].CLineChart = CLineChart;
    window['AscFormat'].CLineSeries = CLineSeries;
    window['AscFormat'].CMarker = CMarker;
    window['AscFormat'].CMinusPlus = CMinusPlus;
    window['AscFormat'].CMultiLvlStrCache = CMultiLvlStrCache;
    window['AscFormat'].CMultiLvlStrRef = CMultiLvlStrRef;
    window['AscFormat'].CNumRef = CNumRef;
    window['AscFormat'].CNumericPoint = CNumericPoint;
    window['AscFormat'].CNumFmt = CNumFmt;
    window['AscFormat'].CNumLit = CNumLit;
    window['AscFormat'].COfPieChart = COfPieChart;
    window['AscFormat'].CPictureOptions = CPictureOptions;
    window['AscFormat'].CPieChart = CPieChart;
    window['AscFormat'].CPieSeries = CPieSeries;
    window['AscFormat'].CPivotFmt = CPivotFmt;
    window['AscFormat'].CRadarChart = CRadarChart;
    window['AscFormat'].CRadarSeries = CRadarSeries;
    window['AscFormat'].CScaling = CScaling;
    window['AscFormat'].CScatterChart = CScatterChart;
    window['AscFormat'].CScatterSeries = CScatterSeries;
    window['AscFormat'].CTx = CTx;
    window['AscFormat'].CStockChart = CStockChart;
    window['AscFormat'].CStrCache = CStrCache;
    window['AscFormat'].CStringLiteral = CStringLiteral;
    window['AscFormat'].CStringPoint = CStringPoint;
    window['AscFormat'].CStrRef = CStrRef;
    window['AscFormat'].CSurfaceChart = CSurfaceChart;
    window['AscFormat'].CSurfaceSeries = CSurfaceSeries;
    window['AscFormat'].CTitle = CTitle;
    window['AscFormat'].CTrendLine = CTrendLine;
    window['AscFormat'].CUpDownBars = CUpDownBars;
    window['AscFormat'].CXVal = CXVal;
    window['AscFormat'].CYVal = CYVal;
    window['AscFormat'].CChart = CChart;
    window['AscFormat'].CChartWall = CChartWall;
    window['AscFormat'].CView3d = CView3d;
    window['AscFormat'].CreateTextBodyFromString = CreateTextBodyFromString;
    window['AscFormat'].CreateDocContentFromString = CreateDocContentFromString;
    window['AscFormat'].AddToContentFromString = AddToContentFromString;
    window['AscFormat'].CValAxisLabels = CValAxisLabels;
    window['AscFormat'].CalcLegendEntry = CalcLegendEntry;
    window['AscFormat'].CUnionMarker = CUnionMarker;
    window['AscFormat'].CreateMarkerGeometryByType = CreateMarkerGeometryByType;

    window['AscFormat'].NEW_WORKSHEET_DRAWING_DOCUMENT = null;
    
    window['AscFormat'].AX_POS_L = AX_POS_L;
    window['AscFormat'].AX_POS_T = AX_POS_T;
    window['AscFormat'].AX_POS_R = AX_POS_R;
    window['AscFormat'].AX_POS_B = AX_POS_B;
    
    window['AscFormat'].CROSSES_AUTO_ZERO = CROSSES_AUTO_ZERO;
    window['AscFormat'].CROSSES_MAX = CROSSES_MAX;
    window['AscFormat'].CROSSES_MIN = CROSSES_MIN;

    window['AscFormat'].LBL_ALG_CTR = LBL_ALG_CTR;
    window['AscFormat'].LBL_ALG_L = LBL_ALG_L;
    window['AscFormat'].LBL_ALG_R = LBL_ALG_R;

    window['AscFormat'].TIME_UNIT_DAYS = TIME_UNIT_DAYS;
    window['AscFormat'].TIME_UNIT_MONTHS = TIME_UNIT_MONTHS;
    window['AscFormat'].TIME_UNIT_YEARS = TIME_UNIT_YEARS;

    window['AscFormat'].CROSS_BETWEEN_BETWEEN = CROSS_BETWEEN_BETWEEN;
    window['AscFormat'].CROSS_BETWEEN_MID_CAT = CROSS_BETWEEN_MID_CAT;

    window['AscFormat'].SYMBOL_CIRCLE = SYMBOL_CIRCLE;
    window['AscFormat'].SYMBOL_DASH = SYMBOL_DASH;
    window['AscFormat'].SYMBOL_DIAMOND = SYMBOL_DIAMOND;
    window['AscFormat'].SYMBOL_DOT = SYMBOL_DOT;
    window['AscFormat'].SYMBOL_NONE = SYMBOL_NONE;
    window['AscFormat'].SYMBOL_PICTURE = SYMBOL_PICTURE;
    window['AscFormat'].SYMBOL_PLUS = SYMBOL_PLUS;
    window['AscFormat'].SYMBOL_SQUARE = SYMBOL_SQUARE;
    window['AscFormat'].SYMBOL_STAR = SYMBOL_STAR;
    window['AscFormat'].SYMBOL_TRIANGLE = SYMBOL_TRIANGLE;
    window['AscFormat'].SYMBOL_X = SYMBOL_X;
    window['AscFormat'].MARKER_SYMBOL_TYPE = MARKER_SYMBOL_TYPE;

    window['AscFormat'].ORIENTATION_MAX_MIN = ORIENTATION_MAX_MIN;
    window['AscFormat'].ORIENTATION_MIN_MAX = ORIENTATION_MIN_MAX;
})(window);
