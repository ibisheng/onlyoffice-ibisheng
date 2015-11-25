"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 25.07.12
 * Time: 12:01
 */

function CWordCollaborativeEditing()
{
    CWordCollaborativeEditing.superclass.constructor.call(this);

    this.m_oLogicDocument     = null;
    this.m_aDocumentPositions = new CDocumentPositionsManager();
    this.m_aForeignCursorsPos = new CDocumentPositionsManager();
    this.m_aForeignCursors    = {};
}

Asc.extendClass(CWordCollaborativeEditing, CCollaborativeEditingBase);

CWordCollaborativeEditing.prototype.Send_Changes = function(AdditionalInfo)
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
            var oChanges = new CCollaborativeChanges();
            oChanges.Set_FromUndoRedo(Item.Class, Item.Data, Item.Binary);
            aChanges.push(oChanges.m_pData);
        }
    }

    this.Release_Locks();

    var UnlockCount2 = this.m_aNeedUnlock2.length;
    for (var Index = 0; Index < UnlockCount2; Index++)
    {
        var Class = this.m_aNeedUnlock2[Index];
        Class.Lock.Set_Type(locktype_None, false);
        editor.CoAuthoringApi.releaseLocks(Class.Get_Id());
    }

    this.m_aNeedUnlock.length = 0;
    this.m_aNeedUnlock2.length = 0;

    var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );
    if (0 < aChanges.length || null !== deleteIndex)
        editor.CoAuthoringApi.saveChanges(aChanges, deleteIndex, AdditionalInfo);
    else
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
        History.Reset_SavedIndex();
    }

    // Обновляем интерфейс
    editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
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
        if (locktype_Other3 != CurLockType && locktype_Other != CurLockType)
        {
            this.m_aNeedUnlock[Index].Lock.Set_Type(locktype_None, false);

            if (this.m_aNeedUnlock[Index] instanceof CHeaderFooterController)
                editor.sync_UnLockHeaderFooters();
            else if (this.m_aNeedUnlock[Index] instanceof CDocument)
                editor.sync_UnLockDocumentProps();
            else if (this.m_aNeedUnlock[Index] instanceof CComment)
                editor.sync_UnLockComment(this.m_aNeedUnlock[Index].Get_Id());
            else if (this.m_aNeedUnlock[Index] instanceof CGraphicObjects)
                editor.sync_UnLockDocumentSchema();
        }
        else if (locktype_Other3 === CurLockType)
        {
            this.m_aNeedUnlock[Index].Lock.Set_Type(locktype_Other, false);
        }
    }
};
CWordCollaborativeEditing.prototype.OnEnd_Load_Objects = function()
{
    // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

    // Снимаем лок
    CollaborativeEditing.m_bGlobalLock = false;
    CollaborativeEditing.m_bGlobalLockSelection = false;

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

    editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);
};
CWordCollaborativeEditing.prototype.Check_MergeData = function()
{
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    LogicDocument.Comments.Check_MergeData();
};
CWordCollaborativeEditing.prototype.OnEnd_CheckLock = function()
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
                    var Class = g_oTableId.Get_ById(oItem);
                    if (null != Class)
                    {
                        Class.Lock.Set_Type(locktype_Mine, false);
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
    var oThis   = CollaborativeEditing;
    var oEditor = editor;

    if (true === oThis.m_bGlobalLock)
    {
        // Здесь проверяем есть ли длинная операция, если она есть, то до ее окончания нельзя делать
        // Undo, иначе точка истории уберется, а изменения допишутся в предыдущую.
        if (false == oEditor.asc_CheckLongActionCallback(oThis.OnCallback_AskLock, result))
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
                    var Class = g_oTableId.Get_ById(oItem);
                    if (null != Class)
                    {
                        Class.Lock.Set_Type(locktype_Mine);
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
CWordCollaborativeEditing.prototype.Add_ForeignCursor = function(UserId, DocumentPos)
{
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    this.m_aForeignCursors[UserId] = DocumentPos;
    this.m_aForeignCursorsPos.Add_DocumentPosition(DocumentPos);
};
CWordCollaborativeEditing.prototype.Remove_ForeignCursor = function(UserId)
{
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    delete this.m_aForeignCursors[UserId];
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
    var DrawingDocument = this.m_oLogicDocument.DrawingDocument;
    for (var UserId in this.m_aForeignCursors)
    {
        var DocPos = this.m_aForeignCursors[UserId];
        if (!DocPos || DocPos.length <= 0)
            continue;

        this.m_aForeignCursorsPos.Update_DocumentPosition(DocPos);

        var Run      = DocPos[DocPos.length - 1].Class;
        var InRunPos = DocPos[DocPos.length - 1].Position;

        if (!(Run instanceof ParaRun))
            continue;

        var Paragraph = Run.Get_Paragraph();
        if (!Paragraph)
        {
            DrawingDocument.Collaborative_RemoveTarget(UserId);
            continue;
        }

        var ParaContentPos = Paragraph.Get_PosByElement(Run);
        if (!ParaContentPos)
        {
            DrawingDocument.Collaborative_RemoveTarget(UserId);
            continue;
        }
        ParaContentPos.Update(InRunPos, ParaContentPos.Get_Depth() + 1);

        var XY = Paragraph.Get_XYByContentPos(ParaContentPos);
        if (XY && XY.Height > 0.001)
            DrawingDocument.Collaborative_UpdateTarget(UserId, XY.X, XY.Y, XY.Height, XY.PageNum, Paragraph.Get_ParentTextTransform());
        else
            DrawingDocument.Collaborative_RemoveTarget(UserId);
    }
};


var CollaborativeEditing = new CWordCollaborativeEditing();