/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 7/5/13
 * Time: 7:01 PM
 * To change this template use File | Settings | File Templates.
 */
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

var docpostype_Content        = 0x00;
var docpostype_FlowObjects    = 0x01;
var docpostype_HdrFtr         = 0x02;
var docpostype_DrawingObjects = 0x03;

var selectionflag_Common        = 0x00;
var selectionflag_Numbering     = 0x01;
var selectionflag_DrawingObject = 0x002;

var orientation_Portrait  = 0x00;
var orientation_Landscape = 0x01;

var search_Common              = 0x0000; // Поиск в простом тексте

var search_Header              = 0x0100; // Поиск в верхнем колонтитуле
var search_Footer              = 0x0200; // Поиск в нижнем колонтитуле

var search_HdrFtr_All          = 0x0001; // Поиск в колонтитуле, который находится на всех страницах
var search_HdrFtr_All_no_First = 0x0002; // Поиск в колонтитуле, который находится на всех страницах, кроме первой
var search_HdrFtr_First        = 0x0003; // Поиск в колонтитуле, который находится только на первой страниц
var search_HdrFtr_Even         = 0x0004; // Поиск в колонтитуле, который находится только на четных страницах
var search_HdrFtr_Odd          = 0x0005; // Поиск в колонтитуле, который находится только на нечетных страницах, включая первую
var search_HdrFtr_Odd_no_First = 0x0006; // Поиск в колонтитуле, который находится только на нечетных страницах, кроме первой

// Типы которые возвращают классы CParagraph и CTable после пересчета страницы
var recalcresult_NextElement = 0x00; // Пересчитываем следующий элемент
var recalcresult_PrevPage    = 0x01; // Пересчитываем заново предыдущую страницу
var recalcresult_CurPage     = 0x02; // Пересчитываем заново текущую страницу
var recalcresult_NextPage    = 0x03; // Пересчитываем следующую страницу

// Типы которые возвращают классы CDocument и CDocumentContent после пересчета страницы
var recalcresult2_End      = 0x00; // Документ рассчитан до конца
var recalcresult2_NextPage = 0x01; // Рассчет нужно продолжить

var History = null;
var StartTime;

function Document_Recalculate_Page()
{
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    var FullRecalc    = LogicDocument.FullRecalc;
    LogicDocument.Recalculate_Page( FullRecalc.PageIndex, FullRecalc.Start, FullRecalc.StartIndex );
}

function CDocumentPage()
{
    this.Width   = Page_Width;
    this.Height  = Page_Height;
    this.Margins =
    {
        Left   : X_Left_Field,
        Right  : X_Right_Field,
        Top    : Y_Top_Field,
        Bottom : Y_Bottom_Field
    };

    this.Bounds = new CDocumentBounds(0,0,0,0);
    this.FlowObjects = new FlowObjects(editor.WordControl.m_oLogicDocument, 0); // Используем данный объект только для хранения ссылок на Flow-таблицы
    this.Pos    = 0;
    this.EndPos = 0;

    this.X      = 0;
    this.Y      = 0;
    this.XLimit = 0;
    this.YLimit = 0;
}

CDocumentPage.prototype =
{
    Update_Limits : function(Limits)
    {
        this.X      = Limits.X;
        this.XLimit = Limits.XLimit;
        this.Y      = Limits.Y;
        this.YLimit = Limits.YLimit;
    },

    Shift : function(Dx, Dy)
    {
        this.X      += Dx;
        this.XLimit += Dx;
        this.Y      += Dy;
        this.YLimit += Dy;

        this.Bounds.Shift( Dx, Dy );
    }
};

function CStatistics(LogicDocument)
{
    this.LogicDocument = LogicDocument;

    this.Id = null;

    this.StartPos = 0;
    this.CurPage  = 0;

    this.Pages           = 0;
    this.Words           = 0;
    this.Paragraphs      = 0;
    this.SymbolsWOSpaces = 0;
    this.SymbolsWhSpaces = 0;
}

CStatistics.prototype =
{
//-----------------------------------------------------------------------------------
// Функции для запуска и остановки сбора статистики
//-----------------------------------------------------------------------------------
    Start : function()
    {
        this.StartPos = 0;
        this.CurPage  = 0;

        this.Pages           = 0;
        this.Words           = 0;
        this.Paragraphs      = 0;
        this.SymbolsWOSpaces = 0;
        this.SymbolsWhSpaces = 0;

        this.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Statistics_OnPage()}, 1);
        this.Send();
    },

    Next : function(StartPos, CurPage)
    {
        clearTimeout( this.Id );

        this.StartPos = StartPos;
        this.CurPage  = CurPage;

        this.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Statistics_OnPage()}, 1);
        this.Send();
    },

    Stop : function()
    {
        if ( null != this.Id )
        {
            this.Send();
            clearTimeout( this.Id );
            this.Id = null;

            editor.sync_GetDocInfoEndCallback();
        }
    },

    Send : function()
    {
        var Stats =
        {
            PageCount      : this.Pages,
            WordsCount     : this.Words,
            ParagraphCount : this.Paragraphs,
            SymbolsCount   : this.SymbolsWOSpaces,
            SymbolsWSCount : this.SymbolsWhSpaces
        };

        editor.sync_DocInfoCallback( Stats );
    },
//-----------------------------------------------------------------------------------
// Функции для пополнения статистики
//-----------------------------------------------------------------------------------
    Add_Paragraph : function (Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Paragraphs += Count;
        else
            this.Paragraphs++;
    },

    Add_Word : function(Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Words += Count;
        else
            this.Words++;
    },

    Add_Page : function(Count)
    {
        if ( "undefined" != typeof( Count ) )
            this.Pages += Count;
        else
            this.Pages++;
    },

    Add_Symbol : function(bSpace)
    {
        this.SymbolsWhSpaces++;
        if ( true != bSpace )
            this.SymbolsWOSpaces++;
    }
};

function CPresentation(DrawingDocument)
{
    this.History = new CHistory(this);
    History = this.History;

    // Создаем глобальные объекты, необходимые для совместного редактирования
    this.IdCounter = g_oIdCounter;

    this.TableId = new CTableId();
    g_oTableId = this.TableId;

    this.CollaborativeEditing = new CCollaborativeEditing();
    CollaborativeEditing = this.CollaborativeEditing;
    //------------------------------------------------------------------------

    this.Id = g_oIdCounter.Get_NewId();

    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.Orientation = orientation_Portrait; // ориентация страницы
    this.StyleCounter = 0;
    this.NumInfoCounter = 0;

    // Сначала настраиваем размеры страницы и поля
    this.SectPr = new SectPr();
    this.SectPr.Set_PageSize( 793.7, 1122,53 );
    this.SectPr.Set_PageMargins( { Left : 75.6  }  );


    this.ContentLastChangePos = 0;

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 0, // в зависимости, от параметра Type: позиция в Document.Content
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
        Data     : null,
        UpdateOnRecalc : false
    };

    // Здесь мы храним инфрмацию, связанную с разбивкой на страницы и самими страницами
    this.Pages = new Array();

    this.RecalcInfo =
    {
        FlowObject                : null,   // Текущий float-объект, который мы пересчитываем
        FlowObjectPageBreakBefore : false,  // Нужно ли перед float-объектом поставить pagebreak
        FlowObjectPage            : 0,      // Количество обработанных страниц

        WidowControlParagraph     : null,   // Параграф, который мы пересчитываем из-за висячих строк
        WidowControlLine          : -1      // Номер строки, перед которой надо поставить разрыв страницы
    };
    this.RecalcId   = 0; // Номер пересчета
    this.FullRecalc = new Object();
    this.FullRecalc.Id = null;
    this.FullRecalc.X  = 0;
    this.FullRecalc.Y  = 0;
    this.FullRecalc.StartPos = 0;
    this.FullRecalc.CurPage  = 0;

    this.TurnOffRecalc = false;

    this.Numbering = new CNumbering();
    this.Styles    = new CStyles();

    this.DrawingDocument = DrawingDocument;

    this.NeedUpdateTarget = false;

    this.viewMode = false;
    // Класс для работы с поиском
    this.SearchInfo =
    {
        Id       : null,
        StartPos : 0,
        CurPage  : 0,
        String   : null
    };

    // Позция каретки
    this.TargetPos =
    {
        X       : 0,
        Y       : 0,
        PageNum : 0
    };

    this.CopyTextPr = null; // TextPr для копирования по образцу
    this.CopyParaPr = null; // ParaPr для копирования по образцу

    // Класс для работы со статискикой документа
    this.Statistics = new CStatistics( this );


    this.Lock = new CLock();

    this.m_oContentChanges = new CContentChanges(); // список изменений(добавление/удаление элементов)


    this.Slides = [];
    this.themes       = [];
    this.slideMasters = [];
    this.slideLayouts = [];
    this.notesMasters = [];
    this.notes        = [];
    this.globalTableStyles = [];

    this.updateSlideIndex = false;
    this.recalcMap = {};

    this.forwardChangeThemeTimeOutId = null;
    this.backChangeThemeTimeOutId = null;
    this.startChangeThemeTimeOutId = null;
    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );

    this.themeLock = new PropLocker(this.Id);
    //this.schemeLock = new PropLocker(this.Id);
    this.slideSizeLock = new PropLocker(this.Id);
}

var selected_None              = -1;
var selected_DrawingObject     = 0;
var selected_DrawingObjectText = 1;

function CSelectedElementsInfo()
{
    this.m_bTable          = false; // Находится курсор или выделение целиком в какой-нибудь таблице
    this.m_bMixedSelection = false; // Попадает ли в выделение одновременно несколько элементов
    this.m_nDrawing        = selected_None;

    this.Reset = function()
    {
        this.m_bSelection      = false;
        this.m_bTable          = false;
        this.m_bMixedSelection = false;
        this.m_nDrawing        = -1;
    };

    this.Set_Table = function()
    {
        this.m_bTable = true;
    };

    this.Set_Drawing = function(nDrawing)
    {
        this.m_nDrawing = nDrawing;
    };

    this.Is_DrawingObjSelected = function()
    {
        return ( this.m_nDrawing === selected_DrawingObject ? true : false );
    };

    this.Set_MixedSelection = function()
    {
        this.m_bMixedSelection = true;
    };

    this.Is_InTable = function()
    {
        return this.m_bTable;
    };

    this.Is_MixedSelection = function()
    {
        return this.m_bMixedSelection;
    };
}

