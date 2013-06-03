/**
 * User: Ilja.Kirillov
 * Date: 09.12.11
 * Time: 11:51
 */
// Класс CDocumentContent. Данный класс используется для работы с контентом ячеек таблицы,
// колонтитулов, сносок, надписей.
var type_Table = 0x0002;
function CDocumentContent(Parent, DrawingDocument, X, Y, XLimit, YLimit, Split, TurnOffInnerWrap)
{
    this.Id = g_oIdCounter.Get_NewId();
    this.CurPage = 0;    // Текущая страница, в страницах самого контента
    this.StartPage = 0;  // Начальная страница во всем документе

    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;

    this.Parent = Parent;
    this.DrawingDocument = DrawingDocument;

    if ( "undefined" === typeof(TurnOffInnerWrap) )
        TurnOffInnerWrap = false;

    this.TurnOffInnerWrap = TurnOffInnerWrap;

    this.Pages = new Array();
    this.Pages[0] =
    {
        Pos : 0,
        X : X,
        Y : Y,
        XLimit : XLimit,
        YLimit : YLimit,

        Bounds :
        {
            Left   : X,
            Top    : Y,
            Right  : XLimit,
            Bottom : Y
        }
    };


    this.Split = Split; // Разделяем ли на страницы

    CollaborativeEditing.Add_NewDC(this);
    this.m_aContentChanges = new Array(); // список изменений(добавление/удаление элементов)

    this.IdCounter = 0;

    this.Content = new Array();
    this.Content[0] = new Paragraph( DrawingDocument, this, 0, X, Y, XLimit, YLimit, ++this.IdCounter);
    //this.Content[0].Set_Align( 2, false );
    this.Content[0].Set_DocumentNext( null );
    this.Content[0].Set_DocumentPrev( null );

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 0, // в зависимости, от параметра Type: либо позиция в Document.Content, либо в Document.FlowObjects
        RealX      : 0, // позиция курсора, без учета расположения букв
        RealY      : 0, // это актуально для клавиш вверх и вниз
        Type       : docpostype_Content,
        TableMove  : 0  // специльный параметр для переноса таблиц
    };

    this.Selection =
    {
        Start    : false,
        Use      : false,
        StartPos : 0,
        EndPos   : 0,
        Flag     : selectionflag_Common,
        Data     : null
    };

    // Массив укзателей на все инлайновые графические объекты
   // this.DrawingObjects = new CDrawingObjects();

  //  this.Styles    = this.Parent.Get_Styles();
   // this.Numbering = this.Parent.Get_Numbering();

    this.ClipInfo =
    {
        X0 : null,
        X1 : null
    };

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.TurnOffRecalc = false;

    this.arrStyles = new Array(9);
    this.Styles = new CStyles();
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CDocumentContent.prototype =
{

    hitToHyperlink: function(x, y)
    {
        var _content = this.Content;
        var _content_pos = this.Internal_GetContentPosByXY(x, y);
        return _content[_content_pos].Check_Hyperlink(x, y, 0) !== null;

    },
    Get_TableStyleForPara: function()
    {
        return this.Parent.Get_TableStyleForPara();
    },
    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
    },

    Get_Id : function()
    {
        return this.Id;
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_aContentChanges.push( Changes );
    },

    Save_Changes : function()
    {},
//-----------------------------------------------------------------------------------
// Функции, к которым идет обращение из контента
//-----------------------------------------------------------------------------------

    // Данную функцию используют внутренние классы, для определения следующей позиции.
    // Данный класс запрашивает следующую позицию у своего родителя.
    Get_PageContentStartPos : function (PageNum)
    {
        return this.Parent.Get_PageContentStartPos(PageNum);
    },

    // Inner = true  - запрос пришел из содержимого,
    //         false - запрос пришел от родительского класса
    // Запрос от родительского класса нужен, например, для колонтитулов, потому
    // что у них врапится текст не колонтитула, а документа.
    CheckRange : function(X0, Y0, X1, Y1, PageNum, Inner)
    {
        if ( "undefined" === typeof(Inner) )
            Inner = true;



        return [];
    },

    CheckFlowObject : function(X, Y, PageIndex)
    {


        return false;
    },

    FlowImage_Move : function(FlowImageId, oldPageNum, newPageNum)
    {
        /*
         if ( oldPageNum != newPageNum )
         {
         // Ищем FlowImage на странице oldPageNum
         var oldFlowObjects = this.Pages[oldPageNum].FlowObjects;
         var FlowImage = oldFlowObjects.Find( FlowImageId, true );
         if ( null != FlowImage )
         {
         var Pos = this.Pages[newPageNum].FlowObjects.Add( FlowImage );

         // Текущий отмеченный элемент и есть передвигаемый
         if ( docpostype_FlowObjects === this.CurPos.Type && FlowImage.Get_Id() === this.Selection.Data.FlowObject.Get_Id() )
         {
         this.Selection.Data.PageNum = newPageNum;
         this.Selection.Data.Pos     = Pos;
         }
         }
         }

         var StartPageNum = oldPageNum;
         if ( newPageNum < StartPageNum )
         StartPageNum = newPageNum;

         this.ContentLastChangePos = this.Pages[StartPageNum].Pos;
         this.CurPage = newPageNum;
         */
        this.Recalculate(true);
    },

    Write_ToBinary2 : function(Writer)
    {
        Writer.WriteLong( historyitem_type_DocumentContent );

        // String : Id текущего элемента
        // Long   : StartPage
        // String : Id родительского класса
        // Bool   : TurnOffInnerWrap
        // Bool   : Split
        // String : Id класса DrawingObjects
        // Long   : Количество элементов в массиве this.Content
        // Array of string : массив Id элементов

        Writer.WriteString2( this.Id );
        Writer.WriteLong( this.StartPage );
        Writer.WriteString2( this.Parent.Get_Id() );
        Writer.WriteBool(this.TurnOffInnerWrap);
        Writer.WriteBool(this.Split);
       // Writer.WriteString2(this.DrawingObjects.Get_Id());

        var Count = this.Content.length;
        Writer.WriteLong(Count);
        for ( var Index = 0; Index < Count; Index++ )
            Writer.WriteString2( this.Content[Index].Get_Id() );
    },

    Get_Numbering : function()
    {
        return this.Numbering;
    },

    Internal_GetNumInfo : function(ParaId, NumPr)
    {
        this.NumInfoCounter++;
        var NumInfo = new Array(NumPr.Lvl + 1);
        for ( var Index = 0; Index < NumInfo.length; Index++ )
            NumInfo[Index] = 0;

        // Этот параметр контролирует уровень, начиная с которого делаем рестарт для текущего уровня
        var Restart = -1;
        var AbstractNum = null;
        if ( "undefined" != typeof(this.Numbering) && null != ( AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId) ) )
        {
            Restart = AbstractNum.Lvl[NumPr.Lvl].Restart;
        }

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && null != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId  )
            {
                if ( "undefined" == typeof(NumInfo[ItemNumPr.Lvl]) )
                    NumInfo[ItemNumPr.Lvl] = 0;
                else
                    NumInfo[ItemNumPr.Lvl]++;

                if ( 0 != Restart && ItemNumPr.Lvl < NumPr.Lvl && ( -1 == Restart ||  ItemNumPr.Lvl <= (Restart - 1 ) ) )
                    NumInfo[NumPr.Lvl] = 0;

                for ( var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2-- )
                {
                    if ( "undefined" == typeof(NumInfo[Index2]) || 0 == NumInfo[Index2] )
                        NumInfo[Index2] = 1;
                }
            }

            if ( ParaId == Item.GetId() )
                break;
        }

        return NumInfo;
    },

    Get_Styles : function(level)
    {
        if(this.arrStyles[level] == undefined)
        {
            if(this.Parent instanceof CTableCell)
            {
                this.arrStyles[level] = this.Parent.getStylesForParagraph(level);
            }
            else
            {
                this.arrStyles[level] = this.Parent.Get_Styles(level, true);
            }
        }
        return this.arrStyles[level];
    },


    Recalc_AllParagraphs_CompiledPr : function()
    {
        var Count = this.Content.length;
        for ( var Pos = 0; Pos < Count; Pos++ )
        {
            var Item = this.Content[Pos];
            if ( type_Paragraph === Item.GetType() )
                Item.Recalc_CompiledPr();
        }
    },

    Set_CurrentElement : function(Index)
    {


        var ContentPos = Math.max( 0, Math.min( this.Content.length - 1, Index ) );
        this.CurPos.Type = docpostype_Content;
        this.Selection_Remove();
        this.CurPos.ContentPos = Math.max( 0, Math.min( this.Content.length - 1, Index ) );

        if ( true === this.Content[ContentPos].Is_SelectionUse() )
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos   = ContentPos;
        }

        this.Parent.Set_CurrentElement();
    },

    Content_GetPrev : function(Id)
    {
        var Index = this.Internal_Content_Find( Id );
        if ( Index > 0 )
        {
            return this.Content[Index - 1];
        }

        return null;
    },

    Content_GetNext : function(Id)
    {
        var Index = this.Internal_Content_Find( Id );
        if ( -1 != Index && Index < this.Content.length - 1 )
        {
            return this.Content[Index + 1];
        }

        return null;
    },

    InlineObject_Move : function(ObjId, X, Y, PageNum)
    {
        var OldPos = this.CurPos.ContentPos;
        var Drawing = this.DrawingObjects.Get_ById( ObjId );

        // Удаляем из текущего элемента объект
        this.Content[OldPos].Remove_DrawingObject( ObjId );
        this.DrawingObjects.Remove_ById( ObjId );
        this.Remove_DrawingObjectSelection();

        this.Parent.Add_InlineObjectXY( Drawing, X, Y, PageNum );

        this.Recalculate();
    },

    InlineObject_Resize : function(ObjId, W, H)
    {
        var Drawing = this.DrawingObjects.Get_ById( ObjId );
        Drawing.Update_Size( W, H );
        this.ContentLastChangePos = this.CurPos.ContentPos;
        this.Recalculate( true );
    },

    getFirstTextProperties: function()
    {
        return this.Content.length > 0 ? this.Content[0].getFirstTextProperties() : null;
    },

    setFirstTextProperties: function(textProperties)
    {
        if(this.Content.length === 0)
        {
            this.Content[0] = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
        }
        this.Content[0].setFirstTextProperties(textProperties);
    },

    getFirstParagraphProperties: function()
    {
        return this.Content.length > 0 ? this.Content[0].getParagraphProperties() : null;
    },

    setFirstParagraphProperties: function(paragraphProperties)
    {
        if(this.Content.length === 0)
        {
            this.Content[0] = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
        }
        this.Content[0].setParagraphProperties(paragraphProperties);
    },

    InlineTable_Move : function(Table, X, Y, PageNum_Abs)
    {
        var OldPos = this.CurPos.ContentPos;

        // Специальная заглушка, когда мы переносим таблицу внутри одного DocumentContent
        this.CurPos.TableMove = OldPos;

        // Отключаем пересчет, потому что если мы перемещаем таблицу выше данного элемента,
        // тогда если будет запущен пересчет до удаления таблицы, она в первый раз два раза
        // рассчитается (на новом месте, и на старом (тут))
        this.TurnOffRecalc = true;

        // Если вернули false, значит пытались перенести таблицу саму в себя
        if ( true === this.Parent.Add_InlineTableXY( Table, X, Y, PageNum_Abs ) )
        {
            // Удаляем таблицу
            this.Internal_Content_Remove( this.CurPos.TableMove, 1);

            if ( this.Content.length <= 0 )
                this.Internal_Content_Add( 0, new Paragraph( this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, ++this.IdCounter) );

            this.Cursor_MoveToStartPos();

            this.TurnOffRecalc = false;
            this.Recalculate(true);
        }

        this.TurnOffRecalc = false;
    },

    // Получем ближающую возможную позицию курсора
    Get_NearestPos : function(Page_Abs, X, Y)
    {
        var Page_Rel = this.Get_Page_Relative( Page_Abs );
        var ContentPos = this.Internal_GetContentPosByXY( X, Y, Page_Rel );
        return this.Content[ContentPos].Get_NearestPos( Page_Rel, X, Y );
    },

    // Проверяем, описывает ли данный класс содержимое ячейки
    Is_TableCellContent : function()
    {
        return this.Parent.Is_Cell();
    },

    // Проверяем, является ли данный класс верхним, по отношению к другим классам DocumentContent, Document
    Is_TopDocument : function()
    {
        return this.Parent.Is_TopDocument();
    },

    // Данный запрос может прийти из внутреннего элемента(параграф, таблица), чтобы узнать
    // происходил ли выделение в пределах одного элеменета.
    Selection_Is_OneElement : function()
    {
        if ( true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos )
            return true;

        return false;
    },

