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

        if (historyitem_type_HdrFtr === Type)
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        else
            Class = g_oTableId.Get_ById(ClassId);

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
        var Pos = Binary.Pos
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

    this.m_bGlobalLock  = false;         // Запрещаем производить любые "редактирующие" действия (т.е. то, что в историю запишется)
    this.m_bGlobalLockSelection = false; // Запрещаем изменять селект и курсор
    this.m_aCheckLocks  = [];    // Массив для проверки залоченности объектов, которые мы собираемся изменять

    this.m_aNewObjects  = []; // Массив со списком чужих новых объектов
    this.m_aNewImages   = []; // Массив со списком картинок, которые нужно будет загрузить на сервере

    this.m_aDC          = {}; // Массив(ассоциативный) классов DocumentContent

    this.m_aChangedClasses = {}; // Массив(ассоциативный) классов, в которых есть изменения выделенные цветом

    this.m_oMemory      = new CMemory(); // Глобальные класс для сохранения

//    // CollaborativeEditing LOG
//    this.m_nErrorLog_PointChangesCount = 0;
//    this.m_nErrorLog_SavedPCC          = 0;
//    this.m_nErrorLog_CurPointIndex     = -1;
//    this.m_nErrorLog_SumIndex          = 0;

    var oThis = this;

    this.Clear = function()
    {
        this.m_nUseType     = 1;

        this.m_aUsers       = [];
        this.m_aChanges     = [];
        this.m_aNeedUnlock  = [];
        this.m_aNeedUnlock2 = [];
        this.m_aNeedLock    = [];
        this.m_aLinkData    = [];
        this.m_aEndActions  = [];
        this.m_aCheckLocks  = [];
        this.m_aNewObjects  = [];
        this.m_aNewImages   = [];
    };

    this.Is_SingleUser = function()
    {
        if (1 === this.m_nUseType)
            return true;

        return false;
    };

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
		editor._onUpdateDocumentCanSave();
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
//            // CollaborativeEditing LOG
//            this.m_nErrorLog_PointChangesCount++;
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

    this.Apply_Changes = function()
    {
        var OtherChanges = ( this.m_aChanges.length > 0 ? true : false );

        // Если нет чужих изменений, тогда и делать ничего не надо
        if ( true === OtherChanges )
        {
            editor.WordControl.m_oLogicDocument.Stop_Recalculate();
            editor.WordControl.m_oLogicDocument.EndPreview_MailMergeResult();

            editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);

            var LogicDocument = editor.WordControl.m_oLogicDocument;
            var DocState = LogicDocument.Get_SelectionState2();

            this.Clear_NewImages();

            this.Apply_OtherChanges();

            // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые были залочены
            this.Lock_NeedLock();

            LogicDocument.Set_SelectionState2( DocState );
            this.OnStart_Load_Objects();
        }
    };    
    
    this.Send_Changes = function()
    {
        // Пересчитываем позиции
        this.Refresh_DCChanges();

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
                aChanges.push(oChanges.m_pData);
            }
        }

        this.Release_Locks();

        var UnlockCount2 = this.m_aNeedUnlock2.length;
        for ( var Index = 0; Index < UnlockCount2; Index++ )
        {
            var Class = this.m_aNeedUnlock2[Index];
            Class.Lock.Set_Type( locktype_None, false);
            editor.CoAuthoringApi.releaseLocks( Class.Get_Id() );
        }

        this.m_aNeedUnlock.length  = 0;
        this.m_aNeedUnlock2.length = 0;

		var deleteIndex = ( null === History.SavedIndex ? null : SumIndex );
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

        // Обновляем интерфейс        
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

        // Перерисовываем документ (для обновления локов)
        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    };

    this.Release_Locks = function()
    {
        var UnlockCount = this.m_aNeedUnlock.length;
        for ( var Index = 0; Index < UnlockCount; Index++ )
        {
            var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
            if  ( locktype_Other3 != CurLockType && locktype_Other != CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_None, false);

                if ( this.m_aNeedUnlock[Index] instanceof CHeaderFooterController )
                    editor.sync_UnLockHeaderFooters();
                else if ( this.m_aNeedUnlock[Index] instanceof CDocument )
                    editor.sync_UnLockDocumentProps();
                else if ( this.m_aNeedUnlock[Index] instanceof CComment )
                    editor.sync_UnLockComment( this.m_aNeedUnlock[Index].Get_Id() );
                else if ( this.m_aNeedUnlock[Index] instanceof CGraphicObjects )
                    editor.sync_UnLockDocumentSchema();
            }
            else if ( locktype_Other3 === CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_Other, false);
            }
        }
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
            Inline : { Pos : 0, PageNum : 0 },
            Flow   : [],
            HdrFtr : [],
            Drawings: {
                All: true,
                Map:{}
            }
        };        

        LogicDocument.Reset_RecalculateCache();

        LogicDocument.Recalculate( false, false, RecalculateData );
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
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        LogicDocument.Comments.Check_MergeData();
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
            if ( -1 === this.m_nUseType )
                this.m_bGlobalLock = true;
            else
            {
                // Пробегаемся по массиву и проставляем, что залочено нами
                var Count = this.m_aCheckLocks.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    var oItem = this.m_aCheckLocks[Index];

                    if ( true !== oItem && false !== oItem ) // сравниваем по значению и типу обязательно
                    {
                        var Class = g_oTableId.Get_ById( oItem );
                        if ( null != Class )
                        {
                            Class.Lock.Set_Type( locktype_Mine, false );
                            this.Add_Unlock2( Class );
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
            // Здесь проверяем есть ли длинная операция, если она есть, то до ее окончания нельзя делать
            // Undo, иначе точка истории уберется, а изменения допишутся в предыдущую.
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

                    if ( true !== oItem && false !== oItem ) // сравниваем по значению и типу обязательно
                    {
                        var Class = g_oTableId.Get_ById( oItem );
                        if ( null != Class )
                        {
                            Class.Lock.Set_Type( locktype_Mine );
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

            editor.isChartEditor = false;
        }
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

    this.Clear_EndActions = function()
    {
        this.m_aEndActions.length = 0;
    };

    this.Add_EndActions = function(Class, Data)
    {
        this.m_aEndActions.push({Class : Class, Data : Data});
    };

    this.OnEnd_ReadForeignChanges = function()
    {
        var Count = this.m_aNewObjects.length;

        for ( var Index = 0; Index < Count; Index++ )
        {
            var Class = this.m_aNewObjects[Index];
            Class.FromBinary = false;
        }

        Count = this.m_aEndActions.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Item = this.m_aEndActions[Index];
            Item.Class.Process_EndLoad(Item.Data);
        }

        this.Clear_EndActions();
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

	this.getOwnLocksLength = function () {
		return this.m_aNeedUnlock2.length;
	};
}

var CollaborativeEditing = new CCollaborativeEditing();