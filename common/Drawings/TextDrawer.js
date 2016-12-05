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

(function(window, undefined){

// Import
var g_fontApplication = AscFonts.g_fontApplication;

var g_oTextMeasurer = AscCommon.g_oTextMeasurer;
    
var Geometry = AscFormat.Geometry;
var EPSILON_TEXT_AUTOFIT = AscFormat.EPSILON_TEXT_AUTOFIT;
var ObjectToDraw = AscFormat.ObjectToDraw;

var PATH_DIV_EPSILON = 0.1;
var UNDERLINE_DIV_EPSILON = 3;


function ParaDrawingStruct(nPageIndex, pDrawing)
{
    this.oDrawing = pDrawing;
    this.nPageIndex = nPageIndex;
}
ParaDrawingStruct.prototype.Draw = function(pGraphics)
{
    if(this.oDrawing)
    {
        this.oDrawing.Draw( 0, 0, pGraphics, this.nPageIndex, 0)
    }
};

function CDocContentStructure()
{
    this.m_nType = DRAW_COMMAND_CONTENT;
    this.m_aContent = [];
    this.m_aByLines = null;
    this.m_aDrawingsStruct = [];
    this.m_aBackgrounds = [];
    this.m_aBorders = [];
    this.m_aParagraphBackgrounds = [];
    this.m_oBoundsRect1 = null;
    this.m_oBoundsRect2 = null;
    this.m_aComments = [];
}

CDocContentStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    for(var i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }
};
CDocContentStructure.prototype.CheckContentStructs = function(aContentStructs)
{
    for(var i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].CheckContentStructs(aContentStructs);
    }
};
CDocContentStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aDrawingsStruct.length; ++i)
    {
        this.m_aDrawingsStruct[i].Draw(graphics);
    }

    for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
    {
        this.m_aParagraphBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].draw(graphics);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};
CDocContentStructure.prototype.drawComments = function(graphics, transform)
{
    var i;
    for(i = 0; i < this.m_aComments.length; ++i)
    {
        this.m_aComments[i].drawComment2(graphics, undefined, transform);
    }
};
CDocContentStructure.prototype.checkByWarpStruct = function(oWarpStruct, dWidth, dHeight, oTheme, oColorMap, oShape, dOneLineWidth, XLimit, dContentHeight, dKoeff)
{
    var i, j, t, aByPaths,  aWarpedObjects = [];
    var bOddPaths = oWarpStruct.pathLst.length / 2 - ((oWarpStruct.pathLst.length / 2) >> 0) > 0;
    var nDivCount = bOddPaths ? oWarpStruct.pathLst.length : oWarpStruct.pathLst.length >> 1, oNextPointOnPolygon, oObjectToDrawNext, oMatrix = new AscCommon.CMatrix();
    aByPaths = oWarpStruct.getArrayPolygonsByPaths(PATH_DIV_EPSILON);
    var nLastIndex = 0, dTmp, oBoundsChecker, oTemp, nIndex, aWarpedObjects2 = [];
    oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    oBoundsChecker.init(100, 100, 100, 100);
    var dMinX, dMaxX;
    for(j = 0; j < this.m_aByLines.length; ++j)
    {
        oTemp = this.m_aByLines[j];
        for(t = 0; t < oTemp.length; ++t)
        {
            oTemp[t].GetAllWarped(aWarpedObjects2);
            oTemp[t].CheckBoundsWarped(oBoundsChecker);
        }
    }
    dMinX = oBoundsChecker.Bounds.min_x;
    dMaxX = oBoundsChecker.Bounds.max_x;
    for( i = 0; i < nDivCount; ++i)
    {
        dTmp = (this.m_aByLines.length - nLastIndex)/(nDivCount - i);
        nIndex = nLastIndex + (dTmp >> 0) + ((dTmp - (dTmp >> 0)) > 0 ? 1 : 0);
        aWarpedObjects.length = 0;
        oBoundsChecker.Bounds.ClearNoAttack();
        for(j = nLastIndex; j < nIndex; ++j)
        {
            oTemp = this.m_aByLines[j];
            for(t = 0; t < oTemp.length; ++t)
            {
                oTemp[t].GetAllWarped(aWarpedObjects);
                oTemp[t].CheckBoundsWarped(oBoundsChecker);
            }
        }
        if(oBoundsChecker.Bounds.min_x > dMinX)
        {
            oBoundsChecker.Bounds.min_x = dMinX;
        }
        if(oBoundsChecker.Bounds.max_x < dMaxX)
        {
            oBoundsChecker.Bounds.max_x = dMaxX;
        }
        if(!bOddPaths)
        {
            ObjectsToDrawBetweenTwoPolygons(aWarpedObjects, oBoundsChecker.Bounds, new PolygonWrapper(aByPaths[i << 1]), new PolygonWrapper(aByPaths[(i << 1) + 1]));
        }
        else
        {
            oNextPointOnPolygon = null;
            oObjectToDrawNext = null;
            var oPolygon = new PolygonWrapper(aByPaths[i]);
            for(t = 0; t < aWarpedObjects.length; ++t)
            {
                var oWarpedObject = aWarpedObjects[t];
                var bArcDown = "textArchDown" !== oWarpStruct.preset && i < 1;
                if(!AscFormat.isRealNumber(oWarpedObject.x) || !AscFormat.isRealNumber(oWarpedObject.y) )
                {
                    CheckGeometryByPolygon(oWarpedObject, oPolygon, bArcDown, XLimit*dKoeff, dContentHeight, dKoeff, nDivCount > 1 ? oBoundsChecker.Bounds : null);
                }
                else
                {
                    oNextPointOnPolygon = this.checkTransformByOddPath(oMatrix, oWarpedObject, aWarpedObjects[t+1], oNextPointOnPolygon, dContentHeight, dKoeff, bArcDown, oPolygon, XLimit);
                    TransformGeometry(oWarpedObject, oMatrix);
                }
            }
        }
        nLastIndex = nIndex;
    }
    this.checkUnionPaths(aWarpedObjects2);
};



CDocContentStructure.prototype.checkContentReduct = function(oWarpStruct, dWidth, dHeight, oTheme, oColorMap, oShape, dOneLineWidth, XLimit, dContentHeight, dKoeff)
{
    var i, j, t, aByPaths,  aWarpedObjects = [];
    var bOddPaths = oWarpStruct.pathLst.length / 2 - ((oWarpStruct.pathLst.length / 2) >> 0) > 0;
    var nDivCount = bOddPaths ? oWarpStruct.pathLst.length : oWarpStruct.pathLst.length >> 1, oNextPointOnPolygon, oObjectToDrawNext, oMatrix;
    aByPaths = oWarpStruct.getArrayPolygonsByPaths(PATH_DIV_EPSILON);
    var nLastIndex = 0, dTmp, oBoundsChecker, oTemp, nIndex, aWarpedObjects2 = [];
    oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    oBoundsChecker.init(100, 100, 100, 100);
    for(j = 0; j < this.m_aByLines.length; ++j)
    {
        oTemp = this.m_aByLines[j];
        for(t = 0; t < oTemp.length; ++t)
        {
            oTemp[t].GetAllWarped(aWarpedObjects2);
            oTemp[t].CheckBoundsWarped(oBoundsChecker);
        }
    }
    var aBounds = [];
    var oRet = {maxDx: 0, maxDy: 0};
    for( i = 0; i < nDivCount; ++i)
    {
        dTmp = (this.m_aByLines.length - nLastIndex)/(nDivCount - i);
        nIndex = nLastIndex + (dTmp >> 0) + ((dTmp - (dTmp >> 0)) > 0 ? 1 : 0);
        aWarpedObjects.length = 0;
        for(j = nLastIndex; j < nIndex; ++j)
        {
            oTemp = this.m_aByLines[j];
            for(t = 0; t < oTemp.length; ++t)
            {
                oTemp[t].GetAllWarped(aWarpedObjects);
            }
        }
        var bArcDown = "textArchDown" !== oWarpStruct.preset && i < 1;
        if(bOddPaths)
        {
            oNextPointOnPolygon = null;
            oObjectToDrawNext = null;
            var oPolygon = new PolygonWrapper(aByPaths[i]);
            for(t = 0; t < aWarpedObjects.length; ++t)
            {
                var oWarpedObject = aWarpedObjects[t];
                if(AscFormat.isRealNumber(oWarpedObject.x) && AscFormat.isRealNumber(oWarpedObject.y) )
                {
                    oMatrix = new AscCommon.CMatrix();
                    oBoundsChecker.Bounds.ClearNoAttack();
                    oNextPointOnPolygon = this.checkTransformByOddPath(oMatrix, oWarpedObject, aWarpedObjects[t+1], oNextPointOnPolygon, dContentHeight, dKoeff, bArcDown, oPolygon, XLimit);
                    oWarpedObject.draw(oBoundsChecker);

                    var oBounds = new AscFormat.CBoundsController();
//                    oBounds.fromBounds(oBoundsChecker.Bounds);
                    for(var k = 0; k < aBounds.length; ++k)
                    {
                        var oIntersection = this.checkIntersectionBounds( aBounds[k].Bounds, aBounds[k].Transform, oBounds, oMatrix, aBounds.length - k);
                        if(oIntersection.DX > oRet.maxDx)
                        {
                            oRet.maxDx = oIntersection.DX;
                        }
                        if(oIntersection.DY < oRet.maxDy)
                        {
                            oRet.maxDy = oIntersection.DY;
                        }
                    }
                    aBounds.push({Bounds: oBounds, Transform: oMatrix});
                }
            }
        }
        nLastIndex = nIndex;
    }
    return oRet;
};

