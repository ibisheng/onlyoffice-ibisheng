"use strict";
//-----------------------------------------------------------------------------------
// Global counters
//-----------------------------------------------------------------------------------

function CCollaborativeEditing()
{

    this.m_aLinkData = [];
    this.m_aNewImages = [];

    this.m_aChangedClasses = {};

    this.m_bFast = false;

    this.Set_Fast = function(bFast)
    {
        this.m_bFast = bFast;
    };

    this.Is_Fast = function()
    {
        return this.m_bFast;
    };

    this.Have_OtherChanges = function()
    {
        return false;
    };

    this.Start_CollaborationEditing = function()
    {
    };

    this.Add_User = function(UserId)
    {
    };

    this.Find_User = function(UserId)
    {
    };

    this.Remove_User = function(UserId)
    {
    };

    this.Add_Changes = function(Changes)
    {
    };

    this.Add_Unlock = function(LockClass)
    {
    };

    this.Add_Unlock2 = function(Lock)
    {
    };

    this.Apply_OtherChanges = function()
    {
    };

    this.Get_SelfChanges = function()
    {

    };

    this.Apply_Changes = function()
    {
    };

    this.Send_Changes = function()
    {
    };

    this.Release_Locks = function()
    {
    };

    this.OnStart_Load_Objects = function()
    {
    };

    this.OnEnd_Load_Objects = function()
    {
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
    this.Check_MergeData = function()
    {
    };
//-----------------------------------------------------------------------------------
// Функции для проверки залоченности объектов
//-----------------------------------------------------------------------------------
    this.Get_GlobalLock = function()
    {
    };

    this.OnStart_CheckLock = function()
    {
    };

    this.Add_CheckLock = function(oItem)
    {
    };

    this.OnEnd_CheckLock = function()
    {
    };

    this.OnCallback_AskLock = function(result)
    {
    };
//-----------------------------------------------------------------------------------
// Функции для работы с залоченными объектами, которые еще не были добавлены
//-----------------------------------------------------------------------------------
    this.Reset_NeedLock = function()
    {
    };

    this.Add_NeedLock = function(Id, sUser)
    {
    };

    this.Remove_NeedLock = function(Id)
    {
    };

    this.Lock_NeedLock = function()
    {
    };
//-----------------------------------------------------------------------------------
// Функции для работы с новыми объектами, созданными на других клиентах
//-----------------------------------------------------------------------------------
    this.Clear_NewObjects = function()
    {
    };

    this.Add_NewObject = function(Class)
    {
    };

    this.OnEnd_ReadForeignChanges = function()
    {
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
    };

    this.Clear_DCChanges = function()
    {
    };

    this.Refresh_DCChanges = function()
    {
    };
//-----------------------------------------------------------------------------------
// Функции для работы с отметками изменений
//-----------------------------------------------------------------------------------
    this.Add_ChangedClass = function(Class)
    {
        var Id = Class.Get_Id();
        this.m_aChangedClasses[Id] = Class;
    };

    this.Clear_CollaborativeMarks = function()
    {
        for ( var Id in this.m_aChangedClasses )
        {
            this.m_aChangedClasses[Id].Clear_CollaborativeMarks();
        }

        // Очищаем массив
        this.m_aChangedClasses = {};
    };

}


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