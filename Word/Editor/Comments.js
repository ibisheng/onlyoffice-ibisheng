/**
 * User: Ilja.Kirillov
 * Date: 10.10.12
 * Time: 10:38
 */

function CCommentData()
{
    this.m_sText      = "";
    this.m_sTime      = "";
    this.m_sUserId    = "";
    this.m_sUserName  = "";
    this.m_sQuoteText = null;
    this.m_bSolved    = false;
    this.m_aReplies   = new Array();

    this.Add_Reply = function(CommentData)
    {
        this.m_aReplies.push( CommentData );
    };

    this.Set_Text = function(Text)
    {
        this.m_sText = Text;
    };

    this.Get_Text = function()
    {
        return this.m_sText;
    };

    this.Get_QuoteText = function()
    {
        return this.m_sQuoteText;
    };

    this.Set_QuoteText = function(Quote)
    {
        this.m_sQuoteText = Quote;
    };

    this.Get_Solved = function()
    {
        return this.m_bSolved;
    };

    this.Set_Solved = function(Solved)
    {
        this.m_bSolved = Solved;
    };

    this.Set_Name = function(Name)
    {
        this.m_sUserName = Name;
    };

    this.Get_Name = function()
    {
        return this.m_sUserName;
    };

    this.Get_RepliesCount = function()
    {
        return this.m_aReplies.length;
    };

    this.Get_Reply = function(Index)
    {
        if ( Index < 0 || Index >= this.m_aReplies.length )
            return null;

        return this.m_aReplies[Index];
    };

    this.Read_FromAscCommentData = function(AscCommentData)
    {
        this.m_sText      = AscCommentData.asc_getText();
        this.m_sTime      = AscCommentData.asc_getTime();
        this.m_sUserId    = AscCommentData.asc_getUserId();
        this.m_sQuoteText = AscCommentData.asc_getQuoteText();
        this.m_bSolved    = AscCommentData.asc_getSolved();
        this.m_sUserName  = AscCommentData.asc_getUserName();

        var RepliesCount  = AscCommentData.asc_getRepliesCount();
        for ( var Index = 0; Index < RepliesCount; Index++ )
        {
            var Reply = new CCommentData();
            Reply.Read_FromAscCommentData( AscCommentData.asc_getReply(Index) );
            this.m_aReplies.push( Reply );
        }
    };

    this.Write_ToBinary2 = function(Writer)
    {
        // String            : m_sText
        // String            : m_sTime
        // String            : m_sUserId
        // String            : m_sUserName
        // Bool              : Null ли QuoteText
        // String            : (Если предыдущий параметр false) QuoteText
        // Bool              : Solved
        // Long              : Количество отетов
        // Array of Variable : Ответы

        var Count = this.m_aReplies.length;
        Writer.WriteString2( this.m_sText );
        Writer.WriteString2( this.m_sTime );
        Writer.WriteString2( this.m_sUserId );
        Writer.WriteString2( this.m_sUserName );

        if ( null === this.m_sQuoteText )
            Writer.WriteBool( true );
        else
        {
            Writer.WriteBool( false );
            Writer.WriteString2( this.m_sQuoteText );
        }
        Writer.WriteBool( this.m_bSolved );
        Writer.WriteLong( Count );

        for ( var Index = 0; Index < Count; Index++ )
        {
            this.m_aReplies[Index].Write_ToBinary2(Writer);
        }
    };

    this.Read_FromBinary2 = function(Reader)
    {
        // String            : m_sText
        // String            : m_sTime
        // String            : m_sUserId
        // Bool              : Null ли QuoteText
        // String            : (Если предыдущий параметр false) QuoteText
        // Bool              : Solved
        // Long              : Количество отетов
        // Array of Variable : Ответы

        this.m_sText     = Reader.GetString2();
        this.m_sTime     = Reader.GetString2();
        this.m_sUserId   = Reader.GetString2();
        this.m_sUserName = Reader.GetString2();

        var bNullQuote = Reader.GetBool();
        if ( true != bNullQuote  )
            this.m_sQuoteText = Reader.GetString2();
        else
            this.m_sQuoteText = null;

        this.m_bSolved = Reader.GetBool();

        var Count = Reader.GetLong();
        this.m_aReplies.length = 0;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var oReply = new CCommentData();
            oReply.Read_FromBinary2( Reader );
            this.m_aReplies.push( oReply );
        }
    };
}

