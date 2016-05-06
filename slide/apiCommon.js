"use strict";

// ---------------------------------------------------------------

function CAscSlideTiming()
{
    this.TransitionType     = undefined;
    this.TransitionOption   = undefined;
    this.TransitionDuration = undefined;

    this.SlideAdvanceOnMouseClick   = undefined;
    this.SlideAdvanceAfter          = undefined;
    this.SlideAdvanceDuration       = undefined;
}

CAscSlideTiming.prototype.put_TransitionType = function(v) { this.TransitionType = v; }
CAscSlideTiming.prototype.get_TransitionType = function() { return this.TransitionType; }
CAscSlideTiming.prototype.put_TransitionOption = function(v) { this.TransitionOption = v; }
CAscSlideTiming.prototype.get_TransitionOption = function() { return this.TransitionOption; }
CAscSlideTiming.prototype.put_TransitionDuration = function(v) { this.TransitionDuration = v; }
CAscSlideTiming.prototype.get_TransitionDuration = function() { return this.TransitionDuration; }

CAscSlideTiming.prototype.put_SlideAdvanceOnMouseClick = function(v) { this.SlideAdvanceOnMouseClick = v; }
CAscSlideTiming.prototype.get_SlideAdvanceOnMouseClick = function() { return this.SlideAdvanceOnMouseClick; }
CAscSlideTiming.prototype.put_SlideAdvanceAfter = function(v) { this.SlideAdvanceAfter = v; }
CAscSlideTiming.prototype.get_SlideAdvanceAfter = function() { return this.SlideAdvanceAfter; }
CAscSlideTiming.prototype.put_SlideAdvanceDuration = function(v) { this.SlideAdvanceDuration = v; }
CAscSlideTiming.prototype.get_SlideAdvanceDuration = function() { return this.SlideAdvanceDuration; }

CAscSlideTiming.prototype.applyProps = function(v)
{
    if (undefined !== v.TransitionType && null !== v.TransitionType)
        this.TransitionType = v.TransitionType;
    if (undefined !== v.TransitionOption && null !== v.TransitionOption)
        this.TransitionOption = v.TransitionOption;
    if (undefined !== v.TransitionDuration && null !== v.TransitionDuration)
        this.TransitionDuration = v.TransitionDuration;

    if (undefined !== v.SlideAdvanceOnMouseClick && null !== v.SlideAdvanceOnMouseClick)
        this.SlideAdvanceOnMouseClick = v.SlideAdvanceOnMouseClick;
    if (undefined !== v.SlideAdvanceAfter && null !== v.SlideAdvanceAfter)
        this.SlideAdvanceAfter = v.SlideAdvanceAfter;
    if (undefined !== v.SlideAdvanceDuration && null !== v.SlideAdvanceDuration)
        this.SlideAdvanceDuration = v.SlideAdvanceDuration;
}

CAscSlideTiming.prototype.createDuplicate = function(v)
{
    var _slideT = new CAscSlideTiming();

    _slideT.TransitionType     = this.TransitionType;
    _slideT.TransitionOption   = this.TransitionOption;
    _slideT.TransitionDuration = this.TransitionDuration;

    _slideT.SlideAdvanceOnMouseClick   = this.SlideAdvanceOnMouseClick;
    _slideT.SlideAdvanceAfter          = this.SlideAdvanceAfter;
    _slideT.SlideAdvanceDuration       = this.SlideAdvanceDuration;

    return _slideT;
}

CAscSlideTiming.prototype.makeDuplicate = function(_slideT)
{
    if (!_slideT)
        return;

    _slideT.TransitionType     = this.TransitionType;
    _slideT.TransitionOption   = this.TransitionOption;
    _slideT.TransitionDuration = this.TransitionDuration;

    _slideT.SlideAdvanceOnMouseClick   = this.SlideAdvanceOnMouseClick;
    _slideT.SlideAdvanceAfter          = this.SlideAdvanceAfter;
    _slideT.SlideAdvanceDuration       = this.SlideAdvanceDuration;
}

CAscSlideTiming.prototype.setUndefinedOptions = function()
{
    this.TransitionType     = undefined;
    this.TransitionOption   = undefined;
    this.TransitionDuration = undefined;

    this.SlideAdvanceOnMouseClick   = undefined;
    this.SlideAdvanceAfter          = undefined;
    this.SlideAdvanceDuration       = undefined;
}

