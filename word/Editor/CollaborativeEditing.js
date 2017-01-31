/*
 * (c) Copyright Ascensio System SIA 2010-2017
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

    this.m_nAllChangesSavedIndex = 0;

    this.m_aAllChanges        = []; // Список всех изменений
	this.m_aOwnChangesIndexes = []; // Список номеров своих изменений в общем списке, которые мы можем откатить

	this.m_oOwnChanges        = [];
}

AscCommon.extendClass(CWordCollaborativeEditing, AscCommon.CCollaborativeEditingBase);

CWordCollaborativeEditing.prototype.Send_Changes = function(IsUserSave, AdditionalInfo, IsUpdateInterface)
{
    // Пересчитываем позиции
    this.Refresh_DCChanges();

    // Генерируем свои изменения
    var StartPoint = ( null === AscCommon.History.SavedIndex ? 0 : AscCommon.History.SavedIndex + 1 );
    var LastPoint = -1;

    if (this.m_nUseType <= 0)
    {
        // (ненужные точки предварительно удаляем)
        AscCommon.History.Clear_Redo();
        LastPoint = AscCommon.History.Points.length - 1;
    }
    else
    {
        LastPoint = AscCommon.History.Index;
    }

    // Просчитаем сколько изменений на сервер пересылать не надо
    var SumIndex = 0;
    var StartPoint2 = Math.min(StartPoint, LastPoint + 1);
    for (var PointIndex = 0; PointIndex < StartPoint2; PointIndex++)
    {
        var Point = AscCommon.History.Points[PointIndex];
        SumIndex += Point.Items.length;
    }
    var deleteIndex = ( null === AscCommon.History.SavedIndex ? null : SumIndex );

    var aChanges = [], aChanges2 = [];
    for (var PointIndex = StartPoint; PointIndex <= LastPoint; PointIndex++)
    {
        var Point = AscCommon.History.Points[PointIndex];
        AscCommon.History.Update_PointInfoItem(PointIndex, StartPoint, LastPoint, SumIndex, deleteIndex);

        for (var Index = 0; Index < Point.Items.length; Index++)
        {
            var Item = Point.Items[Index];
            var oChanges = new AscCommon.CCollaborativeChanges();
            oChanges.Set_FromUndoRedo(Item.Class, Item.Data, Item.Binary);

			if (Item.Data.IsChangesClass && Item.Data.IsChangesClass())
				aChanges2.push(Item.Data);
			else
				aChanges2.push(oChanges.m_pDatay);

            aChanges.push(oChanges.m_pData);
        }
    }

    var UnlockCount = this.m_aNeedUnlock.length;
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

	var deleteIndex = ( null === AscCommon.History.SavedIndex ? null : SumIndex );
	if (0 < aChanges.length || null !== deleteIndex)
	{
		this.private_OnSendOwnChanges(aChanges2, deleteIndex);
		editor.CoAuthoringApi.saveChanges(aChanges, deleteIndex, AdditionalInfo);
		AscCommon.History.CanNotAddChanges = true;
	}
	else
	{
		editor.CoAuthoringApi.unLockDocument(true);
	}

    if (-1 === this.m_nUseType)
    {
        // Чистим Undo/Redo только во время совместного редактирования
        AscCommon.History.Clear();
        AscCommon.History.SavedIndex = null;
    }
    else if (0 === this.m_nUseType)
    {
        // Чистим Undo/Redo только во время совместного редактирования
        AscCommon.History.Clear();
        AscCommon.History.SavedIndex = null;

        this.m_nUseType = 1;
    }
    else
    {
        // Обновляем точку последнего сохранения в истории
        AscCommon.History.Reset_SavedIndex(IsUserSave);
    }

    if (false !== IsUpdateInterface)
    {
        // Обновляем интерфейс
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }

    // TODO: Пока у нас обнуляется история на сохранении нужно обновлять Undo/Redo
    editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

    // Свои локи не проверяем. Когда все пользователи выходят, происходит перерисовка и свои локи уже не рисуются.
    if (0 !== UnlockCount || 1 !== this.m_nUseType)
    {
        // Перерисовываем документ (для обновления локов)
        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    }

    editor.WordControl.m_oLogicDocument.Check_CompositeInputRun();
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
    AscCommon.CollaborativeEditing.Set_GlobalLock(false);
    AscCommon.CollaborativeEditing.Set_GlobalLockSelection(false);

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
		{
			this.Set_GlobalLock(true);
		}
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

    if (true === oThis.Get_GlobalLock())
    {
        // Здесь проверяем есть ли длинная операция, если она есть, то до ее окончания нельзя делать
        // Undo, иначе точка истории уберется, а изменения допишутся в предыдущую.
        if (false == oEditor.checkLongActionCallback(oThis.OnCallback_AskLock, result))
            return;

        // Снимаем глобальный лок
        oThis.Set_GlobalLock(false);

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
            AscCommon.History.Clear_Redo();
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
//----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------
CWordCollaborativeEditing.prototype.private_ClearChanges = function()
{
	this.m_aChanges = [];
};
CWordCollaborativeEditing.prototype.private_CollectOwnChanges = function()
{
	var StartPoint = ( null === AscCommon.History.SavedIndex ? 0 : AscCommon.History.SavedIndex + 1 );
	var LastPoint  = -1;

	if (this.m_nUseType <= 0)
		LastPoint = AscCommon.History.Points.length - 1;
	else
		LastPoint = AscCommon.History.Index;

	for (var PointIndex = StartPoint; PointIndex <= LastPoint; PointIndex++)
	{
		var Point = AscCommon.History.Points[PointIndex];
		for (var Index = 0; Index < Point.Items.length; Index++)
		{
			var Item = Point.Items[Index];
			if (Item.Data.IsChangesClass && Item.Data.IsChangesClass())
				this.m_oOwnChanges.push(Item.Data);
		}
	}
};
CWordCollaborativeEditing.prototype.private_AddOverallChange = function(oChange)
{
	// Здесь мы должны смержить пришедшее изменение с одним из наших изменений
	for (var nIndex = 0, nCount = this.m_oOwnChanges.length; nIndex < nCount; ++nIndex)
	{
		if (oChange && oChange.Merge && false === oChange.Merge(this.m_oOwnChanges[nIndex]))
			return false;
	}

	this.m_aAllChanges.push(oChange);
	return true;
};
CWordCollaborativeEditing.prototype.private_OnSendOwnChanges = function(arrChanges, nDeleteIndex)
{
	if (null !== nDeleteIndex)
	{
		this.m_aAllChanges.length = this.m_nAllChangesSavedIndex + nDeleteIndex;
	}
	else
	{
		this.m_nAllChangesSavedIndex = this.m_aAllChanges.length;
	}

	// TODO: Пока мы делаем это как одну точку, которую надо откатить. Надо пробежаться по массиву и разбить его
	//       по отдельным действиям. В принципе, данная схема срабатывает в быстром совместном редактировании,
	//       так что как правило две точки не успевают попасть в одно сохранение.
	if (arrChanges.length > 0)
	{
		this.m_aOwnChangesIndexes.push({
			Position : this.m_aAllChanges.length,
			Count    : arrChanges.length
		});

		this.m_aAllChanges = this.m_aAllChanges.concat(arrChanges);
	}
};
CWordCollaborativeEditing.prototype.Undo = function()
{
	if (true === this.Get_GlobalLock())
		return;

	if (this.m_aOwnChangesIndexes.length <= 0)
		return false;

	// Формируем новую пачку действий, которые будут откатывать нужные нам действия.

	// На первом шаге мы заданнуюю пачку изменений коммутируем с последними измениями. Смотрим на то какой набор
	// изменений у нас получается.
	// Объектная модель у нас простая: класс, в котором возможно есть массив элементов(тоже классов), у которого воможно
	// есть набор свойств. Поэтому у нас ровно 2 типа изменений: изменения внутри массива элементов, либо изменения
	// свойств. Изменения этих двух типов коммутируют между собой, изменения разных классов тоже коммутируют.
	var arrChanges    = [];
	var oIndexes      = this.m_aOwnChangesIndexes[this.m_aOwnChangesIndexes.length - 1];
	var nPosition     = oIndexes.Position;
	var nCount        = oIndexes.Count;
	var nOverallCount = this.m_aAllChanges.length;

	var oContentChangesMap = {

	};

	for (var nIndex = nCount - 1; nIndex >= 0; --nIndex)
	{
		var oChange = this.m_aAllChanges[nPosition + nIndex];
		if (!oChange || !oChange.IsChangesClass || !oChange.IsChangesClass())
			continue;

		var oClass = oChange.GetClass();
		if (oChange.IsContentChange())
		{
			var _oChange = oChange.Copy();

			if (this.private_CommutateContentChanges(oContentChangesMap, oClass, _oChange, nPosition + nCount))
				arrChanges.splice(0, 0, _oChange);
		}
		else
		{
			var _oChange = oChange; // TODO: Тут надо бы сделать копирование

			if (this.private_CommutatePropertyChanges(oClass, _oChange, nPosition + nCount))
				arrChanges.splice(0, 0, _oChange);
		}
	}

	// Удаляем запись о последнем изменении
	this.m_aOwnChangesIndexes.length = this.m_aOwnChangesIndexes.length - 1;

	var arrReverseChanges = [];
	for (var nIndex = 0, nCount = arrChanges.length; nIndex < nCount; ++nIndex)
	{
		var oReverseChange = arrChanges[nIndex].CreateReverseChange();
		if (oReverseChange)
			arrReverseChanges.splice(0, 0, oReverseChange);
	}

	// Накатываем изменения в данном клиенте
	var oLogicDocument = this.m_oLogicDocument;

	oLogicDocument.DrawingDocument.EndTrackTable(null, true);
	oLogicDocument.DrawingObjects.TurnOffCheckChartSelection();

	var DocState = this.private_SaveDocumentState();

	for (var nIndex = 0, nCount = arrReverseChanges.length; nIndex < nCount; ++nIndex)
	{
		arrReverseChanges[nIndex].Load();
		this.m_aAllChanges.push(arrReverseChanges[nIndex]);
	}

	// Может так случиться, что в каких-то классах DocumentContent удалились все элементы, либо
	// в классе Paragraph удалился знак конца параграфа. Нам необходимо проверить все классы на корректность, и если
	// нужно, добавить дополнительные изменения.

	var mapDocumentContents = {};
	var mapParagraphs       = {};
	for (var nIndex = 0, nCount = arrReverseChanges.length; nIndex < nCount; ++nIndex)
	{
		var oChange = arrReverseChanges[nIndex];
		var oClass  = oChange.GetClass();
		if (oClass instanceof AscCommonWord.CDocument || oClass instanceof AscCommonWord.CDocumentContent)
			mapDocumentContents[oClass.Get_Id()] = oClass;
		else if (oClass instanceof AscCommonWord.Paragraph)
			mapParagraphs[oClass.Get_Id()] = oClass;
		else if (oClass.IsParagraphContentElement && true === oClass.IsParagraphContentElement() && true === oChange.IsContentChange() && oClass.Get_Paragraph())
			mapParagraphs[oClass.Get_Paragraph().Get_Id()] = oClass.Get_Paragraph();
	}

	// Создаем точку в истории. Делаем действия через обычные функции (с отключенным пересчетом), которые пишут в
	// историю. Сохраняем список изменений в новой точке, удаляем данную точку.
	var oHistory = AscCommon.History;
	oHistory.CreateNewPointForCollectChanges();
	for (var sId in mapDocumentContents)
	{
		var oDocumentContent = mapDocumentContents[sId];
		if (oDocumentContent.Content.length <= 0)
		{
			var oNewParagraph = new AscCommonWord.Paragraph(oLogicDocument.Get_DrawingDocument(), oDocumentContent, 0, 0, 0, 0, 0, false);
			oDocumentContent.Add_ToContent(0, oNewParagraph);
		}
	}
	for (var sId in mapParagraphs)
	{
		var oParagraph = mapParagraphs[sId];
		oParagraph.Correct_Content();
		oParagraph.CheckParaEnd();
	}
	var oHistoryPoint = oHistory.Points[oHistory.Points.length - 1];
	for (var nIndex = 0, nCount = oHistoryPoint.Items.length; nIndex < nCount; ++nIndex)
	{
		arrReverseChanges.push(oHistoryPoint.Items[nIndex].Data);
	}
	oHistory.Remove_LastPoint();

	var oBinaryWriter = AscCommon.History.BinaryWriter;
	var aSendingChanges = [];
	for (var nIndex = 0, nCount = arrReverseChanges.length; nIndex < nCount; ++nIndex)
	{
		var oReverseChange = arrReverseChanges[nIndex];
		var oChangeClass   = oReverseChange.GetClass();

		var nBinaryPos = oBinaryWriter.GetCurPosition();
		oBinaryWriter.WriteString2(oChangeClass.Get_Id());
		oBinaryWriter.WriteLong(oReverseChange.Type);
		oReverseChange.WriteToBinary(oBinaryWriter);

		var nBinaryLen = oBinaryWriter.GetCurPosition() - nBinaryPos;

		var oChange = new AscCommon.CCollaborativeChanges();
		oChange.Set_FromUndoRedo(oChangeClass, oReverseChange, {Pos : nBinaryPos, Len : nBinaryLen});
		aSendingChanges.push(oChange.m_pData);
	}
	editor.CoAuthoringApi.saveChanges(aSendingChanges, null, null);

	this.private_RestoreDocumentState(DocState);

	oLogicDocument.DrawingObjects.TurnOnCheckChartSelection();
	oLogicDocument.Recalculate(false, false, AscCommon.History.Get_RecalcData(null, arrReverseChanges));

	oLogicDocument.Document_UpdateSelectionState();
	oLogicDocument.Document_UpdateInterfaceState();
	oLogicDocument.Document_UpdateRulersState();
};
CWordCollaborativeEditing.prototype.CanUndo = function()
{
	return this.m_aOwnChangesIndexes.length <= 0 ? false : true;
};
CWordCollaborativeEditing.prototype.private_CommutateContentChanges = function(oMap, oClass, oChange, nStartPosition)
{
	var arrOtherActions = [];

	if (oMap[oClass.Get_Id()])
	{
		arrOtherActions = oMap[oClass.Get_Id()];
	}
	else
	{
		for (var nIndex = nStartPosition, nOverallCount = this.m_aAllChanges.length; nIndex < nOverallCount; ++nIndex)
		{
			var oTempChange = this.m_aAllChanges[nIndex];
			if (!oTempChange || !oTempChange.IsChangesClass || !oTempChange.IsChangesClass())
				continue;

			if (oChange.IsRelated(oTempChange))
			{
				arrOtherActions.push(oTempChange.ConvertToSimpleActions());
			}
		}

		oMap[oClass.Get_Id()] = arrOtherActions;
	}

	var arrActions = oChange.ConvertToSimpleActions();

	var arrCommutateActions = [];
	for (var nActionIndex = arrActions.length - 1; nActionIndex >= 0; --nActionIndex)
	{
		var oAction = arrActions[nActionIndex];
		var oResult = oAction;

		for (var nIndex = 0, nOtherActionsCount = arrOtherActions.length; nIndex < nOtherActionsCount; ++nIndex)
		{
			var arrOActions = arrOtherActions[nIndex];
			for (var nIndex2 = 0, nOtherActionsCount2 = arrOActions.length; nIndex2 < nOtherActionsCount2; ++nIndex2)
			{
				var oOtherAction = arrOActions[nIndex2];

				if (false === this.private_Commutate(oAction, oOtherAction))
				{
					arrOActions.splice(nIndex2, 1);
					oResult = null;
					break;
				}
			}

			if (null === oResult)
				break;
		}

		if (null !== oResult)
			arrCommutateActions.push(oResult);
	}

	if (arrCommutateActions.length > 0)
		oChange.ConvertFromSimpleActions(arrCommutateActions);
	else
		return false;

	return true;
};
CWordCollaborativeEditing.prototype.private_Commutate = function(oActionL, oActionR)
{
	if (oActionL.Add)
	{
		if (oActionR.Add)
		{
			if (oActionL.Pos >= oActionR.Pos)
				oActionL.Pos++;
			else
				oActionR.Pos--;
		}
		else
		{
			if (oActionL.Pos > oActionR.Pos)
				oActionL.Pos--;
			else if (oActionL.Pos === oActionR.Pos)
				return false;
			else
				oActionR.Pos--;
		}
	}
	else
	{
		if (oActionR.Add)
		{
			if (oActionL.Pos >= oActionR.Pos)
				oActionL.Pos++;
			else
				oActionR.Pos++;
		}
		else
		{
			if (oActionL.Pos > oActionR.Pos)
				oActionL.Pos--;
			else
				oActionR.Pos++;
		}
	}

	return true;
};
CWordCollaborativeEditing.prototype.private_CommutatePropertyChanges = function(oClass, oChange, nStartPosition)
{
	// В GoogleDocs если 2 пользователя исправляют одно и тоже свойство у одного и того же класса, тогда Undo работает
	// у обоих. Например, первый выставляет параграф по центру (изначально по левому), второй после этого по правому
	// краю. Тогда на Undo первого пользователя возвращает параграф по левому краю, а у второго по центру, неважно в
	// какой последовательности они вызывают Undo.
	// Далем как у них: т.е. изменения свойств мы всегда откатываем, даже если данное свойсво менялось в последующих
	// изменениях.

	// Здесь вариант: свойство не откатываем, если оно менялось в одном из последующих действий. (для работы этого
	// варианта нужно реализовать функцию IsRelated у всех изменений).

	// // Значит это изменение свойства. Пробегаемся по всем следующим изменениям и смотрим, менялось ли такое
	// // свойство у данного класса, если да, тогда данное изменение невозможно скоммутировать.
	// for (var nIndex = nStartPosition, nOverallCount = this.m_aAllChanges.length; nIndex < nOverallCount; ++nIndex)
	// {
	// 	var oTempChange = this.m_aAllChanges[nIndex];
	// 	if (!oTempChange || !oTempChange.IsChangesClass || !oTempChangeIsChangesClass())
	// 		continue;
	//
	// 	if (oChange.IsRelated(oTempChange))
	// 		return false;
	// }

	return true;
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CWordCollaborativeEditing = CWordCollaborativeEditing;
window['AscCommon'].CollaborativeEditing = new CWordCollaborativeEditing();