var comment_type_Common = 1; // Комментарий к обычному тексу
var comment_type_HdrFtr = 2; // Комментарий к колонтитулу

function CComment(Parent, Data)
{
    this.Id     = g_oIdCounter.Get_NewId();

    this.Parent = Parent;
    this.Data   = Data;

    this.m_oTypeInfo =
    {
        Type : comment_type_Common,
        Data : null
    };

    this.m_oStartInfo =
    {
        X       : 0,
        Y       : 0,
        H       : 0,
        PageNum : 0,
        ParaId  : null
    };

    this.m_oEndInfo =
    {
        X       : 0,
        Y       : 0,
        H       : 0,
        PageNum : 0,
        ParaId  : null
    };

    this.Lock = new CLock(); // Зажат ли комментарий другим пользователем
    if ( false === g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( locktype_Mine, false );
        CollaborativeEditing.Add_Unlock2( this );
    }

    this.Set_StartInfo = function(PageNum, X, Y, H, ParaId)
    {
        this.m_oStartInfo.X       = X;
        this.m_oStartInfo.Y       = Y;
        this.m_oStartInfo.H       = H;
        this.m_oStartInfo.ParaId  = ParaId;

        // Если у нас комментарий в колонтитуле, то номер страницы обновляется при нажатии на комментарий
        if ( comment_type_Common === this.m_oTypeInfo.Type )
            this.m_oStartInfo.PageNum = PageNum;
    };

    this.Set_EndInfo = function(PageNum, X, Y, H, ParaId)
    {
        this.m_oEndInfo.X       = X;
        this.m_oEndInfo.Y       = Y;
        this.m_oEndInfo.H       = H;
        this.m_oEndInfo.ParaId  = ParaId;

        if ( comment_type_Common === this.m_oTypeInfo.Type )
            this.m_oEndInfo.PageNum = PageNum;
    };

    this.Check_ByXY = function(PageNum, X, Y, Type)
    {
        if ( this.m_oTypeInfo.Type != Type )
            return false;

        if ( comment_type_Common === Type )
        {
            if ( PageNum < this.m_oStartInfo.PageNum || PageNum > this.m_oEndInfo.PageNum )
                return false;

            if ( PageNum === this.m_oStartInfo.PageNum && ( Y < this.m_oStartInfo.Y || ( Y < (this.m_oStartInfo.Y + this.m_oStartInfo.H) && X < this.m_oStartInfo.X ) ) )
                return false;

            if ( PageNum === this.m_oEndInfo.PageNum && ( Y > this.m_oEndInfo.Y + this.m_oEndInfo.H || ( Y > this.m_oEndInfo.Y && X > this.m_oEndInfo.X ) ) )
                return false;
        }
        else if ( comment_type_HdrFtr === Type )
        {
            var HdrFtr = this.m_oTypeInfo.Data;

            if ( null === HdrFtr || false === HdrFtr.Check_Page(PageNum) )
                return false;

            if ( Y < this.m_oStartInfo.Y || ( Y < (this.m_oStartInfo.Y + this.m_oStartInfo.H) && X < this.m_oStartInfo.X ) )
                return false;

            if ( Y > this.m_oEndInfo.Y + this.m_oEndInfo.H || ( Y > this.m_oEndInfo.Y && X > this.m_oEndInfo.X ) )
                return false;

            this.m_oStartInfo.PageNum = PageNum;
            this.m_oEndInfo.PageNum   = PageNum;
        }

        return true;
    };

    this.Set_Data = function(Data)
    {
        History.Add( this, { Type : historyitem_Comment_Change, New : Data, Old : this.Data } );
        this.Data = Data;
    };

    this.Remove_Marks = function()
    {
        var Para_start = g_oTableId.Get_ById(this.m_oStartInfo.ParaId);
        var Para_end   = g_oTableId.Get_ById(this.m_oEndInfo.ParaId);

        if ( Para_start === Para_end )
        {
            if ( null != Para_start )
                Para_start.Remove_CommentMarks( this.Id );
        }
        else
        {
            if ( null != Para_start )
                Para_start.Remove_CommentMarks( this.Id );

            if ( null != Para_end )
                Para_end.Remove_CommentMarks( this.Id );
        }
    };

    this.Set_TypeInfo = function(Type, Data)
    {
        var New =
        {
            Type : Type,
            Data : Data
        };

        History.Add( this, { Type : historyitem_Comment_TypeInfo, New : New, Old : this.m_oTypeInfo } );

        this.m_oTypeInfo = New;

        if ( comment_type_HdrFtr === Type )
        {
            // Проставим начальные значения страниц (это текущий номер страницы, на котором произошло добавление комментария)
            var PageNum = Data.Content.Get_StartPage_Absolute();
            this.m_oStartInfo.PageNum = PageNum;
            this.m_oEndInfo.PageNum   = PageNum;
        }
    };

    this.Get_TypeInfo = function()
    {
        return this.m_oTypeInfo;
    };
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    this.Undo = function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Comment_Change:
            {
                this.Data = Data.Old;
                editor.sync_ChangeCommentData( this.Id, this.Data );
                break;
            }

            case historyitem_Comment_TypeInfo:
            {
                this.m_oTypeInfo = Data.Old;
                break;
            }
        }
    };

    this.Redo = function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Comment_Change:
            {
                this.Data = Data.New;
                editor.sync_ChangeCommentData( this.Id, this.Data );
                break;
            }

            case historyitem_Comment_TypeInfo:
            {
                this.m_oTypeInfo = Data.New;
                break;
            }
        }
    };

    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем (если что просто будет перерисовка)
    };
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактированием
//-----------------------------------------------------------------------------------
    this.Save_Changes = function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Comment );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Comment_Change:
            {
                // Variable : Data
                Data.New.Write_ToBinary2( Writer );
                break;
            }

            case historyitem_Comment_TypeInfo:
            {
                // Long : тип
                //  Если comment_type_HdrFtr
                //  String : Id колонтитула

                var Type = Data.New.Type;

                Writer.WriteLong( Type );

                if ( comment_type_HdrFtr === Type )
                {
                    var HdrFtr = Data.New.Data;
                    Writer.WriteString2( HdrFtr.Get_Id() );
                }

                break;
            }
        }

        return Writer;
    };

    this.Save_Changes2 = function(Data, Writer)
    {
        var bRetValue = false;
        var Type = Data.Type;
        switch ( Type )
        {
            case  historyitem_Comment_Change:
            {
                break;
            }

            case  historyitem_Comment_TypeInfo:
            {
                break;
            }
        }

        return bRetValue;
    };

    this.Load_Changes = function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Comment != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Comment_Change:
            {
                // Variable : Data
                this.Data.Read_FromBinary2( Reader );
                editor.sync_ChangeCommentData( this.Id, this.Data );
                break;
            }

            case historyitem_Comment_TypeInfo:
            {
                // Long : тип
                //  Если comment_type_HdrFtr
                //  String : Id колонтитула

                this.m_oTypeInfo.Type = Reader.GetLong()

                if ( comment_type_HdrFtr === this.m_oTypeInfo.Type )
                {
                    var HdrFtrId = Reader.GetString2();
                    this.m_oTypeInfo.Data = g_oTableId.Get_ById( HdrFtrId );
                }

                break;
            }
        }

        return true;
    };

    this.Get_Id = function()
    {
        return this.Id;
    };

    this.Set_Id = function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    };

    this.Write_ToBinary2 = function(Writer)
    {
        Writer.WriteLong( historyitem_type_Comment );

        // String   : Id
        // Variable : Data
        // Long     : m_oTypeInfo.Type
        //          : m_oTypeInfo.Data
        //    Если comment_type_HdrFtr
        //    String : Id колонтитула

        Writer.WriteString2( this.Id );
        this.Data.Write_ToBinary2(Writer);
        Writer.WriteLong( this.m_oTypeInfo.Type );

        if ( comment_type_HdrFtr === this.m_oTypeInfo.Type )
            Writer.WriteString2( this.m_oTypeInfo.Data.Get_Id() );
    };

    this.Read_FromBinary2 = function(Reader)
    {
        // String   : Id
        // Variable : Data
        // Long     : m_oTypeInfo.Type
        //          : m_oTypeInfo.Data
        //    Если comment_type_HdrFtr
        //    String : Id колонтитула

        this.Id = Reader.GetString2();
        this.Data = new CCommentData();
        this.Data.Read_FromBinary2(Reader);
        this.m_oTypeInfo.Type = Reader.GetLong();
        if ( comment_type_HdrFtr === this.m_oTypeInfo.Type )
            this.m_oTypeInfo.Data = g_oTableId.Get_ById( Reader.GetString2() );
    };

    this.Check_MergeData = function()
    {
        // Проверяем, не удалили ли мы параграф, к которому был сделан данный комментарий
        // Делаем это в самом конце, а не сразу, чтобы заполнились данные о начальном и
        // конечном параграфах.

        var bUse = true;

        if ( null != this.m_oStartInfo.ParaId )
        {
            var Para_start = g_oTableId.Get_ById( this.m_oStartInfo.ParaId );

            if ( true != Para_start.Is_UseInDocument() )
                bUse = false;
        }

        if ( true === bUse && null != this.m_oEndInfo.ParaId )
        {
            var Para_end = g_oTableId.Get_ById( this.m_oEndInfo.ParaId );

            if ( true != Para_end.Is_UseInDocument() )
                bUse = false;
        }

        if ( false === bUse )
            editor.WordControl.m_oLogicDocument.Remove_Comment( this.Id, true );
    };

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

