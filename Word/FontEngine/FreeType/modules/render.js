function CRasterMemory()
{
    this.width = 0;
    this.height = 0;
    this.pitch = 0;

    this.m_oBuffer = null;
    this.CheckSize = function(w, h)
    {
        if (this.width < (w + 1) || this.height < (h + 1))
        {
            this.width = Math.max(this.width, w + 1);
            this.pitch = 4 * this.width;
            this.height = Math.max(this.height, h + 1);

            this.m_oBuffer = null;
            this.m_oBuffer = g_memory.ctx.createImageData(this.width, this.height);
        }
    }
}
var raster_memory = new CRasterMemory();

// outline ---
function _FT_Outline_Funcs_Gray()
{
    this.move_to = function(to, worker)
    {
        /* record current cell, if any */
        var err = gray_record_cell(worker);
        if (err == FT_Common.ErrorLongJump)
            return FT_Common.ErrorLongJump;

        /* start to a new position */
        var x = to.x << 2;
        var y = to.y << 2;

        err = gray_start_cell(worker, x >> 8, y >> 8);

        worker.x = x;
        worker.y = y;
        return err;
    }

    this.line_to = function(to, worker)
    {
        return gray_render_line(worker, to.x << 2, to.y << 2);
    }

    this.conic_to = function(control, to, worker)
    {
        return gray_render_conic(worker, control, to);
    }

    this.cubic_to = function(control1, control2, to, worker)
    {
        return gray_render_cubic(worker, control1, control2, to);
    }

    this.shift = 0;
    this.delta = 0;
}
var ft_outline_funcs_gray = new _FT_Outline_Funcs_Gray();

function FT_Outline_Decompose(outline, func_interface, user)
{
    if (!outline || !func_interface)
        return FT_Common.FT_Err_Invalid_Argument;

    var v_last      = new FT_Vector();
    var v_control   = new FT_Vector();
    var v_start     = new FT_Vector();

    var point;
    var limit;

    var tags = 0;
    var first = 0;
    var tag = 0;

    var shift = func_interface.shift;
    var delta = func_interface.delta;

    var error = 0;

    var count = outline.n_contours;
    var _c = outline.contours;
    var _p = outline.points;
    var _t = outline.tags;
    for (var n = 0; n < count; n++)
    {
        var last = _c[n];
        if (last < 0)
            return FT_Common.FT_Err_Invalid_Outline;
        limit = last;

        v_start.x = (_p[first].x << shift) - delta;
        v_start.y = (_p[first].y << shift) - delta;

        v_last.x = (_p[last].x << shift) - delta;
        v_last.y = (_p[last].y << shift) - delta;

        v_control.x = v_start.x;
        v_control.y = v_start.y;

        point = first;
        tags  = first;
        tag   = _t[tags] & 3;

        /* A contour cannot start with a cubic control point! */
        if (tag == FT_Common.FT_CURVE_TAG_CUBIC)
            return FT_Common.FT_Err_Invalid_Outline;

        /* check first point to determine origin */
        if (tag == FT_Common.FT_CURVE_TAG_CONIC)
        {
            /* first point is conic control.  Yes, this happens. */
            if ((_t[last] & 3) == FT_Common.FT_CURVE_TAG_ON)
            {
                /* start at last point if it is on the curve */
                v_start.x = v_last.x;
                v_start.y = v_last.y;
                limit--;
            }
            else
            {
                /* if both first and last points are conic,         */
                /* start at their middle and record its position    */
                /* for closure                                      */
                v_start.x = parseInt((v_start.x + v_last.x) / 2);
                v_start.y = parseInt((v_start.y + v_last.y) / 2);

                v_last.x = v_start.x;
                v_last.y = v_start.y;
            }
            point--;
            tags--;
        }

        error = func_interface.move_to(v_start, user);
        if (error != 0)
            return error;

        var isClose = 0;
        while (point < limit)
        {
            point++;
            tags++;

            tag = _t[tags] & 3;
            switch ( tag )
            {
                case FT_Common.FT_CURVE_TAG_ON:  /* emit a single line_to */
                {
                    var vec = new FT_Vector();

                    vec.x = (_p[point].x << shift) - delta;
                    vec.y = (_p[point].y << shift) - delta;

                    error = func_interface.line_to(vec, user);
                    if (0 != error)
                        return error;
                    continue;
                }

                case FT_Common.FT_CURVE_TAG_CONIC:  /* consume conic arcs */
                    v_control.x = (_p[point].x << shift) - delta;
                    v_control.y = (_p[point].y << shift) - delta;

                    var isCont = 0;
                    while (true)
                    {
                        if (point < limit)
                        {
                            var vec = new FT_Vector();
                            var v_middle = new FT_Vector();

                            point++;
                            tags++;
                            tag = _t[tags] & 3;

                            vec.x = (_p[point].x << shift) - delta;
                            vec.y = (_p[point].y << shift) - delta;

                            if (tag == FT_Common.FT_CURVE_TAG_ON)
                            {
                                error = func_interface.conic_to(v_control, vec, user);
                                if (0 != error)
                                    return error;
                                isCont = 1;
                                break;
                            }

                            if (tag != FT_Common.FT_CURVE_TAG_CONIC)
                                return FT_Common.FT_Err_Invalid_Outline;

                            v_middle.x = parseInt((v_control.x + vec.x) / 2);
                            v_middle.y = parseInt((v_control.y + vec.y) / 2);

                            error = func_interface.conic_to(v_control, v_middle, user);
                            if (0 != error)
                                return error;

                            v_control.x = vec.x;
                            v_control.y = vec.y;

                            continue;
                        }
                        break;
                    }
                    if (1 == isCont/* && (point < limit)*/)
                        continue;

                    error = func_interface.conic_to(v_control, v_start, user);
                    isClose = 1;
                    break;

                default:  /* FT_CURVE_TAG_CUBIC */
                {
                    var vec1 = new FT_Vector();
                    var vec2 = new FT_Vector();

                    if ((point + 1 > limit) || (_t[tags+1]&3) != FT_Common.FT_CURVE_TAG_CUBIC)
                        return FT_Common.FT_Err_Invalid_Outline;

                    point += 2;
                    tags  += 2;

                    vec1.x = (_p[point-2].x << shift) - delta;
                    vec1.y = (_p[point-2].y << shift) - delta;

                    vec2.x = (_p[point-1].x << shift) - delta;
                    vec2.y = (_p[point-1].y << shift) - delta;

                    if (point <= limit)
                    {
                        var vec = new FT_Vector();
                        vec.x = (_p[point].x << shift) - delta;
                        vec.y = (_p[point].y << shift) - delta;

                        error = func_interface.cubic_to(vec1, vec2, vec, user);
                        if (0 != error)
                            return error;
                        continue;
                    }

                    error = func_interface.cubic_to(vec1, vec2, v_start, user);
                    isClose = 1;
                    break;
                }
            }

            if (isClose == 1)
                break;
        }

        if (error != 0)
            return error;

        /* close the contour with a line segment */
        if (0 == isClose)
            error = func_interface.line_to(v_start, user);

        if (error != 0)
            return error;

        isClose = 0;
        first = last + 1;
    }
    return 0;
}

function FT_Outline_Get_Orientation(outline)
{
    if (outline == null || outline.n_points <= 0)
        return FT_Common.FT_ORIENTATION_TRUETYPE;

    /* We use the nonzero winding rule to find the orientation.       */
    /* Since glyph outlines behave much more `regular' than arbitrary */
    /* cubic or quadratic curves, this test deals with the polygon    */
    /* only which is spanned up by the control points.                */
    var points = outline.points;

    var first = 0;
    var area = 0;
    for (var c = 0; c < outline.n_contours; c++)
    {
        var last = outline.contours[c];
        var v_prev = points[last];

        for (var n = first; n <= last; n++)
        {
            v_cur = points[n];
            area += (v_cur.y - v_prev.y) * (v_cur.x + v_prev.x);
            v_prev = v_cur;
        }

        first = last + 1;
    }

    if (area > 0)
        return FT_Common.FT_ORIENTATION_POSTSCRIPT;
    else if ( area < 0 )
        return FT_Common.FT_ORIENTATION_TRUETYPE;
    return FT_Common.FT_ORIENTATION_NONE;
}