//-----------------------------------------------------------------------------------
// Основные функции, к которым идет обращение от родительского класса
//-----------------------------------------------------------------------------------

    Reset : function(X, Y, XLimit, YLimit)
    {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;


        this.Pages[0] =
        {
            Pos : 0,

            X : X,
            Y : Y,
            XLimit : XLimit,
            YLimit : YLimit,

            Bounds :
            {
                Left   : X,
                Top    : Y,
                Right  : XLimit,
                Bottom : Y
            }
        };
    },



    RecalculateNumbering : function(paragraph)
    {
        var _b_state_history = History.Is_On();

        if(_b_state_history)
        {
            History.TurnOff();
        }

        var _level_index;
        var _compiled_bullets = new Array(9);
        for(_level_index = 0; _level_index < 9; ++_level_index)
        {
            _compiled_bullets[_level_index] = undefined;
        }

        var _par_index;
        var _content_length = this.Content.length;
        var _cur_paragraph;
        var _final_bullet;
        var _cur_level;
        var _master_shape = undefined, _layout_shape = undefined;
        var _bullet;
        var _parent;
        if(!(this.Parent instanceof  CTableCell))
            _parent = this.Parent;
        else
            _parent = this.Parent.Row.Table.Parent;
        if(paragraph !== undefined)
        {
            _cur_paragraph = paragraph;
            _cur_paragraph.Remove_PresentationNumbering();
            if(_cur_paragraph.GetType() != type_Paragraph)
            {
                return;
            }

            _final_bullet = null;
            if(_cur_paragraph.bullet!=null
                && _cur_paragraph.bullet.bulletType != null
                && _cur_paragraph.bullet.bulletType.type != null)
            {
                _final_bullet = _cur_paragraph.bullet;
            }
            else
            {
                if(_compiled_bullets[_cur_paragraph.PresentationPr.Level] === undefined)
                {
                    _cur_level = _cur_paragraph.PresentationPr.Level;
                    var _parent_tx_body = _parent.txBody;
                    if(_parent_tx_body && _parent_tx_body.lstStyle != null
                        && _parent_tx_body.lstStyle.levels[_cur_level] != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType!=null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                    {
                        _final_bullet = _parent_tx_body.lstStyle.levels[_cur_level].bullet
                    }

                    if(_final_bullet === null)
                    {
                        if(_parent.isPlaceholder())
                        {
                            switch(_parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    if(_layout_shape === undefined)
                                    {
                                        _layout_shape = _parent.parent.Layout.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                    }

                                    if(_layout_shape !== null)
                                    {
                                        if(_layout_shape.txBody && _layout_shape.txBody.lstStyle != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _layout_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }

                                    if(_final_bullet === null)
                                    {
                                        if(_master_shape === undefined)
                                        {
                                            _master_shape = _parent.parent.Layout.Master.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                        }

                                        if(_master_shape !== null)
                                        {
                                            if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                            }
                                        }
                                    }
                                    break;
                                }

                                case LAYOUT_KIND :
                                {
                                    if(_master_shape === undefined)
                                    {
                                        _master_shape = _parent.parent.Master.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                    }

                                    if(_master_shape !== null)
                                    {
                                        if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }
                                    break;
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var _master_styles;
                                switch (_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = _parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = _parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = _parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    switch(_parent.getPhType())
                                    {
                                        case phType_title:
                                        case phType_ctrTitle:
                                        {
                                            if(_master_styles.titleStyle
                                                && _master_styles.titleStyle.levels
                                                && _master_styles.titleStyle.levels[_cur_level]
                                                && _master_styles.titleStyle.levels[_cur_level].bullet != null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        case phType_body :
                                        case phType_subTitle :
                                        case phType_obj :
                                        case null :
                                        {
                                            if(_master_styles.bodyStyle
                                                && _master_styles.bodyStyle.levels
                                                && _master_styles.bodyStyle.levels[_cur_level]
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet != null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.bodyStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        default :
                                        {
                                            if(_master_styles.otherStyle
                                                && _master_styles.otherStyle.levels
                                                && _master_styles.otherStyle.levels[_cur_level]
                                                && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.otherStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var defaultTextStyles;

                                switch(_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.Layout.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.presentation.defaultTextStyle;
                                        break;
                                    }

                                }

                                if( defaultTextStyles
                                    && defaultTextStyles.levels != null
                                    && defaultTextStyles.levels[_cur_level] != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                                {
                                    _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                                }

                            }
                        }
                        else
                        {
                            defaultTextStyles = null;
                            switch(_parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    defaultTextStyles = _parent.parent.Layout.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case LAYOUT_KIND:
                                {
                                    defaultTextStyles = _parent.parent.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case MASTER_KIND:
                                {
                                    defaultTextStyles = _parent.parent.presentation.defaultTextStyle;
                                    break;
                                }

                            }
                            if( defaultTextStyles
                                && defaultTextStyles.levels != null
                                && defaultTextStyles.levels[_cur_level] != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                            {
                                _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                            }

                            if(_final_bullet === null)
                            {
                                switch (_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = _parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = _parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = _parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    if(_master_styles.otherStyle
                                        && _master_styles.otherStyle.levels
                                        && _master_styles.otherStyle.levels[_cur_level]
                                        && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                    {
                                        _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                    }
                                }
                            }
                        }
                    }
                    _compiled_bullets[_cur_level] = _final_bullet;
                }
                else
                {
                    _final_bullet = _compiled_bullets[_cur_paragraph.PresentationPr.Level];
                }
            }
            if(_final_bullet !== null)
            {
                _cur_paragraph.Remove_PresentationNumbering();
                var _theme = null, _master = null, _layout = null, _slide = null;
                switch(_parent.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        _theme = _parent.parent.Layout.Master.Theme;
                        _master = _parent.parent.Layout.Master;
                        _layout = _parent.parent.Layout;
                        _slide = _parent.parent;
                        break;
                    }
                    case LAYOUT_KIND :
                    {
                        _theme = _parent.parent.Master.Theme;
                        _master = _parent.parent.Master;
                        _layout = _parent.parent;
                        break;
                    }
                    default :
                    {
                        _theme = _parent.parent.Theme;
                        _master = _parent.parent;
                        break;
                    }
                }
                _bullet = new CPresentationBullet();
                if(_final_bullet.bulletTypeface && _final_bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT)
                {
                    if(!isThemeFont(_final_bullet.bulletTypeface.typeface))
                    {
                        _bullet.m_bFontTx = false;
                        _bullet.m_sFont = _final_bullet.bulletTypeface.typeface;
                    }
                    else
                    {

                        if(_theme && _theme.themeElements && _theme.themeElements.fontScheme)
                        {
                            _bullet.m_bFontTx = false;
                            _bullet.m_sFont = getFontInfo(_final_bullet.bulletTypeface.typeface)(_theme.themeElements.fontScheme);
                        }
                    }
                }
                if(_final_bullet.bulletColor && (_final_bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR) )
                {
                    var _unicolor = _final_bullet.bulletColor.UniColor;
                    var _unifill = new CUniFill();
                    _unifill.fill = new CSolidFill();
                    _unifill.fill.color = _unicolor;
                    var RGBA;
                    if(_unicolor.type == COLOR_TYPE_SCHEME && _unicolor.id == phClr)
                    {
                        if(_parent.style && _parent.style.fontRef && _parent.style.fontRef.Color)
                        {
                            _parent.style.fontRef.Color.Calculate(_theme, _slide, _layout, _master);
                            RGBA = _parent.style.fontRef.Color.RGBA;
                            _bullet.m_bColorTx = false;
                            _bullet.m_oColor = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    else
                    {
                        _unifill.calculate(_theme, _slide, _layout, _master, {R:0, G:0, B:0, A:255});
                        if(_unifill.fill.color && _unifill.fill.color.RGBA)
                        {
                            RGBA = _unifill.fill.color.RGBA;
                            _bullet.m_bColorTx = false;
                            _bullet.m_oColor = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                }
                if(_final_bullet.bulletSize && (_final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PCT || _final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PTS))
                {
                    _bullet.m_bSizeTx = false;
                    if(_final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PTS)
                    {
                        _bullet.m_bSizePct = false;
                    }
                    _bullet.m_dSize = _final_bullet.bulletSize.val/100000;
                }
                switch(_final_bullet.bulletType.type)
                {
                    case BULLET_TYPE_BULLET_CHAR:
                    {
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = _final_bullet.bulletType.Char[0];

                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }

                    case BULLET_TYPE_BULLET_AUTONUM :
                    {
                        _bullet.m_nType = g_NumberingArr[_final_bullet.bulletType.AutoNumType];
                        _bullet.m_nStartAt = _final_bullet.bulletType.startAt;
                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                    case BULLET_TYPE_BULLET_NONE :
                    {
                        _cur_paragraph.Remove_PresentationNumbering();
                        break;
                    }
                    case BULLET_TYPE_BULLET_BLIP :
                    {
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = "•";

                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                }
            }
            else
            {
                //_cur_paragraph.Remove_PresentationNumbering();
            }
            paragraph.compiledBullet = _final_bullet;
            if(_b_state_history)
            {
                History.TurnOn();
            }
            return;
        }

        for(_par_index = 0;  _par_index < _content_length; ++_par_index)
        {
            _cur_paragraph = this.Content[_par_index];
            if(_cur_paragraph.GetType() != type_Paragraph)
            {
                continue;
            }

            _final_bullet = null;
            if(_cur_paragraph.bullet!=null
                && _cur_paragraph.bullet.bulletType != null
                && _cur_paragraph.bullet.bulletType.type != null)
            {
                _final_bullet = _cur_paragraph.bullet;
            }
            else
            {
                if(_compiled_bullets[_cur_paragraph.PresentationPr.Level] === undefined)
                {
                    _cur_level = _cur_paragraph.PresentationPr.Level;
                    var _parent_tx_body = _parent.txBody;
                    if(_parent_tx_body && _parent_tx_body.lstStyle != null
                        && _parent_tx_body.lstStyle.levels[_cur_level] != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType!=null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                    {
                        _final_bullet = _parent_tx_body.lstStyle.levels[_cur_level].bullet
                    }

                    if(_final_bullet === null)
                    {
                        if(_parent.isPlaceholder())
                        {
                            switch(_parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    if(_layout_shape === undefined)
                                    {
                                        _layout_shape = _parent.parent.Layout.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                    }

                                    if(_layout_shape !== null)
                                    {
                                        if(_layout_shape.txBody && _layout_shape.txBody.lstStyle != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _layout_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }

                                    if(_final_bullet === null)
                                    {
                                        if(_master_shape === undefined)
                                        {
                                            _master_shape = _parent.parent.Layout.Master.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                        }

                                        if(_master_shape !== null)
                                        {
                                            if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                            }
                                        }
                                    }
                                    break;
                                }

                                case LAYOUT_KIND :
                                {
                                    if(_master_shape === undefined)
                                    {
                                        _master_shape = _parent.parent.Master.getMatchingShape(_parent.getPhType(), _parent.getPhIndex());
                                    }

                                    if(_master_shape !== null)
                                    {
                                        if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }
                                    break;
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var _master_styles;
                                switch (_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = _parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = _parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = _parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    switch(_parent.getPhType())
                                    {
                                        case phType_title:
                                        case phType_ctrTitle:
                                        {
                                            if(_master_styles.titleStyle
                                                && _master_styles.titleStyle.levels
                                                && _master_styles.titleStyle.levels[_cur_level]
                                                && _master_styles.titleStyle.levels[_cur_level].bullet != null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        case phType_body :
                                        case phType_subTitle :
                                        case phType_obj :
                                        case null :
                                        {
                                            if(_master_styles.bodyStyle
                                                && _master_styles.bodyStyle.levels
                                                && _master_styles.bodyStyle.levels[_cur_level]
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet != null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.bodyStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        default :
                                        {
                                            if(_master_styles.otherStyle
                                                && _master_styles.otherStyle.levels
                                                && _master_styles.otherStyle.levels[_cur_level]
                                                && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.otherStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var defaultTextStyles;

                                switch(_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.Layout.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        defaultTextStyles = _parent.parent.presentation.defaultTextStyle;
                                        break;
                                    }

                                }

                                if( defaultTextStyles
                                    && defaultTextStyles.levels != null
                                    && defaultTextStyles.levels[_cur_level] != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                                {
                                    _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                                }

                            }
                        }
                        else
                        {
                            defaultTextStyles = null;
                            switch(_parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    defaultTextStyles = _parent.parent.Layout.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case LAYOUT_KIND:
                                {
                                    defaultTextStyles = _parent.parent.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case MASTER_KIND:
                                {
                                    defaultTextStyles = _parent.parent.presentation.defaultTextStyle;
                                    break;
                                }

                            }
                            if( defaultTextStyles
                                && defaultTextStyles.levels != null
                                && defaultTextStyles.levels[_cur_level] != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                            {
                                _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                            }

                            if(_final_bullet === null)
                            {
                                switch (_parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = _parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = _parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = _parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    if(_master_styles.otherStyle
                                        && _master_styles.otherStyle.levels
                                        && _master_styles.otherStyle.levels[_cur_level]
                                        && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                    {
                                        _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                    }
                                }
                            }
                        }
                    }
                    _compiled_bullets[_cur_level] = _final_bullet;
                }
                else
                {
                    _final_bullet = _compiled_bullets[_cur_paragraph.PresentationPr.Level];
                }
            }
            if(_final_bullet !== null)
            {
                _cur_paragraph.Remove_PresentationNumbering();
                var _theme = null, _master = null, _layout = null, _slide = null;
                switch(_parent.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        _theme = _parent.parent.Layout.Master.Theme;
                        _master = _parent.parent.Layout.Master;
                        _layout = _parent.parent.Layout;
                        _slide = _parent.parent;
                        break;
                    }
                    case LAYOUT_KIND :
                    {
                        _theme = _parent.parent.Master.Theme;
                        _master = _parent.parent.Master;
                        _layout = _parent.parent;
                        break;
                    }
                    default :
                    {
                        _theme = _parent.parent.Theme;
                        _master = _parent.parent;
                        break;
                    }
                }
                _bullet = new CPresentationBullet();
                if(_final_bullet.bulletTypeface && _final_bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT)
                {
                    if(!isThemeFont(_final_bullet.bulletTypeface.typeface))
                    {
                        _bullet.m_bFontTx = false;
                        _bullet.m_sFont = _final_bullet.bulletTypeface.typeface;
                    }
                    else
                    {

                        if(_theme && _theme.themeElements && _theme.themeElements.fontScheme)
                        {
                            _bullet.m_bFontTx = false;
                            _bullet.m_sFont = getFontInfo(_final_bullet.bulletTypeface.typeface)(_theme.themeElements.fontScheme);
                        }
                    }
                }
                if(_final_bullet.bulletColor && (_final_bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR) )
                {
                    var _unicolor = _final_bullet.bulletColor.UniColor;
                    var _unifill = new CUniFill();
                    _unifill.fill = new CSolidFill();
                    _unifill.fill.color = _unicolor;
                    var RGBA;
                    if(_unicolor.type == COLOR_TYPE_SCHEME && _unicolor.id == phClr)
                    {
                        if(_parent.style && _parent.style.fontRef && _parent.style.fontRef.Color)
                        {
                            _parent.style.fontRef.Color.Calculate(_theme, _slide, _layout, _master);
                            RGBA = _parent.style.fontRef.Color.RGBA;
                            _bullet.m_bColorTx = false;
                            _bullet.m_oColor = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                    else
                    {
                        _unifill.calculate(_theme, _slide, _layout, _master, {R:0, G:0, B:0, A:255});
                        if(_unifill.fill.color && _unifill.fill.color.RGBA)
                        {
                            RGBA = _unifill.fill.color.RGBA;
                            _bullet.m_bColorTx = false;
                            _bullet.m_oColor = {r: RGBA.R, g : RGBA.G, b : RGBA.B};
                        }
                    }
                }
                if(_final_bullet.bulletSize && (_final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PCT || _final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PTS))
                {
                    _bullet.m_bSizeTx = false;
                    if(_final_bullet.bulletSize.type == BULLET_TYPE_SIZE_PTS)
                    {
                        _bullet.m_bSizePct = false;
                    }
                    _bullet.m_dSize = _final_bullet.bulletSize.val/100000;
                }
                switch(_final_bullet.bulletType.type)
                {
                    case BULLET_TYPE_BULLET_CHAR:
                    {
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = _final_bullet.bulletType.Char[0];
                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }

                    case BULLET_TYPE_BULLET_AUTONUM :
                    {
                        _bullet.m_nType = g_NumberingArr[_final_bullet.bulletType.AutoNumType];
                        _bullet.m_nStartAt = _final_bullet.bulletType.startAt;
                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                    case BULLET_TYPE_BULLET_NONE :
                    {
                        _cur_paragraph.Remove_PresentationNumbering();
                        break;
                    }
                    case BULLET_TYPE_BULLET_BLIP :
                    {
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = "•";

                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                }
            }
            else
            {
                _cur_paragraph.Remove_PresentationNumbering();
            }
            _cur_paragraph.compiledBullet = _final_bullet;
        }

        if(_b_state_history)
        {
            History.TurnOn();
        }
    },

    /*RecalculateNumbering2 : function()
    {


        var _level_index;
        var _compiled_bullets = new Array(9);
        for(_level_index = 0; _level_index < 9; ++_level_index)
        {
            _compiled_bullets[_level_index] = undefined;
        }

        var _par_index;
        var _content_length = this.Content.length;
        var _cur_paragraph;
        var _final_bullet;
        var _cur_level;
        var _master_shape = undefined, _layout_shape = undefined;
        var _bullet;
        for(_par_index = 0;  _par_index < _content_length; ++_par_index)
        {
            _cur_paragraph = this.Content[_par_index];
            if(_cur_paragraph.GetType() != type_Paragraph)
            {
                continue;
            }

            _final_bullet = null;
            if(_cur_paragraph.bullet!=null
                && _cur_paragraph.bullet.bulletType != null
                && _cur_paragraph.bullet.bulletType.type != null)
            {
                _final_bullet = _cur_paragraph.bullet;
            }
            else
            {
                if(_compiled_bullets[_cur_paragraph.PresentationPr.Level] === undefined)
                {
                    _cur_level = _cur_paragraph.PresentationPr.Level;
                    var _parent_tx_body = this.Parent.txBody;
                    if(_parent_tx_body && _parent_tx_body.lstStyle != null
                        && _parent_tx_body.lstStyle.levels[_cur_level] != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet != null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType!=null
                        && _parent_tx_body.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                    {
                        _final_bullet = _parent_tx_body.lstStyle.levels[_cur_level].bullet
                    }

                    if(_final_bullet === null)
                    {
                        if(this.Parent.isPlaceholder())
                        {
                            switch(this.Parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    if(_layout_shape === undefined)
                                    {
                                        _layout_shape = this.Parent.parent.Layout.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                                    }

                                    if(_layout_shape !== null)
                                    {
                                        if(_layout_shape.txBody && _layout_shape.txBody.lstStyle != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _layout_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _layout_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }

                                    if(_final_bullet === null)
                                    {
                                        if(_master_shape === undefined)
                                        {
                                            _master_shape = this.Parent.parent.Layout.Master.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                                        }

                                        if(_master_shape !== null)
                                        {
                                            if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                            }
                                        }
                                    }
                                    break;
                                }

                                case LAYOUT_KIND :
                                {
                                    if(_master_shape === undefined)
                                    {
                                        _master_shape = this.Parent.parent.Master.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                                    }

                                    if(_master_shape !== null)
                                    {
                                        if(_master_shape.txBody && _master_shape.txBody.lstStyle != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level] != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet != null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType!=null
                                            && _master_shape.txBody.lstStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                        {
                                            _final_bullet = _master_shape.txBody.lstStyle.levels[_cur_level].bullet;
                                        }
                                    }
                                    break;
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var _master_styles;
                                switch (this.Parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = this.Parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = this.Parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = this.Parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    switch(this.Parent.nvSpPr.nvPr.ph.type)
                                    {
                                        case phType_title:
                                        case phType_ctrTitle:
                                        {
                                            if(_master_styles.titleStyle
                                                && _master_styles.titleStyle.levels
                                                && _master_styles.titleStyle.levels[_cur_level]
                                                && _master_styles.titleStyle.levels[_cur_level].bullet != null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.titleStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        case phType_body :
                                        case phType_subTitle :
                                        case phType_obj :
                                        case null :
                                        {
                                            if(_master_styles.bodyStyle
                                                && _master_styles.bodyStyle.levels
                                                && _master_styles.bodyStyle.levels[_cur_level]
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet != null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.bodyStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.bodyStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                        default :
                                        {
                                            if(_master_styles.otherStyle
                                                && _master_styles.otherStyle.levels
                                                && _master_styles.otherStyle.levels[_cur_level]
                                                && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                                && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                            {
                                                _final_bullet  = _master_styles.otherStyle.levels[_cur_level].bullet;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }

                            if(_final_bullet === null)
                            {
                                var defaultTextStyles;

                                switch(this.Parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        defaultTextStyles = this.Parent.parent.Layout.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        defaultTextStyles = this.Parent.parent.Master.presentation.defaultTextStyle;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        defaultTextStyles = this.Parent.parent.presentation.defaultTextStyle;
                                        break;
                                    }

                                }

                                if( defaultTextStyles
                                    && defaultTextStyles.levels != null
                                    && defaultTextStyles.levels[_cur_level] != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                    && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                                {
                                    _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                                }

                            }
                        }
                        else
                        {
                            defaultTextStyles = null;
                            switch(this.Parent.parent.kind)
                            {
                                case SLIDE_KIND:
                                {
                                    defaultTextStyles = this.Parent.parent.Layout.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case LAYOUT_KIND:
                                {
                                    defaultTextStyles = this.Parent.parent.Master.presentation.defaultTextStyle;
                                    break;
                                }
                                case MASTER_KIND:
                                {
                                    defaultTextStyles = this.Parent.parent.presentation.defaultTextStyle;
                                    break;
                                }

                            }
                            if( defaultTextStyles
                                && defaultTextStyles.levels != null
                                && defaultTextStyles.levels[_cur_level] != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType != null
                                && defaultTextStyles.levels[_cur_level].bullet.bulletType.type!=null)
                            {
                                _final_bullet = defaultTextStyles.levels[_cur_level].bullet;
                            }

                            if(_final_bullet === null)
                            {
                                switch (this.Parent.parent.kind)
                                {
                                    case SLIDE_KIND:
                                    {
                                        _master_styles = this.Parent.parent.Layout.Master.txStyles;
                                        break;
                                    }
                                    case LAYOUT_KIND:
                                    {
                                        _master_styles = this.Parent.parent.Master.txStyles;
                                        break;
                                    }
                                    case MASTER_KIND:
                                    {
                                        _master_styles = this.Parent.parent.txStyles;
                                        break;
                                    }
                                }
                                if(_master_styles != null)
                                {
                                    if(_master_styles.otherStyle
                                        && _master_styles.otherStyle.levels
                                        && _master_styles.otherStyle.levels[_cur_level]
                                        && _master_styles.otherStyle.levels[_cur_level].bullet != null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType!=null
                                        && _master_styles.otherStyle.levels[_cur_level].bullet.bulletType.type!=null)
                                    {
                                        _final_bullet  = _master_styles.titleStyle.levels[_cur_level].bullet;
                                    }
                                }
                            }
                        }
                    }
                    _compiled_bullets[_cur_level] = _final_bullet;
                }
                else
                {
                    _final_bullet = _compiled_bullets[_cur_paragraph.PresentationPr.Level];
                }
            }
            if(_final_bullet !== null)
            {
                _cur_paragraph.Remove_PresentationNumbering();
                switch(_final_bullet.bulletType.type)
                {
                    case BULLET_TYPE_BULLET_CHAR:
                    {
                        _bullet = new CPresentationBullet();
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = _final_bullet.bulletType.Char;

                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }

                    case BULLET_TYPE_BULLET_AUTONUM :
                    {
                        _bullet = new CPresentationBullet();
                        _bullet.m_nType = g_NumberingArr[_final_bullet.bulletType.AutoNumType];
                        _bullet.m_nStartAt = _final_bullet.bulletType.startAt;
                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                    case BULLET_TYPE_BULLET_NONE :
                    {
                        _cur_paragraph.Remove_PresentationNumbering();
                        break;
                    }
                    case BULLET_TYPE_BULLET_BLIP :
                    {
                        _bullet = new CPresentationBullet();
                        _bullet.m_nType = numbering_presentationnumfrmt_Char;
                        _bullet.m_sChar = "•";

                        _cur_paragraph.Add_PresentationNumbering(_bullet);
                        break;
                    }
                }
            }
            else
            {
                _cur_paragraph.Remove_PresentationNumbering();
            }
        }
    }, */




    Recalculate : function(bForceRecalc, LastChangeIndex)
    {
        if ( true === this.TurnOffRecalc )
            return;

        if ( "undefined" === typeof(bForceRecalc) )
            bForceRecalc = false;

        if ( "undefined" === typeof(LastChangeIndex) )
            LastChangeIndex = 0;

        var OldPages  = this.Pages.length;
        var OldBottom = new Array();
        for ( var Index = 0; Index < OldPages; Index++ )
              OldBottom[Index] = this.Pages[Index].Bounds.Bottom;


        this.Pages.length = 0;
        this.Pages[0] =
        {
            Pos    : 0,
            X      : this.X,
            Y      : this.Y,
            XLimit : this.XLimit,
            YLimit : this.YLimit,

            Bounds :
            {
                Left   : this.X,
                Top    : this.Y,
                Right  : this.XLimit,
                Bottom : this.Y
            }
        };

        var Count = this.Content.length;
        var X = this.X;
        var Y = this.Y;

        var CurPage = 0;

        for ( var Index = 0; Index < Count; Index++ )
        {
            // Пересчитываем элемент
            var Element = this.Content[Index];
            Element.Set_DocumentIndex( Index );
            
            if ( Index >= LastChangeIndex )
            {
                Element.TurnOff_RecalcEvent();
                Element.Reset( X, Y, this.Pages[CurPage].XLimit, this.Pages[CurPage].YLimit, CurPage );
                Element.Recalculate();
                Element.TurnOn_RecalcEvent();
            }

            var bNewPage = false;
            var Temp = CurPage;
            for ( ; CurPage < Temp + Element.Pages.length - 1; )
            {
                // Выставляем нижнюю границу
                this.Pages[CurPage].Bounds.Bottom = Element.Pages[CurPage - Temp].Bounds.Bottom;

                if ( "undefined" == typeof(this.Pages[++CurPage]) )
                {
                    this.Pages[CurPage] = new Object();
                }

                var StartPos = this.Get_PageContentStartPos( CurPage );
                this.Pages[CurPage] =
                {
                    Pos    : Index,
                    X      : StartPos.X,
                    Y      : StartPos.Y,
                    XLimit : StartPos.XLimit,
                    YLimit : StartPos.YLimit,

                    Bounds :
                    {
                        Left   : StartPos.X,
                        Top    : StartPos.Y,
                        Right  : StartPos.XLimit,
                        Bottom : StartPos.Y
                    }
                };



                bNewPage = true;
            }

            // Выставляем нижнюю границу
            this.Pages[CurPage].Bounds.Bottom = Element.Pages[Element.Pages.length - 1].Bounds.Bottom;

            if ( false === bNewPage )
                Y += Element.Bounds.Bottom - Element.Bounds.Top;
            else
            {
                Y = this.Get_PageContentStartPos( CurPage ).Y;
                Y += Element.Bounds.Bottom - Y;
            }
        }

        var NewPages  = this.Pages.length;
        var NewBottom = new Array();
        for ( var Index = 0; Index < NewPages; Index++ )
            NewBottom[Index] = this.Pages[Index].Bounds.Bottom;

        var bChange = ( ( OldPages != NewPages )  ? true : false );
        if ( false === bChange )
        {
            for ( var Index = 0; Index < OldPages; Index++ )
            {
                if ( Math.abs( OldBottom[Index] - NewBottom[Index] ) > 0.01 )
                {
                    bChange = true;
                    break;
                }
            }
        }

        // Сообщаем родительскому классу, что контент пересчитался
        this.Parent.OnContentRecalculate( bChange, bForceRecalc );
    },

    ReDraw : function(StartPage, EndPage)
    {
        if ( "undefined" === typeof(StartPage) )
            StartPage = this.Get_StartPage_Absolute();
        if ( "undefined" === typeof(EndPage) )
            EndPage = StartPage + this.Pages.length - 1;

        this.OnContentReDraw( StartPage, EndPage );
    },

    OnContentRecalculate : function(bNeedRecalc, PageNum, DocumentIndex)
    {
        if ( false === bNeedRecalc )
        {
            this.Parent.OnContentRecalculate( false, false );
        }
        else
        {
            // Ставим номер +1, потому что текущий элемент уже рассчитан
            this.Recalculate( false, DocumentIndex + 1 );
        }
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.Parent.Container.DrawingDocument.OnRecalculatePage( this.Parent.parent.num, this.Parent.parent );
    },

    Draw : function(nPageIndex, pGraphics)
    {
        var PageNum = nPageIndex - this.StartPage;
        if ( PageNum < 0 || PageNum >= this.Pages.length )
            return;

        // Пока мы все картинки рисуем под текстом, но селектим их как будто
        // они перед текстом.



        var Count = this.Content.length;

        var Bounds = this.Pages[PageNum].Bounds;

        var bClip = false;
        if ( null != this.ClipInfo.X0 && null != this.ClipInfo.X1 )
        {
            pGraphics.SaveGrState();
            pGraphics.AddClipRect( this.ClipInfo.X0, Bounds.Top, Math.abs(this.ClipInfo.X1 - this.ClipInfo.X0), Bounds.Bottom - Bounds.Top);
            bClip = true;
        }

        for ( var Index = this.Pages[PageNum].Pos; Index < Count; Index++ )
        {
            if ( -1 == this.Content[Index].Draw(PageNum, pGraphics) )
                break;
        }

        if ( true === bClip )
        {
            //pGraphics.RemoveClipRect();
            pGraphics.RestoreGrState();
        }
    },

    RecalculateCurPos : function()
    {
        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos >= 0 && "undefined" != typeof(this.Content[this.CurPos.ContentPos]) && "undefined" != typeof(this.Content[this.CurPos.ContentPos].RecalculateCurPos) )
            {
                this.Internal_CheckCurPage();

                if ( this.CurPage > 0 && true === this.Parent.Is_HdrFtr() )
                {
                    this.CurPage = 0;
                    this.DrawingDocument.TargetEnd();
                }
                else
                    this.Content[this.CurPos.ContentPos].RecalculateCurPos();
            }
        }
        else // if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            if ( true === this.Parent.Is_Cell() )
                this.DrawingDocument.UpdateTarget2( this.Selection.Data.FlowObject.X + this.Selection.Data.FlowObject.W /2, this.Selection.Data.FlowObject.Y + this.Selection.Data.FlowObject.H / 2, this.Get_StartPage_Absolute() + this.Selection.Data.PageNum );
            else
                this.DrawingDocument.UpdateTarget2( this.Selection.Data.FlowObject.X + this.Selection.Data.FlowObject.W /2, this.Selection.Data.FlowObject.Y + this.Selection.Data.FlowObject.H / 2, this.Get_StartPage_Absolute() + this.CurPage );
        }
    },

    Get_PageBounds : function(PageNum)
    {
        if ( PageNum < 0 || PageNum > this.Pages.length )
            return this.Pages[0].Bounds;

        return this.Pages[PageNum].Bounds;
    },

    Get_PagesCount : function()
    {
        return this.Pages.length;
    },

    Get_SummaryHeight : function()
    {
        var Height = 0;
        for ( var Page = 0; Page < this.Get_PagesCount(); Page++ )
        {
            var Bounds = this.Get_PageBounds( Page );
            Height += Bounds.Bottom - Bounds.Top;
        }

        return Height;
    },

    Get_FirstParagraph : function()
    {
        if ( type_Paragraph == this.Content[0].GetType() )
            return this.Content[0];

        return null;
    },

    // Специальная функция, используемая в колонтитулах для добавления номера страницы
    // При этом удаляются все параграфы. Добавляются два новых
    HdrFtr_AddPageNum : function(Align, StyleId)
    {

        this.Selection_Remove();

        this.CurPos  =
        {
            X          : 0,
            Y          : 0,
            ContentPos : 0,
            RealX      : 0,
            RealY      : 0,
            Type       : docpostype_Content
        };

        this.Selection.Use = false;

        // Удаляем все элементы
        this.Internal_Content_RemoveAll();
        this.IdCounter = 0;

        this.DrawingObjects.Remove_All();

        // Добавляем 2 новых параграфа
        var Para1 = new Paragraph( this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, ++this.IdCounter);
        var Para2 = new Paragraph( this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, ++this.IdCounter);

        this.Internal_Content_Add( 0, Para1 );
        this.Internal_Content_Add( 1, Para2 );

        Para1.Set_DocumentPrev( null );
        Para1.Set_DocumentNext( Para2 );
        Para2.Set_DocumentPrev( Para1 );
        Para2.Set_DocumentNext( null );

        Para1.Style_Add( StyleId );
        Para2.Style_Add( StyleId );

        Para1.Set_Align( Align, false );
        Para1.Add( new ParaPageNum() );

        this.Recalculate();
    },

    Add_Content : function(OtherContent)
    {
        if ( "object" != typeof(OtherContent) || 0 >= OtherContent.Content.length || true === OtherContent.Is_Empty() )
            return;

        for ( var Index = 0; Index < OtherContent.Content.length; Index++ )
        {
            OtherContent.Content[Index].Set_Parent( this );
            OtherContent.Content[Index].SetId( ++this.IdCounter );
        }

        // TODO : улучшить добавление элементов здесь (чтобы добавлялось не поэлементно)
        if ( true === this.Is_Empty() )
        {
            this.Internal_Content_RemoveAll();
            for ( var Index = 0; Index < OtherContent.Content.length; Index++ )
                this.Internal_Content_Add( Index, OtherContent.Content[Index] );
        }
        else
        {
            this.Content[this.Content.length - 1].Set_DocumentNext( OtherContent.Content[0] );
            OtherContent.Content[0].Set_DocumentPrev( this.Content[this.Content.length - 1] );

            for ( var Index = 0; Index < OtherContent.Content.length; Index++ )
                this.Internal_Content_Add( this.Content.length + Index, OtherContent.Content[Index] );
        }
    },

    Is_Empty : function()
    {
        if(this.Content.length == 0)
        {
            return true;
        }
        if ( this.Content.length > 1)
            return false;

        return this.Content[0].IsEmpty();
    },

    Is_CurrentElementTable : function()
    {
        return false;
    },

    Is_CurrentElementParagraph : function()
    {
        return true;
    },

    Check_AddTable : function(Table)
    {
        return true;
    },

    Get_CurrentParagraph : function()
    {
        if ( true === this.Selection.Use && selectionflag_DrawingObject === this.Selection.Flag )
        {
            return null;
        }

        if ( true === this.Selection.Use )
            return null;

        if ( this.CurPos.ContentPos < 0 )
            return null;

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph === Item.GetType() )
            return Item;

        return null;
    },

    // Проверяем есть ли хоть какой-либо контент на первой странице
    Is_ContentOnFirstPage : function()
    {
        if ( this.Pages.length <= 1 || 0 != this.Pages[1].Pos )
            return true;

        var Element = this.Content[0];
        return Element.Is_ContentOnFirstPage();
    },

    Is_TableBorder : function(X,Y, PageNum_Abs)
    {
        return null;
    },

    Get_CurrentPage_Absolute : function()
    {
        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos >= 0 )
                return this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
        }
        else // if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            return this.Selection.Data.PageNum + this.Get_StartPage_Absolute();
        }
    },

    DocumentSearch : function(Str)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.DocumentSearch( Str );
        }
    },

    DocumentStatistics : function(Stats)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.DocumentStatistics( Stats );
        }
    },

    Document_CreateFontMap : function(FontMap)
    {
        var CurPage = 0;

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);
        }
    },

    Document_UpdateInterfaceState : function()
    {
        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos  ) || ( false == this.Selection.Use) ) )
        {
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
            else
                this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
        }
    },

    Document_UpdateRulersState : function(CurPage, margins)
    {
        if ( docpostype_Content == this.CurPos.Type )
        {
            return this.DrawingDocument.Set_RulerState_Paragraph( null , margins);
        }
    },

    Cursor_MoveToStartPos : function()
    {
        this.Selection.Start    = false;
        this.Selection.Use      = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos   = 0;
        this.Selection.Flag     = selectionflag_Common;

        this.CurPos.ContentPos = 0;
        this.CurPos.Type       = docpostype_Content;
        this.Content[0].Cursor_MoveToStartPos();
    },

    Cursor_MoveToEndPos : function()
    {
        this.Selection.Start    = false;
        this.Selection.Use      = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos   = 0;
        this.Selection.Flag     = selectionflag_Common;

        this.CurPos.ContentPos = this.Content.length - 1;
        this.CurPos.Type       = docpostype_Content;
        this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
    },

    Cursor_MoveUp_To_LastRow : function(X, Y, AddToSelect)
    {
        // Такого не должно быть
        if ( true === AddToSelect )
            return;

        this.Set_CurPosXY( X, Y );
        this.CurPos.ContentPos = this.Content.length - 1;
        this.Content[this.CurPos.ContentPos].Cursor_MoveUp_To_LastRow( X, Y, false );
    },

    Cursor_MoveDown_To_FirstRow : function(X, Y, AddToSelect)
    {
        // Такого не должно быть
        if ( true === AddToSelect )
            return;

        this.Set_CurPosXY( X, Y );
        this.CurPos.ContentPos = 0;
        this.Content[this.CurPos.ContentPos].Cursor_MoveDown_To_FirstRow( X, Y, false );
    },

    Set_ClipInfo : function(X0, X1)
    {
        this.ClipInfo.X0 = X0;
        this.ClipInfo.X1 = X1;
    },

    Set_ApplyToAll : function(bValue)
    {
        this.ApplyToAll = bValue;
    },

    Set_ApplyToAll2 : function(bValue)
    {
        this.ApplyToAll = bValue;
        for(var i = 0; i < this.Content.length; ++i)
        {
            if(this.Content[i].Set_ApplyToAll != null)
            {
                this.Content[i].Set_ApplyToAll(bValue);
            }
        }
    },

    Get_ApplyToAll : function()
    {
        return this.ApplyToAll;
    },

    Update_CursorType : function( X, Y, PageNum_Abs)
    {
      //  var PageNum = Math.min( this.Pages.length - 1, Math.max( 0, PageNum_Abs - this.Get_StartPage_Absolute() ) );
        var ContentPos = this.Internal_GetContentPosByXY( X, Y, /*PageNum*/0);
        var Item = this.Content[ContentPos];
        Item.Update_CursorType( X, Y, /*PageNum*/0 );
        return;
    },

    getCurCoordsRelativeSlide: function()
    {
        if(!(this.Parent instanceof CTableCell))
        {
            if(this.Parent.parent.kind === SLIDE_KIND)
            {
                return {X: this.Parent.parent.elementsManipulator.MouseX,  Y: this.Parent.parent.elementsManipulator.MouseY};
            }
        }
        else
        {
            if(this.Parent.Row.Table.Parent.parent.kind === SLIDE_KIND)
            {
                return {X: this.Parent.Row.Table.Parent.parent.elementsManipulator.MouseX,  Y: this.Parent.Row.Table.Parent.parent.elementsManipulator.MouseY};
            }
        }
        return {X:0, Y:0};
    },
//-----------------------------------------------------------------------------------
// Функции для работы с контентом
//-----------------------------------------------------------------------------------

    // Аналог функции Document.Add_NewParagraph
    Add_NewParagraph : function()
    {
        if ( this.CurPos.ContentPos < 0 || this.CurPos.Type == docpostype_FlowObjects )
            return false;

        // Сначала удаляем заселекченую часть
        if ( true === this.Selection.Use )
        {
            this.Remove( 1, true );
        }

        // Добавляем новый параграф
        var Item = this.Content[this.CurPos.ContentPos];

        // Если мы внутри параграфа, тогда:
        // 1. Если мы в середине параграфа, разделяем данный параграф на 2.
        //    При этом полностью копируем все настройки из исходного параграфа.
        // 2. Если мы в конце данного параграфа, тогда добавляем новый пустой параграф.
        //    Стиль у него проставляем такой какой указан у текущего в Style.Next.
        //    Если при этом у нового параграфа стиль будет такой же как и у старого,
        //    в том числе если стиля нет у обоих, тогда копируем еще все прямые настройки.
        //    (Т.е. если стили разные, а у исходный параграф был параграфом со списком, тогда
        //    новый параграф будет без списка).
        if ( type_Paragraph == Item.GetType() )
        {
            // Создаем новый параграф
            var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field, ++this.IdCounter );

            // Проверим позицию в текущем параграфе
            if ( true === Item.Cursor_IsEnd() )
            {
                var StyleId = Item.Style_Get();
                var NextId = null;

                if ( null != StyleId )
                {
                    var Styles = Item.Get_Styles();
                    NextId = Styles.Get_Next( StyleId );

                    if ( null === NextId )
                        NextId = StyleId;
                }


                if ( StyleId == NextId )
                {
                    // Продолжаем (в плане настроек) новый параграф
                    Item.Continue( NewParagraph );
                }
                else
                {
                    // Простое добавление стиля, без дополнительных действий
                    if ( NextId === this.Styles.Get_Default_Paragraph() )
                        NewParagraph.Style_Remove();
                    else
                        NewParagraph.Style_Add_Open( NextId );
                }
            }
            else
                Item.Split( NewParagraph );

            // Выставляем курсор в начало параграфа
            NewParagraph.CurPos.ContentPos = NewParagraph.Internal_GetStartPos();
            this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );
            this.CurPos.ContentPos++;

            // Отмечаем, что последний измененный элемент - предыдущий параграф
            this.ContentLastChangePos = this.CurPos.ContentPos - 1;
            this.Recalculate();
        }
    },

    Add_FlowImage : function(W, H, Img)
    {

    },

    Add_InlineImage : function(W, H, Img)
    {
        return;
    },

    Add_InlineObject : function(Obj)
    {
    },

    Add_InlineObjectXY : function( Drawing, X, Y, PageNum )
    {
        return this.Parent.Add_InlineObjectXY( Drawing, X, Y, PageNum );
    },

    Add_InlineTableXY : function( Table, X, Y, PageNum )
    {
        return this.Parent.Add_InlineTableXY( Table, X, Y, PageNum );
    },

    Add_InlineTable : function(Cols, Rows)
    {

    },

    Add_InlineTable2 : function(Table)
    {

    },
    
    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        if ( true === this.ApplyToAll )
        {
            if ( para_TextPr === ParaItem.Type )
            {
                for ( var Index = 0; Index < this.Content.length; Index++ )
                {
                    var Item = this.Content[Index];
                    Item.Set_ApplyToAll( true );
                    Item.Add( ParaItem );
                    Item.Set_ApplyToAll( false );
                }
            }

            return;
        }

        if ( this.CurPos.Type == docpostype_FlowObjects )
            return false;

        if ( true === this.Selection.Use )
        {
            var Type = ParaItem.Type;
            switch ( Type )
            {
                case para_NewLine:
                case para_Text:
                case para_Space:
                {
                    // Если у нас что-то заселекчено и мы вводим текст или пробел
                    // и т.д., тогда сначала удаляем весь селект.
                    this.Remove( 1, true );
                    break;
                }
                case para_TextPr:
                {
                    switch( this.Selection.Flag )
                    {
                        case selectionflag_Common:
                        {
                            // Текстовые настройки применяем ко всем параграфам, попавшим
                            // в селект.
                            var StartPos = this.Selection.StartPos;
                            var EndPos   = this.Selection.EndPos;
                            if ( EndPos < StartPos )
                            {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos   = Temp;
                            }

                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                this.Content[Index].Add( ParaItem );
                            }

                            if ( false != bRecalculate )
                            {
                                // Если в TextPr только HighLight, тогда не надо ничего пересчитывать, только перерисовываем
                                if ( true === Styles_IsNeedRecalc_TextPr(ParaItem.Value) )
                                {
                                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                                    // попавшего в селект.
                                    this.ContentLastChangePos = StartPos;
                                    this.Recalculate();
                                }
                                else
                                {
                                    // Просто перерисовываем нужные страницы
                                    var StartPage = this.Content[StartPos].Get_StartPage_Absolute();
                                    var EndPage   = this.Content[EndPos].Get_StartPage_Absolute() + this.Content[EndPos].Pages.length - 1;
                                    this.ReDraw( StartPage, EndPage );
                                }
                            }

                            break;
                        }
                        case selectionflag_Numbering:
                        {
                            // Текстовые настройки применяем к конкретной нумерации
                            if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                                break;

                            var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                            var NumTextPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].TextPr;

                            Common_CopyObj2( NumTextPr, ParaItem.Value );

                            if ( false != bRecalculate )
                            {
                                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                                // попавшего в селект.
                                this.ContentLastChangePos = this.Selection.Data[0];
                                this.Recalculate();
                            }

                            break;
                        }
                    }

                    return;
                }
            }
        }

        var Item = this.Content[this.CurPos.ContentPos];
        var ItemType = Item.GetType();

        if ( para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType )
        {
            if ( type_Paragraph === ItemType )
            {
                if ( true === Item.Cursor_IsStart() )
                {
                    this.Add_NewParagraph();
                    this.Content[this.CurPos.ContentPos - 1].Add( ParaItem );
                    this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                }
                else
                {
                    this.Add_NewParagraph();
                    this.Add_NewParagraph();
                    this.Content[this.CurPos.ContentPos - 1].Add( ParaItem );
                    this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos - 2;
                }

                if ( false != bRecalculate )
                {
                    this.Recalculate();

                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }
            else
            {
                // TODO: PageBreak в таблице не ставим
                return;
            }
        }
        else
        {
            Item.Add( ParaItem );

            if ( false != bRecalculate )
            {
                if ( para_TextPr === ParaItem.Type && false === Styles_IsNeedRecalc_TextPr( ParaItem.Value ) )
                {
                    // Просто перерисовываем нужные страницы
                    var StartPage = Item.Get_StartPage_Absolute();
                    var EndPage   = StartPage + Item.Pages.length - 1;
                    this.ReDraw( StartPage, EndPage );
                }
                else
                    this.Recalculate();

                if ( type_Paragraph === ItemType )
                {
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }
        }
    },

    Paragraph_ClearFormatting : function()
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph === Item.GetType() )
                {
                    Item.Clear_Formatting();
                    Item.Clear_TextFormatting();
                }
                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( true === this.Selection.Use )
        {
            if ( selectionflag_Common === this.Selection.Flag )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos  = this.Selection.EndPos;
                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph === Item.GetType() )
                    {
                        Item.Clear_Formatting();
                        Item.Clear_TextFormatting();
                    }
                }

                this.Recalculate();
            }
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph === Item.GetType() )
            {
                Item.Clear_Formatting();
                Item.Clear_TextFormatting();
                this.Recalculate();
            }
        }

    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if ( true === this.ApplyToAll )
        {
            this.Pages = new Array();
            this.Pages[0] =
            {
                Pos : 0,

                X : this.X,
                Y : this.Y,
                XLimit : this.XLimit,
                YLimit : this.YLimit,

                Bounds :
                {
                    Left   : this.X,
                    Top    : this.Y,
                    Right  : this.XLimit,
                    Bottom : this.Y
                }
            };


            this.IdCounter = 0;

            this.Internal_Content_RemoveAll();
            this.Internal_Content_Add( 0, new Paragraph( this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, ++this.IdCounter) );

            this.CurPos  =
            {
                X          : 0,
                Y          : 0,
                ContentPos : 0, // в зависимости, от параметра Type: либо позиция в Document.Content, либо в Document.FlowObjects
                RealX      : 0, // позиция курсора, без учета расположения букв
                RealY      : 0, // это актуально для клавиш вверх и вниз
                Type       : docpostype_Content
            };

            this.Selection =
            {
                Start    : false,
                Use      : false,
                StartPos : 0,
                EndPos   : 0,
                Flag     : selectionflag_Common,
                Data     : null
            };

            // Массив укзателей на все инлайновые графические объекты


            return;
        }

        if ( "undefined" === typeof(bRemoveOnlySelection) )
            bRemoveOnlySelection = false;

        if ( this.CurPos.ContentPos < 0 )
            return false;


        this.Remove_NumberingSelection();

        // Если в документе что-то заселекчено, тогда удаляем селект
        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            // Убираем селект
            this.Selection_Clear();
            this.Selection.Use = false;

            if ( StartPos != EndPos )
            {
                var StartType = this.Content[StartPos].GetType();
                var EndType   = this.Content[EndPos].GetType();

                var bStartEmpty, bEndEmpty;

                if ( type_Paragraph == StartType )
                {
                    // Удаляем выделенную часть параграфа
                    this.Content[StartPos].Remove( 1, true );
                    bStartEmpty = this.Content[StartPos].IsEmpty()
                }


                if ( type_Paragraph == EndType )
                {
                    // Удаляем выделенную часть параграфа
                    this.Content[EndPos].Remove( 1, true );
                    bEndEmpty = this.Content[EndPos].IsEmpty()
                }

                if ( true != bStartEmpty && true != bEndEmpty )
                {
                    // Удаляем весь промежуточный контент
                    this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos - 1 );
                    this.CurPos.ContentPos = StartPos;
                    
                    if ( type_Paragraph == StartType && type_Paragraph == EndType )
                    {
                        // Встаем в конец параграфа и удаляем 1 элемент (чтобы соединить параграфы)
                        this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                        this.Remove( 1, true );
                    }
                }
                else if ( true != bStartEmpty )
                {
                    // Удаляем весь промежуточный контент и последний параграф
                    this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos );

                    if ( type_Paragraph == StartType )
                    {
                        // Встаем в конец параграфа
                        this.CurPos.ContentPos = StartPos;
                        this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                    }
                }
                else if ( true != bEndEmpty )
                {
                    // Удаляем весь промежуточный контент и начальный параграф
                    this.Internal_Content_Remove( StartPos, EndPos - StartPos );

                    // Встаем в начало параграфа
                    this.CurPos.ContentPos = StartPos;
                    this.Content[StartPos].Cursor_MoveToStartPos();
                }
                else
                {
                    // Удаляем весь промежуточный контент, начальный и конечный параграфы
                    // При таком удалении надо убедиться, что в документе останется хотя бы один элемент
                    if ( 0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length )
                    {
                        var NewPara = new Paragraph( this.DrawingDocument, this, 0, 0, 0, this.XLimit, this.YLimit, ++this.IdCounter);
                        this.Internal_Content_Add( 0, NewPara );
                        this.Internal_Content_Remove( 1, this.Content.length - 1 );
                    }
                    else
                        this.Internal_Content_Remove( StartPos, EndPos - StartPos + 1 );

                    // Выставляем текущую позицию
                    if ( StartPos >= this.Content.length )
                    {
                        // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                        this.CurPos.ContentPos = this.Content.length - 1;
                        this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                    }
                    else
                    {
                        this.CurPos.ContentPos = StartPos;
                        this.Content[StartPos].Cursor_MoveToStartPos();
                    }
                }
            }
            else
            {
                this.CurPos.ContentPos = StartPos;
                if ( false === this.Content[StartPos].Remove( 1, true ) )
                {
                    // В ворде параграфы объединяются только когда у них все настройки совпадают.
                    // (почему то при изменении и обратном изменении настроек параграфы перестают объединятся)
                    // Пока у нас параграфы будут объединяться всегда и настройки будут браться из первого
                    // параграфа, кроме случая, когда первый параграф полностью удаляется.

                    if ( true === this.Content[StartPos].IsEmpty() && this.Content.length > 1 )
                    {
                        this.Internal_Content_Remove( StartPos, 1 );

                        // Выставляем текущую позицию
                        if ( StartPos >= this.Content.length )
                        {
                            // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                            this.CurPos.ContentPos = this.Content.length - 1;
                            this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                        }
                        else
                        {
                            this.CurPos.ContentPos = StartPos;
                            this.Content[StartPos].Cursor_MoveToStartPos();
                        }

                        this.Recalculate();
                        return;
                    }
                    else if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1] )
                    {
                        // Соединяем текущий и предыдущий параграфы
                        this.Content[StartPos].Concat( this.Content[StartPos + 1] );
                        this.Internal_Content_Remove( StartPos + 1, 1 );
                    }
                }
            }

            // В текущей позиции this.CurPos.ContentPos может оказаться, либо оставшийся параграф,
            // после удаления (если параграфы удалялись не целиком), либо следующий за ним, либо
            // перед ним. В любом случае, ничего не испортится если мы у текущего параграфа удалим
            // селект.
            this.Content[this.CurPos.ContentPos].Selection_Remove();
            this.Recalculate();
        }
        else
        {
            if ( true === bRemoveOnlySelection )
                return;

            if ( type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() )
            {
                var bNumbering = ( null != this.Content[this.CurPos.ContentPos].Numbering_Get() ? true : false );
                if ( false === this.Content[this.CurPos.ContentPos].Remove( Count, bOnlyText ) )
                {
                    if ( Count < 0 )
                    {
                        if ( this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType() )
                        {
                            if ( true === this.Content[this.CurPos.ContentPos - 1].IsEmpty() )
                            {
                                // Просто удаляем предыдущий параграф
                                this.Internal_Content_Remove( this.CurPos.ContentPos - 1, 1 );
                                this.CurPos.ContentPos--;
                            }
                            else
                            {
                                // Соединяем текущий и предыдущий параграфы
                                var Prev = this.Content[this.CurPos.ContentPos - 1];

                                // Запоминаем новую позицию курсора, после совмещения параграфов
                                var NewPos = Prev.Content.length - 2;
                                Prev.Concat( this.Content[this.CurPos.ContentPos] );

                                var DrawingObjects = [];
                                for ( var Index = 0; Index < this.Content[this.CurPos.ContentPos].Content.length; Index++ )
                                {
                                    var ParaItem = this.Content[this.CurPos.ContentPos].Content[Index];
                                    if ( para_Drawing == ParaItem.Type )
                                        DrawingObjects.push( ParaItem );
                                }

                                this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );

                                for ( var Index = 0; Index < DrawingObjects.length; Index++ )
                                {
                                    this.DrawingObjects.Add( DrawingObjects[Index] );
                                }

                                this.CurPos.ContentPos--;
                                this.Content[this.CurPos.ContentPos].CurPos.ContentPos = NewPos;
                            }
                        }
                    }
                    else if ( Count > 0 )
                    {
                        if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType() )
                        {
                            if ( true === this.Content[this.CurPos.ContentPos].IsEmpty() )
                            {
                                // Просто удаляем текущий параграф
                                this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );
                            }
                            else
                            {
                                // Соединяем текущий и предыдущий параграфы
                                var Cur = this.Content[this.CurPos.ContentPos];
                                Cur.Concat( this.Content[this.CurPos.ContentPos + 1] );

                                var DrawingObjects = [];
                                for ( var Index = 0; Index < this.Content[this.CurPos.ContentPos + 1].Content.length; Index++ )
                                {
                                    var ParaItem = this.Content[this.CurPos.ContentPos + 1].Content[Index];
                                    if ( para_Drawing == ParaItem.Type )
                                        DrawingObjects.push( ParaItem );
                                }

                                this.Internal_Content_Remove( this.CurPos.ContentPos + 1, 1);

                                for ( var Index = 0; Index < DrawingObjects.length; Index++ )
                                {
                                    this.DrawingObjects.Add( DrawingObjects[Index] );
                                }
                            }
                        }
                        else if ( true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0)
                        {
                            // Если данный параграф пустой, последний, не единственный и идущий перед
                            // ним элемент не таблица, удаляем его
                            this.Internal_Content_Remove( this.CurPos.ContentPos, 1 );
                            this.CurPos.ContentPos--;
                        }
                    }

                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos;

                    this.Recalculate();
                }
                else
                {
                    if ( true === bNumbering && null == this.Content[this.CurPos.ContentPos].Numbering_Get() )
                    {
                        // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        this.Recalculate();

                    }
                    else
                    {
                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos;
                        this.Recalculate();
                    }
                }

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }

        }
    },

    Cursor_GetPos : function()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    var FlowImage = this.Selection.Data.FlowObject;
                    return { X : FlowImage.X, Y : FlowImage.Y };
                }
                case flowobject_Table:
                {
                    return this.Selection.Data.FlowObject.Table.Cursor_GetPos();
                }
            }
            return { X : 0, Y : 0 };
        }

        if ( true === this.Selection.Use )
        {
            if ( selectionflag_Common === this.Selection.Flag )
            {
                return this.Content[this.Selection.EndPos].Cursor_GetPos();
            }

            return { X: 0, Y : 0 };
        }
        else
        {
            return this.Content[this.CurPos.ContentPos].Cursor_GetPos();
        }
    },

    Cursor_MoveLeft : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        var ReturnValue = true;

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Добавляем к селекту
                if ( false === this.Content[this.Selection.EndPos].Cursor_MoveLeft( 1, true ) )
                {
                    // Нужно перейти в конец предыдущего элемента
                    if ( 0 != this.Selection.EndPos )
                    {
                        this.Selection.EndPos--;
                        this.CurPos.ContentPos = this.Selection.EndPos;

                        var Item = this.Content[this.Selection.EndPos];
                        if ( type_Paragraph == Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                Item.CurPos.ContentPos  = Item.Content.length - 1;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = Item.Content.length - 1;
                                Item.Selection.EndPos   = Item.Content.length - 1;
                            }
                            Item.Cursor_MoveLeft( 1, true );
                        }
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект в последнем параграфе. Такое могло быть, если была
                // заселекчена одна буква в последнем параграфе, а мы убрали селект последним действием.
                if ( this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Selection.Use )
                {
                    // Такая ситуация возможна только при прямом селекте (сверху вниз), поэтому вычитаем
                    this.Selection.EndPos--;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                // Нам нужно переместить курсор в левый край селекта, и отменить весь селект
                var Start = this.Selection.StartPos;
                if ( Start > this.Selection.EndPos )
                    Start = this.Selection.EndPos;

                this.CurPos.ContentPos = Start;
                this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, false );

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, true ) )
                {
                    // Нужно перейти в конец предыдущего элемент
                    if ( 0 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos--;
                        var Item = this.Content[this.CurPos.ContentPos];
                        this.Selection.EndPos = this.CurPos.ContentPos;

                        if ( type_Paragraph == Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                Item.CurPos.ContentPos  = Item.Content.length - 1;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = Item.Content.length - 1;
                                Item.Selection.EndPos   = Item.Content.length - 1;
                            }
                            Item.Cursor_MoveLeft( 1, true );
                        }
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft( 1, false ) )
                {
                    // Нужно перейти в конец предыдущего элемент
                    if ( 0 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos--;
                        this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }
            }
        }

        return ReturnValue;
    },

    Cursor_MoveRight : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    History.Create_NewPoint();
                    var FlowImage = this.Selection.Data.FlowObject;
                    FlowImage.Set_Position( FlowImage.X + 1, FlowImage.Y );
                    FlowImage.Update();

                    this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                    this.Recalculate();
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveRight( AddToSelect );
                    break;
                }
            }

            return true;
        }

        var ReturnValue = true;

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Добавляем к селекту
                if ( false === this.Content[this.Selection.EndPos].Cursor_MoveRight( 1, true ) )
                {
                    // Нужно перейти в конец предыдущего элемента
                    if ( this.Content.length - 1 != this.Selection.EndPos )
                    {
                        this.Selection.EndPos++;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                        var Item = this.Content[this.Selection.EndPos];

                        if ( type_Paragraph === Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var StartPos = Item.Internal_GetStartPos();
                                Item.CurPos.ContentPos  = StartPos;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = StartPos;
                                Item.Selection.EndPos   = StartPos;
                            }
                            Item.Cursor_MoveRight( 1, true );
                        }
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект в последнем параграфе. Такое могло быть, если была
                // заселекчена одна буква в последнем параграфе, а мы убрали селект последним действием.
                if ( this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse() )
                {
                    // Такая ситуация возможна только при обратном селекте (снизу вверх), поэтому вычитаем
                    this.Selection.EndPos++;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                // Нам нужно переместить курсор в правый край селекта, и отменить весь селект
                var End = this.Selection.EndPos;
                if ( End < this.Selection.StartPos )
                    End = this.Selection.StartPos;

                this.CurPos.ContentPos = End;
                this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, false );

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, true ) )
                {
                    // Нужно перейти в конец предыдущего элемента
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos++;
                        var Item = this.Content[this.CurPos.ContentPos];
                        this.Selection.EndPos = this.CurPos.ContentPos;

                        if ( type_Paragraph === Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var StartPos = Item.Internal_GetStartPos();
                                Item.CurPos.ContentPos  = StartPos;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = StartPos;
                                Item.Selection.EndPos   = StartPos;
                            }

                            Item.Cursor_MoveRight( 1, true );
                        }
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, false ) )
                {
                    // Нужно перейти в начало следующего элемента
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos++;
                        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }
            }
        }

        return ReturnValue;
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    History.Create_NewPoint();
                    var FlowImage = this.Selection.Data.FlowObject;
                    FlowImage.Set_Position( FlowImage.X, FlowImage.Y - 1 );
                    FlowImage.Update();
                    this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                    this.Recalculate();
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveUp( AddToSelect );
                    break;
                }
            }

            return true;
        }

        var ReturnValue = true;

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Добавляем к селекту
                var Item = this.Content[this.Selection.EndPos];
                if ( false === Item.Cursor_MoveUp( 1, true ) )
                {
                    if ( 0 != this.Selection.EndPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos--;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, true );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // Мы должны переместиться на строку выше, чем начало селекта
                var Start = this.Selection.StartPos;
                if ( Start > this.Selection.EndPos )
                    Start = this.Selection.EndPos;

                this.CurPos.ContentPos = Start;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp( 1, false ) )
                {
                    if ( 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( false === Item.Cursor_MoveUp( 1, true ) )
                {
                    if ( 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, true );
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( false === Item.Cursor_MoveUp( 1, false ) )
                {
                    if ( 0 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }
            }
        }

        return ReturnValue;
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    History.Create_NewPoint();
                    var FlowImage = this.Selection.Data.FlowObject;
                    FlowImage.Set_Position( FlowImage.X, FlowImage.Y + 1 );
                    FlowImage.Update();

                    this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                    this.Recalculate();
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveDown( AddToSelect );
                    break;
                }
            }

            return true;
        }

        var ReturnValue = true;

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Добавляем к селекту
                var Item = this.Content[this.Selection.EndPos];
                if ( false === Item.Cursor_MoveDown( 1, true ) )
                {
                    if ( this.Content.length - 1 != this.Selection.EndPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos++;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, true );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // Мы должны переместиться на строку ниже, чем конец селекта
                var End = this.Selection.EndPos;
                if ( End < this.Selection.StartPos )
                    End = this.Selection.StartPos;

                this.CurPos.ContentPos = End;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown( 1, false ) )
                {
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( false === Item.Cursor_MoveDown( 1, true ) )
                {
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, true );
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];

                if ( false === Item.Cursor_MoveDown( 1, AddToSelect ) )
                {
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        var TempXY = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow( this.CurPos.RealX, this.CurPos.RealY, false );
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }
            }
        }

        return ReturnValue;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    // ничего не делаем
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveEndOfLine( AddToSelect );
                    break;
                }
            }

            return true;
        }

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                this.CurPos.ContentPos = this.Selection.EndPos;

                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);
            }
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    // ничего не делаем
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveStartOfLine( AddToSelect );
                    break;
                }
            }

            return true;
        }

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                this.CurPos.ContentPos = this.Selection.EndPos;

                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse() )
                {
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);
            }
        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect, bRemoveOldSelection, PageNum_Abs )
    {
        if ( "undefined" != typeof(PageNum_Abs) )
            this.CurPage = PageNum_Abs - this.Get_StartPage_Absolute();

        if ( false != bRemoveOldSelection )
        {
            this.Remove_DrawingObjectSelection();
            this.Remove_NumberingSelection();
        }

        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                this.Selection_SetEnd( X, Y, true );
            }
            else
            {
                this.Selection_Remove();

                var ContentPos = this.Internal_GetContentPosByXY(X,Y);
                this.CurPos.ContentPos = ContentPos;
                this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Content[this.CurPos.ContentPos].Selection.Use = true;
                this.Content[this.CurPos.ContentPos].Selection.StartPos = this.Content[this.CurPos.ContentPos].CurPos.ContentPos;

                this.Selection_SetEnd( X, Y, true );
            }
            else
            {
                var ContentPos = this.Internal_GetContentPosByXY(X,Y);
                this.CurPos.ContentPos = ContentPos;
                this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
            }
        }
    },

    Cursor_IsStart : function(bOnlyPara)
    {
        if ( "undefined" === typeof(bOnlyPara) )
            bOnlyPara = false;

        if ( true === bOnlyPara && true != this.Is_CurrentElementParagraph() )
            return false;

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return false;
        else  if ( docpostype_FlowObjects == this.CurPos.Type )
            return false;
        else if ( false != this.Selection.Use || 0 != this.CurPos.ContentPos )
            return false;
        
        var Item = this.Content[0];
        return Item.Cursor_IsStart( bOnlyPara );
    },

    Get_CurPosXY : function()
    {
        return { X : this.CurPos.RealX, Y : this.CurPos.RealY };
    },

    Set_CurPosXY : function(X,Y)
    {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
    },

    Is_SelectionUse : function()
    {
        if ( true == this.Selection.Use )
            return true;

        return false;
    },


    //-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Add( HyperProps );
            this.Content[Pos].RecalcInfo.Set_Type_0(pararecalc_0_All);
            this.Recalculate();
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Modify( HyperProps );
            this.Content[Pos].RecalcInfo.Set_Type_0(pararecalc_0_All);
            this.Recalculate();
        }
    },

    Hyperlink_Remove : function()
    {
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Remove();

        }
    },

    Hyperlink_CanAdd : function()
    {
        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        if ( this.Selection.StartPos != this.Selection.EndPos )
                            return false;

                        return this.Content[this.Selection.StartPos].Hyperlink_CanAdd();
                    }
                }
            }
            else
                return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd();
        }

        return false;
    },

    Hyperlink_Check : function(bCheckEnd)
    {
        if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        if ( this.Selection.StartPos != this.Selection.EndPos )
                            return null;

                        return this.Content[this.Selection.StartPos].Hyperlink_Check(bCheckEnd);
                    }
                }
            }
            else
                return this.Content[this.CurPos.ContentPos].Hyperlink_Check(bCheckEnd);
        }

        return null;
    },
    Is_TextSelectionUse : function()
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return false;

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image : return false;
                case flowobject_Table : return this.Selection.Data.FlowObject.Table.Is_TextSelectionUse();
            }

            return false;
        }

        return this.Is_SelectionUse();
    },


    Set_ParagraphAlign : function(Align)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Align( Align, false );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphAlign) )
                this.Selection.Data.FlowObject.Set_ParagraphAlign( Align );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                // При изменении прилегания параграфа, не надо пересчитывать остальные
                // параграфы, т.к. переносы строк не меняются
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Align( Align, true );
            }

            this.Parent.OnContentRecalculate( false );
            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            // При изменении прилегания параграфа, не надо пересчитывать остальные
            // параграфы, т.к. переносы строк не меняются
            Item.Set_Align( Align, true );

            this.Parent.OnContentRecalculate( false );
        }
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Spacing( Spacing );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphSpacing) )
                this.Selection.Data.FlowObject.Set_ParagraphSpacing( Spacing );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Spacing( Spacing );

            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_Spacing( Spacing );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
    },

    Set_ParagraphIndent : function(Ind)
    {

        if(this.Content.length == 0)
        {
            return;
        }
        if ( !("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel))
        {
            if ( true === this.ApplyToAll )
            {
                for ( var Index = 0; Index < this.Content.length; Index++ )
                {
                    var Item = this.Content[Index];
                    Item.Set_ApplyToAll(true);
                    if ( type_Paragraph == Item.GetType() )
                    {
                        Item.Set_Ind( Ind );
                    }
                    Item.Set_ApplyToAll(false);
                }
                return;
            }


            if ( this.CurPos.ContentPos < 0 )
                return false;

            if ( true === this.Selection.Use )
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( EndPos < StartPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        Item.Set_Ind( Ind );
                    }
                }

                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                // попавшего в селект.
                this.ContentLastChangePos = StartPos;

                this.Recalculate();

                this.Interface_Update_ParaPr();

                return;
            }

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                    Item.Set_Ind( Ind );
                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate();

                this.Interface_Update_ParaPr();
            }
              return;
        }

        var _b_increase = Ind.ChangeLevel > 0;
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {

                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    if(!Item.canIncreaseIndent(_b_increase))
                    {
                        return;
                    }
                }

            }
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.increaseLevel(_b_increase);
                }
            }

            this.ContentLastChangePos = 0;

            this.Recalculate();

            this.Interface_Update_ParaPr();
            return;
        }


        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {

                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    if(!Item.canIncreaseIndent(_b_increase))
                    {
                        return;
                    }
                }

            }
            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.increaseLevel(_b_increase);
                }
            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            this.Interface_Update_ParaPr();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            if(!Item.canIncreaseIndent(_b_increase))
            {
                return;
            }

            Item.increaseLevel(_b_increase);
            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();

            this.Interface_Update_ParaPr();
        }
    },


    canIncreaseIndent : function(bIncrease)
    {
        if(this.Content.length == 0)
        {
            return false;
        }

        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    if(!Item.canIncreaseIndent(bIncrease))
                    {
                        return false;
                    }
                }
            }

            return true;
        }


        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    if(!Item.canIncreaseIndent(bIncrease))
                    {
                        return false;
                    }
                }
            }


            return true;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        return Item.canIncreaseIndent(bIncrease)
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        var bullet = new CBullet();
        if(NumInfo.SubType < 0)
        {
            bullet.bulletType = new CBulletType();
            bullet.bulletType.type = BULLET_TYPE_BULLET_NONE;
        }
        else
        {
            switch (NumInfo.Type)
            {
                case 0 : /*bulletChar*/
                {
                    switch(NumInfo.SubType)
                    {
                        case 0:
                        case 1:
                        {
                            var bulletText = "•";
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Arial";
                            break;
                        }
                        case 2:
                        {
                            bulletText = "o";
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Courier New";
                            break;
                        }
                        case 3:
                        {
                            bulletText = "§";
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Wingdings";
                            break;
                        }
                        case 4:
                        {
                            bulletText = String.fromCharCode( 0x0076 );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Wingdings";
                            break;
                        }
                        case 5:
                        {
                            bulletText = String.fromCharCode( 0x00D8 );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Wingdings";
                            break;
                        }
                        case 6:
                        {
                            bulletText = String.fromCharCode( 0x00FC );
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Wingdings";
                            break;
                        }
                        case 7:
                        {

                            bulletText = String.fromCharCode(119);
                            bullet.bulletTypeface = new CBulletTypeface();
                            bullet.bulletTypeface.type = BULLET_TYPE_TYPEFACE_BUFONT;
                            bullet.bulletTypeface.typeface="Wingdings";
                            break;
                        }
                    }
                    bullet.bulletType = new CBulletType();
                    bullet.bulletType.type = BULLET_TYPE_BULLET_CHAR;
                    bullet.bulletType.Char = bulletText;
                    break;
                }
                case 1 : /*autonum*/
                {
                    switch(NumInfo.SubType)
                    {
                        case 0 :
                        case 1 :
                        {
                            var numberingType = 12;//numbering_numfmt_arabicPeriod;
                            break;
                        }
                        case 2:
                        {
                            numberingType = 11;//numbering_numfmt_arabicParenR;
                            break;
                        }
                        case 3 :
                        {
                            numberingType = 34;//numbering_numfmt_romanUcPeriod;
                            break;
                        }
                        case 4 :
                        {
                            numberingType = 5;//numbering_numfmt_alphaUcPeriod;
                            break;
                        }
                        case 5 :
                        {
                            numberingType = 8;
                            break;
                        }
                        case 6 :
                        {
                            numberingType = 40;
                            break;
                        }
                        case 7 :
                        {
                            numberingType = 31;//numbering_numfmt_romanLcPeriod;
                            break;
                        }
                    }
                    bullet.bulletType = new CBulletType();
                    bullet.bulletType.type = BULLET_TYPE_BULLET_AUTONUM;
                    bullet.bulletType.AutoNumType = numberingType;
                    break;
                }
                default :
                {
                    return;
                }
            }
        }

        var _history_obj = {Type : history_undo_redo_const, newBullet : bullet};
        var _bullet = new CPresentationBullet();

        switch(bullet.bulletType.type)
        {
            case BULLET_TYPE_BULLET_CHAR:
            {
                _bullet = new CPresentationBullet();
                _bullet.m_nType = numbering_presentationnumfrmt_Char;
                _bullet.m_sChar = bullet.bulletType.Char;
                if(bullet.bulletTypeface && bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT)
                {
                    if(!isThemeFont(bullet.bulletTypeface.typeface))
                    {
                        _bullet.m_bFontTx = false;
                        _bullet.m_sFont = bullet.bulletTypeface.typeface;
                    }
                }
                break;
            }

            case BULLET_TYPE_BULLET_AUTONUM :
            {
                _bullet = new CPresentationBullet();
                _bullet.m_nType = g_NumberingArr[bullet.bulletType.AutoNumType];
                _bullet.m_nStartAt = bullet.bulletType.startAt;
                if(bullet.bulletTypeface && bullet.bulletTypeface.type == BULLET_TYPE_TYPEFACE_BUFONT)
                {
                    if(!isThemeFont(bullet.bulletTypeface.typeface))
                    {
                        _bullet.m_bFontTx = false;
                        _bullet.m_sFont = bullet.bulletTypeface.typeface;
                    }
                }
                break;
            }
            case BULLET_TYPE_BULLET_NONE :
            {
                _bullet = new CPresentationBullet();
                break;
            }
            case BULLET_TYPE_BULLET_BLIP :
            {
                _bullet = new CPresentationBullet();
                _bullet.m_nType = numbering_presentationnumfrmt_Char;
                _bullet.m_sChar = "•";
                break;
            }
        }
        if(this.ApplyToAll)
        {
            _history_obj.arrOldBullets = [];
            for(var i = 0; i < this.Content.length; ++i)
            {
                if(this.Content[i].GetType() == type_Paragraph)
                {
                    _history_obj.arrOldBullets[i] = this.Content[i].bullet;
                    this.Content[i].bullet = bullet.createDuplicate();
                    this.Content[i].Add_PresentationNumbering2(_bullet);
                }
            }
            this.ContentLastChangePos = 0;
            this.Recalculate();


            _history_obj.undo_function = function(data)
            {
                for(var i = 0; i <= this.Content.length; ++i)
                {
                    if(this.Content[i].GetType() == type_Paragraph)
                    {
                        this.Content[i].bullet = _history_obj.arrOldBullets[i];
                    }
                }
                this.ContentLastChangePos = 0;
                this.Recalculate();
            };

            _history_obj.redo_function = function(data)
            {
                for(var i = 0; i <= this.Content.length; ++i)
                {
                    if(this.Content[i].GetType() == type_Paragraph)
                    {
                        this.Content[i].bullet = _history_obj.newBullet.createDuplicate();
                    }
                }
                this.ContentLastChangePos = 0;
                this.Recalculate();
            };

            History.Add(this, _history_obj);
        }

        if(this.Selection.Use)
        {
            var startPos = this.Selection.StartPos;
            var endPos = this.Selection.EndPos;
            if(startPos > endPos)
            {
                var _t = startPos;
                startPos = endPos;
                endPos = _t;
            }
            _history_obj.startPos = startPos;
            _history_obj.endPos = endPos;
            _history_obj.arrOldBullets = [];

            var content;
            for(i = startPos; i <= endPos; ++i)
            {
                if((content = this.Content[i]).GetType() == type_Paragraph)
                {
                    _history_obj.arrOldBullets[i] = content.bullet;
                    content.bullet = bullet.createDuplicate();
                    this.Content[i].Add_PresentationNumbering2(_bullet);
                }
            }
            this.ContentLastChangePos = startPos;
            this.Recalculate();

            _history_obj.undo_function = function(data)
            {
                var content;
                for(var i = data.startPos; i <= data.endPos; ++i)
                {
                    if((content = this.Content[i]).GetType() == type_Paragraph)
                    {
                        content.bullet = data.arrOldBullets[i];
                    }
                }
                this.ContentLastChangePos = data.startPos;
                this.Recalculate();
            };

            _history_obj.redo_function = function(data)
            {
                var content;
                for(var i = data.startPos; i <= data.endPos; ++i)
                {
                    if((content = this.Content[i]).GetType() == type_Paragraph)
                    {
                        content.bullet = data.newBullet.createDuplicate();
                    }
                }
                this.ContentLastChangePos = data.startPos;
                this.Recalculate();
            } ;

            History.Add(this, _history_obj);

        }
        else if((content = this.Content[this.CurPos.ContentPos]).GetType() == type_Paragraph)
        {
            _history_obj.oldBullet = content.bullet;
            _history_obj.pos = this.CurPos.ContentPos;

            content.bullet = bullet.createDuplicate();
            content.Add_PresentationNumbering2(_bullet);
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();

            _history_obj.undo_function = function(data)
            {
                this.Content[data.pos].bullet = data.oldBullet;
                this.ContentLastChangePos = data.pos;
                this.Recalculate();
            };
            _history_obj.redo_function = function(data)
            {
                this.Content[data.pos].bullet = data.newBullet.createDuplicate();
                this.ContentLastChangePos = data.pos;
                this.Recalculate();
            };
            History.Add(this, _history_obj);
        }
    },

    Set_ParagraphShd : function(Shd)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                // При изменении цвета фона параграфа, не надо ничего пересчитывать
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Shd( Shd );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphShd) )
                this.Selection.Data.FlowObject.Set_ParagraphShd( Shd );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( EndPos < StartPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];
                        if ( type_Paragraph == Item.GetType() )
                            Item.Set_Shd( Shd );

                    }

                    this.Parent.OnContentRecalculate( false );

                    break;
                }
                case  selectionflag_Numbering:
                {
                    break;
                }
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            // При изменении цвета фона параграфа, не надо ничего пересчитывать
            Item.Set_Shd( Shd );

            this.Parent.OnContentRecalculate( false );
        }
    },

    Set_ParagraphStyle : function(Name)
    {
        var Styles = this.Parent.Get_Styles();
        var StyleId = Styles.Get_StyleIdByName( Name );
        
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                // При изменении цвета фона параграфа, не надо ничего пересчитывать
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Style_Add( StyleId );
                }
                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphStyle) )
                this.Selection.Data.FlowObject.Set_ParagraphStyle( Name );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            if ( selectionflag_Numbering === this.Selection.Flag )
            {
                this.Interface_Update_ParaPr();
                return false;
            }

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Style_Add( StyleId );
                }
            }

            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;
            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Style_Add( StyleId );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
        }


    },

    Set_ParagraphTabs : function(Tabs)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Tabs( Tabs );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphTabs) )
                this.Selection.Data.FlowObject.Set_ParagraphTabs( Tabs );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Tabs( Tabs );

            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            editor.Update_ParaTab( Default_Tab_Stop, Tabs );

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_Tabs( Tabs );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
            editor.Update_ParaTab( Default_Tab_Stop, Tabs );
        }
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_ContextualSpacing( Value );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphContextualSpacing) )
                this.Selection.Data.FlowObject.Set_ParagraphContextualSpacing( Value );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_ContextualSpacing( Value );

            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_ContextualSpacing( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        return;
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                Item.Set_PageBreakBefore( Value );
                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_PageBreakBefore( Value );
            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_PageBreakBefore( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
    },

    Set_ParagraphKeepLines : function(Value)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_KeepLines( Value );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphKeepLines) )
                this.Selection.Data.FlowObject.Set_ParagraphKeepLines( Value );

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_KeepLines( Value );

            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_KeepLines( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
    },

    Set_ParagraphBorders : function(Borders)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.Set_Borders( Borders );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
            {
                this.Selection.Data.FlowObject.Table.Set_ParagraphBorders( Borders );
            }

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( EndPos < StartPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];

                        if ( type_Paragraph == Item.GetType() )
                            Item.Set_Borders( Borders );

                    }

                    this.Recalculate();
                    return;
                }
                case  selectionflag_Numbering:
                {
                    break;
                }
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            // Мы должны выставить границу для всех параграфов, входящих в текущую группу параграфов
            // с одинаковыми границами

            var StartPos = Item.Index;
            var EndPos   = Item.Index;
            var CurBrd = Item.Get_CompiledPr().ParaPr.Brd;

            while ( true != CurBrd.First )
            {
                StartPos--;
                if ( StartPos < 0 )
                {
                    StartPos = 0;
                    break;
                }

                var TempItem = this.Content[StartPos];
                if ( type_Paragraph != TempItem.GetType() )
                {
                    StartPos++;
                    break;
                }

                CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
            }

            CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
            while ( true != CurBrd.Last )
            {
                EndPos++;
                if ( EndPos >= this.Content.length )
                {
                    EndPos = this.Content.length - 1;
                    break;
                }

                var TempItem = this.Content[EndPos];
                if ( type_Paragraph != TempItem.GetType() )
                {
                    EndPos--;
                    break;
                }

                CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
            }

            for ( var Index = StartPos; Index <= EndPos; Index++ )
                this.Content[Index].Set_Borders( Borders );

            this.Recalculate();
        }
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.IncDec_FontSize( bIncrease );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
            {
                this.Selection.Data.FlowObject.Table.Paragraph_IncDecFontSize(bIncrease);
            }

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( EndPos < StartPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];

                        if ( type_Paragraph == Item.GetType() )
                            Item.IncDec_FontSize( bIncrease );

                    }

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();

                    return;
                }
                case  selectionflag_Numbering:
                {
                    break;
                }
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            if ( true === Item.IncDec_FontSize( bIncrease ) )
            {
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            }
        }
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                    Item.IncDec_Indent( bIncrease );

                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
            {
                this.Selection.Data.FlowObject.Table.Paragraph_IncDecIndent(bIncrease);
            }

            return false;
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( true === this.Selection.Use )
        {
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( EndPos < StartPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];

                        if ( type_Paragraph == Item.GetType() )
                            Item.IncDec_Indent( bIncrease );

                    }

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();

                    return;
                }
                case  selectionflag_Numbering:
                {
                    break;
                }
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.IncDec_Indent( bIncrease );
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
        }
    },

    Set_ImageProps : function(Props)
    {

    },

    Set_TableProps : function(Props)
    {
        return false;
    },

    Get_ParagraphIndent : function()
    {
        if ( this.CurPos.ContentPos < 0 )
            return false;

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            var ParaPr = Item.Get_CompiledPr2().ParaPr;
            return ParaPr.Ind;
        }
    },

    Get_Paragraph_ParaPr : function()
    {
        var Result_ParaPr = new CParaPr();

        if ( true === this.ApplyToAll )
        {
            var StartStyleId, StartPr, NumPr, Pr;
            if ( type_Paragraph == this.Content[0].GetType() )
            {
                StartPr      = this.Content[0].Get_CompiledPr2().ParaPr;
                Pr           = StartPr.Copy();
                _bullet = this.Content[0].PresentationPr.Bullet;

                if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                {
                    _list_type = {Type : -1, SubType : -1};
                }
                else
                {
                    if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                    {
                        _list_type = {};
                        _list_type.Type = 0;
                        switch (_bullet.m_sChar)
                        {
                            case "•":
                            {
                                _list_type.SubType = 1;
                                break;
                            }
                            case  "o":
                            {
                                _list_type.SubType = 2;
                                break;
                            }
                            case  "§":
                            {
                                _list_type.SubType = 3;
                                break;
                            }
                            case  String.fromCharCode( 0x0076 ):
                            {
                                _list_type.SubType = 4;
                                break;
                            }
                            case  String.fromCharCode( 0x00D8 ):
                            {
                                _list_type.SubType = 5;
                                break;
                            }
                            case  String.fromCharCode( 0x00FC ):
                            {
                                _list_type.SubType = 6;
                                break;
                            }
                            case String.fromCharCode( 119 ):
                            {
                                _list_type.SubType = 7;
                            }
                        }
                    }
                    else
                    {
                        _list_type = {};
                        var _type = _bullet.m_nType - 100;
                        if(!isNaN(_type) &&  _type >=1 && _type < 9)
                        {
                            _list_type.Type = 1;
                            _list_type.SubType = _type;
                        }
                        else
                        {
                            _list_type.Type = -1;
                            _list_type.SubType = -1;
                        }
                    }
                }
            }
            for ( var Index = 1; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                var TempPr;
                if ( type_Paragraph == Item.GetType() )
                {
                    TempPr         = Item.Get_CompiledPr2(false).ParaPr.Copy();
                    if(_list_type === null)
                    {
                        _bullet = Item.PresentationPr.Bullet;

                        if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                        {
                            _list_type = {Type : -1, SubType : -1};
                        }
                        else
                        {
                            if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                            {
                                _list_type = {};
                                _list_type.Type = 0;
                                switch (_bullet.m_sChar)
                                {
                                    case "•":
                                    {
                                        _list_type.SubType = 1;
                                        break;
                                    }
                                    case  "o":
                                    {
                                        _list_type.SubType = 2;
                                        break;
                                    }
                                    case  "§":
                                    {
                                        _list_type.SubType = 3;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x0076 ):
                                    {
                                        _list_type.SubType = 4;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x00D8 ):
                                    {
                                        _list_type.SubType = 5;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x00FC ):
                                    {
                                        _list_type.SubType = 6;
                                        break;
                                    }
                                    case String.fromCharCode( 119 ):
                                    {
                                        _list_type.SubType = 7;
                                        break;
                                    }
                                    default :
                                    {
                                        _list_type.SubType = -1;
                                        break;
                                    }
                                }
                            }
                            else
                            {
                                _list_type = {};
                                var _type = _bullet.m_nType - 99;
                                if(!isNaN(_type) &&  _type >=1 && _type < 9)
                                {
                                    _list_type.Type = 1;
                                    _list_type.SubType = _type;
                                }
                                else
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                            }
                        }
                    }
                    else if(_list_type.Type != -1)
                    {
                        _bullet = Item.PresentationPr.Bullet;

                        if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                        {
                            _list_type = {Type : -1, SubType : -1};
                        }
                        else
                        {
                            if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                            {
                                if(_list_type.Type != 0)
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                                else if(_list_type.SubType != -1)
                                {
                                    var _sub_type;
                                    switch (_bullet.m_sChar)
                                    {
                                        case "•":
                                        {
                                            _sub_type = 1;
                                            break;
                                        }
                                        case  "o":
                                        {
                                            _sub_type = 2;
                                            break;
                                        }
                                        case  "§":
                                        {
                                            _sub_type = 3;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x0076 ):
                                        {
                                            _sub_type = 4;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x00D8 ):
                                        {
                                            _sub_type = 5;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x00FC ):
                                        {
                                            _sub_type = 6;
                                            break;
                                        }
                                        case String.fromCharCode( 119 ):
                                        {
                                            _list_type.SubType = 7;
                                            break;
                                        }
                                        default :
                                        {
                                            _list_type.SubType = -1;
                                            break;
                                        }

                                            if(_sub_type != _list_type.SubType)
                                            {
                                                _list_type.SubType = -1;
                                            }
                                    }
                                }
                            }
                            else if(_list_type.SubType != -1)
                            {
                                if(_list_type.Type != 1)
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                                else
                                {

                                }
                                _type = _bullet.m_nType - 99;
                                if(_list_type.SubType != _type)
                                {
                                    _list_type.SubType = -1;
                                }
                            }
                        }
                    }
                }

                Pr =  Pr.Compare(TempPr);
            }

            if ( Pr.Ind.Left == UnknownValue )
                Pr.Ind.Left = StartPr.Ind.Left;

            if ( Pr.Ind.Right == UnknownValue )
                Pr.Ind.Right = StartPr.Ind.Right;

            if ( Pr.Ind.FirstLine == UnknownValue )
                Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

            Result_ParaPr.Ind               = Pr.Ind;
            Result_ParaPr.Jc                = Pr.Jc;
            Result_ParaPr.Spacing           = Pr.Spacing;
            Result_ParaPr.PageBreakBefore   = Pr.PageBreakBefore;
            Result_ParaPr.KeepLines         = Pr.KeepLines;
            Result_ParaPr.ContextualSpacing = Pr.ContextualSpacing;
            Result_ParaPr.Shd               = Pr.Shd;
            Result_ParaPr.Brd               = Pr.Brd;
            Result_ParaPr.StyleId           = Pr.StyleId;
            Result_ParaPr.NumPr             = Pr.NumPr;
            Result_ParaPr.ListType             = _list_type;

            return Result_ParaPr;
        }

        if ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag )
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            var StartStyleId, StartPr, NumPr, Pr;
            var _list_type = null;
            var _bullet;
            if ( type_Paragraph == this.Content[StartPos].GetType() )
            {
                StartPr      = this.Content[StartPos].Get_CompiledPr2().ParaPr;
                Pr           = StartPr.Copy();

                _bullet = this.Content[StartPos].PresentationPr.Bullet;

                if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                {
                    _list_type = {Type : -1, SubType : -1};
                }
                else
                {
                    if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                    {
                        _list_type = {};
                        _list_type.Type = 0;
                        switch (_bullet.m_sChar)
                        {
                            case "•":
                            {
                                _list_type.SubType = 1;
                                break;
                            }
                            case  "o":
                            {
                                _list_type.SubType = 2;
                                break;
                            }
                            case  "§":
                            {
                                _list_type.SubType = 3;
                                break;
                            }
                            case  String.fromCharCode( 0x0076 ):
                            {
                                _list_type.SubType = 4;
                                break;
                            }
                            case  String.fromCharCode( 0x00D8 ):
                            {
                                _list_type.SubType = 5;
                                break;
                            }
                            case  String.fromCharCode( 0x00FC ):
                            {
                                _list_type.SubType = 6;
                                break;
                            }
                            case String.fromCharCode( 119 ):
                            {
                                _list_type.SubType = 7;
                                break;
                            }
                            default :
                            {
                                _list_type.SubType = -1;
                                break;
                            }
                        }
                    }
                    else
                    {
                        _list_type = {};
                        var _type = _bullet.m_nType - 99;
                        if(!isNaN(_type) &&  _type >=1 && _type < 9)
                        {
                            _list_type.Type = 1;
                            _list_type.SubType = _type;
                        }
                        else
                        {
                            _list_type.Type = -1;
                            _list_type.SubType = -1;
                        }
                    }
                }
            }

            Pr.StyleId = StartStyleId;

            var _cur_list_type;
            for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];

                var TempPr;
                if ( type_Paragraph == Item.GetType() )
                {
                    TempPr         = Item.Get_CompiledPr2(false).ParaPr.Copy();

                    if(_list_type === null)
                    {
                        _bullet = Item.PresentationPr.Bullet;

                        if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                        {
                            _list_type = {Type : -1, SubType : -1};
                        }
                        else
                        {
                            if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                            {
                                _list_type = {};
                                _list_type.Type = 0;
                                switch (_bullet.m_sChar)
                                {
                                    case "•":
                                    {
                                        _list_type.SubType = 1;
                                        break;
                                    }
                                    case  "o":
                                    {
                                        _list_type.SubType = 2;
                                        break;
                                    }
                                    case  "§":
                                    {
                                        _list_type.SubType = 3;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x0076 ):
                                    {
                                        _list_type.SubType = 4;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x00D8 ):
                                    {
                                        _list_type.SubType = 5;
                                        break;
                                    }
                                    case  String.fromCharCode( 0x00FC ):
                                    {
                                        _list_type.SubType = 6;
                                        break;
                                    }
                                    case String.fromCharCode( 119 ):
                                    {
                                        _list_type.SubType = 7;
                                        break;
                                    }
                                    default :
                                    {
                                        _list_type.SubType = -1;
                                        break;
                                    }
                                }
                            }
                            else
                            {
                                _list_type = {};
                                var _type = _bullet.m_nType - 99;
                                if(!isNaN(_type) &&  _type >=1 && _type < 9)
                                {
                                    _list_type.Type = 1;
                                    _list_type.SubType = _type;
                                }
                                else
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                            }
                        }
                    }
                    else if(_list_type.Type != -1)
                    {
                        _bullet = Item.PresentationPr.Bullet;

                        if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                        {
                            _list_type = {Type : -1, SubType : -1};
                        }
                        else
                        {
                            if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                            {
                                if(_list_type.Type != 0)
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                                else if(_list_type.SubType != -1)
                                {
                                    var _sub_type;
                                    switch (_bullet.m_sChar)
                                    {
                                        case "•":
                                        {
                                            _sub_type = 1;
                                            break;
                                        }
                                        case  "o":
                                        {
                                            _sub_type = 2;
                                            break;
                                        }
                                        case  "§":
                                        {
                                            _sub_type = 3;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x0076 ):
                                        {
                                            _sub_type = 4;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x00D8 ):
                                        {
                                            _sub_type = 5;
                                            break;
                                        }
                                        case  String.fromCharCode( 0x00FC ):
                                        {
                                            _sub_type = 6;
                                            break;
                                        }
                                        case String.fromCharCode( 119 ):
                                        {
                                            _list_type.SubType = 7;
                                            break;
                                        }
                                        default:
                                        {
                                            _sub_type = -1;
                                            break;
                                        }

                                        if(_sub_type != _list_type.SubType)
                                        {
                                            _list_type.SubType = -1;
                                        }
                                    }
                                }
                            }
                            else if(_list_type.SubType != -1)
                            {
                                if(_list_type.Type != 1)
                                {
                                    _list_type = {Type : -1, SubType : -1};
                                }
                                else
                                {

                                }
                                _type = _bullet.m_nType - 99;
                                if(_list_type.SubType != _type)
                                {
                                    _list_type.SubType = -1;
                                }
                            }
                        }
                    }

                }

                Pr = Pr.Compare(TempPr);
            }

            if ( Pr.Ind.Left == UnknownValue )
                Pr.Ind.Left = StartPr.Ind.Left;

            if ( Pr.Ind.Right == UnknownValue )
                Pr.Ind.Right = StartPr.Ind.Right;

            if ( Pr.Ind.FirstLine == UnknownValue )
                Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

            Result_ParaPr.Ind               = Pr.Ind;
            Result_ParaPr.Jc                = Pr.Jc;
            Result_ParaPr.Spacing           = Pr.Spacing;
            Result_ParaPr.PageBreakBefore   = Pr.PageBreakBefore;
            Result_ParaPr.KeepLines         = Pr.KeepLines;
            Result_ParaPr.ContextualSpacing = Pr.ContextualSpacing;
            Result_ParaPr.Shd               = Pr.Shd;
            Result_ParaPr.Brd               = Pr.Brd;
            Result_ParaPr.StyleId           = Pr.StyleId;
            Result_ParaPr.ListType             = _list_type;
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var ParaPr = Item.Get_CompiledPr2(false).ParaPr;

                Result_ParaPr = ParaPr.Copy();

                _bullet = Item.PresentationPr.Bullet;

                if(_bullet.m_nType == numbering_presentationnumfrmt_None)
                {
                    _list_type = {Type : -1, SubType : -1};
                }
                else
                {
                    if(_bullet.m_nType == numbering_presentationnumfrmt_Char)
                    {
                        _list_type = {};
                        _list_type.Type = 0;
                        switch (_bullet.m_sChar)
                        {
                            case "•":
                            {
                                _list_type.SubType = 1;
                                break;
                            }
                            case  "o":
                            {
                                _list_type.SubType = 2;
                                break;
                            }
                            case  "§":
                            {
                                _list_type.SubType = 3;
                                break;
                            }
                            case  String.fromCharCode( 0x0076 ):
                            {
                                _list_type.SubType = 4;
                                break;
                            }
                            case  String.fromCharCode( 0x00D8 ):
                            {
                                _list_type.SubType = 5;
                                break;
                            }
                            case  String.fromCharCode( 0x00FC ):
                            {
                                _list_type.SubType = 6;
                                break;
                            }
                            case String.fromCharCode( 119 ):
                            {
                                _list_type.SubType = 7;
                                break;
                            }
                            default :
                            {
                                _list_type.SubType = -1;
                                break;
                            }
                        }
                    }
                    else
                    {
                        _list_type = {};
                        var _type = _bullet.m_nType - 99;
                        if(!isNaN(_type) &&  _type >=1 && _type < 9)
                        {
                            _list_type.Type = 1;
                            _list_type.SubType = _type;
                        }
                        else
                        {
                            _list_type.Type = -1;
                            _list_type.SubType = -1;
                        }
                    }
                }
                Result_ParaPr.ListType = _list_type;
            }
        }


        return Result_ParaPr;
    },

    Get_Paragraph_TextPr : function()
    {
        var Result_TextPr = null;

        if ( true === this.ApplyToAll )
        {
            var VisTextPr;

            this.Content[0].Set_ApplyToAll(true);

            if ( type_Paragraph == this.Content[0].GetType() )
                VisTextPr = this.Content[0].Selection_CalculateTextPr();
            else if ( type_Table == this.Content[0].GetType() )
                VisTextPr = this.Content[0].Get_Paragraph_TextPr();

            this.Content[0].Set_ApplyToAll(false);

            for ( var Index = 1; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                var CurPr;

                Item.Set_ApplyToAll(true);

                if ( type_Paragraph == Item.GetType() )
                    CurPr = Item.Selection_CalculateTextPr();
                else if ( type_Table == Item.GetType() )
                    CurPr = Item.Get_Paragraph_TextPr();

                Item.Set_ApplyToAll(false);

                VisTextPr = VisTextPr.Compare(CurPr);
            }

            Result_TextPr = VisTextPr;

            return Result_TextPr;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Item = this.Selection.Data.DrawingObject.Parent;

            if ( type_Paragraph == Item.GetType() )
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos - 1 );

            return Result_TextPr;
        }

        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    Result_TextPr = new CTextPr();
                    return Result_TextPr;
                }
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Table.Get_Paragraph_TextPr();
            }

            return null;
        }

        if ( true === this.Selection.Use )
        {
            var VisTextPr;
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if ( EndPos < StartPos )
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    if ( type_Paragraph == this.Content[StartPos].GetType() )
                        VisTextPr = this.Content[StartPos].Selection_CalculateTextPr();
                    else if ( type_Table == this.Content[StartPos].GetType() )
                        VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();

                    for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
                    {
                        var Item = this.Content[Index];

                        var CurPr;
                        if ( type_Paragraph == Item.GetType() )
                            CurPr = Item.Selection_CalculateTextPr();
                        else if ( type_Table == Item.GetType() )
                            CurPr = Item.Get_Paragraph_TextPr();

                        VisTextPr = VisTextPr.Compare(CurPr);
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    // Текстовые настройки применяем к конкретной нумерации
                    if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                        break;

                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                    VisTextPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].TextPr;

                    break;
                }
            }

            Result_TextPr = VisTextPr;
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];

            if ( type_Paragraph == Item.GetType() )
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos - 1 );
            else if ( type_Table == Item.GetType() )
                Result_TextPr = Item.Get_Paragraph_TextPr();
        }

        return Result_TextPr;
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        var Result_TextPr = null;

        if ( true === this.ApplyToAll )
        {
            var Item = this.Content[0];
            if ( type_Paragraph == Item.GetType() )
            {
                Item.Cursor_MoveToStartPos();
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
            }


            return Result_TextPr;
        }


        if ( true === this.Selection.Use )
        {
            var VisTextPr;
            switch ( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    if ( this.Selection.EndPos < StartPos )
                        StartPos = this.Selection.EndPos;

                    var Item = this.Content[StartPos];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        var StartPos_item = Item.Selection.StartPos;
                        if ( Item.Selection.EndPos < StartPos_item )
                            StartPos_item = Item.Selection.EndPos

                        VisTextPr = Item.Internal_CalculateTextPr3( StartPos_item );
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    // Текстовые настройки применяем к конкретной нумерации
                    if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                        break;

                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                    VisTextPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].TextPr;

                    break;
                }
            }

            Result_TextPr = VisTextPr;
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                Result_TextPr = Item.Internal_CalculateTextPr3( Item.CurPos.ContentPos );
            }
        }

        return Result_TextPr;
    },

