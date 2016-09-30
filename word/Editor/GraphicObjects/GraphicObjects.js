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

// Import
var changestype_Drawing_Props = AscCommon.changestype_Drawing_Props;
var changestype_2_ElementsArray_and_Type = AscCommon.changestype_2_ElementsArray_and_Type;
var g_oTableId = AscCommon.g_oTableId;
var isRealObject = AscCommon.isRealObject;
var global_mouseEvent = AscCommon.global_mouseEvent;
var History = AscCommon.History;

var DrawingObjectsController = AscFormat.DrawingObjectsController;
var HANDLE_EVENT_MODE_HANDLE = AscFormat.HANDLE_EVENT_MODE_HANDLE;
var HANDLE_EVENT_MODE_CURSOR = AscFormat.HANDLE_EVENT_MODE_CURSOR;

var asc_CImgProperty = Asc.asc_CImgProperty;

function CBoundsRectForMath(oDrawing)
{
    this.L = 0;
    this.T = 0;
    this.R = 0;
    this.B = 0;

    if(oDrawing)
    {
        this.Distance = oDrawing.Get_Distance();
        switch (oDrawing.Get_Type())
        {
            case para_Drawing:
            {
                this.WrapType = oDrawing.wrappingType;
                switch(oDrawing.wrappingType)
                {
                    case WRAPPING_TYPE_NONE:
                    {
                        break;
                    }
                    case WRAPPING_TYPE_SQUARE :
                    case WRAPPING_TYPE_THROUGH:
                    case WRAPPING_TYPE_TIGHT:
                    {
                        this.L = oDrawing.wrappingPolygon.left + this.Distance.L;
                        this.R = oDrawing.wrappingPolygon.right - this.Distance.R;
                        this.T = oDrawing.wrappingPolygon.top + this.Distance.T;
                        this.B = oDrawing.wrappingPolygon.bottom - this.Distance.B;
                        break;
                    }
                    case WRAPPING_TYPE_TOP_AND_BOTTOM:
                    {
                        var oLimits = editor.WordControl.m_oLogicDocument.Get_PageLimits(oDrawing.PageNum);
                        this.L = oLimits.X;
                        this.R = oLimits.XLimit;
                        this.T = oDrawing.wrappingPolygon.top + this.Distance.T;
                        this.B = oDrawing.wrappingPolygon.bottom - this.Distance.B;
                        break;
                    }
                }
                break;
            }
            case flowobject_Paragraph:
            case flowobject_Table:
            {
                this.WrapType = oDrawing.WrappingType;
                switch(oDrawing.WrappingType)
                {
                    case WRAPPING_TYPE_NONE:
                    {
                        break;
                    }
                    case WRAPPING_TYPE_SQUARE :
                    case WRAPPING_TYPE_THROUGH:
                    case WRAPPING_TYPE_TIGHT:
                    {
                        this.L = oDrawing.X;
                        this.R = oDrawing.X + oDrawing.W;
                        this.T = oDrawing.Y;
                        this.B = oDrawing.Y + oDrawing.H;
                        break;
                    }
                    case WRAPPING_TYPE_TOP_AND_BOTTOM:
                    {
                        var oLimits = editor.WordControl.m_oLogicDocument.Get_PageLimits(oDrawing.PageNum);
                        this.L = oLimits.X;
                        this.R = oLimits.XLimit;
                        this.T = oDrawing.Y;
                        this.B = oDrawing.Y + oDrawing.H;
                        break;
                    }
                }
            }
        }

    }
    else
    {
        this.WrapType = WRAPPING_TYPE_NONE;
        this.Distance = new AscFormat.CDistance(0, 0, 0, 0);
    }
}

function CGraphicObjects(document, drawingDocument, api)
{
    this.api = api;
    this.document = document;
    this.drawingDocument = drawingDocument;

    this.graphicPages = [];

    this.startTrackPos =
    {
        x: null,
        y: null,
        pageIndex: null
    };

    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];


    this.curState = new AscFormat.NullState(this);

    this.selectionInfo =
    {
        selectionArray: []
    };

    this.maximalGraphicObjectZIndex = 1024;

    this.spline = null;
    this.polyline = null;

    this.drawingObjects = [];


    this.urlMap = [];
    this.recalcMap = {};

    this.recalculateMap = {};

    this.selectedObjects = [];
    this.selection =
    {
        groupSelection:       null,
        chartSelection:       null,
        textSelection:        null,
        wrapPolygonSelection: null
    };

    this.selectedObjects = [];

    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;

    this.nullState = new AscFormat.NullState(this);
    this.bNoCheckChartTextSelection = false;

    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    this.Lock = new AscCommon.CLock();
    g_oTableId.Add( this, this.Id );
}

