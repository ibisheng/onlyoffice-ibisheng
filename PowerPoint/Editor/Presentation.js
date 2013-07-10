var X_Left_Margin   = 30;  // 3   cm
var X_Right_Margin  = 15;  // 1.5 cm
var Y_Bottom_Margin = 20;  // 2   cm
var Y_Top_Margin    = 20;  // 2   cm

var Y_Default_Header = 0; // 1.25 cm расстояние от верха страницы до верха верхнего колонтитула
var Y_Default_Footer = 0; // 1.25 cm расстояние от низа страницы до низа нижнего колонтитула

var X_Left_Field   = X_Left_Margin;
var X_Right_Field  = 254  - X_Right_Margin;
var Y_Bottom_Field = 191 - Y_Bottom_Margin;
var Y_Top_Field    = Y_Top_Margin;



var graphic_objects_type_Shape = 0;
var graphic_objects_type_Image = 1;
var graphic_objects_type_GroupShapes = 2;
var graphic_objects_type_Frame = 3;

var historyConstPresentationUndoRedo = 156416;

var docpostype_Content     = 0x00;
var docpostype_FlowObjects = 0x01;
var docpostype_HdrFtr      = 0x02;
var docpostype_FlowShape   = 0x03;

var selectionflag_Common        = 0x00;
var selectionflag_Numbering     = 0x01;
var selectionflag_DrawingObject = 0x002;

var orientation_Portrait  = 0x00;
var orientation_Landscape = 0x01;

var History = null;

var history_undo_redo_const = 0x5846;

function CStatistics(LogicDocument)
{
    this.LogicDocument = LogicDocument;

    this.Id = null;

    this.StartPos = 0;
    this.CurPage  = 0;

    this.Slides          = 0;
    this.Words           = 0;
    this.Paragraphs      = 0;
    this.SymbolsWOSpaces = 0;
    this.SymbolsWhSpaces = 0;
}

var contentchanges_Add    = 1;
var contentchanges_Remove = 2;

function CContentChanges(Type, Pos, Data)
{
    this.m_nType  = Type;  // Тип изменений (удаление или добавление)
    this.m_nPos   = Pos;   // Позиция, в которой произошли изменения
    this.m_pData  = Data;  // Связанные с данным изменением данные из истории

    this.Refresh_BinaryData = function()
    {
        var Binary_Writer = History.BinaryWriter;
        var Binary_Pos = Binary_Writer.GetCurPosition();

        this.m_pData.Data.Pos = this.m_nPos;
        this.m_pData.Class.Save_Changes( this.m_pData.Data, Binary_Writer );

        var Binary_Len = Binary_Writer.GetCurPosition() - Binary_Pos;

        this.m_pData.Binary.Pos = Binary_Pos;
        this.m_pData.Binary.Len = Binary_Len;
    };

    this.Check_Changes = function(Type, Pos)
    {
        if ( Pos < this.m_nPos )
        {
            if ( contentchanges_Add === Type )
                this.m_nPos++;
            else
                this.m_nPos--;

            return 0;
        }
        else
        {
            if ( contentchanges_Add === this.m_nType )
                return 1;
            else
                return -1;
        }
    };
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

        this.Slides           = 0;
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
            PageCount      : this.Slides,
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
            this.Slides += Count;
        else
            this.Slides++;
    },

    Add_Symbol : function(bSpace)
    {
        this.SymbolsWhSpaces++;
        if ( true != bSpace )
            this.SymbolsWOSpaces++;
    }
};

var SUPPORT_NORM_AUTOFIT = true;

function CPresentation( DrawingDocument ) {

    this.History = new CHistory(this);
    History = this.History;
    this.CollaborativeEditing = new CCollaborativeEditing();
    CollaborativeEditing = this.CollaborativeEditing;
    // Создаем глобальные объекты, необходимые для совместного редактирования
    this.IdCounter = new CIdCounter();
    g_oIdCounter = this.IdCounter;

    this.TableId = new CTableId();
    g_oTableId = this.TableId;

    this.StartPage = 0; // Для совместимости с CDocumentContent
    this.CurPage   = 0;

    this.Width  = 254;
    this.Height = 191;

    this.Orientation = orientation_Portrait; // ориентация страницы
    this.StyleCounter = 0;
    this.NumInfoCounter = 0;

    this.IdCounter = 0;

    this.lastImX = null;
    this.lastImY = null;


    this.ContentLastChangePos = 0;

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 0, // номер текущего плавающего объекта в this.Slides[this.CurPage].FlowObjects
        RealX      : 0, // позиция курсора, без учета расположения букв
        RealY      : 0, // это актуально для клавиш вверх и вниз
        Type       : docpostype_Content
    };

    this.Selection = {

        Start    : false,
        Use      : false,
        StartPos : 0,
        EndPos   : 0,
        Flag     : selectionflag_Common,
        Data     : null
    };


    this.Content = [];

    this.FullRecalc = new Object();
    this.FullRecalc.Id = null;
    this.FullRecalc.X  = 0;
    this.FullRecalc.Y  = 0;
    this.FullRecalc.StartPos = 0;
    this.FullRecalc.CurPage  = 0;

    this.Numbering = new CNumbering();
   // this.Numbering.
    this.Styles    = new CStyles();

    this.DrawingDocument = DrawingDocument;

    this.NeedUpdateTarget = false;

    this.customerDataList = [];
    this.customerShowList = [];
    this.defaultTextStyle = new CTextStyle();
    this.embeddedFontList = [];
    this.kinsoku = {};//японские настройки
    this.modifyVerifier = {};
    this.nodesMasterList = [];
    this.nodeSize = {cx : 0, cy : 0};
    this.photoAlbumInfo = {};
    this.slideSizeType = null;


    this.slideNumberAfterUndoRedo = -1;
    this.slideNumberAfterUndoRedo2 = -1;
    this.slideNumberAfterUndoRedoFlag = false;

    this.lastChangeThemeTimeOutId = null;
    // Массив укзателей на все инлайновые графические объекты

    //this.DrawingObjects = new CDrawingObjects();//TODO:инлайновых объектов в презентациях не будет. Надо их убрать

   // this.DrawingObjects = new CDrawingObjects();//TODO:инлайновых объектов в презентациях не будет. Надо их убрать


    // Класс для работы с колонтитулами
   // this.HdrFtr = new CHeaderFooterController(this, this.DrawingDocument);//

    // Класс для работы с поиском
    this.SearchInfo =
    {
        Id       : null,
        StartPos : 0,
        CurPage  : 0,
        String   : null
    };

    this.CopyTextPr = null; // TextPr для копированию по образцу

    // Класс для работы со статискикой документа
    this.Statistics = new CStatistics( this );
    this.Pages = this.Slides;


    this.Slides = [];
    this.themes       = [];
    this.slideMasters = [];
    this.slideLayouts = [];
    this.notesMasters = [];
    this.notes        = [];

    this.glyphsBuffer = [];
    this.slidesBuffer = [];


    this.Comments = { Is_Use : function() {return false}, Check_CurrentDraw: function(){return null}};

    this.Styles = new CStyles();

    this.forwardChangeThemeTimeOutId = null;
    this.backChangeThemeTimeOutId = null;
    this.startChangeThemeTimeOutId = null;

    this.viewMode = false;

    this.globalTableStyles = [];
    ///this.globalTableStyles[0] = CreateDefaultStylesForTables();
    this.DefaultSlideTiming = new CAscSlideTiming();
    this.DefaultSlideTiming.setDefaultParams();

    this.IsExternalFonts = false;
    this.createDefaultTableStyles();
}

