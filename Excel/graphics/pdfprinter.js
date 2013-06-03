function _rect()
{
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
}

//TODO:  Такой код уже есть. Убрать переопределение кода.
function CMatrix()
{
    this.sx     = 1.0;
    this.shx    = 0.0;
    this.shy    = 0.0;
    this.sy     = 1.0;
    this.tx     = 0.0;
    this.ty     = 0.0;

    this.Reset = function(){
        this.sx     = 1.0;
        this.shx    = 0.0;
        this.shy    = 0.0;
        this.sy     = 1.0;
        this.tx     = 0.0;
        this.ty     = 0.0;
    }

    this.Multiply = function(matrix,order){
        if (MATRIX_ORDER_PREPEND == order)
        {
            var m = new CMatrix();
            m.sx     = matrix.sx;
            m.shx    = matrix.shx;
            m.shy    = matrix.shy;
            m.sy     = matrix.sy;
            m.tx     = matrix.tx;
            m.ty     = matrix.ty;
            m.Multiply(this,MATRIX_ORDER_APPEND);
            this.sx     = m.sx;
            this.shx    = m.shx;
            this.shy    = m.shy;
            this.sy     = m.sy;
            this.tx     = m.tx;
            this.ty     = m.ty;
        }
        else
        {
            var t0 = this.sx  * matrix.sx + this.shy * matrix.shx;
            var t2 = this.shx * matrix.sx + this.sy  * matrix.shx;
            var t4 = this.tx  * matrix.sx + this.ty  * matrix.shx + matrix.tx;
            this.shy = this.sx * matrix.shy + this.shy * matrix.sy;
            this.sy  = this.shx * matrix.shy + this.sy * matrix.sy;
            this.ty  = this.tx  * matrix.shy + this.ty * matrix.sy + matrix.ty;
            this.sx  = t0;
            this.shx = t2;
            this.tx  = t4;
        }
    }

    this.Translate = function(x,y,order){
        var m = new CMatrix();
        m.tx  = x;
        m.ty  = y;
        this.Multiply(m,order);
    }
    this.Scale = function(x,y,order){
        var m = new CMatrix();
        m.sx  = x;
        m.sy  = y;
        this.Multiply(m,order);
    }
    this.Rotate = function(a,order){
        var m = new CMatrix();
        var rad = deg2rad(a);
        m.sx  = Math.cos(rad);
        m.shx = Math.sin(rad);
        m.shy = -Math.sin(rad);
        m.sy  = Math.cos(rad);
        this.Multiply(m,order);
    }
    this.RotateAt = function(a,x,y,order){
        this.Translate(-x,-y,order);
        this.Rotate(a,order);
        this.Translate(x,y,order);
    }
    // determinant
    this.Determinant = function(){
        return this.sx * this.sy - this.shy * this.shx;
    }
    // invert
    this.Invert = function(){
        var det = this.Determinant();
        if (0.0001 > Math.abs(det))
            return;
        var d = 1 / det;

        var t0 = this.sy * d;
        this.sy =  this.sx * d;
        this.shy = -this.shy * d;
        this.shx = -this.shx * d;

        var t4 = -this.tx * t0  - this.ty * this.shx;
        this.ty = -this.tx * this.shy - this.ty * this.sy;

        this.sx = t0;
        this.tx = t4;
    }
    // transform point
    this.TransformPointX = function(x,y){
        return x * this.sx  + y * this.shx + this.tx;
    }
    this.TransformPointY = function(x,y){
        return x * this.shy + y * this.sy  + this.ty;
    }
    // calculate rotate angle
    this.GetRotation = function(){
        var x1 = 0.0;
        var y1 = 0.0;
        var x2 = 1.0;
        var y2 = 0.0;
        this.TransformPoint(x1, y1);
        this.TransformPoint(x2, y2);
        var a = Math.atan2(y2-y1,x2-x1);
        return rad2deg(a);
    }

    this.CreateDublicate = function(){
        var m = new CMatrix();
        m.sx     = this.sx;
        m.shx    = this.shx;
        m.shy    = this.shy;
        m.sy     = this.sy;
        m.tx     = this.tx;
        m.ty     = this.ty;
        return m;
    }
}

