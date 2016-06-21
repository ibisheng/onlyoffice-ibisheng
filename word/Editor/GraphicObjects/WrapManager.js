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


// Import
var History = AscCommon.History;

var WRAP_TEXT_SIDE_BOTH_SIDES = 0x00;
var WRAP_TEXT_SIDE_LARGEST = 0x01;
var WRAP_TEXT_SIDE_LEFT = 0x02;
var WRAP_TEXT_SIDE_RIGHT = 0x03;

var APPROXIMATE_ANGLE = 0.3;
function CWrapPolygon(wordGraphicObject)
{
    this.calculatedPoints = [];
    this.arrPoints = [];
    this.relativeArrPoints = [];

    this.edited = false;

    this.wrapSide = WRAP_TEXT_SIDE_BOTH_SIDES;


    this.posX = null;
    this.posY = null;

    this.left = null;
    this.top = null;
    this.right = null;
    this.bottom = null;

    this.localLeft = null;
    this.localTop = null;
    this.localRight = null;
    this.localBottom = null;

    this.wordGraphicObject = wordGraphicObject;

    AscCommon.g_oTableId.Add( this, AscCommon.g_oIdCounter.Get_NewId());
}

CWrapPolygon.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_WrapPolygon;
    },

    setEdited: function(pr)
    {
        History.Add(this, {Type: AscDFH.historyitem_WrapPolygonSetEdited, oldPr: this.edited, newPr: pr});
        this.edited = pr;
    },

    setArrRelPoints: function(pr)
    {
        History.Add(this, {Type:AscDFH.historyitem_WrapPolygonSetRelPoints, oldPr: this.relativeArrPoints, newPr: pr});
        this.relativeArrPoints = pr;
    },

    setWrapSide: function(pr)
    {
        History.Add(this, {Type: AscDFH.historyitem_WrapPolygonSetWrapSide, oldPr: this.wrapSide, newPr: pr});
        this.wrapSide = pr;
    },


    fromOther: function(wrapPolygon)
    {
        if(!wrapPolygon)
            return;
        if(this.edited !== wrapPolygon.edited)
        {
            this.setEdited(wrapPolygon.edited);
        }
        var rel = [];
        for(var i = 0; i < wrapPolygon.relativeArrPoints.length; ++i)
        {
            rel.push({x: wrapPolygon.relativeArrPoints[i].x, y: wrapPolygon.relativeArrPoints[i].y});
        }
        this.setArrRelPoints(rel);

        if(this.wrapSide !== wrapPolygon.wrapSide)
        {
            this.setWrapSide(wrapPolygon.wrapSide);
        }
    },

    Write_ToBinary2: function(writer)
    {
        writer.WriteLong(AscDFH.historyitem_type_WrapPolygon);
        writer.WriteString2(this.Get_Id());
        AscFormat.writeObject(writer, this.wordGraphicObject);
    },

    Read_FromBinary2: function(reader)
    {
        this.Id = reader.GetString2();
        this.wordGraphicObject = AscFormat.readObject(reader);
    },

    Load_LinkData: function(data)
    {
    },

    getIntersection: function(y)
    {
        var min_x = null;
        var max_x = null;

        var cur_max_x;
        var cur_min_x;
        var point_count = this.calculatedPoints.length;
        if(point_count === 0)
        {
            return {max: null, min: null};
        }
        for(var point_index = 1; point_index < point_count; ++point_index)
        {
            var point0 = this.calculatedPoints[point_index-1];
            var point1 = this.calculatedPoints[point_index];
            if(!(point0.y > y && point1.y > y || point0.y < y && point1.y < y ))
            {
                if(point0.y === point1.y)
                {
                    cur_max_x = Math.max(point0.x, point1.x);
                    cur_min_x = Math.min(point0.x, point1.x);
                }
                else
                {
                    if(point0.x === point1.x)
                    {
                        cur_max_x = point0.x;
                        cur_min_x = point0.x;
                    }
                    else
                    {
                        cur_max_x = ((y - point0.y)/(point1.y - point0.y))*(point1.x - point0.x) + point0.x;
                        cur_min_x = cur_max_x;
                    }
                }
                if(max_x === null)
                {
                    max_x = cur_max_x;
                    min_x = cur_min_x;
                }
                else
                {
                    if(cur_max_x > max_x)
                        max_x = cur_max_x;
                    if(cur_min_x < min_x)
                        min_x = cur_min_x;
                }
            }
        }
        point0 = this.calculatedPoints[point_count-1];
        point1 = this.calculatedPoints[0];
        if(!(point0.y > y && point1.y > y || point0.y < y && point1.y < y ))
        {
            if(point0.y === point1.y)
            {
                cur_max_x = Math.max(point0.x, point1.x);
                cur_min_x = Math.min(point0.x, point1.x);
            }
            else
            {
                if(point0.x === point1.x)
                {
                    cur_max_x = point0.x;
                    cur_min_x = point0.x;
                }
                else
                {
                    cur_max_x = ((y - point0.y)/(point1.y - point0.y))*(point1.x - point0.x) + point0.x;
                    cur_min_x = cur_max_x;
                }
            }
            if(max_x === null)
            {
                max_x = cur_max_x;
                min_x = cur_min_x;
            }
            else
            {
                if(cur_max_x > max_x)
                    max_x = cur_max_x;
                if(cur_min_x < min_x)
                    min_x = cur_min_x;
            }
        }
        return {max: max_x, min: min_x};
    },

    getArrayWrapIntervals: function(x0, y0, x1, y1, LeftField, RightField, ret, bMathWrap)
    {
        if(y1 - this.top < 0.0001 || this.bottom - y0 < 0.0001 || true !== this.wordGraphicObject.useWrap)
            return ret;

        var ret2 = [];
        var nWrapType, nWrapSide;
        if(bMathWrap === true)
        {
            nWrapType = WRAPPING_TYPE_SQUARE;
			nWrapSide = WRAP_TEXT_SIDE_BOTH_SIDES;
        }
        else
        {
            nWrapType = this.wordGraphicObject.wrappingType;
            nWrapSide = this.wrapSide;
        }
        switch(nWrapType)
        {
            case WRAPPING_TYPE_NONE:
            {
                return ret;
            }
            case WRAPPING_TYPE_SQUARE:
            {
                switch(nWrapSide)
                {
                    case WRAP_TEXT_SIDE_BOTH_SIDES:
                    {
                        if(this.wordGraphicObject.wrappingType === WRAPPING_TYPE_THROUGH || this.wordGraphicObject.wrappingType === WRAPPING_TYPE_TIGHT)
                        {
                            var oDistanse = this.wordGraphicObject.Get_Distance();
                            ret2.push({X0: this.left + oDistanse.L, X1: this.right - oDistanse.R, Y1: this.bottom});
                        }
                        else
                        {
                            ret2.push({X0: this.left, X1: this.right, Y1: this.bottom});

                        }
                        break;
                    }
                    case WRAP_TEXT_SIDE_LARGEST:
                    {
                        if(RightField - this.right > 0 && RightField - this.right >  this.left -LeftField)
                            ret2.push({X0: LeftField, X1: this.right, Y1: this.bottom});
                        else if(this.left - LeftField > 0 && this.left - LeftField > RightField - this.right)
                        {
                            ret2.push({X0: this.left, X1: RightField, Y1: this.bottom});
                        }
                        break;
                    }
                    case WRAP_TEXT_SIDE_LEFT:
                    {
                        if(this.left > LeftField)
                        {
                            ret2.push({X0: this.left, X1: RightField, Y1: this.bottom});
                        }
                        break;
                    }
                    case WRAP_TEXT_SIDE_RIGHT:
                    {
                        if(this.right < RightField)
                        {
                            ret2.push({X0: LeftField, X1: this.right, Y1: this.bottom});
                        }
                        break;
                    }
                }
                break;
            }
            case WRAPPING_TYPE_TOP_AND_BOTTOM:
            {
                if (this.right < LeftField || this.left > RightField)
                    return ret;

                ret2.push({X0: x0, X1: x1, Y1: this.bottom});
                break;
            }
            case WRAPPING_TYPE_THROUGH:
            case WRAPPING_TYPE_TIGHT:
            {

                var intersection_top = this.getIntersection(y0);
                var intersection_bottom = this.getIntersection(y1);

                var max_x = null;
                var min_x = null;
                if(intersection_top.max !== null)
                    max_x = intersection_top.max;
                if(intersection_top.min !== null)
                    min_x = intersection_top.min;

                if(intersection_bottom.max !== null)
                {
                    if(max_x === null)
                        max_x = intersection_bottom.max;
                    else
                    {
                        if(intersection_bottom.max > max_x)
                            max_x = intersection_bottom.max;
                    }
                }

                if(intersection_bottom.min !== null)
                {
                    if(min_x === null)
                        min_x = intersection_bottom.min;
                    else
                    {
                        if(intersection_bottom.min < min_x)
                            min_x = intersection_bottom.min;
                    }
                }


                var arr_points = this.calculatedPoints;
                var point_count = arr_points.length;
                var between_flag = false;
                for(var point_index = 0; point_index < point_count; ++point_index)
                {
                    var cur_point = arr_points[point_index];
                    if(cur_point.y > y0 && cur_point.y < y1)
                    {
                        between_flag = true;
                        if(max_x === null)
                            max_x = cur_point.x;
                        else
                        {
                            if(max_x < cur_point.x)
                                max_x = cur_point.x;
                        }
                        if(min_x === null)
                            min_x = cur_point.x;
                        else
                        {
                            if(min_x > cur_point.x)
                                min_x = cur_point.x;
                        }
                    }
                }

                if(max_x !== null && min_x !== null)
                {
                    var oDistance = this.wordGraphicObject.Get_Distance();
                    max_x+= oDistance.R;
                    min_x-= oDistance.L;
                    switch(nWrapSide)
                    {
                        case WRAP_TEXT_SIDE_BOTH_SIDES:
                        {
                            ret2.push({X0: min_x, X1: max_x, Y1: y1});
                            break;
                        }
                        case WRAP_TEXT_SIDE_LARGEST:
                        {
                            if(RightField - max_x > 0 && RightField - max_x >  min_x -LeftField)
                                ret2.push({X0: LeftField, X1: max_x, Y1: y1});
                            else if(min_x - LeftField > 0 && min_x - LeftField > RightField - max_x)
                            {
                                ret2.push({X0: min_x, X1: RightField, Y1: y1});
                            }
                            break;
                        }
                        case WRAP_TEXT_SIDE_LEFT:
                        {
                            ret2.push({X0: Math.max(min_x, LeftField), X1: RightField, Y1: y1});
                            break;
                        }
                        case WRAP_TEXT_SIDE_RIGHT:
                        {
                            ret2.push({X0: LeftField, X1: Math.min(max_x, RightField), Y1: y1});
                            break;
                        }
                    }
                }

                break;
            }
        }
        ret2.sort(function(a, b){return a.X0 - b.X0});
        if(ret2.length > 0 &&  (nWrapType === WRAPPING_TYPE_SQUARE || nWrapType === WRAPPING_TYPE_TIGHT || nWrapType === WRAPPING_TYPE_THROUGH))
        {
            var dx = nWrapType === WRAPPING_TYPE_SQUARE ? 6.35 : 3.175 ;
            if(ret2[0].X0  < LeftField + dx)
            {
                ret2[0].X0 = x0 ;
            }
            ret2.sort(function(a, b){ return a.X1 - b.X1});
            if(ret2[ret2.length - 1].X1 > RightField - dx)
            {
                ret2[ret2.length - 1].X1 = x1;
            }
        }
        for(var s = 0; s < ret2.length; ++s)
        {
            ret2[s].typeLeft = this.wordGraphicObject.wrappingType;
            ret2[s].typeRight = this.wordGraphicObject.wrappingType;
        }
        for(s = 0; s < ret2.length; ++s)
        {
            ret.push(ret2[s]);
        }

        return ret;

    },

    checkBottomNaN: function(arr)
    {
        for(var i = 0; i < arr.length; ++i)
        {
            if(isNaN(arr[i].Y1))
                return true;
        }
        return false;
    },

    isRect: function()
    {
        if(this.arrPoints.length === 4)
        {
            if(Math.abs(this.arrPoints[0].y - this.arrPoints[1].y) < 0.01
                && Math.abs(this.arrPoints[1].x - this.arrPoints[2].x) < 0.01
                && Math.abs(this.arrPoints[2].y - this.arrPoints[3].y) < 0.01
                && Math.abs(this.arrPoints[3].x - this.arrPoints[0].x) < 0.01
                || Math.abs(this.arrPoints[0].x - this.arrPoints[1].x) < 0.01
                && Math.abs(this.arrPoints[1].y - this.arrPoints[2].y) < 0.01
                && Math.abs(this.arrPoints[2].x - this.arrPoints[3].x) < 0.01
                && Math.abs(this.arrPoints[3].y - this.arrPoints[0].y) < 0.01
                )
            {
                return true;
            }
        }
        return false;
    },


    calculate: function(drawing)
    {
        var arrPolygons = drawing.getArrayWrapPolygons();
        var transform = new AscCommon.CMatrix();
        var arrEdges = [];
        var arrPoints = [];
        var polygonsCount = arrPolygons.length;
        for(var polygon_index=0; polygon_index < polygonsCount; ++polygon_index)
        {
            var cur_polygon = arrPolygons[polygon_index];
            var curLen = cur_polygon.length;

            if (curLen < 2)
                continue;

            var polygon_point0 = new CPolygonPoint();
            polygon_point0.x = transform.TransformPointX(cur_polygon[0].x, cur_polygon[0].y);
            polygon_point0.y = transform.TransformPointY(cur_polygon[0].x, cur_polygon[0].y);
            arrPoints.push(polygon_point0);

            for(var point_index = 1; point_index < curLen; ++point_index)
            {
                var transformed_x1 = transform.TransformPointX(cur_polygon[point_index].x, cur_polygon[point_index].y);
                var transformed_y1 = transform.TransformPointY(cur_polygon[point_index].x, cur_polygon[point_index].y);

                if (Math.abs(transformed_x1 - polygon_point0.x) < AscFormat.APPROXIMATE_EPSILON && Math.abs(transformed_y1 - polygon_point0.y) < AscFormat.APPROXIMATE_EPSILON)
                    continue;

                var _prev = polygon_point0;

                polygon_point0 = new CPolygonPoint();
                polygon_point0.x = transformed_x1;
                polygon_point0.y = transformed_y1;

                arrPoints.push(polygon_point0);
                arrEdges.push(new AscFormat.GraphEdge(_prev, polygon_point0));
            }
        }
        if(arrPoints.length < 2)
        {
            return [];
        }
        arrEdges.sort(function(a, b){return Math.min(a.point1.y, a.point2.y) - Math.min(b.point1.y, b.point2.y)});
        arrPoints.sort(function(a, b){return a.y - b.y});

        for(point_index = 0; point_index < arrPoints.length; ++point_index)
        {
            var cur_point = arrPoints[point_index];
            for(var point_index2 = point_index + 1; point_index2 < arrPoints.length-1; ++point_index2)
            {
                if(Math.abs(arrPoints[point_index2].y - cur_point.y) < AscFormat.APPROXIMATE_EPSILON2 && Math.abs(arrPoints[point_index2].x - cur_point.x) < AscFormat.APPROXIMATE_EPSILON2)
                {
                    arrPoints.splice(point_index2, 1);
                    --point_index2;
                }
                else
                {
                    if(Math.abs(arrPoints[point_index2].y - cur_point.y) >= AscFormat.APPROXIMATE_EPSILON2)
                        break;
                }
            }
        }
        var left_path_arr = [];
        var right_path_arr = [];
        var cur_start_index = 0;
        var cur_x_min, cur_x_max;
        var cur_y;
        var x_min = null, x_max = null;

        var edgesCount = arrEdges.length;
        for(point_index = 0;  point_index < arrPoints.length; ++point_index)
        {
            cur_point = arrPoints[point_index];
            cur_x_min = cur_point.x;
            cur_x_max = cur_point.x;
            cur_y = cur_point.y;
            for(var edge_index = cur_start_index; edge_index < edgesCount; ++edge_index)
            {
                if(arrEdges[edge_index].point2.y >= cur_y)
                {
                    cur_start_index = edge_index;
                    break;
                }
            }

            for(edge_index = cur_start_index; edge_index < edgesCount; ++edge_index)
            {
                var cur_edge = arrEdges[edge_index];

                var inter = cur_edge.getIntersectionPointX(cur_y);
                if (inter != null)
                {
                    if (inter.length == 1)
                    {
                        if(inter[0] < cur_x_min)
                            cur_x_min = inter[0];
                        if(inter[0] > cur_x_max)
                            cur_x_max = inter[0];
                    }
                    else
                    {
                        if(inter[0] < cur_x_min)
                            cur_x_min = inter[0];
                        if(inter[1] > cur_x_max)
                            cur_x_max = inter[1];
                    }
                }
            }
            if(cur_x_max <= cur_x_min)
            {
                var t_min, t_max;
                t_min = Math.min(cur_x_min, cur_x_max) - 2;
                t_max = Math.max(cur_x_min, cur_x_max) + 2;
                cur_x_max = t_max;
                cur_x_min = t_min;
            }

            left_path_arr.push({x: cur_x_min, y: cur_y});
            right_path_arr.push({x: cur_x_max, y: cur_y});

            if(x_max === null)
                x_max = cur_x_max;
            else
            {
                if(cur_x_max > x_max)
                    x_max = cur_x_max;
            }
            if(x_min === null)
                x_min = cur_x_min;
            else
            {
                if(cur_x_min < x_min)
                    x_min = cur_x_min;
            }
        }

        for(point_index = 1; point_index < left_path_arr.length - 1; ++point_index)
        {
            var point_prev = left_path_arr[point_index - 1];
            var point_last = left_path_arr[point_index + 1];
            var dx_prev = point_prev.x - left_path_arr[point_index].x;
            var dy_prev = point_prev.y - left_path_arr[point_index].y;
            var dx_last = point_last.x - left_path_arr[point_index].x;
            var dy_last = point_last.y - left_path_arr[point_index].y;

            var l_prev = Math.sqrt(dx_prev*dx_prev + dy_prev*dy_prev);
            var l_last = Math.sqrt(dx_last*dx_last + dy_last*dy_last);
            if(l_prev === 0 || l_last === 0)
            {
                left_path_arr.splice(point_index, 1);
                --point_index;
            }
            if(l_prev < AscFormat.APPROXIMATE_EPSILON3 && l_last < AscFormat.APPROXIMATE_EPSILON3 && Math.abs(Math.acos((dx_last*dx_prev + dy_last*dy_prev)/(l_last*l_prev)) - Math.PI) < APPROXIMATE_ANGLE)
            {
                left_path_arr.splice(point_index, 1);
                --point_index;
            }
        }

        for(point_index = 1; point_index < right_path_arr.length - 1; ++point_index)
        {
            point_prev = right_path_arr[point_index - 1];
            point_last = right_path_arr[point_index + 1];
            dx_prev = point_prev.x - right_path_arr[point_index].x;
            dy_prev = point_prev.y - right_path_arr[point_index].y;
            dx_last = point_last.x - right_path_arr[point_index].x;
            dy_last = point_last.y - right_path_arr[point_index].y;

            l_prev = Math.sqrt(dx_prev*dx_prev + dy_prev*dy_prev);
            l_last = Math.sqrt(dx_last*dx_last + dy_last*dy_last);
            if(l_prev === 0 || l_last === 0)
            {
                right_path_arr.splice(point_index, 1);
                --point_index;
            }
            if(l_prev < AscFormat.APPROXIMATE_EPSILON3 && l_last < AscFormat.APPROXIMATE_EPSILON3 && Math.abs(Math.acos((dx_last*dx_prev + dy_last*dy_prev)/(l_last*l_prev)) - Math.PI) < APPROXIMATE_ANGLE)
            {
                right_path_arr.splice(point_index, 1);
                --point_index;
            }
        }

        var aPoints = [];
        aPoints.push(left_path_arr[0]);
        for(point_index = 0; point_index < right_path_arr.length; ++point_index)
        {
            aPoints.push(right_path_arr[point_index]);
        }
        for(point_index =  left_path_arr.length - 1; point_index > 0; --point_index)
        {
            aPoints.push(left_path_arr[point_index]);
        }
        return this.calculateAbsToRel(drawing, aPoints);
    },

    calculateRelToAbs: function(transform, drawing)
    {

        var bounds = drawing.bounds, oDistance = drawing.parent.Get_Distance(), oEffectExtent = drawing.parent.EffectExtent;
        if(this.relativeArrPoints.length === 0)
        {
            this.arrPoints.length = 0;
            this.localLeft = bounds.l - oDistance.L - AscFormat.getValOrDefault(oEffectExtent.L, 0);
            this.localRight = bounds.r + oDistance.R + AscFormat.getValOrDefault(oEffectExtent.R, 0);
            this.localTop = bounds.t - oDistance.T - AscFormat.getValOrDefault(oEffectExtent.T, 0);
            this.localBottom = bounds.b + oDistance.B + AscFormat.getValOrDefault(oEffectExtent.B, 0);
            return;
        }
        var relArr = this.relativeArrPoints;
        var absArr = this.arrPoints;
        absArr.length = 0;
        for(var point_index = 0; point_index < relArr.length; ++point_index)
        {
            var rel_point = relArr[point_index];
            var tr_x = (transform.TransformPointX(rel_point.x*drawing.extX/21600, rel_point.y*drawing.extY/21600));
            var tr_y = (transform.TransformPointY(rel_point.x*drawing.extX/21600, rel_point.y*drawing.extY/21600));
            absArr[point_index] = {x: tr_x, y:tr_y};
        }

        var min_x, max_x, min_y, max_y;
        min_x = absArr[0].x;
        max_x = min_x;
        min_y = absArr[0].y;
        max_y = min_y;

        for(point_index = 0; point_index < absArr.length; ++point_index)
        {
            var absPoint = absArr[point_index];
            if(min_x > absPoint.x)
                min_x = absPoint.x;
            if(max_x < absPoint.x)
                max_x = absPoint.x;

            if(min_y > absPoint.y)
                min_y = absPoint.y;
            if(max_y < absPoint.y)
                max_y = absPoint.y;
        }

        if(bounds.l < min_x)
            this.localLeft = bounds.l - oDistance.L  - AscFormat.getValOrDefault(oEffectExtent.L, 0);
        else
            this.localLeft  = min_x - oDistance.L  - AscFormat.getValOrDefault(oEffectExtent.L, 0);

        if(bounds.r > max_x)
            this.localRight = bounds.r + oDistance.R + AscFormat.getValOrDefault(oEffectExtent.R, 0);
        else
            this.localRight = max_x + oDistance.R + AscFormat.getValOrDefault(oEffectExtent.R, 0);

        if(bounds.t < min_y)
            this.localTop = bounds.t - oDistance.T - AscFormat.getValOrDefault(oEffectExtent.T, 0);
        else
            this.localTop = min_y - oDistance.T - AscFormat.getValOrDefault(oEffectExtent.T, 0);

        if(bounds.b > max_y)
            this.localBottom = bounds.b + oDistance.B + AscFormat.getValOrDefault(oEffectExtent.B, 0);
        else
            this.localBottom = max_y + oDistance.B + AscFormat.getValOrDefault(oEffectExtent.B, 0);
    },

    calculateAbsToRel: function(drawing, aPoints)
    {
        var relArr = [];
        if(aPoints.length === 0)
        {
            return relArr;
        }
        var transform = drawing.localTransform;
        var invert_transform = AscCommon.global_MatrixTransformer.Invert(transform);
        for(var point_index = 0; point_index < aPoints.length; ++point_index)
        {
            var abs_point = aPoints[point_index];
            var tr_x = invert_transform.TransformPointX(abs_point.x, abs_point.y)*(21600/drawing.extX)>>0;
            var tr_y = invert_transform.TransformPointY(abs_point.x, abs_point.y)*(21600/drawing.extY)>>0;
            relArr[point_index] = {x: tr_x, y:tr_y};
        }

        var min_x, max_x, min_y, max_y;
        min_x = aPoints[0].x;
        max_x = min_x;
        min_y = aPoints[0].y;
        max_y = min_y;

        for(point_index = 0; point_index < aPoints.length; ++point_index)
        {
            var absPoint = aPoints[point_index];
            if(min_x > absPoint.x)
                min_x = absPoint.x;
            if(max_x < absPoint.x)
                max_x = absPoint.x;

            if(min_y > absPoint.y)
                min_y = absPoint.y;
            if(max_y < absPoint.y)
                max_y = absPoint.y;
        }
        return relArr;
    },

    updatePosition: function(x, y)
    {
        this.posX = x;
        this.posY = y;
        this.calculatedPoints.length = 0;
        var p, local_point;
        for(var i = 0;  i < this.arrPoints.length; ++i)
        {
            local_point = this.arrPoints[i];
            p = new CPolygonPoint();
            p.x = (local_point.x + x);
            p.y = (local_point.y + y);
            this.calculatedPoints.push(p);
        }
        this.left   = this.localLeft + x;
        this.top    = this.localTop + y;
        this.right  = this.localRight + x;
        this.bottom = this.localBottom + y;
    },


    Undo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_WrapPolygonSetEdited:
            {
                this.edited = data.oldPr;
                break;
            }
            case AscDFH.historyitem_WrapPolygonSetRelPoints:
            {
                this.relativeArrPoints = data.oldPr;
                break;
            }
            case AscDFH.historyitem_WrapPolygonSetWrapSide:
            {
                this.wrapSide = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_WrapPolygonSetEdited:
            {
                this.edited = data.newPr;
                break;
            }
            case AscDFH.historyitem_WrapPolygonSetRelPoints:
            {
                this.relativeArrPoints = data.newPr;
                break;
            }

            case AscDFH.historyitem_WrapPolygonSetWrapSide:
            {
                this.wrapSide = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, writer)
    {
        writer.WriteLong(AscDFH.historyitem_type_WrapPolygon);
        writer.WriteLong(data.Type);
        switch(data.Type)
        {
            case AscDFH.historyitem_WrapPolygonSetEdited:
            {
                AscFormat.writeBool(writer, data.newPr);
                break;
            }
            case AscDFH.historyitem_WrapPolygonSetRelPoints:
            {
                writer.WriteLong(data.newPr.length);
                for(var i = 0; i < data.newPr.length; ++i)
                {
                    writer.WriteLong(data.newPr[i].x >> 0);
                    writer.WriteLong(data.newPr[i].y >> 0);
                }
                break;
            }

            case AscDFH.historyitem_WrapPolygonSetWrapSide:
            {
                AscFormat.writeLong(writer, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(reader)
    {
        if(reader.GetLong() !== AscDFH.historyitem_type_WrapPolygon)
            return;
        switch (reader.GetLong())
        {
            case AscDFH.historyitem_WrapPolygonSetEdited:
            {
                this.edited = AscFormat.readBool(reader);
                break;
            }
            case AscDFH.historyitem_WrapPolygonSetRelPoints:
            {
                var l = reader.GetLong();
                var rel_arr = [], x, y;
                for(var i = 0; i < l; ++i)
                {
                    x = reader.GetLong();
                    y = reader.GetLong();
                    rel_arr[i] = {x: x, y: y};
                }
                this.relativeArrPoints = rel_arr;
                break;
            }

            case AscDFH.historyitem_WrapPolygonSetWrapSide:
            {
                this.wrapSide = AscFormat.readLong(reader);
                break;
            }
        }
        if(this.wordGraphicObject && this.wordGraphicObject.GraphicObj && this.wordGraphicObject.GraphicObj.recalcWrapPolygon)
        {
            this.wordGraphicObject.GraphicObj.recalcWrapPolygon();
            this.wordGraphicObject.GraphicObj.addToRecalculate()
        }
    },

    Refresh_RecalcData : function(Data)
    {
        if(this.wordGraphicObject && this.wordGraphicObject.GraphicObj && this.wordGraphicObject.GraphicObj.recalcWrapPolygon)
        {
            this.wordGraphicObject.GraphicObj.recalcWrapPolygon();
            this.wordGraphicObject.GraphicObj.addToRecalculate();
            this.wordGraphicObject.Refresh_RecalcData();
        }
    },

    Refresh_RecalcData2 : function()
    {
    }
};


function CPolygonPoint()
{
    this.x = +0;
    this.y = +0;
}


function CWrapManager(graphicPage)
{
    this.graphicPage = graphicPage;
    this.arrGraphicObjects = graphicPage.wrappingObjects;
}

CWrapManager.prototype =
{
    checkRanges: function(x0, y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, hdrFtrRa, docContent, bMathWrap)
    {
        var arrGraphicObjects = this.arrGraphicObjects;
        var objects_count = arrGraphicObjects.length;
        var arr_intervals = [];

        if(docContent == null)
        {
            for(var index = 0; index < objects_count; ++index)
            {
                arrGraphicObjects[index].getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField,  arr_intervals, bMathWrap);
            }
            var arrFlowTables = this.graphicPage.flowTables;
            for(index = 0; index < arrFlowTables.length; ++index)
            {
                arrFlowTables[index].getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField,  arr_intervals, bMathWrap);
            }
        }
        else
        {
            if(!docContent.Is_HdrFtr())
            {
                for(index = 0; index < objects_count; ++index)
                {
                    if(arrGraphicObjects[index].parent && arrGraphicObjects[index].parent.DocumentContent === docContent)
                    {
                        arrGraphicObjects[index].getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals, bMathWrap);
                    }
                }
                arrFlowTables = this.graphicPage.flowTables;
                for(index = 0; index < arrFlowTables.length; ++index)
                {
                    var cur_float_table = arrFlowTables[index];
                    if(cur_float_table.Table.Parent === docContent)
                    {
                        cur_float_table.getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals, bMathWrap);
                    }
                }
            }
            else
            {
                var pageIndex = this.graphicPage.pageIndex;
                var graphic_objects = this.graphicPage.graphicObjects;
                var hdr_footer_objects = this.graphicPage.graphicObjects.getHdrFtrObjectsByPageIndex(pageIndex);
                if(hdr_footer_objects != null)
                {
                    arrGraphicObjects = hdr_footer_objects.wrappingObjects;
                    for(index = 0; index < arrGraphicObjects.length; ++index)
                    {
                        if(arrGraphicObjects[index].parent && arrGraphicObjects[index].parent.DocumentContent === docContent)
                        {
                            arrGraphicObjects[index].getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals, bMathWrap);
                        }
                    }
                    arrFlowTables = hdr_footer_objects.flowTables;
                    for(index = 0; index < arrFlowTables.length; ++index)
                    {
                        var cur_float_table = arrFlowTables[index];
                        if(cur_float_table.Table.Parent === docContent)
                        {
                            cur_float_table.getArrayWrapIntervals(x0,y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals, bMathWrap);
                        }
                    }
                }
            }
        }


        for(index = 0; index < hdrFtrRa.length; ++index)
        {
            arr_intervals.push(hdrFtrRa[index]);
        }
        arr_intervals.sort(function(a, b){return a.X0 - b.X0});
        for(var s  = 0; s < arr_intervals.length - 1; ++s)
        {
            var int0 = arr_intervals[s];
            var int1 = arr_intervals[s+1];
            var dist;
            if(int0.typeRight === WRAPPING_TYPE_SQUARE || int0.typeRight === WRAPPING_TYPE_TIGHT || int0.typeRight === WRAPPING_TYPE_THROUGH
                || int1.typeLeft === WRAPPING_TYPE_SQUARE || int1.typeLeft === WRAPPING_TYPE_TIGHT || int1.typeLeft === WRAPPING_TYPE_THROUGH || bMathWrap === true)
            {
                dist = (int0.typeRight === WRAPPING_TYPE_TIGHT || int0.typeRight === WRAPPING_TYPE_THROUGH) || (int1.typeLeft === WRAPPING_TYPE_TIGHT || int1.typeLeft === WRAPPING_TYPE_THROUGH) ? 3.175 : 6.35;
                var d = arr_intervals[s+1].X0 - arr_intervals[s].X1;
                if(d > 0 && d < dist)
                {
                    int0.X1 = int1.X1;
                    int0.Y1 = Math.min(int0.Y1, int1.Y1);
                    int0.typeRight = int1.typeRight;
                    arr_intervals.splice(s+1, 1);
                    --s;
                }
            }

        }
        for(var interval_index = 0; interval_index < arr_intervals.length; ++interval_index)
        {
            var cur_interval = arr_intervals[interval_index];
            for(var interval_index2 =  interval_index+1; interval_index2 < arr_intervals.length; ++interval_index2)
            {
                var cur_interval2 = arr_intervals[interval_index2];
                if(cur_interval2.X0 <= cur_interval.X1)
                {
                    if(cur_interval2.X1 > cur_interval.X1)
                    {
                        cur_interval.X1 = cur_interval2.X1;
                        cur_interval.Y1 = Math.min(cur_interval.Y1, cur_interval2.Y1);
                    }
                    arr_intervals.splice(interval_index2, 1);
                    --interval_index2;
                }
                else
                    break;
            }
        }
        return arr_intervals;
    }
};

