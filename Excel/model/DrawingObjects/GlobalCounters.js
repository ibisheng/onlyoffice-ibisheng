"use strict";
//-----------------------------------------------------------------------------------
// Global counters
//-----------------------------------------------------------------------------------

function CCollaborativeEditing()
{
    CCollaborativeEditing.superclass.constructor.call(this);
}

Asc.extendClass(CCollaborativeEditing, CCollaborativeEditingBase);

CCollaborativeEditing.prototype.Set_Fast = function(bFast)
{
    this.m_bFast = bFast;
};

CCollaborativeEditing.prototype.Is_Fast = function()
{
    return this.m_bFast;
};

CCollaborativeEditing.prototype.Have_OtherChanges = function()
{
    return false;
};

CCollaborativeEditing.prototype.Start_CollaborationEditing = function()
{
};

CCollaborativeEditing.prototype.Add_User = function(UserId)
{
};

CCollaborativeEditing.prototype.Find_User = function(UserId)
{
};

CCollaborativeEditing.prototype.Remove_User = function(UserId)
{
};

CCollaborativeEditing.prototype.Add_Changes = function(Changes)
{
};

CCollaborativeEditing.prototype.Add_Unlock = function(LockClass)
{
};

CCollaborativeEditing.prototype.Add_Unlock2 = function(Lock)
{
};

CCollaborativeEditing.prototype.Apply_OtherChanges = function()
{
};


CCollaborativeEditing.prototype.Apply_Changes = function()
{
};

CCollaborativeEditing.prototype.Send_Changes = function()
{
};

CCollaborativeEditing.prototype.Release_Locks = function()
{
};

CCollaborativeEditing.prototype.OnStart_Load_Objects = function()
{
};

CCollaborativeEditing.prototype.OnEnd_Load_Objects = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с ссылками, у новых объектов
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Clear_LinkData = function()
{
    this.m_aLinkData.length = 0;
};

CCollaborativeEditing.prototype.Add_LinkData = function(Class, LinkData)
{
    this.m_aLinkData.push( { Class : Class, LinkData : LinkData } );
};

CCollaborativeEditing.prototype.Apply_LinkData = function()
{
    var Count = this.m_aLinkData.length;
    for ( var Index = 0; Index < Count; Index++ )
    {
        var Item = this.m_aLinkData[Index];
        Item.Class.Load_LinkData( Item.LinkData );
    }

    this.Clear_LinkData();


    if(this.m_aNewImages.length > 0)
    {
        Asc["editor"].ImageLoader.LoadDocumentImages(this.m_aNewImages, null, function()
        {
            CollaborativeEditing.m_aNewImages.length = 0;
            Asc["editor"]._onShowDrawingObjects();
            var worksheet = Asc["editor"].wb.getWorksheet();
            worksheet && worksheet.objectRender && worksheet.objectRender.controller && worksheet.objectRender.controller.getGraphicObjectProps();
        });

    }
};
//-----------------------------------------------------------------------------------
// Функции для проверки корректности новых изменений
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Check_MergeData = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для проверки залоченности объектов
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Get_GlobalLock = function()
{
};

CCollaborativeEditing.prototype.OnStart_CheckLock = function()
{
};

CCollaborativeEditing.prototype.Add_CheckLock = function(oItem)
{
};

CCollaborativeEditing.prototype.OnEnd_CheckLock = function()
{
};

CCollaborativeEditing.prototype.OnCallback_AskLock = function(result)
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с залоченными объектами, которые еще не были добавлены
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Reset_NeedLock = function()
{
};

CCollaborativeEditing.prototype.Add_NeedLock = function(Id, sUser)
{
};

CCollaborativeEditing.prototype.Remove_NeedLock = function(Id)
{
};

CCollaborativeEditing.prototype.Lock_NeedLock = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Clear_NewObjects = function()
{
};

CCollaborativeEditing.prototype.Add_NewObject = function(Class)
{
};

CCollaborativeEditing.prototype.OnEnd_ReadForeignChanges = function()
{
};

//-----------------------------------------------------------------------------------
// Функции для работы с массивом m_aDC
//-----------------------------------------------------------------------------------
CCollaborativeEditing.prototype.Add_NewDC = function(Class)
{
};

CCollaborativeEditing.prototype.Clear_DCChanges = function()
{
};

CCollaborativeEditing.prototype.Refresh_DCChanges = function()
{
};
//-----------------------------------------------------------------------------------
// Функции для работы с отметками изменений
//-----------------------------------------------------------------------------------

CCollaborativeEditing.prototype.Clear_CollaborativeMarks = function()
{
    for ( var Id in this.m_aChangedClasses )
    {
        this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
    }

    // Очищаем массив
    this.m_aChangedClasses = {};
};

CCollaborativeEditing.prototype.Clear_DocumentPositions = function()
{
};
CCollaborativeEditing.prototype.Add_DocumentPosition = function(DocumentPos)
{
};
CCollaborativeEditing.prototype.Update_DocumentPositionsOnAdd = function(Class, Pos)
{
};
CCollaborativeEditing.prototype.Update_DocumentPositionsOnRemove = function(Class, Pos, Count)
{
};
CCollaborativeEditing.prototype.OnStart_SplitRun = function(SplitRun, SplitPos)
{
};
CCollaborativeEditing.prototype.OnEnd_SplitRun = function(NewRun)
{
};
CCollaborativeEditing.prototype.Update_DocumentPosition = function(DocPos)
{
};

var CollaborativeEditing = new CCollaborativeEditing();