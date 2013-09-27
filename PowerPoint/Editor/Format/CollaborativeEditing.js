/**
 * User: Ilja.Kirillov
 * Date: 25.07.12
 * Time: 12:01
 */

function CIdCounter()
{
    this.m_sUserId        = null;
    this.m_bLoad          = true;
    this.m_nIdCounterLoad = 0; // Счетчик Id для загрузки
    this.m_nIdCounterEdit = 0; // Счетчик Id для работы

    this.Get_NewId = function()
    {
        if ( true === this.m_bLoad || null === this.m_sUserId )
        {
            this.m_nIdCounterLoad++;
            return ("" + this.m_nIdCounterLoad);
        }
        else
        {
            this.m_nIdCounterEdit++;
            return ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
        }
    };

    this.Set_UserId = function(sUserId)
    {
        this.m_sUserId = sUserId;
    };

    this.Set_Load = function(bValue)
    {
        this.m_bLoad = bValue;
    };
}

var g_oIdCounter = new CIdCounter();

function CTableId()
{
    this.m_aPairs   = new Object();
    this.m_bTurnOff = false;

    this.Add = function(Class, Id)
    {
        if ( false === this.m_bTurnOff )
        {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;

            History.Add( this, { Type : historyitem_TableId_Add, Id : Id, Class : Class  } );
        }
    };

    this.Add( this, g_oIdCounter.Get_NewId() );

    // Получаем указатель на класс по Id
    this.Get_ById = function(Id)
    {
        if ( "" === Id )
            return null;

        if ( "undefined" != typeof(this.m_aPairs[Id]) )
            return this.m_aPairs[Id];

        return null;
    };

    // Получаем Id, по классу (вообще, данную функцию лучше не использовать)
    this.Get_ByClass = function(Class)
    {
        if ( "undefined" != typeof( Class.Get_Id ) )
            return Class.Get_Id();

        if ( "undefined" != typeof( Class.GetId() ) )
            return Class.GetId();

        return null;
    };

    this.Reset_Id = function(Class, Id_new, Id_old)
    {
        if ( Class === this.m_aPairs[Id_old] )
        {
            delete this.m_aPairs[Id_old];
            this.m_aPairs[Id_new] = Class;

            History.Add( this, { Type : historyitem_TableId_Reset, Id_new : Id_new, Id_old : Id_old  } );
        }
        else
        {
            this.Add( Class, Id_new );
        }
    };

    this.Get_Id = function()
    {
        return this.Id;
    };
//-----------------------------------------------------------------------------------
// Функции для работы с Undo/Redo
//-----------------------------------------------------------------------------------
    this.Undo = function(Data)
    {
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    };

    this.Redo = function(Redo)
    {
        // Ничего не делаем (можно удалять/добавлять ссылки на классы в данном классе
        // но это не обяательно, т.к. Id всегда уникальные)
    };

    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем, добавление/удаление классов не влияет на пересчет
    };
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
    this.Read_Class_FromBinary = function(Reader)
    {
        var ElementType = Reader.GetLong();
        var Element = null;

        // Временно отключаем регистрацию новых классов
        this.m_bTurnOff = true;

        switch( ElementType )
        {
            case historyitem_type_Paragraph        : Element = new Paragraph(); break;
            case historyitem_type_TextPr           : Element = new ParaTextPr(); break;
            case historyitem_type_Hyperlink        : Element = new ParaHyperlinkStart(); break;
            case historyitem_type_Drawing          : Element = new ParaDrawing(); break;
            case historyitem_type_DrawingObjects   : Element = new CDrawingObjects(); break;
            case historyitem_type_FlowObjects      : Element = new FlowObjects(); break;
            case historyitem_type_FlowImage        : Element = new FlowImage(); break;
            case historyitem_type_Table            : Element = new CTable(); break;
            case historyitem_type_TableRow         : Element = new CTableRow(); break;
            case historyitem_type_TableCell        : Element = new CTableCell(); break;
            case historyitem_type_DocumentContent  : Element = new CDocumentContent(); break;
            case historyitem_type_FlowTable        : Element = new FlowTable(); break;
            case historyitem_type_HdrFtr           : Element = new CHeaderFooter(); break;
            case historyitem_type_AbstractNum      : Element = new CAbstractNum(); break;
            case historyitem_type_Comment          : Element = new CComment(); break;
            case historyitem_type_Shape            : Element = new CShape(); break;
            case historyitem_type_Image            : Element = new CImageShape(); break;
            case historyitem_type_GroupShapes      : Element = new CGroupShape(); break;
			case historyitem_type_Chart		       : Element = new CChartData(true); break;
            case historyitem_type_Slide		       : Element = new Slide(); break;
            case historyitem_type_PropLocker       : Element = new PropLocker(); break;
            case historyitem_type_Layout           : Element = new SlideLayout(); break;
            case historyitem_type_TextBody         : Element = new CTextBody(); break;
            case historyitem_type_GraphicFrame     : Element = new CGraphicFrame(); break;
            case historyitem_type_SlideMaster      : Element = new MasterSlide(); break;
            case historyitem_type_Theme            : Element = new CTheme(); break;
         }

        Element.Read_FromBinary2(Reader);

        // Включаем назад регистрацию новых классов
        this.m_bTurnOff = false;

        return Element;
    };

    this.Save_Changes = function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_TableId );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );
        switch ( Type )
        {
            case historyitem_TableId_Add :
            {
                // String   : Id элемента
                // Varibale : сам элемент

                Writer.WriteString2( Data.Id );
                Data.Class.Write_ToBinary2( Writer );

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                Writer.WriteString2( Data.Id_new );
                Writer.WriteString2( Data.Id_old );

                break;
            }
        }
    };

    this.Save_Changes2 = function(Data, Writer)
    {
        return false;
    };

    this.Load_Changes = function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_TableId != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_TableId_Add:
            {
                // String   : Id элемента
                // Varibale : сам элемент

                var Id    = Reader.GetString2();
                var Class = this.Read_Class_FromBinary( Reader );

                this.m_aPairs[Id] = Class;

                break;
            }

            case historyitem_TableId_Reset:
            {
                // String : Id_new
                // String : Id_old

                var Id_new = Reader.GetString2();
                var Id_old = Reader.GetString2();

                if ( "undefined" != this.m_aPairs[Id_old] )
                {
                    var Class = this.m_aPairs[Id_old];
                    delete this.m_aPairs[Id_old];
                    this.m_aPairs[Id_new] = Class;
                }

                break;
            }

        }

        return true;
    };

    this.Unlock = function(Data)
    {
        // Ничего не делаем
    };
}