function TrackNewPointWrapPolygon(originalObject, point1)
{
    this.originalObject = originalObject;
    this.point1 = point1;
    this.pageIndex = originalObject.selectStartPage;
    this.arrPoints = [];
    for(var  i = 0; i < originalObject.parent.wrappingPolygon.calculatedPoints.length; ++i)
    {
        this.arrPoints[i] = {};
        this.arrPoints[i].x = originalObject.parent.wrappingPolygon.calculatedPoints[i].x;
        this.arrPoints[i].y = originalObject.parent.wrappingPolygon.calculatedPoints[i].y;
    }
    this.arrPoints.splice(point1+1, 0, {x: null, y: null});
    this.matrix = new AscCommon.CMatrix();
    this.point2 = originalObject.parent.wrappingPolygon.calculatedPoints[point1 + 1] ? originalObject.parent.wrappingPolygon.calculatedPoints[point1 + 1] : originalObject.parent.wrappingPolygon.calculatedPoints[0];
}


TrackNewPointWrapPolygon.prototype =
{
    track: function(x, y)
    {
        this.arrPoints[this.point1+1].x = x;
        this.arrPoints[this.point1+1].y = y;
    },

    draw: function(overlay)
    {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.DrawEditWrapPointsTrackLines([this.arrPoints[this.point1], this.arrPoints[this.point1+1], this.point2], this.matrix);
        overlay.ds();
    }
};

