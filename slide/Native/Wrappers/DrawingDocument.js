"use strict";

var g_fontManager = new CFontManager();
g_fontManager.Initialize(true);

var TRACK_CIRCLE_RADIUS     = 5;
var TRACK_RECT_SIZE2        = 4;
var TRACK_RECT_SIZE         = 8;
var TRACK_DISTANCE_ROTATE   = 25;
var TRACK_ADJUSTMENT_SIZE   = 10;

var FOCUS_OBJECT_THUMBNAILS     = 0;
var FOCUS_OBJECT_MAIN           = 1;
var FOCUS_OBJECT_NOTES          = 2;

var COMMENT_WIDTH   = 18;
var COMMENT_HEIGHT  = 16;

function CTableMarkup(Table)
{
    this.Internal =
    {
        RowIndex  : 0,
        CellIndex : 0,
        PageNum   : 0
    };
    this.Table = Table;
    this.X = 0; // Смещение таблицы от начала страницы до первой колонки

    this.Cols    = []; // массив ширин колонок
    this.Margins = []; // массив левых и правых маргинов

    this.Rows    = []; // массив позиций, высот строк(для данной страницы)
    // Rows = [ { Y : , H :  }, ... ]

    this.CurCol = 0; // текущая колонка
    this.CurRow = 0; // текущая строка

    this.TransformX = 0;
    this.TransformY = 0;
}

CTableMarkup.prototype =
{
    CreateDublicate : function()
    {
        var obj = new CTableMarkup(this.Table);

        obj.Internal = { RowIndex : this.Internal.RowIndex, CellIndex : this.Internal.CellIndex, PageNum : this.Internal.PageNum };
        obj.X = this.X;

        var len = this.Cols.length;
        for (var i = 0; i < len; i++)
            obj.Cols[i] = this.Cols[i];

        len = this.Margins.length;
        for (var i = 0; i < len; i++)
            obj.Margins[i] = { Left : this.Margins[i].Left, Right : this.Margins[i].Right };

        len = this.Rows.length;
        for (var i = 0; i < len; i++)
            obj.Rows[i] = { Y : this.Rows[i].Y, H : this.Rows[i].H };

        obj.CurRow = this.CurRow;
        obj.CurCol = this.CurCol;

        return obj;
    },

    CorrectFrom : function()
    {
        this.X += this.TransformX;

        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++)
        {
            this.Rows[i].Y += this.TransformY;
        }
    },

    CorrectTo : function()
    {
        this.X -= this.TransformX;

        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++)
        {
            this.Rows[i].Y -= this.TransformY;
        }
    },

    Get_X : function()
    {
        return this.X;
    },

    Get_Y : function()
    {
        var _Y = 0;
        if (this.Rows.length > 0)
        {
            _Y = this.Rows[0].Y;
        }
        return _Y;
    }
};

function CTableOutline(Table, PageNum, X, Y, W, H)
{
    this.Table = Table;
    this.PageNum = PageNum;

    this.X = X;
    this.Y = Y;

    this.W = W;
    this.H = H;
}



function _rect()
{
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
}

function CDrawingPage()
{
    this.left   = 0;
    this.top    = 0;
    this.right  = 0;
    this.bottom = 0;

    this.cachedImage = null;
}