var g_oTableId = null;

function CCollaborativeChanges()
{
    this.m_sId           = null;
    this.m_pData         = null;

    this.Set_Id = function(sId)
    {
        this.m_sId = sId;
    };

    this.Set_Data = function(pData)
    {
        this.m_pData = pData;
    };

    this.Set_FromUndoRedo = function(Class, Data, Binary)
    {
        if ( "undefined" === typeof(Class.Get_Id) )
            return false;

        this.m_sId    = Class.Get_Id();

        // Преобразуем данные в бинарный файл
        this.m_pData  = this.Internal_Save_Data( Class, Data, Binary );

        return true;
    };

    this.Apply_Data = function()
    {
        var LoadData = this.Internal_Load_Data( this.m_pData );
        var Type = LoadData.Reader.GetLong();
        var Class = null;

        if ( historyitem_type_HdrFtr === Type )
        {
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        }
        else
            Class = g_oTableId.Get_ById( this.m_sId );

        LoadData.Reader.Seek2(0);

        if ( null != Class )
            return Class.Load_Changes( LoadData.Reader, LoadData.Reader2 );
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
            Writer.Seek(0);
            if ( true === Class.Save_Changes2( Data, Writer2 ) )
                return Len + ";" + Writer.GetBase64Memory2(Pos, Len) + ";" + Writer2.GetCurPosition() + ";" + Writer2.GetBase64Memory();
        }

        return Len + ";" + Writer.GetBase64Memory2(Pos, Len);
    };
}