CAscSlideTiming.prototype.setDefaultParams = function()
{
    this.TransitionType     = c_oAscSlideTransitionTypes.None;
    this.TransitionOption   = -1;
    this.TransitionDuration = 2000;

    this.SlideAdvanceOnMouseClick   = true;
    this.SlideAdvanceAfter          = false;
    this.SlideAdvanceDuration       = 10000;
}

CAscSlideTiming.prototype.Write_ToBinary = function(w)
{
    w.WriteBool(AscFormat.isRealNumber(this.TransitionType));
    if(AscFormat.isRealNumber(this.TransitionType))
        w.WriteLong(this.TransitionType);

    w.WriteBool(AscFormat.isRealNumber(this.TransitionOption));
    if(AscFormat.isRealNumber(this.TransitionOption))
        w.WriteLong(this.TransitionOption);

    w.WriteBool(AscFormat.isRealNumber(this.TransitionDuration));
    if(AscFormat.isRealNumber(this.TransitionDuration))
        w.WriteLong(this.TransitionDuration);


    w.WriteBool(AscFormat.isRealBool(this.SlideAdvanceOnMouseClick));
    if(AscFormat.isRealBool(this.SlideAdvanceOnMouseClick))
        w.WriteBool(this.SlideAdvanceOnMouseClick);

    w.WriteBool(AscFormat.isRealBool(this.SlideAdvanceAfter));
    if(AscFormat.isRealBool(this.SlideAdvanceAfter))
        w.WriteBool(this.SlideAdvanceAfter);

    w.WriteBool(AscFormat.isRealNumber(this.SlideAdvanceDuration));
    if(AscFormat.isRealNumber(this.SlideAdvanceDuration))
        w.WriteLong(this.SlideAdvanceDuration);
};

CAscSlideTiming.prototype.Read_FromBinary = function(r)
{

    if(r.GetBool())
        this.TransitionType = r.GetLong();

    if(r.GetBool())
        this.TransitionOption = r.GetLong();


    if(r.GetBool())
        this.TransitionDuration = r.GetLong();


    if(r.GetBool())
        this.SlideAdvanceOnMouseClick = r.GetBool();


    if(r.GetBool())
        this.SlideAdvanceAfter = r.GetBool();

    if(r.GetBool())
        this.SlideAdvanceDuration = r.GetLong();
};

// ---------------------------------------------------------------



// ---------------------------------------------------------------

function CAscSlideProps()
{
    this.Background = null;
    this.Timing = null;
    this.lockDelete = null;
    this.lockLayout = null;
    this.lockTiming = null;
    this.lockBackground = null;
    this.lockTranzition = null;
    this.lockRemove = null;
}

CAscSlideProps.prototype.get_background = function(){return this.Background;}
CAscSlideProps.prototype.put_background = function(v){this.Background = v;}
CAscSlideProps.prototype.get_timing = function(){return this.Timing;}
CAscSlideProps.prototype.put_timing = function(v){this.Timing = v;}
CAscSlideProps.prototype.get_LockDelete = function(){return this.lockDelete;}
CAscSlideProps.prototype.put_LockDelete = function(v){this.lockDelete = v;}
CAscSlideProps.prototype.get_LockLayout = function(){return this.lockLayout;}
CAscSlideProps.prototype.put_LockLayout = function(v){this.lockLayout = v;}
CAscSlideProps.prototype.get_LockTiming = function(){return this.lockTiming;}
CAscSlideProps.prototype.put_LockTiming = function(v){this.lockTiming = v;}
CAscSlideProps.prototype.get_LockBackground = function(){return this.lockBackground;}
CAscSlideProps.prototype.put_LockBackground = function(v){this.lockBackground = v;}
CAscSlideProps.prototype.get_LockTranzition = function(){return this.lockTranzition;}
CAscSlideProps.prototype.put_LockTranzition = function(v){this.lockTranzition = v;}
CAscSlideProps.prototype.get_LockRemove = function(){return this.lockRemove;}
CAscSlideProps.prototype.put_LockRemove = function(v){this.lockRemove = v;}

