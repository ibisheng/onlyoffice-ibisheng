/**
 * User: Ilja.Kirillov
 * Date: 11.04.12
 * Time: 14:35
 */

/**
 * User: Ilja.Kirillov
 * Date: 11.04.12
 * Time: 14:35
 */

var historyitem_Unknown = 0;

// Типы изменений в классе CDocument
var historyitem_Document_AddItem     = 1; // Добавляем элемент в документ
var historyitem_Document_RemoveItem  = 2; // Удаляем элемент из документа
var historyitem_Document_Margin      = 3; // Меняем маргины(поля) документа
var historyitem_Document_PageSize    = 4; // Меняем размер страницы у документа
var historyitem_Document_Orientation = 5; // Меняем ориентацию страниц у документа

// Типы изменений в классе Paragraph
var historyitem_Paragraph_AddItem                   =  1; // Добавляем элемент в параграф
var historyitem_Paragraph_RemoveItem                =  2; // Удаляем элемент из параграфа
var historyitem_Paragraph_Numbering                 =  3; // Добавляем/Убираем/Изменяем нумерацию у параграфа
var historyitem_Paragraph_Align                     =  4; // Изменяем прилегание параграфа
var historyitem_Paragraph_Ind_First                 =  5; // Изменяем отспут первой строки
var historyitem_Paragraph_Ind_Right                 =  6; // Изменяем правый отступ
var historyitem_Paragraph_Ind_Left                  =  7; // Изменяем левый отступ
var historyitem_Paragraph_ContextualSpacing         =  8; // Изменяем свойство contextualSpacing
var historyitem_Paragraph_KeepLines                 =  9; // Изменяем свойство KeepLines
var historyitem_Paragraph_KeepNext                  = 10; // Изменяем свойство KeepNext
var historyitem_Paragraph_PageBreakBefore           = 11; // Изменяем свойство PageBreakBefore
var historyitem_Paragraph_Spacing_Line              = 12; // Изменяем свойство Spacing.Line
var historyitem_Paragraph_Spacing_LineRule          = 13; // Изменяем свойство Spacing.LineRule
var historyitem_Paragraph_Spacing_Before            = 14; // Изменяем свойство Spacing.Before
var historyitem_Paragraph_Spacing_After             = 15; // Изменяем свойство Spacing.After
var historyitem_Paragraph_Spacing_AfterAutoSpacing  = 16; // Изменяем свойство Spacing.AfterAutoSpacing
var historyitem_Paragraph_Spacing_BeforeAutoSpacing = 17; // Изменяем свойство Spacing.BeforeAutoSpacing
var historyitem_Paragraph_Shd_Value                 = 18; // Изменяем свойство Shd.Value
var historyitem_Paragraph_Shd_Color                 = 19; // Изменяем свойство Shd.Color
var historyitem_Paragraph_WidowControl              = 20; // Изменяем свойство WidowControl
var historyitem_Paragraph_Tabs                      = 21; // Изменяем табы у параграфа
var historyitem_Paragraph_PStyle                    = 22; // Изменяем стиль параграфа
var historyitem_Paragraph_DocNext                   = 23; // Изменяем указатель на следующий объект
var historyitem_Paragraph_DocPrev                   = 24; // Изменяем указатель на предыдущий объект
var historyitem_Paragraph_Parent                    = 25; // Изменяем указатель на родительский объект
var historyitem_Paragraph_Borders_Between           = 26; // Изменяем промежуточную границу
var historyitem_Paragraph_Borders_Bottom            = 27; // Изменяем верхнюю границу
var historyitem_Paragraph_Borders_Left              = 28; // Изменяем левую границу
var historyitem_Paragraph_Borders_Right             = 29; // Изменяем правую границу
var historyitem_Paragraph_Borders_Top               = 30; // Изменяем нижнюю границу
var historyitem_Paragraph_Pr                        = 31; // Изменяем свойства полностью
var historyitem_Paragraph_PresentationPr_Bullet     = 32; // Изменяем свойства нумерации у параграфа в презентации
var historyitem_Paragraph_PresentationPr_Level      = 33; // Изменяем уровень параграфа в презентациях
var historyitem_Paragraph_FramePr                   = 34; // Изменяем настройки рамки
var historyitem_Paragraph_PresentationBullet        = 35; // Изменяем уровень параграфа в презентациях


