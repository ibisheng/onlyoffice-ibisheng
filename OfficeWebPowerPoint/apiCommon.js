function CDocOpenProgress()
{
    this.Type = c_oAscAsyncAction.Open;

    this.FontsCount = 0;
    this.CurrentFont = 0;

    this.ImagesCount = 0;
    this.CurrentImage = 0;
}

CDocOpenProgress.prototype.get_Type = function(){return this.Type}
CDocOpenProgress.prototype.get_FontsCount = function(){return this.FontsCount}
CDocOpenProgress.prototype.get_CurrentFont = function(){return this.CurrentFont}
CDocOpenProgress.prototype.get_ImagesCount = function(){return this.ImagesCount}
CDocOpenProgress.prototype.get_CurrentImage = function(){return this.CurrentImage}

function CDocInfo (obj){
    if(obj){
        if (typeof obj.Id != 'undefined'){
            this.Id = obj.Id;
        }
        if (typeof obj.Url != 'undefined'){
            this.Url = obj.Url;
        }
        if (typeof obj.Title != 'undefined'){
            this.Title = obj.Title;
        }
        if (typeof obj.Format != 'undefined'){
            this.Format = obj.Format;
        }
        if (typeof obj.VKey != 'undefined'){
            this.VKey = obj.VKey;
        }
        if (typeof obj.UserId != 'undefined'){
            this.UserId = obj.UserId;
        }
        if (typeof obj.UserName != 'undefined'){
            this.UserName = obj.UserName;
        }
        if (obj.OfflineApp === true)
            this.OfflineApp = true;
    }
    else{
        this.Id = null;
        this.Url = null;
        this.Title = null;
        this.Format = null;
        this.VKey = null;
        this.UserId = null;
        this.UserName = null;
    }
}
CDocInfo.prototype.get_Id = function(){return this.Id}
CDocInfo.prototype.put_Id = function(v){this.Id = v;}
CDocInfo.prototype.get_Url = function(){return this.Url;}
CDocInfo.prototype.put_Url = function(v){this.Url = v;}
CDocInfo.prototype.get_Title = function(){return this.Title;}
CDocInfo.prototype.put_Title = function(v){this.Title = v;}
CDocInfo.prototype.get_Format = function(){return this.Format;}
CDocInfo.prototype.put_Format = function(v){this.Format = v;}
CDocInfo.prototype.get_VKey = function(){return this.VKey;}
CDocInfo.prototype.put_VKey = function(v){this.VKey = v;}
CDocInfo.prototype.get_OfflineApp = function(){return this.OfflineApp;}
CDocInfo.prototype.put_OfflineApp = function(v){this.OfflineApp = v;}
CDocInfo.prototype.get_UserId = function(){return this.UserId;}
CDocInfo.prototype.put_UserId = function(v){this.UserId = v;}
CDocInfo.prototype.get_UserName = function(){return this.UserName;}
CDocInfo.prototype.put_UserName = function(v){this.UserName = v;}
// ---------------------------------------------------------------

function CAscColorScheme()
{
    this.Colors = new Array();
    this.Name = "";
}
CAscColorScheme.prototype.get_colors = function() { return this.Colors; }
CAscColorScheme.prototype.get_name = function() { return this.Name; }

// ---------------------------------------------------------------

// ---------------------------------------------------------------

function CAscTexture()
{
    this.Id = 0;
    this.Image = "";
}
CAscTexture.prototype.get_id = function() { return this.Id; }
CAscTexture.prototype.get_image = function() { return this.Image; }

// ---------------------------------------------------------------

function CColor (r,g,b){
    this.r = (undefined == r) ? 0 : r;
    this.g = (undefined == g) ? 0 : g;
    this.b = (undefined == b) ? 0 : b;
}
CColor.prototype.get_r = function(){return this.r}
CColor.prototype.put_r = function(v){this.r = v; this.hex = undefined;}
CColor.prototype.get_g = function(){return this.g;}
CColor.prototype.put_g = function(v){this.g = v; this.hex = undefined;}
CColor.prototype.get_b = function(){return this.b;}
CColor.prototype.put_b = function(v){this.b = v; this.hex = undefined;}
CColor.prototype.get_hex = function()
{
	if(!this.hex)
	{
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		this.hex = ( r.length == 1? "0" + r: r) +
					( g.length == 1? "0" + g: g) +
					( b.length == 1? "0" + b: b);
	}
	return this.hex;
}

// цвет. может быть трех типов:
// COLOR_TYPE_SRGB   : // value - не учитывается
// COLOR_TYPE_PRST   : // value - имя стандартного цвета (map_prst_color)
// COLOR_TYPE_SCHEME : // value - тип цвета в схеме
// sys color - конвертируется в srgb
function CAscColor()
{
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;

    this.Mods = new Array();
    this.ColorSchemeId = -1;
}
CAscColor.prototype.get_r = function(){return this.r}
CAscColor.prototype.put_r = function(v){this.r = v; this.hex = undefined;}
CAscColor.prototype.get_g = function(){return this.g;}
CAscColor.prototype.put_g = function(v){this.g = v; this.hex = undefined;}
CAscColor.prototype.get_b = function(){return this.b;}
CAscColor.prototype.put_b = function(v){this.b = v; this.hex = undefined;}
CAscColor.prototype.get_a = function(){return this.a;}
CAscColor.prototype.put_a = function(v){this.a = v; this.hex = undefined;}
CAscColor.prototype.get_type = function(){return this.type;}
CAscColor.prototype.put_type = function(v){this.type = v;}
CAscColor.prototype.get_value = function(){return this.value;}
CAscColor.prototype.put_value = function(v){this.value = v;}
CAscColor.prototype.get_hex = function()
{
	if(!this.hex)
	{
		var a = this.a.toString(16);
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		this.hex = ( a.length == 1? "0" + a: a) +
					( r.length == 1? "0" + r: r) +
					( g.length == 1? "0" + g: g) +
					( b.length == 1? "0" + b: b);
	}
	return this.hex;
}
// эта функция ДОЛЖНА минимизироваться
function CreateAscColor(unicolor)
{
    if (null == unicolor || null == unicolor.color)
        return new CAscColor();

    var ret = new CAscColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;

    var _color = unicolor.color;
    switch (_color.type)
    {
        case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        {
            break;
        }
        case COLOR_TYPE_PRST:
        {
            ret.type = c_oAscColor.COLOR_TYPE_PRST;
            ret.value = _color.id;
            break;
        }
        case COLOR_TYPE_SCHEME:
        {
            ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
            ret.value = _color.id;
            break;
        }
        default:
            break;
    }
    return ret;
}
function CorrectUniColor(asc_color, unicolor)
{
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.get_type();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_PRST)
            {
                ret.color = new CPrstColor();
            }
            ret.color.id = asc_color.get_value();
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME)
            {
                ret.color = new CSchemeColor();
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.get_value());
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.id = array_colors_types[_id];

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            if (1 <= _pos && _pos <= 5)
            {
                var _mods = g_oThemeColorsDefaultMods[_pos - 1];
                var _ind = 0;
                for (var k in _mods)
                {
                    ret.Mods.Mods[_ind] = new CColorMod();
                    ret.Mods.Mods[_ind].name = k;
                    ret.Mods.Mods[_ind].val = _mods[k];
                    _ind++;
                }
            }

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB)
            {
                ret.color = new CRGBColor();
            }
            ret.color.RGBA.R = asc_color.get_r();
            ret.color.RGBA.G = asc_color.get_g();
            ret.color.RGBA.B = asc_color.get_b();
            ret.color.RGBA.A = asc_color.get_a();
        }
    }
    return ret;
}
// ---------------------------------------------------------------

// заливка -------------------------------------------------------
function CAscFillBlip()
{
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}
CAscFillBlip.prototype.get_type = function(){return this.type}
CAscFillBlip.prototype.put_type = function(v){this.type = v;}
CAscFillBlip.prototype.get_url = function(){return this.url;}
CAscFillBlip.prototype.put_url = function(v){this.url = v;}
CAscFillBlip.prototype.get_texture_id = function(){return this.texture_id;}
CAscFillBlip.prototype.put_texture_id = function(v){this.texture_id = v;}

