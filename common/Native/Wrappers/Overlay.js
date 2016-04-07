function CAutoshapeTrack()
{
    this.IsTrack            = true;

    this.PageIndex          = -1;
    this.CurrentPageInfo    = null;

    this.Native = window["native"]["CreateAutoShapesTrackControl"]();
}

CAutoshapeTrack.prototype =
{
    SetFont : function(font)
    {
    },
    init2 : function()
    {
    },
    
    CorrectOverlayBounds : function()
    {
        this.Native["DD_CorrectOverlayBounds"]();
    },

    SetCurrentPage : function(nPageIndex)
    {
        //if (nPageIndex == this.PageIndex)
        //    return;

        this.PageIndex = nPageIndex;
        this.Native["DD_SetCurrentPage"](nPageIndex);
    },
    
    SetPageIndexSimple : function(nPageIndex)
    {
        this.Native["DD_SetPageIndexSimple"](nPageIndex);
    },
    
    transform3 : function(m)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty);
    },
    
    reset : function()
    {
        this.Native["PD_reset"]();
    },

    /*************************************************************************/
    /******************************** TRACKS *********************************/
    /*************************************************************************/
    DrawTrack : function(type, matrix, left, top, width, height, isLine, isCanRotate)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawTrack"](type, left, top, width, height, isLine, isCanRotate);
    },

    DrawTrackSelectShapes : function(x, y, w, h)
    {
        this.Native["DD_DrawTrackSelectShapes"](x, y, w, h);
    },

    DrawAdjustment : function(matrix, x, y)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawAdjustment"](x, y);
    },

    DrawEditWrapPointsPolygon : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsPolygon"](points);
    },

    DrawEditWrapPointsTrackLines : function(points, matrix)
    {
        if (!matrix)
            this.Native["DD_DrawTrackTransform"]();
        else
            this.Native["DD_DrawTrackTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);

        this.Native["DD_DrawEditWrapPointsTrackLines"](points);
    },

    DrawInlineMoveCursor : function(x, y, h, m)
    {
        if (!m)
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h);
        }
        else
        {
            this.Native["DD_DrawInlineMoveCursor"](this.PageIndex, x, y, h, m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
        }
    },

    drawFlowAnchor : function(x, y)
    {
        this.Native["PD_drawFlowAnchor"](x, y);
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
        this.Native["PD_DrawPresentationComment"](type, x, y, w, h);
    },
    
    // repeat drawing interface
    put_GlobalAlpha : function(enable, alpha)
    {
        this.Native["PD_put_GlobalAlpha"](enable, alpha);
    },
    Start_GlobalAlpha : function()
    {
        // nothing
    },
    End_GlobalAlpha : function()
    {
        this.Native["PD_End_GlobalAlpha"]();
    },
    // pen methods
    p_color : function(r,g,b,a)
    {
        this.Native["PD_p_color"](r,g,b,a);
    },
    p_width : function(w)
    {
        this.Native["PD_p_width"](w);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        this.Native["PD_b_color1"](r,g,b,a);
    },
    b_color2 : function(r,g,b,a)
    {
        this.Native["PD_b_color2"](r,g,b,a);
    },

    transform : function(sx,shy,shx,sy,tx,ty)
    {
        this.Native["PD_transform"](sx,shy,shx,sy,tx,ty);
    },
    // path commands
    _s : function()
    {
        this.Native["PD_PathStart"]();
    },
    _e : function()
    {
        this.Native["PD_PathEnd"]();
    },
    _z : function()
    {
        this.Native["PD_PathClose"]();
    },
    _m : function(x,y)
    {
        this.Native["PD_PathMoveTo"](x,y);
    },
    _l : function(x,y)
    {
        this.Native["PD_PathLineTo"](x,y);
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        this.Native["PD_PathCurveTo"](x1,y1,x2,y2,x3,y3);
    },
    _c2 : function(x1,y1,x2,y2)
    {
        this.Native["PD_PathCurveTo2"](x1,y1,x2,y2);
    },
    ds : function()
    {
        this.Native["PD_Stroke"]();
    },
    df : function()
    {
        this.Native["PD_Fill"]();
    },

    // canvas state
    save : function()
    {
        this.Native["PD_Save"]();
    },
    restore : function()
    {
        this.Native["PD_Restore"]();
    },
    clip : function()
    {
        this.Native["PD_clip"]();
    },

    reset : function()
    {
        this.Native["PD_reset"]();
    },

    transform3 : function(m, isNeedInvert)
    {
        this.Native["PD_transform3"](m.sx,m.shy,m.shx,m.sy,m.tx,m.ty,isNeedInvert);
    },

    FreeFont : function()
    {
    },

    // images
    drawImage : function(img,x,y,w,h,alpha,srcRect)
    {
        if (!srcRect)
            return this.Native["PD_drawImage"](img,x,y,w,h,alpha);

        return this.Native["PD_drawImage"](img,x,y,w,h,alpha,srcRect.l,srcRect.t,srcRect.r,srcRect.b);
    },

    // text
    GetFont : function()
    {
    },
    font : function(font_id,font_size)
    {
    },
    SetFont : function(font)
    {
    },

    SetTextPr : function(textPr, theme)
    {
    },
    GetTextPr : function()
    {
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
    },

    FillText : function(x,y,text)
    {
    },
    t : function(text,x,y)
    {
    },
    FillText2 : function(x,y,text,cropX,cropW)
    {
    },
    t2 : function(text,x,y,cropX,cropW)
    {
    },
    FillTextCode : function(x,y,lUnicode)
    {
    },
    tg : function(text,x,y)
    {
    },
    charspace : function(space)
    {
    },

    SetIntegerGrid : function(param)
    {
        //this.Native["PD_SetIntegerGrid"](param);
    },
    GetIntegerGrid : function()
    {
        //return this.m_bIntegerGrid;
        return false;
    },

    DrawHeaderEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawHeaderEdit"](yPos, lock_type);
    },

    DrawFooterEdit : function(yPos, lock_type)
    {
        this.Native["PD_DrawFooterEdit"](yPos, lock_type);
    },

    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        this.Native["PD_DrawLockParagraph"](lock_type, x, y1, y2);
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        this.Native["PD_DrawLockObjectRect"](lock_type, x, y, w, h);
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        this.Native["PD_DrawEmptyTableLine"](x1,y1,x2,y2);
    },

    DrawSpellingLine : function(y0, x0, x1, w)
    {
        this.Native["PD_DrawSpellingLine"](y0, x0, x1, w);
    },

    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine"](align, y, x, r, penW);
    },
    drawHorLine2 : function(align, y, x, r, penW)
    {
        this.Native["PD_drawHorLine2"](align, y, x, r, penW);
    },
    drawVerLine : function(align, x, y, b, penW)
    {
        this.Native["PD_drawVerLine"](align, x, y, b, penW);
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        this.Native["PD_drawHorLineExt"](align, y, x, r, penW, leftMW, rightMW);
    },

    rect : function(x,y,w,h)
    {
        this.Native["PD_rect"](x,y,w,h);
    },

    TableRect : function(x,y,w,h)
    {
        this.Native["PD_TableRect"](x,y,w,h);
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        this.Native["PD_AddClipRect"](x,y,w,h);
    },
    RemoveClipRect : function()
    {
        // nothing
    },

    SetClip : function(r)
    {
        this.Native["PD_SetClip"](r.x, r.y, r.w, r.h);
    },

    RemoveClip : function()
    {
        this.Native["PD_RemoveClip"]();
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
        this.Native["PD_drawCollaborativeChanges"](x, y, w, h);
    },

    drawSearchResult : function(x, y, w, h)
    {
        this.Native["PD_drawSearchResult"](x, y, w, h);
    },

    SavePen : function()
    {
        this.Native["PD_SavePen"]();
    },
    RestorePen : function()
    {
        this.Native["PD_RestorePen"]();
    },

    SaveBrush : function()
    {
        this.Native["PD_SaveBrush"]();
    },
    RestoreBrush : function()
    {
        this.Native["PD_RestoreBrush"]();
    },

    SavePenBrush : function()
    {
        this.Native["PD_SavePenBrush"]();
    },
    RestorePenBrush : function()
    {
        this.Native["PD_RestorePenBrush"]();
    },

    SaveGrState : function()
    {
        this.Native["PD_SaveGrState"]();
    },
    RestoreGrState : function()
    {
        this.Native["PD_RestoreGrState"]();
    },

    StartClipPath : function()
    {
        this.Native["PD_StartClipPath"]();
    },

    EndClipPath : function()
    {
        this.Native["PD_EndClipPath"]();
    },

    StartCheckTableDraw : function()
    {
        return this.Native["PD_StartCheckTableDraw"]();
    },

    EndCheckTableDraw : function(bIsRestore)
    {
        return this.Native["PD_EndCheckTableDraw"](bIsRestore);
    },

    SetTextClipRect : function(_l, _t, _r, _b)
    {
        return this.Native["PD_SetTextClipRect"](_l, _t, _r, _b);
    },

    AddSmartRect : function(x, y, w, h, pen_w)
    {
        return this.Native["PD_AddSmartRect"](x, y, w, h, pen_w);
    },

    Drawing_StartCheckBounds : function(x, y, w, h)
    {

    },

    Drawing_EndCheckBounds : function()
    {

    }
};

