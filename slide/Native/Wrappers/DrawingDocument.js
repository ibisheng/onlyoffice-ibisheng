/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

var FOCUS_OBJECT_THUMBNAILS     = 0;
var FOCUS_OBJECT_MAIN           = 1;
var FOCUS_OBJECT_NOTES          = 2;

var COMMENT_WIDTH   = 18;
var COMMENT_HEIGHT  = 16;

var global_mouseEvent = AscCommon.global_mouseEvent;

function check_KeyboardEvent(e)
{
    AscCommon.global_keyboardEvent.AltKey     = ((e["Flags"] & 0x01) == 0x01);
    AscCommon.global_keyboardEvent.CtrlKey    = ((e["Flags"] & 0x02) == 0x02);
    AscCommon.global_keyboardEvent.ShiftKey   = ((e["Flags"] & 0x04) == 0x04);

    AscCommon.global_keyboardEvent.Sender = null;

    AscCommon.global_keyboardEvent.CharCode   = e["CharCode"];
    AscCommon.global_keyboardEvent.KeyCode    = e["KeyCode"];
    AscCommon.global_keyboardEvent.Which      = null;
}
function check_KeyboardEvent_Array(_params, i)
{
    AscCommon.global_keyboardEvent.AltKey     = ((_params[i + 1] & 0x01) == 0x01);
    AscCommon.global_keyboardEvent.CtrlKey    = ((_params[i + 1] & 0x02) == 0x02);
    AscCommon.global_keyboardEvent.ShiftKey   = ((_params[i + 1] & 0x04) == 0x04);

    AscCommon.global_keyboardEvent.Sender = null;

    AscCommon.global_keyboardEvent.CharCode   = _params[i + 3];
    AscCommon.global_keyboardEvent.KeyCode    = _params[i + 2];
    AscCommon.global_keyboardEvent.Which      = null;
}

function check_MouseDownEvent(e, isClicks)
{
    global_mouseEvent.X = e["X"];
    global_mouseEvent.Y = e["Y"];

    global_mouseEvent.AltKey     = ((e["Flags"] & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e["Flags"] & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e["Flags"] & 0x04) == 0x04);

    global_mouseEvent.Type      = AscCommon.g_mouse_event_type_down;
    global_mouseEvent.Button    = e["Button"];

    global_mouseEvent.Sender    = null;

    if (isClicks)
    {
        global_mouseEvent.ClickCount = e["ClickCount"];
    }
    else
    {
        global_mouseEvent.ClickCount     = 1;
    }
    global_mouseEvent.KoefPixToMM = e["PixToMM"];
    global_mouseEvent.IsLocked = true;
}

function check_MouseMoveEvent(e)
{
    global_mouseEvent.X = e["X"];
    global_mouseEvent.Y = e["Y"];

    global_mouseEvent.AltKey     = ((e["Flags"] & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e["Flags"] & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e["Flags"] & 0x04) == 0x04);

    global_mouseEvent.Type      = AscCommon.g_mouse_event_type_move;
    global_mouseEvent.Button    = e["Button"];
    global_mouseEvent.KoefPixToMM = e["PixToMM"];
}

function check_MouseUpEvent(e)
{
    global_mouseEvent.X = e["X"];
    global_mouseEvent.Y = e["Y"];

    global_mouseEvent.AltKey     = ((e["Flags"] & 0x01) == 0x01);
    global_mouseEvent.CtrlKey    = ((e["Flags"] & 0x02) == 0x02);
    global_mouseEvent.ShiftKey   = ((e["Flags"] & 0x04) == 0x04);

    global_mouseEvent.Type      = AscCommon.g_mouse_event_type_up;
    global_mouseEvent.Button    = e["Button"];

    global_mouseEvent.Sender    = null;

    global_mouseEvent.IsLocked  = false;
    global_mouseEvent.KoefPixToMM = e["PixToMM"];
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


    this.AutoShapesTrack = new AscCommon.CAutoshapeTrack();

    this.m_lCurrentRendererPage = -1;
    this.m_oDocRenderer         = null;
};

