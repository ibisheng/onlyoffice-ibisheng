// Класс Документ
//
// Логическая часть:
//     Content : Массив объектов (параграфы, таблицы, картинки, графика и т.д.)
//     SectPr  : Настройки секци (размеры, поля)
//               PgSz : размеры страницы
//                     W, H, Orient
//               PgMar: отступы страницы
//                      Top, Left, Right, Bottom, Header, Footer
//
// Графическая часть:


// TODO: Поскольку пока "плавающие" графика и таблицы прикреплены к странице, они идут отдельными
//       классами, а не такими же как и их "inline" аналоги. Но все равно работу с ними нужно
//       объединить воедино. (т.е. надо избавиться от docpostype_FlowObjects)
var History = null;

var Page_Width     = 210;
var Page_Height    = 297;

var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var Y_Default_Header = 12.5; // 1.25 cm расстояние от верха страницы до верха верхнего колонтитула
var Y_Default_Footer = 12.5; // 1.25 cm расстояние от низа страницы до низа нижнего колонтитула

var X_Left_Field   = X_Left_Margin;
var X_Right_Field  = Page_Width  - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field    = Y_Top_Margin;

var docpostype_Content     = 0x00;
var docpostype_FlowObjects = 0x01;
var docpostype_HdrFtr      = 0x02;
var docpostype_FlowShape   = 0x03;

var selectionflag_Common        = 0x00;
var selectionflag_Numbering     = 0x01;
var selectionflag_DrawingObject = 0x002;

var orientation_Portrait  = 0x00;
var orientation_Landscape = 0x01;

var newObj=1, editNewObj=2, editGroupObj=3, editAdj=4, _move=5, rot=6,
    adj=0, handle=1, rotate=2, addObj=3, xy=0, polar=1, addText=7;

function CDrawingObjects()
{
    this.Objects = new Array();
}

CDrawingObjects.prototype =
{
    Add : function(DrawingObj)
    {
        this.Objects.push( DrawingObj );
        return this.Objects.length - 1;
    },

    IsPointIn : function (X,Y, PageIndex)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( true === this.Objects[Index].IsPointIn( X, Y, PageIndex ) )
                return Index;
        }

        return -1;
    },

    Get_ById : function (Id)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                return this.Objects[Index];
            }
        }

        return null
    },

    Get_ByIndex :function (Index)
    {
        if ( Index < 0 || Index >= this.Objects.length )
            return null;

        return this.Objects[Index];
    },

    Remove_ById :function (Id)
    {
        for ( var Index = 0; Index < this.Objects.length; Index++ )
        {
            if ( Id === this.Objects[Index].Get_Id() )
            {
                this.Objects.splice( Index, 1 );
            }
        }
    },


    Remove_All : function()
    {
        this.Objects.length = 0;
    }
};

function CDocument(DrawingDocument)
{
    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.Orientation = orientation_Portrait; // ориентация страницы
    this.StyleCounter = 0;
    this.NumInfoCounter = 0;

    this.IdCounter = 0;

    // Сначала настраиваем размеры страницы и поля
    this.SectPr = new SectPr();
    this.SectPr.Set_PageSize( 793.7, 1122,53 );
    this.SectPr.Set_PageMargins( { Left : 75.6  }  );


    this.History = new CHistory(this);
    History = this.History;
    this.Content = new Array();
    this.Content[0] = new Paragraph( DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field, ++this.IdCounter);
    this.Content[0].Set_DocumentNext( null );
    this.Content[0].Set_DocumentPrev( null );



    this.ContentLastChangePos = 0;

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

    // Здесь мы храним инфрмацию, связанную с разбивкой на страницы и самими страницами
    this.Pages = new Array();
    this.Pages[0] =
    {
        Pos  : 0,                // Позиция начала страницы
        FlowObjects : new FlowObjects(),
        Width  : Page_Width,
        Height : Page_Height,

        Margins :
        {
            Left   : X_Left_Field,
            Right  : X_Right_Field,
            Top    : Y_Top_Field,
            Bottom : Y_Bottom_Field
        }
    };

    this.FullRecalc = new Object();
    this.FullRecalc.Id = null;
    this.FullRecalc.X  = 0;
    this.FullRecalc.Y  = 0;
    this.FullRecalc.StartPos = 0;
    this.FullRecalc.CurPage  = 0;

    this.Numbering = new CNumbering();
    this.Styles    = new CStyles();

    this.DrawingDocument = DrawingDocument;

    this.NeedUpdateTarget = false;

    // Массив укзателей на все инлайновые графические объекты
    this.DrawingObjects = new CDrawingObjects();

    // Класс для работы с колонтитулами
    this.HdrFtr = new CHeaderFooterController(this, this.DrawingDocument);

    // Класс для работы с поиском
    this.SearchInfo =
    {
        Id       : null,
        StartPos : 0,
        CurPage  : 0,
        String   : null
    };

    this.AutoShapes= new AutoShapesContainer(this, this.DrawingDocument);
}