// EditorSettings
var g_oStandartColors = [
    {R: 0xC0, G: 0x00, B: 0x00},
    {R: 0xFF, G: 0x00, B: 0x00},
    {R: 0xFF, G: 0xC0, B: 0x00},
    {R: 0xFF, G: 0xFF, B: 0x00},
    {R: 0x92, G: 0xD0, B: 0x50},
    {R: 0x00, G: 0xB0, B: 0x50},
    {R: 0x00, G: 0xB0, B: 0xF0},
    {R: 0x00, G: 0x70, B: 0xC0},
    {R: 0x00, G: 0x20, B: 0x60},
    {R: 0x70, G: 0x30, B: 0xA0}
];

var g_oThemeColorsDefaultModsWord = [
    [
        { name : "wordShade", val : 0xF2 },
        { name : "wordShade", val : 0xD9 },
        { name : "wordShade", val : 0xBF },
        { name : "wordShade", val : 0xA6 },
        { name : "wordShade", val : 0x80 }
    ],
    [
        { name : "wordShade", val : 0xE6 },
        { name : "wordShade", val : 0xBF },
        { name : "wordShade", val : 0x80 },
        { name : "wordShade", val : 0x40 },
        { name : "wordShade", val : 0x1A }
    ],
    [
        { name : "wordTint", val : 0x33 },
        { name : "wordTint", val : 0x66 },
        { name : "wordTint", val : 0x99 },
        { name : "wordShade", val : 0xBF },
        { name : "wordShade", val : 0x80 }
    ],
    [
        { name : "wordTint", val : 0x1A },
        { name : "wordTint", val : 0x40 },
        { name : "wordTint", val : 0x80 },
        { name : "wordTint", val : 0xBF },
        { name : "wordTint", val : 0xE6 }
    ],
    [
        { name : "wordTint", val : 0x80 },
        { name : "wordTint", val : 0xA6 },
        { name : "wordTint", val : 0xBF },
        { name : "wordTint", val : 0xD9 },
        { name : "wordTint", val : 0xF2 }
    ]
];