// ---------------------------------------------------------------


// ---------------------------------------------------------------

// информация о темах --------------------------------------------

function CAscThemeInfo(themeInfo)
{
    this.ThemeInfo = themeInfo;
    this.Index = -1000;
}
CAscThemeInfo.prototype.get_Name = function() { return this.ThemeInfo.Name; };
CAscThemeInfo.prototype.get_Url = function() { return this.ThemeInfo.Url; };
CAscThemeInfo.prototype.get_Image = function() { return this.ThemeInfo.Thumbnail; };
CAscThemeInfo.prototype.get_Index = function() { return this.Index; };

function CAscThemes()
{
    this.EditorThemes = [];
    this.DocumentThemes = [];

    var _count = AscCommon._presentation_editor_themes.length;
    for (var i = 0; i < _count; i++)
    {
        this.EditorThemes[i] = new CAscThemeInfo(AscCommon._presentation_editor_themes[i]);
        this.EditorThemes[i].Index = i;
    }
}
CAscThemes.prototype.get_EditorThemes = function(){ return this.EditorThemes; };
CAscThemes.prototype.get_DocumentThemes = function(){ return this.DocumentThemes; };

// ---------------------------------------------------------------

function CAscChartProp( obj )
{
    if( obj )
    {

        this.Width         = (undefined != obj.w) ? obj.w : undefined;
        this.Height        = (undefined != obj.h) ? obj.h : undefined;
        this.Position      = new Asc.CPosition({X: obj.x, Y: obj.y});

        this.Locked        = (undefined != obj.locked) ? obj.locked : false;

        this.ChartProperties = (undefined != obj.chartProps) ? obj.chartProps : null;

        this.severalCharts = obj.severalCharts != undefined ? obj.severalCharts : false;
        this.severalChartTypes = obj.severalChartTypes != undefined ? obj.severalChartTypes : undefined;
        this.severalChartStyles = obj.severalChartStyles != undefined ? obj.severalChartStyles : undefined;
    }
    else
    {
        this.Width         = undefined;
        this.Height        = undefined;
        this.Position      = undefined;
        this.Locked   = false;

        this.ChartProperties = new AscCommon.asc_ChartSettings();

        this.severalCharts = false;
        this.severalChartTypes = undefined;
        this.severalChartStyles = undefined;
    }
}
CAscChartProp.prototype.get_ChangeLevel = function() { return this.ChangeLevel; };
CAscChartProp.prototype.put_ChangeLevel = function(v) { this.ChangeLevel = v; };