CDocContentStructure.prototype.getAllBackgroundsBorders = function(aParaBackgrounds, aBackgrounds, aBorders, aComments)
{
    for(var i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].getAllBackgroundsBorders(aParaBackgrounds, aBackgrounds, aBorders, aComments);
    }
}

function CheckIntervalIntersection(X1, Y1, X2, Y2, X3, Y3, X4, Y4)
{
    return  (((X3-X1)*(Y2-Y1) - (Y3-Y1)*(X2-X1)) *
        ((X4-X1)*(Y2-Y1) - (Y4-Y1)*(X2-X1)) >= 0)&&
        (((X1-X3)*(Y4-Y3) - (Y1-Y3)*(X4-X3)) *
            ((X2-X3)*(Y4-Y3) - (Y2-Y3)*(X4-X3)) >= 0);
}

function BoundsRect()
{
    this.arrBounds = [
        {X0:0, Y0: 0, X1: 0, Y1:0},
        {X0:0, Y0: 0, X1: 0, Y1:0},
        {X0:0, Y0: 0, X1: 0, Y1:0},
        {X0:0, Y0: 0, X1: 0, Y1:0}
    ]
}

BoundsRect.prototype.fromBoundsAndTransform = function(oBounds, oTransform)
{
    this.arrBounds[0].X0 = oTransform.TransformPointX(oBounds.min_x, oBounds.min_y);
    this.arrBounds[0].Y0 = oTransform.TransformPointY(oBounds.min_x, oBounds.min_y);
    this.arrBounds[0].X1 = oTransform.TransformPointX(oBounds.max_x, oBounds.min_y);
    this.arrBounds[0].Y1 = oTransform.TransformPointY(oBounds.max_x, oBounds.min_y);

    this.arrBounds[1].X0 = oTransform.TransformPointX(oBounds.max_x, oBounds.max_y);
    this.arrBounds[1].Y0 = oTransform.TransformPointY(oBounds.max_x, oBounds.max_y);
    this.arrBounds[1].X1 = oTransform.TransformPointX(oBounds.max_x, oBounds.min_y);
    this.arrBounds[1].Y1 = oTransform.TransformPointY(oBounds.max_x, oBounds.min_y);

    this.arrBounds[2].X0 = oTransform.TransformPointX(oBounds.max_x, oBounds.max_y);
    this.arrBounds[2].Y0 = oTransform.TransformPointY(oBounds.max_x, oBounds.max_y);
    this.arrBounds[2].X1 = oTransform.TransformPointX(oBounds.min_x, oBounds.max_y);
    this.arrBounds[2].Y1 = oTransform.TransformPointY(oBounds.min_x, oBounds.max_y);

    this.arrBounds[3].X0 = oTransform.TransformPointX(oBounds.min_x, oBounds.max_y);
    this.arrBounds[3].Y0 = oTransform.TransformPointY(oBounds.min_x, oBounds.max_y);
    this.arrBounds[3].X1 = oTransform.TransformPointX(oBounds.min_x, oBounds.min_y);
    this.arrBounds[3].Y1 = oTransform.TransformPointY(oBounds.min_x, oBounds.min_y);
};



BoundsRect.prototype.checkIntersection = function(oBoundsRect)
{
    var i, j, oCurBound1, oCurBound2;
    for(i = 0; i < 4; ++i)
    {
        oCurBound1 = this.arrBounds[i];
        for(j = 0; j < 4; ++j)
        {
            oCurBound2 = oBoundsRect[j];
            if(CheckIntervalIntersection(oCurBound1.X0, oCurBound1.Y0, oCurBound1.X1, oCurBound1.Y1, oCurBound2.X0, oCurBound2.Y0, oCurBound2.X1, oCurBound2.Y1))
            {
                return true;
            }
        }
    }
    return false;
};

BoundsRect.prototype.getParamValueProjection = function(x0, y0, x1, y1, x, y)
{
    var dX = (x1-x0), dY = (y1 - y0);

    if(Math.abs(dX) > 0 )
    {
        var dXSq = dX*dX;
        var xi = (x*dXSq + dX*dY*y - dY*(x1*y0-x0*y1))/(dXSq + dY*dY);
        return (xi - x1)/dX;
    }
    else if(Math.abs(dY) > 0)
    {
        var dYSq = dY*dY;
        var yi = (y*dYSq + dX*dY*x + dX*(x1*y0 - x0*y1))/(dX*dX + dYSq);
        return (yi - y1)/dY;
    }
    return -1;
};

BoundsRect.prototype.checkIntervalProjection = function(oInterval1, oInterval2)
{
    var param0  = this.getParamValueProjection(oInterval1.X0, oInterval1.Y0, oInterval1.X1, oInterval1.Y1, oInterval2.X0, oInterval2.Y0);
    var param1  = this.getParamValueProjection(oInterval1.X0, oInterval1.Y0, oInterval1.X1, oInterval1.Y1, oInterval2.X1, oInterval2.Y1);
    if(Math.abs(param0 - 0.5) <= 0.5 || Math.abs(param1 - 0.5) <= 0.5)
    {
        var dX = (oInterval1.X0 - oInterval1.X1), dY = (oInterval1.Y0 - oInterval1.Y1);
        var dLen = Math.sqrt(dX*dX + dY*dY);
        return ((param1 > 1  ? 1 : (param1 < 0 ? 0 : param1)) - (param0 > 1  ? 1 : (param0 < 0 ? 0 : param0)))*dLen;
    }
    else
    {
        return 0;
    }
};


BoundsRect.prototype.checkBoundsRectProjection = function(oBoundsRect)
{
    var dX = 0, dY = 0, dLTemp;

    dLTemp = this.checkIntervalProjection(this.arrBounds[1], oBoundsRect.arrBounds[1]);
    if(dLTemp < dY)
    {
        dY = dLTemp;
    }
    dLTemp = this.checkIntervalProjection(this.arrBounds[1], oBoundsRect.arrBounds[3]);
    if(dLTemp < dY)
    {
        dY = dLTemp;
    }
    dLTemp = this.checkIntervalProjection(this.arrBounds[3], oBoundsRect.arrBounds[1]);
    if(dLTemp < dY)
    {
        dY = dLTemp;
    }
    dLTemp = this.checkIntervalProjection(this.arrBounds[3], oBoundsRect.arrBounds[3]);
    if(dLTemp < dY)
    {
        dY = dLTemp;
    }

    dLTemp = this.checkIntervalProjection(this.arrBounds[2], oBoundsRect.arrBounds[1]);
    if(Math.abs(dLTemp) > dX)
    {
        dX = Math.abs(dLTemp);
    }

    dLTemp = this.checkIntervalProjection(this.arrBounds[2], oBoundsRect.arrBounds[3]);
    if(Math.abs(dLTemp) > dX)
    {
        dX = Math.abs(dLTemp);
    }

    dLTemp = this.checkIntervalProjection(this.arrBounds[0], oBoundsRect.arrBounds[1]);
    if(Math.abs(dLTemp) > dX)
    {
        dX = Math.abs(dLTemp);
    }

    dLTemp = this.checkIntervalProjection(this.arrBounds[0], oBoundsRect.arrBounds[3]);
    if(Math.abs(dLTemp) > dX)
    {
        dX = Math.abs(dLTemp);
    }

    return {DX: dX, DY: dY};
};

CDocContentStructure.prototype.checkIntersectionBounds = function(oBounds1, oTransform1, oBounds2, oTransform2, nDist)
{
    if(!this.m_oBoundsRect1)
    {
        this.m_oBoundsRect1 = new BoundsRect();
        this.m_oBoundsRect2 = new BoundsRect();
    }
    this.m_oBoundsRect1.fromBoundsAndTransform(oBounds1, oTransform1);
    this.m_oBoundsRect2.fromBoundsAndTransform(oBounds2, oTransform2);
    if(this.m_oBoundsRect1.checkIntersection(this.m_oBoundsRect2.arrBounds))
    {
        var oBounds = this.m_oBoundsRect1.checkBoundsRectProjection(this.m_oBoundsRect2);
        oBounds.DX/=nDist;
        return oBounds;
    }
    return {DX: 0, DY: 0};
};

CDocContentStructure.prototype.checkTransformByOddPath = function(oMatrix, oWarpedObject, oObjectToDrawNext, oNextPointOnPolygon, dContentHeight, dKoeff, bArcDown, oPolygon, XLimit)
{
    var x0, y0, x1, y1, x0t, y0t, x1t, y1t, cX, cX2, dX, dY, dX2, dY2, dNorm, oPointOnPolygon;
    x0 = oWarpedObject.x*dKoeff;
    y0 = oWarpedObject.y*dKoeff;
    x1 = x0;
    if(bArcDown)
    {
        y1 = 0;
    }
    else
    {
        y1 = dContentHeight*dKoeff;
    }
    cX = oWarpedObject.x/XLimit;
    var oRet = null;
    if(oNextPointOnPolygon)
    {
        oPointOnPolygon = oNextPointOnPolygon;
    }
    else
    {
        oPointOnPolygon = oPolygon.getPointOnPolygon(cX, true);
    }
    x1t = oPointOnPolygon.x;
    y1t = oPointOnPolygon.y;
    dX = oPointOnPolygon.oP2.x - oPointOnPolygon.oP1.x;
    dY = oPointOnPolygon.oP2.y - oPointOnPolygon.oP1.y;

    if(bArcDown)
    {
        dX = -dX;
        dY = -dY;
    }
    if(oObjectToDrawNext && AscFormat.isRealNumber(oObjectToDrawNext.x) && AscFormat.isRealNumber(oObjectToDrawNext.y) && oObjectToDrawNext.x > oWarpedObject.x)
    {
        cX2 = (oObjectToDrawNext.x)/XLimit;
        oRet = oPolygon.getPointOnPolygon(cX2, true);
        dX2 = oRet.oP2.x - oRet.oP1.x;
        dY2 = oRet.oP2.y - oRet.oP1.y;
        if(bArcDown)
        {
            dX2 = -dX2;
            dY2 = -dY2;
        }
        dX = dX + dX2;
        dY = dY + dY2;
    }
    else
    {
        oRet = null;
    }
    dNorm = Math.sqrt(dX*dX + dY*dY);

    if(bArcDown)
    {
        x0t = x1t + (dY/dNorm)*(y0);
        y0t = y1t - (dX/dNorm)*(y0);
    }
    else
    {
        x0t = x1t + (dY/dNorm)*(dContentHeight*dKoeff - y0);
        y0t = y1t - (dX/dNorm)*(dContentHeight*dKoeff - y0);
    }
    oMatrix.shx = (x1t - x0t)/(y1 - y0);
    oMatrix.sy = (y1t - y0t)/(y1 - y0);
    oMatrix.sx = oMatrix.sy;
    oMatrix.shy = -oMatrix.shx;
    oMatrix.tx = x0t - x0*oMatrix.sx - y0*oMatrix.shx;
    oMatrix.ty = y0t - x0*oMatrix.shy - y0*oMatrix.sy;
    return oRet;
};