function FT_Outline_Get_Orientation_Cur(outline, base)
{
    if (outline == null || outline.n_points <= 0)
        return FT_Common.FT_ORIENTATION_TRUETYPE;

    /* We use the nonzero winding rule to find the orientation.       */
    /* Since glyph outlines behave much more `regular' than arbitrary */
    /* cubic or quadratic curves, this test deals with the polygon    */
    /* only which is spanned up by the control points.                */
    var points = base.points;
    var contours = base.contours;
    var _p_off = outline.points;
    var _c_off = outline.contours;

    var v_prev = new FT_Vector();
    var v_cur = new FT_Vector();

    var first = 0;
    var area = 0;
    for (var c = 0; c < outline.n_contours; c++)
    {
        var last = contours[_c_off + c];
        v_prev.x = points[_p_off + last].x;
        v_prev.y = points[_p_off + last].y;

        for (var n = first; n <= last; n++)
        {
            v_cur.x = points[_p_off + n].x;
            v_cur.y = points[_p_off + n].y;
            area += (v_cur.y - v_prev.y) * (v_cur.x + v_prev.x);
            v_prev.x = v_cur.x;
            v_prev.y = v_cur.y;
        }

        first = last + 1;
    }

    if (area > 0)
        return FT_Common.FT_ORIENTATION_POSTSCRIPT;
    else if ( area < 0 )
        return FT_Common.FT_ORIENTATION_TRUETYPE;
    return FT_Common.FT_ORIENTATION_NONE;
}

function ft_trig_prenorm(vec)
{
    var x = vec.x;
    var y = vec.y;

    var z = ((x >= 0) ? x : - x) | ((y >= 0) ? y : -y);
    var shift = 0;

    /* determine msb bit index in `shift' */
    if (z >= (1 << 16))
    {
        z >>= 16;
        shift += 16;
    }
    if (z >= (1 << 8))
    {
        z >>= 8;
        shift += 8;
    }
    if (z >= (1 << 4))
    {
        z >>= 4;
        shift += 4;
    }
    if (z >= (1 << 2))
    {
        z >>= 2;
        shift += 2;
    }
    if (z >= (1 << 1))
    {
        z >>= 1;
        shift += 1;
    }

    if (shift <= 27)
    {
        shift  = 27 - shift;
        vec.x = x << shift;
        vec.y = y << shift;
    }
    else
    {
        shift -= 27;
        vec.x = x >> shift;
        vec.y = y >> shift;
        shift = -shift;
    }

    return shift;
}

var ft_trig_arctan_table = [2949120, 1740967, 919879, 466945, 234379, 117304, 58666, 29335, 14668, 7334,
    3667, 1833, 917, 458, 229, 115, 57, 29, 14, 7, 4, 2, 1];

function ft_trig_pseudo_polarize(vec)
{
    var x = vec.x;
    var y = vec.y;

    /* Get the vector into the right half plane */
    var theta = 0;
    if (x < 0)
    {
        x = -x;
        y = -y;
        theta = 2 * FT_Common.FT_ANGLE_PI2;
    }

    if (y > 0)
        theta = - theta;

    var arctanptr = 0;
    var xtemp = 0;
    /* Pseudorotations, with right shifts */
    i = 0;
    do
    {
        if ( y > 0 )
        {
            xtemp  = x + (y >> i);
            y      = y - (x >> i);
            x      = xtemp;
            theta += ft_trig_arctan_table[arctanptr++];
        }
        else
        {
            xtemp  = x - (y >> i);
            y      = y + (x >> i);
            x      = xtemp;
            theta -= ft_trig_arctan_table[arctanptr++];
        }
    } while (++i < FT_Common.FT_TRIG_MAX_ITERS);

    /* round theta */
    if (theta >= 0)
        theta = ((theta + 16) & ~31);
    else
        theta = -((-theta + 16) & ~31);

    vec.x = x;
    vec.y = theta;
}

function ft_trig_downscale(val)
{
    var s   = val;
    val = (val >= 0) ? val : -val;

    var v1 = FT_Common.IntToUInt(val >> 16);
    var v2 = FT_Common.IntToUInt(val & 0xFFFF);

    var k1 = 0x9B74;   /* constant */
    var k2 = 0xEDA8;   /* constant */

    var hi   = k1 * v1;
    var lo1  = k1 * v2 + k2 * v1;       /* can't overflow */

    var lo2  = ( k2 * v2 ) / 65536;
    lo2 = lo2 >> 0;
    var lo3  = ( lo1 >= lo2 ) ? lo1 : lo2;
    lo1 += lo2;

    lo1 = FT_Common.IntToUInt(lo1);

    hi  += lo1 >> 16;
    if (lo1 < lo3)
        hi += 0x10000;

    val  = hi;
    val = FT_Common.UintToInt(val);

    return (s >= 0) ? val : -val;
}

function FT_Vector_Length(vec)
{
    var v = new FT_Vector();
    v.x = vec.x;
    v.y = vec.y;

    /* handle trivial cases */
    if (v.x == 0)
    {
        return (v.y >= 0) ? v.y : -v.y;
    }
    else if (v.y == 0)
    {
        return (v.x >= 0) ? v.x : -v.x;
    }

    /* general case */
    var shift = ft_trig_prenorm(v);
    ft_trig_pseudo_polarize(v);

    v.x = ft_trig_downscale(v.x);

    if (shift > 0)
        return (v.x + (1 << (shift - 1))) >> shift;
    return v.x << -shift;
}

function FT_Outline_EmboldenXY(outline, xstrength, ystrength)
{
    if (outline == null)
        return FT_Common.FT_Err_Invalid_Argument;

    xstrength /= 2;
    ystrength /= 2;

    if (xstrength == 0 && ystrength == 0)
        return 0;

    var orientation = FT_Outline_Get_Orientation(outline);
    if (orientation == FT_Common.FT_ORIENTATION_NONE)
    {
        if (outline.n_contours != 0)
            return FT_Common.FT_Err_Invalid_Argument;
        else
            return 0;
    }

    var points = outline.points;
    var contours = outline.contours;

    var v_first = new FT_Vector();
    var v_prev  = new FT_Vector();
    var v_cur   = new FT_Vector();
    var v_next  = new FT_Vector();

    var first = 0;
    var last = 0;
    for (var c = 0; c < outline.n_contours; c++)
    {
        var _in = new FT_Vector();
        var out = new FT_Vector();
        var shift = new FT_Vector();

        last = contours[c];

        v_first.x = points[first].x;
        v_first.y = points[first].y;

        v_prev.x = points[last].x;
        v_prev.y = points[last].y;

        v_cur.x = v_first.x;
        v_cur.y = v_first.y;

        /* compute the incoming vector and its length */
        _in.x = v_cur.x - v_prev.x;
        _in.y = v_cur.y - v_prev.y;
        var l_in = FT_Vector_Length(_in);

        for (var n = first; n <= last; n++)
        {
            if (n < last)
                v_next = points[n + 1];
            else
                v_next = v_first;

            /* compute the outgoing vector and its length */
            out.x = v_next.x - v_cur.x;
            out.y = v_next.y - v_cur.y;
            var l_out = FT_Vector_Length(out);

            var d = l_in * l_out + _in.x * out.x + _in.y * out.y;

            /* shift only if turn is less then ~160 degrees */
            if (16 * d > l_in * l_out)
            {
                /* shift components are aligned along bisector        */
                /* and directed according to the outline orientation. */
                shift.x = l_out * _in.y + l_in * out.y;
                shift.y = l_out * _in.x + l_in * out.x;

                if (orientation == FT_Common.FT_ORIENTATION_TRUETYPE)
                    shift.x = -shift.x;
                else
                    shift.y = -shift.y;

                /* threshold strength to better handle collapsing segments */
                var l = Math.min(l_in, l_out);
                var q = out.x * _in.y - out.y * _in.x;
                if (orientation == FT_Common.FT_ORIENTATION_TRUETYPE)
                    q = -q;

                if (FT_MulDiv(xstrength, q, l) < d)
                    shift.x = FT_MulDiv(shift.x, xstrength, d);
                else
                    shift.x = FT_MulDiv(shift.x, l, q);

                if (FT_MulDiv(ystrength, q, l) < d)
                    shift.y = FT_MulDiv(shift.y, ystrength, d);
                else
                    shift.y = FT_MulDiv(shift.y, l, q);
            }
            else
                shift.x = shift.y = 0;

            points[n].x = v_cur.x + xstrength + shift.x;
            points[n].y = v_cur.y + ystrength + shift.y;

            _in    = out;
            l_in  = l_out;
            v_cur.x = v_next.x;
            v_cur.y = v_next.y;
        }

        first = last + 1;
    }

    return 0;
}

