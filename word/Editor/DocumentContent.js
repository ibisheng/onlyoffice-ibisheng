"use strict";

// Import
var g_oTableId = AscCommon.g_oTableId;
var History = AscCommon.History;

var c_oAscHAnchor = Asc.c_oAscHAnchor;
var c_oAscXAlign = Asc.c_oAscXAlign;
var c_oAscYAlign = Asc.c_oAscYAlign;
var c_oAscVAnchor = Asc.c_oAscVAnchor;


/**
 * Класс CDocumentContent. Данный класс используется для работы с контентом ячеек таблицы, колонтитулов, сносок,
 * надписей.
 * @param Parent
 * @param DrawingDocument
 * @param X
 * @param Y
 * @param XLimit
 * @param YLimit
 * @param Split
 * @param TurnOffInnerWrap
 * @param bPresentation
 * @constructor
 * @extends {CDocumentContentBase}
 */
function CDocumentContent(Parent, DrawingDocument, X, Y, XLimit, YLimit, Split, TurnOffInnerWrap, bPresentation)
{
    CDocumentContent.superclass.constructor.call(this);

    this.Id = AscCommon.g_oIdCounter.Get_NewId();

    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;

    this.Parent = Parent;
    
    this.DrawingDocument = null;
    this.LogicDocument   = null;
    this.Styles          = null;
    this.Numbering       = null;
    this.DrawingObjects  = null;
    
    if ( undefined !== DrawingDocument && null !== DrawingDocument )
    {
        this.DrawingDocument = DrawingDocument;
        
        if ( undefined !== editor && true === editor.isDocumentEditor && !(bPresentation === true) )
        {
            this.LogicDocument   = DrawingDocument.m_oLogicDocument;
            this.Styles          = DrawingDocument.m_oLogicDocument.Get_Styles();
            this.Numbering       = DrawingDocument.m_oLogicDocument.Get_Numbering();
            this.DrawingObjects  = DrawingDocument.m_oLogicDocument.DrawingObjects; // Массив укзателей на все инлайновые графические объекты
        }
    }

    if ( "undefined" === typeof(TurnOffInnerWrap) )
        TurnOffInnerWrap = false;

    this.TurnOffInnerWrap = TurnOffInnerWrap;

    this.Pages = [];

    this.RecalcInfo = new CDocumentRecalcInfo();

    this.Split = Split; // Разделяем ли на страницы
    this.bPresentation = bPresentation; // Разделяем ли на страницы

    this.Content[0] = new Paragraph( DrawingDocument, this, 0, X, Y, XLimit, YLimit, bPresentation );
    this.Content[0].Correct_Content();
    this.Content[0].Set_DocumentNext( null );
    this.Content[0].Set_DocumentPrev( null );

    this.CurPos  =
    {
        X          : 0,
        Y          : 0,
        ContentPos : 0, // в зависимости, от параметра Type: позиция в Document.Content
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

    this.ClipInfo = [];

    this.ApplyToAll = false; // Специальный параметр, используемый в ячейках таблицы.
                             // True, если ячейка попадает в выделение по ячейкам.

    this.TurnOffRecalc = false;

    this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)
    this.StartState = null;

    this.ReindexStartPos = 0;

    // Добавляем данный класс в таблицу Id (обязательно в конце конструктора)
    g_oTableId.Add( this, this.Id );

    if(this.bPresentation)
    {
        this.Save_StartState();
    }
}
AscCommon.extendClass(CDocumentContent, CDocumentContentBase);