var g_oThemeColorsDefaultModsPowerPoint = [
    [
        { lumMod : 95000, lumOff : -1 },
        { lumMod : 85000, lumOff : -1 },
        { lumMod : 75000, lumOff : -1 },
        { lumMod : 65000, lumOff : -1 },
        { lumMod : 50000, lumOff : -1 }
    ],
    [
        { lumMod : 90000, lumOff : -1 },
        { lumMod : 75000, lumOff : -1 },
        { lumMod : 50000, lumOff : -1 },
        { lumMod : 25000, lumOff : -1 },
        { lumMod : 10000, lumOff : -1 }
    ],
    [
        { lumMod : 20000, lumOff : 80000 },
        { lumMod : 40000, lumOff : 60000 },
        { lumMod : 60000, lumOff : 40000 },
        { lumMod : 75000, lumOff : -1 },
        { lumMod : 50000, lumOff : -1 }
    ],
    [
        { lumMod : 10000, lumOff : 90000 },
        { lumMod : 25000, lumOff : 75000 },
        { lumMod : 50000, lumOff : 50000 },
        { lumMod : 75000, lumOff : 25000 },
        { lumMod : 90000, lumOff : 10000 }
    ],
    [
        { lumMod : 50000, lumOff : 50000 },
        { lumMod : 65000, lumOff : 35000 },
        { lumMod : 75000, lumOff : 25000 },
        { lumMod : 85000, lumOff : 15000 },
        { lumMod : 90000, lumOff : 5000 }
    ]
];