//-----------------------------------------------------------------------------------
// Функции для работы с интерфейсом
//-----------------------------------------------------------------------------------

    // Обновляем данные в интерфейсе о свойствах параграфа
    Interface_Update_ParaPr : function()
    {
        var ParaPr = this.Get_Paragraph_ParaPr();

        if ( null != ParaPr )
        {
            if ( "undefined" != typeof(ParaPr.Tabs) && null != ParaPr.Tabs )
                editor.Update_ParaTab( Default_Tab_Stop, ParaPr.Tabs );

            editor.UpdateParagraphProp( ParaPr );
            editor.sync_PrLineSpacingCallBack(ParaPr.Spacing);
        }
    },

    // Обновляем данные в интерфейсе о свойствах текста
    Interface_Update_TextPr : function()
    {
        var TextPr = this.Get_Paragraph_TextPr();


        if ( null != TextPr )
            editor.UpdateTextPr(TextPr);
    },

    Interface_Update_ImagePr : function(Flag)
    {
        ImagePr = null;
        if ( true === Flag )
            return ImagePr;
        else
            editor.sync_ImgPropCallback( ImagePr );

    },

    Interface_Update_TablePr : function(Flag)
    {
        var TablePr = null;

        if ( true === Flag )
            return TablePr;
        else if ( null != TablePr )
            editor.sync_TblPropCallback( TablePr );
    },