CDocContentStructure.prototype.checkUnionPaths = function(aWarpedObjects)
{
    var aToCheck = [];
    var aWarpedObjects2, i, j, k;
    if(Array.isArray(aWarpedObjects))
    {
        aToCheck.push(aWarpedObjects);
    }
    else
    {
		for(j = 0; j < this.m_aByLines.length; ++j)
		{
            aWarpedObjects2 = [];
			var oTemp = this.m_aByLines[j];
			for(var t = 0; t < oTemp.length; ++t)
			{
				oTemp[t].GetAllWarped(aWarpedObjects2);
			}
            aToCheck.push(aWarpedObjects2);
		}
    }
    for(j = 0; j < aToCheck.length; ++j)
    {
        var aByProps = [], oCurObjectToDraw;
        aWarpedObjects2 = aToCheck[j];
        for(i = 0; i < aWarpedObjects2.length; ++i)
        {
            oCurObjectToDraw = aWarpedObjects2[i];
            for(k = 0; k < aByProps.length; ++k)
            {
                var oObjToDraw = aByProps[k];
                if(CompareBrushes(oObjToDraw.brush, oCurObjectToDraw.brush) && ComparePens(oObjToDraw.pen, oCurObjectToDraw.pen) && !oCurObjectToDraw.Comment && !oObjToDraw.Comment
                    && !oCurObjectToDraw.geometry.bDrawSmart && !oObjToDraw.geometry.bDrawSmart)
                {
                    oObjToDraw.geometry.pathLst = oObjToDraw.geometry.pathLst.concat(oCurObjectToDraw.geometry.pathLst);
                    oCurObjectToDraw.geometry.pathLst.length = 0;
                    break;
                }
            }
            if(k === aByProps.length)
            {
                aByProps.push(oCurObjectToDraw);
            }
        }
    }
    this.m_aBackgrounds.length = 0;
    this.m_aBorders.length = 0;
    this.getAllBackgroundsBorders(this.m_aParagraphBackgrounds, this.m_aBackgrounds, this.m_aBorders, this.m_aComments);
};




function CParagraphStructure()
{
    this.m_nType = DRAW_COMMAND_PARAGRAPH;
    this.m_aContent = [];
}

CParagraphStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }
};

CParagraphStructure.prototype.CheckContentStructs = function(aContentStructs)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].CheckContentStructs(aContentStructs);
    }
};
CParagraphStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};

CParagraphStructure.prototype.getAllBackgroundsBorders = function(aParaBackgrounds, aBackgrounds, aBorders, aComments)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].getAllBackgroundsBorders(aParaBackgrounds, aBackgrounds, aBorders, aComments);
    }
};


function CTableStructure()
{
    this.m_nType = DRAW_COMMAND_TABLE;
    this.m_aContent = [];
    this.m_aBorders = [];
}

CTableStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }

    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
};
CTableStructure.prototype.CheckContentStructs = function(aContentStructs)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].CheckContentStructs(aContentStructs);
    }
};
CTableStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};

CTableStructure.prototype.getAllBackgroundsBorders = function(aParaBackgrounds, aBackgrounds, aBorders, aComments)
{
    var i;
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        aBorders.push(this.m_aBorders[i]);
    }
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].getAllBackgroundsBorders(aParaBackgrounds, aBackgrounds, aBorders, aComments);
    }
};



function CLineStructure(oLine)
{
    this.m_nType = DRAW_COMMAND_LINE;
    this.m_oLine = oLine;
    this.m_aContent = [];//ObjectToDraw
    this.m_aBorders = [];
    this.m_aBackgrounds = [];
    this.m_aUnderlinesStrikeouts = [];
    this.m_aParagraphBackgrounds = [];
    this.m_nDrawType = 0;// 0 - content, 1 - borders, 2 - backgrounds, 3 - underlinestrikeouts, 4 - paragraphbackrounds
}

CLineStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
    for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
    {
        this.m_aParagraphBackgrounds[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, true);
    }
};

CLineStructure.prototype.CheckContentStructs = function(aContentStructs)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        aContentStructs.push(this.m_aContent[i]);
    }
};
CLineStructure.prototype.GetAllWarped = function(aWarpedObjects)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        aWarpedObjects.push(this.m_aContent[i]);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        aWarpedObjects.push(this.m_aBackgrounds[i]);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        aWarpedObjects.push(this.m_aUnderlinesStrikeouts[i]);
    }
};
CLineStructure.prototype.CheckBoundsWarped = function(graphics)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, true);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].draw(graphics, true);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].draw(graphics, true);
    }
};
CLineStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
  // for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
  // {
  //     this.m_aParagraphBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
  // }
  //  for(i = 0; i < this.m_aBorders.length; ++i)
  //  {
  //      this.m_aBorders[i].draw(graphics);
  //  }
 //   for(i = 0; i < this.m_aBackgrounds.length; ++i)
 //   {
 //       this.m_aBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
 //   }
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
};

CLineStructure.prototype.getAllBackgroundsBorders = function(aParaBackgrounds, aBackgrounds, aBorders, aComments)
{
    var i;
    for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
    {
        aParaBackgrounds.push(this.m_aParagraphBackgrounds[i]);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        aBackgrounds.push(this.m_aBackgrounds[i]);
        if(this.m_aBackgrounds[i].Comment)
        {
            aComments.push(this.m_aBackgrounds[i])
        }
    }
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        aBorders.push(this.m_aBorders[i]);
    }
};


var DRAW_COMMAND_TABLE = 0x01;
var DRAW_COMMAND_CONTENT = 0x02;
var DRAW_COMMAND_PARAGRAPH = 0x03;
var DRAW_COMMAND_LINE = 0x04;
var DRAW_COMMAND_DRAWING = 0x05;
var DRAW_COMMAND_HIDDEN_ELEM = 0x06;
var DRAW_COMMAND_NO_CREATE_GEOM = 0x07;
var DRAW_COMMAND_TABLE_ROW = 0x08;

function GetConstDescription(nConst)
{
    switch (nConst)
    {
        case DRAW_COMMAND_TABLE:
        {
            return "DRAW_COMMAND_TABLE";
        }
        case DRAW_COMMAND_CONTENT:
        {
            return "DRAW_COMMAND_CONTENT";
        }
        case DRAW_COMMAND_PARAGRAPH:
        {
            return "DRAW_COMMAND_PARAGRAPH";
        }
        case DRAW_COMMAND_LINE:
        {
            return "DRAW_COMMAND_LINE";
        }
        case DRAW_COMMAND_DRAWING:
        {
            return "DRAW_COMMAND_DRAWING";
        }
        case DRAW_COMMAND_HIDDEN_ELEM:
        {
            return "DRAW_COMMAND_HIDDEN_ELEM";
        }
        case DRAW_COMMAND_NO_CREATE_GEOM:
        {
            return "DRAW_COMMAND_NO_CREATE_GEOM";
        }
        case DRAW_COMMAND_TABLE_ROW:
        {
            return "DRAW_COMMAND_TABLE_ROW";
        }
        default :
        {
            return "Unknown";
        }
    }
}

function CreatePenFromParams(oUnifill, nStyle, nLineCap, nLineJoin, dLineWidth, dSize)
{
    var oLine = new AscFormat.CLn();
    oLine.setW(dSize * 36000 >> 0);
    oLine.setFill(oUnifill);


    //TODO
    // this.Color      = { R : 255, G : 255, B : 255, A : 255 };
    // this.Style      = 0;
    // this.LineCap    = 0;
    // this.LineJoin   = 0;
//
    // this.LineWidth  = 1;

    return oLine;
}