function CDrawingDocument()
{
    this.IsLockObjectsEnable = false;

    this.m_oWordControl     = null;
    this.m_oLogicDocument   = null;

    this.SlidesCount        = 0;
    this.IsEmptyPresentation = false;

    this.SlideCurrent       = -1;

    this.Native = window["native"];

    this.m_sLockedCursorType = "";

    this.UpdateTargetFromPaint = false;
    this.TextMatrix = null;

    this.CanvasHitContext = CreateHitControl();

    this.TargetCursorColor = {R: 0, G: 0, B: 0};


    this.AutoShapesTrack = new CAutoshapeTrack();

    this.RenderPage = function(nPageIndex)
    {
        var _graphics = new CDrawingStream();
        this.m_oWordControl.m_oLogicDocument.DrawPage(nPageIndex, _graphics);
    }

    this.AfterLoad = function()
    {
        this.m_oWordControl = this;
        this.Api = window.editor;
        this.m_oApi = this.Api;
        this.m_oApi.DocumentUrl = "";
        this.LogicDocument = window.editor.WordControl.m_oLogicDocument;
        this.LogicDocument.DrawingDocument = this;
    }
    this.Start_CollaborationEditing = function()
    {
        this.Native["DD_Start_CollaborationEditing"]();
    }

    this.IsMobileVersion = function()
    {
        return true;
    }

    this.ConvertCoordsToAnotherPage = function(x, y)
    {
        return {X: x, Y: y};
    };

    this.SetCursorType = function(sType, Data)
    {
        var sResultCursorType = sType;
        if ("" == this.m_sLockedCursorType)
        {
            if (this.m_oWordControl.m_oApi.isPaintFormat && (("default" == sType) || ("text" == sType)))
                sResultCursorType = kCurFormatPainterWord;
            else
                sResultCursorType = sType;
        }
        else
            sResultCursorType = this.m_sLockedCursorType;
        if ( "undefined" === typeof(Data) || null === Data )
            Data = new AscCommon.CMouseMoveData();
        this.Native["DD_SetCursorType"](sResultCursorType, Data);
    }
    this.LockCursorType = function(sType)
    {
        this.m_sLockedCursorType = sType;

        this.Native["DD_LockCursorType"](sType);
    }
    this.LockCursorTypeCur = function()
    {
        this.m_sLockedCursorType = this.Native["DD_LockCursorType"]();
    }
    this.UnlockCursorType = function()
    {
        this.m_sLockedCursorType = "";
        this.Native["DD_UnlockCursorType"]();
    }

    this.OnStartRecalculate = function(pageCount)
    {

        this.Native["DD_OnStartRecalculate"](pageCount);
    }

    this.SetTargetColor = function(r, g, b)
    {
        this.Native["DD_SetTargetColor"](r, g, b);
    }

    this.StartTrackTable = function()
    {};

    this.OnRecalculatePage = function(index, pageObject)
    {
        this.Native["DD_OnRecalculatePage"](index, pageObject.Width, pageObject.Height);
    }

    this.OnEndRecalculate = function()
    {
        this.Native["DD_OnEndRecalculate"]();
    }

    this.ChangePageAttack = function(pageIndex)
    {
    }


    this.InitGuiCanvasTextProps = function(div_id)
    {

    }

    this.DrawGuiCanvasTextProps = function(props)
    {

    }

    this.DrawSearch = function(overlay)
    {
    }

    this.DrawSearchCur = function(overlay, place)
    {
    }

    this.StopRenderingPage = function(pageIndex)
    {

    }

    this.ClearCachePages = function()
    {
        this.Native["DD_ClearCachePages"]();
    }

    this.FirePaint = function()
    {
        this.Native["DD_FirePaint"]();
    }



    this.ConvertCoordsFromCursor2 = function(x, y)
    {
        return this.Native["DD_ConvertCoordsFromCursor2"]();
    }

    this.IsCursorInTableCur = function(x, y, page)
    {

        return false;
    }

    this.ConvertCoordsToCursorWR = function(x, y, pageIndex, transform)
    {
        return this.Native["DD_ConvertCoordsToCursorWR"]();
    }

    this.ConvertCoordsToCursorWR_2 = function(x, y)
    {
        return this.Native["DD_ConvertCoordsToCursorWR_2"]();
    }

    this.ConvertCoordsToCursorWR_Comment = function(x, y)
    {
        return this.Native["DD_ConvertCoordsToCursorWR_Comment"]();
    }

    this.ConvertCoordsToCursor = function(x, y)
    {
        return this.Native["DD_ConvertCoordsToCursor"]();
    }

    this.TargetStart = function()
    {
        return this.Native["DD_TargetStart"]();
    }
    this.TargetEnd = function()
    {
        return this.Native["DD_TargetEnd"]();
    }
    this.UpdateTargetNoAttack = function()
    {
    }

    this.CheckTargetDraw = function(x, y)
    {
        return this.Native["DD_CheckTargetDraw"](x, y);
    }

    this.UpdateTarget = function(x, y, pageIndex)
    {
        return this.Native["DD_UpdateTarget"](x, y, pageIndex);
    }

    this.SetTargetSize = function(size)
    {
        return this.Native["DD_SetTargetSize"](size);
    }
    this.DrawTarget = function()
    {
        return this.Native["DD_DrawTarget"]();
    }
    this.TargetShow = function()
    {
        return this.Native["DD_TargetShow"]();
    }
    this.CheckTargetShow = function()
    {
        return this.Native["DD_CheckTargetShow"]();
    }

    this.SetCurrentPage = function(PageIndex)
    {
        return this.Native["DD_SetCurrentPage"](PageIndex);
    }

    this.SelectEnabled = function(bIsEnabled)
    {
        return this.Native["DD_SelectEnabled"](bIsEnabled);
    }
    this.SelectClear = function()
    {
        return this.Native["DD_SelectClear"]();
    }
    this.SearchClear = function()
    {
        return this.Native["DD_SearchClear"]();
    }
    this.AddPageSearch = function(findText, rects)
    {
        return this.Native["DD_AddPageSearch"](findText, rects);
    }

    this.StartSearch = function()
    {
        this.Native["DD_StartSearch"]();
    }
    this.EndSearch = function(bIsChange)
    {
        this.Native["DD_EndSearch"](bIsChange);
    }
    this.AddPageSelection = function(pageIndex, x, y, width, height)
    {
        this.Native["DD_AddPageSelection"](pageIndex, x, y, width, height);
    }
    this.SelectShow = function()
    {
        this.Native["DD_SelectShow"]();
    }

    this.Set_RulerState_Table = function(markup, transform)
    {
        this.Native["DD_Set_RulerState_Table"](markup, transform);
    }

    this.Set_RulerState_Paragraph = function(obj, margins)
    {
        this.Native["DD_Set_RulerState_Paragraph"](obj, margins);
    }


    this.Update_ParaTab = function(Default_Tab, ParaTabs)
    {
        this.Native["DD_Update_ParaTab"](Default_Tab, ParaTabs);
    }

    this.UpdateTableRuler = function(isCols, index, position)
    {
        this.Native["DD_UpdateTableRuler"](isCols, index, position);
    }
    this.GetDotsPerMM = function(value)
    {
        this.Native["DD_GetDotsPerMM"](value);
    }

    this.GetMMPerDot = function(value)
    {
        return value / this.GetDotsPerMM( 1 );
    }
    this.GetVisibleMMHeight = function()
    {
        return this.Native["DD_GetVisibleMMHeight"]();
    }

    // вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
    this.CheckFontCache = function()
    {
        return this.Native["DD_CheckFontCache"]();
    }

    this.CheckFontNeeds = function()
    {
    }

    this.CorrectRulerPosition = function(pos)
    {
        return this.Native["DD_CorrectRulerPosition"](pos);
    }

    // вот здесь весь трекинг
    this.DrawTrack = function(type, matrix, left, top, width, height, isLine, canRotate, isNoMove)
    {
        this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
    }

    this.LockSlide = function(slideNum)
    {
        this.Native["DD_LockSlide"](slideNum);
    }

    this.UnLockSlide = function(slideNum)
    {
        this.Native["DD_UnLockSlide"](slideNum);
    }

    this.DrawTrackSelectShapes = function(x, y, w, h)
    {
        this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
    }

    this.DrawAdjustment = function(matrix, x, y, bTextWarp)
    {
        this.AutoShapesTrack.DrawAdjustment(matrix, x, y, bTextWarp);
    }

    // cursor
    this.UpdateTargetTransform = function(matrix)
    {
        if (matrix)
        {
            if (null == this.TextMatrix)
                this.TextMatrix = new CMatrix();
            this.TextMatrix.sx = matrix.sx;
            this.TextMatrix.shy = matrix.shy;
            this.TextMatrix.shx = matrix.shx;
            this.TextMatrix.sy = matrix.sy;
            this.TextMatrix.tx = matrix.tx;
            this.TextMatrix.ty = matrix.ty;

            this.Native["DD_UpdateTargetTransform"](matrix.sx, matrix.shy, matrix.shx, matrix.sy, matrix.tx, matrix.ty);
        }
        else
        {
            this.TextMatrix = null;
            this.Native["DD_RemoveTargetTransform"]();
        }
    }

    this.UpdateThumbnailsAttack = function()
    {
        //this.m_oWordControl.Thumbnails.RecalculateAll();
    }

    this.CheckGuiControlColors = function(bIsAttack)
    {
    }

    this.SendControlColors = function(bIsAttack)
    {
    }

    this.SendThemeColorScheme = function()
    {

    }

    this.DrawImageTextureFillShape = function(url)
    {
    }

    this.DrawImageTextureFillSlide = function(url)
    {
    }



    this.DrawImageTextureFillTextArt = function(url)
    {
    }

    this.InitGuiCanvasShape = function(div_id)
    {
    }

    this.InitGuiCanvasSlide = function(div_id)
    {
    }

    this.InitGuiCanvasTextArt = function(div_id)
    {
    }

    this.CheckTableStyles = function()
    {
    }

    this.OnSelectEnd = function()
    {
    }

    this.GetCommentWidth = function(type)
    {
    }

    this.GetCommentHeight = function(type)
    {
    }

    // collaborative targets
    this.Collaborative_UpdateTarget = function(_id, _x, _y, _size, _page, _transform, is_from_paint)
    {
        this.Native["DD_Collaborative_UpdateTarget"](_id, _x, _y, _size, _page, _transform, is_from_paint);
    };
    this.Collaborative_RemoveTarget = function(_id)
    {
        this.Native["DD_Collaborative_RemoveTarget"](_id);
    };
    this.Collaborative_TargetsUpdate = function(bIsChangePosition)
    {
        this.Native["DD_Collaborative_TargetsUpdate"](bIsChangePosition);
    };
}