/* 0..4 */
function GetDefaultColorModsIndex(r, g, b)
{
    var L = (Math.max(r, Math.max(g, b)) + Math.min(r, Math.min(g, b))) / 2;
    L /= 255;
    if (L == 1)
        return 0;
    if (L >= 0.8)
        return 1;
    if (L >= 0.2)
        return 2;
    if (L > 0)
        return 3;
    return 4;
}

/* 0 - ppt, 1 - word, 2 - excel */
function GetDefaultMods(r, g, b, pos, editor_id)
{
    if (pos < 1 || pos > 5)
        return [];

    var index = GetDefaultColorModsIndex(r, g, b);

    if (editor_id == 0)
    {
        var _obj = g_oThemeColorsDefaultModsPowerPoint[index][pos - 1];
        var _mods = [];
        var _mod = null;

        if (_obj.lumMod != -1)
        {
            _mod = {};
            _mod["name"] = "lumMod";
            _mod["val"] = _obj.lumMod;
            _mods.push(_mod);
        }
        if (_obj.lumOff != -1)
        {
            _mod = {};
            _mod["name"] = "lumOff";
            _mod["val"] = _obj.lumOff;
            _mods.push(_mod);
        }

        return _mods;
    }
    if (editor_id == 1)
    {
        var _obj = g_oThemeColorsDefaultModsWord[index][pos - 1];
        var _mods = [];

        var _mod = {};
        _mod["name"] = _obj.name;
        _mod["val"] = _obj.val /** 100000 / 255) >> 0*/;
        _mods.push(_mod);

        return _mods;
    }
    // TODO: excel
    return [];
}

var g_oUserColorScheme = [];
g_oUserColorScheme[0] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 31, G: 73, B: 125},
    lt2:	{R: 238, G: 236, B: 225},
    accent1:	{R: 79, G: 129, B: 189},
    accent2:	{R: 192, G: 80, B: 77},
    accent3:	{R: 155, G: 187, B: 89},
    accent4:	{R: 128, G: 100, B: 162},
    accent5:	{R: 75, G: 172, B: 198},
    accent6:	{R: 247, G: 150, B: 70},
    hlink:	{R: 0, G: 0, B: 255},
    folHlink:	{R: 128, G: 0, B: 128},
    name:	"Office"
};

g_oUserColorScheme[1] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 0, G: 0, B: 0},
    lt2:	{R: 248, G: 248, B: 248},
    accent1:	{R: 221, G: 221, B: 221},
    accent2:	{R: 178, G: 178, B: 178},
    accent3:	{R: 150, G: 150, B: 150},
    accent4:	{R: 128, G: 128, B: 128},
    accent5:	{R: 95, G: 95, B: 95},
    accent6:	{R: 77, G: 77, B: 77},
    hlink:	{R: 95, G: 95, B: 95},
    folHlink:	{R: 145, G: 145, B: 145},
    name:	"Grayscale"
};