function CAscFillSolid()
{
    this.color = new CAscColor();
}
CAscFillSolid.prototype.get_color = function(){return this.color}
CAscFillSolid.prototype.put_color = function(v){this.color = v;}

function CAscFill()
{
    this.type = null;
    this.fill = null;
    this.transparent = null;
}
CAscFill.prototype.get_type = function(){return this.type}
CAscFill.prototype.put_type = function(v){this.type = v;}
CAscFill.prototype.get_fill = function(){return this.fill;}
CAscFill.prototype.put_fill = function(v){this.fill = v;}
CAscFill.prototype.get_transparent = function(){ return this.transparent; }
CAscFill.prototype.put_transparent = function(v){ this.transparent = v; }

// эта функция ДОЛЖНА минимизироваться
function CreateAscFill(unifill)
{
    if (null == unifill || null == unifill.fill)
        return new CAscFill();

    var ret = new CAscFill();

    var _fill = unifill.fill;
    switch (_fill.type)
    {
        case FILL_TYPE_SOLID:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new CAscFillSolid();
            ret.fill.color = CreateAscColor(_fill.color);
            break;
        }
        case FILL_TYPE_PATT:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new CAscFillSolid();
            ret.fill.color = CreateAscColor(_fill.fgClr);
            break;
        }
        case FILL_TYPE_GRAD:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new CAscFillSolid();

            if (_fill.colors.length > 0)
                ret.fill.color = CreateAscColor(_fill.colors[0].color);
            break;
        }
        case FILL_TYPE_BLIP:
        {
            ret.type = c_oAscFill.FILL_TYPE_BLIP;
            ret.fill = new CAscFillBlip();

            ret.fill.url = _fill.RasterImageId;
            ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
            break;
        }
        default:
            break;
    }

    ret.transparent = unifill.transparent;
    return ret;
}
function CorrectUniFill(asc_fill, unifill)
{
    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.get_fill();
    var _type = asc_fill.get_type();

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.fill = new CNoFill();
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP)
                {
                    ret.fill = new CBlipFill();
                }

                var _url = _fill.get_url();
                var _tx_id = _fill.get_texture_id();
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length))
                {
                    _url = g_oUserTexturePresets[_tx_id];
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.RasterImageId = _url;

                if (ret.fill.RasterImageId == null)
                    ret.fill.RasterImageId = "";

                var tile = _fill.get_type();
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.tile = null;
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.tile = true;

                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID)
                {
                    ret.fill = new CSolidFill();
                }
                ret.fill.color = CorrectUniColor(_fill.get_color(), ret.fill.color);
            }
        }
    }

    var _alpha = asc_fill.get_transparent();
    if (null != _alpha)
        ret.transparent = _alpha;

    return ret;
}

// ---------------------------------------------------------------

function CAscSlideProps()
{
    this.Background = null;
}

CAscSlideProps.prototype.get_background = function(){return this.Background;}
CAscSlideProps.prototype.put_background = function(v){this.Background = v;}

// ---------------------------------------------------------------

// outline -------------------------------------------------------
function CAscStroke()
{
    this.type = null;
    this.width = null;
    this.color = null;

    this.LineJoin = null;
    this.LineCap = null;

    this.LineBeginStyle = null;
    this.LineBeginSize = null;

    this.LineEndStyle = null;
    this.LineEndSize = null;

    this.canChangeArrows = false;
}
CAscStroke.prototype.get_type = function(){return this.type;}
CAscStroke.prototype.put_type = function(v){this.type = v;}
CAscStroke.prototype.get_width = function(){return this.width;}
CAscStroke.prototype.put_width = function(v){this.width = v;}
CAscStroke.prototype.get_color = function(){return this.color;}
CAscStroke.prototype.put_color = function(v){this.color = v;}

CAscStroke.prototype.get_linejoin = function(){return this.LineJoin;}
CAscStroke.prototype.put_linejoin = function(v){this.LineJoin = v;}
CAscStroke.prototype.get_linecap = function(){return this.LineCap;}
CAscStroke.prototype.put_linecap = function(v){this.LineCap = v;}

CAscStroke.prototype.get_linebeginstyle = function(){return this.LineBeginStyle;}
CAscStroke.prototype.put_linebeginstyle = function(v){this.LineBeginStyle = v;}
CAscStroke.prototype.get_linebeginsize = function(){return this.LineBeginSize;}
CAscStroke.prototype.put_linebeginsize = function(v){this.LineBeginSize = v;}
CAscStroke.prototype.get_lineendstyle = function(){return this.LineEndStyle;}
CAscStroke.prototype.put_lineendstyle = function(v){this.LineEndStyle = v;}
CAscStroke.prototype.get_lineendsize = function(){return this.LineEndSize;}
CAscStroke.prototype.put_lineendsize = function(v){this.LineEndSize = v;}

CAscStroke.prototype.get_canChangeArrows = function(){return this.canChangeArrows;}

// эта функция ДОЛЖНА минимизироваться
function CreateAscStroke(ln, _canChangeArrows)
{
    if (null == ln || null == ln.Fill || ln.Fill.fill == null)
        return new CAscStroke();

    var ret = new CAscStroke();

    var _fill = ln.Fill.fill;
    if(_fill != null)
    {
        switch (_fill.type)
        {
            case FILL_TYPE_BLIP:
            {
                break;
            }
            case FILL_TYPE_SOLID:
            {
                ret.color = CreateAscColor(_fill.color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_GRAD:
            {
                var _c = _fill.colors;
                if (_c != 0)
                {
                    ret.color = CreateAscColor(_fill.colors[0]);
                    ret.type = c_oAscStrokeType.STROKE_COLOR;
                }

                break;
            }
            case FILL_TYPE_PATT:
            {
                ret.color = CreateAscColor(_fill.fgClr);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case FILL_TYPE_NOFILL:
            {
                ret.color = null;
                ret.type = c_oAscStrokeType.STROKE_NONE;
                break;
            }
            default:
            {
                break;
            }
        }
    }


    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000.0;

    if (ln.cap != null)
        ret.put_linecap(ln.cap);

    if (ln.LineJoin != null)
        ret.put_linejoin(ln.LineJoin.type);

    if (ln.headEnd != null)
    {
        ret.put_linebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);

        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);

        ret.put_linebeginsize(_w * 3 + _len);
    }
    else
    {
        ret.put_linebeginstyle(LineEndType.None);
    }

    if (ln.tailEnd != null)
    {
        ret.put_lineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);

        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);

        ret.put_lineendsize(_w * 3 + _len);
    }
    else
    {
        ret.put_lineendstyle(LineEndType.None);
    }

    if (true === _canChangeArrows)
        ret.canChangeArrows = true;

    return ret;
}