function FT_Outline_EmboldenXY_cur(outline, base, xstrength, ystrength)
{
    if (outline == null)
        return FT_Common.FT_Err_Invalid_Argument;

    xstrength /= 2;
    ystrength /= 2;

    if (xstrength == 0 && ystrength == 0)
        return 0;

    var orientation = FT_Outline_Get_Orientation_Cur(outline, base);
    if (orientation == FT_Common.FT_ORIENTATION_NONE)
    {
        if (outline.n_contours != 0)
            return FT_Common.FT_Err_Invalid_Argument;
        else
            return 0;
    }

    var points = base.points;
    var contours = base.contours;

    var _p_off = outline.points;
    var _c_off = outline.contours;

    var v_first = new FT_Vector();
    var v_prev  = new FT_Vector();
    var v_cur   = new FT_Vector();
    var v_next  = new FT_Vector();

    var first = 0;
    var last = 0;
    for (var c = 0; c < outline.n_contours; c++)
    {
        var _in = new FT_Vector();
        var out = new FT_Vector();
        var shift = new FT_Vector();

        last = contours[_c_off + c];

        v_first.x = points[_p_off + first].x;
        v_first.y = points[_p_off + first].y;

        v_prev.x = points[_p_off + last].x;
        v_prev.y = points[_p_off + last].y;

        v_cur.x = v_first.x;
        v_cur.y = v_first.y;

        /* compute the incoming vector and its length */
        _in.x = v_cur.x - v_prev.x;
        _in.y = v_cur.y - v_prev.y;
        var l_in = FT_Vector_Length(_in);

        for (var n = first; n <= last; n++)
        {
            if (n < last)
            {
                v_next.x = points[_p_off + n + 1].x;
                v_next.y = points[_p_off + n + 1].y;
            }
            else
            {
                v_next.x = v_first.x;
                v_next.y = v_first.y;
            }

            /* compute the outgoing vector and its length */
            out.x = v_next.x - v_cur.x;
            out.y = v_next.y - v_cur.y;
            var l_out = FT_Vector_Length(out);

            var d = l_in * l_out + _in.x * out.x + _in.y * out.y;

            /* shift only if turn is less then ~160 degrees */
            if (16 * d > l_in * l_out)
            {
                /* shift components are aligned along bisector        */
                /* and directed according to the outline orientation. */
                shift.x = l_out * _in.y + l_in * out.y;
                shift.y = l_out * _in.x + l_in * out.x;

                if (orientation == FT_Common.FT_ORIENTATION_TRUETYPE)
                    shift.x = -shift.x;
                else
                    shift.y = -shift.y;

                /* threshold strength to better handle collapsing segments */
                var l = Math.min(l_in, l_out);
                var q = out.x * _in.y - out.y * _in.x;
                if (orientation == FT_Common.FT_ORIENTATION_TRUETYPE)
                    q = -q;

                if (FT_MulDiv(xstrength, q, l) < d)
                    shift.x = FT_MulDiv(shift.x, xstrength, d);
                else
                    shift.x = FT_MulDiv(shift.x, l, q);

                if (FT_MulDiv(ystrength, q, l) < d)
                    shift.y = FT_MulDiv(shift.y, ystrength, d);
                else
                    shift.y = FT_MulDiv(shift.y, l, q);
            }
            else
                shift.x = shift.y = 0;

            points[_p_off + n].x = v_cur.x + xstrength + shift.x;
            points[_p_off + n].y = v_cur.y + ystrength + shift.y;

            _in    = out;
            l_in  = l_out;
            v_cur.x = v_next.x;
            v_cur.y = v_next.y;
        }

        first = last + 1;
    }

    return 0;
}


function FT_Outline_Embolden(outline, strength)
{
    return FT_Outline_EmboldenXY(outline, strength, strength);
}
//------------

function FT_Outline_Transform(outline, matrix)
{
    if ( !outline || !matrix )
        return;

    var vec = outline.points;
    var len = outline.n_points;

    for (var i=0; i < len; i++)
        FT_Vector_Transform(vec[i], matrix);
}

function FT_Vector_Transform(vector, matrix)
{
    if ( !vector || !matrix )
        return;

    var xz = FT_MulFix(vector.x, matrix.xx) + FT_MulFix(vector.y, matrix.xy);
    var yz = FT_MulFix(vector.x, matrix.yx) + FT_MulFix(vector.y, matrix.yy);

    vector.x = xz;
    vector.y = yz;
}

function FT_Outline_Translate(outline, xOffset, yOffset)
{
    if ( !outline )
        return;

    var vec = outline.points;
    var c = outline.n_points;

    for (var n=0;n<c;n++)
    {
        vec[n].x += xOffset;
        vec[n].y += yOffset;
    }
}

function FT_Outline_Get_CBox(outline, acbox)
{
    var xMin, yMin, xMax, yMax;

    if (outline != null && acbox != null)
    {
        if (outline.n_points == 0)
        {
            xMin = 0;
            yMin = 0;
            xMax = 0;
            yMax = 0;
        }
        else
        {
            var p = outline.points;
            var vec = p[0];
            var count = outline.n_points;

            xMin = xMax = vec.x;
            yMin = yMax = vec.y;

            for (var i = 1; i < count; i++)
            {
                var x = p[i].x;
                if ( x < xMin ) xMin = x;
                if ( x > xMax ) xMax = x;

                var y = p[i].y;
                if ( y < yMin ) yMin = y;
                if ( y > yMax ) yMax = y;
            }
        }
        acbox.xMin = xMin;
        acbox.xMax = xMax;
        acbox.yMin = yMin;
        acbox.yMax = yMax;
    }
}

function FT_Glyph_Class()
{
    this.glyph_size = 0;
    this.glyph_format = 0;
    this.glyph_init = null;
    this.glyph_done = null;
    this.glyph_copy = null;
    this.glyph_transform = null;
    this.glyph_bbox = null;
    this.glyph_prepare = null;
}

// для быстроты работы не пользуется эта структура.
// все ради всех браузеров, кроме ie9. в них типизированные массивы
// быстрее обычных (а тут скорость доступа - самое главное)
function TCell()
{
    this.x      = 0;
    this.cover  = 0;
    this.area   = 0;
    this.next   = 0;
}

function TRaster()
{
    this.worker = new TWorker();

    this.memory = null;

    this.cell_x     = CreateIntArray(1024);
    this.cell_cover = CreateIntArray(1024);
    this.cell_area  = CreateIntArray(1024);
    this.cell_next  = CreateIntArray(1024);

    this.buffer_size    = 0;
    this.band_size      = 0;
}

// - smooth -----------------------------------------------------------
// ------------ rasterizer --------------------------------------------
// пул памяти для растеризатора делаем Array int'ов. Почему не массив структур?
// 1) не выделять память под саму структуру (хотя кто знает как работает js)
// 2) самое главное - это возможность замены на типизированный массив!!!
// сам растеризатор ничего не знает о происхождении массива. За создание
// его отвечает функция CreateIntArray
function CreateIntArray(size)
{
    var arr = null;
    if (typeof(Int32Array) != 'undefined' && !window.opera)
        arr = new Int32Array(size);
    else
        arr = new Array(size);
    for (var i=0;i<size;i++)
        arr[i] = 0;
    return arr;
}
function CreateUIntArray(size)
{
    var arr = null;
    if (typeof(UInt32Array) != 'undefined' && !window.opera)
        arr = new UInt32Array(size);
    else
        arr = new Array(size);
    for (var i=0;i<size;i++)
        arr[i] = 0;
    return arr;
}
function CreateCharArray(size)
{
    var arr = null;
    if (typeof(Int8Array) != 'undefined' && !window.opera)
        arr = new Int8Array(size);
    else
        arr = new Array(size);
    for (var i=0;i<size;i++)
        arr[i] = 0;
    return arr;
}
function CreateNullArray(size)
{
    var arr = new Array(size);
    for (var i=0;i<size;i++)
        arr[i] = null;
    return arr;
}
function TWorker()
{
    this.ex = 0;
    this.ey = 0;

    this.min_ex = 0;
    this.max_ex = 0;
    this.min_ey = 0;
    this.max_ey = 0;

    this.count_ex = 0;
    this.count_ey = 0;

    this.area = 0;
    this.cover = 0;
    this.invalid = 0;

    this.max_cells = 0;
    this.num_cells = 0;

    this.cx = 0;
    this.cy = 0;
    this.x = 0;
    this.y = 0;

    this.last_ey = 0;

    this.bez_stack_x = CreateIntArray(97);
    this.bez_stack_y = CreateIntArray(97);
    this.lev_stack = CreateIntArray(32);

    this.outline = null;
    this.target = null;
    this.clip_box = new FT_BBox();

    this.gray_spans = new Array(32);
    for (var i=0;i<32;i++)
        this.gray_spans[i] = new FT_Span();

    this.num_gray_spans = 0;

    this.render_span = null;
    
    this.render_span_data = null;
    this.span_y = 0;

    this.band_size = 0;
    this.band_shoot = 0;

    this.cell_x     = null;
    this.cell_cover = null;
    this.cell_area  = null;
    this.cell_next  = null;
    this.buffer_size = 1024;

    this.ycells = CreateIntArray(this.buffer_size);
    this.ycount = 0;

    this.raster_memory = raster_memory;
}

