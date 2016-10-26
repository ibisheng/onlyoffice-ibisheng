/*
 * (c) Copyright Ascensio System SIA 2010-2016
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
		oChange.Load(this.m_oColor);
		return true;
	}
	// Сюда мы попадаем, когда у данного изменения нет класса и он все еще работает по старой схеме через объект

	Reader.Seek2(nReaderPos);
	//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	// Старая схема

	if (!Class.Load_Changes)
		return false;

	return Class.Load_Changes(Reader, null, this.m_oColor);
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


    this.m_bGlobalLock  = false;         // Запрещаем производить любые "редактирующие" действия (т.е. то, что в историю запишется)
    this.m_bGlobalLockSelection = false; // Запрещаем изменять селект и курсор
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

        this.Clear_NewImages();

        this.Apply_OtherChanges();

        // После того как мы приняли чужие изменения, мы должны залочить новые объекты, которые были залочены
        this.Lock_NeedLock();

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

        this.OnStart_Load_Objects();
    }
};
CCollaborativeEditingBase.prototype.Apply_OtherChanges = function()
{
    // Чтобы заново созданные параграфы не отображались залоченными
    AscCommon.g_oIdCounter.Set_Load( true );

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
    AscCommon.CollaborativeEditing.m_bGlobalLock = true;
    AscCommon.CollaborativeEditing.m_bGlobalLockSelection = true;
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
    return this.m_bGlobalLock;
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
//----------------------------------------------------------------------------------------------------------------------
// Private area
//----------------------------------------------------------------------------------------------------------------------
	CCollaborativeEditingBase.prototype.private_ClearChanges = function()
	{
		this.m_aChanges = [];
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