// Типы изменений в классе ParaTextPr
var historyitem_TextPr_Change     =  1; // Изменяем настройку
var historyitem_TextPr_Bold       =  2; // Изменяем жирность
var historyitem_TextPr_Italic     =  3; // Изменяем наклонность
var historyitem_TextPr_Strikeout  =  4; // Изменяем зачеркивание текста
var historyitem_TextPr_Underline  =  5; // Изменяем подчеркивание текста
var historyitem_TextPr_FontFamily =  6; // Изменяем имя шрифта
var historyitem_TextPr_FontSize   =  7; // Изменяем размер шрифта
var historyitem_TextPr_Color      =  8; // Изменяем цвет текста
var historyitem_TextPr_VertAlign  =  9; // Изменяем вертикальное прилегание
var historyitem_TextPr_HighLight  = 10; // Изменяем выделение текста
var historyitem_TextPr_RStyle     = 11; // Изменяем стиль текста
var historyitem_TextPr_Spacing    = 12; // Изменяем расстояние между символами
var historyitem_TextPr_DStrikeout = 13; // Изменяем двойное зачеркивание
var historyitem_TextPr_Caps       = 14; // Изменяем все буквы на прописные
var historyitem_TextPr_SmallCaps  = 15; // Изменяем все буквы на малые прописные
var historyitem_TextPr_Position   = 16; // Изменяем вертикальное положение
var historyitem_TextPr_Value      = 17; // Изменяем целиком все настройки
var historyitem_TextPr_Unifill    = 18;
var historyitem_TextPr_RFonts     = 19; // Изменяем настройки шрифтов
var historyitem_TextPr_Lang       = 20; // Изменяем настройку языка

// Типы изменений в классе ParaDrawing
var historyitem_Drawing_Size              = 1; // Изменяем размер картинки
var historyitem_Drawing_Url               = 2; // Изменяем адрес картинку (т.е. меняем само изображение)
var historyitem_Drawing_DrawingType       = 3; // Изменяем тип объекта (anchor/inline)
var historyitem_Drawing_WrappingType      = 4; // Изменяем тип обтекания
var historyitem_Drawing_Distance          = 5; // Изменяем расстояние до окружающего текста
var historyitem_Drawing_AllowOverlap      = 6; // Изменяем возможность перекрытия плавающих картинок
var historyitem_Drawing_PositionH         = 7; // Изменяем привязку по горизонтали
var historyitem_Drawing_PositionV         = 8; // Изменяем привязку по вертикали
var historyitem_Drawing_AbsoluteTransform = 9;
var historyitem_Drawing_BehindDoc         = 10; // Изменяем положение объекта (за/перед текстом)
var historyitem_Drawing_SetZIndex         = 11;
var historyitem_Drawing_SetGraphicObject  = 12;
var historyitem_CalculateAfterPaste = 13;


// Типы изменений в классе CDrawingObjects
var historyitem_DrawingObjects_AddItem    = 1;
var historyitem_DrawingObjects_RemoveItem = 2;

// Типы изменений в классе FlowObjects
var historyitem_FlowObjects_AddItem    = 1;
var historyitem_FlowObjects_RemoveItem = 2;

// Типы изменений в классе FlowImage
var historyitem_FlowImage_Position = 1; // Изменяем позицию картинки
var historyitem_FlowImage_Size     = 2; // Изменяем размер картинки
var historyitem_FlowImage_Paddings = 3; // Изменяем отступы от картинки
var historyitem_FlowImage_PageNum  = 4; // Изменяем номер страницы картинки
var historyitem_FlowImage_Url      = 5; // Изменяем адрес картинку (т.е. меняем само изображение)
var historyitem_FlowImage_Parent   = 6; // Изменяем указатель на родительский объект

