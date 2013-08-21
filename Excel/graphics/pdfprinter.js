function _rect()
{
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
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

function CPdfPrinter(sUrlPath)
{
    this.DocumentRenderer = new CDocumentRenderer();
    this.DocumentRenderer.VectorMemoryForPrint = new CMemory();

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

    this.bIsSimpleCommands = false;

    this.parseColor = window["Asc"].parseColor;
}

CPdfPrinter.prototype =
{
    BeginPage : function(width,height)
    {
        this.DocumentRenderer.BeginPage(width,height);
    },
    EndPage : function()
    {
        this.DocumentRenderer.EndPage();
    },

    getWidth : function(units)
    {
        console.log("error");
        return 0;
    },
    getHeight : function(units)
    {
        console.log("error");
        return 0;
    },

    getCanvas : function()
    {
        console.log("error");
        return null;
    },
    getPPIX : function()
    {
        return 72.0;
    },
    getPPIY : function()
    {
        return 72.0;
    },

    getUnits : function()
    {
        return 3;
    },

    changeUnits : function()
    {
        return this;
    },

    getZoom : function()
    {
        console.log("error");
        return 1;
    },
    changeZoom : function()
    {
        console.log("error");
        return this;
    },

    resetSize : function()
    {
        console.log("error");
        return this;
    },

    expand : function(width, heigth)
    {
        console.log("error");
        return this;
    },

    clear : function()
    {
        console.log("error");
        return this;
    },

    scale : function()
    {
        console.log("error");
        return this;
    },
    translate : function()
    {
        console.log("error");
        return this;
    },

    setTransform : function(sx, shy, shx, sy, tx, ty)
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
    },

    getFillStyle : function()
    {
        return "#000000";
    },
    getStrokeStyle : function()
    {
        return "#000000";
    },
    getLineWidth : function()
    {
        return 1;
    },

    getLineCap : function()
    {
        return "butt";
    },

    getLineJoin : function()
    {
        return "miter";
    },

    setFillStyle : function(val)
    {
        var c = this.parseColor(val);
        this.DocumentRenderer.b_color1(c.r, c.g, c.b, (c.a * 255 + 0.5) >> 0);
        return this;
    },
    setFillPattern : function(val)
    {
        return this;
    },
    setStrokeStyle : function(val)
    {
        var c = this.parseColor(val);
        this.DocumentRenderer.p_color(c.r, c.g, c.b, (c.a * 255 + 0.5) >> 0);
        return this;
    },
    setLineWidth : function(val)
    {
        this.DocumentRenderer.p_width(val * 1000 * vector_koef);
        return this;
    },
    setLineCap : function(cap)
    {
        return this;
    },
    setLineJoin : function(join)
    {
        return this;
    },

    fillRect : function(x, y, w, h)
    {
        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        this.DocumentRenderer.df();
        return this;
    },

    strokeRect : function(x, y, w, h)
    {
        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        this.DocumentRenderer.ds();
        return this;
    },

    clearRect : function(x, y, w, h)
    {
        return this;
    },

    getFont : function()
    {
        return this.font.clone();
    },
    getFontFamily : function()
    {
        return this.font.FontFamily.Name;
    },
    getFontSize : function()
    {
        return this.font.FontSize;
    },

    getFontMetrix : function()
    {
        console.log("error");
        return new FontMetrics(0, 0, 0);
    },
    setFont : function(font)
    {
        this.DocumentRenderer.SetFont(font);
        return this;
    },

    measureChar : function(text, units)
    {
        console.log("error");
        return null;
    },
    measureText : function(text, units)
    {
        console.log("error");
        return null;
    },

    fillText : function(text, x, y, maxWidth, charWidths)
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
    },

    beginPath : function()
    {
        this.DocumentRenderer._s();
        return this;
    },
    closePath : function()
    {
        this.DocumentRenderer._z();
        return this;
    },

    moveTo : function(x, y, dx, dy)
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
    },
    lineTo : function(x, y, dx, dy)
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
    },
    rect : function(x, y, w, h)
    {
        if (this.bIsSimpleCommands)
            return this.DocumentRenderer.rect(x, y, w, h);

        this.DocumentRenderer.rect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
        return this;
    },

    arc : function(x, y, radius, startAngle, endAngle, antiClockwise)
    {
        // TODO:
        return this;
    },
    bezierCurveTo : function(x1, y1, x2, y2, x3, y3)
    {
        this.DocumentRenderer._c(x1 * vector_koef, y1 * vector_koef, x2 * vector_koef, y2 * vector_koef, x3 * vector_koef, y3 * vector_koef);
        return this;
    },

    fill : function()
    {
        this.DocumentRenderer.df();
        return this;
    },
    stroke : function()
    {
        this.DocumentRenderer.ds();
        return this;
    },

    clip : function()
    {
        return this;
    },
    drawImage : function(_src, sx, sy, sw, sh, dx, dy, dw, dh, src_w, src_h)
    {
        if (this.bIsSimpleCommands)
            return this.DocumentRenderer.drawImage(_src, sx, sy, sw, sh, dx, dy);

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
    },

    AddClipRect : function(x, y, w, h)
    {
        if (this.bIsSimpleCommands)
            return this.DocumentRenderer.AddClipRect(x, y, w, h);

        this.DocumentRenderer.SaveGrState();
        this.DocumentRenderer.AddClipRect(x * vector_koef, y * vector_koef, w * vector_koef, h * vector_koef);
    },
    RemoveClipRect : function()
    {
        if (this.bIsSimpleCommands)
            return this.DocumentRenderer.RemoveClipRect();

        //this.DocumentRenderer.RemoveClipRect();
        this.DocumentRenderer.RestoreGrState();
    },

    SetClip : function(r)
    {
        this.DocumentRenderer.SetClip(r);
    },
    RemoveClip : function()
    {
        this.DocumentRenderer.RemoveClip();
    },

    //////////////////////////////////////////////////////////////
    p_color : function(r,g,b,a)
    {
        return this.DocumentRenderer.p_color(r, g, b, a);
    },
    p_width : function(w)
    {
        return this.DocumentRenderer.p_width(w);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        return this.DocumentRenderer.b_color1(r, g, b, a);
    },
    b_color2 : function(r,g,b,a)
    {
        return  this.DocumentRenderer.b_color2(r, g, b, a);
    },
    transform : function(sx,shy,shx,sy,tx,ty)
    {
        return this.DocumentRenderer.transform(sx,shy,shx,sy,tx,ty);
    },
    transform3 : function(m)
    {
        return this.DocumentRenderer.transform3(m);
    },
    reset : function()
    {
        return this.DocumentRenderer.reset();
    },
    // path commands
    _s : function()
    {
        return this.DocumentRenderer._s();
    },
    _e : function()
    {
        return this.DocumentRenderer._e();
    },
    _z : function()
    {
        return this.DocumentRenderer._z();
    },
    _m : function(x,y)
    {
        return this.DocumentRenderer._m(x, y);
    },
    _l : function(x,y)
    {
        return this.DocumentRenderer._l(x, y);
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        return this.DocumentRenderer._c(x1,y1,x2,y2,x3,y3);
    },
    _c2 : function(x1,y1,x2,y2)
    {
        return this.DocumentRenderer._c(x1,y1,x2,y2);
    },
    ds : function()
    {
        return this.DocumentRenderer.ds();
    },
    df : function()
    {
        return this.DocumentRenderer.df();
    },
    drawpath : function(type)
    {
        return this.DocumentRenderer.drawpath(type);
    },

    // canvas state
    save : function()
    {
        return this.DocumentRenderer.save();
    },
    restore : function()
    {
        return this.DocumentRenderer.restore();
    },
    clip : function()
    {
        return this.DocumentRenderer.clip();
    },

    SetFont : function(font)
    {
        return this.DocumentRenderer.SetFont(font);
    },
    FillText : function(x,y,text,cropX,cropW)
    {
        return this.DocumentRenderer.FillText(x,y,text,cropX,cropW);
    },
    FillText2 : function(x,y,text)
    {
        return this.DocumentRenderer.FillText2(x,y,text);
    },
    charspace : function(space)
    {
        return this.DocumentRenderer.charspace(space);
    },
    SetIntegerGrid : function(param)
    {
        return this.DocumentRenderer.SetIntegerGrid(param);
    },
    GetIntegerGrid : function()
    {
        return this.DocumentRenderer.GetIntegerGrid();
    },
    GetFont : function()
    {
        return this.DocumentRenderer.GetFont();
    },
    put_GlobalAlpha : function(enable, alpha)
    {
        return this.DocumentRenderer.put_GlobalAlpha(enable, alpha);
    },
    Start_GlobalAlpha : function()
    {
        return this.DocumentRenderer.Start_GlobalAlpha();
    },
    End_GlobalAlpha : function()
    {
        return this.DocumentRenderer.End_GlobalAlpha();
    },
    DrawHeaderEdit : function(yPos)
    {
        return this.DocumentRenderer.DrawHeaderEdit(yPos);
    },
    DrawFooterEdit : function(yPos)
    {
        return this.DocumentRenderer.DrawFooterEdit(yPos);
    },
    drawCollaborativeChanges : function(x, y, w, h)
    {
        return this.DocumentRenderer.drawCollaborativeChanges(x, y, w, h);
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        return this.DocumentRenderer.DrawEmptyTableLine(x1,y1,x2,y2);
    },
    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        return this.DocumentRenderer.DrawLockParagraph(lock_type, x, y1, y2);
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        return this.DocumentRenderer.DrawLockObjectRect(lock_type, x, y, w, h);
    },

    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW)
    {
        return this.DocumentRenderer.drawHorLine(align, y, x, r, penW);
    },
    drawHorLine2 : function(align, y, x, r, penW)
    {
        return this.DocumentRenderer.drawHorLine(align, y, x, r, penW);
    },

    drawVerLine : function(align, x, y, b, penW)
    {
        return this.DocumentRenderer.drawVerLine(align, x, y, b, penW);
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        return this.DocumentRenderer.drawHorLineExt(align, y, x, r, penW, leftMW, rightMW);
    },

    TableRect : function(x,y,w,h)
    {
        return this.DocumentRenderer.TableRect(x,y,w,h);
    },

    put_PenLineJoin : function(_join)
    {
        return this.DocumentRenderer.put_PenLineJoin(_join);
    },
    put_TextureBounds : function(x, y, w, h)
    {
        return this.DocumentRenderer.put_TextureBounds(x, y, w, h);
    },
    put_TextureBoundsEnabled : function(val)
    {
        return this.DocumentRenderer.put_TextureBoundsEnabled(val);
    },
    put_brushTexture : function(src, mode)
    {
        return this.DocumentRenderer.put_brushTexture(src, mode);
    },
    put_BrushTextureAlpha : function(alpha)
    {
        return this.DocumentRenderer.put_BrushTextureAlpha(alpha);
    },
    put_BrushGradient : function(gradFill, points)
    {
        return this.DocumentRenderer.put_BrushGradient(gradFill, points);
    },

    GetTransform : function()
    {
        return this.DocumentRenderer.GetTransform();
    },
    GetLineWidth : function()
    {
        return this.DocumentRenderer.GetLineWidth();
    },
    GetPen : function()
    {
        return this.DocumentRenderer.GetPen();
    },
    GetBrush : function()
    {
        return this.DocumentRenderer.GetBrush();
    },

    drawFlowAnchor : function(x, y)
    {
        return this.DocumentRenderer.drawFlowAnchor(x, y);
    },

    SavePen : function()
    {
        return this.DocumentRenderer.SavePen();
    },
    RestorePen : function()
    {
        return this.DocumentRenderer.RestorePen();
    },

    SaveBrush : function()
    {
        return this.DocumentRenderer.SaveBrush();
    },
    RestoreBrush : function()
    {
        return this.DocumentRenderer.RestoreBrush();
    },

    SavePenBrush : function()
    {
        return this.DocumentRenderer.SavePenBrush();
    },
    RestorePenBrush : function()
    {
        return this.DocumentRenderer.RestorePenBrush();
    },

    SaveGrState : function()
    {
        return this.DocumentRenderer.SaveGrState();
    },
    RestoreGrState : function()
    {
        return this.DocumentRenderer.RestoreGrState();
    },

    StartClipPath : function()
    {
        return this.DocumentRenderer.StartClipPath();
    },

    EndClipPath : function()
    {
        return this.DocumentRenderer.EndClipPath();
    },

    SetTextPr : function(textPr)
    {
        return this.DocumentRenderer.SetTextPr(textPr);
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        return this.DocumentRenderer.SetFontSlot(slot, fontSizeKoef);
    },

    GetTextPr : function()
    {
        return this.DocumentRenderer.GetTextPr();
    }
};

