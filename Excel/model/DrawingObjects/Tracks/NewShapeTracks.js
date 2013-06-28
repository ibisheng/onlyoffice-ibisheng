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
        var _finished_x = x, _finished_y = y;

        var _real_dist_x = _finished_x - this.startX;
        var _abs_dist_x = Math.abs(_real_dist_x);
        var _real_dist_y = _finished_y - this.startY;
        var _abs_dist_y = Math.abs(_real_dist_y);
        //if( (!ctrlKey && !shiftKey) )
        {
            if(_real_dist_x >= 0)
            {
                this.x = this.startX;
            }
            else
            {
                this.x = _abs_dist_x >= MIN_SHAPE_SIZE  ? x : this.startX - MIN_SHAPE_SIZE;
            }

            if(_real_dist_y >= 0)
            {
                this.y = this.startY;
            }
            else
            {
                this.y = _abs_dist_y >= MIN_SHAPE_SIZE  ? y : this.startY - MIN_SHAPE_SIZE;
            }

            this.extX = _abs_dist_x >= MIN_SHAPE_SIZE ? _abs_dist_x : MIN_SHAPE_SIZE;
            this.extY = _abs_dist_y >= MIN_SHAPE_SIZE ? _abs_dist_y : MIN_SHAPE_SIZE;

            this.overlayObject.updateExtents(this.extX, this.extY);
            this.transform.Reset();
            global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
        }
    };

    this.draw = function(overlay)
    {
        this.overlayObject.draw(overlay);
    };

    this.trackEnd = function()
    {
        this.drawingOjects.addGraphicObject(this.x, this.y, this.extX, this.extY, false, false, this.presetGeom)
    };
}