//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------

    FlowObject_Blur : function ()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Selection.Data.FlowObject.Blur();
        }
    },

    // Убираем селект
    Selection_Remove : function()
    {
        if ( true === this.Selection.Use )
        {
            switch( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if ( Start > End )
                    {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }

                    for ( var Index = Start; Index <= End; Index++ )
                    {
                        this.Content[Index].Selection_Remove();
                    }

                    this.Selection.Use   = false;
                    this.Selection.Start = false;
                    break;
                }
                case selectionflag_Numbering:
                {
                    if ( null == this.Selection.Data )
                        break;

                    for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Remove();
                    }

                    this.Selection.Use   = false;
                    this.Selection.Start = false;
                    this.Selection.Flag  = selectionflag_Common;

                    break;
                }
                case selectionflag_DrawingObject:
                {
                    if ( null == this.Selection.Data )
                        break;

                    this.Selection.Data.DrawingObject.Blur();

                    this.Selection.Use   = false;
                    this.Selection.Start = false;
                    this.Selection.Flag  = selectionflag_Common;

                    break;
                }
            }
        }
    },

    // Рисуем селект
    Selection_Draw : function()
    {
        if ( true === this.Selection.Use )
        {
            switch( this.Selection.Flag )
            {
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if ( Start > End )
                    {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }

                    for ( var Index = Start; Index <= End; Index++ )
                    {
                        this.Content[Index].Selection_Draw();
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    if ( null == this.Selection.Data )
                        break;

                    for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Draw();
                    }

                    break;
                }
                case selectionflag_DrawingObject:
                {
                    if ( null == this.Selection.Data )
                        break;

                    this.Selection.Data.DrawingObject.Focus();

                    break;
                }
            }
        }
    },

    Selection_Clear : function()
    {
        if ( true === this.Selection.Use )
        {

            switch( this.Selection.Flag )
            {
                case selectionflag_Common:
                {

                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if ( Start > End )
                    {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }

                    for ( var Index = Start; Index <= End; Index++ )
                    {
                        this.Content[Index].Selection_Clear();
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    if ( null == this.Selection.Data )
                        break;

                    for ( var Index = 0; Index < this.Selection.Data.length; Index++ )
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Clear();
                    }

                    break;
                }
                case selectionflag_DrawingObject:
                {
                    break;
                }
            }
        }
    },

    Selection_SetStart : function(X,Y, PageIndex, MouseEvent)
    {
        if(MouseEvent.Button === 2 && this.Selection.Use === true )
        {
            var _content_pos = this.Internal_GetContentPosByXY(X,Y);
            var _start_pos = this.Selection.StartPos;
            var _end_pos = this.Selection.EndPos;
            if(_start_pos > _end_pos)
            {
                var _t = _start_pos;
                _start_pos = _end_pos;
                _end_pos = _t;
            }

            if(_content_pos >= _start_pos && _content_pos <= _end_pos)
            {
                if(_start_pos < _end_pos)
                {
                    if(_content_pos > _start_pos && _content_pos < _end_pos)
                        return;
                    if(_content_pos === _start_pos)
                    {
                        var _item_pos = this.Content[_start_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                        var _item_start_pos = this.Content[_start_pos].Selection.StartPos;
                        var _item_end_pos = this.Content[_start_pos].Selection.EndPos;

                        if(_item_end_pos < _item_start_pos)
                        {
                            _t = _item_end_pos;
                            _item_end_pos = _item_start_pos;
                            _item_start_pos = _t;
                        }
                        if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                            return;
                    }

                    if(_content_pos === _end_pos)
                    {
                        _item_pos = this.Content[_end_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                         _item_start_pos = this.Content[_end_pos].Selection.StartPos;
                         _item_end_pos = this.Content[_end_pos].Selection.EndPos;
                        if(_item_end_pos < _item_start_pos)
                        {
                            _t = _item_end_pos;
                            _item_end_pos = _item_start_pos;
                            _item_start_pos = _t;
                        }
                        if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                            return;
                    }
                }
                else
                {
                    _item_pos = this.Content[_start_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                    _item_start_pos = this.Content[_start_pos].Selection.StartPos;
                    _item_end_pos = this.Content[_start_pos].Selection.EndPos;

                    if(_item_end_pos < _item_start_pos)
                    {
                        _t = _item_end_pos;
                        _item_end_pos = _item_start_pos;
                        _item_start_pos = _t;
                    }
                    if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                        return;
                }
            }
        }
        if ( PageIndex - this.StartPage >= this.Pages.length )
            return;

        this.CurPage = PageIndex - this.StartPage;

        var bOldSelectionIsCommon = true;


        var ContentPos = this.Internal_GetContentPosByXY(X,Y);


        var SelectionUse_old = this.Selection.Use;
        var Item = this.Content[ContentPos];

        var bTableBorder = false;

        // Убираем селект, кроме случаев либо текущего параграфа, либо при движении границ внутри таблицы
        if ( !(true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) )
        {
            if ( (selectionflag_Common != this.Selection.Flag) || ( true === this.Selection.Use && MouseEvent.ClickCount <= 1 )  )
                this.Selection_Remove();
        }

        this.Selection.Use         = true;
        this.Selection.Start       = true;
        this.Selection.Flag        = selectionflag_Common;

        if ( true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon )
        {
            this.Selection_SetEnd( X, Y, this.CurPage, {Type : g_mouse_event_type_up, ClickCount : 1} );
            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.EndPos   = ContentPos;
            this.Selection.Data     = null;
        }
        else
        {
            Item.Selection_SetStart( X, Y, this.CurPage, MouseEvent );
            Item.Selection_SetEnd( X, Y, this.CurPage, {Type : g_mouse_event_type_move, ClickCount : 1} );

            this.Selection.Use      = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos   = ContentPos;
            this.Selection.Data     = null;

            if ( type_Paragraph === Item.GetType() && true === MouseEvent.CtrlKey )
            {
                var Hyperlink = Item.Check_Hyperlink( X, Y, this.CurPage );
                if ( null != Hyperlink )
                {
                    this.Selection.Data =
                    {
                        Hyperlink : true,
                        Value     : Hyperlink
                    };
                }
            }

        }

    },



    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X, Y, PageIndex, MouseEvent)
    {
        if(MouseEvent.Button === 2 && g_mouse_event_type_up == MouseEvent.Type && this.Selection.Use === true)
        {
            var _content_pos = this.Internal_GetContentPosByXY(X,Y);
            var _start_pos = this.Selection.StartPos;
            var _end_pos = this.Selection.EndPos;
            if(_start_pos > _end_pos)
            {
                var _t = _start_pos;
                _start_pos = _end_pos;
                _end_pos = _t;
            }

            if(_content_pos >= _start_pos && _content_pos <= _end_pos)
            {
                if(_start_pos < _end_pos)
                {
                    if(_content_pos > _start_pos && _content_pos < _end_pos)
                        return;
                    if(_content_pos === _start_pos)
                    {
                        var _item_pos = this.Content[_start_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                        var _item_start_pos = this.Content[_start_pos].Selection.StartPos;
                        var _item_end_pos = this.Content[_start_pos].Selection.EndPos;

                        if(_item_end_pos < _item_start_pos)
                        {
                            _t = _item_end_pos;
                            _item_end_pos = _item_start_pos;
                            _item_start_pos = _t;
                        }
                        if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                            return;
                    }

                    if(_content_pos === _end_pos)
                    {
                        _item_pos = this.Content[_end_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                        _item_start_pos = this.Content[_end_pos].Selection.StartPos;
                        _item_end_pos = this.Content[_end_pos].Selection.EndPos;
                        if(_item_end_pos < _item_start_pos)
                        {
                            _t = _item_end_pos;
                            _item_end_pos = _item_start_pos;
                            _item_start_pos = _t;
                        }
                        if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                            return;
                    }
                }
                else
                {
                    _item_pos = this.Content[_start_pos].Internal_GetContentPosByXY( X, Y, false, this.CurPage).Pos;
                    _item_start_pos = this.Content[_start_pos].Selection.StartPos;
                    _item_end_pos = this.Content[_start_pos].Selection.EndPos;

                    if(_item_end_pos < _item_start_pos)
                    {
                        _t = _item_end_pos;
                        _item_end_pos = _item_start_pos;
                        _item_start_pos = _t;
                    }
                    if(_item_pos >  _item_start_pos && _item_pos < _item_end_pos)
                        return;
                }
            }
        }
        if ( PageIndex - this.StartPage >= this.Pages.length )
            return;

        this.CurPage = PageIndex - this.StartPage;

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            if ( g_mouse_event_type_move == MouseEvent.Type )
            {
            }
            else // if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.Selection.Start = false;
            }

            return;
        }

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( g_mouse_event_type_move == MouseEvent.Type )
            {
                this.Selection.Data.FlowObject.Move( X, Y, this.CurPage, MouseEvent );
            }
            else // if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.Selection.Start = false;

                if ( false === ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag ) )
                    this.Selection.Use = false;

                this.Selection.Data.FlowObject.Move_End( X, Y, this.CurPage, MouseEvent );
            }

            return;
        }
        if ( selectionflag_Numbering === this.Selection.Flag )
            return;

        // Обрабатываем движение границы у таблиц

        if ( false === this.Selection.Use )
            return;

        var ContentPos = this.Internal_GetContentPosByXY(X,Y);

        this.Selection_Clear();

        var OldPos = this.CurPos.ContentPos;
        var OldInnerPos = null;
        if ( type_Paragraph === this.Content[OldPos].GetType() )
            OldInnerPos = this.Content[OldPos].CurPos.ContentPos;
        else //if ( type_Table === this.Content[OldPos].GetType() )
            OldInnerPos = this.Content[OldPos].CurCell;

        this.CurPos.ContentPos = ContentPos;
        var OldEndPos = this.Selection.EndPos;
        this.Selection.EndPos = ContentPos;

        // Удалим отметки о старом селекте
        if ( OldEndPos < this.Selection.StartPos && OldEndPos < this.Selection.EndPos )
        {
            var TempLimit = Math.min( this.Selection.StartPos, this.Selection.EndPos );
            for ( var Index = OldEndPos; Index < TempLimit; Index++ )
            {
                this.Content[Index].Selection.Use   = false;
                this.Content[Index].Selection.Start = false;
            }
        }
        else if ( OldEndPos > this.Selection.StartPos && OldEndPos > this.Selection.EndPos )
        {
            var TempLimit = Math.max( this.Selection.StartPos, this.Selection.EndPos );
            for ( var Index = TempLimit + 1; Index <= OldEndPos; Index++ )
            {
                this.Content[Index].Selection.Use   = false;
                this.Content[Index].Selection.Start = false;
            }
        }


        // Направление селекта: 1 - прямое, -1 - обратное, 0 - отмечен 1 элемент документа
        var Direction = ( ContentPos > this.Selection.StartPos ? 1 : ( ContentPos < this.Selection.StartPos ? -1 : 0 )  );

        if ( g_mouse_event_type_up == MouseEvent.Type )
        {
            // Останаливаем селект в глобальном классе. Кроме этого мы должны остановить селект в
            // стартовом элементе селекта.
            this.Selection.Start = false;

            // Если 0 === Direction, в функции Selection_SetEnd все что нужно обработается
            if ( 0 != Direction )
                this.Content[this.Selection.StartPos].Selection_Stop(X, Y, this.CurPage, MouseEvent);
        }

        var Start, End;
        if ( 0 == Direction )
        {
            var Item = this.Content[this.Selection.StartPos];
            var ItemType = Item.GetType();
            Item.Selection_SetEnd( X, Y, this.CurPage, MouseEvent );

            if ( false === Item.Selection.Use )
            {
                this.Selection.Use = false;

                if ( null != this.Selection.Data && true === this.Selection.Data.Hyperlink )
                {
                    // TODO: Добавить функцию из DrawingDocument
                    // console.log( "Fire hyperlink " + this.Selection.Data.Value.Get_ToolTip() );
                    editor.sync_HyperlinkClickCallback( this.Selection.Data.Value.Get_Value() );
                    this.Selection.Data.Value.Set_Visited( true );

                    this.DrawingDocument.OnRecalculatePage( this.Parent.parent.num, this.Parent.parent );

                    this.DrawingDocument.OnEndRecalculate();
                }
            }
            else
            {
                this.Selection.Use = true;
            }

            return;
        }
        else if ( Direction > 0 )
        {
            Start = this.Selection.StartPos;
            End   = this.Selection.EndPos;
        }
        else
        {
            End   = this.Selection.StartPos;
            Start = this.Selection.EndPos;
        }

        // Чтобы не было эффекта, когда ничего не поселекчено, а при удалении соединяются параграфы
        if ( Direction > 0 && type_Paragraph === this.Content[Start].GetType() && true === this.Content[Start].Selection_IsEmpty() && this.Content[Start].Selection.StartPos == this.Content[Start].Content.length - 1 )
        {
            this.Content[Start].Selection.StartPos = this.Content[Start].Internal_GetEndPos();
            this.Content[Start].Selection.EndPos   = this.Content[Start].Content.length - 1;
        }

        this.Content[ContentPos].Selection_SetEnd( X, Y, this.CurPage, MouseEvent );

        for ( var Index = Start; Index <= End; Index++ )
        {
            var Item = this.Content[Index];
            var ItemType = Item.GetType();
            Item.Selection.Use = true;

            switch ( Index )
            {
                case Start:

                    if ( type_Paragraph === ItemType )
                    {
                        if ( Direction > 0 )
                            Item.Selection.EndPos   = Item.Content.length - 1;
                        else
                            Item.Selection.StartPos = Item.Content.length - 1;
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos  = { Row: Row, Cell : Cell };

                        if ( Direction > 0 )
                            Item.Selection.EndPos.Pos   = Pos;
                        else
                            Item.Selection.StartPos.Pos = Pos;

                        Item.Internal_Selection_UpdateCells();
                    }

                    break;

                case End:

                    if ( type_Paragraph === ItemType )
                    {
                        if ( Direction > 0 )
                            Item.Selection.StartPos = Item.Internal_GetStartPos();
                        else
                            Item.Selection.EndPos   = Item.Internal_GetStartPos();
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Pos  = { Row: 0, Cell : 0 };

                        if ( Direction > 0 )
                            Item.Selection.StartPos.Pos = Pos;
                        else
                            Item.Selection.EndPos.Pos   = Pos;

                        Item.Internal_Selection_UpdateCells();
                    }

                    break;

                default:

                    if ( type_Paragraph === ItemType )
                    {
                        if ( Direction > 0 )
                        {
                            Item.Selection.StartPos = Item.Internal_GetStartPos();
                            Item.Selection.EndPos   = Item.Content.length - 1;
                        }
                        else
                        {
                            Item.Selection.EndPos   = Item.Internal_GetStartPos();
                            Item.Selection.StartPos = Item.Content.length - 1;
                        }
                    }
                    else //if ( type_Table === ItemType )
                    {
                        var Row  = Item.Content.length - 1;
                        var Cell = Item.Content[Row].Get_CellsCount() - 1;
                        var Pos0  = { Row: 0, Cell : 0 };
                        var Pos1  = { Row: Row, Cell : Cell };

                        if ( Direction > 0 )
                        {
                            Item.Selection.StartPos.Pos = Pos0;
                            Item.Selection.EndPos.Pos   = Pos1;
                        }
                        else
                        {
                            Item.Selection.EndPos.Pos   = Pos0;
                            Item.Selection.StartPos.Pos = Pos1;
                        }

                        Item.Internal_Selection_UpdateCells();
                    }
                    
                    break;
            }
        }
    },

    Selection_IsEmpty : function()
    {
        if ( true === this.Selection.Use )
        {
            if ( this.Selection.StartPos === this.Selection.EndPos )
                return this.Content[this.Selection.StartPos].Selection_IsEmpty();
            else
                return false;
        }

        return true;
    },

    Selection_Stop : function(X, Y, PageIndex, MouseEvent)
    {
        if ( true != this.Selection.Use )
            return;

        var PageNum = PageIndex;
        var _Y = Y;
        var _X = X;
        if ( PageNum < 0 )
        {
            PageNum = 0;
            _Y      = -1; // -1, чтобы избежать погрешностей
            _X      = -1; // -1, чтобы избежать погрешностей
        }
        else if ( PageNum >= this.Pages.length )
        {
            PageNum = this.Pages.length - 1;
            _Y      = this.Pages[PageNum].YLimit + 1; // +1, чтобы избежать погрешностей
            _X      = this.Pages[PageNum].XLimit + 1; // +1, чтобы избежать погрешностей/
        }
        else
        {
            if ( 0 === PageNum && Y < this.Pages[0].Bounds.Top )
                _X = -1;
            else if ( this.Pages.length - 1 === PageNum && Y > this.Pages[this.Pages.length - 1].Bounds.Bottom )
                _X = this.Pages[this.Pages.length - 1].XLimit + 1;
        }

        var _MouseEvent = { ClickCount : 1, Type : g_mouse_event_type_up };
        this.Selection_SetEnd( _X, _Y, PageNum + this.StartPage, _MouseEvent );
    },

    // Селектим все содержимое
    Select_All : function()
    {
        if ( true === this.Selection.Use )
            this.Selection_Remove();

        this.Selection.Use      = true;
        this.Selection.Start    = false;
        this.Selection.Flag     = selectionflag_Common;

        this.Selection.StartPos = 0;
        this.Selection.EndPos   = this.Content.length - 1;

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            this.Content[Index].Select_All();
        }
    },

    Select_DrawingObject : function(Id)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Selection.Data.FlowObject.Blur();
        }

        this.Selection_Remove();

        var Drawing = this.DrawingObjects.Get_ById( Id );

        // Прячем курсор
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage( this.Get_StartPage_Absolute() + this.CurPage );

        this.Selection.Use  = true;
        this.Selection.Flag = selectionflag_DrawingObject;

        this.Selection.Data =
        {
            DrawingObject : Drawing
        };

        this.Parent.Set_CurrentElement();

        // TODO: Пока сделаем так, в будущем надо сделать функцию, которая у родительского класса обновляет Select
        editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    },

    Document_SelectNumbering : function(NumPr)
    {
        this.Selection_Remove();

        this.Selection.Use  = true;
        this.Selection.Flag = selectionflag_Numbering;
        this.Selection.Data = new Array();

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && null != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl )
            {
                this.Selection.Data.push( Index );
                Item.Selection_SelectNumbering();
            }
        }

        this.DrawingDocument.SelectEnabled(true);

        this.Selection_Draw();

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    // Если сейчас у нас заселекчена нумерация, тогда убираем селект
    Remove_NumberingSelection : function()
    {
        if ( true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag )
            this.Selection_Remove();
    },

    Remove_DrawingObjectSelection : function()
    {
        if ( true === this.Selection.Use && selectionflag_DrawingObject == this.Selection.Flag )
            this.Selection_Remove();
    },