//TODO:  Такой код уже есть. Убрать переопределение кода.
function Common_CopyObj(Obj)
{
    if( !Obj || !('object' == typeof(Obj) || 'array' == typeof(Obj)) )
    {
        return Obj;
    }

    var c = 'function' === typeof Obj.pop ? [] : {};
    var p, v;
    for(p in Obj)
    {
        if(Obj.hasOwnProperty(p))
        {
            v = Obj[p];
            if(v && 'object' === typeof v )
            {
                c[p] = Common_CopyObj(v);
            }
            else
            {
                c[p] = v;
            }
        }
    }
    return c;
};

var vector_koef = 25.4 / 72;

function CClipManager()
{
    this.clipRects = [];
    this.curRect = new _rect();
    this.BaseObject = null;

    this.AddRect = function(x, y, w, h)
    {
        var _count = this.clipRects.length;
        if (0 == _count)
        {
            this.curRect.x = x;
            this.curRect.y = y;
            this.curRect.w = w;
            this.curRect.h = h;

            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;
            this.clipRects[_count] = _r;

            this.BaseObject.SetClip(this.curRect);
        }
        else
        {
            this.BaseObject.RemoveClip();
            var _r = new _rect();
            _r.x = x;
            _r.y = y;
            _r.w = w;
            _r.h = h;

            this.clipRects[_count] = _r;
            this.curRect = this.IntersectRect(this.curRect, _r);
            this.BaseObject.SetClip(this.curRect);
        }
    }
    this.RemoveRect = function()
    {
        var _count = this.clipRects.length;
        if (0 != _count)
        {
            this.clipRects.splice(_count - 1, 1);
            --_count;

            this.BaseObject.RemoveClip();

            if (0 != _count)
            {
                this.curRect.x = this.clipRects[0].x;
                this.curRect.y = this.clipRects[0].y;
                this.curRect.w = this.clipRects[0].w;
                this.curRect.h = this.clipRects[0].h;

                for (var i = 1; i < _count; i++)
                    this.curRect = this.IntersectRect(this.curRect, this.clipRects[i]);

                this.BaseObject.SetClip(this.curRect);
            }
        }
    }

    this.IntersectRect = function(r1, r2)
    {
        var res = new _rect();
        res.x = Math.max(r1.x, r2.x);
        res.y = Math.max(r1.y, r2.y);
        res.w = Math.min(r1.x + r1.w, r2.x + r2.w) - res.x;
        res.h = Math.min(r1.y + r1.h, r2.y + r2.h) - res.y;

        if (0 > res.w)
            res.w = 0;
        if (0 > res.h)
            res.h = 0;

        return res;
    }
}

//TODO:  Такой код уже есть. Убрать переопределение кода.
function CPen()
{
    this.Color      = { R : 255, G : 255, B : 255, A : 255 };
    this.Style      = 0;
    this.LineCap    = 0;
    this.LineJoin   = 0;
}
//TODO:  Такой код уже есть. Убрать переопределение кода.
function CBrush()
{
    this.Color1     = { R : 255, G : 255, B : 255, A : 255 };
    this.Color2     = { R : 255, G : 255, B : 255, A : 255 };
    this.Type       = 0;
}

