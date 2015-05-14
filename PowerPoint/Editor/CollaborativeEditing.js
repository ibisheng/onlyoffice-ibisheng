"use strict";

/**
 * User: Ilja.Kirillov
 * Date: 25.07.12
 * Time: 12:01
 */

function CCollaborativeChanges()
{
    this.m_pData         = null;
    this.m_oColor        = null;

    this.Set_Data = function(pData)
    {
        this.m_pData = pData;
    };

    this.Set_Color = function(oColor)
    {
        this.m_oColor = oColor;
    };

    this.Set_FromUndoRedo = function(Class, Data, Binary)
    {
        if ( "undefined" === typeof(Class.Get_Id) )
            return false;


        // Преобразуем данные в бинарный файл
        this.m_pData  = this.Internal_Save_Data( Class, Data, Binary );

        return true;
    };


    this.Apply_Data = function()
    {
        var LoadData  = this.Internal_Load_Data(this.m_pData);
        var ClassId   = LoadData.Reader.GetString2();
        var ReaderPos = LoadData.Reader.GetCurPos();
        var Type      = LoadData.Reader.GetLong();
        var Class     = null;

        Class = g_oTableId.Get_ById(ClassId);
        //console.log(ClassId);
        LoadData.Reader.Seek2(ReaderPos);

        if (null != Class)
            return Class.Load_Changes(LoadData.Reader, LoadData.Reader2, this.m_oColor);
        else
            return false;
    };

    this.Internal_Load_Data = function(szSrc)
    {
        var srcLen = szSrc.length;
        var index =  -1;

        while (true)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                break;
            }
        }

        var bPost = false;
        // Ищем следующее вхождение ";"
        while (index < srcLen)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                bPost = true;
                break;
            }
        }

        if ( true === bPost )
            return { Reader : this.Internal_Load_Data2(szSrc, 0, index - 1), Reader2 : this.Internal_Load_Data2(szSrc, index, srcLen ) };
        else
            return { Reader : this.Internal_Load_Data2(szSrc, 0, szSrc.length), Reader2 : null };
    };

    this.Internal_Load_Data2 = function(szSrc, offset, srcLen)
    {
        var nWritten = 0;

        var index =  -1 + offset;
        var dst_len = "";

        while (true)
        {
            index++;
            var _c = szSrc.charCodeAt(index);
            if (_c == ";".charCodeAt(0))
            {
                index++;
                break;
            }

            dst_len += String.fromCharCode(_c);
        }

        var dstLen = parseInt(dst_len);

        var pointer = g_memory.Alloc(dstLen);
        var stream = new FT_Stream2(pointer.data, dstLen);
        stream.obj = pointer.obj;

        var dstPx = stream.data;

        if (window.chrome)
        {
            while (index < srcLen)
            {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i=0; i<4; i++)
                {
                    if (index >= srcLen)
                        break;
                    var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                    if (nCh == -1)
                    {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }

                dwCurr <<= 24-nBits;
                for (i=0; i<nBits/8; i++)
                {
                    dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }
        else
        {
            var p = b64_decode;
            while (index < srcLen)
            {
                var dwCurr = 0;
                var i;
                var nBits = 0;
                for (i=0; i<4; i++)
                {
                    if (index >= srcLen)
                        break;
                    var nCh = p[szSrc.charCodeAt(index++)];
                    if (nCh == undefined)
                    {
                        i--;
                        continue;
                    }
                    dwCurr <<= 6;
                    dwCurr |= nCh;
                    nBits += 6;
                }

                dwCurr <<= 24-nBits;
                for (i=0; i<nBits/8; i++)
                {
                    dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
                    dwCurr <<= 8;
                }
            }
        }

        return stream;
    };

    this.Internal_Save_Data = function(Class, Data, Binary)
    {
        var Writer = History.BinaryWriter;
        var Pos = Binary.Pos;
        var Len = Binary.Len;

        if ( "undefined" != typeof(Class.Save_Changes2) )
        {
            var Writer2 = CollaborativeEditing.m_oMemory;
            Writer2.Seek(0);
            if ( true === Class.Save_Changes2( Data, Writer2 ) )
                return Len + ";" + Writer.GetBase64Memory2(Pos, Len) + ";" + Writer2.GetCurPosition() + ";" + Writer2.GetBase64Memory();
        }

        return Len + ";" + Writer.GetBase64Memory2(Pos, Len);
    };
}
function CCollaborativeEditing()
{
    this.m_nUseType     = 1;  // 1 - 1 клиент и мы сохраняем историю, -1 - несколько клиентов, 0 - переход из -1 в 1

    this.m_aUsers       = []; // Список текущих пользователей, редактирующих данный документ
    this.m_aChanges     = []; // Массив с изменениями других пользователей
    this.m_aNeedUnlock  = []; // Массив со списком залоченных объектов(которые были залочены другими пользователями)
    this.m_aNeedUnlock2 = []; // Массив со списком залоченных объектов(которые были залочены на данном клиенте)
    this.m_aNeedLock    = []; // Массив со списком залоченных объектов(которые были залочены, но еще не были добавлены на данном клиенте)

    this.m_aLinkData    = []; // Массив, указателей, которые нам надо выставить при загрузке чужих изменений
    this.m_aEndActions  = []; // Массив действий, которые надо выполнить после принятия чужих изменений


    this.PosExtChangesX = [];
    this.PosExtChangesY = [];
    this.ScaleX = null;
    this.ScaleY = null;

    var oThis = this;

    this.m_bGlobalLock  = false;         // Запрещаем производить любые "редактирующие" действия (т.е. то, что в историю запишется)
    this.m_bGlobalLockSelection = false; // Запрещаем изменять селект и курсор
    this.m_aCheckLocks  = [];    // Массив для проверки залоченности объектов, которые мы собираемся изменять

    this.m_aNewObjects  = []; // Массив со списком чужих новых объектов
    this.m_aNewImages   = []; // Массив со списком картинок, которые нужно будет загрузить на сервере

    this.m_aDC          = {}; // Массив(ассоциативный) классов DocumentContent

    this.m_aChangedClasses = {}; // Массив(ассоциативный) классов, в которых есть изменения выделенные цветом

    this.m_oMemory      = new CMemory(); // Глобальные класс для сохранения

    var oThis = this;


    this.Start_CollaborationEditing = function()
    {
        this.m_nUseType = -1;
    };

    this.End_CollaborationEditing = function()
    {
        if ( this.m_nUseType <= 0 )
            this.m_nUseType = 0;
    };

    this.Add_User = function(UserId)
    {
        if ( -1 === this.Find_User(UserId) )
            this.m_aUsers.push( UserId );
    };

    this.Find_User = function(UserId)
    {
        var Len = this.m_aUsers.length;
        for ( var Index = 0; Index < Len; Index++ )
        {
            if ( this.m_aUsers[Index] === UserId )
                return Index;
        }

        return -1;
    };

    this.Remove_User = function(UserId)
    {
        var Pos = this.Find_User( UserId );
        if ( -1 != Pos )
            this.m_aUsers.splice( Pos, 1 );
    };

    this.Add_Changes = function(Changes)
    {
        this.m_aChanges.push( Changes );
    };

    this.Add_Unlock = function(LockClass)
    {
        this.m_aNeedUnlock.push( LockClass );
    };

    this.Add_Unlock2 = function(Lock)
    {
        this.m_aNeedUnlock2.push( Lock );
    };

    this.Apply_OtherChanges = function()
    {
        // Чтобы заново созданные параграфы не отображались залоченными
        g_oIdCounter.Set_Load( true );

		// Применяем изменения, пока они есть
		var _count = this.m_aChanges.length;
		for (var i = 0; i < _count; i++)
        {
            if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["CheckNextChange"])
            {
                if (!window["native"]["CheckNextChange"]())
                    break;
            }
        
            var Changes = this.m_aChanges[i];
            Changes.Apply_Data();
        }
		
		this.m_aChanges = [];

        // У новых элементов выставляем указатели на другие классы
        this.Apply_LinkData();

        // Делаем проверки корректности новых изменений
        this.Check_MergeData();

        this.OnEnd_ReadForeignChanges();

        g_oIdCounter.Set_Load( false );
    };

    this.Get_SelfChanges = function()
    {
        // Генерируем свои изменения
        var aChanges = [];
        var PointsCount = History.Points.length;
        for ( var PointIndex = 0; PointIndex < PointsCount; PointIndex++ )
        {
            var Point = History.Points[PointIndex];
            var LastPoint = Point.Items.length;

            for ( var Index = 0; Index < LastPoint; Index++ )
            {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo( Item.Class, Item.Data, Item.Binary );
                // Изменения могут обрабатываться другим кодом, поэтому здесь
                // явно указываются имена свойств, что бы избежать их последующей
                // минимизации.
                aChanges.push( {"id": oChanges.m_sId, "data": oChanges.m_pData} );
            }
        }
        return aChanges;
    };

    this.getOwnLocksLength = function () {
        return this.m_aNeedUnlock2.length;
    };

    this.Apply_Changes = function()
    {
        var OtherChanges = ( this.m_aChanges.length > 0 ? true : false );
        if(OtherChanges === true)
        {
            editor.WordControl.m_oLogicDocument.Stop_Recalculate();

            editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);

            var LogicDocument = editor.WordControl.m_oLogicDocument;

            if(LogicDocument.Slides[LogicDocument.CurPage])
            {
                LogicDocument.Slides[LogicDocument.CurPage].graphicObjects.resetSelect();
            }
            this.Clear_NewImages();
            this.Apply_OtherChanges();
            // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые били залочены
            this.Lock_NeedLock();
            this.OnStart_Load_Objects();
        }
    };

    this.Send_Changes = function()
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

    this.Release_Locks = function()
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

    this.OnStart_Load_Objects = function()
    {
        oThis.m_bGlobalLock = true;
        oThis.m_bGlobalLockSelection = true;

        // Вызываем функцию для загрузки необходимых элементов (новые картинки и шрифты)
        editor.pre_Save(oThis.m_aNewImages);
    };

    this.OnEnd_Load_Objects = function()
    {
        // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

        // Снимаем лок
        oThis.m_bGlobalLock = false;
        oThis.m_bGlobalLockSelection = false;

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
//-----------------------------------------------------------------------------------
// Функции для работы с ссылками, у новых объектов
//-----------------------------------------------------------------------------------
    this.Clear_LinkData = function()
    {
        this.m_aLinkData.length = 0;
    };

    this.Add_LinkData = function(Class, LinkData)
    {
        this.m_aLinkData.push( { Class : Class, LinkData : LinkData } );
    };

    this.Apply_LinkData = function()
    {
        var Count = this.m_aLinkData.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Item = this.m_aLinkData[Index];
            Item.Class.Load_LinkData( Item.LinkData );
        }

        this.Clear_LinkData();
    };