function CTextDrawer(dWidth, dHeight, bDivByLInes, oTheme, bDivGlyphs)
{
    this.m_oFont =
    {
        Name     : "",
        FontSize : -1,
        Style    : -1
    };

    this.m_oTheme = oTheme;
    this.Width = dWidth;
    this.Height = dHeight;
    this.m_oTransform = new AscCommon.CMatrix();
    this.pathW = 43200;
    this.pathH = 43200;

    this.xKoeff = this.pathW/this.Width;
    this.yKoeff = this.pathH/this.Height;

    this.m_aStack = [];
    this.m_oDocContentStructure = null;
    this.m_aCommands = [];
    this.m_aDrawings = [];
    // RFonts
    this.m_oTextPr      = null;
    this.m_oGrFonts     = new AscCommon.CGrRFonts();
    this.m_oCurComment     = null;

    this.m_oPen     = new AscCommon.CPen();
    this.m_oBrush   = new AscCommon.CBrush();

    this.m_oLine = null;
    this.m_oFill = null;


    // чтобы выставилось в первый раз
    this.m_oPen.Color.R     = -1;
    this.m_oBrush.Color1.R  = -1;
    this.m_oBrush.Color2.R  = -1;

    // просто чтобы не создавать каждый раз
    this.m_oFontSlotFont = new AscCommon.CFontSetup();
    this.LastFontOriginInfo = { Name : "", Replace : null };

    this.GrState = new AscCommon.CGrState();
    this.GrState.Parent = this;

    this.m_bDivByLines = bDivByLInes === true;
    this.m_bDivGlyphs  = bDivGlyphs === true;
    this.m_aByLines = null;
    this.m_nCurLineIndex = -1;
    this.m_aStackLineIndex = null;
    this.m_aStackCurRowMaxIndex = null;
    this.m_aByParagraphs = null;

    this.m_oObjectToDraw = null;

    this.m_bTurnOff = false;

    this.bCheckLines = false;
    this.lastX = null;
    this.lastY = null;
    if(this.m_bDivByLines)
    {
        this.m_aByLines = [];
        this.m_aStackLineIndex = [];
        this.m_aStackCurRowMaxIndex = [];
    }
    else
    {
        this.m_aByParagraphs = [];
    }
}