// Типы изменений в классе CTable
var historyitem_Table_DocNext               =  1; // Изменяем указатель на следующий объект
var historyitem_Table_DocPrev               =  2; // Изменяем указатель на предыдущий объект
var historyitem_Table_Parent                =  3; // Изменяем указатель на родительский объект
var historyitem_Table_TableW                =  4; // Изменяем ширину таблицы
var historyitem_Table_TableCellMar          =  5; // Изменяем отступы(по умолчанию) внутри ячеек
var historyitem_Table_TableAlign            =  6; // Изменяем прилегание(для inline таблиц)
var historyitem_Table_TableInd              =  7; // Изменяем отступ(для inline таблиц)
var historyitem_Table_TableBorder_Left      =  8; // Изменяем левую границу таблицы
var historyitem_Table_TableBorder_Top       =  9; // Изменяем верхнюю границу таблицы
var historyitem_Table_TableBorder_Right     = 10; // Изменяем правую границу таблицы
var historyitem_Table_TableBorder_Bottom    = 11; // Изменяем нижнюю границу таблицы
var historyitem_Table_TableBorder_InsideH   = 12; // Изменяем внутренюю горизонтальную границу
var historyitem_Table_TableBorder_InsideV   = 13; // Изменяем внутренюю вертикальную границу
var historyitem_Table_TableShd              = 14; // Изменяем заливку таблицы
var historyitem_Table_Inline                = 15; // Изменяем свойствой inline
var historyitem_Table_AddRow                = 16; // Добавляем строку в таблицу
var historyitem_Table_RemoveRow             = 17; // Удаляем строку из таблицы
var historyitem_Table_TableGrid             = 18; // Изменяем сетку колонок
var historyitem_Table_TableLook             = 19; // Изменяем тип условного форматирования таблицы
var historyitem_Table_TableStyleRowBandSize = 20; // Изменяем количество строк в группе
var historyitem_Table_TableStyleColBandSize = 21; // Изменяем количество колонок в группе
var historyitem_Table_TableStyle            = 22; // Изменяем стиль таблицы
var historyitem_Table_AllowOverlap          = 23; // Изменяем возможность перекрытия плавающих таблиц
var historyitem_Table_PositionH             = 24; // Изменяем привязку по горизонтали
var historyitem_Table_PositionV             = 25; // Изменяем привязку по вертикали
var historyitem_Table_Distance              = 26; // Изменяем расстояние до окружающего текста
var historyitem_Table_Pr                    = 27; // Изменяем настройки таблицы целиком
var historyitem_Table_TableLayout           = 28; // Изменяем настройки рассчета ширины колонок
var historyitem_Table_SetStyleIndex          = 29; // Изменяем настройки рассчета ширины колонок


// Типы изменений в классе CTableRow
var historyitem_TableRow_Before      = 1; // Изменяем свойство Before
var historyitem_TableRow_After       = 2; // Изменяем свойство After
var historyitem_TableRow_CellSpacing = 3; // Изменяем свойство CellSpacing
var historyitem_TableRow_Height      = 4; // Изменяем свойство Height
var historyitem_TableRow_AddCell     = 5; // Добавляем ячейку
var historyitem_TableRow_RemoveCell  = 6; // Удаляем ячейку
var historyitem_TableRow_TableHeader = 7; // Изменяем свойство TableHeader
var historyitem_TableRow_Pr          = 8; // Изменяем настройки строки целиком

// Типы изменений в классе CTableCell
var historyitem_TableCell_GridSpan      =  1; // Изменяем горизонтальное объединение
var historyitem_TableCell_Margins       =  2; // Изменяем отступы
var historyitem_TableCell_Shd           =  3; // Изменяем заливку
var historyitem_TableCell_VMerge        =  4; // Изменяем вертикальное объединение
var historyitem_TableCell_Border_Left   =  5; // Изменяем левую границу ячейки
var historyitem_TableCell_Border_Right  =  6; // Изменяем правую границу ячейки
var historyitem_TableCell_Border_Top    =  7; // Изменяем верхнюю границу ячейки
var historyitem_TableCell_Border_Bottom =  8; // Изменяем нижнюю границу ячейки
var historyitem_TableCell_VAlign        =  9; // Изменяем вертикальное выравнивание ячейки
var historyitem_TableCell_W             = 10; // Изменяем ширину ячейки

// Типы изменений в классе CDocumentContent
var historyitem_DocumentContent_AddItem     = 1; // Добавляем элемент в документ
var historyitem_DocumentContent_RemoveItem  = 2; // Удаляем элемент из документа