g_oUserColorScheme[2] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 105, G: 103, B: 109},
    lt2:	{R: 201, G: 194, B: 209},
    accent1:	{R: 206, G: 185, B: 102},
    accent2:	{R: 156, G: 176, B: 132},
    accent3:	{R: 107, G: 177, B: 201},
    accent4:	{R: 101, G: 133, B: 207},
    accent5:	{R: 126, G: 107, B: 201},
    accent6:	{R: 163, G: 121, B: 187},
    hlink:	{R: 65, G: 0, B: 130},
    folHlink:	{R: 147, G: 41, B: 104},
    name:	"Apex"
};

g_oUserColorScheme[3] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 50, G: 50, B: 50},
    lt2:	{R: 227, G: 222, B: 209},
    accent1:	{R: 240, G: 127, B: 9},
    accent2:	{R: 159, G: 41, B: 54},
    accent3:	{R: 27, G: 88, B: 124},
    accent4:	{R: 78, G: 133, B: 66},
    accent5:	{R: 96, G: 72, B: 120},
    accent6:	{R: 193, G: 152, B: 89},
    hlink:	{R: 107, G: 159, B: 37},
    folHlink:	{R: 178, G: 107, B: 2},
    name:	"Aspect"
};

g_oUserColorScheme[4] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 100, G: 107, B: 134},
    lt2:	{R: 197, G: 209, B: 215},
    accent1:	{R: 209, G: 99, B: 73},
    accent2:	{R: 204, G: 180, B: 0},
    accent3:	{R: 140, G: 173, B: 174},
    accent4:	{R: 140, G: 123, B: 112},
    accent5:	{R: 143, G: 176, B: 140},
    accent6:	{R: 209, G: 144, B: 73},
    hlink:	{R: 0, G: 163, B: 214},
    folHlink:	{R: 105, G: 79, B: 7},
    name:	"Civic"
};

g_oUserColorScheme[5] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 70, G: 70, B: 70},
    lt2:	{R: 222, G: 245, B: 250},
    accent1:	{R: 45, G: 162, B: 191},
    accent2:	{R: 218, G: 31, B: 40},
    accent3:	{R: 235, G: 100, B: 27},
    accent4:	{R: 57, G: 99, B: 157},
    accent5:	{R: 71, G: 75, B: 120},
    accent6:	{R: 125, G: 60, B: 74},
    hlink:	{R: 255, G: 129, B: 25},
    folHlink:	{R: 68, G: 185, B: 232},
    name:	"Concourse"
};

g_oUserColorScheme[6] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 105, G: 100, B: 100},
    lt2:	{R: 233, G: 229, B: 220},
    accent1:	{R: 211, G: 72, B: 23},
    accent2:	{R: 155, G: 45, B: 31},
    accent3:	{R: 162, G: 142, B: 106},
    accent4:	{R: 149, G: 98, B: 81},
    accent5:	{R: 145, G: 132, B: 133},
    accent6:	{R: 133, G: 93, B: 93},
    hlink:	{R: 204, G: 153, B: 0},
    folHlink:	{R: 150, G: 169, B: 169},
    name:	"Equity"
};

g_oUserColorScheme[7] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 4, G: 97, B: 123},
    lt2:	{R: 219, G: 245, B: 249},
    accent1:	{R: 15, G: 111, B: 198},
    accent2:	{R: 0, G: 157, B: 217},
    accent3:	{R: 11, G: 208, B: 217},
    accent4:	{R: 16, G: 207, B: 155},
    accent5:	{R: 124, G: 202, B: 98},
    accent6:	{R: 165, G: 194, B: 73},
    hlink:	{R: 244, G: 145, B: 0},
    folHlink:	{R: 133, G: 223, B: 208},
    name:	"Flow"
};

