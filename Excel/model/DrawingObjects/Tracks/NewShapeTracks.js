/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/28/13
 * Time: 11:18 AM
 * To change this template use File | Settings | File Templates.
 */
function NewShapeTrack(drawingObjects, presetGeom, startX, startY)
{
    this.drawingOjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;

    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;

    this.transform = new CMatrix();
    var geometry = CreateGeometry(presetGeom);
    geometry.Init(5, 5);

    var theme = drawingObjects.getWorkbook().theme;
    var color_map = GenerateDefaultColorMap().color_map;
    var style = CreateDefaultShapeStyle();
    var brush = theme.getFillStyle(style.fillRef.idx);
    style.fillRef.Color.Calculate(theme, color_map, {R:0, G:0, B:0, A:255});
    var RGBA = style.fillRef.Color.RGBA;

    if (style.fillRef.Color.color != null)
    {
        if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD))
        {
            brush.fill.color = style.fillRef.Color.createDuplicate();
        }
    }
    brush.calculate(theme, color_map, RGBA) ;

    var pen = theme.getLnStyle(style.lnRef.idx);
    style.lnRef.Color.Calculate(theme, color_map, {R: 0 , G: 0, B: 0, A: 255});
    RGBA = style.lnRef.Color.RGBA;

    pen.Fill.calculate(theme, color_map, RGBA) ;


    this.overlayObject = new OverlayObject(geometry, 5, 5, brush, pen, this.transform);

    this.track = function(e, x, y)
    {
        var real_dist_x = x - this.startX;
        var abs_dist_x = Math.abs(real_dist_x);
        var real_dist_y = y - this.startY;
        var abs_dist_y = Math.abs(real_dist_y);

        if(!(e.ctrlKey || e.shiftKey))
        {
            if(real_dist_x >= 0)
            {
                this.x = this.startX;
            }
            else
            {
                this.x = abs_dist_x >= MIN_SHAPE_SIZE  ? x : this.startX - MIN_SHAPE_SIZE;
            }

            if(real_dist_y >= 0)
            {
                this.y = this.startY;
            }
            else
            {
                this.y = abs_dist_y >= MIN_SHAPE_SIZE  ? y : this.startY - MIN_SHAPE_SIZE;
            }

            this.extX = abs_dist_x >= MIN_SHAPE_SIZE ? abs_dist_x : MIN_SHAPE_SIZE;
            this.extY = abs_dist_y >= MIN_SHAPE_SIZE ? abs_dist_y : MIN_SHAPE_SIZE;

        }
        else if(e.ctrlKey && !e.shiftKey)
        {
            if(abs_dist_x >= MIN_SHAPE_SIZE_DIV2)
            {
                this.x = this.startX - abs_dist_x;
                this.extX = 2*abs_dist_x;
            }
            else
            {
                this.x = this.startX - MIN_SHAPE_SIZE_DIV2;
                this.extX = MIN_SHAPE_SIZE;
            }

            if(abs_dist_y >= MIN_SHAPE_SIZE_DIV2)
            {
                this.y = this.startY - abs_dist_y;
                this.extY = 2*abs_dist_y;
            }
            else
            {
                this.y = this.startY - MIN_SHAPE_SIZE_DIV2;
                this.extY = MIN_SHAPE_SIZE;
            }
        }
        else if(!e.ctrlKey && e.shiftKey)
        {
            var new_width, new_height;
            var prop_coefficient = (typeof SHAPE_ASPECTS[this.presetGeom] === "number" ? SHAPE_ASPECTS[this.presetGeom] : 1);
            if(abs_dist_y === 0)
            {
                new_width = abs_dist_x > MIN_SHAPE_SIZE ? abs_dist_x : MIN_SHAPE_SIZE;
                new_height = abs_dist_x/prop_coefficient;
            }
            else
            {
                var new_aspect = abs_dist_x/abs_dist_y;
                if (new_aspect >= prop_coefficient)
                {
                    new_width = abs_dist_x;
                    new_height = abs_dist_x/prop_coefficient;
                }
                else
                {
                    new_height = abs_dist_y;
                    new_width = abs_dist_y*prop_coefficient;
                }
            }

            if(new_width < MIN_SHAPE_SIZE || new_height < MIN_SHAPE_SIZE)
            {
                var k_wh = new_width/new_height;
                if(new_height < MIN_SHAPE_SIZE && new_width < MIN_SHAPE_SIZE)
                {
                    if(new_height < new_width)
                    {
                        new_height = MIN_SHAPE_SIZE;
                        new_width = new_height*k_wh;
                    }
                    else
                    {
                        new_width = MIN_SHAPE_SIZE;
                        new_height = new_width/k_wh;
                    }
                }
                else if(new_height < MIN_SHAPE_SIZE)
                {
                    new_height = MIN_SHAPE_SIZE;
                    new_width = new_height*k_wh;
                }
                else
                {
                    new_width = MIN_SHAPE_SIZE;
                    new_height = new_width/k_wh;
                }
            }
            this.extX = new_width;
            this.extY = new_height;
            if(real_dist_x >= 0)
                this.x = this.startX;
            else
                this.x = this.startX - this.extX;

            if(real_dist_y >= 0)
                this.y = this.startY;
            else
                this.y = this.startY - this.extY;
        }
        else
        {
            var new_width, new_height;
            var prop_coefficient = (typeof SHAPE_ASPECTS[this.presetGeom] === "number" ? SHAPE_ASPECTS[this.presetGeom] : 1);
            if(abs_dist_y === 0)
            {
                new_width = abs_dist_x > MIN_SHAPE_SIZE_DIV2 ? abs_dist_x*2 : MIN_SHAPE_SIZE;
                new_height = new_width/prop_coefficient;
            }
            else
            {
                var new_aspect = abs_dist_x/abs_dist_y;
                if (new_aspect >= prop_coefficient)
                {
                    new_width = abs_dist_x*2;
                    new_height = new_width/prop_coefficient;
                }
                else
                {
                    new_height = abs_dist_y*2;
                    new_width = new_height*prop_coefficient;
                }
            }

            if(new_width < MIN_SHAPE_SIZE || new_height < MIN_SHAPE_SIZE)
            {
                var k_wh = new_width/new_height;
                if(new_height < MIN_SHAPE_SIZE && new_width < MIN_SHAPE_SIZE)
                {
                    if(new_height < new_width)
                    {
                        new_height = MIN_SHAPE_SIZE;
                        new_width = new_height*k_wh;
                    }
                    else
                    {
                        new_width = MIN_SHAPE_SIZE;
                        new_height = new_width/k_wh;
                    }
                }
                else if(new_height < MIN_SHAPE_SIZE)
                {
                    new_height = MIN_SHAPE_SIZE;
                    new_width = new_height*k_wh;
                }
                else
                {
                    new_width = MIN_SHAPE_SIZE;
                    new_height = new_width/k_wh;
                }
            }
            this.extX = new_width;
            this.extY = new_height;
            this.x = this.startX - this.extX*0.5;
            this.y = this.startY - this.extY*0.5;
        }
        this.overlayObject.updateExtents(this.extX, this.extY);
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
    };

    this.ctrlDown = function()
    {};

    this.shiftDown = function()
    {};

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        var shape = new CShape(null, this.drawingOjects);
        shape.initDefault(this.x, this.y, this.extX, this.extY, false, false, this.presetGeom);
        this.drawingOjects.addGraphicObject(shape);
    };
}