"use strict";



function CCollaborativeEditing()
{
    CCollaborativeEditing.superclass.constructor.call(this);

    this.m_oLogicDocument     = null;
    this.m_aDocumentPositions = new CDocumentPositionsManager();
    this.m_aForeignCursorsPos = new CDocumentPositionsManager();
    this.m_aForeignCursors    = {};
    this.PosExtChangesX = [];
    this.PosExtChangesY = [];
    this.ScaleX = null;
    this.ScaleY = null;

}

Asc.extendClass(CCollaborativeEditing, CCollaborativeEditingBase);


CCollaborativeEditing.prototype.Send_Changes = function()
{
    // Пересчитываем позиции
    this.Refresh_DCChanges();
    this.RefreshPosExtChanges();

    // Генерируем свои изменения
    var StartPoint = ( null === History.SavedIndex ? 0 : History.SavedIndex + 1 );
    var LastPoint  = -1;
    if ( this.m_nUseType <= 0 )
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
    var StartPoint2 = Math.min( StartPoint, LastPoint + 1 );
    for ( var PointIndex = 0; PointIndex < StartPoint2; PointIndex++ )
    {
        var Point = History.Points[PointIndex];
        SumIndex += Point.Items.length;
    }
    var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );

    var aChanges = [];
    for ( var PointIndex = StartPoint; PointIndex <= LastPoint; PointIndex++ )
    {
        var Point = History.Points[PointIndex];

        History.Update_PointInfoItem(PointIndex, StartPoint, LastPoint, SumIndex, deleteIndex);
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];
            var oChanges = new CCollaborativeChanges();
            oChanges.Set_FromUndoRedo( Item.Class, Item.Data, Item.Binary );
            aChanges.push( oChanges.m_pData );
        }
    }


    var map = this.Release_Locks();

    var UnlockCount2 = this.m_aNeedUnlock2.length;
    for ( var Index = 0; Index < UnlockCount2; Index++ )
    {
        var Class = this.m_aNeedUnlock2[Index];
        Class.Lock.Set_Type( locktype_None, false);
        if(Class.getObjectType && Class.getObjectType() === historyitem_type_Slide)
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
        }
        if(Class instanceof PropLocker)
        {
            var Class2 = g_oTableId.Get_ById(Class.objectId);
            if(Class2 && Class2.getObjectType && Class2.getObjectType() === historyitem_type_Slide && Class2.deleteLock === Class)
            {
                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class2.num);
            }
        }

        var check_obj = null;
        if(Class.getObjectType)
        {
            if( (Class.getObjectType() === historyitem_type_Shape
                || Class.getObjectType() === historyitem_type_ImageShape
                || Class.getObjectType() === historyitem_type_GroupShape
                || Class.getObjectType() === historyitem_type_GraphicFrame
                || Class.getObjectType() === historyitem_type_ChartSpace) && isRealObject(Class.parent))
            {
                if(Class.parent && isRealNumber(Class.parent.num))
                {
                    map[Class.parent.num] = true;
                }

                check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": Class.parent.Get_Id(),
                    "objId": Class.Get_Id(),
                    "guid": Class.Get_Id()
                };
            }
            else if(Class.getObjectType() === historyitem_type_Slide)
            {
                check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": Class.Get_Id(),
                    "guid": Class.Get_Id()
                };
            }
            if(check_obj)
                editor.CoAuthoringApi.releaseLocks( check_obj );
        }
    }


    var num_arr = [];
    if(editor.WordControl.m_oDrawingDocument.IsLockObjectsEnable)
    {
        for(var key in map)
        {
            if(map.hasOwnProperty(key))
            {
                num_arr.push(parseInt(key, 10));
            }
        }
        num_arr.sort(fSortAscending);
    }
    this.m_aNeedUnlock.length  = 0;
    this.m_aNeedUnlock2.length = 0;

    if (0 < aChanges.length || null !== deleteIndex)
        editor.CoAuthoringApi.saveChanges(aChanges, deleteIndex);
    else
        editor.CoAuthoringApi.unLockDocument(true);

    if ( -1 === this.m_nUseType )
    {
        // Чистим Undo/Redo только во время совместного редактирования
        History.Clear();
        History.SavedIndex = null;
    }
    else if ( 0 === this.m_nUseType )
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

    for(var i = 0; i < num_arr.length; ++i)
    {
        editor.WordControl.m_oDrawingDocument.OnRecalculatePage(num_arr[i], editor.WordControl.m_oLogicDocument.Slides[num_arr[i]]);
    }
    if(num_arr.length > 0)
    {
        editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
    }
    editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

    // editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
    //    editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
};