CGraphicObjects.prototype =
{
    handleAdjustmentHit: DrawingObjectsController.prototype.handleAdjustmentHit,
    handleHandleHit: DrawingObjectsController.prototype.handleHandleHit,
    handleMoveHit: DrawingObjectsController.prototype.handleMoveHit,

    rotateTrackObjects: DrawingObjectsController.prototype.rotateTrackObjects,
    handleRotateTrack: DrawingObjectsController.prototype.handleRotateTrack,
    trackResizeObjects: DrawingObjectsController.prototype.trackResizeObjects,
    resetInternalSelection: DrawingObjectsController.prototype.resetInternalSelection,
    handleTextHit: DrawingObjectsController.prototype.handleTextHit,

    Get_Id: function()
    {
        return this.Id;
    },

    TurnOffCheckChartSelection: function()
    {
        this.bNoCheckChartTextSelection = true;
    },

    TurnOnCheckChartSelection: function()
    {
        this.bNoCheckChartTextSelection = false;
    },


    getDrawingDocument: function()
    {
        return editor.WordControl.m_oDrawingDocument;
    },
    sortDrawingArrays: function()
    {
        for(var i = 0; i < this.graphicPages.length; ++i)
        {
            if(this.graphicPages[i])
                this.graphicPages[i].sortDrawingArrays();
        }
    },

    getSelectedObjects: function()
    {
        return this.selectedObjects;
    },

    getTheme: function()
    {
        return this.document.theme;
    },

    getColorMapOverride: function()
    {
        return null;
    },

    isViewMode: function()
    {
        return editor.isViewMode;
    },

    convertPixToMM: function(v)
    {
        return this.document.DrawingDocument.GetMMPerDot(v);
    },

    getGraphicInfoUnderCursor: function(pageIndex, x, y)
    {
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        var ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex, false);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret && ret.cursorType === "text")
        {
            if((this.selection.chartSelection && this.selection.chartSelection.selection.textSelection) ||
                (this.selection.groupSelection && this.selection.groupSelection.selection.chartSelection && this.selection.groupSelection.selection.chartSelection.selection.textSelection))
            {
                ret = {};
            }
        }
        return ret || {};
    },

    updateCursorType: function(pageIndex, x, y, e, bTextFlag)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex, bTextFlag);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            if(ret.cursorType !== "text")
                this.drawingDocument.SetCursorType(ret.cursorType);
            return true;
        }
        return false;
    },

    createImage: DrawingObjectsController.prototype.createImage,
    createOleObject: DrawingObjectsController.prototype.createOleObject,
    createTextArt: DrawingObjectsController.prototype.createTextArt,
    getChartObject: DrawingObjectsController.prototype.getChartObject,
    getChartSpace2: DrawingObjectsController.prototype.getChartSpace2,
    CreateDocContent: DrawingObjectsController.prototype.CreateDocContent,

    getAllBoundsRectOnPageForMath: function(nPageIndex)
    {
        if(this.graphicPages[nPageIndex])
        {
            return this.graphicPages[nPageIndex].getAllBoundsRectOnPageForMath();
        }
        return [];
    },


    clearPreTrackObjects: function()
    {
        this.arrPreTrackObjects.length = 0;
    },

    addPreTrackObject: function(preTrackObject)
    {
        this.arrPreTrackObjects.push(preTrackObject);
    },

    clearTrackObjects: function()
    {
        this.arrTrackObjects.length = 0;
    },

    addTrackObject: function(trackObject)
    {
        this.arrTrackObjects.push(trackObject);
    },

    swapTrackObjects: function()
    {
        this.clearTrackObjects();
        for(var i = 0; i < this.arrPreTrackObjects.length; ++i)
            this.addTrackObject(this.arrPreTrackObjects[i]);
        this.clearPreTrackObjects();
    },


    addToRecalculate: function(object)
    {
        if(typeof object.Get_Id === "function" && typeof object.recalculate === "function")
            History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, Object: object});
        return;
    },

    createWatermarkImage: DrawingObjectsController.prototype.createWatermarkImage,



    getTrialImage: function(sImageUrl)
    {
        return AscFormat.ExecuteNoHistory(function(){
            var oParaDrawing = new ParaDrawing();
            oParaDrawing.Set_PositionH(Asc.c_oAscRelativeFromH.Page, true, c_oAscAlignH.Center, undefined);
            oParaDrawing.Set_PositionV(Asc.c_oAscRelativeFromV.Page, true, c_oAscAlignV.Center, undefined);
            oParaDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
            oParaDrawing.Set_BehindDoc( false );
            oParaDrawing.Set_Distance( 3.2, 0, 3.2, 0 );
            oParaDrawing.Set_DrawingType(drawing_Anchor);
            var oShape = this.createWatermarkImage(sImageUrl);
            oParaDrawing.Extent.W = oShape.spPr.xfrm.extX;
            oParaDrawing.Extent.H = oShape.spPr.xfrm.extY;
            oShape.setParent(oParaDrawing);
            oParaDrawing.Set_GraphicObject(oShape);
            return oParaDrawing;
        }, this, []);

    },
	
    recalculate_: function(data)
    {
        if(data.All)
        {
            for(var i = 0; i < this.drawingObjects.length; ++i)
            {
                if(this.drawingObjects[i].GraphicObj)
                {
                    if(this.drawingObjects[i].GraphicObj.recalcText)
                    {
                        this.drawingObjects[i].GraphicObj.recalcText(true);
                    }
                    this.drawingObjects[i].GraphicObj.recalculate();
                }
            }
            for(var i = 0; i < this.drawingObjects.length; ++i)
            {
                if(this.drawingObjects[i].GraphicObj && this.drawingObjects[i].GraphicObj.recalculateText)
                {
                    this.drawingObjects[i].GraphicObj.recalculateText();
                }
            }
        }
        else
        {
            var map = data.Map;
            for(var key in map)
            {
                if(map.hasOwnProperty(key))
                    map[key].recalculate();
            }
        }
    },

    recalculateText_: function(data)
    {
        if(data.All)
        {
            //TODO
        }
        else
        {
            var map = data.Map;
            for(var key in map)
            {
                if(map.hasOwnProperty(key) && map[key].recalculateText)
                    map[key].recalculateText();
            }
        }
    },

    recalculate: function()
    {
        var b_update = false;
        for(var key in this.recalculateMap)
        {
            if(this.recalculateMap.hasOwnProperty(key))
                this.recalculateMap[key].recalculate();
        }
        this.recalculateMap = {};
    },


    selectObject: DrawingObjectsController.prototype.selectObject,

    checkSelectedObjectsForMove: DrawingObjectsController.prototype.checkSelectedObjectsForMove,

    getDrawingPropsFromArray: DrawingObjectsController.prototype.getDrawingPropsFromArray,
    getPropsFromChart: DrawingObjectsController.prototype.getPropsFromChart,
    getSelectedObjectsByTypes: DrawingObjectsController.prototype.getSelectedObjectsByTypes,


    getPageSizesByDrawingObjects: function()
    {
        var aW = [], aH = [];
        var aBPages = [];
        var page_limits;
        if(this.selectedObjects.length > 0)
        {
            for(var i = 0; i < this.selectedObjects.length; ++i)
            {
                if(!aBPages[this.selectedObjects[i].selectStartPage])
                {
                    page_limits = this.document.Get_PageLimits(this.selectedObjects[i].selectStartPage);
                    aW.push(page_limits.XLimit);
                    aH.push(page_limits.YLimit);
                    aBPages[this.selectedObjects[i].selectStartPage] = true;
                }
            }
            return {W: Math.min.apply(Math, aW), H: Math.min.apply(Math, aH)};
        }
        page_limits = this.document.Get_PageLimits(0);
        return {W: page_limits.XLimit, H: page_limits.YLimit};
    },

    Accept_RevisionChanges: function(Type, bAll)
    {
        var oDocContent = this.getTargetDocContent();
        if(oDocContent)
        {
            oDocContent.Accept_RevisionChanges(Type, bAll);
        }
    },


    Reject_RevisionChanges: function(Type, bAll)
    {
        var oDocContent = this.getTargetDocContent();
        if(oDocContent)
        {
            oDocContent.Reject_RevisionChanges(Type, bAll);
        }
    },

    Get_Props: function()
    {
        var props_by_types = DrawingObjectsController.prototype.getDrawingProps.call(this);
        var para_drawing_props = null;
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            para_drawing_props = this.selectedObjects[i].parent.Get_Props(para_drawing_props);
        }
        var chart_props, shape_props, image_props;
        if(para_drawing_props)
        {
            if(props_by_types.shapeProps)
            {
                shape_props = new asc_CImgProperty(para_drawing_props);
                shape_props.ShapeProperties = AscFormat.CreateAscShapePropFromProp(props_by_types.shapeProps);
                shape_props.verticalTextAlign = props_by_types.shapeProps.verticalTextAlign;
                shape_props.vert = props_by_types.shapeProps.vert;
                shape_props.Width = props_by_types.shapeProps.w;
                shape_props.Height = props_by_types.shapeProps.h;
                shape_props.lockAspect = props_by_types.shapeProps.lockAspect;
            }
            if(props_by_types.imageProps)
            {
                image_props = new asc_CImgProperty(para_drawing_props);
                image_props.ImageUrl = props_by_types.imageProps.ImageUrl;
                image_props.Width = props_by_types.imageProps.w;
                image_props.Height = props_by_types.imageProps.h;
                image_props.lockAspect = props_by_types.imageProps.lockAspect;

                image_props.pluginGuid = props_by_types.imageProps.pluginGuid;
                image_props.pluginData = props_by_types.imageProps.pluginData;

                image_props.oleWidth = props_by_types.imageProps.oleWidth;
                image_props.oleHeight = props_by_types.imageProps.oleHeight;
            }
            if(props_by_types.chartProps && !(props_by_types.chartProps.severalCharts === true))
            {
                chart_props = new asc_CImgProperty(para_drawing_props);
                chart_props.ChartProperties = props_by_types.chartProps.chartProps;
                chart_props.severalCharts = props_by_types.chartProps.severalCharts;
                chart_props.severalChartStyles = props_by_types.chartProps.severalChartStyles;
                chart_props.severalChartTypes = props_by_types.chartProps.severalChartTypes;
            }
        }

        if(props_by_types.shapeProps)
        {
            var pr = props_by_types.shapeProps;
            if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == Asc.c_oAscFill.FILL_TYPE_BLIP)
            {
                this.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
            }
            else
            {
                this.drawingDocument.DrawImageTextureFillShape(null);
            }
        }
        else
        {
            this.drawingDocument.DrawImageTextureFillShape(null);
        }
        var ret = [];
        if(isRealObject(shape_props))
        {
            ret.push(shape_props);
        }
        if(isRealObject(image_props))
        {
            ret.push(image_props);
        }

        if(isRealObject(chart_props))
        {
            ret.push(chart_props);
        }
        return ret;
    },

    resetTextSelection: DrawingObjectsController.prototype.resetTextSelection,

    setProps: function(oProps)
    {
        var oApplyProps, i;

        for(i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].parent.Set_Props(oProps);
        }
        if(AscFormat.isRealNumber(oProps.Width) || AscFormat.isRealNumber(oProps.Height))
        {
            oApplyProps = oProps;
        }
        else
        {
            oApplyProps = oProps.ShapeProperties ? oProps.ShapeProperties : oProps;
            if(AscFormat.isRealBool(oProps.lockAspect))
            {
                oApplyProps.lockAspect = oProps.lockAspect;
            }
        }
        this.applyDrawingProps(oApplyProps);
        if(AscFormat.isRealNumber(oApplyProps.Width) || AscFormat.isRealNumber(oApplyProps.Height))
        {
            /*в случае если в насторойках ParaDrawing стоит UseAlign - пересчитываем drawing, т. к. ширина и высото ParaDrawing рассчитывается по bounds*/
            var aSelectedObjects = this.selectedObjects;
            for(i = 0; i < aSelectedObjects.length; ++i)
            {
                aSelectedObjects[i].parent.CheckWH();
            }
        }
        this.document.Recalculate();
        if(oApplyProps.textArtProperties && typeof oApplyProps.textArtProperties.asc_getForm() === "string")
        {
            this.document.Document_UpdateSelectionState();
        }
        oApplyProps && (AscFormat.isRealNumber(oApplyProps.verticalTextAlign) || AscFormat.isRealNumber(oApplyProps.vert)) && this.document.Document_UpdateSelectionState();
    },

    applyDrawingProps: DrawingObjectsController.prototype.applyDrawingProps,

    CheckAutoFit : function()
    {
        for(var i = this.drawingObjects.length - 1; i > -1; --i)
        {
                this.drawingObjects[i].CheckGroupSizes();
        }
    },

    checkUseDrawings: function(aDrawings)
    {
        for(var i = aDrawings.length - 1; i > -1; --i)
        {
            if(!aDrawings[i].Is_UseInDocument())
            {
                aDrawings.splice(i, 1);
            }
        }
    },

    bringToFront : function()//перемещаем заселекченые объекты наверх
    {
        if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props))
        {
            History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsBringToFront);
            if(this.selection.groupSelection)
            {
                this.selection.groupSelection.bringToFront();
            }
            else
            {
                var aSelectedObjectsCopy = [], i;
                for(i = 0; i < this.selectedObjects.length; ++i)
                {
                    aSelectedObjectsCopy.push(this.selectedObjects[i].parent);
                }
                aSelectedObjectsCopy.sort(ComparisonByZIndexSimple);
                for(i = 0; i < aSelectedObjectsCopy.length; ++i)
                {
                    aSelectedObjectsCopy[i].Set_RelativeHeight(this.getZIndex());
                }
            }
            this.document.Recalculate();
            this.document.Document_UpdateUndoRedoState();
        }
    },

    checkZIndexMap: function(oDrawing, oDrawingMap, nNewZIndex)
    {
        if(!isRealObject(oDrawingMap[oDrawing.Get_Id()]))
        {
            oDrawingMap[oDrawing.Get_Id()] = oDrawing.RelativeHeight;
        }
        oDrawing.Set_RelativeHeight2(nNewZIndex);
    },

    insertBetween: function(aToInsert/*массив в котрый вставляем*/, aDrawings/*массив куда вставляем*/, nPos, oDrawingMap)
    {
        if(nPos > aDrawings.length || nPos < 0)
            return;
        var i, j, nBetweenMin, nBetweenMax, nTempInterval, aTempDrawingsArray, nDelta;
        if(nPos === aDrawings.length)
        {
            for(i = 0; i < aToInsert.length; ++i)
            {
                this.checkZIndexMap(aToInsert[i], oDrawingMap, this.getZIndex());
                aDrawings.push(aToInsert[i]);
            }
        }
        else
        {
            if(nPos > 0)
            {
                nBetweenMin = aDrawings[nPos-1].RelativeHeight;
            }
            else
            {
                nBetweenMin = -1;
            }
            nBetweenMax = aDrawings[nPos].RelativeHeight;
            if(aToInsert.length < nBetweenMax - nBetweenMin)//интервала хватает для вставки
            {
                for(i = 0; i < aToInsert.length; ++i)
                {
                    nBetweenMin += ((nBetweenMax - nBetweenMin)/(aToInsert.length + 1 - i)) >> 0;
                    this.checkZIndexMap(aToInsert[i], oDrawingMap, nBetweenMin);
                    aDrawings.splice(nPos + i, aToInsert[i]);
                }
            }
            else
            {
                nDelta =  nBetweenMax - nBetweenMin - aToInsert.length + 1; //сколько нам не хватает для вставки
                for(i = nPos; i < aDrawings.length; ++i)
                {
                    this.checkZIndexMap(aDrawings[i], oDrawingMap, aDrawings[i].RelativeHeight + nDelta);
                    if(i < aDrawings.length - 1)
                    {
                        if(aDrawings[i].RelativeHeight <= aDrawings[i+1].RelativeHeight)
                        {
                            break;
                        }
                    }
                }
                for(i = 0; i < aToInsert.length; ++i)
                {
                    this.checkZIndexMap(aToInsert[i], oDrawingMap, nBetweenMin+i);
                    aDrawings.splice(nPos + i, aToInsert[i]);
                }
            }
        }
    },

    checkDrawingsMap: function(oDrawingMap)
    {
        var aDrawings = [], oDrawing, aZIndex = [];
        for(var key in oDrawingMap)
        {
            if(oDrawingMap.hasOwnProperty(key))
            {
                oDrawing = g_oTableId.Get_ById(key);
                aDrawings.push(oDrawing);
                aZIndex.push(oDrawing.RelativeHeight);
                oDrawing.Set_RelativeHeight2(oDrawingMap[key]);
            }
        }
        return {aDrawings: aDrawings, aZIndex: aZIndex};
    },

    applyZIndex: function(oDrawingObject)
    {
        var aDrawings = oDrawingObject.aDrawings, aZIndex = oDrawingObject.aZIndex;
        for(var i = 0; i < aDrawings.length; ++i)
        {
            aDrawings[i].Set_RelativeHeight(aZIndex[i]);
        }
    },

    bringForward : function()//перемещаем заселекченные объекты на один уровень выше
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsBringForwardGroup);
                this.selection.groupSelection.bringForward();
            }
        }
        else
        {
            var aDrawings = [].concat(this.drawingObjects), i, j, aSelect = [], nIndexLastNoSelect = -1, oDrawingsMap = {};
            this.checkUseDrawings(aDrawings);
            aDrawings.sort(ComparisonByZIndexSimple);
            for(i = aDrawings.length - 1; i > -1; --i)
            {
                if(aDrawings[i].GraphicObj.selected)
                {
                    if(nIndexLastNoSelect !== -1)
                    {
                        for(j = i; j > -1; --j)
                        {
                            if(aDrawings[j].GraphicObj.selected)
                            {
                                aSelect.splice(0, 0, aDrawings.splice(j, 1)[0]);
                                --nIndexLastNoSelect;
                            }
                            else
                            {
                                break;
                            }
                        }
                        this.insertBetween(aSelect, aDrawings, nIndexLastNoSelect + 1, oDrawingsMap);
                        aSelect.length = 0;
                        nIndexLastNoSelect = -1;
                        i = j+1;
                    }
                }
                else
                {
                    nIndexLastNoSelect = i;
                }
            }
            var oCheckObject = this.checkDrawingsMap(oDrawingsMap);
            if(false === this.document.Document_Is_SelectionLocked(AscCommon.changestype_None, {Type: changestype_2_ElementsArray_and_Type, CheckType: changestype_Drawing_Props, Elements:oCheckObject.aDrawings}))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsBringForward);
                this.applyZIndex(oCheckObject);
                this.document.Recalculate();
                this.document.Document_UpdateUndoRedoState();
            }
        }
    },

    sendToBack : function()
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsSendToBackGroup);
                this.selection.groupSelection.sendToBack();
            }
        }
        else
        {
            var aDrawings = [].concat(this.drawingObjects), i, aSelect = [], oDrawingsMap = {};
            this.checkUseDrawings(aDrawings);
            aDrawings.sort(ComparisonByZIndexSimple);
            for(i = 0; i < aDrawings.length; ++i)
            {
                if(aDrawings[i].GraphicObj.selected)
                {
                    aSelect.push(aDrawings.splice(i, 1)[0]);
                }
            }
            this.insertBetween(aSelect, aDrawings, 0, oDrawingsMap);
            var oCheckObject = this.checkDrawingsMap(oDrawingsMap);
            if(false === this.document.Document_Is_SelectionLocked(AscCommon.changestype_None, {Type: changestype_2_ElementsArray_and_Type, CheckType: changestype_Drawing_Props, Elements:oCheckObject.aDrawings}))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsSendToBack);
                this.applyZIndex(oCheckObject);
                this.document.Recalculate();
                this.document.Document_UpdateUndoRedoState();
            }
        }
    },

    bringBackward : function()
    {
        if(this.selection.groupSelection)
        {
            if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : changestype_2_ElementsArray_and_Type , Elements : [this.selection.groupSelection.parent.Get_ParentParagraph()], CheckType : AscCommon.changestype_Paragraph_Content}))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsBringBackwardGroup);
                this.selection.groupSelection.bringBackward();
            }
        }
        else
        {
            var aDrawings = [].concat(this.drawingObjects), i, j, aSelect = [], nIndexLastNoSelect = -1, oDrawingsMap = {};
            this.checkUseDrawings(aDrawings);
            aDrawings.sort(ComparisonByZIndexSimple);
            for(i = 0; i < aDrawings.length; ++i)
            {
                if(aDrawings[i].GraphicObj.selected)
                {
                    if(nIndexLastNoSelect !== -1)
                    {
                        for(j = i; j < aDrawings.length; ++j)
                        {
                            if(aDrawings[j].GraphicObj.selected)
                            {
                                aSelect.push(aDrawings.splice(j, 1)[0]);
                            }
                            else
                            {
                                break;
                            }
                        }

                        this.insertBetween(aSelect, aDrawings, nIndexLastNoSelect, oDrawingsMap);
                        aSelect.length = 0;
                        nIndexLastNoSelect = -1;
                        i = j-1;
                    }
                }
                else
                {
                    nIndexLastNoSelect = i;
                }
            }
            var oCheckObject = this.checkDrawingsMap(oDrawingsMap);
            if(false === this.document.Document_Is_SelectionLocked(AscCommon.changestype_None, {Type: changestype_2_ElementsArray_and_Type, CheckType: changestype_Drawing_Props, Elements:oCheckObject.aDrawings}))
            {
                History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsBringBackward);
                this.applyZIndex(oCheckObject);
                this.document.Recalculate();
                this.document.Document_UpdateUndoRedoState();
            }
        }
    },

    editChart: function(chart)
    {
        var bin_object = {"binary":chart};
        var chart_space = this.getChartSpace2(bin_object, null), select_start_page, parent_paragraph, nearest_pos;


        var by_types;
        by_types = AscFormat.getObjectsByTypesFromArr(this.selectedObjects, true);

        var aSelectedCharts = [];
        for(i = 0; i < by_types.charts.length; ++i)
        {
            if(by_types.charts[i].selected)
            {
                aSelectedCharts.push(by_types.charts[i]);
            }
        }

        if(aSelectedCharts.length === 1)
        {
            if(aSelectedCharts[0].group)
            {
                var parent_group = aSelectedCharts[0].group;
                var major_group = aSelectedCharts[0].getMainGroup();
                for(var i = parent_group.spTree.length -1; i > -1; --i)
                {
                    if(parent_group.spTree[i] === aSelectedCharts[0])
                    {
                        parent_group.removeFromSpTreeByPos(i);
                        chart_space.setGroup(parent_group);
                        chart_space.spPr.xfrm.setOffX(aSelectedCharts[0].spPr.xfrm.offX);
                        chart_space.spPr.xfrm.setOffY(aSelectedCharts[0].spPr.xfrm.offY);
                        parent_group.addToSpTree(i, chart_space);
                        major_group.updateCoordinatesAfterInternalResize();
                        major_group.parent.CheckWH();
                        if(this.selection.groupSelection)
                        {
                            select_start_page = this.selection.groupSelection.selectedObjects[0].selectStartPage;
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(chart_space, select_start_page);
                        }
                        this.document.Recalculate();
                        this.document.Document_UpdateInterfaceState();
                        return;
                    }
                }
            }
            else
            {
                chart_space.spPr.xfrm.setOffX(0);
                chart_space.spPr.xfrm.setOffY(0);
                select_start_page = aSelectedCharts[0].selectStartPage;
                chart_space.setParent(aSelectedCharts[0].parent);
                aSelectedCharts[0].parent.Set_GraphicObject(chart_space);
                this.resetSelection();
                this.selectObject(chart_space, select_start_page);
                aSelectedCharts[0].parent.CheckWH();
                this.document.Recalculate();
                this.document.Document_UpdateInterfaceState();
            }
        }
    },



    mergeDrawings: function(pageIndex, HeaderDrawings, HeaderTables, FooterDrawings, FooterTables)
    {
        if(!this.graphicPages[pageIndex])
        {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        var drawings = [], tables = [], i, hdr_ftr_page = this.graphicPages[pageIndex].hdrFtrPage;
        if(HeaderDrawings)
        {
            drawings = drawings.concat(HeaderDrawings);
        }
        if(FooterDrawings)
        {
            drawings = drawings.concat(FooterDrawings);
        }

        var getFloatObjects = function(arrObjects)
        {
            var  ret = [];
            for(var i = 0; i < arrObjects.length; ++i)
            {
                if(arrObjects[i].GetType() === type_Paragraph)
                {
                    var calc_frame = arrObjects[i].CalculatedFrame;
                    var FramePr = arrObjects[i].Get_FramePr();
                    var FrameDx = ( undefined === FramePr.HSpace ? 0 : FramePr.HSpace );
                    var FrameDy = ( undefined === FramePr.VSpace ? 0 : FramePr.VSpace );
                    ret.push(new CFlowParagraph(arrObjects[i], calc_frame.L2, calc_frame.T2, calc_frame.W2, calc_frame.H2, FrameDx, FrameDy, 0, 0, FramePr.Wrap));
                }
                else if(arrObjects[i].GetType() === type_Table)
                {
                    ret.push(new CFlowTable(arrObjects[i], 0));
                }
            }
            return ret;
        };
        if(HeaderTables)
        {
            tables = tables.concat(getFloatObjects(HeaderTables));
        }
        if(FooterTables)
        {
            tables = tables.concat(getFloatObjects(FooterTables));
        }

        hdr_ftr_page.clear();
        for(i = 0; i < drawings.length; ++i)
        {
            var array_type = drawings[i].getDrawingArrayType();
            if(!drawings[i].bNoNeedToAdd && drawings[i].PageNum === pageIndex)
            {
                var drawing_array = null;
                switch(array_type)
                {
                    case DRAWING_ARRAY_TYPE_INLINE:
                    {
                        drawing_array = hdr_ftr_page.inlineObjects;
                        break;
                    }
                    case DRAWING_ARRAY_TYPE_BEHIND:
                    {
                        drawing_array  = hdr_ftr_page.behindDocObjects;
                        break;
                    }
                    case DRAWING_ARRAY_TYPE_BEFORE:
                    {
                        drawing_array = hdr_ftr_page.beforeTextObjects;
                        break;
                    }
                    case DRAWING_ARRAY_TYPE_WRAPPING:
                    {
                        drawing_array = hdr_ftr_page.wrappingObjects;
                        break;
                    }
                }
                if(Array.isArray(drawing_array))
                {
                    drawing_array.push(drawings[i].GraphicObj);
                }
            }
        }
        for(i = 0; i < tables.length; ++i)
        {
            hdr_ftr_page.flowTables.push(tables[i]);
        }
        hdr_ftr_page.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        hdr_ftr_page.wrappingObjects.sort(ComparisonByZIndexSimpleParent);
        hdr_ftr_page.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
    },

    addFloatTable: function(table)
    {
        var hdr_ftr = table.Table.Parent.Is_HdrFtr(true);
        if(!this.graphicPages[table.PageNum + table.PageController])
        {
            this.graphicPages[table.PageNum + table.PageController] = new CGraphicPage(table.PageNum + table.PageController, this);
        }
        if(!hdr_ftr)
        {

            this.graphicPages[table.PageNum + table.PageController].addFloatTable(table);
        }
        else
        {
           // this.graphicPages[table.PageNum + table.PageController].hdrFtrPage.addFloatTable(table);
        }
    },

    removeFloatTableById: function(pageIndex, id)
    {
        if(!this.graphicPages[pageIndex])
        {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        var table = g_oTableId.Get_ById(id);
        if(table)
        {
            var hdr_ftr = table.Parent.Is_HdrFtr(true);
            if(!hdr_ftr)
            {
                this.graphicPages[pageIndex].removeFloatTableById(id);
            }
        }
    },

    selectionIsTableBorder: function()
    {
        var content = this.getTargetDocContent();
        if(content)
            return content.Selection_Is_TableBorderMove();
        return false;
    },


    getTableByXY: function(x, y, pageIndex, documentContent)
    {
        if(!this.graphicPages[pageIndex])
        {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        if(!documentContent.Is_HdrFtr())
            return this.graphicPages[pageIndex].getTableByXY(x, y, documentContent);
        else
            return this.graphicPages[pageIndex].hdrFtrPage.getTableByXY(x, y, documentContent);
        return null;
    },

    OnMouseDown: function(e, x, y, pageIndex)
    {
        //console.log("down " + this.curState.id);
        this.curState.onMouseDown(e, x, y, pageIndex);
    },

    OnMouseMove: function(e, x, y, pageIndex)
    {

        //console.log("move " + this.curState.id);
        this.curState.onMouseMove(e, x, y, pageIndex);
    },

    OnMouseUp: function(e, x, y, pageIndex)
    {

        //console.log("up " + this.curState.id);
        this.curState.onMouseUp(e, x, y, pageIndex);
    },

    draw: function(pageIndex, graphics)
    {
        this.graphicPages[pageIndex] && this.graphicPages[pageIndex].draw(graphics);
    },

    selectionDraw: function()
    {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },

    updateOverlay: function()
    {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },

    isPolylineAddition: function()
    {
        return this.curState.polylineFlag === true;
    },

    shapeApply: function(props)
    {
        this.applyDrawingProps(props);
    },


    addShapeOnPage: function(sPreset, nPageIndex, dX, dY, dExtX, dExtY)
    {
        if ( docpostype_HdrFtr !== this.document.Get_DocPosType() || null !== this.document.HdrFtr.CurHdrFtr )
        {
            if (docpostype_HdrFtr !== this.document.Get_DocPosType())
            {
                this.document.Set_DocPosType(docpostype_DrawingObjects);
                this.document.Selection.Use   = true;
                this.document.Selection.Start = true;
            }
            else
            {
                this.document.Selection.Use   = true;
                this.document.Selection.Start = true;

                var CurHdrFtr = this.document.HdrFtr.CurHdrFtr;
                var DocContent = CurHdrFtr.Content;

                DocContent.Set_DocPosType(docpostype_DrawingObjects);
                DocContent.Selection.Use   = true;
                DocContent.Selection.Start = true;
            }

            this.changeCurrentState(new AscFormat.StartAddNewShape(this, sPreset));
            this.OnMouseDown({}, dX, dY, nPageIndex);
            if(AscFormat.isRealNumber(dExtX) && AscFormat.isRealNumber(dExtY))
            {
                this.OnMouseMove({IsLocked: true}, dX + dExtX, dY + dExtY, nPageIndex)
            }
            this.OnMouseUp({}, dX, dY, nPageIndex);
            this.document.Document_UpdateInterfaceState();
            this.document.Document_UpdateRulersState();
            this.document.Document_UpdateSelectionState();
        }
    },


    drawOnOverlay: function(overlay)
    {
        var _track_objects = this.arrTrackObjects;
        var _object_index;
        var _object_count = _track_objects.length;
        for(_object_index = 0; _object_index < _object_count; ++_object_index)
        {
            _track_objects[_object_index].draw(overlay);
        }
        if(this.curState.InlinePos)
        {
            this.drawingDocument.AutoShapesTrack.SetCurrentPage(this.curState.InlinePos.Page);
            this.drawingDocument.AutoShapesTrack.DrawInlineMoveCursor(this.curState.InlinePos.X, this.curState.InlinePos.Y, this.curState.InlinePos.Height, this.curState.InlinePos.transform);
        }
        //TODO Anchor Position
        return;
    },


    getAllFloatObjectsOnPage: function(pageIndex, docContent)
    {
        if(!this.graphicPages[pageIndex])
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        var arr, page, i, ret = [];
        if(!docContent.Is_HdrFtr())
        {

            page = this.graphicPages[pageIndex];
        }
        else
        {
            page = this.graphicPages[pageIndex].hdrFtrPage;
        }
        arr = page.wrappingObjects.concat(page.behindDocObjects.concat(page.beforeTextObjects));
        for(i = 0; i < arr.length; ++i)
        {
            if(arr[i].parent && arr[i].parent.DocumentContent === docContent)
            {
                ret.push(arr[i].parent);
            }
        }
        return ret;
    },

    getAllFloatTablesOnPage: function(pageIndex, docContent)
    {
        if(!this.graphicPages[pageIndex])
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        if(!docContent)
        {
            docContent = this.document;
        }

        var tables, page;
        if(!docContent.Is_HdrFtr())
        {

            page = this.graphicPages[pageIndex];
        }
        else
        {
            page = this.graphicPages[pageIndex].hdrFtrPage;
        }
        tables = page.flowTables;
        var ret = [];
        for(var i = 0; i < tables.length; ++i)
        {
            if(flowobject_Table === tables[i].Type && tables[i].Table.Parent === docContent)
                ret.push(tables[i]);
        }
        return ret;
    },

    getTargetDocContent: DrawingObjectsController.prototype.getTargetDocContent,
    getTextArtPreviewManager: DrawingObjectsController.prototype.getTextArtPreviewManager,
    getEditorApi: DrawingObjectsController.prototype.getEditorApi,

    handleChartDoubleClick: function(drawing, chart, e, x, y, pageIndex)
    {
        if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props))
        {
            editor.asc_doubleClickOnChart(this.getChartObject());
        }
        this.clearTrackObjects();
        this.clearPreTrackObjects();
        this.changeCurrentState(new AscFormat.NullState(this));
        this.document.OnMouseUp(e, x, y, pageIndex);
    },

    handleOleObjectDoubleClick: function(drawing, oleObject, e, x, y, pageIndex)
    {
		if(drawing && drawing.ParaMath){
			drawing.Convert_ToMathObject();
		}
        else if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props))
        {
            var pluginData = new Asc.CPluginData();
            pluginData.setAttribute("data", oleObject.m_sData);
            pluginData.setAttribute("guid", oleObject.m_sApplicationId);
            pluginData.setAttribute("width", oleObject.extX);
            pluginData.setAttribute("height", oleObject.extY);
            pluginData.setAttribute("widthPix", oleObject.m_nPixWidth);
            pluginData.setAttribute("heightPix", oleObject.m_nPixHeight);
            pluginData.setAttribute("objectId", oleObject.Id);
            editor.asc_pluginRun(oleObject.m_sApplicationId, 0, pluginData);
        }
        this.clearTrackObjects();
        this.clearPreTrackObjects();
        this.changeCurrentState(new AscFormat.NullState(this));
        this.document.OnMouseUp(e, x, y, pageIndex);
    },

    handleMathDrawingDoubleClick : function(drawing, e, x, y, pageIndex)
    {
        drawing.Convert_ToMathObject();
        this.changeCurrentState(new AscFormat.NullState(this));
        this.document.OnMouseUp(e, x, y, pageIndex);
    },

    addInlineImage: function( W, H, Img, Chart, bFlow )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            if(!content.bPresentation){
                content.Add_InlineImage(W, H, Img, Chart, bFlow );
            }
            else{
                if(this.selectedObjects.length > 0)
                {
                    this.resetSelection2();
                    this.document.Add_InlineImage(W, H, Img, Chart, bFlow );
                }
            }
        }
        else
        {
            if(this.selectedObjects[0] && this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline())
            {
                this.resetInternalSelection();
                this.document.Remove(1, true);
                this.document.Add_InlineImage(W, H, Img, Chart, bFlow );
            }
            else
            {
                if(this.selectedObjects.length > 0)
                {
                    this.resetSelection2();
                    this.document.Add_InlineImage(W, H, Img, Chart, bFlow );
                }
            }
        }
    },

    addOleObject: function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            if(!content.bPresentation){
                content.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
            }
            else{
                if(this.selectedObjects.length > 0)
                {
                    this.resetSelection2();
                    this.document.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
                }
            }
        }
        else
        {
            if(this.selectedObjects[0] && this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline())
            {
                this.resetInternalSelection();
                this.document.Remove(1, true);
                this.document.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
            }
            else
            {
                if(this.selectedObjects.length > 0)
                {
                    this.resetSelection2();
                    this.document.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
                }
            }
        }
    },

    addInlineTable: function( Cols, Rows )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Add_InlineTable(Cols, Rows);
        }
    },


    canAddComment: function()
    {
        var content = this.getTargetDocContent();
        return content && content.CanAdd_Comment();
    },

    addComment: function(commentData)
    {
        var content = this.getTargetDocContent();
        return content && content.Add_Comment(commentData, true, true);
    },

    hyperlinkCheck: DrawingObjectsController.prototype.hyperlinkCheck,

    hyperlinkCanAdd: DrawingObjectsController.prototype.hyperlinkCanAdd,

    hyperlinkRemove: DrawingObjectsController.prototype.hyperlinkRemove,

    hyperlinkModify: DrawingObjectsController.prototype.hyperlinkModify,

    hyperlinkAdd: DrawingObjectsController.prototype.hyperlinkAdd,

    isCurrentElementParagraph: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementParagraph();
    },
    isCurrentElementTable: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementTable();
    },


    Get_SelectedContent: function(SelectedContent)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Get_SelectedContent(SelectedContent);
        }
        else
        {
            var para = new Paragraph(this.document.DrawingDocument, this.document, 0, 0, 0, 0, 0);
            var selectedObjects, run, drawing, i;
            if(this.selection.groupSelection)
            {
                selectedObjects = this.selection.groupSelection.selectedObjects;
                var groupParaDrawing = this.selection.groupSelection.parent;
                //TODO: в случае инлановой группы для определения позиции нужно чтобы докуметн был рассчитан. Не понятно можно ли использовать рассчитаные позиции. Пока создаем инлайновые ParaDrawing.
                for(i = 0; i < selectedObjects.length; ++i)
                {
                    run =  new ParaRun(para, false);
                    selectedObjects[i].recalculate();
                    drawing = new ParaDrawing(0, 0, selectedObjects[i].copy(), this.document.DrawingDocument, this.document, null);
                    drawing.Set_DrawingType(groupParaDrawing.DrawingType);
                    drawing.GraphicObj.setParent(drawing);
                    if(drawing.GraphicObj.spPr && drawing.GraphicObj.spPr.xfrm && AscFormat.isRealNumber(drawing.GraphicObj.spPr.xfrm.offX) && AscFormat.isRealNumber(drawing.GraphicObj.spPr.xfrm.offY))
                    {
                        drawing.GraphicObj.spPr.xfrm.setOffX(0);
                        drawing.GraphicObj.spPr.xfrm.setOffY(0);
                    }
                    drawing.CheckWH();
                    if(groupParaDrawing.DrawingType === drawing_Anchor)
                    {
                        drawing.Set_Distance(groupParaDrawing.Distance.L, groupParaDrawing.Distance.T, groupParaDrawing.Distance.R, groupParaDrawing.Distance.B);
                        drawing.Set_WrappingType(groupParaDrawing.wrappingType);
                        drawing.Set_BehindDoc(groupParaDrawing.behindDoc);
                        drawing.Set_PositionH(groupParaDrawing.PositionH.RelativeFrom, groupParaDrawing.PositionH.Align, groupParaDrawing.PositionH.Value + selectedObjects[i].bounds.x, groupParaDrawing.PositionH.Percent);
                        drawing.Set_PositionV(groupParaDrawing.PositionV.RelativeFrom, groupParaDrawing.PositionV.Align, groupParaDrawing.PositionV.Value + selectedObjects[i].bounds.y, groupParaDrawing.PositionV.Percent);
                    }
                    run.Add_ToContent(run.State.ContentPos, drawing, true, false);
                    para.Internal_Content_Add(para.CurPos.ContentPos, run, true);
                }
            }
            else
            {
                selectedObjects = this.selectedObjects;
                for(i = 0; i < selectedObjects.length; ++i)
                {
                    run =  new ParaRun(para, false);
                    selectedObjects[i].recalculate();
                    drawing = new ParaDrawing(0, 0, selectedObjects[i].copy(), this.document.DrawingDocument, this.document, null);

                    drawing.Set_DrawingType(selectedObjects[i].parent.DrawingType);
                    if(selectedObjects[i].parent.Extent)
                    {
                        drawing.setExtent(selectedObjects[i].parent.Extent.W, selectedObjects[i].parent.Extent.H)
                    }
                    drawing.GraphicObj.setParent(drawing);
                    drawing.CheckWH();
					drawing.Set_ParaMath(selectedObjects[i].parent.ParaMath);

                    if(selectedObjects[i].parent.DrawingType === drawing_Anchor)
                    {
                        drawing.Set_Distance(selectedObjects[i].parent.Distance.L, selectedObjects[i].parent.Distance.T, selectedObjects[i].parent.Distance.R, selectedObjects[i].parent.Distance.B);
                        drawing.Set_WrappingType(selectedObjects[i].parent.wrappingType);
                        if(selectedObjects[i].parent.wrappingPolygon && drawing.wrappingPolygon)
                        {
                            drawing.wrappingPolygon.fromOther(selectedObjects[i].parent.wrappingPolygon);
                        }
                        drawing.Set_BehindDoc(selectedObjects[i].parent.behindDoc);
                        drawing.Set_RelativeHeight(selectedObjects[i].parent.RelativeHeight);
                        drawing.Set_PositionH(selectedObjects[i].parent.PositionH.RelativeFrom, selectedObjects[i].parent.PositionH.Align, selectedObjects[i].parent.PositionH.Value + selectedObjects[i].bounds.x, selectedObjects[i].parent.PositionH.Percent);
                        drawing.Set_PositionV(selectedObjects[i].parent.PositionV.RelativeFrom, selectedObjects[i].parent.PositionV.Align, selectedObjects[i].parent.PositionV.Value + selectedObjects[i].bounds.y, selectedObjects[i].parent.PositionV.Percent);
                    }
                    run.Add_ToContent(run.State.ContentPos, drawing, true, false);
                    para.Internal_Content_Add(para.CurPos.ContentPos, run, true);
                }
            }
            SelectedContent.Add( new CSelectedElement( para, true ) );
        }
    },

    getCurrentPageAbsolute: function()
    {
        if(this.curState.majorObject)
        {
            return this.curState.majorObject.selectStartPage;
        }
        var selection_arr = this.selectedObjects;
        if(selection_arr[0].length > 0)
        {
            return selection_arr[0].selectStartPage;
        }
        return 0;
    },

    createGraphicPage: function(pageIndex)
    {
        if(!isRealObject(this.graphicPages[pageIndex]))
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
    },

    resetDrawingArrays : function(pageIndex, docContent)
    {
        var hdr_ftr = docContent.Is_HdrFtr(true);
        if(!hdr_ftr)
        {
            if(isRealObject(this.graphicPages[pageIndex]))
            {
                this.graphicPages[pageIndex].resetDrawingArrays(docContent);
            }
        }
    },

    mergeHdrFtrPages: function(page1, page2, pageIndex)
    {
        if(!isRealObject(this.graphicPages[pageIndex]))
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        this.graphicPages[pageIndex].hdrFtrPage.clear();
        this.graphicPages[pageIndex].hdrFtrPage.mergePages(page1, page2);
    },



    onEndRecalculateDocument: function(pagesCount)
    {
        for(var i = 0; i < pagesCount; ++i)
        {
            if(!isRealObject(this.graphicPages[i]))
                this.graphicPages[i] = new CGraphicPage(i, this);
        }
        if(this.graphicPages.length > pagesCount)
        {
            for(i = pagesCount; i < this.graphicPages.length; ++i)
                delete  this.graphicPages[i];
        }
    },


    documentStatistics: function( CurPage, Statistics )
    {
        if(this.graphicPages[CurPage])
        {
            this.graphicPages[CurPage].documentStatistics(Statistics);
        }
    },

    setSelectionState: DrawingObjectsController.prototype.setSelectionState,

    getSelectionState: DrawingObjectsController.prototype.getSelectionState,
    applyPropsToChartSpace: DrawingObjectsController.prototype.applyPropsToChartSpace,

    documentUpdateSelectionState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.updateSelectionState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateSelectionState();
        }
        else if(this.selection.chartSelection)
        {
            this.selection.chartSelection.documentUpdateSelectionState();
        }
        else
        {
            this.drawingDocument.SelectClear();
            this.drawingDocument.TargetEnd();
        }
    },


    getMajorParaDrawing: function()
    {
        return this.selectedObjects.length >  0  ? this.selectedObjects[0].parent : null;
    },

    documentUpdateRulersState: function()
    {
        var content = this.getTargetDocContent();
        if(content && content.Parent && content.Parent.getObjectType && content.Parent.getObjectType() === AscDFH.historyitem_type_Shape)
        {
            content.Parent.documentUpdateRulersState();
        }
       //else if(this.selectedObjects.length > 0)
       //{
       //    var parent_paragraph = this.selectedObjects[0].parent.Get_ParentParagraph();
       //    if(parent_paragraph)
       //    {
       //        parent_paragraph.Document_UpdateRulersState();
       //    }
       //}
    },


    updateTextPr: function()
    {
        var TextPr = this.getParagraphTextPr();
        if(TextPr)
        {
            var theme = this.document.Get_Theme();
            if(theme && theme.themeElements && theme.themeElements.fontScheme)
            {
                if(TextPr.FontFamily)
                {
                    TextPr.FontFamily.Name =  theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                }
                if(TextPr.RFonts)
                {
                    if(TextPr.RFonts.Ascii)
                        TextPr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                    if(TextPr.RFonts.EastAsia)
                        TextPr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                    if(TextPr.RFonts.HAnsi)
                        TextPr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                    if(TextPr.RFonts.CS)
                        TextPr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                }
            }
            editor.UpdateTextPr(TextPr);
        }
    },

    updateParentParagraphParaPr : function()
    {
        var majorParaDrawing = this.getMajorParaDrawing();
        if(majorParaDrawing)
        {
            var parent_para = this.selectedObjects[0].parent.Get_ParentParagraph(), ParaPr;
            if(parent_para)
            {
                ParaPr = parent_para.Get_CompiledPr2(true).ParaPr;
                if(ParaPr)
                {


                    var NumType    = -1;
                    var NumSubType = -1;
                    if ( !(null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId || "0" === ParaPr.NumPr.NumId) )
                    {
                        var Numb = this.document.Numbering.Get_AbstractNum( ParaPr.NumPr.NumId );

                        if ( undefined !== Numb && undefined !== Numb.Lvl[ParaPr.NumPr.Lvl] )
                        {
                            var Lvl = Numb.Lvl[ParaPr.NumPr.Lvl];
                            var NumFormat = Lvl.Format;
                            var NumText   = Lvl.LvlText;

                            if ( numbering_numfmt_Bullet === NumFormat )
                            {
                                NumType    = 0;
                                NumSubType = 0;

                                var TextLen = NumText.length;
                                if ( 1 === TextLen && numbering_lvltext_Text === NumText[0].Type )
                                {
                                    var NumVal = NumText[0].Value.charCodeAt(0);

                                    if ( 0x00B7 === NumVal )
                                        NumSubType = 1;
                                    else if ( 0x006F === NumVal )
                                        NumSubType = 2;
                                    else if ( 0x00A7 === NumVal )
                                        NumSubType = 3;
                                    else if ( 0x0076 === NumVal )
                                        NumSubType = 4;
                                    else if ( 0x00D8 === NumVal )
                                        NumSubType = 5;
                                    else if ( 0x00FC === NumVal )
                                        NumSubType = 6;
                                    else if ( 0x00A8 === NumVal )
                                        NumSubType = 7;
                                }
                            }
                            else
                            {
                                NumType    = 1;
                                NumSubType = 0;

                                var TextLen = NumText.length;
                                if ( 2 === TextLen && numbering_lvltext_Num === NumText[0].Type && numbering_lvltext_Text === NumText[1].Type )
                                {
                                    var NumVal2 = NumText[1].Value;

                                    if ( numbering_numfmt_Decimal === NumFormat )
                                    {
                                        if ( "." === NumVal2 )
                                            NumSubType = 1;
                                        else if ( ")" === NumVal2 )
                                            NumSubType = 2;
                                    }
                                    else if ( numbering_numfmt_UpperRoman === NumFormat )
                                    {
                                        if ( "." === NumVal2 )
                                            NumSubType = 3;
                                    }
                                    else if ( numbering_numfmt_UpperLetter === NumFormat )
                                    {
                                        if ( "." === NumVal2 )
                                            NumSubType = 4;
                                    }
                                    else if ( numbering_numfmt_LowerLetter === NumFormat )
                                    {
                                        if ( ")" === NumVal2 )
                                            NumSubType = 5;
                                        else if ( "." === NumVal2 )
                                            NumSubType = 6;
                                    }
                                    else if ( numbering_numfmt_LowerRoman === NumFormat )
                                    {
                                        if ( "." === NumVal2 )
                                            NumSubType = 7;
                                    }
                                }
                            }
                        }
                    }

                    ParaPr.ListType = { Type : NumType, SubType : NumSubType };

                    editor.sync_ParaSpacingLine( ParaPr.Spacing );
                    editor.Update_ParaInd(ParaPr.Ind);
                    editor.sync_PrAlignCallBack(ParaPr.Jc);
                    editor.sync_ParaStyleName(ParaPr.StyleName);
                    editor.sync_ListType(ParaPr.ListType);
                }
            }
        }
    },

    documentUpdateInterfaceState: function()
    {
        if(this.selection.textSelection)
        {
            this.selection.textSelection.getDocContent().Document_UpdateInterfaceState();
        }
        else if(this.selection.groupSelection)
        {
            this.selection.groupSelection.documentUpdateInterfaceState();
        }
        else
        {
            var para_pr = DrawingObjectsController.prototype.getParagraphParaPr.call(this);
            if(!para_pr)
            {
                //if(this.selectedObjects[0] && this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline())
                //{
                //    var parent_para = this.selectedObjects[0].parent.Get_ParentParagraph();
                //    if(parent_para)
                //        para_pr = parent_para.Get_CompiledPr2(true).ParaPr;
                //}
            }
            if(para_pr)
            {
                var TextPr = this.getParagraphTextPr();
                var theme = this.document.Get_Theme();
                if(theme && theme.themeElements && theme.themeElements.fontScheme)
                {
                    if(TextPr.FontFamily)
                    {
                        TextPr.FontFamily.Name =  theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                    }
                    if(TextPr.RFonts)
                    {
                        if(TextPr.RFonts.Ascii)
                            TextPr.RFonts.Ascii.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                        if(TextPr.RFonts.EastAsia)
                            TextPr.RFonts.EastAsia.Name  = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                        if(TextPr.RFonts.HAnsi)
                            TextPr.RFonts.HAnsi.Name     = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                        if(TextPr.RFonts.CS)
                            TextPr.RFonts.CS.Name        = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                    }
                }
                editor.UpdateParagraphProp(para_pr);
                editor.UpdateTextPr(TextPr);
            }
        }
    },

    resetInterfaceTextPr: function()
    {
       // var oTextPr =  new CTextPr();
       // oTextPr.Set_FromObject(
       //     {
       //         Bold: false,
       //         Italic: false,
       //         Underline: false,
       //         Strikeout: false,
       //         FontFamily:{
       //             Name : "", Index : -1
       //         },
       //         FontSize: null,
       //         VertAlign: null,
       //         HighLight: highlight_None,
       //         Spacing: null,
       //         DStrikeout: false,
       //         Caps: null,
       //         SmallCaps: null,
       //         Position: null,
       //         Lang: null
       //     }
       // );
       // editor.UpdateTextPr(oTextPr);
        editor.Update_ParaTab(Default_Tab_Stop, new CParaTabs());
        editor.sync_ParaSpacingLine( new CParaSpacing() );
        editor.Update_ParaInd(new CParaInd());
        editor.sync_PrAlignCallBack(null);
        editor.sync_ParaStyleName(null);
        editor.sync_ListType({ Type : -1, SubType : -1 });
    },

    isNeedUpdateRulers: function()
    {
        if(this.selectedObjects.length === 1 && this.selectedObjects[0].getDocContent && this.selectedObjects[0].getDocContent())
        {
            return true;
        }
        return false;
    },

    documentCreateFontCharMap: function( FontCharMap )
    {
        //ToDo
        return;
    },

    documentCreateFontMap: function( FontCharMap )
    {
        //TODO
        return;
    },

    tableCheckSplit: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckSplit();
    },

    tableCheckMerge: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckMerge();
    },

    tableSelect: function( Type )
    {
        var content = this.getTargetDocContent();
        return content && content.Table_Select(Type);
    },

    tableRemoveTable: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveTable();
    },

    tableSplitCell: function(Cols, Rows)
    {
        var content = this.getTargetDocContent();
        return content && content.Table_SplitCell(Cols, Rows);
    },

    tableMergeCells: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_MergeCells();
    },

    tableRemoveCol: function()
    {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveCol();
    },


    tableAddCol: function(bBefore)
    {
        var content = this.getTargetDocContent();
        return content && content.Table_AddCol(bBefore);
    },

    tableRemoveRow: function()
    {

        var content = this.getTargetDocContent();
        return content && content.Table_RemoveRow();
    },

    tableAddRow: function(bBefore)
    {

        var content = this.getTargetDocContent();
        return content && content.Table_AddRow(bBefore);
    },


    documentSearch: function( CurPage, String, search_Common )
    {
        if(this.graphicPages[CurPage])
        {
            this.graphicPages[CurPage].documentSearch(String, search_Common);
            CGraphicPage.prototype.documentSearch.call(this.getHdrFtrObjectsByPageIndex(CurPage), String, search_Common);
        }
    },

    getSelectedElementsInfo: function( Info )
    {

        if(this.selectedObjects.length === 0)
            Info.Set_Drawing(-1);

        var content = this.getTargetDocContent();
        if(content)
        {
            Info.Set_Drawing(selected_DrawingObjectText);
            content.Get_SelectedElementsInfo(Info);
        }
        else
        {
            Info.Set_Drawing(selected_DrawingObject);
        }
        return Info;
    },

    getAllObjectsOnPage: function(pageIndex, bHdrFtr)
    {
        var graphic_page;
        if(bHdrFtr)
        {
            graphic_page = this.getHdrFtrObjectsByPageIndex(pageIndex);
        }
        else
        {
            graphic_page = this.graphicPages[pageIndex];
        }
        return graphic_page? graphic_page.behindDocObjects.concat(graphic_page.wrappingObjects.concat(graphic_page.inlineObjects.concat(graphic_page.beforeTextObjects))) : [];
    },

    selectNextObject: DrawingObjectsController.prototype.selectNextObject,


    getCurrentParagraph: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_CurrentParagraph();
        }
        else
        {
            var ParaDrawing = this.getMajorParaDrawing();
            if (ParaDrawing && ParaDrawing.Parent instanceof Paragraph)
                return ParaDrawing.Parent;

            return null;
        }
    },

    getSelectedText: function(bClearText, oPr)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_SelectedText(bClearText, oPr);
        }
        else
        {
            return "";
        }
    },

    getCurPosXY: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Get_CurPosXY();
        }
        else
        {
            if(this.selectedObjects.length === 1)
            {
                return {X:this.selectedObjects[0].parent.X, Y: this.selectedObjects[0].parent.Y};
            }
            return {X: 0, Y: 0};
        }
    },

    isTextSelectionUse: function()
    {

        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Is_TextSelectionUse();
        }
        else
        {
            return false;
        }
    },


    isSelectionUse: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            return content.Is_TextSelectionUse();
        }
        else
        {
            return this.selectedObjects.length > 0;
        }
    },

    paragraphFormatPaste: function( CopyTextPr, CopyParaPr, Bool )
    {
        var content = this.getTargetDocContent();
        content && content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool );
    },

    getHdrFtrObjectsByPageIndex: function(pageIndex)
    {
        if(this.graphicPages[pageIndex])
        {
            return this.graphicPages[pageIndex].hdrFtrPage;
        }
        return null;
    },

    getNearestPos: function(x, y, pageIndex, drawing)
    {
        if(drawing && drawing.GraphicObj)
        {
            if(drawing.GraphicObj.getObjectType() !== AscDFH.historyitem_type_ImageShape && drawing.GraphicObj.getObjectType() !== AscDFH.historyitem_type_OleObject && drawing.GraphicObj.getObjectType() !== AscDFH.historyitem_type_ChartSpace)
                return null;
        }
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        var cursor_type = this.nullState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        var object;
        if(cursor_type )
        {
            object = g_oTableId.Get_ById(cursor_type.objectId);
            if(object)
            {
                if(cursor_type.cursorType === "text")
                {
                    if(object.getNearestPos)
                    {
                        return object.getNearestPos(x, y, pageIndex);
                    }
                }
                else
                {
                    if((object.getObjectType() === AscDFH.historyitem_type_ImageShape || object.getObjectType() === AscDFH.historyitem_type_OleObject) && object.parent)
                    {
                        var oShape = object.parent.isShapeChild(true);
                        if(oShape)
                        {
                            return oShape.getNearestPos(x, y, pageIndex);
                        }
                    }
                }
            }
        }
        return null;
    },

    selectionCheck: function( X, Y, Page_Abs, NearPos )
    {
        var text_object = AscFormat.getTargetTextObject(this);
        if(text_object)
            return text_object.selectionCheck( X, Y, Page_Abs, NearPos );
        return false;
    },

    checkTextObject: function(x, y, pageIndex)
    {
        var text_object = AscFormat.getTargetTextObject(this);
        if(text_object && text_object.hitInTextRect)
        {
            if(text_object.selectStartPage === pageIndex)
            {
                if(text_object.hitInTextRect(x, y))
                {
                    return true;
                }
            }
        }
        return false;
    },

    getParagraphParaPrCopy: function()
    {
        return this.getParagraphParaPr();
    },

    getParagraphTextPrCopy: function()
    {
        return this.getParagraphTextPr();
    },

    getParagraphParaPr: function()
    {
        var ret =  DrawingObjectsController.prototype.getParagraphParaPr.call(this);

        if(ret && ret.Shd && ret.Shd.Unifill)
        {
            ret.Shd.Unifill.check(this.document.theme, this.document.Get_ColorMap());
        }
        return ret ? ret : new CParaPr();
    },

    getColorMap: function()
    {
        return this.document.Get_ColorMap();
    },


    Get_StyleFromFormatting: function()
    {
        var oContent = this.getTargetDocContent();
        if(oContent)
        {
            var oStyleFormatting = oContent.Get_StyleFromFormatting();
            var oTextPr = oStyleFormatting.TextPr;
            if(oTextPr.TextFill)
            {
                oTextPr.TextFill = undefined;
            }
            if(oTextPr.TextOutline)
            {
                oTextPr.TextOutline = undefined;
            }
            return oStyleFormatting;
        }
        return null;
    },

    getParagraphTextPr: function()
    {
        var ret =  DrawingObjectsController.prototype.getParagraphTextPr.call(this);
        if(ret)
        {
            var ret_;
            if(ret.Unifill && ret.Unifill.canConvertPPTXModsToWord())
            {
                ret_ = ret.Copy();
                ret_.Unifill.convertToWordMods();
            }
            else
            {
                ret_ = ret;
            }
            if(ret_.Unifill)
            {
                ret_.Unifill.check(this.document.theme, this.document.Get_ColorMap());
            }
            return ret_;
        }
        else
        {
            return new CTextPr();
        }
    },

    isSelectedText: function()
    {
        return isRealObject(/*this.selection.textSelection || this.selection.groupSelection && this.selection.groupSelection.selection.textSelection*/this.getTargetDocContent());
    },

    selectAll: DrawingObjectsController.prototype.selectAll,

    drawSelect: function(pageIndex)
    {
        DrawingObjectsController.prototype.drawSelect.call(this, pageIndex, this.drawingDocument);
    },

    drawBehindDoc: function(pageIndex, graphics)
    {
        if(this.graphicPages[pageIndex])
        {
            graphics.shapePageIndex = pageIndex;
            this.graphicPages[pageIndex].drawBehindDoc(graphics);
            graphics.shapePageIndex = null;
        }
    },

    drawWrappingObjects: function(pageIndex, graphics)
    {
        if(this.graphicPages[pageIndex])
        {
            graphics.shapePageIndex = pageIndex;
            this.graphicPages[pageIndex].drawWrappingObjects(graphics);
            graphics.shapePageIndex = null;
        }
    },

    drawWrappingObjectsInContent: function(pageIndex, graphics, content)
    {
        var page;
        if(content.Is_HdrFtr())
        {
            page = this.getHdrFtrObjectsByPageIndex(pageIndex);
        }
        else
        {
            page = this.graphicPages[pageIndex];
        }
        page && page.drawWrappingObjectsByContent(graphics, content)
    },


    endTrackShape: function()
    {

    },

    drawBeforeObjects: function(pageIndex, graphics)
    {
        if(this.graphicPages[pageIndex])
        {
            graphics.shapePageIndex = pageIndex;
            this.graphicPages[pageIndex].drawBeforeObjects(graphics);
            graphics.shapePageIndex = null;
        }
    },

    drawBehindDocHdrFtr: function(pageIndex, graphics)
    {

        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);

        if(hdr_footer_objects != null)
        {
            var behind_doc = hdr_footer_objects.behindDocObjects;
            for(var i = 0; i < behind_doc.length; ++i)
            {
                behind_doc[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },

    drawWrappingObjectsHdrFtr: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if(hdr_footer_objects != null)
        {
            var wrap_arr = hdr_footer_objects.wrappingObjects;
            for(var i = 0; i < wrap_arr.length; ++i)
            {
                wrap_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },

    drawBeforeObjectsHdrFtr: function(pageIndex, graphics)
    {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if(hdr_footer_objects != null)
        {
            var bef_arr = hdr_footer_objects.beforeTextObjects;
            for(var i = 0; i < bef_arr.length; ++i)
            {
                bef_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },

    setStartTrackPos: function(x, y, pageIndex)
    {
        this.startTrackPos.x = x;
        this.startTrackPos.y = y;
        this.startTrackPos.pageIndex = pageIndex;
    },

    needUpdateOverlay: function()
    {
        return this.arrTrackObjects.length > 0 || this.curState.InlinePos;
    },

    changeCurrentState: function(state)
    {
        this.curState = state;
    },

    canGroup: function(bGetArray)
    {
        var selection_array = this.selectedObjects;
        if(selection_array.length < 2)
            return bGetArray ? [] :false;
        if(!selection_array[0].canGroup())
            return bGetArray ? [] : false;
        var first_page_index = selection_array[0].parent.pageIndex;
        for(var index = 1; index < selection_array.length; ++index)
        {
            if(!selection_array[index].canGroup())
                return  bGetArray ? [] : false;
            if(first_page_index !== selection_array[index].parent.pageIndex)
                return bGetArray ? [] : false;
        }
        if(bGetArray)
        {
            var ret = selection_array.concat([]);
            ret.sort(ComparisonByZIndexSimpleParent);
            return ret;
        }
        return true;
    },

    canUnGroup: DrawingObjectsController.prototype.canUnGroup,
    getBoundsForGroup: DrawingObjectsController.prototype.getBoundsForGroup,


    getArrayForGrouping: function()
    {
        return this.canGroup(true);
    },


    startSelectionFromCurPos: function()
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Start_SelectionFromCurPos();
        }
    },


    Check_TrackObjects: function()
    {
        return this.arrTrackObjects.length > 0;
    },

    getGroup: DrawingObjectsController.prototype.getGroup,

    addObjectOnPage: function(pageIndex, object)
    {
        var hdr_ftr = object.parent.DocumentContent.Is_HdrFtr(true);
        if(!hdr_ftr)
        {
            if(!this.graphicPages[pageIndex])
            {
                this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
                for(var z = 0; z < pageIndex; ++z)
                {
                    if(!this.graphicPages[z])
                        this.graphicPages[z] = new CGraphicPage(z, this);
                }
            }
            this.graphicPages[pageIndex].addObject(object);
        }
        else
        {
            //hdr_ftr.DrawingPage.addObject(object);
        }
    },

    cursorGetPos: function()
    {
        var text_object;
        if(this.selection.textObject)
        {
            text_object = this.selection.textObject;
        }
        else if(this.selection.groupSelection && this.selection.groupSelection.textObject)
        {
            text_object = this.selection.groupSelection.textObject;
        }
        if(text_object)
            return text_object.cursorGetPos();

        return {X: 0, Y: 0};
    },

    Get_SelectionBounds: function()
    {
        var oTargetDocContent = this.getTargetDocContent(false, true);
        if(isRealObject(oTargetDocContent))
        {
            return oTargetDocContent.Get_SelectionBounds();
        }
        return null;
    },

    checkCommonBounds: function(arrDrawings)
    {
        var l, t, r,b;
        var x_arr_min = [], y_arr_min = [];
        var x_arr_max = [], y_arr_max = [];
        for(var i = 0; i < arrDrawings.length; ++i)
        {
            var rot = AscFormat.normalizeRotate(AscFormat.isRealNumber(arrDrawings[i].rot) ? arrDrawings[i].rot : 0);
            if (AscFormat.checkNormalRotate(rot))
            {
                l = arrDrawings[i].posX;
                r = arrDrawings[i].extX + arrDrawings[i].posX;
                t = arrDrawings[i].posY;
                b = arrDrawings[i].extY + arrDrawings[i].posY;
            }
            else
            {
                l = arrDrawings[i].posX + arrDrawings[i].extX/2 - arrDrawings[i].extY/2;
                r = arrDrawings[i].posX + arrDrawings[i].extX/2 + arrDrawings[i].extY/2;
                t = arrDrawings[i].posY + arrDrawings[i].extY/2 - arrDrawings[i].extX/2;
                b = arrDrawings[i].extY + arrDrawings[i].extY/2 + arrDrawings[i].extX/2;
            }

            x_arr_max.push(r);
            x_arr_min.push(l);
            y_arr_max.push(b);
            y_arr_min.push(t);
        }
        return {minX: Math.min.apply(Math, x_arr_min), maxX: Math.max.apply(Math, x_arr_max), minY: Math.min.apply(Math, y_arr_min), maxY: Math.max.apply(Math, y_arr_max)};
    },

    groupSelectedObjects: function()
    {
        var objects_for_grouping = this.canGroup(true);
        if(objects_for_grouping.length < 2)
            return;
        var bTrackRevisions = false;
        if(this.document.TrackRevisions){
            bTrackRevisions = true;
            this.document.TrackRevisions = false;
        }
        var i;
        var common_bounds = this.checkCommonBounds(objects_for_grouping);
        var para_drawing = new ParaDrawing(common_bounds.maxX - common_bounds.minX, common_bounds.maxY - common_bounds.minY, null, this.drawingDocument, null, null);
        para_drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        para_drawing.Set_DrawingType(drawing_Anchor);
        for(i = 0; i < objects_for_grouping.length; ++i)
        {
            if(objects_for_grouping[i].checkExtentsByDocContent && objects_for_grouping[i].checkExtentsByDocContent(true))
            {
                objects_for_grouping[i].updatePosition(objects_for_grouping[i].posX, objects_for_grouping[i].posY)
            }
        }
        var group = this.getGroup(objects_for_grouping);
        group.spPr.xfrm.setOffX(0);
        group.spPr.xfrm.setOffY(0);
        group.setParent(para_drawing);
        para_drawing.Set_GraphicObject(group);

        var page_index = objects_for_grouping[0].parent.pageIndex;
        var first_paragraph = objects_for_grouping[0].parent.Get_ParentParagraph();
        var nearest_pos = this.document.Get_NearestPos(objects_for_grouping[0].parent.pageIndex, common_bounds.minX, common_bounds.minY, true, para_drawing);

        nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
        for(i = 0; i < objects_for_grouping.length; ++i)
        {
            objects_for_grouping[i].parent.Remove_FromDocument(false);
        }
        para_drawing.Set_XYForAdd( common_bounds.minX,  common_bounds.minY, nearest_pos, objects_for_grouping[0].parent.pageIndex);
        para_drawing.Set_Props(new asc_CImgProperty(
            {
                PositionH:
                {
                    RelativeFrom: Asc.c_oAscRelativeFromH.Page,
                    UseAlign : false,
                    Align    : undefined,
                    Value    : common_bounds.minX
                },

                PositionV:
                {
                    RelativeFrom: Asc.c_oAscRelativeFromV.Page,
                    UseAlign    : false,
                    Align       : undefined,
                    Value       : common_bounds.minY
                }
            }));
        para_drawing.Add_ToDocument2(first_paragraph);
        para_drawing.Parent = first_paragraph;
        this.addGraphicObject(para_drawing);
        this.resetSelection();
        this.selectObject(group, page_index);
        this.document.Recalculate();
        if(bTrackRevisions){
            this.document.TrackRevisions = true;
        }
    },

    unGroupSelectedObjects: function()
    {
        if(!(editor.isViewMode === false))
            return;
        var bTrackRevisions = false;
        if(this.document.TrackRevisions){
            bTrackRevisions = true;
            this.document.TrackRevisions = false;
        }
        var ungroup_arr = this.canUnGroup(true);
        if(ungroup_arr.length > 0)
        {
            this.resetSelection();
            var i, j, nearest_pos, cur_group, sp_tree, sp, parent_paragraph, page_num;
            var a_objects = [];
            for(i = 0; i < ungroup_arr.length; ++i)
            {
                cur_group = ungroup_arr[i];
                parent_paragraph = cur_group.parent.Get_ParentParagraph();
                page_num = cur_group.selectStartPage;
                cur_group.normalize();
                sp_tree = cur_group.spTree;
                for(j = 0; j < sp_tree.length; ++j)
                {
                    sp = sp_tree[j];
                    var drawing = new ParaDrawing(0, 0, sp_tree[j], this.drawingDocument, null, null);

                    var xc, yc, hc = sp.extX/2, vc = sp.extY/2;
                    xc = sp.transform.TransformPointX(hc, vc);
                    yc = sp.transform.TransformPointY(hc, vc);

                    drawing.Set_GraphicObject(sp);
                    sp.setParent(drawing);
                    drawing.Set_DrawingType(drawing_Anchor);
                    drawing.Set_WrappingType(cur_group.parent.wrappingType);
                    drawing.CheckWH();
                    sp.spPr.xfrm.setRot(AscFormat.normalizeRotate(sp.rot + cur_group.rot));
                    sp.spPr.xfrm.setOffX(0);
                    sp.spPr.xfrm.setOffY(0);
                    sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                    sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                    sp.setGroup(null);
                    if(sp.spPr.Fill && sp.spPr.Fill.fill && sp.spPr.Fill.fill.type === Asc.c_oAscFill.FILL_TYPE_GRP && cur_group.spPr && cur_group.spPr.Fill)
                    {
                        sp.spPr.setFill(cur_group.spPr.Fill.createDuplicate());
                    }

                    nearest_pos = this.document.Get_NearestPos(page_num, sp.bounds.x + sp.posX, sp.bounds.y + sp.posY, true, drawing);
                    nearest_pos.Paragraph.Check_NearestPos(nearest_pos);

                    drawing.Set_XYForAdd(xc - hc, yc - vc, nearest_pos, page_num);
                    a_objects.push({drawing: drawing, par: parent_paragraph, posX: xc - hc, posY: yc - vc});
                    this.selectObject(sp, page_num);
                }
                cur_group.parent.Remove_FromDocument(false);
            }
            for(i = 0; i < a_objects.length; ++i)
            {
                a_objects[i].drawing.Set_Props(new asc_CImgProperty(
                    {
                        PositionH:
                        {
                            RelativeFrom: Asc.c_oAscRelativeFromH.Page,
                            UseAlign : false,
                            Align    : undefined,
                            Value    : a_objects[i].posX
                        },

                        PositionV:
                        {
                            RelativeFrom: Asc.c_oAscRelativeFromV.Page,
                            UseAlign    : false,
                            Align       : undefined,
                            Value       : a_objects[i].posY
                        }
                    }));
                a_objects[i].drawing.Add_ToDocument2(a_objects[i].par);
            }
            this.document.Recalculate();
        }
        if(bTrackRevisions){
            this.document.TrackRevisions = true;
        }
    },

    setTableProps: function(Props)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Set_TableProps(Props);
        }
    },


    selectionIsEmpty: function(bCheckHidden)
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Selection_IsEmpty(bCheckHidden);
        }
        return false;
    },

    isViewMod: function()
    {
        return editor.isViewMode;
    },

    moveSelectedObjects: DrawingObjectsController.prototype.moveSelectedObjects,

    cursorMoveLeft: DrawingObjectsController.prototype.cursorMoveLeft,

    cursorMoveRight: DrawingObjectsController.prototype.cursorMoveRight,


    cursorMoveUp: DrawingObjectsController.prototype.cursorMoveUp,

    cursorMoveDown: DrawingObjectsController.prototype.cursorMoveDown,

    cursorMoveEndOfLine: DrawingObjectsController.prototype.cursorMoveEndOfLine,


    cursorMoveStartOfLine: DrawingObjectsController.prototype.cursorMoveStartOfLine,

    cursorMoveAt: DrawingObjectsController.prototype.cursorMoveAt,

    cursorMoveToCell: function(bNext )
    {
        var content = this.getTargetDocContent();
        if(content)
        {
            content.Cursor_MoveToCell(bNext);
        }
    },

    updateAnchorPos: function()
    {
        //TODO
    },

    resetSelection: DrawingObjectsController.prototype.resetSelection,

    resetSelection2: function()
    {
        var sel_arr = this.selectedObjects;
        if(sel_arr.length > 0)
        {
            var top_obj = sel_arr[0];
            for(var i = 1; i < sel_arr.length; ++i)
            {
                var cur_obj = sel_arr[i];
                if(cur_obj.selectStartPage < top_obj.selectStartPage)
                {
                    top_obj = cur_obj;
                }
                else if(cur_obj.selectStartPage === top_obj.selectStartPage)
                {
                    if(cur_obj.parent.Get_ParentParagraph().Y < top_obj.parent.Get_ParentParagraph().Y)
                        top_obj = cur_obj;
                }
            }
            this.resetSelection();
            top_obj.parent.GoTo_Text();
        }
    },

    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,

    remove: function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        var content = this.getTargetDocContent(true);
        if(content)
        {
            content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            var oTargetTextObject = AscFormat.getTargetTextObject(this);
            oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
            this.document.Recalculate();
        }
        else if(this.selectedObjects.length > 0)
        {
            if(this.selection.groupSelection)
            {
                if(this.selection.groupSelection.selection.chartSelection)
                {
                    this.selection.groupSelection.selection.chartSelection.remove();
                    this.document.Recalculate();
                }
                else
                {
                    var group_map = {}, group_arr = [], i, cur_group, sp, xc, yc, hc, vc, rel_xc, rel_yc, j;
                    for(i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i)
                    {
                        this.selection.groupSelection.selectedObjects[i].group.removeFromSpTree(this.selection.groupSelection.selectedObjects[i].Get_Id());
                        group_map[this.selection.groupSelection.selectedObjects[i].group.Get_Id()+""] = this.selection.groupSelection.selectedObjects[i].group;
                    }
                    group_map[this.selection.groupSelection.Get_Id()] = this.selection.groupSelection;
                    for(var key in group_map)
                    {
                        if(group_map.hasOwnProperty(key))
                            group_arr.push(group_map[key]);
                    }
                    group_arr.sort(AscFormat.CompareGroups);
                    for(i = 0; i < group_arr.length; ++i)
                    {
                        cur_group = group_arr[i];
                        if(isRealObject(cur_group.group))
                        {
                            if(cur_group.spTree.length === 0)
                            {
                                cur_group.group.removeFromSpTree(cur_group.Get_Id());
                            }
                            else if(cur_group.spTree.length == 1)
                            {
                                sp = cur_group.spTree[0];
                                hc = sp.spPr.xfrm.extX/2;
                                vc = sp.spPr.xfrm.extY/2;
                                xc = sp.transform.TransformPointX(hc, vc);
                                yc = sp.transform.TransformPointY(hc, vc);
                                rel_xc = cur_group.group.invertTransform.TransformPointX(xc, yc);
                                rel_yc = cur_group.group.invertTransform.TransformPointY(xc, yc);
                                sp.spPr.xfrm.setOffX(rel_xc - hc);
                                sp.spPr.xfrm.setOffY(rel_yc - vc);
                                sp.spPr.xfrm.setRot(AscFormat.normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(cur_group.group);
                                for(j = 0; j < cur_group.group.spTree.length; ++j)
                                {
                                    if(cur_group.group.spTree[j] === cur_group)
                                    {
                                        cur_group.group.addToSpTree(j, sp);
                                        cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                    }
                                }
                            }
                        }
                        else
                        {
                            var para_drawing = cur_group.parent;
                            if(cur_group.spTree.length === 0)
                            {
                                this.resetInternalSelection();
                                this.remove();
                                return;
                            }
                            else if(cur_group.spTree.length === 1)
                            {
                                sp = cur_group.spTree[0];
                                sp.spPr.xfrm.setOffX(0);
                                sp.spPr.xfrm.setOffY(0);
                                sp.spPr.xfrm.setRot(AscFormat.normalizeRotate(cur_group.rot + sp.rot));
                                sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                sp.setGroup(null);
                                para_drawing.Set_GraphicObject(sp);
                                sp.setParent(para_drawing);
                                this.resetSelection();
                                this.selectObject(sp, cur_group.selectStartPage);
                                new_x = sp.transform.tx;
                                new_y = sp.transform.ty;
                                para_drawing.CheckWH();
                                if(!para_drawing.Is_Inline())
                                {
                                    para_drawing.Set_XY(new_x, new_y, para_drawing.Get_ParentParagraph(), para_drawing.GraphicObj.selectStartPage, true);
                                }
                                this.document.Recalculate();
                                return;
                            }
                            else
                            {
                                this.resetInternalSelection();
                                var new_x, new_y;
                               // var pos = cur_group.getBoundsPos();
                                cur_group.updateCoordinatesAfterInternalResize();

                                new_x = cur_group.x + cur_group.spPr.xfrm.offX;
                                new_y = cur_group.y + cur_group.spPr.xfrm.offY;

                                cur_group.spPr.xfrm.setOffX(0);
                                cur_group.spPr.xfrm.setOffY(0);

                                para_drawing.Set_XY(new_x, new_y, cur_group.parent.Get_ParentParagraph(), cur_group.selectStartPage, false);//X, Y, Paragraph, PageNum, bResetAlign
                                this.document.Recalculate();
                                break;
                            }

                        }
                    }
                }
            }
            else if(this.selection.chartSelection)
            {
                this.selection.chartSelection.remove();
                this.document.Recalculate();

            }
            else
            {
                var first_selected = this.selectedObjects[0];
                var arr_drawings_ = [];
                for(var i = 0; i < this.selectedObjects.length; ++i)
                {
                    this.selectedObjects[i].parent.Remove_FromDocument(false);
                    arr_drawings_.push(this.selectedObjects[i].parent);
                }
                this.resetSelection();
                first_selected.parent.GoTo_Text();
                this.document.Recalculate();
            }
        }
    },

    addGraphicObject: function(paraDrawing)
    {
        this.drawingObjects.push(paraDrawing);
    },

    getZIndex: function()
    {
        this.maximalGraphicObjectZIndex+=1024;
        return this.maximalGraphicObjectZIndex;
    },

    isPointInDrawingObjects: function(x, y, pageIndex, bSelected, bNoText)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(isRealObject(ret))
        {
            if(bNoText === true)
            {
                if(ret.cursorType === "text")
                {
                    return -1;
                }
            }
            var object = g_oTableId.Get_ById(ret.objectId);
            if(isRealObject(object) && (!(bSelected === true) || bSelected && object.selected) )
            {
                if(object.group)
                    object = object.getMainGroup();

                if(isRealObject(object) && isRealObject(object.parent))
                {
                    return ret.bMarker ?  DRAWING_ARRAY_TYPE_BEFORE : object.parent.getDrawingArrayType();
                }
            }
            else
            {
                if(!(bSelected === true))
                {
                    return DRAWING_ARRAY_TYPE_BEFORE;
                }
                return -1;
            }
        }
        return -1;
    },

    isPointInDrawingObjects2: function(x, y, pageIndex, bSelected)
    {
        return this.isPointInDrawingObjects(x, y, pageIndex, bSelected, true) > -1;
    },


    pointInObjInDocContent: function( docContent, X, Y, pageIndex )
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, X, Y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            var object = g_oTableId.Get_ById(ret.objectId);
            if(object)
            {
                var parent_drawing;
                if(!object.group && object.parent)
                {
                    parent_drawing = object;
                }
                else if(object.group)
                {
                    parent_drawing = object.group;
                    while(parent_drawing.group)
                        parent_drawing = parent_drawing.group;
                }
                if(parent_drawing &&  parent_drawing.parent)
                    return docContent === parent_drawing.parent.DocumentContent.Is_TopDocument(true);
            }
        }
        return false;
    },

    pointInSelectedObject: function(x, y, pageIndex)
    {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if(ret)
        {
            var object = g_oTableId.Get_ById(ret.objectId);
            if(object && object.selected /*&& object.selectStartPage === pageIndex*/)
                return true;
        }
        return false;
    },


    Save_DocumentStateBeforeLoadChanges: function(oState)
    {
        var oTargetDocContent = this.getTargetDocContent(undefined, true);
        if(oTargetDocContent)
        {
            oState.Pos      = oTargetDocContent.Get_ContentPosition(false, false, undefined);
            oState.StartPos = oTargetDocContent.Get_ContentPosition(true, true, undefined);
            oState.EndPos   = oTargetDocContent.Get_ContentPosition(true, false, undefined);
            oState.DrawingSelection = oTargetDocContent.Selection.Use;
        }
        oState.DrawingsSelectionState = this.getSelectionState()[0];
        var oPos = this.getLeftTopSelectedObject2();
        oState.X = oPos.X;
        oState.Y = oPos.Y;
    },

    Load_DocumentStateAfterLoadChanges: function(oState)
    {
        this.clearPreTrackObjects();
        this.clearTrackObjects();
        this.resetSelection();
        this.changeCurrentState(new AscFormat.NullState(this));
        return this.loadDocumentStateAfterLoadChanges(oState);
    },

    loadDocumentStateAfterLoadChanges:  DrawingObjectsController.prototype.loadDocumentStateAfterLoadChanges,
    checkTrackDrawings:  DrawingObjectsController.prototype.checkTrackDrawings,

    canChangeWrapPolygon: function()
    {
        return !this.selection.groupSelection && !this.selection.textSelection && !this.selection.chartSelection
            && this.selectedObjects.length === 1 && this.selectedObjects[0].canChangeWrapPolygon && this.selectedObjects[0].canChangeWrapPolygon() && !this.selectedObjects[0].parent.Is_Inline();
    },

    startChangeWrapPolygon: function()
    {
        if(this.canChangeWrapPolygon())
        {
            if(this.selectedObjects[0].parent.wrappingType !== WRAPPING_TYPE_THROUGH && this.selectedObjects[0].parent.wrappingType !== WRAPPING_TYPE_TIGHT)
            {
                if(false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {Type : AscCommon.changestype_2_Element_and_Type , Element : this.selectedObjects[0].parent.Get_ParentParagraph(), CheckType : AscCommon.changestype_Paragraph_Content} ))
                {
                    History.Create_NewPoint(AscDFH.historydescription_Document_GrObjectsChangeWrapPolygon);
                    this.selectedObjects[0].parent.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                    this.selectedObjects[0].parent.Check_WrapPolygon();
                    this.document.Recalculate();
                    this.document.Document_UpdateInterfaceState();
                }
            }
            this.resetInternalSelection();
            this.selection.wrapPolygonSelection = this.selectedObjects[0];
            this.updateOverlay();
        }
    },


    removeById: function(pageIndex, id)
    {
        var object = g_oTableId.Get_ById(id);
        if(isRealObject(object))
        {
            var hdr_ftr = object.DocumentContent.Is_HdrFtr(true);
            var page = !hdr_ftr ? this.graphicPages[pageIndex] : null;
            if(isRealObject(page))
            {
                var array_type = object.getDrawingArrayType();
                page.delObjectById(id, array_type);
            }
        }
    },

    removeFromAllHdrFtrPages: function(id, drawingType)
    {
        for(var i = 0; i < this.graphicPages.length; ++i)
        {
            this.removeFromHdrFrtPage(i, id, drawingType);
        }
    },

    removeFromHdrFrtPage: function(pageIndex, id, drawingType)
    {
        if(this.graphicPages[pageIndex] && this.graphicPages[pageIndex].hdrFtrPage)
        {
            this.graphicPages[pageIndex].hdrFtrPage.delObjectById(id, drawingType);
        }
    },

    Remove_ById: function(id)
    {
        for(var i = 0; i < this.graphicPages.length; ++i)
        {
            this.removeById(i, id)
        }
    },


    selectById: function(id, pageIndex)
    {
        this.resetSelection();
        var obj = g_oTableId.Get_ById(id), nPageIndex = pageIndex;
        if(obj && obj.GraphicObj)
        {
            if(obj.DocumentContent && obj.DocumentContent.Is_HdrFtr())
            {
                if(obj.DocumentContent.Get_StartPage_Absolute() !== obj.PageNum)
                {
                    nPageIndex = obj.PageNum;
                }
            }
            obj.GraphicObj.select(this, nPageIndex);
        }

    },

    calculateAfterChangeTheme: function()
    {
        /*todo*/
        for(var i = 0; i < this.drawingObjects.length; ++i)
        {
            this.drawingObjects[i].calculateAfterChangeTheme();
        }
        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },

    updateSelectionState: function()
    {
        return;
    },


    drawSelectionPage: function(pageIndex)
    {
        var oMatrix = null;
        if(this.selection.textSelection)
        {

            if(this.selection.textSelection.selectStartPage === pageIndex)
            {
                if(this.selection.textSelection.transformText)
                {
                    oMatrix = this.selection.textSelection.transformText.CreateDublicate();
                }
                this.drawingDocument.UpdateTargetTransform(oMatrix);
                this.selection.textSelection.getDocContent().Selection_Draw_Page(0);
            }
        }
        else if(this.selection.groupSelection)
        {
            if(this.selection.groupSelection.selectStartPage === pageIndex)
            {
                this.selection.groupSelection.drawSelectionPage(0);
            }
        }
        else if(this.selection.chartSelection && this.selection.chartSelection.selectStartPage === pageIndex && this.selection.chartSelection.selection.textSelection)
        {
            if(this.selection.chartSelection.selection.textSelection.transformText)
            {
                oMatrix = this.selection.chartSelection.selection.textSelection.transformText.CreateDublicate();
            }
            this.drawingDocument.UpdateTargetTransform(oMatrix);
            this.selection.chartSelection.selection.textSelection.getDocContent().Selection_Draw_Page(0);
        }
    },
    getAllRasterImagesOnPage: function(pageIndex)
    {
        var ret = [];
        if(this.graphicPages[pageIndex])
        {
            var graphic_page = this.graphicPages[pageIndex];
            var hdr_ftr_page = this.getHdrFtrObjectsByPageIndex(pageIndex);

            var graphic_array = graphic_page.beforeTextObjects.concat(graphic_page.wrappingObjects).concat(graphic_page.inlineObjects).concat(graphic_page.behindDocObjects);
            graphic_array = graphic_array.concat(hdr_ftr_page.beforeTextObjects).concat(hdr_ftr_page.wrappingObjects).concat(hdr_ftr_page.inlineObjects).concat(hdr_ftr_page.behindDocObjects);
            for(var i = 0; i < graphic_array.length; ++i)
            {
                if(graphic_array[i].getAllRasterImages)
                    graphic_array[i].getAllRasterImages(ret);
            }
        }
        return ret;
    },

    checkChartTextSelection: DrawingObjectsController.prototype.checkChartTextSelection,
    checkNeedResetChartSelection: DrawingObjectsController.prototype.checkNeedResetChartSelection,


    addNewParagraph: DrawingObjectsController.prototype.addNewParagraph,


    paragraphClearFormatting: DrawingObjectsController.prototype.paragraphClearFormatting,

    applyDocContentFunction: DrawingObjectsController.prototype.applyDocContentFunction,
    applyTextFunction: DrawingObjectsController.prototype.applyTextFunction,

    setParagraphSpacing: DrawingObjectsController.prototype.setParagraphSpacing,

    setParagraphTabs: DrawingObjectsController.prototype.setParagraphTabs,

    setParagraphNumbering: DrawingObjectsController.prototype.setParagraphNumbering,

    setParagraphShd: DrawingObjectsController.prototype.setParagraphShd,


    setParagraphStyle:  DrawingObjectsController.prototype.setParagraphStyle,


    setParagraphContextualSpacing: DrawingObjectsController.prototype.setParagraphContextualSpacing,

    setParagraphPageBreakBefore: DrawingObjectsController.prototype.setParagraphPageBreakBefore,
    setParagraphKeepLines: DrawingObjectsController.prototype.setParagraphKeepLines,

    setParagraphKeepNext: DrawingObjectsController.prototype.setParagraphKeepNext,


    setParagraphWidowControl: DrawingObjectsController.prototype.setParagraphWidowControl,

    setParagraphBorders: DrawingObjectsController.prototype.setParagraphBorders,

    paragraphAdd: DrawingObjectsController.prototype.paragraphAdd,

    paragraphIncDecFontSize: DrawingObjectsController.prototype.paragraphIncDecFontSize,

    paragraphIncDecIndent: DrawingObjectsController.prototype.paragraphIncDecIndent,

    setParagraphAlign: DrawingObjectsController.prototype.setParagraphAlign,

    setParagraphIndent: DrawingObjectsController.prototype.setParagraphIndent,
    getSelectedObjectsBounds: DrawingObjectsController.prototype.getSelectedObjectsBounds,
    getContextMenuPosition: DrawingObjectsController.prototype.getContextMenuPosition,
    getLeftTopSelectedFromArray: DrawingObjectsController.prototype.getLeftTopSelectedFromArray,

    getFromTargetTextObjectContextMenuPosition: function(oTargetTextObject, pageIndex)
    {
        var dPosX = this.document.TargetPos.X, dPosY = this.document.TargetPos.Y, oTransform = oTargetTextObject.transformText;
        return {X: oTransform.TransformPointX(dPosX, dPosY), Y: oTransform.TransformPointY(dPosX, dPosY), PageIndex: this.document.TargetPos.PageNum};
    },

    getLeftTopSelectedObject: function(pageIndex)
    {
        if(this.selectedObjects.length > 0)
        {
            var oRes = this.getLeftTopSelectedObjectByPage(pageIndex);
            if(oRes.bSelected === true)
            {
                return oRes;
            }
            var aSelectedObjectsCopy = [].concat(this.selectedObjects);
            aSelectedObjectsCopy.sort(function(a, b){return a.selectStartPage - b.selectStartPage});
            return this.getLeftTopSelectedObjectByPage(aSelectedObjectsCopy[0].selectStartPage);
        }
        return {X: 0, Y: 0, PageIndex: pageIndex};
    },

    getLeftTopSelectedObject2: function()
    {
        if(this.selectedObjects.length > 0)
        {
            var aSelectedObjectsCopy = [].concat(this.selectedObjects);
            aSelectedObjectsCopy.sort(function(a, b){return a.selectStartPage - b.selectStartPage});
            return this.getLeftTopSelectedObjectByPage(aSelectedObjectsCopy[0].selectStartPage);
        }
        return {X: 0, Y: 0, PageIndex: 0};
    },

    getLeftTopSelectedObjectByPage: function(pageIndex)
    {
        var oDrawingPage, oRes;
        if(this.document.Get_DocPosType(docpostype_HdrFtr))
        {
            if(this.graphicPages[pageIndex])
            {
                oDrawingPage = this.graphicPages[pageIndex].hdrFtrPage;
            }
        }
        else
        {
            if(this.graphicPages[pageIndex])
            {
                oDrawingPage = this.graphicPages[pageIndex];
            }
        }
        if(oDrawingPage)
        {
            oRes = this.getLeftTopSelectedFromArray(oDrawingPage.beforeTextObjects, pageIndex);
            if(oRes.bSelected)
            {
                return oRes;
            }
            oRes = this.getLeftTopSelectedFromArray(oDrawingPage.inlineObjects, pageIndex);
            if(oRes.bSelected)
            {
                return oRes;
            }
            oRes = this.getLeftTopSelectedFromArray(oDrawingPage.wrappingObjects, pageIndex);
            if(oRes.bSelected)
            {
                return oRes;
            }
            oRes = this.getLeftTopSelectedFromArray(oDrawingPage.behindDocObjects, pageIndex);
            if(oRes.bSelected)
            {
                return oRes;
            }
        }
        return {X: 0, Y: 0, PageIndex: pageIndex};
    },



    CheckRange: function(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, PageNum, HdrFtrRanges, docContent, bMathWrap)
    {
        if(isRealObject(this.graphicPages[PageNum]))
        {
            var Ranges = this.graphicPages[PageNum].CheckRange(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, HdrFtrRanges, docContent, bMathWrap);

            var ResultRanges = [];

            // Уберем лишние отрезки
            var Count = Ranges.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Range = Ranges[Index];

                if ( Range.X1 > X0 && Range.X0 < X1 )
                {
                    Range.X0 = Math.max( X0, Range.X0 );
                    Range.X1 = Math.min( X1, Range.X1 );

                    ResultRanges.push( Range );
                }
            }

            return ResultRanges;
        }
        return HdrFtrRanges;
    },

    getTableProps: function()
    {
        var content = this.getTargetDocContent();
        if(content)
            return content.Interface_Update_TablePr( true );
        return null;
    },

    startAddShape: function(preset)
    {
        /*todo*/
        switch(preset)
        {
            case "spline":
            {
                this.changeCurrentState(new AscFormat.SplineBezierState(this));
                break;
            }
            case "polyline1":
            {
                this.changeCurrentState(new AscFormat.PolyLineAddState(this));
                break;
            }
            case "polyline2":
            {
                this.changeCurrentState(new AscFormat.AddPolyLine2State(this));
                break;
            }
            default :
            {
                this.changeCurrentState(new AscFormat.StartAddNewShape(this, preset));
                break;
            }
        }
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_ChangeColorScheme:
            {
                this.document.theme.themeElements.clrScheme = data.oldScheme;
                this.drawingDocument.CheckGuiControlColors();

                editor.chartPreviewManager.clearPreviews();
                editor.textArtPreviewManager.clear();
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_ChangeColorScheme:
            {
                this.document.theme.themeElements.clrScheme = data.newScheme;
                this.drawingDocument.CheckGuiControlColors();
                editor.chartPreviewManager.clearPreviews();
                editor.textArtPreviewManager.clear();
                break;
            }
        }
    },


    Save_Changes: function(data, w)
    {
        w.WriteLong(AscDFH.historyitem_type_GrObjects);
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case AscDFH.historyitem_ChangeColorScheme:
            {
                data.newScheme.Write_ToBinary(w);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var class_type = r.GetLong();
        if(class_type != AscDFH.historyitem_type_GrObjects)
            return;
        var type = r.GetLong();
        switch (type)
        {
            case AscDFH.historyitem_ChangeColorScheme:
            {
                var clr_scheme = new AscFormat.ClrScheme();
                clr_scheme.Read_FromBinary(r);
                this.document.theme.themeElements.clrScheme = clr_scheme;
                this.drawingDocument.CheckGuiControlColors();
                for(var i = 0; i < this.drawingObjects.length; ++i)
                {
                    if(this.drawingObjects[i].GraphicObj)
                    {

                        this.drawingObjects[i].GraphicObj.handleUpdateFill();
                        this.drawingObjects[i].GraphicObj.handleUpdateLn();
                    }
                }
                editor.chartPreviewManager.clearPreviews();
                editor.textArtPreviewManager.clear();
                break;
            }
        }
    },

    Refresh_RecalcData: function(data)
    {
        History.RecalcData_Add({All: true});
        for(var i = 0; i < this.drawingObjects.length; ++i)
        {
            if(this.drawingObjects[i].GraphicObj)
            {

                this.drawingObjects[i].GraphicObj.handleUpdateFill();
                this.drawingObjects[i].GraphicObj.handleUpdateLn();
            }
        }
        editor.chartPreviewManager.clearPreviews();
        editor.textArtPreviewManager.clear();
    }
};

function ComparisonByZIndexSimpleParent(obj1, obj2)
{
    if(obj1.parent && obj2.parent)
        return ComparisonByZIndexSimple(obj1.parent, obj2.parent);
    return 0;
}

function ComparisonByZIndexSimple(obj1, obj2)
{
    if(AscFormat.isRealNumber(obj1.RelativeHeight) && AscFormat.isRealNumber(obj2.RelativeHeight))
    {
        if(obj1.RelativeHeight === obj2.RelativeHeight)
        {
            if(editor && editor.WordControl && editor.WordControl.m_oLogicDocument)
            {
                return editor.WordControl.m_oLogicDocument.Compare_DrawingsLogicPositions(obj2, obj1);
            }
        }
        return obj1.RelativeHeight - obj2.RelativeHeight;
    }
    if(!AscFormat.isRealNumber(obj1.RelativeHeight) && AscFormat.isRealNumber(obj2.RelativeHeight))
        return -1;
    if(AscFormat.isRealNumber(obj1.RelativeHeight) && !AscFormat.isRealNumber(obj2.RelativeHeight))
        return 1;
    return 0;
}

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CGraphicObjects = CGraphicObjects;
