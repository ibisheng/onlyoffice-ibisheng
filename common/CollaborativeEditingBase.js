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

(function(window, undefined){

var FOREIGN_CURSOR_LABEL_HIDETIME = 1500;

function CCollaborativeChanges()
{
	this.m_pData  = null;
	this.m_oColor = null;
}
CCollaborativeChanges.prototype.Set_Data = function(pData)
{
    this.m_pData = pData;
};
CCollaborativeChanges.prototype.Set_Color = function(oColor)
{
    this.m_oColor = oColor;
};
CCollaborativeChanges.prototype.Set_FromUndoRedo = function(Class, Data, Binary)
{
	if (!Class.Get_Id)
		return false;

	this.m_pData = this.private_SaveData(Binary);
	return true;
};
CCollaborativeChanges.prototype.Apply_Data = function()
{
	var CollaborativeEditing = AscCommon.CollaborativeEditing;

	var Reader  = this.private_LoadData(this.m_pData);
	var ClassId = Reader.GetString2();
	var Class   = AscCommon.g_oTableId.Get_ById(ClassId);

	if (!Class)
		return false;

	//------------------------------------------------------------------------------------------------------------------
	// Новая схема
	var nReaderPos   = Reader.GetCurPos();
	var nChangesType = Reader.GetLong();

	var fChangesClass = AscDFH.changesFactory[nChangesType];
	if (fChangesClass)
	{
		var oChange = new fChangesClass(Class);
		oChange.ReadFromBinary(Reader);

		if (true === CollaborativeEditing.private_AddOverallChange(oChange))
			oChange.Load(this.m_oColor);

		return true;
	}
	else
	{
		CollaborativeEditing.private_AddOverallChange(this.m_pData);
		// Сюда мы попадаем, когда у данного изменения нет класса и он все еще работает по старой схеме через объект

		Reader.Seek2(nReaderPos);
		//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		// Старая схема

		if (!Class.Load_Changes)
			return false;

		return Class.Load_Changes(Reader, null, this.m_oColor);
	}
};
CCollaborativeChanges.prototype.private_LoadData = function(szSrc)
{
    return this.GetStream(szSrc, 0, szSrc.length);
};
CCollaborativeChanges.prototype.GetStream = function(szSrc, offset, srcLen)
{
	var nWritten = 0;

	var index   = -1 + offset;
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

	var pointer = AscFonts.g_memory.Alloc(dstLen);
	var stream  = new AscCommon.FT_Stream2(pointer.data, dstLen);
	stream.obj  = pointer.obj;

	var dstPx = stream.data;

	if (window.chrome)
	{
		while (index < srcLen)
		{
			var dwCurr = 0;
			var i;
			var nBits  = 0;
			for (i = 0; i < 4; i++)
			{
				if (index >= srcLen)
					break;
				var nCh = AscFonts.DecodeBase64Char(szSrc.charCodeAt(index++));
				if (nCh == -1)
				{
					i--;
					continue;
				}
				dwCurr <<= 6;
				dwCurr |= nCh;
				nBits += 6;
			}

			dwCurr <<= 24 - nBits;
			for (i = 0; i < nBits / 8; i++)
			{
				dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
				dwCurr <<= 8;
			}
		}
	}
	else
	{
		var p = AscFonts.b64_decode;
		while (index < srcLen)
		{
			var dwCurr = 0;
			var i;
			var nBits  = 0;
			for (i = 0; i < 4; i++)
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

			dwCurr <<= 24 - nBits;
			for (i = 0; i < nBits / 8; i++)
			{
				dstPx[nWritten++] = ((dwCurr & 0x00ff0000) >>> 16);
				dwCurr <<= 8;
			}
		}
	}

	return stream;
};
CCollaborativeChanges.prototype.private_SaveData = function(Binary)
{
	var Writer = AscCommon.History.BinaryWriter;
	var Pos    = Binary.Pos;
	var Len    = Binary.Len;
	return Len + ";" + Writer.GetBase64Memory2(Pos, Len);
};


function CCollaborativeEditingBase()
{
    this.m_nUseType     = 1;  // 1 - 1 клиент и мы сохраняем историю, -1 - несколько клиентов, 0 - переход из -1 в 1

    this.m_aUsers       = []; // Список текущих пользователей, редактирующих данный документ
    this.m_aChanges     = []; // Массив с изменениями других пользователей

    this.m_aNeedUnlock  = []; // Массив со списком залоченных объектов(которые были залочены другими пользователями)
    this.m_aNeedUnlock2 = []; // Массив со списком залоченных объектов(которые были залочены на данном клиенте)
    this.m_aNeedLock    = []; // Массив со списком залоченных объектов(которые были залочены, но еще не были добавлены на данном клиенте)

    this.m_aLinkData    = []; // Массив, указателей, которые нам надо выставить при загрузке чужих изменений
    this.m_aEndActions  = []; // Массив действий, которые надо выполнить после принятия чужих изменений


    this.m_bGlobalLock          = 0; // Запрещаем производить любые "редактирующие" действия (т.е. то, что в историю запишется)
    this.m_bGlobalLockSelection = 0; // Запрещаем изменять селект и курсор
    this.m_aCheckLocks  = [];    // Массив для проверки залоченности объектов, которые мы собираемся изменять

    this.m_aNewObjects  = []; // Массив со списком чужих новых объектов
    this.m_aNewImages   = []; // Массив со списком картинок, которые нужно будет загрузить на сервере
    this.m_aDC          = {}; // Массив(ассоциативный) классов DocumentContent
    this.m_aChangedClasses = {}; // Массив(ассоциативный) классов, в которых есть изменения выделенные цветом

    this.m_oMemory      = null; // Глобальные класс для сохранения (создадим позднее, когда понадобится)

    this.m_aCursorsToUpdate        = {}; // Курсоры, которые нужно обновить после принятия изменений
    this.m_aCursorsToUpdateShortId = {};

    //// CollaborativeEditing LOG
    //this.m_nErrorLog_PointChangesCount = 0;
    //this.m_nErrorLog_SavedPCC          = 0;
    //this.m_nErrorLog_CurPointIndex     = -1;
    //this.m_nErrorLog_SumIndex          = 0;

    this.m_bFast  = false;

    this.m_oLogicDocument     = null;
    this.m_aDocumentPositions = new CDocumentPositionsManager();
    this.m_aForeignCursorsPos = new CDocumentPositionsManager();
    this.m_aForeignCursors    = {};
    this.m_aForeignCursorsId  = {};


    this.m_nAllChangesSavedIndex = 0;

    this.m_aAllChanges        = []; // Список всех изменений
    this.m_aOwnChangesIndexes = []; // Список номеров своих изменений в общем списке, которые мы можем откатить

    this.m_oOwnChanges        = [];
}

CCollaborativeEditingBase.prototype.Clear = function()
{
    this.m_nUseType = 1;

    this.m_aUsers = [];
    this.m_aChanges = [];
    this.m_aNeedUnlock = [];
    this.m_aNeedUnlock2 = [];
    this.m_aNeedLock = [];
    this.m_aLinkData = [];
    this.m_aEndActions = [];
    this.m_aCheckLocks = [];
    this.m_aNewObjects = [];
    this.m_aNewImages = [];
};
CCollaborativeEditingBase.prototype.Set_Fast = function(bFast)
{
    this.m_bFast = bFast;

    if (false === bFast)
        this.Remove_AllForeignCursors();
};
CCollaborativeEditingBase.prototype.Is_Fast = function()
{
    return this.m_bFast;
};
CCollaborativeEditingBase.prototype.Is_SingleUser = function()
{
    if (1 === this.m_nUseType)
        return true;

    return false;
};
CCollaborativeEditingBase.prototype.Start_CollaborationEditing = function()
{
    this.m_nUseType = -1;
};
CCollaborativeEditingBase.prototype.End_CollaborationEditing = function()
{
    if (this.m_nUseType <= 0)
        this.m_nUseType = 0;
};
CCollaborativeEditingBase.prototype.Add_User = function(UserId)
{
    if (-1 === this.Find_User(UserId))
        this.m_aUsers.push(UserId);
};
CCollaborativeEditingBase.prototype.Find_User = function(UserId)
{
    var Len = this.m_aUsers.length;
    for (var Index = 0; Index < Len; Index++)
    {
        if (this.m_aUsers[Index] === UserId)
            return Index;
    }

    return -1;
};
CCollaborativeEditingBase.prototype.Remove_User = function(UserId)
{
    var Pos = this.Find_User( UserId );
    if ( -1 != Pos )
        this.m_aUsers.splice( Pos, 1 );
};
CCollaborativeEditingBase.prototype.Add_Changes = function(Changes)
{
    this.m_aChanges.push(Changes);
};
CCollaborativeEditingBase.prototype.Add_Unlock = function(LockClass)
{
    this.m_aNeedUnlock.push( LockClass );
};
CCollaborativeEditingBase.prototype.Add_Unlock2 = function(Lock)
{
    this.m_aNeedUnlock2.push(Lock);
    editor._onUpdateDocumentCanSave();
};
CCollaborativeEditingBase.prototype.Have_OtherChanges = function()
{
    return (0 < this.m_aChanges.length);
};
CCollaborativeEditingBase.prototype.Apply_Changes = function()
{
    var OtherChanges = (this.m_aChanges.length > 0);

    // Если нет чужих изменений, тогда и делать ничего не надо
    if (true === OtherChanges)
    {
        editor.WordControl.m_oLogicDocument.Stop_Recalculate();
        editor.WordControl.m_oLogicDocument.EndPreview_MailMergeResult();

        editor.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.ApplyChanges);

        var DocState = this.private_SaveDocumentState();
        this.Clear_NewImages();

        this.Apply_OtherChanges();

        // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые были залочены
        this.Lock_NeedLock();
        this.private_RestoreDocumentState(DocState);
        this.OnStart_Load_Objects();
    }
};
CCollaborativeEditingBase.prototype.Apply_OtherChanges = function()
{
    // Чтобы заново созданные параграфы не отображались залоченными
    AscCommon.g_oIdCounter.Set_Load( true );

    if (this.m_aChanges.length > 0)
    	this.private_CollectOwnChanges();

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
        //// CollaborativeEditing LOG
        //this.m_nErrorLog_PointChangesCount++;
    }

    this.private_ClearChanges();

    // У новых элементов выставляем указатели на другие классы
    this.Apply_LinkData();

    // Делаем проверки корректности новых изменений
    this.Check_MergeData();

    this.OnEnd_ReadForeignChanges();

    AscCommon.g_oIdCounter.Set_Load( false );
};
CCollaborativeEditingBase.prototype.getOwnLocksLength = function()
{
    return this.m_aNeedUnlock2.length;
};
CCollaborativeEditingBase.prototype.Send_Changes = function()
{
};
CCollaborativeEditingBase.prototype.Release_Locks = function()
{
};
CCollaborativeEditingBase.prototype.OnStart_Load_Objects = function()
{
    AscCommon.CollaborativeEditing.Set_GlobalLock(true);
    AscCommon.CollaborativeEditing.Set_GlobalLockSelection(true);
    // Вызываем функцию для загрузки необходимых элементов (новые картинки и шрифты)
    editor.pre_Save(AscCommon.CollaborativeEditing.m_aNewImages);
};
CCollaborativeEditingBase.prototype.OnEnd_Load_Objects = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с ссылками, у новых объектов
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Clear_LinkData = function()
{
    this.m_aLinkData.length = 0;
};
CCollaborativeEditingBase.prototype.Add_LinkData = function(Class, LinkData)
{
    this.m_aLinkData.push( { Class : Class, LinkData : LinkData } );
};
CCollaborativeEditingBase.prototype.Apply_LinkData = function()
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
CCollaborativeEditingBase.prototype.Check_MergeData = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для проверки залоченности объектов
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Get_GlobalLock = function()
{
    return (0 === this.m_bGlobalLock ? false : true);
};
CCollaborativeEditingBase.prototype.Set_GlobalLock = function(isLock)
{
	if (isLock)
		this.m_bGlobalLock++;
	else
		this.m_bGlobalLock = Math.max(0, this.m_bGlobalLock - 1);
};
CCollaborativeEditingBase.prototype.Set_GlobalLockSelection = function(isLock)
{
	if (isLock)
		this.m_bGlobalLockSelection++;
	else
		this.m_bGlobalLockSelection = Math.max(0, this.m_bGlobalLockSelection - 1);
};
CCollaborativeEditingBase.prototype.Get_GlobalLockSelection = function()
{
	return (0 === this.m_bGlobalLockSelection ? false : true);
};
CCollaborativeEditingBase.prototype.OnStart_CheckLock = function()
{
    this.m_aCheckLocks.length = 0;
};
CCollaborativeEditingBase.prototype.Add_CheckLock = function(oItem)
{
    this.m_aCheckLocks.push(oItem);
};
CCollaborativeEditingBase.prototype.OnEnd_CheckLock = function()
{
};
CCollaborativeEditingBase.prototype.OnCallback_AskLock = function(result)
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с залоченными объектами, которые еще не были добавлены
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Reset_NeedLock = function()
{
    this.m_aNeedLock = {};
};
CCollaborativeEditingBase.prototype.Add_NeedLock = function(Id, sUser)
{
    this.m_aNeedLock[Id] = sUser;
};
CCollaborativeEditingBase.prototype.Remove_NeedLock = function(Id)
{
    delete this.m_aNeedLock[Id];
};
CCollaborativeEditingBase.prototype.Lock_NeedLock = function()
{
    for ( var Id in this.m_aNeedLock )
    {
        var Class = AscCommon.g_oTableId.Get_ById( Id );

        if ( null != Class )
        {
            var Lock = Class.Lock;
            Lock.Set_Type( AscCommon.locktype_Other, false );
            if(Class.getObjectType && Class.getObjectType() === AscDFH.historyitem_type_Slide)
            {
                editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide && editor.WordControl.m_oLogicDocument.DrawingDocument.UnLockSlide(Class.num);
            }
            Lock.Set_UserId( this.m_aNeedLock[Id] );
        }
    }

    this.Reset_NeedLock();
};
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Clear_NewObjects = function()
{
    this.m_aNewObjects.length = 0;
};
CCollaborativeEditingBase.prototype.Add_NewObject = function(Class)
{
    this.m_aNewObjects.push(Class);
    Class.FromBinary = true;
};
CCollaborativeEditingBase.prototype.Clear_EndActions = function()
{
    this.m_aEndActions.length = 0;
};
CCollaborativeEditingBase.prototype.Add_EndActions = function(Class, Data)
{
    this.m_aEndActions.push({Class : Class, Data : Data});
};
CCollaborativeEditingBase.prototype.OnEnd_ReadForeignChanges = function()
{
    var Count = this.m_aNewObjects.length;

    for (var Index = 0; Index < Count; Index++)
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
CCollaborativeEditingBase.prototype.Clear_NewImages = function()
{
    this.m_aNewImages.length = 0;
};
CCollaborativeEditingBase.prototype.Add_NewImage = function(Url)
{
    this.m_aNewImages.push( Url );
};
//-----------------------------------------------------------------------------------
// Функции для работы с массивом m_aDC
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Add_NewDC = function(Class)
{
    var Id = Class.Get_Id();
    this.m_aDC[Id] = Class;
};
CCollaborativeEditingBase.prototype.Clear_DCChanges = function()
{
    for (var Id in this.m_aDC)
    {
        this.m_aDC[Id].Clear_ContentChanges();
    }

    // Очищаем массив
    this.m_aDC = {};
};
CCollaborativeEditingBase.prototype.Refresh_DCChanges = function()
{
    for (var Id in this.m_aDC)
    {
        this.m_aDC[Id].Refresh_ContentChanges();
    }

    this.Clear_DCChanges();
};


//-----------------------------------------------------------------------------------
// Функции для работы с массивами PosExtChangesX, PosExtChangesY
//-----------------------------------------------------------------------------------
    CCollaborativeEditingBase.prototype.AddPosExtChanges = function(Item, ChangeObject){

    };
    CCollaborativeEditingBase.prototype.RefreshPosExtChanges = function(){

    };
    CCollaborativeEditingBase.prototype.RewritePosExtChanges = function(changesArr, scale, Binary_Writer)
    {
    };

    CCollaborativeEditingBase.prototype.RefreshPosExtChanges = function()
    {
    };
//-----------------------------------------------------------------------------------
// Функции для работы с отметками изменений
//-----------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Add_ChangedClass = function(Class)
{
    var Id = Class.Get_Id();
    this.m_aChangedClasses[Id] = Class;
};
CCollaborativeEditingBase.prototype.Clear_CollaborativeMarks = function(bRepaint)
{
    for ( var Id in this.m_aChangedClasses )
    {
        this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
    }

    // Очищаем массив
    this.m_aChangedClasses = {};


    if (true === bRepaint)
    {
        editor.WordControl.m_oLogicDocument.DrawingDocument.ClearCachePages();
        editor.WordControl.m_oLogicDocument.DrawingDocument.FirePaint();
    }
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с обновлением курсоров после принятия изменений
//----------------------------------------------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Add_ForeignCursorToUpdate = function(UserId, CursorInfo, UserShortId)
{
    this.m_aCursorsToUpdate[UserId] = CursorInfo;
    this.m_aCursorsToUpdateShortId[UserId] = UserShortId;
};
CCollaborativeEditingBase.prototype.Refresh_ForeignCursors = function()
{
    if (!this.m_oLogicDocument)
        return;

    for (var UserId in this.m_aCursorsToUpdate)
    {
        var CursorInfo = this.m_aCursorsToUpdate[UserId];
        this.m_oLogicDocument.Update_ForeignCursor(CursorInfo, UserId, false, this.m_aCursorsToUpdateShortId[UserId]);

        if (this.Add_ForeignCursorToShow)
            this.Add_ForeignCursorToShow(UserId);
    }
    this.m_aCursorsToUpdate = {};
    this.m_aCursorsToUpdateShortId = {};
};
//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с сохраненными позициями в Word-документах. Они объявлены в базовом классе, потому что вызываются
// из общих классов Paragraph, Run, Table. Вообщем, для совместимости.
//----------------------------------------------------------------------------------------------------------------------
CCollaborativeEditingBase.prototype.Clear_DocumentPositions = function(){
    this.m_aDocumentPositions.Clear_DocumentPositions();
};
CCollaborativeEditingBase.prototype.Add_DocumentPosition = function(DocumentPos){
    this.m_aDocumentPositions.Add_DocumentPosition(DocumentPos);
};
CCollaborativeEditingBase.prototype.Add_ForeignCursor = function(UserId, DocumentPos, UserShortId){
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    this.m_aForeignCursors[UserId] = DocumentPos;
    this.m_aForeignCursorsPos.Add_DocumentPosition(DocumentPos);
    this.m_aForeignCursorsId[UserId] = UserShortId;
};
CCollaborativeEditingBase.prototype.Remove_ForeignCursor = function(UserId){
    this.m_aForeignCursorsPos.Remove_DocumentPosition(this.m_aCursorsToUpdate[UserId]);
    delete this.m_aForeignCursors[UserId];
};
CCollaborativeEditingBase.prototype.Remove_AllForeignCursors = function(){};
CCollaborativeEditingBase.prototype.Update_DocumentPositionsOnAdd = function(Class, Pos){
    this.m_aDocumentPositions.Update_DocumentPositionsOnAdd(Class, Pos);
    this.m_aForeignCursorsPos.Update_DocumentPositionsOnAdd(Class, Pos);
};
CCollaborativeEditingBase.prototype.Update_DocumentPositionsOnRemove = function(Class, Pos, Count){
    this.m_aDocumentPositions.Update_DocumentPositionsOnRemove(Class, Pos, Count);
    this.m_aForeignCursorsPos.Update_DocumentPositionsOnRemove(Class, Pos, Count);
};
CCollaborativeEditingBase.prototype.OnStart_SplitRun = function(SplitRun, SplitPos){
    this.m_aDocumentPositions.OnStart_SplitRun(SplitRun, SplitPos);
    this.m_aForeignCursorsPos.OnStart_SplitRun(SplitRun, SplitPos);
};
CCollaborativeEditingBase.prototype.OnEnd_SplitRun = function(NewRun){
    this.m_aDocumentPositions.OnEnd_SplitRun(NewRun);
    this.m_aForeignCursorsPos.OnEnd_SplitRun(NewRun);
};
CCollaborativeEditingBase.prototype.Update_DocumentPosition = function(DocPos){
    this.m_aDocumentPositions.Update_DocumentPosition(DocPos);
};
CCollaborativeEditingBase.prototype.Update_ForeignCursorsPositions = function(){

};
CCollaborativeEditingBase.prototype.InitMemory = function() {
    if (!this.m_oMemory) {
        this.m_oMemory = new AscCommon.CMemory();
    }
};
CCollaborativeEditingBase.prototype.private_SaveDocumentState = function()
{
	var LogicDocument = editor.WordControl.m_oLogicDocument;

	var DocState;
	if (true !== this.Is_Fast())
	{
		DocState = LogicDocument.Get_SelectionState2();
		this.m_aCursorsToUpdate = {};
	}
	else
	{
		DocState = LogicDocument.Save_DocumentStateBeforeLoadChanges();
		this.Clear_DocumentPositions();

		if (DocState.Pos)
			this.Add_DocumentPosition(DocState.Pos);
		if (DocState.StartPos)
			this.Add_DocumentPosition(DocState.StartPos);
		if (DocState.EndPos)
			this.Add_DocumentPosition(DocState.EndPos);

		if (DocState.FootnotesStart && DocState.FootnotesStart.Pos)
			this.Add_DocumentPosition(DocState.FootnotesStart.Pos);
		if (DocState.FootnotesStart && DocState.FootnotesStart.StartPos)
			this.Add_DocumentPosition(DocState.FootnotesStart.StartPos);
		if (DocState.FootnotesStart && DocState.FootnotesStart.EndPos)
			this.Add_DocumentPosition(DocState.FootnotesStart.EndPos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.Pos)
			this.Add_DocumentPosition(DocState.FootnotesEnd.Pos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.StartPos)
			this.Add_DocumentPosition(DocState.FootnotesEnd.StartPos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.EndPos)
			this.Add_DocumentPosition(DocState.FootnotesEnd.EndPos);
	}
	return DocState;
};
CCollaborativeEditingBase.prototype.private_RestoreDocumentState = function(DocState)
{
	var LogicDocument = editor.WordControl.m_oLogicDocument;
	if (true !== this.Is_Fast())
	{
		LogicDocument.Set_SelectionState2(DocState);
	}
	else
	{
		if (DocState.Pos)
			this.Update_DocumentPosition(DocState.Pos);
		if (DocState.StartPos)
			this.Update_DocumentPosition(DocState.StartPos);
		if (DocState.EndPos)
			this.Update_DocumentPosition(DocState.EndPos);

		if (DocState.FootnotesStart && DocState.FootnotesStart.Pos)
			this.Update_DocumentPosition(DocState.FootnotesStart.Pos);
		if (DocState.FootnotesStart && DocState.FootnotesStart.StartPos)
			this.Update_DocumentPosition(DocState.FootnotesStart.StartPos);
		if (DocState.FootnotesStart && DocState.FootnotesStart.EndPos)
			this.Update_DocumentPosition(DocState.FootnotesStart.EndPos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.Pos)
			this.Update_DocumentPosition(DocState.FootnotesEnd.Pos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.StartPos)
			this.Update_DocumentPosition(DocState.FootnotesEnd.StartPos);
		if (DocState.FootnotesEnd && DocState.FootnotesEnd.EndPos)
			this.Update_DocumentPosition(DocState.FootnotesEnd.EndPos);


		LogicDocument.Load_DocumentStateAfterLoadChanges(DocState);
		this.Refresh_ForeignCursors();
	}
};
//----------------------------------------------------------------------------------------------------------------------
// Private area
//----------------------------------------------------------------------------------------------------------------------
	CCollaborativeEditingBase.prototype.private_ClearChanges = function()
	{
		this.m_aChanges = [];
	};
	CCollaborativeEditingBase.prototype.private_CollectOwnChanges = function()
	{
	};
	CCollaborativeEditingBase.prototype.private_AddOverallChange = function(oChange)
	{
	    return true;
	};


	//-------------------------------------
    ///
    /////----------------------------------------
    //----------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------
    CCollaborativeEditingBase.prototype.private_ClearChanges = function()
    {
        this.m_aChanges = [];
    };
    CCollaborativeEditingBase.prototype.private_CollectOwnChanges = function()
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

                this.m_oOwnChanges.push(Item.Data);
            }
        }
    };
    CCollaborativeEditingBase.prototype.private_AddOverallChange = function(oChange)
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
    CCollaborativeEditingBase.prototype.private_OnSendOwnChanges = function(arrChanges, nDeleteIndex)
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
    CCollaborativeEditingBase.prototype.Undo = function()
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
		var arrChanges = [];
		var oIndexes   = this.m_aOwnChangesIndexes[this.m_aOwnChangesIndexes.length - 1];
		var nPosition  = oIndexes.Position;
		var nCount     = oIndexes.Count;

        for (var nIndex = nCount - 1; nIndex >= 0; --nIndex)
        {
            var oChange = this.m_aAllChanges[nPosition + nIndex];
            if (!oChange)
                continue;

            var oClass = oChange.GetClass();
            if (oChange.IsContentChange())
            {
                var _oChange = oChange.Copy();

				if (this.private_CommutateContentChanges(_oChange, nPosition + nCount))
					arrChanges.push(_oChange);

				oChange.SetReverted(true);
            }
            else
            {
                var _oChange = oChange; // TODO: Тут надо бы сделать копирование

                if (this.private_CommutatePropertyChanges(oClass, _oChange, nPosition + nCount))
					arrChanges.push(_oChange);
            }
        }

        // Удаляем запись о последнем изменении
        this.m_aOwnChangesIndexes.length = this.m_aOwnChangesIndexes.length - 1;

		var arrReverseChanges = [];
		for (var nIndex = 0, nCount = arrChanges.length; nIndex < nCount; ++nIndex)
		{
			var oReverseChange = arrChanges[nIndex].CreateReverseChange();
			if (oReverseChange)
			{
				arrReverseChanges.push(oReverseChange);
				oReverseChange.SetReverted(true);
			}
		}

        // Накатываем изменения в данном клиенте
        var oLogicDocument = this.m_oLogicDocument;

        oLogicDocument.DrawingDocument.EndTrackTable(null, true);
        oLogicDocument.TurnOffCheckChartSelection();

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
        var mapDrawings         = {};
        var mapRuns             = {};
        var mapTables           = {};
        var mapGrObjects        = {};
        var mapSlides           = {};
        var mapLayouts          = {};
        var bChangedLayout   = false;
        for (var nIndex = 0, nCount = arrReverseChanges.length; nIndex < nCount; ++nIndex)
        {
            var oChange = arrReverseChanges[nIndex];
            var oClass  = oChange.GetClass();
			if (oClass instanceof AscCommonWord.CDocument || oClass instanceof AscCommonWord.CDocumentContent)
				mapDocumentContents[oClass.Get_Id()] = oClass;
			else if (oClass instanceof AscCommonWord.Paragraph)
				mapParagraphs[oClass.Get_Id()] = oClass;
			else if (oClass.IsParagraphContentElement && true === oClass.IsParagraphContentElement() && true === oChange.IsContentChange() && oClass.Get_Paragraph())
            {
                mapParagraphs[oClass.Get_Paragraph().Get_Id()] = oClass.Get_Paragraph();
                if (oClass instanceof AscCommonWord.ParaRun)
                    mapRuns[oClass.Get_Id()] = oClass;
            }
			else if (oClass instanceof AscCommonWord.ParaDrawing)
				mapDrawings[oClass.Get_Id()] = oClass;
			else if (oClass instanceof AscCommonWord.ParaRun)
				mapRuns[oClass.Get_Id()] = oClass;
			else if (oClass instanceof AscCommonWord.CTable)
				mapTables[oClass.Get_Id()] = oClass;
			else if(oClass instanceof AscFormat.CShape || oClass instanceof AscFormat.CImageShape || oClass instanceof AscFormat.CChartSpace || oClass instanceof AscFormat.CGroupShape || oClass instanceof AscFormat.CGraphicFrame)
                mapGrObjects[oClass.Get_Id()] = oClass;
			else if(typeof AscCommonSlide !== "undefined") {
                if (AscCommonSlide.Slide && oClass instanceof AscCommonSlide.Slide) {
                    mapSlides[oClass.Get_Id()] = oClass;
                }
                else if(AscCommonSlide.SlideLayout && oClass instanceof AscCommonSlide.SlideLayout){
                    mapLayouts[oClass.Get_Id()] = oClass;
                    bChangedLayout = true;
                }
            }
        }

        // Создаем точку в истории. Делаем действия через обычные функции (с отключенным пересчетом), которые пишут в
        // историю. Сохраняем список изменений в новой точке, удаляем данную точку.
        var oHistory = AscCommon.History;
        oHistory.CreateNewPointForCollectChanges();
        for(var sId in mapSlides){
            if(mapSlides.hasOwnProperty(sId)){
                mapSlides[sId].correctContent();
            }
        }

        if(bChangedLayout){
            for(var i = oLogicDocument.Slides.length - 1; i > -1 ; --i){
                var Layout = oLogicDocument.Slides[i].Layout;
                if(!Layout || mapLayouts[Layout.Get_Id()]){
                    if(!oLogicDocument.Slides[i].CheckLayout()){
                        oLogicDocument.removeSlide(i);
                    }
                }
            }
        }

        for(var sId in mapGrObjects){
            var oShape = mapGrObjects[sId];
            if(!oShape.checkCorrect()){
                oShape.setBDeleted(true);
                if(oShape.group){
                    oShape.group.removeFromSpTree(oShape.Get_Id());
                }
                else if(AscFormat.Slide && (oShape.parent instanceof AscFormat.Slide)){
                    oShape.parent.removeFromSpTreeById(oShape.Get_Id());
                }
                else if(AscCommonWord.ParaDrawing && (oShape.parent instanceof AscCommonWord.ParaDrawing)){
                    mapDrawings[oShape.parent.Get_Id()] = oShape.parent;
                }
            }
        }
        var oDrawing;
        for (var sId in mapDrawings)
        {
            if (mapDrawings.hasOwnProperty(sId))
            {
                oDrawing = mapDrawings[sId];
                if (!oDrawing.CheckCorrect())
                {
                    var oParentParagraph = oDrawing.Get_ParentParagraph();
                    oDrawing.Remove_FromDocument(false);
                    if (oParentParagraph)
                    {
                        mapParagraphs[oParentParagraph.Get_Id()] = oParentParagraph;
                    }
                }
            }
        }

        for(var sId in mapRuns){
            if (mapRuns.hasOwnProperty(sId))
            {
                var oRun = mapRuns[sId];
                for(var nIndex = oRun.Content.length - 1; nIndex > - 1; --nIndex){
                    if(oRun.Content[nIndex] instanceof AscCommonWord.ParaDrawing){
                        if(!oRun.Content[nIndex].CheckCorrect()){
                            oRun.Remove_FromContent(nIndex, 1, false);
                            if(oRun.Paragraph){
                                mapParagraphs[oRun.Paragraph.Get_Id()] = oRun.Paragraph;
                            }
                        }
                    }
                }
            }
        }

        for (var sId in mapTables)
		{
			var oTable = mapTables[sId];
			for (var nCurRow = oTable.Content.length - 1; nCurRow >= 0; --nCurRow)
			{
				var oRow = oTable.Get_Row(nCurRow);
				if (oRow.Get_CellsCount() <= 0)
					oTable.Internal_Remove_Row(nCurRow);
			}

			if (oTable.Parent instanceof AscCommonWord.CDocument || oTable.Parent instanceof AscCommonWord.CDocumentContent)
				mapDocumentContents[oTable.Parent.Get_Id()] = oTable.Parent;
		}

        for (var sId in mapDocumentContents)
        {
            var oDocumentContent = mapDocumentContents[sId];
            var nContentLen = oDocumentContent.Content.length;
			for (var nIndex = nContentLen - 1; nIndex >= 0; --nIndex)
			{
				var oElement = oDocumentContent.Content[nIndex];
				if ((AscCommonWord.type_Paragraph === oElement.GetType() || AscCommonWord.type_Table === oElement.GetType()) && oElement.Content.length <= 0)
				{
					oDocumentContent.Remove_FromContent(nIndex, 1);
					console.log("Deleted " + ( AscCommonWord.type_Table === oElement.GetType() ? "Table" : "Paragraph"));
				}
			}

			nContentLen = oDocumentContent.Content.length;
            if (nContentLen <= 0 || AscCommonWord.type_Paragraph !== oDocumentContent.Content[nContentLen - 1].GetType())
            {
                var oNewParagraph = new AscCommonWord.Paragraph(oLogicDocument.Get_DrawingDocument(), oDocumentContent, 0, 0, 0, 0, 0, false);
                oDocumentContent.Add_ToContent(nContentLen, oNewParagraph);
            }
        }

        for (var sId in mapParagraphs)
        {
            var oParagraph = mapParagraphs[sId];
            oParagraph.Correct_Content();
            oParagraph.CheckParaEnd();
        }



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

        var oHistoryPoint = oHistory.Points[oHistory.Points.length - 1];
        for (var nIndex = 0, nCount = oHistoryPoint.Items.length; nIndex < nCount; ++nIndex)
        {
        	var oReverseChange = oHistoryPoint.Items[nIndex].Data;
			var oChangeClass   = oReverseChange.GetClass();

			var oChange = new AscCommon.CCollaborativeChanges();
			oChange.Set_FromUndoRedo(oChangeClass, oReverseChange, {Pos : oHistoryPoint.Items[nIndex].Binary.Pos, Len : oHistoryPoint.Items[nIndex].Binary.Len});
			aSendingChanges.push(oChange.m_pData);

            arrReverseChanges.push(oHistoryPoint.Items[nIndex].Data);
        }
        oHistory.Remove_LastPoint();
        this.Clear_DCChanges();

        editor.CoAuthoringApi.saveChanges(aSendingChanges, null, null);

        this.private_RestoreDocumentState(DocState);

        oLogicDocument.TurnOnCheckChartSelection();
        this.private_RecalculateDocument(AscCommon.History.Get_RecalcData(null, arrReverseChanges));

        oLogicDocument.Document_UpdateSelectionState();
        oLogicDocument.Document_UpdateInterfaceState();
        oLogicDocument.Document_UpdateRulersState();
    };
    CCollaborativeEditingBase.prototype.CanUndo = function()
    {
        return this.m_aOwnChangesIndexes.length <= 0 ? false : true;
    };
    CCollaborativeEditingBase.prototype.private_CommutateContentChanges = function(oChange, nStartPosition)
	{
		var arrActions          = oChange.ConvertToSimpleActions();
		var arrCommutateActions = [];

		for (var nActionIndex = arrActions.length - 1; nActionIndex >= 0; --nActionIndex)
		{
			var oAction = arrActions[nActionIndex];
			var oResult = oAction;

			for (var nIndex = nStartPosition, nOverallCount = this.m_aAllChanges.length; nIndex < nOverallCount; ++nIndex)
			{
				var oTempChange = this.m_aAllChanges[nIndex];
				if (!oTempChange)
					continue;

				if (oChange.IsRelated(oTempChange) &&  true !== oTempChange.IsReverted())
				{
					var arrOtherActions = oTempChange.ConvertToSimpleActions();
					for (var nIndex2 = 0, nOtherActionsCount2 = arrOtherActions.length; nIndex2 < nOtherActionsCount2; ++nIndex2)
					{
						var oOtherAction = arrOtherActions[nIndex2];

						if (false === this.private_Commutate(oAction, oOtherAction))
						{
							arrOtherActions.splice(nIndex2, 1);
							oResult = null;
							break;
						}
					}

					oTempChange.ConvertFromSimpleActions(arrOtherActions);
				}

				if (!oResult)
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
    CCollaborativeEditingBase.prototype.private_Commutate = function(oActionL, oActionR)
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
    CCollaborativeEditingBase.prototype.private_CommutatePropertyChanges = function(oClass, oChange, nStartPosition)
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

        if(oChange.CheckCorrect && !oChange.CheckCorrect())
        {
            return false;
        }
        return true;
    };


    CCollaborativeEditingBase.prototype.private_RecalculateDocument = function(oRecalcData){

    };


//----------------------------------------------------------------------------------------------------------------------
// Класс для работы с сохраненными позициями документа.
//----------------------------------------------------------------------------------------------------------------------
//   Принцип следующий. Заданная позиция - это Run + Позиция внутри данного Run.
//   Если заданный ран был разбит (операция Split), тогда отслеживаем куда перешла
//   заданная позиция, в новый ран или осталась в старом? Если в новый, тогда сохраняем
//   новый ран как отдельную позицию в массив m_aDocumentPositions, и добавляем мап
//   старой позиции в новую m_aDocumentPositionsMap. В конце действия, когда нам нужно
//   определить где же находистся наша позиция, мы сначала проверяем Map, если в нем есть
//   конечная позиция, проверяем является ли заданная позиция валидной в документе.
//   Если да, тогда выставляем ее, если нет, тогда берем Run исходной позиции, и
//   пытаемся сформировать полную позицию по данному Run. Если и это не получается,
//   тогда восстанавливаем позицию по измененной полной исходной позиции.
//----------------------------------------------------------------------------------------------------------------------
function CDocumentPositionsManager()
{
    this.m_aDocumentPositions      = [];
    this.m_aDocumentPositionsSplit = [];
    this.m_aDocumentPositionsMap   = [];
}
CDocumentPositionsManager.prototype.Clear_DocumentPositions = function()
{
    this.m_aDocumentPositions      = [];
    this.m_aDocumentPositionsSplit = [];
    this.m_aDocumentPositionsMap   = [];
};
CDocumentPositionsManager.prototype.Add_DocumentPosition = function(Position)
{
    this.m_aDocumentPositions.push(Position);
};
CDocumentPositionsManager.prototype.Update_DocumentPositionsOnAdd = function(Class, Pos)
{
    for (var PosIndex = 0, PosCount = this.m_aDocumentPositions.length; PosIndex < PosCount; ++PosIndex)
    {
        var DocPos = this.m_aDocumentPositions[PosIndex];
        for (var ClassPos = 0, ClassLen = DocPos.length; ClassPos < ClassLen; ++ClassPos)
        {
            var _Pos = DocPos[ClassPos];
            if (Class === _Pos.Class && _Pos.Position && _Pos.Position >= Pos)
            {
                _Pos.Position++;
                break;
            }
        }
    }
};
CDocumentPositionsManager.prototype.Update_DocumentPositionsOnRemove = function(Class, Pos, Count)
{
    for (var PosIndex = 0, PosCount = this.m_aDocumentPositions.length; PosIndex < PosCount; ++PosIndex)
    {
        var DocPos = this.m_aDocumentPositions[PosIndex];
        for (var ClassPos = 0, ClassLen = DocPos.length; ClassPos < ClassLen; ++ClassPos)
        {
            var _Pos = DocPos[ClassPos];
            if (Class === _Pos.Class && _Pos.Position)
            {
                if (_Pos.Position > Pos + Count)
                {
                    _Pos.Position -= Count;
                }
                else if (_Pos.Position >= Pos)
                {
                    // Элемент, в котором находится наша позиция, удаляется. Ставим специальную отметку об этом.
                    _Pos.Position = Pos;
                    _Pos.Deleted = true;
                }

                break;
            }
        }
    }
};
CDocumentPositionsManager.prototype.OnStart_SplitRun = function(SplitRun, SplitPos)
{
    this.m_aDocumentPositionsSplit = [];

    for (var PosIndex = 0, PosCount = this.m_aDocumentPositions.length; PosIndex < PosCount; ++PosIndex)
    {
        var DocPos = this.m_aDocumentPositions[PosIndex];
        for (var ClassPos = 0, ClassLen = DocPos.length; ClassPos < ClassLen; ++ClassPos)
        {
            var _Pos = DocPos[ClassPos];
            if (SplitRun === _Pos.Class && _Pos.Position && _Pos.Position >= SplitPos)
            {
                this.m_aDocumentPositionsSplit.push({DocPos : DocPos, NewRunPos : _Pos.Position - SplitPos});
            }
        }
    }
};
CDocumentPositionsManager.prototype.OnEnd_SplitRun = function(NewRun)
{
    if (!NewRun)
        return;

    for (var PosIndex = 0, PosCount = this.m_aDocumentPositionsSplit.length; PosIndex < PosCount; ++PosIndex)
    {
        var NewDocPos = [];
        NewDocPos.push({Class : NewRun, Position : this.m_aDocumentPositionsSplit[PosIndex].NewRunPos});
        this.m_aDocumentPositions.push(NewDocPos);
        this.m_aDocumentPositionsMap.push({StartPos : this.m_aDocumentPositionsSplit[PosIndex].DocPos, EndPos : NewDocPos});
    }
};
CDocumentPositionsManager.prototype.Update_DocumentPosition = function(DocPos)
{
    // Смотрим куда мапится заданная позиция
    var NewDocPos = DocPos;
    for (var PosIndex = 0, PosCount = this.m_aDocumentPositionsMap.length; PosIndex < PosCount; ++PosIndex)
    {
        if (this.m_aDocumentPositionsMap[PosIndex].StartPos === NewDocPos)
            NewDocPos = this.m_aDocumentPositionsMap[PosIndex].EndPos;
    }

    // Нашли результирующую позицию. Проверим является ли она валидной для документа.
    if (NewDocPos !== DocPos && NewDocPos.length === 1 && NewDocPos[0].Class instanceof AscCommonWord.ParaRun)
    {
        var Run = NewDocPos[0].Class;
        var Para = Run.Get_Paragraph();
        if (AscCommonWord.CanUpdatePosition(Para, Run))
        {
            DocPos.length = 0;
            DocPos.push({Class : Run, Position : NewDocPos[0].Position});
            Run.Get_DocumentPositionFromObject(DocPos);
        }
    }
    // Возможно ран с позицией переместился в другой класс
    else if (DocPos.length > 0 && DocPos[DocPos.length - 1].Class instanceof AscCommonWord.ParaRun)
    {
        var Run = DocPos[DocPos.length - 1].Class;
        var RunPos = DocPos[DocPos.length - 1].Position;
        var Para = Run.Get_Paragraph();
        if (AscCommonWord.CanUpdatePosition(Para, Run))
        {
            DocPos.length = 0;
            DocPos.push({Class : Run, Position : RunPos});
            Run.Get_DocumentPositionFromObject(DocPos);
        }
    }
};
CDocumentPositionsManager.prototype.Remove_DocumentPosition = function(DocPos)
{
    for (var Pos = 0, Count = this.m_aDocumentPositions.length; Pos < Count; ++Pos)
    {
        if (this.m_aDocumentPositions[Pos] === DocPos)
        {
            this.m_aDocumentPositions.splice(Pos, 1);
            return;
        }
    }
};
    //--------------------------------------------------------export----------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].FOREIGN_CURSOR_LABEL_HIDETIME = FOREIGN_CURSOR_LABEL_HIDETIME;
    window['AscCommon'].CCollaborativeChanges = CCollaborativeChanges;
    window['AscCommon'].CCollaborativeEditingBase = CCollaborativeEditingBase;
    window['AscCommon'].CDocumentPositionsManager = CDocumentPositionsManager;
})(window);