CDocument.prototype =
{
    // Проводим начальные действия, исходя из Документа
    Init : function()
    {
    },

    StartAddShape: function(preset)
    {
        if(this.AutoShapes.State.id==20)
        {
            this.AutoShapes.group.RecalculateAfterResize();
            this.AutoShapes.group.NumSelected=0;
            for(var i=0; i<this.AutoShapes.group.Selected.length; i++)
                this.AutoShapes.group.Selected[i]=0;
            this.AutoShapes.ChangeState(new NullShapeState());
        }
        this.AutoShapes.CurPreset = preset;
        switch(preset)
        {
            case 'polyline2':
            {
                if(this.AutoShapes.State.id==0)
                {
                    this.AutoShapes.ChangeState(new AddPolyLine2State());
                }
                break;
            }
            case 'group':
            {
                if(this.AutoShapes.State.id==0)
                {
                    this.AutoShapes.GroupSelected();
                    this.AutoShapes.NumEditShape=this.AutoShapes.ArrGlyph.length-1;
                    this.AutoShapes.obj=this.AutoShapes.ArrGlyph[this.AutoShapes.ArrGlyph.length-1];
                }
                break;
            }
             case 'ungroup':
            {
                if(this.AutoShapes.obj.IsGroup()&&this.AutoShapes.State.id==0 &&this.AutoShapes.NumSelected==1)
                {
                    var tmp=this.AutoShapes.obj.UnGroup();
                    var k=this.AutoShapes.NumGroup;
                    this.AutoShapes.ArrGlyph.splice(k, 1);
                    this.AutoShapes.Selected.splice(k, 1);
                    for(i=0; i<tmp.length; ++i)
                    {
                        this.AutoShapes.ArrGlyph.splice(k, 0, tmp[i]);
                        this.AutoShapes.Selected.splice(k, 0, true);
                        ++k;
                    }
                    this.AutoShapes.NumSelected=tmp.length;
                    this.DrawingDocument.OnRecalculatePage( 0, this.Pages[0] );
                    History.Create_NewPoint();
                    History.Add(this.AutoShapes, {Type: historyitem_Shape_UnGroup, group:this.AutoShapes.obj, select: clone(this.AutoShapes.Selected), num:this.AutoShapes.NumEditShape});
                    this.AutoShapes.obj=tmp[tmp.length-1];
                }
                break;
            }
            case 'splineBezier':
            {
                if(this.AutoShapes.State.id==0)
                {
                    this.AutoShapes.ChangeState(new SplineAddState());
                }
                break;
            }
            default:
            {
                this.AutoShapes.ChangeState(new ShapeAddState());
            }
        }
    },

    LoadEmptyDocument : function()
    {
        this.DrawingDocument.TargetStart();
        this.Recalculate();

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    LoadTestDocument : function()
    {
        editor.ShowParaMarks = true;
		//При сборке релиза ASC_DOCS_API_DEBUG равен false и тогда код после ифа удалится
		if( true != ASC_DOCS_API_DEBUG ) 
		{
			this.LoadEmptyDocument();
			return;
		}
		
        // Добавляем тестовый текст к документу
        this.DrawingDocument.m_bIsNoSendChangeDocument = true;
        this.Recalculate();
        this.DrawingDocument.m_bIsNoSendChangeDocument = false;
        this.DrawingDocument.m_bIsOpeningDocument = true;
        this.DrawingDocument.m_lMaxPageCalculate_opening = -1;
        this.DrawingDocument.TargetStart();

        var Strings = ["History", "A box of punched cards with several program decks.", "Before text editors existed, computer text was punched into punched cards with keypunch machines. The text was carried as a physical box of these thin cardboard cards, and read into a card-reader. Magnetic tape or disk \"card-image\" files created from such card decks often had no line-separation characters at all, commonly assuming fixed-length 80-character records. An alternative to cards was punched paper tape, generated by teletype (TTY) machines; these did need special characters to indicate ends of records.",         "The first text editors were line editors oriented to teletype- or typewriter- style terminals, which did not provide a window or screen-oriented display. They usually had very short commands (to minimize typing) that reproduced the current line. Among them were a command to print a selected section(s) of the file on the typewriter (or printer) in case of necessity. An \"edit cursor\", an imaginary insertion point, could be moved by special commands that operated with line numbers of specific text strings (context). Later, the context strings were extended to regular expressions. To see the changes, the file needed to be printed on the printer. These \"line-based text editors\" were considered revolutionary improvements over keypunch machines. In case typewriter-based terminals were not available, they were adapted to keypunch equipment. In this case the user needed to punch the commands into the separate deck of cards and feed them into the computer in order to edit the file.",            "When computer terminals with video screens became available, screen-based text editors (sometimes termed just \"screen editors\") became common. One of the earliest \"full screen\" editors was O26 - which was written for the operator console of the CDC 6000 series machines in 1967. Another early full screen editor is vi. Written in the 1970s, vi is still a standard editor[1] for Unix and Linux operating systems. Vi and Emacs are popular editors on these systems. The productivity of editing using full-screen editors (compared to the line-based editors) motivated many of the early purchases of video terminals."];

        var oldPara = this.Content[this.Content.length - 1];
        var Para = new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field, ++this.IdCounter);

        oldPara.Set_DocumentNext(Para);
        Para.Set_DocumentPrev(oldPara);

        this.Content.push( Para );
        for ( var j = 0; j < 10; j++ )
        {
            var Pos = 0;
            for ( var i = 0; i < Strings.length; i++ )
            {
                switch ( i )
                {
                    case 0 :
                    {
                        Para.Style_Add( this.Styles.Get_Default_Heading(0) );
                        //Para.Pr.Jc= align_Center;
                        //Para.Content.splice( Pos++, 0, new ParaTextPr( { FontSize : 18, FontFamily : "Times", Bold : true } ) );
                        break;
                    }
                    default:
                    {
                        Para.Pr.Jc = align_Justify;
                        //Para.Content.splice( Pos++, 0, new ParaTextPr( { FontSize : 12, FontFamily : "Arial", Bold : false } ) );
                        break;
                    }
                }
                for ( var Index = 0; Index < Strings[i].length; Index++ )
                {
                    if ( " " != Strings[i].charAt( Index )  )
                        Para.Content.splice( Pos++, 0, new ParaText( Strings[i].charAt( Index ) ) );
                    else
                        Para.Content.splice( Pos++, 0, new ParaSpace() );
                }

                oldPara = Para;
                Para = new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field, ++this.IdCounter);

                oldPara.Set_DocumentNext(Para);
                Para.Set_DocumentPrev(oldPara);
                this.Content.push( Para );
                Pos = 0;
            }
        }

        this.Recalculate();
    },

    Get_PageContentStartPos : function (PageIndex)
    {
        var Y = Y_Top_Field;
        var YHeader = this.HdrFtr.Get_HeaderBottomPos( PageIndex );
        if ( YHeader >= 0 && YHeader > Y )
            Y = YHeader;

        var YLimit = Y_Bottom_Field;
        var YFooter = this.HdrFtr.Get_FooterTopPos( PageIndex );
        if ( YFooter >= 0 &&  YFooter < YLimit )
            YLimit = YFooter;

        return { X : X_Left_Field, Y : Y, XLimit : X_Right_Field, YLimit : YLimit };
    },

    // Пересчет содержимого Документа
    Recalculate : function(bOneParagraph, bRecalcContentLast)
    {
        if ( "undefined" == typeof(bRecalcContentLast) )
            bRecalcContentLast = true;

        if ( null != this.SearchInfo.Id )
            this.Search_Stop(true);

        this.NeedUpdateTarget = true;

        var CurPage = 0;
        this.Pages[0].Width   = Page_Width;
        this.Pages[0].Height  = Page_Height;
        this.Pages[0].Margins =
        {
            Left   : X_Left_Field,
            Right  : X_Right_Field,
            Top    : Y_Top_Field,
            Bottom : Y_Bottom_Field
        };

        var StartTime = new Date().getTime();

        var Count = this.Content.length;

        var StartPos = this.Get_PageContentStartPos( 0 );
        var X      = StartPos.X;
        var StartY = StartPos.Y;

        var Y = StartY;

        var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;

        /*
         var bLastPage = false;

         for ( var Index = this.Pages.length - 1; Index >= 0; Index-- )
         {
         this.Pages[Index].Pos = 0;
         if ( false === bLastPage && this.Pages[Index].FlowObjects.Objects.length > 0 )
         {
         bLastPage = true;
         this.Pages.length = Index + 1;
         }
         }


         if ( false === bLastPage )
         this.Pages.length = 1;

         */

        var Timer = 0;
        var bStartRecalc    = false;
        var bNeedFullRecalc = false;

        if ( null != this.FullRecalc.Id )
        {
            bNeedFullRecalc  = true;
            clearTimeout( this.FullRecalc.Id );
            this.FullRecalc.Id = null;
            this.DrawingDocument.OnEndRecalculate( false );
        }

        var Index;
        for ( Index = 0; Index < Count; Index++ )
        {
            // Пересчитываем элемент документа
            var Element = this.Content[Index];
            Element.Set_DocumentIndex( Index );

            if ( Index >= this.ContentLastChangePos || ( true === bNeedFullRecalc && Index >= this.FullRecalc.StartPos ) )
            {
                if ( null != this.DrawingDocument && false == bStartRecalc )
                {
                    bStartRecalc = true;
                    this.DrawingDocument.OnStartRecalculate( CurPage );
                }

                var OldPagesLen = Element.Pages.length;
                var OldBounds = Common_CopyObj( Element.Pages[OldPagesLen - 1].Bounds );
                var OldStartPage = Element.PageNum;

                Element.TurnOff_RecalcEvent();
                if ( true === bRecalcContentLast || Index != this.ContentLastChangePos )
                {
                    Element.Reset( X, Y, XLimit, YLimit, CurPage );
                    Element.Recalculate();
                }
                Element.TurnOn_RecalcEvent();

                // Если нижняя граница не изменилась, следующие элементы не пересчитываем
                if ( true == bOneParagraph && OldStartPage == Element.PageNum && OldPagesLen == Element.Pages.length && Math.abs( OldBounds.Bottom - Element.Pages[Element.Pages.length - 1].Bounds.Bottom ) < 0.001 )
                {
                    var Temp = CurPage;
                    for ( ; CurPage < Temp + Element.Pages.length; CurPage++ )
                    {
                        this.Internal_Link_FlowObjects( CurPage );
                        this.DrawingDocument.OnRecalculatePage( CurPage, this.Pages[CurPage] );
                    }

                    sendStatus( "Recalc: " + ((new Date().getTime() - StartTime) / 1000) + " s" + " StylesCompileCount : " + this.StyleCounter + " NumInfoCount : " + this.NumInfoCounter );

                    if ( true === bNeedFullRecalc )
                    {
                        this.DrawingDocument.OnStartRecalculate( this.FullRecalc.StartState.CurPage );
                        this.FullRecalc.X        = this.FullRecalc.StartState.X;
                        this.FullRecalc.Y        = this.FullRecalc.StartState.Y;
                        this.FullRecalc.XLimit   = this.FullRecalc.StartState.XLimit;
                        this.FullRecalc.YLimit   = this.FullRecalc.StartState.YLimit;
                        this.FullRecalc.StartPos = this.FullRecalc.StartState.StartPos;
                        this.FullRecalc.CurPage  = this.FullRecalc.StartState.CurPage;
                        this.FullRecalc.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Recalculate2()}, 10);
                    }
                    else
                    {
                        this.DrawingDocument.OnEndRecalculate(false, true);
                    }

                    break;
                }
            }

            var bNewPage = false;
            var Temp = CurPage;
            for ( ; CurPage < Temp + Element.Pages.length - 1; )
            {
                this.Internal_Link_FlowObjects( CurPage );

                if ( true == bStartRecalc && null != this.DrawingDocument )
                    this.DrawingDocument.OnRecalculatePage( CurPage, this.Pages[CurPage] );

                if ( "undefined" == typeof(this.Pages[++CurPage]) )
                {
                    this.Pages[CurPage] = new Object();
                    this.Pages[CurPage].FlowObjects = new FlowObjects();
                }

                this.Pages[CurPage].Width   = Page_Width;
                this.Pages[CurPage].Height  = Page_Height;
                this.Pages[CurPage].Margins =
                {
                    Left   : X_Left_Field,
                    Right  : X_Right_Field,
                    Top    : Y_Top_Field,
                    Bottom : Y_Bottom_Field
                };
                this.Pages[CurPage].Pos = Index;


                bNewPage = true;
                if ( 0 != Timer )
                    Timer += Element.Pages.length - 1;
            }

            Element.NeedReDraw = true;

            Element.ClearRect  = OldBounds;

            // Округляем для селекта
            if ( false === bNewPage )
                Y += Element.Bounds.Bottom - Element.Bounds.Top;
            else
            {
                var StartPagePos = this.Get_PageContentStartPos( CurPage );

                YLimit = StartPagePos.YLimit;
                XLimit = StartPagePos.XLimit;

                Y = StartPagePos.Y;
                Y += Element.Bounds.Bottom - Y;
            }

            if ( 0 === Timer  && Index >= this.ContentLastChangePos )
            {
                Timer = 1;
            }

            if ( /*true === Target.Show &&*/ Index >= this.ContentLastChangePos && Index == this.CurPos.ContentPos )
            {
                if ( type_Paragraph === Element.GetType() )
                    this.CurPage = Element.PageNum + Element.CurPos.PagesPos;
                else
                    this.CurPage = Element.PageNum; // TODO: переделать
            }


            if ( Timer >= 3 )
            {
                this.FullRecalc.StartState =
                {
                    X        : X,
                    Y        : Y,
                    XLimit   : XLimit,
                    YLimit   : YLimit,
                    StartPos : Index + 1,
                    CurPage  : CurPage
                };
                this.FullRecalc.X = X;
                this.FullRecalc.Y = Y;
                this.FullRecalc.XLimit = XLimit;
                this.FullRecalc.YLimit = YLimit;
                this.FullRecalc.StartPos = Index + 1;
                this.FullRecalc.CurPage  = CurPage;
                this.FullRecalc.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Recalculate2()}, 10);

                break;
            }
        }

        if ( Index >= Count && null != this.DrawingDocument )
        {
            this.DrawingDocument.OnRecalculatePage( CurPage, this.Pages[CurPage] );
            this.DrawingDocument.OnEndRecalculate( true );
            this.FullRecalc.Id = null;

            this.Internal_Link_FlowObjects( CurPage );
        }

        // TODO: Пока обновляем состояние линейки после каждого обсчета. Надо будет переделать.
        this.Document_UpdateRulersState();

        sendStatus( "Recalc: " + ((new Date().getTime() - StartTime) / 1000) + " s"  + " StylesCompileCount : " + this.StyleCounter + " NumInfoCount : " + this.NumInfoCounter );
    },

    Recalculate2 : function()
    {
        if ( null === this.FullRecalc.Id )
            return;

        var StartTime = new Date().getTime();

        var Count = this.Content.length;

        var X = this.FullRecalc.X;
        var Y = this.FullRecalc.Y;
        var XLimit = this.FullRecalc.XLimit;
        var YLimit = this.FullRecalc.YLimit;

        var CurPage = this.FullRecalc.CurPage;

        for ( var Index = this.FullRecalc.StartPos; Index < Count; Index++ )
        {
            // Пересчитываем элемент документа
            var Element = this.Content[Index];
            var OldBounds = Common_CopyObj( Element.Bounds );

            Element.Set_DocumentIndex( Index );
            Element.TurnOff_RecalcEvent();
            Element.Reset( X, Y, XLimit, YLimit, CurPage );
            Element.Recalculate();
            Element.TurnOn_RecalcEvent();

            var bNewPage = false;
            var Temp = CurPage;
            for ( ; CurPage < Temp + Element.Pages.length - 1; )
            {
                this.Internal_Link_FlowObjects( CurPage );

                if ( null != this.DrawingDocument )
                    this.DrawingDocument.OnRecalculatePage( CurPage, this.Pages[CurPage] );

                if ( "undefined" == typeof(this.Pages[++CurPage]) )
                {
                    this.Pages[CurPage] = new Object();
                    this.Pages[CurPage].FlowObjects = new FlowObjects();
                }
                this.Pages[CurPage].Width   = Page_Width;
                this.Pages[CurPage].Height  = Page_Height;
                this.Pages[CurPage].Margins =
                {
                    Left   : X_Left_Field,
                    Right  : X_Right_Field,
                    Top    : Y_Top_Field,
                    Bottom : Y_Bottom_Field
                };
                this.Pages[CurPage].Pos = Index;

                bNewPage = true;
            }

            Element.NeedReDraw = true;

            Element.ClearRect  = OldBounds;

            // Округляем для селекта
            if ( false === bNewPage )
                Y += Element.Bounds.Bottom - Element.Bounds.Top;
            else
            {
                var StartPagePos = this.Get_PageContentStartPos( CurPage );

                YLimit = StartPagePos.YLimit;
                XLimit = StartPagePos.XLimit;

                Y = StartPagePos.Y;
                Y += Element.Bounds.Bottom - Y;
            }

            if ( bNewPage )
            {
                clearTimeout( this.FullRecalc.Id );

                this.FullRecalc.X = X;
                this.FullRecalc.Y = Y;
                this.FullRecalc.XLimit = XLimit;
                this.FullRecalc.YLimit = YLimit;
                this.FullRecalc.StartPos = Index + 1;
                this.FullRecalc.CurPage  = CurPage;
                this.FullRecalc.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Recalculate2()}, 1);

                break;
            }
        }

        if ( Index >= Count && null != this.DrawingDocument )
        {
            this.DrawingDocument.OnRecalculatePage( CurPage, this.Pages[CurPage] );
            this.DrawingDocument.OnEndRecalculate( true );
            this.FullRecalc.Id = null;

            this.Internal_Link_FlowObjects( CurPage );
        }

        //clearTimeout( this.FullRecalc.Id );
        //this.FullRecalc.Id = null;

        sendStatus("LastRecalc: " + ((new Date().getTime() - StartTime) / 1000) + " s Page:" + (CurPage + 1)  + " StylesCompileCount : " + this.StyleCounter   + " NumInfoCount : " + this.NumInfoCounter );
    },

    OnContentRecalculate : function(bNeedRecalc, PageNum, DocumentIndex)
    {
        if ( false === bNeedRecalc )
        {
            var Element = this.Content[DocumentIndex];
            // Просто перерисуем все страницы, на которых находится данный элеменет
            for ( var PageNum = Element.PageNum; PageNum < Element.PageNum + Element.Pages.length; PageNum++ )
            {
                this.DrawingDocument.OnRecalculatePage( PageNum, this.Pages[PageNum] );
            }

            this.DrawingDocument.OnEndRecalculate(false, true);
        }
        else
        {
            this.ContentLastChangePos = DocumentIndex;
            this.Recalculate( false, false );
        }
    },

    CheckTargetUpdate : function()
    {
        // Проверим можно ли вообще пересчитывать текущее положение.
        var bFlag = true;

        if (this.DrawingDocument.UpdateTargetFromPaint === true)
        {
            if ( true === this.DrawingDocument.UpdateTargetCheck )
                this.NeedUpdateTarget = this.DrawingDocument.UpdateTargetCheck;
            this.DrawingDocument.UpdateTargetCheck = false;
        }

        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( null != this.FullRecalc.Id && this.FullRecalc.StartPos <= this.CurPos.ContentPos )
                bFlag = false;
        }
        else if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    if ( null != this.FullRecalc.Id && this.FullRecalc.CurPage <= this.Selection.Data.PageNum )
                        bFlag = false;

                    break;
                }
                case flowobject_Table:
                {
                    var FlowTable = this.Selection.Data.FlowObject.TopObject;

                    if ( null != this.FullRecalc.Id && this.FullRecalc.CurPage <= this.Selection.Data.PageNum + FlowTable.Pages.length - 1 )
                        bFlag = false;

                    break;
                }
            }
        }
        else if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            // в колонтитуле всегда можно проверять текущую позицию
        }

        if ( true === this.NeedUpdateTarget && true === bFlag )
        {
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },

    RecalculateCurPos : function()
    {
        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos >= 0 && "undefined" != typeof(this.Content[this.CurPos.ContentPos].RecalculateCurPos) )
            {
                this.Internal_CheckCurPage();
                this.Content[this.CurPos.ContentPos].RecalculateCurPos();
            }
        }
        else if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.DrawingDocument.UpdateTarget2( this.Selection.Data.FlowObject.X + this.Selection.Data.FlowObject.W /2, this.Selection.Data.FlowObject.Y + this.Selection.Data.FlowObject.H / 2, this.Selection.Data.PageNum );
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.RecalculateCurPos();
                    break;
                }
            }
        }
        else if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.RecalculateCurPos();
        }

        else if( docpostype_FlowShape === this.CurPos.Type )
        {
            var Doc = this.AutoShapes.obj.DocumentContent;
            Doc.RecalculateCurPos();
        }
    },

    Internal_CheckCurPage : function()
    {
        if ( /*true === Target.Show &&*/ this.CurPos.ContentPos >= 0 && "undefined" != typeof(this.Content[this.CurPos.ContentPos].RecalculateCurPos) )
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].PageNum + this.Content[this.CurPos.ContentPos].Internal_GetPage();
        }
    },

    DrawPage : function(nPageIndex, pGraphics)
    {
        this.Draw( nPageIndex, pGraphics);
    },

    // Отрисовка содержимого Документа
    Draw : function(nPageIndex, pGraphics)
    {
        if ( "undefined" == typeof(pGraphics) )
            pGraphics = Canvas;

        if ( "undefined" == typeof(nPageIndex) )
            nPageIndex = this.CurPage;

        /*
         pGraphics.BeginPath();
         pGraphics.MoveTo( X_Left_Field, Y_Top_Field );
         pGraphics.LineTo( X_Left_Field, Y_Bottom_Field );
         pGraphics.LineTo( X_Right_Field, Y_Bottom_Field );
         pGraphics.LineTo( X_Right_Field, Y_Top_Field );
         pGraphics.LineTo( X_Left_Field, Y_Top_Field );
         pGraphics.Stroke();
         */

        // Рисуем колонтитулы
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            pGraphics.put_GlobalAlpha(false);

            var PageMetrics = this.Get_PageContentStartPos( nPageIndex );
            pGraphics.DrawHeaderEdit( PageMetrics.Y );
            pGraphics.DrawFooterEdit( PageMetrics.YLimit );
        }
        else
            pGraphics.put_GlobalAlpha(true, 0.4);

        this.HdrFtr.Draw( nPageIndex, pGraphics );

        // Рисуем содержимое документа на данной странице
        if ( docpostype_HdrFtr === this.CurPos.Type )
            pGraphics.put_GlobalAlpha(true, 0.4);
        else
            pGraphics.put_GlobalAlpha(false);

        var Count = this.Content.length;
        for ( var Index = this.Pages[nPageIndex].Pos; Index < Count; Index++ )
        {
            if ( -1 == this.Content[Index].Draw(nPageIndex, pGraphics) )
                break;
        }

        this.Pages[nPageIndex].FlowObjects.Show(pGraphics);

        this.AutoShapes.Draw(pGraphics);
    },

    // Рисуем только то, что нужно нарисовать. См. функцию RecalculateFrom
    Draw2 : function()
    {
        return this.Draw();
        Canvas.MoveTo( X_Left_Field, Y_Top_Field );
        Canvas.LineTo( X_Left_Field, Y_Bottom_Field );
        Canvas.LineTo( X_Right_Field, Y_Bottom_Field );
        Canvas.LineTo( X_Right_Field, Y_Top_Field );
        Canvas.LineTo( X_Left_Field, Y_Top_Field );
        Canvas.Stroke();

        var Start = new Date().getTime();

        var Count = this.Content.length;

        // Очистим нужную часть
        var Top    = 0, bTop = false;
        var Bottom = 0;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            if ( true === Element.NeedReDraw )
            {
                if ( false === bTop )
                {
                    Top = Element.ClearRect.Top;
                    bTop = true;
                }

                if ( Element.Pages.length <= 1 )
                    Bottom = Element.ClearRect.Bottom;
                else
                    Bottom = Element.YLimit;
            }
        }

        Canvas.Clear2( 0, Top, Canvas.Width, Bottom - Top );

        // Рисуем то, что надо перерисовать
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            if ( true === Element.NeedReDraw )
            {
                if ( -1 == Element.Draw() )
                    break;
            }
        }

        //document.getElementById("Draw").innerHTML = "Draw: " + ((new Date().getTime() - Start) / 1000) + " s";
    },

    Add_NewParagraph : function(bRecalculate)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_NewParagraph(bRecalculate);
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Add_NewParagraph) )
                this.Selection.Data.FlowObject.Add_NewParagraph( bRecalculate );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Add_NewParagraph) )
            {
               this.AutoShapes.obj.DocumentContent.Add_NewParagraph( bRecalculate );
                this.RecalculateCurPos();
                this.DrawingDocument.OnRecalculatePage(0, this.Pages[0]);
                this.Document_UpdateSelectionState();
            }


            return false;
        }

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
                    NextId = this.Styles.Get_Next( StyleId );

                    if ( null === NextId )
                        NextId = StyleId;
                }


                if ( StyleId === NextId )
                {
                    // Копируем настройки параграфа
                    Item.CopyPr( NewParagraph );

                    // Копируем последние настройки текста
                    var TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
                    NewParagraph.Content.splice( 0, 0, new ParaTextPr( TextPr ) );
                }
                else
                {
                    NewParagraph.Style_Add( NextId );
                }
            }
            else
            {
                // Копируем контент, начиная с текущей позиции в параграфе до конца параграфа,
                // в новый параграф (первым элементом выставляем настройки текста, рассчитанные
                // для текущей позиции).

                var TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
                NewParagraph.Content = Item.Content.slice( Item.CurPos.ContentPos );
                NewParagraph.Content.splice( 0, 0, new ParaTextPr( TextPr ) );

                Item.Content.length = Item.CurPos.ContentPos;
                Item.Content.push( new ParaEnd() );
                Item.Content.push( new ParaEmpty() );

                // Копируем все настройки в новый параграф. Делаем это после того как определили контент параграфов.
                Item.CopyPr( NewParagraph );
            }

            // Выставляем курсор в начало параграфа
            NewParagraph.CurPos.ContentPos = NewParagraph.Internal_GetStartPos();

            this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

            this.CurPos.ContentPos++;

            // Отмечаем, что последний измененный элемент - предыдущий параграф
            this.ContentLastChangePos = this.CurPos.ContentPos - 1;

            if ( false != bRecalculate )
            {
                this.Recalculate();

                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
            }
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Add_NewParagraph(bRecalculate);
        }
    },

    Add_FlowImage : function(W, H, Img)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_FlowImage(W, H, Img);
        }

        var X = 0;
        var Y = 0;

        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
                this.Remove( 1, true );

            X = this.Content[this.CurPos.ContentPos].CurPos.X;
            Y = this.Content[this.CurPos.ContentPos].CurPos.Y;
        }
        else // if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            X            = this.Selection.Data.FlowObject.X + 5;
            Y            = this.Selection.Data.FlowObject.Y + 5;
            this.CurPage = this.Selection.Data.PageNum;
        }

        var newFlowImage = new FlowImage( ++this.IdCounter, X, Y, W, H, Img, this.DrawingDocument, this.CurPage, this );
        var FlowPos = this.Pages[this.CurPage].FlowObjects.Add( newFlowImage );

        //this.DrawingObjects.Add( newFlowImage );

        // Нам нужно пересчитать все изменения, начиная с текущей страницы.
        this.ContentLastChangePos = this.Pages[this.CurPage].Pos;

        this.Recalculate();

        // Фокусим сам элемент
        if ( this.CurPos.Type == docpostype_FlowObjects && this.Selection.Data.Pos != FlowPos )
        {
            this.Selection.Data.FlowObject.Blur();
        }

        this.CurPos.Type       = docpostype_FlowObjects;
        this.CurPos.ContentPos = FlowPos;

        // Если был селект, тогда убираем его
        if ( true === this.Selection.Use )
            this.Selection_Remove();

        // Прячем курсор
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage( this.CurPage );

        this.Selection.Start = true;
        this.Selection.Use   = true;
        this.Selection.Flag  = selectionflag_Common;

        this.Selection.Data  =
        {
            PageNum    : this.CurPage,      // Номер страницы, на которой находится выделенный объект
            FlowObject : newFlowImage,      // Указатель на выделенный объект
            Pos        : FlowPos            // Номер выделенного объекта в списке объектов страницы
        };

        this.Selection.Data.FlowObject.Focus( X, Y );
        this.Interface_Update_ImagePr();
    },

    Add_InlineImage : function(W, H, Img)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_InlineImage(W, H, Img);
        }

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            if ( flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
                return this.Selection.Data.FlowObject.Add_InlineImage( W, H, Img );

            return;
        }

        if ( this.CurPos.Type == docpostype_FlowShape )
        {
                return this.AutoShapes.obj.DocumentContent.Add_InlineImage( W, H, Img );
        }

        this.Remove_DrawingObjectSelection();
        if ( true == this.Selection.Use )
            this.Remove( 1, true );

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

    FlowImage_Move : function(FlowImageId, oldPageNum, newPageNum)
    {
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
        this.Recalculate();
        this.CurPage = newPageNum; // меняем номер страницы после Recalculate, потому что там он выставляется по Inline содержимому
        this.Interface_Update_ImagePr();
    },

    InlineObject_Move : function(ObjId, X, Y, PageNum)
    {
        var OldPos = this.CurPos.ContentPos;
        var Drawing = this.DrawingObjects.Get_ById( ObjId );
        this.CurPage = PageNum;


        if(this.AutoShapes.InlineObject_Move(Drawing, X, Y, PageNum))
            return;

        var FlowObjects = this.Pages[PageNum].FlowObjects;
        var FlowPos = -1;
        var FlowObject = null;
        // Проверим, не попали ли мы в один из "плавающих" объектов
        if ( -1 != ( FlowPos = FlowObjects.IsPointIn(X,Y) ) && null != ( FlowObject = FlowObjects.Get_ByIndex( FlowPos ) ) && flowobject_Table === FlowObject.Get_Type() )
        {
            this.CurPos.Type       = docpostype_FlowObjects;
            this.CurPos.ContentPos = FlowPos;
            this.Selection.Flag  = selectionflag_Common;

            this.Selection.Data  =
            {
                PageNum    : this.CurPage,      // Номер страницы, на которой находится выделенный объект
                FlowObject : FlowObject,        // Указатель на выделенный объект
                Pos        : FlowPos            // Номер выделенного объекта в списке объектов страницы
            };

            this.Selection.Data.FlowObject.Cursor_MoveAt( X, Y, this.CurPage );
            //this.Selection.Data.FlowObject.Move_Start( X, Y, { ClickCount : 1, Type : g_mouse_event_type_down } );
            //this.Selection.Data.FlowObject.Move_End  ( X, Y, { ClickCount : 1, Type : g_mouse_event_type_up } );

            // Удаляем из текущего элемента объект
            this.DrawingObjects.Remove_ById( ObjId );
            this.Content[OldPos].Remove_DrawingObject( ObjId );
            this.Remove_DrawingObjectSelection();

            return this.Selection.Data.FlowObject.Add_InlineObject( Drawing );
        }
        else
        {
            // Перемещаем курсор в новую точку, и вставляем объект
            var ContentPos = this.Internal_GetContentPosByXY(X,Y);
            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = ContentPos;
            this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage);

            // Удаляем из текущего элемента объект
            this.Content[OldPos].Remove_DrawingObject( ObjId );
            this.Remove_DrawingObjectSelection();

            if ( type_Paragraph == this.Content[ContentPos].GetType() )
                this.Content[ContentPos].Add( Drawing );
            else if ( type_Table == this.Content[ContentPos].GetType() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = ContentPos;
                this.Selection.EndPos   = ContentPos;

                this.Content[ContentPos].Add_InlineObject( Drawing );
            }

            this.ContentLastChangePos = OldPos;
            if ( this.CurPos.ContentPos < this.ContentLastChangePos )
                this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();

            if ( type_Paragraph == this.Content[ContentPos].GetType() )
                this.Select_DrawingObject( ObjId );
        }

        this.Interface_Update_ImagePr();
    },

    Add_InlineObjectXY : function(Obj, X, Y, PageNum)
    {
        this.CurPage = PageNum;

        var FlowObjects = this.Pages[PageNum].FlowObjects;
        var FlowPos = -1;
        var FlowObject = null;
        // Проверим, не попали ли мы в один из "плавающих" объектов

        if(this.AutoShapes.Add_InlineObjectXY(Obj, X, Y, PageNum))
            return;
        if ( -1 != ( FlowPos = FlowObjects.IsPointIn(X,Y) ) && null != ( FlowObject = FlowObjects.Get_ByIndex( FlowPos ) ) && flowobject_Table === FlowObject.Get_Type() )
        {
            this.CurPos.Type       = docpostype_FlowObjects;
            this.CurPos.ContentPos = FlowPos;
            this.Selection.Flag  = selectionflag_Common;

            this.Selection.Data  =
            {
                PageNum    : this.CurPage,      // Номер страницы, на которой находится выделенный объект
                FlowObject : FlowObject,        // Указатель на выделенный объект
                Pos        : FlowPos            // Номер выделенного объекта в списке объектов страницы
            };

            this.Selection.Data.FlowObject.Cursor_MoveAt( X, Y, this.CurPage );
            //this.Selection.Data.FlowObject.Move_Start( X, Y, { ClickCount : 1, Type : g_mouse_event_type_down } );
            //this.Selection.Data.FlowObject.Move_End  ( X, Y, { ClickCount : 1, Type : g_mouse_event_type_up } );

            return this.Selection.Data.FlowObject.Add_InlineObject( Obj );
        }
        else
        {
            // Перемещаем курсор в новую точку, и вставляем объект
            var ContentPos = this.Internal_GetContentPosByXY(X,Y);
            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = ContentPos;
            this.Content[ContentPos].Cursor_MoveAt( X,Y, false, false, this.CurPage );

            if ( type_Paragraph == this.Content[ContentPos].GetType() )
            {
                this.DrawingObjects.Add( Obj );
                this.Paragraph_Add( Obj );
            }
            else if ( type_Table == this.Content[ContentPos].GetType() )
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = ContentPos;
                this.Selection.EndPos   = ContentPos;

                this.Content[ContentPos].Add_InlineObject( Obj );
            }
        }

        this.Document_UpdateInterfaceState();
    },

    InlineObject_Resize : function(ObjId, W, H)
    {
        var Drawing = this.DrawingObjects.Get_ById( ObjId );
        Drawing.Update_Size( W, H );
        this.ContentLastChangePos = this.CurPos.ContentPos;
        this.Recalculate( true );
        this.Interface_Update_ImagePr();
    },

    Add_FlowTable : function(Cols, Rows)
    {
        //TODO: добавить обработку колонтитулов
        /*
         // Работаем с колонтитулом
         if ( docpostype_HdrFtr === this.CurPos.Type )
         {
         return this.HdrFtr.Add_FlowImage(W, H, Img);
         }
         */

        var X = 0;
        var Y = 0;

        if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
                this.Remove( 1, true );

            this.Internal_CheckCurPage();

            X = this.Content[this.CurPos.ContentPos].CurPos.X;
            Y = this.Content[this.CurPos.ContentPos].CurPos.Y;
        }
        else // if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            X            = this.Selection.Data.FlowObject.X + 5;
            Y            = this.Selection.Data.FlowObject.Y + 5;
            this.CurPage = this.Selection.Data.PageNum;
        }

        var W = X_Right_Field - X + 2 * 1.9;
        var Grid = [];

        for ( var Index = 0; Index < Cols; Index++ )
            Grid[Index] = W / Cols;

        var newFlowTable = new FlowTable( 0, null, this.DrawingDocument, this, X, Y, 100, Y_Bottom_Field, this.CurPage, Rows, Cols, Grid, ++this.IdCounter, true );
        this.Pages[this.CurPage].FlowObjects.Add( newFlowTable );

        // Нам нужно пересчитать все изменения, начиная с текущей страницы.
        this.ContentLastChangePos = this.Pages[this.CurPage].Pos;

        this.Recalculate();

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Add_InlineTable : function(Cols, Rows)
    {
        // TODO: Сделать добавление таблицы в колонтитул

        /*
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_NewParagraph(bRecalculate);
        }
        */

        if ( this.CurPos.ContentPos < 0 )
            return false;

        // TODO: Сделать добавление таблицы в другую таблицу

        /*
        if ( this.CurPos.Type === docpostype_FlowObjects && flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
        {
            this.Selection.Data.FlowObject.Add_InlineTable( Cols, Rows );
        }
        */

        if(this.CurPos.Type === docpostype_FlowShape)
        {
            this.AutoShapes.obj.DocumentContent.Add_InlineTable( Cols, Rows );
            return;
        }

        // Сначала удаляем заселекченую часть
        if ( true === this.Selection.Use )
        {
            this.Remove( 1, true );
        }

        // Добавляем таблицу
        var Item = this.Content[this.CurPos.ContentPos];
        // Если мы внутри параграфа, тогда разрываем его и на месте разрыва добавляем таблицу.
        // А если мы внутри таблицы, тогда добавляем таблицу внутрь текущей таблицы.
        switch ( Item.GetType() )
        {
            case type_Paragraph:
            {
                // Создаем новую таблицу
                var W = ( X_Right_Field - X_Left_Field  + 2 * 1.9);
                var Grid = [];

                for ( var Index = 0; Index < Cols; Index++ )
                    Grid[Index] = W / Cols;

                var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, X_Left_Field, Y_Bottom_Field, Rows, Cols, Grid, ++this.IdCounter );

                // Проверим позицию в текущем параграфе
                if ( true === Item.Cursor_IsEnd() )
                {
                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );

                    this.CurPos.ContentPos++;

                    // Отмечаем, что последний измененный элемент - предыдущий параграф
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                    this.Recalculate();

                    this.Interface_Update_ParaPr();
                    this.Interface_Update_TextPr();
                    this.Interface_Update_TablePr();
                }
                else
                {
                    // Создаем новый параграф
                    var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field, ++this.IdCounter );

                    // Копируем контент, начиная с текущей позиции в параграфе до конца параграфа,
                    // в новый параграф (первым элементом выставляем настройки текста, рассчитанные
                    // для текущей позиции).

                    var TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
                    NewParagraph.Content = Item.Content.slice( Item.CurPos.ContentPos );
                    NewParagraph.Content.splice( 0, 0, new ParaTextPr( TextPr ) );

                    Item.Content.length = Item.CurPos.ContentPos;
                    Item.Content.push( new ParaEnd() );
                    Item.Content.push( new ParaEmpty() );

                    // Копируем все настройки в новый параграф. Делаем это после того как определили контент параграфов.
                    Item.CopyPr( NewParagraph );

                    // Добавляем новый параграф
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewParagraph );

                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add( this.CurPos.ContentPos + 1, NewTable );

                    this.CurPos.ContentPos++;

                    // Отмечаем, что последний измененный элемент - предыдущий параграф
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                    this.Recalculate();

                    this.Interface_Update_ParaPr();
                    this.Interface_Update_TextPr();
                    this.Interface_Update_TablePr();
                }

                break;
            }

            case type_Table:
            {
                // TODO: Сделать добавление таблицы внутри таблицы
                break;
            }
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    CheckRange : function(X0, Y0, X1, Y1, PageNum)
    {
        var HdrFtrRanges = this.HdrFtr.CheckRange(X0, Y0, X1, Y1, PageNum);

        if ( "undefined" != typeof(this.Pages[PageNum]) )
            return this.Pages[PageNum].FlowObjects.CheckRange(X0, Y0, X1, Y1, HdrFtrRanges );

        return [];
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Paragraph_Add(ParaItem, bRecalculate);
        }

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Paragraph_Add) )
            {
                return this.Selection.Data.FlowObject.Paragraph_Add( ParaItem, bRecalculate );
            }
            return false;
        }

        if(this.CurPos.Type===docpostype_FlowShape)
        {
            this.NeedTargetUpdate = true;
            this.AutoShapes.obj.Paragraph_Add(ParaItem, bRecalculate);
            this.AutoShapes.obj.RecalculateDC();
            this.RecalculateCurPos();
            this.DrawingDocument.OnRecalculatePage(0, this.Pages[0]);
            this.Document_UpdateSelectionState();
            return false;
        }

        this.Remove_DrawingObjectSelection();

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
                                this.Content[Index].Add( Common_CopyObj( ParaItem ) );
                            }

                            if ( false != bRecalculate )
                            {
                                // Нам нужно пересчитать все изменения, начиная с первого элемента,
                                // попавшего в селект.
                                this.ContentLastChangePos = StartPos;
                                this.Recalculate();
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

                    this.Selection_Draw();

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
                // TODO: PageBreak в параграф не ставим
                return;
            }
        }
        else
        {
            Item.Add( ParaItem );

            if ( false != bRecalculate )
            {
                // Нам нужно пересчитать все изменения, начиная с текущего элемента
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate(true);

                if ( type_Paragraph == Item.GetType() )
                {
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }
        }
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if ( "undefined" === typeof(bRemoveOnlySelection) )
            bRemoveOnlySelection = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var Res = this.HdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.Document_UpdateInterfaceState();
            return Res;
        }


         if(this.CurPos.Type===docpostype_FlowShape)
        {
            this.NeedTargetUpdate = true;
             this.AutoShapes.obj.DocumentContent.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.RecalculateCurPos();
            this.DrawingDocument.OnRecalculatePage(0, this.Pages[0]);
            this.Document_UpdateSelectionState();
            return false;
        }


        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    var ImgX = this.Selection.Data.FlowObject.X;
                    var ImgY = this.Selection.Data.FlowObject.Y;

                    this.Selection.Data.FlowObject.Blur();
                    this.Pages[this.Selection.Data.PageNum].FlowObjects.Objects.splice( this.Selection.Data.Pos, 1 );

                    this.CurPos.Type = docpostype_Content;
                    this.Cursor_MoveAt( ImgX, ImgY, false );

                    // TODO: изменить
                    this.ContentLastChangePos = 0;
                    this.Recalculate();

                    this.Document_UpdateInterfaceState();

                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Remove( Count, bOnlyText, bRemoveOnlySelection );

                    break;
                }
            }

            return true;
        }

        if ( true === this.Selection.Use && selectionflag_DrawingObject === this.Selection.Flag )
        {
            var ObjId = this.Selection.Data.DrawingObject.Get_Id();
            this.Content[this.CurPos.ContentPos].Remove_DrawingObject( ObjId );
            this.DrawingObjects.Remove_ById( ObjId );
            this.Remove_DrawingObjectSelection();

            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
            this.Document_UpdateInterfaceState();
            return;
        }

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
            this.Selection.StartPos = 0;
            this.Selection.EndPos   = 0;

            //Interface.FlyTextPr_Remove();
            this.DrawingDocument.TargetStart();

            // Позиция, с которой надо начать пересчет, если был удален FlowObject
            var FlowObjChangePos = -1;

            if ( StartPos != EndPos )
            {
                var StartType = this.Content[StartPos].GetType();
                var EndType   = this.Content[EndPos].GetType();

                var bStartEmpty, bEndEmpty;

                if ( type_Paragraph == StartType )
                {
                    // Удаляем все "плавающие" объекты, присутствующие в данном параграфе
                    var FlowObjects = this.Content[StartPos].Get_FlowObjects( false );
                    for ( var Index = 0; Index < FlowObjects.length; Index++ )
                    {
                        var FlowObject = FlowObjects[Index];
                        this.Pages[FlowObject.PageNum].FlowObjects.Remove_ById( FlowObject.Get_Id() );

                        if ( -1 == FlowObjChangePos || FlowObjChangePos < this.Pages[FlowObject.PageNum].Pos )
                            FlowObjChangePos = this.Pages[FlowObject.PageNum].Pos;
                    }

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
                    // Удаляем все "плавающие" объекты, присутствующие в данном параграфе
                    var FlowObjects = this.Content[EndPos].Get_FlowObjects( true );
                    for ( var Index = 0; Index < FlowObjects.length; Index++ )
                    {
                        var FlowObject = FlowObjects[Index];
                        this.Pages[FlowObject.PageNum].FlowObjects.Remove_ById( FlowObject.Get_Id() );

                        if ( -1 == FlowObjChangePos || FlowObjChangePos < this.Pages[FlowObject.PageNum].Pos )
                            FlowObjChangePos = this.Pages[FlowObject.PageNum].Pos;
                    }

                    // Удаляем выделенную часть параграфа
                    this.Content[EndPos].Remove( 1, true );

                    bEndEmpty = this.Content[EndPos].IsEmpty()
                }
                else if ( type_Table == EndType )
                {
                    // Нам нужно удалить все выделенные строки в таблице
                    bEndEmpty = !(this.Content[EndPos].Row_Remove2());
                }

                var FlowObjChangePos2 = -1;
                if ( true != bStartEmpty && true != bEndEmpty )
                {
                    // Удаляем весь промежуточный контент
                    FlowObjChangePos2 = this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos - 1 );
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
                    FlowObjChangePos2 = this.Internal_Content_Remove( StartPos + 1, EndPos - StartPos );

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

                        if ( -1 == FlowObjChangePos2 )
                            FlowObjChangePos2 = StartPos;
                        else
                            FlowObjChangePos2 = Math.min( FlowObjChangePos2, StartPos );

                        this.CurPos.ContentPos = StartPos + 1;
                        this.Content[StartPos + 1].Cursor_MoveToStartPos();
                    }
                }
                else if ( true != bEndEmpty )
                {
                    // Удаляем весь промежуточный контент и начальный параграф
                    FlowObjChangePos2 = this.Internal_Content_Remove( StartPos, EndPos - StartPos );

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
                        FlowObjChangePos2 = this.Internal_Content_Remove( 1, this.Content.length - 1 );
                    }
                    else
                    {
                        FlowObjChangePos2 = this.Internal_Content_Remove( StartPos, EndPos - StartPos + 1 );
                    }

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

                if ( -1 != FlowObjChangePos2 )
                {
                    if ( -1 == FlowObjChangePos || FlowObjChangePos2 < FlowObjChangePos )
                        FlowObjChangePos = FlowObjChangePos2;
                }
            }
            else
            {
                if ( type_Paragraph == this.Content[StartPos].GetType() )
                {
                    var FlowObjects = this.Content[StartPos].Get_FlowObjects( false );
                    for ( var Index = 0; Index < FlowObjects.length; Index++ )
                    {
                        var FlowObject = FlowObjects[Index];
                        this.Pages[FlowObject.PageNum].FlowObjects.Remove_ById( FlowObject.Get_Id() );

                        if ( -1 == FlowObjChangePos || FlowObjChangePos < this.Pages[FlowObject.PageNum].Pos )
                            FlowObjChangePos = this.Pages[FlowObject.PageNum].Pos;
                    }
                }

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

                        // Нам нужно пересчитать все изменения, начиная с текущего элемента
                        this.ContentLastChangePos = this.CurPos.ContentPos;
                        this.Recalculate();

                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();

                        return;
                    }
                    else if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1] )
                    {
                        // Соединяем текущий и предыдущий параграфы
                        var Cur = this.Content[StartPos];

                        Cur.Content.splice( Cur.Content.length - 2, 2 );
                        // Убираем нумерацию, если она была у следующего параграфа
                        this.Content[this.CurPos.ContentPos + 1].Numbering_Remove();

                        Cur.Content = Cur.Content.concat( this.Content[this.CurPos.ContentPos + 1].Content );
                        this.Internal_Content_Remove( StartPos + 1, 1 );

                        this.Interface_Update_ParaPr();
                    }
                }
            }

            // В текущей позиции this.CurPos.ContentPos может оказаться, либо оставшийся параграф,
            // после удаления (если параграфы удалялись не целиком), либо следующий за ним, либо
            // перед ним. В любом случае, ничего не испортится если мы у текущего параграфа удалим
            // селект.
            this.Content[this.CurPos.ContentPos].Selection_Remove();

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            if ( -1 != FlowObjChangePos )
                this.ContentLastChangePos = Math.min( FlowObjChangePos, this.CurPos.ContentPos );
            else
                this.ContentLastChangePos = this.CurPos.ContentPos;

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
                            // Соединяем текущий и предыдущий параграфы
                            var Prev = this.Content[this.CurPos.ContentPos - 1];

                            // Запоминаем новую позицию курсора, после совмещения параграфов
                            var NewPos = Prev.Content.length - 2;
                            // TODO: проверить, надо ли высчитывать TextPr для начала параграфа, который мы присоединяем
                            Prev.Content.splice( Prev.Content.length - 2, 2 );
                            Prev.Content = Prev.Content.concat(this.Content[this.CurPos.ContentPos].Content );

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
                    else if ( Count > 0 )
                    {
                        if ( this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType() )
                        {
                            // Соединяем текущий и следующий параграфы
                            var Cur = this.Content[this.CurPos.ContentPos];
                            // TODO: проверить, надо ли высчитывать TextPr для начала параграфа, который мы присоединяем
                            Cur.Content.splice( Cur.Content.length - 2, 2 );

                            // Убираем нумерацию, если она была у следующего параграфа
                            this.Content[this.CurPos.ContentPos + 1].Numbering_Remove();

                            Cur.Content = Cur.Content.concat( this.Content[this.CurPos.ContentPos + 1].Content );

                            var DrawingObjects = [];
                            for ( var Index = 0; Index < this.Content[this.CurPos.ContentPos + 1].Content.length; Index++ )
                            {
                                var ParaItem = this.Content[this.CurPos.ContentPos + 1].Content[Index];
                                if ( para_Drawing == ParaItem.Type )
                                    DrawingObjects.push( ParaItem );
                            }
                            this.Internal_Content_Remove( this.CurPos.ContentPos + 1, 1 );

                            for ( var Index = 0; Index < DrawingObjects.length; Index++ )
                            {
                                this.DrawingObjects.Add( DrawingObjects[Index] );
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
                        this.Recalculate(true);
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

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    Cursor_MoveLeft : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveLeft(AddToSelect);
        }



         if ( docpostype_FlowShape === this.CurPos.Type )
       {
            this.AutoShapes.obj.DocumentContent.Cursor_MoveLeft(AddToSelect);
           this.RecalculateCurPos();

           return;
       }
        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Selection.Data.FlowObject.X--;
                    this.Selection.Data.FlowObject.Update();

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

                        if ( type_Paragraph == Item.GetType()  )
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
                }

                // Проверяем не обнулился ли селект в последнем элементе. Такое могло быть, если была
                // заселекчена одна буква в последнем параграфе, а мы убрали селект последним действием.
                if ( this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse() )
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

                        if ( type_Paragraph == Item.GetType()  )
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
                }
            }
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Cursor_MoveRight : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveRight(AddToSelect);
        }


         if ( docpostype_FlowShape === this.CurPos.Type )
       {
            this.AutoShapes.obj.DocumentContent.Cursor_MoveRight(AddToSelect);
           this.RecalculateCurPos();

           return;
       }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Selection.Data.FlowObject.X++;
                    this.Selection.Data.FlowObject.Update();

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

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Добавляем к селекту
                if ( false === this.Content[this.Selection.EndPos].Cursor_MoveRight( 1, true ) )
                {
                    // Нужно перейти в начало следующего элемента
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
                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight( 1, false ) )
                {
                    if ( this.Content.length - 1 === this.CurPos.ContentPos )
                    {
                        var Item = this.Content[this.CurPos.ContentPos];
                        var StartPos = Item.Internal_GetEndPos();

                        Item.CurPos.ContentPos  = StartPos;
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
                }
            }
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveUp(AddToSelect);
        }


        if ( docpostype_FlowShape === this.CurPos.Type )
       {
            this.AutoShapes.obj.DocumentContent.Cursor_MoveUp(AddToSelect);
           this.RecalculateCurPos();

           return;
       }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Selection.Data.FlowObject.Y--;
                    this.Selection.Data.FlowObject.Update();

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

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();

                // Добавляем к селекту

                var Item = this.Content[this.CurPos.ContentPos];
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === Item.Cursor_MoveUp( 1, true ) && 0 != this.CurPos.ContentPos )
                {
                    this.CurPos.ContentPos--;
                    Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    // Перемещаем текущий курсор
                    Item.Cursor_MoveAt( Item.CurPos.RealX, Item.Lines.length - 1, true, true, this.CurPage );

                    if ( false === Item.Selection.Use )
                    {
                        Item.Selection.Use = true;
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
                    Item.Selection.EndPos = Item.CurPos.ContentPos;
                    Item.Selection_Draw();

                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }

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
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp( 1, false ) && 0 != this.CurPos.ContentPos )
                {
                    this.CurPos.ContentPos--;
                    var Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    this.Internal_CheckCurPage();
                    Item.Cursor_MoveAt( Item.CurPos.RealX, Item.Lines.length - 1, true, true, this.CurPage );
                }

                this.Selection_Remove();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);

                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === Item.Cursor_MoveUp( 1, true ) && 0 != this.CurPos.ContentPos )
                {
                    this.CurPos.ContentPos--;
                    Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    // Перемещаем текущий курсор
                    Item.Cursor_MoveAt( Item.CurPos.RealX, Item.Lines.length - 1, true, true, this.CurPage );

                    if ( false === Item.Selection.Use )
                    {
                        Item.Selection.Use = true;
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
                    Item.Selection.EndPos = Item.CurPos.ContentPos;
                    Item.Selection_Draw();

                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    this.CurPos.RealX = Item.CurPos.RealX;
                    this.CurPos.RealY = Item.CurPos.RealY;

                    if ( false === Item.Cursor_MoveUp( 1, false ) && 0 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];

                        Item.CurPos.RealX = this.CurPos.RealX;
                        Item.CurPos.RealY = this.CurPos.RealY;

                        // Проверяем не надо ли изменить текущую страницу
                        this.Internal_CheckCurPage();
                        Item.Cursor_MoveAt( Item.CurPos.RealX, Item.Lines.length - 1, true, true, this.CurPage );
                    }
                }
            }
        }

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveDown(AddToSelect);
        }


         if ( docpostype_FlowShape === this.CurPos.Type )
       {
            this.AutoShapes.obj.DocumentContent.Cursor_MoveDown(AddToSelect);
           this.RecalculateCurPos();

           return;
       }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Selection.Data.FlowObject.Y++;
                    this.Selection.Data.FlowObject.Update();

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

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
        if ( true === this.Selection.Use )
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();

                // Добавляем к селекту
                var Item = this.Content[this.CurPos.ContentPos];
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === Item.Cursor_MoveDown( 1, true ) && this.Content.length - 1 != this.CurPos.ContentPos )
                {
                    this.CurPos.ContentPos++;
                    Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    // Перемещаем текущий курсор
                    Item.Cursor_MoveAt( Item.CurPos.RealX, 0, true, true, this.CurPage );

                    if ( false === Item.Selection.Use )
                    {
                        Item.Selection.Use = true;
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                    }
                    Item.Selection.EndPos = Item.CurPos.ContentPos;
                    Item.Selection_Draw();

                    this.Selection.EndPos = this.CurPos.ContentPos;
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }

                this.CurPos.ContentPos = this.Selection.EndPos;
                this.Internal_CheckCurPage();
                this.RecalculateCurPos();
            }
            else
            {
                // Мы должны переместиться на строку ниже, чем конец селекта
                var End = this.Selection.EndPos;
                if ( End < this.Selection.StartPos )
                    End = this.Selection.StartPos;

                this.CurPos.ContentPos = End;

                var Item = this.Content[this.CurPos.ContentPos];
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown( 1, false ) )
                {
                    if ( this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos++;
                    }
                    else
                    {
                        // Остаемся в последнем параграфе
                    }

                    Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    // Проверяем не изменилась ли текущая страница.
                    this.Internal_CheckCurPage();
                    Item.Cursor_MoveAt( Item.CurPos.RealX, 0, true, true, this.CurPage );

                    this.Interface_Update_ParaPr();
                }

                this.Selection_Remove();
                this.Internal_CheckCurPage();
                this.RecalculateCurPos();
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);

                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                this.CurPos.RealX = Item.CurPos.RealX;
                this.CurPos.RealY = Item.CurPos.RealY;

                if ( false === Item.Cursor_MoveDown( 1, true ) && this.Content.length - 1 != this.CurPos.ContentPos )
                {
                    this.CurPos.ContentPos++;
                    Item = this.Content[this.CurPos.ContentPos];

                    Item.CurPos.RealX = this.CurPos.RealX;
                    Item.CurPos.RealY = this.CurPos.RealY;

                    // Перемещаем текущий курсор
                    Item.Cursor_MoveAt( Item.CurPos.RealX, 0, true, true, this.CurPage );

                    if ( false === Item.Selection.Use )
                    {
                        Item.Selection.Use = true;
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                    }
                    Item.Selection.EndPos = Item.CurPos.ContentPos;
                    Item.Selection_Draw();

                    this.Selection.EndPos = this.CurPos.ContentPos;
                    this.Interface_Update_ParaPr();
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }

                this.CurPos.ContentPos = this.Selection.EndPos;
                this.Internal_CheckCurPage();
                this.RecalculateCurPos();
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    this.CurPos.RealX = Item.CurPos.RealX;
                    this.CurPos.RealY = Item.CurPos.RealY;

                    if ( false === Item.Cursor_MoveDown( 1, AddToSelect ) && this.Content.length - 1 != this.CurPos.ContentPos )
                    {
                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];

                        Item.CurPos.RealX = this.CurPos.RealX;
                        Item.CurPos.RealY = this.CurPos.RealY;

                        // Проверяем не изменилась ли текущая страница.
                        this.Internal_CheckCurPage();
                        Item.Cursor_MoveAt( Item.CurPos.RealX, 0, true, true, this.CurPage );

                        this.Interface_Update_ParaPr();
                    }
                    this.Internal_CheckCurPage();
                    this.RecalculateCurPos();
                }
            }
        }

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        // Работаем с колонтитулом

         if ( docpostype_FlowShape === this.CurPos.Type )
       {
           return this.AutoShapes.obj.DocumentContent.Cursor_MoveEndOfLine(AddToSelect);
       }

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
        }

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
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }
            }
            else
            {
                this.Selection_Remove();

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }

            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);

                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }
            }
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {

          if ( docpostype_FlowShape === this.CurPos.Type )
       {
           return this.AutoShapes.obj.DocumentContent.Cursor_MoveStartOfLine(AddToSelect);
       }
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
        }

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
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }
            }
            else
            {
                this.Selection_Remove();

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }
            }
        }
        else
        {
            if ( true === AddToSelect )
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);

                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }

                // Если после изменения селекта он обнуляется (т.е. ничего не заселекчено), тогда
                // возвращаем курсор и убираем селект.
                if ( this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use )
                {
                    this.Selection.Use = false;
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.SelectEnabled(false);
                }
                else
                {
                    this.Selection_Draw();
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    this.Interface_Update_TextPr();
                }
            }
        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {

        if ( docpostype_FlowShape === this.CurPos.Type )
       {
           return this.AutoShapes.obj.DocumentContent.Cursor_MoveAt(X, Y, AddToSelect);
       }
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_MoveAt(X, Y, AddToSelect);
        }

        this.Remove_DrawingObjectSelection();
        this.Remove_NumberingSelection();
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

    Set_ParagraphAlign : function(Align)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphAlign(Align);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphAlign) )
                this.Selection.Data.FlowObject.Set_ParagraphAlign( Align );

            return false;
        }

         if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphAlign) )
            {
                this.AutoShapes.obj.DocumentContent.Set_ParagraphAlign( Align );
                this.Document_UpdateSelectionState();
            }

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

            // Нам надо определить какие страницы мы должны перерисовать
            var PageStart = -1;
            var PageEnd   = -1;
            for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
            {
                if ( PageStart == -1 && StartPos <= this.Pages[Index + 1].Pos )
                    PageStart = Index;

                if ( PageEnd == -1 && EndPos < this.Pages[Index + 1].Pos )
                    PageEnd = Index;
            }

            if ( -1 === PageStart )
                PageStart = this.Pages.length - 1;
            if ( -1 === PageEnd )
                PageEnd = this.Pages.length - 1;
            for ( var Index = PageStart; Index <= PageEnd; Index++ )
                this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

            this.DrawingDocument.OnEndRecalculate(false, true);

            this.Selection_Draw();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            // При изменении прилегания параграфа, не надо пересчитывать остальные
            // параграфы, т.к. переносы строк не меняются
            Item.Set_Align( Align, true );

            // Ищем страницы, на которых произошли изменения
            // Нам надо определить какие страницы мы должны перерисовать
            var PageStart = -1;
            var PageEnd   = -1;
            for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
            {
                if ( PageStart == -1 && this.CurPos.ContentPos <= this.Pages[Index + 1].Pos )
                    PageStart = Index;

                if ( PageEnd == -1 && this.CurPos.ContentPos < this.Pages[Index + 1].Pos )
                    PageEnd = Index;
            }

            if ( -1 === PageStart )
                PageStart = this.Pages.length - 1;
            if ( -1 === PageEnd )
                PageEnd = this.Pages.length - 1;

            for ( var Index = PageStart; Index <= PageEnd; Index++ )
                this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

            this.DrawingDocument.OnEndRecalculate(false, true);

            this.RecalculateCurPos();
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphAlign( Align );
        }
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphSpacing(Spacing);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphSpacing) )
                this.Selection.Data.FlowObject.Set_ParagraphSpacing( Spacing );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphSpacing) )
            {
                this.AutoShapes.obj.DocumentContent.Set_ParagraphSpacing( Spacing );
                this.Document_UpdateSelectionState();
            }
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
            this.Selection_Draw();

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

    Set_ParagraphTabs : function(Tabs)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphTabs(Tabs);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphTabs) )
                this.Selection.Data.FlowObject.Set_ParagraphTabs( Tabs );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphTabs) )
            {
                this.AutoShapes.obj.DocumentContent.Set_ParagraphTabs( Tabs );
                this.Document_UpdateSelectionState();
            }
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
            this.Selection_Draw();

            editor.Update_ParaTab( Default_Tab_Stop, Tabs );

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Set_Tabs( Tabs );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate( true );

            editor.Update_ParaTab( Default_Tab_Stop, Tabs );
        }
        else if ( type_Table == Item.GetType() )
        {
            Item.Set_ParagraphTabs( Tabs );
            editor.Update_ParaTab( Default_Tab_Stop, Tabs );
        }
    },

    Set_ParagraphIndent : function(Ind)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphIndent(Ind);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphIndent) )
                this.Selection.Data.FlowObject.Set_ParagraphIndent( Ind );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphIndent) )
            {
                this.AutoShapes.obj.DocumentContent.Set_ParagraphIndent( Ind );
                this.Document_UpdateSelectionState();
            }


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
            this.Selection_Draw();

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
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphNumbering(NumInfo);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphNumbering) )
                this.Selection.Data.FlowObject.Set_ParagraphNumbering( NumInfo );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphNumbering) )
                this.AutoShapes.obj.DocumentContent.Set_ParagraphNumbering( NumInfo );

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

            if ( NumInfo.SubType < 0 )
            {
                // Убираем список из всех параграфов попавших в селект
                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    if ( type_Paragraph == this.Content[Index].GetType() )
                        this.Content[Index].Numbering_Remove();
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
            this.Selection_Draw();
            this.Interface_Update_ParaPr();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            var FirstChange = 0;

            if ( NumInfo.SubType < 0 )
            {
                // Убираем список у параграфа
                Item.Numbering_Remove();
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
                            var Prev = this.Content[this.CurPos.ContentPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ( "undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType() )
                            {
                                var PrevNumPr = Prev.Numbering_Get();
                                if ( null != PrevNumPr && true === this.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet ) )
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
                                Item.Numbering_Add( NumId, NumLvl );

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


                            var NumPr = null;
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
                            var Prev = this.Content[this.CurPos.ContentPos - 1];
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


                            if ( type_Paragraph === Item.GetType() )
                            {
                                var OldNumPr = Item.Numbering_Get();
                                if( null != ( OldNumPr ) )
                                    Item.Numbering_Add( NumId, OldNumPr.Lvl );
                                else
                                    Item.Numbering_Add( NumId, NumLvl );
                            }
                            else
                                Item.Numbering_Add( NumId, NumLvl );

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
                        var NumPr = Item.Numbering_Get();
                        var AbstractNum = null;
                        if ( null != NumPr )
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
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphShd(Shd);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphShd) )
                this.Selection.Data.FlowObject.Set_ParagraphShd( Shd );

            return false;
        }


         if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphShd) )
                this.AutoShapes.obj.DocumentContent.Set_ParagraphShd( Shd );

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

                    // Нам надо определить какие страницы мы должны перерисовать
                    var PageStart = -1;
                    var PageEnd   = -1;
                    for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
                    {
                        if ( PageStart == -1 && StartPos <= this.Pages[Index + 1].Pos )
                            PageStart = Index;

                        if ( PageEnd == -1 && EndPos < this.Pages[Index + 1].Pos )
                            PageEnd = Index;
                    }

                    if ( -1 === PageStart )
                        PageStart = this.Pages.length - 1;
                    if ( -1 === PageEnd )
                        PageEnd = this.Pages.length - 1;

                    for ( var Index = PageStart; Index <= PageEnd; Index++ )
                        this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

                    this.DrawingDocument.OnEndRecalculate(false, true);

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

            // Ищем страницы, на которых произошли изменения
            // Нам надо определить какие страницы мы должны перерисовать
            var PageStart = -1;
            var PageEnd   = -1;
            for ( var Index = 0; Index < this.Pages.length - 1; Index++ )
            {
                if ( PageStart == -1 && this.CurPos.ContentPos <= this.Pages[Index + 1].Pos )
                    PageStart = Index;

                if ( PageEnd == -1 && this.CurPos.ContentPos < this.Pages[Index + 1].Pos )
                    PageEnd = Index;
            }

            if ( -1 === PageStart )
                PageStart = this.Pages.length - 1;
            if ( -1 === PageEnd )
                PageEnd = this.Pages.length - 1;

            for ( var Index = PageStart; Index <= PageEnd; Index++ )
                this.DrawingDocument.OnRecalculatePage( Index, this.Pages[Index] );

            this.DrawingDocument.OnEndRecalculate(false, true);
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphShd( Shd );
    },

    Set_ParagraphStyle : function(Name)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphStyle(Name);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphStyle) )
                this.Selection.Data.FlowObject.Set_ParagraphStyle( Name );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphStyle) )
               this.AutoShapes.obj.DocumentContent.Set_ParagraphStyle( Name );

            return false;
        }

        var StyleId = this.Styles.Get_StyleIdByName( Name );

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

            // Нам нужно пересчитать все изменения, начиная с элемента, предшевствующего первому
            // попавшему в селект.
            this.ContentLastChangePos = Math.max( StartPos - 1, 0 );
            this.Recalculate();
            this.Selection_Draw();
            this.Interface_Update_ParaPr();

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            Item.Style_Add( StyleId );

            // Нам нужно пересчитать все изменения, начиная с предыдушего элемента
            this.ContentLastChangePos = Math.max( this.CurPos.ContentPos - 1, 0 );
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

        this.Interface_Update_ParaPr();
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphContextualSpacing(Value);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphContextualSpacing) )
                this.Selection.Data.FlowObject.Set_ParagraphContextualSpacing( Value );

            return false;
        }
         if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphContextualSpacing) )
                this.AutoShapes.obj.DocumentContent.Set_ParagraphContextualSpacing( Value );

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
                    this.Selection_Draw();

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
            Item.Set_ContextualSpacing( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate( true );
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphContextualSpacing( Value );
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphPageBreakBefore(Value);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphPageBreakBefore) )
                this.Selection.Data.FlowObject.Set_ParagraphPageBreakBefore( Value );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphPageBreakBefore) )
                this.AutoShapes.obj.DocumentContent.Set_ParagraphPageBreakBefore( Value );

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
                            Item.Set_PageBreakBefore( Value );
                        else if ( type_Table == Item.GetType() )
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphPageBreakBefore( Value );
                            Item.TurnOn_RecalcEvent();
                        }
                    }

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();
                    this.Selection_Draw();

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
            Item.Set_PageBreakBefore( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate( true );
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphPageBreakBefore( Value );
    },

    Set_ParagraphKeepLines : function(Value)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Set_ParagraphKeepLines(Value);
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Set_ParagraphKeepLines) )
                this.Selection.Data.FlowObject.Set_ParagraphKeepLines( Value );

            return false;
        }

        if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Set_ParagraphKeepLines) )
                this.AutoShapes.obj.DocumentContent.Set_ParagraphKeepLines( Value );

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
                    this.Selection_Draw();

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
            Item.Set_KeepLines( Value );

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate( true );
        }
        else if ( type_Table == Item.GetType() )
            Item.Set_ParagraphKeepLines( Value );
    },

    Set_ImageProps : function(Props)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_ImageProps(Props);
            this.Document_UpdateInterfaceState();
            return;
        }

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            var Drawing = this.Selection.Data.DrawingObject;

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


                var newFlowImage = new FlowImage( ++this.IdCounter, X, Y, W, H, Img, this.DrawingDocument, this.CurPage, this );
                newFlowImage.Paddings = Paddings;
                var FlowPos = this.Pages[this.CurPage].FlowObjects.Add( newFlowImage );

                // Нам нужно пересчитать все изменения, начиная с текущей страницы.
                this.ContentLastChangePos = Math.min( this.Pages[this.CurPage].Pos, this.CurPos.ContentPos );
                this.Recalculate();

                // Фокусим сам элемент
                this.CurPos.Type       = docpostype_FlowObjects;
                this.CurPos.ContentPos = FlowPos;

                // Прячем курсор
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SetCurrentPage( this.CurPage );

                this.Selection.Start = true;
                this.Selection.Use   = true;
                this.Selection.Flag  = selectionflag_Common;

                this.Selection.Data  =
                {
                    PageNum    : this.CurPage,      // Номер страницы, на которой находится выделенный объект
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
                    Drawing.GraphicObj.Img = Props.ImageUrl;

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
                this.Content[ContentPos].Cursor_MoveAt(X,Y, false, false, this.CurPage );

                // Удаляем float картинку
                FlowObject.Blur();
                this.Pages[this.Selection.Data.PageNum].FlowObjects.Objects.splice( this.Selection.Data.Pos, 1 );

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
                if ( "undefined" != typeof( Props.Width ) && null != Props.Width )
                    FlowObject.W = Props.Width;

                if ( "undefined" != typeof( Props.Height ) && null != Props.Height )
                    FlowObject.H = Props.Height;

                if ( "undefined" != typeof( Props.Position ) && null != Props.Position )
                {
                    if ( "undefined" != typeof( Props.Position.X ) && null != Props.Position.X )
                        FlowObject.X = Props.Position.X;

                    if ( "undefined" != typeof( Props.Position.Y ) && null != Props.Position.Y )
                        FlowObject.Y = Props.Position.Y;
                }

                if ( "undefined" != typeof( Props.Paddings ) && null != Props.Paddings )
                {
                    if ( "undefined" != typeof( Props.Paddings.Left ) && null != Props.Paddings.Left )
                        FlowObject.Paddings.Left = Props.Paddings.Left;

                    if ( "undefined" != typeof( Props.Paddings.Right ) && null != Props.Paddings.Right )
                        FlowObject.Paddings.Right = Props.Paddings.Right;

                    if ( "undefined" != typeof( Props.Paddings.Bottom ) && null != Props.Paddings.Bottom )
                        FlowObject.Paddings.Bottom = Props.Paddings.Bottom;

                    if ( "undefined" != typeof( Props.Paddings.Top ) && null != Props.Paddings.Top )
                        FlowObject.Paddings.Top = Props.Paddings.Top;
                }
				if ( "undefined" != typeof( Props.ImageUrl ) && null != Props.ImageUrl )
                    FlowObject.Img = Props.ImageUrl;

                FlowObject.Update();

                this.ContentLastChangePos = this.Pages[this.CurPage].Pos;
                this.Recalculate();
            }
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Set_ImageProps(Props);
            else
                this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
        }

        this.Document_UpdateInterfaceState();
    },

    Set_TableProps : function(Props)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_TableProps(Props);
            this.Document_UpdateInterfaceState();
            return;
        }

        // Inline объекты
        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
            return;

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Set_Props(Props);
            }
            this.Document_UpdateInterfaceState();
            return;
        }

        if ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() )
            this.Content[this.Selection.StartPos].Set_Props(Props);
        else if ( false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType() )
            this.Content[this.CurPos.ContentPos].Set_Props(Props);

        this.Document_UpdateInterfaceState();
    },

    Get_Paragraph_ParaPr : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_ParaPr();

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
                    return this.Selection.Data.FlowObject.Table.Get_Paragraph_ParaPr();
            }

            return null;
        }

        var Result_ParaPr = new Object();
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

            var SId = StartStyleId;

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
            Result_ParaPr.StyleId           = SId;
            Result_ParaPr.NumPr             = NumPr;
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
                Result_ParaPr.Shd               = ParaPr.Shd;
                Result_ParaPr.Tabs              = ParaPr.Tabs;
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
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_TextPr();

        if ( docpostype_FlowShape === this.CurPos.Type )
            if(this.AutoShapes.obj.DocumentContent.Get_Paragraph_TextPr!=undefined)
                return this.AutoShapes.obj.DocumentContent.Get_Paragraph_TextPr();
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
                    return this.Selection.Data.FlowObject.Table.Get_Paragraph_TextPr();
            }

            return null;
        }

        var Result_TextPr = null;

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
            {
                Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos );
            }
            else if ( type_Table == Item.GetType() )
            {
                Result_TextPr = Item.Get_Paragraph_TextPr();
            }
        }

        return Result_TextPr;
    },

    Get_ParagraphIndent : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Get_ParagraphIndent();
        }

        if ( docpostype_FlowShape === this.CurPos.Type )
            if(this.AutoShapes.obj.DocumentContent.Get_ParagraphIndent!=undefined)
                return this.AutoShapes.obj.DocumentContent.Get_ParagraphIndent();
        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Get_ParagraphIndent) )
                return this.Selection.Data.FlowObject.Get_ParagraphIndent();
        }

         if ( this.CurPos.Type === docpostype_FlowShape )
        {
            if ( "undefined" != typeof(this.AutoShapes.obj.DocumentContent.Get_ParagraphIndent) )
                return this.AutoShapes.obj.DocumentContent.Get_ParagraphIndent();
        }

        if ( this.CurPos.ContentPos < 0 )
            return false;

        var Item = this.Content[this.CurPos.ContentPos];
        if ( type_Paragraph == Item.GetType() )
        {
            var ParaPr = Item.Get_CompiledPr2().ParaPr;
            return ParaPr.Ind;
        }
    },

    Set_DocumentMargin : function(MarPr)
    {
        if( "undefined" !== typeof( MarPr.Left ) )
        {
            X_Left_Field = MarPr.Left;
        }

        if( "undefined" !== typeof( MarPr.Right ) )
        {
            X_Right_Field = MarPr.Right;
        }

        if( "undefined" !== typeof( MarPr.Top ) )
        {
            Y_Top_Field = MarPr.Top;
        }

        if( "undefined" !== typeof( MarPr.Bottom ) )
        {
            Y_Bottom_Field = MarPr.Bottom;
        }

        X_Left_Margin   = X_Left_Field;
        X_Right_Margin  = Page_Width - X_Right_Field;
        Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
        Y_Top_Margin    = Y_Top_Field;

        this.HdrFtr.UpdateMargins( 0 );

        this.ContentLastChangePos = 0;
        this.Recalculate();
    },

    Set_DocumentPageSize : function(W, H, bNoRecalc)
    {
        Page_Width  = W;
        Page_Height = H;

        X_Left_Field   = X_Left_Margin;
        X_Right_Field  = Page_Width  - X_Right_Margin;
        Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
        Y_Top_Field    = Y_Top_Margin;

        this.HdrFtr.UpdateMargins( 0, bNoRecalc );

		if(true != bNoRecalc)
		{
			this.ContentLastChangePos = 0;
			this.Recalculate();
		}
    },

    Set_DocumentOrientation : function(Orientation, bNoRecalc)
    {
        if ( this.Orientation === Orientation )
            return;

        this.Orientation = Orientation;

        var old_X_Left_Margin   = X_Left_Margin;
        var old_X_Right_Margin  = X_Right_Margin;
        var old_Y_Bottom_Margin = Y_Bottom_Margin;
        var old_Y_Top_Margin    = Y_Top_Margin;

        if ( orientation_Landscape === Orientation )
        {
            // меняем с книжной на альбомную
            Y_Top_Margin    = old_X_Right_Margin;
            X_Right_Margin  = old_Y_Bottom_Margin;
            Y_Bottom_Margin = old_X_Left_Margin;
            X_Left_Margin   = old_Y_Top_Margin;

            this.Set_DocumentPageSize( Page_Height, Page_Width, bNoRecalc );
        }
        else
        {
            // меняем с альбомной най книжную
            Y_Top_Margin    = old_X_Left_Margin;
            X_Right_Margin  = old_Y_Top_Margin;
            Y_Bottom_Margin = old_X_Right_Margin;
            X_Left_Margin   = old_Y_Bottom_Margin;

            this.Set_DocumentPageSize( Page_Height, Page_Width, bNoRecalc );
        }
    },

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

    // Обновляем данные в интерфейсе о свойствах картинки
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
        else if ( docpostype_FlowShape == this.CurPos.Type )
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

    // Обновляем данные в интерфейсе о свойствах таблицы
    Interface_Update_TablePr : function(Flag)
    {
        var TablePr = null;
        if ( docpostype_FlowObjects == this.CurPos.Type || docpostype_FlowShape == this.CurPos.Type)
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

        if ( true === Flag )
            return TablePr;
        else if ( null != TablePr )
            editor.sync_TblPropCallback( TablePr );
    },

    // Обновляем данные в интерфейсе о свойствах колонотитулов
    Interface_Update_HdrFtrPr : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            editor.sync_HeadersAndFootersPropCallback( this.HdrFtr.Get_Props() );
        }
    },

    Internal_GetContentPosByXY : function(X,Y, PageNum)
    {
        if ( "undefined" === typeof(PageNum) )
            PageNum = this.CurPage;

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

                switch (Item.GetType())
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

    // Убираем селект
    Selection_Remove : function()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Selection_Remove();
                    break;
                }
            }

            return;
        }

        if(this.CurPos.Type==docpostype_FlowShape)
        {
            this.AutoShapes.obj.DocumentContent.Selection_Remove();
            return;
        }

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
                    this.DrawingDocument.SelectEnabled(false);

                    this.Selection.StartPos = 0;
                    this.Selection.EndPos   = 0;

                    // Возвращаем курсор
                    this.DrawingDocument.TargetStart();
                    //Interface.FlyTextPr_Remove();
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
                    this.DrawingDocument.SelectEnabled(false);
                    this.DrawingDocument.TargetStart();

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
                    this.DrawingDocument.SelectEnabled(false);
                    this.DrawingDocument.TargetStart();

                    break;
                }
            }
        }
    },

    // Рисуем селект
    Selection_Draw : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_Draw();
            return;
        }

        if(this.CurPos.Type==docpostype_FlowShape)
        {
            this.AutoShapes.obj.DocumentContent.Selection_Draw();
            return;
        }

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Selection_Draw();
                    break;
                }
            }

            return;
        }

        if ( true === this.Selection.Use )
        {
            this.DrawingDocument.SelectClear();

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

            this.DrawingDocument.SelectShow();
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

        this.DrawingDocument.SelectClear();
    },

    Selection_SetStart : function(X,Y, MouseEvent)
    {
        var bCheckHdrFtr = true;

         if ( docpostype_FlowShape === this.CurPos.Type )
        {
            bCheckHdrFtr = false;
            this.Selection.Start = true;
            this.Selection.Use   = true;
            if (this.AutoShapes.obj.DocumentContent!=undefined && false != this.AutoShapes.obj.DocumentContent.Selection_SetStart( X, Y, this.CurPage, MouseEvent, false ) )
                return;

            this.Selection.Start = false;
            this.Selection.Use   = false;
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            bCheckHdrFtr = false;
            this.Selection.Start = true;
            this.Selection.Use   = true;
            if ( false != this.HdrFtr.Selection_SetStart( X, Y, this.CurPage, MouseEvent, false ) )
                return;

            this.Selection.Start = false;
            this.Selection.Use   = false;
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }

        var FlowObjects = this.Pages[this.CurPage].FlowObjects;
        var FlowPos = -1;
        var DrawingPos = -1;

        var PageMetrics = this.Get_PageContentStartPos( this.CurPage );

        // Проверяем, не попали ли мы в колонтитул
        if ( true === bCheckHdrFtr && MouseEvent.ClickCount >= 2 && ( Y <= PageMetrics.Y || Y > PageMetrics.YLimit ) )
        {
            // Если был заселекчен плавающий объект, удаляем его
            if ( this.CurPos.Type == docpostype_FlowObjects && this.Selection.Data.Pos != FlowPos )
            {
                this.Selection.Data.FlowObject.Blur();
            }

            // Если был селект, тогда убираем его
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            this.CurPos.Type = docpostype_HdrFtr;

            // Переходим к работе с колонтитулами
            MouseEvent.ClickCount = 1;
            this.HdrFtr.Selection_SetStart( X, Y, this.CurPage, MouseEvent, true );
            this.Interface_Update_HdrFtrPr();

            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
        // Проверим, не попали ли мы в один из "плавающих" объектов
        else if ( -1 != ( FlowPos = FlowObjects.IsPointIn(X,Y) ) )
        {
            if ( this.CurPos.Type == docpostype_FlowObjects && this.Selection.Data.Pos != FlowPos )
            {
                this.Selection.Data.FlowObject.Blur();
            }

            // Если был селект, тогда убираем его
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            this.CurPos.Type       = docpostype_FlowObjects;
            this.CurPos.ContentPos = FlowPos;

            var FlowObject = this.Pages[this.CurPage].FlowObjects.Get_ByIndex( FlowPos );

            // Прячем курсор
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SetCurrentPage( this.CurPage );

            this.Selection.Start = true;
            this.Selection.Use   = true;
            this.Selection.Flag  = selectionflag_Common;

            this.Selection.Data  =
            {
                PageNum    : this.CurPage,      // Номер страницы, на которой находится выделенный объект
                FlowObject : FlowObject,        // Указатель на выделенный объект
                Pos        : FlowPos            // Номер выделенного объекта в списке объектов страницы
            };

            this.Selection.Data.FlowObject.Focus( X, Y );
            this.Selection.Data.FlowObject.Move_Start( X, Y, MouseEvent );
        }
        else if ( -1 != ( DrawingPos = this.DrawingObjects.IsPointIn( X,Y, this.CurPage ) ) )
        {
            if ( this.CurPos.Type == docpostype_FlowObjects )
            {
                this.Selection.Data.FlowObject.Blur();
            }

            this.Selection_Remove();

            var Drawing = this.DrawingObjects.Get_ByIndex( DrawingPos );

            // Прячем курсор
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SetCurrentPage( this.CurPage );

            this.Selection.Use  = true;
            this.Selection.Flag = selectionflag_DrawingObject;

            this.Selection.Data =
            {
                //PageNum       : this.CurPage,
                //FlowObject    : Drawing,
                //Pos           : DrawingPos,

                DrawingObject : Drawing
            };


            var ContentPos = this.Internal_GetContentPosByXY(X,Y);
            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = ContentPos;
            this.Content[ContentPos].Cursor_MoveAt( X, Y, false, false, this.CurPage );

            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos   = ContentPos;

            this.Selection_Draw();
            this.Interface_Update_ImagePr();
            this.Interface_Update_ParaPr();
        }
        else
        {
            var bOldSelectionIsCommon = true;
            if ( this.CurPos.Type == docpostype_FlowObjects )
            {
                this.Selection.Data.FlowObject.Blur();
                bOldSelectionIsCommon = false;
            }

            var ContentPos = this.Internal_GetContentPosByXY(X,Y);

            if ( docpostype_Content != this.CurPos.Type )
            {
                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = ContentPos;
                bOldSelectionIsCommon = false;
            }

            var SelectionUse_old = this.Selection.Use;
            var Item = this.Content[ContentPos];

            var bTableBorder = false;
            if ( type_Table == Item.GetType() )
            {
                var TempPNum = this.CurPage - Item.PageNum;
                if ( TempPNum < 0 || TempPNum >= Item.Pages.length )
                    TempPNum = 0;

                var Result = Item.Internal_CheckBorders( X, Y, TempPNum );
                if ( Result.Border != -1 )
                    bTableBorder = true;
            }

            // Убираем селект, кроме случаев либо текущего параграфа, либо при движении границ внутри таблицы
            if ( !(true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) )
            {
                if ( (selectionflag_Common != this.Selection.Flag) || ( true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder )  )
                    this.Selection_Remove();
            }

            this.Selection.Use      = true;
            this.Selection.Start    = true;
            this.Selection.Flag     = selectionflag_Common;

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

                if ( !(type_Table == Item.GetType() && table_Selection_Border == Item.Selection.Type2) )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = ContentPos;
                    this.Selection.EndPos   = ContentPos;
                    this.Selection.Data     = null;
                }
                else
                {
                    this.Selection.Data =
                    {
                        Pos       : ContentPos,
                        Selection : SelectionUse_old
                    };
                }
            }
        }
    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X, Y, MouseEvent)
    {
         if ( docpostype_FlowShape === this.CurPos.Type )
        {
            this.AutoShapes.obj.DocumentContent.Selection_SetEnd(  X, Y, this.CurPage, MouseEvent );
            //this.Interface_Update_HdrFtrPr();
            return;
        }

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_SetEnd(  X, Y, this.CurPage, MouseEvent );
            return;
        }

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

        // Обрабатываем движение границы у таблиц
        if ( null != this.Selection.Data && type_Table == this.Content[this.Selection.Data.Pos].GetType() && table_Selection_Border == this.Content[this.Selection.Data.Pos].Selection.Type2 )
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
            }

            return;
        }

        if ( false === this.Selection.Use )
            return;

        this.Selection_Clear();
        var ContentPos = this.Internal_GetContentPosByXY(X,Y);

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
                // Возвращаем курсор
                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();

                this.Selection.Use = false;
                this.DrawingDocument.SelectEnabled(false);
            }
            else
            {
                // Убираем курсор
                this.DrawingDocument.TargetEnd();
                this.Selection.Use = true;
                this.Selection_Draw();
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
            Item.Selection.Use = true;
            var ItemType = Item.GetType();

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

        this.Selection_Draw();
    },

    // Данный запрос может прийти из внутреннего элемента(параграф, таблица), чтобы узнать
    // происходил ли выделение в пределах одного элеменета.
    Selection_Is_OneElement : function()
    {
        if ( true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos )
            return true;

        return false;
    },

    // Селектим весь параграф
    Select_All : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Select_All();
            return;
        }

        if ( docpostype_FlowShape === this.CurPos.Type )
        {
            this.AutoShapes.obj.DocumentContent.Select_All();
            return;
        }

        if ( true === this.Selection.Use )
            this.Selection_Remove();

        this.DrawingDocument.SelectEnabled(true);
        this.DrawingDocument.TargetEnd();

        this.Selection.Use      = true;
        this.Selection.Start    = false;
        this.Selection.Flag     = selectionflag_Common;

        this.Selection.StartPos = 0;
        this.Selection.EndPos   = this.Content.length - 1;

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            this.Content[Index].Select_All();
        }

        this.Selection_Draw();
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

    Update_CursorType : function(X,Y)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Update_CursorType( X, Y, this.CurPage );
        }

        var FlowObjects = this.Pages[this.CurPage].FlowObjects;
        var FlowPos = -1;
        var DrawingPos = -1;
        // Проверим, не попали ли мы в один из "плавающих" объектов
        if ( -1 != ( FlowPos = FlowObjects.IsPointIn(X,Y) ) )
        {
            var FlowObject = this.Pages[this.CurPage].FlowObjects.Get_ByIndex( FlowPos );
            switch( FlowObject.Get_Type() )
            {
                case flowobject_Image :
                {
                    // Сообщаем линейке, что попали в обычный текст
                    this.DrawingDocument.SetCursorType( "move" );
                    break;
                }
                case flowobject_Table :
                {
                    // Сообщаем линейке, что попали в таблицу
                    FlowObject.Update_CursorType( X, Y, this.CurPage );
                    break;
                }
            }

            return;
        }
        else if ( -1 != ( DrawingPos = this.DrawingObjects.IsPointIn( X, Y, this.CurPage ) ) )
        {
            this.DrawingDocument.SetCursorType( "move" );
            return;
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY(X,Y);
            var Item = this.Content[ContentPos];
            Item.Update_CursorType( X, Y, this.CurPage );
            return;
        }
    },

    OnKeyDown : function(e)
    {
        var bRetValue = false;

        // Обрабатываем нажатие "enter"
        if ( e.KeyCode == 13 )
        {
            if ( e.ShiftKey )
            {
                this.Paragraph_Add( new ParaNewLine( break_Line ) );
            }
            else if ( e.CtrlKey )
            {
                this.Paragraph_Add( new ParaNewLine( break_Page ) );
            }
            else
            {
                this.Add_NewParagraph();
            }

            bRetValue = true;
        }
        // обрабатываем нажатие "backspace"
        else if ( e.KeyCode == 8 )
        {
            this.Remove( -1, true );
            if(docpostype_FlowShape==this.CurPos.Type)
            {
                this.AutoShapes.obj.RecalculateDC();
            }
            bRetValue = true;
        }
        // обрабатываем "tab"
        else if ( e.KeyCode == 9 )
        {
            this.Paragraph_Add( new ParaTab() );
            bRetValue = true;
        }
        // обрабатываем "del"
        else if ( e.KeyCode == 46 )
        {
            this.Remove( 1, true );
            bRetValue = true;
            if(docpostype_FlowShape==this.CurPos.Type)
            {
                this.AutoShapes.obj.RecalculateDC();
            }
            if(this.AutoShapes.State.id==0 )
            {
                this.AutoShapes.Del();
            }

            if(this.AutoShapes.State.id==20 && this.AutoShapes.group.State.id ==0)
            {

                if(this.AutoShapes.group.ArrGlyph.length-1==this.AutoShapes.group.NumSelected)
                {
                    this.AutoShapes.group.Del();
                    History.Add(this.AutoShapes.group, {Type: historyitem_Shape_Group1, num:this.AutoShapes.NumGroup});
                    History.Add(this.AutoShapes.group, {Type: historyitem_Shape_Group2});
                    this.AutoShapes.ArrGlyph[this.AutoShapes.NumGroup]=this.AutoShapes.group.ArrGlyph[0];
                    this.AutoShapes.ArrGlyph[this.AutoShapes.NumGroup].Container=this.AutoShapes;
                    this.AutoShapes.ChangeState(new NullShapeState());
                }
                else if(this.AutoShapes.group.ArrGlyph.length==this.AutoShapes.group.NumSelected)
                {

                    this.AutoShapes.ChangeState(new NullShapeState());
                    this.AutoShapes.Del();
                    History.Add(this.AutoShapes.group, {Type: historyitem_Shape_Group2});
                }
                else
                {

                    this.AutoShapes.group.Del();
                    this.AutoShapes.group.RecalculateAfterResize();
                }
            }
        }
        // Стрелка влево
        else if ( e.KeyCode == 37 )
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
            this.Cursor_MoveLeft( true === e.ShiftKey );
            bRetValue = true;
        }
        // Стрелка вправо
        else if ( e.KeyCode == 39 )
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
            this.Cursor_MoveRight( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // стрелка вверх
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // стрелка вниз
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
            this.Cursor_MoveDown( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
            this.Cursor_MoveEndOfLine( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
            this.Cursor_MoveStartOfLine( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey )
        {
            this.Select_All();
            bRetValue = true;
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C - copy
        {
            Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.KeyCode == 86 && true === e.CtrlKey ) // Ctrl + V - paste
        {
            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
            //не возвращаем true чтобы не было preventDefault
        }
		else if ( e.KeyCode == 88 && true === e.CtrlKey ) // Ctrl + X- cut
        {
            Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.KeyCode == 83 && true === e.CtrlKey ) // Ctrl + S- save
        {
            this.DrawingDocument.m_oWordControl.m_oApi.Save();
            bRetValue = true;
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P- print
        {
            this.DrawingDocument.m_oWordControl.m_oApi.Print();
            bRetValue = true;
        }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnKeyPress : function(e)
    {
        //Ctrl и Atl только для команд, word не водит текста с зажатыми Ctrl или Atl
        //команды полностью обрабатываются в keypress
        if(e.CtrlKey || e.AltKey)
            return false;

        if(this.AutoShapes.State.id==0)
        {
            if(this.AutoShapes.NumSelected==1)
            {
                var i=this.AutoShapes.ArrGlyph.length;
                while(!this.AutoShapes.Selected[i])
                    i--;
                this.AutoShapes.obj=this.AutoShapes.ArrGlyph[i];
                this.AutoShapes.NumEditShape=i;
                this.AutoShapes.obj.text_flag=true;
                this.AutoShapes.ChangeState(new AddTextState());
                this.AutoShapes.Document.CurPos.Type=docpostype_FlowShape;
            }
            else
            {
                this.AutoShapes.NumSelected=0;
                for(i=0; i<this.AutoShapes.Selected.length; i++)
                    this.AutoShapes.Selected[i]=false;
            }
        }

        if(this.AutoShapes.State.id==20&&this.AutoShapes.group.State.id==0)
        {
            if(this.AutoShapes.group.NumSelected==1)
            {
                i=this.AutoShapes.group.ArrGlyph.length;
                while(!this.AutoShapes.group.Selected[i])
                    i--;
                this.AutoShapes.group.obj=this.AutoShapes.group.ArrGlyph[i];
                this.AutoShapes.obj=this.AutoShapes.group.obj;
                this.AutoShapes.NumEditShape=i;
                this.AutoShapes.group.NumEditShape=i;
                this.AutoShapes.group.obj.text_flag=true;
                this.AutoShapes.group.ChangeState(new AddTextState());
                this.AutoShapes.Document.CurPos.Type=docpostype_FlowShape;
            }
            else
            {
                this.AutoShapes.group.NumSelected=0;
                for(i=0; i<this.AutoShapes.group.Selected.length; i++)
                    this.AutoShapes.group.Selected[i]=false;
            }
        }

        var Code;
        if (null != e.Which)
            Code = e.Which;
        else if (e.KeyCode)
            Code = e.KeyCode;
        else
            Code = 0;//special char

        var bRetValue = false;

        if ( 0x20 == Code )
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();
            this.Paragraph_Add( new ParaSpace( 1 ) );
            bRetValue = true;
        }
        /*
        else if ( 1105 == Code )
        {
            this.LoadTestDocument();
            return true;
        }
        */
        else if ( Code > 0x20 )
        {
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();
            this.Paragraph_Add( new ParaText( String.fromCharCode( Code ) ) );
            bRetValue = true;
        }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnMouseDown : function(e, X, Y, PageIndex)
    {
        this.AutoShapes.OnMouseDown(e, X, Y, PageIndex);
        if ( PageIndex < 0 )
            return;

        /*if(this.AutoShapes.State.id==0||this.AutoShapes.State.id==7||
            (this.AutoShapes.State.id==20 && (this.AutoShapes.group.State.id==0||this.AutoShapes.group.State.id==7)))
        {*/
            this.CurPage = PageIndex;
            this.Selection_SetStart( X, Y, e );
            this.Document_UpdateSelectionState();
      //  }
    },

    OnMouseUp : function(e, X, Y, PageIndex)
    {

        this.AutoShapes.OnMouseUp(e, X, Y, PageIndex)

        if ( PageIndex < 0 )
            return;

        if(this.AutoShapes.State.id==0||this.AutoShapes.State.id==7 ||
            (this.AutoShapes.State.id==20 && (this.AutoShapes.group.State.id==0||this.AutoShapes.group.State.id==7) ))
        {
            if ( true === this.Selection.Start )
            {
                this.CurPage = PageIndex;
                this.Selection.Start = false;
                this.Selection_SetEnd( X, Y, e );
                this.Document_UpdateSelectionState();
            }
        }

        this.DrawingDocument.OnRecalculatePage( 0, this.Pages[0] );
    },

    OnMouseMove : function(e, X, Y, PageIndex)
    {
        this.AutoShapes.OnMouseMove(e, X, Y, PageIndex)

        if ( PageIndex < 0 )
            return;

        if(this.AutoShapes.State.id==0||this.AutoShapes.State.id==7||
            (this.AutoShapes.State.id==20 && (this.AutoShapes.group.State.id==0||this.AutoShapes.group.State.id==7)))
        {
            if ( false === this.Selection.Start )
            this.Update_CursorType( X, Y );

            if ( true === this.Selection.Use && true === this.Selection.Start )
            {
                this.CurPage = PageIndex;
                this.Selection_SetEnd( X, Y, e );
                this.Document_UpdateSelectionState();
            }
        }

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
        var Restart = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
        var AbstractNum = null;
        if ( "undefined" != this.Numbering && null != ( AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId) ) )
        {
            for ( var LvlIndex = 0; LvlIndex < 9; LvlIndex++ )
                Restart[LvlIndex] = AbstractNum.Lvl[LvlIndex].Restart;
        }

        var PrevLvl = -1;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && null != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId  )
            {
                // Делаем рестарты, если они нужны
                if ( -1 != PrevLvl && PrevLvl < ItemNumPr.Lvl )
                {
                    for ( var Index2 = PrevLvl + 1; Index2 < 9; Index2++ )
                    {
                        if ( 0 != Restart[Index2] && ( -1 == Restart[Index2] || PrevLvl <= (Restart[Index2] - 1 ) ) )
                            NumInfo[Index2] = 0;
                    }
                }

                if ( "undefined" == NumInfo[ItemNumPr.Lvl] )
                    NumInfo[ItemNumPr.Lvl] = 0;
                else
                    NumInfo[ItemNumPr.Lvl]++;

                for ( var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2-- )
                {
                    if ( "undefined" == NumInfo[Index2] || 0 == NumInfo[Index2] )
                        NumInfo[Index2] = 1;
                }

                PrevLvl = ItemNumPr.Lvl;
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

    Internal_Content_Find : function(Id)
    {
        return 0;

        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            if ( this.Content[Index].GetId() === Id )
                return Index;
        }

        return -1;
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
        this.DrawingDocument.SetCurrentPage( this.CurPage );

        this.Selection.Use  = true;
        this.Selection.Flag = selectionflag_DrawingObject;

        this.Selection.Data =
        {
            DrawingObject : Drawing
        };

        this.Selection_Draw();
        this.Interface_Update_ImagePr();
    },

    // Получем ближающую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_NearestPos( PageNum, X, Y );


        if(this.AutoShapes.Get_NearestPos(PageNum, X, Y))
            return this.AutoShapes.Get_NearestPos(PageNum, X, Y);

         var FlowObjects = this.Pages[PageNum].FlowObjects;
        var FlowPos = -1;
        var FlowObject = null;
        // Проверим, не попали ли мы в один из "плавающих" объектов
        if ( -1 != ( FlowPos = FlowObjects.IsPointIn(X,Y) ) && null != ( FlowObject = FlowObjects.Get_ByIndex( FlowPos ) ) && flowobject_Table === FlowObject.Get_Type() )
        {
            return FlowObject.Get_NearestPos( PageNum, X, Y );
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageNum);
            return this.Content[ContentPos].Get_NearestPos( PageNum, X, Y );

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

        this.Content.splice( Position, 0, NewObject );
        NewObject.Set_DocumentNext( NextObj );
        NewObject.Set_DocumentPrev( PrevObj );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NewObject );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( NewObject );
    },

    Internal_Content_Remove : function(Position, Count)
    {
        var ChangePos = -1;

        if ( Position < 0 || Position >= this.Content.length || Count <= 0 )
            return -1;

        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position + Count];

        if ( "undefined" == typeof(PrevObj) )
            PrevObj = null;

        if ( "undefined" == typeof(NextObj) )
            NextObj = null;

        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( type_Paragraph == this.Content[Position + Index].GetType() )
            {
                var FlowObjects = this.Content[Position + Index].Get_FlowObjects( true );
                for ( var Index2 = 0; Index2 < FlowObjects.length; Index2++ )
                {
                    var FlowObject = FlowObjects[Index2];
                    this.Pages[FlowObject.PageNum].FlowObjects.Remove_ById( FlowObject.Get_Id() );

                    if ( -1 == ChangePos || ChangePos < this.Pages[FlowObject.PageNum].Pos )
                        ChangePos = this.Pages[FlowObject.PageNum].Pos;
                }
            }

            this.Content[Position + Index].PreDelete();
        }
        this.Content.splice( Position, Count );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NextObj );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( PrevObj );

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field, ++this.IdCounter) );

        return ChangePos;
    },

    // AlignV = 0 - Верх, = 1 - низ
    // AlignH  стандартные значения align_Left, align_Center, align_Right
    Document_AddPageNum : function(AlignV, AlignH)
    {
        if ( AlignV >= 0 )
        {
            var PageIndex = this.CurPage;
            if ( docpostype_HdrFtr === this.CurPos.Type )
                PageIndex = this.HdrFtr.Get_CurPage();

            if ( PageIndex < 0 )
                PageIndex = this.CurPage;

            this.HdrFtr.AddPageNum( PageIndex, AlignV, AlignH );
        }
        else
        {
            this.Paragraph_Add( new ParaPageNum() );
        }
    },

    // Type    - верхний или нижний колонтитул
    // Subtype - first, even или default
    Document_AddHdrFtr : function(Type, Subtype)
    {
        this.HdrFtr.AddHeaderOrFooter( Type, Subtype );
        this.Interface_Update_HdrFtrPr();
    },

    Document_RemoveHdrFtr : function(Type, Subtype)
    {
        this.HdrFtr.RemoveHeaderOrFooter( Type, Subtype );
        this.Interface_Update_HdrFtrPr();
    },

    Document_SetHdrFtrDistance : function(Value)
    {
        this.HdrFtr.Set_Distance( Value, Page_Height );
        this.Interface_Update_HdrFtrPr();
    },

    Document_SetHdrFtrBounds : function(Y0, Y1)
    {
        this.HdrFtr.Set_Bounds( Y0, Y1 );
        this.Interface_Update_HdrFtrPr();
    },

    Is_TableCellContent : function()
    {
        return false;
    },

    // Получаем текущий параграф
    Get_CurrentParagraph : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Get_CurrentParagraph();
        }

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                    return null;
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Get_CurrentParagraph();
            }

            return null;
        }

        if ( true === this.Selection.Use && selectionflag_DrawingObject === this.Selection.Flag )
        {
            return null;
        }

        if ( true === this.Selection.Use )
            return null;

        if ( this.CurPos.ContentPos < 0 )
            return null;

        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            if ( true == this.Selection.Use )
                return this.Content[this.Selection.StartPos].Get_CurrentParagraph();
            else
                return this.Content[this.CurPos.ContentPos].Get_CurrentParagraph();
        }
        else if ( type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() )
            return this.Content[this.CurPos.ContentPos];

        return null;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с поиском