CDocumentContent.prototype.Set_Id          = function(newId)
{
    g_oTableId.Reset_Id(this, newId, this.Id);
    this.Id = newId;
};
CDocumentContent.prototype.Get_Id          = function()
{
    return this.Id;
};
CDocumentContent.prototype.Save_StartState = function()
{
    this.StartState = new CDocumentContentStartState(this);
};
CDocumentContent.prototype.Copy            = function(Parent, DrawingDocument)
{
    var DC = new CDocumentContent(Parent, DrawingDocument ? DrawingDocument : this.DrawingDocument, 0, 0, 0, 0, this.Split, this.TurnOffInnerWrap, this.bPresentation);

    // Копируем содержимое
    DC.Internal_Content_RemoveAll();

    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        DC.Internal_Content_Add(Index, this.Content[Index].Copy(DC, DrawingDocument), false);
    }

    return DC;
};
CDocumentContent.prototype.Copy2           = function(OtherDC)
{
    // Копируем содержимое
    this.Internal_Content_RemoveAll();

    var Count = OtherDC.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        this.Internal_Content_Add(Index, OtherDC.Content[Index].Copy(this), false);
    }
};
CDocumentContent.prototype.Copy3           = function(Parent)//для заголовков диаграмм
{
    var DC = new CDocumentContent(Parent, this.DrawingDocument, 0, 0, 0, 0, this.Split, this.TurnOffInnerWrap, true);

    // Копируем содержимое
    DC.Internal_Content_RemoveAll();

    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        DC.Internal_Content_Add(Index, this.Content[Index].Copy2(DC), false);
    }
    return DC;
};
//-----------------------------------------------------------------------------------
// Функции, к которым идет обращение из контента
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Get_PageContentStartPos  = function(PageNum)
{
    return this.Parent.Get_PageContentStartPos(PageNum);
};
CDocumentContent.prototype.Get_PageContentStartPos2 = function(StartPageIndex, StartColumnIndex, ElementPageIndex, ElementIndex)
{
    return this.Get_PageContentStartPos(StartPageIndex + ElementPageIndex);
};
CDocumentContent.prototype.Get_Theme                = function()
{
    return this.Parent.Get_Theme();
};
CDocumentContent.prototype.Get_ColorMap             = function()
{
    return this.Parent.Get_ColorMap();
};
CDocumentContent.prototype.Get_PageLimits           = function(PageIndex)
{
    if (true === this.Parent.Is_Cell())
    {
        var Margins = this.Parent.Get_Margins();

        var Y      = this.Pages[PageIndex].Y - Margins.Top.W;
        var YLimit = this.Pages[PageIndex].YLimit + Margins.Bottom.W;
        var X      = this.Pages[PageIndex].X - Margins.Left.W;
        var XLimit = this.Pages[PageIndex].XLimit + Margins.Right.W;

        return {X : X, XLimit : XLimit, Y : Y, YLimit : YLimit}
    }
    else
    {
        if (null === this.LogicDocument)
            return {X : 0, Y : 0, XLimit : 0, YLimit : 0};

        var Page_abs = this.Get_StartPage_Absolute() + PageIndex;
        var Index    = ( undefined !== this.LogicDocument.Pages[Page_abs] ? this.LogicDocument.Pages[Page_abs].Pos : 0 );
        var SectPr   = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
        var Orient   = SectPr.Get_Orientation();

        var W = SectPr.Get_PageWidth();
        var H = SectPr.Get_PageHeight();

        return {X : 0, Y : 0, XLimit : W, YLimit : H};
    }
};
CDocumentContent.prototype.Get_PageFields           = function(PageIndex)
{
    if (true === this.Parent.Is_Cell() || (undefined !== AscFormat.CShape && this.Parent instanceof AscFormat.CShape))
    {
        if (PageIndex < this.Pages.length && PageIndex >= 0)
        {
            var Y      = this.Pages[PageIndex].Y;
            var YLimit = this.Pages[PageIndex].YLimit;
            var X      = this.Pages[PageIndex].X;
            var XLimit = this.Pages[PageIndex].XLimit;

            return {X : X, XLimit : XLimit, Y : Y, YLimit : YLimit}
        }
        else
        {
            if (null === this.LogicDocument)
                return {X : 0, Y : 0, XLimit : 0, YLimit : 0};

            var Page_abs = this.Get_StartPage_Absolute() + PageIndex;
            var Index    = ( undefined !== this.LogicDocument.Pages[Page_abs] ? this.LogicDocument.Pages[Page_abs].Pos : 0 );
            var SectPr   = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
            var Orient   = SectPr.Get_Orientation();

            var W = SectPr.Get_PageWidth();
            var H = SectPr.Get_PageHeight();

            return {X : 0, Y : 0, XLimit : W, YLimit : H};
        }
    }
    else
    {
        if (null === this.LogicDocument)
            return {X : 0, Y : 0, XLimit : 0, YLimit : 0};

        var Page_abs = this.Get_StartPage_Absolute() + PageIndex;
        var Index    = ( undefined !== this.LogicDocument.Pages[Page_abs] ? this.LogicDocument.Pages[Page_abs].Pos : 0 );
        var SectPr   = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
        var Orient   = SectPr.Get_Orientation();

        var Y      = SectPr.PageMargins.Top;
        var YLimit = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        var X      = SectPr.PageMargins.Left;
        var XLimit = SectPr.PageSize.W - SectPr.PageMargins.Right;

        return {X : X, Y : Y, XLimit : XLimit, YLimit : YLimit};
    }

};
CDocumentContent.prototype.Get_EmptyHeight          = function()
{
    var Count = this.Content.length;
    if (Count <= 0)
        return 0;

    var Element = this.Content[Count - 1];

    if (type_Paragraph === Element.GetType())
        return Element.Get_EmptyHeight();
    else
        return 0;
};
// Inner = true  - запрос пришел из содержимого,
//         false - запрос пришел от родительского класса
// Запрос от родительского класса нужен, например, для колонтитулов, потому
// что у них врапится текст не колонтитула, а документа.
CDocumentContent.prototype.CheckRange                      = function(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum_rel, Inner, bMathWrap)
{
    if (this.LogicDocument && typeof(editor) !== "undefined" && editor.isDocumentEditor)
    {
        if (undefined === Inner)
            Inner = true;

        if ((false === this.TurnOffInnerWrap && true === Inner) || (false === Inner))
            return this.LogicDocument.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum_rel + this.Get_StartPage_Absolute(), [], this, bMathWrap);
    }

    return [];
};
CDocumentContent.prototype.Is_PointInDrawingObjects        = function(X, Y, Page_Abs)
{
    return this.LogicDocument && this.LogicDocument.DrawingObjects.pointInObjInDocContent(this, X, Y, Page_Abs);
};
CDocumentContent.prototype.Get_Numbering                   = function()
{
    return this.Parent.Get_Numbering();
};
CDocumentContent.prototype.Internal_GetNumInfo             = function(ParaId, NumPr)
{
    var TopDocument = this.Get_TopDocumentContent();
    return TopDocument.Get_NumberingInfo(null, ParaId, NumPr);
};
CDocumentContent.prototype.Get_Styles                      = function(lvl)
{
    if (this.Content[0] && this.Content[0].bFromDocument)
        return this.Styles;
    else
        return this.Parent.Get_Styles(lvl);
};
CDocumentContent.prototype.Get_TableStyleForPara           = function()
{
    return this.Parent.Get_TableStyleForPara();
};
CDocumentContent.prototype.Get_ShapeStyleForPara           = function()
{
    return this.Parent.Get_ShapeStyleForPara();
};
CDocumentContent.prototype.Get_TextBackGroundColor         = function()
{
    return this.Parent.Get_TextBackGroundColor();
};
CDocumentContent.prototype.Recalc_AllParagraphs_CompiledPr = function()
{
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        if (type_Paragraph === Item.GetType())
        {
            Item.Recalc_CompiledPr();
            Item.Recalc_RunsCompiledPr();
        }
        else if (type_Table === Item.GetType())
            Item.Recalc_CompiledPr2();
    }
};
CDocumentContent.prototype.Set_CurrentElement              = function(Index, bUpdateStates)
{
    var ContentPos   = Math.max(0, Math.min(this.Content.length - 1, Index));
    this.CurPos.Type = docpostype_Content;

    var CurPos = Math.max(0, Math.min(this.Content.length - 1, Index));

    this.Selection.Use      = false;
    this.Selection.Start    = false;
    this.Selection.Flag     = selectionflag_Common;
    this.Selection.StartPos = CurPos;
    this.Selection.EndPos   = CurPos;
    this.CurPos.ContentPos  = CurPos;

    if (true === this.Content[ContentPos].Is_SelectionUse())
    {
        this.Selection.Use      = true;
        this.Selection.StartPos = ContentPos;
        this.Selection.EndPos   = ContentPos;
    }

    this.Parent.Set_CurrentElement(bUpdateStates, this.Get_StartPage_Absolute());
};
CDocumentContent.prototype.Is_ThisElementCurrent           = function()
{
    return this.Parent.Is_ThisElementCurrent();
};
CDocumentContent.prototype.Content_GetPrev                 = function(Id)
{
    var Index = this.Internal_Content_Find(Id);
    if (Index > 0)
    {
        return this.Content[Index - 1];
    }

    return null;
};
CDocumentContent.prototype.Content_GetNext                 = function(Id)
{
    var Index = this.Internal_Content_Find(Id);
    if (-1 != Index && Index < this.Content.length - 1)
    {
        return this.Content[Index + 1];
    }

    return null;
};
// Получем ближающую возможную позицию курсора
CDocumentContent.prototype.Get_NearestPos                  = function(CurPage, X, Y, bAnchor, Drawing)
{
    // TODO: Возможно лучше вернуть null, и разобраться с ситуациями, когда Get_NearestPos возвращает null
    if (CurPage < 0)
    {
        Y       = 0;
        CurPage = 0;
    }
    else if (CurPage >= this.Pages.length)
    {
        CurPage = this.Pages.length - 1;
        Y       = 10000;
    }

    var PageAbs = this.Get_AbsolutePage(CurPage);

    if (this.Parent && this.Parent instanceof CHeaderFooter)
    {
        var bInText    = (null === this.Is_InText(X, Y, CurPage) ? false : true);
        var nInDrawing = this.LogicDocument.DrawingObjects.isPointInDrawingObjects(X, Y, PageAbs, this);

        if (true != bAnchor)
        {
            // Проверяем попадание в графические объекты
            var NearestPos = this.LogicDocument.DrawingObjects.getNearestPos(X, Y, PageAbs, Drawing);
            if (( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bInText && nInDrawing >= 0 ) ) && null != NearestPos)
                return NearestPos;
        }
    }

    var ContentPos = this.Internal_GetContentPosByXY(X, Y, CurPage);

    // Делаем логику как в ворде
    if (true != bAnchor && (0 < ContentPos || CurPage > 0) && ContentPos === this.Pages[CurPage].Pos && this.Pages[CurPage].EndPos > this.Pages[CurPage].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage())
        ContentPos++;

    var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, CurPage);
    return this.Content[ContentPos].Get_NearestPos(ElementPageIndex, X, Y, bAnchor, Drawing);
};
// Проверяем, описывает ли данный класс содержимое ячейки
CDocumentContent.prototype.Is_TableCellContent             = function()
{
    return this.Parent.Is_Cell();
};
CDocumentContent.prototype.Is_TableFirstRowOnNewPage       = function()
{
    if (false === this.Parent.Is_Cell())
        return false;

    return this.Parent.Is_TableFirstRowOnNewPage();
};
CDocumentContent.prototype.Check_AutoFit                   = function()
{
    return this.Parent.Check_AutoFit();
};
// Проверяем, лежит ли данный класс в таблице
CDocumentContent.prototype.Is_InTable                      = function(bReturnTopTable)
{
    return this.Parent.Is_InTable(bReturnTopTable);
};
// Проверяем, является ли данный класс верхним, по отношению к другим классам DocumentContent, Document
CDocumentContent.prototype.Is_TopDocument                  = function(bReturnTopDocument)
{
    return this.Parent.Is_TopDocument(bReturnTopDocument);
};
// Проверяем, используется ли данный элемент в документе
CDocumentContent.prototype.Is_UseInDocument                = function(Id)
{
    var bUse = false;

    if (null != Id)
    {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            if (Id === this.Content[Index].Get_Id())
            {
                bUse = true;
                break;
            }
        }
    }
    else
        bUse = true;

    if (true === bUse && null != this.Parent)
        return this.Parent.Is_UseInDocument(this.Get_Id());

    return false;
};
CDocumentContent.prototype.Is_HdrFtr                       = function(bReturnHdrFtr)
{
    return this.Parent.Is_HdrFtr(bReturnHdrFtr);
};
CDocumentContent.prototype.Is_DrawingShape                 = function(bRetShape)
{
    return this.Parent.Is_DrawingShape(bRetShape);
};
// Данный запрос может прийти из внутреннего элемента(параграф, таблица), чтобы узнать
// происходил ли выделение в пределах одного элеменета.
CDocumentContent.prototype.Selection_Is_OneElement      = function()
{
    if (true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos)
        return 0;

    return (this.Selection.StartPos < this.Selection.EndPos ? 1 : -1);
};
CDocumentContent.prototype.Selection_Is_TableBorderMove = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.DrawingObjects.selectionIsTableBorder();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType())
            return true;
    }

    return false;
};
CDocumentContent.prototype.Check_TableCoincidence       = function(Table)
{
    return this.Parent.Check_TableCoincidence(Table);
};
//-----------------------------------------------------------------------------------
// Основные функции, к которым идет обращение от родительского класса
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Reset                          = function(X, Y, XLimit, YLimit)
{
    this.X      = X;
    this.Y      = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;

    // Заглушка для работы курсора в новой таблице
    if (0 === this.CurPos.X && 0 === this.CurPos.Y)
    {
        this.CurPos.X = X;
        this.CurPos.Y = Y;

        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
    }

    this.ClipInfo = [];
};
CDocumentContent.prototype.Recalculate                    = function()
{
    if (typeof(editor) !== "undefined" && editor.isDocumentEditor)
    {
        editor.WordControl.m_oLogicDocument.bRecalcDocContent    = true;
        editor.WordControl.m_oLogicDocument.recalcDocumentConten = this;
        editor.WordControl.m_oLogicDocument.Recalculate();
    }
};
CDocumentContent.prototype.Reset_RecalculateCache         = function()
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        this.Content[Index].Reset_RecalculateCache();
    }
};
// Пересчитываем отдельную страницу DocumentContent
CDocumentContent.prototype.Recalculate_Page               = function(PageIndex, bStart)
{
    if (0 === PageIndex && true === bStart)
    {
        this.RecalcInfo.FlowObject                = null;
        this.RecalcInfo.FlowObjectPageBreakBefore = false;
    }

    var StartIndex = 0;
    if (PageIndex > 0)
        StartIndex = this.Pages[PageIndex - 1].EndPos;

    if (true === bStart)
    {
        this.Pages.length         = PageIndex;
        this.Pages[PageIndex]     = new CDocumentPage();
        this.Pages[PageIndex].Pos = StartIndex;
        if (this.LogicDocument)
            this.LogicDocument.DrawingObjects.resetDrawingArrays(this.Get_AbsolutePage(PageIndex), this);
    }

    var Count = this.Content.length;

    var StartPos;
    if (0 === PageIndex)
    {
        StartPos =
        {
            X      : this.X,
            Y      : this.Y,
            XLimit : this.XLimit,
            YLimit : this.YLimit
        }
    }
    else
    {
        StartPos = this.Get_PageContentStartPos(PageIndex);
    }

    this.Pages[PageIndex].Update_Limits(StartPos);

    var X      = StartPos.X;
    var StartY = StartPos.Y;
    var Y      = StartY;
    var YLimit = StartPos.YLimit;
    var XLimit = StartPos.XLimit;

    var Result = recalcresult2_End;

    for (var Index = StartIndex; Index < Count; Index++)
    {
        // Пересчитываем элемент документа
        var Element = this.Content[Index];

        Element.TurnOff_RecalcEvent();

        var RecalcResult = recalcresult_NextElement;
        var bFlow        = false;
        if (type_Table === Element.GetType() && true != Element.Is_Inline())
        {
            bFlow = true;
            if (true === this.RecalcInfo.Can_RecalcObject())
            {
                Element.Set_DocumentIndex(Index);
                Element.Reset(X, Y, XLimit, YLimit, PageIndex, 0, 1);
                var TempRecalcResult = Element.Recalculate_Page(0);
                this.RecalcInfo.Set_FlowObject(Element, 0, TempRecalcResult, -1, {
                    X      : X,
                    Y      : Y,
                    XLimit : XLimit,
                    YLimit : YLimit
                });

                if (this.DrawingObjects)
                    this.DrawingObjects.addFloatTable(new CFlowTable(Element, PageIndex));

                RecalcResult = recalcresult_CurPage;
            }
            else if (true === this.RecalcInfo.Check_FlowObject(Element))
            {
                // Если у нас текущая страница совпадает с той, которая указана в таблице, тогда пересчитываем дальше
                if (Element.PageNum > PageIndex || ( this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex ) || Element.PageNum === PageIndex)
                {
                    if (true === this.RecalcInfo.FlowObjectPageBreakBefore)
                    {
                        // Добавляем начало таблицы в конец страницы так, чтобы не убралось ничего
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, YLimit, XLimit, YLimit, PageIndex, 0, 1);
                        Element.Recalculate_Page(0);

                        this.RecalcInfo.FlowObjectPage++;
                        RecalcResult = recalcresult_NextPage;
                    }
                    else
                    {
                        X      = this.RecalcInfo.AdditionalInfo.X;
                        Y      = this.RecalcInfo.AdditionalInfo.Y;
                        XLimit = this.RecalcInfo.AdditionalInfo.XLimit;
                        YLimit = this.RecalcInfo.AdditionalInfo.YLimit;

                        // Пересчет нужнен для обновления номеров колонок и страниц
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex, 0, 1);
                        RecalcResult = Element.Recalculate_Page(0);
                        this.RecalcInfo.FlowObjectPage++;

                        if (RecalcResult & recalcresult_NextElement)
                            this.RecalcInfo.Reset();
                    }
                }
                else
                {
                    RecalcResult = Element.Recalculate_Page(PageIndex - Element.PageNum);
                    this.RecalcInfo.FlowObjectPage++;

                    if (this.DrawingObjects)
                        this.DrawingObjects.addFloatTable(new CFlowTable(Element, PageIndex));

                    if (RecalcResult & recalcresult_NextElement)
                        this.RecalcInfo.Reset();
                }
            }
            else
            {
                RecalcResult = recalcresult_NextElement;
            }
        }
        else if (type_Paragraph === Element.GetType() && true != Element.Is_Inline())
        {
            // TODO: Пока обрабатываем рамки только внутри верхнего класса внутри колонтитулов. Разобраться как и
            //       главное когда они работают внутри таблиц и автофигур.

            bFlow = true;

            if (true === this.RecalcInfo.Can_RecalcObject())
            {
                var FramePr = Element.Get_FramePr();

                // Рассчитаем количество подряд идущих параграфов с одинаковыми FramePr
                var FlowCount = 1;
                for (var TempIndex = Index + 1; TempIndex < Count; TempIndex++)
                {
                    var TempElement = this.Content[TempIndex];
                    if (type_Paragraph === TempElement.GetType() && true != TempElement.Is_Inline())
                    {
                        var TempFramePr = TempElement.Get_FramePr();
                        if (true === FramePr.Compare(TempFramePr))
                            FlowCount++;
                        else
                            break;
                    }
                    else
                        break;
                }

                var LD_PageLimits = this.LogicDocument.Get_PageLimits(PageIndex + this.Get_StartPage_Absolute());
                var LD_PageFields = this.LogicDocument.Get_PageFields(PageIndex + this.Get_StartPage_Absolute());

                var Page_W = LD_PageLimits.XLimit;
                var Page_H = LD_PageLimits.YLimit;

                var Page_Field_L = LD_PageFields.X;
                var Page_Field_R = LD_PageFields.XLimit;
                var Page_Field_T = LD_PageFields.Y;
                var Page_Field_B = LD_PageFields.YLimit;

                //--------------------------------------------------------------------------------------------------
                // 1. Рассчитаем размер рамки
                //--------------------------------------------------------------------------------------------------
                var FrameH = 0;
                var FrameW = -1;

                var Frame_XLimit = FramePr.Get_W();
                var Frame_YLimit = FramePr.Get_H();

                if (undefined === Frame_XLimit)
                    Frame_XLimit = Page_Field_R - Page_Field_L;

                if (undefined === Frame_YLimit)
                    Frame_YLimit = Page_H;

                for (var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++)
                {
                    var TempElement = this.Content[TempIndex];
                    // Получим параметры расположения рамки
                    TempElement.Set_DocumentIndex(TempIndex);

                    if (Index != TempIndex || ( true != this.RecalcInfo.FrameRecalc && ( ( 0 === Index && 0 === PageIndex ) || Index != StartIndex ) ))
                        TempElement.Reset(0, FrameH, Frame_XLimit, Frame_YLimit, PageIndex);

                    TempElement.Recalculate_Page(PageIndex);

                    FrameH = TempElement.Get_PageBounds(PageIndex - TempElement.Get_StartPage_Relative()).Bottom;
                }

                // Обработаем "авто" ширину рамки. Ширина "авто" может быть в случае, когда значение W в FramePr
                // отсутствует, когда, у нас ровно 1 параграф, с 1 строкой.
                if (-1 === FrameW && 1 === FlowCount && 1 === Element.Lines.length && undefined === FramePr.Get_W())
                {
                    FrameW     = Element.Lines[0].Ranges[0].W;
                    var ParaPr = Element.Get_CompiledPr2(false).ParaPr;
                    FrameW += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;

                    // Если прилегание в данном случае не к левой стороне, тогда пересчитываем параграф,
                    // с учетом того, что ширина буквицы должна быть FrameW
                    if (AscCommon.align_Left != ParaPr.Jc)
                    {
                        TempElement.Reset(0, 0, FrameW, Frame_YLimit, PageIndex);
                        TempElement.Recalculate_Page(PageIndex);
                        FrameH = TempElement.Get_PageBounds(PageIndex - TempElement.Get_StartPage_Relative()).Bottom;
                    }
                }
                else if (-1 === FrameW)
                    FrameW = Frame_XLimit;

                var FrameHRule = ( undefined === FramePr.HRule ? Asc.linerule_Auto : FramePr.HRule );
                switch (FrameHRule)
                {
                    case Asc.linerule_Auto :
                        break;
                    case Asc.linerule_AtLeast :
                    {
                        if (FrameH < FramePr.H)
                            FrameH = FramePr.H;

                        break;
                    }

                    case Asc.linerule_Exact:
                    {
                        FrameH = FramePr.H;
                        break;
                    }
                }

                //--------------------------------------------------------------------------------------------------
                // 2. Рассчитаем положение рамки
                //--------------------------------------------------------------------------------------------------

                // Теперь зная размеры рамки можем рассчитать ее позицию
                var FrameHAnchor = ( FramePr.HAnchor === undefined ? c_oAscHAnchor.Margin : FramePr.HAnchor );
                var FrameVAnchor = ( FramePr.VAnchor === undefined ? c_oAscVAnchor.Text : FramePr.VAnchor );

                // Рассчитаем положение по горизонтали
                var FrameX = 0;
                if (undefined != FramePr.XAlign || undefined === FramePr.X)
                {
                    var XAlign = c_oAscXAlign.Left;
                    if (undefined != FramePr.XAlign)
                        XAlign = FramePr.XAlign;

                    switch (FrameHAnchor)
                    {
                        case c_oAscHAnchor.Page   :
                        {
                            switch (XAlign)
                            {
                                case c_oAscXAlign.Inside  :
                                case c_oAscXAlign.Outside :
                                case c_oAscXAlign.Left    :
                                    FrameX = Page_Field_L - FrameW;
                                    break;
                                case c_oAscXAlign.Right   :
                                    FrameX = Page_Field_R;
                                    break;
                                case c_oAscXAlign.Center  :
                                    FrameX = (Page_W - FrameW) / 2;
                                    break;
                            }

                            break;
                        }
                        case c_oAscHAnchor.Text   :
                        case c_oAscHAnchor.Margin :
                        {
                            switch (XAlign)
                            {
                                case c_oAscXAlign.Inside  :
                                case c_oAscXAlign.Outside :
                                case c_oAscXAlign.Left    :
                                    FrameX = Page_Field_L;
                                    break;
                                case c_oAscXAlign.Right   :
                                    FrameX = Page_Field_R - FrameW;
                                    break;
                                case c_oAscXAlign.Center  :
                                    FrameX = (Page_Field_R + Page_Field_L - FrameW) / 2;
                                    break;
                            }

                            break;
                        }
                    }

                }
                else
                {
                    switch (FrameHAnchor)
                    {
                        case c_oAscHAnchor.Page   :
                            FrameX = FramePr.X;
                            break;
                        case c_oAscHAnchor.Text   :
                        case c_oAscHAnchor.Margin :
                            FrameX = Page_Field_L + FramePr.X;
                            break;
                    }
                }

                if (FrameW + FrameX > Page_W)
                    FrameX = Page_W - FrameW;

                if (FrameX < 0)
                    FrameX = 0;

                // Рассчитаем положение по вертикали
                var FrameY = 0;
                if (undefined != FramePr.YAlign)
                {
                    var YAlign = FramePr.YAlign;
                    // Случай c_oAscYAlign.Inline не обрабатывается, потому что такие параграфы считаются Inline

                    switch (FrameVAnchor)
                    {
                        case c_oAscVAnchor.Page   :
                        {
                            switch (YAlign)
                            {
                                case c_oAscYAlign.Inside  :
                                case c_oAscYAlign.Outside :
                                case c_oAscYAlign.Top     :
                                    FrameY = 0;
                                    break;
                                case c_oAscYAlign.Bottom  :
                                    FrameY = Page_H - FrameH;
                                    break;
                                case c_oAscYAlign.Center  :
                                    FrameY = (Page_H - FrameH) / 2;
                                    break;
                            }

                            break;
                        }
                        case c_oAscVAnchor.Text   :
                        {
                            FrameY = Y;
                            break;
                        }
                        case c_oAscVAnchor.Margin :
                        {
                            switch (YAlign)
                            {
                                case c_oAscYAlign.Inside  :
                                case c_oAscYAlign.Outside :
                                case c_oAscYAlign.Top     :
                                    FrameY = Page_Field_T;
                                    break;
                                case c_oAscYAlign.Bottom  :
                                    FrameY = Page_Field_B - FrameH;
                                    break;
                                case c_oAscYAlign.Center  :
                                    FrameY = (Page_Field_B + Page_Field_T - FrameH) / 2;
                                    break;
                            }

                            break;
                        }
                    }
                }
                else
                {
                    var FramePrY = 0;
                    if (undefined != FramePr.Y)
                        FramePrY = FramePr.Y;

                    switch (FrameVAnchor)
                    {
                        case c_oAscVAnchor.Page   :
                            FrameY = FramePrY;
                            break;
                        case c_oAscVAnchor.Text   :
                            FrameY = FramePrY + Y;
                            break;
                        case c_oAscVAnchor.Margin :
                            FrameY = FramePrY + Page_Field_T;
                            break;
                    }
                }

                if (FrameH + FrameY > Page_H)
                    FrameY = Page_H - FrameH;

                // TODO: Пересмотреть, почему эти погрешности возникают
                // Избавляемся от погрешности
                FrameY += 0.001;
                FrameH -= 0.002;

                if (FrameY < 0)
                    FrameY = 0;

                var FrameBounds = this.Content[Index].Get_FrameBounds(FrameX, FrameY, FrameW, FrameH);
                var FrameX2     = FrameBounds.X, FrameY2 = FrameBounds.Y, FrameW2 = FrameBounds.W, FrameH2 = FrameBounds.H;

                if ((FrameY2 + FrameH2 > YLimit || Y > YLimit - 0.001 ) && Index != StartIndex)
                {
                    this.RecalcInfo.Set_FrameRecalc(true);
                    this.Content[Index].Start_FromNewPage();
                    RecalcResult = recalcresult_NextPage;
                }
                else
                {
                    this.RecalcInfo.Set_FrameRecalc(false);
                    for (var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++)
                    {
                        var TempElement = this.Content[TempIndex];
                        TempElement.Shift(TempElement.Pages.length - 1, FrameX, FrameY);
                        TempElement.Set_CalculatedFrame(FrameX, FrameY, FrameW, FrameH, FrameX2, FrameY2, FrameW2, FrameH2, PageIndex);
                    }

                    var FrameDx = ( undefined === FramePr.HSpace ? 0 : FramePr.HSpace );
                    var FrameDy = ( undefined === FramePr.VSpace ? 0 : FramePr.VSpace );

                    this.DrawingObjects.addFloatTable(new CFlowParagraph(Element, FrameX2, FrameY2, FrameW2, FrameH2, FrameDx, FrameDy, Index, FlowCount, FramePr.Wrap));

                    Index += FlowCount - 1;

                    if (FrameY >= Y)
                        RecalcResult = recalcresult_NextElement;
                    else
                    {
                        this.RecalcInfo.Set_FlowObject(Element, FlowCount, recalcresult_NextElement, FlowCount);
                        RecalcResult = recalcresult_CurPage;
                    }
                }
            }
            else if (true === this.RecalcInfo.Check_FlowObject(Element))
            {
                Index += this.RecalcInfo.FlowObjectPage - 1;
                this.RecalcInfo.Reset();
                RecalcResult = recalcresult_NextElement;
            }
            else
            {
                // Пропускаем
                RecalcResult = recalcresult_NextElement;
            }
        }
        else
        {
            if (( 0 === Index && 0 === PageIndex ) || Index != StartIndex)
            {
                Element.Set_DocumentIndex(Index);
                Element.Reset(X, Y, XLimit, YLimit, PageIndex, 0, 1);
            }

            var ElementPageIndex = this.private_GetElementPageIndex(Index, PageIndex, 0, 1);
            RecalcResult         = Element.Recalculate_Page(ElementPageIndex);
        }

        Element.TurnOn_RecalcEvent();

        if (true != bFlow)
        {
            var ElementPageIndex = this.private_GetElementPageIndex(Index, PageIndex, 0, 1);
            Y                    = Element.Get_PageBounds(ElementPageIndex).Bottom;
        }

        if (RecalcResult & recalcresult_CurPage)
        {
            return this.Recalculate_Page(PageIndex, false);
        }
        else if (RecalcResult & recalcresult_NextElement)
        {
            // Ничего не делаем
        }
        else if (RecalcResult & recalcresult_NextPage)
        {
            this.Pages[PageIndex].EndPos = Index;
            Result                       = recalcresult2_NextPage;
            break;
        }
    }

    this.Pages[PageIndex].Bounds.Left   = X;
    this.Pages[PageIndex].Bounds.Top    = StartY;
    this.Pages[PageIndex].Bounds.Right  = XLimit;
    this.Pages[PageIndex].Bounds.Bottom = Y;

    if (Index >= Count)
    {
        this.Pages[PageIndex].EndPos = Count - 1;
        if (undefined != this.Parent.OnEndRecalculate_Page)
            this.Parent.OnEndRecalculate_Page(true);
    }
    else
    {
        if (undefined != this.Parent.OnEndRecalculate_Page)
            this.Parent.OnEndRecalculate_Page(false);
    }
    return Result;
};
CDocumentContent.prototype.Recalculate_MinMaxContentWidth = function(isRotated)
{
    var Min   = 0;
    var Max   = 0;
    var Count = this.Content.length;

    if (true === isRotated)
    {
        for (var Pos = 0; Pos < Count; ++Pos)
        {
            var Element   = this.Content[Pos];
            var CurMinMax = Element.Recalculate_MinMaxContentWidth(isRotated);

            Min += CurMinMax.Min;
            Max += CurMinMax.Max;
        }
    }
    else
    {
        for (var Pos = 0; Pos < Count; Pos++)
        {
            var Element   = this.Content[Pos];
            var CurMinMax = Element.Recalculate_MinMaxContentWidth(isRotated);

            if (Min < CurMinMax.Min)
                Min = CurMinMax.Min;

            if (Max < CurMinMax.Max)
                Max = CurMinMax.Max;
        }
    }

    return {Min : Min, Max : Max};
};
CDocumentContent.prototype.Recalculate_AllTables          = function()
{
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        if (type_Table === Item.GetType())
            Item.Recalculate_AllTables();
    }
};
CDocumentContent.prototype.Save_RecalculateObject         = function()
{
    var RecalcObj = new CDocumentRecalculateObject();
    RecalcObj.Save(this);
    return RecalcObj;
};
CDocumentContent.prototype.Load_RecalculateObject         = function(RecalcObj)
{
    RecalcObj.Load(this);
};
CDocumentContent.prototype.Prepare_RecalculateObject      = function()
{
    this.ClipInfo = [];
    this.Pages    = [];
    var Count     = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        this.Content[Index].Prepare_RecalculateObject();
    }
};
CDocumentContent.prototype.ReDraw                         = function(StartPage, EndPage)
{
    if ("undefined" === typeof(StartPage))
        StartPage = this.Get_StartPage_Absolute();
    if ("undefined" === typeof(EndPage))
        EndPage = StartPage + this.Pages.length - 1;

    this.Parent.OnContentReDraw(StartPage, EndPage);
};
CDocumentContent.prototype.OnContentRecalculate           = function(bNeedRecalc, PageNum, DocumentIndex)
{
    if (false === bNeedRecalc)
    {
        this.Parent.OnContentRecalculate(false, false);
    }
    else
    {
        // Ставим номер +1, потому что текущий элемент уже рассчитан
        this.Recalculate(false, DocumentIndex + 1);
    }
};
CDocumentContent.prototype.OnContentReDraw                = function(StartPage, EndPage)
{
    this.Parent.OnContentReDraw(StartPage, EndPage);
};
CDocumentContent.prototype.Draw                           = function(nPageIndex, pGraphics)
{
    var CurPage = nPageIndex - this.StartPage;
    if (CurPage < 0 || CurPage >= this.Pages.length)
        return;

    if (pGraphics.Start_Command)
    {
        pGraphics.Start_Command(AscFormat.DRAW_COMMAND_CONTENT);
    }

    var ClipInfo = this.ClipInfo[CurPage];
    if (ClipInfo)
    {
        // TODO: При клипе, как правило, обрезается сверху и снизу по 1px, поэтому введем небольшую коррекцию
        var Correction = 0;
        if (null !== this.DrawingDocument)
            Correction = this.DrawingDocument.GetMMPerDot(1);

        var Bounds = this.Pages[CurPage].Bounds;
        pGraphics.SaveGrState();
        pGraphics.AddClipRect(ClipInfo.X0, Bounds.Top - Correction, Math.abs(ClipInfo.X1 - ClipInfo.X0), Bounds.Bottom - Bounds.Top + Correction);
    }

    var Page_StartPos = this.Pages[CurPage].Pos;
    var Page_EndPos   = this.Pages[CurPage].EndPos;
    for (var Index = Page_StartPos; Index <= Page_EndPos; Index++)
    {
        var ElementPageIndex = this.private_GetElementPageIndex(Index, CurPage, 0, 1);
        this.Content[Index].Draw(ElementPageIndex, pGraphics);
    }

    if (this.LogicDocument)
        this.LogicDocument.DrawingObjects.drawWrappingObjectsInContent(this.Get_AbsolutePage(CurPage), pGraphics, this);

    if (ClipInfo)
    {
        pGraphics.RestoreGrState();
    }

    if (pGraphics.End_Command)
    {
        pGraphics.End_Command();
    }
};
// Составляем полный массив всех ParaDrawing используемых в данном классе (с учетом всех вложенных DocumentContent)
CDocumentContent.prototype.Get_AllDrawingObjects          = function(DrawingObjs)
{
    if (undefined === DrawingObjs)
        DrawingObjs = [];

    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        Item.Get_AllDrawingObjects(DrawingObjs);
    }

    return DrawingObjs;
};
CDocumentContent.prototype.Get_AllComments                = function(AllComments)
{
    if (undefined === AllComments)
        AllComments = [];

    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        Item.Get_AllComments(AllComments);
    }

    return AllComments;
};
CDocumentContent.prototype.Get_AllMaths                   = function(AllMaths)
{
    if (undefined === AllMaths)
        AllMaths = [];

    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];
        Item.Get_AllMaths(AllMaths);
    }

    return AllMaths;
};
CDocumentContent.prototype.Get_AllFloatElements           = function(FloatObjs)
{
    if (undefined === FloatObjs)
        FloatObjs = [];

    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++)
    {
        var Item = this.Content[Pos];

        if (true !== Item.Is_Inline())
            FloatObjs.push(Item);

        if (type_Table === Item.GetType())
            Item.Get_AllFloatElements(FloatObjs);
    }

    return FloatObjs;
};
CDocumentContent.prototype.Shift                          = function(PageIndex, Dx, Dy)
{
    this.Pages[PageIndex].Shift(Dx, Dy);

    if (this.ClipInfo[PageIndex])
    {
        this.ClipInfo[PageIndex].X0 += Dx;
        this.ClipInfo[PageIndex].X1 += Dx;
    }

    var StartPos = this.Pages[PageIndex].Pos;
    var EndPos   = this.Pages[PageIndex].EndPos;
    for (var Index = StartPos; Index <= EndPos; Index++)
    {
        var Element          = this.Content[Index];
        var ElementPageIndex = 0;
        if (StartPos === Index)
            ElementPageIndex = PageIndex - Element.Get_StartPage_Relative();

        Element.Shift(ElementPageIndex, Dx, Dy);
    }
};
CDocumentContent.prototype.Update_EndInfo                 = function()
{
    for (var Index = 0, Count = this.Content.length; Index < Count; Index++)
    {
        this.Content[Index].Update_EndInfo();
    }
};
CDocumentContent.prototype.RecalculateCurPos              = function()
{
    if (docpostype_Content === this.CurPos.Type)
    {
        if (this.CurPos.ContentPos >= 0 && undefined != this.Content[this.CurPos.ContentPos])
        {
            this.Internal_CheckCurPage();

            if (this.CurPage > 0 && true === this.Parent.Is_HdrFtr(false))
            {
                this.CurPage = 0;
                this.DrawingDocument.TargetEnd();
            }
            else
                return this.Content[this.CurPos.ContentPos].RecalculateCurPos();
        }
    }
    else // if ( docpostype_DrawingObjects === this.CurPos.Type )
    {
        return this.LogicDocument.DrawingObjects.recalculateCurPos();
    }

    return null;
};
CDocumentContent.prototype.Get_PageBounds                 = function(PageNum, Height, bForceCheckDrawings)
{
    if (this.Pages.length <= 0)
        return {Top : 0, Left : 0, Right : 0, Bottom : 0};

    if (PageNum < 0 || PageNum > this.Pages.length)
        return this.Pages[0].Bounds;

    var Bounds     = this.Pages[PageNum].Bounds;
    var PageNumAbs = PageNum + this.Get_StartPage_Absolute();

    // В колонтитуле не учитывается.
    if (true != this.Is_HdrFtr(false) || true === bForceCheckDrawings)
    {
        // Учитываем все Drawing-объекты с обтеканием. Объекты без обтекания (над и под текстом) учитываем только в
        // случае, когда начальная точка (левый верхний угол) попадает в this.Y + Height

        var AllDrawingObjects = this.Get_AllDrawingObjects();
        var Count             = AllDrawingObjects.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Obj = AllDrawingObjects[Index];
            if (PageNumAbs === Obj.Get_PageNum())
            {
                var ObjBounds = Obj.Get_Bounds();
                if (true === Obj.Use_TextWrap())
                {
                    if (ObjBounds.Bottom > Bounds.Bottom)
                        Bounds.Bottom = ObjBounds.Bottom;
                }
                else if (undefined !== Height && ObjBounds.Top < this.Y + Height)
                {
                    if (ObjBounds.Bottom >= this.Y + Height)
                        Bounds.Bottom = this.Y + Height;
                    else if (ObjBounds.Bottom > Bounds.Bottom)
                        Bounds.Bottom = ObjBounds.Bottom;
                }
            }
        }

        // Кроме этого пробежимся по всем Flow-таблицам и учтем их границы
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            var Element = this.Content[Index];
            if (type_Table === Element.GetType() && true != Element.Is_Inline() && Element.Pages.length > PageNum - Element.PageNum && PageNum - Element.PageNum >= 0)
            {
                var TableBounds = Element.Get_PageBounds(PageNum - Element.PageNum);
                if (TableBounds.Bottom > Bounds.Bottom)
                    Bounds.Bottom = TableBounds.Bottom;
            }
        }
    }

    return Bounds;
};
CDocumentContent.prototype.Get_PagesCount                 = function()
{
    return this.Pages.length;
};
CDocumentContent.prototype.Get_SummaryHeight              = function()
{
    var Height = 0;
    for (var Page = 0; Page < this.Get_PagesCount(); Page++)
    {
        var Bounds = this.Get_PageBounds(Page);
        Height += Bounds.Bottom - Bounds.Top;
    }

    return Height;
};
CDocumentContent.prototype.Get_FirstParagraph             = function()
{
    if (type_Paragraph == this.Content[0].GetType())
        return this.Content[0];
    else if (type_Table == this.Content[0].GetType())
        return this.Content[0].Get_FirstParagraph();

    return null;
};
CDocumentContent.prototype.Get_AllParagraphs              = function(Props, ParaArray)
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.Get_AllParagraphs(Props, ParaArray);
    }
};
// Специальная функция, используемая в колонтитулах для добавления номера страницы
// При этом удаляются все параграфы. Добавляются два новых
CDocumentContent.prototype.HdrFtr_AddPageNum             = function(Align, StyleId)
{
    this.Selection_Remove();

    this.CurPos =
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

    // Добавляем 2 новых параграфа
    var Para1 = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, this.bPresentation === true);
    var Para2 = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, this.bPresentation === true);

    this.Internal_Content_Add(0, Para1);
    this.Internal_Content_Add(1, Para2);

    Para1.Set_DocumentPrev(null);
    Para1.Set_DocumentNext(Para2);
    Para2.Set_DocumentPrev(Para1);
    Para2.Set_DocumentNext(null);

    Para1.Style_Add(StyleId);
    Para2.Style_Add(StyleId);

    Para1.Set_Align(Align, false);
    var Run = new ParaRun(Para1, false);
    Run.Add_ToContent(0, new ParaPageNum());
    Para1.Add_ToContent(0, Run);

    this.Recalculate();
};
CDocumentContent.prototype.Clear_Content                 = function()
{
    this.Selection_Remove();

    this.CurPos =
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

    // Добавляем новый параграф
    var Para = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, this.bPresentation === true);
    this.Internal_Content_Add(0, Para);
};
CDocumentContent.prototype.Add_Content                   = function(OtherContent)
{
    if ("object" != typeof(OtherContent) || 0 >= OtherContent.Content.length || true === OtherContent.Is_Empty())
        return;

    // TODO : улучшить добавление элементов здесь (чтобы добавлялось не поэлементно)
    if (true === this.Is_Empty())
    {
        this.Internal_Content_RemoveAll();
        for (var Index = 0; Index < OtherContent.Content.length; Index++)
            this.Internal_Content_Add(Index, OtherContent.Content[Index]);
    }
    else
    {
        this.Content[this.Content.length - 1].Set_DocumentNext(OtherContent.Content[0]);
        OtherContent.Content[0].Set_DocumentPrev(this.Content[this.Content.length - 1]);

        for (var Index = 0; Index < OtherContent.Content.length; Index++)
        {
            this.Internal_Content_Add(this.Content.length, OtherContent.Content[Index]);
        }
    }
};
CDocumentContent.prototype.Is_Empty                      = function()
{
    if (this.Content.length > 1 || type_Table === this.Content[0].GetType())
        return false;

    return this.Content[0].IsEmpty();
};
CDocumentContent.prototype.Is_CurrentElementTable        = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.isCurrentElementTable();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        return true;
    }
    return false;
};
CDocumentContent.prototype.Is_CurrentElementParagraph    = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.isCurrentElementParagraph();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        return false;
    }

    return true;
};
CDocumentContent.prototype.Get_CurrentParagraph          = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getCurrentParagraph();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        var Pos = true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos;
        if (Pos < 0 || Pos >= this.Content.length)
            return null;

        if (type_Paragraph === this.Content[Pos].Get_Type())
            return this.Content[Pos];
        else if (type_Table === this.Content[Pos].Get_Type())
            return this.Content[Pos].Get_CurrentParagraph();
    }

    return null;
};
// Проверяем есть ли хоть какой-либо контент на первой странице
CDocumentContent.prototype.Is_ContentOnFirstPage         = function()
{
    var Element = this.Content[0];
    return Element.Is_ContentOnFirstPage();
};
CDocumentContent.prototype.Start_FromNewPage             = function()
{
    this.Pages.length = 1;
    this.Pages[0]     = new CDocumentPage();

    var Element = this.Content[0];
    Element.Start_FromNewPage();
};
CDocumentContent.prototype.Get_ParentTextTransform       = function()
{
    if (this.Parent)
    {
        return this.Parent.Get_ParentTextTransform();
    }
    return null;
};
CDocumentContent.prototype.Is_TableBorder                = function(X, Y, CurPage)
{
    CurPage = Math.max(0, Math.min(this.Pages.length - 1, CurPage));

    var ElementPos = this.Internal_GetContentPosByXY(X, Y, CurPage);
    var Element    = this.Content[ElementPos];
    if (type_Table === Element.GetType())
    {
        var ElementPageIndex = this.private_GetElementPageIndex(ElementPos, CurPage, 0, 1);
        return Element.Is_TableBorder(X, Y, ElementPageIndex);
    }

    return null;
};
CDocumentContent.prototype.Is_InText                     = function(X, Y, CurPage)
{
    if (CurPage < 0 || CurPage >= this.Pages.length)
        CurPage = 0;

    var ContentPos       = this.Internal_GetContentPosByXY(X, Y, CurPage);
    var Item             = this.Content[ContentPos];
    var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, CurPage);
    return Item.Is_InText(X, Y, ElementPageIndex);
};
// Проверяем, попали ли мы в автофигуру данного DocumentContent
CDocumentContent.prototype.Is_InDrawing                  = function(X, Y, CurPage)
{
    if (-1 != this.DrawingObjects.isPointInDrawingObjects(X, Y, this.Get_AbsolutePage(CurPage), this))
    {
        return true;
    }
    else
    {
        if (CurPage < 0 || CurPage >= this.Pages.length)
            CurPage = 0;

        var ContentPos = this.Internal_GetContentPosByXY(X, Y, CurPage);
        var Item       = this.Content[ContentPos];
        if (type_Table == Item.GetType())
        {
            var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, CurPage);
            return Item.Is_InDrawing(X, Y, ElementPageIndex);
        }

        return false;
    }
};
CDocumentContent.prototype.Get_CurrentPage_Absolute      = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getCurrentPageAbsolute();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        var Pos = ( true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos );
        if (Pos >= 0 && Pos < this.Content.length)
            return this.Content[Pos].Get_CurrentPage_Absolute();
    }

    return 0;
};
CDocumentContent.prototype.DocumentStatistics            = function(Stats)
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.DocumentStatistics(Stats);
    }
};
CDocumentContent.prototype.Document_CreateFontMap        = function(FontMap)
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.Document_CreateFontMap(FontMap);
    }
};
CDocumentContent.prototype.Document_CreateFontCharMap    = function(FontCharMap)
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.Document_CreateFontCharMap(FontCharMap);
    }
};
CDocumentContent.prototype.Document_Get_AllFontNames     = function(AllFonts)
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.Document_Get_AllFontNames(AllFonts);
    }
};
CDocumentContent.prototype.Document_UpdateInterfaceState = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        var drawin_objects = this.LogicDocument.DrawingObjects;
        if (drawin_objects.selection.textSelection
            || drawin_objects.selection.groupSelection && drawin_objects.selection.groupSelection.selection.textSelection
            || drawin_objects.selection.chartSelection && drawin_objects.selection.chartSelection.selection.textSelection)
        {
            this.LogicDocument.Interface_Update_DrawingPr();
            drawin_objects.documentUpdateInterfaceState();
        }
        else
        {
            drawin_objects.documentUpdateInterfaceState();
            this.LogicDocument.Interface_Update_DrawingPr();
        }
        return;
    }
    else //if (docpostype_Content === this.CurPos.Type)
    {
        if (( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ))
        {
            this.Interface_Update_TablePr();
            if (true == this.Selection.Use)
                this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
            else
                this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
        }
        else
        {
            this.Interface_Update_ParaPr();
            this.Interface_Update_TextPr();

            // Если у нас в выделении находится 1 параграф, или курсор находится в параграфе
            if (( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Paragraph == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Paragraph == this.Content[this.CurPos.ContentPos].GetType() ))
            {
                if (true == this.Selection.Use)
                    this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                else
                    this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
            }
        }
    }
};
CDocumentContent.prototype.Document_UpdateRulersState    = function(CurPage)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.LogicDocument.DrawingObjects.documentUpdateRulersState(CurPage);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            if (this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType())
            {
                var ElementPos       = this.Selection.StartPos;
                var Element          = this.Content[ElementPos];
                var ElementPageIndex = this.private_GetElementPageIndex(ElementPos, this.CurPage, Element.Get_StartColumn(), Element.Get_ColumnsCount());
                Element.Document_UpdateRulersState(ElementPageIndex);
            }
            else
            {
                var StartPos = ( this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos );
                var EndPos   = ( this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.StartPos : this.Selection.EndPos );

                var FramePr = undefined;

                for (var Pos = StartPos; Pos <= EndPos; Pos++)
                {
                    var Element = this.Content[Pos];
                    if (type_Paragraph != Element.GetType())
                    {
                        FramePr = undefined;
                        break;
                    }
                    else
                    {
                        var TempFramePr = Element.Get_FramePr();
                        if (undefined === FramePr)
                        {
                            if (undefined === TempFramePr)
                                break;

                            FramePr = TempFramePr;
                        }
                        else if (undefined === TempFramePr || false === FramePr.Compare(TempFramePr))
                        {
                            FramePr = undefined;
                            break;
                        }
                    }
                }

                if (undefined !== FramePr)
                    this.Content[StartPos].Document_UpdateRulersState();
            }
        }
        else
        {
            var ElementPos       = this.CurPos.ContentPos;
            var Element          = this.Content[ElementPos];
            var ElementPageIndex = this.private_GetElementPageIndex(ElementPos, this.CurPage, Element.Get_StartColumn(), Element.Get_ColumnsCount());
            Element.Document_UpdateRulersState(ElementPageIndex);
        }
    }
};
CDocumentContent.prototype.Can_CopyCut                   = function()
{
    var bCanCopyCut = false;

    var LogicDocument  = null;
    var DrawingObjects = null;

    // Работаем с колонтитулом
    if (docpostype_DrawingObjects === this.CurPos.Type)
        DrawingObjects = this.DrawingObjects;
    else
        LogicDocument = this;

    if (null !== DrawingObjects)
    {
        if (true === DrawingObjects.isSelectedText())
            LogicDocument = DrawingObjects.getTargetDocContent();
        else
            bCanCopyCut = true;
    }

    if (null !== LogicDocument)
    {
        if (true === LogicDocument.Is_SelectionUse())
        {
            if (selectionflag_Numbering === LogicDocument.Selection.Flag)
                bCanCopyCut = false;
            else if (LogicDocument.Selection.StartPos !== LogicDocument.Selection.EndPos || type_Paragraph === LogicDocument.Content[LogicDocument.Selection.StartPos].Get_Type())
                bCanCopyCut = true;
            else
                bCanCopyCut = LogicDocument.Content[LogicDocument.Selection.StartPos].Can_CopyCut();
        }
    }

    return bCanCopyCut;
};
CDocumentContent.prototype.Cursor_MoveToStartPos         = function(AddToSelect)
{
    if (true === AddToSelect)
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
        {
            // TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
            //       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
            //       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
        }
        else if (docpostype_Content === this.CurPos.Type)
        {
            var StartPos = ( true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos )
            var EndPos   = 0;

            this.Selection.Start    = false;
            this.Selection.Use      = true;
            this.Selection.StartPos = StartPos;
            this.Selection.EndPos   = EndPos;
            this.Selection.Flag     = selectionflag_Common;

            this.CurPos.ContentPos = 0;
            this.CurPos.Type       = docpostype_Content;

            for (var Index = StartPos - 1; Index >= EndPos; Index--)
            {
                var Item           = this.Content[Index];
                Item.Selection.Use = true;
                var ItemType       = Item.GetType();

                if (type_Paragraph === ItemType)
                {
                    Item.Selection.Set_EndPos(Item.Internal_GetStartPos(), -1);
                    Item.Selection.Set_StartPos(Item.Content.length - 1, -1);
                }
                else //if ( type_Table === ItemType )
                {
                    var Row  = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos0 = {Row : 0, Cell : 0};
                    var Pos1 = {Row : Row, Cell : Cell};

                    Item.Selection.EndPos.Pos   = Pos0;
                    Item.Selection.StartPos.Pos = Pos1;
                    Item.Internal_Selection_UpdateCells();
                }
            }

            this.Content[StartPos].Cursor_MoveToStartPos(true);
        }
    }
    else
    {
        this.Selection_Remove();

        this.Selection.Start    = false;
        this.Selection.Use      = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos   = 0;
        this.Selection.Flag     = selectionflag_Common;

        this.CurPos.ContentPos = 0;
        this.CurPos.Type       = docpostype_Content;
        this.Content[0].Cursor_MoveToStartPos(false);
    }
};
CDocumentContent.prototype.Cursor_MoveToEndPos           = function(AddToSelect)
{
    if (true === AddToSelect)
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
        {
            // TODO: Пока ничего не делаем, в дальнейшем надо будет делать в зависимости от селекта внутри
            //       автофигуры: если селект текста внутри, то делать для текста внутри, а если выделена
            //       сама автофигура, тогда мы перемещаем курсор влево от нее в контенте параграфа и выделяем все до конца
        }
        else if (docpostype_Content === this.CurPos.Type)
        {
            var StartPos = ( true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos )
            var EndPos   = this.Content.length - 1;

            this.Selection.Start    = false;
            this.Selection.Use      = true;
            this.Selection.StartPos = StartPos;
            this.Selection.EndPos   = EndPos;
            this.Selection.Flag     = selectionflag_Common;

            this.CurPos.ContentPos = this.Content.length - 1;
            this.CurPos.Type       = docpostype_Content;

            for (var Index = StartPos + 1; Index <= EndPos; Index++)
            {
                var Item           = this.Content[Index];
                Item.Selection.Use = true;
                var ItemType       = Item.GetType();

                if (type_Paragraph === ItemType)
                {
                    Item.Selection.Set_StartPos(Item.Internal_GetStartPos(), -1);
                    Item.Selection.Set_EndPos(Item.Content.length - 1, -1);
                }
                else //if ( type_Table === ItemType )
                {
                    var Row  = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos0 = {Row : 0, Cell : 0};
                    var Pos1 = {Row : Row, Cell : Cell};

                    Item.Selection.StartPos.Pos = Pos0;
                    Item.Selection.EndPos.Pos   = Pos1;
                    Item.Internal_Selection_UpdateCells();
                }
            }

            this.Content[StartPos].Cursor_MoveToEndPos(true);
        }
    }
    else
    {
        this.Selection_Remove();

        this.Selection.Start    = false;
        this.Selection.Use      = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos   = 0;
        this.Selection.Flag     = selectionflag_Common;

        this.CurPos.ContentPos = this.Content.length - 1;
        this.CurPos.Type       = docpostype_Content;
        this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false);
    }
};
CDocumentContent.prototype.Cursor_MoveUp_To_LastRow      = function(X, Y, AddToSelect)
{
    // Такого не должно быть
    if (true === AddToSelect)
        return;

    this.Set_CurPosXY(X, Y);
    this.CurPos.ContentPos = this.Content.length - 1;
    this.Content[this.CurPos.ContentPos].Cursor_MoveUp_To_LastRow(X, Y, false);
};
CDocumentContent.prototype.Cursor_MoveDown_To_FirstRow   = function(X, Y, AddToSelect)
{
    // Такого не должно быть
    if (true === AddToSelect)
        return;

    this.Set_CurPosXY(X, Y);
    this.CurPos.ContentPos = 0;
    this.Content[this.CurPos.ContentPos].Cursor_MoveDown_To_FirstRow(X, Y, false);
};
CDocumentContent.prototype.Cursor_MoveToCell             = function(bNext)
{
    if (true === this.ApplyToAll)
    {
        if (1 === this.Content.length && type_Table === this.Content[0].GetType())
            this.Content[0].Cursor_MoveToCell(bNext);
    }
    else
    {
        if (docpostype_DrawingObjects == this.CurPos.Type)
        {
            this.LogicDocument.DrawingObjects.cursorMoveToCell(bNext);
        }
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if (true === this.Selection.Use)
            {
                if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType())
                    this.Content[this.Selection.StartPos].Cursor_MoveToCell(bNext);
            }
            else
            {
                if (type_Table === this.Content[this.CurPos.ContentPos].GetType())
                    this.Content[this.CurPos.ContentPos].Cursor_MoveToCell(bNext);
            }
        }
    }
};
CDocumentContent.prototype.Set_ClipInfo                  = function(CurPage, X0, X1)
{
    this.ClipInfo[CurPage] = {X0 : X0, X1 : X1};
};
CDocumentContent.prototype.Set_ApplyToAll                = function(bValue)
{
    this.ApplyToAll = bValue;
};
CDocumentContent.prototype.Get_ApplyToAll                = function()
{
    return this.ApplyToAll;
};
CDocumentContent.prototype.Update_CursorType             = function(X, Y, CurPage)
{
    if (CurPage < 0 || CurPage >= this.Pages.length)
        return this.DrawingDocument.SetCursorType("default", new AscCommon.CMouseMoveData());

    var bInText      = (null === this.Is_InText(X, Y, CurPage) ? false : true);
    var bTableBorder = (null === this.Is_TableBorder(X, Y, CurPage) ? false : true);

    // Ничего не делаем
    if (this.Parent instanceof CHeaderFooter && true === this.LogicDocument.DrawingObjects.updateCursorType(this.Get_AbsolutePage(CurPage), X, Y, {}, ( true === bInText || true === bTableBorder ? true : false )))
        return;

    var ContentPos       = this.Internal_GetContentPosByXY(X, Y, CurPage);
    var Item             = this.Content[ContentPos];
    var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, CurPage);
    Item.Update_CursorType(X, Y, ElementPageIndex);
};
//-----------------------------------------------------------------------------------
// Функции для работы с контентом
//-----------------------------------------------------------------------------------
// Аналог функции Document.Add_NewParagraph
CDocumentContent.prototype.Add_NewParagraph = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.addNewParagraph();
    }
    else //if ( docpostype_Content == this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        // Сначала удаляем заселекченую часть
        if (true === this.Selection.Use)
        {
            this.Remove(1, true);
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
        if (type_Paragraph == Item.GetType())
        {
            // Если текущий параграф пустой и с нумерацией, тогда удаляем нумерацию и отступы левый и первой строки
            if (undefined != Item.Numbering_Get() && true === Item.IsEmpty({SkipNewLine : true}) && true === Item.Cursor_IsStart())
            {
                Item.Numbering_Remove();
                Item.Set_Ind({FirstLine : undefined, Left : undefined, Right : Item.Pr.Ind.Right}, true);
            }
            else
            {
                var ItemReviewType = Item.Get_ReviewType();
                // Создаем новый параграф
                var NewParagraph   = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);

                // Проверим позицию в текущем параграфе
                if (true === Item.Cursor_IsEnd())
                {
                    var StyleId = Item.Style_Get();
                    var NextId  = undefined;

                    if (undefined != StyleId)
                    {
                        var Styles = this.Parent.Get_Styles();
                        NextId     = Styles.Get_Next(StyleId);

                        if (null === NextId)
                            NextId = StyleId;
                    }


                    if (StyleId === NextId)
                    {
                        // Продолжаем (в плане настроек) новый параграф
                        Item.Continue(NewParagraph);
                    }
                    else
                    {
                        // Простое добавление стиля, без дополнительных действий
                        if (NextId === this.Get_Styles().Get_Default_Paragraph())
                            NewParagraph.Style_Remove();
                        else
                            NewParagraph.Style_Add(NextId, true);
                    }
                }
                else
                    Item.Split(NewParagraph);

                this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                this.CurPos.ContentPos++;

                // Отмечаем, что последний измененный элемент - предыдущий параграф
                this.ContentLastChangePos = this.CurPos.ContentPos - 1;

                if (true === this.Is_TrackRevisions())
                {
                    NewParagraph.Remove_PrChange();
                    NewParagraph.Set_ReviewType(ItemReviewType);
                    Item.Set_ReviewType(reviewtype_Add);
                }
                else if (reviewtype_Common !== ItemReviewType)
                {
                    NewParagraph.Set_ReviewType(ItemReviewType);
                    Item.Set_ReviewType(reviewtype_Common);
                }
            }
            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
        {
            // Если мы находимся в начале первого параграфа первой ячейки, и
            // данная таблица - первый элемент, тогда добавляем параграф до таблицы.

            if (0 === this.CurPos.ContentPos && Item.Cursor_IsStart(true))
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);
                this.Internal_Content_Add(0, NewParagraph);

                this.CurPos.ContentPos = 0;
                this.Recalculate();
            }
            else
                Item.Add_NewParagraph();
        }
    }
};
// Расширяем документ до точки (X,Y) с помощью новых параграфов
// Y0 - низ последнего параграфа, YLimit - предел страницы
CDocumentContent.prototype.Extend_ToPos                       = function(X, Y)
{
    var LastPara  = this.Content[this.Content.length - 1];
    var LastPara2 = LastPara;

    History.Create_NewPoint(AscDFH.historydescription_Document_DocumentContentExtendToPos);
    History.Set_Additional_ExtendDocumentToPos();

    while (true)
    {
        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);

        var StyleId = LastPara.Style_Get();
        var NextId  = undefined;

        if (undefined != StyleId)
        {
            NextId = this.Styles.Get_Next(StyleId);

            if (null === NextId || undefined === NextId)
                NextId = StyleId;
        }

        // Простое добавление стиля, без дополнительных действий
        if (NextId === this.Styles.Get_Default_Paragraph())
            NewParagraph.Style_Remove();
        else
            NewParagraph.Style_Add(NextId, true);

        if (undefined != LastPara.TextPr.Value.FontSize || undefined !== LastPara.TextPr.Value.RFonts.Ascii)
        {
            var TextPr        = new CTextPr();
            TextPr.FontSize   = LastPara.TextPr.Value.FontSize;
            TextPr.FontSizeCS = LastPara.TextPr.Value.FontSize;
            TextPr.RFonts     = LastPara.TextPr.Value.RFonts.Copy();
            NewParagraph.Select_All();
            NewParagraph.Apply_TextPr(TextPr);
        }

        LastPara.Set_DocumentNext(NewParagraph);

        NewParagraph.Set_DocumentPrev(LastPara);
        NewParagraph.Set_DocumentIndex(LastPara.Index + 1);

        var CurPage = LastPara.Pages.length - 1;
        var X0      = LastPara.Pages[CurPage].X;
        var Y0      = LastPara.Pages[CurPage].Bounds.Bottom;
        var XLimit  = LastPara.Pages[CurPage].XLimit;
        var YLimit  = LastPara.Pages[CurPage].YLimit;
        var PageNum = LastPara.PageNum;

        NewParagraph.Reset(X0, Y0, XLimit, YLimit, PageNum);
        var RecalcResult = NewParagraph.Recalculate_Page(PageNum);

        if (!(RecalcResult & recalcresult_NextElement))
        {
            LastPara.Next = null;
            break;
        }

        this.Internal_Content_Add(this.Content.length, NewParagraph);

        if (NewParagraph.Pages[0].Bounds.Bottom > Y)
            break;

        LastPara = NewParagraph;
    }

    LastPara = this.Content[this.Content.length - 1];

    if (LastPara != LastPara2 || false === this.LogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_None, {
            Type      : AscCommon.changestype_2_Element_and_Type,
            Element   : LastPara,
            CheckType : AscCommon.changestype_Paragraph_Content
        }))
    {
        // Теперь нам нужно вставить таб по X
        LastPara.Extend_ToPos(X);
    }

    LastPara.Cursor_MoveToEndPos();
    LastPara.Document_SetThisElementCurrent(true);

    this.LogicDocument.Recalculate();
};
CDocumentContent.prototype.Add_InlineImage                    = function(W, H, Img, Chart, bFlow)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.addInlineImage(W, H, Img, Chart, bFlow);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true == this.Selection.Use)
            this.Remove(1, true);

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            var Drawing;
            if (!AscCommon.isRealObject(Chart))
            {
                Drawing   = new ParaDrawing(W, H, null, this.DrawingDocument, this, null);
                var Image = this.DrawingObjects.createImage(Img, 0, 0, W, H);
                Image.setParent(Drawing);
                Drawing.Set_GraphicObject(Image);
            }
            else
            {
                Drawing   = new ParaDrawing(W, H, null, this.DrawingDocument, this, null);
                var Image = this.DrawingObjects.getChartSpace2(Chart, null);
                Image.setParent(Drawing);
                Drawing.Set_GraphicObject(Image);
                Drawing.setExtent(Image.spPr.xfrm.extX, Image.spPr.xfrm.extY);
            }
            if (true === bFlow)
            {
                Drawing.Set_DrawingType(drawing_Anchor);
                Drawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                Drawing.Set_BehindDoc(false);
                Drawing.Set_Distance(3.2, 0, 3.2, 0);
                Drawing.Set_PositionH(Asc.c_oAscRelativeFromH.Column, false, 0, false);
                Drawing.Set_PositionV(Asc.c_oAscRelativeFromV.Paragraph, false, 0, false);
            }
            this.Paragraph_Add(Drawing);
            this.Select_DrawingObject(Drawing.Get_Id());
        }
        else if (type_Table == Item.GetType())
        {
            Item.Add_InlineImage(W, H, Img, Chart, bFlow);
        }
    }
};
CDocumentContent.prototype.Add_OleObject                    = function(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.addOleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true == this.Selection.Use)
            this.Remove(1, true);

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            var Drawing   = new ParaDrawing(W, H, null, this.DrawingDocument, this, null);
            var Image = this.DrawingObjects.createOleObject(Data, sApplicationId, Img, 0, 0, W, H, nWidthPix, nHeightPix);
            Image.setParent(Drawing);
            Drawing.Set_GraphicObject(Image);

            this.Paragraph_Add(Drawing);
            this.Select_DrawingObject(Drawing.Get_Id());
        }
        else if (type_Table == Item.GetType())
        {
            Item.Add_OleObject(W, H, nWidthPix, nHeightPix, Img, Data, sApplicationId);
        }
    }
};
CDocumentContent.prototype.Add_TextArt                        = function(nStyle)
{
    if (docpostype_DrawingObjects !== this.CurPos.Type)
    {

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            var Drawing = new ParaDrawing(1828800 / 36000, 1828800 / 36000, null, this.DrawingDocument, this, null);
            var TextArt = this.DrawingObjects.createTextArt(nStyle, true);
            TextArt.setParent(Drawing);
            Drawing.Set_GraphicObject(TextArt);
            Drawing.Set_DrawingType(drawing_Anchor);
            Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
            Drawing.Set_BehindDoc(false);
            Drawing.Set_Distance(3.2, 0, 3.2, 0);
            Drawing.Set_PositionH(Asc.c_oAscRelativeFromH.Column, false, 0, false);
            Drawing.Set_PositionV(Asc.c_oAscRelativeFromV.Paragraph, false, 0, false);
            if (true == this.Selection.Use)
                this.Remove(1, true);
            this.Paragraph_Add(Drawing);
            if (TextArt.bSelectedText)
            {
                this.Select_DrawingObject(Drawing.Get_Id());
            }
            else
            {
                var oContent = Drawing.GraphicObj.getDocContent();
                oContent.Content[0].Document_SetThisElementCurrent(false);
                this.LogicDocument.Select_All();
            }
        }
        else if (type_Table == Item.GetType())
        {
            Item.Add_TextArt(nStyle);
        }
    }
};
CDocumentContent.prototype.Edit_Chart                         = function(Chart)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.editChart(Chart);
    }
};
CDocumentContent.prototype.Add_InlineTable                    = function(Cols, Rows)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.addInlineTable(Cols, Rows);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true == this.Selection.Use)
            this.Remove(1, true);

        // Добавляем таблицу
        var Item = this.Content[this.CurPos.ContentPos];

        // Если мы внутри параграфа, тогда разрываем его и на месте разрыва добавляем таблицу.
        // А если мы внутри таблицы, тогда добавляем таблицу внутрь текущей таблицы.
        switch (Item.GetType())
        {
            case type_Paragraph:
            {
                // Создаем новую таблицу
                var W = 0;
                if (true === this.Is_TableCellContent())
                    W = this.XLimit - this.X;
                else
                    W = ( this.XLimit - this.X + 2 * 1.9 );

                W = Math.max(W, Cols * 2 * 1.9);

                var Grid = [];

                for (var Index = 0; Index < Cols; Index++)
                    Grid[Index] = W / Cols;

                var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, this.X, this.YLimit, Rows, Cols, Grid);
                NewTable.Set_ParagraphPrOnAdd(Item);

                // Проверим позицию в текущем параграфе
                if (true === Item.Cursor_IsEnd())
                {
                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                    this.CurPos.ContentPos++;
                    this.Recalculate();
                }
                else
                {
                    // Создаем новый параграф
                    var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);
                    Item.Split(NewParagraph);

                    // Добавляем новый параграф
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);

                    // Выставляем курсор в начало таблицы
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);

                    this.CurPos.ContentPos++;

                    this.Recalculate();
                }

                break;
            }

            case type_Table:
            {
                Item.Add_InlineTable(Cols, Rows);
                break;
            }
        }
    }
};
CDocumentContent.prototype.Paragraph_Add                      = function(ParaItem, bRecalculate)
{
    if (true === this.ApplyToAll)
    {
        if (para_TextPr === ParaItem.Type)
        {
            for (var Index = 0; Index < this.Content.length; Index++)
            {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                Item.Add(ParaItem);
                Item.Set_ApplyToAll(false);
            }
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.paragraphAdd(ParaItem, bRecalculate);
    }
    else // if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            var Type = ParaItem.Get_Type();
            switch (Type)
            {
                case para_Math:
                case para_NewLine:
                case para_Text:
                case para_Space:
                case para_Tab:
                case para_PageNum:
                {
                    // Если у нас что-то заселекчено и мы вводим текст или пробел
                    // и т.д., тогда сначала удаляем весь селект.
                    this.Remove(1, true, false, true);
                    break;
                }
                case para_TextPr:
                {
                    switch (this.Selection.Flag)
                    {
                        case selectionflag_Common:
                        {
                            // Текстовые настройки применяем ко всем параграфам, попавшим
                            // в селект.
                            var StartPos = this.Selection.StartPos;
                            var EndPos   = this.Selection.EndPos;
                            if (EndPos < StartPos)
                            {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos   = Temp;
                            }

                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                this.Content[Index].Add(ParaItem.Copy());
                            }

                            if (false != bRecalculate)
                            {
                                // Если в TextPr только HighLight, тогда не надо ничего пересчитывать, только перерисовываем
                                if (true === ParaItem.Value.Check_NeedRecalc())
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
                                    this.ReDraw(StartPage, EndPage);
                                }
                            }

                            break;
                        }
                        case selectionflag_Numbering:
                        {
                            // Текстовые настройки применяем к конкретной нумерации
                            if (null == this.Selection.Data || this.Selection.Data.length <= 0)
                                break;

                            if (undefined != ParaItem.Value.FontFamily)
                            {
                                var FName  = ParaItem.Value.FontFamily.Name;
                                var FIndex = ParaItem.Value.FontFamily.Index;

                                ParaItem.Value.RFonts          = new CRFonts();
                                ParaItem.Value.RFonts.Ascii    = {Name : FName, Index : FIndex};
                                ParaItem.Value.RFonts.EastAsia = {Name : FName, Index : FIndex};
                                ParaItem.Value.RFonts.HAnsi    = {Name : FName, Index : FIndex};
                                ParaItem.Value.RFonts.CS       = {Name : FName, Index : FIndex};
                            }

                            var NumPr    = this.Content[this.Selection.Data[0]].Numbering_Get();
                            var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                            AbstrNum.Apply_TextPr(NumPr.Lvl, ParaItem.Value);

                            if (false != bRecalculate)
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

        var Item     = this.Content[this.CurPos.ContentPos];
        var ItemType = Item.GetType();

        if (para_NewLine === ParaItem.Type && true === ParaItem.Is_PageOrColumnBreak())
        {
            if (type_Paragraph === ItemType)
            {
                if (true === Item.Cursor_IsStart())
                {
                    this.Add_NewParagraph();
                    this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                    this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                }
                else
                {
                    this.Add_NewParagraph();
                    this.Add_NewParagraph();
                    this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                    this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos - 2;
                }

                if (false != bRecalculate)
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
            Item.Add(ParaItem);

            if (false != bRecalculate)
            {
                if (para_TextPr === ParaItem.Type && false === ParaItem.Value.Check_NeedRecalc())
                {
                    // Просто перерисовываем нужные страницы
                    var StartPage = Item.Get_StartPage_Absolute();
                    var EndPage   = StartPage + Item.Pages.length - 1;
                    this.ReDraw(StartPage, EndPage);
                }
                else
                    this.Recalculate();

                if (type_Paragraph === ItemType)
                {
                    Item.RecalculateCurPos();
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }
        }
    }
};
CDocumentContent.prototype.Paragraph_ClearFormatting          = function()
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Table === Item.GetType())
                Item.Paragraph_ClearFormatting();
            else if (type_Paragraph === Item.GetType())
            {
                Item.Clear_Formatting();
                Item.Clear_TextFormatting();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects == this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.paragraphClearFormatting();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            if (selectionflag_Common === this.Selection.Flag)
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if (StartPos > EndPos)
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    var Item = this.Content[Index];
                    if (type_Table === Item.GetType())
                        Item.Paragraph_ClearFormatting();
                    else if (type_Paragraph === Item.GetType())
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
            if (type_Table === Item.GetType())
                Item.Paragraph_ClearFormatting();
            else if (type_Paragraph === Item.GetType())
            {
                Item.Clear_Formatting();
                Item.Clear_TextFormatting();
                this.Recalculate();
            }
        }
    }
};
CDocumentContent.prototype.Remove                             = function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
{
    if (true === this.ApplyToAll)
    {
        this.Internal_Content_RemoveAll();
        this.Internal_Content_Add(0, new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit, this.bPresentation === true));

        this.CurPos =
        {
            X          : 0,
            Y          : 0,
            ContentPos : 0, // в зависимости, от параметра Type: озиция в Document.Content
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

        return;
    }

    if (undefined === bRemoveOnlySelection)
        bRemoveOnlySelection = false;

    if (undefined === bOnTextAdd)
        bOnTextAdd = false;

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.remove(Count, bOnlyText, bRemoveOnlySelection);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        this.Remove_NumberingSelection();

        // Если в документе что-то заселекчено, тогда удаляем селект
        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            // Проверим, пустой ли селект в конечном элементе (для случая, когда конечный элемент параграф, и в нем
            // не заселекчен знак конца параграфа)
            if (StartPos !== EndPos && true === this.Content[EndPos].Selection_IsEmpty(true))
                EndPos--;

            if (true === this.Is_TrackRevisions())
            {
                // Если есть параграфы, которые были добавлены во время рецензирования, тогда мы их удаляем
                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    this.Content[Index].Remove(1, true);
                }

                this.Selection_Remove();
                for (var Index = EndPos - 1; Index >= StartPos; Index--)
                {
                    if (type_Paragraph === this.Content[Index].GetType() && reviewtype_Add === this.Content[Index].Get_ReviewType())
                    {
                        // Если параграф пустой, тогда удаляем параграф, если не пустой, тогда объединяем его со
                        // следующим параграф. Если следующий элемент таблица, тогда ничего не делаем.
                        if (this.Content[Index].Is_Empty())
                        {
                            this.Internal_Content_Remove(Index, 1);
                        }
                        else if (Index < this.Content.length - 1 && type_Paragraph === this.Content[Index + 1].GetType())
                        {
                            // Соединяем текущий и предыдущий параграфы
                            this.Content[Index].Concat(this.Content[Index + 1]);
                            this.Internal_Content_Remove(Index + 1, 1);
                        }
                    }
                    else
                    {
                        this.Content[Index].Set_ReviewType(reviewtype_Remove);
                    }
                }

                this.CurPos.ContentPos = StartPos;
            }
            else
            {
                // Убираем селект
                this.Selection_Clear();
                this.Selection.Use = false;

                if (StartPos != EndPos)
                {
                    var StartType = this.Content[StartPos].GetType();
                    var EndType   = this.Content[EndPos].GetType();

                    var bStartEmpty, bEndEmpty;

                    if (type_Paragraph == StartType)
                    {
                        // Удаляем выделенную часть параграфа
                        this.Content[StartPos].Remove(1, true);
                        bStartEmpty = this.Content[StartPos].IsEmpty()
                    }
                    else if (type_Table == StartType)
                    {
                        // Нам нужно удалить все выделенные строки в таблице
                        bStartEmpty = !(this.Content[StartPos].Row_Remove2());
                    }

                    if (type_Paragraph == EndType)
                    {
                        // Удаляем выделенную часть параграфа
                        this.Content[EndPos].Remove(1, true);
                        bEndEmpty = this.Content[EndPos].IsEmpty()
                    }
                    else if (type_Table == EndType)
                    {
                        // Нам нужно удалить все выделенные строки в таблице
                        bEndEmpty = !(this.Content[EndPos].Row_Remove2());
                    }

                    if (true != bStartEmpty && true != bEndEmpty)
                    {
                        // Удаляем весь промежуточный контент
                        this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
                        this.CurPos.ContentPos = StartPos;

                        if (type_Paragraph == StartType && type_Paragraph == EndType && true === bOnTextAdd)
                        {
                            // Встаем в конец параграфа и удаляем 1 элемент (чтобы соединить параграфы)
                            this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                            this.Remove(1, true);
                        }
                        else
                        {
                            if (true === bOnTextAdd && type_Table === this.Content[StartPos + 1].Get_Type() && type_Table === this.Content[StartPos].Get_Type())
                            {
                                this.Internal_Content_Add(StartPos + 1, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            }
                            else if (true === bOnTextAdd && type_Table === this.Content[StartPos + 1].Get_Type())
                            {
                                this.CurPos.ContentPos = StartPos;
                                this.Content[StartPos].Cursor_MoveToEndPos(false, false);
                            }
                            else
                            {
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            }
                        }
                    }
                    else if (true != bStartEmpty)
                    {
                        if (true === bOnTextAdd && type_Table === StartType)
                        {
                            // Удаляем весь промежуточный контент и конечный элемент, если это
                            // таблица, поскольку таблица не может быть последним элементом в документе удаляем без проверок.
                            if (EndType === type_Table)
                                this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);
                            else
                                this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);

                            if (type_Table === this.Content[StartPos + 1].Get_Type() && true === bOnTextAdd)
                                this.Internal_Content_Add(StartPos + 1, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));

                            // Встаем в начало параграфа
                            this.CurPos.ContentPos = StartPos + 1;
                            this.Content[StartPos + 1].Cursor_MoveToStartPos();
                        }
                        else
                        {
                            // Удаляем весь промежуточный контент и последний параграф
                            this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);

                            if (type_Paragraph == StartType)
                            {
                                // Встаем в конец параграфа
                                this.CurPos.ContentPos                   = StartPos;
                                this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                            }
                            else if (type_Table == StartType)
                            {
                                // У нас обязательно есть элемент после таблицы (либо снова таблица, либо параграф)
                                // Встаем в начало следующего элемента.
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            }
                        }
                    }
                    else if (true != bEndEmpty)
                    {
                        // Удаляем весь промежуточный контент и начальный параграф
                        this.Internal_Content_Remove(StartPos, EndPos - StartPos);

                        if (type_Table === this.Content[StartPos].Get_Type() && true === bOnTextAdd)
                            this.Internal_Content_Add(StartPos, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));

                        // Встаем в начало параграфа
                        this.CurPos.ContentPos = StartPos;
                        this.Content[StartPos].Cursor_MoveToStartPos();
                    }
                    else
                    {
                        if (true === bOnTextAdd)
                        {
                            // Удаляем весь промежуточный контент, начальный элемент и конечный элемент, если это
                            // таблица, поскольку таблица не может быть последним элементом в документе удаляем без проверок.
                            if (EndType === type_Table && bOnTextAdd)
                                this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
                            else
                                this.Internal_Content_Remove(StartPos, EndPos - StartPos);

                            if (type_Table === this.Content[StartPos].Get_Type() && true === bOnTextAdd)
                                this.Internal_Content_Add(StartPos, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));

                            this.CurPos.ContentPos = StartPos;
                            this.Content[StartPos].Cursor_MoveToStartPos();
                        }
                        else
                        {
                            // Удаляем весь промежуточный контент, начальный и конечный параграфы
                            // При таком удалении надо убедиться, что в документе останется хотя бы один элемент
                            if (0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length)
                            {
                                var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, this.XLimit, this.YLimit, this.bPresentation === true);
                                this.Internal_Content_Add(0, NewPara);
                                this.Internal_Content_Remove(1, this.Content.length - 1);
                            }
                            else
                                this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);

                            // Выставляем текущую позицию
                            if (StartPos >= this.Content.length)
                            {
                                // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                                this.CurPos.ContentPos                                 = this.Content.length - 1;
                                this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                            }
                            else
                            {
                                this.CurPos.ContentPos = StartPos;
                                this.Content[StartPos].Cursor_MoveToStartPos();
                            }
                        }
                    }
                }
                else
                {
                    this.CurPos.ContentPos = StartPos;
                    if (Count < 0 && type_Table === this.Content[StartPos].GetType() && table_Selection_Cell === this.Content[StartPos].Selection.Type && true != bOnTextAdd)
                    {
                        this.Table_RemoveRow();
                    }
                    else if (false === this.Content[StartPos].Remove(Count, true, bRemoveOnlySelection, bOnTextAdd))
                    {
                        // При добавлении текста, параграф не объединяется
                        if (true != bOnTextAdd)
                        {
                            // В ворде параграфы объединяются только когда у них все настройки совпадают.
                            // (почему то при изменении и обратном изменении настроек параграфы перестают объединятся)
                            // Пока у нас параграфы будут объединяться всегда и настройки будут браться из первого
                            // параграфа, кроме случая, когда первый параграф полностью удаляется.

                            if (true === this.Content[StartPos].IsEmpty() && this.Content.length > 1)
                            {
                                this.Internal_Content_Remove(StartPos, 1);

                                // Выставляем текущую позицию
                                if (StartPos >= this.Content.length)
                                {
                                    // Документ не должен заканчиваться таблицей, поэтому здесь проверку не делаем
                                    this.CurPos.ContentPos                                 = this.Content.length - 1;
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
                            else if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1])
                            {
                                // Соединяем текущий и предыдущий параграфы
                                this.Content[StartPos].Concat(this.Content[StartPos + 1]);
                                this.Internal_Content_Remove(StartPos + 1, 1);
                            }
                            else if (this.Content.length === 1 && true === this.Content[0].IsEmpty() && Count > 0)
                            {
                                var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);
                                this.Internal_Content_Add(0, NewPara);
                                this.Internal_Content_Remove(1, this.Content.length - 1);
                            }
                        }
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
            if (true === bRemoveOnlySelection || true === bOnTextAdd)
                return;

            if (type_Paragraph == this.Content[this.CurPos.ContentPos].GetType())
            {
                var bNumbering = ( undefined != this.Content[this.CurPos.ContentPos].Numbering_Get() ? true : false );
                if (false === this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText))
                {
                    if (Count < 0)
                    {
                        if (this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType())
                        {
                            if (true === this.Is_TrackRevisions())
                            {
                                this.Content[this.CurPos.ContentPos - 1].Set_ReviewType(reviewtype_Remove);
                                this.CurPos.ContentPos--;
                                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                            }
                            else
                            {
                                if (true === this.Content[this.CurPos.ContentPos - 1].IsEmpty())
                                {
                                    // Просто удаляем предыдущий параграф
                                    this.Internal_Content_Remove(this.CurPos.ContentPos - 1, 1);
                                    this.CurPos.ContentPos--;
                                    this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                }
                                else
                                {
                                    // Соединяем текущий и предыдущий параграфы
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];

                                    // Смещаемся в конец до объединения параграфов, чтобы курсор стоял в месте
                                    // соединения.
                                    Prev.Cursor_MoveToEndPos();

                                    Prev.Concat(this.Content[this.CurPos.ContentPos]);
                                    this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                    this.CurPos.ContentPos--;
                                }
                            }
                        }
                    }
                    else if (Count > 0)
                    {
                        if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType())
                        {
                            if (true === this.Is_TrackRevisions())
                            {
                                this.Content[this.CurPos.ContentPos].Set_ReviewType(reviewtype_Remove);
                                this.CurPos.ContentPos++;
                                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                            }
                            else
                            {
                                if (true === this.Content[this.CurPos.ContentPos].IsEmpty())
                                {
                                    // Просто удаляем текущий параграф
                                    this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                    this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                }
                                else
                                {
                                    // Соединяем текущий и предыдущий параграфы
                                    var Cur = this.Content[this.CurPos.ContentPos];
                                    Cur.Concat(this.Content[this.CurPos.ContentPos + 1]);
                                    this.Internal_Content_Remove(this.CurPos.ContentPos + 1, 1);
                                }
                            }
                        }
                        else if (true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Table != this.Content[this.CurPos.ContentPos - 1].GetType())
                        {
                            // Если данный параграф пустой, последний, не единственный и идущий перед
                            // ним элемент не таблица, удаляем его
                            this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                            this.CurPos.ContentPos--;
                        }
                    }

                    // Нам нужно пересчитать все изменения, начиная с текущего элемента
                    this.ContentLastChangePos = this.CurPos.ContentPos;

                    this.Recalculate();
                }
                else
                {
                    if (true === bNumbering && undefined == this.Content[this.CurPos.ContentPos].Numbering_Get())
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
                if (type_Paragraph == Item.GetType())
                {
                    Item.CurPos.RealX = Item.CurPos.X;
                    Item.CurPos.RealY = Item.CurPos.Y;
                }
            }
            else if (type_Table == this.Content[this.CurPos.ContentPos].GetType())
            {
                // Remove сам вызывет команду Recalculate
                this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText);
            }
        }
    }
};
CDocumentContent.prototype.Cursor_GetPos                      = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorGetPos();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            if (selectionflag_Common === this.Selection.Flag)
            {
                return this.Content[this.Selection.EndPos].Cursor_GetPos();
            }

            return {X : 0, Y : 0};
        }
        else
        {
            return this.Content[this.CurPos.ContentPos].Cursor_GetPos();
        }
    }
};
CDocumentContent.prototype.Cursor_MoveLeft                    = function(AddToSelect, Word)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        var ReturnValue = true;

        this.Remove_NumberingSelection();
        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                // Добавляем к селекту
                if (false === this.Content[this.Selection.EndPos].Cursor_MoveLeft(1, true, Word))
                {
                    // Нужно перейти в конец предыдущего элемента
                    if (0 != this.Selection.EndPos)
                    {
                        this.Selection.EndPos--;
                        this.CurPos.ContentPos = this.Selection.EndPos;

                        var Item = this.Content[this.Selection.EndPos];
                        if (type_Paragraph == Item.GetType())
                        {
                            Item.Cursor_MoveToEndPos(true, true);
                            Item.Cursor_MoveLeft(1, true, Word);
                        }
                        else if (type_Table == Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var LastRow = Item.Content[Item.Content.length - 1];

                                // Нам нужно выделить последний ряд таблицы
                                Item.Selection.Use          = true;
                                Item.Selection.Type         = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = {
                                    Row  : LastRow.Index,
                                    Cell : LastRow.Get_CellsCount() - 1
                                };
                                Item.Selection.EndPos.Pos   = {Row : LastRow.Index, Cell : 0};
                                Item.CurCell                = LastRow.Get_Cell(0);
                                Item.Selection.Data         = [];

                                for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++)
                                {
                                    Item.Selection.Data.push({Cell : CellIndex, Row : LastRow.Index});
                                }
                            }
                            else
                                Item.Cursor_MoveLeft(1, true, Word);
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
                if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Selection.Use)
                {
                    // Такая ситуация возможна только при прямом селекте (сверху вниз), поэтому вычитаем
                    this.Selection.EndPos--;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                // Нам нужно переместить курсор в левый край селекта, и отменить весь селект
                var Start = this.Selection.StartPos;
                if (Start > this.Selection.EndPos)
                    Start = this.Selection.EndPos;

                this.CurPos.ContentPos = Start;
                this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word);

                this.Selection_Remove();
            }
        }
        else
        {
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, true, Word))
                {
                    // Нужно перейти в конец предыдущего элемент
                    if (0 != this.CurPos.ContentPos)
                    {
                        this.CurPos.ContentPos--;
                        var Item              = this.Content[this.CurPos.ContentPos];
                        this.Selection.EndPos = this.CurPos.ContentPos;

                        if (type_Paragraph == Item.GetType())
                        {
                            Item.Cursor_MoveToEndPos(true);
                            Item.Cursor_MoveLeft(1, true, Word);
                        }
                        else if (type_Table == Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var LastRow = Item.Content[Item.Content.length - 1];

                                // Нам нужно выделить последний ряд таблицы
                                Item.Selection.Use          = true;
                                Item.Selection.Type         = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = {
                                    Row  : LastRow.Index,
                                    Cell : LastRow.Get_CellsCount() - 1
                                };
                                Item.Selection.EndPos.Pos   = {Row : LastRow.Index, Cell : 0};
                                Item.CurCell                = LastRow.Get_Cell(0);
                                Item.Selection.Data         = [];

                                for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++)
                                {
                                    Item.Selection.Data.push({Cell : CellIndex, Row : LastRow.Index});
                                }
                            }
                            else
                                Item.Cursor_MoveLeft(1, true, Word);
                        }

                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word))
                {
                    // Нужно перейти в конец предыдущего элемент
                    if (0 != this.CurPos.ContentPos)
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
    }
};
CDocumentContent.prototype.Cursor_MoveRight                   = function(AddToSelect, Word, FromPaste)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveRight(AddToSelect, Word);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        var ReturnValue = true;

        this.Remove_NumberingSelection();
        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                // Добавляем к селекту
                if (false === this.Content[this.Selection.EndPos].Cursor_MoveRight(1, true, Word))
                {
                    // Нужно перейти в конец предыдущего элемента
                    if (this.Content.length - 1 != this.Selection.EndPos)
                    {
                        this.Selection.EndPos++;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                        var Item               = this.Content[this.Selection.EndPos];

                        if (type_Paragraph === Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var StartPos            = Item.Internal_GetStartPos();
                                Item.CurPos.ContentPos  = StartPos;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = StartPos;
                                Item.Selection.EndPos   = StartPos;
                            }
                            Item.Cursor_MoveRight(1, true, Word);
                        }
                        else if (type_Table === Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var FirstRow = Item.Content[0];

                                // Нам нужно выделить первый ряд таблицы
                                Item.Selection.Use          = true;
                                Item.Selection.Type         = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = {Row : 0, Cell : 0};
                                Item.Selection.EndPos.Pos   = {Row : 0, Cell : FirstRow.Get_CellsCount() - 1};
                                Item.CurCell                = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                Item.Selection.Data         = [];

                                for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++)
                                {
                                    Item.Selection.Data.push({Cell : CellIndex, Row : 0});
                                }
                            }
                            else
                                Item.Cursor_MoveRight(1, true, Word);
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
                if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse())
                {
                    // Такая ситуация возможна только при обратном селекте (снизу вверх), поэтому вычитаем
                    this.Selection.EndPos++;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                // Нам нужно переместить курсор в правый край селекта, и отменить весь селект
                var End = this.Selection.EndPos;
                if (End < this.Selection.StartPos)
                    End = this.Selection.StartPos;


                this.CurPos.ContentPos = End;

                if (true === FromPaste && type_Table === this.Content[this.CurPos.ContentPos].Get_Type() && true === this.Content[this.CurPos.ContentPos].Selection_IsToEnd() && this.Content.length - 1 !== this.CurPos.ContentPos)
                {
                    this.CurPos.ContentPos = End + 1;
                    this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos(false);
                    this.Selection_Remove();
                }
                else
                {
                    this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word, FromPaste);
                    this.Selection_Remove();
                }
            }
        }
        else
        {
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, true, Word))
                {
                    // Нужно перейти в конец предыдущего элемента
                    if (this.Content.length - 1 != this.CurPos.ContentPos)
                    {
                        this.CurPos.ContentPos++;
                        var Item              = this.Content[this.CurPos.ContentPos];
                        this.Selection.EndPos = this.CurPos.ContentPos;

                        if (type_Paragraph === Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var StartPos            = Item.Internal_GetStartPos();
                                Item.CurPos.ContentPos  = StartPos;
                                Item.Selection.Use      = true;
                                Item.Selection.StartPos = StartPos;
                                Item.Selection.EndPos   = StartPos;
                            }

                            Item.Cursor_MoveRight(1, true, Word);
                        }
                        else if (type_Table === Item.GetType())
                        {
                            if (false === Item.Is_SelectionUse())
                            {
                                var FirstRow = Item.Content[0];

                                // Нам нужно выделить первый ряд таблицы
                                Item.Selection.Use          = true;
                                Item.Selection.Type         = table_Selection_Cell;
                                Item.Selection.StartPos.Pos = {Row : 0, Cell : 0};
                                Item.Selection.EndPos.Pos   = {Row : 0, Cell : FirstRow.Get_CellsCount() - 1};
                                Item.CurCell                = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                Item.Selection.Data         = [];

                                for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++)
                                {
                                    Item.Selection.Data.push({Cell : CellIndex, Row : 0});
                                }
                            }
                            else
                                Item.Cursor_MoveRight(1, true, Word);
                        }
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word))
                {
                    // Нужно перейти в начало следующего элемента
                    if (this.Content.length - 1 != this.CurPos.ContentPos)
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
    }
};
CDocumentContent.prototype.Cursor_MoveUp                      = function(AddToSelect)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveUp(AddToSelect);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        var ReturnValue = true;

        this.Remove_NumberingSelection();
        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                // Добавляем к селекту
                var Item = this.Content[this.Selection.EndPos];
                if (false === Item.Cursor_MoveUp(1, true))
                {
                    if (0 != this.Selection.EndPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos--;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // Мы должны переместиться на строку выше, чем начало селекта
                var Start = this.Selection.StartPos;
                if (Start > this.Selection.EndPos)
                    Start = this.Selection.EndPos;

                this.CurPos.ContentPos = Start;

                var Item = this.Content[this.CurPos.ContentPos];
                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp(1, false))
                {
                    if (0 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
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
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if (false === Item.Cursor_MoveUp(1, true))
                {
                    if (0 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                if (false === Item.Cursor_MoveUp(1, false))
                {
                    if (0 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos--;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
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
    }
};
CDocumentContent.prototype.Cursor_MoveDown                    = function(AddToSelect)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveDown(AddToSelect);
    else if (docpostype_Content === this.CurPos.Type)
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        var ReturnValue = true;
        this.Remove_NumberingSelection();

        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                // Добавляем к селекту
                var Item = this.Content[this.Selection.EndPos];
                if (false === Item.Cursor_MoveDown(1, true))
                {
                    if (this.Content.length - 1 != this.Selection.EndPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.Selection.EndPos++;
                        Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                // Мы должны переместиться на строку ниже, чем конец селекта
                var End = this.Selection.EndPos;
                if (End < this.Selection.StartPos)
                    End = this.Selection.StartPos;

                this.CurPos.ContentPos = End;

                var Item = this.Content[this.CurPos.ContentPos];
                if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown(1, false))
                {
                    if (this.Content.length - 1 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
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
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                if (false === Item.Cursor_MoveDown(1, true))
                {
                    if (this.Content.length - 1 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                        this.Selection.EndPos = this.CurPos.ContentPos;
                    }
                    else
                    {
                        // Сообщаем родительскому классу, что надо выйти из данного элемента
                        ReturnValue = false;
                    }
                }

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                    this.Selection.Use = false;

                this.CurPos.ContentPos = this.Selection.EndPos;
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];

                if (false === Item.Cursor_MoveDown(1, AddToSelect))
                {
                    if (this.Content.length - 1 != this.CurPos.ContentPos)
                    {
                        var TempXY        = Item.Get_CurPosXY();
                        this.CurPos.RealX = TempXY.X;
                        this.CurPos.RealY = TempXY.Y;

                        this.CurPos.ContentPos++;
                        Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
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
    }
};
CDocumentContent.prototype.Cursor_MoveEndOfLine               = function(AddToSelect)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        this.Remove_NumberingSelection();
        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Pos                = ( this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos );
                this.CurPos.ContentPos = Pos;

                var Item = this.Content[Pos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                this.Selection_Remove();
            }
        }
        else
        {
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveEndOfLine(AddToSelect);
            }
        }
    }
};
CDocumentContent.prototype.Cursor_MoveStartOfLine             = function(AddToSelect)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
    else // if( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        this.Remove_NumberingSelection();
        if (true === this.Selection.Use)
        {
            if (true === AddToSelect)
            {
                var Item = this.Content[this.Selection.EndPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Pos                = ( this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos );
                this.CurPos.ContentPos = Pos;

                var Item = this.Content[Pos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                this.Selection_Remove();
            }
        }
        else
        {
            if (true === AddToSelect)
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos   = this.CurPos.ContentPos;

                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);

                // Проверяем не обнулился ли селект (т.е. ничего не заселекчено)
                if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse())
                {
                    this.Selection.Use     = false;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                }
            }
            else
            {
                var Item = this.Content[this.CurPos.ContentPos];
                Item.Cursor_MoveStartOfLine(AddToSelect);
            }
        }
    }
};
CDocumentContent.prototype.Cursor_MoveAt                      = function(X, Y, AddToSelect, bRemoveOldSelection, CurPage)
{
    if (undefined != CurPage)
        this.CurPage = CurPage;

    if (false != bRemoveOldSelection)
    {
        this.Remove_NumberingSelection();
    }

    if (true === this.Selection.Use)
    {
        if (true === AddToSelect)
        {
            this.Selection_SetEnd(X, Y, this.CurPage, true);
        }
        else
        {
            this.Selection_Remove();

            var ContentPos         = this.Internal_GetContentPosByXY(X, Y);
            this.CurPos.ContentPos = ContentPos;
            var ElementPageIndex   = this.private_GetElementPageIndexByXY(ContentPos, X, Y, this.CurPage);
            this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, ElementPageIndex);

            this.Interface_Update_ParaPr();
            this.Interface_Update_TextPr();
        }
    }
    else
    {
        if (true === AddToSelect)
        {
            this.Selection.Use                                      = true;
            this.Selection.StartPos                                 = this.CurPos.ContentPos;
            this.Content[this.CurPos.ContentPos].Selection.Use      = true;
            this.Content[this.CurPos.ContentPos].Selection.StartPos = this.Content[this.CurPos.ContentPos].CurPos.ContentPos;

            this.Selection_SetEnd(X, Y, this.CurPage);
        }
        else
        {
            var ContentPos         = this.Internal_GetContentPosByXY(X, Y);
            this.CurPos.ContentPos = ContentPos;
            var ElementPageIndex   = this.private_GetElementPageIndexByXY(ContentPos, X, Y, this.CurPage);
            this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, ElementPageIndex);

            this.Interface_Update_ParaPr();
            this.Interface_Update_TextPr();
        }
    }
};
CDocumentContent.prototype.Cursor_IsStart                     = function(bOnlyPara)
{
    if (undefined === bOnlyPara)
        bOnlyPara = false;

    if (true === bOnlyPara && true != this.Is_CurrentElementParagraph())
        return false;

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return false;
    else if (false != this.Selection.Use || 0 != this.CurPos.ContentPos)
        return false;

    var Item = this.Content[0];
    return Item.Cursor_IsStart();
};
CDocumentContent.prototype.Get_CurPosXY                       = function()
{
    return {X : this.CurPos.RealX, Y : this.CurPos.RealY};
};
CDocumentContent.prototype.Set_CurPosXY                       = function(X, Y)
{
    this.CurPos.RealX = X;
    this.CurPos.RealY = Y;
};
CDocumentContent.prototype.Is_SelectionUse                    = function()
{
    if (true == this.Selection.Use)
        return true;

    return false;
};
CDocumentContent.prototype.Is_TextSelectionUse                = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.isTextSelectionUse();

    return this.Is_SelectionUse();
};
// Возвращаем выделенный текст, если в выделении не более 1 параграфа, и там нет картинок, нумерации страниц и т.д.
CDocumentContent.prototype.Get_SelectedText                   = function(bClearText)
{
    if (true === this.ApplyToAll)
    {
        if (true === bClearText && this.Content.length <= 1)
        {
            this.Content[0].Set_ApplyToAll(true);
            var ResultText = this.Content[0].Get_SelectedText(true);
            this.Content[0].Set_ApplyToAll(false);
            return ResultText;
        }
        else if (true != bClearText)
        {
            var ResultText = "";
            var Count      = this.Content.length;
            for (var Index = 0; Index < Count; Index++)
            {
                this.Content[Index].Set_ApplyToAll(true);
                ResultText += this.Content[Index].Get_SelectedText(false);
                this.Content[Index].Set_ApplyToAll(false);
            }

            return ResultText;
        }
    }
    else
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
            return this.LogicDocument.DrawingObjects.getSelectedText(bClearText);

        // Либо у нас нет выделения, либо выделение внутри одного элемента
        if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && selectionflag_Common === this.Selection.Flag ) || false === this.Selection.Use ))
        {
            if (true === bClearText && (this.Selection.StartPos === this.Selection.EndPos || false === this.Selection.Use ))
            {
                var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
                return this.Content[Pos].Get_SelectedText(true);
            }
            else if (false === bClearText)
            {
                var StartPos = ( true == this.Selection.Use ? Math.min(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos );
                var EndPos   = ( true == this.Selection.Use ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos );

                var ResultText = "";

                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    ResultText += this.Content[Index].Get_SelectedText(false);
                }

                return ResultText;
            }
        }
    }

    return null;
};
CDocumentContent.prototype.Get_SelectedElementsInfo           = function(Info)
{
    if (true === this.ApplyToAll)
    {
        var Count = this.Content.length;
        if (Count > 1)
            Info.Set_MixedSelection();
        else if (Count === 1)
            this.Content[0].Get_SelectedElementsInfo(Info);
    }
    else
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
            this.LogicDocument.DrawingObjects.getSelectedElementsInfo(Info);
        else //if ( docpostype_Content == this.CurPos.Type )
        {
            if (selectionflag_Numbering === this.Selection.Flag)
            {
                // Текстовые настройки применяем к конкретной нумерации
                if (!(null == this.Selection.Data || this.Selection.Data.length <= 0))
                {
                    var CurPara = this.Content[this.Selection.Data[0]];
                    for (var Index = 0; Index < this.Selection.Data.length; Index++)
                    {
                        if (this.CurPos.ContentPos === this.Selection.Data[Index])
                            CurPara = this.Content[this.Selection.Data[Index]];
                    }

                    CurPara.Get_SelectedElementsInfo(Info);
                }
            }
            else
            {
                if (true === this.Selection.Use)
                {
                    if (this.Selection.StartPos != this.Selection.EndPos)
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
        }
    }
};
CDocumentContent.prototype.Get_SelectedContent                = function(SelectedContent)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.DrawingObjects.Get_SelectedContent(SelectedContent);
    else
    {
        if (true !== this.Selection.Use || this.Selection.Flag !== selectionflag_Common)
            return;

        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;
        if (StartPos > EndPos)
        {
            StartPos = this.Selection.EndPos;
            EndPos   = this.Selection.StartPos;
        }

        for (var Index = StartPos; Index <= EndPos; Index++)
        {
            this.Content[Index].Get_SelectedContent(SelectedContent);
        }
    }
};
CDocumentContent.prototype.Insert_Content                     = function(SelectedContent, NearPos)
{
    var Para        = NearPos.Paragraph;
    var ParaNearPos = Para.Get_ParaNearestPos(NearPos);
    var LastClass   = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
    if (para_Math_Run === LastClass.Type)
    {
        var MathRun        = LastClass;
        var NewMathRun     = MathRun.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
        var MathContent    = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
        var MathContentPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];
        var Element        = SelectedContent.Elements[0].Element;

        var InsertMathContent = null;
        for (var nPos = 0, nParaLen = Element.Content.length; nPos < nParaLen; nPos++)
        {
            if (para_Math === Element.Content[nPos].Type)
            {
                InsertMathContent = Element.Content[nPos];
                break;
            }
        }

        if (null !== InsertMathContent)
        {
            MathContent.Add_ToContent(MathContentPos + 1, NewMathRun);
            MathContent.Insert_MathContent(InsertMathContent.Root, MathContentPos + 1, true);
        }
    }
    else if (para_Run === LastClass.Type)
    {
        var Elements = SelectedContent.Elements;

        var Para     = NearPos.Paragraph;
        // Сначала найдем номер элемента, начиная с которого мы будем производить вставку
        var DstIndex = -1;
        var Count    = this.Content.length;
        for (var Index = 0; Index < Count; Index++)
        {
            if (this.Content[Index] === Para)
            {
                DstIndex = Index;
                break;
            }
        }

        if (-1 === DstIndex)
            return;

        var bNeedSelect = true;

        var Elements      = SelectedContent.Elements;
        var ElementsCount = Elements.length;
        var FirstElement  = SelectedContent.Elements[0];
        if (1 === ElementsCount && true !== FirstElement.SelectedAll && type_Paragraph === FirstElement.Element.GetType())
        {
            // Нам нужно в заданный параграф вставить выделенный текст
            var NewPara          = FirstElement.Element;
            var NewElementsCount = NewPara.Content.length - 1; // Последний ран с para_End не добавляем

            var NewElement = LastClass.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
            var PrevClass  = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
            var PrevPos    = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];

            PrevClass.Add_ToContent(PrevPos + 1, NewElement);

            // TODO: Заглушка для переноса автофигур и картинок. Когда разрулим ситуацию так, чтобы когда у нас
            //       в текста была выделена автофигура выделение шло для автофигур, тогда здесь можно будет убрать.
            bNeedSelect = (true === SelectedContent.MoveDrawing ? false : true);

            for (var Index = 0; Index < NewElementsCount; Index++)
            {
                var Item = NewPara.Content[Index];
                PrevClass.Add_ToContent(PrevPos + 1 + Index, Item);

                if (true === bNeedSelect)
                    Item.Select_All();
            }

            if (true === bNeedSelect)
            {
                PrevClass.Selection.Use      = true;
                PrevClass.Selection.StartPos = PrevPos + 1;
                PrevClass.Selection.EndPos   = PrevPos + 1 + NewElementsCount - 1;

                for (var Index = 0; Index < ParaNearPos.Classes.length - 2; Index++)
                {
                    var Class    = ParaNearPos.Classes[Index];
                    var ClassPos = ParaNearPos.NearPos.ContentPos.Data[Index];

                    Class.Selection.Use      = true;
                    Class.Selection.StartPos = ClassPos;
                    Class.Selection.EndPos   = ClassPos;
                }

                this.Selection.Use      = true;
                this.Selection.StartPos = DstIndex;
                this.Selection.EndPos   = DstIndex;
            }

            if (PrevClass.Correct_Content)
            {
                PrevClass.Correct_Content();
            }
        }
        else
        {
            var bConcatS   = ( type_Table === Elements[0].Element.GetType() ? false : true );
            var bConcatE   = ( type_Table === Elements[ElementsCount - 1].Element.GetType() || true === Elements[ElementsCount - 1].SelectedAll ? false : true );
            var ParaS      = Para;
            var ParaE      = Para;
            var ParaEIndex = DstIndex;

            // Нам надо разделить наш параграф в заданной позиции, если позиция в
            // начале или конце параграфа, тогда делить не надо
            Para.Cursor_MoveToNearPos(NearPos);
            Para.Selection_Remove();

            var bAddEmptyPara = false;

            if (true === Para.Cursor_IsEnd())
            {
                bConcatE = false;

                if (1 === ElementsCount && type_Paragraph === FirstElement.Element.GetType() && ( true === FirstElement.Element.Is_Empty() || true == FirstElement.SelectedAll ))
                {
                    bConcatS = false;

                    if (type_Paragraph !== this.Content[DstIndex].Get_Type() || true !== this.Content[DstIndex].Is_Empty())
                        DstIndex++;
                }
                else if (true === Elements[ElementsCount - 1].SelectedAll && true === bConcatS)
                    bAddEmptyPara = true;
            }
            else if (true === Para.Cursor_IsStart())
            {
                bConcatS = false;
            }
            else
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);
                Para.Split(NewParagraph);
                this.Internal_Content_Add(DstIndex + 1, NewParagraph);

                ParaE      = NewParagraph;
                ParaEIndex = DstIndex + 1;
            }

            if (true === bAddEmptyPara)
            {
                // Создаем новый параграф
                var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0, this.bPresentation === true);
                NewParagraph.Set_Pr(ParaS.Pr);
                NewParagraph.TextPr.Apply_TextPr(ParaS.TextPr.Value);
                this.Internal_Content_Add(DstIndex + 1, NewParagraph);
            }

            var StartIndex = 0;
            if (true === bConcatS)
            {
                // Вызываем так, чтобы выделить все внутренние элементы
                var _ParaS = Elements[0].Element;
                _ParaS.Select_All();
                var _ParaSContentLen = _ParaS.Content.length;

                // Если мы присоединяем новый параграф, то и копируем все настройки параграфа (так делает Word)
                ParaS.Concat(Elements[0].Element);
                ParaS.Set_Pr(Elements[0].Element.Pr);
                ParaS.TextPr.Clear_Style();
                ParaS.TextPr.Apply_TextPr(Elements[0].Element.TextPr.Value);

                StartIndex++;

                ParaS.Selection.Use      = true;
                ParaS.Selection.StartPos = ParaS.Content.length - _ParaSContentLen;
                ParaS.Selection.EndPos   = ParaS.Content.length - 1;
            }

            var EndIndex = ElementsCount - 1;
            if (true === bConcatE)
            {
                var _ParaE    = Elements[ElementsCount - 1].Element;
                var TempCount = _ParaE.Content.length - 1;

                _ParaE.Select_All();
                _ParaE.Concat(ParaE);
                _ParaE.Set_Pr(ParaE.Pr);

                this.Internal_Content_Add(ParaEIndex, _ParaE);
                this.Internal_Content_Remove(ParaEIndex + 1, 1);

                _ParaE.Selection.Use      = true;
                _ParaE.Selection.StartPos = 0;
                _ParaE.Selection.EndPos   = TempCount;

                EndIndex--;
            }


            for (var Index = StartIndex; Index <= EndIndex; Index++)
            {
                this.Internal_Content_Add(DstIndex + Index, Elements[Index].Element);
                this.Content[DstIndex + Index].Select_All();
            }

            this.Selection.Start    = false;
            this.Selection.Use      = true;
            this.Selection.StartPos = DstIndex;
            this.Selection.EndPos   = DstIndex + ElementsCount - 1;
        }

        if (true === bNeedSelect)
            this.Parent.Set_CurrentElement(false, this.Get_StartPage_Absolute());
        else if (null !== this.LogicDocument && docpostype_HdrFtr === this.LogicDocument.CurPos.Type)
        {
            this.Parent.Set_CurrentElement(false, this.Get_StartPage_Absolute());
            var DocContent = this;
            var HdrFtr     = this.Is_HdrFtr(true);
            if (null !== HdrFtr)
                DocContent = HdrFtr.Content;

            DocContent.CurPos.Type     = docpostype_DrawingObjects;
            DocContent.Selection.Use   = true;
            DocContent.Selection.Start = false;
        }
    }
};
CDocumentContent.prototype.Set_ParagraphAlign                 = function(Align)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_Align(Align, false);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphAlign(Align);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphAlign(Align);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                // При изменении прилегания параграфа, не надо пересчитывать остальные
                // параграфы, т.к. переносы строк не меняются
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_Align(Align, true);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphAlign(Align);
                    Item.TurnOn_RecalcEvent();
                }
            }

            this.Parent.OnContentRecalculate(false);
            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            // При изменении прилегания параграфа, не надо пересчитывать остальные
            // параграфы, т.к. переносы строк не меняются
            Item.Set_Align(Align, true);

            this.Parent.OnContentRecalculate(false);
        }
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphAlign(Align);
        }
    }
};
CDocumentContent.prototype.Set_ParagraphSpacing               = function(Spacing)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_Spacing(Spacing, false);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphSpacing(Spacing);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphSpacing(Spacing);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_Spacing(Spacing, false);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphSpacing(Spacing);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_Spacing(Spacing, false);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphSpacing(Spacing);
        }
    }
};
CDocumentContent.prototype.Set_ParagraphIndent                = function(Ind)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
            {
                var NumPr = null;
                if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != ( NumPr = Item.Numbering_Get() ))
                {
                    if (Ind.ChangeLevel > 0)
                        Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                    else
                        Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                }
                else
                {
                    Item.Set_Ind(Ind, false);
                }
            }
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphIndent(Ind);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphIndent(Ind);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                {
                    var NumPr = null;
                    if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != ( NumPr = Item.Numbering_Get() ))
                    {
                        if (Ind.ChangeLevel > 0)
                            Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                        else
                            Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                    }
                    else
                    {
                        Item.Set_Ind(Ind, false);
                    }
                }
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphIndent(Ind);
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
        if (type_Paragraph == Item.GetType())
        {
            var NumPr = null;
            if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != ( NumPr = Item.Numbering_Get() ))
            {
                if (Ind.ChangeLevel > 0)
                    Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                else
                    Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
            }
            else
            {
                Item.Set_Ind(Ind, false);
            }

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();

            this.Interface_Update_ParaPr();
        }
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphIndent(Ind);
        }
    }
};
CDocumentContent.prototype.Set_ParagraphNumbering             = function(NumInfo)
{
    if (true === this.ApplyToAll)
    {
        // TODO : реализовать
        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphNumbering(NumInfo);
    else //if ( docpostype_Content === this.CurPos.Type )
    {

        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag)
        {
            if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType())
            {
                this.Content[this.Selection.StartPos].Set_ParagraphNumbering(NumInfo);
                return true;
            }

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            if (NumInfo.SubType < 0)
            {
                // Убираем список из всех параграфов попавших в селект
                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    if (type_Paragraph == this.Content[Index].GetType())
                        this.Content[Index].Numbering_Remove();
                    else if (type_Table == this.Content[Index].GetType())
                    {
                        this.Content[Index].TurnOff_RecalcEvent();
                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                        this.Content[Index].TurnOn_RecalcEvent();
                    }
                }
            }
            else
            {
                switch (NumInfo.Type)
                {
                    case 0: // Bullet
                    {
                        if (0 === NumInfo.SubType)
                        {
                            // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список маркированный)

                            // Проверяем предыдущий элемент
                            var Prev   = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType())
                            {
                                var PrevNumPr = Prev.Numbering_Get();
                                if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet))
                                {
                                    NumId  = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                            if (null === NumId)
                            {
                                NumId  = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;

                                this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                            // а у тех которые содержали, мы уровень не меняем
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var OldNumPr = null;

                                if (type_Paragraph === this.Content[Index].GetType())
                                {
                                    if (undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ))
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        this.Content[Index].Numbering_Add(NumId, NumLvl);
                                }
                                else if (type_Table == this.Content[Index].GetType())
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
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
                            var PrevLvl  = null;
                            var PrevId   = null;
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var NumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType() && undefined != ( NumPr = this.Content[Index].Numbering_Get() ))
                                {
                                    if (null === PrevLvl)
                                        PrevLvl = NumPr.Lvl;

                                    if (null === PrevId)
                                        PrevId = NumPr.NumId;

                                    if (PrevId != NumPr.NumId)
                                        bDiffId = true;

                                    if (PrevLvl != NumPr.Lvl)
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                                else if (( type_Paragraph === this.Content[Index].GetType() && undefined === NumPr ) || type_Table === this.Content[Index].GetType())
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
                            var LvlTextPr = new CTextPr();
                            LvlTextPr.RFonts.Set_All("Times New Roman", -1);

                            switch (NumInfo.SubType)
                            {
                                case 1:
                                {
                                    LvlText = String.fromCharCode(0x00B7);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                }
                                case 2:
                                {
                                    LvlText = "o";
                                    LvlTextPr.RFonts.Set_All("Courier New", -1);
                                    break;
                                }
                                case 3:
                                {
                                    LvlText = String.fromCharCode(0x00A7);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 4:
                                {
                                    LvlText = String.fromCharCode(0x0076);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 5:
                                {
                                    LvlText = String.fromCharCode(0x00D8);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 6:
                                {
                                    LvlText = String.fromCharCode(0x00FC);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 7:
                                {
                                    LvlText = String.fromCharCode(0x00A8);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);

                                    break;
                                }
                            }

                            var NumId = null;
                            if (true === bDiffLvl)
                            {
                                NumId           = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);
                            }
                            else if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Bullet))
                            {
                                NumId           = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                            }
                            else
                            {
                                NumId              = this.Numbering.Create_AbstractNum();
                                var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                var NewAbstractNum = this.Numbering.Get_AbstractNum(NumId);

                                NewAbstractNum.Copy(OldAbstractNum);
                                NewAbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем 0,
                            // а у тех которые содержали, мы уровень не меняем
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType())
                                {
                                    if (undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ))
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        this.Content[Index].Numbering_Add(NumId, 0);
                                }
                                else if (type_Table == this.Content[Index].GetType())
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }

                        break;
                    }
                    case 1: // Numbered
                    {
                        if (0 === NumInfo.SubType)
                        {
                            // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                            // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                            // есть список, и этот список нумерованный)

                            // Проверяем предыдущий элемент
                            var Prev   = this.Content[StartPos - 1];
                            var NumId  = null;
                            var NumLvl = 0;

                            if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType())
                            {
                                var PrevNumPr = Prev.Numbering_Get();
                                if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal))
                                {
                                    NumId  = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }
                            }

                            // Предыдущий параграф не содержит списка, либо список не того формата
                            // создаем новую нумерацию (стандартную маркированный список)
                            if (null === NumId)
                            {
                                // Посмотрим на следующий параграф, возможно у него есть нумерованный список.
                                var Next = this.Content[StartPos + 1];
                                if (StartPos === EndPos && undefined !== Next && null !== Next && type_Paragraph === Next.GetType())
                                {
                                    var NextNumPr = Next.Numbering_Get();
                                    if (undefined !== NextNumPr && true === this.Numbering.Check_Format(NextNumPr.NumId, NextNumPr.Lvl, numbering_numfmt_Decimal))
                                    {
                                        NumId  = NextNumPr.NumId;
                                        NumLvl = NextNumPr.Lvl;
                                    }
                                }

                                if (null === NumId)
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;

                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                                }
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем NumLvl,
                            // а у тех которые содержали, мы уровень не меняем
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var OldNumPr = null;

                                if (type_Paragraph === this.Content[Index].GetType())
                                {
                                    if (undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ))
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        this.Content[Index].Numbering_Add(NumId, NumLvl);
                                }
                                else if (type_Table === this.Content[Index].GetType())
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
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
                            var PrevLvl  = null;
                            var PrevId   = null;
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var NumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType() && undefined != ( NumPr = this.Content[Index].Numbering_Get() ))
                                {
                                    if (null === PrevLvl)
                                        PrevLvl = NumPr.Lvl;

                                    if (null === PrevId)
                                        PrevId = NumPr.NumId;

                                    if (PrevId != NumPr.NumId)
                                        bDiffId = true;

                                    if (PrevLvl != NumPr.Lvl)
                                    {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                                else if (( type_Paragraph === this.Content[Index].GetType() && undefined === NumPr ) || type_Table === this.Content[Index].GetType())
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
                            if (true === bDiffLvl)
                            {
                                NumId       = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = 0;
                            }
                            else if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Decimal))
                            {
                                NumId       = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = PrevLvl;
                            }
                            else
                            {
                                NumId              = this.Numbering.Create_AbstractNum();
                                var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                AbstractNum        = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Copy(OldAbstractNum);
                                ChangeLvl = PrevLvl;
                            }

                            switch (NumInfo.SubType)
                            {
                                case 1:
                                {
                                    AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                    break;
                                }
                                case 4:
                                {
                                    AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                    break;
                                }
                                case 5:
                                {
                                    AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                    break;
                                }
                                case 6:
                                {
                                    AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                    break;
                                }
                                case 7:
                                {
                                    AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                    break;
                                }
                            }

                            // Параграфы, которые не содержали списка у них уровень выставляем 0,
                            // а у тех которые содержали, мы уровень не меняем
                            for (var Index = StartPos; Index <= EndPos; Index++)
                            {
                                var OldNumPr = null;

                                if (type_Paragraph === this.Content[Index].GetType())
                                {
                                    if (undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ))
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        this.Content[Index].Numbering_Add(NumId, 0);
                                }
                                else if (type_Table === this.Content[Index].GetType())
                                {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }

                        break;
                    }

                    case 2: // Multilevel
                    {
                        // Создаем новый многоуровневый список, соответствующий NumInfo.SubType
                        var NumId       = this.Numbering.Create_AbstractNum();
                        var AbstractNum = this.Numbering.Get_AbstractNum(NumId);

                        switch (NumInfo.SubType)
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
                        for (var Index = StartPos; Index <= EndPos; Index++)
                        {
                            var OldNumPr = null;
                            if (type_Paragraph === this.Content[Index].GetType())
                            {
                                if (undefined != ( OldNumPr = this.Content[Index].Numbering_Get() ))
                                    this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                else
                                    this.Content[Index].Numbering_Add(NumId, 0);
                            }
                            else if (type_Table === this.Content[Index].GetType())
                            {
                                this.Content[Index].TurnOff_RecalcEvent();
                                this.Content[Index].Set_ParagraphNumbering(NumInfo);
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
        if (type_Paragraph == Item.GetType())
        {
            var FirstChange = 0;

            if (NumInfo.SubType < 0)
            {
                // Убираем список у параграфа
                Item.Numbering_Remove();
                if (selectionflag_Numbering === this.Selection.Flag)
                    Item.Document_SetThisElementCurrent(true);
            }
            else
            {
                if (selectionflag_Numbering === this.Selection.Flag && 0 === NumInfo.SubType)
                    NumInfo.SubType = 1;

                switch (NumInfo.Type)
                {
                    case 0: // Bullet
                    {
                        if (0 === NumInfo.SubType)
                        {
                            var NumPr = Item.Numbering_Get();
                            if (undefined != ( NumPr = Item.Numbering_Get() ))
                            {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Bullet))
                                {
                                    AbstractNum.Create_Default_Bullet();

                                    // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                    // нем записана

                                    // Нам нужно пересчитать все изменения, начиная с первого
                                    // элемента, использующего данную нумерацию
                                    FirstChange      = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++)
                                    {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl))
                                        {
                                            if (false === bFirstChange)
                                            {
                                                FirstChange  = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                            }
                            else
                            {
                                // Если мы просто нажимаем добавить маркированный список, тогда мы пытаемся
                                // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                // есть список, и этот список маркированный)

                                // Проверяем предыдущий элемент
                                var Prev   = this.Content[StartPos - 1];
                                var NumId  = null;
                                var NumLvl = 0;

                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType())
                                {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet))
                                    {
                                        NumId  = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }

                                // Предыдущий параграф не содержит списка, либо список не того формата
                                // создаем новую нумерацию (стандартную маркированный список)
                                if (null === NumId)
                                {
                                    NumId  = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;

                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                                }

                                if (type_Paragraph === Item.GetType())
                                {
                                    var OldNumPr = Item.Numbering_Get();
                                    if (undefined != OldNumPr)
                                        Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        Item.Numbering_Add(NumId, NumLvl);
                                }
                                else
                                    Item.Numbering_Add(NumId, NumLvl);

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        }
                        else
                        {
                            // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                            //    список, и добавляем его к данному параграфу
                            // 2. Если данный параграф содержит список, тогда мы у данного списка
                            //    изменяем уровень(соответствующий данному параграфу) на тот,
                            //    который определен в NumInfo.Subtype

                            var LvlText   = "";
                            var LvlTextPr = new CTextPr();
                            LvlTextPr.RFonts.Set_All("Times New Roman", -1);

                            switch (NumInfo.SubType)
                            {
                                case 1:
                                {
                                    LvlText = String.fromCharCode(0x00B7);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                }
                                case 2:
                                {
                                    LvlText = "o";
                                    LvlTextPr.RFonts.Set_All("Courier New", -1);
                                    break;
                                }
                                case 3:
                                {
                                    LvlText = String.fromCharCode(0x00A7);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 4:
                                {
                                    LvlText = String.fromCharCode(0x0076);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 5:
                                {
                                    LvlText = String.fromCharCode(0x00D8);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 6:
                                {
                                    LvlText = String.fromCharCode(0x00FC);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                }
                                case 7:
                                {
                                    LvlText = String.fromCharCode(0x00A8);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                }
                            }


                            var NumPr = null;
                            if (undefined != ( NumPr = Item.Numbering_Get() ))
                            {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                AbstractNum.Set_Lvl_Bullet(NumPr.Lvl, LvlText, LvlTextPr);

                                // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                // нем записана

                                // Нам нужно пересчитать все изменения, начиная с первого
                                // элемента, использующего данную нумерацию
                                FirstChange      = 0;
                                var bFirstChange = false;
                                for (var Index = 0; Index < this.Content.length; Index++)
                                {
                                    if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl))
                                    {
                                        if (false === bFirstChange)
                                        {
                                            FirstChange  = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            }
                            else
                            {
                                var NumId       = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);

                                Item.Numbering_Add(NumId, 0);

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        }

                        break;
                    }
                    case 1: // Numbered
                    {
                        if (0 === NumInfo.SubType)
                        {
                            var NumPr = Item.Numbering_Get();
                            if (undefined != ( NumPr = Item.Numbering_Get() ))
                            {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Decimal))
                                {
                                    AbstractNum.Create_Default_Numbered();

                                    // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                    // нем записана

                                    // Нам нужно пересчитать все изменения, начиная с первого
                                    // элемента, использующего данную нумерацию
                                    FirstChange      = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++)
                                    {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl))
                                        {
                                            if (false === bFirstChange)
                                            {
                                                FirstChange  = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                            }
                            else
                            {
                                // Если мы просто нажимаем добавить нумерованный список, тогда мы пытаемся
                                // присоединить его к списку предыдушего параграфа (если у предыдущего параграфа
                                // есть список, и этот список нумерованный)

                                // Проверяем предыдущий элемент
                                var Prev   = this.Content[StartPos - 1];
                                var NumId  = null;
                                var NumLvl = 0;

                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType())
                                {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal))
                                    {
                                        NumId  = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }

                                // Предыдущий параграф не содержит списка, либо список не того формата
                                // создаем новую нумерацию (стандартную маркированный список)
                                if (null === NumId)
                                {
                                    // Посмотрим на следующий параграф, возможно у него есть нумерованный список.
                                    var Next = this.Content[this.CurPos.ContentPos + 1];
                                    if (undefined !== Next && null !== Next && type_Paragraph === Next.GetType())
                                    {
                                        var NextNumPr = Next.Numbering_Get();
                                        if (undefined !== NextNumPr && true === this.Numbering.Check_Format(NextNumPr.NumId, NextNumPr.Lvl, numbering_numfmt_Decimal))
                                        {
                                            NumId  = NextNumPr.NumId;
                                            NumLvl = NextNumPr.Lvl;
                                        }
                                    }

                                    if (null === NumId)
                                    {
                                        NumId  = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;

                                        this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                                    }
                                }

                                if (type_Paragraph === Item.GetType())
                                {
                                    var OldNumPr = Item.Numbering_Get();
                                    if (undefined != ( OldNumPr ))
                                        Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                    else
                                        Item.Numbering_Add(NumId, NumLvl);
                                }
                                else
                                    Item.Numbering_Add(NumId, NumLvl);

                                // Нам нужно пересчитать все изменения, начиная с предыдущего элемента
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        }
                        else
                        {
                            // 1. Если данный параграф не содержит списка, тогда мы создаем новый
                            //    список, и добавляем его к данному параграфу
                            // 2. Если данный параграф содержит список, тогда мы у данного списка
                            //    изменяем уровень(соответствующий данному параграфу) на тот,
                            //    который определен в NumInfo.Subtype

                            var NumPr       = null;
                            var AbstractNum = null;
                            var ChangeLvl   = 0;
                            if (undefined != ( NumPr = Item.Numbering_Get() ))
                            {
                                AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                ChangeLvl   = NumPr.Lvl;
                            }
                            else
                            {
                                var NumId   = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = 0;
                            }

                            switch (NumInfo.SubType)
                            {
                                case 1:
                                {
                                    AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                    break;
                                }
                                case 2:
                                {
                                    AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                    break;
                                }
                                case 3:
                                {
                                    AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                    break;
                                }
                                case 4:
                                {
                                    AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                    break;
                                }
                                case 5:
                                {
                                    AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                    break;
                                }
                                case 6:
                                {
                                    AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                    break;
                                }
                                case 7:
                                {
                                    AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                    break;
                                }
                            }


                            if (null != NumPr)
                            {
                                // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                                // нем записана.

                                // Нам нужно пересчитать все изменения, начиная с первого
                                // элемента, использующего данную нумерацию
                                FirstChange      = 0;
                                var bFirstChange = false;
                                for (var Index = 0; Index < this.Content.length; Index++)
                                {
                                    if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl))
                                    {
                                        if (false === bFirstChange)
                                        {
                                            FirstChange  = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            }
                            else
                            {
                                Item.Numbering_Add(NumId, 0);

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

                        var NumId       = null;
                        var NumPr       = null;
                        var AbstractNum = null;
                        if (undefined != ( NumPr = Item.Numbering_Get() ))
                        {
                            AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                        }
                        else
                        {
                            NumId       = this.Numbering.Create_AbstractNum();
                            AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                        }

                        switch (NumInfo.SubType)
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

                        if (null != NumPr)
                        {
                            // Добавлять нумерацию к параграфу не надо, т.к. она уже в
                            // нем записана.

                            // Нам нужно пересчитать все изменения, начиная с первого
                            // элемента, использующего данную нумерацию
                            FirstChange      = 0;
                            var bFirstChange = false;
                            for (var Index = 0; Index < this.Content.length; Index++)
                            {
                                if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId))
                                {
                                    if (false === bFirstChange)
                                    {
                                        FirstChange  = Index;
                                        bFirstChange = true;
                                    }
                                    this.Content[Index].Recalc_CompileParaPr();
                                }
                            }
                        }
                        else
                        {
                            Item.Numbering_Add(NumId, 0);

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
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphNumbering(NumInfo);
        }
    }
};
CDocumentContent.prototype.Set_ParagraphPresentationNumbering = function(Bullet)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            this.Content[Index].Add_PresentationNumbering(Bullet);
        }
        return;
    }

    if (this.CurPos.ContentPos < 0)
        return false;

    if (true === this.Selection.Use)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;
        if (EndPos < StartPos)
        {
            var Temp = StartPos;
            StartPos = EndPos;
            EndPos   = Temp;
        }

        for (var Index = StartPos; Index <= EndPos; Index++)
        {
            this.Content[Index].Add_PresentationNumbering(Bullet);
        }
        // Нам нужно пересчитать все изменения, начиная с первого элемента,
        // попавшего в селект.
        this.ContentLastChangePos = StartPos;

        this.Recalculate();

        return;
    }
    this.Content[this.CurPos.ContentPos].Add_PresentationNumbering(Bullet);
    // Нам нужно пересчитать все изменения, начиная с текущего элемента
    this.ContentLastChangePos = this.CurPos.ContentPos;
    this.Recalculate();
};
CDocumentContent.prototype.Can_IncreaseParagraphLevel         = function(bIncrease)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            if (!this.Content[Index].Can_IncreaseLevel(bIncrease))
                return false;
        }
        return true;
    }

    if (this.CurPos.ContentPos < 0)
        return false;

    if (true === this.Selection.Use)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;
        if (EndPos < StartPos)
        {
            var Temp = StartPos;
            StartPos = EndPos;
            EndPos   = Temp;
        }

        for (var Index = StartPos; Index <= EndPos; Index++)
        {
            if (!this.Content[Index].Can_IncreaseLevel(bIncrease))
            {
                return false;
            }
        }

        return true;
    }
    return this.Content[this.CurPos.ContentPos].Can_IncreaseLevel(bIncrease);
};
CDocumentContent.prototype.Increase_ParagraphLevel            = function(bIncrease)
{
    if (!this.Can_IncreaseParagraphLevel(bIncrease))
        return;
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            this.Content[Index].Increase_Level(bIncrease);
        }
        return;
    }

    if (this.CurPos.ContentPos < 0)
        return false;

    if (true === this.Selection.Use)
    {
        var StartPos = this.Selection.StartPos;
        var EndPos   = this.Selection.EndPos;
        if (EndPos < StartPos)
        {
            var Temp = StartPos;
            StartPos = EndPos;
            EndPos   = Temp;
        }

        for (var Index = StartPos; Index <= EndPos; Index++)
        {
            this.Content[Index].Increase_Level(bIncrease);
        }
        // Нам нужно пересчитать все изменения, начиная с первого элемента,
        // попавшего в селект.
        this.ContentLastChangePos = StartPos;

        this.Recalculate();

        return;
    }
    this.Content[this.CurPos.ContentPos].Increase_Level(bIncrease);
    // Нам нужно пересчитать все изменения, начиная с текущего элемента
    this.ContentLastChangePos = this.CurPos.ContentPos;
    this.Recalculate();
};
CDocumentContent.prototype.Set_ParagraphShd                   = function(Shd)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            // При изменении цвета фона параграфа, не надо ничего пересчитывать
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_Shd(Shd);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphShd(Shd);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphShd(Shd);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if (undefined !== this.LogicDocument && true === this.LogicDocument.UseTextShd && StartPos === EndPos && type_Paragraph === this.Content[StartPos].GetType() && false === this.Content[StartPos].Selection_CheckParaEnd() && selectionflag_Common === this.Selection.Flag)
            {
                this.Paragraph_Add(new ParaTextPr({Shd : Shd}));
                this.Parent.OnContentRecalculate(false);
            }
            else
            {
                if (EndPos < StartPos)
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    // При изменении цвета фона параграфа, не надо ничего пересчитывать
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType())
                        Item.Set_Shd(Shd);
                    else if (type_Table == Item.GetType())
                    {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphShd(Shd);
                        Item.TurnOn_RecalcEvent();
                    }
                }

                this.Parent.OnContentRecalculate(false);
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            // При изменении цвета фона параграфа, не надо ничего пересчитывать
            Item.Set_Shd(Shd);

            this.Parent.OnContentRecalculate(false);
        }
        else if (type_Table == Item.GetType())
            Item.Set_ParagraphShd(Shd);
    }
};
CDocumentContent.prototype.Set_ParagraphStyle                 = function(Name)
{
    var Styles  = this.Parent.Get_Styles();
    var StyleId = Styles.Get_StyleIdByName(Name);

    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            // При изменении цвета фона параграфа, не надо ничего пересчитывать
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
            {
                Item.Style_Add(StyleId);
            }
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphStyle(Name);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphStyle(Name);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            if (selectionflag_Numbering === this.Selection.Flag)
                this.Remove_NumberingSelection();

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                {
                    Item.Style_Add(StyleId);
                }
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphStyle(Name);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Style_Add(StyleId);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
        {
            Item.TurnOff_RecalcEvent();
            Item.Set_ParagraphStyle(Name);
            Item.TurnOn_RecalcEvent();

            // Нам нужно пересчитать все изменения, начиная с предыдушего элемента
            this.ContentLastChangePos = Math.max(this.CurPos.ContentPos - 1, 0);
            this.Recalculate();
        }
    }
};
CDocumentContent.prototype.Set_ParagraphTabs                  = function(Tabs)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_Tabs(Tabs);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphTabs(Tabs);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphTabs(Tabs);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_Tabs(Tabs);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphTabs(Tabs);
                    Item.TurnOn_RecalcEvent();
                }
            }
            // Нам нужно пересчитать все изменения, начиная с первого элемента,
            // попавшего в селект.
            this.ContentLastChangePos = StartPos;

            this.Recalculate();

            if (editor)
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_Tabs(Tabs);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
            if (editor)
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);
        }
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphTabs(Tabs);
            if (editor)
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);
        }
    }
};
CDocumentContent.prototype.Set_ParagraphContextualSpacing     = function(Value)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_ContextualSpacing(Value);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphContextualSpacing(Value);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphContextualSpacing(Value);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_ContextualSpacing(Value);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphContextualSpacing(Value);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_ContextualSpacing(Value);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
            Item.Set_ParagraphContextualSpacing(Value);
    }
};
CDocumentContent.prototype.Set_ParagraphPageBreakBefore       = function(Value)
{
    // Ничего не делаем
};
CDocumentContent.prototype.Set_ParagraphKeepLines             = function(Value)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_KeepLines(Value);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphKeepLines(Value);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphKeepLines(Value);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_KeepLines(Value);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphKeepLines(Value);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_KeepLines(Value);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
            Item.Set_ParagraphKeepLines(Value);
    }
};
CDocumentContent.prototype.Set_ParagraphKeepNext              = function(Value)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_KeepNext(Value);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphKeepNext(Value);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphKeepNext(Value);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_KeepNext(Value);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphKeepNext(Value);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_KeepNext(Value);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
            Item.Set_ParagraphKeepNext(Value);
    }
};
CDocumentContent.prototype.Set_ParagraphWidowControl          = function(Value)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_WidowControl(Value);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphWidowControl(Value);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphWidowControl(Value);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];
                if (type_Paragraph == Item.GetType())
                    Item.Set_WidowControl(Value);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphWidowControl(Value);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.Set_WidowControl(Value);

            // Нам нужно пересчитать все изменения, начиная с текущего элемента
            this.ContentLastChangePos = this.CurPos.ContentPos;

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
            Item.Set_ParagraphWidowControl(Value);
    }
};
CDocumentContent.prototype.Set_ParagraphBorders               = function(Borders)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Set_Borders(Borders);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Set_ParagraphBorders(Borders);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setParagraphBorders(Borders);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
            {
                // При изменении цвета фона параграфа, не надо ничего пересчитывать
                var Item = this.Content[Index];

                if (type_Paragraph == Item.GetType())
                    Item.Set_Borders(Borders);
                else if (type_Table == Item.GetType())
                {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphBorders(Borders);
                    Item.TurnOn_RecalcEvent();
                }
            }

            this.Recalculate();
            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            // Мы должны выставить границу для всех параграфов, входящих в текущую группу параграфов
            // с одинаковыми границами

            var StartPos = Item.Index;
            var EndPos   = Item.Index;
            var CurBrd   = Item.Get_CompiledPr().ParaPr.Brd;

            while (true != CurBrd.First)
            {
                StartPos--;
                if (StartPos < 0)
                {
                    StartPos = 0;
                    break;
                }

                var TempItem = this.Content[StartPos];
                if (type_Paragraph != TempItem.GetType())
                {
                    StartPos++;
                    break;
                }

                CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
            }

            CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
            while (true != CurBrd.Last)
            {
                EndPos++;
                if (EndPos >= this.Content.length)
                {
                    EndPos = this.Content.length - 1;
                    break;
                }

                var TempItem = this.Content[EndPos];
                if (type_Paragraph != TempItem.GetType())
                {
                    EndPos--;
                    break;
                }

                CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
            }

            for (var Index = StartPos; Index <= EndPos; Index++)
                this.Content[Index].Set_Borders(Borders);

            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
        {
            Item.Set_ParagraphBorders(Borders);
        }
    }
};
CDocumentContent.prototype.Paragraph_IncDecFontSize           = function(bIncrease)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.IncDec_FontSize(bIncrease);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Paragraph_IncDecFontSize(bIncrease);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.paragraphIncDecFontSize(bIncrease);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if (EndPos < StartPos)
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for (var Index = StartPos; Index <= EndPos; Index++)
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];

                        if (type_Paragraph == Item.GetType())
                            Item.IncDec_FontSize(bIncrease);
                        else if (type_Table == Item.GetType())
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Paragraph_IncDecFontSize(bIncrease);
                            Item.TurnOn_RecalcEvent();
                        }
                    }

                    // Нам нужно пересчитать все изменения, начиная с первого элемента,
                    // попавшего в селект.
                    this.ContentLastChangePos = StartPos;

                    this.Recalculate();
                    break;
                }
                case  selectionflag_Numbering:
                {
                    var OldFontSize = this.Get_Paragraph_TextPr().FontSize;
                    var NewFontSize = FontSize_IncreaseDecreaseValue(bIncrease, OldFontSize);
                    var TextPr      = new CTextPr();
                    TextPr.FontSize = NewFontSize;
                    this.Paragraph_Add(new ParaTextPr(TextPr), true);

                    this.Recalculate();
                    break;
                }
            }

            return;
        }

        var Item = this.Content[this.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType())
        {
            if (true === Item.IncDec_FontSize(bIncrease))
            {
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            }
        }
        else if (type_Table == Item.GetType())
        {
            Item.Paragraph_IncDecFontSize(bIncrease);
        }
    }
};
CDocumentContent.prototype.Paragraph_IncDecIndent             = function(bIncrease)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.IncDec_Indent(bIncrease);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Paragraph_IncDecIndent(bIncrease);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        if (true != this.LogicDocument.DrawingObjects.isSelectedText())
        {
            var ParaDrawing = this.LogicDocument.DrawingObjects.getMajorParaDrawing();
            if (null != ParaDrawing)
            {
                var Paragraph = ParaDrawing.Parent;
                Paragraph.IncDec_Indent(bIncrease);
                this.Recalculate();
            }
        }
        else
        {
            this.DrawingObjects.paragraphIncDecIndent(bIncrease);
        }
        return;
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (this.CurPos.ContentPos < 0)
            return false;

        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if (EndPos < StartPos)
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    for (var Index = StartPos; Index <= EndPos; Index++)
                    {
                        // При изменении цвета фона параграфа, не надо ничего пересчитывать
                        var Item = this.Content[Index];

                        if (type_Paragraph == Item.GetType())
                            Item.IncDec_Indent(bIncrease);
                        else if (type_Table == Item.GetType())
                        {
                            Item.TurnOff_RecalcEvent();
                            Item.Paragraph_IncDecIndent(bIncrease);
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
        if (type_Paragraph == Item.GetType())
        {
            Item.IncDec_Indent(bIncrease);
            this.ContentLastChangePos = this.CurPos.ContentPos;
            this.Recalculate();
        }
        else if (type_Table == Item.GetType())
        {
            Item.Paragraph_IncDecIndent(bIncrease);
        }
    }
};
CDocumentContent.prototype.Paragraph_Format_Paste             = function(TextPr, ParaPr, ApplyPara)
{
    if (true === this.ApplyToAll)
    {
        for (var Index = 0; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];
            Item.Set_ApplyToAll(true);
            if (type_Paragraph == Item.GetType())
                Item.Paragraph_Format_Paste(TextPr, ParaPr, true);
            else if (type_Table == Item.GetType())
            {
                Item.TurnOff_RecalcEvent();
                Item.Paragraph_Format_Paste(TextPr, ParaPr, true);
                Item.TurnOn_RecalcEvent();
            }
            Item.Set_ApplyToAll(false);
        }

        return;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.paragraphFormatPaste(TextPr, ParaPr, ApplyPara);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Numbering    :
                    return;
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;
                    if (Start > End)
                    {
                        Start = this.Selection.EndPos;
                        End   = this.Selection.StartPos;
                    }

                    for (var Pos = Start; Pos <= End; Pos++)
                    {
                        this.Content[Pos].Paragraph_Format_Paste(TextPr, ParaPr, ( Start === End ? false : true ));
                    }

                    this.Recalculate();

                    break;
                }
            }
        }
        else
        {
            this.Content[this.CurPos.ContentPos].Paragraph_Format_Paste(TextPr, ParaPr, true);
            this.Recalculate();
        }
    }
};
CDocumentContent.prototype.Set_ImageProps                     = function(Props)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.LogicDocument.DrawingObjects.setProps(Props);
        this.Document_UpdateInterfaceState();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        if (true == this.Selection.Use)
            this.Content[this.Selection.StartPos].Set_ImageProps(Props);
        else
            this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
    }
};
CDocumentContent.prototype.Set_TableProps                     = function(Props)
{
    if (true === this.ApplyToAll)
        return false;

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.setTableProps(Props);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        var Pos = -1;
        if (true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType())
            Pos = this.Selection.StartPos;
        else if (false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType())
            Pos = this.CurPos.ContentPos;

        if (-1 != Pos)
        {
            var Table = this.Content[Pos];
            return Table.Set_Props(Props);
        }

        return false;
    }
};
CDocumentContent.prototype.Get_Paragraph_ParaPr               = function()
{
    var Result_ParaPr = new CParaPr();

    if (true === this.ApplyToAll)
    {
        var StartPr, Pr;
        if (type_Paragraph == this.Content[0].GetType())
        {
            StartPr   = this.Content[0].Get_CompiledPr2().ParaPr;
            Pr        = StartPr.Copy();
            Pr.Locked = this.Content[0].Lock.Is_Locked();
        }
        else if (type_Table == this.Content[0].GetType())
        {
            StartPr   = this.Content[0].Get_Paragraph_ParaPr();
            Pr        = StartPr.Copy();
            Pr.Locked = StartPr.Locked;
        }

        for (var Index = 1; Index < this.Content.length; Index++)
        {
            var Item = this.Content[Index];

            var TempPr;
            if (type_Paragraph == Item.GetType())
            {
                TempPr        = Item.Get_CompiledPr2(false).ParaPr.Copy();
                TempPr.Locked = Item.Lock.Is_Locked();
            }
            else if (type_Table == Item.GetType())
            {
                TempPr = Item.Get_Paragraph_ParaPr();
            }

            Pr = Pr.Compare(TempPr);
        }

        if (Pr.Ind.Left == UnknownValue)
            Pr.Ind.Left = StartPr.Ind.Left;

        if (Pr.Ind.Right == UnknownValue)
            Pr.Ind.Right = StartPr.Ind.Right;

        if (Pr.Ind.FirstLine == UnknownValue)
            Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

        Result_ParaPr             = Pr;
        Result_ParaPr.CanAddTable = ( true === Pr.Locked ? false : true ) && !(this.bPresentation === true);
        if (Result_ParaPr.Shd && Result_ParaPr.Shd.Unifill)
        {
            Result_ParaPr.Shd.Unifill.check(this.Get_Theme(), this.Get_ColorMap());
        }
        return Result_ParaPr;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getParagraphParaPr();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag)
        {
            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;
            if (EndPos < StartPos)
            {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos   = Temp;
            }

            var StartPr, Pr;
            if (type_Paragraph == this.Content[StartPos].GetType())
            {
                StartPr   = this.Content[StartPos].Get_CompiledPr2(false).ParaPr;
                Pr        = StartPr.Copy();
                Pr.Locked = this.Content[StartPos].Lock.Is_Locked();
            }
            else if (type_Table == this.Content[StartPos].GetType())
            {
                StartPr   = this.Content[StartPos].Get_Paragraph_ParaPr();
                Pr        = StartPr.Copy();
                Pr.Locked = StartPr.Locked;
            }

            for (var Index = StartPos + 1; Index <= EndPos; Index++)
            {
                var Item = this.Content[Index];

                var TempPr;
                if (type_Paragraph == Item.GetType())
                {
                    TempPr        = Item.Get_CompiledPr2(false).ParaPr;
                    TempPr.Locked = Item.Lock.Is_Locked();
                }
                else if (type_Table == Item.GetType())
                {
                    TempPr = Item.Get_Paragraph_ParaPr();
                }

                Pr = Pr.Compare(TempPr);
            }

            if (undefined === Pr.Ind.Left)
                Pr.Ind.Left = StartPr.Ind.Left;

            if (undefined === Pr.Ind.Right)
                Pr.Ind.Right = StartPr.Ind.Right;

            if (undefined === Pr.Ind.FirstLine)
                Pr.Ind.FirstLine = StartPr.Ind.FirstLine;

            Result_ParaPr             = Pr;
            Result_ParaPr.CanAddTable = ( true === Locked ? false : true ) && !(this.bPresentation === true);
        }
        else
        {
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType())
            {
                var ParaPr = Item.Get_CompiledPr2(false).ParaPr;
                var Locked = Item.Lock.Is_Locked();

                Result_ParaPr             = ParaPr.Copy();
                Result_ParaPr.Locked      = Locked;
                Result_ParaPr.CanAddTable = ( ( true === Locked ) ? ( ( true === Item.Cursor_IsEnd() ) ? true : false ) : true ) && !(this.bPresentation === true);
            }
            else if (type_Table == Item.GetType())
            {
                Result_ParaPr = Item.Get_Paragraph_ParaPr();
            }
        }
        if (Result_ParaPr.Shd && Result_ParaPr.Shd.Unifill)
        {
            Result_ParaPr.Shd.Unifill.check(this.Get_Theme(), this.Get_ColorMap());
        }
        return Result_ParaPr;
    }
};
CDocumentContent.prototype.Get_Paragraph_TextPr               = function()
{
    var Result_TextPr = null;

    if (true === this.ApplyToAll)
    {
        var VisTextPr;
        this.Content[0].Set_ApplyToAll(true);
        VisTextPr = this.Content[0].Get_Paragraph_TextPr();
        this.Content[0].Set_ApplyToAll(false);

        var Count = this.Content.length;
        for (var Index = 1; Index < Count; Index++)
        {
            this.Content[Index].Set_ApplyToAll(true);
            var CurPr = this.Content[Index].Get_Paragraph_TextPr();
            VisTextPr = VisTextPr.Compare(CurPr);
            this.Content[Index].Set_ApplyToAll(false);
        }

        Result_TextPr = VisTextPr;

        return Result_TextPr;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getParagraphTextPr();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            var VisTextPr;
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if (EndPos < StartPos)
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();

                    for (var Index = StartPos + 1; Index <= EndPos; Index++)
                    {
                        var CurPr = this.Content[Index].Get_Paragraph_TextPr();
                        VisTextPr = VisTextPr.Compare(CurPr);
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    // Текстовые настройки применяем к конкретной нумерации
                    if (null == this.Selection.Data || this.Selection.Data.length <= 0)
                        break;

                    var CurPara = this.Content[this.Selection.Data[0]];
                    for (var Index = 0; Index < this.Selection.Data.length; Index++)
                    {
                        if (this.CurPos.ContentPos === this.Selection.Data[Index])
                            CurPara = this.Content[this.Selection.Data[Index]];
                    }

                    VisTextPr = CurPara.Internal_Get_NumberingTextPr();

                    break;
                }
            }

            Result_TextPr = VisTextPr;
        }
        else
        {
            Result_TextPr = this.Content[this.CurPos.ContentPos].Get_Paragraph_TextPr();
        }

        return Result_TextPr;
    }
};
CDocumentContent.prototype.Get_Paragraph_TextPr_Copy          = function()
{
    var Result_TextPr = null;

    if (true === this.ApplyToAll)
    {
        var Item      = this.Content[0];
        Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
        return Result_TextPr;
    }

    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getParagraphTextPrCopy();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            var VisTextPr;
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var StartPos = this.Selection.StartPos;
                    if (this.Selection.EndPos < StartPos)
                        StartPos = this.Selection.EndPos;

                    var Item  = this.Content[StartPos];
                    VisTextPr = Item.Get_Paragraph_TextPr_Copy();

                    break;
                }
                case selectionflag_Numbering:
                {
                    // Текстовые настройки применяем к конкретной нумерации
                    if (null == this.Selection.Data || this.Selection.Data.length <= 0)
                        break;

                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                    VisTextPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].TextPr;

                    break;
                }
            }

            Result_TextPr = VisTextPr;
        }
        else
        {
            var Item      = this.Content[this.CurPos.ContentPos];
            Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
        }

        return Result_TextPr;
    }
};
CDocumentContent.prototype.Get_Paragraph_ParaPr_Copy          = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.getParagraphParaPrCopy();
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        var Result_ParaPr = null;

        // Inline объекты
        if (docpostype_Content == this.CurPos.Type)
        {
            if (true === this.Selection.Use)
            {
                switch (this.Selection.Flag)
                {
                    case selectionflag_Common:
                    {
                        var StartPos = this.Selection.StartPos;
                        if (this.Selection.EndPos < StartPos)
                            StartPos = this.Selection.EndPos;

                        var Item      = this.Content[StartPos];
                        Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();

                        break;
                    }
                    case selectionflag_Numbering:
                    {
                        // Текстовые настройки применяем к конкретной нумерации
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0)
                            break;

                        var NumPr     = this.Content[this.Selection.Data[0]].Numbering_Get();
                        Result_ParaPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].ParaPr;

                        break;
                    }
                }
            }
            else
            {
                var Item      = this.Content[this.CurPos.ContentPos];
                Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
            }
        }

        return Result_ParaPr;
    }
};
//-----------------------------------------------------------------------------------
// Функции для работы с интерфейсом
//-----------------------------------------------------------------------------------