CPresentation.prototype = {


    createDefaultTableStyles: function()
    {
        var count = 0;

        // Стандартные стили таблиц
        var Style_Table_Lined = new CStyle("Lined", null, null, styletype_Table );
        Style_Table_Lined.Create_Table_Lined( new CDocumentColor( 0xA6, 0xA6, 0xA6 ), new CDocumentColor( 0xD9, 0xD9, 0xD9 ) );
        this.globalTableStyles[count] = Style_Table_Lined;

        count++;

        var Style_Table_Lined_Accent1 = new CStyle("Lined - Accent 1", null, null, styletype_Table );
        Style_Table_Lined_Accent1.Create_Table_Lined( new CDocumentColor( 0x95, 0xB3, 0xD7 ), new CDocumentColor( 0xDB, 0xE5, 0xF1 ) );
        this.globalTableStyles[count] = Style_Table_Lined_Accent1;

        count++;

        var Style_Table_Lined_Accent2 = new CStyle("Lined - Accent 2", null, null, styletype_Table);
        Style_Table_Lined_Accent2.Create_Table_Lined( new CDocumentColor( 0xD9, 0x95, 0x94 ), new CDocumentColor( 0xF2, 0xDB, 0xDB ) );
        this.globalTableStyles[count]= Style_Table_Lined_Accent2;

        count++;

        var Style_Table_Lined_Accent3 = new CStyle("Lined - Accent 3", null, null, styletype_Table );
        Style_Table_Lined_Accent3.Create_Table_Lined( new CDocumentColor( 0xC2, 0xD6, 0x9B ), new CDocumentColor( 0xEA, 0xF1, 0xDD ) );
        this.globalTableStyles[count] = Style_Table_Lined_Accent3;

        count++;

        var Style_Table_Lined_Accent4 = new CStyle("Lined - Accent 4", null, null, styletype_Table );
        Style_Table_Lined_Accent4.Create_Table_Lined( new CDocumentColor( 0xB2, 0xA1, 0xC7 ), new CDocumentColor( 0xE5, 0xDF, 0xEC ) );
        this.globalTableStyles[count] = Style_Table_Lined_Accent4;

        count++;

        var Style_Table_Lined_Accent5 = new CStyle("Lined - Accent 5", null, null, styletype_Table );
        Style_Table_Lined_Accent5.Create_Table_Lined( new CDocumentColor( 0x92, 0xCD, 0xDC ), new CDocumentColor( 0xDA, 0xEE, 0xF3 ) );
        this.globalTableStyles[count] = Style_Table_Lined_Accent5;

        count++;

        var Style_Table_Lined_Accent6 = new CStyle("Lined - Accent 6", null, null, styletype_Table );
        Style_Table_Lined_Accent6.Create_Table_Lined( new CDocumentColor( 0xFA, 0xBF, 0x8F ), new CDocumentColor( 0xFD, 0xE9, 0xE9 ) );
        this.globalTableStyles[count] = Style_Table_Lined_Accent6;

        count++;

        var Style_Table_Bordered = new CStyle("Bordered", null, null, styletype_Table );
        Style_Table_Bordered.Create_Table_Bordered( new CDocumentColor( 0xBF, 0xBF, 0xBF ), new CDocumentColor( 0x00, 0x00, 0x00 ) );
        this.globalTableStyles[count] = Style_Table_Bordered;

        count++;

        var Style_Table_Bordered_Accent_1 = new CStyle("Bordered - Accent 1", null, null, styletype_Table );
        Style_Table_Bordered_Accent_1.Create_Table_Bordered( new CDocumentColor( 0xB8, 0xCC, 0xE4 ), new CDocumentColor( 0x36, 0x5F, 0x91 ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_1;

        count++;

        var Style_Table_Bordered_Accent_2 = new CStyle("Bordered - Accent 2", null, null, styletype_Table );
        Style_Table_Bordered_Accent_2.Create_Table_Bordered( new CDocumentColor( 0xE5, 0xB8, 0xB7 ), new CDocumentColor( 0x94, 0x36, 0x34 ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_2;

        count++;

        var Style_Table_Bordered_Accent_3 = new CStyle("Bordered - Accent 3", null, null, styletype_Table );
        Style_Table_Bordered_Accent_3.Create_Table_Bordered( new CDocumentColor( 0xD6, 0xE3, 0xBC ), new CDocumentColor( 0x76, 0x92, 0x3C ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_3;

        count++;

        var Style_Table_Bordered_Accent_4 = new CStyle("Bordered - Accent 4", null, null, styletype_Table );
        Style_Table_Bordered_Accent_4.Create_Table_Bordered( new CDocumentColor( 0xCC, 0xC0, 0xD9 ), new CDocumentColor( 0x5F, 0x49, 0x7A ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_4;

        count++;

        var Style_Table_Bordered_Accent_5 = new CStyle("Bordered - Accent 5", null, null, styletype_Table );
        Style_Table_Bordered_Accent_5.Create_Table_Bordered( new CDocumentColor( 0xB6, 0xDD, 0xE8 ), new CDocumentColor( 0x31, 0x84, 0x9B ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_5;

        count++;

        var Style_Table_Bordered_Accent_6 = new CStyle("Bordered - Accent 6", null, null, styletype_Table );
        Style_Table_Bordered_Accent_6.Create_Table_Bordered( new CDocumentColor( 0xFB, 0xD4, 0xB4 ), new CDocumentColor( 0xE3, 0x6C, 0x0A ) );
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_6;

        count++;

        var Style_Table_BorderedLined = new CStyle("Bordered & Lined", null, null, styletype_Table );
        Style_Table_BorderedLined.Create_Table_BorderedAndLined( new CDocumentColor( 0x00, 0x00, 0x00 ), new CDocumentColor( 0xA6, 0xA6, 0xA6 ), new CDocumentColor( 0xD9, 0xD9, 0xD9 ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined;

        count++;

        var Style_Table_BorderedLined_Accent1 = new CStyle("Bordered & Lined - Accent 1", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent1.Create_Table_BorderedAndLined( new CDocumentColor( 0x17, 0x36, 0x5D ), new CDocumentColor( 0x8D, 0xB3, 0xE2 ), new CDocumentColor( 0xDB, 0xE5, 0xF1 ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent1;

        count++;

        var Style_Table_BorderedLined_Accent2 = new CStyle("Bordered & Lined - Accent 2", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent2.Create_Table_BorderedAndLined( new CDocumentColor( 0x94, 0x36, 0x34 ), new CDocumentColor( 0xD9, 0x95, 0x94 ), new CDocumentColor( 0xF2, 0xDB, 0xDB ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent2;

        count++;

        var Style_Table_BorderedLined_Accent3 = new CStyle("Bordered & Lined - Accent 3", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent3.Create_Table_BorderedAndLined( new CDocumentColor( 0x76, 0x92, 0x3C ), new CDocumentColor( 0xC2, 0xD6, 0x9B ), new CDocumentColor( 0xEA, 0xF1, 0xDD ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent3;

        count++;

        var Style_Table_BorderedLined_Accent4 = new CStyle("Bordered & Lined - Accent 4", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent4.Create_Table_BorderedAndLined( new CDocumentColor( 0x5F, 0x49, 0x7A ), new CDocumentColor( 0xB2, 0xA1, 0xC7 ), new CDocumentColor( 0xE5, 0xDF, 0xEC ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent4;

        count++;

        var Style_Table_BorderedLined_Accent5 = new CStyle("Bordered & Lined - Accent 5", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent5.Create_Table_BorderedAndLined( new CDocumentColor( 0x31, 0x84, 0x9B ), new CDocumentColor( 0x92, 0xCD, 0xDC ), new CDocumentColor( 0xDA, 0xEE, 0xF3 ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent5;

        count++;

        var Style_Table_BorderedLined_Accent6 = new CStyle("Bordered & Lined - Accent 6", null, null, styletype_Table );
        Style_Table_BorderedLined_Accent6.Create_Table_BorderedAndLined( new CDocumentColor( 0xE3, 0x6C, 0x0A ), new CDocumentColor( 0xFA, 0xBF, 0x8F ), new CDocumentColor( 0xFD, 0xE9, 0xD9 ) );
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent6;



    },

    getAllTableStyles: function()
    {
        for(var  i = 0; i < this.globalTableStyles.length; ++i)
        {
            this.globalTableStyles[i].stylesId = i;
        }
        return this.globalTableStyles;
    },
    Init : function()
    {

    },


    slidesCut : function(_index_array, _history_new_point_flag)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(_index_array.length == 0)
        {
            return false;
        }

        this.glyphsBuffer.length = [];
        if(_history_new_point_flag !== true)
        {
            History.Create_NewPoint();
            this.Document_UpdateUndoRedoState();

        }
        var _history_obj;
        var _old_slide_arr_length = this.Slides.length;
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.old_cur_page = this.CurPage;
        _history_obj.undo_function = function(data)
        {
            var _slide_index;
            for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].changeNum(_slide_index);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(data.old_cur_page);
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        _history_obj.redo_function = function(data)
        {};
        History.Add(this, _history_obj);

        this.slidesBuffer.length = [];
        var _index, _cut_slide;
        for(_index = _index_array.length - 1; _index > -1; --_index)
        {
            _cut_slide = this.Slides.splice(_index_array[_index], 1)[0];
            this.slidesBuffer.push(_cut_slide);

            _history_obj = {};
            _history_obj.Type = history_undo_redo_const;
            _history_obj.slidePos = _index_array[_index];
            _history_obj.slide = _cut_slide;
            _history_obj.undo_function = function(data)
            {
                this.Slides.splice(data.slidePos, 0, data.slide);
            };
            _history_obj.redo_function = function(data)
            {
                this.Slides.splice(data.slidePos, 1);
            };
            History.Add(this, _history_obj);
        }

        var _slide_index;
        for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
        {
            this.Slides[_slide_index].changeNum(_slide_index);
        }



        this.slidesBuffer.reverse();
        this.DrawingDocument.OnEndRecalculate();
        if(_index_array[_index_array.length -1] == _old_slide_arr_length - 1)
        {
            this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length - 1);
        }
        else
        {
            this.DrawingDocument.m_oWordControl.GoToPage(_index_array[_index_array.length - 1] + 1 - _index_array.length);
        }
        this.DrawingDocument.UpdateThumbnailsAttack();

        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.slidePos = this.CurPage;
        _history_obj.undo_function = function(data)
        {};
        _history_obj.redo_function = function(data)
        {
            var _slide_index;
            for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].changeNum(_slide_index);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(data.slidePos);
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        History.Add(this, _history_obj);

        return true;
    },

    slidesCopy : function(_index_array)
    {
        if(this.viewMode === true)
        {
            return false;
        }
        if(_index_array.length == 0)
        {
            return false;
        }
        this.glyphsBuffer.length = [];
        var _index;
        this.slidesBuffer.length = [];
        for(_index = 0; _index < _index_array.length; ++ _index)
        {
            this.slidesBuffer.push(this.Slides[_index_array[_index]]);
        }
        return false;

    },

    Save_Changes : function()
    {

    },

    addNextSlide : function(layoutIndex)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var curSlide = this.Slides[this.CurPage];
        var master = curSlide.Layout.Master;
        if(curSlide.calculatedType == null)
        {
            curSlide.Layout.calculateType();
        }

        var matchingLayout;
        if(layoutIndex == null)
        {
            matchingLayout = curSlide.Layout.Master.getMatchingLayout(curSlide.Layout.type, curSlide.Layout.matchingName, curSlide.Layout.cSld.name);
        }
        else
        {
            matchingLayout = master.sldLayoutLst[layoutIndex];
        }
        //getMatchingLayout(layoutType != null ? layoutType :curSlide.Layout.calculatedType);//layoutType != undefined ? layoutType : ((curSlide.Layout.type == nSldLtTTitle)  ? nSldLtTObj : curSlide.Layout.type), null, null);
        if(matchingLayout == null)
        {
            matchingLayout = master.sldLayoutLst[0];
        }

        var _master = matchingLayout.Master;

        var _master_width = _master.Width;
        var _master_height = _master.Height;
        if(Math.abs(this.Width - _master_width) > 1 || Math.abs(this.Height - _master_height) > 1)
        {
            var kx = this.Width/_master_width;
            var ky = this.Height/_master_height;
            _master.Width = this.Width;
            _master.Height = this.Height;
            _master.changeProportions(kx, ky);
            var _layouts = _master.sldLayoutLst;
            var _layout_count = _layouts.length;
            var _layout_index;
            for(_layout_index = 0; _layout_index < _layout_count; ++_layout_index)
            {
                _layouts[_layout_index].changeProportions(kx, ky);
            }
        }
        if(!matchingLayout.calculated)
        {
            matchingLayout.elementsManipulator = new AutoShapesContainer(this, 0);
            var _arr_shapes = matchingLayout.cSld.spTree;
            var _shape_index;
           /* if(Math.abs(this.Width - 254) > 1 || Math.abs(this.Height - 190.5) > 1)
            {
                var kx = this.Width/254;
                var ky = this.Height/190.5;
                for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
                {
                    _arr_shapes[_shape_index].resizeToFormat(kx, ky);
                }
            }*/
            for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
            {
                _arr_shapes[_shape_index].setParent(matchingLayout);
                _arr_shapes[_shape_index].setContainer(matchingLayout.elementsManipulator);
                _arr_shapes[_shape_index].calculate();
            }
            matchingLayout.calculated = true;
        }

        var slide =  new Slide(this, matchingLayout, this.CurPage + 1);
        slide.calculateAfterChangeLayout();
        History.Create_NewPoint();

        var historyData = {};
        historyData.Type = history_undo_redo_const;
        historyData.num = this.CurPage+1;
        historyData.undo_function = function(data)
        {
            this.Slides.splice(data.num, 1);
            for(var i = data.num; i < this.Slides.length; ++i)
            {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                this.Slides[i].changeNum(i);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.Set_CurPage(data.num-1);
            this.DrawingDocument.m_oWordControl.GoToPage(data.num-1);
        };

        historyData.redo_function = function(data)
        {
            this.Slides.splice(data.num, 0, data.slide);
            for(var i = data.num+1; i < this.Slides.length; ++i)
            {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                this.Slides[i].changeNum(i);
            }
            this.DrawingDocument.OnRecalculatePage(data.num, this.Slides[data.num]);
            this.DrawingDocument.OnEndRecalculate();
            this.Set_CurPage(data.num);
            this.DrawingDocument.m_oWordControl.GoToPage(data.num);
        };
        historyData.slide = slide;

        History.Add(this, historyData);
        this.Slides.splice(this.CurPage+1, 0, slide);

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


    deleteSlides : function(arrInd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var oldLen = this.Slides.length;
        History.Create_NewPoint();

        var historyData = {};
        historyData.Type = history_undo_redo_const;
        historyData.undo_function = function(data)
        {
            for(var j = 0;  j < this.Slides.length; ++j)
            {
                this.Slides[j].changeNum(j);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        historyData.redo_function = function(data)
        {};
        History.Add(this, historyData);

        for(var i = arrInd.length-1; i >= 0; --i)
        {
            if(arrInd[i] > this.Slides.length - 1)
                continue;
            var deletedSlide = this.Slides.splice(arrInd[i], 1)[0];
            historyData = {};
            historyData.Type = history_undo_redo_const;
            historyData.slide = deletedSlide;
            historyData.num = arrInd[i];
            historyData.undo_function = function(data)
            {
                this.Slides.splice(data.num, 0, data.slide);
            };
            historyData.redo_function = function(data)
            {
                this.Slides.splice(data.num, 1);
            };
            History.Add(this, historyData);
        }

        for(i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }

        var historyData = {};
        historyData.Type = history_undo_redo_const;
        historyData.undo_function = function(data)
        {};
        historyData.redo_function = function(data)
        {
            for(var i = 0;  i < this.Slides.length; ++i)
            {
                this.Slides[i].changeNum(i);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        History.Add(this, historyData);

        this.Document_UpdateUndoRedoState();
        if(arrInd[arrInd.length-1] != oldLen-1)
        {
            this.DrawingDocument.m_oWordControl.GoToPage(arrInd[arrInd.length-1]+1 - arrInd.length);
        }
        else
        {
            this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length -1);
        }
        this.DrawingDocument.OnEndRecalculate();
        for(i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.Document_UpdateUndoRedoState();
    },

    slidesPaste : function(_pos, _no_create_history_point)
    {
        if(this.viewMode === true)
        {
            return false;
        }
        if(this.slidesBuffer.length == 0)
        {
            return false;
        }

        if(!(_no_create_history_point === true))
        {
            History.Create_NewPoint();
        }
        var _history_obj;
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.oldPos = this.CurPage;
        _history_obj.undo_function = function(data)
        {
            for(var _slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].changeNum(_slide_index);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(data.oldPos);
            this.DrawingDocument.UpdateThumbnailsAttack();

        };
        _history_obj.redo_function = function(data)
        {};
        History.Add(this, _history_obj);

        var _slide_index;
        var _copy_slides = [];
        var _slide_copy;
        for(_slide_index = 0; _slide_index < this.slidesBuffer.length; ++_slide_index)
        {
            _slide_copy = this.slidesBuffer[_slide_index].createFullCopy(_pos + 1 + _slide_index);
            _copy_slides.push(_slide_copy);
        }

        for(_slide_index = 0; _slide_index < _copy_slides.length; ++_slide_index)
        {
            this.Slides.splice(_pos+1 + _slide_index, 0, _copy_slides[_slide_index])
        }

        for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
        {
            this.Slides[_slide_index].changeNum(_slide_index);
        }
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.m_oWordControl.GoToPage(_pos + 1);
        this.DrawingDocument.UpdateThumbnailsAttack();

        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.copySlides = _copy_slides;
        _history_obj.pos = _pos;
        _history_obj.undo_function = function(data)
        {
            this.Slides.splice(data.pos + 1, data.copySlides.length);
        };
        _history_obj.redo_function = function(data)
        {
            for(var _slide_index = 0; _slide_index < data.copySlides.length; ++_slide_index)
            {
                this.Slides.splice(data.pos+1 + _slide_index, 0, data.copySlides[_slide_index])
            }

            for(_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].changeNum(_slide_index);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(data.pos + 1);
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
        return true;
    },


    shiftSlides : function(posNew, arrInd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        History.Create_NewPoint();
        var historyObj = {Type : history_undo_redo_const};
        historyObj.undo_function = function(data)
        {
            for(var i = 0; i < this.Slides.length ; ++i)
            {
                this.Slides[i].changeNum(i);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        historyObj.redo_function = function(data)
        {
        };

        History.Add(this, historyObj);
        var arr = [];
        var t = posNew;
        var t2 = 0;

        for(var i = arrInd.length-1; i >= 0; --i)
        {
            if(arrInd[i] > this.Slides.length - 1)
                continue;
            if(arrInd[i] < posNew)
            {
                --t;
            }
            var deletedSlide = this.Slides.splice(arrInd[i], 1)[0];
            arr.push(deletedSlide);
            var historyData = {};
            historyData.Type = history_undo_redo_const;
            historyData.slide = deletedSlide;
            historyData.num = arrInd[i];
            historyData.undo_function = function(data)
            {
                this.Slides.splice(data.num, 0, data.slide);
            };
            historyData.redo_function = function(data)
            {
                this.Slides.splice(data.num, 1);
            };
            History.Add(this, historyData);
        }

        arr.reverse();
        for(i = 0; i < arr.length; ++i)
        {
            historyData = {};
            historyData.Type = history_undo_redo_const;
            historyData.num = t+i;
            historyData.shape = arr[i];
            historyData.undo_function = function(data)
            {
                this.Slides.splice(data.num, 1);
            };
            historyData.redo_function = function(data)
            {
                this.Slides.splice(data.num, 0, data.shape);
            };
            History.Add(this, historyData);

            this.Slides.splice(t+i, 0, arr[i]);
            if(arr[i].num == this.CurPage)
            {
                t2 = t+i;
            }
        }


        var historyObj = {Type : history_undo_redo_const};
        historyObj.redo_function = function(data)
        {
            for(var i = 0; i < this.Slides.length ; ++i)
            {
                this.Slides[i].changeNum(i);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        };
        historyObj.undo_function = function(data)
        {
        };

        History.Add(this, historyObj);
        for(i = 0; i < this.Slides.length; ++i)
        {
            this.Slides[i].changeNum(i);
        }

        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.DrawingDocument.m_oWordControl.GoToPage(t2);
    },


    changeColorScheme : function(colorScheme)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(colorScheme == null)
        {
            return;
        }
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
        var _history_obj;

        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.startSlide = this.Slides[this.CurPage];
        _history_obj.slidesArray = _slides_array;
        _history_obj.redo_function = function(data)
        {};
        _history_obj.undo_function = function(data)
        {
            var _start_slide = data.startSlide;
            var _presentation = this;
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(_start_slide, _presentation, 0, data.slidesArray)},30);
        };

        History.Add(this, _history_obj);


        for(_slide_index = 0; _slide_index < _slide_count; ++_slide_index)
        {
            _cur_slide =_slides[_slide_index];

            _cur_theme = _cur_slide.Layout.Master.Theme;
            if(!_cur_theme.themeElements.clrScheme.isIdentical(colorScheme))
            {
                _old_color_scheme = _cur_theme.themeElements.clrScheme;
                _cur_theme.themeElements.clrScheme = colorScheme.createDuplicate();

                _history_obj = {};
                _history_obj.Type = history_undo_redo_const;
                _history_obj.oldColorScheme = _old_color_scheme;
                _history_obj.newColorScheme = _cur_theme.themeElements.clrScheme;
                _history_obj.themeElements = _cur_theme.themeElements;
                _history_obj.undo_function = function(data)
                {
                    data.themeElements.clrScheme = data.oldColorScheme;
                };
                _history_obj.redo_function = function(data)
                {
                    data.themeElements.clrScheme = data.newColorScheme;
                };
                History.Add(this, _history_obj);
            }
        }
        var _start_slide = this.Slides[this.CurPage];
        var _presentation = this;
        setTimeout(function(){recalculateSlideAfterChangeThemeColors(_start_slide, _presentation, 0, _slides_array)},30);

        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.startSlide = _start_slide;
        _history_obj.slidesArray = _slides_array;
        _history_obj.undo_function = function(data)
        {};
        _history_obj.redo_function = function(data)
        {
            var _start_slide = data.startSlide;
            var _presentation = this;
            setTimeout(function(){recalculateSlideAfterChangeThemeColors(_start_slide, _presentation, 0, data.slidesArray)},30);
        };
        History.Add(this, _history_obj);

        this.Document_UpdateUndoRedoState();
    },


    setVerticalAlign : function(align)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.Slides[this.CurPage].elementsManipulator.setVerticalAlign(align))
        {
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);

            this.Document_UpdateSelectionState();
        }
    },

    changeLayout : function(arrInd, master, layoutNum)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var layout = master.sldLayoutLst[layoutNum];
        if(!layout)
        {
            return;
        }
        var _index_num;
        var _slide;
        for(_index_num = 0; _index_num < arrInd.length; ++_index_num)
        {
            _slide = this.Slides[arrInd[_index_num]];
            if(_slide.Layout == layout && _slide.Layout.Master == master)
            {
                arrInd.splice(_index_num, 1);
                --_index_num;
            }
        }
        if(arrInd.length == 0)
        {
            return;
        }

        var _master = layout.Master;

        var _master_width = _master.Width;
        var _master_height = _master.Height;
        if(Math.abs(this.Width - _master_width) > 1 || Math.abs(this.Height - _master_height) > 1)
        {
            var kx = this.Width/_master_width;
            var ky = this.Height/_master_height;
            _master.Width = this.Width;
            _master.Height = this.Height;
            _master.changeProportions(kx, ky);
            var _layouts = _master.sldLayoutLst;
            var _layout_count = _layouts.length;
            var _layout_index;
            for(_layout_index = 0; _layout_index < _layout_count; ++_layout_index)
            {
                _layouts[_layout_index].changeProportions(kx, ky);
            }
        }
        if(!layout.calculated || layout.calculated === undefined || layout.calculated === false)
        {
            layout.elementsManipulator = new AutoShapesContainer(this, 0);
            var _layout_elements = layout.cSld.spTree;
            layout.elementsManipulator.ArrGlyph = _layout_elements;
            var _element_index;


            for(_element_index = 0; _element_index < _layout_elements.length; ++_element_index)
            {
                if(!_layout_elements[_element_index].isPlaceholder())
                {
                    _layout_elements[_element_index].setParent(layout);
                    _layout_elements[_element_index].setContainer(layout.elementsManipulator);
                    _layout_elements[_element_index].calculate();
                }
            }
            layout.calculated = true;
        }

        this.resetStateCurSlide();
        History.Create_NewPoint();
        for(_index_num = 0; _index_num < arrInd.length; ++_index_num)
        {
            _slide = this.Slides[arrInd[_index_num]];
            _slide.changeLayout(layout);
            this.DrawingDocument.OnRecalculatePage(_slide.num, _slide);
        }
        this.Document_UpdateUndoRedoState();
    },

    groupShapes : function()
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.Slides[this.CurPage].elementsManipulator.groupShapes())
        {
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }

    },

    unGroupShapes : function()
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.Slides[this.CurPage].elementsManipulator.unGroupShapes())
        {
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }
    },

    ShapeApply : function(properties)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.Slides[this.CurPage].elementsManipulator.State.id == 0)
        {
            var ArrGlyph = this.Slides[this.CurPage].elementsManipulator.ArrGlyph;
            for(var i = 0;  i< ArrGlyph.length; ++i)
            {
                if(ArrGlyph[i].selected && ((ArrGlyph[i] instanceof CShape) || (ArrGlyph[i] instanceof GroupShape)))
                {
                    if(properties.type != undefined && properties.type != -1)
                    {
                        ArrGlyph[i].changePresetGeom(properties.type);
                    }
                    if(properties.fill)
                    {
                        ArrGlyph[i].changeFill(properties.fill);
                    }
                    if(properties.stroke)
                    {
                        ArrGlyph[i].changeLine(properties.stroke);
                    }
                }
            }
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }
        else if(this.Slides[this.CurPage].elementsManipulator.State.id == 20)
        {
            var _cur_elements = this.Slides[this.CurPage].elementsManipulator;
            while(_cur_elements.State.id == 20)
            {
                _cur_elements = _cur_elements.group;
            }
            if(_cur_elements.State.id == 0)
            {
                var ArrGlyph = _cur_elements.ArrGlyph;
                for(var i = 0;  i< ArrGlyph.length; ++i)
                {
                    if(ArrGlyph[i].selected && ((ArrGlyph[i] instanceof CShape) || (ArrGlyph[i] instanceof GroupShape)))
                    {
                        if(properties.type != undefined && properties.type != -1)
                        {
                            ArrGlyph[i].changePresetGeom(properties.type);
                        }
                        if(properties.fill)
                        {
                            ArrGlyph[i].changeFill(properties.fill);
                        }
                        if(properties.stroke)
                        {
                            ArrGlyph[i].changeLine(properties.stroke);
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
            }

        }

        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
    },


    changeTheme : function(themeInfo)
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
           /*if(Math.abs(this.Width - 254) > 1 || Math.abs(this.Height - 190.5) > 1)
            {
                var kx = this.Width/254;
                var ky = this.Height/190.5;
                for(_shape_index = 0; _shape_index < _arr_shapes.length; ++_shape_index)
                {
                    _arr_shapes[_shape_index].resizeToFormat(kx, ky);
                }
            }        */
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

            this.Slides[_slide_index].prepareToChangeTheme(_new_layout);
            this.Slides[_slide_index].Layout = _new_layout;
        }


        this.resetStateCurSlide();

        this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide(_current_slide, _presentation, _arr_new_layouts, 0, _slides_array)}, 30);


        var _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.oldLayouts = _arr_old_layouts;
        _history_obj.newLayouts = _arr_new_layouts;
        _history_obj.startSlide = _current_slide;
        _history_obj.slidesArray = _slides_array;
        _history_obj.undo_function = function(data)
        {
            var _presentation = this;
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
            for(var _slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].prepareToChangeTheme2(/*data.oldLayouts[_slide_index]*/);
                this.Slides[_slide_index].Layout = data.oldLayouts[_slide_index];
            }


            this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide(data.startSlide, _presentation, data.oldLayouts, 0, data.slidesArray)}, 30);
        };
        _history_obj.redo_function = function(data)
        {
            var _presentation = this;
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
            for(var _slide_index = 0; _slide_index < this.Slides.length; ++_slide_index)
            {
                this.Slides[_slide_index].prepareToChangeTheme2(/*data.newLayouts[_slide_index]*/);
                this.Slides[_slide_index].Layout = data.newLayouts[_slide_index];
            }


            this.startChangeThemeTimeOutId = setTimeout(function(){redrawSlide(data.startSlide, _presentation, data.newLayouts, 0, data.slidesArray)}, 30);
        };


        History.Add(this, _history_obj);

        this.Document_UpdateUndoRedoState();
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


    deleteSlide : function(slideNum)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(slideNum < 0 || slideNum > this.Slides.length - 1 )
        {
            return;
        }

        var deletedSlide = this.Slides.splice(slideNum, 1);
        for(var i = slideNum; i < this.Slides.length; ++i)
        {
            --this.Slides[i].slideNum;
            --this.Slides[i].elementsManipulator.SlideNum;
        }
        var data = {Type : history_undo_redo_const};
        data.slideNum = slideNum;
        data.slide = deletedSlide;
        var undo_function = function(data)
        {
            this.Slides.splice(data.slideNum, 0, data.slide);
            for(var i = data.slideNum+1; i < this.Slides.length; ++i)
            {
                ++this.Slides[i].slideNum;
                ++this.Slides[i].elementsManipulator.SlideNum;
            }
        };

        var redo_function = function(data)
        {
            this.Slides.splice(data.slideNum, 1);
            for(var i = data.slideNum; i < this.Slides.length; ++i)
            {
                --this.Slides[i].slideNum;
                --this.Slides[i].elementsManipulator.SlideNum;
            }
        };

        data.undo_function = undo_function;
        data.redo_function = redo_function;

        History.Create_NewHistoryPoint();
        History.Add(this, data);
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
        createTestPresentation(this);
    },

    MergeElements: function(NumSlide)
    {
    },

    Set_CurrentElement : function(Index)
    {

    },

    Get_PageContentStartPos : function (PageIndex)
    {
        /*var Y = Y_Top_Field;
        var YHeader = this.HdrFtr.Get_HeaderBottomPos( PageIndex );
        if ( YHeader >= 0 && YHeader > Y )
            Y = YHeader;

        var YLimit = Y_Bottom_Field;
        var YFooter = this.HdrFtr.Get_FooterTopPos( PageIndex );
        if ( YFooter >= 0 &&  YFooter < YLimit )
            YLimit = YFooter;            */

        return { X : X_Left_Field, Y : Y_Top_Field, XLimit : X_Right_Field, YLimit : Y_Bottom_Field };
    },


// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
    Hyperlink_Add : function(HyperProps)
    {
        if(!this.Hyperlink_CanAdd())
        {
            return;
        }
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.obj != null && _elements.obj.Hyperlink_Add)
            {
                _elements.obj.Hyperlink_Add(HyperProps);
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
            }
        }
    },

    Hyperlink_Modify : function(HyperProps)
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.obj != null && _elements.obj.Hyperlink_Modify)
            {
                _elements.obj.Hyperlink_Modify(HyperProps);
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
            }
        }
    },

    Hyperlink_Remove : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.obj != null && _elements.obj.Hyperlink_Remove)
            {
                _elements.obj.Hyperlink_Remove();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
            }
        }
    },

    Hyperlink_CanAdd : function()
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.obj != null && _elements.obj.Hyperlink_CanAdd)
            {
                return _elements.obj.Hyperlink_CanAdd();
            }
        }
        return false;
    },

    // Проверяем, находимся ли мы в гиперссылке сейчас
    Hyperlink_Check : function(bCheckEnd)
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.obj != null && _elements.obj.Hyperlink_Check)
            {
                return _elements.obj.Hyperlink_Check(bCheckEnd);
            }
        }
        return null;
    },
    // Пересчет содержимого Документа
    Recalculate : function()
    {
        this.DrawingDocument.OnRecalculatePage( this.CurPage, this.Slides[this.CurPage] );
        this.DrawingDocument.OnEndRecalculate();
        //TODO: Пока обновляем состояние линейки после каждого обсчета. Надо будет переделать.
        //this.Document_UpdateRulersState();

        //sendStatus( "Recalc: " + ((new Date().getTime() - StartTime) / 1000) + " s"  + " StylesCompileCount : " + this.StyleCounter + " NumInfoCount : " + this.NumInfoCounter );
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
                    this.DrawingDocument.OnRecalculatePage( CurPage, this.Slides[CurPage] );

                if ( "undefined" == typeof(this.Slides[++CurPage]) )
                {
                    this.Slides[CurPage] = new Object();
                   // this.Slides[CurPage].FlowObjects = new FlowObjects(this, CurPage);
                }
                this.Slides[CurPage].Width   = 254;
                this.Slides[CurPage].Height  = 191;
                this.Slides[CurPage].Margins =
                {
                    Left   : X_Left_Field,
                    Right  : X_Right_Field,
                    Top    : Y_Top_Field,
                    Bottom : Y_Bottom_Field
                };
                this.Slides[CurPage].Pos = Index;

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
            this.DrawingDocument.OnRecalculatePage( CurPage, this.Slides[CurPage] );
            this.DrawingDocument.OnEndRecalculate( false, true );
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
                this.DrawingDocument.OnRecalculatePage( PageNum, this.Slides[PageNum] );
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

        /*
        this.NeedUpdateTarget = true;
        this.RecalculateCurPos();
        this.NeedUpdateTarget = false;
        */
    },

    RecalculateCurPos : function()
    {
      if ( docpostype_FlowObjects === this.CurPos.Type )
      {
            var obj =this.Slides[this.CurPage].elementsManipulator.obj;
            if(obj && obj.RecalculateCurPos != undefined) {

                obj.RecalculateCurPos();
            }
        }
    },

    Internal_CheckCurPage : function()
    {
        if ( this.CurPos.ContentPos >= 0 )
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
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


        pGraphics.put_GlobalAlpha(false);

        this.Slides[nPageIndex].draw(pGraphics);
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
        if(this.viewMode === true)
        {
            return;
        }
        var elements = this.Slides[this.CurPage].elementsManipulator;
        if ( this.CurPos.Type === docpostype_FlowObjects && elements.obj && elements.obj.Add_NewParagraph) {

            this.NeedTargetUpdate = true;
            elements.obj.Add_NewParagraph( bRecalculate );
            elements.obj.RecalculateContent();
            this.RecalculateCurPos();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateSelectionState();
            return false;
        }
    },

    Add_FlowImage : function(W, H, Img)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var Image = new CImage2(this.Slides[this.CurPage]);
        var AutoShapes = this.Slides[this.CurPage].elementsManipulator;
        Image.Container = AutoShapes;
        if(this.lastImX == null || this.lastImY == null)
        {
            Image.spPr.xfrm.offX = (this.Width-W)/2;
            Image.spPr.xfrm.offY = (this.Height-H)/2;
            this.lastImX = Image.spPr.xfrm.offX+5;
            this.lastImY = Image.spPr.xfrm.offY+5;
        }
        else
        {
            Image.spPr.xfrm.offX = this.lastImX;
            Image.spPr.xfrm.offY = this.lastImY;
            this.lastImX+=5;
            this.lastImY+=5;
        }

        Image.spPr.xfrm.extX = W;
        Image.spPr.xfrm.extY = H;
        Image.blipFill = new CUniFill();
        Image.blipFill.fill = new CBlipFill();
        Image.blipFill.fill.RasterImageId  = Img;
        Image.nvPicPr = new UniNvPr();
        Image.nvPicPr.cNvPr.id = ++this.Slides[this.CurPage].maxId;
        Image.calculate();
        AutoShapes.Add(Image);

        var _history_obj = {};
        _history_obj.image = Image;
        _history_obj.pos = AutoShapes.ArrGlyph.length-1;
        _history_obj.undo_function = function(data)
        {
            this.ArrGlyph.splice(data.pos, 1);
        };
        _history_obj.redo_function = function(data)
        {
            this.ArrGlyph.splice(data.pos, 0, data.image);
        };

        History.Create_NewPoint();
        History.Add(AutoShapes, _history_obj);

        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
    },



    Add_InlineImage : function(W, H, Img)
    {
        return;
    },

    FlowImage_Move : function(FlowImageId, oldPageNum, newPageNum)
    {
        this.DrawingDocument.OnRecalculatePage( this.CurPage, this.Slides[this.CurPage] );
        this.DrawingDocument.OnEndRecalculate( false, false );
    },

    InlineObject_Move : function(ObjId, X, Y, PageNum)
    {
    },

    Add_InlineObjectXY : function(Obj, X, Y, PageNum)
    {
    },

    InlineObject_Resize : function(ObjId, W, H)
    {

    },

    InlineTable_Move : function(Table, X, Y, PageNum)
    {
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
        var _elements = _cur_slide.elementsManipulator;
        var _graphic_frame = new CGraphicFrame(_cur_slide);
        _graphic_frame.spPr.xfrm = new CXfrm();
        _graphic_frame.spPr.xfrm.offX = this.Width/6;
        _graphic_frame.spPr.xfrm.offY = this.Height/5;
        _graphic_frame.spPr.xfrm.extX = W;
        _graphic_frame.spPr.xfrm.extY =  7.478268771701388 * Rows;
        _graphic_frame.setParent(_cur_slide);
        _graphic_frame.setContainer(_elements);

        if (this.globalTableStyles.length == 0)
            this.globalTableStyles[0] = CreateDefaultStylesForTables();

        var _table = new CTable(this.DrawingDocument, _graphic_frame/*Parent*/, false/*Inline*/, 0/*PageNum*/, 0/*X*/, 0/*Y*/, W/*XLimit*/, 100/*YLimit*/, Rows, Cols, Grid);
        _table.styleIndex = 0;
        _graphic_frame.graphicObject = _table;
        _graphic_frame.selected = true;
        _graphic_frame.calculate();
        _elements.Add(_graphic_frame);

        var _history_obj = {};
        _history_obj.frame = _graphic_frame;
        _history_obj.pos = _elements.ArrGlyph.length-1;
        _history_obj.undo_function = function(data)
        {
            this.ArrGlyph.splice(data.pos, 1);
        };
        _history_obj.redo_function = function(data)
        {
            this.ArrGlyph.splice(data.pos, 0, data.frame);
        };


        History.Create_NewPoint();
        this.CurPos.Type = docpostype_FlowObjects;
        _elements.State = new AddTextState();
        _elements.obj = _graphic_frame;
        History.Add(_elements, _history_obj);
        this.Recalculate();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, _cur_slide);
        this.DrawingDocument.UpdateTargetTransform(_graphic_frame.TransformMatrix);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },

    Add_InlineTable : function(Cols, Rows)
    {
        return false;
    },

    Add_InlineTableXY : function(Table, X, Y, PageNum)
    {

        return false;
    },

    CheckRange : function(X0, Y0, X1, Y1, PageNum)
    {
        return [];
    },

    Paragraph_Add : function( ParaItem, bRecalculate )
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.NeedTargetUpdate = true;
            this.Slides[this.CurPage].elementsManipulator.obj.Paragraph_Add(ParaItem, bRecalculate);
            this.Slides[this.CurPage].elementsManipulator.obj.RecalculateContent2();
            this.RecalculateCurPos();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.DrawingDocument.OnEndRecalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
            return false;
        }
        else if(ParaItem != null && ParaItem.Type === para_TextPr && ParaItem.Value != null  && this.CurPos.Type == docpostype_Content)
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }

            if(_elements.State.id === 0)
            {
                var _shape_index;
                var _shapes = _elements.ArrGlyph;
                var _cur_shape;
                var _shape_count = 0;
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _cur_shape = _shapes[_shape_index];

                    if(_cur_shape.selected && (_cur_shape instanceof CShape || _cur_shape instanceof GroupShape || _cur_shape instanceof CGraphicFrame))
                    {
                        var _history_obj = {};
                        _history_obj.undo_function = function(data)
                        {
                            if(this.Recalculate)
                            {
                                this.Recalculate();
                            }
                        };
                        _history_obj.redo_function = function()
                        {};
                        History.Add(_cur_shape, _history_obj);
                        ++_shape_count;
                        if(_cur_shape instanceof  CShape)
                        {
                            if(_cur_shape.txBody )
                            {
                                if(_cur_shape.txBody.content)
                                {
                                    _cur_shape.txBody.content.Set_ApplyToAll(true);
                                    _cur_shape.txBody.content.Paragraph_Add(ParaItem);
                                    _cur_shape.txBody.content.Set_ApplyToAll(false);
                                }
                                if(_cur_shape.txBody.content2)
                                {
                                    _cur_shape.txBody.content2.Set_ApplyToAll(true);
                                    _cur_shape.txBody.content2.Paragraph_Add(ParaItem);
                                    _cur_shape.txBody.content2.Set_ApplyToAll(false);
                                }
                                _cur_shape.txBody.recalculate();
                            }
                        }
                        else
                        {
                            _cur_shape.paragraphAddTextPr(ParaItem);
                        }
                        _history_obj = {};
                        _history_obj.undo_function = function(data)
                        {
                        };
                        _history_obj.redo_function = function()
                        {
                            if(this.Recalculate)
                            {
                                this.Recalculate();
                            }
                        };
                        History.Add(_cur_shape, _history_obj);
                    }
                }
                /*if(_shape_count === 1)
                {
                    for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index )
                    {
                        if(_shapes[_shape_index].selected && _shapes[_shape_index] instanceof  CShape)
                        {
                            _cur_shape = _shapes[_shape_index];
                            if(_cur_shape.txBody && _cur_shape.txBody.content2 == null && _cur_shape.txBody.content.Is_Empty())
                            {
                                _elements.obj = _cur_shape;
                                _elements.NumEditShape = _shape_index;
                                _cur_shape.addTextFlag = true;
                                _cur_shape.txBody.content.Selection_SetStart(0, 0, 0 , global_mouseEvent);
                                _cur_shape.txBody.content.Selection_SetEnd(0, 0, 0 , global_mouseEvent);
                                _elements.ChangeState(new AddTextState());
                                if(_cur_shape.txBody && _cur_shape.txBody.compiledBodyPr && _cur_shape.txBody.compiledBodyPr.anchor != undefined)
                                {
                                    var _vertical_align = _cur_shape.txBody.compiledBodyPr.anchor;
                                    editor.sync_VerticalTextAlign(_vertical_align);
                                }
                                this.CurPos.Type = docpostype_FlowObjects;
                            }
                        }
                    }
                }     */
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.DrawingDocument.OnEndRecalculate();
                this.Document_UpdateSelectionState();
                this.Document_UpdateUndoRedoState();
            }
        }
    },

    Paragraph_ClearFormatting : function()
    {
        if(this.viewMode === true)
        {
            return;
        }
        // Flow объекты
        if ( docpostype_FlowObjects == this.CurPos.Type && this.Slides[this.CurPage].elementsManipulator.obj && this.Slides[this.CurPage].elementsManipulator.obj.Paragraph_ClearFormatting )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Paragraph_ClearFormatting();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
            return;
        }

    },

    Remove : function(Count, bOnlyText, bRemoveOnlySelection)
    {

        if(this.viewMode === true)
        {
            return;
        }
        if( this.CurPos.Type===docpostype_FlowObjects
            && this.Slides[this.CurPage].elementsManipulator.obj
            && this.Slides[this.CurPage].elementsManipulator.obj.Remove) {

            this.NeedTargetUpdate = true;
            this.Slides[this.CurPage].elementsManipulator.obj.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.Slides[this.CurPage].elementsManipulator.obj.RecalculateContent();

            this.RecalculateCurPos();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
        }
        return false;
    },

    Cursor_GetPos : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Cursor_GetPos();
        }

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

    Cursor_MoveToStartPos : function()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects
            && this.Slides[this.CurPage].elementsManipulator.obj
            && this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveToStartPos)
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveToStartPos();
            this.RecalculateCurPos();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();

            return true;
        }
    },

    Cursor_MoveToEndPos : function()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects
            && this.Slides[this.CurPage].elementsManipulator.obj
            && this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveToEndPos)
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveToEndPos();
            this.RecalculateCurPos();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return true;
        }
    },

    Cursor_MoveLeft : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveLeft(AddToSelect);
            this.RecalculateCurPos();


            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return true;
        }
    },

    Cursor_MoveRight : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveRight(AddToSelect);
            this.RecalculateCurPos();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return true;
        }
    },

    Cursor_MoveUp : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveUp(AddToSelect);
            this.RecalculateCurPos();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return true;
        }
    },

    Cursor_MoveDown : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.Cursor_MoveDown(AddToSelect);
            this.RecalculateCurPos();

            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return true;
        }
    },

    Cursor_MoveEndOfLine : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            var _cur_shape = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_shape != null && _cur_shape.Cursor_MoveEndOfLine != null)
            {
                _cur_shape.Cursor_MoveEndOfLine(AddToSelect);
                this.RecalculateCurPos();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return true;
            }
        }
    },

    Cursor_MoveStartOfLine : function(AddToSelect)
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            var _cur_shape = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_shape != null && _cur_shape.Cursor_MoveStartOfLine != null)
            {
                _cur_shape.Cursor_MoveStartOfLine(AddToSelect);
                this.RecalculateCurPos();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return true;
            }
        }
    },

    Cursor_MoveAt : function( X, Y, AddToSelect )
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            var _cur_shape = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_shape != null && _cur_shape.Cursor_MoveAt != null)
            {
                _cur_shape.Cursor_MoveAt(X, Y, AddToSelect);
                this.RecalculateCurPos();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return true;
            }
        }
    },

    Set_ParagraphAlign : function(Align)
    {

        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects)
        {
            if ( this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphAlign)
            {
                this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphAlign( Align );
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage,this.Slides[this.CurPage]);
                this.RecalculateCurPos();
                return false;
            }
        }
        else if(this.CurPos.Type === docpostype_Content)
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }

            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape;
                var _shape_index;
                for(_shape_index = 0; _shape_index <_shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        if(_shape instanceof  CShape)
                        {
                            var _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);
                            if(_shape.txBody)
                            {
                                if(_shape.txBody.content)
                                {
                                    _shape.txBody.content.Set_ApplyToAll(true);
                                    _shape.txBody.content.Set_ParagraphAlign( Align );
                                    _shape.txBody.content.Set_ApplyToAll(false);
                                }
                                if(_shape.txBody.content2)
                                {
                                    _shape.txBody.content2.Set_ApplyToAll(true);
                                    _shape.txBody.content2.Set_ParagraphAlign( Align );
                                    _shape.txBody.content2.Set_ApplyToAll(false);
                                }
                                _shape.txBody.recalculate()
                            }
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {

                            };
                            _history_obj.redo_function = function()
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            History.Add(_shape, _history_obj);
                        }
                        if(_shape instanceof GroupShape || _shape instanceof  CGraphicFrame && _shape.graphicObject instanceof  CTable)
                        {
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);
                            _shape.setParagraphAlign(Align);
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {

                            };
                            _history_obj.redo_function = function()
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            History.Add(_shape, _history_obj);
                        }
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage,this.Slides[this.CurPage]);
                return false;
            }
        }
    },

    Set_ParagraphSpacing : function(Spacing)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphSpacing) )
            {
                this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphSpacing( Spacing );
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.RecalculateCurPos();
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
            return false;
        }
        else if(this.CurPos.Type === docpostype_Content)
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }

            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape;
                var _shape_index;
                for(_shape_index = 0; _shape_index <_shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        if(_shape instanceof  CShape)
                        {
                            var _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);
                            if(_shape.txBody)
                            {
                                if(_shape.txBody.content)
                                {
                                    _shape.txBody.content.Set_ApplyToAll(true);
                                    _shape.txBody.content.Set_ParagraphSpacing( Spacing );
                                    _shape.txBody.content.Set_ApplyToAll(false);
                                }
                                if(_shape.txBody.content2)
                                {
                                    _shape.txBody.content2.Set_ApplyToAll(true);
                                    _shape.txBody.content2.Set_ParagraphSpacing( Spacing );
                                    _shape.txBody.content2.Set_ApplyToAll(false);
                                }
                                _shape.txBody.recalculate();
                                _history_obj = {};
                                _history_obj.undo_function = function(data)
                                {

                                };
                                _history_obj.redo_function = function()
                                {
                                    if(this.Recalculate)
                                    {
                                        this.Recalculate();
                                    }
                                };
                                History.Add(_shape, _history_obj);
                            }
                        }
                        if(_shape instanceof GroupShape)
                        {
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);
                            _shape.setParagraphSpacing(Spacing);
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {

                            };
                            _history_obj.redo_function = function()
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            History.Add(_shape, _history_obj);
                        }
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage,this.Slides[this.CurPage]);
                return false;
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphTabs : function(Tabs)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( this.Slides[this.CurPage].elementsManipulator.obj && "undefined" != typeof(this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphTabs) )
            {
                this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphTabs( Tabs );
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.RecalculateCurPos();
                this.DrawingDocument.OnRecalculatePage(this.CurPage,this.Slides[this.CurPage]);
                editor.Update_ParaTab( Default_Tab_Stop, Tabs );
            }

            return false;
        }
    },

    Set_ParagraphIndent : function(Ind)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ("function" === typeof(this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphIndent) )
            {
                this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphIndent( Ind );
                this.RecalculateCurPos();
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }

            return false;
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },

    Set_ParagraphNumbering : function(NumInfo)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects
            &&  this.Slides[this.CurPage].elementsManipulator.obj
            && this.Slides[this.CurPage].elementsManipulator.obj.setNumbering) {

            this.Slides[this.CurPage].elementsManipulator.obj.setNumbering( NumInfo );
            this.RecalculateCurPos();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            return false;
        }
        else if(this.CurPos.Type === docpostype_Content)
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }
            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape_index;
                var _shape;
                for(_shape_index = 0 ; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected && (_shape instanceof CShape || _shape instanceof GroupShape || _shape instanceof CGraphicFrame && _shape.graphicObject instanceof CTable))
                    {
                        var _history_obj = {};
                        _history_obj.undo_function = function(data)
                        {
                            if(this.Recalculate)
                            {
                                this.Recalculate();
                            }
                        };
                        _history_obj.redo_function = function()
                        {};
                        History.Add(_shape, _history_obj);
                        if(_shape instanceof CShape)
                        {

                            if(_shape.txBody )
                            {
                                if(_shape.txBody.content)
                                {
                                    _shape.txBody.content.Set_ApplyToAll(true);
                                    _shape.txBody.content.Set_ParagraphNumbering(NumInfo);
                                    _shape.txBody.content.Set_ApplyToAll(false);
                                }
                                if(_shape.txBody.content2)
                                {
                                    _shape.txBody.content2.Set_ApplyToAll(true);
                                    _shape.txBody.content2.Set_ParagraphNumbering(NumInfo);
                                    _shape.txBody.content2.Set_ApplyToAll(false);
                                }
                                _shape.Recalculate();
                            }
                        }
                        if(_shape instanceof GroupShape || _shape instanceof CGraphicFrame)
                        {
                            _shape.setParagraphNumbering(NumInfo);
                            _shape.Recalculate();
                        }
                        _history_obj = {};
                        _history_obj.undo_function = function(data)
                        {

                        };
                        _history_obj.redo_function = function()
                        {
                            if(this.Recalculate)
                            {
                                this.Recalculate();
                            }
                        };
                        History.Add(_shape, _history_obj);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateUndoRedoState();
    },

    Set_ParagraphShd : function(Shd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphShd) )
                this.Slides[this.CurPage].elementsManipulator.obj.Set_ParagraphShd( Shd );
            this.RecalculateCurPos();

            return false;
        }
    },

    Set_ParagraphStyle : function(Name)
    {
        return false;
    },

    Set_ParagraphContextualSpacing : function(Value)
    {
        return false;
    },

    Set_ParagraphPageBreakBefore : function(Value)
    {
       return false;
    },

    Set_ParagraphKeepLines : function(Value)
    {
        return false;
    },

    Set_ParagraphBorders : function(Borders)
    {
        return false;
    },

    Paragraph_IncDecFontSize : function(bIncrease)
    {

        if(this.viewMode === true)
        {
            return;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( this.Slides[this.CurPage].elementsManipulator.obj.Paragraph_IncDecFontSize)
            {
                this.Slides[this.CurPage].elementsManipulator.obj.Paragraph_IncDecFontSize(bIncrease);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }


            return false;
        }
        else if(this.CurPos.Type === docpostype_Content)
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }

            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape;
                var _shape_index;
                for(_shape_index = 0; _shape_index <_shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        if(_shape instanceof  CShape)
                        {
                            var _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);
                            if(_shape.txBody)
                            {
                                if(_shape.txBody.content)
                                {
                                    _shape.txBody.content.Set_ApplyToAll(true);
                                    _shape.txBody.content.Paragraph_IncDecFontSize( bIncrease );
                                    _shape.txBody.content.Set_ApplyToAll(false);
                                }
                                if(_shape.txBody.content2)
                                {
                                    _shape.txBody.content2.Set_ApplyToAll(true);
                                    _shape.txBody.content2.Paragraph_IncDecFontSize( bIncrease );
                                    _shape.txBody.content2.Set_ApplyToAll(false);
                                }
                                _shape.txBody.recalculate()
                            }
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {

                            };
                            _history_obj.redo_function = function()
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            History.Add(_shape, _history_obj);
                        }
                        if(_shape instanceof GroupShape)
                        {
                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            _history_obj.redo_function = function()
                            {};
                            History.Add(_shape, _history_obj);

                            _shape.IncDecFontSize(bIncrease);

                            _history_obj = {};
                            _history_obj.undo_function = function(data)
                            {};
                            _history_obj.redo_function = function()
                            {
                                if(this.Recalculate)
                                {
                                    this.Recalculate();
                                }
                            };
                            History.Add(_shape, _history_obj);
                        }
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                this.DrawingDocument.OnRecalculatePage(this.CurPage,this.Slides[this.CurPage]);
                return false;
            }
        }


    },

    Paragraph_IncDecIndent : function(bIncrease)
    {
        return;
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            var bRetValue = this.HdrFtr.Paragraph_IncDecIndent(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
            return bRetValue;
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( flowobject_Table === this.Selection.Data.FlowObject.Get_Type() )
            {
                this.Selection.Data.FlowObject.Table.Paragraph_IncDecIndent(bIncrease);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
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

                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateUndoRedoState();
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

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateUndoRedoState();
    },


    changeShapeType : function(shapeType)
    {

        if(this.viewMode === true)
        {
            return;
        }


        var _elements = this.Slides[this.CurPage].elementsManipulator;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            History.Create_NewPoint();
            var shapeArr = _elements.ArrGlyph;
            for(var i = 0; i < shapeArr.length; ++i)
            {
                if(shapeArr[i].selected && shapeArr[i] instanceof  CShape)
                {
                    shapeArr[i].changePresetGeom(shapeType);
                }

            }
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateUndoRedoState();
        }

    },

    putLineCap : function(cap)
    {

        if(this.viewMode === true)
        {
            return;
        }

        if(typeof(cap) != "number" || cap < 0 || cap > 2)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill == null
            || _old_compiled_line.Fill.fill == null
            || _old_compiled_line.Fill.fill.type == FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;

        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }

        }

        _new_line.cap = cap;
        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();

        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);

        this.Document_UpdateUndoRedoState();
    },

    putLineJoin : function(join)
    {

        if(this.viewMode === true)
        {
            return;
        }

        if(typeof(join) != "number" || join < 1 || join > 3)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs = _cur_slide_shapes_container.ArrGlyph;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill == null
            || _old_compiled_line.Fill.fill == null
        || _old_compiled_line.Fill.fill.type == FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;
            _new_line.Join = new LineJoin();
            _new_line.Join.type = join;
        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }

            _new_line.Join = new LineJoin();
            _new_line.Join.type = join;
        }
        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();



        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
    },

    putLineBeginStyle : function(style)
    {

        if(this.viewMode === true)
        {
            return;
        }

        if(typeof(style) != "number" || style < 0 || style > 5)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs = _cur_slide_shapes_container.ArrGlyph;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill == null || _old_compiled_line.Fill.fill == null || _old_compiled_line.Fill.fill.type === FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = style;
            _new_line.headEnd.w = LineEndSize.Mid;
            _new_line.headEnd.len = LineEndSize.Mid;


        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }


            if(_new_line.headEnd == null)
            {
                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.w = LineEndSize.Mid;
                _new_line.headEnd.len = LineEndSize.Mid;
            }
            _new_line.headEnd.type = style;
        }

        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();

        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
    },

    putLineEndStyle : function(style)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(typeof(style) != "number" || style < 0 || style > 5)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs = _cur_slide_shapes_container.ArrGlyph;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill === null
            || _old_compiled_line.Fill.fill == null
        || _old_compiled_line.Fill.fill.type == FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = style;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.tailEnd.len = LineEndSize.Mid;
        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }


            if(_new_line.tailEnd == null)
            {
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.w = LineEndSize.Mid;
                _new_line.tailEnd.len = LineEndSize.Mid;
            }
            _new_line.tailEnd.type = style;
        }


        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();

        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
    },

    putLineBeginSize : function(size)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(typeof(size) != "number" || size < 0 || size > 9)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs = _cur_slide_shapes_container.ArrGlyph;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill == null
            || _old_compiled_line.Fill.fill == null
        || _old_compiled_line.Fill.fill.type == FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.None;
            _new_line.headEnd.w = 2 - ((size/3) >> 0);
            _new_line.headEnd.len = 2 - (size % 3);


        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }


            if(_new_line.headEnd == null)
            {
                _new_line.headEnd = new EndArrow();
                _new_line.headEnd.type = LineEndType.None;
            }

            _new_line.headEnd.w = 2 - ((size/3) >> 0);
            _new_line.headEnd.len = 2 - (size % 3);

        }


        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();

        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
    },

    putLineEndSize : function(size)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(typeof(size) != "number" || size < 0 || size > 9)
        {
            return;
        }
        var _cur_slide_shapes_container = this.Slides[this.CurPage].elementsManipulator;
        var _glyphs = _cur_slide_shapes_container.ArrGlyph;
        var _shape_index;
        var _target_shape;
        var _old_line;
        var _new_line;
        var _history_obj;


        if(_cur_slide_shapes_container.State.id === 20)
        {
            while(_cur_slide_shapes_container.State.id === 20)
            {
                _cur_slide_shapes_container = _cur_slide_shapes_container.group;
            }
        }
        _glyphs = _cur_slide_shapes_container.ArrGlyph;

        if(_cur_slide_shapes_container.State.id === 0)
        {
            _cur_slide_shapes_container.selectedCount();
            if(_cur_slide_shapes_container.NumSelected == 1)
            {
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected && (_glyphs[_shape_index] instanceof CShape))
                    {
                        break;
                    }
                }
                if(_shape_index < _glyphs.length)
                {
                    _target_shape = _glyphs[_shape_index];
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
        }
        else
        {
            return;
        }

        History.Create_NewPoint();
        _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.targetShape =  _target_shape;
        var _old_compiled_line = _target_shape.pen;
        if(_old_compiled_line == null
            || _old_compiled_line.Fill == null
            || _old_compiled_line.Fill.fill == null
        || _old_compiled_line.Fill.fill.type == FILL_TYPE_NOFILL)
        {
            _old_line = _target_shape.spPr.ln;
            _new_line = new CLn();
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color  = new CSchemeColor();
            _new_line.Fill.fill.color.color.id = 15;
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.None;
            _new_line.tailEnd.w = parseInt("" + (size/3));
            _new_line.tailEnd.len = size % 3;

        }
        else
        {
            _old_line = _target_shape.spPr.ln;
            if(_old_line != null)
            {
                _new_line = _old_line.createDuplicate();

            }
            else
            {
                _new_line = new CLn();

            }


            if(_new_line.tailEnd == null)
            {
                _new_line.tailEnd = new EndArrow();
                _new_line.tailEnd.type = LineEndType.None;
            }

            _new_line.tailEnd.w = parseInt("" + (size/3));
            _new_line.tailEnd.len = size % 3;
        }

        _target_shape.spPr.ln = _new_line;
        _target_shape.calculateLine();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        this.DrawingDocument.OnEndRecalculate();

        _history_obj.oldLine = _old_line;
        _history_obj.newLine = _new_line;
        _history_obj.undo_function = function(data)
        {
            data.targetShape.spPr.ln = data.oldLine;
            data.targetShape.calculateLine();
        };
        _history_obj.redo_function = function(data)
        {
            data.targetShape.spPr.ln = data.newLine;
            data.targetShape.calculateLine();
        };
        History.Add(this, _history_obj);
        this.Document_UpdateUndoRedoState();
    },


    changeBackground : function(bg, arrInd)
    {
        if(this.viewMode === true)
        {
            return;
        }
        var _index;
        var _cur_slide;
        var _history_obj;
        var _old_bg;
        var _new_bg;
        History.Create_NewPoint();
        for(_index = 0; _index < arrInd.length; ++_index)
        {
            _cur_slide = this.Slides[arrInd[_index]];
            _old_bg = _cur_slide.cSld.Bg;
            if(bg != null)
            {
                _new_bg = bg.createFullCopy();
            }
            else
            {
                _new_bg = null;
            }
            _cur_slide.cSld.Bg = _new_bg;
            this.DrawingDocument.OnRecalculatePage(arrInd[_index], _cur_slide);

            _history_obj = {};
            _history_obj.Type = history_undo_redo_const;
            _history_obj.slide = _cur_slide;
            _history_obj.oldBg = _old_bg;
            _history_obj.newBg = _new_bg;
            _history_obj.undo_function = function(data)
            {
                data.slide.cSld.Bg = data.oldBg;
                this.DrawingDocument.OnRecalculatePage(data.slide.num, data.slide);
            };
            _history_obj.redo_function = function(data)
            {
                data.slide.cSld.Bg = data.newBg;
                this.DrawingDocument.OnRecalculatePage(data.slide.num, data.slide);
            };
            History.Add(this, _history_obj);
        }
        this.DrawingDocument.OnEndRecalculate();
        this.Document_UpdateUndoRedoState();
        this.Set_CurPage(this.CurPage);
    },

    Set_ImageProps : function(Props)
    {
        if(this.viewMode === true)
        {
            return;
        }
        if(this.Slides[this.CurPage].elementsManipulator.State.id == 0)
        {
            var ArrGlyph = this.Slides[this.CurPage].elementsManipulator.ArrGlyph;
            for(var i = 0; i< ArrGlyph.length; ++i)
            {
                if(ArrGlyph[i].selected && ArrGlyph[i] instanceof  CImage2)
                {
                    ArrGlyph[i].applyProps(Props);
                }
            }
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }

        this.Document_UpdateInterfaceState();
    },

    Set_TableProps : function(Props)
    {
        var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
        if(_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable)
        {
            _cur_object.graphicObject.Set_Props(Props, this.CurPos.Type !== docpostype_FlowObjects);
            //_cur_object.graphicObject.Recalculate();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
        this.Document_UpdateInterfaceState();
    },

    Get_Paragraph_ParaPr : function()
    {
        /*if ( docpostype_FlowObjects === this.CurPos.Type )
        {
            var _cur_shape = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_shape != null &&  _cur_shape.txBody && _cur_shape.txBody.content)
            {
                return _cur_shape.txBody.content.Get_Paragraph_ParaPr();
            }
            else
            {
                return _empty_para_pr;
            }
        }
        else
        {
            var _cur_slide = this.Slides[this.CurPage];
            var _elements = _cur_slide.elementsManipulator;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }
            if(_elements.State.id === 0)
            {
                var _shape_array = _elements.ArrGlyph;
                var _shape_index;
                var _b_text_pr = false;
                for(_shape_index = 0; _shape_index < _shape_array.length; ++_shape_index)
                {
                    if(_shape_array[_shape_index].selected && (_shape_array[_shape_index] instanceof CShape || _shape_array[_shape_index] instanceof GroupShape))
                    {
                        _b_text_pr = true;
                        break;
                    }
                }

                if(_b_text_pr === true)
                {
                    var _result_para_pr = null;
                    var _cur_para_pr;

                    var _cur_shape;
                    var _shape_count = 0;
                    for(_shape_index = 0; _shape_index < _shape_array.length; ++_shape_index)
                    {
                        if(_shape_array[_shape_index].selected && (_shape_array[_shape_index] instanceof CShape|| _shape_array[_shape_index] instanceof GroupShape))
                        {
                            ++_shape_count;
                            _cur_shape = _shape_array[_shape_index];
                            if(_cur_shape instanceof CShape)
                            {
                                if(_cur_shape.txBody != null)
                                {
                                    if(_cur_shape.txBody.content != null)
                                    {
                                        _cur_shape.txBody.content.Set_ApplyToAll(true);
                                        _cur_para_pr = _cur_shape.txBody.content.Get_Paragraph_ParaPr();
                                        _cur_shape.txBody.content.Set_ApplyToAll(false);
                                        if(_result_para_pr === null)
                                        {
                                            _result_para_pr = _cur_para_pr;
                                        }
                                        else
                                        {
                                            _result_para_pr = Styles_Compare_ParaPr( _result_para_pr, _cur_para_pr );
                                        }
                                    }
                                }
                            }
                            else
                            {
                                _cur_para_pr = _cur_shape.getParagraphParaPr();
                                if(_result_para_pr === null)
                                {
                                    _result_para_pr = _cur_para_pr;
                                }
                                else
                                {
                                    _result_para_pr = Styles_Compare_ParaPr( _result_para_pr, _cur_para_pr );
                                }
                            }
                        }
                    }

                    if(_result_para_pr != null)
                    {
                        return _result_para_pr;
                    }
                    else
                    {
                        return _empty_para_pr;
                    }
                }
                else
                {
                    return _empty_para_pr;
                }
            }
            else
            {
                return _empty_para_pr;
            }
        }       */

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


        var _cur_slide = this.Slides[this.CurPage];
        var _slide_elements = _cur_slide.elementsManipulator;
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = _slide_elements.obj;

            if(typeof _cur_object.Get_Paragraph_ParaPr === "function")
            {
                return  _cur_object.Get_Paragraph_ParaPr();
            }
        }
        else
        {
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
                var _paragraph_para_pr = null;
                var _cur_paragraph_para_pr;
                for(_object_index = 0; _object_index < _selected_objects_count; ++_object_index)
                {
                    var _current_object = _arr_selected_objects[_object_index];

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

                }
                return _paragraph_para_pr;
            }
        }
        return _empty_para_pr;
    },

    Get_Paragraph_TextPr : function()
    {

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
        var _slide_elements = _cur_slide.elementsManipulator;
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = _slide_elements.obj;

            if(typeof _cur_object.Get_Paragraph_TextPr === "function")
            {
                return  _cur_object.Get_Paragraph_TextPr();
            }
        }
        else
        {
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
                var _paragraph_text_pr = null;
                var _cur_paragraph_text_pr;
                for(_object_index = 0; _object_index < _selected_objects_count; ++_object_index)
                {
                    var _current_object = _arr_selected_objects[_object_index];

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
                return _paragraph_text_pr;
            }
        }
        return _empty_text_pr;

    },

    Get_Paragraph_TextPr_Copy : function()
    {

        if ( docpostype_FlowObjects == this.CurPos.Type && this.Slides[this.CurPage].elementsManipulator.obj && this.Slides[this.CurPage].elementsManipulator.obj.Get_Paragraph_TextPr_Copy)
        {
            return this.Slides[this.CurPage].elementsManipulator.obj.Get_Paragraph_TextPr_Copy();
        }
        return null;
    },

    Get_ParagraphIndent : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
        {
            return this.HdrFtr.Get_ParagraphIndent();
        }

        if ( this.CurPos.Type === docpostype_FlowObjects )
        {
            if ( "undefined" != typeof(this.Selection.Data.FlowObject.Get_ParagraphIndent) )
                return this.Selection.Data.FlowObject.Get_ParagraphIndent();
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
        if(this.viewMode === true)
        {
            return;
        }
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
        X_Right_Margin  = 254 - X_Right_Field;
        Y_Bottom_Margin = 191 - Y_Bottom_Field;
        Y_Top_Margin    = Y_Top_Field;

       //    this.HdrFtr.UpdateMargins( 0 );

        this.ContentLastChangePos = 0;
        this.Recalculate();

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateUndoRedoState();
    },

    Set_DocumentPageSize : function(W, H, bNoRecalc)
    {
        if(this.viewMode === true)
        {
            return;
        }
        this.History.Add( this, { Type : historyitem_Document_PageSize, Width_new : W, Height_new : H, Width_old : 254, Height_old : 191 } );



        X_Left_Field   = X_Left_Margin;
        X_Right_Field  = 254  - X_Right_Margin;
        Y_Bottom_Field = 191 - Y_Bottom_Margin;
        Y_Top_Field    = Y_Top_Margin;

        this.HdrFtr.UpdateMargins( 0, bNoRecalc );

		if( true != bNoRecalc )
		{
			this.ContentLastChangePos = 0;
			this.Recalculate();

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
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
        this.Set_DocumentPageSize( 191, 254, bNoRecalc );
    },


    changeSlideSize: function(width, height)
    {
        if(this.Width === width && this.Height === height)
        {
            return;
        }
        History.Create_NewPoint();
        var _history_obj = {};
        _history_obj.oldWidth = this.Width;
        _history_obj.oldHeight = this.Height;
        _history_obj.newWidth = width;
        _history_obj.newHeght = height;
        _history_obj.Type = history_undo_redo_const;
        _history_obj.undo_function = function(data)
        {
            this.changeSlideSize2(data.oldWidth, data.oldHeight);
        };
        _history_obj.redo_function = function(data)
        {
            this.changeSlideSize2(data.newWidth, data.oldHeight);
        };
        History.Add(this, _history_obj);
        this.changeSlideSize2(width, height);
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        return;







        var kW = width/this.Width;
        var kH = height/this.Height;

        this.Width = width;
        this.Height = height;

        this.changeSlidesProportions(kW, kH);
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);

        History.Create_NewPoint();
        var _history_obj = {};
        _history_obj.Type = history_undo_redo_const;
        _history_obj.new_kW = kW;
        _history_obj.new_kH = kH;
        _history_obj.undo_function = function(data)
        {
            this.Width /= data.new_kW;
            this.Height/= data.new_kH;
            this.changeSlidesProportions(1/data.new_kW, 1/data.new_kH);
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        };
        _history_obj.redo_function = function(data)
        {
            this.Width  *= data.new_kW;
            this.Height *= data.new_kH;
            this.changeSlidesProportions(data.new_kW, data.new_kH);
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        };
        History.Add(this, _history_obj);
    },

    changeSlideSize2: function(width, height)
    {
        var _slides = this.Slides;
        var _slides_count = _slides.length;
        var _slide_index;
        var _cur_slide;
        var _cur_master;
        this.Width = width;
        this.Height = height;
        for(_slide_index = 0; _slide_index < _slides_count; ++_slide_index )
        {
            _cur_slide = _slides[_slide_index];
            if(Math.abs(_cur_slide.Width - width) > 1 || Math.abs(_cur_slide.Height - height) > 1)
            {
                _cur_slide.setSize(width, height);
            }
            _cur_master = _cur_slide.Layout.Master;
            if(Math.abs(_cur_master.Width - width) > 1 || Math.abs(_cur_master.Height - height) > 1)
            {
                _cur_master.setSize(width, height);
            }
        }
    },

    changeSlidesProportions: function(kW, kH)
    {
        var _slides = this.Slides;
        var _slide_index;
        var _slides_count = _slides.length;

        var _resized_masters = [];
        var _resized_master_index;
        var _resized_master_count;
        var _cur_master;
        var _cur_slide;
        var _layouts;
        var _layout_index;
        var _layout_count;
        for(_slide_index = 0; _slide_index < _slides_count; ++_slide_index)
        {
            _cur_slide = _slides[_slide_index];
            _cur_slide.changeProportions(kW, kH);
            _cur_master = _cur_slide.Layout.Master;
            _cur_slide.Width *= kW;
            _cur_slide.Height *= kH;
            _cur_slide.recalculate();
            _resized_master_count = _resized_masters.length;
            for(_resized_master_index = 0; _resized_master_index < _resized_master_count; ++_resized_master_index)
            {
                if(_resized_masters[_resized_master_index] === _cur_master)
                {
                    break;
                }
            }
            if(_resized_master_index === _resized_master_count)
            {
                _cur_master.Width *= kW;
                _cur_master.Height *= kH;
                _cur_master.changeProportions(kW, kH);
                _cur_master.recalculate();
                _layouts = _cur_master.sldLayoutLst;
                _layout_count = _layouts.length;
                for(_layout_index = 0; _layout_index < _layout_count; ++_layout_index)
                {
                    _layouts[_layout_index].changeProportions(kW, kH);
                    _layouts[_layout_index].recalculate();
                }
                _resized_masters.push(_cur_master);
            }
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
      /*  var ImagePr = new Object();
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
            var FlowObject = this.Slides[this.CurPage].FlowObjects.Get_ByIndex( this.CurPos.ContentPos );
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
            editor.sync_ImgPropCallback( ImagePr );*/
    },

    // Обновляем данные в интерфейсе о свойствах таблицы
    Interface_Update_TablePr : function(Flag)
    {
        /*var TablePr = null;
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
        TablePr.CanBeFlow = true;

        if ( true === Flag )
            return TablePr;
        else if ( null != TablePr )
            editor.sync_TblPropCallback( TablePr );*/
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
        /*if ( "undefined" === typeof(PageNum) )
            PageNum = this.CurPage;

        var ContentPos = this.Slides[PageNum].Pos;
        var Item = this.Content[ContentPos];

        // Значит данный элемент занимает всю страницу
        if ( PageNum != Item.Pages.length - 1 + Item.PageNum )
            return ContentPos;

        // Данный элемент заканчивается на текущей странице
        for ( ContentPos = this.Slides[PageNum].Pos; ContentPos < this.Content.length - 1; ContentPos++ )
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
        }          */

        return this.CurPage;
    },

    // Убираем селект
    Selection_Remove : function()
    {
        if ( this.Selection.Flag == selectionflag_DrawingObject )
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

       /* if (this.CurPos.Type == docpostype_FlowObjectContent)
        {
            switch( this.Selection.Flag )
            {
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
        }*/
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

        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            this.Slides[this.CurPage].elementsManipulator.obj.textBody.content.Selection_Draw();
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
        var elements = this.Slides[this.CurPage].elementsManipulator;
        if(MouseEvent.Button === 2 && elements.obj && elements.obj instanceof CGraphicFrame)
            return;
        if ( docpostype_FlowObjects === this.CurPos.Type && elements.obj && elements.obj.selectionSetStart)
        {
            this.Selection.Start = true;
            this.Selection.Use   = true;
            elements.obj.selectionSetStart( X, Y, 0, MouseEvent, false );

            if(MouseEvent.ClickCount <=1)
            {
                this.Document_UpdateSelectionState();
            }
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },


    Selection_SetEnd : function(X, Y, MouseEvent) {

        var elements = this.Slides[this.CurPage].elementsManipulator;
        if(MouseEvent.Button === 2 && elements.obj && elements.obj instanceof CGraphicFrame)
            return;
        if (docpostype_FlowObjects === this.CurPos.Type && elements.obj && elements.obj.selectionSetEnd)
        {
            if( g_mouse_event_type_up == MouseEvent.Type && typeof elements.obj.Selection_Stop === "function")
            {
                elements.obj.Selection_Stop(X, Y, this.CurPage, MouseEvent);
            }
            elements.obj.selectionSetEnd(  X, Y, 0, MouseEvent );
            this.Document_UpdateSelectionState();
        }
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
        var elements = this.Slides[this.CurPage].elementsManipulator;
        if ( docpostype_FlowObjects === this.CurPos.Type && elements.obj && elements.obj.Select_All) {

            elements.obj.Select_All();
            this.Document_UpdateInterfaceState();
            return;
        }
        if( this.Slides[this.CurPage].elementsManipulator.State.id == 0) {

            elements.selectAll();
            /*this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.DrawingDocument.OnEndRecalculate(false, true);                */
            this.Document_UpdateInterfaceState();
        }


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

    Update_CursorType : function( X, Y, PageIndex )
    {
        // Ничего не делаем
        if ( true === this.DrawingDocument.IsCursorInTableCur( X, Y, PageIndex ) )
        {
            this.DrawingDocument.SetCursorType( "default" );
            return;
        }
    },

    // Проверяем попадем ли мы в границу таблицы
    Is_TableBorder : function( X, Y, PageIndex )
    {
        return false;
    },

    OnKeyDown : function(e)
    {
        var bRetValue = false;

        if ( e.KeyCode == 16)
        {
            this.Slides[this.CurPage].elementsManipulator.ShiftPress();
           // bRetValue = true;
        }
        if ( e.KeyCode == 17)
        {
            this.Slides[this.CurPage].elementsManipulator.CtrlPress();
           // bRetValue = true;
        }
        if ( e.KeyCode == 8 && false === editor.isViewMode && this.viewMode === false ) // BackSpace
        {
            this.History.Create_NewPoint();
            this.Remove( -1, true );
            bRetValue = true;
        }
        else if ( e.KeyCode == 9 && false === editor.isViewMode && this.viewMode === false ) // Tab
        {
            if(this.CurPos.Type == docpostype_FlowObjects)
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTab() );
                bRetValue = true;
            }
            else
            {
                var _shapes = this.Slides[this.CurPage].elementsManipulator.ArrGlyph;
                if(_shapes.length > 0)
                {
                    var _shape_index;
                    var _selected_index;
                    if(e.ShiftKey)
                    {
                        for(_shape_index = 0; _shape_index < _shapes.length ; ++_shape_index)
                        {
                            if(_shapes[_shape_index].selected)
                            {
                                break;
                            }
                        }

                        if(_shape_index === 0 || _shape_index === _shapes.length)
                        {
                            _selected_index = _shapes.length - 1;
                        }
                        else
                        {
                            _selected_index = _shape_index - 1;
                        }
                    }
                    else
                    {
                        for(_shape_index = _shapes.length - 1 ; _shape_index > -1; --_shape_index)
                        {
                            if(_shapes[_shape_index].selected)
                            {
                                break;
                            }
                        }

                        if(_shape_index === _shapes.length - 1 || _shape_index === -1)
                        {
                            _selected_index = 0;
                        }
                        else
                        {
                            _selected_index = _shape_index + 1;
                        }
                    }

                    for(_shape_index = 0; _shape_index < _shapes.length ; ++_shape_index)
                    {
                        _shapes[_shape_index].selected = false;
                    }
                    _shapes[_selected_index].selected = true;
                    this.Slides[this.CurPage].elementsManipulator.selectedCount();
                    this.Slides[this.CurPage].elementsManipulator.updateSelectionMap();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateUndoRedoState();
                    this.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 13 && false === editor.isViewMode && this.viewMode === false ) // Enter
        {
            this.History.Create_NewPoint();
            if ( e.ShiftKey )
            {
                this.Paragraph_Add( new ParaNewLine( break_Line ) );
            }
            else if ( e.CtrlKey )
            {
                editor.WordControl.GoToPage(this.CurPage);
                this.addNextSlide();
            }
            else
            {
                this.Add_NewParagraph();
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 32 && false === editor.isViewMode && this.viewMode === false ) // Space
        {
            this.History.Create_NewPoint();
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

            bRetValue = true;
        }
        else if ( e.KeyCode == 33 ) // PgUp
        {
            if ( true === e.AltKey )
            {
                // bRetValue = false;
            }
            else
            {
                if(this.CurPage  > 0)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage - 1);
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 34 ) // PgDn
        {
            if ( true === e.AltKey )
            {
               // bRetValue = false;
            }
            else
            {
                if(this.CurPage + 1 < this.Slides.length)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 35 ) // клавиша End
        {
           /* if ( true === e.CtrlKey ) // Ctrl + End - переход в конец документа
            {
                this.Cursor_MoveToEndPos();
            }
            else // Переходим в конец строки
            {
                this.Cursor_MoveEndOfLine( true === e.ShiftKey );
            }

            bRetValue = true;    */
            var _autoshapes = this.Slides[this.CurPage].elementsManipulator;

            if(_autoshapes.State.id === 0)
            {
                _autoshapes.selectedCount();
                if(_autoshapes.NumSelected === 0)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length - 1);
                    bRetValue = true;
                }
            }
            else if(this.CurPos.Type = docpostype_FlowObjects)
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
        }
        else if ( e.KeyCode == 36 ) // клавиша Home
        {
           /* if ( true === e.CtrlKey ) // Ctrl + Home - переход в начало документа
            {
                this.Cursor_MoveToStartPos();
            }
            else // Переходим в начало строки
            {
                this.Cursor_MoveStartOfLine( true === e.ShiftKey );
            }

            bRetValue = true;*/
            var _autoshapes = this.Slides[this.CurPage].elementsManipulator;

            if(_autoshapes.State.id === 0)
            {
                _autoshapes.selectedCount();
                if(_autoshapes.NumSelected === 0)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(0);
                    bRetValue = true;
                }
            }
            else if(this.CurPos.Type = docpostype_FlowObjects)
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
        }
        else if ( e.KeyCode == 37 ) // Left Arrow
        {
            switch(this.CurPos.Type)
            {
                case docpostype_FlowObjects:
                {
                    if(true !== e.ShiftKey)
                        this.DrawingDocument.TargetStart();
                    this.Cursor_MoveLeft( true === e.ShiftKey);
                    bRetValue = true;
                    break;
                }
                case docpostype_Content :
                {
                    if(e.CtrlKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeLeft();
                        bRetValue = false;
                    }
                    else if(!e.ShiftKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeLeft(this.DrawingDocument.GetMMPerDot(5));
                        bRetValue = false;
                    }
                    break;
                }
            }

        }
        else if ( e.KeyCode == 38 ) // Top Arrow
        {
            switch(this.CurPos.Type)
            {
                case docpostype_FlowObjects:
                {
                    if(true !== e.ShiftKey)
                        this.DrawingDocument.TargetStart();
                    //this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
                    this.Cursor_MoveUp( true === e.ShiftKey );
                    bRetValue = true;
                    break;
                }
                case docpostype_Content :
                {
                    if(e.CtrlKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeTop();
                        bRetValue = false;
                    }
                    else if(!e.ShiftKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeTop(this.DrawingDocument.GetMMPerDot(5));
                        bRetValue = false;
                    }
                    break;
                }
            }
        }
        else if ( e.KeyCode == 39 ) // Right Arrow
        {
            switch(this.CurPos.Type)
            {
                case docpostype_FlowObjects:
                {
                    if(true !== e.ShiftKey)
                        this.DrawingDocument.TargetStart();
                    //this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
                    this.Cursor_MoveRight( true === e.ShiftKey );
                    bRetValue = true;
                    break;
                }
                case docpostype_Content :
                {
                    if(e.CtrlKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeRight();
                        bRetValue = false;
                    }
                    else if(!e.ShiftKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeRight(this.DrawingDocument.GetMMPerDot(5));
                        bRetValue = false;
                    }
                    break;
                }
            }
        }
        else if ( e.KeyCode == 40 ) // Bottom Arrow
        {
            switch(this.CurPos.Type)
            {
                case docpostype_FlowObjects:
                {
                    if(true !== e.ShiftKey)
                        this.DrawingDocument.TargetStart();
                    //this.DrawingDocument.TargetShow(); // Чтобы при зажатой клавише курсор не пропадал
                    this.Cursor_MoveDown( true === e.ShiftKey );
                    bRetValue = true;
                    break;
                }
                case docpostype_Content :
                {
                    if(e.CtrlKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeBottom();
                        bRetValue = false;
                    }
                    else if(!e.ShiftKey)
                    {
                        this.Slides[this.CurPage].elementsManipulator.moveShapeBottom(this.DrawingDocument.GetMMPerDot(5));
                        bRetValue = false;
                    }
                    break;
                }
            }
        }
        else if ( e.KeyCode == 45 ) // Insert
        {
            if ( true === e.CtrlKey ) // Ctrl + Insert (аналогично Ctrl + C)
            {
                if ( true === e.ShiftKey ) // Ctrl + Shift + C - копирование форматирования текста
                {
                    this.Document_Format_Copy();
                    bRetValue = true;
                }
                else // Ctrl + C - copy
                {
                    if(this.CurPos.Type == docpostype_FlowObjects)
                    {
                        this.glyphsBuffer.length = [];
                        this.slidesBuffer.length = [];
                        Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                        //не возвращаем true чтобы не было preventDefault
                    }
                    else
                    {
                        this.slidesBuffer.length = [];
                        this.glyphsBuffer = this.Slides[this.CurPage].elementsManipulator.glyphsCopy();
                        bRetValue = true;
                    }
                }

            }
            else if ( true === e.ShiftKey  && this.viewMode === false ) // Shift + Insert (аналогично Ctrl + V)
            {
                if(/*this.glyphsBuffer.length == 0 && this.slidesBuffer.length == 0*/this.CurPos.Type === docpostype_FlowObjects)
                {
                    this.History.Create_NewPoint();
                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                    //не возвращаем true чтобы не было preventDefault
                }
                else if(this.slidesBuffer.length == 0 && this.glyphsBuffer.length != 0)
                {
                    this.Slides[this.CurPage].elementsManipulator.glyphsPaste();
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 46 && false === editor.isViewMode && this.viewMode === false ) // Delete
        {
            if ( true != e.ShiftKey )
            {
               //
                var elements = this.Slides[this.CurPage].elementsManipulator;
                if(docpostype_FlowObjects==this.CurPos.Type)
                {
                    this.History.Create_NewPoint();
                    this.Remove( 1, true );
                    bRetValue = true;
                }
                else if(elements.State.id==0 || elements.State.id==20)
                {
                    elements.Del();
                    this.Document_UpdateUndoRedoState();
                    this.Document_UpdateInterfaceState();
                }
            }
            else // Shift + Delete (аналогично Ctrl + X)
            {
                if(this.CurPos.Type == docpostype_FlowObjects)
                {
                    this.History.Create_NewPoint();
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                    this.glyphsBuffer.length = [];
                    this.slidesBuffer.length = [];
                    //не возвращаем true чтобы не было preventDefault
                }
                else
                {
                    this.glyphsBuffer = this.Slides[this.CurPage].elementsManipulator.Del();
                    if(this.glyphsBuffer.length > 0)
                    {
                        this.slidesBuffer.length = [];
                    }
                    bRetValue = true;

                    this.Document_UpdateUndoRedoState();
                    this.Document_UpdateInterfaceState();
                }
            }
        }
       /* else if ( e.KeyCode == 49 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num1 - применяем стиль Heading1
        {
            this.History.Create_NewPoint();
            this.Set_ParagraphStyle( "Heading 1" );
            this.Document_UpdateInterfaceState();
            bRetValue = true;
        }
        else if ( e.KeyCode == 50 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num2 - применяем стиль Heading2
        {
            this.History.Create_NewPoint();
            this.Set_ParagraphStyle( "Heading 2" );
            this.Document_UpdateInterfaceState();
            bRetValue = true;
        }
        else if ( e.KeyCode == 51 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey ) // Alt + Ctrl + Num3 - применяем стиль Heading3
        {
            this.History.Create_NewPoint();
            this.Set_ParagraphStyle( "Heading 3" );
            this.Document_UpdateInterfaceState();
            bRetValue = true;
        }    */
        else if ( e.KeyCode == 56 && true === e.CtrlKey && true === e.ShiftKey ) // Ctrl + Shift + 8 - showParaMarks
        {
            editor.ShowParaMarks = !editor.ShowParaMarks;
           /* var _arr_glyph = this.Slides[this.CurPage].elementsManipulator.ArrGlyph;
            for(var _index = 0; _index < _arr_glyph.length; ++_index)
            {
                if(_arr_glyph[_index].Recalculate)
                {
                    _arr_glyph[_index].Recalculate();
                }
            }    */
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
        else if ( e.KeyCode == 65 && true === e.CtrlKey ) // Ctrl + A - выделяем все
        {
            this.Select_All();
            bRetValue = true;
        }
        else if ( e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false  ) // Ctrl + B - делаем текст жирным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTextPr( { Bold : TextPr.Bold === true ? false : true } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
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
                if(this.CurPos.Type == docpostype_FlowObjects)
                {
                    this.glyphsBuffer.length = [];
                    this.slidesBuffer.length = [];
                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                    //не возвращаем true чтобы не было preventDefault
                }
                else
                {
                    this.slidesBuffer.length = [];
                    this.glyphsBuffer = this.Slides[this.CurPage].elementsManipulator.glyphsCopy();
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 68 && true === e.CtrlKey && this.viewMode === false) // Ctrl + D + ...
        {
            if(this.CurPos.Type == docpostype_Content)
            {
                this.glyphsBuffer = this.Slides[this.CurPage].elementsManipulator.glyphsCopy();
                if(this.glyphsBuffer.length > 0)
                {
                    this.Slides[this.CurPage].elementsManipulator.lastPastePosX = this.glyphsBuffer[0].pH+4.2 + 0.1/3;
                    this.Slides[this.CurPage].elementsManipulator.lastPastePosY = this.glyphsBuffer[0].pV+4.2 + 0.1/3;
                }

                this.Slides[this.CurPage].elementsManipulator.glyphsPaste(true);
                this.glyphsBuffer.length = [];
            }
            bRetValue = true;
        }
        else if ( e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + E - переключение прилегания параграфа между center и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                this.History.Create_NewPoint();
                this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + E - переключение прилегания параграфа между center и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                this.History.Create_NewPoint();
                this.Set_ParagraphAlign( ParaPr.Jc === align_Center ? align_Left : align_Center );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 71 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + I - делаем текст наклонным
        {
            if(e.CtrlKey && !e.ShiftKey)
            {
                this.groupShapes();
                bRetValue = true;
            }
            else if(e.ShiftKey)
            {
                this.unGroupShapes();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 71 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + G - группировка, Ctrl + Shift + G - группировка
        {
            if(e.CtrlKey && !e.ShiftKey)
            {
                this.groupShapes();
                bRetValue = true;
            }
            else if(e.ShiftKey)
            {
                this.unGroupShapes();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + I - делаем текст наклонным
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTextPr( { Italic : TextPr.Italic === true ? false : true } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 74 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + J переключение прилегания параграфа между justify и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                this.History.Create_NewPoint();
                this.Set_ParagraphAlign( ParaPr.Jc === align_Justify ? align_Left : align_Justify );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey ) // Ctrl + K - добавление гиперссылки
        {
            if ( true === this.Hyperlink_CanAdd() )
                editor.sync_DialogAddHyperlink();

            bRetValue = true;
        }
        else if ( e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + L + ...
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + L - добавляем список к данному параграфу
            {
                this.History.Create_NewPoint();
                this.Set_ParagraphNumbering( { Type : 0, SubType : 1 } );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
            else // Ctrl + L - переключение прилегания параграфа между left и justify
            {
                var ParaPr = this.Get_Paragraph_ParaPr();
                if ( null != ParaPr )
                {
                    this.History.Create_NewPoint();
                    this.Set_ParagraphAlign( ParaPr.Jc === align_Left ? align_Justify : align_Left );
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateUndoRedoState();
                    bRetValue = true;
                }
            }
        }
        else if ( e.KeyCode == 77 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + M + ...
        {
            /*if ( true === e.ShiftKey ) // Ctrl + Shift + M - уменьшаем левый отступ
                editor.DecreaseIndent();
            else // Ctrl + M - увеличиваем левый отступ
                editor.IncreaseIndent();    */
            var _selected_thumbnails = this.DrawingDocument.m_oWordControl.Thumbnails.GetSelectedArray();
            if(_selected_thumbnails.length > 0)
            {
                var _last_selected_slide_num = _selected_thumbnails[_selected_thumbnails.length - 1];
                this.DrawingDocument.m_oWordControl.GoToPage(_last_selected_slide_num);
                this.addNextSlide();
            }
        }
        else if ( e.KeyCode == 80 && true === e.CtrlKey ) // Ctrl + P + ...
        {
            if ( true === e.ShiftKey && false === editor.isViewMode ) // Ctrl + Shift + P - добавляем номер страницы в текущую позицию
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaPageNum() );
                bRetValue = true;
            }
            else // Ctrl + P - print
            {
                this.DrawingDocument.m_oWordControl.m_oApi.asc_Print();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 82 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + R - переключение прилегания параграфа между right и left
        {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if ( null != ParaPr )
            {
                this.History.Create_NewPoint();
                this.Set_ParagraphAlign( ParaPr.Jc === align_Right ? align_Left : align_Right );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + S - save
        {
            this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
            bRetValue = true;
        }
        else if ( e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + U - делаем текст подчеркнутым
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTextPr( { Underline : TextPr.Underline === true ? false : true } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // s - paste
        {
            if ( true === e.ShiftKey ) // Ctrl + Shift + V - вставляем по образцу
            {
                this.History.Create_NewPoint();

                this.Document_Format_Paste();
                bRetValue = true;
            }
            else // Ctrl + V - paste
            {
                if(/*this.glyphsBuffer.length == 0 && this.slidesBuffer.length == 0*/this.CurPos.Type === docpostype_FlowObjects)
                {
                    this.History.Create_NewPoint();
                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                    //не возвращаем true чтобы не было preventDefault
                }
                else if(this.slidesBuffer.length == 0 && this.glyphsBuffer.length != 0)
                {
                    this.Slides[this.CurPage].elementsManipulator.glyphsPaste();
                    bRetValue = true;

                }
            }
        }
		else if ( e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + X - cut
        {
            if(this.CurPos.Type == docpostype_FlowObjects)
            {
                this.History.Create_NewPoint();
                Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                this.glyphsBuffer.length = [];
                this.slidesBuffer.length = [];
                //не возвращаем true чтобы не было preventDefault
            }
            else
            {
                this.glyphsBuffer = this.Slides[this.CurPage].elementsManipulator.Del();
                if(this.glyphsBuffer.length > 0)
                {
                    this.slidesBuffer.length = [];
                }

                this.Document_UpdateUndoRedoState();
                this.Document_UpdateInterfaceState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 89 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + Y - Redo
        {
            this.Document_Redo();
            bRetValue = true;
        }
        else if ( e.KeyCode == 90 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + Z - Undo
        {
            this.Document_Undo();
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
        else if ( e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + Shift + +, Ctrl + = - superscript/subscript
        {
            var TextPr = this.Get_Paragraph_TextPr();
            if ( null != TextPr )
            {
                this.History.Create_NewPoint();
                if ( true === e.ShiftKey )
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript } ) );
                else
                    this.Paragraph_Add( new ParaTextPr( { VertAlign : TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 188 && e.CtrlKey && false === editor.isViewMode && this.viewMode === false ) // .
        {
            if ( this.CurPos.Type == docpostype_FlowObjects )
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTextPr( { VertAlign : 1 } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 189 && false === editor.isViewMode && this.viewMode === false ) // Клавиша Num-
        {
            this.History.Create_NewPoint();

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
            bRetValue = true;
        }

        else if ( e.KeyCode == 190 && e.CtrlKey && false === editor.isViewMode && this.viewMode === false ) // .
        {
            if ( this.CurPos.Type == docpostype_FlowObjects )
            {
                this.History.Create_NewPoint();
                this.Paragraph_Add( new ParaTextPr( { VertAlign : 2 } ) );
                this.Document_UpdateInterfaceState();
                this.Document_UpdateUndoRedoState();
                bRetValue = true;
            }
        }
        else if ( e.KeyCode == 219 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + [
        {
            editor.FontSizeOut();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }
        else if ( e.KeyCode == 221 && false === editor.isViewMode && true === e.CtrlKey && this.viewMode === false ) // Ctrl + ]
        {
            editor.FontSizeIn();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();

        return bRetValue;
    },

    OnKeyPress : function(e)
    {
        if ( true === editor.isViewMode ||  this.viewMode === true )
            return false;


        if(this.CurPos.Type !== docpostype_FlowObjects)
        {
            var elM = this.Slides[this.CurPage].elementsManipulator;
            if(elM.State.id == 0)
            {
                var glyphs = elM.ArrGlyph;
                if(elM.NumSelected == 1)
                {
                    for(var i = 0; i < glyphs.length; ++i)
                    {
                        if(glyphs[i].selected &&  glyphs[i] instanceof  CShape)
                        {
                            elM.obj = glyphs[i];
                            elM.NumEditShape = i;
                            elM.obj.text_flag = true;
                            elM.ChangeState(new AddTextState());
                            this.CurPos.Type = docpostype_FlowObjects;
                            this.Document_UpdateInterfaceState();
                            this.Document_UpdateUndoRedoState();
                            break;
                        }
                    }
                }
                else
                {
                    elM.NumSelected=0;
                    for(i=0; i < glyphs.length; ++i)
                    {
                        glyphs[i].selected = false;
                    }
                }
            }
            if(elM.State.id == 20)
            {
                var curElM = elM;
                while(true)
                {
                    if(curElM.State.id == 20)
                    {
                        curElM = curElM.group;
                    }
                    else
                    {
                        break;
                    }
                }
                if(curElM.NumSelected == 1)
                {
                    for(var i = 0; i < curElM.ArrGlyph.length; ++i)
                    {
                        if(curElM.ArrGlyph[i].selected &&  curElM.ArrGlyph[i] instanceof  CShape)
                        {
                            elM.obj = curElM.ArrGlyph[i];
                            elM.obj.text_flag = true;
                            curElM.ChangeState(new AddTextState());
                            this.CurPos.Type = docpostype_FlowObjects;
                            this.Document_UpdateInterfaceState();
                            this.Document_UpdateUndoRedoState();
                            break;
                        }
                    }
                }

            }
        }

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
            if(docpostype_FlowObjects == this.CurPos.Type)
            {
                 this.History.Create_NewPoint();

                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();
                this.Paragraph_Add( new ParaText( String.fromCharCode( Code ) ) );
                bRetValue = true;
            }

        }

        if ( true == bRetValue )
            this.Document_UpdateSelectionState();
        return bRetValue;
    },



    ShiftUp: function()
    {
        this.Slides[this.CurPage].elementsManipulator.ShiftUp();
    },

    CtrlUp: function()
    {
        this.Slides[this.CurPage].elementsManipulator.CtrlUp();
    },

    OnMouseDown : function(e, X, Y, PageIndex)
    {

        if ( PageIndex < 0 )
            return;

        this.CurPage = PageIndex;
        if(e.Button === 0)
        {
            this.Slides[PageIndex].OnMouseDown(e, X, Y, PageIndex);
            this.Selection_SetStart( X, Y, e );
        }
        else if(e.Button === 2 && this.viewMode === false )
        {
            this.Slides[PageIndex].elementsManipulator.OnMouseDown2(e, X, Y, PageIndex);
            this.Selection_SetStart( X, Y, e );
            return;
        }

        //this.Document_UpdateSelectionState();
    },

    OnMouseUp : function(e, X, Y, PageIndex)
    {
        this.CurPage = PageIndex;
        var elements = this.Slides[PageIndex].elementsManipulator;



        if ( PageIndex < 0 )
            return;

        if(e.Button === 0)
        {
            elements.OnMouseUp(e, X, Y, PageIndex);
        }
        else if(e.Button === 2 && this.viewMode === false )
        {
            elements.OnMouseUp2(e, X, Y, PageIndex);
        }

        if(this.CurPos.Type == docpostype_FlowObjects)
        {
            if ( true === this.Selection.Start )
            {
                this.CurPage = PageIndex;
                this.Selection.Start = false;
                this.Selection_SetEnd( X, Y, e );
                var _elements = this.Slides[this.CurPage].elementsManipulator;
                if(_elements.obj instanceof CGraphicFrame && _elements.obj.graphicObject instanceof CTable)
                {
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
                this.Document_UpdateSelectionState();

                if ( true === editor.isPaintFormat )
                {
                    if ( false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
                    {
                        this.Create_NewHistoryPoint();
                        this.Document_Format_Paste();
                    }
                    editor.sync_PaintFormatCallback( false );
                }
            }
        }
        else if(this.viewMode === false )
        {


        }
    },

    OnMouseMove : function(e, X, Y, PageIndex)
    {
        this.CurPage = PageIndex;
        var elements = this.Slides[PageIndex].elementsManipulator;
        elements.OnMouseMove(e, X, Y, PageIndex);

        if ( PageIndex < 0 )
            return;

        if( this.CurPos.Type == docpostype_FlowObjects)
        {
        /*    if ( false === this.Selection.Start )
                this.Update_CursorType( X, Y , PageIndex);   */

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

        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },

    // Получем ближающую возможную позицию курсора
    Get_NearestPos : function(PageNum, X, Y)
    {

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

            }

            this.Content[Position + Index].PreDelete();
        }

        this.History.Add( this, { Type : historyitem_Document_RemoveItem, Pos : Position, Items : this.Content.slice( Position, Position + Count ) } );
        this.Content.splice( Position, Count );

        if ( null != PrevObj )
            PrevObj.Set_DocumentNext( NextObj );

        if ( null != NextObj )
            NextObj.Set_DocumentPrev( PrevObj );

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
        this.HdrFtr.Set_Distance( Value, 191 );
        this.Interface_Update_HdrFtrPr();
    },

    Document_SetHdrFtrBounds : function(Y0, Y1)
    {
        this.HdrFtr.Set_Bounds( Y0, Y1 );
        this.Interface_Update_HdrFtrPr();
    },

    Document_Format_Copy : function()
    {
        this.CopyTextPr = this.Get_Paragraph_TextPr_Copy();
    },

    Document_Format_Paste : function()
    {
        if ( null != this.CopyTextPr )
        {
            this.Paragraph_Add( new ParaTextPr( this.CopyTextPr ) );
            this.Document_UpdateInterfaceState();
            this.Document_UpdateUndoRedoState();
        }
    },

    Is_TableCellContent : function()
    {
        return false;
    },

    Is_TopDocument : function()
    {
        return true;
    },

    // Получаем текущий параграф
    Get_CurrentParagraph : function()
    {
        if ( this.CurPos.Type == docpostype_FlowObjects )
        {
            /*switch ( this.Selection.Data.FlowObject.Get_Type() )
            {
                case flowobject_Image:
                    return null;
                case flowobject_Table:
                    return this.Selection.Data.FlowObject.Get_CurrentParagraph();
            }    */

            return null;
        }



        return null;
    },
//-----------------------------------------------------------------------------------
// Функции для работы с поиском
//-----------------------------------------------------------------------------------
    Search_Start : function(Str)
    {
        if ( "string" != typeof(Str) || Str.length <= 0 )
            return;

        var i;
        var searchObj = null;
        var bFlag;
        for(i = this.CurPage;  i < this.Slides.length; ++i)
        {
            searchObj = this.Slides[i].elementsManipulator.startSearchText(Str);//должен вернуть {numShape : , numInSearch :} или null если ничего не нашлось
            if(searchObj != null)
            {
                if(this.searchInfo && this.searchInfo.str)
                {
                    if(i == this.searchInfo.startSlideNum
                        && searchObj.numShape == this.searchInfo.curSearchShapeNum
                        && searchObj.curNumInSearch == this.searchInfo.curNumInSearch)
                    {
                        editor.sync_SearchEndCallback();
                        delete this.searchInfo;
                        return null;
                    }
                    this.searchInfo.curSearchSlideNum = i;
                    this.searchInfo.curSearchShapeNum = searchObj.numShape;
                    this.searchInfo.curNumInSearch = searchObj.numInSearch;
                }
                else
                {
                    this.searchInfo =
                    {
                        str : Str,
                        startSlideNum : i,
                        startShapeNum : searchObj.numShape,
                        startNumInSearch : searchObj.numInSearch,

                        curSearchSlideNum : i,
                        curSearchShapeNum : searchObj.numShape,
                        curNumInSearch : searchObj.numInSearch
                    };
                }

                this.DrawingDocument.m_oWordControl.GoToPage(i);
                this.Slides[i].elementsManipulator.setSelectionState(searchObj.selectionState);
                return this.searchInfo;
                break;
            }
        }
        if(searchObj == null)
        {
            for(i = 0;  i < this.CurPage; ++i)
            {
                searchObj = this.Slides[i].elementsManipulator.startSearchText(Str);//должен вернуть {numShape : , numInSearch :} или null если ничего не нашлось
                if(searchObj != null)
                {
                    if(this.searchInfo && this.searchInfo.str)
                    {
                        if(i == this.searchInfo.startSlideNum
                            && searchObj.numShape == this.searchInfo.curSearchShapeNum
                            && searchObj.curNumInSearch == this.searchInfo.curNumInSearch)
                        {
                            editor.sync_SearchEndCallback();
                            delete this.searchInfo;
                            return null;
                        }
                        this.searchInfo.curSearchSlideNum = i;
                        this.searchInfo.curSearchShapeNum = searchObj.numShape;
                        this.searchInfo.curNumInSearch = searchObj.numInSearch;
                    }
                    else
                    {
                        this.searchInfo =
                        {
                            str : Str,
                            startSlideNum : i,
                            startShapeNum : searchObj.numShape,
                            startNumInSearch : searchObj.numInSearch,

                            curSearchSlideNum : i,
                            curSearchShapeNum : searchObj.numShape,
                            curNumInSearch : searchObj.numInSearch
                        };
                    }

                    this.DrawingDocument.m_oWordControl.GoToPage(i);
                    this.Slides[i].elementsManipulator.setSelectionState(searchObj.selectionState);
                    return this.searchInfo;
                    break;
                }
            }
        }

        if(this.searchInfo == null)
        {
            editor.sync_SearchEndCallback();
        }
    },


    goToNextSearchResult : function()
    {
        if(this.searchInfo && this.searchInfo.str)
        {
            if(this.Search_Start(this.searchInfo.str) == null)
                delete this.searchInfo;
        }
    },

    findText: function(text, scanForward)
    {
        if(typeof(text) != "string")
        {
            return;
        }
        if(scanForward === undefined)
        {
            scanForward = true;
        }

        var slide_num;
        var search_select_data = null;
        if(scanForward)
        {
            for(slide_num = this.CurPage; slide_num < this.Slides.length; ++slide_num)
            {
                search_select_data = this.Slides[slide_num].elementsManipulator.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].elementsManipulator.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for(slide_num = 0; slide_num < this.CurPage; ++slide_num)
            {
                search_select_data = this.Slides[slide_num].elementsManipulator.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].elementsManipulator.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        }
        else
        {
            for(slide_num = this.CurPage; slide_num > -1; --slide_num)
            {
                search_select_data = this.Slides[slide_num].elementsManipulator.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].elementsManipulator.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for(slide_num = this.Slides.length - 1; slide_num > this.CurPage; --slide_num)
            {
                search_select_data = this.Slides[slide_num].elementsManipulator.startSearchText(text, scanForward);
                if(search_select_data != null)
                {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].elementsManipulator.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        }
        return false;
    },

    Search_OnPage : function()
    {
    },

    Search_Stop : function(bChange)
    {

    },
//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
    Table_AddRow : function(bBefore)
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                _cur_object.graphicObject.Row_Add(bBefore);
                _cur_object.graphicObject.Recalculate();
                _cur_object.RecalculateSize();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        else
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape_index;
                var _shape_count = _shapes.length;
                var _selected_count = 0;
                var _target_table = null;
                for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected)
                    {
                        ++_selected_count;
                        if(_selected_count > 1)
                        {
                            return;
                        }
                        if(_shapes[_shape_index] instanceof  CGraphicFrame && _shapes[_shape_index].graphicObject instanceof  CTable)
                        {
                            _target_table = _shapes[_shape_index].graphicObject;
                            _elements.obj = _shapes[_shape_index];
                            _elements.NumEditShape = _shape_index;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(_target_table !== null)
                {
                    this.CurPos.Type = docpostype_FlowObjects;
                    if(_elements && _elements.obj &&  _elements.obj.TransformMatrix)
                        this.DrawingDocument.UpdateTargetTransform(_elements.obj.TransformMatrix);
                    _elements.State = new AddTextState();
                    _target_table.Row_Add(bBefore);
                    _target_table.Recalculate();
                    _target_table.Parent.RecalculateSize();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
    },

    Table_AddCol : function(bBefore)
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                _cur_object.graphicObject.Col_Add(bBefore);
                _cur_object.graphicObject.Recalculate();
                _cur_object.RecalculateSize();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        else
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape_index;
                var _shape_count = _shapes.length;
                var _selected_count = 0;
                var _target_table = null;
                for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected)
                    {
                        ++_selected_count;
                        if(_selected_count > 1)
                        {
                            return;
                        }
                        if(_shapes[_shape_index] instanceof  CGraphicFrame && _shapes[_shape_index].graphicObject instanceof  CTable)
                        {
                            _target_table = _shapes[_shape_index].graphicObject;
                            _elements.obj = _shapes[_shape_index];
                            _elements.NumEditShape = _shape_index;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(_target_table !== null)
                {
                    this.CurPos.Type = docpostype_FlowObjects;
                    if(_elements && _elements.obj &&  _elements.obj.TransformMatrix)
                        this.DrawingDocument.UpdateTargetTransform(_elements.obj.TransformMatrix);
                    _elements.State = new AddTextState();
                    _target_table.Col_Add(bBefore);
                    _target_table.Recalculate();
                    _target_table.Parent.RecalculateSize();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
    },

    Table_RemoveRow : function()
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                if(_cur_object.graphicObject.Row_Remove() === false)
                {
                    this.Table_RemoveTable(true);
                }
                else
                {
                    _cur_object.RecalculateSize();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
    },

    Table_RemoveCol : function()
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof  CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                if(_cur_object.graphicObject.Col_Remove() === false)
                {
                    this.Table_RemoveTable(true);
                }
                else
                {
                    _cur_object.RecalculateSize();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
    },

    Table_MergeCells : function()
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof CGraphicFrame)
            {
                if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Merge === "function")
                {
                    var _history_obj = {};
                    _history_obj.Type = history_undo_redo_const;
                    _history_obj.table = _cur_object.graphicObject;
                    _history_obj.undo_function = function(data)
                    {
                        data.table.Recalc_CompiledPr();
                        data.table.Recalculate();
                    };
                    _history_obj.redo_function = function(data)
                    {};
                    History.Add(this, _history_obj);

                    _cur_object.graphicObject.Cell_Merge();
                    _cur_object.graphicObject.Recalculate();
                    _cur_object.RecalculateSize();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                    this.Document_UpdateSelectionState();
                    _history_obj = {};
                    _history_obj.Type = history_undo_redo_const;
                    _history_obj.table = _cur_object.graphicObject;
                    _history_obj.undo_function = function(data)
                    {};
                    _history_obj.redo_function = function(data)
                    {
                        data.table.Recalc_CompiledPr();
                        data.table.Recalculate();
                    };
                    History.Add(this, _history_obj);

                }
            }
        }
    },

    Table_SplitCell : function( Cols, Rows )
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Split === "function")
            {

                _cur_object.graphicObject.Cell_Split( Cols, Rows);
                _cur_object.RecalculateSize();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();
                return;
            }
            else
            {
                return;
            }
        }
       /* else
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
            if(_elements.State.id === 0)
            {
                var _selected_count = 0;
                var _shapes = _elements.ArrGlyph;
                var _shapes_count = _shapes.length;
                var _shape_index;
                var _check_split_table = null;
                for(_shape_index = 0; _shape_index < _shapes_count; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected )
                    {
                        ++_selected_count;
                        if(_selected_count > 1)
                        {
                            return;
                        }
                        if(_shapes[_shape_index] instanceof CGraphicFrame && _shapes[_shape_index].graphicObject instanceof CTable)
                        {
                            _check_split_table = _shapes[_shape_index].graphicObject;
                        }
                        else
                        {
                            return;
                        }
                    }
                }
                if(_check_split_table !== null && typeof _check_split_table === "object" && typeof _check_split_table.Cell_Split === "function")
                {
                     _check_split_table.Cell_Split(Cols, Rows);
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                    return
                }
            }
            else
            {
                return;
            }
        }  */

    },

    Table_RemoveTable : function(bHistoryFlag)
    {
        if(bHistoryFlag === undefined)
        {
            bHistoryFlag = false;
        }
        if(bHistoryFlag === false)
            History.Create_NewPoint();
        var _cur_slide = this.Slides[this.CurPage];
        var _elements = _cur_slide.elementsManipulator;
        _elements.Del(true);
        _elements.ChangeState(new NullShapeState());
        this.CurPos.Type = docpostype_Content;
        this.Document_UpdateSelectionState();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateInterfaceState();
    },

    Table_Select : function(Type)
    {
        if ( docpostype_FlowObjects == this.CurPos.Type )
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable)
            {
                _cur_object.graphicObject.Table_Select(Type);
            }
        }

        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Table_CheckMerge : function()
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object instanceof CGraphicFrame)
            {
                if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Check_Merge === "function")
                {
                    return _cur_object.graphicObject.Check_Merge();
                }
            }
        }
        return false;
    },

    Table_CheckSplit : function()
    {
        if(this.CurPos.Type === docpostype_FlowObjects)
        {
            var _cur_object = this.Slides[this.CurPage].elementsManipulator.obj;
            if(_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Check_Split === "function")
            {
                return _cur_object.graphicObject.Check_Split();
            }
            else
            {
                return false;
            }
        }
        else
        {
            var _elements = this.Slides[this.CurPage].elementsManipulator;
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
            if(_elements.State.id === 0)
            {
                var _selected_count = 0;
                var _shapes = _elements.ArrGlyph;
                var _shapes_count = _shapes.length;
                var _shape_index;
                var _check_split_table = null;
                for(_shape_index = 0; _shape_index < _shapes_count; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected )
                    {
                        ++_selected_count;
                        if(_selected_count > 1)
                        {
                            return false;
                        }
                        if(_shapes[_shape_index] instanceof CGraphicFrame && _shapes[_shape_index].graphicObject instanceof CTable)
                        {
                            _check_split_table = _shapes[_shape_index].graphicObject;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                if(_check_split_table !== null && typeof _check_split_table === "object" && typeof _check_split_table.Check_Split === "function")
                {
                    return _check_split_table.Check_Split();
                }
            }
            else
            {
                return false;
            }
        }
    },
//-----------------------------------------------------------------------------------
// Дополнительные функции
//-----------------------------------------------------------------------------------
    Document_CreateFontMap : function()
    {
        var StartTime = new Date().getTime();

        var FontMap = new Object();
        var Count = this.Slides.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Slides[Index].CreateFontMap(FontMap);
        }
        sendStatus( "CreateFontMap: " + ((new Date().getTime() - StartTime) / 1000) + " s"  );
        return FontMap;
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
        var _slide_elements = _cur_slide.elementsManipulator;
        if(this.CurPos.Type === docpostype_FlowObjects)
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
        }

        editor.sync_EndCatchSelectedElements();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateCanAddHyperlinkState();
    },

    Document_UpdateInterfaceState2 : function()
    {
        var AutoShapes = this.Slides[this.CurPage].elementsManipulator;
        var i;
        if(AutoShapes.State.id == 20)
        {
            while(AutoShapes.State.id == 20)
            {
                AutoShapes = AutoShapes.group;
            }
        }
        if(AutoShapes.State.id == 0)
        {
            for(i = 0; i<AutoShapes.ArrGlyph.length; ++i)
            {
                if(AutoShapes.ArrGlyph[i].selected)
                {
                    break;
                }
            }
            if(i==AutoShapes.ArrGlyph.length)
            {
                return;
            }


            if(AutoShapes.ArrGlyph[i] instanceof  CShape)
            {
                var presetGeom  = AutoShapes.ArrGlyph[i].geometry ? AutoShapes.ArrGlyph[i].geometry.preset: null;
                var fill =  AutoShapes.ArrGlyph[i].brush;
                var stroke = AutoShapes.ArrGlyph[i].pen;
                var canChangeArrows = AutoShapes.ArrGlyph[i].canChangeArrows();
                for(var j = i+1; j<AutoShapes.ArrGlyph.length; ++j)
                {
                    if(AutoShapes.ArrGlyph[j].selected  )
                    {
                        if(!(AutoShapes.ArrGlyph[j] instanceof CShape))
                        {
                            return;
                        }
                        if(AutoShapes.ArrGlyph[j].selected &&  (!AutoShapes.ArrGlyph[j].geometry || AutoShapes.ArrGlyph[j].geometry.preset != presetGeom))
                        {
                            presetGeom = null;
                            break;
                        }
                    }
                }

                if(canChangeArrows)
                {
                    for(j = i+1; j<AutoShapes.ArrGlyph.length; ++j)
                    {
                        if(AutoShapes.ArrGlyph[j].selected && (!AutoShapes.ArrGlyph[j].canChangeArrows || !AutoShapes.ArrGlyph[j].canChangeArrows()))
                        {
                            canChangeArrows = false;
                            break;
                        }
                    }
                }

                if(fill)
                {
                    for(j = i+1; j<AutoShapes.ArrGlyph.length; ++j)
                    {
                        if(AutoShapes.ArrGlyph[j].selected && !fill.IsIdentical(AutoShapes.ArrGlyph[j].brush))
                        {
                            fill = null;
                            break;
                        }
                    }
                }

                if(stroke)
                {
                    for(j = i+1; j<AutoShapes.ArrGlyph.length; ++j)
                    {
                        if(AutoShapes.ArrGlyph[j].selected &&  !stroke.IsIdentical(AutoShapes.ArrGlyph[j].brush))
                        {
                            fill = null;
                            break;
                        }
                    }
                }

                editor.sync_shapePropCallback({type: presetGeom, fill: fill, stroke : stroke, canChangeArrows : canChangeArrows});
            }

            if(AutoShapes.ArrGlyph[i] instanceof  CImage2)
            {

                var width  = AutoShapes.ArrGlyph[i].ext.cx;
                var height = AutoShapes.ArrGlyph[i].ext.cy;
                var posX = AutoShapes.ArrGlyph[i].pH;
                var posY = AutoShapes.ArrGlyph[i].pV;
                var right = posX + width;
                var bottom = posY + height;
                var url =  AutoShapes.ArrGlyph[i].blipFill.fill.RasterImageId;

                for(j = i+1; j<AutoShapes.ArrGlyph.length; ++j)
                {
                    if(AutoShapes.ArrGlyph[j].selected )
                    {
                        if(!(AutoShapes.ArrGlyph[j] instanceof CImage2))
                            return;

                        if(width != null && width  != AutoShapes.ArrGlyph[j].ext.cx)
                        {
                            width = null;
                        }

                        if(height != null && height != AutoShapes.ArrGlyph[j].ext.cy)
                        {
                            height = null;
                        }

                        if(posX != null && posX != AutoShapes.ArrGlyph[j].pH)
                        {
                            posX = null;
                        }

                        if(posY !=null && posY != AutoShapes.ArrGlyph[j].pV)
                        {
                            posY = null;
                        }
                        if(right != null && AutoShapes.ArrGlyph[j].pH + AutoShapes.ArrGlyph[j].ext.cx != right)
                        {
                            right = null;
                        }
                        if(bottom != null && AutoShapes.ArrGlyph[j].pV + AutoShapes.ArrGlyph[j].ext.cy != bottom)
                        {
                            bottom = null;
                        }
                        if(url != null && AutoShapes.ArrGlyph[j].blipFill.fill.RasterImageId != url)
                        {
                            url = null;
                        }
                    }

                }


                var imgProp = new CImgProperty();
                imgProp.Position.put_X(posX);
                imgProp.Position.put_Y(posY);
                imgProp.Paddings.put_Left(posX);
                imgProp.Paddings.put_Top(posY);
                imgProp.Paddings.put_Right(right);
                imgProp.Paddings.put_Bottom(bottom);
                imgProp.Width = width;
                imgProp.Height = height;
                imgProp.put_ImageUrl(url);
                editor.sync_ImgPropCallback(imgProp);

            }
        }
    },

    // Обновляем линейки
    Document_UpdateRulersState : function()
    {
        if(this.CurPos.Type == docpostype_FlowObjects && this.Slides[this.CurPage].elementsManipulator.obj && this.Slides[this.CurPage].elementsManipulator.obj.Document_UpdateRulersState)
        {
            return this.Slides[this.CurPage].elementsManipulator.obj.Document_UpdateRulersState();
        }
        else
        {
            return this.DrawingDocument.Set_RulerState_Paragraph( null );
        }
    },

    // Обновляем линейки
    Document_UpdateSelectionState : function()
    {
        var elements = this.Slides[this.CurPage].elementsManipulator;
        if (docpostype_FlowObjects === this.CurPos.Type){

            elements.obj.Document_UpdateSelectionState();
        }
        else
        {
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SelectClear();
            this.DrawingDocument.SetCurrentPage( this.CurPage );
        }

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
        // Проверяем можно ли добавить гиперссылку
        editor.sync_CanAddHyperlinkCallback( this.Hyperlink_CanAdd() );
    },

    Get_SelectedText: function(bClearText)
    {
        if(this.CurPos.Type === docpostype_FlowObjects
            && this.Slides[this.CurPage].elementsManipulator.obj != null
            && typeof this.Slides[this.CurPage].elementsManipulator.obj.Get_SelectedText === "function")
            return this.Slides[this.CurPage].elementsManipulator.obj.Get_SelectedText(bClearText);

        return null;
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
        var oldCurPage = this.CurPage;
        this.CurPage = Math.min( this.Slides.length - 1, Math.max( 0, PageNum ) );
        if(oldCurPage != this.CurPage && this.CurPage < this.Slides.length)
        {
            editor.sync_BeginCatchSelectedElements();
            editor.sync_slidePropCallback(this.Slides[this.CurPage]);
            editor.sync_EndCatchSelectedElements();
            if(this.Slides[oldCurPage])
                this.Slides[oldCurPage].elementsManipulator.resetState();
            //this.Document_UpdateInterfaceState();
        }
        else if (this.CurPage < this.Slides.length)
        {
            editor.sync_BeginCatchSelectedElements();
            editor.sync_slidePropCallback(this.Slides[this.CurPage]);
            editor.sync_EndCatchSelectedElements();
        }
    },

    resetStateCurSlide : function(isNoSendIS)
    {
        this.Slides[this.CurPage].elementsManipulator.resetState();
        this.CurPos.Type = docpostype_Content;
        this.Document_UpdateSelectionState();
        if (isNoSendIS !== true)
            this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },

    Set_CurPage2 : function(PageNum)
    {
        var oldCurPage = this.CurPage;
        this.CurPage = Math.min( this.Slides.length - 1, Math.max( 0, PageNum ) );
        if(oldCurPage != this.CurPage)
        {
            this.Slides[oldCurPage].elementsManipulator.resetState();
        }
    },

    Get_CurPage : function()
    {
        // Работаем с колонтитулом
        if ( docpostype_HdrFtr === this.CurPos.Type )
            return this.HdrFtr.Get_CurPage();

        return this.CurPage;
    },
//-----------------------------------------------------------------------------------
// Привязываем "плавающие картинки"
//-----------------------------------------------------------------------------------
    Internal_Link_FlowObjects : function(PageNum)
    {
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
            Y = 191;
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
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
    Create_NewHistoryPoint : function()
    {
        this.History.Create_NewPoint();
    },

    Document_Undo : function()
    {
        this.slideNumberAfterUndoRedoFlag = true;
        var RecalcData = this.History.Undo();
        this.Internal_Recalculate_After_UndoRedo( RecalcData );
        this.slideNumberAfterUndoRedoFlag = false;
    },

    Document_Redo : function()
    {
        this.slideNumberAfterUndoRedoFlag = true;
        var RecalcData = this.History.Redo();
        this.Internal_Recalculate_After_UndoRedo( RecalcData );
        this.slideNumberAfterUndoRedoFlag = false;
    },

    Internal_Recalculate_After_UndoRedo : function(RecalcData)
    {
        var sld_num = this.slideNumberAfterUndoRedo;
        if(RecalcData instanceof CDocumentContent)
        {
            RecalcData.Parent.RecalculateContent();
            if(RecalcData.Parent && RecalcData.Parent.parent && typeof(RecalcData.Parent.parent.num) == "number" && RecalcData.Parent.parent.num < this.Slides.length)
            {
                this.DrawingDocument.OnRecalculatePage(RecalcData.Parent.parent.num, RecalcData.Parent.parent);
                this.DrawingDocument.OnEndRecalculate();
            }

            if (this.slideNumberAfterUndoRedoFlag)
            {
                this.slideNumberAfterUndoRedoFlag = false;
                if(this.Slides[this.slideNumberAfterUndoRedo] != null)
                {
                    this.Slides[this.slideNumberAfterUndoRedo].recalculate();
                    this.DrawingDocument.OnRecalculatePage(this.slideNumberAfterUndoRedo, this.Slides[this.slideNumberAfterUndoRedo]);
                    if(this.Slides[this.slideNumberAfterUndoRedo2] != null)
                    {
                        this.DrawingDocument.OnRecalculatePage(this.slideNumberAfterUndoRedo2, this.Slides[this.slideNumberAfterUndoRedo2]);
                    }
                }
                this.DrawingDocument.m_oWordControl.GoToPage(this.slideNumberAfterUndoRedo);
                this.slideNumberAfterUndoRedo = -1;
                this.slideNumberAfterUndoRedo2 = -1;
            }

            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            this.Document_UpdateUndoRedoState();
            return;
        }
        if(RecalcData instanceof CTable)
        {
            RecalcData.Recalculate();
            if(typeof RecalcData.Parent.RecalculateSize === "function")
            {
                RecalcData.Parent.RecalculateSize();
            }
        }

        if(RecalcData instanceof CTableRow)
        {
            RecalcData.Parent.Recalculate();
            if(typeof RecalcData.Parent.Parent.RecalculateSize === "function")
            {
                RecalcData.Parent.Parent.RecalculateSize();
            }
        }


        if(this.Slides[sld_num] != null)
        {
            this.Slides[sld_num].recalculate();
            this.DrawingDocument.OnRecalculatePage(sld_num, this.Slides[sld_num]);
            this.DrawingDocument.m_oWordControl.GoToPage(sld_num);
        }
        if(this.Slides[this.slideNumberAfterUndoRedo2] != null)
        {
            this.DrawingDocument.OnRecalculatePage(this.slideNumberAfterUndoRedo2, this.Slides[this.slideNumberAfterUndoRedo2]);
        }
        this.slideNumberAfterUndoRedo = -1;
        this.slideNumberAfterUndoRedo2 = -1;
        this.slideNumberAfterUndoRedoFlag = false;
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateUndoRedoState();
    },

    Get_SelectionState : function()
    {
        var State = {};
        State.curSlideNum = this.CurPage;
        State.autoShapesSelection = this.Slides[this.CurPage].elementsManipulator.getSelectionState();
        return State;
    },

    Set_SelectionState : function(State)
    {
       if(State.curSlideNum != undefined)
       {
           if(State.autoShapesSelection!= undefined)
           {
               this.Slides[State.curSlideNum].elementsManipulator.setSelectionState(State.autoShapesSelection);
           }

           if (!this.slideNumberAfterUndoRedoFlag)
                this.DrawingDocument.m_oWordControl.GoToPage(State.curSlideNum);
           else
           {
               this.slideNumberAfterUndoRedo = State.curSlideNum;
               this.slideNumberAfterUndoRedo2 = this.CurPage;
           }

       }

    },

    shapeLevelUp : function()
    {
        this.Slides[this.CurPage].elementsManipulator.Arrange();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);

    },

    setShapeLeftAlign : function()
    {
        this.Slides[this.CurPage].elementsManipulator.setShapeLeftAlign();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
    },
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
                    X_Right_Margin  = 254 - X_Right_Field;
                    Y_Bottom_Margin = 191 - Y_Bottom_Field;
                    Y_Top_Margin    = Y_Top_Field;
                }

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_PageSize:
            {

                X_Left_Field   = X_Left_Margin;
                X_Right_Field  = 254  - X_Right_Margin;
                Y_Bottom_Field = 191 - Y_Bottom_Margin;
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

            case history_undo_redo_const:
            {
                Data.redo_function.call(this, Data);
                break;
            }

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
                    X_Right_Margin  = 254 - X_Right_Field;
                    Y_Bottom_Margin = 191 - Y_Bottom_Field;
                    Y_Top_Margin    = Y_Top_Field;
                }

                this.History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : 0 } );
                break;
            }

            case historyitem_Document_PageSize:
            {

                X_Left_Field   = X_Left_Margin;
                X_Right_Field  = 254  - X_Right_Margin;
                Y_Bottom_Field = 191 - Y_Bottom_Margin;
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
        this.Statistics_Stop();
    },

    Statistics_Stop : function()
    {
        this.Statistics.Stop();
    },

    StartAddShape: function(preset, _is_apply)
    {
        var elements =  this.Slides[this.CurPage].elementsManipulator;
        if(_is_apply === undefined || _is_apply === true)
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
                    elements.ChangeState(new ShapeAddState());
                }
            }
        }
        else if(_is_apply != null && _is_apply === false)
        {
            elements.ChangeState(new NullShapeState());
            editor.sync_EndAddShape();
        }


        this.CurPos.Type = docpostype_Content;
    },


    canGroup : function()
    {
        return this.Slides[this.CurPage].elementsManipulator.canGroup();
    },

    canUnGroup : function()
    {
        return this.Slides[this.CurPage].elementsManipulator.canUnGroup();
    },

    changeShapeFill : function(fill)
    {
        var AutoShapes = this.Slides[this.CurPage].elementsManipulator;
        if(AutoShapes.NumSelected==1)
        {

                if(AutoShapes.obj != undefined && AutoShapes.obj.changeFill != undefined)
                {
                    AutoShapes.obj.changeFill(fill);
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                    return;
                }
        }
    },

    changeShapeStroke : function(stroke)
    {

    },



    alignLeft : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignLeft();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    alignRight : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignRight();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },


    alignTop : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignTop();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },


    alignBottom : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignBottom();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },


    alignCenter : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignCenter();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    alignMiddle : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.alignMiddle();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    distributeHor : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.distributeHor();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    distributeVer : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.distributeVer();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },


    bringToFront : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.bringToFront();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    bringForward : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.bringForward();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    sendToBack : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.sendToBack();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },

    bringBackward : function()
    {
        if(docpostype_Content  == this.CurPos.Type)
        {
            this.Slides[this.CurPage].elementsManipulator.bringBackward();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        }
    },


    // east asian text
    TextBox_Put : function(sText)
    {
        var Count = sText.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            var _char = sText.charAt(Index);
            if (" " == _char)
                this.Paragraph_Add( new ParaSpace(1) );
            else
                this.Paragraph_Add( new ParaText(_char) );
        }
    },

    Document_Is_SelectionLocked : function(type)
    {
        return false;
    }
};
