/**
 * User: Ilja.Kirillov
 * Date: 09.12.11
 * Time: 11:51
 */








// Класс CDocumentContent. Данный класс используется для работы с контентом ячеек таблицы,
// колонтитулов, сносок, надписей.
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

    this.Pages[0].FlowObjects = new FlowObjects(this, 0);

    this.Split = Split; // Разделяем ли на страницы

    CollaborativeEditing.Add_NewDC(this);
    this.m_aContentChanges = new Array(); // список изменений(добавление/удаление элементов)

    this.IdCounter = 0;

    this.Content = new Array();
    this.Content[0] = new Paragraph( DrawingDocument, this, 0, X, Y, XLimit, YLimit, ++this.IdCounter);
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

    this.Styles    = this.Parent.Get_Styles();
    this.Numbering = this.Parent.Get_Numbering();

    this.ClipInfo =
    {
        X0 : null,
        X1 : null
    };

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.TurnOffRecalc = false;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );
}

CDocumentContent.prototype =
{

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

    Get_Styles : function()
    {
        return this.Styles;
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


    RecalculateNumbering : function()
    {
        this.Numbering = new CNumbering();
        var numbering = this.Numbering;
        var parentTxBody = this.Parent.txBody;
        var arrID = [], arrCurNumberingTypes = [], arrCurCharBullet = [], arrCurStartAt = [], arrCurAutoNumType = [];
        for(var t = 0; t<9;++t)
        {
            arrID[t] = null;
            arrCurNumberingTypes[t] = null;
            arrCurCharBullet[t] = null;
            arrCurStartAt[t] = null;
            arrCurAutoNumType[t] = null;
        }

        for(var i = 0, n = this.Content.length; i < n; ++i)
        {
            var paragraph = this.Content[i];
            if(paragraph.IsEmpty())
            {
                continue;
            }
            var lvl = paragraph.level !=undefined ? paragraph.level : 0;
            var bullet = null;

            if(paragraph.bullet!=null && paragraph.bullet.bulletType != null && paragraph.bullet.bulletType.type != null)
            {
                bullet = paragraph.bullet;
                paragraph.bullet = bullet;
            }

            if(bullet == null
                && parentTxBody.lstStyle != null
                && parentTxBody.lstStyle.levels[lvl] != null
                && parentTxBody.lstStyle.levels[lvl].bullet.bulletType!=null
                && parentTxBody.lstStyle.levels[lvl].bullet.bulletType.type!=null
                && parentTxBody.lstStyle.levels[lvl].bullet.bulletType.type!=0)
            {
                bullet = parentTxBody.lstStyle.levels[lvl].bullet;

            }

            if(bullet == null)
            {
                if(this.Parent.isPlaceholder())
                {
                    switch (this.Parent.parent.kind)
                    {
                        case SLIDE_KIND :
                        {
                            var layoutShape = this.Parent.parent.Layout.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                            if(layoutShape != null && layoutShape.txBody
                                && layoutShape.txBody.lstStyle != null
                                && layoutShape.txBody.lstStyle.levels[lvl] != null
                                && layoutShape.txBody.lstStyle.levels[lvl].bullet.bulletType!=null
                                && layoutShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=null
                                && layoutShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=0)
                            {
                                bullet = layoutShape.txBody.lstStyle.levels[lvl].bullet;
                            }
                            else
                            {
                                var masterShape = this.Parent.parent.Layout.Master.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                                if( masterShape != null && masterShape.txBody
                                    && masterShape.txBody.lstStyle != null
                                    && masterShape.txBody.lstStyle.levels[lvl] != null
                                    && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType!=null
                                    && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=null
                                    && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=0)
                                {
                                    bullet = masterShape.txBody.lstStyle.levels[lvl].bullet;
                                }
                            }
                            break;
                        }
                        case LAYOUT_KIND :
                        {
                            masterShape = this.Parent.parent.Master.getMatchingShape(this.Parent.nvSpPr.nvPr.ph.type, this.Parent.nvSpPr.nvPr.ph.idx);
                            if( masterShape != null && masterShape.txBody
                                && masterShape.txBody.lstStyle != null
                                && masterShape.txBody.lstStyle.levels[lvl] != null
                                && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType!=null
                                && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=null
                                && masterShape.txBody.lstStyle.levels[lvl].bullet.bulletType.type!=0)
                            {
                                bullet = masterShape.txBody.lstStyle.levels[lvl].bullet;
                            }
                            break;
                        }
                    }

                    if(bullet == null)
                    {
                        var master;
                        var presentation;
                        switch (this.Parent.parent.kind)
                        {
                            case SLIDE_KIND :
                            {
                                master = this.Parent.parent.Layout.Master;
                                break;
                            }
                            case LAYOUT_KIND :
                            {
                                master = this.Parent.parent.Master;
                                break;
                            }
                            default :
                            {
                                master = this.Parent.parent;
                                break;
                            }

                                if(master)
                                {
                                    presentation = master.presentation;
                                }
                        }

                        if(master && master.txStyles)
                        {
                            switch (this.Parent.nvSpPr.nvPr.ph.type)
                            {
                                case phType_title:
                                case phType_ctrTitle:
                                {
                                    if(master.txStyles.titleStyle
                                        && master.txStyles.titleStyle.levels[lvl]!=null
                                        && master.txStyles.titleStyle.levels[lvl].bullet.bulletType != null
                                        && master.txStyles.titleStyle.levels[lvl].bullet.bulletType.type!=null
                                         && master.txStyles.titleStyle.levels[lvl].bullet.bulletType.type!=0)
                                    {
                                        bullet = master.txStyles.titleStyle.levels[lvl].bullet;
                                    }
                                    break;
                                }
                                case phType_body :
                                {
                                    if(master.txStyles.bodyStyle
                                        && master.txStyles.bodyStyle.levels[lvl]!=null
                                        && master.txStyles.bodyStyle.levels[lvl].bullet.bulletType != null
                                        && master.txStyles.bodyStyle.levels[lvl].bullet.bulletType.type!=null
                                        && master.txStyles.bodyStyle.levels[lvl].bullet.bulletType.type!=0)
                                    {
                                        bullet = master.txStyles.bodyStyle.levels[lvl].bullet;
                                    }
                                    break;
                                }
                                default :
                                {
                                    if(master.txStyles.otherStyle
                                        && master.txStyles.otherStyle.levels[lvl]!=null
                                        && master.txStyles.otherStyle.levels[lvl].bullet.bulletType != null
                                        && master.txStyles.otherStyle.levels[lvl].bullet.bulletType.type!=null
                                        && master.txStyles.otherStyle.levels[lvl].bullet.bulletType.type!= 0 )
                                    {
                                        bullet = master.txStyles.otherStyle.levels[lvl].bullet;
                                    }
                                    break;
                                }
                            }
                        }
                        if(bullet == null
                            && presentation
                            && presentation.defaultTextStyle
                            && presentation.defaultTextStyle.levels[lvl]
                            && presentation.defaultTextStyle.levels[lvl].bullet.bulletType
                            && presentation.defaultTextStyle.levels[lvl].bullet.bulletType.type!=null
                            && presentation.defaultTextStyle.levels[lvl].bullet.bulletType.type != 0)
                        {
                            bullet = presentation.defaultTextStyle.levels[lvl].bullet;
                        }
                    }
                }
                else
                {
                    switch (this.Parent.parent.kind)
                    {
                        case SLIDE_KIND :
                        {
                            master = this.Parent.parent.Layout.Master;
                            break;
                        }
                        case LAYOUT_KIND :
                        {
                            master = this.Parent.parent.Master;
                            break;
                        }
                        default :
                        {
                            master = this.Parent.parent;
                            break;
                        }

                            if(master)
                            {
                                presentation = master.presentation;
                            }

                            if(presentation
                                && presentation.defaultTextStyle
                                && presentation.defaultTextStyle.levels[lvl]
                                && presentation.defaultTextStyle.levels[lvl].bullet.bulletType
                                && presentation.defaultTextStyle.levels[lvl].bullet.bulletType.type!=null
                                && presentation.defaultTextStyle.levels[lvl].bullet.bulletType.type!= 0 )
                            {
                                bullet = presentation.defaultTextStyle.levels[lvl].bullet;
                            }

                            if(bullet == null && master && master.txStyles)
                            {
                                if(master.txStyles.otherStyle
                                    && master.txStyles.otherStyle.levels[lvl]!=null
                                    && master.txStyles.otherStyle.levels[lvl].bullet.bulletType != null
                                    && master.txStyles.otherStyle.levels[lvl].bullet.bulletType.type!=null
                                    && master.txStyles.otherStyle.levels[lvl].bullet.bulletType.type!= 0)
                                {
                                    bullet = master.txStyles.otherStyle.levels[lvl].bullet;
                                }
                            }
                    }
                }
            }

            if(bullet!=null)
            {
                paragraph.compiledBullet = bullet;

                switch (bullet.bulletType.type)
                {
                    case BULLET_TYPE_BULLET_CHAR:
                    {
                        if((arrCurNumberingTypes[lvl] != BULLET_TYPE_BULLET_CHAR
                            || arrCurCharBullet[lvl] != bullet.bulletType.Char))
                        {
                            arrCurNumberingTypes[lvl] = BULLET_TYPE_BULLET_CHAR;
                            arrCurCharBullet[lvl] = bullet.bulletType.Char;
                            arrID[lvl] = numbering.Create_AbstractNum(numbering_numfmt_Bullet);
                            var abstractNum = numbering.Get_AbstractNum(arrID[lvl]);
                            for(var lvlIndex = 0; lvlIndex < 9; ++lvlIndex)
                            {
                                abstractNum.Set_Lvl_Bullet(lvlIndex, bullet.bulletType.Char, {})
                            }
                        }
                        paragraph.Numbering_Add(arrID[lvl], lvl);
                        break;
                    }
                    case BULLET_TYPE_BULLET_AUTONUM :
                    {
                        if(arrCurNumberingTypes[lvl] != BULLET_TYPE_BULLET_AUTONUM
                            ||(bullet.bulletType.startAt && arrCurStartAt[lvl] != bullet.bulletType.startAt))
                        {
                            arrCurNumberingTypes[lvl] = BULLET_TYPE_BULLET_AUTONUM;
                            if(bullet.bulletType.startAt)
                            {
                                arrCurStartAt[lvl] = bullet.bulletType.startAt;
                            }

                            arrID[lvl] = numbering.Create_AbstractNum(numbering_numfmt_Bullet);
                            abstractNum = numbering.Get_AbstractNum(arrID[lvl]);
                            var  startNum = bullet.bulletType.startAt ? bullet.bulletType.startAt : 1;
                            var format;
                            if(g_NumberingArr[bullet.bulletType.AutoNumType]!=undefined)
                            {
                                format = g_NumberingArr[bullet.bulletType.AutoNumType];
                            }
                            else
                            {
                                format = numbering_numfmt_alphaLcPeriod
                            }
                            for(lvlIndex = 0; lvlIndex < 9; ++lvlIndex)
                            {
                                abstractNum.Set_Lvl_Numbered_33(lvlIndex);
                                abstractNum.Lvl[lvlIndex].Start = startNum;
                                abstractNum.Lvl[lvlIndex].Format = format;
                            }
                        }
                        paragraph.Numbering_Add_Open(arrID[lvl], lvl);
                        break;
                    }
                    case BULLET_TYPE_BULLET_BLIP :
                    {
                        break;
                    }
                }
            }
            else
            {
                paragraph.Numbering_Remove();
            }
        }
    },

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
            pGraphics.AddClipRect( this.ClipInfo.X0, Bounds.Top, Math.abs(this.ClipInfo.X1 - this.ClipInfo.X0), Bounds.Bottom - Bounds.Top);
            bClip = true;
        }

        for ( var Index = this.Pages[PageNum].Pos; Index < Count; Index++ )
        {
            if ( -1 == this.Content[Index].Draw(PageNum, pGraphics) )
                break;
        }

        if ( true === bClip )
            pGraphics.RemoveClipRect();
    },

    RecalculateCurPos : function()
    {
        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos >= 0 && "undefined" != typeof(this.Content[this.CurPos.ContentPos].RecalculateCurPos) )
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
        else if ( type_Table == this.Content[0].GetType() )
            return this.Content[0].Get_FirstParagraph();

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
        if ( this.Content.length > 1 || type_Table === this.Content[0].GetType() )
            return false;

        return this.Content[0].IsEmpty();
    },

    Is_CurrentElementTable : function()
    {
       if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            return true;
        }
        return false;
    },

    Is_CurrentElementParagraph : function()
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            return false;
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            return false;
        }

        return true;
    },

    Check_AddTable : function(Table)
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return true;



        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                return this.Content[this.Selection.StartPos].Check_AddTable( Table );
            else
                return this.Content[this.CurPos.ContentPos].Check_AddTable( Table );
        }

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
        else if ( type_Table === Item.GetType() )
            return Item.Get_CurrentParagraph();

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
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if ( TempPNum < 0 || TempPNum >= this.Pages.length )
            TempPNum = 0;

        var ContentPos = this.Internal_GetContentPosByXY( X, Y, TempPNum );
        var Item = this.Content[ContentPos];
        if ( type_Table == Item.GetType() )
            return Item.Is_TableBorder( X, Y, PageNum_Abs );

        return false;
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
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            this.Interface_Update_ImagePr();
            return;
        }



        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
            else
                this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
        }
        else
        {
            this.Interface_Update_ParaPr();
            this.Interface_Update_TextPr();
        }
    },

    Document_UpdateRulersState : function(CurPage)
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            //return this.DrawingDocument.Set_RulerState_Paragraph( null );
            return;
        }



        if ( true === this.Selection.Use )
        {
            if ( this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                this.Content[this.Selection.StartPos].Document_UpdateRulersState(CurPage);
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Table === Item.GetType() )
                Item.Document_UpdateRulersState(CurPage);
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

    Get_ApplyToAll : function()
    {
        return this.ApplyToAll;
    },

    Update_CursorType : function( X, Y, PageNum_Abs)
    {
        var PageNum = Math.min( this.Pages.length - 1, Math.max( 0, PageNum_Abs - this.Get_StartPage_Absolute() ) );
        var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageNum);
        var Item = this.Content[ContentPos];
        Item.Update_CursorType( X, Y, PageNum );
        return;
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


                if ( StyleId === NextId )
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
        else if ( type_Table == Item.GetType() )
        {
            // Если мы находимся в начале первого параграфа первой ячейки, и
            // данная таблица - первый элемент, тогда добавляем параграф до таблицы.

            if (  0 === this.CurPos.ContentPos && Item.Cursor_IsStart(true) )
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field, ++this.IdCounter );
                this.Internal_Content_Add( 0, NewParagraph );

                this.CurPos.ContentPos = 0;
                this.Recalculate();
            }
            else
                Item.Add_NewParagraph();
        }
    },

    Add_FlowImage : function(W, H, Img)
    {

    },

    Add_InlineImage : function(W, H, Img)
    {
        if ( this.CurPos.Type === docpostype_FlowObjects )
            return;

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            var Pict = new GraphicPicture( Img );
            var Drawing = new ParaDrawing( ++this.IdCounter, W, H, Pict, this.DrawingDocument, this );
            this.DrawingObjects.Add( Drawing );
            this.Paragraph_Add( Drawing );
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Add_InlineImage( W, H, Img );
        }

        return;
    },

    Add_InlineObject : function(Obj)
    {
        Obj.Id = ++this.IdCounter;
        Obj.DocumentContent = this;
        Obj.DrawingDocument = this.DrawingDocument;

        if ( ( true === this.Selection.Use && this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.EndPos].GetType() ) || ( false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType() ) )
        {
            if ( true === this.Selection.Use )
                this.Content[this.Selection.StartPos].Add_InlineObject( Obj );
            else
            {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;
                this.Content[this.CurPos.ContentPos].Add_InlineObject( Obj );
            }
        }
        else
        {
            this.DrawingObjects.Add( Obj );
            this.Paragraph_Add( Obj );
            this.Select_DrawingObject( Obj.Id );
        }
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
        if ( this.CurPos.Type === docpostype_FlowObjects )
            return;

        if ( this.CurPos.ContentPos < 0 )
            return false;

        // Добавляем таблицу
        var Item = this.Content[this.CurPos.ContentPos];

        // Если мы внутри параграфа, тогда разрываем его и на месте разрыва добавляем таблицу.
        // А если мы внутри таблицы, тогда добавляем таблицу внутрь текущей таблицы.
        switch ( Item.GetType() )
        {
            case type_Paragraph:
            {
                // Создаем новую таблицу
                var W = 0;
                if ( true === this.Is_TableCellContent() )
                    W = this.XLimit - this.X;
                else
                    W = ( this.XLimit - this.X + 2 * 1.9 );

                var Grid = [];

                for ( var Index = 0; Index < Cols; Index++ )
                    Grid[Index] = W / Cols;

                var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, this.X, this.YLimit, Rows, Cols, Grid, ++this.IdCounter );

                // Проверим позицию в текущем параграфе
                if ( true === Item.Cursor_IsEnd() )
                {
                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );
                    this.CurPos.ContentPos++;
                    this.Recalculate();
                }
                else
                {
                    // Создаем новый параграф
                    var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field, ++this.IdCounter );
                    Item.Split( NewParagraph );

                    // Добавляем новый параграф
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );

                    this.CurPos.ContentPos++;

                    this.Recalculate();
                }

                break;
            }

            case type_Table:
            {
                Item.Add_InlineTable( Cols, Rows );
                break;
            }
        }
    },

    Add_InlineTable2 : function(Table)
    {
        if ( ( true === this.Selection.Use && this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.EndPos].GetType() ) || ( false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType() ) )
        {
            if ( true === this.Selection.Use )
            {
                this.Selection.Start = false;
                this.Selection.Use   = false;
                this.CurPos.ContentPos = this.Selection.StartPos;
                this.Content[this.Selection.StartPos].Add_InlineTable2( Table );
            }
            else
            {
                this.Selection.Use   = false;
                this.Content[this.CurPos.ContentPos].Add_InlineTable2( Table );
            }
        }
        else
        {
            Table.Set_Parent( this );
            Table.Set_Id( ++this.IdCounter );

            var Item = this.Content[this.CurPos.ContentPos];
            // Проверим позицию в текущем параграфе
            if ( true === Item.Cursor_IsEnd() )
            {
                // Выставляем курсор в начало таблицы
                Table.Cursor_MoveToStartPos();
                this.Internal_Content_Add( this.CurPos.ContentPos + 1, Table );
                this.CurPos.ContentPos++;
                this.Recalculate();
            }
            else
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field, ++this.IdCounter );
                Item.Split( NewParagraph );

                // Добавляем новый параграф
                this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

                // Выставляем курсор в начало таблицы
                Table.Cursor_MoveToStartPos();
                this.Internal_Content_Add( this.CurPos.ContentPos + 1, Table );
                this.CurPos.ContentPos++;
                this.Recalculate();
            }
        }
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
                if ( type_Table === Item.GetType() )
                    Item.Paragraph_ClearFormatting();
                else if ( type_Paragraph === Item.GetType() )
                {
                    Item.Clear_Formatting();
                    Item.Clear_TextFormatting();
                }
                Item.Set_ApplyToAll(false);
            }

            return;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return null;

        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                    return null;
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Table.Paragraph_ClearFormatting();
            }

            return null;
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
                    if ( type_Table === Item.GetType() )
                        Item.Paragraph_ClearFormatting();
                    else if ( type_Paragraph === Item.GetType() )
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
            if ( type_Table === Item.GetType() )
                Item.Paragraph_ClearFormatting();
            else if ( type_Paragraph === Item.GetType() )
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

            this.Pages[0].FlowObjects = new FlowObjects(this, 0);

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
                else if ( type_Table == StartType )
                {
                    // Нам нужно удалить все выделенные строки в таблице
                    bStartEmpty = !(this.Content[StartPos].Row_Remove2());
                }

                if ( type_Paragraph == EndType )
                {
                    // Удаляем выделенную часть параграфа
                    this.Content[EndPos].Remove( 1, true );
                    bEndEmpty = this.Content[EndPos].IsEmpty()
                }
                else if ( type_Table == EndType )
                {
                    // Нам нужно удалить все выделенные строки в таблице
                    bEndEmpty = !(this.Content[EndPos].Row_Remove2());
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
                    else if ( type_Table == StartType )
                    {
                        // У нас обязательно есть элемент после таблицы (либо снова таблица, либо параграф)
                        // Встаем в начало следующего элемента.
                        this.CurPos.ContentPos = StartPos + 1;
                        this.Content[StartPos + 1].Cursor_MoveToStartPos();
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
                        else if ( true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Table != this.Content[this.CurPos.ContentPos - 1].GetType() )
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
            else if ( type_Table == this.Content[this.CurPos.ContentPos].GetType() )
            {
                // Remove сам вызывет команду Recalculate
                this.Content[this.CurPos.ContentPos].Remove( Count, bOnlyText );
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

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    History.Create_NewPoint();
                    var FlowImage = this.Selection.Data.FlowObject;
                    FlowImage.Set_Position( FlowImage.X - 1, FlowImage.Y );
                    FlowImage.Update();

                    this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                    this.Recalculate();
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Cursor_MoveLeft( AddToSelect );
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
                        else if ( type_Table == Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var LastRow = Item.Content[Item.Content.length - 1];

                                // Нам нужно выделить последний ряд таблицы
                                Item.Selection.Use  = true;
                                Item.Selection.Type = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = { Row : LastRow.Index, Cell : LastRow.Get_CellsCount() - 1 };
                                Item.Selection.EndPos.Pos   = { Row : LastRow.Index, Cell : 0 };
                                Item.CurCell = LastRow.Get_Cell( 0 );
                                Item.Selection.Data = new Array();

                                for ( var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++ )
                                {
                                    Item.Selection.Data.push( { Cell : CellIndex, Row : LastRow.Index } );
                                }
                            }
                            else
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
                        else if ( type_Table == Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var LastRow = Item.Content[Item.Content.length - 1];

                                // Нам нужно выделить последний ряд таблицы
                                Item.Selection.Use  = true;
                                Item.Selection.Type = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = { Row : LastRow.Index, Cell : LastRow.Get_CellsCount() - 1 };
                                Item.Selection.EndPos.Pos   = { Row : LastRow.Index, Cell : 0 };
                                Item.CurCell = LastRow.Get_Cell( 0 );
                                Item.Selection.Data = new Array();

                                for ( var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++ )
                                {
                                    Item.Selection.Data.push( { Cell : CellIndex, Row : LastRow.Index } );
                                }
                            }
                            else
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
                        else if ( type_Table === Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var FirstRow = Item.Content[0];

                                // Нам нужно выделить первый ряд таблицы
                                Item.Selection.Use  = true;
                                Item.Selection.Type = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = { Row : 0, Cell : 0 };
                                Item.Selection.EndPos.Pos   = { Row : 0, Cell : FirstRow.Get_CellsCount() - 1 };
                                Item.CurCell = FirstRow.Get_Cell( FirstRow.Get_CellsCount() - 1 );
                                Item.Selection.Data = new Array();

                                for ( var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++ )
                                {
                                    Item.Selection.Data.push( { Cell : CellIndex, Row : 0 } );
                                }
                            }
                            else
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
                        else if ( type_Table === Item.GetType() )
                        {
                            if ( false === Item.Is_SelectionUse() )
                            {
                                var FirstRow = Item.Content[0];

                                // Нам нужно выделить первый ряд таблицы
                                Item.Selection.Use  = true;
                                Item.Selection.Type = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = { Row : 0, Cell : 0 };
                                Item.Selection.EndPos.Pos   = { Row : 0, Cell : FirstRow.Get_CellsCount() - 1 };
                                Item.CurCell = FirstRow.Get_Cell( FirstRow.Get_CellsCount() - 1 );
                                Item.Selection.Data = new Array();

                                for ( var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++ )
                                {
                                    Item.Selection.Data.push( { Cell : CellIndex, Row : 0 } );
                                }
                            }
                            else
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphAlign( Align );
                    Item.TurnOn_RecalcEvent();
                }
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphAlign( Align );
                    Item.TurnOn_RecalcEvent();
                }
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
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphAlign( Align );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphSpacing( Spacing );
                    Item.TurnOn_RecalcEvent();
                }
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphSpacing( Spacing );
                    Item.TurnOn_RecalcEvent();
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
            Item.Set_Spacing( Spacing );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphSpacing( Spacing );
        }
    },

    Set_ParagraphIndent : function(Ind)
    {
        if ( true === this.ApplyToAll )
        {
            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if ( type_Paragraph == Item.GetType() )
                {
                    var NumPr = null;
                    if ( "number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && null != ( NumPr = Item.Numbering_Get() ) )
                    {
                        if ( Ind.ChangeLevel > 0 )
                            Item.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
                        else
                            Item.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
                    }
                    else
                    {
                        Item.Set_Ind( Ind );
                    }
                }
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphIndent( Ind );
                    Item.TurnOn_RecalcEvent();
                }
                Item.Set_ApplyToAll(false);
            }

            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphIndent) )
                this.Selection.Data.FlowObject.Set_ParagraphIndent( Ind );

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
                {
                    var NumPr = null;
                    if ( "number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && null != ( NumPr = Item.Numbering_Get() ) )
                    {
                        if ( Ind.ChangeLevel > 0 )
                            Item.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
                        else
                            Item.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
                    }
                    else
                    {
                        Item.Set_Ind( Ind );
                    }
                }
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphIndent( Ind );
                    Item.TurnOn_RecalcEvent();
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
            var NumPr = null;
            if ( "number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && null != ( NumPr = Item.Numbering_Get() ) )
            {
                if ( Ind.ChangeLevel > 0 )
                    Item.Numbering_Add( NumPr.NumId, Math.min( 8, NumPr.Lvl + 1 ) );
                else
                    Item.Numbering_Add( NumPr.NumId, Math.max( 0, NumPr.Lvl - 1 ) );
            }
            else
            {
                Item.Set_Ind( Ind );
            }

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();

            this.Interface_Update_ParaPr();
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphIndent( Ind );
        }
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        if ( true === this.ApplyToAll )
        {
            // TODO : реализовать
            return;
        }




        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphNumbering) )
                this.Selection.Data.FlowObject.Set_ParagraphNumbering( NumInfo );

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
            else if ( this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
            {
                this.Content[this.Selection.StartPos].Set_ParagraphNumbering( NumInfo );
                return true;
            }

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if ( EndPos < StartPos )
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            if ( NumInfo.SubType < 0 )
            {
                // Убираем список из всех параграфов попавших в селект
                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    var par = this.Content[Index];
                    if ( type_Paragraph == par.GetType() )
                    {
                        par.bullet = new CBullet();
                        par.bullet.bulletType = new CBulletType();
                        par.bullet.bulletType.type = BULLET_TYPE_BULLET_NONE;
                    }
                }
                this.RecalculateNumbering();
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            else
            {
                switch( NumInfo.Type )
                {
                    case 0: // Bullet
                    {
                        if ( 0 === NumInfo.SubType )
                        {
                            // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список маркированный)
                            // Проверяем предыдущий элемент
                            var Prev = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                            {
                                var PrevNumPr = Prev.Numbering_Get();
                                if ( null != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet ) )
                                {
                                    if(Prev.bullet!=null)
                                    {
                                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                                        {
                                            if ( type_Paragraph === this.Content[Index].GetType() )
                                            {
                                                this.Content[Index].bullet = Prev.bullet.createDuplicate();
                                            }
                                        }
                                        this.RecalculateNumbering();
                                        this.ContentLastChangePos = StartPos;
                                        this.Recalculate();
                                        return;
                                    }
                                }
                                else
                                {
                                    return;
                                }
                            }
                            else
                            {
                                return;
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                            if ( null === NumId )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;

                                this.Numbering.Get_AbstractNum( NumId ).Create_Default_Bullet();
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                            // а у тех которые содержали, мы уровень не меняем
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var OldNumPr = null;

                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    if ( null != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                        this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                    else
                                        this.Content[Index].Numbering_Add( NumId, NumLvl );
                                }
                                else if ( type_Table == this.Content[Index].GetType() )
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }
                        else
                        {
                            // Для начала пробежимся по отмеченным параграфам и узнаем, есть ли
                            // среди них параграфы со списками разных уровней.
                            var bDiffLvl = false;
                            var bDiffId  = false;
                            var PrevLvl = null;
                            var PrevId  = null;
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var NumPr = null;
                                if ( type_Paragraph === this.Content[Index].GetType() && null != ( NumPr = this.Content[Index].Numbering_Get() ) )
                                {
                                    if ( null === PrevLvl )
                                        PrevLvl = NumPr.Lvl;

                                    if ( null === PrevId )
                                        PrevId  = NumPr.NumId;

                                    if ( PrevId != NumPr.NumId )
                                        bDiffId = true;

                                    if ( PrevLvl != NumPr.Lvl )
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                                else if ( type_Paragraph === this.Content[Index].GetType() && null === NumPr )
                                {
                                    bDiffLvl = true;
                                    break;
                                }
                            }

                            // 1. Если у нас есть параграфы со списками разных уровней, тогда мы
                            //    делаем стандартный маркированный список, у которого первый(нулевой)
                            //    уровень изменен на тот который задан через NumInfo.SubType
                            // 2. Если все параграфы содержат списки одного уровня.
                            //    2.1 Если у всех списков одинаковый Id, тогда мы создаем
                            //        копию текущего списка и меняем в нем текущий уровень
                            //        на тот, который задан через NumInfo.SubType
                            //    2.2 Если у списков разные Id, тогда мы создаем стандартный
                            //        маркированный список с измененным уровнем (равным текущему),
                            //        на тот, который прописан в NumInfo.Subtype

                            var LvlText   = "";
                            var LvlTextPr =
                            {
                                FontFamily : { Name : "Times New Roman", Index : -1 }
                            };

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    LvlText = String.fromCharCode( 0x00B7 );
                                    LvlTextPr.FontFamily = { Name : "Symbol", Index : -1 };
                                    break;
                                }
                                case 2:
                                {
                                    LvlText = "o";
                                    LvlTextPr.FontFamily = { Name : "Courier New", Index : -1 };
                                    break;
                                }
                                case 3:
                                {
                                    LvlText = String.fromCharCode( 0x00A7 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 4:
                                {
                                    LvlText = String.fromCharCode( 0x0076 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 5:
                                {
                                    LvlText = String.fromCharCode( 0x00D8 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 6:
                                {
                                    LvlText = String.fromCharCode( 0x00FC );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                            }

                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    this.Content[Index].bullet = new CBullet();
                                    this.Content[Index].bullet = new CBullet();
                                }
                            }
                            this.RecalculateNumbering();
                            this.Recalculate();
                            return;

                            var NumId = null;
                            if ( true === bDiffLvl )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet( 0, LvlText, LvlTextPr );
                            }
                            else if ( true === bDiffId || true != this.Numbering.Check_Format( PrevId, PrevLvl, numbering_numfmt_Bullet )  )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet( PrevLvl, LvlText, LvlTextPr );
                            }
                            else
                            {
                                NumId = this.Numbering.Create_AbstractNum();
                                var OldAbstractNum = this.Numbering.Get_AbstractNum( PrevId );
                                var NewAbstractNum = this.Numbering.Get_AbstractNum( NumId );

                                NewAbstractNum.Copy( OldAbstractNum );
                                NewAbstractNum.Set_Lvl_Bullet( PrevLvl, LvlText, LvlTextPr );
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем 0,
                            // а у тех которые содержали, мы уровень не меняем
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var OldNumPr = null;
                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    if ( null != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                        this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                    else
                                        this.Content[Index].Numbering_Add( NumId, 0 );
                                }
                                else if ( type_Table == this.Content[Index].GetType() )
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }

                        break;
                    }
                    case 1: // Numbered
                    {
                        if ( 0 === NumInfo.SubType )
                        {
                            // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список нумерованный)

                            // Проверяем предыдущий элемент
                            var Prev = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                            {
                                var PrevNumPr = Prev.Numbering_Get();
                                if ( null != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal ) )
                                {
                                    NumId  = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                            if ( null === NumId )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;

                                this.Numbering.Get_AbstractNum( NumId ).Create_Default_Numbered();
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                            // а у тех которые содержали, мы уровень не меняем
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var OldNumPr = null;

                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    if ( null != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                        this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                    else
                                        this.Content[Index].Numbering_Add( NumId, NumLvl );
                                }
                                else if ( type_Table === this.Content[Index].GetType() )
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }
                        else
                        {
                            // Для начала пробежимся по отмеченным параграфам и узнаем, есть ли
                            // среди них параграфы со списками разных уровней.
                            var bDiffLvl = false;
                            var bDiffId  = false;
                            var PrevLvl = null;
                            var PrevId  = null;
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var NumPr = null;
                                if ( type_Paragraph === this.Content[Index].GetType() && null != ( NumPr = this.Content[Index].Numbering_Get() ) )
                                {
                                    if ( null === PrevLvl )
                                        PrevLvl = NumPr.Lvl;

                                    if ( null === PrevId )
                                        PrevId  = NumPr.NumId;

                                    if ( PrevId != NumPr.NumId )
                                        bDiffId = true;

                                    if ( PrevLvl != NumPr.Lvl )
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                                else if ( type_Paragraph === this.Content[Index].GetType() && null === NumPr )
                                {
                                    bDiffLvl = true;
                                    break;
                                }
                            }

                            // 1. Если у нас есть параграфы со списками разных уровней, тогда мы
                            //    делаем стандартный нумерованный список, у которого первый(нулевой)
                            //    уровень изменен на тот который задан через NumInfo.SubType
                            // 2. Если все параграфы содержат списки одного уровня.
                            //    2.1 Если у всех списков одинаковый Id, тогда мы создаем
                            //        копию текущего списка и меняем в нем текущий уровень
                            //        на тот, который задан через NumInfo.SubType
                            //    2.2 Если у списков разные Id, тогда мы создаем стандартный
                            //        нумерованный список с измененным уровнем (равным текущему),
                            //        на тот, который прописан в NumInfo.Subtype

                            var AbstractNum = null;
                            var ChangeLvl   = 0;

                            var NumId = null;
                            if ( true === bDiffLvl )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = 0;
                            }
                            else if ( true === bDiffId || true != this.Numbering.Check_Format( PrevId, PrevLvl, numbering_numfmt_Decimal ) )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = PrevLvl;
                            }
                            else
                            {
                                NumId = this.Numbering.Create_AbstractNum();
                                var OldAbstractNum = this.Numbering.Get_AbstractNum( PrevId );
                                AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Copy( OldAbstractNum );
                                ChangeLvl = PrevLvl;
                            }

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    AbstractNum.Set_Lvl_Numbered_2( ChangeLvl );
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Set_Lvl_Numbered_1( ChangeLvl );
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Set_Lvl_Numbered_5( ChangeLvl );
                                    break;
                                }
                                case 4:
                                {
                                    AbstractNum.Set_Lvl_Numbered_6( ChangeLvl );
                                    break;
                                }
                                case 5:
                                {
                                    AbstractNum.Set_Lvl_Numbered_7( ChangeLvl );
                                    break;
                                }
                                case 6:
                                {
                                    AbstractNum.Set_Lvl_Numbered_8( ChangeLvl );
                                    break;
                                }
                                case 7:
                                {
                                    AbstractNum.Set_Lvl_Numbered_9( ChangeLvl );
                                    break;
                                }
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем 0,
                            // а у тех которые содержали, мы уровень не меняем
                            for ( var Index = StartPos; Index <= EndPos; Index++ )
                            {
                                var OldNumPr = null;

                                if ( type_Paragraph === this.Content[Index].GetType() )
                                {
                                    if ( null != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                        this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                    else
                                        this.Content[Index].Numbering_Add( NumId, 0 );
                                }
                                else if ( type_Table === this.Content[Index].GetType() )
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }

                        break;
                    }

                    case 2: // Multilevel
                    {
                        // Создаем новый многоуровневый список, соответствующий NumInfo.SubType
                        var NumId = this.Numbering.Create_AbstractNum();
                        var AbstractNum = this.Numbering.Get_AbstractNum( NumId );

                        switch ( NumInfo.SubType )
                        {
                            case 1:
                            {
                                AbstractNum.Create_Default_Multilevel_1();
                                break;
                            }
                            case 2:
                            {
                                AbstractNum.Create_Default_Multilevel_2();
                                break;
                            }
                            case 3:
                            {
                                AbstractNum.Create_Default_Multilevel_3();
                                break;
                            }
                        }

                        // Параграфы, которые не содержали списка у них уровень выставляем 0,
                        // а у тех которые содержали, мы уровень не меняем
                        for ( var Index = StartPos; Index <= EndPos; Index++ )
                        {
                            var OldNumPr = null;
                            if ( type_Paragraph === this.Content[Index].GetType() )
                            {
                                if ( null != ( OldNumPr = this.Content[Index].Numbering_Get() ) )
                                    this.Content[Index].Numbering_Add( NumId, OldNumPr.Lvl );
                                else
                                    this.Content[Index].Numbering_Add( NumId, 0 );
                            }
                            else if ( type_Table === this.Content[Index].GetType() )
                            {
                                this.Content[Index].TurnOff_RecalcEvent();
                                this.Content[Index].Set_ParagraphNumbering( NumInfo );
                                this.Content[Index].TurnOn_RecalcEvent();
                            }
                        }

                        break;
                    }
                }
            }

            // Нам нужно пересчитать все изменения, начиная с элемента, предшевствующего
            // первому попавшему в селект.
            this.ContentLastChangePos = StartPos - 1;
            this.Recalculate();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            var FirstChange = 0;

            if ( NumInfo.SubType < 0 )
            {
                // Убираем список у параграфа
                Item.bullet = new CBullet();
                Item.bullet.bulletType.type = BULLET_TYPE_BULLET_NONE;
                FirstChange = this.CurPos.ContentPos - 1;
            }
            else
            {
                switch( NumInfo.Type )
                {
                    case 0: // Bullet
                    {
                        if ( 0 === NumInfo.SubType )
                        {
                            // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список маркированный)

                            // Проверяем предыдущий элемент
                            var Prev = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                            {
                                if(Prev.bullet)
                                {
                                    Item.bullet = Prev.bullet.createDuplicate();
                                }
                               /* var PrevNumPr = Prev.Numbering_Get();
                                if ( null != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet ) )
                                {
                                    NumId  = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }  */
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                           /* if ( null === NumId )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;

                                this.Numbering.Get_AbstractNum( NumId ).Create_Default_Bullet();
                            }

                            if ( type_Paragraph === Item.GetType() )
                            {
                                var OldNumPr = Item.Numbering_Get();
                                if (null != OldNumPr)
                                    Item.Numbering_Add( NumId, OldNumPr.Lvl );
                                else
                                    Item.Numbering_Add( NumId, NumLvl );
                            }
                            else
                                Item.Numbering_Add( NumId, NumLvl );                               */

                            // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                            FirstChange = this.CurPos.ContentPos - 1;
                        }
                        else
                        {
                            // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                            //    список, и добавляем его к данному параграфу
                            // 2. Если данный параграф содержит список, тогда мы у данного списка
                            //    изменяем уровень(соответствующий данному параграфу) на тот,
                            //    который определен в NumInfo.Subtype

                            var LvlText   = "";
                            var LvlTextPr =
                            {
                                FontFamily : { Name : "Times New Roman", Index : -1 },
                                FontSize   : 10,
                                Bold       : false,
                                Italic     : false
                            };

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    LvlText = String.fromCharCode( 0x00B7 );
                                    LvlTextPr.FontFamily = { Name : "Symbol", Index : -1 };
                                    break;
                                }
                                case 2:
                                {
                                    LvlText = "o";
                                    LvlTextPr.FontFamily = { Name : "Courier New", Index : -1 };
                                    break;
                                }
                                case 3:
                                {
                                    LvlText = String.fromCharCode( 0x00A7 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 4:
                                {
                                    LvlText = String.fromCharCode( 0x0076 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 5:
                                {
                                    LvlText = String.fromCharCode( 0x00D8 );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                                case 6:
                                {
                                    LvlText = String.fromCharCode( 0x00FC );
                                    LvlTextPr.FontFamily = { Name : "Wingdings", Index : -1 };
                                    break;
                                }
                            }

                            Item.bullet= new CBullet();
                            Item.bullet.bulletType.type = BULLET_TYPE_BULLET_CHAR;
                            Item.bullet.bulletType.Char = LvlText;

                           /* var NumPr = null;
                            if ( null != ( NumPr = Item.Numbering_Get() ) )
                            {
                                var AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                AbstractNum.Set_Lvl_Bullet( NumPr.Lvl, LvlText, LvlTextPr );

                                // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                // нем записана

                                // Нам нужно пересчитать все изменения, начиная с первого
                                // элемента, использующего данную нумерацию
                                FirstChange = 0;
                                var bFirstChange = false;
                                for ( var Index = 0; Index < this.Content.length; Index++ )
                                {
                                    if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                    {
                                        if ( false === bFirstChange )
                                        {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            }
                            else
                            {
                                var NumId = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet( 0, LvlText, LvlTextPr );

                                Item.Numbering_Add( NumId, 0 );

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }         */
                        }

                        break;
                    }
                    case 1: // Numbered
                    {
                        if ( 0 === NumInfo.SubType )
                        {
                            // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список нумерованный)

                            // Проверяем предыдущий элемент
                            var Prev = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                            {
                                if(Prev.bullet)
                                {
                                    Item.bullet = Prev.bullet.createDuplicate();
                                }
                                /*var PrevNumPr = Prev.Numbering_Get();
                                if ( null != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal ) )
                                {
                                    NumId  = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }     */
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                           /* if ( null === NumId )
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;

                                this.Numbering.Get_AbstractNum( NumId ).Create_Default_Numbered();
                            }

                            if ( type_Paragraph === Item.GetType() )
                            {
                                var OldNumPr = Item.Numbering_Get();
                                if( null != ( OldNumPr ) )
                                    Item.Numbering_Add( NumId, OldNumPr.Lvl );
                                else
                                    Item.Numbering_Add( NumId, NumLvl );
                            }
                            else
                                Item.Numbering_Add( NumId, NumLvl );              */

                            // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                            FirstChange = this.CurPos.ContentPos - 1;
                        }
                        else
                        {
                            // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                            //    список, и добавляем его к данному параграфу
                            // 2. Если данный параграф содержит список, тогда мы у данного списка
                            //    изменяем уровень(соответствующий данному параграфу) на тот,
                            //    который определен в NumInfo.Subtype

                            var NumPr = null;
                            var AbstractNum = null;
                            var ChangeLvl = 0;
                            if ( null != ( NumPr = Item.Numbering_Get() ) )
                            {
                                AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                                ChangeLvl = NumPr.Lvl;
                            }
                            else
                            {
                                var NumId = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                                ChangeLvl = 0;
                            }

                            switch ( NumInfo.SubType )
                            {
                                case 1:
                                {
                                    AbstractNum.Set_Lvl_Numbered_2( ChangeLvl );
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Set_Lvl_Numbered_1( ChangeLvl );
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Set_Lvl_Numbered_5( ChangeLvl );
                                    break;
                                }
                                case 4:
                                {
                                    AbstractNum.Set_Lvl_Numbered_6( ChangeLvl );
                                    break;
                                }
                                case 5:
                                {
                                    AbstractNum.Set_Lvl_Numbered_7( ChangeLvl );
                                    break;
                                }
                                case 6:
                                {
                                    AbstractNum.Set_Lvl_Numbered_8( ChangeLvl );
                                    break;
                                }
                                case 7:
                                {
                                    AbstractNum.Set_Lvl_Numbered_9( ChangeLvl );
                                    break;
                                }
                            }


                            if ( null != NumPr )
                            {
                                // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                // нем записана.

                                // Нам нужно пересчитать все изменения, начиная с первого
                                // элемента, использующего данную нумерацию
                                FirstChange = 0;
                                var bFirstChange = false;
                                for ( var Index = 0; Index < this.Content.length; Index++ )
                                {
                                    if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId, NumPr.Lvl ) )
                                    {
                                        if ( false === bFirstChange )
                                        {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            }
                            else
                            {
                                Item.Numbering_Add( NumId, 0 );

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }

                            Item.bullet = new CBullet();
                            Item.bullet.bulletType = new CBulletType();
                            Item.bullet.bulletType.type = BULLET_TYPE_BULLET_AUTONUM;

                        }

                        break;
                    }

                    case 2: // Multilevel
                    {
                        // 1. Если у параграфа нет списка, тогда создаем новый список,
                        //    и добавляем его к параграфу.
                        // 2. Если у параграфа есть список, тогда изменяем этот многоуровневый
                        //    список на заданный через NumInfo.SubType.

                        var NumId = null;
                        var NumPr = null;
                        var AbstractNum = null;
                        if ( null != ( NumPr = Item.Numbering_Get() ) )
                        {
                            AbstractNum = this.Numbering.Get_AbstractNum( NumPr.NumId );
                        }
                        else
                        {
                            NumId = this.Numbering.Create_AbstractNum();
                            AbstractNum = this.Numbering.Get_AbstractNum( NumId );
                        }

                        switch ( NumInfo.SubType )
                        {
                            case 1:
                            {
                                AbstractNum.Create_Default_Multilevel_1();
                                break;
                            }
                            case 2:
                            {
                                AbstractNum.Create_Default_Multilevel_2();
                                break;
                            }
                            case 3:
                            {
                                AbstractNum.Create_Default_Multilevel_3();
                                break;
                            }
                        }

                        if ( null != NumPr )
                        {
                            // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                            // нем записана.

                            // Нам нужно пересчитать все изменения, начиная с первого
                            // элемента, использующего данную нумерацию
                            FirstChange = 0;
                            var bFirstChange = false;
                            for ( var Index = 0; Index < this.Content.length; Index++ )
                            {
                                if ( true === this.Content[Index].Numbering_IsUse( NumPr.NumId ) )
                                {
                                    if ( false === bFirstChange )
                                    {
                                        FirstChange = Index;
                                        bFirstChange = true;
                                    }
                                    this.Content[Index].Recalc_CompileParaPr();
                                }
                            }
                        }
                        else
                        {
                            Item.Numbering_Add( NumId, 0 );
                            // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                            FirstChange = this.CurPos.ContentPos - 1;
                        }

                        break;
                    }
                }

            }

            this.ContentLastChangePos = FirstChange;
            this.RecalculateNumbering();
            this.Recalculate();
            this.Interface_Update_ParaPr();
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphNumbering( NumInfo );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphShd( Shd );
                    Item.TurnOn_RecalcEvent();
                }
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
                        else if ( type_Table == Item.GetType() )
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphShd( Shd );
                            Item.TurnOn_RecalcEvent();
                        }
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
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphShd( Shd );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphStyle( Name );
                    Item.TurnOn_RecalcEvent();
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphStyle( Name );
                    Item.TurnOn_RecalcEvent();
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
        else if ( type_Table == Item.GetType() )
        {
            Item.TurnOff_RecalcEvent();
            Item.Set_ParagraphStyle( Name );
            Item.TurnOn_RecalcEvent();

            // Нам нужно пересчитать все изменения, начиная с предыдушего элемента
            this.ContentLastChangePos = Math.max( this.CurPos.ContentPos - 1, 0 );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphTabs( Tabs );
                    Item.TurnOn_RecalcEvent();
                }
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphTabs( Tabs );
                    Item.TurnOn_RecalcEvent();
                }
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
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphTabs( Tabs );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphContextualSpacing( Value );
                    Item.TurnOn_RecalcEvent();
                }
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphContextualSpacing( Value );
                    Item.TurnOn_RecalcEvent();
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
            Item.Set_ContextualSpacing( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphContextualSpacing( Value );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphKeepLines( Value );
                    Item.TurnOn_RecalcEvent();
                }
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphKeepLines( Value );
                    Item.TurnOn_RecalcEvent();
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
            Item.Set_KeepLines( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphKeepLines( Value );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphBorders( Borders );
                    Item.TurnOn_RecalcEvent();
                }
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
                        else if ( type_Table == Item.GetType() )
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphBorders( Borders );
                            Item.TurnOn_RecalcEvent();
                        }
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
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphBorders( Borders );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Paragraph_IncDecFontSize( bIncrease );
                    Item.TurnOn_RecalcEvent();
                }
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
                        else if ( type_Table == Item.GetType() )
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Paragraph_IncDecFontSize( bIncrease );
                            Item.TurnOn_RecalcEvent();
                        }
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
        else if ( type_Table == Item.GetType() )
        {
            Item.Paragraph_IncDecFontSize( bIncrease );
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
                else if ( type_Table == Item.GetType() )
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Paragraph_IncDecIndent( bIncrease );
                    Item.TurnOn_RecalcEvent();
                }
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
                        else if ( type_Table == Item.GetType() )
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Paragraph_IncDecIndent( bIncrease );
                            Item.TurnOn_RecalcEvent();
                        }
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
        else if ( type_Table == Item.GetType() )
        {
            Item.Paragraph_IncDecIndent( bIncrease );
        }
    },

    Set_ImageProps : function(Props)
    {
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Drawing = this.Selection.Data.DrawingObject;

            // Внутри ячейки нельзя менять "inline" картинки на "flow"
            if ( true === this.Parent.Is_Cell() )
            {
                Props.WrappingStyle = c_oAscWrapStyle.Inline;
            }

            // меняем с inline картинки на float
            if ( "undefined" != typeof( Props.WrappingStyle ) && null != Props.WrappingStyle && c_oAscWrapStyle.Inline != Props.WrappingStyle )
            {
                // Удаляем Inline картинку
                var ObjId = Drawing.Get_Id();
                this.Content[this.CurPos.ContentPos].Remove_DrawingObject( ObjId );
                this.DrawingObjects.Remove_ById( ObjId );
                this.Remove_DrawingObjectSelection();

                // Добавляем данную картинку как "float"
                var X = Drawing.X;
                var Y = Drawing.Y;

                var W = Drawing.W;
                var H = Drawing.H;

                var Img = Drawing.GraphicObj.Img;

                if ( "undefined" != typeof( Props.Width ) && null != Props.Width )
                    W = Props.Width;

                if ( "undefined" != typeof( Props.Height ) && null != Props.Height )
                    H = Props.Height;

                if ( "undefined" != typeof( Props.Position ) && null != Props.Position )
                {
                    if ( "undefined" != typeof( Props.Position.X ) && null != Props.Position.X )
                        X = Props.Position.X;

                    if ( "undefined" != typeof( Props.Position.Y ) && null != Props.Position.Y )
                        Y = Props.Position.Y;
                }

                var Paddings =
                {
                    Left   : 3.2,
                    Right  : 3.2,
                    Top    : 0,
                    Bottom : 0
                };

                if ( "undefined" != typeof( Props.Paddings ) && null != Props.Paddings )
                {
                    if ( "undefined" != typeof( Props.Paddings.Left ) && null != Props.Paddings.Left )
                        Paddings.Left = Props.Paddings.Left;

                    if ( "undefined" != typeof( Props.Paddings.Right ) && null != Props.Paddings.Right )
                        Paddings.Right = Props.Paddings.Right;

                    if ( "undefined" != typeof( Props.Paddings.Bottom ) && null != Props.Paddings.Bottom )
                        Paddings.Bottom = Props.Paddings.Bottom;

                    if ( "undefined" != typeof( Props.Paddings.Top ) && null != Props.Paddings.Top )
                        Paddings.Top = Props.Paddings.Top;
                }


                var newFlowImage = new FlowImage( ++this.IdCounter, X, Y, W, H, Img, this.DrawingDocument, this.Get_StartPage_Absolute() + this.CurPage, this );
                newFlowImage.Paddings = Paddings;
                var FlowPos = this.Pages[this.CurPage].FlowObjects.Add( newFlowImage );

                // Нам нужно пересчитать все изменения, начиная с текущей страницы.
                this.ContentLastChangePos = Math.min( this.Pages[this.CurPage].Pos, this.CurPos.ContentPos );
                this.Recalculate();

                // Фокусим сам элемент
                this.CurPos.Type       = docpostype_FlowObjects;
                this.CurPos.ContentPos = FlowPos;

                this.DrawingDocument.SetCurrentPage( this.Get_StartPage_Absolute() + this.CurPage );

                this.Selection.Start = true;
                this.Selection.Use   = true;
                this.Selection.Flag  = selectionflag_Common;

                this.Selection.Data  =
                {
                    PageNum    : this.CurPage,         // Номер страницы, на которой находится выделенный объект
                    FlowObject : newFlowImage,      // Указатель на выделенный объект
                    Pos        : FlowPos            // Номер выделенного объекта в списке объектов страницы
                };

                this.Selection.Data.FlowObject.Focus( X, Y );
            }
            else
            {
                if ( "undefined" != typeof( Props.Width ) && null != Props.Width )
                    Drawing.Update_Size( Props.Width, Drawing.H );

                if ( "undefined" != typeof( Props.Height ) && null != Props.Height )
                    Drawing.Update_Size( Drawing.W, Props.Height );

                if ( "undefined" != typeof( Props.ImageUrl ) && null != Props.ImageUrl )
                    Drawing.Set_Url( Props.ImageUrl );

                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate( true );
            }
        }
        else if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var FlowObject = this.Pages[this.CurPage].FlowObjects.Get_ByIndex( this.CurPos.ContentPos );
            if ( flowobject_Image != FlowObject.Get_Type() )
            {
                if ( flowobject_Table === FlowObject.Get_Type() )
                {
                    return FlowObject.Table.Set_ImageProps(Props);
                }
                return;
            }

            // меняем картинку с float на inline
            if ( "undefined" != typeof( Props.WrappingStyle ) && null != Props.WrappingStyle && c_oAscWrapStyle.Flow != Props.WrappingStyle )
            {
                var W = FlowObject.W;
                var H = FlowObject.H;

                var Img = FlowObject.Img;

                if ( "undefined" != typeof( Props.Width ) && null != Props.Width )
                    W = Props.Width;

                if ( "undefined" != typeof( Props.Height ) && null != Props.Height )
                    H = Props.Height;

                var Pict = new GraphicPicture( Img );
                var Drawing = new ParaDrawing( ++this.IdCounter, W, H, Pict, this.DrawingDocument, this );
                this.DrawingObjects.Add( Drawing );

                var OldPos = this.Pages[this.CurPage].Pos;

                // Перемещаем курсор в новую точку, и вставляем объект
                var X = FlowObject.X;
                var Y = FlowObject.Y;
                var ContentPos = this.Internal_GetContentPosByXY(X,Y);
                this.CurPos.Type       = docpostype_Content;
                this.CurPos.ContentPos = ContentPos;
                this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

                // Удаляем float картинку
                FlowObject.Blur();
                this.Pages[this.Selection.Data.PageNum].FlowObjects.Remove_ByPos( this.Selection.Data.Pos );

                // Добавляем inline картинку
                this.Content[ContentPos].Add( Drawing );

                this.ContentLastChangePos = OldPos;
                if ( this.CurPos.ContentPos < this.ContentLastChangePos )
                    this.ContentLastChangePos = this.CurPos.ContentPos;

                this.Recalculate();
                this.Select_DrawingObject( Drawing.Get_Id() );
            }
            else
            {
                var W_new = FlowObject.W, H_new = FlowObject.H;
                if ( "undefined" != typeof( Props.Width ) && null != Props.Width )
                    W_new = Props.Width;

                if ( "undefined" != typeof( Props.Height ) && null != Props.Height )
                    H_new = Props.Height;

                if ( W_new != FlowObject.W || H_new != FlowObject.H )
                    FlowObject.Set_Size( W_new, H_new );

                if ( "undefined" != typeof( Props.Position ) && null != Props.Position )
                {
                    var X_new = FlowObject.X, Y_new = FlowObject.Y;
                    if ( "undefined" != typeof( Props.Position.X ) && null != Props.Position.X )
                        X_new = Props.Position.X;

                    if ( "undefined" != typeof( Props.Position.Y ) && null != Props.Position.Y )
                        Y_new = Props.Position.Y;

                    if ( X_new != FlowObject.X || Y_new != FlowObject.Y )
                        FlowObject.Set_Position( X_new, Y_new );
                }

                if ( "undefined" != typeof( Props.Paddings ) && null != Props.Paddings )
                {
                    var Pad_l = FlowObject.Paddings.Left, Pad_r = FlowObject.Paddings.Right, Pad_t = FlowObject.Paddings.Top, Pad_b = FlowObject.Paddings.Bottom;

                    if ( "undefined" != typeof( Props.Paddings.Left ) && null != Props.Paddings.Left )
                        Pad_l = Props.Paddings.Left;

                    if ( "undefined" != typeof( Props.Paddings.Right ) && null != Props.Paddings.Right )
                        Pad_r = Props.Paddings.Right;

                    if ( "undefined" != typeof( Props.Paddings.Bottom ) && null != Props.Paddings.Bottom )
                        Pad_b = Props.Paddings.Bottom;

                    if ( "undefined" != typeof( Props.Paddings.Top ) && null != Props.Paddings.Top )
                        Pad_t = Props.Paddings.Top;

                    if ( Pad_l != FlowObject.Paddings.Left || Pad_r != FlowObject.Paddings.Right || Pad_t != FlowObject.Paddings.Top || Pad_b != FlowObject.Paddings.Bottom )
                        FlowObject.Set_Paddings( Pad_l, Pad_r, Pad_t, Pad_b );
                }
                if ( "undefined" != typeof( Props.ImageUrl ) && null != Props.ImageUrl )
                    FlowObject.Set_Url( Props.ImageUrl );

                FlowObject.Update();

                this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                this.Recalculate();
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Set_ImageProps(Props);
            else
                this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
        }
    },

    Set_TableProps : function(Props)
    {
        if ( true === this.ApplyToAll )
            return false;

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return false;

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                return FlowObject.Table.Set_Props(Props);
            }
            else
                return false;
        }

        var Pos = -1;
        if ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() )
            Pos = this.Selection.StartPos;
        else if ( false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType() )
            Pos = this.CurPos.ContentPos;

        if ( -1 != Pos )
        {
            // TODO: Пока мы не позволяем делать FlowTable вне класса Document
            if ( "undefined" != typeof(Props.TableWrappingStyle) )
                Props.TableWrappingStyle = c_oAscWrapStyle.Inline;

            var Table = this.Content[Pos];
            return Table.Set_Props(Props);
        }

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
        var Result_ParaPr = new Object();

        if ( true === this.ApplyToAll )
        {
            var StartStyleId, StartPr, NumPr, Pr;
            if ( type_Paragraph == this.Content[0].GetType() )
            {
                StartStyleId = this.Content[0].Style_Get();
                StartPr      = this.Content[0].Get_CompiledPr2().ParaPr;
                var TNumPr   = this.Content[0].Numbering_Get();

                NumPr        = null == TNumPr ? null : Common_CopyObj( this.Content[0].Numbering_Get() );
                Pr           = Common_CopyObj( StartPr );
            }
            else if ( type_Table == this.Content[0].GetType() )
            {
                StartPr      = this.Content[0].Get_Paragraph_ParaPr();
                StartStyleId = StartPr.StyleId;
                NumPr        = Common_CopyObj( StartPr.NumPr );
                Pr           = Common_CopyObj( StartPr );
            }

            Pr.StyleId = StartStyleId;
            Pr.NumPr   = NumPr;

            for ( var Index = 1; Index < this.Content.length; Index++ )
            {
                var Item = this.Content[Index];

                var TempPr;
                if ( type_Paragraph == Item.GetType() )
                {
                    TempPr         = Item.Get_CompiledPr2().ParaPr;
                    TempPr.StyleId = Item.Style_Get();
                    TempPr.NumPr   = Item.Numbering_Get();
                }
                else if ( type_Table == Item.GetType() )
                {
                    TempPr = Item.Get_Paragraph_ParaPr();
                }

                Pr = Styles_Compare_ParaPr( Pr, TempPr );
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

            return Result_ParaPr;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Item = this.Selection.Data.DrawingObject.Parent;
            if ( type_Paragraph == Item.GetType() )
            {
                var ParaPr = Item.Get_CompiledPr2().ParaPr;
                var SId    = Item.Style_Get();
                var NumPr  = Item.Numbering_Get();

                Result_ParaPr.Ind               = ParaPr.Ind;
                Result_ParaPr.Jc                = ParaPr.Jc;
                Result_ParaPr.Spacing           = ParaPr.Spacing;
                Result_ParaPr.PageBreakBefore   = ParaPr.PageBreakBefore;
                Result_ParaPr.KeepLines         = ParaPr.KeepLines;
                Result_ParaPr.ContextualSpacing = ParaPr.ContextualSpacing;
                Result_ParaPr.Tabs              = ParaPr.Tabs;
                Result_ParaPr.Shd               = ParaPr.Shd;
                Result_ParaPr.Brd               = ParaPr.Brd;
                Result_ParaPr.StyleId           = SId;
                Result_ParaPr.NumPr             = NumPr;
            }

            return Result_ParaPr;
        }

        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    Result_ParaPr.Ind               = { Left : UnknownValue, Right : UnknownValue, FirstLine : UnknownValue };
                    Result_ParaPr.Jc                = UnknownValue;
                    Result_ParaPr.Spacing           = { Line : UnknownValue, LineRule : UnknownValue, Before : UnknownValue, After : UnknownValue };
                    Result_ParaPr.PageBreakBefore   = UnknownValue;
                    Result_ParaPr.KeepLines         = UnknownValue;
                    Result_ParaPr.ContextualSpacing = UnknownValue;
                    Result_ParaPr.Shd               = UnknownValue;
                    Result_ParaPr.Brd               = { Between : null, Bottom : null, Right : null, Left : null, Top : null };
                    Result_ParaPr.StyleId           = null;
                    Result_ParaPr.NumPr             = null;

                    return Result_ParaPr;
                }
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Table.Get_Paragraph_ParaPr();
            }

            return null;
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
            if ( type_Paragraph == this.Content[StartPos].GetType() )
            {
                StartStyleId = this.Content[StartPos].Style_Get();
                StartPr      = this.Content[StartPos].Get_CompiledPr2().ParaPr;
                var TNumPr   = this.Content[StartPos].Numbering_Get();

                NumPr        = null == TNumPr ? null : Common_CopyObj( this.Content[StartPos].Numbering_Get() );
                Pr           = Common_CopyObj( StartPr );
            }
            else if ( type_Table == this.Content[StartPos].GetType() )
            {
                StartPr      = this.Content[StartPos].Get_Paragraph_ParaPr();
                StartStyleId = StartPr.StyleId;
                NumPr        = Common_CopyObj( StartPr.NumPr );
                Pr           = Common_CopyObj( StartPr );
            }

            Pr.StyleId = StartStyleId;
            Pr.NumPr   = NumPr;

            for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
            {
                var Item = this.Content[Index];

                var TempPr;
                if ( type_Paragraph == Item.GetType() )
                {
                    TempPr         = Item.Get_CompiledPr2().ParaPr;
                    TempPr.StyleId = Item.Style_Get();
                    TempPr.NumPr   = Item.Numbering_Get();
                }
                else if ( type_Table == Item.GetType() )
                {
                    TempPr = Item.Get_Paragraph_ParaPr();
                }

                Pr = Styles_Compare_ParaPr( Pr, TempPr );
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
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var ParaPr = Item.Get_CompiledPr2().ParaPr;
                var SId    = Item.Style_Get();
                var NumPr  = Item.Numbering_Get();

                Result_ParaPr.Ind               = ParaPr.Ind;
                Result_ParaPr.Jc                = ParaPr.Jc;
                Result_ParaPr.Spacing           = ParaPr.Spacing;
                Result_ParaPr.PageBreakBefore   = ParaPr.PageBreakBefore;
                Result_ParaPr.KeepLines         = ParaPr.KeepLines;
                Result_ParaPr.ContextualSpacing = ParaPr.ContextualSpacing;
                Result_ParaPr.Tabs              = ParaPr.Tabs;
                Result_ParaPr.Shd               = ParaPr.Shd;
                Result_ParaPr.Brd               = ParaPr.Brd;
                Result_ParaPr.StyleId           = SId;
                Result_ParaPr.NumPr             = NumPr;
            }
            else if ( type_Table == Item.GetType() )
            {
                Result_ParaPr = Item.Get_Paragraph_ParaPr();
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

                VisTextPr = Styles_Compare_TextPr( VisTextPr, CurPr );
            }

            Result_TextPr = VisTextPr;

            return Result_TextPr;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Item = this.Selection.Data.DrawingObject.Parent;

            if ( type_Paragraph == Item.GetType() )
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );

            return Result_TextPr;
        }

        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    Result_TextPr = new Object();
                    Result_TextPr.Bold       = false;
                    Result_TextPr.Italic     = false;
                    Result_TextPr.Underline  = false;
                    Result_TextPr.Strikeout  = false;
                    Result_TextPr.FontSize   = "";
                    Result_TextPr.FontFamily = "";
                    Result_TextPr.VertAlign  = vertalign_Baseline;
                    Result_TextPr.Color      = { r : 0, g : 0, b : 0};
                    Result_TextPr.HighLight  = highlight_None;

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

                        VisTextPr = Styles_Compare_TextPr( VisTextPr, CurPr );
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
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
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
            else if ( type_Table == Item.GetType() )
                Result_TextPr = Item.Get_Paragraph_TextPr_Copy();


            return Result_TextPr;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Item = this.Selection.Data.DrawingObject.Parent;

            if ( type_Paragraph == Item.GetType() )
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );

            return Result_TextPr;
        }

        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    Result_TextPr = new Object();
                    Result_TextPr.Bold       = false;
                    Result_TextPr.Italic     = false;
                    Result_TextPr.Underline  = false;
                    Result_TextPr.Strikeout  = false;
                    Result_TextPr.FontSize   = "";
                    Result_TextPr.FontFamily = "";
                    Result_TextPr.VertAlign  = vertalign_Baseline;
                    Result_TextPr.Color      = { r : 0, g : 0, b : 0};
                    Result_TextPr.HighLight  = highlight_None;

                    return Result_TextPr;
                }
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Table.Get_Paragraph_TextPr_Copy();
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
                    if ( this.Selection.EndPos < StartPos )
                        StartPos = this.Selection.EndPos;

                    var Item = this.Content[StartPos];
                    if ( type_Paragraph == Item.GetType() )
                    {
                        var StartPos_item = Item.Selection.StartPos;
                        if ( Item.Selection.EndPos < StartPos_item )
                            StartPos_item = Item.Selection.EndPos

                        VisTextPr = Item.Internal_CalculateTextPr( StartPos_item );
                    }
                    else if ( type_Table == Item.GetType() )
                        VisTextPr = Item.Get_Paragraph_TextPr_Copy();

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
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
            }
            else if ( type_Table == Item.GetType() )
            {
                Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
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
        var ImagePr = new Object();
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Drawing = this.Selection.Data.DrawingObject;
            ImagePr.Width  = Drawing.W;
            ImagePr.Height = Drawing.H;
            ImagePr.WrappingStyle  = c_oAscWrapStyle.Inline;
            ImagePr.ImageUrl = Drawing.GraphicObj.Img;

            ImagePr.Paddings =
            {
                Left   : 3.2,
                Right  : 3.2,
                Top    : 0,
                Bottom : 0
            };
            ImagePr.Position =
            {
                X : Drawing.X,
                Y : Drawing.Y
            };
        }
        else if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var FlowObject = this.Pages[this.CurPage].FlowObjects.Get_ByIndex( this.CurPos.ContentPos );
            if ( flowobject_Image != FlowObject.Get_Type() )
                return;

            ImagePr.Width  = FlowObject.W;
            ImagePr.Height = FlowObject.H;

            ImagePr.WrappingStyle  = c_oAscWrapStyle.Flow;
            ImagePr.Paddings =
            {
                Left   : FlowObject.Paddings.Left,
                Right  : FlowObject.Paddings.Right,
                Top    : FlowObject.Paddings.Top,
                Bottom : FlowObject.Paddings.Bottom
            };
            ImagePr.Position =
            {
                X : FlowObject.X,
                Y : FlowObject.Y
            };
            ImagePr.ImageUrl = FlowObject.Img;
        }

        if ( true === Flag )
            return ImagePr;
        else
            editor.sync_ImgPropCallback( ImagePr );

    },

    Interface_Update_TablePr : function(Flag)
    {
        var TablePr = null;
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
                TablePr = this.Selection.Data.FlowObject.Table.Get_Props();
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            if ( true == this.Selection.Use )
                TablePr = this.Content[this.Selection.StartPos].Get_Props();
            else
                TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
        }
        TablePr.CanBeFlow = false;

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
        if ( PageIndex - this.StartPage >= this.Pages.length )
            return;

        this.CurPage = PageIndex - this.StartPage;

        var bOldSelectionIsCommon = true;


        var ContentPos = this.Internal_GetContentPosByXY(X,Y);

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            this.CurPos.Type = docpostype_Content;
            this.CurPos.ContentPos = ContentPos;
            bOldSelectionIsCommon = false;
        }

        var SelectionUse_old = this.Selection.Use;
        var Item = this.Content[ContentPos];

        var bTableBorder = false;
        if ( type_Table == Item.GetType() )
            bTableBorder = Item.Is_TableBorder( X, Y, this.CurPage );

        // Убираем селект, кроме случаев либо текущего параграфа, либо при движении границ внутри таблицы
        if ( !(true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) )
        {
            if ( (selectionflag_Common != this.Selection.Flag) || ( true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder )  )
                this.Selection_Remove();
        }

        this.Selection.Use         = true;
        this.Selection.Start       = true;
        this.Selection.Flag        = selectionflag_Common;

        if ( true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon )
        {
            this.Selection_SetEnd( X, Y, {Type : g_mouse_event_type_up, ClickCount : 1} );
            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.EndPos   = ContentPos;
            this.Selection.Data     = null;
        }
        else
        {
            Item.Selection_SetStart( X, Y, this.CurPage, MouseEvent );
            Item.Selection_SetEnd( X, Y, this.CurPage, {Type : g_mouse_event_type_move, ClickCount : 1} );

            if ( !(type_Table == Item.GetType() && true == bTableBorder) )
            {
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
            else
            {
                this.Selection.Data =
                {
                    TableBorder : true,
                    Pos         : ContentPos,
                    Selection   : SelectionUse_old
                };
            }
        }

    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X, Y, PageIndex, MouseEvent)
    {
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
        if ( null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType() )
        {
            var Item = this.Content[this.Selection.Data.Pos];
            Item.Selection_SetEnd( X, Y, this.CurPage, MouseEvent );

            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.Selection.Start = false;

                if ( true != this.Selection.Data.Selection )
                {
                    this.Selection.Use = false;
                }
                this.Selection.Data  = null;
            }

            return;
        }

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

                    this.Selection.Data.Value.Set_Visited( true );

                    for ( var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++ )
                        this.DrawingDocument.OnRecalculatePage( PageIdx, this.DrawingDocument.m_oLogicDocument.Pages[PageIdx] );

                    this.DrawingDocument.OnEndRecalculate(false, true);
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
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Row_Add( bBefore );
                FlowObject.Internal_UpdateBounds();

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Row_Add( bBefore );
            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }

            return true;
        }

        return false;
    },

    Table_AddCol : function(bBefore)
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Col_Add( bBefore );
                FlowObject.Internal_UpdateBounds();

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Col_Add( bBefore );
            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }

            return true;
        }

        return false;
    },

    Table_RemoveRow : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;

                if ( false === FlowObject.Table.Row_Remove() )
                    this.Table_RemoveTable();
                else
                    FlowObject.Internal_UpdateBounds();

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            if ( false === this.Content[Pos].Row_Remove() )
                this.Table_RemoveTable();

            return true;
        }

        return false;
    },

    Table_RemoveCol : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                if ( false === FlowObject.Table.Col_Remove() )
                    this.Table_RemoveTable();
                else
                    FlowObject.Internal_UpdateBounds();

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            if ( false === this.Content[Pos].Col_Remove() )
                this.Table_RemoveTable();

            return true;
        }

        return false;
    },

    Table_MergeCells : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Cell_Merge();
                FlowObject.Internal_UpdateBounds();

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Cell_Merge();
            return true;
        }

        return false;
    },

    Table_SplitCell : function( Cols, Rows )
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Cell_Split(Rows, Cols);

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Cell_Split(Rows, Cols);
            return true;
        }

        return false;
    },

    Table_RemoveTable : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                if ( true === this.Selection.Data.FlowObject.Table.Is_InnerTable() )
                    this.Selection.Data.FlowObject.Table.Remove_InnerTable();
                else
                {
                    var X = this.Selection.Data.FlowObject.X;
                    var Y = this.Selection.Data.FlowObject.Y;

                    this.Selection.Data.FlowObject.Blur();
                    this.Selection.Data.FlowObject.Table.PreDelete();
                    this.Selection.Data.FlowObject.DeleteThis();

                    this.CurPos.Type = docpostype_Content;
                    this.Cursor_MoveAt( X, Y, false );

                    this.Recalculate();
                }

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            var Table = this.Content[Pos];
            if ( true === Table.Is_InnerTable() )
                Table.Remove_InnerTable();
            else
            {
                this.Selection_Remove();
                Table.PreDelete();
                this.Internal_Content_Remove( Pos, 1 );

                if ( Pos >= this.Content.length - 1 )
                    Pos--;

                if ( Pos < 0 )
                    Pos = 0;

                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = Pos;
                this.Content[Pos].Cursor_MoveToStartPos();
                this.Recalculate();
            }

            return true;
        }
        return false;
    },

    Table_Select : function(Type)
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Table_Select(Type);

                return true;
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            this.Content[Pos].Table_Select(Type);
            if ( false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = Pos;
                this.Selection.EndPos   = Pos;
            }
            return true;
        }

        return false;
    },

    Table_CheckMerge : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                return FlowObject.Table.Check_Merge();
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            return this.Content[Pos].Check_Merge();
        }

        return false;
    },

    Table_CheckSplit : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                return FlowObject.Table.Check_Split();
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos = 0;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            return this.Content[Pos].Check_Split();
        }

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
                    case type_Table :
                    {
                        // Избегаем случая, когда таблица сразу начинаяется с новой страницы
                        if ( true === Item.RowsInfo[0].FirstPage )
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

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit, ++this.IdCounter) );
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

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit, ++this.IdCounter) );
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
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
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