CCollaborativeEditing.prototype.Release_Locks = function()
{
    var map_redraw = {};
    var UnlockCount = this.m_aNeedUnlock.length;
    for ( var Index = 0; Index < UnlockCount; Index++ )
    {
        var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
        if  ( locktype_Other3 != CurLockType && locktype_Other != CurLockType )
        {
            //if(this.m_aNeedUnlock[Index] instanceof Slide)                                                      //TODO: проверять LockObject
            //    editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(this.m_aNeedUnlock[Index].num);
            var Class =  this.m_aNeedUnlock[Index];
            this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_None, false);
            if ( Class instanceof PropLocker )
            {
                var object = g_oTableId.Get_ById(Class.objectId);
                if(object instanceof CPresentation)
                {
                    if(Class === editor.WordControl.m_oLogicDocument.themeLock)
                    {
                        editor.asc_fireCallback("asc_onUnLockDocumentTheme");
                    }
                    else if(Class === editor.WordControl.m_oLogicDocument.schemeLock)
                    {
                        editor.asc_fireCallback("asc_onUnLockDocumentSchema");
                    }
                    else if(Class === editor.WordControl.m_oLogicDocument.slideSizeLock)
                    {
                        editor.asc_fireCallback("asc_onUnLockDocumentProps");
                    }
                }
                if(object.getObjectType && object.getObjectType() === historyitem_type_Slide && object.deleteLock === Class)
                {
                    editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(object.num);
                }
            }
            if(Class instanceof CComment)
            {
                editor.sync_UnLockComment(Class.Get_Id());
            }
        }
        else if ( locktype_Other3 === CurLockType )
        {
            this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_Other, false);
            if(this.m_aNeedUnlock[Index] instanceof Slide)
                editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(this.m_aNeedUnlock[Index].num);
        }
        if(this.m_aNeedUnlock[Index].parent && isRealNumber(this.m_aNeedUnlock[Index].parent.num))
        {
            map_redraw[this.m_aNeedUnlock[Index].parent.num] = true;
        }
    }
    return map_redraw;
};

CCollaborativeEditing.prototype.OnEnd_Load_Objects = function()
{
    // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

    // Снимаем лок
    CollaborativeEditing.m_bGlobalLock = false;
    CollaborativeEditing.m_bGlobalLockSelection = false;

    // Запускаем полный пересчет документа
    var LogicDocument = editor.WordControl.m_oLogicDocument;

    var RecalculateData =
    {
        Drawings: {
            All: true
        },
        Map: {

        }
    };

    LogicDocument.Recalculate(RecalculateData);
    LogicDocument.Document_UpdateSelectionState();
    LogicDocument.Document_UpdateInterfaceState();

    editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);
};

CCollaborativeEditing.prototype.OnEnd_CheckLock = function()
{
    var aIds = [];

    var Count = this.m_aCheckLocks.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var oItem = this.m_aCheckLocks[Index];

        if ( true === oItem ) // сравниваем по значению и типу обязательно
            return true;
        else if ( false !== oItem )
            aIds.push( oItem );
    }

    if ( aIds.length > 0 )
    {
        // Отправляем запрос на сервер со списком Id
        editor.CoAuthoringApi.askLock( aIds, this.OnCallback_AskLock );

        // Ставим глобальный лок, только во время совместного редактирования
        if ( true === this.m_bUse )
            this.m_bGlobalLock = true;
        else
        {
            // Пробегаемся по массиву и проставляем, что залочено нами
            var Count = this.m_aCheckLocks.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var oItem = this.m_aCheckLocks[Index];
                var items = [];
                switch(oItem["type"])
                {
                    case c_oAscLockTypeElemPresentation.Object:
                    {
                        items.push(oItem["objId"]);
                        items.push(oItem["slideId"]);
                        break;
                    }
                    case c_oAscLockTypeElemPresentation.Slide:
                    {
                        items.push(oItem["val"]);
                        break;
                    }
                    case c_oAscLockTypeElemPresentation.Presentation:
                    {
                        break;
                    }
                }

                for(var i = 0; i < items.length; ++i)
                {
                    var item = items[i];
                    if ( true !== item && false !== item ) // сравниваем по значению и типу обязательно
                    {
                        var Class = g_oTableId.Get_ById( item );
                        if ( null != Class )
                        {
                            Class.Lock.Set_Type( locktype_Mine, false );
                            if(Class instanceof Slide)
                                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
                            this.Add_Unlock2( Class );
                        }
                    }
                }
            }

            this.m_aCheckLocks.length = 0;
        }
    }

    return false;
};