// Обновляем данные в интерфейсе о свойствах параграфа
CDocumentContent.prototype.Interface_Update_ParaPr    = function()
{
    var ParaPr = this.Get_Paragraph_ParaPr();

    if (null != ParaPr)
    {
        ParaPr.CanAddDropCap = false;

        if (this.LogicDocument)
        {
            var oSelectedInfo = this.LogicDocument.Get_SelectedElementsInfo();
            var Math          = oSelectedInfo.Get_Math();
            if (null !== Math)
                ParaPr.CanAddImage = false;
            else
                ParaPr.CanAddImage = true;
        }

        if (undefined != ParaPr.Tabs && editor)
            editor.Update_ParaTab(Default_Tab_Stop, ParaPr.Tabs);

        if (this.LogicDocument)
        {
            var SelectedInfo = this.LogicDocument.Get_SelectedElementsInfo();
            var Math         = SelectedInfo.Get_Math();
            if (null !== Math && true !== Math.Is_Inline())
                ParaPr.Jc = Math.Get_Align();

            // Если мы находимся внутри автофигуры, тогда нам надо проверить лок параграфа, в котором находится автофигура
            if (docpostype_DrawingObjects === this.LogicDocument.CurPos.Type && true !== ParaPr.Locked)
            {
                var ParaDrawing = this.LogicDocument.DrawingObjects.getMajorParaDrawing();
                if (ParaDrawing)
                {
                    ParaPr.Locked = ParaDrawing.Lock.Is_Locked();
                }
            }
        }

        if (editor)
            editor.UpdateParagraphProp(ParaPr);
    }
};
// Обновляем данные в интерфейсе о свойствах текста
CDocumentContent.prototype.Interface_Update_TextPr    = function()
{
    var TextPr = this.Get_Paragraph_TextPr();


    if (null != TextPr)
    {
        var theme = this.Get_Theme();
        if (theme && theme.themeElements && theme.themeElements.fontScheme)
        {
            if (TextPr.FontFamily)
            {
                TextPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
            }
            if (TextPr.RFonts)
            {
                if (TextPr.RFonts.Ascii)
                    TextPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                if (TextPr.RFonts.EastAsia)
                    TextPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                if (TextPr.RFonts.HAnsi)
                    TextPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                if (TextPr.RFonts.CS)
                    TextPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
            }
        }
        editor.UpdateTextPr(TextPr);
    }
};
CDocumentContent.prototype.Interface_Update_DrawingPr = function(Flag)
{
    var ImagePr = {};

    if (docpostype_DrawingObjects === this.CurPos.Type)
        ImagePr = this.LogicDocument.DrawingObjects.getProps();

    if (true === Flag)
        return ImagePr;
    else
        editor.sync_ImgPropCallback(ImagePr);

};
CDocumentContent.prototype.Interface_Update_TablePr   = function(Flag)
{
    var TablePr = null;
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        TablePr = this.LogicDocument.DrawingObjects.getTableProps();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        if (true == this.Selection.Use)
            TablePr = this.Content[this.Selection.StartPos].Get_Props();
        else
            TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
    }

    if (true === Flag)
        return TablePr;
    else if (null != TablePr)
        editor.sync_TblPropCallback(TablePr);
};
//-----------------------------------------------------------------------------------
// Функции для работы с селектом
//-----------------------------------------------------------------------------------
// Убираем селект
CDocumentContent.prototype.Selection_Remove    = function(bNoCheckDrawing)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.resetSelection(undefined, bNoCheckDrawing);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if (Start > End)
                    {
                        var Temp = Start;
                        Start    = End;
                        End      = Temp;
                    }

                    Start = Math.max(0, Start);
                    End   = Math.min(this.Content.length - 1, End);

                    for (var Index = Start; Index <= End; Index++)
                    {
                        this.Content[Index].Selection_Remove();
                    }

                    this.Selection.Use   = false;
                    this.Selection.Start = false;
                    break;
                }
                case selectionflag_Numbering:
                {
                    if (null == this.Selection.Data)
                        break;

                    for (var Index = 0; Index < this.Selection.Data.length; Index++)
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Remove();
                    }

                    this.Selection.Use   = false;
                    this.Selection.Start = false;
                    this.Selection.Flag  = selectionflag_Common;

                    break;
                }
            }
        }

        this.Selection.StartPos = 0;
        this.Selection.EndPos   = 0;
    }
};
// Рисуем селект
CDocumentContent.prototype.Selection_Draw_Page = function(PageIndex)
{
    var CurPage = PageIndex;
    if (CurPage < 0 || CurPage >= this.Pages.length)
        return;

    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        this.DrawingDocument.SetTextSelectionOutline(true);
        var PageAbs = CurPage + this.Get_StartPage_Absolute();
        this.LogicDocument.DrawingObjects.drawSelectionPage(PageAbs);
    }
    else
    {
        var Pos_start = this.Pages[CurPage].Pos;
        var Pos_end   = this.Pages[CurPage].EndPos;

        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if (Start > End)
                    {
                        Start = this.Selection.EndPos;
                        End   = this.Selection.StartPos;
                    }

                    var Start = Math.max(Start, Pos_start);
                    var End   = Math.min(End, Pos_end);

                    for (var Index = Start; Index <= End; Index++)
                    {
                        var ElementPageIndex = this.private_GetElementPageIndex(Index, CurPage, 0, 1);
                        this.Content[Index].Selection_Draw_Page(ElementPageIndex);
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    if (null == this.Selection.Data)
                        break;

                    var Count = this.Selection.Data.length;

                    for (var Index = 0; Index < Count; Index++)
                    {
                        if (this.Selection.Data[Index] <= Pos_end && this.Selection.Data[Index] >= Pos_start)
                        {
                            var ElementPageIndex = this.private_GetElementPageIndex(this.Selection.Data[Index], CurPage, 0, 1);
                            this.Content[this.Selection.Data[Index]].Selection_Draw_Page(ElementPageIndex);
                        }
                    }

                    break;
                }
            }
        }
    }
};
CDocumentContent.prototype.Selection_Clear     = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.resetSelection();
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {

            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {

                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if (Start > End)
                    {
                        var Temp = Start;
                        Start    = End;
                        End      = Temp;
                    }

                    for (var Index = Start; Index <= End; Index++)
                    {
                        this.Content[Index].Selection_Clear();
                    }

                    break;
                }
                case selectionflag_Numbering:
                {
                    if (null == this.Selection.Data)
                        break;

                    for (var Index = 0; Index < this.Selection.Data.length; Index++)
                    {
                        this.Content[this.Selection.Data[Index]].Selection_Clear();
                    }

                    break;
                }
            }
        }
    }
};
CDocumentContent.prototype.Selection_SetStart = function(X, Y, CurPage, MouseEvent)
{
    if (CurPage < 0 || CurPage >= this.Pages.length)
        CurPage = 0;

    this.CurPage = CurPage;
    var AbsPage  = this.Get_AbsolutePage(this.CurPage);

    // Сначала проверим, не попали ли мы в один из "плавающих" объектов
    var bInText      = (null === this.Is_InText(X, Y, AbsPage) ? false : true);
    var bTableBorder = (null === this.Is_TableBorder(X, Y, AbsPage) ? false : true);
    var nInDrawing   = this.LogicDocument && this.LogicDocument.DrawingObjects.isPointInDrawingObjects(X, Y, AbsPage, this);

    if (this.Parent instanceof CHeaderFooter && ( nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || ( false === bTableBorder && false === bInText && nInDrawing >= 0 ) ))
    {
        if (docpostype_DrawingObjects != this.CurPos.Type)
            this.Selection_Remove();

        // Прячем курсор
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage(AbsPage);

        var HdrFtr = this.Is_HdrFtr(true);
        if (null === HdrFtr)
        {
            this.LogicDocument.Selection.Use   = true;
            this.LogicDocument.Selection.Start = true;
            this.LogicDocument.Selection.Flag  = selectionflag_Common;
            this.LogicDocument.CurPos.Type     = docpostype_DrawingObjects;
        }
        else
        {
            HdrFtr.Content.Selection.Use   = true;
            HdrFtr.Content.Selection.Start = true;
            HdrFtr.Content.Selection.Flag  = selectionflag_Common;
            HdrFtr.Content.CurPos.Type     = docpostype_DrawingObjects;
        }

        this.LogicDocument.DrawingObjects.OnMouseDown(MouseEvent, X, Y, AbsPage);
    }
    else
    {
        var bOldSelectionIsCommon = true;

        if (docpostype_DrawingObjects === this.CurPos.Type && true != this.Is_InDrawing(X, Y, AbsPage))
        {
            this.LogicDocument.DrawingObjects.resetSelection();
            bOldSelectionIsCommon = false;
        }

        var ContentPos = this.Internal_GetContentPosByXY(X, Y);

        if (docpostype_Content != this.CurPos.Type)
        {
            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = ContentPos;
            bOldSelectionIsCommon  = false;
        }

        var SelectionUse_old = this.Selection.Use;
        var Item             = this.Content[ContentPos];

        var bTableBorder = false;
        if (type_Table == Item.GetType())
            bTableBorder = ( null != Item.Is_TableBorder(X, Y, AbsPage) ? true : false );

        // Убираем селект, кроме случаев либо текущего параграфа, либо при движении границ внутри таблицы
        if (!(true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon))
        {
            if ((selectionflag_Common != this.Selection.Flag) || ( true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder ))
                this.Selection_Remove();
        }

        this.Selection.Use   = true;
        this.Selection.Start = true;
        this.Selection.Flag  = selectionflag_Common;

        if (true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon)
        {
            this.Selection_SetEnd(X, Y, this.CurPage, {Type : AscCommon.g_mouse_event_type_up, ClickCount : 1});
            this.Selection.Use    = true;
            this.Selection.Start  = true;
            this.Selection.EndPos = ContentPos;
            this.Selection.Data   = null;
        }
        else
        {
            var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, this.CurPage);
            Item.Selection_SetStart(X, Y, ElementPageIndex, MouseEvent);
            Item.Selection_SetEnd(X, Y, ElementPageIndex, {Type : AscCommon.g_mouse_event_type_move, ClickCount : 1});

            if (!(type_Table == Item.GetType() && true == bTableBorder))
            {
                this.Selection.Use      = true;
                this.Selection.StartPos = ContentPos;
                this.Selection.EndPos   = ContentPos;
                this.Selection.Data     = null;

                this.CurPos.ContentPos = ContentPos;

                if (type_Paragraph === Item.GetType() && true === MouseEvent.CtrlKey)
                {
                    var Hyperlink = Item.Check_Hyperlink(X, Y, this.CurPage);
                    if (null != Hyperlink)
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
};
// Данная функция может использоваться как при движении, так и при окончательном выставлении селекта.
// Если bEnd = true, тогда это конец селекта.
CDocumentContent.prototype.Selection_SetEnd          = function(X, Y, CurPage, MouseEvent)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        var PageAbs = (this.Parent instanceof CHeaderFooter ? CurPage : this.Get_StartPage_Absolute(CurPage));
        if (AscCommon.g_mouse_event_type_up == MouseEvent.Type)
        {
            this.LogicDocument.DrawingObjects.OnMouseUp(MouseEvent, X, Y, PageAbs);
            this.Selection.Start = false;
            this.Selection.Use   = true;
        }
        else
        {
            this.LogicDocument.DrawingObjects.OnMouseMove(MouseEvent, X, Y, PageAbs);
        }
        return;
    }

    if (CurPage < 0 || CurPage >= this.Pages.length)
        CurPage = 0;

    this.CurPage = CurPage;

    if (selectionflag_Numbering === this.Selection.Flag)
        return;

    // Обрабатываем движение границы у таблиц
    if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType())
    {
        var Item             = this.Content[this.Selection.Data.Pos];
        var ElementPageIndex = this.private_GetElementPageIndexByXY(this.Selection.Data.Pos, X, Y, this.CurPage);
        Item.Selection_SetEnd(X, Y, ElementPageIndex, MouseEvent);

        if (AscCommon.g_mouse_event_type_up == MouseEvent.Type)
        {
            this.Selection.Start = false;

            if (true != this.Selection.Data.Selection)
            {
                this.Selection.Use = false;
            }
            this.Selection.Data = null;
        }

        return;
    }

    if (false === this.Selection.Use)
        return;

    var ContentPos = this.Internal_GetContentPosByXY(X, Y);

    this.Selection_Clear();

    var OldPos      = this.CurPos.ContentPos;
    var OldInnerPos = null;
    if (type_Paragraph === this.Content[OldPos].GetType())
        OldInnerPos = this.Content[OldPos].CurPos.ContentPos;
    else //if ( type_Table === this.Content[OldPos].GetType() )
        OldInnerPos = this.Content[OldPos].CurCell;

    this.CurPos.ContentPos = ContentPos;
    var OldEndPos          = this.Selection.EndPos;
    this.Selection.EndPos  = ContentPos;

    // Удалим отметки о старом селекте
    if (OldEndPos < this.Selection.StartPos && OldEndPos < this.Selection.EndPos)
    {
        var TempLimit = Math.min(this.Selection.StartPos, this.Selection.EndPos);
        for (var Index = OldEndPos; Index < TempLimit; Index++)
        {
            this.Content[Index].Selection.Use   = false;
            this.Content[Index].Selection.Start = false;
        }
    }
    else if (OldEndPos > this.Selection.StartPos && OldEndPos > this.Selection.EndPos)
    {
        var TempLimit = Math.max(this.Selection.StartPos, this.Selection.EndPos);
        for (var Index = TempLimit + 1; Index <= OldEndPos; Index++)
        {
            this.Content[Index].Selection.Use   = false;
            this.Content[Index].Selection.Start = false;
        }
    }


    // Направление селекта: 1 - прямое, -1 - обратное, 0 - отмечен 1 элемент документа
    var Direction = ( ContentPos > this.Selection.StartPos ? 1 : ( ContentPos < this.Selection.StartPos ? -1 : 0 )  );

    if (AscCommon.g_mouse_event_type_up == MouseEvent.Type)
    {
        // Останаливаем селект в глобальном классе. Кроме этого мы должны остановить селект в
        // стартовом элементе селекта.
        this.Selection.Start = false;

        // Если 0 === Direction, в функции Selection_SetEnd все что нужно обработается
        if (0 != Direction)
            this.Content[this.Selection.StartPos].Selection_Stop(X, Y, this.CurPage, MouseEvent);
    }

    var Start, End;
    if (0 == Direction)
    {
        var Item             = this.Content[this.Selection.StartPos];
        var ElementPageIndex = this.private_GetElementPageIndexByXY(this.Selection.StartPos, X, Y, this.CurPage);
        Item.Selection_SetEnd(X, Y, ElementPageIndex, MouseEvent);

        if (false === Item.Selection.Use)
        {
            this.Selection.Use = false;

            if (null != this.Selection.Data && true === this.Selection.Data.Hyperlink)
            {
                editor && editor.sync_HyperlinkClickCallback(this.Selection.Data.Value.Get_Value());
                this.Selection.Data.Value.Set_Visited(true);

                if (this.DrawingDocument.m_oLogicDocument)
                {
                    if (editor.isDocumentEditor)
                    {
                        for (var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++)
                            this.DrawingDocument.OnRecalculatePage(PageIdx, this.DrawingDocument.m_oLogicDocument.Pages[PageIdx]);
                    }
                    else
                    {
                        this.DrawingDocument.OnRecalculatePage(PageIdx, this.DrawingDocument.m_oLogicDocument.Slides[PageIdx]);
                    }
                    this.DrawingDocument.OnEndRecalculate(false, true);
                }
            }
        }
        else
        {
            this.Selection.Use = true;
        }

        return;
    }
    else if (Direction > 0)
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
    if (Direction > 0 && type_Paragraph === this.Content[Start].GetType() && true === this.Content[Start].Selection_IsEmpty() && this.Content[Start].Selection.StartPos == this.Content[Start].Content.length - 1)
    {
        this.Content[Start].Selection.StartPos = this.Content[Start].Internal_GetEndPos();
        this.Content[Start].Selection.EndPos   = this.Content[Start].Content.length - 1;
    }

    var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, this.CurPage);
    this.Content[ContentPos].Selection_SetEnd(X, Y, ElementPageIndex, MouseEvent);

    for (var Index = Start; Index <= End; Index++)
    {
        var Item           = this.Content[Index];
        var ItemType       = Item.GetType();
        Item.Selection.Use = true;

        switch (Index)
        {
            case Start:

                if (type_Paragraph === ItemType)
                {
                    Item.Selection_SetBegEnd(( Direction > 0 ? false : true ), false);
                }
                else //if ( type_Table === ItemType )
                {
                    var Row  = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos  = {Row : Row, Cell : Cell};

                    if (Direction > 0)
                        Item.Selection.EndPos.Pos = Pos;
                    else
                        Item.Selection.StartPos.Pos = Pos;

                    Item.Internal_Selection_UpdateCells();
                }

                break;

            case End:

                if (type_Paragraph === ItemType)
                {
                    Item.Selection_SetBegEnd(( Direction > 0 ? true : false ), true);
                }
                else //if ( type_Table === ItemType )
                {
                    var Pos = {Row : 0, Cell : 0};

                    if (Direction > 0)
                        Item.Selection.StartPos.Pos = Pos;
                    else
                        Item.Selection.EndPos.Pos = Pos;

                    Item.Internal_Selection_UpdateCells();
                }

                break;

            default:

                if (type_Paragraph === ItemType)
                {
                    Item.Select_All(Direction);
                }
                else //if ( type_Table === ItemType )
                {
                    var Row  = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos0 = {Row : 0, Cell : 0};
                    var Pos1 = {Row : Row, Cell : Cell};

                    if (Direction > 0)
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
};
CDocumentContent.prototype.Selection_Stop            = function(X, Y, CurPage, MouseEvent)
{
    if (true != this.Selection.Use)
        return;

    var _Y = Y;
    var _X = X;
    if (CurPage < 0)
    {
        CurPage = 0;
        _Y      = -1; // -1, чтобы избежать погрешностей
        _X      = -1; // -1, чтобы избежать погрешностей
    }
    else if (CurPage >= this.Pages.length)
    {
        CurPage = this.Pages.length - 1;
        _Y      = this.Pages[CurPage].YLimit + 1; // +1, чтобы избежать погрешностей
        _X      = this.Pages[CurPage].XLimit + 1; // +1, чтобы избежать погрешностей
    }
    else
    {
        if (0 === CurPage && Y < this.Pages[0].Bounds.Top)
            _X = -1;
        else if (this.Pages.length - 1 === CurPage && Y > this.Pages[this.Pages.length - 1].Bounds.Bottom)
            _X = this.Pages[this.Pages.length - 1].XLimit + 1;
    }

    var _MouseEvent = {ClickCount : 1, Type : AscCommon.g_mouse_event_type_up};
    this.Selection_SetEnd(_X, _Y, CurPage, _MouseEvent);
};
CDocumentContent.prototype.Selection_Check           = function(X, Y, CurPage, NearPos)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.DrawingObjects.selectionCheck(X, Y, this.Get_AbsolutePage(CurPage), NearPos);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use || true === this.ApplyToAll)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Common:
                {
                    var Start = this.Selection.StartPos;
                    var End   = this.Selection.EndPos;

                    if (Start > End)
                    {
                        Start = this.Selection.EndPos;
                        End   = this.Selection.StartPos;
                    }

                    if (undefined !== NearPos)
                    {
                        if (true === this.ApplyToAll)
                        {
                            Start = 0;
                            End   = this.Content.length - 1;
                        }

                        for (var Index = Start; Index <= End; Index++)
                        {
                            if (true === this.ApplyToAll)
                                this.Content[Index].Set_ApplyToAll(true);

                            if (true === this.Content[Index].Selection_Check(0, 0, 0, NearPos))
                            {
                                if (true === this.ApplyToAll)
                                    this.Content[Index].Set_ApplyToAll(false);

                                return true;
                            }

                            if (true === this.ApplyToAll)
                                this.Content[Index].Set_ApplyToAll(false);
                        }

                        return false;
                    }
                    else
                    {
                        var ContentPos = this.Internal_GetContentPosByXY(X, Y, CurPage);
                        if (ContentPos > Start && ContentPos < End)
                        {
                            return true;
                        }
                        else if (ContentPos < Start || ContentPos > End)
                        {
                            return false;
                        }
                        else
                        {
                            var ElementPageIndex = this.private_GetElementPageIndexByXY(ContentPos, X, Y, CurPage);
                            return this.Content[ContentPos].Selection_Check(X, Y, ElementPageIndex, NearPos);
                        }

                        return false;
                    }
                }
                case selectionflag_Numbering :
                    return false;
            }

            return false;
        }

        return false;
    }
};
CDocumentContent.prototype.Selection_IsEmpty         = function(bCheckHidden)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        return this.LogicDocument.DrawingObjects.selectionIsEmpty(bCheckHidden);
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            // Выделение нумерации
            if (selectionflag_Numbering == this.Selection.Flag)
                return false;
            // Обрабатываем движение границы у таблиц
            else if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType())
                return false;
            else
            {
                if (this.Selection.StartPos === this.Selection.EndPos)
                    return this.Content[this.Selection.StartPos].Selection_IsEmpty(bCheckHidden);
                else
                    return false;
            }
        }

        return true;
    }
};
// Селектим все содержимое
CDocumentContent.prototype.Select_All                = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type && true === this.DrawingObjects.isSelectedText())
    {
        this.DrawingObjects.selectAll();
    }
    else
    {
        if (true === this.Selection.Use)
            this.Selection_Remove();

        this.CurPos.Type     = docpostype_Content;
        this.Selection.Use   = true;
        this.Selection.Start = false;
        this.Selection.Flag  = selectionflag_Common;

        this.Selection.StartPos = 0;
        this.Selection.EndPos   = this.Content.length - 1;

        for (var Index = 0; Index < this.Content.length; Index++)
        {
            this.Content[Index].Select_All();
        }
    }
};
CDocumentContent.prototype.Select_DrawingObject      = function(Id)
{
    this.Selection_Remove();

    this.Parent.Set_CurrentElement(true, this.Get_StartPage_Absolute() + this.CurPage);

    // Прячем курсор
    this.DrawingDocument.TargetEnd();
    this.DrawingDocument.SetCurrentPage(this.Get_StartPage_Absolute() + this.CurPage);

    var HdrFtr = this.Is_HdrFtr(true);
    if (null != HdrFtr)
    {
        HdrFtr.Content.CurPos.Type     = docpostype_DrawingObjects;
        HdrFtr.Content.Selection.Use   = true;
        HdrFtr.Content.Selection.Start = false;

        this.LogicDocument.Selection.Use   = true;
        this.LogicDocument.Selection.Start = false;
    }
    else
    {
        this.LogicDocument.CurPos.Type     = docpostype_DrawingObjects;
        this.LogicDocument.Selection.Use   = true;
        this.LogicDocument.Selection.Start = false;
    }

    this.LogicDocument.DrawingObjects.selectById(Id, this.Get_StartPage_Absolute() + this.CurPage);

    // TODO: Пока сделаем так, в будущем надо сделать функцию, которая у родительского класса обновляет Select
    editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
};
CDocumentContent.prototype.Document_SelectNumbering  = function(NumPr, Index)
{
    this.Selection_Remove();

    this.Selection.Use      = true;
    this.Selection.Flag     = selectionflag_Numbering;
    this.Selection.Data     = [];
    this.Selection.StartPos = Index;
    this.Selection.EndPos   = Index;

    for (var Index = 0; Index < this.Content.length; Index++)
    {
        var Item      = this.Content[Index];
        var ItemNumPr = null;
        if (type_Paragraph == Item.GetType() && undefined != ( ItemNumPr = Item.Numbering_Get() ) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl)
        {
            this.Selection.Data.push(Index);
            Item.Selection_SelectNumbering();
        }
    }

    this.DrawingDocument.SelectEnabled(true);

    this.LogicDocument.Document_UpdateSelectionState();

    this.Interface_Update_ParaPr();
    this.Interface_Update_TextPr();
};
// Если сейчас у нас заселекчена нумерация, тогда убираем селект
CDocumentContent.prototype.Remove_NumberingSelection = function()
{
    if (true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag)
        this.Selection_Remove();
};
//-----------------------------------------------------------------------------------
// Функции для работы с таблицами
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Table_AddRow      = function(bBefore)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableAddRow(bBefore);
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        this.Content[Pos].Row_Add(bBefore);
        if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse())
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos   = Pos;
        }

        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_AddCol      = function(bBefore)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableAddCol(bBefore);
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        this.Content[Pos].Col_Add(bBefore);
        if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse())
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos   = Pos;
        }

        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_RemoveRow   = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableRemoveRow();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        if (false === this.Content[Pos].Row_Remove())
            this.Table_RemoveTable();

        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_RemoveCol   = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableRemoveCol();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        if (false === this.Content[Pos].Col_Remove())
            this.Table_RemoveTable();

        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_MergeCells  = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableMergeCells();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        this.Content[Pos].Cell_Merge();
        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_SplitCell   = function(Cols, Rows)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableSplitCell();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        this.Content[Pos].Cell_Split(Rows, Cols);
        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_RemoveTable = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableRemoveTable();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        var Table = this.Content[Pos];
        if (true === Table.Is_InnerTable())
            Table.Remove_InnerTable();
        else
        {
            this.Selection_Remove();
            Table.PreDelete();
            this.Internal_Content_Remove(Pos, 1);

            if (Pos >= this.Content.length - 1)
                Pos--;

            if (Pos < 0)
                Pos = 0;

            this.CurPos.Type       = docpostype_Content;
            this.CurPos.ContentPos = Pos;
            this.Content[Pos].Cursor_MoveToStartPos();
            this.Recalculate();
        }

        return true;
    }
    return false;
};
CDocumentContent.prototype.Table_Select      = function(Type)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableSelect(Type);
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        this.Content[Pos].Table_Select(Type);
        if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse())
        {
            this.Selection.Use      = true;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos   = Pos;
        }
        return true;
    }

    return false;
};
CDocumentContent.prototype.Table_CheckMerge  = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableCheckMerge();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        return this.Content[Pos].Check_Merge();
    }

    return false;
};
CDocumentContent.prototype.Table_CheckSplit  = function()
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.tableCheckSplit();
    }
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType() ) || ( false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType() ) ))
    {
        var Pos = 0;
        if (true === this.Selection.Use)
            Pos = this.Selection.StartPos;
        else
            Pos = this.CurPos.ContentPos;

        return this.Content[Pos].Check_Split();
    }

    return false;
};
//-----------------------------------------------------------------------------------
// Вспомогательные(внутренние ) функции
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Internal_GetContentPosByXY = function(X, Y, PageNum)
{
    if (undefined === PageNum)
        PageNum = this.CurPage;

    // TODO: изенить здесь
    PageNum = Math.min(PageNum, this.Pages.length - 1);

    // Сначала проверим Flow-таблицы
    var FlowTable = this.LogicDocument && this.LogicDocument.DrawingObjects.getTableByXY(X, Y, PageNum + this.Get_StartPage_Absolute(), this);
    if (null != FlowTable)
        return FlowTable.Table.Index;

    var StartPos = Math.min(this.Pages[PageNum].Pos, this.Content.length - 1);
    var EndPos   = this.Content.length - 1;

    if (PageNum < this.Pages.length - 1)
        EndPos = Math.min(this.Pages[PageNum + 1].Pos, EndPos);

    // Сохраним позиции всех Inline элементов на данной странице
    var InlineElements = [];
    for (var Index = StartPos; Index <= EndPos; Index++)
    {
        var Item = this.Content[Index];
        if (type_Table != Item.GetType() || false != Item.Is_Inline())
            InlineElements.push(Index);
    }

    var Count = InlineElements.length;
    if (Count <= 0)
        return StartPos;

    for (var Pos = 0; Pos < Count - 1; Pos++)
    {
        var Item = this.Content[InlineElements[Pos + 1]];

        if (Y < Item.Pages[0].Bounds.Top)
            return InlineElements[Pos];

        if (Item.Pages.length > 1)
        {
            if (true !== Item.Is_StartFromNewPage())
                return InlineElements[Pos + 1];

            return InlineElements[Pos];
        }

        if (Pos === Count - 2)
        {
            // Такое возможно, если страница заканчивается Flow-таблицей
            return InlineElements[Count - 1];
        }
    }

    return InlineElements[0];
};
CDocumentContent.prototype.Internal_Content_Find      = function(Id)
{
    for (var Index = 0; Index < this.Content.length; Index++)
    {
        if (this.Content[Index].GetId() === Id)
            return Index;
    }

    return -1;
};
CDocumentContent.prototype.Internal_CheckCurPage      = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        // TODO: переделать
        this.CurPage = 0;
    }
    else if (docpostype_Content === this.CurPos.Type)
    {
        if (true === this.Selection.Use)
        {
            this.CurPage = this.Content[this.Selection.EndPos].Get_CurrentPage_Relative();
        }
        else if (this.CurPos.ContentPos >= 0)
        {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Relative();
        }
    }
};
CDocumentContent.prototype.Internal_Content_Add       = function(Position, NewObject, bCheckTable)
{
    // Position = this.Content.length  допускается
    if (Position < 0 || Position > this.Content.length)
        return;

    var PrevObj = this.Content[Position - 1];
    var NextObj = this.Content[Position];

    if ("undefined" == typeof(PrevObj))
        PrevObj = null;

    if ("undefined" == typeof(NextObj))
        NextObj = null;

    this.private_RecalculateNumbering([NewObject]);
    History.Add(this, {Type : AscDFH.historyitem_DocumentContent_AddItem, Pos : Position, Item : NewObject});
    this.Content.splice(Position, 0, NewObject);
    NewObject.Set_Parent(this);
    NewObject.Set_DocumentNext(NextObj);
    NewObject.Set_DocumentPrev(PrevObj);

    if (null != PrevObj)
        PrevObj.Set_DocumentNext(NewObject);

    if (null != NextObj)
        NextObj.Set_DocumentPrev(NewObject);

    if (Position <= this.CurPos.TableMove)
        this.CurPos.TableMove++;

    // Проверим, что последний элемент не таблица
    if (false != bCheckTable && type_Table == this.Content[this.Content.length - 1].GetType())
        this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit, this.bPresentation === true));

    this.private_ReindexContent(Position);
};
CDocumentContent.prototype.Internal_Content_Remove    = function(Position, Count)
{
    if (Position < 0 || Position >= this.Content.length || Count <= 0)
        return;

    var PrevObj = this.Content[Position - 1];
    var NextObj = this.Content[Position + Count];

    if ("undefined" == typeof(PrevObj))
        PrevObj = null;

    if ("undefined" == typeof(NextObj))
        NextObj = null;

    for (var Index = 0; Index < Count; Index++)
        this.Content[Position + Index].PreDelete();

    History.Add(this, {
        Type  : AscDFH.historyitem_DocumentContent_RemoveItem,
        Pos   : Position,
        Items : this.Content.slice(Position, Position + Count)
    });
    var Elements = this.Content.splice(Position, Count);
    this.private_RecalculateNumbering(Elements);

    if (null != PrevObj)
        PrevObj.Set_DocumentNext(NextObj);

    if (null != NextObj)
        NextObj.Set_DocumentPrev(PrevObj);

    // Проверим, что последний элемент не таблица
    if (type_Table == this.Content[this.Content.length - 1].GetType())
        this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit, this.bPresentation === true));

    this.private_ReindexContent(Position);
};
CDocumentContent.prototype.Clear_ContentChanges       = function()
{
    this.m_oContentChanges.Clear();
};
CDocumentContent.prototype.Add_ContentChanges         = function(Changes)
{
    this.m_oContentChanges.Add(Changes);
};
CDocumentContent.prototype.Refresh_ContentChanges     = function()
{
    this.m_oContentChanges.Refresh();
};
CDocumentContent.prototype.Internal_Content_RemoveAll = function()
{
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++)
        this.Content[Index].PreDelete();

    History.Add(this, {
        Type  : AscDFH.historyitem_DocumentContent_RemoveItem,
        Pos   : 0,
        Items : this.Content.slice(0, this.Content.length)
    });
    this.Content = [];
};
//-----------------------------------------------------------------------------------
// Функции для работы с номерами страниц
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Get_StartPage_Absolute = function()
{
    return this.Get_AbsolutePage(0);
};
CDocumentContent.prototype.Get_StartPage_Relative = function()
{
    return this.StartPage;
};
CDocumentContent.prototype.Get_AbsolutePage       = function(CurPage)
{
    return this.Parent.Get_AbsolutePage(this.StartPage + CurPage);
};
CDocumentContent.prototype.Get_AbsoluteColumn     = function(CurPage)
{
    return this.Parent.Get_AbsoluteColumn(this.StartPage + CurPage);
};
CDocumentContent.prototype.Set_StartPage          = function(StartPage)
{
    this.StartPage = StartPage;
};
// Приходит абсолютное значение страницы(по отношению к родительскому классу), на выходе - относительное
CDocumentContent.prototype.Get_Page_Relative      = function(AbsPage)
{
    return Math.min(this.Pages.length - 1, Math.max(AbsPage - this.StartPage, 0));
};
//-----------------------------------------------------------------------------------
// Undo/Redo функции
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Undo                            = function(Data)
{
    var Type = Data.Type;

    switch (Type)
    {
        case AscDFH.historyitem_DocumentContent_AddItem:
        {
            var Elements = this.Content.splice(Data.Pos, 1);
            this.private_RecalculateNumbering(Elements);

            break;
        }

        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            var Pos = Data.Pos;

            var Array_start = this.Content.slice(0, Pos);
            var Array_end   = this.Content.slice(Pos);

            this.Content = Array_start.concat(Data.Items, Array_end);
            this.private_RecalculateNumbering(Data.Items);

            break;
        }
    }
};
CDocumentContent.prototype.Redo                            = function(Data)
{
    var Type = Data.Type;

    switch (Type)
    {
        case AscDFH.historyitem_DocumentContent_AddItem:
        {
            var Pos = Data.Pos;
            this.Content.splice(Pos, 0, Data.Item);
            this.private_RecalculateNumbering([Data.Item]);

            break;
        }

        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            var Elements = this.Content.splice(Data.Pos, Data.Items.length);
            this.private_RecalculateNumbering(Elements);

            break;
        }
    }
};
CDocumentContent.prototype.Get_SelectionState              = function()
{
    var DocState    = {};
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

    var State = null;

    if (this.LogicDocument && true === editor.isStartAddShape && docpostype_DrawingObjects === this.CurPos.Type)
    {
        DocState.CurPos.Type     = docpostype_Content;
        DocState.Selection.Start = false;
        DocState.Selection.Use   = false;

        this.Content[DocState.CurPos.ContentPos].Selection_Remove();
        State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
    }
    else
    {
        // Работаем с колонтитулом
        if (docpostype_DrawingObjects === this.CurPos.Type)
            State = this.LogicDocument.DrawingObjects.getSelectionState();
        else if (docpostype_Content === this.CurPos.Type)
        {
            if (true === this.Selection.Use)
            {
                // Выделение нумерации
                if (selectionflag_Numbering == this.Selection.Flag)
                    State = [];
                else
                {
                    var StartPos = this.Selection.StartPos;
                    var EndPos   = this.Selection.EndPos;
                    if (StartPos > EndPos)
                    {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos   = Temp;
                    }

                    State = [];

                    var TempState = [];
                    for (var Index = StartPos; Index <= EndPos; Index++)
                    {
                        TempState.push(this.Content[Index].Get_SelectionState());
                    }

                    State.push(TempState);
                }
            }
            else
                State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
        }
    }

    State.push(DocState);
    return State;
};
CDocumentContent.prototype.Set_SelectionState              = function(State, StateIndex)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
        this.LogicDocument.DrawingObjects.resetSelection();

    if (State.length <= 0)
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
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        this.LogicDocument.DrawingObjects.setSelectionState(State, NewStateIndex);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            if (selectionflag_Numbering == this.Selection.Flag)
            {
                if (type_Paragraph === this.Content[this.Selection.StartPos].Get_Type())
                {
                    var NumPr = this.Content[this.Selection.StartPos].Numbering_Get();
                    if (undefined !== NumPr)
                        this.Document_SelectNumbering(NumPr, this.Selection.StartPos);
                    else
                        this.LogicDocument.Selection_Remove();
                }
                else
                    this.LogicDocument.Selection_Remove();
            }
            else
            {
                var StartPos = this.Selection.StartPos;
                var EndPos   = this.Selection.EndPos;
                if (StartPos > EndPos)
                {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos   = Temp;
                }

                var CurState = State[NewStateIndex];

                for (var Index = StartPos; Index <= EndPos; Index++)
                {
                    this.Content[Index].Set_SelectionState(CurState[Index - StartPos], CurState[Index - StartPos].length - 1);
                }
            }
        }
        else
            this.Content[this.CurPos.ContentPos].Set_SelectionState(State, NewStateIndex);
    }
};
CDocumentContent.prototype.Get_ParentObject_or_DocumentPos = function()
{
    return this.Parent.Get_ParentObject_or_DocumentPos();
};
CDocumentContent.prototype.Refresh_RecalcData              = function(Data)
{
    var bNeedRecalc = false;

    var Type = Data.Type;

    var CurPage = 0;

    switch (Type)
    {
        case AscDFH.historyitem_DocumentContent_AddItem:
        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            for (CurPage = this.Pages.length - 1; CurPage > 0; CurPage--)
            {
                if (Data.Pos > this.Pages[CurPage].Pos)
                    break;
            }

            bNeedRecalc = true;
            break;
        }
    }

    this.Refresh_RecalcData2(0, CurPage);
};
CDocumentContent.prototype.Refresh_RecalcData2             = function(Index, Page_rel)
{
    this.Parent.Refresh_RecalcData2(this.StartPage + Page_rel);
};
//-----------------------------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Hyperlink_Add    = function(HyperProps)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.hyperlinkAdd(HyperProps);
    }
    // Либо у нас нет выделения, либо выделение внутри одного элемента
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ))
    {
        var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
        this.Content[Pos].Hyperlink_Add(HyperProps);
        this.Recalculate();
    }
};
CDocumentContent.prototype.Hyperlink_Modify = function(HyperProps)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.hyperlinkModify(HyperProps);
    }
    // Либо у нас нет выделения, либо выделение внутри одного элемента
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ))
    {
        var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
        if (true === this.Content[Pos].Hyperlink_Modify(HyperProps))
            this.Recalculate();
    }
};
CDocumentContent.prototype.Hyperlink_Remove = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.hyperlinkRemove();
    }
    // Либо у нас нет выделения, либо выделение внутри одного элемента
    else if (docpostype_Content == this.CurPos.Type && ( ( true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos ) || ( false == this.Selection.Use ) ))
    {
        var Pos = ( true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos );
        this.Content[Pos].Hyperlink_Remove();
    }
};
CDocumentContent.prototype.Hyperlink_CanAdd = function(bCheckInHyperlink)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.hyperlinkCanAdd(bCheckInHyperlink);
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Numbering:
                    return false;
                case selectionflag_Common:
                {
                    if (this.Selection.StartPos != this.Selection.EndPos)
                        return false;

                    return this.Content[this.Selection.StartPos].Hyperlink_CanAdd(bCheckInHyperlink);
                }
            }
        }
        else
            return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd(bCheckInHyperlink);
    }

    return false;
};
CDocumentContent.prototype.Hyperlink_Check  = function(bCheckEnd)
{
    if (docpostype_DrawingObjects == this.CurPos.Type)
    {
        return this.LogicDocument.DrawingObjects.hyperlinkCheck(bCheckEnd);
    }
    else //if ( docpostype_Content == this.CurPos.Type )
    {
        if (true === this.Selection.Use)
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Numbering:
                    return null;
                case selectionflag_Common:
                {
                    if (this.Selection.StartPos != this.Selection.EndPos)
                        return null;

                    return this.Content[this.Selection.StartPos].Hyperlink_Check(bCheckEnd);
                }
            }
        }
        else
            return this.Content[this.CurPos.ContentPos].Hyperlink_Check(bCheckEnd);
    }

    return null;
};
//-----------------------------------------------------------------------------------
// Функции для работы с совместным редактирования
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Save_Changes        = function(Data, Writer)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    Writer.WriteLong(AscDFH.historyitem_type_DocumentContent);

    var Type = Data.Type;

    // Пишем тип
    Writer.WriteLong(Type);

    switch (Type)
    {
        case  AscDFH.historyitem_DocumentContent_AddItem:
        {
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long   : Позиция
            //    String : Id элемента
            //  }

            var bArray = Data.UseArray;
            var Count  = 1;

            Writer.WriteLong(Count);

            for (var Index = 0; Index < Count; Index++)
            {
                if (true === bArray)
                    Writer.WriteLong(Data.PosArray[Index]);
                else
                    Writer.WriteLong(Data.Pos + Index);

                Writer.WriteString2(Data.Item.Get_Id());
            }

            break;
        }

        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var bArray = Data.UseArray;
            var Count  = Data.Items.length;

            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var RealCount = Count;

            for (var Index = 0; Index < Count; Index++)
            {
                if (true === bArray)
                {
                    if (false === Data.PosArray[Index])
                        RealCount--;
                    else
                        Writer.WriteLong(Data.PosArray[Index]);
                }
                else
                    Writer.WriteLong(Data.Pos);
            }

            var EndPos = Writer.GetCurPosition();
            Writer.Seek(StartPos);
            Writer.WriteLong(RealCount);
            Writer.Seek(EndPos);

            break;
        }
    }

    return Writer;
};
CDocumentContent.prototype.Save_Changes2       = function(Data, Writer)
{
    var bRetValue = false;
    var Type      = Data.Type;
    switch (Type)
    {
        case AscDFH.historyitem_DocumentContent_AddItem:
        {
            break;
        }

        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            break;
        }
    }

    return bRetValue;
};
CDocumentContent.prototype.Load_Changes        = function(Reader, Reader2)
{
    // Сохраняем изменения из тех, которые используются для Undo/Redo в бинарный файл.
    // Long : тип класса
    // Long : тип изменений

    var ClassType = Reader.GetLong();
    if (AscDFH.historyitem_type_DocumentContent != ClassType)
        return;

    var Type = Reader.GetLong();

    switch (Type)
    {
        case AscDFH.historyitem_DocumentContent_AddItem:
        {
            // Long     : Количество элементов
            // Array of :
            //  {
            //    Long   : Позиция
            //    String : Id элемента
            //  }

            var Count = Reader.GetLong();

            for (var Index = 0; Index < Count; Index++)
            {
                var Pos     = this.m_oContentChanges.Check(AscCommon.contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());

                if (null != Element)
                {
                    if (Pos > 0)
                    {
                        this.Content[Pos - 1].Next = Element;
                        Element.Prev               = this.Content[Pos - 1];
                    }

                    if (Pos <= this.Content.length - 1)
                    {
                        this.Content[Pos].Prev = Element;
                        Element.Next           = this.Content[Pos];
                    }

                    Element.Parent = this;

                    this.Content.splice(Pos, 0, Element);
                    this.private_RecalculateNumbering([Element]);
                    AscCommon.CollaborativeEditing.Update_DocumentPositionsOnAdd(this, Pos);
                    this.private_ReindexContent(Pos);
                }
            }

            break;
        }

        case AscDFH.historyitem_DocumentContent_RemoveItem:
        {
            // Long          : Количество удаляемых элементов
            // Array of Long : позиции удаляемых элементов

            var Count = Reader.GetLong();

            for (var Index = 0; Index < Count; Index++)
            {
                var Pos = this.m_oContentChanges.Check(AscCommon.contentchanges_Remove, Reader.GetLong());

                // действие совпало, не делаем его
                if (false === Pos)
                    continue;

                var Elements = this.Content.splice(Pos, 1);
                this.private_RecalculateNumbering(Elements);
                AscCommon.CollaborativeEditing.Update_DocumentPositionsOnRemove(this, Pos, 1);
                this.private_ReindexContent(Pos);

                if (Pos > 0)
                {
                    if (Pos <= this.Content.length - 1)
                    {
                        this.Content[Pos - 1].Next = this.Content[Pos];
                        this.Content[Pos].Prev     = this.Content[Pos - 1];
                    }
                    else
                    {
                        this.Content[Pos - 1].Next = null;
                    }
                }
                else if (Pos <= this.Content.length - 1)
                {
                    this.Content[Pos].Prev = null;
                }
            }

            break;
        }
    }

    return true;
};
CDocumentContent.prototype.Write_ToBinary2     = function(Writer)
{
    Writer.WriteLong(AscDFH.historyitem_type_DocumentContent);

    // String : Id текущего элемента
    // Long   : StartPage
    // String : Id родительского класса
    // Bool   : TurnOffInnerWrap
    // Bool   : Split
    // Long   : Количество элементов в массиве this.Content
    // Array of string : массив Id элементов

    Writer.WriteString2(this.Id);
    Writer.WriteLong(this.StartPage);
    Writer.WriteString2(this.Parent.Get_Id());
    Writer.WriteBool(this.TurnOffInnerWrap);
    Writer.WriteBool(this.Split);
    AscFormat.writeBool(Writer, this.bPresentation);


    var ContentToWrite;
    if (this.StartState)
    {
        ContentToWrite = this.StartState.Content;
    }
    else
    {
        ContentToWrite = this.Content;
    }

    var Count = ContentToWrite.length;
    Writer.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++)
        Writer.WriteString2(ContentToWrite[Index].Get_Id());

    if (this.Parent && this.Parent.Get_Worksheet)
    {
        Writer.WriteBool(true);
        var worksheet = this.Parent.Get_Worksheet();
        if (worksheet)
        {
            Writer.WriteBool(true);
            Writer.WriteString2(worksheet.getId())
        }
        else
        {
            Writer.WriteBool(false);
        }
    }
    else
    {
        Writer.WriteBool(false);
    }
};
CDocumentContent.prototype.Read_FromBinary2    = function(Reader)
{
    // String : Id текущего элемента
    // Long   : StartPage
    // String : Id родительского класса
    // Bool   : TurnOffInnerWrap
    // Bool   : Split
    // Long   : Количество элементов в массиве this.Content
    // Array of string : массив Id элементов

    var LinkData = {};

    this.Id               = Reader.GetString2();
    this.StartPage        = Reader.GetLong();
    LinkData.Parent       = Reader.GetString2();
    this.TurnOffInnerWrap = Reader.GetBool();
    this.Split            = Reader.GetBool();
    this.bPresentation    = AscFormat.readBool(Reader);

    var Count    = Reader.GetLong();
    this.Content = [];
    for (var Index = 0; Index < Count; Index++)
    {
        var Element = g_oTableId.Get_ById(Reader.GetString2());
        if (null != Element)
        {
            this.Content.push(Element);
            Element.Parent = this;
        }
    }

    AscCommon.CollaborativeEditing.Add_LinkData(this, LinkData);

    var b_worksheet = Reader.GetBool();
    if (b_worksheet)
    {
        this.Parent        = g_oTableId.Get_ById(LinkData.Parent);
        var b_worksheet_id = Reader.GetBool();
        if (b_worksheet_id)
        {
            var id  = Reader.GetString2();
            var api = window["Asc"]["editor"];
            if (api.wb)
            {
                var worksheet = api.wbModel.getWorksheetById(id);
                if (worksheet)
                {
                    this.DrawingDocument = worksheet.DrawingDocument;
                }
            }
        }
    }
    else
    {
        var DrawingDocument;
        if (editor && editor.WordControl && editor.WordControl.m_oDrawingDocument)
            DrawingDocument = editor.WordControl.m_oDrawingDocument;
        if (undefined !== DrawingDocument && null !== DrawingDocument)
        {
            this.DrawingDocument = DrawingDocument;

            if (undefined !== editor && true === editor.isDocumentEditor)
            {
                this.LogicDocument  = DrawingDocument.m_oLogicDocument;
                this.Styles         = DrawingDocument.m_oLogicDocument.Get_Styles();
                this.Numbering      = DrawingDocument.m_oLogicDocument.Get_Numbering();
                this.DrawingObjects = DrawingDocument.m_oLogicDocument.DrawingObjects; // Массив укзателей на все инлайновые графические объекты
            }
        }
    }
};
CDocumentContent.prototype.Load_LinkData       = function(LinkData)
{
    if ("undefined" != typeof(LinkData.Parent))
        this.Parent = g_oTableId.Get_ById(LinkData.Parent);

    if (this.Parent.getDrawingDocument)
    {
        this.DrawingDocument = this.Parent.getDrawingDocument();
        for (var i = 0; i < this.Content.length; ++i)
        {
            this.Content[i].DrawingDocument = this.DrawingDocument;
        }
    }
};
CDocumentContent.prototype.Get_SelectionState2 = function()
{
    // Сохраняем Id ближайшего элемента в текущем классе
    var State = new CDocumentSelectionState();

    State.Id   = this.Get_Id();
    State.Type = docpostype_Content;

    var Element = this.Content[this.CurPos.ContentPos]
    State.Data  = Element.Get_SelectionState2();

    return State;
};
CDocumentContent.prototype.Set_SelectionState2 = function(State)
{
    var ElementId = State.Data.Id;

    var CurId = ElementId;

    var bFlag = false;

    var Pos = 0;

    // Найдем элемент с Id = CurId
    var Count = this.Content.length;
    for (Pos = 0; Pos < Count; Pos++)
    {
        if (this.Content[Pos].Get_Id() == CurId)
        {
            bFlag = true;
            break;
        }
    }

    if (true !== bFlag)
    {
        var TempElement = g_oTableId.Get_ById(CurId);
        Pos             = ( null != TempElement ? Math.min(this.Content.length - 1, TempElement.Index) : 0 );
    }

    this.Selection.Start    = false;
    this.Selection.Use      = false;
    this.Selection.StartPos = Pos;
    this.Selection.EndPos   = Pos;
    this.Selection.Flag     = selectionflag_Common;

    this.CurPos.Type       = docpostype_Content;
    this.CurPos.ContentPos = Pos;

    if (true !== bFlag)
        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
    else
    {
        this.Content[this.CurPos.ContentPos].Set_SelectionState2(State.Data);
    }
};
//-----------------------------------------------------------------------------------
// Функции для работы с комментариями
//-----------------------------------------------------------------------------------
CDocumentContent.prototype.Add_Comment            = function(Comment, bStart, bEnd)
{
    if (true === this.ApplyToAll)
    {
        if (this.Content.length <= 1 && true === bStart && true === bEnd)
        {
            this.Content[0].Set_ApplyToAll(true);
            this.Content[0].Add_Comment(Comment, true, true);
            this.Content[0].Set_ApplyToAll(false);
        }
        else
        {
            if (true === bStart)
            {
                this.Content[0].Set_ApplyToAll(true);
                this.Content[0].Add_Comment(Comment, true, false);
                this.Content[0].Set_ApplyToAll(false);
            }

            if (true === bEnd)
            {
                this.Content[this.Content.length - 1].Set_ApplyToAll(true);
                this.Content[this.Content.length - 1].Add_Comment(Comment, false, true);
                this.Content[this.Content.length - 1].Set_ApplyToAll(true);
            }
        }
    }
    else
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
        {
            return this.LogicDocument.DrawingObjects.addComment(Comment);
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            if (selectionflag_Numbering === this.Selection.Flag)
                return;

            if (true === this.Selection.Use)
            {
                var StartPos, EndPos;
                if (this.Selection.StartPos < this.Selection.EndPos)
                {
                    StartPos = this.Selection.StartPos;
                    EndPos   = this.Selection.EndPos;
                }
                else
                {
                    StartPos = this.Selection.EndPos;
                    EndPos   = this.Selection.StartPos;
                }

                if (StartPos === EndPos)
                    this.Content[StartPos].Add_Comment(Comment, bStart, bEnd);
                else
                {
                    if (true === bStart)
                        this.Content[StartPos].Add_Comment(Comment, true, false);

                    if (true === bEnd)
                        this.Content[EndPos].Add_Comment(Comment, false, true);
                }
            }
            else
            {
                this.Content[this.CurPos.ContentPos].Add_Comment(Comment, bStart, bEnd);
            }
        }
    }
};
CDocumentContent.prototype.CanAdd_Comment         = function()
{
    if (true === this.ApplyToAll)
    {
        if (this.Content.length > 1)
            return true;
        else
            return this.Content[0].CanAdd_Comment();
    }
    else
    {
        if (docpostype_DrawingObjects === this.CurPos.Type)
        {
            if (true != this.LogicDocument.DrawingObjects.isSelectedText())
                return true;
            else
                return this.LogicDocument.DrawingObjects.canAddComment();
        }
        else //if ( docpostype_Content === this.CurPos.Type )
        {
            switch (this.Selection.Flag)
            {
                case selectionflag_Numbering:
                    return false;
                case selectionflag_Common:
                {
                    if (true === this.Selection.Use && this.Selection.StartPos != this.Selection.EndPos)
                        return true;
                    else
                    {
                        var Pos     = ( this.Selection.Use === true ? this.Selection.StartPos : this.CurPos.ContentPos );
                        var Element = this.Content[Pos];
                        return Element.CanAdd_Comment();
                    }
                }
            }
        }
    }

    return false;
};
CDocumentContent.prototype.Get_SelectionBounds    = function()
{
    if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag)
    {
        var Start = this.Selection.StartPos;
        var End   = this.Selection.EndPos;

        if (Start > End)
        {
            Start = this.Selection.EndPos;
            End   = this.Selection.StartPos;
        }

        if (Start === End)
            return this.Content[Start].Get_SelectionBounds();
        else
        {
            var Result       = {};
            Result.Start     = this.Content[Start].Get_SelectionBounds().Start;
            Result.End       = this.Content[End].Get_SelectionBounds().End;
            Result.Direction = (this.Selection.StartPos > this.Selection.EndPos ? -1 : 1);
            return Result;
        }
    }

    return null;
};
CDocumentContent.prototype.Get_SelectionAnchorPos = function()
{
    var Pos = ( true === this.Selection.Use ? ( this.Selection.StartPos < this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos ) : this.CurPos.ContentPos );
    return this.Content[Pos].Get_SelectionAnchorPos();
};
CDocumentContent.prototype.Get_EndInfo            = function()
{
    var ContentLen = this.Content.length;
    if (ContentLen > 0)
        return this.Content[ContentLen - 1].Get_EndInfo();
    else
        return null;
};
CDocumentContent.prototype.Get_PrevElementEndInfo = function(CurElement)
{
    var PrevElement = CurElement.Get_DocumentPrev();

    if (null !== PrevElement && undefined !== PrevElement)
    {
        return PrevElement.Get_EndInfo();
    }
    else
    {
        return this.Parent.Get_PrevElementEndInfo(this);
    }
};
CDocumentContent.prototype.Get_TopElement = function()
{
    if (this.Parent)
        return this.Parent.Get_TopElement();

    return null;
};
CDocumentContent.prototype.Compare_DrawingsLogicPositions = function(CompareObject)
{
    for (var Index = 0, Count = this.Content.length; Index < Count; Index++)
    {
        var Element = this.Content[Index];
        Element.Compare_DrawingsLogicPositions(CompareObject);

        if (0 !== CompareObject.Result)
            return;
    }
};
CDocumentContent.prototype.Start_SelectionFromCurPos = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.startSelectionFromCurPos();
    }
    else //if (docpostype_Content === this.CurPos.Type)
    {
        this.Selection.Use      = true;
        this.Selection.Start    = false;
        this.Selection.StartPos = this.CurPos.ContentPos;
        this.Selection.EndPos   = this.CurPos.ContentPos;
        this.Content[this.CurPos.ContentPos].Start_SelectionFromCurPos();
    }
};
CDocumentContent.prototype.Get_StyleFromFormatting = function()
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        return this.DrawingObjects.Get_StyleFromFormatting();
    }
    else //if (docpostype_Content === this.CurPos.Type)
    {
        if (true == this.Selection.Use)
        {
            if (this.Selection.StartPos > this.Selection.EndPos)
                return this.Content[this.Selection.EndPos].Get_StyleFromFormatting();
            else
                return this.Content[this.Selection.StartPos].Get_StyleFromFormatting();
        }
        else
        {
            return this.Content[this.CurPos.ContentPos].Get_StyleFromFormatting();
        }
    }
};
CDocumentContent.prototype.Is_TrackRevisions = function()
{
    if (this.LogicDocument)
        return this.LogicDocument.Is_TrackRevisions();

    return false;
};
CDocumentContent.prototype.Get_SectPr = function()
{
    if (this.Parent && this.Parent.Get_SectPr)
        return this.Parent.Get_SectPr();

    return null;
};
CDocumentContent.prototype.Set_ParagraphFramePr = function(FramePr, bDelete)
{
    if (docpostype_DrawingObjects === this.CurPos.Type)
    {
        // Не добавляем и не работаем с рамками в автофигурах
        return;
    }
    else //if ( docpostype_Content === this.CurPos.Type )
    {
        if ( true === this.Selection.Use )
        {
            // Проверим, если у нас все выделенные элементы - параграфы, с одинаковыми настройками
            // FramePr, тогда мы можем применить новую настройку FramePr

            var StartPos = this.Selection.StartPos;
            var EndPos   = this.Selection.EndPos;

            if ( StartPos > EndPos )
            {
                StartPos = this.Selection.EndPos;
                EndPos   = this.Selection.StartPos;
            }

            var Element = this.Content[StartPos];

            if ( type_Paragraph != Element.GetType() || undefined === Element.Get_FramePr() )
                return;

            var FramePr = Element.Get_FramePr();
            for ( var Pos = StartPos + 1; Pos < EndPos; Pos++ )
            {
                var TempElement = this.Content[Pos];

                if ( type_Paragraph != TempElement.GetType() || undefined === TempElement.Get_FramePr() || true != FramePr.Compare( TempElement.Get_FramePr() ) )
                    return;
            }

            // Раз дошли до сюда, значит можно у всех выделенных параграфов менять настройку рамки
            var FrameParas = this.Content[StartPos].Internal_Get_FrameParagraphs();
            var FrameCount = FrameParas.length;
            for ( var Pos = 0; Pos < FrameCount; Pos++ )
            {
                FrameParas[Pos].Set_FramePr(FramePr, bDelete);
            }
        }
        else
        {
            var Element = this.Content[this.CurPos.ContentPos];

            if ( type_Paragraph != Element.GetType() )
                return;

            // Возможно, предыдущий элемент является буквицей
            if ( undefined === Element.Get_FramePr()  )
            {
                var PrevElement = Element.Get_DocumentPrev();

                if ( type_Paragraph != PrevElement.GetType() || undefined === PrevElement.Get_FramePr() || undefined === PrevElement.Get_FramePr().DropCap )
                    return;

                Element = PrevElement;
            }


            var FrameParas = Element.Internal_Get_FrameParagraphs();
            var FrameCount = FrameParas.length;
            for ( var Pos = 0; Pos < FrameCount; Pos++ )
            {
                FrameParas[Pos].Set_FramePr(FramePr, bDelete);
            }

        }
    }
};
CDocumentContent.prototype.Add_ToContent = function(Pos, Item)
{
    this.Internal_Content_Add(Pos, Item);
};
CDocumentContent.prototype.Remove_FromContent = function(Pos, Count)
{
    this.Internal_Content_Remove(Pos, Count);
};
CDocumentContent.prototype.Concat_Paragraphs = function(Pos)
{
    if (Pos < this.Content.length - 1 && type_Paragraph === this.Content[Pos].Get_Type() && type_Paragraph === this.Content[Pos + 1].Get_Type())
    {
        var Para1 = this.Content[Pos];
        var Para2 = this.Content[Pos + 1];

        var OldSelectionStartPos = this.Selection.StartPos;
        var OldSelectionEndPos   = this.Selection.EndPos;
        var OldCurPos            = this.CurPos.ContentPos;

        Para1.Concat(Para2);
        this.Remove_FromContent(Pos + 1, 1);

        if (OldCurPos > Pos)
            this.CurPos.ContentPos = OldCurPos - 1;

        if (OldSelectionStartPos > Pos)
            this.Selection.StartPos = OldSelectionStartPos - 1;

        if (OldSelectionEndPos > Pos)
            this.Selection.EndPos = OldSelectionEndPos - 1;
    }
};
CDocumentContent.prototype.Get_ElementsCount = function()
{
    return this.Content.length;
};
CDocumentContent.prototype.Get_ElementByIndex = function(Index)
{
    return this.Content[Index];
};
CDocumentContent.prototype.Get_ContentPosition = function(bSelection, bStart, PosArray)
{
    if (undefined === PosArray)
        PosArray = [];

    var Pos = (true === bSelection ? (true === bStart ? this.Selection.StartPos : this.Selection.EndPos) : this.CurPos.ContentPos);
    PosArray.push({Class : this, Position : Pos});

    if (undefined !== this.Content[Pos] && this.Content[Pos].Get_ContentPosition)
        this.Content[Pos].Get_ContentPosition(bSelection, bStart, PosArray);

    return PosArray;
};
CDocumentContent.prototype.Get_DocumentPositionFromObject = function(PosArray)
{
    if (!PosArray)
        PosArray = [];

    if (this.Parent && this.Parent.Get_DocumentPositionFromObject)
        this.Parent.Get_DocumentPositionFromObject(PosArray);

    return PosArray;
};
CDocumentContent.prototype.Set_ContentSelection = function(StartDocPos, EndDocPos, Depth, StartFlag, EndFlag)
{
    if ((0 === StartFlag && (!StartDocPos[Depth] || this !== StartDocPos[Depth].Class)) || (0 === EndFlag && (!EndDocPos[Depth] || this !== EndDocPos[Depth].Class)))
        return;

    if (this.Content.length <= 0)
        return;

    var StartPos = 0, EndPos = 0;
    switch (StartFlag)
    {
        case 0 : StartPos = StartDocPos[Depth].Position; break;
        case 1 : StartPos = 0; break;
        case -1: StartPos = this.Content.length - 1; break;
    }

    switch (EndFlag)
    {
        case 0 : EndPos = EndDocPos[Depth].Position; break;
        case 1 : EndPos = 0; break;
        case -1: EndPos = this.Content.length - 1; break;
    }

    var _StartDocPos = StartDocPos, _StartFlag = StartFlag;
    if (null !== StartDocPos && true === StartDocPos[Depth].Deleted)
    {
        if (StartPos < this.Content.length)
        {
            _StartDocPos = null;
            _StartFlag = 1;
        }
        else if (StartPos > 0)
        {
            StartPos--;
            _StartDocPos = null;
            _StartFlag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    var _EndDocPos = EndDocPos, _EndFlag = EndFlag;
    if (null !== EndDocPos && true === EndDocPos[Depth].Deleted)
    {
        if (EndPos < this.Content.length)
        {
            _EndDocPos = null;
            _EndFlag = 1;
        }
        else if (EndPos > 0)
        {
            EndPos--;
            _EndDocPos = null;
            _EndFlag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    StartPos = Math.min(this.Content.length - 1, Math.max(0, StartPos));
    EndPos   = Math.min(this.Content.length - 1, Math.max(0, EndPos));

    this.Selection.Use      = true;
    this.Selection.StartPos = StartPos;
    this.Selection.EndPos   = EndPos;

    if (StartPos !== EndPos)
    {
        this.Content[StartPos].Set_ContentSelection(_StartDocPos, null, Depth + 1, _StartFlag, StartPos > EndPos ? 1 : -1);
        this.Content[EndPos].Set_ContentSelection(null, _EndDocPos, Depth + 1, StartPos > EndPos ? -1 : 1, _EndFlag);

        var _StartPos = StartPos;
        var _EndPos = EndPos;
        var Direction = 1;

        if (_StartPos > _EndPos)
        {
            _StartPos = EndPos;
            _EndPos = StartPos;
            Direction = -1;
        }

        for (var CurPos = _StartPos + 1; CurPos < _EndPos; CurPos++)
        {
            this.Content[CurPos].Select_All(Direction);
        }
    }
    else
    {
        this.Content[StartPos].Set_ContentSelection(_StartDocPos, _EndDocPos, Depth + 1, _StartFlag, _EndFlag);
    }
};
CDocumentContent.prototype.Set_ContentPosition = function(DocPos, Depth, Flag)
{
    if (0 === Flag && (!DocPos[Depth] || this !== DocPos[Depth].Class))
        return;

    if (this.Content.length <= 0)
        return;

    var Pos = 0;
    switch (Flag)
    {
        case 0 : Pos = DocPos[Depth].Position; break;
        case 1 : Pos = 0; break;
        case -1: Pos = this.Content.length - 1; break;
    }

    var _DocPos = DocPos, _Flag = Flag;
    if (null !== DocPos && true === DocPos[Depth].Deleted)
    {
        if (Pos < this.Content.length)
        {
            _DocPos = null;
            _Flag = 1;
        }
        else if (Pos > 0)
        {
            Pos--;
            _DocPos = null;
            _Flag = -1;
        }
        else
        {
            // Такого не должно быть
            return;
        }
    }

    Pos = Math.min(this.Content.length - 1, Math.max(0, Pos));
    this.CurPos.ContentPos = Pos;
    this.Content[Pos].Set_ContentPosition(_DocPos, Depth + 1, _Flag);
};
CDocumentContent.prototype.private_GetElementPageIndex = function(ElementPos, PageIndex, ColumnIndex, ColumnsCount)
{
    var Element = this.Content[ElementPos];
    if (!Element)
        return 0;

    var StartPage   = Element.Get_StartPage_Relative();
    var StartColumn = Element.Get_StartColumn();

    return ColumnIndex - StartColumn + (PageIndex - StartPage) * ColumnsCount;
};
CDocumentContent.prototype.private_GetElementPageIndexByXY = function(ElementPos, X, Y, PageIndex)
{
    return this.private_GetElementPageIndex(ElementPos, PageIndex, 0, 1);
};
CDocumentContent.prototype.Get_TopDocumentContent = function()
{
    var TopDocument = null;
    if (this.Parent && this.Parent.Get_TopDocumentContent)
        TopDocument = this.Parent.Get_TopDocumentContent();

    if (null !== TopDocument && undefined !== TopDocument)
        return TopDocument;

    return this;
};
CDocumentContent.prototype.Get_NumberingInfo = function(NumberingEngine, ParaId, NumPr)
{
    if (undefined === NumberingEngine || null === NumberingEngine)
        NumberingEngine = new CDocumentNumberingInfoEngine(ParaId, NumPr, this.Get_Numbering());

    for (var Index = 0; Index < this.Content.length; ++Index)
    {
        var Item = this.Content[Index];
        var ItemType = Item.Get_Type();

        if (type_Paragraph === ItemType)
            NumberingEngine.Check_Paragraph(Item);
        else if (type_Table === ItemType)
            Item.Get_NumberingInfo(NumberingEngine);

        if (true === NumberingEngine.Is_Found())
            break;
    }

    return NumberingEngine.Get_NumInfo();
};
CDocumentContent.prototype.private_RecalculateNumbering = function(Elements)
{
    if (true === AscCommon.g_oIdCounter.m_bLoad || true === AscCommon.g_oIdCounter.m_bRead || true === this.bPresentation)
        return;

    for (var Index = 0, Count = Elements.length; Index < Count; ++Index)
    {
        var Element = Elements[Index];
        if (type_Paragraph === Element.Get_Type())
            History.Add_RecalcNumPr(Element.Numbering_Get());
        else if (type_Paragraph === Element.Get_Type())
        {
            var ParaArray = [];
            Element.Get_AllParagraphs({All : true}, ParaArray);

            for (var ParaIndex = 0, ParasCount = ParaArray.length; ParaIndex < ParasCount; ++ParaIndex)
            {
                var Para = ParaArray[ParaIndex];
                History.Add_RecalcNumPr(Para.Numbering_Get());
            }
        }
    }
};
CDocumentContent.prototype.Set_ParaPropsForVerticalTextInCell = function(isVerticalText)
{
    for (var Pos = 0, Count = this.Content.length; Pos < Count; ++Pos)
    {
        var Element = this.Content[Pos];
        if (type_Paragraph === Element.Get_Type())
            Element.Set_ParaPropsForVerticalTextInCell(isVerticalText);
    }
};

function CDocumentContentStartState(DocContent)
{
    this.Content = [];
    for(var i = 0; i < DocContent.Content.length; ++i)
    {
        this.Content.push(DocContent.Content[i]);
    }
}

function CDocumentRecalculateObject()
{
    this.StartPage = 0;
    
    this.Pages    = [];
    this.Content  = [];
    this.ClipInfo = [];
}

CDocumentRecalculateObject.prototype = 
{
    Save : function(Doc)
    {
        this.StartPage = Doc.StartPage;        
        this.Pages     = Doc.Pages;
        this.ClipInfo  = Doc.ClipInfo;

        var Content = Doc.Content;
        var Count = Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index] = Content[Index].Save_RecalculateObject();
        }
    },
        
    Load : function(Doc)
    {
        Doc.StartPage = this.StartPage;
        Doc.Pages     = this.Pages;
        Doc.ClipInfo  = this.ClipInfo;
        
        var Count = Doc.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            Doc.Content[Index].Load_RecalculateObject( this.Content[Index] );
        }
    },
    
    Get_SummaryHeight : function()
    {
        var Height = 0;
        var PagesCount = this.Pages.length;
        for ( var Page = 0; Page < PagesCount; Page++ )
        {
            var Bounds = this.Get_PageBounds( Page );
            Height += Bounds.Bottom - Bounds.Top;
        }

        return Height;
    },
    
    Get_PageBounds : function(PageNum)
    {
        if ( this.Pages.length <= 0 )
            return { Top : 0, Left : 0, Right : 0, Bottom : 0 };

        if ( PageNum < 0 || PageNum > this.Pages.length )
            return this.Pages[0].Bounds;

        var Bounds = this.Pages[PageNum].Bounds;        

        return Bounds;
    },
    
    Get_DrawingFlowPos : function(FlowPos)
    {
        var Count = this.Content.length;
        for ( var Index = 0; Index < Count; Index++ )
        {
            this.Content[Index].Get_DrawingFlowPos( FlowPos );
        }
    }
        
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonWord'] = window['AscCommonWord'] || {};
window['AscCommonWord'].CDocumentContent = CDocumentContent;