function CCollaborativeEditing()
{
    this.m_bUse         = false; // началось ли совместное редактирование

    this.m_aUsers       = []; // Список текущих пользователей, редактирующих данный документ
    this.m_aChanges     = []; // Массив с изменениями других пользователей
    this.m_aNeedUnlock  = []; // Массив со списком залоченных объектов(которые были залочены другими пользователями)
    this.m_aNeedUnlock2 = []; // Массив со списком залоченных объектов(которые были залочены на данном клиенте)
    this.m_aNeedLock    = []; // Массив со списком залоченных объектов(которые были залочены, но еще не были добавлены на данном клиенте)

    this.m_aLinkData    = []; // Массив, указателей, которые нам надо выставить при загрузке чужих изменений

    this.m_bGlobalLock  = false;
    this.m_aCheckLocks  = [];    // Массив для проверки залоченности объектов, которые мы собираемся изменять

    this.m_aNewObjects  = []; // Массив со списком чужих новых объектов
    this.m_aNewImages   = []; // Массив со списком картинок, которые нужно будет загрузить на сервере

    this.m_aDC          = {}; // Массив(ассоциативный) классов DocumentContent

    this.m_aChangedClasses = {}; // Массив(ассоциативный) классов, в которых есть изменения выделенные цветом

    this.m_oMemory      = new CMemory(); // Глобальные класс для сохранения

    var oThis = this;

    this.Start_CollaborationEditing = function()
    {
        this.m_bUse = true;
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
        while ( this.m_aChanges.length > 0 )
        {
            var Changes = this.m_aChanges[0];
            Changes.Apply_Data();

            this.m_aChanges.splice( 0, 1 );
        }

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
        var aChanges = new Array();
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
        // Пока не началось совместное редактирование, мы ничего не делаем
        if ( true != this.m_bUse )
        {
            editor.CoAuthoringApi.saveChanges( new Array() );
            return;
        }

        editor.WordControl.m_oLogicDocument.Stop_Recalculate();

		editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.ApplyChanges);

        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var DocState = LogicDocument.Get_SelectionState2();

        this.Clear_NewImages();

        this.Apply_OtherChanges();

        // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые били залочены
        this.Lock_NeedLock();

        LogicDocument.Set_SelectionState2( DocState );

        this.OnStart_Load_Objects();
    };

    this.Send_Changes = function()
    {
        // Пока не началось совместное редактирование, мы ничего не делаем
        if ( true != this.m_bUse )
            return;

        // Пересчитываем позиции
       this.Refresh_DCChanges();

        // Генерируем свои изменения (ненужные точки предварительно удаляем)
        History.Clear_Redo();
        var aChanges = new Array();
        var PointsCount = History.Points.length;
        for ( var PointIndex = 0; PointIndex < PointsCount; PointIndex++ )
        {
            var Point = History.Points[PointIndex];

            for ( var Index = 0; Index < Point.Items.length; Index++ )
            {
                var Item = Point.Items[Index];
                var oChanges = new CCollaborativeChanges();
                oChanges.Set_FromUndoRedo( Item.Class, Item.Data, Item.Binary );
                aChanges.push( oChanges );
            }
        }

        var UnlockCount = this.m_aNeedUnlock.length;
        for ( var Index = 0; Index < UnlockCount; Index++ )
        {
            var CurLockType = this.m_aNeedUnlock[Index].Lock.Get_Type();
            if  ( locktype_Other3 != CurLockType && locktype_Other != CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_None, false);
                if(this.m_aNeedUnlock[Index] instanceof Slide)
                    editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(this.m_aNeedUnlock[Index].num);

                /*if ( this.m_aNeedUnlock[Index] instanceof CHeaderFooterController )
                    editor.sync_UnLockHeaderFooters();
                else if ( this.m_aNeedUnlock[Index] instanceof CDocument )
                    editor.sync_UnLockDocumentProps();
                else if ( this.m_aNeedUnlock[Index] instanceof CComment )
                    editor.sync_UnLockComment( this.m_aNeedUnlock[Index].Get_Id() );
                else if ( this.m_aNeedUnlock[Index] instanceof CGraphicObjects )
                    editor.sync_UnLockDocumentSchema();   */

                var Class =  this.m_aNeedUnlock[Index];
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
                }
            }
            else if ( locktype_Other3 === CurLockType )
            {
                this.m_aNeedUnlock[Index].Lock.Set_Type( locktype_Other, false);
                if(this.m_aNeedUnlock[Index] instanceof Slide)
                    editor.WordControl.m_oLogicDocument.DrawingDocument.LockSlide(this.m_aNeedUnlock[Index].num);
            }
        }

        var UnlockCount2 = this.m_aNeedUnlock2.length;
        for ( var Index = 0; Index < UnlockCount2; Index++ )
        {
            var Class = this.m_aNeedUnlock2[Index];
            Class.Lock.Set_Type( locktype_None, false);
            if(Class instanceof Slide)
                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);

            var check_obj = null;
            if(Class instanceof CShape
                || Class instanceof CImageShape
                || Class instanceof CGroupShape
                )
            {
                check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": Class.parent.Get_Id(),
                    "objId": Class.Get_Id(),
                    "guid": Class.Get_Id()
                };
            }
            else if(Class instanceof Slide)
            {
                check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": Class.Get_Id(),
                    "guid": Class.Get_Id()
                };
            }
            if(isRealObject(check_obj))
                editor.CoAuthoringApi.releaseLocks( check_obj );
        }

        this.m_aNeedUnlock.length  = 0;
        this.m_aNeedUnlock2.length = 0;

        editor.CoAuthoringApi.saveChanges(aChanges);

        // Чистим Undo/Redo
        History.Clear();
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();

        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    };

    this.OnStart_Load_Objects = function()
    {
        oThis.m_bGlobalLock = true;

        // Вызываем функцию для загрузки необходимых элементов (новые картинки и шрифты)
        editor.pre_Save(oThis.m_aNewImages);
    };

    this.OnEnd_Load_Objects = function()
    {
        // Данная функция вызывается, когда загрузились внешние объекты (картинки и шрифты)

        // Снимаем лок
        oThis.m_bGlobalLock = false;

        // Запускаем полный пересчет документа
        var LogicDocument = editor.WordControl.m_oLogicDocument;

        var RecalculateData =
        {
            Inline : { Pos : 0, PageNum : 0 },
            Flow   : new Array(),
            HdrFtr : new Array()
        };

       /* var HdrFtr_Content = LogicDocument.HdrFtr.Content[0];

        if ( null != HdrFtr_Content.Header.First )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Header.First );
        if ( null != HdrFtr_Content.Footer.First )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Footer.First );
        if ( null != HdrFtr_Content.Header.Even )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Header.Even );
        if ( null != HdrFtr_Content.Footer.Even )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Footer.Even );
        if ( null != HdrFtr_Content.Header.Odd )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Header.Odd );
        if ( null != HdrFtr_Content.Footer.Odd )
            RecalculateData.HdrFtr.push( HdrFtr_Content.Footer.Odd ); */

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
        var aIds = new Array();

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
                                Class.Lock.Set_Type( locktype_Mine );
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

var changestype_None                 =  0; // Ничего не происходит с выделенным элементом (проверка идет через дополнительный параметр)
var changestype_Paragraph_Content    =  1; // Добавление/удаление элементов в параграф
var changestype_Paragraph_Properties =  2; // Изменение свойств параграфа
var changestype_Document_Content     = 10; // Добавление/удаление элементов в Document или в DocumentContent
var changestype_Document_Content_Add = 11; // Добавление элемента в класс Document или в класс DocumentContent
var changestype_Document_SectPr      = 12; // Изменения свойств данной секции (размер страницы, поля и ориентация)
var changestype_Table_Properties     = 20; // Любые изменения в таблице
var changestype_Table_RemoveCells    = 21; // Удаление ячеек (строк или столбцов)
var changestype_Image_Properties     = 23; // Изменения настроек картинки
var changestype_HdrFtr               = 30; // Изменения в колонтитуле (любые изменения)
var changestype_Remove               = 40; // Удаление, через кнопку backspace (Удаление назад)
var changestype_Delete               = 41; // Удаление, через кнопку delete (Удаление вперед)
var changestype_Drawing_Props        = 51; // Изменение свойств фигуры
var changestype_ColorScheme          = 60; // Изменение свойств фигуры
var changestype_Text_Props           = 61; // Изменение свойств фигуры
var changestype_RemoveSlide          = 62; // Изменение свойств фигуры
var changestype_PresentationProps    = 63; // Изменение темы, цветовой схемы, размера слайда;
var changestype_Theme                = 64; // Изменение темы;
var changestype_SlideSize            = 65; // Изменение цветовой схемы;
var changestype_SlideBg              = 66; // Изменение цветовой схемы;
var changestype_SlideTiming          = 67; // Изменение цветовой схемы;
var changestype_MoveComment          = 68;
var changestype_AddSp                = 69;
var changestype_AddComment           = 70;
var changestype_Layout               = 71;
var changestype_AddShape             = 71;








var changestype_2_InlineObjectMove       = 1; // Передвигаем объект в заданную позцию (проверяем место, в которое пытаемся передвинуть)
var changestype_2_HdrFtr                 = 2; // Изменения с колонтитулом
var changestype_2_Comment                = 3; // Работает с комментариями
var changestype_2_Element_and_Type       = 4; // Проверяем возможно ли сделать изменение заданного типа с заданным элементом(а не с текущим)
var changestype_2_ElementsArray_and_Type = 5; // Аналогично предыдущему, только идет массив элементов

var locktype_None   = 1; // никто не залочил данный объект
var locktype_Mine   = 2; // данный объект залочен текущим пользователем
var locktype_Other  = 3; // данный объект залочен другим(не текущим) пользователем
var locktype_Other2 = 4; // данный объект залочен другим(не текущим) пользователем (обновления уже пришли)
var locktype_Other3 = 5; // данный объект был залочен (обновления пришли) и снова стал залочен

function CLock()
{
    this.Type   = locktype_None;
    this.UserId = null;

    this.Get_Type = function()
    {
        return this.Type;
    };

    this.Set_Type = function(NewType, Redraw)
    {
        if ( NewType === locktype_None )
            this.UserId = null;

        this.Type = NewType;

        if ( false != Redraw )
        {
            // TODO: переделать перерисовку тут
            var DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            DrawingDocument.ClearCachePages();
            DrawingDocument.FirePaint();
        }
    };

    this.Check = function(lockObject)
    {
        if ( this.Type === locktype_Mine )
            CollaborativeEditing.Add_CheckLock( false );
        else if ( this.Type === locktype_Other || this.Type === locktype_Other2 || this.Type === locktype_Other3 )
            CollaborativeEditing.Add_CheckLock( true );
        else
            CollaborativeEditing.Add_CheckLock( lockObject );
    };

    this.Lock = function(bMine)
    {
        if ( locktype_None === this.Type )
        {
            if ( true === bMine )
                this.Type = locktype_Mine;
            else
                true.Type = locktype_Other;
        }
    };

    this.Is_Locked = function()
    {
        if ( locktype_None != this.Type && locktype_Mine != this.Type )
            return true;

        return false;
    };

    this.Set_UserId = function(UserId)
    {
        this.UserId = UserId;
    };

    this.Get_UserId = function()
    {
        return this.UserId;
    };

    this.Have_Changes = function()
    {
        if ( locktype_Other2 === this.Type || locktype_Other3 === this.Type )
            return true;

        return false;
    };
}

var contentchanges_Add    = 1;
var contentchanges_Remove = 2;

function CContentChangesElement(Type, Pos, Count, Data)
{
    this.m_nType  = Type;  // Тип изменений (удаление или добавление)
    this.m_nPos   = Pos;   // Позиция, в которой произошли изменения
    this.m_nCount = Count; // Количество добавленных/удаленных элементов
    this.m_pData  = Data;  // Связанные с данным изменением данные из истории

    this.Refresh_BinaryData = function()
    {
        var Binary_Writer = History.BinaryWriter;
        var Binary_Pos = Binary_Writer.GetCurPosition();

        this.m_pData.Data.UseArray = true;
        this.m_pData.Data.PosArray = this.m_aPositions;

        this.m_pData.Class.Save_Changes( this.m_pData.Data, Binary_Writer );

        var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;

        this.m_pData.Binary.Pos = Binary_Pos;
        this.m_pData.Binary.Len = Binary_Len;
    };

    this.Check_Changes = function(Type, Pos)
    {
        var CurPos = Pos;
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos <= this.m_aPositions[Index] )
                        this.m_aPositions[Index]++;
                    else
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                }
            }
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < this.m_nCount; Index++ )
            {
                if ( false !== this.m_aPositions[Index] )
                {
                    if ( CurPos < this.m_aPositions[Index] )
                        this.m_aPositions[Index]--;
                    else if ( CurPos > this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Add === this.m_nType )
                            CurPos++;
                        else //if ( contentchanges_Remove === this.m_nType )
                            CurPos--;
                    }
                    else //if ( CurPos === this.m_aPositions[Index] )
                    {
                        if ( contentchanges_Remove === this.m_nType )
                        {
                            // Отмечаем, что действия совпали
                            this.m_aPositions[Index] = false;
                            return false;
                        }
                        else
                        {
                            CurPos++;
                        }
                    }
                }
            }
        }

        return CurPos;
    };

    this.Make_ArrayOfSimpleActions = function(Type, Pos, Count)
    {
        // Разбиваем действие на простейшие
        var Positions = new Array();
        if ( contentchanges_Add === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos + Index;
        }
        else //if ( contentchanges_Remove === Type )
        {
            for ( var Index = 0; Index < Count; Index++ )
                Positions[Index] = Pos;
        }

        return Positions;
    };

    // Разбиваем сложное действие на простейшие
    this.m_aPositions = this.Make_ArrayOfSimpleActions( Type, Pos, Count );
}

