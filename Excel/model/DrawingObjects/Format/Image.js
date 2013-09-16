/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 6:24 PM
 * To change this template use File | Settings | File Templates.
 */


var MIN_SHAPE_DIST = 5.08;

var CARD_DIRECTION_N = 0;
var CARD_DIRECTION_NE = 1;
var CARD_DIRECTION_E = 2;
var CARD_DIRECTION_SE = 3;
var CARD_DIRECTION_S = 4;
var CARD_DIRECTION_SW = 5;
var CARD_DIRECTION_W = 6;
var CARD_DIRECTION_NW = 7;

var CURSOR_TYPES_BY_CARD_DIRECTION = [];
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_N]  = "n-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NE] = "ne-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_E]  = "e-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SE] = "se-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_S]  = "s-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SW] = "sw-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_W]  = "w-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NW] = "nw-resize";


function isRealNumber(number)
{
    return number === number && typeof number === "number";
}

function CImageShape(drawingBase, drawingObjects)
{
    this.drawingBase = drawingBase;
    this.drawingObjects = drawingObjects;

    this.blipFill = new CUniFill();
    this.blipFill.fill = new CBlipFill();
    this.spPr = new CSpPr();
    this.nvSpPr = null;
    this.style = null;
	this.lockType = c_oAscLockTypes.kLockTypeNone;

    this.group = null;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
	this.mainGroup = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.cursorTypes = [];

    this.recalcInfo =
    {
        recalculateTransform: true,
        recalculateGeometry: true,
        recalculateBrush: true
    };


    this.brush  = null;
    this.pen = null;

    this.selected = false;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CImageShape.prototype =
{
    getAllFonts: function(AllFonts)
    {
    },

    getObjectType: function()
    {
        return CLASS_TYPE_IMAGE;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    isShape: function()
    {
        return false;
    },

    isGroup: function()
    {
        return false;
    },

    isImage: function()
    {
        return true;//TODO
    },



    isChart: function()
    {
        return false;/*TODO*/
    },

    isSimpleObject: function()
    {
        return true;
    },

    deleteDrawingBase: function()
    {
        var position = this.drawingObjects.deleteDrawingBase(this.Get_Id());
        if(isRealNumber(position))
        {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_DeleteDrawingBase, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
        }
        return position;
    },

    addToDrawingObjects: function(pos)
    {
        var position = this.drawingObjects.addGraphicObject(this, pos);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_To_Drawing_Objects, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(position, null)), null);
    },

    initDefault: function(x, y, extX, extY, imageId)
    {
        this.setXfrmObject(new CXfrm());
        this.setPosition(x, y);
        this.setExtents(extX, extY);
        this.setImageId(imageId);
        this.setPresetGeometry("rect");
        this.recalculate();
    },

    setXfrmObject: function(xfrm)
    {
        this.spPr.xfrm = xfrm;
    },

    setDrawingBase: function(drawingBase)
    {
        this.drawingBase = drawingBase;
    },

    setPresetGeometry: function(preset)
    {
        this.spPr.geometry = CreateGeometry(preset);
        this.spPr.geometry.Init(5, 5);
    },

    setPosition: function(x, y)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setPosition(x, y, model_id);
    },


    setExtents: function(extX, extY)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setExtents(extX, extY, model_id);
    },

    setFlips: function(flipH, flipV)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setFlips(flipH, flipV, model_id);
    },

    setRotate: function(rot)
    {
        var model_id = this.drawingObjects.getWorksheet().model.getId();
        this.spPr.xfrm.setRotate(rot, model_id);
    },

    setRecalculateAll: function()
    {
        this.recalcInfo =
        {
            recalculateTransform: true,
            recalculateGeometry: true,
            recalculateBrush: true
        };
    },

	setRasterImage: function(img, canvas)
    {
        this.blipFill = new CUniFill();
        this.blipFill.fill = new CBlipFill();
        this.blipFill.fill.RasterImageId = img;
        if(isRealObject(canvas))
            this.blipFill.fill.canvas = canvas;
     //   this.spPr.Fill = new CUniFill();
        this.spPr.Fill = this.blipFill;
        this.brush = this.spPr.Fill;
    },
	
    updateDrawingBaseCoordinates: function()
    {
        if(isRealObject(this.drawingBase))
            this.drawingBase.setGraphicObjectCoords();
    },

    setImageId: function(imageId)
    {
        this.blipFill.fill.RasterImageId = imageId;
    },

	setAbsoluteTransform: function(offsetX, offsetY, extX, extY, rot, flipH, flipV, bAfterOpen)
    {

        if(offsetX != null)
        {
            this.absOffsetX = offsetX;
        }

        if(offsetY != null)
        {
            this.absOffsetY = offsetY;
        }


        if(extX != null)
        {
            this.extX = extX;
        }

        if(extY != null)
        {
            this.extY = extY;
        }

        if(rot != null)
        {
            this.absRot = rot;
        }

        if(flipH != null)
        {
            this.absFlipH = flipH;
        }

        if(flipV != null)
        {
            this.absFlipV = flipV;
        }
        if(this.parent)
            this.parent.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV, true);

        var b_change_size = extX != null || extY != null;
        this.recalculate(b_change_size, bAfterOpen);
    },
	
	setXfrm: function(offsetX, offsetY, extX, extY, rot, flipH, flipV)
    {
        //var data = {Type: historyitem_SetXfrmShape};

        var _xfrm = this.spPr.xfrm;
        if(offsetX !== null)
        {
            //data.oldOffsetX = _xfrm.offX;
            //data.newOffsetX = offsetX;
            _xfrm.offX = offsetX;
        }

        if(offsetY !== null)
        {
            //data.oldOffsetY = _xfrm.offY;
            //data.newOffsetY = offsetY;
            _xfrm.offY = offsetY;
        }


        if(extX !== null)
        {
            //data.oldExtX = _xfrm.extX;
            //data.newExtX = extX;
            _xfrm.extX = extX;
        }

        if(extY !== null)
        {
            //data.oldExtY = _xfrm.extY;
            //data.newExtY = extY;
            _xfrm.extY = extY;
        }

        if(rot !== null)
        {
            //data.oldRot = _xfrm.rot == null ? 0 : _xfrm.rot;
            //data.newRot = rot;
            _xfrm.rot = rot;
        }

        if(flipH !== null)
        {
            //data.oldFlipH = _xfrm.flipH == null ? false : _xfrm.flipH;
            //data.newFlipH = flipH;
            _xfrm.flipH = flipH;
        }

        if(flipV !== null)
        {
            //data.oldFlipV = _xfrm.flipV == null ? false : _xfrm.flipV;
            //data.newFlipV = flipV;
            _xfrm.flipV = flipV;
        }

        //History.Add(this, data);
    },


    setDrawingDocument: function(drawingDocument)
    {
        this.drawingObjects = drawingDocument.drawingObjects;
    },
    recalculate: function(aImagesSync)
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        if(this.recalcInfo.recalculateBrush)
        {
            this.recalculateBrush(aImagesSync);
            this.recalcInfo.recalculateBrush = false;
        }
    },

    recalculateBrush: function(aImagesSync)
    {
        this.brush = new CUniFill();
        this.brush.fill = new CBlipFill();
        this.brush.fill.RasterImageId = getFullImageSrc(this.blipFill.fill.RasterImageId);
        if(Array.isArray(aImagesSync))
        {
            aImagesSync.push(getFullImageSrc(this.brush.fill.RasterImageId));
        }
    },

    recalculateTransform: function()
    {
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx*xfrm.extX;
            this.extY = scale_scale_coefficients.cy*xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        if(isRealObject(this.spPr.geometry))
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.transform.Reset();
        var hc, vc;
        hc = this.extX*0.5;
        vc = this.extY*0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if(this.flipH)
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        if(this.flipV)
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);

        global_MatrixTransformer.RotateRadAppend(this.transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if(isRealObject(this.group))
        {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransform());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },

    calculateTransformTextMatrix: function()
    {

    },
	
	calculateContent: function()
	{
	
	},

	calculateAfterResize: function(transform, bChangeSize, bAfterOpen)
    {
        if(this.spPr.geometry !== null)
            this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.calculateTransformMatrix(transform);

        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();

        if(isRealObject(this.chart) && (bChangeSize === true || this.chart.img == "")&& bAfterOpen !== true)
        {
            this.chart.width = this.drawingDocument.GetDotsPerMM(this.extX);
            this.chart.height = this.drawingDocument.GetDotsPerMM(this.extY);

            var chartRender = new ChartRender();
            var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
            this.chart.img = chartBase64;
            this.setRasterImage(this.chart.img);
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.chart.img);
        }
        /*if(this.chart != null)
        {
            var chartRender = new ChartRender();
            var width_pix = this.drawingDocument.GetDotsPerMM(this.absExtX);
            var heght_pix = this.drawingDocument.GetDotsPerMM(this.absExtY);
            var chartBase64 = chartRender.insertChart(this.chart, null, width_pix, heght_pix);
            if ( !chartBase64 )
                return;

            var _image = editor.ImageLoader.LoadImage(_getFullImageSrc(chartBase64), 1);
            var or_shp = this;
            if (null != _image)
            {
                this.setRasterImage(chartBase64)
            }
            else
            {
                editor.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                editor.asyncImageEndLoaded2 = function(_image)
                {
                    or_shp.setRasterImage(_image.src);
                    editor.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
                    if(or_shp.group == null)
                    {
                        var or_gr_obj = or_shp.parent;
                        var bounds_2 = or_gr_obj.getBounds();
                        if(!or_gr_obj.Is_Inline())
                        {
                            or_gr_obj.calculateOffset();
                            var pos_x = or_gr_obj.absOffsetX;
                            var pos_y = or_gr_obj.absOffsetY;
                            var near_pos = or_shp.document.Get_NearestPos(or_gr_obj.PageNum, bounds_2.l, bounds_2.t, true, or_gr_obj);
                            var W = bounds_2.r - bounds_2.l;
                            var H = bounds_2.b - bounds_2.t;
                            or_gr_obj.OnEnd_ChangeFlow(pos_x, pos_y, or_gr_obj.pageIndex, W, H, near_pos, false, true);
                        }
                        else
                        {
                            or_gr_obj.OnEnd_ResizeInline(bounds_2.r - bounds_2.l, bounds_2.b - bounds_2.t);
                        }
                    }
                }
            }
        }       */
    },
	
	calculateTransformMatrix: function(transform)
    {
        var _transform = new CMatrix();

        var _horizontal_center = this.extX * 0.5;
        var _vertical_center = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);

        if(this.absFlipH)
        {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if(this.absFlipV)
        {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }

        global_MatrixTransformer.RotateRadAppend(_transform, -this.absRot);

        global_MatrixTransformer.TranslateAppend(_transform, this.absOffsetX, this.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);

        if(this.mainGroup !== null)
        {
            global_MatrixTransformer.MultiplyAppend(_transform, this.mainGroup.getTransform());
        }
        if(isRealObject(transform))
        {
            global_MatrixTransformer.MultiplyPrepend(_transform, transform);
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },
	
	calculateLeftTopPoint: function()
    {
        var _horizontal_center = this.extX * 0.5;
        var _vertical_enter = this.extY * 0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center*_cos + _vertical_enter*_sin +this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center*_sin - _vertical_enter*_cos +this.absOffsetY + _vertical_enter;
    },
	
	checkLine: function()
    {
        return false;
    },
	
    normalize: function()
    {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if(!isRealObject(this.group))
        {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        }
        else
        {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx*(xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy*(xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx*xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy*xfrm.extY;
        }
        this.setPosition(new_off_x, new_off_y);
        this.setExtents(new_ext_x, new_ext_y);
    },

    getTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },

    getInvertTransform: function()
    {
        if(this.recalcInfo.recalculateTransform)
        {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.invertTransform;
    },

    getCardDirectionByNum: function(num)
    {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if(same_flip)
            return ((num - num_north) + CARD_DIRECTION_N + 8)%8;

        return (CARD_DIRECTION_N - (num - num_north)+ 8)%8;
    },

    getNumByCardDirection: function(cardDirection)
    {
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var transform = this.getTransform();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);

        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                north_number = !full_flip_v ? 1 : 5;
                break;
            }
            case y3:
            {
                north_number = !full_flip_h ? 3 : 7;
                break;
            }
            case y5:
            {
                north_number = !full_flip_v ? 5 : 1;
                break;
            }
            default:
            {
                north_number = !full_flip_h ? 7 : 3;
                break;
            }
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;

        if(same_flip)
            return (north_number + cardDirection)%8;
        return (north_number - cardDirection + 8)%8;
    },

    getFullFlipH: function()
    {
        if(!isRealObject(this.group))
            return this.flipH;
        else
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },

	getImageUrl: function()
    {
        if(isRealObject(this.blipFill))
            return this.blipFill.RasterImageId;
        return null;
    },

    getFullFlipV: function()
    {
        if(!isRealObject(this.group))
            return this.flipV;
        else
            return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },

    getAspect: function(num)
    {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x/_tmp_y : _tmp_y/_tmp_x;
    },

    setGroup: function(group)
    {
        this.group = group;
    },

    getFullOffset: function()
    {
        if(!isRealObject(this.group))
            return {offX: this.x, offY: this.y};
        var group_offset = this.group.getFullOffset();
        return {offX: this.x + group_offset.offX, offY: this.y + group_offset.offY};
    },

    getRectBounds: function()
    {
        var transform = this.getTransform();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{x:0, y:0}, {x: w, y: 0}, {x: w, y: h}, {x: 0, y: h}];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for(var i = 1; i < 4; ++i)
        {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if(cur_x < min_x)
                min_x = cur_x;
            if(cur_x > max_x)
                max_x = cur_x;

            if(cur_y < min_y)
                min_y = cur_y;
            if(cur_y > max_y)
                max_y = cur_y;
        }
        return {minX: min_x, maxX: max_x, minY: min_y, maxY: max_y};
    },

    select: function(drawingObjectsController)
    {
        this.selected = true;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
                break;
        }
        if(i === selected_objects.length)
            selected_objects.push(this);
    },

    deselect: function(drawingObjectsController)
    {
        this.selected = false;
        var selected_objects;
        if(!isRealObject(this.group))
            selected_objects = drawingObjectsController.selectedObjects;
        else
            selected_objects = this.group.getMainGroup().selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            if(selected_objects[i] === this)
            {
                selected_objects.splice(i, 1);
                break;
            }
        }
    },


    draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
		
		if(graphics instanceof CGraphics)
		{
			var transform = this.transform;
			var extX = this.extX;
			var extY = this.extY;
			
			if(!isRealObject(this.group))
			{
				graphics.SetIntegerGrid(false);
				graphics.transform3(transform, false);		
				graphics.DrawLockObjectRect(this.lockType, 0, 0, extX, extY );
				graphics.reset();
				graphics.SetIntegerGrid(true);
			}
		}
		
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },

    check_bounds: function(checker)
    {
        if (this.spPr.geometry)
        {
            this.spPr.geometry.check_bounds(checker);
        }
        else
        {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },

    hitToAdjustment: function(x, y)
    {
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },

    hitToHandles: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.drawingObjects.convertMetric(TRACK_CIRCLE_RADIUS, 0, 3);

        var sqr_x = t_x*t_y, sqr_y = t_y*t_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 0;

        var hc = this.extX*0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 1;

        dist_x = t_x - this.extX;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 2;

        var vc = this.extY*0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 3;

        dist_y = t_y - this.extY;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 4;

        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 5;

        dist_x = t_x;
        sqr_x = dist_x*dist_x;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 6;

        dist_y = t_y - vc;
        sqr_y = dist_y*dist_y;
        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 7;

        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y*dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x*dist_x;

        if(Math.sqrt(sqr_x + sqr_y) < radius)
            return 8;

        return -1;

    },

    hitInBoundingRect: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);

        var _hit_context = this.drawingObjects.getCanvasContext();

        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) ||
            HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY)||
            HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY)||
            HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) /*||
         HitInLine(_hit_context, x_t, y_t, this.extX*0.5, 0, this.extX*0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE))*/);
    },

    hitInInnerArea: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInInnerArea(this.drawingObjects.getCanvasContext(), x_t, y_t);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },

    hitInPath: function(x, y)
    {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if(isRealObject(this.spPr.geometry))
            return this.spPr.geometry.hitInPath(this.drawingObjects.getCanvasContext(), x_t, y_t);
        return false;
    },


    hitInTextRect: function(x, y)
    {
        return false;
    },

    canRotate: function()
    {
        return !this.isChart(); //TODO
    },

    canResize: function()
    {
        return true;//TODO
    },

    canMove: function()
    {
        return true;//TODO
    },

    canGroup: function()
    {
        return true;//TODO
    },

    createRotateTrack: function()
    {
        return new RotateTrackShapeImage(this);
    },

    createResizeTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImage(this, cardDirection);
    },


    createMoveTrack: function()
    {
        return new MoveShapeImageTrack(this);
    },

    createRotateInGroupTrack: function()
    {
        return new RotateTrackShapeImageInGroup(this);
    },

    createResizeInGroupTrack: function(cardDirection)
    {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },

    createMoveInGroupTrack: function()
    {
        return new MoveShapeImageTrackInGroup(this);
    },

    getRotateAngle: function(x, y)
    {
        var transform = this.getTransform();
        var rotate_distance = this.drawingObjects.convertMetric(TRACK_DISTANCE_ROTATE, 0, 3);
        var hc = this.extX*0.5;
        var vc = this.extY*0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, - rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, - rotate_distance);

        var invert_transform = this.getInvertTransform();
        var rel_x = invert_transform.TransformPointX(x, y);

        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;

        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;

        var flip_h = this.getFullFlipH();
        var flip_v = this.getFullFlipV();
        var same_flip = flip_h && flip_v || !flip_h && !flip_v;
        var angle =  rel_x > this.extX*0.5 ? Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y) : -Math.atan2( Math.abs(v1_x*v2_y - v1_y*v2_x), v1_x*v2_x + v1_y*v2_y);
        return same_flip ? angle : -angle;
    },

    getResizeCoefficients: function(numHandle, x, y)
    {
        var cx, cy;
        cx= this.extX > 0 ? this.extX : 0.01;
        cy= this.extY > 0 ? this.extY : 0.01;

        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);

        switch(numHandle)
        {
            case 0:
                return {kd1: (cx-t_x)/cx, kd2: (cy-t_y)/cy};
            case 1:
                return {kd1: (cy-t_y)/cy, kd2: 0};
            case 2:
                return {kd1: (cy-t_y)/cy, kd2: t_x/cx};
            case 3:
                return {kd1: t_x/cx, kd2: 0};
            case 4:
                return {kd1: t_x/cx, kd2: t_y/cy};
            case 5:
                return {kd1: t_y/cy, kd2: 0};
            case 6:
                return {kd1: t_y/cy, kd2:(cx-t_x)/cx};
            case 7:
                return {kd1:(cx-t_x)/cx, kd2: 0};
        }
        return {kd1: 1, kd2: 1};
    },


    getFullRotate: function()
    {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },

    getBoundsInGroup: function()
    {
        var r = this.rot;
        if((r >= 0 && r < Math.PI*0.25)
            || (r > 3*Math.PI*0.25 && r < 5*Math.PI*0.25)
            || (r > 7*Math.PI*0.25 && r < 2*Math.PI))
        {
            return {minX: this.x, minY: this.y, maxX: this.x + this.extX, maxY: this.y + this.extY};
        }
        else
        {
            var hc = this.extX*0.5;
            var vc = this.extY*0.5;
            var xc = this.x + hc;
            var yc = this.y + vc;
            return {minX: xc - vc, minY: yc - hc, maxX: xc + vc, maxY: yc + hc};
        }
    },

    drawAdjustments: function(drawingDocument)
    {
    },

    Get_Props: function(OtherProps)
    {
        var Props = new Object();
        Props.Width  = this.extX;
        Props.Height = this.extY;

        if(!isRealObject(OtherProps))
            return Props;


        OtherProps.Width = OtherProps.Width === Props.Width ? Props.Width : undefined;
        OtherProps.Height = OtherProps.Height === Props.Height ? Props.Height : undefined;

        return OtherProps;
    },

    getImageProps: function()
    {
        return {ImageUrl: this.blipFill.RasterImageId, Width: this.extX, Height: this.extY};
    },




    Undo: function(type, data)
    {
        switch (type)
        {
            case historyitem_AutoShapes_RecalculateTransformUndo:
            {
                this.recalculateTransform();
                this.calculateContent();
                this.calculateTransformTextMatrix();
                break;
            }
			case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }
			case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }
        }
    },

    Redo: function(type, data)
    {
        switch (type)
        {
            case historyitem_AutoShapes_RecalculateTransformRedo:
            {
                this.recalculateTransform();
                this.calculateContent();
                this.calculateTransformTextMatrix();
                break;
            }
			case historyitem_AutoShapes_Add_To_Drawing_Objects:
            {
				this.drawingObjects.addGraphicObject(this, data.oldValue);
                break;
            }
			case historyitem_AutoShapes_DeleteDrawingBase:
            {
                this.drawingObjects.deleteDrawingBase(this.Id);
                break;
            }
        }
    },


    setNvSpPr: function(pr)
    {
        this.nvSpPr = pr;
    },

    setSpPr: function(pr)
    {
        this.spPr = pr;
    },

    getBase64Image: function()
    {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },

    writeToBinaryForCopyPaste: function(w)
    {
        w.WriteLong(CLASS_TYPE_IMAGE);
        this.blipFill.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.drawingObjects.shiftMap[this.Id]));
        if(isRealObject(this.drawingObjects.shiftMap[this.Id]))
        {
            w.WriteDouble(this.drawingObjects.shiftMap[this.Id].x);
            w.WriteDouble(this.drawingObjects.shiftMap[this.Id].y);
        }
        this.spPr.Write_ToBinary2(w);
        return  "TeamLabImage" + w.pos + ";" + w.GetBase64Memory();

    },

    readFromBinaryForCopyPaste: function(r, group, drawingObjects, x, y)
    {
        this.group = group;
        this.drawingObjects = drawingObjects;
        this.blipFill.Read_FromBinary2(r);
        var dx = 0, dy = 0;
        if(r.GetBool())
        {
            dx = r.GetDouble();
            dy = r.GetDouble();
        }
        this.spPr.Read_FromBinary2(r);
        if(isRealNumber(x) && isRealNumber(y))
        {
            this.setPosition(x + dx, y + dy);
        }

        if(!isRealObject(group))
        {
            this.recalculate();
            this.recalculateTransform();
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    }
};