//-----------------------------------------------------------------------------------
    Search_Start : function(Str)
    {
        if ( "string" != typeof(Str) || Str.length <= 0 )
            return;

        this.DrawingDocument.StartSearch();

        this.SearchInfo.String   = Str;
        this.SearchInfo.CurPage  = 0;
        this.SearchInfo.StartPos = 0;

        this.SearchInfo.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Search_OnPage()}, 1);
    },

    Search_OnPage : function()
    {
        if ( null === this.SearchInfo.Id )
            return;

        var Count = this.Content.length;
        var CurPage = this.SearchInfo.CurPage;

        var bFlowObjChecked = false;

        var Index = 0;
        for ( Index = this.SearchInfo.StartPos; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.DocumentSearch( this.SearchInfo.String );

            if ( false === bFlowObjChecked )
            {
                this.Pages[CurPage].FlowObjects.DocumentSearch( this.SearchInfo.String );
                bFlowObjChecked = true;
            }

            var bNewPage = false;
            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.Pages[CurPage + TempIndex].FlowObjects.DocumentSearch( this.SearchInfo.String );

                CurPage += Element.Pages.length - 1;
                bNewPage = true;
            }

            if ( bNewPage )
            {
                clearTimeout( this.SearchInfo.Id );

                this.SearchInfo.StartPos = Index + 1;
                this.SearchInfo.CurPage  = CurPage;
                this.SearchInfo.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Search_OnPage()}, 1);

                break;
            }
        }

        if ( Index >= Count )
        {
            this.SearchInfo.Id = null;
            this.Search_Stop( false );
        }
    },

    Search_Stop : function(bChange)
    {
        if ( "undefined" === typeof(bChange) )
            bChange = false;

        if ( null != this.SearchInfo.Id )
        {
            clearTimeout( this.SearchInfo.Id );
            this.SearchInfo.Id = null;
        }

        this.DrawingDocument.EndSearch( bChange );
    },