// Типы изменений в классе CFlowTable
var historyitem_FlowTable_Position = 1; // Изменяем позиции
var historyitem_FlowTable_Paddings = 2; // Изменяем отступов
var historyitem_FlowTable_PageNum  = 3; // Изменяем номер страницы у таблицы
var historyitem_FlowTable_Parent   = 4; // Изменяем указатель на родительский объект

// Типы изменений в классе CHeaderFooterController
var historyitem_HdrFtrController_AddItem    = 1; // Добавляем колонтитул
var historyitem_HdrFtrController_RemoveItem = 2; // Удаляем колонтитул

// Типы изменений в классе CHeaderFooter
var historyitem_HdrFtr_BoundY2 = 1; // Изменяем отступ колонтитула (для верхнего от верха,  для нижнего от низа)

// Типы изменений в классе CAbstractNum
var historyitem_AbstractNum_LvlChange    = 1; // Изменили заданный уровень
var historyitem_AbstractNum_TextPrChange = 2; // Изменили текстовую настройку у заданного уровня

// Типы изменений в классе CTableId
var historyitem_TableId_Add   = 1; // Добавили новую ссылку в глобальную таблицу
var historyitem_TableId_Reset = 2; // Изменили Id ссылки

// Типы изменений в классе CComments
var historyitem_Comments_Add    = 1; // Добавили новый комментарий
var historyitem_Comments_Remove = 2; // Удалили комментарий

// Типы изменений в классе СComment
var historyitem_Comment_Change   = 1; // Изменили комментарий
var historyitem_Comment_TypeInfo = 2; // Изменили информацию о типе комментария
var historyitem_Comment_Position = 3; // Изменили информацию о типе комментария


// Типы изменений в классе CParaHyperlinkStart
var historyitem_Hyperlink_Value   = 1; // Изменяем значение гиперссылки
var historyitem_Hyperlink_ToolTip = 2; // Изменяем подсказку гиперссылки

//Типы изменений в классе CGraphicObjects
var historyitem_AddNewGraphicObject = 0;
var historyitem_RemoveGraphicObject = 1;


//Типы изменений в классе CGeometry
var historyitem_SetGuideValue = 0;
var historyitem_SetAdjustmentValue = 1;

//Типы изменений в классе CSlide
var historyitem_RemoveFromSpTree = 0;
var historyitem_AddToSlideSpTree = 1;
var historyitem_AddSlideLocks = 2;
var historyitem_ChangeBg = 3;
var historyitem_ChangeTiming = 4;
var historyitem_SetLayout = 5;
var historyitem_SetSlideNum = 6;
var historyitem_ShapeAdd = 7;
var historyitem_SetCSldName = 8;
var historyitem_SetClrMapOverride = 9;
var historyitem_SetShow = 10;
var historyitem_SetShowPhAnim = 11;
var historyitem_SetShowMasterSp = 12;
var historyitem_AddComment = 13;
var historyitem_RemoveComment = 14;
var historyitem_MoveComment = 15;







//Изменения в классе PropLocker
var historyitem_PropLockerSetId = 0;




//Типы изменений в классе Presenattion
// Типы изменений в классе CDocument
var historyitem_Presenattion_AddSlide     = 1; // Добавляем слайд
var historyitem_Presenattion_RemoveSlide  = 2; // Удаляем слайд
var historyitem_Presenattion_SlideSize    = 3; // Меняем размер слайда



