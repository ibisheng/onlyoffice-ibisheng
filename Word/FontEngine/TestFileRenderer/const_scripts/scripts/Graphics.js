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
            this.SetClip(this.curRect);
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

function CColor()
{
    this.R = 255;
    this.G = 255;
    this.B = 255;
    this.A = 255;
}
function CPen()
{
    this.Color      = new CColor();
    this.Style      = 0;
    this.LineCap    = 0;
    this.LineJoin   = 0;
}
function CBrush()
{
    this.Color1     = new CColor();
    this.Color2     = new CColor();
    this.Type       = 0;
}

var MATRIX_ORDER_PREPEND    = 0;
var MATRIX_ORDER_APPEND     = 1;

var memoryCanvasText 	= null;
var memoryCanvasContext = null;
var memoryImageDataText	= null;
var memoryCanvasW 		= 200;
var memoryCanvasH 		= 200;

var bIsChrome = (null == window.chrome) ? 0 : 1;
var bIsSafari = (null == window.safari) ? 0 : 1;

function deg2rad(deg){
    return deg * Math.PI / 180.0;
}
function rad2deg(rad){
    return rad * 180.0 / Math.PI;
}

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
    // ?????????
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
    // ? ?????? ??????? ?????? ?????????? (??? ???????? ???????????)
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
        if (0.0001 > det)
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
    // ??????? ?????????
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