function gray_init_cells(worker, raster)
{
    worker.cell_x     = raster.cell_x;
    worker.cell_cover = raster.cell_cover;
    worker.cell_area  = raster.cell_area;
    worker.cell_next  = raster.cell_next;
    worker.buffer_size = 1024;

    worker.max_cells   = 0;
    worker.num_cells   = 0;
    worker.area        = 0;
    worker.cover       = 0;
    worker.invalid     = 1;
}

function gray_compute_cbox(worker)
{
    var outline = worker.outline;
    var p = outline.points;
    var c = outline.n_points;

    if ( c <= 0 )
    {
        worker.min_ex = worker.max_ex = 0;
        worker.min_ey = worker.max_ey = 0;
        return;
    }

    worker.min_ex = worker.max_ex = p[0].x;
    worker.min_ey = worker.max_ey = p[0].y;

    for (var i = 1; i < c; i++)
    {
        var x = p[i].x;
        var y = p[i].y;

        if ( x < worker.min_ex ) worker.min_ex = x;
        if ( x > worker.max_ex ) worker.max_ex = x;
        if ( y < worker.min_ey ) worker.min_ey = y;
        if ( y > worker.max_ey ) worker.max_ey = y;
    }

    /* truncate the bounding box to integer pixels */
    worker.min_ex = worker.min_ex >> 6;
    worker.min_ey = worker.min_ey >> 6;
    worker.max_ex = ( worker.max_ex + 63 ) >> 6;
    worker.max_ey = ( worker.max_ey + 63 ) >> 6;
}

function TBand()
{
    this.min = 0;
    this.max = 0;
}

function gray_find_cell(ras)
{
    var x = ras.ex;

    if ( x > ras.count_ex )
        x = ras.count_ex;

    var pcell = ras.ey;
    var cell = ras.ycells[pcell];

    var bis_y = 1;
    for (;;)
    {
        if (cell == -1 || ras.cell_x[cell] > x)
            break;

        if (ras.cell_x[cell] == x)
            return cell;

        bis_y = 0;
        pcell = cell;
        cell = ras.cell_next[cell];
    }

    if (ras.num_cells >= ras.max_cells)
        return -1;

    var oldcell = cell;

    cell = ras.num_cells++;
    ras.cell_x[cell] = x;
    ras.cell_area[cell] = 0;
    ras.cell_cover[cell] = 0;
    ras.cell_next[cell] = oldcell;

    if (1 == bis_y)
        ras.ycells[pcell] = cell;
    else
        ras.cell_next[pcell] = cell;
    return cell;
}

function gray_record_cell(ras)
{
    if (0 == ras.invalid && ((ras.area | ras.cover) != 0))
    {
        var cell = gray_find_cell(ras);
        if (-1 == cell)
            return FT_Common.ErrorLongJump;

        ras.cell_area[cell] += ras.area;
        ras.cell_cover[cell] += ras.cover;
    }
    return 0;
}

function gray_set_cell(ras, ex, ey)
{
    ey -= ras.min_ey;

    if ( ex > ras.max_ex )
        ex = ras.max_ex;

    ex -= ras.min_ex;
    if ( ex < 0 )
        ex = -1;

    /* are we moving to a different cell ? */
    if ( ex != ras.ex || ey != ras.ey )
    {
        /* record the current one if it is valid */
        if (0 == ras.invalid)
        {
            var err = gray_record_cell(ras);
            if (err == FT_Common.ErrorLongJump)
                return FT_Common.ErrorLongJump;
        }

        ras.area  = 0;
        ras.cover = 0;
    }

    ras.ex      = ex;
    ras.ey      = ey;

    var _ey = ey >= 0 ? ey : ey + FT_Common.a_i;
    var _cy = ras.count_ey >= 0 ? ras.count_ey : ras.count_ey + FT_Common.a_i;

    ras.invalid = (_ey >= _cy || ex >= ras.count_ex) ? 1 : 0;
    return 0;
}

function gray_start_cell(ras, ex, ey)
{
    if (ex > ras.max_ex)
        ex = ras.max_ex;

    if (ex < ras.min_ex)
        ex = (ras.min_ex - 1);

    ras.area    = 0;
    ras.cover   = 0;
    ras.ex      = ex - ras.min_ex;
    ras.ey      = ey - ras.min_ey;
    ras.last_ey = ey << 8;
    ras.invalid = 0;

    return gray_set_cell(ras, ex, ey);
}

function gray_render_line(ras, to_x, to_y)
{
    var ey1, ey2, fy1, fy2, mod;
    var dx, dy, x, x2;
    var p, first;
    var delta, rem, lift, incr;

    ey1 = (ras.last_ey >> 8);
    ey2 = (to_y >> 8);     /* if (ey2 >= ras.max_ey) ey2 = ras.max_ey-1; */
    fy1 = (ras.y - ras.last_ey);
    fy2 = (to_y - (ey2 << 8));

    dx = to_x - ras.x;
    dy = to_y - ras.y;

    var min = ey1;
    var max = ey2;

    if (ey1 > ey2)
    {
        min = ey2;
        max = ey1;
    }
    if (min >= ras.max_ey || max < ras.min_ey)
    {
        ras.x       = to_x;
        ras.y       = to_y;
        ras.last_ey = ey2 << 8;
        return 0;
    }

    var err = 0;
    /* everything is on a single scanline */
    if (ey1 == ey2)
    {
        err = gray_render_scanline(ras, ey1, ras.x, fy1, to_x, fy2);
        if (err == FT_Common.ErrorLongJump)
            return FT_Common.ErrorLongJump;
        ras.x       = to_x;
        ras.y       = to_y;
        ras.last_ey = ey2 << 8;
        return 0;
    }

    /* vertical line - avoid calling gray_render_scanline */
    incr = 1;

    if (dx == 0)
    {
        var ex = ras.x >> 8;
        var two_fx = ((ras.x - (ex << 8)) << 1);
        var area;

        first = 256;
        if (dy < 0)
        {
            first = 0;
            incr  = -1;
        }

        delta      = (first - fy1);
        ras.area  += (two_fx * delta);
        ras.cover += delta;
        ey1       += incr;

        err = gray_set_cell(ras, ex, ey1);
        if (err == FT_Common.ErrorLongJump)
            return FT_Common.ErrorLongJump;

        delta = (first + first - 256);
        area  = two_fx * delta;
        while (ey1 != ey2)
        {
            ras.area  += area;
            ras.cover += delta;
            ey1       += incr;

            err = gray_set_cell(ras, ex, ey1);
            if (err == FT_Common.ErrorLongJump)
                return FT_Common.ErrorLongJump;
        }

        delta      = (fy2 - 256 + first);
        ras.area  += (two_fx * delta);
        ras.cover += delta;

        ras.x       = to_x;
        ras.y       = to_y;
        ras.last_ey = ey2 << 8;
        return 0;
    }

    /* ok, we have to render several scanlines */
    p     = (256 - fy1) * dx;
    first = 256;
    incr  = 1;

    if (dy < 0)
    {
        p     = fy1 * dx;
        first = 0;
        incr  = -1;
        dy    = -dy;
    }

    delta = parseInt(p / dy);
    mod   = (p % dy);
    if (mod < 0)
    {
        delta--;
        mod += dy;
    }

    x = ras.x + delta;
    err = gray_render_scanline(ras, ey1, ras.x, fy1, x, first);
    if (err == FT_Common.ErrorLongJump)
        return FT_Common.ErrorLongJump;

    ey1 += incr;
    err = gray_set_cell(ras, x >> 8, ey1);
    if (err == FT_Common.ErrorLongJump)
        return FT_Common.ErrorLongJump;

    if (ey1 != ey2)
    {
        p     = 256 * dx;
        lift  = parseInt(p / dy);
        rem   = (p % dy);
        if (rem < 0)
        {
            lift--;
            rem += dy;
        }
        mod -= dy;

        while (ey1 != ey2)
        {
            delta = lift;
            mod  += rem;
            if (mod >= 0)
            {
                mod -= dy;
                delta++;
            }

            x2 = x + delta;
            err = gray_render_scanline(ras, ey1, x, 256 - first, x2, first);
            if (err == FT_Common.ErrorLongJump)
                return FT_Common.ErrorLongJump;
            x = x2;

            ey1 += incr;
            err = gray_set_cell(ras, x >> 8, ey1);
            if (err == FT_Common.ErrorLongJump)
                return FT_Common.ErrorLongJump;
        }
    }

    err = gray_render_scanline(ras, ey1, x, 256 - first, to_x, fy2);
    if (err == FT_Common.ErrorLongJump)
        return FT_Common.ErrorLongJump;

    ras.x       = to_x;
    ras.y       = to_y;
    ras.last_ey = (ey2 << 8);
    return 0;
}

