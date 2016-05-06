"use strict";

// Import
var History = AscCommon.History;

/**
 *
 * @constructor
 * @extends {AscCommon.CCollaborativeEditingBase}
 */
function CWordCollaborativeEditing()
{
    CWordCollaborativeEditing.superclass.constructor.call(this);

    this.m_oLogicDocument        = null;
    this.m_aDocumentPositions    = new AscCommon.CDocumentPositionsManager();
    this.m_aForeignCursorsPos    = new AscCommon.CDocumentPositionsManager();
    this.m_aForeignCursors       = {};
    this.m_aForeignCursorsXY     = {};
    this.m_aForeignCursorsToShow = {};
}

AscCommon.extendClass(CWordCollaborativeEditing, AscCommon.CCollaborativeEditingBase);

CWordCollaborativeEditing.prototype.Send_Changes = function(IsUserSave, AdditionalInfo, IsUpdateInterface)
{
    // Пересчитываем позиции
    this.Refresh_DCChanges();

    // Генерируем свои изменения
    var StartPoint = ( null === History.SavedIndex ? 0 : History.SavedIndex + 1 );
    var LastPoint = -1;

    if (this.m_nUseType <= 0)
    {
        // (ненужные точки предварительно удаляем)
        History.Clear_Redo();
        LastPoint = History.Points.length - 1;
    }
    else
    {
        LastPoint = History.Index;
    }

    // Просчитаем сколько изменений на сервер пересылать не надо
    var SumIndex = 0;
    var StartPoint2 = Math.min(StartPoint, LastPoint + 1);
    for (var PointIndex = 0; PointIndex < StartPoint2; PointIndex++)
    {
        var Point = History.Points[PointIndex];
        SumIndex += Point.Items.length;
    }
    var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );

    var aChanges = [];
    for (var PointIndex = StartPoint; PointIndex <= LastPoint; PointIndex++)
    {
        var Point = History.Points[PointIndex];
        History.Update_PointInfoItem(PointIndex, StartPoint, LastPoint, SumIndex, deleteIndex);

        for (var Index = 0; Index < Point.Items.length; Index++)
        {
            var Item = Point.Items[Index];
            var oChanges = new AscCommon.CCollaborativeChanges();
            oChanges.Set_FromUndoRedo(Item.Class, Item.Data, Item.Binary);
            aChanges.push(oChanges.m_pData);
        }
    }

    this.Release_Locks();

    var UnlockCount2 = this.m_aNeedUnlock2.length;
    for (var Index = 0; Index < UnlockCount2; Index++)
    {
        var Class = this.m_aNeedUnlock2[Index];
        Class.Lock.Set_Type(AscCommon.locktype_None, false);
        editor.CoAuthoringApi.releaseLocks(Class.Get_Id());
    }

    this.m_aNeedUnlock.length = 0;
    this.m_aNeedUnlock2.length = 0;

    var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );
    if (0 < aChanges.length || null !== deleteIndex) {
        editor.CoAuthoringApi.saveChanges(aChanges, deleteIndex, AdditionalInfo);
        History.CanNotAddChanges = true;
    } else
        editor.CoAuthoringApi.unLockDocument(true);

    if (-1 === this.m_nUseType)
    {
        // Чистим Undo/Redo только во время совместного редактирования
        History.Clear();
        History.SavedIndex = null;
    }
    else if (0 === this.m_nUseType)
    {
        // Чистим Undo/Redo только во время совместного редактирования
        History.Clear();
        History.SavedIndex = null;

        this.m_nUseType = 1;
    }
    else
    {
        // Обновляем точку последнего сохранения в истории
        History.Reset_SavedIndex(IsUserSave);
    }

    if (false !== IsUpdateInterface)
    {
        // Обновляем интерфейс
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }

    // TODO: Пока у нас обнуляется история на сохранении нужно обновлять Undo/Redo
    editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

    // Перерисовываем документ (для обновления локов)
    editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
    editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
};
CWordCollaborativeEditing.prototype.Release_Locks = function()
{
    var UnlockCount = this.m_aNeedUnlock.length;
    for (var Index = 0; Index < UnlockCount; Index++)
    {
        var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
        if (AscCommon.locktype_Other3 != CurLockType && AscCommon.locktype_Other != CurLockType)
        {
            this.m_aNeedUnlock[Index].Lock.Set_Type(AscCommon.locktype_None, false);

            if (this.m_aNeedUnlock[Index] instanceof AscCommonWord.CHeaderFooterController)
                editor.sync_UnLockHeaderFooters();
            else if (this.m_aNeedUnlock[Index] instanceof AscCommonWord.CDocument)
                editor.sync_UnLockDocumentProps();
            else if (this.m_aNeedUnlock[Index] instanceof AscCommon.CComment)
                editor.sync_UnLockComment(this.m_aNeedUnlock[Index].Get_Id());
            else if (this.m_aNeedUnlock[Index] instanceof AscCommonWord.CGraphicObjects)
                editor.sync_UnLockDocumentSchema();
        }
        else if (AscCommon.locktype_Other3 === CurLockType)
        {
            this.m_aNeedUnlock[Index].Lock.Set_Type(AscCommon.locktype_Other, false);
        }
    }
};
CWordCollaborativeEditing.prototype.OnEnd_Load_Objects = function()
{
    // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

    // Снимаем лок
    AscCommon.CollaborativeEditing.m_bGlobalLock = false;
    AscCommon.CollaborativeEditing.m_bGlobalLockSelection = false;

    // Запускаем полный пересчет документа
    var LogicDocument = editor.WordControl.m_oLogicDocument;

    var RecalculateData =
    {
        Inline   : { Pos : 0, PageNum : 0 },
        Flow     : [],
        HdrFtr   : [],
        Drawings : {
            All : true,
            Map : {}
        }
    };

    LogicDocument.Reset_RecalculateCache();

    LogicDocument.Recalculate(false, false, RecalculateData);
    LogicDocument.Document_UpdateSelectionState();
    LogicDocument.Document_UpdateInterfaceState();

    editor.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.ApplyChanges);
};
CWordCollaborativeEditing.prototype.Check_MergeData = function()
{
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    LogicDocument.Comments.Check_MergeData();
};
CWordCollaborativeEditing.prototype.OnStart_CheckLock = function()
{
    this.m_aCheckLocks.length = 0;
};
CWordCollaborativeEditing.prototype.Add_CheckLock = function(oItem)
{
    this.m_aCheckLocks.push(oItem);
};
CWordCollaborativeEditing.prototype.OnEnd_CheckLock = function(DontLockInFastMode)
{
    var aIds = [];

    var Count = this.m_aCheckLocks.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var oItem = this.m_aCheckLocks[Index];

        if (true === oItem) // сравниваем по значению и типу обязательно
            return true;
        else if (false !== oItem)
            aIds.push(oItem);
    }

    if (true === DontLockInFastMode && true === this.Is_Fast())
        return false;

    if (aIds.length > 0)
    {
        // Отправляем запрос на сервер со списком Id
        editor.CoAuthoringApi.askLock(aIds, this.OnCallback_AskLock);

        // Ставим глобальный лок, только во время совместного редактирования
        if (-1 === this.m_nUseType)
            this.m_bGlobalLock = true;
        else
        {
            // Пробегаемся по массиву и проставляем, что залочено нами
            var Count = this.m_aCheckLocks.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var oItem = this.m_aCheckLocks[Index];

                if (true !== oItem && false !== oItem) // сравниваем по значению и типу обязательно
                {
                    var Class = AscCommon.g_oTableId.Get_ById(oItem);
                    if (null != Class)
                    {
                        Class.Lock.Set_Type(AscCommon.locktype_Mine, false);
                        this.Add_Unlock2(Class);
                    }
                }
            }

            this.m_aCheckLocks.length = 0;
        }
    }

    return false;
};
CWordCollaborativeEditing.prototype.OnCallback_AskLock = function(result)
{
    var oThis   = AscCommon.CollaborativeEditing;
    var oEditor = editor;

    if (true === oThis.m_bGlobalLock)
    {
        // Здесь проверяем есть ли длинная операция, если она есть, то до ее окончания нельзя делать
        // Undo, иначе точка истории уберется, а изменения допишутся в предыдущую.
        if (false == oEditor.checkLongActionCallback(oThis.OnCallback_AskLock, result))
            return;

        // Снимаем глобальный лок
        oThis.m_bGlobalLock = false;

        if (result["lock"])
        {
            // Пробегаемся по массиву и проставляем, что залочено нами

            var Count = oThis.m_aCheckLocks.length;
            for (var Index = 0; Index < Count; Index++)
            {
                var oItem = oThis.m_aCheckLocks[Index];

                if (true !== oItem && false !== oItem) // сравниваем по значению и типу обязательно
                {
                    var Class = AscCommon.g_oTableId.Get_ById(oItem);
                    if (null != Class)
                    {
                        Class.Lock.Set_Type(AscCommon.locktype_Mine);
                        oThis.Add_Unlock2(Class);
                    }
                }
            }
        }
        else if (result["error"])
        {
            // Если у нас началось редактирование диаграммы, а вернулось, что ее редактировать нельзя,
            // посылаем сообщение о закрытии редактора диаграмм.
            if (true === oEditor.isChartEditor)
                oEditor.sync_closeChartEditor();

            // Делаем откат на 1 шаг назад и удаляем из Undo/Redo эту последнюю точку
            oEditor.WordControl.m_oLogicDocument.Document_Undo();
            History.Clear_Redo();
        }

        oEditor.isChartEditor = false;
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с сохраненными позициями документа.
//----------------------------------------------------------------------------------------------------------------------
CWordCollaborativeEditing.prototype.Clear_DocumentPositions = function()
{
    this.m_aDocumentPositions.Clear_DocumentPositions();
};
CWordCollaborativeEditing.prototype.Add_DocumentPosition = function(DocumentPos)
{
    this.m_aDocumentPositions.Add_DocumentPosition(DocumentPos);
};
CWordCollaborativeEditing.prototype.Add_ForeignCursor = function(UserId, DocumentPos, UserShortId)
{
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    this.m_aForeignCursors[UserId] = DocumentPos;
    this.m_aForeignCursorsPos.Add_DocumentPosition(DocumentPos);
    this.m_aForeignCursorsId[UserId] = UserShortId;
};
CWordCollaborativeEditing.prototype.Remove_ForeignCursor = function(UserId)
{
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    delete this.m_aForeignCursors[UserId];

    var DrawingDocument = this.m_oLogicDocument.DrawingDocument;
    DrawingDocument.Collaborative_RemoveTarget(UserId);
    this.Remove_ForeignCursorXY(UserId);
    this.Remove_ForeignCursorToShow(UserId);
};
CWordCollaborativeEditing.prototype.Remove_AllForeignCursors = function()
{
    for (var UserId in this.m_aForeignCursors)
    {
        this.Remove_ForeignCursor(UserId);
    }
};
CWordCollaborativeEditing.prototype.Update_DocumentPositionsOnAdd = function(Class, Pos)
{
    this.m_aDocumentPositions.Update_DocumentPositionsOnAdd(Class, Pos);
    this.m_aForeignCursorsPos.Update_DocumentPositionsOnAdd(Class, Pos);
};
CWordCollaborativeEditing.prototype.Update_DocumentPositionsOnRemove = function(Class, Pos, Count)
{
    this.m_aDocumentPositions.Update_DocumentPositionsOnRemove(Class, Pos, Count);
    this.m_aForeignCursorsPos.Update_DocumentPositionsOnRemove(Class, Pos, Count);
};
CWordCollaborativeEditing.prototype.OnStart_SplitRun = function(SplitRun, SplitPos)
{
    this.m_aDocumentPositions.OnStart_SplitRun(SplitRun, SplitPos);
    this.m_aForeignCursorsPos.OnStart_SplitRun(SplitRun, SplitPos);
};
CWordCollaborativeEditing.prototype.OnEnd_SplitRun = function(NewRun)
{
    this.m_aDocumentPositions.OnEnd_SplitRun(NewRun);
    this.m_aForeignCursorsPos.OnEnd_SplitRun(NewRun);
};
CWordCollaborativeEditing.prototype.Update_DocumentPosition = function(DocPos)
{
    this.m_aDocumentPositions.Update_DocumentPosition(DocPos);
};
CWordCollaborativeEditing.prototype.Update_ForeignCursorsPositions = function()
{
    for (var UserId in this.m_aForeignCursors)
    {
        var DocPos = this.m_aForeignCursors[UserId];
        if (!DocPos || DocPos.length <= 0)
            continue;

        this.m_aForeignCursorsPos.Update_DocumentPosition(DocPos);

        var Run      = DocPos[DocPos.length - 1].Class;
        var InRunPos = DocPos[DocPos.length - 1].Position;

        this.Update_ForeignCursorPosition(UserId, Run, InRunPos, false);
    }
};
CWordCollaborativeEditing.prototype.Update_ForeignCursorPosition = function(UserId, Run, InRunPos, isRemoveLabel)
{
    var DrawingDocument = this.m_oLogicDocument.DrawingDocument;

    if (!(Run instanceof AscCommonWord.ParaRun))
        return;

    var Paragraph = Run.Get_Paragraph();

    if (!Paragraph)
    {
        DrawingDocument.Collaborative_RemoveTarget(UserId);
        return;
    }

    var ParaContentPos = Paragraph.Get_PosByElement(Run);
    if (!ParaContentPos)
    {
        DrawingDocument.Collaborative_RemoveTarget(UserId);
        return;
    }
    ParaContentPos.Update(InRunPos, ParaContentPos.Get_Depth() + 1);

    var XY = Paragraph.Get_XYByContentPos(ParaContentPos);
    if (XY && XY.Height > 0.001)
    {
        var ShortId = this.m_aForeignCursorsId[UserId] ? this.m_aForeignCursorsId[UserId] : UserId;
        DrawingDocument.Collaborative_UpdateTarget(UserId, ShortId, XY.X, XY.Y, XY.Height, XY.PageNum, Paragraph.Get_ParentTextTransform());
        this.Add_ForeignCursorXY(UserId, XY.X, XY.Y, XY.PageNum, XY.Height, Paragraph, isRemoveLabel);

        if (true === this.m_aForeignCursorsToShow[UserId])
        {
            this.Show_ForeignCursorLabel(UserId);
            this.Remove_ForeignCursorToShow(UserId);
        }
    }
    else
    {
        DrawingDocument.Collaborative_RemoveTarget(UserId);
        this.Remove_ForeignCursorXY(UserId);
        this.Remove_ForeignCursorToShow(UserId);
    }
};
CWordCollaborativeEditing.prototype.Check_ForeignCursorsLabels = function(X, Y, PageIndex)
{
    if (!this.m_oLogicDocument)
        return;

    var DrawingDocument = this.m_oLogicDocument.Get_DrawingDocument();
    var Px7 = DrawingDocument.GetMMPerDot(7);
    var Px3 = DrawingDocument.GetMMPerDot(3);

    for (var UserId in this.m_aForeignCursorsXY)
    {
        var Cursor = this.m_aForeignCursorsXY[UserId];
        if ((true === Cursor.Transform && Cursor.PageIndex === PageIndex && Cursor.X0 - Px3 < X && X < Cursor.X1 + Px3 && Cursor.Y0 - Px3 < Y && Y < Cursor.Y1 + Px3)
            || (Math.abs(X - Cursor.X) < Px7 && Cursor.Y - Px3 < Y && Y < Cursor.Y + Cursor.H + Px3 && Cursor.PageIndex === PageIndex))
        {
                this.Show_ForeignCursorLabel(UserId);
        }
    }
};
CWordCollaborativeEditing.prototype.Show_ForeignCursorLabel = function(UserId)
{
    if (!this.m_oLogicDocument)
        return;

    var Api = this.m_oLogicDocument.Get_Api();
    var DrawingDocument = this.m_oLogicDocument.Get_DrawingDocument();

    if (!this.m_aForeignCursorsXY[UserId])
        return;

    var Cursor = this.m_aForeignCursorsXY[UserId];
    if (Cursor.ShowId)
        clearTimeout(Cursor.ShowId);

    Cursor.ShowId = setTimeout(function()
    {
        Cursor.ShowId = null;
        Api.sync_HideForeignCursorLabel(UserId);
    }, AscCommon.FOREIGN_CURSOR_LABEL_HIDETIME);

    var UserShortId = this.m_aForeignCursorsId[UserId] ? this.m_aForeignCursorsId[UserId] : UserId;
    var Color  = AscCommon.getUserColorById(UserShortId, null, true);
    var Coords = DrawingDocument.Collaborative_GetTargetPosition(UserId);
    if (!Color || !Coords)
        return;

    this.Update_ForeignCursorLabelPosition(UserId, Coords.X, Coords.Y, Color);
};
CWordCollaborativeEditing.prototype.Add_ForeignCursorToShow = function(UserId)
{
    this.m_aForeignCursorsToShow[UserId] = true;
};
CWordCollaborativeEditing.prototype.Remove_ForeignCursorToShow = function(UserId)
{
    delete this.m_aForeignCursorsToShow[UserId];
};
CWordCollaborativeEditing.prototype.Add_ForeignCursorXY = function(UserId, X, Y, PageIndex, H, Paragraph, isRemoveLabel)
{
    var Cursor;
    if (!this.m_aForeignCursorsXY[UserId])
    {
        Cursor = {X: X, Y: Y, H: H, PageIndex: PageIndex, Transform: false, ShowId: null};
        this.m_aForeignCursorsXY[UserId] = Cursor;
    }
    else
    {
        Cursor = this.m_aForeignCursorsXY[UserId];
        if (Cursor.ShowId)
        {
            if (true === isRemoveLabel)
            {
                var Api = this.m_oLogicDocument.Get_Api();
                clearTimeout(Cursor.ShowId);
                Cursor.ShowId = null;
                Api.sync_HideForeignCursorLabel(UserId);
            }
        }
        else
        {
            Cursor.ShowId = null;
        }

        Cursor.X         = X;
        Cursor.Y         = Y;
        Cursor.PageIndex = PageIndex;
        Cursor.H         = H;
    }

    var Transform = Paragraph.Get_ParentTextTransform();
    if (Transform)
    {
        Cursor.Transform = true;
        var X0 = Transform.TransformPointX(Cursor.X, Cursor.Y);
        var Y0 = Transform.TransformPointY(Cursor.X, Cursor.Y);
        var X1 = Transform.TransformPointX(Cursor.X, Cursor.Y + Cursor.H);
        var Y1 = Transform.TransformPointY(Cursor.X, Cursor.Y + Cursor.H);

        Cursor.X0 = Math.min(X0, X1);
        Cursor.Y0 = Math.min(Y0, Y1);
        Cursor.X1 = Math.max(X0, X1);
        Cursor.Y1 = Math.max(Y0, Y1);
    }
    else
    {
        Cursor.Transform = false;
    }

};
CWordCollaborativeEditing.prototype.Remove_ForeignCursorXY = function(UserId)
{
    if (this.m_aForeignCursorsXY[UserId])
    {
        if (this.m_aForeignCursorsXY[UserId].ShowId)
        {
            var Api = this.m_oLogicDocument.Get_Api();
            Api.sync_HideForeignCursorLabel(UserId);
            clearTimeout(this.m_aForeignCursorsXY[UserId].ShowId);
        }

        delete this.m_aForeignCursorsXY[UserId];
    }
};
CWordCollaborativeEditing.prototype.Update_ForeignCursorLabelPosition = function(UserId, X, Y, Color)
{
    if (!this.m_oLogicDocument)
        return;

    var Cursor = this.m_aForeignCursorsXY[UserId];
    if (!Cursor || !Cursor.ShowId)
        return;

    var Api = this.m_oLogicDocument.Get_Api();
    Api.sync_ShowForeignCursorLabel(UserId, X, Y, Color);
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CollaborativeEditing = new CWordCollaborativeEditing();