//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_AddRow(bBefore);
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Row_Add( bBefore );
                FlowObject.Internal_UpdateBounds();

                this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                this.Recalculate();
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
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
    },

    Table_AddCol : function(bBefore)
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_AddCol(bBefore);
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Col_Add( bBefore );
                FlowObject.Internal_UpdateBounds();

                this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                this.Recalculate();
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
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
    },

    Table_RemoveRow : function()
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_RemoveRow();
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;

                if ( false === FlowObject.Table.Row_Remove() )
                {
                    this.Table_RemoveTable();
                }
                else
                {
                    FlowObject.Internal_UpdateBounds();

                    this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                    this.Recalculate();
                }
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
            else
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }
        }
    },

    Table_RemoveCol : function()
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_RemoveCol();
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                if ( false === FlowObject.Table.Col_Remove() )
                {
                    this.Table_RemoveTable();
                }
                else
                {
                    FlowObject.Internal_UpdateBounds();

                    this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                    this.Recalculate();
                }
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
            else
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }
        }
    },

    Table_MergeCells : function()
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_MergeCells();
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                FlowObject.Table.Cell_Merge();
                FlowObject.Internal_UpdateBounds();

                this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                this.Recalculate();
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
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
    },

    Table_SplitCell : function( Cols, Rows )
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_SplitCell(Cols, Rows);
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var FlowObject = this.Selection.Data.FlowObject;
                if ( true === FlowObject.Table.Cell_Split(Rows, Cols) )
                {
                    if ( Rows <= 1 )
                    {
                        this.DrawingDocument.OnRecalculatePage( this.Selection.Data.PageNum, this.LogicDocument.Pages[this.Selection.Data.PageNum] );
                        this.DrawingDocument.OnEndRecalculate(false, true);
                    }
                    else
                    {
                        FlowObject.Internal_UpdateBounds();
                        this.ContentLastChangePos = this.Pages[this.Selection.Data.PageNum].Pos;
                        this.Recalculate();
                    }
                }
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
            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
    },

    Table_RemoveTable : function()
    {
        // TODO: доделать в колонтитуле
        //// Работаем с колонтитулом
        //if ( docpostype_HdrFtr === this.CurPos.Type )
        //{
        //    return this.HdrFtr.Table_RemoveTable();
        //}

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            if ( this.Selection.Data.FlowObject.Get_Type() === flowobject_Table )
            {
                var X = this.Selection.Data.FlowObject.X;
                var Y = this.Selection.Data.FlowObject.Y;

                this.Selection.Data.FlowObject.Blur();
                this.Selection.Data.FlowObject.Table.PreDelete();

                var StartPage = this.Selection.Data.FlowObject.DeleteThis();

                this.CurPos.Type = docpostype_Content;
                this.Cursor_MoveAt( X, Y, false );

                this.ContentLastChangePos = this.Pages[StartPage].Pos;
                this.Recalculate();

                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }

            return;
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            var Pos;
            if ( true === this.Selection.Use )
                Pos = this.Selection.StartPos;
            else
                Pos = this.CurPos.ContentPos;

            var Table = this.Content[Pos];

            this.Selection_Remove();
            Table.PreDelete();
            this.Internal_Content_Remove( Pos, 1 );

            if ( Pos >= this.Content.length - 1 )
                Pos--;

            this.CurPos.Type = docpostype_Content;
            this.CurPos.ContentPos = Pos;
            this.Content[Pos].Cursor_MoveToStartPos();

            this.ContentLastChangePos = Pos;
            this.Recalculate();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function()
    {
        var StartTime = new Date().getTime();

        var FontMap = new Object();

        var CurPage = 0;
        this.Pages[CurPage].FlowObjects.Document_CreateFontMap(FontMap);

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);

            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.Pages[++CurPage].FlowObjects.Document_CreateFontMap(FontMap);
            }
        }

        sendStatus( "CreateFontMap: " + ((new Date().getTime() - StartTime) / 1000) + " s"  );

        return FontMap;
    },

    // Обновляем текущее состояние (определяем где мы находимся, картинка/параграф/таблица/колонтитул)
    Document_UpdateInterfaceState : function()
    {
        // Удаляем весь список
        editor.sync_BeginCatchSelectedElements();

        // Уберем из интерфейса записи о том где мы находимся (параграф, таблица, картинка или колонтитул)
        editor.ClearPropObjCallback();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.Interface_Update_HdrFtrPr();
            this.HdrFtr.Document_UpdateInterfaceState();

            // Сообщаем, что список составлен
            editor.sync_EndCatchSelectedElements();
            return;
        }

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            this.Interface_Update_ImagePr();

            // Сообщаем, что список составлен
            editor.sync_EndCatchSelectedElements();
            return;
        }

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Interface_Update_ImagePr();
                    break;
                }
                case flowobject_Table:
                {
                    this.Interface_Update_TablePr();
                    this.Selection.Data.FlowObject.Document_UpdateInterfaceState();
                    break;
                }
            }

            // Сообщаем, что список составлен
            editor.sync_EndCatchSelectedElements();
            return;
        }

        if(docpostype_FlowShape==this.CurPos.Type)
        {
            if(this.AutoShapes.obj.DocumentContent.Document_UpdateInterfaceState!=undefined)
            this.AutoShapes.obj.DocumentContent.Document_UpdateInterfaceState();
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

        // Сообщаем, что список составлен
        editor.sync_EndCatchSelectedElements();
    },

    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        }

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            return this.DrawingDocument.Set_RulerState_Paragraph( null );
        }

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.DrawingDocument.Set_RulerState_Paragraph( null );
                    break;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Table.Document_UpdateRulersState(this.CurPage);
                    break;
                }
            }
            return;
        }

        if ( true === this.Selection.Use )
        {
            if ( this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                this.Content[this.Selection.StartPos].Document_UpdateRulersState(this.CurPage);
            else
                this.DrawingDocument.Set_RulerState_Paragraph( null );
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Table === Item.GetType() )
                Item.Document_UpdateRulersState(this.CurPage);
            else
                this.DrawingDocument.Set_RulerState_Paragraph( null );
        }
    },

    // Обновляем линейки
    Document_UpdateSelectionState : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Document_UpdateSelectionState();
        }

        if ( docpostype_Content == this.CurPos.Type && selectionflag_DrawingObject == this.Selection.Flag )
        {
            this.Selection_Draw();
            return;
        }

        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                {
                    this.Selection_Draw();
                    return;
                }
                case flowobject_Table:
                {
                    this.Selection.Data.FlowObject.Document_UpdateSelectionState();
                    break;
                }
            }
            return;
        }

        if ( docpostype_FlowShape == this.CurPos.Type )
        {
            var Doc = this.AutoShapes.obj.DocumentContent;

            if ( true === Doc.Is_SelectionUse() )
            {
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);
                this.DrawingDocument.SelectClear();
                Doc.Selection_Draw();
                this.DrawingDocument.SelectShow();
            }
            else
            {
                this.DrawingDocument.TargetShow();
                this.DrawingDocument.SelectEnabled(false);
            }
            return;
        }

        if ( true === this.Selection.Use )
        {
            // Обрабатываем движение границы у таблиц
            if ( null != this.Selection.Data && type_Table == this.Content[this.Selection.Data.Pos].GetType() && table_Selection_Border == this.Content[this.Selection.Data.Pos].Selection.Type2 )
            {
                // Убираем курсор, если он был
                this.DrawingDocument.TargetEnd();
            }
            else
            {
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);
                this.Selection_Draw();
            }
        }
        else
        {
            this.DrawingDocument.SelectEnabled(false);
            this.DrawingDocument.TargetShow();

            this.Selection_Remove();
            this.Internal_CheckCurPage();
            this.RecalculateCurPos();
        }
    },