CDrawingDocument.prototype.Notes_GetWidth = function()
{
    return 100;
};

CDrawingDocument.prototype.Notes_OnRecalculate = function()
{
    return 100;
};

CDrawingDocument.prototype.RenderPage = function(nPageIndex)
{
    var _graphics = new CDrawingStream();
    this.m_oWordControl.m_oLogicDocument.DrawPage(nPageIndex, _graphics);
};

CDrawingDocument.prototype.AfterLoad = function()
{
    this.Api = window.editor;
    this.m_oApi = this.Api;
    this.m_oApi.DocumentUrl = "";
    this.LogicDocument = window.editor.WordControl.m_oLogicDocument;
    this.LogicDocument.DrawingDocument = this;
};
CDrawingDocument.prototype.Start_CollaborationEditing = function()
{
    this.Native["DD_Start_CollaborationEditing"]();
};

CDrawingDocument.prototype.IsMobileVersion = function()
{
    return true;
};

CDrawingDocument.prototype.ConvertCoordsToAnotherPage = function(x, y)
{
    return {X: x, Y: y};
};

CDrawingDocument.prototype.SetCursorType = function(sType, Data)
{
    var sResultCursorType = sType;
    if ("" === this.m_sLockedCursorType)
    {
        if (this.m_oWordControl.m_oApi.isPaintFormat && (("default" === sType) || ("text" === sType)))
            sResultCursorType = AscCommon.kCurFormatPainterWord;
        else
            sResultCursorType = sType;
    }
    else
        sResultCursorType = this.m_sLockedCursorType;
    if ( "undefined" === typeof(Data) || null === Data )
        Data = new AscCommon.CMouseMoveData();
    this.Native["DD_SetCursorType"](sResultCursorType, Data);
};
CDrawingDocument.prototype.LockCursorType = function(sType)
{
    this.m_sLockedCursorType = sType;

    this.Native["DD_LockCursorType"](sType);
};
CDrawingDocument.prototype.LockCursorTypeCur = function()
{
    this.m_sLockedCursorType = this.Native["DD_LockCursorType"]();
};
CDrawingDocument.prototype.UnlockCursorType = function()
{
    this.m_sLockedCursorType = "";
    this.Native["DD_UnlockCursorType"]();
};

CDrawingDocument.prototype.OnStartRecalculate = function(pageCount)
{
    this.Native["DD_OnStartRecalculate"](pageCount, this.LogicDocument.Width, this.LogicDocument.Height);
};

CDrawingDocument.prototype.SetTargetColor = function(r, g, b)
{
    this.Native["DD_SetTargetColor"](r, g, b);
};

CDrawingDocument.prototype.StartTrackTable = function()
{};

CDrawingDocument.prototype.OnRecalculatePage = function(index, pageObject)
{
    var l, t, r, b;
    if(index === this.m_oLogicDocument.CurPage)
    {
        var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
        pageObject.draw(oBoundsChecker);
        r = oBoundsChecker.Bounds.max_x;
        l = oBoundsChecker.Bounds.min_x;
        b = oBoundsChecker.Bounds.max_y;
        t = oBoundsChecker.Bounds.min_y;
    }
    else
    {
        r = this.m_oLogicDocument.Width;
        l = 0.0;
        b = this.m_oLogicDocument.Height;
        t = 0.0;
    }
    this.Native["DD_OnRecalculatePage"](index, l, t, r, b);
};

CDrawingDocument.prototype.OnEndRecalculate = function()
{
    this.SlidesCount = this.m_oLogicDocument.Slides.length;
    this.Native["DD_OnEndRecalculate"]();
};

CDrawingDocument.prototype.ChangePageAttack = function(pageIndex)
{
};

CDrawingDocument.prototype.RenderDocument = function(Renderer)
{
    for (var i = 0; i < this.SlidesCount; i++)
    {
        Renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
        this.m_oLogicDocument.DrawPage(i, Renderer);
        Renderer.EndPage();
    }
};