function TrackPointWrapPointWrapPolygon(originalObject, point)
{
    this.originalObject = originalObject;
    this.point = point;
    this.pointCoord = {};
    this.pointCoord.x = originalObject.parent.wrappingPolygon.calculatedPoints[point].x;
    this.pointCoord.y = originalObject.parent.wrappingPolygon.calculatedPoints[point].y;
    this.point1 = originalObject.parent.wrappingPolygon.calculatedPoints[point - 1] ? originalObject.parent.wrappingPolygon.calculatedPoints[point - 1] : originalObject.parent.wrappingPolygon.calculatedPoints[originalObject.parent.wrappingPolygon.calculatedPoints.length-1];
    this.point2 = originalObject.parent.wrappingPolygon.calculatedPoints[point + 1] ? originalObject.parent.wrappingPolygon.calculatedPoints[point + 1] : originalObject.parent.wrappingPolygon.calculatedPoints[0];
    this.matrix = new AscCommon.CMatrix();
    this.pageIndex = originalObject.selectStartPage;
}

TrackPointWrapPointWrapPolygon.prototype =
{
    track: function(x, y)
    {
        this.pointCoord.x = x;
        this.pointCoord.y = y;
    },

    draw: function(overlay)
    {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.DrawEditWrapPointsTrackLines([this.point1, this.pointCoord, this.point2], this.matrix);
        overlay.ds();
    }
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CWrapPolygon = CWrapPolygon;
