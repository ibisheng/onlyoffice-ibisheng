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

// Import
var g_oTableId = AscCommon.g_oTableId;
var History = AscCommon.History;

function CCommentData()
{
    this.m_sText      = "";
    this.m_sTime      = "";
    this.m_sUserId    = "";
    this.m_sUserName  = "";
    this.m_sQuoteText = null;
    this.m_bSolved    = false;
    this.m_aReplies   = [];
    
    this.Copy = function()
    {
        var NewData = new CCommentData();
        
        NewData.m_sText      = this.m_sText;
        NewData.m_sTime      = this.m_sTime;
        NewData.m_sUserId    = this.m_sUserId;
        NewData.m_sUserName  = this.m_sUserName;
        NewData.m_sQuoteText = this.m_sQuoteText;
        NewData.m_bSolved    = this.m_bSolved;
        
        var Count = this.m_aReplies.length;
        for (var Pos = 0; Pos < Count; Pos++)
        {
            NewData.m_aReplies.push(this.m_aReplies[Pos].Copy());
        }

        return NewData;
    };

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

function CCommentDrawingRect(X, Y, W, H, CommentId, InvertTransform)
{
    this.X = X;
    this.Y = Y;
    this.H = H;
    this.W = W;
    this.CommentId = CommentId;
    this.InvertTransform = InvertTransform;
}

var comment_type_Common = 1; // Комментарий к обычному тексу
var comment_type_HdrFtr = 2; // Комментарий к колонтитулу

function CComment(Parent, Data)
{
    this.Id     = AscCommon.g_oIdCounter.Get_NewId();

    this.Parent = Parent;
    this.Data   = Data;

    this.m_oTypeInfo =
    {
        Type : comment_type_Common,
        Data : null
    };
    
    this.StartId = null; // Id объекта, в содержимом которого идет начало комментария
    this.EndId   = null; // Id объекта, в содержимом которого идет конец комментария

    this.m_oStartInfo =
    {
        X       : 0,
        Y       : 0,
        H       : 0,
        PageNum : 0
    };

    this.Lock = new AscCommon.CLock(); // Зажат ли комментарий другим пользователем
    if ( false === AscCommon.g_oIdCounter.m_bLoad )
    {
        this.Lock.Set_Type( AscCommon.locktype_Mine, false );
        AscCommon.CollaborativeEditing.Add_Unlock2( this );
    }
    
    this.Copy = function()
    {
        return new CComment(this.Parent, this.Data.Copy());
    };
    
    this.Set_StartId = function(ObjId)
    {
        this.StartId = ObjId;        
    };
    
    this.Set_EndId = function(ObjId)
    {
        this.EndId = ObjId;
    };
    
    this.Set_StartInfo = function(PageNum, X, Y, H)
    {
        this.m_oStartInfo.X       = X;
        this.m_oStartInfo.Y       = Y;
        this.m_oStartInfo.H       = H;
        this.m_oStartInfo.PageNum = PageNum;        
    };

	this.Set_Data = function(Data)
	{
		History.Add(new CChangesCommentChange(this, this.Data, Data));
		this.Data = Data;
	};

    this.Remove_Marks = function()
    {
        var ObjStart = g_oTableId.Get_ById(this.StartId);
        var ObjEnd   = g_oTableId.Get_ById(this.EndId);

        if ( ObjStart === ObjEnd )
        {
            if ( null != ObjStart )
                ObjStart.Remove_CommentMarks( this.Id );
        }
        else
        {
            if ( null != ObjStart )
                ObjStart.Remove_CommentMarks( this.Id );

            if ( null != ObjEnd )
                ObjEnd.Remove_CommentMarks( this.Id );
        }
    };

    this.Set_TypeInfo = function(Type, Data)
    {
        var New =
        {
            Type : Type,
            Data : Data
        };

        History.Add(new CChangesCommentTypeInfo(this, this.m_oTypeInfo, New));

        this.m_oTypeInfo = New;

        if ( comment_type_HdrFtr === Type )
        {
            // Проставим начальные значения страниц (это текущий номер страницы, на котором произошло добавление комментария)
            var PageNum = Data.Content.Get_StartPage_Absolute();
            this.m_oStartInfo.PageNum = PageNum;
        }
    };

    this.Get_TypeInfo = function()
    {
        return this.m_oTypeInfo;
    };
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем (если что просто будет перерисовка)
    };
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактированием
//-----------------------------------------------------------------------------------
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
        Writer.WriteLong( AscDFH.historyitem_type_Comment );

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

        if ( null != this.StartId )
        {
            var ObjStart = g_oTableId.Get_ById( this.StartId );

            if ( true != ObjStart.Is_UseInDocument() )
                bUse = false;
        }

        if ( true === bUse && null != this.EndId )
        {
            var ObjEnd = g_oTableId.Get_ById( this.EndId );

            if ( true != ObjEnd.Is_UseInDocument() )
                bUse = false;
        }

        if ( false === bUse )
            editor.WordControl.m_oLogicDocument.Remove_Comment( this.Id, true, false );
    };

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