CTextDrawer.prototype =
{
    SetObjectToDraw: function(oObjectToDraw)
    {
        this.m_oObjectToDraw = oObjectToDraw;
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        if (this.m_oPen.Color.R != r || this.m_oPen.Color.G != g || this.m_oPen.Color.B != b)
        {
            this.m_oPen.Color.R = r;
            this.m_oPen.Color.G = g;
            this.m_oPen.Color.B = b;
        }
        if (this.m_oPen.Color.A != a)
        {
            this.m_oPen.Color.A = a;
        }
        this.Get_PathToDraw(false, true);
    },
    AddSmartRect: function()
    {},
    p_width : function(w)
    {
        var val = w / 1000;
        if (this.m_oPen.Size != val)
        {
            this.m_oPen.Size = val;
        }
        this.Get_PathToDraw(false, true);
    },
    p_dash : function(w)
    {
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        if (this.m_oBrush.Color1.R != r || this.m_oBrush.Color1.G != g || this.m_oBrush.Color1.B != b)
        {
            this.m_oBrush.Color1.R = r;
            this.m_oBrush.Color1.G = g;
            this.m_oBrush.Color1.B = b;
        }
        if (this.m_oBrush.Color1.A != a)
        {
            this.m_oBrush.Color1.A = a;
        }
        this.Get_PathToDraw(false, true);
    },

    set_fillColor: function(R, G, B)
    {
        this.m_oFill = AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(R, G, B));
        this.Get_PathToDraw(false, true);
    },

    b_color2 : function(r,g,b,a)
    {
        if (this.m_oBrush.Color2.R != r || this.m_oBrush.Color2.G != g || this.m_oBrush.Color2.B != b)
        {
            this.m_oBrush.Color2.R = r;
            this.m_oBrush.Color2.G = g;
            this.m_oBrush.Color2.B = b;
        }
        if (this.m_oBrush.Color2.A != a)
        {
            this.m_oBrush.Color2.A = a;
        }
        this.Get_PathToDraw(false, true);
    },

    put_brushTexture : function(src, mode)
    {
        this.m_oBrush.Color1.R = -1;
        this.m_oBrush.Color1.G = -1;
        this.m_oBrush.Color1.B = -1;
        this.m_oBrush.Color1.A = -1;
        this.Get_PathToDraw(false, true);
    },

    SetShd: function(oShd)
    {
        if(oShd)
        {
            if (oShd.Value !== Asc.c_oAscShdNil)
            {
                if(oShd.Unifill)
                {
                    this.m_oFill = oShd.Unifill;
                }
                else
                {
                    if(oShd.Color)
                    {
                        this.m_oFill = AscFormat.CreateUnfilFromRGB(oShd.Color.r, oShd.Color.g, oShd.Color.b);
                    }
                    else
                    {
                        this.m_oFill = null;
                    }
                }
            }
            else
            {
                this.m_oFill = null;
            }
        }
        else
        {
            this.m_oFill = null;
        }
        this.Get_PathToDraw(false, true);
    },


    SetBorder: function(oBorder)
    {
        if(oBorder && oBorder.Value !== border_None)
        {
            this.m_oLine = CreatePenFromParams(oBorder.Unifill ? oBorder.Unifill : AscFormat.CreateUnfilFromRGB(oBorder.Color.r, oBorder.Color.g, oBorder.Color.b), this.m_oPen.Style, this.m_oPen.LineCap, this.m_oPen.LineJoin, this.m_oPen.LineWidth, this.m_oPen.Size);
        }
        else
        {
            this.m_oLine = null;
        }
        //TODO
    },

    SetAdditionalProps: function(oProps)
    {
        oProps && this.SetTextPr(oProps, this.m_oTheme);
    },

    put_BrushTextureAlpha : function(alpha)
    {
    },

    put_BrushGradient : function(gradFill, points, transparent)
    {
    },

    StartCheckTableDraw: function()
    {
        this.Start_Command(DRAW_COMMAND_TABLE);
    },

    EndCheckTableDraw: function()
    {
        this.End_Command();
    },

    Start_Command : function(commandId, param, index, nType)
    {
        this.m_aCommands.push(commandId);
        var oNewStructure = null;
        switch(commandId)
        {
            case DRAW_COMMAND_NO_CREATE_GEOM:
            {
                break;
            }
            case DRAW_COMMAND_CONTENT:
            {
                oNewStructure = new CDocContentStructure();
                this.m_aStackLineIndex.push(this.m_nCurLineIndex);
                break;
            }
            case DRAW_COMMAND_PARAGRAPH:
            {
                oNewStructure = new CParagraphStructure();
                if(!this.m_bDivByLines)
                {
                    this.m_aByParagraphs[this.m_aByParagraphs.length] = [];
                }
                break;
            }
            case DRAW_COMMAND_LINE:
            {
                var oPrevStruct = this.m_aStack[this.m_aStack.length - 1];
                if(oPrevStruct.m_nType === DRAW_COMMAND_PARAGRAPH && oPrevStruct.m_aContent[index])
                {
                    oPrevStruct.m_aContent[index].m_nDrawType = nType;
                    this.m_aStack.push(oPrevStruct.m_aContent[index]);
                }
                else
                {
                    oNewStructure = new CLineStructure(param);
                    oNewStructure.m_nDrawType = nType;
                    if(this.m_bDivByLines)
                    {
                        ++this.m_nCurLineIndex;
                        if(!Array.isArray(this.m_aByLines[this.m_nCurLineIndex]))
                        {
                            this.m_aByLines[this.m_nCurLineIndex] = [];
                        }
                        this.m_aByLines[this.m_nCurLineIndex].push(oNewStructure);
                        if(this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length - 1] < this.m_nCurLineIndex)
                        {
                            this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length - 1] = this.m_nCurLineIndex;
                        }
                    }
                    else
                    {
                        this.m_aByParagraphs[this.m_aByParagraphs.length - 1].push(oNewStructure);
                    }
                }
                break;
            }
            case DRAW_COMMAND_TABLE:
            {
                oNewStructure = new CTableStructure();
                break;
            }
            case DRAW_COMMAND_DRAWING:
            {
                break;
            }
            case DRAW_COMMAND_HIDDEN_ELEM:
            {
                break;
            }
            case DRAW_COMMAND_TABLE_ROW:
            {
                this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length] = -1;
                break;
            }
        }
        if(oNewStructure)
        {
            if(this.m_aStack[this.m_aStack.length - 1])
            {
                this.m_aStack[this.m_aStack.length - 1].m_aContent.push(oNewStructure);
            }
            this.m_aStack.push(oNewStructure);
        }
    },

    End_Command : function()
    {
        var nCommandId = this.m_aCommands.pop();
        switch(nCommandId)
        {
            case DRAW_COMMAND_NO_CREATE_GEOM:
            {
                break;
            }
            case DRAW_COMMAND_CONTENT:
            {
                var oDocContentStructure = this.m_aStack.pop();
                if(this.m_aStack.length === 0)
                {
                    this.m_oDocContentStructure = oDocContentStructure;
                    this.m_oDocContentStructure.m_aByLines = this.m_aByLines;
                    this.m_oDocContentStructure.m_aByParagraphs = this.m_aByParagraphs;
                    this.m_oDocContentStructure.m_aDrawingsStruct = this.m_aDrawings;
                    this.m_aByLines = [];
                    this.m_aByParagraphs = [];
                    this.m_aDrawings = [];
                }
                if(this.m_bDivByLines)
                {
                    this.m_nCurLineIndex = this.m_aStackLineIndex.pop();
                }
                break;
            }
            case DRAW_COMMAND_PARAGRAPH:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_LINE:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_TABLE:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_DRAWING:
            {
                break;
            }
            case DRAW_COMMAND_HIDDEN_ELEM:
            {
                break;
            }
            case DRAW_COMMAND_TABLE_ROW:
            {
                this.m_nCurLineIndex = this.m_aStackCurRowMaxIndex.pop();
                break;
            }
        }
    },

    Get_PathToDraw : function(bStart, bStart2, x, y)
    {
        var oPath = null;
        var oLastCommand = this.m_aStack[this.m_aStack.length - 1];
        var oLastObjectToDraw, oBrushColor = this.m_oBrush.Color1, oPenColor = this.m_oPen.Color;
        if(oLastCommand)
        {
            switch(oLastCommand.m_nType)
            {
                case DRAW_COMMAND_LINE:
                {
                    switch(oLastCommand.m_nDrawType)
                    {
                        case 0://content
                        {
                            if(oLastCommand.m_aContent.length === 0)
                            {
                                oLastCommand.m_aContent.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, x, y, this.m_oCurComment));
                            }
                            oLastObjectToDraw = oLastCommand.m_aContent[oLastCommand.m_aContent.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), x, y)
                                }
                                else
                                {
                                    oLastCommand.m_aContent.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                                    oLastObjectToDraw = oLastCommand.m_aContent[oLastCommand.m_aContent.length - 1];
                                }
                            }
                            break;
                        }
                        case 1://borders
                        {
                            if(oLastCommand.m_aBorders.length === 0)
                            {
                                oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y))
                            }
                            oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine, x, y);
                                }
                                else
                                {
                                    oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                                    oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];
                                }
                            }
                            break;
                        }
                        case 2://backgrounds
                        {
                            if(oLastCommand.m_aBackgrounds.length === 0)
                            {
                                oLastCommand.m_aBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y))
                            }
                            oLastObjectToDraw = oLastCommand.m_aBackgrounds[oLastCommand.m_aBackgrounds.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine, x, y);
                                }
                                else
                                {
                                    oLastCommand.m_aBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                                    oLastObjectToDraw = oLastCommand.m_aBackgrounds[oLastCommand.m_aBackgrounds.length - 1];
                                }
                            }
                            break;
                        }
                        case 3://Underliens & Strikeouts
                        {
                            if(oLastCommand.m_aUnderlinesStrikeouts.length === 0)
                            {
                                oBrushColor = this.m_oBrush.Color1;
                                oPenColor = this.m_oPen.Color;
                                oLastCommand.m_aUnderlinesStrikeouts.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, x, y))
                            }
                            oLastObjectToDraw = oLastCommand.m_aUnderlinesStrikeouts[oLastCommand.m_aUnderlinesStrikeouts.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), x, y);
                                }
                                else
                                {
                                    oLastCommand.m_aUnderlinesStrikeouts.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                                    oLastObjectToDraw = oLastCommand.m_aUnderlinesStrikeouts[oLastCommand.m_aUnderlinesStrikeouts.length - 1];
                                }
                            }
                            break;
                        }
                        case 4:
                        {
                            if(oLastCommand.m_aParagraphBackgrounds.length === 0)
                            {
                                oLastCommand.m_aParagraphBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y))
                            }
                            oLastObjectToDraw = oLastCommand.m_aParagraphBackgrounds[oLastCommand.m_aParagraphBackgrounds.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine, x, y);
                                }
                                else
                                {
                                    oLastCommand.m_aParagraphBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                                    oLastObjectToDraw = oLastCommand.m_aParagraphBackgrounds[oLastCommand.m_aParagraphBackgrounds.length - 1];
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case DRAW_COMMAND_TABLE:
                {
                    if(oLastCommand.m_aBorders.length === 0 || bStart2)
                    {
                        oBrushColor = this.m_oBrush.Color1;
                        oPenColor = this.m_oPen.Color;
                        oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                    }
                    oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];

                    if(bStart2)
                    {
                        if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                        {
                            oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine, x, y);
                        }
                        else
                        {
                            oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, x, y));
                            oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];
                        }
                    }
                    oLastObjectToDraw.geometry.bDrawSmart = true;
                    break;
                }
                case DRAW_COMMAND_PARAGRAPH:
                {
                    break;
                }
            }
        }
        else
        {
            if(this.m_oObjectToDraw)
            {
                oLastObjectToDraw = this.m_oObjectToDraw;
            }
        }

        if(oLastObjectToDraw && oLastObjectToDraw.geometry)
        {
            oLastObjectToDraw.Comment = this.m_oCurComment;
            if(oLastObjectToDraw.geometry.pathLst.length === 0 || bStart)
            {
                oPath = new AscFormat.Path();
                oPath.setPathW(this.pathW);
                oPath.setPathH(this.pathH);
                oPath.setExtrusionOk(false);
                oPath.setFill("none");
                oPath.setStroke(true);
                oLastObjectToDraw.geometry.AddPath(oPath)
            }
            else
            {
                oPath = oLastObjectToDraw.geometry.pathLst[oLastObjectToDraw.geometry.pathLst.length-1];
            }
        }
        return oPath;
    },


    transform : function(sx,shy,shx,sy,tx,ty)
    {
        if (this.m_oTransform.sx    != sx || this.m_oTransform.shx   != shx || this.m_oTransform.shy   != shy ||
            this.m_oTransform.sy    != sy || this.m_oTransform.tx    != tx || this.m_oTransform.ty    != ty)
        {
            this.m_oTransform.sx    = sx;
            this.m_oTransform.shx   = shx;
            this.m_oTransform.shy   = shy;
            this.m_oTransform.sy    = sy;
            this.m_oTransform.tx    = tx;
            this.m_oTransform.ty    = ty;
        }
    },
    // path commands
    _s : function()
    {
        if(this.m_bTurnOff)
            return;
        this.Get_PathToDraw(true);
    },
    _e : function()
    {
    },
    _z : function()
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.close();
        }
    },
    _m : function(x,y)
    {
        if(this.m_bTurnOff)
            return;
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.moveTo(this.xKoeff*x, this.yKoeff*y);
        }
        this.lastX = x;
        this.lastY = y;
    },
    _l : function(x,y)
    {

        if(this.m_bTurnOff)
            return;
        if(this.bCheckLines)
        {
            if(Math.abs(x - this.lastX) < EPSILON_TEXT_AUTOFIT && Math.abs(x - this.lastX) < Math.abs(y - this.lastY))
            {
                this.checkCurveBezier(this.lastX, this.lastY, this.lastX, this.lastY  + (y - this.lastY)/3, this.lastX, this.lastY + 2*(y - this.lastY)/3, x, y, PATH_DIV_EPSILON);
                this.lastX = x;
                this.lastY = y;
                return;
            }
            else if(Math.abs(y - this.lastY) < EPSILON_TEXT_AUTOFIT && Math.abs(y - this.lastY) < Math.abs(x - this.lastX))
            {
                this.checkCurveBezier(this.lastX, this.lastY, this.lastX + (x - this.lastX)/3, this.lastY, this.lastX + 2*(x - this.lastX)/3, this.lastY, x, y, PATH_DIV_EPSILON);
                this.lastX = x;
                this.lastY = y;
                return;
            }
        }
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.lnTo(this.xKoeff*x, this.yKoeff*y);
        }
        this.lastX = x;
        this.lastY = y;
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.cubicBezTo(this.xKoeff*x1, this.yKoeff*y1, this.xKoeff*x2, this.yKoeff*y2, this.xKoeff*x3, this.yKoeff*y3);
        }
        this.lastX = x3;
        this.lastY = y3;
    },
    _c2 : function(x1,y1,x2,y2)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.quadBezTo(this.xKoeff*x1, this.yKoeff*y1, this.xKoeff*x2, this.yKoeff*y2);
        }
        this.lastX = x2;
        this.lastY = y2;
    },
    ds : function()
    {
    },
    df : function()
    {
        var oPathToDraw = this.Get_PathToDraw();
        oPathToDraw.setFill("norm");
    },

    drawpath : function(type)
    {
    },

    // canvas state
    save : function()
    {
    },
    restore : function()
    {
    },
    clip : function()
    {
    },

    SetIntegerGrid: function()
    {
    },

    // images
    drawImage : function(img,x,y,w,h)
    {
    },

    SetFont : function(font)
    {
        if (null == font)
            return;

        var style = 0;
        if (font.Italic == true)
            style += 2;
        if (font.Bold == true)
            style += 1;

        var fontinfo = g_fontApplication.GetFontInfo(font.FontFamily.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);

        if (this.m_oFont.Name != fontinfo.Name)
        {
            this.m_oFont.Name = fontinfo.Name;
        }
        if (this.m_oFont.FontSize != font.FontSize)
        {
            this.m_oFont.FontSize = font.FontSize;
        }
        if (this.m_oFont.Style != style)
        {
            this.m_oFont.Style = style;
        }
    },
    FillText : function(x,y,text)
    {
        this.FillTextCode(x, y, text.charCodeAt(0));
    },
    FillTextCode : function(x,y,code)
    {
        //var _is_face_index_no_0 = (_font_info.faceIndexR <= 0 && _font_info.faceIndexI <= 0 && _font_info.faceIndexB <= 0 && _font_info.faceIndexBI <= 0);
//
        //if (code < 0xFFFF && (_is_face_index_no_0 || window["native"] !== undefined))
        //    return;

        if(this.m_bDivGlyphs === true)
        {
            this.Get_PathToDraw(false, true, x, y);
        }
        AscCommon.g_oTextMeasurer.SetFontInternal(this.m_oFont.Name, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0));

        if (null != this.LastFontOriginInfo.Replace)
        {
            code = g_fontApplication.GetReplaceGlyph(code, this.LastFontOriginInfo.Replace);
        }

        if (AscCommon.g_oTextMeasurer.m_oManager)
            AscCommon.g_oTextMeasurer.m_oManager.LoadStringPathCode(code, false, x, y, this);
    },
    tg : function(gid,x,y)
    {
        g_oTextMeasurer.SetFontInternal(this.m_oFont.Name, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0));
        g_oTextMeasurer.m_oManager.LoadStringPathCode(gid, true, x, y, this);
    },
    charspace : function(space)
    {
    },

    beginCommand : function(command)
    {
    },
    endCommand : function(command)
    {
    },

    put_PenLineJoin : function(_join)
    {
    },
    put_TextureBounds : function(x, y, w, h)
    {
    },
    put_TextureBoundsEnabled : function(bIsEnabled)
    {
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oGrFonts;
        var _lastFont = this.m_oFontSlotFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_HAnsi:
            default:
            {
                _lastFont.Name   = _rfonts.HAnsi.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
        }
        if (undefined !== fontSizeKoef)
            _lastFont.Size *= fontSizeKoef;

        var style = 0;
        if (_lastFont.Italic == true)
            style += 2;
        if (_lastFont.Bold == true)
            style += 1;

        var fontinfo = g_fontApplication.GetFontInfo(_lastFont.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);

        if (this.m_oFont.Name != fontinfo.Name)
        {
            this.m_oFont.Name = fontinfo.Name;
        }
        if (this.m_oFont.FontSize != _lastFont.Size)
        {
            this.m_oFont.FontSize = _lastFont.Size;
        }
        if (this.m_oFont.Style != style)
        {
            this.m_oFont.Style = style;
        }
    },

    BeginPage : function(width,height)
    {
    },
    EndPage : function()
    {
    },

    transform3 : function(m)
    {
        this.transform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
    },
    reset : function()
    {
        this.transform(1, 0, 0, 1, 0, 0);
    },

    FillText2 : function(x,y,text)
    {
        this.FillText(x,y,text);
    },
    GetIntegerGrid : function()
    {
    },
    GetFont : function()
    {
        return this.m_oFont;
    },
    put_GlobalAlpha : function(enable, alpha)
    {
    },

    Start_GlobalAlpha : function()
    {
    },

    End_GlobalAlpha : function()
    {
    },

    DrawHeaderEdit : function(yPos)
    {
    },

    DrawFooterEdit : function(yPos)
    {
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
    },

    drawSearchResult : function(x, y, w, h)
    {
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        // эта функция не для печати или сохранения вообще
    },
    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        // эта функция не для печати или сохранения вообще
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        // эта функция не для печати или сохранения вообще
    },

    DrawSpellingLine : function(y0, x0, x1, w)
    {
    },

    checkCurveBezier: function(x0, y0, x1, y1, x2, y2, x3, y3, dEpsilon)
    {
        var _epsilon = dEpsilon ? dEpsilon : UNDERLINE_DIV_EPSILON;
        var arr_point = AscFormat.partition_bezier4(x0, y0, x1, y1, x2, y2, x3, y3, _epsilon), i, count = arr_point.length >> 2;
        for(i = 0; i < count; ++i)
        {
            var k = 4*i;
            this._c(arr_point[k + 1].x, arr_point[k + 1].y, arr_point[k + 2].x, arr_point[k + 2].y, arr_point[k + 3].x, arr_point[k + 3].y);
        }
    },
    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW, bMath)
    {
        if(bMath)
        {
            var oTextPr = this.GetTextPr();
            var oCopyTextPr;
            if(oTextPr)
            {
                oCopyTextPr = oTextPr.Copy();
                oCopyTextPr.TextOutline = new AscFormat.CLn();
                oCopyTextPr.TextOutline.w = 36000.0 * penW >> 0;
                var oUnifill = oCopyTextPr.TextFill ? oCopyTextPr.TextFill : oCopyTextPr.Unifill;
                if((!oUnifill || !oUnifill.fill ||!oUnifill.fill.type === Asc.c_oAscFill._SOLID || !oUnifill.fill.color) && oCopyTextPr.Color)
                {
                    oUnifill = AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(oCopyTextPr.Color.r, oCopyTextPr.Color.g, oCopyTextPr.Color.b))
                }
                if(oUnifill)
                {
                    oCopyTextPr.TextOutline.Fill = oUnifill;
                }
                this.SetTextPr(oCopyTextPr, this.m_oTheme);
            }
            this._s();
            this._m(x, y);
            this._l(r, y);
            this.ds();
            if(oCopyTextPr)
            {
                this.SetTextPr(oTextPr, this.m_oTheme);
            }
            return;
        }

        this._s();
        this._m(x, y);

        this.checkCurveBezier(x, y, x + ((r-x)/3), y, x + (2/3) * (r - x), y, r, y);// this._l(r, y);
        this._l(r, y + penW);
        this.checkCurveBezier(r, y + penW, x + (2/3) * (r - x), y + penW, x + ((r-x)/3), y + penW, x, y + penW);//this._l(x, y + penW);
        this._z();
        this.ds();
        this.df();
    },



    drawHorLine2 : function(align, y, x, r, penW)
    {

        var _y = y;
        switch (align)
        {
            case 0:
            {
                _y = y + penW / 2;
                break;
            }
            case 1:
            {
                break;
            }
            case 2:
            {
                _y = y - penW / 2;
                break;
            }
        }
       // if(!AdditionalData)
       // {
       //     this.p_width(1000 * penW);
//
//
       //     this._s();
       //     this._m(x, (_y - penW));
       //     this._l(r, (_y - penW));
       //     this.ds();
//
       //     this._s();
       //     this._m(x, (_y + penW));
       //     this._l(r, (_y + penW));
       //     this.ds();
//
       //     this._e();
       // }
       // else
        {

            this._s();
            this._m(x, (_y - penW ));

            this.checkCurveBezier(x, _y - penW, x + ((r-x)/3), _y - penW, x + (2/3) * (r - x), _y - penW, r, _y - penW);//this._l(r, (_y - penW ));
            this._l(r, _y);
            this.checkCurveBezier(r, _y, x + (2/3) * (r - x), _y, x + ((r-x)/3), _y, x, _y);//this._l(x, (_y - penW + penW));
            this._z();
            this.ds();
            this.df();

            this._s();
            this._m(x, (_y + penW ));
            this.checkCurveBezier(x, _y + penW, x + ((r-x)/3), _y + penW, x + (2/3) * (r - x), _y + penW, r, _y + penW);//this._l(r, (_y + penW ));
            this._l(r, (_y + penW + penW));
            this.checkCurveBezier(r, (_y + penW + penW), x + (2/3) * (r - x), _y + penW + penW, x + ((r-x)/3), _y + penW + penW,  x, _y + penW + penW);//this._l(x, (_y + penW + penW));
            this._z();
            this.ds();

            this._e();
        }
    },

    drawVerLine : function(align, x, y, b, penW, bMath)
    {
        if(bMath)
        {
            var oTextPr = this.GetTextPr();
            var oCopyTextPr;
            if(oTextPr)
            {
                oCopyTextPr = oTextPr.Copy();
                oCopyTextPr.TextOutline = new AscFormat.CLn();
                oCopyTextPr.TextOutline.w = 36000.0 * penW >> 0;
                var oUnifill = oCopyTextPr.TextFill ? oCopyTextPr.TextFill : oCopyTextPr.Unifill;
                if((!oUnifill || !oUnifill.fill ||!oUnifill.fill.type === Asc.c_oAscFill.FILL_TYPE_SOLID || !oUnifill.fill.color) && oCopyTextPr.Color)
                {
                    oUnifill = AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(oCopyTextPr.Color.r, oCopyTextPr.Color.g, oCopyTextPr.Color.b))
                }
                if(oUnifill)
                {
                    oCopyTextPr.TextOutline.Fill = oUnifill;
                }
                this.SetTextPr(oCopyTextPr, this.m_oTheme);
            }
            this._s();

            var _x = x;
            switch (align)
            {
                case 0:
                {
                    _x = x + penW / 2;
                    break;
                }
                case 1:
                {
                    break;
                }
                case 2:
                {
                    _x = x - penW / 2;
                }
            }
            this._m(_x, y);
            this._l(_x, b);

            this.ds();
            if(oCopyTextPr)
            {
                this.SetTextPr(oTextPr, this.m_oTheme);
            }
            return;
        }

        var nLastCommand = this.m_aCommands[this.m_aCommands.length -1], bOldVal;
        if(nLastCommand === DRAW_COMMAND_TABLE)
        {
            bOldVal = this.bCheckLines;
            this.bCheckLines = false;
        }
        this.p_width(1000 * penW);
        this._s();

        var _x = x;
        switch (align)
        {
            case 0:
            {
                _x = x + penW / 2;
                break;
            }
            case 1:
            {
                break;
            }
            case 2:
            {
                _x = x - penW / 2;
            }
        }
        this._m(_x, y);
        this._l(_x, b);

        this.ds();
        if(nLastCommand === DRAW_COMMAND_TABLE)
        {
            this.bCheckLines = bOldVal;
        }
    },

    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        var nLastCommand = this.m_aCommands[this.m_aCommands.length -1];
        if(nLastCommand === DRAW_COMMAND_TABLE)
        {
            var bOldVal = this.bCheckLines;
            this.bCheckLines = false;
            this.p_width(penW * 1000);
            this._s();
            this._m(x, y);
            this._l(r, y);
            this.ds();
            this.bCheckLines = bOldVal;
        }
        else
        {
            this.drawHorLine(align, y, x + leftMW, r + rightMW, penW);
        }
    },

    DrawTextArtComment : function(Element)
    {
        this.m_oCurComment = Element;
        this.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
        this.df();
        this.m_oCurComment = null;
    },

    rect : function(x,y,w,h)
    {
        if(this.m_bTurnOff)
            return;
        var oLastCommand = this.m_aStack[this.m_aStack.length - 1];
        if(oLastCommand && (oLastCommand.m_nDrawType === 2 || oLastCommand.m_nDrawType === 4))
        {
            this.Get_PathToDraw(true, true);
            this._m(x, y);

            this.checkCurveBezier(x, y, x + (w/3), y, x + (2/3) *w, y, x+w, y);// this._l(r, y);
            this._l(x+w, y + h);
            this.checkCurveBezier(x + w, y + h, x + (2/3) * (w), y + h, x + (w/3), y + h, x, y + h);//this._l(x, y + penW);
            this._z();
            this.ds();
        }
        else
        {
            var _x = x;
            var _y = y;
            var _r = (x + w);
            var _b = (y + h);

            this.Get_PathToDraw(true, true);
            this._m(_x, _y);
            this._l(_r, _y);
            this._l(_r, _b);
            this._l(_x, _b);
            this._l(_x, _y);
        }
    },

    TableRect : function(x,y,w,h)
    {
        this.rect(x,y,w,h);
        this.df();
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        /*
         this.b_color1(0, 0, 0, 255);
         this.rect(x, y, w, h);
         this.df();
         return;
         */

        var __rect = new AscCommon._rect();
        __rect.x = x;
        __rect.y = y;
        __rect.w = w;
        __rect.h = h;
        this.GrState.AddClipRect(__rect);
    },

    RemoveClipRect : function()
    {
        //this.ClipManager.RemoveRect();
    },

    SetClip : function(r)
    {
        //this._s();
    },

    RemoveClip : function()
    {
    },

    GetTransform : function()
    {
        return this.m_oTransform;
    },
    GetLineWidth : function()
    {
        return 0;
    },
    GetPen : function()
    {
        return 0;
    },
    GetBrush : function()
    {
        return 0;
    },

    drawFlowAnchor : function(x, y)
    {
    },

    SavePen : function()
    {
        this.GrState.SavePen();
    },
    RestorePen : function()
    {
        this.GrState.RestorePen();
    },

    SaveBrush : function()
    {
        this.GrState.SaveBrush();
    },

    RestoreBrush : function()
    {
        this.GrState.RestoreBrush();
    },

    SavePenBrush : function()
    {
        this.GrState.SavePenBrush();
    },
    RestorePenBrush : function()
    {
        this.GrState.RestorePenBrush();
    },

    SaveGrState : function()
    {
        this.GrState.SaveGrState();
    },
    RestoreGrState : function()
    {
        this.GrState.RestoreGrState();
    },

    StartClipPath : function()
    {
        this.m_bTurnOff = true;
    },

    EndClipPath : function()
    {
        this.m_bTurnOff = false;
    },

    SetTextPr : function(textPr, theme)
    {
        var bNeedGetPath = false;
        if(!this.CheckCompareFillBrush(textPr, this.m_oTextPr))
        {
            bNeedGetPath = true;
        }
        this.m_oTextPr = textPr;
        if(bNeedGetPath)
        {
            this.Get_PathToDraw(false, true);
        }
        if (theme)
            this.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, this.m_oTextPr.RFonts);
        else
            this.m_oGrFonts = this.m_oTextPr.RFonts;
    },

    CheckCompareFillBrush: function(oTextPr1, oTextPr2)
    {
        if(!oTextPr1 && oTextPr2 || oTextPr1 && !oTextPr2)
            return false;
        if(oTextPr1 && oTextPr2)
        {
            var oFill1 = this.GetFillFromTextPr(oTextPr1);
            var oFill2 = this.GetFillFromTextPr(oTextPr2);
            if(!CompareBrushes(oFill1, oFill2))
                return false;
            var oPen1 = this.GetPenFromTextPr(oTextPr1);
            var oPen2 = this.GetPenFromTextPr(oTextPr2);
            if(!CompareBrushes(oPen1, oPen2))
                return false;
        }
        return true;
    },

    GetFillFromTextPr: function(oTextPr)
    {
        if(oTextPr)
        {
            if(oTextPr.TextFill)
            {
                if(AscFormat.isRealNumber(oTextPr.TextFill.transparent) && oTextPr.TextFill.transparent < 254.5){
                    var oRetFill = oTextPr.TextFill.createDuplicate();
                    oRetFill.transparent = 255.0 - oTextPr.TextFill.transparent;
                    return oRetFill;
                }
                return oTextPr.TextFill;
            }
            if(oTextPr.Unifill)
            {
                return oTextPr.Unifill;
            }
            if(oTextPr.Color)
            {
                return AscFormat.CreateUnfilFromRGB(oTextPr.Color.r, oTextPr.Color.g, oTextPr.Color.b)
            }
            return null;
        }
        else
        {
            if(this.m_oBrush.Color1.R !== -1)
            {
                var Color = this.m_oBrush.Color1;
                return AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(Color.R, Color.G, Color.B));
            }
            else
            {
                return AscFormat.CreateUniFillByUniColor(AscFormat.CreateUniColorRGB(0, 0, 0));
            }
        }
    },

    GetPenFromTextPr: function(oTextPr)
    {
        if(oTextPr)
        {
            return oTextPr.TextOutline;
        }
        return null;
    },

    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
    },

    private_removeVectors : function()
    {
    },

    private_restoreVectors : function()
    {
    }
};