//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        return false;
    },

    Table_AddCol : function(bBefore)
    {
        return false;
    },

    Table_RemoveRow : function()
    {
        return false;
    },

    Table_RemoveCol : function()
    {
        return false;
    },

    Table_MergeCells : function()
    {
        return false;
    },

    Table_SplitCell : function( Cols, Rows )
    {
        return false;
    },

    Table_RemoveTable : function()
    {
        return false;
    },

    Table_Select : function(Type)
    {
        return false;
    },

    Table_CheckMerge : function()
    {
        return false;
    },

    Table_CheckSplit : function()
    {
        return false;
    },
//-----------------------------------------------------------------------------------
// Вспомогательные(внутренние ) функции
//-----------------------------------------------------------------------------------

    Internal_GetContentPosByXY : function(X,Y, PageNum)
    {
        if ( "undefined" === typeof(PageNum) )
            PageNum = this.CurPage;

        // TODO: изенить здесь
        PageNum = Math.min( PageNum, this.Pages.length - 1 );

        var ContentPos = this.Pages[PageNum].Pos;
        var Item = this.Content[ContentPos];

        // Значит данный элемент занимает всю страницу
        if ( PageNum != Item.Pages.length - 1 + Item.PageNum )
            return ContentPos;

        // Данный элемент заканчивается на текущей странице
        for ( ContentPos = this.Pages[PageNum].Pos; ContentPos < this.Content.length - 1; ContentPos++ )
        {
            if ( Y < this.Content[ContentPos + 1].Pages[0].Bounds.Top )
                break;

            if ( this.Content[ContentPos + 1].Pages.length > 1  )
            {
                Item = this.Content[ContentPos + 1];

                switch ( Item.GetType() )
                {
                    case type_Paragraph:
                    {
                        // Избегаем случая, когда параграф целиком переносится на следующую страницу
                        if ( Item.Pages[0].FirstLine != Item.Pages[1].FirstLine )
                            ContentPos++;
                        break;
                    }
                }

                break;
            }
        }

        return ContentPos;
    },

    Internal_Content_Find : function(Id)
    {
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            if ( this.Content[Index].GetId() === Id )
                return Index;
        }

        return -1;
    },

    Internal_CheckCurPage : function()
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Relative();
        }
        else if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.CurPage = this.Selection.Data.FlowObject.PageNum;
                    break;
                }
                case flowobject_Table:
                {
                    this.CurPage = this.Selection.Data.FlowObject.PageNum;
                    break;
                }
            }
        }
        else if ( true === this.Selection.Use )
        {
            this.CurPage = this.Content[this.Selection.EndPos].Get_CurrentPage_Relative();
        }
        else if ( this.CurPos.ContentPos >= 0 )
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Relative();
        }
    },

    Internal_Content_Add : function(Position, NewObject)
    {
        // Position = this.Content.length  допускается
        if ( Position < 0 || Position > this.Content.length )
            return;

        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position];

        if ( "undefined" == typeof(PrevObj) )
            PrevObj = null;

        if ( "undefined" == typeof(NextObj) )
            NextObj = null;

        History.Add( this, { Type : historyitem_DocumentContent_AddItem, Pos : Position, Item : NewObject } );
        this.Content.splice( Position, 0, NewObject );
        NewObject.Set_DocumentNext( NextObj );
        NewObject.Set_DocumentPrev( PrevObj );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NewObject );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( NewObject );

        if ( Position <= this.CurPos.TableMove )
            this.CurPos.TableMove++;
    },

    Internal_Content_Remove : function(Position, Count)
    {
        if ( Position < 0 || Position >= this.Content.length || Count <= 0 )
            return;

        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position + Count];

        if ( "undefined" == typeof(PrevObj) )
            PrevObj = null;

        if ( "undefined" == typeof(NextObj) )
            NextObj = null;
        
        for ( var Index = 0; Index < Count; Index++ )
            this.Content[Position + Index].PreDelete();

        History.Add( this, { Type : historyitem_DocumentContent_RemoveItem, Pos : Position, Items : this.Content.slice( Position, Position + Count ) } );
        this.Content.splice( Position, Count );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NextObj );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( PrevObj );

    },

    Internal_Content_RemoveAll : function()
    {
        History.Add( this, { Type : historyitem_DocumentContent_RemoveItem, Pos : 0, Items : this.Content.slice( 0, this.Content.length ) } );
        this.Content = new Array();
    },