function CGraphics(){
    this.m_pPixels      = null;                 // ???????, ???? ?????? ??? ??????
    this.m_oContext     = null;                 // ???????? ?????????? (?????)
    this.m_dWidthMM     = 0;
    this.m_dHeightMM    = 0;
    this.m_lWidthPix    = 0;
    this.m_lHeightPix   = 0;
    this.m_dDpiX        = 96.0;
    this.m_dDpiY        = 96.0;
    this.m_bIsBreak 	= false;

    this.textBB_l       = 10000;
    this.textBB_t       = 10000;
    this.textBB_r       = -10000;
    this.textBB_b       = -10000;

    this.m_oPen     = new CPen();
    this.m_oBrush   = new CBrush();

    this.m_oFontManager = null;             // ?????? ?? ???????? ???????.
    this.m_bIsFillTextCanvasColor = 0;

    this.m_oCoordTransform  = new CMatrix();
    this.m_oTransform       = new CMatrix();
    this.m_oFullTransform   = new CMatrix();
    this.m_oInvertFullTransform = new CMatrix();

    this.m_oCurFont = null;

    this.m_bIntegerGrid = true;

    this.ClipManager = new CClipManager();
    this.ClipManager.BaseObject = this;

    // init function
    this.init = function(context,width_px,height_px,width_mm,height_mm)
    {
        this.m_oContext     = context;
        this.m_lHeightPix   = height_px;
        this.m_lWidthPix    = width_px;
        this.m_dWidthMM     = width_mm;
        this.m_dHeightMM    = height_mm;
        this.m_dDpiX        = 25.4 * this.m_lWidthPix / this.m_dWidthMM;
        this.m_dDpiY        = 25.4 * this.m_lHeightPix / this.m_dHeightMM;

        this.m_oCoordTransform.sx   = this.m_dDpiX / 25.4;
        this.m_oCoordTransform.sy   = this.m_dDpiY / 25.4;

        if (true == this.m_oContext.mozImageSmoothingEnabled)
            this.m_oContext.mozImageSmoothingEnabled = false;
    }
    this.EndDraw = function(){
    }
    this.put_GlobalAlpha = function(enable, alpha)
    {
        if (false === enable)
            this.m_oContext.globalAlpha = 1;
        else
        {
            this.m_oContext.globalAlpha = alpha;
        }
    }
    // pen methods
    this.p_color = function(r,g,b,a){
        this.m_oPen.Color.R = r;
        this.m_oPen.Color.G = g;
        this.m_oPen.Color.B = b;
        this.m_oPen.Color.A = a;

        // ????????? ????? ?????
        this.m_oContext.strokeStyle = "rgba(" + this.m_oPen.Color.R + "," + this.m_oPen.Color.G + "," +
            this.m_oPen.Color.B + "," + (this.m_oPen.Color.A / 255) + ")";
    }
    this.p_width = function(w){
        this.m_oContext.lineWidth = w / 1000;
    }
    // brush methods
    this.b_color1 = function(r,g,b,a){
        this.m_oBrush.Color1.R = r;
        this.m_oBrush.Color1.G = g;
        this.m_oBrush.Color1.B = b;
        this.m_oBrush.Color1.A = a;

        // ????????? ????? ?????
        this.m_oContext.fillStyle = "rgba(" + this.m_oBrush.Color1.R + "," + this.m_oBrush.Color1.G + "," +
            this.m_oBrush.Color1.B + "," + (this.m_oBrush.Color1.A / 255) + ")";

        this.m_bIsFillTextCanvasColor = 0;
    }
    this.b_color2 = function(r,g,b,a){
        this.m_oBrush.Color2.R = r;
        this.m_oBrush.Color2.G = g;
        this.m_oBrush.Color2.B = b;
        this.m_oBrush.Color2.A = a;

        // ????????? ????? ?????
    }
    // ?????? ?????????????
    this.transform = function(sx,shy,shx,sy,tx,ty){
        this.m_oTransform.sx    = sx;
        this.m_oTransform.shx   = shx;
        this.m_oTransform.shy   = shy;
        this.m_oTransform.sy    = sy;
        this.m_oTransform.tx    = tx;
        this.m_oTransform.ty    = ty;

        // ?????? ????????? ????????? ?????
        this.CalculateFullTransform();
        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }

        this.m_oFontManager.SetTextMatrix(this.m_oTransform.sx,this.m_oTransform.shy,this.m_oTransform.shx,
            this.m_oTransform.sy,this.m_oTransform.tx,this.m_oTransform.ty);
    }
    this.CalculateFullTransform = function(){
        this.m_oFullTransform	= this.m_oCoordTransform.CreateDublicate();
        this.m_oFullTransform.Multiply(this.m_oTransform, MATRIX_ORDER_PREPEND);

        this.m_oInvertFullTransform.sx = this.m_oTransform.sx;
        this.m_oInvertFullTransform.shx = this.m_oTransform.shx;
        this.m_oInvertFullTransform.shy = this.m_oTransform.shy;
        this.m_oInvertFullTransform.sy = this.m_oTransform.sy;
        this.m_oInvertFullTransform.tx = this.m_oTransform.tx;
        this.m_oInvertFullTransform.ty = this.m_oTransform.ty;
        this.m_oInvertFullTransform.Invert();
        this.m_oInvertFullTransform.Multiply(this.m_oFullTransform,MATRIX_ORDER_PREPEND);
    }
    // path commands
    this._s = function(){
        this.m_oContext.beginPath();
    }
    this._z = function(){
        this.m_oContext.closePath();
    }
    this._m = function(x,y){
        if (false === this.m_bIntegerGrid)
            this.m_oContext.moveTo(x/100,y/100);
        else
        {
            var _x = this.m_oFullTransform.TransformPointX(x/100,y/100);
            var _y = this.m_oFullTransform.TransformPointY(x/100,y/100);
            this.m_oContext.moveTo(_x,_y);
        }
    }
    this._l = function(x,y){
        if (false === this.m_bIntegerGrid)
            this.m_oContext.lineTo(x/100,y/100);
        else
        {
            var _x = this.m_oFullTransform.TransformPointX(x/100,y/100);
            var _y = this.m_oFullTransform.TransformPointY(x/100,y/100);
            this.m_oContext.lineTo(_x,_y);
        }
    }
    this._c = function(x1,y1,x2,y2,x3,y3){
        if (false === this.m_bIntegerGrid)
            this.m_oContext.bezierCurveTo(x1/100,y1/100,x2/100,y2/100,x3/100,y3/100);
        else
        {
            var _x1 = this.m_oFullTransform.TransformPointX(x1/100,y1/100);
            var _y1 = this.m_oFullTransform.TransformPointY(x1/100,y1/100);
            var _x2 = this.m_oFullTransform.TransformPointX(x2/100,y2/100);
            var _y2 = this.m_oFullTransform.TransformPointY(x2/100,y2/100);
            var _x3 = this.m_oFullTransform.TransformPointX(x3/100,y3/100);
            var _y3 = this.m_oFullTransform.TransformPointY(x3/100,y3/100);

            this.m_oContext.bezierCurveTo(_x1,_y1,_x2,_y2,_x3,_y3);
        }
    }
    this.ds = function(){
        this.m_oContext.stroke();
    }
    this.df = function(){
        this.m_oContext.fill();
    }

    // canvas state
    this.save = function(){
        this.m_oContext.save();
    }
    this.restore = function(){
        this.m_oContext.restore();
    }
    this.clip = function(){
        this.m_oContext.clip();
    }

    // images
    this.drawImage2 = function(img,x,y,w,h){
        if (false === this.m_bIntegerGrid)
            this.m_oContext.drawImage(img,x,y,w,h);
        else
        {
            var _x1 = parseInt(this.m_oFullTransform.TransformPointX(x,y));
            var _y1 = parseInt(this.m_oFullTransform.TransformPointY(x,y));
            var _x2 = parseInt(this.m_oFullTransform.TransformPointX(x+w,y+h));
            var _y2 = parseInt(this.m_oFullTransform.TransformPointY(x+w,y+h));
            this.m_oContext.drawImage(img,_x1,_y1,_x2-_x1,_y2-_y1);
        }
    }
    this.drawImage = function(img,x,y,w,h){

        this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
            this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);

        this.m_oContext.drawImage(img,x,y,w,h);

        this.m_oContext.setTransform(1,0,0,1,0,0);

        return;

        var _img = editor.ImageLoader.map_image_index[img];
        if (_img != undefined && _img.Image != null)
        {
            this.drawImage2(_img.Image,x,y,w,h);
        }
        else
        {
            var _x = x;
            var _y = y;
            var _r = x+w;
            var _b = y+h;
            if (this.m_bIntegerGrid)
            {
                _x = this.m_oFullTransform.TransformPointX(x,y);
                _y = this.m_oFullTransform.TransformPointY(x,y);
                _r = this.m_oFullTransform.TransformPointX(x+w,y+h);
                _b = this.m_oFullTransform.TransformPointY(x+w,y+h);
            }

            var ctx = this.m_oContext;
            var old_p = ctx.lineWidth;

            ctx.beginPath();
            ctx.moveTo(_x,_y);
            ctx.lineTo(_r,_b);
            ctx.moveTo(_r,_y);
            ctx.lineTo(_x,_b);
            ctx.strokeStyle = "#FF0000";
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(_x,_y);
            ctx.lineTo(_r,_y);
            ctx.lineTo(_r,_b);
            ctx.lineTo(_x,_b);
            ctx.closePath();

            ctx.lineWidth = 1;
            ctx.strokeStyle = "#000000";
            ctx.stroke();
            ctx.beginPath();

            ctx.lineWidth = old_p;
            ctx.strokeStyle = "rgba(" + this.m_oPen.Color.R + "," + this.m_oPen.Color.G + "," +
                this.m_oPen.Color.B + "," + (this.m_oPen.Color.A / 255) + ")";
        }
    }

    // text
    this.font = function(font_id,font_size){

        g_font_infos[g_map_font_index[font_id]].LoadFont(null, this.m_oFontManager, font_size, 0, this.m_dDpiX, this.m_dDpiY);
    }
    this.GetFont = function()
    {
        return this.m_oCurFont;
    }
    this.SetFont = function(font)
    {
        this.m_oCurFont = Common_CopyObj(font);

        if (-1 == font.FontFamily.Index)
            font.FontFamily.Index = g_map_font_index[font.FontFamily.Name];

        if (font.FontFamily.Index == undefined || font.FontFamily.Index == -1)
            return;

        var bItalic = true === font.Italic;
        var bBold   = true === font.Bold;

        var oFontStyle = FontStyle.FontStyleRegular;
        if ( !bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBold;
        else if ( bItalic && !bBold )
            oFontStyle = FontStyle.FontStyleItalic;
        else if ( bItalic && bBold )
            oFontStyle = FontStyle.FontStyleBoldItalic;

        g_font_infos[font.FontFamily.Index].LoadFont(g_font_loader, this.m_oFontManager, font.FontSize, oFontStyle, this.m_dDpiX, this.m_dDpiY);
    }
    this.FillText = function(x,y,text)
    {
        // убыстеренный вариант. здесь везде заточка на то, что приходит одна буква
        if (this.m_bIsBreak)
            return;

        var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x,y);

        try
        {
            this.m_oFontManager.LoadString2C(text,_x,_y);
        }
        catch(err)
        {
        }

        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(1,0,0,1,0,0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph)
            return;

        if (null != pGlyph.oBitmap)
        {
            this.private_FillGlyph(pGlyph);
        }
        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.t = function(text,x,y){
        // убыстеренный вариант. здесь везде заточка на то, что приходит одна буква
        if (this.m_bIsBreak)
            return;
			
		x /= 100;
        y /= 100;

        var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x,y);

        try
        {
            this.m_oFontManager.LoadString2C(text,_x,_y);
        }
        catch(err)
        {
        }

        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(1,0,0,1,0,0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph)
            return;

        if (null != pGlyph.oBitmap)
        {
            this.private_FillGlyph(pGlyph);
        }
        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.tg = function(text,x,y){
        // убыстеренный вариант. здесь везде заточка на то, что приходит одна буква
        if (this.m_bIsBreak)
            return;

        x /= 100;
        y /= 100;

        var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x,y);

        //try
        {
            this.m_oFontManager.LoadString3C(text,_x,_y);
        }
        //catch(err)
        {
        }

        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(1,0,0,1,0,0);
        }
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph)
            return;

        if (null != pGlyph.oBitmap)
        {
            this.private_FillGlyph(pGlyph);
        }
        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.FillText2 = function(x,y,text,cropX,cropW)
    {
        // убыстеренный вариант. здесь везде заточка на то, что приходит одна буква
        if (this.m_bIsBreak)
            return;

        var _x = this.m_oInvertFullTransform.TransformPointX(x,y);
        var _y = this.m_oInvertFullTransform.TransformPointY(x,y);

        try
        {
            this.m_oFontManager.LoadString2C(text,_x,_y);
        }
        catch(err)
        {
        }

        this.m_oContext.setTransform(1,0,0,1,0,0);
        var pGlyph = this.m_oFontManager.m_oGlyphString.m_pGlyphsBuffer[0];
        if (null == pGlyph)
            return;

        if (null != pGlyph.oBitmap)
        {
            this.private_FillGlyphC(pGlyph,cropX,cropW);
        }
        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.t2 = function(text,x,y,cropX,cropW){
        if (this.m_bIsBreak)
            return;

        var _x = this.m_oInvertFullTransform.TransformPointX(x/100,y/100);
        var _y = this.m_oInvertFullTransform.TransformPointY(x/100,y/100);

        try
        {
            this.m_oFontManager.LoadString2(text,_x,_y);
        }
        catch(err)
        {
        }

        this.m_oContext.setTransform(1,0,0,1,0,0);
        while (true)
        {
            var pGlyph = this.m_oFontManager.GetNextChar2();
            if (null == pGlyph)
                break;

            if (null != pGlyph.oBitmap)
            {
                this.private_FillGlyphC(pGlyph,cropX,cropW);
            }
        }

        if (false === this.m_bIntegerGrid)
        {
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.charspace = function(space){
    }

    // private methods
    this.private_FillGlyph = function(pGlyph){

        // new scheme
        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;

        if (0 == nW || 0 == nH)
            return;

        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

        pGlyph.oBitmap.oGlyphData.checkColor(this.m_oBrush.Color1.R,this.m_oBrush.Color1.G,this.m_oBrush.Color1.B,nW,nH);
        this.m_oContext.drawImage(pGlyph.oBitmap.oGlyphData.m_oCanvas,0,0,nW,nH,nX,nY,nW,nH);
    }
    this.private_FillGlyphC = function(pGlyph,cropX,cropW){

        // new scheme
        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;

        if (0 == nW || 0 == nH)
            return;

        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

        var d_koef = this.m_dDpiX / 25.4;

        var cX = Math.max(parseInt(cropX * d_koef), 0);
        var cW = Math.min(parseInt(cropW * d_koef), nW);
        if (cW <= 0)
            cW = 1;

        pGlyph.oBitmap.oGlyphData.checkColor(this.m_oBrush.Color1.R,this.m_oBrush.Color1.G,this.m_oBrush.Color1.B,nW,nH);
        this.m_oContext.drawImage(pGlyph.oBitmap.oGlyphData.m_oCanvas,cX,0,cW,nH,nX,nY,cW,nH);
    }

    this.private_FillGlyph1 = function(pGlyph){
        var i = 0;
        var j = 0;

        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;

        if (0 == nW || 0 == nH)
            return;

        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

        var pPixels = memoryImageDataText.data;

        if (0 == this.m_bIsFillTextCanvasColor)
        {
            var r = this.m_oBrush.Color1.R;
            var g = this.m_oBrush.Color1.G;
            var b = this.m_oBrush.Color1.B;

            var ind = 0;
            var count = memoryCanvasW * memoryCanvasH;
            for (var i = 0; i < count; ++i)
            {
                pPixels[ind] 	 = r;
                pPixels[ind + 1] = g;
                pPixels[ind + 2] = b;
                ind += 4;
            }
            this.m_bIsFillTextCanvasColor = 1;
        }

        var indexG = 0;
        var pDataSrc = pGlyph.oBitmap.pData;
        for (j = 0; j < nH; j++)
        {
            var indx = 4 * j * memoryCanvasW + 3;
            for (i = 0; i < nW; i++)
            {
                pPixels[indx] = pDataSrc[indexG];
                indexG++;
                indx += 4;
            }
        }
        // ?????? ?????? ???????? ??????? ?? ????????? ?????
        memoryCanvasContext.putImageData(memoryImageDataText,0,0,0,0,nW,nH);
        this.m_oContext.drawImage(memoryCanvasText,0,0,nW,nH,nX,nY,nW,nH);
    }
    this.private_FillGlyph2 = function(pGlyph){
        var i = 0;
        var j = 0;

        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;

        if (0 == nW || 0 == nH)
            return;

        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

        var imageData = this.m_oContext.getImageData(nX,nY,nW,nH);
        var pPixels = imageData.data;

        var _r = this.m_oBrush.Color1.R;
        var _g = this.m_oBrush.Color1.G;
        var _b = this.m_oBrush.Color1.B;

        for (; j < nH; ++j)
        {
            var indx = 4 * j * nW;
            for (i = 0; i < nW; ++i)
            {
                var weight  = pGlyph.oBitmap.pData[j * pGlyph.oBitmap.nWidth + i];

                if (255 == weight)
                {
                    pPixels[indx]     = _r;
                    pPixels[indx + 1] = _g;
                    pPixels[indx + 2] = _b;
                    pPixels[indx + 3] = 255;
                }
                else
                {
                    var r = pPixels[indx];
                    var g = pPixels[indx + 1];
                    var b = pPixels[indx + 2];
                    var a = pPixels[indx + 3];

                    pPixels[indx]     = ((_r - r) * weight + (r << 8)) >>> 8;
                    pPixels[indx + 1] = ((_g - g) * weight + (g << 8)) >>> 8;
                    pPixels[indx + 2] = ((_b - b) * weight + (b << 8)) >>> 8;
                    pPixels[indx + 3] = (weight + a) - ((weight * a + 256) >>> 8);
                }

                indx += 4;
            }
        }
        this.m_oContext.putImageData(imageData,nX,nY);
    }
    this.private_FillGlyph3 = function(pGlyph){
        var i = 0;
        var j = 0;

        var nW = pGlyph.oBitmap.nWidth;
        var nH = pGlyph.oBitmap.nHeight;

        if (0 == nW || 0 == nH)
            return;

        if (null == memoryAllCanvasImageData)
        {
            memoryAllCanvasImageData = memoryAllCanvasContext.createImageData(this.m_lWidthPix,this.m_lHeightPix);
            pPixelsImageData = memoryAllCanvasImageData.data;
            this.m_bIsFillTextCanvasColor = 1;
        }

        var nX = parseInt(this.m_oFontManager.m_oGlyphString.m_fX + pGlyph.fX + pGlyph.oBitmap.nX);
        var nY = parseInt(this.m_oFontManager.m_oGlyphString.m_fY + pGlyph.fY - pGlyph.oBitmap.nY);

        if (this.textBB_l > nX)
        {
            this.textBB_l = nX;
        }
        if (this.textBB_t > nY)
        {
            this.textBB_t = nY;
        }
        if (this.textBB_r < (nX + nW - 1))
        {
            this.textBB_r = nX + nW - 1;
        }
        if (this.textBB_b < (nY + nH - 1))
        {
            this.textBB_b = nY + nH - 1;
        }

        var indexG = 0;
        var pDataSrc = pGlyph.oBitmap.pData;
        for (; j < nH; ++j)
        {
            var indx = 4 * ((j + nY) * this.m_lWidthPix + nX) + 3;
            for (i = 0; i < nW; ++i)
            {
                pPixelsImageData[indx] += pDataSrc[indexG];
                if (pPixelsImageData[indx] > 255)
                    pPixelsImageData[indx] = 255;
                indexG++;
                indx += 4;
            }
        }
    }

    this.SetIntegerGrid = function(param)
    {
        if (true == param)
        {
            this.m_bIntegerGrid = true;
            this.m_oContext.setTransform(1,0,0,1,0,0);
        }
        else
        {
            return;
            this.m_bIntegerGrid = false;
            this.m_oContext.setTransform(this.m_oFullTransform.sx,this.m_oFullTransform.shy,this.m_oFullTransform.shx,
                this.m_oFullTransform.sy,this.m_oFullTransform.tx,this.m_oFullTransform.ty);
        }
    }
    this.GetIntegerGrid = function()
    {
        return this.m_bIntegerGrid;
    }

    this.DrawHeaderEdit = function(yPos)
    {
        var _y = this.m_oFullTransform.TransformPointY(0,yPos);
        _y = parseInt(_y) + 0.5;
        var _x = 0;
        var _w1 = 6;
        var _w2 = 3;
        var _wmax = this.m_lWidthPix;

        this.p_color(155, 187, 277, 255);
        var ctx = this.m_oContext;
        ctx.lineWidth = 2;
        if (true === this.m_bIntegerGrid)
        {
            this._s();
            while (true)
            {
                if (_x > _wmax)
                    break;
                ctx.moveTo(_x,_y);
                _x+=_w1;
                ctx.lineTo(_x,_y);
                _x+=_w2;
            }
            this.ds();
        }
        else
        {
            this.SetIntegerGrid(true);
            this._s();
            while (true)
            {
                if (_x > _wmax)
                    break;
                ctx.moveTo(_x,_y);
                _x+=_w1;
                ctx.lineTo(_x,_y);
                _x+=_w2;
            }
            this.ds();
            this.SetIntegerGrid(false);
        }
    }
    this.DrawFooterEdit = function(yPos)
    {
        var _y = this.m_oFullTransform.TransformPointY(0,yPos);
        _y = parseInt(_y) + 0.5;
        var _x = 0;
        var _w1 = 6;
        var _w2 = 3;
        var _wmax = this.m_lWidthPix;

        this.p_color(155, 187, 277, 255);
        var ctx = this.m_oContext;
        ctx.lineWidth = 2;
        if (true === this.m_bIntegerGrid)
        {
            this._s();
            while (true)
            {
                if (_x > _wmax)
                    break;
                ctx.moveTo(_x,_y);
                _x+=_w1;
                ctx.lineTo(_x,_y);
                _x+=_w2;
            }
            this.ds();
        }
        else
        {
            this.SetIntegerGrid(true);
            this._s();
            while (true)
            {
                if (_x > _wmax)
                    break;
                ctx.moveTo(_x,_y);
                _x+=_w1;
                ctx.lineTo(_x,_y);
                _x+=_w2;
            }
            this.ds();
            this.SetIntegerGrid(false);
        }
    }

    this.DrawEmptyTableLine = function(x1,y1,x2,y2)
    {
        var _x1 = this.m_oFullTransform.TransformPointX(x1,y1);
        var _y1 = this.m_oFullTransform.TransformPointY(x1,y1);

        var _x2 = this.m_oFullTransform.TransformPointX(x2,y2);
        var _y2 = this.m_oFullTransform.TransformPointY(x2,y2);

        _x1 = parseInt(_x1) + 0.5;
        _y1 = parseInt(_y1) + 0.5;
        _x2 = parseInt(_x2) + 0.5;
        _y2 = parseInt(_y2) + 0.5;

        this.p_width(1000 * 25.4 / this.m_dDpiX);
        this.p_color(155, 187, 277, 255);
        var ctx = this.m_oContext;
        var bIsInt = this.m_bIntegerGrid;
        if (!bIsInt)
            this.SetIntegerGrid(true);
        if (_x1 == _x2)
        {
            var _y = Math.min(_y1, _y2) + 0.5;
            var _w1 = 2;
            var _w2 = 2;
            var _wmax = Math.max(_y1, _y2) - 0.5;
            this._s();
            while (true)
            {
                if (_y > _wmax)
                    break;
                ctx.moveTo(_x1,_y);
                _y+=_w1;
                if (_y > _wmax)
                {
                    ctx.lineTo(_x1,_y - _w1 + 1);
                }
                else
                {
                    ctx.lineTo(_x1,_y);
                }
                _y+=_w2;
            }
            this.ds();
        }
        else if (_y1 == _y2)
        {
            var _x = Math.min(_x1, _x2) + 0.5;
            var _w1 = 2;
            var _w2 = 2;
            var _wmax = Math.max(_x1, _x2) - 0.5;
            this._s();
            while (true)
            {
                if (_x > _wmax)
                    break;
                ctx.moveTo(_x,_y1);
                _x+=_w1;

                if (_x > _wmax)
                {
                    ctx.lineTo(_x - _w2 + 1,_y1);
                }
                else
                {
                    ctx.lineTo(_x,_y1);
                }
                _x+=_w2;
            }
            this.ds();
        }
        if (!bIsInt)
            this.SetIntegerGrid(false);
    }

    // smart methods for horizontal / vertical lines
    this.drawHorLine = function(align, y, x, r, penW)
    {
        var pen_w = parseInt((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5);
        if (0 == pen_w)
            pen_w = 1;

        var _x = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5 - 0.5;
        var _r = parseInt(this.m_oFullTransform.TransformPointX(r,y)) + 0.5 + 0.5;

        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;

        switch (align)
        {
            case 0:
            {
                // top
                var _top = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_x, _top + pen_w / 2 - 0.5);
                ctx.lineTo(_r, _top + pen_w / 2 - 0.5);
                ctx.stroke();

                break;
            }
            case 1:
            {
                // center
                var _center = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                if (0 == (pen_w % 2))
                {
                    ctx.moveTo(_x, _center - 0.5);
                    ctx.lineTo(_r, _center - 0.5);
                }
                else
                {
                    ctx.moveTo(_x, _center);
                    ctx.lineTo(_r, _center);
                }
                ctx.stroke();

                break;
            }
            case 2:
            {
                // bottom
                var _bottom = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_x, _bottom - pen_w / 2 + 0.5);
                ctx.lineTo(_r, _bottom - pen_w / 2 + 0.5);
                ctx.stroke();

                break;
            }
        }
    }
    this.drawVerLine = function(align, x, y, b, penW)
    {
        var pen_w = parseInt((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5);
        if (0 == pen_w)
            pen_w = 1;

        var _y = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5 - 0.5;
        var _b = parseInt(this.m_oFullTransform.TransformPointY(x,b)) + 0.5 + 0.5;

        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;

        switch (align)
        {
            case 0:
            {
                // left
                var _left = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_left + pen_w / 2 - 0.5, _y);
                ctx.lineTo(_left + pen_w / 2 - 0.5, _b);
                ctx.stroke();

                break;
            }
            case 1:
            {
                // center
                var _center = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5;

                ctx.beginPath();
                if (0 == (pen_w % 2))
                {
                    ctx.moveTo(_center - 0.5, _y);
                    ctx.lineTo(_center - 0.5, _b);
                }
                else
                {
                    ctx.moveTo(_center, _y);
                    ctx.lineTo(_center, _b);
                }
                ctx.stroke();

                break;
            }
            case 2:
            {
                // right
                var _right = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_right - pen_w / 2 + 0.5, _y);
                ctx.lineTo(_right - pen_w / 2 + 0.5, _b);
                ctx.stroke();

                break;
            }
        }
    }

    // мега крутые функции для таблиц
    this.drawHorLineExt = function(align, y, x, r, penW, leftMW, rightMW)
    {
        var pen_w = Math.max(parseInt((this.m_dDpiX * penW / g_dKoef_in_to_mm) + 0.5), 1);

        var _x = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5;
        var _r = parseInt(this.m_oFullTransform.TransformPointX(r,y)) + 0.5;

        if (leftMW != 0)
        {
            var _center = _x;
            var pen_mw = Math.max(parseInt((this.m_dDpiX * Math.abs(leftMW) * 2 / g_dKoef_in_to_mm) + 0.5), 1);
            if (leftMW < 0)
            {
                if ((pen_mw % 2) == 0)
                {
                    _x = _center - (pen_mw / 2);
                }
                else
                {
                    _x = _center - parseInt(pen_mw / 2);
                }
            }
            else
            {
                if ((pen_mw % 2) == 0)
                {
                    _x = _center + (pen_mw / 2) - 1.0;
                }
                else
                {
                    _x = _center + parseInt(pen_mw / 2);
                }
            }
        }
        if (rightMW != 0)
        {
            var _center = _r;
            var pen_mw = Math.max(parseInt((this.m_dDpiX * Math.abs(rightMW) * 2 / g_dKoef_in_to_mm) + 0.5), 1);
            if (rightMW < 0)
            {
                if ((pen_mw % 2) == 0)
                {
                    _r = _center - (pen_mw / 2);
                }
                else
                {
                    _r = _center - parseInt(pen_mw / 2);
                }
            }
            else
            {
                if ((pen_mw % 2) == 0)
                {
                    _r = _center + (pen_mw / 2) - 1.0;
                }
                else
                {
                    _r = _center + parseInt(pen_mw / 2);
                }
            }
        }

        var ctx = this.m_oContext;
        ctx.lineWidth = pen_w;

        _x -= 0.5;
        _r += 0.5;

        switch (align)
        {
            case 0:
            {
                // top
                var _top = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_x, _top + pen_w / 2 - 0.5);
                ctx.lineTo(_r, _top + pen_w / 2 - 0.5);
                ctx.stroke();

                break;
            }
            case 1:
            {
                // center
                var _center = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                if (0 == (pen_w % 2))
                {
                    ctx.moveTo(_x, _center - 0.5);
                    ctx.lineTo(_r, _center - 0.5);
                }
                else
                {
                    ctx.moveTo(_x, _center);
                    ctx.lineTo(_r, _center);
                }
                ctx.stroke();

                break;
            }
            case 2:
            {
                // bottom
                var _bottom = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;

                ctx.beginPath();
                ctx.moveTo(_x, _bottom - pen_w / 2 + 0.5);
                ctx.lineTo(_r, _bottom - pen_w / 2 + 0.5);
                ctx.stroke();

                break;
            }
        }
    }

    this.rect = function(x,y,w,h)
    {
        var ctx = this.m_oContext;
        ctx.beginPath();

        var _x = parseInt(this.m_oFullTransform.TransformPointX(x,y) + 0.5);
        var _y = parseInt(this.m_oFullTransform.TransformPointY(x,y) + 0.5);
        var _r = parseInt(this.m_oFullTransform.TransformPointX(x+w,y) + 0.5);
        var _b = parseInt(this.m_oFullTransform.TransformPointY(x,y+h) + 0.5);

        ctx.rect(_x, _y, _r - _x + 1, _b - _y + 1);
    }

    this.TableRect = function(x,y,w,h)
    {
        var ctx = this.m_oContext;

        var _x = parseInt(this.m_oFullTransform.TransformPointX(x,y)) + 0.5;
        var _y = parseInt(this.m_oFullTransform.TransformPointY(x,y)) + 0.5;
        var _r = parseInt(this.m_oFullTransform.TransformPointX(x+w,y)) + 0.5;
        var _b = parseInt(this.m_oFullTransform.TransformPointY(x,y+h)) + 0.5;

        ctx.fillRect(_x - 0.5, _y - 0.5, _r - _x + 1, _b - _y + 1);
    }

    // функции клиппирования
    this.AddClipRect = function(x, y, w, h)
    {
        this.ClipManager.AddRect(x, y, w, h);
    }
    this.RemoveClipRect = function()
    {
        this.ClipManager.RemoveRect();
    }

    this.SetClip = function(r)
    {
        var ctx = this.m_oContext;
        ctx.save();

        var _x = parseInt(this.m_oFullTransform.TransformPointX(r.x,r.y) + 1);
        var _y = parseInt(this.m_oFullTransform.TransformPointY(r.x,r.y) + 1);
        var _r = parseInt(this.m_oFullTransform.TransformPointX(r.x+r.w,r.y) - 1);
        var _b = parseInt(this.m_oFullTransform.TransformPointY(r.x,r.y+r.h) - 1);

        ctx.beginPath();
        ctx.rect(_x, _y, _r - _x + 1, _b - _y + 1);
        this.clip();
        ctx.beginPath();
    }
    this.RemoveClip = function()
    {
        this.m_oContext.restore();
    }
}