//Типы изменений в классе WordShape
var historyitem_SetAbsoluteTransform = 0;
var historyitem_SetXfrmShape = 1;
var historyitem_SetRotate = 2;
var historyitem_SetSizes = 3;
var historyitem_SetSizesInGroup = 4;
var historyitem_SetAdjValue = 5;
var historyitem_SetMainGroup = 7;
var historyitem_SetGroup = 8;
var historyitem_InitShape = 9;
var historyitem_AddGraphicObject = 10;
var historyitem_AddToSpTree = 11;
var historyitem_ChangeDiagram = 12;
var historyitem_Init2Shape = 13;
var historyitem_ChangeFill = 14;
var historyitem_ChangeLine = 15;
var historyitem_ChangePresetGeom = 16;
var historyitem_CreatePolyine = 17;
var historyitem_AddDocContent = 18;
var historyitem_SetSizes2 = 19;
var historyitem_RemoveFromSpTree = 20;
var historyitem_RemoveFromArrGraphicObj = 21;
var historyitem_RemoveFromArrGraphicObj2 = 22;
var historyitem_MoveShapeInArray = 23;
var historyitem_UpadteSpTreeBefore = 24;
var historyitem_UpadteSpTreeAfter = 25;
var historyitem_ChangeDiagram2 = 26;
var historyitem_SwapGrObject = 27;
var historyitem_SetSpPr = 28;
var historyitem_SetStyle = 29;
var historyitem_SetBodyPr = 30;
var historyitem_SetTextBoxContent = 31;
var historyitem_SetRasterImage2 = 32;
var historyitem_CalculateAfterCopyInGroup = 33;
var historyitem_SetVerticalShapeAlign = 34;
var historyitem_SetParent = 35;


//Типы изменений в классе CShape
var historyitem_SetShapeRot = 0;
var historyitem_SetShapeOffset = 1;
var historyitem_SetShapeExtents = 2;
var historyitem_SetShapeFlips = 3;
var historyitem_SetShapeParent = 4;
var historyitem_SetShapeChildOffset = 5;
var historyitem_SetShapeChildExtents = 6;
var historyitem_SetShapeSetFill = 7;
var historyitem_SetShapeSetLine= 8;
var historyitem_SetShapeSetGeometry = 9;
var historyitem_SetShapeBodyPr = 10;
var historyitem_SetSetNvSpPr = 11;
var historyitem_SetSetSpPr = 12;
var historyitem_SetSetStyle = 13;
var historyitem_SetTextBody = 14;
var historyitem_SetBlipFill = 15;
var historyitem_AddToGroupSpTree = 16;
var historyitem_SetSpGroup = 17;
var historyitem_SetSpParent = 18;
var historyitem_SetGraphicObject = 19;











//Типы изменений в классе CChartAsGroup
var historyitem_SetCahrtLayout = 1000;

//Типы изменений в классе TexBody
var historyitem_SetShape = 0;
var historyitem_SetDocContent = 1;
var historyitem_SetLstStyle = 2;



//Типы изменений в классе CTheme
var historyitem_ChangeColorScheme = 0;
var historyitem_ChangeFontScheme = 1;
var historyitem_ChangeFmtScheme = 2;






//Типы изменений в классе GraphicObjects
var historyitem_AddHdrFtrGrObjects = 0;

//Типы изменений в классе HeaderFooterGraphicObjects
var historyitem_AddHdr = 0;
var historyitem_AddFtr = 1;
var historyitem_RemoveHdr = 2;
var historyitem_RemoveFtr = 3;



//Типы изменений в классе WordGroupShapes
var historyitem_InternalChanges = 6;
var historyitem_GroupRecalculate = 32;



//Типы изменений в классе WrapPolygon
var historyitem_AddNewPoint = 0;
var historyitem_RemovePoint = 1;
var historyitem_MovePoint   = 2;
var historyitem_UpdateWrapSizes = 3;
var historyitem_ChangePolygon = 4;


// Тип класса, к которому относится данный элемент истории
var historyitem_State_Unknown         = 0;
var historyitem_State_Document        = 1;
var historyitem_State_DocumentContent = 2;
var historyitem_State_Paragraph       = 3;
var historyitem_State_Table           = 4;

// Типы произошедших изменений
var historyrecalctype_Inline = 0; // Изменения произошли в обычном тексте (с верхним классом CDocument)
var historyrecalctype_Flow   = 1; // Изменения произошли в "плавающем" объекте
var historyrecalctype_HdrFtr = 2; // Изменения произошли в колонтитуле