//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
    Get_StartPage_Absolute : function()
    {
        return 0;
    },

    Get_StartPage_Relative : function()
    {
        return 0;
    },

    Set_CurPage : function(PageNum)
    {
        this.CurPage = Math.min( this.Pages.length - 1, Math.max( 0, PageNum ) );
    },

    Get_CurPage : function(PageNum)
    {
        return this.CurPage;
    },
//-----------------------------------------------------------------------------------
// Привязываем "плавающие картинки"
//-----------------------------------------------------------------------------------
    Internal_Link_FlowObjects : function(PageNum)
    {
        for ( var ObjIndex = 0; ObjIndex < this.Pages[PageNum].FlowObjects.Objects.length; ObjIndex++ )
        {
            var FlowObj = this.Pages[PageNum].FlowObjects.Get_ByIndex( ObjIndex );
            if ( flowobject_Image === FlowObj.Get_Type() )
                this.Internal_Link_FlowObject( FlowObj, PageNum );
        }
    },

    Internal_Link_FlowObject : function(FlowObject, PageNum)
    {
        var X       = FlowObject.X;
        var Y       = FlowObject.Y;

        var Pos = this.Internal_GetContentPosByXY( X, Y, PageNum );
        var Item = this.Content[Pos];

        if ( type_Paragraph != Item.GetType() )
        {
            var TempPos = Pos;
            Y = Page_Height;
            while ( type_Paragraph != Item.GetType() )
            {
                TempPos--;
                if ( TempPos < 0 )
                    break;

                Item = this.Content[TempPos];
            }

            if ( TempPos < 0 )
            {
                TempPos = Pos;
                Y = 0;
                while ( type_Paragraph != Item.GetType() )
                {
                    TempPos++;
                    if ( TempPos >= this.Content.length )
                        return;

                    Item = this.Content[TempPos];
                }
            }

            Pos = TempPos;
            Item = this.Content[Pos];
        }

        Item.Link_FlowObject( X, Y, PageNum, FlowObject );
    },


    Create_NewHistoryPoint : function()
    {
        this.History.Create_NewPoint();
    },

    Document_Undo : function()
    {
        var RecalcData = this.History.Undo();
        this.Internal_Recalculate_After_UndoRedo( RecalcData );
    },

    Document_Redo : function()
    {
        var RecalcData = this.History.Redo();
        this.Internal_Recalculate_After_UndoRedo( RecalcData );
    },

    Internal_Recalculate_After_UndoRedo : function(RecalcData)
    {
        if ( null!= RecalcData )
        {
            var LastChangePos = -1;
            // Сначала пересчитываем колонтитулы (если надо)
            if ( RecalcData.HdrFtr.length > 0 )
            {
                LastChangePos = 0;
                for ( var Index = 0; Index < RecalcData.HdrFtr.length; Index++ )
                {
                    var HdrFtr = RecalcData.HdrFtr[Index];

                    HdrFtr.DocumentRecalc = false;
                    HdrFtr.Recalculate();
                    HdrFtr.DocumentRecalc = true;
                }
            }

            // Пересчитываем все Flow объекты
            for ( var Index = 0; Index < RecalcData.Flow.length; Index++ )
            {
                var FlowObject = RecalcData.Flow[Index];
                var PageNum = FlowObject.Get_PageNum();

                if ( LastChangePos > this.Pages[PageNum].Pos || -1 === LastChangePos )
                    LastChangePos = this.Pages[PageNum].Pos;

                if ( flowobject_Table === FlowObject.Get_Type() )
                {
                    FlowObject.TurnOffRecalc = true;
                    FlowObject.Recalculate();
                    FlowObject.TurnOffRecalc = false;
                }
            }

            if ( -1 != RecalcData.Inline && ( LastChangePos > RecalcData.Inline || -1 === LastChangePos ) )
                LastChangePos = RecalcData.Inline;

            if ( LastChangePos < 0 )
                LastChangePos = 0;

            this.ContentLastChangePos = LastChangePos;

            this.Recalculate();

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
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
                    State = this.Selection.Data.FlowObject.Table.Get_SelectionState();
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

    Set_SelectionState : function(State)
    {
        // Если был заселекчен плавающий объект, удаляем его
        if ( this.CurPos.Type == docpostype_FlowObjects )
            this.Selection.Data.FlowObject.Blur();
        else if ( this.CurPos.Type == docpostype_Content && this.Selection.Flag === selectionflag_DrawingObject )
            this.Selection.Data.DrawingObject.Blur();

        if ( State.length <= 0 )
            return;

        var DocState = State[State.length - 1];

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

        var StateIndex = State.length - 2;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Set_SelectionState( State, StateIndex );
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
                    this.Selection.Data.FlowObject.Table.Set_SelectionState( State, StateIndex );
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

                var CurState = State[StateIndex];
                for ( var Index = StartPos; Index <= EndPos; Index++ )
                {
                    this.Content[Index].Set_SelectionState( CurState[Index - StartPos], CurState[Index - StartPos].length - 1 );
                }
            }
        }
        else
            this.Content[this.CurPos.ContentPos].Set_SelectionState( State, StateIndex );
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                this.Content.splice( Data.Pos, 1 );

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : Data.Pos } );
                break;
            }

            case historyitem_Document_RemoveItem:
            {
                var Pos = Data.Pos;

                var Array_start = this.Content.slice( 0, Pos );
                var Array_end   = this.Content.slice( Pos );

                this.Content = Array_start.concat( Data.Items, Array_end );

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : Data.Pos } );
                break;
            }

            case historyitem_Document_Margin:
            {
                X_Left_Field   = Data.Fields_old.Left;
                X_Right_Field  = Data.Fields_old.Right;
                Y_Top_Field    = Data.Fields_old.Top;
                Y_Bottom_Field = Data.Fields_old.Bottom;

                if ( true === Data.Recalc_Margins )
                {
                    X_Left_Margin   = X_Left_Field;
                    X_Right_Margin  = Page_Width - X_Right_Field;
                    Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                    Y_Top_Margin    = Y_Top_Field;
                }

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_PageSize:
            {
                Page_Width  = Data.Width_old;
                Page_Height = Data.Height_old;

                X_Left_Field   = X_Left_Margin;
                X_Right_Field  = Page_Width  - X_Right_Margin;
                Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
                Y_Top_Field    = Y_Top_Margin;

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_Orientation:
            {
                this.Orientation = Data.Orientation_old;

                Y_Top_Margin    = Data.Margins_old.Top;
                X_Right_Margin  = Data.Margins_old.Right;
                Y_Bottom_Margin = Data.Margins_old.Bottom;
                X_Left_Margin   = Data.Margins_old.Left;

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                var Pos = Data.Pos;
                this.Content.splice( Pos, 0, Data.Item );

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : Data.Pos } );
                break;
            }

            case historyitem_Document_RemoveItem:
            {
                this.Content.splice( Data.Pos, Data.Items.length );

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : Data.Pos } );
                break;
            }

            case historyitem_Document_Margin:
            {
                if( "undefined" !== typeof( Data.Fields_new.Left ) )
                    X_Left_Field = Data.Fields_new.Left;

                if( "undefined" !== typeof( Data.Fields_new.Right ) )
                    X_Right_Field = Data.Fields_new.Right;

                if( "undefined" !== typeof( Data.Fields_new.Top ) )
                    Y_Top_Field = Data.Fields_new.Top;

                if( "undefined" !== typeof( Data.Fields_new.Bottom ) )
                    Y_Bottom_Field = Data.Fields_new.Bottom;

                if ( true === Data.Recalc_Margins )
                {
                    X_Left_Margin   = X_Left_Field;
                    X_Right_Margin  = Page_Width - X_Right_Field;
                    Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                    Y_Top_Margin    = Y_Top_Field;
                }

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_PageSize:
            {
                Page_Width  = Data.Width_new;
                Page_Height = Data.Height_new;

                X_Left_Field   = X_Left_Margin;
                X_Right_Field  = Page_Width  - X_Right_Margin;
                Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
                Y_Top_Field    = Y_Top_Margin;

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_Orientation:
            {
                this.Orientation = Data.Orientation_new;

                Y_Top_Margin    = Data.Margins_new.Top;
                X_Right_Margin  = Data.Margins_new.Right;
                Y_Bottom_Margin = Data.Margins_new.Bottom;
                X_Left_Margin   = Data.Margins_new.Left;

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function(Index)
    {
        return { Type : historyrecalctype_Inline, Data : Index };
    },
//-----------------------------------------------------------------------------------
// Функции для работы со статистикой
//-----------------------------------------------------------------------------------
    Statistics_Start : function()
    {
        this.Statistics.Start();
        this.Statistics.Add_Page();
    },

    Statistics_OnPage : function()
    {
        var Count = this.Content.length;
        var CurPage = this.Statistics.CurPage;

        var bFlowObjChecked = false;

        var Index = 0;
        for ( Index = this.Statistics.StartPos; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.DocumentStatistics( this.Statistics );

            if ( false === bFlowObjChecked )
            {
                this.Pages[CurPage].FlowObjects.DocumentStatistics( this.Statistics );
                bFlowObjChecked = true;
            }

            var bNewPage = false;
            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.Pages[CurPage + TempIndex].FlowObjects.DocumentStatistics( this.Statistics );

                CurPage += Element.Pages.length - 1;
                this.Statistics.Add_Page( Element.Pages.length - 1 );
                bNewPage = true;
            }

            if ( bNewPage )
            {
                this.Statistics.Next( Index + 1, CurPage );
                break;
            }
        }

        if ( Index >= Count )
        {
            this.Statistics_Stop();
        }
    },

    Statistics_Stop : function()
    {
        this.Statistics.Stop();
    },

    SetShapeProperties: function(Prop)
    {

        if(this.AutoShapes.obj!=undefined)
        {

            History.Create_NewPoint();
            var  OldPrp={};

            OldPrp.pH=this.AutoShapes.obj.pH;
            OldPrp.pV=this.AutoShapes.obj.pV;
            OldPrp.ext=clone(this.AutoShapes.obj.ext);
            OldPrp.rot=this.AutoShapes.obj.rot;

            this.AutoShapes.obj.pH=Prop.pH;
            this.AutoShapes.obj.pV=Prop.pV;
            this.AutoShapes.obj.ext=Prop.ext;
            this.AutoShapes.obj.rot=Prop.rot;
            if(!this.AutoShapes.obj.IsGroup())
            {
                OldPrp.line_width=this.AutoShapes.obj.line_width;
                OldPrp.fill_color=clone(this.AutoShapes.obj.fill_color);
                OldPrp.line_color=clone(this.AutoShapes.obj.line_color);
                OldPrp.alpha=this.AutoShapes.obj.alpha;
                OldPrp.tailEnd=clone(this.AutoShapes.obj.tailEnd);
                OldPrp.headEnd=clone(this.AutoShapes.obj.headEnd);
                OldPrp.shadow=clone(this.AutoShapes.obj.shadow);
                OldPrp.flipH=this.AutoShapes.obj.flipH;
                OldPrp.flipV=this.AutoShapes.obj.flipV;

                this.AutoShapes.obj.line_width=Prop.line_width;
                this.AutoShapes.obj.fill_color=Prop.fill_color;
                this.AutoShapes.obj.line_color=Prop.line_color;
                this.AutoShapes.obj.alpha=Prop.alpha;
                this.AutoShapes.obj.tailEnd=Prop.tailEnd;
                this.AutoShapes.obj.headEnd=Prop.headEnd;
                this.AutoShapes.obj.shadow=Prop.shadow;
                this.AutoShapes.obj.flipH=Prop.flipH;
                this.AutoShapes.obj.flipV=Prop.flipV;
            }
            History.Add(this.AutoShapes.obj, {Type:historyitem_Shape_SetProperties, OldPrp: OldPrp, NewPrp: Prop});

            this.AutoShapes.obj.Recalculate();
            this.AutoShapes.obj.Container.RecalculateAfterResize();
        }
        this.DrawingDocument.OnRecalculatePage(0, this.Pages[0]);
    }
};