g_oUserColorScheme[8] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 103, G: 106, B: 85},
    lt2:	{R: 234, G: 235, B: 222},
    accent1:	{R: 114, G: 163, B: 118},
    accent2:	{R: 176, G: 204, B: 176},
    accent3:	{R: 168, G: 205, B: 215},
    accent4:	{R: 192, G: 190, B: 175},
    accent5:	{R: 206, G: 197, B: 151},
    accent6:	{R: 232, G: 183, B: 183},
    hlink:	{R: 219, G: 83, B: 83},
    folHlink:	{R: 144, G: 54, B: 56},
    name:	"Foundry"
};

g_oUserColorScheme[9] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 119, G: 95, B: 85},
    lt2:	{R: 235, G: 221, B: 195},
    accent1:	{R: 148, G: 182, B: 210},
    accent2:	{R: 221, G: 128, B: 71},
    accent3:	{R: 165, G: 171, B: 129},
    accent4:	{R: 216, G: 178, B: 92},
    accent5:	{R: 123, G: 167, B: 157},
    accent6:	{R: 150, G: 140, B: 140},
    hlink:	{R: 247, G: 182, B: 21},
    folHlink:	{R: 112, G: 68, B: 4},
    name:	"Median"
};

g_oUserColorScheme[10] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 78, G: 91, B: 111},
    lt2:	{R: 214, G: 236, B: 255},
    accent1:	{R: 127, G: 209, B: 59},
    accent2:	{R: 234, G: 21, B: 122},
    accent3:	{R: 254, G: 184, B: 10},
    accent4:	{R: 0, G: 173, B: 220},
    accent5:	{R: 115, G: 138, B: 200},
    accent6:	{R: 26, G: 179, B: 159},
    hlink:	{R: 235, G: 136, B: 3},
    folHlink:	{R: 95, G: 119, B: 145},
    name:	"Metro"
};

g_oUserColorScheme[11] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 90, G: 99, B: 120},
    lt2:	{R: 212, G: 212, B: 214},
    accent1:	{R: 240, G: 173, B: 0},
    accent2:	{R: 96, G: 181, B: 204},
    accent3:	{R: 230, G: 108, B: 125},
    accent4:	{R: 107, G: 183, B: 109},
    accent5:	{R: 232, G: 134, B: 81},
    accent6:	{R: 198, G: 72, B: 71},
    hlink:	{R: 22, G: 139, B: 186},
    folHlink:	{R: 104, G: 0, B: 0},
    name:	"Module"
};

g_oUserColorScheme[12] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 177, G: 63, B: 154},
    lt2:	{R: 244, G: 231, B: 237},
    accent1:	{R: 184, G: 61, B: 104},
    accent2:	{R: 172, G: 102, B: 187},
    accent3:	{R: 222, G: 108, B: 54},
    accent4:	{R: 249, G: 182, B: 57},
    accent5:	{R: 207, G: 109, B: 164},
    accent6:	{R: 250, G: 141, B: 61},
    hlink:	{R: 255, G: 222, B: 102},
    folHlink:	{R: 212, G: 144, B: 197},
    name:	"Opulent"
};

g_oUserColorScheme[13] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 87, G: 95, B: 109},
    lt2:	{R: 255, G: 243, B: 157},
    accent1:	{R: 254, G: 134, B: 55},
    accent2:	{R: 117, G: 152, B: 217},
    accent3:	{R: 179, G: 44, B: 22},
    accent4:	{R: 245, G: 205, B: 45},
    accent5:	{R: 174, G: 186, B: 213},
    accent6:	{R: 119, G: 124, B: 132},
    hlink:	{R: 210, G: 97, B: 28},
    folHlink:	{R: 59, G: 67, B: 91},
    name:	"Oriel"
};

g_oUserColorScheme[14] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 70, G: 70, B: 83},
    lt2:	{R: 221, G: 233, B: 236},
    accent1:	{R: 114, G: 124, B: 163},
    accent2:	{R: 159, G: 184, B: 205},
    accent3:	{R: 210, G: 218, B: 122},
    accent4:	{R: 250, G: 218, B: 122},
    accent5:	{R: 184, G: 132, B: 114},
    accent6:	{R: 142, G: 115, B: 106},
    hlink:	{R: 178, G: 146, B: 202},
    folHlink:	{R: 107, G: 86, B: 128},
    name:	"Origin"
};