//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },

    Get_StartPage_Relative : function()
    {
        return this.StartPage;
    },

    Set_StartPage : function(StartPage)
    {
        this.StartPage = StartPage;
    },

    // Приходит абсолютное значение страницы(по отношению к родительскому классу), на выходе - относительное
    Get_Page_Relative : function(AbsPage)
    {
        return Math.min( this.Pages.length - 1, Math.max( AbsPage - this.StartPage, 0 ) );
    },

    Get_SelectedText : function(bClearText)
    {
        if ( true === this.ApplyToAll )
        {
            if ( true === bClearText && this.Content.length <= 1 )
            {
                this.Content[0].Set_ApplyToAll(true);
                var ResultText = this.Content[0].Get_SelectedText( true );
                this.Content[0].Set_ApplyToAll(false);
                return ResultText;
            }
            else if ( true != bClearText )
            {
                var ResultText = "";
                var Count = this.Content.length;
                for ( var Index = 0; Index < Count; Index++ )
                {
                    this.Content[Index].Set_ApplyToAll(true);
                    ResultText += this.Content[Index].Get_SelectedText( true );
                    this.Content[Index].Set_ApplyToAll(false);
                }

                return ResultText;
            }
        }
        else
        {
            if ( docpostype_FlowObjects == this.CurPos.Type )
            {
                switch ( this.Selection.Data.FlowObject.Get_Type() )
                {
                    case flowobject_Image : return null;
                    case flowobject_Table : return this.Selection.Data.FlowObject.Table.Get_SelectedText(bClearText);
                }

                return null;
            }

            // Либо у нас нет выделения, либо выделение внутри одного элемента
            if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag ) || false === this.Selection.Use ) )
            {
                if ( true === bClearText && this.Selection.StartPos === this.Selection.EndPos )
                {
                    var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
                    return this.Content[Pos].Get_SelectedText(true);
                }
                else if ( false === bClearText )
                {
                    var StartPos = ( true == this.Selection.Use ? Math.min( this.Selection.StartPos, this.Selection.EndPos ) : this.CurPos.ContentPos );
                    var EndPos   = ( true == this.Selection.Use ? Math.max( this.Selection.StartPos, this.Selection.EndPos ) : this.CurPos.ContentPos );

                    var ResultText = "";

                    for ( var Index = StartPos; Index <= EndPos; Index++ )
                    {
                        ResultText += this.Content[Index].Get_SelectedText(false);
                    }

                    return ResultText;
                }
            }
        }

        return null;
    },
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {

            case history_undo_redo_const:
            {
                Data.undo_function.call(this, Data);
                break;
            }
            case historyitem_DocumentContent_AddItem:
            {
                this.Content.splice( Data.Pos, 1 );

                break;
            }

            case historyitem_DocumentContent_RemoveItem:
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );
                break;
            }
        }
        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case history_undo_redo_const:
            {
                Data.redo_function.call(this, Data);
                break;
            }
            case historyitem_DocumentContent_AddItem:
            {
                var Pos = Data.Pos;
                this.Content.splice( Pos, 0, Data.Item );

                break;
            }

            case historyitem_DocumentContent_RemoveItem:
            {
                this.Content.splice( Data.Pos, Data.Items.length );
                break;
            }
        }
        History.RecalcData_Add( this.Get_ParentObject_or_DocumentPos() );
    },

    Get_SelectionState : function()
    {
        var DocState = new Object();
        DocState.CurPos =
        {
            X          : this.CurPos.X,
            Y          : this.CurPos.Y,
            ContentPos : this.CurPos.ContentPos,
            RealX      : this.CurPos.RealX,
            RealY      : this.CurPos.RealY,
            Type       : this.CurPos.Type
        };

        DocState.Selection =
        {

            Start    : this.Selection.Start,
            Use      : this.Selection.Use,
            StartPos : this.Selection.StartPos,
            EndPos   : this.Selection.EndPos,
            Flag     : this.Selection.Flag,
            Data     : this.Selection.Data
        };

        DocState.CurPage = this.CurPage;

        if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            DocState.Selection.Data  =
            {
                PageNum    : this.Selection.Data.PageNum,
                FlowObject : this.Selection.Data.FlowObject,
                Pos        : this.Selection.Data.Pos
            };
        }
        else if ( docpostype_Content === this.CurPos.Type && selectionflag_DrawingObject === this.Selection.Flag )
        {
            DocState.Selection.Data =
            {
                DrawingObject : this.Selection.Data.DrawingObject
            };
        }


        var State = null;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            State = this.HdrFtr.Get_SelectionState();
        else if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            State = new Array();
        else if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    State = new Array();
                    break;
                }
                case flowobject_Table:
                {
                    State = this.Selection.Data.FlowObject.Get_SelectionState();
                    break;
                }
            }
        }
        else if ( true === this.Selection.Use )
        {
            // Выделение нумерации
            if ( selectionflag_Numbering == this.Selection.Flag )
                State = new Array();
            else
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                State = new Array();

                var TempState = new Array();
                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    TempState.push( this.Content[Index].Get_SelectionState() );
                }

                State.push( TempState );
            }
        }
        else
            State = this.Content[this.CurPos.ContentPos].Get_SelectionState();

        State.push( DocState );
        return State;
    },

    getSearchResults : function(str)
    {
        var arrSelectionStates = [];
        for(var i = 0; i < this.Content.length; ++i)
        {
            var paragraphSearchResults;
            if((paragraphSearchResults = this.Content[i].DocumentSearch(str)).length > 0)
            {
                for(var j = 0; j < paragraphSearchResults.length; ++j)
                {
                    var curSelectionState = [];
                    var DocState = {};
                    DocState.CurPos =
                    {
                        X          : this.CurPos.X,
                        Y          : this.CurPos.Y,
                        ContentPos : i,
                        RealX      : this.CurPos.RealX,
                        RealY      : this.CurPos.RealY,
                        Type       : this.CurPos.Type
                    };

                    DocState.Selection =
                    {
                        Start    : true,
                        Use      : true,
                        StartPos : i,
                        EndPos   : i,
                        Flag     : selectionflag_Common,
                        Data     : null
                    };

                    var ParaState = {};
                    ParaState.CurPos  =
                    {
                        X          : this.Content[i].CurPos.X,
                        Y          : this.Content[i].CurPos.Y,
                        ContentPos : this.Content[i].Internal_Get_ClearPos(this.Content[i].CurPos.ContentPos),
                        RealX      : this.Content[i].CurPos.RealX,
                        RealY      : this.Content[i].CurPos.RealY,
                        PagesPos   : this.Content[i].CurPos.PagesPos
                    };

                    ParaState.Selection =
                    {
                        Start    : true,
                        Use      : true,
                        StartPos : this.Content[i].Internal_Get_ClearPos(paragraphSearchResults[j].StartPos),
                        EndPos   : this.Content[i].Internal_Get_ClearPos(paragraphSearchResults[j].EndPos),
                        Flag     : selectionflag_Common
                    };

                    curSelectionState.push([[ParaState]]);
                    curSelectionState.push(DocState);
                    arrSelectionStates.push(curSelectionState);
                }
            }
        }
        return arrSelectionStates;
    },

    Set_SelectionState : function(State, StateIndex)
    {
        // Если был заселекчен плавающий объект, удаляем его
        if ( this.CurPos.Type == docpostype_FlowObjects )
            this.Selection.Data.FlowObject.Blur();
        else if ( this.CurPos.Type == docpostype_Content && this.Selection.Flag === selectionflag_DrawingObject )
            this.Selection.Data.DrawingObject.Blur();

        if ( State.length <= 0 )
            return;

        var DocState = State[StateIndex];

        this.CurPos =
        {
            X          : DocState.CurPos.X,
            Y          : DocState.CurPos.Y,
            ContentPos : DocState.CurPos.ContentPos,
            RealX      : DocState.CurPos.RealX,
            RealY      : DocState.CurPos.RealY,
            Type       : DocState.CurPos.Type
        };

        this.Selection =
        {

            Start    : DocState.Selection.Start,
            Use      : DocState.Selection.Use,
            StartPos : DocState.Selection.StartPos,
            EndPos   : DocState.Selection.EndPos,
            Flag     : DocState.Selection.Flag,
            Data     : DocState.Selection.Data
        };

        this.CurPage = DocState.CurPage;

        var NewStateIndex = StateIndex - 1;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Set_SelectionState( State, NewStateIndex );
        else if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            // Ничего не делаем
        }
        else if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    // Ничего не делаем
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Set_SelectionState( State, NewStateIndex );
                    break;
                }
            }
        }
        else if ( true === this.Selection.Use )
        {
            // Выделение нумерации
            if ( selectionflag_Numbering == this.Selection.Flag )
            {
                // Ничего не делаем
            }
            else
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if ( StartPos > EndPos )
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                var CurState = State[NewStateIndex];

                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    this.Content[Index].Set_SelectionState( CurState[Index - StartPos], CurState[Index - StartPos].length - 1 );
                }
            }
        }
        else
            this.Content[this.CurPos.ContentPos].Set_SelectionState( State, NewStateIndex );
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Parent.Get_ParentObject_or_DocumentPos();
    }
};