var comments_NoComment        = 0;
var comments_NonActiveComment = 1;
var comments_ActiveComment    = 2;

function CComments()
{
    this.Id     = g_oIdCounter.Get_NewId();

    this.m_bUse         = false; // Используются ли комментарии

    this.m_aComments    = {};    // ассоциативный  массив
    this.m_sCurrent     = null;  // текущий комментарий
    this.m_aCurrentDraw = new Array();

    this.Get_Id = function()
    {
        return this.Id;
    };

    this.Set_Id = function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    };

    this.Set_Use = function(Use)
    {
        this.m_bUse = Use;
    };

    this.Is_Use = function()
    {
        return this.m_bUse;
    };

    this.Add = function(Comment)
    {
        var Id = Comment.Get_Id();

        History.Add( this, { Type : historyitem_Comments_Add, Id : Id, Comment : Comment } );
        this.m_aComments[Id] = Comment;
    };

    this.Get_ById = function(Id)
    {
        if ( "undefined" != typeof(this.m_aComments[Id]) )
            return this.m_aComments[Id];

        return null;
    };

    this.Remove_ById = function(Id)
    {
        if ( "undefined" != typeof(this.m_aComments[Id]) )
        {
            History.Add( this, { Type : historyitem_Comments_Remove, Id : Id, Comment : this.m_aComments[Id] } );

            // Сначала удаляем комментарий из списка комментариев, чтобы данная функция не зацикливалась на вызове Remove_Marks
            var Comment = this.m_aComments[Id];
            delete this.m_aComments[Id];
            Comment.Remove_Marks();
            return true;
        }

        return false;
    };

    this.Reset_CurrentDraw = function(PageNum)
    {
        this.m_aCurrentDraw.length = 0;

        for ( var Id in this.m_aComments )
        {
            var Comment = this.m_aComments[Id];

            if ( PageNum > Comment.m_oStartInfo.PageNum && PageNum <= Comment.m_oEndInfo.PageNum )
                this.m_aCurrentDraw.push( Comment.Get_Id() );
        }
    };

    this.Add_CurrentDraw = function(Id)
    {
        if ( null != this.Get_ById( Id ) )
            this.m_aCurrentDraw.push( Id );
    };

    this.Remove_CurrentDraw = function(Id)
    {
        var Count = this.m_aCurrentDraw.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( Id === this.m_aCurrentDraw[Index] )
            {
                this.m_aCurrentDraw.splice( Index, 1 );
                return;
            }
        }
    };

    this.Check_CurrentDraw = function()
    {
        var Flag = comments_NoComment;

        var Count = this.m_aCurrentDraw.length;
        if ( Count > 0 )
            Flag = comments_NonActiveComment;

        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( this.m_aCurrentDraw[Index] === this.m_sCurrent )
            {
                Flag = comments_ActiveComment;
                return Flag;
            }
        }

        return Flag;
    };

    this.Set_Current = function(Id)
    {
        this.m_sCurrent = Id;
    };

    this.Set_StartInfo = function(Id, PageNum, X, Y, H, ParaId)
    {
        var Comment = this.Get_ById( Id );
        if ( null != Comment )
            Comment.Set_StartInfo( PageNum, X, Y, H, ParaId);
    };

    this.Set_EndInfo = function(Id, PageNum, X, Y, H, ParaId)
    {
        var Comment = this.Get_ById( Id );
        if ( null != Comment )
            Comment.Set_EndInfo( PageNum, X, Y, H, ParaId );
    };

    this.Get_ByXY = function(PageNum, X, Y, Type)
    {
        for (var Id in this.m_aComments)
        {
            var Comment = this.m_aComments[Id];
            if ( true === Comment.Check_ByXY( PageNum, X, Y, Type ) )
                return Comment;
        }

        return null;
    };

    this.Get_Current = function()
    {
        if ( null != this.m_sCurrent )
        {
            var Comment = this.Get_ById( this.m_sCurrent );
            if ( null != Comment )
                return Comment;
        }

        return null;
    };

    this.Get_CurrentId = function()
    {
        return this.m_sCurrent;
    };

    this.Set_CommentData = function(Id, CommentData)
    {
        var Comment = this.Get_ById( Id );
        if ( null != Comment )
            Comment.Set_Data( CommentData );
    };

    this.Check_MergeData = function()
    {
        for (var Id in this.m_aComments)
        {
            this.m_aComments[Id].Check_MergeData();
        }
    };