function CorrectUniStroke(asc_stroke, unistroke)
{
    if (null == asc_stroke)
        return unistroke;

    var ret = unistroke;
    if (null == ret)
        ret = new CLn();

    var _type = asc_stroke.get_type();
    var _w = asc_stroke.get_width();

    if (_w != null && _w !== undefined)
        ret.w = _w * 36000.0;

    var _color = asc_stroke.get_color();
    if (_type == c_oAscStrokeType.STROKE_NONE)
    {
        ret.Fill = new CUniFill();
        ret.Fill.fill = new CNoFill();
    }
    else if (_type != null)
    {
        if (null != _color && undefined !== _color)
        {
            ret.Fill = new CUniFill();
            ret.Fill.type = FILL_TYPE_SOLID;
            ret.Fill.fill = new CSolidFill();
            ret.Fill.fill.color = CorrectUniColor(_color, ret.Fill.fill.color);
        }
    }

    var _join = asc_stroke.get_linejoin();
    if (null != _join)
    {
        ret.LineJoin = new LineJoin();
        ret.LineJoin.type = _join;
    }

    var _cap = asc_stroke.get_linecap();
    if (null != _cap)
    {
        ret.cap = _cap;
    }

    var _begin_style = asc_stroke.get_linebeginstyle();
    if (null != _begin_style)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.type = _begin_style;
    }

    var _end_style = asc_stroke.get_lineendstyle();
    if (null != _end_style)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.type = _end_style;
    }

    var _begin_size = asc_stroke.get_linebeginsize();
    if (null != _begin_size)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.w = 2 - ((_begin_size/3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }

    var _end_size = asc_stroke.get_lineendsize();
    if (null != _end_size)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.w = 2 - ((_end_size/3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }

    return ret;
}

// ---------------------------------------------------------------

// shapePr -------------------------------------------------------
function CAscShapeProp()
{
    this.type = null; // custom
    this.fill = null;
    this.stroke = null;
}
CAscShapeProp.prototype.get_type = function(){return this.type}
CAscShapeProp.prototype.put_type = function(v){this.type = v;}
CAscShapeProp.prototype.get_fill = function(){return this.fill}
CAscShapeProp.prototype.put_fill = function(v){this.fill = v;}
CAscShapeProp.prototype.get_stroke = function(){return this.stroke}
CAscShapeProp.prototype.put_stroke = function(v){this.stroke = v;}

// эта функция ДОЛЖНА минимизироваться
function CreateAscShapeProp(shape)
{
    if (null == shape)
        return new CAscShapeProp();

    var ret = new CAscShapeProp();
    ret.fill = CreateAscFill(shape.brush);
    ret.stroke = CreateAscStroke(shape.pen);
    return ret;
}
function CorrectShapeProp(asc_shape_prop, shape)
{
    if (null == shape || null == asc_shape_prop)
        return;

    shape.spPr.Fill = CorrectUniFill(asc_shape_prop.get_fill(), shape.spPr.Fill);
    shape.spPr.ln = CorrectUniFill(asc_shape_prop.get_stroke(), shape.spPr.ln);
}

// ---------------------------------------------------------------

// информация о темах --------------------------------------------

function CAscThemeInfo(themeInfo)
{
    this.Obj = themeInfo;
    this.Index = -1000;
}
CAscThemeInfo.prototype.get_Name = function() { return this.Obj["Name"]; }
CAscThemeInfo.prototype.get_Url = function() { return this.Obj["Url"]; }
CAscThemeInfo.prototype.get_Image = function() { return this.Obj["Thumbnail"]; }
CAscThemeInfo.prototype.get_Index = function() { return this.Index; }

function CAscThemes()
{
    this.EditorThemes = new Array();
    this.DocumentThemes = new Array();

    var _count = _presentation_editor_themes.length;
    for (var i = 0; i < _count; i++)
    {
        this.EditorThemes[i] = new CAscThemeInfo(_presentation_editor_themes[i]);
        this.EditorThemes[i].Index = i;
    }
}
CAscThemes.prototype.get_EditorThemes = function(){ return this.EditorThemes; }
CAscThemes.prototype.get_DocumentThemes = function(){ return this.DocumentThemes; }

// ---------------------------------------------------------------

function CListType(obj)
{
    if (obj)
    {
        this.Type = (undefined == obj.Type) ? null : obj.Type;
        this.SubType = (undefined == obj.Type) ? null : obj.SubType;
    }
    else
    {
        this.Type = null;
        this.SubType = null;
    }
}
CListType.prototype.get_ListType = function() { return this.Type; }
CListType.prototype.get_ListSubType = function() { return this.SubType; }

function CPosition( obj )
{
    if (obj)
    {
        this.X = (undefined == obj.X) ? null : obj.X;
        this.Y = (undefined == obj.Y) ? null : obj.Y;
    }
    else
    {
        this.X = null;
        this.Y = null;
    }
}
CPosition.prototype.get_X = function() { return this.X; }
CPosition.prototype.put_X = function(v) { this.X = v; }
CPosition.prototype.get_Y = function() { return this.Y; }
CPosition.prototype.put_Y = function(v) { this.Y = v; }

function CPaddings( obj )
{
    if ( obj )
    {
        this.Left = (undefined == obj.Left) ? null : obj.Left;
        this.Top = (undefined == obj.Top) ? null : obj.Top;
        this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
        this.Right = (undefined == obj.Right) ? null : obj.Right;
    }
    else
    {
        this.Left = null;
        this.Top = null;
        this.Bottom = null;
        this.Right = null;
    }
}

CPaddings.prototype.get_Left = function() { return this.Left; }
CPaddings.prototype.put_Left = function(v) { this.Left = v; }
CPaddings.prototype.get_Top = function() { return this.Top; }
CPaddings.prototype.put_Top = function(v) { this.Top = v; }
CPaddings.prototype.get_Bottom = function() { return this.Bottom; }
CPaddings.prototype.put_Bottom = function(v) { this.Bottom = v; }
CPaddings.prototype.get_Right = function() { return this.Right; }
CPaddings.prototype.put_Right = function(v) { this.Right = v; }

function CImageSize( width, height )
{
    this.Width = (undefined == width) ? 0.0 : width;
    this.Height = (undefined == height) ? 0.0 : height;
}

CImageSize.prototype.get_ImageWidth = function() { return this.Width; }
CImageSize.prototype.get_ImageHeight = function() { return this.Height; }

function CImgProperty( obj )
{
    if( obj )
    {
        this.Width = (undefined != obj.Width) ? obj.Width : null;
        this.Height = (undefined != obj.Height) ? obj.Height : null;
        this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle : null;

        this.Paddings = (undefined != obj.Paddings && null != obj.Paddings) ? new CPaddings (obj.Paddings) : null;
        this.Position = (undefined != obj.Position && null != obj.Position) ? new CPosition (obj.Position) : null;

        this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
    }
    else
    {
        this.Width = null;
        this.Height = null;
        this.WrappingStyle = null;
        this.Paddings = new CPaddings ();	// default values
        this.Position = new CPosition ();	// default values
        this.ImageUrl = null;
    }
}

CImgProperty.prototype.get_Width = function() { return this.Width; }
CImgProperty.prototype.put_Width = function(v) { this.Width = v; }
CImgProperty.prototype.get_Height = function() { return this.Height; }
CImgProperty.prototype.put_Height = function(v) { this.Height = v; }
CImgProperty.prototype.get_WrappingStyle = function() { return this.WrappingStyle; }
CImgProperty.prototype.put_WrappingStyle = function(v) { this.WrappingStyle = v; }
// Возвращается объект класса CPaddings
CImgProperty.prototype.get_Paddings = function() { return this.Paddings; }
// Аргумент объект класса CPaddings
CImgProperty.prototype.put_Paddings = function(v) { this.Paddings = v; }
// Возвращается объект класса CPosition
CImgProperty.prototype.get_Position = function() { return this.Position; }
// Аргумент объект класса CPosition
CImgProperty.prototype.put_Position = function(v) { this.Position = v; }
CImgProperty.prototype.get_ImageUrl = function() { return this.ImageUrl; }
CImgProperty.prototype.put_ImageUrl = function(v) { this.ImageUrl = v; }
CImgProperty.prototype.get_OriginSize = function(api)
{
    var _img = api.ImageLoader.map_image_index[_getFullImageSrc(this.ImageUrl)];
    if (_img != undefined && _img.Image != null || _img.Status == ImageLoadStatus.Loading)
    {
        var _w = _img.Image.width;
        var _h = _img.Image.height;

        var _max = Math.min(api.WordControl.m_oLogicDocument.Width, api.WordControl.m_oLogicDocument.Height) * g_dKoef_mm_to_pix;
        if (_w > _max || _h > _max)
        {
            var _koef = _max / Math.max(1, Math.max(_w, _h));

            _w = (_koef * _w) >> 0;
            _h = (_koef * _h) >> 0;
        }
        return new CImageSize((_w * g_dKoef_pix_to_mm) >> 0, (_h * g_dKoef_pix_to_mm) >> 0);
    }
    return new CImageSize( 50, 50 );
}

function CHeaderProp( obj )
{
    /*{
     Type : hdrftr_Footer (hdrftr_Header),
     Position : 12.5,
     DifferentFirst : true/false,
     DifferentEvenOdd : true/false,
     }*/
    if( obj )
    {
        this.Type = (undefined != obj.Type) ? obj.Type: null;
        this.Position = (undefined != obj.Position) ? obj.Position : null;
        this.DifferentFirst = (undefined != obj.DifferentFirst) ? obj.DifferentFirst : null;
        this.DifferentEvenOdd = (undefined != obj.DifferentEvenOdd) ? obj.DifferentEvenOdd : null;
    }
    else
    {
        this.Type = hdrftr_Footer;
        this.Position = 12.5;
        this.DifferentFirst = false;
        this.DifferentEvenOdd = false;
    }
}

CHeaderProp.prototype.get_Type = function(){ return this.Type; }
CHeaderProp.prototype.put_Type = function(v){ this.Type = v; }
CHeaderProp.prototype.get_Position = function(){ return this.Position; }
CHeaderProp.prototype.put_Position = function(v){ this.Position = v; }
CHeaderProp.prototype.get_DifferentFirst = function(){ return this.DifferentFirst; }
CHeaderProp.prototype.put_DifferentFirst = function(v){ this.DifferentFirst = v; }
CHeaderProp.prototype.get_DifferentEvenOdd = function(){ return this.DifferentEvenOdd; }
CHeaderProp.prototype.put_DifferentEvenOdd = function(v){ this.DifferentEvenOdd = v; }

function CSelectedObject( type, val )
{
    this.Type = (undefined != type) ? type : null;
    this.Value = (undefined != val) ? val : null;
}
// Возвращает тип объекта c_oAscTypeSelectElement
CSelectedObject.prototype.get_ObjectType = function() { return this.Type; }

// Возвращает собственно сам объект класса в зависимости от типа
// c_oAscTypeSelectElement.Paragraph CParagraphProp
// c_oAscTypeSelectElement.Image CImgProperty
// c_oAscTypeSelectElement.Table CTableProp
// c_oAscTypeSelectElement.Header CHeaderProp
CSelectedObject.prototype.get_ObjectValue = function() { return this.Value; }

// [!dirty hack for minimizer - don't delete this comment!] function CFont ()
CFont.prototype.asc_getFontId = function() { return this.id; }
CFont.prototype.asc_getFontName = function() { return this.name; }
CFont.prototype.asc_getFontThumbnail = function() { return this.thumbnail; }
CFont.prototype.asc_getFontType = function() { return this.type; }

function CLayoutThumbnail()
{
    this.Index = 0;
    this.Name = "";
    this.Type = 15;
    this.Image = "";
}

CLayoutThumbnail.prototype.getIndex = function() { return this.Index; }
CLayoutThumbnail.prototype.getType = function() { return this.Type; }
CLayoutThumbnail.prototype.get_Image = function() { return this.Image; }
CLayoutThumbnail.prototype.get_Name = function() { return this.Name; }

function CDocInfoProp(obj)
{
    if(obj){
        this.PageCount = obj.PageCount;
        this.WordsCount = obj.WordsCount;
        this.ParagraphCount = obj.ParagraphCount;
        this.SymbolsCount = obj.SymbolsCount;
        this.SymbolsWSCount = obj.SymbolsWSCount;
    }
    else {
        this.PageCount = -1;
        this.WordsCount = -1;
        this.ParagraphCount = -1;
        this.SymbolsCount = -1;
        this.SymbolsWSCount = -1;
    }
}
CDocInfoProp.prototype.get_PageCount = function(){ return this.PageCount; }
CDocInfoProp.prototype.put_PageCount = function(v){ this.PageCount = v; }
CDocInfoProp.prototype.get_WordsCount = function(){ return this.WordsCount; }
CDocInfoProp.prototype.put_WordsCount = function(v){ this.WordsCount = v; }
CDocInfoProp.prototype.get_ParagraphCount = function(){ return this.ParagraphCount; }
CDocInfoProp.prototype.put_ParagraphCount = function(v){ this.ParagraphCount = v; }
CDocInfoProp.prototype.get_SymbolsCount = function(){ return this.SymbolsCount; }
CDocInfoProp.prototype.put_SymbolsCount = function(v){ this.SymbolsCount = v; }
CDocInfoProp.prototype.get_SymbolsWSCount = function(){ return this.SymbolsWSCount; }
CDocInfoProp.prototype.put_SymbolsWSCount = function(v){ this.SymbolsWSCount = v; }

/*----------------------------------------------------------------*/
/*functions for working with headers*/
/*
 структура заголовков, предварительно, выглядит так
 {
 headerText: "Header1",//заголовок
 pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
 X: 0,//координаты по OX начала последовательности на данной страницы
 Y: 0,//координаты по OY начала последовательности на данной страницы
 level: 0//уровень заголовка
 }
 заголовки приходят либо в списке, либо последовательно.
 */
// CHeader
function CHeader (obj)
{
    if (obj)
    {
        this.headerText = (undefined != obj.headerText) ? obj.headerText : null;	//заголовок
        this.pageNumber = (undefined != obj.pageNumber) ? obj.pageNumber : null;	//содержит номер страницы, где находится искомая последовательность
        this.X = (undefined != obj.X) ? obj.X : null;								//координаты по OX начала последовательности на данной страницы
        this.Y = (undefined != obj.Y) ? obj.Y : null;								//координаты по OY начала последовательности на данной страницы
        this.level = (undefined != obj.level) ? obj.level : null;					//позиция заголовка
    }
    else
    {
        this.headerText = null;				//заголовок
        this.pageNumber = null;				//содержит номер страницы, где находится искомая последовательность
        this.X = null;						//координаты по OX начала последовательности на данной страницы
        this.Y = null;						//координаты по OY начала последовательности на данной страницы
        this.level = null;					//позиция заголовка
    }
}
CHeader.prototype.get_headerText = function ()
{
    return this.headerText;
}
CHeader.prototype.get_pageNumber = function ()
{
    return this.pageNumber;
}
CHeader.prototype.get_X = function ()
{
    return this.X;
}
CHeader.prototype.get_Y = function ()
{
    return this.Y;
}
CHeader.prototype.get_Level = function ()
{
    return this.level;
}
var _fakeHeaders = [
    new CHeader ({headerText: "Header1", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header2", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 2}),
    new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
    new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 4}),
    new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 5}),
    new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 6}),
    new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 7}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 8}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
    new CHeader ({headerText: "Header6", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
    new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0})
]