function CContentChanges()
{
    this.m_aChanges = new Array();

    this.Add = function(Changes)
    {
        this.m_aChanges.push( Changes );
    };

    this.Clear = function()
    {
        this.m_aChanges.length = 0;
    };

    this.Check = function(Type, Pos)
    {
        var CurPos = Pos;
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var NewPos = this.m_aChanges[Index].Check_Changes(Type, CurPos);
            if ( false === NewPos )
                return false;

            CurPos = NewPos;
        }

        return CurPos;
    };

    this.Refresh = function()
    {
        var Count = this.m_aChanges.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.m_aChanges[Index].Refresh_BinaryData();
        }
    };
}

function comparePresentationBlock(newBlock, oldBlock) {
    var resultLock = false;

    switch (newBlock.type) {
        case c_oAscLockTypeElemPresentation.Presentation:
            if (c_oAscLockTypeElemPresentation.Presentation === oldBlock.type)
                resultLock = newBlock.val === oldBlock.val;
            break;
        case c_oAscLockTypeElemPresentation.Slide:
            if (c_oAscLockTypeElemPresentation.Slide === oldBlock.type)
                resultLock = newBlock.val === oldBlock.val;
            else if (c_oAscLockTypeElemPresentation.Object === oldBlock.type)
                resultLock = newBlock.val === oldBlock.slideId;
            break;
        case c_oAscLockTypeElemPresentation.Object:
            if (c_oAscLockTypeElemPresentation.Slide === oldBlock.type)
                resultLock = newBlock.slideId === oldBlock.val;
            else if (c_oAscLockTypeElemPresentation.Object === oldBlock.type)
                resultLock = newBlock.objId === oldBlock.objId;
            break;
    }
    return resultLock;
}