//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    this.Undo = function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Comments_Add:
            {
                delete this.m_aComments[Data.Id];
                editor.sync_RemoveComment( Data.Id );
                break;
            }

            case historyitem_Comments_Remove:
            {
                this.m_aComments[Data.Id] = Data.Comment;
                editor.sync_AddComment( Data.Id, Data.Comment.Data );
                break;
            }
        }
    };

    this.Redo = function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Comments_Add:
            {
                this.m_aComments[Data.Id] = Data.Comment;
                editor.sync_AddComment( Data.Id, Data.Comment.Data );
                break;
            }

            case historyitem_Comments_Remove:
            {
                delete this.m_aComments[Data.Id];
                editor.sync_RemoveComment( Data.Id );
                break;
            }
        }
    };

    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем, т.к. изменение комментариев не влияет на пересчет
    };
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактированием
//-----------------------------------------------------------------------------------
    this.Document_Is_SelectionLocked = function(Id)
    {
        var Comment = this.Get_ById( Id );
        if ( null != Comment )
            Comment.Lock.Check( Comment.Get_Id() );
    };

    this.Save_Changes = function(Data, Writer)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        Writer.WriteLong( historyitem_type_Comments );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );

        switch ( Type )
        {
            case historyitem_Comments_Add:
            {
                // String : Id комментария

                Writer.WriteString2( Data.Id );

                break;
            }

            case historyitem_Comments_Remove:
            {
                // String : Id комментария

                Writer.WriteString2( Data.Id );

                break;
            }
        }

        return Writer;
    };

    this.Save_Changes2 = function(Data, Writer)
    {
        var bRetValue = false;
        var Type = Data.Type;
        switch ( Type )
        {
            case  historyitem_Comments_Add:
            {
                break;
            }

            case historyitem_Comments_Remove:
            {
                break;
            }
        }

        return bRetValue;
    };

    this.Load_Changes = function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Comments != ClassType )
            return;

        var Type = Reader.GetLong();

        switch ( Type )
        {
            case historyitem_Comments_Add:
            {
                // String : Id комментария

                var CommentId = Reader.GetString2();
                var Comment = g_oTableId.Get_ById( CommentId );
                this.m_aComments[CommentId] = Comment;
                editor.sync_AddComment( CommentId, Comment.Data );

                break;
            }

            case historyitem_Comments_Remove:
            {
                // String : Id комментария

                var CommentId = Reader.GetString2();
                delete this.m_aComments[CommentId];
                editor.sync_RemoveComment( CommentId );

                break;
            }
        }

        return true;
    };


    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