// CSearchResult - returns result of searching
function CSearchResult (obj)
{
    this.Object = obj;
}

CSearchResult.prototype.get_Text = function ()
{
    return this.Object.text;
}

CSearchResult.prototype.get_Navigator = function ()
{
    return this.Object.navigator;
}

CSearchResult.prototype.put_Navigator = function (obj)
{
    this.Object.navigator = obj;
}
CSearchResult.prototype.put_Text = function (obj)
{
    this.Object.text = obj;
}

// Object:
// {
//    Bottom :
//    {
//        Color : { r : 0, g : 0, b : 0 },
//        Value : border_Single,
//        Size  : 0.5 * g_dKoef_pt_to_mm
//        Space : 0
//    },
//    Left :
//    {
//        ....
//    }
//    Right :
//    {
//        ....
//    }
//    Top :
//    {
//        ....
//    }
//    },
//    Between :
//    {
//        ....
//    }
// }

function CParagraphBorders (obj)
{
    if (obj)
    {
        this.Left = (undefined != obj.Left && null != obj.Left) ? new CBorder (obj.Left) : null;
        this.Top = (undefined != obj.Top && null != obj.Top) ? new CBorder (obj.Top) : null;
        this.Right = (undefined != obj.Right && null != obj.Right) ? new CBorder (obj.Right) : null;
        this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new CBorder (obj.Bottom) : null;
        this.Between = (undefined != obj.Between && null != obj.Between) ? new CBorder (obj.Between) : null;
    }
    else
    {
        this.Left = null;
        this.Top = null;
        this.Right = null;
        this.Bottom = null;
        this.Between = null;
    }
}
CParagraphBorders.prototype.get_Left = function(){return this.Left; }
CParagraphBorders.prototype.put_Left = function(v){this.Left = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Top = function(){return this.Top; }
CParagraphBorders.prototype.put_Top = function(v){this.Top = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Right = function(){return this.Right; }
CParagraphBorders.prototype.put_Right = function(v){this.Right = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Bottom = function(){return this.Bottom; }
CParagraphBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new CBorder (v) : null;}
CParagraphBorders.prototype.get_Between = function(){return this.Between; }
CParagraphBorders.prototype.put_Between = function(v){this.Between = (v) ? new CBorder (v) : null;}


// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
function CBackground (obj)
{
    if (obj)
    {
        this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.Value = (undefined != obj.Value) ? obj.Value : null;

        if(obj.fill != null)
        {
            this.fill = obj.fill;
        }
        else
        {
            this.fill = new CAscFill();
            this.fill.type = FILL_TYPE_NOFILL;
        }
    }
    else
    {
        this.Color = new CColor(0, 0, 0);
        this.Value = 1;
        this.fill = new CAscFill();
        this.fill.type = FILL_TYPE_NOFILL;
    }
}
CBackground.prototype.get_Color = function (){return this.Color;}
CBackground.prototype.put_Color = function (v){this.Color = (v) ? new CColor (v.r, v.g, v.b): null;}
CBackground.prototype.get_Value = function (){return this.Value;}
CBackground.prototype.put_Value = function (v){this.Value = v;}
CBackground.prototype.get_fill = function (){return this.fill;}
CBackground.prototype.put_fill = function(v){this.fill = v;};

function CTablePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscHAnchor.Margin : obj.RelativeFrom;
        this.UseAlign     = ( true === obj.Align ) ? true : false;
        this.Align        = undefined;
        this.Value        = undefined;

        if ( true === this.UseAlign )
            this.Align    = ( undefined === obj.Value ) ? c_oAscXAlign.Left : obj.Value;
        else
            this.Value    = ( undefined === obj.Value ) ? 0 : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscHAnchor.Column;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionH.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CTablePositionH.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CTablePositionH.prototype.get_UseAlign = function()  { return this.UseAlign; }
CTablePositionH.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CTablePositionH.prototype.get_Align = function()  { return this.Align; }
CTablePositionH.prototype.put_Align = function(v) { this.Align = v; }
CTablePositionH.prototype.get_Value = function()  { return this.Value; }
CTablePositionH.prototype.put_Value = function(v) { this.Value = v; }

function CTablePositionV(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscVAnchor.Text : obj.RelativeFrom;
        this.UseAlign     = ( true === obj.Align ) ? true : false;
        this.Align        = undefined;
        this.Value        = undefined;

        if ( true === this.UseAlign )
            this.Align    = ( undefined === obj.Value ) ? c_oAscYAlign.Top : obj.Value;
        else
            this.Value    = ( undefined === obj.Value ) ? 0 : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscVAnchor.Text;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionV.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; }
CTablePositionV.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; }
CTablePositionV.prototype.get_UseAlign = function()  { return this.UseAlign; }
CTablePositionV.prototype.put_UseAlign = function(v) { this.UseAlign = v; }
CTablePositionV.prototype.get_Align = function()  { return this.Align; }
CTablePositionV.prototype.put_Align = function(v) { this.Align = v; }
CTablePositionV.prototype.get_Value = function()  { return this.Value; }
CTablePositionV.prototype.put_Value = function(v) { this.Value = v; }

function CTablePropLook(obj)
{
    this.FirstCol = undefined;
    this.FirstRow = undefined;
    this.LastCol  = undefined;
    this.LastRow  = undefined;
    this.BandHor  = undefined;
    this.BandVer  = undefined;

    if ( obj )
    {
        this.FirstCol = ( undefined === obj.FirstCol ? undefined : obj.FirstCol );
        this.FirstRow = ( undefined === obj.FirstRow ? undefined : obj.FirstRow );
        this.LastCol  = ( undefined === obj.LastCol  ? undefined : obj.LastCol );
        this.LastRow  = ( undefined === obj.LastRow  ? undefined : obj.LastRow );
        this.BandHor  = ( undefined === obj.HorBand  ? undefined : obj.HorBand );
        this.BandVer  = ( undefined === obj.VerBand  ? undefined : obj.VerBand );
    }
}

CTablePropLook.prototype.get_FirstCol = function() {return this.FirstCol;}
CTablePropLook.prototype.put_FirstCol = function(v) {this.FirstCol = v;}
CTablePropLook.prototype.get_FirstRow = function() {return this.FirstRow;}
CTablePropLook.prototype.put_FirstRow = function(v) {this.FirstRow = v;}
CTablePropLook.prototype.get_LastCol = function() {return this.LastCol;}
CTablePropLook.prototype.put_LastCol = function(v) {this.LastCol = v;}
CTablePropLook.prototype.get_LastRow = function() {return this.LastRow;}
CTablePropLook.prototype.put_LastRow = function(v) {this.LastRow = v;}
CTablePropLook.prototype.get_BandHor = function() {return this.BandHor;}
CTablePropLook.prototype.put_BandHor = function(v) {this.BandHor = v;}
CTablePropLook.prototype.get_BandVer = function() {return this.BandVer;}
CTablePropLook.prototype.put_BandVer = function(v) {this.BandVer = v;}

function CTableProp (tblProp)
{
    if (tblProp)
    {
        this.CanBeFlow = (undefined != tblProp.CanBeFlow ? tblProp.CanBeFlow : false );
        this.CellSelect = (undefined != tblProp.CellSelect ? tblProp.CellSelect : false );
        this.CellSelect = (undefined != tblProp.CellSelect) ? tblProp.CellSelect : false;
        this.TableWidth = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
        this.TableSpacing = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
        this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new CPaddings (tblProp.TableDefaultMargins) : null;

        this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins (tblProp.CellMargins) : null;

        this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
        this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
        this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

        this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new CPaddings (tblProp.TablePaddings) : null;

        this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders (tblProp.TableBorders) : null;
        this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders (tblProp.CellBorders) : null;
        this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground (tblProp.TableBackground) : null;
        this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground (tblProp.CellsBackground) : null;
        this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new CPosition (tblProp.Position) : null;
        this.PositionH = ( undefined != tblProp.PositionH && null != tblProp.PositionH ) ? new CTablePositionH(tblProp.PositionH) : undefined;
        this.PositionV = ( undefined != tblProp.PositionV && null != tblProp.PositionV ) ? new CTablePositionV(tblProp.PositionV) : undefined;
        this.Internal_Position = ( undefined != tblProp.Internal_Position ) ? tblProp.Internal_Position : undefined;

        this.ForSelectedCells = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
        this.TableStyle = (undefined != tblProp.TableStyle) ? tblProp.TableStyle : null;
        this.TableLook = (undefined != tblProp.TableLook) ? new CTablePropLook(tblProp.TableLook) : null;
        this.RowsInHeader = (undefined != tblProp.RowsInHeader) ? tblProp.RowsInHeader : 0;
        this.CellsVAlign = (undefined != tblProp.CellsVAlign) ? tblProp.CellsVAlign :c_oAscVertAlignJc.Top;
        this.Locked = (undefined != tblProp.Locked) ? tblProp.Locked : false;
    }
    else
    {
        //Все свойства класса CTableProp должны быть undefined если они не изменялись
        //this.CanBeFlow = false;
        this.CellSelect = false; //обязательное свойство
        /*this.TableWidth = null;
         this.TableSpacing = null;
         this.TableDefaultMargins = new CPaddings ();

         this.CellMargins = new CMargins ();

         this.TableAlignment = 0;
         this.TableIndent = 0;
         this.TableWrappingStyle = c_oAscWrapStyle.Inline;

         this.TablePaddings = new CPaddings ();

         this.TableBorders = new CBorders ();
         this.CellBorders = new CBorders ();
         this.TableBackground = new CBackground ();
         this.CellsBackground = new CBackground ();;
         this.Position = new CPosition ();
         this.ForSelectedCells = true;*/

        this.Locked = false;
    }
}

CTableProp.prototype.get_Width = function (){return this.TableWidth;}
CTableProp.prototype.put_Width = function (v){this.TableWidth = v;}
CTableProp.prototype.get_Spacing = function (){return this.TableSpacing;}
CTableProp.prototype.put_Spacing = function (v){this.TableSpacing = v;}
CTableProp.prototype.get_DefaultMargins = function (){return this.TableDefaultMargins;}
CTableProp.prototype.put_DefaultMargins = function (v){this.TableDefaultMargins = v;}
CTableProp.prototype.get_CellMargins = function (){return this.CellMargins;}
CTableProp.prototype.put_CellMargins = function (v){ this.CellMargins = v;}
CTableProp.prototype.get_TableAlignment = function (){return this.TableAlignment;}
CTableProp.prototype.put_TableAlignment = function (v){this.TableAlignment = v;}
CTableProp.prototype.get_TableIndent = function (){return this.TableIndent;}
CTableProp.prototype.put_TableIndent = function (v){this.TableIndent = v;}
CTableProp.prototype.get_TableWrap = function (){return this.TableWrappingStyle;}
CTableProp.prototype.put_TableWrap = function (v){this.TableWrappingStyle = v;}
CTableProp.prototype.get_TablePaddings = function (){return this.TablePaddings;}
CTableProp.prototype.put_TablePaddings = function (v){this.TablePaddings = v;}
CTableProp.prototype.get_TableBorders = function (){return this.TableBorders;}
CTableProp.prototype.put_TableBorders = function (v){this.TableBorders = v;}
CTableProp.prototype.get_CellBorders = function (){return this.CellBorders;}
CTableProp.prototype.put_CellBorders = function (v){this.CellBorders = v;}
CTableProp.prototype.get_TableBackground = function (){return this.TableBackground;}
CTableProp.prototype.put_TableBackground = function (v){this.TableBackground = v;}
CTableProp.prototype.get_CellsBackground = function (){return this.CellsBackground;}
CTableProp.prototype.put_CellsBackground = function (v){this.CellsBackground = v;}
CTableProp.prototype.get_Position = function (){return this.Position;}
CTableProp.prototype.put_Position = function (v){this.Position = v;}
CTableProp.prototype.get_PositionH = function(){return this.PositionH;}
CTableProp.prototype.put_PositionH = function(v){this.PositionH = v;}
CTableProp.prototype.get_PositionV = function(){return this.PositionV;}
CTableProp.prototype.put_PositionV = function(v){this.PositionV = v;}
CTableProp.prototype.get_Value_X = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; }
CTableProp.prototype.get_Value_Y = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; }
CTableProp.prototype.get_ForSelectedCells = function (){return this.ForSelectedCells;}
CTableProp.prototype.put_ForSelectedCells = function (v){this.ForSelectedCells = v;}
CTableProp.prototype.put_CellSelect = function(v){this.CellSelect = v;}
CTableProp.prototype.get_CellSelect = function(){return this.CellSelect};
CTableProp.prototype.get_CanBeFlow = function(){return this.CanBeFlow;}
CTableProp.prototype.get_RowsInHeader = function(){return this.RowsInHeader;};
CTableProp.prototype.put_RowsInHeader = function(v){this.RowsInHeader = v;};
CTableProp.prototype.get_Locked = function() { return this.Locked; }
CTableProp.prototype.get_CellsVAlign = function() { return this.CellsVAlign; }
CTableProp.prototype.put_CellsVAlign = function(v){ this.CellsVAlign = v; }
CTableProp.prototype.get_TableLook = function() {return this.TableLook;}
CTableProp.prototype.put_TableLook = function(v){this.TableLook = v;}
CTableProp.prototype.get_TableStyle = function() {return this.TableStyle;}
CTableProp.prototype.put_TableStyle = function(v){this.TableStyle = v;}