CPresentation.prototype =
{
    // Проводим начальные действия, исходя из Документа
    Init : function()
    {

    },

    Get_Id : function()
    {
        return this.Id;
    },

    Set_Id : function(newId)
    {
        g_oTableId.Reset_Id( this, newId, this.Id );
        this.Id = newId;
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
        g_oIdCounter.Set_Load(true);

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
        this.DrawingDocument.TargetStart();

        var Strings = ["History", "A box of punched cards with several program decks.", "Before text editors existed, computer text was punched into punched cards with keypunch machines. The text was carried as a physical box of these thin cardboard cards, and read into a card-reader. Magnetic tape or disk \"card-image\" files created from such card decks often had no line-separation characters at all, commonly assuming fixed-length 80-character records. An alternative to cards was punched paper tape, generated by teletype (TTY) machines; these did need special characters to indicate ends of records.",         "The first text editors were line editors oriented to teletype- or typewriter- style terminals, which did not provide a window or screen-oriented display. They usually had very short commands (to minimize typing) that reproduced the current line. Among them were a command to print a selected section(s) of the file on the typewriter (or printer) in case of necessity. An \"edit cursor\", an imaginary insertion point, could be moved by special commands that operated with line numbers of specific text strings (context). Later, the context strings were extended to regular expressions. To see the changes, the file needed to be printed on the printer. These \"line-based text editors\" were considered revolutionary improvements over keypunch machines. In case typewriter-based terminals were not available, they were adapted to keypunch equipment. In this case the user needed to punch the commands into the separate deck of cards and feed them into the computer in order to edit the file.",            "When computer terminals with video screens became available, screen-based text editors (sometimes termed just \"screen editors\") became common. One of the earliest \"full screen\" editors was O26 - which was written for the operator console of the CDC 6000 series machines in 1967. Another early full screen editor is vi. Written in the 1970s, vi is still a standard editor[1] for Unix and Linux operating systems. Vi and Emacs are popular editors on these systems. The productivity of editing using full-screen editors (compared to the line-based editors) motivated many of the early purchases of video terminals."];
        var oldPara = this.Content[this.Content.length - 1];
        var Para = new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field );

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
                        break;
                    }
                    default:
                    {
                        Para.Pr.Jc = align_Justify;
                        break;
                    }
                }
                for ( var Index = 0; Index < Strings[i].length; Index++ )
                {
                    if ( " " != Strings[i].charAt( Index )  )
                        Para.Internal_Content_Add( Pos++, new ParaText( Strings[i].charAt( Index ) ) );
                    else
                        Para.Internal_Content_Add( Pos++, new ParaSpace() );
                }

                oldPara = Para;
                Para = new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field );

                oldPara.Set_DocumentNext(Para);
                Para.Set_DocumentPrev(oldPara);
                this.Content.push( Para );
                Pos = 0;
            }
        }

        this.Recalculate();

        var Rand = Math.floor( Math.random() * 100 );
        g_oIdCounter.Set_UserId("" + Rand);
        g_oIdCounter.Set_Load(false);
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

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },

    Is_ThisElementCurrent : function()
    {
        return true;
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

    Get_PageLimits : function(PageIndex)
    {
        return { X : 0, Y : 0, XLimit : Page_Width, YLimit : Page_Height };
    },

    Get_PageFields : function(PageIndex)
    {
        return { X : X_Left_Field, Y : Y_Top_Field, XLimit : X_Right_Field, YLimit : Y_Bottom_Field };
    },


    Recalculate : function()
    {
        for(var i in this.recalcMap)
        {
            if(isRealObject(this.recalcMap[i]) && typeof this.recalcMap[i].recalculate === "function")
                this.recalcMap[i].recalculate();
        }



        this.recalcMap = {};

        if(this.updateSlideIndex)
        {

        }
        this.RecalculateCurPos();
        this.DrawingDocument.OnRecalculatePage( this.CurPage, this.Slides[this.CurPage] );
        this.DrawingDocument.OnEndRecalculate();
    },

    updateSlideIndexes: function()
    {
        for(var i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }
    },


    RecalculateAfterOpen: function()
    {
        var layouts = [], masters = [];
        for(var i = 0;  i < this.Slides.length; ++i)
        {
            var slide = this.Slides[i];
            slide.Width = this.Width;
            slide.Height = this.Height;
            slide.recalculate();
            var layout = slide.Layout;
            var master = layout.Master;
            for(var j = 0; j < masters.length; ++j)
            {
                if(masters[j] === master)
                    break;
            }
            if(j === masters.length)
            {
                master.recalculate();
                masters.push(master);
            }

            for(j = 0; j < layouts.length; ++j)
            {
                if(layouts[j] === layout)
                    break;
            }
            if(j === layouts.length)
            {
                layout.recalculate();
                layouts.push(layout);
            }
        }
    },


    RecalculateAfterUndoRedo: function()
    {

    },

    // bStart - флаг, который говорит, о том рассчитываем мы эту страницу первый раз или нет (за один общий пересчет)
    Recalculate_Page : function(PageIndex, bStart, StartIndex)
    {
        if ( true === bStart )
        {
            this.Pages.length = PageIndex;
            this.Pages[PageIndex] = new CDocumentPage();
            this.Pages[PageIndex].Pos = StartIndex;
            this.DrawingObjects.createGraphicPage(PageIndex);
            this.DrawingObjects.resetDrawingArrays(PageIndex, this);
        }

        var Count = this.Content.length;

        var StartPos = this.Get_PageContentStartPos( PageIndex );

        var X      = StartPos.X;
        var StartY = StartPos.Y;
        var Y      = StartY;
            var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;

        var bReDraw     = true;
        var bContinue   = false;
        var _PageIndex  = PageIndex;
        var _StartIndex = StartIndex;
        var _bStart     = false;

        var Index;
        for ( Index = StartIndex; Index < Count; Index++ )
        {
            // Пересчитываем элемент документа
            var Element = this.Content[Index];

            Element.TurnOff_RecalcEvent();

            var RecalcResult = recalcresult_NextElement;
            var bFlowTable = false;
            if ( type_Table === Element.GetType() && true != Element.Is_Inline() )
            {
                bFlowTable = true;
                if ( null === this.RecalcInfo.FlowObject )
                {
                    if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex )
                    {
                        Element.Set_DocumentIndex( Index );
                        Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                    }

                    this.RecalcInfo.FlowObjectPage = 0;
                    this.RecalcInfo.FlowObject   = Element;
                    this.RecalcInfo.RecalcResult = Element.Recalculate_Page( PageIndex );
                    this.DrawingObjects.addFloatTable( new CFlowTable2( Element, PageIndex ) );
                    RecalcResult = recalcresult_CurPage;
                }
                else if ( Element === this.RecalcInfo.FlowObject )
                {
                    // Если у нас текущая страница совпадает с той, которая указана в таблице, тогда пересчитываем дальше
                    if ( Element.PageNum > PageIndex || ( this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex ) )
                    {
                        this.DrawingObjects.removeFloatTableById(PageIndex - 1, Element.Get_Id());
                        this.RecalcInfo.FlowObjectPageBreakBefore = true;
                        RecalcResult = recalcresult_PrevPage;
                    }
                    else if ( Element.PageNum === PageIndex )
                    {
                        if ( true === this.RecalcInfo.FlowObjectPageBreakBefore )
                        {
                            // Добавляем начало таблицы в конец страницы так, чтобы не убралось ничего
                            Element.Set_DocumentIndex( Index );
                            Element.Reset( X, Page_Height, XLimit, Page_Height, PageIndex );
                            Element.Recalculate_Page( PageIndex );

                            this.RecalcInfo.FlowObjectPage++;
                            RecalcResult = recalcresult_NextPage;
                        }
                        else
                        {
                            if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex )
                            {
                                Element.Set_DocumentIndex( Index );
                                Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                            }

                            RecalcResult = Element.Recalculate_Page( PageIndex );
                            if ( (( 0 === Index && 0 === PageIndex ) || Index != StartIndex) && true != Element.Is_ContentOnFirstPage()  )
                            {
                                this.DrawingObjects.removeFloatTableById(PageIndex, Element.Get_Id());
                                this.RecalcInfo.FlowObjectPageBreakBefore = true;
                                RecalcResult = recalcresult_CurPage;
                            }
                            else
                            {
                                this.RecalcInfo.FlowObjectPage++;

                                if ( recalcresult_NextElement === RecalcResult )
                                {
                                    this.RecalcInfo.FlowObject                = null;
                                    this.RecalcInfo.FlowObjectPageBreakBefore = false;
                                    this.RecalcInfo.FlowObjectPage            = 0;
                                    this.RecalcInfo.RecalcResult              = recalcresult_NextElement;
                                }
                            }
                        }
                    }
                    else
                    {
                        RecalcResult = Element.Recalculate_Page( PageIndex );
                        this.DrawingObjects.addFloatTable( new CFlowTable2( Element, PageIndex ) );

                        if ( recalcresult_NextElement === RecalcResult )
                        {
                            this.RecalcInfo.FlowObject                = null;
                            this.RecalcInfo.FlowObjectPageBreakBefore = false;
                            this.RecalcInfo.RecalcResult              = recalcresult_NextElement;
                        }
                    }
                }
                else
                {
                    // Пропускаем
                    RecalcResult = recalcresult_NextElement;
                }
            }
            else
            {
                if ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex )
                {
                    Element.Set_DocumentIndex( Index );
                    Element.Reset( X, Y, XLimit, YLimit, PageIndex );
                }

                RecalcResult = Element.Recalculate_Page( PageIndex );
            }

            Element.TurnOn_RecalcEvent();

            if ( recalcresult_CurPage === RecalcResult )
            {
                bReDraw     = false;
                bContinue   = true;
                _PageIndex  = PageIndex;
                _StartIndex = StartIndex;
                _bStart     = false;
                break;
            }
            else if ( recalcresult_NextElement === RecalcResult )
            {
                // Ничего не делаем
            }
            else if ( recalcresult_NextPage === RecalcResult )
            {
                this.Pages[PageIndex].EndPos = Index;

                bContinue   = true;
                _PageIndex  = PageIndex + 1;
                _StartIndex = Index;
                _bStart     = true;
                break;
            }
            else if ( recalcresult_PrevPage === RecalcResult )
            {
                bReDraw     = false;
                bContinue   = true;
                _PageIndex  =  Math.max( PageIndex - 1, 0 );
                _StartIndex = this.Pages[_PageIndex].Pos;
                _bStart     = false;
                break;
            }

            if ( true != bFlowTable )
            {
                var Bounds = Element.Get_PageBounds( PageIndex - Element.Get_StartPage_Absolute() );
                Y = Bounds.Bottom;
            }

            if ( docpostype_Content == this.CurPos.Type && Index >= this.ContentLastChangePos && Index == this.CurPos.ContentPos )
            {
                if ( type_Paragraph === Element.GetType() )
                    this.CurPage = Element.PageNum + Element.CurPos.PagesPos;
                else
                    this.CurPage = Element.PageNum; // TODO: переделать
            }
        }

        if ( Index >= Count )
        {
            // До перерисовки селекта должны выставить
            this.Pages[PageIndex].EndPos = Count - 1;
        }

        if ( true === bReDraw )
        {
            this.DrawingDocument.OnRecalculatePage( PageIndex, this.Pages[PageIndex] );
        }

        if ( Index >= Count )
        {
            this.DrawingDocument.OnEndRecalculate( true );
            this.DrawingObjects.onEndRecalculateDocument( this.Pages.length );

            if ( true === this.Selection.UpdateOnRecalc )
            {
                this.Selection.UpdateOnRecalc = false;
                this.DrawingDocument.OnSelectEnd();
            }
            this.FullRecalc.Id = null;
        }

        if ( true === bContinue )
        {
            this.FullRecalc.PageIndex  = _PageIndex;
            this.FullRecalc.Start      = _bStart;
            this.FullRecalc.StartIndex = _StartIndex;

            //this.Recalculate_Page( _PageIndex, _bStart, _StartIndex );

            if ( _PageIndex > this.FullRecalc.StartPage + 2 )
            {
                this.FullRecalc.Id = setTimeout( Document_Recalculate_Page, 20 );
                /*
                 this.FullRecalc.Id = setTimeout( function()
                 {
                 var LogicDocument = editor.WordControl.m_oLogicDocument;
                 var FullRecalc    = LogicDocument.FullRecalc;
                 LogicDocument.Recalculate_Page( FullRecalc.PageIndex, FullRecalc.Start, FullRecalc.StartIndex );
                 }, 10 );
                 */
            }
            else
                this.Recalculate_Page( _PageIndex, _bStart, _StartIndex );

        }
    },

    Stop_Recalculate : function()
    {
        if ( null != this.FullRecalc.Id )
        {
            clearTimeout( this.FullRecalc.Id );
            this.FullRecalc.Id = null;
        }

        this.DrawingDocument.OnStartRecalculate( 0 );
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

            this.Document_UpdateRulersState();
        }
        else
        {
            this.ContentLastChangePos = DocumentIndex;
            this.Recalculate( false, false );
        }
    },

    OnContentReDraw : function(StartPage, EndPage)
    {
        this.ReDraw( StartPage, EndPage );
    },

    CheckTargetUpdate : function()
    {
        if (this.DrawingDocument.UpdateTargetFromPaint === true)
        {
            if (true === this.DrawingDocument.UpdateTargetCheck)
                this.NeedUpdateTarget = this.DrawingDocument.UpdateTargetCheck;
            this.DrawingDocument.UpdateTargetCheck = false;
        }

        if ( true === this.NeedUpdateTarget)
        {
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },

    RecalculateCurPos : function()
    {
        this.Slides[this.CurPage].graphicObjects.recalculateCurPos();
    },

    Internal_CheckCurPage : function()
    {
        if ( this.CurPos.ContentPos >= 0 && ( null === this.FullRecalc.Id || this.FullRecalc.StartIndex > this.CurPos.ContentPos ) )
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
        }
    },

    Set_TargetPos : function(X, Y, PageNum)
    {
        this.TargetPos.X       = X;
        this.TargetPos.Y       = Y;
        this.TargetPos.PageNum = PageNum;
    },

    // Вызываем перерисовку нужных страниц
    ReDraw : function(StartPage, EndPage)
    {
        if ( "undefined" === typeof(StartPage) )
            StartPage = 0;
        if ( "undefined" === typeof(EndPage) )
            EndPage = this.DrawingDocument.m_lCountCalculatePages;

        for ( var CurPage = StartPage; CurPage <= EndPage; CurPage++ )
            this.DrawingDocument.OnRepaintPage( CurPage );
    },

    DrawPage : function(nPageIndex, pGraphics)
    {
        this.Draw( nPageIndex, pGraphics);
    },

    // Отрисовка содержимого Документа
    Draw : function(nPageIndex, pGraphics)
    {
        this.Slides[nPageIndex].draw(pGraphics);
    },

    Add_NewParagraph : function(bRecalculate)
    {
        this.Slides[this.CurPage].graphicObjects.addNewParagraph(bRecalculate);
        this.Recalculate();
        this.Slides[this.CurPage].graphicObjects.updateSelectionState();
    },

    GroupGraphicObjects: function()
    {
        if(this.CanGroup())
        {
            this.DrawingObjects.groupSelectedObjects();
        }
    },

    UnGroupGraphicObjects: function()
    {
        if(this.CanUnGroup())
        {
            this.DrawingObjects.unGroupSelectedObjects();
        }
    },

    StartChangeWrapPolygon: function()
    {
        this.DrawingObjects.startChangeWrapPolygon();
    },

    CanChangeWrapPolygon: function()
    {
        return this.DrawingObjects.canChangeWrapPolygon();
    },

    CanGroup: function()
    {
        return this.DrawingObjects.canGroup();
    },

    CanUnGroup: function()
    {
        return this.DrawingObjects.canUnGroup();
    },

    Add_FlowImage : function(W, H, Img)
    {
        this.Slides[this.CurPage].graphicObjects.Add_FlowImage(W, H, Img);
        this.Recalculate();
    },

    Add_InlineImage : function(W, H, Img, Chart, bFlow)
    {
        if ( undefined === bFlow )
            bFlow = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Add_InlineImage(W, H, Img, Chart, bFlow);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.addInlineImage( W, H, Img, Chart, bFlow );
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true == this.Selection.Use )
                this.Remove( 1, true );

            var Item = this.Content[this.CurPos.ContentPos];
            if ( type_Paragraph == Item.GetType() )
            {
                var Drawing = new ParaDrawing( W, H, null, this.DrawingDocument, this );
                var Image   = new WordImage( Drawing, this, this.DrawingDocument, null );
                Drawing.Set_GraphicObject(Image);

                if ( true === bFlow )
                {
                    Drawing.Set_DrawingType( drawing_Anchor );
                    Drawing.Set_WrappingType( WRAPPING_TYPE_SQUARE );
                    Drawing.Set_BehindDoc( false );
                    Drawing.Set_Distance( 3.2, 0, 3.2, 0 );
                    Drawing.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
                    Drawing.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
                }

                Image.init( Img, W, H, Chart );
                this.Paragraph_Add( Drawing );
            }
            else if ( type_Table == Item.GetType() )
            {
                Item.Add_InlineImage( W, H, Img, Chart, bFlow );
            }
        }
    },

    Edit_Chart : function(Chart)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Edit_Chart(Chart);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.editChart( Chart );
        }
    },

    Get_ChartObject: function()
    {
        return this.DrawingObjects.getChartObject();
    },

    Add_FlowTable : function(Cols, Rows)
    {
        var X = 0;
        var Y = 0;

        var W = this.Width*2/3;
        var Grid = [];

        for ( var Index = 0; Index < Cols; Index++ )
            Grid[Index] = W / Cols;

        var _cur_slide = this.Slides[this.CurPage];
        var _graphic_frame = new CGraphicFrame(_cur_slide);
        _graphic_frame.spPr.xfrm = new CXfrm();
        _graphic_frame.spPr.xfrm.offX = (this.Width - W)/2;
        _graphic_frame.spPr.xfrm.offY = this.Height/5;
        _graphic_frame.spPr.xfrm.extX = W;
        _graphic_frame.spPr.xfrm.extY =  7.478268771701388 * Rows;
        _graphic_frame.setParent(_cur_slide);
        _graphic_frame.nvGraphicFramePr = new UniNvPr();

        if (this.globalTableStyles.length == 0)
            this.globalTableStyles[0] = CreateDefaultStylesForTables();

        var _table = new CTable(this.DrawingDocument, _graphic_frame/*Parent*/, false/*Inline*/, 0/*PageNum*/, 0/*X*/, 0/*Y*/, W/*XLimit*/, 100/*YLimit*/, Rows, Cols, Grid);
        _table.styleIndex = 0;
        _graphic_frame.graphicObject = _table;
        _graphic_frame.selected = true;
        this.Slides[this.CurPage].addSp(_graphic_frame);
        editor.WordControl.m_oLogicDocument.recalcMap[_graphic_frame.Id] = _graphic_frame;

        this.Recalculate();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, _cur_slide);
        this.DrawingDocument.UpdateTargetTransform(_graphic_frame.TransformMatrix);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },

    Add_InlineTable : function(Cols, Rows)
    {
        // Добавляем таблицу в колонтитул
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Add_InlineTable( Cols, Rows );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.addInlineTable( Cols, Rows );
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( this.CurPos.ContentPos < 0 )
                return false;

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

                    W = Math.max( W, Cols * 2 * 1.9 );

                    for ( var Index = 0; Index < Cols; Index++ )
                        Grid[Index] = W / Cols;

                    var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, X_Left_Field, Y_Bottom_Field, Rows, Cols, Grid );

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
                        var NewParagraph = new Paragraph( this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field );
                        Item.Split( NewParagraph );

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
                    Item.Add_InlineTable( Cols, Rows );
                    break;
                }
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },


    CheckRange : function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum)
    {
        var HdrFtrRanges = this.HdrFtr.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum);
        return this.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum, HdrFtrRanges, null);
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        this.Slides[this.CurPage].paragraphAdd(ParaItem, bRecalculate);
        this.Recalculate();
        this.Slides[this.CurPage].graphicObjects.updateSelectionState();
    },

    Paragraph_ClearFormatting : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Paragraph_ClearFormatting();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.paragraphClearFormatting();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
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

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();

                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
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

                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                }

                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {
        if ( "undefined" === typeof(bRemoveOnlySelection) )
            bRemoveOnlySelection = false;


        this.Slides[this.CurPage].graphicObjects.remove(Count, bOnlyText, bRemoveOnlySelection);
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        return true;
    },

    Cursor_GetPos : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_GetPos();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.cursorGetPos();
        }
        else if ( docpostype_Content === this.CurPos.Type )
        {
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

    Cursor_MoveLeft : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveLeft(AddToSelect, Word);
        return true;
    },

    Cursor_MoveRight : function(AddToSelect, Word)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveRight(AddToSelect, Word);
        return true;
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveUp(AddToSelect);

        return true;
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveDown(AddToSelect);

        return true;
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveEndOfLine(AddToSelect);

        return true;
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveStartOfLine(AddToSelect);

        return true;
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveAt(X, Y, AddToSelect);

        return true;
    },

    Cursor_MoveToCell : function(bNext)
    {

    },

    Set_ParagraphAlign : function(Align)
    {
        this.Slides[this.CurPage].graphicObjects.setParagraphAlign(Align);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        this.Slides[this.CurPage].graphicObjects.setParagraphSpacing(Spacing);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphTabs : function(Tabs)
    {
        this.Slides[this.CurPage].graphicObjects.setParagraphTabs(Tabs);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphIndent : function(Ind)
    {
        this.Slides[this.CurPage].graphicObjects.setParagraphIndent(Ind);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        this.Slides[this.CurPage].graphicObjects.setParagraphNumbering(NumInfo);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphShd : function(Shd)
    {
    },

    Set_ParagraphStyle : function(Name)
    {
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
    },

    Set_ParagraphKeepLines : function(Value)
    {
    },

    Set_ParagraphWidowControl : function(Value)
    {
    },

    Set_ParagraphBorders : function(Borders)
    {

    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {
        this.Slides[this.CurPage].graphicObjects.Paragraph_IncDecFontSize(bIncrease);
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
    },

    Paragraph_SetHighlight : function(IsColor, r, g, b)
    {
    },

    Set_ImageProps : function(Props)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Set_ImageProps(Props);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.setProps( Props );
        }
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            this.Interface_Update_TablePr();
            if ( true == this.Selection.Use )
                this.Content[this.Selection.StartPos].Set_ImageProps(Props);
            else
                this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
        }

        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    ShapeApply: function(shapeProps)
    {
        this.Slides[this.CurPage].graphicObjects.shapeApply(shapeProps);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },

    changeShapeType : function(shapeType)
    {

        if(this.viewMode === true)
        {
            return;
        }

        this.ShapeApply({type: shapeType});
    },

    setVerticalAlign: function(align)
    {
        this.Slides[this.CurPage].graphicObjects.setVerticalAlign(align);
        this.Recalculate();
    },


    Set_TableProps : function(Props)
    {
        this.Slides[this.CurPage].graphicObjects.setTableProps(Props);
        this.Recalculate();

        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },

    Get_Paragraph_ParaPr : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_ParaPr();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphParaPr();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_ParaPr = new CParaPr();
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

                var StartPr, Pr;
                if ( type_Paragraph == this.Content[StartPos].GetType() )
                {
                    StartPr   = this.Content[StartPos].Get_CompiledPr2(false).ParaPr;
                    Pr        = StartPr.Copy();
                    Pr.Locked = this.Content[StartPos].Lock.Is_Locked();
                }
                else if ( type_Table == this.Content[StartPos].GetType() )
                {
                    StartPr   = this.Content[StartPos].Get_Paragraph_ParaPr();
                    Pr        = StartPr.Copy();
                    Pr.Locked = StartPr.Locked;
                }

                for ( var Index = StartPos + 1; Index <= EndPos; Index++ )
                {
                    var Item = this.Content[Index];

                    var TempPr;
                    if ( type_Paragraph == Item.GetType() )
                    {
                        TempPr         = Item.Get_CompiledPr2(false).ParaPr;
                        TempPr.Locked  = Item.Lock.Is_Locked();
                    }
                    else if ( type_Table == Item.GetType() )
                    {
                        TempPr = Item.Get_Paragraph_ParaPr();
                    }

                    Pr = Pr.Compare(TempPr);
                }

                if ( undefined === Pr.Ind.Left )
                    Pr.Ind.Left = StartPr.Ind.Left;

                if ( undefined === Pr.Ind.Right )
                    Pr.Ind.Right = StartPr.Ind.Right;

                if ( undefined === Pr.Ind.FirstLine )
                    Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

                Result_ParaPr             = Pr;
                Result_ParaPr.CanAddTable = ( true === Pr.Locked ? false : true );
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Paragraph == Item.GetType() )
                {
                    var ParaPr = Item.Get_CompiledPr2(false).ParaPr;
                    var Locked = Item.Lock.Is_Locked();

                    Result_ParaPr             = ParaPr.Copy();
                    Result_ParaPr.Locked      = Locked;
                    Result_ParaPr.CanAddTable = ( ( true === Locked ) ? ( ( true === Item.Cursor_IsEnd() ) ? true : false ) : true );
                }
                else if ( type_Table == Item.GetType() )
                {
                    Result_ParaPr = Item.Get_Paragraph_ParaPr();
                }
            }

            return Result_ParaPr;
        }
    },

    Get_Paragraph_TextPr : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_TextPr();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphTextPr();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
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
                {
                    Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos - 1 );
                }
                else if ( type_Table == Item.GetType() )
                {
                    Result_TextPr = Item.Get_Paragraph_TextPr();
                }
            }

            return Result_TextPr;
        }
    },

    Get_Paragraph_TextPr_Copy : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_TextPr_Copy();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphTextPrCopy();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_TextPr = null;

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
                                StartPos_item = Item.Selection.EndPos;

                            VisTextPr = Item.Internal_CalculateTextPr( StartPos_item - 1 );
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
                    Result_TextPr = Item.Internal_CalculateTextPr( Item.CurPos.ContentPos - 1 );
                }
                else if ( type_Table == Item.GetType() )
                {
                    Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
                }
            }

            return Result_TextPr;
        }
    },

    Get_Paragraph_ParaPr_Copy : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_Paragraph_ParaPr_Copy();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getParagraphParaPrCopy();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            var Result_ParaPr = null;

            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        if ( this.Selection.EndPos < StartPos )
                            StartPos = this.Selection.EndPos;

                        var Item = this.Content[StartPos];
                        Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        // Текстовые настройки применяем к конкретной нумерации
                        if ( null == this.Selection.Data || this.Selection.Data.length <= 0 )
                            break;

                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        Result_ParaPr = this.Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl].ParaPr;

                        break;
                    }
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
            }

            return Result_ParaPr;
        }
    },

    Get_AllParagraphs_ByNumbering : function(NumPr)
    {
        var ParaArray = new Array();

        this.HdrFtr.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }

        return ParaArray;
    },

    Set_DocumentMargin : function(MarPr)
    {
        this.History.Add( this, { Type : historyitem_Document_Margin, Fields_old : { Left : X_Left_Field, Right : X_Right_Field, Top : Y_Top_Field, Bottom : Y_Bottom_Field }, Fields_new : MarPr, Recalc_Margins : true } );

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

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_DocumentPageSize : function(W, H, bNoRecalc)
    {
        this.History.Add( this, { Type : historyitem_Document_PageSize, Width_new : W, Height_new : H, Width_old : Page_Width, Height_old : Page_Height } );

        Page_Width  = W;
        Page_Height = H;

        X_Left_Field   = X_Left_Margin;
        X_Right_Field  = Page_Width  - X_Right_Margin;
        Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
        Y_Top_Field    = Y_Top_Margin;

        this.HdrFtr.UpdateMargins( 0, bNoRecalc );

        if( true != bNoRecalc )
        {
            this.ContentLastChangePos = 0;
            this.Recalculate();

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },

    Set_DocumentOrientation : function(Orientation, bNoRecalc)
    {
        if ( this.Orientation === Orientation )
            return;

        var old_Orientation = this.Orientation;
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
        }
        else
        {
            // меняем с альбомной най книжную
            Y_Top_Margin    = old_X_Left_Margin;
            X_Right_Margin  = old_Y_Top_Margin;
            Y_Bottom_Margin = old_X_Right_Margin;
            X_Left_Margin   = old_Y_Bottom_Margin;
        }

        this.History.Add( this, { Type : historyitem_Document_Orientation, Orientation_new : this.Orientation, Orientation_old : old_Orientation, Margins_old : { Left : old_X_Left_Margin, Right : old_X_Right_Margin, Top : old_Y_Top_Margin, Bottom : old_Y_Bottom_Margin }, Margins_new : { Left : X_Left_Margin, Right : X_Right_Margin, Top : Y_Top_Margin, Bottom : Y_Bottom_Margin } } );
        this.Set_DocumentPageSize( Page_Height, Page_Width, bNoRecalc );
    },

    // Обновляем данные в интерфейсе о свойствах параграфа
    Interface_Update_ParaPr : function()
    {

        var ParaPr = this.Slides[this.CurPage].graphicObjects.getPropsArrays().paraPr;

        if ( null != ParaPr )
        {
            if ( undefined != ParaPr.Tabs )
                editor.Update_ParaTab( Default_Tab_Stop, ParaPr.Tabs );

            editor.UpdateParagraphProp( ParaPr );
        }
    },

    // Обновляем данные в интерфейсе о свойствах текста
    Interface_Update_TextPr : function()
    {
        var TextPr =this.Slides[this.CurPage].graphicObjects.getPropsArrays().textPr;

        if ( null != TextPr )
            editor.UpdateTextPr(TextPr);
    },

    // Обновляем данные в интерфейсе о свойствах графики (картинки, автофигуры)
    Interface_Update_DrawingPr : function(Flag)
    {
        // if(!(this.DrawingObjects.curState.id === STATES_ID_TEXT_ADD || this.DrawingObjects.curState.id === STATES_ID_TEXT_ADD_IN_GROUP))
        {
            var DrawingPr = this.DrawingObjects.getProps();

            if ( true === Flag )
                return DrawingPr;
            else
            {

                for(var i = 0; i < DrawingPr.length; ++i)
                    editor.sync_ImgPropCallback( DrawingPr[i] );
            }
        }
        if(Flag)
            return null;
    },

    // Обновляем данные в интерфейсе о свойствах таблицы
    Interface_Update_TablePr : function(Flag)
    {
        var TablePr = null;
        if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ) )
        {
            if ( true == this.Selection.Use )
                TablePr = this.Content[this.Selection.StartPos].Get_Props();
            else
                TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
        }
        TablePr.CanBeFlow = true;

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

        // Сначала проверим Flow-таблицы
        var FlowTable = this.DrawingObjects.getTableByXY( X, Y, PageNum, this );
        if ( null != FlowTable )
            return FlowTable.Table.Index;

        var StartPos = this.Pages[PageNum].Pos;
        var EndPos   = this.Content.length - 1;

        if ( PageNum < this.Pages.length - 1 )
            EndPos = Math.min( this.Pages[PageNum + 1].Pos, EndPos );

        // Сохраним позиции всех Inline элементов на данной странице
        var InlineElements = new Array();
        for ( var Index = StartPos; Index <= EndPos; Index++ )
        {
            var Item = this.Content[Index];
            if ( type_Table != Item.GetType() || false != Item.Is_Inline() )
                InlineElements.push( Index );
        }

        var Count = InlineElements.length;
        if ( Count <= 0 )
            return StartPos;

        for ( var Pos = 0; Pos < Count - 1; Pos++ )
        {
            var Item = this.Content[InlineElements[Pos + 1]];

            if ( Y < Item.Pages[0].Bounds.Top )
                return InlineElements[Pos];

            if ( Item.Pages.length > 1 )
            {
                if ( ( type_Paragraph === Item.GetType() && Item.Pages[0].FirstLine != Item.Pages[1].FirstLine ) || ( type_Table === Item.GetType() && true === Item.RowsInfo[0].FirstPage ) )
                    return InlineElements[Pos + 1];

                return InlineElements[Pos];
            }

            if ( Pos === Count - 2 )
            {
                // Такое возможно, если страница заканчивается Flow-таблицей
                return InlineElements[Count - 1];
            }
        }

        return InlineElements[0];
    },

    // Убираем селект
    Selection_Remove : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Selection_Remove();
        }
        if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.resetSelection();
        }
        else if ( docpostype_Content === this.CurPos.Type )
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

                        this.Selection.StartPos = 0;
                        this.Selection.EndPos   = 0;

                        // Убираем селект и возвращаем курсор
                        this.DrawingDocument.SelectEnabled(false);
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

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

                        // Убираем селект и возвращаем курсор
                        this.DrawingDocument.SelectEnabled(false);
                        this.DrawingDocument.TargetStart();
                        this.DrawingDocument.TargetShow();

                        break;
                    }
                }
            }
        }
    },

    Selection_IsEmpty : function(bCheckHidden)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Selection_IsEmpty(bCheckHidden);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return false;
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                // Выделение нумерации
                if ( selectionflag_Numbering == this.Selection.Flag )
                    return false;
                // Обрабатываем движение границы у таблиц
                else if ( true === this.Selection_Is_TableBorderMove() )
                    return false;
                else
                {
                    if ( this.Selection.StartPos === this.Selection.EndPos )
                        return this.Content[this.Selection.StartPos].Selection_IsEmpty(bCheckHidden);
                    else
                        return false;
                }
            }

            return true;
        }
    },

    Selection_Draw_Page : function(Page_abs)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_Draw_Page(Page_abs);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.drawSelectionPage(Page_abs);
        }
        else
        {
            var Pos_start = this.Pages[Page_abs].Pos;
            var Pos_end   = this.Pages[Page_abs].EndPos;

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
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        var Start = Math.max( Start, Pos_start );
                        var End   = Math.min( End,   Pos_end   );

                        for ( var Index = Start; Index <= End; Index++ )
                        {
                            this.Content[Index].Selection_Draw_Page(Page_abs);
                        }

                        if ( Page_abs >= 2 && End < this.Pages[Page_abs - 2].EndPos )
                        {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        if ( null == this.Selection.Data )
                            break;

                        var Count = this.Selection.Data.length;
                        for ( var Index = 0; Index < Count; Index++ )
                        {
                            if ( this.Selection.Data[Index] <= Pos_end && this.Selection.Data[Index] >= Pos_start )
                                this.Content[this.Selection.Data[Index]].Selection_Draw_Page(Page_abs);
                        }

                        if ( Page_abs >= 2 && this.Selection.Data[this.Selection.Data.length - 1] < this.Pages[Page_abs - 2].EndPos )
                        {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }

                        break;
                    }
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
            }
        }

        this.DrawingDocument.SelectClear();
    },

    Selection_SetStart : function(X,Y, MouseEvent)
    {
        var bCheckHdrFtr = true;

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
            this.DrawingDocument.EndTrackTable( null, true );
        }

        var PageMetrics = this.Get_PageContentStartPos( this.CurPage );

        var bInText      = (null === this.Is_InText(X, Y, this.CurPage)      ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);
        var nInDrawing   = this.DrawingObjects.isPointInDrawingObjects( X, Y, this.CurPage, this );
        var bFlowTable   = (null === this.DrawingObjects.getTableByXY( X, Y, this.CurPage, this ) ? false : true);

        // Проверяем, не попали ли мы в колонтитул (если мы попадаем в Flow-объект, то попадание в колонтитул не проверяем)
        if ( true != bFlowTable && nInDrawing < 0 && true === bCheckHdrFtr && MouseEvent.ClickCount >= 2 && ( Y <= PageMetrics.Y || Y > PageMetrics.YLimit ) )
        {
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
            this.DrawingDocument.EndTrackTable( null, true );
        }
        else if ( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bTableBorder && false === bInText && nInDrawing >= 0 ) )
        {
            if ( docpostype_DrawingObjects != this.CurPos.Type )
                this.Selection_Remove();

            // Прячем курсор
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SetCurrentPage( this.CurPage );

            this.Selection.Use   = true;
            this.Selection.Start = true;
            this.Selection.Flag  = selectionflag_Common;
            this.CurPos.Type     = docpostype_DrawingObjects;
            this.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage);
        }
        else
        {
            var bOldSelectionIsCommon = true;

            if ( docpostype_DrawingObjects === this.CurPos.Type && true != this.Is_InDrawing( X, Y, this.CurPage ) )
            {
                this.DrawingObjects.resetSelection();
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
                bTableBorder = ( null === Item.Is_TableBorder( X, Y, this.CurPage ) ? false : true );

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
                Item.Selection_SetStart( X, Y, this.CurPage, MouseEvent, bTableBorder );
                Item.Selection_SetEnd( X, Y, this.CurPage, {Type : g_mouse_event_type_move, ClickCount : 1}, bTableBorder );

                if ( !(type_Table == Item.GetType() && true == bTableBorder) )
                {
                    this.Selection.Use      = true;
                    this.Selection.StartPos = ContentPos;
                    this.Selection.EndPos   = ContentPos;
                    this.Selection.Data     = null;

                    this.CurPos.ContentPos  = ContentPos;

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
        }
    },

    // Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
    // Если bEnd = true, тогда это конец селекта.
    Selection_SetEnd : function(X, Y, MouseEvent)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Selection_SetEnd(  X, Y, this.CurPage, MouseEvent );
            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                if ( true != this.DrawingObjects.isPolylineAddition() )
                    this.Selection.Start = false;
                else
                    this.Selection.Start = true;
            }

            return;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            if ( g_mouse_event_type_up == MouseEvent.Type )
            {
                this.DrawingObjects.OnMouseUp( MouseEvent, X, Y, this.CurPage );

                if ( true != this.DrawingObjects.isPolylineAddition() )
                {
                    this.Selection.Start = false;
                    this.Selection.Use   = true;
                }
                else
                {
                    this.Selection.Start = true;
                    this.Selection.Use   = true;
                }
            }
            else
            {
                this.DrawingObjects.OnMouseMove( MouseEvent, X, Y, this.CurPage );
            }
            return;
        }

        // Обрабатываем движение границы у таблиц
        if ( true === this.Selection_Is_TableBorderMove() )
        {
            var Item = this.Content[this.Selection.Data.Pos];
            Item.Selection_SetEnd( X, Y, this.CurPage, MouseEvent, true );

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
                    editor.sync_HyperlinkClickCallback( this.Selection.Data.Value.Get_Value() );
                    this.Selection.Data.Value.Set_Visited( true );

                    for ( var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++ )
                        this.DrawingDocument.OnRecalculatePage( PageIdx, this.Pages[PageIdx] );

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

        // Проверяем, чтобы у нас в селект не попали элементы, в которых не выделено ничего
        if ( true === this.Content[End].Selection_IsEmpty() )
        {
            this.Content[End].Selection_Remove();
            End--;
        }

        if ( Start != End && true === this.Content[Start].Selection_IsEmpty() )
        {
            this.Content[Start].Selection_Remove();
            Start++;
        }

        if ( Direction > 0 )
        {
            this.Selection.StartPos = Start;
            this.Selection.EndPos   = End;
        }
        else
        {
            this.Selection.StartPos = End;
            this.Selection.EndPos   = Start;
        }
    },


    getAllTableStyles: function()
    {
        for(var  i = 0; i < this.globalTableStyles.length; ++i)
        {
            this.globalTableStyles[i].stylesId = i;
        }
        return this.globalTableStyles;
    },
    // Данный запрос может прийти из внутреннего элемента(параграф, таблица), чтобы узнать
    // происходил ли выделение в пределах одного элеменета.
    Selection_Is_OneElement : function()
    {
        if ( true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos )
            return true;

        return false;
    },

    Selection_Is_TableBorderMove : function()
    {
        if ( null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType() )
            return true;

        return false;
    },

    // Проверяем попали ли мы в селект
    Selection_Check : function(X, Y, Page_Abs)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Selection_Check( X, Y, Page_Abs );
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.selectionCheck( X, Y, Page_Abs );
        else //if ( docpostype_Content === thsi.CurPos.Type )
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
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        var ContentPos = this.Internal_GetContentPosByXY( X, Y, Page_Abs );
                        if ( ContentPos > Start && ContentPos < End )
                            return true;
                        else if ( ContentPos < Start || ContentPos > End )
                            return false;
                        else
                            return this.Content[ContentPos].Selection_Check( X, Y, Page_Abs );

                        return false;
                    }
                    case selectionflag_Numbering : return false;
                }

                return false;
            }

            return false;
        }
    },

    // Селектим весь параграф
    Select_All : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Select_All();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type && true === this.DrawingObjects.isSelectedText() )
        {
            this.DrawingObjects.selectAll();
        }
        else
        {
            if ( true === this.Selection.Use )
                this.Selection_Remove();

            this.DrawingDocument.SelectEnabled(true);
            this.DrawingDocument.TargetEnd();

            this.CurPos.Type = docpostype_Content;

            this.Selection.Use      = true;
            this.Selection.Start    = false;
            this.Selection.Flag     = selectionflag_Common;

            this.Selection.StartPos = 0;
            this.Selection.EndPos   = this.Content.length - 1;

            for ( var Index = 0; Index < this.Content.length; Index++ )
            {
                this.Content[Index].Select_All();
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
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
            if ( type_Paragraph == Item.GetType() && undefined != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl )
            {
                this.Selection.Data.push( Index );
                Item.Selection_SelectNumbering();
            }
        }

        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();

        this.Document_UpdateSelectionState();
    },

    // Если сейчас у нас заселекчена нумерация, тогда убираем селект
    Remove_NumberingSelection : function()
    {
        if ( true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag )
            this.Selection_Remove();
    },

    Update_CursorType : function( X, Y, PageIndex, MouseEvent )
    {
        editor.sync_MouseMoveStartCallback();
        this.Slides[this.CurPage].graphicObjects.Update_CursorType( X, Y,  MouseEvent );
        editor.sync_MouseMoveEndCallback();
        return;
        editor.sync_MouseMoveStartCallback();

        // Ничего не делаем
        if ( true === this.DrawingDocument.IsCursorInTableCur( X, Y, PageIndex ) )
        {
            this.DrawingDocument.SetCursorType( "default", new CMouseMoveData() );
            editor.sync_MouseMoveEndCallback();
            return;
        }

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Update_CursorType( X, Y, PageIndex );
        }
        else
        {
            var bInText      = (null === this.Is_InText(X, Y, this.CurPage)      ? false : true);
            var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);

            // Ничего не делаем
            if ( true === this.DrawingObjects.updateCursorType(PageIndex, X, Y, MouseEvent, ( true === bInText || true === bTableBorder ? true : false )) )
            {
                editor.sync_MouseMoveEndCallback();
                return;
            }

            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            Item.Update_CursorType( X, Y, PageIndex );
        }

        editor.sync_MouseMoveEndCallback();
    },

    // Проверяем попадем ли мы в границу таблицы (null - не попали, а если попали возвращается указатель на таблицу)
    Is_TableBorder : function( X, Y, PageIndex )
    {
        if ( PageIndex >= this.Pages.length || PageIndex < 0 )
            return null;

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_TableBorder( X, Y, PageIndex );
        }
        else if ( -1 != this.DrawingObjects.isPointInDrawingObjects( X,Y, PageIndex, this ) )
        {
            return null;
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];

            if ( type_Table == Item.GetType() )
                return Item.Is_TableBorder( X, Y, PageIndex );
            else
                return null;
        }

        return null;
    },

    // Проверяем, попали ли мы четко в текст (не лежащий в автофигуре)
    Is_InText : function(X, Y, PageIndex)
    {
        if ( PageIndex >= this.Pages.length || PageIndex < 0 )
            return null;

        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_InText( X, Y, PageIndex );
        }
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            return Item.Is_InText( X, Y, PageIndex );
        }
    },

    // Проверяем, попали ли мы в автофигуру данного DocumentContent
    Is_InDrawing : function(X, Y, PageIndex)
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Is_InDrawing( X, Y, PageIndex );
        }
        else if ( -1 != this.DrawingObjects.isPointInDrawingObjects( X, Y, this.CurPage, this ) )
            return true;
        else
        {
            var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageIndex );
            var Item = this.Content[ContentPos];
            if ( type_Table == Item.GetType() )
                return Item.Is_InDrawing( X, Y, PageIndex );

            return false;
        }
    },

    Is_UseInDocument : function(Id)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            if ( Id === this.Content[Index].Get_Id() )
                return true;
        }

        return false;
    },

    OnKeyDown : function(e)
    {
        var bUpdateSelection = true;
        var bRetValue = false;

        if ( e.KeyCode == 8 && false === editor.isViewMode ) // BackSpace
        {
            this.Remove( -1, true );
            bRetValue = true;
        }
        else if ( e.KeyCode == 9 && false === editor.isViewMode ) // Tab
        {
            var SelectedInfo = this.Get_SelectedElementsInfo();

            if ( true === SelectedInfo.Is_InTable() && true != e.CtrlKey )
            {
                this.Cursor_MoveToCell( true === e.ShiftKey ? false : true );
            }
            else if ( true === SelectedInfo.Is_DrawingObjSelected() && true != e.CtrlKey )
            {
                this.DrawingObjects.selectNextObject( ( e.ShiftKey === true ? -1 : 1 ) );
            }
            else
            {
                if ( true === SelectedInfo.Is_MixedSelection() )
                {
                    editor.IncreaseIndent();
                }
                else
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Paragraph_Add( new ParaTab() );
                    }
                }
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 13 && false === editor.isViewMode ) // Enter
        {
            var Hyperlink = this.Hyperlink_Check(false);
            if ( null != Hyperlink && false === e.ShiftKey )
            {
                editor.sync_HyperlinkClickCallback( Hyperlink.Get_Value() )
                Hyperlink.Set_Visited(true);

                // TODO: Пока сделаем так, потом надо будет переделать
                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();
            }
            else
            {
                var CheckType = ( e.ShiftKey || e.CtrlKey ? changestype_Paragraph_Content : changestype_Document_Content_Add );
                if ( false === this.Document_Is_SelectionLocked(CheckType) )
                {
                    this.Create_NewHistoryPoint();
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
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 27 ) // Esc
        {
            // 1. Если у нас выделена автофигура (в колонтитуле или документе), тогда снимаем выделение с нее
            // 2. Если мы просто находимся в колонтитуле (автофигура не выделена) выходим из колонтитула
            if ( docpostype_DrawingObjects === this.CurPos.Type || (docpostype_HdrFtr === this.CurPos.Type && null != this.HdrFtr.CurHdrFtr && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type ) )
            {
                this.DrawingObjects.resetSelection2();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
            }
            else if ( docpostype_HdrFtr == this.CurPos.Type )
            {
                this.Document_End_HdrFtrEditing();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 32 && false === editor.isViewMode ) // Space
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();
                if ( true === e.ShiftKey && true === e.CtrlKey )
                {
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.TargetShow();

                    this.Paragraph_Add( new ParaText( String.fromCharCode( 0x00A0 ) ) );
                }
                else if ( true === e.CtrlKey )
                {
                    this.Paragraph_ClearFormatting();
                }
                else
                {
                    this.DrawingDocument.TargetStart();
                    this.DrawingDocument.TargetShow();

                    this.Paragraph_Add( new ParaSpace( 1 ) );
                }
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 33 ) // PgUp
        {
            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage--;

                if ( this.CurPage < 0 )
                    this.CurPage = 0;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );

                bRetValue = true;
            }
            else
            {
                var TempXY = this.Cursor_GetPos();

                var X = TempXY.X;
                var Y = TempXY.Y;

                var Dy = this.DrawingDocument.GetVisibleMMHeight();
                if ( Y - Dy < 0 )
                {
                    this.CurPage--;
                    Dy -= Y;
                    Y = Page_Height;
                    while ( Dy > Page_Height )
                    {
                        Dy -= Page_Height;
                        this.CurPage--;
                    }

                    if ( this.CurPage < 0 )
                    {
                        this.CurPage = 0;
                        Dy = Page_Height - this.Content[0].Pages[this.Content[0].Pages.length - 1].Bounds.Top;
                    }
                }

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount;

                var StartX = X;
                var StartY = Y;
                var CurY   = Y;

                while ( Math.abs(StartY - Y) < 0.001 )
                {
                    var bBreak = false;
                    CurY -= Dy;

                    if ( CurY < 0 )
                    {
                        this.CurPage--;
                        CurY = Page_Height;

                        // Эта проверка нужна для выполнения PgUp в начале документа
                        if ( this.CurPage < 0 )
                        {
                            this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                            CurY = 0;
                        }

                        // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                        bBreak = true;
                    }

                    this.Cursor_MoveAt( StartX, CurY, false );
                    this.CurPos.RealX = StartX;
                    this.CurPos.RealY = CurY;

                    TempXY = this.Cursor_GetPos();
                    X = TempXY.X;
                    Y = TempXY.Y;

                    if ( true === bBreak )
                        break;
                }

                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            if ( true === e.AltKey )
            {
                var MouseEvent = new CMouseEventHandler();

                MouseEvent.ClickCount = 1;
                MouseEvent.Type = g_mouse_event_type_down;

                this.CurPage++;

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount - 1;

                this.Selection_SetStart( 0, 0, MouseEvent );

                MouseEvent.Type = g_mouse_event_type_up;
                this.Selection_SetEnd( 0, 0, MouseEvent );

                bRetValue = true;
            }
            else
            {
                var TempXY = this.Cursor_GetPos();

                var X = TempXY.X;
                var Y = TempXY.Y;

                var Dy = this.DrawingDocument.GetVisibleMMHeight();
                if ( Y + Dy > Page_Height )
                {
                    this.CurPage++;
                    Dy -= Page_Height - Y;
                    Y = 0;
                    while ( Dy > Page_Height )
                    {
                        Dy -= Page_Height;
                        this.CurPage++;
                    }

                    // TODO: переделать данную проверку
                    if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    {
                        this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                        Dy = this.Content[this.Content.length - 1].Pages[this.Content[this.Content.length - 1].Pages.length - 1].Bounds.Bottom;
                    }
                }

                // TODO: переделать данную проверку
                if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                    this.CurPage = this.DrawingDocument.m_lPagesCount;

                var StartX = X;
                var StartY = Y;
                var CurY   = Y;

                while ( Math.abs(StartY - Y) < 0.001 )
                {
                    var bBreak = false;
                    CurY += Dy;

                    if ( CurY > Page_Height )
                    {
                        this.CurPage++;
                        CurY = 0;

                        // TODO: переделать данную проверку
                        // Эта проверка нужна для выполнения PgDn в конце документа
                        if ( this.CurPage >= this.DrawingDocument.m_lPagesCount )
                        {
                            var LastElement = this.Content[this.Content.length - 1];
                            this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                            CurY = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                        }

                        // Поскольку мы перешли на другую страницу, то можно из цикла выходить
                        bBreak = true;
                    }

                    this.Cursor_MoveAt( StartX, CurY, false );
                    this.CurPos.RealX = StartX;
                    this.CurPos.RealY = CurY;

                    TempXY = this.Cursor_GetPos();
                    X = TempXY.X;
                    Y = TempXY.Y;

                    if ( true === bBreak )
                        break;
                }

                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
            if ( true === e.CtrlKey ) // Ctrl + End - переход в конец документа
            {
                this.Cursor_MoveToEndPos();
            }
            else // Переходим в конец строки
            {
                this.Cursor_MoveEndOfLine( true === e.ShiftKey );
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
            if ( true === e.CtrlKey ) // Ctrl + Home - переход в начало документа
            {
                this.Cursor_MoveToStartPos();
            }
            else // Переходим в начало строки
            {
                this.Cursor_MoveStartOfLine( true === e.ShiftKey );
            }

            bRetValue = true;
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveLeft( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveUp( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveRight( true === e.ShiftKey, true === e.CtrlKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            // Чтобы при зажатой клавише курсор не пропадал
            if ( true != e.ShiftKey )
                this.DrawingDocument.TargetStart();

            this.Cursor_MoveDown( true === e.ShiftKey );
            bRetValue = true;
        }
        else if ( e.KeyCode == 45 ) // Insert
        {
            if ( true === e.CtrlKey ) // Ctrl + Insert (аналогично Ctrl + C)
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
            else if ( true === e.ShiftKey && false === editor.isViewMode ) // Shift + Insert (аналогично Ctrl + V)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 46 && false === editor.isViewMode ) // Delete
        {
            if ( true != e.ShiftKey )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Delete) )
                {
                    this.Create_NewHistoryPoint();
                    this.Remove( 1, true );
                }
                bRetValue = true;
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                }
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 49 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num1 - применяем стиль Heading1
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 1" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 50 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num2 - применяем стиль Heading2
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 2" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 51 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num3 - применяем стиль Heading3
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.Create_NewHistoryPoint();
                this.Set_ParagraphStyle( "Heading 3" );
                this.Document_UpdateInterfaceState();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
        {
            this.Select_All();
            bRetValue = true;
        }
        else if ( e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Bold : TextPr.Bold === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 67 && true === e.CtrlKey ) // Ctrl + C + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + C - копирование форматирования текста
            {
                this.Document_Format_Copy();
                bRetValue = true;
            }
            else // Ctrl + C - copy
            {
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                //не возвращаем true чтобы не было preventDefault
            }
        }
        else if ( e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + E - переключение прилегания параграфа между center и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Italic : TextPr.Italic === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 74 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Justify ? align_Left : align_Justify );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + K - добавление гиперссылки
        {
            if ( true === this.Hyperlink_CanAdd(false) )
                editor.sync_DialogAddHyperlink();

            bRetValue = true;
        }
        else if ( e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + L + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + L - добавляем список к данному параграфу
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphNumbering( { Type : 0, SubType : 1 } );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
            else // Ctrl + L - переключение прилегания параграфа между left и justify
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Set_ParagraphAlign( ParaPr.Jc === align_Left ? align_Justify : align_Left );
                        this.Document_UpdateInterfaceState();
                    }
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 77 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + M + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + M - уменьшаем левый отступ
                editor.DecreaseIndent();
            else // Ctrl + M - увеличиваем левый отступ
                editor.IncreaseIndent();
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            if ( true === e.ShiftKey && false === editor.isViewMode ) // Ctrl + Shift + P - добавляем номер страницы в текущую позицию
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaPageNum() );
                }
                bRetValue = true;
            }
            else // Ctrl + P - print
            {
                this.DrawingDocument.m_oWordControl.m_oApi.asc_Print();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 82 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
                {
                    this.Create_NewHistoryPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Right ? align_Left : align_Right );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + S - save
        {
            this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
            bRetValue = true;
        }
        else if ( e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { Underline : TextPr.Underline === true ? false : true } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + V - paste
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();
                if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
                {
                    this.Document_Format_Paste();
                    bRetValue = true;
                }
                else // Ctrl + V - paste
                {
                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                    //не возвращаем true чтобы не было preventDefault
                }
            }
        }
        else if ( e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + X - cut
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
            }
            //не возвращаем true чтобы не было preventDefault
        }
        else if ( e.KeyCode == 89 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Y - Redo
        {
            this.Document_Redo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 90 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Z - Undo
        {
            this.Document_Undo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 93 || 57351 == e.KeyCode /*в Opera такой код*/ ) // контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 121 && true === e.ShiftKey ) // Shift + F10 - контекстное меню
        {
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR( this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum );
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;

            editor.sync_ContextMenuCallback( { Type : c_oAscContextMenuTypes.Common, X_abs : X_abs, Y_abs : Y_abs } );

            bUpdateSelection = false;
            bRetValue = true;
        }
        else if ( e.KeyCode == 144 ) // Num Lock
        {
            // Ничего не делаем
            bRetValue = true;
        }
        else if ( e.KeyCode == 145 ) // Scroll Lock
        {
            // Ничего не делаем
            bRetValue = true;
        }
        else if ( e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    if ( true === e.ShiftKey )
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    else
                        this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 188 && true === e.CtrlKey ) // Ctrl + ,
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 189 && false === editor.isViewMode ) // Клавиша Num-
        {
            if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                this.Create_NewHistoryPoint();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();

                var Item = null;
                if ( true === e.CtrlKey && true === e.ShiftKey )
                {
                    Item = new ParaText( String.fromCharCode( 0x2013 ) );
                    Item.SpaceAfter = false;
                }
                else if ( true === e.ShiftKey )
                    Item = new ParaText( "_" );
                else
                    Item = new ParaText( "-" );

                this.Paragraph_Add( Item );
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 190 && true === e.CtrlKey ) // Ctrl + .
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                {
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                    this.Document_UpdateInterfaceState();
                }
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 219 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + [
        {
            editor.FontSizeOut();
            this.Document_UpdateInterfaceState();
        }
        else if ( e.KeyCode == 221 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + ]
        {
            editor.FontSizeIn();
            this.Document_UpdateInterfaceState();
        }

        if ( true == bRetValue && true === bUpdateSelection )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnKeyPress : function(e)
    {
        if ( true === editor.isViewMode )
            return false;

        //Ctrl и Atl только для команд, word не водит текста с зажатыми Ctrl или Atl
        //команды полностью обрабатываются в keypress
        if(e.CtrlKey || e.AltKey)
            return false;

        var Code;
        if (null != e.Which)
            Code = e.Which;
        else if (e.KeyCode)
            Code = e.KeyCode;
        else
            Code = 0;//special char

        var bRetValue = false;

        /*
         if ( 1105 == Code )
         {
         this.LoadTestDocument();
         return true;
         }
         else*/ if ( Code > 0x20 )
    {
        //if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            //this.Create_NewHistoryPoint();

            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();
            this.Paragraph_Add( new ParaText( String.fromCharCode( Code ) ) );
        }
        bRetValue = true;
    }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnMouseDown : function(e, X, Y, PageIndex)
    {
        this.CurPage = PageIndex;


        if ( PageIndex < 0 )
            return;

        this.CurPage = PageIndex;
        if(e.Button === 0)
        {
            this.Slides[this.CurPage].graphicObjects.onMouseDown(e, X, Y);
        }
        else if(e.Button === 2 && this.viewMode === false )
        {
            this.Slides[this.CurPage].graphicObjects.onMouseDown2(e, X, Y);
        }
        this.Document_UpdateInterfaceState();
        return;
        if ( PageIndex < 0 )
            return;

        // Обработка правой кнопки мыши происходит на событии MouseUp
        if ( g_mouse_button_right === e.Button )
            return;

        // Если мы двигаем границу таблицы, тогда создаем новую точку для отката.
        var Table = this.Is_TableBorder( X, Y, PageIndex );
        if ( null != Table )
        {
            if ( true === this.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : Table, CheckType : changestype_Table_Properties } ) )
                return;

            this.Create_NewHistoryPoint();
        }

        this.CurPage = PageIndex;

        if ( true === editor.isStartAddShape && docpostype_HdrFtr != this.CurPos.Type )
        {
            this.CurPos.Type = docpostype_DrawingObjects;
            this.Selection.Use   = true;
            this.Selection.Start = true;

            if ( true != this.DrawingObjects.isPolylineAddition() )
                this.DrawingObjects.startAddShape( editor.addShapePreset );

            this.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage);
        }
        else
        {
            this.Selection_SetStart( X, Y, e );

            if ( e.ClickCount <= 1 )
            {
                this.RecalculateCurPos();
                this.Document_UpdateSelectionState();
            }
        }
    },

    OnMouseUp : function(e, X, Y, PageIndex)
    {
        var elements = this.Slides[this.CurPage].graphicObjects;
        if(e.Button === 0)
        {
            elements.onMouseUp(e, X, Y);
        }
        else if(e.Button === 2 && this.viewMode === false )
        {
            elements.onMouseUp2(e, X, Y);
        }
        this.Document_UpdateInterfaceState();
    },

    OnMouseMove : function(e, X, Y, PageIndex)
    {
        this.CurPage = PageIndex;
        this.Slides[this.CurPage].onMouseMove(e, X, Y);
        //this.Update_CursorType( X, Y, PageIndex, e );
        return;
        return;
        if ( PageIndex < 0 )
            return;

        this.Update_CursorType( X, Y, PageIndex, e );

        if ( true === this.Selection.Use && true === this.Selection.Start )
        {
            this.CurPage = PageIndex;
            this.Selection_SetEnd( X, Y, e );
            this.Document_UpdateSelectionState();
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
        if ( "undefined" != typeof(this.Numbering) && null != ( AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId) ) )
        {
            for ( var LvlIndex = 0; LvlIndex < 9; LvlIndex++ )
                Restart[LvlIndex] = AbstractNum.Lvl[LvlIndex].Restart;
        }

        var PrevLvl = -1;
        for ( var Index = 0; Index < this.Content.length; Index++ )
        {
            var Item = this.Content[Index];

            var ItemNumPr = null;
            if ( type_Paragraph == Item.GetType() && undefined != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId  )
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

                if ( "undefined" == typeof(NumInfo[ItemNumPr.Lvl]) )
                    NumInfo[ItemNumPr.Lvl] = 0;
                else
                    NumInfo[ItemNumPr.Lvl]++;

                for ( var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2-- )
                {
                    if ( "undefined" == typeof(NumInfo[Index2]) || 0 == NumInfo[Index2] )
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

    Get_TableStyleForPara : function()
    {
        return null;
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
        this.Selection_Remove();

        // Прячем курсор
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage( this.CurPage );

        this.CurPos.Type = docpostype_DrawingObjects;
        this.DrawingObjects.selectById( Id, this.CurPage );

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    // Получем ближайшую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y, bAnchor, Drawing)
    {
        if ( undefined === bAnchor )
            bAnchor = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_NearestPos( PageNum, X, Y, bAnchor, Drawing );

        var bInText      = (null === this.Is_InText(X, Y, PageNum)      ? false : true);
        var nInDrawing   = this.DrawingObjects.isPointInDrawingObjects( X, Y, PageNum, this );

        if ( true != bAnchor )
        {
            // Проверяем попадание в графические объекты
            var NearestPos = this.DrawingObjects.getNearestPos( X, Y, PageNum, Drawing);
            if ( ( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bInText && nInDrawing >= 0 ) ) && null != NearestPos )
                return NearestPos;
        }

        var ContentPos = this.Internal_GetContentPosByXY( X, Y, PageNum);

        // Делаем логику как в ворде
        if ( true === bAnchor && (0 < ContentPos || PageNum > 0 ) && ContentPos === this.Pages[PageNum].Pos && this.Pages[PageNum].EndPos > this.Pages[PageNum].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage() )
            ContentPos++;

        return this.Content[ContentPos].Get_NearestPos( PageNum, X, Y, bAnchor, Drawing );
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

        this.History.Add( this, { Type : historyitem_Document_AddItem, Pos : Position, Item : NewObject } );
        this.Content.splice( Position, 0, NewObject );
        NewObject.Set_Parent( this );
        NewObject.Set_DocumentNext( NextObj );
        NewObject.Set_DocumentPrev( PrevObj );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NewObject );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( NewObject );

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field ) );
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
            this.Content[Position + Index].PreDelete();
        }

        this.History.Add( this, { Type : historyitem_Document_RemoveItem, Pos : Position, Items : this.Content.slice( Position, Position + Count ) } );
        this.Content.splice( Position, Count );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NextObj );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( PrevObj );

        // Проверим, что последний элемент не таблица
        if ( type_Table == this.Content[this.Content.length - 1].GetType() )
            this.Internal_Content_Add(this.Content.length, new Paragraph( this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field ) );

        return ChangePos;
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
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

        this.Document_UpdateInterfaceState();
    },

    // Type    - верхний или нижний колонтитул
    // Subtype - first, even или default
    Document_AddHdrFtr : function(Type, Subtype)
    {
        this.HdrFtr.AddHeaderOrFooter( Type, Subtype );
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_RemoveHdrFtr : function(Type, Subtype)
    {
        this.HdrFtr.RemoveHeaderOrFooter( Type, Subtype );
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_SetHdrFtrDistance : function(Value)
    {
        this.HdrFtr.Set_Distance( Value, Page_Height );
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },

    Document_SetHdrFtrBounds : function(Y0, Y1)
    {
        this.HdrFtr.Set_Bounds( Y0, Y1 );
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },

    Document_Format_Copy : function()
    {
        this.CopyTextPr = this.Get_Paragraph_TextPr_Copy();
        this.CopyParaPr = this.Get_Paragraph_ParaPr_Copy();
    },

    Document_End_HdrFtrEditing : function()
    {
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if ( null == CurHdrFtr )
                return;

            CurHdrFtr.Selection_Remove();

            this.CurPos.Type = docpostype_Content;

            if ( hdrftr_Header == CurHdrFtr.Type )
                this.Cursor_MoveAt( 0, 0, false );
            else
                this.Cursor_MoveAt( 0, Page_Height, false );

            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();

            this.Document_UpdateRulersState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
        }
    },

    Document_Format_Paste : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, false );
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
            this.DrawingObjects.paragraphFormatPaste( this.CopyTextPr, this.CopyParaPr, false );
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch ( this.Selection.Flag )
                {
                    case selectionflag_Numbering    : return;
                    case selectionflag_Common:
                    {
                        var Start = this.Selection.StartPos;
                        var End   = this.Selection.EndPos;
                        if ( Start > End )
                        {
                            Start = this.Selection.EndPos;
                            End   = this.Selection.StartPos;
                        }

                        for ( var Pos = Start; Pos <= End; Pos++ )
                        {
                            this.Content[Pos].Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, ( Start === End ? false : true ) );
                        }

                        this.ContentLastChangePos = Math.max( Start - 1, 0 );
                        this.Recalculate();

                        break;
                    }
                }
            }
            else
            {
                this.Content[this.CurPos.ContentPos].Paragraph_Format_Paste( this.CopyTextPr, this.CopyParaPr, true );
                this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                this.Recalculate();
            }
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    Is_TableCellContent : function()
    {
        return false;
    },

    Is_TopDocument : function(bReturnTopDocument)
    {
        if ( true === bReturnTopDocument )
            return this;

        return true;
    },

    Is_DrawingShape : function()
    {
        return false;
    },

    Is_HdrFtr : function(bReturnHdrFtr)
    {
        if ( true === bReturnHdrFtr )
            return null;

        return false;
    },

    Is_SelectionUse : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Is_SelectionUse();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.isSelectionUse();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
                return true;

            return false;
        }
    },

    Is_TextSelectionUse : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Is_TextSelectionUse();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.isTextSelectionUse();
        else //if ( docpostype_Content === this.CurPos.Type )
            return this.Selection.Use;
    },

    Get_CurPosXY : function()
    {
        var TempXY;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            TempXY = this.HdrFtr.Get_CurPosXY();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            TempXY = this.DrawingObjects.getCurPosXY();
        else // if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                    TempXY = { X : 0, Y : 0 };
                else // if ( selectionflag_Common === this.Selection.Flag )
                    TempXY = this.Content[this.Selection.EndPos].Get_CurPosXY();
            }
            else
                TempXY = this.Content[this.CurPos.ContentPos].Get_CurPosXY();
        }

        this.Internal_CheckCurPage();

        return { X : TempXY.X, Y : TempXY.Y, PageNum : this.CurPage };
    },

    // Возвращаем выделенный текст, если в выделении не более 1 параграфа, и там нет картинок, нумерации страниц и т.д.
    Get_SelectedText : function(bClearText)
    {
        if ( "undefined" === typeof(bClearText) )
            bClearText = false;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_SelectedText(bClearText);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getSelectedText(bClearText);
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag ) || false === this.Selection.Use ) )
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

        return null;
    },

    // Получаем текущий параграф
    Get_CurrentParagraph : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Get_CurrentParagraph();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.getCurrentParagraph();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
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
        }
    },

    Get_SelectedElementsInfo : function()
    {
        var Info = new CSelectedElementsInfo();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Get_SelectedElementsInfo( Info );
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.getSelectedElementsInfo( Info );
        }
        else if ( docpostype_Content == this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( this.Selection.StartPos != this.Selection.EndPos )
                    Info.Set_MixedSelection();
                else
                {
                    this.Content[this.Selection.StartPos].Get_SelectedElementsInfo(Info);
                }
            }
            else
            {
                this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo(Info);
            }
        }

        return Info;
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

        // Начнем поиск с поиска по колонтитулам
        this.HdrFtr.DocumentSearch( this.SearchInfo.String );

        this.SearchInfo.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Search_WaitRecalc()}, 1);
    },

    Search_WaitRecalc : function()
    {
        if ( null === this.SearchInfo.Id )
            return;

        // Пока рассчет не закончился не начинаем поиск
        if ( null != this.FullRecalc.Id )
            this.SearchInfo.Id = setTimeout(function() {editor.WordControl.m_oLogicDocument.Search_WaitRecalc()}, 100);
        else
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
            Element.DocumentSearch( this.SearchInfo.String, search_Common );

            if ( false === bFlowObjChecked )
            {
                this.DrawingObjects.documentSearch( CurPage, this.SearchInfo.String, search_Common );
                bFlowObjChecked = true;
            }

            var bNewPage = false;
            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.DrawingObjects.documentSearch( CurPage + TempIndex, this.SearchInfo.String, search_Common );

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
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_AddRow(bBefore);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableAddRow(bBefore);
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

            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_AddCol : function(bBefore)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_AddCol(bBefore);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableAddCol(bBefore);
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

            this.ContentLastChangePos = Pos;
            this.Recalculate();
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveRow : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_RemoveRow();
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.tableRemoveRow();
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
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveCol : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_RemoveCol();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableRemoveCol();
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
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_MergeCells : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_MergeCells()
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableMergeCells();
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

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_SplitCell : function( Cols, Rows )
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_SplitCell(Cols, Rows);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.tableSplitCell(Cols, Rows);
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

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Table_RemoveTable : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Table_RemoveTable();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.tableRemoveTable();
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

                this.ContentLastChangePos = Pos;
                this.Recalculate();
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },

    Table_Select : function(Type)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Table_Select(Type);
        }
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            this.DrawingObjects.tableSelect( Type );
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
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        //this.Document_UpdateRulersState();
    },

    Table_CheckMerge : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Table_CheckMerge();
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
        {
            return this.DrawingObjects.tableCheckMerge();
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
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Table_CheckSplit();
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.tableCheckSplit();
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

    Check_TableCoincidence : function(Table)
    {
        return false;
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function()
    {
        return;
        var StartTime = new Date().getTime();

        var FontMap = new Object();
        this.HdrFtr.Document_CreateFontMap(FontMap);

        var CurPage = 0;
        this.DrawingObjects.documentCreateFontMap( CurPage, FontMap );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);

            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.DrawingObjects.documentCreateFontMap( ++CurPage, FontMap );
            }
        }

        //console.log( "CreateFontMap: " + ((new Date().getTime() - StartTime) / 1000) + " s"  );

        return FontMap;
    },

    Document_CreateFontCharMap : function(FontCharMap)
    {
        this.HdrFtr.Document_CreateFontCharMap( FontCharMap );
        this.DrawingObjects.documentCreateFontCharMap( FontCharMap );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_CreateFontCharMap( FontCharMap );
        }
    },

    Document_Get_AllFontNames : function()
    {
        var AllFonts = new Object();

        /*this.HdrFtr.Document_Get_AllFontNames( AllFonts );
        this.Numbering.Document_Get_AllFontNames( AllFonts );
        this.Styles.Document_Get_AllFontNames( AllFonts );

        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var Element = this.Content[Index];
            Element.Document_Get_AllFontNames( AllFonts );
        }
                     */
        return AllFonts;
    },

    // Обновляем текущее состояние (определяем где мы находимся, картинка/параграф/таблица/колонтитул)
    Document_UpdateInterfaceState : function()
    {
        editor.sync_BeginCatchSelectedElements();
        editor.ClearPropObjCallback();

        var _empty_para_pr =
        {
            Ind               : { Left : UnknownValue, Right : UnknownValue, FirstLine : UnknownValue },
            Jc                : UnknownValue,
            Spacing           : { Line : UnknownValue, LineRule : UnknownValue, Before : UnknownValue, After : UnknownValue, AfterAutoSpacing : UnknownValue, BeforeAutoSpacing : UnknownValue },
            PageBreakBefore   : UnknownValue,
            KeepLines         : UnknownValue,
            ContextualSpacing : UnknownValue,
            Shd               : UnknownValue,
            StyleId           : -1,
            NumPr             : null,
            Brd               :
            {
                Between : null,
                Bottom  : null,
                Left    : null,
                Right   : null
            },
            ListType:
            {
                Type: -1,
                SubType: -1
            }
        };
        var _empty_text_pr =
        {
            Bold       : false,
            Italic     : false,
            Underline  : false,
            Strikeout  : false,
            FontSize   : "",
            FontFamily : {Index : 0, Name : ""},
            VertAlign  : vertalign_Baseline,
            Color      : { r : 0, g : 0, b : 0},
            HighLight  : highlight_None
        };

        var _cur_slide = this.Slides[this.CurPage];
        var _slide_elements = _cur_slide.graphicObjects;
        _slide_elements.Document_UpdateInterfaceState();
        /*if(_slide_elements.State.id === STATES_ID_TEXT_ADD || _slide_elements.State.id === STATES_ID_TEXT_ADD_IN_GROUP)
        {
            _slide_elements.State.textObject.updateInterfaceTextState();
        }      */
       /* if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = _slide_elements.obj;
            if(_cur_object.graphicObject instanceof CTable)
            {
                editor.sync_TblPropCallback(_cur_object.graphicObject.Get_Props());
                this.DrawingDocument.CheckTableStyles(_cur_object.graphicObject.Get_TableLook(), _cur_object);
            }

            if(typeof _cur_object.updateInterfaceTextState === "function")
            {
                _cur_object.updateInterfaceTextState();
            }
            else
            {
                //  editor.sync_PrLineSpacingCallBack(_empty_para_pr.Spacing);
                editor.asc_fireCallback("asc_canIncreaseIndent", false);
                editor.asc_fireCallback("asc_canDecreaseIndent", false);
            }
        }
        else
        {
            editor.asc_fireCallback("asc_canIncreaseIndent", false);
            editor.asc_fireCallback("asc_canDecreaseIndent", false);
            var _cur_elements = _slide_elements;
            while(_cur_elements.State.id === 20)
            {
                _cur_elements = _cur_elements.group;
            }

            if(_cur_elements.State.id === 0)
            {
                var _arr_selected_objects = [];
                var _graphic_objects = _cur_elements.ArrGlyph;
                var _objects_count = _graphic_objects.length;
                var _object_index;
                for(_object_index = 0; _object_index < _objects_count; ++_object_index)
                {
                    if(_graphic_objects[_object_index].selected)
                    {
                        _arr_selected_objects.push(_graphic_objects[_object_index]);
                    }
                }

                var _selected_objects_count = _arr_selected_objects.length;

                var _b_table_prop = false;
                if(_selected_objects_count === 1)
                {
                    if(_arr_selected_objects[0].graphicObject instanceof CTable)
                    {
                        _b_table_prop = true;
                    }
                }

                if(_b_table_prop === true)
                {

                    editor.sync_TblPropCallback(_arr_selected_objects[0].graphicObject.Get_Props());
                    this.DrawingDocument.CheckTableStyles(_arr_selected_objects[0].graphicObject.Get_TableLook(), _arr_selected_objects[0]);
                    editor.UpdateParagraphProp(_arr_selected_objects[0].getParagraphParaPr());
                    editor.UpdateTextPr(_arr_selected_objects[0].getParagraphTextPr());
                }
                else
                {
                    var _shape_prop = null;
                    var _image_prop = null;

                    var _paragraph_para_pr = null;
                    var _paragraph_text_pr = null;

                    var _cur_paragraph_para_pr;
                    var _cur_paragraph_text_pr;

                    var _cur_shape_prop;
                    var _cur_image_prop;
                    for(_object_index = 0; _object_index < _selected_objects_count; ++_object_index)
                    {
                        var _current_object = _arr_selected_objects[_object_index];
                        if(_current_object instanceof CShape || _current_object instanceof GroupShape)
                        {
                            _cur_shape_prop =
                            {
                                type: _current_object.getPresetGeom(),
                                fill: _current_object.getFill(),
                                stroke: _current_object.getStroke(),
                                canChangeArrows: _current_object.canChangeArrows()

                            };

                            if(_shape_prop === null)
                            {
                                _shape_prop = _cur_shape_prop;
                            }
                            else
                            {
                                _shape_prop = CompareShapeProperties(_shape_prop, _cur_shape_prop);
                            }
                        }

                        if(_current_object instanceof  CImage2 || (_current_object instanceof GroupShape))
                        {
                            _cur_image_prop = _current_object.getImageProps();
                            if(_cur_image_prop !== null)
                            {
                                if(_image_prop === null)
                                {
                                    _image_prop = _cur_image_prop;
                                }
                                else
                                {
                                    _image_prop = CompareImageProperties(_image_prop, _cur_image_prop);
                                }
                            }
                        }

                        if(typeof _current_object.getParagraphParaPr === "function")
                        {
                            _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                            if(_cur_paragraph_para_pr != null)
                            {
                                if(_paragraph_para_pr === null)
                                {
                                    _paragraph_para_pr = _cur_paragraph_para_pr;
                                }
                                else
                                {
                                    _paragraph_para_pr = _paragraph_para_pr.Compare(_cur_paragraph_para_pr)
                                }
                            }
                        }
                        if(typeof _current_object.getParagraphTextPr === "function")
                        {
                            _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                            if(_cur_paragraph_text_pr != null)
                            {
                                if(_paragraph_text_pr === null)
                                {
                                    _paragraph_text_pr = _cur_paragraph_text_pr;
                                }
                                else
                                {
                                    _paragraph_text_pr = _paragraph_text_pr.Compare(_cur_paragraph_text_pr)
                                }
                            }
                        }
                    }

                    if(_image_prop !== null)
                    {
                        editor.sync_ImgPropCallback(_image_prop);
                    }

                    if(_shape_prop !== null)
                    {
                        editor.sync_shapePropCallback(_shape_prop);
                    }

                    if(_paragraph_para_pr != null)
                    {
                        editor.UpdateParagraphProp( _paragraph_para_pr );

                        editor.sync_PrLineSpacingCallBack(_paragraph_para_pr.Spacing);
                        if(_selected_objects_count === 1 )
                        {
                            if ( "undefined" != typeof(_paragraph_para_pr.Tabs) && null != _paragraph_para_pr.Tabs )
                                editor.Update_ParaTab( Default_Tab_Stop, _paragraph_para_pr.Tabs );//TODO:
                        }
                    }
                    else
                    {
                        ////editor.sync_PrLineSpacingCallBack(_empty_para_pr.Spacing);
                        // editor.UpdateParagraphProp(_empty_para_pr);
                    }

                    if(_paragraph_text_pr != null)
                    {
                        if(_paragraph_text_pr.Bold === undefined)
                            _paragraph_text_pr.Bold = false;
                        if(_paragraph_text_pr.Italic === undefined)
                            _paragraph_text_pr.Italic = false;
                        if(_paragraph_text_pr.Underline === undefined)
                            _paragraph_text_pr.Underline = false;
                        if(_paragraph_text_pr.Strikeout === undefined)
                            _paragraph_text_pr.Strikeout = false;
                        if(_paragraph_text_pr.FontFamily === undefined)
                            _paragraph_text_pr.FontFamily = {Index : 0, Name : ""};
                        if(_paragraph_text_pr.FontSize === undefined)
                            _paragraph_text_pr.FontSize = "";
                        editor.UpdateTextPr(_paragraph_text_pr);
                    }
                    else
                    {
                        //   editor.UpdateTextPr(_empty_text_pr);
                    }

                    editor.sync_VerticalTextAlign(_slide_elements.getVerticalAlign());
                }
            }
        }  */

        editor.sync_EndCatchSelectedElements();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateCanAddHyperlinkState();
    },

    changeBackground: function(bg, arr_ind)
    {
        for(var i = 0; i <arr_ind.length; ++i)
        {
            this.Slides[arr_ind[i]].changeBackground(bg);
            this.DrawingDocument.OnRecalculatePage(arr_ind[i], this.Slides[arr_ind[i]]);
        }
        this.DrawingDocument.OnEndRecalculate(true, false);
    },

    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        return;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            return this.DrawingObjects.documentUpdateRulersState();
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                if ( this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType() )
                    this.Content[this.Selection.StartPos].Document_UpdateRulersState(this.CurPage);
                else
                    this.DrawingDocument.Set_RulerState_Paragraph( null );
            }
            else
            {
                this.Internal_CheckCurPage();

                var Item = this.Content[this.CurPos.ContentPos];
                if ( type_Table === Item.GetType() )
                    Item.Document_UpdateRulersState(this.CurPage);
                else
                    this.DrawingDocument.Set_RulerState_Paragraph( null );
            }
        }
    },

    // Обновляем линейки
    Document_UpdateSelectionState : function()
    {
        this.Slides[this.CurPage].graphicObjects.updateSelectionState();
    },

    Document_UpdateUndoRedoState : function()
    {

        // Проверяем состояние Undo/Redo
        editor.sync_CanUndoCallback( this.History.Can_Undo() );
        editor.sync_CanRedoCallback( this.History.Can_Redo() );

        if ( true === History.Have_Changes() )
        {
            editor.isDocumentModify = true;

            // дублирование евента. когда будет undo-redo - тогда
            // эти евенты начнут отличаться
            editor.asc_fireCallback("asc_onDocumentModifiedChanged");
        }
        else
        {
            editor.SetUnchangedDocument();
        }
    },

    Document_UpdateCanAddHyperlinkState : function()
    {
        return;
        // Проверяем можно ли добавить гиперссылку
        editor.sync_CanAddHyperlinkCallback( this.Hyperlink_CanAdd(false) );
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

        if (-1 == PageNum)
        {
            this.CurPage = -1;
            return;
        }

        var oldCurPage = this.CurPage;
        this.CurPage = Math.min( this.Slides.length - 1, Math.max( 0, PageNum ) );
        if(oldCurPage != this.CurPage && this.CurPage < this.Slides.length)
        {
            editor.sync_BeginCatchSelectedElements();
            editor.sync_slidePropCallback(this.Slides[this.CurPage]);
            editor.sync_EndCatchSelectedElements();
           /* if(this.Slides[oldCurPage])
                this.Slides[oldCurPage].elementsManipulator.resetState();       */
            //this.Document_UpdateInterfaceState();
        }
        else if (this.CurPage < this.Slides.length)
        {
            editor.sync_BeginCatchSelectedElements();
            editor.sync_slidePropCallback(this.Slides[this.CurPage]);
            editor.sync_EndCatchSelectedElements();
        }
    },

    Get_CurPage : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_CurPage();

        return this.CurPage;
    },

    resetStateCurSlide: function()
    {},
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Create_NewHistoryPoint : function()
    {
        this.History.Create_NewPoint();
    },



    Document_Undo : function()
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;

        this.History.Undo();
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Document_Redo : function()
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return;


        this.History.Redo();
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Get_SelectionState : function()
    {
        var s = {};
        s.CurPage = this.CurPage;
        s.slideSelection = this.Slides[this.CurPage].graphicObjects.getSelectionState();
        return s;
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

        DocState.CurPage    = this.CurPage;
        DocState.CurComment = this.Comments.Get_CurrentId();

        var State = null;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            State = this.HdrFtr.Get_SelectionState();
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
            State = this.DrawingObjects.getSelectionState();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
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
        }

        State.push( DocState );

        return State;
    },

    Set_SelectionState : function(State)
    {
        this.CurPage = State.CurPage;
        this.Slides[this.CurPage].graphicObjects.setSelectionState(State.slideSelection);
        return ;
        if ( docpostype_DrawingObjects === this.CurPos.Type )
            this.DrawingObjects.resetSelection();

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
        this.Comments.Set_Current(DocState.CurComment);

        var StateIndex = State.length - 2;

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            this.HdrFtr.Set_SelectionState( State, StateIndex );
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            this.DrawingObjects.setSelectionState( State, StateIndex );
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
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
        }
    },

    Undo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Presenattion_AddSlide:
            {
                this.Slides.splice(Data.Pos, 1);
                break;
            }
            case historyitem_Presenattion_RemoveSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                break;
            }
        }
    },

    Redo : function(Data)
    {
        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Presenattion_AddSlide:
            {
                this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
                break;
            }
            case historyitem_Presenattion_RemoveSlide:
            {
                this.Slides.splice(Data.Pos, 1);
                break;
            }
        }
    },

    Get_ParentObject_or_DocumentPos : function(Index)
    {
        return { Type : historyrecalctype_Inline, Data : Index };
    },

    Refresh_RecalcData : function(Data)
    {
        var ChangePos = -1;
        var bNeedRecalcHdrFtr = false;

        var Type = Data.Type;

        switch ( Type )
        {
            case historyitem_Document_AddItem:
            case historyitem_Document_RemoveItem:
            {
                ChangePos = Data.Pos;
                break;
            }

            case historyitem_Document_Margin:
            case historyitem_Document_PageSize:
            case historyitem_Document_Orientation:
            {
                bNeedRecalcHdrFtr = true;
                break;
            }
        }

        if ( true === bNeedRecalcHdrFtr )
        {
            this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Header.First } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Header.Odd } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Header.Even } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Footer.First } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Footer.Odd } );
            this.History.RecalcData_Add( { Type : historyrecalctype_HdrFtr, Data : this.HdrFtr.Content[0].Footer.Even } );
        }

        if ( -1 != ChangePos )
            this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : ChangePos, PageNum : 0 } } );
    },

    Refresh_RecalcData2 : function(Index, Page_rel)
    {
        this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : Index, PageNum : Page_rel } } );
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
                this.DrawingObjects.documentStatistics( CurPage, this.Statistics );
                bFlowObjChecked = true;
            }

            var bNewPage = false;
            if ( Element.Pages.length > 1 )
            {
                for ( var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++ )
                    this.DrawingObjects.documentStatistics( CurPage + TempIndex, this.Statistics );

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
//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        // Проверку, возможно ли добавить гиперссылку, должны были вызвать до этой функции
        if ( null != HyperProps.Text && "" != HyperProps.Text && true === this.Is_SelectionUse() )
            this.Remove();

        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Add( HyperProps );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkAdd( HyperProps );
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Add( HyperProps );

            this.ContentLastChangePos = Pos;
            this.Recalculate(true);
        }

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    Hyperlink_Modify : function(HyperProps)
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Modify( HyperProps );
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkModify( HyperProps );
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            if ( true === this.Content[Pos].Hyperlink_Modify( HyperProps ) )
            {
                this.ContentLastChangePos = Pos;
                this.Recalculate(true);
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Hyperlink_Remove : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            this.HdrFtr.Hyperlink_Remove();
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            this.DrawingObjects.hyperlinkRemove();
        }
        // Либо у нас нет выделения, либо выделение внутри одного элемента
        else if ( docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ) )
        {
            var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
            this.Content[Pos].Hyperlink_Remove();
        }

        this.Document_UpdateInterfaceState();
    },

    Hyperlink_CanAdd : function(bCheckInHyperlink)
    {
        return false;
        // Проверим можно ли добавлять гиперссылку
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
            return this.DrawingObjects.hyperlinkCanAdd(bCheckInHyperlink);
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if ( true === this.Selection.Use )
            {
                switch( this.Selection.Flag )
                {
                    case selectionflag_Numbering:     return false;
                    case selectionflag_Common:
                    {
                        if ( this.Selection.StartPos != this.Selection.EndPos )
                            return false;

                        return this.Content[this.Selection.StartPos].Hyperlink_CanAdd(bCheckInHyperlink);
                    }
                }
            }
            else
                return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd(bCheckInHyperlink);
        }

        return false;
    },


    canGroup: function()
    {
        return this.Slides[this.CurPage].graphicObjects.canGroup();
    },

    canUnGroup: function()
    {
        return this.Slides[this.CurPage].graphicObjects.canUnGroup();
    },


    alignLeft : function()
    {
        this.Slides[this.CurPage].alignLeft();
        this.Recalculate();
    },

    alignRight : function()
    {
        this.Slides[this.CurPage].alignRight();
        this.Recalculate();
    },


    alignTop : function()
    {
        this.Slides[this.CurPage].alignTop();
        this.Recalculate();
    },


    alignBottom : function()
    {
        this.Slides[this.CurPage].alignBottom();
        this.Recalculate();
    },


    alignCenter : function()
    {
        this.Slides[this.CurPage].alignCenter();
        this.Recalculate();
    },

    alignMiddle : function()
    {
        this.Slides[this.CurPage].alignMiddle();
        this.Recalculate();
    },

    distributeHor : function()
    {
        this.Slides[this.CurPage].distributeHor();
        this.Recalculate();
    },
    distributeVer : function()
    {
        this.Slides[this.CurPage].distributeVer();
        this.Recalculate();
    },

    bringToFront : function()
    {
        this.Slides[this.CurPage].bringToFront();
        this.Recalculate();
    },

    bringForward : function()
    {
        this.Slides[this.CurPage].bringForward();
        this.Recalculate();
    },

    sendToBack : function()
    {
        this.Slides[this.CurPage].sendToBack();
        this.Recalculate();
    },


    bringBackward : function()
    {
        this.Slides[this.CurPage].bringBackward();
        this.Recalculate();
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        return null;
    },


    addNextSlide: function()
    {
        var cur_slide = this.Slides[this.CurPage];
        var new_slide = new Slide(this, cur_slide.Layout, this.CurPage + 1);
        var layout = cur_slide.Layout;
        for(var i = 0; i < layout.cSld.spTree.length; ++i)
        {
            if(layout.cSld.spTree[i].isPlaceholder())
            {
                var sp = new CShape(new_slide);
                layout.cSld.spTree[i].copy(sp);
                new_slide.addSp(sp);
            }
        }
        new_slide.num = this.CurPage + 1;
        new_slide.Width = this.Width;
        new_slide.Height = this.Height;
        new_slide.recalculate();
        this.Slides.splice(this.CurPage+1, 0, new_slide);


        for(var i = this.CurPage + 2; i < this.Slides.length; ++i)
        {
            this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            this.Slides[i].changeNum(i);
        }
        this.DrawingDocument.OnRecalculatePage(this.CurPage+1, this.Slides[this.CurPage+1]);
        this.DrawingDocument.OnEndRecalculate();
        this.Set_CurPage(this.CurPage + 1);
        this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage);

        this.Document_UpdateUndoRedoState();
    },


    shiftSlides: function(pos, array)
    {
        History.Create_NewPoint();
        array.sort(function(a, b){return a - b;});
        var deleted = [];
        for(var i = array.length -1; i > - 1; --i)
        {
            deleted.push(this.removeSlide(array[i]));
        }

        for(i = 0; i < array.length; ++i)
        {
            if(array[i] < pos)
                --pos;
            else
                break;
        }

        deleted.reverse();
        for(var i = 0; i < deleted.length; ++i)
        {
            this.insertSlide(pos + i, deleted[i]);
        }
        for(i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }

        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.DrawingDocument.m_oWordControl.GoToPage(1);
    },

    deleteSlides: function(array)
    {
        if(this.Document_Is_SelectionLocked(changestype_RemoveSlide, null) === false)
        {
            History.Create_NewPoint();
            array.sort(function(a, b){return a - b;});
            for(var i = array.length -1; i > - 1; --i)
            {
                this.removeSlide(array[i]);
            }
            for(i = 0; i < this.Slides.length; ++i)
            {
                this.Slides[i].changeNum(i);
            }

            this.Document_UpdateUndoRedoState();
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
            this.DrawingDocument.m_oWordControl.GoToPage(1);
        }
    },

    changeTheme : function(themeInfo)
    {
        if(this.viewMode === true)
        {
            return;
        }

        if(!(this.Document_Is_SelectionLocked(changestype_Theme) === false))
            return;
        if(this.startChangeThemeTimeOutId != null)
        {
            clearTimeout(this.startChangeThemeTimeOutId);
        }
        if(this.backChangeThemeTimeOutId != null)
        {
            clearTimeout(this.backChangeThemeTimeOutId);
        }
        if(this.forwardChangeThemeTimeOutId != null)
        {
            clearTimeout(this.forwardChangeThemeTimeOutId);
        }
        this.themes.push(themeInfo.Theme);
        this.slideMasters.push(themeInfo.Master);
        this.slideLayouts = this.slideLayouts.concat(themeInfo.Layouts);

        var _new_master = themeInfo.Master;
        _new_master.presentation = this;



        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        if(Math.abs(_master_height - this.Height) > 1 || Math.abs(_master_width - this.Width) > 1)
        {
         //   _new_master.setSize(this.Width, this.Height);
        }

        var _arr_slides = this.Slides;
        var _slides_array = [];
        for(var _index = 0; _index < this.Slides.length; ++_index)
        {
            _slides_array.push(this.Slides[_index]);
        }
        var _current_slide = _arr_slides[this.CurPage];
        var _presentation = this;

        var _arr_old_layouts = [];
        var _slide_index;
        for(_slide_index = 0; _slide_index < _arr_slides.length; ++_slide_index)
        {
            _arr_old_layouts[_slide_index] = _arr_slides[_slide_index].Layout;
        }

        History.Create_NewPoint();

        var _arr_new_layouts = [];
        var _new_layout;
        var _history_data;
        var _shape;
        for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
        {
            if(_arr_slides[_slide_index].Layout.calculatedType == null)
            {
                _arr_slides[_slide_index].Layout.calculateType();
            }
            _new_layout = _new_master.getMatchingLayout(_arr_slides[_slide_index].Layout.type, _arr_slides[_slide_index].Layout.matchingName, _arr_slides[_slide_index].Layout.cSld.name, true);//.type, _arr_slides[_slide_index].Layout.matchingName, _arr_slides[_slide_index].Layout.cSld.name);
            if(_new_layout === null)
            {
                _new_layout = _new_master.sldLayoutLst[0];
            }
            _arr_new_layouts.push(_new_layout);

            this.Slides[_slide_index].Layout = _new_layout;
        }


        this.resetStateCurSlide();

        this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide(_current_slide, _presentation, _arr_new_layouts, 0, _slides_array)}, 30);


        this.Document_UpdateUndoRedoState();
    },

    changeSlideSize: function()
    {

    },

    changeColorScheme: function(colorScheme)
    {
        if(this.viewMode === true)
        {
            return;
        }


        if(!(this.Document_Is_SelectionLocked(changestype_Theme) === false))
            return;

        if(!(colorScheme instanceof ClrScheme))
        {
            return;
        }
        History.Create_NewPoint();



        var _slides_array = [];
        for(var _index = 0; _index < this.Slides.length; ++_index)
        {
            _slides_array.push(this.Slides[_index]);
        }
        var _slides = this.Slides;
        var _slide_index;
        var _slide_count = _slides.length;
        var _cur_slide;
        var _cur_theme;
        var _old_color_scheme;
        for(_slide_index = 0; _slide_index < _slide_count; ++_slide_index)
        {
            _cur_slide =_slides[_slide_index];
            _cur_theme = _cur_slide.Layout.Master.Theme;
            if(!_cur_theme.themeElements.clrScheme.isIdentical(colorScheme))
            {
                _old_color_scheme = _cur_theme.themeElements.clrScheme;
                _cur_theme.themeElements.clrScheme = colorScheme.createDuplicate();
            }
        }
        var _start_slide = this.Slides[this.CurPage];
        var _presentation = this;
        setTimeout(function(){recalculateSlideAfterChangeThemeColors(_start_slide, _presentation, 0, _slides_array)},30);
        this.Document_UpdateUndoRedoState();
    },


    removeSlide: function(pos)
    {
        if(isRealNumber(pos) && pos > -1 && pos < this.Slides.length)
        {
            History.Add(this, {Type: historyitem_Presenattion_RemoveSlide, Pos: pos, Id: this.Slides[pos].Get_Id()});
            return this.Slides.splice(pos, 1)[0];
        }
        return null;
    },

    insertSlide: function(pos, slide)
    {
        History.Add(this, {Type: historyitem_Presenattion_AddSlide, Pos: pos, Id: slide.Get_Id()});
        this.Slides.splice(pos, 0, slide);
    },


    changeTheme2 : function(themeInfo, arrInd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.startChangeThemeTimeOutId != null)
        {
            clearTimeout(this.startChangeThemeTimeOutId);
        }
        if(this.backChangeThemeTimeOutId != null)
        {
            clearTimeout(this.backChangeThemeTimeOutId);
        }
        if(this.forwardChangeThemeTimeOutId != null)
        {
            clearTimeout(this.forwardChangeThemeTimeOutId);
        }
        this.themes.push(themeInfo.Theme);
        this.slideMasters.push(themeInfo.Master);
        this.slideLayouts = this.slideLayouts.concat(themeInfo.Layouts);

        var _new_master = themeInfo.Master;
        _new_master.presentation = this;


        if(!_new_master.calculated)
        {
            _new_master.elementsManipulator = new AutoShapesContainer(this, 0);
            _new_master.elementsManipulator.ArrGlyph = _new_master.cSld.spTree;
            var _shape_index;
            var _arr_shapes = _new_master.cSld.spTree;
            /* if(Math.abs(this.Width - 254) > 1 || Math.abs(this.Height - 190.5) > 1)
             {
             var kx = this.Width/254;
             var ky = this.Height/190.5;
             for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
             {
             _arr_shapes[_shape_index].resizeToFormat(kx, ky);
             }
             }  */
            for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
            {

                _arr_shapes[_shape_index].setParent(_new_master);
                _arr_shapes[_shape_index].setContainer(_new_master.elementsManipulator);
                _arr_shapes[_shape_index].calculate();

            }
            _new_master.calculated = true;

            var _layouts = _new_master.sldLayoutLst;
            var _layout_index;
            var _layout_count = _layouts.length;
            var _cur_layout;
            for(_layout_index = 0; _layout_index < _layout_count; ++_layout_index)
            {
                _cur_layout = _layouts[_layout_index];
                _cur_layout.elementsManipulator = new AutoShapesContainer(this, 0);
                _cur_layout.elementsManipulator.ArrGlyph = _cur_layout.cSld.spTree;
                if(!_cur_layout.calculated)
                {
                    _arr_shapes = _cur_layout.cSld.spTree;
                    for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
                    {
                        _arr_shapes[_shape_index].setParent(_cur_layout);
                        _arr_shapes[_shape_index].setContainer(_cur_layout.elementsManipulator);
                        _arr_shapes[_shape_index].calculate();
                    }
                    _cur_layout.calculated = true;
                }

            }
        }


        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        if(Math.abs(_master_height - this.Height) > 1 || Math.abs(_master_width - this.Width) > 1)
        {
            _new_master.setSize(this.Width, this.Height);
        }


        var _arr_slides = this.Slides;
        var _current_slide = _arr_slides[this.CurPage];
        var _presentation = this;

        var _slides_array = [];
        for(var _index = 0; _index < this.Slides.length; ++_index)
        {
            _slides_array.push(this.Slides[_index]);
        }

        var _arr_old_layouts = [];
        var _index_number;
        for(_index_number = 0; _index_number < arrInd.length; ++_index_number)
        {
            _arr_old_layouts[_index_number] = _arr_slides[arrInd[_index_number]].Layout;
        }

        var _arr_new_layouts = [];
        var _new_layout;
        History.Create_NewPoint();
        for(_index_number = 0; _index_number < arrInd.length; ++_index_number)
        {
            if(_arr_slides[arrInd[_index_number]].Layout.calculatedType == null)
            {
                _arr_slides[arrInd[_index_number]].Layout.calculateType();
            }
            _new_layout = _new_master.getMatchingLayout(_arr_slides[arrInd[_index_number]].Layout.type, _arr_slides[arrInd[_index_number]].Layout.matchingName, _arr_slides[arrInd[_index_number]].Layout.cSld.name, true);//.type, _arr_slides[arrInd[_index_number]].Layout.matchingName, _arr_slides[arrInd[_index_number]].Layout.cSld.name);
            if(_new_layout === null)
            {
                _new_layout = _new_master.sldLayoutLst[0];
            }
            _arr_new_layouts.push(_new_layout);
            _arr_slides[arrInd[_index_number]].prepareToChangeTheme(_new_layout);
            _arr_slides[arrInd[_index_number]].Layout = _new_layout;
        }
        var _start_index_pos;
        for(_index_number = 0; _index_number < arrInd.length; ++_index_number)
        {
            if(arrInd[_index_number] == this.CurPage)
            {
                _start_index_pos = _index_number;
                break;
            }
        }
        if(_index_number == arrInd.length)
        {
            _start_index_pos = 0;
        }

        var _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.oldLayouts = _arr_old_layouts;
        _history_obj.newLayouts = _arr_new_layouts;
        _history_obj.startIndexPos = _start_index_pos;
        _history_obj.arrInd = arrInd;
        _history_obj.slidesArray = _slides_array;
        _history_obj.undo_function = function(data)
        {
            if(this.startChangeThemeTimeOutId != null)
            {
                clearTimeout(this.startChangeThemeTimeOutId);
            }
            if(this.backChangeThemeTimeOutId != null)
            {
                clearTimeout(this.backChangeThemeTimeOutId);
            }
            if(this.forwardChangeThemeTimeOutId != null)
            {
                clearTimeout(this.forwardChangeThemeTimeOutId);
            }

            var _new_master = data.oldLayouts[0].Master;
            var _master_width = _new_master.Width;
            var _master_height = _new_master.Height;
            if(Math.abs(_master_height - this.Height) > 1 || Math.abs(_master_width - this.Width) > 1)
            {
                _new_master.setSize(this.Width, this.Height);
            }
            var _presentation = this;
            for(var i = 0; i < data.arrInd.length; ++i)
            {
                data.slidesArray[arrInd[i]].prepareToChangeTheme2();
                data.slidesArray[arrInd[i]].Layout =  data.oldLayouts[i];
            }

            this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(data.slidesArray[data.arrInd[data.startIndexPos]], _presentation, data.arrInd,  data.startIndexPos, _history_obj.oldLayouts, 0, data.slidesArray)}, 30);
        };
        _history_obj.redo_function = function(data)
        {
            if(this.startChangeThemeTimeOutId != null)
            {
                clearTimeout(this.startChangeThemeTimeOutId);
            }
            if(this.backChangeThemeTimeOutId != null)
            {
                clearTimeout(this.backChangeThemeTimeOutId);
            }
            if(this.forwardChangeThemeTimeOutId != null)
            {
                clearTimeout(this.forwardChangeThemeTimeOutId);
            }
            var _new_master = data.newLayouts[0].Master;
            var _master_width = _new_master.Width;
            var _master_height = _new_master.Height;
            if(Math.abs(_master_height - this.Height) > 1 || Math.abs(_master_width - this.Width) > 1)
            {
                _new_master.setSize(this.Width, this.Height);
            }
            var _presentation = this;
            for(var i = 0; i < data.arrInd.length; ++i)
            {
                data.slidesArray[arrInd[i]].prepareToChangeTheme2();
                data.slidesArray[arrInd[i]].Layout =  data.newLayouts[i];
            }

            this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(data.slidesArray[data.arrInd[data.startIndexPos]], _presentation, data.arrInd,  data.startIndexPos, _history_obj.newLayouts, 0, data.slidesArray)}, 30);
        };

        History.Add(this, _history_obj);

        this.resetStateCurSlide();

        this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide2(_slides_array[arrInd[_start_index_pos]], _presentation, arrInd,  _start_index_pos, _arr_new_layouts, 0, _slides_array)}, 30);

        this.Document_UpdateUndoRedoState();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------

    Document_Is_SelectionLocked : function(CheckType, AdditionalData)
    {
        if ( true === CollaborativeEditing.Get_GlobalLock() )
            return true;

        var cur_slide = this.Slides[this.CurPage];
        var slide_id = cur_slide.deleteLock.Get_Id();


        CollaborativeEditing.OnStart_CheckLock();

        if(CheckType === changestype_Drawing_Props)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for(var i = 0; i < selected_objects.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": selected_objects[i].Get_Id(),
                    "guid": selected_objects[i].Get_Id()
                };
                selected_objects[i].Lock.Check(check_obj);
            }
        }

        if(CheckType === changestype_Text_Props)
        {
            if(cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None)
                return true;
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for(var i = 0; i < selected_objects.length; ++i)
            {
                if(typeof selected_objects[i].applyAllTextProps === "function")
                {
                    var check_obj =
                    {
                        "type": c_oAscLockTypeElemPresentation.Object,
                        "slideId": slide_id,
                        "objId": selected_objects[i].Get_Id(),
                        "guid":selected_objects[i].Get_Id()
                    };
                    selected_objects[i].Lock.Check(check_obj);
                }
            }
        }

        if(CheckType === changestype_RemoveSlide)
        {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for(var i = 0; i < selected_slides.length; ++i)
            {
                if(this.Slides[selected_slides[i]].isLockedObject())
                    return true;
            }
            for(var i = 0; i < selected_slides.length; ++i)
            {
                var check_obj =
                {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].deleteLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].deleteLock.Get_Id()
                };
                this.Slides[selected_slides[i]].deleteLock.Lock.Check(check_obj);
            }
        }

        if(CheckType === changestype_Theme)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.themeLock.Get_Id(),
                "guid": this.themeLock.Get_Id()
            };
            this.themeLock.Lock.Check(check_obj);
        }

        if(CheckType === changestype_ColorScheme)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.schemeLock.Get_Id(),
                "guid": this.schemeLock.Get_Id()
            };
            this.schemeLock.Lock.Check(check_obj);
        }

        if(CheckType === changestype_SlideSize)
        {
            var check_obj =
            {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.slideSizeLock.Get_Id(),
                "guid": this.slideSizeLock.Get_Id()
            };
            this.slideSizeLock.Lock.Check(check_obj);
        }

        var bResult = CollaborativeEditing.OnEnd_CheckLock();

        if ( true === bResult )
        {
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            //this.Document_UpdateRulersState();
        }

        return bResult;
    },

    Save_Changes : function(Data, Writer)
    {
        Writer.WriteLong( historyitem_type_Document );

        var Type = Data.Type;

        // Пишем тип
        Writer.WriteLong( Type );


        switch ( Type )
        {
            case historyitem_Presenattion_RemoveSlide:
            case historyitem_Presenattion_AddSlide:
            {
                Writer.WriteLong(Data.Pos);
                Writer.WriteString2(Data.Id);
                break;
            }
        }

        return Writer;
    },

    Save_Changes2 : function(Data, Writer)
    {
        var bRetValue = false;
        var Type = Data.Type;
        switch ( Type )
        {
            case  historyitem_Document_AddItem:
            {
                break;
            }

            case historyitem_Document_RemoveItem:
            {
                break;
            }

            case historyitem_Document_Margin:
            {
                break;
            }

            case historyitem_Document_PageSize:
            {
                break;
            }

            case historyitem_Document_Orientation:
            {
                break;
            }
        }

        return bRetValue;
    },

    Load_Changes : function(Reader, Reader2)
    {
        // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
        // Long : тип класса
        // Long : тип изменений

        var ClassType = Reader.GetLong();
        if ( historyitem_type_Document != ClassType )
            return;

        var Type = Reader.GetLong();


        switch ( Type )
        {
            case historyitem_Presenattion_AddSlide:
            {
                var pos = this.m_oContentChanges.Check( contentchanges_Add, Reader.GetLong());
                var Id = Reader.GetString2();

                this.Slides.splice(pos, 0, g_oTableId.Get_ById(Id));
                CollaborativeEditing.Add_ChangedClass(this);
                break;
            }
            case historyitem_Presenattion_RemoveSlide:
            {
                var pos = Reader.GetLong();
                Reader.GetString2();

                var ChangesPos = this.m_oContentChanges.Check( contentchanges_Remove, pos);

                // действие совпало, не делаем его
                if ( false === ChangesPos )
                    break;
                this.Slides.splice(ChangesPos, 1);
                break;
            }
        }
        return true;
    },

    Get_SelectionState2 : function()
    {
        //this.Selection_Remove()

        // Сохраняем Id ближайшего элемента в текущем классе

        var State = new Object();
        /*if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            State.Type = docpostype_HdrFtr;

            if ( null != this.HdrFtr.CurHdrFtr )
                State.Id = this.HdrFtr.CurHdrFtr.Get_Id();
            else
                State.Id = null;
        }
        else if ( docpostype_DrawingObjects === this.CurPos.Type )
        {
            // TODO: запрашиваем параграф текущего выделенного элемента
            var X       = 0;
            var Y       = 0;
            var PageNum = this.CurPage;

            var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageNum);

            State.Type = docpostype_Content;
            State.Id   = this.Content[ContentPos].Get_Id();
        }
        else // if ( docpostype_Content === this.CurPos.Type )
        {
            State.Type = docpostype_Content;

            if ( true === this.Selection.Use )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                {
                    var FirstPara = this.Content[this.Selection.Data[0]];
                    State.Id = FirstPara.Get_Id();
                }
                else // if ( selectionflag_Common === this.Selection.Flag )
                {
                    var LastPara = this.Content[this.Selection.EndPos];
                    State.Id = LastPara.Get_Id();
                }
            }
            else
                State.Id = this.Content[this.CurPos.ContentPos].Get_Id();
        }
                   */
        return State;
    },

    Set_SelectionState2 : function(State)
    {
        /*this.Selection_Remove();

        var Id = State.Id;
        if ( docpostype_HdrFtr === State.Type )
        {
            this.CurPos.Type = docpostype_HdrFtr;

            if ( null === Id || true != this.HdrFtr.Set_CurHdrFtr_ById(Id) )
            {
                this.CurPos.Type       = docpostype_Content;
                this.CurPos.ContentPos = 0;

                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
            }
        }
        else // if ( docpostype_Content === State.Type )
        {
            var CurId = Id;

            var bFlag = false;

            var Pos = 0;
            while ( !bFlag )
            {
                // Найдем элемент с Id = CurId
                var Count = this.Content.length;
                Pos = 0;
                for ( Pos = 0; Pos < Count; Pos++ )
                {
                    if ( this.Content[Pos].Get_Id() == CurId )
                    {
                        bFlag = true;
                        break;
                    }
                }

                if ( !bFlag )
                {
                    var TempElement = g_oTableId.Get_ById(CurId);

                    if ( null === TempElement || null === TempElement.Prev || "undefined" === typeof(TempElement.Prev) )
                    {
                        Pos   = 0;
                        bFlag = true;
                        break;
                    }
                    else
                        CurId = TempElement.Prev.Get_Id();
                }
            }

            this.Selection.Start    = false;
            this.Selection.Use      = false;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos   = Pos;
            this.Selection.Flag     = selectionflag_Common;

            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = Pos;
            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
        }     */
    },
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
    Add_Comment : function(CommentData)
    {
        if ( true != this.CanAdd_Comment() )
        {
            CommentData.Set_QuoteText(null);
            var Comment = new CComment( this.Comments, CommentData );
            this.Comments.Add( Comment );
        }
        else
        {
            var QuotedText = this.Get_SelectedText(false);
            if ( null === QuotedText )
                QuotedText = "";
            CommentData.Set_QuoteText( QuotedText );

            var Comment = new CComment( this.Comments, CommentData );
            this.Comments.Add( Comment );

            if ( docpostype_HdrFtr === this.CurPos.Type )
            {
                this.HdrFtr.Add_Comment( Comment );
            }
            else if ( docpostype_DrawingObjects === this.CurPos.Type )
            {
                this.DrawingObjects.addComment( Comment );
            }
            else // if ( docpostype_Content === this.CurPos.Type )
            {
                if ( selectionflag_Numbering === this.Selection.Flag )
                    return;

                if ( true === this.Selection.Use )
                {
                    var StartPos, EndPos;
                    if ( this.Selection.StartPos < this.Selection.EndPos )
                    {
                        StartPos = this.Selection.StartPos;
                        EndPos   = this.Selection.EndPos;
                    }
                    else
                    {
                        StartPos = this.Selection.EndPos;
                        EndPos   = this.Selection.StartPos;
                    }

                    this.Content[StartPos].Add_Comment( Comment, true, false );
                    this.Content[EndPos].Add_Comment( Comment, false, true );
                }
                else
                {
                    this.Content[this.CurPos.ContentPos].Add_Comment( Comment, true, true );
                }
            }

            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }

        return Comment;
    },

    Change_Comment : function(Id, CommentData)
    {
        this.Comments.Set_CommentData( Id, CommentData );
    },

    Remove_Comment : function(Id, bSendEvent)
    {
        if ( null === Id )
            return;

        if ( true === this.Comments.Remove_ById( Id ) )
        {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();

            if ( true === bSendEvent )
                editor.sync_RemoveComment( Id );
        }
    },

    CanAdd_Comment : function()
    {
        // Проверим можно ли добавлять гиперссылку
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.CanAdd_Comment();
        else if ( docpostype_DrawingObjects == this.CurPos.Type )
            return this.DrawingObjects.canAddComment();
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            switch( this.Selection.Flag )
            {
                case selectionflag_Numbering:     return false;
                case selectionflag_Common:
                {
                    if ( true === this.Selection.Use && this.Selection.StartPos != this.Selection.EndPos )
                        return true;
                    else
                    {
                        var Pos = ( this.Selection.Use === true ? this.Selection.StartPos : this.CurPos.ContentPos );
                        var Element = this.Content[Pos];
                        return Element.CanAdd_Comment();
                    }
                }
            }
        }

        return false;
    },

    Select_Comment : function(Id)
    {
        var OldId = this.Comments.Get_CurrentId();
        this.Comments.Set_Current( Id );

        var Comment = this.Comments.Get_ById( Id );
        if ( null != Comment )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = Comment.m_oStartInfo.X;
            this.DrawingDocument.m_oWordControl.ScrollToPosition( Comment_X, Comment_Y, Comment_PageNum );
        }

        if ( OldId != Id )
        {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },

    Show_Comment : function(Id)
    {
        var Comment = this.Comments.Get_ById( Id );
        if ( null != Comment && null != Comment.m_oStartInfo.ParaId && null != Comment.m_oEndInfo.ParaId )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = Page_Width;

            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( Comment_X, Comment_Y, Comment_PageNum );
            editor.sync_ShowComment( Comment.Get_Id(), Coords.X, Coords.Y );
        }
        else
        {
            editor.sync_HideComment();
        }
    },

    Show_Comments : function()
    {
        this.Comments.Set_Use(true);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },

    Hide_Comments : function()
    {
        this.Comments.Set_Use(false);
        this.Comments.Set_Current(null);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },
//-----------------------------------------------------------------------------------
// Функции для работы с textbox
//-----------------------------------------------------------------------------------
    TextBox_Put : function(sText)
    {
        if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.Create_NewHistoryPoint();

            // Отключаем пересчет, включим перед последним добавлением. Поскольку,
            // у нас все добавляется в 1 параграф, так можно делать.
            this.TurnOffRecalc = true;

            var Count = sText.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                if ( Index === Count - 1 )
                    this.TurnOffRecalc = false;

                var _char = sText.charAt(Index);
                if (" " == _char)
                    this.Paragraph_Add( new ParaSpace(1) );
                else
                    this.Paragraph_Add( new ParaText(_char) );
            }

            // На случай, если Count = 0
            this.TurnOffRecalc = false;
        }
    },
//-----------------------------------------------------------------------------------
// события вьюера
//-----------------------------------------------------------------------------------
    Viewer_OnChangePosition : function()
    {
        var Comment = this.Comments.Get_Current();
        if ( null != Comment )
        {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y       = Comment.m_oStartInfo.Y;
            var Comment_X       = Page_Width;
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR( Comment_X, Comment_Y, Comment_PageNum );
            editor.sync_UpdateCommentPosition( Comment.Get_Id(), Coords.X, Coords.Y );
        }
    },

    StartAddShape: function(preset, _is_apply)
    {
        var elements =  this.Slides[this.CurPage].graphicObjects;
        if(!(_is_apply === false))
        {
            elements.CurPreset = preset;
            switch (preset)
            {
                case "polyline1":
                {
                    elements.ChangeState(new PolyLineAddState());
                    break;
                }
                case "polyline2":
                {
                    elements.ChangeState(new AddPolyLine2State());
                    break;
                }

                case "spline":
                {
                    elements.ChangeState(new SplineBezierState());
                    break;
                }
                case "lineWithArrow":
                {
                    elements.ChangeState(new StateAddArrows(true, false));
                    elements.CurPreset = "line";
                    break;
                }
                case "lineWithTwoArrows":
                {
                    elements.ChangeState(new StateAddArrows(true, true));
                    elements.CurPreset = "line";
                    break;
                }

                case "bentConnector5WithArrow":
                {
                    elements.ChangeState(new StateAddArrows(true, false));
                    elements.CurPreset = "bentConnector5";
                    break;
                }
                case "bentConnector5WithTwoArrows":
                {
                    elements.ChangeState(new StateAddArrows(true, true));
                    elements.CurPreset = "bentConnector5";
                    break;
                }

                case "curvedConnector3WithArrow":
                {
                    elements.ChangeState(new StateAddArrows(true, false));
                    elements.CurPreset = "curvedConnector3";
                    break;
                }
                case "curvedConnector3WithTwoArrows":
                {
                    elements.ChangeState(new StateAddArrows(true, true));
                    elements.CurPreset = "curvedConnector3";
                    break;
                }

                default :
                {
                    elements.changeCurrentState(new StartTrackNewShapeState(elements, this.Slides[this.CurPage], preset));
                }
            }
        }
        else
        {
            elements.resetSelectionState();
            this.DrawingDocument.m_oWordControl.OnUpdateOverlay();
            editor.sync_EndAddShape();
        }


        this.CurPos.Type = docpostype_Content;
    }
};