function PolygonWrapper(oPolygon)
{
    this.oPolygon = oPolygon;
    var dCurLen = 0;
    this.aLength = [];
    this.aLength[0] = 0;
    var oPrevPoint = oPolygon[0], oCurPoint, dDX, dDY;
    for(var i = 1; i < oPolygon.length; ++i)
    {
        oCurPoint = oPolygon[i];
        dDX = oCurPoint.x - oPrevPoint.x;
        dDY = oCurPoint.y - oPrevPoint.y;
        dCurLen += Math.sqrt(dDX* dDX + dDY*dDY);
        this.aLength[i] = dCurLen;
        oPrevPoint = oCurPoint;
    }
    this.dLen = dCurLen;
    this.nPointsCount = this.aLength.length;
}

PolygonWrapper.prototype.getPointOnPolygon = function(dCT, bNeedPoints)
{
    var dFindLen = this.dLen * dCT;
    var nIndex = this.nPointsCount >> 1;
    var nStartIndex = 0, nDelta = nIndex - nStartIndex, dNextBool, nTempIndex;
    nTempIndex = nIndex + 1;
    dNextBool = (nTempIndex < this.nPointsCount) && (this.aLength[nTempIndex] <= dFindLen);
    while(nDelta > 0 && (this.aLength[nIndex] > dFindLen || dNextBool))
    {
        if(dNextBool)
        {
            nStartIndex = nIndex;
        }
        nIndex  = nStartIndex + (nDelta >> 1);
        nTempIndex = nIndex + 1;
        dNextBool = (nTempIndex < this.nPointsCount) && (this.aLength[nTempIndex] <= dFindLen);
        nDelta = nIndex - nStartIndex;
    }
    if(nTempIndex === this.nPointsCount)
    {
        --nTempIndex;
        --nIndex;
    }
    var t;
    var dDiv = this.aLength[nTempIndex] - this.aLength[nIndex];
    if(dDiv !== 0)
    {
        t = (dFindLen - this.aLength[nIndex])/dDiv;
    }
    else
    {
        t = 0;
    }

    var oPoint1 = this.oPolygon[nIndex], oPoint2 = this.oPolygon[nTempIndex];
    var oRetPoint1 = oPoint1, oRetPoint2 = oPoint2;
    if(bNeedPoints)
    {
        var nRightIndex = nTempIndex, nLeftIndex = nIndex;
        var oLeftPoint = oPoint1, oRightPoint = oPoint2;
        var dx = oPoint1.x - oPoint2.x, dy = oPoint1.y - oPoint2.y;
        while(nRightIndex + 1 < this.oPolygon.length && Math.abs(dx) < EPSILON_TEXT_AUTOFIT && Math.abs(dy) < EPSILON_TEXT_AUTOFIT)
        {

            dx =  oRightPoint.x - oLeftPoint.x;
            dy =  oRightPoint.y - oLeftPoint.y;
            oRightPoint = this.oPolygon[++nRightIndex]
        }
        while(nLeftIndex > 0 && Math.abs(dx) < EPSILON_TEXT_AUTOFIT && Math.abs(dy) < EPSILON_TEXT_AUTOFIT)
        {
            dx =  oRightPoint.x - oLeftPoint.x;
            dy =  oRightPoint.y - oLeftPoint.y;
            oLeftPoint = this.oPolygon[--nLeftIndex];
        }
        if(Math.abs(dx) < EPSILON_TEXT_AUTOFIT && Math.abs(dy) < EPSILON_TEXT_AUTOFIT)
        {
            oRetPoint1 = {x: oRetPoint1.x + EPSILON_TEXT_AUTOFIT, y: oRetPoint1.y};
        }
        else
        {
            oRetPoint1 = oLeftPoint;
            oRetPoint2 = oRightPoint;
        }
    }
    return {x: oPoint1.x + t*(oPoint2.x - oPoint1.x ), y: oPoint1.y + t*(oPoint2.y - oPoint1.y ), oP1: oRetPoint1, oP2: oRetPoint2};
};