g_oUserColorScheme[15] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 68, G: 77, B: 38},
    lt2:	{R: 254, G: 250, B: 201},
    accent1:	{R: 165, G: 181, B: 146},
    accent2:	{R: 243, G: 164, B: 71},
    accent3:	{R: 231, G: 188, B: 41},
    accent4:	{R: 208, G: 146, B: 167},
    accent5:	{R: 156, G: 133, B: 192},
    accent6:	{R: 128, G: 158, B: 194},
    hlink:	{R: 142, G: 88, B: 182},
    folHlink:	{R: 127, G: 111, B: 111},
    name:	"Paper"
};

g_oUserColorScheme[16] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 79, G: 39, B: 28},
    lt2:	{R: 231, G: 222, B: 201},
    accent1:	{R: 56, G: 145, B: 167},
    accent2:	{R: 254, G: 184, B: 10},
    accent3:	{R: 195, G: 45, B: 46},
    accent4:	{R: 132, G: 170, B: 51},
    accent5:	{R: 150, G: 67, B: 5},
    accent6:	{R: 71, G: 90, B: 141},
    hlink:	{R: 141, G: 199, B: 101},
    folHlink:	{R: 170, G: 138, B: 20},
    name:	"Solstice"
};

g_oUserColorScheme[17] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 59, G: 59, B: 59},
    lt2:	{R: 212, G: 210, B: 208},
    accent1:	{R: 110, G: 160, B: 176},
    accent2:	{R: 204, G: 175, B: 10},
    accent3:	{R: 141, G: 137, B: 164},
    accent4:	{R: 116, G: 133, B: 96},
    accent5:	{R: 158, G: 146, B: 115},
    accent6:	{R: 126, G: 132, B: 141},
    hlink:	{R: 0, G: 200, B: 195},
    folHlink:	{R: 161, G: 22, B: 224},
    name:	"Technic"
};

g_oUserColorScheme[18] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 78, G: 59, B: 48},
    lt2:	{R: 251, G: 238, B: 201},
    accent1:	{R: 240, G: 162, B: 46},
    accent2:	{R: 165, G: 100, B: 78},
    accent3:	{R: 181, G: 139, B: 128},
    accent4:	{R: 195, G: 152, B: 109},
    accent5:	{R: 161, G: 149, B: 116},
    accent6:	{R: 193, G: 117, B: 41},
    hlink:	{R: 173, G: 31, B: 31},
    folHlink:	{R: 255, G: 196, B: 47},
    name:	"Trek"
};

g_oUserColorScheme[19] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 66, G: 68, B: 86},
    lt2:	{R: 222, G: 222, B: 222},
    accent1:	{R: 83, G: 84, B: 138},
    accent2:	{R: 67, G: 128, B: 134},
    accent3:	{R: 160, G: 77, B: 163},
    accent4:	{R: 196, G: 101, B: 45},
    accent5:	{R: 139, G: 93, B: 61},
    accent6:	{R: 92, G: 146, B: 181},
    hlink:	{R: 103, G: 175, B: 189},
    folHlink:	{R: 194, G: 168, B: 116},
    name:	"Urban"
};

g_oUserColorScheme[20] = {
    dk1:	{R: 0, G: 0, B: 0},
    lt1:	{R: 255, G: 255, B: 255},
    dk2:	{R: 102, G: 102, B: 102},
    lt2:	{R: 210, G: 210, B: 210},
    accent1:	{R: 255, G: 56, B: 140},
    accent2:	{R: 228, G: 0, B: 89},
    accent3:	{R: 156, G: 0, B: 127},
    accent4:	{R: 104, G: 0, B: 127},
    accent5:	{R: 0, G: 91, B: 211},
    accent6:	{R: 0, G: 52, B: 158},
    hlink:	{R: 23, G: 187, B: 253},
    folHlink:	{R: 255, G: 121, B: 194},
    name:	"Verve"
};


var g_oUserTexturePresets = [];