var comments_NoComment        = 0;
var comments_NonActiveComment = 1;
var comments_ActiveComment    = 2;

function CComments()
{
    this.Id     = AscCommon.g_oIdCounter.Get_NewId();

    this.m_bUse         = false; // Используются ли комментарии

    this.m_aComments    = {};    // ассоциативный  массив
    this.m_sCurrent     = null;  // текущий комментарий
    
    this.Pages = [];

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

		History.Add(new CChangesCommentsAdd(this, Id, Comment));
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
            History.Add(new CChangesCommentsRemove(this, Id, this.m_aComments[Id]));

            // Сначала удаляем комментарий из списка комментариев, чтобы данная функция не зацикливалась на вызове Remove_Marks
            var Comment = this.m_aComments[Id];
            delete this.m_aComments[Id];
            Comment.Remove_Marks();
            return true;
        }

        return false;
    };

    this.Reset_Drawing = function(PageNum)
    {
        this.Pages[PageNum] = [];
    };

    this.Add_DrawingRect = function(X, Y, W, H, PageNum, CommentId, InvertTransform)
    {
        this.Pages[PageNum].push( new CCommentDrawingRect(X, Y, W, H, CommentId, InvertTransform) );
    };

    this.Set_Current = function(Id)
    {
        this.m_sCurrent = Id;
    };

    this.Get_ByXY = function(PageNum, X, Y, Type)
    {
        var Page = this.Pages[PageNum], _X, _Y;
        if ( undefined !== Page )
        {
            var Count = Page.length;
            for ( var Pos = 0; Pos < Count; Pos++ )
            {
                var DrawingRect = Page[Pos];
                if(!DrawingRect.InvertTransform)
                {
                    _X = X;
                    _Y = Y;
                }
                else
                {
                    _X = DrawingRect.InvertTransform.TransformPointX(X, Y);
                    _Y = DrawingRect.InvertTransform.TransformPointY(X, Y);
                }
                if ( _X >= DrawingRect.X && _X <= DrawingRect.X + DrawingRect.W && _Y >= DrawingRect.Y && _Y <= DrawingRect.Y + DrawingRect.H )
                {
                    var Comment = this.Get_ById( DrawingRect.CommentId );
                    if ( null != Comment )
                        return Comment;
                }
            }
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
    this.Refresh_RecalcData = function(Data)
    {
        // Ничего не делаем, т.к. изменение комментариев не влияет на пересчет
    };

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

//----------------------------------------------------------------------------------------------------------------------
// Класс для работы внутри параграфа
//----------------------------------------------------------------------------------------------------------------------

function ParaComment(Start, Id)
{
    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.Paragraph = null;

    this.Start     = Start;
    this.CommentId = Id;

    this.Type  = para_Comment;

    this.StartLine  = 0;
    this.StartRange = 0;

    this.Lines = [];
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

	Set_CommentId : function(NewCommentId)
	{
		if (this.CommentId !== NewCommentId)
		{
			History.Add(new CChangesParaCommentCommentId(this, this.CommentId, NewCommentId));
			this.CommentId = NewCommentId;
		}
	},

    Set_Paragraph : function(Paragraph)
    {
        this.Paragraph = Paragraph;
    },

    Is_Empty : function()
    {
        return true;
    },

    Is_CheckingNearestPos : function()
    {
        return false;
    },

    Get_CompiledTextPr : function()
    {
        return null;
    },

    Clear_TextPr : function()
    {

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

    Get_SelectedText : function(bAll, bClearText, oPr)
    {        
        return "";
    },

    Get_SelectionDirection : function()
    {
        return 1;
    },

    Clear_TextFormatting : function( DefHyper )
    {
    },
    
    Can_AddDropCap : function()
    {
        return null;
    },

    Get_TextForDropCap : function(DropCapText, UseContentPos, ContentPos, Depth)
    {
    },

    Get_StartTabsCount : function(TabsCounter)
    {
        return true;
    },

    Remove_StartTabs : function(TabsCounter)
    {
        return true;
    },
    
    Copy : function(Selected)
    {
        return new ParaComment(this.Start, this.CommentId);
    },

    CopyContent : function(Selected)
    {
        return [];
    },
    
    Split : function()
    {
        return new ParaRun();
    },
    
    Apply_TextPr : function()
    {
    },

    Check_RevisionsChanges : function(Checker, ContentPos, Depth)
    {
    },

    Get_ParaPosByContentPos : function(ContentPos, Depth)
    {
        return new CParaPos(this.StartRange, this.StartLine, 0, 0);
    },
//-----------------------------------------------------------------------------------
// Функции пересчета
//-----------------------------------------------------------------------------------

    Recalculate_Reset : function(StartRange, StartLine)
    {
        this.StartLine   = StartLine;
        this.StartRange  = StartRange;
    },

    Recalculate_Range : function(PRS, ParaPr)
    {
    },

    Recalculate_Set_RangeEndPos : function(PRS, PRP, Depth)
    {
    },

    Recalculate_LineMetrics : function(PRS, ParaPr, _CurLine, _CurRange)
    {
    },

    Recalculate_Range_Width : function(PRSC, _CurLine, _CurRange)
    {
    },

    Recalculate_Range_Spaces : function(PRSA, CurLine, CurRange, CurPage)
    {
        var Para = PRSA.Paragraph;
        var DocumentComments = Para.LogicDocument.Comments;
        var Comment = DocumentComments.Get_ById( this.CommentId );
        if ( null === Comment )
            return;

        var X    = PRSA.X;
        var Y    = Para.Pages[CurPage].Y      + Para.Lines[CurLine].Top;
        var H    = Para.Lines[CurLine].Bottom - Para.Lines[CurLine].Top;
        var Page = Para.Get_StartPage_Absolute() + CurPage;
        
        if ( comment_type_HdrFtr === Comment.m_oTypeInfo.Type )
        {
            var HdrFtr = Comment.m_oTypeInfo.Data;

            if (-1 !== HdrFtr.RecalcInfo.CurPage)
                Page = HdrFtr.RecalcInfo.CurPage;
        }

        if ( true === this.Start )
        {
            Comment.Set_StartId( Para.Get_Id() );
            Comment.Set_StartInfo( Page, X, Y, H );
        }
        else
        {
            Comment.Set_EndId( Para.Get_Id() );
        }                
    },

    Recalculate_PageEndInfo : function(PRSI, _CurLine, _CurRange)
    {
        if ( true === this.Start )
            PRSI.Add_Comment( this.CommentId );
        else
            PRSI.Remove_Comment( this.CommentId );
    },

    Save_RecalculateObject : function(Copy)
    {
        var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
        return RecalcObj;
    },

    Load_RecalculateObject : function(RecalcObj, Parent)
    {
        this.StartLine  = RecalcObj.StartLine;
        this.StartRange = RecalcObj.StartRange;
        
        var PageNum = Parent.Get_StartPage_Absolute();
        
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Comment = DocumentComments.Get_ById( this.CommentId );
        
        Comment.m_oStartInfo.PageNum = PageNum;
    },

    Prepare_RecalculateObject : function()
    {
    },

    Is_EmptyRange : function(_CurLine, _CurRange)
    {
        return true;
    },

    Check_Range_OnlyMath : function(Checker, CurRange, CurLine)
    {
    },

    Check_MathPara : function(Checker)
    {
    },

    Check_PageBreak : function()
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

    Recalculate_MinMaxContentWidth : function()
    {

    },

    Get_Range_VisibleWidth : function(RangeW, _CurLine, _CurRange)
    {
    },

    Shift_Range : function(Dx, Dy, _CurLine, _CurRange)
    {
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Comment = DocumentComments.Get_ById( this.CommentId );
        if ( null === Comment )
            return;

        if ( true === this.Start )
        {
            Comment.m_oStartInfo.X += Dx;
            Comment.m_oStartInfo.Y += Dy;
        }
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

    Get_ParaContentPos : function(bSelection, bStart, ContentPos, bUseCorrection)
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

    Get_ElementByPos : function(ContentPos, Depth)
    {
        return this;
    },

    Get_ClassesByPos : function(Classes, ContentPos, Depth)
    {
        Classes.push(this);
    },

    Get_PosByDrawing : function(Id, ContentPos, Depth)
    {
        return false;
    },

    Get_RunElementByPos : function(ContentPos, Depth)
    {
        return null;
    },

    Get_LastRunInRange : function(_CurLine, _CurRange)
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

	Get_EndRangePos2 : function(_CurLine, _CurRange, ContentPos, Depth)
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

    Is_SelectedAll : function(Props)
    {
        return true;
    },

    Selection_CorrectLeftPos : function(Direction)
    {
        return true;
    },

    Selection_CheckParaContentPos : function(ContentPos)
    {
        return true;
    },
//----------------------------------------------------------------------------------------------------------------------
// Функции совместного редактирования
//----------------------------------------------------------------------------------------------------------------------
    Refresh_RecalcData : function()
    {
    },
    
    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( AscDFH.historyitem_type_CommentMark );

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
ParaComment.prototype.Get_CurrentParaPos = function()
{
    return new CParaPos(this.StartRange, this.StartLine, 0, 0);
};
ParaComment.prototype.Get_TextPr = function(ContentPos, Depth)
{
    return new CTextPr();
};
ParaComment.prototype.CanSplit = function()
{
	return false;
};
//----------------------------------------------------------------------------------------------------------------------
// Разное
//----------------------------------------------------------------------------------------------------------------------
ParaComment.prototype.Set_ReviewType = function(ReviewType, RemovePrChange){};
ParaComment.prototype.Set_ReviewTypeWithInfo = function(ReviewType, ReviewInfo){};
ParaComment.prototype.Check_RevisionsChanges = function(Checker, ContentPos, Depth){};
ParaComment.prototype.Accept_RevisionChanges = function(Type, bAll){};
ParaComment.prototype.Reject_RevisionChanges = function(Type, bAll){};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommon'] = window['AscCommon'] || {};
window['AscCommon'].CCommentData = CCommentData;
window['AscCommon'].CComment = CComment;
window['AscCommon'].ParaComment = ParaComment;