// Типы классов, в которых происходили изменения (типы нужны для совместного редактирования)
var historyitem_type_Unknown          =  0;
var historyitem_type_TableId          =  1;
var historyitem_type_Document         =  2;
var historyitem_type_Paragraph        =  3;
var historyitem_type_TextPr           =  4;
var historyitem_type_Drawing          =  5;
var historyitem_type_DrawingObjects   =  6;
var historyitem_type_FlowObjects      =  7;
var historyitem_type_FlowImage        =  8;
var historyitem_type_Table            =  9;
var historyitem_type_TableRow         = 10;
var historyitem_type_TableCell        = 11;
var historyitem_type_DocumentContent  = 12;
var historyitem_type_FlowTable        = 13;
var historyitem_type_HdrFtrController = 14;
var historyitem_type_HdrFtr           = 15;
var historyitem_type_AbstractNum      = 16;
var historyitem_type_Comment          = 17;
var historyitem_type_Comments         = 18;
var historyitem_type_Shape            = 19;
var historyitem_type_Image            = 20;
var historyitem_type_GroupShapes      = 21;
var historyitem_type_Geometry         = 22;
var historyitem_type_WrapPolygon      = 23;
var historyitem_type_Chart			  = 24;
var historyitem_type_HdrFtrGrObjects  = 25;
var historyitem_type_GrObjects        = 26;
var historyitem_type_Hyperlink        = 27;
var historyitem_type_ChartTitle 	  = 28;
var historyitem_type_PropLocker 	  = 29;
var historyitem_type_Slide      	  = 30;
var historyitem_type_Layout      	  = 31;
var historyitem_type_TextBody      	  = 32;
var historyitem_type_GraphicFrame  	  = 33;
var historyitem_type_Theme  	      = 34;









function CHistory(Document)
{
    this.Index      = -1;
    this.SavedIndex = -1;          // Номер точки отката, на которой произошло последнее сохранение
    this.Points     = new Array(); // Точки истории, в каждой хранится массив с изменениями после текущей точки
    this.Document   = Document;

    this.RecalculateData =
    {
        Inline : { Pos : -1, PageNum : 0 },
        Flow   : new Array(),
        HdrFtr : new Array()
    };

    this.TurnOffHistory = false;

    this.BinaryWriter = new CMemory();
}