function CPdfPrinter(sUrlPath)
{
    this.DocumentRenderer = new CDocumentRenderer();
    this.font = new window["Asc"].FontProperties("Arial", 11);
	this.asc_round = window["Asc"].round;
    this.Transform = new CMatrix();
    this.InvertTransform = new CMatrix();

	this.sUrlPath = sUrlPath;
				
    var ppiTest =
        $('<div style="position: absolute; width: 10in; height:10in; ' +
            'visibility:hidden; padding:0;"/>')
            .appendTo("body");
    this.dpiX = this.asc_round(ppiTest[0].offsetWidth * 0.1);
    this.dpiY = this.asc_round(ppiTest[0].offsetHeight * 0.1);
    ppiTest.remove();

    this.BeginPage = function(width,height)
    {
        this.DocumentRenderer.BeginPage(width,height);
    }
    this.EndPage = function()
    {
        this.DocumentRenderer.EndPage();
    }

    this.getWidth = function(units)
    {
        console.log("error");
        return 0;
    }
    this.getHeight = function(units)
    {
        console.log("error");
        return 0;
    }

    this.getCanvas = function()
    {
        console.log("error");
        return null;
    }
    this.getPPIX = function()
    {
        return 72.0;
    }
    this.getPPIY = function()
    {
        return 72.0;
    }

    this.getUnits = function()
    {
        return 3;
    }

    this.changeUnits = function()
    {
        return this;
    }

    this.getZoom = function()
    {
        console.log("error");
        return 1;
    }
    this.changeZoom = function()
    {
        console.log("error");
        return this;
    }

    this.resetSize = function()
    {
        console.log("error");
        return this;
    }

    this.expand = function(width, heigth)
    {
        console.log("error");
        return this;
    }

    this.clear = function()
    {
        console.log("error");
        return this;
    }

    this.save = function()
    {
        console.log("error");
        return this;
    }
    this.restore = function()
    {
        console.log("error");
        return this;
    }

    this.scale = function()
    {
        console.log("error");
        return this;
    }
    this.translate = function()
    {
        console.log("error");
        return this;
    }
    this.transform = function()
    {
        console.log("error");
        return this;
    }

    this.setTransform = function(sx, shy, shx, sy, tx, ty)
    {
        this.Transform.sx = sx;
        this.Transform.shy = shy;
        this.Transform.shx = shx;
        this.Transform.sy = sy;
        this.Transform.tx = tx;
        this.Transform.ty = ty;

        this.InvertTransform = this.Transform.CreateDublicate();
        this.InvertTransform.Invert();

        this.DocumentRenderer.transform(sx, shy, shx, sy, tx, ty);
        return this;
    }

    this.getFillStyle = function()
    {
        return "#000000";
    }
    this.getStrokeStyle = function()
    {
        return "#000000";
    }
    this.getLineWidth = function()
    {
        return 1;
    }

    this.getLineCap = function()
    {
        return "butt";
    }

    this.getLineJoin = function()
    {
        return "miter";
    }

    this.setFillStyle = function(val)
    {
        var c = this.parseColor(val);
        this.DocumentRenderer.b_color1(c.r, c.g, c.b, (c.a * 255 + 0.5) >> 0);
        return this;
    }
    this.setFillPattern = function(val)
    {
        return this;
    }
    this.setStrokeStyle = function(val)
    {
        var c = this.parseColor(val);
        this.DocumentRenderer.p_color(c.r, c.g, c.b, (c.a * 255 + 0.5) >> 0);
        return this;
    }
    this.setLineWidth = function(val)
    {
        this.DocumentRenderer.p_width(val * 1000 * vector_koef);
        return this;
    }
    this.setLineCap = function(cap)
    {
        return this;
    }
    this.setLineJoin = function(join)
    {
        return this;
    }

    this.fillRect = function(x, y, w, h)
    {
        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        this.DocumentRenderer.df();
        return this;
    }

    this.strokeRect = function(x, y, w, h)
    {
        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        this.DocumentRenderer.ds();
        return this;
    }

    this.clearRect = function(x, y, w, h)
    {
        return this;
    }

    this.getFont = function()
    {
        return this.font.clone();
    }
    this.getFontFamily = function()
    {
        return this.font.FontFamily.Name;
    }
    this.getFontSize = function()
    {
        return this.font.FontSize;
    }

    this.getFontMetrix = function()
    {
        console.log("error");
        return new FontMetrics(0, 0, 0);
    }
    this.setFont = function(font)
    {
        this.DocumentRenderer.SetFont(font);
        return this;
    }

    this.measureChar = function(text, units)
    {
        console.log("error");
        return null;
    }
    this.measureText = function(text, units)
    {
        console.log("error");
        return null;
    }

    this.fillText = function(text, x, y, maxWidth, charWidths)
    {
        //this.DocumentRenderer.FillText(x * vector_koef, y * vector_koef, text);
        var _len = text.length;
        if (charWidths.length != _len)
            this.DocumentRenderer.FillText(x * vector_koef, y * vector_koef, text);
        else
        {
            var offset = 0;
            for (var i = 0; i < _len; ++i)
            {
                this.DocumentRenderer.FillText((x + offset) * vector_koef, y * vector_koef, "" + text[i]);
                offset += charWidths[i];
            }
        }
        return this;
    }

    this.beginPath = function()
    {
        this.DocumentRenderer._s();
        return this;
    }
    this.closePath = function()
    {
        this.DocumentRenderer._z();
        return this;
    }

    this.moveTo = function(x, y, dx, dy)
    {
        if (0 == dx && 0 == dy)
            this.DocumentRenderer._m(x * vector_koef, y * vector_koef);
        else
        {
            var _x = this.Transform.TransformPointX(x, y);
            var _y = this.Transform.TransformPointY(x, y);

            _x += (72 * dx / this.dpiX);
            _y += (72 * dy / this.dpiY);

            var xSrc = this.InvertTransform.TransformPointX(_x, _y);
            var ySrc = this.InvertTransform.TransformPointY(_x, _y);

            this.DocumentRenderer._m(xSrc * vector_koef, ySrc * vector_koef);
        }
        return this;
    }
    this.lineTo = function(x, y, dx, dy)
    {
        if (0 == dx && 0 == dy)
            this.DocumentRenderer._l(x * vector_koef, y * vector_koef);
        else
        {
            var _x = this.Transform.TransformPointX(x, y);
            var _y = this.Transform.TransformPointY(x, y);

            _x += (72 * dx / this.dpiX);
            _y += (72 * dy / this.dpiY);

            var xSrc = this.InvertTransform.TransformPointX(_x, _y);
            var ySrc = this.InvertTransform.TransformPointY(_x, _y);

            this.DocumentRenderer._l(xSrc * vector_koef, ySrc * vector_koef);
        }
        return this;
    }
    this.rect = function(x, y, w, h)
    {
        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        return this;
    }

    this.arc = function(x, y, radius, startAngle, endAngle, antiClockwise)
    {
        // TODO:
        return this;
    }
    this.bezierCurveTo = function(x1, y1, x2, y2, x3, y3)
    {
        this.DocumentRenderer._c(x1 * vector_koef, y1 * vector_koef, x2 * vector_koef, y2 * vector_koef, x3 * vector_koef, y3 * vector_koef);
        return this;
    }

    this.fill = function()
    {
        this.DocumentRenderer.df();
        return this;
    }
    this.stroke = function()
    {
        this.DocumentRenderer.ds();
        return this;
    }

    this.clip = function()
    {
        return this;
    }
    this.drawImage = function(_src, sx, sy, sw, sh, dx, dy, dw, dh, src_w, src_h)
    {
		if(0 == _src.indexOf(this.sUrlPath))
			_src = _src.substring(this.sUrlPath.length);
        if (0 == sx && 0 == sy && sw == src_w && sh == src_h)
        {
            this.DocumentRenderer.Memory.WriteByte(CommandType.ctDrawImageFromFile);
            this.DocumentRenderer.Memory.WriteString2(_src);
            this.DocumentRenderer.Memory.WriteDouble(dx * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dy * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dw * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dh * vector_koef);
        }
        else
        {
            this.AddClipRect(dx, dy, dw, dh);

            var dKoefX = dw / sw;
            var dKoefY = dh / sh;

            var dstX = dx - dKoefX * sx;
            var dstY = dy - dKoefY * sy;
            var dstW = dKoefX * src_w;
            var dstH = dKoefY * src_h;

            this.DocumentRenderer.Memory.WriteByte(CommandType.ctDrawImageFromFile);
            this.DocumentRenderer.Memory.WriteString2(_src);
            this.DocumentRenderer.Memory.WriteDouble(dstX * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dstY * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dstW * vector_koef);
            this.DocumentRenderer.Memory.WriteDouble(dstH * vector_koef);

            this.RemoveClipRect();
        }
        return this;
    }

    this.AddClipRect = function(x, y, w, h)
    {
        this.DocumentRenderer.SaveGrState();
        this.DocumentRenderer.AddClipRect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
    }
    this.RemoveClipRect = function()
    {
        //this.DocumentRenderer.RemoveClipRect();
        this.DocumentRenderer.RestoreGrState();
    }

    this.SetClip = function(r)
    {
        this.DocumentRenderer.SetClip(r);
    }
    this.RemoveClip = function()
    {
        this.DocumentRenderer.RemoveClip();
    }

    this.parseColor = window["Asc"].parseColor;
}