function gray_split_conic(bx,by,base)
{
    var a,b;
    bx[base+4] = bx[base+2];
    b = bx[base+1];
    a=bx[base+3] = parseInt((bx[base+2]+b)/2);
    b=bx[base+1] = parseInt((bx[base]+b)/2);
    bx[base+2] = parseInt((a+b)/2);

    by[base+4] = by[base+2];
    b = by[base+1];
    a=by[base+3] = parseInt((by[base+2]+b)/2);
    b=by[base+1] = parseInt((by[base]+b)/2);
    by[base+2] = parseInt((a+b)/2);
}

function gray_render_conic(ras, control, to)
{
    var dx, dy;
    var min, max, y;
    var top, level;
    var arc = 0;

    var arcx = ras.bez_stack_x;
    var arcy = ras.bez_stack_y;

    arcx[arc] = (to.x << 2);
    arcy[arc] = (to.y << 2);
    arcx[arc+1] = (control.x << 2);
    arcy[arc+1] = (control.y << 2);
    arcx[arc+2] = ras.x;
    arcy[arc+2] = ras.y;
    top = 0;

    dx = Math.abs(arcx[arc+2] + arcx[arc] - 2*arcx[arc+1]);
    dy = Math.abs(arcy[arc+2] + arcy[arc] - 2*arcy[arc+1]);
    if (dx < dy)
        dx = dy;

    if (dx < 64)
    {
        return gray_render_line(ras, arcx[arc], arcy[arc]);
    }

    /* short-cut the arc that crosses the current band */
    min = max = arcy[arc];

    y = arcy[arc+1];
    if (y < min) min = y;
    if (y > max) max = y;

    y = arcy[arc+2];
    if (y < min) min = y;
    if (y > max) max = y;

    if (((min >> 8) >= ras.max_ey) || ((max >> 8) < ras.min_ey))
    {
        return gray_render_line(ras, arcx[arc], arcy[arc]);
    }

    level = 0;
    do
    {
        dx >>= 2;
        level++;
    } while (dx > 64);

    var levels = ras.lev_stack;
    levels[0] = level;

    var err = 0;
    do
    {
        level = levels[top];
        if (level > 0)
        {
            gray_split_conic(arcx, arcy, arc);
            arc += 2;
            top++;
            levels[top] = levels[top - 1] = level - 1;
            continue;
        }

        err = gray_render_line(ras, arcx[arc], arcy[arc]);
        if (err == FT_Common.ErrorLongJump)
            return FT_Common.ErrorLongJump;
        top--;
        arc -= 2;

    }
    while (top >= 0);
    return 0;
}

function gray_split_cubic(bx,by,base)
{
    var a,b,c,d;
    bx[base+6] = bx[base+3];
    c = bx[base+1];
    d = bx[base+2];
    bx[base+1] = a = parseInt((bx[base]+c)/2);
    bx[base+5] = b = parseInt((bx[base+3]+d)/2);
    c = parseInt((c+d)/2);
    bx[base+2] = a = parseInt((a+c)/2);
    bx[base+4] = b = parseInt((b+c)/2);
    bx[base+3] = parseInt((a+b)/2);

    by[base+6] = by[base+3];
    c = by[base+1];
    d = by[base+2];
    by[base+1] = a = parseInt((by[base]+c)/2);
    by[base+5] = b = parseInt((by[base+3]+d)/2);
    c = parseInt((c+d)/2);
    by[base+2] = a = parseInt((a+c)/2);
    by[base+4] = b = parseInt((b+c)/2);
    by[base+3] = parseInt((a+b)/2);
}

function gray_render_cubic(ras, control1, control2, to)
{
    var min, max, y;

    var arcx = ras.bez_stack_x;
    var arcy = ras.bez_stack_y;
    arcx[0] = to.x << 2;
    arcy[0] = to.y << 2;
    arcx[1] = control2.x << 2;
    arcy[1] = control2.y << 2;
    arcx[2] = control1.x << 2;
    arcy[2] = control1.y << 2;
    arcx[3] = ras.x;
    arcy[3] = ras.y;

    var arc = 0;

    /* Short-cut the arc that crosses the current band. */
    min = max = arcy[0];

    y = arcy[arc+1];
    if (y<min)
        min = y;
    if (y>max)
        max = y;

    y = arcy[arc+2];
    if (y<min)
        min = y;
    if (y>max)
        max = y;

    y = arcy[arc+3];
    if (y<min)
        min = y;
    if (y>max)
        max = y;

    var err = 0;
    if ((min >> 8) >= ras.max_ey || (max >> 8) < ras.min_ey)
    {
        return gray_render_line(ras, arcx[arc], arcy[arc]);
    }

    for (;;)
    {
        var dx, dy, dx_, dy_;
        var dx1, dy1, dx2, dy2;
        var L, s, s_limit;

        dx = arcx[arc+3] - arcx[arc];
        dy = arcy[arc+3] - arcy[arc];

        dx_ = Math.abs(dx);
        dy_ = Math.abs(dy);

        L = ((dx_ > dy_) ? (236 * dx_ + 97 * dy_) : (97 * dx_ + 236 * dy_)) >>> 8;

        if ( L > 32767 )
        {
            gray_split_cubic(arcx,arcy,arc);
            arc += 3;
            continue;
        }

        s_limit = L * 42;

        dx1 = arcx[arc+1] - arcx[arc];
        dy1 = arcy[arc+1] - arcy[arc];
        s = Math.abs(dy*dx1 - dx*dy1);

        if (s>s_limit)
        {
            gray_split_cubic(arcx,arcy,arc);
            arc += 3;
            continue;
        }

        dx2 = arcx[arc+2] - arcx[arc];
        dy2 = arcy[arc+2] - arcy[arc];
        s = Math.abs(dy*dx2 - dx*dy2);

        if (s>s_limit)
        {
            gray_split_cubic(arcx,arcy,arc);
            arc += 3;
            continue;
        }

        if (((dy*dy1 + dx*dx1) < 0) || ((dy*dy2 + dx*dx2) < 0) ||
            ((dy*(arcy[arc+3]-arcy[arc+1]) + dx*(arcx[arc+3]-arcx[arc+1])) < 0) ||
            ((dy*(arcy[arc+3]-arcy[arc+2]) + dx*(arcx[arc+3]-arcx[arc+2])) < 0))
        {
            gray_split_cubic(arcx,arcy,arc);
            arc += 3;
            continue;
        }

        /* No reason to split. */
        err = gray_render_line(ras, arcx[arc], arcy[arc]);
        if (err == FT_Common.ErrorLongJump)
            return FT_Common.ErrorLongJump;

        if (arc == 0)
            return 0;

        arc -= 3;
    }
    return 0;
}