CCollaborativeEditing.prototype.OnCallback_AskLock = function(result)
{
    if (true === CollaborativeEditing.m_bGlobalLock)
    {
        if (false == editor.asc_CheckLongActionCallback(CollaborativeEditing.OnCallback_AskLock, result))
            return;

        // Снимаем глобальный лок
        CollaborativeEditing.m_bGlobalLock = false;

        if (result["lock"])
        {
            // Пробегаемся по массиву и проставляем, что залочено нами

            var Count = CollaborativeEditing.m_aCheckLocks.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var oItem = CollaborativeEditing.m_aCheckLocks[Index];
                var item;
                switch(oItem["type"])
                {
                    case c_oAscLockTypeElemPresentation.Object:
                    {
                        item = oItem["objId"];
                        break;
                    }
                    case c_oAscLockTypeElemPresentation.Slide:
                    {
                        item = oItem["val"];
                        break;
                    }
                    case c_oAscLockTypeElemPresentation.Presentation:
                    {
                        break;
                    }
                }
                if ( true !== oItem && false !== oItem ) // сравниваем по значению и типу обязательно
                {
                    var Class = g_oTableId.Get_ById( item );
                    if ( null != Class )
                    {
                        Class.Lock.Set_Type( locktype_Mine );
                        if(Class instanceof Slide)
                            editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
                        CollaborativeEditing.Add_Unlock2( Class );
                    }
                }
            }
        }
        else if (result["error"])
        {
            // Если у нас началось редактирование диаграммы, а вернулось, что ее редактировать нельзя,
            // посылаем сообщение о закрытии редактора диаграмм.
            if ( true === editor.isChartEditor )
                editor.sync_closeChartEditor();

            // Делаем откат на 1 шаг назад и удаляем из Undo/Redo эту последнюю точку
            editor.WordControl.m_oLogicDocument.Document_Undo();
            History.Clear_Redo();
        }

    }
    editor.isChartEditor = false;
};

CCollaborativeEditing.prototype.AddPosExtChanges = function(Item, bHor)
{
    if(bHor)
    {
        this.PosExtChangesX.push(Item);
    }
    else
    {
        this.PosExtChangesY.push(Item);
    }
};


CCollaborativeEditing.prototype.RewriteChanges = function(changesArr, scale, Binary_Writer)
{
    for(var i = 0; i < changesArr.length; ++i)
    {
        var changes = changesArr[i];
        var data = changes.Data;
        data.newPr *= scale;
        var Binary_Pos = Binary_Writer.GetCurPosition();
        changes.Class.Save_Changes(data, Binary_Writer);
        var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;
        changes.Binary.Pos = Binary_Pos;
        changes.Binary.Len = Binary_Len;
    }
};

CCollaborativeEditing.prototype.RefreshPosExtChanges = function()
{
    if(this.ScaleX != null && this.ScaleY != null)
    {
        this.RewriteChanges(this.PosExtChangesX, this.ScaleX, History.BinaryWriter);
        this.RewriteChanges(this.PosExtChangesY, this.ScaleY, History.BinaryWriter);
    }
    this.PosExtChangesX.length = 0;
    this.PosExtChangesY.length = 0;
    this.ScaleX = null;
    this.ScaleY = null;
};

CCollaborativeEditing.prototype.Update_ForeignCursorsPositions = function()
{
    var DrawingDocument = editor.WordControl.m_oDrawingDocument;
    var oPresentation = editor.WordControl.m_oLogicDocument;
    var oCurSlide = oPresentation.Slides[oPresentation.CurPage];
    var oTargetDocContentOrTable;
    if(oCurSlide){
        oTargetDocContentOrTable = oCurSlide.graphicObjects.getTargetDocContent(undefined, true);
    }
    if(!oTargetDocContentOrTable){
        for (var UserId in this.m_aForeignCursors){
            DrawingDocument.Collaborative_RemoveTarget(UserId);
        }
        return;
    }
    var bTable = (oTargetDocContentOrTable instanceof CTable);
    for (var UserId in this.m_aForeignCursors){
        var DocPos = this.m_aForeignCursors[UserId];
        if (!DocPos || DocPos.length <= 0)
            continue;

        this.m_aForeignCursorsPos.Update_DocumentPosition(DocPos);

        var Run      = DocPos[DocPos.length - 1].Class;
        var InRunPos = DocPos[DocPos.length - 1].Position;

        if (!(Run instanceof ParaRun))
            continue;

        var Paragraph = Run.Get_Paragraph();
        if (!Paragraph || !Paragraph.Parent){
            DrawingDocument.Collaborative_RemoveTarget(UserId);
            continue;
        }

        if(!bTable){
            if(oTargetDocContentOrTable !== Paragraph.Parent){
                DrawingDocument.Collaborative_RemoveTarget(UserId);
                continue;
            }
        }
        else{
            if(!Paragraph.Parent.Parent || !Paragraph.Parent.Parent.Row ||
                !Paragraph.Parent.Parent.Row.Table || Paragraph.Parent.Parent.Row.Table !== oTargetDocContentOrTable){
                DrawingDocument.Collaborative_RemoveTarget(UserId);
                continue;
            }
        }

        var ParaContentPos = Paragraph.Get_PosByElement(Run);
        if (!ParaContentPos){
            DrawingDocument.Collaborative_RemoveTarget(UserId);
            continue;
        }

        ParaContentPos.Update(InRunPos, ParaContentPos.Get_Depth() + 1);

        var XY = Paragraph.Get_XYByContentPos(ParaContentPos);
        if (XY && XY.Height > 0.001)
            DrawingDocument.Collaborative_UpdateTarget(UserId, XY.X, XY.Y, XY.Height, oPresentation.CurPage, Paragraph.Get_ParentTextTransform());
        else
            DrawingDocument.Collaborative_RemoveTarget(UserId);
    }
};

var CollaborativeEditing = new CCollaborativeEditing();