function CBorders (obj)
{
    if (obj)
    {
        this.Left = (undefined != obj.Left && null != obj.Left) ? new CBorder (obj.Left) : null;
        this.Top = (undefined != obj.Top && null != obj.Top) ? new CBorder (obj.Top) : null;
        this.Right = (undefined != obj.Right && null != obj.Right) ? new CBorder (obj.Right) : null;
        this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new CBorder (obj.Bottom) : null;
        this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new CBorder (obj.InsideH) : null;
        this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new CBorder (obj.InsideV) : null;
    }
    //Все свойства класса CBorders должны быть undefined если они не изменялись
    /*else
     {
     this.Left = null;
     this.Top = null;
     this.Right = null;
     this.Bottom = null;
     this.InsideH = null;
     this.InsideV = null;
     }*/
}
CBorders.prototype.get_Left = function(){return this.Left; }
CBorders.prototype.put_Left = function(v){this.Left = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Top = function(){return this.Top; }
CBorders.prototype.put_Top = function(v){this.Top = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Right = function(){return this.Right; }
CBorders.prototype.put_Right = function(v){this.Right = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Bottom = function(){return this.Bottom; }
CBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideH = function(){return this.InsideH; }
CBorders.prototype.put_InsideH = function(v){this.InsideH = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideV = function(){return this.InsideV; }
CBorders.prototype.put_InsideV = function(v){this.InsideV = (v) ? new CBorder (v) : null;}

function CBorder (obj)
{
    if (obj)
    {
        this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.Size = (undefined != obj.Size) ? obj.Size : null;
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Space = (undefined != obj.Space) ? obj.Space : null;
        this.fill = (undefined != obj.fill) ? obj.fill : null;
    }
    else
    {
        this.Color = new CColor (0,0,0);
        this.Size  = 0.5 * g_dKoef_pt_to_mm;
        this.Value = border_Single;
        this.Space = 0;
        this.fill = new CAscFill();
        this.fill.type = FILL_TYPE_NOFILL;
    }
}
CBorder.prototype.get_Color = function(){return this.Color; }
CBorder.prototype.put_Color = function(v){this.Color = new CColor (v.r, v.g, v.b);}
CBorder.prototype.get_Size = function(){return this.Size; }
CBorder.prototype.put_Size = function(v){this.Size = v;}
CBorder.prototype.get_Value = function(){return this.Value; }
CBorder.prototype.put_Value = function(v){this.Value = v;}
CBorder.prototype.get_Space = function(){return this.Space; }
CBorder.prototype.put_Space = function(v){this.Space = v;}
CBorder.prototype.get_ForSelectedCells = function(){return this.ForSelectedCells; }
CBorder.prototype.put_ForSelectedCells = function(v){this.ForSelectedCells = v;}

CBorder.prototype.put_Fill = function(v)
{
    this.unifill = v;
}

CBorder.prototype.get_Fill = function()
{
    return this.unifill;
}

CBorder.prototype.put_LnRef = function(v)
{
    this.llnRef = v;
}

CBorder.prototype.get_LnRef = function()
{
    return this.lnRef;
}

// CMargins
function CMargins (obj)
{
    if (obj)
    {
        this.Left = (undefined != obj.Left) ? obj.Left : null;
        this.Right = (undefined != obj.Right) ? obj.Right : null;
        this.Top = (undefined != obj.Top) ? obj.Top : null;
        this.Bottom = (undefined != obj.Bottom) ? obj.Bottom : null;
        this.Flag = (undefined != obj.Flag) ? obj.Flag : null;
    }
    else
    {
        this.Left = null;
        this.Right = null;
        this.Top = null;
        this.Bottom = null;
        this.Flag = null;
    }
}
CMargins.prototype.get_Left = function(){return this.Left; }
CMargins.prototype.put_Left = function(v){this.Left = v;}
CMargins.prototype.get_Right = function(){return this.Right; }
CMargins.prototype.put_Right = function(v){this.Right = v;}
CMargins.prototype.get_Top = function(){return this.Top; }
CMargins.prototype.put_Top = function(v){this.Top = v;}
CMargins.prototype.get_Bottom = function(){return this.Bottom; }
CMargins.prototype.put_Bottom = function(v){this.Bottom = v;}
CMargins.prototype.get_Flag = function(){return this.Flag; }
CMargins.prototype.put_Flag = function(v){this.Flag = v;}

// Возвращает
//{
// ParaPr :
// {
//    ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
//
//    Ind :
//    {
//        Left      : 0,                    // Левый отступ
//        Right     : 0,                    // Правый отступ
//        FirstLine : 0                     // Первая строка
//    },
//
//    Jc : align_Left,                      // Прилегание параграфа
//
//    KeepLines : false,                    // переносить параграф на новую страницу,
//                                          // если на текущей он целиком не убирается
//    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
//
//    PageBreakBefore : false,              // начинать параграф с новой страницы
//
//    Spacing :
//    {
//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
//        LineRule : linerule_Auto,         // Тип расстрояния между строками
//        Before   : 0,                     // Дополнительное расстояние до абзаца
//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
//    },
//
//    Shd :
//    {
//        Value : shd_Nil,
//        Color :
//        {
//            r : 255,
//            g : 255,
//            b : 255
//        }
//    },
//
//    WidowControl : true,                  // Запрет висячих строк
//
//    Tabs : []
// },
//
// TextPr :
// {
//    Bold       : false,
//    Italic     : false,
//    Underline  : false,
//    Strikeout  : false,
//    FontFamily :
//    {
//        Name  : "Times New Roman",
//        Index : -1
//    },
//    FontSize   : 12,
//    Color      :
//    {
//        r : 0,
//        g : 0,
//        b : 0
//    },
//    VertAlign : vertalign_Baseline,
//    HighLight : highlight_None
// }
//}

// Paragraph spacing properties
function CParagraphInd (obj)
{
    if (obj)
    {
        this.Left = (undefined != obj.Left) ? obj.Left : null;					// Левый отступ
        this.Right = (undefined != obj.Right) ? obj.Right : null;				// Правый отступ
        this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null;	// Первая строка
    }
    else
    {
        this.Left = 0;			// Левый отступ
        this.Right = 0;			// Правый отступ
        this.FirstLine = 0;		// Первая строка
    }
}
CParagraphInd.prototype.get_Left = function () { return this.Left; }
CParagraphInd.prototype.put_Left = function (v) { this.Left = v; }
CParagraphInd.prototype.get_Right = function () { return this.Right; }
CParagraphInd.prototype.put_Right = function (v) { this.Right = v; }
CParagraphInd.prototype.get_FirstLine = function () { return this.FirstLine; }
CParagraphInd.prototype.put_FirstLine = function (v) { this.FirstLine = v; }


// Paragraph spacing properties
function CParagraphSpacing (obj)
{
    if (obj)
    {
        this.Line = (undefined != obj.Line) ? obj.Line : null;				// Расстояние между строками внутри абзаца
        this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null;	// Тип расстрояния между строками
        this.Before = (undefined != obj.Before) ? obj.Before : null;		// Дополнительное расстояние до абзаца
        this.After = (undefined != obj.After) ? obj.After : null;			// Дополнительное расстояние после абзаца
    }
    else
    {
        this.Line = 1.15;					// Расстояние между строками внутри абзаца
        this.LineRule = linerule_Auto;		// Тип расстрояния между строками
        this.Before = 0;					// Дополнительное расстояние до абзаца
        this.After = 10 * g_dKoef_pt_to_mm;	// Дополнительное расстояние после абзаца
    }
}
CParagraphSpacing.prototype.get_Line = function ()
{
    return this.Line;
}
CParagraphSpacing.prototype.get_LineRule = function ()
{
    return this.LineRule;
}
CParagraphSpacing.prototype.get_Before = function ()
{
    return this.Before;
}
CParagraphSpacing.prototype.get_After = function ()
{
    return this.After;
}

// Paragraph shd properties
function CParagraphShd (obj)
{
    if (obj)
    {
        this.Value = (undefined != obj.Value) ? obj.Value : null;
        this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor ( obj.Color.r, obj.Color.g, obj.Color.b ) : null;
    }
    else
    {
        this.Value = shd_Nil;
        this.Color = new CColor (255, 255, 255);
    }
}
CParagraphShd.prototype.get_Value = function (){ return this.Value; }
CParagraphShd.prototype.put_Value = function (v){ this.Value = v; }
CParagraphShd.prototype.get_Color = function (){ return this.Color; }
CParagraphShd.prototype.put_Color = function (v){ this.Color = (v) ? new CColor (v.r, v.g, v.b): null; }

function CParagraphProp (obj)
{
    if (obj)
    {
        this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
        this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new CParagraphInd (obj.Ind) : null;
        this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
        this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
        this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
        this.Brd = (undefined != obj.Brd && null != obj.Brd) ? new CParagraphBorders (obj.Brd) : null;
        this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new CParagraphShd (obj.Shd) : null;
    }
    else
    {
        //ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
        //
        //    Ind :
        //    {
        //        Left      : 0,                    // Левый отступ
        //        Right     : 0,                    // Правый отступ
        //        FirstLine : 0                     // Первая строка
        //    },
        //
        //    Jc : align_Left,                      // Прилегание параграфа
        //
        //    KeepLines : false,                    // переносить параграф на новую страницу,
        //                                          // если на текущей он целиком не убирается
        //    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
        //
        //    PageBreakBefore : false,              // начинать параграф с новой страницы

        this.ContextualSpacing = false;
        this.Ind = new CParagraphInd ();
        this.KeepLines = false;
        this.PageBreakBefore = false;
        this.Spacing = new CParagraphSpacing ();
        this.Brd = null;
        this.Shd = null;
    }
}

CParagraphProp.prototype.get_ContextualSpacing = function () { return this.ContextualSpacing; }
CParagraphProp.prototype.put_ContextualSpacing = function (v) { this.ContextualSpacing = v; }
CParagraphProp.prototype.get_Ind = function () { return this.Ind; }
CParagraphProp.prototype.put_Ind = function (v) { this.Ind = v; }
CParagraphProp.prototype.get_KeepLines = function () { return this.KeepLines; }
CParagraphProp.prototype.put_KeepLines = function (v) { this.KeepLines = v; }
CParagraphProp.prototype.get_PageBreakBefore = function (){ return this.PageBreakBefore; }
CParagraphProp.prototype.put_PageBreakBefore = function (v){ this.PageBreakBefore = v; }
CParagraphProp.prototype.get_Spacing = function () { return this.Spacing; }
CParagraphProp.prototype.put_Spacing = function (v) { this.Spacing = v; }
CParagraphProp.prototype.get_Borders = function () { return this.Brd; }
CParagraphProp.prototype.put_Borders = function (v) { this.Brd = v; }
CParagraphProp.prototype.get_Shade = function () { return this.Shd; }
CParagraphProp.prototype.put_Shade = function (v) { this.Shd = v; }

// Paragraph properties
function CParagraphPropEx (obj)
{
    if (obj)
    {
        this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
        this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new CParagraphInd (obj.Ind) : null;
        this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
        this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
        this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
        this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
        this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
        this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new CParagraphShd (obj.Shd) : null;
        this.WidowControl = (undefined != obj.WidowControl) ? obj.WidowControl : null;                  // Запрет висячих строк
        this.Tabs = obj.Tabs;
    }
    else
    {
        //ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
        //
        //    Ind :
        //    {
        //        Left      : 0,                    // Левый отступ
        //        Right     : 0,                    // Правый отступ
        //        FirstLine : 0                     // Первая строка
        //    },
        //
        //    Jc : align_Left,                      // Прилегание параграфа
        //
        //    KeepLines : false,                    // переносить параграф на новую страницу,
        //                                          // если на текущей он целиком не убирается
        //    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
        //
        //    PageBreakBefore : false,              // начинать параграф с новой страницы
        this.ContextualSpacing = false;
        this.Ind = new CParagraphInd ();
        this.Jc = align_Left;
        this.KeepLines = false;
        this.KeepNext = false;
        this.PageBreakBefore = false;
        this.Spacing = new CParagraphSpacing ();
        this.Shd = new CParagraphShd ();
        this.WidowControl = true;                  // Запрет висячих строк
        this.Tabs = null;
    }
}
CParagraphPropEx.prototype.get_ContextualSpacing = function ()
{
    return this.ContextualSpacing;
}
CParagraphPropEx.prototype.get_Ind = function ()
{
    return this.Ind;
}
CParagraphPropEx.prototype.get_Jc = function ()
{
    return this.Jc;
}
CParagraphPropEx.prototype.get_KeepLines = function ()
{
    return this.KeepLines;
}
CParagraphPropEx.prototype.get_KeepNext = function ()
{
    return this.KeepNext;
}
CParagraphPropEx.prototype.get_PageBreakBefore = function ()
{
    return this.PageBreakBefore;
}
CParagraphPropEx.prototype.get_Spacing = function ()
{
    return this.Spacing;
}
CParagraphPropEx.prototype.get_Shd = function ()
{
    return this.Shd;
}
CParagraphPropEx.prototype.get_WidowControl = function ()
{
    return this.WidowControl;
}
CParagraphPropEx.prototype.get_Tabs = function ()
{
    return this.Tabs;
}

// Text properties
// TextPr :
// {
//    Bold       : false,
//    Italic     : false,
//    Underline  : false,
//    Strikeout  : false,
//    FontFamily :
//    {
//        Name  : "Times New Roman",
//        Index : -1
//    },
//    FontSize   : 12,
//    Color      :
//    {
//        r : 0,
//        g : 0,
//        b : 0
//    },
//    VertAlign : vertalign_Baseline,
//    HighLight : highlight_None
// }
function CTextFontFamily (obj)
{
    if (obj)
    {
        this.Name = (undefined != obj.Name) ? obj.Name : null; 		// "Times New Roman"
        this.Index = (undefined != obj.Index) ? obj.Index : null;	// -1
    }
    else
    {
        this.Name = "Times New Roman";
        this.Index = -1;
    }
}
CTextFontFamily.prototype.get_Name = function ()
{
    return this.Name;
}
CTextFontFamily.prototype.get_Index = function ()
{
    return this.Index;
}
// CTextProp
function CTextProp (obj)
{
    if (obj)
    {
        this.Bold = (undefined != obj.Bold) ? obj.Bold : null;
        this.Italic = (undefined != obj.Italic) ? obj.Italic : null;
        this.Underline = (undefined != obj.Underline) ? obj.Underline : null;
        this.Strikeout = (undefined != obj.Strikeout) ? obj.Strikeout : null;
        this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new CTextFontFamily (obj.FontFamily) : null;
        this.FontSize = (undefined != obj.FontSize) ? obj.FontSize : null;
        this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.VertAlign = (undefined != obj.VertAlign) ? obj.VertAlign : null;
        this.HighLight = (undefined != obj.HighLight) ? obj.HighLight == highlight_None ? obj.HighLight : new CColor (obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
    }
    else
    {
        //    Bold       : false,
        //    Italic     : false,
        //    Underline  : false,
        //    Strikeout  : false,
        //    FontFamily :
        //    {
        //        Name  : "Times New Roman",
        //        Index : -1
        //    },
        //    FontSize   : 12,
        //    Color      :
        //    {
        //        r : 0,
        //        g : 0,
        //        b : 0
        //    },
        //    VertAlign : vertalign_Baseline,
        //    HighLight : highlight_None
        this.Bold = false;
        this.Italic = false;
        this.Underline = false;
        this.Strikeout = false;
        this.FontFamily = new CFontFamily ();
        this.FontSize = 12;
        this.Color = new CColor ();
        this.VertAlign = vertalign_Baseline;
        this.HighLight =highlight_None;
    }
}
CTextProp.prototype.get_Bold = function ()
{
    return this.Bold;
}
CTextProp.prototype.get_Italic = function ()
{
    return this.Italic;
}
CTextProp.prototype.get_Underline = function ()
{
    return this.Underline;
}
CTextProp.prototype.get_Strikeout = function ()
{
    return this.Strikeout;
}
CTextProp.prototype.get_FontFamily = function ()
{
    return this.FontFamily;
}
CTextProp.prototype.get_FontSize = function ()
{
    return this.FontSize;
}
CTextProp.prototype.get_Color = function ()
{
    return this.Color;
}
CTextProp.prototype.get_VertAlign = function ()
{
    return this.VertAlign;
}
CTextProp.prototype.get_HighLight = function ()
{
    return this.HighLight;
}

// paragraph and text properties objects container
function CParagraphAndTextProp (paragraphProp, textProp)
{
    this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx (paragraphProp) : null;
    this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp (textProp) : null;
}
CParagraphAndTextProp.prototype.get_ParaPr = function ()
{
    return this.ParaPr;
}
CParagraphAndTextProp.prototype.get_TextPr = function ()
{
    return this.TextPr;
}

function CHyperlinkProperty( obj )
{
    if( obj )
    {
        this.Text    = (undefined != obj.Text   ) ? obj.Text    : null;
        this.Value   = (undefined != obj.Value  ) ? obj.Value   : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : null;
    }
    else
    {
        this.Text    = null;
        this.Value   = "";
        this.ToolTip = null;
    }
}

CHyperlinkProperty.prototype.get_Value   = function()  { return this.Value; }
CHyperlinkProperty.prototype.put_Value   = function(v) { this.Value = v; }
CHyperlinkProperty.prototype.get_ToolTip = function()  { return this.ToolTip; }
CHyperlinkProperty.prototype.put_ToolTip = function(v) { this.ToolTip = v; }
CHyperlinkProperty.prototype.get_Text    = function()  { return this.Text; }
CHyperlinkProperty.prototype.put_Text    = function(v) { this.Text = v; }

//-----------------------------------------------------------------
// События движения мыши
//-----------------------------------------------------------------
function CMouseMoveData( obj )
{
    if( obj )
    {
        this.Type  = ( undefined != obj.Type ) ? obj.Type : c_oAscMouseMoveDataTypes.Common;
        this.X_abs = ( undefined != obj.X_abs ) ? obj.X_abs : 0;
        this.Y_abs = ( undefined != obj.Y_abs ) ? obj.Y_abs : 0;

        switch ( this.Type )
        {
            case c_oAscMouseMoveDataTypes.Hyperlink :
            {
                this.Hyperlink = ( undefined != obj.PageNum ) ? obj.PageNum : 0;
                break;
            }

            case c_oAscMouseMoveDataTypes.LockedObject :
            {
                this.UserId           = ( undefined != obj.UserId ) ? obj.UserId : "";
                this.HaveChanges      = ( undefined != obj.HaveChanges ) ? obj.HaveChanges : false;
                this.LockedObjectType = ( undefined != obj.LockedObjectType ) ? obj.LockedObjectType : c_oAscMouseMoveLockedObjectType.Common;
                break;
            }
        }
    }
    else
    {
        this.Type  = c_oAscMouseMoveDataTypes.Common;
        this.X_abs = 0;
        this.Y_abs = 0;
    }
}

CMouseMoveData.prototype.get_Type  = function()  { return this.Type; }
CMouseMoveData.prototype.get_X = function()  { return this.X_abs; }
CMouseMoveData.prototype.get_Y = function()  { return this.Y_abs; }
CMouseMoveData.prototype.get_Hyperlink = function()  { return this.Hyperlink; }
CMouseMoveData.prototype.get_UserId = function() { return this.UserId; };
CMouseMoveData.prototype.get_HaveChanges = function() { return this.HaveChanges; };
CMouseMoveData.prototype.get_LockedObjectType = function() { return this.LockedObjectType; };

function CAscTableStyle()
{
    this.Id     = "";
    this.Type   = 0;
    this.Image  = "";
}
CAscTableStyle.prototype.get_Id = function(){ return this.Id; }
CAscTableStyle.prototype.get_Image = function(){ return this.Image; }
CAscTableStyle.prototype.get_Type = function(){ return this.Type; }