CAscChartProp.prototype.get_CanBeFlow = function() { return this.CanBeFlow; }
CAscChartProp.prototype.get_Width = function() { return this.Width; }
CAscChartProp.prototype.put_Width = function(v) { this.Width = v; }
CAscChartProp.prototype.get_Height = function() { return this.Height; }
CAscChartProp.prototype.put_Height = function(v) { this.Height = v; }
CAscChartProp.prototype.get_WrappingStyle = function() { return this.WrappingStyle; }
CAscChartProp.prototype.put_WrappingStyle = function(v) { this.WrappingStyle = v; }
// Возвращается объект класса Asc.asc_CPaddings
CAscChartProp.prototype.get_Paddings = function() { return this.Paddings; }
// Аргумент объект класса Asc.asc_CPaddings
CAscChartProp.prototype.put_Paddings = function(v) { this.Paddings = v; }
CAscChartProp.prototype.get_AllowOverlap = function() {return this.AllowOverlap;}
CAscChartProp.prototype.put_AllowOverlap = function(v) {this.AllowOverlap = v;}
// Возвращается объект класса CPosition
CAscChartProp.prototype.get_Position = function() { return this.Position; }
// Аргумент объект класса CPosition
CAscChartProp.prototype.put_Position = function(v) { this.Position = v; }
CAscChartProp.prototype.get_PositionH = function()  { return this.PositionH; }
CAscChartProp.prototype.put_PositionH = function(v) { this.PositionH = v; }
CAscChartProp.prototype.get_PositionV = function()  { return this.PositionV; }
CAscChartProp.prototype.put_PositionV = function(v) { this.PositionV = v; }
CAscChartProp.prototype.get_Value_X = function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; }
CAscChartProp.prototype.get_Value_Y = function(RelativeFrom) { if ( null != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; }

CAscChartProp.prototype.get_ImageUrl = function() { return this.ImageUrl; }
CAscChartProp.prototype.put_ImageUrl = function(v) { this.ImageUrl = v; }
CAscChartProp.prototype.get_Group = function() { return this.Group; }
CAscChartProp.prototype.put_Group = function(v) { this.Group = v; }
CAscChartProp.prototype.asc_getFromGroup = function() { return this.fromGroup; }
CAscChartProp.prototype.asc_putFromGroup = function(v) { this.fromGroup = v; }

CAscChartProp.prototype.get_isChartProps = function() { return this.isChartProps; }
CAscChartProp.prototype.put_isChartPross = function(v) { this.isChartProps = v; }


CAscChartProp.prototype.get_SeveralCharts = function() { return this.severalCharts; }
CAscChartProp.prototype.put_SeveralCharts = function(v) { this.severalCharts = v; }
CAscChartProp.prototype.get_SeveralChartTypes = function() { return this.severalChartTypes; }
CAscChartProp.prototype.put_SeveralChartTypes = function(v) { this.severalChartTypes = v; }

CAscChartProp.prototype.get_SeveralChartStyles = function() { return this.severalChartStyles; }
CAscChartProp.prototype.put_SeveralChartStyles = function(v) { this.severalChartStyles = v; }

CAscChartProp.prototype.get_VerticalTextAlign = function() { return this.verticalTextAlign; };
CAscChartProp.prototype.put_VerticalTextAlign = function(v) { this.verticalTextAlign = v; };


CAscChartProp.prototype.get_Locked = function() { return this.Locked; }

CAscChartProp.prototype.get_ChartProperties = function()
{
    return this.ChartProperties;
};

CAscChartProp.prototype.put_ChartProperties = function(v)
{
    this.ChartProperties = v;
};

CAscChartProp.prototype.get_ShapeProperties = function()
{
    return this.ShapeProperties;
};

CAscChartProp.prototype.put_ShapeProperties = function(v)
{
    this.ShapeProperties = v;
};


CAscChartProp.prototype.asc_getType = function()
{
    return this.ChartProperties.asc_getType();
};
CAscChartProp.prototype.asc_getSubType = function()
{
    return this.ChartProperties.asc_getSubType();
};

CAscChartProp.prototype.asc_getStyleId = function()
{
    return this.ChartProperties.asc_getStyleId();
};

CAscChartProp.prototype.asc_getHeight = function()
{
    return this.Height;
}
CAscChartProp.prototype.asc_getWidth = function()
{
    return this.Width;
}

CAscChartProp.prototype.asc_setType = function(v)
{
    this.ChartProperties.asc_setType(v);
};
CAscChartProp.prototype.asc_setSubType = function(v)
{
    this.ChartProperties.asc_setSubType(v);
};

CAscChartProp.prototype.asc_setStyleId = function(v)
{
    this.ChartProperties.asc_setStyleId(v);
};

CAscChartProp.prototype.asc_setHeight = function(v)
{
    this.Height = v;
}
CAscChartProp.prototype.asc_setWidth = function(v)
{
    this.Width = v;
}

CAscChartProp.prototype.getType = function()
{
    return this.ChartProperties && this.ChartProperties.getType();
}

CAscChartProp.prototype.putType = function(v)
{
    return this.ChartProperties && this.ChartProperties.putType(v);
}


CAscChartProp.prototype.getStyle = function()
{
    return this.ChartProperties && this.ChartProperties.getStyle();
}

CAscChartProp.prototype.putStyle = function(v)
{
    return this.ChartProperties && this.ChartProperties.putStyle(v);
}

CAscChartProp.prototype.changeType = function(v)
{
    return this.ChartProperties && this.ChartProperties.changeType(v);
}

function CLayoutThumbnail()
{
    this.Index = 0;
    this.Name = "";
    this.Type = 15;
    this.Image = "";

    this.Width = 0;
    this.Height = 0;
}

CLayoutThumbnail.prototype.getIndex = function() { return this.Index; }
CLayoutThumbnail.prototype.getType = function() { return this.Type; }
CLayoutThumbnail.prototype.get_Image = function() { return this.Image; }
CLayoutThumbnail.prototype.get_Name = function() { return this.Name; }
CLayoutThumbnail.prototype.get_Width = function() { return this.Width; }
CLayoutThumbnail.prototype.get_Height = function() { return this.Height; }

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



// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
function CBackground (obj)
{
    if (obj)
    {
        this.Color = (undefined != obj.Color && null != obj.Color) ? AscCommon.CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.Value = (undefined != obj.Value) ? obj.Value : null;
    }
    else
    {
        this.Color = AscCommon.CreateAscColorCustom(0, 0, 0);
        this.Value = 1;
    }
}
CBackground.prototype.get_Color = function (){return this.Color;}
CBackground.prototype.put_Color = function (v){this.Color = (v) ? v: null;}
CBackground.prototype.get_Value = function (){return this.Value;}
CBackground.prototype.put_Value = function (v){this.Value = v;}

function CTablePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscHAnchor.Margin : obj.RelativeFrom;
        this.UseAlign     = ( true === obj.Align ) ? true : false;
        this.Align        = undefined;
        this.Value        = undefined;

        if ( true === this.UseAlign )
            this.Align    = ( undefined === obj.Value ) ? Asc.c_oAscXAlign.Left : obj.Value;
        else
            this.Value    = ( undefined === obj.Value ) ? 0 : obj.Value;
    }
    else
    {
        this.RelativeFrom = Asc.c_oAscHAnchor.Column;
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
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscVAnchor.Text : obj.RelativeFrom;
        this.UseAlign     = ( true === obj.Align ) ? true : false;
        this.Align        = undefined;
        this.Value        = undefined;

        if ( true === this.UseAlign )
            this.Align    = ( undefined === obj.Value ) ? Asc.c_oAscYAlign.Top : obj.Value;
        else
            this.Value    = ( undefined === obj.Value ) ? 0 : obj.Value;
    }
    else
    {
        this.RelativeFrom = Asc.c_oAscVAnchor.Text;
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
    this.FirstCol = false;
    this.FirstRow = false;
    this.LastCol  = false;
    this.LastRow  = false;
    this.BandHor  = false;
    this.BandVer  = false;

    if ( obj )
    {
        this.FirstCol = ( undefined === obj.m_bFirst_Col ? false : obj.m_bFirst_Col );
        this.FirstRow = ( undefined === obj.m_bFirst_Row ? false : obj.m_bFirst_Row );
        this.LastCol  = ( undefined === obj.m_bLast_Col  ? false : obj.m_bLast_Col );
        this.LastRow  = ( undefined === obj.m_bLast_Row  ? false : obj.m_bLast_Row );
        this.BandHor  = ( undefined === obj.m_bBand_Hor  ? false : obj.m_bBand_Hor );
        this.BandVer  = ( undefined === obj.m_bBand_Ver  ? false : obj.m_bBand_Ver );
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
        this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new Asc.asc_CPaddings (tblProp.TableDefaultMargins) : null;

        this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins (tblProp.CellMargins) : null;

        this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
        this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
        this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

        this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new Asc.asc_CPaddings (tblProp.TablePaddings) : null;

        this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders (tblProp.TableBorders) : null;
        this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders (tblProp.CellBorders) : null;
        this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground (tblProp.TableBackground) : null;
        this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground (tblProp.CellsBackground) : null;
        this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new Asc.CPosition (tblProp.Position) : null;
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
         this.TableDefaultMargins = new Asc.asc_CPaddings ();

         this.CellMargins = new CMargins ();

         this.TableAlignment = 0;
         this.TableIndent = 0;
         this.TableWrappingStyle = c_oAscWrapStyle.Inline;

         this.TablePaddings = new Asc.asc_CPaddings ();

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
        this.Left = (undefined != obj.Left && null != obj.Left) ? new Asc.asc_CTextBorder (obj.Left) : null;
        this.Top = (undefined != obj.Top && null != obj.Top) ? new Asc.asc_CTextBorder (obj.Top) : null;
        this.Right = (undefined != obj.Right && null != obj.Right) ? new Asc.asc_CTextBorder (obj.Right) : null;
        this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new Asc.asc_CTextBorder (obj.Bottom) : null;
        this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new Asc.asc_CTextBorder (obj.InsideH) : null;
        this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new Asc.asc_CTextBorder (obj.InsideV) : null;
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
CBorders.prototype.put_Left = function(v){this.Left = (v) ? new Asc.asc_CTextBorder (v) : null;}
CBorders.prototype.get_Top = function(){return this.Top; }
CBorders.prototype.put_Top = function(v){this.Top = (v) ? new Asc.asc_CTextBorder (v) : null;}
CBorders.prototype.get_Right = function(){return this.Right; }
CBorders.prototype.put_Right = function(v){this.Right = (v) ? new Asc.asc_CTextBorder (v) : null;}
CBorders.prototype.get_Bottom = function(){return this.Bottom; }
CBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new Asc.asc_CTextBorder (v) : null;}
CBorders.prototype.get_InsideH = function(){return this.InsideH; }
CBorders.prototype.put_InsideH = function(v){this.InsideH = (v) ? new Asc.asc_CTextBorder (v) : null;}
CBorders.prototype.get_InsideV = function(){return this.InsideV; }
CBorders.prototype.put_InsideV = function(v){this.InsideV = (v) ? new Asc.asc_CTextBorder (v) : null;}



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






// Paragraph properties
function CParagraphPropEx (obj)
{
    if (obj)
    {
        this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
        this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new Asc.asc_CParagraphInd(obj.Ind) : null;
        this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
        this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
        this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
        this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
        this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new AscCommon.asc_CParagraphSpacing(obj.Spacing) : null;
        this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new Asc.asc_CParagraphShd(obj.Shd) : null;
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
        this.Ind = new Asc.asc_CParagraphInd();
        this.Jc = AscCommon.align_Left;
        this.KeepLines = false;
        this.KeepNext = false;
        this.PageBreakBefore = false;
        this.Spacing = new AscCommon.asc_CParagraphSpacing();
        this.Shd = new Asc.asc_CParagraphShd();
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

// CTextProp
function CTextProp (obj)
{
    if (obj)
    {
        this.Bold = (undefined != obj.Bold) ? obj.Bold : null;
        this.Italic = (undefined != obj.Italic) ? obj.Italic : null;
        this.Underline = (undefined != obj.Underline) ? obj.Underline : null;
        this.Strikeout = (undefined != obj.Strikeout) ? obj.Strikeout : null;
        this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new AscCommon.asc_CTextFontFamily (obj.FontFamily) : null;
        this.FontSize = (undefined != obj.FontSize) ? obj.FontSize : null;
        this.Color = (undefined != obj.Color && null != obj.Color) ? new AscCommon.CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
        this.VertAlign = (undefined != obj.VertAlign) ? obj.VertAlign : null;
        this.HighLight = (undefined != obj.HighLight) ? obj.HighLight == AscCommonWord.highlight_None ? obj.HighLight : new AscCommon.CColor (obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
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
        this.Color = new AscCommon.CColor ();
        this.VertAlign = AscCommon.vertalign_Baseline;
        this.HighLight =AscCommonWord.highlight_None;
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


function CAscTableStyle()
{
    this.Id     = "";
    this.Type   = 0;
    this.Image  = "";
}
CAscTableStyle.prototype.get_Id = function(){ return this.Id; }
CAscTableStyle.prototype.get_Image = function(){ return this.Image; }
CAscTableStyle.prototype.get_Type = function(){ return this.Type; }

//------------------------------------------------------------export----------------------------------------------------
CAscThemeInfo.prototype['get_Name'] = CAscThemeInfo.prototype.get_Name;
CAscThemeInfo.prototype['get_Url'] = CAscThemeInfo.prototype.get_Url;
CAscThemeInfo.prototype['get_Image'] = CAscThemeInfo.prototype.get_Image;
CAscThemeInfo.prototype['get_Index'] = CAscThemeInfo.prototype.get_Index;

CAscTableStyle.prototype['get_Id'] = CAscTableStyle.prototype.get_Id;
CAscTableStyle.prototype['get_Image'] = CAscTableStyle.prototype.get_Image;
CAscTableStyle.prototype['get_Type'] = CAscTableStyle.prototype.get_Type;