CHistory.prototype =
{
    Is_Clear : function()
    {
        if ( this.Points.length <= 0 )
            return true;

        return false;
    },

    Clear : function()
    {
        this.Index         = -1;
        this.SavedIndex    = -1;
        this.Points.length = 0;
        this.Internal_RecalcData_Clear();
    },

    Can_Undo : function()
    {
        if ( this.Index >= 0 )
            return true;

        return false;
    },

    Can_Redo : function()
    {
        if ( this.Points.length > 0 && this.Index < this.Points.length - 1 )
            return true;

        return false;
    },

    Undo : function()
    {
        this.Check_UninonLastPoints();

        // Проверяем можно ли сделать Undo
        if ( true != this.Can_Undo() )
            return null;

        // Запоминаем самое последнее состояние документа для Redo
        if ( this.Index === this.Points.length - 1 )
            this.LastState = this.Document.Get_SelectionState();

        var Point = this.Points[this.Index--];

        this.Internal_RecalcData_Clear();

        // Откатываем все действия в обратном порядке (относительно их выполенения)
        for ( var Index = Point.Items.length - 1; Index >= 0; Index-- )
        {
            var Item = Point.Items[Index];
            Item.Class.Undo( Item.Data );
            Item.Class.Refresh_RecalcData( Item.Data );
        }

        this.Document.Set_SelectionState( Point.State );

        return this.RecalculateData;
    },

    Redo : function()
    {
        // Проверяем можно ли сделать Redo
        if ( true != this.Can_Redo() )
            return null;

        var Point = this.Points[++this.Index];

        this.Internal_RecalcData_Clear();

        // Выполняем все действия в прямом порядке
        for ( var Index = 0; Index < Point.Items.length; Index++ )
        {
            var Item = Point.Items[Index];
            Item.Class.Redo( Item.Data );
            Item.Class.Refresh_RecalcData( Item.Data );
        }

        // Восстанавливаем состояние на следующую точку
        var State = null;
        if ( this.Index === this.Points.length - 1 )
            State = this.LastState;
        else
            State = this.Points[this.Index + 1].State;

        this.Document.Set_SelectionState( State );

        return this.RecalculateData;
    },

    Create_NewPoint : function()
    {
        this.Clear_Additional();

        this.Check_UninonLastPoints();

        var State = this.Document.Get_SelectionState();
        var Items = new Array();
        var Time  = new Date().getTime();

        // Создаем новую точку
        this.Points[++this.Index] =
        {
            State      : State, // Текущее состояние документа (курсор, селект)
            Items      : Items, // Массив изменений, начиная с текущего момента
            Time       : Time,  // Текущее время
            Additional : {}     // Дополнительная информация
        };

        // Удаляем ненужные точки
        this.Points.length = this.Index + 1;
    },

    Clear_Redo : function()
    {
        // Удаляем ненужные точки
        this.Points.length = this.Index + 1;
    },

    // Регистрируем новое изменение:
    // Class - объект, в котором оно произошло
    // Data  - сами изменения
    Add : function(Class, Data)
    {
        if ( true === this.TurnOffHistory )
            return;

        if ( this.Index < 0 )
            return;

        var Binary_Pos = this.BinaryWriter.GetCurPosition();

        Class.Save_Changes( Data, this.BinaryWriter );

        var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;

        var Item =
        {
            Class : Class,
            Data  : Data,
            Binary:
            {
                Pos : Binary_Pos,
                Len : Binary_Len
            }
        };

        this.Points[this.Index].Items.push( Item );

        if ( ( Class instanceof CPresentation        && ( historyitem_Presenattion_AddSlide      === Data.Type || historyitem_Presenattion_RemoveSlide === Data.Type ) ) ||
            ( Class instanceof CDocumentContent && ( historyitem_DocumentContent_AddItem === Data.Type || historyitem_DocumentContent_RemoveItem === Data.Type ) ) ||
            ( Class instanceof CTable           && ( historyitem_Table_AddRow            === Data.Type || historyitem_Table_RemoveRow            === Data.Type ) ) ||
            ( Class instanceof CTableRow        && ( historyitem_TableRow_AddCell        === Data.Type || historyitem_TableRow_RemoveCell        === Data.Type ) ) ||
            ( Class instanceof Paragraph        && ( historyitem_Paragraph_AddItem       === Data.Type || historyitem_Paragraph_RemoveItem       === Data.Type ) ) )
        {
            var bAdd = ( ( Class instanceof CPresentation        && historyitem_Presenattion_AddSlide  === Data.Type ) ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_AddItem === Data.Type ) ||
                ( Class instanceof CTable           && historyitem_Table_AddRow            === Data.Type ) ||
                ( Class instanceof CTableRow        && historyitem_TableRow_AddCell        === Data.Type ) ||
                ( Class instanceof Paragraph        && historyitem_Paragraph_AddItem       === Data.Type )
                ) ? true : false;

            var Count = 1;

            if ( ( Class instanceof Paragraph )                                                                ||
                ( Class instanceof CDocumentContent && historyitem_DocumentContent_RemoveItem === Data.Type ) )
                Count = Data.Items.length;

            var ContentChanges = new CContentChangesElement( ( bAdd == true ? contentchanges_Add : contentchanges_Remove ), Data.Pos, Count, Item );
            Class.Add_ContentChanges( ContentChanges );
            CollaborativeEditing.Add_NewDC( Class );
        }
    },

    Internal_RecalcData_Clear : function()
    {
        this.RecalculateData =
        {
            Inline : { Pos : -1, PageNum : 0 },
            Flow   : new Array(),
            HdrFtr : new Array()
        };
    },

    RecalcData_Add : function(Data)
    {
        if ( "undefined" === typeof(Data) || null === Data )
            return;

        switch ( Data.Type )
        {
            case historyrecalctype_Flow:
            {
                var bNew = true;
                for ( var Index = 0; Index < this.RecalculateData.Flow.length; Index++ )
                {
                    if ( this.RecalculateData.Flow[Index] === Data.Data )
                    {
                        bNew = false;
                        break;
                    }
                }

                if ( true === bNew )
                    this.RecalculateData.Flow.push( Data.Data );

                break;
            }

            case historyrecalctype_HdrFtr:
            {
                if ( null === Data.Data )
                    break;

                var bNew = true;
                for ( var Index = 0; Index < this.RecalculateData.HdrFtr.length; Index++ )
                {
                    if ( this.RecalculateData.HdrFtr[Index] === Data.Data )
                    {
                        bNew = false;
                        break;
                    }
                }

                if ( true === bNew )
                    this.RecalculateData.HdrFtr.push( Data.Data );

                break
            }

            case historyrecalctype_Inline:
            {
                if ( Data.Data.Pos < this.RecalculateData.Inline.Pos || this.RecalculateData.Inline.Pos < 0 )
                {
                    this.RecalculateData.Inline.Pos     = Data.Data.Pos;
                    this.RecalculateData.Inline.PageNum = Data.Data.PageNum;
                }

                break;
            }
        }
    },

    Check_UninonLastPoints : function()
    {
        // Не объединяем точки истории, если на предыдущей точке произошло сохранение
        if ( this.Points.length < 2 || this.SavedIndex >= this.Points.length - 2 )
            return;

        var Point1 = this.Points[this.Points.length - 2];
        var Point2 = this.Points[this.Points.length - 1];

        // Не объединяем слова больше 63 элементов
        if ( Point1.Items.length > 63 )
            return;

        var PrevItem = null;
        var Class = null;
        for ( var Index = 0; Index < Point1.Items.length; Index++ )
        {
            var Item = Point1.Items[Index];

            if ( null === Class )
                Class = Item.Class;
            else if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
        }

        for ( var Index = 0; Index < Point2.Items.length; Index++ )
        {
            var Item = Point2.Items[Index];

            if ( Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data) )
                return;

            PrevItem = Item;
        }

        var NewPoint =
        {
            State : Point1.State,
            Items : Point1.Items.concat(Point2.Items),
            Time  : Point1.Time,
            Additional : {}
        };

        this.Points.splice( this.Points.length - 2, 2, NewPoint );
        if ( this.Index >= this.Points.length )
            this.Index = this.Points.length - 1;
    },

    TurnOff : function()
    {
        this.TurnOffHistory = true;
    },

    TurnOn : function()
    {
        this.TurnOffHistory = false;
    },

    Is_On : function()
    {
        return ( false === this.TurnOffHistory ? true : false ) ;
    },

    Reset_SavedIndex : function()
    {
        this.SavedIndex = this.Index;
    },

    Have_Changes : function()
    {
        if ( this.Index != this.SavedIndex )
            return true;

        return false;
    },

    Get_RecalcData : function()
    {
        if ( this.Index >= 0 )
        {
            // Считываем изменения, начиная с последней точки, и смотрим что надо пересчитать.
            var Point = this.Points[this.Index];

            this.Internal_RecalcData_Clear();

            // Выполняем все действия в прямом порядке
            for ( var Index = 0; Index < Point.Items.length; Index++ )
            {
                var Item = Point.Items[Index];
                Item.Class.Refresh_RecalcData( Item.Data );
            }
        }

        return this.RecalculateData;
    },

    Set_Additional_ExtendDocumentToPos : function()
    {
        if ( this.Index >= 0 )
        {
            this.Points[this.Index].Additional.ExtendDocumentToPos = true;
        }
    },

    Is_ExtendDocumentToPos : function()
    {
        if ( undefined === this.Points[this.Index] || undefined === this.Points[this.Index].Additional || undefined === this.Points[this.Index].Additional.ExtendDocumentToPos )
            return false;

        return true;
    },

    Clear_Additional : function()
    {
        if ( this.Index >= 0 )
        {
            this.Points[this.Index].Additional = new Object();
        }
    },

    Get_EditingTime : function(dTime)
    {
        var Count = this.Points.length;

        var TimeLine = new Array();
        for ( var Index = 0; Index < Count; Index++ )
        {
            var PointTime = this.Points[Index].Time;
            TimeLine.push( { t0 : PointTime - dTime, t1 : PointTime } );
        }

        Count = TimeLine.length;
        for ( var Index = 1; Index < Count; Index++ )
        {
            var CurrEl = TimeLine[Index];
            var PrevEl = TimeLine[Index - 1];
            if ( CurrEl.t0 <= PrevEl.t1 )
            {
                PrevEl.t1 = CurrEl.t1;
                TimeLine.splice( Index, 1 );
                Index--;
                Count--;
            }
        }

        Count = TimeLine.length;
        var OverallTime = 0;
        for ( var Index = 0; Index < Count; Index++ )
        {
            OverallTime += TimeLine[Index].t1 - TimeLine[Index].t0;
        }

        return OverallTime;
    }

};