//----------------------------------------------------------------------------------------------------------------------
// Класс для работы внутри параграфа
//----------------------------------------------------------------------------------------------------------------------

function ParaComment(Start, Id)
{
    this.Id = g_oIdCounter.Get_NewId();

    this.Start     = Start;
    this.CommentId = Id;

    this.Type  = para_Comment;

    this.StartLine  = 0;
    this.StartRange = 0;

    this.Lines = new Array();
    this.LinesLength = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

ParaComment.prototype =
{
    Get_Id : function()
    {
        return this.Id;
    },

    Set_Paragraph : function()
    {
    },

    Is_Empty : function()
    {
        return true;
    },

    Get_CompiledTextPr : function()
    {
        return null;
    },

    Remove : function()
    {
        return false;
    },

    Get_DrawingObjectRun : function(Id)
    {
        return null;
    },

    Get_DrawingObjectContentPos : function(Id, ContentPos, Depth)
    {
        return false;
    },

    Get_Layout : function(DrawingLayout, UseContentPos, ContentPos, Depth)
    {
    },

    Get_NextRunElements : function(RunElements, UseContentPos, Depth)
    {
    },

    Get_PrevRunElements : function(RunElements, UseContentPos, Depth)
    {
    },

    Collect_DocumentStatistics : function(ParaStats)
    {
    },

    Create_FontMap : function(Map)
    {
    },

    Get_AllFontNames : function(AllFonts)
    {
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
    },

    Recalculate_Range : function(ParaPr)
    {
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, _CurRange)
    {
    },

    Recalculate_Range_Spaces : function(PRSA, CurLine, CurRange, CurPage)
    {
        var Para = PRSA.Paragraph;
        var DocumentComments = Para.LogicDocument.Comments;

        var X    = PRSA.X;
        var Y    = Para.Pages[CurPage].Y      + Para.Lines[CurLine].Top;
        var H    = Para.Lines[CurLine].Bottom - Para.Lines[CurLine].Top;
        var Page = Para.Get_StartPage_Absolute() + CurPage;

        if ( true === this.Start )
            DocumentComments.Set_StartInfo( this.CommentId, Page, X, Y, H, Para.Get_Id() );
        else
            DocumentComments.Set_EndInfo( this.CommentId, Page, X, Y, H, Para.Get_Id() );
    },

    Recalculate_PageEndInfo : function(PRSI, _CurLine, _CurRange)
    {
        if ( true === this.Start )
            PRSI.Add_Comment( this.CommentId );
        else
            PRSI.Remove_Comment( this.CommentId );
    },

    Save_Lines : function()
    {
        var CommentLines = new CParagraphLinesInfo(this.StartLine, this.StartRange);
        return CommentLines;
    },

    Restore_Lines : function(CommentLines)
    {
    },

    Is_EmptyRange : function(_CurLine, _CurRange)
    {
        return true;
    },

    Check_BreakPageInRange : function(_CurLine, _CurRange)
    {
        return false;
    },

    Check_BreakPageEnd : function(PBChecker)
    {
        return true;
    },

    Recalculate_CurPos : function(X, Y, CurrentRun, _CurRange, _CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget)
    {
        return { X : X };
    },
//-----------------------------------------------------------------------------------
// Функции отрисовки
//-----------------------------------------------------------------------------------
    Draw_HighLights : function(PDSH)
    {
        if ( true === this.Start )
            PDSH.Add_Comment( this.CommentId );
        else
            PDSH.Remove_Comment( this.CommentId );
    },

    Draw_Elements : function(PDSE)
    {
    },

    Draw_Lines : function(PDSL)
    {
    },
//-----------------------------------------------------------------------------------
// Функции для работы с курсором
//-----------------------------------------------------------------------------------
    Is_CursorPlaceable : function()
    {
        return false;
    },

    Cursor_Is_Start : function()
    {
        return true;
    },

    Cursor_Is_NeededCorrectPos : function()
    {
        return true;
    },

    Cursor_Is_End : function()
    {
        return true;
    },

    Cursor_MoveToStartPos : function()
    {
    },

    Cursor_MoveToEndPos : function(SelectFromEnd)
    {
    },

    Get_ParaContentPosByXY : function(SearchPos, Depth, _CurLine, _CurRange, StepEnd)
    {
        return false;
    },

    Get_ParaContentPos : function(bSelection, bStart, ContentPos)
    {
    },

    Set_ParaContentPos : function(ContentPos, Depth)
    {
    },

    Get_PosByElement : function(Class, ContentPos, Depth, UseRange, Range, Line)
    {
        if ( this === Class )
            return true;

        return false;
    },


    Get_RunElementByPos : function(ContentPos, Depth)
    {
        return null;
    },

    Get_LeftPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
    },

    Get_RightPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
    },

    Get_WordStartPos : function(SearchPos, ContentPos, Depth, UseContentPos)
    {
    },

    Get_WordEndPos : function(SearchPos, ContentPos, Depth, UseContentPos, StepEnd)
    {
    },

    Get_EndRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        return false;
    },

    Get_StartRangePos : function(_CurLine, _CurRange, SearchPos, Depth)
    {
        return false;
    },

    Get_StartRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
    {
    },

    Get_StartPos : function(ContentPos, Depth)
    {
    },

    Get_EndPos : function(BehindEnd, ContentPos, Depth)
    {
    },
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
    Set_SelectionContentPos : function(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag)
    {
    },

    Selection_Stop : function()
    {
    },

    Selection_Remove : function()
    {
    },

    Select_All : function(Direction)
    {
    },

    Selection_DrawRange : function(_CurLine, _CurRange, SelectionDraw)
    {
    },

    Selection_IsEmpty : function(CheckEnd)
    {
        return true;
    },

    Selection_CheckParaEnd : function()
    {
        return false;
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_CommentMark );

        // String   : Id
        // String   : Id комментария
        // Bool     : Start

        Writer.WriteString2( "" + this.Id );
        Writer.WriteString2( "" + this.CommentId );
        Writer.WriteBool( this.Start );
    },

    Read_FromBinary2 : function(Reader)
    {
        this.Id        = Reader.GetString2();
        this.CommentId = Reader.GetString2();
        this.Start     = Reader.GetBool();
    }
};