function gray_render_scanline(ras, ey, x1, y1, x2, y2)
{
    var ex1, ex2, fx1, fx2, delta, mod, lift, rem;
    var p, first, dx;
    var incr;

    dx = x2 - x1;

    ex1 = (x1 >> 8);
    ex2 = (x2 >> 8);
    fx1 = x1 - (ex1 << 8);
    fx2 = x2 - (ex2 << 8);

    /* trivial case.  Happens often */
    if (y1 == y2)
    {
        return gray_set_cell(ras, ex2, ey);
    }

    /* everything is located in a single cell.  That is easy! */
    if (ex1 == ex2)
    {
        delta = y2 - y1;
        ras.area  += ((fx1+fx2)*delta);
        ras.cover += delta;
        return 0;
    }

    /* ok, we'll have to render a run of adjacent cells on the same scanline */
    p = (256 - fx1)*(y2-y1);
    first = 256;
    incr  = 1;

    if (dx < 0)
    {
        p     = fx1*(y2-y1);
        first = 0;
        incr  = -1;
        dx    = -dx;
    }

    delta = parseInt(p/dx);
    mod   = p%dx;
    if (mod < 0)
    {
        delta--;
        mod += dx;
    }

    ras.area  += ((fx1+first)*delta);
    ras.cover += delta;

    ex1 += incr;
    var err = gray_set_cell(ras, ex1, ey);
    if (err == FT_Common.ErrorLongJump)
        return err;
    y1  += delta;

    if (ex1 != ex2)
    {
        p    = 256 * (y2 - y1 + delta);
        lift = parseInt(p/dx);
        rem  = (p%dx);
        if (rem < 0)
        {
            lift--;
            rem += dx;
        }

        mod -= dx;

        while (ex1 != ex2)
        {
            delta = lift;
            mod  += rem;
            if (mod >= 0)
            {
                mod -= dx;
                delta++;
            }

            ras.area  += (256*delta);
            ras.cover += delta;
            y1        += delta;
            ex1       += incr;
            err = gray_set_cell(ras, ex1, ey);
            if (err == FT_Common.ErrorLongJump)
                return err;
        }
    }

    delta      = y2 - y1;
    ras.area  += ((fx2 + 256 - first)*delta);
    ras.cover += delta;
    return 0;
}

function _gray_render_span(y, count, spans, span_start, worker)
{
    var map = worker.target;
    var pixels = map.buffer.data;
    var p = -y * map.pitch;
    if (map.pitch >= 0)
        p += ((map.rows-1)*map.pitch);

    var s = span_start;
    for (;count > 0;count--,s++)
    {
        var coverage = spans[s].coverage;

        if (coverage != 0)
        {
            var len = spans[s].len;
            var q = spans[s].x + p;
            for (;len>0;len--)
                pixels[q++] = coverage;
        }
    }
}
function gray_render_span(y, count, spans, span_start, worker)
{
    var map = worker.raster_memory;
    var pixels = map.m_oBuffer.data;
    var p = -y * map.pitch;
    if (worker.target.pitch >= 0)
        p += ((worker.target.rows-1)*map.pitch);

    p+=3;

    var s = span_start;
    for (;count > 0;count--,s++)
    {
        var coverage = spans[s].coverage;

        if (coverage != 0)
        {
            var len = spans[s].len;
            var q = (spans[s].x * 4) + p;
            for (;len>0;len--,q+=4)
                pixels[q] = coverage;
        }
    }
}

function gray_hline(ras, x, y, area, acount)
{
    var spans = ras.gray_spans;
    var span_i = 0;
    var span;

    var count;

    var coverage = (area >> 9);
    /* use range 0..256 */
    if (coverage < 0)
        coverage = -coverage;

    if ((ras.outline.flags & FT_Common.FT_OUTLINE_EVEN_ODD_FILL) != 0)
    {
        coverage &= 511;
        if (coverage > 256)
            coverage = 512 - coverage;
        else if (coverage == 256)
            coverage = 255;
    }
    else
    {
        if ( coverage >= 256 )
            coverage = 255;
    }

    y += ras.min_ey;
    x += ras.min_ex;

    if (x >= 32767)
        x = 32767;

    /* FT_Span.y is an integer, so limit our coordinates appropriately */
    if (y >= 2147483647)
        y = 2147483647;

    if (coverage != 0)
    {
        /* see whether we can add this span to the current list */
        count = ras.num_gray_spans;
        span_i  = count - 1;
        span = spans[span_i];
        if ((count > 0) && (ras.span_y == y) && ((span.x + span.len) == x) && (span.coverage == coverage))
        {
            span.len = (span.len + acount) & 0xFFFF;
            return;
        }

        if (ras.span_y != y || count >= 32)
        {
            if (ras.render_span && count > 0)
                ras.render_span(ras.span_y,count,ras.gray_spans,0,ras.render_span_data);

            ras.num_gray_spans = 0;
            ras.span_y = y;

            count = 0;
            span_i = 0;
            span = spans[0];
        }
        else
        {
            span_i++;
            span = spans[span_i];
        }

        /* add a gray span to the current list */
        span.x        = x;
        span.len      = acount & 0xFFFF;
        span.coverage = coverage & 0xFF;

        ras.num_gray_spans++;
    }
}

function gray_sweep(ras, target)
{
    if (ras.num_cells == 0)
        return;

    ras.num_gray_spans = 0;

    var _next = ras.cell_next;
    var _cover = ras.cell_cover;
    var _area = ras.cell_area;
    var _x = ras.cell_x;

    for (var yindex = 0; yindex < ras.ycount; yindex++)
    {
        var cell = ras.ycells[yindex];
        var cover = 0;
        var x = 0;

        for (; cell != -1; cell = _next[cell])
        {
            if (_x[cell] > x && cover != 0)
                gray_hline(ras, x, yindex, cover * 512, _x[cell] - x);

            cover += _cover[cell];
            var area = cover * 512 - _area[cell];

            if (area != 0 && _x[cell] >= 0)
                gray_hline(ras, _x[cell], yindex, area, 1);

            x = _x[cell] + 1;
        }

        if ( cover != 0 )
            gray_hline(ras, x, yindex, cover * 512, ras.count_ex - x);
    }

    if (ras.render_span && ras.num_gray_spans > 0)
        ras.render_span(ras.span_y, ras.num_gray_spans, ras.gray_spans, 0, ras.render_span_data);
}