//-----------------------------------------------------------------------------------
// Функции для проверки корректности новых изменений
//-----------------------------------------------------------------------------------
    this.Check_MergeData = function()
    {
        //var LogicDocument = editor.WordControl.m_oLogicDocument;
        //LogicDocument.Comments.Check_MergeData();
    };
//-----------------------------------------------------------------------------------
// Функции для проверки залоченности объектов
//-----------------------------------------------------------------------------------
    this.Get_GlobalLock = function()
    {
        return this.m_bGlobalLock;
    };

    this.OnStart_CheckLock = function()
    {
        this.m_aCheckLocks.length = 0;
    };

    this.Add_CheckLock = function(oItem)
    {
        this.m_aCheckLocks.push( oItem );
    };

    this.OnEnd_CheckLock = function()
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

    this.OnCallback_AskLock = function(result)
    {
        if (true === oThis.m_bGlobalLock)
        {
            if (false == editor.asc_CheckLongActionCallback(oThis.OnCallback_AskLock, result))
                return;

            // Снимаем глобальный лок
            oThis.m_bGlobalLock = false;

            if (result["lock"])
            {
                // Пробегаемся по массиву и проставляем, что залочено нами

                var Count = oThis.m_aCheckLocks.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var oItem = oThis.m_aCheckLocks[Index];
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
                            oThis.Add_Unlock2( Class );
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
//-----------------------------------------------------------------------------------
// Функции для работы с залоченными объектами, которые еще не были добавлены
//-----------------------------------------------------------------------------------
    this.Reset_NeedLock = function()
    {
        this.m_aNeedLock = {};
    };

    this.Add_NeedLock = function(Id, sUser)
    {
        this.m_aNeedLock[Id] = sUser;
    };

    this.Remove_NeedLock = function(Id)
    {
        delete this.m_aNeedLock[Id];
    };

    this.Lock_NeedLock = function()
    {
        for ( var Id in this.m_aNeedLock )
        {
            var Class = g_oTableId.Get_ById( Id );

            if ( null != Class )
            {
                var Lock = Class.Lock;
                Lock.Set_Type( locktype_Other, false );
                if(Class instanceof Slide)
                    editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
                Lock.Set_UserId( this.m_aNeedLock[Id] );
            }
        }

        this.Reset_NeedLock();
    };
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
    this.Clear_NewObjects = function()
    {
        this.m_aNewObjects.length = 0;
    };

    this.Add_NewObject = function(Class)
    {
        this.m_aNewObjects.push( Class );
        Class.FromBinary = true;
    };

    this.OnEnd_ReadForeignChanges = function()
    {
        var Count = this.m_aNewObjects.length;

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Class = this.m_aNewObjects[Index];
            Class.FromBinary = false;
        }

        this.Clear_NewObjects();
    };
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
    this.Clear_NewImages = function()
    {
        this.m_aNewImages.length = 0;
    };

    this.Add_NewImage = function(Url)
    {
        this.m_aNewImages.push( Url );
    };
//-----------------------------------------------------------------------------------
// Функции для работы с массивом m_aDC
//-----------------------------------------------------------------------------------
    this.Add_NewDC = function(Class)
    {
        var Id = Class.Get_Id();
        this.m_aDC[Id] = Class;
    };

    this.Clear_DCChanges = function()
    {
        for ( var Id in this.m_aDC )
        {
            this.m_aDC[Id].Clear_ContentChanges();
        }

        // Очищаем массив
        this.m_aDC = {};
    };

    this.Refresh_DCChanges = function()
    {
        for ( var Id in this.m_aDC )
        {
            this.m_aDC[Id].Refresh_ContentChanges();
        }

        this.Clear_DCChanges();
    };

    this.AddPosExtChanges = function(Item, bHor)
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


    this.RewriteChanges = function(changesArr, scale, Binary_Writer)
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

    this.RefreshPosExtChanges = function()
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

//-----------------------------------------------------------------------------------
// Функции для работы с отметками изменений
//-----------------------------------------------------------------------------------
    this.Add_ChangedClass = function(Class)
    {
        var Id = Class.Get_Id();
        this.m_aChangedClasses[Id] = Class;
    };

    this.Clear_CollaborativeMarks = function(bRepaint)
    {
        for ( var Id in this.m_aChangedClasses )
        {
            this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
        }

        // Очищаем массив
        this.m_aChangedClasses = {};

        if ( true === bRepaint )
        {
            editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
            editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
        }
    };

}

var CollaborativeEditing = new CCollaborativeEditing();