function CheckPointByPaths(dX, dY, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2)
{
    var cX, cY, point, topX, topY, bottomX, bottomY;
    cX = (dX - dMinX)/dWidth;
    cY = (dY - dMinY)/dHeight;
    if(cX > 1)
    {
        cX = 1;
    }
    if(cX < 0)
    {
        cX = 0;
    }
    point = oPolygonWrapper1.getPointOnPolygon(cX);
    topX = point.x;
    topY = point.y;
    point = oPolygonWrapper2.getPointOnPolygon(cX);
    bottomX = point.x;
    bottomY = point.y;
    return {x: topX + cY*(bottomX - topX), y: topY + cY*(bottomY - topY)};
}
function ObjectsToDrawBetweenTwoPolygons(aObjectsToDraw, oBoundsController, oPolygonWrapper1, oPolygonWrapper2)
{
    var i, j, t, dMinX = oBoundsController.min_x, dMinY = oBoundsController.min_y, aPathLst, dWidth = oBoundsController.max_x - oBoundsController.min_x, dHeight = oBoundsController.max_y - oBoundsController.min_y;
    var oCommand, oPoint, oPath;
    for(i = 0; i < aObjectsToDraw.length; ++i)
    {
        aPathLst = aObjectsToDraw[i].geometry.pathLst;
        for(t = 0; t < aPathLst.length; ++t)
        {
            oPath = aPathLst[t];
            for(j = 0; j < oPath.ArrPathCommand.length; ++j)
            {
                oCommand = oPath.ArrPathCommand[j];
                switch(oCommand.id)
                {
                    case AscFormat.moveTo:
                    case AscFormat.lineTo:
                    {
                        oPoint = CheckPointByPaths(oCommand.X, oCommand.Y, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X = oPoint.x;
                        oCommand.Y = oPoint.y;
                        break;
                    }

                    case AscFormat.bezier3:
                    {
                        oPoint = CheckPointByPaths(oCommand.X0, oCommand.Y0, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X0 = oPoint.x;
                        oCommand.Y0 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X1, oCommand.Y1, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X1 = oPoint.x;
                        oCommand.Y1 = oPoint.y;
                        break;
                    }
                    case AscFormat.bezier4:
                    {
                        oPoint = CheckPointByPaths(oCommand.X0, oCommand.Y0, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X0 = oPoint.x;
                        oCommand.Y0 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X1, oCommand.Y1, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X1 = oPoint.x;
                        oCommand.Y1 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X2, oCommand.Y2, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X2 = oPoint.x;
                        oCommand.Y2 = oPoint.y;
                        break;
                    }
                    case AscFormat.arcTo:
                    {
                        break;
                    }
                    case AscFormat.close:
                    {
                        break;
                    }
                }
            }
        }
    }
}

function TransformPointGeometry(x, y, oTransform)
{
    var oRet = {x: 0, y: 0};
    oRet.x = oTransform.TransformPointX(x,y);
    oRet.y = oTransform.TransformPointY(x,y);
    return oRet;
}


function TransformGeometry(oObjectToDraw, oTransform)
{
    var oCommand, oPoint, oPath, t, j, aPathLst;
    aPathLst = oObjectToDraw.geometry.pathLst;
    for(t = 0; t < aPathLst.length; ++t)
    {
        oPath = aPathLst[t];
        for(j = 0; j < oPath.ArrPathCommand.length; ++j)
        {
            oCommand = oPath.ArrPathCommand[j];
            switch(oCommand.id)
            {
                case AscFormat.moveTo:
                case AscFormat.lineTo:
                {
                    oPoint = TransformPointGeometry(oCommand.X, oCommand.Y, oTransform);
                    oCommand.X = oPoint.x;
                    oCommand.Y = oPoint.y;
                    break;
                }

                case AscFormat.bezier3:
                {
                    oPoint = TransformPointGeometry(oCommand.X0, oCommand.Y0, oTransform);
                    oCommand.X0 = oPoint.x;
                    oCommand.Y0 = oPoint.y;
                    oPoint = TransformPointGeometry(oCommand.X1, oCommand.Y1, oTransform);
                    oCommand.X1 = oPoint.x;
                    oCommand.Y1 = oPoint.y;
                    break;
                }
                case AscFormat.bezier4:
                {
                    oPoint = TransformPointGeometry(oCommand.X0, oCommand.Y0, oTransform);
                    oCommand.X0 = oPoint.x;
                    oCommand.Y0 = oPoint.y;
                    oPoint = TransformPointGeometry(oCommand.X1, oCommand.Y1, oTransform);
                    oCommand.X1 = oPoint.x;
                    oCommand.Y1 = oPoint.y;
                    oPoint = TransformPointGeometry(oCommand.X2, oCommand.Y2, oTransform);
                    oCommand.X2 = oPoint.x;
                    oCommand.Y2 = oPoint.y;
                    break;
                }
                case AscFormat.arcTo:
                {
                    break;
                }
                case AscFormat.close:
                {
                    break;
                }
            }
        }

    }
}

function TransformPointPolygon(x, y, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds)
{
    var oRet = {x: 0, y: 0}, y0, y1, cX, oPointOnPolygon, x1t, y1t, dX, dY, x0t, y0t;
    y0 = y;//dKoeff;
    if(bFlag)
    {
        y1 = 0;
		if(oBounds)
		{
			y0 -= oBounds.min_y;
		}
    }
    else
    {
        y1 = ContentHeight*dKoeff;
        if(oBounds)
        {
            y1 = (oBounds.max_y - oBounds.min_y);
			y0 -= oBounds.min_y;
        }
    }
    cX = x/XLimit;
    oPointOnPolygon = oPolygon.getPointOnPolygon(cX, true);
    x1t = oPointOnPolygon.x;
    y1t = oPointOnPolygon.y;
    dX = oPointOnPolygon.oP2.x - oPointOnPolygon.oP1.x;
    dY = oPointOnPolygon.oP2.y - oPointOnPolygon.oP1.y;

    if(bFlag)
    {
        dX = -dX;
        dY = -dY;
    }
    var dNorm = Math.sqrt(dX*dX + dY*dY);

    if(bFlag)
    {
        x0t = x1t + (dY/dNorm)*(y0);
        y0t = y1t - (dX/dNorm)*(y0);
    }
    else
    {

        x0t = x1t + (dY/dNorm)*(y1 - y0);
        y0t = y1t - (dX/dNorm)*(y1 - y0);
    }
    oRet.x = x0t;
    oRet.y = y0t;
    return oRet;
}

function CheckGeometryByPolygon(oObjectToDraw, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds)
{
    var oCommand, oPoint, oPath, t, j, aPathLst;
    aPathLst = oObjectToDraw.geometry.pathLst;
    for(t = 0; t < aPathLst.length; ++t)
    {
        oPath = aPathLst[t];
        for(j = 0; j < oPath.ArrPathCommand.length; ++j)
        {
            oCommand = oPath.ArrPathCommand[j];
            switch(oCommand.id)
            {
                case AscFormat.moveTo:
                case AscFormat.lineTo:
                {
                    oPoint = TransformPointPolygon(oCommand.X, oCommand.Y, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X = oPoint.x;
                    oCommand.Y = oPoint.y;
                    break;
                }

                case AscFormat.bezier3:
                {
                    oPoint = TransformPointPolygon(oCommand.X0, oCommand.Y0, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X0 = oPoint.x;
                    oCommand.Y0 = oPoint.y;
                    oPoint = TransformPointPolygon(oCommand.X1, oCommand.Y1, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X1 = oPoint.x;
                    oCommand.Y1 = oPoint.y;
                    break;
                }
                case AscFormat.bezier4:
                {
                    oPoint = TransformPointPolygon(oCommand.X0, oCommand.Y0, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X0 = oPoint.x;
                    oCommand.Y0 = oPoint.y;
                    oPoint = TransformPointPolygon(oCommand.X1, oCommand.Y1, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X1 = oPoint.x;
                    oCommand.Y1 = oPoint.y;
                    oPoint = TransformPointPolygon(oCommand.X2, oCommand.Y2, oPolygon, bFlag, XLimit, ContentHeight, dKoeff, oBounds);
                    oCommand.X2 = oPoint.x;
                    oCommand.Y2 = oPoint.y;
                    break;
                }
                case AscFormat.arcTo:
                {
                    break;
                }
                case AscFormat.close:
                {
                    break;
                }
            }
        }

    }
}

function CompareBrushes(oFill1, oFill2)
{
    if(oFill1 && !oFill2 || !oFill1 && oFill2 || (oFill1 && oFill2 && !oFill1.IsIdentical(oFill2)))
        return false;
    return true;
}
function ComparePens(oPen1, oPen2)
{
    if(oPen1 && !oPen2 || !oPen1 && oPen2 || (oPen1 && oPen2 && !oPen1.IsIdentical(oPen2)))
        return false;
    return true;
}


function GetRectContentWidth(oContent, dMaxWidth)
{
    var _maxWidth = AscFormat.isRealNumber(dMaxWidth) ? dMaxWidth : 100000;

    oContent.Reset(0, 0, _maxWidth, 100000);
    oContent.Recalculate_Page(0, true);
    var max_width = 0;
    for(var i = 0; i < oContent.Content.length; ++i)
    {
        var par = oContent.Content[i];

        if(par instanceof Paragraph)
        {
            for(var j = 0; j < par.Lines.length; ++j)
            {
                if(par.Lines[j].Ranges[0].W  > max_width)
                {
                    max_width = par.Lines[j].Ranges[0].W;
                }
            }
        }
    }
    return max_width + 2;
}

    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].PATH_DIV_EPSILON = PATH_DIV_EPSILON;
    window['AscFormat'].ParaDrawingStruct = ParaDrawingStruct;
    window['AscFormat'].DRAW_COMMAND_TABLE = DRAW_COMMAND_TABLE;
    window['AscFormat'].DRAW_COMMAND_CONTENT = DRAW_COMMAND_CONTENT;
    window['AscFormat'].DRAW_COMMAND_PARAGRAPH = DRAW_COMMAND_PARAGRAPH;
    window['AscFormat'].DRAW_COMMAND_LINE = DRAW_COMMAND_LINE;
    window['AscFormat'].DRAW_COMMAND_DRAWING = DRAW_COMMAND_DRAWING;
    window['AscFormat'].DRAW_COMMAND_HIDDEN_ELEM = DRAW_COMMAND_HIDDEN_ELEM;
    window['AscFormat'].DRAW_COMMAND_NO_CREATE_GEOM = DRAW_COMMAND_NO_CREATE_GEOM;
    window['AscFormat'].DRAW_COMMAND_TABLE_ROW = DRAW_COMMAND_TABLE_ROW;
    window['AscFormat'].CreatePenFromParams = CreatePenFromParams;
    window['AscFormat'].CTextDrawer = CTextDrawer;
    window['AscFormat'].PolygonWrapper = PolygonWrapper;
    window['AscFormat'].GetRectContentWidth = GetRectContentWidth;
})(window);