function __grays_raster_render(raster, params)
{
    var outline = params.source;
    var target_map = params.target;

    if (raster == null)
        return FT_Common.FT_Err_Invalid_Argument;

    if (outline == null)
        return FT_Common.FT_Err_Invalid_Outline;

    /* return immediately if the outline is empty */
    if (outline.n_points == 0 || outline.n_contours <= 0)
        return 0;

    if (outline.contours == null || outline.points == null)
        return FT_Common.FT_Err_Invalid_Outline;

    if (outline.n_points != outline.contours[outline.n_contours - 1] + 1)
        return FT_Common.FT_Err_Invalid_Outline;

    var worker = raster.worker;

    /* if direct mode is not set, we must have a target bitmap */
    if (0 == (params.flags & FT_Common.FT_RASTER_FLAG_DIRECT))
    {
        if (target_map == null)
            return FT_Common.FT_Err_Invalid_Argument;

        /* nothing to do */
        if (0 == target_map.width || 0 == target_map.rows)
            return 0;

        if (null == target_map.buffer && null == worker.raster_memory)
            return FT_Common.FT_Err_Invalid_Argument;
    }

    /* this version does not support monochrome rendering */
    if (0 == (params.flags & FT_Common.FT_RASTER_FLAG_AA))
        return FT_Common.FT_Err_Invalid_Argument;

    /* compute clipping box */
    if (0 == (params.flags & FT_Common.FT_RASTER_FLAG_DIRECT))
    {
        /* compute clip box from target pixmap */
        worker.clip_box.xMin = 0;
        worker.clip_box.yMin = 0;
        worker.clip_box.xMax = target_map.width;
        worker.clip_box.yMax = target_map.rows;
    }
    else if (params.flags & FT_Common.FT_RASTER_FLAG_CLIP)
    {
        worker.clip_box.xMin = params.clip_box.xMin;
        worker.clip_box.yMin = params.clip_box.yMin;
        worker.clip_box.xMax = params.clip_box.xMax;
        worker.clip_box.yMax = params.clip_box.yMax;
    }
    else
    {
        worker.clip_box.xMin = -32768;
        worker.clip_box.yMin = -32768;
        worker.clip_box.xMax =  32767;
        worker.clip_box.yMax =  32767;
    }

    gray_init_cells(worker, raster);

    worker.outline        = outline;
    worker.num_cells      = 0;
    worker.invalid        = 1;
    worker.band_size      = raster.band_size;
    worker.num_gray_spans = 0;

    if (0 != (params.flags & FT_Common.FT_RASTER_FLAG_DIRECT))
    {
        worker.render_span      = params.gray_spans;
        worker.render_span_data = params.user;
    }
    else
    {
        worker.target           = target_map;
        worker.render_span      = gray_render_span;
        worker.render_span_data = worker;
    }

    if (worker.raster_memory != null)
        worker.raster_memory.CheckSize(target_map.width, target_map.rows);

    return __gray_convert_glyph(worker);
}
function __gray_convert_glyph(ras)
{
    var bands = m_bands;
    var band = 0;
    var n = 0;
    var num_bands = 0;
    var min = 0;
    var max = 0;
    var max_y = 0;
    var clip = null;

    gray_compute_cbox(ras);

    /* clip to target bitmap, exit if nothing to do */
    clip = ras.clip_box;

    if (ras.max_ex <= clip.xMin || ras.min_ex >= clip.xMax ||
        ras.max_ey <= clip.yMin || ras.min_ey >= clip.yMax )
        return 0;

    if (ras.min_ex < clip.xMin) ras.min_ex = clip.xMin;
    if (ras.min_ey < clip.yMin) ras.min_ey = clip.yMin;

    if (ras.max_ex > clip.xMax ) ras.max_ex = clip.xMax;
    if (ras.max_ey > clip.yMax ) ras.max_ey = clip.yMax;

    ras.count_ex = ras.max_ex - ras.min_ex;
    ras.count_ey = ras.max_ey - ras.min_ey;

    /* set up vertical bands */
    num_bands = parseInt((ras.max_ey - ras.min_ey) / ras.band_size);
    if (num_bands == 0)
        num_bands = 1;
    if (num_bands >= 39)
        num_bands = 39;

    ras.band_shoot = 0;

    min   = ras.min_ey;
    max_y = ras.max_ey;

    for (n = 0; n < num_bands; n++, min = max)
    {
        max = min + ras.band_size;
        if ((n == num_bands - 1) || (max > max_y))
            max = max_y;

        bands[0].min = min;
        bands[0].max = max;
        band = 0;

        while (band >= 0)
        {
            var isReduceBands = 0;

            var bottom, top, middle;
            var error = 0;
            var _band = bands[band];

            var cells_max;

            ras.ycount = _band.max - _band.min;
            if (ras.ycount >= ras.buffer_size)
                isReduceBands = 1;

            if (0 == isReduceBands)
            {
                ras.max_cells = ras.buffer_size;
                if (ras.max_cells < 2)
                {
                    // такого быть не может из-за лишнего килобайтика)
                    isReduceBands = 1;
                }

                if (0 == isReduceBands)
                {
                    for (var yindex = 0; yindex < ras.ycount; yindex++)
                        ras.ycells[yindex] = -1;

                    ras.num_cells = 0;
                    ras.invalid   = 1;
                    ras.min_ey    = _band.min;
                    ras.max_ey    = _band.max;
                    ras.count_ey  = _band.max - _band.min;

                    error = __gray_convert_glyph_inner(ras);

                    if (0 == error)
                    {
                        gray_sweep(ras, ras.target);
                        band--;
                        continue;
                    }
                    else if (error != FT_Common.FT_Err_Raster_Overflow)
                        return 1;
                }
            }

            /* render pool overflow; we will reduce the render band by half */
            bottom = _band.min;
            top    = _band.max;
            middle = bottom + ((top - bottom) >> 1);

            /* This is too complex for a single scanline; there must */
            /* be some problems.                                     */
            if (middle == bottom)
                return 1;

            if (bottom-top >= ras.band_size)
                ras.band_shoot++;


            bands[band+1].min = bottom;
            bands[band+1].max = middle;
            bands[band].min = middle;
            bands[band].max = top;

            band++;
        }
    }

    if (ras.band_shoot > 8 && ras.band_size > 16)
        ras.band_size = parseInt(ras.band_size / 2);

    return 0;
}

function __gray_convert_glyph_inner(ras)
{
    var error1 = FT_Outline_Decompose(ras.outline, ft_outline_funcs_gray, ras);

    if (FT_Common.ErrorLongJump == error1)
        return FT_Common.FT_Err_Raster_Overflow;

    var error2 = gray_record_cell(ras);
    if (FT_Common.ErrorLongJump == error2)
        return FT_Common.FT_Err_Raster_Overflow;

    return error1;
}

var m_bands = new Array(40);
for (var i = 0; i < 40; i++)
    m_bands[i] = new TBand();

function FT_Grays_Raster()
{
    // --------
    this.glyph_format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

    this.raster_new = function(memory, raster)
    {
        raster.memory = memory;
        return 0;
    }
    this.raster_reset = function(raster, pool_base, pool_size)
    {
        raster.buffer_size    = 1024;
        raster.band_size      = 117; // сделал как в си-шной либе, чтобы было удобно дебажиться.
        // а вообще - нужно так: (мы памяти выделяем больше на 1kb (под указатели ycells))
        //raster.band_size = 128;
    }
    this.raster_set_mode = null;
    this.raster_render = __grays_raster_render;
    this.raster_done = function()
    {
    }
}
// --------------------------------------------------------------------

function FT_Smooth_Renderer_Class()
{
    this.flags = FT_Common.FT_MODULE_RENDERER;
    this.name = "smooth";
    this.version = 0x10000;
    this.requires = 0x20000;

    this.module_interface = null;

    this.init = ft_smooth_init;
    this.done = null;
    this.get_interface = null;

    this.glyph_format = FT_Common.FT_GLYPH_FORMAT_OUTLINE;

    this.render_glyph = ft_smooth_render;
    this.transform_glyph = ft_smooth_transform;
    this.get_glyph_cbox = ft_smooth_get_cbox;
    this.set_mode = ft_smooth_set_mode;

    this.raster_class = new FT_Grays_Raster();
}
function FT_Smooth_Renderer()
{
    this.clazz = new FT_Smooth_Renderer_Class();
    this.library = null;
    this.memory = null;
    this.generic = null;

    this.glyph_format = 0;
    this.glyph_class = new FT_Glyph_Class();
    this.raster = null;

    this.raster_render = null;
    this.render = null;
}

function create_renderer_smooth_module(library)
{
    var ren1_mod = new FT_Smooth_Renderer();
    ren1_mod.clazz = new FT_Smooth_Renderer_Class();
    ren1_mod.clazz.render_glyph = ft_smooth_render;

    ren1_mod.library = library;
    ren1_mod.memory = library.Memory;
    ren1_mod.generic = null;

    return ren1_mod;
}
function create_renderer_smooth_lcd_module(library)
{
    var ren1_mod = new FT_Smooth_Renderer();
    ren1_mod.clazz = new FT_Smooth_Renderer_Class();
    ren1_mod.clazz.render_glyph = ft_smooth_render_lcd;

    ren1_mod.library = library;
    ren1_mod.memory = library.Memory;
    ren1_mod.generic = null;

    return ren1_mod;
}
function create_renderer_smooth_lcd_v_module(library)
{
    var ren1_mod = new FT_Smooth_Renderer();
    ren1_mod.clazz = new FT_Smooth_Renderer_Class();
    ren1_mod.clazz.render_glyph = ft_smooth_render_lcd_v;

    ren1_mod.library = library;
    ren1_mod.memory = library.Memory;
    ren1_mod.generic = null;

    return ren1_mod;
}

function ft_smooth_init(render)
{
    render.clazz.raster_class.raster_reset(render.raster, render.library.raster_pool, render.library.raster_pool_size);
    return 0;
}

function ft_smooth_set_mode(render, mode_tag, data)
{
    return render.clazz.raster_class.raster_set_mode(render.raster, mode_tag, data);
}

function ft_smooth_transform(render, slot, matrix, delta)
{
    if (slot.format != render.glyph_format)
        return FT_Common.FT_Err_Invalid_Argument;

    if (matrix)
        FT_Outline_Transform(slot.outline, matrix);

    if (delta)
        FT_Outline_Translate(slot.outline, delta.x, delta.y);

    return 0;
}