CDrawingDocument.prototype.ToRenderer = function()
{
    var Renderer                             = new AscCommon.CDocumentRenderer();
    Renderer.IsNoDrawingEmptyPlaceholder     = true;
    Renderer.VectorMemoryForPrint            = new AscCommon.CMemory();
    var old_marks                            = this.m_oWordControl.m_oApi.ShowParaMarks;
    this.m_oWordControl.m_oApi.ShowParaMarks = false;
    this.RenderDocument(Renderer);
    this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
    var ret                                  = Renderer.Memory.GetBase64Memory();

    // DEBUG
    //console.log(ret);

    return ret;
};

CDrawingDocument.prototype.ToRenderer2    = function()
{
    var Renderer = new AscCommon.CDocumentRenderer();

    var old_marks                            = this.m_oWordControl.m_oApi.ShowParaMarks;
    this.m_oWordControl.m_oApi.ShowParaMarks = false;

    var ret = "";
    for (var i = 0; i < this.SlidesCount; i++)
    {
        Renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
        this.m_oLogicDocument.DrawPage(i, Renderer);
        Renderer.EndPage();

        ret += Renderer.Memory.GetBase64Memory();
        Renderer.Memory.Seek(0);
    }

    this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
    return ret;
};

CDrawingDocument.prototype.ToRendererPart = function(noBase64)
{
    var watermark = this.m_oWordControl.m_oApi.watermarkDraw;

    var pagescount = this.SlidesCount;

    if (-1 == this.m_lCurrentRendererPage)
    {
        if (watermark)
            watermark.StartRenderer();

        this.m_oDocRenderer                             = new AscCommon.CDocumentRenderer();
        this.m_oDocRenderer.VectorMemoryForPrint        = new AscCommon.CMemory();
        this.m_lCurrentRendererPage                     = 0;
        this.m_bOldShowMarks                            = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks        = false;
        this.m_oDocRenderer.IsNoDrawingEmptyPlaceholder = true;
    }

    var start = this.m_lCurrentRendererPage;
    var end   = pagescount - 1;

    var renderer = this.m_oDocRenderer;
    renderer.Memory.Seek(0);
    renderer.VectorMemoryForPrint.ClearNoAttack();

    for (var i = start; i <= end; i++)
    {
        renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
        this.m_oLogicDocument.DrawPage(i, renderer);
        renderer.EndPage();

        if (watermark)
            watermark.DrawOnRenderer(renderer, this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
    }

    if (end == -1)
    {
        renderer.BeginPage(this.m_oLogicDocument.Width, this.m_oLogicDocument.Height);
        renderer.EndPage()
    }

    this.m_lCurrentRendererPage = end + 1;

    if (this.m_lCurrentRendererPage >= pagescount)
    {
        if (watermark)
            watermark.EndRenderer();

        this.m_lCurrentRendererPage              = -1;
        this.m_oDocRenderer                      = null;
        this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
    }

    if (noBase64) {
        return renderer.Memory.GetData();
    } else {
        return renderer.Memory.GetBase64Memory();
    }
};


CDrawingDocument.prototype.InitGuiCanvasTextProps = function(div_id)
{

};

CDrawingDocument.prototype.DrawGuiCanvasTextProps = function(props)
{

};

CDrawingDocument.prototype.DrawSearch = function(overlay)
{
};

CDrawingDocument.prototype.DrawSearchCur = function(overlay, place)
{
};

CDrawingDocument.prototype.StopRenderingPage = function(pageIndex)
{

};

CDrawingDocument.prototype.ClearCachePages = function()
{
    this.Native["DD_ClearCachePages"]();
};

CDrawingDocument.prototype.FirePaint = function()
{
    this.Native["DD_FirePaint"]();
};



CDrawingDocument.prototype.ConvertCoordsFromCursor2 = function(x, y)
{
    return this.Native["DD_ConvertCoordsFromCursor2"]();
};

CDrawingDocument.prototype.IsCursorInTableCur = function(x, y, page)
{

    return false;
};

CDrawingDocument.prototype.ConvertCoordsToCursorWR = function(x, y, pageIndex, transform)
{
    var m11, m22, m12, m21, tx, ty, _page_index;
    if(transform)
    {
        m11 = transform.sx;
        m22 = transform.sy;
        m12 = transform.shx;
        m21 = transform.shy;
        tx = transform.tx;
        ty = transform.ty;
    }
    else
    {
        m11 = 1.0;
        m22 = 1.0;
        m12 = 0.0;
        m21 = 0.0;
        tx = 0.0;
        ty = 0.0;
    }
    if(AscFormat.isRealNumber(pageIndex))
    {
        _page_index = pageIndex;
    }
    else
    {
        _page_index = 0;
    }
    return this.Native["DD_ConvertCoordsToCursor"](x, y, _page_index, m11, m21, m12, m22, tx, ty);
};

CDrawingDocument.prototype.ConvertCoordsToCursorWR_2 = function(x, y)
{
    return this.Native["DD_ConvertCoordsToCursor"]();
};

CDrawingDocument.prototype.ConvertCoordsToCursorWR_Comment = function(x, y)
{
    return this.Native["DD_ConvertCoordsToCursorWR_Comment"]();
};

CDrawingDocument.prototype.ConvertCoordsToCursor = function(x, y)
{
    return this.Native["DD_ConvertCoordsToCursor"](x, y, 0);
};

CDrawingDocument.prototype.TargetStart = function()
{
    return this.Native["DD_TargetStart"]();
};
CDrawingDocument.prototype.TargetEnd = function()
{
    return this.Native["DD_TargetEnd"]();
};
CDrawingDocument.prototype.UpdateTargetNoAttack = function()
{
};

CDrawingDocument.prototype.CheckTargetDraw = function(x, y)
{
    return this.Native["DD_CheckTargetDraw"](x, y);
};

CDrawingDocument.prototype.UpdateTarget = function(x, y, pageIndex)
{
    return this.Native["DD_UpdateTarget"](x, y, pageIndex);
};

CDrawingDocument.prototype.SetTargetSize = function(size)
{
    return this.Native["DD_SetTargetSize"](size);
};
CDrawingDocument.prototype.DrawTarget = function()
{
    return this.Native["DD_DrawTarget"]();
};
CDrawingDocument.prototype.TargetShow = function()
{
    return this.Native["DD_TargetShow"]();
};
CDrawingDocument.prototype.CheckTargetShow = function()
{
    return this.Native["DD_CheckTargetShow"]();
};

CDrawingDocument.prototype.SetCurrentPage = function(PageIndex)
{
    return this.Native["DD_SetCurrentPage"](PageIndex);
};

CDrawingDocument.prototype.SelectEnabled = function(bIsEnabled)
{
    this.m_bIsSelection = bIsEnabled;
    if (false === this.m_bIsSelection)
    {
        this.SelectClear();
//            //this.m_oWordControl.CheckUnShowOverlay();
//            //this.drawingObjects.OnUpdateOverlay();
//            this.drawingObjects.getOverlay().m_oContext.globalAlpha = 1.0;
    }
    //return this.Native["DD_SelectEnabled"](bIsEnabled);
};
CDrawingDocument.prototype.SelectClear = function()
{
    return this.Native["DD_SelectClear"]();
};
CDrawingDocument.prototype.SearchClear = function()
{
    return this.Native["DD_SearchClear"]();
};
CDrawingDocument.prototype.AddPageSearch = function(findText, rects)
{
    return this.Native["DD_AddPageSearch"](findText, rects);
};

CDrawingDocument.prototype.StartSearch = function()
{
    this.Native["DD_StartSearch"]();
};
CDrawingDocument.prototype.EndSearch = function(bIsChange)
{
    this.Native["DD_EndSearch"](bIsChange);
};
CDrawingDocument.prototype.AddPageSelection = function(pageIndex, x, y, width, height)
{
    this.Native["DD_AddPageSelection"](pageIndex, x, y, width, height);
};
CDrawingDocument.prototype.SelectShow = function()
{
    this.m_oWordControl.OnUpdateOverlay();
};

CDrawingDocument.prototype.Set_RulerState_Table = function(markup, transform)
{
    this.Native["DD_Set_RulerState_Table"](markup, transform);
};

CDrawingDocument.prototype.Set_RulerState_Paragraph = function(obj, margins)
{
    this.Native["DD_Set_RulerState_Paragraph"](obj, margins);
};


CDrawingDocument.prototype.Update_ParaTab = function(Default_Tab, ParaTabs)
{
    this.Native["DD_Update_ParaTab"](Default_Tab, ParaTabs);
};

CDrawingDocument.prototype.UpdateTableRuler = function(isCols, index, position)
{
    this.Native["DD_UpdateTableRuler"](isCols, index, position);
};
CDrawingDocument.prototype.GetDotsPerMM = function(value)
{
    return this.Native["DD_GetDotsPerMM"](value);
};

CDrawingDocument.prototype.GetMMPerDot = function(value)
{
    return value / this.GetDotsPerMM( 1 );
};
CDrawingDocument.prototype.GetVisibleMMHeight = function()
{
    return this.Native["DD_GetVisibleMMHeight"]();
};

// вот оооочень важная функция. она выкидывает из кэша неиспользуемые шрифты
CDrawingDocument.prototype.CheckFontCache = function()
{
    return this.Native["DD_CheckFontCache"]();
};

CDrawingDocument.prototype.CheckFontNeeds = function()
{
};

CDrawingDocument.prototype.CorrectRulerPosition = function(pos)
{
    return this.Native["DD_CorrectRulerPosition"](pos);
};

// вот здесь весь трекинг
CDrawingDocument.prototype.DrawTrack = function(type, matrix, left, top, width, height, isLine, canRotate, isNoMove)
{
    this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
};

CDrawingDocument.prototype.LockSlide = function(slideNum)
{
    this.Native["DD_LockSlide"](slideNum);
};

CDrawingDocument.prototype.UnLockSlide = function(slideNum)
{
    this.Native["DD_UnLockSlide"](slideNum);
};

CDrawingDocument.prototype.DrawTrackSelectShapes = function(x, y, w, h)
{
    this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
};

CDrawingDocument.prototype.DrawAdjustment = function(matrix, x, y, bTextWarp)
{
    this.AutoShapesTrack.DrawAdjustment(matrix, x, y, bTextWarp);
};

// cursor
CDrawingDocument.prototype.UpdateTargetTransform = function(matrix)
{
    if (matrix)
    {
        if (null == this.TextMatrix)
            this.TextMatrix = new AscCommon.CMatrix();
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
};

CDrawingDocument.prototype.UpdateThumbnailsAttack = function()
{
    //this.m_oWordControl.Thumbnails.RecalculateAll();
};

CDrawingDocument.prototype.CheckGuiControlColors = function(bIsAttack)
{
};

CDrawingDocument.prototype.SendControlColors = function(bIsAttack)
{
};

CDrawingDocument.prototype.DrawImageTextureFillShape = function(url)
{
};

CDrawingDocument.prototype.DrawImageTextureFillSlide = function(url)
{
};



CDrawingDocument.prototype.DrawImageTextureFillTextArt = function(url)
{
};

CDrawingDocument.prototype.InitGuiCanvasShape = function(div_id)
{
};

CDrawingDocument.prototype.InitGuiCanvasSlide = function(div_id)
{
};

CDrawingDocument.prototype.InitGuiCanvasTextArt = function(div_id)
{
};

CDrawingDocument.prototype.CheckTableStyles = function()
{
};

CDrawingDocument.prototype.OnSelectEnd = function()
{
};

CDrawingDocument.prototype.GetCommentWidth = function(type)
{
};

CDrawingDocument.prototype.GetCommentHeight = function(type)
{
};

CDrawingDocument.prototype.OnMouseDown = function(e)
{
    check_MouseDownEvent(e, true);
    this.m_oLogicDocument.OnMouseDown(global_mouseEvent, global_mouseEvent.X, global_mouseEvent.Y, e["CurPage"]);
};

CDrawingDocument.prototype.OnMouseMove = function(e)
{
    check_MouseMoveEvent(e);
    this.m_oLogicDocument.OnMouseMove(global_mouseEvent, global_mouseEvent.X, global_mouseEvent.Y, e["CurPage"]);
};

CDrawingDocument.prototype.OnMouseUp = function(e)
{
    check_MouseUpEvent(e);
    this.m_oLogicDocument.OnMouseUp(global_mouseEvent, global_mouseEvent.X, global_mouseEvent.Y, e["CurPage"]);
};

// collaborative targets
CDrawingDocument.prototype.Collaborative_UpdateTarget = function(_id, _x, _y, _size, _page, _transform, is_from_paint)
{
    this.Native["DD_Collaborative_UpdateTarget"](_id, _x, _y, _size, _page, _transform, is_from_paint);
};
CDrawingDocument.prototype.Collaborative_RemoveTarget = function(_id)
{
    this.Native["DD_Collaborative_RemoveTarget"](_id);
};
CDrawingDocument.prototype.Collaborative_TargetsUpdate = function(bIsChangePosition)
{
    this.Native["DD_Collaborative_TargetsUpdate"](bIsChangePosition);
};


CDrawingDocument.prototype.DrawHorAnchor = function(pageIndex, x)
{
};
CDrawingDocument.prototype.DrawVerAnchor = function(pageIndex, y)
{
};

CDrawingDocument.prototype.OnCheckMouseDown = function(e)
{
    // 0 - none
    // 1 - select markers
    // 2 - drawing track
    check_MouseDownEvent(e, false);
    var pos = {X: global_mouseEvent.X, Y: global_mouseEvent.Y, Page: this.LogicDocument.CurPage};
    if (pos.Page == -1)
        return 0;

    this.SelectRect1 = null;
    this.SelectRect2 = null;
    var _select = this.LogicDocument.GetSelectionBounds();
    if (_select)
    {
        var _rect1 = _select.Start;
        var _rect2 = _select.End;

        this.SelectRect1 = _rect1;
        this.SelectRect2 = _rect2;
    }
    this.SelectDrag = -1;
    if (this.SelectRect1 && this.SelectRect2)
    {
        // проверям попадание в селект
        var radiusMM = 5;
        if (this.IsRetina)
            radiusMM *= 2;
        radiusMM /= this.Native["DD_GetDotsPerMM"]();

        var _circlePos1_x = 0;
        var _circlePos1_y = 0;
        var _circlePos2_x = 0;
        var _circlePos2_y = 0;

        var matrixCheck = this.LogicDocument.GetTextTransformMatrix();
        if (!matrixCheck)
        {
            _circlePos1_x = this.SelectRect1.X;
            _circlePos1_y = this.SelectRect1.Y - radiusMM;

            _circlePos2_x = this.SelectRect2.X + this.SelectRect2.W;
            _circlePos2_y = this.SelectRect2.Y + this.SelectRect2.H + radiusMM;
        }
        else
        {
            var _circlePos1_x_mem = this.SelectRect1.X;
            var _circlePos1_y_mem = this.SelectRect1.Y - radiusMM;

            var _circlePos2_x_mem = this.SelectRect2.X + this.SelectRect2.W;
            var _circlePos2_y_mem = this.SelectRect2.Y + this.SelectRect2.H + radiusMM;

            _circlePos1_x = matrixCheck.TransformPointX(_circlePos1_x_mem, _circlePos1_y_mem);
            _circlePos1_y = matrixCheck.TransformPointY(_circlePos1_x_mem, _circlePos1_y_mem);
            _circlePos2_x = matrixCheck.TransformPointX(_circlePos2_x_mem, _circlePos2_y_mem);
            _circlePos2_y = matrixCheck.TransformPointY(_circlePos2_x_mem, _circlePos2_y_mem);
        }

        var _selectCircleEpsMM = 10; // 1cm;
        var _selectCircleEpsMM_square = _selectCircleEpsMM * _selectCircleEpsMM;

        var _distance1 = ((pos.X - _circlePos1_x) * (pos.X - _circlePos1_x) + (pos.Y - _circlePos1_y) * (pos.Y - _circlePos1_y));
        var _distance2 = ((pos.X - _circlePos2_x) * (pos.X - _circlePos2_x) + (pos.Y - _circlePos2_y) * (pos.Y - _circlePos2_y));

        var candidate = 1;
        if (_distance2 < _distance1)
            candidate = 2;

        if (1 == candidate && _distance1 < _selectCircleEpsMM_square)
        {
            this.SelectDrag = 1;
        }

        if (2 == candidate && _distance2 < _selectCircleEpsMM_square)
        {
            this.SelectDrag = 2;
        }

        if (this.SelectDrag != -1)
            return 1;
    }

    // проверям н]а попадание в графические объекты (грубо говоря - треки)
    if (!this.IsViewMode)
    {
        global_mouseEvent.KoefPixToMM = 5;

        if (this.Native["GetDeviceDPI"])
        {
            // 1см
            global_mouseEvent.AscHitToHandlesEpsilon = 5 * this.Native["GetDeviceDPI"]() / (25.4 * this.Native["DD_GetDotsPerMM"]() );
        }

        var oController = this.LogicDocument.GetCurrentController();
        var _isDrawings = false;
        if(oController){
            _isDrawings = oController.isPointInDrawingObjects3(pos.X, pos.Y, pos.Page, true);
        }
        global_mouseEvent.KoefPixToMM = 1;
        if (_isDrawings)
            return 2;
    }
    return 0;
};

CDrawingDocument.prototype.CheckMouseDown2 = function (e) {
    check_MouseDownEvent(e, false);
    var pos = {X: global_mouseEvent.X, Y: global_mouseEvent.Y, Page: this.LogicDocument.CurPage};
    if (pos.Page == -1)
        return 0;

    var oController = this.LogicDocument.GetCurrentController();
    var _isDrawings = 0;
    if(oController){
        _isDrawings = oController.isPointInDrawingObjects4(pos.X, pos.Y, pos.Page, true);
    }
    return _isDrawings;
};

function DrawBackground(graphics, unifill, w, h)
{
    // первым делом рисуем белый рект!
    if (true)
    {
        // ну какой-то бэкграунд должен быть
        graphics.SetIntegerGrid(false);

        var _l = 0;
        var _t = 0;
        var _r = (0 + w);
        var _b = (0 + h);

        graphics._s();
        graphics._m(_l, _t);
        graphics._l(_r, _t);
        graphics._l(_r, _b);
        graphics._l(_l, _b);
        graphics._z();

        graphics.b_color1(255, 255, 255, 255);
        graphics.df();
        graphics._e();
    }

    if (unifill == null || unifill.fill == null)
        return;

    graphics.SetIntegerGrid(false);

    var _shape = {};

    _shape.brush           = unifill;
    _shape.pen             = null;
    _shape.TransformMatrix = new AscCommon.CMatrix();
    _shape.extX            = w;
    _shape.extY            = h;
    _shape.check_bounds    = function(checker)
    {
        checker._s();
        checker._m(0, 0);
        checker._l(this.extX, 0);
        checker._l(this.extX, this.extY);
        checker._l(0, this.extY);
        checker._z();
        checker._e();
    };

    var shape_drawer = new AscCommon.CShapeDrawer();
    shape_drawer.fromShape2(_shape, graphics, null);
    shape_drawer.draw(null);
}


//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CDrawingDocument = CDrawingDocument;