function ft_smooth_get_cbox(render, slot, cbox)
{
    cbox.xMin = 0;
    cbox.yMin = 0;
    cbox.xMax = 0;
    cbox.yMax = 0;

    if (slot.format == render.glyph_format)
        FT_Outline_Get_CBox(slot.outline, cbox);
}

function ft_smooth_render(render, slot, mode, origin)
{
    if (mode == FT_Common.FT_RENDER_MODE_LIGHT)
        mode = FT_Common.FT_RENDER_MODE_NORMAL;

    return ft_smooth_render_generic(render, slot, mode, origin, FT_Common.FT_RENDER_MODE_NORMAL);
}

function ft_smooth_render_lcd(render, slot, mode, origin)
{
    var error = ft_smooth_render_generic(render, slot, mode, origin, FT_Common.FT_RENDER_MODE_LCD);
    if (error == 0)
        slot.bitmap.pixel_mode = FT_Common.FT_PIXEL_MODE_LCD;

    return error;
}

function ft_smooth_render_lcd_v(render, slot, mode, origin)
{
    var error = ft_smooth_render_generic(render, slot, mode, origin, FT_Common.FT_RENDER_MODE_LCD_V);
    if (error == 0)
        slot.bitmap.pixel_mode = FT_Common.FT_PIXEL_MODE_LCD_V;

    return error;
}

function ft_smooth_render_generic(render, slot, mode, origin, required_mode)
{
    var error = 0;
    var outline = null;
    var cbox = new FT_BBox();
    var width, height, pitch;

    //#ifndef FT_CONFIG_OPTION_SUBPIXEL_RENDERING
    var height_org, width_org;
    //#endif

    var hmul = (mode == FT_Common.FT_RENDER_MODE_LCD) ? 1 : 0;
    var vmul = (mode == FT_Common.FT_RENDER_MODE_LCD_V) ? 1 : 0;
    var x_shift, y_shift, x_left, y_top;

    var params = new FT_Raster_Params();

    /* check glyph image format */
    if (slot.format != render.glyph_format)
        return FT_Common.FT_Err_Invalid_Argument;

    /* check mode */
    if (mode != required_mode)
        return FT_Common.FT_Err_Cannot_Render_Glyph;

    outline = slot.outline;

    /* translate the outline to the new origin if needed */
    if (origin != null)
        FT_Outline_Translate(outline, origin.x, origin.y);

    /* compute the control box, and grid fit it */
    FT_Outline_Get_CBox(outline, cbox);

    cbox.xMin = (cbox.xMin & ~63);
    cbox.yMin = (cbox.yMin & ~63);
    cbox.xMax = ((cbox.xMax+63) & ~63);
    cbox.yMax = ((cbox.yMax+63) & ~63);

    if (cbox.xMin < 0 && cbox.xMax > 2147483647 + cbox.xMin)
    {
        if (outline && origin)
            FT_Outline_Translate(outline, -origin.x, -origin.y);
        return FT_Common.FT_Err_Raster_Overflow;
    }
    else
        width  = ((cbox.xMax - cbox.xMin) >>> 6);

    if ( cbox.yMin < 0 && cbox.yMax > 2147483647 + cbox.yMin )
    {
        if ( outline && origin )
            FT_Outline_Translate( outline, -origin.x, -origin.y );
        return FT_Common.FT_Err_Raster_Overflow;
    }
    else
        height = ((cbox.yMax - cbox.yMin) >>> 6);

    var bitmap = slot.bitmap;
    var memory = render.memory;

    //#ifndef FT_CONFIG_OPTION_SUBPIXEL_RENDERING
    width_org  = width;
    height_org = height;
    //#endif

    /* release old bitmap buffer */
    if (slot.internal.flags & FT_Common.FT_GLYPH_OWN_BITMAP)
    {
        delete bitmap.buffer;
        slot.internal.flags &= ~FT_Common.FT_GLYPH_OWN_BITMAP;
    }

    /* allocate new one */
    pitch = width;
    if (hmul == 1)
    {
        width = width * 3;
        pitch = (width + 3) & ~3;
    }

    if (vmul == 1)
        height *= 3;

    x_shift = cbox.xMin;
    y_shift = cbox.yMin;
    x_left  = cbox.xMin >> 6;
    y_top   = cbox.yMax >> 6;

    //#ifdef FT_CONFIG_OPTION_SUBPIXEL_RENDERING
    /*
    if (slot.library.lcd_filter_func)
    {
        var extra = slot.library.lcd_extra;
        if (hmul == 1)
        {
            x_shift -= 64 * (extra >>> 1);
            width   += 3 * extra;
            pitch    = (width + 3) & ~3;
            x_left  -= (extra >>> 1);
        }
        if (vmul == 1)
        {
            y_shift -= 64 * (extra >>> 1);
            height  += 3 * extra;
            y_top   += (extra >>> 1);
        }
    }
    */
    //#endif

    if (width > 0x7FFF || height > 0x7FFF)
    {
        if (outline && origin)
            FT_Outline_Translate(outline, -origin.x, -origin.y);
        return FT_Common.FT_Err_Raster_Overflow;
    }

    bitmap.pixel_mode = FT_Common.FT_PIXEL_MODE_GRAY;
    bitmap.num_grays  = 256;
    bitmap.width      = width;
    bitmap.rows       = height;
    bitmap.pitch      = pitch;

    if (bitmap.width > 1000 || bitmap.height > 1000)
        return 130;

    /* translate outline to render it into the bitmap */
    FT_Outline_Translate(outline, -x_shift, -y_shift);
    var memory = slot.library.Memory;

    //bitmap.buffer = memory.Alloc(pitch * height);

    slot.internal.flags |= FT_Common.FT_GLYPH_OWN_BITMAP;

    /* set up parameters */
    params.target = bitmap;
    params.source = outline;
    params.flags  = FT_Common.FT_RASTER_FLAG_AA;

    //#ifdef FT_CONFIG_OPTION_SUBPIXEL_RENDERING
    /*
    var points = outline.points;
    var count = outline.n_points;

    if (hmul == 1)
        for (var i = 0; i < count; i++)
            points[i].x = points[i].x * 3;

    if (vmul == 1)
        for (var i = 0; i < count; i++)
            points[i].y = points[i].y * 3;
    error = render.raster_render(render.raster, params);
    if (hmul == 1)
        for (var i = 0; i < count; i++)
            points[i].x = parseInt(points[i].x / 3);

    if (vmul == 1)
        for (var i = 0; i < count; i++)
            points[i].y = parseInt(points[i].y / 3);

    if (slot.library.lcd_filter_func)
        slot.library.lcd_filter_func(bitmap, mode, slot.library);
    */

    //#else /* !FT_CONFIG_OPTION_SUBPIXEL_RENDERING */
    error = render.raster_render(render.raster, params);
    if (hmul == 1)
    {
        var pixels = bitmap.buffer.data;
        var line = 0;
        for (var hh = height_org; hh > 0; hh--, line += pitch)
        {
            var end = line + width;
            for (var xx = width_org; xx > 0; xx--)
            {
                var pixel = pixels[line+xx-1];

                pixels[end-3] = pixel;
                pixels[end-2] = pixel;
                pixels[end-1] = pixel;
                end -= 3;
            }
        }
    }
    if (vmul == 1)
    {
        var pixels = bitmap.buffer.data;
        var read = (height - height_org) * pitch;
        var write = 0;
        var ii = 0;
        for (var hh = height_org; hh > 0; hh--)
        {
            for (ii=0;ii<pitch;ii++)
                pixels[write+ii] = pixels[read+ii];

            write += pitch;

            for (ii=0;ii<pitch;ii++)
                pixels[write+ii] = pixels[read+ii];

            write += pitch;

            for (ii=0;ii<pitch;ii++)
                pixels[write+ii] = pixels[read+ii];

            write += pitch;
            read  += pitch;
        }
    }
    //#endif /* !FT_CONFIG_OPTION_SUBPIXEL_RENDERING */

    FT_Outline_Translate(outline, x_shift, y_shift);

    if (x_left > 0x7FFFFFFF || y_top > 0x7FFFFFFF)
        return FT_Common.FT_Err_Invalid_Pixel_Size;

    if (error == 0)
    {
        slot.format      = FT_Common.FT_GLYPH_FORMAT_BITMAP;
        slot.bitmap_left = x_left;
        slot.bitmap_top  = y_top;
    }

    if ( outline && origin )
        FT_Outline_Translate(outline, -origin.x, -origin.y);

    return error;
}